'use strict';
/* Arena PvP: chamado, fila, aposta e luta. Quem decide dano, vida e prêmio é sempre o servidor; o aparelho só pede. */
const W = require('../shared/world.js');
const K = W.ARENA, HP = 100, MODES = K.MODES;

function create(c) {
  const players = c.players, send = c.send, accounts = c.accounts, SP = c.speed || 1;   // speed > 1 só nos testes
  let cur = null, nextT = null; const fila = [];
  const later = function (fn, ms) { const t = setTimeout(fn, ms / SP); if (t.unref) t.unref(); return t; };
  const by = function (id) { return players.get(id) || null; };
  function cast(o) { const raw = JSON.stringify(Object.assign({ t: 'pvp' }, o)); const ids = cur ? cur.ids : []; players.forEach(function (q) { if ((q.room === 'arena' || ids.indexOf(q.id) >= 0 || q.pvp) && q.ws && q.ws.readyState === 1) { try { q.ws.send(raw); } catch (e) {} } }); }
  function err(p, msg) { send(p, { t: 'pvp', st: 'no', msg: msg }); }
  function fighterPub(m) { return { ids: m.ids, names: m.names, mode: m.mode, v: m.v, pets: m.pets, round: m.round, wins: m.wins, hp: m.hp, st: m.st, left: m.end ? Math.max(0, (m.end - Date.now()) / 1000) : 0 }; }
  function filaPub() { return { cur: cur ? { names: cur.names, mode: cur.mode, v: cur.v } : null, L: fila.map(function (m) { return { names: m.names, mode: m.mode, v: m.v }; }) }; }
  function filaCast() { const o = filaPub(); o.st = 'fila'; cast(o); }
  // ===== dinheiro: fica preso em prog.pvpEsc; se o servidor reiniciar no meio, volta para o jogador quando ele entrar =====
  function hold(p, v) { if (!v) return; const sv = accounts.saveOf(p.accountId), q = accounts.prog(p.accountId); sv.coins = (Number(sv.coins) || 0) - v; q.pvpEsc = (q.pvpEsc || 0) + v; accounts.touch(); send(p, c.prog(p)); }
  function release(accId, v, gain) { const q = accounts.prog(accId), sv = accounts.saveOf(accId); if (!q || !sv) return; q.pvpEsc = Math.max(0, (q.pvpEsc || 0) - v); if (gain) sv.coins = (Number(sv.coins) || 0) + gain; accounts.touch(); const o = onlineAcc(accId); if (o) send(o, c.prog(o)); }
  function onlineAcc(id) { let r = null; players.forEach(function (q) { if (q.accountId === id) r = q; }); return r; }
  function refund(m) { m.acc.forEach(function (id) { if (m.v) release(id, m.v, m.v); }); }
  // ===== fila =====
  function clear(m) { m.ids.forEach(function (id) { const q = by(id); if (q && q.pvp === m) { q.pvp = null; q.pvpBlk = false; } }); clearTimeout(m.T); }
  function pump() { clearTimeout(nextT); nextT = null; if (cur) return; const m = fila.shift(); if (!m) return filaCast(); const a = by(m.ids[0]), b = by(m.ids[1]); if (!a || !b) { refund(m); clear(m); return pump(); } cur = m; begin(a, b, m); }
  function begin(a, b, m) {
    [a, b].forEach(function (p, i) { c.toArena(p); p.pvpBlk = false; if (p.mount) { p.mount = null; c.rmAll(p, c.gearMsg(p)); } m.pets[i] = m.mode === 'rinha' ? (p.pet || 'pet') : null; });
    startRound(m);
  }
  function startRound(m) {
    m.round++; m.hp = [HP, HP]; m.st = 'round'; m.end = 0; m.ammo = [W.ARENA.GUN.mag, W.ARENA.GUN.mag]; m.rl = [0, 0]; m.last = [{}, {}];
    const tiro = m.mode === 'tiro', z = tiro ? 21 : 5;
    m.ids.forEach(function (id, i) { const p = by(id); if (!p) return; p.x = 0; p.y = 0; p.z = i ? -z : z; p.ry = i ? Math.PI : 0; p.a = 'idle'; p.at = Date.now(); p.dirty = true; p.pvpBlk = false; send(p, { t: 'correct', x: p.x, y: 0, z: p.z }); });
    cast(Object.assign({ st: 'round', ry: 0 }, fighterPub(m)));
    clearTimeout(m.T); m.T = later(function () { m.st = 'luta'; m.end = Date.now() + MODES[m.mode].t * 1000 / SP; cast({ st: 'go', left: MODES[m.mode].t }); m.T = later(function () { timeUp(m); }, MODES[m.mode].t * 1000); }, K.COUNT * 1000);
  }
  function timeUp(m) { if (m !== cur || m.st !== 'luta') return; if (m.hp[0] === m.hp[1]) { m.end = Date.now() + 10000 / SP; cast({ st: 'extra', left: 10 }); m.T = later(function () { timeUp(m); }, 10000); return; } roundEnd(m, m.hp[0] > m.hp[1] ? 0 : 1); }
  function roundEnd(m, w) { clearTimeout(m.T); m.st = 'pausa'; m.end = 0; m.wins[w]++; cast({ st: 'roundEnd', w: w, wins: m.wins, hp: m.hp }); m.T = later(function () { if (m.wins[w] >= 2) finish(m, w, ''); else startRound(m); }, 2600); }
  function finish(m, w, why) {
    clearTimeout(m.T); const wa = m.acc[w], la = m.acc[1 - w]; m.st = 'fim'; const pot = m.v * 2;
    if (m.v) { release(wa, m.v, pot); release(la, m.v, 0); }
    const qw = accounts.prog(wa), ql = accounts.prog(la); if (qw) qw.pvpW = (qw.pvpW || 0) + 1; if (ql) ql.pvpL = (ql.pvpL || 0) + 1; accounts.touch();
    if (api.onEnd) try { api.onEnd(m, w); } catch (e) { console.error(e); }
    cast({ st: 'end', w: w, names: m.names, ids: m.ids, wins: m.wins, v: m.v, why: why });
    if (m.v >= K.ANNOUNCE) c.all({ t: 'sys', on: 1, text: '⚔️ ' + m.names[w] + ' venceu ' + m.names[1 - w] + ' na arena e levou 💵 ' + pot });
    clear(m); if (cur === m) cur = null; nextT = later(pump, 3500); filaCast();
  }
  function left(p, why) {                                              // saiu do jogo, foi preso ou desistiu
    if (p.pvpIn) p.pvpIn = null; const m = p.pvp; if (!m) return;
    const i = fila.indexOf(m); if (i >= 0) { fila.splice(i, 1); refund(m); m.ids.forEach(function (id) { const q = by(id); if (q && q !== p) send(q, { t: 'pvp', st: 'no', msg: p.name + ' saiu da fila. Sua aposta voltou.' }); }); clear(m); filaCast(); return; }
    if (m === cur && m.st !== 'fim') finish(m, m.ids[0] === p.id ? 1 : 0, why || 'saiu');
  }
  // ===== golpes e tiros =====
  function ctx(p) { const m = p.pvp; if (!m || m !== cur || m.st !== 'luta') return null; const i = m.ids[0] === p.id ? 0 : 1, o = by(m.ids[1 - i]); return o ? { m: m, i: i, o: o } : null; }
  function hurt(x, dmg, p, o) { const m = x.m, j = 1 - x.i, d = Math.round(dmg); m.hp[j] = Math.max(0, m.hp[j] - d); cast(Object.assign({ st: 'hp', hp: m.hp, to: x.o.id, by: p.id, d: d }, o || {})); if (m.hp[j] <= 0) roundEnd(m, x.i); }
  function atk(p, m) {
    const x = ctx(p); if (!x) return; const d = K.ATK[m.k]; if (!d || d.m !== x.m.mode) return; const now = Date.now(), L = x.m.last[x.i]; if (now - (L[m.k] || 0) < d.cd * 850 / SP) return; L[m.k] = now;
    const ry = c.num(m.ry, -10, 10); if (ry !== null) p.ry = ry; p.pvpBlk = false; cast({ st: 'fx', k: m.k, id: p.id, ry: p.ry });
    const dx = x.o.x - p.x, dz = x.o.z - p.z, dist = Math.hypot(dx, dz); if (dist > d.r) return;
    const fx = -Math.sin(p.ry), fz = -Math.cos(p.ry); if (dist > .4 && (fx * dx + fz * dz) / dist < -.15) return;   // de costas não acerta
    const blk = !!x.o.pvpBlk; hurt(x, d.dmg * (blk ? (d.gb ? .5 : .15) : 1), p, { blk: blk ? 1 : 0, k: m.k });
  }
  function shot(p, m) {
    const x = ctx(p); if (!x || x.m.mode !== 'tiro') return; const G = K.GUN, now = Date.now(), L = x.m.last[x.i];
    if (now < x.m.rl[x.i] || x.m.ammo[x.i] <= 0 || now - (L.shot || 0) < G.rate * 800 / SP) return; if (!Array.isArray(m.o) || !Array.isArray(m.d)) return;
    const O = m.o.slice(0, 3).map(Number), D = m.d.slice(0, 3).map(Number); if (O.concat(D).some(function (v) { return !Number.isFinite(v); })) return; const dl = Math.hypot(D[0], D[1], D[2]); if (dl < .5 || dl > 1.5) return; D[0] /= dl; D[1] /= dl; D[2] /= dl;
    if (Math.hypot(O[0] - p.x, O[1] - p.y - 1.5, O[2] - p.z) > 6) return;
    L.shot = now; x.m.ammo[x.i]--; const r = K.ray(O, D, x.o); cast({ st: 'fx', k: 'shot', id: p.id, to: [+(O[0] + D[0] * r.t).toFixed(2), +(O[1] + D[1] * r.t).toFixed(2), +(O[2] + D[2] * r.t).toFixed(2)] });
    if (r.hit) hurt(x, G.dmg * (r.head ? 2 : 1), p, { head: r.head ? 1 : 0, gun: 1 });
  }
  function act(p, m) {
    if (m.a === 'atk') return atk(p, m); if (m.a === 'shot') return shot(p, m);
    if (m.a === 'block') { p.pvpBlk = !!m.on; return; }
    if (m.a === 'reload') { const x = ctx(p); if (!x || x.m.mode !== 'tiro') return; const G = K.GUN, now = Date.now(); if (now < x.m.rl[x.i] || x.m.ammo[x.i] >= G.mag) return; x.m.rl[x.i] = now + G.reload * 1000 / SP; x.m.ammo[x.i] = G.mag; return; }
    if (m.a === 'list') { const L = []; players.forEach(function (q) { if (q !== p && q.room === 'arena' && !q.inv) L.push({ id: q.id, n: q.name, lv: c.lvOf(q), busy: q.pvp ? 1 : 0 }); }); const q = accounts.prog(p.accountId); return send(p, Object.assign({ t: 'pvp', st: 'list', L: L.slice(0, 60), w: q.pvpW || 0, l: q.pvpL || 0 }, { f: filaPub() })); }
    if (m.a === 'state') { send(p, { t: 'pvp', st: 'state', m: cur ? fighterPub(cur) : null, f: filaPub() }); return; }
    if (m.a === 'quit') return left(p, 'desistiu');
    if (m.a === 'call') {
      const o = by(String(m.to)), v = Math.floor(Number(m.v) || 0), now = Date.now(); if (!MODES[m.mode]) return; if (now - (p.pvpCall || 0) < 1500) return err(p, 'Espere um pouco para chamar de novo.'); p.pvpCall = now;
      if (p.room !== 'arena') return err(p, 'Entre na Arena PvP pelo mapa para chamar alguém.'); if (!o || o === p || o.room !== 'arena' || o.inv) return err(p, 'Esse jogador não está na arena.'); if (p.inv) return err(p, 'Saia do modo invisível para lutar.'); if (p.pvp) return err(p, 'Você já está em uma luta ou na fila.'); if (o.pvp || (o.pvpIn && now - o.pvpIn.at < K.CALL_SEC * 1000)) return err(p, o.name + ' está ocupado.');
      if (c.jailed(p) || c.jailed(o)) return err(p, 'Quem está preso não pode lutar.'); if (c.blocked(o, p)) return err(p, 'Esse jogador não aceita seus chamados.');
      if (v < 0 || v > K.MAX_BET) return err(p, 'Valor de aposta inválido.'); if ((Number((accounts.saveOf(p.accountId) || {}).coins) || 0) < v) return err(p, 'Você não tem esse dinheiro.');
      o.pvpIn = { from: p.id, mode: m.mode, v: v, at: now }; send(o, { t: 'pvp', st: 'in', from: p.id, n: p.name, mode: m.mode, v: v, sec: K.CALL_SEC }); return send(p, { t: 'pvp', st: 'sent', n: o.name });
    }
    if (m.a === 'ans') {
      const iv = p.pvpIn; p.pvpIn = null; if (!iv || Date.now() - iv.at > (K.CALL_SEC + 3) * 1000) return; const o = by(iv.from); if (!o || o.room !== 'arena' || p.room !== 'arena') return err(p, 'Quem chamou já saiu da arena.'); if (!m.yes) return err(o, p.name + ' recusou o chamado.');
      const has = function (q) { return (Number((accounts.saveOf(q.accountId) || {}).coins) || 0) >= iv.v; }; if (o.pvp || p.pvp) return err(p, 'Esse chamado não vale mais.'); if (!has(o)) { err(p, o.name + ' não tem mais esse dinheiro.'); return err(o, 'Você não tem mais esse dinheiro.'); } if (!has(p)) { err(o, p.name + ' não tem esse dinheiro.'); return err(p, 'Você não tem esse dinheiro.'); } if (c.jailed(p) || c.jailed(o)) return;
      hold(o, iv.v); hold(p, iv.v); const M = { ids: [o.id, p.id], acc: [o.accountId, p.accountId], names: [o.name, p.name], mode: iv.mode, v: iv.v, wins: [0, 0], round: 0, hp: [HP, HP], st: 'fila', end: 0, pets: [null, null], T: null, ammo: [0, 0], rl: [0, 0], last: [{}, {}] };
      o.pvp = p.pvp = M; fila.push(M); [o, p].forEach(function (q) { send(q, { t: 'pvp', st: 'ok', n: q === p ? o.name : p.name, pos: fila.length + (cur ? 1 : 0), v: iv.v }); }); filaCast(); if (!cur && !nextT) pump(); return;
    }
  }
  function hello(p) { const q = accounts.prog(p.accountId), v = q.pvpEsc || 0; if (v > 0) { q.pvpEsc = 0; const sv = accounts.saveOf(p.accountId); sv.coins = (Number(sv.coins) || 0) + v; accounts.touch(); send(p, c.prog(p)); send(p, { t: 'sys', on: 1, text: '⚔️ Sua aposta de 💵 ' + v + ' voltou: a luta não terminou.' }); } }
  function force(a, b, mode, cb) {                                     // luta do torneio: sem chamado e sem aposta
    if (!a || !b || a.pvp || b.pvp) return later(function () { cb(a && !a.pvp ? a.id : b ? b.id : null); }, 100);
    const M = { ids: [a.id, b.id], acc: [a.accountId, b.accountId], names: [a.name, b.name], mode: mode, v: 0, wins: [0, 0], round: 0, hp: [HP, HP], st: 'fila', end: 0, pets: [null, null], T: null, ammo: [0, 0], rl: [0, 0], last: [{}, {}], cb: cb }; a.pvp = b.pvp = M; fila.push(M); filaCast(); if (!cur && !nextT) pump();
  }
  const api = { force: force, act: act, left: left, hello: hello, busy: function (p) { return !!(p.pvp && p.pvp === cur); }, stop: function () { clearTimeout(nextT); if (cur) clearTimeout(cur.T); } };
  return api;
}
module.exports = { create: create };
