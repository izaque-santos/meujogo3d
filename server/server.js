'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const { attach } = require('./world');
const accountsLib = require('./accounts');
const cloudLib = require('./cloud');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.PORT) || 3000;
if (!process.env.PHONE_SECRET) {                                   // chips: assinatura estável entre reinícios (em hospedagem sem disco, defina PHONE_SECRET)
  const sf = path.join(ROOT, '.phone-secret');
  try { process.env.PHONE_SECRET = fs.readFileSync(sf, 'utf8').trim(); } catch (e) {}
  if (!process.env.PHONE_SECRET) {
    process.env.PHONE_SECRET = require('crypto').randomBytes(24).toString('hex');
    try { fs.writeFileSync(sf, process.env.PHONE_SECRET, { mode: 0o600 }); } catch (e) { console.warn('Aviso: defina PHONE_SECRET, senão os chips deixam de valer quando o servidor reiniciar.'); }
  }
}
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const gdrive = cloudLib.create(process.env), cloud = gdrive.enabled ? gdrive : require('./ghdados').create(process.env);                          // Google Drive do dono (se configurado): guarda todas as contas
const accounts = accountsLib.create({ dir: DATA_DIR, onSave: function (get) { cloud.schedule(get); } }); accounts.statusDados = cloud.status; accounts.compra = function () { accounts.flush(); if (cloud.agora) cloud.agora(); };

