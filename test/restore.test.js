'use strict';
/* Cópia de segurança: o servidor perde as contas (atualização no Render grátis) e o celular recria a conta com o progresso. Rode: npm test */
const assert = require('assert');
const accountsLib = require('../server/accounts');

const antes = accountsLib.create({});
const r = antes.register({ name: 'Maria', email: 'maria@t.com', password: 'senha123' });
const save = { coins: 345, pets: ['gato'], mounts: ['grifodourado'] };
antes.saveData(r.session, { save: save, profile: { gender: 'female', color: 3 } });

const depois = accountsLib.create({});                       // servidor novo, vazio (como depois de atualizar)
assert.strictEqual(depois.login({ email: 'maria@t.com', password: 'senha123' }).error.code, 'bad-login');
const back = depois.restore({ name: 'Maria', email: 'maria@t.com', password: 'senha123', save: save, profile: { gender: 'female', color: 3 } });
assert.ok(back.ok && back.restored, 'conta recriada');
assert.deepStrictEqual(back.account.save, save, 'progresso de volta');
assert.deepStrictEqual(back.account.profile, { gender: 'female', color: 3 });
assert.strictEqual(back.account.name, 'Maria');
assert.ok(depois.login({ email: 'maria@t.com', password: 'senha123' }).ok, 'entra normal depois');

const outra = depois.restore({ name: 'Maria', email: 'maria@t.com', password: 'errada', save: { coins: 999999 } });
assert.strictEqual(outra.error.code, 'bad-login', 'conta existente: não sobrescreve sem a senha certa');
const certa = depois.restore({ name: 'Maria', email: 'maria@t.com', password: 'senha123', save: { coins: 999999 } });
assert.ok(certa.ok && certa.restored === false && certa.account.save.coins === 345, 'conta existente: só entra, não troca o progresso');

depois.register({ name: 'Joao', email: 'outro@t.com', password: 'senha123' });   // alguém pegou o nome antes
const ren = depois.restore({ name: 'Joao', email: 'joao@t.com', password: 'senha123', save: { coins: 50 } });
assert.ok(ren.ok && ren.renamed && ren.account.name === 'Joao2', 'nome ocupado: ganha número');
process.env.ADMIN_EMAIL = 'dono@t.com';
const fake = depois.register({ name: 'ADM-ISAC', email: 'intruso@t.com', password: 'senha123' });
assert.strictEqual(fake.error.code, 'name-reserved', 'com ADMIN_EMAIL, outra pessoa não vira o Criador');
assert.ok(depois.register({ name: 'ADM-ISAC', email: 'dono@t.com', password: 'senha123' }).account.admin, 'o dono vira o Criador');
delete process.env.ADMIN_EMAIL;
// cofre: nível, rubis, itens e banco voltam depois que o servidor perde tudo
const v1 = accountsLib.create({}), vr = v1.register({ name: 'Bia', email: 'bia@t.com', password: 'senha123' }), vid = v1.bySession(vr.session).id;
const vq = v1.prog(vid); vq.sec = 90000; vq.msec = 500; vq.gems = 77; v1.saveOf(vid).items = { rPonei: 1 }; v1.saveOf(vid).coins = 4321; v1.bankAdd(vid, 900, 'teste');
const cf = v1.cofre(vid), v2 = accountsLib.create({}), bk = v2.restore({ name: 'Bia', email: 'bia@t.com', password: 'senha123', save: { coins: 1 }, cofre: cf });
const ni = v2.bySession(bk.session).id; assert.strictEqual(v2.prog(ni).sec, 90000, 'nível voltou'); assert.strictEqual(v2.prog(ni).gems, 77, 'rubis voltaram'); assert.ok(bk.account.save.items.rPonei, 'itens voltaram'); assert.strictEqual(bk.account.save.coins, 4321); assert.strictEqual(v2.bankOf(ni), 900, 'banco voltou');
// conta que já recomeçou do zero também volta ao entrar
const v3 = accountsLib.create({}); v3.register({ name: 'Bia', email: 'bia@t.com', password: 'senha123' }); const lg = v3.login({ email: 'bia@t.com', password: 'senha123', cofre: cf }); assert.strictEqual(v3.prog(v3.bySession(lg.session).id).sec, 90000, 'zerada: volta no login');
// falsificar ou reaproveitar cópia velha não funciona
const pt = cf.split('.'), fals = JSON.parse(Buffer.from(pt[0], 'base64').toString()); fals.prog.gems = 999999; const fc = Buffer.from(JSON.stringify(fals)).toString('base64') + '.' + pt[1];
const v4 = accountsLib.create({}), f2 = v4.restore({ name: 'Bia', email: 'bia@t.com', password: 'senha123', cofre: fc }); assert.ok(!v4.prog(v4.bySession(f2.session).id).gems, 'cofre alterado é recusado');
v2.prog(ni).sec = 95000; v2.prog(ni).gems = 3; const velha = v2.login({ email: 'bia@t.com', password: 'senha123', cofre: cf }); assert.strictEqual(v2.prog(ni).gems, 3, 'cópia velha não devolve rubis gastos');
const v5 = accountsLib.create({}), f3 = v5.restore({ name: 'Bia', email: 'outra@t.com', password: 'senha123', cofre: cf }); assert.ok(!v5.prog(v5.bySession(f3.session).id).gems, 'cofre de outra conta é recusado');
const c1 = accountsLib.create({}), cr = c1.register({ name: 'Leo', email: 'leo@t.com', password: 'senha123' }), cid = c1.bySession(cr.session).id; c1.prog(cid).sec = 500; c1.prog(cid).clan = 'REI'; c1.prog(cid).album = { sardinha: 2 }; c1.prog(cid).fishN = 9; c1.meta('clans', { REI: { n: 'Reis', tag: 'REI', lead: 'Leo', m: ['Leo'] } });
const c2 = accountsLib.create({}), r2 = c2.restore({ name: 'Leo', email: 'leo@t.com', password: 'senha123', cofre: c1.cofre(cid) }), id2 = c2.bySession(r2.session).id; assert.ok(r2.recuperou, 'avisa na tela'); assert.strictEqual(c2.meta('clans').REI.lead, 'Leo', 'clã voltou'); assert.strictEqual(c2.prog(id2).clan, 'REI'); assert.strictEqual(c2.prog(id2).fishN, 9, 'peixes voltaram'); assert.deepStrictEqual(c2.prog(id2).album, { sardinha: 2 });
console.log('TESTES DA CÓPIA DE SEGURANÇA PASSARAM');
