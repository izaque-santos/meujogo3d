/* vida no fundo do mar: cardumes, tubarões, arraias, tartarugas, águas-vivas, golfinhos, baleia, caranguejos e estrelas */
var MARV = (function () {
  var uT = { value: 0 }, SP = [], d0 = new THREE.Object3D(), eu = 0, cA = new THREE.Vector3(0, 0, 0), ult = 0;
  var FIM = [.25, .12], OLHO = [.75, .12];
  function rnd(s) { var v = Math.sin(s * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }

  /* textura: corpo em cima (cabeça no topo), cor das nadadeiras e do olho na faixa de baixo */
  function pinta(fn, fim) {
    var c = document.createElement('canvas'); c.width = c.height = 64; var q = c.getContext('2d');
    for (var y = 0; y < 46; y++) for (var x = 0; x < 64; x++) { var u = x / 64; q.fillStyle = fn(-Math.sin(u * 6.283), y / 46, u); q.fillRect(x, y, 1, 1); }
    q.fillStyle = fim; q.fillRect(0, 46, 32, 18); q.fillStyle = '#05070c'; q.fillRect(32, 46, 32, 18);
    var t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; return t;
  }
  function uvs(g, uv) { var p = g.attributes.uv; for (var i = 0; i < p.count; i++) p.setXY(i, uv[0], uv[1]); return g; }
  function corpo(lg, al, cauda) {
    var g = new THREE.SphereGeometry(1, 11, 7); g.rotateX(Math.PI / 2); var p = g.attributes.position, uv = g.attributes.uv;
    for (var i = 0; i < p.count; i++) { var z = p.getZ(i), f = z < 0 ? 1 + z * (cauda == null ? .6 : cauda) : 1; p.setXYZ(i, p.getX(i) * lg * f, p.getY(i) * al * f, z); uv.setY(i, .3 + uv.getY(i) * .69); }
    g.computeVertexNormals(); return g;
  }
  function placa(pts, uv) {
    var a = []; for (var i = 1; i < pts.length - 1; i++) a.push(pts[0], pts[i], pts[i + 1]);
    var f = []; a.forEach(function (q) { f.push(q[0], q[1], q[2]); });
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(f, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(a.length * 2), 2)); g.computeVertexNormals(); return uvs(g, uv || FIM);
  }
  function bola(r, x, y, z, sx, sy, sz, uv) { var g = new THREE.SphereGeometry(r, 7, 5); g.scale(sx || 1, sy || 1, sz || 1); g.translate(x, y, z); return uvs(g, uv || OLHO); }
  function junta(L) {
    var P = [], N = [], U = []; L.forEach(function (g0) { var g = g0.index ? g0.toNonIndexed() : g0; ['position', 'normal', 'uv'].forEach(function (k, n) { var a = g.attributes[k], o = [P, N, U][n]; for (var i = 0; i < a.count * a.itemSize; i++) o.push(a.array[i]); }); });
    var r = new THREE.BufferGeometry(); r.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); r.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); r.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); return r;
  }

  /* o movimento fica no sombreador: rabo balança e asas batem sem pesar o celular */
  function mat(tx, modo, am, fr, op) {
    var o = { side: THREE.DoubleSide }, m; if (tx) o.map = tx;
    if (op) { o.transparent = true; o.opacity = op; o.depthWrite = false; m = new THREE.MeshBasicMaterial(o); } else { o.emissive = 0xffffff; o.emissiveIntensity = .42; if (tx) o.emissiveMap = tx; else o.emissive = 0x6b6b6b; m = new THREE.MeshLambertMaterial(o); }
    var uA = { value: am }, uF = { value: fr }; m.defines = { MODO: modo };
    m.onBeforeCompile = function (s) {
      s.uniforms.uT = uT; s.uniforms.uA = uA; s.uniforms.uF = uF;
      s.vertexShader = 'uniform float uT;uniform float uA;uniform float uF;\n' + s.vertexShader.replace('#include <begin_vertex>', ['#include <begin_vertex>', 'float fa=0.;', '#ifdef USE_INSTANCING', 'fa=instanceMatrix[3][1]*9.;', '#endif', '#if MODO==1', 'transformed.x+=sin(uT*uF+position.z*2.6+fa)*uA*(1.-smoothstep(-1.7,.7,position.z)*.92);', '#elif MODO==2', 'float ax=abs(position.x);transformed.y+=sin(uT*uF-ax*1.8+fa)*uA*ax*ax;', '#elif MODO==3', 'float pu=.5+.5*sin(uT*uF+fa);transformed.xz*=1.-pu*.24;transformed.y-=pu*.12*min(position.y,0.);transformed.x+=sin(uT*2.+position.y*3.+fa)*.1*min(-position.y,1.5)*step(position.y,0.);', '#elif MODO==4', 'transformed.y+=sin(uT*uF+position.z*1.5+fa)*uA*(1.-smoothstep(-1.6,.4,position.z));', '#endif'].join('\n'));
    };
    return m;
  }

  /* peças de cada bicho (cabeça em +Z) */
  function peixe(lg, al, olhoZ) {
    return junta([corpo(lg, al), placa([[0, 0, -.82], [0, al * .95, -1.5], [0, al * .25, -1.25], [0, -al * .25, -1.25], [0, -al * .95, -1.5]]), placa([[0, al * .9, .3], [0, al * 1.55, -.05], [0, al * 1.2, -.75], [0, al * .55, -.7]]), placa([[0, -al * .85, .05], [0, -al * 1.35, -.2], [0, -al * .55, -.6]]), placa([[lg * .9, -al * .1, .28], [lg * 1.8, -al * .45, -.1], [lg * .9, -al * .4, -.05]]), placa([[-lg * .9, -al * .1, .28], [-lg * 1.8, -al * .45, -.1], [-lg * .9, -al * .4, -.05]]), bola(al * .15 + .02, lg * .68, al * .22, olhoZ || .62), bola(al * .15 + .02, -lg * .68, al * .22, olhoZ || .62)]);
  }
  function tubarao(martelo) {
    var L = [corpo(.2, .24, .78), placa([[0, .2, .14], [0, .62, -.28], [0, .2, -.34]]), placa([[0, .1, -.55], [0, .25, -.72], [0, .08, -.72]]), placa([[0, .04, -.92], [0, .56, -1.4], [0, .12, -1.1], [0, -.3, -1.3]]), placa([[.17, -.08, .22], [.72, -.34, -.22], [.16, -.12, -.1]]), placa([[-.17, -.08, .22], [-.72, -.34, -.22], [-.16, -.12, -.1]]), placa([[.08, -.12, -.5], [.27, -.22, -.72], [.06, -.1, -.68]]), placa([[-.08, -.12, -.5], [-.27, -.22, -.72], [-.06, -.1, -.68]])];
    if (martelo) { L.push(bola(.1, 0, .03, .92, 4.2, .42, .8, [.02, .9]), bola(.035, .42, .05, .92), bola(.035, -.42, .05, .92)); } else L.push(bola(.03, .135, .07, .72), bola(.03, -.135, .07, .72));
    return junta(L);
  }
  function arraia() {
    var c = new THREE.SphereGeometry(1, 13, 7); c.rotateX(Math.PI / 2); var p = c.attributes.position, uv = c.attributes.uv;
    for (var i = 0; i < p.count; i++) { var z = p.getZ(i), x = p.getX(i), y = p.getY(i), f = 1 - Math.abs(z) * .9; p.setXYZ(i, x * 1.15 * Math.max(.05, f + .1), y * .1, z * .78); uv.setY(i, .3 + uv.getY(i) * .69); }
    c.computeVertexNormals();
    return junta([c, placa([[.035, 0, -.7], [0, .02, -2.2], [-.035, 0, -.7]]), bola(.05, .13, .09, .35), bola(.05, -.13, .09, .35)]);
  }
  function tartaruga() {
    var c = new THREE.SphereGeometry(1, 11, 7); c.rotateX(Math.PI / 2); var p = c.attributes.position, uv = c.attributes.uv;
    for (var i = 0; i < p.count; i++) { var y = p.getY(i); p.setXYZ(i, p.getX(i) * .72, (y > 0 ? y * .42 : y * .16), p.getZ(i) * .95); uv.setY(i, .3 + uv.getY(i) * .69); }
    c.computeVertexNormals();
    return junta([c, bola(.22, 0, .02, 1.08, 1, .85, 1.3, FIM), bola(.045, .15, .08, 1.2), bola(.045, -.15, .08, 1.2), placa([[.6, 0, .55], [1.75, -.05, .05], [1.55, -.05, -.2], [.6, 0, .05]]), placa([[-.6, 0, .55], [-1.75, -.05, .05], [-1.55, -.05, -.2], [-.6, 0, .05]]), placa([[.45, 0, -.6], [1, -.03, -1.08], [.72, -.03, -1.2], [.3, 0, -.8]]), placa([[-.45, 0, -.6], [-1, -.03, -1.08], [-.72, -.03, -1.2], [-.3, 0, -.8]]), bola(.1, 0, 0, -1.02, 1, .6, 1.8, FIM)]);
  }
  function cetaceo(lg, al, bico, dorsal) {
    var L = [corpo(lg, al, .78), placa([[lg * .1, -al * .3, -.82], [lg * 4, -al * .1, -1.42], [lg * 1.6, -al * .15, -1.16], [0, -al * .15, -1.08]]), placa([[-lg * .1, -al * .3, -.82], [-lg * 4, -al * .1, -1.42], [-lg * 1.6, -al * .15, -1.16], [0, -al * .15, -1.08]]), placa([[lg * .85, -al * .3, .34], [lg * 3, -al * .95, -.06], [lg * .8, -al * .45, -.05]]), placa([[-lg * .85, -al * .3, .34], [-lg * 3, -al * .95, -.06], [-lg * .8, -al * .45, -.05]]), bola(al * .08 + .012, lg * .72, .08 * al, .68), bola(al * .08 + .012, -lg * .72, .08 * al, .68)];
    if (dorsal) L.push(placa([[0, al * .9, .05], [0, al * dorsal, -.3], [0, al * .9, -.32]]));
    if (bico) L.push(bola(.08, 0, -al * .08, 1.07, .75, .6, 2.1, FIM));
    return junta(L);
  }
  function agua() {
    var b = new THREE.SphereGeometry(1, 12, 5, 0, 6.283, 0, 1.75), L = [b];
    for (var i = 0; i < 8; i++) { var a = i * .785, x = Math.cos(a) * .55, z = Math.sin(a) * .55, c = Math.cos(a + 1.57) * .05, s = Math.sin(a + 1.57) * .05, g = new THREE.PlaneGeometry(.1, 2.2, 1, 5); g.rotateY(-a); g.translate(x, -1.2, z); L.push(g); }
    L.forEach(function (g) { uvs(g, FIM); }); return junta(L);
  }
  function siri() {
    var L = [bola(.5, 0, 0, 0, 1.25, .55, 1, FIM), bola(.08, .16, .34, .36), bola(.08, -.16, .34, .36), bola(.17, .72, .1, .48, 1.2, .8, .9, FIM), bola(.17, -.72, .1, .48, 1.2, .8, .9, FIM)];
    [-1, 1].forEach(function (d) { for (var i = 0; i < 3; i++) L.push(placa([[d * .5, 0, .2 - i * .3], [d * 1.1, -.3, .34 - i * .36], [d * .5, 0, .05 - i * .3]])); }); return junta(L);
  }
  function estrela() {
    var P = [], c = 2 * Math.PI / 5; for (var i = 0; i < 5; i++) { var a = i * c, b = a + c / 2, e = a + c; P.push(placa([[0, .16, 0], [Math.cos(a) * .36, 0, Math.sin(a) * .36], [Math.cos(b) * 1, 0, Math.sin(b) * 1]]), placa([[0, .16, 0], [Math.cos(b) * 1, 0, Math.sin(b) * 1], [Math.cos(e) * .36, 0, Math.sin(e) * .36]])); }
    return junta(P);
  }

  /* caminhos */
  function largo(a, b, c, v, yb, R) { R = R || 37; return function (t) { return [Math.sin(t * v + a) * R, yb + Math.sin(t * .4 + c) * .7, Math.sin(t * v * .73 + b) * R]; }; }
  function roda(x, z, y, r, v, f) { return function (t) { var a = t * v + f; return [x + Math.cos(a) * r, y + Math.sin(t * .6 + f) * .25, z + Math.sin(a) * r * .7]; }; }
  function segue(r, v, f, y) { return function (t) { var a = t * v + f; return [cA.x + Math.cos(a) * r, y + Math.sin(t * .35 + f) * .9, cA.z + Math.sin(a) * r]; }; }

  /* espécie: ge=forma, n=quantos, esp=tamanho da nuvem do cardume, cam=caminhos, foge=desvia do jogador */
  function bicho(g, ge, ma, n, esc, cam, esp, foge, ry, cor) {
    var im = new THREE.InstancedMesh(ge, ma, n); im.frustumCulled = false; g.add(im); var S = { im: im, n: n, cam: cam, foge: foge, ry: ry || 0, F: [] };
    for (var i = 0; i < n; i++) { var k = i * 7.31 + n; S.F.push({ gr: i % cam.length, x: (rnd(k) - .5) * esp[0], y: (rnd(k + 1) - .5) * esp[1], z: (rnd(k + 2) - .5) * esp[0], s: esc * (.82 + rnd(k + 3) * .36), f: rnd(k + 4) * 6.28, px: 0, pz: 0 }); if (cor) im.setColorAt(i, new THREE.Color(cor[i % cor.length])); }
    SP.push(S); return S;
  }
  function monta(g) {
    var hsl = function (h, s, l) { return 'hsl(' + h + ',' + s + '%,' + l + '%)'; }, rc = [[-12, 26], [10, 24], [-20, 12], [20, 10], [2, 12], [-6, -16], [16, -12], [-30, -24], [34, 22], [-34, 14]];
    var sar = pinta(function (s, l) { return hsl(205, 30, 46 + (1 - s) * 22 + (l > .2 && l < .75 && Math.abs(s) < .3 ? 9 : 0)); }, '#a9c4d6');
    var ama = pinta(function (s, l) { return hsl(50, 96, 52 - s * 6 + (l > .78 ? 8 : 0)); }, '#f5a700');
    var pal = pinta(function (s, l) { var b = Math.abs(l - .24) < .055 || Math.abs(l - .58) < .065 || l > .9; return b ? '#fff7ec' : hsl(22, 98, 52); }, '#f26b12');
    var azu = pinta(function (s, l) { var k = (s > .15 && l > .15 && l < .82 && Math.abs(s - .55) > .1); return k ? '#0b1f4d' : hsl(214, 92, 50); }, '#f9d21a');
    var anj = pinta(function (s, l) { return Math.floor(l * 9) % 2 ? '#111827' : hsl(47, 96, 58); }, '#fff3b0');
    var ros = pinta(function (s, l) { return hsl(330 + l * 30, 86, 60 - l * 8); }, '#7c3aed');
    var gar = pinta(function (s, l, u) { return hsl(16, 45, 30 + (1 - s) * 13 + (Math.sin(u * 40) * Math.sin(l * 26) > .55 ? -9 : 0)); }, '#57301c');
    var tub = pinta(function (s, l) { var bar = s < -.32; return bar ? '#eef3f6' : hsl(208, 12, 42 - s * 6 - (l < .3 && l > .22 && s > -.2 ? 9 : 0)); }, '#55646f');
    var arr = pinta(function (s, l, u) { return s < 0 ? '#e7e2d4' : hsl(30, 22, 30 + (Math.sin(u * 60) * Math.sin(l * 40) > .3 ? 12 : 0)); }, '#3e3024');
    var tar = pinta(function (s, l, u) { return hsl(95, 34, s < -.3 ? 72 : 30 + (Math.sin(u * 44) * Math.sin(l * 26) > .1 ? 13 : 0)); }, '#7f9a5d');
    var gol = pinta(function (s) { return s < -.2 ? '#e4edf3' : hsl(205, 16, 52 - s * 7); }, '#7890a0');
    var bal = pinta(function (s, l, u) { return s < -.2 ? (Math.sin(u * 90) > .2 ? '#c6d0d8' : '#8e9ba6') : hsl(214, 30, 25 - s * 4); }, '#2c3a4f');
    var cgj = pinta(function () { return '#ef4444'; }, '#ef4444');
    var P = function (ge, tx, am, fr) { return [ge, mat(tx, 1, am, fr)]; }, s;
    s = P(peixe(.17, .24), sar, .24, 15); bicho(g, s[0], s[1], 84, .24, [largo(0, 1, 2, .05, 2.4), largo(2, 4, 1, .06, 1.8), largo(4, 2, 3, .043, 3.1)], [8, 3], 3.2);
    s = P(peixe(.2, .72, .55), ama, .2, 11); bicho(g, s[0], s[1], 36, .34, [largo(1, 3, 2, .045, 1.5, 24), largo(3, 0, 1, .052, 1.1, 31), largo(5, 1, 3, .04, 1.9, 18), roda(0, 28, 1.2, 8, .16, 0)], [5.5, 2.2], 3.2);
    s = P(peixe(.3, .42), pal, .18, 13); bicho(g, s[0], s[1], 33, .24, rc.slice(0, 7).map(function (q, i) { return roda(q[0], q[1], .55 + (i % 3) * .3, 1.2 + (i % 2) * .7, .3 + i * .03, i); }), [2.2, .8], 3);
    s = P(peixe(.22, .62, .58), azu, .18, 12); bicho(g, s[0], s[1], 30, .33, [largo(2, 2, 2, .05, 1.2, 30), largo(0, 5, 4, .06, 2.2, 21), roda(-10, 18, 1.1, 7, .2, 2)], [5, 1.8], 3.2);
    s = P(peixe(.17, .85, .55), anj, .14, 9); bicho(g, s[0], s[1], 20, .44, rc.slice(3, 9).map(function (q, i) { return roda(q[0], q[1], 1.05 + (i % 2) * .4, 2.6, -.18 - i * .02, i * 2); }), [2.6, 1], 3.4);
    s = P(peixe(.28, .4), ros, .18, 12); bicho(g, s[0], s[1], 24, .25, [largo(3, 4, 1, .07, 1, 34), roda(6, 18, .9, 5, .24, 3), roda(-22, -4, 1.3, 6, -.2, 1)], [3.8, 1.4], 3.2);
    s = P(peixe(.42, .55), gar, .12, 7); bicho(g, s[0], s[1], 7, .95, [roda(-22, -8, 1.6, 10, .09, 0), roda(-14, -18, 2, 8, -.08, 2), roda(18, -20, 1.9, 9, .1, 4), roda(26, 16, 1.5, 7, -.1, 1), roda(-26, 22, 1.5, 7, .09, 3), roda(6, 4, 1.6, 8, -.07, 5), roda(-6, 30, 1.4, 6, .1, 2)], [0, 0], 4.5);
    s = P(tubarao(), tub, .36, 4.2); bicho(g, s[0], s[1], 3, 3.2, [segue(13, .19, 0, 3.1), segue(21, -.14, 2, 4.2), largo(1, 3, 2, .06, 4.8, 34)], [0, 0], 9);
    s = P(tubarao(1), tub, .34, 4.4); bicho(g, s[0], s[1], 2, 3, [segue(26, .13, 4, 3.6), largo(4, 1, 1, .055, 5, 30)], [0, 0], 9);
    bicho(g, arraia(), mat(arr, 2, .26, 1.9), 5, 1.7, [largo(0, 2, 0, .05, .25, 30), largo(2, 5, 1, .04, .35, 22), largo(5, 1, 2, .045, .3, 36), roda(4, 22, .3, 9, .13, 0), roda(-16, 4, .4, 10, -.11, 3)], [0, 0], 5.5);
    bicho(g, tartaruga(), mat(tar, 2, .17, 1.35), 5, .82, [largo(1, 1, 1, .04, 2.1, 30), largo(3, 3, 2, .035, 3, 23), largo(4, 0, 3, .043, 1.7, 15), roda(-4, 22, 2.2, 10, -.12, 2), roda(22, -2, 2.6, 12, .09, 1)], [0, 0], 4.5);
    var ag = mat(null, 3, 0, 2.1, .62); bicho(g, agua(), ag, 16, .55, [function () { return [0, 0, 0]; }], [0, 0], 0, 0, [0xf0abfc, 0x93c5fd, 0xfda4af, 0xa5f3fc, 0xfde68a, 0xc4b5fd]).agua = 1;
    bicho(g, cetaceo(.17, .2, 1, 1.75), mat(gol, 4, .2, 7), 4, 2, [segue(9, .36, 1, 4), segue(10, .36, 1.5, 4.5), segue(11, .36, 2, 3.8), largo(2, 2, 2, .09, 3.8, 30)], [0, 0], 7);
    bicho(g, cetaceo(.23, .26, 0, 1.08), mat(bal, 4, .1, 1.1), 1, 11, [function (t) { var a = t * .035 + 1; return [Math.cos(a) * 49, 6.5 + Math.sin(t * .2), Math.sin(a) * 49]; }], [0, 0], 0);
    bicho(g, siri(), mat(cgj, 0, 0, 0), 9, .2, [roda(-12, 24, -.55, 2.2, .24, 0), roda(11, 27, -.55, 1.8, -.28, 1), roda(4, 14, -.55, 2.6, .2, 2), roda(-18, 10, -.55, 2, .3, 3), roda(20, 14, -.55, 2.2, -.26, 4), roda(-5, -8, -.55, 2.4, .22, 5), roda(-28, 2, -.55, 2.5, -.2, 6), roda(16, -6, -.55, 2.2, .26, 1), roda(30, -14, -.55, 2.1, -.22, 3)].map(function (f) { return function (t) { var r = f(t); r[1] = -.55; return r; }; }), [0, 0], 0, Math.PI / 2);
    var es = bicho(g, estrela(), mat(null, 0, 0, 0), 26, .34, [function () { return [0, 0, 0]; }], [0, 0], 0, 0, [0xf97316, 0xef4444, 0xfb7185, 0xfacc15, 0xc084fc]); es.est = 1;
  }

  function passo(t, G) {
    var dt = Math.min(.05, Math.max(.001, t - ult)); ult = t; uT.value = t % 3600; var p = G.me.av.position, cam = G.cam.position, leve = !!G.leve;
    cA.x += (p.x * .6 - cA.x) * dt * .25; cA.z += (p.z * .6 - cA.z) * dt * .25;
    SP.forEach(function (S) {
      if (S.est) { if (!S.pronto) { S.pronto = 1; for (var q = 0; q < S.n; q++) { var a = rnd(q * 3.3) * 6.28, r = 7 + rnd(q * 5.1) * 36; d0.position.set(Math.cos(a) * r, -.66, Math.sin(a) * r); d0.rotation.set(0, a, 0); d0.scale.setScalar(.26 + rnd(q) * .2); d0.updateMatrix(); S.im.setMatrixAt(q, d0.matrix); } S.im.instanceMatrix.needsUpdate = true; } return; }
      var n = leve ? Math.ceil(S.n * .55) : S.n; S.im.count = n; var C = S.cam.map(function (f) { var a = f(t), b = f(t + .18), dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], h = Math.hypot(dx, dz) || 1; return { x: a[0], y: a[1], z: a[2], yaw: Math.atan2(dx, dz), pit: -Math.atan2(dy, h), cs: dz / h, sn: dx / h }; });
      for (var i = 0; i < n; i++) {
        var o = S.F[i], c = C[o.gr];
        if (S.agua) { var yy = 1 + rnd(i + 9) * 6 + Math.sin(t * .28 + o.f) * .9; d0.position.set(-38 + (rnd(i * 2.2) * 76) + Math.sin(t * .05 + o.f) * 3, yy, -38 + rnd(i * 4.4) * 76 + Math.cos(t * .05 + o.f) * 3); d0.rotation.set(Math.sin(t * .4 + o.f) * .14, 0, Math.cos(t * .3 + o.f) * .14); d0.scale.setScalar(o.s); d0.updateMatrix(); S.im.setMatrixAt(i, d0.matrix); continue; }
        var w = Math.sin(t * .8 + o.f), lx = o.x + w * .25, lz = o.z + Math.cos(t * .6 + o.f) * .3, x = c.x + lx * c.cs + lz * c.sn, y = c.y + o.y + Math.sin(t * 1.1 + o.f) * .08, z = c.z - lx * c.sn + lz * c.cs, tx = 0, tz = 0;
        if (S.foge) { for (var e = 0; e < 2; e++) { var c0 = e ? cam : p, dx = x - c0.x, dz = z - c0.z, d = Math.hypot(dx, dz) || 1, R = S.foge * (e ? 1.25 : 1); if (d < R) { var k = (R - d) * 1.1; tx += dx / d * k; tz += dz / d * k; } } o.px += (tx - o.px) * dt * 3; o.pz += (tz - o.pz) * dt * 3; x += o.px; z += o.pz; }
        d0.position.set(x, Math.max(-.2, y), z); if (S.ry) d0.position.y = y; d0.rotation.set(c.pit * .6, c.yaw + S.ry + (S.foge ? Math.sin(t * .9 + o.f) * .12 : 0), 0, 'YXZ'); d0.scale.setScalar(o.s); d0.updateMatrix(); S.im.setMatrixAt(i, d0.matrix);
      }
      S.im.instanceMatrix.needsUpdate = true;
    });
  }
  /* desce os pisos finos para ficarem logo abaixo dos pés, mantendo a ordem das camadas */
  function assenta(g) { g.traverse(function (m) { if (!m.isMesh || m.parent.position.y) return; var q = m.geometry.parameters || {}, ty = m.geometry.type, deit = Math.abs(m.rotation.x + Math.PI / 2) < .01 && /Plane|Ring|Circle/.test(ty), cai = ty === 'BoxGeometry' && !m.rotation.x && !m.rotation.z && q.height <= .3, h = cai ? q.height : 0; if (!deit && !cai) return; if (m.parent !== g && !deit && Math.max(q.width, q.depth) < 2) return; var top = m.position.y + h / 2; if (top > 0 && top <= .2) m.position.y += (top - .2) * .5 - top; }); }
  return { monta: monta, passo: passo, assenta: assenta };
})();
