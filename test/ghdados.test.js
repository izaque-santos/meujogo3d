'use strict';
/* Cofre no GitHub (com um GitHub falso em memória). Rode: npm test */
const assert = require('assert'), lib = require('../server/ghdados');
function falso(o) {
  const F = {}; o = o || {}; let n = 0; const res = function (st, b) { return { ok: st < 300, status: st, json: async function () { return b; }, text: async function () { return typeof b === 'string' ? b : JSON.stringify(b); } }; };
  const fetch = async function (url, i) {
    i = i || {}; if (o.down) return res(503, {}); if (!/Bearer tk/.test(i.headers.Authorization)) return res(401, {});
    const m = url.match(/repos\/eu\/dados(?:\/contents\/(.+))?$/); if (!m) return res(404, {}); if (!m[1]) return res(200, { private: o.publico ? false : true });
    if (i.method === 'PUT') { const b = JSON.parse(i.body), f = F[m[1]]; if (f && b.sha !== f.sha) return res(409, 'sha'); n++; F[m[1]] = { sha: 's' + n, c: Buffer.from(b.content, 'base64').toString() }; return res(200, { content: { sha: F[m[1]].sha } }); }
    if (!F[m[1]]) return res(404, {}); return /raw/.test(i.headers.Accept) ? res(200, F[m[1]].c) : res(200, { sha: F[m[1]].sha });
  }; return { fetch: fetch, F: F, o: o };
}
const ENV = { DADOS_TOKEN: 'tk', DADOS_REPO: 'eu/dados' };
(async function () {
  ['santos/mundo-3d-dados', 'mundo-3d-dados', ''].forEach(function (r) { assert.ok(/izaque-santos\/mundo-3d-dados/.test(lib.create({ DADOS_TOKEN: 'tk', DADOS_REPO: r }).status().onde), 'nome cortado usa o padrão: ' + r); });
  assert.strictEqual(lib.create({}).enabled, false); const g = falso();
  const a = lib.create(ENV, { fetch: g.fetch, minGap: 0 }); assert.strictEqual((await a.load()).status, 'new');
  a.schedule(function () { return '{"accounts":{"1":{"email":"a@t"}}}'; }); assert.ok(await a.flushNow()); assert.ok(/a@t/.test(g.F['contas.json'].c)); assert.ok(Object.keys(g.F).some(function (k) { return /^copias\//.test(k); }), 'cópia do dia');
  a.schedule(function () { return '{"accounts":{"1":{"email":"b@t"}}}'; }); assert.ok(await a.flushNow(), 'atualiza o mesmo arquivo');
  const b = lib.create(ENV, { fetch: g.fetch, minGap: 0 }), r = await b.load(); assert.strictEqual(r.status, 'ok', 'depois de atualizar o jogo, as contas voltam'); assert.strictEqual(r.data.accounts['1'].email, 'b@t');
  // tudo que o jogador comprou volta depois de atualizar
  const accs = require('../server/accounts'), A = accs.create({}), r1 = A.register({ name: 'Rui', email: 'rui@t.com', password: 'senha123' }), id = A.bySession(r1.session).id, sv = A.saveOf(id); sv.items = { galinha: 1, rPonei: 1, cNeo: 1, vFusca: 1, mergulhador: 1, oPapa: 1 }; sv.gear = { pet: 'galinha', mount: 'cNeo' }; const qq = A.prog(id); qq.sec = 7200; qq.msec = 300; qq.gems = 55; qq.fishN = 12; qq.album = { atum: 3 }; qq.clan = 'TOP'; qq.deco = [{ id: 'd_cama' }]; A.bankAdd(id, 700, 't'); A.meta('clans', { TOP: { n: 'Top', tag: 'TOP', lead: 'Rui', m: ['Rui'] } });
  const g2 = falso(), up = lib.create(ENV, { fetch: g2.fetch, minGap: 0 }); await up.load(); up.schedule(A.exportJson); await up.flushNow();
  const B = accs.create({}), dn = lib.create(ENV, { fetch: g2.fetch, minGap: 0 }), rr = await dn.load(); B.importData(rr.data); const l = B.login({ email: 'rui@t.com', password: 'senha123' }), i2 = B.bySession(l.session).id;
  assert.deepStrictEqual(l.account.save.items, sv.items, 'pets, montarias, carros e roupas'); assert.strictEqual(l.account.save.gear.mount, 'cNeo'); const q2 = B.prog(i2); assert.strictEqual(q2.sec, 7200, 'horas'); assert.strictEqual(q2.gems, 55); assert.strictEqual(q2.fishN, 12, 'peixes'); assert.deepStrictEqual(q2.deco, qq.deco, 'móveis'); assert.strictEqual(B.bankOf(i2), 700); assert.strictEqual(B.meta('clans').TOP.lead, 'Rui', 'clã'); assert.ok(B.ranking().some(function (x) { return x.n === 'Rui' && x.sec === 7200; }), 'rank');
  const p = falso({ publico: 1 }), c = lib.create(ENV, { fetch: p.fetch }); assert.strictEqual((await c.load()).status, 'error', 'repositório público é recusado'); c.schedule(function () { return 'x'; }); assert.strictEqual(await c.flushNow(), false); assert.deepStrictEqual(p.F, {}, 'nada enviado para repositório público');
  const d = falso({ down: 1 }), e = lib.create(ENV, { fetch: d.fetch }); assert.strictEqual((await e.load()).status, 'error'); e.schedule(function () { return 'x'; }); assert.strictEqual(await e.flushNow(), false, 'fora do ar: não sobrescreve');
  console.log('TESTES DO COFRE NO GITHUB PASSARAM');
})().catch(function (x) { console.error(x); process.exit(1); });
