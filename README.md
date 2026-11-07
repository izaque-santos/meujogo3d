# Mundo 3D

Tela de entrar, tela de personagem e o mundo: um iate à noite em alto-mar.

- `npm install`, `npm test`, `npm start` (http://localhost:3000).
- Contas: `server/accounts.js`, salvas em `DATA_DIR` e no Google Drive (`server/cloud.js`, página `/setup-drive`).
- Mundo: `server/world.js` e `shared/world.js` (paredes, assentos, bebidas e lojinha). Iate e mar: `public/yacht.js`. Depois de mudar `shared/`, rode `npm run sync`.
- Tela do jogo: `public/app.js`, `public/style.css`, desenhos em `public/hud/`.
- Boneco: `public/avatar.js`. É o arquivo a trocar quando chegar o modelo `.glb`.

- Dono do jogo: somente a conta `ADM-ISAC`. Defina `ADMIN_EMAIL` no Render com o e-mail dessa conta, para ninguém mais pegar o nome. Nomes que começam com ADM, Admin, Criador ou ISAC MODS são reservados.
- Horário do jogo: `GAME_TZ` (padrão America/Sao_Paulo). nave do ET no sábado às 20 h e Papai Noel no domingo às 21 h, indo em cada jogador online, um por vez (`shared/world.js`).
- Comandos no chat: digite `/ajuda`. Cargos: Admin, Moderador, Ajudante e VIP (`CARGOS` e `PERM` em `shared/world.js`). Só o dono mexe em dinheiro e cargos.

- Arena PvP: mapa `arena` (`public/arena.js`), tela e controles em `public/pvp.js`, regras em `server/pvp.js` e `ARENA` em `shared/world.js`. Entra pelo mapa do mundo. Dentro da arena, o botão ⚔️ CHAMAR lista quem está lá para luta, tiro ou rinha de pet, com ou sem aposta. O servidor confere golpes e tiros, segura a aposta e paga quem vencer.
- Novidades em `server/extras.js`, `public/extras.js` e `EXTRA` em `shared/world.js`: prêmio diário, trabalho em dobro no fim de semana, pet com nível, conquistas e títulos, rank semanal, guerra de clãs, torneio (`/torneio 1000 tiro`), mini-jogos, corrida valendo e boate. O bot de treino fica em `public/pvp.js`.
- Guarda do iate: `public/guarda.js` e `GUARD` em `shared/world.js` (lugar, distância, frase e tempo no chão).

## Não perder contas no Render grátis
1. Crie no GitHub um repositório **privado** chamado `mundo-3d-dados`.
2. Crie um token *fine-grained* só para esse repositório, com **Contents: Read and write**.
3. No Render, em Environment, crie `DADOS_TOKEN` (o token). `DADOS_REPO` é opcional.
4. Entre com a conta do dono: o jogo avisa se as contas estão salvas fora do Render.

Os celulares também guardam uma cópia assinada do progresso (`m3d_cofre_*`), que volta no login se o servidor perder a conta. Defina `BACKUP_SECRET` no Render se quiser uma chave própria para essa assinatura.

## APK que se atualiza sozinho
O APK abre o jogo direto de `https://mundo-3d.onrender.com` (`server.url` em `capacitor.config.json`). Cada deploy no Render já chega em todos os celulares, sem APK novo.
Só é preciso gerar outro APK se mudar o nome do app, o ícone, as permissões ou esse endereço. Sem internet ou com o servidor dormindo, aparece `public/offline.html`, que tenta de novo sozinho.
Quem ainda usa o APK antigo recebe a cada 3 minutos um aviso para baixar o novo. Coloque o link de download do APK na variável `APK_URL` do Render.
