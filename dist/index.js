var Rn = Object.defineProperty;
var zn = (i, t, e) => t in i ? Rn(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var A = (i, t, e) => zn(i, typeof t != "symbol" ? t + "" : t, e);
import { inject as $s, defineComponent as mi, shallowRef as Us, h as ii, ref as Pe, onMounted as Ys, onUnmounted as En, watch as Hn, toRaw as si, nextTick as Bn, version as Nn, isProxy as Gs, reactive as Li, computed as nt, onBeforeUnmount as Wn, resolveComponent as Vn, createElementBlock as X, openBlock as K, createCommentVNode as ge, unref as Rt, createElementVNode as v, toDisplayString as H, createVNode as Ii, withCtx as jn, createTextVNode as $n, Fragment as Un, renderList as Yn, normalizeClass as Ye } from "vue";
import { useQueryClient as Gn, useQuery as ni } from "@tanstack/vue-query";
import { useSupabase as qn } from "@y2kfund/core";
const Xn = Symbol.for("y2kfund.supabase");
function Kn() {
  const i = $s(Xn, null);
  if (!i) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return i;
}
function Qn(i) {
  const t = Kn(), e = ["nlvMargin", i], s = Gn(), n = ni({
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
function Fi(i) {
  return bt(fe(i * 100), 0, 100);
}
const Z = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 }, oi = [..."0123456789ABCDEF"], Zn = (i) => oi[i & 15], Jn = (i) => oi[(i & 240) >> 4] + oi[i & 15], pe = (i) => (i & 240) >> 4 === (i & 15), to = (i) => pe(i.r) && pe(i.g) && pe(i.b) && pe(i.a);
function eo(i) {
  var t = i.length, e;
  return i[0] === "#" && (t === 4 || t === 5 ? e = {
    r: 255 & Z[i[1]] * 17,
    g: 255 & Z[i[2]] * 17,
    b: 255 & Z[i[3]] * 17,
    a: t === 5 ? Z[i[4]] * 17 : 255
  } : (t === 7 || t === 9) && (e = {
    r: Z[i[1]] << 4 | Z[i[2]],
    g: Z[i[3]] << 4 | Z[i[4]],
    b: Z[i[5]] << 4 | Z[i[6]],
    a: t === 9 ? Z[i[7]] << 4 | Z[i[8]] : 255
  })), e;
}
const io = (i, t) => i < 255 ? t(i) : "";
function so(i) {
  var t = to(i) ? Zn : Jn;
  return i ? "#" + t(i.r) + t(i.g) + t(i.b) + io(i.a, t) : void 0;
}
const no = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function qs(i, t, e) {
  const s = t * Math.min(e, 1 - e), n = (o, r = (o + i / 30) % 12) => e - s * Math.max(Math.min(r - 3, 9 - r, 1), -1);
  return [n(0), n(8), n(4)];
}
function oo(i, t, e) {
  const s = (n, o = (n + i / 60) % 6) => e - e * t * Math.max(Math.min(o, 4 - o, 1), 0);
  return [s(5), s(3), s(1)];
}
function ro(i, t, e) {
  const s = qs(i, 1, 0.5);
  let n;
  for (t + e > 1 && (n = 1 / (t + e), t *= n, e *= n), n = 0; n < 3; n++)
    s[n] *= 1 - t - e, s[n] += t;
  return s;
}
function ao(i, t, e, s, n) {
  return i === n ? (t - e) / s + (t < e ? 6 : 0) : t === n ? (e - i) / s + 2 : (i - t) / s + 4;
}
function bi(i) {
  const e = i.r / 255, s = i.g / 255, n = i.b / 255, o = Math.max(e, s, n), r = Math.min(e, s, n), a = (o + r) / 2;
  let l, c, h;
  return o !== r && (h = o - r, c = a > 0.5 ? h / (2 - o - r) : h / (o + r), l = ao(e, s, n, h, o), l = l * 60 + 0.5), [l | 0, c || 0, a];
}
function _i(i, t, e, s) {
  return (Array.isArray(t) ? i(t[0], t[1], t[2]) : i(t, e, s)).map(_t);
}
function xi(i, t, e) {
  return _i(qs, i, t, e);
}
function lo(i, t, e) {
  return _i(ro, i, t, e);
}
function co(i, t, e) {
  return _i(oo, i, t, e);
}
function Xs(i) {
  return (i % 360 + 360) % 360;
}
function ho(i) {
  const t = no.exec(i);
  let e = 255, s;
  if (!t)
    return;
  t[5] !== s && (e = t[6] ? Kt(+t[5]) : _t(+t[5]));
  const n = Xs(+t[2]), o = +t[3] / 100, r = +t[4] / 100;
  return t[1] === "hwb" ? s = lo(n, o, r) : t[1] === "hsv" ? s = co(n, o, r) : s = xi(n, o, r), {
    r: s[0],
    g: s[1],
    b: s[2],
    a: e
  };
}
function uo(i, t) {
  var e = bi(i);
  e[0] = Xs(e[0] + t), e = xi(e), i.r = e[0], i.g = e[1], i.b = e[2];
}
function fo(i) {
  if (!i)
    return;
  const t = bi(i), e = t[0], s = Fi(t[1]), n = Fi(t[2]);
  return i.a < 255 ? `hsla(${e}, ${s}%, ${n}%, ${ft(i.a)})` : `hsl(${e}, ${s}%, ${n}%)`;
}
const Ri = {
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
}, zi = {
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
function go() {
  const i = {}, t = Object.keys(zi), e = Object.keys(Ri);
  let s, n, o, r, a;
  for (s = 0; s < t.length; s++) {
    for (r = a = t[s], n = 0; n < e.length; n++)
      o = e[n], a = a.replace(o, Ri[o]);
    o = parseInt(zi[r], 16), i[a] = [o >> 16 & 255, o >> 8 & 255, o & 255];
  }
  return i;
}
let me;
function po(i) {
  me || (me = go(), me.transparent = [0, 0, 0, 0]);
  const t = me[i.toLowerCase()];
  return t && {
    r: t[0],
    g: t[1],
    b: t[2],
    a: t.length === 4 ? t[3] : 255
  };
}
const mo = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function bo(i) {
  const t = mo.exec(i);
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
function _o(i) {
  return i && (i.a < 255 ? `rgba(${i.r}, ${i.g}, ${i.b}, ${ft(i.a)})` : `rgb(${i.r}, ${i.g}, ${i.b})`);
}
const Ge = (i) => i <= 31308e-7 ? i * 12.92 : Math.pow(i, 1 / 2.4) * 1.055 - 0.055, zt = (i) => i <= 0.04045 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
function xo(i, t, e) {
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
function Ks(i, t) {
  return i && Object.assign(t || {}, i);
}
function Ei(i) {
  var t = { r: 0, g: 0, b: 0, a: 255 };
  return Array.isArray(i) ? i.length >= 3 && (t = { r: i[0], g: i[1], b: i[2], a: 255 }, i.length > 3 && (t.a = _t(i[3]))) : (t = Ks(i, { r: 0, g: 0, b: 0, a: 1 }), t.a = _t(t.a)), t;
}
function yo(i) {
  return i.charAt(0) === "r" ? bo(i) : ho(i);
}
class ae {
  constructor(t) {
    if (t instanceof ae)
      return t;
    const e = typeof t;
    let s;
    e === "object" ? s = Ei(t) : e === "string" && (s = eo(t) || po(t) || yo(t)), this._rgb = s, this._valid = !!s;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var t = Ks(this._rgb);
    return t && (t.a = ft(t.a)), t;
  }
  set rgb(t) {
    this._rgb = Ei(t);
  }
  rgbString() {
    return this._valid ? _o(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? so(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? fo(this._rgb) : void 0;
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
    return t && (this._rgb = xo(this._rgb, t._rgb, e)), this;
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
    return uo(this._rgb, t), this;
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
const vo = /* @__PURE__ */ (() => {
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
function et(i) {
  return (typeof i == "number" || i instanceof Number) && isFinite(+i);
}
function ot(i, t) {
  return et(i) ? i : t;
}
function I(i, t) {
  return typeof i > "u" ? t : i;
}
const wo = (i, t) => typeof i == "string" && i.endsWith("%") ? parseFloat(i) / 100 * t : +i;
function B(i, t, e) {
  if (i && typeof i.call == "function")
    return i.apply(e, t);
}
function R(i, t, e, s) {
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
function Qs(i) {
  return [
    "__proto__",
    "prototype",
    "constructor"
  ].indexOf(i) === -1;
}
function ko(i, t, e, s) {
  if (!Qs(i))
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
  const o = e.merger || ko;
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
    merger: So
  });
}
function So(i, t, e) {
  if (!Qs(i))
    return;
  const s = t[i], n = e[i];
  F(s) && F(n) ? ee(s, n) : Object.prototype.hasOwnProperty.call(t, i) || (t[i] = Re(n));
}
const Hi = {
  // Chart.helpers.core resolveObjectKey should resolve empty key to root object
  "": (i) => i,
  // default resolvers
  x: (i) => i.x,
  y: (i) => i.y
};
function Mo(i) {
  const t = i.split("."), e = [];
  let s = "";
  for (const n of t)
    s += n, s.endsWith("\\") ? s = s.slice(0, -1) + "." : (e.push(s), s = "");
  return e;
}
function Co(i) {
  const t = Mo(i);
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
  return (Hi[t] || (Hi[t] = Co(t)))(i);
}
function yi(i) {
  return i.charAt(0).toUpperCase() + i.slice(1);
}
const Ee = (i) => typeof i < "u", xt = (i) => typeof i == "function", Bi = (i, t) => {
  if (i.size !== t.size)
    return !1;
  for (const e of i)
    if (!t.has(e))
      return !1;
  return !0;
};
function Do(i) {
  return i.type === "mouseup" || i.type === "click" || i.type === "contextmenu";
}
const j = Math.PI, lt = 2 * j, Oo = lt + j, He = Number.POSITIVE_INFINITY, Po = j / 180, st = j / 2, Mt = j / 4, Ni = j * 2 / 3, Zs = Math.log10, Bt = Math.sign;
function ie(i, t, e) {
  return Math.abs(i - t) < e;
}
function Wi(i) {
  const t = Math.round(i);
  i = ie(i, t, i / 1e3) ? t : i;
  const e = Math.pow(10, Math.floor(Zs(i))), s = i / e;
  return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 5 ? 5 : 10) * e;
}
function To(i) {
  const t = [], e = Math.sqrt(i);
  let s;
  for (s = 1; s < e; s++)
    i % s === 0 && (t.push(s), t.push(i / s));
  return e === (e | 0) && t.push(e), t.sort((n, o) => n - o).pop(), t;
}
function Ao(i) {
  return typeof i == "symbol" || typeof i == "object" && i !== null && !(Symbol.toPrimitive in i || "toString" in i || "valueOf" in i);
}
function ce(i) {
  return !Ao(i) && !isNaN(parseFloat(i)) && isFinite(i);
}
function Lo(i, t) {
  const e = Math.round(i);
  return e - t <= i && e + t >= i;
}
function Io(i, t, e) {
  let s, n, o;
  for (s = 0, n = i.length; s < n; s++)
    o = i[s][e], isNaN(o) || (t.min = Math.min(t.min, o), t.max = Math.max(t.max, o));
}
function Tt(i) {
  return i * (j / 180);
}
function Fo(i) {
  return i * (180 / j);
}
function Vi(i) {
  if (!et(i))
    return;
  let t = 1, e = 0;
  for (; Math.round(i * t) / t !== i; )
    t *= 10, e++;
  return e;
}
function Ro(i, t) {
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
function zo(i, t) {
  return (i - t + Oo) % lt - j;
}
function mt(i) {
  return (i % lt + lt) % lt;
}
function Js(i, t, e, s) {
  const n = mt(i), o = mt(t), r = mt(e), a = mt(o - n), l = mt(r - n), c = mt(n - o), h = mt(n - r);
  return n === o || n === r || s && o === r || a > l && c < h;
}
function J(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function Eo(i) {
  return J(i, -32768, 32767);
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
const At = (i, t, e, s) => vi(i, e, s ? (n) => {
  const o = i[n][t];
  return o < e || o === e && i[n + 1][t] === e;
} : (n) => i[n][t] < e), Ho = (i, t, e) => vi(i, e, (s) => i[s][t] >= e);
function Bo(i, t, e) {
  let s = 0, n = i.length;
  for (; s < n && i[s] < t; )
    s++;
  for (; n > s && i[n - 1] > e; )
    n--;
  return s > 0 || n < i.length ? i.slice(s, n) : i;
}
const tn = [
  "push",
  "pop",
  "shift",
  "splice",
  "unshift"
];
function No(i, t) {
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
  }), tn.forEach((e) => {
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
function ji(i, t) {
  const e = i._chartjs;
  if (!e)
    return;
  const s = e.listeners, n = s.indexOf(t);
  n !== -1 && s.splice(n, 1), !(s.length > 0) && (tn.forEach((o) => {
    delete i[o];
  }), delete i._chartjs);
}
function Wo(i) {
  const t = new Set(i);
  return t.size === i.length ? i : Array.from(t);
}
const en = function() {
  return typeof window > "u" ? function(i) {
    return i();
  } : window.requestAnimationFrame;
}();
function sn(i, t) {
  let e = [], s = !1;
  return function(...n) {
    e = n, s || (s = !0, en.call(window, () => {
      s = !1, i.apply(t, e);
    }));
  };
}
function Vo(i, t) {
  let e;
  return function(...s) {
    return t ? (clearTimeout(e), e = setTimeout(i, t, s)) : i.apply(this, s), t;
  };
}
const wi = (i) => i === "start" ? "left" : i === "end" ? "right" : "center", U = (i, t, e) => i === "start" ? t : i === "end" ? e : (t + e) / 2, jo = (i, t, e, s) => i === (s ? "left" : "right") ? e : i === "center" ? (t + e) / 2 : t;
function $o(i, t, e) {
  const s = t.length;
  let n = 0, o = s;
  if (i._sorted) {
    const { iScale: r, vScale: a, _parsed: l } = i, c = i.dataset && i.dataset.options ? i.dataset.options.spanGaps : null, h = r.axis, { min: d, max: u, minDefined: f, maxDefined: m } = r.getUserBounds();
    if (f) {
      if (n = Math.min(
        // @ts-expect-error Need to type _parsed
        At(l, h, d).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? s : At(t, h, r.getPixelForValue(d)).lo
      ), c) {
        const g = l.slice(0, n + 1).reverse().findIndex((p) => !E(p[a.axis]));
        n -= Math.max(0, g);
      }
      n = J(n, 0, s - 1);
    }
    if (m) {
      let g = Math.max(
        // @ts-expect-error Need to type _parsed
        At(l, r.axis, u, !0).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? 0 : At(t, h, r.getPixelForValue(u), !0).hi + 1
      );
      if (c) {
        const p = l.slice(g - 1).findIndex((b) => !E(b[a.axis]));
        g += Math.max(0, p);
      }
      o = J(g, n, s) - n;
    } else
      o = s - n;
  }
  return {
    start: n,
    count: o
  };
}
function Uo(i) {
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
const _e = (i) => i === 0 || i === 1, $i = (i, t, e) => -(Math.pow(2, 10 * (i -= 1)) * Math.sin((i - t) * lt / e)), Ui = (i, t, e) => Math.pow(2, -10 * i) * Math.sin((i - t) * lt / e) + 1, se = {
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
  easeInSine: (i) => -Math.cos(i * st) + 1,
  easeOutSine: (i) => Math.sin(i * st),
  easeInOutSine: (i) => -0.5 * (Math.cos(j * i) - 1),
  easeInExpo: (i) => i === 0 ? 0 : Math.pow(2, 10 * (i - 1)),
  easeOutExpo: (i) => i === 1 ? 1 : -Math.pow(2, -10 * i) + 1,
  easeInOutExpo: (i) => _e(i) ? i : i < 0.5 ? 0.5 * Math.pow(2, 10 * (i * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (i * 2 - 1)) + 2),
  easeInCirc: (i) => i >= 1 ? i : -(Math.sqrt(1 - i * i) - 1),
  easeOutCirc: (i) => Math.sqrt(1 - (i -= 1) * i),
  easeInOutCirc: (i) => (i /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - i * i) - 1) : 0.5 * (Math.sqrt(1 - (i -= 2) * i) + 1),
  easeInElastic: (i) => _e(i) ? i : $i(i, 0.075, 0.3),
  easeOutElastic: (i) => _e(i) ? i : Ui(i, 0.075, 0.3),
  easeInOutElastic(i) {
    return _e(i) ? i : i < 0.5 ? 0.5 * $i(i * 2, 0.1125, 0.45) : 0.5 + 0.5 * Ui(i * 2 - 1, 0.1125, 0.45);
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
function Yi(i) {
  return ki(i) ? i : new ae(i);
}
function qe(i) {
  return ki(i) ? i : new ae(i).saturate(0.5).darken(0.1).hexString();
}
const Yo = [
  "x",
  "y",
  "borderWidth",
  "radius",
  "tension"
], Go = [
  "color",
  "borderColor",
  "backgroundColor"
];
function qo(i) {
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
      properties: Go
    },
    numbers: {
      type: "number",
      properties: Yo
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
function Xo(i) {
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
const Gi = /* @__PURE__ */ new Map();
function Ko(i, t) {
  t = t || {};
  const e = i + JSON.stringify(t);
  let s = Gi.get(e);
  return s || (s = new Intl.NumberFormat(i, t), Gi.set(e, s)), s;
}
function nn(i, t, e) {
  return Ko(t, e).format(i);
}
const Qo = {
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
      (c < 1e-4 || c > 1e15) && (n = "scientific"), o = Zo(i, e);
    }
    const r = Zs(Math.abs(o)), a = isNaN(r) ? 1 : Math.max(Math.min(-1 * Math.floor(r), 20), 0), l = {
      notation: n,
      minimumFractionDigits: a,
      maximumFractionDigits: a
    };
    return Object.assign(l, this.options.ticks.format), nn(i, s, l);
  }
};
function Zo(i, t) {
  let e = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
  return Math.abs(e) >= 1 && i !== Math.floor(i) && (e = i - Math.floor(i)), e;
}
var on = {
  formatters: Qo
};
function Jo(i) {
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
      callback: on.formatters.values,
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
const It = /* @__PURE__ */ Object.create(null), ai = /* @__PURE__ */ Object.create(null);
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
class tr {
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
    return Xe(It, t, e);
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
var W = /* @__PURE__ */ new tr({
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
  qo,
  Xo,
  Jo
]);
function er(i) {
  return !i || E(i.size) || E(i.family) ? null : (i.style ? i.style + " " : "") + (i.weight ? i.weight + " " : "") + i.size + "px " + i.family;
}
function qi(i, t, e, s, n) {
  let o = t[n];
  return o || (o = t[n] = i.measureText(n).width, e.push(n)), o > s && (s = o), s;
}
function Ct(i, t, e) {
  const s = i.currentDevicePixelRatio, n = e !== 0 ? Math.max(e / 2, 0.5) : 0;
  return Math.round((t - n) * s) / s + n;
}
function Xi(i, t) {
  !t && !i || (t = t || i.getContext("2d"), t.save(), t.resetTransform(), t.clearRect(0, 0, i.width, i.height), t.restore());
}
function li(i, t, e, s) {
  rn(i, t, e, s, null);
}
function rn(i, t, e, s, n) {
  let o, r, a, l, c, h, d, u;
  const f = t.pointStyle, m = t.rotation, g = t.radius;
  let p = (m || 0) * Po;
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
        h = n ? n / 2 : g, i.moveTo(e + Math.sin(p) * h, s - Math.cos(p) * g), p += Ni, i.lineTo(e + Math.sin(p) * h, s - Math.cos(p) * g), p += Ni, i.lineTo(e + Math.sin(p) * h, s - Math.cos(p) * g), i.closePath();
        break;
      case "rectRounded":
        c = g * 0.516, l = g - c, r = Math.cos(p + Mt) * l, d = Math.cos(p + Mt) * (n ? n / 2 - c : l), a = Math.sin(p + Mt) * l, u = Math.sin(p + Mt) * (n ? n / 2 - c : l), i.arc(e - d, s - a, c, p - j, p - st), i.arc(e + u, s - r, c, p - st, p), i.arc(e + d, s + a, c, p, p + st), i.arc(e - u, s + r, c, p + st, p + j), i.closePath();
        break;
      case "rect":
        if (!m) {
          l = Math.SQRT1_2 * g, h = n ? n / 2 : l, i.rect(e - h, s - l, 2 * h, 2 * l);
          break;
        }
        p += Mt;
      case "rectRot":
        d = Math.cos(p) * (n ? n / 2 : g), r = Math.cos(p) * g, a = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - a), i.lineTo(e + u, s - r), i.lineTo(e + d, s + a), i.lineTo(e - u, s + r), i.closePath();
        break;
      case "crossRot":
        p += Mt;
      case "cross":
        d = Math.cos(p) * (n ? n / 2 : g), r = Math.cos(p) * g, a = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r);
        break;
      case "star":
        d = Math.cos(p) * (n ? n / 2 : g), r = Math.cos(p) * g, a = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r), p += Mt, d = Math.cos(p) * (n ? n / 2 : g), r = Math.cos(p) * g, a = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r);
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
function ir(i, t, e, s, n) {
  if (!t)
    return i.lineTo(e.x, e.y);
  if (n === "middle") {
    const o = (t.x + e.x) / 2;
    i.lineTo(o, t.y), i.lineTo(o, e.y);
  } else n === "after" != !!s ? i.lineTo(t.x, e.y) : i.lineTo(e.x, t.y);
  i.lineTo(e.x, e.y);
}
function sr(i, t, e, s) {
  if (!t)
    return i.lineTo(e.x, e.y);
  i.bezierCurveTo(s ? t.cp1x : t.cp2x, s ? t.cp1y : t.cp2y, s ? e.cp2x : e.cp1x, s ? e.cp2y : e.cp1y, e.x, e.y);
}
function nr(i, t) {
  t.translation && i.translate(t.translation[0], t.translation[1]), E(t.rotation) || i.rotate(t.rotation), t.color && (i.fillStyle = t.color), t.textAlign && (i.textAlign = t.textAlign), t.textBaseline && (i.textBaseline = t.textBaseline);
}
function or(i, t, e, s, n) {
  if (n.strikethrough || n.underline) {
    const o = i.measureText(s), r = t - o.actualBoundingBoxLeft, a = t + o.actualBoundingBoxRight, l = e - o.actualBoundingBoxAscent, c = e + o.actualBoundingBoxDescent, h = n.strikethrough ? (l + c) / 2 : c;
    i.strokeStyle = i.fillStyle, i.beginPath(), i.lineWidth = n.decorationWidth || 2, i.moveTo(r, h), i.lineTo(a, h), i.stroke();
  }
}
function rr(i, t) {
  const e = i.fillStyle;
  i.fillStyle = t.color, i.fillRect(t.left, t.top, t.width, t.height), i.fillStyle = e;
}
function de(i, t, e, s, n, o = {}) {
  const r = V(t) ? t : [
    t
  ], a = o.strokeWidth > 0 && o.strokeColor !== "";
  let l, c;
  for (i.save(), i.font = n.string, nr(i, o), l = 0; l < r.length; ++l)
    c = r[l], o.backdrop && rr(i, o.backdrop), a && (o.strokeColor && (i.strokeStyle = o.strokeColor), E(o.strokeWidth) || (i.lineWidth = o.strokeWidth), i.strokeText(c, e, s, o.maxWidth)), i.fillText(c, e, s, o.maxWidth), or(i, e, s, c, o), s += Number(n.lineHeight);
  i.restore();
}
function ci(i, t) {
  const { x: e, y: s, w: n, h: o, radius: r } = t;
  i.arc(e + r.topLeft, s + r.topLeft, r.topLeft, 1.5 * j, j, !0), i.lineTo(e, s + o - r.bottomLeft), i.arc(e + r.bottomLeft, s + o - r.bottomLeft, r.bottomLeft, j, st, !0), i.lineTo(e + n - r.bottomRight, s + o), i.arc(e + n - r.bottomRight, s + o - r.bottomRight, r.bottomRight, st, 0, !0), i.lineTo(e + n, s + r.topRight), i.arc(e + n - r.topRight, s + r.topRight, r.topRight, 0, -st, !0), i.lineTo(e + r.topLeft, s);
}
const ar = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/, lr = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function cr(i, t) {
  const e = ("" + i).match(ar);
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
const hr = (i) => +i || 0;
function an(i, t) {
  const e = {}, s = F(t), n = s ? Object.keys(t) : t, o = F(i) ? s ? (r) => I(i[r], i[t[r]]) : (r) => i[r] : () => i;
  for (const r of n)
    e[r] = hr(o(r));
  return e;
}
function dr(i) {
  return an(i, {
    top: "y",
    right: "x",
    bottom: "y",
    left: "x"
  });
}
function oe(i) {
  return an(i, [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);
}
function it(i) {
  const t = dr(i);
  return t.width = t.left + t.right, t.height = t.top + t.bottom, t;
}
function Y(i, t) {
  i = i || {}, t = t || W.font;
  let e = I(i.size, t.size);
  typeof e == "string" && (e = parseInt(e, 10));
  let s = I(i.style, t.style);
  s && !("" + s).match(lr) && (console.warn('Invalid font style specified: "' + s + '"'), s = void 0);
  const n = {
    family: I(i.family, t.family),
    lineHeight: cr(I(i.lineHeight, t.lineHeight), e),
    size: e,
    style: s,
    weight: I(i.weight, t.weight),
    string: ""
  };
  return n.string = er(n), n;
}
function xe(i, t, e, s) {
  let n, o, r;
  for (n = 0, o = i.length; n < o; ++n)
    if (r = i[n], r !== void 0 && r !== void 0)
      return r;
}
function ur(i, t, e) {
  const { min: s, max: n } = i, o = wo(t, (n - s) / 2), r = (a, l) => e && a === 0 ? 0 : a + l;
  return {
    min: r(s, -Math.abs(o)),
    max: r(n, o)
  };
}
function Ft(i, t) {
  return Object.assign(Object.create(i), t);
}
function Ci(i, t = [
  ""
], e, s, n = () => i[0]) {
  const o = e || i;
  typeof s > "u" && (s = dn("_fallback", i));
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
      return cn(a, l, () => yr(l, t, i, a));
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
      return Qi(a).includes(l);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys(a) {
      return Qi(a);
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
    _descriptors: ln(i, s),
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
      return cn(o, r, () => gr(o, r, a));
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
function ln(i, t = {
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
const fr = (i, t) => i ? i + yi(t) : t, Di = (i, t) => F(t) && i !== "adapters" && (Object.getPrototypeOf(t) === null || t.constructor === Object);
function cn(i, t, e) {
  if (Object.prototype.hasOwnProperty.call(i, t) || t === "constructor")
    return i[t];
  const s = e();
  return i[t] = s, s;
}
function gr(i, t, e) {
  const { _proxy: s, _context: n, _subProxy: o, _descriptors: r } = i;
  let a = s[t];
  return xt(a) && r.isScriptable(t) && (a = pr(t, a, i, e)), V(a) && a.length && (a = mr(t, a, i, r.isIndexable)), Di(t, a) && (a = Nt(a, n, o && o[t], r)), a;
}
function pr(i, t, e, s) {
  const { _proxy: n, _context: o, _subProxy: r, _stack: a } = e;
  if (a.has(i))
    throw new Error("Recursion detected: " + Array.from(a).join("->") + "->" + i);
  a.add(i);
  let l = t(o, r || s);
  return a.delete(i), Di(i, l) && (l = Oi(n._scopes, n, i, l)), l;
}
function mr(i, t, e, s) {
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
function hn(i, t, e) {
  return xt(i) ? i(t, e) : i;
}
const br = (i, t) => i === !0 ? t : typeof i == "string" ? ze(t, i) : void 0;
function _r(i, t, e, s, n) {
  for (const o of t) {
    const r = br(e, o);
    if (r) {
      i.add(r);
      const a = hn(r._fallback, e, n);
      if (typeof a < "u" && a !== e && a !== s)
        return a;
    } else if (r === !1 && typeof s < "u" && e !== s)
      return null;
  }
  return !1;
}
function Oi(i, t, e, s) {
  const n = t._rootScopes, o = hn(t._fallback, e, s), r = [
    ...i,
    ...n
  ], a = /* @__PURE__ */ new Set();
  a.add(s);
  let l = Ki(a, r, e, o || e, s);
  return l === null || typeof o < "u" && o !== e && (l = Ki(a, r, o, l, s), l === null) ? !1 : Ci(Array.from(a), [
    ""
  ], n, o, () => xr(t, e, s));
}
function Ki(i, t, e, s, n) {
  for (; e; )
    e = _r(i, t, e, s, n);
  return e;
}
function xr(i, t, e) {
  const s = i._getTarget();
  t in s || (s[t] = {});
  const n = s[t];
  return V(n) && F(e) ? e : n || {};
}
function yr(i, t, e, s) {
  let n;
  for (const o of t)
    if (n = dn(fr(o, i), e), typeof n < "u")
      return Di(i, n) ? Oi(e, s, i, n) : n;
}
function dn(i, t) {
  for (const e of t) {
    if (!e)
      continue;
    const s = e[i];
    if (typeof s < "u")
      return s;
  }
}
function Qi(i) {
  let t = i._keys;
  return t || (t = i._keys = vr(i._scopes)), t;
}
function vr(i) {
  const t = /* @__PURE__ */ new Set();
  for (const e of i)
    for (const s of Object.keys(e).filter((n) => !n.startsWith("_")))
      t.add(s);
  return Array.from(t);
}
const wr = Number.EPSILON || 1e-14, Wt = (i, t) => t < i.length && !i[t].skip && i[t], un = (i) => i === "x" ? "y" : "x";
function kr(i, t, e, s) {
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
function Sr(i, t, e) {
  const s = i.length;
  let n, o, r, a, l, c = Wt(i, 0);
  for (let h = 0; h < s - 1; ++h)
    if (l = c, c = Wt(i, h + 1), !(!l || !c)) {
      if (ie(t[h], 0, wr)) {
        e[h] = e[h + 1] = 0;
        continue;
      }
      n = e[h] / t[h], o = e[h + 1] / t[h], a = Math.pow(n, 2) + Math.pow(o, 2), !(a <= 9) && (r = 3 / Math.sqrt(a), e[h] = n * r * t[h], e[h + 1] = o * r * t[h]);
    }
}
function Mr(i, t, e = "x") {
  const s = un(e), n = i.length;
  let o, r, a, l = Wt(i, 0);
  for (let c = 0; c < n; ++c) {
    if (r = a, a = l, l = Wt(i, c + 1), !a)
      continue;
    const h = a[e], d = a[s];
    r && (o = (h - r[e]) / 3, a[`cp1${e}`] = h - o, a[`cp1${s}`] = d - o * t[c]), l && (o = (l[e] - h) / 3, a[`cp2${e}`] = h + o, a[`cp2${s}`] = d + o * t[c]);
  }
}
function Cr(i, t = "x") {
  const e = un(t), s = i.length, n = Array(s).fill(0), o = Array(s);
  let r, a, l, c = Wt(i, 0);
  for (r = 0; r < s; ++r)
    if (a = l, l = c, c = Wt(i, r + 1), !!l) {
      if (c) {
        const h = c[t] - l[t];
        n[r] = h !== 0 ? (c[e] - l[e]) / h : 0;
      }
      o[r] = a ? c ? Bt(n[r - 1]) !== Bt(n[r]) ? 0 : (n[r - 1] + n[r]) / 2 : n[r - 1] : n[r];
    }
  Sr(i, n, o), Mr(i, o, t);
}
function ye(i, t, e) {
  return Math.max(Math.min(i, e), t);
}
function Dr(i, t) {
  let e, s, n, o, r, a = he(i[0], t);
  for (e = 0, s = i.length; e < s; ++e)
    r = o, o = a, a = e < s - 1 && he(i[e + 1], t), o && (n = i[e], r && (n.cp1x = ye(n.cp1x, t.left, t.right), n.cp1y = ye(n.cp1y, t.top, t.bottom)), a && (n.cp2x = ye(n.cp2x, t.left, t.right), n.cp2y = ye(n.cp2y, t.top, t.bottom)));
}
function Or(i, t, e, s, n) {
  let o, r, a, l;
  if (t.spanGaps && (i = i.filter((c) => !c.skip)), t.cubicInterpolationMode === "monotone")
    Cr(i, n);
  else {
    let c = s ? i[i.length - 1] : i[0];
    for (o = 0, r = i.length; o < r; ++o)
      a = i[o], l = kr(c, a, i[Math.min(o + 1, r - (s ? 0 : 1)) % r], t.tension), a.cp1x = l.previous.x, a.cp1y = l.previous.y, a.cp2x = l.next.x, a.cp2y = l.next.y, c = a;
  }
  t.capBezierPoints && Dr(i, e);
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
function Pr(i, t) {
  return Ve(i).getPropertyValue(t);
}
const Tr = [
  "top",
  "right",
  "bottom",
  "left"
];
function Lt(i, t, e) {
  const s = {};
  e = e ? "-" + e : "";
  for (let n = 0; n < 4; n++) {
    const o = Tr[n];
    s[o] = parseFloat(i[t + "-" + o + e]) || 0;
  }
  return s.width = s.left + s.right, s.height = s.top + s.bottom, s;
}
const Ar = (i, t, e) => (i > 0 || t > 0) && (!e || !e.shadowRoot);
function Lr(i, t) {
  const e = i.touches, s = e && e.length ? e[0] : i, { offsetX: n, offsetY: o } = s;
  let r = !1, a, l;
  if (Ar(n, o, i.target))
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
function Ot(i, t) {
  if ("native" in i)
    return i;
  const { canvas: e, currentDevicePixelRatio: s } = t, n = Ve(e), o = n.boxSizing === "border-box", r = Lt(n, "padding"), a = Lt(n, "border", "width"), { x: l, y: c, box: h } = Lr(i, e), d = r.left + (h && a.left), u = r.top + (h && a.top);
  let { width: f, height: m } = t;
  return o && (f -= r.width + a.width, m -= r.height + a.height), {
    x: Math.round((l - d) / f * e.width / s),
    y: Math.round((c - u) / m * e.height / s)
  };
}
function Ir(i, t, e) {
  let s, n;
  if (t === void 0 || e === void 0) {
    const o = i && Ti(i);
    if (!o)
      t = i.clientWidth, e = i.clientHeight;
    else {
      const r = o.getBoundingClientRect(), a = Ve(o), l = Lt(a, "border", "width"), c = Lt(a, "padding");
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
function Fr(i, t, e, s) {
  const n = Ve(i), o = Lt(n, "margin"), r = Be(n.maxWidth, i, "clientWidth") || He, a = Be(n.maxHeight, i, "clientHeight") || He, l = Ir(i, t, e);
  let { width: c, height: h } = l;
  if (n.boxSizing === "content-box") {
    const u = Lt(n, "border", "width"), f = Lt(n, "padding");
    c -= f.width + u.width, h -= f.height + u.height;
  }
  return c = Math.max(0, c - o.width), h = Math.max(0, s ? c / s : h - o.height), c = ve(Math.min(c, r, l.maxWidth)), h = ve(Math.min(h, a, l.maxHeight)), c && !h && (h = ve(c / 2)), (t !== void 0 || e !== void 0) && s && l.height && h > l.height && (h = l.height, c = ve(Math.floor(h * s))), {
    width: c,
    height: h
  };
}
function Zi(i, t, e) {
  const s = t || 1, n = Math.floor(i.height * s), o = Math.floor(i.width * s);
  i.height = Math.floor(i.height), i.width = Math.floor(i.width);
  const r = i.canvas;
  return r.style && (e || !r.style.height && !r.style.width) && (r.style.height = `${i.height}px`, r.style.width = `${i.width}px`), i.currentDevicePixelRatio !== s || r.height !== n || r.width !== o ? (i.currentDevicePixelRatio = s, r.height = n, r.width = o, i.ctx.setTransform(s, 0, 0, s, 0, 0), !0) : !1;
}
const Rr = function() {
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
function Ji(i, t) {
  const e = Pr(i, t), s = e && e.match(/^(\d+)(\.\d+)?px$/);
  return s ? +s[1] : void 0;
}
function Pt(i, t, e, s) {
  return {
    x: i.x + e * (t.x - i.x),
    y: i.y + e * (t.y - i.y)
  };
}
function zr(i, t, e, s) {
  return {
    x: i.x + e * (t.x - i.x),
    y: s === "middle" ? e < 0.5 ? i.y : t.y : s === "after" ? e < 1 ? i.y : t.y : e > 0 ? t.y : i.y
  };
}
function Er(i, t, e, s) {
  const n = {
    x: i.cp2x,
    y: i.cp2y
  }, o = {
    x: t.cp1x,
    y: t.cp1y
  }, r = Pt(i, n, e), a = Pt(n, o, e), l = Pt(o, t, e), c = Pt(r, a, e), h = Pt(a, l, e);
  return Pt(c, h, e);
}
const Hr = function(i, t) {
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
}, Br = function() {
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
  return i ? Hr(t, e) : Br();
}
function fn(i, t) {
  let e, s;
  (t === "ltr" || t === "rtl") && (e = i.canvas.style, s = [
    e.getPropertyValue("direction"),
    e.getPropertyPriority("direction")
  ], e.setProperty("direction", t, "important"), i.prevTextDirection = s);
}
function gn(i, t) {
  t !== void 0 && (delete i.prevTextDirection, i.canvas.style.setProperty("direction", t[0], t[1]));
}
function pn(i) {
  return i === "angle" ? {
    between: Js,
    compare: zo,
    normalize: mt
  } : {
    between: Qt,
    compare: (t, e) => t - e,
    normalize: (t) => t
  };
}
function ts({ start: i, end: t, count: e, loop: s, style: n }) {
  return {
    start: i % e,
    end: t % e,
    loop: s && (t - i + 1) % e === 0,
    style: n
  };
}
function Nr(i, t, e) {
  const { property: s, start: n, end: o } = e, { between: r, normalize: a } = pn(s), l = t.length;
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
function Wr(i, t, e) {
  if (!e)
    return [
      i
    ];
  const { property: s, start: n, end: o } = e, r = t.length, { compare: a, between: l, normalize: c } = pn(s), { start: h, end: d, loop: u, style: f } = Nr(i, t, e), m = [];
  let g = !1, p = null, b, y, M;
  const k = () => l(n, M, b) && a(n, M) !== 0, w = () => a(o, b) === 0 || l(o, M, b), D = () => g || k(), O = () => !g || w();
  for (let C = h, x = h; C <= d; ++C)
    y = t[C % r], !y.skip && (b = c(y[s]), b !== M && (g = l(b, n, o), p === null && D() && (p = a(b, n) === 0 ? C : x), p !== null && O() && (m.push(ts({
      start: p,
      end: C,
      loop: u,
      count: r,
      style: f
    })), p = null), x = C, M = b));
  return p !== null && m.push(ts({
    start: p,
    end: d,
    loop: u,
    count: r,
    style: f
  })), m;
}
function Vr(i, t) {
  const e = [], s = i.segments;
  for (let n = 0; n < s.length; n++) {
    const o = Wr(s[n], i.points, t);
    o.length && e.push(...o);
  }
  return e;
}
function jr(i, t, e, s) {
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
function $r(i, t, e, s) {
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
function Ur(i, t) {
  const e = i.points, s = i.options.spanGaps, n = e.length;
  if (!n)
    return [];
  const o = !!i._loop, { start: r, end: a } = jr(e, n, o, s);
  if (s === !0)
    return es(i, [
      {
        start: r,
        end: a,
        loop: o
      }
    ], e, t);
  const l = a < r ? a + n : a, c = !!i._fullLoop && r === 0 && a === n - 1;
  return es(i, $r(e, r, l, c), e, t);
}
function es(i, t, e, s) {
  return !s || !s.setContext || !e ? t : Yr(i, t, e, s);
}
function Yr(i, t, e, s) {
  const n = i._chart.getContext(), o = is(i.options), { _datasetIndex: r, options: { spanGaps: a } } = i, l = e.length, c = [];
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
      p = is(s.setContext(Ft(n, {
        type: "segment",
        p0: g,
        p1: b,
        p0DataIndex: (u - 1) % l,
        p1DataIndex: u % l,
        datasetIndex: r
      }))), Gr(p, h) && f(d, u - 1, m.loop, h), g = b, h = p;
    }
    d < u - 1 && f(d, u - 1, m.loop, h);
  }
  return c;
}
function is(i) {
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
function Gr(i, t) {
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
function qr(i, t) {
  const { xScale: e, yScale: s } = i;
  return e && s ? {
    left: we(e, t, "left"),
    right: we(e, t, "right"),
    top: we(s, t, "top"),
    bottom: we(s, t, "bottom")
  } : t;
}
function Xr(i, t) {
  const e = t._clip;
  if (e.disabled)
    return !1;
  const s = qr(t, i.chartArea);
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
class Kr {
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
    this._request || (this._running = !0, this._request = en.call(window, () => {
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
var dt = /* @__PURE__ */ new Kr();
const ss = "transparent", Qr = {
  boolean(i, t, e) {
    return e > 0.5 ? t : i;
  },
  color(i, t, e) {
    const s = Yi(i || ss), n = s.valid && Yi(t || ss);
    return n && n.valid ? n.mix(s, e).hexString() : t;
  },
  number(i, t, e) {
    return i + (t - i) * e;
  }
};
class Zr {
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
    this._active = !0, this._fn = t.fn || Qr[t.type || typeof r], this._easing = se[t.easing] || se.linear, this._start = Math.floor(Date.now() + (t.delay || 0)), this._duration = this._total = Math.floor(t.duration), this._loop = !!t.loop, this._target = e, this._prop = s, this._from = r, this._to = n, this._promises = void 0;
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
class mn {
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
    const s = e.options, n = ta(t, s);
    if (!n)
      return [];
    const o = this._createAnimations(n, s);
    return s.$shared && Jr(t.options.$animations, s).then(() => {
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
      o[c] = d = new Zr(u, t, c, h), n.push(d);
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
function Jr(i, t) {
  const e = [], s = Object.keys(t);
  for (let n = 0; n < s.length; n++) {
    const o = i[s[n]];
    o && o.active() && e.push(o.wait());
  }
  return Promise.all(e);
}
function ta(i, t) {
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
function ns(i, t) {
  const e = i && i.options || {}, s = e.reverse, n = e.min === void 0 ? t : 0, o = e.max === void 0 ? t : 0;
  return {
    start: s ? o : n,
    end: s ? n : o
  };
}
function ea(i, t, e) {
  if (e === !1)
    return !1;
  const s = ns(i, e), n = ns(t, e);
  return {
    top: n.end,
    right: s.end,
    bottom: n.start,
    left: s.start
  };
}
function ia(i) {
  let t, e, s, n;
  return F(i) ? (t = i.top, e = i.right, s = i.bottom, n = i.left) : t = e = s = n = i, {
    top: t,
    right: e,
    bottom: s,
    left: n,
    disabled: i === !1
  };
}
function bn(i, t) {
  const e = [], s = i._getSortedDatasetMetas(t);
  let n, o;
  for (n = 0, o = s.length; n < o; ++n)
    e.push(s[n].index);
  return e;
}
function os(i, t, e, s = {}) {
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
    c = i.values[l], et(c) && (o || t === 0 || Bt(t) === Bt(c)) && (t += c);
  }
  return !h && !s.all ? 0 : t;
}
function sa(i, t) {
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
function na(i, t, e) {
  return `${i.id}.${t.id}.${e.stack || e.type}`;
}
function oa(i) {
  const { min: t, max: e, minDefined: s, maxDefined: n } = i.getUserBounds();
  return {
    min: s ? t : Number.NEGATIVE_INFINITY,
    max: n ? e : Number.POSITIVE_INFINITY
  };
}
function ra(i, t, e) {
  const s = i[t] || (i[t] = {});
  return s[e] || (s[e] = {});
}
function rs(i, t, e, s) {
  for (const n of t.getMatchingVisibleMetas(s).reverse()) {
    const o = i[n.index];
    if (e && o > 0 || !e && o < 0)
      return n.index;
  }
  return null;
}
function as(i, t) {
  const { chart: e, _cachedMeta: s } = i, n = e._stacks || (e._stacks = {}), { iScale: o, vScale: r, index: a } = s, l = o.axis, c = r.axis, h = na(o, r, s), d = t.length;
  let u;
  for (let f = 0; f < d; ++f) {
    const m = t[f], { [l]: g, [c]: p } = m, b = m._stacks || (m._stacks = {});
    u = b[c] = ra(n, h, g), u[a] = p, u._top = rs(u, r, !0, s.type), u._bottom = rs(u, r, !1, s.type);
    const y = u._visualValues || (u._visualValues = {});
    y[a] = p;
  }
}
function Qe(i, t) {
  const e = i.scales;
  return Object.keys(e).filter((s) => e[s].axis === t).shift();
}
function aa(i, t) {
  return Ft(i, {
    active: !1,
    dataset: void 0,
    datasetIndex: t,
    index: t,
    mode: "default",
    type: "dataset"
  });
}
function la(i, t, e) {
  return Ft(i, {
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
const Ze = (i) => i === "reset" || i === "none", ls = (i, t) => t ? i : Object.assign({}, i), ca = (i, t, e) => i && !t.hidden && t._stacked && {
  keys: bn(e, !0),
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
    this._data && ji(this._data, this), t._stacked && Ut(t);
  }
  _dataCheck() {
    const t = this.getDataset(), e = t.data || (t.data = []), s = this._data;
    if (F(e)) {
      const n = this._cachedMeta;
      this._data = sa(e, n);
    } else if (s !== e) {
      if (s) {
        ji(s, this);
        const n = this._cachedMeta;
        Ut(n), n._parsed = [];
      }
      e && Object.isExtensible(e) && No(e, this), this._syncList = [], this._data = e;
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
    e._stacked = Ke(e.vScale, e), e.stack !== s.stack && (n = !0, Ut(e), e.stack = s.stack), this._resyncElements(t), (n || o !== e._stacked) && (as(this, e._parsed), e._stacked = Ke(e.vScale, e));
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
    r && as(this, u);
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
      keys: bn(n, !0),
      values: e._stacks[t.axis]._visualValues
    };
    return os(a, r, o.index, {
      mode: s
    });
  }
  updateRangeFromParsed(t, e, s, n) {
    const o = s[e.axis];
    let r = o === null ? NaN : o;
    const a = n && s._stacks[e.axis];
    n && a && (n.values = a, r = os(n, o, this._cachedMeta.index)), t.min = Math.min(t.min, r), t.max = Math.max(t.max, r);
  }
  getMinMax(t, e) {
    const s = this._cachedMeta, n = s._parsed, o = s._sorted && t === s.iScale, r = n.length, a = this._getOtherScale(t), l = ca(e, s, this.chart), c = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    }, { min: h, max: d } = oa(a);
    let u, f;
    function m() {
      f = n[u];
      const g = f[a.axis];
      return !et(f[t.axis]) || h > g || d < g;
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
      r = e[n][t.axis], et(r) && s.push(r);
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
    this.update(t || "default"), e._clip = ia(I(this.options.clip, ea(e.xScale, e.yScale, this.getMaxOverflow())));
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
      o = r.$context || (r.$context = la(this.getContext(), t, r)), o.parsed = this.getParsed(t), o.raw = n.data[t], o.index = o.dataIndex = t;
    } else
      o = this.$context || (this.$context = aa(this.chart.getContext(), this.index)), o.dataset = n, o.index = o.datasetIndex = this.index;
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
      return ls(a, l);
    const c = this.chart.config, h = c.datasetElementScopeKeys(this._type, t), d = n ? [
      `${t}Hover`,
      "hover",
      t,
      ""
    ] : [
      t,
      ""
    ], u = c.getOptionScopes(this.getDataset(), h), f = Object.keys(W.elements[t]), m = () => this.getContext(s, n, e), g = c.resolveNamedOptions(u, f, m, d);
    return g.$shared && (g.$shared = l, o[r] = Object.freeze(ls(g, l))), g;
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
    const c = new mn(n, l && l.animations);
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
A(re, "defaults", {}), A(re, "datasetElementType", null), A(re, "dataElementType", null);
class Te extends re {
  initialize() {
    this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize();
  }
  update(t) {
    const e = this._cachedMeta, { dataset: s, data: n = [], _dataset: o } = e, r = this.chart._animationsDisabled;
    let { start: a, count: l } = $o(e, n, r);
    this._drawStart = a, this._drawCount = l, Uo(e) && (a = 0, l = n.length), s._chart = this.chart, s._datasetIndex = this.index, s._decimated = !!o._decimated, s.points = n;
    const c = this.resolveDatasetElementOptions(t);
    this.options.showLine || (c.borderWidth = 0), c.segment = this.options.segment, this.updateElement(s, void 0, {
      animated: !r,
      options: c
    }, t), this.updateElements(n, a, l, t);
  }
  updateElements(t, e, s, n) {
    const o = n === "reset", { iScale: r, vScale: a, _stacked: l, _dataset: c } = this._cachedMeta, { sharedOptions: h, includeOptions: d } = this._getSharedOptions(e, n), u = r.axis, f = a.axis, { spanGaps: m, segment: g } = this.options, p = ce(m) ? m : Number.POSITIVE_INFINITY, b = this.chart._animationsDisabled || o || n === "none", y = e + s, M = t.length;
    let k = e > 0 && this.getParsed(e - 1);
    for (let w = 0; w < M; ++w) {
      const D = t[w], O = b ? D : {};
      if (w < e || w >= y) {
        O.skip = !0;
        continue;
      }
      const C = this.getParsed(w), x = E(C[f]), _ = O[u] = r.getPixelForValue(C[u], w), P = O[f] = o || x ? a.getBasePixel() : a.getPixelForValue(l ? this.applyStack(a, C, l) : C[f], w);
      O.skip = isNaN(_) || isNaN(P) || x, O.stop = w > 0 && Math.abs(C[u] - k[u]) > p, g && (O.parsed = C, O.raw = c.data[w]), d && (O.options = h || this.resolveDataElementOptions(w, D.active ? "active" : n)), b || this.updateElement(D, w, O, n), k = C;
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
A(Te, "id", "line"), A(Te, "defaults", {
  datasetElementType: "line",
  dataElementType: "point",
  showLine: !0,
  spanGaps: !1
}), A(Te, "overrides", {
  scales: {
    _index_: {
      type: "category"
    },
    _value_: {
      type: "linear"
    }
  }
});
function Dt() {
  throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
}
class Ai {
  constructor(t) {
    A(this, "options");
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
    return Dt();
  }
  parse() {
    return Dt();
  }
  format() {
    return Dt();
  }
  add() {
    return Dt();
  }
  diff() {
    return Dt();
  }
  startOf() {
    return Dt();
  }
  endOf() {
    return Dt();
  }
}
var ha = {
  _date: Ai
};
function da(i, t, e, s) {
  const { controller: n, data: o, _sorted: r } = i, a = n._cachedMeta.iScale, l = i.dataset && i.dataset.options ? i.dataset.options.spanGaps : null;
  if (a && t === a.axis && t !== "r" && r && o.length) {
    const c = a._reversePixels ? Ho : At;
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
    const { index: c, data: h } = o[a], { lo: d, hi: u } = da(o[a], t, r, n);
    for (let f = d; f <= u; ++f) {
      const m = h[f];
      m.skip || s(m, c, f);
    }
  }
}
function ua(i) {
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
function fa(i, t, e, s) {
  let n = [];
  function o(r, a, l) {
    const { startAngle: c, endAngle: h } = r.getProps([
      "startAngle",
      "endAngle"
    ], s), { angle: d } = Ro(r, {
      x: t.x,
      y: t.y
    });
    Js(d, c, h) && n.push({
      element: r,
      datasetIndex: a,
      index: l
    });
  }
  return je(i, e, t, o), n;
}
function ga(i, t, e, s, n, o) {
  let r = [];
  const a = ua(e);
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
  return !o && !i.isPointInArea(t) ? [] : e === "r" && !s ? fa(i, t, e, n) : ga(i, t, e, s, n, o);
}
function cs(i, t, e, s, n) {
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
var pa = {
  modes: {
    index(i, t, e, s) {
      const n = Ot(t, i), o = e.axis || "x", r = e.includeInvisible || !1, a = e.intersect ? Je(i, n, o, s, r) : ti(i, n, o, !1, s, r), l = [];
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
      const n = Ot(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
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
      const n = Ot(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
      return Je(i, n, o, s, r);
    },
    nearest(i, t, e, s) {
      const n = Ot(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
      return ti(i, n, o, e.intersect, s, r);
    },
    x(i, t, e, s) {
      const n = Ot(t, i);
      return cs(i, n, "x", e.intersect, s);
    },
    y(i, t, e, s) {
      const n = Ot(t, i);
      return cs(i, n, "y", e.intersect, s);
    }
  }
};
const _n = [
  "left",
  "top",
  "right",
  "bottom"
];
function Yt(i, t) {
  return i.filter((e) => e.pos === t);
}
function hs(i, t) {
  return i.filter((e) => _n.indexOf(e.pos) === -1 && e.box.axis === t);
}
function Gt(i, t) {
  return i.sort((e, s) => {
    const n = t ? s : e, o = t ? e : s;
    return n.weight === o.weight ? n.index - o.index : n.weight - o.weight;
  });
}
function ma(i) {
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
function ba(i) {
  const t = {};
  for (const e of i) {
    const { stack: s, pos: n, stackWeight: o } = e;
    if (!s || !_n.includes(n))
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
function _a(i, t) {
  const e = ba(i), { vBoxMaxWidth: s, hBoxMaxHeight: n } = t;
  let o, r, a;
  for (o = 0, r = i.length; o < r; ++o) {
    a = i[o];
    const { fullSize: l } = a.box, c = e[a.stack], h = c && a.stackWeight / c.weight;
    a.horizontal ? (a.width = h ? h * s : l && t.availableWidth, a.height = n) : (a.width = s, a.height = h ? h * n : l && t.availableHeight);
  }
  return e;
}
function xa(i) {
  const t = ma(i), e = Gt(t.filter((c) => c.box.fullSize), !0), s = Gt(Yt(t, "left"), !0), n = Gt(Yt(t, "right")), o = Gt(Yt(t, "top"), !0), r = Gt(Yt(t, "bottom")), a = hs(t, "x"), l = hs(t, "y");
  return {
    fullSize: e,
    leftAndTop: s.concat(o),
    rightAndBottom: n.concat(l).concat(r).concat(a),
    chartArea: Yt(t, "chartArea"),
    vertical: s.concat(n).concat(l),
    horizontal: o.concat(r).concat(a)
  };
}
function ds(i, t, e, s) {
  return Math.max(i[e], t[e]) + Math.max(i[s], t[s]);
}
function xn(i, t) {
  i.top = Math.max(i.top, t.top), i.left = Math.max(i.left, t.left), i.bottom = Math.max(i.bottom, t.bottom), i.right = Math.max(i.right, t.right);
}
function ya(i, t, e, s) {
  const { pos: n, box: o } = e, r = i.maxPadding;
  if (!F(n)) {
    e.size && (i[n] -= e.size);
    const d = s[e.stack] || {
      size: 0,
      count: 1
    };
    d.size = Math.max(d.size, e.horizontal ? o.height : o.width), e.size = d.size / d.count, i[n] += e.size;
  }
  o.getPadding && xn(r, o.getPadding());
  const a = Math.max(0, t.outerWidth - ds(r, i, "left", "right")), l = Math.max(0, t.outerHeight - ds(r, i, "top", "bottom")), c = a !== i.w, h = l !== i.h;
  return i.w = a, i.h = l, e.horizontal ? {
    same: c,
    other: h
  } : {
    same: h,
    other: c
  };
}
function va(i) {
  const t = i.maxPadding;
  function e(s) {
    const n = Math.max(t[s] - i[s], 0);
    return i[s] += n, n;
  }
  i.y += e("top"), i.x += e("left"), e("right"), e("bottom");
}
function wa(i, t) {
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
    a = i[o], l = a.box, l.update(a.width || t.w, a.height || t.h, wa(a.horizontal, t));
    const { same: d, other: u } = ya(t, e, a, s);
    c |= d && n.length, h = h || u, l.fullSize || n.push(a);
  }
  return c && Zt(n, t, e, s) || h;
}
function ke(i, t, e, s, n) {
  i.top = e, i.left = t, i.right = t + s, i.bottom = e + n, i.width = s, i.height = n;
}
function us(i, t, e, s) {
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
var tt = {
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
    const n = it(i.options.layout.padding), o = Math.max(t - n.width, 0), r = Math.max(e - n.height, 0), a = xa(i.boxes), l = a.vertical, c = a.horizontal;
    R(i.boxes, (g) => {
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
    xn(u, it(s));
    const f = Object.assign({
      maxPadding: u,
      w: o,
      h: r,
      x: n.left,
      y: n.top
    }, n), m = _a(l.concat(c), d);
    Zt(a.fullSize, f, d, m), Zt(l, f, d, m), Zt(c, f, d, m) && Zt(l, f, d, m), va(f), us(a.leftAndTop, f, d, m), f.x += f.w, f.y += f.h, us(a.rightAndBottom, f, d, m), i.chartArea = {
      left: f.left,
      top: f.top,
      right: f.left + f.w,
      bottom: f.top + f.h,
      height: f.h,
      width: f.w
    }, R(a.chartArea, (g) => {
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
class yn {
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
class ka extends yn {
  acquireContext(t) {
    return t && t.getContext && t.getContext("2d") || null;
  }
  updateConfig(t) {
    t.options.animation = !1;
  }
}
const Ae = "$chartjs", Sa = {
  touchstart: "mousedown",
  touchmove: "mousemove",
  touchend: "mouseup",
  pointerenter: "mouseenter",
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointerleave: "mouseout",
  pointerout: "mouseout"
}, fs = (i) => i === null || i === "";
function Ma(i, t) {
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
  }, e.display = e.display || "block", e.boxSizing = e.boxSizing || "border-box", fs(n)) {
    const o = Ji(i, "width");
    o !== void 0 && (i.width = o);
  }
  if (fs(s))
    if (i.style.height === "")
      i.height = i.width / (t || 2);
    else {
      const o = Ji(i, "height");
      o !== void 0 && (i.height = o);
    }
  return i;
}
const vn = Rr ? {
  passive: !0
} : !1;
function Ca(i, t, e) {
  i && i.addEventListener(t, e, vn);
}
function Da(i, t, e) {
  i && i.canvas && i.canvas.removeEventListener(t, e, vn);
}
function Oa(i, t) {
  const e = Sa[i.type] || i.type, { x: s, y: n } = Ot(i, t);
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
function Pa(i, t, e) {
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
function Ta(i, t, e) {
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
let gs = 0;
function wn() {
  const i = window.devicePixelRatio;
  i !== gs && (gs = i, ue.forEach((t, e) => {
    e.currentDevicePixelRatio !== i && t();
  }));
}
function Aa(i, t) {
  ue.size || window.addEventListener("resize", wn), ue.set(i, t);
}
function La(i) {
  ue.delete(i), ue.size || window.removeEventListener("resize", wn);
}
function Ia(i, t, e) {
  const s = i.canvas, n = s && Ti(s);
  if (!n)
    return;
  const o = sn((a, l) => {
    const c = n.clientWidth;
    e(a, l), c < n.clientWidth && e();
  }, window), r = new ResizeObserver((a) => {
    const l = a[0], c = l.contentRect.width, h = l.contentRect.height;
    c === 0 && h === 0 || o(c, h);
  });
  return r.observe(n), Aa(i, o), r;
}
function ei(i, t, e) {
  e && e.disconnect(), t === "resize" && La(i);
}
function Fa(i, t, e) {
  const s = i.canvas, n = sn((o) => {
    i.ctx !== null && e(Oa(o, i));
  }, i);
  return Ca(s, t, n), n;
}
class Ra extends yn {
  acquireContext(t, e) {
    const s = t && t.getContext && t.getContext("2d");
    return s && s.canvas === t ? (Ma(t, e), s) : null;
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
      attach: Pa,
      detach: Ta,
      resize: Ia
    }[e] || Fa;
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
    }[e] || Da)(t, e, n), s[e] = void 0;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(t, e, s, n) {
    return Fr(t, e, s, n);
  }
  isAttached(t) {
    const e = t && Ti(t);
    return !!(e && e.isConnected);
  }
}
function za(i) {
  return !Pi() || typeof OffscreenCanvas < "u" && i instanceof OffscreenCanvas ? ka : Ra;
}
class gt {
  constructor() {
    A(this, "x");
    A(this, "y");
    A(this, "active", !1);
    A(this, "options");
    A(this, "$animations");
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
A(gt, "defaults", {}), A(gt, "defaultRoutes");
function Ea(i, t) {
  const e = i.options.ticks, s = Ha(i), n = Math.min(e.maxTicksLimit || s, s), o = e.major.enabled ? Na(t) : [], r = o.length, a = o[0], l = o[r - 1], c = [];
  if (r > n)
    return Wa(t, c, o, r / n), c;
  const h = Ba(o, t, n);
  if (r > 0) {
    let d, u;
    const f = r > 1 ? Math.round((l - a) / (r - 1)) : null;
    for (Se(t, c, h, E(f) ? 0 : a - f, a), d = 0, u = r - 1; d < u; d++)
      Se(t, c, h, o[d], o[d + 1]);
    return Se(t, c, h, l, E(f) ? t.length : l + f), c;
  }
  return Se(t, c, h), c;
}
function Ha(i) {
  const t = i.options.offset, e = i._tickSize(), s = i._length / e + (t ? 0 : 1), n = i._maxLength / e;
  return Math.floor(Math.min(s, n));
}
function Ba(i, t, e) {
  const s = Va(i), n = t.length / e;
  if (!s)
    return Math.max(n, 1);
  const o = To(s);
  for (let r = 0, a = o.length - 1; r < a; r++) {
    const l = o[r];
    if (l > n)
      return l;
  }
  return Math.max(n, 1);
}
function Na(i) {
  const t = [];
  let e, s;
  for (e = 0, s = i.length; e < s; e++)
    i[e].major && t.push(e);
  return t;
}
function Wa(i, t, e, s) {
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
function Va(i) {
  const t = i.length;
  let e, s;
  if (t < 2)
    return !1;
  for (s = i[0], e = 1; e < t; ++e)
    if (i[e] - i[e - 1] !== s)
      return !1;
  return s;
}
const ja = (i) => i === "left" ? "right" : i === "right" ? "left" : i, ps = (i, t, e) => t === "top" || t === "left" ? i[t] + e : i[t] - e, ms = (i, t) => Math.min(t || i, i);
function bs(i, t) {
  const e = [], s = i.length / t, n = i.length;
  let o = 0;
  for (; o < n; o += s)
    e.push(i[Math.floor(o)]);
  return e;
}
function $a(i, t, e) {
  const s = i.ticks.length, n = Math.min(t, s - 1), o = i._startPixel, r = i._endPixel, a = 1e-6;
  let l = i.getPixelForTick(n), c;
  if (!(e && (s === 1 ? c = Math.max(l - o, r - l) : t === 0 ? c = (i.getPixelForTick(1) - l) / 2 : c = (l - i.getPixelForTick(n - 1)) / 2, l += n < t ? c : -c, l < o - a || l > r + a)))
    return l;
}
function Ua(i, t) {
  R(i, (e) => {
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
function _s(i, t) {
  if (!i.display)
    return 0;
  const e = Y(i.font, t), s = it(i.padding);
  return (V(i.text) ? i.text.length : 1) * e.lineHeight + s.height;
}
function Ya(i, t) {
  return Ft(i, {
    scale: t,
    type: "scale"
  });
}
function Ga(i, t, e) {
  return Ft(i, {
    tick: e,
    index: t,
    type: "tick"
  });
}
function qa(i, t, e) {
  let s = wi(i);
  return (e && t !== "right" || !e && t === "right") && (s = ja(s)), s;
}
function Xa(i, t, e, s) {
  const { top: n, left: o, bottom: r, right: a, chart: l } = i, { chartArea: c, scales: h } = l;
  let d = 0, u, f, m;
  const g = r - n, p = a - o;
  if (i.isHorizontal()) {
    if (f = U(s, o, a), F(e)) {
      const b = Object.keys(e)[0], y = e[b];
      m = h[b].getPixelForValue(y) + g - t;
    } else e === "center" ? m = (c.bottom + c.top) / 2 + g - t : m = ps(i, e, t);
    u = a - o;
  } else {
    if (F(e)) {
      const b = Object.keys(e)[0], y = e[b];
      f = h[b].getPixelForValue(y) - p + t;
    } else e === "center" ? f = (c.left + c.right) / 2 - p + t : f = ps(i, e, t);
    m = U(s, r, n), d = e === "left" ? -st : st;
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
      minDefined: et(t),
      maxDefined: et(e)
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
    }, s), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + s.left + s.right : this.height + s.top + s.bottom, this._dataLimitsCached || (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = ur(this, o, n), this._dataLimitsCached = !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
    const l = a < this.ticks.length;
    this._convertTicksToLabels(l ? bs(this.ticks, a) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), r.display && (r.autoSkip || r.source === "auto") && (this.ticks = Ea(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), l && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate();
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
    const t = this.options, e = t.ticks, s = ms(this.ticks.length, t.ticks.maxTicksLimit), n = e.minRotation || 0, o = e.maxRotation;
    let r = n, a, l, c;
    if (!this._isVisible() || !e.display || n >= o || s <= 1 || !this.isHorizontal()) {
      this.labelRotation = n;
      return;
    }
    const h = this._getLabelSizes(), d = h.widest.width, u = h.highest.height, f = J(this.chart.width - d, 0, this.maxWidth);
    a = t.offset ? this.maxWidth / s : f / (s - 1), d + 6 > a && (a = f / (s - (t.offset ? 0.5 : 1)), l = this.maxHeight - qt(t.grid) - e.padding - _s(t.title, this.chart.options.font), c = Math.sqrt(d * d + u * u), r = Fo(Math.min(Math.asin(J((h.highest.height + 6) / a, -1, 1)), Math.asin(J(l / c, -1, 1)) - Math.asin(J(u / c, -1, 1)))), r = Math.max(n, Math.min(o, r))), this.labelRotation = r;
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
      const l = _s(n, e.options.font);
      if (a ? (t.width = this.maxWidth, t.height = qt(o) + l) : (t.height = this.maxHeight, t.width = qt(o) + l), s.display && this.ticks.length) {
        const { first: c, last: h, widest: d, highest: u } = this._getLabelSizes(), f = s.padding * 2, m = Tt(this.labelRotation), g = Math.cos(m), p = Math.sin(m);
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
      e < s.length && (s = bs(s, e)), this._labelSizes = t = this._computeLabelSizes(s, s.length, this.options.ticks.maxTicksLimit);
    }
    return t;
  }
  _computeLabelSizes(t, e, s) {
    const { ctx: n, _longestTextCache: o } = this, r = [], a = [], l = Math.floor(e / ms(e, s));
    let c = 0, h = 0, d, u, f, m, g, p, b, y, M, k, w;
    for (d = 0; d < e; d += l) {
      if (m = t[d].label, g = this._resolveTickFontOptions(d), n.font = p = g.string, b = o[p] = o[p] || {
        data: {},
        gc: []
      }, y = g.lineHeight, M = k = 0, !E(m) && !V(m))
        M = qi(n, b.data, b.gc, M, m), k = y;
      else if (V(m))
        for (u = 0, f = m.length; u < f; ++u)
          w = m[u], !E(w) && !V(w) && (M = qi(n, b.data, b.gc, M, w), k += y);
      r.push(M), a.push(k), c = Math.max(M, c), h = Math.max(k, h);
    }
    Ua(o, e);
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
    return Eo(this._alignToPixels ? Ct(this.chart, e, 0) : e);
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
      return s.$context || (s.$context = Ga(this.getContext(), t, s));
    }
    return this.$context || (this.$context = Ya(this.chart.getContext(), this));
  }
  _tickSize() {
    const t = this.options.ticks, e = Tt(this.labelRotation), s = Math.abs(Math.cos(e)), n = Math.abs(Math.sin(e)), o = this._getLabelSizes(), r = t.autoSkipPadding || 0, a = o ? o.widest.width + r : 0, l = o ? o.highest.height + r : 0;
    return this.isHorizontal() ? l * s > a * n ? a / s : l / n : l * n < a * s ? l / s : a / n;
  }
  _isVisible() {
    const t = this.options.display;
    return t !== "auto" ? !!t : this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(t) {
    const e = this.axis, s = this.chart, n = this.options, { grid: o, position: r, border: a } = n, l = o.offset, c = this.isHorizontal(), d = this.ticks.length + (l ? 1 : 0), u = qt(o), f = [], m = a.setContext(this.getContext()), g = m.display ? m.width : 0, p = g / 2, b = function(N) {
      return Ct(s, N, g);
    };
    let y, M, k, w, D, O, C, x, _, P, T, S;
    if (r === "top")
      y = b(this.bottom), O = this.bottom - u, x = y - p, P = b(t.top) + p, S = t.bottom;
    else if (r === "bottom")
      y = b(this.top), P = t.top, S = b(t.bottom) - p, O = y + p, x = this.top + u;
    else if (r === "left")
      y = b(this.right), D = this.right - u, C = y - p, _ = b(t.left) + p, T = t.right;
    else if (r === "right")
      y = b(this.left), _ = t.left, T = b(t.right) - p, D = y + p, C = this.left + u;
    else if (e === "x") {
      if (r === "center")
        y = b((t.top + t.bottom) / 2 + 0.5);
      else if (F(r)) {
        const N = Object.keys(r)[0], $ = r[N];
        y = b(this.chart.scales[N].getPixelForValue($));
      }
      P = t.top, S = t.bottom, O = y + p, x = O + u;
    } else if (e === "y") {
      if (r === "center")
        y = b((t.left + t.right) / 2);
      else if (F(r)) {
        const N = Object.keys(r)[0], $ = r[N];
        y = b(this.chart.scales[N].getPixelForValue($));
      }
      D = y - p, C = D - u, _ = t.left, T = t.right;
    }
    const z = I(n.ticks.maxTicksLimit, d), L = Math.max(1, Math.ceil(d / z));
    for (M = 0; M < d; M += L) {
      const N = this.getContext(M), $ = o.setContext(N), yt = a.setContext(N), vt = $.lineWidth, ct = $.color, wt = yt.dash || [], Q = yt.dashOffset, jt = $.tickWidth, kt = $.tickColor, $t = $.tickBorderDash || [], St = $.tickBorderDashOffset;
      k = $a(this, M, l), k !== void 0 && (w = Ct(s, k, vt), c ? D = C = _ = T = w : O = x = P = S = w, f.push({
        tx1: D,
        ty1: O,
        tx2: C,
        ty2: x,
        x1: _,
        y1: P,
        x2: T,
        y2: S,
        width: vt,
        color: ct,
        borderDash: wt,
        borderDashOffset: Q,
        tickWidth: jt,
        tickColor: kt,
        tickBorderDash: $t,
        tickBorderDashOffset: St
      }));
    }
    return this._ticksLength = d, this._borderValue = y, f;
  }
  _computeLabelItems(t) {
    const e = this.axis, s = this.options, { position: n, ticks: o } = s, r = this.isHorizontal(), a = this.ticks, { align: l, crossAlign: c, padding: h, mirror: d } = o, u = qt(s.grid), f = u + h, m = d ? -h : f, g = -Tt(this.labelRotation), p = [];
    let b, y, M, k, w, D, O, C, x, _, P, T, S = "middle";
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
    e === "y" && (l === "start" ? S = "top" : l === "end" && (S = "bottom"));
    const z = this._getLabelSizes();
    for (b = 0, y = a.length; b < y; ++b) {
      M = a[b], k = M.label;
      const L = o.setContext(this.getContext(b));
      C = this.getPixelForTick(b) + o.labelOffset, x = this._resolveTickFontOptions(b), _ = x.lineHeight, P = V(k) ? k.length : 1;
      const N = P / 2, $ = L.color, yt = L.textStrokeColor, vt = L.textStrokeWidth;
      let ct = O;
      r ? (w = C, O === "inner" && (b === y - 1 ? ct = this.options.reverse ? "left" : "right" : b === 0 ? ct = this.options.reverse ? "right" : "left" : ct = "center"), n === "top" ? c === "near" || g !== 0 ? T = -P * _ + _ / 2 : c === "center" ? T = -z.highest.height / 2 - N * _ + _ : T = -z.highest.height + _ / 2 : c === "near" || g !== 0 ? T = _ / 2 : c === "center" ? T = z.highest.height / 2 - N * _ : T = z.highest.height - P * _, d && (T *= -1), g !== 0 && !L.showLabelBackdrop && (w += _ / 2 * Math.sin(g))) : (D = C, T = (1 - P) * _ / 2);
      let wt;
      if (L.showLabelBackdrop) {
        const Q = it(L.backdropPadding), jt = z.heights[b], kt = z.widths[b];
        let $t = T - Q.top, St = 0 - Q.left;
        switch (S) {
          case "middle":
            $t -= jt / 2;
            break;
          case "bottom":
            $t -= jt;
            break;
        }
        switch (O) {
          case "center":
            St -= kt / 2;
            break;
          case "right":
            St -= kt;
            break;
          case "inner":
            b === y - 1 ? St -= kt : b > 0 && (St -= kt / 2);
            break;
        }
        wt = {
          left: St,
          top: $t,
          width: kt + Q.width,
          height: jt + Q.height,
          color: L.backdropColor
        };
      }
      p.push({
        label: k,
        font: x,
        textOffset: T,
        options: {
          rotation: g,
          color: $,
          strokeColor: yt,
          strokeWidth: vt,
          textAlign: ct,
          textBaseline: S,
          translation: [
            w,
            D
          ],
          backdrop: wt
        }
      });
    }
    return p;
  }
  _getXAxisLabelAlignment() {
    const { position: t, ticks: e } = this.options;
    if (-Tt(this.labelRotation))
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
    this.isHorizontal() ? (c = Ct(t, this.left, r) - r / 2, h = Ct(t, this.right, a) + a / 2, d = u = l) : (d = Ct(t, this.top, r) - r / 2, u = Ct(t, this.bottom, a) + a / 2, c = h = l), e.save(), e.lineWidth = o.width, e.strokeStyle = o.color, e.beginPath(), e.moveTo(c, d), e.lineTo(h, u), e.stroke(), e.restore();
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
    const o = Y(s.font), r = it(s.padding), a = s.align;
    let l = o.lineHeight / 2;
    e === "bottom" || e === "center" || F(e) ? (l += r.bottom, V(s.text) && (l += o.lineHeight * (s.text.length - 1))) : l += r.top;
    const { titleX: c, titleY: h, maxWidth: d, rotation: u } = Xa(this, l, e, a);
    de(t, s.text, 0, 0, o, {
      color: s.color,
      maxWidth: d,
      rotation: u,
      textAlign: qa(a, e, n),
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
    Za(e) && (s = this.register(e));
    const n = this.items, o = t.id, r = this.scope + "." + o;
    if (!o)
      throw new Error("class does not have id: " + t);
    return o in n || (n[o] = t, Ka(t, r, s), this.override && W.override(t.id, t.overrides)), r;
  }
  get(t) {
    return this.items[t];
  }
  unregister(t) {
    const e = this.items, s = t.id, n = this.scope;
    s in e && delete e[s], n && s in W[n] && (delete W[n][s], this.override && delete It[s]);
  }
}
function Ka(i, t, e) {
  const s = le(/* @__PURE__ */ Object.create(null), [
    e ? W.get(e) : {},
    W.get(t),
    i.defaults
  ]);
  W.set(t, s), i.defaultRoutes && Qa(t, i.defaultRoutes), i.descriptors && W.describe(t, i.descriptors);
}
function Qa(i, t) {
  Object.keys(t).forEach((e) => {
    const s = e.split("."), n = s.pop(), o = [
      i
    ].concat(s).join("."), r = t[e].split("."), a = r.pop(), l = r.join(".");
    W.route(o, n, l, a);
  });
}
function Za(i) {
  return "id" in i && "defaults" in i;
}
class Ja {
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
      s || o.isForType(n) || o === this.plugins && n.id ? this._exec(t, o, n) : R(n, (r) => {
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
var at = /* @__PURE__ */ new Ja();
class tl {
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
    const s = t && t.config, n = I(s.options && s.options.plugins, {}), o = el(s);
    return n === !1 && !e ? [] : sl(t, o, n, e);
  }
  _notifyStateChanges(t) {
    const e = this._oldCache || [], s = this._cache, n = (o, r) => o.filter((a) => !r.some((l) => a.plugin.id === l.plugin.id));
    this._notify(n(e, s), t, "stop"), this._notify(n(s, e), t, "start");
  }
}
function el(i) {
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
function il(i, t) {
  return !t && i === !1 ? null : i === !0 ? {} : i;
}
function sl(i, { plugins: t, localIds: e }, s, n) {
  const o = [], r = i.getContext();
  for (const a of t) {
    const l = a.id, c = il(s[l], n);
    c !== null && o.push({
      plugin: a,
      options: nl(i.config, {
        plugin: a,
        local: e[l]
      }, c, r)
    });
  }
  return o;
}
function nl(i, { plugin: t, local: e }, s, n) {
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
function ol(i, t) {
  let e = i;
  return i === "_index_" ? e = t : i === "_value_" && (e = t === "x" ? "y" : "x"), e;
}
function rl(i, t) {
  return i === t ? "_index_" : "_value_";
}
function xs(i) {
  if (i === "x" || i === "y" || i === "r")
    return i;
}
function al(i) {
  if (i === "top" || i === "bottom")
    return "x";
  if (i === "left" || i === "right")
    return "y";
}
function di(i, ...t) {
  if (xs(i))
    return i;
  for (const e of t) {
    const s = e.axis || al(e.position) || i.length > 1 && xs(i[0].toLowerCase());
    if (s)
      return s;
  }
  throw new Error(`Cannot determine type of '${i}' axis. Please provide 'axis' or 'position' option.`);
}
function ys(i, t, e) {
  if (e[t + "AxisID"] === i)
    return {
      axis: t
    };
}
function ll(i, t) {
  if (t.data && t.data.datasets) {
    const e = t.data.datasets.filter((s) => s.xAxisID === i || s.yAxisID === i);
    if (e.length)
      return ys(i, "x", e[0]) || ys(i, "y", e[0]);
  }
  return {};
}
function cl(i, t) {
  const e = It[i.type] || {
    scales: {}
  }, s = t.scales || {}, n = hi(i.type, t), o = /* @__PURE__ */ Object.create(null);
  return Object.keys(s).forEach((r) => {
    const a = s[r];
    if (!F(a))
      return console.error(`Invalid scale configuration for scale: ${r}`);
    if (a._proxy)
      return console.warn(`Ignoring resolver passed as options for scale: ${r}`);
    const l = di(r, a, ll(r, i), W.scales[a.type]), c = rl(l, n), h = e.scales || {};
    o[r] = ee(/* @__PURE__ */ Object.create(null), [
      {
        axis: l
      },
      a,
      h[l],
      h[c]
    ]);
  }), i.data.datasets.forEach((r) => {
    const a = r.type || i.type, l = r.indexAxis || hi(a, t), h = (It[a] || {}).scales || {};
    Object.keys(h).forEach((d) => {
      const u = ol(d, l), f = r[u + "AxisID"] || u;
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
function kn(i) {
  const t = i.options || (i.options = {});
  t.plugins = I(t.plugins, {}), t.scales = cl(i, t);
}
function Sn(i) {
  return i = i || {}, i.datasets = i.datasets || [], i.labels = i.labels || [], i;
}
function hl(i) {
  return i = i || {}, i.data = Sn(i.data), kn(i), i;
}
const vs = /* @__PURE__ */ new Map(), Mn = /* @__PURE__ */ new Set();
function Ce(i, t) {
  let e = vs.get(i);
  return e || (e = t(), vs.set(i, e), Mn.add(e)), e;
}
const Xt = (i, t, e) => {
  const s = ze(t, e);
  s !== void 0 && i.add(s);
};
class dl {
  constructor(t) {
    this._config = hl(t), this._scopeCache = /* @__PURE__ */ new Map(), this._resolverCache = /* @__PURE__ */ new Map();
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
    this._config.data = Sn(t);
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
    this.clearCache(), kn(t);
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
      t && (l.add(t), h.forEach((d) => Xt(l, t, d))), h.forEach((d) => Xt(l, n, d)), h.forEach((d) => Xt(l, It[o] || {}, d)), h.forEach((d) => Xt(l, W, d)), h.forEach((d) => Xt(l, ai, d));
    });
    const c = Array.from(l);
    return c.length === 0 && c.push(/* @__PURE__ */ Object.create(null)), Mn.has(e) && r.set(e, c), c;
  }
  chartOptionScopes() {
    const { options: t, type: e } = this;
    return [
      t,
      It[e] || {},
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
    }, { resolver: r, subPrefixes: a } = ws(this._resolverCache, t, n);
    let l = r;
    if (fl(r, e)) {
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
    const { resolver: o } = ws(this._resolverCache, t, s);
    return F(e) ? Nt(o, e, void 0, n) : o;
  }
}
function ws(i, t, e) {
  let s = i.get(t);
  s || (s = /* @__PURE__ */ new Map(), i.set(t, s));
  const n = e.join();
  let o = s.get(n);
  return o || (o = {
    resolver: Ci(t, e),
    subPrefixes: e.filter((a) => !a.toLowerCase().includes("hover"))
  }, s.set(n, o)), o;
}
const ul = (i) => F(i) && Object.getOwnPropertyNames(i).some((t) => xt(i[t]));
function fl(i, t) {
  const { isScriptable: e, isIndexable: s } = ln(i);
  for (const n of t) {
    const o = e(n), r = s(n), a = (r || o) && i[n];
    if (o && (xt(a) || ul(a)) || r && V(a))
      return !0;
  }
  return !1;
}
var gl = "4.5.0";
const pl = [
  "top",
  "bottom",
  "left",
  "right",
  "chartArea"
];
function ks(i, t) {
  return i === "top" || i === "bottom" || pl.indexOf(i) === -1 && t === "x";
}
function Ss(i, t) {
  return function(e, s) {
    return e[i] === s[i] ? e[t] - s[t] : e[i] - s[i];
  };
}
function Ms(i) {
  const t = i.chart, e = t.options.animation;
  t.notifyPlugins("afterRender"), B(e && e.onComplete, [
    i
  ], t);
}
function ml(i) {
  const t = i.chart, e = t.options.animation;
  B(e && e.onProgress, [
    i
  ], t);
}
function Cn(i) {
  return Pi() && typeof i == "string" ? i = document.getElementById(i) : i && i.length && (i = i[0]), i && i.canvas && (i = i.canvas), i;
}
const Le = {}, Cs = (i) => {
  const t = Cn(i);
  return Object.values(Le).filter((e) => e.canvas === t).pop();
};
function bl(i, t, e) {
  const s = Object.keys(i);
  for (const n of s) {
    const o = +n;
    if (o >= t) {
      const r = i[n];
      delete i[n], (e > 0 || o > t) && (i[o + e] = r);
    }
  }
}
function _l(i, t, e, s) {
  return !e || i.type === "mouseout" ? null : s ? t : i;
}
var pt;
let $e = (pt = class {
  static register(...t) {
    at.add(...t), Ds();
  }
  static unregister(...t) {
    at.remove(...t), Ds();
  }
  constructor(t, e) {
    const s = this.config = new dl(e), n = Cn(t), o = Cs(n);
    if (o)
      throw new Error("Canvas is already in use. Chart with ID '" + o.id + "' must be destroyed before the canvas with ID '" + o.canvas.id + "' can be reused.");
    const r = s.createResolver(s.chartOptionScopes(), this.getContext());
    this.platform = new (s.platform || za(n))(), this.platform.updateConfig(s);
    const a = this.platform.acquireContext(n, r.aspectRatio), l = a && a.canvas, c = l && l.height, h = l && l.width;
    if (this.id = vo(), this.ctx = a, this.canvas = l, this.width = h, this.height = c, this._options = r, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new tl(), this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = Vo((d) => this.update(d), r.resizeDelay || 0), this._dataChanges = [], Le[this.id] = this, !a || !l) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    dt.listen(this, "complete", Ms), dt.listen(this, "progress", ml), this._initialize(), this.attached && this.update();
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
    return this.notifyPlugins("beforeInit"), this.options.responsive ? this.resize() : Zi(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins("afterInit"), this;
  }
  clear() {
    return Xi(this.canvas, this.ctx), this;
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
    this.width = r.width, this.height = r.height, this._aspectRatio = this.aspectRatio, Zi(this, a, !0) && (this.notifyPlugins("resize", {
      size: r
    }), B(s.onResize, [
      this,
      r
    ], this), this.attached && this._doResize(l) && this.render());
  }
  ensureScalesHaveIDs() {
    const e = this.options.scales || {};
    R(e, (s, n) => {
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
    }))), R(o, (r) => {
      const a = r.options, l = a.id, c = di(l, a), h = I(a.type, r.dtype);
      (a.position === void 0 || ks(a.position, c) !== ks(r.dposition)) && (a.position = r.dposition), n[l] = !0;
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
    }), R(n, (r, a) => {
      r || delete s[a];
    }), R(s, (r) => {
      tt.configure(this, r, r.options), tt.addBox(this, r);
    });
  }
  _updateMetasets() {
    const t = this._metasets, e = this.data.datasets.length, s = t.length;
    if (t.sort((n, o) => n.index - o.index), s > e) {
      for (let n = e; n < s; ++n)
        this._destroyDatasetMeta(n);
      t.splice(e, s - e);
    }
    this._sortedMetasets = t.slice(0).sort(Ss("order", "index"));
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
    R(this.data.datasets, (t, e) => {
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
    r = this._minPadding = s.layout.autoPadding ? r : 0, this._updateLayout(r), n || R(o, (c) => {
      c.reset();
    }), this._updateDatasets(t), this.notifyPlugins("afterUpdate", {
      mode: t
    }), this._layers.sort(Ss("z", "_idx"));
    const { _active: a, _lastEvent: l } = this;
    l ? this._eventHandler(l, !0) : a.length && this._updateHoverStyles(a, a, !0), this.render();
  }
  _updateScales() {
    R(this.scales, (t) => {
      tt.removeBox(this, t);
    }), this.ensureScalesHaveIDs(), this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const t = this.options, e = new Set(Object.keys(this._listeners)), s = new Set(t.events);
    (!Bi(e, s) || !!this._responsiveListeners !== t.responsive) && (this.unbindEvents(), this.bindEvents());
  }
  _updateHiddenIndices() {
    const { _hiddenIndices: t } = this, e = this._getUniformDataChanges() || [];
    for (const { method: s, start: n, count: o } of e) {
      const r = s === "_removeElements" ? -o : o;
      bl(t, n, r);
    }
  }
  _getUniformDataChanges() {
    const t = this._dataChanges;
    if (!t || !t.length)
      return;
    this._dataChanges = [];
    const e = this.data.datasets.length, s = (o) => new Set(t.filter((r) => r[0] === o).map((r, a) => a + "," + r.splice(1).join(","))), n = s(0);
    for (let o = 1; o < e; o++)
      if (!Bi(n, s(o)))
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
    tt.update(this, this.width, this.height, t);
    const e = this.chartArea, s = e.width <= 0 || e.height <= 0;
    this._layers = [], R(this.boxes, (n) => {
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
    }) !== !1 && (dt.has(this) ? this.attached && !dt.running(this) && dt.start(this) : (this.draw(), Ms({
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
    }, n = Xr(this, t);
    this.notifyPlugins("beforeDatasetDraw", s) !== !1 && (n && Si(e, n), t.controller.draw(), n && Mi(e), s.cancelable = !1, this.notifyPlugins("afterDatasetDraw", s));
  }
  isPointInArea(t) {
    return he(t, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(t, e, s, n) {
    const o = pa.modes[e];
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
    return this.$context || (this.$context = Ft(null, {
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
    this._stop(), this.config.clearCache(), t && (this.unbindEvents(), Xi(t, e), this.platform.releaseContext(e), this.canvas = null, this.ctx = null), delete Le[this.id], this.notifyPlugins("afterDestroy");
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
    R(this.options.events, (o) => s(o, n));
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
    R(this._listeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }), this._listeners = {}, R(this._responsiveListeners, (t, e) => {
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
    const { _active: n = [], options: o } = this, r = e, a = this._getActiveElements(t, n, s, r), l = Do(t), c = _l(t, this._lastEvent, s, l);
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
}, A(pt, "defaults", W), A(pt, "instances", Le), A(pt, "overrides", It), A(pt, "registry", at), A(pt, "version", gl), A(pt, "getChart", Cs), pt);
function Ds() {
  return R($e.instances, (i) => i._plugins.invalidate());
}
function Dn(i, t, e = t) {
  i.lineCap = I(e.borderCapStyle, t.borderCapStyle), i.setLineDash(I(e.borderDash, t.borderDash)), i.lineDashOffset = I(e.borderDashOffset, t.borderDashOffset), i.lineJoin = I(e.borderJoinStyle, t.borderJoinStyle), i.lineWidth = I(e.borderWidth, t.borderWidth), i.strokeStyle = I(e.borderColor, t.borderColor);
}
function xl(i, t, e) {
  i.lineTo(e.x, e.y);
}
function yl(i) {
  return i.stepped ? ir : i.tension || i.cubicInterpolationMode === "monotone" ? sr : xl;
}
function On(i, t, e = {}) {
  const s = i.length, { start: n = 0, end: o = s - 1 } = e, { start: r, end: a } = t, l = Math.max(n, r), c = Math.min(o, a), h = n < r && o < r || n > a && o > a;
  return {
    count: s,
    start: l,
    loop: t.loop,
    ilen: c < l && !h ? s + c - l : c - l
  };
}
function vl(i, t, e, s) {
  const { points: n, options: o } = t, { count: r, start: a, loop: l, ilen: c } = On(n, e, s), h = yl(o);
  let { move: d = !0, reverse: u } = s || {}, f, m, g;
  for (f = 0; f <= c; ++f)
    m = n[(a + (u ? c - f : f)) % r], !m.skip && (d ? (i.moveTo(m.x, m.y), d = !1) : h(i, g, m, u, o.stepped), g = m);
  return l && (m = n[(a + (u ? c : 0)) % r], h(i, g, m, u, o.stepped)), !!l;
}
function wl(i, t, e, s) {
  const n = t.points, { count: o, start: r, ilen: a } = On(n, e, s), { move: l = !0, reverse: c } = s || {};
  let h = 0, d = 0, u, f, m, g, p, b;
  const y = (k) => (r + (c ? a - k : k)) % o, M = () => {
    g !== p && (i.lineTo(h, p), i.lineTo(h, g), i.lineTo(h, b));
  };
  for (l && (f = n[y(0)], i.moveTo(f.x, f.y)), u = 0; u <= a; ++u) {
    if (f = n[y(u)], f.skip)
      continue;
    const k = f.x, w = f.y, D = k | 0;
    D === m ? (w < g ? g = w : w > p && (p = w), h = (d * h + k) / ++d) : (M(), i.lineTo(k, w), m = D, d = 0, g = p = w), b = w;
  }
  M();
}
function ui(i) {
  const t = i.options, e = t.borderDash && t.borderDash.length;
  return !i._decimated && !i._loop && !t.tension && t.cubicInterpolationMode !== "monotone" && !t.stepped && !e ? wl : vl;
}
function kl(i) {
  return i.stepped ? zr : i.tension || i.cubicInterpolationMode === "monotone" ? Er : Pt;
}
function Sl(i, t, e, s) {
  let n = t._path;
  n || (n = t._path = new Path2D(), t.path(n, e, s) && n.closePath()), Dn(i, t.options), i.stroke(n);
}
function Ml(i, t, e, s) {
  const { segments: n, options: o } = t, r = ui(t);
  for (const a of n)
    Dn(i, o, a.style), i.beginPath(), r(i, t, a, {
      start: e,
      end: e + s - 1
    }) && i.closePath(), i.stroke();
}
const Cl = typeof Path2D == "function";
function Dl(i, t, e, s) {
  Cl && !t.options.segment ? Sl(i, t, e, s) : Ml(i, t, e, s);
}
class Jt extends gt {
  constructor(t) {
    super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, t && Object.assign(this, t);
  }
  updateControlPoints(t, e) {
    const s = this.options;
    if ((s.tension || s.cubicInterpolationMode === "monotone") && !s.stepped && !this._pointsUpdated) {
      const n = s.spanGaps ? this._loop : this._fullLoop;
      Or(this._points, s, t, n, e), this._pointsUpdated = !0;
    }
  }
  set points(t) {
    this._points = t, delete this._segments, delete this._path, this._pointsUpdated = !1;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = Ur(this, this.options.segment));
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
    const s = this.options, n = t[e], o = this.points, r = Vr(this, {
      property: e,
      start: n,
      end: n
    });
    if (!r.length)
      return;
    const a = [], l = kl(s);
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
    (this.points || []).length && o.borderWidth && (t.save(), Dl(t, this, s, n), t.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0);
  }
}
A(Jt, "id", "line"), A(Jt, "defaults", {
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
}), A(Jt, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
}), A(Jt, "descriptors", {
  _scriptable: !0,
  _indexable: (t) => t !== "borderDash" && t !== "fill"
});
function Os(i, t, e, s) {
  const n = i.options, { [e]: o } = i.getProps([
    e
  ], s);
  return Math.abs(t - o) < n.radius + n.hitRadius;
}
class Ie extends gt {
  constructor(e) {
    super();
    A(this, "parsed");
    A(this, "skip");
    A(this, "stop");
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
    return Os(this, e, "x", s);
  }
  inYRange(e, s) {
    return Os(this, e, "y", s);
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
A(Ie, "id", "point"), /**
* @type {any}
*/
A(Ie, "defaults", {
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
A(Ie, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
const Ps = (i, t) => {
  let { boxHeight: e = t, boxWidth: s = t } = i;
  return i.usePointStyle && (e = Math.min(e, t), s = i.pointStyleWidth || Math.min(s, t)), {
    boxWidth: s,
    boxHeight: e,
    itemHeight: Math.max(t, e)
  };
}, Ol = (i, t) => i !== null && t !== null && i.datasetIndex === t.datasetIndex && i.index === t.index;
class Ts extends gt {
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
    const s = t.labels, n = Y(s.font), o = n.size, r = this._computeTitleHeight(), { boxWidth: a, itemHeight: l } = Ps(s, o);
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
      const { itemWidth: y, itemHeight: M } = Pl(s, e, o, p, n);
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
    const { boxWidth: m, boxHeight: g, itemHeight: p } = Ps(r, d), b = function(D, O, C) {
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
        }, P = l.xPlus(D, m / 2), T = O + u;
        rn(n, _, P, T, r.pointStyleWidth && m);
      } else {
        const _ = O + Math.max((d - g) / 2, 0), P = l.leftForLtr(D, m), T = oe(C.borderRadius);
        n.beginPath(), Object.values(T).some((S) => S !== 0) ? ci(n, {
          x: P,
          y: _,
          w: m,
          h: g,
          radius: T
        }) : n.rect(P, _, m, g), n.fill(), x !== 0 && n.stroke();
      }
      n.restore();
    }, y = function(D, O, C) {
      de(n, C.text, D, O + p / 2, c, {
        strikethrough: C.hidden,
        textAlign: l.textAlign(C.textAlign)
      });
    }, M = this.isHorizontal(), k = this._computeTitleHeight();
    M ? f = {
      x: U(o, this.left + h, this.right - s[0]),
      y: this.top + h + k,
      line: 0
    } : f = {
      x: this.left + h,
      y: U(o, this.top + k + h, this.bottom - e[0].height),
      line: 0
    }, fn(this.ctx, t.textDirection);
    const w = p + h;
    this.legendItems.forEach((D, O) => {
      n.strokeStyle = D.fontColor, n.fillStyle = D.fontColor;
      const C = n.measureText(D.text).width, x = l.textAlign(D.textAlign || (D.textAlign = r.textAlign)), _ = m + u + C;
      let P = f.x, T = f.y;
      l.setWidth(this.width), M ? O > 0 && P + _ + h > this.right && (T = f.y += w, f.line++, P = f.x = U(o, this.left + h, this.right - s[f.line])) : O > 0 && T + w > this.bottom && (P = f.x = P + e[f.line].width + h, f.line++, T = f.y = U(o, this.top + k + h, this.bottom - e[f.line].height));
      const S = l.x(P);
      if (b(S, T, D), P = jo(x, P + m + u, M ? P + _ : this.right, t.rtl), y(l.x(P), T, D), M)
        f.x += _ + h;
      else if (typeof D.text != "string") {
        const z = c.lineHeight;
        f.y += Pn(D, z) + h;
      } else
        f.y += w;
    }), gn(this.ctx, t.textDirection);
  }
  drawTitle() {
    const t = this.options, e = t.title, s = Y(e.font), n = it(e.padding);
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
    const t = this.options.title, e = Y(t.font), s = it(t.padding);
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
    if (!Ll(t.type, e))
      return;
    const s = this._getLegendItemAt(t.x, t.y);
    if (t.type === "mousemove" || t.type === "mouseout") {
      const n = this._hoveredItem, o = Ol(n, s);
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
function Pl(i, t, e, s, n) {
  const o = Tl(s, i, t, e), r = Al(n, s, t.lineHeight);
  return {
    itemWidth: o,
    itemHeight: r
  };
}
function Tl(i, t, e, s) {
  let n = i.text;
  return n && typeof n != "string" && (n = n.reduce((o, r) => o.length > r.length ? o : r)), t + e.size / 2 + s.measureText(n).width;
}
function Al(i, t, e) {
  let s = i;
  return typeof t.text != "string" && (s = Pn(t, e)), s;
}
function Pn(i, t) {
  const e = i.text ? i.text.length : 0;
  return t * e;
}
function Ll(i, t) {
  return !!((i === "mousemove" || i === "mouseout") && (t.onHover || t.onLeave) || t.onClick && (i === "click" || i === "mouseup"));
}
var Il = {
  id: "legend",
  _element: Ts,
  start(i, t, e) {
    const s = i.legend = new Ts({
      ctx: i.ctx,
      options: e,
      chart: i
    });
    tt.configure(i, s, e), tt.addBox(i, s);
  },
  stop(i) {
    tt.removeBox(i, i.legend), delete i.legend;
  },
  beforeUpdate(i, t, e) {
    const s = i.legend;
    tt.configure(i, s, e), s.options = e;
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
          const c = l.controller.getStyle(e ? 0 : void 0), h = it(c.borderWidth);
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
class Tn extends gt {
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
    this._padding = it(s.padding);
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
function Fl(i, t) {
  const e = new Tn({
    ctx: i.ctx,
    options: t,
    chart: i
  });
  tt.configure(i, e, t), tt.addBox(i, e), i.titleBlock = e;
}
var Rl = {
  id: "title",
  _element: Tn,
  start(i, t, e) {
    Fl(i, e);
  },
  stop(i) {
    const t = i.titleBlock;
    tt.removeBox(i, t), delete i.titleBlock;
  },
  beforeUpdate(i, t, e) {
    const s = i.titleBlock;
    tt.configure(i, s, e), s.options = e;
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
function zl(i, t) {
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
function As(i, t) {
  const e = i.chart.ctx, { body: s, footer: n, title: o } = i, { boxWidth: r, boxHeight: a } = t, l = Y(t.bodyFont), c = Y(t.titleFont), h = Y(t.footerFont), d = o.length, u = n.length, f = s.length, m = it(t.padding);
  let g = m.height, p = 0, b = s.reduce((k, w) => k + w.before.length + w.lines.length + w.after.length, 0);
  if (b += i.beforeBody.length + i.afterBody.length, d && (g += d * c.lineHeight + (d - 1) * t.titleSpacing + t.titleMarginBottom), b) {
    const k = t.displayColors ? Math.max(a, l.lineHeight) : l.lineHeight;
    g += f * k + (b - f) * l.lineHeight + (b - 1) * t.bodySpacing;
  }
  u && (g += t.footerMarginTop + u * h.lineHeight + (u - 1) * t.footerSpacing);
  let y = 0;
  const M = function(k) {
    p = Math.max(p, e.measureText(k).width + y);
  };
  return e.save(), e.font = c.string, R(i.title, M), e.font = l.string, R(i.beforeBody.concat(i.afterBody), M), y = t.displayColors ? r + 2 + t.boxPadding : 0, R(s, (k) => {
    R(k.before, M), R(k.lines, M), R(k.after, M);
  }), y = 0, e.font = h.string, R(i.footer, M), e.restore(), p += m.width, {
    width: p,
    height: g
  };
}
function El(i, t) {
  const { y: e, height: s } = t;
  return e < s / 2 ? "top" : e > i.height - s / 2 ? "bottom" : "center";
}
function Hl(i, t, e, s) {
  const { x: n, width: o } = s, r = e.caretSize + e.caretPadding;
  if (i === "left" && n + o + r > t.width || i === "right" && n - o - r < 0)
    return !0;
}
function Bl(i, t, e, s) {
  const { x: n, width: o } = e, { width: r, chartArea: { left: a, right: l } } = i;
  let c = "center";
  return s === "center" ? c = n <= (a + l) / 2 ? "left" : "right" : n <= o / 2 ? c = "left" : n >= r - o / 2 && (c = "right"), Hl(c, i, t, e) && (c = "center"), c;
}
function Ls(i, t, e) {
  const s = e.yAlign || t.yAlign || El(i, e);
  return {
    xAlign: e.xAlign || t.xAlign || Bl(i, t, e, s),
    yAlign: s
  };
}
function Nl(i, t) {
  let { x: e, width: s } = i;
  return t === "right" ? e -= s : t === "center" && (e -= s / 2), e;
}
function Wl(i, t, e) {
  let { y: s, height: n } = i;
  return t === "top" ? s += e : t === "bottom" ? s -= n + e : s -= n / 2, s;
}
function Is(i, t, e, s) {
  const { caretSize: n, caretPadding: o, cornerRadius: r } = i, { xAlign: a, yAlign: l } = e, c = n + o, { topLeft: h, topRight: d, bottomLeft: u, bottomRight: f } = oe(r);
  let m = Nl(t, a);
  const g = Wl(t, l, c);
  return l === "center" ? a === "left" ? m += c : a === "right" && (m -= c) : a === "left" ? m -= Math.max(h, u) + n : a === "right" && (m += Math.max(d, f) + n), {
    x: J(m, 0, s.width - t.width),
    y: J(g, 0, s.height - t.height)
  };
}
function De(i, t, e) {
  const s = it(e.padding);
  return t === "center" ? i.x + i.width / 2 : t === "right" ? i.x + i.width - s.right : i.x + s.left;
}
function Fs(i) {
  return rt([], ut(i));
}
function Vl(i, t, e) {
  return Ft(i, {
    tooltip: t,
    tooltipItems: e,
    type: "tooltip"
  });
}
function Rs(i, t) {
  const e = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
  return e ? i.override(e) : i;
}
const An = {
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
  return typeof n > "u" ? An[t].call(e, s) : n;
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
    const e = this.chart, s = this.options.setContext(this.getContext()), n = s.enabled && e.options.animation && s.animations, o = new mn(this.chart, n);
    return n._cacheable && (this._cachedAnimations = Object.freeze(o)), o;
  }
  getContext() {
    return this.$context || (this.$context = Vl(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(t, e) {
    const { callbacks: s } = e, n = G(s, "beforeTitle", this, t), o = G(s, "title", this, t), r = G(s, "afterTitle", this, t);
    let a = [];
    return a = rt(a, ut(n)), a = rt(a, ut(o)), a = rt(a, ut(r)), a;
  }
  getBeforeBody(t, e) {
    return Fs(G(e.callbacks, "beforeBody", this, t));
  }
  getBody(t, e) {
    const { callbacks: s } = e, n = [];
    return R(t, (o) => {
      const r = {
        before: [],
        lines: [],
        after: []
      }, a = Rs(s, o);
      rt(r.before, ut(G(a, "beforeLabel", this, o))), rt(r.lines, G(a, "label", this, o)), rt(r.after, ut(G(a, "afterLabel", this, o))), n.push(r);
    }), n;
  }
  getAfterBody(t, e) {
    return Fs(G(e.callbacks, "afterBody", this, t));
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
      a.push(zl(this.chart, e[l]));
    return t.filter && (a = a.filter((h, d, u) => t.filter(h, d, u, s))), t.itemSort && (a = a.sort((h, d) => t.itemSort(h, d, s))), R(a, (h) => {
      const d = Rs(t.callbacks, h);
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
      const l = this._size = As(this, s), c = Object.assign({}, a, l), h = Ls(this.chart, s, c), d = Is(s, c, h, this.chart);
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
    let p, b, y, M, k, w;
    return o === "center" ? (k = f + g / 2, n === "left" ? (p = u, b = p - r, M = k + r, w = k - r) : (p = u + m, b = p + r, M = k - r, w = k + r), y = p) : (n === "left" ? b = u + Math.max(l, h) + r : n === "right" ? b = u + m - Math.max(c, d) - r : b = this.caretX, o === "top" ? (M = f, k = M - r, p = b - r, y = b + r) : (M = f + g, k = M + r, p = b + r, y = b - r), w = M), {
      x1: p,
      x2: b,
      x3: y,
      y1: M,
      y2: k,
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
    let b, y, M, k, w, D, O;
    for (e.textAlign = r, e.textBaseline = "middle", e.font = d.string, t.x = De(this, p, s), e.fillStyle = s.bodyColor, R(this.beforeBody, g), f = a && p !== "right" ? r === "center" ? c / 2 + h : c + 2 + h : 0, k = 0, D = n.length; k < D; ++k) {
      for (b = n[k], y = this.labelTextColors[k], e.fillStyle = y, R(b.before, g), M = b.lines, a && M.length && (this._drawColorBox(e, t, k, m, s), u = Math.max(d.lineHeight, l)), w = 0, O = M.length; w < O; ++w)
        g(M[w]), u = d.lineHeight;
      R(b.after, g);
    }
    f = 0, u = d.lineHeight, R(this.afterBody, g), t.y -= o;
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
      const a = this._size = As(this, t), l = Object.assign({}, r, this._size), c = Ls(e, t, l), h = Is(t, l, c, e);
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
    const r = it(e.padding), a = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    e.enabled && a && (t.save(), t.globalAlpha = s, this.drawBackground(o, t, n, e), fn(t, e.textDirection), o.y += r.top, this.drawTitle(o, t, e), this.drawBody(o, t, e), this.drawFooter(o, t, e), gn(t, e.textDirection), t.restore());
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
A(fi, "positioners", te);
var jl = {
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
    callbacks: An
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
const $l = (i, t, e, s) => (typeof t == "string" ? (e = i.push(t) - 1, s.unshift({
  index: e,
  label: t
})) : isNaN(t) && (e = null), e);
function Ul(i, t, e, s) {
  const n = i.indexOf(t);
  if (n === -1)
    return $l(i, t, e, s);
  const o = i.lastIndexOf(t);
  return n !== o ? e : n;
}
const Yl = (i, t) => i === null ? null : J(Math.round(i), 0, t);
function zs(i) {
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
    return e = isFinite(e) && s[e] === t ? e : Ul(s, t, I(e, t), this._addedLabels), Yl(e, s.length - 1);
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
    return zs.call(this, t);
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
A(gi, "id", "category"), A(gi, "defaults", {
  ticks: {
    callback: zs
  }
});
function Gl(i, t) {
  const e = [], { bounds: n, step: o, min: r, max: a, precision: l, count: c, maxTicks: h, maxDigits: d, includeBounds: u } = i, f = o || 1, m = h - 1, { min: g, max: p } = t, b = !E(r), y = !E(a), M = !E(c), k = (p - g) / (d + 1);
  let w = Wi((p - g) / m / f) * f, D, O, C, x;
  if (w < 1e-14 && !b && !y)
    return [
      {
        value: g
      },
      {
        value: p
      }
    ];
  x = Math.ceil(p / w) - Math.floor(g / w), x > m && (w = Wi(x * w / m / f) * f), E(l) || (D = Math.pow(10, l), w = Math.ceil(w * D) / D), n === "ticks" ? (O = Math.floor(g / w) * w, C = Math.ceil(p / w) * w) : (O = g, C = p), b && y && o && Lo((a - r) / o, w / 1e3) ? (x = Math.round(Math.min((a - r) / w, h)), w = (a - r) / x, O = r, C = a) : M ? (O = b ? r : O, C = y ? a : C, x = c - 1, w = (C - O) / x) : (x = (C - O) / w, ie(x, Math.round(x), w / 1e3) ? x = Math.round(x) : x = Math.ceil(x));
  const _ = Math.max(Vi(w), Vi(O));
  D = Math.pow(10, E(l) ? _ : l), O = Math.round(O * D) / D, C = Math.round(C * D) / D;
  let P = 0;
  for (b && (u && O !== r ? (e.push({
    value: r
  }), O < r && P++, ie(Math.round((O + P * w) * D) / D, r, Es(r, k, i)) && P++) : O < r && P++); P < x; ++P) {
    const T = Math.round((O + P * w) * D) / D;
    if (y && T > a)
      break;
    e.push({
      value: T
    });
  }
  return y && u && C !== a ? e.length && ie(e[e.length - 1].value, a, Es(a, k, i)) ? e[e.length - 1].value = a : e.push({
    value: a
  }) : (!y || C === a) && e.push({
    value: C
  }), e;
}
function Es(i, t, { horizontal: e, minRotation: s }) {
  const n = Tt(s), o = (e ? Math.sin(n) : Math.cos(n)) || 1e-3, r = 0.75 * t * ("" + i).length;
  return Math.min(t / o, r);
}
class ql extends Vt {
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
    }, o = this._range || this, r = Gl(n, o);
    return t.bounds === "ticks" && Io(r, this, "value"), t.reverse ? (r.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), r;
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
    return nn(t, this.chart.options.locale, this.options.ticks.format);
  }
}
class pi extends ql {
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!0);
    this.min = et(t) ? t : 0, this.max = et(e) ? e : 1, this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const t = this.isHorizontal(), e = t ? this.width : this.height, s = Tt(this.options.ticks.minRotation), n = (t ? Math.sin(s) : Math.cos(s)) || 1e-3, o = this._resolveTickFontOptions(0);
    return Math.ceil(e / Math.min(40, o.lineHeight / n));
  }
  getPixelForValue(t) {
    return t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getValueForPixel(t) {
    return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
  }
}
A(pi, "id", "linear"), A(pi, "defaults", {
  ticks: {
    callback: on.formatters.numeric
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
function Hs(i, t) {
  return i - t;
}
function Bs(i, t) {
  if (E(t))
    return null;
  const e = i._adapter, { parser: s, round: n, isoWeekday: o } = i._parseOpts;
  let r = t;
  return typeof s == "function" && (r = s(r)), et(r) || (r = typeof s == "string" ? e.parse(r, s) : e.parse(r)), r === null ? null : (n && (r = n === "week" && (ce(o) || o === !0) ? e.startOf(r, "isoWeek", o) : e.startOf(r, n)), +r);
}
function Ns(i, t, e, s) {
  const n = q.length;
  for (let o = q.indexOf(i); o < n - 1; ++o) {
    const r = Ue[q[o]], a = r.steps ? r.steps : Number.MAX_SAFE_INTEGER;
    if (r.common && Math.ceil((e - t) / (a * r.size)) <= s)
      return q[o];
  }
  return q[n - 1];
}
function Xl(i, t, e, s, n) {
  for (let o = q.length - 1; o >= q.indexOf(e); o--) {
    const r = q[o];
    if (Ue[r].common && i._adapter.diff(n, s, r) >= t - 1)
      return r;
  }
  return q[e ? q.indexOf(e) : 0];
}
function Kl(i) {
  for (let t = q.indexOf(i) + 1, e = q.length; t < e; ++t)
    if (Ue[q[t]].common)
      return q[t];
}
function Ws(i, t, e) {
  if (!e)
    i[t] = !0;
  else if (e.length) {
    const { lo: s, hi: n } = vi(e, t), o = e[s] >= t ? e[s] : e[n];
    i[o] = !0;
  }
}
function Ql(i, t, e, s) {
  const n = i._adapter, o = +n.startOf(t[0].value, s), r = t[t.length - 1].value;
  let a, l;
  for (a = o; a <= r; a = +n.add(a, 1, s))
    l = e[a], l >= 0 && (t[l].major = !0);
  return t;
}
function Vs(i, t, e) {
  const s = [], n = {}, o = t.length;
  let r, a;
  for (r = 0; r < o; ++r)
    a = t[r], n[a] = r, s.push({
      value: a,
      major: !1
    });
  return o === 0 || !e ? s : Ql(i, s, n, e);
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
    const s = t.time || (t.time = {}), n = this._adapter = new ha._date(t.adapters.date);
    n.init(e), ee(s.displayFormats, n.formats()), this._parseOpts = {
      parser: s.parser,
      round: s.round,
      isoWeekday: s.isoWeekday
    }, super.init(t), this._normalized = e.normalized;
  }
  parse(t, e) {
    return t === void 0 ? null : Bs(this, t);
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
    (!r || !a) && (l(this._getLabelBounds()), (t.bounds !== "ticks" || t.ticks.source !== "labels") && l(this.getMinMax(!1))), n = et(n) && !isNaN(n) ? n : +e.startOf(Date.now(), s), o = et(o) && !isNaN(o) ? o : +e.endOf(Date.now(), s) + 1, this.min = Math.min(n, o - 1), this.max = Math.max(n + 1, o);
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
    const o = this.min, r = this.max, a = Bo(n, o, r);
    return this._unit = e.unit || (s.autoSkip ? Ns(e.minUnit, this.min, this.max, this._getLabelCapacity(o)) : Xl(this, a.length, e.minUnit, this.min, this.max)), this._majorUnit = !s.major.enabled || this._unit === "year" ? void 0 : Kl(this._unit), this.initOffsets(n), t.reverse && a.reverse(), Vs(this, a, this._majorUnit);
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((t) => +t.value));
  }
  initOffsets(t = []) {
    let e = 0, s = 0, n, o;
    this.options.offset && t.length && (n = this.getDecimalForValue(t[0]), t.length === 1 ? e = 1 - n : e = (this.getDecimalForValue(t[1]) - n) / 2, o = this.getDecimalForValue(t[t.length - 1]), t.length === 1 ? s = o : s = (o - this.getDecimalForValue(t[t.length - 2])) / 2);
    const r = t.length < 3 ? 0.5 : 0.25;
    e = J(e, 0, r), s = J(s, 0, r), this._offsets = {
      start: e,
      end: s,
      factor: 1 / (e + 1 + s)
    };
  }
  _generate() {
    const t = this._adapter, e = this.min, s = this.max, n = this.options, o = n.time, r = o.unit || Ns(o.minUnit, e, s, this._getLabelCapacity(e)), a = I(n.ticks.stepSize, 1), l = r === "week" ? o.isoWeekday : !1, c = ce(l) || l === !0, h = {};
    let d = e, u, f;
    if (c && (d = +t.startOf(d, "isoWeek", l)), d = +t.startOf(d, c ? "day" : r), t.diff(s, e, r) > 1e5 * a)
      throw new Error(e + " and " + s + " are too far apart with stepSize of " + a + " " + r);
    const m = n.ticks.source === "data" && this.getDataTimestamps();
    for (u = d, f = 0; u < s; u = +t.add(u, a, r), f++)
      Ws(h, u, m);
    return (u === s || n.bounds === "ticks" || f === 1) && Ws(h, u, m), Object.keys(h).sort(Hs).map((g) => +g);
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
    const e = this.options.ticks, s = this.ctx.measureText(t).width, n = Tt(this.isHorizontal() ? e.maxRotation : e.minRotation), o = Math.cos(n), r = Math.sin(n), a = this._resolveTickFontOptions(0).size;
    return {
      w: s * o + a * r,
      h: s * r + a * o
    };
  }
  _getLabelCapacity(t) {
    const e = this.options.time, s = e.displayFormats, n = s[e.unit] || s.millisecond, o = this._tickFormatFunction(t, 0, Vs(this, [
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
      t.push(Bs(this, n[e]));
    return this._cache.labels = this._normalized ? t : this.normalize(t);
  }
  normalize(t) {
    return Wo(t.sort(Hs));
  }
}
A(We, "id", "time"), A(We, "defaults", {
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
  e ? (t >= i[s].pos && t <= i[n].pos && ({ lo: s, hi: n } = At(i, "pos", t)), { pos: o, time: a } = i[s], { pos: r, time: l } = i[n]) : (t >= i[s].time && t <= i[n].time && ({ lo: s, hi: n } = At(i, "time", t)), { time: o, pos: a } = i[s], { time: r, pos: l } = i[n]);
  const c = r - o;
  return c ? a + (l - a) * (t - o) / c : a;
}
class js extends We {
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
A(js, "id", "timeseries"), A(js, "defaults", We.defaults);
const Ln = {
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
}, Zl = {
  ariaLabel: {
    type: String
  },
  ariaDescribedby: {
    type: String
  }
}, Jl = {
  type: {
    type: String,
    required: !0
  },
  destroyDelay: {
    type: Number,
    default: 0
    // No delay by default
  },
  ...Ln,
  ...Zl
}, tc = Nn[0] === "2" ? (i, t) => Object.assign(i, {
  attrs: t
}) : (i, t) => Object.assign(i, t);
function Et(i) {
  return Gs(i) ? si(i) : i;
}
function ec(i) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : i;
  return Gs(t) ? new Proxy(i, {}) : i;
}
function ic(i, t) {
  const e = i.options;
  e && t && Object.assign(e, t);
}
function In(i, t) {
  i.labels = t;
}
function Fn(i, t, e) {
  const s = [];
  i.datasets = t.map((n) => {
    const o = i.datasets.find((r) => r[e] === n[e]);
    return !o || !n.data || s.includes(o) ? {
      ...n
    } : (s.push(o), Object.assign(o, n), o);
  });
}
function sc(i, t) {
  const e = {
    labels: [],
    datasets: []
  };
  return In(e, i.labels), Fn(e, i.datasets, t), e;
}
const nc = mi({
  props: Jl,
  setup(i, t) {
    let { expose: e, slots: s } = t;
    const n = Pe(null), o = Us(null);
    e({
      chart: o
    });
    const r = () => {
      if (!n.value) return;
      const { type: c, data: h, options: d, plugins: u, datasetIdKey: f } = i, m = sc(h, f), g = ec(m, h);
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
    return Ys(r), En(a), Hn([
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
        b && b !== y && (ic(g, b), p = !0);
      }
      if (u) {
        const b = Et(u.labels), y = Et(m.labels), M = Et(u.datasets), k = Et(m.datasets);
        b !== y && (In(g.config.data, b), p = !0), M && M !== k && (Fn(g.config.data, M, i.datasetIdKey), p = !0);
      }
      p && Bn(() => {
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
function oc(i, t) {
  return $e.register(t), mi({
    props: Ln,
    setup(e, s) {
      let { expose: n } = s;
      const o = Us(null), r = (a) => {
        o.value = a == null ? void 0 : a.chart;
      };
      return n({
        chart: o
      }), () => ii(nc, tc({
        ref: r
      }, {
        type: i,
        ...e
      }));
    }
  });
}
const rc = /* @__PURE__ */ oc("line", Te), ac = { class: "dashboard-container" }, lc = {
  key: 0,
  class: "loading"
}, cc = {
  key: 1,
  class: "error"
}, hc = { key: 2 }, dc = { class: "metric-block" }, uc = { class: "block-header" }, fc = {
  key: 0,
  class: "metric-row all-accounts-row"
}, gc = { class: "row-content" }, pc = { class: "metric-column" }, mc = { class: "metric-value" }, bc = { class: "metric-value" }, _c = { class: "metric-column" }, xc = { class: "metric-value" }, yc = { class: "metric-value" }, vc = { class: "row-header-button-container" }, wc = ["onClick"], kc = ["onClick"], Sc = { class: "row-content" }, Mc = { class: "metric-column" }, Cc = { class: "metric-label-with-icon" }, Dc = ["onClick"], Oc = { class: "metric-value" }, Pc = { class: "metric-value" }, Tc = { class: "metric-column" }, Ac = { class: "metric-label-with-icon" }, Lc = ["onClick"], Ic = { class: "metric-value" }, Fc = { class: "metric-value" }, Rc = {
  key: 0,
  class: "graph-section"
}, zc = {
  key: 0,
  class: "graph-loading"
}, Ec = {
  key: 1,
  class: "graph-error"
}, Hc = {
  key: 2,
  class: "chart-section"
}, Bc = { class: "chart-container" }, Nc = {
  key: 3,
  class: "graph-empty"
}, Wc = {
  key: 1,
  class: "calculation-breakdown"
}, Vc = { class: "breakdown-columns" }, jc = { class: "breakdown-stage stage-1" }, $c = { class: "stage-item" }, Uc = { class: "item-value" }, Yc = { class: "formula" }, Gc = { class: "stage-item" }, qc = { class: "item-value" }, Xc = { class: "formula" }, Kc = { class: "stage-item" }, Qc = { class: "item-value" }, Zc = { class: "formula" }, Jc = { class: "stage-item" }, th = { class: "item-value" }, eh = { class: "formula" }, ih = { class: "breakdown-stage stage-2" }, sh = { class: "stage-item" }, nh = { class: "item-value" }, oh = { class: "formula" }, rh = { class: "stage-item" }, ah = { class: "item-value" }, lh = { class: "formula" }, ch = { class: "stage-item" }, hh = { class: "item-value" }, dh = { class: "formula" }, uh = { class: "stage-item" }, fh = { class: "item-value" }, gh = { class: "formula" }, ph = /* @__PURE__ */ mi({
  __name: "Summary",
  setup(i) {
    $e.register(
      gi,
      pi,
      Ie,
      Jt,
      Rl,
      jl,
      Il
    );
    const t = Qn(1e4), e = Li({}), s = Li({}), n = Pe(null), o = Pe(null), r = Pe(null);
    function a() {
      return new URLSearchParams(window.location.search).get("all_cts_clientId");
    }
    function l(x) {
      if (!x) return null;
      const _ = x.match(/Client\s*(\d+)/i);
      return _ ? parseInt(_[1]) : null;
    }
    Ys(() => {
      r.value = a(), window.addEventListener("popstate", () => {
        r.value = a();
      });
    });
    const c = qn(), h = ni({
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
      Object.keys(s).forEach((T) => {
        const S = parseInt(T);
        s[S] && (s[S].nlv = !1, s[S].mm = !1);
      }), s[x][_] = !P, s[x][_] ? (console.log("📊 Setting selected account for history:", x, "type:", _), n.value = x, o.value = _) : (console.log("❌ Clearing selected account for history"), n.value = null, o.value = null), console.log("📈 Graph visibility state:", s), console.log("🎯 Selected account for history:", n.value, "type:", o.value);
    }
    const m = nt(() => o.value === "nlv" ? h : o.value === "mm" ? d : null), g = nt(() => {
      var z;
      const x = m.value;
      if (!((z = x == null ? void 0 : x.data.value) != null && z.length)) return null;
      const _ = x.data.value, P = _.map((L) => new Date(L.fetched_at).toLocaleDateString()), T = o.value === "nlv", S = _.map((L) => T ? L.nlv : L.maintenance);
      return {
        labels: P,
        datasets: [
          {
            label: T ? "Net Liquidation Value" : "Maintenance Margin",
            data: S,
            borderColor: T ? "#3b82f6" : "#f59e0b",
            backgroundColor: T ? "rgba(59, 130, 246, 0.1)" : "rgba(245, 158, 11, 0.1)",
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
      const T = 1 - P, S = 1 - _, L = 1 - T * S;
      return x / L;
    }
    const y = nt(() => t.data.value ? t.data.value.map((x) => {
      const _ = b(x.nlv_val, 0.3, 0.15), P = b(x.nlv_val, 0.3, 0.1), T = _ * 30 / 100, S = P * 30 / 100, z = T - x.maintenance_val, L = S - x.maintenance_val, N = z * 100 / 30, $ = L * 100 / 30;
      return {
        ...x,
        maxGmvNlvSide: _,
        maxGmvMaintenanceSide: P,
        mkNlvSide: T,
        mkMaintenanceSide: S,
        maintnanceMarginHeadroomNlvSide: z,
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
    }), k = nt(() => {
      if (!y.value) return null;
      const x = y.value.reduce((S, z) => S + (z.nlv_val || 0), 0), _ = y.value.reduce((S, z) => S + (z.maintenance_val || 0), 0), P = y.value.reduce((S, z) => S + (z.addlGmvAllowedNlvSide || 0), 0), T = y.value.reduce((S, z) => S + (z.addlGmvAllowedMaintenanceSide || 0), 0);
      return {
        totalNlv: x,
        totalMaintenance: _,
        totalAddlGmvToStopReducing: P,
        totalAddlGmvToStartReducing: T
      };
    });
    function w(x) {
      e[x] = !e[x];
    }
    const D = $s("eventBus");
    function O(x) {
      var S;
      const P = (((S = y.value) == null ? void 0 : S.findIndex((z) => z.nlv_internal_account_id === x)) ?? -1) + 1, T = new URL(window.location.href);
      T.searchParams.set("all_cts_clientId", "Client " + P.toString()), window.history.replaceState({}, "", T.toString()), r.value = "Client " + P.toString(), D == null || D.emit("client-id-changed", {
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
    return Wn(() => {
      t._cleanup && t._cleanup();
    }), (x, _) => {
      var T;
      const P = Vn("router-link");
      return K(), X("div", ac, [
        Rt(t).isLoading.value ? (K(), X("div", lc, [..._[0] || (_[0] = [
          v("div", { class: "loading-spinner" }, null, -1),
          v("p", null, "Loading the latest metrics...", -1)
        ])])) : Rt(t).isError.value ? (K(), X("div", cc, [
          _[1] || (_[1] = v("h2", null, "Error Loading Data", -1)),
          _[2] || (_[2] = v("p", null, "An error occurred while fetching the metrics:", -1)),
          v("pre", null, H(Rt(t).error.value), 1)
        ])) : Rt(t).isSuccess.value ? (K(), X("div", hc, [
          v("div", dc, [
            v("div", uc, [
              v("h2", null, [
                Ii(P, {
                  to: "/summary",
                  class: "summary-link"
                }, {
                  default: jn(() => [..._[3] || (_[3] = [
                    $n("Summary", -1)
                  ])]),
                  _: 1
                })
              ])
            ]),
            k.value ? (K(), X("div", fc, [
              v("div", {
                class: "row-header",
                onClick: C
              }, "All Accounts (" + H(((T = Rt(t).data.value) == null ? void 0 : T.length) || 0) + ")", 1),
              v("div", gc, [
                v("div", pc, [
                  _[4] || (_[4] = v("div", { class: "metric-label" }, "Net liquidation value", -1)),
                  v("div", mc, H(u(k.value.totalNlv)), 1),
                  _[5] || (_[5] = v("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  v("div", bc, H(u(k.value.totalAddlGmvToStopReducing)), 1)
                ]),
                v("div", _c, [
                  _[6] || (_[6] = v("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  v("div", xc, H(u(k.value.totalMaintenance)), 1),
                  _[7] || (_[7] = v("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  v("div", yc, H(u(k.value.totalAddlGmvToStartReducing)), 1)
                ])
              ])
            ])) : ge("", !0),
            (K(!0), X(Un, null, Yn(M.value, (S, z) => {
              var L, N, $, yt, vt, ct, wt;
              return K(), X("div", {
                key: `client-${S.nlv_internal_account_id}-${S.nlv_id}`,
                class: "metric-row"
              }, [
                v("div", vc, [
                  v("div", {
                    class: "row-header",
                    onClick: (Q) => O(S.nlv_internal_account_id)
                  }, " Client" + H(((L = y.value) == null ? void 0 : L.findIndex((Q) => Q.nlv_internal_account_id === S.nlv_internal_account_id)) + 1), 9, wc),
                  v("button", {
                    class: Ye(["row-status", S.addlGmvAllowedNlvSide < 0 && S.addlGmvAllowedMaintenanceSide < 0 ? "stage-2-exhausted" : S.addlGmvAllowedNlvSide < 0 ? "stage-1-exhausted" : "ok"]),
                    onClick: (Q) => w(S.nlv_id)
                  }, H(S.addlGmvAllowedNlvSide < 0 && S.addlGmvAllowedMaintenanceSide < 0 ? "Stage 2 exhausted" : S.addlGmvAllowedNlvSide < 0 ? "Stage 1 exhausted" : "OK"), 11, kc)
                ]),
                v("div", Sc, [
                  v("div", Mc, [
                    v("div", Cc, [
                      _[9] || (_[9] = v("span", { class: "metric-label" }, "NLV", -1)),
                      v("button", {
                        class: Ye(["graph-icon", { active: (N = s[S.nlv_internal_accountId]) == null ? void 0 : N.nlv }]),
                        onClick: (Q) => f(S.nlv_internal_account_id, "nlv")
                      }, [..._[8] || (_[8] = [
                        v("svg", {
                          width: "16",
                          height: "16",
                          viewBox: "0 0 24 24",
                          fill: "currentColor"
                        }, [
                          v("path", { d: "M3 13h4v8H3v-8zm6-10h4v18H9V3zm6 6h4v12h-4V9z" })
                        ], -1)
                      ])], 10, Dc)
                    ]),
                    v("div", Oc, H(u(S.nlv_val)), 1),
                    _[10] || (_[10] = v("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                    v("div", Pc, H(u(S.addlGmvAllowedNlvSide)), 1)
                  ]),
                  v("div", Tc, [
                    v("div", Ac, [
                      _[12] || (_[12] = v("span", { class: "metric-label" }, "Maintenance margin", -1)),
                      v("button", {
                        class: Ye(["graph-icon", { active: ($ = s[S.nlv_internal_accountId]) == null ? void 0 : $.mm }]),
                        onClick: (Q) => f(S.nlv_internal_account_id, "mm")
                      }, [..._[11] || (_[11] = [
                        v("svg", {
                          width: "16",
                          height: "16",
                          viewBox: "0 0 24 24",
                          fill: "currentColor"
                        }, [
                          v("path", { d: "M3 13h4v8H3v-8zm6-10h4v18H9V3zm6 6h4v12h-4V9z" })
                        ], -1)
                      ])], 10, Lc)
                    ]),
                    v("div", Ic, H(u(S.maintenance_val)), 1),
                    _[13] || (_[13] = v("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                    v("div", Fc, H(u(S.addlGmvAllowedMaintenanceSide)), 1)
                  ])
                ]),
                (yt = s[S.nlv_internal_account_id]) != null && yt.nlv || (vt = s[S.nlv_internal_account_id]) != null && vt.mm ? (K(), X("div", Rc, [
                  (ct = m.value) != null && ct.isLoading.value ? (K(), X("div", zc, " Loading " + H(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data... ", 1)) : (wt = m.value) != null && wt.isError.value ? (K(), X("div", Ec, " Error loading " + H(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data: " + H(m.value.error.value), 1)) : g.value ? (K(), X("div", Hc, [
                    v("h4", null, H(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " History ", 1),
                    v("div", Bc, [
                      Ii(Rt(rc), {
                        data: g.value,
                        options: p.value,
                        height: 300
                      }, null, 8, ["data", "options"])
                    ])
                  ])) : (K(), X("div", Nc, " No " + H(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data available ", 1))
                ])) : ge("", !0),
                e[S.nlv_id] ? (K(), X("div", Wc, [
                  _[24] || (_[24] = v("div", { class: "breakdown-header" }, [
                    v("div", null, "Calculation breakdown:"),
                    v("div", null, "Assumptions: maintenance margin (m) = 30%")
                  ], -1)),
                  v("div", Vc, [
                    v("div", jc, [
                      _[18] || (_[18] = v("div", { class: "stage-header" }, "Stage-1 (drop d = 15%)", -1)),
                      v("div", $c, [
                        _[14] || (_[14] = v("div", { class: "item-label" }, "Max GMV that survives stop-adding threshold", -1)),
                        v("div", Uc, [
                          v("span", Yc, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + H(u(S.maxGmvNlvSide)), 1)
                        ])
                      ]),
                      v("div", Gc, [
                        _[15] || (_[15] = v("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                        v("div", qc, [
                          v("span", Xc, "Mk = Gmax x m = " + H(u(S.mkNlvSide)), 1)
                        ])
                      ]),
                      v("div", Kc, [
                        _[16] || (_[16] = v("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                        v("div", Qc, [
                          v("span", Zc, "Mk - M = " + H(u(S.maintnanceMarginHeadroomNlvSide)), 1)
                        ])
                      ]),
                      v("div", Jc, [
                        _[17] || (_[17] = v("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                        v("div", th, [
                          v("span", eh, "(Mk - M) / m = " + H(u(S.addlGmvAllowedNlvSide)), 1)
                        ])
                      ])
                    ]),
                    v("div", ih, [
                      _[23] || (_[23] = v("div", { class: "stage-header" }, "Stage-2 (drop d = 10%)", -1)),
                      v("div", sh, [
                        _[19] || (_[19] = v("div", { class: "item-label" }, "Max GMV that survives start-reducing threshold", -1)),
                        v("div", nh, [
                          v("span", oh, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + H(u(S.maxGmvMaintenanceSide)), 1)
                        ])
                      ]),
                      v("div", rh, [
                        _[20] || (_[20] = v("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                        v("div", ah, [
                          v("span", lh, "Mk = Gmax x m = " + H(u(S.mkMaintenanceSide)), 1)
                        ])
                      ]),
                      v("div", ch, [
                        _[21] || (_[21] = v("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                        v("div", hh, [
                          v("span", dh, "Mk - M = " + H(u(S.maintnanceMarginHeadroomMaintenanceSide)), 1)
                        ])
                      ]),
                      v("div", uh, [
                        _[22] || (_[22] = v("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                        v("div", fh, [
                          v("span", gh, "(Mk - M) / m = " + H(u(S.addlGmvAllowedMaintenanceSide)), 1)
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
}), mh = (i, t) => {
  const e = i.__vccOpts || i;
  for (const [s, n] of t)
    e[s] = n;
  return e;
}, wh = /* @__PURE__ */ mh(ph, [["__scopeId", "data-v-5612fb75"]]);
export {
  wh as Summary,
  wh as default
};
