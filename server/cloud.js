'use strict';
/* GOOGLE DRIVE DO DONO como "cofre" das contas.
   O Render grátis apaga os arquivos do servidor a cada atualização/reinício; aqui as contas ficam num arquivo no SEU Google Drive:
   - ao ligar, o servidor baixa o arquivo (mundo3d-contas.json) e carrega as contas;
   - cada mudança é enviada alguns segundos depois (no máximo a cada ~15 s);
   - uma cópia extra por dia (mundo3d-contas-backup-AAAA-MM-DD.json) para poder voltar atrás.
   Segurança: se o download falhar ao ligar, NADA é enviado (nunca sobrescreve suas contas com um arquivo vazio).
   Variáveis no Render: GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN (a página /setup-drive gera esta última). */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const SCOPE = 'https://www.googleapis.com/auth/drive.file';   // só enxerga os arquivos que o próprio jogo criou no seu Drive

function create(env, opts) {
  env = env || process.env; opts = opts || {};
  const doFetch = opts.fetch || global.fetch;
  const FILE = env.GDRIVE_FILE || 'mundo3d-contas.json';
  const enabled = !!(env.GDRIVE_CLIENT_ID && env.GDRIVE_CLIENT_SECRET && env.GDRIVE_REFRESH_TOKEN);
  const MIN_GAP = opts.minGap != null ? opts.minGap : 15000;
  let tok = null, tokExp = 0, fileId = null, ready = false, lastUp = 0, lastErr = '', pending = null, timer = null, busy = false, lastDaily = '';

  async function token() {
    if (tok && Date.now() < tokExp - 60000) return tok;
    const body = new URLSearchParams({ client_id: env.GDRIVE_CLIENT_ID, client_secret: env.GDRIVE_CLIENT_SECRET, refresh_token: env.GDRIVE_REFRESH_TOKEN, grant_type: 'refresh_token' });
    const r = await doFetch(TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    const j = await r.json().catch(function () { return {}; });
    if (!r.ok || !j.access_token) throw new Error('token: ' + (j.error_description || j.error || r.status));
    tok = j.access_token; tokExp = Date.now() + (j.expires_in || 3600) * 1000; return tok;
  }
  async function call(url, init) {
    init = init || {}; init.headers = Object.assign({ Authorization: 'Bearer ' + await token() }, init.headers || {});
    const r = await doFetch(url, init);
    if (!r.ok) { const t = await r.text().catch(function () { return ''; }); throw new Error('drive ' + r.status + ': ' + t.slice(0, 200)); }
    return r;
  }
  async function find(name) {
    const q = encodeURIComponent("name='" + name.replace(/'/g, "\\'") + "' and trashed=false");
    const r = await call(FILES_URL + '?q=' + q + '&spaces=drive&fields=files(id,modifiedTime)&orderBy=modifiedTime desc');
    const j = await r.json(); return j.files && j.files[0] ? j.files[0].id : null;
  }
  async function createFile(name, content) {
    const b = 'm3d' + Date.now();
    const body = '--' + b + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify({ name: name, mimeType: 'application/json' }) +
      '\r\n--' + b + '\r\nContent-Type: application/json\r\n\r\n' + content + '\r\n--' + b + '--';
    const r = await call(UPLOAD_URL + '?uploadType=multipart&fields=id', { method: 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + b }, body: body });
    return (await r.json()).id;
  }

  /* Ao ligar: baixa as contas. status 'ok' (veio do Drive), 'new' (ainda não existe: primeira vez), 'off' (sem configurar) ou 'error'. */
  async function load() {
    if (!enabled) return { status: 'off' };
    try {
      const id = await find(FILE);
      if (!id) { ready = true; return { status: 'new' }; }
      const r = await call(FILES_URL + '/' + id + '?alt=media');
      const data = JSON.parse(await r.text());
      fileId = id; ready = true; lastErr = ''; return { status: 'ok', data: data };
    } catch (e) { lastErr = e.message; return { status: 'error', error: e.message }; }
  }

  async function upload(content) {
    if (fileId) await call(UPLOAD_URL + '/' + fileId + '?uploadType=media', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: content });
    else fileId = await createFile(FILE, content);
    const day = new Date().toISOString().slice(0, 10);                          // cópia extra, uma por dia
    if (day !== lastDaily) { lastDaily = day; const bn = FILE.replace(/\.json$/, '') + '-backup-' + day + '.json'; if (!(await find(bn))) await createFile(bn, content); }
  }
  async function flushNow() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (!enabled || !ready || !pending || busy) return false;
    busy = true; const content = pending(); pending = null;
    try { await upload(content); lastUp = Date.now(); lastErr = ''; return true; }
    catch (e) { lastErr = e.message; console.error('Google Drive: falha ao salvar contas —', e.message); if (!pending) pending = function () { return content; }; timer = setTimeout(flushNow, 30000); if (timer.unref) timer.unref(); return false; }
    finally { busy = false; }
  }
  /* Chamado a cada mudança nas contas: guarda a função que gera o JSON e envia depois de alguns segundos. */
  function schedule(getContent) {
    if (!enabled || !ready) return;                                             // sem download bem-sucedido: não envia nada
    pending = getContent; if (timer) return;
    timer = setTimeout(flushNow, Math.max(3000, MIN_GAP - (Date.now() - lastUp))); if (timer.unref) timer.unref();
  }
  function status() {
    const o = { enabled: enabled, ready: ready, file: FILE, lastSave: lastUp ? new Date(lastUp).toISOString() : null, error: lastErr || null };
    if (/invalid_grant|expired|revoked/i.test(lastErr)) o.dica = 'A autorização do Google venceu. No Google Cloud, em "Tela de consentimento OAuth" (público-alvo), toque em PUBLICAR APP (Em produção). Depois abra /setup-drive?key=SUA_SETUP_KEY de novo e troque o GDRIVE_REFRESH_TOKEN no Render.';
    else if (!enabled) o.dica = 'Faltam GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET ou GDRIVE_REFRESH_TOKEN no Render (Environment).';
    return o;
  }
  return { enabled: enabled, load: load, schedule: schedule, flushNow: flushNow, status: status };
}

/* Página de configuração (abre pelo celular): /setup-drive?key=SUA_CHAVE → login no Google → mostra o GDRIVE_REFRESH_TOKEN para colar no Render. */
function setupUrl(env, base, key) {
  const q = new URLSearchParams({ client_id: env.GDRIVE_CLIENT_ID, redirect_uri: base + '/setup-drive/callback', response_type: 'code', scope: SCOPE, access_type: 'offline', prompt: 'consent', state: key });
  return 'https://accounts.google.com/o/oauth2/v2/auth?' + q.toString();
}
async function exchangeCode(env, base, code, doFetch) {
  doFetch = doFetch || global.fetch;
  const body = new URLSearchParams({ code: code, client_id: env.GDRIVE_CLIENT_ID, client_secret: env.GDRIVE_CLIENT_SECRET, redirect_uri: base + '/setup-drive/callback', grant_type: 'authorization_code' });
  const r = await doFetch(TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
  return r.json();
}

module.exports = { create: create, setupUrl: setupUrl, exchangeCode: exchangeCode, SCOPE: SCOPE };