/* ===== página de configuração do Google Drive (abre pelo celular) ===== */
function page(res, title, html) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + title + '</title>' +
    '<body style="font:16px system-ui,sans-serif;background:#0b0a1a;color:#f3f0ff;padding:18px;max-width:640px;margin:auto;line-height:1.5"><h2>' + title + '</h2>' + html + '</body>');
}
function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function baseUrl(req) { return process.env.PUBLIC_URL || ((req.headers['x-forwarded-proto'] || 'http').split(',')[0] + '://' + req.headers.host); }
function setupDrive(req, res, url, q) {
  const env = process.env, key = env.SETUP_KEY;
  if (!key || q.get('key') !== key && q.get('state') !== key) return page(res, 'Google Drive', '<p>Acesso negado. Crie a variável <b>SETUP_KEY</b> no Render e abra <code>/setup-drive?key=SUA_SETUP_KEY</code>.</p>');
  if (url === '/drive-status') return page(res, 'Google Drive — situação', '<pre style="white-space:pre-wrap">' + esc(JSON.stringify(Object.assign(cloud.status(), { contas: accounts.count() }), null, 2)) + '</pre>');
  if (!env.GDRIVE_CLIENT_ID || !env.GDRIVE_CLIENT_SECRET) return page(res, 'Google Drive', '<p>Faltam as variáveis <b>GDRIVE_CLIENT_ID</b> e <b>GDRIVE_CLIENT_SECRET</b> no Render.</p>');
  const base = baseUrl(req);
  if (url === '/setup-drive') { res.writeHead(302, { Location: cloudLib.setupUrl(env, base, key) }); res.end(); return; }
  cloudLib.exchangeCode(env, base, q.get('code') || '').then(function (j) {
    if (!j.refresh_token) return page(res, 'Google Drive', '<p>Não veio o código de acesso. Erro: ' + esc(j.error_description || j.error || 'desconhecido') + '</p><p>Confira o endereço de retorno no Google Cloud: <code>' + esc(base) + '/setup-drive/callback</code> e tente de novo.</p>');
    page(res, '✅ Google Drive autorizado', '<p>Copie o código abaixo e cole no Render, em <b>Environment</b>, numa variável chamada <b>GDRIVE_REFRESH_TOKEN</b>. Depois salve (o jogo reinicia sozinho).</p>' +
      '<textarea readonly onclick="this.select()" style="width:100%;height:120px;font:14px monospace;background:#1b1146;color:#fff;border-radius:10px;padding:10px">' + esc(j.refresh_token) + '</textarea>' +
      '<p>Para conferir depois: <code>/drive-status?key=SUA_SETUP_KEY</code>. Não mostre esse código para ninguém.</p>');
  }).catch(function (e) { page(res, 'Google Drive', '<p>Erro: ' + esc(e.message) + '</p>'); });
}
const STATIC = {
  '/': ['public/index.html', 'text/html; charset=utf-8'],
  '/index.html': ['public/index.html', 'text/html; charset=utf-8'],
  '/style.css': ['public/style.css', 'text/css; charset=utf-8'],
  '/config.js': ['public/config.js', 'application/javascript; charset=utf-8'],
  '/app.js': ['public/app.js', 'application/javascript; charset=utf-8'],
  '/avatar.js': ['public/avatar.js', 'application/javascript; charset=utf-8'],
  '/yacht.js': ['public/yacht.js', 'application/javascript; charset=utf-8'],
  '/island.js': ['public/island.js', 'application/javascript; charset=utf-8'],
  '/park.js': ['public/park.js', 'application/javascript; charset=utf-8'],
  '/petshop.js': ['public/petshop.js', 'application/javascript; charset=utf-8'],
  '/beach.js': ['public/beach.js', 'application/javascript; charset=utf-8'],
  '/jail.js': ['public/jail.js', 'application/javascript; charset=utf-8'],
  '/market.js': ['public/market.js', 'application/javascript; charset=utf-8'],
  '/zoo.js': ['public/zoo.js', 'application/javascript; charset=utf-8'],
  '/places.js': ['public/places.js', 'application/javascript; charset=utf-8'],
  '/arena.js': ['public/arena.js', 'application/javascript; charset=utf-8'],
  '/pvp.js': ['public/pvp.js', 'application/javascript; charset=utf-8'],
  '/extras.js': ['public/extras.js', 'application/javascript; charset=utf-8'],
  '/trem.js': ['public/trem.js', 'application/javascript; charset=utf-8'],
  '/sereia.js': ['public/sereia.js', 'application/javascript; charset=utf-8'],
  '/empregos.js': ['public/empregos.js', 'application/javascript; charset=utf-8'],
  '/nessie.js': ['public/nessie.js', 'application/javascript; charset=utf-8'],
  '/marvida.js': ['public/marvida.js', 'application/javascript; charset=utf-8'],
  '/minimapa.js': ['public/minimapa.js', 'application/javascript; charset=utf-8'],
  '/ombro.js': ['public/ombro.js', 'application/javascript; charset=utf-8'],
  '/job-model.js': ['public/job-model.js', 'application/javascript; charset=utf-8'],
  '/novos.js': ['public/novos.js', 'application/javascript; charset=utf-8'],
  '/mais.js': ['public/mais.js', 'application/javascript; charset=utf-8'],
  '/guarda.js': ['public/guarda.js', 'application/javascript; charset=utf-8'],
  '/shared/looks.js': ['shared/looks.js', 'application/javascript; charset=utf-8'],
  '/shared/levels.js': ['shared/levels.js', 'application/javascript; charset=utf-8'],
  '/shared/world.js': ['shared/world.js', 'application/javascript; charset=utf-8'],
  '/vendor/three.min.js': ['public/vendor/three.min.js', 'application/javascript; charset=utf-8'],
  '/vendor/fflate.min.js': ['public/vendor/fflate.min.js', 'application/javascript; charset=utf-8'],
  '/vendor/FBXLoader.js': ['public/vendor/FBXLoader.js', 'application/javascript; charset=utf-8'],
  '/vendor/GLTFLoader.js': ['public/vendor/GLTFLoader.js', 'application/javascript; charset=utf-8'],
  '/cidade.js': ['public/cidade.js', 'application/javascript; charset=utf-8'],
  '/JogInCircle.fbx': ['public/JogInCircle.fbx', 'application/octet-stream']
};

