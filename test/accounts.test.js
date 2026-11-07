'use strict';
/* Teste das contas: cadastro, duplicados, login, progresso salvo e conta do criador. */
const assert = require('assert');
const os = require('os'), fs = require('fs'), path = require('path');
const { EventEmitter } = require('events');
const accountsLib = require('../server/accounts');
const { attach } = require('../server/world');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'm3d-'));
let acc = accountsLib.create({ dir: dir });

const a = acc.register({ name: 'Maria', email: 'maria@x.com', password: '123456' }, '1.1.1.1');
assert.ok(a.ok && a.session && !a.account.admin);
assert.strictEqual(acc.register({ name: 'Outra', email: 'MARIA@x.com', password: '123456' }, 'ip').error.code, 'email-taken');   // e-mail já criado
assert.strictEqual(acc.register({ name: ' maria ', email: 'o@x.com', password: '123456' }, 'ip').error.code, 'name-taken');       // nome já criado
assert.strictEqual(acc.register({ name: 'Ze', email: 'z@x.com', password: '123456' }, 'ip').error.code, 'bad-name');
assert.strictEqual(acc.register({ name: 'Zeca', email: 'zx.com', password: '123456' }, 'ip').error.code, 'bad-email');
assert.strictEqual(acc.register({ name: 'Zeca', email: 'z@x.com', password: '123' }, 'ip').error.code, 'bad-pass');

// criador: quem tem o nome ADM-ISAC é o dono (sem código); outros "Admin…" ficam reservados
assert.strictEqual(acc.register({ name: 'Admin', email: 'a@x.com', password: '123456' }, 'ip').error.code, 'name-reserved');
assert.strictEqual(acc.register({ name: 'Administrador', email: 'a@x.com', password: '123456' }, 'ip').error.code, 'name-reserved');
assert.strictEqual(acc.register({ name: 'Admin-isac', email: 'a@x.com', password: '123456' }, 'ip').error.code, 'name-reserved');
assert.strictEqual(acc.register({ name: 'CRIADOR-ISAC', email: 'a@x.com', password: '123456' }, 'ip').error.code, 'name-reserved');
assert.strictEqual(acc.register({ name: 'ADM-ISAC 2', email: 'a@x.com', password: '123456' }, 'ip').error.code, 'name-reserved');
const ad = acc.register({ name: 'adm-isac 🇧🇷', email: 'i@x.com', password: '123456' }, 'ip');
assert.ok(ad.ok && ad.account.admin && ad.account.name === 'ADM-ISAC');
assert.strictEqual(acc.register({ name: 'ADM-ISAC', email: 'j@x.com', password: '123456' }, 'ip').error.code, 'name-taken');

// login + progresso
assert.strictEqual(acc.login({ email: 'maria@x.com', password: 'errada' }, 'ip').error.code, 'bad-login');
const l = acc.login({ email: 'maria@x.com', password: '123456' }, 'ip'); assert.ok(l.ok);
assert.ok(acc.saveData(l.session, { save: { coins: 77, pets: ['gato'] }, profile: { gender: 'female', color: 2 } }).ok);
assert.strictEqual(acc.saveData('lixo', { save: {} }).error.code, 'auth');
assert.strictEqual(acc.saveData(l.session, { save: { x: 'a'.repeat(50000) } }).error.code, 'too-big');
acc.flush();

// reinício do servidor: tudo continua lá (e a sessão antiga ainda vale)
acc = accountsLib.create({ dir: dir });
const me = acc.me(l.session); assert.ok(me.ok);
assert.strictEqual(me.account.save.coins, 77); assert.deepStrictEqual(me.account.profile, { gender: 'female', color: 2 });
assert.strictEqual(acc.login({ email: 'i@x.com', password: '123456' }, 'ip').account.admin, true);
const data = fs.readFileSync(path.join(dir, 'accounts.json'), 'utf8'); assert.ok(data.indexOf('123456') < 0, 'senha não pode ficar em texto puro');
acc.logout(l.session); assert.strictEqual(acc.me(l.session).error.code, 'auth');

// bloqueio por tentativas
for (let i = 0; i < 8; i++) acc.login({ email: 'maria@x.com', password: 'x' }, 'atacante');
assert.strictEqual(acc.login({ email: 'maria@x.com', password: '123456' }, 'atacante').error.code, 'too-many');

// websocket: só entra logado, nome vem da conta, criador aparece marcado
const wss = new EventEmitter(); wss.clients = new Set();
const api = attach(wss, {}, acc);
function client() { const ws = new EventEmitter(); ws.readyState = 1; ws.inbox = []; ws.send = function (s) { ws.inbox.push(JSON.parse(s)); }; ws.ping = function () {}; ws.close = function () { ws.readyState = 3; ws.emit('close'); }; wss.emit('connection', ws); ws.say = function (o) { ws.emit('message', Buffer.from(JSON.stringify(o))); }; ws.last = function (t) { for (let i = ws.inbox.length - 1; i >= 0; i--) if (ws.inbox[i].t === t) return ws.inbox[i]; return null; }; return ws; }
const g = client(); g.say({ t: 'hello', name: 'Fake', gender: 'male' }); assert.strictEqual(g.last('error').code, 'auth');
const s1 = acc.login({ email: 'i@x.com', password: '123456' }, 'ip').session;
const c = client(); c.say({ t: 'hello', auth: s1, name: 'QualquerCoisa', gender: 'male', color: 1 });
const j = c.last('hi'); assert.strictEqual(j.you.name, 'ADM-ISAC'); assert.strictEqual(j.you.adm, 1);
const c2 = client(); c2.say({ t: 'hello', auth: s1, gender: 'male', color: 1 });                    // mesma conta em outro aparelho: o primeiro sai
assert.strictEqual(c.last('error').code, 'dup'); assert.strictEqual(api.players.size, 1);
api.stop(); console.log('TESTES DE CONTAS PASSARAM');
