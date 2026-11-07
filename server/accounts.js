'use strict';
/* Contas: cadastro, login e progresso (moedas, acessórios, pets...) guardados no servidor.
   Arquivo: DATA_DIR/accounts.json (padrão: ./data). Em hospedagem sem disco permanente, aponte DATA_DIR
   para um disco persistente — senão as contas somem quando o servidor reinicia. */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const START_COINS = 500, ADMIN_NAME = 'ADM-ISAC';   // o dono do servidor é só esta conta
const COFRE_MAX = 200000;              // tamanho máximo da cópia do progresso guardada no celular
const SAVE_MAX = 40000;                 // bytes do progresso de cada conta
const SESSIONS_MAX = 6;                 // aparelhos logados ao mesmo tempo por conta
const EMAIL_RE = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[^\s@<>]{2,24}$/;

function normName(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\s_\-.]/g, ''); }
function baseName(s) { return normName(s).replace(/[\u{1F1E6}-\u{1F1FF}\uD800-\uDFFF]/gu, ''); }   // nome sem a bandeira: a conta do dono vale com ou sem ela
const OWNER_KEY = baseName(ADMIN_NAME);
function cleanName(s) { return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 18); }
function sha(s) { return crypto.createHash('sha256').update(s).digest('hex'); }
function hashPass(pw, salt) { return crypto.scryptSync(pw, salt, 32, { N: 16384 }).toString('hex'); }
function safeEq(a, b) { a = Buffer.from(String(a)); b = Buffer.from(String(b)); return a.length === b.length && crypto.timingSafeEqual(a, b); }
function fail(code, msg) { return { error: { code: code, msg: msg } }; }