const API = { '/api/register': 'register', '/api/restore': 'restore', '/api/login': 'login', '/api/reset': 'reset', '/api/me': 'me', '/api/save': 'save', '/api/logout': 'logout' };
function api(req, res, url) {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Cache-Control': 'no-store' };
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); res.end(); return; }
  if (req.method !== 'POST') { res.writeHead(405, cors); res.end(); return; }
  let size = 0, chunks = [];
  req.on('data', function (c) { size += c.length; if (size > 320 * 1024) { res.writeHead(413, cors); res.end(); req.destroy(); } else chunks.push(c); });
  req.on('end', function () {
    let body = {}; try { body = JSON.parse(Buffer.concat(chunks).toString() || '{}'); } catch (e) {}
    const ip = String((req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '');
    const auth = String(req.headers.authorization || '').replace(/^Bearer /, '');
    const op = API[url]; let out;
    try {
      if (op === 'register') out = accounts.register(body, ip);
      else if (op === 'reset') out = accounts.resetPassword(body, ip);
      else if (op === 'restore') out = accounts.restore(body, ip);
      else if (op === 'login') out = accounts.login(body, ip);
      else if (op === 'me') out = accounts.me(auth);
      else if (op === 'save') out = accounts.saveData(auth, body);
      else out = accounts.logout(auth);
    } catch (e) { console.error('api', op, e); out = { error: { code: 'server', msg: 'Erro no servidor.' } }; }
    res.writeHead(out.error ? 400 : 200, Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, cors));
    res.end(JSON.stringify(out));
  });
}

const server = http.createServer(function (req, res) {
  const url = req.url.split('?')[0];
  if (url === '/setup-drive' || url === '/setup-drive/callback' || url === '/drive-status') { setupDrive(req, res, url, new URLSearchParams(req.url.split('?')[1] || '')); return; }
  if (API[url]) { api(req, res, url); return; }
  if (url === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('ok'); return; }
  let entry = STATIC[url], file, type;
  if (entry) { file = path.join(ROOT, entry[0]); type = entry[1]; }
  else {
    const h = url.match(/^\/hud\/([a-z0-9]+)\.webp$/);             // desenhos do HUD
    if (h) { file = path.join(ROOT, 'public/hud', h[1] + '.webp'); type = 'image/webp'; }
    const a = url.match(/^\/city-assets\/([a-zA-Z0-9_./-]+)$/);
    if (a && !a[1].includes('..')) { file = path.join(ROOT, 'public/city-assets', a[1]); type = a[1].endsWith('.glb') ? 'model/gltf-binary' : 'image/png'; }
  }
  if (!file) { res.writeHead(404); res.end('404'); return; }
  fs.readFile(file, function (e, data) {
    if (e) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server: server, path: '/ws', maxPayload: 16 * 1024 });
attach(wss, process.env, accounts);

/* Ao ligar: primeiro busca as contas no Google Drive (se configurado), depois abre o jogo. */
async function start() {
  if (cloud.enabled) {
    let r = null;
    for (let i = 1; i <= 5; i++) {
      r = await cloud.load();
      if (r.status !== 'error') break;
      console.error('Google Drive: tentativa ' + i + ' falhou —', r.error); await new Promise(function (ok) { setTimeout(ok, 3000); });
    }
    if (r.status === 'ok') console.log('Google Drive: ' + accounts.importData(r.data) + ' conta(s) carregadas.');
    else if (r.status === 'new') { console.log('Google Drive: primeira vez — vou criar o arquivo de contas no seu Drive.'); accounts.touch(); }
    else { console.error('Google Drive: não consegui baixar as contas. Por segurança, NÃO vou enviar nada até conseguir.'); retryLoad(); }
  } else console.warn('Aviso: Google Drive não configurado — no Render grátis as contas somem a cada atualização (veja README.md).');
  server.listen(PORT, function () {
    console.log('Mundo 3D no ar: http://localhost:' + PORT);
    console.log('Contas: ' + accounts.count() + (cloud.enabled ? ' (guardadas fora do Render)' : ' (em ' + DATA_DIR + ')'));
  });
}
function retryLoad() {                                               // Drive fora do ar ao ligar: tenta de novo a cada minuto e junta as contas
  setTimeout(async function () { const r = await cloud.load(); if (r.status === 'ok') { console.log('Google Drive voltou: ' + accounts.importData(r.data) + ' conta(s).'); accounts.touch(); } else if (r.status === 'new') accounts.touch(); else retryLoad(); }, 60000).unref();
}
start();
['SIGTERM', 'SIGINT'].forEach(function (sg) { process.on(sg, function () {      // desligando: salva no disco e envia ao Drive antes de sair
  accounts.flush(); const t = setTimeout(function () { process.exit(0); }, 20000);
  cloud.flushNow().finally(function () { clearTimeout(t); process.exit(0); });
}); });
