/* Cidade residencial: bairro realista de baixa altura, sem prédios altos. */
function buildCity(S, W) {
  var root = new THREE.Group(), loader = new THREE.GLTFLoader(), cache = {}, pending = {};
  root.visible = false; S.add(root);
  var SCALE = 10;
  function mat(c, o) { return new THREE.MeshLambertMaterial(Object.assign({ color: c }, o || {})); }
  function box(w, h, d, m, x, y, z, g) { var o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); (g || root).add(o); return o; }
  function load(path) { if (cache[path]) return Promise.resolve(cache[path]); if (pending[path]) return pending[path]; pending[path] = new Promise(function (ok, no) { loader.load('/city-assets/' + path, function (q) { cache[path] = q.scene; ok(cache[path]); }, undefined, no); }); return pending[path]; }
  function add(path, x, z, sc, ry, y) { return load(path).then(function (b) { var o = b.clone(true); o.position.set(x, y || 0, z); o.rotation.y = ry || 0; o.scale.setScalar(sc || SCALE); o.traverse(function (q) { if (q.isMesh) { q.castShadow = true; q.receiveShadow = true; } }); root.add(o); return o; }).catch(function (e) { console.warn('cidade asset', path, e); }); }
  function sign(text, color, x, y, z, ry, w) { var cv = document.createElement('canvas'); cv.width = 800; cv.height = 160; var c = cv.getContext('2d'); c.fillStyle = color; c.fillRect(0, 0, 800, 160); c.fillStyle = '#fff'; c.font = '900 58px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 400, 80); var o = new THREE.Mesh(new THREE.PlaneGeometry(w || 8, (w || 8) * .2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), side: THREE.DoubleSide })); o.position.set(x, y, z); o.rotation.y = ry || 0; root.add(o); }
  var grass = mat(0x6f9560), asphalt = mat(0x30363b), sidewalk = mat(0xb9b7ae), curb = mat(0x7e8586), lane = mat(0xe8dfaa), white = mat(0xf4f1e8), glass = mat(0x8bbbd0, { transparent: true, opacity: .72 });
  box(132, .2, 132, grass, 0, -.12, 0);
  /* avenidas e ruas com calçada contínua */
  [-36, 0, 36].forEach(function (x) { box(13, .08, 128, asphalt, x, .02, 0); box(2.6, .1, 128, sidewalk, x - 8, .08, 0); box(2.6, .1, 128, sidewalk, x + 8, .08, 0); box(.15, .13, 128, curb, x - 6.6, .15, 0); box(.15, .13, 128, curb, x + 6.6, .15, 0); box(.12, .02, 128, lane, x, .08, 0); });
  [-36, 0, 36].forEach(function (z) { box(128, .08, 13, asphalt, 0, .02, z); box(128, .1, 2.6, sidewalk, 0, .08, z - 8); box(128, .1, 2.6, sidewalk, 0, .08, z + 8); box(128, .13, .15, curb, 0, .15, z - 6.6); box(128, .13, .15, curb, 0, .15, z + 6.6); box(128, .02, .12, lane, 0, .08, z); });
  /* faixas de pedestre e vagas */ [-36, 0, 36].forEach(function (x) { for (var i = -4; i <= 4; i++) box(.8, .025, .18, white, x + i * 1.1, .11, -6.1); });
  [-36, 0, 36].forEach(function (z) { for (var i = -4; i <= 4; i++) box(.18, .025, .8, white, -6.1, .11, z + i * 1.1); });
  /* postes, luminárias e árvores nas calçadas */
  function streetLight(x, z, ry) { var g = new THREE.Group(); root.add(g); var pole = new THREE.Mesh(new THREE.CylinderGeometry(.07, .1, 3.8, 8), mat(0x20252a)); pole.position.set(x, 1.9, z); g.add(pole); var arm = box(1.2, .08, .08, mat(0x20252a), x + Math.cos(ry || 0) * .5, 3.7, z + Math.sin(ry || 0) * .5, g); arm.rotation.y = ry || 0; var lamp = new THREE.Mesh(new THREE.SphereGeometry(.16, 10, 6), new THREE.MeshBasicMaterial({ color: 0xfff1bd })); lamp.position.set(x + Math.cos(ry || 0) * 1, 3.65, z + Math.sin(ry || 0) * 1); g.add(lamp); }
  [-58, -22, 14, 50].forEach(function (z) { streetLight(-8.2, z, 0); streetLight(8.2, z + 15, Math.PI); }); [-58, -22, 14, 50].forEach(function (x) { streetLight(x, -8.2, Math.PI / 2); streetLight(x + 15, 8.2, -Math.PI / 2); });
  [[-52, -52], [-20, -52], [16, -52], [48, -52], [-52, -16], [16, -16], [48, -16], [-52, 20], [-16, 20], [20, 20], [48, 20], [-52, 52], [-16, 52], [20, 52], [48, 52]].forEach(function (q, i) { add('city-suburban/' + (i % 3 ? 'tree-small.glb' : 'tree-large.glb'), q[0], q[1], SCALE * .72); });
  /* casas baixas distribuídas nos quarteirões */
  [['a', -50, -22], ['b', -22, -22], ['c', 14, -22], ['d', 46, -22], ['e', -50, 14], ['f', -22, 14], ['g', 14, 14], ['h', 46, 14], ['i', -50, 50], ['j', -22, 50], ['k', 14, 50], ['l', 46, 50]].forEach(function (q) { add('city-suburban/building-type-' + q[0] + '.glb', q[1], q[2], SCALE * .82, q[1] < 0 ? Math.PI / 2 : -Math.PI / 2); });
  /* concessionária sem prédio alto: showroom baixo com estacionamento */
  box(18, .1, 12, mat(0x374151), 18, .12, -48); box(13, 2.7, 7, mat(0xe5e7eb), 18, 1.35, -52); box(13.5, .08, 7.5, mat(0x1f2937), 18, 2.76, -52); box(11, 1.45, .08, glass, 18, 1.35, -48.45); sign('CONCESSIONÁRIA', '#0751b8', 18, 4.1, -55.6, 0, 8);
  /* imobiliária, praça e obra */
  box(15, .1, 10, mat(0x3d6b47), -18, .12, -48); add('city-suburban/building-type-m.glb', -18, -51, SCALE * .8, Math.PI); sign('IMÓVEIS', '#166534', -18, 4.2, -55.5, 0, 5.5);
  box(26, .1, 20, mat(0x789a68), 0, .1, 0); sign('PRAÇA CENTRAL', '#365314', 0, 3.5, -9.5, 0, 6);
  sign('OBRA · EMPREGOS', '#a16207', -50, 4.4, 48, 0, 8); add('city-commercial/building-g.glb', -50, 45, SCALE * .65, 0); [-54, -50, -46].forEach(function (x) { add('city-roads/construction-cone.glb', x, 38, SCALE * .7); add('city-roads/construction-barrier.glb', x, 53, SCALE * .7, Math.PI / 2); });
  /* rua principal de serviços: fachadas baixas para os pontos do jogo */
  function shop(x, z, color, title, ry) { box(10, .1, 7, mat(0x30353a), x, .12, z); box(8.5, 2.8, 5.5, mat(color), x, 1.45, z); box(7.2, 1.25, .08, glass, x, 1.35, z + (ry ? 2.72 : -2.72)); sign(title, '#' + ('000000' + color.toString(16)).slice(-6), x, 3.5, z + (ry ? 2.9 : -2.9), ry ? Math.PI : 0, 5.6); }
  shop(-48, -4, 0xb55371, 'LOJA DE ROUPAS', 0); shop(-24, -4, 0xd69b45, 'MERCADO · COMIDA', 0); shop(0, -4, 0x4d75a5, 'BANCO', 0); shop(24, -4, 0x9b633e, 'CAFE', 0); shop(48, -4, 0x8057a8, 'ACESSORIOS', 0); shop(-48, 12, 0x2f6fa3, 'HOSPITAL', 0); shop(-24, 12, 0x344b86, 'POLICIA', 0); shop(24, 12, 0x7c3aed, 'CINEMA', 0); shop(48, 12, 0x0f766e, 'ACADEMIA', 0);
  [[-40, 8], [-28, 8], [28, 8], [40, 8]].forEach(function (q, i) { box(5, .12, 3, mat([0xb45309, 0x166534, 0x7c3aed, 0xbe123c][i]), q[0], .2, q[1]); sign(['BARRACA', 'FEIRA', 'LANCHES', 'ARTESANATO'][i], '#334155', q[0], 2.6, q[1] - 1.7, 0, 3.5); });
  box(8, .12, 8, mat(0x475569), 0, .2, 6); sign('RESPAWN · CENTRO', '#14532d', 0, 3.6, 1.8, 0, 6); sign('EMPREGOS → OBRA', '#a16207', -42, 4.8, 36, 0, 7);
  /* identidade visual Mundo 3D: praça noturna neon */
  var neonB = mat(0x27145c, { emissive: 0x351080, emissiveIntensity: 1.6 }), neonP = mat(0x0b3d78, { emissive: 0x064b99, emissiveIntensity: 1.5 });
  box(28, .04, 24, mat(0x1d2234), 0, .23, 0); box(22, .08, 18, neonB, 0, .28, 0);
  function glow(x, y, z, c, d) { var l = new THREE.PointLight(c, 2.5, d || 18); l.position.set(x, y, z); root.add(l); }
  function palm(x, z) { var t = new THREE.Mesh(new THREE.CylinderGeometry(.18, .3, 5.5, 8), mat(0x6f4935)); t.position.set(x, 2.75, z); root.add(t); for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4, f = new THREE.Mesh(new THREE.SphereGeometry(1.1, 7, 5), mat(0x17633c)); f.scale.set(1.8, .12, .45); f.position.set(x + Math.cos(a) * 1.2, 5.5, z + Math.sin(a) * 1.2); f.rotation.y = -a; root.add(f); } glow(x, 4.7, z, 0x7c3cff, 12); }
  [[-12, -9], [12, -9], [-12, 9], [12, 9]].forEach(function (q) { palm(q[0], q[1]); });
  var basin = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.9, .3, 32), mat(0x272b46)); basin.position.set(0, .45, 0); root.add(basin); var water = new THREE.Mesh(new THREE.CylinderGeometry(4.9, 4.9, .08, 32), new THREE.MeshBasicMaterial({ color: 0x22baff, transparent: true, opacity: .9 })); water.position.set(0, .65, 0); root.add(water); for (var j = 0; j < 9; j++) { var jet = new THREE.Mesh(new THREE.CylinderGeometry(.08, .13, 2 + (j % 3) * .5, 8), new THREE.MeshBasicMaterial({ color: j % 2 ? 0xa855f7 : 0x38bdf8 })); var aa = j / 9 * Math.PI * 2; jet.position.set(Math.cos(aa) * 2.6, 1.5, Math.sin(aa) * 2.6); root.add(jet); } glow(0, 1.2, 0, 0x22aaff, 20);
  sign('MUNDO 3D', '#43118f', 0, 6.2, -11, 0, 10); sign('VIVA MELHOR AQUI', '#132b66', 13, 5.2, 0, -Math.PI / 2, 6);
  box(22, .1, 14, mat(0x183b42), 36, .2, 30); sign('PARQUE · LAZER', '#0f766e', 36, 3.6, 23, 0, 7); [-3, 0, 3].forEach(function (x) { palm(36 + x, 30); });
  return { group: root, solid: [] };
}
