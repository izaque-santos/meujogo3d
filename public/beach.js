/* Praia: areia, mar raso para nadar e corrida de jet ski. */
function buildBeach(S, W) {
  var K = W.PRAIA, G5 = new THREE.Group(), solid = []; G5.visible = false; S.add(G5);
  function Mt(c) { return new THREE.MeshLambertMaterial({ color: c }); } function Bs(c) { return new THREE.MeshBasicMaterial({ color: c }); }
  function bx(w, h, d, m, x, y, z) { var o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); G5.add(o); return o; }
  function cy(r1, r2, h, m, x, y, z, n) { var o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, n || 10), m); o.position.set(x, y, z); G5.add(o); return o; }
  var cols = [0xef4444, 0xfacc15, 0x22c55e, 0x3b82f6, 0xec4899, 0xa855f7], DARK = Mt(0x5b3a22), LEAF = Mt(0x2f8f4e), i;
  bx(K.W * 2 + 2, 3, 20, new THREE.MeshLambertMaterial({ color: 0xffe6b0, emissive: 0x2e2412 }), 0, -1.5, -5); bx(K.W * 2 + 2, 1.2, K.SEA + 2, Mt(0x8a7a52), 0, -1.75, K.SEA / 2 + 4);
  var c = document.createElement('canvas'); c.width = c.height = 256; var x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#1b7fa6'); g.addColorStop(1, '#0d4f7a'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); x.strokeStyle = 'rgba(200,235,255,.3)'; for (i = 0; i < 120; i++) { var a = Math.random() * 256, b = Math.random() * 256; x.beginPath(); x.moveTo(a, b); x.lineTo(a + 16, b); x.stroke(); }
  var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 7); var w = new THREE.Mesh(new THREE.PlaneGeometry(K.W * 2 + 2, K.SEA + 4), new THREE.MeshLambertMaterial({ map: t, transparent: true, opacity: .86 })); w.rotation.x = -Math.PI / 2; w.position.set(0, -.2, K.SEA / 2 + 5); G5.add(w);
  var fm = bx(K.W * 2 + 2, .03, .9, Bs(0xeaf6ff), 0, -.16, K.SAND + .9);
  K.UMB.forEach(function (q, i) { cy(.06, .06, 3, DARK, q[0], 1.5, q[1], 6); var u = new THREE.Mesh(new THREE.ConeGeometry(2.3, .9, 10), Mt(cols[i])); u.position.set(q[0], 3, q[1]); G5.add(u); [-1, 1].forEach(function (s) { bx(1, .04, 2.2, Mt(cols[(i + 2) % 6]), q[0] + s * 1.2, .03, q[1] + 1.6); }); });
  function palm(px, pz, s) { cy(.2 * s, .36 * s, 8 * s, Mt(0x7a5a3a), px, 4 * s, pz, 7); for (var i = 0; i < 9; i++) { var a = i / 9 * 6.283, f = new THREE.Mesh(new THREE.SphereGeometry(1, 7, 5), LEAF); f.position.set(px + Math.cos(a) * 2.2 * s, 8 * s, pz + Math.sin(a) * 2.2 * s); f.scale.set(2.6 * s, .12, .55 * s); f.rotation.y = -a; f.rotation.z = -.5; G5.add(f); } }
  [[-38, -9, 1], [-30, -12, .85], [30, -12, .9], [38, -9, 1.05], [-41, 1, .9], [41, 1, .9]].forEach(function (q) { palm(q[0], q[1], q[2]); });
  bx(4.6, 1.05, 1.2, Mt(0x0e7490), 0, .53, -9.1); bx(4.8, .08, 1.4, Mt(0xffffff), 0, 1.08, -9.1); [[-2.2, -9.6], [2.2, -9.6]].forEach(function (q) { cy(.06, .06, 3, DARK, q[0], 1.5, q[1], 6); }); bx(5.4, .12, 3, Mt(0xf59e0b), 0, 3, -9.3);
  var lc = document.createElement('canvas'); lc.width = 512; lc.height = 96; var l2 = lc.getContext('2d'); l2.fillStyle = '#0e7490'; l2.fillRect(0, 0, 512, 96); l2.fillStyle = '#fff'; l2.font = '800 56px Arial,sans-serif'; l2.textAlign = 'center'; l2.fillText('JET SKI', 256, 70); var pl = new THREE.Mesh(new THREE.PlaneGeometry(4.2, .8), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lc) })); pl.position.set(0, 2.5, -7.8); G5.add(pl);
  for (i = 0; i < 30; i++) { var bb = new THREE.Mesh(new THREE.SphereGeometry(.3, 8, 6), Mt(i % 2 ? 0xef4444 : 0xffffff)); bb.position.set(-42 + (i < 15 ? 0 : 84), -.1, 7 + (i % 15) * 2.5); G5.add(bb); }
  [[-20, 2.2], [-6, 0], [14, 1.5], [26, -2]].forEach(function (q, i) { var f = new THREE.Mesh(new THREE.CylinderGeometry(.7, .9, .35, 9), Mt(0x7c7a76)); f.position.set(q[0], .15, q[1]); G5.add(f); });
  var fg = new THREE.TorusGeometry(.5, .09, 8, 16); for (i = 0; i < 5; i++) { var n = new THREE.Mesh(fg, Mt(cols[i])); n.rotation.x = Math.PI / 2; n.position.set(-34 + i * 17, .08, -3); G5.add(n); }
  [[-16, -12], [16, -12], [0, 2]].forEach(function (q) { var l = new THREE.PointLight(0xffe2b0, .95, 40, 1.3); l.position.set(q[0], 9, q[1]); G5.add(l); });
  var rings = K.RINGS.map(function (q) { var r = new THREE.Mesh(new THREE.TorusGeometry(4.2, .3, 8, 26), Bs(0xffd34d)); r.position.set(q[0], 3, q[1]); r.visible = false; G5.add(r); return r; });
  return { group: G5, solid: solid, rings: rings, sea: t };
}
