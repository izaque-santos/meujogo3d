# Mundo 3D — ZIP de teste do mapa

Esta é uma versão mínima e separada para verificar se o repositório e o Render estão servindo o jogo corretamente. Ao abrir o endereço, entra direto em uma pequena plataforma 3D (10 × 10 unidades), sem login, cadastro ou outros mapas. O boneco é apenas um marcador de teste.

## Testar localmente

Requer Node.js 18 ou mais recente:

```bash
npm install
npm start
```

Abra `http://localhost:3000`.

## Configuração no Render

Crie ou atualize um **Web Service** conectado ao repositório GitHub que quer usar para este teste:

- Build Command: `npm install`
- Start Command: `npm start`
- Root Directory: vazio, se `package.json` estiver na raiz do repositório
- Instance: pode deixar a opção gratuita selecionada para um teste simples

O serviço usa a variável `PORT` fornecida pelo Render.

## Controles

- Celular: toque nos botões direcionais e arraste a área do cenário para girar a câmera.
- Computador: use WASD ou as setas para andar; arraste o cenário para girar a câmera.

Este protótipo é descartável e não substitui o jogo completo nem contém contas, salvamento, multiplayer ou os outros mapas. Guarde o ZIP original antes de substituir arquivos no repositório.
