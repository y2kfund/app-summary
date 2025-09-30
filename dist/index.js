var Fn = Object.defineProperty;
var Rn = (i, t, e) => t in i ? Fn(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var T = (i, t, e) => Rn(i, typeof t != "symbol" ? t + "" : t, e);
import { inject as js, defineComponent as mi, shallowRef as $s, h as ii, ref as Pe, onMounted as Us, onUnmounted as zn, watch as En, toRaw as si, nextTick as Hn, version as Bn, isProxy as Ys, reactive as Li, computed as nt, onBeforeUnmount as Nn, createElementBlock as X, openBlock as K, createCommentVNode as ge, unref as Rt, createElementVNode as v, toDisplayString as H, Fragment as Wn, renderList as Vn, normalizeClass as Ye, createVNode as jn } from "vue";
import { useQueryClient as $n, useQuery as ni } from "@tanstack/vue-query";
import { useSupabase as Un } from "@y2kfund/core";
const Yn = Symbol.for("y2kfund.supabase");
function Gn() {
  const i = js(Yn, null);
  if (!i) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return i;
}
function qn(i) {
  const t = Gn(), e = ["nlvMargin", i], s = $n(), n = ni({
    queryKey: e,
    queryFn: async () => {
      const { data: a, error: l } = await t.schema("hf").rpc("get_nlv_margin", {
        p_limit: 10
      });
      if (l) throw l;
      return a || [];
    },
    staleTime: 6e4
  }), o = t.channel("netliquidation_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "netliquidation",
      event: "*"
    },
    () => s.invalidateQueries({ queryKey: e })
  ).subscribe(), r = t.channel("maintenance_margin_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "maintenance_margin",
      event: "*"
    },
    () => s.invalidateQueries({ queryKey: e })
  ).subscribe();
  return {
    ...n,
    _cleanup: () => {
      var a, l;
      (a = o == null ? void 0 : o.unsubscribe) == null || a.call(o), (l = r == null ? void 0 : r.unsubscribe) == null || l.call(r);
    }
  };
}
/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */
function fe(i) {
  return i + 0.5 | 0;
}
const bt = (i, t, e) => Math.max(Math.min(i, e), t);
function Kt(i) {
  return bt(fe(i * 2.55), 0, 255);
}
function _t(i) {
  return bt(fe(i * 255), 0, 255);
}
function ft(i) {
  return bt(fe(i / 2.55) / 100, 0, 1);
}
function Ii(i) {
  return bt(fe(i * 100), 0, 100);
}
const Q = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 }, oi = [..."0123456789ABCDEF"], Xn = (i) => oi[i & 15], Kn = (i) => oi[(i & 240) >> 4] + oi[i & 15], pe = (i) => (i & 240) >> 4 === (i & 15), Qn = (i) => pe(i.r) && pe(i.g) && pe(i.b) && pe(i.a);
function Zn(i) {
  var t = i.length, e;
  return i[0] === "#" && (t === 4 || t === 5 ? e = {
    r: 255 & Q[i[1]] * 17,
    g: 255 & Q[i[2]] * 17,
    b: 255 & Q[i[3]] * 17,
    a: t === 5 ? Q[i[4]] * 17 : 255
  } : (t === 7 || t === 9) && (e = {
    r: Q[i[1]] << 4 | Q[i[2]],
    g: Q[i[3]] << 4 | Q[i[4]],
    b: Q[i[5]] << 4 | Q[i[6]],
    a: t === 9 ? Q[i[7]] << 4 | Q[i[8]] : 255
  })), e;
}
const Jn = (i, t) => i < 255 ? t(i) : "";
function to(i) {
  var t = Qn(i) ? Xn : Kn;
  return i ? "#" + t(i.r) + t(i.g) + t(i.b) + Jn(i.a, t) : void 0;
}
const eo = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function Gs(i, t, e) {
  const s = t * Math.min(e, 1 - e), n = (o, r = (o + i / 30) % 12) => e - s * Math.max(Math.min(r - 3, 9 - r, 1), -1);
  return [n(0), n(8), n(4)];
}
function io(i, t, e) {
  const s = (n, o = (n + i / 60) % 6) => e - e * t * Math.max(Math.min(o, 4 - o, 1), 0);
  return [s(5), s(3), s(1)];
}
function so(i, t, e) {
  const s = Gs(i, 1, 0.5);
  let n;
  for (t + e > 1 && (n = 1 / (t + e), t *= n, e *= n), n = 0; n < 3; n++)
    s[n] *= 1 - t - e, s[n] += t;
  return s;
}
function no(i, t, e, s, n) {
  return i === n ? (t - e) / s + (t < e ? 6 : 0) : t === n ? (e - i) / s + 2 : (i - t) / s + 4;
}
function bi(i) {
  const e = i.r / 255, s = i.g / 255, n = i.b / 255, o = Math.max(e, s, n), r = Math.min(e, s, n), a = (o + r) / 2;
  let l, c, h;
  return o !== r && (h = o - r, c = a > 0.5 ? h / (2 - o - r) : h / (o + r), l = no(e, s, n, h, o), l = l * 60 + 0.5), [l | 0, c || 0, a];
}
function _i(i, t, e, s) {
  return (Array.isArray(t) ? i(t[0], t[1], t[2]) : i(t, e, s)).map(_t);
}
function xi(i, t, e) {
  return _i(Gs, i, t, e);
}
function oo(i, t, e) {
  return _i(so, i, t, e);
}
function ro(i, t, e) {
  return _i(io, i, t, e);
}
function qs(i) {
  return (i % 360 + 360) % 360;
}
function ao(i) {
  const t = eo.exec(i);
  let e = 255, s;
  if (!t)
    return;
  t[5] !== s && (e = t[6] ? Kt(+t[5]) : _t(+t[5]));
  const n = qs(+t[2]), o = +t[3] / 100, r = +t[4] / 100;
  return t[1] === "hwb" ? s = oo(n, o, r) : t[1] === "hsv" ? s = ro(n, o, r) : s = xi(n, o, r), {
    r: s[0],
    g: s[1],
    b: s[2],
    a: e
  };
}
function lo(i, t) {
  var e = bi(i);
  e[0] = qs(e[0] + t), e = xi(e), i.r = e[0], i.g = e[1], i.b = e[2];
}
function co(i) {
  if (!i)
    return;
  const t = bi(i), e = t[0], s = Ii(t[1]), n = Ii(t[2]);
  return i.a < 255 ? `hsla(${e}, ${s}%, ${n}%, ${ft(i.a)})` : `hsl(${e}, ${s}%, ${n}%)`;
}
const Fi = {
  x: "dark",
  Z: "light",
  Y: "re",
  X: "blu",
  W: "gr",
  V: "medium",
  U: "slate",
  A: "ee",
  T: "ol",
  S: "or",
  B: "ra",
  C: "lateg",
  D: "ights",
  R: "in",
  Q: "turquois",
  E: "hi",
  P: "ro",
  O: "al",
  N: "le",
  M: "de",
  L: "yello",
  F: "en",
  K: "ch",
  G: "arks",
  H: "ea",
  I: "ightg",
  J: "wh"
}, Ri = {
  OiceXe: "f0f8ff",
  antiquewEte: "faebd7",
  aqua: "ffff",
  aquamarRe: "7fffd4",
  azuY: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "0",
  blanKedOmond: "ffebcd",
  Xe: "ff",
  XeviTet: "8a2be2",
  bPwn: "a52a2a",
  burlywood: "deb887",
  caMtXe: "5f9ea0",
  KartYuse: "7fff00",
  KocTate: "d2691e",
  cSO: "ff7f50",
  cSnflowerXe: "6495ed",
  cSnsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "ffff",
  xXe: "8b",
  xcyan: "8b8b",
  xgTMnPd: "b8860b",
  xWay: "a9a9a9",
  xgYF: "6400",
  xgYy: "a9a9a9",
  xkhaki: "bdb76b",
  xmagFta: "8b008b",
  xTivegYF: "556b2f",
  xSange: "ff8c00",
  xScEd: "9932cc",
  xYd: "8b0000",
  xsOmon: "e9967a",
  xsHgYF: "8fbc8f",
  xUXe: "483d8b",
  xUWay: "2f4f4f",
  xUgYy: "2f4f4f",
  xQe: "ced1",
  xviTet: "9400d3",
  dAppRk: "ff1493",
  dApskyXe: "bfff",
  dimWay: "696969",
  dimgYy: "696969",
  dodgerXe: "1e90ff",
  fiYbrick: "b22222",
  flSOwEte: "fffaf0",
  foYstWAn: "228b22",
  fuKsia: "ff00ff",
  gaRsbSo: "dcdcdc",
  ghostwEte: "f8f8ff",
  gTd: "ffd700",
  gTMnPd: "daa520",
  Way: "808080",
  gYF: "8000",
  gYFLw: "adff2f",
  gYy: "808080",
  honeyMw: "f0fff0",
  hotpRk: "ff69b4",
  RdianYd: "cd5c5c",
  Rdigo: "4b0082",
  ivSy: "fffff0",
  khaki: "f0e68c",
  lavFMr: "e6e6fa",
  lavFMrXsh: "fff0f5",
  lawngYF: "7cfc00",
  NmoncEffon: "fffacd",
  ZXe: "add8e6",
  ZcSO: "f08080",
  Zcyan: "e0ffff",
  ZgTMnPdLw: "fafad2",
  ZWay: "d3d3d3",
  ZgYF: "90ee90",
  ZgYy: "d3d3d3",
  ZpRk: "ffb6c1",
  ZsOmon: "ffa07a",
  ZsHgYF: "20b2aa",
  ZskyXe: "87cefa",
  ZUWay: "778899",
  ZUgYy: "778899",
  ZstAlXe: "b0c4de",
  ZLw: "ffffe0",
  lime: "ff00",
  limegYF: "32cd32",
  lRF: "faf0e6",
  magFta: "ff00ff",
  maPon: "800000",
  VaquamarRe: "66cdaa",
  VXe: "cd",
  VScEd: "ba55d3",
  VpurpN: "9370db",
  VsHgYF: "3cb371",
  VUXe: "7b68ee",
  VsprRggYF: "fa9a",
  VQe: "48d1cc",
  VviTetYd: "c71585",
  midnightXe: "191970",
  mRtcYam: "f5fffa",
  mistyPse: "ffe4e1",
  moccasR: "ffe4b5",
  navajowEte: "ffdead",
  navy: "80",
  Tdlace: "fdf5e6",
  Tive: "808000",
  TivedBb: "6b8e23",
  Sange: "ffa500",
  SangeYd: "ff4500",
  ScEd: "da70d6",
  pOegTMnPd: "eee8aa",
  pOegYF: "98fb98",
  pOeQe: "afeeee",
  pOeviTetYd: "db7093",
  papayawEp: "ffefd5",
  pHKpuff: "ffdab9",
  peru: "cd853f",
  pRk: "ffc0cb",
  plum: "dda0dd",
  powMrXe: "b0e0e6",
  purpN: "800080",
  YbeccapurpN: "663399",
  Yd: "ff0000",
  Psybrown: "bc8f8f",
  PyOXe: "4169e1",
  saddNbPwn: "8b4513",
  sOmon: "fa8072",
  sandybPwn: "f4a460",
  sHgYF: "2e8b57",
  sHshell: "fff5ee",
  siFna: "a0522d",
  silver: "c0c0c0",
  skyXe: "87ceeb",
  UXe: "6a5acd",
  UWay: "708090",
  UgYy: "708090",
  snow: "fffafa",
  sprRggYF: "ff7f",
  stAlXe: "4682b4",
  tan: "d2b48c",
  teO: "8080",
  tEstN: "d8bfd8",
  tomato: "ff6347",
  Qe: "40e0d0",
  viTet: "ee82ee",
  JHt: "f5deb3",
  wEte: "ffffff",
  wEtesmoke: "f5f5f5",
  Lw: "ffff00",
  LwgYF: "9acd32"
};
function ho() {
  const i = {}, t = Object.keys(Ri), e = Object.keys(Fi);
  let s, n, o, r, a;
  for (s = 0; s < t.length; s++) {
    for (r = a = t[s], n = 0; n < e.length; n++)
      o = e[n], a = a.replace(o, Fi[o]);
    o = parseInt(Ri[r], 16), i[a] = [o >> 16 & 255, o >> 8 & 255, o & 255];
  }
  return i;
}
let me;
function uo(i) {
  me || (me = ho(), me.transparent = [0, 0, 0, 0]);
  const t = me[i.toLowerCase()];
  return t && {
    r: t[0],
    g: t[1],
    b: t[2],
    a: t.length === 4 ? t[3] : 255
  };
}
const fo = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function go(i) {
  const t = fo.exec(i);
  let e = 255, s, n, o;
  if (t) {
    if (t[7] !== s) {
      const r = +t[7];
      e = t[8] ? Kt(r) : bt(r * 255, 0, 255);
    }
    return s = +t[1], n = +t[3], o = +t[5], s = 255 & (t[2] ? Kt(s) : bt(s, 0, 255)), n = 255 & (t[4] ? Kt(n) : bt(n, 0, 255)), o = 255 & (t[6] ? Kt(o) : bt(o, 0, 255)), {
      r: s,
      g: n,
      b: o,
      a: e
    };
  }
}
function po(i) {
  return i && (i.a < 255 ? `rgba(${i.r}, ${i.g}, ${i.b}, ${ft(i.a)})` : `rgb(${i.r}, ${i.g}, ${i.b})`);
}
const Ge = (i) => i <= 31308e-7 ? i * 12.92 : Math.pow(i, 1 / 2.4) * 1.055 - 0.055, zt = (i) => i <= 0.04045 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
function mo(i, t, e) {
  const s = zt(ft(i.r)), n = zt(ft(i.g)), o = zt(ft(i.b));
  return {
    r: _t(Ge(s + e * (zt(ft(t.r)) - s))),
    g: _t(Ge(n + e * (zt(ft(t.g)) - n))),
    b: _t(Ge(o + e * (zt(ft(t.b)) - o))),
    a: i.a + e * (t.a - i.a)
  };
}
function be(i, t, e) {
  if (i) {
    let s = bi(i);
    s[t] = Math.max(0, Math.min(s[t] + s[t] * e, t === 0 ? 360 : 1)), s = xi(s), i.r = s[0], i.g = s[1], i.b = s[2];
  }
}
function Xs(i, t) {
  return i && Object.assign(t || {}, i);
}
function zi(i) {
  var t = { r: 0, g: 0, b: 0, a: 255 };
  return Array.isArray(i) ? i.length >= 3 && (t = { r: i[0], g: i[1], b: i[2], a: 255 }, i.length > 3 && (t.a = _t(i[3]))) : (t = Xs(i, { r: 0, g: 0, b: 0, a: 1 }), t.a = _t(t.a)), t;
}
function bo(i) {
  return i.charAt(0) === "r" ? go(i) : ao(i);
}
class ae {
  constructor(t) {
    if (t instanceof ae)
      return t;
    const e = typeof t;
    let s;
    e === "object" ? s = zi(t) : e === "string" && (s = Zn(t) || uo(t) || bo(t)), this._rgb = s, this._valid = !!s;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var t = Xs(this._rgb);
    return t && (t.a = ft(t.a)), t;
  }
  set rgb(t) {
    this._rgb = zi(t);
  }
  rgbString() {
    return this._valid ? po(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? to(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? co(this._rgb) : void 0;
  }
  mix(t, e) {
    if (t) {
      const s = this.rgb, n = t.rgb;
      let o;
      const r = e === o ? 0.5 : e, a = 2 * r - 1, l = s.a - n.a, c = ((a * l === -1 ? a : (a + l) / (1 + a * l)) + 1) / 2;
      o = 1 - c, s.r = 255 & c * s.r + o * n.r + 0.5, s.g = 255 & c * s.g + o * n.g + 0.5, s.b = 255 & c * s.b + o * n.b + 0.5, s.a = r * s.a + (1 - r) * n.a, this.rgb = s;
    }
    return this;
  }
  interpolate(t, e) {
    return t && (this._rgb = mo(this._rgb, t._rgb, e)), this;
  }
  clone() {
    return new ae(this.rgb);
  }
  alpha(t) {
    return this._rgb.a = _t(t), this;
  }
  clearer(t) {
    const e = this._rgb;
    return e.a *= 1 - t, this;
  }
  greyscale() {
    const t = this._rgb, e = fe(t.r * 0.3 + t.g * 0.59 + t.b * 0.11);
    return t.r = t.g = t.b = e, this;
  }
  opaquer(t) {
    const e = this._rgb;
    return e.a *= 1 + t, this;
  }
  negate() {
    const t = this._rgb;
    return t.r = 255 - t.r, t.g = 255 - t.g, t.b = 255 - t.b, this;
  }
  lighten(t) {
    return be(this._rgb, 2, t), this;
  }
  darken(t) {
    return be(this._rgb, 2, -t), this;
  }
  saturate(t) {
    return be(this._rgb, 1, t), this;
  }
  desaturate(t) {
    return be(this._rgb, 1, -t), this;
  }
  rotate(t) {
    return lo(this._rgb, t), this;
  }
}
/*!
 * Chart.js v4.5.0
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
function ht() {
}
const _o = /* @__PURE__ */ (() => {
  let i = 0;
  return () => i++;
})();
function E(i) {
  return i == null;
}
function V(i) {
  if (Array.isArray && Array.isArray(i))
    return !0;
  const t = Object.prototype.toString.call(i);
  return t.slice(0, 7) === "[object" && t.slice(-6) === "Array]";
}
function F(i) {
  return i !== null && Object.prototype.toString.call(i) === "[object Object]";
}
function tt(i) {
  return (typeof i == "number" || i instanceof Number) && isFinite(+i);
}
function ot(i, t) {
  return tt(i) ? i : t;
}
function I(i, t) {
  return typeof i > "u" ? t : i;
}
const xo = (i, t) => typeof i == "string" && i.endsWith("%") ? parseFloat(i) / 100 * t : +i;
function B(i, t, e) {
  if (i && typeof i.call == "function")
    return i.apply(e, t);
}
function z(i, t, e, s) {
  let n, o, r;
  if (V(i))
    for (o = i.length, n = 0; n < o; n++)
      t.call(e, i[n], n);
  else if (F(i))
    for (r = Object.keys(i), o = r.length, n = 0; n < o; n++)
      t.call(e, i[r[n]], r[n]);
}
function Fe(i, t) {
  let e, s, n, o;
  if (!i || !t || i.length !== t.length)
    return !1;
  for (e = 0, s = i.length; e < s; ++e)
    if (n = i[e], o = t[e], n.datasetIndex !== o.datasetIndex || n.index !== o.index)
      return !1;
  return !0;
}
function Re(i) {
  if (V(i))
    return i.map(Re);
  if (F(i)) {
    const t = /* @__PURE__ */ Object.create(null), e = Object.keys(i), s = e.length;
    let n = 0;
    for (; n < s; ++n)
      t[e[n]] = Re(i[e[n]]);
    return t;
  }
  return i;
}
function Ks(i) {
  return [
    "__proto__",
    "prototype",
    "constructor"
  ].indexOf(i) === -1;
}
function yo(i, t, e, s) {
  if (!Ks(i))
    return;
  const n = t[i], o = e[i];
  F(n) && F(o) ? le(n, o, s) : t[i] = Re(o);
}
function le(i, t, e) {
  const s = V(t) ? t : [
    t
  ], n = s.length;
  if (!F(i))
    return i;
  e = e || {};
  const o = e.merger || yo;
  let r;
  for (let a = 0; a < n; ++a) {
    if (r = s[a], !F(r))
      continue;
    const l = Object.keys(r);
    for (let c = 0, h = l.length; c < h; ++c)
      o(l[c], i, r, e);
  }
  return i;
}
function ee(i, t) {
  return le(i, t, {
    merger: vo
  });
}
function vo(i, t, e) {
  if (!Ks(i))
    return;
  const s = t[i], n = e[i];
  F(s) && F(n) ? ee(s, n) : Object.prototype.hasOwnProperty.call(t, i) || (t[i] = Re(n));
}
const Ei = {
  // Chart.helpers.core resolveObjectKey should resolve empty key to root object
  "": (i) => i,
  // default resolvers
  x: (i) => i.x,
  y: (i) => i.y
};
function wo(i) {
  const t = i.split("."), e = [];
  let s = "";
  for (const n of t)
    s += n, s.endsWith("\\") ? s = s.slice(0, -1) + "." : (e.push(s), s = "");
  return e;
}
function ko(i) {
  const t = wo(i);
  return (e) => {
    for (const s of t) {
      if (s === "")
        break;
      e = e && e[s];
    }
    return e;
  };
}
function ze(i, t) {
  return (Ei[t] || (Ei[t] = ko(t)))(i);
}
function yi(i) {
  return i.charAt(0).toUpperCase() + i.slice(1);
}
const Ee = (i) => typeof i < "u", xt = (i) => typeof i == "function", Hi = (i, t) => {
  if (i.size !== t.size)
    return !1;
  for (const e of i)
    if (!t.has(e))
      return !1;
  return !0;
};
function So(i) {
  return i.type === "mouseup" || i.type === "click" || i.type === "contextmenu";
}
const j = Math.PI, lt = 2 * j, Mo = lt + j, He = Number.POSITIVE_INFINITY, Co = j / 180, it = j / 2, St = j / 4, Bi = j * 2 / 3, Qs = Math.log10, Bt = Math.sign;
function ie(i, t, e) {
  return Math.abs(i - t) < e;
}
function Ni(i) {
  const t = Math.round(i);
  i = ie(i, t, i / 1e3) ? t : i;
  const e = Math.pow(10, Math.floor(Qs(i))), s = i / e;
  return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 5 ? 5 : 10) * e;
}
function Do(i) {
  const t = [], e = Math.sqrt(i);
  let s;
  for (s = 1; s < e; s++)
    i % s === 0 && (t.push(s), t.push(i / s));
  return e === (e | 0) && t.push(e), t.sort((n, o) => n - o).pop(), t;
}
function Oo(i) {
  return typeof i == "symbol" || typeof i == "object" && i !== null && !(Symbol.toPrimitive in i || "toString" in i || "valueOf" in i);
}
function ce(i) {
  return !Oo(i) && !isNaN(parseFloat(i)) && isFinite(i);
}
function Po(i, t) {
  const e = Math.round(i);
  return e - t <= i && e + t >= i;
}
function To(i, t, e) {
  let s, n, o;
  for (s = 0, n = i.length; s < n; s++)
    o = i[s][e], isNaN(o) || (t.min = Math.min(t.min, o), t.max = Math.max(t.max, o));
}
function Pt(i) {
  return i * (j / 180);
}
function Ao(i) {
  return i * (180 / j);
}
function Wi(i) {
  if (!tt(i))
    return;
  let t = 1, e = 0;
  for (; Math.round(i * t) / t !== i; )
    t *= 10, e++;
  return e;
}
function Lo(i, t) {
  const e = t.x - i.x, s = t.y - i.y, n = Math.sqrt(e * e + s * s);
  let o = Math.atan2(s, e);
  return o < -0.5 * j && (o += lt), {
    angle: o,
    distance: n
  };
}
function ri(i, t) {
  return Math.sqrt(Math.pow(t.x - i.x, 2) + Math.pow(t.y - i.y, 2));
}
function Io(i, t) {
  return (i - t + Mo) % lt - j;
}
function mt(i) {
  return (i % lt + lt) % lt;
}
function Zs(i, t, e, s) {
  const n = mt(i), o = mt(t), r = mt(e), a = mt(o - n), l = mt(r - n), c = mt(n - o), h = mt(n - r);
  return n === o || n === r || s && o === r || a > l && c < h;
}
function Z(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function Fo(i) {
  return Z(i, -32768, 32767);
}
function Qt(i, t, e, s = 1e-6) {
  return i >= Math.min(t, e) - s && i <= Math.max(t, e) + s;
}
function vi(i, t, e) {
  e = e || ((r) => i[r] < t);
  let s = i.length - 1, n = 0, o;
  for (; s - n > 1; )
    o = n + s >> 1, e(o) ? n = o : s = o;
  return {
    lo: n,
    hi: s
  };
}
const Tt = (i, t, e, s) => vi(i, e, s ? (n) => {
  const o = i[n][t];
  return o < e || o === e && i[n + 1][t] === e;
} : (n) => i[n][t] < e), Ro = (i, t, e) => vi(i, e, (s) => i[s][t] >= e);
function zo(i, t, e) {
  let s = 0, n = i.length;
  for (; s < n && i[s] < t; )
    s++;
  for (; n > s && i[n - 1] > e; )
    n--;
  return s > 0 || n < i.length ? i.slice(s, n) : i;
}
const Js = [
  "push",
  "pop",
  "shift",
  "splice",
  "unshift"
];
function Eo(i, t) {
  if (i._chartjs) {
    i._chartjs.listeners.push(t);
    return;
  }
  Object.defineProperty(i, "_chartjs", {
    configurable: !0,
    enumerable: !1,
    value: {
      listeners: [
        t
      ]
    }
  }), Js.forEach((e) => {
    const s = "_onData" + yi(e), n = i[e];
    Object.defineProperty(i, e, {
      configurable: !0,
      enumerable: !1,
      value(...o) {
        const r = n.apply(this, o);
        return i._chartjs.listeners.forEach((a) => {
          typeof a[s] == "function" && a[s](...o);
        }), r;
      }
    });
  });
}
function Vi(i, t) {
  const e = i._chartjs;
  if (!e)
    return;
  const s = e.listeners, n = s.indexOf(t);
  n !== -1 && s.splice(n, 1), !(s.length > 0) && (Js.forEach((o) => {
    delete i[o];
  }), delete i._chartjs);
}
function Ho(i) {
  const t = new Set(i);
  return t.size === i.length ? i : Array.from(t);
}
const tn = function() {
  return typeof window > "u" ? function(i) {
    return i();
  } : window.requestAnimationFrame;
}();
function en(i, t) {
  let e = [], s = !1;
  return function(...n) {
    e = n, s || (s = !0, tn.call(window, () => {
      s = !1, i.apply(t, e);
    }));
  };
}
function Bo(i, t) {
  let e;
  return function(...s) {
    return t ? (clearTimeout(e), e = setTimeout(i, t, s)) : i.apply(this, s), t;
  };
}
const wi = (i) => i === "start" ? "left" : i === "end" ? "right" : "center", U = (i, t, e) => i === "start" ? t : i === "end" ? e : (t + e) / 2, No = (i, t, e, s) => i === (s ? "left" : "right") ? e : i === "center" ? (t + e) / 2 : t;
function Wo(i, t, e) {
  const s = t.length;
  let n = 0, o = s;
  if (i._sorted) {
    const { iScale: r, vScale: a, _parsed: l } = i, c = i.dataset && i.dataset.options ? i.dataset.options.spanGaps : null, h = r.axis, { min: d, max: u, minDefined: f, maxDefined: m } = r.getUserBounds();
    if (f) {
      if (n = Math.min(
        // @ts-expect-error Need to type _parsed
        Tt(l, h, d).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? s : Tt(t, h, r.getPixelForValue(d)).lo
      ), c) {
        const g = l.slice(0, n + 1).reverse().findIndex((p) => !E(p[a.axis]));
        n -= Math.max(0, g);
      }
      n = Z(n, 0, s - 1);
    }
    if (m) {
      let g = Math.max(
        // @ts-expect-error Need to type _parsed
        Tt(l, r.axis, u, !0).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? 0 : Tt(t, h, r.getPixelForValue(u), !0).hi + 1
      );
      if (c) {
        const p = l.slice(g - 1).findIndex((b) => !E(b[a.axis]));
        g += Math.max(0, p);
      }
      o = Z(g, n, s) - n;
    } else
      o = s - n;
  }
  return {
    start: n,
    count: o
  };
}
function Vo(i) {
  const { xScale: t, yScale: e, _scaleRanges: s } = i, n = {
    xmin: t.min,
    xmax: t.max,
    ymin: e.min,
    ymax: e.max
  };
  if (!s)
    return i._scaleRanges = n, !0;
  const o = s.xmin !== t.min || s.xmax !== t.max || s.ymin !== e.min || s.ymax !== e.max;
  return Object.assign(s, n), o;
}
const _e = (i) => i === 0 || i === 1, ji = (i, t, e) => -(Math.pow(2, 10 * (i -= 1)) * Math.sin((i - t) * lt / e)), $i = (i, t, e) => Math.pow(2, -10 * i) * Math.sin((i - t) * lt / e) + 1, se = {
  linear: (i) => i,
  easeInQuad: (i) => i * i,
  easeOutQuad: (i) => -i * (i - 2),
  easeInOutQuad: (i) => (i /= 0.5) < 1 ? 0.5 * i * i : -0.5 * (--i * (i - 2) - 1),
  easeInCubic: (i) => i * i * i,
  easeOutCubic: (i) => (i -= 1) * i * i + 1,
  easeInOutCubic: (i) => (i /= 0.5) < 1 ? 0.5 * i * i * i : 0.5 * ((i -= 2) * i * i + 2),
  easeInQuart: (i) => i * i * i * i,
  easeOutQuart: (i) => -((i -= 1) * i * i * i - 1),
  easeInOutQuart: (i) => (i /= 0.5) < 1 ? 0.5 * i * i * i * i : -0.5 * ((i -= 2) * i * i * i - 2),
  easeInQuint: (i) => i * i * i * i * i,
  easeOutQuint: (i) => (i -= 1) * i * i * i * i + 1,
  easeInOutQuint: (i) => (i /= 0.5) < 1 ? 0.5 * i * i * i * i * i : 0.5 * ((i -= 2) * i * i * i * i + 2),
  easeInSine: (i) => -Math.cos(i * it) + 1,
  easeOutSine: (i) => Math.sin(i * it),
  easeInOutSine: (i) => -0.5 * (Math.cos(j * i) - 1),
  easeInExpo: (i) => i === 0 ? 0 : Math.pow(2, 10 * (i - 1)),
  easeOutExpo: (i) => i === 1 ? 1 : -Math.pow(2, -10 * i) + 1,
  easeInOutExpo: (i) => _e(i) ? i : i < 0.5 ? 0.5 * Math.pow(2, 10 * (i * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (i * 2 - 1)) + 2),
  easeInCirc: (i) => i >= 1 ? i : -(Math.sqrt(1 - i * i) - 1),
  easeOutCirc: (i) => Math.sqrt(1 - (i -= 1) * i),
  easeInOutCirc: (i) => (i /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - i * i) - 1) : 0.5 * (Math.sqrt(1 - (i -= 2) * i) + 1),
  easeInElastic: (i) => _e(i) ? i : ji(i, 0.075, 0.3),
  easeOutElastic: (i) => _e(i) ? i : $i(i, 0.075, 0.3),
  easeInOutElastic(i) {
    return _e(i) ? i : i < 0.5 ? 0.5 * ji(i * 2, 0.1125, 0.45) : 0.5 + 0.5 * $i(i * 2 - 1, 0.1125, 0.45);
  },
  easeInBack(i) {
    return i * i * ((1.70158 + 1) * i - 1.70158);
  },
  easeOutBack(i) {
    return (i -= 1) * i * ((1.70158 + 1) * i + 1.70158) + 1;
  },
  easeInOutBack(i) {
    let t = 1.70158;
    return (i /= 0.5) < 1 ? 0.5 * (i * i * (((t *= 1.525) + 1) * i - t)) : 0.5 * ((i -= 2) * i * (((t *= 1.525) + 1) * i + t) + 2);
  },
  easeInBounce: (i) => 1 - se.easeOutBounce(1 - i),
  easeOutBounce(i) {
    return i < 1 / 2.75 ? 7.5625 * i * i : i < 2 / 2.75 ? 7.5625 * (i -= 1.5 / 2.75) * i + 0.75 : i < 2.5 / 2.75 ? 7.5625 * (i -= 2.25 / 2.75) * i + 0.9375 : 7.5625 * (i -= 2.625 / 2.75) * i + 0.984375;
  },
  easeInOutBounce: (i) => i < 0.5 ? se.easeInBounce(i * 2) * 0.5 : se.easeOutBounce(i * 2 - 1) * 0.5 + 0.5
};
function ki(i) {
  if (i && typeof i == "object") {
    const t = i.toString();
    return t === "[object CanvasPattern]" || t === "[object CanvasGradient]";
  }
  return !1;
}
function Ui(i) {
  return ki(i) ? i : new ae(i);
}
function qe(i) {
  return ki(i) ? i : new ae(i).saturate(0.5).darken(0.1).hexString();
}
const jo = [
  "x",
  "y",
  "borderWidth",
  "radius",
  "tension"
], $o = [
  "color",
  "borderColor",
  "backgroundColor"
];
function Uo(i) {
  i.set("animation", {
    delay: void 0,
    duration: 1e3,
    easing: "easeOutQuart",
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0
  }), i.describe("animation", {
    _fallback: !1,
    _indexable: !1,
    _scriptable: (t) => t !== "onProgress" && t !== "onComplete" && t !== "fn"
  }), i.set("animations", {
    colors: {
      type: "color",
      properties: $o
    },
    numbers: {
      type: "number",
      properties: jo
    }
  }), i.describe("animations", {
    _fallback: "animation"
  }), i.set("transitions", {
    active: {
      animation: {
        duration: 400
      }
    },
    resize: {
      animation: {
        duration: 0
      }
    },
    show: {
      animations: {
        colors: {
          from: "transparent"
        },
        visible: {
          type: "boolean",
          duration: 0
        }
      }
    },
    hide: {
      animations: {
        colors: {
          to: "transparent"
        },
        visible: {
          type: "boolean",
          easing: "linear",
          fn: (t) => t | 0
        }
      }
    }
  });
}
function Yo(i) {
  i.set("layout", {
    autoPadding: !0,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });
}
const Yi = /* @__PURE__ */ new Map();
function Go(i, t) {
  t = t || {};
  const e = i + JSON.stringify(t);
  let s = Yi.get(e);
  return s || (s = new Intl.NumberFormat(i, t), Yi.set(e, s)), s;
}
function sn(i, t, e) {
  return Go(t, e).format(i);
}
const qo = {
  values(i) {
    return V(i) ? i : "" + i;
  },
  numeric(i, t, e) {
    if (i === 0)
      return "0";
    const s = this.chart.options.locale;
    let n, o = i;
    if (e.length > 1) {
      const c = Math.max(Math.abs(e[0].value), Math.abs(e[e.length - 1].value));
      (c < 1e-4 || c > 1e15) && (n = "scientific"), o = Xo(i, e);
    }
    const r = Qs(Math.abs(o)), a = isNaN(r) ? 1 : Math.max(Math.min(-1 * Math.floor(r), 20), 0), l = {
      notation: n,
      minimumFractionDigits: a,
      maximumFractionDigits: a
    };
    return Object.assign(l, this.options.ticks.format), sn(i, s, l);
  }
};
function Xo(i, t) {
  let e = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
  return Math.abs(e) >= 1 && i !== Math.floor(i) && (e = i - Math.floor(i)), e;
}
var nn = {
  formatters: qo
};
function Ko(i) {
  i.set("scale", {
    display: !0,
    offset: !1,
    reverse: !1,
    beginAtZero: !1,
    bounds: "ticks",
    clip: !0,
    grace: 0,
    grid: {
      display: !0,
      lineWidth: 1,
      drawOnChartArea: !0,
      drawTicks: !0,
      tickLength: 8,
      tickWidth: (t, e) => e.lineWidth,
      tickColor: (t, e) => e.color,
      offset: !1
    },
    border: {
      display: !0,
      dash: [],
      dashOffset: 0,
      width: 1
    },
    title: {
      display: !1,
      text: "",
      padding: {
        top: 4,
        bottom: 4
      }
    },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: !1,
      textStrokeWidth: 0,
      textStrokeColor: "",
      padding: 3,
      display: !0,
      autoSkip: !0,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: nn.formatters.values,
      minor: {},
      major: {},
      align: "center",
      crossAlign: "near",
      showLabelBackdrop: !1,
      backdropColor: "rgba(255, 255, 255, 0.75)",
      backdropPadding: 2
    }
  }), i.route("scale.ticks", "color", "", "color"), i.route("scale.grid", "color", "", "borderColor"), i.route("scale.border", "color", "", "borderColor"), i.route("scale.title", "color", "", "color"), i.describe("scale", {
    _fallback: !1,
    _scriptable: (t) => !t.startsWith("before") && !t.startsWith("after") && t !== "callback" && t !== "parser",
    _indexable: (t) => t !== "borderDash" && t !== "tickBorderDash" && t !== "dash"
  }), i.describe("scales", {
    _fallback: "scale"
  }), i.describe("scale.ticks", {
    _scriptable: (t) => t !== "backdropPadding" && t !== "callback",
    _indexable: (t) => t !== "backdropPadding"
  });
}
const Lt = /* @__PURE__ */ Object.create(null), ai = /* @__PURE__ */ Object.create(null);
function ne(i, t) {
  if (!t)
    return i;
  const e = t.split(".");
  for (let s = 0, n = e.length; s < n; ++s) {
    const o = e[s];
    i = i[o] || (i[o] = /* @__PURE__ */ Object.create(null));
  }
  return i;
}
function Xe(i, t, e) {
  return typeof t == "string" ? le(ne(i, t), e) : le(ne(i, ""), t);
}
class Qo {
  constructor(t, e) {
    this.animation = void 0, this.backgroundColor = "rgba(0,0,0,0.1)", this.borderColor = "rgba(0,0,0,0.1)", this.color = "#666", this.datasets = {}, this.devicePixelRatio = (s) => s.chart.platform.getDevicePixelRatio(), this.elements = {}, this.events = [
      "mousemove",
      "mouseout",
      "click",
      "touchstart",
      "touchmove"
    ], this.font = {
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      style: "normal",
      lineHeight: 1.2,
      weight: null
    }, this.hover = {}, this.hoverBackgroundColor = (s, n) => qe(n.backgroundColor), this.hoverBorderColor = (s, n) => qe(n.borderColor), this.hoverColor = (s, n) => qe(n.color), this.indexAxis = "x", this.interaction = {
      mode: "nearest",
      intersect: !0,
      includeInvisible: !1
    }, this.maintainAspectRatio = !0, this.onHover = null, this.onClick = null, this.parsing = !0, this.plugins = {}, this.responsive = !0, this.scale = void 0, this.scales = {}, this.showLine = !0, this.drawActiveElementsOnTop = !0, this.describe(t), this.apply(e);
  }
  set(t, e) {
    return Xe(this, t, e);
  }
  get(t) {
    return ne(this, t);
  }
  describe(t, e) {
    return Xe(ai, t, e);
  }
  override(t, e) {
    return Xe(Lt, t, e);
  }
  route(t, e, s, n) {
    const o = ne(this, t), r = ne(this, s), a = "_" + e;
    Object.defineProperties(o, {
      [a]: {
        value: o[e],
        writable: !0
      },
      [e]: {
        enumerable: !0,
        get() {
          const l = this[a], c = r[n];
          return F(l) ? Object.assign({}, c, l) : I(l, c);
        },
        set(l) {
          this[a] = l;
        }
      }
    });
  }
  apply(t) {
    t.forEach((e) => e(this));
  }
}
var W = /* @__PURE__ */ new Qo({
  _scriptable: (i) => !i.startsWith("on"),
  _indexable: (i) => i !== "events",
  hover: {
    _fallback: "interaction"
  },
  interaction: {
    _scriptable: !1,
    _indexable: !1
  }
}, [
  Uo,
  Yo,
  Ko
]);
function Zo(i) {
  return !i || E(i.size) || E(i.family) ? null : (i.style ? i.style + " " : "") + (i.weight ? i.weight + " " : "") + i.size + "px " + i.family;
}
function Gi(i, t, e, s, n) {
  let o = t[n];
  return o || (o = t[n] = i.measureText(n).width, e.push(n)), o > s && (s = o), s;
}
function Mt(i, t, e) {
  const s = i.currentDevicePixelRatio, n = e !== 0 ? Math.max(e / 2, 0.5) : 0;
  return Math.round((t - n) * s) / s + n;
}
function qi(i, t) {
  !t && !i || (t = t || i.getContext("2d"), t.save(), t.resetTransform(), t.clearRect(0, 0, i.width, i.height), t.restore());
}
function li(i, t, e, s) {
  on(i, t, e, s, null);
}
function on(i, t, e, s, n) {
  let o, r, a, l, c, h, d, u;
  const f = t.pointStyle, m = t.rotation, g = t.radius;
  let p = (m || 0) * Co;
  if (f && typeof f == "object" && (o = f.toString(), o === "[object HTMLImageElement]" || o === "[object HTMLCanvasElement]")) {
    i.save(), i.translate(e, s), i.rotate(p), i.drawImage(f, -f.width / 2, -f.height / 2, f.width, f.height), i.restore();
    return;
  }
  if (!(isNaN(g) || g <= 0)) {
    switch (i.beginPath(), f) {
      default:
        n ? i.ellipse(e, s, n / 2, g, 0, 0, lt) : i.arc(e, s, g, 0, lt), i.closePath();
        break;
      case "triangle":
        h = n ? n / 2 : g, i.moveTo(e + Math.sin(p) * h, s - Math.cos(p) * g), p += Bi, i.lineTo(e + Math.sin(p) * h, s - Math.cos(p) * g), p += Bi, i.lineTo(e + Math.sin(p) * h, s - Math.cos(p) * g), i.closePath();
        break;
      case "rectRounded":
        c = g * 0.516, l = g - c, r = Math.cos(p + St) * l, d = Math.cos(p + St) * (n ? n / 2 - c : l), a = Math.sin(p + St) * l, u = Math.sin(p + St) * (n ? n / 2 - c : l), i.arc(e - d, s - a, c, p - j, p - it), i.arc(e + u, s - r, c, p - it, p), i.arc(e + d, s + a, c, p, p + it), i.arc(e - u, s + r, c, p + it, p + j), i.closePath();
        break;
      case "rect":
        if (!m) {
          l = Math.SQRT1_2 * g, h = n ? n / 2 : l, i.rect(e - h, s - l, 2 * h, 2 * l);
          break;
        }
        p += St;
      case "rectRot":
        d = Math.cos(p) * (n ? n / 2 : g), r = Math.cos(p) * g, a = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - a), i.lineTo(e + u, s - r), i.lineTo(e + d, s + a), i.lineTo(e - u, s + r), i.closePath();
        break;
      case "crossRot":
        p += St;
      case "cross":
        d = Math.cos(p) * (n ? n / 2 : g), r = Math.cos(p) * g, a = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r);
        break;
      case "star":
        d = Math.cos(p) * (n ? n / 2 : g), r = Math.cos(p) * g, a = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r), p += St, d = Math.cos(p) * (n ? n / 2 : g), r = Math.cos(p) * g, a = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r);
        break;
      case "line":
        r = n ? n / 2 : Math.cos(p) * g, a = Math.sin(p) * g, i.moveTo(e - r, s - a), i.lineTo(e + r, s + a);
        break;
      case "dash":
        i.moveTo(e, s), i.lineTo(e + Math.cos(p) * (n ? n / 2 : g), s + Math.sin(p) * g);
        break;
      case !1:
        i.closePath();
        break;
    }
    i.fill(), t.borderWidth > 0 && i.stroke();
  }
}
function he(i, t, e) {
  return e = e || 0.5, !t || i && i.x > t.left - e && i.x < t.right + e && i.y > t.top - e && i.y < t.bottom + e;
}
function Si(i, t) {
  i.save(), i.beginPath(), i.rect(t.left, t.top, t.right - t.left, t.bottom - t.top), i.clip();
}
function Mi(i) {
  i.restore();
}
function Jo(i, t, e, s, n) {
  if (!t)
    return i.lineTo(e.x, e.y);
  if (n === "middle") {
    const o = (t.x + e.x) / 2;
    i.lineTo(o, t.y), i.lineTo(o, e.y);
  } else n === "after" != !!s ? i.lineTo(t.x, e.y) : i.lineTo(e.x, t.y);
  i.lineTo(e.x, e.y);
}
function tr(i, t, e, s) {
  if (!t)
    return i.lineTo(e.x, e.y);
  i.bezierCurveTo(s ? t.cp1x : t.cp2x, s ? t.cp1y : t.cp2y, s ? e.cp2x : e.cp1x, s ? e.cp2y : e.cp1y, e.x, e.y);
}
function er(i, t) {
  t.translation && i.translate(t.translation[0], t.translation[1]), E(t.rotation) || i.rotate(t.rotation), t.color && (i.fillStyle = t.color), t.textAlign && (i.textAlign = t.textAlign), t.textBaseline && (i.textBaseline = t.textBaseline);
}
function ir(i, t, e, s, n) {
  if (n.strikethrough || n.underline) {
    const o = i.measureText(s), r = t - o.actualBoundingBoxLeft, a = t + o.actualBoundingBoxRight, l = e - o.actualBoundingBoxAscent, c = e + o.actualBoundingBoxDescent, h = n.strikethrough ? (l + c) / 2 : c;
    i.strokeStyle = i.fillStyle, i.beginPath(), i.lineWidth = n.decorationWidth || 2, i.moveTo(r, h), i.lineTo(a, h), i.stroke();
  }
}
function sr(i, t) {
  const e = i.fillStyle;
  i.fillStyle = t.color, i.fillRect(t.left, t.top, t.width, t.height), i.fillStyle = e;
}
function de(i, t, e, s, n, o = {}) {
  const r = V(t) ? t : [
    t
  ], a = o.strokeWidth > 0 && o.strokeColor !== "";
  let l, c;
  for (i.save(), i.font = n.string, er(i, o), l = 0; l < r.length; ++l)
    c = r[l], o.backdrop && sr(i, o.backdrop), a && (o.strokeColor && (i.strokeStyle = o.strokeColor), E(o.strokeWidth) || (i.lineWidth = o.strokeWidth), i.strokeText(c, e, s, o.maxWidth)), i.fillText(c, e, s, o.maxWidth), ir(i, e, s, c, o), s += Number(n.lineHeight);
  i.restore();
}
function ci(i, t) {
  const { x: e, y: s, w: n, h: o, radius: r } = t;
  i.arc(e + r.topLeft, s + r.topLeft, r.topLeft, 1.5 * j, j, !0), i.lineTo(e, s + o - r.bottomLeft), i.arc(e + r.bottomLeft, s + o - r.bottomLeft, r.bottomLeft, j, it, !0), i.lineTo(e + n - r.bottomRight, s + o), i.arc(e + n - r.bottomRight, s + o - r.bottomRight, r.bottomRight, it, 0, !0), i.lineTo(e + n, s + r.topRight), i.arc(e + n - r.topRight, s + r.topRight, r.topRight, 0, -it, !0), i.lineTo(e + r.topLeft, s);
}
const nr = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/, or = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function rr(i, t) {
  const e = ("" + i).match(nr);
  if (!e || e[1] === "normal")
    return t * 1.2;
  switch (i = +e[2], e[3]) {
    case "px":
      return i;
    case "%":
      i /= 100;
      break;
  }
  return t * i;
}
const ar = (i) => +i || 0;
function rn(i, t) {
  const e = {}, s = F(t), n = s ? Object.keys(t) : t, o = F(i) ? s ? (r) => I(i[r], i[t[r]]) : (r) => i[r] : () => i;
  for (const r of n)
    e[r] = ar(o(r));
  return e;
}
function lr(i) {
  return rn(i, {
    top: "y",
    right: "x",
    bottom: "y",
    left: "x"
  });
}
function oe(i) {
  return rn(i, [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);
}
function et(i) {
  const t = lr(i);
  return t.width = t.left + t.right, t.height = t.top + t.bottom, t;
}
function Y(i, t) {
  i = i || {}, t = t || W.font;
  let e = I(i.size, t.size);
  typeof e == "string" && (e = parseInt(e, 10));
  let s = I(i.style, t.style);
  s && !("" + s).match(or) && (console.warn('Invalid font style specified: "' + s + '"'), s = void 0);
  const n = {
    family: I(i.family, t.family),
    lineHeight: rr(I(i.lineHeight, t.lineHeight), e),
    size: e,
    style: s,
    weight: I(i.weight, t.weight),
    string: ""
  };
  return n.string = Zo(n), n;
}
function xe(i, t, e, s) {
  let n, o, r;
  for (n = 0, o = i.length; n < o; ++n)
    if (r = i[n], r !== void 0 && r !== void 0)
      return r;
}
function cr(i, t, e) {
  const { min: s, max: n } = i, o = xo(t, (n - s) / 2), r = (a, l) => e && a === 0 ? 0 : a + l;
  return {
    min: r(s, -Math.abs(o)),
    max: r(n, o)
  };
}
function It(i, t) {
  return Object.assign(Object.create(i), t);
}
function Ci(i, t = [
  ""
], e, s, n = () => i[0]) {
  const o = e || i;
  typeof s > "u" && (s = hn("_fallback", i));
  const r = {
    [Symbol.toStringTag]: "Object",
    _cacheable: !0,
    _scopes: i,
    _rootScopes: o,
    _fallback: s,
    _getTarget: n,
    override: (a) => Ci([
      a,
      ...i
    ], t, o, s)
  };
  return new Proxy(r, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(a, l) {
      return delete a[l], delete a._keys, delete i[0][l], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(a, l) {
      return ln(a, l, () => br(l, t, i, a));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(a, l) {
      return Reflect.getOwnPropertyDescriptor(a._scopes[0], l);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(i[0]);
    },
    /**
    * A trap for the in operator.
    */
    has(a, l) {
      return Ki(a).includes(l);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys(a) {
      return Ki(a);
    },
    /**
    * A trap for setting property values.
    */
    set(a, l, c) {
      const h = a._storage || (a._storage = n());
      return a[l] = h[l] = c, delete a._keys, !0;
    }
  });
}
function Nt(i, t, e, s) {
  const n = {
    _cacheable: !1,
    _proxy: i,
    _context: t,
    _subProxy: e,
    _stack: /* @__PURE__ */ new Set(),
    _descriptors: an(i, s),
    setContext: (o) => Nt(i, o, e, s),
    override: (o) => Nt(i.override(o), t, e, s)
  };
  return new Proxy(n, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(o, r) {
      return delete o[r], delete i[r], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(o, r, a) {
      return ln(o, r, () => dr(o, r, a));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(o, r) {
      return o._descriptors.allKeys ? Reflect.has(i, r) ? {
        enumerable: !0,
        configurable: !0
      } : void 0 : Reflect.getOwnPropertyDescriptor(i, r);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(i);
    },
    /**
    * A trap for the in operator.
    */
    has(o, r) {
      return Reflect.has(i, r);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys() {
      return Reflect.ownKeys(i);
    },
    /**
    * A trap for setting property values.
    */
    set(o, r, a) {
      return i[r] = a, delete o[r], !0;
    }
  });
}
function an(i, t = {
  scriptable: !0,
  indexable: !0
}) {
  const { _scriptable: e = t.scriptable, _indexable: s = t.indexable, _allKeys: n = t.allKeys } = i;
  return {
    allKeys: n,
    scriptable: e,
    indexable: s,
    isScriptable: xt(e) ? e : () => e,
    isIndexable: xt(s) ? s : () => s
  };
}
const hr = (i, t) => i ? i + yi(t) : t, Di = (i, t) => F(t) && i !== "adapters" && (Object.getPrototypeOf(t) === null || t.constructor === Object);
function ln(i, t, e) {
  if (Object.prototype.hasOwnProperty.call(i, t) || t === "constructor")
    return i[t];
  const s = e();
  return i[t] = s, s;
}
function dr(i, t, e) {
  const { _proxy: s, _context: n, _subProxy: o, _descriptors: r } = i;
  let a = s[t];
  return xt(a) && r.isScriptable(t) && (a = ur(t, a, i, e)), V(a) && a.length && (a = fr(t, a, i, r.isIndexable)), Di(t, a) && (a = Nt(a, n, o && o[t], r)), a;
}
function ur(i, t, e, s) {
  const { _proxy: n, _context: o, _subProxy: r, _stack: a } = e;
  if (a.has(i))
    throw new Error("Recursion detected: " + Array.from(a).join("->") + "->" + i);
  a.add(i);
  let l = t(o, r || s);
  return a.delete(i), Di(i, l) && (l = Oi(n._scopes, n, i, l)), l;
}
function fr(i, t, e, s) {
  const { _proxy: n, _context: o, _subProxy: r, _descriptors: a } = e;
  if (typeof o.index < "u" && s(i))
    return t[o.index % t.length];
  if (F(t[0])) {
    const l = t, c = n._scopes.filter((h) => h !== l);
    t = [];
    for (const h of l) {
      const d = Oi(c, n, i, h);
      t.push(Nt(d, o, r && r[i], a));
    }
  }
  return t;
}
function cn(i, t, e) {
  return xt(i) ? i(t, e) : i;
}
const gr = (i, t) => i === !0 ? t : typeof i == "string" ? ze(t, i) : void 0;
function pr(i, t, e, s, n) {
  for (const o of t) {
    const r = gr(e, o);
    if (r) {
      i.add(r);
      const a = cn(r._fallback, e, n);
      if (typeof a < "u" && a !== e && a !== s)
        return a;
    } else if (r === !1 && typeof s < "u" && e !== s)
      return null;
  }
  return !1;
}
function Oi(i, t, e, s) {
  const n = t._rootScopes, o = cn(t._fallback, e, s), r = [
    ...i,
    ...n
  ], a = /* @__PURE__ */ new Set();
  a.add(s);
  let l = Xi(a, r, e, o || e, s);
  return l === null || typeof o < "u" && o !== e && (l = Xi(a, r, o, l, s), l === null) ? !1 : Ci(Array.from(a), [
    ""
  ], n, o, () => mr(t, e, s));
}
function Xi(i, t, e, s, n) {
  for (; e; )
    e = pr(i, t, e, s, n);
  return e;
}
function mr(i, t, e) {
  const s = i._getTarget();
  t in s || (s[t] = {});
  const n = s[t];
  return V(n) && F(e) ? e : n || {};
}
function br(i, t, e, s) {
  let n;
  for (const o of t)
    if (n = hn(hr(o, i), e), typeof n < "u")
      return Di(i, n) ? Oi(e, s, i, n) : n;
}
function hn(i, t) {
  for (const e of t) {
    if (!e)
      continue;
    const s = e[i];
    if (typeof s < "u")
      return s;
  }
}
function Ki(i) {
  let t = i._keys;
  return t || (t = i._keys = _r(i._scopes)), t;
}
function _r(i) {
  const t = /* @__PURE__ */ new Set();
  for (const e of i)
    for (const s of Object.keys(e).filter((n) => !n.startsWith("_")))
      t.add(s);
  return Array.from(t);
}
const xr = Number.EPSILON || 1e-14, Wt = (i, t) => t < i.length && !i[t].skip && i[t], dn = (i) => i === "x" ? "y" : "x";
function yr(i, t, e, s) {
  const n = i.skip ? t : i, o = t, r = e.skip ? t : e, a = ri(o, n), l = ri(r, o);
  let c = a / (a + l), h = l / (a + l);
  c = isNaN(c) ? 0 : c, h = isNaN(h) ? 0 : h;
  const d = s * c, u = s * h;
  return {
    previous: {
      x: o.x - d * (r.x - n.x),
      y: o.y - d * (r.y - n.y)
    },
    next: {
      x: o.x + u * (r.x - n.x),
      y: o.y + u * (r.y - n.y)
    }
  };
}
function vr(i, t, e) {
  const s = i.length;
  let n, o, r, a, l, c = Wt(i, 0);
  for (let h = 0; h < s - 1; ++h)
    if (l = c, c = Wt(i, h + 1), !(!l || !c)) {
      if (ie(t[h], 0, xr)) {
        e[h] = e[h + 1] = 0;
        continue;
      }
      n = e[h] / t[h], o = e[h + 1] / t[h], a = Math.pow(n, 2) + Math.pow(o, 2), !(a <= 9) && (r = 3 / Math.sqrt(a), e[h] = n * r * t[h], e[h + 1] = o * r * t[h]);
    }
}
function wr(i, t, e = "x") {
  const s = dn(e), n = i.length;
  let o, r, a, l = Wt(i, 0);
  for (let c = 0; c < n; ++c) {
    if (r = a, a = l, l = Wt(i, c + 1), !a)
      continue;
    const h = a[e], d = a[s];
    r && (o = (h - r[e]) / 3, a[`cp1${e}`] = h - o, a[`cp1${s}`] = d - o * t[c]), l && (o = (l[e] - h) / 3, a[`cp2${e}`] = h + o, a[`cp2${s}`] = d + o * t[c]);
  }
}
function kr(i, t = "x") {
  const e = dn(t), s = i.length, n = Array(s).fill(0), o = Array(s);
  let r, a, l, c = Wt(i, 0);
  for (r = 0; r < s; ++r)
    if (a = l, l = c, c = Wt(i, r + 1), !!l) {
      if (c) {
        const h = c[t] - l[t];
        n[r] = h !== 0 ? (c[e] - l[e]) / h : 0;
      }
      o[r] = a ? c ? Bt(n[r - 1]) !== Bt(n[r]) ? 0 : (n[r - 1] + n[r]) / 2 : n[r - 1] : n[r];
    }
  vr(i, n, o), wr(i, o, t);
}
function ye(i, t, e) {
  return Math.max(Math.min(i, e), t);
}
function Sr(i, t) {
  let e, s, n, o, r, a = he(i[0], t);
  for (e = 0, s = i.length; e < s; ++e)
    r = o, o = a, a = e < s - 1 && he(i[e + 1], t), o && (n = i[e], r && (n.cp1x = ye(n.cp1x, t.left, t.right), n.cp1y = ye(n.cp1y, t.top, t.bottom)), a && (n.cp2x = ye(n.cp2x, t.left, t.right), n.cp2y = ye(n.cp2y, t.top, t.bottom)));
}
function Mr(i, t, e, s, n) {
  let o, r, a, l;
  if (t.spanGaps && (i = i.filter((c) => !c.skip)), t.cubicInterpolationMode === "monotone")
    kr(i, n);
  else {
    let c = s ? i[i.length - 1] : i[0];
    for (o = 0, r = i.length; o < r; ++o)
      a = i[o], l = yr(c, a, i[Math.min(o + 1, r - (s ? 0 : 1)) % r], t.tension), a.cp1x = l.previous.x, a.cp1y = l.previous.y, a.cp2x = l.next.x, a.cp2y = l.next.y, c = a;
  }
  t.capBezierPoints && Sr(i, e);
}
function Pi() {
  return typeof window < "u" && typeof document < "u";
}
function Ti(i) {
  let t = i.parentNode;
  return t && t.toString() === "[object ShadowRoot]" && (t = t.host), t;
}
function Be(i, t, e) {
  let s;
  return typeof i == "string" ? (s = parseInt(i, 10), i.indexOf("%") !== -1 && (s = s / 100 * t.parentNode[e])) : s = i, s;
}
const Ve = (i) => i.ownerDocument.defaultView.getComputedStyle(i, null);
function Cr(i, t) {
  return Ve(i).getPropertyValue(t);
}
const Dr = [
  "top",
  "right",
  "bottom",
  "left"
];
function At(i, t, e) {
  const s = {};
  e = e ? "-" + e : "";
  for (let n = 0; n < 4; n++) {
    const o = Dr[n];
    s[o] = parseFloat(i[t + "-" + o + e]) || 0;
  }
  return s.width = s.left + s.right, s.height = s.top + s.bottom, s;
}
const Or = (i, t, e) => (i > 0 || t > 0) && (!e || !e.shadowRoot);
function Pr(i, t) {
  const e = i.touches, s = e && e.length ? e[0] : i, { offsetX: n, offsetY: o } = s;
  let r = !1, a, l;
  if (Or(n, o, i.target))
    a = n, l = o;
  else {
    const c = t.getBoundingClientRect();
    a = s.clientX - c.left, l = s.clientY - c.top, r = !0;
  }
  return {
    x: a,
    y: l,
    box: r
  };
}
function Dt(i, t) {
  if ("native" in i)
    return i;
  const { canvas: e, currentDevicePixelRatio: s } = t, n = Ve(e), o = n.boxSizing === "border-box", r = At(n, "padding"), a = At(n, "border", "width"), { x: l, y: c, box: h } = Pr(i, e), d = r.left + (h && a.left), u = r.top + (h && a.top);
  let { width: f, height: m } = t;
  return o && (f -= r.width + a.width, m -= r.height + a.height), {
    x: Math.round((l - d) / f * e.width / s),
    y: Math.round((c - u) / m * e.height / s)
  };
}
function Tr(i, t, e) {
  let s, n;
  if (t === void 0 || e === void 0) {
    const o = i && Ti(i);
    if (!o)
      t = i.clientWidth, e = i.clientHeight;
    else {
      const r = o.getBoundingClientRect(), a = Ve(o), l = At(a, "border", "width"), c = At(a, "padding");
      t = r.width - c.width - l.width, e = r.height - c.height - l.height, s = Be(a.maxWidth, o, "clientWidth"), n = Be(a.maxHeight, o, "clientHeight");
    }
  }
  return {
    width: t,
    height: e,
    maxWidth: s || He,
    maxHeight: n || He
  };
}
const ve = (i) => Math.round(i * 10) / 10;
function Ar(i, t, e, s) {
  const n = Ve(i), o = At(n, "margin"), r = Be(n.maxWidth, i, "clientWidth") || He, a = Be(n.maxHeight, i, "clientHeight") || He, l = Tr(i, t, e);
  let { width: c, height: h } = l;
  if (n.boxSizing === "content-box") {
    const u = At(n, "border", "width"), f = At(n, "padding");
    c -= f.width + u.width, h -= f.height + u.height;
  }
  return c = Math.max(0, c - o.width), h = Math.max(0, s ? c / s : h - o.height), c = ve(Math.min(c, r, l.maxWidth)), h = ve(Math.min(h, a, l.maxHeight)), c && !h && (h = ve(c / 2)), (t !== void 0 || e !== void 0) && s && l.height && h > l.height && (h = l.height, c = ve(Math.floor(h * s))), {
    width: c,
    height: h
  };
}
function Qi(i, t, e) {
  const s = t || 1, n = Math.floor(i.height * s), o = Math.floor(i.width * s);
  i.height = Math.floor(i.height), i.width = Math.floor(i.width);
  const r = i.canvas;
  return r.style && (e || !r.style.height && !r.style.width) && (r.style.height = `${i.height}px`, r.style.width = `${i.width}px`), i.currentDevicePixelRatio !== s || r.height !== n || r.width !== o ? (i.currentDevicePixelRatio = s, r.height = n, r.width = o, i.ctx.setTransform(s, 0, 0, s, 0, 0), !0) : !1;
}
const Lr = function() {
  let i = !1;
  try {
    const t = {
      get passive() {
        return i = !0, !1;
      }
    };
    Pi() && (window.addEventListener("test", null, t), window.removeEventListener("test", null, t));
  } catch {
  }
  return i;
}();
function Zi(i, t) {
  const e = Cr(i, t), s = e && e.match(/^(\d+)(\.\d+)?px$/);
  return s ? +s[1] : void 0;
}
function Ot(i, t, e, s) {
  return {
    x: i.x + e * (t.x - i.x),
    y: i.y + e * (t.y - i.y)
  };
}
function Ir(i, t, e, s) {
  return {
    x: i.x + e * (t.x - i.x),
    y: s === "middle" ? e < 0.5 ? i.y : t.y : s === "after" ? e < 1 ? i.y : t.y : e > 0 ? t.y : i.y
  };
}
function Fr(i, t, e, s) {
  const n = {
    x: i.cp2x,
    y: i.cp2y
  }, o = {
    x: t.cp1x,
    y: t.cp1y
  }, r = Ot(i, n, e), a = Ot(n, o, e), l = Ot(o, t, e), c = Ot(r, a, e), h = Ot(a, l, e);
  return Ot(c, h, e);
}
const Rr = function(i, t) {
  return {
    x(e) {
      return i + i + t - e;
    },
    setWidth(e) {
      t = e;
    },
    textAlign(e) {
      return e === "center" ? e : e === "right" ? "left" : "right";
    },
    xPlus(e, s) {
      return e - s;
    },
    leftForLtr(e, s) {
      return e - s;
    }
  };
}, zr = function() {
  return {
    x(i) {
      return i;
    },
    setWidth(i) {
    },
    textAlign(i) {
      return i;
    },
    xPlus(i, t) {
      return i + t;
    },
    leftForLtr(i, t) {
      return i;
    }
  };
};
function Ht(i, t, e) {
  return i ? Rr(t, e) : zr();
}
function un(i, t) {
  let e, s;
  (t === "ltr" || t === "rtl") && (e = i.canvas.style, s = [
    e.getPropertyValue("direction"),
    e.getPropertyPriority("direction")
  ], e.setProperty("direction", t, "important"), i.prevTextDirection = s);
}
function fn(i, t) {
  t !== void 0 && (delete i.prevTextDirection, i.canvas.style.setProperty("direction", t[0], t[1]));
}
function gn(i) {
  return i === "angle" ? {
    between: Zs,
    compare: Io,
    normalize: mt
  } : {
    between: Qt,
    compare: (t, e) => t - e,
    normalize: (t) => t
  };
}
function Ji({ start: i, end: t, count: e, loop: s, style: n }) {
  return {
    start: i % e,
    end: t % e,
    loop: s && (t - i + 1) % e === 0,
    style: n
  };
}
function Er(i, t, e) {
  const { property: s, start: n, end: o } = e, { between: r, normalize: a } = gn(s), l = t.length;
  let { start: c, end: h, loop: d } = i, u, f;
  if (d) {
    for (c += l, h += l, u = 0, f = l; u < f && r(a(t[c % l][s]), n, o); ++u)
      c--, h--;
    c %= l, h %= l;
  }
  return h < c && (h += l), {
    start: c,
    end: h,
    loop: d,
    style: i.style
  };
}
function Hr(i, t, e) {
  if (!e)
    return [
      i
    ];
  const { property: s, start: n, end: o } = e, r = t.length, { compare: a, between: l, normalize: c } = gn(s), { start: h, end: d, loop: u, style: f } = Er(i, t, e), m = [];
  let g = !1, p = null, b, y, M;
  const S = () => l(n, M, b) && a(n, M) !== 0, w = () => a(o, b) === 0 || l(o, M, b), D = () => g || S(), O = () => !g || w();
  for (let C = h, x = h; C <= d; ++C)
    y = t[C % r], !y.skip && (b = c(y[s]), b !== M && (g = l(b, n, o), p === null && D() && (p = a(b, n) === 0 ? C : x), p !== null && O() && (m.push(Ji({
      start: p,
      end: C,
      loop: u,
      count: r,
      style: f
    })), p = null), x = C, M = b));
  return p !== null && m.push(Ji({
    start: p,
    end: d,
    loop: u,
    count: r,
    style: f
  })), m;
}
function Br(i, t) {
  const e = [], s = i.segments;
  for (let n = 0; n < s.length; n++) {
    const o = Hr(s[n], i.points, t);
    o.length && e.push(...o);
  }
  return e;
}
function Nr(i, t, e, s) {
  let n = 0, o = t - 1;
  if (e && !s)
    for (; n < t && !i[n].skip; )
      n++;
  for (; n < t && i[n].skip; )
    n++;
  for (n %= t, e && (o += n); o > n && i[o % t].skip; )
    o--;
  return o %= t, {
    start: n,
    end: o
  };
}
function Wr(i, t, e, s) {
  const n = i.length, o = [];
  let r = t, a = i[t], l;
  for (l = t + 1; l <= e; ++l) {
    const c = i[l % n];
    c.skip || c.stop ? a.skip || (s = !1, o.push({
      start: t % n,
      end: (l - 1) % n,
      loop: s
    }), t = r = c.stop ? l : null) : (r = l, a.skip && (t = l)), a = c;
  }
  return r !== null && o.push({
    start: t % n,
    end: r % n,
    loop: s
  }), o;
}
function Vr(i, t) {
  const e = i.points, s = i.options.spanGaps, n = e.length;
  if (!n)
    return [];
  const o = !!i._loop, { start: r, end: a } = Nr(e, n, o, s);
  if (s === !0)
    return ts(i, [
      {
        start: r,
        end: a,
        loop: o
      }
    ], e, t);
  const l = a < r ? a + n : a, c = !!i._fullLoop && r === 0 && a === n - 1;
  return ts(i, Wr(e, r, l, c), e, t);
}
function ts(i, t, e, s) {
  return !s || !s.setContext || !e ? t : jr(i, t, e, s);
}
function jr(i, t, e, s) {
  const n = i._chart.getContext(), o = es(i.options), { _datasetIndex: r, options: { spanGaps: a } } = i, l = e.length, c = [];
  let h = o, d = t[0].start, u = d;
  function f(m, g, p, b) {
    const y = a ? -1 : 1;
    if (m !== g) {
      for (m += l; e[m % l].skip; )
        m -= y;
      for (; e[g % l].skip; )
        g += y;
      m % l !== g % l && (c.push({
        start: m % l,
        end: g % l,
        loop: p,
        style: b
      }), h = b, d = g % l);
    }
  }
  for (const m of t) {
    d = a ? d : m.start;
    let g = e[d % l], p;
    for (u = d + 1; u <= m.end; u++) {
      const b = e[u % l];
      p = es(s.setContext(It(n, {
        type: "segment",
        p0: g,
        p1: b,
        p0DataIndex: (u - 1) % l,
        p1DataIndex: u % l,
        datasetIndex: r
      }))), $r(p, h) && f(d, u - 1, m.loop, h), g = b, h = p;
    }
    d < u - 1 && f(d, u - 1, m.loop, h);
  }
  return c;
}
function es(i) {
  return {
    backgroundColor: i.backgroundColor,
    borderCapStyle: i.borderCapStyle,
    borderDash: i.borderDash,
    borderDashOffset: i.borderDashOffset,
    borderJoinStyle: i.borderJoinStyle,
    borderWidth: i.borderWidth,
    borderColor: i.borderColor
  };
}
function $r(i, t) {
  if (!t)
    return !1;
  const e = [], s = function(n, o) {
    return ki(o) ? (e.includes(o) || e.push(o), e.indexOf(o)) : o;
  };
  return JSON.stringify(i, s) !== JSON.stringify(t, s);
}
function we(i, t, e) {
  return i.options.clip ? i[e] : t[e];
}
function Ur(i, t) {
  const { xScale: e, yScale: s } = i;
  return e && s ? {
    left: we(e, t, "left"),
    right: we(e, t, "right"),
    top: we(s, t, "top"),
    bottom: we(s, t, "bottom")
  } : t;
}
function Yr(i, t) {
  const e = t._clip;
  if (e.disabled)
    return !1;
  const s = Ur(t, i.chartArea);
  return {
    left: e.left === !1 ? 0 : s.left - (e.left === !0 ? 0 : e.left),
    right: e.right === !1 ? i.width : s.right + (e.right === !0 ? 0 : e.right),
    top: e.top === !1 ? 0 : s.top - (e.top === !0 ? 0 : e.top),
    bottom: e.bottom === !1 ? i.height : s.bottom + (e.bottom === !0 ? 0 : e.bottom)
  };
}
/*!
 * Chart.js v4.5.0
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
class Gr {
  constructor() {
    this._request = null, this._charts = /* @__PURE__ */ new Map(), this._running = !1, this._lastDate = void 0;
  }
  _notify(t, e, s, n) {
    const o = e.listeners[n], r = e.duration;
    o.forEach((a) => a({
      chart: t,
      initial: e.initial,
      numSteps: r,
      currentStep: Math.min(s - e.start, r)
    }));
  }
  _refresh() {
    this._request || (this._running = !0, this._request = tn.call(window, () => {
      this._update(), this._request = null, this._running && this._refresh();
    }));
  }
  _update(t = Date.now()) {
    let e = 0;
    this._charts.forEach((s, n) => {
      if (!s.running || !s.items.length)
        return;
      const o = s.items;
      let r = o.length - 1, a = !1, l;
      for (; r >= 0; --r)
        l = o[r], l._active ? (l._total > s.duration && (s.duration = l._total), l.tick(t), a = !0) : (o[r] = o[o.length - 1], o.pop());
      a && (n.draw(), this._notify(n, s, t, "progress")), o.length || (s.running = !1, this._notify(n, s, t, "complete"), s.initial = !1), e += o.length;
    }), this._lastDate = t, e === 0 && (this._running = !1);
  }
  _getAnims(t) {
    const e = this._charts;
    let s = e.get(t);
    return s || (s = {
      running: !1,
      initial: !0,
      items: [],
      listeners: {
        complete: [],
        progress: []
      }
    }, e.set(t, s)), s;
  }
  listen(t, e, s) {
    this._getAnims(t).listeners[e].push(s);
  }
  add(t, e) {
    !e || !e.length || this._getAnims(t).items.push(...e);
  }
  has(t) {
    return this._getAnims(t).items.length > 0;
  }
  start(t) {
    const e = this._charts.get(t);
    e && (e.running = !0, e.start = Date.now(), e.duration = e.items.reduce((s, n) => Math.max(s, n._duration), 0), this._refresh());
  }
  running(t) {
    if (!this._running)
      return !1;
    const e = this._charts.get(t);
    return !(!e || !e.running || !e.items.length);
  }
  stop(t) {
    const e = this._charts.get(t);
    if (!e || !e.items.length)
      return;
    const s = e.items;
    let n = s.length - 1;
    for (; n >= 0; --n)
      s[n].cancel();
    e.items = [], this._notify(t, e, Date.now(), "complete");
  }
  remove(t) {
    return this._charts.delete(t);
  }
}
var dt = /* @__PURE__ */ new Gr();
const is = "transparent", qr = {
  boolean(i, t, e) {
    return e > 0.5 ? t : i;
  },
  color(i, t, e) {
    const s = Ui(i || is), n = s.valid && Ui(t || is);
    return n && n.valid ? n.mix(s, e).hexString() : t;
  },
  number(i, t, e) {
    return i + (t - i) * e;
  }
};
class Xr {
  constructor(t, e, s, n) {
    const o = e[s];
    n = xe([
      t.to,
      n,
      o,
      t.from
    ]);
    const r = xe([
      t.from,
      o,
      n
    ]);
    this._active = !0, this._fn = t.fn || qr[t.type || typeof r], this._easing = se[t.easing] || se.linear, this._start = Math.floor(Date.now() + (t.delay || 0)), this._duration = this._total = Math.floor(t.duration), this._loop = !!t.loop, this._target = e, this._prop = s, this._from = r, this._to = n, this._promises = void 0;
  }
  active() {
    return this._active;
  }
  update(t, e, s) {
    if (this._active) {
      this._notify(!1);
      const n = this._target[this._prop], o = s - this._start, r = this._duration - o;
      this._start = s, this._duration = Math.floor(Math.max(r, t.duration)), this._total += o, this._loop = !!t.loop, this._to = xe([
        t.to,
        e,
        n,
        t.from
      ]), this._from = xe([
        t.from,
        n,
        e
      ]);
    }
  }
  cancel() {
    this._active && (this.tick(Date.now()), this._active = !1, this._notify(!1));
  }
  tick(t) {
    const e = t - this._start, s = this._duration, n = this._prop, o = this._from, r = this._loop, a = this._to;
    let l;
    if (this._active = o !== a && (r || e < s), !this._active) {
      this._target[n] = a, this._notify(!0);
      return;
    }
    if (e < 0) {
      this._target[n] = o;
      return;
    }
    l = e / s % 2, l = r && l > 1 ? 2 - l : l, l = this._easing(Math.min(1, Math.max(0, l))), this._target[n] = this._fn(o, a, l);
  }
  wait() {
    const t = this._promises || (this._promises = []);
    return new Promise((e, s) => {
      t.push({
        res: e,
        rej: s
      });
    });
  }
  _notify(t) {
    const e = t ? "res" : "rej", s = this._promises || [];
    for (let n = 0; n < s.length; n++)
      s[n][e]();
  }
}
class pn {
  constructor(t, e) {
    this._chart = t, this._properties = /* @__PURE__ */ new Map(), this.configure(e);
  }
  configure(t) {
    if (!F(t))
      return;
    const e = Object.keys(W.animation), s = this._properties;
    Object.getOwnPropertyNames(t).forEach((n) => {
      const o = t[n];
      if (!F(o))
        return;
      const r = {};
      for (const a of e)
        r[a] = o[a];
      (V(o.properties) && o.properties || [
        n
      ]).forEach((a) => {
        (a === n || !s.has(a)) && s.set(a, r);
      });
    });
  }
  _animateOptions(t, e) {
    const s = e.options, n = Qr(t, s);
    if (!n)
      return [];
    const o = this._createAnimations(n, s);
    return s.$shared && Kr(t.options.$animations, s).then(() => {
      t.options = s;
    }, () => {
    }), o;
  }
  _createAnimations(t, e) {
    const s = this._properties, n = [], o = t.$animations || (t.$animations = {}), r = Object.keys(e), a = Date.now();
    let l;
    for (l = r.length - 1; l >= 0; --l) {
      const c = r[l];
      if (c.charAt(0) === "$")
        continue;
      if (c === "options") {
        n.push(...this._animateOptions(t, e));
        continue;
      }
      const h = e[c];
      let d = o[c];
      const u = s.get(c);
      if (d)
        if (u && d.active()) {
          d.update(u, h, a);
          continue;
        } else
          d.cancel();
      if (!u || !u.duration) {
        t[c] = h;
        continue;
      }
      o[c] = d = new Xr(u, t, c, h), n.push(d);
    }
    return n;
  }
  update(t, e) {
    if (this._properties.size === 0) {
      Object.assign(t, e);
      return;
    }
    const s = this._createAnimations(t, e);
    if (s.length)
      return dt.add(this._chart, s), !0;
  }
}
function Kr(i, t) {
  const e = [], s = Object.keys(t);
  for (let n = 0; n < s.length; n++) {
    const o = i[s[n]];
    o && o.active() && e.push(o.wait());
  }
  return Promise.all(e);
}
function Qr(i, t) {
  if (!t)
    return;
  let e = i.options;
  if (!e) {
    i.options = t;
    return;
  }
  return e.$shared && (i.options = e = Object.assign({}, e, {
    $shared: !1,
    $animations: {}
  })), e;
}
function ss(i, t) {
  const e = i && i.options || {}, s = e.reverse, n = e.min === void 0 ? t : 0, o = e.max === void 0 ? t : 0;
  return {
    start: s ? o : n,
    end: s ? n : o
  };
}
function Zr(i, t, e) {
  if (e === !1)
    return !1;
  const s = ss(i, e), n = ss(t, e);
  return {
    top: n.end,
    right: s.end,
    bottom: n.start,
    left: s.start
  };
}
function Jr(i) {
  let t, e, s, n;
  return F(i) ? (t = i.top, e = i.right, s = i.bottom, n = i.left) : t = e = s = n = i, {
    top: t,
    right: e,
    bottom: s,
    left: n,
    disabled: i === !1
  };
}
function mn(i, t) {
  const e = [], s = i._getSortedDatasetMetas(t);
  let n, o;
  for (n = 0, o = s.length; n < o; ++n)
    e.push(s[n].index);
  return e;
}
function ns(i, t, e, s = {}) {
  const n = i.keys, o = s.mode === "single";
  let r, a, l, c;
  if (t === null)
    return;
  let h = !1;
  for (r = 0, a = n.length; r < a; ++r) {
    if (l = +n[r], l === e) {
      if (h = !0, s.all)
        continue;
      break;
    }
    c = i.values[l], tt(c) && (o || t === 0 || Bt(t) === Bt(c)) && (t += c);
  }
  return !h && !s.all ? 0 : t;
}
function ta(i, t) {
  const { iScale: e, vScale: s } = t, n = e.axis === "x" ? "x" : "y", o = s.axis === "x" ? "x" : "y", r = Object.keys(i), a = new Array(r.length);
  let l, c, h;
  for (l = 0, c = r.length; l < c; ++l)
    h = r[l], a[l] = {
      [n]: h,
      [o]: i[h]
    };
  return a;
}
function Ke(i, t) {
  const e = i && i.options.stacked;
  return e || e === void 0 && t.stack !== void 0;
}
function ea(i, t, e) {
  return `${i.id}.${t.id}.${e.stack || e.type}`;
}
function ia(i) {
  const { min: t, max: e, minDefined: s, maxDefined: n } = i.getUserBounds();
  return {
    min: s ? t : Number.NEGATIVE_INFINITY,
    max: n ? e : Number.POSITIVE_INFINITY
  };
}
function sa(i, t, e) {
  const s = i[t] || (i[t] = {});
  return s[e] || (s[e] = {});
}
function os(i, t, e, s) {
  for (const n of t.getMatchingVisibleMetas(s).reverse()) {
    const o = i[n.index];
    if (e && o > 0 || !e && o < 0)
      return n.index;
  }
  return null;
}
function rs(i, t) {
  const { chart: e, _cachedMeta: s } = i, n = e._stacks || (e._stacks = {}), { iScale: o, vScale: r, index: a } = s, l = o.axis, c = r.axis, h = ea(o, r, s), d = t.length;
  let u;
  for (let f = 0; f < d; ++f) {
    const m = t[f], { [l]: g, [c]: p } = m, b = m._stacks || (m._stacks = {});
    u = b[c] = sa(n, h, g), u[a] = p, u._top = os(u, r, !0, s.type), u._bottom = os(u, r, !1, s.type);
    const y = u._visualValues || (u._visualValues = {});
    y[a] = p;
  }
}
function Qe(i, t) {
  const e = i.scales;
  return Object.keys(e).filter((s) => e[s].axis === t).shift();
}
function na(i, t) {
  return It(i, {
    active: !1,
    dataset: void 0,
    datasetIndex: t,
    index: t,
    mode: "default",
    type: "dataset"
  });
}
function oa(i, t, e) {
  return It(i, {
    active: !1,
    dataIndex: t,
    parsed: void 0,
    raw: void 0,
    element: e,
    index: t,
    mode: "default",
    type: "data"
  });
}
function Ut(i, t) {
  const e = i.controller.index, s = i.vScale && i.vScale.axis;
  if (s) {
    t = t || i._parsed;
    for (const n of t) {
      const o = n._stacks;
      if (!o || o[s] === void 0 || o[s][e] === void 0)
        return;
      delete o[s][e], o[s]._visualValues !== void 0 && o[s]._visualValues[e] !== void 0 && delete o[s]._visualValues[e];
    }
  }
}
const Ze = (i) => i === "reset" || i === "none", as = (i, t) => t ? i : Object.assign({}, i), ra = (i, t, e) => i && !t.hidden && t._stacked && {
  keys: mn(e, !0),
  values: null
};
class re {
  constructor(t, e) {
    this.chart = t, this._ctx = t.ctx, this.index = e, this._cachedDataOpts = {}, this._cachedMeta = this.getMeta(), this._type = this._cachedMeta.type, this.options = void 0, this._parsing = !1, this._data = void 0, this._objectData = void 0, this._sharedOptions = void 0, this._drawStart = void 0, this._drawCount = void 0, this.enableOptionSharing = !1, this.supportsDecimation = !1, this.$context = void 0, this._syncList = [], this.datasetElementType = new.target.datasetElementType, this.dataElementType = new.target.dataElementType, this.initialize();
  }
  initialize() {
    const t = this._cachedMeta;
    this.configure(), this.linkScales(), t._stacked = Ke(t.vScale, t), this.addElements(), this.options.fill && !this.chart.isPluginEnabled("filler") && console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
  }
  updateIndex(t) {
    this.index !== t && Ut(this._cachedMeta), this.index = t;
  }
  linkScales() {
    const t = this.chart, e = this._cachedMeta, s = this.getDataset(), n = (d, u, f, m) => d === "x" ? u : d === "r" ? m : f, o = e.xAxisID = I(s.xAxisID, Qe(t, "x")), r = e.yAxisID = I(s.yAxisID, Qe(t, "y")), a = e.rAxisID = I(s.rAxisID, Qe(t, "r")), l = e.indexAxis, c = e.iAxisID = n(l, o, r, a), h = e.vAxisID = n(l, r, o, a);
    e.xScale = this.getScaleForId(o), e.yScale = this.getScaleForId(r), e.rScale = this.getScaleForId(a), e.iScale = this.getScaleForId(c), e.vScale = this.getScaleForId(h);
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(t) {
    return this.chart.scales[t];
  }
  _getOtherScale(t) {
    const e = this._cachedMeta;
    return t === e.iScale ? e.vScale : e.iScale;
  }
  reset() {
    this._update("reset");
  }
  _destroy() {
    const t = this._cachedMeta;
    this._data && Vi(this._data, this), t._stacked && Ut(t);
  }
  _dataCheck() {
    const t = this.getDataset(), e = t.data || (t.data = []), s = this._data;
    if (F(e)) {
      const n = this._cachedMeta;
      this._data = ta(e, n);
    } else if (s !== e) {
      if (s) {
        Vi(s, this);
        const n = this._cachedMeta;
        Ut(n), n._parsed = [];
      }
      e && Object.isExtensible(e) && Eo(e, this), this._syncList = [], this._data = e;
    }
  }
  addElements() {
    const t = this._cachedMeta;
    this._dataCheck(), this.datasetElementType && (t.dataset = new this.datasetElementType());
  }
  buildOrUpdateElements(t) {
    const e = this._cachedMeta, s = this.getDataset();
    let n = !1;
    this._dataCheck();
    const o = e._stacked;
    e._stacked = Ke(e.vScale, e), e.stack !== s.stack && (n = !0, Ut(e), e.stack = s.stack), this._resyncElements(t), (n || o !== e._stacked) && (rs(this, e._parsed), e._stacked = Ke(e.vScale, e));
  }
  configure() {
    const t = this.chart.config, e = t.datasetScopeKeys(this._type), s = t.getOptionScopes(this.getDataset(), e, !0);
    this.options = t.createResolver(s, this.getContext()), this._parsing = this.options.parsing, this._cachedDataOpts = {};
  }
  parse(t, e) {
    const { _cachedMeta: s, _data: n } = this, { iScale: o, _stacked: r } = s, a = o.axis;
    let l = t === 0 && e === n.length ? !0 : s._sorted, c = t > 0 && s._parsed[t - 1], h, d, u;
    if (this._parsing === !1)
      s._parsed = n, s._sorted = !0, u = n;
    else {
      V(n[t]) ? u = this.parseArrayData(s, n, t, e) : F(n[t]) ? u = this.parseObjectData(s, n, t, e) : u = this.parsePrimitiveData(s, n, t, e);
      const f = () => d[a] === null || c && d[a] < c[a];
      for (h = 0; h < e; ++h)
        s._parsed[h + t] = d = u[h], l && (f() && (l = !1), c = d);
      s._sorted = l;
    }
    r && rs(this, u);
  }
  parsePrimitiveData(t, e, s, n) {
    const { iScale: o, vScale: r } = t, a = o.axis, l = r.axis, c = o.getLabels(), h = o === r, d = new Array(n);
    let u, f, m;
    for (u = 0, f = n; u < f; ++u)
      m = u + s, d[u] = {
        [a]: h || o.parse(c[m], m),
        [l]: r.parse(e[m], m)
      };
    return d;
  }
  parseArrayData(t, e, s, n) {
    const { xScale: o, yScale: r } = t, a = new Array(n);
    let l, c, h, d;
    for (l = 0, c = n; l < c; ++l)
      h = l + s, d = e[h], a[l] = {
        x: o.parse(d[0], h),
        y: r.parse(d[1], h)
      };
    return a;
  }
  parseObjectData(t, e, s, n) {
    const { xScale: o, yScale: r } = t, { xAxisKey: a = "x", yAxisKey: l = "y" } = this._parsing, c = new Array(n);
    let h, d, u, f;
    for (h = 0, d = n; h < d; ++h)
      u = h + s, f = e[u], c[h] = {
        x: o.parse(ze(f, a), u),
        y: r.parse(ze(f, l), u)
      };
    return c;
  }
  getParsed(t) {
    return this._cachedMeta._parsed[t];
  }
  getDataElement(t) {
    return this._cachedMeta.data[t];
  }
  applyStack(t, e, s) {
    const n = this.chart, o = this._cachedMeta, r = e[t.axis], a = {
      keys: mn(n, !0),
      values: e._stacks[t.axis]._visualValues
    };
    return ns(a, r, o.index, {
      mode: s
    });
  }
  updateRangeFromParsed(t, e, s, n) {
    const o = s[e.axis];
    let r = o === null ? NaN : o;
    const a = n && s._stacks[e.axis];
    n && a && (n.values = a, r = ns(n, o, this._cachedMeta.index)), t.min = Math.min(t.min, r), t.max = Math.max(t.max, r);
  }
  getMinMax(t, e) {
    const s = this._cachedMeta, n = s._parsed, o = s._sorted && t === s.iScale, r = n.length, a = this._getOtherScale(t), l = ra(e, s, this.chart), c = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    }, { min: h, max: d } = ia(a);
    let u, f;
    function m() {
      f = n[u];
      const g = f[a.axis];
      return !tt(f[t.axis]) || h > g || d < g;
    }
    for (u = 0; u < r && !(!m() && (this.updateRangeFromParsed(c, t, f, l), o)); ++u)
      ;
    if (o) {
      for (u = r - 1; u >= 0; --u)
        if (!m()) {
          this.updateRangeFromParsed(c, t, f, l);
          break;
        }
    }
    return c;
  }
  getAllParsedValues(t) {
    const e = this._cachedMeta._parsed, s = [];
    let n, o, r;
    for (n = 0, o = e.length; n < o; ++n)
      r = e[n][t.axis], tt(r) && s.push(r);
    return s;
  }
  getMaxOverflow() {
    return !1;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta, s = e.iScale, n = e.vScale, o = this.getParsed(t);
    return {
      label: s ? "" + s.getLabelForValue(o[s.axis]) : "",
      value: n ? "" + n.getLabelForValue(o[n.axis]) : ""
    };
  }
  _update(t) {
    const e = this._cachedMeta;
    this.update(t || "default"), e._clip = Jr(I(this.options.clip, Zr(e.xScale, e.yScale, this.getMaxOverflow())));
  }
  update(t) {
  }
  draw() {
    const t = this._ctx, e = this.chart, s = this._cachedMeta, n = s.data || [], o = e.chartArea, r = [], a = this._drawStart || 0, l = this._drawCount || n.length - a, c = this.options.drawActiveElementsOnTop;
    let h;
    for (s.dataset && s.dataset.draw(t, o, a, l), h = a; h < a + l; ++h) {
      const d = n[h];
      d.hidden || (d.active && c ? r.push(d) : d.draw(t, o));
    }
    for (h = 0; h < r.length; ++h)
      r[h].draw(t, o);
  }
  getStyle(t, e) {
    const s = e ? "active" : "default";
    return t === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(s) : this.resolveDataElementOptions(t || 0, s);
  }
  getContext(t, e, s) {
    const n = this.getDataset();
    let o;
    if (t >= 0 && t < this._cachedMeta.data.length) {
      const r = this._cachedMeta.data[t];
      o = r.$context || (r.$context = oa(this.getContext(), t, r)), o.parsed = this.getParsed(t), o.raw = n.data[t], o.index = o.dataIndex = t;
    } else
      o = this.$context || (this.$context = na(this.chart.getContext(), this.index)), o.dataset = n, o.index = o.datasetIndex = this.index;
    return o.active = !!e, o.mode = s, o;
  }
  resolveDatasetElementOptions(t) {
    return this._resolveElementOptions(this.datasetElementType.id, t);
  }
  resolveDataElementOptions(t, e) {
    return this._resolveElementOptions(this.dataElementType.id, e, t);
  }
  _resolveElementOptions(t, e = "default", s) {
    const n = e === "active", o = this._cachedDataOpts, r = t + "-" + e, a = o[r], l = this.enableOptionSharing && Ee(s);
    if (a)
      return as(a, l);
    const c = this.chart.config, h = c.datasetElementScopeKeys(this._type, t), d = n ? [
      `${t}Hover`,
      "hover",
      t,
      ""
    ] : [
      t,
      ""
    ], u = c.getOptionScopes(this.getDataset(), h), f = Object.keys(W.elements[t]), m = () => this.getContext(s, n, e), g = c.resolveNamedOptions(u, f, m, d);
    return g.$shared && (g.$shared = l, o[r] = Object.freeze(as(g, l))), g;
  }
  _resolveAnimations(t, e, s) {
    const n = this.chart, o = this._cachedDataOpts, r = `animation-${e}`, a = o[r];
    if (a)
      return a;
    let l;
    if (n.options.animation !== !1) {
      const h = this.chart.config, d = h.datasetAnimationScopeKeys(this._type, e), u = h.getOptionScopes(this.getDataset(), d);
      l = h.createResolver(u, this.getContext(t, s, e));
    }
    const c = new pn(n, l && l.animations);
    return l && l._cacheable && (o[r] = Object.freeze(c)), c;
  }
  getSharedOptions(t) {
    if (t.$shared)
      return this._sharedOptions || (this._sharedOptions = Object.assign({}, t));
  }
  includeOptions(t, e) {
    return !e || Ze(t) || this.chart._animationsDisabled;
  }
  _getSharedOptions(t, e) {
    const s = this.resolveDataElementOptions(t, e), n = this._sharedOptions, o = this.getSharedOptions(s), r = this.includeOptions(e, o) || o !== n;
    return this.updateSharedOptions(o, e, s), {
      sharedOptions: o,
      includeOptions: r
    };
  }
  updateElement(t, e, s, n) {
    Ze(n) ? Object.assign(t, s) : this._resolveAnimations(e, n).update(t, s);
  }
  updateSharedOptions(t, e, s) {
    t && !Ze(e) && this._resolveAnimations(void 0, e).update(t, s);
  }
  _setStyle(t, e, s, n) {
    t.active = n;
    const o = this.getStyle(e, n);
    this._resolveAnimations(e, s, n).update(t, {
      options: !n && this.getSharedOptions(o) || o
    });
  }
  removeHoverStyle(t, e, s) {
    this._setStyle(t, s, "active", !1);
  }
  setHoverStyle(t, e, s) {
    this._setStyle(t, s, "active", !0);
  }
  _removeDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !1);
  }
  _setDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !0);
  }
  _resyncElements(t) {
    const e = this._data, s = this._cachedMeta.data;
    for (const [a, l, c] of this._syncList)
      this[a](l, c);
    this._syncList = [];
    const n = s.length, o = e.length, r = Math.min(o, n);
    r && this.parse(0, r), o > n ? this._insertElements(n, o - n, t) : o < n && this._removeElements(o, n - o);
  }
  _insertElements(t, e, s = !0) {
    const n = this._cachedMeta, o = n.data, r = t + e;
    let a;
    const l = (c) => {
      for (c.length += e, a = c.length - 1; a >= r; a--)
        c[a] = c[a - e];
    };
    for (l(o), a = t; a < r; ++a)
      o[a] = new this.dataElementType();
    this._parsing && l(n._parsed), this.parse(t, e), s && this.updateElements(o, t, e, "reset");
  }
  updateElements(t, e, s, n) {
  }
  _removeElements(t, e) {
    const s = this._cachedMeta;
    if (this._parsing) {
      const n = s._parsed.splice(t, e);
      s._stacked && Ut(s, n);
    }
    s.data.splice(t, e);
  }
  _sync(t) {
    if (this._parsing)
      this._syncList.push(t);
    else {
      const [e, s, n] = t;
      this[e](s, n);
    }
    this.chart._dataChanges.push([
      this.index,
      ...t
    ]);
  }
  _onDataPush() {
    const t = arguments.length;
    this._sync([
      "_insertElements",
      this.getDataset().data.length - t,
      t
    ]);
  }
  _onDataPop() {
    this._sync([
      "_removeElements",
      this._cachedMeta.data.length - 1,
      1
    ]);
  }
  _onDataShift() {
    this._sync([
      "_removeElements",
      0,
      1
    ]);
  }
  _onDataSplice(t, e) {
    e && this._sync([
      "_removeElements",
      t,
      e
    ]);
    const s = arguments.length - 2;
    s && this._sync([
      "_insertElements",
      t,
      s
    ]);
  }
  _onDataUnshift() {
    this._sync([
      "_insertElements",
      0,
      arguments.length
    ]);
  }
}
T(re, "defaults", {}), T(re, "datasetElementType", null), T(re, "dataElementType", null);
class Te extends re {
  initialize() {
    this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize();
  }
  update(t) {
    const e = this._cachedMeta, { dataset: s, data: n = [], _dataset: o } = e, r = this.chart._animationsDisabled;
    let { start: a, count: l } = Wo(e, n, r);
    this._drawStart = a, this._drawCount = l, Vo(e) && (a = 0, l = n.length), s._chart = this.chart, s._datasetIndex = this.index, s._decimated = !!o._decimated, s.points = n;
    const c = this.resolveDatasetElementOptions(t);
    this.options.showLine || (c.borderWidth = 0), c.segment = this.options.segment, this.updateElement(s, void 0, {
      animated: !r,
      options: c
    }, t), this.updateElements(n, a, l, t);
  }
  updateElements(t, e, s, n) {
    const o = n === "reset", { iScale: r, vScale: a, _stacked: l, _dataset: c } = this._cachedMeta, { sharedOptions: h, includeOptions: d } = this._getSharedOptions(e, n), u = r.axis, f = a.axis, { spanGaps: m, segment: g } = this.options, p = ce(m) ? m : Number.POSITIVE_INFINITY, b = this.chart._animationsDisabled || o || n === "none", y = e + s, M = t.length;
    let S = e > 0 && this.getParsed(e - 1);
    for (let w = 0; w < M; ++w) {
      const D = t[w], O = b ? D : {};
      if (w < e || w >= y) {
        O.skip = !0;
        continue;
      }
      const C = this.getParsed(w), x = E(C[f]), _ = O[u] = r.getPixelForValue(C[u], w), P = O[f] = o || x ? a.getBasePixel() : a.getPixelForValue(l ? this.applyStack(a, C, l) : C[f], w);
      O.skip = isNaN(_) || isNaN(P) || x, O.stop = w > 0 && Math.abs(C[u] - S[u]) > p, g && (O.parsed = C, O.raw = c.data[w]), d && (O.options = h || this.resolveDataElementOptions(w, D.active ? "active" : n)), b || this.updateElement(D, w, O, n), S = C;
    }
  }
  getMaxOverflow() {
    const t = this._cachedMeta, e = t.dataset, s = e.options && e.options.borderWidth || 0, n = t.data || [];
    if (!n.length)
      return s;
    const o = n[0].size(this.resolveDataElementOptions(0)), r = n[n.length - 1].size(this.resolveDataElementOptions(n.length - 1));
    return Math.max(s, o, r) / 2;
  }
  draw() {
    const t = this._cachedMeta;
    t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis), super.draw();
  }
}
T(Te, "id", "line"), T(Te, "defaults", {
  datasetElementType: "line",
  dataElementType: "point",
  showLine: !0,
  spanGaps: !1
}), T(Te, "overrides", {
  scales: {
    _index_: {
      type: "category"
    },
    _value_: {
      type: "linear"
    }
  }
});
function Ct() {
  throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
}
class Ai {
  constructor(t) {
    T(this, "options");
    this.options = t || {};
  }
  /**
  * Override default date adapter methods.
  * Accepts type parameter to define options type.
  * @example
  * Chart._adapters._date.override<{myAdapterOption: string}>({
  *   init() {
  *     console.log(this.options.myAdapterOption);
  *   }
  * })
  */
  static override(t) {
    Object.assign(Ai.prototype, t);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {
  }
  formats() {
    return Ct();
  }
  parse() {
    return Ct();
  }
  format() {
    return Ct();
  }
  add() {
    return Ct();
  }
  diff() {
    return Ct();
  }
  startOf() {
    return Ct();
  }
  endOf() {
    return Ct();
  }
}
var aa = {
  _date: Ai
};
function la(i, t, e, s) {
  const { controller: n, data: o, _sorted: r } = i, a = n._cachedMeta.iScale, l = i.dataset && i.dataset.options ? i.dataset.options.spanGaps : null;
  if (a && t === a.axis && t !== "r" && r && o.length) {
    const c = a._reversePixels ? Ro : Tt;
    if (s) {
      if (n._sharedOptions) {
        const h = o[0], d = typeof h.getRange == "function" && h.getRange(t);
        if (d) {
          const u = c(o, t, e - d), f = c(o, t, e + d);
          return {
            lo: u.lo,
            hi: f.hi
          };
        }
      }
    } else {
      const h = c(o, t, e);
      if (l) {
        const { vScale: d } = n._cachedMeta, { _parsed: u } = i, f = u.slice(0, h.lo + 1).reverse().findIndex((g) => !E(g[d.axis]));
        h.lo -= Math.max(0, f);
        const m = u.slice(h.hi).findIndex((g) => !E(g[d.axis]));
        h.hi += Math.max(0, m);
      }
      return h;
    }
  }
  return {
    lo: 0,
    hi: o.length - 1
  };
}
function je(i, t, e, s, n) {
  const o = i.getSortedVisibleDatasetMetas(), r = e[t];
  for (let a = 0, l = o.length; a < l; ++a) {
    const { index: c, data: h } = o[a], { lo: d, hi: u } = la(o[a], t, r, n);
    for (let f = d; f <= u; ++f) {
      const m = h[f];
      m.skip || s(m, c, f);
    }
  }
}
function ca(i) {
  const t = i.indexOf("x") !== -1, e = i.indexOf("y") !== -1;
  return function(s, n) {
    const o = t ? Math.abs(s.x - n.x) : 0, r = e ? Math.abs(s.y - n.y) : 0;
    return Math.sqrt(Math.pow(o, 2) + Math.pow(r, 2));
  };
}
function Je(i, t, e, s, n) {
  const o = [];
  return !n && !i.isPointInArea(t) || je(i, e, t, function(a, l, c) {
    !n && !he(a, i.chartArea, 0) || a.inRange(t.x, t.y, s) && o.push({
      element: a,
      datasetIndex: l,
      index: c
    });
  }, !0), o;
}
function ha(i, t, e, s) {
  let n = [];
  function o(r, a, l) {
    const { startAngle: c, endAngle: h } = r.getProps([
      "startAngle",
      "endAngle"
    ], s), { angle: d } = Lo(r, {
      x: t.x,
      y: t.y
    });
    Zs(d, c, h) && n.push({
      element: r,
      datasetIndex: a,
      index: l
    });
  }
  return je(i, e, t, o), n;
}
function da(i, t, e, s, n, o) {
  let r = [];
  const a = ca(e);
  let l = Number.POSITIVE_INFINITY;
  function c(h, d, u) {
    const f = h.inRange(t.x, t.y, n);
    if (s && !f)
      return;
    const m = h.getCenterPoint(n);
    if (!(!!o || i.isPointInArea(m)) && !f)
      return;
    const p = a(t, m);
    p < l ? (r = [
      {
        element: h,
        datasetIndex: d,
        index: u
      }
    ], l = p) : p === l && r.push({
      element: h,
      datasetIndex: d,
      index: u
    });
  }
  return je(i, e, t, c), r;
}
function ti(i, t, e, s, n, o) {
  return !o && !i.isPointInArea(t) ? [] : e === "r" && !s ? ha(i, t, e, n) : da(i, t, e, s, n, o);
}
function ls(i, t, e, s, n) {
  const o = [], r = e === "x" ? "inXRange" : "inYRange";
  let a = !1;
  return je(i, e, t, (l, c, h) => {
    l[r] && l[r](t[e], n) && (o.push({
      element: l,
      datasetIndex: c,
      index: h
    }), a = a || l.inRange(t.x, t.y, n));
  }), s && !a ? [] : o;
}
var ua = {
  modes: {
    index(i, t, e, s) {
      const n = Dt(t, i), o = e.axis || "x", r = e.includeInvisible || !1, a = e.intersect ? Je(i, n, o, s, r) : ti(i, n, o, !1, s, r), l = [];
      return a.length ? (i.getSortedVisibleDatasetMetas().forEach((c) => {
        const h = a[0].index, d = c.data[h];
        d && !d.skip && l.push({
          element: d,
          datasetIndex: c.index,
          index: h
        });
      }), l) : [];
    },
    dataset(i, t, e, s) {
      const n = Dt(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
      let a = e.intersect ? Je(i, n, o, s, r) : ti(i, n, o, !1, s, r);
      if (a.length > 0) {
        const l = a[0].datasetIndex, c = i.getDatasetMeta(l).data;
        a = [];
        for (let h = 0; h < c.length; ++h)
          a.push({
            element: c[h],
            datasetIndex: l,
            index: h
          });
      }
      return a;
    },
    point(i, t, e, s) {
      const n = Dt(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
      return Je(i, n, o, s, r);
    },
    nearest(i, t, e, s) {
      const n = Dt(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
      return ti(i, n, o, e.intersect, s, r);
    },
    x(i, t, e, s) {
      const n = Dt(t, i);
      return ls(i, n, "x", e.intersect, s);
    },
    y(i, t, e, s) {
      const n = Dt(t, i);
      return ls(i, n, "y", e.intersect, s);
    }
  }
};
const bn = [
  "left",
  "top",
  "right",
  "bottom"
];
function Yt(i, t) {
  return i.filter((e) => e.pos === t);
}
function cs(i, t) {
  return i.filter((e) => bn.indexOf(e.pos) === -1 && e.box.axis === t);
}
function Gt(i, t) {
  return i.sort((e, s) => {
    const n = t ? s : e, o = t ? e : s;
    return n.weight === o.weight ? n.index - o.index : n.weight - o.weight;
  });
}
function fa(i) {
  const t = [];
  let e, s, n, o, r, a;
  for (e = 0, s = (i || []).length; e < s; ++e)
    n = i[e], { position: o, options: { stack: r, stackWeight: a = 1 } } = n, t.push({
      index: e,
      box: n,
      pos: o,
      horizontal: n.isHorizontal(),
      weight: n.weight,
      stack: r && o + r,
      stackWeight: a
    });
  return t;
}
function ga(i) {
  const t = {};
  for (const e of i) {
    const { stack: s, pos: n, stackWeight: o } = e;
    if (!s || !bn.includes(n))
      continue;
    const r = t[s] || (t[s] = {
      count: 0,
      placed: 0,
      weight: 0,
      size: 0
    });
    r.count++, r.weight += o;
  }
  return t;
}
function pa(i, t) {
  const e = ga(i), { vBoxMaxWidth: s, hBoxMaxHeight: n } = t;
  let o, r, a;
  for (o = 0, r = i.length; o < r; ++o) {
    a = i[o];
    const { fullSize: l } = a.box, c = e[a.stack], h = c && a.stackWeight / c.weight;
    a.horizontal ? (a.width = h ? h * s : l && t.availableWidth, a.height = n) : (a.width = s, a.height = h ? h * n : l && t.availableHeight);
  }
  return e;
}
function ma(i) {
  const t = fa(i), e = Gt(t.filter((c) => c.box.fullSize), !0), s = Gt(Yt(t, "left"), !0), n = Gt(Yt(t, "right")), o = Gt(Yt(t, "top"), !0), r = Gt(Yt(t, "bottom")), a = cs(t, "x"), l = cs(t, "y");
  return {
    fullSize: e,
    leftAndTop: s.concat(o),
    rightAndBottom: n.concat(l).concat(r).concat(a),
    chartArea: Yt(t, "chartArea"),
    vertical: s.concat(n).concat(l),
    horizontal: o.concat(r).concat(a)
  };
}
function hs(i, t, e, s) {
  return Math.max(i[e], t[e]) + Math.max(i[s], t[s]);
}
function _n(i, t) {
  i.top = Math.max(i.top, t.top), i.left = Math.max(i.left, t.left), i.bottom = Math.max(i.bottom, t.bottom), i.right = Math.max(i.right, t.right);
}
function ba(i, t, e, s) {
  const { pos: n, box: o } = e, r = i.maxPadding;
  if (!F(n)) {
    e.size && (i[n] -= e.size);
    const d = s[e.stack] || {
      size: 0,
      count: 1
    };
    d.size = Math.max(d.size, e.horizontal ? o.height : o.width), e.size = d.size / d.count, i[n] += e.size;
  }
  o.getPadding && _n(r, o.getPadding());
  const a = Math.max(0, t.outerWidth - hs(r, i, "left", "right")), l = Math.max(0, t.outerHeight - hs(r, i, "top", "bottom")), c = a !== i.w, h = l !== i.h;
  return i.w = a, i.h = l, e.horizontal ? {
    same: c,
    other: h
  } : {
    same: h,
    other: c
  };
}
function _a(i) {
  const t = i.maxPadding;
  function e(s) {
    const n = Math.max(t[s] - i[s], 0);
    return i[s] += n, n;
  }
  i.y += e("top"), i.x += e("left"), e("right"), e("bottom");
}
function xa(i, t) {
  const e = t.maxPadding;
  function s(n) {
    const o = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
    return n.forEach((r) => {
      o[r] = Math.max(t[r], e[r]);
    }), o;
  }
  return s(i ? [
    "left",
    "right"
  ] : [
    "top",
    "bottom"
  ]);
}
function Zt(i, t, e, s) {
  const n = [];
  let o, r, a, l, c, h;
  for (o = 0, r = i.length, c = 0; o < r; ++o) {
    a = i[o], l = a.box, l.update(a.width || t.w, a.height || t.h, xa(a.horizontal, t));
    const { same: d, other: u } = ba(t, e, a, s);
    c |= d && n.length, h = h || u, l.fullSize || n.push(a);
  }
  return c && Zt(n, t, e, s) || h;
}
function ke(i, t, e, s, n) {
  i.top = e, i.left = t, i.right = t + s, i.bottom = e + n, i.width = s, i.height = n;
}
function ds(i, t, e, s) {
  const n = e.padding;
  let { x: o, y: r } = t;
  for (const a of i) {
    const l = a.box, c = s[a.stack] || {
      placed: 0,
      weight: 1
    }, h = a.stackWeight / c.weight || 1;
    if (a.horizontal) {
      const d = t.w * h, u = c.size || l.height;
      Ee(c.start) && (r = c.start), l.fullSize ? ke(l, n.left, r, e.outerWidth - n.right - n.left, u) : ke(l, t.left + c.placed, r, d, u), c.start = r, c.placed += d, r = l.bottom;
    } else {
      const d = t.h * h, u = c.size || l.width;
      Ee(c.start) && (o = c.start), l.fullSize ? ke(l, o, n.top, u, e.outerHeight - n.bottom - n.top) : ke(l, o, t.top + c.placed, u, d), c.start = o, c.placed += d, o = l.right;
    }
  }
  t.x = o, t.y = r;
}
var J = {
  addBox(i, t) {
    i.boxes || (i.boxes = []), t.fullSize = t.fullSize || !1, t.position = t.position || "top", t.weight = t.weight || 0, t._layers = t._layers || function() {
      return [
        {
          z: 0,
          draw(e) {
            t.draw(e);
          }
        }
      ];
    }, i.boxes.push(t);
  },
  removeBox(i, t) {
    const e = i.boxes ? i.boxes.indexOf(t) : -1;
    e !== -1 && i.boxes.splice(e, 1);
  },
  configure(i, t, e) {
    t.fullSize = e.fullSize, t.position = e.position, t.weight = e.weight;
  },
  update(i, t, e, s) {
    if (!i)
      return;
    const n = et(i.options.layout.padding), o = Math.max(t - n.width, 0), r = Math.max(e - n.height, 0), a = ma(i.boxes), l = a.vertical, c = a.horizontal;
    z(i.boxes, (g) => {
      typeof g.beforeLayout == "function" && g.beforeLayout();
    });
    const h = l.reduce((g, p) => p.box.options && p.box.options.display === !1 ? g : g + 1, 0) || 1, d = Object.freeze({
      outerWidth: t,
      outerHeight: e,
      padding: n,
      availableWidth: o,
      availableHeight: r,
      vBoxMaxWidth: o / 2 / h,
      hBoxMaxHeight: r / 2
    }), u = Object.assign({}, n);
    _n(u, et(s));
    const f = Object.assign({
      maxPadding: u,
      w: o,
      h: r,
      x: n.left,
      y: n.top
    }, n), m = pa(l.concat(c), d);
    Zt(a.fullSize, f, d, m), Zt(l, f, d, m), Zt(c, f, d, m) && Zt(l, f, d, m), _a(f), ds(a.leftAndTop, f, d, m), f.x += f.w, f.y += f.h, ds(a.rightAndBottom, f, d, m), i.chartArea = {
      left: f.left,
      top: f.top,
      right: f.left + f.w,
      bottom: f.top + f.h,
      height: f.h,
      width: f.w
    }, z(a.chartArea, (g) => {
      const p = g.box;
      Object.assign(p, i.chartArea), p.update(f.w, f.h, {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      });
    });
  }
};
class xn {
  acquireContext(t, e) {
  }
  releaseContext(t) {
    return !1;
  }
  addEventListener(t, e, s) {
  }
  removeEventListener(t, e, s) {
  }
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(t, e, s, n) {
    return e = Math.max(0, e || t.width), s = s || t.height, {
      width: e,
      height: Math.max(0, n ? Math.floor(e / n) : s)
    };
  }
  isAttached(t) {
    return !0;
  }
  updateConfig(t) {
  }
}
class ya extends xn {
  acquireContext(t) {
    return t && t.getContext && t.getContext("2d") || null;
  }
  updateConfig(t) {
    t.options.animation = !1;
  }
}
const Ae = "$chartjs", va = {
  touchstart: "mousedown",
  touchmove: "mousemove",
  touchend: "mouseup",
  pointerenter: "mouseenter",
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointerleave: "mouseout",
  pointerout: "mouseout"
}, us = (i) => i === null || i === "";
function wa(i, t) {
  const e = i.style, s = i.getAttribute("height"), n = i.getAttribute("width");
  if (i[Ae] = {
    initial: {
      height: s,
      width: n,
      style: {
        display: e.display,
        height: e.height,
        width: e.width
      }
    }
  }, e.display = e.display || "block", e.boxSizing = e.boxSizing || "border-box", us(n)) {
    const o = Zi(i, "width");
    o !== void 0 && (i.width = o);
  }
  if (us(s))
    if (i.style.height === "")
      i.height = i.width / (t || 2);
    else {
      const o = Zi(i, "height");
      o !== void 0 && (i.height = o);
    }
  return i;
}
const yn = Lr ? {
  passive: !0
} : !1;
function ka(i, t, e) {
  i && i.addEventListener(t, e, yn);
}
function Sa(i, t, e) {
  i && i.canvas && i.canvas.removeEventListener(t, e, yn);
}
function Ma(i, t) {
  const e = va[i.type] || i.type, { x: s, y: n } = Dt(i, t);
  return {
    type: e,
    chart: t,
    native: i,
    x: s !== void 0 ? s : null,
    y: n !== void 0 ? n : null
  };
}
function Ne(i, t) {
  for (const e of i)
    if (e === t || e.contains(t))
      return !0;
}
function Ca(i, t, e) {
  const s = i.canvas, n = new MutationObserver((o) => {
    let r = !1;
    for (const a of o)
      r = r || Ne(a.addedNodes, s), r = r && !Ne(a.removedNodes, s);
    r && e();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
function Da(i, t, e) {
  const s = i.canvas, n = new MutationObserver((o) => {
    let r = !1;
    for (const a of o)
      r = r || Ne(a.removedNodes, s), r = r && !Ne(a.addedNodes, s);
    r && e();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
const ue = /* @__PURE__ */ new Map();
let fs = 0;
function vn() {
  const i = window.devicePixelRatio;
  i !== fs && (fs = i, ue.forEach((t, e) => {
    e.currentDevicePixelRatio !== i && t();
  }));
}
function Oa(i, t) {
  ue.size || window.addEventListener("resize", vn), ue.set(i, t);
}
function Pa(i) {
  ue.delete(i), ue.size || window.removeEventListener("resize", vn);
}
function Ta(i, t, e) {
  const s = i.canvas, n = s && Ti(s);
  if (!n)
    return;
  const o = en((a, l) => {
    const c = n.clientWidth;
    e(a, l), c < n.clientWidth && e();
  }, window), r = new ResizeObserver((a) => {
    const l = a[0], c = l.contentRect.width, h = l.contentRect.height;
    c === 0 && h === 0 || o(c, h);
  });
  return r.observe(n), Oa(i, o), r;
}
function ei(i, t, e) {
  e && e.disconnect(), t === "resize" && Pa(i);
}
function Aa(i, t, e) {
  const s = i.canvas, n = en((o) => {
    i.ctx !== null && e(Ma(o, i));
  }, i);
  return ka(s, t, n), n;
}
class La extends xn {
  acquireContext(t, e) {
    const s = t && t.getContext && t.getContext("2d");
    return s && s.canvas === t ? (wa(t, e), s) : null;
  }
  releaseContext(t) {
    const e = t.canvas;
    if (!e[Ae])
      return !1;
    const s = e[Ae].initial;
    [
      "height",
      "width"
    ].forEach((o) => {
      const r = s[o];
      E(r) ? e.removeAttribute(o) : e.setAttribute(o, r);
    });
    const n = s.style || {};
    return Object.keys(n).forEach((o) => {
      e.style[o] = n[o];
    }), e.width = e.width, delete e[Ae], !0;
  }
  addEventListener(t, e, s) {
    this.removeEventListener(t, e);
    const n = t.$proxies || (t.$proxies = {}), r = {
      attach: Ca,
      detach: Da,
      resize: Ta
    }[e] || Aa;
    n[e] = r(t, e, s);
  }
  removeEventListener(t, e) {
    const s = t.$proxies || (t.$proxies = {}), n = s[e];
    if (!n)
      return;
    ({
      attach: ei,
      detach: ei,
      resize: ei
    }[e] || Sa)(t, e, n), s[e] = void 0;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(t, e, s, n) {
    return Ar(t, e, s, n);
  }
  isAttached(t) {
    const e = t && Ti(t);
    return !!(e && e.isConnected);
  }
}
function Ia(i) {
  return !Pi() || typeof OffscreenCanvas < "u" && i instanceof OffscreenCanvas ? ya : La;
}
class gt {
  constructor() {
    T(this, "x");
    T(this, "y");
    T(this, "active", !1);
    T(this, "options");
    T(this, "$animations");
  }
  tooltipPosition(t) {
    const { x: e, y: s } = this.getProps([
      "x",
      "y"
    ], t);
    return {
      x: e,
      y: s
    };
  }
  hasValue() {
    return ce(this.x) && ce(this.y);
  }
  getProps(t, e) {
    const s = this.$animations;
    if (!e || !s)
      return this;
    const n = {};
    return t.forEach((o) => {
      n[o] = s[o] && s[o].active() ? s[o]._to : this[o];
    }), n;
  }
}
T(gt, "defaults", {}), T(gt, "defaultRoutes");
function Fa(i, t) {
  const e = i.options.ticks, s = Ra(i), n = Math.min(e.maxTicksLimit || s, s), o = e.major.enabled ? Ea(t) : [], r = o.length, a = o[0], l = o[r - 1], c = [];
  if (r > n)
    return Ha(t, c, o, r / n), c;
  const h = za(o, t, n);
  if (r > 0) {
    let d, u;
    const f = r > 1 ? Math.round((l - a) / (r - 1)) : null;
    for (Se(t, c, h, E(f) ? 0 : a - f, a), d = 0, u = r - 1; d < u; d++)
      Se(t, c, h, o[d], o[d + 1]);
    return Se(t, c, h, l, E(f) ? t.length : l + f), c;
  }
  return Se(t, c, h), c;
}
function Ra(i) {
  const t = i.options.offset, e = i._tickSize(), s = i._length / e + (t ? 0 : 1), n = i._maxLength / e;
  return Math.floor(Math.min(s, n));
}
function za(i, t, e) {
  const s = Ba(i), n = t.length / e;
  if (!s)
    return Math.max(n, 1);
  const o = Do(s);
  for (let r = 0, a = o.length - 1; r < a; r++) {
    const l = o[r];
    if (l > n)
      return l;
  }
  return Math.max(n, 1);
}
function Ea(i) {
  const t = [];
  let e, s;
  for (e = 0, s = i.length; e < s; e++)
    i[e].major && t.push(e);
  return t;
}
function Ha(i, t, e, s) {
  let n = 0, o = e[0], r;
  for (s = Math.ceil(s), r = 0; r < i.length; r++)
    r === o && (t.push(i[r]), n++, o = e[n * s]);
}
function Se(i, t, e, s, n) {
  const o = I(s, 0), r = Math.min(I(n, i.length), i.length);
  let a = 0, l, c, h;
  for (e = Math.ceil(e), n && (l = n - s, e = l / Math.floor(l / e)), h = o; h < 0; )
    a++, h = Math.round(o + a * e);
  for (c = Math.max(o, 0); c < r; c++)
    c === h && (t.push(i[c]), a++, h = Math.round(o + a * e));
}
function Ba(i) {
  const t = i.length;
  let e, s;
  if (t < 2)
    return !1;
  for (s = i[0], e = 1; e < t; ++e)
    if (i[e] - i[e - 1] !== s)
      return !1;
  return s;
}
const Na = (i) => i === "left" ? "right" : i === "right" ? "left" : i, gs = (i, t, e) => t === "top" || t === "left" ? i[t] + e : i[t] - e, ps = (i, t) => Math.min(t || i, i);
function ms(i, t) {
  const e = [], s = i.length / t, n = i.length;
  let o = 0;
  for (; o < n; o += s)
    e.push(i[Math.floor(o)]);
  return e;
}
function Wa(i, t, e) {
  const s = i.ticks.length, n = Math.min(t, s - 1), o = i._startPixel, r = i._endPixel, a = 1e-6;
  let l = i.getPixelForTick(n), c;
  if (!(e && (s === 1 ? c = Math.max(l - o, r - l) : t === 0 ? c = (i.getPixelForTick(1) - l) / 2 : c = (l - i.getPixelForTick(n - 1)) / 2, l += n < t ? c : -c, l < o - a || l > r + a)))
    return l;
}
function Va(i, t) {
  z(i, (e) => {
    const s = e.gc, n = s.length / 2;
    let o;
    if (n > t) {
      for (o = 0; o < n; ++o)
        delete e.data[s[o]];
      s.splice(0, n);
    }
  });
}
function qt(i) {
  return i.drawTicks ? i.tickLength : 0;
}
function bs(i, t) {
  if (!i.display)
    return 0;
  const e = Y(i.font, t), s = et(i.padding);
  return (V(i.text) ? i.text.length : 1) * e.lineHeight + s.height;
}
function ja(i, t) {
  return It(i, {
    scale: t,
    type: "scale"
  });
}
function $a(i, t, e) {
  return It(i, {
    tick: e,
    index: t,
    type: "tick"
  });
}
function Ua(i, t, e) {
  let s = wi(i);
  return (e && t !== "right" || !e && t === "right") && (s = Na(s)), s;
}
function Ya(i, t, e, s) {
  const { top: n, left: o, bottom: r, right: a, chart: l } = i, { chartArea: c, scales: h } = l;
  let d = 0, u, f, m;
  const g = r - n, p = a - o;
  if (i.isHorizontal()) {
    if (f = U(s, o, a), F(e)) {
      const b = Object.keys(e)[0], y = e[b];
      m = h[b].getPixelForValue(y) + g - t;
    } else e === "center" ? m = (c.bottom + c.top) / 2 + g - t : m = gs(i, e, t);
    u = a - o;
  } else {
    if (F(e)) {
      const b = Object.keys(e)[0], y = e[b];
      f = h[b].getPixelForValue(y) - p + t;
    } else e === "center" ? f = (c.left + c.right) / 2 - p + t : f = gs(i, e, t);
    m = U(s, r, n), d = e === "left" ? -it : it;
  }
  return {
    titleX: f,
    titleY: m,
    maxWidth: u,
    rotation: d
  };
}
class Vt extends gt {
  constructor(t) {
    super(), this.id = t.id, this.type = t.type, this.options = void 0, this.ctx = t.ctx, this.chart = t.chart, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this._margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, this.maxWidth = void 0, this.maxHeight = void 0, this.paddingTop = void 0, this.paddingBottom = void 0, this.paddingLeft = void 0, this.paddingRight = void 0, this.axis = void 0, this.labelRotation = void 0, this.min = void 0, this.max = void 0, this._range = void 0, this.ticks = [], this._gridLineItems = null, this._labelItems = null, this._labelSizes = null, this._length = 0, this._maxLength = 0, this._longestTextCache = {}, this._startPixel = void 0, this._endPixel = void 0, this._reversePixels = !1, this._userMax = void 0, this._userMin = void 0, this._suggestedMax = void 0, this._suggestedMin = void 0, this._ticksLength = 0, this._borderValue = 0, this._cache = {}, this._dataLimitsCached = !1, this.$context = void 0;
  }
  init(t) {
    this.options = t.setContext(this.getContext()), this.axis = t.axis, this._userMin = this.parse(t.min), this._userMax = this.parse(t.max), this._suggestedMin = this.parse(t.suggestedMin), this._suggestedMax = this.parse(t.suggestedMax);
  }
  parse(t, e) {
    return t;
  }
  getUserBounds() {
    let { _userMin: t, _userMax: e, _suggestedMin: s, _suggestedMax: n } = this;
    return t = ot(t, Number.POSITIVE_INFINITY), e = ot(e, Number.NEGATIVE_INFINITY), s = ot(s, Number.POSITIVE_INFINITY), n = ot(n, Number.NEGATIVE_INFINITY), {
      min: ot(t, s),
      max: ot(e, n),
      minDefined: tt(t),
      maxDefined: tt(e)
    };
  }
  getMinMax(t) {
    let { min: e, max: s, minDefined: n, maxDefined: o } = this.getUserBounds(), r;
    if (n && o)
      return {
        min: e,
        max: s
      };
    const a = this.getMatchingVisibleMetas();
    for (let l = 0, c = a.length; l < c; ++l)
      r = a[l].controller.getMinMax(this, t), n || (e = Math.min(e, r.min)), o || (s = Math.max(s, r.max));
    return e = o && e > s ? s : e, s = n && e > s ? e : s, {
      min: ot(e, ot(s, e)),
      max: ot(s, ot(e, s))
    };
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0
    };
  }
  getTicks() {
    return this.ticks;
  }
  getLabels() {
    const t = this.chart.data;
    return this.options.labels || (this.isHorizontal() ? t.xLabels : t.yLabels) || t.labels || [];
  }
  getLabelItems(t = this.chart.chartArea) {
    return this._labelItems || (this._labelItems = this._computeLabelItems(t));
  }
  beforeLayout() {
    this._cache = {}, this._dataLimitsCached = !1;
  }
  beforeUpdate() {
    B(this.options.beforeUpdate, [
      this
    ]);
  }
  update(t, e, s) {
    const { beginAtZero: n, grace: o, ticks: r } = this.options, a = r.sampleSize;
    this.beforeUpdate(), this.maxWidth = t, this.maxHeight = e, this._margins = s = Object.assign({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, s), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + s.left + s.right : this.height + s.top + s.bottom, this._dataLimitsCached || (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = cr(this, o, n), this._dataLimitsCached = !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
    const l = a < this.ticks.length;
    this._convertTicksToLabels(l ? ms(this.ticks, a) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), r.display && (r.autoSkip || r.source === "auto") && (this.ticks = Fa(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), l && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate();
  }
  configure() {
    let t = this.options.reverse, e, s;
    this.isHorizontal() ? (e = this.left, s = this.right) : (e = this.top, s = this.bottom, t = !t), this._startPixel = e, this._endPixel = s, this._reversePixels = t, this._length = s - e, this._alignToPixels = this.options.alignToPixels;
  }
  afterUpdate() {
    B(this.options.afterUpdate, [
      this
    ]);
  }
  beforeSetDimensions() {
    B(this.options.beforeSetDimensions, [
      this
    ]);
  }
  setDimensions() {
    this.isHorizontal() ? (this.width = this.maxWidth, this.left = 0, this.right = this.width) : (this.height = this.maxHeight, this.top = 0, this.bottom = this.height), this.paddingLeft = 0, this.paddingTop = 0, this.paddingRight = 0, this.paddingBottom = 0;
  }
  afterSetDimensions() {
    B(this.options.afterSetDimensions, [
      this
    ]);
  }
  _callHooks(t) {
    this.chart.notifyPlugins(t, this.getContext()), B(this.options[t], [
      this
    ]);
  }
  beforeDataLimits() {
    this._callHooks("beforeDataLimits");
  }
  determineDataLimits() {
  }
  afterDataLimits() {
    this._callHooks("afterDataLimits");
  }
  beforeBuildTicks() {
    this._callHooks("beforeBuildTicks");
  }
  buildTicks() {
    return [];
  }
  afterBuildTicks() {
    this._callHooks("afterBuildTicks");
  }
  beforeTickToLabelConversion() {
    B(this.options.beforeTickToLabelConversion, [
      this
    ]);
  }
  generateTickLabels(t) {
    const e = this.options.ticks;
    let s, n, o;
    for (s = 0, n = t.length; s < n; s++)
      o = t[s], o.label = B(e.callback, [
        o.value,
        s,
        t
      ], this);
  }
  afterTickToLabelConversion() {
    B(this.options.afterTickToLabelConversion, [
      this
    ]);
  }
  beforeCalculateLabelRotation() {
    B(this.options.beforeCalculateLabelRotation, [
      this
    ]);
  }
  calculateLabelRotation() {
    const t = this.options, e = t.ticks, s = ps(this.ticks.length, t.ticks.maxTicksLimit), n = e.minRotation || 0, o = e.maxRotation;
    let r = n, a, l, c;
    if (!this._isVisible() || !e.display || n >= o || s <= 1 || !this.isHorizontal()) {
      this.labelRotation = n;
      return;
    }
    const h = this._getLabelSizes(), d = h.widest.width, u = h.highest.height, f = Z(this.chart.width - d, 0, this.maxWidth);
    a = t.offset ? this.maxWidth / s : f / (s - 1), d + 6 > a && (a = f / (s - (t.offset ? 0.5 : 1)), l = this.maxHeight - qt(t.grid) - e.padding - bs(t.title, this.chart.options.font), c = Math.sqrt(d * d + u * u), r = Ao(Math.min(Math.asin(Z((h.highest.height + 6) / a, -1, 1)), Math.asin(Z(l / c, -1, 1)) - Math.asin(Z(u / c, -1, 1)))), r = Math.max(n, Math.min(o, r))), this.labelRotation = r;
  }
  afterCalculateLabelRotation() {
    B(this.options.afterCalculateLabelRotation, [
      this
    ]);
  }
  afterAutoSkip() {
  }
  beforeFit() {
    B(this.options.beforeFit, [
      this
    ]);
  }
  fit() {
    const t = {
      width: 0,
      height: 0
    }, { chart: e, options: { ticks: s, title: n, grid: o } } = this, r = this._isVisible(), a = this.isHorizontal();
    if (r) {
      const l = bs(n, e.options.font);
      if (a ? (t.width = this.maxWidth, t.height = qt(o) + l) : (t.height = this.maxHeight, t.width = qt(o) + l), s.display && this.ticks.length) {
        const { first: c, last: h, widest: d, highest: u } = this._getLabelSizes(), f = s.padding * 2, m = Pt(this.labelRotation), g = Math.cos(m), p = Math.sin(m);
        if (a) {
          const b = s.mirror ? 0 : p * d.width + g * u.height;
          t.height = Math.min(this.maxHeight, t.height + b + f);
        } else {
          const b = s.mirror ? 0 : g * d.width + p * u.height;
          t.width = Math.min(this.maxWidth, t.width + b + f);
        }
        this._calculatePadding(c, h, p, g);
      }
    }
    this._handleMargins(), a ? (this.width = this._length = e.width - this._margins.left - this._margins.right, this.height = t.height) : (this.width = t.width, this.height = this._length = e.height - this._margins.top - this._margins.bottom);
  }
  _calculatePadding(t, e, s, n) {
    const { ticks: { align: o, padding: r }, position: a } = this.options, l = this.labelRotation !== 0, c = a !== "top" && this.axis === "x";
    if (this.isHorizontal()) {
      const h = this.getPixelForTick(0) - this.left, d = this.right - this.getPixelForTick(this.ticks.length - 1);
      let u = 0, f = 0;
      l ? c ? (u = n * t.width, f = s * e.height) : (u = s * t.height, f = n * e.width) : o === "start" ? f = e.width : o === "end" ? u = t.width : o !== "inner" && (u = t.width / 2, f = e.width / 2), this.paddingLeft = Math.max((u - h + r) * this.width / (this.width - h), 0), this.paddingRight = Math.max((f - d + r) * this.width / (this.width - d), 0);
    } else {
      let h = e.height / 2, d = t.height / 2;
      o === "start" ? (h = 0, d = t.height) : o === "end" && (h = e.height, d = 0), this.paddingTop = h + r, this.paddingBottom = d + r;
    }
  }
  _handleMargins() {
    this._margins && (this._margins.left = Math.max(this.paddingLeft, this._margins.left), this._margins.top = Math.max(this.paddingTop, this._margins.top), this._margins.right = Math.max(this.paddingRight, this._margins.right), this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom));
  }
  afterFit() {
    B(this.options.afterFit, [
      this
    ]);
  }
  isHorizontal() {
    const { axis: t, position: e } = this.options;
    return e === "top" || e === "bottom" || t === "x";
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(t) {
    this.beforeTickToLabelConversion(), this.generateTickLabels(t);
    let e, s;
    for (e = 0, s = t.length; e < s; e++)
      E(t[e].label) && (t.splice(e, 1), s--, e--);
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let t = this._labelSizes;
    if (!t) {
      const e = this.options.ticks.sampleSize;
      let s = this.ticks;
      e < s.length && (s = ms(s, e)), this._labelSizes = t = this._computeLabelSizes(s, s.length, this.options.ticks.maxTicksLimit);
    }
    return t;
  }
  _computeLabelSizes(t, e, s) {
    const { ctx: n, _longestTextCache: o } = this, r = [], a = [], l = Math.floor(e / ps(e, s));
    let c = 0, h = 0, d, u, f, m, g, p, b, y, M, S, w;
    for (d = 0; d < e; d += l) {
      if (m = t[d].label, g = this._resolveTickFontOptions(d), n.font = p = g.string, b = o[p] = o[p] || {
        data: {},
        gc: []
      }, y = g.lineHeight, M = S = 0, !E(m) && !V(m))
        M = Gi(n, b.data, b.gc, M, m), S = y;
      else if (V(m))
        for (u = 0, f = m.length; u < f; ++u)
          w = m[u], !E(w) && !V(w) && (M = Gi(n, b.data, b.gc, M, w), S += y);
      r.push(M), a.push(S), c = Math.max(M, c), h = Math.max(S, h);
    }
    Va(o, e);
    const D = r.indexOf(c), O = a.indexOf(h), C = (x) => ({
      width: r[x] || 0,
      height: a[x] || 0
    });
    return {
      first: C(0),
      last: C(e - 1),
      widest: C(D),
      highest: C(O),
      widths: r,
      heights: a
    };
  }
  getLabelForValue(t) {
    return t;
  }
  getPixelForValue(t, e) {
    return NaN;
  }
  getValueForPixel(t) {
  }
  getPixelForTick(t) {
    const e = this.ticks;
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value);
  }
  getPixelForDecimal(t) {
    this._reversePixels && (t = 1 - t);
    const e = this._startPixel + t * this._length;
    return Fo(this._alignToPixels ? Mt(this.chart, e, 0) : e);
  }
  getDecimalForPixel(t) {
    const e = (t - this._startPixel) / this._length;
    return this._reversePixels ? 1 - e : e;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    const { min: t, max: e } = this;
    return t < 0 && e < 0 ? e : t > 0 && e > 0 ? t : 0;
  }
  getContext(t) {
    const e = this.ticks || [];
    if (t >= 0 && t < e.length) {
      const s = e[t];
      return s.$context || (s.$context = $a(this.getContext(), t, s));
    }
    return this.$context || (this.$context = ja(this.chart.getContext(), this));
  }
  _tickSize() {
    const t = this.options.ticks, e = Pt(this.labelRotation), s = Math.abs(Math.cos(e)), n = Math.abs(Math.sin(e)), o = this._getLabelSizes(), r = t.autoSkipPadding || 0, a = o ? o.widest.width + r : 0, l = o ? o.highest.height + r : 0;
    return this.isHorizontal() ? l * s > a * n ? a / s : l / n : l * n < a * s ? l / s : a / n;
  }
  _isVisible() {
    const t = this.options.display;
    return t !== "auto" ? !!t : this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(t) {
    const e = this.axis, s = this.chart, n = this.options, { grid: o, position: r, border: a } = n, l = o.offset, c = this.isHorizontal(), d = this.ticks.length + (l ? 1 : 0), u = qt(o), f = [], m = a.setContext(this.getContext()), g = m.display ? m.width : 0, p = g / 2, b = function(N) {
      return Mt(s, N, g);
    };
    let y, M, S, w, D, O, C, x, _, P, k, A;
    if (r === "top")
      y = b(this.bottom), O = this.bottom - u, x = y - p, P = b(t.top) + p, A = t.bottom;
    else if (r === "bottom")
      y = b(this.top), P = t.top, A = b(t.bottom) - p, O = y + p, x = this.top + u;
    else if (r === "left")
      y = b(this.right), D = this.right - u, C = y - p, _ = b(t.left) + p, k = t.right;
    else if (r === "right")
      y = b(this.left), _ = t.left, k = b(t.right) - p, D = y + p, C = this.left + u;
    else if (e === "x") {
      if (r === "center")
        y = b((t.top + t.bottom) / 2 + 0.5);
      else if (F(r)) {
        const N = Object.keys(r)[0], $ = r[N];
        y = b(this.chart.scales[N].getPixelForValue($));
      }
      P = t.top, A = t.bottom, O = y + p, x = O + u;
    } else if (e === "y") {
      if (r === "center")
        y = b((t.left + t.right) / 2);
      else if (F(r)) {
        const N = Object.keys(r)[0], $ = r[N];
        y = b(this.chart.scales[N].getPixelForValue($));
      }
      D = y - p, C = D - u, _ = t.left, k = t.right;
    }
    const R = I(n.ticks.maxTicksLimit, d), L = Math.max(1, Math.ceil(d / R));
    for (M = 0; M < d; M += L) {
      const N = this.getContext(M), $ = o.setContext(N), yt = a.setContext(N), vt = $.lineWidth, ct = $.color, st = yt.dash || [], Ft = yt.dashOffset, jt = $.tickWidth, wt = $.tickColor, $t = $.tickBorderDash || [], kt = $.tickBorderDashOffset;
      S = Wa(this, M, l), S !== void 0 && (w = Mt(s, S, vt), c ? D = C = _ = k = w : O = x = P = A = w, f.push({
        tx1: D,
        ty1: O,
        tx2: C,
        ty2: x,
        x1: _,
        y1: P,
        x2: k,
        y2: A,
        width: vt,
        color: ct,
        borderDash: st,
        borderDashOffset: Ft,
        tickWidth: jt,
        tickColor: wt,
        tickBorderDash: $t,
        tickBorderDashOffset: kt
      }));
    }
    return this._ticksLength = d, this._borderValue = y, f;
  }
  _computeLabelItems(t) {
    const e = this.axis, s = this.options, { position: n, ticks: o } = s, r = this.isHorizontal(), a = this.ticks, { align: l, crossAlign: c, padding: h, mirror: d } = o, u = qt(s.grid), f = u + h, m = d ? -h : f, g = -Pt(this.labelRotation), p = [];
    let b, y, M, S, w, D, O, C, x, _, P, k, A = "middle";
    if (n === "top")
      D = this.bottom - m, O = this._getXAxisLabelAlignment();
    else if (n === "bottom")
      D = this.top + m, O = this._getXAxisLabelAlignment();
    else if (n === "left") {
      const L = this._getYAxisLabelAlignment(u);
      O = L.textAlign, w = L.x;
    } else if (n === "right") {
      const L = this._getYAxisLabelAlignment(u);
      O = L.textAlign, w = L.x;
    } else if (e === "x") {
      if (n === "center")
        D = (t.top + t.bottom) / 2 + f;
      else if (F(n)) {
        const L = Object.keys(n)[0], N = n[L];
        D = this.chart.scales[L].getPixelForValue(N) + f;
      }
      O = this._getXAxisLabelAlignment();
    } else if (e === "y") {
      if (n === "center")
        w = (t.left + t.right) / 2 - f;
      else if (F(n)) {
        const L = Object.keys(n)[0], N = n[L];
        w = this.chart.scales[L].getPixelForValue(N);
      }
      O = this._getYAxisLabelAlignment(u).textAlign;
    }
    e === "y" && (l === "start" ? A = "top" : l === "end" && (A = "bottom"));
    const R = this._getLabelSizes();
    for (b = 0, y = a.length; b < y; ++b) {
      M = a[b], S = M.label;
      const L = o.setContext(this.getContext(b));
      C = this.getPixelForTick(b) + o.labelOffset, x = this._resolveTickFontOptions(b), _ = x.lineHeight, P = V(S) ? S.length : 1;
      const N = P / 2, $ = L.color, yt = L.textStrokeColor, vt = L.textStrokeWidth;
      let ct = O;
      r ? (w = C, O === "inner" && (b === y - 1 ? ct = this.options.reverse ? "left" : "right" : b === 0 ? ct = this.options.reverse ? "right" : "left" : ct = "center"), n === "top" ? c === "near" || g !== 0 ? k = -P * _ + _ / 2 : c === "center" ? k = -R.highest.height / 2 - N * _ + _ : k = -R.highest.height + _ / 2 : c === "near" || g !== 0 ? k = _ / 2 : c === "center" ? k = R.highest.height / 2 - N * _ : k = R.highest.height - P * _, d && (k *= -1), g !== 0 && !L.showLabelBackdrop && (w += _ / 2 * Math.sin(g))) : (D = C, k = (1 - P) * _ / 2);
      let st;
      if (L.showLabelBackdrop) {
        const Ft = et(L.backdropPadding), jt = R.heights[b], wt = R.widths[b];
        let $t = k - Ft.top, kt = 0 - Ft.left;
        switch (A) {
          case "middle":
            $t -= jt / 2;
            break;
          case "bottom":
            $t -= jt;
            break;
        }
        switch (O) {
          case "center":
            kt -= wt / 2;
            break;
          case "right":
            kt -= wt;
            break;
          case "inner":
            b === y - 1 ? kt -= wt : b > 0 && (kt -= wt / 2);
            break;
        }
        st = {
          left: kt,
          top: $t,
          width: wt + Ft.width,
          height: jt + Ft.height,
          color: L.backdropColor
        };
      }
      p.push({
        label: S,
        font: x,
        textOffset: k,
        options: {
          rotation: g,
          color: $,
          strokeColor: yt,
          strokeWidth: vt,
          textAlign: ct,
          textBaseline: A,
          translation: [
            w,
            D
          ],
          backdrop: st
        }
      });
    }
    return p;
  }
  _getXAxisLabelAlignment() {
    const { position: t, ticks: e } = this.options;
    if (-Pt(this.labelRotation))
      return t === "top" ? "left" : "right";
    let n = "center";
    return e.align === "start" ? n = "left" : e.align === "end" ? n = "right" : e.align === "inner" && (n = "inner"), n;
  }
  _getYAxisLabelAlignment(t) {
    const { position: e, ticks: { crossAlign: s, mirror: n, padding: o } } = this.options, r = this._getLabelSizes(), a = t + o, l = r.widest.width;
    let c, h;
    return e === "left" ? n ? (h = this.right + o, s === "near" ? c = "left" : s === "center" ? (c = "center", h += l / 2) : (c = "right", h += l)) : (h = this.right - a, s === "near" ? c = "right" : s === "center" ? (c = "center", h -= l / 2) : (c = "left", h = this.left)) : e === "right" ? n ? (h = this.left + o, s === "near" ? c = "right" : s === "center" ? (c = "center", h -= l / 2) : (c = "left", h -= l)) : (h = this.left + a, s === "near" ? c = "left" : s === "center" ? (c = "center", h += l / 2) : (c = "right", h = this.right)) : c = "right", {
      textAlign: c,
      x: h
    };
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror)
      return;
    const t = this.chart, e = this.options.position;
    if (e === "left" || e === "right")
      return {
        top: 0,
        left: this.left,
        bottom: t.height,
        right: this.right
      };
    if (e === "top" || e === "bottom")
      return {
        top: this.top,
        left: 0,
        bottom: this.bottom,
        right: t.width
      };
  }
  drawBackground() {
    const { ctx: t, options: { backgroundColor: e }, left: s, top: n, width: o, height: r } = this;
    e && (t.save(), t.fillStyle = e, t.fillRect(s, n, o, r), t.restore());
  }
  getLineWidthForValue(t) {
    const e = this.options.grid;
    if (!this._isVisible() || !e.display)
      return 0;
    const n = this.ticks.findIndex((o) => o.value === t);
    return n >= 0 ? e.setContext(this.getContext(n)).lineWidth : 0;
  }
  drawGrid(t) {
    const e = this.options.grid, s = this.ctx, n = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(t));
    let o, r;
    const a = (l, c, h) => {
      !h.width || !h.color || (s.save(), s.lineWidth = h.width, s.strokeStyle = h.color, s.setLineDash(h.borderDash || []), s.lineDashOffset = h.borderDashOffset, s.beginPath(), s.moveTo(l.x, l.y), s.lineTo(c.x, c.y), s.stroke(), s.restore());
    };
    if (e.display)
      for (o = 0, r = n.length; o < r; ++o) {
        const l = n[o];
        e.drawOnChartArea && a({
          x: l.x1,
          y: l.y1
        }, {
          x: l.x2,
          y: l.y2
        }, l), e.drawTicks && a({
          x: l.tx1,
          y: l.ty1
        }, {
          x: l.tx2,
          y: l.ty2
        }, {
          color: l.tickColor,
          width: l.tickWidth,
          borderDash: l.tickBorderDash,
          borderDashOffset: l.tickBorderDashOffset
        });
      }
  }
  drawBorder() {
    const { chart: t, ctx: e, options: { border: s, grid: n } } = this, o = s.setContext(this.getContext()), r = s.display ? o.width : 0;
    if (!r)
      return;
    const a = n.setContext(this.getContext(0)).lineWidth, l = this._borderValue;
    let c, h, d, u;
    this.isHorizontal() ? (c = Mt(t, this.left, r) - r / 2, h = Mt(t, this.right, a) + a / 2, d = u = l) : (d = Mt(t, this.top, r) - r / 2, u = Mt(t, this.bottom, a) + a / 2, c = h = l), e.save(), e.lineWidth = o.width, e.strokeStyle = o.color, e.beginPath(), e.moveTo(c, d), e.lineTo(h, u), e.stroke(), e.restore();
  }
  drawLabels(t) {
    if (!this.options.ticks.display)
      return;
    const s = this.ctx, n = this._computeLabelArea();
    n && Si(s, n);
    const o = this.getLabelItems(t);
    for (const r of o) {
      const a = r.options, l = r.font, c = r.label, h = r.textOffset;
      de(s, c, 0, h, l, a);
    }
    n && Mi(s);
  }
  drawTitle() {
    const { ctx: t, options: { position: e, title: s, reverse: n } } = this;
    if (!s.display)
      return;
    const o = Y(s.font), r = et(s.padding), a = s.align;
    let l = o.lineHeight / 2;
    e === "bottom" || e === "center" || F(e) ? (l += r.bottom, V(s.text) && (l += o.lineHeight * (s.text.length - 1))) : l += r.top;
    const { titleX: c, titleY: h, maxWidth: d, rotation: u } = Ya(this, l, e, a);
    de(t, s.text, 0, 0, o, {
      color: s.color,
      maxWidth: d,
      rotation: u,
      textAlign: Ua(a, e, n),
      textBaseline: "middle",
      translation: [
        c,
        h
      ]
    });
  }
  draw(t) {
    this._isVisible() && (this.drawBackground(), this.drawGrid(t), this.drawBorder(), this.drawTitle(), this.drawLabels(t));
  }
  _layers() {
    const t = this.options, e = t.ticks && t.ticks.z || 0, s = I(t.grid && t.grid.z, -1), n = I(t.border && t.border.z, 0);
    return !this._isVisible() || this.draw !== Vt.prototype.draw ? [
      {
        z: e,
        draw: (o) => {
          this.draw(o);
        }
      }
    ] : [
      {
        z: s,
        draw: (o) => {
          this.drawBackground(), this.drawGrid(o), this.drawTitle();
        }
      },
      {
        z: n,
        draw: () => {
          this.drawBorder();
        }
      },
      {
        z: e,
        draw: (o) => {
          this.drawLabels(o);
        }
      }
    ];
  }
  getMatchingVisibleMetas(t) {
    const e = this.chart.getSortedVisibleDatasetMetas(), s = this.axis + "AxisID", n = [];
    let o, r;
    for (o = 0, r = e.length; o < r; ++o) {
      const a = e[o];
      a[s] === this.id && (!t || a.type === t) && n.push(a);
    }
    return n;
  }
  _resolveTickFontOptions(t) {
    const e = this.options.ticks.setContext(this.getContext(t));
    return Y(e.font);
  }
  _maxDigits() {
    const t = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / t;
  }
}
class Me {
  constructor(t, e, s) {
    this.type = t, this.scope = e, this.override = s, this.items = /* @__PURE__ */ Object.create(null);
  }
  isForType(t) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, t.prototype);
  }
  register(t) {
    const e = Object.getPrototypeOf(t);
    let s;
    Xa(e) && (s = this.register(e));
    const n = this.items, o = t.id, r = this.scope + "." + o;
    if (!o)
      throw new Error("class does not have id: " + t);
    return o in n || (n[o] = t, Ga(t, r, s), this.override && W.override(t.id, t.overrides)), r;
  }
  get(t) {
    return this.items[t];
  }
  unregister(t) {
    const e = this.items, s = t.id, n = this.scope;
    s in e && delete e[s], n && s in W[n] && (delete W[n][s], this.override && delete Lt[s]);
  }
}
function Ga(i, t, e) {
  const s = le(/* @__PURE__ */ Object.create(null), [
    e ? W.get(e) : {},
    W.get(t),
    i.defaults
  ]);
  W.set(t, s), i.defaultRoutes && qa(t, i.defaultRoutes), i.descriptors && W.describe(t, i.descriptors);
}
function qa(i, t) {
  Object.keys(t).forEach((e) => {
    const s = e.split("."), n = s.pop(), o = [
      i
    ].concat(s).join("."), r = t[e].split("."), a = r.pop(), l = r.join(".");
    W.route(o, n, l, a);
  });
}
function Xa(i) {
  return "id" in i && "defaults" in i;
}
class Ka {
  constructor() {
    this.controllers = new Me(re, "datasets", !0), this.elements = new Me(gt, "elements"), this.plugins = new Me(Object, "plugins"), this.scales = new Me(Vt, "scales"), this._typedRegistries = [
      this.controllers,
      this.scales,
      this.elements
    ];
  }
  add(...t) {
    this._each("register", t);
  }
  remove(...t) {
    this._each("unregister", t);
  }
  addControllers(...t) {
    this._each("register", t, this.controllers);
  }
  addElements(...t) {
    this._each("register", t, this.elements);
  }
  addPlugins(...t) {
    this._each("register", t, this.plugins);
  }
  addScales(...t) {
    this._each("register", t, this.scales);
  }
  getController(t) {
    return this._get(t, this.controllers, "controller");
  }
  getElement(t) {
    return this._get(t, this.elements, "element");
  }
  getPlugin(t) {
    return this._get(t, this.plugins, "plugin");
  }
  getScale(t) {
    return this._get(t, this.scales, "scale");
  }
  removeControllers(...t) {
    this._each("unregister", t, this.controllers);
  }
  removeElements(...t) {
    this._each("unregister", t, this.elements);
  }
  removePlugins(...t) {
    this._each("unregister", t, this.plugins);
  }
  removeScales(...t) {
    this._each("unregister", t, this.scales);
  }
  _each(t, e, s) {
    [
      ...e
    ].forEach((n) => {
      const o = s || this._getRegistryForType(n);
      s || o.isForType(n) || o === this.plugins && n.id ? this._exec(t, o, n) : z(n, (r) => {
        const a = s || this._getRegistryForType(r);
        this._exec(t, a, r);
      });
    });
  }
  _exec(t, e, s) {
    const n = yi(t);
    B(s["before" + n], [], s), e[t](s), B(s["after" + n], [], s);
  }
  _getRegistryForType(t) {
    for (let e = 0; e < this._typedRegistries.length; e++) {
      const s = this._typedRegistries[e];
      if (s.isForType(t))
        return s;
    }
    return this.plugins;
  }
  _get(t, e, s) {
    const n = e.get(t);
    if (n === void 0)
      throw new Error('"' + t + '" is not a registered ' + s + ".");
    return n;
  }
}
var at = /* @__PURE__ */ new Ka();
class Qa {
  constructor() {
    this._init = [];
  }
  notify(t, e, s, n) {
    e === "beforeInit" && (this._init = this._createDescriptors(t, !0), this._notify(this._init, t, "install"));
    const o = n ? this._descriptors(t).filter(n) : this._descriptors(t), r = this._notify(o, t, e, s);
    return e === "afterDestroy" && (this._notify(o, t, "stop"), this._notify(this._init, t, "uninstall")), r;
  }
  _notify(t, e, s, n) {
    n = n || {};
    for (const o of t) {
      const r = o.plugin, a = r[s], l = [
        e,
        n,
        o.options
      ];
      if (B(a, l, r) === !1 && n.cancelable)
        return !1;
    }
    return !0;
  }
  invalidate() {
    E(this._cache) || (this._oldCache = this._cache, this._cache = void 0);
  }
  _descriptors(t) {
    if (this._cache)
      return this._cache;
    const e = this._cache = this._createDescriptors(t);
    return this._notifyStateChanges(t), e;
  }
  _createDescriptors(t, e) {
    const s = t && t.config, n = I(s.options && s.options.plugins, {}), o = Za(s);
    return n === !1 && !e ? [] : tl(t, o, n, e);
  }
  _notifyStateChanges(t) {
    const e = this._oldCache || [], s = this._cache, n = (o, r) => o.filter((a) => !r.some((l) => a.plugin.id === l.plugin.id));
    this._notify(n(e, s), t, "stop"), this._notify(n(s, e), t, "start");
  }
}
function Za(i) {
  const t = {}, e = [], s = Object.keys(at.plugins.items);
  for (let o = 0; o < s.length; o++)
    e.push(at.getPlugin(s[o]));
  const n = i.plugins || [];
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    e.indexOf(r) === -1 && (e.push(r), t[r.id] = !0);
  }
  return {
    plugins: e,
    localIds: t
  };
}
function Ja(i, t) {
  return !t && i === !1 ? null : i === !0 ? {} : i;
}
function tl(i, { plugins: t, localIds: e }, s, n) {
  const o = [], r = i.getContext();
  for (const a of t) {
    const l = a.id, c = Ja(s[l], n);
    c !== null && o.push({
      plugin: a,
      options: el(i.config, {
        plugin: a,
        local: e[l]
      }, c, r)
    });
  }
  return o;
}
function el(i, { plugin: t, local: e }, s, n) {
  const o = i.pluginScopeKeys(t), r = i.getOptionScopes(s, o);
  return e && t.defaults && r.push(t.defaults), i.createResolver(r, n, [
    ""
  ], {
    scriptable: !1,
    indexable: !1,
    allKeys: !0
  });
}
function hi(i, t) {
  const e = W.datasets[i] || {};
  return ((t.datasets || {})[i] || {}).indexAxis || t.indexAxis || e.indexAxis || "x";
}
function il(i, t) {
  let e = i;
  return i === "_index_" ? e = t : i === "_value_" && (e = t === "x" ? "y" : "x"), e;
}
function sl(i, t) {
  return i === t ? "_index_" : "_value_";
}
function _s(i) {
  if (i === "x" || i === "y" || i === "r")
    return i;
}
function nl(i) {
  if (i === "top" || i === "bottom")
    return "x";
  if (i === "left" || i === "right")
    return "y";
}
function di(i, ...t) {
  if (_s(i))
    return i;
  for (const e of t) {
    const s = e.axis || nl(e.position) || i.length > 1 && _s(i[0].toLowerCase());
    if (s)
      return s;
  }
  throw new Error(`Cannot determine type of '${i}' axis. Please provide 'axis' or 'position' option.`);
}
function xs(i, t, e) {
  if (e[t + "AxisID"] === i)
    return {
      axis: t
    };
}
function ol(i, t) {
  if (t.data && t.data.datasets) {
    const e = t.data.datasets.filter((s) => s.xAxisID === i || s.yAxisID === i);
    if (e.length)
      return xs(i, "x", e[0]) || xs(i, "y", e[0]);
  }
  return {};
}
function rl(i, t) {
  const e = Lt[i.type] || {
    scales: {}
  }, s = t.scales || {}, n = hi(i.type, t), o = /* @__PURE__ */ Object.create(null);
  return Object.keys(s).forEach((r) => {
    const a = s[r];
    if (!F(a))
      return console.error(`Invalid scale configuration for scale: ${r}`);
    if (a._proxy)
      return console.warn(`Ignoring resolver passed as options for scale: ${r}`);
    const l = di(r, a, ol(r, i), W.scales[a.type]), c = sl(l, n), h = e.scales || {};
    o[r] = ee(/* @__PURE__ */ Object.create(null), [
      {
        axis: l
      },
      a,
      h[l],
      h[c]
    ]);
  }), i.data.datasets.forEach((r) => {
    const a = r.type || i.type, l = r.indexAxis || hi(a, t), h = (Lt[a] || {}).scales || {};
    Object.keys(h).forEach((d) => {
      const u = il(d, l), f = r[u + "AxisID"] || u;
      o[f] = o[f] || /* @__PURE__ */ Object.create(null), ee(o[f], [
        {
          axis: u
        },
        s[f],
        h[d]
      ]);
    });
  }), Object.keys(o).forEach((r) => {
    const a = o[r];
    ee(a, [
      W.scales[a.type],
      W.scale
    ]);
  }), o;
}
function wn(i) {
  const t = i.options || (i.options = {});
  t.plugins = I(t.plugins, {}), t.scales = rl(i, t);
}
function kn(i) {
  return i = i || {}, i.datasets = i.datasets || [], i.labels = i.labels || [], i;
}
function al(i) {
  return i = i || {}, i.data = kn(i.data), wn(i), i;
}
const ys = /* @__PURE__ */ new Map(), Sn = /* @__PURE__ */ new Set();
function Ce(i, t) {
  let e = ys.get(i);
  return e || (e = t(), ys.set(i, e), Sn.add(e)), e;
}
const Xt = (i, t, e) => {
  const s = ze(t, e);
  s !== void 0 && i.add(s);
};
class ll {
  constructor(t) {
    this._config = al(t), this._scopeCache = /* @__PURE__ */ new Map(), this._resolverCache = /* @__PURE__ */ new Map();
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(t) {
    this._config.type = t;
  }
  get data() {
    return this._config.data;
  }
  set data(t) {
    this._config.data = kn(t);
  }
  get options() {
    return this._config.options;
  }
  set options(t) {
    this._config.options = t;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    const t = this._config;
    this.clearCache(), wn(t);
  }
  clearCache() {
    this._scopeCache.clear(), this._resolverCache.clear();
  }
  datasetScopeKeys(t) {
    return Ce(t, () => [
      [
        `datasets.${t}`,
        ""
      ]
    ]);
  }
  datasetAnimationScopeKeys(t, e) {
    return Ce(`${t}.transition.${e}`, () => [
      [
        `datasets.${t}.transitions.${e}`,
        `transitions.${e}`
      ],
      [
        `datasets.${t}`,
        ""
      ]
    ]);
  }
  datasetElementScopeKeys(t, e) {
    return Ce(`${t}-${e}`, () => [
      [
        `datasets.${t}.elements.${e}`,
        `datasets.${t}`,
        `elements.${e}`,
        ""
      ]
    ]);
  }
  pluginScopeKeys(t) {
    const e = t.id, s = this.type;
    return Ce(`${s}-plugin-${e}`, () => [
      [
        `plugins.${e}`,
        ...t.additionalOptionScopes || []
      ]
    ]);
  }
  _cachedScopes(t, e) {
    const s = this._scopeCache;
    let n = s.get(t);
    return (!n || e) && (n = /* @__PURE__ */ new Map(), s.set(t, n)), n;
  }
  getOptionScopes(t, e, s) {
    const { options: n, type: o } = this, r = this._cachedScopes(t, s), a = r.get(e);
    if (a)
      return a;
    const l = /* @__PURE__ */ new Set();
    e.forEach((h) => {
      t && (l.add(t), h.forEach((d) => Xt(l, t, d))), h.forEach((d) => Xt(l, n, d)), h.forEach((d) => Xt(l, Lt[o] || {}, d)), h.forEach((d) => Xt(l, W, d)), h.forEach((d) => Xt(l, ai, d));
    });
    const c = Array.from(l);
    return c.length === 0 && c.push(/* @__PURE__ */ Object.create(null)), Sn.has(e) && r.set(e, c), c;
  }
  chartOptionScopes() {
    const { options: t, type: e } = this;
    return [
      t,
      Lt[e] || {},
      W.datasets[e] || {},
      {
        type: e
      },
      W,
      ai
    ];
  }
  resolveNamedOptions(t, e, s, n = [
    ""
  ]) {
    const o = {
      $shared: !0
    }, { resolver: r, subPrefixes: a } = vs(this._resolverCache, t, n);
    let l = r;
    if (hl(r, e)) {
      o.$shared = !1, s = xt(s) ? s() : s;
      const c = this.createResolver(t, s, a);
      l = Nt(r, s, c);
    }
    for (const c of e)
      o[c] = l[c];
    return o;
  }
  createResolver(t, e, s = [
    ""
  ], n) {
    const { resolver: o } = vs(this._resolverCache, t, s);
    return F(e) ? Nt(o, e, void 0, n) : o;
  }
}
function vs(i, t, e) {
  let s = i.get(t);
  s || (s = /* @__PURE__ */ new Map(), i.set(t, s));
  const n = e.join();
  let o = s.get(n);
  return o || (o = {
    resolver: Ci(t, e),
    subPrefixes: e.filter((a) => !a.toLowerCase().includes("hover"))
  }, s.set(n, o)), o;
}
const cl = (i) => F(i) && Object.getOwnPropertyNames(i).some((t) => xt(i[t]));
function hl(i, t) {
  const { isScriptable: e, isIndexable: s } = an(i);
  for (const n of t) {
    const o = e(n), r = s(n), a = (r || o) && i[n];
    if (o && (xt(a) || cl(a)) || r && V(a))
      return !0;
  }
  return !1;
}
var dl = "4.5.0";
const ul = [
  "top",
  "bottom",
  "left",
  "right",
  "chartArea"
];
function ws(i, t) {
  return i === "top" || i === "bottom" || ul.indexOf(i) === -1 && t === "x";
}
function ks(i, t) {
  return function(e, s) {
    return e[i] === s[i] ? e[t] - s[t] : e[i] - s[i];
  };
}
function Ss(i) {
  const t = i.chart, e = t.options.animation;
  t.notifyPlugins("afterRender"), B(e && e.onComplete, [
    i
  ], t);
}
function fl(i) {
  const t = i.chart, e = t.options.animation;
  B(e && e.onProgress, [
    i
  ], t);
}
function Mn(i) {
  return Pi() && typeof i == "string" ? i = document.getElementById(i) : i && i.length && (i = i[0]), i && i.canvas && (i = i.canvas), i;
}
const Le = {}, Ms = (i) => {
  const t = Mn(i);
  return Object.values(Le).filter((e) => e.canvas === t).pop();
};
function gl(i, t, e) {
  const s = Object.keys(i);
  for (const n of s) {
    const o = +n;
    if (o >= t) {
      const r = i[n];
      delete i[n], (e > 0 || o > t) && (i[o + e] = r);
    }
  }
}
function pl(i, t, e, s) {
  return !e || i.type === "mouseout" ? null : s ? t : i;
}
var pt;
let $e = (pt = class {
  static register(...t) {
    at.add(...t), Cs();
  }
  static unregister(...t) {
    at.remove(...t), Cs();
  }
  constructor(t, e) {
    const s = this.config = new ll(e), n = Mn(t), o = Ms(n);
    if (o)
      throw new Error("Canvas is already in use. Chart with ID '" + o.id + "' must be destroyed before the canvas with ID '" + o.canvas.id + "' can be reused.");
    const r = s.createResolver(s.chartOptionScopes(), this.getContext());
    this.platform = new (s.platform || Ia(n))(), this.platform.updateConfig(s);
    const a = this.platform.acquireContext(n, r.aspectRatio), l = a && a.canvas, c = l && l.height, h = l && l.width;
    if (this.id = _o(), this.ctx = a, this.canvas = l, this.width = h, this.height = c, this._options = r, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new Qa(), this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = Bo((d) => this.update(d), r.resizeDelay || 0), this._dataChanges = [], Le[this.id] = this, !a || !l) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    dt.listen(this, "complete", Ss), dt.listen(this, "progress", fl), this._initialize(), this.attached && this.update();
  }
  get aspectRatio() {
    const { options: { aspectRatio: t, maintainAspectRatio: e }, width: s, height: n, _aspectRatio: o } = this;
    return E(t) ? e && o ? o : n ? s / n : null : t;
  }
  get data() {
    return this.config.data;
  }
  set data(t) {
    this.config.data = t;
  }
  get options() {
    return this._options;
  }
  set options(t) {
    this.config.options = t;
  }
  get registry() {
    return at;
  }
  _initialize() {
    return this.notifyPlugins("beforeInit"), this.options.responsive ? this.resize() : Qi(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins("afterInit"), this;
  }
  clear() {
    return qi(this.canvas, this.ctx), this;
  }
  stop() {
    return dt.stop(this), this;
  }
  resize(t, e) {
    dt.running(this) ? this._resizeBeforeDraw = {
      width: t,
      height: e
    } : this._resize(t, e);
  }
  _resize(t, e) {
    const s = this.options, n = this.canvas, o = s.maintainAspectRatio && this.aspectRatio, r = this.platform.getMaximumSize(n, t, e, o), a = s.devicePixelRatio || this.platform.getDevicePixelRatio(), l = this.width ? "resize" : "attach";
    this.width = r.width, this.height = r.height, this._aspectRatio = this.aspectRatio, Qi(this, a, !0) && (this.notifyPlugins("resize", {
      size: r
    }), B(s.onResize, [
      this,
      r
    ], this), this.attached && this._doResize(l) && this.render());
  }
  ensureScalesHaveIDs() {
    const e = this.options.scales || {};
    z(e, (s, n) => {
      s.id = n;
    });
  }
  buildOrUpdateScales() {
    const t = this.options, e = t.scales, s = this.scales, n = Object.keys(s).reduce((r, a) => (r[a] = !1, r), {});
    let o = [];
    e && (o = o.concat(Object.keys(e).map((r) => {
      const a = e[r], l = di(r, a), c = l === "r", h = l === "x";
      return {
        options: a,
        dposition: c ? "chartArea" : h ? "bottom" : "left",
        dtype: c ? "radialLinear" : h ? "category" : "linear"
      };
    }))), z(o, (r) => {
      const a = r.options, l = a.id, c = di(l, a), h = I(a.type, r.dtype);
      (a.position === void 0 || ws(a.position, c) !== ws(r.dposition)) && (a.position = r.dposition), n[l] = !0;
      let d = null;
      if (l in s && s[l].type === h)
        d = s[l];
      else {
        const u = at.getScale(h);
        d = new u({
          id: l,
          type: h,
          ctx: this.ctx,
          chart: this
        }), s[d.id] = d;
      }
      d.init(a, t);
    }), z(n, (r, a) => {
      r || delete s[a];
    }), z(s, (r) => {
      J.configure(this, r, r.options), J.addBox(this, r);
    });
  }
  _updateMetasets() {
    const t = this._metasets, e = this.data.datasets.length, s = t.length;
    if (t.sort((n, o) => n.index - o.index), s > e) {
      for (let n = e; n < s; ++n)
        this._destroyDatasetMeta(n);
      t.splice(e, s - e);
    }
    this._sortedMetasets = t.slice(0).sort(ks("order", "index"));
  }
  _removeUnreferencedMetasets() {
    const { _metasets: t, data: { datasets: e } } = this;
    t.length > e.length && delete this._stacks, t.forEach((s, n) => {
      e.filter((o) => o === s._dataset).length === 0 && this._destroyDatasetMeta(n);
    });
  }
  buildOrUpdateControllers() {
    const t = [], e = this.data.datasets;
    let s, n;
    for (this._removeUnreferencedMetasets(), s = 0, n = e.length; s < n; s++) {
      const o = e[s];
      let r = this.getDatasetMeta(s);
      const a = o.type || this.config.type;
      if (r.type && r.type !== a && (this._destroyDatasetMeta(s), r = this.getDatasetMeta(s)), r.type = a, r.indexAxis = o.indexAxis || hi(a, this.options), r.order = o.order || 0, r.index = s, r.label = "" + o.label, r.visible = this.isDatasetVisible(s), r.controller)
        r.controller.updateIndex(s), r.controller.linkScales();
      else {
        const l = at.getController(a), { datasetElementType: c, dataElementType: h } = W.datasets[a];
        Object.assign(l, {
          dataElementType: at.getElement(h),
          datasetElementType: c && at.getElement(c)
        }), r.controller = new l(this, s), t.push(r.controller);
      }
    }
    return this._updateMetasets(), t;
  }
  _resetElements() {
    z(this.data.datasets, (t, e) => {
      this.getDatasetMeta(e).controller.reset();
    }, this);
  }
  reset() {
    this._resetElements(), this.notifyPlugins("reset");
  }
  update(t) {
    const e = this.config;
    e.update();
    const s = this._options = e.createResolver(e.chartOptionScopes(), this.getContext()), n = this._animationsDisabled = !s.animation;
    if (this._updateScales(), this._checkEventBindings(), this._updateHiddenIndices(), this._plugins.invalidate(), this.notifyPlugins("beforeUpdate", {
      mode: t,
      cancelable: !0
    }) === !1)
      return;
    const o = this.buildOrUpdateControllers();
    this.notifyPlugins("beforeElementsUpdate");
    let r = 0;
    for (let c = 0, h = this.data.datasets.length; c < h; c++) {
      const { controller: d } = this.getDatasetMeta(c), u = !n && o.indexOf(d) === -1;
      d.buildOrUpdateElements(u), r = Math.max(+d.getMaxOverflow(), r);
    }
    r = this._minPadding = s.layout.autoPadding ? r : 0, this._updateLayout(r), n || z(o, (c) => {
      c.reset();
    }), this._updateDatasets(t), this.notifyPlugins("afterUpdate", {
      mode: t
    }), this._layers.sort(ks("z", "_idx"));
    const { _active: a, _lastEvent: l } = this;
    l ? this._eventHandler(l, !0) : a.length && this._updateHoverStyles(a, a, !0), this.render();
  }
  _updateScales() {
    z(this.scales, (t) => {
      J.removeBox(this, t);
    }), this.ensureScalesHaveIDs(), this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const t = this.options, e = new Set(Object.keys(this._listeners)), s = new Set(t.events);
    (!Hi(e, s) || !!this._responsiveListeners !== t.responsive) && (this.unbindEvents(), this.bindEvents());
  }
  _updateHiddenIndices() {
    const { _hiddenIndices: t } = this, e = this._getUniformDataChanges() || [];
    for (const { method: s, start: n, count: o } of e) {
      const r = s === "_removeElements" ? -o : o;
      gl(t, n, r);
    }
  }
  _getUniformDataChanges() {
    const t = this._dataChanges;
    if (!t || !t.length)
      return;
    this._dataChanges = [];
    const e = this.data.datasets.length, s = (o) => new Set(t.filter((r) => r[0] === o).map((r, a) => a + "," + r.splice(1).join(","))), n = s(0);
    for (let o = 1; o < e; o++)
      if (!Hi(n, s(o)))
        return;
    return Array.from(n).map((o) => o.split(",")).map((o) => ({
      method: o[1],
      start: +o[2],
      count: +o[3]
    }));
  }
  _updateLayout(t) {
    if (this.notifyPlugins("beforeLayout", {
      cancelable: !0
    }) === !1)
      return;
    J.update(this, this.width, this.height, t);
    const e = this.chartArea, s = e.width <= 0 || e.height <= 0;
    this._layers = [], z(this.boxes, (n) => {
      s && n.position === "chartArea" || (n.configure && n.configure(), this._layers.push(...n._layers()));
    }, this), this._layers.forEach((n, o) => {
      n._idx = o;
    }), this.notifyPlugins("afterLayout");
  }
  _updateDatasets(t) {
    if (this.notifyPlugins("beforeDatasetsUpdate", {
      mode: t,
      cancelable: !0
    }) !== !1) {
      for (let e = 0, s = this.data.datasets.length; e < s; ++e)
        this.getDatasetMeta(e).controller.configure();
      for (let e = 0, s = this.data.datasets.length; e < s; ++e)
        this._updateDataset(e, xt(t) ? t({
          datasetIndex: e
        }) : t);
      this.notifyPlugins("afterDatasetsUpdate", {
        mode: t
      });
    }
  }
  _updateDataset(t, e) {
    const s = this.getDatasetMeta(t), n = {
      meta: s,
      index: t,
      mode: e,
      cancelable: !0
    };
    this.notifyPlugins("beforeDatasetUpdate", n) !== !1 && (s.controller._update(e), n.cancelable = !1, this.notifyPlugins("afterDatasetUpdate", n));
  }
  render() {
    this.notifyPlugins("beforeRender", {
      cancelable: !0
    }) !== !1 && (dt.has(this) ? this.attached && !dt.running(this) && dt.start(this) : (this.draw(), Ss({
      chart: this
    })));
  }
  draw() {
    let t;
    if (this._resizeBeforeDraw) {
      const { width: s, height: n } = this._resizeBeforeDraw;
      this._resizeBeforeDraw = null, this._resize(s, n);
    }
    if (this.clear(), this.width <= 0 || this.height <= 0 || this.notifyPlugins("beforeDraw", {
      cancelable: !0
    }) === !1)
      return;
    const e = this._layers;
    for (t = 0; t < e.length && e[t].z <= 0; ++t)
      e[t].draw(this.chartArea);
    for (this._drawDatasets(); t < e.length; ++t)
      e[t].draw(this.chartArea);
    this.notifyPlugins("afterDraw");
  }
  _getSortedDatasetMetas(t) {
    const e = this._sortedMetasets, s = [];
    let n, o;
    for (n = 0, o = e.length; n < o; ++n) {
      const r = e[n];
      (!t || r.visible) && s.push(r);
    }
    return s;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(!0);
  }
  _drawDatasets() {
    if (this.notifyPlugins("beforeDatasetsDraw", {
      cancelable: !0
    }) === !1)
      return;
    const t = this.getSortedVisibleDatasetMetas();
    for (let e = t.length - 1; e >= 0; --e)
      this._drawDataset(t[e]);
    this.notifyPlugins("afterDatasetsDraw");
  }
  _drawDataset(t) {
    const e = this.ctx, s = {
      meta: t,
      index: t.index,
      cancelable: !0
    }, n = Yr(this, t);
    this.notifyPlugins("beforeDatasetDraw", s) !== !1 && (n && Si(e, n), t.controller.draw(), n && Mi(e), s.cancelable = !1, this.notifyPlugins("afterDatasetDraw", s));
  }
  isPointInArea(t) {
    return he(t, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(t, e, s, n) {
    const o = ua.modes[e];
    return typeof o == "function" ? o(this, t, s, n) : [];
  }
  getDatasetMeta(t) {
    const e = this.data.datasets[t], s = this._metasets;
    let n = s.filter((o) => o && o._dataset === e).pop();
    return n || (n = {
      type: null,
      data: [],
      dataset: null,
      controller: null,
      hidden: null,
      xAxisID: null,
      yAxisID: null,
      order: e && e.order || 0,
      index: t,
      _dataset: e,
      _parsed: [],
      _sorted: !1
    }, s.push(n)), n;
  }
  getContext() {
    return this.$context || (this.$context = It(null, {
      chart: this,
      type: "chart"
    }));
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(t) {
    const e = this.data.datasets[t];
    if (!e)
      return !1;
    const s = this.getDatasetMeta(t);
    return typeof s.hidden == "boolean" ? !s.hidden : !e.hidden;
  }
  setDatasetVisibility(t, e) {
    const s = this.getDatasetMeta(t);
    s.hidden = !e;
  }
  toggleDataVisibility(t) {
    this._hiddenIndices[t] = !this._hiddenIndices[t];
  }
  getDataVisibility(t) {
    return !this._hiddenIndices[t];
  }
  _updateVisibility(t, e, s) {
    const n = s ? "show" : "hide", o = this.getDatasetMeta(t), r = o.controller._resolveAnimations(void 0, n);
    Ee(e) ? (o.data[e].hidden = !s, this.update()) : (this.setDatasetVisibility(t, s), r.update(o, {
      visible: s
    }), this.update((a) => a.datasetIndex === t ? n : void 0));
  }
  hide(t, e) {
    this._updateVisibility(t, e, !1);
  }
  show(t, e) {
    this._updateVisibility(t, e, !0);
  }
  _destroyDatasetMeta(t) {
    const e = this._metasets[t];
    e && e.controller && e.controller._destroy(), delete this._metasets[t];
  }
  _stop() {
    let t, e;
    for (this.stop(), dt.remove(this), t = 0, e = this.data.datasets.length; t < e; ++t)
      this._destroyDatasetMeta(t);
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    const { canvas: t, ctx: e } = this;
    this._stop(), this.config.clearCache(), t && (this.unbindEvents(), qi(t, e), this.platform.releaseContext(e), this.canvas = null, this.ctx = null), delete Le[this.id], this.notifyPlugins("afterDestroy");
  }
  toBase64Image(...t) {
    return this.canvas.toDataURL(...t);
  }
  bindEvents() {
    this.bindUserEvents(), this.options.responsive ? this.bindResponsiveEvents() : this.attached = !0;
  }
  bindUserEvents() {
    const t = this._listeners, e = this.platform, s = (o, r) => {
      e.addEventListener(this, o, r), t[o] = r;
    }, n = (o, r, a) => {
      o.offsetX = r, o.offsetY = a, this._eventHandler(o);
    };
    z(this.options.events, (o) => s(o, n));
  }
  bindResponsiveEvents() {
    this._responsiveListeners || (this._responsiveListeners = {});
    const t = this._responsiveListeners, e = this.platform, s = (l, c) => {
      e.addEventListener(this, l, c), t[l] = c;
    }, n = (l, c) => {
      t[l] && (e.removeEventListener(this, l, c), delete t[l]);
    }, o = (l, c) => {
      this.canvas && this.resize(l, c);
    };
    let r;
    const a = () => {
      n("attach", a), this.attached = !0, this.resize(), s("resize", o), s("detach", r);
    };
    r = () => {
      this.attached = !1, n("resize", o), this._stop(), this._resize(0, 0), s("attach", a);
    }, e.isAttached(this.canvas) ? a() : r();
  }
  unbindEvents() {
    z(this._listeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }), this._listeners = {}, z(this._responsiveListeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }), this._responsiveListeners = void 0;
  }
  updateHoverStyle(t, e, s) {
    const n = s ? "set" : "remove";
    let o, r, a, l;
    for (e === "dataset" && (o = this.getDatasetMeta(t[0].datasetIndex), o.controller["_" + n + "DatasetHoverStyle"]()), a = 0, l = t.length; a < l; ++a) {
      r = t[a];
      const c = r && this.getDatasetMeta(r.datasetIndex).controller;
      c && c[n + "HoverStyle"](r.element, r.datasetIndex, r.index);
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t) {
    const e = this._active || [], s = t.map(({ datasetIndex: o, index: r }) => {
      const a = this.getDatasetMeta(o);
      if (!a)
        throw new Error("No dataset found at index " + o);
      return {
        datasetIndex: o,
        element: a.data[r],
        index: r
      };
    });
    !Fe(s, e) && (this._active = s, this._lastEvent = null, this._updateHoverStyles(s, e));
  }
  notifyPlugins(t, e, s) {
    return this._plugins.notify(this, t, e, s);
  }
  isPluginEnabled(t) {
    return this._plugins._cache.filter((e) => e.plugin.id === t).length === 1;
  }
  _updateHoverStyles(t, e, s) {
    const n = this.options.hover, o = (l, c) => l.filter((h) => !c.some((d) => h.datasetIndex === d.datasetIndex && h.index === d.index)), r = o(e, t), a = s ? t : o(t, e);
    r.length && this.updateHoverStyle(r, n.mode, !1), a.length && n.mode && this.updateHoverStyle(a, n.mode, !0);
  }
  _eventHandler(t, e) {
    const s = {
      event: t,
      replay: e,
      cancelable: !0,
      inChartArea: this.isPointInArea(t)
    }, n = (r) => (r.options.events || this.options.events).includes(t.native.type);
    if (this.notifyPlugins("beforeEvent", s, n) === !1)
      return;
    const o = this._handleEvent(t, e, s.inChartArea);
    return s.cancelable = !1, this.notifyPlugins("afterEvent", s, n), (o || s.changed) && this.render(), this;
  }
  _handleEvent(t, e, s) {
    const { _active: n = [], options: o } = this, r = e, a = this._getActiveElements(t, n, s, r), l = So(t), c = pl(t, this._lastEvent, s, l);
    s && (this._lastEvent = null, B(o.onHover, [
      t,
      a,
      this
    ], this), l && B(o.onClick, [
      t,
      a,
      this
    ], this));
    const h = !Fe(a, n);
    return (h || e) && (this._active = a, this._updateHoverStyles(a, n, e)), this._lastEvent = c, h;
  }
  _getActiveElements(t, e, s, n) {
    if (t.type === "mouseout")
      return [];
    if (!s)
      return e;
    const o = this.options.hover;
    return this.getElementsAtEventForMode(t, o.mode, o, n);
  }
}, T(pt, "defaults", W), T(pt, "instances", Le), T(pt, "overrides", Lt), T(pt, "registry", at), T(pt, "version", dl), T(pt, "getChart", Ms), pt);
function Cs() {
  return z($e.instances, (i) => i._plugins.invalidate());
}
function Cn(i, t, e = t) {
  i.lineCap = I(e.borderCapStyle, t.borderCapStyle), i.setLineDash(I(e.borderDash, t.borderDash)), i.lineDashOffset = I(e.borderDashOffset, t.borderDashOffset), i.lineJoin = I(e.borderJoinStyle, t.borderJoinStyle), i.lineWidth = I(e.borderWidth, t.borderWidth), i.strokeStyle = I(e.borderColor, t.borderColor);
}
function ml(i, t, e) {
  i.lineTo(e.x, e.y);
}
function bl(i) {
  return i.stepped ? Jo : i.tension || i.cubicInterpolationMode === "monotone" ? tr : ml;
}
function Dn(i, t, e = {}) {
  const s = i.length, { start: n = 0, end: o = s - 1 } = e, { start: r, end: a } = t, l = Math.max(n, r), c = Math.min(o, a), h = n < r && o < r || n > a && o > a;
  return {
    count: s,
    start: l,
    loop: t.loop,
    ilen: c < l && !h ? s + c - l : c - l
  };
}
function _l(i, t, e, s) {
  const { points: n, options: o } = t, { count: r, start: a, loop: l, ilen: c } = Dn(n, e, s), h = bl(o);
  let { move: d = !0, reverse: u } = s || {}, f, m, g;
  for (f = 0; f <= c; ++f)
    m = n[(a + (u ? c - f : f)) % r], !m.skip && (d ? (i.moveTo(m.x, m.y), d = !1) : h(i, g, m, u, o.stepped), g = m);
  return l && (m = n[(a + (u ? c : 0)) % r], h(i, g, m, u, o.stepped)), !!l;
}
function xl(i, t, e, s) {
  const n = t.points, { count: o, start: r, ilen: a } = Dn(n, e, s), { move: l = !0, reverse: c } = s || {};
  let h = 0, d = 0, u, f, m, g, p, b;
  const y = (S) => (r + (c ? a - S : S)) % o, M = () => {
    g !== p && (i.lineTo(h, p), i.lineTo(h, g), i.lineTo(h, b));
  };
  for (l && (f = n[y(0)], i.moveTo(f.x, f.y)), u = 0; u <= a; ++u) {
    if (f = n[y(u)], f.skip)
      continue;
    const S = f.x, w = f.y, D = S | 0;
    D === m ? (w < g ? g = w : w > p && (p = w), h = (d * h + S) / ++d) : (M(), i.lineTo(S, w), m = D, d = 0, g = p = w), b = w;
  }
  M();
}
function ui(i) {
  const t = i.options, e = t.borderDash && t.borderDash.length;
  return !i._decimated && !i._loop && !t.tension && t.cubicInterpolationMode !== "monotone" && !t.stepped && !e ? xl : _l;
}
function yl(i) {
  return i.stepped ? Ir : i.tension || i.cubicInterpolationMode === "monotone" ? Fr : Ot;
}
function vl(i, t, e, s) {
  let n = t._path;
  n || (n = t._path = new Path2D(), t.path(n, e, s) && n.closePath()), Cn(i, t.options), i.stroke(n);
}
function wl(i, t, e, s) {
  const { segments: n, options: o } = t, r = ui(t);
  for (const a of n)
    Cn(i, o, a.style), i.beginPath(), r(i, t, a, {
      start: e,
      end: e + s - 1
    }) && i.closePath(), i.stroke();
}
const kl = typeof Path2D == "function";
function Sl(i, t, e, s) {
  kl && !t.options.segment ? vl(i, t, e, s) : wl(i, t, e, s);
}
class Jt extends gt {
  constructor(t) {
    super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, t && Object.assign(this, t);
  }
  updateControlPoints(t, e) {
    const s = this.options;
    if ((s.tension || s.cubicInterpolationMode === "monotone") && !s.stepped && !this._pointsUpdated) {
      const n = s.spanGaps ? this._loop : this._fullLoop;
      Mr(this._points, s, t, n, e), this._pointsUpdated = !0;
    }
  }
  set points(t) {
    this._points = t, delete this._segments, delete this._path, this._pointsUpdated = !1;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = Vr(this, this.options.segment));
  }
  first() {
    const t = this.segments, e = this.points;
    return t.length && e[t[0].start];
  }
  last() {
    const t = this.segments, e = this.points, s = t.length;
    return s && e[t[s - 1].end];
  }
  interpolate(t, e) {
    const s = this.options, n = t[e], o = this.points, r = Br(this, {
      property: e,
      start: n,
      end: n
    });
    if (!r.length)
      return;
    const a = [], l = yl(s);
    let c, h;
    for (c = 0, h = r.length; c < h; ++c) {
      const { start: d, end: u } = r[c], f = o[d], m = o[u];
      if (f === m) {
        a.push(f);
        continue;
      }
      const g = Math.abs((n - f[e]) / (m[e] - f[e])), p = l(f, m, g, s.stepped);
      p[e] = t[e], a.push(p);
    }
    return a.length === 1 ? a[0] : a;
  }
  pathSegment(t, e, s) {
    return ui(this)(t, this, e, s);
  }
  path(t, e, s) {
    const n = this.segments, o = ui(this);
    let r = this._loop;
    e = e || 0, s = s || this.points.length - e;
    for (const a of n)
      r &= o(t, this, a, {
        start: e,
        end: e + s - 1
      });
    return !!r;
  }
  draw(t, e, s, n) {
    const o = this.options || {};
    (this.points || []).length && o.borderWidth && (t.save(), Sl(t, this, s, n), t.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0);
  }
}
T(Jt, "id", "line"), T(Jt, "defaults", {
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: "miter",
  borderWidth: 3,
  capBezierPoints: !0,
  cubicInterpolationMode: "default",
  fill: !1,
  spanGaps: !1,
  stepped: !1,
  tension: 0
}), T(Jt, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
}), T(Jt, "descriptors", {
  _scriptable: !0,
  _indexable: (t) => t !== "borderDash" && t !== "fill"
});
function Ds(i, t, e, s) {
  const n = i.options, { [e]: o } = i.getProps([
    e
  ], s);
  return Math.abs(t - o) < n.radius + n.hitRadius;
}
class Ie extends gt {
  constructor(e) {
    super();
    T(this, "parsed");
    T(this, "skip");
    T(this, "stop");
    this.options = void 0, this.parsed = void 0, this.skip = void 0, this.stop = void 0, e && Object.assign(this, e);
  }
  inRange(e, s, n) {
    const o = this.options, { x: r, y: a } = this.getProps([
      "x",
      "y"
    ], n);
    return Math.pow(e - r, 2) + Math.pow(s - a, 2) < Math.pow(o.hitRadius + o.radius, 2);
  }
  inXRange(e, s) {
    return Ds(this, e, "x", s);
  }
  inYRange(e, s) {
    return Ds(this, e, "y", s);
  }
  getCenterPoint(e) {
    const { x: s, y: n } = this.getProps([
      "x",
      "y"
    ], e);
    return {
      x: s,
      y: n
    };
  }
  size(e) {
    e = e || this.options || {};
    let s = e.radius || 0;
    s = Math.max(s, s && e.hoverRadius || 0);
    const n = s && e.borderWidth || 0;
    return (s + n) * 2;
  }
  draw(e, s) {
    const n = this.options;
    this.skip || n.radius < 0.1 || !he(this, s, this.size(n) / 2) || (e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.fillStyle = n.backgroundColor, li(e, n, this.x, this.y));
  }
  getRange() {
    const e = this.options || {};
    return e.radius + e.hitRadius;
  }
}
T(Ie, "id", "point"), /**
* @type {any}
*/
T(Ie, "defaults", {
  borderWidth: 1,
  hitRadius: 1,
  hoverBorderWidth: 1,
  hoverRadius: 4,
  pointStyle: "circle",
  radius: 3,
  rotation: 0
}), /**
* @type {any}
*/
T(Ie, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
const Os = (i, t) => {
  let { boxHeight: e = t, boxWidth: s = t } = i;
  return i.usePointStyle && (e = Math.min(e, t), s = i.pointStyleWidth || Math.min(s, t)), {
    boxWidth: s,
    boxHeight: e,
    itemHeight: Math.max(t, e)
  };
}, Ml = (i, t) => i !== null && t !== null && i.datasetIndex === t.datasetIndex && i.index === t.index;
class Ps extends gt {
  constructor(t) {
    super(), this._added = !1, this.legendHitBoxes = [], this._hoveredItem = null, this.doughnutMode = !1, this.chart = t.chart, this.options = t.options, this.ctx = t.ctx, this.legendItems = void 0, this.columnSizes = void 0, this.lineWidths = void 0, this.maxHeight = void 0, this.maxWidth = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.height = void 0, this.width = void 0, this._margins = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0;
  }
  update(t, e, s) {
    this.maxWidth = t, this.maxHeight = e, this._margins = s, this.setDimensions(), this.buildLabels(), this.fit();
  }
  setDimensions() {
    this.isHorizontal() ? (this.width = this.maxWidth, this.left = this._margins.left, this.right = this.width) : (this.height = this.maxHeight, this.top = this._margins.top, this.bottom = this.height);
  }
  buildLabels() {
    const t = this.options.labels || {};
    let e = B(t.generateLabels, [
      this.chart
    ], this) || [];
    t.filter && (e = e.filter((s) => t.filter(s, this.chart.data))), t.sort && (e = e.sort((s, n) => t.sort(s, n, this.chart.data))), this.options.reverse && e.reverse(), this.legendItems = e;
  }
  fit() {
    const { options: t, ctx: e } = this;
    if (!t.display) {
      this.width = this.height = 0;
      return;
    }
    const s = t.labels, n = Y(s.font), o = n.size, r = this._computeTitleHeight(), { boxWidth: a, itemHeight: l } = Os(s, o);
    let c, h;
    e.font = n.string, this.isHorizontal() ? (c = this.maxWidth, h = this._fitRows(r, o, a, l) + 10) : (h = this.maxHeight, c = this._fitCols(r, n, a, l) + 10), this.width = Math.min(c, t.maxWidth || this.maxWidth), this.height = Math.min(h, t.maxHeight || this.maxHeight);
  }
  _fitRows(t, e, s, n) {
    const { ctx: o, maxWidth: r, options: { labels: { padding: a } } } = this, l = this.legendHitBoxes = [], c = this.lineWidths = [
      0
    ], h = n + a;
    let d = t;
    o.textAlign = "left", o.textBaseline = "middle";
    let u = -1, f = -h;
    return this.legendItems.forEach((m, g) => {
      const p = s + e / 2 + o.measureText(m.text).width;
      (g === 0 || c[c.length - 1] + p + 2 * a > r) && (d += h, c[c.length - (g > 0 ? 0 : 1)] = 0, f += h, u++), l[g] = {
        left: 0,
        top: f,
        row: u,
        width: p,
        height: n
      }, c[c.length - 1] += p + a;
    }), d;
  }
  _fitCols(t, e, s, n) {
    const { ctx: o, maxHeight: r, options: { labels: { padding: a } } } = this, l = this.legendHitBoxes = [], c = this.columnSizes = [], h = r - t;
    let d = a, u = 0, f = 0, m = 0, g = 0;
    return this.legendItems.forEach((p, b) => {
      const { itemWidth: y, itemHeight: M } = Cl(s, e, o, p, n);
      b > 0 && f + M + 2 * a > h && (d += u + a, c.push({
        width: u,
        height: f
      }), m += u + a, g++, u = f = 0), l[b] = {
        left: m,
        top: f,
        col: g,
        width: y,
        height: M
      }, u = Math.max(u, y), f += M + a;
    }), d += u, c.push({
      width: u,
      height: f
    }), d;
  }
  adjustHitBoxes() {
    if (!this.options.display)
      return;
    const t = this._computeTitleHeight(), { legendHitBoxes: e, options: { align: s, labels: { padding: n }, rtl: o } } = this, r = Ht(o, this.left, this.width);
    if (this.isHorizontal()) {
      let a = 0, l = U(s, this.left + n, this.right - this.lineWidths[a]);
      for (const c of e)
        a !== c.row && (a = c.row, l = U(s, this.left + n, this.right - this.lineWidths[a])), c.top += this.top + t + n, c.left = r.leftForLtr(r.x(l), c.width), l += c.width + n;
    } else {
      let a = 0, l = U(s, this.top + t + n, this.bottom - this.columnSizes[a].height);
      for (const c of e)
        c.col !== a && (a = c.col, l = U(s, this.top + t + n, this.bottom - this.columnSizes[a].height)), c.top = l, c.left += this.left + n, c.left = r.leftForLtr(r.x(c.left), c.width), l += c.height + n;
    }
  }
  isHorizontal() {
    return this.options.position === "top" || this.options.position === "bottom";
  }
  draw() {
    if (this.options.display) {
      const t = this.ctx;
      Si(t, this), this._draw(), Mi(t);
    }
  }
  _draw() {
    const { options: t, columnSizes: e, lineWidths: s, ctx: n } = this, { align: o, labels: r } = t, a = W.color, l = Ht(t.rtl, this.left, this.width), c = Y(r.font), { padding: h } = r, d = c.size, u = d / 2;
    let f;
    this.drawTitle(), n.textAlign = l.textAlign("left"), n.textBaseline = "middle", n.lineWidth = 0.5, n.font = c.string;
    const { boxWidth: m, boxHeight: g, itemHeight: p } = Os(r, d), b = function(D, O, C) {
      if (isNaN(m) || m <= 0 || isNaN(g) || g < 0)
        return;
      n.save();
      const x = I(C.lineWidth, 1);
      if (n.fillStyle = I(C.fillStyle, a), n.lineCap = I(C.lineCap, "butt"), n.lineDashOffset = I(C.lineDashOffset, 0), n.lineJoin = I(C.lineJoin, "miter"), n.lineWidth = x, n.strokeStyle = I(C.strokeStyle, a), n.setLineDash(I(C.lineDash, [])), r.usePointStyle) {
        const _ = {
          radius: g * Math.SQRT2 / 2,
          pointStyle: C.pointStyle,
          rotation: C.rotation,
          borderWidth: x
        }, P = l.xPlus(D, m / 2), k = O + u;
        on(n, _, P, k, r.pointStyleWidth && m);
      } else {
        const _ = O + Math.max((d - g) / 2, 0), P = l.leftForLtr(D, m), k = oe(C.borderRadius);
        n.beginPath(), Object.values(k).some((A) => A !== 0) ? ci(n, {
          x: P,
          y: _,
          w: m,
          h: g,
          radius: k
        }) : n.rect(P, _, m, g), n.fill(), x !== 0 && n.stroke();
      }
      n.restore();
    }, y = function(D, O, C) {
      de(n, C.text, D, O + p / 2, c, {
        strikethrough: C.hidden,
        textAlign: l.textAlign(C.textAlign)
      });
    }, M = this.isHorizontal(), S = this._computeTitleHeight();
    M ? f = {
      x: U(o, this.left + h, this.right - s[0]),
      y: this.top + h + S,
      line: 0
    } : f = {
      x: this.left + h,
      y: U(o, this.top + S + h, this.bottom - e[0].height),
      line: 0
    }, un(this.ctx, t.textDirection);
    const w = p + h;
    this.legendItems.forEach((D, O) => {
      n.strokeStyle = D.fontColor, n.fillStyle = D.fontColor;
      const C = n.measureText(D.text).width, x = l.textAlign(D.textAlign || (D.textAlign = r.textAlign)), _ = m + u + C;
      let P = f.x, k = f.y;
      l.setWidth(this.width), M ? O > 0 && P + _ + h > this.right && (k = f.y += w, f.line++, P = f.x = U(o, this.left + h, this.right - s[f.line])) : O > 0 && k + w > this.bottom && (P = f.x = P + e[f.line].width + h, f.line++, k = f.y = U(o, this.top + S + h, this.bottom - e[f.line].height));
      const A = l.x(P);
      if (b(A, k, D), P = No(x, P + m + u, M ? P + _ : this.right, t.rtl), y(l.x(P), k, D), M)
        f.x += _ + h;
      else if (typeof D.text != "string") {
        const R = c.lineHeight;
        f.y += On(D, R) + h;
      } else
        f.y += w;
    }), fn(this.ctx, t.textDirection);
  }
  drawTitle() {
    const t = this.options, e = t.title, s = Y(e.font), n = et(e.padding);
    if (!e.display)
      return;
    const o = Ht(t.rtl, this.left, this.width), r = this.ctx, a = e.position, l = s.size / 2, c = n.top + l;
    let h, d = this.left, u = this.width;
    if (this.isHorizontal())
      u = Math.max(...this.lineWidths), h = this.top + c, d = U(t.align, d, this.right - u);
    else {
      const m = this.columnSizes.reduce((g, p) => Math.max(g, p.height), 0);
      h = c + U(t.align, this.top, this.bottom - m - t.labels.padding - this._computeTitleHeight());
    }
    const f = U(a, d, d + u);
    r.textAlign = o.textAlign(wi(a)), r.textBaseline = "middle", r.strokeStyle = e.color, r.fillStyle = e.color, r.font = s.string, de(r, e.text, f, h, s);
  }
  _computeTitleHeight() {
    const t = this.options.title, e = Y(t.font), s = et(t.padding);
    return t.display ? e.lineHeight + s.height : 0;
  }
  _getLegendItemAt(t, e) {
    let s, n, o;
    if (Qt(t, this.left, this.right) && Qt(e, this.top, this.bottom)) {
      for (o = this.legendHitBoxes, s = 0; s < o.length; ++s)
        if (n = o[s], Qt(t, n.left, n.left + n.width) && Qt(e, n.top, n.top + n.height))
          return this.legendItems[s];
    }
    return null;
  }
  handleEvent(t) {
    const e = this.options;
    if (!Pl(t.type, e))
      return;
    const s = this._getLegendItemAt(t.x, t.y);
    if (t.type === "mousemove" || t.type === "mouseout") {
      const n = this._hoveredItem, o = Ml(n, s);
      n && !o && B(e.onLeave, [
        t,
        n,
        this
      ], this), this._hoveredItem = s, s && !o && B(e.onHover, [
        t,
        s,
        this
      ], this);
    } else s && B(e.onClick, [
      t,
      s,
      this
    ], this);
  }
}
function Cl(i, t, e, s, n) {
  const o = Dl(s, i, t, e), r = Ol(n, s, t.lineHeight);
  return {
    itemWidth: o,
    itemHeight: r
  };
}
function Dl(i, t, e, s) {
  let n = i.text;
  return n && typeof n != "string" && (n = n.reduce((o, r) => o.length > r.length ? o : r)), t + e.size / 2 + s.measureText(n).width;
}
function Ol(i, t, e) {
  let s = i;
  return typeof t.text != "string" && (s = On(t, e)), s;
}
function On(i, t) {
  const e = i.text ? i.text.length : 0;
  return t * e;
}
function Pl(i, t) {
  return !!((i === "mousemove" || i === "mouseout") && (t.onHover || t.onLeave) || t.onClick && (i === "click" || i === "mouseup"));
}
var Tl = {
  id: "legend",
  _element: Ps,
  start(i, t, e) {
    const s = i.legend = new Ps({
      ctx: i.ctx,
      options: e,
      chart: i
    });
    J.configure(i, s, e), J.addBox(i, s);
  },
  stop(i) {
    J.removeBox(i, i.legend), delete i.legend;
  },
  beforeUpdate(i, t, e) {
    const s = i.legend;
    J.configure(i, s, e), s.options = e;
  },
  afterUpdate(i) {
    const t = i.legend;
    t.buildLabels(), t.adjustHitBoxes();
  },
  afterEvent(i, t) {
    t.replay || i.legend.handleEvent(t.event);
  },
  defaults: {
    display: !0,
    position: "top",
    align: "center",
    fullSize: !0,
    reverse: !1,
    weight: 1e3,
    onClick(i, t, e) {
      const s = t.datasetIndex, n = e.chart;
      n.isDatasetVisible(s) ? (n.hide(s), t.hidden = !0) : (n.show(s), t.hidden = !1);
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: (i) => i.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(i) {
        const t = i.data.datasets, { labels: { usePointStyle: e, pointStyle: s, textAlign: n, color: o, useBorderRadius: r, borderRadius: a } } = i.legend.options;
        return i._getSortedDatasetMetas().map((l) => {
          const c = l.controller.getStyle(e ? 0 : void 0), h = et(c.borderWidth);
          return {
            text: t[l.index].label,
            fillStyle: c.backgroundColor,
            fontColor: o,
            hidden: !l.visible,
            lineCap: c.borderCapStyle,
            lineDash: c.borderDash,
            lineDashOffset: c.borderDashOffset,
            lineJoin: c.borderJoinStyle,
            lineWidth: (h.width + h.height) / 4,
            strokeStyle: c.borderColor,
            pointStyle: s || c.pointStyle,
            rotation: c.rotation,
            textAlign: n || c.textAlign,
            borderRadius: r && (a || c.borderRadius),
            datasetIndex: l.index
          };
        }, this);
      }
    },
    title: {
      color: (i) => i.chart.options.color,
      display: !1,
      position: "center",
      text: ""
    }
  },
  descriptors: {
    _scriptable: (i) => !i.startsWith("on"),
    labels: {
      _scriptable: (i) => ![
        "generateLabels",
        "filter",
        "sort"
      ].includes(i)
    }
  }
};
class Pn extends gt {
  constructor(t) {
    super(), this.chart = t.chart, this.options = t.options, this.ctx = t.ctx, this._padding = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0;
  }
  update(t, e) {
    const s = this.options;
    if (this.left = 0, this.top = 0, !s.display) {
      this.width = this.height = this.right = this.bottom = 0;
      return;
    }
    this.width = this.right = t, this.height = this.bottom = e;
    const n = V(s.text) ? s.text.length : 1;
    this._padding = et(s.padding);
    const o = n * Y(s.font).lineHeight + this._padding.height;
    this.isHorizontal() ? this.height = o : this.width = o;
  }
  isHorizontal() {
    const t = this.options.position;
    return t === "top" || t === "bottom";
  }
  _drawArgs(t) {
    const { top: e, left: s, bottom: n, right: o, options: r } = this, a = r.align;
    let l = 0, c, h, d;
    return this.isHorizontal() ? (h = U(a, s, o), d = e + t, c = o - s) : (r.position === "left" ? (h = s + t, d = U(a, n, e), l = j * -0.5) : (h = o - t, d = U(a, e, n), l = j * 0.5), c = n - e), {
      titleX: h,
      titleY: d,
      maxWidth: c,
      rotation: l
    };
  }
  draw() {
    const t = this.ctx, e = this.options;
    if (!e.display)
      return;
    const s = Y(e.font), o = s.lineHeight / 2 + this._padding.top, { titleX: r, titleY: a, maxWidth: l, rotation: c } = this._drawArgs(o);
    de(t, e.text, 0, 0, s, {
      color: e.color,
      maxWidth: l,
      rotation: c,
      textAlign: wi(e.align),
      textBaseline: "middle",
      translation: [
        r,
        a
      ]
    });
  }
}
function Al(i, t) {
  const e = new Pn({
    ctx: i.ctx,
    options: t,
    chart: i
  });
  J.configure(i, e, t), J.addBox(i, e), i.titleBlock = e;
}
var Ll = {
  id: "title",
  _element: Pn,
  start(i, t, e) {
    Al(i, e);
  },
  stop(i) {
    const t = i.titleBlock;
    J.removeBox(i, t), delete i.titleBlock;
  },
  beforeUpdate(i, t, e) {
    const s = i.titleBlock;
    J.configure(i, s, e), s.options = e;
  },
  defaults: {
    align: "center",
    display: !1,
    font: {
      weight: "bold"
    },
    fullSize: !0,
    padding: 10,
    position: "top",
    text: "",
    weight: 2e3
  },
  defaultRoutes: {
    color: "color"
  },
  descriptors: {
    _scriptable: !0,
    _indexable: !1
  }
};
const te = {
  average(i) {
    if (!i.length)
      return !1;
    let t, e, s = /* @__PURE__ */ new Set(), n = 0, o = 0;
    for (t = 0, e = i.length; t < e; ++t) {
      const a = i[t].element;
      if (a && a.hasValue()) {
        const l = a.tooltipPosition();
        s.add(l.x), n += l.y, ++o;
      }
    }
    return o === 0 || s.size === 0 ? !1 : {
      x: [
        ...s
      ].reduce((a, l) => a + l) / s.size,
      y: n / o
    };
  },
  nearest(i, t) {
    if (!i.length)
      return !1;
    let e = t.x, s = t.y, n = Number.POSITIVE_INFINITY, o, r, a;
    for (o = 0, r = i.length; o < r; ++o) {
      const l = i[o].element;
      if (l && l.hasValue()) {
        const c = l.getCenterPoint(), h = ri(t, c);
        h < n && (n = h, a = l);
      }
    }
    if (a) {
      const l = a.tooltipPosition();
      e = l.x, s = l.y;
    }
    return {
      x: e,
      y: s
    };
  }
};
function rt(i, t) {
  return t && (V(t) ? Array.prototype.push.apply(i, t) : i.push(t)), i;
}
function ut(i) {
  return (typeof i == "string" || i instanceof String) && i.indexOf(`
`) > -1 ? i.split(`
`) : i;
}
function Il(i, t) {
  const { element: e, datasetIndex: s, index: n } = t, o = i.getDatasetMeta(s).controller, { label: r, value: a } = o.getLabelAndValue(n);
  return {
    chart: i,
    label: r,
    parsed: o.getParsed(n),
    raw: i.data.datasets[s].data[n],
    formattedValue: a,
    dataset: o.getDataset(),
    dataIndex: n,
    datasetIndex: s,
    element: e
  };
}
function Ts(i, t) {
  const e = i.chart.ctx, { body: s, footer: n, title: o } = i, { boxWidth: r, boxHeight: a } = t, l = Y(t.bodyFont), c = Y(t.titleFont), h = Y(t.footerFont), d = o.length, u = n.length, f = s.length, m = et(t.padding);
  let g = m.height, p = 0, b = s.reduce((S, w) => S + w.before.length + w.lines.length + w.after.length, 0);
  if (b += i.beforeBody.length + i.afterBody.length, d && (g += d * c.lineHeight + (d - 1) * t.titleSpacing + t.titleMarginBottom), b) {
    const S = t.displayColors ? Math.max(a, l.lineHeight) : l.lineHeight;
    g += f * S + (b - f) * l.lineHeight + (b - 1) * t.bodySpacing;
  }
  u && (g += t.footerMarginTop + u * h.lineHeight + (u - 1) * t.footerSpacing);
  let y = 0;
  const M = function(S) {
    p = Math.max(p, e.measureText(S).width + y);
  };
  return e.save(), e.font = c.string, z(i.title, M), e.font = l.string, z(i.beforeBody.concat(i.afterBody), M), y = t.displayColors ? r + 2 + t.boxPadding : 0, z(s, (S) => {
    z(S.before, M), z(S.lines, M), z(S.after, M);
  }), y = 0, e.font = h.string, z(i.footer, M), e.restore(), p += m.width, {
    width: p,
    height: g
  };
}
function Fl(i, t) {
  const { y: e, height: s } = t;
  return e < s / 2 ? "top" : e > i.height - s / 2 ? "bottom" : "center";
}
function Rl(i, t, e, s) {
  const { x: n, width: o } = s, r = e.caretSize + e.caretPadding;
  if (i === "left" && n + o + r > t.width || i === "right" && n - o - r < 0)
    return !0;
}
function zl(i, t, e, s) {
  const { x: n, width: o } = e, { width: r, chartArea: { left: a, right: l } } = i;
  let c = "center";
  return s === "center" ? c = n <= (a + l) / 2 ? "left" : "right" : n <= o / 2 ? c = "left" : n >= r - o / 2 && (c = "right"), Rl(c, i, t, e) && (c = "center"), c;
}
function As(i, t, e) {
  const s = e.yAlign || t.yAlign || Fl(i, e);
  return {
    xAlign: e.xAlign || t.xAlign || zl(i, t, e, s),
    yAlign: s
  };
}
function El(i, t) {
  let { x: e, width: s } = i;
  return t === "right" ? e -= s : t === "center" && (e -= s / 2), e;
}
function Hl(i, t, e) {
  let { y: s, height: n } = i;
  return t === "top" ? s += e : t === "bottom" ? s -= n + e : s -= n / 2, s;
}
function Ls(i, t, e, s) {
  const { caretSize: n, caretPadding: o, cornerRadius: r } = i, { xAlign: a, yAlign: l } = e, c = n + o, { topLeft: h, topRight: d, bottomLeft: u, bottomRight: f } = oe(r);
  let m = El(t, a);
  const g = Hl(t, l, c);
  return l === "center" ? a === "left" ? m += c : a === "right" && (m -= c) : a === "left" ? m -= Math.max(h, u) + n : a === "right" && (m += Math.max(d, f) + n), {
    x: Z(m, 0, s.width - t.width),
    y: Z(g, 0, s.height - t.height)
  };
}
function De(i, t, e) {
  const s = et(e.padding);
  return t === "center" ? i.x + i.width / 2 : t === "right" ? i.x + i.width - s.right : i.x + s.left;
}
function Is(i) {
  return rt([], ut(i));
}
function Bl(i, t, e) {
  return It(i, {
    tooltip: t,
    tooltipItems: e,
    type: "tooltip"
  });
}
function Fs(i, t) {
  const e = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
  return e ? i.override(e) : i;
}
const Tn = {
  beforeTitle: ht,
  title(i) {
    if (i.length > 0) {
      const t = i[0], e = t.chart.data.labels, s = e ? e.length : 0;
      if (this && this.options && this.options.mode === "dataset")
        return t.dataset.label || "";
      if (t.label)
        return t.label;
      if (s > 0 && t.dataIndex < s)
        return e[t.dataIndex];
    }
    return "";
  },
  afterTitle: ht,
  beforeBody: ht,
  beforeLabel: ht,
  label(i) {
    if (this && this.options && this.options.mode === "dataset")
      return i.label + ": " + i.formattedValue || i.formattedValue;
    let t = i.dataset.label || "";
    t && (t += ": ");
    const e = i.formattedValue;
    return E(e) || (t += e), t;
  },
  labelColor(i) {
    const e = i.chart.getDatasetMeta(i.datasetIndex).controller.getStyle(i.dataIndex);
    return {
      borderColor: e.borderColor,
      backgroundColor: e.backgroundColor,
      borderWidth: e.borderWidth,
      borderDash: e.borderDash,
      borderDashOffset: e.borderDashOffset,
      borderRadius: 0
    };
  },
  labelTextColor() {
    return this.options.bodyColor;
  },
  labelPointStyle(i) {
    const e = i.chart.getDatasetMeta(i.datasetIndex).controller.getStyle(i.dataIndex);
    return {
      pointStyle: e.pointStyle,
      rotation: e.rotation
    };
  },
  afterLabel: ht,
  afterBody: ht,
  beforeFooter: ht,
  footer: ht,
  afterFooter: ht
};
function G(i, t, e, s) {
  const n = i[t].call(e, s);
  return typeof n > "u" ? Tn[t].call(e, s) : n;
}
class fi extends gt {
  constructor(t) {
    super(), this.opacity = 0, this._active = [], this._eventPosition = void 0, this._size = void 0, this._cachedAnimations = void 0, this._tooltipItems = [], this.$animations = void 0, this.$context = void 0, this.chart = t.chart, this.options = t.options, this.dataPoints = void 0, this.title = void 0, this.beforeBody = void 0, this.body = void 0, this.afterBody = void 0, this.footer = void 0, this.xAlign = void 0, this.yAlign = void 0, this.x = void 0, this.y = void 0, this.height = void 0, this.width = void 0, this.caretX = void 0, this.caretY = void 0, this.labelColors = void 0, this.labelPointStyles = void 0, this.labelTextColors = void 0;
  }
  initialize(t) {
    this.options = t, this._cachedAnimations = void 0, this.$context = void 0;
  }
  _resolveAnimations() {
    const t = this._cachedAnimations;
    if (t)
      return t;
    const e = this.chart, s = this.options.setContext(this.getContext()), n = s.enabled && e.options.animation && s.animations, o = new pn(this.chart, n);
    return n._cacheable && (this._cachedAnimations = Object.freeze(o)), o;
  }
  getContext() {
    return this.$context || (this.$context = Bl(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(t, e) {
    const { callbacks: s } = e, n = G(s, "beforeTitle", this, t), o = G(s, "title", this, t), r = G(s, "afterTitle", this, t);
    let a = [];
    return a = rt(a, ut(n)), a = rt(a, ut(o)), a = rt(a, ut(r)), a;
  }
  getBeforeBody(t, e) {
    return Is(G(e.callbacks, "beforeBody", this, t));
  }
  getBody(t, e) {
    const { callbacks: s } = e, n = [];
    return z(t, (o) => {
      const r = {
        before: [],
        lines: [],
        after: []
      }, a = Fs(s, o);
      rt(r.before, ut(G(a, "beforeLabel", this, o))), rt(r.lines, G(a, "label", this, o)), rt(r.after, ut(G(a, "afterLabel", this, o))), n.push(r);
    }), n;
  }
  getAfterBody(t, e) {
    return Is(G(e.callbacks, "afterBody", this, t));
  }
  getFooter(t, e) {
    const { callbacks: s } = e, n = G(s, "beforeFooter", this, t), o = G(s, "footer", this, t), r = G(s, "afterFooter", this, t);
    let a = [];
    return a = rt(a, ut(n)), a = rt(a, ut(o)), a = rt(a, ut(r)), a;
  }
  _createItems(t) {
    const e = this._active, s = this.chart.data, n = [], o = [], r = [];
    let a = [], l, c;
    for (l = 0, c = e.length; l < c; ++l)
      a.push(Il(this.chart, e[l]));
    return t.filter && (a = a.filter((h, d, u) => t.filter(h, d, u, s))), t.itemSort && (a = a.sort((h, d) => t.itemSort(h, d, s))), z(a, (h) => {
      const d = Fs(t.callbacks, h);
      n.push(G(d, "labelColor", this, h)), o.push(G(d, "labelPointStyle", this, h)), r.push(G(d, "labelTextColor", this, h));
    }), this.labelColors = n, this.labelPointStyles = o, this.labelTextColors = r, this.dataPoints = a, a;
  }
  update(t, e) {
    const s = this.options.setContext(this.getContext()), n = this._active;
    let o, r = [];
    if (!n.length)
      this.opacity !== 0 && (o = {
        opacity: 0
      });
    else {
      const a = te[s.position].call(this, n, this._eventPosition);
      r = this._createItems(s), this.title = this.getTitle(r, s), this.beforeBody = this.getBeforeBody(r, s), this.body = this.getBody(r, s), this.afterBody = this.getAfterBody(r, s), this.footer = this.getFooter(r, s);
      const l = this._size = Ts(this, s), c = Object.assign({}, a, l), h = As(this.chart, s, c), d = Ls(s, c, h, this.chart);
      this.xAlign = h.xAlign, this.yAlign = h.yAlign, o = {
        opacity: 1,
        x: d.x,
        y: d.y,
        width: l.width,
        height: l.height,
        caretX: a.x,
        caretY: a.y
      };
    }
    this._tooltipItems = r, this.$context = void 0, o && this._resolveAnimations().update(this, o), t && s.external && s.external.call(this, {
      chart: this.chart,
      tooltip: this,
      replay: e
    });
  }
  drawCaret(t, e, s, n) {
    const o = this.getCaretPosition(t, s, n);
    e.lineTo(o.x1, o.y1), e.lineTo(o.x2, o.y2), e.lineTo(o.x3, o.y3);
  }
  getCaretPosition(t, e, s) {
    const { xAlign: n, yAlign: o } = this, { caretSize: r, cornerRadius: a } = s, { topLeft: l, topRight: c, bottomLeft: h, bottomRight: d } = oe(a), { x: u, y: f } = t, { width: m, height: g } = e;
    let p, b, y, M, S, w;
    return o === "center" ? (S = f + g / 2, n === "left" ? (p = u, b = p - r, M = S + r, w = S - r) : (p = u + m, b = p + r, M = S - r, w = S + r), y = p) : (n === "left" ? b = u + Math.max(l, h) + r : n === "right" ? b = u + m - Math.max(c, d) - r : b = this.caretX, o === "top" ? (M = f, S = M - r, p = b - r, y = b + r) : (M = f + g, S = M + r, p = b + r, y = b - r), w = M), {
      x1: p,
      x2: b,
      x3: y,
      y1: M,
      y2: S,
      y3: w
    };
  }
  drawTitle(t, e, s) {
    const n = this.title, o = n.length;
    let r, a, l;
    if (o) {
      const c = Ht(s.rtl, this.x, this.width);
      for (t.x = De(this, s.titleAlign, s), e.textAlign = c.textAlign(s.titleAlign), e.textBaseline = "middle", r = Y(s.titleFont), a = s.titleSpacing, e.fillStyle = s.titleColor, e.font = r.string, l = 0; l < o; ++l)
        e.fillText(n[l], c.x(t.x), t.y + r.lineHeight / 2), t.y += r.lineHeight + a, l + 1 === o && (t.y += s.titleMarginBottom - a);
    }
  }
  _drawColorBox(t, e, s, n, o) {
    const r = this.labelColors[s], a = this.labelPointStyles[s], { boxHeight: l, boxWidth: c } = o, h = Y(o.bodyFont), d = De(this, "left", o), u = n.x(d), f = l < h.lineHeight ? (h.lineHeight - l) / 2 : 0, m = e.y + f;
    if (o.usePointStyle) {
      const g = {
        radius: Math.min(c, l) / 2,
        pointStyle: a.pointStyle,
        rotation: a.rotation,
        borderWidth: 1
      }, p = n.leftForLtr(u, c) + c / 2, b = m + l / 2;
      t.strokeStyle = o.multiKeyBackground, t.fillStyle = o.multiKeyBackground, li(t, g, p, b), t.strokeStyle = r.borderColor, t.fillStyle = r.backgroundColor, li(t, g, p, b);
    } else {
      t.lineWidth = F(r.borderWidth) ? Math.max(...Object.values(r.borderWidth)) : r.borderWidth || 1, t.strokeStyle = r.borderColor, t.setLineDash(r.borderDash || []), t.lineDashOffset = r.borderDashOffset || 0;
      const g = n.leftForLtr(u, c), p = n.leftForLtr(n.xPlus(u, 1), c - 2), b = oe(r.borderRadius);
      Object.values(b).some((y) => y !== 0) ? (t.beginPath(), t.fillStyle = o.multiKeyBackground, ci(t, {
        x: g,
        y: m,
        w: c,
        h: l,
        radius: b
      }), t.fill(), t.stroke(), t.fillStyle = r.backgroundColor, t.beginPath(), ci(t, {
        x: p,
        y: m + 1,
        w: c - 2,
        h: l - 2,
        radius: b
      }), t.fill()) : (t.fillStyle = o.multiKeyBackground, t.fillRect(g, m, c, l), t.strokeRect(g, m, c, l), t.fillStyle = r.backgroundColor, t.fillRect(p, m + 1, c - 2, l - 2));
    }
    t.fillStyle = this.labelTextColors[s];
  }
  drawBody(t, e, s) {
    const { body: n } = this, { bodySpacing: o, bodyAlign: r, displayColors: a, boxHeight: l, boxWidth: c, boxPadding: h } = s, d = Y(s.bodyFont);
    let u = d.lineHeight, f = 0;
    const m = Ht(s.rtl, this.x, this.width), g = function(C) {
      e.fillText(C, m.x(t.x + f), t.y + u / 2), t.y += u + o;
    }, p = m.textAlign(r);
    let b, y, M, S, w, D, O;
    for (e.textAlign = r, e.textBaseline = "middle", e.font = d.string, t.x = De(this, p, s), e.fillStyle = s.bodyColor, z(this.beforeBody, g), f = a && p !== "right" ? r === "center" ? c / 2 + h : c + 2 + h : 0, S = 0, D = n.length; S < D; ++S) {
      for (b = n[S], y = this.labelTextColors[S], e.fillStyle = y, z(b.before, g), M = b.lines, a && M.length && (this._drawColorBox(e, t, S, m, s), u = Math.max(d.lineHeight, l)), w = 0, O = M.length; w < O; ++w)
        g(M[w]), u = d.lineHeight;
      z(b.after, g);
    }
    f = 0, u = d.lineHeight, z(this.afterBody, g), t.y -= o;
  }
  drawFooter(t, e, s) {
    const n = this.footer, o = n.length;
    let r, a;
    if (o) {
      const l = Ht(s.rtl, this.x, this.width);
      for (t.x = De(this, s.footerAlign, s), t.y += s.footerMarginTop, e.textAlign = l.textAlign(s.footerAlign), e.textBaseline = "middle", r = Y(s.footerFont), e.fillStyle = s.footerColor, e.font = r.string, a = 0; a < o; ++a)
        e.fillText(n[a], l.x(t.x), t.y + r.lineHeight / 2), t.y += r.lineHeight + s.footerSpacing;
    }
  }
  drawBackground(t, e, s, n) {
    const { xAlign: o, yAlign: r } = this, { x: a, y: l } = t, { width: c, height: h } = s, { topLeft: d, topRight: u, bottomLeft: f, bottomRight: m } = oe(n.cornerRadius);
    e.fillStyle = n.backgroundColor, e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.beginPath(), e.moveTo(a + d, l), r === "top" && this.drawCaret(t, e, s, n), e.lineTo(a + c - u, l), e.quadraticCurveTo(a + c, l, a + c, l + u), r === "center" && o === "right" && this.drawCaret(t, e, s, n), e.lineTo(a + c, l + h - m), e.quadraticCurveTo(a + c, l + h, a + c - m, l + h), r === "bottom" && this.drawCaret(t, e, s, n), e.lineTo(a + f, l + h), e.quadraticCurveTo(a, l + h, a, l + h - f), r === "center" && o === "left" && this.drawCaret(t, e, s, n), e.lineTo(a, l + d), e.quadraticCurveTo(a, l, a + d, l), e.closePath(), e.fill(), n.borderWidth > 0 && e.stroke();
  }
  _updateAnimationTarget(t) {
    const e = this.chart, s = this.$animations, n = s && s.x, o = s && s.y;
    if (n || o) {
      const r = te[t.position].call(this, this._active, this._eventPosition);
      if (!r)
        return;
      const a = this._size = Ts(this, t), l = Object.assign({}, r, this._size), c = As(e, t, l), h = Ls(t, l, c, e);
      (n._to !== h.x || o._to !== h.y) && (this.xAlign = c.xAlign, this.yAlign = c.yAlign, this.width = a.width, this.height = a.height, this.caretX = r.x, this.caretY = r.y, this._resolveAnimations().update(this, h));
    }
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(t) {
    const e = this.options.setContext(this.getContext());
    let s = this.opacity;
    if (!s)
      return;
    this._updateAnimationTarget(e);
    const n = {
      width: this.width,
      height: this.height
    }, o = {
      x: this.x,
      y: this.y
    };
    s = Math.abs(s) < 1e-3 ? 0 : s;
    const r = et(e.padding), a = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    e.enabled && a && (t.save(), t.globalAlpha = s, this.drawBackground(o, t, n, e), un(t, e.textDirection), o.y += r.top, this.drawTitle(o, t, e), this.drawBody(o, t, e), this.drawFooter(o, t, e), fn(t, e.textDirection), t.restore());
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t, e) {
    const s = this._active, n = t.map(({ datasetIndex: a, index: l }) => {
      const c = this.chart.getDatasetMeta(a);
      if (!c)
        throw new Error("Cannot find a dataset at index " + a);
      return {
        datasetIndex: a,
        element: c.data[l],
        index: l
      };
    }), o = !Fe(s, n), r = this._positionChanged(n, e);
    (o || r) && (this._active = n, this._eventPosition = e, this._ignoreReplayEvents = !0, this.update(!0));
  }
  handleEvent(t, e, s = !0) {
    if (e && this._ignoreReplayEvents)
      return !1;
    this._ignoreReplayEvents = !1;
    const n = this.options, o = this._active || [], r = this._getActiveElements(t, o, e, s), a = this._positionChanged(r, t), l = e || !Fe(r, o) || a;
    return l && (this._active = r, (n.enabled || n.external) && (this._eventPosition = {
      x: t.x,
      y: t.y
    }, this.update(!0, e))), l;
  }
  _getActiveElements(t, e, s, n) {
    const o = this.options;
    if (t.type === "mouseout")
      return [];
    if (!n)
      return e.filter((a) => this.chart.data.datasets[a.datasetIndex] && this.chart.getDatasetMeta(a.datasetIndex).controller.getParsed(a.index) !== void 0);
    const r = this.chart.getElementsAtEventForMode(t, o.mode, o, s);
    return o.reverse && r.reverse(), r;
  }
  _positionChanged(t, e) {
    const { caretX: s, caretY: n, options: o } = this, r = te[o.position].call(this, t, e);
    return r !== !1 && (s !== r.x || n !== r.y);
  }
}
T(fi, "positioners", te);
var Nl = {
  id: "tooltip",
  _element: fi,
  positioners: te,
  afterInit(i, t, e) {
    e && (i.tooltip = new fi({
      chart: i,
      options: e
    }));
  },
  beforeUpdate(i, t, e) {
    i.tooltip && i.tooltip.initialize(e);
  },
  reset(i, t, e) {
    i.tooltip && i.tooltip.initialize(e);
  },
  afterDraw(i) {
    const t = i.tooltip;
    if (t && t._willRender()) {
      const e = {
        tooltip: t
      };
      if (i.notifyPlugins("beforeTooltipDraw", {
        ...e,
        cancelable: !0
      }) === !1)
        return;
      t.draw(i.ctx), i.notifyPlugins("afterTooltipDraw", e);
    }
  },
  afterEvent(i, t) {
    if (i.tooltip) {
      const e = t.replay;
      i.tooltip.handleEvent(t.event, e, t.inChartArea) && (t.changed = !0);
    }
  },
  defaults: {
    enabled: !0,
    external: null,
    position: "average",
    backgroundColor: "rgba(0,0,0,0.8)",
    titleColor: "#fff",
    titleFont: {
      weight: "bold"
    },
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleAlign: "left",
    bodyColor: "#fff",
    bodySpacing: 2,
    bodyFont: {},
    bodyAlign: "left",
    footerColor: "#fff",
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFont: {
      weight: "bold"
    },
    footerAlign: "left",
    padding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    boxHeight: (i, t) => t.bodyFont.size,
    boxWidth: (i, t) => t.bodyFont.size,
    multiKeyBackground: "#fff",
    displayColors: !0,
    boxPadding: 0,
    borderColor: "rgba(0,0,0,0)",
    borderWidth: 0,
    animation: {
      duration: 400,
      easing: "easeOutQuart"
    },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "width",
          "height",
          "caretX",
          "caretY"
        ]
      },
      opacity: {
        easing: "linear",
        duration: 200
      }
    },
    callbacks: Tn
  },
  defaultRoutes: {
    bodyFont: "font",
    footerFont: "font",
    titleFont: "font"
  },
  descriptors: {
    _scriptable: (i) => i !== "filter" && i !== "itemSort" && i !== "external",
    _indexable: !1,
    callbacks: {
      _scriptable: !1,
      _indexable: !1
    },
    animation: {
      _fallback: !1
    },
    animations: {
      _fallback: "animation"
    }
  },
  additionalOptionScopes: [
    "interaction"
  ]
};
const Wl = (i, t, e, s) => (typeof t == "string" ? (e = i.push(t) - 1, s.unshift({
  index: e,
  label: t
})) : isNaN(t) && (e = null), e);
function Vl(i, t, e, s) {
  const n = i.indexOf(t);
  if (n === -1)
    return Wl(i, t, e, s);
  const o = i.lastIndexOf(t);
  return n !== o ? e : n;
}
const jl = (i, t) => i === null ? null : Z(Math.round(i), 0, t);
function Rs(i) {
  const t = this.getLabels();
  return i >= 0 && i < t.length ? t[i] : i;
}
class gi extends Vt {
  constructor(t) {
    super(t), this._startValue = void 0, this._valueRange = 0, this._addedLabels = [];
  }
  init(t) {
    const e = this._addedLabels;
    if (e.length) {
      const s = this.getLabels();
      for (const { index: n, label: o } of e)
        s[n] === o && s.splice(n, 1);
      this._addedLabels = [];
    }
    super.init(t);
  }
  parse(t, e) {
    if (E(t))
      return null;
    const s = this.getLabels();
    return e = isFinite(e) && s[e] === t ? e : Vl(s, t, I(e, t), this._addedLabels), jl(e, s.length - 1);
  }
  determineDataLimits() {
    const { minDefined: t, maxDefined: e } = this.getUserBounds();
    let { min: s, max: n } = this.getMinMax(!0);
    this.options.bounds === "ticks" && (t || (s = 0), e || (n = this.getLabels().length - 1)), this.min = s, this.max = n;
  }
  buildTicks() {
    const t = this.min, e = this.max, s = this.options.offset, n = [];
    let o = this.getLabels();
    o = t === 0 && e === o.length - 1 ? o : o.slice(t, e + 1), this._valueRange = Math.max(o.length - (s ? 0 : 1), 1), this._startValue = this.min - (s ? 0.5 : 0);
    for (let r = t; r <= e; r++)
      n.push({
        value: r
      });
    return n;
  }
  getLabelForValue(t) {
    return Rs.call(this, t);
  }
  configure() {
    super.configure(), this.isHorizontal() || (this._reversePixels = !this._reversePixels);
  }
  getPixelForValue(t) {
    return typeof t != "number" && (t = this.parse(t)), t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getPixelForTick(t) {
    const e = this.ticks;
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value);
  }
  getValueForPixel(t) {
    return Math.round(this._startValue + this.getDecimalForPixel(t) * this._valueRange);
  }
  getBasePixel() {
    return this.bottom;
  }
}
T(gi, "id", "category"), T(gi, "defaults", {
  ticks: {
    callback: Rs
  }
});
function $l(i, t) {
  const e = [], { bounds: n, step: o, min: r, max: a, precision: l, count: c, maxTicks: h, maxDigits: d, includeBounds: u } = i, f = o || 1, m = h - 1, { min: g, max: p } = t, b = !E(r), y = !E(a), M = !E(c), S = (p - g) / (d + 1);
  let w = Ni((p - g) / m / f) * f, D, O, C, x;
  if (w < 1e-14 && !b && !y)
    return [
      {
        value: g
      },
      {
        value: p
      }
    ];
  x = Math.ceil(p / w) - Math.floor(g / w), x > m && (w = Ni(x * w / m / f) * f), E(l) || (D = Math.pow(10, l), w = Math.ceil(w * D) / D), n === "ticks" ? (O = Math.floor(g / w) * w, C = Math.ceil(p / w) * w) : (O = g, C = p), b && y && o && Po((a - r) / o, w / 1e3) ? (x = Math.round(Math.min((a - r) / w, h)), w = (a - r) / x, O = r, C = a) : M ? (O = b ? r : O, C = y ? a : C, x = c - 1, w = (C - O) / x) : (x = (C - O) / w, ie(x, Math.round(x), w / 1e3) ? x = Math.round(x) : x = Math.ceil(x));
  const _ = Math.max(Wi(w), Wi(O));
  D = Math.pow(10, E(l) ? _ : l), O = Math.round(O * D) / D, C = Math.round(C * D) / D;
  let P = 0;
  for (b && (u && O !== r ? (e.push({
    value: r
  }), O < r && P++, ie(Math.round((O + P * w) * D) / D, r, zs(r, S, i)) && P++) : O < r && P++); P < x; ++P) {
    const k = Math.round((O + P * w) * D) / D;
    if (y && k > a)
      break;
    e.push({
      value: k
    });
  }
  return y && u && C !== a ? e.length && ie(e[e.length - 1].value, a, zs(a, S, i)) ? e[e.length - 1].value = a : e.push({
    value: a
  }) : (!y || C === a) && e.push({
    value: C
  }), e;
}
function zs(i, t, { horizontal: e, minRotation: s }) {
  const n = Pt(s), o = (e ? Math.sin(n) : Math.cos(n)) || 1e-3, r = 0.75 * t * ("" + i).length;
  return Math.min(t / o, r);
}
class Ul extends Vt {
  constructor(t) {
    super(t), this.start = void 0, this.end = void 0, this._startValue = void 0, this._endValue = void 0, this._valueRange = 0;
  }
  parse(t, e) {
    return E(t) || (typeof t == "number" || t instanceof Number) && !isFinite(+t) ? null : +t;
  }
  handleTickRangeOptions() {
    const { beginAtZero: t } = this.options, { minDefined: e, maxDefined: s } = this.getUserBounds();
    let { min: n, max: o } = this;
    const r = (l) => n = e ? n : l, a = (l) => o = s ? o : l;
    if (t) {
      const l = Bt(n), c = Bt(o);
      l < 0 && c < 0 ? a(0) : l > 0 && c > 0 && r(0);
    }
    if (n === o) {
      let l = o === 0 ? 1 : Math.abs(o * 0.05);
      a(o + l), t || r(n - l);
    }
    this.min = n, this.max = o;
  }
  getTickLimit() {
    const t = this.options.ticks;
    let { maxTicksLimit: e, stepSize: s } = t, n;
    return s ? (n = Math.ceil(this.max / s) - Math.floor(this.min / s) + 1, n > 1e3 && (console.warn(`scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${n} ticks. Limiting to 1000.`), n = 1e3)) : (n = this.computeTickLimit(), e = e || 11), e && (n = Math.min(e, n)), n;
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    const t = this.options, e = t.ticks;
    let s = this.getTickLimit();
    s = Math.max(2, s);
    const n = {
      maxTicks: s,
      bounds: t.bounds,
      min: t.min,
      max: t.max,
      precision: e.precision,
      step: e.stepSize,
      count: e.count,
      maxDigits: this._maxDigits(),
      horizontal: this.isHorizontal(),
      minRotation: e.minRotation || 0,
      includeBounds: e.includeBounds !== !1
    }, o = this._range || this, r = $l(n, o);
    return t.bounds === "ticks" && To(r, this, "value"), t.reverse ? (r.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), r;
  }
  configure() {
    const t = this.ticks;
    let e = this.min, s = this.max;
    if (super.configure(), this.options.offset && t.length) {
      const n = (s - e) / Math.max(t.length - 1, 1) / 2;
      e -= n, s += n;
    }
    this._startValue = e, this._endValue = s, this._valueRange = s - e;
  }
  getLabelForValue(t) {
    return sn(t, this.chart.options.locale, this.options.ticks.format);
  }
}
class pi extends Ul {
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!0);
    this.min = tt(t) ? t : 0, this.max = tt(e) ? e : 1, this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const t = this.isHorizontal(), e = t ? this.width : this.height, s = Pt(this.options.ticks.minRotation), n = (t ? Math.sin(s) : Math.cos(s)) || 1e-3, o = this._resolveTickFontOptions(0);
    return Math.ceil(e / Math.min(40, o.lineHeight / n));
  }
  getPixelForValue(t) {
    return t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getValueForPixel(t) {
    return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
  }
}
T(pi, "id", "linear"), T(pi, "defaults", {
  ticks: {
    callback: nn.formatters.numeric
  }
});
const Ue = {
  millisecond: {
    common: !0,
    size: 1,
    steps: 1e3
  },
  second: {
    common: !0,
    size: 1e3,
    steps: 60
  },
  minute: {
    common: !0,
    size: 6e4,
    steps: 60
  },
  hour: {
    common: !0,
    size: 36e5,
    steps: 24
  },
  day: {
    common: !0,
    size: 864e5,
    steps: 30
  },
  week: {
    common: !1,
    size: 6048e5,
    steps: 4
  },
  month: {
    common: !0,
    size: 2628e6,
    steps: 12
  },
  quarter: {
    common: !1,
    size: 7884e6,
    steps: 4
  },
  year: {
    common: !0,
    size: 3154e7
  }
}, q = /* @__PURE__ */ Object.keys(Ue);
function Es(i, t) {
  return i - t;
}
function Hs(i, t) {
  if (E(t))
    return null;
  const e = i._adapter, { parser: s, round: n, isoWeekday: o } = i._parseOpts;
  let r = t;
  return typeof s == "function" && (r = s(r)), tt(r) || (r = typeof s == "string" ? e.parse(r, s) : e.parse(r)), r === null ? null : (n && (r = n === "week" && (ce(o) || o === !0) ? e.startOf(r, "isoWeek", o) : e.startOf(r, n)), +r);
}
function Bs(i, t, e, s) {
  const n = q.length;
  for (let o = q.indexOf(i); o < n - 1; ++o) {
    const r = Ue[q[o]], a = r.steps ? r.steps : Number.MAX_SAFE_INTEGER;
    if (r.common && Math.ceil((e - t) / (a * r.size)) <= s)
      return q[o];
  }
  return q[n - 1];
}
function Yl(i, t, e, s, n) {
  for (let o = q.length - 1; o >= q.indexOf(e); o--) {
    const r = q[o];
    if (Ue[r].common && i._adapter.diff(n, s, r) >= t - 1)
      return r;
  }
  return q[e ? q.indexOf(e) : 0];
}
function Gl(i) {
  for (let t = q.indexOf(i) + 1, e = q.length; t < e; ++t)
    if (Ue[q[t]].common)
      return q[t];
}
function Ns(i, t, e) {
  if (!e)
    i[t] = !0;
  else if (e.length) {
    const { lo: s, hi: n } = vi(e, t), o = e[s] >= t ? e[s] : e[n];
    i[o] = !0;
  }
}
function ql(i, t, e, s) {
  const n = i._adapter, o = +n.startOf(t[0].value, s), r = t[t.length - 1].value;
  let a, l;
  for (a = o; a <= r; a = +n.add(a, 1, s))
    l = e[a], l >= 0 && (t[l].major = !0);
  return t;
}
function Ws(i, t, e) {
  const s = [], n = {}, o = t.length;
  let r, a;
  for (r = 0; r < o; ++r)
    a = t[r], n[a] = r, s.push({
      value: a,
      major: !1
    });
  return o === 0 || !e ? s : ql(i, s, n, e);
}
class We extends Vt {
  constructor(t) {
    super(t), this._cache = {
      data: [],
      labels: [],
      all: []
    }, this._unit = "day", this._majorUnit = void 0, this._offsets = {}, this._normalized = !1, this._parseOpts = void 0;
  }
  init(t, e = {}) {
    const s = t.time || (t.time = {}), n = this._adapter = new aa._date(t.adapters.date);
    n.init(e), ee(s.displayFormats, n.formats()), this._parseOpts = {
      parser: s.parser,
      round: s.round,
      isoWeekday: s.isoWeekday
    }, super.init(t), this._normalized = e.normalized;
  }
  parse(t, e) {
    return t === void 0 ? null : Hs(this, t);
  }
  beforeLayout() {
    super.beforeLayout(), this._cache = {
      data: [],
      labels: [],
      all: []
    };
  }
  determineDataLimits() {
    const t = this.options, e = this._adapter, s = t.time.unit || "day";
    let { min: n, max: o, minDefined: r, maxDefined: a } = this.getUserBounds();
    function l(c) {
      !r && !isNaN(c.min) && (n = Math.min(n, c.min)), !a && !isNaN(c.max) && (o = Math.max(o, c.max));
    }
    (!r || !a) && (l(this._getLabelBounds()), (t.bounds !== "ticks" || t.ticks.source !== "labels") && l(this.getMinMax(!1))), n = tt(n) && !isNaN(n) ? n : +e.startOf(Date.now(), s), o = tt(o) && !isNaN(o) ? o : +e.endOf(Date.now(), s) + 1, this.min = Math.min(n, o - 1), this.max = Math.max(n + 1, o);
  }
  _getLabelBounds() {
    const t = this.getLabelTimestamps();
    let e = Number.POSITIVE_INFINITY, s = Number.NEGATIVE_INFINITY;
    return t.length && (e = t[0], s = t[t.length - 1]), {
      min: e,
      max: s
    };
  }
  buildTicks() {
    const t = this.options, e = t.time, s = t.ticks, n = s.source === "labels" ? this.getLabelTimestamps() : this._generate();
    t.bounds === "ticks" && n.length && (this.min = this._userMin || n[0], this.max = this._userMax || n[n.length - 1]);
    const o = this.min, r = this.max, a = zo(n, o, r);
    return this._unit = e.unit || (s.autoSkip ? Bs(e.minUnit, this.min, this.max, this._getLabelCapacity(o)) : Yl(this, a.length, e.minUnit, this.min, this.max)), this._majorUnit = !s.major.enabled || this._unit === "year" ? void 0 : Gl(this._unit), this.initOffsets(n), t.reverse && a.reverse(), Ws(this, a, this._majorUnit);
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((t) => +t.value));
  }
  initOffsets(t = []) {
    let e = 0, s = 0, n, o;
    this.options.offset && t.length && (n = this.getDecimalForValue(t[0]), t.length === 1 ? e = 1 - n : e = (this.getDecimalForValue(t[1]) - n) / 2, o = this.getDecimalForValue(t[t.length - 1]), t.length === 1 ? s = o : s = (o - this.getDecimalForValue(t[t.length - 2])) / 2);
    const r = t.length < 3 ? 0.5 : 0.25;
    e = Z(e, 0, r), s = Z(s, 0, r), this._offsets = {
      start: e,
      end: s,
      factor: 1 / (e + 1 + s)
    };
  }
  _generate() {
    const t = this._adapter, e = this.min, s = this.max, n = this.options, o = n.time, r = o.unit || Bs(o.minUnit, e, s, this._getLabelCapacity(e)), a = I(n.ticks.stepSize, 1), l = r === "week" ? o.isoWeekday : !1, c = ce(l) || l === !0, h = {};
    let d = e, u, f;
    if (c && (d = +t.startOf(d, "isoWeek", l)), d = +t.startOf(d, c ? "day" : r), t.diff(s, e, r) > 1e5 * a)
      throw new Error(e + " and " + s + " are too far apart with stepSize of " + a + " " + r);
    const m = n.ticks.source === "data" && this.getDataTimestamps();
    for (u = d, f = 0; u < s; u = +t.add(u, a, r), f++)
      Ns(h, u, m);
    return (u === s || n.bounds === "ticks" || f === 1) && Ns(h, u, m), Object.keys(h).sort(Es).map((g) => +g);
  }
  getLabelForValue(t) {
    const e = this._adapter, s = this.options.time;
    return s.tooltipFormat ? e.format(t, s.tooltipFormat) : e.format(t, s.displayFormats.datetime);
  }
  format(t, e) {
    const n = this.options.time.displayFormats, o = this._unit, r = e || n[o];
    return this._adapter.format(t, r);
  }
  _tickFormatFunction(t, e, s, n) {
    const o = this.options, r = o.ticks.callback;
    if (r)
      return B(r, [
        t,
        e,
        s
      ], this);
    const a = o.time.displayFormats, l = this._unit, c = this._majorUnit, h = l && a[l], d = c && a[c], u = s[e], f = c && d && u && u.major;
    return this._adapter.format(t, n || (f ? d : h));
  }
  generateTickLabels(t) {
    let e, s, n;
    for (e = 0, s = t.length; e < s; ++e)
      n = t[e], n.label = this._tickFormatFunction(n.value, e, t);
  }
  getDecimalForValue(t) {
    return t === null ? NaN : (t - this.min) / (this.max - this.min);
  }
  getPixelForValue(t) {
    const e = this._offsets, s = this.getDecimalForValue(t);
    return this.getPixelForDecimal((e.start + s) * e.factor);
  }
  getValueForPixel(t) {
    const e = this._offsets, s = this.getDecimalForPixel(t) / e.factor - e.end;
    return this.min + s * (this.max - this.min);
  }
  _getLabelSize(t) {
    const e = this.options.ticks, s = this.ctx.measureText(t).width, n = Pt(this.isHorizontal() ? e.maxRotation : e.minRotation), o = Math.cos(n), r = Math.sin(n), a = this._resolveTickFontOptions(0).size;
    return {
      w: s * o + a * r,
      h: s * r + a * o
    };
  }
  _getLabelCapacity(t) {
    const e = this.options.time, s = e.displayFormats, n = s[e.unit] || s.millisecond, o = this._tickFormatFunction(t, 0, Ws(this, [
      t
    ], this._majorUnit), n), r = this._getLabelSize(o), a = Math.floor(this.isHorizontal() ? this.width / r.w : this.height / r.h) - 1;
    return a > 0 ? a : 1;
  }
  getDataTimestamps() {
    let t = this._cache.data || [], e, s;
    if (t.length)
      return t;
    const n = this.getMatchingVisibleMetas();
    if (this._normalized && n.length)
      return this._cache.data = n[0].controller.getAllParsedValues(this);
    for (e = 0, s = n.length; e < s; ++e)
      t = t.concat(n[e].controller.getAllParsedValues(this));
    return this._cache.data = this.normalize(t);
  }
  getLabelTimestamps() {
    const t = this._cache.labels || [];
    let e, s;
    if (t.length)
      return t;
    const n = this.getLabels();
    for (e = 0, s = n.length; e < s; ++e)
      t.push(Hs(this, n[e]));
    return this._cache.labels = this._normalized ? t : this.normalize(t);
  }
  normalize(t) {
    return Ho(t.sort(Es));
  }
}
T(We, "id", "time"), T(We, "defaults", {
  bounds: "data",
  adapters: {},
  time: {
    parser: !1,
    unit: !1,
    round: !1,
    isoWeekday: !1,
    minUnit: "millisecond",
    displayFormats: {}
  },
  ticks: {
    source: "auto",
    callback: !1,
    major: {
      enabled: !1
    }
  }
});
function Oe(i, t, e) {
  let s = 0, n = i.length - 1, o, r, a, l;
  e ? (t >= i[s].pos && t <= i[n].pos && ({ lo: s, hi: n } = Tt(i, "pos", t)), { pos: o, time: a } = i[s], { pos: r, time: l } = i[n]) : (t >= i[s].time && t <= i[n].time && ({ lo: s, hi: n } = Tt(i, "time", t)), { time: o, pos: a } = i[s], { time: r, pos: l } = i[n]);
  const c = r - o;
  return c ? a + (l - a) * (t - o) / c : a;
}
class Vs extends We {
  constructor(t) {
    super(t), this._table = [], this._minPos = void 0, this._tableRange = void 0;
  }
  initOffsets() {
    const t = this._getTimestampsForTable(), e = this._table = this.buildLookupTable(t);
    this._minPos = Oe(e, this.min), this._tableRange = Oe(e, this.max) - this._minPos, super.initOffsets(t);
  }
  buildLookupTable(t) {
    const { min: e, max: s } = this, n = [], o = [];
    let r, a, l, c, h;
    for (r = 0, a = t.length; r < a; ++r)
      c = t[r], c >= e && c <= s && n.push(c);
    if (n.length < 2)
      return [
        {
          time: e,
          pos: 0
        },
        {
          time: s,
          pos: 1
        }
      ];
    for (r = 0, a = n.length; r < a; ++r)
      h = n[r + 1], l = n[r - 1], c = n[r], Math.round((h + l) / 2) !== c && o.push({
        time: c,
        pos: r / (a - 1)
      });
    return o;
  }
  _generate() {
    const t = this.min, e = this.max;
    let s = super.getDataTimestamps();
    return (!s.includes(t) || !s.length) && s.splice(0, 0, t), (!s.includes(e) || s.length === 1) && s.push(e), s.sort((n, o) => n - o);
  }
  _getTimestampsForTable() {
    let t = this._cache.all || [];
    if (t.length)
      return t;
    const e = this.getDataTimestamps(), s = this.getLabelTimestamps();
    return e.length && s.length ? t = this.normalize(e.concat(s)) : t = e.length ? e : s, t = this._cache.all = t, t;
  }
  getDecimalForValue(t) {
    return (Oe(this._table, t) - this._minPos) / this._tableRange;
  }
  getValueForPixel(t) {
    const e = this._offsets, s = this.getDecimalForPixel(t) / e.factor - e.end;
    return Oe(this._table, s * this._tableRange + this._minPos, !0);
  }
}
T(Vs, "id", "timeseries"), T(Vs, "defaults", We.defaults);
const An = {
  data: {
    type: Object,
    required: !0
  },
  options: {
    type: Object,
    default: () => ({})
  },
  plugins: {
    type: Array,
    default: () => []
  },
  datasetIdKey: {
    type: String,
    default: "label"
  },
  updateMode: {
    type: String,
    default: void 0
  }
}, Xl = {
  ariaLabel: {
    type: String
  },
  ariaDescribedby: {
    type: String
  }
}, Kl = {
  type: {
    type: String,
    required: !0
  },
  destroyDelay: {
    type: Number,
    default: 0
    // No delay by default
  },
  ...An,
  ...Xl
}, Ql = Bn[0] === "2" ? (i, t) => Object.assign(i, {
  attrs: t
}) : (i, t) => Object.assign(i, t);
function Et(i) {
  return Ys(i) ? si(i) : i;
}
function Zl(i) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : i;
  return Ys(t) ? new Proxy(i, {}) : i;
}
function Jl(i, t) {
  const e = i.options;
  e && t && Object.assign(e, t);
}
function Ln(i, t) {
  i.labels = t;
}
function In(i, t, e) {
  const s = [];
  i.datasets = t.map((n) => {
    const o = i.datasets.find((r) => r[e] === n[e]);
    return !o || !n.data || s.includes(o) ? {
      ...n
    } : (s.push(o), Object.assign(o, n), o);
  });
}
function tc(i, t) {
  const e = {
    labels: [],
    datasets: []
  };
  return Ln(e, i.labels), In(e, i.datasets, t), e;
}
const ec = mi({
  props: Kl,
  setup(i, t) {
    let { expose: e, slots: s } = t;
    const n = Pe(null), o = $s(null);
    e({
      chart: o
    });
    const r = () => {
      if (!n.value) return;
      const { type: c, data: h, options: d, plugins: u, datasetIdKey: f } = i, m = tc(h, f), g = Zl(m, h);
      o.value = new $e(n.value, {
        type: c,
        data: g,
        options: {
          ...d
        },
        plugins: u
      });
    }, a = () => {
      const c = si(o.value);
      c && (i.destroyDelay > 0 ? setTimeout(() => {
        c.destroy(), o.value = null;
      }, i.destroyDelay) : (c.destroy(), o.value = null));
    }, l = (c) => {
      c.update(i.updateMode);
    };
    return Us(r), zn(a), En([
      () => i.options,
      () => i.data
    ], (c, h) => {
      let [d, u] = c, [f, m] = h;
      const g = si(o.value);
      if (!g)
        return;
      let p = !1;
      if (d) {
        const b = Et(d), y = Et(f);
        b && b !== y && (Jl(g, b), p = !0);
      }
      if (u) {
        const b = Et(u.labels), y = Et(m.labels), M = Et(u.datasets), S = Et(m.datasets);
        b !== y && (Ln(g.config.data, b), p = !0), M && M !== S && (In(g.config.data, M, i.datasetIdKey), p = !0);
      }
      p && Hn(() => {
        l(g);
      });
    }, {
      deep: !0
    }), () => ii("canvas", {
      role: "img",
      ariaLabel: i.ariaLabel,
      ariaDescribedby: i.ariaDescribedby,
      ref: n
    }, [
      ii("p", {}, [
        s.default ? s.default() : ""
      ])
    ]);
  }
});
function ic(i, t) {
  return $e.register(t), mi({
    props: An,
    setup(e, s) {
      let { expose: n } = s;
      const o = $s(null), r = (a) => {
        o.value = a == null ? void 0 : a.chart;
      };
      return n({
        chart: o
      }), () => ii(ec, Ql({
        ref: r
      }, {
        type: i,
        ...e
      }));
    }
  });
}
const sc = /* @__PURE__ */ ic("line", Te), nc = { class: "dashboard-container" }, oc = {
  key: 0,
  class: "loading"
}, rc = {
  key: 1,
  class: "error"
}, ac = { key: 2 }, lc = { class: "metric-block" }, cc = {
  key: 0,
  class: "metric-row all-accounts-row"
}, hc = { class: "row-content" }, dc = { class: "metric-column" }, uc = { class: "metric-value" }, fc = { class: "metric-value" }, gc = { class: "metric-column" }, pc = { class: "metric-value" }, mc = { class: "metric-value" }, bc = { class: "row-header-button-container" }, _c = ["onClick"], xc = ["onClick"], yc = { class: "row-content" }, vc = { class: "metric-column" }, wc = { class: "metric-label-with-icon" }, kc = ["onClick"], Sc = { class: "metric-value" }, Mc = { class: "metric-value" }, Cc = { class: "metric-column" }, Dc = { class: "metric-label-with-icon" }, Oc = ["onClick"], Pc = { class: "metric-value" }, Tc = { class: "metric-value" }, Ac = {
  key: 0,
  class: "graph-section"
}, Lc = {
  key: 0,
  class: "graph-loading"
}, Ic = {
  key: 1,
  class: "graph-error"
}, Fc = {
  key: 2,
  class: "chart-section"
}, Rc = { class: "chart-container" }, zc = {
  key: 3,
  class: "graph-empty"
}, Ec = {
  key: 1,
  class: "calculation-breakdown"
}, Hc = { class: "breakdown-columns" }, Bc = { class: "breakdown-stage stage-1" }, Nc = { class: "stage-item" }, Wc = { class: "item-value" }, Vc = { class: "formula" }, jc = { class: "stage-item" }, $c = { class: "item-value" }, Uc = { class: "formula" }, Yc = { class: "stage-item" }, Gc = { class: "item-value" }, qc = { class: "formula" }, Xc = { class: "stage-item" }, Kc = { class: "item-value" }, Qc = { class: "formula" }, Zc = { class: "breakdown-stage stage-2" }, Jc = { class: "stage-item" }, th = { class: "item-value" }, eh = { class: "formula" }, ih = { class: "stage-item" }, sh = { class: "item-value" }, nh = { class: "formula" }, oh = { class: "stage-item" }, rh = { class: "item-value" }, ah = { class: "formula" }, lh = { class: "stage-item" }, ch = { class: "item-value" }, hh = { class: "formula" }, dh = /* @__PURE__ */ mi({
  __name: "Margin",
  setup(i) {
    $e.register(
      gi,
      pi,
      Ie,
      Jt,
      Ll,
      Nl,
      Tl
    );
    const t = qn(1e4), e = Li({}), s = Li({}), n = Pe(null), o = Pe(null), r = Pe(null);
    function a() {
      return new URLSearchParams(window.location.search).get("all_cts_clientId");
    }
    function l(x) {
      if (!x) return null;
      const _ = x.match(/Client\s*(\d+)/i);
      return _ ? parseInt(_[1]) : null;
    }
    Us(() => {
      r.value = a(), window.addEventListener("popstate", () => {
        r.value = a();
      });
    });
    const c = Un(), h = ni({
      queryKey: nt(() => ["nlvHistory", n.value]),
      queryFn: async () => {
        if (!n.value) return [];
        console.log("🔍 Querying NLV history for account:", n.value);
        const { data: x, error: _ } = await c.schema("hf").from("netliquidation").select("internal_account_id, fetched_at, nlv").eq("internal_account_id", n.value).gte("fetched_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString()).order("fetched_at", { ascending: !0 });
        if (_)
          throw console.error("❌ NLV history query error:", _), _;
        return console.log("✅ NLV history query success:", x == null ? void 0 : x.length, "records"), x || [];
      },
      staleTime: 6e4,
      enabled: nt(() => !!n.value && o.value === "nlv")
    }), d = ni({
      queryKey: nt(() => ["maintenanceHistory", n.value]),
      queryFn: async () => {
        if (!n.value) return [];
        console.log("🔍 Querying Maintenance Margin history for account:", n.value);
        const { data: x, error: _ } = await c.schema("hf").from("maintenance_margin").select("internal_account_id, fetched_at, maintenance").eq("internal_account_id", n.value).gte("fetched_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString()).order("fetched_at", { ascending: !0 });
        if (_)
          throw console.error("❌ Maintenance Margin history query error:", _), _;
        return console.log("✅ Maintenance Margin history query success:", x == null ? void 0 : x.length, "records"), x || [];
      },
      staleTime: 6e4,
      enabled: nt(() => !!n.value && o.value === "mm")
    });
    function u(x) {
      return x == null ? "$0" : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(x);
    }
    function f(x, _) {
      console.log("🔄 Toggle graph called:", { accountId: x, type: _ }), s[x] || (s[x] = { nlv: !1, mm: !1 });
      const P = s[x][_];
      Object.keys(s).forEach((k) => {
        const A = parseInt(k);
        s[A] && (s[A].nlv = !1, s[A].mm = !1);
      }), s[x][_] = !P, s[x][_] ? (console.log("📊 Setting selected account for history:", x, "type:", _), n.value = x, o.value = _) : (console.log("❌ Clearing selected account for history"), n.value = null, o.value = null), console.log("📈 Graph visibility state:", s), console.log("🎯 Selected account for history:", n.value, "type:", o.value);
    }
    const m = nt(() => o.value === "nlv" ? h : o.value === "mm" ? d : null), g = nt(() => {
      var R;
      const x = m.value;
      if (!((R = x == null ? void 0 : x.data.value) != null && R.length)) return null;
      const _ = x.data.value, P = _.map((L) => new Date(L.fetched_at).toLocaleDateString()), k = o.value === "nlv", A = _.map((L) => k ? L.nlv : L.maintenance);
      return {
        labels: P,
        datasets: [
          {
            label: k ? "Net Liquidation Value" : "Maintenance Margin",
            data: A,
            borderColor: k ? "#3b82f6" : "#f59e0b",
            backgroundColor: k ? "rgba(59, 130, 246, 0.1)" : "rgba(245, 158, 11, 0.1)",
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.1,
            fill: !0
          }
        ]
      };
    }), p = nt(() => ({
      responsive: !0,
      maintainAspectRatio: !1,
      plugins: {
        legend: {
          display: !0,
          position: "top"
        },
        title: {
          display: !1
        },
        tooltip: {
          callbacks: {
            label: function(x) {
              return u(x.parsed.y);
            }
          }
        }
      },
      scales: {
        x: {
          display: !0,
          title: {
            display: !0,
            text: "Date"
          }
        },
        y: {
          display: !0,
          title: {
            display: !0,
            text: "Value"
          },
          ticks: {
            callback: function(x) {
              return u(x);
            }
          }
        }
      }
    }));
    function b(x, _, P) {
      const k = 1 - P, A = 1 - _, L = 1 - k * A;
      return x / L;
    }
    const y = nt(() => t.data.value ? t.data.value.map((x) => {
      const _ = b(x.nlv_val, 0.3, 0.15), P = b(x.nlv_val, 0.3, 0.1), k = _ * 30 / 100, A = P * 30 / 100, R = k - x.maintenance_val, L = A - x.maintenance_val, N = R * 100 / 30, $ = L * 100 / 30;
      return {
        ...x,
        maxGmvNlvSide: _,
        maxGmvMaintenanceSide: P,
        mkNlvSide: k,
        mkMaintenanceSide: A,
        maintnanceMarginHeadroomNlvSide: R,
        maintnanceMarginHeadroomMaintenanceSide: L,
        addlGmvAllowedNlvSide: N,
        addlGmvAllowedMaintenanceSide: $
      };
    }) : []), M = nt(() => {
      if (!r.value || !y.value)
        return y.value;
      const x = l(r.value);
      if (x === null)
        return y.value;
      const _ = x - 1;
      return _ >= 0 && _ < y.value.length ? [y.value[_]] : y.value;
    }), S = nt(() => {
      if (!y.value) return null;
      const x = y.value.reduce((A, R) => A + (R.nlv_val || 0), 0), _ = y.value.reduce((A, R) => A + (R.maintenance_val || 0), 0), P = y.value.reduce((A, R) => A + (R.addlGmvAllowedNlvSide || 0), 0), k = y.value.reduce((A, R) => A + (R.addlGmvAllowedMaintenanceSide || 0), 0);
      return {
        totalNlv: x,
        totalMaintenance: _,
        totalAddlGmvToStopReducing: P,
        totalAddlGmvToStartReducing: k
      };
    });
    function w(x) {
      e[x] = !e[x];
    }
    const D = js("eventBus");
    function O(x) {
      var A;
      const P = (((A = y.value) == null ? void 0 : A.findIndex((R) => R.nlv_internal_account_id === x)) ?? -1) + 1, k = new URL(window.location.href);
      k.searchParams.set("all_cts_clientId", "Client " + P.toString()), window.history.replaceState({}, "", k.toString()), r.value = "Client " + P.toString(), D == null || D.emit("client-id-changed", {
        clientId: "Client " + P.toString(),
        accountId: x
      });
    }
    function C() {
      const x = new URL(window.location.href);
      x.searchParams.delete("all_cts_clientId"), window.history.replaceState({}, "", x.toString()), r.value = null, D == null || D.emit("client-id-changed", {
        clientId: null,
        accountId: null
      });
    }
    return Nn(() => {
      t._cleanup && t._cleanup();
    }), (x, _) => {
      var P;
      return K(), X("div", nc, [
        Rt(t).isLoading.value ? (K(), X("div", oc, [..._[0] || (_[0] = [
          v("div", { class: "loading-spinner" }, null, -1),
          v("p", null, "Loading the latest metrics...", -1)
        ])])) : Rt(t).isError.value ? (K(), X("div", rc, [
          _[1] || (_[1] = v("h2", null, "Error Loading Data", -1)),
          _[2] || (_[2] = v("p", null, "An error occurred while fetching the metrics:", -1)),
          v("pre", null, H(Rt(t).error.value), 1)
        ])) : Rt(t).isSuccess.value ? (K(), X("div", ac, [
          v("div", lc, [
            _[24] || (_[24] = v("div", { class: "block-header" }, [
              v("h2", null, "Summary")
            ], -1)),
            S.value ? (K(), X("div", cc, [
              v("div", {
                class: "row-header",
                onClick: C
              }, "All Accounts (" + H(((P = Rt(t).data.value) == null ? void 0 : P.length) || 0) + ")", 1),
              v("div", hc, [
                v("div", dc, [
                  _[3] || (_[3] = v("div", { class: "metric-label" }, "Net liquidation value", -1)),
                  v("div", uc, H(u(S.value.totalNlv)), 1),
                  _[4] || (_[4] = v("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  v("div", fc, H(u(S.value.totalAddlGmvToStopReducing)), 1)
                ]),
                v("div", gc, [
                  _[5] || (_[5] = v("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  v("div", pc, H(u(S.value.totalMaintenance)), 1),
                  _[6] || (_[6] = v("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  v("div", mc, H(u(S.value.totalAddlGmvToStartReducing)), 1)
                ])
              ])
            ])) : ge("", !0),
            (K(!0), X(Wn, null, Vn(M.value, (k, A) => {
              var R, L, N, $, yt, vt, ct;
              return K(), X("div", {
                key: `client-${k.nlv_internal_account_id}-${k.nlv_id}`,
                class: "metric-row"
              }, [
                v("div", bc, [
                  v("div", {
                    class: "row-header",
                    onClick: (st) => O(k.nlv_internal_account_id)
                  }, " Client" + H(((R = y.value) == null ? void 0 : R.findIndex((st) => st.nlv_internal_account_id === k.nlv_internal_account_id)) + 1), 9, _c),
                  v("button", {
                    class: Ye(["row-status", k.addlGmvAllowedNlvSide < 0 && k.addlGmvAllowedMaintenanceSide < 0 ? "stage-2-exhausted" : k.addlGmvAllowedNlvSide < 0 ? "stage-1-exhausted" : "ok"]),
                    onClick: (st) => w(k.nlv_id)
                  }, H(k.addlGmvAllowedNlvSide < 0 && k.addlGmvAllowedMaintenanceSide < 0 ? "Stage 2 exhausted" : k.addlGmvAllowedNlvSide < 0 ? "Stage 1 exhausted" : "OK"), 11, xc)
                ]),
                v("div", yc, [
                  v("div", vc, [
                    v("div", wc, [
                      _[8] || (_[8] = v("span", { class: "metric-label" }, "NLV", -1)),
                      v("button", {
                        class: Ye(["graph-icon", { active: (L = s[k.nlv_internal_accountId]) == null ? void 0 : L.nlv }]),
                        onClick: (st) => f(k.nlv_internal_account_id, "nlv")
                      }, [..._[7] || (_[7] = [
                        v("svg", {
                          width: "16",
                          height: "16",
                          viewBox: "0 0 24 24",
                          fill: "currentColor"
                        }, [
                          v("path", { d: "M3 13h4v8H3v-8zm6-10h4v18H9V3zm6 6h4v12h-4V9z" })
                        ], -1)
                      ])], 10, kc)
                    ]),
                    v("div", Sc, H(u(k.nlv_val)), 1),
                    _[9] || (_[9] = v("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                    v("div", Mc, H(u(k.addlGmvAllowedNlvSide)), 1)
                  ]),
                  v("div", Cc, [
                    v("div", Dc, [
                      _[11] || (_[11] = v("span", { class: "metric-label" }, "Maintenance margin", -1)),
                      v("button", {
                        class: Ye(["graph-icon", { active: (N = s[k.nlv_internal_accountId]) == null ? void 0 : N.mm }]),
                        onClick: (st) => f(k.nlv_internal_account_id, "mm")
                      }, [..._[10] || (_[10] = [
                        v("svg", {
                          width: "16",
                          height: "16",
                          viewBox: "0 0 24 24",
                          fill: "currentColor"
                        }, [
                          v("path", { d: "M3 13h4v8H3v-8zm6-10h4v18H9V3zm6 6h4v12h-4V9z" })
                        ], -1)
                      ])], 10, Oc)
                    ]),
                    v("div", Pc, H(u(k.maintenance_val)), 1),
                    _[12] || (_[12] = v("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                    v("div", Tc, H(u(k.addlGmvAllowedMaintenanceSide)), 1)
                  ])
                ]),
                ($ = s[k.nlv_internal_account_id]) != null && $.nlv || (yt = s[k.nlv_internal_account_id]) != null && yt.mm ? (K(), X("div", Ac, [
                  (vt = m.value) != null && vt.isLoading.value ? (K(), X("div", Lc, " Loading " + H(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data... ", 1)) : (ct = m.value) != null && ct.isError.value ? (K(), X("div", Ic, " Error loading " + H(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data: " + H(m.value.error.value), 1)) : g.value ? (K(), X("div", Fc, [
                    v("h4", null, H(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " History ", 1),
                    v("div", Rc, [
                      jn(Rt(sc), {
                        data: g.value,
                        options: p.value,
                        height: 300
                      }, null, 8, ["data", "options"])
                    ])
                  ])) : (K(), X("div", zc, " No " + H(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data available ", 1))
                ])) : ge("", !0),
                e[k.nlv_id] ? (K(), X("div", Ec, [
                  _[23] || (_[23] = v("div", { class: "breakdown-header" }, [
                    v("div", null, "Calculation breakdown:"),
                    v("div", null, "Assumptions: maintenance margin (m) = 30%")
                  ], -1)),
                  v("div", Hc, [
                    v("div", Bc, [
                      _[17] || (_[17] = v("div", { class: "stage-header" }, "Stage-1 (drop d = 15%)", -1)),
                      v("div", Nc, [
                        _[13] || (_[13] = v("div", { class: "item-label" }, "Max GMV that survives stop-adding threshold", -1)),
                        v("div", Wc, [
                          v("span", Vc, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + H(u(k.maxGmvNlvSide)), 1)
                        ])
                      ]),
                      v("div", jc, [
                        _[14] || (_[14] = v("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                        v("div", $c, [
                          v("span", Uc, "Mk = Gmax x m = " + H(u(k.mkNlvSide)), 1)
                        ])
                      ]),
                      v("div", Yc, [
                        _[15] || (_[15] = v("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                        v("div", Gc, [
                          v("span", qc, "Mk - M = " + H(u(k.maintnanceMarginHeadroomNlvSide)), 1)
                        ])
                      ]),
                      v("div", Xc, [
                        _[16] || (_[16] = v("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                        v("div", Kc, [
                          v("span", Qc, "(Mk - M) / m = " + H(u(k.addlGmvAllowedNlvSide)), 1)
                        ])
                      ])
                    ]),
                    v("div", Zc, [
                      _[22] || (_[22] = v("div", { class: "stage-header" }, "Stage-2 (drop d = 10%)", -1)),
                      v("div", Jc, [
                        _[18] || (_[18] = v("div", { class: "item-label" }, "Max GMV that survives start-reducing threshold", -1)),
                        v("div", th, [
                          v("span", eh, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + H(u(k.maxGmvMaintenanceSide)), 1)
                        ])
                      ]),
                      v("div", ih, [
                        _[19] || (_[19] = v("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                        v("div", sh, [
                          v("span", nh, "Mk = Gmax x m = " + H(u(k.mkMaintenanceSide)), 1)
                        ])
                      ]),
                      v("div", oh, [
                        _[20] || (_[20] = v("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                        v("div", rh, [
                          v("span", ah, "Mk - M = " + H(u(k.maintnanceMarginHeadroomMaintenanceSide)), 1)
                        ])
                      ]),
                      v("div", lh, [
                        _[21] || (_[21] = v("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                        v("div", ch, [
                          v("span", hh, "(Mk - M) / m = " + H(u(k.addlGmvAllowedMaintenanceSide)), 1)
                        ])
                      ])
                    ])
                  ])
                ])) : ge("", !0)
              ]);
            }), 128))
          ])
        ])) : ge("", !0)
      ]);
    };
  }
}), uh = (i, t) => {
  const e = i.__vccOpts || i;
  for (const [s, n] of t)
    e[s] = n;
  return e;
}, _h = /* @__PURE__ */ uh(dh, [["__scopeId", "data-v-881194f4"]]);
export {
  _h as Margin,
  _h as default
};
