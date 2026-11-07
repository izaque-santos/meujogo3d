/* Bichos (modelos simples feitos por código) e a loja de pets. */
function petModel(id) {
  var T = { pet: ['q', 0xc98a4a, 0x7a4a24, 1], gato: ['q', 0x9ca3af, 0x4b5563, .9, 'cat'], pinguim: ['q', 0x151a24, 0xf1f5f9, 1], rena: ['q', 0x8a5a2b, 0x5b3a22, 1.25, 'rena'], urso: ['q', 0xf8fafc, 0xcbd5e1, 1.45], dragao: ['q', 0x7c3aed, 0x22d3ee, 1.1, 'dragon'],
    pitbull: ['q', 0x6b7280, 0xe5e7eb, 1.2, 'pit'], caramelo: ['q', 0xc9893f, 0xa86a2c, 1.05], porco: ['q', 0xf4a6b5, 0xe98aa0, 1.15, 'pig'], coelho: ['q', 0xf3f4f6, 0xf9a8d4, .8, 'rabbit'], hamster: ['q', 0xe0b27a, 0xfff1d6, .55, 'ham'],
    galinha: ['b', 0xf8fafc, 0xef4444, .9], galo: ['b', 0xb45309, 0xdc2626, 1.05, 'galo'], papagaio: ['b', 0x22c55e, 0xfacc15, .7, 'fly'], periquito: ['b', 0x7dd3fc, 0xfde047, .5, 'fly'], arara: ['b', 0x2563eb, 0xfacc15, .85, 'arara'], macaco: ['m', 0x7a4a24, 0xe8c9a0, .9], etinho: ['m', 0x4ade80, 0x86efac, .85] }[id];
  if (!T) return null; var out = new THREE.Group(), g = new THREE.Group(), kd = T[4], c = T[1], d2 = T[2]; g.scale.setScalar(T[3]); out.add(g);
  function Mm(x) { return new THREE.MeshLambertMaterial({ color: x }); }
  function b(w, h, l, col, x, y, z) { var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, l), Mm(col)); m.position.set(x, y, z); g.add(m); return m; }
  function s(r, col, x, y, z) { var m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), Mm(col)); m.position.set(x, y, z); g.add(m); return m; }
  function eyes(y, z, sp) { [-1, 1].forEach(function (k) { s(.03, 0x111111, k * sp, y, z); }); }
  if (T[0] === 'q') {
    var bd = s(.2, c, 0, .34, 0); bd.scale.set(1, 1, 1.7); s(.17, c, 0, .5, -.34); if (kd === 'pig') { var sn = new THREE.Mesh(new THREE.CylinderGeometry(.08, .09, .09, 10), Mm(d2)); sn.rotation.x = Math.PI / 2; sn.position.set(0, .47, -.52); g.add(sn); } else { s(.08, kd === 'pit' ? d2 : d2, 0, .45, -.47); s(.03, 0x111111, 0, .47, -.54); } eyes(.55, -.46, .08);
    if (kd === 'rena') { s(.045, 0xef4444, 0, .47, -.55); [-1, 1].forEach(function (k) { var a1 = b(.04, .34, .04, 0xd6b98c, k * .1, .76, -.3); a1.rotation.z = k * .35; var a2 = b(.03, .18, .03, 0xd6b98c, k * .2, .84, -.36); a2.rotation.x = .8; }); }
    if (kd === 'pit') { b(.3, .16, .12, d2, 0, .3, -.3); b(.32, .05, .34, 0xef4444, 0, .4, -.22); }
    [-1, 1].forEach(function (k) { if (kd === 'rabbit') { var e = s(.05, c, k * .08, .75, -.32); e.scale.set(1, 3.2, .7); s(.02, d2, k * .08, .75, -.37).scale.set(1, 3, .4); } else if (kd === 'cat') { var ct = new THREE.Mesh(new THREE.ConeGeometry(.06, .13, 4), Mm(d2)); ct.position.set(k * .1, .68, -.34); g.add(ct); } else if (kd === 'ham') s(.06, d2, k * .12, .64, -.34); else if (kd === 'pig') { var e2 = b(.09, .03, .1, d2, k * .13, .65, -.34); e2.rotation.z = k * .5; } else { var e3 = b(.07, .16, .05, d2, k * .15, .55, -.32); e3.rotation.z = k * .2; } if (kd === 'dragon') { var w = b(.5, .03, .3, d2, k * .36, .5, .02); w.rotation.z = k * .4; } });
    var tail = kd === 'rabbit' || kd === 'ham' ? s(.07, d2, 0, .4, .36) : kd === 'pig' ? new THREE.Mesh(new THREE.TorusGeometry(.06, .02, 6, 12), Mm(d2)) : b(.05, .05, .28, d2, 0, .48, .38); if (kd === 'pig') { tail.position.set(0, .45, .36); g.add(tail); } if (kd !== 'pig' && kd !== 'rabbit' && kd !== 'ham') tail.rotation.x = .7;
    out.userData.legs = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(function (q) { return b(.08, .24, .08, c, q[0] * .1, .12, q[1] * .18); }); out.userData.tail = tail;
  } else if (T[0] === 'b') {
    var fly = kd === 'fly' || kd === 'arara', bb = s(.2, c, 0, .4, 0); bb.scale.set(.85, 1, 1.25); s(.13, c, 0, .62, -.17); var bk = new THREE.Mesh(new THREE.ConeGeometry(.05, .14, 6), Mm(fly ? 0x222222 : 0xf59e0b)); bk.rotation.x = -Math.PI / 2; bk.position.set(0, .6, -.32); g.add(bk); eyes(.65, -.28, .08);
    if (!fly) { [0, 1, 2].forEach(function (i) { s(.045, d2, 0, .76, -.22 + i * .07); }); s(.04, d2, 0, .53, -.27); }
    if (kd === 'galo') [0, 1, 2, 3].forEach(function (i) { var f = b(.05, .36, .1, [0x0f766e, 0x14532d, 0xdc2626, 0xf59e0b][i], (i - 1.5) * .05, .66, .28 + i * .02); f.rotation.x = .5 + i * .12; });
    if (fly) { s(.08, d2, 0, .35, -.15); }
    var tl = b(.1, .05, kd === 'arara' ? .7 : .3, fly ? d2 : c, 0, .38, kd === 'arara' ? .5 : .32); tl.rotation.x = kd === 'arara' ? .15 : -.5;
    var wg = [-1, 1].map(function (k) { var p = new THREE.Group(); p.position.set(k * .16, .47, 0); g.add(p); var m = new THREE.Mesh(new THREE.BoxGeometry(.32, .03, .26), Mm(kd === 'arara' ? 0xdc2626 : c)); m.position.x = k * .16; p.add(m); p.userData.k = k; return p; });
    out.userData.wings = wg; out.userData.fly = fly ? 1.5 : 0; out.userData.tail = tl; out.userData.legs = [-1, 1].map(function (k) { return b(.035, .2, .035, 0xf59e0b, k * .07, .11, 0); });
  } else {
    s(.2, c, 0, .46, 0).scale.set(.9, 1.2, .8); s(.13, d2, 0, .44, -.12); s(.16, c, 0, .78, 0); s(.1, d2, 0, .75, -.1); eyes(.8, -.15, .06); [-1, 1].forEach(function (k) { s(.06, d2, k * .17, .8, 0); });
    var tt = new THREE.Mesh(new THREE.TorusGeometry(.16, .025, 6, 14, 4.6), Mm(c)); tt.position.set(0, .5, .26); tt.rotation.y = Math.PI / 2; g.add(tt);
    out.userData.legs = [[-1, .07], [1, .07], [-1, .62], [1, .62]].map(function (q, i) { return i < 2 ? b(.07, .28, .07, c, q[0] * .1, .14, 0) : b(.06, .3, .06, c, q[0] * .22, .47, 0); }); out.userData.tail = tt;
  }
  (out.userData.legs || []).forEach(function (m) { var h = m.geometry.parameters.height; m.geometry.translate(0, -h / 2, 0); m.position.y += h / 2; });   // perna gira no quadril, não no meio
  return out;
}
function buildPetShop(S, W) {
  var K = W.PETSHOP, G4 = new THREE.Group(), solid = []; G4.visible = false; S.add(G4);
  function Mt(c) { return new THREE.MeshLambertMaterial({ color: c }); } function Bs(c) { return new THREE.MeshBasicMaterial({ color: c }); }
  function bx(w, h, d, m, x, y, z) { var o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); G4.add(o); return o; }
  function sol(w, h, d, m, x, y, z) { var o = bx(w, h, d, m, x, y, z); solid.push(o); return o; }
  function cy(r1, r2, h, m, x, y, z, n) { var o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, n || 10), m); o.position.set(x, y, z); G4.add(o); return o; }
  var WOOD = Mt(0x9a6b42), DARK = Mt(0x5b3a22), WALL = Mt(0xfdf2e3), ROOF = Mt(0x16a34a), H = 3.6, cols = [0xef4444, 0xfacc15, 0x22c55e, 0x3b82f6, 0xec4899, 0xa855f7], i;
  bx(K.W * 2, 2.8, K.D * 2, Mt(0x3f3a48), 0, -1.45, 0); bx(K.W * 2, .05, K.D * 2, Mt(0x4b8c47), 0, 0, 0); bx(5, .02, K.D + 9, Mt(0xc9b48a), 0, .04, 3.5);
  sol(18, H, .3, WALL, 0, H / 2, -13); sol(.3, H, 6, WALL, -9, H / 2, -10); sol(.3, H, 6, WALL, 9, H / 2, -10); sol(6.5, H, .3, WALL, -5.75, H / 2, -7); sol(6.5, H, .3, WALL, 5.75, H / 2, -7); bx(5, .9, .3, WALL, 0, H - .45, -7); bx(18.6, .3, 6.6, ROOF, 0, H + .15, -10); bx(18, .012, 6, Mt(0xe9dcc4), 0, .05, -10);
  var l0 = new THREE.PointLight(0xfff0d0, 1.2, 18, 1.4); l0.position.set(0, 3, -10); G4.add(l0); bx(1, .06, .6, Bs(0xfff6dc), 0, H - .05, -10);
  bx(4, 1.05, 1, Mt(0x166534), K.NPC.x, .53, K.NPC.z + 1.1); bx(4.2, .08, 1.2, WALL, K.NPC.x, 1.08, K.NPC.z + 1.1);
  [-6.5, 6.5].forEach(function (x) { bx(3.2, 2, .6, WOOD, x, 1, -12.5); for (var i = 0; i < 6; i++) bx(.36, .4, .36, Mt(cols[i]), x - 1.2 + (i % 3) * 1.2, i < 3 ? .75 : 1.5, -12.3); });
  var c = document.createElement('canvas'); c.width = 768; c.height = 128; var x = c.getContext('2d'); x.fillStyle = '#15803d'; x.fillRect(0, 0, 768, 128); x.fillStyle = '#fff'; x.font = '800 74px Arial,sans-serif'; x.textAlign = 'center'; x.fillText('LOJA DE PETS', 384, 92); var p = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.65), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })); p.position.set(0, H + 1.05, -6.75); G4.add(p); bx(10.3, 1.9, .1, DARK, 0, H + 1.05, -6.84);
  for (i = 0; i < 10; i++) { var aw = bx(1.82, .08, 2.6, i % 2 ? Mt(0xffffff) : ROOF, -8.2 + i * 1.82, H - .05, -5.7); aw.rotation.x = .3; }
  // bichos em exposição
  K.SPOTS.forEach(function (q, i) { cy(.95, 1.05, .5, Mt(cols[i % 6]), q[0], .25, q[1], 18); for (var a = 0; a < 10; a++) { var an = a / 10 * 6.283; cy(.03, .03, .7, DARK, q[0] + Math.cos(an) * 1, .85, q[1] + Math.sin(an) * 1, 5); } var r = new THREE.Mesh(new THREE.TorusGeometry(1, .03, 5, 26), DARK); r.position.set(q[0], 1.2, q[1]); r.rotation.x = Math.PI / 2; G4.add(r); var m = petModel(q[2]); m.position.set(q[0], .5 + (m.userData.fly ? .2 : 0), q[1]); m.rotation.y = Math.PI * (q[0] < 0 ? -.35 : .35) + (q[1] > 6 ? Math.PI * .6 : 0); G4.add(m); });
  // plantas, ossinhos, bolas, casinhas e luzes
  function arv(x, z) { cy(.22, .3, 3.4, DARK, x, 1.7, z, 8); var f = new THREE.Mesh(new THREE.SphereGeometry(1.8, 9, 7), Mt(0x2f8f4e)); f.position.set(x, 4.2, z); f.scale.y = .85; G4.add(f); var l = new THREE.Mesh(new THREE.SphereGeometry(.28, 8, 6), Bs(0xffe2b0)); l.position.set(x, 5.8, z); G4.add(l); }
  [[-20, -11], [20, -11], [-20, 12], [20, 12]].forEach(function (q) { arv(q[0], q[1]); });
  [[-13.5, -4.5, 0xef4444], [13.5, -4.5, 0x2563eb]].forEach(function (q) { bx(2, 1.3, 2, Mt(q[2]), q[0], .65, q[1]); var rf = new THREE.Mesh(new THREE.ConeGeometry(1.7, .9, 4), Mt(0xfacc15)); rf.rotation.y = .785; rf.position.set(q[0], 1.75, q[1]); G4.add(rf); bx(.8, .8, .04, Mt(0x111827), q[0], .42, q[1] + 1.01); });
  [[-4, 3, 0xef4444], [4.2, 8, 0x3b82f6], [-3.8, 10, 0xfacc15], [3.8, -1, 0x22c55e]].forEach(function (q) { var o = new THREE.Mesh(new THREE.SphereGeometry(.2, 10, 8), Mt(q[2])); o.position.set(q[0], .22, q[1]); G4.add(o); });
  var pts = [], fl = []; function line(a, b, n, sg, L) { for (var i = 0; i <= n; i++) { var f = i / n; L.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f - Math.sin(f * 3.14) * sg, a[2] + (b[2] - a[2]) * f]); } } line([-20, 5.4, 12], [20, 5.4, 12], 44, 1, pts); line([-20, 5.4, -11], [-20, 5.4, 12], 28, .8, pts); line([20, 5.4, -11], [20, 5.4, 12], 28, .8, pts); line([-20, 5.2, -6], [20, 5.2, -6], 42, .8, fl);
  var im = new THREE.InstancedMesh(new THREE.SphereGeometry(.08, 6, 4), Bs(0xffffff), pts.length), mx = new THREE.Matrix4(), cc = new THREE.Color(); pts.forEach(function (q, i) { mx.makeTranslation(q[0], q[1], q[2]); im.setMatrixAt(i, mx); im.setColorAt(i, cc.setHex(cols[i % 6])); }); im.frustumCulled = false; G4.add(im);
  var fg = new THREE.ConeGeometry(.22, .46, 3); fg.rotateX(Math.PI); var fi = new THREE.InstancedMesh(fg, Bs(0xffffff), fl.length); fl.forEach(function (q, i) { mx.makeTranslation(q[0], q[1] - .24, q[2]); fi.setMatrixAt(i, mx); fi.setColorAt(i, cc.setHex(cols[i % 6])); }); fi.frustumCulled = false; G4.add(fi);
  [[-11, 3], [11, 3], [0, 9]].forEach(function (q) { var l = new THREE.PointLight(0xffe2b0, .9, 22, 1.4); l.position.set(q[0], 6, q[1]); G4.add(l); });
  // enfeites: flores, patinhas, potes, bolas, casinhas, luzes e arbustos
  var fc = [0xfb7185, 0xfacc15, 0xffffff, 0xa78bfa, 0xf97316], fg = new THREE.SphereGeometry(.13, 7, 5), fl, n, xx;
  [-1, 1].forEach(function (sd) { for (n = 0; n < 12; n++) { var pz = -5 + n * 1.65; bx(.9, .16, 1.3, Mt(0x6b4a2b), sd * 3.4, .08, pz); for (var f = 0; f < 4; f++) { cy(.02, .02, .3, Mt(0x2f8f4e), sd * 3.4 + (f - 1.5) * .22, .3, pz + (f % 2 ? .3 : -.3), 5); fl = new THREE.Mesh(fg, Mt(fc[(n + f) % 5])); fl.position.set(sd * 3.4 + (f - 1.5) * .22, .5, pz + (f % 2 ? .3 : -.3)); G4.add(fl); } } });
  [[-3, 9], [3, 11], [-2, 2.5], [2.4, 6], [-1.6, -3]].forEach(function (q, i) { var c0 = Mt(0xf5deb3); cy(.28, .28, .03, c0, q[0], .05, q[1], 12); [[-.25, -.3], [0, -.42], [.25, -.3]].forEach(function (d) { cy(.1, .1, .03, c0, q[0] + d[0], .05, q[1] + d[1], 8); }); });
  [[-19, -7, 0xef4444], [-19, 2, 0x3b82f6], [19, -7, 0xf97316], [19, 2, 0xa855f7]].forEach(function (q) { var cg = q[2]; bx(2.2, 1.5, 2.2, Mt(cg), q[0], .75, q[1]); var rf = cy(0, 2, 1, Mt(0x7c2d12), q[0], 2, q[1], 4); rf.rotation.y = .785; bx(.8, 1, .05, Mt(0x111827), q[0], .5, q[1] + (q[0] > 0 ? 0 : 0) + 1.11); var bo = bx(.7, .18, .18, Mt(0xffffff), q[0], 1.15, q[1] + 1.16); });
  [[-6, 9, 0xef4444], [6, 9, 0x3b82f6], [-11, 10.5, 0xfacc15], [11, 10.5, 0xec4899], [-17, 11, 0x22c55e], [17, 11, 0xf97316]].forEach(function (q) { var o = new THREE.Mesh(new THREE.SphereGeometry(.3, 12, 10), Mt(q[2])); o.position.set(q[0], .3, q[1]); G4.add(o); });
  [[-8, 12], [8, 12], [-12, 13], [12, 13]].forEach(function (q) { cy(.38, .3, .18, Mt(0x38bdf8), q[0], .1, q[1], 14); cy(.3, .3, .02, Mt(0x92400e), q[0], .2, q[1], 14); });
  for (n = 0; n < 8; n++) { xx = -21 + n * 6; [-13.8, 14].forEach(function (z) { var bu = new THREE.Mesh(new THREE.SphereGeometry(.9, 9, 7), Mt(n % 2 ? 0x2f8f4e : 0x4caf50)); bu.position.set(xx, .55, z); bu.scale.y = .75; if (Math.abs(z) > 13.9 || Math.abs(xx) > 10) G4.add(bu); }); }
  [[-16, 8], [16, 8], [-5.5, -5], [5.5, -5]].forEach(function (q) { cy(.07, .09, 3.4, Mt(0x1f2937), q[0], 1.7, q[1], 8); var lp = new THREE.Mesh(new THREE.SphereGeometry(.28, 10, 8), Bs(0xfff1c2)); lp.position.set(q[0], 3.5, q[1]); G4.add(lp); });
  for (n = 0; n < 7; n++) { var ba = new THREE.Mesh(new THREE.SphereGeometry(.34, 10, 8), Mt(cols[n % 6])); ba.scale.y = 1.2; ba.position.set((n % 2 ? 1 : -1) * (6.4 + n * .35), 4.2 + (n % 3) * .3, -6.5); G4.add(ba); }
  return { group: G4, solid: solid };
}
