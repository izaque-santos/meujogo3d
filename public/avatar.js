/* Boneco do jogo (formas simples). Quando chegar o modelo .glb, é este arquivo que será trocado. */
var AV = { geo: {}, face: {} };
var _iconCache = {};
function iconTex(ch) {
  if (_iconCache[ch]) return _iconCache[ch];
  var c = document.createElement('canvas'); c.width = c.height = 64; var x = c.getContext('2d'); x.fillStyle = 'rgba(34,197,94,.9)'; x.beginPath(); x.arc(32, 32, 30, 0, 7); x.fill(); x.font = '34px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch, 32, 34);
  return (_iconCache[ch] = new THREE.CanvasTexture(c));
}
function M(c, o) { return new THREE.MeshLambertMaterial(Object.assign({ color: c }, o || {})); }
function box(g, w, h, d, c, x, y, z, basic) { var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), basic ? new THREE.MeshBasicMaterial({ color: c }) : M(c)); m.position.set(x, y, z); g.add(m); return m; }
function cyl(g, rt, rb, h, c, x, y, z, seg) { var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 10), M(c)); m.position.set(x, y, z); g.add(m); return m; }
function sph(g, r, c, x, y, z, basic) { var m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), basic ? new THREE.MeshBasicMaterial({ color: c }) : M(c)); m.position.set(x, y, z); g.add(m); return m; }
function plane(g, w, d, c, x, y, z, basic) { var m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), basic ? new THREE.MeshBasicMaterial({ color: c }) : M(c)); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); g.add(m); return m; }
function glowTex(col) { var c = document.createElement('canvas'); c.width = c.height = 64; var x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, col); g.addColorStop(.3, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); }
function pivot(parent, x, y, z) { var p = new THREE.Group(); p.position.set(x, y, z); parent.add(p); return p; }
function label(text, y, w) {                                                         // etiqueta de nome: pílula arredondada com borda colorida
  var c = document.createElement('canvas'); c.width = 256; c.height = 64; var x = c.getContext('2d');
  x.font = 'bold 28px sans-serif'; var tw = Math.min(236, x.measureText(text).width + 34), x0 = 128 - tw / 2;
  function pill(px, py, pw, ph, r) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + pw, py, px + pw, py + ph, r); x.arcTo(px + pw, py + ph, px, py + ph, r); x.arcTo(px, py + ph, px, py, r); x.arcTo(px, py, px + pw, py, r); x.closePath(); }
  pill(x0, 10, tw, 44, 22); var gr = x.createLinearGradient(0, 10, 0, 54); gr.addColorStop(0, 'rgba(40,26,90,.88)'); gr.addColorStop(1, 'rgba(14,10,36,.88)'); x.fillStyle = gr; x.fill();
  x.lineWidth = 2.5; x.strokeStyle = 'rgba(160,140,255,.75)'; x.stroke();
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 4; x.fillText(text, 128, 33, 220);
  var t = new THREE.CanvasTexture(c), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false })); s.scale.set(1.5, .375, 1); s.position.y = y; s.renderOrder = 10; return s;
}
function creatorLabel(text, y) {                                                    // etiqueta dourada do criador: selo 👑 CRIADOR + nome
  var c = document.createElement('canvas'); c.width = 256; c.height = 96; var x = c.getContext('2d');
  var g = x.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, '#b8860b'); g.addColorStop(.5, '#ffe27a'); g.addColorStop(1, '#b8860b');
  x.fillStyle = 'rgba(30,16,60,.85)'; x.fillRect(0, 30, 256, 62); x.strokeStyle = g; x.lineWidth = 3; x.strokeRect(2, 32, 252, 58);
  x.fillStyle = g; x.fillRect(34, 2, 188, 32); x.fillStyle = '#2a1500'; x.font = 'bold 22px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('👑 CRIADOR', 128, 19, 176);
  x.fillStyle = '#ffe27a'; x.font = 'bold 28px sans-serif'; x.fillText(text, 128, 62, 240);
  var t = new THREE.CanvasTexture(c), sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false })); sp.scale.set(1.5, .5625, 1); sp.position.y = y; sp.renderOrder = 10; return sp;
}
function staffLabel(text, y) {                                                       // etiqueta azul da equipe: selo 🛡️ STAFF + "STAFF-nome"
  var c = document.createElement('canvas'); c.width = 256; c.height = 96; var x = c.getContext('2d');
  var g = x.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, '#0369a1'); g.addColorStop(.5, '#38bdf8'); g.addColorStop(1, '#0369a1');
  x.fillStyle = 'rgba(8,20,48,.88)'; x.fillRect(0, 30, 256, 62); x.strokeStyle = g; x.lineWidth = 3; x.strokeRect(2, 32, 252, 58);
  x.fillStyle = g; x.fillRect(44, 2, 168, 32); x.fillStyle = '#ffffff'; x.font = 'bold 22px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('🛡️ STAFF', 128, 19, 156);
  x.fillStyle = '#bae6fd'; x.font = 'bold 26px sans-serif'; x.fillText(text, 128, 62, 240);
  var t = new THREE.CanvasTexture(c), sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false })); sp.scale.set(1.5, .5625, 1); sp.position.y = y; sp.renderOrder = 10; return sp;
}
function avGeo(k, make) { var g = AV.geo[k]; if (!g || !g.attributes || !g.attributes.position) g = AV.geo[k] = make(); return g; }
function avMesh(parent, geo, col, x, y, z, basic) { var m = new THREE.Mesh(geo, basic ? new THREE.MeshBasicMaterial({ color: col }) : M(col)); m.position.set(x, y, z); parent.add(m); return m; }
function shade(hex, f) { var c = new THREE.Color(hex); c.r = Math.min(1, c.r * f); c.g = Math.min(1, c.g * f); c.b = Math.min(1, c.b * f); return c.getHex(); }
/* expressões: uma camada por cima do rosto, na cor da pele, que muda olhos e boca sem trocar a skin */
var EXM = {};
function exprMat(cor, k, fem) { var key = cor + k + (fem ? 1 : 0); if (EXM[key]) return EXM[key]; var c = document.createElement('canvas'); c.width = c.height = 256; var q = c.getContext('2d'), pele = '#' + ('00000' + cor.toString(16)).slice(-6); q.lineCap = 'round'; function tampa(x, y, a, b) { q.fillStyle = pele; q.beginPath(); q.ellipse(x, y, a, b, 0, 0, 6.283); q.fill(); } function boca() { tampa(128, 178, 54, 30); } function olhosFech(fel) { [86, 170].forEach(function (x) { tampa(x, 120, 36, 36); q.strokeStyle = '#2b1a12'; q.lineWidth = 8; q.beginPath(); if (fel) q.arc(x, 130, 19, Math.PI * 1.12, Math.PI * 1.88); else { q.moveTo(x - 19, 122); q.lineTo(x + 19, 122); } q.stroke(); }); } function bochecha() { q.fillStyle = 'rgba(255,110,140,.45)'; [[58, 164], [198, 164]].forEach(function (b) { q.beginPath(); q.ellipse(b[0], b[1], 22, 12, 0, 0, 6.283); q.fill(); }); }
  if (k === 'feliz') { olhosFech(true); boca(); bochecha(); q.fillStyle = '#7a1f2b'; q.beginPath(); q.moveTo(92, 166); q.quadraticCurveTo(128, 176, 164, 166); q.quadraticCurveTo(160, 206, 128, 206); q.quadraticCurveTo(96, 206, 92, 166); q.fill(); q.fillStyle = '#fff'; q.beginPath(); q.moveTo(98, 168); q.quadraticCurveTo(128, 176, 158, 168); q.lineTo(155, 178); q.quadraticCurveTo(128, 184, 101, 178); q.closePath(); q.fill(); q.fillStyle = '#f472b6'; q.beginPath(); q.ellipse(128, 198, 15, 7, 0, 0, 6.283); q.fill(); }
  if (k === 'assobio') { boca(); bochecha(); q.fillStyle = '#c75b6a'; q.beginPath(); q.ellipse(128, 180, 16, 15, 0, 0, 6.283); q.fill(); q.fillStyle = '#4a1420'; q.beginPath(); q.ellipse(128, 180, 7, 7, 0, 0, 6.283); q.fill(); [[90, -.2], [166, .2]].forEach(function (b) { q.strokeStyle = '#2b1a12'; q.lineWidth = 7; q.beginPath(); q.moveTo(b[0] - 20, 84 - b[1] * 20); q.lineTo(b[0] + 20, 84 + b[1] * 20); q.stroke(); }); }
  if (k === 'pisca') olhosFech(false);
  var t = new THREE.CanvasTexture(c); return (EXM[key] = new THREE.MeshLambertMaterial({ map: t, transparent: true, depthWrite: false })); }