function create(opts) {
  opts = opts || {};
  const dir = opts.dir || null;                       // null = só em memória (testes)
  const file = dir ? path.join(dir, 'accounts.json') : null;
  let db = { accounts: {} };
  if (file) {
    try { fs.mkdirSync(dir, { recursive: true }); } catch (e) {}
    try { db = JSON.parse(fs.readFileSync(file, 'utf8')); if (!db.accounts) db.accounts = {}; } catch (e) {}
  }
  const byEmail = new Map(), byName = new Map(), bySess = new Map(), fails = new Map();
  function index() {
    byEmail.clear(); byName.clear(); bySess.clear();
    Object.keys(db.accounts).forEach(function (id) {
      const a = db.accounts[id], ownerEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase(); a.admin = baseName(a.name) === OWNER_KEY && (!ownerEmail || a.email === ownerEmail); byEmail.set(a.email, a); byName.set(normName(a.name), a);   // dono é só o CRIADOR-ISAC; as outras contas perdem o posto
      (a.sessions || []).forEach(function (h) { bySess.set(h, a); });
    });
  }
  index();

  let timer = null;
  function exportJson() { return JSON.stringify(db); }
  function flush() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (file) { try { const tmp = file + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(db), { mode: 0o600 }); fs.renameSync(tmp, file); } catch (e) { console.error('Erro ao gravar contas:', e.message); } }
    if (opts.onSave) opts.onSave(exportJson);                       // avisa o cofre (Google Drive) que algo mudou
  }
  function dirty() { if ((!file && !opts.onSave) || timer) return; timer = setTimeout(flush, 400); if (timer.unref) timer.unref(); }
  /* Carrega as contas vindas do Google Drive. O Drive manda; contas criadas aqui enquanto o Drive estava fora são mantidas. */
  function importData(data) {
    if (!data || !data.accounts || typeof data.accounts !== 'object') return 0;
    const merged = Object.assign({}, data.accounts), emails = new Set();
    Object.keys(merged).forEach(function (id) { emails.add(merged[id].email); });
    Object.keys(db.accounts).forEach(function (id) { const a = db.accounts[id]; if (!merged[id] && !emails.has(a.email)) merged[id] = a; });
    db = { accounts: merged, shops: data.shops || db.shops || {}, meta: data.meta || db.meta || {} }; index(); return Object.keys(merged).length;
  }

  function tooMany(key) { const f = fails.get(key); return !!(f && f.n >= 8 && Date.now() - f.t < 600000); }
  function bump(key) { const f = fails.get(key); if (!f || Date.now() - f.t > 600000) fails.set(key, { n: 1, t: Date.now() }); else { f.n++; f.t = Date.now(); } }

  function view(a) { return { name: a.name, email: a.email, admin: !!a.admin, profile: a.profile || null, save: a.save || null }; }
  function newSession(a) {
    const tok = crypto.randomBytes(24).toString('hex'), h = sha(tok);
    a.sessions = (a.sessions || []).concat(h);
    while (a.sessions.length > SESSIONS_MAX) bySess.delete(a.sessions.shift());
    bySess.set(h, a); dirty(); return tok;
  }

  function register(m, ip) {
    m = m || {};
    const name = cleanName(m.name), email = String(m.email || '').trim().toLowerCase(), pw = String(m.password || '');
    if (name.length < 3) return fail('bad-name', 'O nome precisa ter pelo menos 3 letras.');
    if (!EMAIL_RE.test(email)) return fail('bad-email', 'E-mail inválido.');
    if (pw.length < 6 || pw.length > 100) return fail('bad-pass', 'A senha precisa ter pelo menos 6 caracteres.');
    if (byEmail.has(email)) return fail('email-taken', 'Essa conta já foi criada com esse e-mail. Use outro e-mail ou entre na sua conta.');
    const key = normName(name);
    const base = baseName(name), reserved = /^(adm|criador|isacmods)/.test(base) || base.indexOf(OWNER_KEY) === 0;
    let admin = false;
    if (reserved) {                                                           // "Admin…" e "Criador…" são reservados ao dono
      if (byName.has(key) || (base === OWNER_KEY && (byName.has(normName(ADMIN_NAME)) || byName.has(normName(ADMIN_NAME + ' 🇧🇷'))))) return fail('name-taken', 'Essa conta já foi criada com esse nome. Escolha outro nome.');
      if (base !== OWNER_KEY) return fail('name-reserved', 'Esse nome é reservado. Escolha outro nome.');
      const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();       // com ADMIN_EMAIL definido, só o seu e-mail vira o dono
      if (adminEmail && email !== adminEmail) return fail('name-reserved', 'Esse nome é reservado. Escolha outro nome.');
      admin = true;
    } else if (byName.has(key)) return fail('name-taken', 'Essa conta já foi criada com esse nome. Escolha outro nome.');
    const salt = crypto.randomBytes(16).toString('hex');
    const a = { id: crypto.randomBytes(6).toString('hex'), name: admin ? ADMIN_NAME : name, email: email, salt: salt, hash: hashPass(pw, salt), admin: admin, created: Date.now(), profile: null, save: null, sessions: [] };
    db.accounts[a.id] = a; byEmail.set(email, a); byName.set(key, a);
    const tok = newSession(a); dirty();
    return { ok: true, session: tok, account: view(a) };
  }

  function login(m, ip) {
    m = m || {};
    const email = String(m.email || '').trim().toLowerCase(), pw = String(m.password || ''), key = 'login|' + ip + '|' + email;
    if (tooMany(key)) return fail('too-many', 'Muitas tentativas erradas. Espere alguns minutos.');
    const a = byEmail.get(email);
    if (!a || !safeEq(hashPass(pw.slice(0, 100), a.salt), a.hash)) { bump(key); return fail('bad-login', 'E-mail ou senha incorretos.'); }
    fails.delete(key);
    const cf = cofreLe(m.cofre, email), volta = !!cf && nivelSec(cf.prog) > nivelSec(a.prog); if (volta) cofreAplica(a, cf);   // conta recomeçou do zero: volta tudo do cofre (cópia velha não vale)
    return { ok: true, session: newSession(a), account: view(a), recuperou: volta };
  }

  /* ===== MUDAR SENHA (esqueci a senha): nome da conta + e-mail iguais aos do cadastro → senha nova.
     Desconecta todos os outros aparelhos daquela conta. Limite de tentativas por aparelho e por e-mail. ===== */
  function resetPassword(m, ip) {
    m = m || {};
    const email = String(m.email || '').trim().toLowerCase(), pw = String(m.password || ''), k1 = 'reset|' + ip, k2 = 'reset|' + email;
    if (tooMany(k1) || tooMany(k2)) return fail('too-many', 'Muitas tentativas. Espere alguns minutos.');
    if (pw.length < 6 || pw.length > 100) return fail('bad-pass', 'A senha nova precisa ter pelo menos 6 caracteres.');
    const a = byEmail.get(email);
    if (!a || normName(a.name) !== normName(m.name)) { bump(k1); bump(k2); return fail('bad-reset', 'Nome ou e-mail não conferem com nenhuma conta.'); }
    a.salt = crypto.randomBytes(16).toString('hex'); a.hash = hashPass(pw, a.salt);
    (a.sessions || []).forEach(function (h) { bySess.delete(h); }); a.sessions = [];
    fails.delete(k1); fails.delete(k2); fails.delete('login|' + ip + '|' + email);
    const tok = newSession(a); dirty();
    return { ok: true, session: tok, account: view(a), reset: true };
  }

  /* ===== COFRE NO CELULAR: cópia do progresso inteiro (nível, rubis, itens, banco...) assinada pelo servidor.
     Fica guardada no aparelho do jogador. Se o servidor perder as contas, ela volta no login. O aparelho não consegue alterar: a assinatura deixaria de bater. ===== */
  function cofreKey() { return crypto.createHash('sha256').update('m3d-cofre|' + (process.env.BACKUP_SECRET || process.env.ADMIN_EMAIL || 'mundo3d-cofre-v1')).digest(); }
  function cofreSign(b) { return crypto.createHmac('sha256', cofreKey()).update(b).digest('base64'); }
  function cofre(id) {
    const a = db.accounts[id]; if (!a) return null;
    const tag = a.prog && a.prog.clan, cl = tag && db.meta && db.meta.clans && db.meta.clans[tag]; const b = Buffer.from(JSON.stringify({ v: 1, e: a.email, at: Date.now(), cla: cl ? { k: tag, d: cl } : null, prog: a.prog || null, save: a.save || null, bank: a.bank || 0, bankLog: a.bankLog || [], ledger: a.ledger || [] })).toString('base64');
    return b.length > COFRE_MAX ? null : b + '.' + cofreSign(b);
  }
  function cofreLe(c, email) {
    if (typeof c !== 'string' || c.length > COFRE_MAX + 100) return null; const i = c.lastIndexOf('.'); if (i < 1) return null;
    const b = c.slice(0, i), si = Buffer.from(c.slice(i + 1)), ok = Buffer.from(cofreSign(b)); if (si.length !== ok.length || !crypto.timingSafeEqual(si, ok)) return null;
    try { const o = JSON.parse(Buffer.from(b, 'base64').toString()); return o && o.v === 1 && o.e === email ? o : null; } catch (e) { return null; }
  }
  function nivelSec(q) { return ((q && q.sec) || 0) + ((q && q.msec) || 0); }
  function cofreAplica(a, o) { if (o.prog) a.prog = o.prog; if (o.save) a.save = o.save; a.bank = Math.max(0, Math.floor(o.bank) || 0); a.bankLog = Array.isArray(o.bankLog) ? o.bankLog : []; a.ledger = Array.isArray(o.ledger) ? o.ledger : []; if (o.cla && o.cla.d) { const C = meta('clans') || {}; if (!C[o.cla.k]) C[o.cla.k] = o.cla.d; const c = C[o.cla.k]; c.m = c.m || []; if (c.m.indexOf(a.name) < 0) c.m.push(a.name); meta('clans', C); } dirty(); }

  /* ===== recuperar conta pela cópia de segurança do celular =====
     Se o servidor perdeu as contas (atualização / servidor grátis reiniciou), o aparelho manda nome, e-mail, senha digitada e o progresso guardado.
     - e-mail já existe: funciona igual ao login (não sobrescreve nada);
     - e-mail não existe: recria a conta com esse progresso (se o nome foi pego por outra pessoa, usa o nome com um número). */
  function restore(m, ip) {
    m = m || {};
    const email = String(m.email || '').trim().toLowerCase(), pw = String(m.password || '');
    if (byEmail.has(email)) { const r = login({ email: email, password: pw, cofre: m.cofre }, ip); if (r.ok) r.restored = false; return r; }
    const want = cleanName(m.name) || 'Jogador';
    let name = want, r = register({ name: name, email: email, password: pw }, ip), n = 1;
    while (r.error && (r.error.code === 'name-taken' || r.error.code === 'name-reserved') && n < 40) {
      n++; name = (/^(admin|criador)/i.test(want) ? 'Jogador' : want).slice(0, 13) + n; r = register({ name: name, email: email, password: pw }, ip);
    }
    if (r.error) return r;
    const a = bySession(r.session);
    if (m.save && typeof m.save === 'object' && !Array.isArray(m.save)) { const sv = JSON.stringify(m.save); if (sv.length <= SAVE_MAX) a.save = JSON.parse(sv); }
    if (m.profile && typeof m.profile === 'object') { const g = m.profile.gender, c = Number(m.profile.color); if ((g === 'male' || g === 'female') && Number.isInteger(c) && c >= 0 && c <= 5) a.profile = { gender: g, color: c }; }
    const cf = cofreLe(m.cofre, email); if (cf) cofreAplica(a, cf);
    dirty();
    return { ok: true, session: r.session, account: view(a), restored: true, recuperou: !!cf, renamed: a.name !== want };
  }
  function bySession(tok) { return tok ? bySess.get(sha(String(tok))) || null : null; }
  function me(tok) { const a = bySession(tok); return a ? { ok: true, account: view(a) } : fail('auth', 'Sessão expirada. Entre de novo.'); }
  function saveData(tok, body) {
    const a = bySession(tok); if (!a) return fail('auth', 'Sessão expirada. Entre de novo.');
    body = body || {};
    if (body.save && typeof body.save === 'object' && !Array.isArray(body.save)) {
      const s = JSON.stringify(body.save); if (s.length > SAVE_MAX) return fail('too-big', 'Progresso grande demais.');
      const nw = JSON.parse(s), old = a.save;                          // dinheiro e itens só mudam pelo servidor do jogo
      if (old && old.coins != null) { nw.coins = old.coins; nw.bait = old.bait || 0; } else { nw.coins = Math.min(Number(nw.coins) || 0, START_COINS); delete nw.bait; } nw.items = (old && old.items) || {};   // o aparelho nunca apaga item comprado
      a.save = nw;
    }
    if (body.profile && typeof body.profile === 'object') {
      const g = body.profile.gender, c = Number(body.profile.color);
      if ((g === 'male' || g === 'female') && Number.isInteger(c) && c >= 0 && c <= 5) a.profile = { gender: g, color: c };
    }
    dirty(); return { ok: true };
  }
  /* ===== carteira do PvP: o servidor registra ganhos/perdas de moedas num livro-caixa e o aparelho aplica (com confirmação).
     Assim quem perde não escapa do desconto, mesmo se desconectar. As moedas em si continuam guardadas no progresso da conta. ===== */
  function applied(a) { return new Set(a.save && Array.isArray(a.save.applied) ? a.save.applied : []); }
  function pendingEntries(a) { const ap = applied(a); return (a.ledger || []).filter(function (e) { return !ap.has(e.id); }); }
  function balance(id) {                                          // moedas confirmadas + movimentos do livro-caixa que o aparelho ainda não aplicou
    const a = db.accounts[id]; if (!a) return 0;
    let n = Math.floor(Number(a.save && a.save.coins) || 0);
    pendingEntries(a).forEach(function (e) { n += e.d; });
    return Math.max(0, n);
  }
  function ledgerAdd(id, d, note, it) {                                            // it: item que entra/sai (troca entre jogadores) { c: 'pets'|'mounts', k, op: 1|-1 }
    const a = db.accounts[id]; if (!a || !Number.isInteger(d) || (d === 0 && !it)) return null;
    const e = { id: crypto.randomBytes(5).toString('hex'), d: d, n: String(note || '').slice(0, 60), at: Date.now() }; if (it) e.it = it;
    a.ledger = (a.ledger || []).concat(e).slice(-60); dirty(); return e;
  }
  function ledgerList(id) { const a = db.accounts[id]; return a ? pendingEntries(a).map(function (e) { return e.it ? { id: e.id, d: e.d, n: e.n, it: e.it } : { id: e.id, d: e.d, n: e.n }; }) : []; }
  function ledgerAck(id, ids) {
    const a = db.accounts[id]; if (!a || !Array.isArray(ids)) return;
    const set = new Set(ids.slice(0, 60).map(String)); a.ledger = (a.ledger || []).filter(function (e) { return !set.has(e.id); }); dirty();
  }
  /* ===== BANCO: moedas guardadas no servidor (não ficam no celular) + extrato ===== */
  /* lojas com dono e outras informações do mundo (salvas junto com as contas) */
  function shops() { if (!db.shops) db.shops = {}; return db.shops; }
  function meta(k, v) { if (!db.meta) db.meta = {}; if (v !== undefined) { db.meta[k] = v; dirty(); } return db.meta[k]; }
  function bankOf(id) { const a = db.accounts[id]; return a ? Math.max(0, Math.floor(a.bank || 0)) : 0; }
  function bankAdd(id, d, note) { const a = db.accounts[id]; if (!a || !Number.isInteger(d)) return false; const v = (a.bank || 0) + d; if (v < 0) return false; a.bank = v; a.bankLog = (a.bankLog || []).concat({ d: d, n: String(note || '').slice(0, 60), at: Date.now() }).slice(-15); dirty(); return true; }
  function bankLog(id) { const a = db.accounts[id]; return a ? (a.bankLog || []).slice().reverse() : []; }
  function idByName(name) { const a = byName.get(normName(cleanName(name))); return a ? a.id : null; }
  function nameOf(id) { const a = db.accounts[id]; return a ? a.name : ''; }
  function saveOf(id) { const a = db.accounts[id]; if (!a) return null; if (!a.save) { a.save = { coins: START_COINS, items: {} }; dirty(); } return a.save; }   // conta sem progresso ganha um na hora: compra nunca cai em objeto temporário
  /* PROGRESSO QUE SÓ O SERVIDOR MEXE: tempo jogado, emprego, recompensas, punições e estatísticas (o aparelho não consegue alterar). */
  function prog(id) {
    const a = db.accounts[id]; if (!a) return null;
    if (!a.prog) a.prog = { sec: 0, day: '', daySec: 0, job: null, rew: [], title: null, pvpW: 0, pvpL: 0, shifts: 0 };
    return a.prog;
  }
  function stat(id, k, n) { const q = prog(id); if (q) { q[k] = (q[k] || 0) + (n == null ? 1 : n); dirty(); } }
  function info(id) { const a = db.accounts[id]; return a ? { id: a.id, name: a.name, admin: !!a.admin, created: a.created || 0, profile: a.profile || null, save: a.save || null } : null; }
  function logout(tok) {
    const a = bySession(tok); if (!a) return { ok: true };
    const h = sha(String(tok)); a.sessions = (a.sessions || []).filter(function (x) { return x !== h; }); bySess.delete(h); dirty(); return { ok: true };
  }
  function gearRank(sv) { const g = sv.gear || {}, it = sv.items || {}, o = {}; ['pet', 'mount', 'acW', 'acO'].forEach(function (k) { const v = g[k] === true ? (k === 'pet' ? 'pet' : 'prancha') : g[k]; if (v && it[v]) o[k] = v; }); return o; }   // o que cada um está usando, para aparecer no rank
  function ranking() {                                               // lista de todos para o rank do jogo
    return Object.keys(db.accounts).map(function (id) { const a = db.accounts[id], q = prog(id), sv = a.save || {}; return { n: a.name, g: (a.profile && a.profile.gender) || 'male', lk: sv.look || null, sec: Math.floor(q.sec || 0), c: Math.floor(Number(sv.coins) || 0), r: q.gems || 0, f: q.fishN || 0, ls: (q.sec || 0) + (q.msec || 0), gr: gearRank(sv), pv: q.pvpWk || null }; });
  }
  return { cofre: cofre, eachProg: function (fn) { Object.keys(db.accounts).forEach(function (id) { fn(id, prog(id), db.accounts[id].name); }); }, nameOf: function (id) { const a = db.accounts[id]; return a ? a.name : ''; }, ranking: ranking, importData: importData, exportJson: exportJson, touch: function () { dirty(); }, register: register, restore: restore, login: login, resetPassword: resetPassword, me: me, bySession: bySession, saveData: saveData, logout: logout, balance: balance, ledgerAdd: ledgerAdd, ledgerList: ledgerList, ledgerAck: ledgerAck, shops: shops, meta: meta, bankOf: bankOf, bankAdd: bankAdd, bankLog: bankLog, idByName: idByName, nameOf: nameOf, saveOf: saveOf, prog: prog, stat: stat, info: info, flush: flush, ADMIN_NAME: ADMIN_NAME, count: function () { return Object.keys(db.accounts).length; } };
}

module.exports = { create: create, ADMIN_NAME: ADMIN_NAME };
