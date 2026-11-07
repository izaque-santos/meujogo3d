'use strict';
/* Cofre no Google Drive (com um Drive falso em memória). Rode: npm test */
const assert = require('assert');
const cloudLib = require('../server/cloud');
const accountsLib = require('../server/accounts');

function fakeDrive(opts) {                                            // imita o Google: token, busca, download, criação e atualização de arquivos
  const files = {}; let n = 0; opts = opts || {};
  function res(status, body) { return { ok: status < 300, status: status, json: async function () { return typeof body === 'string' ? JSON.parse(body) : body; }, text: async function () { return typeof body === 'string' ? body : JSON.stringify(body); } }; }
  const fetch = async function (url, init) {
    init = init || {};
    if (opts.down) return res(503, { error: 'fora do ar' });
    if (url.indexOf('oauth2.googleapis.com/token') >= 0) return res(200, { access_token: 'tok', expires_in: 3600 });
    if (!/Bearer tok/.test((init.headers || {}).Authorization || '')) return res(401, { error: 'sem token' });
    let m;
    if ((m = url.match(/\/drive\/v3\/files\?q=([^&]+)/))) { const name = decodeURIComponent(m[1]).match(/name='(.+?)'/)[1]; const f = Object.keys(files).filter(function (id) { return files[id].name === name; }); return res(200, { files: f.map(function (id) { return { id: id }; }) }); }
    if ((m = url.match(/\/drive\/v3\/files\/([^?]+)\?alt=media/))) return res(200, files[m[1]].content);
    if (url.indexOf('uploadType=multipart') >= 0) { const parts = init.body.split(/--m3d\d+/); const meta = JSON.parse(parts[1].split('\r\n\r\n')[1]); const content = parts[2].split('\r\n\r\n')[1].replace(/\r\n$/, ''); const id = 'f' + (++n); files[id] = { name: meta.name, content: content }; return res(200, { id: id }); }
    if ((m = url.match(/upload\/drive\/v3\/files\/([^?]+)\?uploadType=media/))) { files[m[1]].content = init.body; return res(200, {}); }
    return res(404, {});
  };
  return { fetch: fetch, files: files, opts: opts };
}
const ENV = { GDRIVE_CLIENT_ID: 'id', GDRIVE_CLIENT_SECRET: 'sec', GDRIVE_REFRESH_TOKEN: 'ref' };

(async function () {
  assert.strictEqual(cloudLib.create({}).enabled, false, 'sem variáveis: desligado');
  const drive = fakeDrive();

  // 1) primeira vez: arquivo não existe -> cria com as contas
  const c1 = cloudLib.create(ENV, { fetch: drive.fetch, minGap: 0 });
  const a1 = accountsLib.create({ onSave: function (get) { c1.schedule(get); } });
  assert.strictEqual((await c1.load()).status, 'new');
  const r = a1.register({ name: 'Ana', email: 'ana@t.com', password: 'senha123' });
  a1.saveData(r.session, { save: { coins: 333, pets: ['coruja'] } }); a1.flush();
  assert.ok(await c1.flushNow(), 'enviou ao Drive');
  const main = Object.keys(drive.files).find(function (id) { return drive.files[id].name === 'mundo3d-contas.json'; });
  assert.ok(main && /"coins":333/.test(drive.files[main].content), 'arquivo de contas no Drive');
  assert.ok(Object.keys(drive.files).some(function (id) { return /backup-\d{4}-\d\d-\d\d\.json$/.test(drive.files[id].name); }), 'cópia extra do dia');

  // 2) "atualização no Render": servidor novo e vazio baixa tudo do Drive
  const c2 = cloudLib.create(ENV, { fetch: drive.fetch, minGap: 0 });
  const a2 = accountsLib.create({ onSave: function (get) { c2.schedule(get); } });
  const ld = await c2.load(); assert.strictEqual(ld.status, 'ok');
  assert.strictEqual(a2.importData(ld.data), 1);
  const lg = a2.login({ email: 'ana@t.com', password: 'senha123' });
  assert.ok(lg.ok && lg.account.save.coins === 333 && lg.account.save.pets[0] === 'coruja', 'conta e progresso voltaram do Drive');
  a2.saveData(lg.session, { save: { marca: 800 } }); a2.flush(); await c2.flushNow();
  assert.ok(/"marca":800/.test(drive.files[main].content) && /"coins":333/.test(drive.files[main].content), 'mudança enviada para o mesmo arquivo');

  // 3) Drive fora do ar ao ligar: NUNCA sobrescreve com vazio
  drive.opts.down = true;
  const c3 = cloudLib.create(ENV, { fetch: drive.fetch, minGap: 0 });
  const a3 = accountsLib.create({ onSave: function (get) { c3.schedule(get); } });
  assert.strictEqual((await c3.load()).status, 'error');
  a3.register({ name: 'Bob', email: 'bob@t.com', password: 'senha123' }); a3.flush();
  drive.opts.down = false;
  assert.strictEqual(await c3.flushNow(), false, 'não enviou nada');
  assert.ok(/"marca":800/.test(drive.files[main].content) && !/bob@t.com/.test(drive.files[main].content), 'contas do Drive intactas');
  // ...e quando o Drive volta, junta: as contas do Drive + a conta nova criada nesse meio-tempo
  const back = await c3.load(); assert.strictEqual(a3.importData(back.data), 2, 'Ana (do Drive) + Bob (novo)');
  a3.touch(); a3.flush(); await c3.flushNow();
  assert.ok(/ana@t.com/.test(drive.files[main].content) && /bob@t.com/.test(drive.files[main].content));

  assert.ok(/drive\.file/.test(cloudLib.setupUrl(ENV, 'https://x.onrender.com', 'k')), 'pede só o acesso aos arquivos do próprio jogo');
  console.log('TESTES DO GOOGLE DRIVE PASSARAM');
})().catch(function (e) { console.error(e); process.exit(1); });