function setExpr(av, k) { var u = av.userData; if (u.exK === k) return; u.exK = k; if (!u.faceOk) return; if (!u.exO) { var m = new THREE.Mesh(u.faceOk.geometry, exprMat(u.faceS, k || 'pisca', u.fem)); m.scale.copy(u.faceOk.scale).multiplyScalar(1.008); m.renderOrder = 2; u.faceOk.parent.add(m); u.exO = m; } u.exO.visible = !!k; if (k) u.exO.material = exprMat(u.faceS, k, u.fem); }
function exprPasso(p, dt, leve) { var a = p.a, u = p.av.userData, k = a === 'feliz' || a === 'assobio' ? a : ''; if (!k && !leve && (a === 'idle' || a === 'walk')) { p.exT = (p.exT === undefined ? 3 + Math.random() * 12 : p.exT) - dt; if (p.exT <= 0) { if (p.exA) { p.exA = ''; p.exT = 5 + Math.random() * 12; } else { var r = Math.random(); p.exA = r < .4 ? 'feliz' : r < .65 ? 'assobio' : 'pisca'; p.exT = p.exA === 'pisca' ? .16 : 2.4 + Math.random() * 2; } } k = p.exA || ''; } setExpr(p.av, k); if (k === 'assobio') { if (!u.nota) { u.nota = [0, 1].map(function (i) { var c = document.createElement('canvas'); c.width = c.height = 64; var q = c.getContext('2d'); q.font = '50px serif'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(i ? '🎶' : '🎵', 32, 34); var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); s.scale.set(.3, .3, 1); u.body.add(s); return s; }); } u.nt = (u.nt || 0) + dt; u.nota.forEach(function (s, i) { var f = (u.nt * .55 + i * .5) % 1; s.visible = true; s.position.set(.22 + Math.sin(f * 6) * .08, 1.62 + f * .7, -.18); s.material.opacity = 1 - f; }); } else if (u.nota) u.nota.forEach(function (s) { s.visible = false; }); }
function faceTex(fem, style) {
  style = style === 'neo' || style === 'anjo' || style === 'demonio' || style === 'rainhagelo' || style === 'cyber' || style === 'valquiria' ? 'anime' : style === 'ninja' || style === 'pirata' || style === 'astronauta' || style === 'mago' || style === 'samurai' ? 'normal' : style === 'chibi' || style === 'princesa' || style === 'gatinha' || style === 'bruxinha' || style === 'fadinha' ? 'anime' : style === 'piloto' || style === 'cavaleiro' ? 'normal' : style || 'normal'; var key = style + (fem ? 1 : 0);
  if (AV.face[key]) return AV.face[key];
  var c = document.createElement('canvas'); c.width = c.height = 256; var q = c.getContext('2d');
  function blush(a) { q.fillStyle = 'rgba(255,110,140,' + a + ')'; [[60, 168], [196, 168]].forEach(function (b) { q.beginPath(); q.ellipse(b[0], b[1], 22, 11, 0, 0, 6.283); q.fill(); }); }
  if (style === 'zumbi') {                                                           // um olho grande e outro meio fechado, pontos na bochecha, boca torta
    q.fillStyle = '#fff8d0'; q.beginPath(); q.ellipse(84, 116, 26, 28, 0, 0, 6.283); q.fill(); q.fillStyle = '#5b0f0f'; q.beginPath(); q.arc(90, 122, 7, 0, 6.283); q.fill();
    q.fillStyle = '#fff8d0'; q.beginPath(); q.ellipse(170, 124, 20, 10, .2, 0, 6.283); q.fill(); q.fillStyle = '#5b0f0f'; q.beginPath(); q.arc(168, 126, 5, 0, 6.283); q.fill();
    q.strokeStyle = '#2d3a20'; q.lineWidth = 4; q.beginPath(); q.moveTo(186, 150); q.lineTo(206, 176); q.stroke(); for (var z2 = 0; z2 < 4; z2++) { q.beginPath(); q.moveTo(186 + z2 * 6, 168 - z2 * 7); q.lineTo(204 + z2 * 6, 156 - z2 * 7); q.stroke(); }
    q.fillStyle = '#2a0d0d'; q.beginPath(); q.moveTo(96, 176); q.lineTo(118, 170); q.lineTo(140, 182); q.lineTo(162, 174); q.lineTo(160, 188); q.lineTo(100, 190); q.closePath(); q.fill();
    q.fillStyle = '#f5f0d0'; q.fillRect(116, 176, 8, 9); q.fillRect(142, 179, 8, 8);
  } else if (style === 'vampiro') {                                                  // olhos vermelhos, sobrancelhas em V, presas
    [[86, 1], [170, -1]].forEach(function (e) { q.fillStyle = '#fff'; q.beginPath(); q.ellipse(e[0], 120, 20, 18, 0, 0, 6.283); q.fill(); var gr = q.createRadialGradient(e[0], 122, 2, e[0], 122, 14); gr.addColorStop(0, '#ffeb3b'); gr.addColorStop(.4, '#ef4444'); gr.addColorStop(1, '#7f1d1d'); q.fillStyle = gr; q.beginPath(); q.arc(e[0], 122, 13, 0, 6.283); q.fill(); q.fillStyle = '#111'; q.fillRect(e[0] - 2, 112, 4, 20);
      q.strokeStyle = '#111'; q.lineWidth = 8; q.lineCap = 'round'; q.beginPath(); q.moveTo(e[0] - e[1] * 24, 90); q.lineTo(e[0] + e[1] * 16, 104); q.stroke(); });
    q.strokeStyle = '#7f1d1d'; q.lineWidth = 6; q.beginPath(); q.moveTo(100, 172); q.quadraticCurveTo(128, 186, 156, 172); q.stroke();
    q.fillStyle = '#ffffff'; [[112, 1], [144, -1]].forEach(function (f) { q.beginPath(); q.moveTo(f[0] - 6, 176); q.lineTo(f[0] + 6, 177); q.lineTo(f[0], 196); q.closePath(); q.fill(); });
  } else if (style === 'esqueleto') {                                                // caveira: buracos dos olhos, nariz e dentes
    q.fillStyle = '#111'; [[84], [172]].forEach(function (e) { q.beginPath(); q.ellipse(e[0], 120, 28, 30, 0, 0, 6.283); q.fill(); });
    q.beginPath(); q.moveTo(128, 140); q.lineTo(116, 166); q.lineTo(140, 166); q.closePath(); q.fill();
    q.fillRect(92, 182, 72, 22); q.fillStyle = '#f3f0e6'; for (var t2 = 0; t2 < 6; t2++) q.fillRect(95 + t2 * 12, 184, 9, 18);
  } else if (style === 'mumia') {                                                    // faixas cruzando o rosto, um olho brilhando
    q.strokeStyle = 'rgba(150,130,95,.75)'; q.lineWidth = 3; for (var b2 = -40; b2 < 300; b2 += 16) { q.beginPath(); q.moveTo(0, b2); q.lineTo(256, b2 - 40); q.stroke(); }
    q.fillStyle = '#1a1208'; q.fillRect(56, 106, 144, 28); var ge = q.createRadialGradient(172, 120, 1, 172, 120, 14); ge.addColorStop(0, '#fff7a8'); ge.addColorStop(1, 'rgba(255,200,0,0)'); q.fillStyle = ge; q.beginPath(); q.arc(172, 120, 14, 0, 6.283); q.fill();
    q.fillStyle = '#e6dcc2'; q.fillRect(56, 118, 70, 6);
  } else if (style === 'alien') {                                                    // olhos pretos enormes e inclinados
    [[84, -.5], [172, .5]].forEach(function (e) { q.fillStyle = '#05050a'; q.beginPath(); q.ellipse(e[0], 122, 30, 46, e[1], 0, 6.283); q.fill(); q.fillStyle = 'rgba(160,255,200,.6)'; q.beginPath(); q.ellipse(e[0] - 8, 104, 8, 12, e[1], 0, 6.283); q.fill(); });
    q.strokeStyle = '#1f5a1f'; q.lineWidth = 4; q.beginPath(); q.moveTo(118, 188); q.lineTo(138, 188); q.stroke();
  } else if (style === 'abobora') {                                                  // rosto entalhado que brilha
    q.fillStyle = '#ffcc33'; q.shadowColor = '#ff9900'; q.shadowBlur = 18;
    [[84, 1], [172, -1]].forEach(function (e) { q.beginPath(); q.moveTo(e[0] - 24, 140); q.lineTo(e[0], 96); q.lineTo(e[0] + 24, 140); q.closePath(); q.fill(); });
    q.beginPath(); q.moveTo(118, 160); q.lineTo(128, 142); q.lineTo(138, 160); q.closePath(); q.fill();
    q.beginPath(); q.moveTo(60, 176); for (var m2 = 0; m2 <= 8; m2++) q.lineTo(60 + m2 * 17, m2 % 2 ? 196 : 182); q.lineTo(196, 176); q.quadraticCurveTo(128, 236, 60, 176); q.closePath(); q.fill(); q.shadowBlur = 0;
  } else if (style === 'anime') {                                                           // olhos grandes e altos, vários brilhos, boquinha pequena
    [[84, 1], [172, -1]].forEach(function (e) {
      var ex = e[0], ey = 122; q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(ex, ey, 26, 36, 0, 0, 6.283); q.fill();
      var gi = q.createLinearGradient(0, ey - 30, 0, ey + 34); gi.addColorStop(0, fem ? '#5b21b6' : '#1e3a8a'); gi.addColorStop(1, fem ? '#ec4899' : '#38bdf8'); q.fillStyle = gi; q.beginPath(); q.ellipse(ex, ey + 4, 20, 30, 0, 0, 6.283); q.fill();
      q.fillStyle = '#0a0612'; q.beginPath(); q.ellipse(ex, ey + 6, 9, 15, 0, 0, 6.283); q.fill();
      q.fillStyle = '#fff'; q.beginPath(); q.ellipse(ex - 8, ey - 10, 8, 10, 0, 0, 6.283); q.fill(); q.beginPath(); q.arc(ex + 8, ey + 18, 4, 0, 6.283); q.fill();
      q.strokeStyle = '#1a0f12'; q.lineWidth = 7; q.lineCap = 'round'; q.beginPath(); q.moveTo(ex - 28, ey - 30); q.quadraticCurveTo(ex, ey - 44, ex + 28, ey - 34); q.stroke();
      if (fem) { q.lineWidth = 4; q.beginPath(); q.moveTo(ex + e[1] * -24, ey - 30); q.lineTo(ex + e[1] * -36, ey - 38); q.stroke(); }
    });
    blush(.4); q.strokeStyle = '#a43a4a'; q.lineWidth = 5; q.beginPath(); q.moveTo(120, 186); q.quadraticCurveTo(128, 192, 136, 186); q.stroke();
  } else if (style === 'desenho') {                                                  // olhos redondos de desenho e sorrisão
    [[88], [168]].forEach(function (e) { var ex = e[0], ey = 112; q.fillStyle = '#fff'; q.strokeStyle = '#111'; q.lineWidth = 6; q.beginPath(); q.ellipse(ex, ey, 30, 34, 0, 0, 6.283); q.fill(); q.stroke(); q.fillStyle = '#111'; q.beginPath(); q.arc(ex + 6, ey + 6, 12, 0, 6.283); q.fill(); q.fillStyle = '#fff'; q.beginPath(); q.arc(ex + 10, ey + 1, 4, 0, 6.283); q.fill(); });
    q.fillStyle = '#7a1f2b'; q.beginPath(); q.arc(128, 168, 34, .1 * Math.PI, .9 * Math.PI); q.closePath(); q.fill(); q.fillStyle = '#ff7a8a'; q.beginPath(); q.ellipse(128, 190, 16, 8, 0, 0, 6.283); q.fill();
    q.strokeStyle = '#111'; q.lineWidth = 6; q.beginPath(); q.arc(128, 168, 34, .1 * Math.PI, .9 * Math.PI); q.closePath(); q.stroke(); blush(.3);
  } else {
    [[86, 1], [170, -1]].forEach(function (e) {
      var ex = e[0], ey = 118;
      q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(ex, ey, 22, 26, 0, 0, 6.283); q.fill();
      var gi = q.createRadialGradient(ex, ey + 4, 2, ex, ey + 4, 18); gi.addColorStop(0, fem ? '#7a4a2a' : '#4a3424'); gi.addColorStop(1, fem ? '#3a1c0c' : '#1c120a'); q.fillStyle = gi; q.beginPath(); q.ellipse(ex, ey + 4, 16, 19, 0, 0, 6.283); q.fill();
      q.fillStyle = '#0a0606'; q.beginPath(); q.ellipse(ex, ey + 5, 8, 10, 0, 0, 6.283); q.fill();
      q.fillStyle = '#ffffff'; q.beginPath(); q.arc(ex - 6, ey - 4, 6, 0, 6.283); q.fill(); q.beginPath(); q.arc(ex + 6, ey + 12, 3, 0, 6.283); q.fill();
      q.strokeStyle = '#2a1a12'; q.lineCap = 'round'; q.lineWidth = fem ? 5 : 8; q.beginPath(); q.moveTo(ex - 20, ey - 40); q.quadraticCurveTo(ex, ey - 48, ex + 20, ey - 40); q.stroke();
      if (fem) { q.lineWidth = 4; q.beginPath(); q.moveTo(ex + e[1] * -20, ey - 18); q.lineTo(ex + e[1] * -30, ey - 26); q.stroke(); q.beginPath(); q.moveTo(ex + e[1] * -22, ey - 10); q.lineTo(ex + e[1] * -33, ey - 14); q.stroke(); }
    });
    blush(fem ? .35 : .22); q.strokeStyle = fem ? '#c2415b' : '#8a3a2e'; q.lineWidth = 6; q.lineCap = 'round'; q.beginPath(); q.arc(128, 160, 22, .25 * Math.PI, .75 * Math.PI); q.stroke();
    if (fem) { q.fillStyle = 'rgba(214,62,98,.85)'; q.beginPath(); q.ellipse(128, 180, 10, 4, 0, 0, 6.283); q.fill(); }
  }
  var t = new THREE.CanvasTexture(c); AV.face[key] = t; return t;
}
function makeAvatar(gender, color, name, adm, look, stf) {
  var outer = new THREE.Group(), g = new THREE.Group(), fem = gender === 'female'; outer.add(g);
  var sh = new THREE.Mesh(avGeo('shadow', function () { return new THREE.CircleGeometry(.36, 20); }), new THREE.MeshBasicMaterial({ map: glowTex('rgba(0,0,0,.55)'), transparent: true, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.y = .065; sh.renderOrder = -1; outer.add(sh);
  var head = pivot(g, 0, 1.6, 0), sx = fem ? .24 : .3;
  var armL = pivot(g, -sx, 1.34, 0), armR = pivot(g, sx, 1.34, 0), elL = pivot(armL, 0, -.3, 0), elR = pivot(armR, 0, -.3, 0);
  var legL = pivot(g, -.1, .76, 0), legR = pivot(g, .1, .76, 0);
  var tag = adm ? creatorLabel(name || '', 2.45) : stf ? staffLabel('STAFF-' + (name || ''), 2.3) : label(name || '', 2.12); g.add(tag);
  if (adm) {                                                                       // coroa de rei do dono do servidor, flutuando sobre a cabeça
    var cr = new THREE.Group(), OU = new THREE.MeshPhongMaterial({ color: 0xffc72e, emissive: 0x6b4300, shininess: 110 }); cr.position.y = 2.02; cr.scale.setScalar(.85); var aro = new THREE.Mesh(new THREE.CylinderGeometry(.17, .15, .1, 18, 1, true), OU); OU.side = THREE.DoubleSide; cr.add(aro); var GE = [0xef4444, 0x3b82f6, 0x22c55e];
    for (var ci = 0; ci < 6; ci++) { var ca = ci / 6 * 6.283, pt = new THREE.Mesh(new THREE.ConeGeometry(.05, .15, 6), OU); pt.position.set(Math.sin(ca) * .165, .11, Math.cos(ca) * .165); cr.add(pt); var bo = new THREE.Mesh(new THREE.SphereGeometry(.021, 8, 6), OU); bo.position.set(Math.sin(ca) * .165, .195, Math.cos(ca) * .165); cr.add(bo); var ge = new THREE.Mesh(new THREE.SphereGeometry(.024, 8, 6), new THREE.MeshPhongMaterial({ color: GE[ci % 3], emissive: GE[ci % 3], emissiveIntensity: .45, shininess: 120 })); ge.position.set(Math.sin(ca) * .172, 0, Math.cos(ca) * .172); cr.add(ge); } g.add(cr); }
  var icon = new THREE.Sprite(new THREE.SpriteMaterial({ map: iconTex('🔊'), transparent: true, depthTest: false })); icon.scale.set(.45, .45, 1); icon.position.y = adm ? 2.95 : stf ? 2.8 : 2.52; icon.visible = false; icon.renderOrder = 11; g.add(icon);
  g.userData = { armL: armL, armR: armR, elL: elL, elR: elR, fem: fem, legL: legL, legR: legR, head: head, body: g, phase: Math.random() * 6, speakIcon: icon, tag: tag, tagY: tag.position.y, iconY: icon.position.y, gender: gender, color: color };
  outer.userData = g.userData;
  dressAvatar(outer, look);
  return outer;
}
function dressAvatar(av, lkIn) {
  var u = av.userData, fem = u.fem; if (lkIn !== undefined || !('lookBase' in u)) u.lookBase = lkIn; var lk = u.jobK ? jobLook(u.jobK, fem, u.jobLv) : LOOKS.norm(lkIn, u.gender, u.color); if (!u.jobK && SKINF[lk.style]) lk = Object.assign({}, lk, SKINF[lk.style]); var key = JSON.stringify(lk);
  if (u.lookKey === key) return; u.lookKey = key; u.look = lk;
  u.faceOk = null; u.exO = null; u.exK = '';
  var hosts = { body: u.body, head: u.head, armL: u.armL, armR: u.armR, elL: u.elL, elR: u.elR, legL: u.legL, legR: u.legR }, L = {};
  var keepWear = u.wearObjs ? ['head', 'face'].map(function (sl) { return u.wearObjs[sl]; }).filter(Boolean) : [];
  Object.keys(hosts).forEach(function (k) {                                          // tira a roupa velha (sem mexer em pet, montaria, chapéu ou item na mão)
    hosts[k].children.filter(function (c) { return c.name === 'look'; }).forEach(function (old) { hosts[k].remove(old); old.traverse(function (o) { if (o.material) o.material.dispose(); }); });   // só a roupa deste pedaço (não a da cabeça/braços)
    L[k] = new THREE.Group(); L[k].name = 'look'; hosts[k].add(L[k]);
  });
  var st = lk.style, robo = st === 'robo', metal = 0xa8b0bd, SKIN = { zumbi: 0x86a873, vampiro: 0xf3eeea, esqueleto: 0xf3f0e6, mumia: 0xe6dcc2, alien: 0x7ddc6a };
  var skin = robo ? metal : SKIN[st] || LOOKS.CATS.skin.items[lk.skin].c;
  var top = LOOKS.PALETTE[lk.topC], topHi = shade(top, 1.3), bot = LOOKS.PALETTE[lk.botC], shoe = LOOKS.PALETTE[lk.shoeC], hair = LOOKS.HAIRC[lk.hairC];
  if (st === 'esqueleto') { top = 0x111111; topHi = 0x222222; bot = 0x111111; }                      // roupa preta para os ossos aparecerem
  if (st === 'mumia') { top = 0xd8ccae; topHi = 0xe6dcc2; bot = 0xd8ccae; shoe = 0xb8a98a; }
  if (st === 'zumbi') { top = shade(top, .7); bot = shade(bot, .7); }                                 // roupa velha e encardida
  if (st === 'piloto') { top = 0x111827; topHi = 0x1f2937; bot = 0x111827; shoe = 0x0b0b10; }               // jaqueta e calça pretas de piloto
  var SOUT = { policia: [0x1e3a8a, 0x172554, 0x111111], bombeiro: [0xb91c1c, 0x7f1d1d, 0x111111], medico: [0xf8fafc, 0xe0f2fe, 0xffffff], coelho: [0xfbcfe8, 0xfbcfe8, 0xfda4af], terno: [0x1f2937, 0x111827, 0x111111], aventura: fem ? [0x2f6f73, 0x6b5a3e, 0x4a2f1b] : [0xd8c7a3, 0x5f5138, 0x4a2f1b], reiroxo: [0x0b0a12, 0x09080f, 0x6d28d9], guardiao: [0x166534, 0x14532d, 0x422006], anjo: [0xffffff, 0xfef9c3, 0xfde68a], demonio: [0x1c0a0a, 0x7f1d1d, 0x111111], samurai: [0x111827, 0x7f1d1d, 0x111111], ninja: [0x111118, 0x111118, 0x111118], astronauta: [0xf1f5f9, 0xe5e7eb, 0x9ca3af],
    rainhagelo: [0xe0f2fe, 0xbae6fd, 0xffffff], pirata: [0xfef3c7, 0x3f2a1a, 0x111111], cyber: [0x18181b, 0x111827, 0xec4899], mago: [0x1e3a8a, 0x1e3a8a, 0x3f2a1a], valquiria: [0xe5e7eb, 0x1e3a8a, 0x92400e] }[st];
  if (JOBC[st]) { var jc = JOBC[st]; top = jc[0]; bot = jc[1]; shoe = jc[2]; topHi = jc[3] || shade(top, 1.12); }
  if (SOUT) { top = SOUT[0]; topHi = shade(top, 1.15); bot = SOUT[1]; shoe = SOUT[2]; }
  if (st === 'cavaleiro') { top = 0x374151; topHi = 0x4b5563; bot = 0x1f2937; shoe = 0x1f2937; }             // armadura escura
  var tw = fem ? .19 : .235, longSl = lk.top === 'social' || lk.top === 'moletom' || lk.top === 'jaqueta', dress = lk.top === 'vestido';
  /* --- tronco e blusa --- */
  var B = L.body;
  var torso = avMesh(B, avGeo('torso' + fem, function () { return new THREE.CylinderGeometry(tw, tw * .82, .58, 14); }), top, 0, 1.08, 0); torso.scale.z = .66;
  avMesh(B, avGeo('shoulder' + fem, function () { return new THREE.SphereGeometry(tw, 14, 8, 0, 6.283, 0, Math.PI / 2); }), lk.top === 'regata' ? skin : lk.top === 'jaqueta' ? top : top, 0, 1.36, 0).scale.set(1, .35, .66);
  avMesh(B, avGeo('neck', function () { return new THREE.CylinderGeometry(.06, .07, .14, 10); }), skin, 0, 1.43, 0);
  if (lk.top === 'camiseta' || lk.top === 'regata') { var ch = avMesh(B, avGeo('chest' + fem, function () { return new THREE.CylinderGeometry(tw * 1.005, tw * .95, .1, 14, 1, true); }), topHi, 0, 1.2, 0); ch.scale.z = .67; }
  if (lk.top === 'regata') [-1, 1].forEach(function (sd) { avMesh(B, avGeo('strap', function () { return new THREE.BoxGeometry(.05, .04, .3); }), topHi, sd * tw * .55, 1.37, 0); });
  if (lk.top === 'social' && st.slice(0, 2) !== 'w_') { avMesh(B, avGeo('collar', function () { return new THREE.BoxGeometry(.2, .06, .05); }), 0xffffff, 0, 1.36, -tw * .62); var tie = avMesh(B, avGeo('tie', function () { return new THREE.BoxGeometry(.06, .34, .02); }), 0x991b1b, 0, 1.18, -tw * .68); for (var bt = 0; bt < 3; bt++) avMesh(B, avGeo('btn', function () { return new THREE.SphereGeometry(.012, 6, 4); }), 0xffffff, .04, 1.25 - bt * .1, -tw * .67); }
  if (lk.top === 'moletom') { var hood = avMesh(B, avGeo('hood', function () { return new THREE.SphereGeometry(.16, 12, 8, 0, 6.283, 0, Math.PI * .6); }), shade(top, .85), 0, 1.38, .13); hood.rotation.x = 1.9; avMesh(B, avGeo('pocket', function () { return new THREE.BoxGeometry(.26, .12, .02); }), shade(top, .85), 0, .93, -tw * .64); [-1, 1].forEach(function (sd) { avMesh(B, avGeo('string', function () { return new THREE.BoxGeometry(.012, .14, .012); }), 0xffffff, sd * .04, 1.3, -tw * .66); }); }
  if (lk.top === 'jaqueta') avMesh(B, avGeo('jshirt' + fem, function () { return new THREE.BoxGeometry(tw * .62, .58, .03); }), 0xf5f5f5, 0, 1.08, -tw * .6);
  if (lk.top === 'jaqueta') [-1, 1].forEach(function (sd) { var pn = avMesh(B, avGeo('jpanel' + fem, function () { return new THREE.BoxGeometry(tw * .62, .6, .04); }), top, sd * tw * .55, 1.08, -tw * .62); var lap = avMesh(B, avGeo('lapel', function () { return new THREE.BoxGeometry(.07, .16, .03); }), shade(top, .8), sd * .07, 1.3, -tw * .66); lap.rotation.z = sd * .4; avMesh(B, avGeo('jside' + fem, function () { return new THREE.BoxGeometry(.05, .6, tw * 1.25); }), top, sd * tw * .92, 1.08, 0); });
  if (dress) { avMesh(B, avGeo('dressSkirt', function () { return new THREE.CylinderGeometry(.2, .36, .5, 18); }), top, 0, .66, 0).scale.z = .85; avMesh(B, avGeo('sash', function () { return new THREE.CylinderGeometry(tw * .84, tw * .84, .05, 14); }), topHi, 0, .82, 0).scale.z = .66; }
  else if (lk.bot === 'saia') avMesh(B, avGeo('skirt', function () { return new THREE.CylinderGeometry(.18, .33, .34, 16); }), bot, 0, .8, 0).scale.z = .8;
  else { var hip = avMesh(B, avGeo('hip' + fem, function () { return new THREE.CylinderGeometry(tw * .84, tw * .8, .12, 14); }), bot, 0, .8, 0); hip.scale.z = .66; if (!fem) { var belt = avMesh(B, avGeo('belt', function () { return new THREE.CylinderGeometry(tw * .85, tw * .85, .05, 14); }), 0x1a1a1a, 0, .86, 0); belt.scale.z = .66; avMesh(B, avGeo('buckle', function () { return new THREE.BoxGeometry(.06, .05, .02); }), 0xd4af37, 0, .86, -.105); } }
  if (robo) { avMesh(B, avGeo('core', function () { return new THREE.CircleGeometry(.06, 16); }), 0x22d3ee, 0, 1.18, -tw * .67, true).rotation.y = Math.PI; }
  if (st === 'esqueleto') { for (var rb = 0; rb < 4; rb++) avMesh(B, avGeo('rib' + fem, function () { return new THREE.BoxGeometry(tw * 1.3, .025, .02); }), 0xf3f0e6, 0, 1.28 - rb * .08, -tw * .67); avMesh(B, avGeo('spine', function () { return new THREE.BoxGeometry(.03, .5, .02); }), 0xf3f0e6, 0, 1.08, -tw * .68); }
  if (st === 'mumia') for (var bd = 0; bd < 5; bd++) { var ring = avMesh(B, avGeo('band' + fem, function () { return new THREE.CylinderGeometry(tw * .97, tw * .97, .035, 14); }), 0xf5efe0, 0, .88 + bd * .11, 0); ring.scale.z = .68; ring.rotation.z = (bd % 2 ? .12 : -.12); }
  if (st === 'zumbi') for (var tr = 0; tr < 4; tr++) avMesh(B, avGeo('tear', function () { return new THREE.BoxGeometry(.06, .05, .02); }), 0x2a2018, (tr % 2 ? 1 : -1) * tw * .4, .95 + tr * .1, -tw * .66);
  if (st === 'vampiro') {                                                            // capa preta por fora e vermelha por dentro + gola alta
    var cp = avMesh(B, avGeo('capeV' + fem, function () { return new THREE.BoxGeometry(tw * 2.4, 1.2, .03); }), 0x0b0b10, 0, .82, tw * .72); cp.rotation.x = .1;
    avMesh(B, avGeo('capeIn' + fem, function () { return new THREE.BoxGeometry(tw * 2.3, 1.15, .02); }), 0x7f1d1d, 0, .83, tw * .69).rotation.x = .1;
    [-1, 1].forEach(function (sd) { var cl = avMesh(B, avGeo('collarV', function () { return new THREE.BoxGeometry(.16, .22, .02); }), 0x7f1d1d, sd * .12, 1.47, .02); cl.rotation.y = sd * .7; cl.rotation.z = sd * .2; });
  }
  /* --- braços (manga curta, sem manga ou manga longa) e mãos --- */
  [['armL', 'elL'], ['armR', 'elR']].forEach(function (pr) {
    var A = L[pr[0]], E = L[pr[1]], sl = lk.top === 'regata' ? skin : top;
    avMesh(A, avGeo('joint' + fem, function () { return new THREE.SphereGeometry(fem ? .066 : .078, 10, 8); }), sl, 0, 0, 0);
    avMesh(A, avGeo('upper' + fem, function () { return new THREE.CylinderGeometry(fem ? .062 : .074, fem ? .055 : .064, .3, 10); }), sl, 0, -.15, 0);
    avMesh(E, avGeo('fore', function () { return new THREE.CylinderGeometry(.05, .045, .26, 10); }), longSl ? top : skin, 0, -.13, 0);
    if (longSl) avMesh(E, avGeo('cuff', function () { return new THREE.CylinderGeometry(.052, .052, .04, 10); }), lk.top === 'social' ? 0xffffff : shade(top, .8), 0, -.25, 0);
    avMesh(E, avGeo(robo ? 'claw' : 'hand', function () { return robo ? new THREE.BoxGeometry(.09, .1, .08) : new THREE.SphereGeometry(.058, 10, 8); }), skin, 0, -.29, 0).scale.set(.9, 1.05, .8);
  });
  /* --- pernas (calça, bermuda, short ou pernas de fora) e sapatos --- */
  [L.legL, L.legR].forEach(function (G) {
    var full = !dress && lk.bot === 'calca', half = !dress && lk.bot === 'bermuda', shortB = !dress && lk.bot === 'short';
    var th = fem ? .075 : .088, cU = full || half || shortB ? bot : skin, cL = full ? bot : skin;
    if (shortB) { avMesh(G, avGeo('legS' + fem, function () { return new THREE.CylinderGeometry(th * 1.05, th, .16, 10); }), bot, 0, -.08, 0); avMesh(G, avGeo('legSU' + fem, function () { return new THREE.CylinderGeometry(th, th * .92, .16, 10); }), skin, 0, -.24, 0); }
    else avMesh(G, avGeo('legU' + fem, function () { return new THREE.CylinderGeometry(th, th * .9, .32, 10); }), cU, 0, -.16, 0);
    avMesh(G, avGeo('legL' + fem, function () { return new THREE.CylinderGeometry(th * .9, th * .8, .32, 10); }), cL, 0, -.48, 0);
    if (lk.shoe === 'bota') { avMesh(G, avGeo('boot', function () { return new THREE.CylinderGeometry(.085, .08, .24, 10); }), shoe, 0, -.58, 0); var bf = avMesh(G, avGeo('shoe', function () { return new THREE.SphereGeometry(.1, 12, 8); }), shoe, 0, -.69, -.045); bf.scale.set(.82, .55, 1.35); avMesh(G, avGeo('sole', function () { return new THREE.BoxGeometry(.16, .035, .27); }), 0x2a2a2a, 0, -.735, -.045); }
    else if (lk.shoe === 'chinelo') { avMesh(G, avGeo('foot', function () { return new THREE.SphereGeometry(.07, 10, 8); }), skin, 0, -.68, -.04).scale.set(.9, .5, 1.5); avMesh(G, avGeo('flip', function () { return new THREE.BoxGeometry(.15, .03, .28); }), shoe, 0, -.735, -.045); avMesh(G, avGeo('strap2', function () { return new THREE.BoxGeometry(.13, .025, .025); }), shoe, 0, -.7, -.08); }
    else { if (!full) avMesh(G, avGeo('sock', function () { return new THREE.CylinderGeometry(.064, .062, .1, 10); }), 0xffffff, 0, -.62, 0); var sh2 = avMesh(G, avGeo('shoe', function () { return new THREE.SphereGeometry(.1, 12, 8); }), shoe, 0, -.69, -.045); sh2.scale.set(.82, .55, 1.35); avMesh(G, avGeo('sole', function () { return new THREE.BoxGeometry(.16, .035, .27); }), shoe === 0xffffff ? 0xd1d5db : 0xffffff, 0, -.735, -.045); }
  });
  /* --- cabeça: estilo (normal, desenho, anime, chibi, robô), rosto e cabelo --- */
  var H = L.head, hs = { normal: 1, neo: 1.12, anime: 1.08, desenho: 1.25, chibi: 1.5, robo: 1.05, zumbi: 1, vampiro: 1, esqueleto: 1.02, mumia: 1, alien: 1.18, abobora: 1.3 }[lk.style] || 1;
  H.scale.setScalar(hs); H.position.y = (hs - 1) * .14;
  u.tag.position.y = u.tagY + (hs - 1) * .62; u.speakIcon.position.y = u.iconY + (hs - 1) * .62;
  if (robo) {
    avMesh(H, avGeo('roboHead', function () { return new THREE.BoxGeometry(.36, .34, .34); }), metal, 0, 0, 0);
    var vis = avMesh(H, avGeo('visor', function () { return new THREE.BoxGeometry(.3, .1, .02); }), 0x22d3ee, 0, .02, -.175, true);
    avMesh(H, avGeo('mouthR', function () { return new THREE.BoxGeometry(.14, .02, .02); }), 0x1f2937, 0, -.09, -.175);
    avMesh(H, avGeo('antenna', function () { return new THREE.CylinderGeometry(.01, .01, .16, 6); }), 0x6b7280, 0, .25, 0); avMesh(H, avGeo('bulb', function () { return new THREE.SphereGeometry(.035, 8, 6); }), 0xef4444, 0, .34, 0, true);
    [-1, 1].forEach(function (sd) { avMesh(H, avGeo('bolt', function () { return new THREE.CylinderGeometry(.04, .04, .04, 8); }), 0x6b7280, sd * .19, 0, 0).rotation.z = Math.PI / 2; });
    u.visor = vis;
  } else if (st === 'abobora') {                                                     // abóbora com gomos, cabinho e rosto que brilha
    for (var gm = 0; gm < 8; gm++) { var ga = gm / 8 * 6.283, gom = avMesh(H, avGeo('gomo', function () { return new THREE.SphereGeometry(.12, 10, 8); }), 0xf97316, Math.cos(ga) * .09, 0, Math.sin(ga) * .09); gom.scale.set(1, 1.45, 1); }
    avMesh(H, avGeo('pumpCore', function () { return new THREE.SphereGeometry(.18, 16, 12); }), 0xea580c, 0, 0, 0).scale.y = .8;
    avMesh(H, avGeo('stem', function () { return new THREE.CylinderGeometry(.025, .035, .1, 6); }), 0x3f6212, 0, .2, 0).rotation.z = .3;
    var pf = new THREE.Mesh(avGeo('face', function () { return new THREE.SphereGeometry(.1915, 20, 14, Math.PI * 7 / 6, Math.PI * 2 / 3, Math.PI * .25, Math.PI * .5); }), new THREE.MeshBasicMaterial({ map: faceTex(fem, 'abobora'), transparent: true })); pf.scale.set(1.05, .85, 1.05); H.add(pf);
  } else {
    var hd = avMesh(H, avGeo('head', function () { return new THREE.SphereGeometry(.19, 20, 16); }), skin, 0, 0, 0);
    if (st === 'alien') hd.scale.set(1, 1.15, 1);
    if (lk.style === 'anime' || st === 'neo') hd.scale.set(.96, 1.04, .98);
    var face = new THREE.Mesh(avGeo('face', function () { return new THREE.SphereGeometry(.1915, 20, 14, Math.PI * 7 / 6, Math.PI * 2 / 3, Math.PI * .25, Math.PI * .5); }), new THREE.MeshLambertMaterial({ map: faceTex(fem, lk.style), transparent: true }));
    if (lk.style === 'anime' || st === 'neo') face.scale.set(.96, 1.04, .98); H.add(face); if (st !== 'esqueleto' && st !== 'mumia' && st !== 'alien' && st !== 'zumbi' && st !== 'vampiro') { u.faceOk = face; u.faceS = skin; }
    if (st !== 'esqueleto' && st !== 'alien') [-1, 1].forEach(function (sd) { avMesh(H, avGeo(st === 'vampiro' ? 'earV' : 'ear', function () { return st === 'vampiro' ? new THREE.ConeGeometry(.045, .12, 5) : new THREE.SphereGeometry(.045, 8, 6); }), shade(skin, .95), sd * .185, st === 'vampiro' ? .03 : -.01, .01).scale.set(.6, lk.style === 'anime' ? .8 : 1, .9); });
    if (lk.style === 'normal' || st === 'vampiro') avMesh(H, avGeo('nose', function () { return new THREE.SphereGeometry(.025, 8, 6); }), shade(skin, .97), 0, -.03, -.188);
    if (st === 'alien') [-1, 1].forEach(function (sd) { var at = avMesh(H, avGeo('antA', function () { return new THREE.CylinderGeometry(.008, .01, .18, 5); }), 0x4ade80, sd * .07, .26, 0); at.rotation.z = -sd * .3; avMesh(H, avGeo('antB', function () { return new THREE.SphereGeometry(.03, 8, 6); }), 0xb6ff8a, sd * .1, .35, 0, true); });
    if (st === 'mumia') for (var hb = 0; hb < 4; hb++) { var hr2 = avMesh(H, avGeo('headBand', function () { return new THREE.TorusGeometry(.19, .018, 6, 20); }), 0xf5efe0, 0, .1 - hb * .07, 0); hr2.rotation.x = Math.PI / 2 + (hb % 2 ? .2 : -.15); }
    if (st !== 'esqueleto' && st !== 'mumia' && st !== 'alien' && st !== 'piloto' && st !== 'cavaleiro' && st !== 'samurai' && st !== 'ninja' && st !== 'valquiria' && st !== 'pirata' && st !== 'tubarao' && st !== 'polvo' && st !== 'caranguejo' && st !== 'mergulhador' && st !== 'viking' && st !== 'palhaco' && !CHAP[st]) buildHair(H, st === 'neo' ? 'neo' : lk.hair, st === 'zumbi' ? shade(hair, .7) : hair, fem);
    if (CHAP[st]) sph(H, .212, st === 'zumbi' ? shade(hair, .7) : hair, 0, .08, .05);
    if (st === 'neo') neoExtras(L, fem, tw, hair, top, bot); styleExtras(st, H, B, fem, tw, top); styleExtras2(st, H, B, fem, tw); styleExtras3(st, L, fem, tw, top); styleJob(st, L, fem, tw, skin); if (lk.jl >= 2) { sph(L.body, .035, 0xfacc15, -tw * .46, 1.26, -tw * .72); if (lk.jl >= 3) sph(L.body, .035, 0xfacc15, -tw * .28, 1.26, -tw * .72); if (lk.jl >= 4) { sph(L.body, .035, 0xfacc15, -tw * .1, 1.26, -tw * .72); var cg = cyl(L.body, tw * .55, tw * .62, .05, 0xfacc15, 0, 1.4, 0, 14); cg.scale.z = .8; } }
  }
  if (keepWear.length) keepWear.forEach(function (o) { H.add(o); });             // chapéus e óculos acompanham a cabeça nova
  u.headLook = H;
}
function neoExtras(L, fem, tw, hair, top, bot) {                                        // personagem principal do jogo: detalhes neon, cabelo novo e costas limpas
  var H = L.head, B = L.body, CY = 0x22d3ee, hi = shade(hair, 1.45), i, sd, a;
  function ring(r, y, c, sz) { var m = cyl(B, r, r, .03, c == null ? CY : c, 0, y, 0, 20); m.scale.z = sz || .67; m.material = new THREE.MeshBasicMaterial({ color: c == null ? CY : c }); return m; }
  function bbox(p, w, h, d, x, y, z, c) { return box(p, w, h, d, c == null ? CY : c, x, y, z, true); }
  ring(tw * .85, .82); ring(tw * .84, 1.36 - .02, 0xffffff, .55); [-1, 1].forEach(function (k) { bbox(B, .014, .56, .012, k * .035, 1.08, -tw * .69); bbox(B, .05, .014, .012, k * tw * .62, 1.2, -tw * .69, 0xffd34d); });
  var yoke = box(B, tw * 1.92, .17, .03, shade(top, 1.28), 0, 1.25, tw * .63); yoke.rotation.x = .1; [-1, 1].forEach(function (k) { bbox(B, .018, .36, .012, k * tw * .5, 1, tw * .655); });
  [[L.armL, L.elL], [L.armR, L.elR]].forEach(function (q) { bbox(q[0], .012, .26, .012, 0, -.15, -(fem ? .062 : .074)); var cu = cyl(q[1], .054, .054, .025, CY, 0, -.23, 0, 10); cu.material = new THREE.MeshBasicMaterial({ color: CY }); });
  [L.legL, L.legR].forEach(function (G, n) { if (!fem) bbox(G, .012, .6, .012, (n ? 1 : -1) * .088, -.33, 0); bbox(G, .17, .018, .3, 0, -.722, -.045, CY); });
  if (fem) { cyl(B, tw * 1.02, .3, .24, bot, 0, .84, 0, 22).scale.z = .8; var sk = cyl(B, .33, .33, .025, CY, 0, .635, 0, 22); sk.scale.z = .8; sk.material = new THREE.MeshBasicMaterial({ color: CY }); var sk2 = cyl(B, tw * 1.04, tw * 1.04, .02, 0xffd34d, 0, .96, 0, 22); sk2.scale.z = .8; sk2.material = new THREE.MeshBasicMaterial({ color: 0xffd34d }); }
  /* cabelo */
  if (!fem) {
    for (i = -3; i <= 3; i++) { var q = ellip(H, .07, 1, .62, 1.35, hair, i * .05, .205 - Math.abs(i + 1) * .012, -.06 - (3 - Math.abs(i)) * .006); q.rotation.z = -.3; q.rotation.x = -.5; }
    for (i = 0; i < 5; i++) { a = i / 4 * 2 - 1; var t = cone(H, .07, .17, hair, Math.sin(a) * .13, .2, .07 + Math.cos(a) * .05, 6); t.rotation.x = 1; t.rotation.z = -a * .5; }
    for (sd = -1; sd <= 1; sd += 2) ellip(H, .1, .32, .75, 1.05, hair, sd * .183, .05, .05);
    ellip(H, .06, 1.9, .28, .6, hi, -.03, .247, -.09).rotation.z = -.28;
  } else {
    ellip(H, .3, .95, 1.75, .55, hair, 0, -.3, .15); ellip(H, .22, 1, 1.5, .5, shade(hair, 1.14), 0, -.42, .285);
    for (sd = -1; sd <= 1; sd += 2) { ellip(H, .15, .62, 2.5, .8, hair, sd * .205, -.28, .07); }
    for (i = 0; i < 7; i++) { a = (i / 6 - .5) * 2.5; ellip(H, .09, .9, 1.7, .6, i % 2 ? shade(hair, 1.2) : hair, Math.sin(a) * .2, -.74 - (i % 2) * .05, .17 + Math.cos(a) * .1); }
    for (i = -3; i <= 3; i++) { var bg = ellip(H, .062, 1, .62, 1.05, hair, i * .052 + .01, .2 - Math.abs(i + 1) * .014, -.115 + Math.abs(i) * .012); bg.rotation.z = -.28; bg.rotation.x = -.35; }
    for (sd = -1; sd <= 1; sd += 2) { ellip(H, .06, .8, 4.6, .8, hair, sd * .2, -.17, -.075); ellip(H, .07, .8, 1.6, .9, hair, sd * .19, .1, -.085); }
    ellip(H, .05, 2, .28, .6, hi, .04, .245, -.09).rotation.z = .25; sph(H, .03, 0xffd34d, -.165, .14, -.1, true); bbox(H, .08, .014, .012, -.165, .14, -.125, CY).rotation.z = .6; bbox(H, .08, .014, .012, -.165, .14, -.125, CY).rotation.z = -.6;
  }
}
/* personagens fixos de cada emprego: a roupa faz parte do corpo, não é peça colada por cima */
var CHAP = { cowboy: 1, chef: 1, rei: 1, heroi: 1, zumbi: 1, demonio: 1 };
var SKINF = { vampiro: { top: 'social', bot: 'calca', shoe: 'bota' }, robo: { top: 'camiseta', bot: 'calca', shoe: 'bota' }, alien: { top: 'camiseta', bot: 'calca', shoe: 'tenis' }, zumbi: { top: 'camiseta', bot: 'calca', shoe: 'tenis' }, cavaleiro: { top: 'camiseta', bot: 'calca', shoe: 'bota' }, mumia: { top: 'camiseta', bot: 'calca', shoe: 'tenis' }, esqueleto: { top: 'camiseta', bot: 'calca', shoe: 'tenis' }, mergulhador: { top: 'social', bot: 'calca', shoe: 'tenis' }, viking: { top: 'camiseta', bot: 'calca', shoe: 'bota' }, cowboy: { top: 'social', bot: 'calca', shoe: 'bota' }, palhaco: { top: 'camiseta', bot: 'calca', shoe: 'tenis' }, chef: { top: 'social', bot: 'calca', shoe: 'tenis' }, heroi: { top: 'camiseta', bot: 'calca', shoe: 'bota' }, rei: { top: 'social', bot: 'calca', shoe: 'bota' } };
var JOBC = { w_merc: [0xc81e1e, 0x1f2937, 0x111827], w_parque: [0xf97316, 0xf97316, 0x1f2937], w_praia: [0xdc2626, 0xfbbf24, 0xfde68a], w_zoo: [0xb9a26a, 0x4d5c2a, 0x4a2f17], w_pets: [0x14b8a6, 0x0f766e, 0xf8fafc], w_garagem: [0x1e3a5f, 0x1e3a5f, 0x111827], w_jogos: [0x6d28d9, 0x1f2937, 0xf8fafc], w_comercio: [0x92591f, 0x3f3f46, 0x4a2f17], w_iate: [0xf8fafc, 0x0b2340, 0x0b0b10], w_rest: [0xfafafa, 0x27272a, 0x18181b], w_hospital: [0xf8fafc, 0x14b8a6, 0xf8fafc], w_policia: [0x1e3a8a, 0x172554, 0x0b0b10], capitao: [0x0b2340, 0x0b2340, 0x0b0b10], w_mergulho: [0x0f172a, 0x0f172a, 0x0b0b10, 0x162033], vampiro: [0x111827, 0x111827, 0x0b0b10], robo: [0x94a3b8, 0x64748b, 0x475569], alien: [0x4c1d95, 0x3b0764, 0x22c55e], zumbi: [0x57534e, 0x3f3f46, 0x292524], mergulhador: [0x0f172a, 0x0f172a, 0x0b0b10, 0x162033], viking: [0x7c4a21, 0x4b3621, 0x3b2615], cowboy: [0x9a3412, 0x1e3a8a, 0x4a2f17], palhaco: [0xa855f7, 0xfacc15, 0xef4444], chef: [0xfafafa, 0x334155, 0x18181b], heroi: [0x0e7490, 0x0e7490, 0xf97316, 0x0891b2], rei: [0x7f1d1d, 0x4c1d95, 0x3b2615], noelr: [0xdc2626, 0xdc2626, 0x111111], bruxa: [0x2e1065, 0x111827, 0x111111], folia: [0xec4899, 0x7c3aed, 0xfacc15], caipira: [0xef4444, 0x1d4ed8, 0x7c2d12] };
function jobLook(k, fem, lv) { var o = { jl: lv || 0, style: 'w_' + k, skin: 's2', hair: fem ? 'rabo' : 'curto', hairC: 0, top: { praia: 'regata', parque: 'social', garagem: 'social', rest: 'social', iate: 'social', comercio: 'camiseta', hospital: 'social', policia: 'social', mergulho: 'social' }[k] || 'camiseta', topC: 0, bot: k === 'praia' || k === 'zoo' ? 'bermuda' : 'calca', botC: 0, shoe: k === 'praia' ? 'chinelo' : k === 'zoo' || k === 'comercio' || k === 'parque' ? 'bota' : 'tenis', shoeC: 0 }; return o; }
function jobTxt(p, t, cor, fundo, w, h, x, y, z, ry) { var c = document.createElement('canvas'); c.width = 256; c.height = 128; var q = c.getContext('2d'); if (fundo) { q.fillStyle = fundo; q.fillRect(0, 0, 256, 128); } q.fillStyle = cor; q.textAlign = 'center'; q.textBaseline = 'middle'; var pal = t.split(' '), fs = t.length > 9 ? 52 : 70; q.font = '800 ' + fs + 'px Arial,sans-serif'; pal.forEach(function (w0, i) { q.fillText(w0, 128, 64 + (i - (pal.length - 1) / 2) * (fs + 6)); }); var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: !fundo })); m.position.set(x, y, z); m.rotation.y = ry || 0; p.add(m); return m; }
function styleJob(st, L, fem, tw, skin) { if (!JOBC[st]) return; var H = L.head, B = L.body, fz = -tw * .69, bz = tw * .69, A = [L.armL, L.armR], E = [L.elL, L.elR];
  function bone(c, c2) { var b = cyl(H, .205, .205, .1, c, 0, .12, 0, 18); var t = sph(H, .2, c, 0, .15, 0); t.scale.set(1.02, .72, 1.05); var pal = box(H, .27, .025, .17, c2 || c, 0, .1, -.24); pal.rotation.x = .12; return b; }
  function etiqueta() { box(B, .1, .05, .012, 0xffffff, tw * .5, 1.24, fz); }
  function faixa(y, c) { var r = cyl(B, tw * .985, tw * .96, .05, c, 0, y, 0, 14); r.scale.z = .68; }
  function bracoFaixa(c) { A.forEach(function (a) { var r = cyl(a, .08, .075, .04, c, 0, -.2, 0, 10); }); }
  if (st === 'w_merc') { bone(0xc81e1e, 0xffffff); box(B, tw * 1.5, .5, .015, 0x166534, 0, .98, fz + .002); box(B, tw * 1.1, .16, .012, 0x15803d, 0, .92, fz - .006); [-1, 1].forEach(function (sd) { var a = box(B, .03, .3, .012, 0x166534, sd * tw * .5, 1.3, fz + .01); a.rotation.z = sd * .22; }); etiqueta(); jobTxt(B, 'MERCADINHO', '#ffffff', 0, tw * 1.8, tw * .9, 0, 1.12, bz + .01, Math.PI); return; }
  if (st === 'w_parque') { bone(0xf97316, 0xfde047); [1.22, 1.02, .86].forEach(function (y) { faixa(y, 0xfde047); }); bracoFaixa(0xfde047); [L.legL, L.legR].forEach(function (g) { var r = cyl(g, .095, .09, .05, 0xfde047, 0, -.42, 0, 10); }); box(B, .07, .1, .014, 0xffffff, -tw * .45, 1.2, fz); jobTxt(B, 'LIMPEZA', '#ffffff', 0, tw * 1.8, tw * .9, 0, 1.12, bz + .02, Math.PI); return; }
  if (st === 'w_praia') { bone(0xdc2626, 0xfbbf24); box(H, .3, .06, .02, 0x0b0b10, 0, -.025, -.195); var ap = new THREE.Mesh(new THREE.TorusGeometry(.1, .006, 6, 18), new THREE.MeshLambertMaterial({ color: 0xffffff })); ap.rotation.x = 1.3; ap.position.set(0, 1.27, -.05); B.add(ap); sph(B, .03, 0xfacc15, 0, 1.17, fz - .01); box(B, .09, .03, .012, 0xffffff, tw * .45, 1.2, fz); box(B, .03, .09, .012, 0xffffff, tw * .45, 1.2, fz - .002); jobTxt(B, 'SALVA VIDAS', '#ffffff', 0, tw * 1.9, tw * 1, 0, 1.12, bz + .01, Math.PI); return; }
  if (st === 'w_zoo') { var ch = cyl(H, .3, .32, .025, 0xa8905a, 0, .16, 0, 22); cyl(H, .17, .2, .15, 0xb9a26a, 0, .24, 0, 18); cyl(H, .202, .202, .03, 0x4d5c2a, 0, .18, 0, 18); [-1, 1].forEach(function (sd) { box(B, .12, .12, .014, 0xa8905a, sd * tw * .46, 1.18, fz); box(B, .13, .03, .016, 0x4d5c2a, sd * tw * .46, 1.24, fz - .002); }); box(B, tw * 2, .05, tw * 1.42, 0x4a2f17, 0, .86, 0); jobTxt(B, 'ZOO', '#3f4a1f', 0, tw * 1.6, tw * .8, 0, 1.12, bz + .01, Math.PI); return; }
  if (st === 'w_pets') { var hg = sph(H, .2, 0x0f766e, 0, .13, 0); hg.scale.set(1.03, .68, 1.06); sph(B, .05, 0xffffff, tw * .46, 1.18, fz); [[-.05, .05], [0, .07], [.05, .05]].forEach(function (q) { sph(B, .016, 0xffffff, tw * .46 + q[0], 1.18 + q[1], fz); }); box(B, tw * .8, .18, .012, 0x0f766e, 0, .95, fz); jobTxt(B, 'PETS', '#ffffff', 0, tw * 1.6, tw * .8, 0, 1.12, bz + .01, Math.PI); return; }
  if (st === 'w_garagem') { bone(0x1e3a5f, 0xf59e0b); box(B, tw * 1.1, .03, .012, 0xf59e0b, 0, 1.22, fz); box(B, .02, .55, .014, 0x94a3b8, 0, 1.08, fz); box(B, .13, .14, .014, 0x17324f, -tw * .46, 1.14, fz); box(B, .02, .12, .016, 0xcbd5e1, -tw * .46, 1.19, fz - .002); [[.1, 1], [-.08, .92]].forEach(function (q) { sph(B, .03, 0x0f1b2c, q[0], q[1], fz); }); jobTxt(B, 'MECÂNICO', '#f59e0b', 0, tw * 1.8, tw * .9, 0, 1.12, bz + .02, Math.PI); return; }
  if (st === 'w_jogos') { [-1, 1].forEach(function (sd) { box(B, tw * .42, .56, .012, 0xfacc15, sd * tw * .62, 1.08, fz + .01); }); box(B, .12, .05, .012, 0xffffff, -tw * .15, 1.24, fz); sph(B, .035, 0x111827, tw * .3, 1.2, fz); jobTxt(B, 'BOLICHE', '#ffffff', 0, tw * 1.8, tw * .9, 0, 1.12, bz + .01, Math.PI); return; }
  if (st === 'w_comercio') { var cq = sph(H, .21, 0xfacc15, 0, .13, 0); cq.scale.set(1, .72, 1.08); box(H, .26, .025, .12, 0xeab308, 0, .08, -.22); cyl(H, .214, .214, .025, 0xeab308, 0, .08, 0, 18); var cl = cyl(B, tw * 1.02, tw * .92, .5, 0xf59e0b, 0, 1.08, 0, 14); cl.scale.z = .7; [1.16, .96].forEach(function (y) { faixa(y, 0xe2e8f0); }); [-1, 1].forEach(function (i, n) { sph(E[n], .065, 0x78350f, 0, -.29, 0); }); jobTxt(B, 'CARGA', '#111827', 0, tw * 1.6, tw * .8, 0, 1.12, bz + .03, Math.PI); return; }
  if (st === 'w_iate') { [-1, 1].forEach(function (sd) { box(B, tw * .5, .54, .014, 0x0b2340, sd * tw * .58, 1.08, fz + .004); box(B, .13, .025, .1, 0xe7c76b, sd * tw * 1, 1.38, 0); box(B, .13, .012, .1, 0xffffff, sd * tw * 1, 1.395, 0); }); box(B, .1, .05, .014, 0x111827, -.04, 1.34, fz); box(B, .1, .05, .014, 0x111827, .04, 1.34, fz); sph(B, .018, 0x111827, 0, 1.34, fz - .004); [0, 1, 2].forEach(function (i) { sph(B, .014, 0xe7c76b, 0, 1.2 - i * .1, fz - .004); }); return; }
  if (st === 'mergulhador') { [-1, 1].forEach(function (sd) { sph(H, .075, 0x38bdf8, sd * .085, .13, -.17).scale.set(1, .85, .45); cyl(B, .085, .085, .5, 0xfacc15, sd * .1, 1.08, bz + .1, 12); sph(B, .085, 0xfacc15, sd * .1, 1.33, bz + .1); }); box(H, .34, .17, .03, 0x0f172a, 0, .13, -.15); box(H, .42, .035, .42, 0x14b8a6, 0, .13, 0); box(B, .02, .1, .02, 0xcbd5e1, 0, 1.4, bz + .1); }
  if (st === 'viking') { var vk = sph(H, .218, 0x9ca3af, 0, .07, 0); vk.scale.set(1, .86, 1.03); cyl(H, .224, .224, .05, 0xb45309, 0, .08, 0, 18); box(H, .04, .24, .02, 0xb45309, 0, .17, -.205); box(H, .05, .14, .03, 0x9ca3af, 0, -.02, -.215); [-1, 1].forEach(function (sd) { var ch = cone(H, .05, .24, 0xf5f0dc, sd * .25, .22, 0, 8); ch.rotation.z = -sd * .55; var bg = sph(H, .05, 0xc2410c, sd * .1, -.13, -.15); bg.scale.y = 1.5; }); var bv = sph(H, .12, 0xc2410c, 0, -.2, -.1); bv.scale.set(1.2, 1.25, .75); var fu = cyl(B, tw * 1.14, tw * 1.05, .16, 0xe7e2d4, 0, 1.36, 0, 14); fu.scale.z = .78; faixa(.87, 0x3b2615); box(B, .12, .1, .02, 0xfacc15, 0, .87, fz - .01); var es = cyl(B, .3, .3, .035, 0xb91c1c, 0, 1.08, bz + .07, 20); es.rotation.x = 1.57; var es2 = cyl(B, .1, .1, .05, 0xd1d5db, 0, 1.08, bz + .09, 14); es2.rotation.x = 1.57; box(B, .6, .05, .012, 0xfacc15, 0, 1.08, bz + .09); A.forEach(function (a) { cyl(a, .085, .08, .08, 0xe7e2d4, 0, -.05, 0, 10); }); return; }
  if (st === 'cowboy') { var ab = cyl(H, .36, .38, .02, 0x7c4a21, 0, .15, 0, 22); ab.scale.z = .84; var co = cyl(H, .15, .2, .2, 0x7c4a21, 0, .26, 0, 18); co.scale.z = .85; cyl(H, .202, .205, .04, 0x1f2937, 0, .18, 0, 18).scale.z = .85; [-1, 1].forEach(function (sd) { box(B, tw * .55, .56, .016, 0x4a2f17, sd * tw * .6, 1.08, fz + .004); }); box(B, .09, .09, .014, 0xfacc15, tw * .55, 1.2, fz - .006); var ba = box(B, .24, .13, .012, 0xdc2626, 0, 1.33, fz - .004); faixa(.87, 0x3b2615); box(B, .12, .08, .02, 0xfacc15, 0, .87, fz - .01); [L.legL, L.legR].forEach(function (g) { cyl(g, .105, .1, .22, 0x7c4a21, 0, -.5, 0, 10); }); return; }
  if (st === 'palhaco') { [-1, 1].forEach(function (sd) { sph(H, .12, 0xf97316, sd * .2, .07, .05); sph(H, .09, 0xfacc15, sd * .23, -.04, .08); sph(H, .1, 0xf97316, sd * .12, .16, .05); [L.legL, L.legR].forEach(function (g) { sph(g, .055, 0xffffff, 0, -.68, -.1); }); }); sph(H, .045, 0xef4444, 0, -.005, -.215); var pc = cone(H, .13, .3, 0x22c55e, .03, .32, 0, 12); pc.rotation.z = -.15; sph(H, .05, 0xfacc15, .07, .48, 0); var go = cyl(B, tw * 1.3, tw * 1.1, .09, 0xffffff, 0, 1.36, 0, 12); go.scale.z = .8; [1.24, 1.1, .96].forEach(function (y, i) { sph(B, .05, [0xef4444, 0x22c55e, 0x38bdf8][i], 0, y, fz - .012); }); [-1, 1].forEach(function (sd, n) { box(B, tw * .9, .5, .012, 0xfacc15, sd * tw * .5, 1.08, fz + .006 + n * 0); }); A.forEach(function (a) { cyl(a, .085, .08, .05, 0xffffff, 0, -.2, 0, 10); }); return; }
  if (st === 'chef') { cyl(H, .205, .205, .1, 0xffffff, 0, .15, 0, 18); var ch1 = cyl(H, .23, .18, .24, 0xffffff, 0, .3, 0, 16); sph(H, .11, 0xffffff, .12, .44, 0); sph(H, .11, 0xffffff, -.12, .44, 0); sph(H, .12, 0xffffff, 0, .46, .08); sph(H, .12, 0xffffff, 0, .46, -.08); var le = cyl(B, tw * .95, tw * .9, .08, 0xdc2626, 0, 1.36, 0, 12); le.scale.z = .74; [-1, 1].forEach(function (sd) { [0, 1, 2].forEach(function (i) { sph(B, .018, 0x1f2937, sd * .05, 1.24 - i * .13, fz - .004); }); }); box(B, tw * 1.5, .46, .012, 0xf1f5f9, 0, .84, fz - .006); return; }
  if (st === 'heroi') { box(H, .36, .085, .02, 0x0b0b10, 0, .03, -.195); cyl(H, .208, .208, .1, 0x0e7490, 0, .15, 0, 18); var cp1 = box(B, tw * 2.4, 1.2, .03, 0xf97316, 0, .8, tw * .78); cp1.rotation.x = .1; box(B, tw * 2.3, 1.15, .02, 0xc2410c, 0, .81, tw * .75).rotation.x = .1; var em = cyl(B, .15, .15, .02, 0xfacc15, 0, 1.17, fz - .01, 6); em.rotation.x = 1.57; var em2 = cyl(B, .09, .09, .03, 0xf97316, 0, 1.17, fz - .012, 6); em2.rotation.x = 1.57; faixa(.87, 0xfacc15); E.forEach(function (e) { cyl(e, .07, .062, .18, 0xf97316, 0, -.22, 0, 10); }); [L.legL, L.legR].forEach(function (g) { cyl(g, .105, .1, .3, 0xf97316, 0, -.55, 0, 10); }); return; }
  if (st === 'rei') { cyl(H, .215, .2, .11, 0xfacc15, 0, .2, 0, 16); for (var ri = 0; ri < 6; ri++) { var ra = ri * 1.047, pk = cone(H, .05, .14, 0xfacc15, Math.sin(ra) * .19, .32, Math.cos(ra) * .19, 6); sph(H, .022, [0xef4444, 0x38bdf8, 0x22c55e][ri % 3], Math.sin(ra) * .205, .2, Math.cos(ra) * .205); } sph(H, .16, 0x991b1b, 0, .2, 0).scale.y = .55; var cr = box(B, tw * 2.5, 1.3, .03, 0xb91c1c, 0, .76, tw * .78); cr.rotation.x = .08; box(B, tw * 2.5, .1, .05, 0xf8fafc, 0, .13, tw * .84); var ar = cyl(B, tw * 1.28, tw * 1.12, .16, 0xf8fafc, 0, 1.36, 0, 14); ar.scale.z = .8; for (ri = 0; ri < 6; ri++) { var ca = ri * 1.047; sph(B, .018, 0x111111, Math.sin(ca) * tw * 1.14, 1.37, Math.cos(ca) * tw * .92); } [0, 1, 2, 3].forEach(function (i) { sph(B, .022, 0xfacc15, 0, 1.28 - i * .08, fz - .006); }); sph(B, .05, 0xfacc15, 0, .98, fz - .01); faixa(.87, 0xfacc15); var ce = cyl(E[1], .018, .018, .8, 0xfacc15, 0, -.3, -.12, 8); ce.rotation.x = 1.3; sph(E[1], .07, 0xef4444, 0, -.21, -.5); return; }
  if (st === 'w_mergulho' || st === 'mergulhador') { var cap = sph(H, .205, 0x0f172a, 0, .05, .02); cap.scale.set(1.02, 1.08, 1.02); [-1, 1].forEach(function (sd) { box(B, .035, .58, .02, 0x14b8a6, sd * tw * .86, 1.08, fz + .05); box(B, .03, .3, .03, 0x14b8a6, sd * .03, .62, 0).visible = false; }); box(B, .022, .52, .012, 0xcbd5e1, 0, 1.08, fz); A.forEach(function (a) { cyl(a, .08, .07, .05, 0x14b8a6, 0, -.2, 0, 10); }); E.forEach(function (e) { sph(e, .062, 0x0f172a, 0, -.29, 0); }); [L.legL, L.legR].forEach(function (g) { cyl(g, .1, .095, .06, 0x14b8a6, 0, -.3, 0, 10); var pe = box(g, .17, .03, .46, 0xfacc15, 0, -.735, -.2); box(g, .19, .032, .06, 0x111827, 0, -.735, -.41); box(g, .03, .034, .3, 0x111827, 0, -.735, -.22); }); return; }
  if (st === 'w_hospital') { cyl(H, .2, .2, .08, 0x14b8a6, 0, .15, 0, 18); var tq = sph(H, .2, 0x14b8a6, 0, .17, 0); tq.scale.y = .55; box(B, tw * .34, .56, .012, 0x14b8a6, 0, 1.08, fz + .006); var es = new THREE.Mesh(new THREE.TorusGeometry(.11, .012, 8, 20), new THREE.MeshLambertMaterial({ color: 0x111827 })); es.rotation.x = 1.3; es.position.set(0, 1.31, -.06); B.add(es); sph(B, .03, 0x9ca3af, 0, 1.18, fz - .01); box(B, .09, .03, .012, 0xef4444, tw * .48, 1.2, fz); box(B, .03, .09, .012, 0xef4444, tw * .48, 1.2, fz - .002); jobTxt(B, 'MÉDICO', '#0f766e', 0, tw * 1.7, tw * .85, 0, 1.12, bz + .01, Math.PI); return; }
  if (st === 'w_policia') { bone(0x172554, 0x111111); box(H, .07, .08, .02, 0xfacc15, 0, .27, -.21); box(B, .07, .09, .014, 0xfacc15, -tw * .46, 1.2, fz); box(B, tw * 2.05, .07, tw * 1.46, 0x111111, 0, .86, 0); box(B, .1, .15, .1, 0x111111, tw * .95, .78, 0); box(B, .05, .12, .014, 0x93c5fd, tw * .46, 1.2, fz); jobTxt(B, 'POLÍCIA', '#fde047', 0, tw * 1.8, tw * .9, 0, 1.12, bz + .01, Math.PI); return; }
  if (st === 'noelr') { var ng = cyl(H, .21, .24, .12, 0xffffff, 0, .17, 0, 18); var ns = new THREE.Mesh(new THREE.ConeGeometry(.2, .4, 14), new THREE.MeshLambertMaterial({ color: 0xdc2626 })); ns.position.set(0, .4, .05); ns.rotation.x = .4; H.add(ns); sph(H, .05, 0xffffff, 0, .56, .14); box(B, tw * 2.05, .07, tw * 1.46, 0x111111, 0, .9, 0); box(B, .06, .55, .012, 0xffffff, 0, 1.08, fz); return; }
  if (st === 'bruxa') { cyl(H, .36, .38, .025, 0x111827, 0, .16, 0, 22); var bc = new THREE.Mesh(new THREE.ConeGeometry(.2, .52, 16), new THREE.MeshLambertMaterial({ color: 0x111827 })); bc.position.y = .42; H.add(bc); cyl(H, .205, .205, .04, 0xf97316, 0, .19, 0, 18); var cp2 = box(B, tw * 2.2, 1.1, .03, 0xf97316, 0, .88, tw * .74); cp2.rotation.x = .08; return; }
  if (st === 'folia') { [[-.14, 0xfacc15], [0, 0x22d3ee], [.14, 0xf472b6]].forEach(function (q) { var pn = sph(H, .08, q[1], q[0], .36, .02); pn.scale.set(.5, 2.2, .4); pn.rotation.z = -q[0] * 2; }); box(H, .36, .08, .02, 0xfacc15, 0, .03, -.19); [1.2, 1, .86].forEach(function (y, i) { faixa(y, [0xfacc15, 0x22d3ee, 0xf472b6][i]); }); return; }
  if (st === 'caipira') { cyl(H, .32, .34, .025, 0xe8c98a, 0, .16, 0, 20); cyl(H, .15, .19, .14, 0xe8c98a, 0, .24, 0, 16); [0, 1, 2, 3].forEach(function (i) { box(B, tw * 2, .02, tw * 1.4, 0xffffff, 0, .92 + i * .13, 0); box(B, .02, .56, tw * 1.4, 0xffffff, -tw * .6 + i * tw * .4, 1.08, 0); }); box(B, .07, .12, .014, 0xfacc15, tw * .45, 1.16, fz - .004); return; }
  if (st === 'capitao') { cyl(H, .23, .2, .1, 0xf8fafc, 0, .2, 0, 18); var tp = cyl(H, .27, .23, .06, 0xf8fafc, 0, .27, 0, 18); box(H, .3, .03, .16, 0x0b0b10, 0, .15, -.22); box(H, .09, .07, .02, 0xfacc15, 0, .22, -.235); [-1, 1].forEach(function (sd) { box(B, .14, .03, .12, 0xfacc15, sd * tw * 1, 1.38, 0); box(B, tw * .46, .56, .014, 0x12305a, sd * tw * .56, 1.08, fz + .004); [0, 1, 2].forEach(function (i) { sph(B, .016, 0xfacc15, sd * tw * .16, 1.22 - i * .13, fz - .006); }); }); return; }
  if (st === 'w_rest') { cyl(H, .2, .2, .06, 0xffffff, 0, .17, 0, 18); var to = cyl(H, .25, .19, .24, 0xffffff, 0, .32, 0, 16); to.scale.set(1, 1, 1); [0, 1, 2, 3, 4, 5].forEach(function (i) { var a = i / 6 * 6.283; sph(H, .1, 0xffffff, Math.cos(a) * .16, .44, Math.sin(a) * .16); }); var ln = cyl(B, tw * .62, tw * .68, .09, 0xdc2626, 0, 1.38, 0, 14); ln.scale.z = .8; [-1, 1].forEach(function (sd) { [1.22, 1.08, .94].forEach(function (y) { sph(B, .017, 0x27272a, sd * tw * .35, y, fz - .002); }); }); box(B, tw * 1.3, .4, .012, 0xf1f5f9, 0, .84, fz); return; }
}
function styleExtras3(st, L, fem, tw, top) {                                        // 🌴 estilos da tela de criar personagem
  var H = L.head, B = L.body, i, a, sd; function capuz(c) { var h = sph(H, .232, c, 0, .07, .055); h.scale.set(1.03, 1.08, 1); var bd = new THREE.Mesh(new THREE.TorusGeometry(.2, .03, 8, 26), M(shade(c, .8))); bd.position.set(0, .06, -.13); H.add(bd); return h; }
  if (st === 'verao') { var ab = cyl(H, .36, .38, .025, 0xe8c777, 0, .165, 0, 22), cp = cyl(H, .17, .21, .13, 0xedd088, 0, .24, 0, 18); cyl(H, .215, .215, .04, fem ? 0xec4899 : 0x0ea5e9, 0, .195, 0, 18); var FL = fem ? 0xffffff : 0xfde047; [[-.1, 1.22, -1], [.09, 1.1, -1], [-.06, .96, -1], [.12, .92, -1], [-.11, 1.2, 1], [.1, 1.08, 1], [-.03, .94, 1]].forEach(function (q) { sph(B, .027, FL, q[0], q[1], q[2] * tw * .63); }); return; }
  if (st === 'surf') { var pr = new THREE.Group(); pr.position.set(.05, 1.05, tw * .78); pr.rotation.z = .16; B.add(pr); var sh = sph(pr, .17, 0x22d3ee, 0, 0, 0); sh.scale.set(1, 4.7, .17); var ls = box(pr, .05, 1.5, .012, 0xffffff, 0, 0, .035); box(pr, .34, .05, .012, 0xf97316, 0, .35, .035); cyl(B, tw * .2, tw * .2, .02, 0x111111, 0, 1.38, 0, 8).scale.set(5, 1, 3.5); [-1, 1].forEach(function (k) { var st2 = box(B, .03, .55, .02, 0x111827, k * .1, 1.1, -tw * .68); st2.rotation.z = k * .3; }); return; }
  if (st === 'cria') { cyl(H, .215, .225, .13, 0x111827, 0, .17, 0, 18); box(H, .34, .025, .2, 0xef4444, 0, .115, -.29); box(H, .06, .06, .02, 0xfacc15, 0, .19, -.222); var ch = new THREE.Mesh(new THREE.TorusGeometry(.12, .012, 8, 26), new THREE.MeshPhongMaterial({ color: 0xfacc15, shininess: 90 })); ch.rotation.x = 1.25; ch.position.set(0, 1.28, -.07); B.add(ch); sph(B, .03, 0xfacc15, 0, 1.17, -tw * .72); if (fem) [-1, 1].forEach(function (k) { var ar = new THREE.Mesh(new THREE.TorusGeometry(.05, .008, 6, 16), M(0xfacc15)); ar.position.set(k * .205, -.03, -.01); ar.rotation.y = 1.57; H.add(ar); }); return; }
  if (st === 'skate') { var gr = sph(H, .222, fem ? 0xfbbf24 : 0x16a34a, 0, .11, .012); gr.scale.y = .78; cyl(H, .222, .225, .07, fem ? 0xf59e0b : 0x15803d, 0, .1, 0, 18); var sk = new THREE.Group(); sk.position.set(0, 1.08, tw * .8); sk.rotation.z = -.14; B.add(sk); var dk = sph(sk, .12, 0x7c3aed, 0, 0, 0); dk.scale.set(1, 3.6, .14); [-.3, .3].forEach(function (y) { box(sk, .17, .03, .03, 0x9ca3af, 0, y, .035); [-1, 1].forEach(function (k) { cyl(sk, .03, .03, .03, 0xfde047, k * .09, y, .06, 10).rotation.x = 1.57; }); }); return; }
  if (st === 'gamer') { var ar2 = new THREE.Mesh(new THREE.TorusGeometry(.215, .018, 8, 22, 3.3), M(0x111827)); ar2.position.set(0, .06, 0); ar2.rotation.z = -.08; H.add(ar2); [-1, 1].forEach(function (k) { var fn = cyl(H, .07, .07, .05, 0x111827, k * .215, .03, 0, 16); fn.rotation.z = 1.57; var lz = cyl(H, .05, .05, .056, fem ? 0xff4fd8 : 0x22d3ee, k * .217, .03, 0, 14); lz.rotation.z = 1.57; lz.material = new THREE.MeshBasicMaterial({ color: fem ? 0xff4fd8 : 0x22d3ee }); }); var mi = box(H, .012, .012, .14, 0x111827, -.2, -.05, -.1); mi.rotation.y = -.45; box(B, tw * .9, .025, .01, fem ? 0xff4fd8 : 0x22d3ee, 0, 1.13, -tw * .7, true); box(B, tw * .55, .025, .01, 0xffffff, 0, 1.08, -tw * .7, true); return; }
  if (st === 'carnaval') { var cs = [0xef4444, 0xfacc15, 0x22c55e, 0x06b6d4, 0x8b5cf6, 0xec4899, 0xf97316]; for (i = 0; i < 9; i++) { a = (i - 4) / 4 * 1.05; var pn = sph(H, .06, cs[i % 7], Math.sin(a) * .27, .3 + Math.cos(a) * .19, .03); pn.scale.set(.6, 2.6, .3); pn.rotation.z = -a; } var co = new THREE.Mesh(new THREE.TorusGeometry(.205, .03, 8, 24), new THREE.MeshPhongMaterial({ color: 0xfacc15, shininess: 90 })); co.rotation.x = 1.57; co.position.y = .17; H.add(co); for (i = 0; i < 8; i++) { a = i / 8 * 6.283; sph(B, .02, 0xfde047, Math.sin(a) * tw * .9, .92 + (i % 2) * .05, Math.cos(a) * tw * .62, true); } return; }
  if (st === 'tubarao') { var cg = 0x64748b; capuz(cg); var fi = new THREE.Mesh(new THREE.ConeGeometry(.1, .26, 4), M(shade(cg, .85))); fi.scale.z = .3; fi.position.set(0, .38, .08); fi.rotation.x = .35; H.add(fi); for (sd = -3; sd <= 3; sd++) { var dt = new THREE.Mesh(new THREE.ConeGeometry(.028, .07, 4), M(0xffffff)); dt.rotation.x = 3.14; dt.position.set(sd * .055, .225 - Math.abs(sd) * .017, -.2); H.add(dt); } var ba = new THREE.Mesh(new THREE.SphereGeometry(tw * .75, 12, 8), M(0xe2e8f0)); ba.scale.set(1, 1.5, .26); ba.position.set(0, 1.04, -tw * .55); B.add(ba); var r0 = new THREE.Mesh(new THREE.ConeGeometry(.1, .5, 10), M(cg)); r0.rotation.x = -2; r0.position.set(0, .82, tw * .65 + .16); B.add(r0); [-1, 1].forEach(function (k) { var rb = new THREE.Mesh(new THREE.ConeGeometry(.09, .26, 4), M(shade(cg, .85))); rb.scale.x = .3; rb.position.set(0, .68 + k * .12, tw * .65 + .4); rb.rotation.x = k > 0 ? -.5 : 3.6; B.add(rb); var ae = new THREE.Mesh(new THREE.ConeGeometry(.07, .22, 4), M(shade(cg, .85))); ae.scale.x = .3; ae.position.set(k * .02, -.14, .1); ae.rotation.x = -1.9; (k < 0 ? L.armL : L.armR).add(ae); }); return; }
  if (st === 'polvo') { var cv = 0x9333ea, cl = 0xd8b4fe; capuz(cv); [-1, 1].forEach(function (k) { var ol = sph(H, .05, 0xffffff, k * .09, .27, -.13); sph(H, .025, 0x111111, k * .09, .27, -.17); }); for (i = 0; i < 8; i++) { a = (i + .5) / 8 * 6.283; var tn = new THREE.Group(); tn.position.set(Math.sin(a) * tw * .86, .84, Math.cos(a) * tw * .6); tn.rotation.y = a; B.add(tn); for (var j = 0; j < 4; j++) { var sg = sph(tn, .058 - j * .009, j % 2 ? cl : cv, 0, -.06 - j * .1, .03 + j * j * .011); sg.scale.y = 1.35; } } return; }
  if (st === 'caranguejo') { var cr = 0xdc2626; capuz(cr); [-1, 1].forEach(function (k) { var ha = cyl(H, .018, .022, .18, shade(cr, .85), k * .1, .35, -.02, 8); ha.rotation.z = -k * .2; sph(H, .05, 0xffffff, k * .12, .44, -.03); sph(H, .025, 0x111111, k * .12, .44, -.07); }); [[L.elL], [L.elR]].forEach(function (q, n) { var E = q[0]; var g = new THREE.Group(); g.position.set(0, -.36, 0); E.add(g); var pa = sph(g, .1, cr, 0, 0, 0); pa.scale.set(.75, 1.15, .6); var d1 = new THREE.Mesh(new THREE.ConeGeometry(.06, .19, 8), M(cr)); d1.position.set(.05, -.17, 0); d1.rotation.z = .3; d1.rotation.x = 3.14; g.add(d1); var d2 = new THREE.Mesh(new THREE.ConeGeometry(.05, .17, 8), M(shade(cr, .85))); d2.position.set(-.06, -.15, 0); d2.rotation.z = -.3; d2.rotation.x = 3.14; g.add(d2); }); for (sd = -1; sd <= 1; sd += 2) for (i = 0; i < 3; i++) { var pt = cyl(B, .014, .02, .22, shade(cr, .8), sd * (tw + .08), 1.2 - i * .15, tw * .1); pt.rotation.z = sd * 1.1; } }
}
function styleExtras2(st, H, B, fem, tw) {                                          // 🌟 10 PERSONAGENS NOVOS
  if (st === 'policia') { var pb = cyl(H, .23, .2, .13, 0x1e3a8a, 0, .23, 0, 18); box(H, .3, .03, .14, 0x111111, 0, .17, -.2); box(H, .07, .08, .02, 0xfacc15, 0, .24, -.205); box(B, .07, .09, .02, 0xfacc15, -tw * .5, 1.2, -tw * .7); box(B, tw * 2.1, .07, tw * 1.5, 0x111111, 0, .86, 0); return; }
  if (st === 'bombeiro') { var cb2 = sph(H, .23, 0xfacc15, 0, .1, 0); cb2.scale.set(1, .75, 1.1); box(H, .36, .03, .5, 0xeab308, 0, .08, .04); box(H, .08, .12, .03, 0xef4444, 0, .17, -.22); [1.1, .92].forEach(function (y) { box(B, tw * 2.1, .05, tw * 1.42, 0xfde047, 0, y, 0); }); return; }
  if (st === 'medico') { box(B, .1, .03, .02, 0xef4444, tw * .5, 1.2, -tw * .7); box(B, .03, .1, .02, 0xef4444, tw * .5, 1.2, -tw * .71); var tsc = new THREE.Mesh(new THREE.TorusGeometry(.11, .012, 8, 20), new THREE.MeshLambertMaterial({ color: 0x111827 })); tsc.rotation.x = 1.3; tsc.position.set(0, 1.32, -.06); B.add(tsc); sph(B, .03, 0x9ca3af, 0, 1.2, -tw * .72); return; }
  if (st === 'coelho') { [-1, 1].forEach(function (sd) { var eO = sph(H, .07, 0xfbcfe8, sd * .1, .42, 0); eO.scale.set(1, 3.2, .6); eO.rotation.z = -sd * .12; var eI = sph(H, .04, 0xf472b6, sd * .1, .42, -.03); eI.scale.set(1, 3, .4); eI.rotation.z = -sd * .12; }); sph(B, .12, 0xffffff, 0, .84, tw * .72); var bb2 = sph(B, .15, 0xffffff, 0, 1.08, -tw * .55); bb2.scale.set(1, 1.5, .4); return; }
  if (st === 'terno') { box(B, .1, .1, .02, 0xffffff, 0, 1.3, -tw * .68); box(B, .05, .34, .02, 0x7f1d1d, 0, 1.16, -tw * .7); return; }
  if (st === 'praia') {                                                             // traje de banho
    if (fem) { cyl(H, .29, .31, .025, 0xe8c98a, 0, .16, .01, 24); cyl(H, .14, .17, .13, 0xe8c98a, 0, .24, .01, 20); cyl(H, .175, .175, .03, 0xec4899, 0, .185, .01, 20); sph(H, .05, 0xfde047, .15, .19, -.1, true); var sr = cyl(B, tw * .9, tw * 1.25, .3, 0xfde68a, 0, .72, 0, 16); sr.scale.z = .72; box(B, .1, .1, .04, 0xf59e0b, tw * .7, .84, -tw * .4); }
    else { box(H, .34, .05, .02, 0x111827, 0, .03, -.185); [-1, 1].forEach(function (sd) { box(H, .12, .08, .02, 0x0f172a, sd * .085, .02, -.19); }); for (var cb = 0; cb < 7; cb++) { var ca = cb / 7 * 3.14; sph(B, .014, 0xfacc15, Math.cos(ca) * .11, 1.34 - Math.sin(ca) * .1, -.12, true); } box(B, tw * 1.75, .05, tw * 1.4, 0xffffff, 0, .84, 0); }
    return;
  }
  if (st === 'aventura') {                                                          // homem aventureiro e mulher aventureira
    var hc = fem ? 0x8a5a2b : 0x6b4a2b, brim = cyl(H, .3, .32, .03, hc, 0, .17, .01, 24), crown = cyl(H, .15, .18, .16, hc, 0, .26, .01, 20); cyl(H, .185, .185, .035, 0x2a1a10, 0, .2, .01, 20);
    var vest = fem ? 0xb08a56 : 0x7a6238; box(B, tw * 2.02, .46, .05, vest, -0, 1.14, -tw * .66).scale.x = .46; box(B, tw * 2.05, .5, .05, vest, 0, 1.12, tw * .66);
    [-1, 1].forEach(function (sd) { box(B, tw * .5, .46, .05, vest, sd * tw * .72, 1.14, -tw * .66); box(B, .13, .1, .03, 0x5b4a2c, sd * tw * .62, 1.0, -tw * .7); });
    box(B, tw * 2.15, .07, tw * 1.5, 0x2a1a10, 0, .86, 0); box(B, .09, .08, .02, 0xd4af37, 0, .86, -tw * .78);
    var st2 = box(B, .05, .8, .02, 0x3a2412, 0, 1.12, -tw * .72); st2.rotation.z = .62;
    box(B, tw * 1.5, .5, .2, 0x5a3d22, 0, 1.12, tw * .95); box(B, tw * 1.55, .14, .24, 0x4a2f1b, 0, 1.3, tw * .95); cyl(B, .08, .08, tw * 1.7, 0x9a3412, 0, 1.42, tw * .95, 10).rotation.z = Math.PI / 2;
    if (fem) { for (var bi = 0; bi < 4; bi++) sph(H, .05 - bi * .004, 0x3f2a1a, 0, .02 - bi * .1, .17 + bi * .012, true); } else box(H, .19, .05, .012, 0x3f2a1a, 0, -.12, -.17).scale.y = .4;
    return;
  }
  function glow(par, col, s, x, y, z) { var g = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(col), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); g.scale.set(s, s, 1); g.position.set(x, y, z); par.add(g); return g; }
  function dbl(c, op) { return new THREE.MeshLambertMaterial({ color: c, side: THREE.DoubleSide, transparent: op < 1, opacity: op == null ? 1 : op }); }
  function featherWings(cols, sc) { [-1, 1].forEach(function (sd) { var wp = new THREE.Group(); wp.position.set(sd * .08, 1.28, tw * .7); wp.rotation.y = sd * -.35; B.add(wp); for (var i = 0; i < 6; i++) { var f = box(wp, .1 * sc, .55 * sc - i * .06 * sc, .025, cols[i % cols.length], sd * (.08 + i * .09) * sc, .05 - i * .06 * sc, 0); f.rotation.z = sd * (.5 - i * .15); } }); }
  function cape(c1, c2) { var cp = box(B, tw * 2.3, 1.1, .03, c1, 0, .85, tw * .72); cp.rotation.x = .1; box(B, tw * 2.2, 1.05, .02, c2, 0, .86, tw * .69).rotation.x = .1; }
  var i;
  if (st === 'anjo') {                                                              // ANJO CELESTIAL: auréola, asas de penas brancas e douradas, brilho
    var ha = new THREE.Mesh(new THREE.TorusGeometry(.15, .018, 8, 28), new THREE.MeshBasicMaterial({ color: 0xfde047 })); ha.rotation.x = Math.PI / 2; ha.position.set(0, .34, 0); H.add(ha); glow(H, 'rgba(253,224,71,.6)', .6, 0, .34, 0);
    featherWings([0xffffff, 0xfef9c3, 0xfde68a], 1.2); for (i = 0; i < 3; i++) box(B, tw * 1.5, .02, .02, 0xfacc15, 0, 1.0 + i * .14, -tw * .67, true);
    glow(B, 'rgba(255,250,220,.45)', 1.6, 0, 1.1, 0);
  } else if (st === 'demonio') {                                                    // DEMÔNIO SOMBRIO: chifres, asas de morcego, rabo de ponta e olhos de fogo
    [-1, 1].forEach(function (sd) { var hn = cone(H, .04, .2, 0x7f1d1d, sd * .1, .2, -.02, 6); hn.rotation.z = -sd * .5; hn.rotation.x = .2; cone(H, .02, .08, 0xef4444, sd * .155, .3, -.02, 6).rotation.z = -sd * .9;
      var wp = new THREE.Group(); wp.position.set(sd * .06, 1.3, tw * .7); B.add(wp); var mem = new THREE.Mesh(wingShape(.55, .45), dbl(0x450a0a, .95)); mem.rotation.x = Math.PI / 2 - .2; mem.scale.x = sd; wp.add(mem); wp.rotation.y = sd * -.3; });
    var tl = pivot(B, 0, .82, tw * .65); var t1 = cyl(tl, .022, .016, .55, 0x450a0a, 0, .1, .22, 6); t1.rotation.x = -1.1; var tp = cone(tl, .06, .1, 0xdc2626, 0, .34, .45, 3); tp.rotation.x = -1.1;
    [-1, 1].forEach(function (sd) { sph(H, .018, 0xff3b1f, sd * .065, .02, -.18, true); }); glow(B, 'rgba(220,38,38,.4)', 1.5, 0, 1.1, 0);
  } else if (st === 'samurai') {                                                    // SAMURAI NEON: elmo kabuto com chifre dourado, ombreiras de placas e katana nas costas
    var hm = sph(H, .215, 0x111827, 0, .03, 0); hm.scale.set(1.04, .9, 1.04); var hm2 = cyl(H, .29, .32, .04, 0xb91c1c, 0, -.02, .02, 16); hm2.scale.z = .9;
    var cr = new THREE.Mesh(new THREE.TorusGeometry(.12, .018, 6, 16, Math.PI), new THREE.MeshBasicMaterial({ color: 0xfacc15 })); cr.position.set(0, .18, -.17); H.add(cr); sph(H, .03, 0x22d3ee, 0, .14, -.2, true);
    [-1, 1].forEach(function (sd) { for (var p = 0; p < 3; p++) box(B, .17, .05, .2, p % 2 ? 0xb91c1c : 0x111827, sd * (tw + .06), 1.36 - p * .07, 0).rotation.z = sd * .4; });
    for (i = 0; i < 4; i++) box(B, tw * 1.5, .06, .03, i % 2 ? 0xb91c1c : 0x111827, 0, .96 + i * .08, -tw * .66); box(B, .02, .36, .02, 0x22d3ee, tw * .4, 1.1, -tw * .69, true); box(B, .02, .36, .02, 0x22d3ee, -tw * .4, 1.1, -tw * .69, true);
    var kt = pivot(B, 0, 1.1, tw * .75); kt.rotation.z = .8; box(kt, .025, .75, .015, 0xe5e7eb, 0, .2, 0); box(kt, .035, .2, .035, 0x111827, 0, -.27, 0); box(kt, .1, .02, .05, 0xfacc15, 0, -.16, 0); box(kt, .012, .7, .02, 0x22d3ee, .013, .2, 0, true);
  } else if (st === 'ninja') {                                                      // NINJA DAS SOMBRAS: capuz, máscara, faixa roxa e cachecol esvoaçante
    var hood = sph(H, .205, 0x111118, 0, .02, .01); hood.scale.set(1.03, 1.03, 1.05);
    box(H, .3, .1, .05, 0x1f1f2b, 0, -.06, -.17); box(H, .32, .035, .03, 0x7c3aed, 0, .1, -.18); [-1, 1].forEach(function (sd) { box(H, .05, .025, .2, 0x7c3aed, sd * .04, .1, .25).rotation.x = .5; });
    var sc = new THREE.Mesh(new THREE.TorusGeometry(.11, .04, 6, 14), M(0x7c3aed)); sc.rotation.x = Math.PI / 2; sc.position.set(0, 1.42, 0); B.add(sc); box(B, .08, .4, .02, 0x7c3aed, .05, 1.2, tw * .7).rotation.z = .3;
    for (i = 0; i < 2; i++) { var sh = cyl(B, .07, .07, .015, 0x9ca3af, -tw * .5 + i * .1, 1.0, -tw * .68, 4); sh.rotation.x = Math.PI / 2; }
  } else if (st === 'astronauta') {                                                 // ASTRONAUTA GALÁCTICO: capacete de vidro, mochila e emblema
    var gl = new THREE.Mesh(new THREE.SphereGeometry(.27, 22, 16), new THREE.MeshPhongMaterial({ color: 0xbae6fd, transparent: true, opacity: .28, shininess: 140, depthWrite: false })); gl.position.y = .02; H.add(gl);
    var ring = cyl(H, .2, .2, .06, 0xe5e7eb, 0, -.23, 0, 18); box(B, .3, .4, .16, 0xe5e7eb, 0, 1.12, tw * .72); [-1, 1].forEach(function (sd) { cyl(B, .04, .05, .12, 0x6b7280, sd * .08, .88, tw * .76, 8); });
    box(B, .12, .08, .02, 0x1e3a8a, 0, 1.2, -tw * .68); sph(B, .015, 0xef4444, -.03, 1.21, -tw * .7, true); sph(B, .015, 0x22c55e, .03, 1.21, -tw * .7, true); box(B, tw * 1.7, .04, .04, 0xf97316, 0, .95, -tw * .64);
  } else if (st === 'rainhagelo') {                                                 // RAINHA DO GELO: coroa de cristais, capa azul gelo e flocos brilhando
    var cm = new THREE.MeshPhongMaterial({ color: 0xbae6fd, transparent: true, opacity: .9, shininess: 140, emissive: 0x0ea5e9, emissiveIntensity: .35 });
    for (i = 0; i < 7; i++) { var a = Math.PI * (.15 + i * .7 / 6), c2 = new THREE.Mesh(new THREE.OctahedronGeometry(.035 + (i === 3 ? .025 : 0), 0), cm); c2.scale.y = 2.4; c2.position.set(Math.cos(a) * .16, .2 + (i === 3 ? .04 : 0), -Math.sin(a) * .1); H.add(c2); }
    cape(0x7dd3fc, 0xe0f2fe); for (i = 0; i < 5; i++) sph(B, .02, 0xffffff, (i - 2) * .09, .6 + (i % 2) * .3, tw * .76, true); glow(B, 'rgba(125,211,252,.45)', 1.6, 0, 1.1, 0); glow(H, 'rgba(186,230,253,.6)', .5, 0, .22, -.05);
  } else if (st === 'pirata') {                                                     // PIRATA LENDÁRIO: chapéu de três pontas com caveira, tapa-olho e casaco vermelho
    cyl(H, .28, .28, .03, 0x111111, 0, .14, 0, 3).rotation.y = Math.PI; var tc = cyl(H, .17, .19, .16, 0x111111, 0, .22, 0, 16); box(H, .32, .025, .02, 0xfacc15, 0, .15, -.15);
    sph(H, .03, 0xffffff, 0, .22, -.17, true); box(H, .06, .045, .02, 0x111111, .065, .02, -.18); box(H, .4, .012, .01, 0x111111, 0, .06, -.15).rotation.z = -.4;
    [-1, 1].forEach(function (sd) { box(B, tw * .7, .62, .04, 0x991b1b, sd * tw * .62, 1.05, -tw * .63); box(B, .03, .6, .045, 0xfacc15, sd * tw * .28, 1.05, -tw * .66); }); box(B, tw * 1.8, .07, .05, 0x1d4ed8, 0, .86, -tw * .64);
  } else if (st === 'cyber') {                                                      // CYBER NEON: óculos de visor neon, fone e jaqueta com linhas que brilham
    box(H, .34, .07, .04, 0xec4899, 0, .03, -.18, true); box(H, .34, .02, .045, 0x22d3ee, 0, .065, -.185, true); glow(H, 'rgba(236,72,153,.6)', .5, 0, .03, -.2);
    var hb = new THREE.Mesh(new THREE.TorusGeometry(.2, .018, 6, 18, Math.PI), M(0x111827)); hb.position.y = .02; H.add(hb); [-1, 1].forEach(function (sd) { var cup = cyl(H, .06, .06, .05, 0x111827, sd * .2, 0, 0, 14); cup.rotation.z = Math.PI / 2; var r2 = cyl(H, .062, .062, .015, 0x22d3ee, sd * .225, 0, 0, 14); r2.rotation.z = Math.PI / 2; r2.material = new THREE.MeshBasicMaterial({ color: 0x22d3ee }); });
    [-1, 1].forEach(function (sd) { box(B, .02, .55, .02, sd < 0 ? 0xec4899 : 0x22d3ee, sd * tw * .45, 1.08, -tw * .69, true); box(B, .02, .02, .5, 0xec4899, sd * (tw + .005), 1.12, 0, true); }); box(B, tw * 1.6, .02, .02, 0x22d3ee, 0, 1.3, -tw * .68, true);
  } else if (st === 'mago') {                                                       // MAGO ARCANO: chapéu alto com estrelas e lua, manto com runas douradas e orbe flutuando
    cyl(H, .3, .3, .02, 0x1e3a8a, 0, .15, 0, 20); var mh = cone(H, .18, .5, 0x1e40af, 0, .4, .04, 14); mh.rotation.x = .3; cyl(H, .185, .185, .05, 0xfacc15, 0, .18, 0, 18);
    for (i = 0; i < 5; i++) sph(H, .018, 0xfde047, Math.cos(i * 1.3) * .1, .25 + i * .06, Math.sin(i * 1.3) * .08 + .04, true);
    cape(0x1e3a8a, 0x3b82f6); for (i = 0; i < 4; i++) box(B, .05, .05, .02, 0xfacc15, (i - 1.5) * .07, .98, -tw * .68, true);
    var orb = sph(B, .07, 0x67e8f9, .35, 1.5, -.1, true); glow(orb, 'rgba(103,232,249,.7)', .45, 0, 0, 0); B.userData.orb = orb;
  } else if (st === 'reiroxo') {                                                    // REI DO CLÃ: coroa roxa neon, óculos escuros, roupa preta e asas negras com brilho roxo
    cyl(H, .2, .185, .07, 0xa855f7, 0, .2, 0, 18); for (i = 0; i < 7; i++) { var ca = i / 7 * 6.283, cn = cone(H, .035, .13, 0xc084fc, Math.cos(ca) * .19, .29, Math.sin(ca) * .19, 6); sph(H, .018, 0xf5d0fe, Math.cos(ca) * .19, .36, Math.sin(ca) * .19, true); } sph(H, .03, 0x22c55e, 0, .2, -.2, true); glow(H, 'rgba(192,132,252,.75)', .7, 0, .26, 0);
    box(H, .36, .085, .03, 0x050507, 0, .03, -.195); box(H, .36, .02, .03, 0x050507, 0, .08, -.195);
    box(B, tw * 1.75, .55, tw * 1.5, 0x0b0a12, 0, 1.12, 0); [-1, 1].forEach(function (sd) { box(B, .014, .5, .012, 0xa855f7, sd * tw * .32, 1.13, -tw * .77, true); }); box(B, .05, .5, .012, 0xe5e7eb, 0, 1.13, -tw * .77);
    [-1, 1].forEach(function (sd) { var wp = new THREE.Group(); wp.position.set(sd * .08, 1.2, tw * .75); wp.rotation.y = sd * -.25; B.add(wp); for (i = 0; i < 9; i++) { var L = .95 - i * .06, f = box(wp, .15, L, .03, i % 2 ? 0x120a24 : 0x1e1038, sd * (.1 + i * .085), .22 - i * .05, 0); f.rotation.z = sd * (-.9 + i * .28); var ed = box(wp, .013, L, .035, 0xa855f7, sd * (.1 + i * .085 + .055), .22 - i * .05, -.002, true); ed.rotation.z = f.rotation.z; } }); glow(B, 'rgba(168,85,247,.22)', 1.5, 0, 1.15, .5);
  } else if (st === 'guardiao') {                                                  // GUARDIÃO DA FLORESTA: coroa de folhas, manto verde e vaga-lumes
    for (i = 0; i < 9; i++) { var la = i / 9 * 6.283, lf2 = sph(H, .06, i % 2 ? 0x22c55e : 0x84cc16, Math.cos(la) * .2, .13, Math.sin(la) * .2); lf2.scale.set(1.5, .5, .8); lf2.rotation.y = -la; }
    cape(0x166534, 0x4ade80); box(B, tw * 1.5, .08, tw * 1.5, 0x92400e, 0, .92, 0); for (i = 0; i < 4; i++) glow(B, 'rgba(190,242,100,.8)', .18, Math.cos(i * 1.6) * .42, 1 + i * .2, Math.sin(i * 1.6) * .3);
  } else if (st === 'valquiria') {                                                  // VALQUÍRIA DOURADA: elmo com asas, armadura dourada e capa azul
    var vh = sph(H, .21, 0xfacc15, 0, .06, 0); vh.scale.set(1.02, .75, 1.04); box(H, .05, .14, .03, 0xfacc15, 0, -.03, -.2);
    [-1, 1].forEach(function (sd) { var wp = new THREE.Group(); wp.position.set(sd * .2, .12, 0); H.add(wp); for (var f = 0; f < 4; f++) { var fe = box(wp, .025, .2 - f * .03, .05, 0xffffff, sd * (.02 + f * .04), .08 + f * .02, .02); fe.rotation.z = sd * (-.6 + f * .15); } });
    [-1, 1].forEach(function (sd) { var sp = sph(B, .12, 0xfacc15, sd * (tw + .03), 1.38, 0); sp.scale.set(1.2, .7, 1.1); }); box(B, tw * 1.7, .42, .06, 0xeab308, 0, 1.15, -tw * .66); box(B, .2, .2, .02, 0x60a5fa, 0, 1.2, -tw * .7, true);
    cape(0x1d4ed8, 0x60a5fa); glow(B, 'rgba(250,204,21,.35)', 1.5, 0, 1.1, 0);
  }
}
function styleExtras(st, H, B, fem, tw, top) {                                       // estilos novos: princesa, gatinha, bruxinha, fadinha, piloto infernal e cavaleiro das chamas
  function bm(c) { return new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, transparent: true, opacity: .8 }); }
  if (st === 'princesa') {
    var ti = new THREE.Mesh(new THREE.TorusGeometry(.17, .015, 6, 24, Math.PI), M(0xfacc15)); ti.position.set(0, .14, -.02); ti.rotation.x = -.35; H.add(ti);
    for (var i = 0; i < 5; i++) { var a = .35 + i * .6; cone(H, .025, .09 - Math.abs(i - 2) * .02, 0xfacc15, Math.cos(a) * .17, .16 + Math.sin(a) * .04, -.06 - Math.sin(a) * .1 + .08, 4); }
    sph(H, .03, 0xec4899, 0, .23, -.13, true); [-1, 1].forEach(function (sd) { sph(H, .025, 0x7dd3fc, sd * .19, -.08, -.01, true); sph(H, .018, 0xec4899, sd * .09, .2, -.1, true); });
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(253,224,71,.6)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); sp.scale.set(.5, .5, 1); sp.position.set(0, .2, -.1); H.add(sp);
  } else if (st === 'gatinha') {
    [-1, 1].forEach(function (sd) { var e = cone(H, .07, .16, 0x111827, sd * .11, .19, .02, 4); e.rotation.z = -sd * .3; cone(H, .04, .1, 0xf9a8d4, sd * .11, .18, -.01, 4).rotation.z = -sd * .3; });
    var tl = pivot(B, 0, .82, tw * .65); tl.name = 'look'; var t1 = cyl(tl, .025, .02, .45, 0x111827, 0, .1, .2, 6); t1.rotation.x = -1; sph(tl, .035, 0xf9a8d4, 0, .3, .37, true); B.userData.tail = tl;
    var bell = sph(B, .035, 0xfacc15, 0, 1.4, -tw * .62, true); cyl(B, .1, .1, .03, 0xec4899, 0, 1.42, 0, 14);
  } else if (st === 'bruxinha') {
    cyl(H, .3, .3, .02, 0x4c1d95, 0, .14, 0, 20); var hat = cone(H, .17, .42, 0x5b21b6, 0, .34, .02, 14); hat.rotation.x = .25; cyl(H, .175, .175, .05, 0xa855f7, 0, .17, 0, 18);
    for (i = 0; i < 4; i++) sph(H, .02, 0xfde047, Math.cos(i * 1.6) * .13, .22 + i * .05, Math.sin(i * 1.6) * .1, true);
    var cp = box(B, tw * 2.3, 1.1, .03, 0x4c1d95, 0, .85, tw * .72); cp.rotation.x = .1; box(B, tw * 2.2, 1.05, .02, 0xa855f7, 0, .86, tw * .69).rotation.x = .1;
  } else if (st === 'fadinha') {
    [-1, 1].forEach(function (sd) { var e2 = cone(H, .035, .14, shade(0xf6d3b3, .95), sd * .2, .04, .01, 5); e2.rotation.z = -sd * 1.2; });
    [-1, 1].forEach(function (sd) { var w = new THREE.Mesh(new THREE.ShapeGeometry(lobeShape(.38, .42)), bm(0xf0abfc)); w.position.set(sd * .05, 1.2, tw * .7); w.scale.x = sd; B.add(w); var w2 = new THREE.Mesh(new THREE.ShapeGeometry(lobeShape(.28, .26)), bm(0x7dd3fc)); w2.position.set(sd * .05, 1.15, tw * .72); w2.rotation.z = sd * -.6; w2.scale.x = sd; B.add(w2); });
    var fg = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(240,171,252,.55)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); fg.scale.set(1.3, 1.3, 1); fg.position.set(0, 1.2, .2); B.add(fg);
    sph(H, .03, 0xfde047, .08, .2, -.12, true);
  } else if (st === 'piloto') {                                                     // capacete fechado com visor azul que brilha + chamas azuis nos ombros
    var hm = sph(H, .225, 0x0b0b10, 0, .01, 0); hm.scale.set(1, 1.04, 1.06);
    var vs = new THREE.Mesh(new THREE.SphereGeometry(.228, 18, 10, Math.PI * 1.2, Math.PI * .6, Math.PI * .35, Math.PI * .22), new THREE.MeshBasicMaterial({ color: 0x38bdf8 })); vs.scale.set(1, 1.04, 1.06); H.add(vs);
    box(H, .03, .05, .3, 0x1d4ed8, 0, .2, .03, true);
    [-1, 1].forEach(function (sd) { for (var f = 0; f < 3; f++) { var fl = cone(B, .05 - f * .01, .2 + f * .05, [0x1d4ed8, 0x38bdf8, 0xbae6fd][f], sd * (tw + .02), 1.42 + f * .03, .02, 6); fl.material = new THREE.MeshBasicMaterial({ color: fl.material.color, transparent: true, opacity: .85 }); } });
    var bg = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(56,189,248,.55)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); bg.scale.set(1.4, 1.4, 1); bg.position.set(0, 1.3, 0); B.add(bg);
    for (i = 0; i < 3; i++) box(B, tw * 1.6, .02, .02, 0x38bdf8, 0, 1.0 + i * .1, -tw * .67, true);
  } else if (st === 'cavaleiro') {                                                  // elmo com fenda de fogo, pluma vermelha, ombreiras e peitoral
    var hl = sph(H, .222, 0x4b5563, 0, .01, 0); hl.scale.set(1, 1.08, 1.04);
    box(H, .2, .035, .02, 0xff7a1a, 0, .03, -.225, true); box(H, .035, .12, .02, 0xff7a1a, 0, -.04, -.225, true);
    var eg = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,120,30,.8)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); eg.scale.set(.4, .4, 1); eg.position.set(0, .03, -.24); H.add(eg);
    for (i = 0; i < 6; i++) { var pl = box(H, .05, .12, .07, 0xdc2626, 0, .24 + Math.sin(i / 5 * Math.PI) * .06, .14 - i * .06 + .1); pl.rotation.x = -.4 + i * .12; }
    [-1, 1].forEach(function (sd) { var sh = sph(B, .12, 0x6b7280, sd * (tw + .03), 1.38, 0); sh.scale.set(1.2, .7, 1.1); box(B, .02, .02, .2, 0xff7a1a, sd * (tw + .1), 1.42, 0, true); });
    var ch = box(B, tw * 1.7, .42, .06, 0x6b7280, 0, 1.15, -tw * .66); box(B, .05, .4, .02, 0xff7a1a, 0, 1.15, -tw * .7, true);
    var cg = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,110,20,.4)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); cg.scale.set(1.5, 1.5, 1); cg.position.set(0, 1.2, 0); B.add(cg);
  }
}
function buildHair(H, style, hair, fem) {
  function cap() { var c = avMesh(H, avGeo('hairCap', function () { return new THREE.SphereGeometry(.205, 18, 10, 0, 6.283, 0, Math.PI * .5); }), hair, 0, .015, .012); c.rotation.x = style === 'neo' ? .55 : -.18; return c; }
  if (style === 'careca') return;
  if (style === 'moicano') { for (var i = 0; i < 6; i++) avMesh(H, avGeo('mohawk', function () { return new THREE.BoxGeometry(.05, .14, .08); }), hair, 0, .2 - Math.abs(i - 2.5) * .012, -.12 + i * .055).rotation.x = -.3 + i * .12; return; }
  cap();
  if (style === 'curto') { avMesh(H, avGeo('fringeM', function () { return new THREE.SphereGeometry(.207, 16, 6, Math.PI * 1.1, Math.PI * .8, Math.PI * .18, Math.PI * .13); }), hair, 0, 0, 0); [-1, 1].forEach(function (sd) { avMesh(H, avGeo('side', function () { return new THREE.BoxGeometry(.03, .12, .14); }), hair, sd * .186, .03, .05); }); }
  if (style === 'coque' || style === 'longo' || style === 'rabo') avMesh(H, avGeo('fringeF', function () { return new THREE.SphereGeometry(.2, 16, 6, Math.PI * 1.15, Math.PI * .7, Math.PI * .2, Math.PI * .16); }), hair, 0, .01, 0);
  if (style === 'coque') { avMesh(H, avGeo('hairBun', function () { return new THREE.SphereGeometry(.09, 12, 10); }), hair, 0, .17, .14); var bow = avMesh(H, avGeo('bow', function () { return new THREE.BoxGeometry(.14, .06, .04); }), 0xec4899, 0, .2, .2); bow.rotation.z = .2; avMesh(H, avGeo('hairNape', function () { return new THREE.SphereGeometry(.2, 14, 8, 0, 6.283, Math.PI * .5, Math.PI * .25); }), hair, 0, 0, .02); }
  if (style === 'longo') { var back = new THREE.Mesh(avGeo('hairBack', function () { return new THREE.CylinderGeometry(.2, .245, .5, 16, 1, true, -Math.PI * .62, Math.PI * 1.24); }), new THREE.MeshLambertMaterial({ color: hair, side: THREE.DoubleSide })); back.position.set(0, -.16, .015); H.add(back); }
  if (style === 'rabo') { var pt = avMesh(H, avGeo('pony', function () { return new THREE.CylinderGeometry(.06, .03, .38, 10); }), hair, 0, -.02, .26); pt.rotation.x = .5; avMesh(H, avGeo('tieR', function () { return new THREE.CylinderGeometry(.045, .045, .04, 10); }), 0xec4899, 0, .12, .2).rotation.x = .5; }
  if (style === 'cacheado') for (var k = 0; k < 18; k++) { var a = k / 18 * 6.283, yy = .08 + (k % 3) * .05; avMesh(H, avGeo('curl', function () { return new THREE.SphereGeometry(.065, 8, 6); }), hair, Math.cos(a) * .17, yy, Math.sin(a) * .17 + .02); }
  if (style === 'espetado') for (var s = 0; s < 9; s++) { var ang = s / 9 * Math.PI * 2, sp3 = avMesh(H, avGeo('spike', function () { return new THREE.ConeGeometry(.06, .2, 5); }), hair, Math.cos(ang) * .12, .2, Math.sin(ang) * .12 + .03); sp3.rotation.z = -Math.cos(ang) * .7; sp3.rotation.x = Math.sin(ang) * .7; }
}
function wingShape(w, h) { var q = new THREE.Shape(); q.moveTo(0, 0); q.lineTo(w, h * .25); q.quadraticCurveTo(w * .78, h * .5, w * .86, h * .9); q.quadraticCurveTo(w * .6, h * .62, w * .52, h); q.quadraticCurveTo(w * .34, h * .62, w * .2, h * .82); q.quadraticCurveTo(w * .08, h * .4, 0, h * .35); q.lineTo(0, 0); return new THREE.ShapeGeometry(q, 6); }
function cone(g, r, h, col, x, y, z, seg) { return cyl(g, 0, r, h, col, x, y, z, seg || 8); }
function ellip(g, r, sx, sy, sz, col, x, y, z, basic) { var m = sph(g, r, col, x, y, z, basic); m.scale.set(sx, sy, sz); return m; }
function makeWear(kind) {
  var g = new THREE.Group();
  if (kind === 'chapeupirata') {                                                       // chapéu de 3 pontas com caveira
    var hb = cyl(g, .3, .3, .03, 0x111111, 0, .17, 0, 3); hb.rotation.y = Math.PI; cyl(g, .17, .19, .16, 0x111111, 0, .26, 0, 16); box(g, .34, .025, .02, 0xfacc15, 0, .19, -.16); sph(g, .035, 0xffffff, 0, .27, -.18, true);
    [-1, 1].forEach(function (sd) { box(g, .07, .012, .012, 0xffffff, sd * .02, .23, -.185, true).rotation.z = sd * .7; });
  } else if (kind === 'tapaolho') { box(g, .07, .055, .02, 0x111111, .068, .02, -.18); box(g, .42, .014, .012, 0x111111, 0, .07, -.15).rotation.z = -.38; }
  else if (kind === 'bone') {                                                              // boné vermelho com aba para a frente (frente = -z)
    box(g, .37, .1, .37, 0xd62839, 0, .2, 0); box(g, .3, .025, .17, 0xa81d2b, 0, .165, -.25); box(g, .06, .03, .02, 0xffffff, 0, .22, -.19, true);
  } else if (kind === 'coroa') {
    cyl(g, .16, .17, .09, 0xffc928, 0, .235, 0, 12);
    for (var i = 0; i < 5; i++) { var an = i / 5 * Math.PI * 2; box(g, .045, .1, .045, 0xffd84a, Math.sin(an) * .15, .32, Math.cos(an) * .15); sph(g, .022, i % 2 ? 0xff3b6b : 0x3bb4ff, Math.sin(an) * .15, .385, Math.cos(an) * .15, true); }
  } else if (kind === 'oculos') {                                                     // lentes escuras com aro dourado
    [-.068, .068].forEach(function (x) { box(g, .115, .085, .012, 0xffc928, x, .02, -.172); box(g, .095, .065, .016, 0x10101c, x, .02, -.176, true); });
    box(g, .04, .015, .014, 0xffc928, 0, .03, -.174); box(g, .015, .012, .3, 0xffc928, -.125, .03, -.03); box(g, .015, .012, .3, 0xffc928, .125, .03, -.03);
  } else if (kind === 'cartola') {
    cyl(g, .22, .22, .03, 0x111116, 0, .19, 0, 16); cyl(g, .14, .14, .27, 0x16161c, 0, .33, 0, 16); cyl(g, .145, .145, .06, 0xc0392b, 0, .25, 0, 16);
  } else if (kind === 'bruxa') {
    cyl(g, .3, .3, .03, 0x2b1a4a, 0, .19, 0, 18); cyl(g, .16, .17, .06, 0x3b2a6a, 0, .22, 0, 14); cyl(g, 0, .15, .36, 0x3b2a6a, 0, .43, 0, 12); box(g, .09, .03, .02, 0xffc928, 0, .24, -.17, true);
  } else if (kind === 'orelhas') {
    [-1, 1].forEach(function (sd) { box(g, .1, .14, .06, 0x2b2b3a, sd * .11, .26, 0); box(g, .055, .09, .02, 0xff7eb6, sd * .11, .26, -.035, true); });
  } else if (kind === 'fone') {
    box(g, .38, .03, .05, 0x1f1f2e, 0, .2, 0); [-1, 1].forEach(function (sd) { box(g, .03, .12, .05, 0x1f1f2e, sd * .185, .14, 0); box(g, .07, .14, .15, 0xff4d8d, sd * .2, 0, 0); });
  } else if (kind === 'mascara') {
    box(g, .31, .075, .012, 0x1b1b22, 0, .02, -.176); [-.06, .06].forEach(function (x) { box(g, .055, .035, .012, 0xffffff, x, .02, -.184, true); box(g, .03, .03, .012, 0x111111, x, .02, -.19, true); });
  } else if (kind === 'bigode') {
    box(g, .15, .03, .02, 0x2b1d14, 0, -.032, -.176); [-1, 1].forEach(function (sd) { box(g, .045, .04, .02, 0x2b1d14, sd * .08, -.05, -.172); });
  } else if (kind === 'capa') {                                                       // capa vermelha presa nos ombros (balança ao andar)
    var cp = pivot(g, 0, 1.4, .15); box(cp, .52, .86, .03, 0xc0392b, 0, -.43, .03); box(cp, .52, .06, .035, 0xffc928, 0, -.02, .03); g.userData.cape = cp;
  } else if (kind === 'mochila') {
    box(g, .3, .38, .14, 0x2563eb, 0, 1.1, .21); box(g, .26, .12, .05, 0x1d4ed8, 0, .98, .3); box(g, .04, .3, .02, 0x1e293b, -.12, 1.15, -.0); box(g, .04, .3, .02, 0x1e293b, .12, 1.15, 0);
  } else if (kind === 'asas') {                                                       // asas brancas nas costas (+z); batem devagar
    g.userData.wings = [];
    [-1, 1].forEach(function (sd) {
      var pv = pivot(g, sd * .12, 1.3, .16); pv.userData.s = sd;
      box(pv, .6, .13, .03, 0xffffff, sd * .32, 0, 0); box(pv, .5, .12, .03, 0xeef2ff, sd * .28, -.12, 0); box(pv, .38, .11, .03, 0xe0e8fb, sd * .23, -.23, 0); box(pv, .24, .1, .03, 0xd2dcf6, sd * .17, -.33, 0);
      g.userData.wings.push(pv);
    });
  }
  return g;
}
