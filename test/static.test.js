'use strict';
/* Todo arquivo que a página carrega (<script src>, <link href>) precisa estar na lista do servidor, senão no Render dá 404 e o jogo quebra. Rode: npm test */
const assert = require('assert'); const fs = require('fs'); const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8'), srv = fs.readFileSync(path.join(__dirname, '../server/server.js'), 'utf8');
const urls = []; html.replace(/(?:src|href)="(\/[^"]+\.(?:js|css))"/g, function (_, u) { urls.push(u); });
assert.ok(urls.length > 5, 'achou os arquivos da página');
urls.forEach(function (u) { assert.ok(srv.indexOf("'" + u + "'") >= 0, 'o servidor precisa entregar ' + u + ' (adicione em STATIC no server/server.js)'); });
// o APK só leva a pasta public: tudo que a página carrega precisa existir lá, igual ao que está em shared/
urls.forEach(function (u) { assert.ok(fs.existsSync(path.join(__dirname, '../public', u)), 'falta no APK: public' + u); });
fs.readdirSync(path.join(__dirname, '../shared')).forEach(function (f) { assert.strictEqual(fs.readFileSync(path.join(__dirname, '../public/shared', f), 'utf8'), fs.readFileSync(path.join(__dirname, '../shared', f), 'utf8'), 'rode npm run sync: public/shared/' + f + ' está diferente'); });
console.log('TESTES DOS ARQUIVOS DA PÁGINA PASSARAM (' + urls.length + ' arquivos)');
