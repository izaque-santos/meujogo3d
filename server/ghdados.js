'use strict';
/* Contas guardadas num repositório PRIVADO do GitHub do dono, fora do Render.
   Ao ligar, o servidor baixa contas.json. Cada mudança é enviada a cada 2 minutos, em até 10 s depois de uma compra, e ao desligar. Uma cópia extra por dia fica em copias/.
   Segurança: o repositório precisa ser privado (o arquivo tem e-mails e senhas protegidas); se for público, nada é enviado.
   Se o download falhar ao ligar, nada é enviado: nunca troca as contas por um arquivo vazio.
   Variáveis no Render: DADOS_TOKEN (token do GitHub) (DADOS_REPO é opcional: sem ela, usa o repositório padrão). */
const API = 'https://api.github.com/repos/';
const PADRAO = 'izaque-santos/mundo-3d-dados';                     // se DADOS_REPO faltar ou vier cortado, usa este

function create(env, opts) {
  env = env || process.env; opts = opts || {};
  const doFetch = opts.fetch || global.fetch, REPO0 = String(env.DADOS_REPO || '').trim(), REPO = !REPO0 || /(^|\/)mundo-3d-dados$/.test(REPO0) ? PADRAO : REPO0, TOKEN = String(env.DADOS_TOKEN || '').trim(), FILE = 'contas.json';
  const enabled = !!(REPO && TOKEN), MIN_GAP = opts.minGap != null ? opts.minGap : 120000;
  let sha = null, ready = false, lastUp = 0, lastErr = '', pending = null, timer = null, busy = false, voo = null, lastDaily = '';
  function hd(x) { return Object.assign({ Authorization: 'Bearer ' + TOKEN, Accept: 'application/vnd.github+json', 'User-Agent': 'mundo-3d', 'X-GitHub-Api-Version': '2022-11-28' }, x || {}); }
  async function get(path, x) { return doFetch(API + REPO + path, { headers: hd(x) }); }
  async function put(path, content, oldSha) {
    const body = { message: 'contas ' + new Date().toISOString(), content: Buffer.from(content).toString('base64') }; if (oldSha) body.sha = oldSha;
    const r = await doFetch(API + REPO + '/contents/' + path, { method: 'PUT', headers: hd({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
    if (!r.ok) { const t = await r.text().catch(function () { return ''; }); const e = new Error('github ' + r.status + ': ' + t.slice(0, 160)); e.status = r.status; throw e; }
    return (await r.json()).content.sha;
  }
  async function shaDe(path) { const r = await get('/contents/' + path); if (r.status === 404) return null; if (!r.ok) throw new Error('github ' + r.status); return (await r.json()).sha; }
  async function load() {
    if (!enabled) return { status: 'off' };
    try {
      const rp = await get(''); if (!rp.ok) throw new Error('não abri o repositório (' + rp.status + '): confira DADOS_REPO e DADOS_TOKEN');
      if (!(await rp.json()).private) throw new Error('o repositório precisa ser PRIVADO');
      const s = await shaDe(FILE); if (!s) { ready = true; lastErr = ''; return { status: 'new' } }
      const r = await get('/contents/' + FILE, { Accept: 'application/vnd.github.raw+json' }); if (!r.ok) throw new Error('github ' + r.status);
      const data = JSON.parse(await r.text()); sha = s; ready = true; lastErr = ''; return { status: 'ok', data: data };
    } catch (e) { lastErr = e.message; return { status: 'error', error: e.message }; }
  }
  async function upload(content) {
    try { sha = await put(FILE, content, sha); } catch (e) { if (e.status !== 409 && e.status !== 422) throw e; sha = await shaDe(FILE); sha = await put(FILE, content, sha); }
    const day = new Date().toISOString().slice(0, 10); if (day !== lastDaily) { lastDaily = day; const f = 'copias/' + day + '.json'; if (!(await shaDe(f))) await put(f, content); }
  }
  async function flushNow() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (voo) await voo; if (!enabled || !ready || !pending) return false;
    busy = true; const content = pending(); pending = null; let solta; voo = new Promise(function (ok) { solta = ok; });
    try { await upload(content); lastUp = Date.now(); lastErr = ''; return true; }
    catch (e) { lastErr = e.message; console.error('GitHub: falha ao salvar contas —', e.message); if (!pending) pending = function () { return content; }; timer = setTimeout(flushNow, 60000); if (timer.unref) timer.unref(); return false; }
    finally { busy = false; voo = null; solta(); }
  }
  function schedule(getContent) {
    if (!enabled || !ready) return; pending = getContent; if (timer) return;
    timer = setTimeout(flushNow, Math.max(3000, MIN_GAP - (Date.now() - lastUp))); if (timer.unref) timer.unref();
  }
  function agora() { if (!enabled || !ready) return; if (timer) clearTimeout(timer); timer = setTimeout(flushNow, 10000); if (timer.unref) timer.unref(); }
  function status() { return { enabled: enabled, ready: ready, onde: 'GitHub ' + REPO, lastSave: lastUp ? new Date(lastUp).toISOString() : null, error: lastErr || null }; }
  return { enabled: enabled, load: load, schedule: schedule, flushNow: flushNow, agora: agora, status: status };
}
module.exports = { create: create };
