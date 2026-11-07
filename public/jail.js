/* Ilha da prisão: cela grande com grades, muro e torres, cercada de mar. */
function buildJail(S, W) {
  var K = W.PRISAO, G6 = new THREE.Group(), solid = []; G6.visible = false; S.add(G6);
  function Mt(c) { return new THREE.MeshLambertMaterial({ color: c }); } function Bs(c) { return new THREE.MeshBasicMaterial({ color: c }); }
  function bx(w, h, d, m, x, y, z) { var o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); G6.add(o); return o; }
  function sol(w, h, d, m, x, y, z) { var o = bx(w, h, d, m, x, y, z); solid.push(o); return o; }
  function cy(r1, r2, h, m, x, y, z, n) { var o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, n || 8), m); o.position.set(x, y, z); G6.add(o); return o; }
  var ROCK = Mt(0x4d4a48), CON = Mt(0x8b8b8f), DARK = Mt(0x4b4b52), IRON = Mt(0x26262c), H = 4, i;
  var r = new THREE.Mesh(new THREE.CylinderGeometry(38, 42, 4, 16), ROCK); r.position.y = -2.1; r.scale.z = .8; G6.add(r); bx(50, .06, 40, Mt(0x6f6f73), 0, 0, 0); bx(K.X2 - K.X1 + 1, .02, K.Z2 - K.Z1 + 1, Mt(0x5c5a5f), (K.X1 + K.X2) / 2, .05, (K.Z1 + K.Z2) / 2);
  sol(K.X2 - K.X1 + 1, H, .5, CON, (K.X1 + K.X2) / 2, H / 2, K.Z1 - .5); sol(.5, H, K.Z2 - K.Z1 + 1, CON, K.X1 - .5, H / 2, (K.Z1 + K.Z2) / 2); sol(.5, H, K.Z2 - K.Z1 + 1, CON, K.X2 + .5, H / 2, (K.Z1 + K.Z2) / 2); bx(K.X2 - K.X1 + 2, .3, K.Z2 - K.Z1 + 2, DARK, (K.X1 + K.X2) / 2, H + .15, (K.Z1 + K.Z2) / 2);
  for (var x = K.X1 - .3; x <= K.X2 + .3; x += .55) cy(.05, .05, H, IRON, x, H / 2, K.Z2 + .45, 6); [.9, 2.4, 3.8].forEach(function (y) { bx(K.X2 - K.X1 + 1, .09, .09, IRON, (K.X1 + K.X2) / 2, y, K.Z2 + .45); });
  K.BUNK.forEach(function (x) { bx(1.2, .12, 2.6, IRON, x, .55, K.Z1 + 1.3); bx(1.1, .14, 2.5, Mt(0xc8c2b4), x, .68, K.Z1 + 1.3); bx(1.2, .12, 2.6, IRON, x, 1.8, K.Z1 + 1.3); bx(1.1, .14, 2.5, Mt(0xc8c2b4), x, 1.93, K.Z1 + 1.3); [[-.55, 0], [.55, 0], [-.55, 2.6], [.55, 2.6]].forEach(function (q) { cy(.04, .04, 2, IRON, x + q[0], 1, K.Z1 + q[1], 6); }); });
  bx(.8, .5, .8, Mt(0xe5e7eb), K.X2 - .7, .25, K.Z1 + .6); bx(.8, .6, .2, Mt(0xe5e7eb), K.X2 - .7, .75, K.Z1 + .2);
  bx(1.6, .08, .4, Bs(0xfff2c0), (K.X1 + K.X2) / 2, H - .05, (K.Z1 + K.Z2) / 2); var l = new THREE.PointLight(0xffe9c0, 1.1, 22, 1.4); l.position.set(0, 3.2, (K.Z1 + K.Z2) / 2); G6.add(l);
  [[-24, -19, 48, 1], [-24, 19, 48, 1], [-24, 0, 1, 39], [24, 0, 1, 39]].forEach(function (q) { bx(q[2], 5, q[3], CON, q[0] === -24 && q[2] > 2 ? 0 : q[0], 2.5, q[1]); });
  var lights = []; [[-23, -18], [23, -18], [-23, 18], [23, 18]].forEach(function (q, i) { cy(1.3, 1.5, 9, DARK, q[0], 4.5, q[1], 10); cy(1.8, 1.8, .3, IRON, q[0], 9.1, q[1], 10); var c = new THREE.Mesh(new THREE.ConeGeometry(4, 16, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff7c8, transparent: true, opacity: .13, side: THREE.DoubleSide, depthWrite: false })); var p = new THREE.Group(); p.position.set(q[0], 9.5, q[1]); c.position.y = -8; p.add(c); p.rotation.z = .7; G6.add(p); lights.push(p); });
  for (i = 0; i < 90; i++) { var a = i / 90 * 6.283, w = new THREE.Mesh(new THREE.TorusGeometry(.2, .03, 4, 8), IRON); w.position.set(Math.cos(a) * 34 * (Math.abs(Math.cos(a)) > .7 ? .72 : .72), 5.2, Math.sin(a) * 28 * .72); }
  var c2 = document.createElement('canvas'); c2.width = 512; c2.height = 128; var x2 = c2.getContext('2d'); x2.fillStyle = '#7f1d1d'; x2.fillRect(0, 0, 512, 128); x2.fillStyle = '#fff'; x2.font = '800 80px Arial,sans-serif'; x2.textAlign = 'center'; x2.fillText('PRISÃO', 256, 95); var p2 = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.75), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c2) })); p2.position.set(0, H + 1.2, K.Z2 + .4); G6.add(p2);
  return { group: G6, solid: solid, spots: lights };
}
