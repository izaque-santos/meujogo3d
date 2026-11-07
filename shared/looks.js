/* Catálogo do PROVADOR: estilo do personagem, pele, cabelo, blusa, calça, sapato e cores.
   Usado pelo servidor (aceita só valores daqui) e pelo jogo (loja e desenho do boneco). Preço 0 = grátis. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LOOKS = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var CATS = {
    style: { n: 'Personagem', e: '✨', items: {
      normal: { n: 'Normal', e: '🙂', p: 0 },
      policia: { n: 'Policial', e: '👮', p: 0 }, bombeiro: { n: 'Bombeiro', e: '🧑‍🚒', p: 0 }, medico: { n: 'Médico', e: '🧑‍⚕️', p: 0 }, coelho: { n: 'Fantasia de coelho', e: '🐰', p: 0 }, terno: { n: 'Terno', e: '🤵', p: 0 },
      verao: { n: 'Verão na Praia', e: '🏖️', p: 0, d: 'Chapéu de palha, roupa florida e chinelo' },
      surf: { n: 'Surfista', e: '🏄', p: 0, d: 'Roupa de banho e prancha nas costas' },
      cria: { n: 'Cria', e: '🧢', p: 0, d: 'Boné de aba reta, corrente de ouro e tênis' },
      skate: { n: 'Skatista', e: '🛹', p: 0, d: 'Moletom, gorro e skate nas costas' },
      gamer: { n: 'Gamer', e: '🎮', p: 0, d: 'Fone com luz e moletom neon' },
      carnaval: { n: 'Carnaval', e: '🎭', p: 0, d: 'Coroa de penas coloridas e brilho' },
      tubarao: { n: 'Fantasia de Tubarão', e: '🦈', p: 0, d: 'Capuz com dentes, barbatana e rabo' },
      polvo: { n: 'Fantasia de Polvo', e: '🐙', p: 0, d: 'Capuz roxo e tentáculos' },
      caranguejo: { n: 'Fantasia de Caranguejo', e: '🦀', p: 0, d: 'Roupa vermelha, olhinhos e garras' },
      neo: { n: 'Mundo 3D', e: '💜', p: 0, d: 'Personagem principal do jogo: jaqueta neon, tênis e cabelo novo' },
      ninja: { n: 'Ninja das Sombras', e: '🥷', p: 5000, d: 'Capuz, máscara, faixa roxa e cachecol esvoaçante' },
      pirata: { n: 'Pirata Lendário', e: '🏴‍☠️', p: 7000, d: 'Chapéu de três pontas, tapa-olho e casaco vermelho com ouro' },
      cyber: { n: 'Cyber Neon', e: '🕶️', p: 9000, d: 'Visor neon rosa, fone e jaqueta com luzes que brilham' },
      astronauta: { n: 'Astronauta Galáctico', e: '👨‍🚀', p: 12000, d: 'Traje espacial, capacete de vidro e mochila' },
      mago: { n: 'Mago Arcano', e: '🧙', p: 16000, d: 'Chapéu de estrelas, manto azul e orbe mágico flutuando' },
      samurai: { n: 'Samurai Neon', e: '⚔️', p: 22000, d: 'Elmo kabuto, armadura vermelha e katana com luz azul' },
      rainhagelo: { n: 'Rainha do Gelo', e: '❄️', p: 28000, d: 'Coroa de cristais, capa azul e brilho de gelo' },
      demonio: { n: 'Demônio Sombrio', e: '😈', p: 35000, d: 'Chifres, asas de morcego, rabo e olhos de fogo' },
      valquiria: { n: 'Valquíria Dourada', e: '🛡️', p: 45000, d: 'Elmo com asas, armadura de ouro e capa azul' },
      anjo: { n: 'Anjo Celestial', e: '😇', p: 60000, d: 'Auréola de ouro, asas de penas e brilho do céu' },
      praia: { n: 'Traje de banho', e: '🩱', p: 0, d: 'Roupa de praia' },
      aventura: { n: 'Aventureiro', e: '🧭', p: 0, d: 'Chapéu de explorador, colete, cinto, mochila e botas' },
      reiroxo: { n: 'Rei do Clã', e: '🐺', p: 0, d: 'Personagem inicial: coroa roxa, óculos escuros, roupa preta e asas negras com brilho roxo' },
      mergulhador: { n: 'Mergulhador', e: '🤿', p: 0, lv: 9999 }, viking: { n: 'Viking', e: '🪓', p: 0, lv: 9999 }, cowboy: { n: 'Cowboy', e: '🤠', p: 0, lv: 9999 }, palhaco: { n: 'Palhaço', e: '🤡', p: 0, lv: 9999 }, chef: { n: 'Chef', e: '👨‍🍳', p: 0, lv: 9999 }, heroi: { n: 'Herói Mascarado', e: '🦸', p: 0, lv: 9999 }, rei: { n: 'Rei', e: '👑', p: 0, lv: 9999 }, cavaleiro: { n: 'Cavaleiro', e: '🛡️', p: 0, lv: 9999 }, zumbi: { n: 'Zumbi', e: '🧟', p: 0, lv: 9999 }, vampiro: { n: 'Vampiro', e: '🧛', p: 0, lv: 9999 }, esqueleto: { n: 'Esqueleto', e: '💀', p: 0, lv: 9999 }, mumia: { n: 'Múmia', e: '🤕', p: 0, lv: 9999 }, alien: { n: 'Alien', e: '👽', p: 0, lv: 9999 }, robo: { n: 'Robô', e: '🤖', p: 0, lv: 9999 }, piloto: { n: 'Piloto', e: '🏎️', p: 0, lv: 9999 },
      noelr: { n: 'Roupa de Natal', e: '🎄', p: 0, lv: 9999, d: 'Evento de Natal' }, bruxa: { n: 'Roupa de Halloween', e: '🎃', p: 0, lv: 9999, d: 'Evento de Halloween' }, folia: { n: 'Roupa de Carnaval', e: '🎭', p: 0, lv: 9999, d: 'Evento de Carnaval' }, caipira: { n: 'Roupa de Festa Junina', e: '🌽', p: 0, lv: 9999, d: 'Evento de Festa Junina' },
      capitao: { n: 'Capitão da Temporada', e: '🎖️', p: 0, lv: 9999, d: 'Prêmio do passe de temporada' },
      guardiao: { n: 'Guardião da Floresta', e: '🌿', p: 0, lv: 50, d: 'Exclusivo do nível 50: coroa de folhas, manto verde e brilho de vaga-lumes' } } },
    skin: { n: 'Pele', e: '🎨', items: { s0: { n: 'Clara', p: 0, c: 0xf6d3b3 }, s1: { n: 'Média', p: 0, c: 0xf2c9a2 }, s2: { n: 'Morena', p: 0, c: 0xc68a5a }, s3: { n: 'Parda', p: 0, c: 0xa86f45 }, s4: { n: 'Negra', p: 0, c: 0x7a4a2c }, s5: { n: 'Escura', p: 0, c: 0x55321d }, s6: { n: 'Bem escura', p: 0, c: 0x3f2413 } } },
    hair: { n: 'Cabelo', e: '💇', items: {
      curto: { n: 'Curto', e: '👦', p: 0 }, coque: { n: 'Coque', e: '👩', p: 0 }, longo: { n: 'Longo', e: '👱‍♀️', p: 150 }, rabo: { n: 'Rabo de cavalo', e: '🎀', p: 200 },
      cacheado: { n: 'Cacheado', e: '🌀', p: 250 }, moicano: { n: 'Moicano', e: '🦔', p: 300 }, espetado: { n: 'Espetado (anime)', e: '⚡', p: 400 }, careca: { n: 'Careca', e: '🥚', p: 100 } } },
    top: { n: 'Blusa', e: '👕', items: {
      camiseta: { n: 'Camiseta', e: '👕', p: 0 }, regata: { n: 'Regata', e: '🎽', p: 150 }, social: { n: 'Camisa social', e: '👔', p: 350 },
      moletom: { n: 'Moletom com capuz', e: '🧥', p: 450 }, jaqueta: { n: 'Jaqueta', e: '🧥', p: 600 }, vestido: { n: 'Vestido', e: '👗', p: 500 } } },
    bot: { n: 'Calça', e: '👖', items: { calca: { n: 'Calça', e: '👖', p: 0 }, saia: { n: 'Saia', e: '👗', p: 0 }, bermuda: { n: 'Bermuda', e: '🩳', p: 120 }, short: { n: 'Short', e: '🩳', p: 150 } } },
    shoe: { n: 'Sapato', e: '👟', items: { tenis: { n: 'Tênis', e: '👟', p: 0 }, bota: { n: 'Bota', e: '🥾', p: 250 }, chinelo: { n: 'Chinelo', e: '🩴', p: 80 } } }
  };
  var PALETTE = [0xe5484d, 0x3b82f6, 0x22c55e, 0xf59e0b, 0x8b5cf6, 0xec4899, 0x111827, 0xffffff, 0x9ca3af, 0x06b6d4, 0x84cc16, 0x7c2d12];
  var HAIRC = [0x2b1d14, 0x6b3a1e, 0xa0522d, 0xe8c26a, 0x111111, 0xd1d5db, 0xff5fa2, 0x3b82f6, 0x8b5cf6, 0xef4444];
  var COLORED = { top: 'topC', bot: 'botC', shoe: 'shoeC', hair: 'hairC' };
  function defaults(gender, color) {
    var fem = gender === 'female';
    return { style: 'neo', skin: 's1', hair: fem ? 'longo' : 'curto', hairC: fem ? 1 : 4, top: 'jaqueta', topC: fem ? 5 : 6, bot: fem ? 'saia' : 'calca', botC: fem ? 6 : 1, shoe: fem ? 'bota' : 'tenis', shoeC: 7 };
  }
  function norm(lk, gender, color) {                                         // corrige qualquer valor estranho (servidor e jogo)
    var d = defaults(gender, color), o = {};
    if (!lk || typeof lk !== 'object') return d;
    Object.keys(CATS).forEach(function (k) { o[k] = typeof lk[k] === 'string' && CATS[k].items[lk[k]] ? lk[k] : d[k]; });
    ['topC', 'botC', 'shoeC'].forEach(function (k) { var v = lk[k]; o[k] = Number.isInteger(v) && v >= 0 && v < PALETTE.length ? v : d[k]; });
    o.hairC = Number.isInteger(lk.hairC) && lk.hairC >= 0 && lk.hairC < HAIRC.length ? lk.hairC : d.hairC;
    return o;
  }
  return { CATS: CATS, PALETTE: PALETTE, HAIRC: HAIRC, COLORED: COLORED, defaults: defaults, norm: norm };
});
