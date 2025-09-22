import { resolveComponent as At, createElementBlock as U, openBlock as B, createVNode as Ct, shallowRef as xt, defineComponent as Ae, unref as G, shallowReactive as $t, reactive as nt, inject as Y, computed as D, h as ot, provide as ge, ref as Mt, watch as rt, getCurrentInstance as st, watchEffect as It, nextTick as Tt, onBeforeUnmount as Vt, createCommentVNode as _e, createElementVNode as m, toDisplayString as $, Fragment as Dt, renderList as Gt, normalizeClass as Lt, createApp as jt } from "vue";
import { useQueryClient as Ut, useQuery as Bt } from "@tanstack/vue-query";
import { createCore as Ht } from "@y2kfund/core";
const qt = {
  __name: "App",
  setup(e) {
    return (t, n) => {
      const o = At("router-view");
      return B(), U("div", null, [
        Ct(o)
      ]);
    };
  }
};
function Kt() {
  return it().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function it() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : {};
}
const Wt = typeof Proxy == "function", zt = "devtools-plugin:setup", Qt = "plugin:settings:set";
let J, be;
function Ft() {
  var e;
  return J !== void 0 || (typeof window < "u" && window.performance ? (J = !0, be = window.performance) : typeof globalThis < "u" && (!((e = globalThis.perf_hooks) === null || e === void 0) && e.performance) ? (J = !0, be = globalThis.perf_hooks.performance) : J = !1), J;
}
function Jt() {
  return Ft() ? be.now() : Date.now();
}
class Yt {
  constructor(t, n) {
    this.target = null, this.targetQueue = [], this.onQueue = [], this.plugin = t, this.hook = n;
    const o = {};
    if (t.settings)
      for (const f in t.settings) {
        const p = t.settings[f];
        o[f] = p.defaultValue;
      }
    const s = `__vue-devtools-plugin-settings__${t.id}`;
    let d = Object.assign({}, o);
    try {
      const f = localStorage.getItem(s), p = JSON.parse(f);
      Object.assign(d, p);
    } catch {
    }
    this.fallbacks = {
      getSettings() {
        return d;
      },
      setSettings(f) {
        try {
          localStorage.setItem(s, JSON.stringify(f));
        } catch {
        }
        d = f;
      },
      now() {
        return Jt();
      }
    }, n && n.on(Qt, (f, p) => {
      f === this.plugin.id && this.fallbacks.setSettings(p);
    }), this.proxiedOn = new Proxy({}, {
      get: (f, p) => this.target ? this.target.on[p] : (...a) => {
        this.onQueue.push({
          method: p,
          args: a
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (f, p) => this.target ? this.target[p] : p === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(p) ? (...a) => (this.targetQueue.push({
        method: p,
        args: a,
        resolve: () => {
        }
      }), this.fallbacks[p](...a)) : (...a) => new Promise((i) => {
        this.targetQueue.push({
          method: p,
          args: a,
          resolve: i
        });
      })
    });
  }
  async setRealTarget(t) {
    this.target = t;
    for (const n of this.onQueue)
      this.target.on[n.method](...n.args);
    for (const n of this.targetQueue)
      n.resolve(await this.target[n.method](...n.args));
  }
}
function Xt(e, t) {
  const n = e, o = it(), s = Kt(), d = Wt && n.enableEarlyProxy;
  if (s && (o.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !d))
    s.emit(zt, e, t);
  else {
    const f = d ? new Yt(n, s) : null;
    (o.__VUE_DEVTOOLS_PLUGINS__ = o.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: n,
      setupFn: t,
      proxy: f
    }), f && t(f.proxiedTarget);
  }
}
/*!
  * vue-router v4.5.1
  * (c) 2025 Eduardo San Martin Morote
  * @license MIT
  */
const H = typeof document < "u";
function at(e) {
  return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function Zt(e) {
  return e.__esModule || e[Symbol.toStringTag] === "Module" || // support CF with dynamic imports that do not
  // add the Module string tag
  e.default && at(e.default);
}
const O = Object.assign;
function ye(e, t) {
  const n = {};
  for (const o in t) {
    const s = t[o];
    n[o] = T(s) ? s.map(e) : e(s);
  }
  return n;
}
const oe = () => {
}, T = Array.isArray;
function w(e) {
  const t = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[Vue Router warn]: " + e].concat(t));
}
const lt = /#/g, en = /&/g, tn = /\//g, nn = /=/g, on = /\?/g, ct = /\+/g, rn = /%5B/g, sn = /%5D/g, ut = /%5E/g, an = /%60/g, dt = /%7B/g, ln = /%7C/g, ft = /%7D/g, cn = /%20/g;
function Ce(e) {
  return encodeURI("" + e).replace(ln, "|").replace(rn, "[").replace(sn, "]");
}
function un(e) {
  return Ce(e).replace(dt, "{").replace(ft, "}").replace(ut, "^");
}
function Se(e) {
  return Ce(e).replace(ct, "%2B").replace(cn, "+").replace(lt, "%23").replace(en, "%26").replace(an, "`").replace(dt, "{").replace(ft, "}").replace(ut, "^");
}
function dn(e) {
  return Se(e).replace(nn, "%3D");
}
function fn(e) {
  return Ce(e).replace(lt, "%23").replace(on, "%3F");
}
function hn(e) {
  return e == null ? "" : fn(e).replace(tn, "%2F");
}
function X(e) {
  try {
    return decodeURIComponent("" + e);
  } catch {
    process.env.NODE_ENV !== "production" && w(`Error decoding "${e}". Using original value`);
  }
  return "" + e;
}
const pn = /\/$/, mn = (e) => e.replace(pn, "");
function Ee(e, t, n = "/") {
  let o, s = {}, d = "", f = "";
  const p = t.indexOf("#");
  let a = t.indexOf("?");
  return p < a && p >= 0 && (a = -1), a > -1 && (o = t.slice(0, a), d = t.slice(a + 1, p > -1 ? p : t.length), s = e(d)), p > -1 && (o = o || t.slice(0, p), f = t.slice(p, t.length)), o = _n(o ?? t, n), {
    fullPath: o + (d && "?") + d + f,
    path: o,
    query: s,
    hash: X(f)
  };
}
function vn(e, t) {
  const n = t.query ? e(t.query) : "";
  return t.path + (n && "?") + n + (t.hash || "");
}
function Ge(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/";
}
function Le(e, t, n) {
  const o = t.matched.length - 1, s = n.matched.length - 1;
  return o > -1 && o === s && z(t.matched[o], n.matched[s]) && ht(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function z(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function ht(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (!gn(e[n], t[n]))
      return !1;
  return !0;
}
function gn(e, t) {
  return T(e) ? je(e, t) : T(t) ? je(t, e) : e === t;
}
function je(e, t) {
  return T(t) ? e.length === t.length && e.every((n, o) => n === t[o]) : e.length === 1 && e[0] === t;
}
function _n(e, t) {
  if (e.startsWith("/"))
    return e;
  if (process.env.NODE_ENV !== "production" && !t.startsWith("/"))
    return w(`Cannot resolve a relative location without an absolute path. Trying to resolve "${e}" from "${t}". It should look like "/${t}".`), e;
  if (!e)
    return t;
  const n = t.split("/"), o = e.split("/"), s = o[o.length - 1];
  (s === ".." || s === ".") && o.push("");
  let d = n.length - 1, f, p;
  for (f = 0; f < o.length; f++)
    if (p = o[f], p !== ".")
      if (p === "..")
        d > 1 && d--;
      else
        break;
  return n.slice(0, d).join("/") + "/" + o.slice(f).join("/");
}
const K = {
  path: "/",
  // TODO: could we use a symbol in the future?
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
var se;
(function(e) {
  e.pop = "pop", e.push = "push";
})(se || (se = {}));
var re;
(function(e) {
  e.back = "back", e.forward = "forward", e.unknown = "";
})(re || (re = {}));
function yn(e) {
  if (!e)
    if (H) {
      const t = document.querySelector("base");
      e = t && t.getAttribute("href") || "/", e = e.replace(/^\w+:\/\/[^\/]+/, "");
    } else
      e = "/";
  return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), mn(e);
}
const En = /^[^#]+#/;
function wn(e, t) {
  return e.replace(En, "#") + t;
}
function bn(e, t) {
  const n = document.documentElement.getBoundingClientRect(), o = e.getBoundingClientRect();
  return {
    behavior: t.behavior,
    left: o.left - n.left - (t.left || 0),
    top: o.top - n.top - (t.top || 0)
  };
}
const ue = () => ({
  left: window.scrollX,
  top: window.scrollY
});
function Sn(e) {
  let t;
  if ("el" in e) {
    const n = e.el, o = typeof n == "string" && n.startsWith("#");
    if (process.env.NODE_ENV !== "production" && typeof e.el == "string" && (!o || !document.getElementById(e.el.slice(1))))
      try {
        const d = document.querySelector(e.el);
        if (o && d) {
          w(`The selector "${e.el}" should be passed as "el: document.querySelector('${e.el}')" because it starts with "#".`);
          return;
        }
      } catch {
        w(`The selector "${e.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`);
        return;
      }
    const s = typeof n == "string" ? o ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
    if (!s) {
      process.env.NODE_ENV !== "production" && w(`Couldn't find element using selector "${e.el}" returned by scrollBehavior.`);
      return;
    }
    t = bn(s, e);
  } else
    t = e;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.scrollX, t.top != null ? t.top : window.scrollY);
}
function Ue(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const Ne = /* @__PURE__ */ new Map();
function Nn(e, t) {
  Ne.set(e, t);
}
function kn(e) {
  const t = Ne.get(e);
  return Ne.delete(e), t;
}
let Rn = () => location.protocol + "//" + location.host;
function pt(e, t) {
  const { pathname: n, search: o, hash: s } = t, d = e.indexOf("#");
  if (d > -1) {
    let p = s.includes(e.slice(d)) ? e.slice(d).length : 1, a = s.slice(p);
    return a[0] !== "/" && (a = "/" + a), Ge(a, "");
  }
  return Ge(n, e) + o + s;
}
function On(e, t, n, o) {
  let s = [], d = [], f = null;
  const p = ({ state: c }) => {
    const h = pt(e, location), y = n.value, E = t.value;
    let R = 0;
    if (c) {
      if (n.value = h, t.value = c, f && f === y) {
        f = null;
        return;
      }
      R = E ? c.position - E.position : 0;
    } else
      o(h);
    s.forEach((A) => {
      A(n.value, y, {
        delta: R,
        type: se.pop,
        direction: R ? R > 0 ? re.forward : re.back : re.unknown
      });
    });
  };
  function a() {
    f = n.value;
  }
  function i(c) {
    s.push(c);
    const h = () => {
      const y = s.indexOf(c);
      y > -1 && s.splice(y, 1);
    };
    return d.push(h), h;
  }
  function l() {
    const { history: c } = window;
    c.state && c.replaceState(O({}, c.state, { scroll: ue() }), "");
  }
  function r() {
    for (const c of d)
      c();
    d = [], window.removeEventListener("popstate", p), window.removeEventListener("beforeunload", l);
  }
  return window.addEventListener("popstate", p), window.addEventListener("beforeunload", l, {
    passive: !0
  }), {
    pauseListeners: a,
    listen: i,
    destroy: r
  };
}
function Be(e, t, n, o = !1, s = !1) {
  return {
    back: e,
    current: t,
    forward: n,
    replaced: o,
    position: window.history.length,
    scroll: s ? ue() : null
  };
}
function Pn(e) {
  const { history: t, location: n } = window, o = {
    value: pt(e, n)
  }, s = { value: t.state };
  s.value || d(o.value, {
    back: null,
    current: o.value,
    forward: null,
    // the length is off by one, we need to decrease it
    position: t.length - 1,
    replaced: !0,
    // don't add a scroll as the user may have an anchor, and we want
    // scrollBehavior to be triggered without a saved position
    scroll: null
  }, !0);
  function d(a, i, l) {
    const r = e.indexOf("#"), c = r > -1 ? (n.host && document.querySelector("base") ? e : e.slice(r)) + a : Rn() + e + a;
    try {
      t[l ? "replaceState" : "pushState"](i, "", c), s.value = i;
    } catch (h) {
      process.env.NODE_ENV !== "production" ? w("Error with push/replace State", h) : console.error(h), n[l ? "replace" : "assign"](c);
    }
  }
  function f(a, i) {
    const l = O({}, t.state, Be(
      s.value.back,
      // keep back and forward entries but override current position
      a,
      s.value.forward,
      !0
    ), i, { position: s.value.position });
    d(a, l, !0), o.value = a;
  }
  function p(a, i) {
    const l = O(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      s.value,
      t.state,
      {
        forward: a,
        scroll: ue()
      }
    );
    process.env.NODE_ENV !== "production" && !t.state && w(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://router.vuejs.org/guide/migration/#Usage-of-history-state`), d(l.current, l, !0);
    const r = O({}, Be(o.value, a, null), { position: l.position + 1 }, i);
    d(a, r, !1), o.value = a;
  }
  return {
    location: o,
    state: s,
    push: p,
    replace: f
  };
}
function An(e) {
  e = yn(e);
  const t = Pn(e), n = On(e, t.state, t.location, t.replace);
  function o(d, f = !0) {
    f || n.pauseListeners(), history.go(d);
  }
  const s = O({
    // it's overridden right after
    location: "",
    base: e,
    go: o,
    createHref: wn.bind(null, e)
  }, t, n);
  return Object.defineProperty(s, "location", {
    enumerable: !0,
    get: () => t.location.value
  }), Object.defineProperty(s, "state", {
    enumerable: !0,
    get: () => t.state.value
  }), s;
}
function ce(e) {
  return typeof e == "string" || e && typeof e == "object";
}
function mt(e) {
  return typeof e == "string" || typeof e == "symbol";
}
const ke = Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
var He;
(function(e) {
  e[e.aborted = 4] = "aborted", e[e.cancelled = 8] = "cancelled", e[e.duplicated = 16] = "duplicated";
})(He || (He = {}));
const Cn = {
  1({ location: e, currentLocation: t }) {
    return `No match for
 ${JSON.stringify(e)}${t ? `
while being at
` + JSON.stringify(t) : ""}`;
  },
  2({ from: e, to: t }) {
    return `Redirected from "${e.fullPath}" to "${$n(t)}" via a navigation guard.`;
  },
  4({ from: e, to: t }) {
    return `Navigation aborted from "${e.fullPath}" to "${t.fullPath}" via a navigation guard.`;
  },
  8({ from: e, to: t }) {
    return `Navigation cancelled from "${e.fullPath}" to "${t.fullPath}" with a new navigation.`;
  },
  16({ from: e, to: t }) {
    return `Avoided redundant navigation to current location: "${e.fullPath}".`;
  }
};
function Z(e, t) {
  return process.env.NODE_ENV !== "production" ? O(new Error(Cn[e](t)), {
    type: e,
    [ke]: !0
  }, t) : O(new Error(), {
    type: e,
    [ke]: !0
  }, t);
}
function j(e, t) {
  return e instanceof Error && ke in e && (t == null || !!(e.type & t));
}
const xn = ["params", "query", "hash"];
function $n(e) {
  if (typeof e == "string")
    return e;
  if (e.path != null)
    return e.path;
  const t = {};
  for (const n of xn)
    n in e && (t[n] = e[n]);
  return JSON.stringify(t, null, 2);
}
const qe = "[^/]+?", Mn = {
  sensitive: !1,
  strict: !1,
  start: !0,
  end: !0
}, In = /[.+*?^${}()[\]/\\]/g;
function Tn(e, t) {
  const n = O({}, Mn, t), o = [];
  let s = n.start ? "^" : "";
  const d = [];
  for (const i of e) {
    const l = i.length ? [] : [
      90
      /* PathScore.Root */
    ];
    n.strict && !i.length && (s += "/");
    for (let r = 0; r < i.length; r++) {
      const c = i[r];
      let h = 40 + (n.sensitive ? 0.25 : 0);
      if (c.type === 0)
        r || (s += "/"), s += c.value.replace(In, "\\$&"), h += 40;
      else if (c.type === 1) {
        const { value: y, repeatable: E, optional: R, regexp: A } = c;
        d.push({
          name: y,
          repeatable: E,
          optional: R
        });
        const N = A || qe;
        if (N !== qe) {
          h += 10;
          try {
            new RegExp(`(${N})`);
          } catch (I) {
            throw new Error(`Invalid custom RegExp for param "${y}" (${N}): ` + I.message);
          }
        }
        let k = E ? `((?:${N})(?:/(?:${N}))*)` : `(${N})`;
        r || (k = // avoid an optional / if there are more segments e.g. /:p?-static
        // or /:p?-:p2
        R && i.length < 2 ? `(?:/${k})` : "/" + k), R && (k += "?"), s += k, h += 20, R && (h += -8), E && (h += -20), N === ".*" && (h += -50);
      }
      l.push(h);
    }
    o.push(l);
  }
  if (n.strict && n.end) {
    const i = o.length - 1;
    o[i][o[i].length - 1] += 0.7000000000000001;
  }
  n.strict || (s += "/?"), n.end ? s += "$" : n.strict && !s.endsWith("/") && (s += "(?:/|$)");
  const f = new RegExp(s, n.sensitive ? "" : "i");
  function p(i) {
    const l = i.match(f), r = {};
    if (!l)
      return null;
    for (let c = 1; c < l.length; c++) {
      const h = l[c] || "", y = d[c - 1];
      r[y.name] = h && y.repeatable ? h.split("/") : h;
    }
    return r;
  }
  function a(i) {
    let l = "", r = !1;
    for (const c of e) {
      (!r || !l.endsWith("/")) && (l += "/"), r = !1;
      for (const h of c)
        if (h.type === 0)
          l += h.value;
        else if (h.type === 1) {
          const { value: y, repeatable: E, optional: R } = h, A = y in i ? i[y] : "";
          if (T(A) && !E)
            throw new Error(`Provided param "${y}" is an array but it is not repeatable (* or + modifiers)`);
          const N = T(A) ? A.join("/") : A;
          if (!N)
            if (R)
              c.length < 2 && (l.endsWith("/") ? l = l.slice(0, -1) : r = !0);
            else
              throw new Error(`Missing required param "${y}"`);
          l += N;
        }
    }
    return l || "/";
  }
  return {
    re: f,
    score: o,
    keys: d,
    parse: p,
    stringify: a
  };
}
function Vn(e, t) {
  let n = 0;
  for (; n < e.length && n < t.length; ) {
    const o = t[n] - e[n];
    if (o)
      return o;
    n++;
  }
  return e.length < t.length ? e.length === 1 && e[0] === 80 ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === 80 ? 1 : -1 : 0;
}
function vt(e, t) {
  let n = 0;
  const o = e.score, s = t.score;
  for (; n < o.length && n < s.length; ) {
    const d = Vn(o[n], s[n]);
    if (d)
      return d;
    n++;
  }
  if (Math.abs(s.length - o.length) === 1) {
    if (Ke(o))
      return 1;
    if (Ke(s))
      return -1;
  }
  return s.length - o.length;
}
function Ke(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const Dn = {
  type: 0,
  value: ""
}, Gn = /[a-zA-Z0-9_]/;
function Ln(e) {
  if (!e)
    return [[]];
  if (e === "/")
    return [[Dn]];
  if (!e.startsWith("/"))
    throw new Error(process.env.NODE_ENV !== "production" ? `Route paths should start with a "/": "${e}" should be "/${e}".` : `Invalid path "${e}"`);
  function t(h) {
    throw new Error(`ERR (${n})/"${i}": ${h}`);
  }
  let n = 0, o = n;
  const s = [];
  let d;
  function f() {
    d && s.push(d), d = [];
  }
  let p = 0, a, i = "", l = "";
  function r() {
    i && (n === 0 ? d.push({
      type: 0,
      value: i
    }) : n === 1 || n === 2 || n === 3 ? (d.length > 1 && (a === "*" || a === "+") && t(`A repeatable param (${i}) must be alone in its segment. eg: '/:ids+.`), d.push({
      type: 1,
      value: i,
      regexp: l,
      repeatable: a === "*" || a === "+",
      optional: a === "*" || a === "?"
    })) : t("Invalid state to consume buffer"), i = "");
  }
  function c() {
    i += a;
  }
  for (; p < e.length; ) {
    if (a = e[p++], a === "\\" && n !== 2) {
      o = n, n = 4;
      continue;
    }
    switch (n) {
      case 0:
        a === "/" ? (i && r(), f()) : a === ":" ? (r(), n = 1) : c();
        break;
      case 4:
        c(), n = o;
        break;
      case 1:
        a === "(" ? n = 2 : Gn.test(a) ? c() : (r(), n = 0, a !== "*" && a !== "?" && a !== "+" && p--);
        break;
      case 2:
        a === ")" ? l[l.length - 1] == "\\" ? l = l.slice(0, -1) + a : n = 3 : l += a;
        break;
      case 3:
        r(), n = 0, a !== "*" && a !== "?" && a !== "+" && p--, l = "";
        break;
      default:
        t("Unknown state");
        break;
    }
  }
  return n === 2 && t(`Unfinished custom RegExp for param "${i}"`), r(), f(), s;
}
function jn(e, t, n) {
  const o = Tn(Ln(e.path), n);
  if (process.env.NODE_ENV !== "production") {
    const d = /* @__PURE__ */ new Set();
    for (const f of o.keys)
      d.has(f.name) && w(`Found duplicated params with name "${f.name}" for path "${e.path}". Only the last one will be available on "$route.params".`), d.add(f.name);
  }
  const s = O(o, {
    record: e,
    parent: t,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });
  return t && !s.record.aliasOf == !t.record.aliasOf && t.children.push(s), s;
}
function Un(e, t) {
  const n = [], o = /* @__PURE__ */ new Map();
  t = Fe({ strict: !1, end: !0, sensitive: !1 }, t);
  function s(r) {
    return o.get(r);
  }
  function d(r, c, h) {
    const y = !h, E = ze(r);
    process.env.NODE_ENV !== "production" && Kn(E, c), E.aliasOf = h && h.record;
    const R = Fe(t, r), A = [E];
    if ("alias" in r) {
      const I = typeof r.alias == "string" ? [r.alias] : r.alias;
      for (const L of I)
        A.push(
          // we need to normalize again to ensure the `mods` property
          // being non enumerable
          ze(O({}, E, {
            // this allows us to hold a copy of the `components` option
            // so that async components cache is hold on the original record
            components: h ? h.record.components : E.components,
            path: L,
            // we might be the child of an alias
            aliasOf: h ? h.record : E
            // the aliases are always of the same kind as the original since they
            // are defined on the same record
          }))
        );
    }
    let N, k;
    for (const I of A) {
      const { path: L } = I;
      if (c && L[0] !== "/") {
        const q = c.record.path, V = q[q.length - 1] === "/" ? "" : "/";
        I.path = c.record.path + (L && V + L);
      }
      if (process.env.NODE_ENV !== "production" && I.path === "*")
        throw new Error(`Catch all routes ("*") must now be defined using a param with a custom regexp.
See more at https://router.vuejs.org/guide/migration/#Removed-star-or-catch-all-routes.`);
      if (N = jn(I, c, R), process.env.NODE_ENV !== "production" && c && L[0] === "/" && zn(N, c), h ? (h.alias.push(N), process.env.NODE_ENV !== "production" && qn(h, N)) : (k = k || N, k !== N && k.alias.push(N), y && r.name && !Qe(N) && (process.env.NODE_ENV !== "production" && Wn(r, c), f(r.name))), gt(N) && a(N), E.children) {
        const q = E.children;
        for (let V = 0; V < q.length; V++)
          d(q[V], N, h && h.children[V]);
      }
      h = h || N;
    }
    return k ? () => {
      f(k);
    } : oe;
  }
  function f(r) {
    if (mt(r)) {
      const c = o.get(r);
      c && (o.delete(r), n.splice(n.indexOf(c), 1), c.children.forEach(f), c.alias.forEach(f));
    } else {
      const c = n.indexOf(r);
      c > -1 && (n.splice(c, 1), r.record.name && o.delete(r.record.name), r.children.forEach(f), r.alias.forEach(f));
    }
  }
  function p() {
    return n;
  }
  function a(r) {
    const c = Qn(r, n);
    n.splice(c, 0, r), r.record.name && !Qe(r) && o.set(r.record.name, r);
  }
  function i(r, c) {
    let h, y = {}, E, R;
    if ("name" in r && r.name) {
      if (h = o.get(r.name), !h)
        throw Z(1, {
          location: r
        });
      if (process.env.NODE_ENV !== "production") {
        const k = Object.keys(r.params || {}).filter((I) => !h.keys.find((L) => L.name === I));
        k.length && w(`Discarded invalid param(s) "${k.join('", "')}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`);
      }
      R = h.record.name, y = O(
        // paramsFromLocation is a new object
        We(
          c.params,
          // only keep params that exist in the resolved location
          // only keep optional params coming from a parent record
          h.keys.filter((k) => !k.optional).concat(h.parent ? h.parent.keys.filter((k) => k.optional) : []).map((k) => k.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        r.params && We(r.params, h.keys.map((k) => k.name))
      ), E = h.stringify(y);
    } else if (r.path != null)
      E = r.path, process.env.NODE_ENV !== "production" && !E.startsWith("/") && w(`The Matcher cannot resolve relative paths but received "${E}". Unless you directly called \`matcher.resolve("${E}")\`, this is probably a bug in vue-router. Please open an issue at https://github.com/vuejs/router/issues/new/choose.`), h = n.find((k) => k.re.test(E)), h && (y = h.parse(E), R = h.record.name);
    else {
      if (h = c.name ? o.get(c.name) : n.find((k) => k.re.test(c.path)), !h)
        throw Z(1, {
          location: r,
          currentLocation: c
        });
      R = h.record.name, y = O({}, c.params, r.params), E = h.stringify(y);
    }
    const A = [];
    let N = h;
    for (; N; )
      A.unshift(N.record), N = N.parent;
    return {
      name: R,
      path: E,
      params: y,
      matched: A,
      meta: Hn(A)
    };
  }
  e.forEach((r) => d(r));
  function l() {
    n.length = 0, o.clear();
  }
  return {
    addRoute: d,
    resolve: i,
    removeRoute: f,
    clearRoutes: l,
    getRoutes: p,
    getRecordMatcher: s
  };
}
function We(e, t) {
  const n = {};
  for (const o of t)
    o in e && (n[o] = e[o]);
  return n;
}
function ze(e) {
  const t = {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: e.aliasOf,
    beforeEnter: e.beforeEnter,
    props: Bn(e),
    children: e.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    // must be declared afterwards
    // mods: {},
    components: "components" in e ? e.components || null : e.component && { default: e.component }
  };
  return Object.defineProperty(t, "mods", {
    value: {}
  }), t;
}
function Bn(e) {
  const t = {}, n = e.props || !1;
  if ("component" in e)
    t.default = n;
  else
    for (const o in e.components)
      t[o] = typeof n == "object" ? n[o] : n;
  return t;
}
function Qe(e) {
  for (; e; ) {
    if (e.record.aliasOf)
      return !0;
    e = e.parent;
  }
  return !1;
}
function Hn(e) {
  return e.reduce((t, n) => O(t, n.meta), {});
}
function Fe(e, t) {
  const n = {};
  for (const o in e)
    n[o] = o in t ? t[o] : e[o];
  return n;
}
function Re(e, t) {
  return e.name === t.name && e.optional === t.optional && e.repeatable === t.repeatable;
}
function qn(e, t) {
  for (const n of e.keys)
    if (!n.optional && !t.keys.find(Re.bind(null, n)))
      return w(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
  for (const n of t.keys)
    if (!n.optional && !e.keys.find(Re.bind(null, n)))
      return w(`Alias "${t.record.path}" and the original record: "${e.record.path}" must have the exact same param named "${n.name}"`);
}
function Kn(e, t) {
  t && t.record.name && !e.name && !e.path && w(`The route named "${String(t.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
}
function Wn(e, t) {
  for (let n = t; n; n = n.parent)
    if (n.record.name === e.name)
      throw new Error(`A route named "${String(e.name)}" has been added as a ${t === n ? "child" : "descendant"} of a route with the same name. Route names must be unique and a nested route cannot use the same name as an ancestor.`);
}
function zn(e, t) {
  for (const n of t.keys)
    if (!e.keys.find(Re.bind(null, n)))
      return w(`Absolute path "${e.record.path}" must have the exact same param named "${n.name}" as its parent "${t.record.path}".`);
}
function Qn(e, t) {
  let n = 0, o = t.length;
  for (; n !== o; ) {
    const d = n + o >> 1;
    vt(e, t[d]) < 0 ? o = d : n = d + 1;
  }
  const s = Fn(e);
  return s && (o = t.lastIndexOf(s, o - 1), process.env.NODE_ENV !== "production" && o < 0 && w(`Finding ancestor route "${s.record.path}" failed for "${e.record.path}"`)), o;
}
function Fn(e) {
  let t = e;
  for (; t = t.parent; )
    if (gt(t) && vt(e, t) === 0)
      return t;
}
function gt({ record: e }) {
  return !!(e.name || e.components && Object.keys(e.components).length || e.redirect);
}
function Jn(e) {
  const t = {};
  if (e === "" || e === "?")
    return t;
  const o = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let s = 0; s < o.length; ++s) {
    const d = o[s].replace(ct, " "), f = d.indexOf("="), p = X(f < 0 ? d : d.slice(0, f)), a = f < 0 ? null : X(d.slice(f + 1));
    if (p in t) {
      let i = t[p];
      T(i) || (i = t[p] = [i]), i.push(a);
    } else
      t[p] = a;
  }
  return t;
}
function Je(e) {
  let t = "";
  for (let n in e) {
    const o = e[n];
    if (n = dn(n), o == null) {
      o !== void 0 && (t += (t.length ? "&" : "") + n);
      continue;
    }
    (T(o) ? o.map((d) => d && Se(d)) : [o && Se(o)]).forEach((d) => {
      d !== void 0 && (t += (t.length ? "&" : "") + n, d != null && (t += "=" + d));
    });
  }
  return t;
}
function Yn(e) {
  const t = {};
  for (const n in e) {
    const o = e[n];
    o !== void 0 && (t[n] = T(o) ? o.map((s) => s == null ? null : "" + s) : o == null ? o : "" + o);
  }
  return t;
}
const Xn = Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : ""), Ye = Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : ""), xe = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), _t = Symbol(process.env.NODE_ENV !== "production" ? "route location" : ""), Oe = Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
function te() {
  let e = [];
  function t(o) {
    return e.push(o), () => {
      const s = e.indexOf(o);
      s > -1 && e.splice(s, 1);
    };
  }
  function n() {
    e = [];
  }
  return {
    add: t,
    list: () => e.slice(),
    reset: n
  };
}
function W(e, t, n, o, s, d = (f) => f()) {
  const f = o && // name is defined if record is because of the function overload
  (o.enterCallbacks[s] = o.enterCallbacks[s] || []);
  return () => new Promise((p, a) => {
    const i = (c) => {
      c === !1 ? a(Z(4, {
        from: n,
        to: t
      })) : c instanceof Error ? a(c) : ce(c) ? a(Z(2, {
        from: t,
        to: c
      })) : (f && // since enterCallbackArray is truthy, both record and name also are
      o.enterCallbacks[s] === f && typeof c == "function" && f.push(c), p());
    }, l = d(() => e.call(o && o.instances[s], t, n, process.env.NODE_ENV !== "production" ? Zn(i, t, n) : i));
    let r = Promise.resolve(l);
    if (e.length < 3 && (r = r.then(i)), process.env.NODE_ENV !== "production" && e.length > 2) {
      const c = `The "next" callback was never called inside of ${e.name ? '"' + e.name + '"' : ""}:
${e.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
      if (typeof l == "object" && "then" in l)
        r = r.then((h) => i._called ? h : (w(c), Promise.reject(new Error("Invalid navigation guard"))));
      else if (l !== void 0 && !i._called) {
        w(c), a(new Error("Invalid navigation guard"));
        return;
      }
    }
    r.catch((c) => a(c));
  });
}
function Zn(e, t, n) {
  let o = 0;
  return function() {
    o++ === 1 && w(`The "next" callback was called more than once in one navigation guard when going from "${n.fullPath}" to "${t.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`), e._called = !0, o === 1 && e.apply(null, arguments);
  };
}
function we(e, t, n, o, s = (d) => d()) {
  const d = [];
  for (const f of e) {
    process.env.NODE_ENV !== "production" && !f.components && !f.children.length && w(`Record with path "${f.path}" is either missing a "component(s)" or "children" property.`);
    for (const p in f.components) {
      let a = f.components[p];
      if (process.env.NODE_ENV !== "production") {
        if (!a || typeof a != "object" && typeof a != "function")
          throw w(`Component "${p}" in record with path "${f.path}" is not a valid component. Received "${String(a)}".`), new Error("Invalid route component");
        if ("then" in a) {
          w(`Component "${p}" in record with path "${f.path}" is a Promise instead of a function that returns a Promise. Did you write "import('./MyPage.vue')" instead of "() => import('./MyPage.vue')" ? This will break in production if not fixed.`);
          const i = a;
          a = () => i;
        } else a.__asyncLoader && // warn only once per component
        !a.__warnedDefineAsync && (a.__warnedDefineAsync = !0, w(`Component "${p}" in record with path "${f.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`));
      }
      if (!(t !== "beforeRouteEnter" && !f.instances[p]))
        if (at(a)) {
          const l = (a.__vccOpts || a)[t];
          l && d.push(W(l, n, o, f, p, s));
        } else {
          let i = a();
          process.env.NODE_ENV !== "production" && !("catch" in i) && (w(`Component "${p}" in record with path "${f.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`), i = Promise.resolve(i)), d.push(() => i.then((l) => {
            if (!l)
              throw new Error(`Couldn't resolve component "${p}" at "${f.path}"`);
            const r = Zt(l) ? l.default : l;
            f.mods[p] = l, f.components[p] = r;
            const h = (r.__vccOpts || r)[t];
            return h && W(h, n, o, f, p, s)();
          }));
        }
    }
  }
  return d;
}
function Xe(e) {
  const t = Y(xe), n = Y(_t);
  let o = !1, s = null;
  const d = D(() => {
    const l = G(e.to);
    return process.env.NODE_ENV !== "production" && (!o || l !== s) && (ce(l) || (o ? w(`Invalid value for prop "to" in useLink()
- to:`, l, `
- previous to:`, s, `
- props:`, e) : w(`Invalid value for prop "to" in useLink()
- to:`, l, `
- props:`, e)), s = l, o = !0), t.resolve(l);
  }), f = D(() => {
    const { matched: l } = d.value, { length: r } = l, c = l[r - 1], h = n.matched;
    if (!c || !h.length)
      return -1;
    const y = h.findIndex(z.bind(null, c));
    if (y > -1)
      return y;
    const E = Ze(l[r - 2]);
    return (
      // we are dealing with nested routes
      r > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      Ze(c) === E && // avoid comparing the child with its parent
      h[h.length - 1].path !== E ? h.findIndex(z.bind(null, l[r - 2])) : y
    );
  }), p = D(() => f.value > -1 && ro(n.params, d.value.params)), a = D(() => f.value > -1 && f.value === n.matched.length - 1 && ht(n.params, d.value.params));
  function i(l = {}) {
    if (oo(l)) {
      const r = t[G(e.replace) ? "replace" : "push"](
        G(e.to)
        // avoid uncaught errors are they are logged anyway
      ).catch(oe);
      return e.viewTransition && typeof document < "u" && "startViewTransition" in document && document.startViewTransition(() => r), r;
    }
    return Promise.resolve();
  }
  if (process.env.NODE_ENV !== "production" && H) {
    const l = st();
    if (l) {
      const r = {
        route: d.value,
        isActive: p.value,
        isExactActive: a.value,
        error: null
      };
      l.__vrl_devtools = l.__vrl_devtools || [], l.__vrl_devtools.push(r), It(() => {
        r.route = d.value, r.isActive = p.value, r.isExactActive = a.value, r.error = ce(G(e.to)) ? null : 'Invalid "to" value';
      }, { flush: "post" });
    }
  }
  return {
    route: d,
    href: D(() => d.value.href),
    isActive: p,
    isExactActive: a,
    navigate: i
  };
}
function eo(e) {
  return e.length === 1 ? e[0] : e;
}
const to = /* @__PURE__ */ Ae({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: !0
    },
    replace: Boolean,
    activeClass: String,
    // inactiveClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    },
    viewTransition: Boolean
  },
  useLink: Xe,
  setup(e, { slots: t }) {
    const n = nt(Xe(e)), { options: o } = Y(xe), s = D(() => ({
      [et(e.activeClass, o.linkActiveClass, "router-link-active")]: n.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [et(e.exactActiveClass, o.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
    }));
    return () => {
      const d = t.default && eo(t.default(n));
      return e.custom ? d : ot("a", {
        "aria-current": n.isExactActive ? e.ariaCurrentValue : null,
        href: n.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: n.navigate,
        class: s.value
      }, d);
    };
  }
}), no = to;
function oo(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(t))
        return;
    }
    return e.preventDefault && e.preventDefault(), !0;
  }
}
function ro(e, t) {
  for (const n in t) {
    const o = t[n], s = e[n];
    if (typeof o == "string") {
      if (o !== s)
        return !1;
    } else if (!T(s) || s.length !== o.length || o.some((d, f) => d !== s[f]))
      return !1;
  }
  return !0;
}
function Ze(e) {
  return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
const et = (e, t, n) => e ?? t ?? n, so = /* @__PURE__ */ Ae({
  name: "RouterView",
  // #674 we manually inherit them
  inheritAttrs: !1,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t, slots: n }) {
    process.env.NODE_ENV !== "production" && ao();
    const o = Y(Oe), s = D(() => e.route || o.value), d = Y(Ye, 0), f = D(() => {
      let i = G(d);
      const { matched: l } = s.value;
      let r;
      for (; (r = l[i]) && !r.components; )
        i++;
      return i;
    }), p = D(() => s.value.matched[f.value]);
    ge(Ye, D(() => f.value + 1)), ge(Xn, p), ge(Oe, s);
    const a = Mt();
    return rt(() => [a.value, p.value, e.name], ([i, l, r], [c, h, y]) => {
      l && (l.instances[r] = i, h && h !== l && i && i === c && (l.leaveGuards.size || (l.leaveGuards = h.leaveGuards), l.updateGuards.size || (l.updateGuards = h.updateGuards))), i && l && // if there is no instance but to and from are the same this might be
      // the first visit
      (!h || !z(l, h) || !c) && (l.enterCallbacks[r] || []).forEach((E) => E(i));
    }, { flush: "post" }), () => {
      const i = s.value, l = e.name, r = p.value, c = r && r.components[l];
      if (!c)
        return tt(n.default, { Component: c, route: i });
      const h = r.props[l], y = h ? h === !0 ? i.params : typeof h == "function" ? h(i) : h : null, R = ot(c, O({}, y, t, {
        onVnodeUnmounted: (A) => {
          A.component.isUnmounted && (r.instances[l] = null);
        },
        ref: a
      }));
      if (process.env.NODE_ENV !== "production" && H && R.ref) {
        const A = {
          depth: f.value,
          name: r.name,
          path: r.path,
          meta: r.meta
        };
        (T(R.ref) ? R.ref.map((k) => k.i) : [R.ref.i]).forEach((k) => {
          k.__vrv_devtools = A;
        });
      }
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        tt(n.default, { Component: R, route: i }) || R
      );
    };
  }
});
function tt(e, t) {
  if (!e)
    return null;
  const n = e(t);
  return n.length === 1 ? n[0] : n;
}
const io = so;
function ao() {
  const e = st(), t = e.parent && e.parent.type.name, n = e.parent && e.parent.subTree && e.parent.subTree.type;
  if (t && (t === "KeepAlive" || t.includes("Transition")) && typeof n == "object" && n.name === "RouterView") {
    const o = t === "KeepAlive" ? "keep-alive" : "transition";
    w(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.
Use slot props instead:

<router-view v-slot="{ Component }">
  <${o}>
    <component :is="Component" />
  </${o}>
</router-view>`);
  }
}
function ne(e, t) {
  const n = O({}, e, {
    // remove variables that can contain vue instances
    matched: e.matched.map((o) => yo(o, ["instances", "children", "aliasOf"]))
  });
  return {
    _custom: {
      type: null,
      readOnly: !0,
      display: e.fullPath,
      tooltip: t,
      value: n
    }
  };
}
function le(e) {
  return {
    _custom: {
      display: e
    }
  };
}
let lo = 0;
function co(e, t, n) {
  if (t.__hasDevtools)
    return;
  t.__hasDevtools = !0;
  const o = lo++;
  Xt({
    id: "org.vuejs.router" + (o ? "." + o : ""),
    label: "Vue Router",
    packageName: "vue-router",
    homepage: "https://router.vuejs.org",
    logo: "https://router.vuejs.org/logo.png",
    componentStateTypes: ["Routing"],
    app: e
  }, (s) => {
    typeof s.now != "function" && console.warn("[Vue Router]: You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), s.on.inspectComponent((l, r) => {
      l.instanceData && l.instanceData.state.push({
        type: "Routing",
        key: "$route",
        editable: !1,
        value: ne(t.currentRoute.value, "Current Route")
      });
    }), s.on.visitComponentTree(({ treeNode: l, componentInstance: r }) => {
      if (r.__vrv_devtools) {
        const c = r.__vrv_devtools;
        l.tags.push({
          label: (c.name ? `${c.name.toString()}: ` : "") + c.path,
          textColor: 0,
          tooltip: "This component is rendered by &lt;router-view&gt;",
          backgroundColor: yt
        });
      }
      T(r.__vrl_devtools) && (r.__devtoolsApi = s, r.__vrl_devtools.forEach((c) => {
        let h = c.route.path, y = bt, E = "", R = 0;
        c.error ? (h = c.error, y = mo, R = vo) : c.isExactActive ? (y = wt, E = "This is exactly active") : c.isActive && (y = Et, E = "This link is active"), l.tags.push({
          label: h,
          textColor: R,
          tooltip: E,
          backgroundColor: y
        });
      }));
    }), rt(t.currentRoute, () => {
      a(), s.notifyComponentUpdate(), s.sendInspectorTree(p), s.sendInspectorState(p);
    });
    const d = "router:navigations:" + o;
    s.addTimelineLayer({
      id: d,
      label: `Router${o ? " " + o : ""} Navigations`,
      color: 4237508
    }), t.onError((l, r) => {
      s.addTimelineEvent({
        layerId: d,
        event: {
          title: "Error during Navigation",
          subtitle: r.fullPath,
          logType: "error",
          time: s.now(),
          data: { error: l },
          groupId: r.meta.__navigationId
        }
      });
    });
    let f = 0;
    t.beforeEach((l, r) => {
      const c = {
        guard: le("beforeEach"),
        from: ne(r, "Current Location during this navigation"),
        to: ne(l, "Target location")
      };
      Object.defineProperty(l.meta, "__navigationId", {
        value: f++
      }), s.addTimelineEvent({
        layerId: d,
        event: {
          time: s.now(),
          title: "Start of navigation",
          subtitle: l.fullPath,
          data: c,
          groupId: l.meta.__navigationId
        }
      });
    }), t.afterEach((l, r, c) => {
      const h = {
        guard: le("afterEach")
      };
      c ? (h.failure = {
        _custom: {
          type: Error,
          readOnly: !0,
          display: c ? c.message : "",
          tooltip: "Navigation Failure",
          value: c
        }
      }, h.status = le("❌")) : h.status = le("✅"), h.from = ne(r, "Current Location during this navigation"), h.to = ne(l, "Target location"), s.addTimelineEvent({
        layerId: d,
        event: {
          title: "End of navigation",
          subtitle: l.fullPath,
          time: s.now(),
          data: h,
          logType: c ? "warning" : "default",
          groupId: l.meta.__navigationId
        }
      });
    });
    const p = "router-inspector:" + o;
    s.addInspector({
      id: p,
      label: "Routes" + (o ? " " + o : ""),
      icon: "book",
      treeFilterPlaceholder: "Search routes"
    });
    function a() {
      if (!i)
        return;
      const l = i;
      let r = n.getRoutes().filter((c) => !c.parent || // these routes have a parent with no component which will not appear in the view
      // therefore we still need to include them
      !c.parent.record.components);
      r.forEach(kt), l.filter && (r = r.filter((c) => (
        // save matches state based on the payload
        Pe(c, l.filter.toLowerCase())
      ))), r.forEach((c) => Nt(c, t.currentRoute.value)), l.rootNodes = r.map(St);
    }
    let i;
    s.on.getInspectorTree((l) => {
      i = l, l.app === e && l.inspectorId === p && a();
    }), s.on.getInspectorState((l) => {
      if (l.app === e && l.inspectorId === p) {
        const c = n.getRoutes().find((h) => h.record.__vd_id === l.nodeId);
        c && (l.state = {
          options: fo(c)
        });
      }
    }), s.sendInspectorTree(p), s.sendInspectorState(p);
  });
}
function uo(e) {
  return e.optional ? e.repeatable ? "*" : "?" : e.repeatable ? "+" : "";
}
function fo(e) {
  const { record: t } = e, n = [
    { editable: !1, key: "path", value: t.path }
  ];
  return t.name != null && n.push({
    editable: !1,
    key: "name",
    value: t.name
  }), n.push({ editable: !1, key: "regexp", value: e.re }), e.keys.length && n.push({
    editable: !1,
    key: "keys",
    value: {
      _custom: {
        type: null,
        readOnly: !0,
        display: e.keys.map((o) => `${o.name}${uo(o)}`).join(" "),
        tooltip: "Param keys",
        value: e.keys
      }
    }
  }), t.redirect != null && n.push({
    editable: !1,
    key: "redirect",
    value: t.redirect
  }), e.alias.length && n.push({
    editable: !1,
    key: "aliases",
    value: e.alias.map((o) => o.record.path)
  }), Object.keys(e.record.meta).length && n.push({
    editable: !1,
    key: "meta",
    value: e.record.meta
  }), n.push({
    key: "score",
    editable: !1,
    value: {
      _custom: {
        type: null,
        readOnly: !0,
        display: e.score.map((o) => o.join(", ")).join(" | "),
        tooltip: "Score used to sort routes",
        value: e.score
      }
    }
  }), n;
}
const yt = 15485081, Et = 2450411, wt = 8702998, ho = 2282478, bt = 16486972, po = 6710886, mo = 16704226, vo = 12131356;
function St(e) {
  const t = [], { record: n } = e;
  n.name != null && t.push({
    label: String(n.name),
    textColor: 0,
    backgroundColor: ho
  }), n.aliasOf && t.push({
    label: "alias",
    textColor: 0,
    backgroundColor: bt
  }), e.__vd_match && t.push({
    label: "matches",
    textColor: 0,
    backgroundColor: yt
  }), e.__vd_exactActive && t.push({
    label: "exact",
    textColor: 0,
    backgroundColor: wt
  }), e.__vd_active && t.push({
    label: "active",
    textColor: 0,
    backgroundColor: Et
  }), n.redirect && t.push({
    label: typeof n.redirect == "string" ? `redirect: ${n.redirect}` : "redirects",
    textColor: 16777215,
    backgroundColor: po
  });
  let o = n.__vd_id;
  return o == null && (o = String(go++), n.__vd_id = o), {
    id: o,
    label: n.path,
    tags: t,
    children: e.children.map(St)
  };
}
let go = 0;
const _o = /^\/(.*)\/([a-z]*)$/;
function Nt(e, t) {
  const n = t.matched.length && z(t.matched[t.matched.length - 1], e.record);
  e.__vd_exactActive = e.__vd_active = n, n || (e.__vd_active = t.matched.some((o) => z(o, e.record))), e.children.forEach((o) => Nt(o, t));
}
function kt(e) {
  e.__vd_match = !1, e.children.forEach(kt);
}
function Pe(e, t) {
  const n = String(e.re).match(_o);
  if (e.__vd_match = !1, !n || n.length < 3)
    return !1;
  if (new RegExp(n[1].replace(/\$$/, ""), n[2]).test(t))
    return e.children.forEach((f) => Pe(f, t)), e.record.path !== "/" || t === "/" ? (e.__vd_match = e.re.test(t), !0) : !1;
  const s = e.record.path.toLowerCase(), d = X(s);
  return !t.startsWith("/") && (d.includes(t) || s.includes(t)) || d.startsWith(t) || s.startsWith(t) || e.record.name && String(e.record.name).includes(t) ? !0 : e.children.some((f) => Pe(f, t));
}
function yo(e, t) {
  const n = {};
  for (const o in e)
    t.includes(o) || (n[o] = e[o]);
  return n;
}
function Eo(e) {
  const t = Un(e.routes, e), n = e.parseQuery || Jn, o = e.stringifyQuery || Je, s = e.history;
  if (process.env.NODE_ENV !== "production" && !s)
    throw new Error('Provide the "history" option when calling "createRouter()": https://router.vuejs.org/api/interfaces/RouterOptions.html#history');
  const d = te(), f = te(), p = te(), a = xt(K);
  let i = K;
  H && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const l = ye.bind(null, (u) => "" + u), r = ye.bind(null, hn), c = (
    // @ts-expect-error: intentionally avoid the type check
    ye.bind(null, X)
  );
  function h(u, g) {
    let v, _;
    return mt(u) ? (v = t.getRecordMatcher(u), process.env.NODE_ENV !== "production" && !v && w(`Parent route "${String(u)}" not found when adding child route`, g), _ = g) : _ = u, t.addRoute(_, v);
  }
  function y(u) {
    const g = t.getRecordMatcher(u);
    g ? t.removeRoute(g) : process.env.NODE_ENV !== "production" && w(`Cannot remove non-existent route "${String(u)}"`);
  }
  function E() {
    return t.getRoutes().map((u) => u.record);
  }
  function R(u) {
    return !!t.getRecordMatcher(u);
  }
  function A(u, g) {
    if (g = O({}, g || a.value), typeof u == "string") {
      const b = Ee(n, u, g.path), C = t.resolve({ path: b.path }, g), Q = s.createHref(b.fullPath);
      return process.env.NODE_ENV !== "production" && (Q.startsWith("//") ? w(`Location "${u}" resolved to "${Q}". A resolved location cannot start with multiple slashes.`) : C.matched.length || w(`No match found for location with path "${u}"`)), O(b, C, {
        params: c(C.params),
        hash: X(b.hash),
        redirectedFrom: void 0,
        href: Q
      });
    }
    if (process.env.NODE_ENV !== "production" && !ce(u))
      return w(`router.resolve() was passed an invalid location. This will fail in production.
- Location:`, u), A({});
    let v;
    if (u.path != null)
      process.env.NODE_ENV !== "production" && "params" in u && !("name" in u) && // @ts-expect-error: the type is never
      Object.keys(u.params).length && w(`Path "${u.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`), v = O({}, u, {
        path: Ee(n, u.path, g.path).path
      });
    else {
      const b = O({}, u.params);
      for (const C in b)
        b[C] == null && delete b[C];
      v = O({}, u, {
        params: r(b)
      }), g.params = r(g.params);
    }
    const _ = t.resolve(v, g), P = u.hash || "";
    process.env.NODE_ENV !== "production" && P && !P.startsWith("#") && w(`A \`hash\` should always start with the character "#". Replace "${P}" with "#${P}".`), _.params = l(c(_.params));
    const x = vn(o, O({}, u, {
      hash: un(P),
      path: _.path
    })), S = s.createHref(x);
    return process.env.NODE_ENV !== "production" && (S.startsWith("//") ? w(`Location "${u}" resolved to "${S}". A resolved location cannot start with multiple slashes.`) : _.matched.length || w(`No match found for location with path "${u.path != null ? u.path : u}"`)), O({
      fullPath: x,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash: P,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        o === Je ? Yn(u.query) : u.query || {}
      )
    }, _, {
      redirectedFrom: void 0,
      href: S
    });
  }
  function N(u) {
    return typeof u == "string" ? Ee(n, u, a.value.path) : O({}, u);
  }
  function k(u, g) {
    if (i !== u)
      return Z(8, {
        from: g,
        to: u
      });
  }
  function I(u) {
    return V(u);
  }
  function L(u) {
    return I(O(N(u), { replace: !0 }));
  }
  function q(u) {
    const g = u.matched[u.matched.length - 1];
    if (g && g.redirect) {
      const { redirect: v } = g;
      let _ = typeof v == "function" ? v(u) : v;
      if (typeof _ == "string" && (_ = _.includes("?") || _.includes("#") ? _ = N(_) : (
        // force empty params
        { path: _ }
      ), _.params = {}), process.env.NODE_ENV !== "production" && _.path == null && !("name" in _))
        throw w(`Invalid redirect found:
${JSON.stringify(_, null, 2)}
 when navigating to "${u.fullPath}". A redirect must contain a name or path. This will break in production.`), new Error("Invalid redirect");
      return O({
        query: u.query,
        hash: u.hash,
        // avoid transferring params if the redirect has a path
        params: _.path != null ? {} : u.params
      }, _);
    }
  }
  function V(u, g) {
    const v = i = A(u), _ = a.value, P = u.state, x = u.force, S = u.replace === !0, b = q(v);
    if (b)
      return V(
        O(N(b), {
          state: typeof b == "object" ? O({}, P, b.state) : P,
          force: x,
          replace: S
        }),
        // keep original redirectedFrom if it exists
        g || v
      );
    const C = v;
    C.redirectedFrom = g;
    let Q;
    return !x && Le(o, _, v) && (Q = Z(16, { to: C, from: _ }), Ve(
      _,
      _,
      // this is a push, the only way for it to be triggered from a
      // history.listen is with a redirect, which makes it become a push
      !0,
      // This cannot be the first navigation because the initial location
      // cannot be manually navigated to
      !1
    )), (Q ? Promise.resolve(Q) : $e(C, _)).catch((M) => j(M) ? (
      // navigation redirects still mark the router as ready
      j(
        M,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? M : pe(M)
    ) : (
      // reject any unknown error
      he(M, C, _)
    )).then((M) => {
      if (M) {
        if (j(
          M,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        ))
          return process.env.NODE_ENV !== "production" && // we are redirecting to the same location we were already at
          Le(o, A(M.to), C) && // and we have done it a couple of times
          g && // @ts-expect-error: added only in dev
          (g._count = g._count ? (
            // @ts-expect-error
            g._count + 1
          ) : 1) > 30 ? (w(`Detected a possibly infinite redirection in a navigation guard when going from "${_.fullPath}" to "${C.fullPath}". Aborting to avoid a Stack Overflow.
 Are you always returning a new location within a navigation guard? That would lead to this error. Only return when redirecting or aborting, that should fix this. This might break in production if not fixed.`), Promise.reject(new Error("Infinite redirect in navigation guard"))) : V(
            // keep options
            O({
              // preserve an existing replacement but allow the redirect to override it
              replace: S
            }, N(M.to), {
              state: typeof M.to == "object" ? O({}, P, M.to.state) : P,
              force: x
            }),
            // preserve the original redirectedFrom if any
            g || C
          );
      } else
        M = Ie(C, _, !0, S, P);
      return Me(C, _, M), M;
    });
  }
  function Rt(u, g) {
    const v = k(u, g);
    return v ? Promise.reject(v) : Promise.resolve();
  }
  function de(u) {
    const g = ae.values().next().value;
    return g && typeof g.runWithContext == "function" ? g.runWithContext(u) : u();
  }
  function $e(u, g) {
    let v;
    const [_, P, x] = wo(u, g);
    v = we(_.reverse(), "beforeRouteLeave", u, g);
    for (const b of _)
      b.leaveGuards.forEach((C) => {
        v.push(W(C, u, g));
      });
    const S = Rt.bind(null, u, g);
    return v.push(S), F(v).then(() => {
      v = [];
      for (const b of d.list())
        v.push(W(b, u, g));
      return v.push(S), F(v);
    }).then(() => {
      v = we(P, "beforeRouteUpdate", u, g);
      for (const b of P)
        b.updateGuards.forEach((C) => {
          v.push(W(C, u, g));
        });
      return v.push(S), F(v);
    }).then(() => {
      v = [];
      for (const b of x)
        if (b.beforeEnter)
          if (T(b.beforeEnter))
            for (const C of b.beforeEnter)
              v.push(W(C, u, g));
          else
            v.push(W(b.beforeEnter, u, g));
      return v.push(S), F(v);
    }).then(() => (u.matched.forEach((b) => b.enterCallbacks = {}), v = we(x, "beforeRouteEnter", u, g, de), v.push(S), F(v))).then(() => {
      v = [];
      for (const b of f.list())
        v.push(W(b, u, g));
      return v.push(S), F(v);
    }).catch((b) => j(
      b,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? b : Promise.reject(b));
  }
  function Me(u, g, v) {
    p.list().forEach((_) => de(() => _(u, g, v)));
  }
  function Ie(u, g, v, _, P) {
    const x = k(u, g);
    if (x)
      return x;
    const S = g === K, b = H ? history.state : {};
    v && (_ || S ? s.replace(u.fullPath, O({
      scroll: S && b && b.scroll
    }, P)) : s.push(u.fullPath, P)), a.value = u, Ve(u, g, v, S), pe();
  }
  let ee;
  function Ot() {
    ee || (ee = s.listen((u, g, v) => {
      if (!De.listening)
        return;
      const _ = A(u), P = q(_);
      if (P) {
        V(O(P, { replace: !0, force: !0 }), _).catch(oe);
        return;
      }
      i = _;
      const x = a.value;
      H && Nn(Ue(x.fullPath, v.delta), ue()), $e(_, x).catch((S) => j(
        S,
        12
        /* ErrorTypes.NAVIGATION_CANCELLED */
      ) ? S : j(
        S,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? (V(
        O(N(S.to), {
          force: !0
        }),
        _
        // avoid an uncaught rejection, let push call triggerError
      ).then((b) => {
        j(
          b,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && !v.delta && v.type === se.pop && s.go(-1, !1);
      }).catch(oe), Promise.reject()) : (v.delta && s.go(-v.delta, !1), he(S, _, x))).then((S) => {
        S = S || Ie(
          // after navigation, all matched components are resolved
          _,
          x,
          !1
        ), S && (v.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
        // entry while a different route is displayed
        !j(
          S,
          8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        ) ? s.go(-v.delta, !1) : v.type === se.pop && j(
          S,
          20
          /* ErrorTypes.NAVIGATION_DUPLICATED */
        ) && s.go(-1, !1)), Me(_, x, S);
      }).catch(oe);
    }));
  }
  let fe = te(), Te = te(), ie;
  function he(u, g, v) {
    pe(u);
    const _ = Te.list();
    return _.length ? _.forEach((P) => P(u, g, v)) : (process.env.NODE_ENV !== "production" && w("uncaught error during route navigation:"), console.error(u)), Promise.reject(u);
  }
  function Pt() {
    return ie && a.value !== K ? Promise.resolve() : new Promise((u, g) => {
      fe.add([u, g]);
    });
  }
  function pe(u) {
    return ie || (ie = !u, Ot(), fe.list().forEach(([g, v]) => u ? v(u) : g()), fe.reset()), u;
  }
  function Ve(u, g, v, _) {
    const { scrollBehavior: P } = e;
    if (!H || !P)
      return Promise.resolve();
    const x = !v && kn(Ue(u.fullPath, 0)) || (_ || !v) && history.state && history.state.scroll || null;
    return Tt().then(() => P(u, g, x)).then((S) => S && Sn(S)).catch((S) => he(S, u, g));
  }
  const me = (u) => s.go(u);
  let ve;
  const ae = /* @__PURE__ */ new Set(), De = {
    currentRoute: a,
    listening: !0,
    addRoute: h,
    removeRoute: y,
    clearRoutes: t.clearRoutes,
    hasRoute: R,
    getRoutes: E,
    resolve: A,
    options: e,
    push: I,
    replace: L,
    go: me,
    back: () => me(-1),
    forward: () => me(1),
    beforeEach: d.add,
    beforeResolve: f.add,
    afterEach: p.add,
    onError: Te.add,
    isReady: Pt,
    install(u) {
      const g = this;
      u.component("RouterLink", no), u.component("RouterView", io), u.config.globalProperties.$router = g, Object.defineProperty(u.config.globalProperties, "$route", {
        enumerable: !0,
        get: () => G(a)
      }), H && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !ve && a.value === K && (ve = !0, I(s.location).catch((P) => {
        process.env.NODE_ENV !== "production" && w("Unexpected error when starting the router:", P);
      }));
      const v = {};
      for (const P in K)
        Object.defineProperty(v, P, {
          get: () => a.value[P],
          enumerable: !0
        });
      u.provide(xe, g), u.provide(_t, $t(v)), u.provide(Oe, a);
      const _ = u.unmount;
      ae.add(u), u.unmount = function() {
        ae.delete(u), ae.size < 1 && (i = K, ee && ee(), ee = null, a.value = K, ve = !1, ie = !1), _();
      }, process.env.NODE_ENV !== "production" && H && co(u, g, t);
    }
  };
  function F(u) {
    return u.reduce((g, v) => g.then(() => de(v)), Promise.resolve());
  }
  return De;
}
function wo(e, t) {
  const n = [], o = [], s = [], d = Math.max(t.matched.length, e.matched.length);
  for (let f = 0; f < d; f++) {
    const p = t.matched[f];
    p && (e.matched.find((i) => z(i, p)) ? o.push(p) : n.push(p));
    const a = e.matched[f];
    a && (t.matched.find((i) => z(i, a)) || s.push(a));
  }
  return [n, o, s];
}
const bo = Symbol("supabase");
function So() {
  const e = Y(bo, null);
  if (!e) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return e;
}
function No(e) {
  const t = So(), n = ["nlvMargin", e], o = Ut(), s = Bt({
    queryKey: n,
    queryFn: async () => {
      const { data: p, error: a } = await t.schema("hf").rpc("get_nlv_margin", {
        p_limit: 10
      });
      if (a) throw a;
      return p || [];
    },
    staleTime: 6e4
  }), d = t.channel("netliquidation_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "netliquidation",
      event: "*"
    },
    () => o.invalidateQueries({ queryKey: n })
  ).subscribe(), f = t.channel("maintenance_margin_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "maintenance_margin",
      event: "*"
    },
    () => o.invalidateQueries({ queryKey: n })
  ).subscribe();
  return {
    ...s,
    _cleanup: () => {
      var p, a;
      (p = d == null ? void 0 : d.unsubscribe) == null || p.call(d), (a = f == null ? void 0 : f.unsubscribe) == null || a.call(f);
    }
  };
}
const ko = { class: "dashboard-container" }, Ro = {
  key: 0,
  class: "loading"
}, Oo = {
  key: 1,
  class: "error"
}, Po = { key: 2 }, Ao = { class: "metric-block" }, Co = {
  key: 0,
  class: "metric-row all-accounts-row"
}, xo = { class: "row-header" }, $o = { class: "row-content" }, Mo = { class: "metric-column" }, Io = { class: "metric-value" }, To = { class: "metric-value" }, Vo = { class: "metric-column" }, Do = { class: "metric-value" }, Go = { class: "metric-value" }, Lo = { class: "row-header-button-container" }, jo = { class: "row-header" }, Uo = ["onClick"], Bo = { class: "row-content" }, Ho = { class: "metric-column" }, qo = { class: "metric-value" }, Ko = { class: "metric-value" }, Wo = { class: "metric-column" }, zo = { class: "metric-value" }, Qo = { class: "metric-value" }, Fo = {
  key: 0,
  class: "calculation-breakdown"
}, Jo = { class: "breakdown-columns" }, Yo = { class: "breakdown-stage stage-1" }, Xo = { class: "stage-item" }, Zo = { class: "item-value" }, er = { class: "formula" }, tr = { class: "stage-item" }, nr = { class: "item-value" }, or = { class: "formula" }, rr = { class: "stage-item" }, sr = { class: "item-value" }, ir = { class: "formula" }, ar = { class: "stage-item" }, lr = { class: "item-value" }, cr = { class: "formula" }, ur = { class: "breakdown-stage stage-2" }, dr = { class: "stage-item" }, fr = { class: "item-value" }, hr = { class: "formula" }, pr = { class: "stage-item" }, mr = { class: "item-value" }, vr = { class: "formula" }, gr = { class: "stage-item" }, _r = { class: "item-value" }, yr = { class: "formula" }, Er = { class: "stage-item" }, wr = { class: "item-value" }, br = { class: "formula" }, Sr = /* @__PURE__ */ Ae({
  __name: "Margin",
  setup(e) {
    const t = No(1e4), n = nt({});
    function o(a) {
      return a == null ? "$0" : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(a);
    }
    Vt(() => {
      t._cleanup && t._cleanup();
    });
    function s(a, i, l) {
      const r = 1 - l, c = 1 - i, y = 1 - r * c;
      return a / y;
    }
    const d = D(() => t.data.value ? t.data.value.map((a) => {
      const i = s(a.nlv_val, 0.3, 0.15), l = s(a.nlv_val, 0.3, 0.1), r = i * 30 / 100, c = l * 30 / 100, h = r - a.maintenance_val, y = c - a.maintenance_val, E = h * 100 / 30, R = y * 100 / 30;
      return {
        ...a,
        maxGmvNlvSide: i,
        maxGmvMaintenanceSide: l,
        mkNlvSide: r,
        mkMaintenanceSide: c,
        maintnanceMarginHeadroomNlvSide: h,
        maintnanceMarginHeadroomMaintenanceSide: y,
        addlGmvAllowedNlvSide: E,
        addlGmvAllowedMaintenanceSide: R
      };
    }) : []), f = D(() => {
      if (!d.value) return null;
      const a = d.value.reduce((c, h) => c + (h.nlv_val || 0), 0), i = d.value.reduce((c, h) => c + (h.maintenance_val || 0), 0), l = d.value.reduce((c, h) => c + (h.addlGmvAllowedNlvSide || 0), 0), r = d.value.reduce((c, h) => c + (h.addlGmvAllowedMaintenanceSide || 0), 0);
      return {
        totalNlv: a,
        totalMaintenance: i,
        totalAddlGmvToStopReducing: l,
        totalAddlGmvToStartReducing: r
      };
    });
    function p(a) {
      n[a] = !n[a];
    }
    return (a, i) => {
      var l;
      return B(), U("div", ko, [
        G(t).isLoading.value ? (B(), U("div", Ro, [...i[0] || (i[0] = [
          m("div", { class: "loading-spinner" }, null, -1),
          m("p", null, "Loading the latest metrics...", -1)
        ])])) : G(t).isError.value ? (B(), U("div", Oo, [
          i[1] || (i[1] = m("h2", null, "Error Loading Data", -1)),
          i[2] || (i[2] = m("p", null, "An error occurred while fetching the metrics:", -1)),
          m("pre", null, $(G(t).error.value), 1)
        ])) : G(t).isSuccess.value ? (B(), U("div", Po, [
          m("div", Ao, [
            i[22] || (i[22] = m("div", { class: "block-header" }, [
              m("h2", null, "Margin")
            ], -1)),
            f.value ? (B(), U("div", Co, [
              m("div", xo, "All Accounts (" + $(((l = G(t).data.value) == null ? void 0 : l.length) || 0) + ")", 1),
              m("div", $o, [
                m("div", Mo, [
                  i[3] || (i[3] = m("div", { class: "metric-label" }, "Net liquidation value", -1)),
                  m("div", Io, $(o(f.value.totalNlv)), 1),
                  i[4] || (i[4] = m("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  m("div", To, $(o(f.value.totalAddlGmvToStopReducing)), 1)
                ]),
                m("div", Vo, [
                  i[5] || (i[5] = m("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  m("div", Do, $(o(f.value.totalMaintenance)), 1),
                  i[6] || (i[6] = m("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  m("div", Go, $(o(f.value.totalAddlGmvToStartReducing)), 1)
                ])
              ])
            ])) : _e("", !0),
            (B(!0), U(Dt, null, Gt(d.value, (r, c) => (B(), U("div", {
              key: r.nlv_id,
              class: "metric-row"
            }, [
              m("div", Lo, [
                m("div", jo, "Client" + $(c + 1), 1),
                m("button", {
                  class: Lt(["row-status", r.addlGmvAllowedNlvSide < 0 && r.addlGmvAllowedMaintenanceSide < 0 ? "stage-2-exhausted" : r.addlGmvAllowedNlvSide < 0 ? "stage-1-exhausted" : "ok"]),
                  onClick: (h) => p(r.nlv_id)
                }, $(r.addlGmvAllowedNlvSide < 0 && r.addlGmvAllowedMaintenanceSide < 0 ? "Stage 2 exhausted" : r.addlGmvAllowedNlvSide < 0 ? "Stage 1 exhausted" : "OK"), 11, Uo)
              ]),
              m("div", Bo, [
                m("div", Ho, [
                  i[7] || (i[7] = m("div", { class: "metric-label" }, "NLV", -1)),
                  m("div", qo, $(o(r.nlv_val)), 1),
                  i[8] || (i[8] = m("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  m("div", Ko, $(o(r.addlGmvAllowedNlvSide)), 1)
                ]),
                m("div", Wo, [
                  i[9] || (i[9] = m("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  m("div", zo, $(o(r.maintenance_val)), 1),
                  i[10] || (i[10] = m("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  m("div", Qo, $(o(r.addlGmvAllowedMaintenanceSide)), 1)
                ])
              ]),
              n[r.nlv_id] ? (B(), U("div", Fo, [
                i[21] || (i[21] = m("div", { class: "breakdown-header" }, [
                  m("div", null, "Calculation breakdown:"),
                  m("div", null, "Assumptions: maintenance margin (m) = 30%")
                ], -1)),
                m("div", Jo, [
                  m("div", Yo, [
                    i[15] || (i[15] = m("div", { class: "stage-header" }, "Stage-1 (drop d = 15%)", -1)),
                    m("div", Xo, [
                      i[11] || (i[11] = m("div", { class: "item-label" }, "Max GMV that survives stop-adding threshold", -1)),
                      m("div", Zo, [
                        m("span", er, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + $(o(r.maxGmvNlvSide)), 1)
                      ])
                    ]),
                    m("div", tr, [
                      i[12] || (i[12] = m("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                      m("div", nr, [
                        m("span", or, "Mk = Gmax x m = " + $(o(r.mkNlvSide)), 1)
                      ])
                    ]),
                    m("div", rr, [
                      i[13] || (i[13] = m("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                      m("div", sr, [
                        m("span", ir, "Mk - M = " + $(o(r.maintnanceMarginHeadroomNlvSide)), 1)
                      ])
                    ]),
                    m("div", ar, [
                      i[14] || (i[14] = m("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                      m("div", lr, [
                        m("span", cr, "(Mk - M) / m = " + $(o(r.addlGmvAllowedNlvSide)), 1)
                      ])
                    ])
                  ]),
                  m("div", ur, [
                    i[20] || (i[20] = m("div", { class: "stage-header" }, "Stage-2 (drop d = 10%)", -1)),
                    m("div", dr, [
                      i[16] || (i[16] = m("div", { class: "item-label" }, "Max GMV that survives start-reducing threshold", -1)),
                      m("div", fr, [
                        m("span", hr, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + $(o(r.maxGmvMaintenanceSide)), 1)
                      ])
                    ]),
                    m("div", pr, [
                      i[17] || (i[17] = m("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                      m("div", mr, [
                        m("span", vr, "Mk = Gmax x m = " + $(o(r.mkMaintenanceSide)), 1)
                      ])
                    ]),
                    m("div", gr, [
                      i[18] || (i[18] = m("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                      m("div", _r, [
                        m("span", yr, "Mk - M = " + $(o(r.maintnanceMarginHeadroomMaintenanceSide)), 1)
                      ])
                    ]),
                    m("div", Er, [
                      i[19] || (i[19] = m("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                      m("div", wr, [
                        m("span", br, "(Mk - M) / m = " + $(o(r.addlGmvAllowedMaintenanceSide)), 1)
                      ])
                    ])
                  ])
                ])
              ])) : _e("", !0)
            ]))), 128))
          ])
        ])) : _e("", !0)
      ]);
    };
  }
}), Nr = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, s] of t)
    n[o] = s;
  return n;
}, kr = /* @__PURE__ */ Nr(Sr, [["__scopeId", "data-v-d31f5785"]]), Rr = [
  {
    path: "/",
    name: "Home",
    component: kr
  }
  //   {
  //     path: '/page2',
  //     name: 'Page2',
  //     component: Page2
  //   }
], Or = Eo({
  history: An(),
  routes: Rr
});
async function Pr() {
  const n = await Ht({
    supabaseUrl: "http://127.0.0.1:54321",
    supabaseAnon: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
    query: {
      staleTime: 6e4,
      gcTime: 864e5,
      refetchOnWindowFocus: !1
    }
  });
  jt(qt).use(Or).use(n).mount("#app");
}
Pr();
