/* Parque de diversões em cima do mar. Os brinquedos giram pelo relógio, então todo mundo vê igual. */
function buildPark(S, W) {
  var K = W.PARK, G3 = new THREE.Group(), solid = []; G3.visible = false; S.add(G3);
  function Mt(c) { return new THREE.MeshLambertMaterial({ color: c }); } function Bs(c) { return new THREE.MeshBasicMaterial({ color: c }); }
  function bx(w, h, d, m, x, y, z, g) { var o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); (g || G3).add(o); return o; }
  function cy(r1, r2, h, m, x, y, z, n, g) { var o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, n || 12), m); o.position.set(x, y, z); (g || G3).add(o); return o; }
  function sph(r, m, x, y, z, g) { var o = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), m); o.position.set(x, y, z); (g || G3).add(o); return o; }
  var R = {}; K.RIDES.forEach(function (q) { R[q.id] = q; }); var DARK = Mt(0x3b2a4a), STEEL = Mt(0xc7ced8), PUR = Mt(0x7c3aed), RED = Mt(0xd9483b), YEL = Mt(0xfacc15), WHITE = Mt(0xffffff), cols = [0xef4444, 0xfacc15, 0x22c55e, 0x3b82f6, 0xec4899, 0xa855f7];
  bx(K.W * 2, 2.8, K.D * 2, Mt(0x3f3a48), 0, -1.45, 0); bx(K.W * 2, .05, K.D * 2, Mt(0x4a3f63), 0, 0, 0);
  for (var i = 0; i < 12; i++) for (var j = 0; j < 9; j++) if ((i + j) % 2) bx(K.W / 6, .012, K.D * 2 / 9, Mt(0x57497a), -K.W + (i + .5) * K.W / 6, .035, -K.D + (j + .5) * K.D * 2 / 9);
  // portão de entrada
  [-6, 6].forEach(function (x) { cy(.45, .55, 6.5, PUR, x, 3.25, 21, 10); sph(.7, Bs(0xffe2b0), x, 6.9, 21); }); var c = document.createElement('canvas'); c.width = 768; c.height = 128; var x = c.getContext('2d'); x.fillStyle = '#6d28d9'; x.fillRect(0, 0, 768, 128); x.fillStyle = '#fff'; x.font = '800 76px Arial,sans-serif'; x.textAlign = 'center'; x.fillText('PARQUE', 384, 92); var p = new THREE.Mesh(new THREE.PlaneGeometry(12, 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), side: THREE.DoubleSide })); p.position.set(0, 6, 21); G3.add(p);
  // roda-gigante
  var a = R.roda, wh = new THREE.Group(); wh.position.set(a.x, a.h, a.z); G3.add(wh); [-1.1, 1.1].forEach(function (d) { var t = new THREE.Mesh(new THREE.TorusGeometry(a.rad, .14, 6, 36), PUR); t.position.z = d; wh.add(t); }); for (i = 0; i < 8; i++) { var an = i / 8 * 6.283; [-1.1, 1.1].forEach(function (d) { var sp = bx(a.rad, .1, .1, STEEL, Math.cos(an) * a.rad / 2, Math.sin(an) * a.rad / 2, d, wh); sp.rotation.z = an; }); cy(.08, .08, 2.3, STEEL, Math.cos(an) * a.rad, Math.sin(an) * a.rad, 0, 6, wh).rotation.x = Math.PI / 2; }
  var bulb = new THREE.SphereGeometry(.13, 6, 4); for (i = 0; i < 28; i++) { var b = i / 28 * 6.283; [-1.1, 1.1].forEach(function (d) { var s = new THREE.Mesh(bulb, Bs(cols[i % 6])); s.position.set(Math.cos(b) * a.rad, Math.sin(b) * a.rad, d); wh.add(s); }); }
  var gon = []; for (i = 0; i < 8; i++) { var g = new THREE.Group(); G3.add(g); bx(2, .9, 1.6, Mt(cols[i % 6]), 0, -.9, 0, g); var rf = new THREE.Mesh(new THREE.ConeGeometry(1.2, .55, 8), WHITE); rf.position.y = .3; g.add(rf); gon.push(g); }
  [-1, 1].forEach(function (s) { [-1, 1].forEach(function (d) { var t = bx(.3, a.h + 1, .3, DARK, a.x + s * 2.6, a.h / 2, a.z + d * 1.4); t.rotation.z = -s * .2; }); });
  // carrossel
  var r2 = R.carro; cy(r2.rad + .4, r2.rad + .6, .5, Mt(0x7f1d6e), r2.x, .25, r2.z, 28); var car = new THREE.Group(); car.position.set(r2.x, .5, r2.z); G3.add(car); cy(.5, .5, 5.2, YEL, 0, 2.6, 0, 12, car); var roof = new THREE.Mesh(new THREE.ConeGeometry(r2.rad + 1, 2.2, 18), Mt(0xec4899)); roof.position.y = 6.2; car.add(roof); for (i = 0; i < 18; i++) { var bb = i / 18 * 6.283, st = new THREE.Mesh(bulb, Bs(cols[i % 6])); st.position.set(Math.cos(bb) * (r2.rad + .9), 5.1, Math.sin(bb) * (r2.rad + .9)); car.add(st); }
  var hor = []; for (i = 0; i < r2.slots; i++) { var ang = i / r2.slots * 6.283, hg = new THREE.Group(); hg.position.set(Math.cos(ang) * r2.rad * .72, 0, Math.sin(ang) * r2.rad * .72); hg.rotation.y = -ang; car.add(hg); cy(.05, .05, 5, STEEL, 0, 2.5, 0, 6, hg); var body = new THREE.Group(); hg.add(body); bx(.5, .5, 1.4, Mt(cols[i % 6]), 0, 1, 0, body); bx(.3, .7, .35, Mt(cols[i % 6]), 0, 1.5, -.7, body); bx(.26, .24, .5, Mt(cols[(i + 2) % 6]), 0, 1.8, -.92, body); hor.push(body); }
  // barco pirata
  var r3 = R.barco; [-1, 1].forEach(function (s) { [-1, 1].forEach(function (d) { var t = bx(.4, 8.6, .4, DARK, r3.x + s * 2.4, 4, r3.z + d * 2.6); t.rotation.z = -s * .28; }); }); bx(.3, .3, 6, STEEL, r3.x, 7.9, r3.z); var sh = new THREE.Group(); sh.position.set(r3.x, 7.9, r3.z); G3.add(sh); [-1, 1].forEach(function (d) { var ar = bx(.14, 5.4, .14, STEEL, 0, -2.7, d * 1.5, sh); }); bx(10, 1.2, 3, Mt(0x8a5a2b), 0, -5.6, 0, sh); bx(1.3, 2, 3, Mt(0x8a5a2b), -4.9, -5, 0, sh); bx(1.3, 2, 3, Mt(0x8a5a2b), 4.9, -5, 0, sh); bx(9.6, .2, 2.5, Mt(0xc69a63), 0, -4.95, 0, sh);
  // montanha-russa em volta do parque
  var q0 = K.COASTER.map(function (q) { return new THREE.Vector3(q[0], q[1], q[2]); }), curve = new THREE.CatmullRomCurve3(q0, true, 'centripetal'); G3.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 220, .16, 6, true), Mt(0xef4444))); var off = curve.getSpacedPoints(90); off.forEach(function (q, i) { if (i % 3 === 0 && q.y > .8) cy(.12, .12, q.y, DARK, q.x, q.y / 2, q.z, 6); });
  var cars = []; for (i = 0; i < 4; i++) { var cg = new THREE.Group(); G3.add(cg); bx(1.4, .6, 2, Mt(i % 2 ? 0xfacc15 : 0x22d3ee), 0, .35, 0, cg); cars.push(cg); }
  var r4 = R.russa; bx(5, .6, 4, Mt(0x7f1d6e), r4.x, .9, r4.z); cy(.1, .1, 3.5, STEEL, r4.x - 2.2, 2.6, r4.z - 1.7, 6); cy(.1, .1, 3.5, STEEL, r4.x + 2.2, 2.6, r4.z - 1.7, 6); bx(5.4, .2, 4.4, Mt(0xec4899), r4.x, 4.4, r4.z);
  // barraquinhas, bandeirinhas, árvores e luzes
  [[-6, 12, 0xef4444, 'PIPOCA'], [6, 12, 0x2563eb, 'ALGODÃO'], [-12, 6, 0xf59e0b, 'BRINDES']].forEach(function (q) { bx(3.6, 1.1, 1.8, Mt(0xf3efe6), q[0], .55, q[1]); [-1.6, 1.6].forEach(function (s) { cy(.05, .05, 2.8, DARK, q[0] + s, 1.4, q[1], 6); }); bx(4, .12, 2.4, Mt(q[2]), q[0], 2.8, q[1]); var cv = document.createElement('canvas'); cv.width = 256; cv.height = 64; var c2 = cv.getContext('2d'); c2.fillStyle = '#fff'; c2.fillRect(0, 0, 256, 64); c2.fillStyle = '#111'; c2.font = '800 38px Arial,sans-serif'; c2.textAlign = 'center'; c2.fillText(q[3], 128, 47); var pl = new THREE.Mesh(new THREE.PlaneGeometry(3, .75), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv) })); pl.position.set(q[0], 2.4, q[1] + .95); G3.add(pl); });
  [[-30, 18], [30, 18], [-30, 2], [30, 2], [-8, -21], [8, -21]].forEach(function (q) { cy(.25, .35, 4, Mt(0x5b3a22), q[0], 2, q[1], 8); sph(2.1, Mt(0x2f8f4e), q[0], 5, q[1]).scale.y = .9; sph(.5, Bs(0xffe2b0), q[0], 7.2, q[1]); });
  var pts = [], fl = [], i2; function line(a, b, n, s, list) { for (var i = 0; i <= n; i++) { var f = i / n; list.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f - Math.sin(f * 3.14) * s, a[2] + (b[2] - a[2]) * f]); } } line([-6, 6.4, 21], [-30, 6.6, 18], 26, 1, pts); line([6, 6.4, 21], [30, 6.6, 18], 26, 1, pts); line([-30, 6.6, 2], [30, 6.6, 2], 60, 2, fl); line([-6, 6, 21], [-12, 5, 7], 16, .6, fl); line([6, 6, 21], [12, 5, 7], 16, .6, fl);
  var gi = new THREE.InstancedMesh(new THREE.SphereGeometry(.09, 6, 4), Bs(0xffffff), pts.length), mx = new THREE.Matrix4(), cc = new THREE.Color(); pts.forEach(function (q, i) { mx.makeTranslation(q[0], q[1], q[2]); gi.setMatrixAt(i, mx); gi.setColorAt(i, cc.setHex(cols[i % 6])); }); gi.frustumCulled = false; G3.add(gi);
  var fg = new THREE.ConeGeometry(.24, .5, 3); fg.rotateX(Math.PI); var fi = new THREE.InstancedMesh(fg, Bs(0xffffff), fl.length); fl.forEach(function (q, i) { mx.makeTranslation(q[0], q[1] - .25, q[2]); fi.setMatrixAt(i, mx); fi.setColorAt(i, cc.setHex(cols[i % 6])); }); fi.frustumCulled = false; G3.add(fi);
  [[-18, 3, 0xffd9a0, 30, 1], [18, 3, 0xff9ee6, 26, 1], [0, 10, 0xffe2b0, 30, 1]].forEach(function (q) { var l = new THREE.PointLight(q[2], q[4], q[3], 1.3); l.position.set(q[0], 8, q[1]); G3.add(l); });
  function slot(id, s, t) {
    var d = R[id], o = { x: 0, y: 0, z: 0, ry: 0 };
    if (id === 'roda') { var a = t * d.spd + s / 8 * 6.283; o.x = d.x + Math.cos(a) * d.rad; o.y = d.h + Math.sin(a) * d.rad - 1.1; o.z = d.z; o.ry = Math.PI; }
    else if (id === 'carro') { var c = -t * d.spd + s / d.slots * 6.283, ca = c; o.x = d.x + Math.cos(ca) * d.rad * .72; o.z = d.z + Math.sin(ca) * d.rad * .72; o.y = .8 + Math.sin(t * 2 + s) * .3; o.ry = ca + Math.PI / 2 * -1 + Math.PI; }
    else if (id === 'barco') { var th = Math.sin(t * d.spd) * .95, dx = (s % 3 - 1) * 2.4, dz = s < 3 ? -.7 : .7, dy = -5.2; o.x = d.x + dx * Math.cos(th) - dy * Math.sin(th); o.y = 7.9 + dx * Math.sin(th) + dy * Math.cos(th) - .5; o.z = d.z + dz; o.ry = -Math.PI / 2; }
    else { var u = ((t * d.spd) + s * .012) % 1, q = curve.getPointAt(u), n = curve.getPointAt((u + .004) % 1); o.x = q.x; o.y = q.y + .4; o.z = q.z; o.ry = Math.atan2(-(n.x - q.x), -(n.z - q.z)); }
    return o;
  }
  function update(t) {
    wh.rotation.z = t * R.roda.spd; gon.forEach(function (g, i) { var q = slot('roda', i, t); g.position.set(q.x, q.y + 1.1, q.z); });
    car.rotation.y = t * R.carro.spd; hor.forEach(function (b, i) { b.position.y = Math.sin(t * 2 + i) * .3 - .2; }); sh.rotation.z = Math.sin(t * R.barco.spd) * .95;
    cars.forEach(function (g, i) { var q = slot('russa', i, t); g.position.set(q.x, q.y - .4, q.z); g.rotation.y = q.ry; });
  }
  return { group: G3, solid: solid, update: update, slot: slot };
}
