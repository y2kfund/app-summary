var In = Object.defineProperty;
var Fn = (i, t, e) => t in i ? In(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var P = (i, t, e) => Fn(i, typeof t != "symbol" ? t + "" : t, e);
import { inject as js, defineComponent as mi, shallowRef as $s, h as ei, ref as ii, onMounted as Rn, onUnmounted as zn, watch as En, toRaw as si, nextTick as Hn, version as Bn, isProxy as Ys, reactive as Li, computed as rt, onBeforeUnmount as Nn, createElementBlock as q, openBlock as X, createCommentVNode as ge, unref as Lt, createElementVNode as v, toDisplayString as R, Fragment as Wn, renderList as Vn, normalizeClass as Ye, createVNode as jn } from "vue";
import { useQueryClient as $n, useQuery as ni } from "@tanstack/vue-query";
import { useSupabase as Yn } from "@y2kfund/core";
const Un = Symbol.for("y2kfund.supabase");
function Gn() {
  const i = js(Un, null);
  if (!i) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return i;
}
function qn(i) {
  const t = Gn(), e = ["nlvMargin", i], s = $n(), n = ni({
    queryKey: e,
    queryFn: async () => {
      const { data: r, error: l } = await t.schema("hf").rpc("get_nlv_margin", {
        p_limit: 10
      });
      if (l) throw l;
      return r || [];
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
  ).subscribe(), a = t.channel("maintenance_margin_all").on(
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
      var r, l;
      (r = o == null ? void 0 : o.unsubscribe) == null || r.call(o), (l = a == null ? void 0 : a.unsubscribe) == null || l.call(a);
    }
  };
}
/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */
function he(i) {
  return i + 0.5 | 0;
}
const pt = (i, t, e) => Math.max(Math.min(i, e), t);
function Gt(i) {
  return pt(he(i * 2.55), 0, 255);
}
function mt(i) {
  return pt(he(i * 255), 0, 255);
}
function dt(i) {
  return pt(he(i / 2.55) / 100, 0, 1);
}
function Ii(i) {
  return pt(he(i * 100), 0, 100);
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
function Us(i, t, e) {
  const s = t * Math.min(e, 1 - e), n = (o, a = (o + i / 30) % 12) => e - s * Math.max(Math.min(a - 3, 9 - a, 1), -1);
  return [n(0), n(8), n(4)];
}
function io(i, t, e) {
  const s = (n, o = (n + i / 60) % 6) => e - e * t * Math.max(Math.min(o, 4 - o, 1), 0);
  return [s(5), s(3), s(1)];
}
function so(i, t, e) {
  const s = Us(i, 1, 0.5);
  let n;
  for (t + e > 1 && (n = 1 / (t + e), t *= n, e *= n), n = 0; n < 3; n++)
    s[n] *= 1 - t - e, s[n] += t;
  return s;
}
function no(i, t, e, s, n) {
  return i === n ? (t - e) / s + (t < e ? 6 : 0) : t === n ? (e - i) / s + 2 : (i - t) / s + 4;
}
function bi(i) {
  const e = i.r / 255, s = i.g / 255, n = i.b / 255, o = Math.max(e, s, n), a = Math.min(e, s, n), r = (o + a) / 2;
  let l, c, h;
  return o !== a && (h = o - a, c = r > 0.5 ? h / (2 - o - a) : h / (o + a), l = no(e, s, n, h, o), l = l * 60 + 0.5), [l | 0, c || 0, r];
}
function _i(i, t, e, s) {
  return (Array.isArray(t) ? i(t[0], t[1], t[2]) : i(t, e, s)).map(mt);
}
function xi(i, t, e) {
  return _i(Us, i, t, e);
}
function oo(i, t, e) {
  return _i(so, i, t, e);
}
function ao(i, t, e) {
  return _i(io, i, t, e);
}
function Gs(i) {
  return (i % 360 + 360) % 360;
}
function ro(i) {
  const t = eo.exec(i);
  let e = 255, s;
  if (!t)
    return;
  t[5] !== s && (e = t[6] ? Gt(+t[5]) : mt(+t[5]));
  const n = Gs(+t[2]), o = +t[3] / 100, a = +t[4] / 100;
  return t[1] === "hwb" ? s = oo(n, o, a) : t[1] === "hsv" ? s = ao(n, o, a) : s = xi(n, o, a), {
    r: s[0],
    g: s[1],
    b: s[2],
    a: e
  };
}
function lo(i, t) {
  var e = bi(i);
  e[0] = Gs(e[0] + t), e = xi(e), i.r = e[0], i.g = e[1], i.b = e[2];
}
function co(i) {
  if (!i)
    return;
  const t = bi(i), e = t[0], s = Ii(t[1]), n = Ii(t[2]);
  return i.a < 255 ? `hsla(${e}, ${s}%, ${n}%, ${dt(i.a)})` : `hsl(${e}, ${s}%, ${n}%)`;
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
  let s, n, o, a, r;
  for (s = 0; s < t.length; s++) {
    for (a = r = t[s], n = 0; n < e.length; n++)
      o = e[n], r = r.replace(o, Fi[o]);
    o = parseInt(Ri[a], 16), i[r] = [o >> 16 & 255, o >> 8 & 255, o & 255];
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
      const a = +t[7];
      e = t[8] ? Gt(a) : pt(a * 255, 0, 255);
    }
    return s = +t[1], n = +t[3], o = +t[5], s = 255 & (t[2] ? Gt(s) : pt(s, 0, 255)), n = 255 & (t[4] ? Gt(n) : pt(n, 0, 255)), o = 255 & (t[6] ? Gt(o) : pt(o, 0, 255)), {
      r: s,
      g: n,
      b: o,
      a: e
    };
  }
}
function po(i) {
  return i && (i.a < 255 ? `rgba(${i.r}, ${i.g}, ${i.b}, ${dt(i.a)})` : `rgb(${i.r}, ${i.g}, ${i.b})`);
}
const Ue = (i) => i <= 31308e-7 ? i * 12.92 : Math.pow(i, 1 / 2.4) * 1.055 - 0.055, It = (i) => i <= 0.04045 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
function mo(i, t, e) {
  const s = It(dt(i.r)), n = It(dt(i.g)), o = It(dt(i.b));
  return {
    r: mt(Ue(s + e * (It(dt(t.r)) - s))),
    g: mt(Ue(n + e * (It(dt(t.g)) - n))),
    b: mt(Ue(o + e * (It(dt(t.b)) - o))),
    a: i.a + e * (t.a - i.a)
  };
}
function be(i, t, e) {
  if (i) {
    let s = bi(i);
    s[t] = Math.max(0, Math.min(s[t] + s[t] * e, t === 0 ? 360 : 1)), s = xi(s), i.r = s[0], i.g = s[1], i.b = s[2];
  }
}
function qs(i, t) {
  return i && Object.assign(t || {}, i);
}
function zi(i) {
  var t = { r: 0, g: 0, b: 0, a: 255 };
  return Array.isArray(i) ? i.length >= 3 && (t = { r: i[0], g: i[1], b: i[2], a: 255 }, i.length > 3 && (t.a = mt(i[3]))) : (t = qs(i, { r: 0, g: 0, b: 0, a: 1 }), t.a = mt(t.a)), t;
}
function bo(i) {
  return i.charAt(0) === "r" ? go(i) : ro(i);
}
class ne {
  constructor(t) {
    if (t instanceof ne)
      return t;
    const e = typeof t;
    let s;
    e === "object" ? s = zi(t) : e === "string" && (s = Zn(t) || uo(t) || bo(t)), this._rgb = s, this._valid = !!s;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var t = qs(this._rgb);
    return t && (t.a = dt(t.a)), t;
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
      const a = e === o ? 0.5 : e, r = 2 * a - 1, l = s.a - n.a, c = ((r * l === -1 ? r : (r + l) / (1 + r * l)) + 1) / 2;
      o = 1 - c, s.r = 255 & c * s.r + o * n.r + 0.5, s.g = 255 & c * s.g + o * n.g + 0.5, s.b = 255 & c * s.b + o * n.b + 0.5, s.a = a * s.a + (1 - a) * n.a, this.rgb = s;
    }
    return this;
  }
  interpolate(t, e) {
    return t && (this._rgb = mo(this._rgb, t._rgb, e)), this;
  }
  clone() {
    return new ne(this.rgb);
  }
  alpha(t) {
    return this._rgb.a = mt(t), this;
  }
  clearer(t) {
    const e = this._rgb;
    return e.a *= 1 - t, this;
  }
  greyscale() {
    const t = this._rgb, e = he(t.r * 0.3 + t.g * 0.59 + t.b * 0.11);
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
function lt() {
}
const _o = /* @__PURE__ */ (() => {
  let i = 0;
  return () => i++;
})();
function F(i) {
  return i == null;
}
function W(i) {
  if (Array.isArray && Array.isArray(i))
    return !0;
  const t = Object.prototype.toString.call(i);
  return t.slice(0, 7) === "[object" && t.slice(-6) === "Array]";
}
function L(i) {
  return i !== null && Object.prototype.toString.call(i) === "[object Object]";
}
function tt(i) {
  return (typeof i == "number" || i instanceof Number) && isFinite(+i);
}
function st(i, t) {
  return tt(i) ? i : t;
}
function A(i, t) {
  return typeof i > "u" ? t : i;
}
const xo = (i, t) => typeof i == "string" && i.endsWith("%") ? parseFloat(i) / 100 * t : +i;
function z(i, t, e) {
  if (i && typeof i.call == "function")
    return i.apply(e, t);
}
function I(i, t, e, s) {
  let n, o, a;
  if (W(i))
    for (o = i.length, n = 0; n < o; n++)
      t.call(e, i[n], n);
  else if (L(i))
    for (a = Object.keys(i), o = a.length, n = 0; n < o; n++)
      t.call(e, i[a[n]], a[n]);
}
function Ie(i, t) {
  let e, s, n, o;
  if (!i || !t || i.length !== t.length)
    return !1;
  for (e = 0, s = i.length; e < s; ++e)
    if (n = i[e], o = t[e], n.datasetIndex !== o.datasetIndex || n.index !== o.index)
      return !1;
  return !0;
}
function Fe(i) {
  if (W(i))
    return i.map(Fe);
  if (L(i)) {
    const t = /* @__PURE__ */ Object.create(null), e = Object.keys(i), s = e.length;
    let n = 0;
    for (; n < s; ++n)
      t[e[n]] = Fe(i[e[n]]);
    return t;
  }
  return i;
}
function Xs(i) {
  return [
    "__proto__",
    "prototype",
    "constructor"
  ].indexOf(i) === -1;
}
function yo(i, t, e, s) {
  if (!Xs(i))
    return;
  const n = t[i], o = e[i];
  L(n) && L(o) ? oe(n, o, s) : t[i] = Fe(o);
}
function oe(i, t, e) {
  const s = W(t) ? t : [
    t
  ], n = s.length;
  if (!L(i))
    return i;
  e = e || {};
  const o = e.merger || yo;
  let a;
  for (let r = 0; r < n; ++r) {
    if (a = s[r], !L(a))
      continue;
    const l = Object.keys(a);
    for (let c = 0, h = l.length; c < h; ++c)
      o(l[c], i, a, e);
  }
  return i;
}
function Zt(i, t) {
  return oe(i, t, {
    merger: vo
  });
}
function vo(i, t, e) {
  if (!Xs(i))
    return;
  const s = t[i], n = e[i];
  L(s) && L(n) ? Zt(s, n) : Object.prototype.hasOwnProperty.call(t, i) || (t[i] = Fe(n));
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
function Re(i, t) {
  return (Ei[t] || (Ei[t] = ko(t)))(i);
}
function yi(i) {
  return i.charAt(0).toUpperCase() + i.slice(1);
}
const ze = (i) => typeof i < "u", bt = (i) => typeof i == "function", Hi = (i, t) => {
  if (i.size !== t.size)
    return !1;
  for (const e of i)
    if (!t.has(e))
      return !1;
  return !0;
};
function Mo(i) {
  return i.type === "mouseup" || i.type === "click" || i.type === "contextmenu";
}
const V = Math.PI, at = 2 * V, So = at + V, Ee = Number.POSITIVE_INFINITY, Do = V / 180, it = V / 2, yt = V / 4, Bi = V * 2 / 3, Ks = Math.log10, zt = Math.sign;
function Jt(i, t, e) {
  return Math.abs(i - t) < e;
}
function Ni(i) {
  const t = Math.round(i);
  i = Jt(i, t, i / 1e3) ? t : i;
  const e = Math.pow(10, Math.floor(Ks(i))), s = i / e;
  return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 5 ? 5 : 10) * e;
}
function Co(i) {
  const t = [], e = Math.sqrt(i);
  let s;
  for (s = 1; s < e; s++)
    i % s === 0 && (t.push(s), t.push(i / s));
  return e === (e | 0) && t.push(e), t.sort((n, o) => n - o).pop(), t;
}
function Oo(i) {
  return typeof i == "symbol" || typeof i == "object" && i !== null && !(Symbol.toPrimitive in i || "toString" in i || "valueOf" in i);
}
function ae(i) {
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
function St(i) {
  return i * (V / 180);
}
function Ao(i) {
  return i * (180 / V);
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
  return o < -0.5 * V && (o += at), {
    angle: o,
    distance: n
  };
}
function ai(i, t) {
  return Math.sqrt(Math.pow(t.x - i.x, 2) + Math.pow(t.y - i.y, 2));
}
function Io(i, t) {
  return (i - t + So) % at - V;
}
function gt(i) {
  return (i % at + at) % at;
}
function Qs(i, t, e, s) {
  const n = gt(i), o = gt(t), a = gt(e), r = gt(o - n), l = gt(a - n), c = gt(n - o), h = gt(n - a);
  return n === o || n === a || s && o === a || r > l && c < h;
}
function Z(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function Fo(i) {
  return Z(i, -32768, 32767);
}
function qt(i, t, e, s = 1e-6) {
  return i >= Math.min(t, e) - s && i <= Math.max(t, e) + s;
}
function vi(i, t, e) {
  e = e || ((a) => i[a] < t);
  let s = i.length - 1, n = 0, o;
  for (; s - n > 1; )
    o = n + s >> 1, e(o) ? n = o : s = o;
  return {
    lo: n,
    hi: s
  };
}
const Dt = (i, t, e, s) => vi(i, e, s ? (n) => {
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
const Zs = [
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
  }), Zs.forEach((e) => {
    const s = "_onData" + yi(e), n = i[e];
    Object.defineProperty(i, e, {
      configurable: !0,
      enumerable: !1,
      value(...o) {
        const a = n.apply(this, o);
        return i._chartjs.listeners.forEach((r) => {
          typeof r[s] == "function" && r[s](...o);
        }), a;
      }
    });
  });
}
function Vi(i, t) {
  const e = i._chartjs;
  if (!e)
    return;
  const s = e.listeners, n = s.indexOf(t);
  n !== -1 && s.splice(n, 1), !(s.length > 0) && (Zs.forEach((o) => {
    delete i[o];
  }), delete i._chartjs);
}
function Ho(i) {
  const t = new Set(i);
  return t.size === i.length ? i : Array.from(t);
}
const Js = function() {
  return typeof window > "u" ? function(i) {
    return i();
  } : window.requestAnimationFrame;
}();
function tn(i, t) {
  let e = [], s = !1;
  return function(...n) {
    e = n, s || (s = !0, Js.call(window, () => {
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
const wi = (i) => i === "start" ? "left" : i === "end" ? "right" : "center", j = (i, t, e) => i === "start" ? t : i === "end" ? e : (t + e) / 2, No = (i, t, e, s) => i === (s ? "left" : "right") ? e : i === "center" ? (t + e) / 2 : t;
function Wo(i, t, e) {
  const s = t.length;
  let n = 0, o = s;
  if (i._sorted) {
    const { iScale: a, vScale: r, _parsed: l } = i, c = i.dataset && i.dataset.options ? i.dataset.options.spanGaps : null, h = a.axis, { min: d, max: u, minDefined: f, maxDefined: m } = a.getUserBounds();
    if (f) {
      if (n = Math.min(
        // @ts-expect-error Need to type _parsed
        Dt(l, h, d).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? s : Dt(t, h, a.getPixelForValue(d)).lo
      ), c) {
        const g = l.slice(0, n + 1).reverse().findIndex((p) => !F(p[r.axis]));
        n -= Math.max(0, g);
      }
      n = Z(n, 0, s - 1);
    }
    if (m) {
      let g = Math.max(
        // @ts-expect-error Need to type _parsed
        Dt(l, a.axis, u, !0).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? 0 : Dt(t, h, a.getPixelForValue(u), !0).hi + 1
      );
      if (c) {
        const p = l.slice(g - 1).findIndex((x) => !F(x[r.axis]));
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
const _e = (i) => i === 0 || i === 1, ji = (i, t, e) => -(Math.pow(2, 10 * (i -= 1)) * Math.sin((i - t) * at / e)), $i = (i, t, e) => Math.pow(2, -10 * i) * Math.sin((i - t) * at / e) + 1, te = {
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
  easeInOutSine: (i) => -0.5 * (Math.cos(V * i) - 1),
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
  easeInBounce: (i) => 1 - te.easeOutBounce(1 - i),
  easeOutBounce(i) {
    return i < 1 / 2.75 ? 7.5625 * i * i : i < 2 / 2.75 ? 7.5625 * (i -= 1.5 / 2.75) * i + 0.75 : i < 2.5 / 2.75 ? 7.5625 * (i -= 2.25 / 2.75) * i + 0.9375 : 7.5625 * (i -= 2.625 / 2.75) * i + 0.984375;
  },
  easeInOutBounce: (i) => i < 0.5 ? te.easeInBounce(i * 2) * 0.5 : te.easeOutBounce(i * 2 - 1) * 0.5 + 0.5
};
function ki(i) {
  if (i && typeof i == "object") {
    const t = i.toString();
    return t === "[object CanvasPattern]" || t === "[object CanvasGradient]";
  }
  return !1;
}
function Yi(i) {
  return ki(i) ? i : new ne(i);
}
function Ge(i) {
  return ki(i) ? i : new ne(i).saturate(0.5).darken(0.1).hexString();
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
function Yo(i) {
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
function Uo(i) {
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
const Ui = /* @__PURE__ */ new Map();
function Go(i, t) {
  t = t || {};
  const e = i + JSON.stringify(t);
  let s = Ui.get(e);
  return s || (s = new Intl.NumberFormat(i, t), Ui.set(e, s)), s;
}
function en(i, t, e) {
  return Go(t, e).format(i);
}
const qo = {
  values(i) {
    return W(i) ? i : "" + i;
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
    const a = Ks(Math.abs(o)), r = isNaN(a) ? 1 : Math.max(Math.min(-1 * Math.floor(a), 20), 0), l = {
      notation: n,
      minimumFractionDigits: r,
      maximumFractionDigits: r
    };
    return Object.assign(l, this.options.ticks.format), en(i, s, l);
  }
};
function Xo(i, t) {
  let e = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
  return Math.abs(e) >= 1 && i !== Math.floor(i) && (e = i - Math.floor(i)), e;
}
var sn = {
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
      callback: sn.formatters.values,
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
const Ot = /* @__PURE__ */ Object.create(null), ri = /* @__PURE__ */ Object.create(null);
function ee(i, t) {
  if (!t)
    return i;
  const e = t.split(".");
  for (let s = 0, n = e.length; s < n; ++s) {
    const o = e[s];
    i = i[o] || (i[o] = /* @__PURE__ */ Object.create(null));
  }
  return i;
}
function qe(i, t, e) {
  return typeof t == "string" ? oe(ee(i, t), e) : oe(ee(i, ""), t);
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
    }, this.hover = {}, this.hoverBackgroundColor = (s, n) => Ge(n.backgroundColor), this.hoverBorderColor = (s, n) => Ge(n.borderColor), this.hoverColor = (s, n) => Ge(n.color), this.indexAxis = "x", this.interaction = {
      mode: "nearest",
      intersect: !0,
      includeInvisible: !1
    }, this.maintainAspectRatio = !0, this.onHover = null, this.onClick = null, this.parsing = !0, this.plugins = {}, this.responsive = !0, this.scale = void 0, this.scales = {}, this.showLine = !0, this.drawActiveElementsOnTop = !0, this.describe(t), this.apply(e);
  }
  set(t, e) {
    return qe(this, t, e);
  }
  get(t) {
    return ee(this, t);
  }
  describe(t, e) {
    return qe(ri, t, e);
  }
  override(t, e) {
    return qe(Ot, t, e);
  }
  route(t, e, s, n) {
    const o = ee(this, t), a = ee(this, s), r = "_" + e;
    Object.defineProperties(o, {
      [r]: {
        value: o[e],
        writable: !0
      },
      [e]: {
        enumerable: !0,
        get() {
          const l = this[r], c = a[n];
          return L(l) ? Object.assign({}, c, l) : A(l, c);
        },
        set(l) {
          this[r] = l;
        }
      }
    });
  }
  apply(t) {
    t.forEach((e) => e(this));
  }
}
var B = /* @__PURE__ */ new Qo({
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
  Yo,
  Uo,
  Ko
]);
function Zo(i) {
  return !i || F(i.size) || F(i.family) ? null : (i.style ? i.style + " " : "") + (i.weight ? i.weight + " " : "") + i.size + "px " + i.family;
}
function Gi(i, t, e, s, n) {
  let o = t[n];
  return o || (o = t[n] = i.measureText(n).width, e.push(n)), o > s && (s = o), s;
}
function vt(i, t, e) {
  const s = i.currentDevicePixelRatio, n = e !== 0 ? Math.max(e / 2, 0.5) : 0;
  return Math.round((t - n) * s) / s + n;
}
function qi(i, t) {
  !t && !i || (t = t || i.getContext("2d"), t.save(), t.resetTransform(), t.clearRect(0, 0, i.width, i.height), t.restore());
}
function li(i, t, e, s) {
  nn(i, t, e, s, null);
}
function nn(i, t, e, s, n) {
  let o, a, r, l, c, h, d, u;
  const f = t.pointStyle, m = t.rotation, g = t.radius;
  let p = (m || 0) * Do;
  if (f && typeof f == "object" && (o = f.toString(), o === "[object HTMLImageElement]" || o === "[object HTMLCanvasElement]")) {
    i.save(), i.translate(e, s), i.rotate(p), i.drawImage(f, -f.width / 2, -f.height / 2, f.width, f.height), i.restore();
    return;
  }
  if (!(isNaN(g) || g <= 0)) {
    switch (i.beginPath(), f) {
      default:
        n ? i.ellipse(e, s, n / 2, g, 0, 0, at) : i.arc(e, s, g, 0, at), i.closePath();
        break;
      case "triangle":
        h = n ? n / 2 : g, i.moveTo(e + Math.sin(p) * h, s - Math.cos(p) * g), p += Bi, i.lineTo(e + Math.sin(p) * h, s - Math.cos(p) * g), p += Bi, i.lineTo(e + Math.sin(p) * h, s - Math.cos(p) * g), i.closePath();
        break;
      case "rectRounded":
        c = g * 0.516, l = g - c, a = Math.cos(p + yt) * l, d = Math.cos(p + yt) * (n ? n / 2 - c : l), r = Math.sin(p + yt) * l, u = Math.sin(p + yt) * (n ? n / 2 - c : l), i.arc(e - d, s - r, c, p - V, p - it), i.arc(e + u, s - a, c, p - it, p), i.arc(e + d, s + r, c, p, p + it), i.arc(e - u, s + a, c, p + it, p + V), i.closePath();
        break;
      case "rect":
        if (!m) {
          l = Math.SQRT1_2 * g, h = n ? n / 2 : l, i.rect(e - h, s - l, 2 * h, 2 * l);
          break;
        }
        p += yt;
      case "rectRot":
        d = Math.cos(p) * (n ? n / 2 : g), a = Math.cos(p) * g, r = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - r), i.lineTo(e + u, s - a), i.lineTo(e + d, s + r), i.lineTo(e - u, s + a), i.closePath();
        break;
      case "crossRot":
        p += yt;
      case "cross":
        d = Math.cos(p) * (n ? n / 2 : g), a = Math.cos(p) * g, r = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - r), i.lineTo(e + d, s + r), i.moveTo(e + u, s - a), i.lineTo(e - u, s + a);
        break;
      case "star":
        d = Math.cos(p) * (n ? n / 2 : g), a = Math.cos(p) * g, r = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - r), i.lineTo(e + d, s + r), i.moveTo(e + u, s - a), i.lineTo(e - u, s + a), p += yt, d = Math.cos(p) * (n ? n / 2 : g), a = Math.cos(p) * g, r = Math.sin(p) * g, u = Math.sin(p) * (n ? n / 2 : g), i.moveTo(e - d, s - r), i.lineTo(e + d, s + r), i.moveTo(e + u, s - a), i.lineTo(e - u, s + a);
        break;
      case "line":
        a = n ? n / 2 : Math.cos(p) * g, r = Math.sin(p) * g, i.moveTo(e - a, s - r), i.lineTo(e + a, s + r);
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
function re(i, t, e) {
  return e = e || 0.5, !t || i && i.x > t.left - e && i.x < t.right + e && i.y > t.top - e && i.y < t.bottom + e;
}
function Mi(i, t) {
  i.save(), i.beginPath(), i.rect(t.left, t.top, t.right - t.left, t.bottom - t.top), i.clip();
}
function Si(i) {
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
function ta(i, t, e, s) {
  if (!t)
    return i.lineTo(e.x, e.y);
  i.bezierCurveTo(s ? t.cp1x : t.cp2x, s ? t.cp1y : t.cp2y, s ? e.cp2x : e.cp1x, s ? e.cp2y : e.cp1y, e.x, e.y);
}
function ea(i, t) {
  t.translation && i.translate(t.translation[0], t.translation[1]), F(t.rotation) || i.rotate(t.rotation), t.color && (i.fillStyle = t.color), t.textAlign && (i.textAlign = t.textAlign), t.textBaseline && (i.textBaseline = t.textBaseline);
}
function ia(i, t, e, s, n) {
  if (n.strikethrough || n.underline) {
    const o = i.measureText(s), a = t - o.actualBoundingBoxLeft, r = t + o.actualBoundingBoxRight, l = e - o.actualBoundingBoxAscent, c = e + o.actualBoundingBoxDescent, h = n.strikethrough ? (l + c) / 2 : c;
    i.strokeStyle = i.fillStyle, i.beginPath(), i.lineWidth = n.decorationWidth || 2, i.moveTo(a, h), i.lineTo(r, h), i.stroke();
  }
}
function sa(i, t) {
  const e = i.fillStyle;
  i.fillStyle = t.color, i.fillRect(t.left, t.top, t.width, t.height), i.fillStyle = e;
}
function le(i, t, e, s, n, o = {}) {
  const a = W(t) ? t : [
    t
  ], r = o.strokeWidth > 0 && o.strokeColor !== "";
  let l, c;
  for (i.save(), i.font = n.string, ea(i, o), l = 0; l < a.length; ++l)
    c = a[l], o.backdrop && sa(i, o.backdrop), r && (o.strokeColor && (i.strokeStyle = o.strokeColor), F(o.strokeWidth) || (i.lineWidth = o.strokeWidth), i.strokeText(c, e, s, o.maxWidth)), i.fillText(c, e, s, o.maxWidth), ia(i, e, s, c, o), s += Number(n.lineHeight);
  i.restore();
}
function ci(i, t) {
  const { x: e, y: s, w: n, h: o, radius: a } = t;
  i.arc(e + a.topLeft, s + a.topLeft, a.topLeft, 1.5 * V, V, !0), i.lineTo(e, s + o - a.bottomLeft), i.arc(e + a.bottomLeft, s + o - a.bottomLeft, a.bottomLeft, V, it, !0), i.lineTo(e + n - a.bottomRight, s + o), i.arc(e + n - a.bottomRight, s + o - a.bottomRight, a.bottomRight, it, 0, !0), i.lineTo(e + n, s + a.topRight), i.arc(e + n - a.topRight, s + a.topRight, a.topRight, 0, -it, !0), i.lineTo(e + a.topLeft, s);
}
const na = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/, oa = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function aa(i, t) {
  const e = ("" + i).match(na);
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
const ra = (i) => +i || 0;
function on(i, t) {
  const e = {}, s = L(t), n = s ? Object.keys(t) : t, o = L(i) ? s ? (a) => A(i[a], i[t[a]]) : (a) => i[a] : () => i;
  for (const a of n)
    e[a] = ra(o(a));
  return e;
}
function la(i) {
  return on(i, {
    top: "y",
    right: "x",
    bottom: "y",
    left: "x"
  });
}
function ie(i) {
  return on(i, [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);
}
function et(i) {
  const t = la(i);
  return t.width = t.left + t.right, t.height = t.top + t.bottom, t;
}
function $(i, t) {
  i = i || {}, t = t || B.font;
  let e = A(i.size, t.size);
  typeof e == "string" && (e = parseInt(e, 10));
  let s = A(i.style, t.style);
  s && !("" + s).match(oa) && (console.warn('Invalid font style specified: "' + s + '"'), s = void 0);
  const n = {
    family: A(i.family, t.family),
    lineHeight: aa(A(i.lineHeight, t.lineHeight), e),
    size: e,
    style: s,
    weight: A(i.weight, t.weight),
    string: ""
  };
  return n.string = Zo(n), n;
}
function xe(i, t, e, s) {
  let n, o, a;
  for (n = 0, o = i.length; n < o; ++n)
    if (a = i[n], a !== void 0 && a !== void 0)
      return a;
}
function ca(i, t, e) {
  const { min: s, max: n } = i, o = xo(t, (n - s) / 2), a = (r, l) => e && r === 0 ? 0 : r + l;
  return {
    min: a(s, -Math.abs(o)),
    max: a(n, o)
  };
}
function Pt(i, t) {
  return Object.assign(Object.create(i), t);
}
function Di(i, t = [
  ""
], e, s, n = () => i[0]) {
  const o = e || i;
  typeof s > "u" && (s = cn("_fallback", i));
  const a = {
    [Symbol.toStringTag]: "Object",
    _cacheable: !0,
    _scopes: i,
    _rootScopes: o,
    _fallback: s,
    _getTarget: n,
    override: (r) => Di([
      r,
      ...i
    ], t, o, s)
  };
  return new Proxy(a, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(r, l) {
      return delete r[l], delete r._keys, delete i[0][l], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(r, l) {
      return rn(r, l, () => ba(l, t, i, r));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(r, l) {
      return Reflect.getOwnPropertyDescriptor(r._scopes[0], l);
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
    has(r, l) {
      return Ki(r).includes(l);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys(r) {
      return Ki(r);
    },
    /**
    * A trap for setting property values.
    */
    set(r, l, c) {
      const h = r._storage || (r._storage = n());
      return r[l] = h[l] = c, delete r._keys, !0;
    }
  });
}
function Et(i, t, e, s) {
  const n = {
    _cacheable: !1,
    _proxy: i,
    _context: t,
    _subProxy: e,
    _stack: /* @__PURE__ */ new Set(),
    _descriptors: an(i, s),
    setContext: (o) => Et(i, o, e, s),
    override: (o) => Et(i.override(o), t, e, s)
  };
  return new Proxy(n, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(o, a) {
      return delete o[a], delete i[a], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(o, a, r) {
      return rn(o, a, () => da(o, a, r));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(o, a) {
      return o._descriptors.allKeys ? Reflect.has(i, a) ? {
        enumerable: !0,
        configurable: !0
      } : void 0 : Reflect.getOwnPropertyDescriptor(i, a);
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
    has(o, a) {
      return Reflect.has(i, a);
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
    set(o, a, r) {
      return i[a] = r, delete o[a], !0;
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
    isScriptable: bt(e) ? e : () => e,
    isIndexable: bt(s) ? s : () => s
  };
}
const ha = (i, t) => i ? i + yi(t) : t, Ci = (i, t) => L(t) && i !== "adapters" && (Object.getPrototypeOf(t) === null || t.constructor === Object);
function rn(i, t, e) {
  if (Object.prototype.hasOwnProperty.call(i, t) || t === "constructor")
    return i[t];
  const s = e();
  return i[t] = s, s;
}
function da(i, t, e) {
  const { _proxy: s, _context: n, _subProxy: o, _descriptors: a } = i;
  let r = s[t];
  return bt(r) && a.isScriptable(t) && (r = ua(t, r, i, e)), W(r) && r.length && (r = fa(t, r, i, a.isIndexable)), Ci(t, r) && (r = Et(r, n, o && o[t], a)), r;
}
function ua(i, t, e, s) {
  const { _proxy: n, _context: o, _subProxy: a, _stack: r } = e;
  if (r.has(i))
    throw new Error("Recursion detected: " + Array.from(r).join("->") + "->" + i);
  r.add(i);
  let l = t(o, a || s);
  return r.delete(i), Ci(i, l) && (l = Oi(n._scopes, n, i, l)), l;
}
function fa(i, t, e, s) {
  const { _proxy: n, _context: o, _subProxy: a, _descriptors: r } = e;
  if (typeof o.index < "u" && s(i))
    return t[o.index % t.length];
  if (L(t[0])) {
    const l = t, c = n._scopes.filter((h) => h !== l);
    t = [];
    for (const h of l) {
      const d = Oi(c, n, i, h);
      t.push(Et(d, o, a && a[i], r));
    }
  }
  return t;
}
function ln(i, t, e) {
  return bt(i) ? i(t, e) : i;
}
const ga = (i, t) => i === !0 ? t : typeof i == "string" ? Re(t, i) : void 0;
function pa(i, t, e, s, n) {
  for (const o of t) {
    const a = ga(e, o);
    if (a) {
      i.add(a);
      const r = ln(a._fallback, e, n);
      if (typeof r < "u" && r !== e && r !== s)
        return r;
    } else if (a === !1 && typeof s < "u" && e !== s)
      return null;
  }
  return !1;
}
function Oi(i, t, e, s) {
  const n = t._rootScopes, o = ln(t._fallback, e, s), a = [
    ...i,
    ...n
  ], r = /* @__PURE__ */ new Set();
  r.add(s);
  let l = Xi(r, a, e, o || e, s);
  return l === null || typeof o < "u" && o !== e && (l = Xi(r, a, o, l, s), l === null) ? !1 : Di(Array.from(r), [
    ""
  ], n, o, () => ma(t, e, s));
}
function Xi(i, t, e, s, n) {
  for (; e; )
    e = pa(i, t, e, s, n);
  return e;
}
function ma(i, t, e) {
  const s = i._getTarget();
  t in s || (s[t] = {});
  const n = s[t];
  return W(n) && L(e) ? e : n || {};
}
function ba(i, t, e, s) {
  let n;
  for (const o of t)
    if (n = cn(ha(o, i), e), typeof n < "u")
      return Ci(i, n) ? Oi(e, s, i, n) : n;
}
function cn(i, t) {
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
  return t || (t = i._keys = _a(i._scopes)), t;
}
function _a(i) {
  const t = /* @__PURE__ */ new Set();
  for (const e of i)
    for (const s of Object.keys(e).filter((n) => !n.startsWith("_")))
      t.add(s);
  return Array.from(t);
}
const xa = Number.EPSILON || 1e-14, Ht = (i, t) => t < i.length && !i[t].skip && i[t], hn = (i) => i === "x" ? "y" : "x";
function ya(i, t, e, s) {
  const n = i.skip ? t : i, o = t, a = e.skip ? t : e, r = ai(o, n), l = ai(a, o);
  let c = r / (r + l), h = l / (r + l);
  c = isNaN(c) ? 0 : c, h = isNaN(h) ? 0 : h;
  const d = s * c, u = s * h;
  return {
    previous: {
      x: o.x - d * (a.x - n.x),
      y: o.y - d * (a.y - n.y)
    },
    next: {
      x: o.x + u * (a.x - n.x),
      y: o.y + u * (a.y - n.y)
    }
  };
}
function va(i, t, e) {
  const s = i.length;
  let n, o, a, r, l, c = Ht(i, 0);
  for (let h = 0; h < s - 1; ++h)
    if (l = c, c = Ht(i, h + 1), !(!l || !c)) {
      if (Jt(t[h], 0, xa)) {
        e[h] = e[h + 1] = 0;
        continue;
      }
      n = e[h] / t[h], o = e[h + 1] / t[h], r = Math.pow(n, 2) + Math.pow(o, 2), !(r <= 9) && (a = 3 / Math.sqrt(r), e[h] = n * a * t[h], e[h + 1] = o * a * t[h]);
    }
}
function wa(i, t, e = "x") {
  const s = hn(e), n = i.length;
  let o, a, r, l = Ht(i, 0);
  for (let c = 0; c < n; ++c) {
    if (a = r, r = l, l = Ht(i, c + 1), !r)
      continue;
    const h = r[e], d = r[s];
    a && (o = (h - a[e]) / 3, r[`cp1${e}`] = h - o, r[`cp1${s}`] = d - o * t[c]), l && (o = (l[e] - h) / 3, r[`cp2${e}`] = h + o, r[`cp2${s}`] = d + o * t[c]);
  }
}
function ka(i, t = "x") {
  const e = hn(t), s = i.length, n = Array(s).fill(0), o = Array(s);
  let a, r, l, c = Ht(i, 0);
  for (a = 0; a < s; ++a)
    if (r = l, l = c, c = Ht(i, a + 1), !!l) {
      if (c) {
        const h = c[t] - l[t];
        n[a] = h !== 0 ? (c[e] - l[e]) / h : 0;
      }
      o[a] = r ? c ? zt(n[a - 1]) !== zt(n[a]) ? 0 : (n[a - 1] + n[a]) / 2 : n[a - 1] : n[a];
    }
  va(i, n, o), wa(i, o, t);
}
function ye(i, t, e) {
  return Math.max(Math.min(i, e), t);
}
function Ma(i, t) {
  let e, s, n, o, a, r = re(i[0], t);
  for (e = 0, s = i.length; e < s; ++e)
    a = o, o = r, r = e < s - 1 && re(i[e + 1], t), o && (n = i[e], a && (n.cp1x = ye(n.cp1x, t.left, t.right), n.cp1y = ye(n.cp1y, t.top, t.bottom)), r && (n.cp2x = ye(n.cp2x, t.left, t.right), n.cp2y = ye(n.cp2y, t.top, t.bottom)));
}
function Sa(i, t, e, s, n) {
  let o, a, r, l;
  if (t.spanGaps && (i = i.filter((c) => !c.skip)), t.cubicInterpolationMode === "monotone")
    ka(i, n);
  else {
    let c = s ? i[i.length - 1] : i[0];
    for (o = 0, a = i.length; o < a; ++o)
      r = i[o], l = ya(c, r, i[Math.min(o + 1, a - (s ? 0 : 1)) % a], t.tension), r.cp1x = l.previous.x, r.cp1y = l.previous.y, r.cp2x = l.next.x, r.cp2y = l.next.y, c = r;
  }
  t.capBezierPoints && Ma(i, e);
}
function Pi() {
  return typeof window < "u" && typeof document < "u";
}
function Ti(i) {
  let t = i.parentNode;
  return t && t.toString() === "[object ShadowRoot]" && (t = t.host), t;
}
function He(i, t, e) {
  let s;
  return typeof i == "string" ? (s = parseInt(i, 10), i.indexOf("%") !== -1 && (s = s / 100 * t.parentNode[e])) : s = i, s;
}
const We = (i) => i.ownerDocument.defaultView.getComputedStyle(i, null);
function Da(i, t) {
  return We(i).getPropertyValue(t);
}
const Ca = [
  "top",
  "right",
  "bottom",
  "left"
];
function Ct(i, t, e) {
  const s = {};
  e = e ? "-" + e : "";
  for (let n = 0; n < 4; n++) {
    const o = Ca[n];
    s[o] = parseFloat(i[t + "-" + o + e]) || 0;
  }
  return s.width = s.left + s.right, s.height = s.top + s.bottom, s;
}
const Oa = (i, t, e) => (i > 0 || t > 0) && (!e || !e.shadowRoot);
function Pa(i, t) {
  const e = i.touches, s = e && e.length ? e[0] : i, { offsetX: n, offsetY: o } = s;
  let a = !1, r, l;
  if (Oa(n, o, i.target))
    r = n, l = o;
  else {
    const c = t.getBoundingClientRect();
    r = s.clientX - c.left, l = s.clientY - c.top, a = !0;
  }
  return {
    x: r,
    y: l,
    box: a
  };
}
function kt(i, t) {
  if ("native" in i)
    return i;
  const { canvas: e, currentDevicePixelRatio: s } = t, n = We(e), o = n.boxSizing === "border-box", a = Ct(n, "padding"), r = Ct(n, "border", "width"), { x: l, y: c, box: h } = Pa(i, e), d = a.left + (h && r.left), u = a.top + (h && r.top);
  let { width: f, height: m } = t;
  return o && (f -= a.width + r.width, m -= a.height + r.height), {
    x: Math.round((l - d) / f * e.width / s),
    y: Math.round((c - u) / m * e.height / s)
  };
}
function Ta(i, t, e) {
  let s, n;
  if (t === void 0 || e === void 0) {
    const o = i && Ti(i);
    if (!o)
      t = i.clientWidth, e = i.clientHeight;
    else {
      const a = o.getBoundingClientRect(), r = We(o), l = Ct(r, "border", "width"), c = Ct(r, "padding");
      t = a.width - c.width - l.width, e = a.height - c.height - l.height, s = He(r.maxWidth, o, "clientWidth"), n = He(r.maxHeight, o, "clientHeight");
    }
  }
  return {
    width: t,
    height: e,
    maxWidth: s || Ee,
    maxHeight: n || Ee
  };
}
const ve = (i) => Math.round(i * 10) / 10;
function Aa(i, t, e, s) {
  const n = We(i), o = Ct(n, "margin"), a = He(n.maxWidth, i, "clientWidth") || Ee, r = He(n.maxHeight, i, "clientHeight") || Ee, l = Ta(i, t, e);
  let { width: c, height: h } = l;
  if (n.boxSizing === "content-box") {
    const u = Ct(n, "border", "width"), f = Ct(n, "padding");
    c -= f.width + u.width, h -= f.height + u.height;
  }
  return c = Math.max(0, c - o.width), h = Math.max(0, s ? c / s : h - o.height), c = ve(Math.min(c, a, l.maxWidth)), h = ve(Math.min(h, r, l.maxHeight)), c && !h && (h = ve(c / 2)), (t !== void 0 || e !== void 0) && s && l.height && h > l.height && (h = l.height, c = ve(Math.floor(h * s))), {
    width: c,
    height: h
  };
}
function Qi(i, t, e) {
  const s = t || 1, n = Math.floor(i.height * s), o = Math.floor(i.width * s);
  i.height = Math.floor(i.height), i.width = Math.floor(i.width);
  const a = i.canvas;
  return a.style && (e || !a.style.height && !a.style.width) && (a.style.height = `${i.height}px`, a.style.width = `${i.width}px`), i.currentDevicePixelRatio !== s || a.height !== n || a.width !== o ? (i.currentDevicePixelRatio = s, a.height = n, a.width = o, i.ctx.setTransform(s, 0, 0, s, 0, 0), !0) : !1;
}
const La = function() {
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
  const e = Da(i, t), s = e && e.match(/^(\d+)(\.\d+)?px$/);
  return s ? +s[1] : void 0;
}
function Mt(i, t, e, s) {
  return {
    x: i.x + e * (t.x - i.x),
    y: i.y + e * (t.y - i.y)
  };
}
function Ia(i, t, e, s) {
  return {
    x: i.x + e * (t.x - i.x),
    y: s === "middle" ? e < 0.5 ? i.y : t.y : s === "after" ? e < 1 ? i.y : t.y : e > 0 ? t.y : i.y
  };
}
function Fa(i, t, e, s) {
  const n = {
    x: i.cp2x,
    y: i.cp2y
  }, o = {
    x: t.cp1x,
    y: t.cp1y
  }, a = Mt(i, n, e), r = Mt(n, o, e), l = Mt(o, t, e), c = Mt(a, r, e), h = Mt(r, l, e);
  return Mt(c, h, e);
}
const Ra = function(i, t) {
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
}, za = function() {
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
function Rt(i, t, e) {
  return i ? Ra(t, e) : za();
}
function dn(i, t) {
  let e, s;
  (t === "ltr" || t === "rtl") && (e = i.canvas.style, s = [
    e.getPropertyValue("direction"),
    e.getPropertyPriority("direction")
  ], e.setProperty("direction", t, "important"), i.prevTextDirection = s);
}
function un(i, t) {
  t !== void 0 && (delete i.prevTextDirection, i.canvas.style.setProperty("direction", t[0], t[1]));
}
function fn(i) {
  return i === "angle" ? {
    between: Qs,
    compare: Io,
    normalize: gt
  } : {
    between: qt,
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
function Ea(i, t, e) {
  const { property: s, start: n, end: o } = e, { between: a, normalize: r } = fn(s), l = t.length;
  let { start: c, end: h, loop: d } = i, u, f;
  if (d) {
    for (c += l, h += l, u = 0, f = l; u < f && a(r(t[c % l][s]), n, o); ++u)
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
function Ha(i, t, e) {
  if (!e)
    return [
      i
    ];
  const { property: s, start: n, end: o } = e, a = t.length, { compare: r, between: l, normalize: c } = fn(s), { start: h, end: d, loop: u, style: f } = Ea(i, t, e), m = [];
  let g = !1, p = null, x, w, M;
  const S = () => l(n, M, x) && r(n, M) !== 0, _ = () => r(o, x) === 0 || l(o, M, x), b = () => g || S(), k = () => !g || _();
  for (let y = h, D = h; y <= d; ++y)
    w = t[y % a], !w.skip && (x = c(w[s]), x !== M && (g = l(x, n, o), p === null && b() && (p = r(x, n) === 0 ? y : D), p !== null && k() && (m.push(Ji({
      start: p,
      end: y,
      loop: u,
      count: a,
      style: f
    })), p = null), D = y, M = x));
  return p !== null && m.push(Ji({
    start: p,
    end: d,
    loop: u,
    count: a,
    style: f
  })), m;
}
function Ba(i, t) {
  const e = [], s = i.segments;
  for (let n = 0; n < s.length; n++) {
    const o = Ha(s[n], i.points, t);
    o.length && e.push(...o);
  }
  return e;
}
function Na(i, t, e, s) {
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
function Wa(i, t, e, s) {
  const n = i.length, o = [];
  let a = t, r = i[t], l;
  for (l = t + 1; l <= e; ++l) {
    const c = i[l % n];
    c.skip || c.stop ? r.skip || (s = !1, o.push({
      start: t % n,
      end: (l - 1) % n,
      loop: s
    }), t = a = c.stop ? l : null) : (a = l, r.skip && (t = l)), r = c;
  }
  return a !== null && o.push({
    start: t % n,
    end: a % n,
    loop: s
  }), o;
}
function Va(i, t) {
  const e = i.points, s = i.options.spanGaps, n = e.length;
  if (!n)
    return [];
  const o = !!i._loop, { start: a, end: r } = Na(e, n, o, s);
  if (s === !0)
    return ts(i, [
      {
        start: a,
        end: r,
        loop: o
      }
    ], e, t);
  const l = r < a ? r + n : r, c = !!i._fullLoop && a === 0 && r === n - 1;
  return ts(i, Wa(e, a, l, c), e, t);
}
function ts(i, t, e, s) {
  return !s || !s.setContext || !e ? t : ja(i, t, e, s);
}
function ja(i, t, e, s) {
  const n = i._chart.getContext(), o = es(i.options), { _datasetIndex: a, options: { spanGaps: r } } = i, l = e.length, c = [];
  let h = o, d = t[0].start, u = d;
  function f(m, g, p, x) {
    const w = r ? -1 : 1;
    if (m !== g) {
      for (m += l; e[m % l].skip; )
        m -= w;
      for (; e[g % l].skip; )
        g += w;
      m % l !== g % l && (c.push({
        start: m % l,
        end: g % l,
        loop: p,
        style: x
      }), h = x, d = g % l);
    }
  }
  for (const m of t) {
    d = r ? d : m.start;
    let g = e[d % l], p;
    for (u = d + 1; u <= m.end; u++) {
      const x = e[u % l];
      p = es(s.setContext(Pt(n, {
        type: "segment",
        p0: g,
        p1: x,
        p0DataIndex: (u - 1) % l,
        p1DataIndex: u % l,
        datasetIndex: a
      }))), $a(p, h) && f(d, u - 1, m.loop, h), g = x, h = p;
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
function $a(i, t) {
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
function Ya(i, t) {
  const { xScale: e, yScale: s } = i;
  return e && s ? {
    left: we(e, t, "left"),
    right: we(e, t, "right"),
    top: we(s, t, "top"),
    bottom: we(s, t, "bottom")
  } : t;
}
function Ua(i, t) {
  const e = t._clip;
  if (e.disabled)
    return !1;
  const s = Ya(t, i.chartArea);
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
class Ga {
  constructor() {
    this._request = null, this._charts = /* @__PURE__ */ new Map(), this._running = !1, this._lastDate = void 0;
  }
  _notify(t, e, s, n) {
    const o = e.listeners[n], a = e.duration;
    o.forEach((r) => r({
      chart: t,
      initial: e.initial,
      numSteps: a,
      currentStep: Math.min(s - e.start, a)
    }));
  }
  _refresh() {
    this._request || (this._running = !0, this._request = Js.call(window, () => {
      this._update(), this._request = null, this._running && this._refresh();
    }));
  }
  _update(t = Date.now()) {
    let e = 0;
    this._charts.forEach((s, n) => {
      if (!s.running || !s.items.length)
        return;
      const o = s.items;
      let a = o.length - 1, r = !1, l;
      for (; a >= 0; --a)
        l = o[a], l._active ? (l._total > s.duration && (s.duration = l._total), l.tick(t), r = !0) : (o[a] = o[o.length - 1], o.pop());
      r && (n.draw(), this._notify(n, s, t, "progress")), o.length || (s.running = !1, this._notify(n, s, t, "complete"), s.initial = !1), e += o.length;
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
var ct = /* @__PURE__ */ new Ga();
const is = "transparent", qa = {
  boolean(i, t, e) {
    return e > 0.5 ? t : i;
  },
  color(i, t, e) {
    const s = Yi(i || is), n = s.valid && Yi(t || is);
    return n && n.valid ? n.mix(s, e).hexString() : t;
  },
  number(i, t, e) {
    return i + (t - i) * e;
  }
};
class Xa {
  constructor(t, e, s, n) {
    const o = e[s];
    n = xe([
      t.to,
      n,
      o,
      t.from
    ]);
    const a = xe([
      t.from,
      o,
      n
    ]);
    this._active = !0, this._fn = t.fn || qa[t.type || typeof a], this._easing = te[t.easing] || te.linear, this._start = Math.floor(Date.now() + (t.delay || 0)), this._duration = this._total = Math.floor(t.duration), this._loop = !!t.loop, this._target = e, this._prop = s, this._from = a, this._to = n, this._promises = void 0;
  }
  active() {
    return this._active;
  }
  update(t, e, s) {
    if (this._active) {
      this._notify(!1);
      const n = this._target[this._prop], o = s - this._start, a = this._duration - o;
      this._start = s, this._duration = Math.floor(Math.max(a, t.duration)), this._total += o, this._loop = !!t.loop, this._to = xe([
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
    const e = t - this._start, s = this._duration, n = this._prop, o = this._from, a = this._loop, r = this._to;
    let l;
    if (this._active = o !== r && (a || e < s), !this._active) {
      this._target[n] = r, this._notify(!0);
      return;
    }
    if (e < 0) {
      this._target[n] = o;
      return;
    }
    l = e / s % 2, l = a && l > 1 ? 2 - l : l, l = this._easing(Math.min(1, Math.max(0, l))), this._target[n] = this._fn(o, r, l);
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
class gn {
  constructor(t, e) {
    this._chart = t, this._properties = /* @__PURE__ */ new Map(), this.configure(e);
  }
  configure(t) {
    if (!L(t))
      return;
    const e = Object.keys(B.animation), s = this._properties;
    Object.getOwnPropertyNames(t).forEach((n) => {
      const o = t[n];
      if (!L(o))
        return;
      const a = {};
      for (const r of e)
        a[r] = o[r];
      (W(o.properties) && o.properties || [
        n
      ]).forEach((r) => {
        (r === n || !s.has(r)) && s.set(r, a);
      });
    });
  }
  _animateOptions(t, e) {
    const s = e.options, n = Qa(t, s);
    if (!n)
      return [];
    const o = this._createAnimations(n, s);
    return s.$shared && Ka(t.options.$animations, s).then(() => {
      t.options = s;
    }, () => {
    }), o;
  }
  _createAnimations(t, e) {
    const s = this._properties, n = [], o = t.$animations || (t.$animations = {}), a = Object.keys(e), r = Date.now();
    let l;
    for (l = a.length - 1; l >= 0; --l) {
      const c = a[l];
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
          d.update(u, h, r);
          continue;
        } else
          d.cancel();
      if (!u || !u.duration) {
        t[c] = h;
        continue;
      }
      o[c] = d = new Xa(u, t, c, h), n.push(d);
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
      return ct.add(this._chart, s), !0;
  }
}
function Ka(i, t) {
  const e = [], s = Object.keys(t);
  for (let n = 0; n < s.length; n++) {
    const o = i[s[n]];
    o && o.active() && e.push(o.wait());
  }
  return Promise.all(e);
}
function Qa(i, t) {
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
function Za(i, t, e) {
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
function Ja(i) {
  let t, e, s, n;
  return L(i) ? (t = i.top, e = i.right, s = i.bottom, n = i.left) : t = e = s = n = i, {
    top: t,
    right: e,
    bottom: s,
    left: n,
    disabled: i === !1
  };
}
function pn(i, t) {
  const e = [], s = i._getSortedDatasetMetas(t);
  let n, o;
  for (n = 0, o = s.length; n < o; ++n)
    e.push(s[n].index);
  return e;
}
function ns(i, t, e, s = {}) {
  const n = i.keys, o = s.mode === "single";
  let a, r, l, c;
  if (t === null)
    return;
  let h = !1;
  for (a = 0, r = n.length; a < r; ++a) {
    if (l = +n[a], l === e) {
      if (h = !0, s.all)
        continue;
      break;
    }
    c = i.values[l], tt(c) && (o || t === 0 || zt(t) === zt(c)) && (t += c);
  }
  return !h && !s.all ? 0 : t;
}
function tr(i, t) {
  const { iScale: e, vScale: s } = t, n = e.axis === "x" ? "x" : "y", o = s.axis === "x" ? "x" : "y", a = Object.keys(i), r = new Array(a.length);
  let l, c, h;
  for (l = 0, c = a.length; l < c; ++l)
    h = a[l], r[l] = {
      [n]: h,
      [o]: i[h]
    };
  return r;
}
function Xe(i, t) {
  const e = i && i.options.stacked;
  return e || e === void 0 && t.stack !== void 0;
}
function er(i, t, e) {
  return `${i.id}.${t.id}.${e.stack || e.type}`;
}
function ir(i) {
  const { min: t, max: e, minDefined: s, maxDefined: n } = i.getUserBounds();
  return {
    min: s ? t : Number.NEGATIVE_INFINITY,
    max: n ? e : Number.POSITIVE_INFINITY
  };
}
function sr(i, t, e) {
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
function as(i, t) {
  const { chart: e, _cachedMeta: s } = i, n = e._stacks || (e._stacks = {}), { iScale: o, vScale: a, index: r } = s, l = o.axis, c = a.axis, h = er(o, a, s), d = t.length;
  let u;
  for (let f = 0; f < d; ++f) {
    const m = t[f], { [l]: g, [c]: p } = m, x = m._stacks || (m._stacks = {});
    u = x[c] = sr(n, h, g), u[r] = p, u._top = os(u, a, !0, s.type), u._bottom = os(u, a, !1, s.type);
    const w = u._visualValues || (u._visualValues = {});
    w[r] = p;
  }
}
function Ke(i, t) {
  const e = i.scales;
  return Object.keys(e).filter((s) => e[s].axis === t).shift();
}
function nr(i, t) {
  return Pt(i, {
    active: !1,
    dataset: void 0,
    datasetIndex: t,
    index: t,
    mode: "default",
    type: "dataset"
  });
}
function or(i, t, e) {
  return Pt(i, {
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
function Vt(i, t) {
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
const Qe = (i) => i === "reset" || i === "none", rs = (i, t) => t ? i : Object.assign({}, i), ar = (i, t, e) => i && !t.hidden && t._stacked && {
  keys: pn(e, !0),
  values: null
};
class se {
  constructor(t, e) {
    this.chart = t, this._ctx = t.ctx, this.index = e, this._cachedDataOpts = {}, this._cachedMeta = this.getMeta(), this._type = this._cachedMeta.type, this.options = void 0, this._parsing = !1, this._data = void 0, this._objectData = void 0, this._sharedOptions = void 0, this._drawStart = void 0, this._drawCount = void 0, this.enableOptionSharing = !1, this.supportsDecimation = !1, this.$context = void 0, this._syncList = [], this.datasetElementType = new.target.datasetElementType, this.dataElementType = new.target.dataElementType, this.initialize();
  }
  initialize() {
    const t = this._cachedMeta;
    this.configure(), this.linkScales(), t._stacked = Xe(t.vScale, t), this.addElements(), this.options.fill && !this.chart.isPluginEnabled("filler") && console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
  }
  updateIndex(t) {
    this.index !== t && Vt(this._cachedMeta), this.index = t;
  }
  linkScales() {
    const t = this.chart, e = this._cachedMeta, s = this.getDataset(), n = (d, u, f, m) => d === "x" ? u : d === "r" ? m : f, o = e.xAxisID = A(s.xAxisID, Ke(t, "x")), a = e.yAxisID = A(s.yAxisID, Ke(t, "y")), r = e.rAxisID = A(s.rAxisID, Ke(t, "r")), l = e.indexAxis, c = e.iAxisID = n(l, o, a, r), h = e.vAxisID = n(l, a, o, r);
    e.xScale = this.getScaleForId(o), e.yScale = this.getScaleForId(a), e.rScale = this.getScaleForId(r), e.iScale = this.getScaleForId(c), e.vScale = this.getScaleForId(h);
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
    this._data && Vi(this._data, this), t._stacked && Vt(t);
  }
  _dataCheck() {
    const t = this.getDataset(), e = t.data || (t.data = []), s = this._data;
    if (L(e)) {
      const n = this._cachedMeta;
      this._data = tr(e, n);
    } else if (s !== e) {
      if (s) {
        Vi(s, this);
        const n = this._cachedMeta;
        Vt(n), n._parsed = [];
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
    e._stacked = Xe(e.vScale, e), e.stack !== s.stack && (n = !0, Vt(e), e.stack = s.stack), this._resyncElements(t), (n || o !== e._stacked) && (as(this, e._parsed), e._stacked = Xe(e.vScale, e));
  }
  configure() {
    const t = this.chart.config, e = t.datasetScopeKeys(this._type), s = t.getOptionScopes(this.getDataset(), e, !0);
    this.options = t.createResolver(s, this.getContext()), this._parsing = this.options.parsing, this._cachedDataOpts = {};
  }
  parse(t, e) {
    const { _cachedMeta: s, _data: n } = this, { iScale: o, _stacked: a } = s, r = o.axis;
    let l = t === 0 && e === n.length ? !0 : s._sorted, c = t > 0 && s._parsed[t - 1], h, d, u;
    if (this._parsing === !1)
      s._parsed = n, s._sorted = !0, u = n;
    else {
      W(n[t]) ? u = this.parseArrayData(s, n, t, e) : L(n[t]) ? u = this.parseObjectData(s, n, t, e) : u = this.parsePrimitiveData(s, n, t, e);
      const f = () => d[r] === null || c && d[r] < c[r];
      for (h = 0; h < e; ++h)
        s._parsed[h + t] = d = u[h], l && (f() && (l = !1), c = d);
      s._sorted = l;
    }
    a && as(this, u);
  }
  parsePrimitiveData(t, e, s, n) {
    const { iScale: o, vScale: a } = t, r = o.axis, l = a.axis, c = o.getLabels(), h = o === a, d = new Array(n);
    let u, f, m;
    for (u = 0, f = n; u < f; ++u)
      m = u + s, d[u] = {
        [r]: h || o.parse(c[m], m),
        [l]: a.parse(e[m], m)
      };
    return d;
  }
  parseArrayData(t, e, s, n) {
    const { xScale: o, yScale: a } = t, r = new Array(n);
    let l, c, h, d;
    for (l = 0, c = n; l < c; ++l)
      h = l + s, d = e[h], r[l] = {
        x: o.parse(d[0], h),
        y: a.parse(d[1], h)
      };
    return r;
  }
  parseObjectData(t, e, s, n) {
    const { xScale: o, yScale: a } = t, { xAxisKey: r = "x", yAxisKey: l = "y" } = this._parsing, c = new Array(n);
    let h, d, u, f;
    for (h = 0, d = n; h < d; ++h)
      u = h + s, f = e[u], c[h] = {
        x: o.parse(Re(f, r), u),
        y: a.parse(Re(f, l), u)
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
    const n = this.chart, o = this._cachedMeta, a = e[t.axis], r = {
      keys: pn(n, !0),
      values: e._stacks[t.axis]._visualValues
    };
    return ns(r, a, o.index, {
      mode: s
    });
  }
  updateRangeFromParsed(t, e, s, n) {
    const o = s[e.axis];
    let a = o === null ? NaN : o;
    const r = n && s._stacks[e.axis];
    n && r && (n.values = r, a = ns(n, o, this._cachedMeta.index)), t.min = Math.min(t.min, a), t.max = Math.max(t.max, a);
  }
  getMinMax(t, e) {
    const s = this._cachedMeta, n = s._parsed, o = s._sorted && t === s.iScale, a = n.length, r = this._getOtherScale(t), l = ar(e, s, this.chart), c = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    }, { min: h, max: d } = ir(r);
    let u, f;
    function m() {
      f = n[u];
      const g = f[r.axis];
      return !tt(f[t.axis]) || h > g || d < g;
    }
    for (u = 0; u < a && !(!m() && (this.updateRangeFromParsed(c, t, f, l), o)); ++u)
      ;
    if (o) {
      for (u = a - 1; u >= 0; --u)
        if (!m()) {
          this.updateRangeFromParsed(c, t, f, l);
          break;
        }
    }
    return c;
  }
  getAllParsedValues(t) {
    const e = this._cachedMeta._parsed, s = [];
    let n, o, a;
    for (n = 0, o = e.length; n < o; ++n)
      a = e[n][t.axis], tt(a) && s.push(a);
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
    this.update(t || "default"), e._clip = Ja(A(this.options.clip, Za(e.xScale, e.yScale, this.getMaxOverflow())));
  }
  update(t) {
  }
  draw() {
    const t = this._ctx, e = this.chart, s = this._cachedMeta, n = s.data || [], o = e.chartArea, a = [], r = this._drawStart || 0, l = this._drawCount || n.length - r, c = this.options.drawActiveElementsOnTop;
    let h;
    for (s.dataset && s.dataset.draw(t, o, r, l), h = r; h < r + l; ++h) {
      const d = n[h];
      d.hidden || (d.active && c ? a.push(d) : d.draw(t, o));
    }
    for (h = 0; h < a.length; ++h)
      a[h].draw(t, o);
  }
  getStyle(t, e) {
    const s = e ? "active" : "default";
    return t === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(s) : this.resolveDataElementOptions(t || 0, s);
  }
  getContext(t, e, s) {
    const n = this.getDataset();
    let o;
    if (t >= 0 && t < this._cachedMeta.data.length) {
      const a = this._cachedMeta.data[t];
      o = a.$context || (a.$context = or(this.getContext(), t, a)), o.parsed = this.getParsed(t), o.raw = n.data[t], o.index = o.dataIndex = t;
    } else
      o = this.$context || (this.$context = nr(this.chart.getContext(), this.index)), o.dataset = n, o.index = o.datasetIndex = this.index;
    return o.active = !!e, o.mode = s, o;
  }
  resolveDatasetElementOptions(t) {
    return this._resolveElementOptions(this.datasetElementType.id, t);
  }
  resolveDataElementOptions(t, e) {
    return this._resolveElementOptions(this.dataElementType.id, e, t);
  }
  _resolveElementOptions(t, e = "default", s) {
    const n = e === "active", o = this._cachedDataOpts, a = t + "-" + e, r = o[a], l = this.enableOptionSharing && ze(s);
    if (r)
      return rs(r, l);
    const c = this.chart.config, h = c.datasetElementScopeKeys(this._type, t), d = n ? [
      `${t}Hover`,
      "hover",
      t,
      ""
    ] : [
      t,
      ""
    ], u = c.getOptionScopes(this.getDataset(), h), f = Object.keys(B.elements[t]), m = () => this.getContext(s, n, e), g = c.resolveNamedOptions(u, f, m, d);
    return g.$shared && (g.$shared = l, o[a] = Object.freeze(rs(g, l))), g;
  }
  _resolveAnimations(t, e, s) {
    const n = this.chart, o = this._cachedDataOpts, a = `animation-${e}`, r = o[a];
    if (r)
      return r;
    let l;
    if (n.options.animation !== !1) {
      const h = this.chart.config, d = h.datasetAnimationScopeKeys(this._type, e), u = h.getOptionScopes(this.getDataset(), d);
      l = h.createResolver(u, this.getContext(t, s, e));
    }
    const c = new gn(n, l && l.animations);
    return l && l._cacheable && (o[a] = Object.freeze(c)), c;
  }
  getSharedOptions(t) {
    if (t.$shared)
      return this._sharedOptions || (this._sharedOptions = Object.assign({}, t));
  }
  includeOptions(t, e) {
    return !e || Qe(t) || this.chart._animationsDisabled;
  }
  _getSharedOptions(t, e) {
    const s = this.resolveDataElementOptions(t, e), n = this._sharedOptions, o = this.getSharedOptions(s), a = this.includeOptions(e, o) || o !== n;
    return this.updateSharedOptions(o, e, s), {
      sharedOptions: o,
      includeOptions: a
    };
  }
  updateElement(t, e, s, n) {
    Qe(n) ? Object.assign(t, s) : this._resolveAnimations(e, n).update(t, s);
  }
  updateSharedOptions(t, e, s) {
    t && !Qe(e) && this._resolveAnimations(void 0, e).update(t, s);
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
    for (const [r, l, c] of this._syncList)
      this[r](l, c);
    this._syncList = [];
    const n = s.length, o = e.length, a = Math.min(o, n);
    a && this.parse(0, a), o > n ? this._insertElements(n, o - n, t) : o < n && this._removeElements(o, n - o);
  }
  _insertElements(t, e, s = !0) {
    const n = this._cachedMeta, o = n.data, a = t + e;
    let r;
    const l = (c) => {
      for (c.length += e, r = c.length - 1; r >= a; r--)
        c[r] = c[r - e];
    };
    for (l(o), r = t; r < a; ++r)
      o[r] = new this.dataElementType();
    this._parsing && l(n._parsed), this.parse(t, e), s && this.updateElements(o, t, e, "reset");
  }
  updateElements(t, e, s, n) {
  }
  _removeElements(t, e) {
    const s = this._cachedMeta;
    if (this._parsing) {
      const n = s._parsed.splice(t, e);
      s._stacked && Vt(s, n);
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
P(se, "defaults", {}), P(se, "datasetElementType", null), P(se, "dataElementType", null);
class Pe extends se {
  initialize() {
    this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize();
  }
  update(t) {
    const e = this._cachedMeta, { dataset: s, data: n = [], _dataset: o } = e, a = this.chart._animationsDisabled;
    let { start: r, count: l } = Wo(e, n, a);
    this._drawStart = r, this._drawCount = l, Vo(e) && (r = 0, l = n.length), s._chart = this.chart, s._datasetIndex = this.index, s._decimated = !!o._decimated, s.points = n;
    const c = this.resolveDatasetElementOptions(t);
    this.options.showLine || (c.borderWidth = 0), c.segment = this.options.segment, this.updateElement(s, void 0, {
      animated: !a,
      options: c
    }, t), this.updateElements(n, r, l, t);
  }
  updateElements(t, e, s, n) {
    const o = n === "reset", { iScale: a, vScale: r, _stacked: l, _dataset: c } = this._cachedMeta, { sharedOptions: h, includeOptions: d } = this._getSharedOptions(e, n), u = a.axis, f = r.axis, { spanGaps: m, segment: g } = this.options, p = ae(m) ? m : Number.POSITIVE_INFINITY, x = this.chart._animationsDisabled || o || n === "none", w = e + s, M = t.length;
    let S = e > 0 && this.getParsed(e - 1);
    for (let _ = 0; _ < M; ++_) {
      const b = t[_], k = x ? b : {};
      if (_ < e || _ >= w) {
        k.skip = !0;
        continue;
      }
      const y = this.getParsed(_), D = F(y[f]), O = k[u] = a.getPixelForValue(y[u], _), C = k[f] = o || D ? r.getBasePixel() : r.getPixelForValue(l ? this.applyStack(r, y, l) : y[f], _);
      k.skip = isNaN(O) || isNaN(C) || D, k.stop = _ > 0 && Math.abs(y[u] - S[u]) > p, g && (k.parsed = y, k.raw = c.data[_]), d && (k.options = h || this.resolveDataElementOptions(_, b.active ? "active" : n)), x || this.updateElement(b, _, k, n), S = y;
    }
  }
  getMaxOverflow() {
    const t = this._cachedMeta, e = t.dataset, s = e.options && e.options.borderWidth || 0, n = t.data || [];
    if (!n.length)
      return s;
    const o = n[0].size(this.resolveDataElementOptions(0)), a = n[n.length - 1].size(this.resolveDataElementOptions(n.length - 1));
    return Math.max(s, o, a) / 2;
  }
  draw() {
    const t = this._cachedMeta;
    t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis), super.draw();
  }
}
P(Pe, "id", "line"), P(Pe, "defaults", {
  datasetElementType: "line",
  dataElementType: "point",
  showLine: !0,
  spanGaps: !1
}), P(Pe, "overrides", {
  scales: {
    _index_: {
      type: "category"
    },
    _value_: {
      type: "linear"
    }
  }
});
function wt() {
  throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
}
class Ai {
  constructor(t) {
    P(this, "options");
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
    return wt();
  }
  parse() {
    return wt();
  }
  format() {
    return wt();
  }
  add() {
    return wt();
  }
  diff() {
    return wt();
  }
  startOf() {
    return wt();
  }
  endOf() {
    return wt();
  }
}
var rr = {
  _date: Ai
};
function lr(i, t, e, s) {
  const { controller: n, data: o, _sorted: a } = i, r = n._cachedMeta.iScale, l = i.dataset && i.dataset.options ? i.dataset.options.spanGaps : null;
  if (r && t === r.axis && t !== "r" && a && o.length) {
    const c = r._reversePixels ? Ro : Dt;
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
        const { vScale: d } = n._cachedMeta, { _parsed: u } = i, f = u.slice(0, h.lo + 1).reverse().findIndex((g) => !F(g[d.axis]));
        h.lo -= Math.max(0, f);
        const m = u.slice(h.hi).findIndex((g) => !F(g[d.axis]));
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
function Ve(i, t, e, s, n) {
  const o = i.getSortedVisibleDatasetMetas(), a = e[t];
  for (let r = 0, l = o.length; r < l; ++r) {
    const { index: c, data: h } = o[r], { lo: d, hi: u } = lr(o[r], t, a, n);
    for (let f = d; f <= u; ++f) {
      const m = h[f];
      m.skip || s(m, c, f);
    }
  }
}
function cr(i) {
  const t = i.indexOf("x") !== -1, e = i.indexOf("y") !== -1;
  return function(s, n) {
    const o = t ? Math.abs(s.x - n.x) : 0, a = e ? Math.abs(s.y - n.y) : 0;
    return Math.sqrt(Math.pow(o, 2) + Math.pow(a, 2));
  };
}
function Ze(i, t, e, s, n) {
  const o = [];
  return !n && !i.isPointInArea(t) || Ve(i, e, t, function(r, l, c) {
    !n && !re(r, i.chartArea, 0) || r.inRange(t.x, t.y, s) && o.push({
      element: r,
      datasetIndex: l,
      index: c
    });
  }, !0), o;
}
function hr(i, t, e, s) {
  let n = [];
  function o(a, r, l) {
    const { startAngle: c, endAngle: h } = a.getProps([
      "startAngle",
      "endAngle"
    ], s), { angle: d } = Lo(a, {
      x: t.x,
      y: t.y
    });
    Qs(d, c, h) && n.push({
      element: a,
      datasetIndex: r,
      index: l
    });
  }
  return Ve(i, e, t, o), n;
}
function dr(i, t, e, s, n, o) {
  let a = [];
  const r = cr(e);
  let l = Number.POSITIVE_INFINITY;
  function c(h, d, u) {
    const f = h.inRange(t.x, t.y, n);
    if (s && !f)
      return;
    const m = h.getCenterPoint(n);
    if (!(!!o || i.isPointInArea(m)) && !f)
      return;
    const p = r(t, m);
    p < l ? (a = [
      {
        element: h,
        datasetIndex: d,
        index: u
      }
    ], l = p) : p === l && a.push({
      element: h,
      datasetIndex: d,
      index: u
    });
  }
  return Ve(i, e, t, c), a;
}
function Je(i, t, e, s, n, o) {
  return !o && !i.isPointInArea(t) ? [] : e === "r" && !s ? hr(i, t, e, n) : dr(i, t, e, s, n, o);
}
function ls(i, t, e, s, n) {
  const o = [], a = e === "x" ? "inXRange" : "inYRange";
  let r = !1;
  return Ve(i, e, t, (l, c, h) => {
    l[a] && l[a](t[e], n) && (o.push({
      element: l,
      datasetIndex: c,
      index: h
    }), r = r || l.inRange(t.x, t.y, n));
  }), s && !r ? [] : o;
}
var ur = {
  modes: {
    index(i, t, e, s) {
      const n = kt(t, i), o = e.axis || "x", a = e.includeInvisible || !1, r = e.intersect ? Ze(i, n, o, s, a) : Je(i, n, o, !1, s, a), l = [];
      return r.length ? (i.getSortedVisibleDatasetMetas().forEach((c) => {
        const h = r[0].index, d = c.data[h];
        d && !d.skip && l.push({
          element: d,
          datasetIndex: c.index,
          index: h
        });
      }), l) : [];
    },
    dataset(i, t, e, s) {
      const n = kt(t, i), o = e.axis || "xy", a = e.includeInvisible || !1;
      let r = e.intersect ? Ze(i, n, o, s, a) : Je(i, n, o, !1, s, a);
      if (r.length > 0) {
        const l = r[0].datasetIndex, c = i.getDatasetMeta(l).data;
        r = [];
        for (let h = 0; h < c.length; ++h)
          r.push({
            element: c[h],
            datasetIndex: l,
            index: h
          });
      }
      return r;
    },
    point(i, t, e, s) {
      const n = kt(t, i), o = e.axis || "xy", a = e.includeInvisible || !1;
      return Ze(i, n, o, s, a);
    },
    nearest(i, t, e, s) {
      const n = kt(t, i), o = e.axis || "xy", a = e.includeInvisible || !1;
      return Je(i, n, o, e.intersect, s, a);
    },
    x(i, t, e, s) {
      const n = kt(t, i);
      return ls(i, n, "x", e.intersect, s);
    },
    y(i, t, e, s) {
      const n = kt(t, i);
      return ls(i, n, "y", e.intersect, s);
    }
  }
};
const mn = [
  "left",
  "top",
  "right",
  "bottom"
];
function jt(i, t) {
  return i.filter((e) => e.pos === t);
}
function cs(i, t) {
  return i.filter((e) => mn.indexOf(e.pos) === -1 && e.box.axis === t);
}
function $t(i, t) {
  return i.sort((e, s) => {
    const n = t ? s : e, o = t ? e : s;
    return n.weight === o.weight ? n.index - o.index : n.weight - o.weight;
  });
}
function fr(i) {
  const t = [];
  let e, s, n, o, a, r;
  for (e = 0, s = (i || []).length; e < s; ++e)
    n = i[e], { position: o, options: { stack: a, stackWeight: r = 1 } } = n, t.push({
      index: e,
      box: n,
      pos: o,
      horizontal: n.isHorizontal(),
      weight: n.weight,
      stack: a && o + a,
      stackWeight: r
    });
  return t;
}
function gr(i) {
  const t = {};
  for (const e of i) {
    const { stack: s, pos: n, stackWeight: o } = e;
    if (!s || !mn.includes(n))
      continue;
    const a = t[s] || (t[s] = {
      count: 0,
      placed: 0,
      weight: 0,
      size: 0
    });
    a.count++, a.weight += o;
  }
  return t;
}
function pr(i, t) {
  const e = gr(i), { vBoxMaxWidth: s, hBoxMaxHeight: n } = t;
  let o, a, r;
  for (o = 0, a = i.length; o < a; ++o) {
    r = i[o];
    const { fullSize: l } = r.box, c = e[r.stack], h = c && r.stackWeight / c.weight;
    r.horizontal ? (r.width = h ? h * s : l && t.availableWidth, r.height = n) : (r.width = s, r.height = h ? h * n : l && t.availableHeight);
  }
  return e;
}
function mr(i) {
  const t = fr(i), e = $t(t.filter((c) => c.box.fullSize), !0), s = $t(jt(t, "left"), !0), n = $t(jt(t, "right")), o = $t(jt(t, "top"), !0), a = $t(jt(t, "bottom")), r = cs(t, "x"), l = cs(t, "y");
  return {
    fullSize: e,
    leftAndTop: s.concat(o),
    rightAndBottom: n.concat(l).concat(a).concat(r),
    chartArea: jt(t, "chartArea"),
    vertical: s.concat(n).concat(l),
    horizontal: o.concat(a).concat(r)
  };
}
function hs(i, t, e, s) {
  return Math.max(i[e], t[e]) + Math.max(i[s], t[s]);
}
function bn(i, t) {
  i.top = Math.max(i.top, t.top), i.left = Math.max(i.left, t.left), i.bottom = Math.max(i.bottom, t.bottom), i.right = Math.max(i.right, t.right);
}
function br(i, t, e, s) {
  const { pos: n, box: o } = e, a = i.maxPadding;
  if (!L(n)) {
    e.size && (i[n] -= e.size);
    const d = s[e.stack] || {
      size: 0,
      count: 1
    };
    d.size = Math.max(d.size, e.horizontal ? o.height : o.width), e.size = d.size / d.count, i[n] += e.size;
  }
  o.getPadding && bn(a, o.getPadding());
  const r = Math.max(0, t.outerWidth - hs(a, i, "left", "right")), l = Math.max(0, t.outerHeight - hs(a, i, "top", "bottom")), c = r !== i.w, h = l !== i.h;
  return i.w = r, i.h = l, e.horizontal ? {
    same: c,
    other: h
  } : {
    same: h,
    other: c
  };
}
function _r(i) {
  const t = i.maxPadding;
  function e(s) {
    const n = Math.max(t[s] - i[s], 0);
    return i[s] += n, n;
  }
  i.y += e("top"), i.x += e("left"), e("right"), e("bottom");
}
function xr(i, t) {
  const e = t.maxPadding;
  function s(n) {
    const o = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
    return n.forEach((a) => {
      o[a] = Math.max(t[a], e[a]);
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
function Xt(i, t, e, s) {
  const n = [];
  let o, a, r, l, c, h;
  for (o = 0, a = i.length, c = 0; o < a; ++o) {
    r = i[o], l = r.box, l.update(r.width || t.w, r.height || t.h, xr(r.horizontal, t));
    const { same: d, other: u } = br(t, e, r, s);
    c |= d && n.length, h = h || u, l.fullSize || n.push(r);
  }
  return c && Xt(n, t, e, s) || h;
}
function ke(i, t, e, s, n) {
  i.top = e, i.left = t, i.right = t + s, i.bottom = e + n, i.width = s, i.height = n;
}
function ds(i, t, e, s) {
  const n = e.padding;
  let { x: o, y: a } = t;
  for (const r of i) {
    const l = r.box, c = s[r.stack] || {
      placed: 0,
      weight: 1
    }, h = r.stackWeight / c.weight || 1;
    if (r.horizontal) {
      const d = t.w * h, u = c.size || l.height;
      ze(c.start) && (a = c.start), l.fullSize ? ke(l, n.left, a, e.outerWidth - n.right - n.left, u) : ke(l, t.left + c.placed, a, d, u), c.start = a, c.placed += d, a = l.bottom;
    } else {
      const d = t.h * h, u = c.size || l.width;
      ze(c.start) && (o = c.start), l.fullSize ? ke(l, o, n.top, u, e.outerHeight - n.bottom - n.top) : ke(l, o, t.top + c.placed, u, d), c.start = o, c.placed += d, o = l.right;
    }
  }
  t.x = o, t.y = a;
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
    const n = et(i.options.layout.padding), o = Math.max(t - n.width, 0), a = Math.max(e - n.height, 0), r = mr(i.boxes), l = r.vertical, c = r.horizontal;
    I(i.boxes, (g) => {
      typeof g.beforeLayout == "function" && g.beforeLayout();
    });
    const h = l.reduce((g, p) => p.box.options && p.box.options.display === !1 ? g : g + 1, 0) || 1, d = Object.freeze({
      outerWidth: t,
      outerHeight: e,
      padding: n,
      availableWidth: o,
      availableHeight: a,
      vBoxMaxWidth: o / 2 / h,
      hBoxMaxHeight: a / 2
    }), u = Object.assign({}, n);
    bn(u, et(s));
    const f = Object.assign({
      maxPadding: u,
      w: o,
      h: a,
      x: n.left,
      y: n.top
    }, n), m = pr(l.concat(c), d);
    Xt(r.fullSize, f, d, m), Xt(l, f, d, m), Xt(c, f, d, m) && Xt(l, f, d, m), _r(f), ds(r.leftAndTop, f, d, m), f.x += f.w, f.y += f.h, ds(r.rightAndBottom, f, d, m), i.chartArea = {
      left: f.left,
      top: f.top,
      right: f.left + f.w,
      bottom: f.top + f.h,
      height: f.h,
      width: f.w
    }, I(r.chartArea, (g) => {
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
class _n {
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
class yr extends _n {
  acquireContext(t) {
    return t && t.getContext && t.getContext("2d") || null;
  }
  updateConfig(t) {
    t.options.animation = !1;
  }
}
const Te = "$chartjs", vr = {
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
function wr(i, t) {
  const e = i.style, s = i.getAttribute("height"), n = i.getAttribute("width");
  if (i[Te] = {
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
const xn = La ? {
  passive: !0
} : !1;
function kr(i, t, e) {
  i && i.addEventListener(t, e, xn);
}
function Mr(i, t, e) {
  i && i.canvas && i.canvas.removeEventListener(t, e, xn);
}
function Sr(i, t) {
  const e = vr[i.type] || i.type, { x: s, y: n } = kt(i, t);
  return {
    type: e,
    chart: t,
    native: i,
    x: s !== void 0 ? s : null,
    y: n !== void 0 ? n : null
  };
}
function Be(i, t) {
  for (const e of i)
    if (e === t || e.contains(t))
      return !0;
}
function Dr(i, t, e) {
  const s = i.canvas, n = new MutationObserver((o) => {
    let a = !1;
    for (const r of o)
      a = a || Be(r.addedNodes, s), a = a && !Be(r.removedNodes, s);
    a && e();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
function Cr(i, t, e) {
  const s = i.canvas, n = new MutationObserver((o) => {
    let a = !1;
    for (const r of o)
      a = a || Be(r.removedNodes, s), a = a && !Be(r.addedNodes, s);
    a && e();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
const ce = /* @__PURE__ */ new Map();
let fs = 0;
function yn() {
  const i = window.devicePixelRatio;
  i !== fs && (fs = i, ce.forEach((t, e) => {
    e.currentDevicePixelRatio !== i && t();
  }));
}
function Or(i, t) {
  ce.size || window.addEventListener("resize", yn), ce.set(i, t);
}
function Pr(i) {
  ce.delete(i), ce.size || window.removeEventListener("resize", yn);
}
function Tr(i, t, e) {
  const s = i.canvas, n = s && Ti(s);
  if (!n)
    return;
  const o = tn((r, l) => {
    const c = n.clientWidth;
    e(r, l), c < n.clientWidth && e();
  }, window), a = new ResizeObserver((r) => {
    const l = r[0], c = l.contentRect.width, h = l.contentRect.height;
    c === 0 && h === 0 || o(c, h);
  });
  return a.observe(n), Or(i, o), a;
}
function ti(i, t, e) {
  e && e.disconnect(), t === "resize" && Pr(i);
}
function Ar(i, t, e) {
  const s = i.canvas, n = tn((o) => {
    i.ctx !== null && e(Sr(o, i));
  }, i);
  return kr(s, t, n), n;
}
class Lr extends _n {
  acquireContext(t, e) {
    const s = t && t.getContext && t.getContext("2d");
    return s && s.canvas === t ? (wr(t, e), s) : null;
  }
  releaseContext(t) {
    const e = t.canvas;
    if (!e[Te])
      return !1;
    const s = e[Te].initial;
    [
      "height",
      "width"
    ].forEach((o) => {
      const a = s[o];
      F(a) ? e.removeAttribute(o) : e.setAttribute(o, a);
    });
    const n = s.style || {};
    return Object.keys(n).forEach((o) => {
      e.style[o] = n[o];
    }), e.width = e.width, delete e[Te], !0;
  }
  addEventListener(t, e, s) {
    this.removeEventListener(t, e);
    const n = t.$proxies || (t.$proxies = {}), a = {
      attach: Dr,
      detach: Cr,
      resize: Tr
    }[e] || Ar;
    n[e] = a(t, e, s);
  }
  removeEventListener(t, e) {
    const s = t.$proxies || (t.$proxies = {}), n = s[e];
    if (!n)
      return;
    ({
      attach: ti,
      detach: ti,
      resize: ti
    }[e] || Mr)(t, e, n), s[e] = void 0;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(t, e, s, n) {
    return Aa(t, e, s, n);
  }
  isAttached(t) {
    const e = t && Ti(t);
    return !!(e && e.isConnected);
  }
}
function Ir(i) {
  return !Pi() || typeof OffscreenCanvas < "u" && i instanceof OffscreenCanvas ? yr : Lr;
}
class ut {
  constructor() {
    P(this, "x");
    P(this, "y");
    P(this, "active", !1);
    P(this, "options");
    P(this, "$animations");
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
    return ae(this.x) && ae(this.y);
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
P(ut, "defaults", {}), P(ut, "defaultRoutes");
function Fr(i, t) {
  const e = i.options.ticks, s = Rr(i), n = Math.min(e.maxTicksLimit || s, s), o = e.major.enabled ? Er(t) : [], a = o.length, r = o[0], l = o[a - 1], c = [];
  if (a > n)
    return Hr(t, c, o, a / n), c;
  const h = zr(o, t, n);
  if (a > 0) {
    let d, u;
    const f = a > 1 ? Math.round((l - r) / (a - 1)) : null;
    for (Me(t, c, h, F(f) ? 0 : r - f, r), d = 0, u = a - 1; d < u; d++)
      Me(t, c, h, o[d], o[d + 1]);
    return Me(t, c, h, l, F(f) ? t.length : l + f), c;
  }
  return Me(t, c, h), c;
}
function Rr(i) {
  const t = i.options.offset, e = i._tickSize(), s = i._length / e + (t ? 0 : 1), n = i._maxLength / e;
  return Math.floor(Math.min(s, n));
}
function zr(i, t, e) {
  const s = Br(i), n = t.length / e;
  if (!s)
    return Math.max(n, 1);
  const o = Co(s);
  for (let a = 0, r = o.length - 1; a < r; a++) {
    const l = o[a];
    if (l > n)
      return l;
  }
  return Math.max(n, 1);
}
function Er(i) {
  const t = [];
  let e, s;
  for (e = 0, s = i.length; e < s; e++)
    i[e].major && t.push(e);
  return t;
}
function Hr(i, t, e, s) {
  let n = 0, o = e[0], a;
  for (s = Math.ceil(s), a = 0; a < i.length; a++)
    a === o && (t.push(i[a]), n++, o = e[n * s]);
}
function Me(i, t, e, s, n) {
  const o = A(s, 0), a = Math.min(A(n, i.length), i.length);
  let r = 0, l, c, h;
  for (e = Math.ceil(e), n && (l = n - s, e = l / Math.floor(l / e)), h = o; h < 0; )
    r++, h = Math.round(o + r * e);
  for (c = Math.max(o, 0); c < a; c++)
    c === h && (t.push(i[c]), r++, h = Math.round(o + r * e));
}
function Br(i) {
  const t = i.length;
  let e, s;
  if (t < 2)
    return !1;
  for (s = i[0], e = 1; e < t; ++e)
    if (i[e] - i[e - 1] !== s)
      return !1;
  return s;
}
const Nr = (i) => i === "left" ? "right" : i === "right" ? "left" : i, gs = (i, t, e) => t === "top" || t === "left" ? i[t] + e : i[t] - e, ps = (i, t) => Math.min(t || i, i);
function ms(i, t) {
  const e = [], s = i.length / t, n = i.length;
  let o = 0;
  for (; o < n; o += s)
    e.push(i[Math.floor(o)]);
  return e;
}
function Wr(i, t, e) {
  const s = i.ticks.length, n = Math.min(t, s - 1), o = i._startPixel, a = i._endPixel, r = 1e-6;
  let l = i.getPixelForTick(n), c;
  if (!(e && (s === 1 ? c = Math.max(l - o, a - l) : t === 0 ? c = (i.getPixelForTick(1) - l) / 2 : c = (l - i.getPixelForTick(n - 1)) / 2, l += n < t ? c : -c, l < o - r || l > a + r)))
    return l;
}
function Vr(i, t) {
  I(i, (e) => {
    const s = e.gc, n = s.length / 2;
    let o;
    if (n > t) {
      for (o = 0; o < n; ++o)
        delete e.data[s[o]];
      s.splice(0, n);
    }
  });
}
function Yt(i) {
  return i.drawTicks ? i.tickLength : 0;
}
function bs(i, t) {
  if (!i.display)
    return 0;
  const e = $(i.font, t), s = et(i.padding);
  return (W(i.text) ? i.text.length : 1) * e.lineHeight + s.height;
}
function jr(i, t) {
  return Pt(i, {
    scale: t,
    type: "scale"
  });
}
function $r(i, t, e) {
  return Pt(i, {
    tick: e,
    index: t,
    type: "tick"
  });
}
function Yr(i, t, e) {
  let s = wi(i);
  return (e && t !== "right" || !e && t === "right") && (s = Nr(s)), s;
}
function Ur(i, t, e, s) {
  const { top: n, left: o, bottom: a, right: r, chart: l } = i, { chartArea: c, scales: h } = l;
  let d = 0, u, f, m;
  const g = a - n, p = r - o;
  if (i.isHorizontal()) {
    if (f = j(s, o, r), L(e)) {
      const x = Object.keys(e)[0], w = e[x];
      m = h[x].getPixelForValue(w) + g - t;
    } else e === "center" ? m = (c.bottom + c.top) / 2 + g - t : m = gs(i, e, t);
    u = r - o;
  } else {
    if (L(e)) {
      const x = Object.keys(e)[0], w = e[x];
      f = h[x].getPixelForValue(w) - p + t;
    } else e === "center" ? f = (c.left + c.right) / 2 - p + t : f = gs(i, e, t);
    m = j(s, a, n), d = e === "left" ? -it : it;
  }
  return {
    titleX: f,
    titleY: m,
    maxWidth: u,
    rotation: d
  };
}
class Bt extends ut {
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
    return t = st(t, Number.POSITIVE_INFINITY), e = st(e, Number.NEGATIVE_INFINITY), s = st(s, Number.POSITIVE_INFINITY), n = st(n, Number.NEGATIVE_INFINITY), {
      min: st(t, s),
      max: st(e, n),
      minDefined: tt(t),
      maxDefined: tt(e)
    };
  }
  getMinMax(t) {
    let { min: e, max: s, minDefined: n, maxDefined: o } = this.getUserBounds(), a;
    if (n && o)
      return {
        min: e,
        max: s
      };
    const r = this.getMatchingVisibleMetas();
    for (let l = 0, c = r.length; l < c; ++l)
      a = r[l].controller.getMinMax(this, t), n || (e = Math.min(e, a.min)), o || (s = Math.max(s, a.max));
    return e = o && e > s ? s : e, s = n && e > s ? e : s, {
      min: st(e, st(s, e)),
      max: st(s, st(e, s))
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
    z(this.options.beforeUpdate, [
      this
    ]);
  }
  update(t, e, s) {
    const { beginAtZero: n, grace: o, ticks: a } = this.options, r = a.sampleSize;
    this.beforeUpdate(), this.maxWidth = t, this.maxHeight = e, this._margins = s = Object.assign({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, s), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + s.left + s.right : this.height + s.top + s.bottom, this._dataLimitsCached || (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = ca(this, o, n), this._dataLimitsCached = !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
    const l = r < this.ticks.length;
    this._convertTicksToLabels(l ? ms(this.ticks, r) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), a.display && (a.autoSkip || a.source === "auto") && (this.ticks = Fr(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), l && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate();
  }
  configure() {
    let t = this.options.reverse, e, s;
    this.isHorizontal() ? (e = this.left, s = this.right) : (e = this.top, s = this.bottom, t = !t), this._startPixel = e, this._endPixel = s, this._reversePixels = t, this._length = s - e, this._alignToPixels = this.options.alignToPixels;
  }
  afterUpdate() {
    z(this.options.afterUpdate, [
      this
    ]);
  }
  beforeSetDimensions() {
    z(this.options.beforeSetDimensions, [
      this
    ]);
  }
  setDimensions() {
    this.isHorizontal() ? (this.width = this.maxWidth, this.left = 0, this.right = this.width) : (this.height = this.maxHeight, this.top = 0, this.bottom = this.height), this.paddingLeft = 0, this.paddingTop = 0, this.paddingRight = 0, this.paddingBottom = 0;
  }
  afterSetDimensions() {
    z(this.options.afterSetDimensions, [
      this
    ]);
  }
  _callHooks(t) {
    this.chart.notifyPlugins(t, this.getContext()), z(this.options[t], [
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
    z(this.options.beforeTickToLabelConversion, [
      this
    ]);
  }
  generateTickLabels(t) {
    const e = this.options.ticks;
    let s, n, o;
    for (s = 0, n = t.length; s < n; s++)
      o = t[s], o.label = z(e.callback, [
        o.value,
        s,
        t
      ], this);
  }
  afterTickToLabelConversion() {
    z(this.options.afterTickToLabelConversion, [
      this
    ]);
  }
  beforeCalculateLabelRotation() {
    z(this.options.beforeCalculateLabelRotation, [
      this
    ]);
  }
  calculateLabelRotation() {
    const t = this.options, e = t.ticks, s = ps(this.ticks.length, t.ticks.maxTicksLimit), n = e.minRotation || 0, o = e.maxRotation;
    let a = n, r, l, c;
    if (!this._isVisible() || !e.display || n >= o || s <= 1 || !this.isHorizontal()) {
      this.labelRotation = n;
      return;
    }
    const h = this._getLabelSizes(), d = h.widest.width, u = h.highest.height, f = Z(this.chart.width - d, 0, this.maxWidth);
    r = t.offset ? this.maxWidth / s : f / (s - 1), d + 6 > r && (r = f / (s - (t.offset ? 0.5 : 1)), l = this.maxHeight - Yt(t.grid) - e.padding - bs(t.title, this.chart.options.font), c = Math.sqrt(d * d + u * u), a = Ao(Math.min(Math.asin(Z((h.highest.height + 6) / r, -1, 1)), Math.asin(Z(l / c, -1, 1)) - Math.asin(Z(u / c, -1, 1)))), a = Math.max(n, Math.min(o, a))), this.labelRotation = a;
  }
  afterCalculateLabelRotation() {
    z(this.options.afterCalculateLabelRotation, [
      this
    ]);
  }
  afterAutoSkip() {
  }
  beforeFit() {
    z(this.options.beforeFit, [
      this
    ]);
  }
  fit() {
    const t = {
      width: 0,
      height: 0
    }, { chart: e, options: { ticks: s, title: n, grid: o } } = this, a = this._isVisible(), r = this.isHorizontal();
    if (a) {
      const l = bs(n, e.options.font);
      if (r ? (t.width = this.maxWidth, t.height = Yt(o) + l) : (t.height = this.maxHeight, t.width = Yt(o) + l), s.display && this.ticks.length) {
        const { first: c, last: h, widest: d, highest: u } = this._getLabelSizes(), f = s.padding * 2, m = St(this.labelRotation), g = Math.cos(m), p = Math.sin(m);
        if (r) {
          const x = s.mirror ? 0 : p * d.width + g * u.height;
          t.height = Math.min(this.maxHeight, t.height + x + f);
        } else {
          const x = s.mirror ? 0 : g * d.width + p * u.height;
          t.width = Math.min(this.maxWidth, t.width + x + f);
        }
        this._calculatePadding(c, h, p, g);
      }
    }
    this._handleMargins(), r ? (this.width = this._length = e.width - this._margins.left - this._margins.right, this.height = t.height) : (this.width = t.width, this.height = this._length = e.height - this._margins.top - this._margins.bottom);
  }
  _calculatePadding(t, e, s, n) {
    const { ticks: { align: o, padding: a }, position: r } = this.options, l = this.labelRotation !== 0, c = r !== "top" && this.axis === "x";
    if (this.isHorizontal()) {
      const h = this.getPixelForTick(0) - this.left, d = this.right - this.getPixelForTick(this.ticks.length - 1);
      let u = 0, f = 0;
      l ? c ? (u = n * t.width, f = s * e.height) : (u = s * t.height, f = n * e.width) : o === "start" ? f = e.width : o === "end" ? u = t.width : o !== "inner" && (u = t.width / 2, f = e.width / 2), this.paddingLeft = Math.max((u - h + a) * this.width / (this.width - h), 0), this.paddingRight = Math.max((f - d + a) * this.width / (this.width - d), 0);
    } else {
      let h = e.height / 2, d = t.height / 2;
      o === "start" ? (h = 0, d = t.height) : o === "end" && (h = e.height, d = 0), this.paddingTop = h + a, this.paddingBottom = d + a;
    }
  }
  _handleMargins() {
    this._margins && (this._margins.left = Math.max(this.paddingLeft, this._margins.left), this._margins.top = Math.max(this.paddingTop, this._margins.top), this._margins.right = Math.max(this.paddingRight, this._margins.right), this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom));
  }
  afterFit() {
    z(this.options.afterFit, [
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
      F(t[e].label) && (t.splice(e, 1), s--, e--);
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
    const { ctx: n, _longestTextCache: o } = this, a = [], r = [], l = Math.floor(e / ps(e, s));
    let c = 0, h = 0, d, u, f, m, g, p, x, w, M, S, _;
    for (d = 0; d < e; d += l) {
      if (m = t[d].label, g = this._resolveTickFontOptions(d), n.font = p = g.string, x = o[p] = o[p] || {
        data: {},
        gc: []
      }, w = g.lineHeight, M = S = 0, !F(m) && !W(m))
        M = Gi(n, x.data, x.gc, M, m), S = w;
      else if (W(m))
        for (u = 0, f = m.length; u < f; ++u)
          _ = m[u], !F(_) && !W(_) && (M = Gi(n, x.data, x.gc, M, _), S += w);
      a.push(M), r.push(S), c = Math.max(M, c), h = Math.max(S, h);
    }
    Vr(o, e);
    const b = a.indexOf(c), k = r.indexOf(h), y = (D) => ({
      width: a[D] || 0,
      height: r[D] || 0
    });
    return {
      first: y(0),
      last: y(e - 1),
      widest: y(b),
      highest: y(k),
      widths: a,
      heights: r
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
    return Fo(this._alignToPixels ? vt(this.chart, e, 0) : e);
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
      return s.$context || (s.$context = $r(this.getContext(), t, s));
    }
    return this.$context || (this.$context = jr(this.chart.getContext(), this));
  }
  _tickSize() {
    const t = this.options.ticks, e = St(this.labelRotation), s = Math.abs(Math.cos(e)), n = Math.abs(Math.sin(e)), o = this._getLabelSizes(), a = t.autoSkipPadding || 0, r = o ? o.widest.width + a : 0, l = o ? o.highest.height + a : 0;
    return this.isHorizontal() ? l * s > r * n ? r / s : l / n : l * n < r * s ? l / s : r / n;
  }
  _isVisible() {
    const t = this.options.display;
    return t !== "auto" ? !!t : this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(t) {
    const e = this.axis, s = this.chart, n = this.options, { grid: o, position: a, border: r } = n, l = o.offset, c = this.isHorizontal(), d = this.ticks.length + (l ? 1 : 0), u = Yt(o), f = [], m = r.setContext(this.getContext()), g = m.display ? m.width : 0, p = g / 2, x = function(H) {
      return vt(s, H, g);
    };
    let w, M, S, _, b, k, y, D, O, C, T, N;
    if (a === "top")
      w = x(this.bottom), k = this.bottom - u, D = w - p, C = x(t.top) + p, N = t.bottom;
    else if (a === "bottom")
      w = x(this.top), C = t.top, N = x(t.bottom) - p, k = w + p, D = this.top + u;
    else if (a === "left")
      w = x(this.right), b = this.right - u, y = w - p, O = x(t.left) + p, T = t.right;
    else if (a === "right")
      w = x(this.left), O = t.left, T = x(t.right) - p, b = w + p, y = this.left + u;
    else if (e === "x") {
      if (a === "center")
        w = x((t.top + t.bottom) / 2 + 0.5);
      else if (L(a)) {
        const H = Object.keys(a)[0], K = a[H];
        w = x(this.chart.scales[H].getPixelForValue(K));
      }
      C = t.top, N = t.bottom, k = w + p, D = k + u;
    } else if (e === "y") {
      if (a === "center")
        w = x((t.left + t.right) / 2);
      else if (L(a)) {
        const H = Object.keys(a)[0], K = a[H];
        w = x(this.chart.scales[H].getPixelForValue(K));
      }
      b = w - p, y = b - u, O = t.left, T = t.right;
    }
    const G = A(n.ticks.maxTicksLimit, d), E = Math.max(1, Math.ceil(d / G));
    for (M = 0; M < d; M += E) {
      const H = this.getContext(M), K = o.setContext(H), de = r.setContext(H), ue = K.lineWidth, Tt = K.color, fe = de.dash || [], At = de.dashOffset, Nt = K.tickWidth, _t = K.tickColor, Wt = K.tickBorderDash || [], xt = K.tickBorderDashOffset;
      S = Wr(this, M, l), S !== void 0 && (_ = vt(s, S, ue), c ? b = y = O = T = _ : k = D = C = N = _, f.push({
        tx1: b,
        ty1: k,
        tx2: y,
        ty2: D,
        x1: O,
        y1: C,
        x2: T,
        y2: N,
        width: ue,
        color: Tt,
        borderDash: fe,
        borderDashOffset: At,
        tickWidth: Nt,
        tickColor: _t,
        tickBorderDash: Wt,
        tickBorderDashOffset: xt
      }));
    }
    return this._ticksLength = d, this._borderValue = w, f;
  }
  _computeLabelItems(t) {
    const e = this.axis, s = this.options, { position: n, ticks: o } = s, a = this.isHorizontal(), r = this.ticks, { align: l, crossAlign: c, padding: h, mirror: d } = o, u = Yt(s.grid), f = u + h, m = d ? -h : f, g = -St(this.labelRotation), p = [];
    let x, w, M, S, _, b, k, y, D, O, C, T, N = "middle";
    if (n === "top")
      b = this.bottom - m, k = this._getXAxisLabelAlignment();
    else if (n === "bottom")
      b = this.top + m, k = this._getXAxisLabelAlignment();
    else if (n === "left") {
      const E = this._getYAxisLabelAlignment(u);
      k = E.textAlign, _ = E.x;
    } else if (n === "right") {
      const E = this._getYAxisLabelAlignment(u);
      k = E.textAlign, _ = E.x;
    } else if (e === "x") {
      if (n === "center")
        b = (t.top + t.bottom) / 2 + f;
      else if (L(n)) {
        const E = Object.keys(n)[0], H = n[E];
        b = this.chart.scales[E].getPixelForValue(H) + f;
      }
      k = this._getXAxisLabelAlignment();
    } else if (e === "y") {
      if (n === "center")
        _ = (t.left + t.right) / 2 - f;
      else if (L(n)) {
        const E = Object.keys(n)[0], H = n[E];
        _ = this.chart.scales[E].getPixelForValue(H);
      }
      k = this._getYAxisLabelAlignment(u).textAlign;
    }
    e === "y" && (l === "start" ? N = "top" : l === "end" && (N = "bottom"));
    const G = this._getLabelSizes();
    for (x = 0, w = r.length; x < w; ++x) {
      M = r[x], S = M.label;
      const E = o.setContext(this.getContext(x));
      y = this.getPixelForTick(x) + o.labelOffset, D = this._resolveTickFontOptions(x), O = D.lineHeight, C = W(S) ? S.length : 1;
      const H = C / 2, K = E.color, de = E.textStrokeColor, ue = E.textStrokeWidth;
      let Tt = k;
      a ? (_ = y, k === "inner" && (x === w - 1 ? Tt = this.options.reverse ? "left" : "right" : x === 0 ? Tt = this.options.reverse ? "right" : "left" : Tt = "center"), n === "top" ? c === "near" || g !== 0 ? T = -C * O + O / 2 : c === "center" ? T = -G.highest.height / 2 - H * O + O : T = -G.highest.height + O / 2 : c === "near" || g !== 0 ? T = O / 2 : c === "center" ? T = G.highest.height / 2 - H * O : T = G.highest.height - C * O, d && (T *= -1), g !== 0 && !E.showLabelBackdrop && (_ += O / 2 * Math.sin(g))) : (b = y, T = (1 - C) * O / 2);
      let fe;
      if (E.showLabelBackdrop) {
        const At = et(E.backdropPadding), Nt = G.heights[x], _t = G.widths[x];
        let Wt = T - At.top, xt = 0 - At.left;
        switch (N) {
          case "middle":
            Wt -= Nt / 2;
            break;
          case "bottom":
            Wt -= Nt;
            break;
        }
        switch (k) {
          case "center":
            xt -= _t / 2;
            break;
          case "right":
            xt -= _t;
            break;
          case "inner":
            x === w - 1 ? xt -= _t : x > 0 && (xt -= _t / 2);
            break;
        }
        fe = {
          left: xt,
          top: Wt,
          width: _t + At.width,
          height: Nt + At.height,
          color: E.backdropColor
        };
      }
      p.push({
        label: S,
        font: D,
        textOffset: T,
        options: {
          rotation: g,
          color: K,
          strokeColor: de,
          strokeWidth: ue,
          textAlign: Tt,
          textBaseline: N,
          translation: [
            _,
            b
          ],
          backdrop: fe
        }
      });
    }
    return p;
  }
  _getXAxisLabelAlignment() {
    const { position: t, ticks: e } = this.options;
    if (-St(this.labelRotation))
      return t === "top" ? "left" : "right";
    let n = "center";
    return e.align === "start" ? n = "left" : e.align === "end" ? n = "right" : e.align === "inner" && (n = "inner"), n;
  }
  _getYAxisLabelAlignment(t) {
    const { position: e, ticks: { crossAlign: s, mirror: n, padding: o } } = this.options, a = this._getLabelSizes(), r = t + o, l = a.widest.width;
    let c, h;
    return e === "left" ? n ? (h = this.right + o, s === "near" ? c = "left" : s === "center" ? (c = "center", h += l / 2) : (c = "right", h += l)) : (h = this.right - r, s === "near" ? c = "right" : s === "center" ? (c = "center", h -= l / 2) : (c = "left", h = this.left)) : e === "right" ? n ? (h = this.left + o, s === "near" ? c = "right" : s === "center" ? (c = "center", h -= l / 2) : (c = "left", h -= l)) : (h = this.left + r, s === "near" ? c = "left" : s === "center" ? (c = "center", h += l / 2) : (c = "right", h = this.right)) : c = "right", {
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
    const { ctx: t, options: { backgroundColor: e }, left: s, top: n, width: o, height: a } = this;
    e && (t.save(), t.fillStyle = e, t.fillRect(s, n, o, a), t.restore());
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
    let o, a;
    const r = (l, c, h) => {
      !h.width || !h.color || (s.save(), s.lineWidth = h.width, s.strokeStyle = h.color, s.setLineDash(h.borderDash || []), s.lineDashOffset = h.borderDashOffset, s.beginPath(), s.moveTo(l.x, l.y), s.lineTo(c.x, c.y), s.stroke(), s.restore());
    };
    if (e.display)
      for (o = 0, a = n.length; o < a; ++o) {
        const l = n[o];
        e.drawOnChartArea && r({
          x: l.x1,
          y: l.y1
        }, {
          x: l.x2,
          y: l.y2
        }, l), e.drawTicks && r({
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
    const { chart: t, ctx: e, options: { border: s, grid: n } } = this, o = s.setContext(this.getContext()), a = s.display ? o.width : 0;
    if (!a)
      return;
    const r = n.setContext(this.getContext(0)).lineWidth, l = this._borderValue;
    let c, h, d, u;
    this.isHorizontal() ? (c = vt(t, this.left, a) - a / 2, h = vt(t, this.right, r) + r / 2, d = u = l) : (d = vt(t, this.top, a) - a / 2, u = vt(t, this.bottom, r) + r / 2, c = h = l), e.save(), e.lineWidth = o.width, e.strokeStyle = o.color, e.beginPath(), e.moveTo(c, d), e.lineTo(h, u), e.stroke(), e.restore();
  }
  drawLabels(t) {
    if (!this.options.ticks.display)
      return;
    const s = this.ctx, n = this._computeLabelArea();
    n && Mi(s, n);
    const o = this.getLabelItems(t);
    for (const a of o) {
      const r = a.options, l = a.font, c = a.label, h = a.textOffset;
      le(s, c, 0, h, l, r);
    }
    n && Si(s);
  }
  drawTitle() {
    const { ctx: t, options: { position: e, title: s, reverse: n } } = this;
    if (!s.display)
      return;
    const o = $(s.font), a = et(s.padding), r = s.align;
    let l = o.lineHeight / 2;
    e === "bottom" || e === "center" || L(e) ? (l += a.bottom, W(s.text) && (l += o.lineHeight * (s.text.length - 1))) : l += a.top;
    const { titleX: c, titleY: h, maxWidth: d, rotation: u } = Ur(this, l, e, r);
    le(t, s.text, 0, 0, o, {
      color: s.color,
      maxWidth: d,
      rotation: u,
      textAlign: Yr(r, e, n),
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
    const t = this.options, e = t.ticks && t.ticks.z || 0, s = A(t.grid && t.grid.z, -1), n = A(t.border && t.border.z, 0);
    return !this._isVisible() || this.draw !== Bt.prototype.draw ? [
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
    let o, a;
    for (o = 0, a = e.length; o < a; ++o) {
      const r = e[o];
      r[s] === this.id && (!t || r.type === t) && n.push(r);
    }
    return n;
  }
  _resolveTickFontOptions(t) {
    const e = this.options.ticks.setContext(this.getContext(t));
    return $(e.font);
  }
  _maxDigits() {
    const t = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / t;
  }
}
class Se {
  constructor(t, e, s) {
    this.type = t, this.scope = e, this.override = s, this.items = /* @__PURE__ */ Object.create(null);
  }
  isForType(t) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, t.prototype);
  }
  register(t) {
    const e = Object.getPrototypeOf(t);
    let s;
    Xr(e) && (s = this.register(e));
    const n = this.items, o = t.id, a = this.scope + "." + o;
    if (!o)
      throw new Error("class does not have id: " + t);
    return o in n || (n[o] = t, Gr(t, a, s), this.override && B.override(t.id, t.overrides)), a;
  }
  get(t) {
    return this.items[t];
  }
  unregister(t) {
    const e = this.items, s = t.id, n = this.scope;
    s in e && delete e[s], n && s in B[n] && (delete B[n][s], this.override && delete Ot[s]);
  }
}
function Gr(i, t, e) {
  const s = oe(/* @__PURE__ */ Object.create(null), [
    e ? B.get(e) : {},
    B.get(t),
    i.defaults
  ]);
  B.set(t, s), i.defaultRoutes && qr(t, i.defaultRoutes), i.descriptors && B.describe(t, i.descriptors);
}
function qr(i, t) {
  Object.keys(t).forEach((e) => {
    const s = e.split("."), n = s.pop(), o = [
      i
    ].concat(s).join("."), a = t[e].split("."), r = a.pop(), l = a.join(".");
    B.route(o, n, l, r);
  });
}
function Xr(i) {
  return "id" in i && "defaults" in i;
}
class Kr {
  constructor() {
    this.controllers = new Se(se, "datasets", !0), this.elements = new Se(ut, "elements"), this.plugins = new Se(Object, "plugins"), this.scales = new Se(Bt, "scales"), this._typedRegistries = [
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
      s || o.isForType(n) || o === this.plugins && n.id ? this._exec(t, o, n) : I(n, (a) => {
        const r = s || this._getRegistryForType(a);
        this._exec(t, r, a);
      });
    });
  }
  _exec(t, e, s) {
    const n = yi(t);
    z(s["before" + n], [], s), e[t](s), z(s["after" + n], [], s);
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
var ot = /* @__PURE__ */ new Kr();
class Qr {
  constructor() {
    this._init = [];
  }
  notify(t, e, s, n) {
    e === "beforeInit" && (this._init = this._createDescriptors(t, !0), this._notify(this._init, t, "install"));
    const o = n ? this._descriptors(t).filter(n) : this._descriptors(t), a = this._notify(o, t, e, s);
    return e === "afterDestroy" && (this._notify(o, t, "stop"), this._notify(this._init, t, "uninstall")), a;
  }
  _notify(t, e, s, n) {
    n = n || {};
    for (const o of t) {
      const a = o.plugin, r = a[s], l = [
        e,
        n,
        o.options
      ];
      if (z(r, l, a) === !1 && n.cancelable)
        return !1;
    }
    return !0;
  }
  invalidate() {
    F(this._cache) || (this._oldCache = this._cache, this._cache = void 0);
  }
  _descriptors(t) {
    if (this._cache)
      return this._cache;
    const e = this._cache = this._createDescriptors(t);
    return this._notifyStateChanges(t), e;
  }
  _createDescriptors(t, e) {
    const s = t && t.config, n = A(s.options && s.options.plugins, {}), o = Zr(s);
    return n === !1 && !e ? [] : tl(t, o, n, e);
  }
  _notifyStateChanges(t) {
    const e = this._oldCache || [], s = this._cache, n = (o, a) => o.filter((r) => !a.some((l) => r.plugin.id === l.plugin.id));
    this._notify(n(e, s), t, "stop"), this._notify(n(s, e), t, "start");
  }
}
function Zr(i) {
  const t = {}, e = [], s = Object.keys(ot.plugins.items);
  for (let o = 0; o < s.length; o++)
    e.push(ot.getPlugin(s[o]));
  const n = i.plugins || [];
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    e.indexOf(a) === -1 && (e.push(a), t[a.id] = !0);
  }
  return {
    plugins: e,
    localIds: t
  };
}
function Jr(i, t) {
  return !t && i === !1 ? null : i === !0 ? {} : i;
}
function tl(i, { plugins: t, localIds: e }, s, n) {
  const o = [], a = i.getContext();
  for (const r of t) {
    const l = r.id, c = Jr(s[l], n);
    c !== null && o.push({
      plugin: r,
      options: el(i.config, {
        plugin: r,
        local: e[l]
      }, c, a)
    });
  }
  return o;
}
function el(i, { plugin: t, local: e }, s, n) {
  const o = i.pluginScopeKeys(t), a = i.getOptionScopes(s, o);
  return e && t.defaults && a.push(t.defaults), i.createResolver(a, n, [
    ""
  ], {
    scriptable: !1,
    indexable: !1,
    allKeys: !0
  });
}
function hi(i, t) {
  const e = B.datasets[i] || {};
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
function al(i, t) {
  const e = Ot[i.type] || {
    scales: {}
  }, s = t.scales || {}, n = hi(i.type, t), o = /* @__PURE__ */ Object.create(null);
  return Object.keys(s).forEach((a) => {
    const r = s[a];
    if (!L(r))
      return console.error(`Invalid scale configuration for scale: ${a}`);
    if (r._proxy)
      return console.warn(`Ignoring resolver passed as options for scale: ${a}`);
    const l = di(a, r, ol(a, i), B.scales[r.type]), c = sl(l, n), h = e.scales || {};
    o[a] = Zt(/* @__PURE__ */ Object.create(null), [
      {
        axis: l
      },
      r,
      h[l],
      h[c]
    ]);
  }), i.data.datasets.forEach((a) => {
    const r = a.type || i.type, l = a.indexAxis || hi(r, t), h = (Ot[r] || {}).scales || {};
    Object.keys(h).forEach((d) => {
      const u = il(d, l), f = a[u + "AxisID"] || u;
      o[f] = o[f] || /* @__PURE__ */ Object.create(null), Zt(o[f], [
        {
          axis: u
        },
        s[f],
        h[d]
      ]);
    });
  }), Object.keys(o).forEach((a) => {
    const r = o[a];
    Zt(r, [
      B.scales[r.type],
      B.scale
    ]);
  }), o;
}
function vn(i) {
  const t = i.options || (i.options = {});
  t.plugins = A(t.plugins, {}), t.scales = al(i, t);
}
function wn(i) {
  return i = i || {}, i.datasets = i.datasets || [], i.labels = i.labels || [], i;
}
function rl(i) {
  return i = i || {}, i.data = wn(i.data), vn(i), i;
}
const ys = /* @__PURE__ */ new Map(), kn = /* @__PURE__ */ new Set();
function De(i, t) {
  let e = ys.get(i);
  return e || (e = t(), ys.set(i, e), kn.add(e)), e;
}
const Ut = (i, t, e) => {
  const s = Re(t, e);
  s !== void 0 && i.add(s);
};
class ll {
  constructor(t) {
    this._config = rl(t), this._scopeCache = /* @__PURE__ */ new Map(), this._resolverCache = /* @__PURE__ */ new Map();
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
    this._config.data = wn(t);
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
    this.clearCache(), vn(t);
  }
  clearCache() {
    this._scopeCache.clear(), this._resolverCache.clear();
  }
  datasetScopeKeys(t) {
    return De(t, () => [
      [
        `datasets.${t}`,
        ""
      ]
    ]);
  }
  datasetAnimationScopeKeys(t, e) {
    return De(`${t}.transition.${e}`, () => [
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
    return De(`${t}-${e}`, () => [
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
    return De(`${s}-plugin-${e}`, () => [
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
    const { options: n, type: o } = this, a = this._cachedScopes(t, s), r = a.get(e);
    if (r)
      return r;
    const l = /* @__PURE__ */ new Set();
    e.forEach((h) => {
      t && (l.add(t), h.forEach((d) => Ut(l, t, d))), h.forEach((d) => Ut(l, n, d)), h.forEach((d) => Ut(l, Ot[o] || {}, d)), h.forEach((d) => Ut(l, B, d)), h.forEach((d) => Ut(l, ri, d));
    });
    const c = Array.from(l);
    return c.length === 0 && c.push(/* @__PURE__ */ Object.create(null)), kn.has(e) && a.set(e, c), c;
  }
  chartOptionScopes() {
    const { options: t, type: e } = this;
    return [
      t,
      Ot[e] || {},
      B.datasets[e] || {},
      {
        type: e
      },
      B,
      ri
    ];
  }
  resolveNamedOptions(t, e, s, n = [
    ""
  ]) {
    const o = {
      $shared: !0
    }, { resolver: a, subPrefixes: r } = vs(this._resolverCache, t, n);
    let l = a;
    if (hl(a, e)) {
      o.$shared = !1, s = bt(s) ? s() : s;
      const c = this.createResolver(t, s, r);
      l = Et(a, s, c);
    }
    for (const c of e)
      o[c] = l[c];
    return o;
  }
  createResolver(t, e, s = [
    ""
  ], n) {
    const { resolver: o } = vs(this._resolverCache, t, s);
    return L(e) ? Et(o, e, void 0, n) : o;
  }
}
function vs(i, t, e) {
  let s = i.get(t);
  s || (s = /* @__PURE__ */ new Map(), i.set(t, s));
  const n = e.join();
  let o = s.get(n);
  return o || (o = {
    resolver: Di(t, e),
    subPrefixes: e.filter((r) => !r.toLowerCase().includes("hover"))
  }, s.set(n, o)), o;
}
const cl = (i) => L(i) && Object.getOwnPropertyNames(i).some((t) => bt(i[t]));
function hl(i, t) {
  const { isScriptable: e, isIndexable: s } = an(i);
  for (const n of t) {
    const o = e(n), a = s(n), r = (a || o) && i[n];
    if (o && (bt(r) || cl(r)) || a && W(r))
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
function Ms(i) {
  const t = i.chart, e = t.options.animation;
  t.notifyPlugins("afterRender"), z(e && e.onComplete, [
    i
  ], t);
}
function fl(i) {
  const t = i.chart, e = t.options.animation;
  z(e && e.onProgress, [
    i
  ], t);
}
function Mn(i) {
  return Pi() && typeof i == "string" ? i = document.getElementById(i) : i && i.length && (i = i[0]), i && i.canvas && (i = i.canvas), i;
}
const Ae = {}, Ss = (i) => {
  const t = Mn(i);
  return Object.values(Ae).filter((e) => e.canvas === t).pop();
};
function gl(i, t, e) {
  const s = Object.keys(i);
  for (const n of s) {
    const o = +n;
    if (o >= t) {
      const a = i[n];
      delete i[n], (e > 0 || o > t) && (i[o + e] = a);
    }
  }
}
function pl(i, t, e, s) {
  return !e || i.type === "mouseout" ? null : s ? t : i;
}
var ft;
let je = (ft = class {
  static register(...t) {
    ot.add(...t), Ds();
  }
  static unregister(...t) {
    ot.remove(...t), Ds();
  }
  constructor(t, e) {
    const s = this.config = new ll(e), n = Mn(t), o = Ss(n);
    if (o)
      throw new Error("Canvas is already in use. Chart with ID '" + o.id + "' must be destroyed before the canvas with ID '" + o.canvas.id + "' can be reused.");
    const a = s.createResolver(s.chartOptionScopes(), this.getContext());
    this.platform = new (s.platform || Ir(n))(), this.platform.updateConfig(s);
    const r = this.platform.acquireContext(n, a.aspectRatio), l = r && r.canvas, c = l && l.height, h = l && l.width;
    if (this.id = _o(), this.ctx = r, this.canvas = l, this.width = h, this.height = c, this._options = a, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new Qr(), this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = Bo((d) => this.update(d), a.resizeDelay || 0), this._dataChanges = [], Ae[this.id] = this, !r || !l) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    ct.listen(this, "complete", Ms), ct.listen(this, "progress", fl), this._initialize(), this.attached && this.update();
  }
  get aspectRatio() {
    const { options: { aspectRatio: t, maintainAspectRatio: e }, width: s, height: n, _aspectRatio: o } = this;
    return F(t) ? e && o ? o : n ? s / n : null : t;
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
    return ot;
  }
  _initialize() {
    return this.notifyPlugins("beforeInit"), this.options.responsive ? this.resize() : Qi(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins("afterInit"), this;
  }
  clear() {
    return qi(this.canvas, this.ctx), this;
  }
  stop() {
    return ct.stop(this), this;
  }
  resize(t, e) {
    ct.running(this) ? this._resizeBeforeDraw = {
      width: t,
      height: e
    } : this._resize(t, e);
  }
  _resize(t, e) {
    const s = this.options, n = this.canvas, o = s.maintainAspectRatio && this.aspectRatio, a = this.platform.getMaximumSize(n, t, e, o), r = s.devicePixelRatio || this.platform.getDevicePixelRatio(), l = this.width ? "resize" : "attach";
    this.width = a.width, this.height = a.height, this._aspectRatio = this.aspectRatio, Qi(this, r, !0) && (this.notifyPlugins("resize", {
      size: a
    }), z(s.onResize, [
      this,
      a
    ], this), this.attached && this._doResize(l) && this.render());
  }
  ensureScalesHaveIDs() {
    const e = this.options.scales || {};
    I(e, (s, n) => {
      s.id = n;
    });
  }
  buildOrUpdateScales() {
    const t = this.options, e = t.scales, s = this.scales, n = Object.keys(s).reduce((a, r) => (a[r] = !1, a), {});
    let o = [];
    e && (o = o.concat(Object.keys(e).map((a) => {
      const r = e[a], l = di(a, r), c = l === "r", h = l === "x";
      return {
        options: r,
        dposition: c ? "chartArea" : h ? "bottom" : "left",
        dtype: c ? "radialLinear" : h ? "category" : "linear"
      };
    }))), I(o, (a) => {
      const r = a.options, l = r.id, c = di(l, r), h = A(r.type, a.dtype);
      (r.position === void 0 || ws(r.position, c) !== ws(a.dposition)) && (r.position = a.dposition), n[l] = !0;
      let d = null;
      if (l in s && s[l].type === h)
        d = s[l];
      else {
        const u = ot.getScale(h);
        d = new u({
          id: l,
          type: h,
          ctx: this.ctx,
          chart: this
        }), s[d.id] = d;
      }
      d.init(r, t);
    }), I(n, (a, r) => {
      a || delete s[r];
    }), I(s, (a) => {
      J.configure(this, a, a.options), J.addBox(this, a);
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
      let a = this.getDatasetMeta(s);
      const r = o.type || this.config.type;
      if (a.type && a.type !== r && (this._destroyDatasetMeta(s), a = this.getDatasetMeta(s)), a.type = r, a.indexAxis = o.indexAxis || hi(r, this.options), a.order = o.order || 0, a.index = s, a.label = "" + o.label, a.visible = this.isDatasetVisible(s), a.controller)
        a.controller.updateIndex(s), a.controller.linkScales();
      else {
        const l = ot.getController(r), { datasetElementType: c, dataElementType: h } = B.datasets[r];
        Object.assign(l, {
          dataElementType: ot.getElement(h),
          datasetElementType: c && ot.getElement(c)
        }), a.controller = new l(this, s), t.push(a.controller);
      }
    }
    return this._updateMetasets(), t;
  }
  _resetElements() {
    I(this.data.datasets, (t, e) => {
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
    let a = 0;
    for (let c = 0, h = this.data.datasets.length; c < h; c++) {
      const { controller: d } = this.getDatasetMeta(c), u = !n && o.indexOf(d) === -1;
      d.buildOrUpdateElements(u), a = Math.max(+d.getMaxOverflow(), a);
    }
    a = this._minPadding = s.layout.autoPadding ? a : 0, this._updateLayout(a), n || I(o, (c) => {
      c.reset();
    }), this._updateDatasets(t), this.notifyPlugins("afterUpdate", {
      mode: t
    }), this._layers.sort(ks("z", "_idx"));
    const { _active: r, _lastEvent: l } = this;
    l ? this._eventHandler(l, !0) : r.length && this._updateHoverStyles(r, r, !0), this.render();
  }
  _updateScales() {
    I(this.scales, (t) => {
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
      const a = s === "_removeElements" ? -o : o;
      gl(t, n, a);
    }
  }
  _getUniformDataChanges() {
    const t = this._dataChanges;
    if (!t || !t.length)
      return;
    this._dataChanges = [];
    const e = this.data.datasets.length, s = (o) => new Set(t.filter((a) => a[0] === o).map((a, r) => r + "," + a.splice(1).join(","))), n = s(0);
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
    this._layers = [], I(this.boxes, (n) => {
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
        this._updateDataset(e, bt(t) ? t({
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
    }) !== !1 && (ct.has(this) ? this.attached && !ct.running(this) && ct.start(this) : (this.draw(), Ms({
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
      const a = e[n];
      (!t || a.visible) && s.push(a);
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
    }, n = Ua(this, t);
    this.notifyPlugins("beforeDatasetDraw", s) !== !1 && (n && Mi(e, n), t.controller.draw(), n && Si(e), s.cancelable = !1, this.notifyPlugins("afterDatasetDraw", s));
  }
  isPointInArea(t) {
    return re(t, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(t, e, s, n) {
    const o = ur.modes[e];
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
    return this.$context || (this.$context = Pt(null, {
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
    const n = s ? "show" : "hide", o = this.getDatasetMeta(t), a = o.controller._resolveAnimations(void 0, n);
    ze(e) ? (o.data[e].hidden = !s, this.update()) : (this.setDatasetVisibility(t, s), a.update(o, {
      visible: s
    }), this.update((r) => r.datasetIndex === t ? n : void 0));
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
    for (this.stop(), ct.remove(this), t = 0, e = this.data.datasets.length; t < e; ++t)
      this._destroyDatasetMeta(t);
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    const { canvas: t, ctx: e } = this;
    this._stop(), this.config.clearCache(), t && (this.unbindEvents(), qi(t, e), this.platform.releaseContext(e), this.canvas = null, this.ctx = null), delete Ae[this.id], this.notifyPlugins("afterDestroy");
  }
  toBase64Image(...t) {
    return this.canvas.toDataURL(...t);
  }
  bindEvents() {
    this.bindUserEvents(), this.options.responsive ? this.bindResponsiveEvents() : this.attached = !0;
  }
  bindUserEvents() {
    const t = this._listeners, e = this.platform, s = (o, a) => {
      e.addEventListener(this, o, a), t[o] = a;
    }, n = (o, a, r) => {
      o.offsetX = a, o.offsetY = r, this._eventHandler(o);
    };
    I(this.options.events, (o) => s(o, n));
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
    let a;
    const r = () => {
      n("attach", r), this.attached = !0, this.resize(), s("resize", o), s("detach", a);
    };
    a = () => {
      this.attached = !1, n("resize", o), this._stop(), this._resize(0, 0), s("attach", r);
    }, e.isAttached(this.canvas) ? r() : a();
  }
  unbindEvents() {
    I(this._listeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }), this._listeners = {}, I(this._responsiveListeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }), this._responsiveListeners = void 0;
  }
  updateHoverStyle(t, e, s) {
    const n = s ? "set" : "remove";
    let o, a, r, l;
    for (e === "dataset" && (o = this.getDatasetMeta(t[0].datasetIndex), o.controller["_" + n + "DatasetHoverStyle"]()), r = 0, l = t.length; r < l; ++r) {
      a = t[r];
      const c = a && this.getDatasetMeta(a.datasetIndex).controller;
      c && c[n + "HoverStyle"](a.element, a.datasetIndex, a.index);
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t) {
    const e = this._active || [], s = t.map(({ datasetIndex: o, index: a }) => {
      const r = this.getDatasetMeta(o);
      if (!r)
        throw new Error("No dataset found at index " + o);
      return {
        datasetIndex: o,
        element: r.data[a],
        index: a
      };
    });
    !Ie(s, e) && (this._active = s, this._lastEvent = null, this._updateHoverStyles(s, e));
  }
  notifyPlugins(t, e, s) {
    return this._plugins.notify(this, t, e, s);
  }
  isPluginEnabled(t) {
    return this._plugins._cache.filter((e) => e.plugin.id === t).length === 1;
  }
  _updateHoverStyles(t, e, s) {
    const n = this.options.hover, o = (l, c) => l.filter((h) => !c.some((d) => h.datasetIndex === d.datasetIndex && h.index === d.index)), a = o(e, t), r = s ? t : o(t, e);
    a.length && this.updateHoverStyle(a, n.mode, !1), r.length && n.mode && this.updateHoverStyle(r, n.mode, !0);
  }
  _eventHandler(t, e) {
    const s = {
      event: t,
      replay: e,
      cancelable: !0,
      inChartArea: this.isPointInArea(t)
    }, n = (a) => (a.options.events || this.options.events).includes(t.native.type);
    if (this.notifyPlugins("beforeEvent", s, n) === !1)
      return;
    const o = this._handleEvent(t, e, s.inChartArea);
    return s.cancelable = !1, this.notifyPlugins("afterEvent", s, n), (o || s.changed) && this.render(), this;
  }
  _handleEvent(t, e, s) {
    const { _active: n = [], options: o } = this, a = e, r = this._getActiveElements(t, n, s, a), l = Mo(t), c = pl(t, this._lastEvent, s, l);
    s && (this._lastEvent = null, z(o.onHover, [
      t,
      r,
      this
    ], this), l && z(o.onClick, [
      t,
      r,
      this
    ], this));
    const h = !Ie(r, n);
    return (h || e) && (this._active = r, this._updateHoverStyles(r, n, e)), this._lastEvent = c, h;
  }
  _getActiveElements(t, e, s, n) {
    if (t.type === "mouseout")
      return [];
    if (!s)
      return e;
    const o = this.options.hover;
    return this.getElementsAtEventForMode(t, o.mode, o, n);
  }
}, P(ft, "defaults", B), P(ft, "instances", Ae), P(ft, "overrides", Ot), P(ft, "registry", ot), P(ft, "version", dl), P(ft, "getChart", Ss), ft);
function Ds() {
  return I(je.instances, (i) => i._plugins.invalidate());
}
function Sn(i, t, e = t) {
  i.lineCap = A(e.borderCapStyle, t.borderCapStyle), i.setLineDash(A(e.borderDash, t.borderDash)), i.lineDashOffset = A(e.borderDashOffset, t.borderDashOffset), i.lineJoin = A(e.borderJoinStyle, t.borderJoinStyle), i.lineWidth = A(e.borderWidth, t.borderWidth), i.strokeStyle = A(e.borderColor, t.borderColor);
}
function ml(i, t, e) {
  i.lineTo(e.x, e.y);
}
function bl(i) {
  return i.stepped ? Jo : i.tension || i.cubicInterpolationMode === "monotone" ? ta : ml;
}
function Dn(i, t, e = {}) {
  const s = i.length, { start: n = 0, end: o = s - 1 } = e, { start: a, end: r } = t, l = Math.max(n, a), c = Math.min(o, r), h = n < a && o < a || n > r && o > r;
  return {
    count: s,
    start: l,
    loop: t.loop,
    ilen: c < l && !h ? s + c - l : c - l
  };
}
function _l(i, t, e, s) {
  const { points: n, options: o } = t, { count: a, start: r, loop: l, ilen: c } = Dn(n, e, s), h = bl(o);
  let { move: d = !0, reverse: u } = s || {}, f, m, g;
  for (f = 0; f <= c; ++f)
    m = n[(r + (u ? c - f : f)) % a], !m.skip && (d ? (i.moveTo(m.x, m.y), d = !1) : h(i, g, m, u, o.stepped), g = m);
  return l && (m = n[(r + (u ? c : 0)) % a], h(i, g, m, u, o.stepped)), !!l;
}
function xl(i, t, e, s) {
  const n = t.points, { count: o, start: a, ilen: r } = Dn(n, e, s), { move: l = !0, reverse: c } = s || {};
  let h = 0, d = 0, u, f, m, g, p, x;
  const w = (S) => (a + (c ? r - S : S)) % o, M = () => {
    g !== p && (i.lineTo(h, p), i.lineTo(h, g), i.lineTo(h, x));
  };
  for (l && (f = n[w(0)], i.moveTo(f.x, f.y)), u = 0; u <= r; ++u) {
    if (f = n[w(u)], f.skip)
      continue;
    const S = f.x, _ = f.y, b = S | 0;
    b === m ? (_ < g ? g = _ : _ > p && (p = _), h = (d * h + S) / ++d) : (M(), i.lineTo(S, _), m = b, d = 0, g = p = _), x = _;
  }
  M();
}
function ui(i) {
  const t = i.options, e = t.borderDash && t.borderDash.length;
  return !i._decimated && !i._loop && !t.tension && t.cubicInterpolationMode !== "monotone" && !t.stepped && !e ? xl : _l;
}
function yl(i) {
  return i.stepped ? Ia : i.tension || i.cubicInterpolationMode === "monotone" ? Fa : Mt;
}
function vl(i, t, e, s) {
  let n = t._path;
  n || (n = t._path = new Path2D(), t.path(n, e, s) && n.closePath()), Sn(i, t.options), i.stroke(n);
}
function wl(i, t, e, s) {
  const { segments: n, options: o } = t, a = ui(t);
  for (const r of n)
    Sn(i, o, r.style), i.beginPath(), a(i, t, r, {
      start: e,
      end: e + s - 1
    }) && i.closePath(), i.stroke();
}
const kl = typeof Path2D == "function";
function Ml(i, t, e, s) {
  kl && !t.options.segment ? vl(i, t, e, s) : wl(i, t, e, s);
}
class Kt extends ut {
  constructor(t) {
    super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, t && Object.assign(this, t);
  }
  updateControlPoints(t, e) {
    const s = this.options;
    if ((s.tension || s.cubicInterpolationMode === "monotone") && !s.stepped && !this._pointsUpdated) {
      const n = s.spanGaps ? this._loop : this._fullLoop;
      Sa(this._points, s, t, n, e), this._pointsUpdated = !0;
    }
  }
  set points(t) {
    this._points = t, delete this._segments, delete this._path, this._pointsUpdated = !1;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = Va(this, this.options.segment));
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
    const s = this.options, n = t[e], o = this.points, a = Ba(this, {
      property: e,
      start: n,
      end: n
    });
    if (!a.length)
      return;
    const r = [], l = yl(s);
    let c, h;
    for (c = 0, h = a.length; c < h; ++c) {
      const { start: d, end: u } = a[c], f = o[d], m = o[u];
      if (f === m) {
        r.push(f);
        continue;
      }
      const g = Math.abs((n - f[e]) / (m[e] - f[e])), p = l(f, m, g, s.stepped);
      p[e] = t[e], r.push(p);
    }
    return r.length === 1 ? r[0] : r;
  }
  pathSegment(t, e, s) {
    return ui(this)(t, this, e, s);
  }
  path(t, e, s) {
    const n = this.segments, o = ui(this);
    let a = this._loop;
    e = e || 0, s = s || this.points.length - e;
    for (const r of n)
      a &= o(t, this, r, {
        start: e,
        end: e + s - 1
      });
    return !!a;
  }
  draw(t, e, s, n) {
    const o = this.options || {};
    (this.points || []).length && o.borderWidth && (t.save(), Ml(t, this, s, n), t.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0);
  }
}
P(Kt, "id", "line"), P(Kt, "defaults", {
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
}), P(Kt, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
}), P(Kt, "descriptors", {
  _scriptable: !0,
  _indexable: (t) => t !== "borderDash" && t !== "fill"
});
function Cs(i, t, e, s) {
  const n = i.options, { [e]: o } = i.getProps([
    e
  ], s);
  return Math.abs(t - o) < n.radius + n.hitRadius;
}
class Le extends ut {
  constructor(e) {
    super();
    P(this, "parsed");
    P(this, "skip");
    P(this, "stop");
    this.options = void 0, this.parsed = void 0, this.skip = void 0, this.stop = void 0, e && Object.assign(this, e);
  }
  inRange(e, s, n) {
    const o = this.options, { x: a, y: r } = this.getProps([
      "x",
      "y"
    ], n);
    return Math.pow(e - a, 2) + Math.pow(s - r, 2) < Math.pow(o.hitRadius + o.radius, 2);
  }
  inXRange(e, s) {
    return Cs(this, e, "x", s);
  }
  inYRange(e, s) {
    return Cs(this, e, "y", s);
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
    this.skip || n.radius < 0.1 || !re(this, s, this.size(n) / 2) || (e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.fillStyle = n.backgroundColor, li(e, n, this.x, this.y));
  }
  getRange() {
    const e = this.options || {};
    return e.radius + e.hitRadius;
  }
}
P(Le, "id", "point"), /**
* @type {any}
*/
P(Le, "defaults", {
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
P(Le, "defaultRoutes", {
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
}, Sl = (i, t) => i !== null && t !== null && i.datasetIndex === t.datasetIndex && i.index === t.index;
class Ps extends ut {
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
    let e = z(t.generateLabels, [
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
    const s = t.labels, n = $(s.font), o = n.size, a = this._computeTitleHeight(), { boxWidth: r, itemHeight: l } = Os(s, o);
    let c, h;
    e.font = n.string, this.isHorizontal() ? (c = this.maxWidth, h = this._fitRows(a, o, r, l) + 10) : (h = this.maxHeight, c = this._fitCols(a, n, r, l) + 10), this.width = Math.min(c, t.maxWidth || this.maxWidth), this.height = Math.min(h, t.maxHeight || this.maxHeight);
  }
  _fitRows(t, e, s, n) {
    const { ctx: o, maxWidth: a, options: { labels: { padding: r } } } = this, l = this.legendHitBoxes = [], c = this.lineWidths = [
      0
    ], h = n + r;
    let d = t;
    o.textAlign = "left", o.textBaseline = "middle";
    let u = -1, f = -h;
    return this.legendItems.forEach((m, g) => {
      const p = s + e / 2 + o.measureText(m.text).width;
      (g === 0 || c[c.length - 1] + p + 2 * r > a) && (d += h, c[c.length - (g > 0 ? 0 : 1)] = 0, f += h, u++), l[g] = {
        left: 0,
        top: f,
        row: u,
        width: p,
        height: n
      }, c[c.length - 1] += p + r;
    }), d;
  }
  _fitCols(t, e, s, n) {
    const { ctx: o, maxHeight: a, options: { labels: { padding: r } } } = this, l = this.legendHitBoxes = [], c = this.columnSizes = [], h = a - t;
    let d = r, u = 0, f = 0, m = 0, g = 0;
    return this.legendItems.forEach((p, x) => {
      const { itemWidth: w, itemHeight: M } = Dl(s, e, o, p, n);
      x > 0 && f + M + 2 * r > h && (d += u + r, c.push({
        width: u,
        height: f
      }), m += u + r, g++, u = f = 0), l[x] = {
        left: m,
        top: f,
        col: g,
        width: w,
        height: M
      }, u = Math.max(u, w), f += M + r;
    }), d += u, c.push({
      width: u,
      height: f
    }), d;
  }
  adjustHitBoxes() {
    if (!this.options.display)
      return;
    const t = this._computeTitleHeight(), { legendHitBoxes: e, options: { align: s, labels: { padding: n }, rtl: o } } = this, a = Rt(o, this.left, this.width);
    if (this.isHorizontal()) {
      let r = 0, l = j(s, this.left + n, this.right - this.lineWidths[r]);
      for (const c of e)
        r !== c.row && (r = c.row, l = j(s, this.left + n, this.right - this.lineWidths[r])), c.top += this.top + t + n, c.left = a.leftForLtr(a.x(l), c.width), l += c.width + n;
    } else {
      let r = 0, l = j(s, this.top + t + n, this.bottom - this.columnSizes[r].height);
      for (const c of e)
        c.col !== r && (r = c.col, l = j(s, this.top + t + n, this.bottom - this.columnSizes[r].height)), c.top = l, c.left += this.left + n, c.left = a.leftForLtr(a.x(c.left), c.width), l += c.height + n;
    }
  }
  isHorizontal() {
    return this.options.position === "top" || this.options.position === "bottom";
  }
  draw() {
    if (this.options.display) {
      const t = this.ctx;
      Mi(t, this), this._draw(), Si(t);
    }
  }
  _draw() {
    const { options: t, columnSizes: e, lineWidths: s, ctx: n } = this, { align: o, labels: a } = t, r = B.color, l = Rt(t.rtl, this.left, this.width), c = $(a.font), { padding: h } = a, d = c.size, u = d / 2;
    let f;
    this.drawTitle(), n.textAlign = l.textAlign("left"), n.textBaseline = "middle", n.lineWidth = 0.5, n.font = c.string;
    const { boxWidth: m, boxHeight: g, itemHeight: p } = Os(a, d), x = function(b, k, y) {
      if (isNaN(m) || m <= 0 || isNaN(g) || g < 0)
        return;
      n.save();
      const D = A(y.lineWidth, 1);
      if (n.fillStyle = A(y.fillStyle, r), n.lineCap = A(y.lineCap, "butt"), n.lineDashOffset = A(y.lineDashOffset, 0), n.lineJoin = A(y.lineJoin, "miter"), n.lineWidth = D, n.strokeStyle = A(y.strokeStyle, r), n.setLineDash(A(y.lineDash, [])), a.usePointStyle) {
        const O = {
          radius: g * Math.SQRT2 / 2,
          pointStyle: y.pointStyle,
          rotation: y.rotation,
          borderWidth: D
        }, C = l.xPlus(b, m / 2), T = k + u;
        nn(n, O, C, T, a.pointStyleWidth && m);
      } else {
        const O = k + Math.max((d - g) / 2, 0), C = l.leftForLtr(b, m), T = ie(y.borderRadius);
        n.beginPath(), Object.values(T).some((N) => N !== 0) ? ci(n, {
          x: C,
          y: O,
          w: m,
          h: g,
          radius: T
        }) : n.rect(C, O, m, g), n.fill(), D !== 0 && n.stroke();
      }
      n.restore();
    }, w = function(b, k, y) {
      le(n, y.text, b, k + p / 2, c, {
        strikethrough: y.hidden,
        textAlign: l.textAlign(y.textAlign)
      });
    }, M = this.isHorizontal(), S = this._computeTitleHeight();
    M ? f = {
      x: j(o, this.left + h, this.right - s[0]),
      y: this.top + h + S,
      line: 0
    } : f = {
      x: this.left + h,
      y: j(o, this.top + S + h, this.bottom - e[0].height),
      line: 0
    }, dn(this.ctx, t.textDirection);
    const _ = p + h;
    this.legendItems.forEach((b, k) => {
      n.strokeStyle = b.fontColor, n.fillStyle = b.fontColor;
      const y = n.measureText(b.text).width, D = l.textAlign(b.textAlign || (b.textAlign = a.textAlign)), O = m + u + y;
      let C = f.x, T = f.y;
      l.setWidth(this.width), M ? k > 0 && C + O + h > this.right && (T = f.y += _, f.line++, C = f.x = j(o, this.left + h, this.right - s[f.line])) : k > 0 && T + _ > this.bottom && (C = f.x = C + e[f.line].width + h, f.line++, T = f.y = j(o, this.top + S + h, this.bottom - e[f.line].height));
      const N = l.x(C);
      if (x(N, T, b), C = No(D, C + m + u, M ? C + O : this.right, t.rtl), w(l.x(C), T, b), M)
        f.x += O + h;
      else if (typeof b.text != "string") {
        const G = c.lineHeight;
        f.y += Cn(b, G) + h;
      } else
        f.y += _;
    }), un(this.ctx, t.textDirection);
  }
  drawTitle() {
    const t = this.options, e = t.title, s = $(e.font), n = et(e.padding);
    if (!e.display)
      return;
    const o = Rt(t.rtl, this.left, this.width), a = this.ctx, r = e.position, l = s.size / 2, c = n.top + l;
    let h, d = this.left, u = this.width;
    if (this.isHorizontal())
      u = Math.max(...this.lineWidths), h = this.top + c, d = j(t.align, d, this.right - u);
    else {
      const m = this.columnSizes.reduce((g, p) => Math.max(g, p.height), 0);
      h = c + j(t.align, this.top, this.bottom - m - t.labels.padding - this._computeTitleHeight());
    }
    const f = j(r, d, d + u);
    a.textAlign = o.textAlign(wi(r)), a.textBaseline = "middle", a.strokeStyle = e.color, a.fillStyle = e.color, a.font = s.string, le(a, e.text, f, h, s);
  }
  _computeTitleHeight() {
    const t = this.options.title, e = $(t.font), s = et(t.padding);
    return t.display ? e.lineHeight + s.height : 0;
  }
  _getLegendItemAt(t, e) {
    let s, n, o;
    if (qt(t, this.left, this.right) && qt(e, this.top, this.bottom)) {
      for (o = this.legendHitBoxes, s = 0; s < o.length; ++s)
        if (n = o[s], qt(t, n.left, n.left + n.width) && qt(e, n.top, n.top + n.height))
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
      const n = this._hoveredItem, o = Sl(n, s);
      n && !o && z(e.onLeave, [
        t,
        n,
        this
      ], this), this._hoveredItem = s, s && !o && z(e.onHover, [
        t,
        s,
        this
      ], this);
    } else s && z(e.onClick, [
      t,
      s,
      this
    ], this);
  }
}
function Dl(i, t, e, s, n) {
  const o = Cl(s, i, t, e), a = Ol(n, s, t.lineHeight);
  return {
    itemWidth: o,
    itemHeight: a
  };
}
function Cl(i, t, e, s) {
  let n = i.text;
  return n && typeof n != "string" && (n = n.reduce((o, a) => o.length > a.length ? o : a)), t + e.size / 2 + s.measureText(n).width;
}
function Ol(i, t, e) {
  let s = i;
  return typeof t.text != "string" && (s = Cn(t, e)), s;
}
function Cn(i, t) {
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
        const t = i.data.datasets, { labels: { usePointStyle: e, pointStyle: s, textAlign: n, color: o, useBorderRadius: a, borderRadius: r } } = i.legend.options;
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
            borderRadius: a && (r || c.borderRadius),
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
class On extends ut {
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
    const n = W(s.text) ? s.text.length : 1;
    this._padding = et(s.padding);
    const o = n * $(s.font).lineHeight + this._padding.height;
    this.isHorizontal() ? this.height = o : this.width = o;
  }
  isHorizontal() {
    const t = this.options.position;
    return t === "top" || t === "bottom";
  }
  _drawArgs(t) {
    const { top: e, left: s, bottom: n, right: o, options: a } = this, r = a.align;
    let l = 0, c, h, d;
    return this.isHorizontal() ? (h = j(r, s, o), d = e + t, c = o - s) : (a.position === "left" ? (h = s + t, d = j(r, n, e), l = V * -0.5) : (h = o - t, d = j(r, e, n), l = V * 0.5), c = n - e), {
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
    const s = $(e.font), o = s.lineHeight / 2 + this._padding.top, { titleX: a, titleY: r, maxWidth: l, rotation: c } = this._drawArgs(o);
    le(t, e.text, 0, 0, s, {
      color: e.color,
      maxWidth: l,
      rotation: c,
      textAlign: wi(e.align),
      textBaseline: "middle",
      translation: [
        a,
        r
      ]
    });
  }
}
function Al(i, t) {
  const e = new On({
    ctx: i.ctx,
    options: t,
    chart: i
  });
  J.configure(i, e, t), J.addBox(i, e), i.titleBlock = e;
}
var Ll = {
  id: "title",
  _element: On,
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
const Qt = {
  average(i) {
    if (!i.length)
      return !1;
    let t, e, s = /* @__PURE__ */ new Set(), n = 0, o = 0;
    for (t = 0, e = i.length; t < e; ++t) {
      const r = i[t].element;
      if (r && r.hasValue()) {
        const l = r.tooltipPosition();
        s.add(l.x), n += l.y, ++o;
      }
    }
    return o === 0 || s.size === 0 ? !1 : {
      x: [
        ...s
      ].reduce((r, l) => r + l) / s.size,
      y: n / o
    };
  },
  nearest(i, t) {
    if (!i.length)
      return !1;
    let e = t.x, s = t.y, n = Number.POSITIVE_INFINITY, o, a, r;
    for (o = 0, a = i.length; o < a; ++o) {
      const l = i[o].element;
      if (l && l.hasValue()) {
        const c = l.getCenterPoint(), h = ai(t, c);
        h < n && (n = h, r = l);
      }
    }
    if (r) {
      const l = r.tooltipPosition();
      e = l.x, s = l.y;
    }
    return {
      x: e,
      y: s
    };
  }
};
function nt(i, t) {
  return t && (W(t) ? Array.prototype.push.apply(i, t) : i.push(t)), i;
}
function ht(i) {
  return (typeof i == "string" || i instanceof String) && i.indexOf(`
`) > -1 ? i.split(`
`) : i;
}
function Il(i, t) {
  const { element: e, datasetIndex: s, index: n } = t, o = i.getDatasetMeta(s).controller, { label: a, value: r } = o.getLabelAndValue(n);
  return {
    chart: i,
    label: a,
    parsed: o.getParsed(n),
    raw: i.data.datasets[s].data[n],
    formattedValue: r,
    dataset: o.getDataset(),
    dataIndex: n,
    datasetIndex: s,
    element: e
  };
}
function Ts(i, t) {
  const e = i.chart.ctx, { body: s, footer: n, title: o } = i, { boxWidth: a, boxHeight: r } = t, l = $(t.bodyFont), c = $(t.titleFont), h = $(t.footerFont), d = o.length, u = n.length, f = s.length, m = et(t.padding);
  let g = m.height, p = 0, x = s.reduce((S, _) => S + _.before.length + _.lines.length + _.after.length, 0);
  if (x += i.beforeBody.length + i.afterBody.length, d && (g += d * c.lineHeight + (d - 1) * t.titleSpacing + t.titleMarginBottom), x) {
    const S = t.displayColors ? Math.max(r, l.lineHeight) : l.lineHeight;
    g += f * S + (x - f) * l.lineHeight + (x - 1) * t.bodySpacing;
  }
  u && (g += t.footerMarginTop + u * h.lineHeight + (u - 1) * t.footerSpacing);
  let w = 0;
  const M = function(S) {
    p = Math.max(p, e.measureText(S).width + w);
  };
  return e.save(), e.font = c.string, I(i.title, M), e.font = l.string, I(i.beforeBody.concat(i.afterBody), M), w = t.displayColors ? a + 2 + t.boxPadding : 0, I(s, (S) => {
    I(S.before, M), I(S.lines, M), I(S.after, M);
  }), w = 0, e.font = h.string, I(i.footer, M), e.restore(), p += m.width, {
    width: p,
    height: g
  };
}
function Fl(i, t) {
  const { y: e, height: s } = t;
  return e < s / 2 ? "top" : e > i.height - s / 2 ? "bottom" : "center";
}
function Rl(i, t, e, s) {
  const { x: n, width: o } = s, a = e.caretSize + e.caretPadding;
  if (i === "left" && n + o + a > t.width || i === "right" && n - o - a < 0)
    return !0;
}
function zl(i, t, e, s) {
  const { x: n, width: o } = e, { width: a, chartArea: { left: r, right: l } } = i;
  let c = "center";
  return s === "center" ? c = n <= (r + l) / 2 ? "left" : "right" : n <= o / 2 ? c = "left" : n >= a - o / 2 && (c = "right"), Rl(c, i, t, e) && (c = "center"), c;
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
  const { caretSize: n, caretPadding: o, cornerRadius: a } = i, { xAlign: r, yAlign: l } = e, c = n + o, { topLeft: h, topRight: d, bottomLeft: u, bottomRight: f } = ie(a);
  let m = El(t, r);
  const g = Hl(t, l, c);
  return l === "center" ? r === "left" ? m += c : r === "right" && (m -= c) : r === "left" ? m -= Math.max(h, u) + n : r === "right" && (m += Math.max(d, f) + n), {
    x: Z(m, 0, s.width - t.width),
    y: Z(g, 0, s.height - t.height)
  };
}
function Ce(i, t, e) {
  const s = et(e.padding);
  return t === "center" ? i.x + i.width / 2 : t === "right" ? i.x + i.width - s.right : i.x + s.left;
}
function Is(i) {
  return nt([], ht(i));
}
function Bl(i, t, e) {
  return Pt(i, {
    tooltip: t,
    tooltipItems: e,
    type: "tooltip"
  });
}
function Fs(i, t) {
  const e = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
  return e ? i.override(e) : i;
}
const Pn = {
  beforeTitle: lt,
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
  afterTitle: lt,
  beforeBody: lt,
  beforeLabel: lt,
  label(i) {
    if (this && this.options && this.options.mode === "dataset")
      return i.label + ": " + i.formattedValue || i.formattedValue;
    let t = i.dataset.label || "";
    t && (t += ": ");
    const e = i.formattedValue;
    return F(e) || (t += e), t;
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
  afterLabel: lt,
  afterBody: lt,
  beforeFooter: lt,
  footer: lt,
  afterFooter: lt
};
function Y(i, t, e, s) {
  const n = i[t].call(e, s);
  return typeof n > "u" ? Pn[t].call(e, s) : n;
}
class fi extends ut {
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
    const e = this.chart, s = this.options.setContext(this.getContext()), n = s.enabled && e.options.animation && s.animations, o = new gn(this.chart, n);
    return n._cacheable && (this._cachedAnimations = Object.freeze(o)), o;
  }
  getContext() {
    return this.$context || (this.$context = Bl(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(t, e) {
    const { callbacks: s } = e, n = Y(s, "beforeTitle", this, t), o = Y(s, "title", this, t), a = Y(s, "afterTitle", this, t);
    let r = [];
    return r = nt(r, ht(n)), r = nt(r, ht(o)), r = nt(r, ht(a)), r;
  }
  getBeforeBody(t, e) {
    return Is(Y(e.callbacks, "beforeBody", this, t));
  }
  getBody(t, e) {
    const { callbacks: s } = e, n = [];
    return I(t, (o) => {
      const a = {
        before: [],
        lines: [],
        after: []
      }, r = Fs(s, o);
      nt(a.before, ht(Y(r, "beforeLabel", this, o))), nt(a.lines, Y(r, "label", this, o)), nt(a.after, ht(Y(r, "afterLabel", this, o))), n.push(a);
    }), n;
  }
  getAfterBody(t, e) {
    return Is(Y(e.callbacks, "afterBody", this, t));
  }
  getFooter(t, e) {
    const { callbacks: s } = e, n = Y(s, "beforeFooter", this, t), o = Y(s, "footer", this, t), a = Y(s, "afterFooter", this, t);
    let r = [];
    return r = nt(r, ht(n)), r = nt(r, ht(o)), r = nt(r, ht(a)), r;
  }
  _createItems(t) {
    const e = this._active, s = this.chart.data, n = [], o = [], a = [];
    let r = [], l, c;
    for (l = 0, c = e.length; l < c; ++l)
      r.push(Il(this.chart, e[l]));
    return t.filter && (r = r.filter((h, d, u) => t.filter(h, d, u, s))), t.itemSort && (r = r.sort((h, d) => t.itemSort(h, d, s))), I(r, (h) => {
      const d = Fs(t.callbacks, h);
      n.push(Y(d, "labelColor", this, h)), o.push(Y(d, "labelPointStyle", this, h)), a.push(Y(d, "labelTextColor", this, h));
    }), this.labelColors = n, this.labelPointStyles = o, this.labelTextColors = a, this.dataPoints = r, r;
  }
  update(t, e) {
    const s = this.options.setContext(this.getContext()), n = this._active;
    let o, a = [];
    if (!n.length)
      this.opacity !== 0 && (o = {
        opacity: 0
      });
    else {
      const r = Qt[s.position].call(this, n, this._eventPosition);
      a = this._createItems(s), this.title = this.getTitle(a, s), this.beforeBody = this.getBeforeBody(a, s), this.body = this.getBody(a, s), this.afterBody = this.getAfterBody(a, s), this.footer = this.getFooter(a, s);
      const l = this._size = Ts(this, s), c = Object.assign({}, r, l), h = As(this.chart, s, c), d = Ls(s, c, h, this.chart);
      this.xAlign = h.xAlign, this.yAlign = h.yAlign, o = {
        opacity: 1,
        x: d.x,
        y: d.y,
        width: l.width,
        height: l.height,
        caretX: r.x,
        caretY: r.y
      };
    }
    this._tooltipItems = a, this.$context = void 0, o && this._resolveAnimations().update(this, o), t && s.external && s.external.call(this, {
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
    const { xAlign: n, yAlign: o } = this, { caretSize: a, cornerRadius: r } = s, { topLeft: l, topRight: c, bottomLeft: h, bottomRight: d } = ie(r), { x: u, y: f } = t, { width: m, height: g } = e;
    let p, x, w, M, S, _;
    return o === "center" ? (S = f + g / 2, n === "left" ? (p = u, x = p - a, M = S + a, _ = S - a) : (p = u + m, x = p + a, M = S - a, _ = S + a), w = p) : (n === "left" ? x = u + Math.max(l, h) + a : n === "right" ? x = u + m - Math.max(c, d) - a : x = this.caretX, o === "top" ? (M = f, S = M - a, p = x - a, w = x + a) : (M = f + g, S = M + a, p = x + a, w = x - a), _ = M), {
      x1: p,
      x2: x,
      x3: w,
      y1: M,
      y2: S,
      y3: _
    };
  }
  drawTitle(t, e, s) {
    const n = this.title, o = n.length;
    let a, r, l;
    if (o) {
      const c = Rt(s.rtl, this.x, this.width);
      for (t.x = Ce(this, s.titleAlign, s), e.textAlign = c.textAlign(s.titleAlign), e.textBaseline = "middle", a = $(s.titleFont), r = s.titleSpacing, e.fillStyle = s.titleColor, e.font = a.string, l = 0; l < o; ++l)
        e.fillText(n[l], c.x(t.x), t.y + a.lineHeight / 2), t.y += a.lineHeight + r, l + 1 === o && (t.y += s.titleMarginBottom - r);
    }
  }
  _drawColorBox(t, e, s, n, o) {
    const a = this.labelColors[s], r = this.labelPointStyles[s], { boxHeight: l, boxWidth: c } = o, h = $(o.bodyFont), d = Ce(this, "left", o), u = n.x(d), f = l < h.lineHeight ? (h.lineHeight - l) / 2 : 0, m = e.y + f;
    if (o.usePointStyle) {
      const g = {
        radius: Math.min(c, l) / 2,
        pointStyle: r.pointStyle,
        rotation: r.rotation,
        borderWidth: 1
      }, p = n.leftForLtr(u, c) + c / 2, x = m + l / 2;
      t.strokeStyle = o.multiKeyBackground, t.fillStyle = o.multiKeyBackground, li(t, g, p, x), t.strokeStyle = a.borderColor, t.fillStyle = a.backgroundColor, li(t, g, p, x);
    } else {
      t.lineWidth = L(a.borderWidth) ? Math.max(...Object.values(a.borderWidth)) : a.borderWidth || 1, t.strokeStyle = a.borderColor, t.setLineDash(a.borderDash || []), t.lineDashOffset = a.borderDashOffset || 0;
      const g = n.leftForLtr(u, c), p = n.leftForLtr(n.xPlus(u, 1), c - 2), x = ie(a.borderRadius);
      Object.values(x).some((w) => w !== 0) ? (t.beginPath(), t.fillStyle = o.multiKeyBackground, ci(t, {
        x: g,
        y: m,
        w: c,
        h: l,
        radius: x
      }), t.fill(), t.stroke(), t.fillStyle = a.backgroundColor, t.beginPath(), ci(t, {
        x: p,
        y: m + 1,
        w: c - 2,
        h: l - 2,
        radius: x
      }), t.fill()) : (t.fillStyle = o.multiKeyBackground, t.fillRect(g, m, c, l), t.strokeRect(g, m, c, l), t.fillStyle = a.backgroundColor, t.fillRect(p, m + 1, c - 2, l - 2));
    }
    t.fillStyle = this.labelTextColors[s];
  }
  drawBody(t, e, s) {
    const { body: n } = this, { bodySpacing: o, bodyAlign: a, displayColors: r, boxHeight: l, boxWidth: c, boxPadding: h } = s, d = $(s.bodyFont);
    let u = d.lineHeight, f = 0;
    const m = Rt(s.rtl, this.x, this.width), g = function(y) {
      e.fillText(y, m.x(t.x + f), t.y + u / 2), t.y += u + o;
    }, p = m.textAlign(a);
    let x, w, M, S, _, b, k;
    for (e.textAlign = a, e.textBaseline = "middle", e.font = d.string, t.x = Ce(this, p, s), e.fillStyle = s.bodyColor, I(this.beforeBody, g), f = r && p !== "right" ? a === "center" ? c / 2 + h : c + 2 + h : 0, S = 0, b = n.length; S < b; ++S) {
      for (x = n[S], w = this.labelTextColors[S], e.fillStyle = w, I(x.before, g), M = x.lines, r && M.length && (this._drawColorBox(e, t, S, m, s), u = Math.max(d.lineHeight, l)), _ = 0, k = M.length; _ < k; ++_)
        g(M[_]), u = d.lineHeight;
      I(x.after, g);
    }
    f = 0, u = d.lineHeight, I(this.afterBody, g), t.y -= o;
  }
  drawFooter(t, e, s) {
    const n = this.footer, o = n.length;
    let a, r;
    if (o) {
      const l = Rt(s.rtl, this.x, this.width);
      for (t.x = Ce(this, s.footerAlign, s), t.y += s.footerMarginTop, e.textAlign = l.textAlign(s.footerAlign), e.textBaseline = "middle", a = $(s.footerFont), e.fillStyle = s.footerColor, e.font = a.string, r = 0; r < o; ++r)
        e.fillText(n[r], l.x(t.x), t.y + a.lineHeight / 2), t.y += a.lineHeight + s.footerSpacing;
    }
  }
  drawBackground(t, e, s, n) {
    const { xAlign: o, yAlign: a } = this, { x: r, y: l } = t, { width: c, height: h } = s, { topLeft: d, topRight: u, bottomLeft: f, bottomRight: m } = ie(n.cornerRadius);
    e.fillStyle = n.backgroundColor, e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.beginPath(), e.moveTo(r + d, l), a === "top" && this.drawCaret(t, e, s, n), e.lineTo(r + c - u, l), e.quadraticCurveTo(r + c, l, r + c, l + u), a === "center" && o === "right" && this.drawCaret(t, e, s, n), e.lineTo(r + c, l + h - m), e.quadraticCurveTo(r + c, l + h, r + c - m, l + h), a === "bottom" && this.drawCaret(t, e, s, n), e.lineTo(r + f, l + h), e.quadraticCurveTo(r, l + h, r, l + h - f), a === "center" && o === "left" && this.drawCaret(t, e, s, n), e.lineTo(r, l + d), e.quadraticCurveTo(r, l, r + d, l), e.closePath(), e.fill(), n.borderWidth > 0 && e.stroke();
  }
  _updateAnimationTarget(t) {
    const e = this.chart, s = this.$animations, n = s && s.x, o = s && s.y;
    if (n || o) {
      const a = Qt[t.position].call(this, this._active, this._eventPosition);
      if (!a)
        return;
      const r = this._size = Ts(this, t), l = Object.assign({}, a, this._size), c = As(e, t, l), h = Ls(t, l, c, e);
      (n._to !== h.x || o._to !== h.y) && (this.xAlign = c.xAlign, this.yAlign = c.yAlign, this.width = r.width, this.height = r.height, this.caretX = a.x, this.caretY = a.y, this._resolveAnimations().update(this, h));
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
    const a = et(e.padding), r = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    e.enabled && r && (t.save(), t.globalAlpha = s, this.drawBackground(o, t, n, e), dn(t, e.textDirection), o.y += a.top, this.drawTitle(o, t, e), this.drawBody(o, t, e), this.drawFooter(o, t, e), un(t, e.textDirection), t.restore());
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t, e) {
    const s = this._active, n = t.map(({ datasetIndex: r, index: l }) => {
      const c = this.chart.getDatasetMeta(r);
      if (!c)
        throw new Error("Cannot find a dataset at index " + r);
      return {
        datasetIndex: r,
        element: c.data[l],
        index: l
      };
    }), o = !Ie(s, n), a = this._positionChanged(n, e);
    (o || a) && (this._active = n, this._eventPosition = e, this._ignoreReplayEvents = !0, this.update(!0));
  }
  handleEvent(t, e, s = !0) {
    if (e && this._ignoreReplayEvents)
      return !1;
    this._ignoreReplayEvents = !1;
    const n = this.options, o = this._active || [], a = this._getActiveElements(t, o, e, s), r = this._positionChanged(a, t), l = e || !Ie(a, o) || r;
    return l && (this._active = a, (n.enabled || n.external) && (this._eventPosition = {
      x: t.x,
      y: t.y
    }, this.update(!0, e))), l;
  }
  _getActiveElements(t, e, s, n) {
    const o = this.options;
    if (t.type === "mouseout")
      return [];
    if (!n)
      return e.filter((r) => this.chart.data.datasets[r.datasetIndex] && this.chart.getDatasetMeta(r.datasetIndex).controller.getParsed(r.index) !== void 0);
    const a = this.chart.getElementsAtEventForMode(t, o.mode, o, s);
    return o.reverse && a.reverse(), a;
  }
  _positionChanged(t, e) {
    const { caretX: s, caretY: n, options: o } = this, a = Qt[o.position].call(this, t, e);
    return a !== !1 && (s !== a.x || n !== a.y);
  }
}
P(fi, "positioners", Qt);
var Nl = {
  id: "tooltip",
  _element: fi,
  positioners: Qt,
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
    callbacks: Pn
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
class gi extends Bt {
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
    if (F(t))
      return null;
    const s = this.getLabels();
    return e = isFinite(e) && s[e] === t ? e : Vl(s, t, A(e, t), this._addedLabels), jl(e, s.length - 1);
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
    for (let a = t; a <= e; a++)
      n.push({
        value: a
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
P(gi, "id", "category"), P(gi, "defaults", {
  ticks: {
    callback: Rs
  }
});
function $l(i, t) {
  const e = [], { bounds: n, step: o, min: a, max: r, precision: l, count: c, maxTicks: h, maxDigits: d, includeBounds: u } = i, f = o || 1, m = h - 1, { min: g, max: p } = t, x = !F(a), w = !F(r), M = !F(c), S = (p - g) / (d + 1);
  let _ = Ni((p - g) / m / f) * f, b, k, y, D;
  if (_ < 1e-14 && !x && !w)
    return [
      {
        value: g
      },
      {
        value: p
      }
    ];
  D = Math.ceil(p / _) - Math.floor(g / _), D > m && (_ = Ni(D * _ / m / f) * f), F(l) || (b = Math.pow(10, l), _ = Math.ceil(_ * b) / b), n === "ticks" ? (k = Math.floor(g / _) * _, y = Math.ceil(p / _) * _) : (k = g, y = p), x && w && o && Po((r - a) / o, _ / 1e3) ? (D = Math.round(Math.min((r - a) / _, h)), _ = (r - a) / D, k = a, y = r) : M ? (k = x ? a : k, y = w ? r : y, D = c - 1, _ = (y - k) / D) : (D = (y - k) / _, Jt(D, Math.round(D), _ / 1e3) ? D = Math.round(D) : D = Math.ceil(D));
  const O = Math.max(Wi(_), Wi(k));
  b = Math.pow(10, F(l) ? O : l), k = Math.round(k * b) / b, y = Math.round(y * b) / b;
  let C = 0;
  for (x && (u && k !== a ? (e.push({
    value: a
  }), k < a && C++, Jt(Math.round((k + C * _) * b) / b, a, zs(a, S, i)) && C++) : k < a && C++); C < D; ++C) {
    const T = Math.round((k + C * _) * b) / b;
    if (w && T > r)
      break;
    e.push({
      value: T
    });
  }
  return w && u && y !== r ? e.length && Jt(e[e.length - 1].value, r, zs(r, S, i)) ? e[e.length - 1].value = r : e.push({
    value: r
  }) : (!w || y === r) && e.push({
    value: y
  }), e;
}
function zs(i, t, { horizontal: e, minRotation: s }) {
  const n = St(s), o = (e ? Math.sin(n) : Math.cos(n)) || 1e-3, a = 0.75 * t * ("" + i).length;
  return Math.min(t / o, a);
}
class Yl extends Bt {
  constructor(t) {
    super(t), this.start = void 0, this.end = void 0, this._startValue = void 0, this._endValue = void 0, this._valueRange = 0;
  }
  parse(t, e) {
    return F(t) || (typeof t == "number" || t instanceof Number) && !isFinite(+t) ? null : +t;
  }
  handleTickRangeOptions() {
    const { beginAtZero: t } = this.options, { minDefined: e, maxDefined: s } = this.getUserBounds();
    let { min: n, max: o } = this;
    const a = (l) => n = e ? n : l, r = (l) => o = s ? o : l;
    if (t) {
      const l = zt(n), c = zt(o);
      l < 0 && c < 0 ? r(0) : l > 0 && c > 0 && a(0);
    }
    if (n === o) {
      let l = o === 0 ? 1 : Math.abs(o * 0.05);
      r(o + l), t || a(n - l);
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
    }, o = this._range || this, a = $l(n, o);
    return t.bounds === "ticks" && To(a, this, "value"), t.reverse ? (a.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), a;
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
    return en(t, this.chart.options.locale, this.options.ticks.format);
  }
}
class pi extends Yl {
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!0);
    this.min = tt(t) ? t : 0, this.max = tt(e) ? e : 1, this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const t = this.isHorizontal(), e = t ? this.width : this.height, s = St(this.options.ticks.minRotation), n = (t ? Math.sin(s) : Math.cos(s)) || 1e-3, o = this._resolveTickFontOptions(0);
    return Math.ceil(e / Math.min(40, o.lineHeight / n));
  }
  getPixelForValue(t) {
    return t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getValueForPixel(t) {
    return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
  }
}
P(pi, "id", "linear"), P(pi, "defaults", {
  ticks: {
    callback: sn.formatters.numeric
  }
});
const $e = {
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
}, U = /* @__PURE__ */ Object.keys($e);
function Es(i, t) {
  return i - t;
}
function Hs(i, t) {
  if (F(t))
    return null;
  const e = i._adapter, { parser: s, round: n, isoWeekday: o } = i._parseOpts;
  let a = t;
  return typeof s == "function" && (a = s(a)), tt(a) || (a = typeof s == "string" ? e.parse(a, s) : e.parse(a)), a === null ? null : (n && (a = n === "week" && (ae(o) || o === !0) ? e.startOf(a, "isoWeek", o) : e.startOf(a, n)), +a);
}
function Bs(i, t, e, s) {
  const n = U.length;
  for (let o = U.indexOf(i); o < n - 1; ++o) {
    const a = $e[U[o]], r = a.steps ? a.steps : Number.MAX_SAFE_INTEGER;
    if (a.common && Math.ceil((e - t) / (r * a.size)) <= s)
      return U[o];
  }
  return U[n - 1];
}
function Ul(i, t, e, s, n) {
  for (let o = U.length - 1; o >= U.indexOf(e); o--) {
    const a = U[o];
    if ($e[a].common && i._adapter.diff(n, s, a) >= t - 1)
      return a;
  }
  return U[e ? U.indexOf(e) : 0];
}
function Gl(i) {
  for (let t = U.indexOf(i) + 1, e = U.length; t < e; ++t)
    if ($e[U[t]].common)
      return U[t];
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
  const n = i._adapter, o = +n.startOf(t[0].value, s), a = t[t.length - 1].value;
  let r, l;
  for (r = o; r <= a; r = +n.add(r, 1, s))
    l = e[r], l >= 0 && (t[l].major = !0);
  return t;
}
function Ws(i, t, e) {
  const s = [], n = {}, o = t.length;
  let a, r;
  for (a = 0; a < o; ++a)
    r = t[a], n[r] = a, s.push({
      value: r,
      major: !1
    });
  return o === 0 || !e ? s : ql(i, s, n, e);
}
class Ne extends Bt {
  constructor(t) {
    super(t), this._cache = {
      data: [],
      labels: [],
      all: []
    }, this._unit = "day", this._majorUnit = void 0, this._offsets = {}, this._normalized = !1, this._parseOpts = void 0;
  }
  init(t, e = {}) {
    const s = t.time || (t.time = {}), n = this._adapter = new rr._date(t.adapters.date);
    n.init(e), Zt(s.displayFormats, n.formats()), this._parseOpts = {
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
    let { min: n, max: o, minDefined: a, maxDefined: r } = this.getUserBounds();
    function l(c) {
      !a && !isNaN(c.min) && (n = Math.min(n, c.min)), !r && !isNaN(c.max) && (o = Math.max(o, c.max));
    }
    (!a || !r) && (l(this._getLabelBounds()), (t.bounds !== "ticks" || t.ticks.source !== "labels") && l(this.getMinMax(!1))), n = tt(n) && !isNaN(n) ? n : +e.startOf(Date.now(), s), o = tt(o) && !isNaN(o) ? o : +e.endOf(Date.now(), s) + 1, this.min = Math.min(n, o - 1), this.max = Math.max(n + 1, o);
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
    const o = this.min, a = this.max, r = zo(n, o, a);
    return this._unit = e.unit || (s.autoSkip ? Bs(e.minUnit, this.min, this.max, this._getLabelCapacity(o)) : Ul(this, r.length, e.minUnit, this.min, this.max)), this._majorUnit = !s.major.enabled || this._unit === "year" ? void 0 : Gl(this._unit), this.initOffsets(n), t.reverse && r.reverse(), Ws(this, r, this._majorUnit);
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((t) => +t.value));
  }
  initOffsets(t = []) {
    let e = 0, s = 0, n, o;
    this.options.offset && t.length && (n = this.getDecimalForValue(t[0]), t.length === 1 ? e = 1 - n : e = (this.getDecimalForValue(t[1]) - n) / 2, o = this.getDecimalForValue(t[t.length - 1]), t.length === 1 ? s = o : s = (o - this.getDecimalForValue(t[t.length - 2])) / 2);
    const a = t.length < 3 ? 0.5 : 0.25;
    e = Z(e, 0, a), s = Z(s, 0, a), this._offsets = {
      start: e,
      end: s,
      factor: 1 / (e + 1 + s)
    };
  }
  _generate() {
    const t = this._adapter, e = this.min, s = this.max, n = this.options, o = n.time, a = o.unit || Bs(o.minUnit, e, s, this._getLabelCapacity(e)), r = A(n.ticks.stepSize, 1), l = a === "week" ? o.isoWeekday : !1, c = ae(l) || l === !0, h = {};
    let d = e, u, f;
    if (c && (d = +t.startOf(d, "isoWeek", l)), d = +t.startOf(d, c ? "day" : a), t.diff(s, e, a) > 1e5 * r)
      throw new Error(e + " and " + s + " are too far apart with stepSize of " + r + " " + a);
    const m = n.ticks.source === "data" && this.getDataTimestamps();
    for (u = d, f = 0; u < s; u = +t.add(u, r, a), f++)
      Ns(h, u, m);
    return (u === s || n.bounds === "ticks" || f === 1) && Ns(h, u, m), Object.keys(h).sort(Es).map((g) => +g);
  }
  getLabelForValue(t) {
    const e = this._adapter, s = this.options.time;
    return s.tooltipFormat ? e.format(t, s.tooltipFormat) : e.format(t, s.displayFormats.datetime);
  }
  format(t, e) {
    const n = this.options.time.displayFormats, o = this._unit, a = e || n[o];
    return this._adapter.format(t, a);
  }
  _tickFormatFunction(t, e, s, n) {
    const o = this.options, a = o.ticks.callback;
    if (a)
      return z(a, [
        t,
        e,
        s
      ], this);
    const r = o.time.displayFormats, l = this._unit, c = this._majorUnit, h = l && r[l], d = c && r[c], u = s[e], f = c && d && u && u.major;
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
    const e = this.options.ticks, s = this.ctx.measureText(t).width, n = St(this.isHorizontal() ? e.maxRotation : e.minRotation), o = Math.cos(n), a = Math.sin(n), r = this._resolveTickFontOptions(0).size;
    return {
      w: s * o + r * a,
      h: s * a + r * o
    };
  }
  _getLabelCapacity(t) {
    const e = this.options.time, s = e.displayFormats, n = s[e.unit] || s.millisecond, o = this._tickFormatFunction(t, 0, Ws(this, [
      t
    ], this._majorUnit), n), a = this._getLabelSize(o), r = Math.floor(this.isHorizontal() ? this.width / a.w : this.height / a.h) - 1;
    return r > 0 ? r : 1;
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
P(Ne, "id", "time"), P(Ne, "defaults", {
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
  let s = 0, n = i.length - 1, o, a, r, l;
  e ? (t >= i[s].pos && t <= i[n].pos && ({ lo: s, hi: n } = Dt(i, "pos", t)), { pos: o, time: r } = i[s], { pos: a, time: l } = i[n]) : (t >= i[s].time && t <= i[n].time && ({ lo: s, hi: n } = Dt(i, "time", t)), { time: o, pos: r } = i[s], { time: a, pos: l } = i[n]);
  const c = a - o;
  return c ? r + (l - r) * (t - o) / c : r;
}
class Vs extends Ne {
  constructor(t) {
    super(t), this._table = [], this._minPos = void 0, this._tableRange = void 0;
  }
  initOffsets() {
    const t = this._getTimestampsForTable(), e = this._table = this.buildLookupTable(t);
    this._minPos = Oe(e, this.min), this._tableRange = Oe(e, this.max) - this._minPos, super.initOffsets(t);
  }
  buildLookupTable(t) {
    const { min: e, max: s } = this, n = [], o = [];
    let a, r, l, c, h;
    for (a = 0, r = t.length; a < r; ++a)
      c = t[a], c >= e && c <= s && n.push(c);
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
    for (a = 0, r = n.length; a < r; ++a)
      h = n[a + 1], l = n[a - 1], c = n[a], Math.round((h + l) / 2) !== c && o.push({
        time: c,
        pos: a / (r - 1)
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
P(Vs, "id", "timeseries"), P(Vs, "defaults", Ne.defaults);
const Tn = {
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
  ...Tn,
  ...Xl
}, Ql = Bn[0] === "2" ? (i, t) => Object.assign(i, {
  attrs: t
}) : (i, t) => Object.assign(i, t);
function Ft(i) {
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
function An(i, t) {
  i.labels = t;
}
function Ln(i, t, e) {
  const s = [];
  i.datasets = t.map((n) => {
    const o = i.datasets.find((a) => a[e] === n[e]);
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
  return An(e, i.labels), Ln(e, i.datasets, t), e;
}
const ec = mi({
  props: Kl,
  setup(i, t) {
    let { expose: e, slots: s } = t;
    const n = ii(null), o = $s(null);
    e({
      chart: o
    });
    const a = () => {
      if (!n.value) return;
      const { type: c, data: h, options: d, plugins: u, datasetIdKey: f } = i, m = tc(h, f), g = Zl(m, h);
      o.value = new je(n.value, {
        type: c,
        data: g,
        options: {
          ...d
        },
        plugins: u
      });
    }, r = () => {
      const c = si(o.value);
      c && (i.destroyDelay > 0 ? setTimeout(() => {
        c.destroy(), o.value = null;
      }, i.destroyDelay) : (c.destroy(), o.value = null));
    }, l = (c) => {
      c.update(i.updateMode);
    };
    return Rn(a), zn(r), En([
      () => i.options,
      () => i.data
    ], (c, h) => {
      let [d, u] = c, [f, m] = h;
      const g = si(o.value);
      if (!g)
        return;
      let p = !1;
      if (d) {
        const x = Ft(d), w = Ft(f);
        x && x !== w && (Jl(g, x), p = !0);
      }
      if (u) {
        const x = Ft(u.labels), w = Ft(m.labels), M = Ft(u.datasets), S = Ft(m.datasets);
        x !== w && (An(g.config.data, x), p = !0), M && M !== S && (Ln(g.config.data, M, i.datasetIdKey), p = !0);
      }
      p && Hn(() => {
        l(g);
      });
    }, {
      deep: !0
    }), () => ei("canvas", {
      role: "img",
      ariaLabel: i.ariaLabel,
      ariaDescribedby: i.ariaDescribedby,
      ref: n
    }, [
      ei("p", {}, [
        s.default ? s.default() : ""
      ])
    ]);
  }
});
function ic(i, t) {
  return je.register(t), mi({
    props: Tn,
    setup(e, s) {
      let { expose: n } = s;
      const o = $s(null), a = (r) => {
        o.value = r == null ? void 0 : r.chart;
      };
      return n({
        chart: o
      }), () => ei(ec, Ql({
        ref: a
      }, {
        type: i,
        ...e
      }));
    }
  });
}
const sc = /* @__PURE__ */ ic("line", Pe), nc = { class: "dashboard-container" }, oc = {
  key: 0,
  class: "loading"
}, ac = {
  key: 1,
  class: "error"
}, rc = { key: 2 }, lc = { class: "metric-block" }, cc = {
  key: 0,
  class: "metric-row all-accounts-row"
}, hc = { class: "row-content" }, dc = { class: "metric-column" }, uc = { class: "metric-value" }, fc = { class: "metric-value" }, gc = { class: "metric-column" }, pc = { class: "metric-value" }, mc = { class: "metric-value" }, bc = { class: "row-header-button-container" }, _c = ["onClick"], xc = ["onClick"], yc = { class: "row-content" }, vc = { class: "metric-column" }, wc = { class: "metric-label-with-icon" }, kc = ["onClick"], Mc = { class: "metric-value" }, Sc = { class: "metric-value" }, Dc = { class: "metric-column" }, Cc = { class: "metric-label-with-icon" }, Oc = ["onClick"], Pc = { class: "metric-value" }, Tc = { class: "metric-value" }, Ac = {
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
}, Hc = { class: "breakdown-columns" }, Bc = { class: "breakdown-stage stage-1" }, Nc = { class: "stage-item" }, Wc = { class: "item-value" }, Vc = { class: "formula" }, jc = { class: "stage-item" }, $c = { class: "item-value" }, Yc = { class: "formula" }, Uc = { class: "stage-item" }, Gc = { class: "item-value" }, qc = { class: "formula" }, Xc = { class: "stage-item" }, Kc = { class: "item-value" }, Qc = { class: "formula" }, Zc = { class: "breakdown-stage stage-2" }, Jc = { class: "stage-item" }, th = { class: "item-value" }, eh = { class: "formula" }, ih = { class: "stage-item" }, sh = { class: "item-value" }, nh = { class: "formula" }, oh = { class: "stage-item" }, ah = { class: "item-value" }, rh = { class: "formula" }, lh = { class: "stage-item" }, ch = { class: "item-value" }, hh = { class: "formula" }, dh = /* @__PURE__ */ mi({
  __name: "Margin",
  setup(i) {
    je.register(
      gi,
      pi,
      Le,
      Kt,
      Ll,
      Nl,
      Tl
    );
    const t = qn(1e4), e = Li({}), s = Li({}), n = ii(null), o = ii(null), a = Yn(), r = ni({
      queryKey: rt(() => ["nlvHistory", n.value]),
      queryFn: async () => {
        if (!n.value) return [];
        console.log("🔍 Querying NLV history for account:", n.value);
        const { data: _, error: b } = await a.schema("hf").from("netliquidation").select("internal_account_id, fetched_at, nlv").eq("internal_account_id", n.value).gte("fetched_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString()).order("fetched_at", { ascending: !0 });
        if (b)
          throw console.error("❌ NLV history query error:", b), b;
        return console.log("✅ NLV history query success:", _ == null ? void 0 : _.length, "records"), _ || [];
      },
      staleTime: 6e4,
      enabled: rt(() => !!n.value && o.value === "nlv")
    }), l = ni({
      queryKey: rt(() => ["maintenanceHistory", n.value]),
      queryFn: async () => {
        if (!n.value) return [];
        console.log("🔍 Querying Maintenance Margin history for account:", n.value);
        const { data: _, error: b } = await a.schema("hf").from("maintenance_margin").select("internal_account_id, fetched_at, maintenance").eq("internal_account_id", n.value).gte("fetched_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString()).order("fetched_at", { ascending: !0 });
        if (b)
          throw console.error("❌ Maintenance Margin history query error:", b), b;
        return console.log("✅ Maintenance Margin history query success:", _ == null ? void 0 : _.length, "records"), _ || [];
      },
      staleTime: 6e4,
      enabled: rt(() => !!n.value && o.value === "mm")
    });
    function c(_) {
      return _ == null ? "$0" : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(_);
    }
    function h(_, b) {
      console.log("🔄 Toggle graph called:", { accountId: _, type: b }), s[_] || (s[_] = { nlv: !1, mm: !1 });
      const k = s[_][b];
      Object.keys(s).forEach((y) => {
        const D = parseInt(y);
        s[D] && (s[D].nlv = !1, s[D].mm = !1);
      }), s[_][b] = !k, s[_][b] ? (console.log("📊 Setting selected account for history:", _, "type:", b), n.value = _, o.value = b) : (console.log("❌ Clearing selected account for history"), n.value = null, o.value = null), console.log("📈 Graph visibility state:", s), console.log("🎯 Selected account for history:", n.value, "type:", o.value);
    }
    const d = rt(() => o.value === "nlv" ? r : o.value === "mm" ? l : null), u = rt(() => {
      var O;
      const _ = d.value;
      if (!((O = _ == null ? void 0 : _.data.value) != null && O.length)) return null;
      const b = _.data.value, k = b.map((C) => new Date(C.fetched_at).toLocaleDateString()), y = o.value === "nlv", D = b.map((C) => y ? C.nlv : C.maintenance);
      return {
        labels: k,
        datasets: [
          {
            label: y ? "Net Liquidation Value" : "Maintenance Margin",
            data: D,
            borderColor: y ? "#3b82f6" : "#f59e0b",
            backgroundColor: y ? "rgba(59, 130, 246, 0.1)" : "rgba(245, 158, 11, 0.1)",
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.1,
            fill: !0
          }
        ]
      };
    }), f = rt(() => ({
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
            label: function(_) {
              return c(_.parsed.y);
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
            callback: function(_) {
              return c(_);
            }
          }
        }
      }
    }));
    function m(_, b, k) {
      const y = 1 - k, D = 1 - b, C = 1 - y * D;
      return _ / C;
    }
    const g = rt(() => t.data.value ? t.data.value.map((_) => {
      const b = m(_.nlv_val, 0.3, 0.15), k = m(_.nlv_val, 0.3, 0.1), y = b * 30 / 100, D = k * 30 / 100, O = y - _.maintenance_val, C = D - _.maintenance_val, T = O * 100 / 30, N = C * 100 / 30;
      return {
        ..._,
        maxGmvNlvSide: b,
        maxGmvMaintenanceSide: k,
        mkNlvSide: y,
        mkMaintenanceSide: D,
        maintnanceMarginHeadroomNlvSide: O,
        maintnanceMarginHeadroomMaintenanceSide: C,
        addlGmvAllowedNlvSide: T,
        addlGmvAllowedMaintenanceSide: N
      };
    }) : []), p = rt(() => {
      if (!g.value) return null;
      const _ = g.value.reduce((D, O) => D + (O.nlv_val || 0), 0), b = g.value.reduce((D, O) => D + (O.maintenance_val || 0), 0), k = g.value.reduce((D, O) => D + (O.addlGmvAllowedNlvSide || 0), 0), y = g.value.reduce((D, O) => D + (O.addlGmvAllowedMaintenanceSide || 0), 0);
      return {
        totalNlv: _,
        totalMaintenance: b,
        totalAddlGmvToStopReducing: k,
        totalAddlGmvToStartReducing: y
      };
    });
    function x(_) {
      e[_] = !e[_];
    }
    const w = js("eventBus");
    function M(_) {
      const b = new URL(window.location.href);
      b.searchParams.set("all_cts_clientId", "Client " + _.toString()), window.history.replaceState({}, "", b.toString()), w == null || w.emit("client-id-changed", {
        clientId: "Client " + _.toString(),
        accountId: _
      });
    }
    function S() {
      const _ = new URL(window.location.href);
      _.searchParams.delete("all_cts_clientId"), window.history.replaceState({}, "", _.toString()), w == null || w.emit("client-id-changed", {
        clientId: null,
        accountId: null
      });
    }
    return Nn(() => {
      t._cleanup && t._cleanup();
    }), (_, b) => {
      var k;
      return X(), q("div", nc, [
        Lt(t).isLoading.value ? (X(), q("div", oc, [...b[0] || (b[0] = [
          v("div", { class: "loading-spinner" }, null, -1),
          v("p", null, "Loading the latest metrics...", -1)
        ])])) : Lt(t).isError.value ? (X(), q("div", ac, [
          b[1] || (b[1] = v("h2", null, "Error Loading Data", -1)),
          b[2] || (b[2] = v("p", null, "An error occurred while fetching the metrics:", -1)),
          v("pre", null, R(Lt(t).error.value), 1)
        ])) : Lt(t).isSuccess.value ? (X(), q("div", rc, [
          v("div", lc, [
            b[24] || (b[24] = v("div", { class: "block-header" }, [
              v("h2", null, "Margin")
            ], -1)),
            p.value ? (X(), q("div", cc, [
              v("div", {
                class: "row-header",
                onClick: S
              }, "All Accounts (" + R(((k = Lt(t).data.value) == null ? void 0 : k.length) || 0) + ")", 1),
              v("div", hc, [
                v("div", dc, [
                  b[3] || (b[3] = v("div", { class: "metric-label" }, "Net liquidation value", -1)),
                  v("div", uc, R(c(p.value.totalNlv)), 1),
                  b[4] || (b[4] = v("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  v("div", fc, R(c(p.value.totalAddlGmvToStopReducing)), 1)
                ]),
                v("div", gc, [
                  b[5] || (b[5] = v("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  v("div", pc, R(c(p.value.totalMaintenance)), 1),
                  b[6] || (b[6] = v("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  v("div", mc, R(c(p.value.totalAddlGmvToStartReducing)), 1)
                ])
              ])
            ])) : ge("", !0),
            (X(!0), q(Wn, null, Vn(g.value, (y, D) => {
              var O, C, T, N, G, E;
              return X(), q("div", {
                key: `client-${y.nlv_internal_account_id}-${y.nlv_id}`,
                class: "metric-row"
              }, [
                v("div", bc, [
                  v("div", {
                    class: "row-header",
                    onClick: (H) => M(y.nlv_internal_account_id)
                  }, " Client" + R(D + 1), 9, _c),
                  v("button", {
                    class: Ye(["row-status", y.addlGmvAllowedNlvSide < 0 && y.addlGmvAllowedMaintenanceSide < 0 ? "stage-2-exhausted" : y.addlGmvAllowedNlvSide < 0 ? "stage-1-exhausted" : "ok"]),
                    onClick: (H) => x(y.nlv_id)
                  }, R(y.addlGmvAllowedNlvSide < 0 && y.addlGmvAllowedMaintenanceSide < 0 ? "Stage 2 exhausted" : y.addlGmvAllowedNlvSide < 0 ? "Stage 1 exhausted" : "OK"), 11, xc)
                ]),
                v("div", yc, [
                  v("div", vc, [
                    v("div", wc, [
                      b[8] || (b[8] = v("span", { class: "metric-label" }, "NLV", -1)),
                      v("button", {
                        class: Ye(["graph-icon", { active: (O = s[y.nlv_internal_account_id]) == null ? void 0 : O.nlv }]),
                        onClick: (H) => h(y.nlv_internal_account_id, "nlv")
                      }, [...b[7] || (b[7] = [
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
                    v("div", Mc, R(c(y.nlv_val)), 1),
                    b[9] || (b[9] = v("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                    v("div", Sc, R(c(y.addlGmvAllowedNlvSide)), 1)
                  ]),
                  v("div", Dc, [
                    v("div", Cc, [
                      b[11] || (b[11] = v("span", { class: "metric-label" }, "Maintenance margin", -1)),
                      v("button", {
                        class: Ye(["graph-icon", { active: (C = s[y.nlv_internal_account_id]) == null ? void 0 : C.mm }]),
                        onClick: (H) => h(y.nlv_internal_account_id, "mm")
                      }, [...b[10] || (b[10] = [
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
                    v("div", Pc, R(c(y.maintenance_val)), 1),
                    b[12] || (b[12] = v("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                    v("div", Tc, R(c(y.addlGmvAllowedMaintenanceSide)), 1)
                  ])
                ]),
                (T = s[y.nlv_internal_account_id]) != null && T.nlv || (N = s[y.nlv_internal_account_id]) != null && N.mm ? (X(), q("div", Ac, [
                  (G = d.value) != null && G.isLoading.value ? (X(), q("div", Lc, " Loading " + R(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data... ", 1)) : (E = d.value) != null && E.isError.value ? (X(), q("div", Ic, " Error loading " + R(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data: " + R(d.value.error.value), 1)) : u.value ? (X(), q("div", Fc, [
                    v("h4", null, R(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " History ", 1),
                    v("div", Rc, [
                      jn(Lt(sc), {
                        data: u.value,
                        options: f.value,
                        height: 300
                      }, null, 8, ["data", "options"])
                    ])
                  ])) : (X(), q("div", zc, " No " + R(o.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data available ", 1))
                ])) : ge("", !0),
                e[y.nlv_id] ? (X(), q("div", Ec, [
                  b[23] || (b[23] = v("div", { class: "breakdown-header" }, [
                    v("div", null, "Calculation breakdown:"),
                    v("div", null, "Assumptions: maintenance margin (m) = 30%")
                  ], -1)),
                  v("div", Hc, [
                    v("div", Bc, [
                      b[17] || (b[17] = v("div", { class: "stage-header" }, "Stage-1 (drop d = 15%)", -1)),
                      v("div", Nc, [
                        b[13] || (b[13] = v("div", { class: "item-label" }, "Max GMV that survives stop-adding threshold", -1)),
                        v("div", Wc, [
                          v("span", Vc, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + R(c(y.maxGmvNlvSide)), 1)
                        ])
                      ]),
                      v("div", jc, [
                        b[14] || (b[14] = v("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                        v("div", $c, [
                          v("span", Yc, "Mk = Gmax x m = " + R(c(y.mkNlvSide)), 1)
                        ])
                      ]),
                      v("div", Uc, [
                        b[15] || (b[15] = v("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                        v("div", Gc, [
                          v("span", qc, "Mk - M = " + R(c(y.maintnanceMarginHeadroomNlvSide)), 1)
                        ])
                      ]),
                      v("div", Xc, [
                        b[16] || (b[16] = v("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                        v("div", Kc, [
                          v("span", Qc, "(Mk - M) / m = " + R(c(y.addlGmvAllowedNlvSide)), 1)
                        ])
                      ])
                    ]),
                    v("div", Zc, [
                      b[22] || (b[22] = v("div", { class: "stage-header" }, "Stage-2 (drop d = 10%)", -1)),
                      v("div", Jc, [
                        b[18] || (b[18] = v("div", { class: "item-label" }, "Max GMV that survives start-reducing threshold", -1)),
                        v("div", th, [
                          v("span", eh, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + R(c(y.maxGmvMaintenanceSide)), 1)
                        ])
                      ]),
                      v("div", ih, [
                        b[19] || (b[19] = v("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                        v("div", sh, [
                          v("span", nh, "Mk = Gmax x m = " + R(c(y.mkMaintenanceSide)), 1)
                        ])
                      ]),
                      v("div", oh, [
                        b[20] || (b[20] = v("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                        v("div", ah, [
                          v("span", rh, "Mk - M = " + R(c(y.maintnanceMarginHeadroomMaintenanceSide)), 1)
                        ])
                      ]),
                      v("div", lh, [
                        b[21] || (b[21] = v("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                        v("div", ch, [
                          v("span", hh, "(Mk - M) / m = " + R(c(y.addlGmvAllowedMaintenanceSide)), 1)
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
}, _h = /* @__PURE__ */ uh(dh, [["__scopeId", "data-v-9b1cb354"]]);
export {
  _h as Margin,
  _h as default
};
