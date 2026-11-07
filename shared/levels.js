/* Níveis: 1 XP por hora jogada. Para mudar a dificuldade, mexa só em need(). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LEVELS = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var MAX = 200, SEC = 3600;
  function need(L) { if (L >= MAX) return 0; if (L <= 10) return 1; if (L <= 20) return 2; if (L <= 50) return 3 + Math.floor((L - 21) / 10); if (L <= 100) return 6 + Math.floor((L - 51) / 10); if (L <= 150) return 12 + 2 * Math.floor((L - 101) / 10); return 24 + 3 * Math.floor((L - 151) / 10); }
  var START = [0, 0]; for (var i = 1; i < MAX; i++) START[i + 1] = START[i] + need(i);
  function fromSec(sec) { sec = Math.max(0, Math.floor(Number(sec) || 0)); var t = Math.floor(sec / SEC), lo = 1, hi = MAX; while (lo < hi) { var m = Math.ceil((lo + hi) / 2); if (START[m] <= t) lo = m; else hi = m - 1; } return { lv: lo, pct: lo >= MAX ? 1 : Math.min(1, (sec / SEC - START[lo]) / need(lo)) }; }
  return { MAX: MAX, need: need, fromSec: fromSec, AFK_MS: 600000, DAY_MAX_SEC: 43200 };
});
