/* minimapa: foto real do mapa vista de cima, centrada no jogador, com lojas, empregos e pontos de coleta */
var MINI = (function () {
  var G, W, send, panel, $, E = 80, R = 24, FOTO = {}, ordem = [], chave = '', desde = 0, ult = 0, ab = false;
  var DENTRO = { rest: 1, boate: 1, terror: 1, jogos: 1, hospital: 1, policia: 1, shopping: 1, armas: 1, aces: 1, masmorra: 1, clahq: 1 };
  var P = { cart: 'M2 4h3l2.2 10h10.6L20 7H6.4M9 19.4v.1M17 19.4v.1', job: 'M3 8h18v11H3zM9 8V5h6v3M3 13h18', cup: 'M6 4h12l-1 8a5 5 0 0 1-10 0zM12 17v4M8 21h8', food: 'M7 3v18M4 3v6a3 3 0 0 0 6 0V3M17 3c-3 2-3 8 0 10v8', plus: 'M12 5v14M5 12h14', exit: 'M12 20V5M6 11l6-6 6 6', ancor: 'M12 7v14M7 11h10M4 14c0 4 4 7 8 7s8-3 8-7M12 3v.1' };
  var C = { shirt: 'M8 3 2 7l3 4 2-1v11h10V10l2 1 3-4-6-4c-1 2-7 2-8 0z', star: 'M12 2l3 7 7 .6-5.4 4.6 1.7 7.1L12 17l-6.3 3.7 1.7-7.1L2 9.6 9 9z', paw: 'M12 12c-4 0-6 4-5 6 1 3 3 1 5 1s4 2 5-1c1-2-1-6-5-6zM6 11a2 2 0 1 0 .01 0M18 11a2 2 0 1 0 .01 0M9.5 6a2 2 0 1 0 .01 0M14.5 6a2 2 0 1 0 .01 0' };

  function pontos() {
    var m = G.map, L = [], a = function (q, k) { if (q) L.push([q.x, q.z, k]); }, Wk = W.WORKS && W.WORKS[m], K;
    if (Wk) L.push([Wk.x, Wk.z, 'job']);
    if (m === 'iate') { a(W.NPC, 'cup'); a(W.SHOP, 'shirt'); }
    if (m === 'merc') a(W.MERC.NPC, 'cart'); if (m === 'pets') a(W.PETSHOP.NPC, 'paw'); if (m === 'praia') { a(W.PRAIA.NPC, 'cup'); a(W.PRAIA.DOCK, 'ancor'); }
    K = { garagem: W.GARAGEM, baloes: W.BALOES, montaria: W.MONTA, asas: W.ASAS, armas: W.ARMAS }[m]; if (K) a(K.NPC, 'cart'); if (m === 'aces') a(W.ACES.NPC, 'shirt'); if (m === 'rest') a(W.REST.NPC, 'food');
    if (m === 'hospital') a(W.HOSP.REC, 'plus'); if (m === 'policia') a(W.BANCO.COFRE, 'cash'); if (m === 'clahq') a(W.SEDE.COFRE, 'cash');
    if (m === 'shopping') { a(W.SHOPM.ADM, 'cart'); a(W.SHOPM.FOOD, 'food'); } if (m === 'aero') a(W.AERO.CHECK, 'cart'); if (m === 'fazenda') { a(W.FAZ.VENDA, 'cash'); a(W.FAZ.GALI, 'cart'); }
    if (m === 'fundo') { var dv = ((G.pg || {}).nv || {}).dv || {}; W.FUNDO.TES.forEach(function (q, i) { if (!dv[i]) L.push([q[0], q[1], 'star']); }); L.push([W.FUNDO.SAI[0], W.FUNDO.SAI[1], 'exit']); }
    return L;
  }
  function metas() {
    var L = [], mi = (G.pg || {}).mai || {}, h = W.HIST && W.HIST[mi.hi || 0];
    if (G.wk) L.push([G.wk.x, G.wk.z, '#16a34a', G.wk.it === 'caixa' || /Pegar/.test(G.wk.v || '') ? 'cart' : 'cash']); if (G.job) L.push([G.job.x, G.job.z, '#d97706', 'cup']);
    if (G.chest && G.map === 'iate') L.push([G.chest[0], G.chest[2], '#ca8a04', 'star']); if (h && h.map === G.map) L.push([h.x, h.z, '#7c3aed', 'star']);
    var A = { kart: W.KART, regata: W.REGATA }[G.map]; if (A && G.race && A.RINGS[G.race.i]) L.push([A.RINGS[G.race.i][0], A.RINGS[G.race.i][1], '#db2777', 'star']);
    return L;
  }
  function icone(x, px, py, k, tm, fundo) {
    var s = tm / 24; x.save(); x.translate(px - tm / 2, py - tm / 2); x.fillStyle = fundo || 'rgba(8,10,20,.92)'; x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = tm * .05; x.beginPath(); if (x.roundRect) x.roundRect(0, 0, tm, tm, fundo ? tm / 2 : tm * .26); else x.rect(0, 0, tm, tm); x.fill(); x.stroke();
    if (k === 'cash') { x.fillStyle = '#fff'; x.font = '900 ' + tm * .74 + 'px Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('$', tm / 2, tm * .55); x.restore(); return; }
    x.translate(tm * .16, tm * .16); x.scale(s * .68, s * .68); if (C[k]) { x.fillStyle = '#fff'; x.fill(new Path2D(C[k])); } else { x.strokeStyle = '#fff'; x.lineWidth = 2.5; x.lineCap = x.lineJoin = 'round'; x.stroke(new Path2D(P[k] || P.plus)); } x.restore();
  }

  /* tira a foto de cima uma vez por mapa, com luz clara, sem jogadores nem céu */
  function foto(k) {
    var r = G.renderer, S = G.leve ? 512 : 1024, sc = G.scene, rt = new THREE.WebGLRenderTarget(S, S), cam = new THREE.OrthographicCamera(-E, E, E, -E, .1, 160), esc = [], luz = [], fog = sc.fog, cor = G.seaMat ? G.seaMat.color.clone() : null, dt = DENTRO[G.map];
    cam.position.set(0, dt ? 3.3 : 90, 0); cam.up.set(0, 0, -1); cam.lookAt(0, 0, 0); cam.updateMatrixWorld();
    var some = function (o) { if (o && o.visible) { esc.push(o); o.visible = false; } };
    G.players.forEach(function (p) { some(p.av); some(p.pet); }); if (G.pl.mark) some(G.pl.mark); sc.traverse(function (o) { if ((o.isInstancedMesh && o.frustumCulled === false) || o.isLine || o.isPoints || o.isSprite) some(o); }); (G.gulls || []).forEach(function (q) { some(q.g); });
    sc.children.forEach(function (o) { if (o.isSprite || o.isPoints || o.isLine) some(o); else if (o.isMesh && o.material && o.material.transparent && o.position.y > 20) some(o); if (o.isHemisphereLight) { luz.push([o, o.intensity, o.color.clone(), o.groundColor.clone()]); o.intensity = .56; o.color.set(0xffffff); o.groundColor.set(0xffffff); } });
    sc.fog = null; if (cor) G.seaMat.color.setRGB(1.7, 1.9, 1.85); var a = r.getRenderTarget(), clr = r.getClearAlpha(); r.setRenderTarget(rt); r.setClearAlpha(1); r.clear(); r.render(sc, cam);
    var px = new Uint8Array(S * S * 4); r.readRenderTargetPixels(rt, 0, 0, S, S, px); r.setRenderTarget(a); r.setClearAlpha(clr); rt.dispose();
    sc.fog = fog; if (cor) G.seaMat.color.copy(cor); luz.forEach(function (q) { q[0].intensity = q[1]; q[0].color.copy(q[2]); q[0].groundColor.copy(q[3]); }); esc.forEach(function (o) { o.visible = true; });
    var c = document.createElement('canvas'); c.width = c.height = S; var q = c.getContext('2d'), im = q.createImageData(S, S); for (var y = 0; y < S; y++) { var d = (S - 1 - y) * S * 4, o = y * S * 4; im.data.set(px.subarray(o, o + S * 4), d); } for (var i = 3; i < im.data.length; i += 4) im.data[i] = 255; q.putImageData(im, 0, 0);
    FOTO[k] = c; ordem.push(k); if (ordem.length > 7) delete FOTO[ordem.shift()];
  }
  function pinta(c, cx, cz, rw, gde) {
    var x = c.getContext('2d'), w = c.width, F = FOTO[chave], u = w / (2 * rw), S = F.width, px = S / (2 * E), a = G.me.av, sx = (cx - rw + E) * px, sz = (cz - rw + E) * px, ic = w * (gde ? .052 : .115), v = function (q, z) { return [(q - cx + rw) * u, (z - cz + rw) * u]; };
    x.imageSmoothingEnabled = true; x.fillStyle = '#0d5f88'; x.fillRect(0, 0, w, w); x.drawImage(F, sx, sz, 2 * rw * px, 2 * rw * px, 0, 0, w, w);
    var mx = w / 2, dist = function (q) { return Math.hypot(q[0] - mx, q[1] - mx); }, lim = mx - ic * .75;
    pontos().forEach(function (q) { var o = v(q[0], q[1]); if (gde ? (o[0] > 0 && o[0] < w && o[1] > 0 && o[1] < w) : dist(o) < lim) icone(x, o[0], o[1], q[2], ic); });
    G.players.forEach(function (p) { if (p === G.me) return; var o = v(p.av.position.x, p.av.position.z); if (dist(o) > lim && !gde) return; x.fillStyle = '#fbbf24'; x.strokeStyle = '#111'; x.lineWidth = w * .007; x.beginPath(); x.arc(o[0], o[1], w * (gde ? .009 : .022), 0, 6.283); x.fill(); x.stroke(); });
    var eu = v(a.position.x, a.position.z), tp = performance.now(); metas().forEach(function (q, i) { var o = v(q[0], q[1]), d = dist(o), pu = 1 + Math.sin(tp / 220) * .1; if (!gde && d > lim) { o[0] = mx + (o[0] - mx) / d * lim; o[1] = mx + (o[1] - mx) / d * lim; }
      /* caminho tracejado andando até o ponto de entrega ou coleta */
      if (!i && Math.hypot(o[0] - eu[0], o[1] - eu[1]) > ic) { x.save(); x.lineCap = 'round'; x.lineWidth = w * (gde ? .014 : .036); x.setLineDash([w * .001, w * (gde ? .03 : .06)]); x.lineDashOffset = -tp / 40 * (w / 300); x.strokeStyle = 'rgba(0,0,0,.55)'; x.beginPath(); x.moveTo(eu[0], eu[1]); x.lineTo(o[0], o[1]); x.stroke(); x.lineWidth *= .62; x.strokeStyle = '#fff'; x.stroke(); x.restore(); }
      x.strokeStyle = q[2]; x.lineWidth = w * .012; x.globalAlpha = .55 + .35 * Math.sin(tp / 220); x.beginPath(); x.arc(o[0], o[1], ic * .9 * pu, 0, 6.283); x.stroke(); x.globalAlpha = 1; icone(x, o[0], o[1], q[3], ic * 1.2 * pu, q[2]); });
    var e = v(a.position.x, a.position.z), t = w * (gde ? .022 : .07); x.save(); x.translate(e[0], e[1]); x.rotate(-a.rotation.y); x.lineWidth = w * .012; x.strokeStyle = '#d946ef'; x.fillStyle = '#fff'; x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = w * .02; x.beginPath(); x.moveTo(0, -t); x.lineTo(t * .72, t * .8); x.lineTo(0, t * .42); x.lineTo(-t * .72, t * .8); x.closePath(); x.fill(); x.stroke(); x.restore();
  }
  function draw() {
    if (!G.me) return false; var agora = performance.now(), k = G.map === 'ilha' ? 'ilha:' + (G.owner || '') : G.map; if (k !== chave) { chave = k; desde = agora; }
    if (!FOTO[k]) { if (agora - desde < 500) return false; try { foto(k); } catch (e) { FOTO[k] = false; } } if (!FOTO[k]) return false;
    if (agora - ult < 66) return true; ult = agora; var a = G.me.av.position, c = $('mapaC'); if (c.width !== 300) c.width = c.height = 300; pinta(c, a.x, a.z, R, false);
    if (ab) { var g = $('mmG'); if (g && !$('pain').hidden) pinta(g, 0, 0, Math.min(E, grande()), true); else ab = false; } return true;
  }
  function grande() { var K = { iate: 34, praia: 60, parque: 44, zoo: 46, ilha: 40 }[G.map]; return K || 50; }
  function expande() { if (!FOTO[chave]) return; ab = true; panel('🗺️ ' + ($('mapaN').textContent || 'Mapa'), '<canvas id="mmG" width="640" height="640" style="display:block;width:min(100%,60vh);margin:0 auto;border-radius:14px"></canvas>'); }
  return { init: function (a) { G = a.G; W = a.W; send = a.send; panel = a.panel; $ = a.$; }, draw: draw, expande: expande };
})();
