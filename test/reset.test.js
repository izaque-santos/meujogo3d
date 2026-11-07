'use strict';
/* ESQUECI A SENHA: nome + e-mail certos trocam a senha; errado não troca; outros aparelhos saem. Rode: npm test */
const assert = require('assert');
const accountsLib = require('../server/accounts');
const A = accountsLib.create({});
const r = A.register({ name: 'Joaozinho', email: 'joao@t.com', password: 'velha123' }, '1.1.1.1'); assert.ok(r.ok);
assert.strictEqual(A.resetPassword({ name: 'Outro', email: 'joao@t.com', password: 'nova1234' }, '2.2.2.2').error.code, 'bad-reset', 'nome errado não troca');
assert.strictEqual(A.resetPassword({ name: 'Joaozinho', email: 'x@t.com', password: 'nova1234' }, '2.2.2.2').error.code, 'bad-reset', 'e-mail errado não troca');
assert.strictEqual(A.resetPassword({ name: 'Joaozinho', email: 'joao@t.com', password: '123' }, '2.2.2.2').error.code, 'bad-pass');
assert.ok(A.login({ email: 'joao@t.com', password: 'velha123' }, '1.1.1.1').ok, 'senha velha ainda vale');
const ok = A.resetPassword({ name: ' joãozinho ', email: 'JOAO@t.com', password: 'nova1234' }, '2.2.2.2'); assert.ok(ok.ok && ok.reset && ok.account.name === 'Joaozinho', 'troca (sem ligar para maiúsculas/acentos)');
assert.strictEqual(A.bySession(r.session), null, 'aparelho antigo sai');
assert.ok(A.bySession(ok.session), 'já entra com a sessão nova');
assert.strictEqual(A.login({ email: 'joao@t.com', password: 'velha123' }, '1.1.1.1').error.code, 'bad-login', 'senha velha não vale mais');
assert.ok(A.login({ email: 'joao@t.com', password: 'nova1234' }, '1.1.1.1').ok, 'senha nova vale');
for (let i = 0; i < 9; i++) A.resetPassword({ name: 'Nada', email: 'alvo@t.com', password: 'qualquer1' }, '9.9.9.' + i);
assert.strictEqual(A.resetPassword({ name: 'Nada', email: 'alvo@t.com', password: 'qualquer1' }, '8.8.8.8').error.code, 'too-many', 'trava quem fica chutando');
console.log('TESTES DE MUDAR SENHA PASSARAM');
