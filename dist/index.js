var Ca = Object.defineProperty;
var Ea = (o, e, t) => e in o ? Ca(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var C = (o, e, t) => Ea(o, typeof e != "symbol" ? e + "" : e, t);
import { inject as tr, defineComponent as hn, shallowRef as ir, h as ys, ref as fe, onMounted as Cs, onUnmounted as xa, watch as jt, toRaw as Es, nextTick as je, version as _a, isProxy as sr, reactive as ns, computed as be, onBeforeUnmount as Ra, resolveComponent as ka, createElementBlock as j, openBlock as V, Fragment as Ct, createElementVNode as M, renderList as Ot, normalizeClass as os, toDisplayString as J, createCommentVNode as nt, unref as Pt, createBlock as Ma, withCtx as Ta, createTextVNode as Vn, withModifiers as At, withDirectives as Sa, vModelCheckbox as La, createVNode as Da, normalizeStyle as za } from "vue";
import { useQueryClient as Fa, useQuery as xs } from "@tanstack/vue-query";
import { useSupabase as Oa } from "@y2kfund/core";
class oe {
  constructor(e) {
    this.table = e;
  }
  //////////////////////////////////////////
  /////////////// DataLoad /////////////////
  //////////////////////////////////////////
  reloadData(e, t, i) {
    return this.table.dataLoader.load(e, void 0, void 0, void 0, t, i);
  }
  //////////////////////////////////////////
  ///////////// Localization ///////////////
  //////////////////////////////////////////
  langText() {
    return this.table.modules.localize.getText(...arguments);
  }
  langBind() {
    return this.table.modules.localize.bind(...arguments);
  }
  langLocale() {
    return this.table.modules.localize.getLocale(...arguments);
  }
  //////////////////////////////////////////
  ////////// Inter Table Comms /////////////
  //////////////////////////////////////////
  commsConnections() {
    return this.table.modules.comms.getConnections(...arguments);
  }
  commsSend() {
    return this.table.modules.comms.send(...arguments);
  }
  //////////////////////////////////////////
  //////////////// Layout  /////////////////
  //////////////////////////////////////////
  layoutMode() {
    return this.table.modules.layout.getMode();
  }
  layoutRefresh(e) {
    return this.table.modules.layout.layout(e);
  }
  //////////////////////////////////////////
  /////////////// Event Bus ////////////////
  //////////////////////////////////////////
  subscribe() {
    return this.table.eventBus.subscribe(...arguments);
  }
  unsubscribe() {
    return this.table.eventBus.unsubscribe(...arguments);
  }
  subscribed(e) {
    return this.table.eventBus.subscribed(e);
  }
  subscriptionChange() {
    return this.table.eventBus.subscriptionChange(...arguments);
  }
  dispatch() {
    return this.table.eventBus.dispatch(...arguments);
  }
  chain() {
    return this.table.eventBus.chain(...arguments);
  }
  confirm() {
    return this.table.eventBus.confirm(...arguments);
  }
  dispatchExternal() {
    return this.table.externalEvents.dispatch(...arguments);
  }
  subscribedExternal(e) {
    return this.table.externalEvents.subscribed(e);
  }
  subscriptionChangeExternal() {
    return this.table.externalEvents.subscriptionChange(...arguments);
  }
  //////////////////////////////////////////
  //////////////// Options /////////////////
  //////////////////////////////////////////
  options(e) {
    return this.table.options[e];
  }
  setOption(e, t) {
    return typeof t < "u" && (this.table.options[e] = t), this.table.options[e];
  }
  //////////////////////////////////////////
  /////////// Deprecation Checks ///////////
  //////////////////////////////////////////
  deprecationCheck(e, t, i) {
    return this.table.deprecationAdvisor.check(e, t, i);
  }
  deprecationCheckMsg(e, t) {
    return this.table.deprecationAdvisor.checkMsg(e, t);
  }
  deprecationMsg(e) {
    return this.table.deprecationAdvisor.msg(e);
  }
  //////////////////////////////////////////
  //////////////// Modules /////////////////
  //////////////////////////////////////////
  module(e) {
    return this.table.module(e);
  }
}
class $ {
  static elVisible(e) {
    return !(e.offsetWidth <= 0 && e.offsetHeight <= 0);
  }
  static elOffset(e) {
    var t = e.getBoundingClientRect();
    return {
      top: t.top + window.pageYOffset - document.documentElement.clientTop,
      left: t.left + window.pageXOffset - document.documentElement.clientLeft
    };
  }
  static retrieveNestedData(e, t, i) {
    var s = e ? t.split(e) : [t], n = s.length, r;
    for (let a = 0; a < n && (i = i[s[a]], r = i, !!i); a++)
      ;
    return r;
  }
  static deepClone(e, t, i = []) {
    var s = {}.__proto__, n = [].__proto__;
    t || (t = Object.assign(Array.isArray(e) ? [] : {}, e));
    for (var r in e) {
      let a = e[r], l, h;
      a != null && typeof a == "object" && (a.__proto__ === s || a.__proto__ === n) && (l = i.findIndex((d) => d.subject === a), l > -1 ? t[r] = i[l].copy : (h = Object.assign(Array.isArray(a) ? [] : {}, a), i.unshift({ subject: a, copy: h }), t[r] = this.deepClone(a, h, i)));
    }
    return t;
  }
}
let Pa = class nr extends oe {
  constructor(e, t, i) {
    super(e), this.element = t, this.container = this._lookupContainer(), this.parent = i, this.reversedX = !1, this.childPopup = null, this.blurable = !1, this.blurCallback = null, this.blurEventsBound = !1, this.renderedCallback = null, this.visible = !1, this.hideable = !0, this.element.classList.add("tabulator-popup-container"), this.blurEvent = this.hide.bind(this, !1), this.escEvent = this._escapeCheck.bind(this), this.destroyBinding = this.tableDestroyed.bind(this), this.destroyed = !1;
  }
  tableDestroyed() {
    this.destroyed = !0, this.hide(!0);
  }
  _lookupContainer() {
    var e = this.table.options.popupContainer;
    return typeof e == "string" ? (e = document.querySelector(e), e || console.warn("Menu Error - no container element found matching selector:", this.table.options.popupContainer, "(defaulting to document body)")) : e === !0 && (e = this.table.element), e && !this._checkContainerIsParent(e) && (e = !1, console.warn("Menu Error - container element does not contain this table:", this.table.options.popupContainer, "(defaulting to document body)")), e || (e = document.body), e;
  }
  _checkContainerIsParent(e, t = this.table.element) {
    return e === t ? !0 : t.parentNode ? this._checkContainerIsParent(e, t.parentNode) : !1;
  }
  renderCallback(e) {
    this.renderedCallback = e;
  }
  containerEventCoords(e) {
    var t = !(e instanceof MouseEvent), i = t ? e.touches[0].pageX : e.pageX, s = t ? e.touches[0].pageY : e.pageY;
    if (this.container !== document.body) {
      let n = $.elOffset(this.container);
      i -= n.left, s -= n.top;
    }
    return { x: i, y: s };
  }
  elementPositionCoords(e, t = "right") {
    var i = $.elOffset(e), s, n, r;
    switch (this.container !== document.body && (s = $.elOffset(this.container), i.left -= s.left, i.top -= s.top), t) {
      case "right":
        n = i.left + e.offsetWidth, r = i.top - 1;
        break;
      case "bottom":
        n = i.left, r = i.top + e.offsetHeight;
        break;
      case "left":
        n = i.left, r = i.top - 1;
        break;
      case "top":
        n = i.left, r = i.top;
        break;
      case "center":
        n = i.left + e.offsetWidth / 2, r = i.top + e.offsetHeight / 2;
        break;
    }
    return { x: n, y: r, offset: i };
  }
  show(e, t) {
    var i, s, n, r, a;
    return this.destroyed || this.table.destroyed ? this : (e instanceof HTMLElement ? (n = e, a = this.elementPositionCoords(e, t), r = a.offset, i = a.x, s = a.y) : typeof e == "number" ? (r = { top: 0, left: 0 }, i = e, s = t) : (a = this.containerEventCoords(e), i = a.x, s = a.y, this.reversedX = !1), this.element.style.top = s + "px", this.element.style.left = i + "px", this.container.appendChild(this.element), typeof this.renderedCallback == "function" && this.renderedCallback(), this._fitToScreen(i, s, n, r, t), this.visible = !0, this.subscribe("table-destroy", this.destroyBinding), this.element.addEventListener("mousedown", (l) => {
      l.stopPropagation();
    }), this);
  }
  _fitToScreen(e, t, i, s, n) {
    var r = this.container === document.body ? document.documentElement.scrollTop : this.container.scrollTop;
    (e + this.element.offsetWidth >= this.container.offsetWidth || this.reversedX) && (this.element.style.left = "", i ? this.element.style.right = this.container.offsetWidth - s.left + "px" : this.element.style.right = this.container.offsetWidth - e + "px", this.reversedX = !0);
    let a = Math.max(this.container.offsetHeight, r ? this.container.scrollHeight : 0);
    if (t + this.element.offsetHeight > a)
      if (i)
        switch (n) {
          case "bottom":
            this.element.style.top = parseInt(this.element.style.top) - this.element.offsetHeight - i.offsetHeight - 1 + "px";
            break;
          default:
            this.element.style.top = parseInt(this.element.style.top) - this.element.offsetHeight + i.offsetHeight + 1 + "px";
        }
      else
        this.element.style.height = a + "px";
  }
  isVisible() {
    return this.visible;
  }
  hideOnBlur(e) {
    return this.blurable = !0, this.visible && (setTimeout(() => {
      this.visible && (this.table.rowManager.element.addEventListener("scroll", this.blurEvent), this.subscribe("cell-editing", this.blurEvent), document.body.addEventListener("click", this.blurEvent), document.body.addEventListener("contextmenu", this.blurEvent), document.body.addEventListener("mousedown", this.blurEvent), window.addEventListener("resize", this.blurEvent), document.body.addEventListener("keydown", this.escEvent), this.blurEventsBound = !0);
    }, 100), this.blurCallback = e), this;
  }
  _escapeCheck(e) {
    e.keyCode == 27 && this.hide();
  }
  blockHide() {
    this.hideable = !1;
  }
  restoreHide() {
    this.hideable = !0;
  }
  hide(e = !1) {
    return this.visible && this.hideable && (this.blurable && this.blurEventsBound && (document.body.removeEventListener("keydown", this.escEvent), document.body.removeEventListener("click", this.blurEvent), document.body.removeEventListener("contextmenu", this.blurEvent), document.body.removeEventListener("mousedown", this.blurEvent), window.removeEventListener("resize", this.blurEvent), this.table.rowManager.element.removeEventListener("scroll", this.blurEvent), this.unsubscribe("cell-editing", this.blurEvent), this.blurEventsBound = !1), this.childPopup && this.childPopup.hide(), this.parent && (this.parent.childPopup = null), this.element.parentNode && this.element.parentNode.removeChild(this.element), this.visible = !1, this.blurCallback && !e && this.blurCallback(), this.unsubscribe("table-destroy", this.destroyBinding)), this;
  }
  child(e) {
    return this.childPopup && this.childPopup.hide(), this.childPopup = new nr(this.table, e, this), this.childPopup;
  }
};
class A extends oe {
  constructor(e, t) {
    super(e), this._handler = null;
  }
  initialize() {
  }
  ///////////////////////////////////
  ////// Options Registration ///////
  ///////////////////////////////////
  registerTableOption(e, t) {
    this.table.optionsList.register(e, t);
  }
  registerColumnOption(e, t) {
    this.table.columnManager.optionsList.register(e, t);
  }
  ///////////////////////////////////
  /// Public Function Registration ///
  ///////////////////////////////////
  registerTableFunction(e, t) {
    typeof this.table[e] > "u" ? this.table[e] = (...i) => (this.table.initGuard(e), t(...i)) : console.warn("Unable to bind table function, name already in use", e);
  }
  registerComponentFunction(e, t, i) {
    return this.table.componentFunctionBinder.bind(e, t, i);
  }
  ///////////////////////////////////
  ////////// Data Pipeline //////////
  ///////////////////////////////////
  registerDataHandler(e, t) {
    this.table.rowManager.registerDataPipelineHandler(e, t), this._handler = e;
  }
  registerDisplayHandler(e, t) {
    this.table.rowManager.registerDisplayPipelineHandler(e, t), this._handler = e;
  }
  displayRows(e) {
    var t = this.table.rowManager.displayRows.length - 1, i;
    if (this._handler && (i = this.table.rowManager.displayPipeline.findIndex((s) => s.handler === this._handler), i > -1 && (t = i)), e && (t = t + e), this._handler)
      return t > -1 ? this.table.rowManager.getDisplayRows(t) : this.activeRows();
  }
  activeRows() {
    return this.table.rowManager.activeRows;
  }
  refreshData(e, t) {
    t || (t = this._handler), t && this.table.rowManager.refreshActiveData(t, !1, e);
  }
  ///////////////////////////////////
  //////// Footer Management ////////
  ///////////////////////////////////
  footerAppend(e) {
    return this.table.footerManager.append(e);
  }
  footerPrepend(e) {
    return this.table.footerManager.prepend(e);
  }
  footerRemove(e) {
    return this.table.footerManager.remove(e);
  }
  ///////////////////////////////////
  //////// Popups Management ////////
  ///////////////////////////////////
  popup(e, t) {
    return new Pa(this.table, e, t);
  }
  ///////////////////////////////////
  //////// Alert Management ////////
  ///////////////////////////////////
  alert(e, t) {
    return this.table.alertManager.alert(e, t);
  }
  clearAlert() {
    return this.table.alertManager.clear();
  }
}
var Aa = {
  rownum: function(o, e, t, i, s, n) {
    return n.getPosition();
  }
};
const Rt = class Rt extends A {
  constructor(e) {
    super(e), this.allowedTypes = ["", "data", "download", "clipboard", "print", "htmlOutput"], this.registerColumnOption("accessor"), this.registerColumnOption("accessorParams"), this.registerColumnOption("accessorData"), this.registerColumnOption("accessorDataParams"), this.registerColumnOption("accessorDownload"), this.registerColumnOption("accessorDownloadParams"), this.registerColumnOption("accessorClipboard"), this.registerColumnOption("accessorClipboardParams"), this.registerColumnOption("accessorPrint"), this.registerColumnOption("accessorPrintParams"), this.registerColumnOption("accessorHtmlOutput"), this.registerColumnOption("accessorHtmlOutputParams");
  }
  initialize() {
    this.subscribe("column-layout", this.initializeColumn.bind(this)), this.subscribe("row-data-retrieve", this.transformRow.bind(this));
  }
  //initialize column accessor
  initializeColumn(e) {
    var t = !1, i = {};
    this.allowedTypes.forEach((s) => {
      var n = "accessor" + (s.charAt(0).toUpperCase() + s.slice(1)), r;
      e.definition[n] && (r = this.lookupAccessor(e.definition[n]), r && (t = !0, i[n] = {
        accessor: r,
        params: e.definition[n + "Params"] || {}
      }));
    }), t && (e.modules.accessor = i);
  }
  lookupAccessor(e) {
    var t = !1;
    switch (typeof e) {
      case "string":
        Rt.accessors[e] ? t = Rt.accessors[e] : console.warn("Accessor Error - No such accessor found, ignoring: ", e);
        break;
      case "function":
        t = e;
        break;
    }
    return t;
  }
  //apply accessor to row
  transformRow(e, t) {
    var i = "accessor" + (t.charAt(0).toUpperCase() + t.slice(1)), s = e.getComponent(), n = $.deepClone(e.data || {});
    return this.table.columnManager.traverse(function(r) {
      var a, l, h, d;
      r.modules.accessor && (l = r.modules.accessor[i] || r.modules.accessor.accessor || !1, l && (a = r.getFieldValue(n), a != "undefined" && (d = r.getComponent(), h = typeof l.params == "function" ? l.params(a, n, t, d, s) : l.params, r.setFieldValue(n, l.accessor(a, n, t, h, d, s)))));
    }), n;
  }
};
C(Rt, "moduleName", "accessor"), //load defaults
C(Rt, "accessors", Aa);
let _s = Rt;
var Ha = {
  method: "GET"
};
function Rs(o, e) {
  var t = [];
  if (e = e || "", Array.isArray(o))
    o.forEach((s, n) => {
      t = t.concat(Rs(s, e ? e + "[" + n + "]" : n));
    });
  else if (typeof o == "object")
    for (var i in o)
      t = t.concat(Rs(o[i], e ? e + "[" + i + "]" : i));
  else
    t.push({ key: e, value: o });
  return t;
}
function Ia(o) {
  var e = Rs(o), t = [];
  return e.forEach(function(i) {
    t.push(encodeURIComponent(i.key) + "=" + encodeURIComponent(i.value));
  }), t.join("&");
}
function or(o, e, t) {
  return o && t && Object.keys(t).length && (!e.method || e.method.toLowerCase() == "get") && (e.method = "get", o += (o.includes("?") ? "&" : "?") + Ia(t)), o;
}
function Ba(o, e, t) {
  var i;
  return new Promise((s, n) => {
    if (o = this.urlGenerator.call(this.table, o, e, t), e.method.toUpperCase() != "GET")
      if (i = typeof this.table.options.ajaxContentType == "object" ? this.table.options.ajaxContentType : this.contentTypeFormatters[this.table.options.ajaxContentType], i) {
        for (var r in i.headers)
          e.headers || (e.headers = {}), typeof e.headers[r] > "u" && (e.headers[r] = i.headers[r]);
        e.body = i.body.call(this, o, e, t);
      } else
        console.warn("Ajax Error - Invalid ajaxContentType value:", this.table.options.ajaxContentType);
    o ? (typeof e.headers > "u" && (e.headers = {}), typeof e.headers.Accept > "u" && (e.headers.Accept = "application/json"), typeof e.headers["X-Requested-With"] > "u" && (e.headers["X-Requested-With"] = "XMLHttpRequest"), typeof e.mode > "u" && (e.mode = "cors"), e.mode == "cors" ? (typeof e.headers.Origin > "u" && (e.headers.Origin = window.location.origin), typeof e.credentials > "u" && (e.credentials = "same-origin")) : typeof e.credentials > "u" && (e.credentials = "include"), fetch(o, e).then((a) => {
      a.ok ? a.json().then((l) => {
        s(l);
      }).catch((l) => {
        n(l), console.warn("Ajax Load Error - Invalid JSON returned", l);
      }) : (console.error("Ajax Load Error - Connection Error: " + a.status, a.statusText), n(a));
    }).catch((a) => {
      console.error("Ajax Load Error - Connection Error: ", a), n(a);
    })) : (console.warn("Ajax Load Error - No URL Set"), s([]));
  });
}
function ks(o, e) {
  var t = [];
  if (e = e || "", Array.isArray(o))
    o.forEach((s, n) => {
      t = t.concat(ks(s, e ? e + "[" + n + "]" : n));
    });
  else if (typeof o == "object")
    for (var i in o)
      t = t.concat(ks(o[i], e ? e + "[" + i + "]" : i));
  else
    t.push({ key: e, value: o });
  return t;
}
var Va = {
  json: {
    headers: {
      "Content-Type": "application/json"
    },
    body: function(o, e, t) {
      return JSON.stringify(t);
    }
  },
  form: {
    headers: {},
    body: function(o, e, t) {
      var i = ks(t), s = new FormData();
      return i.forEach(function(n) {
        s.append(n.key, n.value);
      }), s;
    }
  }
};
const _e = class _e extends A {
  constructor(e) {
    super(e), this.config = {}, this.url = "", this.urlGenerator = !1, this.params = !1, this.loaderPromise = !1, this.registerTableOption("ajaxURL", !1), this.registerTableOption("ajaxURLGenerator", !1), this.registerTableOption("ajaxParams", {}), this.registerTableOption("ajaxConfig", "get"), this.registerTableOption("ajaxContentType", "form"), this.registerTableOption("ajaxRequestFunc", !1), this.registerTableOption("ajaxRequesting", function() {
    }), this.registerTableOption("ajaxResponse", !1), this.contentTypeFormatters = _e.contentTypeFormatters;
  }
  //initialize setup options
  initialize() {
    this.loaderPromise = this.table.options.ajaxRequestFunc || _e.defaultLoaderPromise, this.urlGenerator = this.table.options.ajaxURLGenerator || _e.defaultURLGenerator, this.table.options.ajaxURL && this.setUrl(this.table.options.ajaxURL), this.setDefaultConfig(this.table.options.ajaxConfig), this.registerTableFunction("getAjaxUrl", this.getUrl.bind(this)), this.subscribe("data-loading", this.requestDataCheck.bind(this)), this.subscribe("data-params", this.requestParams.bind(this)), this.subscribe("data-load", this.requestData.bind(this));
  }
  requestParams(e, t, i, s) {
    var n = this.table.options.ajaxParams;
    return n && (typeof n == "function" && (n = n.call(this.table)), s = Object.assign(Object.assign({}, n), s)), s;
  }
  requestDataCheck(e, t, i, s) {
    return !!(!e && this.url || typeof e == "string");
  }
  requestData(e, t, i, s, n) {
    var r;
    return !n && this.requestDataCheck(e) ? (e && this.setUrl(e), r = this.generateConfig(i), this.sendRequest(this.url, t, r)) : n;
  }
  setDefaultConfig(e = {}) {
    this.config = Object.assign({}, _e.defaultConfig), typeof e == "string" ? this.config.method = e : Object.assign(this.config, e);
  }
  //load config object
  generateConfig(e = {}) {
    var t = Object.assign({}, this.config);
    return typeof e == "string" ? t.method = e : Object.assign(t, e), t;
  }
  //set request url
  setUrl(e) {
    this.url = e;
  }
  //get request url
  getUrl() {
    return this.url;
  }
  //send ajax request
  sendRequest(e, t, i) {
    return this.table.options.ajaxRequesting.call(this.table, e, t) !== !1 ? this.loaderPromise(e, i, t).then((s) => (this.table.options.ajaxResponse && (s = this.table.options.ajaxResponse.call(this.table, e, t, s)), s)) : Promise.reject();
  }
};
C(_e, "moduleName", "ajax"), //load defaults
C(_e, "defaultConfig", Ha), C(_e, "defaultURLGenerator", or), C(_e, "defaultLoaderPromise", Ba), C(_e, "contentTypeFormatters", Va);
let Ms = _e;
var Na = {
  replace: function(o) {
    return this.table.setData(o);
  },
  update: function(o) {
    return this.table.updateOrAddData(o);
  },
  insert: function(o) {
    return this.table.addData(o);
  }
}, Wa = {
  table: function(o) {
    var e = [], t = !0, i = this.table.columnManager.columns, s = [], n = [];
    return o = o.split(`
`), o.forEach(function(r) {
      e.push(r.split("	"));
    }), e.length && !(e.length === 1 && e[0].length < 2) ? (e[0].forEach(function(r) {
      var a = i.find(function(l) {
        return r && l.definition.title && r.trim() && l.definition.title.trim() === r.trim();
      });
      a ? s.push(a) : t = !1;
    }), t || (t = !0, s = [], e[0].forEach(function(r) {
      var a = i.find(function(l) {
        return r && l.field && r.trim() && l.field.trim() === r.trim();
      });
      a ? s.push(a) : t = !1;
    }), t || (s = this.table.columnManager.columnsByIndex)), t && e.shift(), e.forEach(function(r) {
      var a = {};
      r.forEach(function(l, h) {
        s[h] && (a[s[h].field] = l);
      }), n.push(a);
    }), n) : !1;
  }
}, ja = {
  copyToClipboard: ["ctrl + 67", "meta + 67"]
}, Ga = {
  copyToClipboard: function(o) {
    this.table.modules.edit.currentCell || this.table.modExists("clipboard", !0) && this.table.modules.clipboard.copy(!1, !0);
  }
}, Ua = {
  keybindings: {
    bindings: ja,
    actions: Ga
  }
};
const Ue = class Ue extends A {
  constructor(e) {
    super(e), this.mode = !0, this.pasteParser = function() {
    }, this.pasteAction = function() {
    }, this.customSelection = !1, this.rowRange = !1, this.blocked = !0, this.registerTableOption("clipboard", !1), this.registerTableOption("clipboardCopyStyled", !0), this.registerTableOption("clipboardCopyConfig", !1), this.registerTableOption("clipboardCopyFormatter", !1), this.registerTableOption("clipboardCopyRowRange", "active"), this.registerTableOption("clipboardPasteParser", "table"), this.registerTableOption("clipboardPasteAction", "insert"), this.registerColumnOption("clipboard"), this.registerColumnOption("titleClipboard");
  }
  initialize() {
    this.mode = this.table.options.clipboard, this.rowRange = this.table.options.clipboardCopyRowRange, (this.mode === !0 || this.mode === "copy") && this.table.element.addEventListener("copy", (e) => {
      var t, i, s;
      this.blocked || (e.preventDefault(), this.customSelection ? (t = this.customSelection, this.table.options.clipboardCopyFormatter && (t = this.table.options.clipboardCopyFormatter("plain", t))) : (s = this.table.modules.export.generateExportList(this.table.options.clipboardCopyConfig, this.table.options.clipboardCopyStyled, this.rowRange, "clipboard"), i = this.table.modules.export.generateHTMLTable(s), t = i ? this.generatePlainContent(s) : "", this.table.options.clipboardCopyFormatter && (t = this.table.options.clipboardCopyFormatter("plain", t), i = this.table.options.clipboardCopyFormatter("html", i))), window.clipboardData && window.clipboardData.setData ? window.clipboardData.setData("Text", t) : e.clipboardData && e.clipboardData.setData ? (e.clipboardData.setData("text/plain", t), i && e.clipboardData.setData("text/html", i)) : e.originalEvent && e.originalEvent.clipboardData.setData && (e.originalEvent.clipboardData.setData("text/plain", t), i && e.originalEvent.clipboardData.setData("text/html", i)), this.dispatchExternal("clipboardCopied", t, i), this.reset());
    }), (this.mode === !0 || this.mode === "paste") && this.table.element.addEventListener("paste", (e) => {
      this.paste(e);
    }), this.setPasteParser(this.table.options.clipboardPasteParser), this.setPasteAction(this.table.options.clipboardPasteAction), this.registerTableFunction("copyToClipboard", this.copy.bind(this));
  }
  reset() {
    this.blocked = !0, this.customSelection = !1;
  }
  generatePlainContent(e) {
    var t = [];
    return e.forEach((i) => {
      var s = [];
      i.columns.forEach((n) => {
        var r = "";
        if (n)
          if (i.type === "group" && (n.value = n.component.getKey()), n.value === null)
            r = "";
          else
            switch (typeof n.value) {
              case "object":
                r = JSON.stringify(n.value);
                break;
              case "undefined":
                r = "";
                break;
              default:
                r = n.value;
            }
        s.push(r);
      }), t.push(s.join("	"));
    }), t.join(`
`);
  }
  copy(e, t) {
    var i, s;
    this.blocked = !1, this.customSelection = !1, (this.mode === !0 || this.mode === "copy") && (this.rowRange = e || this.table.options.clipboardCopyRowRange, typeof window.getSelection < "u" && typeof document.createRange < "u" ? (e = document.createRange(), e.selectNodeContents(this.table.element), i = window.getSelection(), i.toString() && t && (this.customSelection = i.toString()), i.removeAllRanges(), i.addRange(e)) : typeof document.selection < "u" && typeof document.body.createTextRange < "u" && (s = document.body.createTextRange(), s.moveToElementText(this.table.element), s.select()), document.execCommand("copy"), i && i.removeAllRanges());
  }
  //PASTE EVENT HANDLING
  setPasteAction(e) {
    switch (typeof e) {
      case "string":
        this.pasteAction = Ue.pasteActions[e], this.pasteAction || console.warn("Clipboard Error - No such paste action found:", e);
        break;
      case "function":
        this.pasteAction = e;
        break;
    }
  }
  setPasteParser(e) {
    switch (typeof e) {
      case "string":
        this.pasteParser = Ue.pasteParsers[e], this.pasteParser || console.warn("Clipboard Error - No such paste parser found:", e);
        break;
      case "function":
        this.pasteParser = e;
        break;
    }
  }
  paste(e) {
    var t, i, s;
    this.checkPasteOrigin(e) && (t = this.getPasteData(e), i = this.pasteParser.call(this, t), i ? (e.preventDefault(), this.table.modExists("mutator") && (i = this.mutateData(i)), s = this.pasteAction.call(this, i), this.dispatchExternal("clipboardPasted", t, i, s)) : this.dispatchExternal("clipboardPasteError", t));
  }
  mutateData(e) {
    var t = [];
    return Array.isArray(e) ? e.forEach((i) => {
      t.push(this.table.modules.mutator.transformRow(i, "clipboard"));
    }) : t = e, t;
  }
  checkPasteOrigin(e) {
    var t = !0, i = this.confirm("clipboard-paste", [e]);
    return (i || !["DIV", "SPAN"].includes(e.target.tagName)) && (t = !1), t;
  }
  getPasteData(e) {
    var t;
    return window.clipboardData && window.clipboardData.getData ? t = window.clipboardData.getData("Text") : e.clipboardData && e.clipboardData.getData ? t = e.clipboardData.getData("text/plain") : e.originalEvent && e.originalEvent.clipboardData.getData && (t = e.originalEvent.clipboardData.getData("text/plain")), t;
  }
};
C(Ue, "moduleName", "clipboard"), C(Ue, "moduleExtensions", Ua), //load defaults
C(Ue, "pasteActions", Na), C(Ue, "pasteParsers", Wa);
let Ts = Ue;
class $a {
  constructor(e) {
    return this._row = e, new Proxy(this, {
      get: function(t, i, s) {
        return typeof t[i] < "u" ? t[i] : t._row.table.componentFunctionBinder.handle("row", t._row, i);
      }
    });
  }
  getData(e) {
    return this._row.getData(e);
  }
  getElement() {
    return this._row.getElement();
  }
  getTable() {
    return this._row.table;
  }
  getCells() {
    var e = [];
    return this._row.getCells().forEach(function(t) {
      e.push(t.getComponent());
    }), e;
  }
  getCell(e) {
    var t = this._row.getCell(e);
    return t ? t.getComponent() : !1;
  }
  _getSelf() {
    return this._row;
  }
}
class rr {
  constructor(e) {
    return this._cell = e, new Proxy(this, {
      get: function(t, i, s) {
        return typeof t[i] < "u" ? t[i] : t._cell.table.componentFunctionBinder.handle("cell", t._cell, i);
      }
    });
  }
  getValue() {
    return this._cell.getValue();
  }
  getOldValue() {
    return this._cell.getOldValue();
  }
  getInitialValue() {
    return this._cell.initialValue;
  }
  getElement() {
    return this._cell.getElement();
  }
  getRow() {
    return this._cell.row.getComponent();
  }
  getData(e) {
    return this._cell.row.getData(e);
  }
  getType() {
    return "cell";
  }
  getField() {
    return this._cell.column.getField();
  }
  getColumn() {
    return this._cell.column.getComponent();
  }
  setValue(e, t) {
    typeof t > "u" && (t = !0), this._cell.setValue(e, t);
  }
  restoreOldValue() {
    this._cell.setValueActual(this._cell.getOldValue());
  }
  restoreInitialValue() {
    this._cell.setValueActual(this._cell.initialValue);
  }
  checkHeight() {
    this._cell.checkHeight();
  }
  getTable() {
    return this._cell.table;
  }
  _getSelf() {
    return this._cell;
  }
}
class ui extends oe {
  constructor(e, t) {
    super(e.table), this.table = e.table, this.column = e, this.row = t, this.element = null, this.value = null, this.initialValue, this.oldValue = null, this.modules = {}, this.height = null, this.width = null, this.minWidth = null, this.component = null, this.loaded = !1, this.build();
  }
  //////////////// Setup Functions /////////////////
  //generate element
  build() {
    this.generateElement(), this.setWidth(), this._configureCell(), this.setValueActual(this.column.getFieldValue(this.row.data)), this.initialValue = this.value;
  }
  generateElement() {
    this.element = document.createElement("div"), this.element.className = "tabulator-cell", this.element.setAttribute("role", "gridcell"), this.column.isRowHeader && this.element.classList.add("tabulator-row-header");
  }
  _configureCell() {
    var e = this.element, t = this.column.getField(), i = {
      top: "flex-start",
      bottom: "flex-end",
      middle: "center"
    }, s = {
      left: "flex-start",
      right: "flex-end",
      center: "center"
    };
    if (e.style.textAlign = this.column.hozAlign, this.column.vertAlign && (e.style.display = "inline-flex", e.style.alignItems = i[this.column.vertAlign] || "", this.column.hozAlign && (e.style.justifyContent = s[this.column.hozAlign] || "")), t && e.setAttribute("tabulator-field", t), this.column.definition.cssClass) {
      var n = this.column.definition.cssClass.split(" ");
      n.forEach((r) => {
        e.classList.add(r);
      });
    }
    this.dispatch("cell-init", this), this.column.visible || this.hide();
  }
  //generate cell contents
  _generateContents() {
    var e;
    switch (e = this.chain("cell-format", this, null, () => this.element.innerHTML = this.value), typeof e) {
      case "object":
        if (e instanceof Node) {
          for (; this.element.firstChild; ) this.element.removeChild(this.element.firstChild);
          this.element.appendChild(e);
        } else
          this.element.innerHTML = "", e != null && console.warn("Format Error - Formatter has returned a type of object, the only valid formatter object return is an instance of Node, the formatter returned:", e);
        break;
      case "undefined":
        this.element.innerHTML = "";
        break;
      default:
        this.element.innerHTML = e;
    }
  }
  cellRendered() {
    this.dispatch("cell-rendered", this);
  }
  //////////////////// Getters ////////////////////
  getElement(e) {
    return this.loaded || (this.loaded = !0, e || this.layoutElement()), this.element;
  }
  getValue() {
    return this.value;
  }
  getOldValue() {
    return this.oldValue;
  }
  //////////////////// Actions ////////////////////
  setValue(e, t, i) {
    var s = this.setValueProcessData(e, t, i);
    s && (this.dispatch("cell-value-updated", this), this.cellRendered(), this.column.definition.cellEdited && this.column.definition.cellEdited.call(this.table, this.getComponent()), this.dispatchExternal("cellEdited", this.getComponent()), this.subscribedExternal("dataChanged") && this.dispatchExternal("dataChanged", this.table.rowManager.getData()));
  }
  setValueProcessData(e, t, i) {
    var s = !1;
    return (this.value !== e || i) && (s = !0, t && (e = this.chain("cell-value-changing", [this, e], null, e))), this.setValueActual(e), s && this.dispatch("cell-value-changed", this), s;
  }
  setValueActual(e) {
    this.oldValue = this.value, this.value = e, this.dispatch("cell-value-save-before", this), this.column.setFieldValue(this.row.data, e), this.dispatch("cell-value-save-after", this), this.loaded && this.layoutElement();
  }
  layoutElement() {
    this._generateContents(), this.dispatch("cell-layout", this);
  }
  setWidth() {
    this.width = this.column.width, this.element.style.width = this.column.widthStyled;
  }
  clearWidth() {
    this.width = "", this.element.style.width = "";
  }
  getWidth() {
    return this.width || this.element.offsetWidth;
  }
  setMinWidth() {
    this.minWidth = this.column.minWidth, this.element.style.minWidth = this.column.minWidthStyled;
  }
  setMaxWidth() {
    this.maxWidth = this.column.maxWidth, this.element.style.maxWidth = this.column.maxWidthStyled;
  }
  checkHeight() {
    this.row.reinitializeHeight();
  }
  clearHeight() {
    this.element.style.height = "", this.height = null, this.dispatch("cell-height", this, "");
  }
  setHeight() {
    this.height = this.row.height, this.element.style.height = this.row.heightStyled, this.dispatch("cell-height", this, this.row.heightStyled);
  }
  getHeight() {
    return this.height || this.element.offsetHeight;
  }
  show() {
    this.element.style.display = this.column.vertAlign ? "inline-flex" : "";
  }
  hide() {
    this.element.style.display = "none";
  }
  delete() {
    this.dispatch("cell-delete", this), !this.table.rowManager.redrawBlock && this.element.parentNode && this.element.parentNode.removeChild(this.element), this.element = !1, this.column.deleteCell(this), this.row.deleteCell(this), this.calcs = {};
  }
  getIndex() {
    return this.row.getCellIndex(this);
  }
  //////////////// Object Generation /////////////////
  getComponent() {
    return this.component || (this.component = new rr(this)), this.component;
  }
}
class ar {
  constructor(e) {
    return this._column = e, this.type = "ColumnComponent", new Proxy(this, {
      get: function(t, i, s) {
        return typeof t[i] < "u" ? t[i] : t._column.table.componentFunctionBinder.handle("column", t._column, i);
      }
    });
  }
  getElement() {
    return this._column.getElement();
  }
  getDefinition() {
    return this._column.getDefinition();
  }
  getField() {
    return this._column.getField();
  }
  getTitleDownload() {
    return this._column.getTitleDownload();
  }
  getCells() {
    var e = [];
    return this._column.cells.forEach(function(t) {
      e.push(t.getComponent());
    }), e;
  }
  isVisible() {
    return this._column.visible;
  }
  show() {
    this._column.isGroup ? this._column.columns.forEach(function(e) {
      e.show();
    }) : this._column.show();
  }
  hide() {
    this._column.isGroup ? this._column.columns.forEach(function(e) {
      e.hide();
    }) : this._column.hide();
  }
  toggle() {
    this._column.visible ? this.hide() : this.show();
  }
  delete() {
    return this._column.delete();
  }
  getSubColumns() {
    var e = [];
    return this._column.columns.length && this._column.columns.forEach(function(t) {
      e.push(t.getComponent());
    }), e;
  }
  getParentColumn() {
    return this._column.getParentComponent();
  }
  _getSelf() {
    return this._column;
  }
  scrollTo(e, t) {
    return this._column.table.columnManager.scrollToColumn(this._column, e, t);
  }
  getTable() {
    return this._column.table;
  }
  move(e, t) {
    var i = this._column.table.columnManager.findColumn(e);
    i ? this._column.table.columnManager.moveColumn(this._column, i, t) : console.warn("Move Error - No matching column found:", i);
  }
  getNextColumn() {
    var e = this._column.nextColumn();
    return e ? e.getComponent() : !1;
  }
  getPrevColumn() {
    var e = this._column.prevColumn();
    return e ? e.getComponent() : !1;
  }
  updateDefinition(e) {
    return this._column.updateDefinition(e);
  }
  getWidth() {
    return this._column.getWidth();
  }
  setWidth(e) {
    var t;
    return e === !0 ? t = this._column.reinitializeWidth(!0) : t = this._column.setWidth(e), this._column.table.columnManager.rerenderColumns(!0), t;
  }
}
var lr = {
  title: void 0,
  field: void 0,
  columns: void 0,
  visible: void 0,
  hozAlign: void 0,
  vertAlign: void 0,
  width: void 0,
  minWidth: 40,
  maxWidth: void 0,
  maxInitialWidth: void 0,
  cssClass: void 0,
  variableHeight: void 0,
  headerVertical: void 0,
  headerHozAlign: void 0,
  headerWordWrap: !1,
  editableTitle: void 0
};
const dt = class dt extends oe {
  constructor(e, t, i) {
    super(t.table), this.definition = e, this.parent = t, this.type = "column", this.columns = [], this.cells = [], this.isGroup = !1, this.isRowHeader = i, this.element = this.createElement(), this.contentElement = !1, this.titleHolderElement = !1, this.titleElement = !1, this.groupElement = this.createGroupElement(), this.hozAlign = "", this.vertAlign = "", this.field = "", this.fieldStructure = "", this.getFieldValue = "", this.setFieldValue = "", this.titleDownload = null, this.titleFormatterRendered = !1, this.mapDefinitions(), this.setField(this.definition.field), this.modules = {}, this.width = null, this.widthStyled = "", this.maxWidth = null, this.maxWidthStyled = "", this.maxInitialWidth = null, this.minWidth = null, this.minWidthStyled = "", this.widthFixed = !1, this.visible = !0, this.component = null, this.definition.columns ? (this.isGroup = !0, this.definition.columns.forEach((s, n) => {
      var r = new dt(s, this);
      this.attachColumn(r);
    }), this.checkColumnVisibility()) : t.registerColumnField(this), this._initialize();
  }
  createElement() {
    var e = document.createElement("div");
    switch (e.classList.add("tabulator-col"), e.setAttribute("role", "columnheader"), e.setAttribute("aria-sort", "none"), this.isRowHeader && e.classList.add("tabulator-row-header"), this.table.options.columnHeaderVertAlign) {
      case "middle":
        e.style.justifyContent = "center";
        break;
      case "bottom":
        e.style.justifyContent = "flex-end";
        break;
    }
    return e;
  }
  createGroupElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-col-group-cols"), e;
  }
  mapDefinitions() {
    var e = this.table.options.columnDefaults;
    if (e)
      for (let t in e)
        typeof this.definition[t] > "u" && (this.definition[t] = e[t]);
    this.definition = this.table.columnManager.optionsList.generate(dt.defaultOptionList, this.definition);
  }
  checkDefinition() {
    Object.keys(this.definition).forEach((e) => {
      dt.defaultOptionList.indexOf(e) === -1 && console.warn("Invalid column definition option in '" + (this.field || this.definition.title) + "' column:", e);
    });
  }
  setField(e) {
    this.field = e, this.fieldStructure = e ? this.table.options.nestedFieldSeparator ? e.split(this.table.options.nestedFieldSeparator) : [e] : [], this.getFieldValue = this.fieldStructure.length > 1 ? this._getNestedData : this._getFlatData, this.setFieldValue = this.fieldStructure.length > 1 ? this._setNestedData : this._setFlatData;
  }
  //register column position with column manager
  registerColumnPosition(e) {
    this.parent.registerColumnPosition(e);
  }
  //register column position with column manager
  registerColumnField(e) {
    this.parent.registerColumnField(e);
  }
  //trigger position registration
  reRegisterPosition() {
    this.isGroup ? this.columns.forEach(function(e) {
      e.reRegisterPosition();
    }) : this.registerColumnPosition(this);
  }
  //build header element
  _initialize() {
    for (var e = this.definition; this.element.firstChild; ) this.element.removeChild(this.element.firstChild);
    e.headerVertical && (this.element.classList.add("tabulator-col-vertical"), e.headerVertical === "flip" && this.element.classList.add("tabulator-col-vertical-flip")), this.contentElement = this._buildColumnHeaderContent(), this.element.appendChild(this.contentElement), this.isGroup ? this._buildGroupHeader() : this._buildColumnHeader(), this.dispatch("column-init", this);
  }
  //build header element for header
  _buildColumnHeader() {
    var e = this.definition;
    if (this.dispatch("column-layout", this), typeof e.visible < "u" && (e.visible ? this.show(!0) : this.hide(!0)), e.cssClass) {
      var t = e.cssClass.split(" ");
      t.forEach((i) => {
        this.element.classList.add(i);
      });
    }
    e.field && this.element.setAttribute("tabulator-field", e.field), this.setMinWidth(parseInt(e.minWidth)), e.maxInitialWidth && (this.maxInitialWidth = parseInt(e.maxInitialWidth)), e.maxWidth && this.setMaxWidth(parseInt(e.maxWidth)), this.reinitializeWidth(), this.hozAlign = this.definition.hozAlign, this.vertAlign = this.definition.vertAlign, this.titleElement.style.textAlign = this.definition.headerHozAlign;
  }
  _buildColumnHeaderContent() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-col-content"), this.titleHolderElement = document.createElement("div"), this.titleHolderElement.classList.add("tabulator-col-title-holder"), e.appendChild(this.titleHolderElement), this.titleElement = this._buildColumnHeaderTitle(), this.titleHolderElement.appendChild(this.titleElement), e;
  }
  //build title element of column
  _buildColumnHeaderTitle() {
    var e = this.definition, t = document.createElement("div");
    if (t.classList.add("tabulator-col-title"), e.headerWordWrap && t.classList.add("tabulator-col-title-wrap"), e.editableTitle) {
      var i = document.createElement("input");
      i.classList.add("tabulator-title-editor"), i.addEventListener("click", (s) => {
        s.stopPropagation(), i.focus();
      }), i.addEventListener("mousedown", (s) => {
        s.stopPropagation();
      }), i.addEventListener("change", () => {
        e.title = i.value, this.dispatchExternal("columnTitleChanged", this.getComponent());
      }), t.appendChild(i), e.field ? this.langBind("columns|" + e.field, (s) => {
        i.value = s || e.title || "&nbsp;";
      }) : i.value = e.title || "&nbsp;";
    } else
      e.field ? this.langBind("columns|" + e.field, (s) => {
        this._formatColumnHeaderTitle(t, s || e.title || "&nbsp;");
      }) : this._formatColumnHeaderTitle(t, e.title || "&nbsp;");
    return t;
  }
  _formatColumnHeaderTitle(e, t) {
    var i = this.chain("column-format", [this, t, e], null, () => t);
    switch (typeof i) {
      case "object":
        i instanceof Node ? e.appendChild(i) : (e.innerHTML = "", console.warn("Format Error - Title formatter has returned a type of object, the only valid formatter object return is an instance of Node, the formatter returned:", i));
        break;
      case "undefined":
        e.innerHTML = "";
        break;
      default:
        e.innerHTML = i;
    }
  }
  //build header element for column group
  _buildGroupHeader() {
    if (this.element.classList.add("tabulator-col-group"), this.element.setAttribute("role", "columngroup"), this.element.setAttribute("aria-title", this.definition.title), this.definition.cssClass) {
      var e = this.definition.cssClass.split(" ");
      e.forEach((t) => {
        this.element.classList.add(t);
      });
    }
    this.titleElement.style.textAlign = this.definition.headerHozAlign, this.element.appendChild(this.groupElement);
  }
  //flat field lookup
  _getFlatData(e) {
    return e[this.field];
  }
  //nested field lookup
  _getNestedData(e) {
    var t = e, i = this.fieldStructure, s = i.length, n;
    for (let r = 0; r < s && (t = t[i[r]], n = t, !!t); r++)
      ;
    return n;
  }
  //flat field set
  _setFlatData(e, t) {
    this.field && (e[this.field] = t);
  }
  //nested field set
  _setNestedData(e, t) {
    var i = e, s = this.fieldStructure, n = s.length;
    for (let r = 0; r < n; r++)
      if (r == n - 1)
        i[s[r]] = t;
      else {
        if (!i[s[r]])
          if (typeof t < "u")
            i[s[r]] = {};
          else
            break;
        i = i[s[r]];
      }
  }
  //attach column to this group
  attachColumn(e) {
    this.groupElement ? (this.columns.push(e), this.groupElement.appendChild(e.getElement()), e.columnRendered()) : console.warn("Column Warning - Column being attached to another column instead of column group");
  }
  //vertically align header in column
  verticalAlign(e, t) {
    var i = this.parent.isGroup ? this.parent.getGroupElement().clientHeight : t || this.parent.getHeadersElement().clientHeight;
    this.element.style.height = i + "px", this.dispatch("column-height", this, this.element.style.height), this.isGroup && (this.groupElement.style.minHeight = i - this.contentElement.offsetHeight + "px"), this.columns.forEach(function(s) {
      s.verticalAlign(e);
    });
  }
  //clear vertical alignment
  clearVerticalAlign() {
    this.element.style.paddingTop = "", this.element.style.height = "", this.element.style.minHeight = "", this.groupElement.style.minHeight = "", this.columns.forEach(function(e) {
      e.clearVerticalAlign();
    }), this.dispatch("column-height", this, "");
  }
  //// Retrieve Column Information ////
  //return column header element
  getElement() {
    return this.element;
  }
  //return column group element
  getGroupElement() {
    return this.groupElement;
  }
  //return field name
  getField() {
    return this.field;
  }
  getTitleDownload() {
    return this.titleDownload;
  }
  //return the first column in a group
  getFirstColumn() {
    return this.isGroup ? this.columns.length ? this.columns[0].getFirstColumn() : !1 : this;
  }
  //return the last column in a group
  getLastColumn() {
    return this.isGroup ? this.columns.length ? this.columns[this.columns.length - 1].getLastColumn() : !1 : this;
  }
  //return all columns in a group
  getColumns(e) {
    var t = [];
    return e ? this.columns.forEach((i) => {
      t.push(i), t = t.concat(i.getColumns(!0));
    }) : t = this.columns, t;
  }
  //return all columns in a group
  getCells() {
    return this.cells;
  }
  //retrieve the top column in a group of columns
  getTopColumn() {
    return this.parent.isGroup ? this.parent.getTopColumn() : this;
  }
  //return column definition object
  getDefinition(e) {
    var t = [];
    return this.isGroup && e && (this.columns.forEach(function(i) {
      t.push(i.getDefinition(!0));
    }), this.definition.columns = t), this.definition;
  }
  //////////////////// Actions ////////////////////
  checkColumnVisibility() {
    var e = !1;
    this.columns.forEach(function(t) {
      t.visible && (e = !0);
    }), e ? (this.show(), this.dispatchExternal("columnVisibilityChanged", this.getComponent(), !1)) : this.hide();
  }
  //show column
  show(e, t) {
    this.visible || (this.visible = !0, this.element.style.display = "", this.parent.isGroup && this.parent.checkColumnVisibility(), this.cells.forEach(function(i) {
      i.show();
    }), !this.isGroup && this.width === null && this.reinitializeWidth(), this.table.columnManager.verticalAlignHeaders(), this.dispatch("column-show", this, t), e || this.dispatchExternal("columnVisibilityChanged", this.getComponent(), !0), this.parent.isGroup && this.parent.matchChildWidths(), this.silent || this.table.columnManager.rerenderColumns());
  }
  //hide column
  hide(e, t) {
    this.visible && (this.visible = !1, this.element.style.display = "none", this.table.columnManager.verticalAlignHeaders(), this.parent.isGroup && this.parent.checkColumnVisibility(), this.cells.forEach(function(i) {
      i.hide();
    }), this.dispatch("column-hide", this, t), e || this.dispatchExternal("columnVisibilityChanged", this.getComponent(), !1), this.parent.isGroup && this.parent.matchChildWidths(), this.silent || this.table.columnManager.rerenderColumns());
  }
  matchChildWidths() {
    var e = 0;
    this.contentElement && this.columns.length && (this.columns.forEach(function(t) {
      t.visible && (e += t.getWidth());
    }), this.contentElement.style.maxWidth = e - 1 + "px", this.table.initialized && (this.element.style.width = e + "px"), this.parent.isGroup && this.parent.matchChildWidths());
  }
  removeChild(e) {
    var t = this.columns.indexOf(e);
    t > -1 && this.columns.splice(t, 1), this.columns.length || this.delete();
  }
  setWidth(e) {
    this.widthFixed = !0, this.setWidthActual(e);
  }
  setWidthActual(e) {
    isNaN(e) && (e = Math.floor(this.table.element.clientWidth / 100 * parseInt(e))), e = Math.max(this.minWidth, e), this.maxWidth && (e = Math.min(this.maxWidth, e)), this.width = e, this.widthStyled = e ? e + "px" : "", this.element.style.width = this.widthStyled, this.isGroup || this.cells.forEach(function(t) {
      t.setWidth();
    }), this.parent.isGroup && this.parent.matchChildWidths(), this.dispatch("column-width", this), this.subscribedExternal("columnWidth") && this.dispatchExternal("columnWidth", this.getComponent());
  }
  checkCellHeights() {
    var e = [];
    this.cells.forEach(function(t) {
      t.row.heightInitialized && (t.row.getElement().offsetParent !== null ? (e.push(t.row), t.row.clearCellHeight()) : t.row.heightInitialized = !1);
    }), e.forEach(function(t) {
      t.calcHeight();
    }), e.forEach(function(t) {
      t.setCellHeight();
    });
  }
  getWidth() {
    var e = 0;
    return this.isGroup ? this.columns.forEach(function(t) {
      t.visible && (e += t.getWidth());
    }) : e = this.width, e;
  }
  getLeftOffset() {
    var e = this.element.offsetLeft;
    return this.parent.isGroup && (e += this.parent.getLeftOffset()), e;
  }
  getHeight() {
    return Math.ceil(this.element.getBoundingClientRect().height);
  }
  setMinWidth(e) {
    this.maxWidth && e > this.maxWidth && (e = this.maxWidth, console.warn("the minWidth (" + e + "px) for column '" + this.field + "' cannot be bigger that its maxWidth (" + this.maxWidthStyled + ")")), this.minWidth = e, this.minWidthStyled = e ? e + "px" : "", this.element.style.minWidth = this.minWidthStyled, this.cells.forEach(function(t) {
      t.setMinWidth();
    });
  }
  setMaxWidth(e) {
    this.minWidth && e < this.minWidth && (e = this.minWidth, console.warn("the maxWidth (" + e + "px) for column '" + this.field + "' cannot be smaller that its minWidth (" + this.minWidthStyled + ")")), this.maxWidth = e, this.maxWidthStyled = e ? e + "px" : "", this.element.style.maxWidth = this.maxWidthStyled, this.cells.forEach(function(t) {
      t.setMaxWidth();
    });
  }
  delete() {
    return new Promise((e, t) => {
      this.isGroup && this.columns.forEach(function(s) {
        s.delete();
      }), this.dispatch("column-delete", this);
      var i = this.cells.length;
      for (let s = 0; s < i; s++)
        this.cells[0].delete();
      this.element.parentNode && this.element.parentNode.removeChild(this.element), this.element = !1, this.contentElement = !1, this.titleElement = !1, this.groupElement = !1, this.parent.isGroup && this.parent.removeChild(this), this.table.columnManager.deregisterColumn(this), this.table.columnManager.rerenderColumns(!0), this.dispatch("column-deleted", this), e();
    });
  }
  columnRendered() {
    this.titleFormatterRendered && this.titleFormatterRendered(), this.dispatch("column-rendered", this);
  }
  //////////////// Cell Management /////////////////
  //generate cell for this column
  generateCell(e) {
    var t = new ui(this, e);
    return this.cells.push(t), t;
  }
  nextColumn() {
    var e = this.table.columnManager.findColumnIndex(this);
    return e > -1 ? this._nextVisibleColumn(e + 1) : !1;
  }
  _nextVisibleColumn(e) {
    var t = this.table.columnManager.getColumnByIndex(e);
    return !t || t.visible ? t : this._nextVisibleColumn(e + 1);
  }
  prevColumn() {
    var e = this.table.columnManager.findColumnIndex(this);
    return e > -1 ? this._prevVisibleColumn(e - 1) : !1;
  }
  _prevVisibleColumn(e) {
    var t = this.table.columnManager.getColumnByIndex(e);
    return !t || t.visible ? t : this._prevVisibleColumn(e - 1);
  }
  reinitializeWidth(e) {
    this.widthFixed = !1, typeof this.definition.width < "u" && !e && this.setWidth(this.definition.width), this.dispatch("column-width-fit-before", this), this.fitToData(e), this.dispatch("column-width-fit-after", this);
  }
  //set column width to maximum cell width for non group columns
  fitToData(e) {
    if (!this.isGroup) {
      this.widthFixed || (this.element.style.width = "", this.cells.forEach((s) => {
        s.clearWidth();
      }));
      var t = this.element.offsetWidth;
      if ((!this.width || !this.widthFixed) && (this.cells.forEach((s) => {
        var n = s.getWidth();
        n > t && (t = n);
      }), t)) {
        var i = t + 1;
        e ? this.setWidth(i) : (this.maxInitialWidth && !e && (i = Math.min(i, this.maxInitialWidth)), this.setWidthActual(i));
      }
    }
  }
  updateDefinition(e) {
    var t;
    return this.isGroup || this.parent.isGroup ? (console.error("Column Update Error - The updateDefinition function is only available on ungrouped columns"), Promise.reject("Column Update Error - The updateDefinition function is only available on columns, not column groups")) : (t = Object.assign({}, this.getDefinition()), t = Object.assign(t, e), this.table.columnManager.addColumn(t, !1, this).then((i) => (t.field == this.field && (this.field = !1), this.delete().then(() => i.getComponent()))));
  }
  deleteCell(e) {
    var t = this.cells.indexOf(e);
    t > -1 && this.cells.splice(t, 1);
  }
  //////////////// Object Generation /////////////////
  getComponent() {
    return this.component || (this.component = new ar(this)), this.component;
  }
  getPosition() {
    return this.table.columnManager.getVisibleColumnsByIndex().indexOf(this) + 1;
  }
  getParentComponent() {
    return this.parent instanceof dt ? this.parent.getComponent() : !1;
  }
};
C(dt, "defaultOptionList", lr);
let gt = dt;
class Ui {
  constructor(e) {
    return this._row = e, new Proxy(this, {
      get: function(t, i, s) {
        return typeof t[i] < "u" ? t[i] : t._row.table.componentFunctionBinder.handle("row", t._row, i);
      }
    });
  }
  getData(e) {
    return this._row.getData(e);
  }
  getElement() {
    return this._row.getElement();
  }
  getCells() {
    var e = [];
    return this._row.getCells().forEach(function(t) {
      e.push(t.getComponent());
    }), e;
  }
  getCell(e) {
    var t = this._row.getCell(e);
    return t ? t.getComponent() : !1;
  }
  getIndex() {
    return this._row.getData("data")[this._row.table.options.index];
  }
  getPosition() {
    return this._row.getPosition();
  }
  watchPosition(e) {
    return this._row.watchPosition(e);
  }
  delete() {
    return this._row.delete();
  }
  scrollTo(e, t) {
    return this._row.table.rowManager.scrollToRow(this._row, e, t);
  }
  move(e, t) {
    this._row.moveToRow(e, t);
  }
  update(e) {
    return this._row.updateData(e);
  }
  normalizeHeight() {
    this._row.normalizeHeight(!0);
  }
  _getSelf() {
    return this._row;
  }
  reformat() {
    return this._row.reinitialize();
  }
  getTable() {
    return this._row.table;
  }
  getNextRow() {
    var e = this._row.nextRow();
    return e && e.getComponent();
  }
  getPrevRow() {
    var e = this._row.prevRow();
    return e && e.getComponent();
  }
}
class ae extends oe {
  constructor(e, t, i = "row") {
    super(t.table), this.parent = t, this.data = {}, this.type = i, this.element = !1, this.modules = {}, this.cells = [], this.height = 0, this.heightStyled = "", this.manualHeight = !1, this.outerHeight = 0, this.initialized = !1, this.heightInitialized = !1, this.position = 0, this.positionWatchers = [], this.component = null, this.created = !1, this.setData(e);
  }
  create() {
    this.created || (this.created = !0, this.generateElement());
  }
  createElement() {
    var e = document.createElement("div");
    e.classList.add("tabulator-row"), e.setAttribute("role", "row"), this.element = e;
  }
  getElement() {
    return this.create(), this.element;
  }
  detachElement() {
    this.element && this.element.parentNode && this.element.parentNode.removeChild(this.element);
  }
  generateElement() {
    this.createElement(), this.dispatch("row-init", this);
  }
  generateCells() {
    this.cells = this.table.columnManager.generateCells(this);
  }
  //functions to setup on first render
  initialize(e, t) {
    if (this.create(), !this.initialized || e) {
      for (this.deleteCells(); this.element.firstChild; ) this.element.removeChild(this.element.firstChild);
      this.dispatch("row-layout-before", this), this.generateCells(), this.initialized = !0, this.table.columnManager.renderer.renderRowCells(this, t), e && this.normalizeHeight(), this.dispatch("row-layout", this), this.table.options.rowFormatter && this.table.options.rowFormatter(this.getComponent()), this.dispatch("row-layout-after", this);
    } else
      this.table.columnManager.renderer.rerenderRowCells(this, t);
  }
  rendered() {
    this.cells.forEach((e) => {
      e.cellRendered();
    });
  }
  reinitializeHeight() {
    this.heightInitialized = !1, this.element && this.element.offsetParent !== null && this.normalizeHeight(!0);
  }
  deinitialize() {
    this.initialized = !1;
  }
  deinitializeHeight() {
    this.heightInitialized = !1;
  }
  reinitialize(e) {
    this.initialized = !1, this.heightInitialized = !1, this.manualHeight || (this.height = 0, this.heightStyled = ""), this.element && this.element.offsetParent !== null && this.initialize(!0), this.dispatch("row-relayout", this);
  }
  //get heights when doing bulk row style calcs in virtual DOM
  calcHeight(e) {
    var t = 0, i = 0;
    this.table.options.rowHeight ? this.height = this.table.options.rowHeight : (i = this.calcMinHeight(), t = this.calcMaxHeight(), e ? this.height = Math.max(t, i) : this.height = this.manualHeight ? this.height : Math.max(t, i)), this.heightStyled = this.height ? this.height + "px" : "", this.outerHeight = this.element.offsetHeight;
  }
  calcMinHeight() {
    return this.table.options.resizableRows ? this.element.clientHeight : 0;
  }
  calcMaxHeight() {
    var e = 0;
    return this.cells.forEach(function(t) {
      var i = t.getHeight();
      i > e && (e = i);
    }), e;
  }
  //set of cells
  setCellHeight() {
    this.cells.forEach(function(e) {
      e.setHeight();
    }), this.heightInitialized = !0;
  }
  clearCellHeight() {
    this.cells.forEach(function(e) {
      e.clearHeight();
    });
  }
  //normalize the height of elements in the row
  normalizeHeight(e) {
    e && !this.table.options.rowHeight && this.clearCellHeight(), this.calcHeight(e), this.setCellHeight();
  }
  //set height of rows
  setHeight(e, t) {
    (this.height != e || t) && (this.manualHeight = !0, this.height = e, this.heightStyled = e ? e + "px" : "", this.setCellHeight(), this.outerHeight = this.element.offsetHeight, this.subscribedExternal("rowHeight") && this.dispatchExternal("rowHeight", this.getComponent()));
  }
  //return rows outer height
  getHeight() {
    return this.outerHeight;
  }
  //return rows outer Width
  getWidth() {
    return this.element.offsetWidth;
  }
  //////////////// Cell Management /////////////////
  deleteCell(e) {
    var t = this.cells.indexOf(e);
    t > -1 && this.cells.splice(t, 1);
  }
  //////////////// Data Management /////////////////
  setData(e) {
    this.data = this.chain("row-data-init-before", [this, e], void 0, e), this.dispatch("row-data-init-after", this);
  }
  //update the rows data
  updateData(e) {
    var t = this.element && $.elVisible(this.element), i = {}, s;
    return new Promise((n, r) => {
      typeof e == "string" && (e = JSON.parse(e)), this.dispatch("row-data-save-before", this), this.subscribed("row-data-changing") && (i = Object.assign(i, this.data), i = Object.assign(i, e)), s = this.chain("row-data-changing", [this, i, e], null, e);
      for (let a in s)
        this.data[a] = s[a];
      this.dispatch("row-data-save-after", this);
      for (let a in e)
        this.table.columnManager.getColumnsByFieldRoot(a).forEach((h) => {
          let d = this.getCell(h.getField());
          if (d) {
            let c = h.getFieldValue(s);
            d.getValue() !== c && (d.setValueProcessData(c), t && d.cellRendered());
          }
        });
      t ? (this.normalizeHeight(!0), this.table.options.rowFormatter && this.table.options.rowFormatter(this.getComponent())) : (this.initialized = !1, this.height = 0, this.heightStyled = ""), this.dispatch("row-data-changed", this, t, e), this.dispatchExternal("rowUpdated", this.getComponent()), this.subscribedExternal("dataChanged") && this.dispatchExternal("dataChanged", this.table.rowManager.getData()), n();
    });
  }
  getData(e) {
    return e ? this.chain("row-data-retrieve", [this, e], null, this.data) : this.data;
  }
  getCell(e) {
    var t = !1;
    return e = this.table.columnManager.findColumn(e), !this.initialized && this.cells.length === 0 && this.generateCells(), t = this.cells.find(function(i) {
      return i.column === e;
    }), t;
  }
  getCellIndex(e) {
    return this.cells.findIndex(function(t) {
      return t === e;
    });
  }
  findCell(e) {
    return this.cells.find((t) => t.element === e);
  }
  getCells() {
    return !this.initialized && this.cells.length === 0 && this.generateCells(), this.cells;
  }
  nextRow() {
    var e = this.table.rowManager.nextDisplayRow(this, !0);
    return e || !1;
  }
  prevRow() {
    var e = this.table.rowManager.prevDisplayRow(this, !0);
    return e || !1;
  }
  moveToRow(e, t) {
    var i = this.table.rowManager.findRow(e);
    i ? (this.table.rowManager.moveRowActual(this, i, !t), this.table.rowManager.refreshActiveData("display", !1, !0)) : console.warn("Move Error - No matching row found:", e);
  }
  ///////////////////// Actions  /////////////////////
  delete() {
    return this.dispatch("row-delete", this), this.deleteActual(), Promise.resolve();
  }
  deleteActual(e) {
    this.detachModules(), this.table.rowManager.deleteRow(this, e), this.deleteCells(), this.initialized = !1, this.heightInitialized = !1, this.element = !1, this.dispatch("row-deleted", this);
  }
  detachModules() {
    this.dispatch("row-deleting", this);
  }
  deleteCells() {
    var e = this.cells.length;
    for (let t = 0; t < e; t++)
      this.cells[0].delete();
  }
  wipe() {
    if (this.detachModules(), this.deleteCells(), this.element) {
      for (; this.element.firstChild; ) this.element.removeChild(this.element.firstChild);
      this.element.parentNode && this.element.parentNode.removeChild(this.element);
    }
    this.element = !1, this.modules = {};
  }
  isDisplayed() {
    return this.table.rowManager.getDisplayRows().includes(this);
  }
  getPosition() {
    return this.isDisplayed() ? this.position : !1;
  }
  setPosition(e) {
    e != this.position && (this.position = e, this.positionWatchers.forEach((t) => {
      t(this.position);
    }));
  }
  watchPosition(e) {
    this.positionWatchers.push(e), e(this.position);
  }
  getGroup() {
    return this.modules.group || !1;
  }
  //////////////// Object Generation /////////////////
  getComponent() {
    return this.component || (this.component = new Ui(this)), this.component;
  }
}
var Xa = {
  avg: function(o, e, t) {
    var i = 0, s = typeof t.precision < "u" ? t.precision : 2;
    return o.length && (i = o.reduce(function(n, r) {
      return Number(n) + Number(r);
    }), i = i / o.length, i = s !== !1 ? i.toFixed(s) : i), parseFloat(i).toString();
  },
  max: function(o, e, t) {
    var i = null, s = typeof t.precision < "u" ? t.precision : !1;
    return o.forEach(function(n) {
      n = Number(n), (n > i || i === null) && (i = n);
    }), i !== null ? s !== !1 ? i.toFixed(s) : i : "";
  },
  min: function(o, e, t) {
    var i = null, s = typeof t.precision < "u" ? t.precision : !1;
    return o.forEach(function(n) {
      n = Number(n), (n < i || i === null) && (i = n);
    }), i !== null ? s !== !1 ? i.toFixed(s) : i : "";
  },
  sum: function(o, e, t) {
    var i = 0, s = typeof t.precision < "u" ? t.precision : !1;
    return o.length && o.forEach(function(n) {
      n = Number(n), i += isNaN(n) ? 0 : Number(n);
    }), s !== !1 ? i.toFixed(s) : i;
  },
  concat: function(o, e, t) {
    var i = 0;
    return o.length && (i = o.reduce(function(s, n) {
      return String(s) + String(n);
    })), i;
  },
  count: function(o, e, t) {
    var i = 0;
    return o.length && o.forEach(function(s) {
      s && i++;
    }), i;
  },
  unique: function(o, e, t) {
    var i = o.filter((s, n) => (o || s === 0) && o.indexOf(s) === n);
    return i.length;
  }
};
const $e = class $e extends A {
  constructor(e) {
    super(e), this.topCalcs = [], this.botCalcs = [], this.genColumn = !1, this.topElement = this.createElement(), this.botElement = this.createElement(), this.topRow = !1, this.botRow = !1, this.topInitialized = !1, this.botInitialized = !1, this.blocked = !1, this.recalcAfterBlock = !1, this.registerTableOption("columnCalcs", !0), this.registerColumnOption("topCalc"), this.registerColumnOption("topCalcParams"), this.registerColumnOption("topCalcFormatter"), this.registerColumnOption("topCalcFormatterParams"), this.registerColumnOption("bottomCalc"), this.registerColumnOption("bottomCalcParams"), this.registerColumnOption("bottomCalcFormatter"), this.registerColumnOption("bottomCalcFormatterParams");
  }
  createElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-calcs-holder"), e;
  }
  initialize() {
    this.genColumn = new gt({ field: "value" }, this), this.subscribe("cell-value-changed", this.cellValueChanged.bind(this)), this.subscribe("column-init", this.initializeColumnCheck.bind(this)), this.subscribe("row-deleted", this.rowsUpdated.bind(this)), this.subscribe("scroll-horizontal", this.scrollHorizontal.bind(this)), this.subscribe("row-added", this.rowsUpdated.bind(this)), this.subscribe("column-moved", this.recalcActiveRows.bind(this)), this.subscribe("column-add", this.recalcActiveRows.bind(this)), this.subscribe("data-refreshed", this.recalcActiveRowsRefresh.bind(this)), this.subscribe("table-redraw", this.tableRedraw.bind(this)), this.subscribe("rows-visible", this.visibleRows.bind(this)), this.subscribe("scrollbar-vertical", this.adjustForScrollbar.bind(this)), this.subscribe("redraw-blocked", this.blockRedraw.bind(this)), this.subscribe("redraw-restored", this.restoreRedraw.bind(this)), this.subscribe("table-redrawing", this.resizeHolderWidth.bind(this)), this.subscribe("column-resized", this.resizeHolderWidth.bind(this)), this.subscribe("column-show", this.resizeHolderWidth.bind(this)), this.subscribe("column-hide", this.resizeHolderWidth.bind(this)), this.registerTableFunction("getCalcResults", this.getResults.bind(this)), this.registerTableFunction("recalc", this.userRecalc.bind(this)), this.resizeHolderWidth();
  }
  resizeHolderWidth() {
    this.topElement.style.minWidth = this.table.columnManager.headersElement.offsetWidth + "px";
  }
  tableRedraw(e) {
    this.recalc(this.table.rowManager.activeRows), e && this.redraw();
  }
  blockRedraw() {
    this.blocked = !0, this.recalcAfterBlock = !1;
  }
  restoreRedraw() {
    this.blocked = !1, this.recalcAfterBlock && (this.recalcAfterBlock = !1, this.recalcActiveRowsRefresh());
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  userRecalc() {
    this.recalc(this.table.rowManager.activeRows);
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  blockCheck() {
    return this.blocked && (this.recalcAfterBlock = !0), this.blocked;
  }
  visibleRows(e, t) {
    return this.topRow && t.unshift(this.topRow), this.botRow && t.push(this.botRow), t;
  }
  rowsUpdated(e) {
    this.table.options.groupBy ? this.recalcRowGroup(e) : this.recalcActiveRows();
  }
  recalcActiveRowsRefresh() {
    this.table.options.groupBy && this.table.options.dataTreeStartExpanded && this.table.options.dataTree ? this.recalcAll() : this.recalcActiveRows();
  }
  recalcActiveRows() {
    this.recalc(this.table.rowManager.activeRows);
  }
  cellValueChanged(e) {
    (e.column.definition.topCalc || e.column.definition.bottomCalc) && (this.table.options.groupBy ? ((this.table.options.columnCalcs == "table" || this.table.options.columnCalcs == "both") && this.recalcActiveRows(), this.table.options.columnCalcs != "table" && this.recalcRowGroup(e.row)) : this.recalcActiveRows());
  }
  initializeColumnCheck(e) {
    (e.definition.topCalc || e.definition.bottomCalc) && this.initializeColumn(e);
  }
  //initialize column calcs
  initializeColumn(e) {
    var t = e.definition, i = {
      topCalcParams: t.topCalcParams || {},
      botCalcParams: t.bottomCalcParams || {}
    };
    if (t.topCalc) {
      switch (typeof t.topCalc) {
        case "string":
          $e.calculations[t.topCalc] ? i.topCalc = $e.calculations[t.topCalc] : console.warn("Column Calc Error - No such calculation found, ignoring: ", t.topCalc);
          break;
        case "function":
          i.topCalc = t.topCalc;
          break;
      }
      i.topCalc && (e.modules.columnCalcs = i, this.topCalcs.push(e), this.table.options.columnCalcs != "group" && this.initializeTopRow());
    }
    if (t.bottomCalc) {
      switch (typeof t.bottomCalc) {
        case "string":
          $e.calculations[t.bottomCalc] ? i.botCalc = $e.calculations[t.bottomCalc] : console.warn("Column Calc Error - No such calculation found, ignoring: ", t.bottomCalc);
          break;
        case "function":
          i.botCalc = t.bottomCalc;
          break;
      }
      i.botCalc && (e.modules.columnCalcs = i, this.botCalcs.push(e), this.table.options.columnCalcs != "group" && this.initializeBottomRow());
    }
  }
  //dummy functions to handle being mock column manager
  registerColumnField() {
  }
  removeCalcs() {
    var e = !1;
    this.topInitialized && (this.topInitialized = !1, this.topElement.parentNode.removeChild(this.topElement), e = !0), this.botInitialized && (this.botInitialized = !1, this.footerRemove(this.botElement), e = !0), e && this.table.rowManager.adjustTableSize();
  }
  reinitializeCalcs() {
    this.topCalcs.length && this.initializeTopRow(), this.botCalcs.length && this.initializeBottomRow();
  }
  initializeTopRow() {
    var e = document.createDocumentFragment();
    this.topInitialized || (e.appendChild(document.createElement("br")), e.appendChild(this.topElement), this.table.columnManager.getContentsElement().insertBefore(e, this.table.columnManager.headersElement.nextSibling), this.topInitialized = !0);
  }
  initializeBottomRow() {
    this.botInitialized || (this.footerPrepend(this.botElement), this.botInitialized = !0);
  }
  scrollHorizontal(e) {
    this.botInitialized && this.botRow && (this.botElement.scrollLeft = e);
  }
  recalc(e) {
    var t, i;
    if (!this.blockCheck() && (this.topInitialized || this.botInitialized)) {
      if (t = this.rowsToData(e), this.topInitialized) {
        for (this.topRow && this.topRow.deleteCells(), i = this.generateRow("top", t), this.topRow = i; this.topElement.firstChild; ) this.topElement.removeChild(this.topElement.firstChild);
        this.topElement.appendChild(i.getElement()), i.initialize(!0);
      }
      if (this.botInitialized) {
        for (this.botRow && this.botRow.deleteCells(), i = this.generateRow("bottom", t), this.botRow = i; this.botElement.firstChild; ) this.botElement.removeChild(this.botElement.firstChild);
        this.botElement.appendChild(i.getElement()), i.initialize(!0);
      }
      this.table.rowManager.adjustTableSize(), this.table.modExists("frozenColumns") && this.table.modules.frozenColumns.layout();
    }
  }
  recalcRowGroup(e) {
    this.recalcGroup(this.table.modules.groupRows.getRowGroup(e));
  }
  recalcAll() {
    if ((this.topCalcs.length || this.botCalcs.length) && (this.table.options.columnCalcs !== "group" && this.recalcActiveRows(), this.table.options.groupBy && this.table.options.columnCalcs !== "table")) {
      var e = this.table.modules.groupRows.getChildGroups();
      e.forEach((t) => {
        this.recalcGroup(t);
      });
    }
  }
  recalcGroup(e) {
    var t, i;
    this.blockCheck() || e && e.calcs && (e.calcs.bottom && (t = this.rowsToData(e.rows), i = this.generateRowData("bottom", t), e.calcs.bottom.updateData(i), e.calcs.bottom.reinitialize()), e.calcs.top && (t = this.rowsToData(e.rows), i = this.generateRowData("top", t), e.calcs.top.updateData(i), e.calcs.top.reinitialize()));
  }
  //generate top stats row
  generateTopRow(e) {
    return this.generateRow("top", this.rowsToData(e));
  }
  //generate bottom stats row
  generateBottomRow(e) {
    return this.generateRow("bottom", this.rowsToData(e));
  }
  rowsToData(e) {
    var t = [], i = this.table.options.dataTree && this.table.options.dataTreeChildColumnCalcs, s = this.table.modules.dataTree;
    return e.forEach((n) => {
      var r;
      t.push(n.getData()), i && ((r = n.modules.dataTree) != null && r.open) && this.rowsToData(s.getFilteredTreeChildren(n)).forEach((a) => {
        t.push(n);
      });
    }), t;
  }
  //generate stats row
  generateRow(e, t) {
    var i = this.generateRowData(e, t), s;
    return this.table.modExists("mutator") && this.table.modules.mutator.disable(), s = new ae(i, this, "calc"), this.table.modExists("mutator") && this.table.modules.mutator.enable(), s.getElement().classList.add("tabulator-calcs", "tabulator-calcs-" + e), s.component = !1, s.getComponent = () => (s.component || (s.component = new $a(s)), s.component), s.generateCells = () => {
      var n = [];
      this.table.columnManager.columnsByIndex.forEach((r) => {
        this.genColumn.setField(r.getField()), this.genColumn.hozAlign = r.hozAlign, r.definition[e + "CalcFormatter"] && this.table.modExists("format") ? this.genColumn.modules.format = {
          formatter: this.table.modules.format.lookupFormatter(r.definition[e + "CalcFormatter"]),
          params: r.definition[e + "CalcFormatterParams"] || {}
        } : this.genColumn.modules.format = {
          formatter: this.table.modules.format.lookupFormatter("plaintext"),
          params: {}
        }, this.genColumn.definition.cssClass = r.definition.cssClass;
        var a = new ui(this.genColumn, s);
        a.getElement(), a.column = r, a.setWidth(), r.cells.push(a), n.push(a), r.visible || a.hide();
      }), s.cells = n;
    }, s;
  }
  //generate stats row
  generateRowData(e, t) {
    var i = {}, s = e == "top" ? this.topCalcs : this.botCalcs, n = e == "top" ? "topCalc" : "botCalc", r, a;
    return s.forEach(function(l) {
      var h = [];
      l.modules.columnCalcs && l.modules.columnCalcs[n] && (t.forEach(function(d) {
        h.push(l.getFieldValue(d));
      }), a = n + "Params", r = typeof l.modules.columnCalcs[a] == "function" ? l.modules.columnCalcs[a](h, t) : l.modules.columnCalcs[a], l.setFieldValue(i, l.modules.columnCalcs[n](h, t, r)));
    }), i;
  }
  hasTopCalcs() {
    return !!this.topCalcs.length;
  }
  hasBottomCalcs() {
    return !!this.botCalcs.length;
  }
  //handle table redraw
  redraw() {
    this.topRow && this.topRow.normalizeHeight(!0), this.botRow && this.botRow.normalizeHeight(!0);
  }
  //return the calculated
  getResults() {
    var e = {}, t;
    return this.table.options.groupBy && this.table.modExists("groupRows") ? (t = this.table.modules.groupRows.getGroups(!0), t.forEach((i) => {
      e[i.getKey()] = this.getGroupResults(i);
    })) : e = {
      top: this.topRow ? this.topRow.getData() : {},
      bottom: this.botRow ? this.botRow.getData() : {}
    }, e;
  }
  //get results from a group
  getGroupResults(e) {
    var t = e._getSelf(), i = e.getSubGroups(), s = {}, n = {};
    return i.forEach((r) => {
      s[r.getKey()] = this.getGroupResults(r);
    }), n = {
      top: t.calcs.top ? t.calcs.top.getData() : {},
      bottom: t.calcs.bottom ? t.calcs.bottom.getData() : {},
      groups: s
    }, n;
  }
  adjustForScrollbar(e) {
    this.botRow && (this.table.rtl ? this.botElement.style.paddingLeft = e + "px" : this.botElement.style.paddingRight = e + "px");
  }
};
C($e, "moduleName", "columnCalcs"), //load defaults
C($e, "calculations", Xa);
let Ss = $e;
class hr extends A {
  constructor(e) {
    super(e), this.indent = 10, this.field = "", this.collapseEl = null, this.expandEl = null, this.branchEl = null, this.elementField = !1, this.startOpen = function() {
    }, this.registerTableOption("dataTree", !1), this.registerTableOption("dataTreeFilter", !0), this.registerTableOption("dataTreeSort", !0), this.registerTableOption("dataTreeElementColumn", !1), this.registerTableOption("dataTreeBranchElement", !0), this.registerTableOption("dataTreeChildIndent", 9), this.registerTableOption("dataTreeChildField", "_children"), this.registerTableOption("dataTreeCollapseElement", !1), this.registerTableOption("dataTreeExpandElement", !1), this.registerTableOption("dataTreeStartExpanded", !1), this.registerTableOption("dataTreeChildColumnCalcs", !1), this.registerTableOption("dataTreeSelectPropagate", !1), this.registerComponentFunction("row", "treeCollapse", this.collapseRow.bind(this)), this.registerComponentFunction("row", "treeExpand", this.expandRow.bind(this)), this.registerComponentFunction("row", "treeToggle", this.toggleRow.bind(this)), this.registerComponentFunction("row", "getTreeParent", this.getTreeParent.bind(this)), this.registerComponentFunction("row", "getTreeChildren", this.getRowChildren.bind(this)), this.registerComponentFunction("row", "addTreeChild", this.addTreeChildRow.bind(this)), this.registerComponentFunction("row", "isTreeExpanded", this.isRowExpanded.bind(this));
  }
  initialize() {
    if (this.table.options.dataTree) {
      var e = null, t = this.table.options;
      switch (this.field = t.dataTreeChildField, this.indent = t.dataTreeChildIndent, this.options("movableRows") && console.warn("The movableRows option is not available with dataTree enabled, moving of child rows could result in unpredictable behavior"), t.dataTreeBranchElement ? t.dataTreeBranchElement === !0 ? (this.branchEl = document.createElement("div"), this.branchEl.classList.add("tabulator-data-tree-branch")) : typeof t.dataTreeBranchElement == "string" ? (e = document.createElement("div"), e.innerHTML = t.dataTreeBranchElement, this.branchEl = e.firstChild) : this.branchEl = t.dataTreeBranchElement : (this.branchEl = document.createElement("div"), this.branchEl.classList.add("tabulator-data-tree-branch-empty")), t.dataTreeCollapseElement ? typeof t.dataTreeCollapseElement == "string" ? (e = document.createElement("div"), e.innerHTML = t.dataTreeCollapseElement, this.collapseEl = e.firstChild) : this.collapseEl = t.dataTreeCollapseElement : (this.collapseEl = document.createElement("div"), this.collapseEl.classList.add("tabulator-data-tree-control"), this.collapseEl.tabIndex = 0, this.collapseEl.innerHTML = "<div class='tabulator-data-tree-control-collapse'></div>"), t.dataTreeExpandElement ? typeof t.dataTreeExpandElement == "string" ? (e = document.createElement("div"), e.innerHTML = t.dataTreeExpandElement, this.expandEl = e.firstChild) : this.expandEl = t.dataTreeExpandElement : (this.expandEl = document.createElement("div"), this.expandEl.classList.add("tabulator-data-tree-control"), this.expandEl.tabIndex = 0, this.expandEl.innerHTML = "<div class='tabulator-data-tree-control-expand'></div>"), typeof t.dataTreeStartExpanded) {
        case "boolean":
          this.startOpen = function(i, s) {
            return t.dataTreeStartExpanded;
          };
          break;
        case "function":
          this.startOpen = t.dataTreeStartExpanded;
          break;
        default:
          this.startOpen = function(i, s) {
            return t.dataTreeStartExpanded[s];
          };
          break;
      }
      this.subscribe("row-init", this.initializeRow.bind(this)), this.subscribe("row-layout-after", this.layoutRow.bind(this)), this.subscribe("row-deleting", this.rowDeleting.bind(this)), this.subscribe("row-deleted", this.rowDelete.bind(this), 0), this.subscribe("row-data-changed", this.rowDataChanged.bind(this), 10), this.subscribe("cell-value-updated", this.cellValueChanged.bind(this)), this.subscribe("edit-cancelled", this.cellValueChanged.bind(this)), this.subscribe("column-moving-rows", this.columnMoving.bind(this)), this.subscribe("table-built", this.initializeElementField.bind(this)), this.subscribe("table-redrawing", this.tableRedrawing.bind(this)), this.registerDisplayHandler(this.getRows.bind(this), 30);
    }
  }
  tableRedrawing(e) {
    var t;
    e && (t = this.table.rowManager.getRows(), t.forEach((i) => {
      this.reinitializeRowChildren(i);
    }));
  }
  initializeElementField() {
    var e = this.table.columnManager.getFirstVisibleColumn();
    this.elementField = this.table.options.dataTreeElementColumn || (e ? e.field : !1);
  }
  getRowChildren(e) {
    return this.getTreeChildren(e, !0);
  }
  columnMoving() {
    var e = [];
    return this.table.rowManager.rows.forEach((t) => {
      e = e.concat(this.getTreeChildren(t, !1, !0));
    }), e;
  }
  rowDataChanged(e, t, i) {
    this.redrawNeeded(i) && (this.initializeRow(e), t && (this.layoutRow(e), this.refreshData(!0)));
  }
  cellValueChanged(e) {
    var t = e.column.getField();
    t === this.elementField && this.layoutRow(e.row);
  }
  initializeRow(e) {
    var t = e.getData()[this.field], i = Array.isArray(t), s = i || !i && typeof t == "object" && t !== null;
    !s && e.modules.dataTree && e.modules.dataTree.branchEl && e.modules.dataTree.branchEl.parentNode.removeChild(e.modules.dataTree.branchEl), !s && e.modules.dataTree && e.modules.dataTree.controlEl && e.modules.dataTree.controlEl.parentNode.removeChild(e.modules.dataTree.controlEl), e.modules.dataTree = {
      index: e.modules.dataTree ? e.modules.dataTree.index : 0,
      open: s ? e.modules.dataTree ? e.modules.dataTree.open : this.startOpen(e.getComponent(), 0) : !1,
      controlEl: e.modules.dataTree && s ? e.modules.dataTree.controlEl : !1,
      branchEl: e.modules.dataTree && s ? e.modules.dataTree.branchEl : !1,
      parent: e.modules.dataTree ? e.modules.dataTree.parent : !1,
      children: s
    };
  }
  reinitializeRowChildren(e) {
    var t = this.getTreeChildren(e, !1, !0);
    t.forEach(function(i) {
      i.reinitialize(!0);
    });
  }
  layoutRow(e) {
    var t = this.elementField ? e.getCell(this.elementField) : e.getCells()[0], i = t.getElement(), s = e.modules.dataTree;
    s.branchEl && (s.branchEl.parentNode && s.branchEl.parentNode.removeChild(s.branchEl), s.branchEl = !1), s.controlEl && (s.controlEl.parentNode && s.controlEl.parentNode.removeChild(s.controlEl), s.controlEl = !1), this.generateControlElement(e, i), e.getElement().classList.add("tabulator-tree-level-" + s.index), s.index && (this.branchEl ? (s.branchEl = this.branchEl.cloneNode(!0), i.insertBefore(s.branchEl, i.firstChild), this.table.rtl ? s.branchEl.style.marginRight = (s.branchEl.offsetWidth + s.branchEl.style.marginLeft) * (s.index - 1) + s.index * this.indent + "px" : s.branchEl.style.marginLeft = (s.branchEl.offsetWidth + s.branchEl.style.marginRight) * (s.index - 1) + s.index * this.indent + "px") : this.table.rtl ? i.style.paddingRight = parseInt(window.getComputedStyle(i, null).getPropertyValue("padding-right")) + s.index * this.indent + "px" : i.style.paddingLeft = parseInt(window.getComputedStyle(i, null).getPropertyValue("padding-left")) + s.index * this.indent + "px");
  }
  generateControlElement(e, t) {
    var i = e.modules.dataTree, s = i.controlEl;
    t = t || e.getCells()[0].getElement(), i.children !== !1 && (i.open ? (i.controlEl = this.collapseEl.cloneNode(!0), i.controlEl.addEventListener("click", (n) => {
      n.stopPropagation(), this.collapseRow(e);
    })) : (i.controlEl = this.expandEl.cloneNode(!0), i.controlEl.addEventListener("click", (n) => {
      n.stopPropagation(), this.expandRow(e);
    })), i.controlEl.addEventListener("mousedown", (n) => {
      n.stopPropagation();
    }), s && s.parentNode === t ? s.parentNode.replaceChild(i.controlEl, s) : t.insertBefore(i.controlEl, t.firstChild));
  }
  getRows(e) {
    var t = [];
    return e.forEach((i, s) => {
      var n, r;
      t.push(i), i instanceof ae && (i.create(), n = i.modules.dataTree, !n.index && n.children !== !1 && (r = this.getChildren(i, !1, !0), r.forEach((a) => {
        a.create(), t.push(a);
      })));
    }), t;
  }
  getChildren(e, t, i) {
    var s = e.modules.dataTree, n = [], r = [];
    return s.children !== !1 && (s.open || t) && (Array.isArray(s.children) || (s.children = this.generateChildren(e)), this.table.modExists("filter") && this.table.options.dataTreeFilter ? n = this.table.modules.filter.filter(s.children) : n = s.children, this.table.modExists("sort") && this.table.options.dataTreeSort && this.table.modules.sort.sort(n, i), n.forEach((a) => {
      r.push(a);
      var l = this.getChildren(a, !1, !0);
      l.forEach((h) => {
        r.push(h);
      });
    })), r;
  }
  generateChildren(e) {
    var t = [], i = e.getData()[this.field];
    return Array.isArray(i) || (i = [i]), i.forEach((s) => {
      var n = new ae(s || {}, this.table.rowManager);
      n.create(), n.modules.dataTree.index = e.modules.dataTree.index + 1, n.modules.dataTree.parent = e, n.modules.dataTree.children && (n.modules.dataTree.open = this.startOpen(n.getComponent(), n.modules.dataTree.index)), t.push(n);
    }), t;
  }
  expandRow(e, t) {
    var i = e.modules.dataTree;
    i.children !== !1 && (i.open = !0, e.reinitialize(), this.refreshData(!0), this.dispatchExternal("dataTreeRowExpanded", e.getComponent(), e.modules.dataTree.index));
  }
  collapseRow(e) {
    var t = e.modules.dataTree;
    t.children !== !1 && (t.open = !1, e.reinitialize(), this.refreshData(!0), this.dispatchExternal("dataTreeRowCollapsed", e.getComponent(), e.modules.dataTree.index));
  }
  toggleRow(e) {
    var t = e.modules.dataTree;
    t.children !== !1 && (t.open ? this.collapseRow(e) : this.expandRow(e));
  }
  isRowExpanded(e) {
    return e.modules.dataTree.open;
  }
  getTreeParent(e) {
    return e.modules.dataTree.parent ? e.modules.dataTree.parent.getComponent() : !1;
  }
  getTreeParentRoot(e) {
    return e.modules.dataTree && e.modules.dataTree.parent ? this.getTreeParentRoot(e.modules.dataTree.parent) : e;
  }
  getFilteredTreeChildren(e) {
    var t = e.modules.dataTree, i = [], s;
    return t.children && (Array.isArray(t.children) || (t.children = this.generateChildren(e)), this.table.modExists("filter") && this.table.options.dataTreeFilter ? s = this.table.modules.filter.filter(t.children) : s = t.children, s.forEach((n) => {
      n instanceof ae && i.push(n);
    })), i;
  }
  rowDeleting(e) {
    var t = e.modules.dataTree;
    t && t.children && Array.isArray(t.children) && t.children.forEach((i) => {
      i instanceof ae && i.wipe();
    });
  }
  rowDelete(e) {
    var t = e.modules.dataTree.parent, i;
    t && (i = this.findChildIndex(e, t), i !== !1 && t.data[this.field].splice(i, 1), t.data[this.field].length || delete t.data[this.field], this.initializeRow(t), this.layoutRow(t)), this.refreshData(!0);
  }
  addTreeChildRow(e, t, i, s) {
    var n = !1;
    typeof t == "string" && (t = JSON.parse(t)), Array.isArray(e.data[this.field]) || (e.data[this.field] = [], e.modules.dataTree.open = this.startOpen(e.getComponent(), e.modules.dataTree.index)), typeof s < "u" && (n = this.findChildIndex(s, e), n !== !1 && e.data[this.field].splice(i ? n : n + 1, 0, t)), n === !1 && (i ? e.data[this.field].unshift(t) : e.data[this.field].push(t)), this.initializeRow(e), this.layoutRow(e), this.refreshData(!0);
  }
  findChildIndex(e, t) {
    var i = !1;
    return typeof e == "object" ? e instanceof ae ? i = e.data : e instanceof Ui ? i = e._getSelf().data : typeof HTMLElement < "u" && e instanceof HTMLElement ? t.modules.dataTree && (i = t.modules.dataTree.children.find((s) => s instanceof ae ? s.element === e : !1), i && (i = i.data)) : e === null && (i = !1) : typeof e > "u" ? i = !1 : i = t.data[this.field].find((s) => s.data[this.table.options.index] == e), i && (Array.isArray(t.data[this.field]) && (i = t.data[this.field].indexOf(i)), i == -1 && (i = !1)), i;
  }
  getTreeChildren(e, t, i) {
    var s = e.modules.dataTree, n = [];
    return s && s.children && (Array.isArray(s.children) || (s.children = this.generateChildren(e)), s.children.forEach((r) => {
      r instanceof ae && (n.push(t ? r.getComponent() : r), i && this.getTreeChildren(r, t, i).forEach((a) => {
        n.push(a);
      }));
    })), n;
  }
  getChildField() {
    return this.field;
  }
  redrawNeeded(e) {
    return (this.field ? typeof e[this.field] < "u" : !1) || (this.elementField ? typeof e[this.elementField] < "u" : !1);
  }
}
C(hr, "moduleName", "dataTree");
function Ya(o, e = {}, t) {
  var i = e.delimiter ? e.delimiter : ",", s = [], n = [];
  o.forEach((r) => {
    var a = [];
    switch (r.type) {
      case "group":
        console.warn("Download Warning - CSV downloader cannot process row groups");
        break;
      case "calc":
        console.warn("Download Warning - CSV downloader cannot process column calculations");
        break;
      case "header":
        r.columns.forEach((l, h) => {
          l && l.depth === 1 && (n[h] = typeof l.value > "u" || l.value === null ? "" : '"' + String(l.value).split('"').join('""') + '"');
        });
        break;
      case "row":
        r.columns.forEach((l) => {
          if (l) {
            switch (typeof l.value) {
              case "object":
                l.value = l.value !== null ? JSON.stringify(l.value) : "";
                break;
              case "undefined":
                l.value = "";
                break;
            }
            a.push('"' + String(l.value).split('"').join('""') + '"');
          }
        }), s.push(a.join(i));
        break;
    }
  }), n.length && s.unshift(n.join(i)), s = s.join(`
`), e.bom && (s = "\uFEFF" + s), t(s, "text/csv");
}
function Ka(o, e, t) {
  var i = [];
  o.forEach((s) => {
    var n = {};
    switch (s.type) {
      case "header":
        break;
      case "group":
        console.warn("Download Warning - JSON downloader cannot process row groups");
        break;
      case "calc":
        console.warn("Download Warning - JSON downloader cannot process column calculations");
        break;
      case "row":
        s.columns.forEach((r) => {
          r && (n[r.component.getTitleDownload() || r.component.getField()] = r.value);
        }), i.push(n);
        break;
    }
  }), i = JSON.stringify(i, null, "	"), t(i, "application/json");
}
function qa(o, e = {}, t) {
  var i = [], s = [], n = {}, r = e.rowGroupStyles || {
    fontStyle: "bold",
    fontSize: 12,
    cellPadding: 6,
    fillColor: 220
  }, a = e.rowCalcStyles || {
    fontStyle: "bold",
    fontSize: 10,
    cellPadding: 4,
    fillColor: 232
  }, l = e.jsPDF || {}, h = e.title ? e.title : "", d, c;
  l.orientation || (l.orientation = e.orientation || "landscape"), l.unit || (l.unit = "pt"), o.forEach((f) => {
    switch (f.type) {
      case "header":
        i.push(u(f));
        break;
      case "group":
        s.push(u(f, r));
        break;
      case "calc":
        s.push(u(f, a));
        break;
      case "row":
        s.push(u(f));
        break;
    }
  });
  function u(f, p) {
    var g = [];
    return f.columns.forEach((m) => {
      var v;
      if (m) {
        switch (typeof m.value) {
          case "object":
            m.value = m.value !== null ? JSON.stringify(m.value) : "";
            break;
          case "undefined":
            m.value = "";
            break;
        }
        v = {
          content: m.value,
          colSpan: m.width,
          rowSpan: m.height
        }, p && (v.styles = p), g.push(v);
      }
    }), g;
  }
  d = this.dependencyRegistry.lookup("jspdf", "jsPDF"), c = new d(l), e.autoTable && (typeof e.autoTable == "function" ? n = e.autoTable(c) || {} : n = e.autoTable), h && (n.didDrawPage = function(f) {
    c.text(h, 40, 30);
  }), n.head = i, n.body = s, c.autoTable(n), e.documentProcessing && e.documentProcessing(c), t(c.output("arraybuffer"), "application/pdf");
}
function Ja(o, e, t) {
  var i = this, s = e.sheetName || "Sheet1", n = this.dependencyRegistry.lookup("XLSX"), r = n.utils.book_new(), a = new oe(this), l = "compress" in e ? e.compress : !0, h = e.writeOptions || { bookType: "xlsx", bookSST: !0, compression: l }, d;
  h.type = "binary", r.SheetNames = [], r.Sheets = {};
  function c() {
    var p = [], g = [], m = {}, v = { s: { c: 0, r: 0 }, e: { c: o[0] ? o[0].columns.reduce((x, E) => x + (E && E.width ? E.width : 1), 0) : 0, r: o.length } };
    return o.forEach((x, E) => {
      var k = [];
      x.columns.forEach(function(y, S) {
        y ? (k.push(!(y.value instanceof Date) && typeof y.value == "object" ? JSON.stringify(y.value) : y.value), (y.width > 1 || y.height > -1) && (y.height > 1 || y.width > 1) && g.push({ s: { r: E, c: S }, e: { r: E + y.height - 1, c: S + y.width - 1 } })) : k.push("");
      }), p.push(k);
    }), n.utils.sheet_add_aoa(m, p), m["!ref"] = n.utils.encode_range(v), g.length && (m["!merges"] = g), m;
  }
  if (e.sheetOnly) {
    t(c());
    return;
  }
  if (e.sheets)
    for (var u in e.sheets)
      e.sheets[u] === !0 ? (r.SheetNames.push(u), r.Sheets[u] = c()) : (r.SheetNames.push(u), a.commsSend(e.sheets[u], "download", "intercept", {
        type: "xlsx",
        options: { sheetOnly: !0 },
        active: i.active,
        intercept: function(p) {
          r.Sheets[u] = p;
        }
      }));
  else
    r.SheetNames.push(s), r.Sheets[s] = c();
  e.documentProcessing && (r = e.documentProcessing(r));
  function f(p) {
    for (var g = new ArrayBuffer(p.length), m = new Uint8Array(g), v = 0; v != p.length; ++v) m[v] = p.charCodeAt(v) & 255;
    return g;
  }
  d = n.write(r, h), t(f(d), "application/octet-stream");
}
function Qa(o, e, t) {
  this.modExists("export", !0) && t(this.modules.export.generateHTMLTable(o), "text/html");
}
function Za(o, e, t) {
  const i = [];
  o.forEach((s) => {
    const n = {};
    switch (s.type) {
      case "header":
        break;
      case "group":
        console.warn("Download Warning - JSON downloader cannot process row groups");
        break;
      case "calc":
        console.warn("Download Warning - JSON downloader cannot process column calculations");
        break;
      case "row":
        s.columns.forEach((r) => {
          r && (n[r.component.getTitleDownload() || r.component.getField()] = r.value);
        }), i.push(JSON.stringify(n));
        break;
    }
  }), t(i.join(`
`), "application/x-ndjson");
}
var el = {
  csv: Ya,
  json: Ka,
  jsonLines: Za,
  pdf: qa,
  xlsx: Ja,
  html: Qa
};
const kt = class kt extends A {
  constructor(e) {
    super(e), this.registerTableOption("downloadEncoder", function(t, i) {
      return new Blob([t], { type: i });
    }), this.registerTableOption("downloadConfig", {}), this.registerTableOption("downloadRowRange", "active"), this.registerColumnOption("download"), this.registerColumnOption("titleDownload");
  }
  initialize() {
    this.deprecatedOptionsCheck(), this.registerTableFunction("download", this.download.bind(this)), this.registerTableFunction("downloadToTab", this.downloadToTab.bind(this));
  }
  deprecatedOptionsCheck() {
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  downloadToTab(e, t, i, s) {
    this.download(e, t, i, s, !0);
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  //trigger file download
  download(e, t, i, s, n) {
    var r = !1;
    function a(h, d) {
      n ? n === !0 ? this.triggerDownload(h, d, e, t, !0) : n(h) : this.triggerDownload(h, d, e, t);
    }
    if (typeof e == "function" ? r = e : kt.downloaders[e] ? r = kt.downloaders[e] : console.warn("Download Error - No such download type found: ", e), r) {
      var l = this.generateExportList(s);
      r.call(this.table, l, i || {}, a.bind(this));
    }
  }
  generateExportList(e) {
    var t = this.table.modules.export.generateExportList(this.table.options.downloadConfig, !1, e || this.table.options.downloadRowRange, "download"), i = this.table.options.groupHeaderDownload;
    return i && !Array.isArray(i) && (i = [i]), t.forEach((s) => {
      var n;
      s.type === "group" && (n = s.columns[0], i && i[s.indent] && (n.value = i[s.indent](n.value, s.component._group.getRowCount(), s.component._group.getData(), s.component)));
    }), t;
  }
  triggerDownload(e, t, i, s, n) {
    var r = document.createElement("a"), a = this.table.options.downloadEncoder(e, t);
    a && (n ? window.open(window.URL.createObjectURL(a)) : (s = s || "Tabulator." + (typeof i == "function" ? "txt" : i), navigator.msSaveOrOpenBlob ? navigator.msSaveOrOpenBlob(a, s) : (r.setAttribute("href", window.URL.createObjectURL(a)), r.setAttribute("download", s), r.style.display = "none", document.body.appendChild(r), r.click(), document.body.removeChild(r))), this.dispatchExternal("downloadComplete"));
  }
  commsReceived(e, t, i) {
    switch (t) {
      case "intercept":
        this.download(i.type, "", i.options, i.active, i.intercept);
        break;
    }
  }
};
C(kt, "moduleName", "download"), //load defaults
C(kt, "downloaders", el);
let Ls = kt;
function $i(o, e) {
  var t = e.mask, i = typeof e.maskLetterChar < "u" ? e.maskLetterChar : "A", s = typeof e.maskNumberChar < "u" ? e.maskNumberChar : "9", n = typeof e.maskWildcardChar < "u" ? e.maskWildcardChar : "*";
  function r(a) {
    var l = t[a];
    typeof l < "u" && l !== n && l !== i && l !== s && (o.value = o.value + "" + l, r(a + 1));
  }
  o.addEventListener("keydown", (a) => {
    var l = o.value.length, h = a.key;
    if (a.keyCode > 46 && !a.ctrlKey && !a.metaKey) {
      if (l >= t.length)
        return a.preventDefault(), a.stopPropagation(), !1;
      switch (t[l]) {
        case i:
          if (h.toUpperCase() == h.toLowerCase())
            return a.preventDefault(), a.stopPropagation(), !1;
          break;
        case s:
          if (isNaN(h))
            return a.preventDefault(), a.stopPropagation(), !1;
          break;
        case n:
          break;
        default:
          if (h !== t[l])
            return a.preventDefault(), a.stopPropagation(), !1;
      }
    }
  }), o.addEventListener("keyup", (a) => {
    a.keyCode > 46 && e.maskAutoFill && r(o.value.length);
  }), o.placeholder || (o.placeholder = t), e.maskAutoFill && r(o.value.length);
}
function tl(o, e, t, i, s) {
  var n = o.getValue(), r = document.createElement("input");
  if (r.setAttribute("type", s.search ? "search" : "text"), r.style.padding = "4px", r.style.width = "100%", r.style.boxSizing = "border-box", s.elementAttributes && typeof s.elementAttributes == "object")
    for (let l in s.elementAttributes)
      l.charAt(0) == "+" ? (l = l.slice(1), r.setAttribute(l, r.getAttribute(l) + s.elementAttributes["+" + l])) : r.setAttribute(l, s.elementAttributes[l]);
  r.value = typeof n < "u" ? n : "", e(function() {
    o.getType() === "cell" && (r.focus({ preventScroll: !0 }), r.style.height = "100%", s.selectContents && r.select());
  });
  function a(l) {
    (n === null || typeof n > "u") && r.value !== "" || r.value !== n ? t(r.value) && (n = r.value) : i();
  }
  return r.addEventListener("change", a), r.addEventListener("blur", a), r.addEventListener("keydown", function(l) {
    switch (l.keyCode) {
      case 13:
        a();
        break;
      case 27:
        i();
        break;
      case 35:
      case 36:
        l.stopPropagation();
        break;
    }
  }), s.mask && $i(r, s), r;
}
function il(o, e, t, i, s) {
  var n = o.getValue(), r = s.verticalNavigation || "hybrid", a = String(n !== null && typeof n < "u" ? n : ""), l = document.createElement("textarea"), h = 0;
  if (l.style.display = "block", l.style.padding = "2px", l.style.height = "100%", l.style.width = "100%", l.style.boxSizing = "border-box", l.style.whiteSpace = "pre-wrap", l.style.resize = "none", s.elementAttributes && typeof s.elementAttributes == "object")
    for (let c in s.elementAttributes)
      c.charAt(0) == "+" ? (c = c.slice(1), l.setAttribute(c, l.getAttribute(c) + s.elementAttributes["+" + c])) : l.setAttribute(c, s.elementAttributes[c]);
  l.value = a, e(function() {
    o.getType() === "cell" && (l.focus({ preventScroll: !0 }), l.style.height = "100%", l.scrollHeight, l.style.height = l.scrollHeight + "px", o.getRow().normalizeHeight(), s.selectContents && l.select());
  });
  function d(c) {
    (n === null || typeof n > "u") && l.value !== "" || l.value !== n ? (t(l.value) && (n = l.value), setTimeout(function() {
      o.getRow().normalizeHeight();
    }, 300)) : i();
  }
  return l.addEventListener("change", d), l.addEventListener("blur", d), l.addEventListener("keyup", function() {
    l.style.height = "";
    var c = l.scrollHeight;
    l.style.height = c + "px", c != h && (h = c, o.getRow().normalizeHeight());
  }), l.addEventListener("keydown", function(c) {
    switch (c.keyCode) {
      case 13:
        c.shiftKey && s.shiftEnterSubmit && d();
        break;
      case 27:
        i();
        break;
      case 38:
        (r == "editor" || r == "hybrid" && l.selectionStart) && (c.stopImmediatePropagation(), c.stopPropagation());
        break;
      case 40:
        (r == "editor" || r == "hybrid" && l.selectionStart !== l.value.length) && (c.stopImmediatePropagation(), c.stopPropagation());
        break;
      case 35:
      case 36:
        c.stopPropagation();
        break;
    }
  }), s.mask && $i(l, s), l;
}
function sl(o, e, t, i, s) {
  var n = o.getValue(), r = s.verticalNavigation || "editor", a = document.createElement("input");
  if (a.setAttribute("type", "number"), typeof s.max < "u" && a.setAttribute("max", s.max), typeof s.min < "u" && a.setAttribute("min", s.min), typeof s.step < "u" && a.setAttribute("step", s.step), a.style.padding = "4px", a.style.width = "100%", a.style.boxSizing = "border-box", s.elementAttributes && typeof s.elementAttributes == "object")
    for (let d in s.elementAttributes)
      d.charAt(0) == "+" ? (d = d.slice(1), a.setAttribute(d, a.getAttribute(d) + s.elementAttributes["+" + d])) : a.setAttribute(d, s.elementAttributes[d]);
  a.value = n;
  var l = function(d) {
    h();
  };
  e(function() {
    o.getType() === "cell" && (a.removeEventListener("blur", l), a.focus({ preventScroll: !0 }), a.style.height = "100%", a.addEventListener("blur", l), s.selectContents && a.select());
  });
  function h() {
    var d = a.value;
    !isNaN(d) && d !== "" && (d = Number(d)), d !== n ? t(d) && (n = d) : i();
  }
  return a.addEventListener("keydown", function(d) {
    switch (d.keyCode) {
      case 13:
        h();
        break;
      case 27:
        i();
        break;
      case 38:
      case 40:
        r == "editor" && (d.stopImmediatePropagation(), d.stopPropagation());
        break;
      case 35:
      case 36:
        d.stopPropagation();
        break;
    }
  }), s.mask && $i(a, s), a;
}
function nl(o, e, t, i, s) {
  var n = o.getValue(), r = document.createElement("input");
  if (r.setAttribute("type", "range"), typeof s.max < "u" && r.setAttribute("max", s.max), typeof s.min < "u" && r.setAttribute("min", s.min), typeof s.step < "u" && r.setAttribute("step", s.step), r.style.padding = "4px", r.style.width = "100%", r.style.boxSizing = "border-box", s.elementAttributes && typeof s.elementAttributes == "object")
    for (let l in s.elementAttributes)
      l.charAt(0) == "+" ? (l = l.slice(1), r.setAttribute(l, r.getAttribute(l) + s.elementAttributes["+" + l])) : r.setAttribute(l, s.elementAttributes[l]);
  r.value = n, e(function() {
    o.getType() === "cell" && (r.focus({ preventScroll: !0 }), r.style.height = "100%");
  });
  function a() {
    var l = r.value;
    !isNaN(l) && l !== "" && (l = Number(l)), l != n ? t(l) && (n = l) : i();
  }
  return r.addEventListener("blur", function(l) {
    a();
  }), r.addEventListener("keydown", function(l) {
    switch (l.keyCode) {
      case 13:
        a();
        break;
      case 27:
        i();
        break;
    }
  }), r;
}
function ol(o, e, t, i, s) {
  var n = s.format, r = s.verticalNavigation || "editor", a = n ? window.DateTime || luxon.DateTime : null, l = o.getValue(), h = document.createElement("input");
  function d(u) {
    var f;
    return a.isDateTime(u) ? f = u : n === "iso" ? f = a.fromISO(String(u)) : f = a.fromFormat(String(u), n), f.toFormat("yyyy-MM-dd");
  }
  if (h.type = "date", h.style.padding = "4px", h.style.width = "100%", h.style.boxSizing = "border-box", s.max && h.setAttribute("max", n ? d(s.max) : s.max), s.min && h.setAttribute("min", n ? d(s.min) : s.min), s.elementAttributes && typeof s.elementAttributes == "object")
    for (let u in s.elementAttributes)
      u.charAt(0) == "+" ? (u = u.slice(1), h.setAttribute(u, h.getAttribute(u) + s.elementAttributes["+" + u])) : h.setAttribute(u, s.elementAttributes[u]);
  l = typeof l < "u" ? l : "", n && (a ? l = d(l) : console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js")), h.value = l, e(function() {
    o.getType() === "cell" && (h.focus({ preventScroll: !0 }), h.style.height = "100%", s.selectContents && h.select());
  });
  function c() {
    var u = h.value, f;
    if ((l === null || typeof l > "u") && u !== "" || u !== l) {
      if (u && n)
        switch (f = a.fromFormat(String(u), "yyyy-MM-dd"), n) {
          case !0:
            u = f;
            break;
          case "iso":
            u = f.toISO();
            break;
          default:
            u = f.toFormat(n);
        }
      t(u) && (l = h.value);
    } else
      i();
  }
  return h.addEventListener("blur", function(u) {
    (u.relatedTarget || u.rangeParent || u.explicitOriginalTarget !== h) && c();
  }), h.addEventListener("keydown", function(u) {
    switch (u.keyCode) {
      case 13:
        c();
        break;
      case 27:
        i();
        break;
      case 35:
      case 36:
        u.stopPropagation();
        break;
      case 38:
      case 40:
        r == "editor" && (u.stopImmediatePropagation(), u.stopPropagation());
        break;
    }
  }), h;
}
function rl(o, e, t, i, s) {
  var n = s.format, r = s.verticalNavigation || "editor", a = n ? window.DateTime || luxon.DateTime : null, l, h = o.getValue(), d = document.createElement("input");
  if (d.type = "time", d.style.padding = "4px", d.style.width = "100%", d.style.boxSizing = "border-box", s.elementAttributes && typeof s.elementAttributes == "object")
    for (let u in s.elementAttributes)
      u.charAt(0) == "+" ? (u = u.slice(1), d.setAttribute(u, d.getAttribute(u) + s.elementAttributes["+" + u])) : d.setAttribute(u, s.elementAttributes[u]);
  h = typeof h < "u" ? h : "", n && (a ? (a.isDateTime(h) ? l = h : n === "iso" ? l = a.fromISO(String(h)) : l = a.fromFormat(String(h), n), h = l.toFormat("HH:mm")) : console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js")), d.value = h, e(function() {
    o.getType() == "cell" && (d.focus({ preventScroll: !0 }), d.style.height = "100%", s.selectContents && d.select());
  });
  function c() {
    var u = d.value, f;
    if ((h === null || typeof h > "u") && u !== "" || u !== h) {
      if (u && n)
        switch (f = a.fromFormat(String(u), "hh:mm"), n) {
          case !0:
            u = f;
            break;
          case "iso":
            u = f.toISO();
            break;
          default:
            u = f.toFormat(n);
        }
      t(u) && (h = d.value);
    } else
      i();
  }
  return d.addEventListener("blur", function(u) {
    (u.relatedTarget || u.rangeParent || u.explicitOriginalTarget !== d) && c();
  }), d.addEventListener("keydown", function(u) {
    switch (u.keyCode) {
      case 13:
        c();
        break;
      case 27:
        i();
        break;
      case 35:
      case 36:
        u.stopPropagation();
        break;
      case 38:
      case 40:
        r == "editor" && (u.stopImmediatePropagation(), u.stopPropagation());
        break;
    }
  }), d;
}
function al(o, e, t, i, s) {
  var n = s.format, r = s.verticalNavigation || "editor", a = n ? this.table.dependencyRegistry.lookup(["luxon", "DateTime"], "DateTime") : null, l, h = o.getValue(), d = document.createElement("input");
  if (d.type = "datetime-local", d.style.padding = "4px", d.style.width = "100%", d.style.boxSizing = "border-box", s.elementAttributes && typeof s.elementAttributes == "object")
    for (let u in s.elementAttributes)
      u.charAt(0) == "+" ? (u = u.slice(1), d.setAttribute(u, d.getAttribute(u) + s.elementAttributes["+" + u])) : d.setAttribute(u, s.elementAttributes[u]);
  h = typeof h < "u" ? h : "", n && (a ? (a.isDateTime(h) ? l = h : n === "iso" ? l = a.fromISO(String(h)) : l = a.fromFormat(String(h), n), h = l.toFormat("yyyy-MM-dd") + "T" + l.toFormat("HH:mm")) : console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js")), d.value = h, e(function() {
    o.getType() === "cell" && (d.focus({ preventScroll: !0 }), d.style.height = "100%", s.selectContents && d.select());
  });
  function c() {
    var u = d.value, f;
    if ((h === null || typeof h > "u") && u !== "" || u !== h) {
      if (u && n)
        switch (f = a.fromISO(String(u)), n) {
          case !0:
            u = f;
            break;
          case "iso":
            u = f.toISO();
            break;
          default:
            u = f.toFormat(n);
        }
      t(u) && (h = d.value);
    } else
      i();
  }
  return d.addEventListener("blur", function(u) {
    (u.relatedTarget || u.rangeParent || u.explicitOriginalTarget !== d) && c();
  }), d.addEventListener("keydown", function(u) {
    switch (u.keyCode) {
      case 13:
        c();
        break;
      case 27:
        i();
        break;
      case 35:
      case 36:
        u.stopPropagation();
        break;
      case 38:
      case 40:
        r == "editor" && (u.stopImmediatePropagation(), u.stopPropagation());
        break;
    }
  }), d;
}
let ll = class {
  constructor(e, t, i, s, n, r) {
    this.edit = e, this.table = e.table, this.cell = t, this.params = this._initializeParams(r), this.data = [], this.displayItems = [], this.currentItems = [], this.focusedItem = null, this.input = this._createInputElement(), this.listEl = this._createListElement(), this.initialValues = null, this.isFilter = t.getType() === "header", this.filterTimeout = null, this.filtered = !1, this.typing = !1, this.values = [], this.popup = null, this.listIteration = 0, this.lastAction = "", this.filterTerm = "", this.blurable = !0, this.actions = {
      success: s,
      cancel: n
    }, this._deprecatedOptionsCheck(), this._initializeValue(), i(this._onRendered.bind(this));
  }
  _deprecatedOptionsCheck() {
  }
  _initializeValue() {
    var e = this.cell.getValue();
    typeof e > "u" && typeof this.params.defaultValue < "u" && (e = this.params.defaultValue), this.initialValues = this.params.multiselect ? e : [e], this.isFilter && (this.input.value = this.initialValues ? this.initialValues.join(",") : "", this.headerFilterInitialListGen());
  }
  _onRendered() {
    var e = this.cell.getElement();
    function t(i) {
      i.stopPropagation();
    }
    this.isFilter || (this.input.style.height = "100%", this.input.focus({ preventScroll: !0 })), e.addEventListener("click", t), setTimeout(() => {
      e.removeEventListener("click", t);
    }, 1e3), this.input.addEventListener("mousedown", this._preventPopupBlur.bind(this));
  }
  _createListElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-edit-list"), e.addEventListener("mousedown", this._preventBlur.bind(this)), e.addEventListener("keydown", this._inputKeyDown.bind(this)), e;
  }
  _setListWidth() {
    var e = this.isFilter ? this.input : this.cell.getElement();
    this.listEl.style.minWidth = e.offsetWidth + "px", this.params.maxWidth && (this.params.maxWidth === !0 ? this.listEl.style.maxWidth = e.offsetWidth + "px" : typeof this.params.maxWidth == "number" ? this.listEl.style.maxWidth = this.params.maxWidth + "px" : this.listEl.style.maxWidth = this.params.maxWidth);
  }
  _createInputElement() {
    var e = this.params.elementAttributes, t = document.createElement("input");
    if (t.setAttribute("type", this.params.clearable ? "search" : "text"), t.style.padding = "4px", t.style.width = "100%", t.style.boxSizing = "border-box", this.params.autocomplete || (t.style.cursor = "default", t.style.caretColor = "transparent"), e && typeof e == "object")
      for (let i in e)
        i.charAt(0) == "+" ? (i = i.slice(1), t.setAttribute(i, t.getAttribute(i) + e["+" + i])) : t.setAttribute(i, e[i]);
    return this.params.mask && $i(t, this.params), this._bindInputEvents(t), t;
  }
  _initializeParams(e) {
    var t = ["values", "valuesURL", "valuesLookup"], i;
    return e = Object.assign({}, e), e.verticalNavigation = e.verticalNavigation || "editor", e.placeholderLoading = typeof e.placeholderLoading > "u" ? "Searching ..." : e.placeholderLoading, e.placeholderEmpty = typeof e.placeholderEmpty > "u" ? "No Results Found" : e.placeholderEmpty, e.filterDelay = typeof e.filterDelay > "u" ? 300 : e.filterDelay, e.emptyValue = Object.keys(e).includes("emptyValue") ? e.emptyValue : "", i = Object.keys(e).filter((s) => t.includes(s)).length, i ? i > 1 && console.warn("list editor config error - only one of the values, valuesURL, or valuesLookup options can be set on the same editor") : console.warn("list editor config error - either the values, valuesURL, or valuesLookup option must be set"), e.autocomplete ? e.multiselect && (e.multiselect = !1, console.warn("list editor config error - multiselect option is not available when autocomplete is enabled")) : (e.freetext && (e.freetext = !1, console.warn("list editor config error - freetext option is only available when autocomplete is enabled")), e.filterFunc && (e.filterFunc = !1, console.warn("list editor config error - filterFunc option is only available when autocomplete is enabled")), e.filterRemote && (e.filterRemote = !1, console.warn("list editor config error - filterRemote option is only available when autocomplete is enabled")), e.mask && (e.mask = !1, console.warn("list editor config error - mask option is only available when autocomplete is enabled")), e.allowEmpty && (e.allowEmpty = !1, console.warn("list editor config error - allowEmpty option is only available when autocomplete is enabled")), e.listOnEmpty && (e.listOnEmpty = !1, console.warn("list editor config error - listOnEmpty option is only available when autocomplete is enabled"))), e.filterRemote && !(typeof e.valuesLookup == "function" || e.valuesURL) && (e.filterRemote = !1, console.warn("list editor config error - filterRemote option should only be used when values list is populated from a remote source")), e;
  }
  //////////////////////////////////////
  ////////// Event Handling ////////////
  //////////////////////////////////////
  _bindInputEvents(e) {
    e.addEventListener("focus", this._inputFocus.bind(this)), e.addEventListener("click", this._inputClick.bind(this)), e.addEventListener("blur", this._inputBlur.bind(this)), e.addEventListener("keydown", this._inputKeyDown.bind(this)), e.addEventListener("search", this._inputSearch.bind(this)), this.params.autocomplete && e.addEventListener("keyup", this._inputKeyUp.bind(this));
  }
  _inputFocus(e) {
    this.rebuildOptionsList();
  }
  _filter() {
    this.params.filterRemote ? (clearTimeout(this.filterTimeout), this.filterTimeout = setTimeout(() => {
      this.rebuildOptionsList();
    }, this.params.filterDelay)) : this._filterList();
  }
  _inputClick(e) {
    e.stopPropagation();
  }
  _inputBlur(e) {
    this.blurable && (this.popup ? this.popup.hide() : this._resolveValue(!0));
  }
  _inputSearch() {
    this._clearChoices();
  }
  _inputKeyDown(e) {
    switch (e.keyCode) {
      case 38:
        this._keyUp(e);
        break;
      case 40:
        this._keyDown(e);
        break;
      case 37:
      case 39:
        this._keySide(e);
        break;
      case 13:
        this._keyEnter();
        break;
      case 27:
        this._keyEsc();
        break;
      case 36:
      case 35:
        this._keyHomeEnd(e);
        break;
      case 9:
        this._keyTab(e);
        break;
      default:
        this._keySelectLetter(e);
    }
  }
  _inputKeyUp(e) {
    switch (e.keyCode) {
      case 38:
      case 37:
      case 39:
      case 40:
      case 13:
      case 27:
        break;
      default:
        this._keyAutoCompLetter(e);
    }
  }
  _preventPopupBlur() {
    this.popup && this.popup.blockHide(), setTimeout(() => {
      this.popup && this.popup.restoreHide();
    }, 10);
  }
  _preventBlur() {
    this.blurable = !1, setTimeout(() => {
      this.blurable = !0;
    }, 10);
  }
  //////////////////////////////////////
  //////// Keyboard Navigation /////////
  //////////////////////////////////////
  _keyTab(e) {
    this.params.autocomplete && this.lastAction === "typing" ? this._resolveValue(!0) : this.focusedItem && this._chooseItem(this.focusedItem, !0);
  }
  _keyUp(e) {
    var t = this.displayItems.indexOf(this.focusedItem);
    (this.params.verticalNavigation == "editor" || this.params.verticalNavigation == "hybrid" && t) && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault(), t > 0 && this._focusItem(this.displayItems[t - 1]));
  }
  _keyDown(e) {
    var t = this.displayItems.indexOf(this.focusedItem);
    (this.params.verticalNavigation == "editor" || this.params.verticalNavigation == "hybrid" && t < this.displayItems.length - 1) && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault(), t < this.displayItems.length - 1 && (t == -1 ? this._focusItem(this.displayItems[0]) : this._focusItem(this.displayItems[t + 1])));
  }
  _keySide(e) {
    this.params.autocomplete || (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault());
  }
  _keyEnter(e) {
    this.params.autocomplete && this.lastAction === "typing" ? this._resolveValue(!0) : this.focusedItem && this._chooseItem(this.focusedItem);
  }
  _keyEsc(e) {
    this._cancel();
  }
  _keyHomeEnd(e) {
    this.params.autocomplete && e.stopImmediatePropagation();
  }
  _keySelectLetter(e) {
    this.params.autocomplete || (e.preventDefault(), e.keyCode >= 38 && e.keyCode <= 90 && this._scrollToValue(e.keyCode));
  }
  _keyAutoCompLetter(e) {
    this._filter(), this.lastAction = "typing", this.typing = !0;
  }
  _scrollToValue(e) {
    clearTimeout(this.filterTimeout);
    var t = String.fromCharCode(e).toLowerCase();
    this.filterTerm += t.toLowerCase();
    var i = this.displayItems.find((s) => typeof s.label < "u" && s.label.toLowerCase().startsWith(this.filterTerm));
    i && this._focusItem(i), this.filterTimeout = setTimeout(() => {
      this.filterTerm = "";
    }, 800);
  }
  _focusItem(e) {
    this.lastAction = "focus", this.focusedItem && this.focusedItem.element && this.focusedItem.element.classList.remove("focused"), this.focusedItem = e, e && e.element && (e.element.classList.add("focused"), e.element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" }));
  }
  //////////////////////////////////////
  /////// Data List Generation /////////
  //////////////////////////////////////
  headerFilterInitialListGen() {
    this._generateOptions(!0);
  }
  rebuildOptionsList() {
    this._generateOptions().then(this._sortOptions.bind(this)).then(this._buildList.bind(this)).then(this._showList.bind(this)).catch((e) => {
      Number.isInteger(e) || console.error("List generation error", e);
    });
  }
  _filterList() {
    this._buildList(this._filterOptions()), this._showList();
  }
  _generateOptions(e) {
    var t = [], i = ++this.listIteration;
    return this.filtered = !1, this.params.values ? t = this.params.values : this.params.valuesURL ? t = this._ajaxRequest(this.params.valuesURL, this.input.value) : typeof this.params.valuesLookup == "function" ? t = this.params.valuesLookup(this.cell, this.input.value) : this.params.valuesLookup && (t = this._uniqueColumnValues(this.params.valuesLookupField)), t instanceof Promise ? (e || this._addPlaceholder(this.params.placeholderLoading), t.then().then((s) => this.listIteration === i ? this._parseList(s) : Promise.reject(i))) : Promise.resolve(this._parseList(t));
  }
  _addPlaceholder(e) {
    var t = document.createElement("div");
    typeof e == "function" && (e = e(this.cell.getComponent(), this.listEl)), e && (this._clearList(), e instanceof HTMLElement ? t = e : (t.classList.add("tabulator-edit-list-placeholder"), t.innerHTML = e), this.listEl.appendChild(t), this._showList());
  }
  _ajaxRequest(e, t) {
    var i = this.params.filterRemote ? { term: t } : {};
    return e = or(e, {}, i), fetch(e).then((s) => s.ok ? s.json().catch((n) => (console.warn("List Ajax Load Error - Invalid JSON returned", n), Promise.reject(n))) : (console.error("List Ajax Load Error - Connection Error: " + s.status, s.statusText), Promise.reject(s))).catch((s) => (console.error("List Ajax Load Error - Connection Error: ", s), Promise.reject(s)));
  }
  _uniqueColumnValues(e) {
    var t = {}, i = this.table.getData(this.params.valuesLookup), s;
    return e ? s = this.table.columnManager.getColumnByField(e) : s = this.cell.getColumn()._getSelf(), s ? i.forEach((n) => {
      var r = s.getFieldValue(n);
      this._emptyValueCheck(r) || (this.params.multiselect && Array.isArray(r) ? r.forEach((a) => {
        this._emptyValueCheck(a) || (t[a] = !0);
      }) : t[r] = !0);
    }) : (console.warn("unable to find matching column to create select lookup list:", e), t = []), Object.keys(t);
  }
  _emptyValueCheck(e) {
    return e === null || typeof e > "u" || e === "";
  }
  _parseList(e) {
    var t = [];
    return Array.isArray(e) || (e = Object.entries(e).map(([i, s]) => ({
      label: s,
      value: i
    }))), e.forEach((i) => {
      typeof i != "object" && (i = {
        label: i,
        value: i
      }), this._parseListItem(i, t, 0);
    }), !this.currentItems.length && this.params.freetext && (this.input.value = this.initialValues, this.typing = !0, this.lastAction = "typing"), this.data = t, t;
  }
  _parseListItem(e, t, i) {
    var s = {};
    e.options ? s = this._parseListGroup(e, i + 1) : (s = {
      label: e.label,
      value: e.value,
      itemParams: e.itemParams,
      elementAttributes: e.elementAttributes,
      element: !1,
      selected: !1,
      visible: !0,
      level: i,
      original: e
    }, this.initialValues && this.initialValues.indexOf(e.value) > -1 && this._chooseItem(s, !0)), t.push(s);
  }
  _parseListGroup(e, t) {
    var i = {
      label: e.label,
      group: !0,
      itemParams: e.itemParams,
      elementAttributes: e.elementAttributes,
      element: !1,
      visible: !0,
      level: t,
      options: [],
      original: e
    };
    return e.options.forEach((s) => {
      this._parseListItem(s, i.options, t);
    }), i;
  }
  _sortOptions(e) {
    var t;
    return this.params.sort && (t = typeof this.params.sort == "function" ? this.params.sort : this._defaultSortFunction.bind(this), this._sortGroup(t, e)), e;
  }
  _sortGroup(e, t) {
    t.sort((i, s) => e(i.label, s.label, i.value, s.value, i.original, s.original)), t.forEach((i) => {
      i.group && this._sortGroup(e, i.options);
    });
  }
  _defaultSortFunction(e, t) {
    var i, s, n, r, a = 0, l, h = /(\d+)|(\D+)/g, d = /\d/, c = 0;
    if (this.params.sort === "desc" && ([e, t] = [t, e]), !e && e !== 0)
      c = !t && t !== 0 ? 0 : -1;
    else if (!t && t !== 0)
      c = 1;
    else {
      if (isFinite(e) && isFinite(t)) return e - t;
      if (i = String(e).toLowerCase(), s = String(t).toLowerCase(), i === s) return 0;
      if (!(d.test(i) && d.test(s))) return i > s ? 1 : -1;
      for (i = i.match(h), s = s.match(h), l = i.length > s.length ? s.length : i.length; a < l; )
        if (n = i[a], r = s[a++], n !== r)
          return isFinite(n) && isFinite(r) ? (n.charAt(0) === "0" && (n = "." + n), r.charAt(0) === "0" && (r = "." + r), n - r) : n > r ? 1 : -1;
      return i.length > s.length;
    }
    return c;
  }
  _filterOptions() {
    var e = this.params.filterFunc || this._defaultFilterFunc, t = this.input.value;
    return t ? (this.filtered = !0, this.data.forEach((i) => {
      this._filterItem(e, t, i);
    })) : this.filtered = !1, this.data;
  }
  _filterItem(e, t, i) {
    var s = !1;
    return i.group ? (i.options.forEach((n) => {
      this._filterItem(e, t, n) && (s = !0);
    }), i.visible = s) : i.visible = e(t, i.label, i.value, i.original), i.visible;
  }
  _defaultFilterFunc(e, t, i, s) {
    return e = String(e).toLowerCase(), t !== null && typeof t < "u" && (String(t).toLowerCase().indexOf(e) > -1 || String(i).toLowerCase().indexOf(e) > -1);
  }
  //////////////////////////////////////
  /////////// Display List /////////////
  //////////////////////////////////////
  _clearList() {
    for (; this.listEl.firstChild; ) this.listEl.removeChild(this.listEl.firstChild);
    this.displayItems = [];
  }
  _buildList(e) {
    this._clearList(), e.forEach((t) => {
      this._buildItem(t);
    }), this.displayItems.length || this._addPlaceholder(this.params.placeholderEmpty);
  }
  _buildItem(e) {
    var t = e.element, i;
    if (!this.filtered || e.visible) {
      if (!t) {
        if (t = document.createElement("div"), t.tabIndex = 0, i = this.params.itemFormatter ? this.params.itemFormatter(e.label, e.value, e.original, t) : e.label, i instanceof HTMLElement ? t.appendChild(i) : t.innerHTML = i, e.group ? t.classList.add("tabulator-edit-list-group") : t.classList.add("tabulator-edit-list-item"), t.classList.add("tabulator-edit-list-group-level-" + e.level), e.elementAttributes && typeof e.elementAttributes == "object")
          for (let s in e.elementAttributes)
            s.charAt(0) == "+" ? (s = s.slice(1), t.setAttribute(s, this.input.getAttribute(s) + e.elementAttributes["+" + s])) : t.setAttribute(s, e.elementAttributes[s]);
        e.group ? t.addEventListener("click", this._groupClick.bind(this, e)) : t.addEventListener("click", this._itemClick.bind(this, e)), t.addEventListener("mousedown", this._preventBlur.bind(this)), e.element = t;
      }
      this._styleItem(e), this.listEl.appendChild(t), e.group ? e.options.forEach((s) => {
        this._buildItem(s);
      }) : this.displayItems.push(e);
    }
  }
  _showList() {
    var e = this.popup && this.popup.isVisible();
    if (this.input.parentNode) {
      if (this.params.autocomplete && this.input.value === "" && !this.params.listOnEmpty) {
        this.popup && this.popup.hide(!0);
        return;
      }
      this._setListWidth(), this.popup || (this.popup = this.edit.popup(this.listEl)), this.popup.show(this.cell.getElement(), "bottom"), e || setTimeout(() => {
        this.popup.hideOnBlur(this._resolveValue.bind(this, !0));
      }, 10);
    }
  }
  _styleItem(e) {
    e && e.element && (e.selected ? e.element.classList.add("active") : e.element.classList.remove("active"));
  }
  //////////////////////////////////////
  ///////// User Interaction ///////////
  //////////////////////////////////////
  _itemClick(e, t) {
    t.stopPropagation(), this._chooseItem(e);
  }
  _groupClick(e, t) {
    t.stopPropagation();
  }
  //////////////////////////////////////
  ////// Current Item Management ///////
  //////////////////////////////////////
  _cancel() {
    this.popup.hide(!0), this.actions.cancel();
  }
  _clearChoices() {
    this.typing = !0, this.currentItems.forEach((e) => {
      e.selected = !1, this._styleItem(e);
    }), this.currentItems = [], this.focusedItem = null;
  }
  _chooseItem(e, t) {
    var i;
    this.typing = !1, this.params.multiselect ? (i = this.currentItems.indexOf(e), i > -1 ? (this.currentItems.splice(i, 1), e.selected = !1) : (this.currentItems.push(e), e.selected = !0), this.input.value = this.currentItems.map((s) => s.label).join(","), this._styleItem(e)) : (this.currentItems = [e], e.selected = !0, this.input.value = e.label, this._styleItem(e), t || this._resolveValue()), this._focusItem(e);
  }
  _resolveValue(e) {
    var t, i;
    if (this.popup && this.popup.hide(!0), this.params.multiselect)
      t = this.currentItems.map((s) => s.value);
    else if (e && this.params.autocomplete && this.typing)
      if (this.params.freetext || this.params.allowEmpty && this.input.value === "")
        t = this.input.value;
      else {
        this.actions.cancel();
        return;
      }
    else
      this.currentItems[0] ? t = this.currentItems[0].value : (i = Array.isArray(this.initialValues) ? this.initialValues[0] : this.initialValues, i === null || typeof i > "u" || i === "" ? t = i : t = this.params.emptyValue);
    t === "" && (t = this.params.emptyValue), this.actions.success(t), this.isFilter && (this.initialValues = t && !Array.isArray(t) ? [t] : t, this.currentItems = []);
  }
};
function hl(o, e, t, i, s) {
  var n = new ll(this, o, e, t, i, s);
  return n.input;
}
function dl(o, e, t, i, s) {
  var n = this, r = o.getElement(), a = o.getValue(), l = r.getElementsByTagName("svg").length || 5, h = r.getElementsByTagName("svg")[0] ? r.getElementsByTagName("svg")[0].getAttribute("width") : 14, d = [], c = document.createElement("div"), u = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  function f(v) {
    d.forEach(function(x, E) {
      E < v ? (n.table.browser == "ie" ? x.setAttribute("class", "tabulator-star-active") : x.classList.replace("tabulator-star-inactive", "tabulator-star-active"), x.innerHTML = '<polygon fill="#488CE9" stroke="#014AAE" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>') : (n.table.browser == "ie" ? x.setAttribute("class", "tabulator-star-inactive") : x.classList.replace("tabulator-star-active", "tabulator-star-inactive"), x.innerHTML = '<polygon fill="#010155" stroke="#686868" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>');
    });
  }
  function p(v) {
    var x = document.createElement("span"), E = u.cloneNode(!0);
    d.push(E), x.addEventListener("mouseenter", function(k) {
      k.stopPropagation(), k.stopImmediatePropagation(), f(v);
    }), x.addEventListener("mousemove", function(k) {
      k.stopPropagation(), k.stopImmediatePropagation();
    }), x.addEventListener("click", function(k) {
      k.stopPropagation(), k.stopImmediatePropagation(), t(v), r.blur();
    }), x.appendChild(E), c.appendChild(x);
  }
  function g(v) {
    a = v, f(v);
  }
  if (r.style.whiteSpace = "nowrap", r.style.overflow = "hidden", r.style.textOverflow = "ellipsis", c.style.verticalAlign = "middle", c.style.display = "inline-block", c.style.padding = "4px", u.setAttribute("width", h), u.setAttribute("height", h), u.setAttribute("viewBox", "0 0 512 512"), u.setAttribute("xml:space", "preserve"), u.style.padding = "0 1px", s.elementAttributes && typeof s.elementAttributes == "object")
    for (let v in s.elementAttributes)
      v.charAt(0) == "+" ? (v = v.slice(1), c.setAttribute(v, c.getAttribute(v) + s.elementAttributes["+" + v])) : c.setAttribute(v, s.elementAttributes[v]);
  for (var m = 1; m <= l; m++)
    p(m);
  return a = Math.min(parseInt(a), l), f(a), c.addEventListener("mousemove", function(v) {
    f(0);
  }), c.addEventListener("click", function(v) {
    t(0);
  }), r.addEventListener("blur", function(v) {
    i();
  }), r.addEventListener("keydown", function(v) {
    switch (v.keyCode) {
      case 39:
        g(a + 1);
        break;
      case 37:
        g(a - 1);
        break;
      case 13:
        t(a);
        break;
      case 27:
        i();
        break;
    }
  }), c;
}
function cl(o, e, t, i, s) {
  var n = o.getElement(), r = typeof s.max > "u" ? n.getElementsByTagName("div")[0] && n.getElementsByTagName("div")[0].getAttribute("max") || 100 : s.max, a = typeof s.min > "u" ? n.getElementsByTagName("div")[0] && n.getElementsByTagName("div")[0].getAttribute("min") || 0 : s.min, l = (r - a) / 100, h = o.getValue() || 0, d = document.createElement("div"), c = document.createElement("div"), u, f;
  function p() {
    var g = window.getComputedStyle(n, null), m = l * Math.round(c.offsetWidth / ((n.clientWidth - parseInt(g.getPropertyValue("padding-left")) - parseInt(g.getPropertyValue("padding-right"))) / 100)) + a;
    t(m), n.setAttribute("aria-valuenow", m), n.setAttribute("aria-label", h);
  }
  if (d.style.position = "absolute", d.style.right = "0", d.style.top = "0", d.style.bottom = "0", d.style.width = "5px", d.classList.add("tabulator-progress-handle"), c.style.display = "inline-block", c.style.position = "relative", c.style.height = "100%", c.style.backgroundColor = "#488CE9", c.style.maxWidth = "100%", c.style.minWidth = "0%", s.elementAttributes && typeof s.elementAttributes == "object")
    for (let g in s.elementAttributes)
      g.charAt(0) == "+" ? (g = g.slice(1), c.setAttribute(g, c.getAttribute(g) + s.elementAttributes["+" + g])) : c.setAttribute(g, s.elementAttributes[g]);
  return n.style.padding = "4px 4px", h = Math.min(parseFloat(h), r), h = Math.max(parseFloat(h), a), h = Math.round((h - a) / l), c.style.width = h + "%", n.setAttribute("aria-valuemin", a), n.setAttribute("aria-valuemax", r), c.appendChild(d), d.addEventListener("mousedown", function(g) {
    u = g.screenX, f = c.offsetWidth;
  }), d.addEventListener("mouseover", function() {
    d.style.cursor = "ew-resize";
  }), n.addEventListener("mousemove", function(g) {
    u && (c.style.width = f + g.screenX - u + "px");
  }), n.addEventListener("mouseup", function(g) {
    u && (g.stopPropagation(), g.stopImmediatePropagation(), u = !1, f = !1, p());
  }), n.addEventListener("keydown", function(g) {
    switch (g.keyCode) {
      case 39:
        g.preventDefault(), c.style.width = c.clientWidth + n.clientWidth / 100 + "px";
        break;
      case 37:
        g.preventDefault(), c.style.width = c.clientWidth - n.clientWidth / 100 + "px";
        break;
      case 9:
      case 13:
        p();
        break;
      case 27:
        i();
        break;
    }
  }), n.addEventListener("blur", function() {
    i();
  }), c;
}
function ul(o, e, t, i, s) {
  var n = o.getValue(), r = document.createElement("input"), a = s.tristate, l = typeof s.indeterminateValue > "u" ? null : s.indeterminateValue, h = !1, d = Object.keys(s).includes("trueValue"), c = Object.keys(s).includes("falseValue");
  if (r.setAttribute("type", "checkbox"), r.style.marginTop = "5px", r.style.boxSizing = "border-box", s.elementAttributes && typeof s.elementAttributes == "object")
    for (let f in s.elementAttributes)
      f.charAt(0) == "+" ? (f = f.slice(1), r.setAttribute(f, r.getAttribute(f) + s.elementAttributes["+" + f])) : r.setAttribute(f, s.elementAttributes[f]);
  r.value = n, a && (typeof n > "u" || n === l || n === "") && (h = !0, r.indeterminate = !0), this.table.browser != "firefox" && this.table.browser != "safari" && e(function() {
    o.getType() === "cell" && r.focus({ preventScroll: !0 });
  }), r.checked = d ? n === s.trueValue : n === !0 || n === "true" || n === "True" || n === 1;
  function u(f) {
    var p = r.checked;
    return d && p ? p = s.trueValue : c && !p && (p = s.falseValue), a ? f ? h ? l : p : r.checked && !h ? (r.checked = !1, r.indeterminate = !0, h = !0, l) : (h = !1, p) : p;
  }
  return r.addEventListener("change", function(f) {
    t(u());
  }), r.addEventListener("blur", function(f) {
    t(u(!0));
  }), r.addEventListener("keydown", function(f) {
    f.keyCode == 13 && t(u()), f.keyCode == 27 && i();
  }), r;
}
function fl(o, e, t, i, s) {
  var n = o._getSelf().column, r, a, l;
  function h(d) {
    var c = d.getValue(), u = "input";
    switch (typeof c) {
      case "number":
        u = "number";
        break;
      case "boolean":
        u = "tickCross";
        break;
      case "string":
        c.includes(`
`) && (u = "textarea");
        break;
    }
    return u;
  }
  return r = s.editorLookup ? s.editorLookup(o) : h(o), s.paramsLookup && (l = typeof s.paramsLookup == "function" ? s.paramsLookup(r, o) : s.paramsLookup[r]), a = this.table.modules.edit.lookupEditor(r, n), a.call(this, o, e, t, i, l || {});
}
var pl = {
  input: tl,
  textarea: il,
  number: sl,
  range: nl,
  date: ol,
  time: rl,
  datetime: al,
  list: hl,
  star: dl,
  progress: cl,
  tickCross: ul,
  adaptable: fl
};
const ti = class ti extends A {
  constructor(e) {
    super(e), this.currentCell = !1, this.mouseClick = !1, this.recursionBlock = !1, this.invalidEdit = !1, this.editedCells = [], this.convertEmptyValues = !1, this.editors = ti.editors, this.registerTableOption("editTriggerEvent", "focus"), this.registerTableOption("editorEmptyValue"), this.registerTableOption("editorEmptyValueFunc", this.emptyValueCheck.bind(this)), this.registerColumnOption("editable"), this.registerColumnOption("editor"), this.registerColumnOption("editorParams"), this.registerColumnOption("editorEmptyValue"), this.registerColumnOption("editorEmptyValueFunc"), this.registerColumnOption("cellEditing"), this.registerColumnOption("cellEdited"), this.registerColumnOption("cellEditCancelled"), this.registerTableFunction("getEditedCells", this.getEditedCells.bind(this)), this.registerTableFunction("clearCellEdited", this.clearCellEdited.bind(this)), this.registerTableFunction("navigatePrev", this.navigatePrev.bind(this)), this.registerTableFunction("navigateNext", this.navigateNext.bind(this)), this.registerTableFunction("navigateLeft", this.navigateLeft.bind(this)), this.registerTableFunction("navigateRight", this.navigateRight.bind(this)), this.registerTableFunction("navigateUp", this.navigateUp.bind(this)), this.registerTableFunction("navigateDown", this.navigateDown.bind(this)), this.registerComponentFunction("cell", "isEdited", this.cellIsEdited.bind(this)), this.registerComponentFunction("cell", "clearEdited", this.clearEdited.bind(this)), this.registerComponentFunction("cell", "edit", this.editCell.bind(this)), this.registerComponentFunction("cell", "cancelEdit", this.cellCancelEdit.bind(this)), this.registerComponentFunction("cell", "navigatePrev", this.navigatePrev.bind(this)), this.registerComponentFunction("cell", "navigateNext", this.navigateNext.bind(this)), this.registerComponentFunction("cell", "navigateLeft", this.navigateLeft.bind(this)), this.registerComponentFunction("cell", "navigateRight", this.navigateRight.bind(this)), this.registerComponentFunction("cell", "navigateUp", this.navigateUp.bind(this)), this.registerComponentFunction("cell", "navigateDown", this.navigateDown.bind(this));
  }
  initialize() {
    this.subscribe("cell-init", this.bindEditor.bind(this)), this.subscribe("cell-delete", this.clearEdited.bind(this)), this.subscribe("cell-value-changed", this.updateCellClass.bind(this)), this.subscribe("column-layout", this.initializeColumnCheck.bind(this)), this.subscribe("column-delete", this.columnDeleteCheck.bind(this)), this.subscribe("row-deleting", this.rowDeleteCheck.bind(this)), this.subscribe("row-layout", this.rowEditableCheck.bind(this)), this.subscribe("data-refreshing", this.cancelEdit.bind(this)), this.subscribe("clipboard-paste", this.pasteBlocker.bind(this)), this.subscribe("keybinding-nav-prev", this.navigatePrev.bind(this, void 0)), this.subscribe("keybinding-nav-next", this.keybindingNavigateNext.bind(this)), this.subscribe("keybinding-nav-up", this.navigateUp.bind(this, void 0)), this.subscribe("keybinding-nav-down", this.navigateDown.bind(this, void 0)), Object.keys(this.table.options).includes("editorEmptyValue") && (this.convertEmptyValues = !0);
  }
  ///////////////////////////////////
  ///////// Paste Negation //////////
  ///////////////////////////////////
  pasteBlocker(e) {
    if (this.currentCell)
      return !0;
  }
  ///////////////////////////////////
  ////// Keybinding Functions ///////
  ///////////////////////////////////
  keybindingNavigateNext(e) {
    var t = this.currentCell, i = this.options("tabEndNewRow");
    t && (this.navigateNext(t, e) || i && (t.getElement().firstChild.blur(), this.invalidEdit || (i === !0 ? i = this.table.addRow({}) : typeof i == "function" ? i = this.table.addRow(i(t.row.getComponent())) : i = this.table.addRow(Object.assign({}, i)), i.then(() => {
      setTimeout(() => {
        t.getComponent().navigateNext();
      });
    }))));
  }
  ///////////////////////////////////
  ///////// Cell Functions //////////
  ///////////////////////////////////
  cellIsEdited(e) {
    return !!e.modules.edit && e.modules.edit.edited;
  }
  cellCancelEdit(e) {
    e === this.currentCell ? this.table.modules.edit.cancelEdit() : console.warn("Cancel Editor Error - This cell is not currently being edited ");
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  updateCellClass(e) {
    this.allowEdit(e) ? e.getElement().classList.add("tabulator-editable") : e.getElement().classList.remove("tabulator-editable");
  }
  clearCellEdited(e) {
    e || (e = this.table.modules.edit.getEditedCells()), Array.isArray(e) || (e = [e]), e.forEach((t) => {
      this.table.modules.edit.clearEdited(t._getSelf());
    });
  }
  navigatePrev(e = this.currentCell, t) {
    var i, s;
    if (e) {
      if (t && t.preventDefault(), i = this.navigateLeft(), i)
        return !0;
      if (s = this.table.rowManager.prevDisplayRow(e.row, !0), s && (i = this.findPrevEditableCell(s, s.cells.length), i))
        return i.getComponent().edit(), !0;
    }
    return !1;
  }
  navigateNext(e = this.currentCell, t) {
    var i, s;
    if (e) {
      if (t && t.preventDefault(), i = this.navigateRight(), i)
        return !0;
      if (s = this.table.rowManager.nextDisplayRow(e.row, !0), s && (i = this.findNextEditableCell(s, -1), i))
        return i.getComponent().edit(), !0;
    }
    return !1;
  }
  navigateLeft(e = this.currentCell, t) {
    var i, s;
    return e && (t && t.preventDefault(), i = e.getIndex(), s = this.findPrevEditableCell(e.row, i), s) ? (s.getComponent().edit(), !0) : !1;
  }
  navigateRight(e = this.currentCell, t) {
    var i, s;
    return e && (t && t.preventDefault(), i = e.getIndex(), s = this.findNextEditableCell(e.row, i), s) ? (s.getComponent().edit(), !0) : !1;
  }
  navigateUp(e = this.currentCell, t) {
    var i, s;
    return e && (t && t.preventDefault(), i = e.getIndex(), s = this.table.rowManager.prevDisplayRow(e.row, !0), s) ? (s.cells[i].getComponent().edit(), !0) : !1;
  }
  navigateDown(e = this.currentCell, t) {
    var i, s;
    return e && (t && t.preventDefault(), i = e.getIndex(), s = this.table.rowManager.nextDisplayRow(e.row, !0), s) ? (s.cells[i].getComponent().edit(), !0) : !1;
  }
  findNextEditableCell(e, t) {
    var i = !1;
    if (t < e.cells.length - 1)
      for (var s = t + 1; s < e.cells.length; s++) {
        let n = e.cells[s];
        if (n.column.modules.edit && $.elVisible(n.getElement()) && this.allowEdit(n)) {
          i = n;
          break;
        }
      }
    return i;
  }
  findPrevEditableCell(e, t) {
    var i = !1;
    if (t > 0)
      for (var s = t - 1; s >= 0; s--) {
        let n = e.cells[s];
        if (n.column.modules.edit && $.elVisible(n.getElement()) && this.allowEdit(n)) {
          i = n;
          break;
        }
      }
    return i;
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  initializeColumnCheck(e) {
    typeof e.definition.editor < "u" && this.initializeColumn(e);
  }
  columnDeleteCheck(e) {
    this.currentCell && this.currentCell.column === e && this.cancelEdit();
  }
  rowDeleteCheck(e) {
    this.currentCell && this.currentCell.row === e && this.cancelEdit();
  }
  rowEditableCheck(e) {
    e.getCells().forEach((t) => {
      t.column.modules.edit && typeof t.column.modules.edit.check == "function" && this.updateCellClass(t);
    });
  }
  //initialize column editor
  initializeColumn(e) {
    var t = Object.keys(e.definition).includes("editorEmptyValue"), i = {
      editor: !1,
      blocked: !1,
      check: e.definition.editable,
      params: e.definition.editorParams || {},
      convertEmptyValues: t,
      editorEmptyValue: e.definition.editorEmptyValue,
      editorEmptyValueFunc: e.definition.editorEmptyValueFunc
    };
    i.editor = this.lookupEditor(e.definition.editor, e), i.editor && (e.modules.edit = i);
  }
  lookupEditor(e, t) {
    var i;
    switch (typeof e) {
      case "string":
        this.editors[e] ? i = this.editors[e] : console.warn("Editor Error - No such editor found: ", e);
        break;
      case "function":
        i = e;
        break;
      case "boolean":
        e === !0 && (typeof t.definition.formatter != "function" ? this.editors[t.definition.formatter] ? i = this.editors[t.definition.formatter] : i = this.editors.input : console.warn("Editor Error - Cannot auto lookup editor for a custom formatter: ", t.definition.formatter));
        break;
    }
    return i;
  }
  getCurrentCell() {
    return this.currentCell ? this.currentCell.getComponent() : !1;
  }
  clearEditor(e) {
    var t = this.currentCell, i;
    if (this.invalidEdit = !1, t) {
      for (this.currentCell = !1, i = t.getElement(), this.dispatch("edit-editor-clear", t, e), i.classList.remove("tabulator-editing"); i.firstChild; ) i.removeChild(i.firstChild);
      t.row.getElement().classList.remove("tabulator-editing"), t.table.element.classList.remove("tabulator-editing");
    }
  }
  cancelEdit() {
    if (this.currentCell) {
      var e = this.currentCell, t = this.currentCell.getComponent();
      this.clearEditor(!0), e.setValueActual(e.getValue()), e.cellRendered(), (e.column.definition.editor == "textarea" || e.column.definition.variableHeight) && e.row.normalizeHeight(!0), e.column.definition.cellEditCancelled && e.column.definition.cellEditCancelled.call(this.table, t), this.dispatch("edit-cancelled", e), this.dispatchExternal("cellEditCancelled", t);
    }
  }
  //return a formatted value for a cell
  bindEditor(e) {
    if (e.column.modules.edit) {
      var t = this, i = e.getElement(!0);
      this.updateCellClass(e), i.setAttribute("tabindex", 0), i.addEventListener("mousedown", function(s) {
        s.button === 2 ? s.preventDefault() : t.mouseClick = !0;
      }), this.options("editTriggerEvent") === "dblclick" && i.addEventListener("dblclick", function(s) {
        i.classList.contains("tabulator-editing") || (i.focus({ preventScroll: !0 }), t.edit(e, s, !1));
      }), (this.options("editTriggerEvent") === "focus" || this.options("editTriggerEvent") === "click") && i.addEventListener("click", function(s) {
        i.classList.contains("tabulator-editing") || (i.focus({ preventScroll: !0 }), t.edit(e, s, !1));
      }), this.options("editTriggerEvent") === "focus" && i.addEventListener("focus", function(s) {
        t.recursionBlock || t.edit(e, s, !1);
      });
    }
  }
  focusCellNoEvent(e, t) {
    this.recursionBlock = !0, t && this.table.browser === "ie" || e.getElement().focus({ preventScroll: !0 }), this.recursionBlock = !1;
  }
  editCell(e, t) {
    this.focusCellNoEvent(e), this.edit(e, !1, t);
  }
  focusScrollAdjust(e) {
    if (this.table.rowManager.getRenderMode() == "virtual") {
      var t = this.table.rowManager.element.scrollTop, i = this.table.rowManager.element.clientHeight + this.table.rowManager.element.scrollTop, s = e.row.getElement();
      s.offsetTop < t ? this.table.rowManager.element.scrollTop -= t - s.offsetTop : s.offsetTop + s.offsetHeight > i && (this.table.rowManager.element.scrollTop += s.offsetTop + s.offsetHeight - i);
      var n = this.table.rowManager.element.scrollLeft, r = this.table.rowManager.element.clientWidth + this.table.rowManager.element.scrollLeft, a = e.getElement();
      this.table.modExists("frozenColumns") && (n += parseInt(this.table.modules.frozenColumns.leftMargin || 0), r -= parseInt(this.table.modules.frozenColumns.rightMargin || 0)), this.table.options.renderHorizontal === "virtual" && (n -= parseInt(this.table.columnManager.renderer.vDomPadLeft), r -= parseInt(this.table.columnManager.renderer.vDomPadLeft)), a.offsetLeft < n ? this.table.rowManager.element.scrollLeft -= n - a.offsetLeft : a.offsetLeft + a.offsetWidth > r && (this.table.rowManager.element.scrollLeft += a.offsetLeft + a.offsetWidth - r);
    }
  }
  allowEdit(e) {
    var t = !!e.column.modules.edit;
    if (e.column.modules.edit)
      switch (typeof e.column.modules.edit.check) {
        case "function":
          e.row.initialized && (t = e.column.modules.edit.check(e.getComponent()));
          break;
        case "string":
          t = !!e.row.data[e.column.modules.edit.check];
          break;
        case "boolean":
          t = e.column.modules.edit.check;
          break;
      }
    return t;
  }
  edit(e, t, i) {
    var s = this, n = !0, r = function() {
    }, a = e.getElement(), l = !1, h, d, c;
    if (this.currentCell) {
      !this.invalidEdit && this.currentCell !== e && this.cancelEdit();
      return;
    }
    function u(v) {
      if (s.currentCell === e && !l) {
        var x = s.chain("edit-success", [e, v], !0, !0);
        return x === !0 || s.table.options.validationMode === "highlight" ? (l = !0, s.clearEditor(), e.modules.edit || (e.modules.edit = {}), e.modules.edit.edited = !0, s.editedCells.indexOf(e) == -1 && s.editedCells.push(e), v = s.transformEmptyValues(v, e), e.setValue(v, !0), x === !0) : (l = !0, s.invalidEdit = !0, s.focusCellNoEvent(e, !0), r(), setTimeout(() => {
          l = !1;
        }, 10), !1);
      }
    }
    function f() {
      s.currentCell === e && !l && s.cancelEdit();
    }
    function p(v) {
      r = v;
    }
    if (e.column.modules.edit.blocked)
      return this.mouseClick = !1, this.blur(a), !1;
    if (t && t.stopPropagation(), n = this.allowEdit(e), n || i) {
      if (s.cancelEdit(), s.currentCell = e, this.focusScrollAdjust(e), d = e.getComponent(), this.mouseClick && (this.mouseClick = !1, e.column.definition.cellClick && e.column.definition.cellClick.call(this.table, t, d)), e.column.definition.cellEditing && e.column.definition.cellEditing.call(this.table, d), this.dispatch("cell-editing", e), this.dispatchExternal("cellEditing", d), c = typeof e.column.modules.edit.params == "function" ? e.column.modules.edit.params(d) : e.column.modules.edit.params, h = e.column.modules.edit.editor.call(s, d, p, u, f, c), this.currentCell && h !== !1)
        if (h instanceof Node) {
          for (a.classList.add("tabulator-editing"), e.row.getElement().classList.add("tabulator-editing"), e.table.element.classList.add("tabulator-editing"); a.firstChild; ) a.removeChild(a.firstChild);
          a.appendChild(h), r();
          for (var g = a.children, m = 0; m < g.length; m++)
            g[m].addEventListener("click", function(v) {
              v.stopPropagation();
            });
        } else
          return console.warn("Edit Error - Editor should return an instance of Node, the editor returned:", h), this.blur(a), !1;
      else
        return this.blur(a), !1;
      return !0;
    } else
      return this.mouseClick = !1, this.blur(a), !1;
  }
  emptyValueCheck(e) {
    return e === "" || e === null || typeof e > "u";
  }
  transformEmptyValues(e, t) {
    var i = t.column.modules.edit, s = i.convertEmptyValues || this.convertEmptyValues, n;
    return s && (n = i.editorEmptyValueFunc || this.options("editorEmptyValueFunc"), n && n(e) && (e = i.convertEmptyValues ? i.editorEmptyValue : this.options("editorEmptyValue"))), e;
  }
  blur(e) {
    this.confirm("edit-blur", [e]) || e.blur();
  }
  getEditedCells() {
    var e = [];
    return this.editedCells.forEach((t) => {
      e.push(t.getComponent());
    }), e;
  }
  clearEdited(e) {
    var t;
    e.modules.edit && e.modules.edit.edited && (e.modules.edit.edited = !1, this.dispatch("edit-edited-clear", e)), t = this.editedCells.indexOf(e), t > -1 && this.editedCells.splice(t, 1);
  }
};
C(ti, "moduleName", "edit"), //load defaults
C(ti, "editors", pl);
let Ds = ti;
class Nn {
  constructor(e, t, i, s) {
    this.type = e, this.columns = t, this.component = i || !1, this.indent = s || 0;
  }
}
class rs {
  constructor(e, t, i, s, n) {
    this.value = e, this.component = t || !1, this.width = i, this.height = s, this.depth = n;
  }
}
var gl = {}, ml = {
  visible: function() {
    return this.rowManager.getVisibleRows(!1, !0);
  },
  all: function() {
    return this.rowManager.rows;
  },
  selected: function() {
    return this.modules.selectRow.selectedRows;
  },
  active: function() {
    return this.options.pagination ? this.rowManager.getDisplayRows(this.rowManager.displayRows.length - 2) : this.rowManager.getDisplayRows();
  }
};
const Xe = class Xe extends A {
  constructor(e) {
    super(e), this.config = {}, this.cloneTableStyle = !0, this.colVisProp = "", this.colVisPropAttach = "", this.registerTableOption("htmlOutputConfig", !1), this.registerColumnOption("htmlOutput"), this.registerColumnOption("titleHtmlOutput");
  }
  initialize() {
    this.registerTableFunction("getHtml", this.getHtml.bind(this));
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  generateExportList(e, t, i, s) {
    var n, r, a, l;
    return this.cloneTableStyle = t, this.config = e || {}, this.colVisProp = s, this.colVisPropAttach = this.colVisProp.charAt(0).toUpperCase() + this.colVisProp.slice(1), l = Xe.columnLookups[i], l && (a = l.call(this.table), a = a.filter((h) => this.columnVisCheck(h))), n = this.config.columnHeaders !== !1 ? this.headersToExportRows(this.generateColumnGroupHeaders(a)) : [], a && (a = a.map((h) => h.getComponent())), r = this.bodyToExportRows(this.rowLookup(i), a), n.concat(r);
  }
  generateTable(e, t, i, s) {
    var n = this.generateExportList(e, t, i, s);
    return this.generateTableElement(n);
  }
  rowLookup(e) {
    var t = [], i;
    return typeof e == "function" ? e.call(this.table).forEach((s) => {
      s = this.table.rowManager.findRow(s), s && t.push(s);
    }) : (i = Xe.rowLookups[e] || Xe.rowLookups.active, t = i.call(this.table)), Object.assign([], t);
  }
  generateColumnGroupHeaders(e) {
    var t = [];
    return e || (e = this.config.columnGroups !== !1 ? this.table.columnManager.columns : this.table.columnManager.columnsByIndex), e.forEach((i) => {
      var s = this.processColumnGroup(i);
      s && t.push(s);
    }), t;
  }
  processColumnGroup(e) {
    var t = e.columns, i = 0, s = e.definition["title" + this.colVisPropAttach] || e.definition.title, n = {
      title: s,
      column: e,
      depth: 1
    };
    if (t.length) {
      if (n.subGroups = [], n.width = 0, t.forEach((r) => {
        var a = this.processColumnGroup(r);
        a && (n.width += a.width, n.subGroups.push(a), a.depth > i && (i = a.depth));
      }), n.depth += i, !n.width)
        return !1;
    } else if (this.columnVisCheck(e))
      n.width = 1;
    else
      return !1;
    return n;
  }
  columnVisCheck(e) {
    var t = e.definition[this.colVisProp];
    return this.config.rowHeaders === !1 && e.isRowHeader ? !1 : (typeof t == "function" && (t = t.call(this.table, e.getComponent())), t === !1 || t === !0 ? t : e.visible && e.field);
  }
  headersToExportRows(e) {
    var t = [], i = 0, s = [];
    function n(r, a) {
      var l = i - a;
      if (typeof t[a] > "u" && (t[a] = []), r.height = r.subGroups ? 1 : l - r.depth + 1, t[a].push(r), r.height > 1)
        for (let h = 1; h < r.height; h++)
          typeof t[a + h] > "u" && (t[a + h] = []), t[a + h].push(!1);
      if (r.width > 1)
        for (let h = 1; h < r.width; h++)
          t[a].push(!1);
      r.subGroups && r.subGroups.forEach(function(h) {
        n(h, a + 1);
      });
    }
    return e.forEach(function(r) {
      r.depth > i && (i = r.depth);
    }), e.forEach(function(r) {
      n(r, 0);
    }), t.forEach((r) => {
      var a = [];
      r.forEach((l) => {
        if (l) {
          let h = typeof l.title > "u" ? "" : l.title;
          a.push(new rs(h, l.column.getComponent(), l.width, l.height, l.depth));
        } else
          a.push(null);
      }), s.push(new Nn("header", a));
    }), s;
  }
  bodyToExportRows(e, t = []) {
    var i = [];
    return t.length === 0 && this.table.columnManager.columnsByIndex.forEach((s) => {
      this.columnVisCheck(s) && t.push(s.getComponent());
    }), this.config.columnCalcs !== !1 && this.table.modExists("columnCalcs") && (this.table.modules.columnCalcs.topInitialized && e.unshift(this.table.modules.columnCalcs.topRow), this.table.modules.columnCalcs.botInitialized && e.push(this.table.modules.columnCalcs.botRow)), e = e.filter((s) => {
      switch (s.type) {
        case "group":
          return this.config.rowGroups !== !1;
        case "calc":
          return this.config.columnCalcs !== !1;
        case "row":
          return !(this.table.options.dataTree && this.config.dataTree === !1 && s.modules.dataTree.parent);
      }
      return !0;
    }), e.forEach((s, n) => {
      var r = s.getData(this.colVisProp), a = [], l = 0;
      switch (s.type) {
        case "group":
          l = s.level, a.push(new rs(s.key, s.getComponent(), t.length, 1));
          break;
        case "calc":
        case "row":
          t.forEach((h) => {
            a.push(new rs(h._column.getFieldValue(r), h, 1, 1));
          }), this.table.options.dataTree && this.config.dataTree !== !1 && (l = s.modules.dataTree.index);
          break;
      }
      i.push(new Nn(s.type, a, s.getComponent(), l));
    }), i;
  }
  generateTableElement(e) {
    var t = document.createElement("table"), i = document.createElement("thead"), s = document.createElement("tbody"), n = this.lookupTableStyles(), r = this.table.options["rowFormatter" + this.colVisPropAttach], a = {};
    return a.rowFormatter = r !== null ? r : this.table.options.rowFormatter, this.table.options.dataTree && this.config.dataTree !== !1 && this.table.modExists("columnCalcs") && (a.treeElementField = this.table.modules.dataTree.elementField), a.groupHeader = this.table.options["groupHeader" + this.colVisPropAttach], a.groupHeader && !Array.isArray(a.groupHeader) && (a.groupHeader = [a.groupHeader]), t.classList.add("tabulator-print-table"), this.mapElementStyles(this.table.columnManager.getHeadersElement(), i, ["border-top", "border-left", "border-right", "border-bottom", "background-color", "color", "font-weight", "font-family", "font-size"]), e.length > 1e3 && console.warn("It may take a long time to render an HTML table with more than 1000 rows"), e.forEach((l, h) => {
      let d;
      switch (l.type) {
        case "header":
          i.appendChild(this.generateHeaderElement(l, a, n));
          break;
        case "group":
          s.appendChild(this.generateGroupElement(l, a, n));
          break;
        case "calc":
          s.appendChild(this.generateCalcElement(l, a, n));
          break;
        case "row":
          d = this.generateRowElement(l, a, n), this.mapElementStyles(h % 2 && n.evenRow ? n.evenRow : n.oddRow, d, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]), s.appendChild(d);
          break;
      }
    }), i.innerHTML && t.appendChild(i), t.appendChild(s), this.mapElementStyles(this.table.element, t, ["border-top", "border-left", "border-right", "border-bottom"]), t;
  }
  lookupTableStyles() {
    var e = {};
    return this.cloneTableStyle && window.getComputedStyle && (e.oddRow = this.table.element.querySelector(".tabulator-row-odd:not(.tabulator-group):not(.tabulator-calcs)"), e.evenRow = this.table.element.querySelector(".tabulator-row-even:not(.tabulator-group):not(.tabulator-calcs)"), e.calcRow = this.table.element.querySelector(".tabulator-row.tabulator-calcs"), e.firstRow = this.table.element.querySelector(".tabulator-row:not(.tabulator-group):not(.tabulator-calcs)"), e.firstGroup = this.table.element.getElementsByClassName("tabulator-group")[0], e.firstRow && (e.styleCells = e.firstRow.getElementsByClassName("tabulator-cell"), e.styleRowHeader = e.firstRow.getElementsByClassName("tabulator-row-header")[0], e.firstCell = e.styleCells[0], e.lastCell = e.styleCells[e.styleCells.length - 1])), e;
  }
  generateHeaderElement(e, t, i) {
    var s = document.createElement("tr");
    return e.columns.forEach((n) => {
      if (n) {
        var r = document.createElement("th"), a = n.component._column.definition.cssClass ? n.component._column.definition.cssClass.split(" ") : [];
        r.colSpan = n.width, r.rowSpan = n.height, r.innerHTML = n.value, this.cloneTableStyle && (r.style.boxSizing = "border-box"), a.forEach(function(l) {
          r.classList.add(l);
        }), this.mapElementStyles(n.component.getElement(), r, ["text-align", "border-left", "border-right", "background-color", "color", "font-weight", "font-family", "font-size"]), this.mapElementStyles(n.component._column.contentElement, r, ["padding-top", "padding-left", "padding-right", "padding-bottom"]), n.component._column.visible ? this.mapElementStyles(n.component.getElement(), r, ["width"]) : n.component._column.definition.width && (r.style.width = n.component._column.definition.width + "px"), n.component._column.parent && n.component._column.parent.isGroup ? this.mapElementStyles(n.component._column.parent.groupElement, r, ["border-top"]) : this.mapElementStyles(n.component.getElement(), r, ["border-top"]), n.component._column.isGroup ? this.mapElementStyles(n.component.getElement(), r, ["border-bottom"]) : this.mapElementStyles(this.table.columnManager.getElement(), r, ["border-bottom"]), s.appendChild(r);
      }
    }), s;
  }
  generateGroupElement(e, t, i) {
    var s = document.createElement("tr"), n = document.createElement("td"), r = e.columns[0];
    return s.classList.add("tabulator-print-table-row"), t.groupHeader && t.groupHeader[e.indent] ? r.value = t.groupHeader[e.indent](r.value, e.component._group.getRowCount(), e.component._group.getData(), e.component) : t.groupHeader !== !1 && (r.value = e.component._group.generator(r.value, e.component._group.getRowCount(), e.component._group.getData(), e.component)), n.colSpan = r.width, n.innerHTML = r.value, s.classList.add("tabulator-print-table-group"), s.classList.add("tabulator-group-level-" + e.indent), r.component.isVisible() && s.classList.add("tabulator-group-visible"), this.mapElementStyles(i.firstGroup, s, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]), this.mapElementStyles(i.firstGroup, n, ["padding-top", "padding-left", "padding-right", "padding-bottom"]), s.appendChild(n), s;
  }
  generateCalcElement(e, t, i) {
    var s = this.generateRowElement(e, t, i);
    return s.classList.add("tabulator-print-table-calcs"), this.mapElementStyles(i.calcRow, s, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]), s;
  }
  generateRowElement(e, t, i) {
    var s = document.createElement("tr");
    if (s.classList.add("tabulator-print-table-row"), e.columns.forEach((n, r) => {
      if (n) {
        var a = document.createElement("td"), l = n.component._column, h = this.table, d = h.columnManager.findColumnIndex(l), c = n.value, u, f, p = {
          modules: {},
          getValue: function() {
            return c;
          },
          getField: function() {
            return l.definition.field;
          },
          getElement: function() {
            return a;
          },
          getType: function() {
            return "cell";
          },
          getColumn: function() {
            return l.getComponent();
          },
          getData: function() {
            return e.component.getData();
          },
          getRow: function() {
            return e.component;
          },
          getTable: function() {
            return h;
          },
          getComponent: function() {
            return p;
          },
          column: l
        }, g = l.definition.cssClass ? l.definition.cssClass.split(" ") : [];
        if (g.forEach(function(m) {
          a.classList.add(m);
        }), this.table.modExists("format") && this.config.formatCells !== !1)
          c = this.table.modules.format.formatExportValue(p, this.colVisProp);
        else
          switch (typeof c) {
            case "object":
              c = c !== null ? JSON.stringify(c) : "";
              break;
            case "undefined":
              c = "";
              break;
          }
        c instanceof Node ? a.appendChild(c) : a.innerHTML = c, f = ["padding-top", "padding-left", "padding-right", "padding-bottom", "border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "text-align"], l.isRowHeader ? (u = i.styleRowHeader, f.push("background-color")) : u = i.styleCells && i.styleCells[d] ? i.styleCells[d] : i.firstCell, u && (this.mapElementStyles(u, a, f), l.definition.align && (a.style.textAlign = l.definition.align)), this.table.options.dataTree && this.config.dataTree !== !1 && (t.treeElementField && t.treeElementField == l.field || !t.treeElementField && r == 0) && (e.component._row.modules.dataTree.controlEl && a.insertBefore(e.component._row.modules.dataTree.controlEl.cloneNode(!0), a.firstChild), e.component._row.modules.dataTree.branchEl && a.insertBefore(e.component._row.modules.dataTree.branchEl.cloneNode(!0), a.firstChild)), s.appendChild(a), p.modules.format && p.modules.format.renderedCallback && p.modules.format.renderedCallback();
      }
    }), t.rowFormatter && e.type === "row" && this.config.formatCells !== !1) {
      let n = Object.assign(e.component);
      n.getElement = function() {
        return s;
      }, t.rowFormatter(e.component);
    }
    return s;
  }
  generateHTMLTable(e) {
    var t = document.createElement("div");
    return t.appendChild(this.generateTableElement(e)), t.innerHTML;
  }
  getHtml(e, t, i, s) {
    var n = this.generateExportList(i || this.table.options.htmlOutputConfig, t, e, s || "htmlOutput");
    return this.generateHTMLTable(n);
  }
  mapElementStyles(e, t, i) {
    if (this.cloneTableStyle && e && t) {
      var s = {
        "background-color": "backgroundColor",
        color: "fontColor",
        width: "width",
        "font-weight": "fontWeight",
        "font-family": "fontFamily",
        "font-size": "fontSize",
        "text-align": "textAlign",
        "border-top": "borderTop",
        "border-left": "borderLeft",
        "border-right": "borderRight",
        "border-bottom": "borderBottom",
        "padding-top": "paddingTop",
        "padding-left": "paddingLeft",
        "padding-right": "paddingRight",
        "padding-bottom": "paddingBottom"
      };
      if (window.getComputedStyle) {
        var n = window.getComputedStyle(e);
        i.forEach(function(r) {
          t.style[s[r]] || (t.style[s[r]] = n.getPropertyValue(r));
        });
      }
    }
  }
};
C(Xe, "moduleName", "export"), C(Xe, "columnLookups", gl), C(Xe, "rowLookups", ml);
let zs = Xe;
var bl = {
  //equal to
  "=": function(o, e, t, i) {
    return e == o;
  },
  //less than
  "<": function(o, e, t, i) {
    return e < o;
  },
  //less than or equal to
  "<=": function(o, e, t, i) {
    return e <= o;
  },
  //greater than
  ">": function(o, e, t, i) {
    return e > o;
  },
  //greater than or equal to
  ">=": function(o, e, t, i) {
    return e >= o;
  },
  //not equal to
  "!=": function(o, e, t, i) {
    return e != o;
  },
  regex: function(o, e, t, i) {
    return typeof o == "string" && (o = new RegExp(o)), o.test(e);
  },
  //contains the string
  like: function(o, e, t, i) {
    return o === null || typeof o > "u" ? e === o : typeof e < "u" && e !== null ? String(e).toLowerCase().indexOf(o.toLowerCase()) > -1 : !1;
  },
  //contains the keywords
  keywords: function(o, e, t, i) {
    var s = o.toLowerCase().split(typeof i.separator > "u" ? " " : i.separator), n = String(e === null || typeof e > "u" ? "" : e).toLowerCase(), r = [];
    return s.forEach((a) => {
      n.includes(a) && r.push(!0);
    }), i.matchAll ? r.length === s.length : !!r.length;
  },
  //starts with the string
  starts: function(o, e, t, i) {
    return o === null || typeof o > "u" ? e === o : typeof e < "u" && e !== null ? String(e).toLowerCase().startsWith(o.toLowerCase()) : !1;
  },
  //ends with the string
  ends: function(o, e, t, i) {
    return o === null || typeof o > "u" ? e === o : typeof e < "u" && e !== null ? String(e).toLowerCase().endsWith(o.toLowerCase()) : !1;
  },
  //in array
  in: function(o, e, t, i) {
    return Array.isArray(o) ? o.length ? o.indexOf(e) > -1 : !0 : (console.warn("Filter Error - filter value is not an array:", o), !1);
  }
};
const He = class He extends A {
  constructor(e) {
    super(e), this.filterList = [], this.headerFilters = {}, this.headerFilterColumns = [], this.prevHeaderFilterChangeCheck = "", this.prevHeaderFilterChangeCheck = "{}", this.changed = !1, this.tableInitialized = !1, this.registerTableOption("filterMode", "local"), this.registerTableOption("initialFilter", !1), this.registerTableOption("initialHeaderFilter", !1), this.registerTableOption("headerFilterLiveFilterDelay", 300), this.registerTableOption("placeholderHeaderFilter", !1), this.registerColumnOption("headerFilter"), this.registerColumnOption("headerFilterPlaceholder"), this.registerColumnOption("headerFilterParams"), this.registerColumnOption("headerFilterEmptyCheck"), this.registerColumnOption("headerFilterFunc"), this.registerColumnOption("headerFilterFuncParams"), this.registerColumnOption("headerFilterLiveFilter"), this.registerTableFunction("searchRows", this.searchRows.bind(this)), this.registerTableFunction("searchData", this.searchData.bind(this)), this.registerTableFunction("setFilter", this.userSetFilter.bind(this)), this.registerTableFunction("refreshFilter", this.userRefreshFilter.bind(this)), this.registerTableFunction("addFilter", this.userAddFilter.bind(this)), this.registerTableFunction("getFilters", this.getFilters.bind(this)), this.registerTableFunction("setHeaderFilterFocus", this.userSetHeaderFilterFocus.bind(this)), this.registerTableFunction("getHeaderFilterValue", this.userGetHeaderFilterValue.bind(this)), this.registerTableFunction("setHeaderFilterValue", this.userSetHeaderFilterValue.bind(this)), this.registerTableFunction("getHeaderFilters", this.getHeaderFilters.bind(this)), this.registerTableFunction("removeFilter", this.userRemoveFilter.bind(this)), this.registerTableFunction("clearFilter", this.userClearFilter.bind(this)), this.registerTableFunction("clearHeaderFilter", this.userClearHeaderFilter.bind(this)), this.registerComponentFunction("column", "headerFilterFocus", this.setHeaderFilterFocus.bind(this)), this.registerComponentFunction("column", "reloadHeaderFilter", this.reloadHeaderFilter.bind(this)), this.registerComponentFunction("column", "getHeaderFilterValue", this.getHeaderFilterValue.bind(this)), this.registerComponentFunction("column", "setHeaderFilterValue", this.setHeaderFilterValue.bind(this));
  }
  initialize() {
    this.subscribe("column-init", this.initializeColumnHeaderFilter.bind(this)), this.subscribe("column-width-fit-before", this.hideHeaderFilterElements.bind(this)), this.subscribe("column-width-fit-after", this.showHeaderFilterElements.bind(this)), this.subscribe("table-built", this.tableBuilt.bind(this)), this.subscribe("placeholder", this.generatePlaceholder.bind(this)), this.table.options.filterMode === "remote" && this.subscribe("data-params", this.remoteFilterParams.bind(this)), this.registerDataHandler(this.filter.bind(this), 10);
  }
  tableBuilt() {
    this.table.options.initialFilter && this.setFilter(this.table.options.initialFilter), this.table.options.initialHeaderFilter && this.table.options.initialHeaderFilter.forEach((e) => {
      var t = this.table.columnManager.findColumn(e.field);
      if (t)
        this.setHeaderFilterValue(t, e.value);
      else
        return console.warn("Column Filter Error - No matching column found:", e.field), !1;
    }), this.tableInitialized = !0;
  }
  remoteFilterParams(e, t, i, s) {
    return s.filter = this.getFilters(!0, !0), s;
  }
  generatePlaceholder(e) {
    if (this.table.options.placeholderHeaderFilter && Object.keys(this.headerFilters).length)
      return this.table.options.placeholderHeaderFilter;
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  //set standard filters
  userSetFilter(e, t, i, s) {
    this.setFilter(e, t, i, s), this.refreshFilter();
  }
  //set standard filters
  userRefreshFilter() {
    this.refreshFilter();
  }
  //add filter to array
  userAddFilter(e, t, i, s) {
    this.addFilter(e, t, i, s), this.refreshFilter();
  }
  userSetHeaderFilterFocus(e) {
    var t = this.table.columnManager.findColumn(e);
    if (t)
      this.setHeaderFilterFocus(t);
    else
      return console.warn("Column Filter Focus Error - No matching column found:", e), !1;
  }
  userGetHeaderFilterValue(e) {
    var t = this.table.columnManager.findColumn(e);
    if (t)
      return this.getHeaderFilterValue(t);
    console.warn("Column Filter Error - No matching column found:", e);
  }
  userSetHeaderFilterValue(e, t) {
    var i = this.table.columnManager.findColumn(e);
    if (i)
      this.setHeaderFilterValue(i, t);
    else
      return console.warn("Column Filter Error - No matching column found:", e), !1;
  }
  //remove filter from array
  userRemoveFilter(e, t, i) {
    this.removeFilter(e, t, i), this.refreshFilter();
  }
  //clear filters
  userClearFilter(e) {
    this.clearFilter(e), this.refreshFilter();
  }
  //clear header filters
  userClearHeaderFilter() {
    this.clearHeaderFilter(), this.refreshFilter();
  }
  //search for specific row components
  searchRows(e, t, i) {
    return this.search("rows", e, t, i);
  }
  //search for specific data
  searchData(e, t, i) {
    return this.search("data", e, t, i);
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  initializeColumnHeaderFilter(e) {
    var t = e.definition;
    t.headerFilter && this.initializeColumn(e);
  }
  //initialize column header filter
  initializeColumn(e, t) {
    var i = this, s = e.getField();
    function n(r) {
      var a = e.modules.filter.tagType == "input" && e.modules.filter.attrType == "text" || e.modules.filter.tagType == "textarea" ? "partial" : "match", l = "", h = "", d;
      if (typeof e.modules.filter.prevSuccess > "u" || e.modules.filter.prevSuccess !== r) {
        if (e.modules.filter.prevSuccess = r, e.modules.filter.emptyFunc(r))
          delete i.headerFilters[s];
        else {
          switch (e.modules.filter.value = r, typeof e.definition.headerFilterFunc) {
            case "string":
              He.filters[e.definition.headerFilterFunc] ? (l = e.definition.headerFilterFunc, d = function(c) {
                var u = e.definition.headerFilterFuncParams || {}, f = e.getFieldValue(c);
                return u = typeof u == "function" ? u(r, f, c) : u, He.filters[e.definition.headerFilterFunc](r, f, c, u);
              }) : console.warn("Header Filter Error - Matching filter function not found: ", e.definition.headerFilterFunc);
              break;
            case "function":
              d = function(c) {
                var u = e.definition.headerFilterFuncParams || {}, f = e.getFieldValue(c);
                return u = typeof u == "function" ? u(r, f, c) : u, e.definition.headerFilterFunc(r, f, c, u);
              }, l = d;
              break;
          }
          if (!d)
            switch (a) {
              case "partial":
                d = function(c) {
                  var u = e.getFieldValue(c);
                  return typeof u < "u" && u !== null ? String(u).toLowerCase().indexOf(String(r).toLowerCase()) > -1 : !1;
                }, l = "like";
                break;
              default:
                d = function(c) {
                  return e.getFieldValue(c) == r;
                }, l = "=";
            }
          i.headerFilters[s] = { value: r, func: d, type: l };
        }
        e.modules.filter.value = r, h = JSON.stringify(i.headerFilters), i.prevHeaderFilterChangeCheck !== h && (i.prevHeaderFilterChangeCheck = h, i.trackChanges(), i.refreshFilter());
      }
      return !0;
    }
    e.modules.filter = {
      success: n,
      attrType: !1,
      tagType: !1,
      emptyFunc: !1
    }, this.generateHeaderFilterElement(e);
  }
  generateHeaderFilterElement(e, t, i) {
    var s = this, n = e.modules.filter.success, r = e.getField(), a, l, h, d, c, u, f, p;
    e.modules.filter.value = t;
    function g() {
    }
    function m(v) {
      p = v;
    }
    if (e.modules.filter.headerElement && e.modules.filter.headerElement.parentNode && e.contentElement.removeChild(e.modules.filter.headerElement.parentNode), r) {
      switch (e.modules.filter.emptyFunc = e.definition.headerFilterEmptyCheck || function(v) {
        return !v && v !== 0;
      }, a = document.createElement("div"), a.classList.add("tabulator-header-filter"), typeof e.definition.headerFilter) {
        case "string":
          s.table.modules.edit.editors[e.definition.headerFilter] ? (l = s.table.modules.edit.editors[e.definition.headerFilter], (e.definition.headerFilter === "tick" || e.definition.headerFilter === "tickCross") && !e.definition.headerFilterEmptyCheck && (e.modules.filter.emptyFunc = function(v) {
            return v !== !0 && v !== !1;
          })) : console.warn("Filter Error - Cannot build header filter, No such editor found: ", e.definition.editor);
          break;
        case "function":
          l = e.definition.headerFilter;
          break;
        case "boolean":
          e.modules.edit && e.modules.edit.editor ? l = e.modules.edit.editor : e.definition.formatter && s.table.modules.edit.editors[e.definition.formatter] ? (l = s.table.modules.edit.editors[e.definition.formatter], (e.definition.formatter === "tick" || e.definition.formatter === "tickCross") && !e.definition.headerFilterEmptyCheck && (e.modules.filter.emptyFunc = function(v) {
            return v !== !0 && v !== !1;
          })) : l = s.table.modules.edit.editors.input;
          break;
      }
      if (l) {
        if (d = {
          getValue: function() {
            return typeof t < "u" ? t : "";
          },
          getField: function() {
            return e.definition.field;
          },
          getElement: function() {
            return a;
          },
          getColumn: function() {
            return e.getComponent();
          },
          getTable: () => this.table,
          getType: () => "header",
          getRow: function() {
            return {
              normalizeHeight: function() {
              }
            };
          }
        }, f = e.definition.headerFilterParams || {}, f = typeof f == "function" ? f.call(s.table, d) : f, h = l.call(this.table.modules.edit, d, m, n, g, f), !h) {
          console.warn("Filter Error - Cannot add filter to " + r + " column, editor returned a value of false");
          return;
        }
        if (!(h instanceof Node)) {
          console.warn("Filter Error - Cannot add filter to " + r + " column, editor should return an instance of Node, the editor returned:", h);
          return;
        }
        s.langBind("headerFilters|columns|" + e.definition.field, function(v) {
          h.setAttribute("placeholder", typeof v < "u" && v ? v : e.definition.headerFilterPlaceholder || s.langText("headerFilters|default"));
        }), h.addEventListener("click", function(v) {
          v.stopPropagation(), h.focus();
        }), h.addEventListener("focus", (v) => {
          var x = this.table.columnManager.contentsElement.scrollLeft, E = this.table.rowManager.element.scrollLeft;
          x !== E && (this.table.rowManager.scrollHorizontal(x), this.table.columnManager.scrollHorizontal(x));
        }), c = !1, u = function(v) {
          c && clearTimeout(c), c = setTimeout(function() {
            n(h.value);
          }, s.table.options.headerFilterLiveFilterDelay);
        }, e.modules.filter.headerElement = h, e.modules.filter.attrType = h.hasAttribute("type") ? h.getAttribute("type").toLowerCase() : "", e.modules.filter.tagType = h.tagName.toLowerCase(), e.definition.headerFilterLiveFilter !== !1 && (e.definition.headerFilter === "autocomplete" || e.definition.headerFilter === "tickCross" || (e.definition.editor === "autocomplete" || e.definition.editor === "tickCross") && e.definition.headerFilter === !0 || (h.addEventListener("keyup", u), h.addEventListener("search", u), e.modules.filter.attrType == "number" && h.addEventListener("change", function(v) {
          n(h.value);
        }), e.modules.filter.attrType == "text" && this.table.browser !== "ie" && h.setAttribute("type", "search")), (e.modules.filter.tagType == "input" || e.modules.filter.tagType == "select" || e.modules.filter.tagType == "textarea") && h.addEventListener("mousedown", function(v) {
          v.stopPropagation();
        })), a.appendChild(h), e.contentElement.appendChild(a), i || s.headerFilterColumns.push(e), p && p();
      }
    } else
      console.warn("Filter Error - Cannot add header filter, column has no field set:", e.definition.title);
  }
  //hide all header filter elements (used to ensure correct column widths in "fitData" layout mode)
  hideHeaderFilterElements() {
    this.headerFilterColumns.forEach(function(e) {
      e.modules.filter && e.modules.filter.headerElement && (e.modules.filter.headerElement.style.display = "none");
    });
  }
  //show all header filter elements (used to ensure correct column widths in "fitData" layout mode)
  showHeaderFilterElements() {
    this.headerFilterColumns.forEach(function(e) {
      e.modules.filter && e.modules.filter.headerElement && (e.modules.filter.headerElement.style.display = "");
    });
  }
  //programmatically set focus of header filter
  setHeaderFilterFocus(e) {
    e.modules.filter && e.modules.filter.headerElement ? e.modules.filter.headerElement.focus() : console.warn("Column Filter Focus Error - No header filter set on column:", e.getField());
  }
  //programmatically get value of header filter
  getHeaderFilterValue(e) {
    if (e.modules.filter && e.modules.filter.headerElement)
      return e.modules.filter.value;
    console.warn("Column Filter Error - No header filter set on column:", e.getField());
  }
  //programmatically set value of header filter
  setHeaderFilterValue(e, t) {
    e && (e.modules.filter && e.modules.filter.headerElement ? (this.generateHeaderFilterElement(e, t, !0), e.modules.filter.success(t)) : console.warn("Column Filter Error - No header filter set on column:", e.getField()));
  }
  reloadHeaderFilter(e) {
    e && (e.modules.filter && e.modules.filter.headerElement ? this.generateHeaderFilterElement(e, e.modules.filter.value, !0) : console.warn("Column Filter Error - No header filter set on column:", e.getField()));
  }
  refreshFilter() {
    this.tableInitialized && (this.table.options.filterMode === "remote" ? this.reloadData(null, !1, !1) : this.refreshData(!0));
  }
  //check if the filters has changed since last use
  trackChanges() {
    this.changed = !0, this.dispatch("filter-changed");
  }
  //check if the filters has changed since last use
  hasChanged() {
    var e = this.changed;
    return this.changed = !1, e;
  }
  //set standard filters
  setFilter(e, t, i, s) {
    this.filterList = [], Array.isArray(e) || (e = [{ field: e, type: t, value: i, params: s }]), this.addFilter(e);
  }
  //add filter to array
  addFilter(e, t, i, s) {
    var n = !1;
    Array.isArray(e) || (e = [{ field: e, type: t, value: i, params: s }]), e.forEach((r) => {
      r = this.findFilter(r), r && (this.filterList.push(r), n = !0);
    }), n && this.trackChanges();
  }
  findFilter(e) {
    var t;
    if (Array.isArray(e))
      return this.findSubFilters(e);
    var i = !1;
    return typeof e.field == "function" ? i = function(s) {
      return e.field(s, e.type || {});
    } : He.filters[e.type] ? (t = this.table.columnManager.getColumnByField(e.field), t ? i = function(s) {
      return He.filters[e.type](e.value, t.getFieldValue(s), s, e.params || {});
    } : i = function(s) {
      return He.filters[e.type](e.value, s[e.field], s, e.params || {});
    }) : console.warn("Filter Error - No such filter type found, ignoring: ", e.type), e.func = i, e.func ? e : !1;
  }
  findSubFilters(e) {
    var t = [];
    return e.forEach((i) => {
      i = this.findFilter(i), i && t.push(i);
    }), t.length ? t : !1;
  }
  //get all filters
  getFilters(e, t) {
    var i = [];
    return e && (i = this.getHeaderFilters()), t && i.forEach(function(s) {
      typeof s.type == "function" && (s.type = "function");
    }), i = i.concat(this.filtersToArray(this.filterList, t)), i;
  }
  //filter to Object
  filtersToArray(e, t) {
    var i = [];
    return e.forEach((s) => {
      var n;
      Array.isArray(s) ? i.push(this.filtersToArray(s, t)) : (n = { field: s.field, type: s.type, value: s.value }, t && typeof n.type == "function" && (n.type = "function"), i.push(n));
    }), i;
  }
  //get all filters
  getHeaderFilters() {
    var e = [];
    for (var t in this.headerFilters)
      e.push({ field: t, type: this.headerFilters[t].type, value: this.headerFilters[t].value });
    return e;
  }
  //remove filter from array
  removeFilter(e, t, i) {
    Array.isArray(e) || (e = [{ field: e, type: t, value: i }]), e.forEach((s) => {
      var n = -1;
      typeof s.field == "object" ? n = this.filterList.findIndex((r) => s === r) : n = this.filterList.findIndex((r) => s.field === r.field && s.type === r.type && s.value === r.value), n > -1 ? this.filterList.splice(n, 1) : console.warn("Filter Error - No matching filter type found, ignoring: ", s.type);
    }), this.trackChanges();
  }
  //clear filters
  clearFilter(e) {
    this.filterList = [], e && this.clearHeaderFilter(), this.trackChanges();
  }
  //clear header filters
  clearHeaderFilter() {
    this.headerFilters = {}, this.prevHeaderFilterChangeCheck = "{}", this.headerFilterColumns.forEach((e) => {
      typeof e.modules.filter.value < "u" && delete e.modules.filter.value, e.modules.filter.prevSuccess = void 0, this.reloadHeaderFilter(e);
    }), this.trackChanges();
  }
  //search data and return matching rows
  search(e, t, i, s) {
    var n = [], r = [];
    return Array.isArray(t) || (t = [{ field: t, type: i, value: s }]), t.forEach((a) => {
      a = this.findFilter(a), a && r.push(a);
    }), this.table.rowManager.rows.forEach((a) => {
      var l = !0;
      r.forEach((h) => {
        this.filterRecurse(h, a.getData()) || (l = !1);
      }), l && n.push(e === "data" ? a.getData("data") : a.getComponent());
    }), n;
  }
  //filter row array
  filter(e, t) {
    var i = [], s = [];
    return this.subscribedExternal("dataFiltering") && this.dispatchExternal("dataFiltering", this.getFilters(!0)), this.table.options.filterMode !== "remote" && (this.filterList.length || Object.keys(this.headerFilters).length) ? e.forEach((n) => {
      this.filterRow(n) && i.push(n);
    }) : i = e.slice(0), this.subscribedExternal("dataFiltered") && (i.forEach((n) => {
      s.push(n.getComponent());
    }), this.dispatchExternal("dataFiltered", this.getFilters(!0), s)), i;
  }
  //filter individual row
  filterRow(e, t) {
    var i = !0, s = e.getData();
    this.filterList.forEach((r) => {
      this.filterRecurse(r, s) || (i = !1);
    });
    for (var n in this.headerFilters)
      this.headerFilters[n].func(s) || (i = !1);
    return i;
  }
  filterRecurse(e, t) {
    var i = !1;
    return Array.isArray(e) ? e.forEach((s) => {
      this.filterRecurse(s, t) && (i = !0);
    }) : i = e.func(t), i;
  }
};
C(He, "moduleName", "filter"), //load defaults
C(He, "filters", bl);
let Fs = He;
function vl(o, e, t) {
  return this.emptyToSpace(this.sanitizeHTML(o.getValue()));
}
function wl(o, e, t) {
  return o.getValue();
}
function yl(o, e, t) {
  return o.getElement().style.whiteSpace = "pre-wrap", this.emptyToSpace(this.sanitizeHTML(o.getValue()));
}
function Cl(o, e, t) {
  var i = parseFloat(o.getValue()), s = "", n, r, a, l, h, d = e.decimal || ".", c = e.thousand || ",", u = e.negativeSign || "-", f = e.symbol || "", p = !!e.symbolAfter, g = typeof e.precision < "u" ? e.precision : 2;
  if (isNaN(i))
    return this.emptyToSpace(this.sanitizeHTML(o.getValue()));
  if (i < 0 && (i = Math.abs(i), s = u), n = g !== !1 ? i.toFixed(g) : i, n = String(n).split("."), r = n[0], a = n.length > 1 ? d + n[1] : "", e.thousand !== !1)
    for (l = /(\d+)(\d{3})/; l.test(r); )
      r = r.replace(l, "$1" + c + "$2");
  return h = r + a, s === !0 ? (h = "(" + h + ")", p ? h + f : f + h) : p ? s + h + f : s + f + h;
}
function El(o, e, t) {
  var i = o.getValue(), s = e.urlPrefix || "", n = e.download, r = i, a = document.createElement("a"), l;
  function h(d, c) {
    var u = d.shift(), f = c[u];
    return d.length && typeof f == "object" ? h(d, f) : f;
  }
  if (e.labelField && (l = o.getData(), r = h(e.labelField.split(this.table.options.nestedFieldSeparator), l)), e.label)
    switch (typeof e.label) {
      case "string":
        r = e.label;
        break;
      case "function":
        r = e.label(o);
        break;
    }
  if (r) {
    if (e.urlField && (l = o.getData(), i = $.retrieveNestedData(this.table.options.nestedFieldSeparator, e.urlField, l)), e.url)
      switch (typeof e.url) {
        case "string":
          i = e.url;
          break;
        case "function":
          i = e.url(o);
          break;
      }
    return a.setAttribute("href", s + i), e.target && a.setAttribute("target", e.target), e.download && (typeof n == "function" ? n = n(o) : n = n === !0 ? "" : n, a.setAttribute("download", n)), a.innerHTML = this.emptyToSpace(this.sanitizeHTML(r)), a;
  } else
    return "&nbsp;";
}
function xl(o, e, t) {
  var i = document.createElement("img"), s = o.getValue();
  switch (e.urlPrefix && (s = e.urlPrefix + o.getValue()), e.urlSuffix && (s = s + e.urlSuffix), i.setAttribute("src", s), typeof e.height) {
    case "number":
      i.style.height = e.height + "px";
      break;
    case "string":
      i.style.height = e.height;
      break;
  }
  switch (typeof e.width) {
    case "number":
      i.style.width = e.width + "px";
      break;
    case "string":
      i.style.width = e.width;
      break;
  }
  return i.addEventListener("load", function() {
    o.getRow().normalizeHeight();
  }), i;
}
function _l(o, e, t) {
  var i = o.getValue(), s = o.getElement(), n = e.allowEmpty, r = e.allowTruthy, a = Object.keys(e).includes("trueValue"), l = typeof e.tickElement < "u" ? e.tickElement : '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#2DC214" clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/></svg>', h = typeof e.crossElement < "u" ? e.crossElement : '<svg enable-background="new 0 0 24 24" height="14" width="14"  viewBox="0 0 24 24" xml:space="preserve" ><path fill="#CE1515" d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';
  return a && i === e.trueValue || !a && (r && i || i === !0 || i === "true" || i === "True" || i === 1 || i === "1") ? (s.setAttribute("aria-checked", !0), l || "") : n && (i === "null" || i === "" || i === null || typeof i > "u") ? (s.setAttribute("aria-checked", "mixed"), "") : (s.setAttribute("aria-checked", !1), h || "");
}
function Rl(o, e, t) {
  var i = this.table.dependencyRegistry.lookup(["luxon", "DateTime"], "DateTime"), s = e.inputFormat || "yyyy-MM-dd HH:mm:ss", n = e.outputFormat || "dd/MM/yyyy HH:mm:ss", r = typeof e.invalidPlaceholder < "u" ? e.invalidPlaceholder : "", a = o.getValue();
  if (typeof i < "u") {
    var l;
    return i.isDateTime(a) ? l = a : s === "iso" ? l = i.fromISO(String(a)) : l = i.fromFormat(String(a), s), l.isValid ? (e.timezone && (l = l.setZone(e.timezone)), l.toFormat(n)) : r === !0 || !a ? a : typeof r == "function" ? r(a) : r;
  } else
    console.error("Format Error - 'datetime' formatter is dependant on luxon.js");
}
function kl(o, e, t) {
  var i = this.table.dependencyRegistry.lookup(["luxon", "DateTime"], "DateTime"), s = e.inputFormat || "yyyy-MM-dd HH:mm:ss", n = typeof e.invalidPlaceholder < "u" ? e.invalidPlaceholder : "", r = typeof e.suffix < "u" ? e.suffix : !1, a = typeof e.unit < "u" ? e.unit : "days", l = typeof e.humanize < "u" ? e.humanize : !1, h = typeof e.date < "u" ? e.date : i.now(), d = o.getValue();
  if (typeof i < "u") {
    var c;
    return i.isDateTime(d) ? c = d : s === "iso" ? c = i.fromISO(String(d)) : c = i.fromFormat(String(d), s), c.isValid ? l ? c.diff(h, a).toHuman() + (r ? " " + r : "") : parseInt(c.diff(h, a)[a]) + (r ? " " + r : "") : n === !0 ? d : typeof n == "function" ? n(d) : n;
  } else
    console.error("Format Error - 'datetimediff' formatter is dependant on luxon.js");
}
function Ml(o, e, t) {
  var i = o.getValue();
  return typeof e[i] > "u" ? (console.warn("Missing display value for " + i), i) : e[i];
}
function Tl(o, e, t) {
  var i = o.getValue(), s = o.getElement(), n = e && e.stars ? e.stars : 5, r = document.createElement("span"), a = document.createElementNS("http://www.w3.org/2000/svg", "svg"), l = '<polygon fill="#FFEA00" stroke="#C1AB60" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>', h = '<polygon fill="#D2D2D2" stroke="#686868" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>';
  r.style.verticalAlign = "middle", a.setAttribute("width", "14"), a.setAttribute("height", "14"), a.setAttribute("viewBox", "0 0 512 512"), a.setAttribute("xml:space", "preserve"), a.style.padding = "0 1px", i = i && !isNaN(i) ? parseInt(i) : 0, i = Math.max(0, Math.min(i, n));
  for (var d = 1; d <= n; d++) {
    var c = a.cloneNode(!0);
    c.innerHTML = d <= i ? l : h, r.appendChild(c);
  }
  return s.style.whiteSpace = "nowrap", s.style.overflow = "hidden", s.style.textOverflow = "ellipsis", s.setAttribute("aria-label", i), r;
}
function Sl(o, e, t) {
  var i = this.sanitizeHTML(o.getValue()) || 0, s = document.createElement("span"), n = e && e.max ? e.max : 100, r = e && e.min ? e.min : 0, a = e && typeof e.color < "u" ? e.color : ["red", "orange", "green"], l = "#666666", h, d;
  if (!(isNaN(i) || typeof o.getValue() > "u")) {
    switch (s.classList.add("tabulator-traffic-light"), d = parseFloat(i) <= n ? parseFloat(i) : n, d = parseFloat(d) >= r ? parseFloat(d) : r, h = (n - r) / 100, d = Math.round((d - r) / h), typeof a) {
      case "string":
        l = a;
        break;
      case "function":
        l = a(i);
        break;
      case "object":
        if (Array.isArray(a)) {
          var c = 100 / a.length, u = Math.floor(d / c);
          u = Math.min(u, a.length - 1), u = Math.max(u, 0), l = a[u];
          break;
        }
    }
    return s.style.backgroundColor = l, s;
  }
}
function Ll(o, e = {}, t) {
  var i = this.sanitizeHTML(o.getValue()) || 0, s = o.getElement(), n = e.max ? e.max : 100, r = e.min ? e.min : 0, a = e.legendAlign ? e.legendAlign : "center", l, h, d, c, u;
  switch (h = parseFloat(i) <= n ? parseFloat(i) : n, h = parseFloat(h) >= r ? parseFloat(h) : r, l = (n - r) / 100, h = Math.round((h - r) / l), typeof e.color) {
    case "string":
      d = e.color;
      break;
    case "function":
      d = e.color(i);
      break;
    case "object":
      if (Array.isArray(e.color)) {
        let m = 100 / e.color.length, v = Math.floor(h / m);
        v = Math.min(v, e.color.length - 1), v = Math.max(v, 0), d = e.color[v];
        break;
      }
    default:
      d = "#2DC214";
  }
  switch (typeof e.legend) {
    case "string":
      c = e.legend;
      break;
    case "function":
      c = e.legend(i);
      break;
    case "boolean":
      c = i;
      break;
    default:
      c = !1;
  }
  switch (typeof e.legendColor) {
    case "string":
      u = e.legendColor;
      break;
    case "function":
      u = e.legendColor(i);
      break;
    case "object":
      if (Array.isArray(e.legendColor)) {
        let m = 100 / e.legendColor.length, v = Math.floor(h / m);
        v = Math.min(v, e.legendColor.length - 1), v = Math.max(v, 0), u = e.legendColor[v];
      }
      break;
    default:
      u = "#000";
  }
  s.style.minWidth = "30px", s.style.position = "relative", s.setAttribute("aria-label", h);
  var f = document.createElement("div");
  f.style.display = "inline-block", f.style.width = h + "%", f.style.backgroundColor = d, f.style.height = "100%", f.setAttribute("data-max", n), f.setAttribute("data-min", r);
  var p = document.createElement("div");
  if (p.style.position = "relative", p.style.width = "100%", p.style.height = "100%", c) {
    var g = document.createElement("div");
    g.style.position = "absolute", g.style.top = 0, g.style.left = 0, g.style.textAlign = a, g.style.width = "100%", g.style.color = u, g.innerHTML = c;
  }
  return t(function() {
    if (!(o instanceof rr)) {
      var m = document.createElement("div");
      m.style.position = "absolute", m.style.top = "4px", m.style.bottom = "4px", m.style.left = "4px", m.style.right = "4px", s.appendChild(m), s = m;
    }
    s.appendChild(p), p.appendChild(f), c && p.appendChild(g);
  }), "";
}
function Dl(o, e, t) {
  return o.getElement().style.backgroundColor = this.sanitizeHTML(o.getValue()), "";
}
function zl(o, e, t) {
  return '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#2DC214" clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/></svg>';
}
function Fl(o, e, t) {
  return '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#CE1515" d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';
}
function Ol(o, e, t) {
  var i = o.getValue(), s = e.size || 15, n = s + "px", r, a, l = e.hasOwnProperty("onValue") ? e.onValue : !0, h = e.hasOwnProperty("offValue") ? e.offValue : !1, d = e.onTruthy ? i : i === l;
  return r = document.createElement("div"), r.classList.add("tabulator-toggle"), d ? (r.classList.add("tabulator-toggle-on"), r.style.flexDirection = "row-reverse", e.onColor && (r.style.background = e.onColor)) : e.offColor && (r.style.background = e.offColor), r.style.width = 2.5 * s + "px", r.style.borderRadius = n, e.clickable && r.addEventListener("click", (c) => {
    o.setValue(d ? h : l);
  }), a = document.createElement("div"), a.classList.add("tabulator-toggle-switch"), a.style.height = n, a.style.width = n, a.style.borderRadius = n, r.appendChild(a), r;
}
function Pl(o, e, t) {
  var i = document.createElement("span"), s = o.getRow(), n = o.getTable();
  return s.watchPosition((r) => {
    e.relativeToPage && (r += n.modules.page.getPageSize() * (n.modules.page.getPage() - 1)), i.innerText = r;
  }), i;
}
function Al(o, e, t) {
  return o.getElement().classList.add("tabulator-row-handle"), "<div class='tabulator-row-handle-box'><div class='tabulator-row-handle-bar'></div><div class='tabulator-row-handle-bar'></div><div class='tabulator-row-handle-bar'></div></div>";
}
function Hl(o, e, t) {
  var i, s, n;
  function r(a) {
    var l = a.getValue(), h = "plaintext";
    switch (typeof l) {
      case "boolean":
        h = "tickCross";
        break;
      case "string":
        l.includes(`
`) && (h = "textarea");
        break;
    }
    return h;
  }
  return i = e.formatterLookup ? e.formatterLookup(o) : r(o), e.paramsLookup && (n = typeof e.paramsLookup == "function" ? e.paramsLookup(i, o) : e.paramsLookup[i]), s = this.table.modules.format.lookupFormatter(i), s.call(this, o, n || {}, t);
}
function Il(o, e, t) {
  var i = e.delimiter || ",", s = o.getValue(), n = this.table, r;
  return e.valueMap && (typeof e.valueMap == "string" ? r = function(a) {
    return a.map((l) => $.retrieveNestedData(n.options.nestedFieldSeparator, e.valueMap, l));
  } : r = e.valueMap), Array.isArray(s) ? (r && (s = r(s)), s.join(i)) : s;
}
function Bl(o, e, t) {
  var i = e.indent || "	", s = typeof e.multiline > "u" ? !0 : e.multiline, n = e.replacer || null, r = o.getValue();
  return s && (o.getElement().style.whiteSpace = "pre-wrap"), JSON.stringify(r, n, i);
}
var Vl = {
  plaintext: vl,
  html: wl,
  textarea: yl,
  money: Cl,
  link: El,
  image: xl,
  tickCross: _l,
  datetime: Rl,
  datetimediff: kl,
  lookup: Ml,
  star: Tl,
  traffic: Sl,
  progress: Ll,
  color: Dl,
  buttonTick: zl,
  buttonCross: Fl,
  toggle: Ol,
  rownum: Pl,
  handle: Al,
  adaptable: Hl,
  array: Il,
  json: Bl
};
const Ye = class Ye extends A {
  constructor(e) {
    super(e), this.registerColumnOption("formatter"), this.registerColumnOption("formatterParams"), this.registerColumnOption("formatterPrint"), this.registerColumnOption("formatterPrintParams"), this.registerColumnOption("formatterClipboard"), this.registerColumnOption("formatterClipboardParams"), this.registerColumnOption("formatterHtmlOutput"), this.registerColumnOption("formatterHtmlOutputParams"), this.registerColumnOption("titleFormatter"), this.registerColumnOption("titleFormatterParams");
  }
  initialize() {
    this.subscribe("cell-format", this.formatValue.bind(this)), this.subscribe("cell-rendered", this.cellRendered.bind(this)), this.subscribe("column-layout", this.initializeColumn.bind(this)), this.subscribe("column-format", this.formatHeader.bind(this));
  }
  //initialize column formatter
  initializeColumn(e) {
    e.modules.format = this.lookupTypeFormatter(e, ""), typeof e.definition.formatterPrint < "u" && (e.modules.format.print = this.lookupTypeFormatter(e, "Print")), typeof e.definition.formatterClipboard < "u" && (e.modules.format.clipboard = this.lookupTypeFormatter(e, "Clipboard")), typeof e.definition.formatterHtmlOutput < "u" && (e.modules.format.htmlOutput = this.lookupTypeFormatter(e, "HtmlOutput"));
  }
  lookupTypeFormatter(e, t) {
    var i = { params: e.definition["formatter" + t + "Params"] || {} }, s = e.definition["formatter" + t];
    return i.formatter = this.lookupFormatter(s), i;
  }
  lookupFormatter(e) {
    var t;
    switch (typeof e) {
      case "string":
        Ye.formatters[e] ? t = Ye.formatters[e] : (console.warn("Formatter Error - No such formatter found: ", e), t = Ye.formatters.plaintext);
        break;
      case "function":
        t = e;
        break;
      default:
        t = Ye.formatters.plaintext;
        break;
    }
    return t;
  }
  cellRendered(e) {
    e.modules.format && e.modules.format.renderedCallback && !e.modules.format.rendered && (e.modules.format.renderedCallback(), e.modules.format.rendered = !0);
  }
  //return a formatted value for a column header
  formatHeader(e, t, i) {
    var s, n, r, a;
    return e.definition.titleFormatter ? (s = this.lookupFormatter(e.definition.titleFormatter), r = (l) => {
      e.titleFormatterRendered = l;
    }, a = {
      getValue: function() {
        return t;
      },
      getElement: function() {
        return i;
      },
      getType: function() {
        return "header";
      },
      getColumn: function() {
        return e.getComponent();
      },
      getTable: () => this.table
    }, n = e.definition.titleFormatterParams || {}, n = typeof n == "function" ? n() : n, s.call(this, a, n, r)) : t;
  }
  //return a formatted value for a cell
  formatValue(e) {
    var t = e.getComponent(), i = typeof e.column.modules.format.params == "function" ? e.column.modules.format.params(t) : e.column.modules.format.params;
    function s(n) {
      e.modules.format || (e.modules.format = {}), e.modules.format.renderedCallback = n, e.modules.format.rendered = !1;
    }
    return e.column.modules.format.formatter.call(this, t, i, s);
  }
  formatExportValue(e, t) {
    var i = e.column.modules.format[t], s;
    if (i) {
      let n = function(r) {
        e.modules.format || (e.modules.format = {}), e.modules.format.renderedCallback = r, e.modules.format.rendered = !1;
      };
      return s = typeof i.params == "function" ? i.params(e.getComponent()) : i.params, i.formatter.call(this, e.getComponent(), s, n);
    } else
      return this.formatValue(e);
  }
  sanitizeHTML(e) {
    if (e) {
      var t = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
        "`": "&#x60;",
        "=": "&#x3D;"
      };
      return String(e).replace(/[&<>"'`=/]/g, function(i) {
        return t[i];
      });
    } else
      return e;
  }
  emptyToSpace(e) {
    return e === null || typeof e > "u" || e === "" ? "&nbsp;" : e;
  }
};
C(Ye, "moduleName", "format"), //load defaults
C(Ye, "formatters", Vl);
let Os = Ye;
class dr extends A {
  constructor(e) {
    super(e), this.leftColumns = [], this.rightColumns = [], this.initializationMode = "left", this.active = !1, this.blocked = !0, this.registerColumnOption("frozen");
  }
  //reset initial state
  reset() {
    this.initializationMode = "left", this.leftColumns = [], this.rightColumns = [], this.active = !1;
  }
  initialize() {
    this.subscribe("cell-layout", this.layoutCell.bind(this)), this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("column-width", this.layout.bind(this)), this.subscribe("row-layout-after", this.layoutRow.bind(this)), this.subscribe("table-layout", this.layout.bind(this)), this.subscribe("columns-loading", this.reset.bind(this)), this.subscribe("column-add", this.reinitializeColumns.bind(this)), this.subscribe("column-deleted", this.reinitializeColumns.bind(this)), this.subscribe("column-hide", this.reinitializeColumns.bind(this)), this.subscribe("column-show", this.reinitializeColumns.bind(this)), this.subscribe("columns-loaded", this.reinitializeColumns.bind(this)), this.subscribe("table-redraw", this.layout.bind(this)), this.subscribe("layout-refreshing", this.blockLayout.bind(this)), this.subscribe("layout-refreshed", this.unblockLayout.bind(this)), this.subscribe("scrollbar-vertical", this.adjustForScrollbar.bind(this));
  }
  blockLayout() {
    this.blocked = !0;
  }
  unblockLayout() {
    this.blocked = !1;
  }
  layoutCell(e) {
    this.layoutElement(e.element, e.column);
  }
  reinitializeColumns() {
    this.reset(), this.table.columnManager.columnsByIndex.forEach((e) => {
      this.initializeColumn(e);
    }), this.layout();
  }
  //initialize specific column
  initializeColumn(e) {
    var t = { margin: 0, edge: !1 };
    e.isGroup || (this.frozenCheck(e) ? (t.position = this.initializationMode, this.initializationMode == "left" ? this.leftColumns.push(e) : this.rightColumns.unshift(e), this.active = !0, e.modules.frozen = t) : this.initializationMode = "right");
  }
  frozenCheck(e) {
    return e.parent.isGroup && e.definition.frozen && console.warn("Frozen Column Error - Parent column group must be frozen, not individual columns or sub column groups"), e.parent.isGroup ? this.frozenCheck(e.parent) : e.definition.frozen;
  }
  //layout calculation rows
  layoutCalcRows() {
    this.table.modExists("columnCalcs") && (this.table.modules.columnCalcs.topInitialized && this.table.modules.columnCalcs.topRow && this.layoutRow(this.table.modules.columnCalcs.topRow), this.table.modules.columnCalcs.botInitialized && this.table.modules.columnCalcs.botRow && this.layoutRow(this.table.modules.columnCalcs.botRow), this.table.modExists("groupRows") && this.layoutGroupCalcs(this.table.modules.groupRows.getGroups()));
  }
  layoutGroupCalcs(e) {
    e.forEach((t) => {
      t.calcs.top && this.layoutRow(t.calcs.top), t.calcs.bottom && this.layoutRow(t.calcs.bottom), t.groupList && t.groupList.length && this.layoutGroupCalcs(t.groupList);
    });
  }
  //calculate column positions and layout headers
  layoutColumnPosition(e) {
    var t = [], i = 0, s = 0;
    this.leftColumns.forEach((n, r) => {
      if (n.modules.frozen.marginValue = i, n.modules.frozen.margin = n.modules.frozen.marginValue + "px", n.visible && (i += n.getWidth()), r == this.leftColumns.length - 1 ? n.modules.frozen.edge = !0 : n.modules.frozen.edge = !1, n.parent.isGroup) {
        var a = this.getColGroupParentElement(n);
        t.includes(a) || (this.layoutElement(a, n), t.push(a)), a.classList.toggle("tabulator-frozen-left", n.modules.frozen.edge && n.modules.frozen.position === "left"), a.classList.toggle("tabulator-frozen-right", n.modules.frozen.edge && n.modules.frozen.position === "right");
      } else
        this.layoutElement(n.getElement(), n);
      e && n.cells.forEach((l) => {
        this.layoutElement(l.getElement(!0), n);
      });
    }), this.rightColumns.forEach((n, r) => {
      n.modules.frozen.marginValue = s, n.modules.frozen.margin = n.modules.frozen.marginValue + "px", n.visible && (s += n.getWidth()), r == this.rightColumns.length - 1 ? n.modules.frozen.edge = !0 : n.modules.frozen.edge = !1, n.parent.isGroup ? this.layoutElement(this.getColGroupParentElement(n), n) : this.layoutElement(n.getElement(), n), e && n.cells.forEach((a) => {
        this.layoutElement(a.getElement(!0), n);
      });
    });
  }
  getColGroupParentElement(e) {
    return e.parent.isGroup ? this.getColGroupParentElement(e.parent) : e.getElement();
  }
  //layout columns appropriately
  layout() {
    this.active && !this.blocked && (this.layoutColumnPosition(), this.reinitializeRows(), this.layoutCalcRows());
  }
  reinitializeRows() {
    var e = this.table.rowManager.getVisibleRows(!0), t = this.table.rowManager.getRows().filter((i) => !e.includes(i));
    t.forEach((i) => {
      i.deinitialize();
    }), e.forEach((i) => {
      i.type === "row" && this.layoutRow(i);
    });
  }
  layoutRow(e) {
    this.table.options.layout === "fitDataFill" && this.rightColumns.length && (this.table.rowManager.getTableElement().style.minWidth = "calc(100% - " + this.rightMargin + ")"), this.leftColumns.forEach((t) => {
      var i = e.getCell(t);
      i && this.layoutElement(i.getElement(!0), t);
    }), this.rightColumns.forEach((t) => {
      var i = e.getCell(t);
      i && this.layoutElement(i.getElement(!0), t);
    });
  }
  layoutElement(e, t) {
    var i;
    t.modules.frozen && e && (e.style.position = "sticky", this.table.rtl ? i = t.modules.frozen.position === "left" ? "right" : "left" : i = t.modules.frozen.position, e.style[i] = t.modules.frozen.margin, e.classList.add("tabulator-frozen"), e.classList.toggle("tabulator-frozen-left", t.modules.frozen.edge && t.modules.frozen.position === "left"), e.classList.toggle("tabulator-frozen-right", t.modules.frozen.edge && t.modules.frozen.position === "right"));
  }
  adjustForScrollbar(e) {
    this.rightColumns.length && (this.table.columnManager.getContentsElement().style.width = "calc(100% - " + e + "px)");
  }
  getFrozenColumns() {
    return this.leftColumns.concat(this.rightColumns);
  }
  _calcSpace(e, t) {
    var i = 0;
    for (let s = 0; s < t; s++)
      e[s].visible && (i += e[s].getWidth());
    return i;
  }
}
C(dr, "moduleName", "frozenColumns");
class cr extends A {
  constructor(e) {
    super(e), this.topElement = document.createElement("div"), this.rows = [], this.registerComponentFunction("row", "freeze", this.freezeRow.bind(this)), this.registerComponentFunction("row", "unfreeze", this.unfreezeRow.bind(this)), this.registerComponentFunction("row", "isFrozen", this.isRowFrozen.bind(this)), this.registerTableOption("frozenRowsField", "id"), this.registerTableOption("frozenRows", !1);
  }
  initialize() {
    var e = document.createDocumentFragment();
    this.rows = [], this.topElement.classList.add("tabulator-frozen-rows-holder"), e.appendChild(document.createElement("br")), e.appendChild(this.topElement), this.table.columnManager.getContentsElement().insertBefore(e, this.table.columnManager.headersElement.nextSibling), this.subscribe("row-deleting", this.detachRow.bind(this)), this.subscribe("rows-visible", this.visibleRows.bind(this)), this.registerDisplayHandler(this.getRows.bind(this), 10), this.table.options.frozenRows && (this.subscribe("data-processed", this.initializeRows.bind(this)), this.subscribe("row-added", this.initializeRow.bind(this)), this.subscribe("table-redrawing", this.resizeHolderWidth.bind(this)), this.subscribe("column-resized", this.resizeHolderWidth.bind(this)), this.subscribe("column-show", this.resizeHolderWidth.bind(this)), this.subscribe("column-hide", this.resizeHolderWidth.bind(this))), this.resizeHolderWidth();
  }
  resizeHolderWidth() {
    this.topElement.style.minWidth = this.table.columnManager.headersElement.offsetWidth + "px";
  }
  initializeRows() {
    this.table.rowManager.getRows().forEach((e) => {
      this.initializeRow(e);
    });
  }
  initializeRow(e) {
    var t = this.table.options.frozenRows, i = typeof t;
    i === "number" ? e.getPosition() && e.getPosition() + this.rows.length <= t && this.freezeRow(e) : i === "function" ? t.call(this.table, e.getComponent()) && this.freezeRow(e) : Array.isArray(t) && t.includes(e.data[this.options("frozenRowsField")]) && this.freezeRow(e);
  }
  isRowFrozen(e) {
    var t = this.rows.indexOf(e);
    return t > -1;
  }
  isFrozen() {
    return !!this.rows.length;
  }
  visibleRows(e, t) {
    return this.rows.forEach((i) => {
      t.push(i);
    }), t;
  }
  //filter frozen rows out of display data
  getRows(e) {
    var t = e.slice(0);
    return this.rows.forEach(function(i) {
      var s = t.indexOf(i);
      s > -1 && t.splice(s, 1);
    }), t;
  }
  freezeRow(e) {
    e.modules.frozen ? console.warn("Freeze Error - Row is already frozen") : (e.modules.frozen = !0, this.topElement.appendChild(e.getElement()), e.initialize(), e.normalizeHeight(), this.rows.push(e), this.refreshData(!1, "display"), this.table.rowManager.adjustTableSize(), this.styleRows());
  }
  unfreezeRow(e) {
    e.modules.frozen ? (e.modules.frozen = !1, this.detachRow(e), this.table.rowManager.adjustTableSize(), this.refreshData(!1, "display"), this.rows.length && this.styleRows()) : console.warn("Freeze Error - Row is already unfrozen");
  }
  detachRow(e) {
    var t = this.rows.indexOf(e);
    if (t > -1) {
      var i = e.getElement();
      i.parentNode && i.parentNode.removeChild(i), this.rows.splice(t, 1);
    }
  }
  styleRows(e) {
    this.rows.forEach((t, i) => {
      this.table.rowManager.styleRow(t, i);
    });
  }
}
C(cr, "moduleName", "frozenRows");
class Nl {
  constructor(e) {
    return this._group = e, this.type = "GroupComponent", new Proxy(this, {
      get: function(t, i, s) {
        return typeof t[i] < "u" ? t[i] : t._group.groupManager.table.componentFunctionBinder.handle("group", t._group, i);
      }
    });
  }
  getKey() {
    return this._group.key;
  }
  getField() {
    return this._group.field;
  }
  getElement() {
    return this._group.element;
  }
  getRows() {
    return this._group.getRows(!0);
  }
  getSubGroups() {
    return this._group.getSubGroups(!0);
  }
  getParentGroup() {
    return this._group.parent ? this._group.parent.getComponent() : !1;
  }
  isVisible() {
    return this._group.visible;
  }
  show() {
    this._group.show();
  }
  hide() {
    this._group.hide();
  }
  toggle() {
    this._group.toggleVisibility();
  }
  scrollTo(e, t) {
    return this._group.groupManager.table.rowManager.scrollToRow(this._group, e, t);
  }
  _getSelf() {
    return this._group;
  }
  getTable() {
    return this._group.groupManager.table;
  }
}
class _t {
  constructor(e, t, i, s, n, r, a) {
    this.groupManager = e, this.parent = t, this.key = s, this.level = i, this.field = n, this.hasSubGroups = i < e.groupIDLookups.length - 1, this.addRow = this.hasSubGroups ? this._addRowToGroup : this._addRow, this.type = "group", this.old = a, this.rows = [], this.groups = [], this.groupList = [], this.generator = r, this.element = !1, this.elementContents = !1, this.height = 0, this.outerHeight = 0, this.initialized = !1, this.calcs = {}, this.initialized = !1, this.modules = {}, this.arrowElement = !1, this.visible = a ? a.visible : typeof e.startOpen[i] < "u" ? e.startOpen[i] : e.startOpen[0], this.component = null, this.createElements(), this.addBindings(), this.createValueGroups();
  }
  wipe(e) {
    e || (this.groupList.length ? this.groupList.forEach(function(t) {
      t.wipe();
    }) : this.rows.forEach((t) => {
      t.modules && delete t.modules.group;
    })), this.element = !1, this.arrowElement = !1, this.elementContents = !1;
  }
  createElements() {
    var e = document.createElement("div");
    e.classList.add("tabulator-arrow"), this.element = document.createElement("div"), this.element.classList.add("tabulator-row"), this.element.classList.add("tabulator-group"), this.element.classList.add("tabulator-group-level-" + this.level), this.element.setAttribute("role", "rowgroup"), this.arrowElement = document.createElement("div"), this.arrowElement.classList.add("tabulator-group-toggle"), this.arrowElement.appendChild(e), this.groupManager.table.options.movableRows !== !1 && this.groupManager.table.modExists("moveRow") && this.groupManager.table.modules.moveRow.initializeGroupHeader(this);
  }
  createValueGroups() {
    var e = this.level + 1;
    this.groupManager.allowedValues && this.groupManager.allowedValues[e] && this.groupManager.allowedValues[e].forEach((t) => {
      this._createGroup(t, e);
    });
  }
  addBindings() {
    var e;
    this.groupManager.table.options.groupToggleElement && (e = this.groupManager.table.options.groupToggleElement == "arrow" ? this.arrowElement : this.element, e.addEventListener("click", (t) => {
      this.groupManager.table.options.groupToggleElement === "arrow" && (t.stopPropagation(), t.stopImmediatePropagation()), setTimeout(() => {
        this.toggleVisibility();
      });
    }));
  }
  _createGroup(e, t) {
    var i = t + "_" + e, s = new _t(this.groupManager, this, t, e, this.groupManager.groupIDLookups[t].field, this.groupManager.headerGenerator[t] || this.groupManager.headerGenerator[0], this.old ? this.old.groups[i] : !1);
    this.groups[i] = s, this.groupList.push(s);
  }
  _addRowToGroup(e) {
    var t = this.level + 1;
    if (this.hasSubGroups) {
      var i = this.groupManager.groupIDLookups[t].func(e.getData()), s = t + "_" + i;
      this.groupManager.allowedValues && this.groupManager.allowedValues[t] ? this.groups[s] && this.groups[s].addRow(e) : (this.groups[s] || this._createGroup(i, t), this.groups[s].addRow(e));
    }
  }
  _addRow(e) {
    this.rows.push(e), e.modules.group = this;
  }
  insertRow(e, t, i) {
    var s = this.conformRowData({});
    e.updateData(s);
    var n = this.rows.indexOf(t);
    n > -1 ? i ? this.rows.splice(n + 1, 0, e) : this.rows.splice(n, 0, e) : i ? this.rows.push(e) : this.rows.unshift(e), e.modules.group = this, this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modules.columnCalcs.recalcGroup(this), this.groupManager.updateGroupRows(!0);
  }
  scrollHeader(e) {
    this.arrowElement && (this.arrowElement.style.marginLeft = e, this.groupList.forEach(function(t) {
      t.scrollHeader(e);
    }));
  }
  getRowIndex(e) {
  }
  //update row data to match grouping constraints
  conformRowData(e) {
    return this.field ? e[this.field] = this.key : console.warn("Data Conforming Error - Cannot conform row data to match new group as groupBy is a function"), this.parent && (e = this.parent.conformRowData(e)), e;
  }
  removeRow(e) {
    var t = this.rows.indexOf(e), i = e.getElement();
    t > -1 && this.rows.splice(t, 1), !this.groupManager.table.options.groupValues && !this.rows.length ? (this.parent ? this.parent.removeGroup(this) : this.groupManager.removeGroup(this), this.groupManager.updateGroupRows(!0)) : (i.parentNode && i.parentNode.removeChild(i), this.groupManager.blockRedraw || (this.generateGroupHeaderContents(), this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modules.columnCalcs.recalcGroup(this)));
  }
  removeGroup(e) {
    var t = e.level + "_" + e.key, i;
    this.groups[t] && (delete this.groups[t], i = this.groupList.indexOf(e), i > -1 && this.groupList.splice(i, 1), this.groupList.length || (this.parent ? this.parent.removeGroup(this) : this.groupManager.removeGroup(this)));
  }
  getHeadersAndRows() {
    var e = [];
    return e.push(this), this._visSet(), this.calcs.top && (this.calcs.top.detachElement(), this.calcs.top.deleteCells()), this.calcs.bottom && (this.calcs.bottom.detachElement(), this.calcs.bottom.deleteCells()), this.visible ? this.groupList.length ? this.groupList.forEach(function(t) {
      e = e.concat(t.getHeadersAndRows());
    }) : (this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.modules.columnCalcs.hasTopCalcs() && (this.calcs.top = this.groupManager.table.modules.columnCalcs.generateTopRow(this.rows), e.push(this.calcs.top)), e = e.concat(this.rows), this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.modules.columnCalcs.hasBottomCalcs() && (this.calcs.bottom = this.groupManager.table.modules.columnCalcs.generateBottomRow(this.rows), e.push(this.calcs.bottom))) : !this.groupList.length && this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modExists("columnCalcs") && (this.groupManager.table.modules.columnCalcs.hasTopCalcs() && this.groupManager.table.options.groupClosedShowCalcs && (this.calcs.top = this.groupManager.table.modules.columnCalcs.generateTopRow(this.rows), e.push(this.calcs.top)), this.groupManager.table.modules.columnCalcs.hasBottomCalcs() && this.groupManager.table.options.groupClosedShowCalcs && (this.calcs.bottom = this.groupManager.table.modules.columnCalcs.generateBottomRow(this.rows), e.push(this.calcs.bottom))), e;
  }
  getData(e, t) {
    var i = [];
    return this._visSet(), (!e || e && this.visible) && this.rows.forEach((s) => {
      i.push(s.getData(t || "data"));
    }), i;
  }
  getRowCount() {
    var e = 0;
    return this.groupList.length ? this.groupList.forEach((t) => {
      e += t.getRowCount();
    }) : e = this.rows.length, e;
  }
  toggleVisibility() {
    this.visible ? this.hide() : this.show();
  }
  hide() {
    this.visible = !1, this.groupManager.table.rowManager.getRenderMode() == "basic" && !this.groupManager.table.options.pagination ? (this.element.classList.remove("tabulator-group-visible"), this.groupList.length ? this.groupList.forEach((e) => {
      var t = e.getHeadersAndRows();
      t.forEach((i) => {
        i.detachElement();
      });
    }) : this.rows.forEach((e) => {
      var t = e.getElement();
      t.parentNode.removeChild(t);
    }), this.groupManager.updateGroupRows(!0)) : this.groupManager.updateGroupRows(!0), this.groupManager.table.externalEvents.dispatch("groupVisibilityChanged", this.getComponent(), !1);
  }
  show() {
    if (this.visible = !0, this.groupManager.table.rowManager.getRenderMode() == "basic" && !this.groupManager.table.options.pagination) {
      this.element.classList.add("tabulator-group-visible");
      var e = this.generateElement();
      this.groupList.length ? this.groupList.forEach((t) => {
        var i = t.getHeadersAndRows();
        i.forEach((s) => {
          var n = s.getElement();
          e.parentNode.insertBefore(n, e.nextSibling), s.initialize(), e = n;
        });
      }) : this.rows.forEach((t) => {
        var i = t.getElement();
        e.parentNode.insertBefore(i, e.nextSibling), t.initialize(), e = i;
      }), this.groupManager.updateGroupRows(!0);
    } else
      this.groupManager.updateGroupRows(!0);
    this.groupManager.table.externalEvents.dispatch("groupVisibilityChanged", this.getComponent(), !0);
  }
  _visSet() {
    var e = [];
    typeof this.visible == "function" && (this.rows.forEach(function(t) {
      e.push(t.getData());
    }), this.visible = this.visible(this.key, this.getRowCount(), e, this.getComponent()));
  }
  getRowGroup(e) {
    var t = !1;
    return this.groupList.length ? this.groupList.forEach(function(i) {
      var s = i.getRowGroup(e);
      s && (t = s);
    }) : this.rows.find(function(i) {
      return i === e;
    }) && (t = this), t;
  }
  getSubGroups(e) {
    var t = [];
    return this.groupList.forEach(function(i) {
      t.push(e ? i.getComponent() : i);
    }), t;
  }
  getRows(e, t) {
    var i = [];
    return t && this.groupList.length ? this.groupList.forEach((s) => {
      i = i.concat(s.getRows(e, t));
    }) : this.rows.forEach(function(s) {
      i.push(e ? s.getComponent() : s);
    }), i;
  }
  generateGroupHeaderContents() {
    var e = [], t = this.getRows(!1, !0);
    for (t.forEach(function(i) {
      e.push(i.getData());
    }), this.elementContents = this.generator(this.key, this.getRowCount(), e, this.getComponent()); this.element.firstChild; ) this.element.removeChild(this.element.firstChild);
    typeof this.elementContents == "string" ? this.element.innerHTML = this.elementContents : this.element.appendChild(this.elementContents), this.element.insertBefore(this.arrowElement, this.element.firstChild);
  }
  getPath(e = []) {
    return e.unshift(this.key), this.parent && this.parent.getPath(e), e;
  }
  ////////////// Standard Row Functions //////////////
  getElement() {
    return this.elementContents ? this.element : this.generateElement();
  }
  generateElement() {
    this.addBindings = !1, this._visSet(), this.visible ? this.element.classList.add("tabulator-group-visible") : this.element.classList.remove("tabulator-group-visible");
    for (var e = 0; e < this.element.childNodes.length; ++e)
      this.element.childNodes[e].parentNode.removeChild(this.element.childNodes[e]);
    return this.generateGroupHeaderContents(), this.element;
  }
  detachElement() {
    this.element && this.element.parentNode && this.element.parentNode.removeChild(this.element);
  }
  //normalize the height of elements in the row
  normalizeHeight() {
    this.setHeight(this.element.clientHeight);
  }
  initialize(e) {
    (!this.initialized || e) && (this.normalizeHeight(), this.initialized = !0);
  }
  reinitialize() {
    this.initialized = !1, this.height = 0, $.elVisible(this.element) && this.initialize(!0);
  }
  setHeight(e) {
    this.height != e && (this.height = e, this.outerHeight = this.element.offsetHeight);
  }
  //return rows outer height
  getHeight() {
    return this.outerHeight;
  }
  getGroup() {
    return this;
  }
  reinitializeHeight() {
  }
  calcHeight() {
  }
  setCellHeight() {
  }
  clearCellHeight() {
  }
  deinitializeHeight() {
  }
  rendered() {
  }
  //////////////// Object Generation /////////////////
  getComponent() {
    return this.component || (this.component = new Nl(this)), this.component;
  }
}
class ur extends A {
  constructor(e) {
    super(e), this.groupIDLookups = !1, this.startOpen = [function() {
      return !1;
    }], this.headerGenerator = [function() {
      return "";
    }], this.groupList = [], this.allowedValues = !1, this.groups = {}, this.displayHandler = this.getRows.bind(this), this.blockRedraw = !1, this.registerTableOption("groupBy", !1), this.registerTableOption("groupStartOpen", !0), this.registerTableOption("groupValues", !1), this.registerTableOption("groupUpdateOnCellEdit", !1), this.registerTableOption("groupHeader", !1), this.registerTableOption("groupHeaderPrint", null), this.registerTableOption("groupHeaderClipboard", null), this.registerTableOption("groupHeaderHtmlOutput", null), this.registerTableOption("groupHeaderDownload", null), this.registerTableOption("groupToggleElement", "arrow"), this.registerTableOption("groupClosedShowCalcs", !1), this.registerTableFunction("setGroupBy", this.setGroupBy.bind(this)), this.registerTableFunction("setGroupValues", this.setGroupValues.bind(this)), this.registerTableFunction("setGroupStartOpen", this.setGroupStartOpen.bind(this)), this.registerTableFunction("setGroupHeader", this.setGroupHeader.bind(this)), this.registerTableFunction("getGroups", this.userGetGroups.bind(this)), this.registerTableFunction("getGroupedData", this.userGetGroupedData.bind(this)), this.registerComponentFunction("row", "getGroup", this.rowGetGroup.bind(this));
  }
  //initialize group configuration
  initialize() {
    this.subscribe("table-destroy", this._blockRedrawing.bind(this)), this.subscribe("rows-wipe", this._blockRedrawing.bind(this)), this.subscribe("rows-wiped", this._restore_redrawing.bind(this)), this.table.options.groupBy && (this.table.options.groupUpdateOnCellEdit && (this.subscribe("cell-value-updated", this.cellUpdated.bind(this)), this.subscribe("row-data-changed", this.reassignRowToGroup.bind(this), 0)), this.subscribe("table-built", this.configureGroupSetup.bind(this)), this.subscribe("row-deleting", this.rowDeleting.bind(this)), this.subscribe("row-deleted", this.rowsUpdated.bind(this)), this.subscribe("scroll-horizontal", this.scrollHeaders.bind(this)), this.subscribe("rows-wipe", this.wipe.bind(this)), this.subscribe("rows-added", this.rowsUpdated.bind(this)), this.subscribe("row-moving", this.rowMoving.bind(this)), this.subscribe("row-adding-index", this.rowAddingIndex.bind(this)), this.subscribe("rows-sample", this.rowSample.bind(this)), this.subscribe("render-virtual-fill", this.virtualRenderFill.bind(this)), this.registerDisplayHandler(this.displayHandler, 20), this.initialized = !0);
  }
  _blockRedrawing() {
    this.blockRedraw = !0;
  }
  _restore_redrawing() {
    this.blockRedraw = !1;
  }
  configureGroupSetup() {
    if (this.table.options.groupBy) {
      var e = this.table.options.groupBy, t = this.table.options.groupStartOpen, i = this.table.options.groupHeader;
      if (this.allowedValues = this.table.options.groupValues, Array.isArray(e) && Array.isArray(i) && e.length > i.length && console.warn("Error creating group headers, groupHeader array is shorter than groupBy array"), this.headerGenerator = [function() {
        return "";
      }], this.startOpen = [function() {
        return !1;
      }], this.langBind("groups|item", (n, r) => {
        this.headerGenerator[0] = (a, l, h) => (typeof a > "u" ? "" : a) + "<span>(" + l + " " + (l === 1 ? n : r.groups.items) + ")</span>";
      }), this.groupIDLookups = [], e)
        this.table.modExists("columnCalcs") && this.table.options.columnCalcs != "table" && this.table.options.columnCalcs != "both" && this.table.modules.columnCalcs.removeCalcs();
      else if (this.table.modExists("columnCalcs") && this.table.options.columnCalcs != "group") {
        var s = this.table.columnManager.getRealColumns();
        s.forEach((n) => {
          n.definition.topCalc && this.table.modules.columnCalcs.initializeTopRow(), n.definition.bottomCalc && this.table.modules.columnCalcs.initializeBottomRow();
        });
      }
      Array.isArray(e) || (e = [e]), e.forEach((n, r) => {
        var a, l;
        typeof n == "function" ? a = n : (l = this.table.columnManager.getColumnByField(n), l ? a = function(h) {
          return l.getFieldValue(h);
        } : a = function(h) {
          return h[n];
        }), this.groupIDLookups.push({
          field: typeof n == "function" ? !1 : n,
          func: a,
          values: this.allowedValues ? this.allowedValues[r] : !1
        });
      }), t && (Array.isArray(t) || (t = [t]), t.forEach((n) => {
      }), this.startOpen = t), i && (this.headerGenerator = Array.isArray(i) ? i : [i]);
    } else
      this.groupList = [], this.groups = {};
  }
  rowSample(e, t) {
    if (this.table.options.groupBy) {
      var i = this.getGroups(!1)[0];
      t.push(i.getRows(!1)[0]);
    }
    return t;
  }
  virtualRenderFill() {
    var e = this.table.rowManager.tableElement, t = this.table.rowManager.getVisibleRows();
    if (this.table.options.groupBy)
      t = t.filter((i) => i.type !== "group"), e.style.minWidth = t.length ? "" : this.table.columnManager.getWidth() + "px";
    else
      return t;
  }
  rowAddingIndex(e, t, i) {
    if (this.table.options.groupBy) {
      this.assignRowToGroup(e);
      var s = e.modules.group.rows;
      return s.length > 1 && (!t || t && s.indexOf(t) == -1 ? i ? s[0] !== e && (t = s[0], this.table.rowManager.moveRowInArray(e.modules.group.rows, e, t, !i)) : s[s.length - 1] !== e && (t = s[s.length - 1], this.table.rowManager.moveRowInArray(e.modules.group.rows, e, t, !i)) : this.table.rowManager.moveRowInArray(e.modules.group.rows, e, t, !i)), t;
    }
  }
  trackChanges() {
    this.dispatch("group-changed");
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  setGroupBy(e) {
    this.table.options.groupBy = e, this.initialized || this.initialize(), this.configureGroupSetup(), !e && this.table.modExists("columnCalcs") && this.table.options.columnCalcs === !0 && this.table.modules.columnCalcs.reinitializeCalcs(), this.refreshData(), this.trackChanges();
  }
  setGroupValues(e) {
    this.table.options.groupValues = e, this.configureGroupSetup(), this.refreshData(), this.trackChanges();
  }
  setGroupStartOpen(e) {
    this.table.options.groupStartOpen = e, this.configureGroupSetup(), this.table.options.groupBy ? (this.refreshData(), this.trackChanges()) : console.warn("Grouping Update - cant refresh view, no groups have been set");
  }
  setGroupHeader(e) {
    this.table.options.groupHeader = e, this.configureGroupSetup(), this.table.options.groupBy ? (this.refreshData(), this.trackChanges()) : console.warn("Grouping Update - cant refresh view, no groups have been set");
  }
  userGetGroups(e) {
    return this.getGroups(!0);
  }
  // get grouped table data in the same format as getData()
  userGetGroupedData() {
    return this.table.options.groupBy ? this.getGroupedData() : this.getData();
  }
  ///////////////////////////////////////
  ///////// Component Functions /////////
  ///////////////////////////////////////
  rowGetGroup(e) {
    return e.modules.group ? e.modules.group.getComponent() : !1;
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  rowMoving(e, t, i) {
    if (this.table.options.groupBy) {
      !i && t instanceof _t && (t = this.table.rowManager.prevDisplayRow(e) || t);
      var s = t instanceof _t ? t : t.modules.group, n = e instanceof _t ? e : e.modules.group;
      s === n ? this.table.rowManager.moveRowInArray(s.rows, e, t, i) : (n && n.removeRow(e), s.insertRow(e, t, i));
    }
  }
  rowDeleting(e) {
    this.table.options.groupBy && e.modules.group && e.modules.group.removeRow(e);
  }
  rowsUpdated(e) {
    this.table.options.groupBy && this.updateGroupRows(!0);
  }
  cellUpdated(e) {
    this.table.options.groupBy && this.reassignRowToGroup(e.row);
  }
  //return appropriate rows with group headers
  getRows(e) {
    return this.table.options.groupBy && this.groupIDLookups.length ? (this.dispatchExternal("dataGrouping"), this.generateGroups(e), this.subscribedExternal("dataGrouped") && this.dispatchExternal("dataGrouped", this.getGroups(!0)), this.updateGroupRows()) : e.slice(0);
  }
  getGroups(e) {
    var t = [];
    return this.groupList.forEach(function(i) {
      t.push(e ? i.getComponent() : i);
    }), t;
  }
  getChildGroups(e) {
    var t = [];
    return e || (e = this), e.groupList.forEach((i) => {
      i.groupList.length ? t = t.concat(this.getChildGroups(i)) : t.push(i);
    }), t;
  }
  wipe() {
    this.table.options.groupBy && (this.groupList.forEach(function(e) {
      e.wipe();
    }), this.groupList = [], this.groups = {});
  }
  pullGroupListData(e) {
    var t = [];
    return e.forEach((i) => {
      var s = {};
      s.level = 0, s.rowCount = 0, s.headerContent = "";
      var n = [];
      i.hasSubGroups ? (n = this.pullGroupListData(i.groupList), s.level = i.level, s.rowCount = n.length - i.groupList.length, s.headerContent = i.generator(i.key, s.rowCount, i.rows, i), t.push(s), t = t.concat(n)) : (s.level = i.level, s.headerContent = i.generator(i.key, i.rows.length, i.rows, i), s.rowCount = i.getRows().length, t.push(s), i.getRows().forEach((r) => {
        t.push(r.getData("data"));
      }));
    }), t;
  }
  getGroupedData() {
    return this.pullGroupListData(this.groupList);
  }
  getRowGroup(e) {
    var t = !1;
    return this.options("dataTree") && (e = this.table.modules.dataTree.getTreeParentRoot(e)), this.groupList.forEach((i) => {
      var s = i.getRowGroup(e);
      s && (t = s);
    }), t;
  }
  countGroups() {
    return this.groupList.length;
  }
  generateGroups(e) {
    var t = this.groups;
    this.groups = {}, this.groupList = [], this.allowedValues && this.allowedValues[0] ? (this.allowedValues[0].forEach((i) => {
      this.createGroup(i, 0, t);
    }), e.forEach((i) => {
      this.assignRowToExistingGroup(i, t);
    })) : e.forEach((i) => {
      this.assignRowToGroup(i, t);
    }), Object.values(t).forEach((i) => {
      i.wipe(!0);
    });
  }
  createGroup(e, t, i) {
    var s = t + "_" + e, n;
    i = i || [], n = new _t(this, !1, t, e, this.groupIDLookups[0].field, this.headerGenerator[0], i[s]), this.groups[s] = n, this.groupList.push(n);
  }
  assignRowToExistingGroup(e, t) {
    var i = this.groupIDLookups[0].func(e.getData()), s = "0_" + i;
    this.groups[s] && this.groups[s].addRow(e);
  }
  assignRowToGroup(e, t) {
    var i = this.groupIDLookups[0].func(e.getData()), s = !this.groups["0_" + i];
    return s && this.createGroup(i, 0, t), this.groups["0_" + i].addRow(e), !s;
  }
  reassignRowToGroup(e) {
    if (e.type === "row") {
      var t = e.modules.group, i = t.getPath(), s = this.getExpectedPath(e), n;
      n = i.length == s.length && i.every((r, a) => r === s[a]), n || (t.removeRow(e), this.assignRowToGroup(e, this.groups), this.refreshData(!0));
    }
  }
  getExpectedPath(e) {
    var t = [], i = e.getData();
    return this.groupIDLookups.forEach((s) => {
      t.push(s.func(i));
    }), t;
  }
  updateGroupRows(e) {
    var t = [];
    return this.blockRedraw || (this.groupList.forEach((i) => {
      t = t.concat(i.getHeadersAndRows());
    }), e && this.refreshData(!0)), t;
  }
  scrollHeaders(e) {
    this.table.options.groupBy && (this.table.options.renderHorizontal === "virtual" && (e -= this.table.columnManager.renderer.vDomPadLeft), e = e + "px", this.groupList.forEach((t) => {
      t.scrollHeader(e);
    }));
  }
  removeGroup(e) {
    var t = e.level + "_" + e.key, i;
    this.groups[t] && (delete this.groups[t], i = this.groupList.indexOf(e), i > -1 && this.groupList.splice(i, 1));
  }
  checkBasicModeGroupHeaderWidth() {
    var e = this.table.rowManager.tableElement, t = !0;
    this.table.rowManager.getDisplayRows().forEach((i, s) => {
      this.table.rowManager.styleRow(i, s), e.appendChild(i.getElement()), i.initialize(!0), i.type !== "group" && (t = !1);
    }), t ? e.style.minWidth = this.table.columnManager.getWidth() + "px" : e.style.minWidth = "";
  }
}
C(ur, "moduleName", "groupRows");
var Wl = {
  cellEdit: function(o) {
    o.component.setValueProcessData(o.data.oldValue), o.component.cellRendered();
  },
  rowAdd: function(o) {
    o.component.deleteActual(), this.table.rowManager.checkPlaceholder();
  },
  rowDelete: function(o) {
    var e = this.table.rowManager.addRowActual(o.data.data, o.data.pos, o.data.index);
    this.table.options.groupBy && this.table.modExists("groupRows") && this.table.modules.groupRows.updateGroupRows(!0), this._rebindRow(o.component, e), this.table.rowManager.checkPlaceholder();
  },
  rowMove: function(o) {
    var e = o.data.posFrom - o.data.posTo > 0;
    this.table.rowManager.moveRowActual(o.component, this.table.rowManager.getRowFromPosition(o.data.posFrom), e), this.table.rowManager.regenerateRowPositions(), this.table.rowManager.reRenderInPosition();
  }
}, jl = {
  cellEdit: function(o) {
    o.component.setValueProcessData(o.data.newValue), o.component.cellRendered();
  },
  rowAdd: function(o) {
    var e = this.table.rowManager.addRowActual(o.data.data, o.data.pos, o.data.index);
    this.table.options.groupBy && this.table.modExists("groupRows") && this.table.modules.groupRows.updateGroupRows(!0), this._rebindRow(o.component, e), this.table.rowManager.checkPlaceholder();
  },
  rowDelete: function(o) {
    o.component.deleteActual(), this.table.rowManager.checkPlaceholder();
  },
  rowMove: function(o) {
    this.table.rowManager.moveRowActual(o.component, this.table.rowManager.getRowFromPosition(o.data.posTo), o.data.after), this.table.rowManager.regenerateRowPositions(), this.table.rowManager.reRenderInPosition();
  }
}, Gl = {
  undo: ["ctrl + 90", "meta + 90"],
  redo: ["ctrl + 89", "meta + 89"]
}, Ul = {
  undo: function(o) {
    var e = !1;
    this.table.options.history && this.table.modExists("history") && this.table.modExists("edit") && (e = this.table.modules.edit.currentCell, e || (o.preventDefault(), this.table.modules.history.undo()));
  },
  redo: function(o) {
    var e = !1;
    this.table.options.history && this.table.modExists("history") && this.table.modExists("edit") && (e = this.table.modules.edit.currentCell, e || (o.preventDefault(), this.table.modules.history.redo()));
  }
}, $l = {
  keybindings: {
    bindings: Gl,
    actions: Ul
  }
};
const Ke = class Ke extends A {
  constructor(e) {
    super(e), this.history = [], this.index = -1, this.registerTableOption("history", !1);
  }
  initialize() {
    this.table.options.history && (this.subscribe("cell-value-updated", this.cellUpdated.bind(this)), this.subscribe("cell-delete", this.clearComponentHistory.bind(this)), this.subscribe("row-delete", this.rowDeleted.bind(this)), this.subscribe("rows-wipe", this.clear.bind(this)), this.subscribe("row-added", this.rowAdded.bind(this)), this.subscribe("row-move", this.rowMoved.bind(this))), this.registerTableFunction("undo", this.undo.bind(this)), this.registerTableFunction("redo", this.redo.bind(this)), this.registerTableFunction("getHistoryUndoSize", this.getHistoryUndoSize.bind(this)), this.registerTableFunction("getHistoryRedoSize", this.getHistoryRedoSize.bind(this)), this.registerTableFunction("clearHistory", this.clear.bind(this));
  }
  rowMoved(e, t, i) {
    this.action("rowMove", e, { posFrom: e.getPosition(), posTo: t.getPosition(), to: t, after: i });
  }
  rowAdded(e, t, i, s) {
    this.action("rowAdd", e, { data: t, pos: i, index: s });
  }
  rowDeleted(e) {
    var t, i;
    this.table.options.groupBy ? (i = e.getComponent().getGroup()._getSelf().rows, t = i.indexOf(e), t && (t = i[t - 1])) : (t = e.table.rowManager.getRowIndex(e), t && (t = e.table.rowManager.rows[t - 1])), this.action("rowDelete", e, { data: e.getData(), pos: !t, index: t });
  }
  cellUpdated(e) {
    this.action("cellEdit", e, { oldValue: e.oldValue, newValue: e.value });
  }
  clear() {
    this.history = [], this.index = -1;
  }
  action(e, t, i) {
    this.history = this.history.slice(0, this.index + 1), this.history.push({
      type: e,
      component: t,
      data: i
    }), this.index++;
  }
  getHistoryUndoSize() {
    return this.index + 1;
  }
  getHistoryRedoSize() {
    return this.history.length - (this.index + 1);
  }
  clearComponentHistory(e) {
    var t = this.history.findIndex(function(i) {
      return i.component === e;
    });
    t > -1 && (this.history.splice(t, 1), t <= this.index && this.index--, this.clearComponentHistory(e));
  }
  undo() {
    if (this.index > -1) {
      let e = this.history[this.index];
      return Ke.undoers[e.type].call(this, e), this.index--, this.dispatchExternal("historyUndo", e.type, e.component.getComponent(), e.data), !0;
    } else
      return console.warn(this.options("history") ? "History Undo Error - No more history to undo" : "History module not enabled"), !1;
  }
  redo() {
    if (this.history.length - 1 > this.index) {
      this.index++;
      let e = this.history[this.index];
      return Ke.redoers[e.type].call(this, e), this.dispatchExternal("historyRedo", e.type, e.component.getComponent(), e.data), !0;
    } else
      return console.warn(this.options("history") ? "History Redo Error - No more history to redo" : "History module not enabled"), !1;
  }
  //rebind rows to new element after deletion
  _rebindRow(e, t) {
    this.history.forEach(function(i) {
      if (i.component instanceof ae)
        i.component === e && (i.component = t);
      else if (i.component instanceof ui && i.component.row === e) {
        var s = i.component.column.getField();
        s && (i.component = t.getCell(s));
      }
    });
  }
};
C(Ke, "moduleName", "history"), C(Ke, "moduleExtensions", $l), //load defaults
C(Ke, "undoers", Wl), C(Ke, "redoers", jl);
let Ps = Ke;
class fr extends A {
  constructor(e) {
    super(e), this.fieldIndex = [], this.hasIndex = !1;
  }
  initialize() {
    this.tableElementCheck();
  }
  tableElementCheck() {
    this.table.originalElement && this.table.originalElement.tagName === "TABLE" && (this.table.originalElement.childNodes.length ? this.parseTable() : console.warn("Unable to parse data from empty table tag, Tabulator should be initialized on a div tag unless importing data from a table element."));
  }
  parseTable() {
    var e = this.table.originalElement, t = this.table.options, i = e.getElementsByTagName("th"), s = e.getElementsByTagName("tbody")[0], n = [];
    this.hasIndex = !1, this.dispatchExternal("htmlImporting"), s = s ? s.getElementsByTagName("tr") : [], this._extractOptions(e, t), i.length ? this._extractHeaders(i, s) : this._generateBlankHeaders(i, s);
    for (var r = 0; r < s.length; r++) {
      var a = s[r], l = a.getElementsByTagName("td"), h = {};
      this.hasIndex || (h[t.index] = r);
      for (var d = 0; d < l.length; d++) {
        var c = l[d];
        typeof this.fieldIndex[d] < "u" && (h[this.fieldIndex[d]] = c.innerHTML);
      }
      n.push(h);
    }
    t.data = n, this.dispatchExternal("htmlImported");
  }
  //extract tabulator attribute options
  _extractOptions(e, t, i) {
    var s = e.attributes, n = Object.keys(i || t), r = {};
    n.forEach((d) => {
      r[d.toLowerCase()] = d;
    });
    for (var a in s) {
      var l = s[a], h;
      l && typeof l == "object" && l.name && l.name.indexOf("tabulator-") === 0 && (h = l.name.replace("tabulator-", ""), typeof r[h] < "u" && (t[r[h]] = this._attribValue(l.value)));
    }
  }
  //get value of attribute
  _attribValue(e) {
    return e === "true" ? !0 : e === "false" ? !1 : e;
  }
  //find column if it has already been defined
  _findCol(e) {
    var t = this.table.options.columns.find((i) => i.title === e);
    return t || !1;
  }
  //extract column from headers
  _extractHeaders(e, t) {
    for (var i = 0; i < e.length; i++) {
      var s = e[i], n = !1, r = this._findCol(s.textContent), a;
      r ? n = !0 : r = { title: s.textContent.trim() }, r.field || (r.field = s.textContent.trim().toLowerCase().replaceAll(" ", "_")), a = s.getAttribute("width"), a && !r.width && (r.width = a), this._extractOptions(s, r, this.table.columnManager.optionsList.registeredDefaults), this.fieldIndex[i] = r.field, r.field == this.table.options.index && (this.hasIndex = !0), n || this.table.options.columns.push(r);
    }
  }
  //generate blank headers
  _generateBlankHeaders(e, t) {
    for (var i = 0; i < e.length; i++) {
      var s = e[i], n = { title: "", field: "col" + i };
      this.fieldIndex[i] = n.field;
      var r = s.getAttribute("width");
      r && (n.width = r), this.table.options.columns.push(n);
    }
  }
}
C(fr, "moduleName", "htmlTableImport");
function Xl(o) {
  var e = [], t = 0, i = 0, s = !1;
  for (let n = 0; n < o.length; n++) {
    let r = o[n], a = o[n + 1];
    if (e[t] || (e[t] = []), e[t][i] || (e[t][i] = ""), r == '"' && s && a == '"') {
      e[t][i] += r, n++;
      continue;
    }
    if (r == '"') {
      s = !s;
      continue;
    }
    if (r == "," && !s) {
      i++;
      continue;
    }
    if (r == "\r" && a == `
` && !s) {
      i = 0, t++, n++;
      continue;
    }
    if ((r == "\r" || r == `
`) && !s) {
      i = 0, t++;
      continue;
    }
    e[t][i] += r;
  }
  return e;
}
function Yl(o) {
  try {
    return JSON.parse(o);
  } catch (e) {
    return console.warn("JSON Import Error - File contents is invalid JSON", e), Promise.reject();
  }
}
function Kl(o) {
  return o;
}
function ql(o) {
  var e = this.dependencyRegistry.lookup("XLSX"), t = e.read(o), i = t.Sheets[t.SheetNames[0]];
  return e.utils.sheet_to_json(i, { header: 1 });
}
var Jl = {
  csv: Xl,
  json: Yl,
  array: Kl,
  xlsx: ql
};
const ii = class ii extends A {
  constructor(e) {
    super(e), this.registerTableOption("importFormat"), this.registerTableOption("importReader", "text"), this.registerTableOption("importHeaderTransform"), this.registerTableOption("importValueTransform"), this.registerTableOption("importDataValidator"), this.registerTableOption("importFileValidator");
  }
  initialize() {
    this.registerTableFunction("import", this.importFromFile.bind(this)), this.table.options.importFormat && (this.subscribe("data-loading", this.loadDataCheck.bind(this), 10), this.subscribe("data-load", this.loadData.bind(this), 10));
  }
  loadDataCheck(e) {
    return this.table.options.importFormat && (typeof e == "string" || Array.isArray(e) && e.length && Array.isArray(e));
  }
  loadData(e, t, i, s, n) {
    return this.importData(this.lookupImporter(), e).then(this.structureData.bind(this)).catch((r) => (console.error("Import Error:", r || "Unable to import data"), Promise.reject(r)));
  }
  lookupImporter(e) {
    var t;
    return e || (e = this.table.options.importFormat), typeof e == "string" ? t = ii.importers[e] : t = e, t || console.error("Import Error - Importer not found:", e), t;
  }
  importFromFile(e, t, i) {
    var s = this.lookupImporter(e);
    if (s)
      return this.pickFile(t, i).then(this.importData.bind(this, s)).then(this.structureData.bind(this)).then(this.mutateData.bind(this)).then(this.validateData.bind(this)).then(this.setData.bind(this)).catch((n) => (this.dispatch("import-error", n), this.dispatchExternal("importError", n), console.error("Import Error:", n || "Unable to import file"), this.table.dataLoader.alertError(), setTimeout(() => {
        this.table.dataLoader.clearAlert();
      }, 3e3), Promise.reject(n)));
  }
  pickFile(e, t) {
    return new Promise((i, s) => {
      var n = document.createElement("input");
      n.type = "file", n.accept = e, n.addEventListener("change", (r) => {
        var a = n.files[0], l = new FileReader(), h = this.validateFile(a);
        if (h === !0) {
          switch (this.dispatch("import-importing", n.files), this.dispatchExternal("importImporting", n.files), t || this.table.options.importReader) {
            case "buffer":
              l.readAsArrayBuffer(a);
              break;
            case "binary":
              l.readAsBinaryString(a);
              break;
            case "url":
              l.readAsDataURL(a);
              break;
            case "text":
            default:
              l.readAsText(a);
          }
          l.onload = (d) => {
            i(l.result);
          }, l.onerror = (d) => {
            console.warn("File Load Error - Unable to read file"), s(d);
          };
        } else
          s(h);
      }), this.dispatch("import-choose"), this.dispatchExternal("importChoose"), n.click();
    });
  }
  importData(e, t) {
    var i;
    return this.table.dataLoader.alertLoader(), new Promise((s, n) => {
      setTimeout(() => {
        i = e.call(this.table, t), i instanceof Promise || i ? s(i) : n();
      }, 10);
    });
  }
  structureData(e) {
    var t = [];
    return Array.isArray(e) && e.length && Array.isArray(e[0]) ? (this.table.options.autoColumns ? t = this.structureArrayToObject(e) : t = this.structureArrayToColumns(e), t) : e;
  }
  mutateData(e) {
    var t = [];
    return Array.isArray(e) ? e.forEach((i) => {
      t.push(this.table.modules.mutator.transformRow(i, "import"));
    }) : t = e, t;
  }
  transformHeader(e) {
    var t = [];
    if (this.table.options.importHeaderTransform)
      e.forEach((i) => {
        t.push(this.table.options.importHeaderTransform.call(this.table, i, e));
      });
    else
      return e;
    return t;
  }
  transformData(e) {
    var t = [];
    if (this.table.options.importValueTransform)
      e.forEach((i) => {
        t.push(this.table.options.importValueTransform.call(this.table, i, e));
      });
    else
      return e;
    return t;
  }
  structureArrayToObject(e) {
    var t = this.transformHeader(e.shift()), i = e.map((s) => {
      var n = {};
      return s = this.transformData(s), t.forEach((r, a) => {
        n[r] = s[a];
      }), n;
    });
    return i;
  }
  structureArrayToColumns(e) {
    var t = [], i = this.transformHeader(e[0]), s = this.table.getColumns();
    return s[0] && i[0] && s[0].getDefinition().title === i[0] && e.shift(), e.forEach((n) => {
      var r = {};
      n = this.transformData(n), n.forEach((a, l) => {
        var h = s[l];
        h && (r[h.getField()] = a);
      }), t.push(r);
    }), t;
  }
  validateFile(e) {
    return this.table.options.importFileValidator ? this.table.options.importFileValidator.call(this.table, e) : !0;
  }
  validateData(e) {
    var t;
    return this.table.options.importDataValidator ? (t = this.table.options.importDataValidator.call(this.table, e), t === !0 ? e : Promise.reject(t)) : e;
  }
  setData(e) {
    return this.dispatch("import-imported", e), this.dispatchExternal("importImported", e), this.table.dataLoader.clearAlert(), this.table.setData(e);
  }
};
C(ii, "moduleName", "import"), //load defaults
C(ii, "importers", Jl);
let As = ii;
var vs;
let Ql = (vs = class extends A {
  constructor(e) {
    super(e), this.eventMap = {
      //row events
      rowClick: "row-click",
      rowDblClick: "row-dblclick",
      rowContext: "row-contextmenu",
      rowMouseEnter: "row-mouseenter",
      rowMouseLeave: "row-mouseleave",
      rowMouseOver: "row-mouseover",
      rowMouseOut: "row-mouseout",
      rowMouseMove: "row-mousemove",
      rowMouseDown: "row-mousedown",
      rowMouseUp: "row-mouseup",
      rowTap: "row",
      rowDblTap: "row",
      rowTapHold: "row",
      //cell events
      cellClick: "cell-click",
      cellDblClick: "cell-dblclick",
      cellContext: "cell-contextmenu",
      cellMouseEnter: "cell-mouseenter",
      cellMouseLeave: "cell-mouseleave",
      cellMouseOver: "cell-mouseover",
      cellMouseOut: "cell-mouseout",
      cellMouseMove: "cell-mousemove",
      cellMouseDown: "cell-mousedown",
      cellMouseUp: "cell-mouseup",
      cellTap: "cell",
      cellDblTap: "cell",
      cellTapHold: "cell",
      //column header events
      headerClick: "column-click",
      headerDblClick: "column-dblclick",
      headerContext: "column-contextmenu",
      headerMouseEnter: "column-mouseenter",
      headerMouseLeave: "column-mouseleave",
      headerMouseOver: "column-mouseover",
      headerMouseOut: "column-mouseout",
      headerMouseMove: "column-mousemove",
      headerMouseDown: "column-mousedown",
      headerMouseUp: "column-mouseup",
      headerTap: "column",
      headerDblTap: "column",
      headerTapHold: "column",
      //group header
      groupClick: "group-click",
      groupDblClick: "group-dblclick",
      groupContext: "group-contextmenu",
      groupMouseEnter: "group-mouseenter",
      groupMouseLeave: "group-mouseleave",
      groupMouseOver: "group-mouseover",
      groupMouseOut: "group-mouseout",
      groupMouseMove: "group-mousemove",
      groupMouseDown: "group-mousedown",
      groupMouseUp: "group-mouseup",
      groupTap: "group",
      groupDblTap: "group",
      groupTapHold: "group"
    }, this.subscribers = {}, this.touchSubscribers = {}, this.columnSubscribers = {}, this.touchWatchers = {
      row: {
        tap: null,
        tapDbl: null,
        tapHold: null
      },
      cell: {
        tap: null,
        tapDbl: null,
        tapHold: null
      },
      column: {
        tap: null,
        tapDbl: null,
        tapHold: null
      },
      group: {
        tap: null,
        tapDbl: null,
        tapHold: null
      }
    }, this.registerColumnOption("headerClick"), this.registerColumnOption("headerDblClick"), this.registerColumnOption("headerContext"), this.registerColumnOption("headerMouseEnter"), this.registerColumnOption("headerMouseLeave"), this.registerColumnOption("headerMouseOver"), this.registerColumnOption("headerMouseOut"), this.registerColumnOption("headerMouseMove"), this.registerColumnOption("headerMouseDown"), this.registerColumnOption("headerMouseUp"), this.registerColumnOption("headerTap"), this.registerColumnOption("headerDblTap"), this.registerColumnOption("headerTapHold"), this.registerColumnOption("cellClick"), this.registerColumnOption("cellDblClick"), this.registerColumnOption("cellContext"), this.registerColumnOption("cellMouseEnter"), this.registerColumnOption("cellMouseLeave"), this.registerColumnOption("cellMouseOver"), this.registerColumnOption("cellMouseOut"), this.registerColumnOption("cellMouseMove"), this.registerColumnOption("cellMouseDown"), this.registerColumnOption("cellMouseUp"), this.registerColumnOption("cellTap"), this.registerColumnOption("cellDblTap"), this.registerColumnOption("cellTapHold");
  }
  initialize() {
    this.initializeExternalEvents(), this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("cell-dblclick", this.cellContentsSelectionFixer.bind(this)), this.subscribe("scroll-horizontal", this.clearTouchWatchers.bind(this)), this.subscribe("scroll-vertical", this.clearTouchWatchers.bind(this));
  }
  clearTouchWatchers() {
    var e = Object.values(this.touchWatchers);
    e.forEach((t) => {
      for (let i in t)
        t[i] = null;
    });
  }
  cellContentsSelectionFixer(e, t) {
    var i;
    if (!(this.table.modExists("edit") && this.table.modules.edit.currentCell === t)) {
      e.preventDefault();
      try {
        document.selection ? (i = document.body.createTextRange(), i.moveToElementText(t.getElement()), i.select()) : window.getSelection && (i = document.createRange(), i.selectNode(t.getElement()), window.getSelection().removeAllRanges(), window.getSelection().addRange(i));
      } catch {
      }
    }
  }
  initializeExternalEvents() {
    for (let e in this.eventMap)
      this.subscriptionChangeExternal(e, this.subscriptionChanged.bind(this, e));
  }
  subscriptionChanged(e, t) {
    t ? this.subscribers[e] || (this.eventMap[e].includes("-") ? (this.subscribers[e] = this.handle.bind(this, e), this.subscribe(this.eventMap[e], this.subscribers[e])) : this.subscribeTouchEvents(e)) : this.eventMap[e].includes("-") ? this.subscribers[e] && !this.columnSubscribers[e] && !this.subscribedExternal(e) && (this.unsubscribe(this.eventMap[e], this.subscribers[e]), delete this.subscribers[e]) : this.unsubscribeTouchEvents(e);
  }
  subscribeTouchEvents(e) {
    var t = this.eventMap[e];
    this.touchSubscribers[t + "-touchstart"] || (this.touchSubscribers[t + "-touchstart"] = this.handleTouch.bind(this, t, "start"), this.touchSubscribers[t + "-touchend"] = this.handleTouch.bind(this, t, "end"), this.subscribe(t + "-touchstart", this.touchSubscribers[t + "-touchstart"]), this.subscribe(t + "-touchend", this.touchSubscribers[t + "-touchend"])), this.subscribers[e] = !0;
  }
  unsubscribeTouchEvents(e) {
    var t = !0, i = this.eventMap[e];
    if (this.subscribers[e] && !this.subscribedExternal(e)) {
      delete this.subscribers[e];
      for (let s in this.eventMap)
        this.eventMap[s] === i && this.subscribers[s] && (t = !1);
      t && (this.unsubscribe(i + "-touchstart", this.touchSubscribers[i + "-touchstart"]), this.unsubscribe(i + "-touchend", this.touchSubscribers[i + "-touchend"]), delete this.touchSubscribers[i + "-touchstart"], delete this.touchSubscribers[i + "-touchend"]);
    }
  }
  initializeColumn(e) {
    var t = e.definition;
    for (let i in this.eventMap)
      t[i] && (this.subscriptionChanged(i, !0), this.columnSubscribers[i] || (this.columnSubscribers[i] = []), this.columnSubscribers[i].push(e));
  }
  handle(e, t, i) {
    this.dispatchEvent(e, t, i);
  }
  handleTouch(e, t, i, s) {
    var n = this.touchWatchers[e];
    switch (e === "column" && (e = "header"), t) {
      case "start":
        n.tap = !0, clearTimeout(n.tapHold), n.tapHold = setTimeout(() => {
          clearTimeout(n.tapHold), n.tapHold = null, n.tap = null, clearTimeout(n.tapDbl), n.tapDbl = null, this.dispatchEvent(e + "TapHold", i, s);
        }, 1e3);
        break;
      case "end":
        n.tap && (n.tap = null, this.dispatchEvent(e + "Tap", i, s)), n.tapDbl ? (clearTimeout(n.tapDbl), n.tapDbl = null, this.dispatchEvent(e + "DblTap", i, s)) : n.tapDbl = setTimeout(() => {
          clearTimeout(n.tapDbl), n.tapDbl = null;
        }, 300), clearTimeout(n.tapHold), n.tapHold = null;
        break;
    }
  }
  dispatchEvent(e, t, i) {
    var s = i.getComponent(), n;
    this.columnSubscribers[e] && (i instanceof ui ? n = i.column.definition[e] : i instanceof gt && (n = i.definition[e]), n && n(t, s)), this.dispatchExternal(e, t, s);
  }
}, C(vs, "moduleName", "interaction"), vs);
var Zl = {
  navPrev: "shift + 9",
  navNext: 9,
  navUp: 38,
  navDown: 40,
  navLeft: 37,
  navRight: 39,
  scrollPageUp: 33,
  scrollPageDown: 34,
  scrollToStart: 36,
  scrollToEnd: 35
}, eh = {
  keyBlock: function(o) {
    o.stopPropagation(), o.preventDefault();
  },
  scrollPageUp: function(o) {
    var e = this.table.rowManager, t = e.scrollTop - e.element.clientHeight;
    o.preventDefault(), e.displayRowsCount && (t >= 0 ? e.element.scrollTop = t : e.scrollToRow(e.getDisplayRows()[0])), this.table.element.focus();
  },
  scrollPageDown: function(o) {
    var e = this.table.rowManager, t = e.scrollTop + e.element.clientHeight, i = e.element.scrollHeight;
    o.preventDefault(), e.displayRowsCount && (t <= i ? e.element.scrollTop = t : e.scrollToRow(e.getDisplayRows()[e.displayRowsCount - 1])), this.table.element.focus();
  },
  scrollToStart: function(o) {
    var e = this.table.rowManager;
    o.preventDefault(), e.displayRowsCount && e.scrollToRow(e.getDisplayRows()[0]), this.table.element.focus();
  },
  scrollToEnd: function(o) {
    var e = this.table.rowManager;
    o.preventDefault(), e.displayRowsCount && e.scrollToRow(e.getDisplayRows()[e.displayRowsCount - 1]), this.table.element.focus();
  },
  navPrev: function(o) {
    this.dispatch("keybinding-nav-prev", o);
  },
  navNext: function(o) {
    this.dispatch("keybinding-nav-next", o);
  },
  navLeft: function(o) {
    this.dispatch("keybinding-nav-left", o);
  },
  navRight: function(o) {
    this.dispatch("keybinding-nav-right", o);
  },
  navUp: function(o) {
    this.dispatch("keybinding-nav-up", o);
  },
  navDown: function(o) {
    this.dispatch("keybinding-nav-down", o);
  }
};
const qe = class qe extends A {
  constructor(e) {
    super(e), this.watchKeys = null, this.pressedKeys = null, this.keyupBinding = !1, this.keydownBinding = !1, this.registerTableOption("keybindings", {}), this.registerTableOption("tabEndNewRow", !1);
  }
  initialize() {
    var e = this.table.options.keybindings, t = {};
    this.watchKeys = {}, this.pressedKeys = [], e !== !1 && (Object.assign(t, qe.bindings), Object.assign(t, e), this.mapBindings(t), this.bindEvents()), this.subscribe("table-destroy", this.clearBindings.bind(this));
  }
  mapBindings(e) {
    for (let t in e)
      qe.actions[t] ? e[t] && (typeof e[t] != "object" && (e[t] = [e[t]]), e[t].forEach((i) => {
        var s = Array.isArray(i) ? i : [i];
        s.forEach((n) => {
          this.mapBinding(t, n);
        });
      })) : console.warn("Key Binding Error - no such action:", t);
  }
  mapBinding(e, t) {
    var i = {
      action: qe.actions[e],
      keys: [],
      ctrl: !1,
      shift: !1,
      meta: !1
    }, s = t.toString().toLowerCase().split(" ").join("").split("+");
    s.forEach((n) => {
      switch (n) {
        case "ctrl":
          i.ctrl = !0;
          break;
        case "shift":
          i.shift = !0;
          break;
        case "meta":
          i.meta = !0;
          break;
        default:
          n = isNaN(n) ? n.toUpperCase().charCodeAt(0) : parseInt(n), i.keys.push(n), this.watchKeys[n] || (this.watchKeys[n] = []), this.watchKeys[n].push(i);
      }
    });
  }
  bindEvents() {
    var e = this;
    this.keyupBinding = function(t) {
      var i = t.keyCode, s = e.watchKeys[i];
      s && (e.pressedKeys.push(i), s.forEach(function(n) {
        e.checkBinding(t, n);
      }));
    }, this.keydownBinding = function(t) {
      var i = t.keyCode, s = e.watchKeys[i];
      if (s) {
        var n = e.pressedKeys.indexOf(i);
        n > -1 && e.pressedKeys.splice(n, 1);
      }
    }, this.table.element.addEventListener("keydown", this.keyupBinding), this.table.element.addEventListener("keyup", this.keydownBinding);
  }
  clearBindings() {
    this.keyupBinding && this.table.element.removeEventListener("keydown", this.keyupBinding), this.keydownBinding && this.table.element.removeEventListener("keyup", this.keydownBinding);
  }
  checkBinding(e, t) {
    var i = !0;
    return e.ctrlKey == t.ctrl && e.shiftKey == t.shift && e.metaKey == t.meta ? (t.keys.forEach((s) => {
      var n = this.pressedKeys.indexOf(s);
      n == -1 && (i = !1);
    }), i && t.action.call(this, e), !0) : !1;
  }
};
C(qe, "moduleName", "keybindings"), //load defaults
C(qe, "bindings", Zl), C(qe, "actions", eh);
let Hs = qe;
class pr extends A {
  constructor(e) {
    super(e), this.menuContainer = null, this.nestedMenuBlock = !1, this.currentComponent = null, this.rootPopup = null, this.columnSubscribers = {}, this.registerTableOption("rowContextMenu", !1), this.registerTableOption("rowClickMenu", !1), this.registerTableOption("rowDblClickMenu", !1), this.registerTableOption("groupContextMenu", !1), this.registerTableOption("groupClickMenu", !1), this.registerTableOption("groupDblClickMenu", !1), this.registerColumnOption("headerContextMenu"), this.registerColumnOption("headerClickMenu"), this.registerColumnOption("headerDblClickMenu"), this.registerColumnOption("headerMenu"), this.registerColumnOption("headerMenuIcon"), this.registerColumnOption("contextMenu"), this.registerColumnOption("clickMenu"), this.registerColumnOption("dblClickMenu");
  }
  initialize() {
    this.deprecatedOptionsCheck(), this.initializeRowWatchers(), this.initializeGroupWatchers(), this.subscribe("column-init", this.initializeColumn.bind(this));
  }
  deprecatedOptionsCheck() {
  }
  initializeRowWatchers() {
    this.table.options.rowContextMenu && (this.subscribe("row-contextmenu", this.loadMenuEvent.bind(this, this.table.options.rowContextMenu)), this.table.on("rowTapHold", this.loadMenuEvent.bind(this, this.table.options.rowContextMenu))), this.table.options.rowClickMenu && this.subscribe("row-click", this.loadMenuEvent.bind(this, this.table.options.rowClickMenu)), this.table.options.rowDblClickMenu && this.subscribe("row-dblclick", this.loadMenuEvent.bind(this, this.table.options.rowDblClickMenu));
  }
  initializeGroupWatchers() {
    this.table.options.groupContextMenu && (this.subscribe("group-contextmenu", this.loadMenuEvent.bind(this, this.table.options.groupContextMenu)), this.table.on("groupTapHold", this.loadMenuEvent.bind(this, this.table.options.groupContextMenu))), this.table.options.groupClickMenu && this.subscribe("group-click", this.loadMenuEvent.bind(this, this.table.options.groupClickMenu)), this.table.options.groupDblClickMenu && this.subscribe("group-dblclick", this.loadMenuEvent.bind(this, this.table.options.groupDblClickMenu));
  }
  initializeColumn(e) {
    var t = e.definition;
    t.headerContextMenu && !this.columnSubscribers.headerContextMenu && (this.columnSubscribers.headerContextMenu = this.loadMenuTableColumnEvent.bind(this, "headerContextMenu"), this.subscribe("column-contextmenu", this.columnSubscribers.headerContextMenu), this.table.on("headerTapHold", this.loadMenuTableColumnEvent.bind(this, "headerContextMenu"))), t.headerClickMenu && !this.columnSubscribers.headerClickMenu && (this.columnSubscribers.headerClickMenu = this.loadMenuTableColumnEvent.bind(this, "headerClickMenu"), this.subscribe("column-click", this.columnSubscribers.headerClickMenu)), t.headerDblClickMenu && !this.columnSubscribers.headerDblClickMenu && (this.columnSubscribers.headerDblClickMenu = this.loadMenuTableColumnEvent.bind(this, "headerDblClickMenu"), this.subscribe("column-dblclick", this.columnSubscribers.headerDblClickMenu)), t.headerMenu && this.initializeColumnHeaderMenu(e), t.contextMenu && !this.columnSubscribers.contextMenu && (this.columnSubscribers.contextMenu = this.loadMenuTableCellEvent.bind(this, "contextMenu"), this.subscribe("cell-contextmenu", this.columnSubscribers.contextMenu), this.table.on("cellTapHold", this.loadMenuTableCellEvent.bind(this, "contextMenu"))), t.clickMenu && !this.columnSubscribers.clickMenu && (this.columnSubscribers.clickMenu = this.loadMenuTableCellEvent.bind(this, "clickMenu"), this.subscribe("cell-click", this.columnSubscribers.clickMenu)), t.dblClickMenu && !this.columnSubscribers.dblClickMenu && (this.columnSubscribers.dblClickMenu = this.loadMenuTableCellEvent.bind(this, "dblClickMenu"), this.subscribe("cell-dblclick", this.columnSubscribers.dblClickMenu));
  }
  initializeColumnHeaderMenu(e) {
    var t = e.definition.headerMenuIcon, i;
    i = document.createElement("span"), i.classList.add("tabulator-header-popup-button"), t ? (typeof t == "function" && (t = t(e.getComponent())), t instanceof HTMLElement ? i.appendChild(t) : i.innerHTML = t) : i.innerHTML = "&vellip;", i.addEventListener("click", (s) => {
      s.stopPropagation(), s.preventDefault(), this.loadMenuEvent(e.definition.headerMenu, s, e);
    }), e.titleElement.insertBefore(i, e.titleElement.firstChild);
  }
  loadMenuTableCellEvent(e, t, i) {
    i._cell && (i = i._cell), i.column.definition[e] && this.loadMenuEvent(i.column.definition[e], t, i);
  }
  loadMenuTableColumnEvent(e, t, i) {
    i._column && (i = i._column), i.definition[e] && this.loadMenuEvent(i.definition[e], t, i);
  }
  loadMenuEvent(e, t, i) {
    i._group ? i = i._group : i._row && (i = i._row), e = typeof e == "function" ? e.call(this.table, t, i.getComponent()) : e, this.loadMenu(t, i, e);
  }
  loadMenu(e, t, i, s, n) {
    var r = !(e instanceof MouseEvent), a = document.createElement("div"), l;
    if (a.classList.add("tabulator-menu"), r || e.preventDefault(), !(!i || !i.length)) {
      if (s)
        l = n.child(a);
      else {
        if (this.nestedMenuBlock) {
          if (this.rootPopup)
            return;
        } else
          this.nestedMenuBlock = setTimeout(() => {
            this.nestedMenuBlock = !1;
          }, 100);
        this.rootPopup && this.rootPopup.hide(), this.rootPopup = l = this.popup(a);
      }
      i.forEach((h) => {
        var d = document.createElement("div"), c = h.label, u = h.disabled;
        h.separator ? d.classList.add("tabulator-menu-separator") : (d.classList.add("tabulator-menu-item"), typeof c == "function" && (c = c.call(this.table, t.getComponent())), c instanceof Node ? d.appendChild(c) : d.innerHTML = c, typeof u == "function" && (u = u.call(this.table, t.getComponent())), u ? (d.classList.add("tabulator-menu-item-disabled"), d.addEventListener("click", (f) => {
          f.stopPropagation();
        })) : h.menu && h.menu.length ? d.addEventListener("click", (f) => {
          f.stopPropagation(), this.loadMenu(f, t, h.menu, d, l);
        }) : h.action && d.addEventListener("click", (f) => {
          h.action(f, t.getComponent());
        }), h.menu && h.menu.length && d.classList.add("tabulator-menu-item-submenu")), a.appendChild(d);
      }), a.addEventListener("click", (h) => {
        this.rootPopup && this.rootPopup.hide();
      }), l.show(s || e), l === this.rootPopup && (this.rootPopup.hideOnBlur(() => {
        this.rootPopup = null, this.currentComponent && (this.dispatch("menu-closed", i, l), this.dispatchExternal("menuClosed", this.currentComponent.getComponent()), this.currentComponent = null);
      }), this.currentComponent = t, this.dispatch("menu-opened", i, l), this.dispatchExternal("menuOpened", t.getComponent()));
    }
  }
}
C(pr, "moduleName", "menu");
class gr extends A {
  constructor(e) {
    super(e), this.placeholderElement = this.createPlaceholderElement(), this.hoverElement = !1, this.checkTimeout = !1, this.checkPeriod = 250, this.moving = !1, this.toCol = !1, this.toColAfter = !1, this.startX = 0, this.autoScrollMargin = 40, this.autoScrollStep = 5, this.autoScrollTimeout = !1, this.touchMove = !1, this.moveHover = this.moveHover.bind(this), this.endMove = this.endMove.bind(this), this.registerTableOption("movableColumns", !1);
  }
  createPlaceholderElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-col"), e.classList.add("tabulator-col-placeholder"), e;
  }
  initialize() {
    this.table.options.movableColumns && (this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("alert-show", this.abortMove.bind(this)));
  }
  abortMove() {
    clearTimeout(this.checkTimeout);
  }
  initializeColumn(e) {
    var t = this, i = {}, s;
    !e.modules.frozen && !e.isGroup && !e.isRowHeader && (s = e.getElement(), i.mousemove = (function(n) {
      e.parent === t.moving.parent && ((t.touchMove ? n.touches[0].pageX : n.pageX) - $.elOffset(s).left + t.table.columnManager.contentsElement.scrollLeft > e.getWidth() / 2 ? (t.toCol !== e || !t.toColAfter) && (s.parentNode.insertBefore(t.placeholderElement, s.nextSibling), t.moveColumn(e, !0)) : (t.toCol !== e || t.toColAfter) && (s.parentNode.insertBefore(t.placeholderElement, s), t.moveColumn(e, !1)));
    }).bind(t), s.addEventListener("mousedown", function(n) {
      t.touchMove = !1, n.which === 1 && (t.checkTimeout = setTimeout(function() {
        t.startMove(n, e);
      }, t.checkPeriod));
    }), s.addEventListener("mouseup", function(n) {
      n.which === 1 && t.checkTimeout && clearTimeout(t.checkTimeout);
    }), t.bindTouchEvents(e)), e.modules.moveColumn = i;
  }
  bindTouchEvents(e) {
    var t = e.getElement(), i = !1, s, n, r, a, l, h;
    t.addEventListener("touchstart", (d) => {
      this.checkTimeout = setTimeout(() => {
        this.touchMove = !0, s = e.nextColumn(), r = s ? s.getWidth() / 2 : 0, n = e.prevColumn(), a = n ? n.getWidth() / 2 : 0, l = 0, h = 0, i = !1, this.startMove(d, e);
      }, this.checkPeriod);
    }, { passive: !0 }), t.addEventListener("touchmove", (d) => {
      var c, u;
      this.moving && (this.moveHover(d), i || (i = d.touches[0].pageX), c = d.touches[0].pageX - i, c > 0 ? s && c - l > r && (u = s, u !== e && (i = d.touches[0].pageX, u.getElement().parentNode.insertBefore(this.placeholderElement, u.getElement().nextSibling), this.moveColumn(u, !0))) : n && -c - h > a && (u = n, u !== e && (i = d.touches[0].pageX, u.getElement().parentNode.insertBefore(this.placeholderElement, u.getElement()), this.moveColumn(u, !1))), u && (s = u.nextColumn(), l = r, r = s ? s.getWidth() / 2 : 0, n = u.prevColumn(), h = a, a = n ? n.getWidth() / 2 : 0));
    }, { passive: !0 }), t.addEventListener("touchend", (d) => {
      this.checkTimeout && clearTimeout(this.checkTimeout), this.moving && this.endMove(d);
    });
  }
  startMove(e, t) {
    var i = t.getElement(), s = this.table.columnManager.getContentsElement(), n = this.table.columnManager.getHeadersElement();
    this.table.modules.selectRange && this.table.modules.selectRange.columnSelection && this.table.modules.selectRange.mousedown && this.table.modules.selectRange.selecting === "column" || (this.moving = t, this.startX = (this.touchMove ? e.touches[0].pageX : e.pageX) - $.elOffset(i).left, this.table.element.classList.add("tabulator-block-select"), this.placeholderElement.style.width = t.getWidth() + "px", this.placeholderElement.style.height = t.getHeight() + "px", i.parentNode.insertBefore(this.placeholderElement, i), i.parentNode.removeChild(i), this.hoverElement = i.cloneNode(!0), this.hoverElement.classList.add("tabulator-moving"), s.appendChild(this.hoverElement), this.hoverElement.style.left = "0", this.hoverElement.style.bottom = s.clientHeight - n.offsetHeight + "px", this.touchMove || (this._bindMouseMove(), document.body.addEventListener("mousemove", this.moveHover), document.body.addEventListener("mouseup", this.endMove)), this.moveHover(e), this.dispatch("column-moving", e, this.moving));
  }
  _bindMouseMove() {
    this.table.columnManager.columnsByIndex.forEach(function(e) {
      e.modules.moveColumn.mousemove && e.getElement().addEventListener("mousemove", e.modules.moveColumn.mousemove);
    });
  }
  _unbindMouseMove() {
    this.table.columnManager.columnsByIndex.forEach(function(e) {
      e.modules.moveColumn.mousemove && e.getElement().removeEventListener("mousemove", e.modules.moveColumn.mousemove);
    });
  }
  moveColumn(e, t) {
    var i = this.moving.getCells();
    this.toCol = e, this.toColAfter = t, t ? e.getCells().forEach(function(s, n) {
      var r = s.getElement(!0);
      r.parentNode && i[n] && r.parentNode.insertBefore(i[n].getElement(), r.nextSibling);
    }) : e.getCells().forEach(function(s, n) {
      var r = s.getElement(!0);
      r.parentNode && i[n] && r.parentNode.insertBefore(i[n].getElement(), r);
    });
  }
  endMove(e) {
    (e.which === 1 || this.touchMove) && (this._unbindMouseMove(), this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling), this.placeholderElement.parentNode.removeChild(this.placeholderElement), this.hoverElement.parentNode.removeChild(this.hoverElement), this.table.element.classList.remove("tabulator-block-select"), this.toCol && this.table.columnManager.moveColumnActual(this.moving, this.toCol, this.toColAfter), this.moving = !1, this.toCol = !1, this.toColAfter = !1, this.touchMove || (document.body.removeEventListener("mousemove", this.moveHover), document.body.removeEventListener("mouseup", this.endMove)));
  }
  moveHover(e) {
    var t = this.table.columnManager.getContentsElement(), i = t.scrollLeft, s = (this.touchMove ? e.touches[0].pageX : e.pageX) - $.elOffset(t).left + i, n;
    this.hoverElement.style.left = s - this.startX + "px", s - i < this.autoScrollMargin && (this.autoScrollTimeout || (this.autoScrollTimeout = setTimeout(() => {
      n = Math.max(0, i - 5), this.table.rowManager.getElement().scrollLeft = n, this.autoScrollTimeout = !1;
    }, 1))), i + t.clientWidth - s < this.autoScrollMargin && (this.autoScrollTimeout || (this.autoScrollTimeout = setTimeout(() => {
      n = Math.min(t.clientWidth, i + 5), this.table.rowManager.getElement().scrollLeft = n, this.autoScrollTimeout = !1;
    }, 1)));
  }
}
C(gr, "moduleName", "moveColumn");
var th = {
  delete: function(o, e, t) {
    o.delete();
  }
}, ih = {
  insert: function(o, e, t) {
    return this.table.addRow(o.getData(), void 0, e), !0;
  },
  add: function(o, e, t) {
    return this.table.addRow(o.getData()), !0;
  },
  update: function(o, e, t) {
    return e ? (e.update(o.getData()), !0) : !1;
  },
  replace: function(o, e, t) {
    return e ? (this.table.addRow(o.getData(), void 0, e), e.delete(), !0) : !1;
  }
};
const ct = class ct extends A {
  constructor(e) {
    super(e), this.placeholderElement = this.createPlaceholderElement(), this.hoverElement = !1, this.checkTimeout = !1, this.checkPeriod = 150, this.moving = !1, this.toRow = !1, this.toRowAfter = !1, this.hasHandle = !1, this.startY = 0, this.startX = 0, this.moveHover = this.moveHover.bind(this), this.endMove = this.endMove.bind(this), this.tableRowDropEvent = !1, this.touchMove = !1, this.connection = !1, this.connectionSelectorsTables = !1, this.connectionSelectorsElements = !1, this.connectionElements = [], this.connections = [], this.connectedTable = !1, this.connectedRow = !1, this.registerTableOption("movableRows", !1), this.registerTableOption("movableRowsConnectedTables", !1), this.registerTableOption("movableRowsConnectedElements", !1), this.registerTableOption("movableRowsSender", !1), this.registerTableOption("movableRowsReceiver", "insert"), this.registerColumnOption("rowHandle");
  }
  createPlaceholderElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-row"), e.classList.add("tabulator-row-placeholder"), e;
  }
  initialize() {
    this.table.options.movableRows && (this.connectionSelectorsTables = this.table.options.movableRowsConnectedTables, this.connectionSelectorsElements = this.table.options.movableRowsConnectedElements, this.connection = this.connectionSelectorsTables || this.connectionSelectorsElements, this.subscribe("cell-init", this.initializeCell.bind(this)), this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("row-init", this.initializeRow.bind(this)));
  }
  initializeGroupHeader(e) {
    var t = this, i = {};
    i.mouseup = (function(s) {
      t.tableRowDrop(s, e);
    }).bind(t), i.mousemove = (function(s) {
      var n;
      s.pageY - $.elOffset(e.element).top + t.table.rowManager.element.scrollTop > e.getHeight() / 2 ? (t.toRow !== e || !t.toRowAfter) && (n = e.getElement(), n.parentNode.insertBefore(t.placeholderElement, n.nextSibling), t.moveRow(e, !0)) : (t.toRow !== e || t.toRowAfter) && (n = e.getElement(), n.previousSibling && (n.parentNode.insertBefore(t.placeholderElement, n), t.moveRow(e, !1)));
    }).bind(t), e.modules.moveRow = i;
  }
  initializeRow(e) {
    var t = this, i = {}, s;
    i.mouseup = (function(n) {
      t.tableRowDrop(n, e);
    }).bind(t), i.mousemove = (function(n) {
      var r = e.getElement();
      n.pageY - $.elOffset(r).top + t.table.rowManager.element.scrollTop > e.getHeight() / 2 ? (t.toRow !== e || !t.toRowAfter) && (r.parentNode.insertBefore(t.placeholderElement, r.nextSibling), t.moveRow(e, !0)) : (t.toRow !== e || t.toRowAfter) && (r.parentNode.insertBefore(t.placeholderElement, r), t.moveRow(e, !1));
    }).bind(t), this.hasHandle || (s = e.getElement(), s.addEventListener("mousedown", function(n) {
      n.which === 1 && (t.checkTimeout = setTimeout(function() {
        t.startMove(n, e);
      }, t.checkPeriod));
    }), s.addEventListener("mouseup", function(n) {
      n.which === 1 && t.checkTimeout && clearTimeout(t.checkTimeout);
    }), this.bindTouchEvents(e, e.getElement())), e.modules.moveRow = i;
  }
  initializeColumn(e) {
    e.definition.rowHandle && this.table.options.movableRows !== !1 && (this.hasHandle = !0);
  }
  initializeCell(e) {
    if (e.column.definition.rowHandle && this.table.options.movableRows !== !1) {
      var t = this, i = e.getElement(!0);
      i.addEventListener("mousedown", function(s) {
        s.which === 1 && (t.checkTimeout = setTimeout(function() {
          t.startMove(s, e.row);
        }, t.checkPeriod));
      }), i.addEventListener("mouseup", function(s) {
        s.which === 1 && t.checkTimeout && clearTimeout(t.checkTimeout);
      }), this.bindTouchEvents(e.row, i);
    }
  }
  bindTouchEvents(e, t) {
    var i = !1, s, n, r, a, l, h;
    t.addEventListener("touchstart", (d) => {
      this.checkTimeout = setTimeout(() => {
        this.touchMove = !0, s = e.nextRow(), r = s ? s.getHeight() / 2 : 0, n = e.prevRow(), a = n ? n.getHeight() / 2 : 0, l = 0, h = 0, i = !1, this.startMove(d, e);
      }, this.checkPeriod);
    }, { passive: !0 }), this.moving, this.toRow, this.toRowAfter, t.addEventListener("touchmove", (d) => {
      var c, u;
      this.moving && (d.preventDefault(), this.moveHover(d), i || (i = d.touches[0].pageY), c = d.touches[0].pageY - i, c > 0 ? s && c - l > r && (u = s, u !== e && (i = d.touches[0].pageY, u.getElement().parentNode.insertBefore(this.placeholderElement, u.getElement().nextSibling), this.moveRow(u, !0))) : n && -c - h > a && (u = n, u !== e && (i = d.touches[0].pageY, u.getElement().parentNode.insertBefore(this.placeholderElement, u.getElement()), this.moveRow(u, !1))), u && (s = u.nextRow(), l = r, r = s ? s.getHeight() / 2 : 0, n = u.prevRow(), h = a, a = n ? n.getHeight() / 2 : 0));
    }), t.addEventListener("touchend", (d) => {
      this.checkTimeout && clearTimeout(this.checkTimeout), this.moving && (this.endMove(d), this.touchMove = !1);
    });
  }
  _bindMouseMove() {
    this.table.rowManager.getDisplayRows().forEach((e) => {
      (e.type === "row" || e.type === "group") && e.modules.moveRow && e.modules.moveRow.mousemove && e.getElement().addEventListener("mousemove", e.modules.moveRow.mousemove);
    });
  }
  _unbindMouseMove() {
    this.table.rowManager.getDisplayRows().forEach((e) => {
      (e.type === "row" || e.type === "group") && e.modules.moveRow && e.modules.moveRow.mousemove && e.getElement().removeEventListener("mousemove", e.modules.moveRow.mousemove);
    });
  }
  startMove(e, t) {
    var i = t.getElement();
    this.setStartPosition(e, t), this.moving = t, this.table.element.classList.add("tabulator-block-select"), this.placeholderElement.style.width = t.getWidth() + "px", this.placeholderElement.style.height = t.getHeight() + "px", this.connection ? (this.table.element.classList.add("tabulator-movingrow-sending"), this.connectToTables(t)) : (i.parentNode.insertBefore(this.placeholderElement, i), i.parentNode.removeChild(i)), this.hoverElement = i.cloneNode(!0), this.hoverElement.classList.add("tabulator-moving"), this.connection ? (document.body.appendChild(this.hoverElement), this.hoverElement.style.left = "0", this.hoverElement.style.top = "0", this.hoverElement.style.width = this.table.element.clientWidth + "px", this.hoverElement.style.whiteSpace = "nowrap", this.hoverElement.style.overflow = "hidden", this.hoverElement.style.pointerEvents = "none") : (this.table.rowManager.getTableElement().appendChild(this.hoverElement), this.hoverElement.style.left = "0", this.hoverElement.style.top = "0", this._bindMouseMove()), document.body.addEventListener("mousemove", this.moveHover), document.body.addEventListener("mouseup", this.endMove), this.dispatchExternal("rowMoving", t.getComponent()), this.moveHover(e);
  }
  setStartPosition(e, t) {
    var i = this.touchMove ? e.touches[0].pageX : e.pageX, s = this.touchMove ? e.touches[0].pageY : e.pageY, n, r;
    n = t.getElement(), this.connection ? (r = n.getBoundingClientRect(), this.startX = r.left - i + window.pageXOffset, this.startY = r.top - s + window.pageYOffset) : this.startY = s - n.getBoundingClientRect().top;
  }
  endMove(e) {
    (!e || e.which === 1 || this.touchMove) && (this._unbindMouseMove(), this.connection || (this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling), this.placeholderElement.parentNode.removeChild(this.placeholderElement)), this.hoverElement.parentNode.removeChild(this.hoverElement), this.table.element.classList.remove("tabulator-block-select"), this.toRow ? this.table.rowManager.moveRow(this.moving, this.toRow, this.toRowAfter) : this.dispatchExternal("rowMoveCancelled", this.moving.getComponent()), this.moving = !1, this.toRow = !1, this.toRowAfter = !1, document.body.removeEventListener("mousemove", this.moveHover), document.body.removeEventListener("mouseup", this.endMove), this.connection && (this.table.element.classList.remove("tabulator-movingrow-sending"), this.disconnectFromTables()));
  }
  moveRow(e, t) {
    this.toRow = e, this.toRowAfter = t;
  }
  moveHover(e) {
    this.connection ? this.moveHoverConnections.call(this, e) : this.moveHoverTable.call(this, e);
  }
  moveHoverTable(e) {
    var t = this.table.rowManager.getElement(), i = t.scrollTop, s = (this.touchMove ? e.touches[0].pageY : e.pageY) - t.getBoundingClientRect().top + i;
    this.hoverElement.style.top = Math.min(s - this.startY, this.table.rowManager.element.scrollHeight - this.hoverElement.offsetHeight) + "px";
  }
  moveHoverConnections(e) {
    this.hoverElement.style.left = this.startX + (this.touchMove ? e.touches[0].pageX : e.pageX) + "px", this.hoverElement.style.top = this.startY + (this.touchMove ? e.touches[0].pageY : e.pageY) + "px";
  }
  elementRowDrop(e, t, i) {
    this.dispatchExternal("movableRowsElementDrop", e, t, i ? i.getComponent() : !1);
  }
  //establish connection with other tables
  connectToTables(e) {
    var t;
    this.connectionSelectorsTables && (t = this.commsConnections(this.connectionSelectorsTables), this.dispatchExternal("movableRowsSendingStart", t), this.commsSend(this.connectionSelectorsTables, "moveRow", "connect", {
      row: e
    })), this.connectionSelectorsElements && (this.connectionElements = [], Array.isArray(this.connectionSelectorsElements) || (this.connectionSelectorsElements = [this.connectionSelectorsElements]), this.connectionSelectorsElements.forEach((i) => {
      typeof i == "string" ? this.connectionElements = this.connectionElements.concat(Array.prototype.slice.call(document.querySelectorAll(i))) : this.connectionElements.push(i);
    }), this.connectionElements.forEach((i) => {
      var s = (n) => {
        this.elementRowDrop(n, i, this.moving);
      };
      i.addEventListener("mouseup", s), i.tabulatorElementDropEvent = s, i.classList.add("tabulator-movingrow-receiving");
    }));
  }
  //disconnect from other tables
  disconnectFromTables() {
    var e;
    this.connectionSelectorsTables && (e = this.commsConnections(this.connectionSelectorsTables), this.dispatchExternal("movableRowsSendingStop", e), this.commsSend(this.connectionSelectorsTables, "moveRow", "disconnect")), this.connectionElements.forEach((t) => {
      t.classList.remove("tabulator-movingrow-receiving"), t.removeEventListener("mouseup", t.tabulatorElementDropEvent), delete t.tabulatorElementDropEvent;
    });
  }
  //accept incomming connection
  connect(e, t) {
    return this.connectedTable ? (console.warn("Move Row Error - Table cannot accept connection, already connected to table:", this.connectedTable), !1) : (this.connectedTable = e, this.connectedRow = t, this.table.element.classList.add("tabulator-movingrow-receiving"), this.table.rowManager.getDisplayRows().forEach((i) => {
      i.type === "row" && i.modules.moveRow && i.modules.moveRow.mouseup && i.getElement().addEventListener("mouseup", i.modules.moveRow.mouseup);
    }), this.tableRowDropEvent = this.tableRowDrop.bind(this), this.table.element.addEventListener("mouseup", this.tableRowDropEvent), this.dispatchExternal("movableRowsReceivingStart", t, e), !0);
  }
  //close incoming connection
  disconnect(e) {
    e === this.connectedTable ? (this.connectedTable = !1, this.connectedRow = !1, this.table.element.classList.remove("tabulator-movingrow-receiving"), this.table.rowManager.getDisplayRows().forEach((t) => {
      t.type === "row" && t.modules.moveRow && t.modules.moveRow.mouseup && t.getElement().removeEventListener("mouseup", t.modules.moveRow.mouseup);
    }), this.table.element.removeEventListener("mouseup", this.tableRowDropEvent), this.dispatchExternal("movableRowsReceivingStop", e)) : console.warn("Move Row Error - trying to disconnect from non connected table");
  }
  dropComplete(e, t, i) {
    var s = !1;
    if (i) {
      switch (typeof this.table.options.movableRowsSender) {
        case "string":
          s = ct.senders[this.table.options.movableRowsSender];
          break;
        case "function":
          s = this.table.options.movableRowsSender;
          break;
      }
      s ? s.call(this, this.moving ? this.moving.getComponent() : void 0, t ? t.getComponent() : void 0, e) : this.table.options.movableRowsSender && console.warn("Mover Row Error - no matching sender found:", this.table.options.movableRowsSender), this.dispatchExternal("movableRowsSent", this.moving.getComponent(), t ? t.getComponent() : void 0, e);
    } else
      this.dispatchExternal("movableRowsSentFailed", this.moving.getComponent(), t ? t.getComponent() : void 0, e);
    this.endMove();
  }
  tableRowDrop(e, t) {
    var i = !1, s = !1;
    switch (e.stopImmediatePropagation(), typeof this.table.options.movableRowsReceiver) {
      case "string":
        i = ct.receivers[this.table.options.movableRowsReceiver];
        break;
      case "function":
        i = this.table.options.movableRowsReceiver;
        break;
    }
    i ? s = i.call(this, this.connectedRow.getComponent(), t ? t.getComponent() : void 0, this.connectedTable) : console.warn("Mover Row Error - no matching receiver found:", this.table.options.movableRowsReceiver), s ? this.dispatchExternal("movableRowsReceived", this.connectedRow.getComponent(), t ? t.getComponent() : void 0, this.connectedTable) : this.dispatchExternal("movableRowsReceivedFailed", this.connectedRow.getComponent(), t ? t.getComponent() : void 0, this.connectedTable), this.commsSend(this.connectedTable, "moveRow", "dropcomplete", {
      row: t,
      success: s
    });
  }
  commsReceived(e, t, i) {
    switch (t) {
      case "connect":
        return this.connect(e, i.row);
      case "disconnect":
        return this.disconnect(e);
      case "dropcomplete":
        return this.dropComplete(e, i.row, i.success);
    }
  }
};
C(ct, "moduleName", "moveRow"), //load defaults
C(ct, "senders", th), C(ct, "receivers", ih);
let Is = ct;
var sh = {};
const Mt = class Mt extends A {
  constructor(e) {
    super(e), this.allowedTypes = ["", "data", "edit", "clipboard", "import"], this.enabled = !0, this.registerColumnOption("mutator"), this.registerColumnOption("mutatorParams"), this.registerColumnOption("mutatorData"), this.registerColumnOption("mutatorDataParams"), this.registerColumnOption("mutatorEdit"), this.registerColumnOption("mutatorEditParams"), this.registerColumnOption("mutatorClipboard"), this.registerColumnOption("mutatorClipboardParams"), this.registerColumnOption("mutatorImport"), this.registerColumnOption("mutatorImportParams"), this.registerColumnOption("mutateLink");
  }
  initialize() {
    this.subscribe("cell-value-changing", this.transformCell.bind(this)), this.subscribe("cell-value-changed", this.mutateLink.bind(this)), this.subscribe("column-layout", this.initializeColumn.bind(this)), this.subscribe("row-data-init-before", this.rowDataChanged.bind(this)), this.subscribe("row-data-changing", this.rowDataChanged.bind(this));
  }
  rowDataChanged(e, t, i) {
    return this.transformRow(t, "data", i);
  }
  //initialize column mutator
  initializeColumn(e) {
    var t = !1, i = {};
    this.allowedTypes.forEach((s) => {
      var n = "mutator" + (s.charAt(0).toUpperCase() + s.slice(1)), r;
      e.definition[n] && (r = this.lookupMutator(e.definition[n]), r && (t = !0, i[n] = {
        mutator: r,
        params: e.definition[n + "Params"] || {}
      }));
    }), t && (e.modules.mutate = i);
  }
  lookupMutator(e) {
    var t = !1;
    switch (typeof e) {
      case "string":
        Mt.mutators[e] ? t = Mt.mutators[e] : console.warn("Mutator Error - No such mutator found, ignoring: ", e);
        break;
      case "function":
        t = e;
        break;
    }
    return t;
  }
  //apply mutator to row
  transformRow(e, t, i) {
    var s = "mutator" + (t.charAt(0).toUpperCase() + t.slice(1)), n;
    return this.enabled && this.table.columnManager.traverse((r) => {
      var a, l, h;
      r.modules.mutate && (a = r.modules.mutate[s] || r.modules.mutate.mutator || !1, a && (n = r.getFieldValue(typeof i < "u" ? i : e), (t == "data" && !i || typeof n < "u") && (h = r.getComponent(), l = typeof a.params == "function" ? a.params(n, e, t, h) : a.params, r.setFieldValue(e, a.mutator(n, e, t, l, h)))));
    }), e;
  }
  //apply mutator to new cell value
  transformCell(e, t) {
    if (e.column.modules.mutate) {
      var i = e.column.modules.mutate.mutatorEdit || e.column.modules.mutate.mutator || !1, s = {};
      if (i)
        return s = Object.assign(s, e.row.getData()), e.column.setFieldValue(s, t), i.mutator(t, s, "edit", i.params, e.getComponent());
    }
    return t;
  }
  mutateLink(e) {
    var t = e.column.definition.mutateLink;
    t && (Array.isArray(t) || (t = [t]), t.forEach((i) => {
      var s = e.row.getCell(i);
      s && s.setValue(s.getValue(), !0, !0);
    }));
  }
  enable() {
    this.enabled = !0;
  }
  disable() {
    this.enabled = !1;
  }
};
C(Mt, "moduleName", "mutator"), //load defaults
C(Mt, "mutators", sh);
let Bs = Mt;
function nh(o, e, t, i, s) {
  var n = document.createElement("span"), r = document.createElement("span"), a = document.createElement("span"), l = document.createElement("span"), h = document.createElement("span"), d = document.createElement("span");
  return this.table.modules.localize.langBind("pagination|counter|showing", (c) => {
    r.innerHTML = c;
  }), this.table.modules.localize.langBind("pagination|counter|of", (c) => {
    l.innerHTML = c;
  }), this.table.modules.localize.langBind("pagination|counter|rows", (c) => {
    d.innerHTML = c;
  }), i ? (a.innerHTML = " " + e + "-" + Math.min(e + o - 1, i) + " ", h.innerHTML = " " + i + " ", n.appendChild(r), n.appendChild(a), n.appendChild(l), n.appendChild(h), n.appendChild(d)) : (a.innerHTML = " 0 ", n.appendChild(r), n.appendChild(a), n.appendChild(d)), n;
}
function oh(o, e, t, i, s) {
  var n = document.createElement("span"), r = document.createElement("span"), a = document.createElement("span"), l = document.createElement("span"), h = document.createElement("span"), d = document.createElement("span");
  return this.table.modules.localize.langBind("pagination|counter|showing", (c) => {
    r.innerHTML = c;
  }), a.innerHTML = " " + t + " ", this.table.modules.localize.langBind("pagination|counter|of", (c) => {
    l.innerHTML = c;
  }), h.innerHTML = " " + s + " ", this.table.modules.localize.langBind("pagination|counter|pages", (c) => {
    d.innerHTML = c;
  }), n.appendChild(r), n.appendChild(a), n.appendChild(l), n.appendChild(h), n.appendChild(d), n;
}
var rh = {
  rows: nh,
  pages: oh
};
const si = class si extends A {
  constructor(e) {
    super(e), this.mode = "local", this.progressiveLoad = !1, this.element = null, this.pageCounterElement = null, this.pageCounter = null, this.size = 0, this.page = 1, this.count = 5, this.max = 1, this.remoteRowCountEstimate = null, this.initialLoad = !0, this.dataChanging = !1, this.pageSizes = [], this.registerTableOption("pagination", !1), this.registerTableOption("paginationMode", "local"), this.registerTableOption("paginationSize", !1), this.registerTableOption("paginationInitialPage", 1), this.registerTableOption("paginationCounter", !1), this.registerTableOption("paginationCounterElement", !1), this.registerTableOption("paginationButtonCount", 5), this.registerTableOption("paginationSizeSelector", !1), this.registerTableOption("paginationElement", !1), this.registerTableOption("paginationAddRow", "page"), this.registerTableOption("paginationOutOfRange", !1), this.registerTableOption("progressiveLoad", !1), this.registerTableOption("progressiveLoadDelay", 0), this.registerTableOption("progressiveLoadScrollMargin", 0), this.registerTableFunction("setMaxPage", this.setMaxPage.bind(this)), this.registerTableFunction("setPage", this.setPage.bind(this)), this.registerTableFunction("setPageToRow", this.userSetPageToRow.bind(this)), this.registerTableFunction("setPageSize", this.userSetPageSize.bind(this)), this.registerTableFunction("getPageSize", this.getPageSize.bind(this)), this.registerTableFunction("previousPage", this.previousPage.bind(this)), this.registerTableFunction("nextPage", this.nextPage.bind(this)), this.registerTableFunction("getPage", this.getPage.bind(this)), this.registerTableFunction("getPageMax", this.getPageMax.bind(this)), this.registerComponentFunction("row", "pageTo", this.setPageToRow.bind(this));
  }
  initialize() {
    this.table.options.pagination ? (this.subscribe("row-deleted", this.rowsUpdated.bind(this)), this.subscribe("row-added", this.rowsUpdated.bind(this)), this.subscribe("data-processed", this.initialLoadComplete.bind(this)), this.subscribe("table-built", this.calculatePageSizes.bind(this)), this.subscribe("footer-redraw", this.footerRedraw.bind(this)), this.table.options.paginationAddRow == "page" && this.subscribe("row-adding-position", this.rowAddingPosition.bind(this)), this.table.options.paginationMode === "remote" && (this.subscribe("data-params", this.remotePageParams.bind(this)), this.subscribe("data-loaded", this._parseRemoteData.bind(this))), this.table.options.progressiveLoad && console.error("Progressive Load Error - Pagination and progressive load cannot be used at the same time"), this.registerDisplayHandler(this.restOnRenderBefore.bind(this), 40), this.registerDisplayHandler(this.getRows.bind(this), 50), this.createElements(), this.initializePageCounter(), this.initializePaginator()) : this.table.options.progressiveLoad && (this.subscribe("data-params", this.remotePageParams.bind(this)), this.subscribe("data-loaded", this._parseRemoteData.bind(this)), this.subscribe("table-built", this.calculatePageSizes.bind(this)), this.subscribe("data-processed", this.initialLoadComplete.bind(this)), this.initializeProgressive(this.table.options.progressiveLoad), this.table.options.progressiveLoad === "scroll" && this.subscribe("scroll-vertical", this.scrollVertical.bind(this)));
  }
  rowAddingPosition(e, t) {
    var i = this.table.rowManager, s = i.getDisplayRows(), n;
    return t ? s.length ? n = s[0] : i.activeRows.length && (n = i.activeRows[i.activeRows.length - 1], t = !1) : s.length && (n = s[s.length - 1], t = !(s.length < this.size)), { index: n, top: t };
  }
  calculatePageSizes() {
    var e, t;
    this.table.options.paginationSize ? this.size = this.table.options.paginationSize : (e = document.createElement("div"), e.classList.add("tabulator-row"), e.style.visibility = "hidden", t = document.createElement("div"), t.classList.add("tabulator-cell"), t.innerHTML = "Page Row Test", e.appendChild(t), this.table.rowManager.getTableElement().appendChild(e), this.size = Math.floor(this.table.rowManager.getElement().clientHeight / e.offsetHeight), this.table.rowManager.getTableElement().removeChild(e)), this.dispatchExternal("pageSizeChanged", this.size), this.generatePageSizeSelectList();
  }
  initialLoadComplete() {
    this.initialLoad = !1;
  }
  remotePageParams(e, t, i, s) {
    return this.initialLoad || (this.progressiveLoad && !i || !this.progressiveLoad && !this.dataChanging) && this.reset(!0), s.page = this.page, this.size && (s.size = this.size), s;
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  userSetPageToRow(e) {
    return this.table.options.pagination && (e = this.table.rowManager.findRow(e), e) ? this.setPageToRow(e) : Promise.reject();
  }
  userSetPageSize(e) {
    return this.table.options.pagination ? (this.setPageSize(e), this.setPage(1)) : !1;
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  scrollVertical(e, t) {
    var i, s, n;
    !t && !this.table.dataLoader.loading && (i = this.table.rowManager.getElement(), s = i.scrollHeight - i.clientHeight - e, n = this.table.options.progressiveLoadScrollMargin || i.clientHeight * 2, s < n && this.nextPage().catch(() => {
    }));
  }
  restOnRenderBefore(e, t) {
    return t || this.mode === "local" && this.reset(), e;
  }
  rowsUpdated() {
    this.refreshData(!0, "all");
  }
  createElements() {
    var e;
    this.element = document.createElement("span"), this.element.classList.add("tabulator-paginator"), this.pagesElement = document.createElement("span"), this.pagesElement.classList.add("tabulator-pages"), e = document.createElement("button"), e.classList.add("tabulator-page"), e.setAttribute("type", "button"), e.setAttribute("role", "button"), e.setAttribute("aria-label", ""), e.setAttribute("title", ""), this.firstBut = e.cloneNode(!0), this.firstBut.setAttribute("data-page", "first"), this.prevBut = e.cloneNode(!0), this.prevBut.setAttribute("data-page", "prev"), this.nextBut = e.cloneNode(!0), this.nextBut.setAttribute("data-page", "next"), this.lastBut = e.cloneNode(!0), this.lastBut.setAttribute("data-page", "last"), this.table.options.paginationSizeSelector && (this.pageSizeSelect = document.createElement("select"), this.pageSizeSelect.classList.add("tabulator-page-size"));
  }
  generatePageSizeSelectList() {
    var e = [];
    if (this.pageSizeSelect) {
      if (Array.isArray(this.table.options.paginationSizeSelector))
        e = this.table.options.paginationSizeSelector, this.pageSizes = e, this.pageSizes.indexOf(this.size) == -1 && e.unshift(this.size);
      else if (this.pageSizes.indexOf(this.size) == -1) {
        e = [];
        for (let t = 1; t < 5; t++)
          e.push(this.size * t);
        this.pageSizes = e;
      } else
        e = this.pageSizes;
      for (; this.pageSizeSelect.firstChild; ) this.pageSizeSelect.removeChild(this.pageSizeSelect.firstChild);
      e.forEach((t) => {
        var i = document.createElement("option");
        i.value = t, t === !0 ? this.langBind("pagination|all", function(s) {
          i.innerHTML = s;
        }) : i.innerHTML = t, this.pageSizeSelect.appendChild(i);
      }), this.pageSizeSelect.value = this.size;
    }
  }
  initializePageCounter() {
    var e = this.table.options.paginationCounter, t = null;
    e && (typeof e == "function" ? t = e : t = si.pageCounters[e], t ? (this.pageCounter = t, this.pageCounterElement = document.createElement("span"), this.pageCounterElement.classList.add("tabulator-page-counter")) : console.warn("Pagination Error - No such page counter found: ", e));
  }
  //setup pagination
  initializePaginator(e) {
    var t, i;
    e || (this.langBind("pagination|first", (s) => {
      this.firstBut.innerHTML = s;
    }), this.langBind("pagination|first_title", (s) => {
      this.firstBut.setAttribute("aria-label", s), this.firstBut.setAttribute("title", s);
    }), this.langBind("pagination|prev", (s) => {
      this.prevBut.innerHTML = s;
    }), this.langBind("pagination|prev_title", (s) => {
      this.prevBut.setAttribute("aria-label", s), this.prevBut.setAttribute("title", s);
    }), this.langBind("pagination|next", (s) => {
      this.nextBut.innerHTML = s;
    }), this.langBind("pagination|next_title", (s) => {
      this.nextBut.setAttribute("aria-label", s), this.nextBut.setAttribute("title", s);
    }), this.langBind("pagination|last", (s) => {
      this.lastBut.innerHTML = s;
    }), this.langBind("pagination|last_title", (s) => {
      this.lastBut.setAttribute("aria-label", s), this.lastBut.setAttribute("title", s);
    }), this.firstBut.addEventListener("click", () => {
      this.setPage(1);
    }), this.prevBut.addEventListener("click", () => {
      this.previousPage();
    }), this.nextBut.addEventListener("click", () => {
      this.nextPage();
    }), this.lastBut.addEventListener("click", () => {
      this.setPage(this.max);
    }), this.table.options.paginationElement && (this.element = this.table.options.paginationElement), this.pageSizeSelect && (t = document.createElement("label"), this.langBind("pagination|page_size", (s) => {
      this.pageSizeSelect.setAttribute("aria-label", s), this.pageSizeSelect.setAttribute("title", s), t.innerHTML = s;
    }), this.element.appendChild(t), this.element.appendChild(this.pageSizeSelect), this.pageSizeSelect.addEventListener("change", (s) => {
      this.setPageSize(this.pageSizeSelect.value == "true" ? !0 : this.pageSizeSelect.value), this.setPage(1);
    })), this.element.appendChild(this.firstBut), this.element.appendChild(this.prevBut), this.element.appendChild(this.pagesElement), this.element.appendChild(this.nextBut), this.element.appendChild(this.lastBut), this.table.options.paginationElement || (this.table.options.paginationCounter && (this.table.options.paginationCounterElement ? this.table.options.paginationCounterElement instanceof HTMLElement ? this.table.options.paginationCounterElement.appendChild(this.pageCounterElement) : typeof this.table.options.paginationCounterElement == "string" && (i = document.querySelector(this.table.options.paginationCounterElement), i ? i.appendChild(this.pageCounterElement) : console.warn("Pagination Error - Unable to find element matching paginationCounterElement selector:", this.table.options.paginationCounterElement)) : this.footerAppend(this.pageCounterElement)), this.footerAppend(this.element)), this.page = this.table.options.paginationInitialPage, this.count = this.table.options.paginationButtonCount), this.mode = this.table.options.paginationMode;
  }
  initializeProgressive(e) {
    this.initializePaginator(!0), this.mode = "progressive_" + e, this.progressiveLoad = !0;
  }
  trackChanges() {
    this.dispatch("page-changed");
  }
  //calculate maximum page from number of rows
  setMaxRows(e) {
    e ? this.max = this.size === !0 ? 1 : Math.ceil(e / this.size) : this.max = 1, this.page > this.max && (this.page = this.max);
  }
  //reset to first page without triggering action
  reset(e) {
    this.initialLoad || (this.mode == "local" || e) && (this.page = 1, this.trackChanges());
  }
  //set the maximum page
  setMaxPage(e) {
    e = parseInt(e), this.max = e || 1, this.page > this.max && (this.page = this.max, this.trigger());
  }
  //set current page number
  setPage(e) {
    switch (e) {
      case "first":
        return this.setPage(1);
      case "prev":
        return this.previousPage();
      case "next":
        return this.nextPage();
      case "last":
        return this.setPage(this.max);
    }
    return e = parseInt(e), e > 0 && e <= this.max || this.mode !== "local" ? (this.page = e, this.trackChanges(), this.trigger()) : (console.warn("Pagination Error - Requested page is out of range of 1 - " + this.max + ":", e), Promise.reject());
  }
  setPageToRow(e) {
    var t = this.displayRows(-1), i = t.indexOf(e);
    if (i > -1) {
      var s = this.size === !0 ? 1 : Math.ceil((i + 1) / this.size);
      return this.setPage(s);
    } else
      return console.warn("Pagination Error - Requested row is not visible"), Promise.reject();
  }
  setPageSize(e) {
    e !== !0 && (e = parseInt(e)), e > 0 && (this.size = e, this.dispatchExternal("pageSizeChanged", e)), this.pageSizeSelect && this.generatePageSizeSelectList(), this.trackChanges();
  }
  _setPageCounter(e, t, i) {
    var s;
    if (this.pageCounter)
      switch (this.mode === "remote" && (t = this.size, i = (this.page - 1) * this.size + 1, e = this.remoteRowCountEstimate), s = this.pageCounter.call(this, t, i, this.page, e, this.max), typeof s) {
        case "object":
          if (s instanceof Node) {
            for (; this.pageCounterElement.firstChild; ) this.pageCounterElement.removeChild(this.pageCounterElement.firstChild);
            this.pageCounterElement.appendChild(s);
          } else
            this.pageCounterElement.innerHTML = "", s != null && console.warn("Page Counter Error - Page Counter has returned a type of object, the only valid page counter object return is an instance of Node, the page counter returned:", s);
          break;
        case "undefined":
          this.pageCounterElement.innerHTML = "";
          break;
        default:
          this.pageCounterElement.innerHTML = s;
      }
  }
  //setup the pagination buttons
  _setPageButtons() {
    let e = Math.floor((this.count - 1) / 2), t = Math.ceil((this.count - 1) / 2), i = this.max - this.page + e + 1 < this.count ? this.max - this.count + 1 : Math.max(this.page - e, 1), s = this.page <= t ? Math.min(this.count, this.max) : Math.min(this.page + t, this.max);
    for (; this.pagesElement.firstChild; ) this.pagesElement.removeChild(this.pagesElement.firstChild);
    this.page == 1 ? (this.firstBut.disabled = !0, this.prevBut.disabled = !0) : (this.firstBut.disabled = !1, this.prevBut.disabled = !1), this.page == this.max ? (this.lastBut.disabled = !0, this.nextBut.disabled = !0) : (this.lastBut.disabled = !1, this.nextBut.disabled = !1);
    for (let n = i; n <= s; n++)
      n > 0 && n <= this.max && this.pagesElement.appendChild(this._generatePageButton(n));
    this.footerRedraw();
  }
  _generatePageButton(e) {
    var t = document.createElement("button");
    return t.classList.add("tabulator-page"), e == this.page && t.classList.add("active"), t.setAttribute("type", "button"), t.setAttribute("role", "button"), this.langBind("pagination|page_title", (i) => {
      t.setAttribute("aria-label", i + " " + e), t.setAttribute("title", i + " " + e);
    }), t.setAttribute("data-page", e), t.textContent = e, t.addEventListener("click", (i) => {
      this.setPage(e);
    }), t;
  }
  //previous page
  previousPage() {
    return this.page > 1 ? (this.page--, this.trackChanges(), this.trigger()) : (console.warn("Pagination Error - Previous page would be less than page 1:", 0), Promise.reject());
  }
  //next page
  nextPage() {
    return this.page < this.max ? (this.page++, this.trackChanges(), this.trigger()) : (this.progressiveLoad || console.warn("Pagination Error - Next page would be greater than maximum page of " + this.max + ":", this.max + 1), Promise.reject());
  }
  //return current page number
  getPage() {
    return this.page;
  }
  //return max page number
  getPageMax() {
    return this.max;
  }
  getPageSize(e) {
    return this.size;
  }
  getMode() {
    return this.mode;
  }
  //return appropriate rows for current page
  getRows(e) {
    var t = 0, i, s, n, r, a = e.filter((l) => l.type === "row");
    if (this.mode == "local") {
      i = [], this.setMaxRows(e.length), this.size === !0 ? (s = 0, n = e.length) : (s = this.size * (this.page - 1), n = s + parseInt(this.size)), this._setPageButtons();
      for (let l = s; l < n; l++) {
        let h = e[l];
        h && (i.push(h), h.type === "row" && (r || (r = h), t++));
      }
      return this._setPageCounter(a.length, t, r ? a.indexOf(r) + 1 : 0), i;
    } else
      return this._setPageButtons(), this._setPageCounter(a.length), e.slice(0);
  }
  trigger() {
    var e;
    switch (this.mode) {
      case "local":
        return e = this.table.rowManager.scrollLeft, this.refreshData(), this.table.rowManager.scrollHorizontal(e), this.dispatchExternal("pageLoaded", this.getPage()), Promise.resolve();
      case "remote":
        return this.dataChanging = !0, this.reloadData(null).finally(() => {
          this.dataChanging = !1;
        });
      case "progressive_load":
      case "progressive_scroll":
        return this.reloadData(null, !0);
      default:
        return console.warn("Pagination Error - no such pagination mode:", this.mode), Promise.reject();
    }
  }
  _parseRemoteData(e) {
    var t, i;
    if (typeof e.last_page > "u" && console.warn("Remote Pagination Error - Server response missing '" + (this.options("dataReceiveParams").last_page || "last_page") + "' property"), e.data)
      if (this.max = parseInt(e.last_page) || 1, this.remoteRowCountEstimate = typeof e.last_row < "u" ? e.last_row : e.last_page * this.size - (this.page == e.last_page ? this.size - e.data.length : 0), this.progressiveLoad) {
        switch (this.mode) {
          case "progressive_load":
            this.page == 1 ? this.table.rowManager.setData(e.data, !1, this.page == 1) : this.table.rowManager.addRows(e.data), this.page < this.max && setTimeout(() => {
              this.nextPage();
            }, this.table.options.progressiveLoadDelay);
            break;
          case "progressive_scroll":
            e = this.page === 1 ? e.data : this.table.rowManager.getData().concat(e.data), this.table.rowManager.setData(e, this.page !== 1, this.page == 1), t = this.table.options.progressiveLoadScrollMargin || this.table.rowManager.element.clientHeight * 2, this.table.rowManager.element.scrollHeight <= this.table.rowManager.element.clientHeight + t && this.page < this.max && setTimeout(() => {
              this.nextPage();
            });
            break;
        }
        return !1;
      } else {
        if (this.page > this.max && (console.warn("Remote Pagination Error - Server returned last page value lower than the current page"), i = this.options("paginationOutOfRange"), i))
          return this.setPage(typeof i == "function" ? i.call(this, this.page, this.max) : i);
        this.dispatchExternal("pageLoaded", this.getPage());
      }
    else
      console.warn("Remote Pagination Error - Server response missing '" + (this.options("dataReceiveParams").data || "data") + "' property");
    return e.data;
  }
  //handle the footer element being redrawn
  footerRedraw() {
    var e = this.table.footerManager.containerElement;
    Math.ceil(e.clientWidth) - e.scrollWidth < 0 ? this.pagesElement.style.display = "none" : (this.pagesElement.style.display = "", Math.ceil(e.clientWidth) - e.scrollWidth < 0 && (this.pagesElement.style.display = "none"));
  }
};
C(si, "moduleName", "page"), //load defaults
C(si, "pageCounters", rh);
let Vs = si;
var ah = {
  local: function(o, e) {
    var t = localStorage.getItem(o + "-" + e);
    return t ? JSON.parse(t) : !1;
  },
  cookie: function(o, e) {
    var t = document.cookie, i = o + "-" + e, s = t.indexOf(i + "="), n, r;
    return s > -1 && (t = t.slice(s), n = t.indexOf(";"), n > -1 && (t = t.slice(0, n)), r = t.replace(i + "=", "")), r ? JSON.parse(r) : !1;
  }
}, lh = {
  local: function(o, e, t) {
    localStorage.setItem(o + "-" + e, JSON.stringify(t));
  },
  cookie: function(o, e, t) {
    var i = /* @__PURE__ */ new Date();
    i.setDate(i.getDate() + 1e4), document.cookie = o + "-" + e + "=" + JSON.stringify(t) + "; expires=" + i.toUTCString();
  }
};
const ce = class ce extends A {
  constructor(e) {
    super(e), this.mode = "", this.id = "", this.defWatcherBlock = !1, this.config = {}, this.readFunc = !1, this.writeFunc = !1, this.registerTableOption("persistence", !1), this.registerTableOption("persistenceID", ""), this.registerTableOption("persistenceMode", !0), this.registerTableOption("persistenceReaderFunc", !1), this.registerTableOption("persistenceWriterFunc", !1);
  }
  // Test for whether localStorage is available for use.
  localStorageTest() {
    var e = "_tabulator_test";
    try {
      return window.localStorage.setItem(e, e), window.localStorage.removeItem(e), !0;
    } catch {
      return !1;
    }
  }
  //setup parameters
  initialize() {
    if (this.table.options.persistence) {
      var e = this.table.options.persistenceMode, t = this.table.options.persistenceID, i;
      this.mode = e !== !0 ? e : this.localStorageTest() ? "local" : "cookie", this.table.options.persistenceReaderFunc ? typeof this.table.options.persistenceReaderFunc == "function" ? this.readFunc = this.table.options.persistenceReaderFunc : ce.readers[this.table.options.persistenceReaderFunc] ? this.readFunc = ce.readers[this.table.options.persistenceReaderFunc] : console.warn("Persistence Read Error - invalid reader set", this.table.options.persistenceReaderFunc) : ce.readers[this.mode] ? this.readFunc = ce.readers[this.mode] : console.warn("Persistence Read Error - invalid reader set", this.mode), this.table.options.persistenceWriterFunc ? typeof this.table.options.persistenceWriterFunc == "function" ? this.writeFunc = this.table.options.persistenceWriterFunc : ce.writers[this.table.options.persistenceWriterFunc] ? this.writeFunc = ce.writers[this.table.options.persistenceWriterFunc] : console.warn("Persistence Write Error - invalid reader set", this.table.options.persistenceWriterFunc) : ce.writers[this.mode] ? this.writeFunc = ce.writers[this.mode] : console.warn("Persistence Write Error - invalid writer set", this.mode), this.id = "tabulator-" + (t || this.table.element.getAttribute("id") || ""), this.config = {
        sort: this.table.options.persistence === !0 || this.table.options.persistence.sort,
        filter: this.table.options.persistence === !0 || this.table.options.persistence.filter,
        headerFilter: this.table.options.persistence === !0 || this.table.options.persistence.headerFilter,
        group: this.table.options.persistence === !0 || this.table.options.persistence.group,
        page: this.table.options.persistence === !0 || this.table.options.persistence.page,
        columns: this.table.options.persistence === !0 ? ["title", "width", "visible"] : this.table.options.persistence.columns
      }, this.config.page && (i = this.retrieveData("page"), i && (typeof i.paginationSize < "u" && (this.config.page === !0 || this.config.page.size) && (this.table.options.paginationSize = i.paginationSize), typeof i.paginationInitialPage < "u" && (this.config.page === !0 || this.config.page.page) && (this.table.options.paginationInitialPage = i.paginationInitialPage))), this.config.group && (i = this.retrieveData("group"), i && (typeof i.groupBy < "u" && (this.config.group === !0 || this.config.group.groupBy) && (this.table.options.groupBy = i.groupBy), typeof i.groupStartOpen < "u" && (this.config.group === !0 || this.config.group.groupStartOpen) && (this.table.options.groupStartOpen = i.groupStartOpen), typeof i.groupHeader < "u" && (this.config.group === !0 || this.config.group.groupHeader) && (this.table.options.groupHeader = i.groupHeader))), this.config.columns && (this.table.options.columns = this.load("columns", this.table.options.columns), this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("column-show", this.save.bind(this, "columns")), this.subscribe("column-hide", this.save.bind(this, "columns")), this.subscribe("column-moved", this.save.bind(this, "columns"))), this.subscribe("table-built", this.tableBuilt.bind(this), 0), this.subscribe("table-redraw", this.tableRedraw.bind(this)), this.subscribe("filter-changed", this.eventSave.bind(this, "filter")), this.subscribe("filter-changed", this.eventSave.bind(this, "headerFilter")), this.subscribe("sort-changed", this.eventSave.bind(this, "sort")), this.subscribe("group-changed", this.eventSave.bind(this, "group")), this.subscribe("page-changed", this.eventSave.bind(this, "page")), this.subscribe("column-resized", this.eventSave.bind(this, "columns")), this.subscribe("column-width", this.eventSave.bind(this, "columns")), this.subscribe("layout-refreshed", this.eventSave.bind(this, "columns"));
    }
    this.registerTableFunction("getColumnLayout", this.getColumnLayout.bind(this)), this.registerTableFunction("setColumnLayout", this.setColumnLayout.bind(this));
  }
  eventSave(e) {
    this.config[e] && this.save(e);
  }
  tableBuilt() {
    var e, t, i;
    this.config.sort && (e = this.load("sort"), e && (this.table.options.initialSort = e)), this.config.filter && (t = this.load("filter"), t && (this.table.options.initialFilter = t)), this.config.headerFilter && (i = this.load("headerFilter"), i && (this.table.options.initialHeaderFilter = i));
  }
  tableRedraw(e) {
    e && this.config.columns && this.save("columns");
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  getColumnLayout() {
    return this.parseColumns(this.table.columnManager.getColumns());
  }
  setColumnLayout(e) {
    return this.table.columnManager.setColumns(this.mergeDefinition(this.table.options.columns, e, !0)), !0;
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  initializeColumn(e) {
    var t, i;
    this.config.columns && (this.defWatcherBlock = !0, t = e.getDefinition(), i = this.config.columns === !0 ? Object.keys(t) : this.config.columns, i.forEach((s) => {
      var n = Object.getOwnPropertyDescriptor(t, s), r = t[s];
      n && Object.defineProperty(t, s, {
        set: (a) => {
          r = a, this.defWatcherBlock || this.save("columns"), n.set && n.set(a);
        },
        get: () => (n.get && n.get(), r)
      });
    }), this.defWatcherBlock = !1);
  }
  //load saved definitions
  load(e, t) {
    var i = this.retrieveData(e);
    return t && (i = i ? this.mergeDefinition(t, i) : t), i;
  }
  //retrieve data from memory
  retrieveData(e) {
    return this.readFunc ? this.readFunc(this.id, e) : !1;
  }
  //merge old and new column definitions
  mergeDefinition(e, t, i) {
    var s = [];
    return t = t || [], t.forEach((n, r) => {
      var a = this._findColumn(e, n), l;
      a && (i ? l = Object.keys(n) : this.config.columns === !0 || this.config.columns == null ? (l = Object.keys(a), l.push("width")) : l = this.config.columns, l.forEach((h) => {
        h !== "columns" && typeof n[h] < "u" && (a[h] = n[h]);
      }), a.columns && (a.columns = this.mergeDefinition(a.columns, n.columns)), s.push(a));
    }), e.forEach((n, r) => {
      var a = this._findColumn(t, n);
      a || (s.length > r ? s.splice(r, 0, n) : s.push(n));
    }), s;
  }
  //find matching columns
  _findColumn(e, t) {
    var i = t.columns ? "group" : t.field ? "field" : "object";
    return e.find(function(s) {
      switch (i) {
        case "group":
          return s.title === t.title && s.columns.length === t.columns.length;
        case "field":
          return s.field === t.field;
        case "object":
          return s === t;
      }
    });
  }
  //save data
  save(e) {
    var t = {};
    switch (e) {
      case "columns":
        t = this.parseColumns(this.table.columnManager.getColumns());
        break;
      case "filter":
        t = this.table.modules.filter.getFilters();
        break;
      case "headerFilter":
        t = this.table.modules.filter.getHeaderFilters();
        break;
      case "sort":
        t = this.validateSorters(this.table.modules.sort.getSort());
        break;
      case "group":
        t = this.getGroupConfig();
        break;
      case "page":
        t = this.getPageConfig();
        break;
    }
    this.writeFunc && this.writeFunc(this.id, e, t);
  }
  //ensure sorters contain no function data
  validateSorters(e) {
    return e.forEach(function(t) {
      t.column = t.field, delete t.field;
    }), e;
  }
  getGroupConfig() {
    var e = {};
    return this.config.group && ((this.config.group === !0 || this.config.group.groupBy) && (e.groupBy = this.table.options.groupBy), (this.config.group === !0 || this.config.group.groupStartOpen) && (e.groupStartOpen = this.table.options.groupStartOpen), (this.config.group === !0 || this.config.group.groupHeader) && (e.groupHeader = this.table.options.groupHeader)), e;
  }
  getPageConfig() {
    var e = {};
    return this.config.page && ((this.config.page === !0 || this.config.page.size) && (e.paginationSize = this.table.modules.page.getPageSize()), (this.config.page === !0 || this.config.page.page) && (e.paginationInitialPage = this.table.modules.page.getPage())), e;
  }
  //parse columns for data to store
  parseColumns(e) {
    var t = [], i = ["headerContextMenu", "headerMenu", "contextMenu", "clickMenu"];
    return e.forEach((s) => {
      var n = {}, r = s.getDefinition(), a;
      s.isGroup ? (n.title = r.title, n.columns = this.parseColumns(s.getColumns())) : (n.field = s.getField(), this.config.columns === !0 || this.config.columns == null ? (a = Object.keys(r), a.push("width"), a.push("visible")) : a = this.config.columns, a.forEach((l) => {
        switch (l) {
          case "width":
            n.width = s.getWidth();
            break;
          case "visible":
            n.visible = s.visible;
            break;
          default:
            typeof r[l] != "function" && i.indexOf(l) === -1 && (n[l] = r[l]);
        }
      })), t.push(n);
    }), t;
  }
};
C(ce, "moduleName", "persistence"), C(ce, "moduleInitOrder", -10), //load defaults
C(ce, "readers", ah), C(ce, "writers", lh);
let Ns = ce;
class mr extends A {
  constructor(e) {
    super(e), this.columnSubscribers = {}, this.registerTableOption("rowContextPopup", !1), this.registerTableOption("rowClickPopup", !1), this.registerTableOption("rowDblClickPopup", !1), this.registerTableOption("groupContextPopup", !1), this.registerTableOption("groupClickPopup", !1), this.registerTableOption("groupDblClickPopup", !1), this.registerColumnOption("headerContextPopup"), this.registerColumnOption("headerClickPopup"), this.registerColumnOption("headerDblClickPopup"), this.registerColumnOption("headerPopup"), this.registerColumnOption("headerPopupIcon"), this.registerColumnOption("contextPopup"), this.registerColumnOption("clickPopup"), this.registerColumnOption("dblClickPopup"), this.registerComponentFunction("cell", "popup", this._componentPopupCall.bind(this)), this.registerComponentFunction("column", "popup", this._componentPopupCall.bind(this)), this.registerComponentFunction("row", "popup", this._componentPopupCall.bind(this)), this.registerComponentFunction("group", "popup", this._componentPopupCall.bind(this));
  }
  initialize() {
    this.initializeRowWatchers(), this.initializeGroupWatchers(), this.subscribe("column-init", this.initializeColumn.bind(this));
  }
  _componentPopupCall(e, t, i) {
    this.loadPopupEvent(t, null, e, i);
  }
  initializeRowWatchers() {
    this.table.options.rowContextPopup && (this.subscribe("row-contextmenu", this.loadPopupEvent.bind(this, this.table.options.rowContextPopup)), this.table.on("rowTapHold", this.loadPopupEvent.bind(this, this.table.options.rowContextPopup))), this.table.options.rowClickPopup && this.subscribe("row-click", this.loadPopupEvent.bind(this, this.table.options.rowClickPopup)), this.table.options.rowDblClickPopup && this.subscribe("row-dblclick", this.loadPopupEvent.bind(this, this.table.options.rowDblClickPopup));
  }
  initializeGroupWatchers() {
    this.table.options.groupContextPopup && (this.subscribe("group-contextmenu", this.loadPopupEvent.bind(this, this.table.options.groupContextPopup)), this.table.on("groupTapHold", this.loadPopupEvent.bind(this, this.table.options.groupContextPopup))), this.table.options.groupClickPopup && this.subscribe("group-click", this.loadPopupEvent.bind(this, this.table.options.groupClickPopup)), this.table.options.groupDblClickPopup && this.subscribe("group-dblclick", this.loadPopupEvent.bind(this, this.table.options.groupDblClickPopup));
  }
  initializeColumn(e) {
    var t = e.definition;
    t.headerContextPopup && !this.columnSubscribers.headerContextPopup && (this.columnSubscribers.headerContextPopup = this.loadPopupTableColumnEvent.bind(this, "headerContextPopup"), this.subscribe("column-contextmenu", this.columnSubscribers.headerContextPopup), this.table.on("headerTapHold", this.loadPopupTableColumnEvent.bind(this, "headerContextPopup"))), t.headerClickPopup && !this.columnSubscribers.headerClickPopup && (this.columnSubscribers.headerClickPopup = this.loadPopupTableColumnEvent.bind(this, "headerClickPopup"), this.subscribe("column-click", this.columnSubscribers.headerClickPopup)), t.headerDblClickPopup && !this.columnSubscribers.headerDblClickPopup && (this.columnSubscribers.headerDblClickPopup = this.loadPopupTableColumnEvent.bind(this, "headerDblClickPopup"), this.subscribe("column-dblclick", this.columnSubscribers.headerDblClickPopup)), t.headerPopup && this.initializeColumnHeaderPopup(e), t.contextPopup && !this.columnSubscribers.contextPopup && (this.columnSubscribers.contextPopup = this.loadPopupTableCellEvent.bind(this, "contextPopup"), this.subscribe("cell-contextmenu", this.columnSubscribers.contextPopup), this.table.on("cellTapHold", this.loadPopupTableCellEvent.bind(this, "contextPopup"))), t.clickPopup && !this.columnSubscribers.clickPopup && (this.columnSubscribers.clickPopup = this.loadPopupTableCellEvent.bind(this, "clickPopup"), this.subscribe("cell-click", this.columnSubscribers.clickPopup)), t.dblClickPopup && !this.columnSubscribers.dblClickPopup && (this.columnSubscribers.dblClickPopup = this.loadPopupTableCellEvent.bind(this, "dblClickPopup"), this.subscribe("cell-click", this.columnSubscribers.dblClickPopup));
  }
  initializeColumnHeaderPopup(e) {
    var t = e.definition.headerPopupIcon, i;
    i = document.createElement("span"), i.classList.add("tabulator-header-popup-button"), t ? (typeof t == "function" && (t = t(e.getComponent())), t instanceof HTMLElement ? i.appendChild(t) : i.innerHTML = t) : i.innerHTML = "&vellip;", i.addEventListener("click", (s) => {
      s.stopPropagation(), s.preventDefault(), this.loadPopupEvent(e.definition.headerPopup, s, e);
    }), e.titleElement.insertBefore(i, e.titleElement.firstChild);
  }
  loadPopupTableCellEvent(e, t, i) {
    i._cell && (i = i._cell), i.column.definition[e] && this.loadPopupEvent(i.column.definition[e], t, i);
  }
  loadPopupTableColumnEvent(e, t, i) {
    i._column && (i = i._column), i.definition[e] && this.loadPopupEvent(i.definition[e], t, i);
  }
  loadPopupEvent(e, t, i, s) {
    var n;
    function r(a) {
      n = a;
    }
    i._group ? i = i._group : i._row && (i = i._row), e = typeof e == "function" ? e.call(this.table, t, i.getComponent(), r) : e, this.loadPopup(t, i, e, n, s);
  }
  loadPopup(e, t, i, s, n) {
    var r = !(e instanceof MouseEvent), a, l;
    i instanceof HTMLElement ? a = i : (a = document.createElement("div"), a.innerHTML = i), a.classList.add("tabulator-popup"), a.addEventListener("click", (h) => {
      h.stopPropagation();
    }), r || e.preventDefault(), l = this.popup(a), typeof s == "function" && l.renderCallback(s), e ? l.show(e) : l.show(t.getElement(), n || "center"), l.hideOnBlur(() => {
      this.dispatchExternal("popupClosed", t.getComponent());
    }), this.dispatchExternal("popupOpened", t.getComponent());
  }
}
C(mr, "moduleName", "popup");
class br extends A {
  constructor(e) {
    super(e), this.element = !1, this.manualBlock = !1, this.beforeprintEventHandler = null, this.afterprintEventHandler = null, this.registerTableOption("printAsHtml", !1), this.registerTableOption("printFormatter", !1), this.registerTableOption("printHeader", !1), this.registerTableOption("printFooter", !1), this.registerTableOption("printStyled", !0), this.registerTableOption("printRowRange", "visible"), this.registerTableOption("printConfig", {}), this.registerColumnOption("print"), this.registerColumnOption("titlePrint");
  }
  initialize() {
    this.table.options.printAsHtml && (this.beforeprintEventHandler = this.replaceTable.bind(this), this.afterprintEventHandler = this.cleanup.bind(this), window.addEventListener("beforeprint", this.beforeprintEventHandler), window.addEventListener("afterprint", this.afterprintEventHandler), this.subscribe("table-destroy", this.destroy.bind(this))), this.registerTableFunction("print", this.printFullscreen.bind(this));
  }
  destroy() {
    this.table.options.printAsHtml && (window.removeEventListener("beforeprint", this.beforeprintEventHandler), window.removeEventListener("afterprint", this.afterprintEventHandler));
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  replaceTable() {
    this.manualBlock || (this.element = document.createElement("div"), this.element.classList.add("tabulator-print-table"), this.element.appendChild(this.table.modules.export.generateTable(this.table.options.printConfig, this.table.options.printStyled, this.table.options.printRowRange, "print")), this.table.element.style.display = "none", this.table.element.parentNode.insertBefore(this.element, this.table.element));
  }
  cleanup() {
    document.body.classList.remove("tabulator-print-fullscreen-hide"), this.element && this.element.parentNode && (this.element.parentNode.removeChild(this.element), this.table.element.style.display = "");
  }
  printFullscreen(e, t, i) {
    var s = window.scrollX, n = window.scrollY, r = document.createElement("div"), a = document.createElement("div"), l = this.table.modules.export.generateTable(typeof i < "u" ? i : this.table.options.printConfig, typeof t < "u" ? t : this.table.options.printStyled, e || this.table.options.printRowRange, "print"), h, d;
    this.manualBlock = !0, this.element = document.createElement("div"), this.element.classList.add("tabulator-print-fullscreen"), this.table.options.printHeader && (r.classList.add("tabulator-print-header"), h = typeof this.table.options.printHeader == "function" ? this.table.options.printHeader.call(this.table) : this.table.options.printHeader, typeof h == "string" ? r.innerHTML = h : r.appendChild(h), this.element.appendChild(r)), this.element.appendChild(l), this.table.options.printFooter && (a.classList.add("tabulator-print-footer"), d = typeof this.table.options.printFooter == "function" ? this.table.options.printFooter.call(this.table) : this.table.options.printFooter, typeof d == "string" ? a.innerHTML = d : a.appendChild(d), this.element.appendChild(a)), document.body.classList.add("tabulator-print-fullscreen-hide"), document.body.appendChild(this.element), this.table.options.printFormatter && this.table.options.printFormatter(this.element, l), window.print(), this.cleanup(), window.scrollTo(s, n), this.manualBlock = !1;
  }
}
C(br, "moduleName", "print");
class vr extends A {
  constructor(e) {
    super(e), this.data = !1, this.blocked = !1, this.origFuncs = {}, this.currentVersion = 0, this.registerTableOption("reactiveData", !1);
  }
  initialize() {
    this.table.options.reactiveData && (this.subscribe("cell-value-save-before", this.block.bind(this, "cellsave")), this.subscribe("cell-value-save-after", this.unblock.bind(this, "cellsave")), this.subscribe("row-data-save-before", this.block.bind(this, "rowsave")), this.subscribe("row-data-save-after", this.unblock.bind(this, "rowsave")), this.subscribe("row-data-init-after", this.watchRow.bind(this)), this.subscribe("data-processing", this.watchData.bind(this)), this.subscribe("table-destroy", this.unwatchData.bind(this)));
  }
  watchData(e) {
    var t = this, i;
    this.currentVersion++, i = this.currentVersion, this.unwatchData(), this.data = e, this.origFuncs.push = e.push, Object.defineProperty(this.data, "push", {
      enumerable: !1,
      configurable: !0,
      value: function() {
        var s = Array.from(arguments), n;
        return !t.blocked && i === t.currentVersion && (t.block("data-push"), s.forEach((r) => {
          t.table.rowManager.addRowActual(r, !1);
        }), n = t.origFuncs.push.apply(e, arguments), t.unblock("data-push")), n;
      }
    }), this.origFuncs.unshift = e.unshift, Object.defineProperty(this.data, "unshift", {
      enumerable: !1,
      configurable: !0,
      value: function() {
        var s = Array.from(arguments), n;
        return !t.blocked && i === t.currentVersion && (t.block("data-unshift"), s.forEach((r) => {
          t.table.rowManager.addRowActual(r, !0);
        }), n = t.origFuncs.unshift.apply(e, arguments), t.unblock("data-unshift")), n;
      }
    }), this.origFuncs.shift = e.shift, Object.defineProperty(this.data, "shift", {
      enumerable: !1,
      configurable: !0,
      value: function() {
        var s, n;
        return !t.blocked && i === t.currentVersion && (t.block("data-shift"), t.data.length && (s = t.table.rowManager.getRowFromDataObject(t.data[0]), s && s.deleteActual()), n = t.origFuncs.shift.call(e), t.unblock("data-shift")), n;
      }
    }), this.origFuncs.pop = e.pop, Object.defineProperty(this.data, "pop", {
      enumerable: !1,
      configurable: !0,
      value: function() {
        var s, n;
        return !t.blocked && i === t.currentVersion && (t.block("data-pop"), t.data.length && (s = t.table.rowManager.getRowFromDataObject(t.data[t.data.length - 1]), s && s.deleteActual()), n = t.origFuncs.pop.call(e), t.unblock("data-pop")), n;
      }
    }), this.origFuncs.splice = e.splice, Object.defineProperty(this.data, "splice", {
      enumerable: !1,
      configurable: !0,
      value: function() {
        var s = Array.from(arguments), n = s[0] < 0 ? e.length + s[0] : s[0], r = s[1], a = s[2] ? s.slice(2) : !1, l, h;
        if (!t.blocked && i === t.currentVersion) {
          if (t.block("data-splice"), a && (l = e[n] ? t.table.rowManager.getRowFromDataObject(e[n]) : !1, l ? a.forEach((c) => {
            t.table.rowManager.addRowActual(c, !0, l, !0);
          }) : (a = a.slice().reverse(), a.forEach((c) => {
            t.table.rowManager.addRowActual(c, !0, !1, !0);
          }))), r !== 0) {
            var d = e.slice(n, typeof s[1] > "u" ? s[1] : n + r);
            d.forEach((c, u) => {
              var f = t.table.rowManager.getRowFromDataObject(c);
              f && f.deleteActual(u !== d.length - 1);
            });
          }
          (a || r !== 0) && t.table.rowManager.reRenderInPosition(), h = t.origFuncs.splice.apply(e, arguments), t.unblock("data-splice");
        }
        return h;
      }
    });
  }
  unwatchData() {
    if (this.data !== !1)
      for (var e in this.origFuncs)
        Object.defineProperty(this.data, e, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: this.origFuncs.key
        });
  }
  watchRow(e) {
    var t = e.getData();
    for (var i in t)
      this.watchKey(e, t, i);
    this.table.options.dataTree && this.watchTreeChildren(e);
  }
  watchTreeChildren(e) {
    var t = this, i = e.getData()[this.table.options.dataTreeChildField], s = {};
    i && (s.push = i.push, Object.defineProperty(i, "push", {
      enumerable: !1,
      configurable: !0,
      value: () => {
        if (!t.blocked) {
          t.block("tree-push");
          var n = s.push.apply(i, arguments);
          this.rebuildTree(e), t.unblock("tree-push");
        }
        return n;
      }
    }), s.unshift = i.unshift, Object.defineProperty(i, "unshift", {
      enumerable: !1,
      configurable: !0,
      value: () => {
        if (!t.blocked) {
          t.block("tree-unshift");
          var n = s.unshift.apply(i, arguments);
          this.rebuildTree(e), t.unblock("tree-unshift");
        }
        return n;
      }
    }), s.shift = i.shift, Object.defineProperty(i, "shift", {
      enumerable: !1,
      configurable: !0,
      value: () => {
        if (!t.blocked) {
          t.block("tree-shift");
          var n = s.shift.call(i);
          this.rebuildTree(e), t.unblock("tree-shift");
        }
        return n;
      }
    }), s.pop = i.pop, Object.defineProperty(i, "pop", {
      enumerable: !1,
      configurable: !0,
      value: () => {
        if (!t.blocked) {
          t.block("tree-pop");
          var n = s.pop.call(i);
          this.rebuildTree(e), t.unblock("tree-pop");
        }
        return n;
      }
    }), s.splice = i.splice, Object.defineProperty(i, "splice", {
      enumerable: !1,
      configurable: !0,
      value: () => {
        if (!t.blocked) {
          t.block("tree-splice");
          var n = s.splice.apply(i, arguments);
          this.rebuildTree(e), t.unblock("tree-splice");
        }
        return n;
      }
    }));
  }
  rebuildTree(e) {
    this.table.modules.dataTree.initializeRow(e), this.table.modules.dataTree.layoutRow(e), this.table.rowManager.refreshActiveData("tree", !1, !0);
  }
  watchKey(e, t, i) {
    var s = this, n = Object.getOwnPropertyDescriptor(t, i), r = t[i], a = this.currentVersion;
    Object.defineProperty(t, i, {
      set: (l) => {
        if (r = l, !s.blocked && a === s.currentVersion) {
          s.block("key");
          var h = {};
          h[i] = l, e.updateData(h), s.unblock("key");
        }
        n.set && n.set(l);
      },
      get: () => (n.get && n.get(), r)
    });
  }
  unwatchRow(e) {
    var t = e.getData();
    for (var i in t)
      Object.defineProperty(t, i, {
        value: t[i]
      });
  }
  block(e) {
    this.blocked || (this.blocked = e);
  }
  unblock(e) {
    this.blocked === e && (this.blocked = !1);
  }
}
C(vr, "moduleName", "reactiveData");
class wr extends A {
  constructor(e) {
    super(e), this.startColumn = !1, this.startX = !1, this.startWidth = !1, this.latestX = !1, this.handle = null, this.initialNextColumn = null, this.nextColumn = null, this.initialized = !1, this.registerColumnOption("resizable", !0), this.registerTableOption("resizableColumnFit", !1), this.registerTableOption("resizableColumnGuide", !1);
  }
  initialize() {
    this.subscribe("column-rendered", this.layoutColumnHeader.bind(this));
  }
  initializeEventWatchers() {
    this.initialized || (this.subscribe("cell-rendered", this.layoutCellHandles.bind(this)), this.subscribe("cell-delete", this.deInitializeComponent.bind(this)), this.subscribe("cell-height", this.resizeHandle.bind(this)), this.subscribe("column-moved", this.columnLayoutUpdated.bind(this)), this.subscribe("column-hide", this.deInitializeColumn.bind(this)), this.subscribe("column-show", this.columnLayoutUpdated.bind(this)), this.subscribe("column-width", this.columnWidthUpdated.bind(this)), this.subscribe("column-delete", this.deInitializeComponent.bind(this)), this.subscribe("column-height", this.resizeHandle.bind(this)), this.initialized = !0);
  }
  layoutCellHandles(e) {
    e.row.type === "row" && (this.deInitializeComponent(e), this.initializeColumn("cell", e, e.column, e.element));
  }
  layoutColumnHeader(e) {
    e.definition.resizable && (this.initializeEventWatchers(), this.deInitializeComponent(e), this.initializeColumn("header", e, e, e.element));
  }
  columnLayoutUpdated(e) {
    var t = e.prevColumn();
    this.reinitializeColumn(e), t && this.reinitializeColumn(t);
  }
  columnWidthUpdated(e) {
    e.modules.frozen && (this.table.modules.frozenColumns.leftColumns.includes(e) ? this.table.modules.frozenColumns.leftColumns.forEach((t) => {
      this.reinitializeColumn(t);
    }) : this.table.modules.frozenColumns.rightColumns.includes(e) && this.table.modules.frozenColumns.rightColumns.forEach((t) => {
      this.reinitializeColumn(t);
    }));
  }
  frozenColumnOffset(e) {
    var t = !1;
    return e.modules.frozen && (t = e.modules.frozen.marginValue, e.modules.frozen.position === "left" ? t += e.getWidth() - 3 : t && (t -= 3)), t !== !1 ? t + "px" : !1;
  }
  reinitializeColumn(e) {
    var t = this.frozenColumnOffset(e);
    e.cells.forEach((i) => {
      i.modules.resize && i.modules.resize.handleEl && (t && (i.modules.resize.handleEl.style[e.modules.frozen.position] = t, i.modules.resize.handleEl.style["z-index"] = 11), i.element.after(i.modules.resize.handleEl));
    }), e.modules.resize && e.modules.resize.handleEl && (t && (e.modules.resize.handleEl.style[e.modules.frozen.position] = t), e.element.after(e.modules.resize.handleEl));
  }
  initializeColumn(e, t, i, s) {
    var n = this, r = !1, a = i.definition.resizable, l = {}, h = i.getLastColumn();
    if (e === "header" && (r = i.definition.formatter == "textarea" || i.definition.variableHeight, l = { variableHeight: r }), (a === !0 || a == e) && this._checkResizability(h)) {
      var d = document.createElement("span");
      d.className = "tabulator-col-resize-handle", d.addEventListener("click", function(u) {
        u.stopPropagation();
      });
      var c = function(u) {
        n.startColumn = i, n.initialNextColumn = n.nextColumn = h.nextColumn(), n._mouseDown(u, h, d);
      };
      d.addEventListener("mousedown", c), d.addEventListener("touchstart", c, { passive: !0 }), d.addEventListener("dblclick", (u) => {
        var f = h.getWidth();
        u.stopPropagation(), h.reinitializeWidth(!0), f !== h.getWidth() && (n.dispatch("column-resized", h), n.dispatchExternal("columnResized", h.getComponent()));
      }), i.modules.frozen && (d.style.position = "sticky", d.style[i.modules.frozen.position] = this.frozenColumnOffset(i)), l.handleEl = d, s.parentNode && i.visible && s.after(d);
    }
    t.modules.resize = l;
  }
  deInitializeColumn(e) {
    this.deInitializeComponent(e), e.cells.forEach((t) => {
      this.deInitializeComponent(t);
    });
  }
  deInitializeComponent(e) {
    var t;
    e.modules.resize && (t = e.modules.resize.handleEl, t && t.parentElement && t.parentElement.removeChild(t));
  }
  resizeHandle(e, t) {
    e.modules.resize && e.modules.resize.handleEl && (e.modules.resize.handleEl.style.height = t);
  }
  resize(e, t) {
    var i = typeof e.clientX > "u" ? e.touches[0].clientX : e.clientX, s = i - this.startX, n = i - this.latestX, r, a;
    if (this.latestX = i, this.table.rtl && (s = -s, n = -n), r = t.width == t.minWidth || t.width == t.maxWidth, t.setWidth(this.startWidth + s), a = t.width == t.minWidth || t.width == t.maxWidth, n < 0 && (this.nextColumn = this.initialNextColumn), this.table.options.resizableColumnFit && this.nextColumn && !(r && a)) {
      let l = this.nextColumn.getWidth();
      n > 0 && l <= this.nextColumn.minWidth && (this.nextColumn = this.nextColumn.nextColumn()), this.nextColumn && this.nextColumn.setWidth(this.nextColumn.getWidth() - n);
    }
    this.table.columnManager.rerenderColumns(!0), !this.table.browserSlow && t.modules.resize && t.modules.resize.variableHeight && t.checkCellHeights();
  }
  calcGuidePosition(e, t, i) {
    var s = typeof e.clientX > "u" ? e.touches[0].clientX : e.clientX, n = i.getBoundingClientRect().x - this.table.element.getBoundingClientRect().x, r = this.table.element.getBoundingClientRect().x, a = t.element.getBoundingClientRect().left - r, l = s - this.startX, h = Math.max(n + l, a + t.minWidth);
    return t.maxWidth && (h = Math.min(h, a + t.maxWidth)), h;
  }
  _checkResizability(e) {
    return e.definition.resizable;
  }
  _mouseDown(e, t, i) {
    var s = this, n;
    this.dispatchExternal("columnResizing", t.getComponent()), s.table.options.resizableColumnGuide && (n = document.createElement("span"), n.classList.add("tabulator-col-resize-guide"), s.table.element.appendChild(n), setTimeout(() => {
      n.style.left = s.calcGuidePosition(e, t, i) + "px";
    })), s.table.element.classList.add("tabulator-block-select");
    function r(l) {
      s.table.options.resizableColumnGuide ? n.style.left = s.calcGuidePosition(l, t, i) + "px" : s.resize(l, t);
    }
    function a(l) {
      s.table.options.resizableColumnGuide && (s.resize(l, t), n.remove()), s.startColumn.modules.edit && (s.startColumn.modules.edit.blocked = !1), s.table.browserSlow && t.modules.resize && t.modules.resize.variableHeight && t.checkCellHeights(), document.body.removeEventListener("mouseup", a), document.body.removeEventListener("mousemove", r), i.removeEventListener("touchmove", r), i.removeEventListener("touchend", a), s.table.element.classList.remove("tabulator-block-select"), s.startWidth !== t.getWidth() && (s.table.columnManager.verticalAlignHeaders(), s.dispatch("column-resized", t), s.dispatchExternal("columnResized", t.getComponent()));
    }
    e.stopPropagation(), s.startColumn.modules.edit && (s.startColumn.modules.edit.blocked = !0), s.startX = typeof e.clientX > "u" ? e.touches[0].clientX : e.clientX, s.latestX = s.startX, s.startWidth = t.getWidth(), document.body.addEventListener("mousemove", r), document.body.addEventListener("mouseup", a), i.addEventListener("touchmove", r, { passive: !0 }), i.addEventListener("touchend", a);
  }
}
C(wr, "moduleName", "resizeColumns");
class yr extends A {
  constructor(e) {
    super(e), this.startColumn = !1, this.startY = !1, this.startHeight = !1, this.handle = null, this.prevHandle = null, this.registerTableOption("resizableRows", !1), this.registerTableOption("resizableRowGuide", !1);
  }
  initialize() {
    this.table.options.resizableRows && this.subscribe("row-layout-after", this.initializeRow.bind(this));
  }
  initializeRow(e) {
    var t = this, i = e.getElement(), s = document.createElement("div");
    s.className = "tabulator-row-resize-handle";
    var n = document.createElement("div");
    n.className = "tabulator-row-resize-handle prev", s.addEventListener("click", function(l) {
      l.stopPropagation();
    });
    var r = function(l) {
      t.startRow = e, t._mouseDown(l, e, s);
    };
    s.addEventListener("mousedown", r), s.addEventListener("touchstart", r, { passive: !0 }), n.addEventListener("click", function(l) {
      l.stopPropagation();
    });
    var a = function(l) {
      var h = t.table.rowManager.prevDisplayRow(e);
      h && (t.startRow = h, t._mouseDown(l, h, n));
    };
    n.addEventListener("mousedown", a), n.addEventListener("touchstart", a, { passive: !0 }), i.appendChild(s), i.appendChild(n);
  }
  resize(e, t) {
    t.setHeight(this.startHeight + ((typeof e.screenY > "u" ? e.touches[0].screenY : e.screenY) - this.startY));
  }
  calcGuidePosition(e, t, i) {
    var s = typeof e.screenY > "u" ? e.touches[0].screenY : e.screenY, n = i.getBoundingClientRect().y - this.table.element.getBoundingClientRect().y, r = this.table.element.getBoundingClientRect().y, a = t.element.getBoundingClientRect().top - r, l = s - this.startY;
    return Math.max(n + l, a);
  }
  _mouseDown(e, t, i) {
    var s = this, n;
    s.dispatchExternal("rowResizing", t.getComponent()), s.table.options.resizableRowGuide && (n = document.createElement("span"), n.classList.add("tabulator-row-resize-guide"), s.table.element.appendChild(n), setTimeout(() => {
      n.style.top = s.calcGuidePosition(e, t, i) + "px";
    })), s.table.element.classList.add("tabulator-block-select");
    function r(l) {
      s.table.options.resizableRowGuide ? n.style.top = s.calcGuidePosition(l, t, i) + "px" : s.resize(l, t);
    }
    function a(l) {
      s.table.options.resizableRowGuide && (s.resize(l, t), n.remove()), document.body.removeEventListener("mouseup", r), document.body.removeEventListener("mousemove", r), i.removeEventListener("touchmove", r), i.removeEventListener("touchend", a), s.table.element.classList.remove("tabulator-block-select"), s.dispatchExternal("rowResized", t.getComponent());
    }
    e.stopPropagation(), s.startY = typeof e.screenY > "u" ? e.touches[0].screenY : e.screenY, s.startHeight = t.getHeight(), document.body.addEventListener("mousemove", r), document.body.addEventListener("mouseup", a), i.addEventListener("touchmove", r, { passive: !0 }), i.addEventListener("touchend", a);
  }
}
C(yr, "moduleName", "resizeRows");
class Cr extends A {
  constructor(e) {
    super(e), this.binding = !1, this.visibilityObserver = !1, this.resizeObserver = !1, this.containerObserver = !1, this.tableHeight = 0, this.tableWidth = 0, this.containerHeight = 0, this.containerWidth = 0, this.autoResize = !1, this.visible = !1, this.initialized = !1, this.initialRedraw = !1, this.registerTableOption("autoResize", !0);
  }
  initialize() {
    if (this.table.options.autoResize) {
      var e = this.table, t;
      this.tableHeight = e.element.clientHeight, this.tableWidth = e.element.clientWidth, e.element.parentNode && (this.containerHeight = e.element.parentNode.clientHeight, this.containerWidth = e.element.parentNode.clientWidth), typeof IntersectionObserver < "u" && typeof ResizeObserver < "u" && e.rowManager.getRenderMode() === "virtual" ? (this.initializeVisibilityObserver(), this.autoResize = !0, this.resizeObserver = new ResizeObserver((i) => {
        if (!e.browserMobile || e.browserMobile && (!e.modules.edit || e.modules.edit && !e.modules.edit.currentCell)) {
          var s = Math.floor(i[0].contentRect.height), n = Math.floor(i[0].contentRect.width);
          (this.tableHeight != s || this.tableWidth != n) && (this.tableHeight = s, this.tableWidth = n, e.element.parentNode && (this.containerHeight = e.element.parentNode.clientHeight, this.containerWidth = e.element.parentNode.clientWidth), this.redrawTable());
        }
      }), this.resizeObserver.observe(e.element), t = window.getComputedStyle(e.element), this.table.element.parentNode && !this.table.rowManager.fixedHeight && (t.getPropertyValue("max-height") || t.getPropertyValue("min-height")) && (this.containerObserver = new ResizeObserver((i) => {
        if (!e.browserMobile || e.browserMobile && (!e.modules.edit || e.modules.edit && !e.modules.edit.currentCell)) {
          var s = Math.floor(i[0].contentRect.height), n = Math.floor(i[0].contentRect.width);
          (this.containerHeight != s || this.containerWidth != n) && (this.containerHeight = s, this.containerWidth = n, this.tableHeight = e.element.clientHeight, this.tableWidth = e.element.clientWidth), this.redrawTable();
        }
      }), this.containerObserver.observe(this.table.element.parentNode)), this.subscribe("table-resize", this.tableResized.bind(this))) : (this.binding = function() {
        (!e.browserMobile || e.browserMobile && (!e.modules.edit || e.modules.edit && !e.modules.edit.currentCell)) && (e.columnManager.rerenderColumns(!0), e.redraw());
      }, window.addEventListener("resize", this.binding)), this.subscribe("table-destroy", this.clearBindings.bind(this));
    }
  }
  initializeVisibilityObserver() {
    this.visibilityObserver = new IntersectionObserver((e) => {
      this.visible = e[0].isIntersecting, this.initialized ? this.visible && (this.redrawTable(this.initialRedraw), this.initialRedraw = !1) : (this.initialized = !0, this.initialRedraw = !this.visible);
    }), this.visibilityObserver.observe(this.table.element);
  }
  redrawTable(e) {
    this.initialized && this.visible && (this.table.columnManager.rerenderColumns(!0), this.table.redraw(e));
  }
  tableResized() {
    this.table.rowManager.redraw();
  }
  clearBindings() {
    this.binding && window.removeEventListener("resize", this.binding), this.resizeObserver && this.resizeObserver.unobserve(this.table.element), this.visibilityObserver && this.visibilityObserver.unobserve(this.table.element), this.containerObserver && this.containerObserver.unobserve(this.table.element.parentNode);
  }
}
C(Cr, "moduleName", "resizeTable");
function hh(o, e, t) {
  var i = document.createElement("div"), s = o.getRow()._row.modules.responsiveLayout;
  i.classList.add("tabulator-responsive-collapse-toggle"), i.innerHTML = `<svg class='tabulator-responsive-collapse-toggle-open' viewbox="0 0 24 24">
  <line x1="7" y1="12" x2="17" y2="12" fill="none" stroke-width="3" stroke-linecap="round" />
  <line y1="7" x1="12" y2="17" x2="12" fill="none" stroke-width="3" stroke-linecap="round" />
</svg>

<svg class='tabulator-responsive-collapse-toggle-close' viewbox="0 0 24 24">
  <line x1="7" y1="12" x2="17" y2="12"  fill="none" stroke-width="3" stroke-linecap="round" />
</svg>`, o.getElement().classList.add("tabulator-row-handle");
  function n(r) {
    var a = s.element;
    s.open = r, a && (s.open ? (i.classList.add("open"), a.style.display = "") : (i.classList.remove("open"), a.style.display = "none"));
  }
  return i.addEventListener("click", function(r) {
    r.stopImmediatePropagation(), n(!s.open), o.getTable().rowManager.adjustTableSize();
  }), n(s.open), i;
}
var dh = {
  format: {
    formatters: {
      responsiveCollapse: hh
    }
  }
};
class Ws extends A {
  constructor(e) {
    super(e), this.columns = [], this.hiddenColumns = [], this.mode = "", this.index = 0, this.collapseFormatter = [], this.collapseStartOpen = !0, this.collapseHandleColumn = !1, this.registerTableOption("responsiveLayout", !1), this.registerTableOption("responsiveLayoutCollapseStartOpen", !0), this.registerTableOption("responsiveLayoutCollapseUseFormatters", !0), this.registerTableOption("responsiveLayoutCollapseFormatter", !1), this.registerColumnOption("responsive");
  }
  //generate responsive columns list
  initialize() {
    this.table.options.responsiveLayout && (this.subscribe("column-layout", this.initializeColumn.bind(this)), this.subscribe("column-show", this.updateColumnVisibility.bind(this)), this.subscribe("column-hide", this.updateColumnVisibility.bind(this)), this.subscribe("columns-loaded", this.initializeResponsivity.bind(this)), this.subscribe("column-moved", this.initializeResponsivity.bind(this)), this.subscribe("column-add", this.initializeResponsivity.bind(this)), this.subscribe("column-delete", this.initializeResponsivity.bind(this)), this.subscribe("table-redrawing", this.tableRedraw.bind(this)), this.table.options.responsiveLayout === "collapse" && (this.subscribe("row-data-changed", this.generateCollapsedRowContent.bind(this)), this.subscribe("row-init", this.initializeRow.bind(this)), this.subscribe("row-layout", this.layoutRow.bind(this))));
  }
  tableRedraw(e) {
    ["fitColumns", "fitDataStretch"].indexOf(this.layoutMode()) === -1 && (e || this.update());
  }
  initializeResponsivity() {
    var e = [];
    this.mode = this.table.options.responsiveLayout, this.collapseFormatter = this.table.options.responsiveLayoutCollapseFormatter || this.formatCollapsedData, this.collapseStartOpen = this.table.options.responsiveLayoutCollapseStartOpen, this.hiddenColumns = [], this.collapseFormatter && (this.collapseFormatter = this.collapseFormatter.bind(this.table)), this.table.columnManager.columnsByIndex.forEach((t, i) => {
      t.modules.responsive && t.modules.responsive.order && t.modules.responsive.visible && (t.modules.responsive.index = i, e.push(t), !t.visible && this.mode === "collapse" && this.hiddenColumns.push(t));
    }), e = e.reverse(), e = e.sort((t, i) => {
      var s = i.modules.responsive.order - t.modules.responsive.order;
      return s || i.modules.responsive.index - t.modules.responsive.index;
    }), this.columns = e, this.mode === "collapse" && this.generateCollapsedContent();
    for (let t of this.table.columnManager.columnsByIndex)
      if (t.definition.formatter == "responsiveCollapse") {
        this.collapseHandleColumn = t;
        break;
      }
    this.collapseHandleColumn && (this.hiddenColumns.length ? this.collapseHandleColumn.show() : this.collapseHandleColumn.hide());
  }
  //define layout information
  initializeColumn(e) {
    var t = e.getDefinition();
    e.modules.responsive = { order: typeof t.responsive > "u" ? 1 : t.responsive, visible: t.visible !== !1 };
  }
  initializeRow(e) {
    var t;
    e.type !== "calc" && (t = document.createElement("div"), t.classList.add("tabulator-responsive-collapse"), e.modules.responsiveLayout = {
      element: t,
      open: this.collapseStartOpen
    }, this.collapseStartOpen || (t.style.display = "none"));
  }
  layoutRow(e) {
    var t = e.getElement();
    e.modules.responsiveLayout && (t.appendChild(e.modules.responsiveLayout.element), this.generateCollapsedRowContent(e));
  }
  //update column visibility
  updateColumnVisibility(e, t) {
    !t && e.modules.responsive && (e.modules.responsive.visible = e.visible, this.initializeResponsivity());
  }
  hideColumn(e) {
    var t = this.hiddenColumns.length;
    e.hide(!1, !0), this.mode === "collapse" && (this.hiddenColumns.unshift(e), this.generateCollapsedContent(), this.collapseHandleColumn && !t && this.collapseHandleColumn.show());
  }
  showColumn(e) {
    var t;
    e.show(!1, !0), e.setWidth(e.getWidth()), this.mode === "collapse" && (t = this.hiddenColumns.indexOf(e), t > -1 && this.hiddenColumns.splice(t, 1), this.generateCollapsedContent(), this.collapseHandleColumn && !this.hiddenColumns.length && this.collapseHandleColumn.hide());
  }
  //redraw columns to fit space
  update() {
    for (var e = !0; e; ) {
      let t = this.table.modules.layout.getMode() == "fitColumns" ? this.table.columnManager.getFlexBaseWidth() : this.table.columnManager.getWidth(), i = (this.table.options.headerVisible ? this.table.columnManager.element.clientWidth : this.table.element.clientWidth) - t;
      if (i < 0) {
        let s = this.columns[this.index];
        s ? (this.hideColumn(s), this.index++) : e = !1;
      } else {
        let s = this.columns[this.index - 1];
        s && i > 0 && i >= s.getWidth() ? (this.showColumn(s), this.index--) : e = !1;
      }
      this.table.rowManager.activeRowsCount || this.table.rowManager.renderEmptyScroll();
    }
  }
  generateCollapsedContent() {
    var e = this.table.rowManager.getDisplayRows();
    e.forEach((t) => {
      this.generateCollapsedRowContent(t);
    });
  }
  generateCollapsedRowContent(e) {
    var t, i;
    if (e.modules.responsiveLayout) {
      for (t = e.modules.responsiveLayout.element; t.firstChild; ) t.removeChild(t.firstChild);
      i = this.collapseFormatter(this.generateCollapsedRowData(e)), i && t.appendChild(i), e.calcHeight(!0);
    }
  }
  generateCollapsedRowData(e) {
    var t = e.getData(), i = [], s;
    return this.hiddenColumns.forEach((n) => {
      var r = n.getFieldValue(t);
      if (n.definition.title && n.field)
        if (n.modules.format && this.table.options.responsiveLayoutCollapseUseFormatters) {
          let a = function(l) {
            l();
          };
          s = {
            value: !1,
            data: {},
            getValue: function() {
              return r;
            },
            getData: function() {
              return t;
            },
            getType: function() {
              return "cell";
            },
            getElement: function() {
              return document.createElement("div");
            },
            getRow: function() {
              return e.getComponent();
            },
            getColumn: function() {
              return n.getComponent();
            },
            getTable: () => this.table
          }, i.push({
            field: n.field,
            title: n.definition.title,
            value: n.modules.format.formatter.call(this.table.modules.format, s, n.modules.format.params, a)
          });
        } else
          i.push({
            field: n.field,
            title: n.definition.title,
            value: r
          });
    }), i;
  }
  formatCollapsedData(e) {
    var t = document.createElement("table");
    return e.forEach((i) => {
      var s = document.createElement("tr"), n = document.createElement("td"), r = document.createElement("td"), a, l = document.createElement("strong");
      n.appendChild(l), this.modules.localize.bind("columns|" + i.field, function(h) {
        l.innerHTML = h || i.title;
      }), i.value instanceof Node ? (a = document.createElement("div"), a.appendChild(i.value), r.appendChild(a)) : r.innerHTML = i.value, s.appendChild(n), s.appendChild(r), t.appendChild(s);
    }), Object.keys(e).length ? t : "";
  }
}
C(Ws, "moduleName", "responsiveLayout"), C(Ws, "moduleExtensions", dh);
function ch(o, e, t) {
  var i = document.createElement("input"), s = !1;
  if (i.type = "checkbox", i.setAttribute("aria-label", "Select Row"), this.table.modExists("selectRow", !0))
    if (i.addEventListener("click", (r) => {
      r.stopPropagation();
    }), typeof o.getRow == "function") {
      var n = o.getRow();
      n instanceof Ui ? (i.addEventListener("change", (r) => {
        this.table.options.selectableRowsRangeMode === "click" && s ? s = !1 : n.toggleSelect();
      }), this.table.options.selectableRowsRangeMode === "click" && i.addEventListener("click", (r) => {
        s = !0, this.table.modules.selectRow.handleComplexRowClick(n._row, r);
      }), i.checked = n.isSelected && n.isSelected(), this.table.modules.selectRow.registerRowSelectCheckbox(n, i)) : i = "";
    } else
      i.addEventListener("change", (r) => {
        this.table.modules.selectRow.selectedRows.length ? this.table.deselectRow() : this.table.selectRow(e.rowRange);
      }), this.table.modules.selectRow.registerHeaderSelectCheckbox(i);
  return i;
}
var uh = {
  format: {
    formatters: {
      rowSelection: ch
    }
  }
};
class js extends A {
  constructor(e) {
    super(e), this.selecting = !1, this.lastClickedRow = !1, this.selectPrev = [], this.selectedRows = [], this.headerCheckboxElement = null, this.registerTableOption("selectableRows", "highlight"), this.registerTableOption("selectableRowsRangeMode", "drag"), this.registerTableOption("selectableRowsRollingSelection", !0), this.registerTableOption("selectableRowsPersistence", !0), this.registerTableOption("selectableRowsCheck", function(t, i) {
      return !0;
    }), this.registerTableFunction("selectRow", this.selectRows.bind(this)), this.registerTableFunction("deselectRow", this.deselectRows.bind(this)), this.registerTableFunction("toggleSelectRow", this.toggleRow.bind(this)), this.registerTableFunction("getSelectedRows", this.getSelectedRows.bind(this)), this.registerTableFunction("getSelectedData", this.getSelectedData.bind(this)), this.registerComponentFunction("row", "select", this.selectRows.bind(this)), this.registerComponentFunction("row", "deselect", this.deselectRows.bind(this)), this.registerComponentFunction("row", "toggleSelect", this.toggleRow.bind(this)), this.registerComponentFunction("row", "isSelected", this.isRowSelected.bind(this));
  }
  initialize() {
    this.deprecatedOptionsCheck(), this.table.options.selectableRows === "highlight" && this.table.options.selectableRange && (this.table.options.selectableRows = !1), this.table.options.selectableRows !== !1 && (this.subscribe("row-init", this.initializeRow.bind(this)), this.subscribe("row-deleting", this.rowDeleted.bind(this)), this.subscribe("rows-wipe", this.clearSelectionData.bind(this)), this.subscribe("rows-retrieve", this.rowRetrieve.bind(this)), this.table.options.selectableRows && !this.table.options.selectableRowsPersistence && this.subscribe("data-refreshing", this.deselectRows.bind(this)));
  }
  deprecatedOptionsCheck() {
  }
  rowRetrieve(e, t) {
    return e === "selected" ? this.selectedRows : t;
  }
  rowDeleted(e) {
    this._deselectRow(e, !0);
  }
  clearSelectionData(e) {
    var t = this.selectedRows.length;
    this.selecting = !1, this.lastClickedRow = !1, this.selectPrev = [], this.selectedRows = [], t && e !== !0 && this._rowSelectionChanged();
  }
  initializeRow(e) {
    var t = this, i = t.checkRowSelectability(e), s = e.getElement(), n = function() {
      setTimeout(function() {
        t.selecting = !1;
      }, 50), document.body.removeEventListener("mouseup", n);
    };
    e.modules.select = { selected: !1 }, s.classList.toggle("tabulator-selectable", i), s.classList.toggle("tabulator-unselectable", !i), t.checkRowSelectability(e) && t.table.options.selectableRows && t.table.options.selectableRows != "highlight" && (t.table.options.selectableRowsRangeMode === "click" ? s.addEventListener("click", this.handleComplexRowClick.bind(this, e)) : (s.addEventListener("click", function(r) {
      (!t.table.modExists("edit") || !t.table.modules.edit.getCurrentCell()) && t.table._clearSelection(), t.selecting || t.toggleRow(e);
    }), s.addEventListener("mousedown", function(r) {
      if (r.shiftKey)
        return t.table._clearSelection(), t.selecting = !0, t.selectPrev = [], document.body.addEventListener("mouseup", n), document.body.addEventListener("keyup", n), t.toggleRow(e), !1;
    }), s.addEventListener("mouseenter", function(r) {
      t.selecting && (t.table._clearSelection(), t.toggleRow(e), t.selectPrev[1] == e && t.toggleRow(t.selectPrev[0]));
    }), s.addEventListener("mouseout", function(r) {
      t.selecting && (t.table._clearSelection(), t.selectPrev.unshift(e));
    })));
  }
  handleComplexRowClick(e, t) {
    if (t.shiftKey) {
      this.table._clearSelection(), this.lastClickedRow = this.lastClickedRow || e;
      var i = this.table.rowManager.getDisplayRowIndex(this.lastClickedRow), s = this.table.rowManager.getDisplayRowIndex(e), n = i <= s ? i : s, r = i >= s ? i : s, a = this.table.rowManager.getDisplayRows().slice(0), l = a.splice(n, r - n + 1);
      t.ctrlKey || t.metaKey ? (l.forEach((h) => {
        h !== this.lastClickedRow && (this.table.options.selectableRows !== !0 && !this.isRowSelected(e) ? this.selectedRows.length < this.table.options.selectableRows && this.toggleRow(h) : this.toggleRow(h));
      }), this.lastClickedRow = e) : (this.deselectRows(void 0, !0), this.table.options.selectableRows !== !0 && l.length > this.table.options.selectableRows && (l = l.slice(0, this.table.options.selectableRows)), this.selectRows(l)), this.table._clearSelection();
    } else t.ctrlKey || t.metaKey ? (this.toggleRow(e), this.lastClickedRow = e) : (this.deselectRows(void 0, !0), this.selectRows(e), this.lastClickedRow = e);
  }
  checkRowSelectability(e) {
    return e && e.type === "row" ? this.table.options.selectableRowsCheck.call(this.table, e.getComponent()) : !1;
  }
  //toggle row selection
  toggleRow(e) {
    this.checkRowSelectability(e) && (e.modules.select && e.modules.select.selected ? this._deselectRow(e) : this._selectRow(e));
  }
  //select a number of rows
  selectRows(e) {
    var t = [], i, s;
    switch (typeof e) {
      case "undefined":
        i = this.table.rowManager.rows;
        break;
      case "number":
        i = this.table.rowManager.findRow(e);
        break;
      case "string":
        i = this.table.rowManager.findRow(e), i || (i = this.table.rowManager.getRows(e));
        break;
      default:
        i = e;
        break;
    }
    Array.isArray(i) ? i.length && (i.forEach((n) => {
      s = this._selectRow(n, !0, !0), s && t.push(s);
    }), this._rowSelectionChanged(!1, t)) : i && this._selectRow(i, !1, !0);
  }
  //select an individual row
  _selectRow(e, t, i) {
    if (!isNaN(this.table.options.selectableRows) && this.table.options.selectableRows !== !0 && !i && this.selectedRows.length >= this.table.options.selectableRows)
      if (this.table.options.selectableRowsRollingSelection)
        this._deselectRow(this.selectedRows[0]);
      else
        return !1;
    var s = this.table.rowManager.findRow(e);
    if (s) {
      if (this.selectedRows.indexOf(s) == -1)
        return s.getElement().classList.add("tabulator-selected"), s.modules.select || (s.modules.select = {}), s.modules.select.selected = !0, s.modules.select.checkboxEl && (s.modules.select.checkboxEl.checked = !0), this.selectedRows.push(s), this.table.options.dataTreeSelectPropagate && this.childRowSelection(s, !0), this.dispatchExternal("rowSelected", s.getComponent()), this._rowSelectionChanged(t, s), s;
    } else
      t || console.warn("Selection Error - No such row found, ignoring selection:" + e);
  }
  isRowSelected(e) {
    return this.selectedRows.indexOf(e) !== -1;
  }
  //deselect a number of rows
  deselectRows(e, t) {
    var i = [], s, n;
    switch (typeof e) {
      case "undefined":
        s = Object.assign([], this.selectedRows);
        break;
      case "number":
        s = this.table.rowManager.findRow(e);
        break;
      case "string":
        s = this.table.rowManager.findRow(e), s || (s = this.table.rowManager.getRows(e));
        break;
      default:
        s = e;
        break;
    }
    Array.isArray(s) ? s.length && (s.forEach((r) => {
      n = this._deselectRow(r, !0, !0), n && i.push(n);
    }), this._rowSelectionChanged(t, [], i)) : s && this._deselectRow(s, t, !0);
  }
  //deselect an individual row
  _deselectRow(e, t) {
    var i = this, s = i.table.rowManager.findRow(e), n, r;
    if (s) {
      if (n = i.selectedRows.findIndex(function(a) {
        return a == s;
      }), n > -1)
        return r = s.getElement(), r && r.classList.remove("tabulator-selected"), s.modules.select || (s.modules.select = {}), s.modules.select.selected = !1, s.modules.select.checkboxEl && (s.modules.select.checkboxEl.checked = !1), i.selectedRows.splice(n, 1), this.table.options.dataTreeSelectPropagate && this.childRowSelection(s, !1), this.dispatchExternal("rowDeselected", s.getComponent()), i._rowSelectionChanged(t, void 0, s), s;
    } else
      t || console.warn("Deselection Error - No such row found, ignoring selection:" + e);
  }
  getSelectedData() {
    var e = [];
    return this.selectedRows.forEach(function(t) {
      e.push(t.getData());
    }), e;
  }
  getSelectedRows() {
    var e = [];
    return this.selectedRows.forEach(function(t) {
      e.push(t.getComponent());
    }), e;
  }
  _rowSelectionChanged(e, t = [], i = []) {
    this.headerCheckboxElement && (this.selectedRows.length === 0 ? (this.headerCheckboxElement.checked = !1, this.headerCheckboxElement.indeterminate = !1) : this.table.rowManager.rows.length === this.selectedRows.length ? (this.headerCheckboxElement.checked = !0, this.headerCheckboxElement.indeterminate = !1) : (this.headerCheckboxElement.indeterminate = !0, this.headerCheckboxElement.checked = !1)), e || (Array.isArray(t) || (t = [t]), t = t.map((s) => s.getComponent()), Array.isArray(i) || (i = [i]), i = i.map((s) => s.getComponent()), this.dispatchExternal("rowSelectionChanged", this.getSelectedData(), this.getSelectedRows(), t, i));
  }
  registerRowSelectCheckbox(e, t) {
    e._row.modules.select || (e._row.modules.select = {}), e._row.modules.select.checkboxEl = t;
  }
  registerHeaderSelectCheckbox(e) {
    this.headerCheckboxElement = e;
  }
  childRowSelection(e, t) {
    var i = this.table.modules.dataTree.getChildren(e, !0, !0);
    if (t)
      for (let s of i)
        this._selectRow(s, !0);
    else
      for (let s of i)
        this._deselectRow(s, !0);
  }
}
C(js, "moduleName", "selectRow"), C(js, "moduleExtensions", uh);
class fh {
  constructor(e) {
    return this._range = e, new Proxy(this, {
      get: function(t, i, s) {
        return typeof t[i] < "u" ? t[i] : t._range.table.componentFunctionBinder.handle("range", t._range, i);
      }
    });
  }
  getElement() {
    return this._range.element;
  }
  getData() {
    return this._range.getData();
  }
  getCells() {
    return this._range.getCells(!0, !0);
  }
  getStructuredCells() {
    return this._range.getStructuredCells();
  }
  getRows() {
    return this._range.getRows().map((e) => e.getComponent());
  }
  getColumns() {
    return this._range.getColumns().map((e) => e.getComponent());
  }
  getBounds() {
    return this._range.getBounds();
  }
  getTopEdge() {
    return this._range.top;
  }
  getBottomEdge() {
    return this._range.bottom;
  }
  getLeftEdge() {
    return this._range.left;
  }
  getRightEdge() {
    return this._range.right;
  }
  setBounds(e, t) {
    this._range.destroyedGuard("setBounds") && this._range.setBounds(e && e._cell, t && t._cell);
  }
  setStartBound(e) {
    this._range.destroyedGuard("setStartBound") && (this._range.setEndBound(e && e._cell), this._range.rangeManager.layoutElement());
  }
  setEndBound(e) {
    this._range.destroyedGuard("setEndBound") && (this._range.setEndBound(e && e._cell), this._range.rangeManager.layoutElement());
  }
  clearValues() {
    this._range.destroyedGuard("clearValues") && this._range.clearValues();
  }
  remove() {
    this._range.destroyedGuard("remove") && this._range.destroy(!0);
  }
}
class ph extends oe {
  constructor(e, t, i, s) {
    super(e), this.rangeManager = t, this.element = null, this.initialized = !1, this.initializing = {
      start: !1,
      end: !1
    }, this.destroyed = !1, this.top = 0, this.bottom = 0, this.left = 0, this.right = 0, this.table = e, this.start = { row: 0, col: 0 }, this.end = { row: 0, col: 0 }, this.rangeManager.rowHeader && (this.left = 1, this.right = 1, this.start.col = 1, this.end.col = 1), this.initElement(), setTimeout(() => {
      this.initBounds(i, s);
    });
  }
  initElement() {
    this.element = document.createElement("div"), this.element.classList.add("tabulator-range");
  }
  initBounds(e, t) {
    this._updateMinMax(), e && this.setBounds(e, t || e);
  }
  ///////////////////////////////////
  ///////   Boundary Setup    ///////
  ///////////////////////////////////
  setStart(e, t) {
    (this.start.row !== e || this.start.col !== t) && (this.start.row = e, this.start.col = t, this.initializing.start = !0, this._updateMinMax());
  }
  setEnd(e, t) {
    (this.end.row !== e || this.end.col !== t) && (this.end.row = e, this.end.col = t, this.initializing.end = !0, this._updateMinMax());
  }
  setBounds(e, t, i) {
    e && this.setStartBound(e), this.setEndBound(t || e), this.rangeManager.layoutElement(i);
  }
  setStartBound(e) {
    var t, i;
    e.type === "column" ? this.rangeManager.columnSelection && this.setStart(0, e.getPosition() - 1) : (t = e.row.position - 1, i = e.column.getPosition() - 1, e.column === this.rangeManager.rowHeader ? this.setStart(t, 1) : this.setStart(t, i));
  }
  setEndBound(e) {
    var t = this._getTableRows().length, i, s, n;
    e.type === "column" ? this.rangeManager.columnSelection && (this.rangeManager.selecting === "column" ? this.setEnd(t - 1, e.getPosition() - 1) : this.rangeManager.selecting === "cell" && this.setEnd(0, e.getPosition() - 1)) : (i = e.row.position - 1, s = e.column.getPosition() - 1, n = e.column === this.rangeManager.rowHeader, this.rangeManager.selecting === "row" ? this.setEnd(i, this._getTableColumns().length - 1) : this.rangeManager.selecting !== "row" && n ? this.setEnd(i, 0) : this.rangeManager.selecting === "column" ? this.setEnd(t - 1, s) : this.setEnd(i, s));
  }
  _updateMinMax() {
    this.top = Math.min(this.start.row, this.end.row), this.bottom = Math.max(this.start.row, this.end.row), this.left = Math.min(this.start.col, this.end.col), this.right = Math.max(this.start.col, this.end.col), this.initialized ? this.dispatchExternal("rangeChanged", this.getComponent()) : this.initializing.start && this.initializing.end && (this.initialized = !0, this.dispatchExternal("rangeAdded", this.getComponent()));
  }
  _getTableColumns() {
    return this.table.columnManager.getVisibleColumnsByIndex();
  }
  _getTableRows() {
    return this.table.rowManager.getDisplayRows().filter((e) => e.type === "row");
  }
  ///////////////////////////////////
  ///////      Rendering      ///////
  ///////////////////////////////////
  layout() {
    var e = this.table.rowManager.renderer.vDomTop, t = this.table.rowManager.renderer.vDomBottom, i = this.table.columnManager.renderer.leftCol, s = this.table.columnManager.renderer.rightCol, n, r, a, l, h, d, c, u, f, p;
    this.table.options.renderHorizontal === "virtual" && this.rangeManager.rowHeader && (s += 1), e == null && (e = 0), t == null && (t = 1 / 0), i == null && (i = 0), s == null && (s = 1 / 0), this.overlaps(i, e, s, t) && (n = Math.max(this.top, e), r = Math.min(this.bottom, t), a = Math.max(this.left, i), l = Math.min(this.right, s), h = this.rangeManager.getCell(n, a), d = this.rangeManager.getCell(r, l), c = h.getElement(), u = d.getElement(), f = h.row.getElement(), p = d.row.getElement(), this.element.classList.add("tabulator-range-active"), this.table.rtl ? (this.element.style.right = f.offsetWidth - c.offsetLeft - c.offsetWidth + "px", this.element.style.width = c.offsetLeft + c.offsetWidth - u.offsetLeft + "px") : (this.element.style.left = f.offsetLeft + c.offsetLeft + "px", this.element.style.width = u.offsetLeft + u.offsetWidth - c.offsetLeft + "px"), this.element.style.top = f.offsetTop + "px", this.element.style.height = p.offsetTop + p.offsetHeight - f.offsetTop + "px");
  }
  atTopLeft(e) {
    return e.row.position - 1 === this.top && e.column.getPosition() - 1 === this.left;
  }
  atBottomRight(e) {
    return e.row.position - 1 === this.bottom && e.column.getPosition() - 1 === this.right;
  }
  occupies(e) {
    return this.occupiesRow(e.row) && this.occupiesColumn(e.column);
  }
  occupiesRow(e) {
    return this.top <= e.position - 1 && e.position - 1 <= this.bottom;
  }
  occupiesColumn(e) {
    return this.left <= e.getPosition() - 1 && e.getPosition() - 1 <= this.right;
  }
  overlaps(e, t, i, s) {
    return !(this.left > i || e > this.right || this.top > s || t > this.bottom);
  }
  getData() {
    var e = [], t = this.getRows(), i = this.getColumns();
    return t.forEach((s) => {
      var n = s.getData(), r = {};
      i.forEach((a) => {
        r[a.field] = n[a.field];
      }), e.push(r);
    }), e;
  }
  getCells(e, t) {
    var i = [], s = this.getRows(), n = this.getColumns();
    return e ? i = s.map((r) => {
      var a = [];
      return r.getCells().forEach((l) => {
        n.includes(l.column) && a.push(t ? l.getComponent() : l);
      }), a;
    }) : s.forEach((r) => {
      r.getCells().forEach((a) => {
        n.includes(a.column) && i.push(t ? a.getComponent() : a);
      });
    }), i;
  }
  getStructuredCells() {
    return this.getCells(!0, !0);
  }
  getRows() {
    return this._getTableRows().slice(this.top, this.bottom + 1);
  }
  getColumns() {
    return this._getTableColumns().slice(this.left, this.right + 1);
  }
  clearValues() {
    var e = this.getCells(), t = this.table.options.selectableRangeClearCellsValue;
    this.table.blockRedraw(), e.forEach((i) => {
      i.setValue(t);
    }), this.table.restoreRedraw();
  }
  getBounds(e) {
    var t = this.getCells(!1, e), i = {
      start: null,
      end: null
    };
    return t.length ? (i.start = t[0], i.end = t[t.length - 1]) : console.warn("No bounds defined on range"), i;
  }
  getComponent() {
    return this.component || (this.component = new fh(this)), this.component;
  }
  destroy(e) {
    this.destroyed = !0, this.element.remove(), e && this.rangeManager.rangeRemoved(this), this.initialized && this.dispatchExternal("rangeRemoved", this.getComponent());
  }
  destroyedGuard(e) {
    return this.destroyed && console.warn("You cannot call the " + e + " function on a destroyed range"), !this.destroyed;
  }
}
var gh = {
  rangeJumpUp: ["ctrl + 38", "meta + 38"],
  rangeJumpDown: ["ctrl + 40", "meta + 40"],
  rangeJumpLeft: ["ctrl + 37", "meta + 37"],
  rangeJumpRight: ["ctrl + 39", "meta + 39"],
  rangeExpandUp: "shift + 38",
  rangeExpandDown: "shift + 40",
  rangeExpandLeft: "shift + 37",
  rangeExpandRight: "shift + 39",
  rangeExpandJumpUp: ["ctrl + shift + 38", "meta + shift + 38"],
  rangeExpandJumpDown: ["ctrl + shift + 40", "meta + shift + 40"],
  rangeExpandJumpLeft: ["ctrl + shift + 37", "meta + shift + 37"],
  rangeExpandJumpRight: ["ctrl + shift + 39", "meta + shift + 39"]
}, mh = {
  rangeJumpLeft: function(o) {
    this.dispatch("keybinding-nav-range", o, "left", !0, !1);
  },
  rangeJumpRight: function(o) {
    this.dispatch("keybinding-nav-range", o, "right", !0, !1);
  },
  rangeJumpUp: function(o) {
    this.dispatch("keybinding-nav-range", o, "up", !0, !1);
  },
  rangeJumpDown: function(o) {
    this.dispatch("keybinding-nav-range", o, "down", !0, !1);
  },
  rangeExpandLeft: function(o) {
    this.dispatch("keybinding-nav-range", o, "left", !1, !0);
  },
  rangeExpandRight: function(o) {
    this.dispatch("keybinding-nav-range", o, "right", !1, !0);
  },
  rangeExpandUp: function(o) {
    this.dispatch("keybinding-nav-range", o, "up", !1, !0);
  },
  rangeExpandDown: function(o) {
    this.dispatch("keybinding-nav-range", o, "down", !1, !0);
  },
  rangeExpandJumpLeft: function(o) {
    this.dispatch("keybinding-nav-range", o, "left", !0, !0);
  },
  rangeExpandJumpRight: function(o) {
    this.dispatch("keybinding-nav-range", o, "right", !0, !0);
  },
  rangeExpandJumpUp: function(o) {
    this.dispatch("keybinding-nav-range", o, "up", !0, !0);
  },
  rangeExpandJumpDown: function(o) {
    this.dispatch("keybinding-nav-range", o, "down", !0, !0);
  }
}, bh = {
  range: function(o) {
    var e = [], t = this.table.modules.selectRange.activeRange, i = !1, s, n, r, a, l;
    return l = o.length, t && (s = t.getBounds(), n = s.start, s.start === s.end && (i = !0), n && (e = this.table.rowManager.activeRows.slice(), r = e.indexOf(n.row), i ? a = o.length : a = e.indexOf(s.end.row) - r + 1, r > -1 && (this.table.blockRedraw(), e = e.slice(r, r + a), e.forEach((h, d) => {
      h.updateData(o[d % l]);
    }), this.table.restoreRedraw()))), e;
  }
}, vh = {
  range: function(o) {
    var e = [], t = [], i = this.table.modules.selectRange.activeRange, s = !1, n, r, a, l, h;
    return i && (n = i.getBounds(), r = n.start, n.start === n.end && (s = !0), r && (o = o.split(`
`), o.forEach(function(d) {
      e.push(d.split("	"));
    }), e.length && (l = this.table.columnManager.getVisibleColumnsByIndex(), h = l.indexOf(r.column), h > -1))) ? (s ? a = e[0].length : a = l.indexOf(n.end.column) - h + 1, l = l.slice(h, h + a), e.forEach((d) => {
      var c = {}, u = d.length;
      l.forEach(function(f, p) {
        c[f.field] = d[p % u];
      }), t.push(c);
    }), t) : !1;
  }
}, wh = {
  range: function() {
    var o = this.modules.selectRange.selectedColumns();
    return this.columnManager.rowHeader && o.unshift(this.columnManager.rowHeader), o;
  }
}, yh = {
  range: function() {
    return this.modules.selectRange.selectedRows();
  }
}, Ch = {
  keybindings: {
    bindings: gh,
    actions: mh
  },
  clipboard: {
    pasteActions: bh,
    pasteParsers: vh
  },
  export: {
    columnLookups: wh,
    rowLookups: yh
  }
};
class zi extends A {
  constructor(e) {
    super(e), this.selecting = "cell", this.mousedown = !1, this.ranges = [], this.overlay = null, this.rowHeader = null, this.layoutChangeTimeout = null, this.columnSelection = !1, this.rowSelection = !1, this.maxRanges = 0, this.activeRange = !1, this.blockKeydown = !1, this.keyDownEvent = this._handleKeyDown.bind(this), this.mouseUpEvent = this._handleMouseUp.bind(this), this.registerTableOption("selectableRange", !1), this.registerTableOption("selectableRangeColumns", !1), this.registerTableOption("selectableRangeRows", !1), this.registerTableOption("selectableRangeClearCells", !1), this.registerTableOption("selectableRangeClearCellsValue", void 0), this.registerTableOption("selectableRangeAutoFocus", !0), this.registerTableFunction("getRangesData", this.getRangesData.bind(this)), this.registerTableFunction("getRanges", this.getRanges.bind(this)), this.registerTableFunction("addRange", this.addRangeFromComponent.bind(this)), this.registerComponentFunction("cell", "getRanges", this.cellGetRanges.bind(this)), this.registerComponentFunction("row", "getRanges", this.rowGetRanges.bind(this)), this.registerComponentFunction("column", "getRanges", this.colGetRanges.bind(this));
  }
  ///////////////////////////////////
  ///////    Initialization   ///////
  ///////////////////////////////////
  initialize() {
    this.options("selectableRange") && (this.options("selectableRows") ? console.warn("SelectRange functionality cannot be used in conjunction with row selection") : (this.maxRanges = this.options("selectableRange"), this.initializeTable(), this.initializeWatchers()), this.options("columns").findIndex((e) => e.frozen) > 0 && console.warn("Having frozen column in arbitrary position with selectRange option may result in unpredictable behavior."), this.options("columns").filter((e) => e.frozen) > 1 && console.warn("Having multiple frozen columns with selectRange option may result in unpredictable behavior."));
  }
  initializeTable() {
    this.overlay = document.createElement("div"), this.overlay.classList.add("tabulator-range-overlay"), this.rangeContainer = document.createElement("div"), this.rangeContainer.classList.add("tabulator-range-container"), this.activeRangeCellElement = document.createElement("div"), this.activeRangeCellElement.classList.add("tabulator-range-cell-active"), this.overlay.appendChild(this.rangeContainer), this.overlay.appendChild(this.activeRangeCellElement), this.table.rowManager.element.addEventListener("keydown", this.keyDownEvent), this.resetRanges(), this.table.rowManager.element.appendChild(this.overlay), this.table.columnManager.element.setAttribute("tabindex", 0), this.table.element.classList.add("tabulator-ranges");
  }
  initializeWatchers() {
    this.columnSelection = this.options("selectableRangeColumns"), this.rowSelection = this.options("selectableRangeRows"), this.subscribe("column-init", this.initializeColumn.bind(this)), this.subscribe("column-mousedown", this.handleColumnMouseDown.bind(this)), this.subscribe("column-mousemove", this.handleColumnMouseMove.bind(this)), this.subscribe("column-resized", this.handleColumnResized.bind(this)), this.subscribe("column-moving", this.handleColumnMoving.bind(this)), this.subscribe("column-moved", this.handleColumnMoved.bind(this)), this.subscribe("column-width", this.layoutChange.bind(this)), this.subscribe("column-height", this.layoutChange.bind(this)), this.subscribe("column-resized", this.layoutChange.bind(this)), this.subscribe("columns-loaded", this.updateHeaderColumn.bind(this)), this.subscribe("cell-height", this.layoutChange.bind(this)), this.subscribe("cell-rendered", this.renderCell.bind(this)), this.subscribe("cell-mousedown", this.handleCellMouseDown.bind(this)), this.subscribe("cell-mousemove", this.handleCellMouseMove.bind(this)), this.subscribe("cell-click", this.handleCellClick.bind(this)), this.subscribe("cell-editing", this.handleEditingCell.bind(this)), this.subscribe("page-changed", this.redraw.bind(this)), this.subscribe("scroll-vertical", this.layoutChange.bind(this)), this.subscribe("scroll-horizontal", this.layoutChange.bind(this)), this.subscribe("data-destroy", this.tableDestroyed.bind(this)), this.subscribe("data-processed", this.resetRanges.bind(this)), this.subscribe("table-layout", this.layoutElement.bind(this)), this.subscribe("table-redraw", this.redraw.bind(this)), this.subscribe("table-destroy", this.tableDestroyed.bind(this)), this.subscribe("edit-editor-clear", this.finishEditingCell.bind(this)), this.subscribe("edit-blur", this.restoreFocus.bind(this)), this.subscribe("keybinding-nav-prev", this.keyNavigate.bind(this, "left")), this.subscribe("keybinding-nav-next", this.keyNavigate.bind(this, "right")), this.subscribe("keybinding-nav-left", this.keyNavigate.bind(this, "left")), this.subscribe("keybinding-nav-right", this.keyNavigate.bind(this, "right")), this.subscribe("keybinding-nav-up", this.keyNavigate.bind(this, "up")), this.subscribe("keybinding-nav-down", this.keyNavigate.bind(this, "down")), this.subscribe("keybinding-nav-range", this.keyNavigateRange.bind(this));
  }
  initializeColumn(e) {
    this.columnSelection && e.definition.headerSort && this.options("headerSortClickElement") !== "icon" && console.warn("Using column headerSort with selectableRangeColumns option may result in unpredictable behavior. Consider using headerSortClickElement: 'icon'."), e.modules.edit;
  }
  updateHeaderColumn() {
    var e;
    this.rowSelection && (this.rowHeader = this.table.columnManager.getVisibleColumnsByIndex()[0], this.rowHeader && (this.rowHeader.definition.cssClass = this.rowHeader.definition.cssClass + " tabulator-range-row-header", this.rowHeader.definition.headerSort && console.warn("Using column headerSort with selectableRangeRows option may result in unpredictable behavior"), this.rowHeader.definition.editor && console.warn("Using column editor with selectableRangeRows option may result in unpredictable behavior"))), this.table.modules.frozenColumns && this.table.modules.frozenColumns.active && (e = this.table.modules.frozenColumns.getFrozenColumns(), (e.length > 1 || e.length === 1 && e[0] !== this.rowHeader) && console.warn("Using frozen columns that are not the range header in combination with the selectRange option may result in unpredictable behavior"));
  }
  ///////////////////////////////////
  ///////   Table Functions   ///////
  ///////////////////////////////////
  getRanges() {
    return this.ranges.map((e) => e.getComponent());
  }
  getRangesData() {
    return this.ranges.map((e) => e.getData());
  }
  addRangeFromComponent(e, t) {
    return e = e ? e._cell : null, t = t ? t._cell : null, this.addRange(e, t);
  }
  ///////////////////////////////////
  /////// Component Functions ///////
  ///////////////////////////////////
  cellGetRanges(e) {
    var t = [];
    return e.column === this.rowHeader ? t = this.ranges.filter((i) => i.occupiesRow(e.row)) : t = this.ranges.filter((i) => i.occupies(e)), t.map((i) => i.getComponent());
  }
  rowGetRanges(e) {
    var t = this.ranges.filter((i) => i.occupiesRow(e));
    return t.map((i) => i.getComponent());
  }
  colGetRanges(e) {
    var t = this.ranges.filter((i) => i.occupiesColumn(e));
    return t.map((i) => i.getComponent());
  }
  ///////////////////////////////////
  ////////// Event Handlers /////////
  ///////////////////////////////////
  _handleMouseUp(e) {
    this.mousedown = !1, document.removeEventListener("mouseup", this.mouseUpEvent);
  }
  _handleKeyDown(e) {
    if (!this.blockKeydown && (!this.table.modules.edit || this.table.modules.edit && !this.table.modules.edit.currentCell)) {
      if (e.key === "Enter") {
        if (this.table.modules.edit && this.table.modules.edit.currentCell)
          return;
        this.table.modules.edit.editCell(this.getActiveCell()), e.preventDefault();
      }
      (e.key === "Backspace" || e.key === "Delete") && this.options("selectableRangeClearCells") && this.activeRange && this.activeRange.clearValues();
    }
  }
  initializeFocus(e) {
    var t;
    this.restoreFocus();
    try {
      document.selection ? (t = document.body.createTextRange(), t.moveToElementText(e.getElement()), t.select()) : window.getSelection && (t = document.createRange(), t.selectNode(e.getElement()), window.getSelection().removeAllRanges(), window.getSelection().addRange(t));
    } catch {
    }
  }
  restoreFocus(e) {
    return this.table.rowManager.element.focus(), !0;
  }
  ///////////////////////////////////
  ////// Column Functionality ///////
  ///////////////////////////////////
  handleColumnResized(e) {
    var t;
    this.selecting !== "column" && this.selecting !== "all" || (t = this.ranges.some((i) => i.occupiesColumn(e)), t && this.ranges.forEach((i) => {
      var s = i.getColumns(!0);
      s.forEach((n) => {
        n !== e && n.setWidth(e.width);
      });
    }));
  }
  handleColumnMoving(e, t) {
    this.resetRanges().setBounds(t), this.overlay.style.visibility = "hidden";
  }
  handleColumnMoved(e, t, i) {
    this.activeRange.setBounds(e), this.layoutElement();
  }
  handleColumnMouseDown(e, t) {
    e.button === 2 && (this.selecting === "column" || this.selecting === "all") && this.activeRange.occupiesColumn(t) || this.table.options.movableColumns && this.selecting === "column" && this.activeRange.occupiesColumn(t) || (this.mousedown = !0, document.addEventListener("mouseup", this.mouseUpEvent), this.newSelection(e, t));
  }
  handleColumnMouseMove(e, t) {
    t === this.rowHeader || !this.mousedown || this.selecting === "all" || this.activeRange.setBounds(!1, t, !0);
  }
  ///////////////////////////////////
  //////// Cell Functionality ///////
  ///////////////////////////////////
  renderCell(e) {
    var t = e.getElement(), i = this.ranges.findIndex((s) => s.occupies(e));
    t.classList.toggle("tabulator-range-selected", i !== -1), t.classList.toggle("tabulator-range-only-cell-selected", this.ranges.length === 1 && this.ranges[0].atTopLeft(e) && this.ranges[0].atBottomRight(e)), t.dataset.range = i;
  }
  handleCellMouseDown(e, t) {
    e.button === 2 && (this.activeRange.occupies(t) || (this.selecting === "row" || this.selecting === "all") && this.activeRange.occupiesRow(t.row)) || (this.mousedown = !0, document.addEventListener("mouseup", this.mouseUpEvent), this.newSelection(e, t));
  }
  handleCellMouseMove(e, t) {
    !this.mousedown || this.selecting === "all" || this.activeRange.setBounds(!1, t, !0);
  }
  handleCellClick(e, t) {
    this.initializeFocus(t);
  }
  handleEditingCell(e) {
    this.activeRange && this.activeRange.setBounds(e);
  }
  finishEditingCell() {
    this.blockKeydown = !0, this.table.rowManager.element.focus(), setTimeout(() => {
      this.blockKeydown = !1;
    }, 10);
  }
  ///////////////////////////////////
  ///////     Navigation      ///////
  ///////////////////////////////////
  keyNavigate(e, t) {
    this.navigate(!1, !1, e), t.preventDefault();
  }
  keyNavigateRange(e, t, i, s) {
    this.navigate(i, s, t), e.preventDefault();
  }
  navigate(e, t, i) {
    var s = !1, n, r, a, l, h, d, c, u, f, p, g;
    if (this.table.modules.edit && this.table.modules.edit.currentCell)
      return !1;
    if (this.ranges.length > 1 && (this.ranges = this.ranges.filter((m) => m === this.activeRange ? (m.setEnd(m.start.row, m.start.col), !0) : (m.destroy(), !1))), n = this.activeRange, a = {
      top: n.top,
      bottom: n.bottom,
      left: n.left,
      right: n.right
    }, r = t ? n.end : n.start, l = r.row, h = r.col, e)
      switch (i) {
        case "left":
          h = this.findJumpCellLeft(n.start.row, r.col);
          break;
        case "right":
          h = this.findJumpCellRight(n.start.row, r.col);
          break;
        case "up":
          l = this.findJumpCellUp(r.row, n.start.col);
          break;
        case "down":
          l = this.findJumpCellDown(r.row, n.start.col);
          break;
      }
    else {
      if (t && (this.selecting === "row" && (i === "left" || i === "right") || this.selecting === "column" && (i === "up" || i === "down")))
        return;
      switch (i) {
        case "left":
          h = Math.max(h - 1, 0);
          break;
        case "right":
          h = Math.min(h + 1, this.getTableColumns().length - 1);
          break;
        case "up":
          l = Math.max(l - 1, 0);
          break;
        case "down":
          l = Math.min(l + 1, this.getTableRows().length - 1);
          break;
      }
    }
    if (this.rowHeader && h === 0 && (h = 1), t || n.setStart(l, h), n.setEnd(l, h), t || (this.selecting = "cell"), s = a.top !== n.top || a.bottom !== n.bottom || a.left !== n.left || a.right !== n.right, s)
      return d = this.getRowByRangePos(n.end.row), c = this.getColumnByRangePos(n.end.col), u = d.getElement().getBoundingClientRect(), p = c.getElement().getBoundingClientRect(), f = this.table.rowManager.getElement().getBoundingClientRect(), g = this.table.columnManager.getElement().getBoundingClientRect(), u.top >= f.top && u.bottom <= f.bottom || (d.getElement().parentNode && c.getElement().parentNode ? this.autoScroll(n, d.getElement(), c.getElement()) : d.getComponent().scrollTo(void 0, !1)), p.left >= g.left + this.getRowHeaderWidth() && p.right <= g.right || (d.getElement().parentNode && c.getElement().parentNode ? this.autoScroll(n, d.getElement(), c.getElement()) : c.getComponent().scrollTo(void 0, !1)), this.layoutElement(), !0;
  }
  rangeRemoved(e) {
    this.ranges = this.ranges.filter((t) => t !== e), this.activeRange === e && (this.ranges.length ? this.activeRange = this.ranges[this.ranges.length - 1] : this.addRange()), this.layoutElement();
  }
  findJumpRow(e, t, i, s, n) {
    return i && (t = t.reverse()), this.findJumpItem(s, n, t, function(r) {
      return r.getData()[e.getField()];
    });
  }
  findJumpCol(e, t, i, s, n) {
    return i && (t = t.reverse()), this.findJumpItem(s, n, t, function(r) {
      return e.getData()[r.getField()];
    });
  }
  findJumpItem(e, t, i, s) {
    var n;
    for (let r of i) {
      let a = s(r);
      if (e) {
        if (n = r, a)
          break;
      } else if (t) {
        if (n = r, a)
          break;
      } else if (a)
        n = r;
      else
        break;
    }
    return n;
  }
  findJumpCellLeft(e, t) {
    var i = this.getRowByRangePos(e), s = this.getTableColumns(), n = this.isEmpty(i.getData()[s[t].getField()]), r = s[t - 1] ? this.isEmpty(i.getData()[s[t - 1].getField()]) : !1, a = this.rowHeader ? s.slice(1, t) : s.slice(0, t), l = this.findJumpCol(i, a, !0, n, r);
    return l ? l.getPosition() - 1 : t;
  }
  findJumpCellRight(e, t) {
    var i = this.getRowByRangePos(e), s = this.getTableColumns(), n = this.isEmpty(i.getData()[s[t].getField()]), r = s[t + 1] ? this.isEmpty(i.getData()[s[t + 1].getField()]) : !1, a = this.findJumpCol(i, s.slice(t + 1, s.length), !1, n, r);
    return a ? a.getPosition() - 1 : t;
  }
  findJumpCellUp(e, t) {
    var i = this.getColumnByRangePos(t), s = this.getTableRows(), n = this.isEmpty(s[e].getData()[i.getField()]), r = s[e - 1] ? this.isEmpty(s[e - 1].getData()[i.getField()]) : !1, a = this.findJumpRow(i, s.slice(0, e), !0, n, r);
    return a ? a.position - 1 : e;
  }
  findJumpCellDown(e, t) {
    var i = this.getColumnByRangePos(t), s = this.getTableRows(), n = this.isEmpty(s[e].getData()[i.getField()]), r = s[e + 1] ? this.isEmpty(s[e + 1].getData()[i.getField()]) : !1, a = this.findJumpRow(i, s.slice(e + 1, s.length), !1, n, r);
    return a ? a.position - 1 : e;
  }
  ///////////////////////////////////
  ///////      Selection      ///////
  ///////////////////////////////////
  newSelection(e, t) {
    var i;
    if (t.type === "column") {
      if (!this.columnSelection)
        return;
      if (t === this.rowHeader) {
        i = this.resetRanges(), this.selecting = "all";
        var s, n = this.getCell(-1, -1);
        this.rowHeader ? s = this.getCell(0, 1) : s = this.getCell(0, 0), i.setBounds(s, n);
        return;
      } else
        this.selecting = "column";
    } else t.column === this.rowHeader ? this.selecting = "row" : this.selecting = "cell";
    e.shiftKey ? this.activeRange.setBounds(!1, t) : e.ctrlKey ? this.addRange().setBounds(t) : this.resetRanges().setBounds(t);
  }
  autoScroll(e, t, i) {
    var s = this.table.rowManager.element, n, r, a, l;
    typeof t > "u" && (t = this.getRowByRangePos(e.end.row).getElement()), typeof i > "u" && (i = this.getColumnByRangePos(e.end.col).getElement()), n = {
      left: i.offsetLeft,
      right: i.offsetLeft + i.offsetWidth,
      top: t.offsetTop,
      bottom: t.offsetTop + t.offsetHeight
    }, r = {
      left: s.scrollLeft + this.getRowHeaderWidth(),
      right: Math.ceil(s.scrollLeft + s.clientWidth),
      top: s.scrollTop,
      bottom: s.scrollTop + s.offsetHeight - this.table.rowManager.scrollbarWidth
    }, a = r.left < n.left && n.left < r.right && r.left < n.right && n.right < r.right, l = r.top < n.top && n.top < r.bottom && r.top < n.bottom && n.bottom < r.bottom, a || (n.left < r.left ? s.scrollLeft = n.left - this.getRowHeaderWidth() : n.right > r.right && (s.scrollLeft = Math.min(n.right - s.clientWidth, n.left - this.getRowHeaderWidth()))), l || (n.top < r.top ? s.scrollTop = n.top : n.bottom > r.bottom && (s.scrollTop = n.bottom - s.clientHeight));
  }
  ///////////////////////////////////
  ///////       Layout        ///////
  ///////////////////////////////////
  layoutChange() {
    this.overlay.style.visibility = "hidden", clearTimeout(this.layoutChangeTimeout), this.layoutChangeTimeout = setTimeout(this.layoutRanges.bind(this), 200);
  }
  redraw(e) {
    e && (this.selecting = "cell", this.resetRanges(), this.layoutElement());
  }
  layoutElement(e) {
    var t;
    e ? t = this.table.rowManager.getVisibleRows(!0) : t = this.table.rowManager.getRows(), t.forEach((i) => {
      i.type === "row" && (this.layoutRow(i), i.cells.forEach((s) => this.renderCell(s)));
    }), this.getTableColumns().forEach((i) => {
      this.layoutColumn(i);
    }), this.layoutRanges();
  }
  layoutRow(e) {
    var t = e.getElement(), i = !1, s = this.ranges.some((n) => n.occupiesRow(e));
    this.selecting === "row" ? i = s : this.selecting === "all" && (i = !0), t.classList.toggle("tabulator-range-selected", i), t.classList.toggle("tabulator-range-highlight", s);
  }
  layoutColumn(e) {
    var t = e.getElement(), i = !1, s = this.ranges.some((n) => n.occupiesColumn(e));
    this.selecting === "column" ? i = s : this.selecting === "all" && (i = !0), t.classList.toggle("tabulator-range-selected", i), t.classList.toggle("tabulator-range-highlight", s);
  }
  layoutRanges() {
    var e, t, i;
    this.table.initialized && (e = this.getActiveCell(), e && (t = e.getElement(), i = e.row.getElement(), this.table.rtl ? this.activeRangeCellElement.style.right = i.offsetWidth - t.offsetLeft - t.offsetWidth + "px" : this.activeRangeCellElement.style.left = i.offsetLeft + t.offsetLeft + "px", this.activeRangeCellElement.style.top = i.offsetTop + "px", this.activeRangeCellElement.style.width = t.offsetWidth + "px", this.activeRangeCellElement.style.height = i.offsetHeight + "px", this.ranges.forEach((s) => s.layout()), this.overlay.style.visibility = "visible"));
  }
  ///////////////////////////////////
  ///////  Helper Functions   ///////
  ///////////////////////////////////	
  getCell(e, t) {
    var i;
    return t < 0 && (t = this.getTableColumns().length + t, t < 0) ? null : (e < 0 && (e = this.getTableRows().length + e), i = this.table.rowManager.getRowFromPosition(e + 1), i ? i.getCells(!1, !0).filter((s) => s.column.visible)[t] : null);
  }
  getActiveCell() {
    return this.getCell(this.activeRange.start.row, this.activeRange.start.col);
  }
  getRowByRangePos(e) {
    return this.getTableRows()[e];
  }
  getColumnByRangePos(e) {
    return this.getTableColumns()[e];
  }
  getTableRows() {
    return this.table.rowManager.getDisplayRows().filter((e) => e.type === "row");
  }
  getTableColumns() {
    return this.table.columnManager.getVisibleColumnsByIndex();
  }
  addRange(e, t) {
    var i;
    return this.maxRanges !== !0 && this.ranges.length >= this.maxRanges && this.ranges.shift().destroy(), i = new ph(this.table, this, e, t), this.activeRange = i, this.ranges.push(i), this.rangeContainer.appendChild(i.element), i;
  }
  resetRanges() {
    var e, t, i;
    return this.ranges.forEach((s) => s.destroy()), this.ranges = [], e = this.addRange(), this.table.rowManager.activeRows.length && (i = this.table.rowManager.activeRows[0].cells.filter((s) => s.column.visible), t = i[this.rowHeader ? 1 : 0], t && (e.setBounds(t), this.options("selectableRangeAutoFocus") && this.initializeFocus(t))), e;
  }
  tableDestroyed() {
    document.removeEventListener("mouseup", this.mouseUpEvent), this.table.rowManager.element.removeEventListener("keydown", this.keyDownEvent);
  }
  selectedRows(e) {
    return e ? this.activeRange.getRows().map((t) => t.getComponent()) : this.activeRange.getRows();
  }
  selectedColumns(e) {
    return e ? this.activeRange.getColumns().map((t) => t.getComponent()) : this.activeRange.getColumns();
  }
  getRowHeaderWidth() {
    return this.rowHeader ? this.rowHeader.getElement().offsetWidth : 0;
  }
  isEmpty(e) {
    return e == null || e === "";
  }
}
C(zi, "moduleName", "selectRange"), C(zi, "moduleInitOrder", 1), C(zi, "moduleExtensions", Ch);
function Eh(o, e, t, i, s, n, r) {
  var a = r.alignEmptyValues, l = r.decimalSeparator, h = r.thousandSeparator, d = 0;
  if (o = String(o), e = String(e), h && (o = o.split(h).join(""), e = e.split(h).join("")), l && (o = o.split(l).join("."), e = e.split(l).join(".")), o = parseFloat(o), e = parseFloat(e), isNaN(o))
    d = isNaN(e) ? 0 : -1;
  else if (isNaN(e))
    d = 1;
  else
    return o - e;
  return (a === "top" && n === "desc" || a === "bottom" && n === "asc") && (d *= -1), d;
}
function xh(o, e, t, i, s, n, r) {
  var a = r.alignEmptyValues, l = 0, h;
  if (!o)
    l = e ? -1 : 0;
  else if (!e)
    l = 1;
  else {
    switch (typeof r.locale) {
      case "boolean":
        r.locale && (h = this.langLocale());
        break;
      case "string":
        h = r.locale;
        break;
    }
    return String(o).toLowerCase().localeCompare(String(e).toLowerCase(), h);
  }
  return (a === "top" && n === "desc" || a === "bottom" && n === "asc") && (l *= -1), l;
}
function dn(o, e, t, i, s, n, r) {
  var a = this.table.dependencyRegistry.lookup(["luxon", "DateTime"], "DateTime"), l = r.format || "dd/MM/yyyy HH:mm:ss", h = r.alignEmptyValues, d = 0;
  if (typeof a < "u") {
    if (a.isDateTime(o) || (l === "iso" ? o = a.fromISO(String(o)) : o = a.fromFormat(String(o), l)), a.isDateTime(e) || (l === "iso" ? e = a.fromISO(String(e)) : e = a.fromFormat(String(e), l)), !o.isValid)
      d = e.isValid ? -1 : 0;
    else if (!e.isValid)
      d = 1;
    else
      return o - e;
    return (h === "top" && n === "desc" || h === "bottom" && n === "asc") && (d *= -1), d;
  } else
    console.error("Sort Error - 'datetime' sorter is dependant on luxon.js");
}
function _h(o, e, t, i, s, n, r) {
  return r.format || (r.format = "dd/MM/yyyy"), dn.call(this, o, e, t, i, s, n, r);
}
function Rh(o, e, t, i, s, n, r) {
  return r.format || (r.format = "HH:mm"), dn.call(this, o, e, t, i, s, n, r);
}
function kh(o, e, t, i, s, n, r) {
  var a = o === !0 || o === "true" || o === "True" || o === 1 ? 1 : 0, l = e === !0 || e === "true" || e === "True" || e === 1 ? 1 : 0;
  return a - l;
}
function Mh(o, e, t, i, s, n, r) {
  var a = r.type || "length", l = r.alignEmptyValues, h = 0, d = this.table, c;
  r.valueMap && (typeof r.valueMap == "string" ? c = function(f) {
    return f.map((p) => $.retrieveNestedData(d.options.nestedFieldSeparator, r.valueMap, p));
  } : c = r.valueMap);
  function u(f) {
    var p;
    switch (c && (f = c(f)), a) {
      case "length":
        p = f.length;
        break;
      case "sum":
        p = f.reduce(function(g, m) {
          return g + m;
        });
        break;
      case "max":
        p = Math.max.apply(null, f);
        break;
      case "min":
        p = Math.min.apply(null, f);
        break;
      case "avg":
        p = f.reduce(function(g, m) {
          return g + m;
        }) / f.length;
        break;
      case "string":
        p = f.join("");
        break;
    }
    return p;
  }
  if (!Array.isArray(o))
    h = Array.isArray(e) ? -1 : 0;
  else if (!Array.isArray(e))
    h = 1;
  else
    return a === "string" ? String(u(o)).toLowerCase().localeCompare(String(u(e)).toLowerCase()) : u(e) - u(o);
  return (l === "top" && n === "desc" || l === "bottom" && n === "asc") && (h *= -1), h;
}
function Th(o, e, t, i, s, n, r) {
  var a = typeof o > "u" ? 0 : 1, l = typeof e > "u" ? 0 : 1;
  return a - l;
}
function Sh(o, e, t, i, s, n, r) {
  var a, l, h, d, c = 0, u, f = /(\d+)|(\D+)/g, p = /\d/, g = r.alignEmptyValues, m = 0;
  if (!o && o !== 0)
    m = !e && e !== 0 ? 0 : -1;
  else if (!e && e !== 0)
    m = 1;
  else {
    if (isFinite(o) && isFinite(e)) return o - e;
    if (a = String(o).toLowerCase(), l = String(e).toLowerCase(), a === l) return 0;
    if (!(p.test(a) && p.test(l))) return a > l ? 1 : -1;
    for (a = a.match(f), l = l.match(f), u = a.length > l.length ? l.length : a.length; c < u; )
      if (h = a[c], d = l[c++], h !== d)
        return isFinite(h) && isFinite(d) ? (h.charAt(0) === "0" && (h = "." + h), d.charAt(0) === "0" && (d = "." + d), h - d) : h > d ? 1 : -1;
    return a.length > l.length;
  }
  return (g === "top" && n === "desc" || g === "bottom" && n === "asc") && (m *= -1), m;
}
var Lh = {
  number: Eh,
  string: xh,
  date: _h,
  time: Rh,
  datetime: dn,
  boolean: kh,
  array: Mh,
  exists: Th,
  alphanum: Sh
};
const ut = class ut extends A {
  constructor(e) {
    super(e), this.sortList = [], this.changed = !1, this.registerTableOption("sortMode", "local"), this.registerTableOption("initialSort", !1), this.registerTableOption("columnHeaderSortMulti", !0), this.registerTableOption("sortOrderReverse", !1), this.registerTableOption("headerSortElement", "<div class='tabulator-arrow'></div>"), this.registerTableOption("headerSortClickElement", "header"), this.registerColumnOption("sorter"), this.registerColumnOption("sorterParams"), this.registerColumnOption("headerSort", !0), this.registerColumnOption("headerSortStartingDir"), this.registerColumnOption("headerSortTristate");
  }
  initialize() {
    this.subscribe("column-layout", this.initializeColumn.bind(this)), this.subscribe("table-built", this.tableBuilt.bind(this)), this.registerDataHandler(this.sort.bind(this), 20), this.registerTableFunction("setSort", this.userSetSort.bind(this)), this.registerTableFunction("getSorters", this.getSort.bind(this)), this.registerTableFunction("clearSort", this.clearSort.bind(this)), this.table.options.sortMode === "remote" && this.subscribe("data-params", this.remoteSortParams.bind(this));
  }
  tableBuilt() {
    this.table.options.initialSort && this.setSort(this.table.options.initialSort);
  }
  remoteSortParams(e, t, i, s) {
    var n = this.getSort();
    return n.forEach((r) => {
      delete r.column;
    }), s.sort = n, s;
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  userSetSort(e, t) {
    this.setSort(e, t), this.refreshSort();
  }
  clearSort() {
    this.clear(), this.refreshSort();
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  //initialize column header for sorting
  initializeColumn(e) {
    var t = !1, i, s;
    switch (typeof e.definition.sorter) {
      case "string":
        ut.sorters[e.definition.sorter] ? t = ut.sorters[e.definition.sorter] : console.warn("Sort Error - No such sorter found: ", e.definition.sorter);
        break;
      case "function":
        t = e.definition.sorter;
        break;
    }
    if (e.modules.sort = {
      sorter: t,
      dir: "none",
      params: e.definition.sorterParams || {},
      startingDir: e.definition.headerSortStartingDir || "asc",
      tristate: e.definition.headerSortTristate
    }, e.definition.headerSort !== !1) {
      switch (i = e.getElement(), i.classList.add("tabulator-sortable"), s = document.createElement("div"), s.classList.add("tabulator-col-sorter"), this.table.options.headerSortClickElement) {
        case "icon":
          s.classList.add("tabulator-col-sorter-element");
          break;
        case "header":
          i.classList.add("tabulator-col-sorter-element");
          break;
        default:
          i.classList.add("tabulator-col-sorter-element");
          break;
      }
      switch (this.table.options.headerSortElement) {
        case "function":
          break;
        case "object":
          s.appendChild(this.table.options.headerSortElement);
          break;
        default:
          s.innerHTML = this.table.options.headerSortElement;
      }
      e.titleHolderElement.appendChild(s), e.modules.sort.element = s, this.setColumnHeaderSortIcon(e, "none"), this.table.options.headerSortClickElement === "icon" && s.addEventListener("mousedown", (n) => {
        n.stopPropagation();
      }), (this.table.options.headerSortClickElement === "icon" ? s : i).addEventListener("click", (n) => {
        var r = "", a = [], l = !1;
        if (e.modules.sort) {
          if (e.modules.sort.tristate)
            e.modules.sort.dir == "none" ? r = e.modules.sort.startingDir : e.modules.sort.dir == e.modules.sort.startingDir ? r = e.modules.sort.dir == "asc" ? "desc" : "asc" : r = "none";
          else
            switch (e.modules.sort.dir) {
              case "asc":
                r = "desc";
                break;
              case "desc":
                r = "asc";
                break;
              default:
                r = e.modules.sort.startingDir;
            }
          this.table.options.columnHeaderSortMulti && (n.shiftKey || n.ctrlKey) ? (a = this.getSort(), l = a.findIndex((h) => h.field === e.getField()), l > -1 ? (a[l].dir = r, l = a.splice(l, 1)[0], r != "none" && a.push(l)) : r != "none" && a.push({ column: e, dir: r }), this.setSort(a)) : r == "none" ? this.clear() : this.setSort(e, r), this.refreshSort();
        }
      });
    }
  }
  refreshSort() {
    this.table.options.sortMode === "remote" ? this.reloadData(null, !1, !1) : this.refreshData(!0);
  }
  //check if the sorters have changed since last use
  hasChanged() {
    var e = this.changed;
    return this.changed = !1, e;
  }
  //return current sorters
  getSort() {
    var e = this, t = [];
    return e.sortList.forEach(function(i) {
      i.column && t.push({ column: i.column.getComponent(), field: i.column.getField(), dir: i.dir });
    }), t;
  }
  //change sort list and trigger sort
  setSort(e, t) {
    var i = this, s = [];
    Array.isArray(e) || (e = [{ column: e, dir: t }]), e.forEach(function(n) {
      var r;
      r = i.table.columnManager.findColumn(n.column), r ? (n.column = r, s.push(n), i.changed = !0) : console.warn("Sort Warning - Sort field does not exist and is being ignored: ", n.column);
    }), i.sortList = s, this.dispatch("sort-changed");
  }
  //clear sorters
  clear() {
    this.setSort([]);
  }
  //find appropriate sorter for column
  findSorter(e) {
    var t = this.table.rowManager.activeRows[0], i = "string", s, n;
    if (t && (t = t.getData(), s = e.getField(), s))
      switch (n = e.getFieldValue(t), typeof n) {
        case "undefined":
          i = "string";
          break;
        case "boolean":
          i = "boolean";
          break;
        default:
          !isNaN(n) && n !== "" ? i = "number" : n.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+$/i) && (i = "alphanum");
          break;
      }
    return ut.sorters[i];
  }
  //work through sort list sorting data
  sort(e, t) {
    var i = this, s = this.table.options.sortOrderReverse ? i.sortList.slice().reverse() : i.sortList, n = [], r = [];
    return this.subscribedExternal("dataSorting") && this.dispatchExternal("dataSorting", i.getSort()), t || i.clearColumnHeaders(), this.table.options.sortMode !== "remote" ? (s.forEach(function(a, l) {
      var h;
      a.column && (h = a.column.modules.sort, h && (h.sorter || (h.sorter = i.findSorter(a.column)), a.params = typeof h.params == "function" ? h.params(a.column.getComponent(), a.dir) : h.params, n.push(a)), t || i.setColumnHeader(a.column, a.dir));
    }), n.length && i._sortItems(e, n)) : t || s.forEach(function(a, l) {
      i.setColumnHeader(a.column, a.dir);
    }), this.subscribedExternal("dataSorted") && (e.forEach((a) => {
      r.push(a.getComponent());
    }), this.dispatchExternal("dataSorted", i.getSort(), r)), e;
  }
  //clear sort arrows on columns
  clearColumnHeaders() {
    this.table.columnManager.getRealColumns().forEach((e) => {
      e.modules.sort && (e.modules.sort.dir = "none", e.getElement().setAttribute("aria-sort", "none"), this.setColumnHeaderSortIcon(e, "none"));
    });
  }
  //set the column header sort direction
  setColumnHeader(e, t) {
    e.modules.sort.dir = t, e.getElement().setAttribute("aria-sort", t === "asc" ? "ascending" : "descending"), this.setColumnHeaderSortIcon(e, t);
  }
  setColumnHeaderSortIcon(e, t) {
    var i = e.modules.sort.element, s;
    if (e.definition.headerSort && typeof this.table.options.headerSortElement == "function") {
      for (; i.firstChild; ) i.removeChild(i.firstChild);
      s = this.table.options.headerSortElement.call(this.table, e.getComponent(), t), typeof s == "object" ? i.appendChild(s) : i.innerHTML = s;
    }
  }
  //sort each item in sort list
  _sortItems(e, t) {
    var i = t.length - 1;
    e.sort((s, n) => {
      for (var r, a = i; a >= 0; a--) {
        let l = t[a];
        if (r = this._sortRow(s, n, l.column, l.dir, l.params), r !== 0)
          break;
      }
      return r;
    });
  }
  //process individual rows for a sort function on active data
  _sortRow(e, t, i, s, n) {
    var r, a, l = s == "asc" ? e : t, h = s == "asc" ? t : e;
    return e = i.getFieldValue(l.getData()), t = i.getFieldValue(h.getData()), e = typeof e < "u" ? e : "", t = typeof t < "u" ? t : "", r = l.getComponent(), a = h.getComponent(), i.modules.sort.sorter.call(this, e, t, r, a, i.getComponent(), s, n);
  }
};
C(ut, "moduleName", "sort"), //load defaults
C(ut, "sorters", Lh);
let Gs = ut;
class Dh {
  constructor(e, t) {
    this.columnCount = e, this.rowCount = t, this.columnString = [], this.columns = [], this.rows = [];
  }
  genColumns(e) {
    var t = Math.max(this.columnCount, Math.max(...e.map((i) => i.length)));
    this.columnString = [], this.columns = [];
    for (let i = 1; i <= t; i++)
      this.incrementChar(this.columnString.length - 1), this.columns.push(this.columnString.join(""));
    return this.columns;
  }
  genRows(e) {
    var t = Math.max(this.rowCount, e.length);
    this.rows = [];
    for (let i = 1; i <= t; i++)
      this.rows.push(i);
    return this.rows;
  }
  incrementChar(e) {
    let t = this.columnString[e];
    t ? t !== "Z" ? this.columnString[e] = String.fromCharCode(this.columnString[e].charCodeAt(0) + 1) : (this.columnString[e] = "A", e ? this.incrementChar(e - 1) : this.columnString.push("A")) : this.columnString.push("A");
  }
  setRowCount(e) {
    this.rowCount = e;
  }
  setColumnCount(e) {
    this.columnCount = e;
  }
}
class Er {
  constructor(e) {
    return this._sheet = e, new Proxy(this, {
      get: function(t, i, s) {
        return typeof t[i] < "u" ? t[i] : t._sheet.table.componentFunctionBinder.handle("sheet", t._sheet, i);
      }
    });
  }
  getTitle() {
    return this._sheet.title;
  }
  getKey() {
    return this._sheet.key;
  }
  getDefinition() {
    return this._sheet.getDefinition();
  }
  getData() {
    return this._sheet.getData();
  }
  setData(e) {
    return this._sheet.setData(e);
  }
  clear() {
    return this._sheet.clear();
  }
  remove() {
    return this._sheet.remove();
  }
  active() {
    return this._sheet.active();
  }
  setTitle(e) {
    return this._sheet.setTitle(e);
  }
  setRows(e) {
    return this._sheet.setRows(e);
  }
  setColumns(e) {
    return this._sheet.setColumns(e);
  }
}
class Wn extends oe {
  constructor(e, t) {
    super(e.table), this.spreadsheetManager = e, this.definition = t, this.title = this.definition.title || "", this.key = this.definition.key || this.definition.title, this.rowCount = this.definition.rows, this.columnCount = this.definition.columns, this.data = this.definition.data || [], this.element = null, this.isActive = !1, this.grid = new Dh(this.columnCount, this.rowCount), this.defaultColumnDefinition = { width: 100, headerHozAlign: "center", headerSort: !1 }, this.columnDefinition = Object.assign(this.defaultColumnDefinition, this.options("spreadsheetColumnDefinition")), this.columnDefs = [], this.rowDefs = [], this.columnFields = [], this.columns = [], this.rows = [], this.scrollTop = null, this.scrollLeft = null, this.initialize(), this.dispatchExternal("sheetAdded", this.getComponent());
  }
  ///////////////////////////////////
  ///////// Initialization //////////
  ///////////////////////////////////
  initialize() {
    this.initializeElement(), this.initializeColumns(), this.initializeRows();
  }
  reinitialize() {
    this.initializeColumns(), this.initializeRows();
  }
  initializeElement() {
    this.element = document.createElement("div"), this.element.classList.add("tabulator-spreadsheet-tab"), this.element.innerText = this.title, this.element.addEventListener("click", () => {
      this.spreadsheetManager.loadSheet(this);
    });
  }
  initializeColumns() {
    this.grid.setColumnCount(this.columnCount), this.columnFields = this.grid.genColumns(this.data), this.columnDefs = [], this.columnFields.forEach((e) => {
      var t = Object.assign({}, this.columnDefinition);
      t.field = e, t.title = e, this.columnDefs.push(t);
    });
  }
  initializeRows() {
    var e;
    this.grid.setRowCount(this.rowCount), e = this.grid.genRows(this.data), this.rowDefs = [], e.forEach((t, i) => {
      var s = { _id: t }, n = this.data[i];
      n && n.forEach((r, a) => {
        var l = this.columnFields[a];
        l && (s[l] = r);
      }), this.rowDefs.push(s);
    });
  }
  unload() {
    this.isActive = !1, this.scrollTop = this.table.rowManager.scrollTop, this.scrollLeft = this.table.rowManager.scrollLeft, this.data = this.getData(!0), this.element.classList.remove("tabulator-spreadsheet-tab-active");
  }
  load() {
    var e = !this.isActive;
    this.isActive = !0, this.table.blockRedraw(), this.table.setData([]), this.table.setColumns(this.columnDefs), this.table.setData(this.rowDefs), this.table.restoreRedraw(), e && this.scrollTop !== null && (this.table.rowManager.element.scrollLeft = this.scrollLeft, this.table.rowManager.element.scrollTop = this.scrollTop), this.element.classList.add("tabulator-spreadsheet-tab-active"), this.dispatchExternal("sheetLoaded", this.getComponent());
  }
  ///////////////////////////////////
  //////// Helper Functions /////////
  ///////////////////////////////////
  getComponent() {
    return new Er(this);
  }
  getDefinition() {
    return {
      title: this.title,
      key: this.key,
      rows: this.rowCount,
      columns: this.columnCount,
      data: this.getData()
    };
  }
  getData(e) {
    var t = [], i, s, n;
    return this.rowDefs.forEach((r) => {
      var a = [];
      this.columnFields.forEach((l) => {
        a.push(r[l]);
      }), t.push(a);
    }), !e && !this.options("spreadsheetOutputFull") && (i = t.map((r) => r.findLastIndex((a) => typeof a < "u") + 1), s = Math.max(...i), n = i.findLastIndex((r) => r > 0) + 1, t = t.slice(0, n), t = t.map((r) => r.slice(0, s))), t;
  }
  setData(e) {
    this.data = e, this.reinitialize(), this.dispatchExternal("sheetUpdated", this.getComponent()), this.isActive && this.load();
  }
  clear() {
    this.setData([]);
  }
  setTitle(e) {
    this.title = e, this.element.innerText = e, this.dispatchExternal("sheetUpdated", this.getComponent());
  }
  setRows(e) {
    this.rowCount = e, this.initializeRows(), this.dispatchExternal("sheetUpdated", this.getComponent()), this.isActive && this.load();
  }
  setColumns(e) {
    this.columnCount = e, this.reinitialize(), this.dispatchExternal("sheetUpdated", this.getComponent()), this.isActive && this.load();
  }
  remove() {
    this.spreadsheetManager.removeSheet(this);
  }
  destroy() {
    this.element.parentNode && this.element.parentNode.removeChild(this.element), this.dispatchExternal("sheetRemoved", this.getComponent());
  }
  active() {
    this.spreadsheetManager.loadSheet(this);
  }
}
class xr extends A {
  constructor(e) {
    super(e), this.sheets = [], this.element = null, this.registerTableOption("spreadsheet", !1), this.registerTableOption("spreadsheetRows", 50), this.registerTableOption("spreadsheetColumns", 50), this.registerTableOption("spreadsheetColumnDefinition", {}), this.registerTableOption("spreadsheetOutputFull", !1), this.registerTableOption("spreadsheetData", !1), this.registerTableOption("spreadsheetSheets", !1), this.registerTableOption("spreadsheetSheetTabs", !1), this.registerTableOption("spreadsheetSheetTabsElement", !1), this.registerTableFunction("setSheets", this.setSheets.bind(this)), this.registerTableFunction("addSheet", this.addSheet.bind(this)), this.registerTableFunction("getSheets", this.getSheets.bind(this)), this.registerTableFunction("getSheetDefinitions", this.getSheetDefinitions.bind(this)), this.registerTableFunction("setSheetData", this.setSheetData.bind(this)), this.registerTableFunction("getSheet", this.getSheet.bind(this)), this.registerTableFunction("getSheetData", this.getSheetData.bind(this)), this.registerTableFunction("clearSheet", this.clearSheet.bind(this)), this.registerTableFunction("removeSheet", this.removeSheetFunc.bind(this)), this.registerTableFunction("activeSheet", this.activeSheetFunc.bind(this));
  }
  ///////////////////////////////////
  ////// Module Initialization //////
  ///////////////////////////////////
  initialize() {
    this.options("spreadsheet") && (this.subscribe("table-initialized", this.tableInitialized.bind(this)), this.subscribe("data-loaded", this.loadRemoteData.bind(this)), this.table.options.index = "_id", this.options("spreadsheetData") && this.options("spreadsheetSheets") && (console.warn("You cannot use spreadsheetData and spreadsheetSheets at the same time, ignoring spreadsheetData"), this.table.options.spreadsheetData = !1), this.compatibilityCheck(), this.options("spreadsheetSheetTabs") && this.initializeTabset());
  }
  compatibilityCheck() {
    this.options("data") && console.warn("Do not use the data option when working with spreadsheets, use either spreadsheetData or spreadsheetSheets to pass data into the table"), this.options("pagination") && console.warn("The spreadsheet module is not compatible with the pagination module"), this.options("groupBy") && console.warn("The spreadsheet module is not compatible with the row grouping module"), this.options("responsiveCollapse") && console.warn("The spreadsheet module is not compatible with the responsive collapse module");
  }
  initializeTabset() {
    this.element = document.createElement("div"), this.element.classList.add("tabulator-spreadsheet-tabs");
    var e = this.options("spreadsheetSheetTabsElement");
    e && !(e instanceof HTMLElement) && (e = document.querySelector(e), e || console.warn("Unable to find element matching spreadsheetSheetTabsElement selector:", this.options("spreadsheetSheetTabsElement"))), e ? e.appendChild(this.element) : this.footerAppend(this.element);
  }
  tableInitialized() {
    this.sheets.length ? this.loadSheet(this.sheets[0]) : this.options("spreadsheetSheets") ? this.loadSheets(this.options("spreadsheetSheets")) : this.options("spreadsheetData") && this.loadData(this.options("spreadsheetData"));
  }
  ///////////////////////////////////
  /////////// Ajax Parsing //////////
  ///////////////////////////////////
  loadRemoteData(e, t, i) {
    return console.log("data", e, t, i), Array.isArray(e) ? (this.table.dataLoader.clearAlert(), this.dispatchExternal("dataLoaded", e), !e.length || Array.isArray(e[0]) ? this.loadData(e) : this.loadSheets(e)) : console.error(`Spreadsheet Loading Error - Unable to process remote data due to invalid data type 
Expecting: array 
Received: `, typeof e, `
Data:     `, e), !1;
  }
  ///////////////////////////////////
  ///////// Sheet Management ////////
  ///////////////////////////////////
  loadData(e) {
    var t = {
      data: e
    };
    this.loadSheet(this.newSheet(t));
  }
  destroySheets() {
    this.sheets.forEach((e) => {
      e.destroy();
    }), this.sheets = [], this.activeSheet = null;
  }
  loadSheets(e) {
    Array.isArray(e) || (e = []), this.destroySheets(), e.forEach((t) => {
      this.newSheet(t);
    }), this.loadSheet(this.sheets[0]);
  }
  loadSheet(e) {
    this.activeSheet !== e && (this.activeSheet && this.activeSheet.unload(), this.activeSheet = e, e.load());
  }
  newSheet(e = {}) {
    var t;
    return e.rows || (e.rows = this.options("spreadsheetRows")), e.columns || (e.columns = this.options("spreadsheetColumns")), t = new Wn(this, e), this.sheets.push(t), this.element && this.element.appendChild(t.element), t;
  }
  removeSheet(e) {
    var t = this.sheets.indexOf(e), i;
    this.sheets.length > 1 ? t > -1 && (this.sheets.splice(t, 1), e.destroy(), this.activeSheet === e && (i = this.sheets[t - 1] || this.sheets[0], i ? this.loadSheet(i) : this.activeSheet = null)) : console.warn("Unable to remove sheet, at least one sheet must be active");
  }
  lookupSheet(e) {
    return e ? e instanceof Wn ? e : e instanceof Er ? e._sheet : this.sheets.find((t) => t.key === e) || !1 : this.activeSheet;
  }
  ///////////////////////////////////
  //////// Public Functions /////////
  ///////////////////////////////////
  setSheets(e) {
    return this.loadSheets(e), this.getSheets();
  }
  addSheet(e) {
    return this.newSheet(e).getComponent();
  }
  getSheetDefinitions() {
    return this.sheets.map((e) => e.getDefinition());
  }
  getSheets() {
    return this.sheets.map((e) => e.getComponent());
  }
  getSheet(e) {
    var t = this.lookupSheet(e);
    return t ? t.getComponent() : !1;
  }
  setSheetData(e, t) {
    e && !t && (t = e, e = !1);
    var i = this.lookupSheet(e);
    return i ? i.setData(t) : !1;
  }
  getSheetData(e) {
    var t = this.lookupSheet(e);
    return t ? t.getData() : !1;
  }
  clearSheet(e) {
    var t = this.lookupSheet(e);
    return t ? t.clear() : !1;
  }
  removeSheetFunc(e) {
    var t = this.lookupSheet(e);
    t && this.removeSheet(t);
  }
  activeSheetFunc(e) {
    var t = this.lookupSheet(e);
    return t ? this.loadSheet(t) : !1;
  }
}
C(xr, "moduleName", "spreadsheet");
var ws;
let zh = (ws = class extends A {
  constructor(e) {
    super(e), this.tooltipSubscriber = null, this.headerSubscriber = null, this.timeout = null, this.popupInstance = null, this.registerTableOption("tooltipDelay", 300), this.registerColumnOption("tooltip"), this.registerColumnOption("headerTooltip");
  }
  initialize() {
    this.deprecatedOptionsCheck(), this.subscribe("column-init", this.initializeColumn.bind(this));
  }
  deprecatedOptionsCheck() {
  }
  initializeColumn(e) {
    e.definition.headerTooltip && !this.headerSubscriber && (this.headerSubscriber = !0, this.subscribe("column-mousemove", this.mousemoveCheck.bind(this, "headerTooltip")), this.subscribe("column-mouseout", this.mouseoutCheck.bind(this, "headerTooltip"))), e.definition.tooltip && !this.tooltipSubscriber && (this.tooltipSubscriber = !0, this.subscribe("cell-mousemove", this.mousemoveCheck.bind(this, "tooltip")), this.subscribe("cell-mouseout", this.mouseoutCheck.bind(this, "tooltip")));
  }
  mousemoveCheck(e, t, i) {
    var s = e === "tooltip" ? i.column.definition.tooltip : i.definition.headerTooltip;
    s && (this.clearPopup(), this.timeout = setTimeout(this.loadTooltip.bind(this, t, i, s), this.table.options.tooltipDelay));
  }
  mouseoutCheck(e, t, i) {
    this.popupInstance || this.clearPopup();
  }
  clearPopup(e, t, i) {
    clearTimeout(this.timeout), this.timeout = null, this.popupInstance && this.popupInstance.hide();
  }
  loadTooltip(e, t, i) {
    var s, n, r;
    function a(l) {
      n = l;
    }
    typeof i == "function" && (i = i(e, t.getComponent(), a)), i instanceof HTMLElement ? s = i : (s = document.createElement("div"), i === !0 && (t instanceof ui ? i = t.value : t.definition.field ? this.langBind("columns|" + t.definition.field, (l) => {
      s.innerHTML = i = l || t.definition.title;
    }) : i = t.definition.title), s.innerHTML = i), (i || i === 0 || i === !1) && (s.classList.add("tabulator-tooltip"), s.addEventListener("mousemove", (l) => l.preventDefault()), this.popupInstance = this.popup(s), typeof n == "function" && this.popupInstance.renderCallback(n), r = this.popupInstance.containerEventCoords(e), this.popupInstance.show(r.x + 15, r.y + 15).hideOnBlur(() => {
      this.dispatchExternal("TooltipClosed", t.getComponent()), this.popupInstance = null;
    }), this.dispatchExternal("TooltipOpened", t.getComponent()));
  }
}, C(ws, "moduleName", "tooltip"), ws);
var Fh = {
  //is integer
  integer: function(o, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : (e = Number(e), !isNaN(e) && isFinite(e) && Math.floor(e) === e);
  },
  //is float
  float: function(o, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : (e = Number(e), !isNaN(e) && isFinite(e) && e % 1 !== 0);
  },
  //must be a number
  numeric: function(o, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : !isNaN(e);
  },
  //must be a string
  string: function(o, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : isNaN(e);
  },
  //must be alphanumeric
  alphanumeric: function(o, e, t) {
    if (e === "" || e === null || typeof e > "u")
      return !0;
    var i = new RegExp(/^[a-z0-9]+$/i);
    return i.test(e);
  },
  //maximum value
  max: function(o, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : parseFloat(e) <= t;
  },
  //minimum value
  min: function(o, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : parseFloat(e) >= t;
  },
  //starts with  value
  starts: function(o, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : String(e).toLowerCase().startsWith(String(t).toLowerCase());
  },
  //ends with  value
  ends: function(o, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : String(e).toLowerCase().endsWith(String(t).toLowerCase());
  },
  //minimum string length
  minLength: function(o, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : String(e).length >= t;
  },
  //maximum string length
  maxLength: function(o, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : String(e).length <= t;
  },
  //in provided value list
  in: function(o, e, t) {
    return e === "" || e === null || typeof e > "u" ? !0 : (typeof t == "string" && (t = t.split("|")), t.indexOf(e) > -1);
  },
  //must match provided regex
  regex: function(o, e, t) {
    if (e === "" || e === null || typeof e > "u")
      return !0;
    var i = new RegExp(t);
    return i.test(e);
  },
  //value must be unique in this column
  unique: function(o, e, t) {
    if (e === "" || e === null || typeof e > "u")
      return !0;
    var i = !0, s = o.getData(), n = o.getColumn()._getSelf();
    return this.table.rowManager.rows.forEach(function(r) {
      var a = r.getData();
      a !== s && e == n.getFieldValue(a) && (i = !1);
    }), i;
  },
  //must have a value
  required: function(o, e, t) {
    return e !== "" && e !== null && typeof e < "u";
  }
};
const ni = class ni extends A {
  constructor(e) {
    super(e), this.invalidCells = [], this.registerTableOption("validationMode", "blocking"), this.registerColumnOption("validator"), this.registerTableFunction("getInvalidCells", this.getInvalidCells.bind(this)), this.registerTableFunction("clearCellValidation", this.userClearCellValidation.bind(this)), this.registerTableFunction("validate", this.userValidate.bind(this)), this.registerComponentFunction("cell", "isValid", this.cellIsValid.bind(this)), this.registerComponentFunction("cell", "clearValidation", this.clearValidation.bind(this)), this.registerComponentFunction("cell", "validate", this.cellValidate.bind(this)), this.registerComponentFunction("column", "validate", this.columnValidate.bind(this)), this.registerComponentFunction("row", "validate", this.rowValidate.bind(this));
  }
  initialize() {
    this.subscribe("cell-delete", this.clearValidation.bind(this)), this.subscribe("column-layout", this.initializeColumnCheck.bind(this)), this.subscribe("edit-success", this.editValidate.bind(this)), this.subscribe("edit-editor-clear", this.editorClear.bind(this)), this.subscribe("edit-edited-clear", this.editedClear.bind(this));
  }
  ///////////////////////////////////
  ///////// Event Handling //////////
  ///////////////////////////////////
  editValidate(e, t, i) {
    var s = this.table.options.validationMode !== "manual" ? this.validate(e.column.modules.validate, e, t) : !0;
    return s !== !0 && setTimeout(() => {
      e.getElement().classList.add("tabulator-validation-fail"), this.dispatchExternal("validationFailed", e.getComponent(), t, s);
    }), s;
  }
  editorClear(e, t) {
    t && e.column.modules.validate && this.cellValidate(e), e.getElement().classList.remove("tabulator-validation-fail");
  }
  editedClear(e) {
    e.modules.validate && (e.modules.validate.invalid = !1);
  }
  ///////////////////////////////////
  ////////// Cell Functions /////////
  ///////////////////////////////////
  cellIsValid(e) {
    return e.modules.validate && e.modules.validate.invalid || !0;
  }
  cellValidate(e) {
    return this.validate(e.column.modules.validate, e, e.getValue());
  }
  ///////////////////////////////////
  ///////// Column Functions ////////
  ///////////////////////////////////
  columnValidate(e) {
    var t = [];
    return e.cells.forEach((i) => {
      this.cellValidate(i) !== !0 && t.push(i.getComponent());
    }), t.length ? t : !0;
  }
  ///////////////////////////////////
  ////////// Row Functions //////////
  ///////////////////////////////////
  rowValidate(e) {
    var t = [];
    return e.cells.forEach((i) => {
      this.cellValidate(i) !== !0 && t.push(i.getComponent());
    }), t.length ? t : !0;
  }
  ///////////////////////////////////
  ///////// Table Functions /////////
  ///////////////////////////////////
  userClearCellValidation(e) {
    e || (e = this.getInvalidCells()), Array.isArray(e) || (e = [e]), e.forEach((t) => {
      this.clearValidation(t._getSelf());
    });
  }
  userValidate(e) {
    var t = [];
    return this.table.rowManager.rows.forEach((i) => {
      i = i.getComponent();
      var s = i.validate();
      s !== !0 && (t = t.concat(s));
    }), t.length ? t : !0;
  }
  ///////////////////////////////////
  ///////// Internal Logic //////////
  ///////////////////////////////////
  initializeColumnCheck(e) {
    typeof e.definition.validator < "u" && this.initializeColumn(e);
  }
  //validate
  initializeColumn(e) {
    var t = this, i = [], s;
    e.definition.validator && (Array.isArray(e.definition.validator) ? e.definition.validator.forEach((n) => {
      s = t._extractValidator(n), s && i.push(s);
    }) : (s = this._extractValidator(e.definition.validator), s && i.push(s)), e.modules.validate = i.length ? i : !1);
  }
  _extractValidator(e) {
    var t, i, s;
    switch (typeof e) {
      case "string":
        return s = e.indexOf(":"), s > -1 ? (t = e.substring(0, s), i = e.substring(s + 1)) : t = e, this._buildValidator(t, i);
      case "function":
        return this._buildValidator(e);
      case "object":
        return this._buildValidator(e.type, e.parameters);
    }
  }
  _buildValidator(e, t) {
    var i = typeof e == "function" ? e : ni.validators[e];
    return i ? {
      type: typeof e == "function" ? "function" : e,
      func: i,
      params: t
    } : (console.warn("Validator Setup Error - No matching validator found:", e), !1);
  }
  validate(e, t, i) {
    var s = this, n = [], r = this.invalidCells.indexOf(t);
    return e && e.forEach((a) => {
      a.func.call(s, t.getComponent(), i, a.params) || n.push({
        type: a.type,
        parameters: a.params
      });
    }), t.modules.validate || (t.modules.validate = {}), n.length ? (t.modules.validate.invalid = n, this.table.options.validationMode !== "manual" && t.getElement().classList.add("tabulator-validation-fail"), r == -1 && this.invalidCells.push(t)) : (t.modules.validate.invalid = !1, t.getElement().classList.remove("tabulator-validation-fail"), r > -1 && this.invalidCells.splice(r, 1)), n.length ? n : !0;
  }
  getInvalidCells() {
    var e = [];
    return this.invalidCells.forEach((t) => {
      e.push(t.getComponent());
    }), e;
  }
  clearValidation(e) {
    var t;
    e.modules.validate && e.modules.validate.invalid && (e.getElement().classList.remove("tabulator-validation-fail"), e.modules.validate.invalid = !1, t = this.invalidCells.indexOf(e), t > -1 && this.invalidCells.splice(t, 1));
  }
};
C(ni, "moduleName", "validate"), //load defaults
C(ni, "validators", Fh);
let Us = ni;
var as = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccessorModule: _s,
  AjaxModule: Ms,
  ClipboardModule: Ts,
  ColumnCalcsModule: Ss,
  DataTreeModule: hr,
  DownloadModule: Ls,
  EditModule: Ds,
  ExportModule: zs,
  FilterModule: Fs,
  FormatModule: Os,
  FrozenColumnsModule: dr,
  FrozenRowsModule: cr,
  GroupRowsModule: ur,
  HistoryModule: Ps,
  HtmlTableImportModule: fr,
  ImportModule: As,
  InteractionModule: Ql,
  KeybindingsModule: Hs,
  MenuModule: pr,
  MoveColumnsModule: gr,
  MoveRowsModule: Is,
  MutatorModule: Bs,
  PageModule: Vs,
  PersistenceModule: Ns,
  PopupModule: mr,
  PrintModule: br,
  ReactiveDataModule: vr,
  ResizeColumnsModule: wr,
  ResizeRowsModule: yr,
  ResizeTableModule: Cr,
  ResponsiveLayoutModule: Ws,
  SelectRangeModule: zi,
  SelectRowModule: js,
  SortModule: Gs,
  SpreadsheetModule: xr,
  TooltipModule: zh,
  ValidateModule: Us
}), Oh = {
  debugEventsExternal: !1,
  //flag to console log events
  debugEventsInternal: !1,
  //flag to console log events
  debugInvalidOptions: !0,
  //allow toggling of invalid option warnings
  debugInvalidComponentFuncs: !0,
  //allow toggling of invalid component warnings
  debugInitialization: !0,
  //allow toggling of pre initialization function call warnings
  debugDeprecation: !0,
  //allow toggling of deprecation warnings
  height: !1,
  //height of tabulator
  minHeight: !1,
  //minimum height of tabulator
  maxHeight: !1,
  //maximum height of tabulator
  columnHeaderVertAlign: "top",
  //vertical alignment of column headers
  popupContainer: !1,
  columns: [],
  //store for colum header info
  columnDefaults: {},
  //store column default props
  rowHeader: !1,
  data: !1,
  //default starting data
  autoColumns: !1,
  //build columns from data row structure
  autoColumnsDefinitions: !1,
  nestedFieldSeparator: ".",
  //separator for nested data
  footerElement: !1,
  //hold footer element
  index: "id",
  //filed for row index
  textDirection: "auto",
  addRowPos: "bottom",
  //position to insert blank rows, top|bottom
  headerVisible: !0,
  //hide header
  renderVertical: "virtual",
  renderHorizontal: "basic",
  renderVerticalBuffer: 0,
  // set virtual DOM buffer size
  scrollToRowPosition: "top",
  scrollToRowIfVisible: !0,
  scrollToColumnPosition: "left",
  scrollToColumnIfVisible: !0,
  rowFormatter: !1,
  rowFormatterPrint: null,
  rowFormatterClipboard: null,
  rowFormatterHtmlOutput: null,
  rowHeight: null,
  placeholder: !1,
  dataLoader: !0,
  dataLoaderLoading: !1,
  dataLoaderError: !1,
  dataLoaderErrorTimeout: 3e3,
  dataSendParams: {},
  dataReceiveParams: {},
  dependencies: {}
};
class _r {
  constructor(e, t, i = {}) {
    this.table = e, this.msgType = t, this.registeredDefaults = Object.assign({}, i);
  }
  register(e, t) {
    this.registeredDefaults[e] = t;
  }
  generate(e, t = {}) {
    var i = Object.assign({}, this.registeredDefaults), s = this.table.options.debugInvalidOptions || t.debugInvalidOptions === !0;
    Object.assign(i, e);
    for (let n in t)
      i.hasOwnProperty(n) || (s && console.warn("Invalid " + this.msgType + " option:", n), i[n] = t.key);
    for (let n in i)
      n in t ? i[n] = t[n] : Array.isArray(i[n]) ? i[n] = Object.assign([], i[n]) : typeof i[n] == "object" && i[n] !== null ? i[n] = Object.assign({}, i[n]) : typeof i[n] > "u" && delete i[n];
    return i;
  }
}
class Xi extends oe {
  constructor(e) {
    super(e), this.elementVertical = e.rowManager.element, this.elementHorizontal = e.columnManager.element, this.tableElement = e.rowManager.tableElement, this.verticalFillMode = "fit";
  }
  ///////////////////////////////////
  /////// Internal Bindings /////////
  ///////////////////////////////////
  initialize() {
  }
  clearRows() {
  }
  clearColumns() {
  }
  reinitializeColumnWidths(e) {
  }
  renderRows() {
  }
  renderColumns() {
  }
  rerenderRows(e) {
    e && e();
  }
  rerenderColumns(e, t) {
  }
  renderRowCells(e) {
  }
  rerenderRowCells(e, t) {
  }
  scrollColumns(e, t) {
  }
  scrollRows(e, t) {
  }
  resize() {
  }
  scrollToRow(e) {
  }
  scrollToRowNearestTop(e) {
  }
  visibleRows(e) {
    return [];
  }
  ///////////////////////////////////
  //////// Helper Functions /////////
  ///////////////////////////////////
  rows() {
    return this.table.rowManager.getDisplayRows();
  }
  styleRow(e, t) {
    var i = e.getElement();
    t % 2 ? (i.classList.add("tabulator-row-even"), i.classList.remove("tabulator-row-odd")) : (i.classList.add("tabulator-row-odd"), i.classList.remove("tabulator-row-even"));
  }
  ///////////////////////////////////
  /////// External Triggers /////////
  /////// (DO NOT OVERRIDE) /////////
  ///////////////////////////////////
  clear() {
    this.clearRows(), this.clearColumns();
  }
  render() {
    this.renderRows(), this.renderColumns();
  }
  rerender(e) {
    this.rerenderRows(), this.rerenderColumns();
  }
  scrollToRowPosition(e, t, i) {
    var s = this.rows().indexOf(e), n = e.getElement(), r = 0;
    return new Promise((a, l) => {
      if (s > -1) {
        if (typeof i > "u" && (i = this.table.options.scrollToRowIfVisible), !i && $.elVisible(n) && (r = $.elOffset(n).top - $.elOffset(this.elementVertical).top, r > 0 && r < this.elementVertical.clientHeight - n.offsetHeight))
          return a(), !1;
        switch (typeof t > "u" && (t = this.table.options.scrollToRowPosition), t === "nearest" && (t = this.scrollToRowNearestTop(e) ? "top" : "bottom"), this.scrollToRow(e), t) {
          case "middle":
          case "center":
            this.elementVertical.scrollHeight - this.elementVertical.scrollTop == this.elementVertical.clientHeight ? this.elementVertical.scrollTop = this.elementVertical.scrollTop + (n.offsetTop - this.elementVertical.scrollTop) - (this.elementVertical.scrollHeight - n.offsetTop) / 2 : this.elementVertical.scrollTop = this.elementVertical.scrollTop - this.elementVertical.clientHeight / 2;
            break;
          case "bottom":
            this.elementVertical.scrollHeight - this.elementVertical.scrollTop == this.elementVertical.clientHeight ? this.elementVertical.scrollTop = this.elementVertical.scrollTop - (this.elementVertical.scrollHeight - n.offsetTop) + n.offsetHeight : this.elementVertical.scrollTop = this.elementVertical.scrollTop - this.elementVertical.clientHeight + n.offsetHeight;
            break;
          case "top":
            this.elementVertical.scrollTop = n.offsetTop;
            break;
        }
        a();
      } else
        console.warn("Scroll Error - Row not visible"), l("Scroll Error - Row not visible");
    });
  }
}
class Ph extends Xi {
  constructor(e) {
    super(e);
  }
  renderRowCells(e, t) {
    const i = document.createDocumentFragment();
    e.cells.forEach((s) => {
      i.appendChild(s.getElement());
    }), e.element.appendChild(i), t || e.cells.forEach((s) => {
      s.cellRendered();
    });
  }
  reinitializeColumnWidths(e) {
    e.forEach(function(t) {
      t.reinitializeWidth();
    });
  }
}
class Ah extends Xi {
  constructor(e) {
    super(e), this.leftCol = 0, this.rightCol = 0, this.scrollLeft = 0, this.vDomScrollPosLeft = 0, this.vDomScrollPosRight = 0, this.vDomPadLeft = 0, this.vDomPadRight = 0, this.fitDataColAvg = 0, this.windowBuffer = 200, this.visibleRows = null, this.initialized = !1, this.isFitData = !1, this.columns = [];
  }
  initialize() {
    this.compatibilityCheck(), this.layoutCheck(), this.vertScrollListen();
  }
  compatibilityCheck() {
    this.options("layout") == "fitDataTable" && console.warn("Horizontal Virtual DOM is not compatible with fitDataTable layout mode"), this.options("responsiveLayout") && console.warn("Horizontal Virtual DOM is not compatible with responsive columns"), this.options("rtl") && console.warn("Horizontal Virtual DOM is not currently compatible with RTL text direction");
  }
  layoutCheck() {
    this.isFitData = this.options("layout").startsWith("fitData");
  }
  vertScrollListen() {
    this.subscribe("scroll-vertical", this.clearVisRowCache.bind(this)), this.subscribe("data-refreshed", this.clearVisRowCache.bind(this));
  }
  clearVisRowCache() {
    this.visibleRows = null;
  }
  //////////////////////////////////////
  ///////// Public Functions ///////////
  //////////////////////////////////////
  renderColumns(e, t) {
    this.dataChange();
  }
  scrollColumns(e, t) {
    this.scrollLeft != e && (this.scrollLeft = e, this.scroll(e - (this.vDomScrollPosLeft + this.windowBuffer)));
  }
  calcWindowBuffer() {
    var e = this.elementVertical.clientWidth;
    this.table.columnManager.columnsByIndex.forEach((t) => {
      if (t.visible) {
        var i = t.getWidth();
        i > e && (e = i);
      }
    }), this.windowBuffer = e * 2;
  }
  rerenderColumns(e, t) {
    var i = {
      cols: this.columns,
      leftCol: this.leftCol,
      rightCol: this.rightCol
    }, s = 0;
    e && !this.initialized || (this.clear(), this.calcWindowBuffer(), this.scrollLeft = this.elementVertical.scrollLeft, this.vDomScrollPosLeft = this.scrollLeft - this.windowBuffer, this.vDomScrollPosRight = this.scrollLeft + this.elementVertical.clientWidth + this.windowBuffer, this.table.columnManager.columnsByIndex.forEach((n) => {
      var r = {}, a;
      n.visible && (n.modules.frozen || (a = n.getWidth(), r.leftPos = s, r.rightPos = s + a, r.width = a, this.isFitData && (r.fitDataCheck = n.modules.vdomHoz ? n.modules.vdomHoz.fitDataCheck : !0), s + a > this.vDomScrollPosLeft && s < this.vDomScrollPosRight ? (this.leftCol == -1 && (this.leftCol = this.columns.length, this.vDomPadLeft = s), this.rightCol = this.columns.length) : this.leftCol !== -1 && (this.vDomPadRight += a), this.columns.push(n), n.modules.vdomHoz = r, s += a));
    }), this.tableElement.style.paddingLeft = this.vDomPadLeft + "px", this.tableElement.style.paddingRight = this.vDomPadRight + "px", this.initialized = !0, t || (!e || this.reinitChanged(i)) && this.reinitializeRows(), this.elementVertical.scrollLeft = this.scrollLeft);
  }
  renderRowCells(e) {
    if (this.initialized)
      this.initializeRow(e);
    else {
      const t = document.createDocumentFragment();
      e.cells.forEach((i) => {
        t.appendChild(i.getElement());
      }), e.element.appendChild(t), e.cells.forEach((i) => {
        i.cellRendered();
      });
    }
  }
  rerenderRowCells(e, t) {
    this.reinitializeRow(e, t);
  }
  reinitializeColumnWidths(e) {
    for (let t = this.leftCol; t <= this.rightCol; t++) {
      let i = this.columns[t];
      i && i.reinitializeWidth();
    }
  }
  //////////////////////////////////////
  //////// Internal Rendering //////////
  //////////////////////////////////////
  deinitialize() {
    this.initialized = !1;
  }
  clear() {
    this.columns = [], this.leftCol = -1, this.rightCol = 0, this.vDomScrollPosLeft = 0, this.vDomScrollPosRight = 0, this.vDomPadLeft = 0, this.vDomPadRight = 0;
  }
  dataChange() {
    var e = !1, t, i;
    if (this.isFitData) {
      if (this.table.columnManager.columnsByIndex.forEach((s) => {
        !s.definition.width && s.visible && (e = !0);
      }), e && this.table.rowManager.getDisplayRows().length && (this.vDomScrollPosRight = this.scrollLeft + this.elementVertical.clientWidth + this.windowBuffer, t = this.chain("rows-sample", [1], [], () => this.table.rowManager.getDisplayRows())[0], t)) {
        i = t.getElement(), t.generateCells(), this.tableElement.appendChild(i);
        for (let s = 0; s < t.cells.length; s++) {
          let n = t.cells[s];
          i.appendChild(n.getElement()), n.column.reinitializeWidth();
        }
        i.parentNode.removeChild(i), this.rerenderColumns(!1, !0);
      }
    } else
      this.options("layout") === "fitColumns" && (this.layoutRefresh(), this.rerenderColumns(!1, !0));
  }
  reinitChanged(e) {
    var t = !0;
    return e.cols.length !== this.columns.length || e.leftCol !== this.leftCol || e.rightCol !== this.rightCol ? !0 : (e.cols.forEach((i, s) => {
      i !== this.columns[s] && (t = !1);
    }), !t);
  }
  reinitializeRows() {
    var e = this.getVisibleRows(), t = this.table.rowManager.getRows().filter((i) => !e.includes(i));
    e.forEach((i) => {
      this.reinitializeRow(i, !0);
    }), t.forEach((i) => {
      i.deinitialize();
    });
  }
  getVisibleRows() {
    return this.visibleRows || (this.visibleRows = this.table.rowManager.getVisibleRows()), this.visibleRows;
  }
  scroll(e) {
    this.vDomScrollPosLeft += e, this.vDomScrollPosRight += e, Math.abs(e) > this.windowBuffer / 2 ? this.rerenderColumns() : e > 0 ? (this.addColRight(), this.removeColLeft()) : (this.addColLeft(), this.removeColRight());
  }
  colPositionAdjust(e, t, i) {
    for (let s = e; s < t; s++) {
      let n = this.columns[s];
      n.modules.vdomHoz.leftPos += i, n.modules.vdomHoz.rightPos += i;
    }
  }
  addColRight() {
    for (var e = !1, t = !0; t; ) {
      let i = this.columns[this.rightCol + 1];
      i && i.modules.vdomHoz.leftPos <= this.vDomScrollPosRight ? (e = !0, this.getVisibleRows().forEach((s) => {
        if (s.type !== "group") {
          var n = s.getCell(i);
          s.getElement().insertBefore(n.getElement(), s.getCell(this.columns[this.rightCol]).getElement().nextSibling), n.cellRendered();
        }
      }), this.fitDataColActualWidthCheck(i), this.rightCol++, this.getVisibleRows().forEach((s) => {
        s.type !== "group" && (s.modules.vdomHoz.rightCol = this.rightCol);
      }), this.rightCol >= this.columns.length - 1 ? this.vDomPadRight = 0 : this.vDomPadRight -= i.getWidth()) : t = !1;
    }
    e && (this.tableElement.style.paddingRight = this.vDomPadRight + "px");
  }
  addColLeft() {
    for (var e = !1, t = !0; t; ) {
      let i = this.columns[this.leftCol - 1];
      if (i)
        if (i.modules.vdomHoz.rightPos >= this.vDomScrollPosLeft) {
          e = !0, this.getVisibleRows().forEach((n) => {
            if (n.type !== "group") {
              var r = n.getCell(i);
              n.getElement().insertBefore(r.getElement(), n.getCell(this.columns[this.leftCol]).getElement()), r.cellRendered();
            }
          }), this.leftCol--, this.getVisibleRows().forEach((n) => {
            n.type !== "group" && (n.modules.vdomHoz.leftCol = this.leftCol);
          }), this.leftCol <= 0 ? this.vDomPadLeft = 0 : this.vDomPadLeft -= i.getWidth();
          let s = this.fitDataColActualWidthCheck(i);
          s && (this.scrollLeft = this.elementVertical.scrollLeft = this.elementVertical.scrollLeft + s, this.vDomPadRight -= s);
        } else
          t = !1;
      else
        t = !1;
    }
    e && (this.tableElement.style.paddingLeft = this.vDomPadLeft + "px");
  }
  removeColRight() {
    for (var e = !1, t = !0; t; ) {
      let i = this.columns[this.rightCol];
      i && i.modules.vdomHoz.leftPos > this.vDomScrollPosRight ? (e = !0, this.getVisibleRows().forEach((s) => {
        if (s.type !== "group") {
          var n = s.getCell(i);
          try {
            s.getElement().removeChild(n.getElement());
          } catch (r) {
            console.warn("Could not removeColRight", r.message);
          }
        }
      }), this.vDomPadRight += i.getWidth(), this.rightCol--, this.getVisibleRows().forEach((s) => {
        s.type !== "group" && (s.modules.vdomHoz.rightCol = this.rightCol);
      })) : t = !1;
    }
    e && (this.tableElement.style.paddingRight = this.vDomPadRight + "px");
  }
  removeColLeft() {
    for (var e = !1, t = !0; t; ) {
      let i = this.columns[this.leftCol];
      i && i.modules.vdomHoz.rightPos < this.vDomScrollPosLeft ? (e = !0, this.getVisibleRows().forEach((s) => {
        if (s.type !== "group") {
          var n = s.getCell(i);
          try {
            s.getElement().removeChild(n.getElement());
          } catch (r) {
            console.warn("Could not removeColLeft", r.message);
          }
        }
      }), this.vDomPadLeft += i.getWidth(), this.leftCol++, this.getVisibleRows().forEach((s) => {
        s.type !== "group" && (s.modules.vdomHoz.leftCol = this.leftCol);
      })) : t = !1;
    }
    e && (this.tableElement.style.paddingLeft = this.vDomPadLeft + "px");
  }
  fitDataColActualWidthCheck(e) {
    var t, i;
    return e.modules.vdomHoz.fitDataCheck && (e.reinitializeWidth(), t = e.getWidth(), i = t - e.modules.vdomHoz.width, i && (e.modules.vdomHoz.rightPos += i, e.modules.vdomHoz.width = t, this.colPositionAdjust(this.columns.indexOf(e) + 1, this.columns.length, i)), e.modules.vdomHoz.fitDataCheck = !1), i;
  }
  initializeRow(e) {
    if (e.type !== "group") {
      e.modules.vdomHoz = {
        leftCol: this.leftCol,
        rightCol: this.rightCol
      }, this.table.modules.frozenColumns && this.table.modules.frozenColumns.leftColumns.forEach((t) => {
        this.appendCell(e, t);
      });
      for (let t = this.leftCol; t <= this.rightCol; t++)
        this.appendCell(e, this.columns[t]);
      this.table.modules.frozenColumns && this.table.modules.frozenColumns.rightColumns.forEach((t) => {
        this.appendCell(e, t);
      });
    }
  }
  appendCell(e, t) {
    if (t && t.visible) {
      let i = e.getCell(t);
      e.getElement().appendChild(i.getElement()), i.cellRendered();
    }
  }
  reinitializeRow(e, t) {
    if (e.type !== "group" && (t || !e.modules.vdomHoz || e.modules.vdomHoz.leftCol !== this.leftCol || e.modules.vdomHoz.rightCol !== this.rightCol)) {
      for (var i = e.getElement(); i.firstChild; ) i.removeChild(i.firstChild);
      this.initializeRow(e);
    }
  }
}
class Hh extends oe {
  constructor(e) {
    super(e), this.blockHozScrollEvent = !1, this.headersElement = null, this.contentsElement = null, this.rowHeader = null, this.element = null, this.columns = [], this.columnsByIndex = [], this.columnsByField = {}, this.scrollLeft = 0, this.optionsList = new _r(this.table, "column definition", lr), this.redrawBlock = !1, this.redrawBlockUpdate = null, this.renderer = null;
  }
  ////////////// Setup Functions /////////////////
  initialize() {
    this.initializeRenderer(), this.headersElement = this.createHeadersElement(), this.contentsElement = this.createHeaderContentsElement(), this.element = this.createHeaderElement(), this.contentsElement.insertBefore(this.headersElement, this.contentsElement.firstChild), this.element.insertBefore(this.contentsElement, this.element.firstChild), this.initializeScrollWheelWatcher(), this.subscribe("scroll-horizontal", this.scrollHorizontal.bind(this)), this.subscribe("scrollbar-vertical", this.padVerticalScrollbar.bind(this));
  }
  padVerticalScrollbar(e) {
    this.table.rtl ? this.headersElement.style.marginLeft = e + "px" : this.headersElement.style.marginRight = e + "px";
  }
  initializeRenderer() {
    var e, t = {
      virtual: Ah,
      basic: Ph
    };
    typeof this.table.options.renderHorizontal == "string" ? e = t[this.table.options.renderHorizontal] : e = this.table.options.renderHorizontal, e ? (this.renderer = new e(this.table, this.element, this.tableElement), this.renderer.initialize()) : console.error("Unable to find matching renderer:", this.table.options.renderHorizontal);
  }
  createHeadersElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-headers"), e.setAttribute("role", "row"), e;
  }
  createHeaderContentsElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-header-contents"), e.setAttribute("role", "rowgroup"), e;
  }
  createHeaderElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-header"), e.setAttribute("role", "rowgroup"), this.table.options.headerVisible || e.classList.add("tabulator-header-hidden"), e;
  }
  //return containing element
  getElement() {
    return this.element;
  }
  //return containing contents element
  getContentsElement() {
    return this.contentsElement;
  }
  //return header containing element
  getHeadersElement() {
    return this.headersElement;
  }
  //scroll horizontally to match table body
  scrollHorizontal(e) {
    this.contentsElement.scrollLeft = e, this.scrollLeft = e, this.renderer.scrollColumns(e);
  }
  initializeScrollWheelWatcher() {
    this.contentsElement.addEventListener("wheel", (e) => {
      var t;
      e.deltaX && (t = this.contentsElement.scrollLeft + e.deltaX, this.table.rowManager.scrollHorizontal(t), this.table.columnManager.scrollHorizontal(t));
    });
  }
  ///////////// Column Setup Functions /////////////
  generateColumnsFromRowData(e) {
    var t = [], i = {}, s = this.table.options.autoColumns === "full" ? e : [e[0]], n = this.table.options.autoColumnsDefinitions;
    if (e && e.length) {
      if (s.forEach((r) => {
        Object.keys(r).forEach((a, l) => {
          let h = r[a], d;
          i[a] ? i[a] !== !0 && typeof h < "u" && (i[a].sorter = this.calculateSorterFromValue(h), i[a] = !0) : (d = {
            field: a,
            title: a,
            sorter: this.calculateSorterFromValue(h)
          }, t.splice(l, 0, d), i[a] = typeof h > "u" ? d : !0);
        });
      }), n)
        switch (typeof n) {
          case "function":
            this.table.options.columns = n.call(this.table, t);
            break;
          case "object":
            Array.isArray(n) ? t.forEach((r) => {
              var a = n.find((l) => l.field === r.field);
              a && Object.assign(r, a);
            }) : t.forEach((r) => {
              n[r.field] && Object.assign(r, n[r.field]);
            }), this.table.options.columns = t;
            break;
        }
      else
        this.table.options.columns = t;
      this.setColumns(this.table.options.columns);
    }
  }
  calculateSorterFromValue(e) {
    var t;
    switch (typeof e) {
      case "undefined":
        t = "string";
        break;
      case "boolean":
        t = "boolean";
        break;
      case "number":
        t = "number";
        break;
      case "object":
        Array.isArray(e) ? t = "array" : t = "string";
        break;
      default:
        !isNaN(e) && e !== "" ? t = "number" : e.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+$/i) ? t = "alphanum" : t = "string";
        break;
    }
    return t;
  }
  setColumns(e, t) {
    for (; this.headersElement.firstChild; ) this.headersElement.removeChild(this.headersElement.firstChild);
    this.columns = [], this.columnsByIndex = [], this.columnsByField = {}, this.dispatch("columns-loading"), this.dispatchExternal("columnsLoading"), this.table.options.rowHeader && (this.rowHeader = new gt(this.table.options.rowHeader === !0 ? {} : this.table.options.rowHeader, this, !0), this.columns.push(this.rowHeader), this.headersElement.appendChild(this.rowHeader.getElement()), this.rowHeader.columnRendered()), e.forEach((i, s) => {
      this._addColumn(i);
    }), this._reIndexColumns(), this.dispatch("columns-loaded"), this.subscribedExternal("columnsLoaded") && this.dispatchExternal("columnsLoaded", this.getComponents()), this.rerenderColumns(!1, !0), this.redraw(!0);
  }
  _addColumn(e, t, i) {
    var s = new gt(e, this), n = s.getElement(), r = i && this.findColumnIndex(i);
    if (t && this.rowHeader && (!i || i === this.rowHeader) && (t = !1, i = this.rowHeader, r = 0), i && r > -1) {
      var a = i.getTopColumn(), l = this.columns.indexOf(a), h = a.getElement();
      t ? (this.columns.splice(l, 0, s), h.parentNode.insertBefore(n, h)) : (this.columns.splice(l + 1, 0, s), h.parentNode.insertBefore(n, h.nextSibling));
    } else
      t ? (this.columns.unshift(s), this.headersElement.insertBefore(s.getElement(), this.headersElement.firstChild)) : (this.columns.push(s), this.headersElement.appendChild(s.getElement()));
    return s.columnRendered(), s;
  }
  registerColumnField(e) {
    e.definition.field && (this.columnsByField[e.definition.field] = e);
  }
  registerColumnPosition(e) {
    this.columnsByIndex.push(e);
  }
  _reIndexColumns() {
    this.columnsByIndex = [], this.columns.forEach(function(e) {
      e.reRegisterPosition();
    });
  }
  //ensure column headers take up the correct amount of space in column groups
  verticalAlignHeaders() {
    var e = 0;
    this.redrawBlock || (this.headersElement.style.height = "", this.columns.forEach((t) => {
      t.clearVerticalAlign();
    }), this.columns.forEach((t) => {
      var i = t.getHeight();
      i > e && (e = i);
    }), this.headersElement.style.height = e + "px", this.columns.forEach((t) => {
      t.verticalAlign(this.table.options.columnHeaderVertAlign, e);
    }), this.table.rowManager.adjustTableSize());
  }
  //////////////// Column Details /////////////////
  findColumn(e) {
    var t;
    if (typeof e == "object") {
      if (e instanceof gt)
        return e;
      if (e instanceof ar)
        return e._getSelf() || !1;
      if (typeof HTMLElement < "u" && e instanceof HTMLElement)
        return t = [], this.columns.forEach((s) => {
          t.push(s), t = t.concat(s.getColumns(!0));
        }), t.find((s) => s.element === e) || !1;
    } else
      return this.columnsByField[e] || !1;
    return !1;
  }
  getColumnByField(e) {
    return this.columnsByField[e];
  }
  getColumnsByFieldRoot(e) {
    var t = [];
    return Object.keys(this.columnsByField).forEach((i) => {
      var s = this.table.options.nestedFieldSeparator ? i.split(this.table.options.nestedFieldSeparator)[0] : i;
      s === e && t.push(this.columnsByField[i]);
    }), t;
  }
  getColumnByIndex(e) {
    return this.columnsByIndex[e];
  }
  getFirstVisibleColumn() {
    var e = this.columnsByIndex.findIndex((t) => t.visible);
    return e > -1 ? this.columnsByIndex[e] : !1;
  }
  getVisibleColumnsByIndex() {
    return this.columnsByIndex.filter((e) => e.visible);
  }
  getColumns() {
    return this.columns;
  }
  findColumnIndex(e) {
    return this.columnsByIndex.findIndex((t) => e === t);
  }
  //return all columns that are not groups
  getRealColumns() {
    return this.columnsByIndex;
  }
  //traverse across columns and call action
  traverse(e) {
    this.columnsByIndex.forEach((t, i) => {
      e(t, i);
    });
  }
  //get definitions of actual columns
  getDefinitions(e) {
    var t = [];
    return this.columnsByIndex.forEach((i) => {
      (!e || e && i.visible) && t.push(i.getDefinition());
    }), t;
  }
  //get full nested definition tree
  getDefinitionTree() {
    var e = [];
    return this.columns.forEach((t) => {
      e.push(t.getDefinition(!0));
    }), e;
  }
  getComponents(e) {
    var t = [], i = e ? this.columns : this.columnsByIndex;
    return i.forEach((s) => {
      t.push(s.getComponent());
    }), t;
  }
  getWidth() {
    var e = 0;
    return this.columnsByIndex.forEach((t) => {
      t.visible && (e += t.getWidth());
    }), e;
  }
  moveColumn(e, t, i) {
    t.element.parentNode.insertBefore(e.element, t.element), i && t.element.parentNode.insertBefore(t.element, e.element), this.moveColumnActual(e, t, i), this.verticalAlignHeaders(), this.table.rowManager.reinitialize();
  }
  moveColumnActual(e, t, i) {
    e.parent.isGroup ? this._moveColumnInArray(e.parent.columns, e, t, i) : this._moveColumnInArray(this.columns, e, t, i), this._moveColumnInArray(this.columnsByIndex, e, t, i, !0), this.rerenderColumns(!0), this.dispatch("column-moved", e, t, i), this.subscribedExternal("columnMoved") && this.dispatchExternal("columnMoved", e.getComponent(), this.table.columnManager.getComponents());
  }
  _moveColumnInArray(e, t, i, s, n) {
    var r = e.indexOf(t), a, l = [];
    r > -1 && (e.splice(r, 1), a = e.indexOf(i), a > -1 ? s && (a = a + 1) : a = r, e.splice(a, 0, t), n && (l = this.chain("column-moving-rows", [t, i, s], null, []) || [], l = l.concat(this.table.rowManager.rows), l.forEach(function(h) {
      if (h.cells.length) {
        var d = h.cells.splice(r, 1)[0];
        h.cells.splice(a, 0, d);
      }
    })));
  }
  scrollToColumn(e, t, i) {
    var s = 0, n = e.getLeftOffset(), r = 0, a = e.getElement();
    return new Promise((l, h) => {
      if (typeof t > "u" && (t = this.table.options.scrollToColumnPosition), typeof i > "u" && (i = this.table.options.scrollToColumnIfVisible), e.visible) {
        switch (t) {
          case "middle":
          case "center":
            r = -this.element.clientWidth / 2;
            break;
          case "right":
            r = a.clientWidth - this.headersElement.clientWidth;
            break;
        }
        if (!i && n > 0 && n + a.offsetWidth < this.element.clientWidth)
          return !1;
        s = n + r, s = Math.max(Math.min(s, this.table.rowManager.element.scrollWidth - this.table.rowManager.element.clientWidth), 0), this.table.rowManager.scrollHorizontal(s), this.scrollHorizontal(s), l();
      } else
        console.warn("Scroll Error - Column not visible"), h("Scroll Error - Column not visible");
    });
  }
  //////////////// Cell Management /////////////////
  generateCells(e) {
    var t = [];
    return this.columnsByIndex.forEach((i) => {
      t.push(i.generateCell(e));
    }), t;
  }
  //////////////// Column Management /////////////////
  getFlexBaseWidth() {
    var e = this.table.element.clientWidth, t = 0;
    return this.table.rowManager.element.scrollHeight > this.table.rowManager.element.clientHeight && (e -= this.table.rowManager.element.offsetWidth - this.table.rowManager.element.clientWidth), this.columnsByIndex.forEach(function(i) {
      var s, n, r;
      i.visible && (s = i.definition.width || 0, n = parseInt(i.minWidth), typeof s == "string" ? s.indexOf("%") > -1 ? r = e / 100 * parseInt(s) : r = parseInt(s) : r = s, t += r > n ? r : n);
    }), t;
  }
  addColumn(e, t, i) {
    return new Promise((s, n) => {
      var r = this._addColumn(e, t, i);
      this._reIndexColumns(), this.dispatch("column-add", e, t, i), this.layoutMode() != "fitColumns" && r.reinitializeWidth(), this.redraw(!0), this.table.rowManager.reinitialize(), this.rerenderColumns(), s(r);
    });
  }
  //remove column from system
  deregisterColumn(e) {
    var t = e.getField(), i;
    t && delete this.columnsByField[t], i = this.columnsByIndex.indexOf(e), i > -1 && this.columnsByIndex.splice(i, 1), i = this.columns.indexOf(e), i > -1 && this.columns.splice(i, 1), this.verticalAlignHeaders(), this.redraw();
  }
  rerenderColumns(e, t) {
    this.redrawBlock ? (e === !1 || e === !0 && this.redrawBlockUpdate === null) && (this.redrawBlockUpdate = e) : this.renderer.rerenderColumns(e, t);
  }
  blockRedraw() {
    this.redrawBlock = !0, this.redrawBlockUpdate = null;
  }
  restoreRedraw() {
    this.redrawBlock = !1, this.verticalAlignHeaders(), this.renderer.rerenderColumns(this.redrawBlockUpdate);
  }
  //redraw columns
  redraw(e) {
    $.elVisible(this.element) && this.verticalAlignHeaders(), e && (this.table.rowManager.resetScroll(), this.table.rowManager.reinitialize()), this.confirm("table-redrawing", e) || this.layoutRefresh(e), this.dispatch("table-redraw", e), this.table.footerManager.redraw();
  }
}
class Ih extends Xi {
  constructor(e) {
    super(e), this.verticalFillMode = "fill", this.scrollTop = 0, this.scrollLeft = 0, this.scrollTop = 0, this.scrollLeft = 0;
  }
  clearRows() {
    for (var e = this.tableElement; e.firstChild; ) e.removeChild(e.firstChild);
    e.scrollTop = 0, e.scrollLeft = 0, e.style.minWidth = "", e.style.minHeight = "", e.style.display = "", e.style.visibility = "";
  }
  renderRows() {
    var e = this.tableElement, t = !0, i = document.createDocumentFragment(), s = this.rows();
    s.forEach((n, r) => {
      this.styleRow(n, r), n.initialize(!1, !0), n.type !== "group" && (t = !1), i.appendChild(n.getElement());
    }), e.appendChild(i), s.forEach((n) => {
      n.rendered(), n.heightInitialized || n.calcHeight(!0);
    }), s.forEach((n) => {
      n.heightInitialized || n.setCellHeight();
    }), t ? e.style.minWidth = this.table.columnManager.getWidth() + "px" : e.style.minWidth = "";
  }
  rerenderRows(e) {
    this.clearRows(), e && e(), this.renderRows(), this.rows().length || this.table.rowManager.tableEmpty();
  }
  scrollToRowNearestTop(e) {
    var t = $.elOffset(e.getElement()).top;
    return !(Math.abs(this.elementVertical.scrollTop - t) > Math.abs(this.elementVertical.scrollTop + this.elementVertical.clientHeight - t));
  }
  scrollToRow(e) {
    var t = e.getElement();
    this.elementVertical.scrollTop = $.elOffset(t).top - $.elOffset(this.elementVertical).top + this.elementVertical.scrollTop;
  }
  visibleRows(e) {
    return this.rows();
  }
}
class Bh extends Xi {
  constructor(e) {
    super(e), this.verticalFillMode = "fill", this.scrollTop = 0, this.scrollLeft = 0, this.vDomRowHeight = 20, this.vDomTop = 0, this.vDomBottom = 0, this.vDomScrollPosTop = 0, this.vDomScrollPosBottom = 0, this.vDomTopPad = 0, this.vDomBottomPad = 0, this.vDomMaxRenderChain = 90, this.vDomWindowBuffer = 0, this.vDomWindowMinTotalRows = 20, this.vDomWindowMinMarginRows = 5, this.vDomTopNewRows = [], this.vDomBottomNewRows = [];
  }
  //////////////////////////////////////
  ///////// Public Functions ///////////
  //////////////////////////////////////
  clearRows() {
    for (var e = this.tableElement; e.firstChild; ) e.removeChild(e.firstChild);
    e.style.paddingTop = "", e.style.paddingBottom = "", e.style.minHeight = "", e.style.display = "", e.style.visibility = "", this.elementVertical.scrollTop = 0, this.elementVertical.scrollLeft = 0, this.scrollTop = 0, this.scrollLeft = 0, this.vDomTop = 0, this.vDomBottom = 0, this.vDomTopPad = 0, this.vDomBottomPad = 0, this.vDomScrollPosTop = 0, this.vDomScrollPosBottom = 0;
  }
  renderRows() {
    this._virtualRenderFill();
  }
  rerenderRows(e) {
    for (var t = this.elementVertical.scrollTop, i = !1, s = !1, n = this.table.rowManager.scrollLeft, r = this.rows(), a = this.vDomTop; a <= this.vDomBottom; a++)
      if (r[a]) {
        var l = t - r[a].getElement().offsetTop;
        if (s === !1 || Math.abs(l) < s)
          s = l, i = a;
        else
          break;
      }
    r.forEach((h) => {
      h.deinitializeHeight();
    }), e && e(), this.rows().length ? this._virtualRenderFill(i === !1 ? this.rows.length - 1 : i, !0, s || 0) : (this.clear(), this.table.rowManager.tableEmpty()), this.scrollColumns(n);
  }
  scrollColumns(e) {
    this.table.rowManager.scrollHorizontal(e);
  }
  scrollRows(e, t) {
    var i = e - this.vDomScrollPosTop, s = e - this.vDomScrollPosBottom, n = this.vDomWindowBuffer * 2, r = this.rows();
    if (this.scrollTop = e, -i > n || s > n) {
      var a = this.table.rowManager.scrollLeft;
      this._virtualRenderFill(Math.floor(this.elementVertical.scrollTop / this.elementVertical.scrollHeight * r.length)), this.scrollColumns(a);
    } else
      t ? (i < 0 && this._addTopRow(r, -i), s < 0 && (this.vDomScrollHeight - this.scrollTop > this.vDomWindowBuffer ? this._removeBottomRow(r, -s) : this.vDomScrollPosBottom = this.scrollTop)) : (s >= 0 && this._addBottomRow(r, s), i >= 0 && (this.scrollTop > this.vDomWindowBuffer ? this._removeTopRow(r, i) : this.vDomScrollPosTop = this.scrollTop));
  }
  resize() {
    this.vDomWindowBuffer = this.table.options.renderVerticalBuffer || this.elementVertical.clientHeight;
  }
  scrollToRowNearestTop(e) {
    var t = this.rows().indexOf(e);
    return !(Math.abs(this.vDomTop - t) > Math.abs(this.vDomBottom - t));
  }
  scrollToRow(e) {
    var t = this.rows().indexOf(e);
    t > -1 && this._virtualRenderFill(t, !0);
  }
  visibleRows(e) {
    var t = this.elementVertical.scrollTop, i = this.elementVertical.clientHeight + t, s = !1, n = 0, r = 0, a = this.rows();
    if (e)
      n = this.vDomTop, r = this.vDomBottom;
    else
      for (var l = this.vDomTop; l <= this.vDomBottom; l++)
        if (a[l])
          if (s)
            if (i - a[l].getElement().offsetTop >= 0)
              r = l;
            else
              break;
          else if (t - a[l].getElement().offsetTop >= 0)
            n = l;
          else if (s = !0, i - a[l].getElement().offsetTop >= 0)
            r = l;
          else
            break;
    return a.slice(n, r + 1);
  }
  //////////////////////////////////////
  //////// Internal Rendering //////////
  //////////////////////////////////////
  //full virtual render
  _virtualRenderFill(e, t, i) {
    var s = this.tableElement, n = this.elementVertical, r = 0, a = 0, l = 0, h = 0, d = 0, c = 0, u = this.rows(), f = u.length, p = 0, g, m, v = [], x = 0, E = 0, k = this.table.rowManager.fixedHeight, y = this.elementVertical.clientHeight, S = this.table.options.rowHeight, D = !0;
    if (e = e || 0, i = i || 0, !e)
      this.clear();
    else {
      for (; s.firstChild; ) s.removeChild(s.firstChild);
      h = (f - e + 1) * this.vDomRowHeight, h < y && (e -= Math.ceil((y - h) / this.vDomRowHeight), e < 0 && (e = 0)), r = Math.min(Math.max(Math.floor(this.vDomWindowBuffer / this.vDomRowHeight), this.vDomWindowMinMarginRows), e), e -= r;
    }
    if (f && $.elVisible(this.elementVertical)) {
      for (this.vDomTop = e, this.vDomBottom = e - 1, k || this.table.options.maxHeight ? (S && (E = y / S + this.vDomWindowBuffer / S), E = Math.max(this.vDomWindowMinTotalRows, Math.ceil(E))) : E = f; (E == f || a <= y + this.vDomWindowBuffer || x < this.vDomWindowMinTotalRows) && this.vDomBottom < f - 1; ) {
        for (v = [], m = document.createDocumentFragment(), c = 0; c < E && this.vDomBottom < f - 1; )
          p = this.vDomBottom + 1, g = u[p], this.styleRow(g, p), g.initialize(!1, !0), !g.heightInitialized && !this.table.options.rowHeight && g.clearCellHeight(), m.appendChild(g.getElement()), v.push(g), this.vDomBottom++, c++;
        if (!v.length)
          break;
        s.appendChild(m), v.forEach((T) => {
          T.rendered(), T.heightInitialized || T.calcHeight(!0);
        }), v.forEach((T) => {
          T.heightInitialized || T.setCellHeight();
        }), v.forEach((T) => {
          l = T.getHeight(), x < r ? d += l : a += l, l > this.vDomWindowBuffer && (this.vDomWindowBuffer = l * 2), x++;
        }), D = this.table.rowManager.adjustTableSize(), y = this.elementVertical.clientHeight, D && (k || this.table.options.maxHeight) && (S = a / x, E = Math.max(this.vDomWindowMinTotalRows, Math.ceil(y / S + this.vDomWindowBuffer / S)));
      }
      e ? (this.vDomTopPad = t ? this.vDomRowHeight * this.vDomTop + i : this.scrollTop - d, this.vDomBottomPad = this.vDomBottom == f - 1 ? 0 : Math.max(this.vDomScrollHeight - this.vDomTopPad - a - d, 0)) : (this.vDomTopPad = 0, this.vDomRowHeight = Math.floor((a + d) / x), this.vDomBottomPad = this.vDomRowHeight * (f - this.vDomBottom - 1), this.vDomScrollHeight = d + a + this.vDomBottomPad - y), s.style.paddingTop = this.vDomTopPad + "px", s.style.paddingBottom = this.vDomBottomPad + "px", t && (this.scrollTop = this.vDomTopPad + d + i - (this.elementVertical.scrollWidth > this.elementVertical.clientWidth ? this.elementVertical.offsetHeight - y : 0)), this.scrollTop = Math.min(this.scrollTop, this.elementVertical.scrollHeight - y), this.elementVertical.scrollWidth > this.elementVertical.clientWidth && t && (this.scrollTop += this.elementVertical.offsetHeight - y), this.vDomScrollPosTop = this.scrollTop, this.vDomScrollPosBottom = this.scrollTop, n.scrollTop = this.scrollTop, this.dispatch("render-virtual-fill");
    }
  }
  _addTopRow(e, t) {
    for (var i = this.tableElement, s = [], n = 0, r = this.vDomTop - 1, a = 0, l = !0; l; )
      if (this.vDomTop) {
        let h = e[r], d, c;
        h && a < this.vDomMaxRenderChain ? (d = h.getHeight() || this.vDomRowHeight, c = h.initialized, t >= d ? (this.styleRow(h, r), i.insertBefore(h.getElement(), i.firstChild), (!h.initialized || !h.heightInitialized) && s.push(h), h.initialize(), c || (d = h.getElement().offsetHeight, d > this.vDomWindowBuffer && (this.vDomWindowBuffer = d * 2)), t -= d, n += d, this.vDomTop--, r--, a++) : l = !1) : l = !1;
      } else
        l = !1;
    for (let h of s)
      h.clearCellHeight();
    this._quickNormalizeRowHeight(s), n && (this.vDomTopPad -= n, this.vDomTopPad < 0 && (this.vDomTopPad = r * this.vDomRowHeight), r < 1 && (this.vDomTopPad = 0), i.style.paddingTop = this.vDomTopPad + "px", this.vDomScrollPosTop -= n);
  }
  _removeTopRow(e, t) {
    for (var i = [], s = 0, n = 0, r = !0; r; ) {
      let a = e[this.vDomTop], l;
      a && n < this.vDomMaxRenderChain ? (l = a.getHeight() || this.vDomRowHeight, t >= l ? (this.vDomTop++, t -= l, s += l, i.push(a), n++) : r = !1) : r = !1;
    }
    for (let a of i) {
      let l = a.getElement();
      l.parentNode && l.parentNode.removeChild(l);
    }
    s && (this.vDomTopPad += s, this.tableElement.style.paddingTop = this.vDomTopPad + "px", this.vDomScrollPosTop += this.vDomTop ? s : s + this.vDomWindowBuffer);
  }
  _addBottomRow(e, t) {
    for (var i = this.tableElement, s = [], n = 0, r = this.vDomBottom + 1, a = 0, l = !0; l; ) {
      let h = e[r], d, c;
      h && a < this.vDomMaxRenderChain ? (d = h.getHeight() || this.vDomRowHeight, c = h.initialized, t >= d ? (this.styleRow(h, r), i.appendChild(h.getElement()), (!h.initialized || !h.heightInitialized) && s.push(h), h.initialize(), c || (d = h.getElement().offsetHeight, d > this.vDomWindowBuffer && (this.vDomWindowBuffer = d * 2)), t -= d, n += d, this.vDomBottom++, r++, a++) : l = !1) : l = !1;
    }
    for (let h of s)
      h.clearCellHeight();
    this._quickNormalizeRowHeight(s), n && (this.vDomBottomPad -= n, (this.vDomBottomPad < 0 || r == e.length - 1) && (this.vDomBottomPad = 0), i.style.paddingBottom = this.vDomBottomPad + "px", this.vDomScrollPosBottom += n);
  }
  _removeBottomRow(e, t) {
    for (var i = [], s = 0, n = 0, r = !0; r; ) {
      let a = e[this.vDomBottom], l;
      a && n < this.vDomMaxRenderChain ? (l = a.getHeight() || this.vDomRowHeight, t >= l ? (this.vDomBottom--, t -= l, s += l, i.push(a), n++) : r = !1) : r = !1;
    }
    for (let a of i) {
      let l = a.getElement();
      l.parentNode && l.parentNode.removeChild(l);
    }
    s && (this.vDomBottomPad += s, this.vDomBottomPad < 0 && (this.vDomBottomPad = 0), this.tableElement.style.paddingBottom = this.vDomBottomPad + "px", this.vDomScrollPosBottom -= s);
  }
  _quickNormalizeRowHeight(e) {
    for (let t of e)
      t.calcHeight();
    for (let t of e)
      t.setCellHeight();
  }
}
class Vh extends oe {
  constructor(e) {
    super(e), this.element = this.createHolderElement(), this.tableElement = this.createTableElement(), this.heightFixer = this.createTableElement(), this.placeholder = null, this.placeholderContents = null, this.firstRender = !1, this.renderMode = "virtual", this.fixedHeight = !1, this.rows = [], this.activeRowsPipeline = [], this.activeRows = [], this.activeRowsCount = 0, this.displayRows = [], this.displayRowsCount = 0, this.scrollTop = 0, this.scrollLeft = 0, this.redrawBlock = !1, this.redrawBlockRestoreConfig = !1, this.redrawBlockRenderInPosition = !1, this.dataPipeline = [], this.displayPipeline = [], this.scrollbarWidth = 0, this.renderer = null;
  }
  //////////////// Setup Functions /////////////////
  createHolderElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-tableholder"), e.setAttribute("tabindex", 0), e;
  }
  createTableElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-table"), e.setAttribute("role", "rowgroup"), e;
  }
  initializePlaceholder() {
    var e = this.table.options.placeholder;
    if (typeof e == "function" && (e = e.call(this.table)), e = this.chain("placeholder", [e], e, e) || e, e) {
      let t = document.createElement("div");
      if (t.classList.add("tabulator-placeholder"), typeof e == "string") {
        let i = document.createElement("div");
        i.classList.add("tabulator-placeholder-contents"), i.innerHTML = e, t.appendChild(i), this.placeholderContents = i;
      } else typeof HTMLElement < "u" && e instanceof HTMLElement ? (t.appendChild(e), this.placeholderContents = e) : (console.warn("Invalid placeholder provided, must be string or HTML Element", e), this.el = null);
      this.placeholder = t;
    }
  }
  //return containing element
  getElement() {
    return this.element;
  }
  //return table element
  getTableElement() {
    return this.tableElement;
  }
  initialize() {
    this.initializePlaceholder(), this.initializeRenderer(), this.element.appendChild(this.tableElement), this.firstRender = !0, this.element.addEventListener("scroll", () => {
      var e = this.element.scrollLeft, t = this.scrollLeft > e, i = this.element.scrollTop, s = this.scrollTop > i;
      this.scrollLeft != e && (this.scrollLeft = e, this.dispatch("scroll-horizontal", e, t), this.dispatchExternal("scrollHorizontal", e, t), this._positionPlaceholder()), this.scrollTop != i && (this.scrollTop = i, this.renderer.scrollRows(i, s), this.dispatch("scroll-vertical", i, s), this.dispatchExternal("scrollVertical", i, s));
    });
  }
  ////////////////// Row Manipulation //////////////////
  findRow(e) {
    if (typeof e == "object") {
      if (e instanceof ae)
        return e;
      if (e instanceof Ui)
        return e._getSelf() || !1;
      if (typeof HTMLElement < "u" && e instanceof HTMLElement)
        return this.rows.find((i) => i.getElement() === e) || !1;
      if (e === null)
        return !1;
    } else return typeof e > "u" ? !1 : this.rows.find((i) => i.data[this.table.options.index] == e) || !1;
    return !1;
  }
  getRowFromDataObject(e) {
    var t = this.rows.find((i) => i.data === e);
    return t || !1;
  }
  getRowFromPosition(e) {
    return this.getDisplayRows().find((t) => t.type === "row" && t.getPosition() === e && t.isDisplayed());
  }
  scrollToRow(e, t, i) {
    return this.renderer.scrollToRowPosition(e, t, i);
  }
  ////////////////// Data Handling //////////////////
  setData(e, t, i) {
    return new Promise((s, n) => {
      t && this.getDisplayRows().length ? this.table.options.pagination ? this._setDataActual(e, !0) : this.reRenderInPosition(() => {
        this._setDataActual(e);
      }) : (this.table.options.autoColumns && i && this.table.initialized && this.table.columnManager.generateColumnsFromRowData(e), this.resetScroll(), this._setDataActual(e)), s();
    });
  }
  _setDataActual(e, t) {
    this.dispatchExternal("dataProcessing", e), this._wipeElements(), Array.isArray(e) ? (this.dispatch("data-processing", e), e.forEach((i, s) => {
      if (i && typeof i == "object") {
        var n = new ae(i, this);
        this.rows.push(n);
      } else
        console.warn("Data Loading Warning - Invalid row data detected and ignored, expecting object but received:", i);
    }), this.refreshActiveData(!1, !1, t), this.dispatch("data-processed", e), this.dispatchExternal("dataProcessed", e)) : console.error(`Data Loading Error - Unable to process data due to invalid data type 
Expecting: array 
Received: `, typeof e, `
Data:     `, e);
  }
  _wipeElements() {
    this.dispatch("rows-wipe"), this.destroy(), this.adjustTableSize(), this.dispatch("rows-wiped");
  }
  destroy() {
    this.rows.forEach((e) => {
      e.wipe();
    }), this.rows = [], this.activeRows = [], this.activeRowsPipeline = [], this.activeRowsCount = 0, this.displayRows = [], this.displayRowsCount = 0;
  }
  deleteRow(e, t) {
    var i = this.rows.indexOf(e), s = this.activeRows.indexOf(e);
    s > -1 && this.activeRows.splice(s, 1), i > -1 && this.rows.splice(i, 1), this.setActiveRows(this.activeRows), this.displayRowIterator((n) => {
      var r = n.indexOf(e);
      r > -1 && n.splice(r, 1);
    }), t || this.reRenderInPosition(), this.regenerateRowPositions(), this.dispatchExternal("rowDeleted", e.getComponent()), this.displayRowsCount || this.tableEmpty(), this.subscribedExternal("dataChanged") && this.dispatchExternal("dataChanged", this.getData());
  }
  addRow(e, t, i, s) {
    var n = this.addRowActual(e, t, i, s);
    return n;
  }
  //add multiple rows
  addRows(e, t, i, s) {
    var n = [];
    return new Promise((r, a) => {
      t = this.findAddRowPos(t), Array.isArray(e) || (e = [e]), (typeof i > "u" && t || typeof i < "u" && !t) && e.reverse(), e.forEach((l, h) => {
        var d = this.addRow(l, t, i, !0);
        n.push(d), this.dispatch("row-added", d, l, t, i);
      }), this.refreshActiveData(s ? "displayPipeline" : !1, !1, !0), this.regenerateRowPositions(), this.displayRowsCount && this._clearPlaceholder(), r(n);
    });
  }
  findAddRowPos(e) {
    return typeof e > "u" && (e = this.table.options.addRowPos), e === "pos" && (e = !0), e === "bottom" && (e = !1), e;
  }
  addRowActual(e, t, i, s) {
    var n = e instanceof ae ? e : new ae(e || {}, this), r = this.findAddRowPos(t), a = -1, l, h;
    return i || (h = this.chain("row-adding-position", [n, r], null, { index: i, top: r }), i = h.index, r = h.top), typeof i < "u" && (i = this.findRow(i)), i = this.chain("row-adding-index", [n, i, r], null, i), i && (a = this.rows.indexOf(i)), i && a > -1 ? (l = this.activeRows.indexOf(i), this.displayRowIterator(function(d) {
      var c = d.indexOf(i);
      c > -1 && d.splice(r ? c : c + 1, 0, n);
    }), l > -1 && this.activeRows.splice(r ? l : l + 1, 0, n), this.rows.splice(r ? a : a + 1, 0, n)) : r ? (this.displayRowIterator(function(d) {
      d.unshift(n);
    }), this.activeRows.unshift(n), this.rows.unshift(n)) : (this.displayRowIterator(function(d) {
      d.push(n);
    }), this.activeRows.push(n), this.rows.push(n)), this.setActiveRows(this.activeRows), this.dispatchExternal("rowAdded", n.getComponent()), this.subscribedExternal("dataChanged") && this.dispatchExternal("dataChanged", this.table.rowManager.getData()), s || this.reRenderInPosition(), n;
  }
  moveRow(e, t, i) {
    this.dispatch("row-move", e, t, i), this.moveRowActual(e, t, i), this.regenerateRowPositions(), this.dispatch("row-moved", e, t, i), this.dispatchExternal("rowMoved", e.getComponent());
  }
  moveRowActual(e, t, i) {
    this.moveRowInArray(this.rows, e, t, i), this.moveRowInArray(this.activeRows, e, t, i), this.displayRowIterator((s) => {
      this.moveRowInArray(s, e, t, i);
    }), this.dispatch("row-moving", e, t, i);
  }
  moveRowInArray(e, t, i, s) {
    var n, r, a, l;
    if (t !== i && (n = e.indexOf(t), n > -1 && (e.splice(n, 1), r = e.indexOf(i), r > -1 ? s ? e.splice(r + 1, 0, t) : e.splice(r, 0, t) : e.splice(n, 0, t)), e === this.getDisplayRows())) {
      a = n < r ? n : r, l = r > n ? r : n + 1;
      for (let h = a; h <= l; h++)
        e[h] && this.styleRow(e[h], h);
    }
  }
  clearData() {
    this.setData([]);
  }
  getRowIndex(e) {
    return this.findRowIndex(e, this.rows);
  }
  getDisplayRowIndex(e) {
    var t = this.getDisplayRows().indexOf(e);
    return t > -1 ? t : !1;
  }
  nextDisplayRow(e, t) {
    var i = this.getDisplayRowIndex(e), s = !1;
    return i !== !1 && i < this.displayRowsCount - 1 && (s = this.getDisplayRows()[i + 1]), s && (!(s instanceof ae) || s.type != "row") ? this.nextDisplayRow(s, t) : s;
  }
  prevDisplayRow(e, t) {
    var i = this.getDisplayRowIndex(e), s = !1;
    return i && (s = this.getDisplayRows()[i - 1]), t && s && (!(s instanceof ae) || s.type != "row") ? this.prevDisplayRow(s, t) : s;
  }
  findRowIndex(e, t) {
    var i;
    return e = this.findRow(e), e && (i = t.indexOf(e), i > -1) ? i : !1;
  }
  getData(e, t) {
    var i = [], s = this.getRows(e);
    return s.forEach(function(n) {
      n.type == "row" && i.push(n.getData(t || "data"));
    }), i;
  }
  getComponents(e) {
    var t = [], i = this.getRows(e);
    return i.forEach(function(s) {
      t.push(s.getComponent());
    }), t;
  }
  getDataCount(e) {
    var t = this.getRows(e);
    return t.length;
  }
  scrollHorizontal(e) {
    this.scrollLeft = e, this.element.scrollLeft = e, this.dispatch("scroll-horizontal", e);
  }
  registerDataPipelineHandler(e, t) {
    typeof t < "u" ? (this.dataPipeline.push({ handler: e, priority: t }), this.dataPipeline.sort((i, s) => i.priority - s.priority)) : console.error("Data pipeline handlers must have a priority in order to be registered");
  }
  registerDisplayPipelineHandler(e, t) {
    typeof t < "u" ? (this.displayPipeline.push({ handler: e, priority: t }), this.displayPipeline.sort((i, s) => i.priority - s.priority)) : console.error("Display pipeline handlers must have a priority in order to be registered");
  }
  //set active data set
  refreshActiveData(e, t, i) {
    var s = this.table, n = "", r = 0, a = ["all", "dataPipeline", "display", "displayPipeline", "end"];
    if (!this.table.destroyed) {
      if (typeof e == "function")
        if (r = this.dataPipeline.findIndex((l) => l.handler === e), r > -1)
          n = "dataPipeline", t && (r == this.dataPipeline.length - 1 ? n = "display" : r++);
        else if (r = this.displayPipeline.findIndex((l) => l.handler === e), r > -1)
          n = "displayPipeline", t && (r == this.displayPipeline.length - 1 ? n = "end" : r++);
        else {
          console.error("Unable to refresh data, invalid handler provided", e);
          return;
        }
      else
        n = e || "all", r = 0;
      if (this.redrawBlock) {
        (!this.redrawBlockRestoreConfig || this.redrawBlockRestoreConfig && (this.redrawBlockRestoreConfig.stage === n && r < this.redrawBlockRestoreConfig.index || a.indexOf(n) < a.indexOf(this.redrawBlockRestoreConfig.stage))) && (this.redrawBlockRestoreConfig = {
          handler: e,
          skipStage: t,
          renderInPosition: i,
          stage: n,
          index: r
        });
        return;
      } else
        $.elVisible(this.element) ? i ? this.reRenderInPosition(this.refreshPipelines.bind(this, e, n, r, i)) : (this.refreshPipelines(e, n, r, i), e || this.table.columnManager.renderer.renderColumns(), this.renderTable(), s.options.layoutColumnsOnNewData && this.table.columnManager.redraw(!0)) : this.refreshPipelines(e, n, r, i), this.dispatch("data-refreshed");
    }
  }
  refreshPipelines(e, t, i, s) {
    switch (this.dispatch("data-refreshing"), (!e || !this.activeRowsPipeline[0]) && (this.activeRowsPipeline[0] = this.rows.slice(0)), t) {
      case "all":
      case "dataPipeline":
        for (let n = i; n < this.dataPipeline.length; n++) {
          let r = this.dataPipeline[n].handler(this.activeRowsPipeline[n].slice(0));
          this.activeRowsPipeline[n + 1] = r || this.activeRowsPipeline[n].slice(0);
        }
        this.setActiveRows(this.activeRowsPipeline[this.dataPipeline.length]);
      case "display":
        i = 0, this.resetDisplayRows();
      case "displayPipeline":
        for (let n = i; n < this.displayPipeline.length; n++) {
          let r = this.displayPipeline[n].handler((n ? this.getDisplayRows(n - 1) : this.activeRows).slice(0), s);
          this.setDisplayRows(r || this.getDisplayRows(n - 1).slice(0), n);
        }
      case "end":
        this.regenerateRowPositions();
    }
    this.getDisplayRows().length && this._clearPlaceholder();
  }
  //regenerate row positions
  regenerateRowPositions() {
    var e = this.getDisplayRows(), t = 1;
    e.forEach((i) => {
      i.type === "row" && (i.setPosition(t), t++);
    });
  }
  setActiveRows(e) {
    this.activeRows = this.activeRows = Object.assign([], e), this.activeRowsCount = this.activeRows.length;
  }
  //reset display rows array
  resetDisplayRows() {
    this.displayRows = [], this.displayRows.push(this.activeRows.slice(0)), this.displayRowsCount = this.displayRows[0].length;
  }
  //set display row pipeline data
  setDisplayRows(e, t) {
    this.displayRows[t] = e, t == this.displayRows.length - 1 && (this.displayRowsCount = this.displayRows[this.displayRows.length - 1].length);
  }
  getDisplayRows(e) {
    return typeof e > "u" ? this.displayRows.length ? this.displayRows[this.displayRows.length - 1] : [] : this.displayRows[e] || [];
  }
  getVisibleRows(e, t) {
    var i = Object.assign([], this.renderer.visibleRows(!t));
    return e && (i = this.chain("rows-visible", [t], i, i)), i;
  }
  //repeat action across display rows
  displayRowIterator(e) {
    this.activeRowsPipeline.forEach(e), this.displayRows.forEach(e), this.displayRowsCount = this.displayRows[this.displayRows.length - 1].length;
  }
  //return only actual rows (not group headers etc)
  getRows(e) {
    var t = [];
    switch (e) {
      case "active":
        t = this.activeRows;
        break;
      case "display":
        t = this.table.rowManager.getDisplayRows();
        break;
      case "visible":
        t = this.getVisibleRows(!1, !0);
        break;
      default:
        t = this.chain("rows-retrieve", e, null, this.rows) || this.rows;
    }
    return t;
  }
  ///////////////// Table Rendering /////////////////
  //trigger rerender of table in current position
  reRenderInPosition(e) {
    this.redrawBlock ? e ? e() : this.redrawBlockRenderInPosition = !0 : (this.dispatchExternal("renderStarted"), this.renderer.rerenderRows(e), this.fixedHeight || this.adjustTableSize(), this.scrollBarCheck(), this.dispatchExternal("renderComplete"));
  }
  scrollBarCheck() {
    var e = 0;
    this.element.scrollHeight > this.element.clientHeight && (e = this.element.offsetWidth - this.element.clientWidth), e !== this.scrollbarWidth && (this.scrollbarWidth = e, this.dispatch("scrollbar-vertical", e));
  }
  initializeRenderer() {
    var e, t = {
      virtual: Bh,
      basic: Ih
    };
    typeof this.table.options.renderVertical == "string" ? e = t[this.table.options.renderVertical] : e = this.table.options.renderVertical, e ? (this.renderMode = this.table.options.renderVertical, this.renderer = new e(this.table, this.element, this.tableElement), this.renderer.initialize(), (this.table.element.clientHeight || this.table.options.height) && !(this.table.options.minHeight && this.table.options.maxHeight) ? this.fixedHeight = !0 : this.fixedHeight = !1) : console.error("Unable to find matching renderer:", this.table.options.renderVertical);
  }
  getRenderMode() {
    return this.renderMode;
  }
  renderTable() {
    this.dispatchExternal("renderStarted"), this.element.scrollTop = 0, this._clearTable(), this.displayRowsCount ? (this.renderer.renderRows(), this.firstRender && (this.firstRender = !1, this.fixedHeight || this.adjustTableSize(), this.layoutRefresh(!0))) : this.renderEmptyScroll(), this.fixedHeight || this.adjustTableSize(), this.dispatch("table-layout"), this.displayRowsCount || this._showPlaceholder(), this.scrollBarCheck(), this.dispatchExternal("renderComplete");
  }
  //show scrollbars on empty table div
  renderEmptyScroll() {
    this.placeholder ? this.tableElement.style.display = "none" : this.tableElement.style.minWidth = this.table.columnManager.getWidth() + "px";
  }
  _clearTable() {
    this._clearPlaceholder(), this.scrollTop = 0, this.scrollLeft = 0, this.renderer.clearRows();
  }
  tableEmpty() {
    this.renderEmptyScroll(), this._showPlaceholder();
  }
  checkPlaceholder() {
    this.displayRowsCount ? this._clearPlaceholder() : this.tableEmpty();
  }
  _showPlaceholder() {
    this.placeholder && (this.placeholder && this.placeholder.parentNode && this.placeholder.parentNode.removeChild(this.placeholder), this.initializePlaceholder(), this.placeholder.setAttribute("tabulator-render-mode", this.renderMode), this.getElement().appendChild(this.placeholder), this._positionPlaceholder(), this.adjustTableSize());
  }
  _clearPlaceholder() {
    this.placeholder && this.placeholder.parentNode && this.placeholder.parentNode.removeChild(this.placeholder), this.tableElement.style.minWidth = "", this.tableElement.style.display = "";
  }
  _positionPlaceholder() {
    this.placeholder && this.placeholder.parentNode && (this.placeholder.style.width = this.table.columnManager.getWidth() + "px", this.placeholderContents.style.width = this.table.rowManager.element.clientWidth + "px", this.placeholderContents.style.marginLeft = this.scrollLeft + "px");
  }
  styleRow(e, t) {
    var i = e.getElement();
    t % 2 ? (i.classList.add("tabulator-row-even"), i.classList.remove("tabulator-row-odd")) : (i.classList.add("tabulator-row-odd"), i.classList.remove("tabulator-row-even"));
  }
  //normalize height of active rows
  normalizeHeight(e) {
    this.activeRows.forEach(function(t) {
      t.normalizeHeight(e);
    });
  }
  //adjust the height of the table holder to fit in the Tabulator element
  adjustTableSize() {
    let e = this.element.clientHeight, t, i = !1;
    if (this.renderer.verticalFillMode === "fill") {
      let s = Math.floor(this.table.columnManager.getElement().getBoundingClientRect().height + (this.table.footerManager && this.table.footerManager.active && !this.table.footerManager.external ? this.table.footerManager.getElement().getBoundingClientRect().height : 0));
      if (this.fixedHeight) {
        t = isNaN(this.table.options.minHeight) ? this.table.options.minHeight : this.table.options.minHeight + "px";
        const n = "calc(100% - " + s + "px)";
        this.element.style.minHeight = t || "calc(100% - " + s + "px)", this.element.style.height = n, this.element.style.maxHeight = n;
      } else
        this.element.style.height = "", this.element.style.height = this.table.element.clientHeight - s + "px", this.element.scrollTop = this.scrollTop;
      this.renderer.resize(), !this.fixedHeight && e != this.element.clientHeight && (i = !0, this.subscribed("table-resize") ? this.dispatch("table-resize") : this.redraw()), this.scrollBarCheck();
    }
    return this._positionPlaceholder(), i;
  }
  //reinitialize all rows
  reinitialize() {
    this.rows.forEach(function(e) {
      e.reinitialize(!0);
    });
  }
  //prevent table from being redrawn
  blockRedraw() {
    this.redrawBlock = !0, this.redrawBlockRestoreConfig = !1;
  }
  //restore table redrawing
  restoreRedraw() {
    this.redrawBlock = !1, this.redrawBlockRestoreConfig ? (this.refreshActiveData(this.redrawBlockRestoreConfig.handler, this.redrawBlockRestoreConfig.skipStage, this.redrawBlockRestoreConfig.renderInPosition), this.redrawBlockRestoreConfig = !1) : this.redrawBlockRenderInPosition && this.reRenderInPosition(), this.redrawBlockRenderInPosition = !1;
  }
  //redraw table
  redraw(e) {
    this.adjustTableSize(), this.table.tableWidth = this.table.element.clientWidth, e ? this.renderTable() : (this.reRenderInPosition(), this.scrollHorizontal(this.scrollLeft));
  }
  resetScroll() {
    if (this.element.scrollLeft = 0, this.element.scrollTop = 0, this.table.browser === "ie") {
      var e = document.createEvent("Event");
      e.initEvent("scroll", !1, !0), this.element.dispatchEvent(e);
    } else
      this.element.dispatchEvent(new Event("scroll"));
  }
}
class Nh extends oe {
  constructor(e) {
    super(e), this.active = !1, this.element = this.createElement(), this.containerElement = this.createContainerElement(), this.external = !1;
  }
  initialize() {
    this.initializeElement();
  }
  createElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-footer"), e;
  }
  createContainerElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-footer-contents"), this.element.appendChild(e), e;
  }
  initializeElement() {
    if (this.table.options.footerElement)
      switch (typeof this.table.options.footerElement) {
        case "string":
          this.table.options.footerElement[0] === "<" ? this.containerElement.innerHTML = this.table.options.footerElement : (this.external = !0, this.containerElement = document.querySelector(this.table.options.footerElement));
          break;
        default:
          this.element = this.table.options.footerElement;
          break;
      }
  }
  getElement() {
    return this.element;
  }
  append(e) {
    this.activate(), this.containerElement.appendChild(e), this.table.rowManager.adjustTableSize();
  }
  prepend(e) {
    this.activate(), this.element.insertBefore(e, this.element.firstChild), this.table.rowManager.adjustTableSize();
  }
  remove(e) {
    e.parentNode.removeChild(e), this.deactivate();
  }
  deactivate(e) {
    (!this.element.firstChild || e) && (this.external || this.element.parentNode.removeChild(this.element), this.active = !1);
  }
  activate() {
    this.active || (this.active = !0, this.external || (this.table.element.appendChild(this.getElement()), this.table.element.style.display = ""));
  }
  redraw() {
    this.dispatch("footer-redraw");
  }
}
class Wh extends oe {
  constructor(e) {
    super(e), this.el = null, this.abortClasses = ["tabulator-headers", "tabulator-table"], this.previousTargets = {}, this.listeners = [
      "click",
      "dblclick",
      "contextmenu",
      "mouseenter",
      "mouseleave",
      "mouseover",
      "mouseout",
      "mousemove",
      "mouseup",
      "mousedown",
      "touchstart",
      "touchend"
    ], this.componentMap = {
      "tabulator-cell": "cell",
      "tabulator-row": "row",
      "tabulator-group": "group",
      "tabulator-col": "column"
    }, this.pseudoTrackers = {
      row: {
        subscriber: null,
        target: null
      },
      cell: {
        subscriber: null,
        target: null
      },
      group: {
        subscriber: null,
        target: null
      },
      column: {
        subscriber: null,
        target: null
      }
    }, this.pseudoTracking = !1;
  }
  initialize() {
    this.el = this.table.element, this.buildListenerMap(), this.bindSubscriptionWatchers();
  }
  buildListenerMap() {
    var e = {};
    this.listeners.forEach((t) => {
      e[t] = {
        handler: null,
        components: []
      };
    }), this.listeners = e;
  }
  bindPseudoEvents() {
    Object.keys(this.pseudoTrackers).forEach((e) => {
      this.pseudoTrackers[e].subscriber = this.pseudoMouseEnter.bind(this, e), this.subscribe(e + "-mouseover", this.pseudoTrackers[e].subscriber);
    }), this.pseudoTracking = !0;
  }
  pseudoMouseEnter(e, t, i) {
    this.pseudoTrackers[e].target !== i && (this.pseudoTrackers[e].target && this.dispatch(e + "-mouseleave", t, this.pseudoTrackers[e].target), this.pseudoMouseLeave(e, t), this.pseudoTrackers[e].target = i, this.dispatch(e + "-mouseenter", t, i));
  }
  pseudoMouseLeave(e, t) {
    var i = Object.keys(this.pseudoTrackers), s = {
      row: ["cell"],
      cell: ["row"]
    };
    i = i.filter((n) => {
      var r = s[e];
      return n !== e && (!r || r && !r.includes(n));
    }), i.forEach((n) => {
      var r = this.pseudoTrackers[n].target;
      this.pseudoTrackers[n].target && (this.dispatch(n + "-mouseleave", t, r), this.pseudoTrackers[n].target = null);
    });
  }
  bindSubscriptionWatchers() {
    var e = Object.keys(this.listeners), t = Object.values(this.componentMap);
    for (let i of t)
      for (let s of e) {
        let n = i + "-" + s;
        this.subscriptionChange(n, this.subscriptionChanged.bind(this, i, s));
      }
    this.subscribe("table-destroy", this.clearWatchers.bind(this));
  }
  subscriptionChanged(e, t, i) {
    var s = this.listeners[t].components, n = s.indexOf(e), r = !1;
    i ? n === -1 && (s.push(e), r = !0) : this.subscribed(e + "-" + t) || n > -1 && (s.splice(n, 1), r = !0), (t === "mouseenter" || t === "mouseleave") && !this.pseudoTracking && this.bindPseudoEvents(), r && this.updateEventListeners();
  }
  updateEventListeners() {
    for (let e in this.listeners) {
      let t = this.listeners[e];
      t.components.length ? t.handler || (t.handler = this.track.bind(this, e), this.el.addEventListener(e, t.handler)) : t.handler && (this.el.removeEventListener(e, t.handler), t.handler = null);
    }
  }
  track(e, t) {
    var i = t.composedPath && t.composedPath() || t.path, s = this.findTargets(i);
    s = this.bindComponents(e, s), this.triggerEvents(e, t, s), this.pseudoTracking && (e == "mouseover" || e == "mouseleave") && !Object.keys(s).length && this.pseudoMouseLeave("none", t);
  }
  findTargets(e) {
    var t = {};
    let i = Object.keys(this.componentMap);
    for (let s of e) {
      let n = s.classList ? [...s.classList] : [];
      if (n.filter((l) => this.abortClasses.includes(l)).length)
        break;
      let a = n.filter((l) => i.includes(l));
      for (let l of a)
        t[this.componentMap[l]] || (t[this.componentMap[l]] = s);
    }
    return t.group && t.group === t.row && delete t.row, t;
  }
  bindComponents(e, t) {
    var i = Object.keys(t).reverse(), s = this.listeners[e], n = {}, r = {}, a = {};
    for (let l of i) {
      let h, d = t[l], c = this.previousTargets[l];
      if (c && c.target === d)
        h = c.component;
      else
        switch (l) {
          case "row":
          case "group":
            (s.components.includes("row") || s.components.includes("cell") || s.components.includes("group")) && (h = this.table.rowManager.getVisibleRows(!0).find((f) => f.getElement() === d), t.row && t.row.parentNode && t.row.parentNode.closest(".tabulator-row") && (t[l] = !1));
            break;
          case "column":
            s.components.includes("column") && (h = this.table.columnManager.findColumn(d));
            break;
          case "cell":
            s.components.includes("cell") && (n.row instanceof ae ? h = n.row.findCell(d) : t.row && console.warn("Event Target Lookup Error - The row this cell is attached to cannot be found, has the table been reinitialized without being destroyed first?"));
            break;
        }
      h && (n[l] = h, a[l] = {
        target: d,
        component: h
      });
    }
    return this.previousTargets = a, Object.keys(t).forEach((l) => {
      let h = n[l];
      r[l] = h;
    }), r;
  }
  triggerEvents(e, t, i) {
    var s = this.listeners[e];
    for (let n in i)
      i[n] && s.components.includes(n) && this.dispatch(n + "-" + e, t, i[n]);
  }
  clearWatchers() {
    for (let e in this.listeners) {
      let t = this.listeners[e];
      t.handler && (this.el.removeEventListener(e, t.handler), t.handler = null);
    }
  }
}
class jh {
  constructor(e) {
    this.table = e, this.bindings = {};
  }
  bind(e, t, i) {
    this.bindings[e] || (this.bindings[e] = {}), this.bindings[e][t] ? console.warn("Unable to bind component handler, a matching function name is already bound", e, t, i) : this.bindings[e][t] = i;
  }
  handle(e, t, i) {
    if (this.bindings[e] && this.bindings[e][i] && typeof this.bindings[e][i].bind == "function")
      return this.bindings[e][i].bind(null, t);
    i !== "then" && typeof i == "string" && !i.startsWith("_") && this.table.options.debugInvalidComponentFuncs && console.error("The " + e + " component does not have a " + i + " function, have you checked that you have the correct Tabulator module installed?");
  }
}
class Gh extends oe {
  constructor(e) {
    super(e), this.requestOrder = 0, this.loading = !1;
  }
  initialize() {
  }
  load(e, t, i, s, n, r) {
    var a = ++this.requestOrder;
    if (this.table.destroyed)
      return Promise.resolve();
    if (this.dispatchExternal("dataLoading", e), e && (e.indexOf("{") == 0 || e.indexOf("[") == 0) && (e = JSON.parse(e)), this.confirm("data-loading", [e, t, i, n])) {
      this.loading = !0, n || this.alertLoader(), t = this.chain("data-params", [e, i, n], t || {}, t || {}), t = this.mapParams(t, this.table.options.dataSendParams);
      var l = this.chain("data-load", [e, t, i, n], !1, Promise.resolve([]));
      return l.then((h) => {
        if (this.table.destroyed)
          console.warn("Data Load Response Blocked - Table has been destroyed");
        else {
          !Array.isArray(h) && typeof h == "object" && (h = this.mapParams(h, this.objectInvert(this.table.options.dataReceiveParams)));
          var d = this.chain("data-loaded", [h], null, h);
          a == this.requestOrder ? (this.clearAlert(), d !== !1 && (this.dispatchExternal("dataLoaded", d), this.table.rowManager.setData(d, s, typeof r > "u" ? !s : r))) : console.warn("Data Load Response Blocked - An active data load request was blocked by an attempt to change table data while the request was being made");
        }
      }).catch((h) => {
        console.error("Data Load Error: ", h), this.dispatchExternal("dataLoadError", h), n || this.alertError(), setTimeout(() => {
          this.clearAlert();
        }, this.table.options.dataLoaderErrorTimeout);
      }).finally(() => {
        this.loading = !1;
      });
    } else
      return this.dispatchExternal("dataLoaded", e), e || (e = []), this.table.rowManager.setData(e, s, typeof r > "u" ? !s : r), Promise.resolve();
  }
  mapParams(e, t) {
    var i = {};
    for (let s in e)
      i[t.hasOwnProperty(s) ? t[s] : s] = e[s];
    return i;
  }
  objectInvert(e) {
    var t = {};
    for (let i in e)
      t[e[i]] = i;
    return t;
  }
  blockActiveLoad() {
    this.requestOrder++;
  }
  alertLoader() {
    var e = typeof this.table.options.dataLoader == "function" ? this.table.options.dataLoader() : this.table.options.dataLoader;
    e && this.table.alertManager.alert(this.table.options.dataLoaderLoading || this.langText("data|loading"));
  }
  alertError() {
    this.table.alertManager.alert(this.table.options.dataLoaderError || this.langText("data|error"), "error");
  }
  clearAlert() {
    this.table.alertManager.clear();
  }
}
class Uh {
  constructor(e, t, i) {
    this.table = e, this.events = {}, this.optionsList = t || {}, this.subscriptionNotifiers = {}, this.dispatch = i ? this._debugDispatch.bind(this) : this._dispatch.bind(this), this.debug = i;
  }
  subscriptionChange(e, t) {
    this.subscriptionNotifiers[e] || (this.subscriptionNotifiers[e] = []), this.subscriptionNotifiers[e].push(t), this.subscribed(e) && this._notifySubscriptionChange(e, !0);
  }
  subscribe(e, t) {
    this.events[e] || (this.events[e] = []), this.events[e].push(t), this._notifySubscriptionChange(e, !0);
  }
  unsubscribe(e, t) {
    var i;
    if (this.events[e])
      if (t)
        if (i = this.events[e].findIndex((s) => s === t), i > -1)
          this.events[e].splice(i, 1);
        else {
          console.warn("Cannot remove event, no matching event found:", e, t);
          return;
        }
      else
        delete this.events[e];
    else {
      console.warn("Cannot remove event, no events set on:", e);
      return;
    }
    this._notifySubscriptionChange(e, !1);
  }
  subscribed(e) {
    return this.events[e] && this.events[e].length;
  }
  _notifySubscriptionChange(e, t) {
    var i = this.subscriptionNotifiers[e];
    i && i.forEach((s) => {
      s(t);
    });
  }
  _dispatch() {
    var e = Array.from(arguments), t = e.shift(), i;
    return this.events[t] && this.events[t].forEach((s, n) => {
      let r = s.apply(this.table, e);
      n || (i = r);
    }), i;
  }
  _debugDispatch() {
    var e = Array.from(arguments), t = e[0];
    return e[0] = "ExternalEvent:" + e[0], (this.debug === !0 || this.debug.includes(t)) && console.log(...e), this._dispatch(...arguments);
  }
}
class $h {
  constructor(e) {
    this.events = {}, this.subscriptionNotifiers = {}, this.dispatch = e ? this._debugDispatch.bind(this) : this._dispatch.bind(this), this.chain = e ? this._debugChain.bind(this) : this._chain.bind(this), this.confirm = e ? this._debugConfirm.bind(this) : this._confirm.bind(this), this.debug = e;
  }
  subscriptionChange(e, t) {
    this.subscriptionNotifiers[e] || (this.subscriptionNotifiers[e] = []), this.subscriptionNotifiers[e].push(t), this.subscribed(e) && this._notifySubscriptionChange(e, !0);
  }
  subscribe(e, t, i = 1e4) {
    this.events[e] || (this.events[e] = []), this.events[e].push({ callback: t, priority: i }), this.events[e].sort((s, n) => s.priority - n.priority), this._notifySubscriptionChange(e, !0);
  }
  unsubscribe(e, t) {
    var i;
    if (this.events[e]) {
      if (t)
        if (i = this.events[e].findIndex((s) => s.callback === t), i > -1)
          this.events[e].splice(i, 1);
        else {
          console.warn("Cannot remove event, no matching event found:", e, t);
          return;
        }
    } else {
      console.warn("Cannot remove event, no events set on:", e);
      return;
    }
    this._notifySubscriptionChange(e, !1);
  }
  subscribed(e) {
    return this.events[e] && this.events[e].length;
  }
  _chain(e, t, i, s) {
    var n = i;
    return Array.isArray(t) || (t = [t]), this.subscribed(e) ? (this.events[e].forEach((r, a) => {
      n = r.callback.apply(this, t.concat([n]));
    }), n) : typeof s == "function" ? s() : s;
  }
  _confirm(e, t) {
    var i = !1;
    return Array.isArray(t) || (t = [t]), this.subscribed(e) && this.events[e].forEach((s, n) => {
      s.callback.apply(this, t) && (i = !0);
    }), i;
  }
  _notifySubscriptionChange(e, t) {
    var i = this.subscriptionNotifiers[e];
    i && i.forEach((s) => {
      s(t);
    });
  }
  _dispatch() {
    var e = Array.from(arguments), t = e.shift();
    this.events[t] && this.events[t].forEach((i) => {
      i.callback.apply(this, e);
    });
  }
  _debugDispatch() {
    var e = Array.from(arguments), t = e[0];
    return e[0] = "InternalEvent:" + t, (this.debug === !0 || this.debug.includes(t)) && console.log(...e), this._dispatch(...arguments);
  }
  _debugChain() {
    var e = Array.from(arguments), t = e[0];
    return e[0] = "InternalEvent:" + t, (this.debug === !0 || this.debug.includes(t)) && console.log(...e), this._chain(...arguments);
  }
  _debugConfirm() {
    var e = Array.from(arguments), t = e[0];
    return e[0] = "InternalEvent:" + t, (this.debug === !0 || this.debug.includes(t)) && console.log(...e), this._confirm(...arguments);
  }
}
class Xh extends oe {
  constructor(e) {
    super(e);
  }
  _warnUser() {
    this.options("debugDeprecation") && console.warn(...arguments);
  }
  check(e, t, i) {
    var s = "";
    return typeof this.options(e) < "u" ? (s = "Deprecated Setup Option - Use of the %c" + e + "%c option is now deprecated", t ? (s = s + ", Please use the %c" + t + "%c option instead", this._warnUser(s, "font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal;"), i && (this.table.options[t] = this.table.options[e])) : this._warnUser(s, "font-weight: bold;", "font-weight: normal;"), !1) : !0;
  }
  checkMsg(e, t) {
    return typeof this.options(e) < "u" ? (this._warnUser("%cDeprecated Setup Option - Use of the %c" + e + " %c option is now deprecated, " + t, "font-weight: normal;", "font-weight: bold;", "font-weight: normal;"), !1) : !0;
  }
  msg(e) {
    this._warnUser(e);
  }
}
class Yh extends oe {
  constructor(e) {
    super(e), this.deps = {}, this.props = {};
  }
  initialize() {
    this.deps = Object.assign({}, this.options("dependencies"));
  }
  lookup(e, t, i) {
    if (Array.isArray(e)) {
      for (const n of e) {
        var s = this.lookup(n, t, !0);
        if (s)
          break;
      }
      if (s)
        return s;
      this.error(e);
    } else
      return t ? this.lookupProp(e, t, i) : this.lookupKey(e, i);
  }
  lookupProp(e, t, i) {
    var s;
    if (this.props[e] && this.props[e][t])
      return this.props[e][t];
    if (s = this.lookupKey(e, i), s)
      return this.props[e] || (this.props[e] = {}), this.props[e][t] = s[t] || s, this.props[e][t];
  }
  lookupKey(e, t) {
    var i;
    return this.deps[e] ? i = this.deps[e] : window[e] ? (this.deps[e] = window[e], i = this.deps[e]) : t || this.error(e), i;
  }
  error(e) {
    console.error("Unable to find dependency", e, "Please check documentation and ensure you have imported the required library into your project");
  }
}
function Kh(o, e) {
  e && this.table.columnManager.renderer.reinitializeColumnWidths(o), this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update();
}
function jn(o, e) {
  o.forEach(function(t) {
    t.reinitializeWidth();
  }), this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update();
}
function qh(o, e) {
  var t = 0, i = this.table.rowManager.element.clientWidth, s = 0, n = !1;
  o.forEach((r, a) => {
    r.widthFixed || r.reinitializeWidth(), (this.table.options.responsiveLayout ? r.modules.responsive.visible : r.visible) && (n = r), r.visible && (t += r.getWidth());
  }), n ? (s = i - t + n.getWidth(), this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && (n.setWidth(0), this.table.modules.responsiveLayout.update()), s > 0 ? n.setWidth(s) : n.reinitializeWidth()) : this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update();
}
function Jh(o, e) {
  var t = this.table.rowManager.element.getBoundingClientRect().width, i = 0, s = 0, n = 0, r = 0, a = [], l = [], h = 0, d = 0, c = 0;
  function u(p) {
    var g;
    return typeof p == "string" ? p.indexOf("%") > -1 ? g = t / 100 * parseInt(p) : g = parseInt(p) : g = p, g;
  }
  function f(p, g, m, v) {
    var x = [], E = 0, k = 0, y = 0, S = n, D = 0, T = 0, F = [];
    function H(z) {
      return m * (z.column.definition.widthGrow || 1);
    }
    function P(z) {
      return u(z.width) - m * (z.column.definition.widthShrink || 0);
    }
    return p.forEach(function(z, Y) {
      var ie = v ? P(z) : H(z);
      z.column.minWidth >= ie ? x.push(z) : z.column.maxWidth && z.column.maxWidth < ie ? (z.width = z.column.maxWidth, g -= z.column.maxWidth, S -= v ? z.column.definition.widthShrink || 1 : z.column.definition.widthGrow || 1, S && (m = Math.floor(g / S))) : (F.push(z), T += v ? z.column.definition.widthShrink || 1 : z.column.definition.widthGrow || 1);
    }), x.length ? (x.forEach(function(z) {
      E += v ? z.width - z.column.minWidth : z.column.minWidth, z.width = z.column.minWidth;
    }), k = g - E, y = T ? Math.floor(k / T) : k, D = f(F, k, y, v)) : (D = T ? g - Math.floor(g / T) * T : g, F.forEach(function(z) {
      z.width = v ? P(z) : H(z);
    })), D;
  }
  this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", !0) && this.table.modules.responsiveLayout.update(), this.table.rowManager.element.scrollHeight > this.table.rowManager.element.clientHeight && (t -= this.table.rowManager.element.offsetWidth - this.table.rowManager.element.clientWidth), o.forEach(function(p) {
    var g, m, v;
    p.visible && (g = p.definition.width, m = parseInt(p.minWidth), g ? (v = u(g), i += v > m ? v : m, p.definition.widthShrink && (l.push({
      column: p,
      width: v > m ? v : m
    }), h += p.definition.widthShrink)) : (a.push({
      column: p,
      width: 0
    }), n += p.definition.widthGrow || 1));
  }), s = t - i, r = Math.floor(s / n), c = f(a, s, r, !1), a.length && c > 0 && (a[a.length - 1].width += c), a.forEach(function(p) {
    s -= p.width;
  }), d = Math.abs(c) + s, d > 0 && h && (c = f(l, d, Math.floor(d / h), !0)), c && l.length && (l[l.length - 1].width -= c), a.forEach(function(p) {
    p.column.setWidth(p.width);
  }), l.forEach(function(p) {
    p.column.setWidth(p.width);
  });
}
var Qh = {
  fitData: Kh,
  fitDataFill: jn,
  fitDataTable: jn,
  fitDataStretch: qh,
  fitColumns: Jh
};
const Tt = class Tt extends A {
  constructor(e) {
    super(e, "layout"), this.mode = null, this.registerTableOption("layout", "fitData"), this.registerTableOption("layoutColumnsOnNewData", !1), this.registerColumnOption("widthGrow"), this.registerColumnOption("widthShrink");
  }
  //initialize layout system
  initialize() {
    var e = this.table.options.layout;
    Tt.modes[e] ? this.mode = e : (console.warn("Layout Error - invalid mode set, defaulting to 'fitData' : " + e), this.mode = "fitData"), this.table.element.setAttribute("tabulator-layout", this.mode), this.subscribe("column-init", this.initializeColumn.bind(this));
  }
  initializeColumn(e) {
    e.definition.widthGrow && (e.definition.widthGrow = Number(e.definition.widthGrow)), e.definition.widthShrink && (e.definition.widthShrink = Number(e.definition.widthShrink));
  }
  getMode() {
    return this.mode;
  }
  //trigger table layout
  layout(e) {
    var t = this.table.columnManager.columnsByIndex.find((i) => i.definition.variableHeight || i.definition.formatter === "textarea");
    this.dispatch("layout-refreshing"), Tt.modes[this.mode].call(this, this.table.columnManager.columnsByIndex, e), t && this.table.rowManager.normalizeHeight(!0), this.dispatch("layout-refreshed");
  }
};
C(Tt, "moduleName", "layout"), //load defaults
C(Tt, "modes", Qh);
let $s = Tt;
var Zh = {
  default: {
    //hold default locale text
    groups: {
      item: "item",
      items: "items"
    },
    columns: {},
    data: {
      loading: "Loading",
      error: "Error"
    },
    pagination: {
      page_size: "Page Size",
      page_title: "Show Page",
      first: "First",
      first_title: "First Page",
      last: "Last",
      last_title: "Last Page",
      prev: "Prev",
      prev_title: "Prev Page",
      next: "Next",
      next_title: "Next Page",
      all: "All",
      counter: {
        showing: "Showing",
        of: "of",
        rows: "rows",
        pages: "pages"
      }
    },
    headerFilters: {
      default: "filter column...",
      columns: {}
    }
  }
};
const oi = class oi extends A {
  constructor(e) {
    super(e), this.locale = "default", this.lang = !1, this.bindings = {}, this.langList = {}, this.registerTableOption("locale", !1), this.registerTableOption("langs", {});
  }
  initialize() {
    this.langList = $.deepClone(oi.langs), this.table.options.columnDefaults.headerFilterPlaceholder !== !1 && this.setHeaderFilterPlaceholder(this.table.options.columnDefaults.headerFilterPlaceholder);
    for (let e in this.table.options.langs)
      this.installLang(e, this.table.options.langs[e]);
    this.setLocale(this.table.options.locale), this.registerTableFunction("setLocale", this.setLocale.bind(this)), this.registerTableFunction("getLocale", this.getLocale.bind(this)), this.registerTableFunction("getLang", this.getLang.bind(this));
  }
  //set header placeholder
  setHeaderFilterPlaceholder(e) {
    this.langList.default.headerFilters.default = e;
  }
  //setup a lang description object
  installLang(e, t) {
    this.langList[e] ? this._setLangProp(this.langList[e], t) : this.langList[e] = t;
  }
  _setLangProp(e, t) {
    for (let i in t)
      e[i] && typeof e[i] == "object" ? this._setLangProp(e[i], t[i]) : e[i] = t[i];
  }
  //set current locale
  setLocale(e) {
    e = e || "default";
    function t(i, s) {
      for (var n in i)
        typeof i[n] == "object" ? (s[n] || (s[n] = {}), t(i[n], s[n])) : s[n] = i[n];
    }
    if (e === !0 && navigator.language && (e = navigator.language.toLowerCase()), e && !this.langList[e]) {
      let i = e.split("-")[0];
      this.langList[i] ? (console.warn("Localization Error - Exact matching locale not found, using closest match: ", e, i), e = i) : (console.warn("Localization Error - Matching locale not found, using default: ", e), e = "default");
    }
    this.locale = e, this.lang = $.deepClone(this.langList.default || {}), e != "default" && t(this.langList[e], this.lang), this.dispatchExternal("localized", this.locale, this.lang), this._executeBindings();
  }
  //get current locale
  getLocale(e) {
    return this.locale;
  }
  //get lang object for given local or current if none provided
  getLang(e) {
    return e ? this.langList[e] : this.lang;
  }
  //get text for current locale
  getText(e, t) {
    var i = t ? e + "|" + t : e, s = i.split("|"), n = this._getLangElement(s, this.locale);
    return n || "";
  }
  //traverse langs object and find localized copy
  _getLangElement(e, t) {
    var i = this.lang;
    return e.forEach(function(s) {
      var n;
      i && (n = i[s], typeof n < "u" ? i = n : i = !1);
    }), i;
  }
  //set update binding
  bind(e, t) {
    this.bindings[e] || (this.bindings[e] = []), this.bindings[e].push(t), t(this.getText(e), this.lang);
  }
  //iterate through bindings and trigger updates
  _executeBindings() {
    for (let e in this.bindings)
      this.bindings[e].forEach((t) => {
        t(this.getText(e), this.lang);
      });
  }
};
C(oi, "moduleName", "localize"), //load defaults
C(oi, "langs", Zh);
let Xs = oi;
class Rr extends A {
  constructor(e) {
    super(e);
  }
  initialize() {
    this.registerTableFunction("tableComms", this.receive.bind(this));
  }
  getConnections(e) {
    var t = [], i;
    return i = this.table.constructor.registry.lookupTable(e), i.forEach((s) => {
      this.table !== s && t.push(s);
    }), t;
  }
  send(e, t, i, s) {
    var n = this.getConnections(e);
    n.forEach((r) => {
      r.tableComms(this.table.element, t, i, s);
    }), !n.length && e && console.warn("Table Connection Error - No tables matching selector found", e);
  }
  receive(e, t, i, s) {
    if (this.table.modExists(t))
      return this.table.modules[t].commsReceived(e, i, s);
    console.warn("Inter-table Comms Error - no such module:", t);
  }
}
C(Rr, "moduleName", "comms");
var ed = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  CommsModule: Rr,
  LayoutModule: $s,
  LocalizeModule: Xs
});
const pe = class pe {
  static findTable(e) {
    var t = pe.registry.lookupTable(e, !0);
    return Array.isArray(t) && !t.length ? !1 : t;
  }
};
C(pe, "registry", {
  tables: [],
  register(e) {
    pe.registry.tables.push(e);
  },
  deregister(e) {
    var t = pe.registry.tables.indexOf(e);
    t > -1 && pe.registry.tables.splice(t, 1);
  },
  lookupTable(e, t) {
    var i = [], s, n;
    if (typeof e == "string") {
      if (s = document.querySelectorAll(e), s.length)
        for (var r = 0; r < s.length; r++)
          n = pe.registry.matchElement(s[r]), n && i.push(n);
    } else typeof HTMLElement < "u" && e instanceof HTMLElement || e instanceof pe ? (n = pe.registry.matchElement(e), n && i.push(n)) : Array.isArray(e) ? e.forEach(function(a) {
      i = i.concat(pe.registry.lookupTable(a));
    }) : t || console.warn("Table Connection Error - Invalid Selector", e);
    return i;
  },
  matchElement(e) {
    return pe.registry.tables.find(function(t) {
      return e instanceof pe ? t === e : t.element === e;
    });
  }
});
let Ys = pe;
const U = class U extends Ys {
  constructor() {
    super();
  }
  static initializeModuleBinder(e) {
    U.modulesRegistered || (U.modulesRegistered = !0, U._registerModules(ed, !0), e && U._registerModules(e));
  }
  static _extendModule(e, t, i) {
    if (U.moduleBindings[e]) {
      var s = U.moduleBindings[e][t];
      if (s)
        if (typeof i == "object")
          for (let n in i)
            s[n] = i[n];
        else
          console.warn("Module Error - Invalid value type, it must be an object");
      else
        console.warn("Module Error - property does not exist:", t);
    } else
      console.warn("Module Error - module does not exist:", e);
  }
  static _registerModules(e, t) {
    var i = Object.values(e);
    t && i.forEach((s) => {
      s.prototype.moduleCore = !0;
    }), U._registerModule(i);
  }
  static _registerModule(e) {
    Array.isArray(e) || (e = [e]), e.forEach((t) => {
      U._registerModuleBinding(t), U._registerModuleExtensions(t);
    });
  }
  static _registerModuleBinding(e) {
    e.moduleName ? U.moduleBindings[e.moduleName] = e : console.error("Unable to bind module, no moduleName defined", e.moduleName);
  }
  static _registerModuleExtensions(e) {
    var t = e.moduleExtensions;
    if (e.moduleExtensions)
      for (let i in t) {
        let s = t[i];
        if (U.moduleBindings[i])
          for (let n in s)
            U._extendModule(i, n, s[n]);
        else {
          U.moduleExtensions[i] || (U.moduleExtensions[i] = {});
          for (let n in s)
            U.moduleExtensions[i][n] || (U.moduleExtensions[i][n] = {}), Object.assign(U.moduleExtensions[i][n], s[n]);
        }
      }
    U._extendModuleFromQueue(e);
  }
  static _extendModuleFromQueue(e) {
    var t = U.moduleExtensions[e.moduleName];
    if (t)
      for (let i in t)
        U._extendModule(e.moduleName, i, t[i]);
  }
  //ensure that module are bound to instantiated function
  _bindModules() {
    var e = [], t = [], i = [];
    this.modules = {};
    for (var s in U.moduleBindings) {
      let n = U.moduleBindings[s], r = new n(this);
      this.modules[s] = r, n.prototype.moduleCore ? this.modulesCore.push(r) : n.moduleInitOrder ? n.moduleInitOrder < 0 ? e.push(r) : t.push(r) : i.push(r);
    }
    e.sort((n, r) => n.moduleInitOrder > r.moduleInitOrder ? 1 : -1), t.sort((n, r) => n.moduleInitOrder > r.moduleInitOrder ? 1 : -1), this.modulesRegular = e.concat(i.concat(t));
  }
};
C(U, "moduleBindings", {}), C(U, "moduleExtensions", {}), C(U, "modulesRegistered", !1), C(U, "defaultModules", !1);
let Ks = U;
class td extends oe {
  constructor(e) {
    super(e), this.element = this._createAlertElement(), this.msgElement = this._createMsgElement(), this.type = null, this.element.appendChild(this.msgElement);
  }
  _createAlertElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-alert"), e;
  }
  _createMsgElement() {
    var e = document.createElement("div");
    return e.classList.add("tabulator-alert-msg"), e.setAttribute("role", "alert"), e;
  }
  _typeClass() {
    return "tabulator-alert-state-" + this.type;
  }
  alert(e, t = "msg") {
    if (e) {
      for (this.clear(), this.dispatch("alert-show", t), this.type = t; this.msgElement.firstChild; ) this.msgElement.removeChild(this.msgElement.firstChild);
      this.msgElement.classList.add(this._typeClass()), typeof e == "function" && (e = e()), e instanceof HTMLElement ? this.msgElement.appendChild(e) : this.msgElement.innerHTML = e, this.table.element.appendChild(this.element);
    }
  }
  clear() {
    this.dispatch("alert-hide", this.type), this.element.parentNode && this.element.parentNode.removeChild(this.element), this.msgElement.classList.remove(this._typeClass());
  }
}
const Ie = class Ie extends Ks {
  static extendModule() {
    Ie.initializeModuleBinder(), Ie._extendModule(...arguments);
  }
  static registerModule() {
    Ie.initializeModuleBinder(), Ie._registerModule(...arguments);
  }
  constructor(e, t, i) {
    super(), Ie.initializeModuleBinder(i), this.options = {}, this.columnManager = null, this.rowManager = null, this.footerManager = null, this.alertManager = null, this.vdomHoz = null, this.externalEvents = null, this.eventBus = null, this.interactionMonitor = !1, this.browser = "", this.browserSlow = !1, this.browserMobile = !1, this.rtl = !1, this.originalElement = null, this.componentFunctionBinder = new jh(this), this.dataLoader = !1, this.modules = {}, this.modulesCore = [], this.modulesRegular = [], this.deprecationAdvisor = new Xh(this), this.optionsList = new _r(this, "table constructor"), this.dependencyRegistry = new Yh(this), this.initialized = !1, this.destroyed = !1, this.initializeElement(e) && (this.initializeCoreSystems(t), setTimeout(() => {
      this._create();
    })), this.constructor.registry.register(this);
  }
  initializeElement(e) {
    return typeof HTMLElement < "u" && e instanceof HTMLElement ? (this.element = e, !0) : typeof e == "string" ? (this.element = document.querySelector(e), this.element ? !0 : (console.error("Tabulator Creation Error - no element found matching selector: ", e), !1)) : (console.error("Tabulator Creation Error - Invalid element provided:", e), !1);
  }
  initializeCoreSystems(e) {
    this.columnManager = new Hh(this), this.rowManager = new Vh(this), this.footerManager = new Nh(this), this.dataLoader = new Gh(this), this.alertManager = new td(this), this._bindModules(), this.options = this.optionsList.generate(Ie.defaultOptions, e), this._clearObjectPointers(), this._mapDeprecatedFunctionality(), this.externalEvents = new Uh(this, this.options, this.options.debugEventsExternal), this.eventBus = new $h(this.options.debugEventsInternal), this.interactionMonitor = new Wh(this), this.dataLoader.initialize(), this.footerManager.initialize(), this.dependencyRegistry.initialize();
  }
  //convert deprecated functionality to new functions
  _mapDeprecatedFunctionality() {
  }
  _clearSelection() {
    this.element.classList.add("tabulator-block-select"), window.getSelection ? window.getSelection().empty ? window.getSelection().empty() : window.getSelection().removeAllRanges && window.getSelection().removeAllRanges() : document.selection && document.selection.empty(), this.element.classList.remove("tabulator-block-select");
  }
  //create table
  _create() {
    this.externalEvents.dispatch("tableBuilding"), this.eventBus.dispatch("table-building"), this._rtlCheck(), this._buildElement(), this._initializeTable(), this.initialized = !0, this._loadInitialData().finally(() => {
      this.eventBus.dispatch("table-initialized"), this.externalEvents.dispatch("tableBuilt");
    });
  }
  _rtlCheck() {
    var e = window.getComputedStyle(this.element);
    switch (this.options.textDirection) {
      case "auto":
        if (e.direction !== "rtl")
          break;
      case "rtl":
        this.element.classList.add("tabulator-rtl"), this.rtl = !0;
        break;
      case "ltr":
        this.element.classList.add("tabulator-ltr");
      default:
        this.rtl = !1;
    }
  }
  //clear pointers to objects in default config object
  _clearObjectPointers() {
    this.options.columns = this.options.columns.slice(0), Array.isArray(this.options.data) && !this.options.reactiveData && (this.options.data = this.options.data.slice(0));
  }
  //build tabulator element
  _buildElement() {
    var e = this.element, t = this.options, i;
    if (e.tagName === "TABLE") {
      this.originalElement = this.element, i = document.createElement("div");
      var s = e.attributes;
      for (var n in s)
        typeof s[n] == "object" && i.setAttribute(s[n].name, s[n].value);
      e.parentNode.replaceChild(i, e), this.element = e = i;
    }
    for (e.classList.add("tabulator"), e.setAttribute("role", "grid"); e.firstChild; ) e.removeChild(e.firstChild);
    t.height && (t.height = isNaN(t.height) ? t.height : t.height + "px", e.style.height = t.height), t.minHeight !== !1 && (t.minHeight = isNaN(t.minHeight) ? t.minHeight : t.minHeight + "px", e.style.minHeight = t.minHeight), t.maxHeight !== !1 && (t.maxHeight = isNaN(t.maxHeight) ? t.maxHeight : t.maxHeight + "px", e.style.maxHeight = t.maxHeight);
  }
  //initialize core systems and modules
  _initializeTable() {
    var e = this.element, t = this.options;
    this.interactionMonitor.initialize(), this.columnManager.initialize(), this.rowManager.initialize(), this._detectBrowser(), this.modulesCore.forEach((i) => {
      i.initialize();
    }), e.appendChild(this.columnManager.getElement()), e.appendChild(this.rowManager.getElement()), t.footerElement && this.footerManager.activate(), t.autoColumns && t.data && this.columnManager.generateColumnsFromRowData(this.options.data), this.modulesRegular.forEach((i) => {
      i.initialize();
    }), this.columnManager.setColumns(t.columns), this.eventBus.dispatch("table-built");
  }
  _loadInitialData() {
    return this.dataLoader.load(this.options.data).finally(() => {
      this.columnManager.verticalAlignHeaders();
    });
  }
  //deconstructor
  destroy() {
    var e = this.element;
    for (this.destroyed = !0, this.constructor.registry.deregister(this), this.eventBus.dispatch("table-destroy"), this.rowManager.destroy(); e.firstChild; ) e.removeChild(e.firstChild);
    e.classList.remove("tabulator"), this.externalEvents.dispatch("tableDestroyed");
  }
  _detectBrowser() {
    var e = navigator.userAgent || navigator.vendor || window.opera;
    e.indexOf("Trident") > -1 ? (this.browser = "ie", this.browserSlow = !0) : e.indexOf("Edge") > -1 ? (this.browser = "edge", this.browserSlow = !0) : e.indexOf("Firefox") > -1 ? (this.browser = "firefox", this.browserSlow = !1) : e.indexOf("Mac OS") > -1 ? (this.browser = "safari", this.browserSlow = !1) : (this.browser = "other", this.browserSlow = !1), this.browserMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(e) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(e.slice(0, 4));
  }
  initGuard(e, t) {
    var i, s;
    return this.options.debugInitialization && !this.initialized && (e || (i = new Error().stack.split(`
`), s = i[0] == "Error" ? i[2] : i[1], s[0] == " " ? e = s.trim().split(" ")[1].split(".")[1] : e = s.trim().split("@")[0]), console.warn("Table Not Initialized - Calling the " + e + " function before the table is initialized may result in inconsistent behavior, Please wait for the `tableBuilt` event before calling this function." + (t ? " " + t : ""))), this.initialized;
  }
  ////////////////// Data Handling //////////////////
  //block table redrawing
  blockRedraw() {
    this.initGuard(), this.eventBus.dispatch("redraw-blocking"), this.rowManager.blockRedraw(), this.columnManager.blockRedraw(), this.eventBus.dispatch("redraw-blocked");
  }
  //restore table redrawing
  restoreRedraw() {
    this.initGuard(), this.eventBus.dispatch("redraw-restoring"), this.rowManager.restoreRedraw(), this.columnManager.restoreRedraw(), this.eventBus.dispatch("redraw-restored");
  }
  //load data
  setData(e, t, i) {
    return this.initGuard(!1, "To set initial data please use the 'data' property in the table constructor."), this.dataLoader.load(e, t, i, !1);
  }
  //clear data
  clearData() {
    this.initGuard(), this.dataLoader.blockActiveLoad(), this.rowManager.clearData();
  }
  //get table data array
  getData(e) {
    return this.rowManager.getData(e);
  }
  //get table data array count
  getDataCount(e) {
    return this.rowManager.getDataCount(e);
  }
  //replace data, keeping table in position with same sort
  replaceData(e, t, i) {
    return this.initGuard(), this.dataLoader.load(e, t, i, !0, !0);
  }
  //update table data
  updateData(e) {
    var t = 0;
    return this.initGuard(), new Promise((i, s) => {
      this.dataLoader.blockActiveLoad(), typeof e == "string" && (e = JSON.parse(e)), e && e.length > 0 ? e.forEach((n) => {
        var r = this.rowManager.findRow(n[this.options.index]);
        r ? (t++, r.updateData(n).then(() => {
          t--, t || i();
        }).catch((a) => {
          s("Update Error - Unable to update row", n, a);
        })) : s("Update Error - Unable to find row", n);
      }) : (console.warn("Update Error - No data provided"), s("Update Error - No data provided"));
    });
  }
  addData(e, t, i) {
    return this.initGuard(), new Promise((s, n) => {
      this.dataLoader.blockActiveLoad(), typeof e == "string" && (e = JSON.parse(e)), e ? this.rowManager.addRows(e, t, i).then((r) => {
        var a = [];
        r.forEach(function(l) {
          a.push(l.getComponent());
        }), s(a);
      }) : (console.warn("Update Error - No data provided"), n("Update Error - No data provided"));
    });
  }
  //update table data
  updateOrAddData(e) {
    var t = [], i = 0;
    return this.initGuard(), new Promise((s, n) => {
      this.dataLoader.blockActiveLoad(), typeof e == "string" && (e = JSON.parse(e)), e && e.length > 0 ? e.forEach((r) => {
        var a = this.rowManager.findRow(r[this.options.index]);
        i++, a ? a.updateData(r).then(() => {
          i--, t.push(a.getComponent()), i || s(t);
        }) : this.rowManager.addRows(r).then((l) => {
          i--, t.push(l[0].getComponent()), i || s(t);
        });
      }) : (console.warn("Update Error - No data provided"), n("Update Error - No data provided"));
    });
  }
  //get row object
  getRow(e) {
    var t = this.rowManager.findRow(e);
    return t ? t.getComponent() : (console.warn("Find Error - No matching row found:", e), !1);
  }
  //get row object
  getRowFromPosition(e) {
    var t = this.rowManager.getRowFromPosition(e);
    return t ? t.getComponent() : (console.warn("Find Error - No matching row found:", e), !1);
  }
  //delete row from table
  deleteRow(e) {
    var t = [];
    this.initGuard(), Array.isArray(e) || (e = [e]);
    for (let i of e) {
      let s = this.rowManager.findRow(i, !0);
      if (s)
        t.push(s);
      else
        return console.error("Delete Error - No matching row found:", i), Promise.reject("Delete Error - No matching row found");
    }
    return t.sort((i, s) => this.rowManager.rows.indexOf(i) > this.rowManager.rows.indexOf(s) ? 1 : -1), t.forEach((i) => {
      i.delete();
    }), this.rowManager.reRenderInPosition(), Promise.resolve();
  }
  //add row to table
  addRow(e, t, i) {
    return this.initGuard(), typeof e == "string" && (e = JSON.parse(e)), this.rowManager.addRows(e, t, i, !0).then((s) => s[0].getComponent());
  }
  //update a row if it exists otherwise create it
  updateOrAddRow(e, t) {
    var i = this.rowManager.findRow(e);
    return this.initGuard(), typeof t == "string" && (t = JSON.parse(t)), i ? i.updateData(t).then(() => i.getComponent()) : this.rowManager.addRows(t).then((s) => s[0].getComponent());
  }
  //update row data
  updateRow(e, t) {
    var i = this.rowManager.findRow(e);
    return this.initGuard(), typeof t == "string" && (t = JSON.parse(t)), i ? i.updateData(t).then(() => Promise.resolve(i.getComponent())) : (console.warn("Update Error - No matching row found:", e), Promise.reject("Update Error - No matching row found"));
  }
  //scroll to row in DOM
  scrollToRow(e, t, i) {
    var s = this.rowManager.findRow(e);
    return s ? this.rowManager.scrollToRow(s, t, i) : (console.warn("Scroll Error - No matching row found:", e), Promise.reject("Scroll Error - No matching row found"));
  }
  moveRow(e, t, i) {
    var s = this.rowManager.findRow(e);
    this.initGuard(), s ? s.moveToRow(t, i) : console.warn("Move Error - No matching row found:", e);
  }
  getRows(e) {
    return this.rowManager.getComponents(e);
  }
  //get position of row in table
  getRowPosition(e) {
    var t = this.rowManager.findRow(e);
    return t ? t.getPosition() : (console.warn("Position Error - No matching row found:", e), !1);
  }
  /////////////// Column Functions  ///////////////
  setColumns(e) {
    this.initGuard(!1, "To set initial columns please use the 'columns' property in the table constructor"), this.columnManager.setColumns(e);
  }
  getColumns(e) {
    return this.columnManager.getComponents(e);
  }
  getColumn(e) {
    var t = this.columnManager.findColumn(e);
    return t ? t.getComponent() : (console.warn("Find Error - No matching column found:", e), !1);
  }
  getColumnDefinitions() {
    return this.columnManager.getDefinitionTree();
  }
  showColumn(e) {
    var t = this.columnManager.findColumn(e);
    if (this.initGuard(), t)
      t.show();
    else
      return console.warn("Column Show Error - No matching column found:", e), !1;
  }
  hideColumn(e) {
    var t = this.columnManager.findColumn(e);
    if (this.initGuard(), t)
      t.hide();
    else
      return console.warn("Column Hide Error - No matching column found:", e), !1;
  }
  toggleColumn(e) {
    var t = this.columnManager.findColumn(e);
    if (this.initGuard(), t)
      t.visible ? t.hide() : t.show();
    else
      return console.warn("Column Visibility Toggle Error - No matching column found:", e), !1;
  }
  addColumn(e, t, i) {
    var s = this.columnManager.findColumn(i);
    return this.initGuard(), this.columnManager.addColumn(e, t, s).then((n) => n.getComponent());
  }
  deleteColumn(e) {
    var t = this.columnManager.findColumn(e);
    return this.initGuard(), t ? t.delete() : (console.warn("Column Delete Error - No matching column found:", e), Promise.reject());
  }
  updateColumnDefinition(e, t) {
    var i = this.columnManager.findColumn(e);
    return this.initGuard(), i ? i.updateDefinition(t) : (console.warn("Column Update Error - No matching column found:", e), Promise.reject());
  }
  moveColumn(e, t, i) {
    var s = this.columnManager.findColumn(e), n = this.columnManager.findColumn(t);
    this.initGuard(), s ? n ? this.columnManager.moveColumn(s, n, i) : console.warn("Move Error - No matching column found:", n) : console.warn("Move Error - No matching column found:", e);
  }
  //scroll to column in DOM
  scrollToColumn(e, t, i) {
    return new Promise((s, n) => {
      var r = this.columnManager.findColumn(e);
      return r ? this.columnManager.scrollToColumn(r, t, i) : (console.warn("Scroll Error - No matching column found:", e), Promise.reject("Scroll Error - No matching column found"));
    });
  }
  //////////// General Public Functions ////////////
  //redraw list without updating data
  redraw(e) {
    this.initGuard(), this.columnManager.redraw(e), this.rowManager.redraw(e);
  }
  setHeight(e) {
    this.options.height = isNaN(e) ? e : e + "px", this.element.style.height = this.options.height, this.rowManager.initializeRenderer(), this.rowManager.redraw(!0);
  }
  //////////////////// Event Bus ///////////////////
  on(e, t) {
    this.externalEvents.subscribe(e, t);
  }
  off(e, t) {
    this.externalEvents.unsubscribe(e, t);
  }
  dispatchEvent() {
    var e = Array.from(arguments);
    e.shift(), this.externalEvents.dispatch(...arguments);
  }
  //////////////////// Alerts ///////////////////
  alert(e, t) {
    this.initGuard(), this.alertManager.alert(e, t);
  }
  clearAlert() {
    this.initGuard(), this.alertManager.clear();
  }
  ////////////// Extension Management //////////////
  modExists(e, t) {
    return this.modules[e] ? !0 : (t && console.error("Tabulator Module Not Installed: " + e), !1);
  }
  module(e) {
    var t = this.modules[e];
    return t || console.error("Tabulator module not installed: " + e), t;
  }
};
//default setup options
C(Ie, "defaultOptions", Oh);
let qs = Ie;
var Ht = qs;
class id extends Ht {
  static extendModule() {
    Ht.initializeModuleBinder(as), Ht._extendModule(...arguments);
  }
  static registerModule() {
    Ht.initializeModuleBinder(as), Ht._registerModule(...arguments);
  }
  constructor(e, t, i) {
    super(e, t, as);
  }
}
var sd = id;
const nd = Symbol.for("y2kfund.supabase"), od = {
  positions: (o, e) => ["positions", o, e],
  trades: (o) => ["trades", o],
  nlvMargin: (o, e) => ["nlvMargin", o, e],
  thesis: () => ["thesis"],
  thesisConnections: () => ["thesisConnections"],
  userAccountAccess: (o) => ["userAccountAccess", o]
};
function rd() {
  const o = tr(nd, null);
  if (!o) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return o;
}
async function ad(o, e) {
  if (!e)
    return console.log("⚠️ No userId provided, showing all positions"), [];
  try {
    console.log("👤 Fetching accessible accounts for user:", e);
    const { data: t, error: i } = await o.schema("hf").from("user_account_access").select("internal_account_id").eq("user_id", e).eq("is_active", !0);
    if (i)
      return console.error("❌ Error fetching user account access:", i), [];
    if (!t || t.length === 0)
      return console.log("⚠️ No account access found for user, showing all positions"), [];
    const s = t.map((n) => n.internal_account_id);
    return console.log("✅ User has access to accounts:", s), s;
  } catch (t) {
    return console.error("❌ Exception fetching account access:", t), [];
  }
}
function ld(o, e) {
  const t = rd(), i = od.nlvMargin(o, e), s = Fa(), n = xs({
    queryKey: i,
    queryFn: async () => {
      const l = await ad(t, e);
      console.log("🔍 Querying NLV/Margin with config:", {
        limit: o,
        userId: e || "none",
        accessibleAccountIds: l.length > 0 ? l : "all"
      });
      const { data: h, error: d } = await t.schema("hf").rpc("get_nlv_margin_with_excess", {
        p_limit: o
      });
      if (d) throw d;
      let c = h || [];
      return l.length > 0 && c.length > 0 ? c[0] && "nlv_internal_account_id" in c[0] ? (console.log("🔒 Applying access filter for NLV/Margin data"), c = c.filter(
        (u) => u.nlv_internal_account_id && l.includes(u.nlv_internal_account_id)
      )) : console.warn("⚠️ NLV/Margin data missing nlv_internal_account_id field, cannot filter by access") : console.log("🔓 No access filter applied - showing all NLV/Margin data"), console.log("✅ NLV/Margin query success:", {
        totalRows: (h == null ? void 0 : h.length) || 0,
        filteredRows: c.length,
        filtered: l.length > 0
      }), c;
    },
    staleTime: 6e4
  }), r = t.channel("netliquidation_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "netliquidation",
      event: "*"
    },
    () => s.invalidateQueries({ queryKey: i })
  ).subscribe(), a = t.channel("maintenance_margin_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "maintenance_margin",
      event: "*"
    },
    () => s.invalidateQueries({ queryKey: i })
  ).subscribe();
  return {
    ...n,
    _cleanup: () => {
      var l, h;
      (l = r == null ? void 0 : r.unsubscribe) == null || l.call(r), (h = a == null ? void 0 : a.unsubscribe) == null || h.call(a);
    }
  };
}
/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */
function fi(o) {
  return o + 0.5 | 0;
}
const Je = (o, e, t) => Math.max(Math.min(o, t), e);
function Gt(o) {
  return Je(fi(o * 2.55), 0, 255);
}
function Qe(o) {
  return Je(fi(o * 255), 0, 255);
}
function Be(o) {
  return Je(fi(o / 2.55) / 100, 0, 1);
}
function Gn(o) {
  return Je(fi(o * 100), 0, 100);
}
const ve = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 }, Js = [..."0123456789ABCDEF"], hd = (o) => Js[o & 15], dd = (o) => Js[(o & 240) >> 4] + Js[o & 15], vi = (o) => (o & 240) >> 4 === (o & 15), cd = (o) => vi(o.r) && vi(o.g) && vi(o.b) && vi(o.a);
function ud(o) {
  var e = o.length, t;
  return o[0] === "#" && (e === 4 || e === 5 ? t = {
    r: 255 & ve[o[1]] * 17,
    g: 255 & ve[o[2]] * 17,
    b: 255 & ve[o[3]] * 17,
    a: e === 5 ? ve[o[4]] * 17 : 255
  } : (e === 7 || e === 9) && (t = {
    r: ve[o[1]] << 4 | ve[o[2]],
    g: ve[o[3]] << 4 | ve[o[4]],
    b: ve[o[5]] << 4 | ve[o[6]],
    a: e === 9 ? ve[o[7]] << 4 | ve[o[8]] : 255
  })), t;
}
const fd = (o, e) => o < 255 ? e(o) : "";
function pd(o) {
  var e = cd(o) ? hd : dd;
  return o ? "#" + e(o.r) + e(o.g) + e(o.b) + fd(o.a, e) : void 0;
}
const gd = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function kr(o, e, t) {
  const i = e * Math.min(t, 1 - t), s = (n, r = (n + o / 30) % 12) => t - i * Math.max(Math.min(r - 3, 9 - r, 1), -1);
  return [s(0), s(8), s(4)];
}
function md(o, e, t) {
  const i = (s, n = (s + o / 60) % 6) => t - t * e * Math.max(Math.min(n, 4 - n, 1), 0);
  return [i(5), i(3), i(1)];
}
function bd(o, e, t) {
  const i = kr(o, 1, 0.5);
  let s;
  for (e + t > 1 && (s = 1 / (e + t), e *= s, t *= s), s = 0; s < 3; s++)
    i[s] *= 1 - e - t, i[s] += e;
  return i;
}
function vd(o, e, t, i, s) {
  return o === s ? (e - t) / i + (e < t ? 6 : 0) : e === s ? (t - o) / i + 2 : (o - e) / i + 4;
}
function cn(o) {
  const t = o.r / 255, i = o.g / 255, s = o.b / 255, n = Math.max(t, i, s), r = Math.min(t, i, s), a = (n + r) / 2;
  let l, h, d;
  return n !== r && (d = n - r, h = a > 0.5 ? d / (2 - n - r) : d / (n + r), l = vd(t, i, s, d, n), l = l * 60 + 0.5), [l | 0, h || 0, a];
}
function un(o, e, t, i) {
  return (Array.isArray(e) ? o(e[0], e[1], e[2]) : o(e, t, i)).map(Qe);
}
function fn(o, e, t) {
  return un(kr, o, e, t);
}
function wd(o, e, t) {
  return un(bd, o, e, t);
}
function yd(o, e, t) {
  return un(md, o, e, t);
}
function Mr(o) {
  return (o % 360 + 360) % 360;
}
function Cd(o) {
  const e = gd.exec(o);
  let t = 255, i;
  if (!e)
    return;
  e[5] !== i && (t = e[6] ? Gt(+e[5]) : Qe(+e[5]));
  const s = Mr(+e[2]), n = +e[3] / 100, r = +e[4] / 100;
  return e[1] === "hwb" ? i = wd(s, n, r) : e[1] === "hsv" ? i = yd(s, n, r) : i = fn(s, n, r), {
    r: i[0],
    g: i[1],
    b: i[2],
    a: t
  };
}
function Ed(o, e) {
  var t = cn(o);
  t[0] = Mr(t[0] + e), t = fn(t), o.r = t[0], o.g = t[1], o.b = t[2];
}
function xd(o) {
  if (!o)
    return;
  const e = cn(o), t = e[0], i = Gn(e[1]), s = Gn(e[2]);
  return o.a < 255 ? `hsla(${t}, ${i}%, ${s}%, ${Be(o.a)})` : `hsl(${t}, ${i}%, ${s}%)`;
}
const Un = {
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
}, $n = {
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
function _d() {
  const o = {}, e = Object.keys($n), t = Object.keys(Un);
  let i, s, n, r, a;
  for (i = 0; i < e.length; i++) {
    for (r = a = e[i], s = 0; s < t.length; s++)
      n = t[s], a = a.replace(n, Un[n]);
    n = parseInt($n[r], 16), o[a] = [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  return o;
}
let wi;
function Rd(o) {
  wi || (wi = _d(), wi.transparent = [0, 0, 0, 0]);
  const e = wi[o.toLowerCase()];
  return e && {
    r: e[0],
    g: e[1],
    b: e[2],
    a: e.length === 4 ? e[3] : 255
  };
}
const kd = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function Md(o) {
  const e = kd.exec(o);
  let t = 255, i, s, n;
  if (e) {
    if (e[7] !== i) {
      const r = +e[7];
      t = e[8] ? Gt(r) : Je(r * 255, 0, 255);
    }
    return i = +e[1], s = +e[3], n = +e[5], i = 255 & (e[2] ? Gt(i) : Je(i, 0, 255)), s = 255 & (e[4] ? Gt(s) : Je(s, 0, 255)), n = 255 & (e[6] ? Gt(n) : Je(n, 0, 255)), {
      r: i,
      g: s,
      b: n,
      a: t
    };
  }
}
function Td(o) {
  return o && (o.a < 255 ? `rgba(${o.r}, ${o.g}, ${o.b}, ${Be(o.a)})` : `rgb(${o.r}, ${o.g}, ${o.b})`);
}
const ls = (o) => o <= 31308e-7 ? o * 12.92 : Math.pow(o, 1 / 2.4) * 1.055 - 0.055, Et = (o) => o <= 0.04045 ? o / 12.92 : Math.pow((o + 0.055) / 1.055, 2.4);
function Sd(o, e, t) {
  const i = Et(Be(o.r)), s = Et(Be(o.g)), n = Et(Be(o.b));
  return {
    r: Qe(ls(i + t * (Et(Be(e.r)) - i))),
    g: Qe(ls(s + t * (Et(Be(e.g)) - s))),
    b: Qe(ls(n + t * (Et(Be(e.b)) - n))),
    a: o.a + t * (e.a - o.a)
  };
}
function yi(o, e, t) {
  if (o) {
    let i = cn(o);
    i[e] = Math.max(0, Math.min(i[e] + i[e] * t, e === 0 ? 360 : 1)), i = fn(i), o.r = i[0], o.g = i[1], o.b = i[2];
  }
}
function Tr(o, e) {
  return o && Object.assign(e || {}, o);
}
function Xn(o) {
  var e = { r: 0, g: 0, b: 0, a: 255 };
  return Array.isArray(o) ? o.length >= 3 && (e = { r: o[0], g: o[1], b: o[2], a: 255 }, o.length > 3 && (e.a = Qe(o[3]))) : (e = Tr(o, { r: 0, g: 0, b: 0, a: 1 }), e.a = Qe(e.a)), e;
}
function Ld(o) {
  return o.charAt(0) === "r" ? Md(o) : Cd(o);
}
class ri {
  constructor(e) {
    if (e instanceof ri)
      return e;
    const t = typeof e;
    let i;
    t === "object" ? i = Xn(e) : t === "string" && (i = ud(e) || Rd(e) || Ld(e)), this._rgb = i, this._valid = !!i;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var e = Tr(this._rgb);
    return e && (e.a = Be(e.a)), e;
  }
  set rgb(e) {
    this._rgb = Xn(e);
  }
  rgbString() {
    return this._valid ? Td(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? pd(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? xd(this._rgb) : void 0;
  }
  mix(e, t) {
    if (e) {
      const i = this.rgb, s = e.rgb;
      let n;
      const r = t === n ? 0.5 : t, a = 2 * r - 1, l = i.a - s.a, h = ((a * l === -1 ? a : (a + l) / (1 + a * l)) + 1) / 2;
      n = 1 - h, i.r = 255 & h * i.r + n * s.r + 0.5, i.g = 255 & h * i.g + n * s.g + 0.5, i.b = 255 & h * i.b + n * s.b + 0.5, i.a = r * i.a + (1 - r) * s.a, this.rgb = i;
    }
    return this;
  }
  interpolate(e, t) {
    return e && (this._rgb = Sd(this._rgb, e._rgb, t)), this;
  }
  clone() {
    return new ri(this.rgb);
  }
  alpha(e) {
    return this._rgb.a = Qe(e), this;
  }
  clearer(e) {
    const t = this._rgb;
    return t.a *= 1 - e, this;
  }
  greyscale() {
    const e = this._rgb, t = fi(e.r * 0.3 + e.g * 0.59 + e.b * 0.11);
    return e.r = e.g = e.b = t, this;
  }
  opaquer(e) {
    const t = this._rgb;
    return t.a *= 1 + e, this;
  }
  negate() {
    const e = this._rgb;
    return e.r = 255 - e.r, e.g = 255 - e.g, e.b = 255 - e.b, this;
  }
  lighten(e) {
    return yi(this._rgb, 2, e), this;
  }
  darken(e) {
    return yi(this._rgb, 2, -e), this;
  }
  saturate(e) {
    return yi(this._rgb, 1, e), this;
  }
  desaturate(e) {
    return yi(this._rgb, 1, -e), this;
  }
  rotate(e) {
    return Ed(this._rgb, e), this;
  }
}
/*!
 * Chart.js v4.5.0
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
function Oe() {
}
const Dd = /* @__PURE__ */ (() => {
  let o = 0;
  return () => o++;
})();
function X(o) {
  return o == null;
}
function se(o) {
  if (Array.isArray && Array.isArray(o))
    return !0;
  const e = Object.prototype.toString.call(o);
  return e.slice(0, 7) === "[object" && e.slice(-6) === "Array]";
}
function N(o) {
  return o !== null && Object.prototype.toString.call(o) === "[object Object]";
}
function Ce(o) {
  return (typeof o == "number" || o instanceof Number) && isFinite(+o);
}
function Te(o, e) {
  return Ce(o) ? o : e;
}
function I(o, e) {
  return typeof o > "u" ? e : o;
}
const zd = (o, e) => typeof o == "string" && o.endsWith("%") ? parseFloat(o) / 100 * e : +o;
function q(o, e, t) {
  if (o && typeof o.call == "function")
    return o.apply(t, e);
}
function G(o, e, t, i) {
  let s, n, r;
  if (se(o))
    for (n = o.length, s = 0; s < n; s++)
      e.call(t, o[s], s);
  else if (N(o))
    for (r = Object.keys(o), n = r.length, s = 0; s < n; s++)
      e.call(t, o[r[s]], r[s]);
}
function Hi(o, e) {
  let t, i, s, n;
  if (!o || !e || o.length !== e.length)
    return !1;
  for (t = 0, i = o.length; t < i; ++t)
    if (s = o[t], n = e[t], s.datasetIndex !== n.datasetIndex || s.index !== n.index)
      return !1;
  return !0;
}
function Ii(o) {
  if (se(o))
    return o.map(Ii);
  if (N(o)) {
    const e = /* @__PURE__ */ Object.create(null), t = Object.keys(o), i = t.length;
    let s = 0;
    for (; s < i; ++s)
      e[t[s]] = Ii(o[t[s]]);
    return e;
  }
  return o;
}
function Sr(o) {
  return [
    "__proto__",
    "prototype",
    "constructor"
  ].indexOf(o) === -1;
}
function Fd(o, e, t, i) {
  if (!Sr(o))
    return;
  const s = e[o], n = t[o];
  N(s) && N(n) ? ai(s, n, i) : e[o] = Ii(n);
}
function ai(o, e, t) {
  const i = se(e) ? e : [
    e
  ], s = i.length;
  if (!N(o))
    return o;
  t = t || {};
  const n = t.merger || Fd;
  let r;
  for (let a = 0; a < s; ++a) {
    if (r = i[a], !N(r))
      continue;
    const l = Object.keys(r);
    for (let h = 0, d = l.length; h < d; ++h)
      n(l[h], o, r, t);
  }
  return o;
}
function Kt(o, e) {
  return ai(o, e, {
    merger: Od
  });
}
function Od(o, e, t) {
  if (!Sr(o))
    return;
  const i = e[o], s = t[o];
  N(i) && N(s) ? Kt(i, s) : Object.prototype.hasOwnProperty.call(e, o) || (e[o] = Ii(s));
}
const Yn = {
  // Chart.helpers.core resolveObjectKey should resolve empty key to root object
  "": (o) => o,
  // default resolvers
  x: (o) => o.x,
  y: (o) => o.y
};
function Pd(o) {
  const e = o.split("."), t = [];
  let i = "";
  for (const s of e)
    i += s, i.endsWith("\\") ? i = i.slice(0, -1) + "." : (t.push(i), i = "");
  return t;
}
function Ad(o) {
  const e = Pd(o);
  return (t) => {
    for (const i of e) {
      if (i === "")
        break;
      t = t && t[i];
    }
    return t;
  };
}
function Bi(o, e) {
  return (Yn[e] || (Yn[e] = Ad(e)))(o);
}
function pn(o) {
  return o.charAt(0).toUpperCase() + o.slice(1);
}
const Vi = (o) => typeof o < "u", Ze = (o) => typeof o == "function", Kn = (o, e) => {
  if (o.size !== e.size)
    return !1;
  for (const t of o)
    if (!e.has(t))
      return !1;
  return !0;
};
function Hd(o) {
  return o.type === "mouseup" || o.type === "click" || o.type === "contextmenu";
}
const ne = Math.PI, De = 2 * ne, Id = De + ne, Ni = Number.POSITIVE_INFINITY, Bd = ne / 180, Re = ne / 2, ot = ne / 4, qn = ne * 2 / 3, Lr = Math.log10, Lt = Math.sign;
function qt(o, e, t) {
  return Math.abs(o - e) < t;
}
function Jn(o) {
  const e = Math.round(o);
  o = qt(o, e, o / 1e3) ? e : o;
  const t = Math.pow(10, Math.floor(Lr(o))), i = o / t;
  return (i <= 1 ? 1 : i <= 2 ? 2 : i <= 5 ? 5 : 10) * t;
}
function Vd(o) {
  const e = [], t = Math.sqrt(o);
  let i;
  for (i = 1; i < t; i++)
    o % i === 0 && (e.push(i), e.push(o / i));
  return t === (t | 0) && e.push(t), e.sort((s, n) => s - n).pop(), e;
}
function Nd(o) {
  return typeof o == "symbol" || typeof o == "object" && o !== null && !(Symbol.toPrimitive in o || "toString" in o || "valueOf" in o);
}
function li(o) {
  return !Nd(o) && !isNaN(parseFloat(o)) && isFinite(o);
}
function Wd(o, e) {
  const t = Math.round(o);
  return t - e <= o && t + e >= o;
}
function jd(o, e, t) {
  let i, s, n;
  for (i = 0, s = o.length; i < s; i++)
    n = o[i][t], isNaN(n) || (e.min = Math.min(e.min, n), e.max = Math.max(e.max, n));
}
function ft(o) {
  return o * (ne / 180);
}
function Gd(o) {
  return o * (180 / ne);
}
function Qn(o) {
  if (!Ce(o))
    return;
  let e = 1, t = 0;
  for (; Math.round(o * e) / e !== o; )
    e *= 10, t++;
  return t;
}
function Ud(o, e) {
  const t = e.x - o.x, i = e.y - o.y, s = Math.sqrt(t * t + i * i);
  let n = Math.atan2(i, t);
  return n < -0.5 * ne && (n += De), {
    angle: n,
    distance: s
  };
}
function Qs(o, e) {
  return Math.sqrt(Math.pow(e.x - o.x, 2) + Math.pow(e.y - o.y, 2));
}
function $d(o, e) {
  return (o - e + Id) % De - ne;
}
function Ge(o) {
  return (o % De + De) % De;
}
function Dr(o, e, t, i) {
  const s = Ge(o), n = Ge(e), r = Ge(t), a = Ge(n - s), l = Ge(r - s), h = Ge(s - n), d = Ge(s - r);
  return s === n || s === r || i && n === r || a > l && h < d;
}
function we(o, e, t) {
  return Math.max(e, Math.min(t, o));
}
function Xd(o) {
  return we(o, -32768, 32767);
}
function Ut(o, e, t, i = 1e-6) {
  return o >= Math.min(e, t) - i && o <= Math.max(e, t) + i;
}
function gn(o, e, t) {
  t = t || ((r) => o[r] < e);
  let i = o.length - 1, s = 0, n;
  for (; i - s > 1; )
    n = s + i >> 1, t(n) ? s = n : i = n;
  return {
    lo: s,
    hi: i
  };
}
const pt = (o, e, t, i) => gn(o, t, i ? (s) => {
  const n = o[s][e];
  return n < t || n === t && o[s + 1][e] === t;
} : (s) => o[s][e] < t), Yd = (o, e, t) => gn(o, t, (i) => o[i][e] >= t);
function Kd(o, e, t) {
  let i = 0, s = o.length;
  for (; i < s && o[i] < e; )
    i++;
  for (; s > i && o[s - 1] > t; )
    s--;
  return i > 0 || s < o.length ? o.slice(i, s) : o;
}
const zr = [
  "push",
  "pop",
  "shift",
  "splice",
  "unshift"
];
function qd(o, e) {
  if (o._chartjs) {
    o._chartjs.listeners.push(e);
    return;
  }
  Object.defineProperty(o, "_chartjs", {
    configurable: !0,
    enumerable: !1,
    value: {
      listeners: [
        e
      ]
    }
  }), zr.forEach((t) => {
    const i = "_onData" + pn(t), s = o[t];
    Object.defineProperty(o, t, {
      configurable: !0,
      enumerable: !1,
      value(...n) {
        const r = s.apply(this, n);
        return o._chartjs.listeners.forEach((a) => {
          typeof a[i] == "function" && a[i](...n);
        }), r;
      }
    });
  });
}
function Zn(o, e) {
  const t = o._chartjs;
  if (!t)
    return;
  const i = t.listeners, s = i.indexOf(e);
  s !== -1 && i.splice(s, 1), !(i.length > 0) && (zr.forEach((n) => {
    delete o[n];
  }), delete o._chartjs);
}
function Jd(o) {
  const e = new Set(o);
  return e.size === o.length ? o : Array.from(e);
}
const Fr = function() {
  return typeof window > "u" ? function(o) {
    return o();
  } : window.requestAnimationFrame;
}();
function Or(o, e) {
  let t = [], i = !1;
  return function(...s) {
    t = s, i || (i = !0, Fr.call(window, () => {
      i = !1, o.apply(e, t);
    }));
  };
}
function Qd(o, e) {
  let t;
  return function(...i) {
    return e ? (clearTimeout(t), t = setTimeout(o, e, i)) : o.apply(this, i), e;
  };
}
const mn = (o) => o === "start" ? "left" : o === "end" ? "right" : "center", re = (o, e, t) => o === "start" ? e : o === "end" ? t : (e + t) / 2, Zd = (o, e, t, i) => o === (i ? "left" : "right") ? t : o === "center" ? (e + t) / 2 : e;
function ec(o, e, t) {
  const i = e.length;
  let s = 0, n = i;
  if (o._sorted) {
    const { iScale: r, vScale: a, _parsed: l } = o, h = o.dataset && o.dataset.options ? o.dataset.options.spanGaps : null, d = r.axis, { min: c, max: u, minDefined: f, maxDefined: p } = r.getUserBounds();
    if (f) {
      if (s = Math.min(
        // @ts-expect-error Need to type _parsed
        pt(l, d, c).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        t ? i : pt(e, d, r.getPixelForValue(c)).lo
      ), h) {
        const g = l.slice(0, s + 1).reverse().findIndex((m) => !X(m[a.axis]));
        s -= Math.max(0, g);
      }
      s = we(s, 0, i - 1);
    }
    if (p) {
      let g = Math.max(
        // @ts-expect-error Need to type _parsed
        pt(l, r.axis, u, !0).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        t ? 0 : pt(e, d, r.getPixelForValue(u), !0).hi + 1
      );
      if (h) {
        const m = l.slice(g - 1).findIndex((v) => !X(v[a.axis]));
        g += Math.max(0, m);
      }
      n = we(g, s, i) - s;
    } else
      n = i - s;
  }
  return {
    start: s,
    count: n
  };
}
function tc(o) {
  const { xScale: e, yScale: t, _scaleRanges: i } = o, s = {
    xmin: e.min,
    xmax: e.max,
    ymin: t.min,
    ymax: t.max
  };
  if (!i)
    return o._scaleRanges = s, !0;
  const n = i.xmin !== e.min || i.xmax !== e.max || i.ymin !== t.min || i.ymax !== t.max;
  return Object.assign(i, s), n;
}
const Ci = (o) => o === 0 || o === 1, eo = (o, e, t) => -(Math.pow(2, 10 * (o -= 1)) * Math.sin((o - e) * De / t)), to = (o, e, t) => Math.pow(2, -10 * o) * Math.sin((o - e) * De / t) + 1, Jt = {
  linear: (o) => o,
  easeInQuad: (o) => o * o,
  easeOutQuad: (o) => -o * (o - 2),
  easeInOutQuad: (o) => (o /= 0.5) < 1 ? 0.5 * o * o : -0.5 * (--o * (o - 2) - 1),
  easeInCubic: (o) => o * o * o,
  easeOutCubic: (o) => (o -= 1) * o * o + 1,
  easeInOutCubic: (o) => (o /= 0.5) < 1 ? 0.5 * o * o * o : 0.5 * ((o -= 2) * o * o + 2),
  easeInQuart: (o) => o * o * o * o,
  easeOutQuart: (o) => -((o -= 1) * o * o * o - 1),
  easeInOutQuart: (o) => (o /= 0.5) < 1 ? 0.5 * o * o * o * o : -0.5 * ((o -= 2) * o * o * o - 2),
  easeInQuint: (o) => o * o * o * o * o,
  easeOutQuint: (o) => (o -= 1) * o * o * o * o + 1,
  easeInOutQuint: (o) => (o /= 0.5) < 1 ? 0.5 * o * o * o * o * o : 0.5 * ((o -= 2) * o * o * o * o + 2),
  easeInSine: (o) => -Math.cos(o * Re) + 1,
  easeOutSine: (o) => Math.sin(o * Re),
  easeInOutSine: (o) => -0.5 * (Math.cos(ne * o) - 1),
  easeInExpo: (o) => o === 0 ? 0 : Math.pow(2, 10 * (o - 1)),
  easeOutExpo: (o) => o === 1 ? 1 : -Math.pow(2, -10 * o) + 1,
  easeInOutExpo: (o) => Ci(o) ? o : o < 0.5 ? 0.5 * Math.pow(2, 10 * (o * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (o * 2 - 1)) + 2),
  easeInCirc: (o) => o >= 1 ? o : -(Math.sqrt(1 - o * o) - 1),
  easeOutCirc: (o) => Math.sqrt(1 - (o -= 1) * o),
  easeInOutCirc: (o) => (o /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - o * o) - 1) : 0.5 * (Math.sqrt(1 - (o -= 2) * o) + 1),
  easeInElastic: (o) => Ci(o) ? o : eo(o, 0.075, 0.3),
  easeOutElastic: (o) => Ci(o) ? o : to(o, 0.075, 0.3),
  easeInOutElastic(o) {
    return Ci(o) ? o : o < 0.5 ? 0.5 * eo(o * 2, 0.1125, 0.45) : 0.5 + 0.5 * to(o * 2 - 1, 0.1125, 0.45);
  },
  easeInBack(o) {
    return o * o * ((1.70158 + 1) * o - 1.70158);
  },
  easeOutBack(o) {
    return (o -= 1) * o * ((1.70158 + 1) * o + 1.70158) + 1;
  },
  easeInOutBack(o) {
    let e = 1.70158;
    return (o /= 0.5) < 1 ? 0.5 * (o * o * (((e *= 1.525) + 1) * o - e)) : 0.5 * ((o -= 2) * o * (((e *= 1.525) + 1) * o + e) + 2);
  },
  easeInBounce: (o) => 1 - Jt.easeOutBounce(1 - o),
  easeOutBounce(o) {
    return o < 1 / 2.75 ? 7.5625 * o * o : o < 2 / 2.75 ? 7.5625 * (o -= 1.5 / 2.75) * o + 0.75 : o < 2.5 / 2.75 ? 7.5625 * (o -= 2.25 / 2.75) * o + 0.9375 : 7.5625 * (o -= 2.625 / 2.75) * o + 0.984375;
  },
  easeInOutBounce: (o) => o < 0.5 ? Jt.easeInBounce(o * 2) * 0.5 : Jt.easeOutBounce(o * 2 - 1) * 0.5 + 0.5
};
function bn(o) {
  if (o && typeof o == "object") {
    const e = o.toString();
    return e === "[object CanvasPattern]" || e === "[object CanvasGradient]";
  }
  return !1;
}
function io(o) {
  return bn(o) ? o : new ri(o);
}
function hs(o) {
  return bn(o) ? o : new ri(o).saturate(0.5).darken(0.1).hexString();
}
const ic = [
  "x",
  "y",
  "borderWidth",
  "radius",
  "tension"
], sc = [
  "color",
  "borderColor",
  "backgroundColor"
];
function nc(o) {
  o.set("animation", {
    delay: void 0,
    duration: 1e3,
    easing: "easeOutQuart",
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0
  }), o.describe("animation", {
    _fallback: !1,
    _indexable: !1,
    _scriptable: (e) => e !== "onProgress" && e !== "onComplete" && e !== "fn"
  }), o.set("animations", {
    colors: {
      type: "color",
      properties: sc
    },
    numbers: {
      type: "number",
      properties: ic
    }
  }), o.describe("animations", {
    _fallback: "animation"
  }), o.set("transitions", {
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
          fn: (e) => e | 0
        }
      }
    }
  });
}
function oc(o) {
  o.set("layout", {
    autoPadding: !0,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });
}
const so = /* @__PURE__ */ new Map();
function rc(o, e) {
  e = e || {};
  const t = o + JSON.stringify(e);
  let i = so.get(t);
  return i || (i = new Intl.NumberFormat(o, e), so.set(t, i)), i;
}
function Pr(o, e, t) {
  return rc(e, t).format(o);
}
const ac = {
  values(o) {
    return se(o) ? o : "" + o;
  },
  numeric(o, e, t) {
    if (o === 0)
      return "0";
    const i = this.chart.options.locale;
    let s, n = o;
    if (t.length > 1) {
      const h = Math.max(Math.abs(t[0].value), Math.abs(t[t.length - 1].value));
      (h < 1e-4 || h > 1e15) && (s = "scientific"), n = lc(o, t);
    }
    const r = Lr(Math.abs(n)), a = isNaN(r) ? 1 : Math.max(Math.min(-1 * Math.floor(r), 20), 0), l = {
      notation: s,
      minimumFractionDigits: a,
      maximumFractionDigits: a
    };
    return Object.assign(l, this.options.ticks.format), Pr(o, i, l);
  }
};
function lc(o, e) {
  let t = e.length > 3 ? e[2].value - e[1].value : e[1].value - e[0].value;
  return Math.abs(t) >= 1 && o !== Math.floor(o) && (t = o - Math.floor(o)), t;
}
var Ar = {
  formatters: ac
};
function hc(o) {
  o.set("scale", {
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
      tickWidth: (e, t) => t.lineWidth,
      tickColor: (e, t) => t.color,
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
      callback: Ar.formatters.values,
      minor: {},
      major: {},
      align: "center",
      crossAlign: "near",
      showLabelBackdrop: !1,
      backdropColor: "rgba(255, 255, 255, 0.75)",
      backdropPadding: 2
    }
  }), o.route("scale.ticks", "color", "", "color"), o.route("scale.grid", "color", "", "borderColor"), o.route("scale.border", "color", "", "borderColor"), o.route("scale.title", "color", "", "color"), o.describe("scale", {
    _fallback: !1,
    _scriptable: (e) => !e.startsWith("before") && !e.startsWith("after") && e !== "callback" && e !== "parser",
    _indexable: (e) => e !== "borderDash" && e !== "tickBorderDash" && e !== "dash"
  }), o.describe("scales", {
    _fallback: "scale"
  }), o.describe("scale.ticks", {
    _scriptable: (e) => e !== "backdropPadding" && e !== "callback",
    _indexable: (e) => e !== "backdropPadding"
  });
}
const bt = /* @__PURE__ */ Object.create(null), Zs = /* @__PURE__ */ Object.create(null);
function Qt(o, e) {
  if (!e)
    return o;
  const t = e.split(".");
  for (let i = 0, s = t.length; i < s; ++i) {
    const n = t[i];
    o = o[n] || (o[n] = /* @__PURE__ */ Object.create(null));
  }
  return o;
}
function ds(o, e, t) {
  return typeof e == "string" ? ai(Qt(o, e), t) : ai(Qt(o, ""), e);
}
class dc {
  constructor(e, t) {
    this.animation = void 0, this.backgroundColor = "rgba(0,0,0,0.1)", this.borderColor = "rgba(0,0,0,0.1)", this.color = "#666", this.datasets = {}, this.devicePixelRatio = (i) => i.chart.platform.getDevicePixelRatio(), this.elements = {}, this.events = [
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
    }, this.hover = {}, this.hoverBackgroundColor = (i, s) => hs(s.backgroundColor), this.hoverBorderColor = (i, s) => hs(s.borderColor), this.hoverColor = (i, s) => hs(s.color), this.indexAxis = "x", this.interaction = {
      mode: "nearest",
      intersect: !0,
      includeInvisible: !1
    }, this.maintainAspectRatio = !0, this.onHover = null, this.onClick = null, this.parsing = !0, this.plugins = {}, this.responsive = !0, this.scale = void 0, this.scales = {}, this.showLine = !0, this.drawActiveElementsOnTop = !0, this.describe(e), this.apply(t);
  }
  set(e, t) {
    return ds(this, e, t);
  }
  get(e) {
    return Qt(this, e);
  }
  describe(e, t) {
    return ds(Zs, e, t);
  }
  override(e, t) {
    return ds(bt, e, t);
  }
  route(e, t, i, s) {
    const n = Qt(this, e), r = Qt(this, i), a = "_" + t;
    Object.defineProperties(n, {
      [a]: {
        value: n[t],
        writable: !0
      },
      [t]: {
        enumerable: !0,
        get() {
          const l = this[a], h = r[s];
          return N(l) ? Object.assign({}, h, l) : I(l, h);
        },
        set(l) {
          this[a] = l;
        }
      }
    });
  }
  apply(e) {
    e.forEach((t) => t(this));
  }
}
var te = /* @__PURE__ */ new dc({
  _scriptable: (o) => !o.startsWith("on"),
  _indexable: (o) => o !== "events",
  hover: {
    _fallback: "interaction"
  },
  interaction: {
    _scriptable: !1,
    _indexable: !1
  }
}, [
  nc,
  oc,
  hc
]);
function cc(o) {
  return !o || X(o.size) || X(o.family) ? null : (o.style ? o.style + " " : "") + (o.weight ? o.weight + " " : "") + o.size + "px " + o.family;
}
function no(o, e, t, i, s) {
  let n = e[s];
  return n || (n = e[s] = o.measureText(s).width, t.push(s)), n > i && (i = n), i;
}
function rt(o, e, t) {
  const i = o.currentDevicePixelRatio, s = t !== 0 ? Math.max(t / 2, 0.5) : 0;
  return Math.round((e - s) * i) / i + s;
}
function oo(o, e) {
  !e && !o || (e = e || o.getContext("2d"), e.save(), e.resetTransform(), e.clearRect(0, 0, o.width, o.height), e.restore());
}
function en(o, e, t, i) {
  Hr(o, e, t, i, null);
}
function Hr(o, e, t, i, s) {
  let n, r, a, l, h, d, c, u;
  const f = e.pointStyle, p = e.rotation, g = e.radius;
  let m = (p || 0) * Bd;
  if (f && typeof f == "object" && (n = f.toString(), n === "[object HTMLImageElement]" || n === "[object HTMLCanvasElement]")) {
    o.save(), o.translate(t, i), o.rotate(m), o.drawImage(f, -f.width / 2, -f.height / 2, f.width, f.height), o.restore();
    return;
  }
  if (!(isNaN(g) || g <= 0)) {
    switch (o.beginPath(), f) {
      default:
        s ? o.ellipse(t, i, s / 2, g, 0, 0, De) : o.arc(t, i, g, 0, De), o.closePath();
        break;
      case "triangle":
        d = s ? s / 2 : g, o.moveTo(t + Math.sin(m) * d, i - Math.cos(m) * g), m += qn, o.lineTo(t + Math.sin(m) * d, i - Math.cos(m) * g), m += qn, o.lineTo(t + Math.sin(m) * d, i - Math.cos(m) * g), o.closePath();
        break;
      case "rectRounded":
        h = g * 0.516, l = g - h, r = Math.cos(m + ot) * l, c = Math.cos(m + ot) * (s ? s / 2 - h : l), a = Math.sin(m + ot) * l, u = Math.sin(m + ot) * (s ? s / 2 - h : l), o.arc(t - c, i - a, h, m - ne, m - Re), o.arc(t + u, i - r, h, m - Re, m), o.arc(t + c, i + a, h, m, m + Re), o.arc(t - u, i + r, h, m + Re, m + ne), o.closePath();
        break;
      case "rect":
        if (!p) {
          l = Math.SQRT1_2 * g, d = s ? s / 2 : l, o.rect(t - d, i - l, 2 * d, 2 * l);
          break;
        }
        m += ot;
      case "rectRot":
        c = Math.cos(m) * (s ? s / 2 : g), r = Math.cos(m) * g, a = Math.sin(m) * g, u = Math.sin(m) * (s ? s / 2 : g), o.moveTo(t - c, i - a), o.lineTo(t + u, i - r), o.lineTo(t + c, i + a), o.lineTo(t - u, i + r), o.closePath();
        break;
      case "crossRot":
        m += ot;
      case "cross":
        c = Math.cos(m) * (s ? s / 2 : g), r = Math.cos(m) * g, a = Math.sin(m) * g, u = Math.sin(m) * (s ? s / 2 : g), o.moveTo(t - c, i - a), o.lineTo(t + c, i + a), o.moveTo(t + u, i - r), o.lineTo(t - u, i + r);
        break;
      case "star":
        c = Math.cos(m) * (s ? s / 2 : g), r = Math.cos(m) * g, a = Math.sin(m) * g, u = Math.sin(m) * (s ? s / 2 : g), o.moveTo(t - c, i - a), o.lineTo(t + c, i + a), o.moveTo(t + u, i - r), o.lineTo(t - u, i + r), m += ot, c = Math.cos(m) * (s ? s / 2 : g), r = Math.cos(m) * g, a = Math.sin(m) * g, u = Math.sin(m) * (s ? s / 2 : g), o.moveTo(t - c, i - a), o.lineTo(t + c, i + a), o.moveTo(t + u, i - r), o.lineTo(t - u, i + r);
        break;
      case "line":
        r = s ? s / 2 : Math.cos(m) * g, a = Math.sin(m) * g, o.moveTo(t - r, i - a), o.lineTo(t + r, i + a);
        break;
      case "dash":
        o.moveTo(t, i), o.lineTo(t + Math.cos(m) * (s ? s / 2 : g), i + Math.sin(m) * g);
        break;
      case !1:
        o.closePath();
        break;
    }
    o.fill(), e.borderWidth > 0 && o.stroke();
  }
}
function hi(o, e, t) {
  return t = t || 0.5, !e || o && o.x > e.left - t && o.x < e.right + t && o.y > e.top - t && o.y < e.bottom + t;
}
function vn(o, e) {
  o.save(), o.beginPath(), o.rect(e.left, e.top, e.right - e.left, e.bottom - e.top), o.clip();
}
function wn(o) {
  o.restore();
}
function uc(o, e, t, i, s) {
  if (!e)
    return o.lineTo(t.x, t.y);
  if (s === "middle") {
    const n = (e.x + t.x) / 2;
    o.lineTo(n, e.y), o.lineTo(n, t.y);
  } else s === "after" != !!i ? o.lineTo(e.x, t.y) : o.lineTo(t.x, e.y);
  o.lineTo(t.x, t.y);
}
function fc(o, e, t, i) {
  if (!e)
    return o.lineTo(t.x, t.y);
  o.bezierCurveTo(i ? e.cp1x : e.cp2x, i ? e.cp1y : e.cp2y, i ? t.cp2x : t.cp1x, i ? t.cp2y : t.cp1y, t.x, t.y);
}
function pc(o, e) {
  e.translation && o.translate(e.translation[0], e.translation[1]), X(e.rotation) || o.rotate(e.rotation), e.color && (o.fillStyle = e.color), e.textAlign && (o.textAlign = e.textAlign), e.textBaseline && (o.textBaseline = e.textBaseline);
}
function gc(o, e, t, i, s) {
  if (s.strikethrough || s.underline) {
    const n = o.measureText(i), r = e - n.actualBoundingBoxLeft, a = e + n.actualBoundingBoxRight, l = t - n.actualBoundingBoxAscent, h = t + n.actualBoundingBoxDescent, d = s.strikethrough ? (l + h) / 2 : h;
    o.strokeStyle = o.fillStyle, o.beginPath(), o.lineWidth = s.decorationWidth || 2, o.moveTo(r, d), o.lineTo(a, d), o.stroke();
  }
}
function mc(o, e) {
  const t = o.fillStyle;
  o.fillStyle = e.color, o.fillRect(e.left, e.top, e.width, e.height), o.fillStyle = t;
}
function di(o, e, t, i, s, n = {}) {
  const r = se(e) ? e : [
    e
  ], a = n.strokeWidth > 0 && n.strokeColor !== "";
  let l, h;
  for (o.save(), o.font = s.string, pc(o, n), l = 0; l < r.length; ++l)
    h = r[l], n.backdrop && mc(o, n.backdrop), a && (n.strokeColor && (o.strokeStyle = n.strokeColor), X(n.strokeWidth) || (o.lineWidth = n.strokeWidth), o.strokeText(h, t, i, n.maxWidth)), o.fillText(h, t, i, n.maxWidth), gc(o, t, i, h, n), i += Number(s.lineHeight);
  o.restore();
}
function tn(o, e) {
  const { x: t, y: i, w: s, h: n, radius: r } = e;
  o.arc(t + r.topLeft, i + r.topLeft, r.topLeft, 1.5 * ne, ne, !0), o.lineTo(t, i + n - r.bottomLeft), o.arc(t + r.bottomLeft, i + n - r.bottomLeft, r.bottomLeft, ne, Re, !0), o.lineTo(t + s - r.bottomRight, i + n), o.arc(t + s - r.bottomRight, i + n - r.bottomRight, r.bottomRight, Re, 0, !0), o.lineTo(t + s, i + r.topRight), o.arc(t + s - r.topRight, i + r.topRight, r.topRight, 0, -Re, !0), o.lineTo(t + r.topLeft, i);
}
const bc = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/, vc = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function wc(o, e) {
  const t = ("" + o).match(bc);
  if (!t || t[1] === "normal")
    return e * 1.2;
  switch (o = +t[2], t[3]) {
    case "px":
      return o;
    case "%":
      o /= 100;
      break;
  }
  return e * o;
}
const yc = (o) => +o || 0;
function Ir(o, e) {
  const t = {}, i = N(e), s = i ? Object.keys(e) : e, n = N(o) ? i ? (r) => I(o[r], o[e[r]]) : (r) => o[r] : () => o;
  for (const r of s)
    t[r] = yc(n(r));
  return t;
}
function Cc(o) {
  return Ir(o, {
    top: "y",
    right: "x",
    bottom: "y",
    left: "x"
  });
}
function Zt(o) {
  return Ir(o, [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);
}
function Ee(o) {
  const e = Cc(o);
  return e.width = e.left + e.right, e.height = e.top + e.bottom, e;
}
function le(o, e) {
  o = o || {}, e = e || te.font;
  let t = I(o.size, e.size);
  typeof t == "string" && (t = parseInt(t, 10));
  let i = I(o.style, e.style);
  i && !("" + i).match(vc) && (console.warn('Invalid font style specified: "' + i + '"'), i = void 0);
  const s = {
    family: I(o.family, e.family),
    lineHeight: wc(I(o.lineHeight, e.lineHeight), t),
    size: t,
    style: i,
    weight: I(o.weight, e.weight),
    string: ""
  };
  return s.string = cc(s), s;
}
function Ei(o, e, t, i) {
  let s, n, r;
  for (s = 0, n = o.length; s < n; ++s)
    if (r = o[s], r !== void 0 && r !== void 0)
      return r;
}
function Ec(o, e, t) {
  const { min: i, max: s } = o, n = zd(e, (s - i) / 2), r = (a, l) => t && a === 0 ? 0 : a + l;
  return {
    min: r(i, -Math.abs(n)),
    max: r(s, n)
  };
}
function vt(o, e) {
  return Object.assign(Object.create(o), e);
}
function yn(o, e = [
  ""
], t, i, s = () => o[0]) {
  const n = t || o;
  typeof i > "u" && (i = Wr("_fallback", o));
  const r = {
    [Symbol.toStringTag]: "Object",
    _cacheable: !0,
    _scopes: o,
    _rootScopes: n,
    _fallback: i,
    _getTarget: s,
    override: (a) => yn([
      a,
      ...o
    ], e, n, i)
  };
  return new Proxy(r, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(a, l) {
      return delete a[l], delete a._keys, delete o[0][l], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(a, l) {
      return Vr(a, l, () => Lc(l, e, o, a));
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
      return Reflect.getPrototypeOf(o[0]);
    },
    /**
    * A trap for the in operator.
    */
    has(a, l) {
      return ao(a).includes(l);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys(a) {
      return ao(a);
    },
    /**
    * A trap for setting property values.
    */
    set(a, l, h) {
      const d = a._storage || (a._storage = s());
      return a[l] = d[l] = h, delete a._keys, !0;
    }
  });
}
function Dt(o, e, t, i) {
  const s = {
    _cacheable: !1,
    _proxy: o,
    _context: e,
    _subProxy: t,
    _stack: /* @__PURE__ */ new Set(),
    _descriptors: Br(o, i),
    setContext: (n) => Dt(o, n, t, i),
    override: (n) => Dt(o.override(n), e, t, i)
  };
  return new Proxy(s, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(n, r) {
      return delete n[r], delete o[r], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(n, r, a) {
      return Vr(n, r, () => _c(n, r, a));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(n, r) {
      return n._descriptors.allKeys ? Reflect.has(o, r) ? {
        enumerable: !0,
        configurable: !0
      } : void 0 : Reflect.getOwnPropertyDescriptor(o, r);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(o);
    },
    /**
    * A trap for the in operator.
    */
    has(n, r) {
      return Reflect.has(o, r);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys() {
      return Reflect.ownKeys(o);
    },
    /**
    * A trap for setting property values.
    */
    set(n, r, a) {
      return o[r] = a, delete n[r], !0;
    }
  });
}
function Br(o, e = {
  scriptable: !0,
  indexable: !0
}) {
  const { _scriptable: t = e.scriptable, _indexable: i = e.indexable, _allKeys: s = e.allKeys } = o;
  return {
    allKeys: s,
    scriptable: t,
    indexable: i,
    isScriptable: Ze(t) ? t : () => t,
    isIndexable: Ze(i) ? i : () => i
  };
}
const xc = (o, e) => o ? o + pn(e) : e, Cn = (o, e) => N(e) && o !== "adapters" && (Object.getPrototypeOf(e) === null || e.constructor === Object);
function Vr(o, e, t) {
  if (Object.prototype.hasOwnProperty.call(o, e) || e === "constructor")
    return o[e];
  const i = t();
  return o[e] = i, i;
}
function _c(o, e, t) {
  const { _proxy: i, _context: s, _subProxy: n, _descriptors: r } = o;
  let a = i[e];
  return Ze(a) && r.isScriptable(e) && (a = Rc(e, a, o, t)), se(a) && a.length && (a = kc(e, a, o, r.isIndexable)), Cn(e, a) && (a = Dt(a, s, n && n[e], r)), a;
}
function Rc(o, e, t, i) {
  const { _proxy: s, _context: n, _subProxy: r, _stack: a } = t;
  if (a.has(o))
    throw new Error("Recursion detected: " + Array.from(a).join("->") + "->" + o);
  a.add(o);
  let l = e(n, r || i);
  return a.delete(o), Cn(o, l) && (l = En(s._scopes, s, o, l)), l;
}
function kc(o, e, t, i) {
  const { _proxy: s, _context: n, _subProxy: r, _descriptors: a } = t;
  if (typeof n.index < "u" && i(o))
    return e[n.index % e.length];
  if (N(e[0])) {
    const l = e, h = s._scopes.filter((d) => d !== l);
    e = [];
    for (const d of l) {
      const c = En(h, s, o, d);
      e.push(Dt(c, n, r && r[o], a));
    }
  }
  return e;
}
function Nr(o, e, t) {
  return Ze(o) ? o(e, t) : o;
}
const Mc = (o, e) => o === !0 ? e : typeof o == "string" ? Bi(e, o) : void 0;
function Tc(o, e, t, i, s) {
  for (const n of e) {
    const r = Mc(t, n);
    if (r) {
      o.add(r);
      const a = Nr(r._fallback, t, s);
      if (typeof a < "u" && a !== t && a !== i)
        return a;
    } else if (r === !1 && typeof i < "u" && t !== i)
      return null;
  }
  return !1;
}
function En(o, e, t, i) {
  const s = e._rootScopes, n = Nr(e._fallback, t, i), r = [
    ...o,
    ...s
  ], a = /* @__PURE__ */ new Set();
  a.add(i);
  let l = ro(a, r, t, n || t, i);
  return l === null || typeof n < "u" && n !== t && (l = ro(a, r, n, l, i), l === null) ? !1 : yn(Array.from(a), [
    ""
  ], s, n, () => Sc(e, t, i));
}
function ro(o, e, t, i, s) {
  for (; t; )
    t = Tc(o, e, t, i, s);
  return t;
}
function Sc(o, e, t) {
  const i = o._getTarget();
  e in i || (i[e] = {});
  const s = i[e];
  return se(s) && N(t) ? t : s || {};
}
function Lc(o, e, t, i) {
  let s;
  for (const n of e)
    if (s = Wr(xc(n, o), t), typeof s < "u")
      return Cn(o, s) ? En(t, i, o, s) : s;
}
function Wr(o, e) {
  for (const t of e) {
    if (!t)
      continue;
    const i = t[o];
    if (typeof i < "u")
      return i;
  }
}
function ao(o) {
  let e = o._keys;
  return e || (e = o._keys = Dc(o._scopes)), e;
}
function Dc(o) {
  const e = /* @__PURE__ */ new Set();
  for (const t of o)
    for (const i of Object.keys(t).filter((s) => !s.startsWith("_")))
      e.add(i);
  return Array.from(e);
}
const zc = Number.EPSILON || 1e-14, zt = (o, e) => e < o.length && !o[e].skip && o[e], jr = (o) => o === "x" ? "y" : "x";
function Fc(o, e, t, i) {
  const s = o.skip ? e : o, n = e, r = t.skip ? e : t, a = Qs(n, s), l = Qs(r, n);
  let h = a / (a + l), d = l / (a + l);
  h = isNaN(h) ? 0 : h, d = isNaN(d) ? 0 : d;
  const c = i * h, u = i * d;
  return {
    previous: {
      x: n.x - c * (r.x - s.x),
      y: n.y - c * (r.y - s.y)
    },
    next: {
      x: n.x + u * (r.x - s.x),
      y: n.y + u * (r.y - s.y)
    }
  };
}
function Oc(o, e, t) {
  const i = o.length;
  let s, n, r, a, l, h = zt(o, 0);
  for (let d = 0; d < i - 1; ++d)
    if (l = h, h = zt(o, d + 1), !(!l || !h)) {
      if (qt(e[d], 0, zc)) {
        t[d] = t[d + 1] = 0;
        continue;
      }
      s = t[d] / e[d], n = t[d + 1] / e[d], a = Math.pow(s, 2) + Math.pow(n, 2), !(a <= 9) && (r = 3 / Math.sqrt(a), t[d] = s * r * e[d], t[d + 1] = n * r * e[d]);
    }
}
function Pc(o, e, t = "x") {
  const i = jr(t), s = o.length;
  let n, r, a, l = zt(o, 0);
  for (let h = 0; h < s; ++h) {
    if (r = a, a = l, l = zt(o, h + 1), !a)
      continue;
    const d = a[t], c = a[i];
    r && (n = (d - r[t]) / 3, a[`cp1${t}`] = d - n, a[`cp1${i}`] = c - n * e[h]), l && (n = (l[t] - d) / 3, a[`cp2${t}`] = d + n, a[`cp2${i}`] = c + n * e[h]);
  }
}
function Ac(o, e = "x") {
  const t = jr(e), i = o.length, s = Array(i).fill(0), n = Array(i);
  let r, a, l, h = zt(o, 0);
  for (r = 0; r < i; ++r)
    if (a = l, l = h, h = zt(o, r + 1), !!l) {
      if (h) {
        const d = h[e] - l[e];
        s[r] = d !== 0 ? (h[t] - l[t]) / d : 0;
      }
      n[r] = a ? h ? Lt(s[r - 1]) !== Lt(s[r]) ? 0 : (s[r - 1] + s[r]) / 2 : s[r - 1] : s[r];
    }
  Oc(o, s, n), Pc(o, n, e);
}
function xi(o, e, t) {
  return Math.max(Math.min(o, t), e);
}
function Hc(o, e) {
  let t, i, s, n, r, a = hi(o[0], e);
  for (t = 0, i = o.length; t < i; ++t)
    r = n, n = a, a = t < i - 1 && hi(o[t + 1], e), n && (s = o[t], r && (s.cp1x = xi(s.cp1x, e.left, e.right), s.cp1y = xi(s.cp1y, e.top, e.bottom)), a && (s.cp2x = xi(s.cp2x, e.left, e.right), s.cp2y = xi(s.cp2y, e.top, e.bottom)));
}
function Ic(o, e, t, i, s) {
  let n, r, a, l;
  if (e.spanGaps && (o = o.filter((h) => !h.skip)), e.cubicInterpolationMode === "monotone")
    Ac(o, s);
  else {
    let h = i ? o[o.length - 1] : o[0];
    for (n = 0, r = o.length; n < r; ++n)
      a = o[n], l = Fc(h, a, o[Math.min(n + 1, r - (i ? 0 : 1)) % r], e.tension), a.cp1x = l.previous.x, a.cp1y = l.previous.y, a.cp2x = l.next.x, a.cp2y = l.next.y, h = a;
  }
  e.capBezierPoints && Hc(o, t);
}
function xn() {
  return typeof window < "u" && typeof document < "u";
}
function _n(o) {
  let e = o.parentNode;
  return e && e.toString() === "[object ShadowRoot]" && (e = e.host), e;
}
function Wi(o, e, t) {
  let i;
  return typeof o == "string" ? (i = parseInt(o, 10), o.indexOf("%") !== -1 && (i = i / 100 * e.parentNode[t])) : i = o, i;
}
const Yi = (o) => o.ownerDocument.defaultView.getComputedStyle(o, null);
function Bc(o, e) {
  return Yi(o).getPropertyValue(e);
}
const Vc = [
  "top",
  "right",
  "bottom",
  "left"
];
function mt(o, e, t) {
  const i = {};
  t = t ? "-" + t : "";
  for (let s = 0; s < 4; s++) {
    const n = Vc[s];
    i[n] = parseFloat(o[e + "-" + n + t]) || 0;
  }
  return i.width = i.left + i.right, i.height = i.top + i.bottom, i;
}
const Nc = (o, e, t) => (o > 0 || e > 0) && (!t || !t.shadowRoot);
function Wc(o, e) {
  const t = o.touches, i = t && t.length ? t[0] : o, { offsetX: s, offsetY: n } = i;
  let r = !1, a, l;
  if (Nc(s, n, o.target))
    a = s, l = n;
  else {
    const h = e.getBoundingClientRect();
    a = i.clientX - h.left, l = i.clientY - h.top, r = !0;
  }
  return {
    x: a,
    y: l,
    box: r
  };
}
function lt(o, e) {
  if ("native" in o)
    return o;
  const { canvas: t, currentDevicePixelRatio: i } = e, s = Yi(t), n = s.boxSizing === "border-box", r = mt(s, "padding"), a = mt(s, "border", "width"), { x: l, y: h, box: d } = Wc(o, t), c = r.left + (d && a.left), u = r.top + (d && a.top);
  let { width: f, height: p } = e;
  return n && (f -= r.width + a.width, p -= r.height + a.height), {
    x: Math.round((l - c) / f * t.width / i),
    y: Math.round((h - u) / p * t.height / i)
  };
}
function jc(o, e, t) {
  let i, s;
  if (e === void 0 || t === void 0) {
    const n = o && _n(o);
    if (!n)
      e = o.clientWidth, t = o.clientHeight;
    else {
      const r = n.getBoundingClientRect(), a = Yi(n), l = mt(a, "border", "width"), h = mt(a, "padding");
      e = r.width - h.width - l.width, t = r.height - h.height - l.height, i = Wi(a.maxWidth, n, "clientWidth"), s = Wi(a.maxHeight, n, "clientHeight");
    }
  }
  return {
    width: e,
    height: t,
    maxWidth: i || Ni,
    maxHeight: s || Ni
  };
}
const _i = (o) => Math.round(o * 10) / 10;
function Gc(o, e, t, i) {
  const s = Yi(o), n = mt(s, "margin"), r = Wi(s.maxWidth, o, "clientWidth") || Ni, a = Wi(s.maxHeight, o, "clientHeight") || Ni, l = jc(o, e, t);
  let { width: h, height: d } = l;
  if (s.boxSizing === "content-box") {
    const u = mt(s, "border", "width"), f = mt(s, "padding");
    h -= f.width + u.width, d -= f.height + u.height;
  }
  return h = Math.max(0, h - n.width), d = Math.max(0, i ? h / i : d - n.height), h = _i(Math.min(h, r, l.maxWidth)), d = _i(Math.min(d, a, l.maxHeight)), h && !d && (d = _i(h / 2)), (e !== void 0 || t !== void 0) && i && l.height && d > l.height && (d = l.height, h = _i(Math.floor(d * i))), {
    width: h,
    height: d
  };
}
function lo(o, e, t) {
  const i = e || 1, s = Math.floor(o.height * i), n = Math.floor(o.width * i);
  o.height = Math.floor(o.height), o.width = Math.floor(o.width);
  const r = o.canvas;
  return r.style && (t || !r.style.height && !r.style.width) && (r.style.height = `${o.height}px`, r.style.width = `${o.width}px`), o.currentDevicePixelRatio !== i || r.height !== s || r.width !== n ? (o.currentDevicePixelRatio = i, r.height = s, r.width = n, o.ctx.setTransform(i, 0, 0, i, 0, 0), !0) : !1;
}
const Uc = function() {
  let o = !1;
  try {
    const e = {
      get passive() {
        return o = !0, !1;
      }
    };
    xn() && (window.addEventListener("test", null, e), window.removeEventListener("test", null, e));
  } catch {
  }
  return o;
}();
function ho(o, e) {
  const t = Bc(o, e), i = t && t.match(/^(\d+)(\.\d+)?px$/);
  return i ? +i[1] : void 0;
}
function ht(o, e, t, i) {
  return {
    x: o.x + t * (e.x - o.x),
    y: o.y + t * (e.y - o.y)
  };
}
function $c(o, e, t, i) {
  return {
    x: o.x + t * (e.x - o.x),
    y: i === "middle" ? t < 0.5 ? o.y : e.y : i === "after" ? t < 1 ? o.y : e.y : t > 0 ? e.y : o.y
  };
}
function Xc(o, e, t, i) {
  const s = {
    x: o.cp2x,
    y: o.cp2y
  }, n = {
    x: e.cp1x,
    y: e.cp1y
  }, r = ht(o, s, t), a = ht(s, n, t), l = ht(n, e, t), h = ht(r, a, t), d = ht(a, l, t);
  return ht(h, d, t);
}
const Yc = function(o, e) {
  return {
    x(t) {
      return o + o + e - t;
    },
    setWidth(t) {
      e = t;
    },
    textAlign(t) {
      return t === "center" ? t : t === "right" ? "left" : "right";
    },
    xPlus(t, i) {
      return t - i;
    },
    leftForLtr(t, i) {
      return t - i;
    }
  };
}, Kc = function() {
  return {
    x(o) {
      return o;
    },
    setWidth(o) {
    },
    textAlign(o) {
      return o;
    },
    xPlus(o, e) {
      return o + e;
    },
    leftForLtr(o, e) {
      return o;
    }
  };
};
function St(o, e, t) {
  return o ? Yc(e, t) : Kc();
}
function Gr(o, e) {
  let t, i;
  (e === "ltr" || e === "rtl") && (t = o.canvas.style, i = [
    t.getPropertyValue("direction"),
    t.getPropertyPriority("direction")
  ], t.setProperty("direction", e, "important"), o.prevTextDirection = i);
}
function Ur(o, e) {
  e !== void 0 && (delete o.prevTextDirection, o.canvas.style.setProperty("direction", e[0], e[1]));
}
function $r(o) {
  return o === "angle" ? {
    between: Dr,
    compare: $d,
    normalize: Ge
  } : {
    between: Ut,
    compare: (e, t) => e - t,
    normalize: (e) => e
  };
}
function co({ start: o, end: e, count: t, loop: i, style: s }) {
  return {
    start: o % t,
    end: e % t,
    loop: i && (e - o + 1) % t === 0,
    style: s
  };
}
function qc(o, e, t) {
  const { property: i, start: s, end: n } = t, { between: r, normalize: a } = $r(i), l = e.length;
  let { start: h, end: d, loop: c } = o, u, f;
  if (c) {
    for (h += l, d += l, u = 0, f = l; u < f && r(a(e[h % l][i]), s, n); ++u)
      h--, d--;
    h %= l, d %= l;
  }
  return d < h && (d += l), {
    start: h,
    end: d,
    loop: c,
    style: o.style
  };
}
function Jc(o, e, t) {
  if (!t)
    return [
      o
    ];
  const { property: i, start: s, end: n } = t, r = e.length, { compare: a, between: l, normalize: h } = $r(i), { start: d, end: c, loop: u, style: f } = qc(o, e, t), p = [];
  let g = !1, m = null, v, x, E;
  const k = () => l(s, E, v) && a(s, E) !== 0, y = () => a(n, v) === 0 || l(n, E, v), S = () => g || k(), D = () => !g || y();
  for (let T = d, F = d; T <= c; ++T)
    x = e[T % r], !x.skip && (v = h(x[i]), v !== E && (g = l(v, s, n), m === null && S() && (m = a(v, s) === 0 ? T : F), m !== null && D() && (p.push(co({
      start: m,
      end: T,
      loop: u,
      count: r,
      style: f
    })), m = null), F = T, E = v));
  return m !== null && p.push(co({
    start: m,
    end: c,
    loop: u,
    count: r,
    style: f
  })), p;
}
function Qc(o, e) {
  const t = [], i = o.segments;
  for (let s = 0; s < i.length; s++) {
    const n = Jc(i[s], o.points, e);
    n.length && t.push(...n);
  }
  return t;
}
function Zc(o, e, t, i) {
  let s = 0, n = e - 1;
  if (t && !i)
    for (; s < e && !o[s].skip; )
      s++;
  for (; s < e && o[s].skip; )
    s++;
  for (s %= e, t && (n += s); n > s && o[n % e].skip; )
    n--;
  return n %= e, {
    start: s,
    end: n
  };
}
function eu(o, e, t, i) {
  const s = o.length, n = [];
  let r = e, a = o[e], l;
  for (l = e + 1; l <= t; ++l) {
    const h = o[l % s];
    h.skip || h.stop ? a.skip || (i = !1, n.push({
      start: e % s,
      end: (l - 1) % s,
      loop: i
    }), e = r = h.stop ? l : null) : (r = l, a.skip && (e = l)), a = h;
  }
  return r !== null && n.push({
    start: e % s,
    end: r % s,
    loop: i
  }), n;
}
function tu(o, e) {
  const t = o.points, i = o.options.spanGaps, s = t.length;
  if (!s)
    return [];
  const n = !!o._loop, { start: r, end: a } = Zc(t, s, n, i);
  if (i === !0)
    return uo(o, [
      {
        start: r,
        end: a,
        loop: n
      }
    ], t, e);
  const l = a < r ? a + s : a, h = !!o._fullLoop && r === 0 && a === s - 1;
  return uo(o, eu(t, r, l, h), t, e);
}
function uo(o, e, t, i) {
  return !i || !i.setContext || !t ? e : iu(o, e, t, i);
}
function iu(o, e, t, i) {
  const s = o._chart.getContext(), n = fo(o.options), { _datasetIndex: r, options: { spanGaps: a } } = o, l = t.length, h = [];
  let d = n, c = e[0].start, u = c;
  function f(p, g, m, v) {
    const x = a ? -1 : 1;
    if (p !== g) {
      for (p += l; t[p % l].skip; )
        p -= x;
      for (; t[g % l].skip; )
        g += x;
      p % l !== g % l && (h.push({
        start: p % l,
        end: g % l,
        loop: m,
        style: v
      }), d = v, c = g % l);
    }
  }
  for (const p of e) {
    c = a ? c : p.start;
    let g = t[c % l], m;
    for (u = c + 1; u <= p.end; u++) {
      const v = t[u % l];
      m = fo(i.setContext(vt(s, {
        type: "segment",
        p0: g,
        p1: v,
        p0DataIndex: (u - 1) % l,
        p1DataIndex: u % l,
        datasetIndex: r
      }))), su(m, d) && f(c, u - 1, p.loop, d), g = v, d = m;
    }
    c < u - 1 && f(c, u - 1, p.loop, d);
  }
  return h;
}
function fo(o) {
  return {
    backgroundColor: o.backgroundColor,
    borderCapStyle: o.borderCapStyle,
    borderDash: o.borderDash,
    borderDashOffset: o.borderDashOffset,
    borderJoinStyle: o.borderJoinStyle,
    borderWidth: o.borderWidth,
    borderColor: o.borderColor
  };
}
function su(o, e) {
  if (!e)
    return !1;
  const t = [], i = function(s, n) {
    return bn(n) ? (t.includes(n) || t.push(n), t.indexOf(n)) : n;
  };
  return JSON.stringify(o, i) !== JSON.stringify(e, i);
}
function Ri(o, e, t) {
  return o.options.clip ? o[t] : e[t];
}
function nu(o, e) {
  const { xScale: t, yScale: i } = o;
  return t && i ? {
    left: Ri(t, e, "left"),
    right: Ri(t, e, "right"),
    top: Ri(i, e, "top"),
    bottom: Ri(i, e, "bottom")
  } : e;
}
function ou(o, e) {
  const t = e._clip;
  if (t.disabled)
    return !1;
  const i = nu(e, o.chartArea);
  return {
    left: t.left === !1 ? 0 : i.left - (t.left === !0 ? 0 : t.left),
    right: t.right === !1 ? o.width : i.right + (t.right === !0 ? 0 : t.right),
    top: t.top === !1 ? 0 : i.top - (t.top === !0 ? 0 : t.top),
    bottom: t.bottom === !1 ? o.height : i.bottom + (t.bottom === !0 ? 0 : t.bottom)
  };
}
/*!
 * Chart.js v4.5.0
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
class ru {
  constructor() {
    this._request = null, this._charts = /* @__PURE__ */ new Map(), this._running = !1, this._lastDate = void 0;
  }
  _notify(e, t, i, s) {
    const n = t.listeners[s], r = t.duration;
    n.forEach((a) => a({
      chart: e,
      initial: t.initial,
      numSteps: r,
      currentStep: Math.min(i - t.start, r)
    }));
  }
  _refresh() {
    this._request || (this._running = !0, this._request = Fr.call(window, () => {
      this._update(), this._request = null, this._running && this._refresh();
    }));
  }
  _update(e = Date.now()) {
    let t = 0;
    this._charts.forEach((i, s) => {
      if (!i.running || !i.items.length)
        return;
      const n = i.items;
      let r = n.length - 1, a = !1, l;
      for (; r >= 0; --r)
        l = n[r], l._active ? (l._total > i.duration && (i.duration = l._total), l.tick(e), a = !0) : (n[r] = n[n.length - 1], n.pop());
      a && (s.draw(), this._notify(s, i, e, "progress")), n.length || (i.running = !1, this._notify(s, i, e, "complete"), i.initial = !1), t += n.length;
    }), this._lastDate = e, t === 0 && (this._running = !1);
  }
  _getAnims(e) {
    const t = this._charts;
    let i = t.get(e);
    return i || (i = {
      running: !1,
      initial: !0,
      items: [],
      listeners: {
        complete: [],
        progress: []
      }
    }, t.set(e, i)), i;
  }
  listen(e, t, i) {
    this._getAnims(e).listeners[t].push(i);
  }
  add(e, t) {
    !t || !t.length || this._getAnims(e).items.push(...t);
  }
  has(e) {
    return this._getAnims(e).items.length > 0;
  }
  start(e) {
    const t = this._charts.get(e);
    t && (t.running = !0, t.start = Date.now(), t.duration = t.items.reduce((i, s) => Math.max(i, s._duration), 0), this._refresh());
  }
  running(e) {
    if (!this._running)
      return !1;
    const t = this._charts.get(e);
    return !(!t || !t.running || !t.items.length);
  }
  stop(e) {
    const t = this._charts.get(e);
    if (!t || !t.items.length)
      return;
    const i = t.items;
    let s = i.length - 1;
    for (; s >= 0; --s)
      i[s].cancel();
    t.items = [], this._notify(e, t, Date.now(), "complete");
  }
  remove(e) {
    return this._charts.delete(e);
  }
}
var Pe = /* @__PURE__ */ new ru();
const po = "transparent", au = {
  boolean(o, e, t) {
    return t > 0.5 ? e : o;
  },
  color(o, e, t) {
    const i = io(o || po), s = i.valid && io(e || po);
    return s && s.valid ? s.mix(i, t).hexString() : e;
  },
  number(o, e, t) {
    return o + (e - o) * t;
  }
};
class lu {
  constructor(e, t, i, s) {
    const n = t[i];
    s = Ei([
      e.to,
      s,
      n,
      e.from
    ]);
    const r = Ei([
      e.from,
      n,
      s
    ]);
    this._active = !0, this._fn = e.fn || au[e.type || typeof r], this._easing = Jt[e.easing] || Jt.linear, this._start = Math.floor(Date.now() + (e.delay || 0)), this._duration = this._total = Math.floor(e.duration), this._loop = !!e.loop, this._target = t, this._prop = i, this._from = r, this._to = s, this._promises = void 0;
  }
  active() {
    return this._active;
  }
  update(e, t, i) {
    if (this._active) {
      this._notify(!1);
      const s = this._target[this._prop], n = i - this._start, r = this._duration - n;
      this._start = i, this._duration = Math.floor(Math.max(r, e.duration)), this._total += n, this._loop = !!e.loop, this._to = Ei([
        e.to,
        t,
        s,
        e.from
      ]), this._from = Ei([
        e.from,
        s,
        t
      ]);
    }
  }
  cancel() {
    this._active && (this.tick(Date.now()), this._active = !1, this._notify(!1));
  }
  tick(e) {
    const t = e - this._start, i = this._duration, s = this._prop, n = this._from, r = this._loop, a = this._to;
    let l;
    if (this._active = n !== a && (r || t < i), !this._active) {
      this._target[s] = a, this._notify(!0);
      return;
    }
    if (t < 0) {
      this._target[s] = n;
      return;
    }
    l = t / i % 2, l = r && l > 1 ? 2 - l : l, l = this._easing(Math.min(1, Math.max(0, l))), this._target[s] = this._fn(n, a, l);
  }
  wait() {
    const e = this._promises || (this._promises = []);
    return new Promise((t, i) => {
      e.push({
        res: t,
        rej: i
      });
    });
  }
  _notify(e) {
    const t = e ? "res" : "rej", i = this._promises || [];
    for (let s = 0; s < i.length; s++)
      i[s][t]();
  }
}
class Xr {
  constructor(e, t) {
    this._chart = e, this._properties = /* @__PURE__ */ new Map(), this.configure(t);
  }
  configure(e) {
    if (!N(e))
      return;
    const t = Object.keys(te.animation), i = this._properties;
    Object.getOwnPropertyNames(e).forEach((s) => {
      const n = e[s];
      if (!N(n))
        return;
      const r = {};
      for (const a of t)
        r[a] = n[a];
      (se(n.properties) && n.properties || [
        s
      ]).forEach((a) => {
        (a === s || !i.has(a)) && i.set(a, r);
      });
    });
  }
  _animateOptions(e, t) {
    const i = t.options, s = du(e, i);
    if (!s)
      return [];
    const n = this._createAnimations(s, i);
    return i.$shared && hu(e.options.$animations, i).then(() => {
      e.options = i;
    }, () => {
    }), n;
  }
  _createAnimations(e, t) {
    const i = this._properties, s = [], n = e.$animations || (e.$animations = {}), r = Object.keys(t), a = Date.now();
    let l;
    for (l = r.length - 1; l >= 0; --l) {
      const h = r[l];
      if (h.charAt(0) === "$")
        continue;
      if (h === "options") {
        s.push(...this._animateOptions(e, t));
        continue;
      }
      const d = t[h];
      let c = n[h];
      const u = i.get(h);
      if (c)
        if (u && c.active()) {
          c.update(u, d, a);
          continue;
        } else
          c.cancel();
      if (!u || !u.duration) {
        e[h] = d;
        continue;
      }
      n[h] = c = new lu(u, e, h, d), s.push(c);
    }
    return s;
  }
  update(e, t) {
    if (this._properties.size === 0) {
      Object.assign(e, t);
      return;
    }
    const i = this._createAnimations(e, t);
    if (i.length)
      return Pe.add(this._chart, i), !0;
  }
}
function hu(o, e) {
  const t = [], i = Object.keys(e);
  for (let s = 0; s < i.length; s++) {
    const n = o[i[s]];
    n && n.active() && t.push(n.wait());
  }
  return Promise.all(t);
}
function du(o, e) {
  if (!e)
    return;
  let t = o.options;
  if (!t) {
    o.options = e;
    return;
  }
  return t.$shared && (o.options = t = Object.assign({}, t, {
    $shared: !1,
    $animations: {}
  })), t;
}
function go(o, e) {
  const t = o && o.options || {}, i = t.reverse, s = t.min === void 0 ? e : 0, n = t.max === void 0 ? e : 0;
  return {
    start: i ? n : s,
    end: i ? s : n
  };
}
function cu(o, e, t) {
  if (t === !1)
    return !1;
  const i = go(o, t), s = go(e, t);
  return {
    top: s.end,
    right: i.end,
    bottom: s.start,
    left: i.start
  };
}
function uu(o) {
  let e, t, i, s;
  return N(o) ? (e = o.top, t = o.right, i = o.bottom, s = o.left) : e = t = i = s = o, {
    top: e,
    right: t,
    bottom: i,
    left: s,
    disabled: o === !1
  };
}
function Yr(o, e) {
  const t = [], i = o._getSortedDatasetMetas(e);
  let s, n;
  for (s = 0, n = i.length; s < n; ++s)
    t.push(i[s].index);
  return t;
}
function mo(o, e, t, i = {}) {
  const s = o.keys, n = i.mode === "single";
  let r, a, l, h;
  if (e === null)
    return;
  let d = !1;
  for (r = 0, a = s.length; r < a; ++r) {
    if (l = +s[r], l === t) {
      if (d = !0, i.all)
        continue;
      break;
    }
    h = o.values[l], Ce(h) && (n || e === 0 || Lt(e) === Lt(h)) && (e += h);
  }
  return !d && !i.all ? 0 : e;
}
function fu(o, e) {
  const { iScale: t, vScale: i } = e, s = t.axis === "x" ? "x" : "y", n = i.axis === "x" ? "x" : "y", r = Object.keys(o), a = new Array(r.length);
  let l, h, d;
  for (l = 0, h = r.length; l < h; ++l)
    d = r[l], a[l] = {
      [s]: d,
      [n]: o[d]
    };
  return a;
}
function cs(o, e) {
  const t = o && o.options.stacked;
  return t || t === void 0 && e.stack !== void 0;
}
function pu(o, e, t) {
  return `${o.id}.${e.id}.${t.stack || t.type}`;
}
function gu(o) {
  const { min: e, max: t, minDefined: i, maxDefined: s } = o.getUserBounds();
  return {
    min: i ? e : Number.NEGATIVE_INFINITY,
    max: s ? t : Number.POSITIVE_INFINITY
  };
}
function mu(o, e, t) {
  const i = o[e] || (o[e] = {});
  return i[t] || (i[t] = {});
}
function bo(o, e, t, i) {
  for (const s of e.getMatchingVisibleMetas(i).reverse()) {
    const n = o[s.index];
    if (t && n > 0 || !t && n < 0)
      return s.index;
  }
  return null;
}
function vo(o, e) {
  const { chart: t, _cachedMeta: i } = o, s = t._stacks || (t._stacks = {}), { iScale: n, vScale: r, index: a } = i, l = n.axis, h = r.axis, d = pu(n, r, i), c = e.length;
  let u;
  for (let f = 0; f < c; ++f) {
    const p = e[f], { [l]: g, [h]: m } = p, v = p._stacks || (p._stacks = {});
    u = v[h] = mu(s, d, g), u[a] = m, u._top = bo(u, r, !0, i.type), u._bottom = bo(u, r, !1, i.type);
    const x = u._visualValues || (u._visualValues = {});
    x[a] = m;
  }
}
function us(o, e) {
  const t = o.scales;
  return Object.keys(t).filter((i) => t[i].axis === e).shift();
}
function bu(o, e) {
  return vt(o, {
    active: !1,
    dataset: void 0,
    datasetIndex: e,
    index: e,
    mode: "default",
    type: "dataset"
  });
}
function vu(o, e, t) {
  return vt(o, {
    active: !1,
    dataIndex: e,
    parsed: void 0,
    raw: void 0,
    element: t,
    index: e,
    mode: "default",
    type: "data"
  });
}
function It(o, e) {
  const t = o.controller.index, i = o.vScale && o.vScale.axis;
  if (i) {
    e = e || o._parsed;
    for (const s of e) {
      const n = s._stacks;
      if (!n || n[i] === void 0 || n[i][t] === void 0)
        return;
      delete n[i][t], n[i]._visualValues !== void 0 && n[i]._visualValues[t] !== void 0 && delete n[i]._visualValues[t];
    }
  }
}
const fs = (o) => o === "reset" || o === "none", wo = (o, e) => e ? o : Object.assign({}, o), wu = (o, e, t) => o && !e.hidden && e._stacked && {
  keys: Yr(t, !0),
  values: null
};
class ei {
  constructor(e, t) {
    this.chart = e, this._ctx = e.ctx, this.index = t, this._cachedDataOpts = {}, this._cachedMeta = this.getMeta(), this._type = this._cachedMeta.type, this.options = void 0, this._parsing = !1, this._data = void 0, this._objectData = void 0, this._sharedOptions = void 0, this._drawStart = void 0, this._drawCount = void 0, this.enableOptionSharing = !1, this.supportsDecimation = !1, this.$context = void 0, this._syncList = [], this.datasetElementType = new.target.datasetElementType, this.dataElementType = new.target.dataElementType, this.initialize();
  }
  initialize() {
    const e = this._cachedMeta;
    this.configure(), this.linkScales(), e._stacked = cs(e.vScale, e), this.addElements(), this.options.fill && !this.chart.isPluginEnabled("filler") && console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
  }
  updateIndex(e) {
    this.index !== e && It(this._cachedMeta), this.index = e;
  }
  linkScales() {
    const e = this.chart, t = this._cachedMeta, i = this.getDataset(), s = (c, u, f, p) => c === "x" ? u : c === "r" ? p : f, n = t.xAxisID = I(i.xAxisID, us(e, "x")), r = t.yAxisID = I(i.yAxisID, us(e, "y")), a = t.rAxisID = I(i.rAxisID, us(e, "r")), l = t.indexAxis, h = t.iAxisID = s(l, n, r, a), d = t.vAxisID = s(l, r, n, a);
    t.xScale = this.getScaleForId(n), t.yScale = this.getScaleForId(r), t.rScale = this.getScaleForId(a), t.iScale = this.getScaleForId(h), t.vScale = this.getScaleForId(d);
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(e) {
    return this.chart.scales[e];
  }
  _getOtherScale(e) {
    const t = this._cachedMeta;
    return e === t.iScale ? t.vScale : t.iScale;
  }
  reset() {
    this._update("reset");
  }
  _destroy() {
    const e = this._cachedMeta;
    this._data && Zn(this._data, this), e._stacked && It(e);
  }
  _dataCheck() {
    const e = this.getDataset(), t = e.data || (e.data = []), i = this._data;
    if (N(t)) {
      const s = this._cachedMeta;
      this._data = fu(t, s);
    } else if (i !== t) {
      if (i) {
        Zn(i, this);
        const s = this._cachedMeta;
        It(s), s._parsed = [];
      }
      t && Object.isExtensible(t) && qd(t, this), this._syncList = [], this._data = t;
    }
  }
  addElements() {
    const e = this._cachedMeta;
    this._dataCheck(), this.datasetElementType && (e.dataset = new this.datasetElementType());
  }
  buildOrUpdateElements(e) {
    const t = this._cachedMeta, i = this.getDataset();
    let s = !1;
    this._dataCheck();
    const n = t._stacked;
    t._stacked = cs(t.vScale, t), t.stack !== i.stack && (s = !0, It(t), t.stack = i.stack), this._resyncElements(e), (s || n !== t._stacked) && (vo(this, t._parsed), t._stacked = cs(t.vScale, t));
  }
  configure() {
    const e = this.chart.config, t = e.datasetScopeKeys(this._type), i = e.getOptionScopes(this.getDataset(), t, !0);
    this.options = e.createResolver(i, this.getContext()), this._parsing = this.options.parsing, this._cachedDataOpts = {};
  }
  parse(e, t) {
    const { _cachedMeta: i, _data: s } = this, { iScale: n, _stacked: r } = i, a = n.axis;
    let l = e === 0 && t === s.length ? !0 : i._sorted, h = e > 0 && i._parsed[e - 1], d, c, u;
    if (this._parsing === !1)
      i._parsed = s, i._sorted = !0, u = s;
    else {
      se(s[e]) ? u = this.parseArrayData(i, s, e, t) : N(s[e]) ? u = this.parseObjectData(i, s, e, t) : u = this.parsePrimitiveData(i, s, e, t);
      const f = () => c[a] === null || h && c[a] < h[a];
      for (d = 0; d < t; ++d)
        i._parsed[d + e] = c = u[d], l && (f() && (l = !1), h = c);
      i._sorted = l;
    }
    r && vo(this, u);
  }
  parsePrimitiveData(e, t, i, s) {
    const { iScale: n, vScale: r } = e, a = n.axis, l = r.axis, h = n.getLabels(), d = n === r, c = new Array(s);
    let u, f, p;
    for (u = 0, f = s; u < f; ++u)
      p = u + i, c[u] = {
        [a]: d || n.parse(h[p], p),
        [l]: r.parse(t[p], p)
      };
    return c;
  }
  parseArrayData(e, t, i, s) {
    const { xScale: n, yScale: r } = e, a = new Array(s);
    let l, h, d, c;
    for (l = 0, h = s; l < h; ++l)
      d = l + i, c = t[d], a[l] = {
        x: n.parse(c[0], d),
        y: r.parse(c[1], d)
      };
    return a;
  }
  parseObjectData(e, t, i, s) {
    const { xScale: n, yScale: r } = e, { xAxisKey: a = "x", yAxisKey: l = "y" } = this._parsing, h = new Array(s);
    let d, c, u, f;
    for (d = 0, c = s; d < c; ++d)
      u = d + i, f = t[u], h[d] = {
        x: n.parse(Bi(f, a), u),
        y: r.parse(Bi(f, l), u)
      };
    return h;
  }
  getParsed(e) {
    return this._cachedMeta._parsed[e];
  }
  getDataElement(e) {
    return this._cachedMeta.data[e];
  }
  applyStack(e, t, i) {
    const s = this.chart, n = this._cachedMeta, r = t[e.axis], a = {
      keys: Yr(s, !0),
      values: t._stacks[e.axis]._visualValues
    };
    return mo(a, r, n.index, {
      mode: i
    });
  }
  updateRangeFromParsed(e, t, i, s) {
    const n = i[t.axis];
    let r = n === null ? NaN : n;
    const a = s && i._stacks[t.axis];
    s && a && (s.values = a, r = mo(s, n, this._cachedMeta.index)), e.min = Math.min(e.min, r), e.max = Math.max(e.max, r);
  }
  getMinMax(e, t) {
    const i = this._cachedMeta, s = i._parsed, n = i._sorted && e === i.iScale, r = s.length, a = this._getOtherScale(e), l = wu(t, i, this.chart), h = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    }, { min: d, max: c } = gu(a);
    let u, f;
    function p() {
      f = s[u];
      const g = f[a.axis];
      return !Ce(f[e.axis]) || d > g || c < g;
    }
    for (u = 0; u < r && !(!p() && (this.updateRangeFromParsed(h, e, f, l), n)); ++u)
      ;
    if (n) {
      for (u = r - 1; u >= 0; --u)
        if (!p()) {
          this.updateRangeFromParsed(h, e, f, l);
          break;
        }
    }
    return h;
  }
  getAllParsedValues(e) {
    const t = this._cachedMeta._parsed, i = [];
    let s, n, r;
    for (s = 0, n = t.length; s < n; ++s)
      r = t[s][e.axis], Ce(r) && i.push(r);
    return i;
  }
  getMaxOverflow() {
    return !1;
  }
  getLabelAndValue(e) {
    const t = this._cachedMeta, i = t.iScale, s = t.vScale, n = this.getParsed(e);
    return {
      label: i ? "" + i.getLabelForValue(n[i.axis]) : "",
      value: s ? "" + s.getLabelForValue(n[s.axis]) : ""
    };
  }
  _update(e) {
    const t = this._cachedMeta;
    this.update(e || "default"), t._clip = uu(I(this.options.clip, cu(t.xScale, t.yScale, this.getMaxOverflow())));
  }
  update(e) {
  }
  draw() {
    const e = this._ctx, t = this.chart, i = this._cachedMeta, s = i.data || [], n = t.chartArea, r = [], a = this._drawStart || 0, l = this._drawCount || s.length - a, h = this.options.drawActiveElementsOnTop;
    let d;
    for (i.dataset && i.dataset.draw(e, n, a, l), d = a; d < a + l; ++d) {
      const c = s[d];
      c.hidden || (c.active && h ? r.push(c) : c.draw(e, n));
    }
    for (d = 0; d < r.length; ++d)
      r[d].draw(e, n);
  }
  getStyle(e, t) {
    const i = t ? "active" : "default";
    return e === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(i) : this.resolveDataElementOptions(e || 0, i);
  }
  getContext(e, t, i) {
    const s = this.getDataset();
    let n;
    if (e >= 0 && e < this._cachedMeta.data.length) {
      const r = this._cachedMeta.data[e];
      n = r.$context || (r.$context = vu(this.getContext(), e, r)), n.parsed = this.getParsed(e), n.raw = s.data[e], n.index = n.dataIndex = e;
    } else
      n = this.$context || (this.$context = bu(this.chart.getContext(), this.index)), n.dataset = s, n.index = n.datasetIndex = this.index;
    return n.active = !!t, n.mode = i, n;
  }
  resolveDatasetElementOptions(e) {
    return this._resolveElementOptions(this.datasetElementType.id, e);
  }
  resolveDataElementOptions(e, t) {
    return this._resolveElementOptions(this.dataElementType.id, t, e);
  }
  _resolveElementOptions(e, t = "default", i) {
    const s = t === "active", n = this._cachedDataOpts, r = e + "-" + t, a = n[r], l = this.enableOptionSharing && Vi(i);
    if (a)
      return wo(a, l);
    const h = this.chart.config, d = h.datasetElementScopeKeys(this._type, e), c = s ? [
      `${e}Hover`,
      "hover",
      e,
      ""
    ] : [
      e,
      ""
    ], u = h.getOptionScopes(this.getDataset(), d), f = Object.keys(te.elements[e]), p = () => this.getContext(i, s, t), g = h.resolveNamedOptions(u, f, p, c);
    return g.$shared && (g.$shared = l, n[r] = Object.freeze(wo(g, l))), g;
  }
  _resolveAnimations(e, t, i) {
    const s = this.chart, n = this._cachedDataOpts, r = `animation-${t}`, a = n[r];
    if (a)
      return a;
    let l;
    if (s.options.animation !== !1) {
      const d = this.chart.config, c = d.datasetAnimationScopeKeys(this._type, t), u = d.getOptionScopes(this.getDataset(), c);
      l = d.createResolver(u, this.getContext(e, i, t));
    }
    const h = new Xr(s, l && l.animations);
    return l && l._cacheable && (n[r] = Object.freeze(h)), h;
  }
  getSharedOptions(e) {
    if (e.$shared)
      return this._sharedOptions || (this._sharedOptions = Object.assign({}, e));
  }
  includeOptions(e, t) {
    return !t || fs(e) || this.chart._animationsDisabled;
  }
  _getSharedOptions(e, t) {
    const i = this.resolveDataElementOptions(e, t), s = this._sharedOptions, n = this.getSharedOptions(i), r = this.includeOptions(t, n) || n !== s;
    return this.updateSharedOptions(n, t, i), {
      sharedOptions: n,
      includeOptions: r
    };
  }
  updateElement(e, t, i, s) {
    fs(s) ? Object.assign(e, i) : this._resolveAnimations(t, s).update(e, i);
  }
  updateSharedOptions(e, t, i) {
    e && !fs(t) && this._resolveAnimations(void 0, t).update(e, i);
  }
  _setStyle(e, t, i, s) {
    e.active = s;
    const n = this.getStyle(t, s);
    this._resolveAnimations(t, i, s).update(e, {
      options: !s && this.getSharedOptions(n) || n
    });
  }
  removeHoverStyle(e, t, i) {
    this._setStyle(e, i, "active", !1);
  }
  setHoverStyle(e, t, i) {
    this._setStyle(e, i, "active", !0);
  }
  _removeDatasetHoverStyle() {
    const e = this._cachedMeta.dataset;
    e && this._setStyle(e, void 0, "active", !1);
  }
  _setDatasetHoverStyle() {
    const e = this._cachedMeta.dataset;
    e && this._setStyle(e, void 0, "active", !0);
  }
  _resyncElements(e) {
    const t = this._data, i = this._cachedMeta.data;
    for (const [a, l, h] of this._syncList)
      this[a](l, h);
    this._syncList = [];
    const s = i.length, n = t.length, r = Math.min(n, s);
    r && this.parse(0, r), n > s ? this._insertElements(s, n - s, e) : n < s && this._removeElements(n, s - n);
  }
  _insertElements(e, t, i = !0) {
    const s = this._cachedMeta, n = s.data, r = e + t;
    let a;
    const l = (h) => {
      for (h.length += t, a = h.length - 1; a >= r; a--)
        h[a] = h[a - t];
    };
    for (l(n), a = e; a < r; ++a)
      n[a] = new this.dataElementType();
    this._parsing && l(s._parsed), this.parse(e, t), i && this.updateElements(n, e, t, "reset");
  }
  updateElements(e, t, i, s) {
  }
  _removeElements(e, t) {
    const i = this._cachedMeta;
    if (this._parsing) {
      const s = i._parsed.splice(e, t);
      i._stacked && It(i, s);
    }
    i.data.splice(e, t);
  }
  _sync(e) {
    if (this._parsing)
      this._syncList.push(e);
    else {
      const [t, i, s] = e;
      this[t](i, s);
    }
    this.chart._dataChanges.push([
      this.index,
      ...e
    ]);
  }
  _onDataPush() {
    const e = arguments.length;
    this._sync([
      "_insertElements",
      this.getDataset().data.length - e,
      e
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
  _onDataSplice(e, t) {
    t && this._sync([
      "_removeElements",
      e,
      t
    ]);
    const i = arguments.length - 2;
    i && this._sync([
      "_insertElements",
      e,
      i
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
C(ei, "defaults", {}), C(ei, "datasetElementType", null), C(ei, "dataElementType", null);
class Fi extends ei {
  initialize() {
    this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize();
  }
  update(e) {
    const t = this._cachedMeta, { dataset: i, data: s = [], _dataset: n } = t, r = this.chart._animationsDisabled;
    let { start: a, count: l } = ec(t, s, r);
    this._drawStart = a, this._drawCount = l, tc(t) && (a = 0, l = s.length), i._chart = this.chart, i._datasetIndex = this.index, i._decimated = !!n._decimated, i.points = s;
    const h = this.resolveDatasetElementOptions(e);
    this.options.showLine || (h.borderWidth = 0), h.segment = this.options.segment, this.updateElement(i, void 0, {
      animated: !r,
      options: h
    }, e), this.updateElements(s, a, l, e);
  }
  updateElements(e, t, i, s) {
    const n = s === "reset", { iScale: r, vScale: a, _stacked: l, _dataset: h } = this._cachedMeta, { sharedOptions: d, includeOptions: c } = this._getSharedOptions(t, s), u = r.axis, f = a.axis, { spanGaps: p, segment: g } = this.options, m = li(p) ? p : Number.POSITIVE_INFINITY, v = this.chart._animationsDisabled || n || s === "none", x = t + i, E = e.length;
    let k = t > 0 && this.getParsed(t - 1);
    for (let y = 0; y < E; ++y) {
      const S = e[y], D = v ? S : {};
      if (y < t || y >= x) {
        D.skip = !0;
        continue;
      }
      const T = this.getParsed(y), F = X(T[f]), H = D[u] = r.getPixelForValue(T[u], y), P = D[f] = n || F ? a.getBasePixel() : a.getPixelForValue(l ? this.applyStack(a, T, l) : T[f], y);
      D.skip = isNaN(H) || isNaN(P) || F, D.stop = y > 0 && Math.abs(T[u] - k[u]) > m, g && (D.parsed = T, D.raw = h.data[y]), c && (D.options = d || this.resolveDataElementOptions(y, S.active ? "active" : s)), v || this.updateElement(S, y, D, s), k = T;
    }
  }
  getMaxOverflow() {
    const e = this._cachedMeta, t = e.dataset, i = t.options && t.options.borderWidth || 0, s = e.data || [];
    if (!s.length)
      return i;
    const n = s[0].size(this.resolveDataElementOptions(0)), r = s[s.length - 1].size(this.resolveDataElementOptions(s.length - 1));
    return Math.max(i, n, r) / 2;
  }
  draw() {
    const e = this._cachedMeta;
    e.dataset.updateControlPoints(this.chart.chartArea, e.iScale.axis), super.draw();
  }
}
C(Fi, "id", "line"), C(Fi, "defaults", {
  datasetElementType: "line",
  dataElementType: "point",
  showLine: !0,
  spanGaps: !1
}), C(Fi, "overrides", {
  scales: {
    _index_: {
      type: "category"
    },
    _value_: {
      type: "linear"
    }
  }
});
function at() {
  throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
}
class Rn {
  constructor(e) {
    C(this, "options");
    this.options = e || {};
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
  static override(e) {
    Object.assign(Rn.prototype, e);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {
  }
  formats() {
    return at();
  }
  parse() {
    return at();
  }
  format() {
    return at();
  }
  add() {
    return at();
  }
  diff() {
    return at();
  }
  startOf() {
    return at();
  }
  endOf() {
    return at();
  }
}
var yu = {
  _date: Rn
};
function Cu(o, e, t, i) {
  const { controller: s, data: n, _sorted: r } = o, a = s._cachedMeta.iScale, l = o.dataset && o.dataset.options ? o.dataset.options.spanGaps : null;
  if (a && e === a.axis && e !== "r" && r && n.length) {
    const h = a._reversePixels ? Yd : pt;
    if (i) {
      if (s._sharedOptions) {
        const d = n[0], c = typeof d.getRange == "function" && d.getRange(e);
        if (c) {
          const u = h(n, e, t - c), f = h(n, e, t + c);
          return {
            lo: u.lo,
            hi: f.hi
          };
        }
      }
    } else {
      const d = h(n, e, t);
      if (l) {
        const { vScale: c } = s._cachedMeta, { _parsed: u } = o, f = u.slice(0, d.lo + 1).reverse().findIndex((g) => !X(g[c.axis]));
        d.lo -= Math.max(0, f);
        const p = u.slice(d.hi).findIndex((g) => !X(g[c.axis]));
        d.hi += Math.max(0, p);
      }
      return d;
    }
  }
  return {
    lo: 0,
    hi: n.length - 1
  };
}
function Ki(o, e, t, i, s) {
  const n = o.getSortedVisibleDatasetMetas(), r = t[e];
  for (let a = 0, l = n.length; a < l; ++a) {
    const { index: h, data: d } = n[a], { lo: c, hi: u } = Cu(n[a], e, r, s);
    for (let f = c; f <= u; ++f) {
      const p = d[f];
      p.skip || i(p, h, f);
    }
  }
}
function Eu(o) {
  const e = o.indexOf("x") !== -1, t = o.indexOf("y") !== -1;
  return function(i, s) {
    const n = e ? Math.abs(i.x - s.x) : 0, r = t ? Math.abs(i.y - s.y) : 0;
    return Math.sqrt(Math.pow(n, 2) + Math.pow(r, 2));
  };
}
function ps(o, e, t, i, s) {
  const n = [];
  return !s && !o.isPointInArea(e) || Ki(o, t, e, function(a, l, h) {
    !s && !hi(a, o.chartArea, 0) || a.inRange(e.x, e.y, i) && n.push({
      element: a,
      datasetIndex: l,
      index: h
    });
  }, !0), n;
}
function xu(o, e, t, i) {
  let s = [];
  function n(r, a, l) {
    const { startAngle: h, endAngle: d } = r.getProps([
      "startAngle",
      "endAngle"
    ], i), { angle: c } = Ud(r, {
      x: e.x,
      y: e.y
    });
    Dr(c, h, d) && s.push({
      element: r,
      datasetIndex: a,
      index: l
    });
  }
  return Ki(o, t, e, n), s;
}
function _u(o, e, t, i, s, n) {
  let r = [];
  const a = Eu(t);
  let l = Number.POSITIVE_INFINITY;
  function h(d, c, u) {
    const f = d.inRange(e.x, e.y, s);
    if (i && !f)
      return;
    const p = d.getCenterPoint(s);
    if (!(!!n || o.isPointInArea(p)) && !f)
      return;
    const m = a(e, p);
    m < l ? (r = [
      {
        element: d,
        datasetIndex: c,
        index: u
      }
    ], l = m) : m === l && r.push({
      element: d,
      datasetIndex: c,
      index: u
    });
  }
  return Ki(o, t, e, h), r;
}
function gs(o, e, t, i, s, n) {
  return !n && !o.isPointInArea(e) ? [] : t === "r" && !i ? xu(o, e, t, s) : _u(o, e, t, i, s, n);
}
function yo(o, e, t, i, s) {
  const n = [], r = t === "x" ? "inXRange" : "inYRange";
  let a = !1;
  return Ki(o, t, e, (l, h, d) => {
    l[r] && l[r](e[t], s) && (n.push({
      element: l,
      datasetIndex: h,
      index: d
    }), a = a || l.inRange(e.x, e.y, s));
  }), i && !a ? [] : n;
}
var Ru = {
  modes: {
    index(o, e, t, i) {
      const s = lt(e, o), n = t.axis || "x", r = t.includeInvisible || !1, a = t.intersect ? ps(o, s, n, i, r) : gs(o, s, n, !1, i, r), l = [];
      return a.length ? (o.getSortedVisibleDatasetMetas().forEach((h) => {
        const d = a[0].index, c = h.data[d];
        c && !c.skip && l.push({
          element: c,
          datasetIndex: h.index,
          index: d
        });
      }), l) : [];
    },
    dataset(o, e, t, i) {
      const s = lt(e, o), n = t.axis || "xy", r = t.includeInvisible || !1;
      let a = t.intersect ? ps(o, s, n, i, r) : gs(o, s, n, !1, i, r);
      if (a.length > 0) {
        const l = a[0].datasetIndex, h = o.getDatasetMeta(l).data;
        a = [];
        for (let d = 0; d < h.length; ++d)
          a.push({
            element: h[d],
            datasetIndex: l,
            index: d
          });
      }
      return a;
    },
    point(o, e, t, i) {
      const s = lt(e, o), n = t.axis || "xy", r = t.includeInvisible || !1;
      return ps(o, s, n, i, r);
    },
    nearest(o, e, t, i) {
      const s = lt(e, o), n = t.axis || "xy", r = t.includeInvisible || !1;
      return gs(o, s, n, t.intersect, i, r);
    },
    x(o, e, t, i) {
      const s = lt(e, o);
      return yo(o, s, "x", t.intersect, i);
    },
    y(o, e, t, i) {
      const s = lt(e, o);
      return yo(o, s, "y", t.intersect, i);
    }
  }
};
const Kr = [
  "left",
  "top",
  "right",
  "bottom"
];
function Bt(o, e) {
  return o.filter((t) => t.pos === e);
}
function Co(o, e) {
  return o.filter((t) => Kr.indexOf(t.pos) === -1 && t.box.axis === e);
}
function Vt(o, e) {
  return o.sort((t, i) => {
    const s = e ? i : t, n = e ? t : i;
    return s.weight === n.weight ? s.index - n.index : s.weight - n.weight;
  });
}
function ku(o) {
  const e = [];
  let t, i, s, n, r, a;
  for (t = 0, i = (o || []).length; t < i; ++t)
    s = o[t], { position: n, options: { stack: r, stackWeight: a = 1 } } = s, e.push({
      index: t,
      box: s,
      pos: n,
      horizontal: s.isHorizontal(),
      weight: s.weight,
      stack: r && n + r,
      stackWeight: a
    });
  return e;
}
function Mu(o) {
  const e = {};
  for (const t of o) {
    const { stack: i, pos: s, stackWeight: n } = t;
    if (!i || !Kr.includes(s))
      continue;
    const r = e[i] || (e[i] = {
      count: 0,
      placed: 0,
      weight: 0,
      size: 0
    });
    r.count++, r.weight += n;
  }
  return e;
}
function Tu(o, e) {
  const t = Mu(o), { vBoxMaxWidth: i, hBoxMaxHeight: s } = e;
  let n, r, a;
  for (n = 0, r = o.length; n < r; ++n) {
    a = o[n];
    const { fullSize: l } = a.box, h = t[a.stack], d = h && a.stackWeight / h.weight;
    a.horizontal ? (a.width = d ? d * i : l && e.availableWidth, a.height = s) : (a.width = i, a.height = d ? d * s : l && e.availableHeight);
  }
  return t;
}
function Su(o) {
  const e = ku(o), t = Vt(e.filter((h) => h.box.fullSize), !0), i = Vt(Bt(e, "left"), !0), s = Vt(Bt(e, "right")), n = Vt(Bt(e, "top"), !0), r = Vt(Bt(e, "bottom")), a = Co(e, "x"), l = Co(e, "y");
  return {
    fullSize: t,
    leftAndTop: i.concat(n),
    rightAndBottom: s.concat(l).concat(r).concat(a),
    chartArea: Bt(e, "chartArea"),
    vertical: i.concat(s).concat(l),
    horizontal: n.concat(r).concat(a)
  };
}
function Eo(o, e, t, i) {
  return Math.max(o[t], e[t]) + Math.max(o[i], e[i]);
}
function qr(o, e) {
  o.top = Math.max(o.top, e.top), o.left = Math.max(o.left, e.left), o.bottom = Math.max(o.bottom, e.bottom), o.right = Math.max(o.right, e.right);
}
function Lu(o, e, t, i) {
  const { pos: s, box: n } = t, r = o.maxPadding;
  if (!N(s)) {
    t.size && (o[s] -= t.size);
    const c = i[t.stack] || {
      size: 0,
      count: 1
    };
    c.size = Math.max(c.size, t.horizontal ? n.height : n.width), t.size = c.size / c.count, o[s] += t.size;
  }
  n.getPadding && qr(r, n.getPadding());
  const a = Math.max(0, e.outerWidth - Eo(r, o, "left", "right")), l = Math.max(0, e.outerHeight - Eo(r, o, "top", "bottom")), h = a !== o.w, d = l !== o.h;
  return o.w = a, o.h = l, t.horizontal ? {
    same: h,
    other: d
  } : {
    same: d,
    other: h
  };
}
function Du(o) {
  const e = o.maxPadding;
  function t(i) {
    const s = Math.max(e[i] - o[i], 0);
    return o[i] += s, s;
  }
  o.y += t("top"), o.x += t("left"), t("right"), t("bottom");
}
function zu(o, e) {
  const t = e.maxPadding;
  function i(s) {
    const n = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
    return s.forEach((r) => {
      n[r] = Math.max(e[r], t[r]);
    }), n;
  }
  return i(o ? [
    "left",
    "right"
  ] : [
    "top",
    "bottom"
  ]);
}
function $t(o, e, t, i) {
  const s = [];
  let n, r, a, l, h, d;
  for (n = 0, r = o.length, h = 0; n < r; ++n) {
    a = o[n], l = a.box, l.update(a.width || e.w, a.height || e.h, zu(a.horizontal, e));
    const { same: c, other: u } = Lu(e, t, a, i);
    h |= c && s.length, d = d || u, l.fullSize || s.push(a);
  }
  return h && $t(s, e, t, i) || d;
}
function ki(o, e, t, i, s) {
  o.top = t, o.left = e, o.right = e + i, o.bottom = t + s, o.width = i, o.height = s;
}
function xo(o, e, t, i) {
  const s = t.padding;
  let { x: n, y: r } = e;
  for (const a of o) {
    const l = a.box, h = i[a.stack] || {
      placed: 0,
      weight: 1
    }, d = a.stackWeight / h.weight || 1;
    if (a.horizontal) {
      const c = e.w * d, u = h.size || l.height;
      Vi(h.start) && (r = h.start), l.fullSize ? ki(l, s.left, r, t.outerWidth - s.right - s.left, u) : ki(l, e.left + h.placed, r, c, u), h.start = r, h.placed += c, r = l.bottom;
    } else {
      const c = e.h * d, u = h.size || l.width;
      Vi(h.start) && (n = h.start), l.fullSize ? ki(l, n, s.top, u, t.outerHeight - s.bottom - s.top) : ki(l, n, e.top + h.placed, u, c), h.start = n, h.placed += c, n = l.right;
    }
  }
  e.x = n, e.y = r;
}
var ye = {
  addBox(o, e) {
    o.boxes || (o.boxes = []), e.fullSize = e.fullSize || !1, e.position = e.position || "top", e.weight = e.weight || 0, e._layers = e._layers || function() {
      return [
        {
          z: 0,
          draw(t) {
            e.draw(t);
          }
        }
      ];
    }, o.boxes.push(e);
  },
  removeBox(o, e) {
    const t = o.boxes ? o.boxes.indexOf(e) : -1;
    t !== -1 && o.boxes.splice(t, 1);
  },
  configure(o, e, t) {
    e.fullSize = t.fullSize, e.position = t.position, e.weight = t.weight;
  },
  update(o, e, t, i) {
    if (!o)
      return;
    const s = Ee(o.options.layout.padding), n = Math.max(e - s.width, 0), r = Math.max(t - s.height, 0), a = Su(o.boxes), l = a.vertical, h = a.horizontal;
    G(o.boxes, (g) => {
      typeof g.beforeLayout == "function" && g.beforeLayout();
    });
    const d = l.reduce((g, m) => m.box.options && m.box.options.display === !1 ? g : g + 1, 0) || 1, c = Object.freeze({
      outerWidth: e,
      outerHeight: t,
      padding: s,
      availableWidth: n,
      availableHeight: r,
      vBoxMaxWidth: n / 2 / d,
      hBoxMaxHeight: r / 2
    }), u = Object.assign({}, s);
    qr(u, Ee(i));
    const f = Object.assign({
      maxPadding: u,
      w: n,
      h: r,
      x: s.left,
      y: s.top
    }, s), p = Tu(l.concat(h), c);
    $t(a.fullSize, f, c, p), $t(l, f, c, p), $t(h, f, c, p) && $t(l, f, c, p), Du(f), xo(a.leftAndTop, f, c, p), f.x += f.w, f.y += f.h, xo(a.rightAndBottom, f, c, p), o.chartArea = {
      left: f.left,
      top: f.top,
      right: f.left + f.w,
      bottom: f.top + f.h,
      height: f.h,
      width: f.w
    }, G(a.chartArea, (g) => {
      const m = g.box;
      Object.assign(m, o.chartArea), m.update(f.w, f.h, {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      });
    });
  }
};
class Jr {
  acquireContext(e, t) {
  }
  releaseContext(e) {
    return !1;
  }
  addEventListener(e, t, i) {
  }
  removeEventListener(e, t, i) {
  }
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(e, t, i, s) {
    return t = Math.max(0, t || e.width), i = i || e.height, {
      width: t,
      height: Math.max(0, s ? Math.floor(t / s) : i)
    };
  }
  isAttached(e) {
    return !0;
  }
  updateConfig(e) {
  }
}
class Fu extends Jr {
  acquireContext(e) {
    return e && e.getContext && e.getContext("2d") || null;
  }
  updateConfig(e) {
    e.options.animation = !1;
  }
}
const Oi = "$chartjs", Ou = {
  touchstart: "mousedown",
  touchmove: "mousemove",
  touchend: "mouseup",
  pointerenter: "mouseenter",
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointerleave: "mouseout",
  pointerout: "mouseout"
}, _o = (o) => o === null || o === "";
function Pu(o, e) {
  const t = o.style, i = o.getAttribute("height"), s = o.getAttribute("width");
  if (o[Oi] = {
    initial: {
      height: i,
      width: s,
      style: {
        display: t.display,
        height: t.height,
        width: t.width
      }
    }
  }, t.display = t.display || "block", t.boxSizing = t.boxSizing || "border-box", _o(s)) {
    const n = ho(o, "width");
    n !== void 0 && (o.width = n);
  }
  if (_o(i))
    if (o.style.height === "")
      o.height = o.width / (e || 2);
    else {
      const n = ho(o, "height");
      n !== void 0 && (o.height = n);
    }
  return o;
}
const Qr = Uc ? {
  passive: !0
} : !1;
function Au(o, e, t) {
  o && o.addEventListener(e, t, Qr);
}
function Hu(o, e, t) {
  o && o.canvas && o.canvas.removeEventListener(e, t, Qr);
}
function Iu(o, e) {
  const t = Ou[o.type] || o.type, { x: i, y: s } = lt(o, e);
  return {
    type: t,
    chart: e,
    native: o,
    x: i !== void 0 ? i : null,
    y: s !== void 0 ? s : null
  };
}
function ji(o, e) {
  for (const t of o)
    if (t === e || t.contains(e))
      return !0;
}
function Bu(o, e, t) {
  const i = o.canvas, s = new MutationObserver((n) => {
    let r = !1;
    for (const a of n)
      r = r || ji(a.addedNodes, i), r = r && !ji(a.removedNodes, i);
    r && t();
  });
  return s.observe(document, {
    childList: !0,
    subtree: !0
  }), s;
}
function Vu(o, e, t) {
  const i = o.canvas, s = new MutationObserver((n) => {
    let r = !1;
    for (const a of n)
      r = r || ji(a.removedNodes, i), r = r && !ji(a.addedNodes, i);
    r && t();
  });
  return s.observe(document, {
    childList: !0,
    subtree: !0
  }), s;
}
const ci = /* @__PURE__ */ new Map();
let Ro = 0;
function Zr() {
  const o = window.devicePixelRatio;
  o !== Ro && (Ro = o, ci.forEach((e, t) => {
    t.currentDevicePixelRatio !== o && e();
  }));
}
function Nu(o, e) {
  ci.size || window.addEventListener("resize", Zr), ci.set(o, e);
}
function Wu(o) {
  ci.delete(o), ci.size || window.removeEventListener("resize", Zr);
}
function ju(o, e, t) {
  const i = o.canvas, s = i && _n(i);
  if (!s)
    return;
  const n = Or((a, l) => {
    const h = s.clientWidth;
    t(a, l), h < s.clientWidth && t();
  }, window), r = new ResizeObserver((a) => {
    const l = a[0], h = l.contentRect.width, d = l.contentRect.height;
    h === 0 && d === 0 || n(h, d);
  });
  return r.observe(s), Nu(o, n), r;
}
function ms(o, e, t) {
  t && t.disconnect(), e === "resize" && Wu(o);
}
function Gu(o, e, t) {
  const i = o.canvas, s = Or((n) => {
    o.ctx !== null && t(Iu(n, o));
  }, o);
  return Au(i, e, s), s;
}
class Uu extends Jr {
  acquireContext(e, t) {
    const i = e && e.getContext && e.getContext("2d");
    return i && i.canvas === e ? (Pu(e, t), i) : null;
  }
  releaseContext(e) {
    const t = e.canvas;
    if (!t[Oi])
      return !1;
    const i = t[Oi].initial;
    [
      "height",
      "width"
    ].forEach((n) => {
      const r = i[n];
      X(r) ? t.removeAttribute(n) : t.setAttribute(n, r);
    });
    const s = i.style || {};
    return Object.keys(s).forEach((n) => {
      t.style[n] = s[n];
    }), t.width = t.width, delete t[Oi], !0;
  }
  addEventListener(e, t, i) {
    this.removeEventListener(e, t);
    const s = e.$proxies || (e.$proxies = {}), r = {
      attach: Bu,
      detach: Vu,
      resize: ju
    }[t] || Gu;
    s[t] = r(e, t, i);
  }
  removeEventListener(e, t) {
    const i = e.$proxies || (e.$proxies = {}), s = i[t];
    if (!s)
      return;
    ({
      attach: ms,
      detach: ms,
      resize: ms
    }[t] || Hu)(e, t, s), i[t] = void 0;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(e, t, i, s) {
    return Gc(e, t, i, s);
  }
  isAttached(e) {
    const t = e && _n(e);
    return !!(t && t.isConnected);
  }
}
function $u(o) {
  return !xn() || typeof OffscreenCanvas < "u" && o instanceof OffscreenCanvas ? Fu : Uu;
}
class Ve {
  constructor() {
    C(this, "x");
    C(this, "y");
    C(this, "active", !1);
    C(this, "options");
    C(this, "$animations");
  }
  tooltipPosition(e) {
    const { x: t, y: i } = this.getProps([
      "x",
      "y"
    ], e);
    return {
      x: t,
      y: i
    };
  }
  hasValue() {
    return li(this.x) && li(this.y);
  }
  getProps(e, t) {
    const i = this.$animations;
    if (!t || !i)
      return this;
    const s = {};
    return e.forEach((n) => {
      s[n] = i[n] && i[n].active() ? i[n]._to : this[n];
    }), s;
  }
}
C(Ve, "defaults", {}), C(Ve, "defaultRoutes");
function Xu(o, e) {
  const t = o.options.ticks, i = Yu(o), s = Math.min(t.maxTicksLimit || i, i), n = t.major.enabled ? qu(e) : [], r = n.length, a = n[0], l = n[r - 1], h = [];
  if (r > s)
    return Ju(e, h, n, r / s), h;
  const d = Ku(n, e, s);
  if (r > 0) {
    let c, u;
    const f = r > 1 ? Math.round((l - a) / (r - 1)) : null;
    for (Mi(e, h, d, X(f) ? 0 : a - f, a), c = 0, u = r - 1; c < u; c++)
      Mi(e, h, d, n[c], n[c + 1]);
    return Mi(e, h, d, l, X(f) ? e.length : l + f), h;
  }
  return Mi(e, h, d), h;
}
function Yu(o) {
  const e = o.options.offset, t = o._tickSize(), i = o._length / t + (e ? 0 : 1), s = o._maxLength / t;
  return Math.floor(Math.min(i, s));
}
function Ku(o, e, t) {
  const i = Qu(o), s = e.length / t;
  if (!i)
    return Math.max(s, 1);
  const n = Vd(i);
  for (let r = 0, a = n.length - 1; r < a; r++) {
    const l = n[r];
    if (l > s)
      return l;
  }
  return Math.max(s, 1);
}
function qu(o) {
  const e = [];
  let t, i;
  for (t = 0, i = o.length; t < i; t++)
    o[t].major && e.push(t);
  return e;
}
function Ju(o, e, t, i) {
  let s = 0, n = t[0], r;
  for (i = Math.ceil(i), r = 0; r < o.length; r++)
    r === n && (e.push(o[r]), s++, n = t[s * i]);
}
function Mi(o, e, t, i, s) {
  const n = I(i, 0), r = Math.min(I(s, o.length), o.length);
  let a = 0, l, h, d;
  for (t = Math.ceil(t), s && (l = s - i, t = l / Math.floor(l / t)), d = n; d < 0; )
    a++, d = Math.round(n + a * t);
  for (h = Math.max(n, 0); h < r; h++)
    h === d && (e.push(o[h]), a++, d = Math.round(n + a * t));
}
function Qu(o) {
  const e = o.length;
  let t, i;
  if (e < 2)
    return !1;
  for (i = o[0], t = 1; t < e; ++t)
    if (o[t] - o[t - 1] !== i)
      return !1;
  return i;
}
const Zu = (o) => o === "left" ? "right" : o === "right" ? "left" : o, ko = (o, e, t) => e === "top" || e === "left" ? o[e] + t : o[e] - t, Mo = (o, e) => Math.min(e || o, o);
function To(o, e) {
  const t = [], i = o.length / e, s = o.length;
  let n = 0;
  for (; n < s; n += i)
    t.push(o[Math.floor(n)]);
  return t;
}
function ef(o, e, t) {
  const i = o.ticks.length, s = Math.min(e, i - 1), n = o._startPixel, r = o._endPixel, a = 1e-6;
  let l = o.getPixelForTick(s), h;
  if (!(t && (i === 1 ? h = Math.max(l - n, r - l) : e === 0 ? h = (o.getPixelForTick(1) - l) / 2 : h = (l - o.getPixelForTick(s - 1)) / 2, l += s < e ? h : -h, l < n - a || l > r + a)))
    return l;
}
function tf(o, e) {
  G(o, (t) => {
    const i = t.gc, s = i.length / 2;
    let n;
    if (s > e) {
      for (n = 0; n < s; ++n)
        delete t.data[i[n]];
      i.splice(0, s);
    }
  });
}
function Nt(o) {
  return o.drawTicks ? o.tickLength : 0;
}
function So(o, e) {
  if (!o.display)
    return 0;
  const t = le(o.font, e), i = Ee(o.padding);
  return (se(o.text) ? o.text.length : 1) * t.lineHeight + i.height;
}
function sf(o, e) {
  return vt(o, {
    scale: e,
    type: "scale"
  });
}
function nf(o, e, t) {
  return vt(o, {
    tick: t,
    index: e,
    type: "tick"
  });
}
function of(o, e, t) {
  let i = mn(o);
  return (t && e !== "right" || !t && e === "right") && (i = Zu(i)), i;
}
function rf(o, e, t, i) {
  const { top: s, left: n, bottom: r, right: a, chart: l } = o, { chartArea: h, scales: d } = l;
  let c = 0, u, f, p;
  const g = r - s, m = a - n;
  if (o.isHorizontal()) {
    if (f = re(i, n, a), N(t)) {
      const v = Object.keys(t)[0], x = t[v];
      p = d[v].getPixelForValue(x) + g - e;
    } else t === "center" ? p = (h.bottom + h.top) / 2 + g - e : p = ko(o, t, e);
    u = a - n;
  } else {
    if (N(t)) {
      const v = Object.keys(t)[0], x = t[v];
      f = d[v].getPixelForValue(x) - m + e;
    } else t === "center" ? f = (h.left + h.right) / 2 - m + e : f = ko(o, t, e);
    p = re(i, r, s), c = t === "left" ? -Re : Re;
  }
  return {
    titleX: f,
    titleY: p,
    maxWidth: u,
    rotation: c
  };
}
class Ft extends Ve {
  constructor(e) {
    super(), this.id = e.id, this.type = e.type, this.options = void 0, this.ctx = e.ctx, this.chart = e.chart, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this._margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, this.maxWidth = void 0, this.maxHeight = void 0, this.paddingTop = void 0, this.paddingBottom = void 0, this.paddingLeft = void 0, this.paddingRight = void 0, this.axis = void 0, this.labelRotation = void 0, this.min = void 0, this.max = void 0, this._range = void 0, this.ticks = [], this._gridLineItems = null, this._labelItems = null, this._labelSizes = null, this._length = 0, this._maxLength = 0, this._longestTextCache = {}, this._startPixel = void 0, this._endPixel = void 0, this._reversePixels = !1, this._userMax = void 0, this._userMin = void 0, this._suggestedMax = void 0, this._suggestedMin = void 0, this._ticksLength = 0, this._borderValue = 0, this._cache = {}, this._dataLimitsCached = !1, this.$context = void 0;
  }
  init(e) {
    this.options = e.setContext(this.getContext()), this.axis = e.axis, this._userMin = this.parse(e.min), this._userMax = this.parse(e.max), this._suggestedMin = this.parse(e.suggestedMin), this._suggestedMax = this.parse(e.suggestedMax);
  }
  parse(e, t) {
    return e;
  }
  getUserBounds() {
    let { _userMin: e, _userMax: t, _suggestedMin: i, _suggestedMax: s } = this;
    return e = Te(e, Number.POSITIVE_INFINITY), t = Te(t, Number.NEGATIVE_INFINITY), i = Te(i, Number.POSITIVE_INFINITY), s = Te(s, Number.NEGATIVE_INFINITY), {
      min: Te(e, i),
      max: Te(t, s),
      minDefined: Ce(e),
      maxDefined: Ce(t)
    };
  }
  getMinMax(e) {
    let { min: t, max: i, minDefined: s, maxDefined: n } = this.getUserBounds(), r;
    if (s && n)
      return {
        min: t,
        max: i
      };
    const a = this.getMatchingVisibleMetas();
    for (let l = 0, h = a.length; l < h; ++l)
      r = a[l].controller.getMinMax(this, e), s || (t = Math.min(t, r.min)), n || (i = Math.max(i, r.max));
    return t = n && t > i ? i : t, i = s && t > i ? t : i, {
      min: Te(t, Te(i, t)),
      max: Te(i, Te(t, i))
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
    const e = this.chart.data;
    return this.options.labels || (this.isHorizontal() ? e.xLabels : e.yLabels) || e.labels || [];
  }
  getLabelItems(e = this.chart.chartArea) {
    return this._labelItems || (this._labelItems = this._computeLabelItems(e));
  }
  beforeLayout() {
    this._cache = {}, this._dataLimitsCached = !1;
  }
  beforeUpdate() {
    q(this.options.beforeUpdate, [
      this
    ]);
  }
  update(e, t, i) {
    const { beginAtZero: s, grace: n, ticks: r } = this.options, a = r.sampleSize;
    this.beforeUpdate(), this.maxWidth = e, this.maxHeight = t, this._margins = i = Object.assign({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, i), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + i.left + i.right : this.height + i.top + i.bottom, this._dataLimitsCached || (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = Ec(this, n, s), this._dataLimitsCached = !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
    const l = a < this.ticks.length;
    this._convertTicksToLabels(l ? To(this.ticks, a) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), r.display && (r.autoSkip || r.source === "auto") && (this.ticks = Xu(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), l && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate();
  }
  configure() {
    let e = this.options.reverse, t, i;
    this.isHorizontal() ? (t = this.left, i = this.right) : (t = this.top, i = this.bottom, e = !e), this._startPixel = t, this._endPixel = i, this._reversePixels = e, this._length = i - t, this._alignToPixels = this.options.alignToPixels;
  }
  afterUpdate() {
    q(this.options.afterUpdate, [
      this
    ]);
  }
  beforeSetDimensions() {
    q(this.options.beforeSetDimensions, [
      this
    ]);
  }
  setDimensions() {
    this.isHorizontal() ? (this.width = this.maxWidth, this.left = 0, this.right = this.width) : (this.height = this.maxHeight, this.top = 0, this.bottom = this.height), this.paddingLeft = 0, this.paddingTop = 0, this.paddingRight = 0, this.paddingBottom = 0;
  }
  afterSetDimensions() {
    q(this.options.afterSetDimensions, [
      this
    ]);
  }
  _callHooks(e) {
    this.chart.notifyPlugins(e, this.getContext()), q(this.options[e], [
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
    q(this.options.beforeTickToLabelConversion, [
      this
    ]);
  }
  generateTickLabels(e) {
    const t = this.options.ticks;
    let i, s, n;
    for (i = 0, s = e.length; i < s; i++)
      n = e[i], n.label = q(t.callback, [
        n.value,
        i,
        e
      ], this);
  }
  afterTickToLabelConversion() {
    q(this.options.afterTickToLabelConversion, [
      this
    ]);
  }
  beforeCalculateLabelRotation() {
    q(this.options.beforeCalculateLabelRotation, [
      this
    ]);
  }
  calculateLabelRotation() {
    const e = this.options, t = e.ticks, i = Mo(this.ticks.length, e.ticks.maxTicksLimit), s = t.minRotation || 0, n = t.maxRotation;
    let r = s, a, l, h;
    if (!this._isVisible() || !t.display || s >= n || i <= 1 || !this.isHorizontal()) {
      this.labelRotation = s;
      return;
    }
    const d = this._getLabelSizes(), c = d.widest.width, u = d.highest.height, f = we(this.chart.width - c, 0, this.maxWidth);
    a = e.offset ? this.maxWidth / i : f / (i - 1), c + 6 > a && (a = f / (i - (e.offset ? 0.5 : 1)), l = this.maxHeight - Nt(e.grid) - t.padding - So(e.title, this.chart.options.font), h = Math.sqrt(c * c + u * u), r = Gd(Math.min(Math.asin(we((d.highest.height + 6) / a, -1, 1)), Math.asin(we(l / h, -1, 1)) - Math.asin(we(u / h, -1, 1)))), r = Math.max(s, Math.min(n, r))), this.labelRotation = r;
  }
  afterCalculateLabelRotation() {
    q(this.options.afterCalculateLabelRotation, [
      this
    ]);
  }
  afterAutoSkip() {
  }
  beforeFit() {
    q(this.options.beforeFit, [
      this
    ]);
  }
  fit() {
    const e = {
      width: 0,
      height: 0
    }, { chart: t, options: { ticks: i, title: s, grid: n } } = this, r = this._isVisible(), a = this.isHorizontal();
    if (r) {
      const l = So(s, t.options.font);
      if (a ? (e.width = this.maxWidth, e.height = Nt(n) + l) : (e.height = this.maxHeight, e.width = Nt(n) + l), i.display && this.ticks.length) {
        const { first: h, last: d, widest: c, highest: u } = this._getLabelSizes(), f = i.padding * 2, p = ft(this.labelRotation), g = Math.cos(p), m = Math.sin(p);
        if (a) {
          const v = i.mirror ? 0 : m * c.width + g * u.height;
          e.height = Math.min(this.maxHeight, e.height + v + f);
        } else {
          const v = i.mirror ? 0 : g * c.width + m * u.height;
          e.width = Math.min(this.maxWidth, e.width + v + f);
        }
        this._calculatePadding(h, d, m, g);
      }
    }
    this._handleMargins(), a ? (this.width = this._length = t.width - this._margins.left - this._margins.right, this.height = e.height) : (this.width = e.width, this.height = this._length = t.height - this._margins.top - this._margins.bottom);
  }
  _calculatePadding(e, t, i, s) {
    const { ticks: { align: n, padding: r }, position: a } = this.options, l = this.labelRotation !== 0, h = a !== "top" && this.axis === "x";
    if (this.isHorizontal()) {
      const d = this.getPixelForTick(0) - this.left, c = this.right - this.getPixelForTick(this.ticks.length - 1);
      let u = 0, f = 0;
      l ? h ? (u = s * e.width, f = i * t.height) : (u = i * e.height, f = s * t.width) : n === "start" ? f = t.width : n === "end" ? u = e.width : n !== "inner" && (u = e.width / 2, f = t.width / 2), this.paddingLeft = Math.max((u - d + r) * this.width / (this.width - d), 0), this.paddingRight = Math.max((f - c + r) * this.width / (this.width - c), 0);
    } else {
      let d = t.height / 2, c = e.height / 2;
      n === "start" ? (d = 0, c = e.height) : n === "end" && (d = t.height, c = 0), this.paddingTop = d + r, this.paddingBottom = c + r;
    }
  }
  _handleMargins() {
    this._margins && (this._margins.left = Math.max(this.paddingLeft, this._margins.left), this._margins.top = Math.max(this.paddingTop, this._margins.top), this._margins.right = Math.max(this.paddingRight, this._margins.right), this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom));
  }
  afterFit() {
    q(this.options.afterFit, [
      this
    ]);
  }
  isHorizontal() {
    const { axis: e, position: t } = this.options;
    return t === "top" || t === "bottom" || e === "x";
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(e) {
    this.beforeTickToLabelConversion(), this.generateTickLabels(e);
    let t, i;
    for (t = 0, i = e.length; t < i; t++)
      X(e[t].label) && (e.splice(t, 1), i--, t--);
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let e = this._labelSizes;
    if (!e) {
      const t = this.options.ticks.sampleSize;
      let i = this.ticks;
      t < i.length && (i = To(i, t)), this._labelSizes = e = this._computeLabelSizes(i, i.length, this.options.ticks.maxTicksLimit);
    }
    return e;
  }
  _computeLabelSizes(e, t, i) {
    const { ctx: s, _longestTextCache: n } = this, r = [], a = [], l = Math.floor(t / Mo(t, i));
    let h = 0, d = 0, c, u, f, p, g, m, v, x, E, k, y;
    for (c = 0; c < t; c += l) {
      if (p = e[c].label, g = this._resolveTickFontOptions(c), s.font = m = g.string, v = n[m] = n[m] || {
        data: {},
        gc: []
      }, x = g.lineHeight, E = k = 0, !X(p) && !se(p))
        E = no(s, v.data, v.gc, E, p), k = x;
      else if (se(p))
        for (u = 0, f = p.length; u < f; ++u)
          y = p[u], !X(y) && !se(y) && (E = no(s, v.data, v.gc, E, y), k += x);
      r.push(E), a.push(k), h = Math.max(E, h), d = Math.max(k, d);
    }
    tf(n, t);
    const S = r.indexOf(h), D = a.indexOf(d), T = (F) => ({
      width: r[F] || 0,
      height: a[F] || 0
    });
    return {
      first: T(0),
      last: T(t - 1),
      widest: T(S),
      highest: T(D),
      widths: r,
      heights: a
    };
  }
  getLabelForValue(e) {
    return e;
  }
  getPixelForValue(e, t) {
    return NaN;
  }
  getValueForPixel(e) {
  }
  getPixelForTick(e) {
    const t = this.ticks;
    return e < 0 || e > t.length - 1 ? null : this.getPixelForValue(t[e].value);
  }
  getPixelForDecimal(e) {
    this._reversePixels && (e = 1 - e);
    const t = this._startPixel + e * this._length;
    return Xd(this._alignToPixels ? rt(this.chart, t, 0) : t);
  }
  getDecimalForPixel(e) {
    const t = (e - this._startPixel) / this._length;
    return this._reversePixels ? 1 - t : t;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    const { min: e, max: t } = this;
    return e < 0 && t < 0 ? t : e > 0 && t > 0 ? e : 0;
  }
  getContext(e) {
    const t = this.ticks || [];
    if (e >= 0 && e < t.length) {
      const i = t[e];
      return i.$context || (i.$context = nf(this.getContext(), e, i));
    }
    return this.$context || (this.$context = sf(this.chart.getContext(), this));
  }
  _tickSize() {
    const e = this.options.ticks, t = ft(this.labelRotation), i = Math.abs(Math.cos(t)), s = Math.abs(Math.sin(t)), n = this._getLabelSizes(), r = e.autoSkipPadding || 0, a = n ? n.widest.width + r : 0, l = n ? n.highest.height + r : 0;
    return this.isHorizontal() ? l * i > a * s ? a / i : l / s : l * s < a * i ? l / i : a / s;
  }
  _isVisible() {
    const e = this.options.display;
    return e !== "auto" ? !!e : this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(e) {
    const t = this.axis, i = this.chart, s = this.options, { grid: n, position: r, border: a } = s, l = n.offset, h = this.isHorizontal(), c = this.ticks.length + (l ? 1 : 0), u = Nt(n), f = [], p = a.setContext(this.getContext()), g = p.display ? p.width : 0, m = g / 2, v = function(Z) {
      return rt(i, Z, g);
    };
    let x, E, k, y, S, D, T, F, H, P, z, Y;
    if (r === "top")
      x = v(this.bottom), D = this.bottom - u, F = x - m, P = v(e.top) + m, Y = e.bottom;
    else if (r === "bottom")
      x = v(this.top), P = e.top, Y = v(e.bottom) - m, D = x + m, F = this.top + u;
    else if (r === "left")
      x = v(this.right), S = this.right - u, T = x - m, H = v(e.left) + m, z = e.right;
    else if (r === "right")
      x = v(this.left), H = e.left, z = v(e.right) - m, S = x + m, T = this.left + u;
    else if (t === "x") {
      if (r === "center")
        x = v((e.top + e.bottom) / 2 + 0.5);
      else if (N(r)) {
        const Z = Object.keys(r)[0], he = r[Z];
        x = v(this.chart.scales[Z].getPixelForValue(he));
      }
      P = e.top, Y = e.bottom, D = x + m, F = D + u;
    } else if (t === "y") {
      if (r === "center")
        x = v((e.left + e.right) / 2);
      else if (N(r)) {
        const Z = Object.keys(r)[0], he = r[Z];
        x = v(this.chart.scales[Z].getPixelForValue(he));
      }
      S = x - m, T = S - u, H = e.left, z = e.right;
    }
    const ie = I(s.ticks.maxTicksLimit, c), K = Math.max(1, Math.ceil(c / ie));
    for (E = 0; E < c; E += K) {
      const Z = this.getContext(E), he = n.setContext(Z), et = a.setContext(Z), tt = he.lineWidth, ge = he.color, wt = et.dash || [], ke = et.dashOffset, xe = he.tickWidth, ze = he.tickColor, it = he.tickBorderDash || [], Fe = he.tickBorderDashOffset;
      k = ef(this, E, l), k !== void 0 && (y = rt(i, k, tt), h ? S = T = H = z = y : D = F = P = Y = y, f.push({
        tx1: S,
        ty1: D,
        tx2: T,
        ty2: F,
        x1: H,
        y1: P,
        x2: z,
        y2: Y,
        width: tt,
        color: ge,
        borderDash: wt,
        borderDashOffset: ke,
        tickWidth: xe,
        tickColor: ze,
        tickBorderDash: it,
        tickBorderDashOffset: Fe
      }));
    }
    return this._ticksLength = c, this._borderValue = x, f;
  }
  _computeLabelItems(e) {
    const t = this.axis, i = this.options, { position: s, ticks: n } = i, r = this.isHorizontal(), a = this.ticks, { align: l, crossAlign: h, padding: d, mirror: c } = n, u = Nt(i.grid), f = u + d, p = c ? -d : f, g = -ft(this.labelRotation), m = [];
    let v, x, E, k, y, S, D, T, F, H, P, z, Y = "middle";
    if (s === "top")
      S = this.bottom - p, D = this._getXAxisLabelAlignment();
    else if (s === "bottom")
      S = this.top + p, D = this._getXAxisLabelAlignment();
    else if (s === "left") {
      const K = this._getYAxisLabelAlignment(u);
      D = K.textAlign, y = K.x;
    } else if (s === "right") {
      const K = this._getYAxisLabelAlignment(u);
      D = K.textAlign, y = K.x;
    } else if (t === "x") {
      if (s === "center")
        S = (e.top + e.bottom) / 2 + f;
      else if (N(s)) {
        const K = Object.keys(s)[0], Z = s[K];
        S = this.chart.scales[K].getPixelForValue(Z) + f;
      }
      D = this._getXAxisLabelAlignment();
    } else if (t === "y") {
      if (s === "center")
        y = (e.left + e.right) / 2 - f;
      else if (N(s)) {
        const K = Object.keys(s)[0], Z = s[K];
        y = this.chart.scales[K].getPixelForValue(Z);
      }
      D = this._getYAxisLabelAlignment(u).textAlign;
    }
    t === "y" && (l === "start" ? Y = "top" : l === "end" && (Y = "bottom"));
    const ie = this._getLabelSizes();
    for (v = 0, x = a.length; v < x; ++v) {
      E = a[v], k = E.label;
      const K = n.setContext(this.getContext(v));
      T = this.getPixelForTick(v) + n.labelOffset, F = this._resolveTickFontOptions(v), H = F.lineHeight, P = se(k) ? k.length : 1;
      const Z = P / 2, he = K.color, et = K.textStrokeColor, tt = K.textStrokeWidth;
      let ge = D;
      r ? (y = T, D === "inner" && (v === x - 1 ? ge = this.options.reverse ? "left" : "right" : v === 0 ? ge = this.options.reverse ? "right" : "left" : ge = "center"), s === "top" ? h === "near" || g !== 0 ? z = -P * H + H / 2 : h === "center" ? z = -ie.highest.height / 2 - Z * H + H : z = -ie.highest.height + H / 2 : h === "near" || g !== 0 ? z = H / 2 : h === "center" ? z = ie.highest.height / 2 - Z * H : z = ie.highest.height - P * H, c && (z *= -1), g !== 0 && !K.showLabelBackdrop && (y += H / 2 * Math.sin(g))) : (S = T, z = (1 - P) * H / 2);
      let wt;
      if (K.showLabelBackdrop) {
        const ke = Ee(K.backdropPadding), xe = ie.heights[v], ze = ie.widths[v];
        let it = z - ke.top, Fe = 0 - ke.left;
        switch (Y) {
          case "middle":
            it -= xe / 2;
            break;
          case "bottom":
            it -= xe;
            break;
        }
        switch (D) {
          case "center":
            Fe -= ze / 2;
            break;
          case "right":
            Fe -= ze;
            break;
          case "inner":
            v === x - 1 ? Fe -= ze : v > 0 && (Fe -= ze / 2);
            break;
        }
        wt = {
          left: Fe,
          top: it,
          width: ze + ke.width,
          height: xe + ke.height,
          color: K.backdropColor
        };
      }
      m.push({
        label: k,
        font: F,
        textOffset: z,
        options: {
          rotation: g,
          color: he,
          strokeColor: et,
          strokeWidth: tt,
          textAlign: ge,
          textBaseline: Y,
          translation: [
            y,
            S
          ],
          backdrop: wt
        }
      });
    }
    return m;
  }
  _getXAxisLabelAlignment() {
    const { position: e, ticks: t } = this.options;
    if (-ft(this.labelRotation))
      return e === "top" ? "left" : "right";
    let s = "center";
    return t.align === "start" ? s = "left" : t.align === "end" ? s = "right" : t.align === "inner" && (s = "inner"), s;
  }
  _getYAxisLabelAlignment(e) {
    const { position: t, ticks: { crossAlign: i, mirror: s, padding: n } } = this.options, r = this._getLabelSizes(), a = e + n, l = r.widest.width;
    let h, d;
    return t === "left" ? s ? (d = this.right + n, i === "near" ? h = "left" : i === "center" ? (h = "center", d += l / 2) : (h = "right", d += l)) : (d = this.right - a, i === "near" ? h = "right" : i === "center" ? (h = "center", d -= l / 2) : (h = "left", d = this.left)) : t === "right" ? s ? (d = this.left + n, i === "near" ? h = "right" : i === "center" ? (h = "center", d -= l / 2) : (h = "left", d -= l)) : (d = this.left + a, i === "near" ? h = "left" : i === "center" ? (h = "center", d += l / 2) : (h = "right", d = this.right)) : h = "right", {
      textAlign: h,
      x: d
    };
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror)
      return;
    const e = this.chart, t = this.options.position;
    if (t === "left" || t === "right")
      return {
        top: 0,
        left: this.left,
        bottom: e.height,
        right: this.right
      };
    if (t === "top" || t === "bottom")
      return {
        top: this.top,
        left: 0,
        bottom: this.bottom,
        right: e.width
      };
  }
  drawBackground() {
    const { ctx: e, options: { backgroundColor: t }, left: i, top: s, width: n, height: r } = this;
    t && (e.save(), e.fillStyle = t, e.fillRect(i, s, n, r), e.restore());
  }
  getLineWidthForValue(e) {
    const t = this.options.grid;
    if (!this._isVisible() || !t.display)
      return 0;
    const s = this.ticks.findIndex((n) => n.value === e);
    return s >= 0 ? t.setContext(this.getContext(s)).lineWidth : 0;
  }
  drawGrid(e) {
    const t = this.options.grid, i = this.ctx, s = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(e));
    let n, r;
    const a = (l, h, d) => {
      !d.width || !d.color || (i.save(), i.lineWidth = d.width, i.strokeStyle = d.color, i.setLineDash(d.borderDash || []), i.lineDashOffset = d.borderDashOffset, i.beginPath(), i.moveTo(l.x, l.y), i.lineTo(h.x, h.y), i.stroke(), i.restore());
    };
    if (t.display)
      for (n = 0, r = s.length; n < r; ++n) {
        const l = s[n];
        t.drawOnChartArea && a({
          x: l.x1,
          y: l.y1
        }, {
          x: l.x2,
          y: l.y2
        }, l), t.drawTicks && a({
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
    const { chart: e, ctx: t, options: { border: i, grid: s } } = this, n = i.setContext(this.getContext()), r = i.display ? n.width : 0;
    if (!r)
      return;
    const a = s.setContext(this.getContext(0)).lineWidth, l = this._borderValue;
    let h, d, c, u;
    this.isHorizontal() ? (h = rt(e, this.left, r) - r / 2, d = rt(e, this.right, a) + a / 2, c = u = l) : (c = rt(e, this.top, r) - r / 2, u = rt(e, this.bottom, a) + a / 2, h = d = l), t.save(), t.lineWidth = n.width, t.strokeStyle = n.color, t.beginPath(), t.moveTo(h, c), t.lineTo(d, u), t.stroke(), t.restore();
  }
  drawLabels(e) {
    if (!this.options.ticks.display)
      return;
    const i = this.ctx, s = this._computeLabelArea();
    s && vn(i, s);
    const n = this.getLabelItems(e);
    for (const r of n) {
      const a = r.options, l = r.font, h = r.label, d = r.textOffset;
      di(i, h, 0, d, l, a);
    }
    s && wn(i);
  }
  drawTitle() {
    const { ctx: e, options: { position: t, title: i, reverse: s } } = this;
    if (!i.display)
      return;
    const n = le(i.font), r = Ee(i.padding), a = i.align;
    let l = n.lineHeight / 2;
    t === "bottom" || t === "center" || N(t) ? (l += r.bottom, se(i.text) && (l += n.lineHeight * (i.text.length - 1))) : l += r.top;
    const { titleX: h, titleY: d, maxWidth: c, rotation: u } = rf(this, l, t, a);
    di(e, i.text, 0, 0, n, {
      color: i.color,
      maxWidth: c,
      rotation: u,
      textAlign: of(a, t, s),
      textBaseline: "middle",
      translation: [
        h,
        d
      ]
    });
  }
  draw(e) {
    this._isVisible() && (this.drawBackground(), this.drawGrid(e), this.drawBorder(), this.drawTitle(), this.drawLabels(e));
  }
  _layers() {
    const e = this.options, t = e.ticks && e.ticks.z || 0, i = I(e.grid && e.grid.z, -1), s = I(e.border && e.border.z, 0);
    return !this._isVisible() || this.draw !== Ft.prototype.draw ? [
      {
        z: t,
        draw: (n) => {
          this.draw(n);
        }
      }
    ] : [
      {
        z: i,
        draw: (n) => {
          this.drawBackground(), this.drawGrid(n), this.drawTitle();
        }
      },
      {
        z: s,
        draw: () => {
          this.drawBorder();
        }
      },
      {
        z: t,
        draw: (n) => {
          this.drawLabels(n);
        }
      }
    ];
  }
  getMatchingVisibleMetas(e) {
    const t = this.chart.getSortedVisibleDatasetMetas(), i = this.axis + "AxisID", s = [];
    let n, r;
    for (n = 0, r = t.length; n < r; ++n) {
      const a = t[n];
      a[i] === this.id && (!e || a.type === e) && s.push(a);
    }
    return s;
  }
  _resolveTickFontOptions(e) {
    const t = this.options.ticks.setContext(this.getContext(e));
    return le(t.font);
  }
  _maxDigits() {
    const e = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / e;
  }
}
class Ti {
  constructor(e, t, i) {
    this.type = e, this.scope = t, this.override = i, this.items = /* @__PURE__ */ Object.create(null);
  }
  isForType(e) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, e.prototype);
  }
  register(e) {
    const t = Object.getPrototypeOf(e);
    let i;
    hf(t) && (i = this.register(t));
    const s = this.items, n = e.id, r = this.scope + "." + n;
    if (!n)
      throw new Error("class does not have id: " + e);
    return n in s || (s[n] = e, af(e, r, i), this.override && te.override(e.id, e.overrides)), r;
  }
  get(e) {
    return this.items[e];
  }
  unregister(e) {
    const t = this.items, i = e.id, s = this.scope;
    i in t && delete t[i], s && i in te[s] && (delete te[s][i], this.override && delete bt[i]);
  }
}
function af(o, e, t) {
  const i = ai(/* @__PURE__ */ Object.create(null), [
    t ? te.get(t) : {},
    te.get(e),
    o.defaults
  ]);
  te.set(e, i), o.defaultRoutes && lf(e, o.defaultRoutes), o.descriptors && te.describe(e, o.descriptors);
}
function lf(o, e) {
  Object.keys(e).forEach((t) => {
    const i = t.split("."), s = i.pop(), n = [
      o
    ].concat(i).join("."), r = e[t].split("."), a = r.pop(), l = r.join(".");
    te.route(n, s, l, a);
  });
}
function hf(o) {
  return "id" in o && "defaults" in o;
}
class df {
  constructor() {
    this.controllers = new Ti(ei, "datasets", !0), this.elements = new Ti(Ve, "elements"), this.plugins = new Ti(Object, "plugins"), this.scales = new Ti(Ft, "scales"), this._typedRegistries = [
      this.controllers,
      this.scales,
      this.elements
    ];
  }
  add(...e) {
    this._each("register", e);
  }
  remove(...e) {
    this._each("unregister", e);
  }
  addControllers(...e) {
    this._each("register", e, this.controllers);
  }
  addElements(...e) {
    this._each("register", e, this.elements);
  }
  addPlugins(...e) {
    this._each("register", e, this.plugins);
  }
  addScales(...e) {
    this._each("register", e, this.scales);
  }
  getController(e) {
    return this._get(e, this.controllers, "controller");
  }
  getElement(e) {
    return this._get(e, this.elements, "element");
  }
  getPlugin(e) {
    return this._get(e, this.plugins, "plugin");
  }
  getScale(e) {
    return this._get(e, this.scales, "scale");
  }
  removeControllers(...e) {
    this._each("unregister", e, this.controllers);
  }
  removeElements(...e) {
    this._each("unregister", e, this.elements);
  }
  removePlugins(...e) {
    this._each("unregister", e, this.plugins);
  }
  removeScales(...e) {
    this._each("unregister", e, this.scales);
  }
  _each(e, t, i) {
    [
      ...t
    ].forEach((s) => {
      const n = i || this._getRegistryForType(s);
      i || n.isForType(s) || n === this.plugins && s.id ? this._exec(e, n, s) : G(s, (r) => {
        const a = i || this._getRegistryForType(r);
        this._exec(e, a, r);
      });
    });
  }
  _exec(e, t, i) {
    const s = pn(e);
    q(i["before" + s], [], i), t[e](i), q(i["after" + s], [], i);
  }
  _getRegistryForType(e) {
    for (let t = 0; t < this._typedRegistries.length; t++) {
      const i = this._typedRegistries[t];
      if (i.isForType(e))
        return i;
    }
    return this.plugins;
  }
  _get(e, t, i) {
    const s = t.get(e);
    if (s === void 0)
      throw new Error('"' + e + '" is not a registered ' + i + ".");
    return s;
  }
}
var Le = /* @__PURE__ */ new df();
class cf {
  constructor() {
    this._init = [];
  }
  notify(e, t, i, s) {
    t === "beforeInit" && (this._init = this._createDescriptors(e, !0), this._notify(this._init, e, "install"));
    const n = s ? this._descriptors(e).filter(s) : this._descriptors(e), r = this._notify(n, e, t, i);
    return t === "afterDestroy" && (this._notify(n, e, "stop"), this._notify(this._init, e, "uninstall")), r;
  }
  _notify(e, t, i, s) {
    s = s || {};
    for (const n of e) {
      const r = n.plugin, a = r[i], l = [
        t,
        s,
        n.options
      ];
      if (q(a, l, r) === !1 && s.cancelable)
        return !1;
    }
    return !0;
  }
  invalidate() {
    X(this._cache) || (this._oldCache = this._cache, this._cache = void 0);
  }
  _descriptors(e) {
    if (this._cache)
      return this._cache;
    const t = this._cache = this._createDescriptors(e);
    return this._notifyStateChanges(e), t;
  }
  _createDescriptors(e, t) {
    const i = e && e.config, s = I(i.options && i.options.plugins, {}), n = uf(i);
    return s === !1 && !t ? [] : pf(e, n, s, t);
  }
  _notifyStateChanges(e) {
    const t = this._oldCache || [], i = this._cache, s = (n, r) => n.filter((a) => !r.some((l) => a.plugin.id === l.plugin.id));
    this._notify(s(t, i), e, "stop"), this._notify(s(i, t), e, "start");
  }
}
function uf(o) {
  const e = {}, t = [], i = Object.keys(Le.plugins.items);
  for (let n = 0; n < i.length; n++)
    t.push(Le.getPlugin(i[n]));
  const s = o.plugins || [];
  for (let n = 0; n < s.length; n++) {
    const r = s[n];
    t.indexOf(r) === -1 && (t.push(r), e[r.id] = !0);
  }
  return {
    plugins: t,
    localIds: e
  };
}
function ff(o, e) {
  return !e && o === !1 ? null : o === !0 ? {} : o;
}
function pf(o, { plugins: e, localIds: t }, i, s) {
  const n = [], r = o.getContext();
  for (const a of e) {
    const l = a.id, h = ff(i[l], s);
    h !== null && n.push({
      plugin: a,
      options: gf(o.config, {
        plugin: a,
        local: t[l]
      }, h, r)
    });
  }
  return n;
}
function gf(o, { plugin: e, local: t }, i, s) {
  const n = o.pluginScopeKeys(e), r = o.getOptionScopes(i, n);
  return t && e.defaults && r.push(e.defaults), o.createResolver(r, s, [
    ""
  ], {
    scriptable: !1,
    indexable: !1,
    allKeys: !0
  });
}
function sn(o, e) {
  const t = te.datasets[o] || {};
  return ((e.datasets || {})[o] || {}).indexAxis || e.indexAxis || t.indexAxis || "x";
}
function mf(o, e) {
  let t = o;
  return o === "_index_" ? t = e : o === "_value_" && (t = e === "x" ? "y" : "x"), t;
}
function bf(o, e) {
  return o === e ? "_index_" : "_value_";
}
function Lo(o) {
  if (o === "x" || o === "y" || o === "r")
    return o;
}
function vf(o) {
  if (o === "top" || o === "bottom")
    return "x";
  if (o === "left" || o === "right")
    return "y";
}
function nn(o, ...e) {
  if (Lo(o))
    return o;
  for (const t of e) {
    const i = t.axis || vf(t.position) || o.length > 1 && Lo(o[0].toLowerCase());
    if (i)
      return i;
  }
  throw new Error(`Cannot determine type of '${o}' axis. Please provide 'axis' or 'position' option.`);
}
function Do(o, e, t) {
  if (t[e + "AxisID"] === o)
    return {
      axis: e
    };
}
function wf(o, e) {
  if (e.data && e.data.datasets) {
    const t = e.data.datasets.filter((i) => i.xAxisID === o || i.yAxisID === o);
    if (t.length)
      return Do(o, "x", t[0]) || Do(o, "y", t[0]);
  }
  return {};
}
function yf(o, e) {
  const t = bt[o.type] || {
    scales: {}
  }, i = e.scales || {}, s = sn(o.type, e), n = /* @__PURE__ */ Object.create(null);
  return Object.keys(i).forEach((r) => {
    const a = i[r];
    if (!N(a))
      return console.error(`Invalid scale configuration for scale: ${r}`);
    if (a._proxy)
      return console.warn(`Ignoring resolver passed as options for scale: ${r}`);
    const l = nn(r, a, wf(r, o), te.scales[a.type]), h = bf(l, s), d = t.scales || {};
    n[r] = Kt(/* @__PURE__ */ Object.create(null), [
      {
        axis: l
      },
      a,
      d[l],
      d[h]
    ]);
  }), o.data.datasets.forEach((r) => {
    const a = r.type || o.type, l = r.indexAxis || sn(a, e), d = (bt[a] || {}).scales || {};
    Object.keys(d).forEach((c) => {
      const u = mf(c, l), f = r[u + "AxisID"] || u;
      n[f] = n[f] || /* @__PURE__ */ Object.create(null), Kt(n[f], [
        {
          axis: u
        },
        i[f],
        d[c]
      ]);
    });
  }), Object.keys(n).forEach((r) => {
    const a = n[r];
    Kt(a, [
      te.scales[a.type],
      te.scale
    ]);
  }), n;
}
function ea(o) {
  const e = o.options || (o.options = {});
  e.plugins = I(e.plugins, {}), e.scales = yf(o, e);
}
function ta(o) {
  return o = o || {}, o.datasets = o.datasets || [], o.labels = o.labels || [], o;
}
function Cf(o) {
  return o = o || {}, o.data = ta(o.data), ea(o), o;
}
const zo = /* @__PURE__ */ new Map(), ia = /* @__PURE__ */ new Set();
function Si(o, e) {
  let t = zo.get(o);
  return t || (t = e(), zo.set(o, t), ia.add(t)), t;
}
const Wt = (o, e, t) => {
  const i = Bi(e, t);
  i !== void 0 && o.add(i);
};
class Ef {
  constructor(e) {
    this._config = Cf(e), this._scopeCache = /* @__PURE__ */ new Map(), this._resolverCache = /* @__PURE__ */ new Map();
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(e) {
    this._config.type = e;
  }
  get data() {
    return this._config.data;
  }
  set data(e) {
    this._config.data = ta(e);
  }
  get options() {
    return this._config.options;
  }
  set options(e) {
    this._config.options = e;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    const e = this._config;
    this.clearCache(), ea(e);
  }
  clearCache() {
    this._scopeCache.clear(), this._resolverCache.clear();
  }
  datasetScopeKeys(e) {
    return Si(e, () => [
      [
        `datasets.${e}`,
        ""
      ]
    ]);
  }
  datasetAnimationScopeKeys(e, t) {
    return Si(`${e}.transition.${t}`, () => [
      [
        `datasets.${e}.transitions.${t}`,
        `transitions.${t}`
      ],
      [
        `datasets.${e}`,
        ""
      ]
    ]);
  }
  datasetElementScopeKeys(e, t) {
    return Si(`${e}-${t}`, () => [
      [
        `datasets.${e}.elements.${t}`,
        `datasets.${e}`,
        `elements.${t}`,
        ""
      ]
    ]);
  }
  pluginScopeKeys(e) {
    const t = e.id, i = this.type;
    return Si(`${i}-plugin-${t}`, () => [
      [
        `plugins.${t}`,
        ...e.additionalOptionScopes || []
      ]
    ]);
  }
  _cachedScopes(e, t) {
    const i = this._scopeCache;
    let s = i.get(e);
    return (!s || t) && (s = /* @__PURE__ */ new Map(), i.set(e, s)), s;
  }
  getOptionScopes(e, t, i) {
    const { options: s, type: n } = this, r = this._cachedScopes(e, i), a = r.get(t);
    if (a)
      return a;
    const l = /* @__PURE__ */ new Set();
    t.forEach((d) => {
      e && (l.add(e), d.forEach((c) => Wt(l, e, c))), d.forEach((c) => Wt(l, s, c)), d.forEach((c) => Wt(l, bt[n] || {}, c)), d.forEach((c) => Wt(l, te, c)), d.forEach((c) => Wt(l, Zs, c));
    });
    const h = Array.from(l);
    return h.length === 0 && h.push(/* @__PURE__ */ Object.create(null)), ia.has(t) && r.set(t, h), h;
  }
  chartOptionScopes() {
    const { options: e, type: t } = this;
    return [
      e,
      bt[t] || {},
      te.datasets[t] || {},
      {
        type: t
      },
      te,
      Zs
    ];
  }
  resolveNamedOptions(e, t, i, s = [
    ""
  ]) {
    const n = {
      $shared: !0
    }, { resolver: r, subPrefixes: a } = Fo(this._resolverCache, e, s);
    let l = r;
    if (_f(r, t)) {
      n.$shared = !1, i = Ze(i) ? i() : i;
      const h = this.createResolver(e, i, a);
      l = Dt(r, i, h);
    }
    for (const h of t)
      n[h] = l[h];
    return n;
  }
  createResolver(e, t, i = [
    ""
  ], s) {
    const { resolver: n } = Fo(this._resolverCache, e, i);
    return N(t) ? Dt(n, t, void 0, s) : n;
  }
}
function Fo(o, e, t) {
  let i = o.get(e);
  i || (i = /* @__PURE__ */ new Map(), o.set(e, i));
  const s = t.join();
  let n = i.get(s);
  return n || (n = {
    resolver: yn(e, t),
    subPrefixes: t.filter((a) => !a.toLowerCase().includes("hover"))
  }, i.set(s, n)), n;
}
const xf = (o) => N(o) && Object.getOwnPropertyNames(o).some((e) => Ze(o[e]));
function _f(o, e) {
  const { isScriptable: t, isIndexable: i } = Br(o);
  for (const s of e) {
    const n = t(s), r = i(s), a = (r || n) && o[s];
    if (n && (Ze(a) || xf(a)) || r && se(a))
      return !0;
  }
  return !1;
}
var Rf = "4.5.0";
const kf = [
  "top",
  "bottom",
  "left",
  "right",
  "chartArea"
];
function Oo(o, e) {
  return o === "top" || o === "bottom" || kf.indexOf(o) === -1 && e === "x";
}
function Po(o, e) {
  return function(t, i) {
    return t[o] === i[o] ? t[e] - i[e] : t[o] - i[o];
  };
}
function Ao(o) {
  const e = o.chart, t = e.options.animation;
  e.notifyPlugins("afterRender"), q(t && t.onComplete, [
    o
  ], e);
}
function Mf(o) {
  const e = o.chart, t = e.options.animation;
  q(t && t.onProgress, [
    o
  ], e);
}
function sa(o) {
  return xn() && typeof o == "string" ? o = document.getElementById(o) : o && o.length && (o = o[0]), o && o.canvas && (o = o.canvas), o;
}
const Pi = {}, Ho = (o) => {
  const e = sa(o);
  return Object.values(Pi).filter((t) => t.canvas === e).pop();
};
function Tf(o, e, t) {
  const i = Object.keys(o);
  for (const s of i) {
    const n = +s;
    if (n >= e) {
      const r = o[s];
      delete o[s], (t > 0 || n > e) && (o[n + t] = r);
    }
  }
}
function Sf(o, e, t, i) {
  return !t || o.type === "mouseout" ? null : i ? e : o;
}
var We;
let qi = (We = class {
  static register(...e) {
    Le.add(...e), Io();
  }
  static unregister(...e) {
    Le.remove(...e), Io();
  }
  constructor(e, t) {
    const i = this.config = new Ef(t), s = sa(e), n = Ho(s);
    if (n)
      throw new Error("Canvas is already in use. Chart with ID '" + n.id + "' must be destroyed before the canvas with ID '" + n.canvas.id + "' can be reused.");
    const r = i.createResolver(i.chartOptionScopes(), this.getContext());
    this.platform = new (i.platform || $u(s))(), this.platform.updateConfig(i);
    const a = this.platform.acquireContext(s, r.aspectRatio), l = a && a.canvas, h = l && l.height, d = l && l.width;
    if (this.id = Dd(), this.ctx = a, this.canvas = l, this.width = d, this.height = h, this._options = r, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new cf(), this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = Qd((c) => this.update(c), r.resizeDelay || 0), this._dataChanges = [], Pi[this.id] = this, !a || !l) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    Pe.listen(this, "complete", Ao), Pe.listen(this, "progress", Mf), this._initialize(), this.attached && this.update();
  }
  get aspectRatio() {
    const { options: { aspectRatio: e, maintainAspectRatio: t }, width: i, height: s, _aspectRatio: n } = this;
    return X(e) ? t && n ? n : s ? i / s : null : e;
  }
  get data() {
    return this.config.data;
  }
  set data(e) {
    this.config.data = e;
  }
  get options() {
    return this._options;
  }
  set options(e) {
    this.config.options = e;
  }
  get registry() {
    return Le;
  }
  _initialize() {
    return this.notifyPlugins("beforeInit"), this.options.responsive ? this.resize() : lo(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins("afterInit"), this;
  }
  clear() {
    return oo(this.canvas, this.ctx), this;
  }
  stop() {
    return Pe.stop(this), this;
  }
  resize(e, t) {
    Pe.running(this) ? this._resizeBeforeDraw = {
      width: e,
      height: t
    } : this._resize(e, t);
  }
  _resize(e, t) {
    const i = this.options, s = this.canvas, n = i.maintainAspectRatio && this.aspectRatio, r = this.platform.getMaximumSize(s, e, t, n), a = i.devicePixelRatio || this.platform.getDevicePixelRatio(), l = this.width ? "resize" : "attach";
    this.width = r.width, this.height = r.height, this._aspectRatio = this.aspectRatio, lo(this, a, !0) && (this.notifyPlugins("resize", {
      size: r
    }), q(i.onResize, [
      this,
      r
    ], this), this.attached && this._doResize(l) && this.render());
  }
  ensureScalesHaveIDs() {
    const t = this.options.scales || {};
    G(t, (i, s) => {
      i.id = s;
    });
  }
  buildOrUpdateScales() {
    const e = this.options, t = e.scales, i = this.scales, s = Object.keys(i).reduce((r, a) => (r[a] = !1, r), {});
    let n = [];
    t && (n = n.concat(Object.keys(t).map((r) => {
      const a = t[r], l = nn(r, a), h = l === "r", d = l === "x";
      return {
        options: a,
        dposition: h ? "chartArea" : d ? "bottom" : "left",
        dtype: h ? "radialLinear" : d ? "category" : "linear"
      };
    }))), G(n, (r) => {
      const a = r.options, l = a.id, h = nn(l, a), d = I(a.type, r.dtype);
      (a.position === void 0 || Oo(a.position, h) !== Oo(r.dposition)) && (a.position = r.dposition), s[l] = !0;
      let c = null;
      if (l in i && i[l].type === d)
        c = i[l];
      else {
        const u = Le.getScale(d);
        c = new u({
          id: l,
          type: d,
          ctx: this.ctx,
          chart: this
        }), i[c.id] = c;
      }
      c.init(a, e);
    }), G(s, (r, a) => {
      r || delete i[a];
    }), G(i, (r) => {
      ye.configure(this, r, r.options), ye.addBox(this, r);
    });
  }
  _updateMetasets() {
    const e = this._metasets, t = this.data.datasets.length, i = e.length;
    if (e.sort((s, n) => s.index - n.index), i > t) {
      for (let s = t; s < i; ++s)
        this._destroyDatasetMeta(s);
      e.splice(t, i - t);
    }
    this._sortedMetasets = e.slice(0).sort(Po("order", "index"));
  }
  _removeUnreferencedMetasets() {
    const { _metasets: e, data: { datasets: t } } = this;
    e.length > t.length && delete this._stacks, e.forEach((i, s) => {
      t.filter((n) => n === i._dataset).length === 0 && this._destroyDatasetMeta(s);
    });
  }
  buildOrUpdateControllers() {
    const e = [], t = this.data.datasets;
    let i, s;
    for (this._removeUnreferencedMetasets(), i = 0, s = t.length; i < s; i++) {
      const n = t[i];
      let r = this.getDatasetMeta(i);
      const a = n.type || this.config.type;
      if (r.type && r.type !== a && (this._destroyDatasetMeta(i), r = this.getDatasetMeta(i)), r.type = a, r.indexAxis = n.indexAxis || sn(a, this.options), r.order = n.order || 0, r.index = i, r.label = "" + n.label, r.visible = this.isDatasetVisible(i), r.controller)
        r.controller.updateIndex(i), r.controller.linkScales();
      else {
        const l = Le.getController(a), { datasetElementType: h, dataElementType: d } = te.datasets[a];
        Object.assign(l, {
          dataElementType: Le.getElement(d),
          datasetElementType: h && Le.getElement(h)
        }), r.controller = new l(this, i), e.push(r.controller);
      }
    }
    return this._updateMetasets(), e;
  }
  _resetElements() {
    G(this.data.datasets, (e, t) => {
      this.getDatasetMeta(t).controller.reset();
    }, this);
  }
  reset() {
    this._resetElements(), this.notifyPlugins("reset");
  }
  update(e) {
    const t = this.config;
    t.update();
    const i = this._options = t.createResolver(t.chartOptionScopes(), this.getContext()), s = this._animationsDisabled = !i.animation;
    if (this._updateScales(), this._checkEventBindings(), this._updateHiddenIndices(), this._plugins.invalidate(), this.notifyPlugins("beforeUpdate", {
      mode: e,
      cancelable: !0
    }) === !1)
      return;
    const n = this.buildOrUpdateControllers();
    this.notifyPlugins("beforeElementsUpdate");
    let r = 0;
    for (let h = 0, d = this.data.datasets.length; h < d; h++) {
      const { controller: c } = this.getDatasetMeta(h), u = !s && n.indexOf(c) === -1;
      c.buildOrUpdateElements(u), r = Math.max(+c.getMaxOverflow(), r);
    }
    r = this._minPadding = i.layout.autoPadding ? r : 0, this._updateLayout(r), s || G(n, (h) => {
      h.reset();
    }), this._updateDatasets(e), this.notifyPlugins("afterUpdate", {
      mode: e
    }), this._layers.sort(Po("z", "_idx"));
    const { _active: a, _lastEvent: l } = this;
    l ? this._eventHandler(l, !0) : a.length && this._updateHoverStyles(a, a, !0), this.render();
  }
  _updateScales() {
    G(this.scales, (e) => {
      ye.removeBox(this, e);
    }), this.ensureScalesHaveIDs(), this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const e = this.options, t = new Set(Object.keys(this._listeners)), i = new Set(e.events);
    (!Kn(t, i) || !!this._responsiveListeners !== e.responsive) && (this.unbindEvents(), this.bindEvents());
  }
  _updateHiddenIndices() {
    const { _hiddenIndices: e } = this, t = this._getUniformDataChanges() || [];
    for (const { method: i, start: s, count: n } of t) {
      const r = i === "_removeElements" ? -n : n;
      Tf(e, s, r);
    }
  }
  _getUniformDataChanges() {
    const e = this._dataChanges;
    if (!e || !e.length)
      return;
    this._dataChanges = [];
    const t = this.data.datasets.length, i = (n) => new Set(e.filter((r) => r[0] === n).map((r, a) => a + "," + r.splice(1).join(","))), s = i(0);
    for (let n = 1; n < t; n++)
      if (!Kn(s, i(n)))
        return;
    return Array.from(s).map((n) => n.split(",")).map((n) => ({
      method: n[1],
      start: +n[2],
      count: +n[3]
    }));
  }
  _updateLayout(e) {
    if (this.notifyPlugins("beforeLayout", {
      cancelable: !0
    }) === !1)
      return;
    ye.update(this, this.width, this.height, e);
    const t = this.chartArea, i = t.width <= 0 || t.height <= 0;
    this._layers = [], G(this.boxes, (s) => {
      i && s.position === "chartArea" || (s.configure && s.configure(), this._layers.push(...s._layers()));
    }, this), this._layers.forEach((s, n) => {
      s._idx = n;
    }), this.notifyPlugins("afterLayout");
  }
  _updateDatasets(e) {
    if (this.notifyPlugins("beforeDatasetsUpdate", {
      mode: e,
      cancelable: !0
    }) !== !1) {
      for (let t = 0, i = this.data.datasets.length; t < i; ++t)
        this.getDatasetMeta(t).controller.configure();
      for (let t = 0, i = this.data.datasets.length; t < i; ++t)
        this._updateDataset(t, Ze(e) ? e({
          datasetIndex: t
        }) : e);
      this.notifyPlugins("afterDatasetsUpdate", {
        mode: e
      });
    }
  }
  _updateDataset(e, t) {
    const i = this.getDatasetMeta(e), s = {
      meta: i,
      index: e,
      mode: t,
      cancelable: !0
    };
    this.notifyPlugins("beforeDatasetUpdate", s) !== !1 && (i.controller._update(t), s.cancelable = !1, this.notifyPlugins("afterDatasetUpdate", s));
  }
  render() {
    this.notifyPlugins("beforeRender", {
      cancelable: !0
    }) !== !1 && (Pe.has(this) ? this.attached && !Pe.running(this) && Pe.start(this) : (this.draw(), Ao({
      chart: this
    })));
  }
  draw() {
    let e;
    if (this._resizeBeforeDraw) {
      const { width: i, height: s } = this._resizeBeforeDraw;
      this._resizeBeforeDraw = null, this._resize(i, s);
    }
    if (this.clear(), this.width <= 0 || this.height <= 0 || this.notifyPlugins("beforeDraw", {
      cancelable: !0
    }) === !1)
      return;
    const t = this._layers;
    for (e = 0; e < t.length && t[e].z <= 0; ++e)
      t[e].draw(this.chartArea);
    for (this._drawDatasets(); e < t.length; ++e)
      t[e].draw(this.chartArea);
    this.notifyPlugins("afterDraw");
  }
  _getSortedDatasetMetas(e) {
    const t = this._sortedMetasets, i = [];
    let s, n;
    for (s = 0, n = t.length; s < n; ++s) {
      const r = t[s];
      (!e || r.visible) && i.push(r);
    }
    return i;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(!0);
  }
  _drawDatasets() {
    if (this.notifyPlugins("beforeDatasetsDraw", {
      cancelable: !0
    }) === !1)
      return;
    const e = this.getSortedVisibleDatasetMetas();
    for (let t = e.length - 1; t >= 0; --t)
      this._drawDataset(e[t]);
    this.notifyPlugins("afterDatasetsDraw");
  }
  _drawDataset(e) {
    const t = this.ctx, i = {
      meta: e,
      index: e.index,
      cancelable: !0
    }, s = ou(this, e);
    this.notifyPlugins("beforeDatasetDraw", i) !== !1 && (s && vn(t, s), e.controller.draw(), s && wn(t), i.cancelable = !1, this.notifyPlugins("afterDatasetDraw", i));
  }
  isPointInArea(e) {
    return hi(e, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(e, t, i, s) {
    const n = Ru.modes[t];
    return typeof n == "function" ? n(this, e, i, s) : [];
  }
  getDatasetMeta(e) {
    const t = this.data.datasets[e], i = this._metasets;
    let s = i.filter((n) => n && n._dataset === t).pop();
    return s || (s = {
      type: null,
      data: [],
      dataset: null,
      controller: null,
      hidden: null,
      xAxisID: null,
      yAxisID: null,
      order: t && t.order || 0,
      index: e,
      _dataset: t,
      _parsed: [],
      _sorted: !1
    }, i.push(s)), s;
  }
  getContext() {
    return this.$context || (this.$context = vt(null, {
      chart: this,
      type: "chart"
    }));
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(e) {
    const t = this.data.datasets[e];
    if (!t)
      return !1;
    const i = this.getDatasetMeta(e);
    return typeof i.hidden == "boolean" ? !i.hidden : !t.hidden;
  }
  setDatasetVisibility(e, t) {
    const i = this.getDatasetMeta(e);
    i.hidden = !t;
  }
  toggleDataVisibility(e) {
    this._hiddenIndices[e] = !this._hiddenIndices[e];
  }
  getDataVisibility(e) {
    return !this._hiddenIndices[e];
  }
  _updateVisibility(e, t, i) {
    const s = i ? "show" : "hide", n = this.getDatasetMeta(e), r = n.controller._resolveAnimations(void 0, s);
    Vi(t) ? (n.data[t].hidden = !i, this.update()) : (this.setDatasetVisibility(e, i), r.update(n, {
      visible: i
    }), this.update((a) => a.datasetIndex === e ? s : void 0));
  }
  hide(e, t) {
    this._updateVisibility(e, t, !1);
  }
  show(e, t) {
    this._updateVisibility(e, t, !0);
  }
  _destroyDatasetMeta(e) {
    const t = this._metasets[e];
    t && t.controller && t.controller._destroy(), delete this._metasets[e];
  }
  _stop() {
    let e, t;
    for (this.stop(), Pe.remove(this), e = 0, t = this.data.datasets.length; e < t; ++e)
      this._destroyDatasetMeta(e);
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    const { canvas: e, ctx: t } = this;
    this._stop(), this.config.clearCache(), e && (this.unbindEvents(), oo(e, t), this.platform.releaseContext(t), this.canvas = null, this.ctx = null), delete Pi[this.id], this.notifyPlugins("afterDestroy");
  }
  toBase64Image(...e) {
    return this.canvas.toDataURL(...e);
  }
  bindEvents() {
    this.bindUserEvents(), this.options.responsive ? this.bindResponsiveEvents() : this.attached = !0;
  }
  bindUserEvents() {
    const e = this._listeners, t = this.platform, i = (n, r) => {
      t.addEventListener(this, n, r), e[n] = r;
    }, s = (n, r, a) => {
      n.offsetX = r, n.offsetY = a, this._eventHandler(n);
    };
    G(this.options.events, (n) => i(n, s));
  }
  bindResponsiveEvents() {
    this._responsiveListeners || (this._responsiveListeners = {});
    const e = this._responsiveListeners, t = this.platform, i = (l, h) => {
      t.addEventListener(this, l, h), e[l] = h;
    }, s = (l, h) => {
      e[l] && (t.removeEventListener(this, l, h), delete e[l]);
    }, n = (l, h) => {
      this.canvas && this.resize(l, h);
    };
    let r;
    const a = () => {
      s("attach", a), this.attached = !0, this.resize(), i("resize", n), i("detach", r);
    };
    r = () => {
      this.attached = !1, s("resize", n), this._stop(), this._resize(0, 0), i("attach", a);
    }, t.isAttached(this.canvas) ? a() : r();
  }
  unbindEvents() {
    G(this._listeners, (e, t) => {
      this.platform.removeEventListener(this, t, e);
    }), this._listeners = {}, G(this._responsiveListeners, (e, t) => {
      this.platform.removeEventListener(this, t, e);
    }), this._responsiveListeners = void 0;
  }
  updateHoverStyle(e, t, i) {
    const s = i ? "set" : "remove";
    let n, r, a, l;
    for (t === "dataset" && (n = this.getDatasetMeta(e[0].datasetIndex), n.controller["_" + s + "DatasetHoverStyle"]()), a = 0, l = e.length; a < l; ++a) {
      r = e[a];
      const h = r && this.getDatasetMeta(r.datasetIndex).controller;
      h && h[s + "HoverStyle"](r.element, r.datasetIndex, r.index);
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(e) {
    const t = this._active || [], i = e.map(({ datasetIndex: n, index: r }) => {
      const a = this.getDatasetMeta(n);
      if (!a)
        throw new Error("No dataset found at index " + n);
      return {
        datasetIndex: n,
        element: a.data[r],
        index: r
      };
    });
    !Hi(i, t) && (this._active = i, this._lastEvent = null, this._updateHoverStyles(i, t));
  }
  notifyPlugins(e, t, i) {
    return this._plugins.notify(this, e, t, i);
  }
  isPluginEnabled(e) {
    return this._plugins._cache.filter((t) => t.plugin.id === e).length === 1;
  }
  _updateHoverStyles(e, t, i) {
    const s = this.options.hover, n = (l, h) => l.filter((d) => !h.some((c) => d.datasetIndex === c.datasetIndex && d.index === c.index)), r = n(t, e), a = i ? e : n(e, t);
    r.length && this.updateHoverStyle(r, s.mode, !1), a.length && s.mode && this.updateHoverStyle(a, s.mode, !0);
  }
  _eventHandler(e, t) {
    const i = {
      event: e,
      replay: t,
      cancelable: !0,
      inChartArea: this.isPointInArea(e)
    }, s = (r) => (r.options.events || this.options.events).includes(e.native.type);
    if (this.notifyPlugins("beforeEvent", i, s) === !1)
      return;
    const n = this._handleEvent(e, t, i.inChartArea);
    return i.cancelable = !1, this.notifyPlugins("afterEvent", i, s), (n || i.changed) && this.render(), this;
  }
  _handleEvent(e, t, i) {
    const { _active: s = [], options: n } = this, r = t, a = this._getActiveElements(e, s, i, r), l = Hd(e), h = Sf(e, this._lastEvent, i, l);
    i && (this._lastEvent = null, q(n.onHover, [
      e,
      a,
      this
    ], this), l && q(n.onClick, [
      e,
      a,
      this
    ], this));
    const d = !Hi(a, s);
    return (d || t) && (this._active = a, this._updateHoverStyles(a, s, t)), this._lastEvent = h, d;
  }
  _getActiveElements(e, t, i, s) {
    if (e.type === "mouseout")
      return [];
    if (!i)
      return t;
    const n = this.options.hover;
    return this.getElementsAtEventForMode(e, n.mode, n, s);
  }
}, C(We, "defaults", te), C(We, "instances", Pi), C(We, "overrides", bt), C(We, "registry", Le), C(We, "version", Rf), C(We, "getChart", Ho), We);
function Io() {
  return G(qi.instances, (o) => o._plugins.invalidate());
}
function na(o, e, t = e) {
  o.lineCap = I(t.borderCapStyle, e.borderCapStyle), o.setLineDash(I(t.borderDash, e.borderDash)), o.lineDashOffset = I(t.borderDashOffset, e.borderDashOffset), o.lineJoin = I(t.borderJoinStyle, e.borderJoinStyle), o.lineWidth = I(t.borderWidth, e.borderWidth), o.strokeStyle = I(t.borderColor, e.borderColor);
}
function Lf(o, e, t) {
  o.lineTo(t.x, t.y);
}
function Df(o) {
  return o.stepped ? uc : o.tension || o.cubicInterpolationMode === "monotone" ? fc : Lf;
}
function oa(o, e, t = {}) {
  const i = o.length, { start: s = 0, end: n = i - 1 } = t, { start: r, end: a } = e, l = Math.max(s, r), h = Math.min(n, a), d = s < r && n < r || s > a && n > a;
  return {
    count: i,
    start: l,
    loop: e.loop,
    ilen: h < l && !d ? i + h - l : h - l
  };
}
function zf(o, e, t, i) {
  const { points: s, options: n } = e, { count: r, start: a, loop: l, ilen: h } = oa(s, t, i), d = Df(n);
  let { move: c = !0, reverse: u } = i || {}, f, p, g;
  for (f = 0; f <= h; ++f)
    p = s[(a + (u ? h - f : f)) % r], !p.skip && (c ? (o.moveTo(p.x, p.y), c = !1) : d(o, g, p, u, n.stepped), g = p);
  return l && (p = s[(a + (u ? h : 0)) % r], d(o, g, p, u, n.stepped)), !!l;
}
function Ff(o, e, t, i) {
  const s = e.points, { count: n, start: r, ilen: a } = oa(s, t, i), { move: l = !0, reverse: h } = i || {};
  let d = 0, c = 0, u, f, p, g, m, v;
  const x = (k) => (r + (h ? a - k : k)) % n, E = () => {
    g !== m && (o.lineTo(d, m), o.lineTo(d, g), o.lineTo(d, v));
  };
  for (l && (f = s[x(0)], o.moveTo(f.x, f.y)), u = 0; u <= a; ++u) {
    if (f = s[x(u)], f.skip)
      continue;
    const k = f.x, y = f.y, S = k | 0;
    S === p ? (y < g ? g = y : y > m && (m = y), d = (c * d + k) / ++c) : (E(), o.lineTo(k, y), p = S, c = 0, g = m = y), v = y;
  }
  E();
}
function on(o) {
  const e = o.options, t = e.borderDash && e.borderDash.length;
  return !o._decimated && !o._loop && !e.tension && e.cubicInterpolationMode !== "monotone" && !e.stepped && !t ? Ff : zf;
}
function Of(o) {
  return o.stepped ? $c : o.tension || o.cubicInterpolationMode === "monotone" ? Xc : ht;
}
function Pf(o, e, t, i) {
  let s = e._path;
  s || (s = e._path = new Path2D(), e.path(s, t, i) && s.closePath()), na(o, e.options), o.stroke(s);
}
function Af(o, e, t, i) {
  const { segments: s, options: n } = e, r = on(e);
  for (const a of s)
    na(o, n, a.style), o.beginPath(), r(o, e, a, {
      start: t,
      end: t + i - 1
    }) && o.closePath(), o.stroke();
}
const Hf = typeof Path2D == "function";
function If(o, e, t, i) {
  Hf && !e.options.segment ? Pf(o, e, t, i) : Af(o, e, t, i);
}
class Xt extends Ve {
  constructor(e) {
    super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, e && Object.assign(this, e);
  }
  updateControlPoints(e, t) {
    const i = this.options;
    if ((i.tension || i.cubicInterpolationMode === "monotone") && !i.stepped && !this._pointsUpdated) {
      const s = i.spanGaps ? this._loop : this._fullLoop;
      Ic(this._points, i, e, s, t), this._pointsUpdated = !0;
    }
  }
  set points(e) {
    this._points = e, delete this._segments, delete this._path, this._pointsUpdated = !1;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = tu(this, this.options.segment));
  }
  first() {
    const e = this.segments, t = this.points;
    return e.length && t[e[0].start];
  }
  last() {
    const e = this.segments, t = this.points, i = e.length;
    return i && t[e[i - 1].end];
  }
  interpolate(e, t) {
    const i = this.options, s = e[t], n = this.points, r = Qc(this, {
      property: t,
      start: s,
      end: s
    });
    if (!r.length)
      return;
    const a = [], l = Of(i);
    let h, d;
    for (h = 0, d = r.length; h < d; ++h) {
      const { start: c, end: u } = r[h], f = n[c], p = n[u];
      if (f === p) {
        a.push(f);
        continue;
      }
      const g = Math.abs((s - f[t]) / (p[t] - f[t])), m = l(f, p, g, i.stepped);
      m[t] = e[t], a.push(m);
    }
    return a.length === 1 ? a[0] : a;
  }
  pathSegment(e, t, i) {
    return on(this)(e, this, t, i);
  }
  path(e, t, i) {
    const s = this.segments, n = on(this);
    let r = this._loop;
    t = t || 0, i = i || this.points.length - t;
    for (const a of s)
      r &= n(e, this, a, {
        start: t,
        end: t + i - 1
      });
    return !!r;
  }
  draw(e, t, i, s) {
    const n = this.options || {};
    (this.points || []).length && n.borderWidth && (e.save(), If(e, this, i, s), e.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0);
  }
}
C(Xt, "id", "line"), C(Xt, "defaults", {
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
}), C(Xt, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
}), C(Xt, "descriptors", {
  _scriptable: !0,
  _indexable: (e) => e !== "borderDash" && e !== "fill"
});
function Bo(o, e, t, i) {
  const s = o.options, { [t]: n } = o.getProps([
    t
  ], i);
  return Math.abs(e - n) < s.radius + s.hitRadius;
}
class Ai extends Ve {
  constructor(t) {
    super();
    C(this, "parsed");
    C(this, "skip");
    C(this, "stop");
    this.options = void 0, this.parsed = void 0, this.skip = void 0, this.stop = void 0, t && Object.assign(this, t);
  }
  inRange(t, i, s) {
    const n = this.options, { x: r, y: a } = this.getProps([
      "x",
      "y"
    ], s);
    return Math.pow(t - r, 2) + Math.pow(i - a, 2) < Math.pow(n.hitRadius + n.radius, 2);
  }
  inXRange(t, i) {
    return Bo(this, t, "x", i);
  }
  inYRange(t, i) {
    return Bo(this, t, "y", i);
  }
  getCenterPoint(t) {
    const { x: i, y: s } = this.getProps([
      "x",
      "y"
    ], t);
    return {
      x: i,
      y: s
    };
  }
  size(t) {
    t = t || this.options || {};
    let i = t.radius || 0;
    i = Math.max(i, i && t.hoverRadius || 0);
    const s = i && t.borderWidth || 0;
    return (i + s) * 2;
  }
  draw(t, i) {
    const s = this.options;
    this.skip || s.radius < 0.1 || !hi(this, i, this.size(s) / 2) || (t.strokeStyle = s.borderColor, t.lineWidth = s.borderWidth, t.fillStyle = s.backgroundColor, en(t, s, this.x, this.y));
  }
  getRange() {
    const t = this.options || {};
    return t.radius + t.hitRadius;
  }
}
C(Ai, "id", "point"), /**
* @type {any}
*/
C(Ai, "defaults", {
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
C(Ai, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
const Vo = (o, e) => {
  let { boxHeight: t = e, boxWidth: i = e } = o;
  return o.usePointStyle && (t = Math.min(t, e), i = o.pointStyleWidth || Math.min(i, e)), {
    boxWidth: i,
    boxHeight: t,
    itemHeight: Math.max(e, t)
  };
}, Bf = (o, e) => o !== null && e !== null && o.datasetIndex === e.datasetIndex && o.index === e.index;
class No extends Ve {
  constructor(e) {
    super(), this._added = !1, this.legendHitBoxes = [], this._hoveredItem = null, this.doughnutMode = !1, this.chart = e.chart, this.options = e.options, this.ctx = e.ctx, this.legendItems = void 0, this.columnSizes = void 0, this.lineWidths = void 0, this.maxHeight = void 0, this.maxWidth = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.height = void 0, this.width = void 0, this._margins = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0;
  }
  update(e, t, i) {
    this.maxWidth = e, this.maxHeight = t, this._margins = i, this.setDimensions(), this.buildLabels(), this.fit();
  }
  setDimensions() {
    this.isHorizontal() ? (this.width = this.maxWidth, this.left = this._margins.left, this.right = this.width) : (this.height = this.maxHeight, this.top = this._margins.top, this.bottom = this.height);
  }
  buildLabels() {
    const e = this.options.labels || {};
    let t = q(e.generateLabels, [
      this.chart
    ], this) || [];
    e.filter && (t = t.filter((i) => e.filter(i, this.chart.data))), e.sort && (t = t.sort((i, s) => e.sort(i, s, this.chart.data))), this.options.reverse && t.reverse(), this.legendItems = t;
  }
  fit() {
    const { options: e, ctx: t } = this;
    if (!e.display) {
      this.width = this.height = 0;
      return;
    }
    const i = e.labels, s = le(i.font), n = s.size, r = this._computeTitleHeight(), { boxWidth: a, itemHeight: l } = Vo(i, n);
    let h, d;
    t.font = s.string, this.isHorizontal() ? (h = this.maxWidth, d = this._fitRows(r, n, a, l) + 10) : (d = this.maxHeight, h = this._fitCols(r, s, a, l) + 10), this.width = Math.min(h, e.maxWidth || this.maxWidth), this.height = Math.min(d, e.maxHeight || this.maxHeight);
  }
  _fitRows(e, t, i, s) {
    const { ctx: n, maxWidth: r, options: { labels: { padding: a } } } = this, l = this.legendHitBoxes = [], h = this.lineWidths = [
      0
    ], d = s + a;
    let c = e;
    n.textAlign = "left", n.textBaseline = "middle";
    let u = -1, f = -d;
    return this.legendItems.forEach((p, g) => {
      const m = i + t / 2 + n.measureText(p.text).width;
      (g === 0 || h[h.length - 1] + m + 2 * a > r) && (c += d, h[h.length - (g > 0 ? 0 : 1)] = 0, f += d, u++), l[g] = {
        left: 0,
        top: f,
        row: u,
        width: m,
        height: s
      }, h[h.length - 1] += m + a;
    }), c;
  }
  _fitCols(e, t, i, s) {
    const { ctx: n, maxHeight: r, options: { labels: { padding: a } } } = this, l = this.legendHitBoxes = [], h = this.columnSizes = [], d = r - e;
    let c = a, u = 0, f = 0, p = 0, g = 0;
    return this.legendItems.forEach((m, v) => {
      const { itemWidth: x, itemHeight: E } = Vf(i, t, n, m, s);
      v > 0 && f + E + 2 * a > d && (c += u + a, h.push({
        width: u,
        height: f
      }), p += u + a, g++, u = f = 0), l[v] = {
        left: p,
        top: f,
        col: g,
        width: x,
        height: E
      }, u = Math.max(u, x), f += E + a;
    }), c += u, h.push({
      width: u,
      height: f
    }), c;
  }
  adjustHitBoxes() {
    if (!this.options.display)
      return;
    const e = this._computeTitleHeight(), { legendHitBoxes: t, options: { align: i, labels: { padding: s }, rtl: n } } = this, r = St(n, this.left, this.width);
    if (this.isHorizontal()) {
      let a = 0, l = re(i, this.left + s, this.right - this.lineWidths[a]);
      for (const h of t)
        a !== h.row && (a = h.row, l = re(i, this.left + s, this.right - this.lineWidths[a])), h.top += this.top + e + s, h.left = r.leftForLtr(r.x(l), h.width), l += h.width + s;
    } else {
      let a = 0, l = re(i, this.top + e + s, this.bottom - this.columnSizes[a].height);
      for (const h of t)
        h.col !== a && (a = h.col, l = re(i, this.top + e + s, this.bottom - this.columnSizes[a].height)), h.top = l, h.left += this.left + s, h.left = r.leftForLtr(r.x(h.left), h.width), l += h.height + s;
    }
  }
  isHorizontal() {
    return this.options.position === "top" || this.options.position === "bottom";
  }
  draw() {
    if (this.options.display) {
      const e = this.ctx;
      vn(e, this), this._draw(), wn(e);
    }
  }
  _draw() {
    const { options: e, columnSizes: t, lineWidths: i, ctx: s } = this, { align: n, labels: r } = e, a = te.color, l = St(e.rtl, this.left, this.width), h = le(r.font), { padding: d } = r, c = h.size, u = c / 2;
    let f;
    this.drawTitle(), s.textAlign = l.textAlign("left"), s.textBaseline = "middle", s.lineWidth = 0.5, s.font = h.string;
    const { boxWidth: p, boxHeight: g, itemHeight: m } = Vo(r, c), v = function(S, D, T) {
      if (isNaN(p) || p <= 0 || isNaN(g) || g < 0)
        return;
      s.save();
      const F = I(T.lineWidth, 1);
      if (s.fillStyle = I(T.fillStyle, a), s.lineCap = I(T.lineCap, "butt"), s.lineDashOffset = I(T.lineDashOffset, 0), s.lineJoin = I(T.lineJoin, "miter"), s.lineWidth = F, s.strokeStyle = I(T.strokeStyle, a), s.setLineDash(I(T.lineDash, [])), r.usePointStyle) {
        const H = {
          radius: g * Math.SQRT2 / 2,
          pointStyle: T.pointStyle,
          rotation: T.rotation,
          borderWidth: F
        }, P = l.xPlus(S, p / 2), z = D + u;
        Hr(s, H, P, z, r.pointStyleWidth && p);
      } else {
        const H = D + Math.max((c - g) / 2, 0), P = l.leftForLtr(S, p), z = Zt(T.borderRadius);
        s.beginPath(), Object.values(z).some((Y) => Y !== 0) ? tn(s, {
          x: P,
          y: H,
          w: p,
          h: g,
          radius: z
        }) : s.rect(P, H, p, g), s.fill(), F !== 0 && s.stroke();
      }
      s.restore();
    }, x = function(S, D, T) {
      di(s, T.text, S, D + m / 2, h, {
        strikethrough: T.hidden,
        textAlign: l.textAlign(T.textAlign)
      });
    }, E = this.isHorizontal(), k = this._computeTitleHeight();
    E ? f = {
      x: re(n, this.left + d, this.right - i[0]),
      y: this.top + d + k,
      line: 0
    } : f = {
      x: this.left + d,
      y: re(n, this.top + k + d, this.bottom - t[0].height),
      line: 0
    }, Gr(this.ctx, e.textDirection);
    const y = m + d;
    this.legendItems.forEach((S, D) => {
      s.strokeStyle = S.fontColor, s.fillStyle = S.fontColor;
      const T = s.measureText(S.text).width, F = l.textAlign(S.textAlign || (S.textAlign = r.textAlign)), H = p + u + T;
      let P = f.x, z = f.y;
      l.setWidth(this.width), E ? D > 0 && P + H + d > this.right && (z = f.y += y, f.line++, P = f.x = re(n, this.left + d, this.right - i[f.line])) : D > 0 && z + y > this.bottom && (P = f.x = P + t[f.line].width + d, f.line++, z = f.y = re(n, this.top + k + d, this.bottom - t[f.line].height));
      const Y = l.x(P);
      if (v(Y, z, S), P = Zd(F, P + p + u, E ? P + H : this.right, e.rtl), x(l.x(P), z, S), E)
        f.x += H + d;
      else if (typeof S.text != "string") {
        const ie = h.lineHeight;
        f.y += ra(S, ie) + d;
      } else
        f.y += y;
    }), Ur(this.ctx, e.textDirection);
  }
  drawTitle() {
    const e = this.options, t = e.title, i = le(t.font), s = Ee(t.padding);
    if (!t.display)
      return;
    const n = St(e.rtl, this.left, this.width), r = this.ctx, a = t.position, l = i.size / 2, h = s.top + l;
    let d, c = this.left, u = this.width;
    if (this.isHorizontal())
      u = Math.max(...this.lineWidths), d = this.top + h, c = re(e.align, c, this.right - u);
    else {
      const p = this.columnSizes.reduce((g, m) => Math.max(g, m.height), 0);
      d = h + re(e.align, this.top, this.bottom - p - e.labels.padding - this._computeTitleHeight());
    }
    const f = re(a, c, c + u);
    r.textAlign = n.textAlign(mn(a)), r.textBaseline = "middle", r.strokeStyle = t.color, r.fillStyle = t.color, r.font = i.string, di(r, t.text, f, d, i);
  }
  _computeTitleHeight() {
    const e = this.options.title, t = le(e.font), i = Ee(e.padding);
    return e.display ? t.lineHeight + i.height : 0;
  }
  _getLegendItemAt(e, t) {
    let i, s, n;
    if (Ut(e, this.left, this.right) && Ut(t, this.top, this.bottom)) {
      for (n = this.legendHitBoxes, i = 0; i < n.length; ++i)
        if (s = n[i], Ut(e, s.left, s.left + s.width) && Ut(t, s.top, s.top + s.height))
          return this.legendItems[i];
    }
    return null;
  }
  handleEvent(e) {
    const t = this.options;
    if (!jf(e.type, t))
      return;
    const i = this._getLegendItemAt(e.x, e.y);
    if (e.type === "mousemove" || e.type === "mouseout") {
      const s = this._hoveredItem, n = Bf(s, i);
      s && !n && q(t.onLeave, [
        e,
        s,
        this
      ], this), this._hoveredItem = i, i && !n && q(t.onHover, [
        e,
        i,
        this
      ], this);
    } else i && q(t.onClick, [
      e,
      i,
      this
    ], this);
  }
}
function Vf(o, e, t, i, s) {
  const n = Nf(i, o, e, t), r = Wf(s, i, e.lineHeight);
  return {
    itemWidth: n,
    itemHeight: r
  };
}
function Nf(o, e, t, i) {
  let s = o.text;
  return s && typeof s != "string" && (s = s.reduce((n, r) => n.length > r.length ? n : r)), e + t.size / 2 + i.measureText(s).width;
}
function Wf(o, e, t) {
  let i = o;
  return typeof e.text != "string" && (i = ra(e, t)), i;
}
function ra(o, e) {
  const t = o.text ? o.text.length : 0;
  return e * t;
}
function jf(o, e) {
  return !!((o === "mousemove" || o === "mouseout") && (e.onHover || e.onLeave) || e.onClick && (o === "click" || o === "mouseup"));
}
var Gf = {
  id: "legend",
  _element: No,
  start(o, e, t) {
    const i = o.legend = new No({
      ctx: o.ctx,
      options: t,
      chart: o
    });
    ye.configure(o, i, t), ye.addBox(o, i);
  },
  stop(o) {
    ye.removeBox(o, o.legend), delete o.legend;
  },
  beforeUpdate(o, e, t) {
    const i = o.legend;
    ye.configure(o, i, t), i.options = t;
  },
  afterUpdate(o) {
    const e = o.legend;
    e.buildLabels(), e.adjustHitBoxes();
  },
  afterEvent(o, e) {
    e.replay || o.legend.handleEvent(e.event);
  },
  defaults: {
    display: !0,
    position: "top",
    align: "center",
    fullSize: !0,
    reverse: !1,
    weight: 1e3,
    onClick(o, e, t) {
      const i = e.datasetIndex, s = t.chart;
      s.isDatasetVisible(i) ? (s.hide(i), e.hidden = !0) : (s.show(i), e.hidden = !1);
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: (o) => o.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(o) {
        const e = o.data.datasets, { labels: { usePointStyle: t, pointStyle: i, textAlign: s, color: n, useBorderRadius: r, borderRadius: a } } = o.legend.options;
        return o._getSortedDatasetMetas().map((l) => {
          const h = l.controller.getStyle(t ? 0 : void 0), d = Ee(h.borderWidth);
          return {
            text: e[l.index].label,
            fillStyle: h.backgroundColor,
            fontColor: n,
            hidden: !l.visible,
            lineCap: h.borderCapStyle,
            lineDash: h.borderDash,
            lineDashOffset: h.borderDashOffset,
            lineJoin: h.borderJoinStyle,
            lineWidth: (d.width + d.height) / 4,
            strokeStyle: h.borderColor,
            pointStyle: i || h.pointStyle,
            rotation: h.rotation,
            textAlign: s || h.textAlign,
            borderRadius: r && (a || h.borderRadius),
            datasetIndex: l.index
          };
        }, this);
      }
    },
    title: {
      color: (o) => o.chart.options.color,
      display: !1,
      position: "center",
      text: ""
    }
  },
  descriptors: {
    _scriptable: (o) => !o.startsWith("on"),
    labels: {
      _scriptable: (o) => ![
        "generateLabels",
        "filter",
        "sort"
      ].includes(o)
    }
  }
};
class aa extends Ve {
  constructor(e) {
    super(), this.chart = e.chart, this.options = e.options, this.ctx = e.ctx, this._padding = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0;
  }
  update(e, t) {
    const i = this.options;
    if (this.left = 0, this.top = 0, !i.display) {
      this.width = this.height = this.right = this.bottom = 0;
      return;
    }
    this.width = this.right = e, this.height = this.bottom = t;
    const s = se(i.text) ? i.text.length : 1;
    this._padding = Ee(i.padding);
    const n = s * le(i.font).lineHeight + this._padding.height;
    this.isHorizontal() ? this.height = n : this.width = n;
  }
  isHorizontal() {
    const e = this.options.position;
    return e === "top" || e === "bottom";
  }
  _drawArgs(e) {
    const { top: t, left: i, bottom: s, right: n, options: r } = this, a = r.align;
    let l = 0, h, d, c;
    return this.isHorizontal() ? (d = re(a, i, n), c = t + e, h = n - i) : (r.position === "left" ? (d = i + e, c = re(a, s, t), l = ne * -0.5) : (d = n - e, c = re(a, t, s), l = ne * 0.5), h = s - t), {
      titleX: d,
      titleY: c,
      maxWidth: h,
      rotation: l
    };
  }
  draw() {
    const e = this.ctx, t = this.options;
    if (!t.display)
      return;
    const i = le(t.font), n = i.lineHeight / 2 + this._padding.top, { titleX: r, titleY: a, maxWidth: l, rotation: h } = this._drawArgs(n);
    di(e, t.text, 0, 0, i, {
      color: t.color,
      maxWidth: l,
      rotation: h,
      textAlign: mn(t.align),
      textBaseline: "middle",
      translation: [
        r,
        a
      ]
    });
  }
}
function Uf(o, e) {
  const t = new aa({
    ctx: o.ctx,
    options: e,
    chart: o
  });
  ye.configure(o, t, e), ye.addBox(o, t), o.titleBlock = t;
}
var $f = {
  id: "title",
  _element: aa,
  start(o, e, t) {
    Uf(o, t);
  },
  stop(o) {
    const e = o.titleBlock;
    ye.removeBox(o, e), delete o.titleBlock;
  },
  beforeUpdate(o, e, t) {
    const i = o.titleBlock;
    ye.configure(o, i, t), i.options = t;
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
const Yt = {
  average(o) {
    if (!o.length)
      return !1;
    let e, t, i = /* @__PURE__ */ new Set(), s = 0, n = 0;
    for (e = 0, t = o.length; e < t; ++e) {
      const a = o[e].element;
      if (a && a.hasValue()) {
        const l = a.tooltipPosition();
        i.add(l.x), s += l.y, ++n;
      }
    }
    return n === 0 || i.size === 0 ? !1 : {
      x: [
        ...i
      ].reduce((a, l) => a + l) / i.size,
      y: s / n
    };
  },
  nearest(o, e) {
    if (!o.length)
      return !1;
    let t = e.x, i = e.y, s = Number.POSITIVE_INFINITY, n, r, a;
    for (n = 0, r = o.length; n < r; ++n) {
      const l = o[n].element;
      if (l && l.hasValue()) {
        const h = l.getCenterPoint(), d = Qs(e, h);
        d < s && (s = d, a = l);
      }
    }
    if (a) {
      const l = a.tooltipPosition();
      t = l.x, i = l.y;
    }
    return {
      x: t,
      y: i
    };
  }
};
function Se(o, e) {
  return e && (se(e) ? Array.prototype.push.apply(o, e) : o.push(e)), o;
}
function Ae(o) {
  return (typeof o == "string" || o instanceof String) && o.indexOf(`
`) > -1 ? o.split(`
`) : o;
}
function Xf(o, e) {
  const { element: t, datasetIndex: i, index: s } = e, n = o.getDatasetMeta(i).controller, { label: r, value: a } = n.getLabelAndValue(s);
  return {
    chart: o,
    label: r,
    parsed: n.getParsed(s),
    raw: o.data.datasets[i].data[s],
    formattedValue: a,
    dataset: n.getDataset(),
    dataIndex: s,
    datasetIndex: i,
    element: t
  };
}
function Wo(o, e) {
  const t = o.chart.ctx, { body: i, footer: s, title: n } = o, { boxWidth: r, boxHeight: a } = e, l = le(e.bodyFont), h = le(e.titleFont), d = le(e.footerFont), c = n.length, u = s.length, f = i.length, p = Ee(e.padding);
  let g = p.height, m = 0, v = i.reduce((k, y) => k + y.before.length + y.lines.length + y.after.length, 0);
  if (v += o.beforeBody.length + o.afterBody.length, c && (g += c * h.lineHeight + (c - 1) * e.titleSpacing + e.titleMarginBottom), v) {
    const k = e.displayColors ? Math.max(a, l.lineHeight) : l.lineHeight;
    g += f * k + (v - f) * l.lineHeight + (v - 1) * e.bodySpacing;
  }
  u && (g += e.footerMarginTop + u * d.lineHeight + (u - 1) * e.footerSpacing);
  let x = 0;
  const E = function(k) {
    m = Math.max(m, t.measureText(k).width + x);
  };
  return t.save(), t.font = h.string, G(o.title, E), t.font = l.string, G(o.beforeBody.concat(o.afterBody), E), x = e.displayColors ? r + 2 + e.boxPadding : 0, G(i, (k) => {
    G(k.before, E), G(k.lines, E), G(k.after, E);
  }), x = 0, t.font = d.string, G(o.footer, E), t.restore(), m += p.width, {
    width: m,
    height: g
  };
}
function Yf(o, e) {
  const { y: t, height: i } = e;
  return t < i / 2 ? "top" : t > o.height - i / 2 ? "bottom" : "center";
}
function Kf(o, e, t, i) {
  const { x: s, width: n } = i, r = t.caretSize + t.caretPadding;
  if (o === "left" && s + n + r > e.width || o === "right" && s - n - r < 0)
    return !0;
}
function qf(o, e, t, i) {
  const { x: s, width: n } = t, { width: r, chartArea: { left: a, right: l } } = o;
  let h = "center";
  return i === "center" ? h = s <= (a + l) / 2 ? "left" : "right" : s <= n / 2 ? h = "left" : s >= r - n / 2 && (h = "right"), Kf(h, o, e, t) && (h = "center"), h;
}
function jo(o, e, t) {
  const i = t.yAlign || e.yAlign || Yf(o, t);
  return {
    xAlign: t.xAlign || e.xAlign || qf(o, e, t, i),
    yAlign: i
  };
}
function Jf(o, e) {
  let { x: t, width: i } = o;
  return e === "right" ? t -= i : e === "center" && (t -= i / 2), t;
}
function Qf(o, e, t) {
  let { y: i, height: s } = o;
  return e === "top" ? i += t : e === "bottom" ? i -= s + t : i -= s / 2, i;
}
function Go(o, e, t, i) {
  const { caretSize: s, caretPadding: n, cornerRadius: r } = o, { xAlign: a, yAlign: l } = t, h = s + n, { topLeft: d, topRight: c, bottomLeft: u, bottomRight: f } = Zt(r);
  let p = Jf(e, a);
  const g = Qf(e, l, h);
  return l === "center" ? a === "left" ? p += h : a === "right" && (p -= h) : a === "left" ? p -= Math.max(d, u) + s : a === "right" && (p += Math.max(c, f) + s), {
    x: we(p, 0, i.width - e.width),
    y: we(g, 0, i.height - e.height)
  };
}
function Li(o, e, t) {
  const i = Ee(t.padding);
  return e === "center" ? o.x + o.width / 2 : e === "right" ? o.x + o.width - i.right : o.x + i.left;
}
function Uo(o) {
  return Se([], Ae(o));
}
function Zf(o, e, t) {
  return vt(o, {
    tooltip: e,
    tooltipItems: t,
    type: "tooltip"
  });
}
function $o(o, e) {
  const t = e && e.dataset && e.dataset.tooltip && e.dataset.tooltip.callbacks;
  return t ? o.override(t) : o;
}
const la = {
  beforeTitle: Oe,
  title(o) {
    if (o.length > 0) {
      const e = o[0], t = e.chart.data.labels, i = t ? t.length : 0;
      if (this && this.options && this.options.mode === "dataset")
        return e.dataset.label || "";
      if (e.label)
        return e.label;
      if (i > 0 && e.dataIndex < i)
        return t[e.dataIndex];
    }
    return "";
  },
  afterTitle: Oe,
  beforeBody: Oe,
  beforeLabel: Oe,
  label(o) {
    if (this && this.options && this.options.mode === "dataset")
      return o.label + ": " + o.formattedValue || o.formattedValue;
    let e = o.dataset.label || "";
    e && (e += ": ");
    const t = o.formattedValue;
    return X(t) || (e += t), e;
  },
  labelColor(o) {
    const t = o.chart.getDatasetMeta(o.datasetIndex).controller.getStyle(o.dataIndex);
    return {
      borderColor: t.borderColor,
      backgroundColor: t.backgroundColor,
      borderWidth: t.borderWidth,
      borderDash: t.borderDash,
      borderDashOffset: t.borderDashOffset,
      borderRadius: 0
    };
  },
  labelTextColor() {
    return this.options.bodyColor;
  },
  labelPointStyle(o) {
    const t = o.chart.getDatasetMeta(o.datasetIndex).controller.getStyle(o.dataIndex);
    return {
      pointStyle: t.pointStyle,
      rotation: t.rotation
    };
  },
  afterLabel: Oe,
  afterBody: Oe,
  beforeFooter: Oe,
  footer: Oe,
  afterFooter: Oe
};
function de(o, e, t, i) {
  const s = o[e].call(t, i);
  return typeof s > "u" ? la[e].call(t, i) : s;
}
class rn extends Ve {
  constructor(e) {
    super(), this.opacity = 0, this._active = [], this._eventPosition = void 0, this._size = void 0, this._cachedAnimations = void 0, this._tooltipItems = [], this.$animations = void 0, this.$context = void 0, this.chart = e.chart, this.options = e.options, this.dataPoints = void 0, this.title = void 0, this.beforeBody = void 0, this.body = void 0, this.afterBody = void 0, this.footer = void 0, this.xAlign = void 0, this.yAlign = void 0, this.x = void 0, this.y = void 0, this.height = void 0, this.width = void 0, this.caretX = void 0, this.caretY = void 0, this.labelColors = void 0, this.labelPointStyles = void 0, this.labelTextColors = void 0;
  }
  initialize(e) {
    this.options = e, this._cachedAnimations = void 0, this.$context = void 0;
  }
  _resolveAnimations() {
    const e = this._cachedAnimations;
    if (e)
      return e;
    const t = this.chart, i = this.options.setContext(this.getContext()), s = i.enabled && t.options.animation && i.animations, n = new Xr(this.chart, s);
    return s._cacheable && (this._cachedAnimations = Object.freeze(n)), n;
  }
  getContext() {
    return this.$context || (this.$context = Zf(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(e, t) {
    const { callbacks: i } = t, s = de(i, "beforeTitle", this, e), n = de(i, "title", this, e), r = de(i, "afterTitle", this, e);
    let a = [];
    return a = Se(a, Ae(s)), a = Se(a, Ae(n)), a = Se(a, Ae(r)), a;
  }
  getBeforeBody(e, t) {
    return Uo(de(t.callbacks, "beforeBody", this, e));
  }
  getBody(e, t) {
    const { callbacks: i } = t, s = [];
    return G(e, (n) => {
      const r = {
        before: [],
        lines: [],
        after: []
      }, a = $o(i, n);
      Se(r.before, Ae(de(a, "beforeLabel", this, n))), Se(r.lines, de(a, "label", this, n)), Se(r.after, Ae(de(a, "afterLabel", this, n))), s.push(r);
    }), s;
  }
  getAfterBody(e, t) {
    return Uo(de(t.callbacks, "afterBody", this, e));
  }
  getFooter(e, t) {
    const { callbacks: i } = t, s = de(i, "beforeFooter", this, e), n = de(i, "footer", this, e), r = de(i, "afterFooter", this, e);
    let a = [];
    return a = Se(a, Ae(s)), a = Se(a, Ae(n)), a = Se(a, Ae(r)), a;
  }
  _createItems(e) {
    const t = this._active, i = this.chart.data, s = [], n = [], r = [];
    let a = [], l, h;
    for (l = 0, h = t.length; l < h; ++l)
      a.push(Xf(this.chart, t[l]));
    return e.filter && (a = a.filter((d, c, u) => e.filter(d, c, u, i))), e.itemSort && (a = a.sort((d, c) => e.itemSort(d, c, i))), G(a, (d) => {
      const c = $o(e.callbacks, d);
      s.push(de(c, "labelColor", this, d)), n.push(de(c, "labelPointStyle", this, d)), r.push(de(c, "labelTextColor", this, d));
    }), this.labelColors = s, this.labelPointStyles = n, this.labelTextColors = r, this.dataPoints = a, a;
  }
  update(e, t) {
    const i = this.options.setContext(this.getContext()), s = this._active;
    let n, r = [];
    if (!s.length)
      this.opacity !== 0 && (n = {
        opacity: 0
      });
    else {
      const a = Yt[i.position].call(this, s, this._eventPosition);
      r = this._createItems(i), this.title = this.getTitle(r, i), this.beforeBody = this.getBeforeBody(r, i), this.body = this.getBody(r, i), this.afterBody = this.getAfterBody(r, i), this.footer = this.getFooter(r, i);
      const l = this._size = Wo(this, i), h = Object.assign({}, a, l), d = jo(this.chart, i, h), c = Go(i, h, d, this.chart);
      this.xAlign = d.xAlign, this.yAlign = d.yAlign, n = {
        opacity: 1,
        x: c.x,
        y: c.y,
        width: l.width,
        height: l.height,
        caretX: a.x,
        caretY: a.y
      };
    }
    this._tooltipItems = r, this.$context = void 0, n && this._resolveAnimations().update(this, n), e && i.external && i.external.call(this, {
      chart: this.chart,
      tooltip: this,
      replay: t
    });
  }
  drawCaret(e, t, i, s) {
    const n = this.getCaretPosition(e, i, s);
    t.lineTo(n.x1, n.y1), t.lineTo(n.x2, n.y2), t.lineTo(n.x3, n.y3);
  }
  getCaretPosition(e, t, i) {
    const { xAlign: s, yAlign: n } = this, { caretSize: r, cornerRadius: a } = i, { topLeft: l, topRight: h, bottomLeft: d, bottomRight: c } = Zt(a), { x: u, y: f } = e, { width: p, height: g } = t;
    let m, v, x, E, k, y;
    return n === "center" ? (k = f + g / 2, s === "left" ? (m = u, v = m - r, E = k + r, y = k - r) : (m = u + p, v = m + r, E = k - r, y = k + r), x = m) : (s === "left" ? v = u + Math.max(l, d) + r : s === "right" ? v = u + p - Math.max(h, c) - r : v = this.caretX, n === "top" ? (E = f, k = E - r, m = v - r, x = v + r) : (E = f + g, k = E + r, m = v + r, x = v - r), y = E), {
      x1: m,
      x2: v,
      x3: x,
      y1: E,
      y2: k,
      y3: y
    };
  }
  drawTitle(e, t, i) {
    const s = this.title, n = s.length;
    let r, a, l;
    if (n) {
      const h = St(i.rtl, this.x, this.width);
      for (e.x = Li(this, i.titleAlign, i), t.textAlign = h.textAlign(i.titleAlign), t.textBaseline = "middle", r = le(i.titleFont), a = i.titleSpacing, t.fillStyle = i.titleColor, t.font = r.string, l = 0; l < n; ++l)
        t.fillText(s[l], h.x(e.x), e.y + r.lineHeight / 2), e.y += r.lineHeight + a, l + 1 === n && (e.y += i.titleMarginBottom - a);
    }
  }
  _drawColorBox(e, t, i, s, n) {
    const r = this.labelColors[i], a = this.labelPointStyles[i], { boxHeight: l, boxWidth: h } = n, d = le(n.bodyFont), c = Li(this, "left", n), u = s.x(c), f = l < d.lineHeight ? (d.lineHeight - l) / 2 : 0, p = t.y + f;
    if (n.usePointStyle) {
      const g = {
        radius: Math.min(h, l) / 2,
        pointStyle: a.pointStyle,
        rotation: a.rotation,
        borderWidth: 1
      }, m = s.leftForLtr(u, h) + h / 2, v = p + l / 2;
      e.strokeStyle = n.multiKeyBackground, e.fillStyle = n.multiKeyBackground, en(e, g, m, v), e.strokeStyle = r.borderColor, e.fillStyle = r.backgroundColor, en(e, g, m, v);
    } else {
      e.lineWidth = N(r.borderWidth) ? Math.max(...Object.values(r.borderWidth)) : r.borderWidth || 1, e.strokeStyle = r.borderColor, e.setLineDash(r.borderDash || []), e.lineDashOffset = r.borderDashOffset || 0;
      const g = s.leftForLtr(u, h), m = s.leftForLtr(s.xPlus(u, 1), h - 2), v = Zt(r.borderRadius);
      Object.values(v).some((x) => x !== 0) ? (e.beginPath(), e.fillStyle = n.multiKeyBackground, tn(e, {
        x: g,
        y: p,
        w: h,
        h: l,
        radius: v
      }), e.fill(), e.stroke(), e.fillStyle = r.backgroundColor, e.beginPath(), tn(e, {
        x: m,
        y: p + 1,
        w: h - 2,
        h: l - 2,
        radius: v
      }), e.fill()) : (e.fillStyle = n.multiKeyBackground, e.fillRect(g, p, h, l), e.strokeRect(g, p, h, l), e.fillStyle = r.backgroundColor, e.fillRect(m, p + 1, h - 2, l - 2));
    }
    e.fillStyle = this.labelTextColors[i];
  }
  drawBody(e, t, i) {
    const { body: s } = this, { bodySpacing: n, bodyAlign: r, displayColors: a, boxHeight: l, boxWidth: h, boxPadding: d } = i, c = le(i.bodyFont);
    let u = c.lineHeight, f = 0;
    const p = St(i.rtl, this.x, this.width), g = function(T) {
      t.fillText(T, p.x(e.x + f), e.y + u / 2), e.y += u + n;
    }, m = p.textAlign(r);
    let v, x, E, k, y, S, D;
    for (t.textAlign = r, t.textBaseline = "middle", t.font = c.string, e.x = Li(this, m, i), t.fillStyle = i.bodyColor, G(this.beforeBody, g), f = a && m !== "right" ? r === "center" ? h / 2 + d : h + 2 + d : 0, k = 0, S = s.length; k < S; ++k) {
      for (v = s[k], x = this.labelTextColors[k], t.fillStyle = x, G(v.before, g), E = v.lines, a && E.length && (this._drawColorBox(t, e, k, p, i), u = Math.max(c.lineHeight, l)), y = 0, D = E.length; y < D; ++y)
        g(E[y]), u = c.lineHeight;
      G(v.after, g);
    }
    f = 0, u = c.lineHeight, G(this.afterBody, g), e.y -= n;
  }
  drawFooter(e, t, i) {
    const s = this.footer, n = s.length;
    let r, a;
    if (n) {
      const l = St(i.rtl, this.x, this.width);
      for (e.x = Li(this, i.footerAlign, i), e.y += i.footerMarginTop, t.textAlign = l.textAlign(i.footerAlign), t.textBaseline = "middle", r = le(i.footerFont), t.fillStyle = i.footerColor, t.font = r.string, a = 0; a < n; ++a)
        t.fillText(s[a], l.x(e.x), e.y + r.lineHeight / 2), e.y += r.lineHeight + i.footerSpacing;
    }
  }
  drawBackground(e, t, i, s) {
    const { xAlign: n, yAlign: r } = this, { x: a, y: l } = e, { width: h, height: d } = i, { topLeft: c, topRight: u, bottomLeft: f, bottomRight: p } = Zt(s.cornerRadius);
    t.fillStyle = s.backgroundColor, t.strokeStyle = s.borderColor, t.lineWidth = s.borderWidth, t.beginPath(), t.moveTo(a + c, l), r === "top" && this.drawCaret(e, t, i, s), t.lineTo(a + h - u, l), t.quadraticCurveTo(a + h, l, a + h, l + u), r === "center" && n === "right" && this.drawCaret(e, t, i, s), t.lineTo(a + h, l + d - p), t.quadraticCurveTo(a + h, l + d, a + h - p, l + d), r === "bottom" && this.drawCaret(e, t, i, s), t.lineTo(a + f, l + d), t.quadraticCurveTo(a, l + d, a, l + d - f), r === "center" && n === "left" && this.drawCaret(e, t, i, s), t.lineTo(a, l + c), t.quadraticCurveTo(a, l, a + c, l), t.closePath(), t.fill(), s.borderWidth > 0 && t.stroke();
  }
  _updateAnimationTarget(e) {
    const t = this.chart, i = this.$animations, s = i && i.x, n = i && i.y;
    if (s || n) {
      const r = Yt[e.position].call(this, this._active, this._eventPosition);
      if (!r)
        return;
      const a = this._size = Wo(this, e), l = Object.assign({}, r, this._size), h = jo(t, e, l), d = Go(e, l, h, t);
      (s._to !== d.x || n._to !== d.y) && (this.xAlign = h.xAlign, this.yAlign = h.yAlign, this.width = a.width, this.height = a.height, this.caretX = r.x, this.caretY = r.y, this._resolveAnimations().update(this, d));
    }
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(e) {
    const t = this.options.setContext(this.getContext());
    let i = this.opacity;
    if (!i)
      return;
    this._updateAnimationTarget(t);
    const s = {
      width: this.width,
      height: this.height
    }, n = {
      x: this.x,
      y: this.y
    };
    i = Math.abs(i) < 1e-3 ? 0 : i;
    const r = Ee(t.padding), a = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    t.enabled && a && (e.save(), e.globalAlpha = i, this.drawBackground(n, e, s, t), Gr(e, t.textDirection), n.y += r.top, this.drawTitle(n, e, t), this.drawBody(n, e, t), this.drawFooter(n, e, t), Ur(e, t.textDirection), e.restore());
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(e, t) {
    const i = this._active, s = e.map(({ datasetIndex: a, index: l }) => {
      const h = this.chart.getDatasetMeta(a);
      if (!h)
        throw new Error("Cannot find a dataset at index " + a);
      return {
        datasetIndex: a,
        element: h.data[l],
        index: l
      };
    }), n = !Hi(i, s), r = this._positionChanged(s, t);
    (n || r) && (this._active = s, this._eventPosition = t, this._ignoreReplayEvents = !0, this.update(!0));
  }
  handleEvent(e, t, i = !0) {
    if (t && this._ignoreReplayEvents)
      return !1;
    this._ignoreReplayEvents = !1;
    const s = this.options, n = this._active || [], r = this._getActiveElements(e, n, t, i), a = this._positionChanged(r, e), l = t || !Hi(r, n) || a;
    return l && (this._active = r, (s.enabled || s.external) && (this._eventPosition = {
      x: e.x,
      y: e.y
    }, this.update(!0, t))), l;
  }
  _getActiveElements(e, t, i, s) {
    const n = this.options;
    if (e.type === "mouseout")
      return [];
    if (!s)
      return t.filter((a) => this.chart.data.datasets[a.datasetIndex] && this.chart.getDatasetMeta(a.datasetIndex).controller.getParsed(a.index) !== void 0);
    const r = this.chart.getElementsAtEventForMode(e, n.mode, n, i);
    return n.reverse && r.reverse(), r;
  }
  _positionChanged(e, t) {
    const { caretX: i, caretY: s, options: n } = this, r = Yt[n.position].call(this, e, t);
    return r !== !1 && (i !== r.x || s !== r.y);
  }
}
C(rn, "positioners", Yt);
var ep = {
  id: "tooltip",
  _element: rn,
  positioners: Yt,
  afterInit(o, e, t) {
    t && (o.tooltip = new rn({
      chart: o,
      options: t
    }));
  },
  beforeUpdate(o, e, t) {
    o.tooltip && o.tooltip.initialize(t);
  },
  reset(o, e, t) {
    o.tooltip && o.tooltip.initialize(t);
  },
  afterDraw(o) {
    const e = o.tooltip;
    if (e && e._willRender()) {
      const t = {
        tooltip: e
      };
      if (o.notifyPlugins("beforeTooltipDraw", {
        ...t,
        cancelable: !0
      }) === !1)
        return;
      e.draw(o.ctx), o.notifyPlugins("afterTooltipDraw", t);
    }
  },
  afterEvent(o, e) {
    if (o.tooltip) {
      const t = e.replay;
      o.tooltip.handleEvent(e.event, t, e.inChartArea) && (e.changed = !0);
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
    boxHeight: (o, e) => e.bodyFont.size,
    boxWidth: (o, e) => e.bodyFont.size,
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
    callbacks: la
  },
  defaultRoutes: {
    bodyFont: "font",
    footerFont: "font",
    titleFont: "font"
  },
  descriptors: {
    _scriptable: (o) => o !== "filter" && o !== "itemSort" && o !== "external",
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
const tp = (o, e, t, i) => (typeof e == "string" ? (t = o.push(e) - 1, i.unshift({
  index: t,
  label: e
})) : isNaN(e) && (t = null), t);
function ip(o, e, t, i) {
  const s = o.indexOf(e);
  if (s === -1)
    return tp(o, e, t, i);
  const n = o.lastIndexOf(e);
  return s !== n ? t : s;
}
const sp = (o, e) => o === null ? null : we(Math.round(o), 0, e);
function Xo(o) {
  const e = this.getLabels();
  return o >= 0 && o < e.length ? e[o] : o;
}
class an extends Ft {
  constructor(e) {
    super(e), this._startValue = void 0, this._valueRange = 0, this._addedLabels = [];
  }
  init(e) {
    const t = this._addedLabels;
    if (t.length) {
      const i = this.getLabels();
      for (const { index: s, label: n } of t)
        i[s] === n && i.splice(s, 1);
      this._addedLabels = [];
    }
    super.init(e);
  }
  parse(e, t) {
    if (X(e))
      return null;
    const i = this.getLabels();
    return t = isFinite(t) && i[t] === e ? t : ip(i, e, I(t, e), this._addedLabels), sp(t, i.length - 1);
  }
  determineDataLimits() {
    const { minDefined: e, maxDefined: t } = this.getUserBounds();
    let { min: i, max: s } = this.getMinMax(!0);
    this.options.bounds === "ticks" && (e || (i = 0), t || (s = this.getLabels().length - 1)), this.min = i, this.max = s;
  }
  buildTicks() {
    const e = this.min, t = this.max, i = this.options.offset, s = [];
    let n = this.getLabels();
    n = e === 0 && t === n.length - 1 ? n : n.slice(e, t + 1), this._valueRange = Math.max(n.length - (i ? 0 : 1), 1), this._startValue = this.min - (i ? 0.5 : 0);
    for (let r = e; r <= t; r++)
      s.push({
        value: r
      });
    return s;
  }
  getLabelForValue(e) {
    return Xo.call(this, e);
  }
  configure() {
    super.configure(), this.isHorizontal() || (this._reversePixels = !this._reversePixels);
  }
  getPixelForValue(e) {
    return typeof e != "number" && (e = this.parse(e)), e === null ? NaN : this.getPixelForDecimal((e - this._startValue) / this._valueRange);
  }
  getPixelForTick(e) {
    const t = this.ticks;
    return e < 0 || e > t.length - 1 ? null : this.getPixelForValue(t[e].value);
  }
  getValueForPixel(e) {
    return Math.round(this._startValue + this.getDecimalForPixel(e) * this._valueRange);
  }
  getBasePixel() {
    return this.bottom;
  }
}
C(an, "id", "category"), C(an, "defaults", {
  ticks: {
    callback: Xo
  }
});
function np(o, e) {
  const t = [], { bounds: s, step: n, min: r, max: a, precision: l, count: h, maxTicks: d, maxDigits: c, includeBounds: u } = o, f = n || 1, p = d - 1, { min: g, max: m } = e, v = !X(r), x = !X(a), E = !X(h), k = (m - g) / (c + 1);
  let y = Jn((m - g) / p / f) * f, S, D, T, F;
  if (y < 1e-14 && !v && !x)
    return [
      {
        value: g
      },
      {
        value: m
      }
    ];
  F = Math.ceil(m / y) - Math.floor(g / y), F > p && (y = Jn(F * y / p / f) * f), X(l) || (S = Math.pow(10, l), y = Math.ceil(y * S) / S), s === "ticks" ? (D = Math.floor(g / y) * y, T = Math.ceil(m / y) * y) : (D = g, T = m), v && x && n && Wd((a - r) / n, y / 1e3) ? (F = Math.round(Math.min((a - r) / y, d)), y = (a - r) / F, D = r, T = a) : E ? (D = v ? r : D, T = x ? a : T, F = h - 1, y = (T - D) / F) : (F = (T - D) / y, qt(F, Math.round(F), y / 1e3) ? F = Math.round(F) : F = Math.ceil(F));
  const H = Math.max(Qn(y), Qn(D));
  S = Math.pow(10, X(l) ? H : l), D = Math.round(D * S) / S, T = Math.round(T * S) / S;
  let P = 0;
  for (v && (u && D !== r ? (t.push({
    value: r
  }), D < r && P++, qt(Math.round((D + P * y) * S) / S, r, Yo(r, k, o)) && P++) : D < r && P++); P < F; ++P) {
    const z = Math.round((D + P * y) * S) / S;
    if (x && z > a)
      break;
    t.push({
      value: z
    });
  }
  return x && u && T !== a ? t.length && qt(t[t.length - 1].value, a, Yo(a, k, o)) ? t[t.length - 1].value = a : t.push({
    value: a
  }) : (!x || T === a) && t.push({
    value: T
  }), t;
}
function Yo(o, e, { horizontal: t, minRotation: i }) {
  const s = ft(i), n = (t ? Math.sin(s) : Math.cos(s)) || 1e-3, r = 0.75 * e * ("" + o).length;
  return Math.min(e / n, r);
}
class op extends Ft {
  constructor(e) {
    super(e), this.start = void 0, this.end = void 0, this._startValue = void 0, this._endValue = void 0, this._valueRange = 0;
  }
  parse(e, t) {
    return X(e) || (typeof e == "number" || e instanceof Number) && !isFinite(+e) ? null : +e;
  }
  handleTickRangeOptions() {
    const { beginAtZero: e } = this.options, { minDefined: t, maxDefined: i } = this.getUserBounds();
    let { min: s, max: n } = this;
    const r = (l) => s = t ? s : l, a = (l) => n = i ? n : l;
    if (e) {
      const l = Lt(s), h = Lt(n);
      l < 0 && h < 0 ? a(0) : l > 0 && h > 0 && r(0);
    }
    if (s === n) {
      let l = n === 0 ? 1 : Math.abs(n * 0.05);
      a(n + l), e || r(s - l);
    }
    this.min = s, this.max = n;
  }
  getTickLimit() {
    const e = this.options.ticks;
    let { maxTicksLimit: t, stepSize: i } = e, s;
    return i ? (s = Math.ceil(this.max / i) - Math.floor(this.min / i) + 1, s > 1e3 && (console.warn(`scales.${this.id}.ticks.stepSize: ${i} would result generating up to ${s} ticks. Limiting to 1000.`), s = 1e3)) : (s = this.computeTickLimit(), t = t || 11), t && (s = Math.min(t, s)), s;
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    const e = this.options, t = e.ticks;
    let i = this.getTickLimit();
    i = Math.max(2, i);
    const s = {
      maxTicks: i,
      bounds: e.bounds,
      min: e.min,
      max: e.max,
      precision: t.precision,
      step: t.stepSize,
      count: t.count,
      maxDigits: this._maxDigits(),
      horizontal: this.isHorizontal(),
      minRotation: t.minRotation || 0,
      includeBounds: t.includeBounds !== !1
    }, n = this._range || this, r = np(s, n);
    return e.bounds === "ticks" && jd(r, this, "value"), e.reverse ? (r.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), r;
  }
  configure() {
    const e = this.ticks;
    let t = this.min, i = this.max;
    if (super.configure(), this.options.offset && e.length) {
      const s = (i - t) / Math.max(e.length - 1, 1) / 2;
      t -= s, i += s;
    }
    this._startValue = t, this._endValue = i, this._valueRange = i - t;
  }
  getLabelForValue(e) {
    return Pr(e, this.chart.options.locale, this.options.ticks.format);
  }
}
class ln extends op {
  determineDataLimits() {
    const { min: e, max: t } = this.getMinMax(!0);
    this.min = Ce(e) ? e : 0, this.max = Ce(t) ? t : 1, this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const e = this.isHorizontal(), t = e ? this.width : this.height, i = ft(this.options.ticks.minRotation), s = (e ? Math.sin(i) : Math.cos(i)) || 1e-3, n = this._resolveTickFontOptions(0);
    return Math.ceil(t / Math.min(40, n.lineHeight / s));
  }
  getPixelForValue(e) {
    return e === null ? NaN : this.getPixelForDecimal((e - this._startValue) / this._valueRange);
  }
  getValueForPixel(e) {
    return this._startValue + this.getDecimalForPixel(e) * this._valueRange;
  }
}
C(ln, "id", "linear"), C(ln, "defaults", {
  ticks: {
    callback: Ar.formatters.numeric
  }
});
const Ji = {
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
}, ue = /* @__PURE__ */ Object.keys(Ji);
function Ko(o, e) {
  return o - e;
}
function qo(o, e) {
  if (X(e))
    return null;
  const t = o._adapter, { parser: i, round: s, isoWeekday: n } = o._parseOpts;
  let r = e;
  return typeof i == "function" && (r = i(r)), Ce(r) || (r = typeof i == "string" ? t.parse(r, i) : t.parse(r)), r === null ? null : (s && (r = s === "week" && (li(n) || n === !0) ? t.startOf(r, "isoWeek", n) : t.startOf(r, s)), +r);
}
function Jo(o, e, t, i) {
  const s = ue.length;
  for (let n = ue.indexOf(o); n < s - 1; ++n) {
    const r = Ji[ue[n]], a = r.steps ? r.steps : Number.MAX_SAFE_INTEGER;
    if (r.common && Math.ceil((t - e) / (a * r.size)) <= i)
      return ue[n];
  }
  return ue[s - 1];
}
function rp(o, e, t, i, s) {
  for (let n = ue.length - 1; n >= ue.indexOf(t); n--) {
    const r = ue[n];
    if (Ji[r].common && o._adapter.diff(s, i, r) >= e - 1)
      return r;
  }
  return ue[t ? ue.indexOf(t) : 0];
}
function ap(o) {
  for (let e = ue.indexOf(o) + 1, t = ue.length; e < t; ++e)
    if (Ji[ue[e]].common)
      return ue[e];
}
function Qo(o, e, t) {
  if (!t)
    o[e] = !0;
  else if (t.length) {
    const { lo: i, hi: s } = gn(t, e), n = t[i] >= e ? t[i] : t[s];
    o[n] = !0;
  }
}
function lp(o, e, t, i) {
  const s = o._adapter, n = +s.startOf(e[0].value, i), r = e[e.length - 1].value;
  let a, l;
  for (a = n; a <= r; a = +s.add(a, 1, i))
    l = t[a], l >= 0 && (e[l].major = !0);
  return e;
}
function Zo(o, e, t) {
  const i = [], s = {}, n = e.length;
  let r, a;
  for (r = 0; r < n; ++r)
    a = e[r], s[a] = r, i.push({
      value: a,
      major: !1
    });
  return n === 0 || !t ? i : lp(o, i, s, t);
}
class Gi extends Ft {
  constructor(e) {
    super(e), this._cache = {
      data: [],
      labels: [],
      all: []
    }, this._unit = "day", this._majorUnit = void 0, this._offsets = {}, this._normalized = !1, this._parseOpts = void 0;
  }
  init(e, t = {}) {
    const i = e.time || (e.time = {}), s = this._adapter = new yu._date(e.adapters.date);
    s.init(t), Kt(i.displayFormats, s.formats()), this._parseOpts = {
      parser: i.parser,
      round: i.round,
      isoWeekday: i.isoWeekday
    }, super.init(e), this._normalized = t.normalized;
  }
  parse(e, t) {
    return e === void 0 ? null : qo(this, e);
  }
  beforeLayout() {
    super.beforeLayout(), this._cache = {
      data: [],
      labels: [],
      all: []
    };
  }
  determineDataLimits() {
    const e = this.options, t = this._adapter, i = e.time.unit || "day";
    let { min: s, max: n, minDefined: r, maxDefined: a } = this.getUserBounds();
    function l(h) {
      !r && !isNaN(h.min) && (s = Math.min(s, h.min)), !a && !isNaN(h.max) && (n = Math.max(n, h.max));
    }
    (!r || !a) && (l(this._getLabelBounds()), (e.bounds !== "ticks" || e.ticks.source !== "labels") && l(this.getMinMax(!1))), s = Ce(s) && !isNaN(s) ? s : +t.startOf(Date.now(), i), n = Ce(n) && !isNaN(n) ? n : +t.endOf(Date.now(), i) + 1, this.min = Math.min(s, n - 1), this.max = Math.max(s + 1, n);
  }
  _getLabelBounds() {
    const e = this.getLabelTimestamps();
    let t = Number.POSITIVE_INFINITY, i = Number.NEGATIVE_INFINITY;
    return e.length && (t = e[0], i = e[e.length - 1]), {
      min: t,
      max: i
    };
  }
  buildTicks() {
    const e = this.options, t = e.time, i = e.ticks, s = i.source === "labels" ? this.getLabelTimestamps() : this._generate();
    e.bounds === "ticks" && s.length && (this.min = this._userMin || s[0], this.max = this._userMax || s[s.length - 1]);
    const n = this.min, r = this.max, a = Kd(s, n, r);
    return this._unit = t.unit || (i.autoSkip ? Jo(t.minUnit, this.min, this.max, this._getLabelCapacity(n)) : rp(this, a.length, t.minUnit, this.min, this.max)), this._majorUnit = !i.major.enabled || this._unit === "year" ? void 0 : ap(this._unit), this.initOffsets(s), e.reverse && a.reverse(), Zo(this, a, this._majorUnit);
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((e) => +e.value));
  }
  initOffsets(e = []) {
    let t = 0, i = 0, s, n;
    this.options.offset && e.length && (s = this.getDecimalForValue(e[0]), e.length === 1 ? t = 1 - s : t = (this.getDecimalForValue(e[1]) - s) / 2, n = this.getDecimalForValue(e[e.length - 1]), e.length === 1 ? i = n : i = (n - this.getDecimalForValue(e[e.length - 2])) / 2);
    const r = e.length < 3 ? 0.5 : 0.25;
    t = we(t, 0, r), i = we(i, 0, r), this._offsets = {
      start: t,
      end: i,
      factor: 1 / (t + 1 + i)
    };
  }
  _generate() {
    const e = this._adapter, t = this.min, i = this.max, s = this.options, n = s.time, r = n.unit || Jo(n.minUnit, t, i, this._getLabelCapacity(t)), a = I(s.ticks.stepSize, 1), l = r === "week" ? n.isoWeekday : !1, h = li(l) || l === !0, d = {};
    let c = t, u, f;
    if (h && (c = +e.startOf(c, "isoWeek", l)), c = +e.startOf(c, h ? "day" : r), e.diff(i, t, r) > 1e5 * a)
      throw new Error(t + " and " + i + " are too far apart with stepSize of " + a + " " + r);
    const p = s.ticks.source === "data" && this.getDataTimestamps();
    for (u = c, f = 0; u < i; u = +e.add(u, a, r), f++)
      Qo(d, u, p);
    return (u === i || s.bounds === "ticks" || f === 1) && Qo(d, u, p), Object.keys(d).sort(Ko).map((g) => +g);
  }
  getLabelForValue(e) {
    const t = this._adapter, i = this.options.time;
    return i.tooltipFormat ? t.format(e, i.tooltipFormat) : t.format(e, i.displayFormats.datetime);
  }
  format(e, t) {
    const s = this.options.time.displayFormats, n = this._unit, r = t || s[n];
    return this._adapter.format(e, r);
  }
  _tickFormatFunction(e, t, i, s) {
    const n = this.options, r = n.ticks.callback;
    if (r)
      return q(r, [
        e,
        t,
        i
      ], this);
    const a = n.time.displayFormats, l = this._unit, h = this._majorUnit, d = l && a[l], c = h && a[h], u = i[t], f = h && c && u && u.major;
    return this._adapter.format(e, s || (f ? c : d));
  }
  generateTickLabels(e) {
    let t, i, s;
    for (t = 0, i = e.length; t < i; ++t)
      s = e[t], s.label = this._tickFormatFunction(s.value, t, e);
  }
  getDecimalForValue(e) {
    return e === null ? NaN : (e - this.min) / (this.max - this.min);
  }
  getPixelForValue(e) {
    const t = this._offsets, i = this.getDecimalForValue(e);
    return this.getPixelForDecimal((t.start + i) * t.factor);
  }
  getValueForPixel(e) {
    const t = this._offsets, i = this.getDecimalForPixel(e) / t.factor - t.end;
    return this.min + i * (this.max - this.min);
  }
  _getLabelSize(e) {
    const t = this.options.ticks, i = this.ctx.measureText(e).width, s = ft(this.isHorizontal() ? t.maxRotation : t.minRotation), n = Math.cos(s), r = Math.sin(s), a = this._resolveTickFontOptions(0).size;
    return {
      w: i * n + a * r,
      h: i * r + a * n
    };
  }
  _getLabelCapacity(e) {
    const t = this.options.time, i = t.displayFormats, s = i[t.unit] || i.millisecond, n = this._tickFormatFunction(e, 0, Zo(this, [
      e
    ], this._majorUnit), s), r = this._getLabelSize(n), a = Math.floor(this.isHorizontal() ? this.width / r.w : this.height / r.h) - 1;
    return a > 0 ? a : 1;
  }
  getDataTimestamps() {
    let e = this._cache.data || [], t, i;
    if (e.length)
      return e;
    const s = this.getMatchingVisibleMetas();
    if (this._normalized && s.length)
      return this._cache.data = s[0].controller.getAllParsedValues(this);
    for (t = 0, i = s.length; t < i; ++t)
      e = e.concat(s[t].controller.getAllParsedValues(this));
    return this._cache.data = this.normalize(e);
  }
  getLabelTimestamps() {
    const e = this._cache.labels || [];
    let t, i;
    if (e.length)
      return e;
    const s = this.getLabels();
    for (t = 0, i = s.length; t < i; ++t)
      e.push(qo(this, s[t]));
    return this._cache.labels = this._normalized ? e : this.normalize(e);
  }
  normalize(e) {
    return Jd(e.sort(Ko));
  }
}
C(Gi, "id", "time"), C(Gi, "defaults", {
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
function Di(o, e, t) {
  let i = 0, s = o.length - 1, n, r, a, l;
  t ? (e >= o[i].pos && e <= o[s].pos && ({ lo: i, hi: s } = pt(o, "pos", e)), { pos: n, time: a } = o[i], { pos: r, time: l } = o[s]) : (e >= o[i].time && e <= o[s].time && ({ lo: i, hi: s } = pt(o, "time", e)), { time: n, pos: a } = o[i], { time: r, pos: l } = o[s]);
  const h = r - n;
  return h ? a + (l - a) * (e - n) / h : a;
}
class er extends Gi {
  constructor(e) {
    super(e), this._table = [], this._minPos = void 0, this._tableRange = void 0;
  }
  initOffsets() {
    const e = this._getTimestampsForTable(), t = this._table = this.buildLookupTable(e);
    this._minPos = Di(t, this.min), this._tableRange = Di(t, this.max) - this._minPos, super.initOffsets(e);
  }
  buildLookupTable(e) {
    const { min: t, max: i } = this, s = [], n = [];
    let r, a, l, h, d;
    for (r = 0, a = e.length; r < a; ++r)
      h = e[r], h >= t && h <= i && s.push(h);
    if (s.length < 2)
      return [
        {
          time: t,
          pos: 0
        },
        {
          time: i,
          pos: 1
        }
      ];
    for (r = 0, a = s.length; r < a; ++r)
      d = s[r + 1], l = s[r - 1], h = s[r], Math.round((d + l) / 2) !== h && n.push({
        time: h,
        pos: r / (a - 1)
      });
    return n;
  }
  _generate() {
    const e = this.min, t = this.max;
    let i = super.getDataTimestamps();
    return (!i.includes(e) || !i.length) && i.splice(0, 0, e), (!i.includes(t) || i.length === 1) && i.push(t), i.sort((s, n) => s - n);
  }
  _getTimestampsForTable() {
    let e = this._cache.all || [];
    if (e.length)
      return e;
    const t = this.getDataTimestamps(), i = this.getLabelTimestamps();
    return t.length && i.length ? e = this.normalize(t.concat(i)) : e = t.length ? t : i, e = this._cache.all = e, e;
  }
  getDecimalForValue(e) {
    return (Di(this._table, e) - this._minPos) / this._tableRange;
  }
  getValueForPixel(e) {
    const t = this._offsets, i = this.getDecimalForPixel(e) / t.factor - t.end;
    return Di(this._table, i * this._tableRange + this._minPos, !0);
  }
}
C(er, "id", "timeseries"), C(er, "defaults", Gi.defaults);
const ha = {
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
}, hp = {
  ariaLabel: {
    type: String
  },
  ariaDescribedby: {
    type: String
  }
}, dp = {
  type: {
    type: String,
    required: !0
  },
  destroyDelay: {
    type: Number,
    default: 0
    // No delay by default
  },
  ...ha,
  ...hp
}, cp = _a[0] === "2" ? (o, e) => Object.assign(o, {
  attrs: e
}) : (o, e) => Object.assign(o, e);
function xt(o) {
  return sr(o) ? Es(o) : o;
}
function up(o) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : o;
  return sr(e) ? new Proxy(o, {}) : o;
}
function fp(o, e) {
  const t = o.options;
  t && e && Object.assign(t, e);
}
function da(o, e) {
  o.labels = e;
}
function ca(o, e, t) {
  const i = [];
  o.datasets = e.map((s) => {
    const n = o.datasets.find((r) => r[t] === s[t]);
    return !n || !s.data || i.includes(n) ? {
      ...s
    } : (i.push(n), Object.assign(n, s), n);
  });
}
function pp(o, e) {
  const t = {
    labels: [],
    datasets: []
  };
  return da(t, o.labels), ca(t, o.datasets, e), t;
}
const gp = hn({
  props: dp,
  setup(o, e) {
    let { expose: t, slots: i } = e;
    const s = fe(null), n = ir(null);
    t({
      chart: n
    });
    const r = () => {
      if (!s.value) return;
      const { type: h, data: d, options: c, plugins: u, datasetIdKey: f } = o, p = pp(d, f), g = up(p, d);
      n.value = new qi(s.value, {
        type: h,
        data: g,
        options: {
          ...c
        },
        plugins: u
      });
    }, a = () => {
      const h = Es(n.value);
      h && (o.destroyDelay > 0 ? setTimeout(() => {
        h.destroy(), n.value = null;
      }, o.destroyDelay) : (h.destroy(), n.value = null));
    }, l = (h) => {
      h.update(o.updateMode);
    };
    return Cs(r), xa(a), jt([
      () => o.options,
      () => o.data
    ], (h, d) => {
      let [c, u] = h, [f, p] = d;
      const g = Es(n.value);
      if (!g)
        return;
      let m = !1;
      if (c) {
        const v = xt(c), x = xt(f);
        v && v !== x && (fp(g, v), m = !0);
      }
      if (u) {
        const v = xt(u.labels), x = xt(p.labels), E = xt(u.datasets), k = xt(p.datasets);
        v !== x && (da(g.config.data, v), m = !0), E && E !== k && (ca(g.config.data, E, o.datasetIdKey), m = !0);
      }
      m && je(() => {
        l(g);
      });
    }, {
      deep: !0
    }), () => ys("canvas", {
      role: "img",
      ariaLabel: o.ariaLabel,
      ariaDescribedby: o.ariaDescribedby,
      ref: s
    }, [
      ys("p", {}, [
        i.default ? i.default() : ""
      ])
    ]);
  }
});
function mp(o, e) {
  return qi.register(e), hn({
    props: ha,
    setup(t, i) {
      let { expose: s } = i;
      const n = ir(null), r = (a) => {
        n.value = a == null ? void 0 : a.chart;
      };
      return s({
        chart: n
      }), () => ys(gp, cp({
        ref: r
      }, {
        type: o,
        ...t
      }));
    }
  });
}
const bp = /* @__PURE__ */ mp("line", Fi), vp = { class: "notification-container" }, wp = { class: "notification-content" }, yp = { class: "notification-icon" }, Cp = { class: "notification-message" }, Ep = ["onClick"], xp = { class: "dashboard-container" }, _p = {
  key: 0,
  class: "loading"
}, Rp = {
  key: 1,
  class: "error"
}, kp = { key: 2 }, Mp = { class: "metric-block" }, Tp = { class: "block-header" }, Sp = { key: 1 }, Lp = { class: "header-tools" }, Dp = { class: "columns-content" }, zp = ["value"], Fp = { class: "column-label" }, Op = { class: "columns-footer" }, Pp = {
  key: 0,
  class: "summary-filters-bar"
}, Ap = { class: "filters-tags" }, Hp = ["onClick"], Ip = {
  key: 1,
  class: "graph-section"
}, Bp = {
  key: 0,
  class: "graph-loading"
}, Vp = {
  key: 1,
  class: "graph-error"
}, Np = {
  key: 2,
  class: "chart-section"
}, Wp = { class: "chart-container" }, jp = {
  key: 3,
  class: "graph-empty"
}, Gp = { class: "breakdown-header" }, Up = { class: "breakdown-header-left" }, $p = { class: "breakdown-header-right" }, Xp = { class: "docker-control-section" }, Yp = ["disabled", "onClick"], Kp = { key: 0 }, qp = { key: 1 }, Jp = ["disabled", "onClick"], Qp = { key: 0 }, Zp = { key: 1 }, eg = { class: "breakdown-columns" }, tg = { class: "breakdown-stage stage-1" }, ig = { class: "stage-item" }, sg = { class: "item-value" }, ng = { class: "formula" }, og = { class: "stage-item" }, rg = { class: "item-value" }, ag = { class: "formula" }, lg = { class: "stage-item" }, hg = { class: "item-value" }, dg = { class: "formula" }, cg = { class: "stage-item" }, ug = { class: "item-value" }, fg = { class: "formula" }, pg = { class: "breakdown-stage stage-2" }, gg = { class: "stage-item" }, mg = { class: "item-value" }, bg = { class: "formula" }, vg = { class: "stage-item" }, wg = { class: "item-value" }, yg = { class: "formula" }, Cg = { class: "stage-item" }, Eg = { class: "item-value" }, xg = { class: "formula" }, _g = { class: "stage-item" }, Rg = { class: "item-value" }, kg = { class: "formula" }, Mg = ["onClick"], Tg = { class: "context-menu-icon" }, Sg = {
  key: 0,
  class: "active-indicator"
}, Lg = {
  key: 0,
  class: "context-menu-separator"
}, Dg = { class: "context-menu-info" }, zg = { class: "context-menu-value" }, bs = "https://ibkr-docker-manage.aiworkspace.pro/docker_control.php", Fg = /* @__PURE__ */ hn({
  __name: "Summary",
  props: {
    showHeaderLink: { type: Boolean, default: !1 },
    userId: { default: null }
  },
  emits: ["minimize"],
  setup(o, { emit: e }) {
    qi.register(
      an,
      ln,
      Ai,
      Xt,
      $f,
      ep,
      Gf
    );
    const t = o, i = e, s = fe(null);
    let n = null;
    const r = ld(10, t.userId);
    ns({});
    const a = fe(null), l = fe(null), h = ns({}), d = fe(null), c = ns({
      bansi: { isLoading: !1, isStarting: !1, isStopping: !1 },
      cis: { isLoading: !1, isStarting: !1, isStopping: !1 },
      hediye: { isLoading: !1, isStarting: !1, isStopping: !1 },
      ovlg: { isLoading: !1, isStarting: !1, isStopping: !1 },
      sc: { isLoading: !1, isStarting: !1, isStopping: !1 },
      stamp: { isLoading: !1, isStarting: !1, isStopping: !1 },
      vk: { isLoading: !1, isStarting: !1, isStopping: !1 }
    }), u = fe([]);
    let f = 0;
    function p() {
      return new URLSearchParams(window.location.search).get("all_cts_clientId");
    }
    function g(w) {
      if (!w) return null;
      const b = w.match(/Client\s*(\d+)/i);
      return b ? parseInt(b[1]) : null;
    }
    Cs(() => {
      d.value = p(), window.addEventListener("popstate", () => {
        d.value = p();
      });
    });
    const m = Oa(), v = xs({
      queryKey: be(() => ["nlvHistory", a.value]),
      queryFn: async () => {
        if (!a.value) return [];
        console.log("🔍 Querying NLV history for account:", a.value);
        const { data: w, error: b } = await m.schema("hf").from("netliquidation").select("internal_account_id, fetched_at, nlv").eq("internal_account_id", a.value).gte("fetched_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString()).order("fetched_at", { ascending: !0 });
        if (b)
          throw console.error("❌ NLV history query error:", b), b;
        return console.log("✅ NLV history query success:", w == null ? void 0 : w.length, "records"), w || [];
      },
      staleTime: 6e4,
      enabled: be(() => !!a.value && l.value === "nlv")
    }), x = xs({
      queryKey: be(() => ["maintenanceHistory", a.value]),
      queryFn: async () => {
        if (!a.value) return [];
        console.log("🔍 Querying Maintenance Margin history for account:", a.value);
        const { data: w, error: b } = await m.schema("hf").from("maintenance_margin").select("internal_account_id, fetched_at, maintenance").eq("internal_account_id", a.value).gte("fetched_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString()).order("fetched_at", { ascending: !0 });
        if (b)
          throw console.error("❌ Maintenance Margin history query error:", b), b;
        return console.log("✅ Maintenance Margin history query success:", w == null ? void 0 : w.length, "records"), w || [];
      },
      staleTime: 6e4,
      enabled: be(() => !!a.value && l.value === "mm")
    });
    function E(w) {
      if (w == null) return "$0";
      const b = typeof w == "string" ? parseFloat(w) : w;
      return isNaN(b) ? "$0" : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(b);
    }
    function k(w, b, R) {
      const L = 1 - R, O = 1 - b, W = 1 - L * O;
      return w / W;
    }
    const y = be(() => r.data.value ? r.data.value.map((w) => {
      const b = k(w.nlv_val, 0.3, 0.15), R = k(w.nlv_val, 0.3, 0.1), L = b * 30 / 100, O = R * 30 / 100, _ = typeof w.maintenance_val == "string" ? parseFloat(w.maintenance_val) : w.maintenance_val, W = L - _, Me = O - _, mi = W * 100 / 30, bi = Me * 100 / 30;
      return {
        ...w,
        maintenance_val_numeric: _,
        // Add numeric version for calculations
        maxGmvNlvSide: b,
        maxGmvMaintenanceSide: R,
        mkNlvSide: L,
        mkMaintenanceSide: O,
        maintnanceMarginHeadroomNlvSide: W,
        maintnanceMarginHeadroomMaintenanceSide: Me,
        addlGmvAllowedNlvSide: mi,
        addlGmvAllowedMaintenanceSide: bi
      };
    }) : []), S = be(() => {
      if (!d.value || !y.value)
        return y.value;
      const w = g(d.value);
      if (w === null)
        return y.value;
      const b = w - 1;
      return b >= 0 && b < y.value.length ? [y.value[b]] : y.value;
    });
    be(() => {
      if (!y.value) return null;
      const w = y.value.reduce((_, W) => _ + (W.nlv_val || 0), 0), b = y.value.reduce((_, W) => {
        const Me = typeof W.maintenance_val == "string" ? parseFloat(W.maintenance_val) : W.maintenance_val;
        return _ + (isNaN(Me) ? 0 : Me);
      }, 0), R = y.value.reduce((_, W) => _ + (W.excess_maintenance_margin || 0), 0), L = y.value.reduce((_, W) => _ + (W.addlGmvAllowedNlvSide || 0), 0), O = y.value.reduce((_, W) => _ + (W.addlGmvAllowedMaintenanceSide || 0), 0);
      return {
        totalNlv: w,
        totalMaintenance: b,
        totalExcessMaintenance: R,
        totalAddlGmvToStopReducing: L,
        totalAddlGmvToStartReducing: O
      };
    });
    function D(w) {
      console.log("📋 toggleBreakdown called with ID:", w), console.log("📋 Current breakdownVisibility state:", h);
      const b = typeof w == "string" ? parseInt(w) : w, R = h[b];
      Object.keys(h).forEach((L) => {
        const O = parseInt(L);
        h[O] = !1;
      }), h[b] = !R, console.log("📋 Updated breakdownVisibility state:", h), console.log("📋 breakdownVisibility[" + b + "]:", h[b]);
    }
    const T = be(() => {
      var b;
      console.log("🔍 Computing breakdown items..."), console.log("🔍 filteredMetrics:", S.value), console.log("🔍 breakdownVisibility:", h);
      const w = ((b = S.value) == null ? void 0 : b.filter((R) => {
        const L = typeof R.nlv_internal_account_id == "string" ? parseInt(R.nlv_internal_account_id) : R.nlv_internal_account_id, O = h[L];
        return console.log("🔍 Item", L, "(original:", R.nlv_internal_account_id, ") should show:", O), O;
      })) || [];
      return console.log("🔍 Final breakdown items:", w), w;
    }), F = tr("eventBus"), H = [
      { field: "account", label: "Account" },
      { field: "nlv_val", label: "NLV" },
      { field: "maintenance_val", label: "Maintenance Margin" },
      { field: "excess_maintenance_margin", label: "Excess Maintenance Margin" },
      // Add this line
      { field: "addlGmvAllowedNlvSide", label: "Add'l GMV to stop-adding threshold" },
      { field: "addlGmvAllowedMaintenanceSide", label: "Add'l GMV to start-reducing threshold" }
    ];
    function P() {
      const b = new URL(window.location.href).searchParams.get("summary_cols");
      if (!b)
        return H.map((_) => _.field);
      const R = b.split("-and-").map((_) => _.trim()).filter(Boolean), L = new Set(H.map((_) => _.field)), O = R.filter((_) => L.has(_));
      return O.length ? O : H.map((_) => _.field);
    }
    function z(w) {
      const b = new URL(window.location.href);
      b.searchParams.set("summary_cols", w.join("-and-")), window.history.replaceState({}, "", b.toString());
    }
    const Y = fe(P()), ie = fe(!1), K = fe(null), Z = fe(null);
    function he() {
      ie.value = !ie.value;
    }
    function et() {
      ie.value = !1;
    }
    function tt(w) {
      ie.value && Z.value && K.value && !Z.value.contains(w.target) && !K.value.contains(w.target) && et();
    }
    jt(Y, (w) => {
      z(w), je(() => {
        ge();
      });
    }, { deep: !0 });
    function ge() {
      if (!s.value) return;
      if (n) {
        try {
          n.destroy();
        } catch {
        }
        n = null;
      }
      const w = [
        {
          title: "Account",
          field: "account",
          frozen: !0,
          headerSort: !1,
          width: Ne.value.account || void 0,
          // Apply saved width
          formatter: (b) => {
            const R = b.getRow().getData();
            if (R.isTotal)
              return `<div class="account-cell total-row">
            <span class="account-name">All Accounts</span>
          </div>`;
            const L = R.addlGmvAllowedNlvSide < 0 && R.addlGmvAllowedMaintenanceSide < 0 ? "STAGE 2 EXHAUSTED" : R.addlGmvAllowedNlvSide < 0 ? "STAGE 1 EXHAUSTED" : "OK", O = L === "STAGE 2 EXHAUSTED" ? "status-stage2" : L === "STAGE 1 EXHAUSTED" ? "status-stage1" : "status-ok";
            return `<div class="account-cell clickable-account">
          <span class="account-name">${R.legal_entity || R.account}</span>
          <span class="status-badge ${O}">${L}</span>
        </div>`;
          },
          titleFormatter: (b) => `<div class="header-with-close">
          <span>Account</span>
        </div>`,
          cellClick: (b, R) => {
            const L = R.getRow().getData();
            L.isTotal || ze(L.account);
          }
        },
        {
          title: "NLV",
          field: "nlv_val",
          hozAlign: "right",
          width: Ne.value.nlv_val || void 0,
          // Apply saved width
          formatter: (b) => {
            const R = b.getRow().getData(), L = E(b.getValue());
            return R.isTotal ? `<span class="cell-value total-cell">${L}</span>` : `<div class="cell-with-graph">
          <span class="cell-value">${L}</span>
        </div>`;
          },
          titleFormatter: (b) => `<div class="header-with-close">
          <span>NLV</span>
          <button class="header-close-btn" data-field="nlv_val" title="Hide column">✕</button>
        </div>`,
          bottomCalc: "sum",
          bottomCalcFormatter: (b) => E(b.getValue())
        },
        {
          title: "Maintenance Margin",
          field: "maintenance_val",
          hozAlign: "right",
          width: Ne.value.maintenance_val || void 0,
          // Apply saved width
          formatter: (b) => {
            const R = b.getRow().getData(), L = typeof b.getValue() == "string" ? parseFloat(b.getValue()) : b.getValue(), O = E(L);
            return R.isTotal ? `<span class="cell-value total-cell">${O}</span>` : `<div class="cell-with-graph">
          <span class="cell-value">${O}</span>
        </div>`;
          },
          titleFormatter: (b) => `<div class="header-with-close">
          <span>Maintenance Margin</span>
          <button class="header-close-btn" data-field="maintenance_val" title="Hide column">✕</button>
        </div>`,
          bottomCalc: "sum",
          bottomCalcFormatter: (b) => {
            const R = typeof b.getValue() == "string" ? parseFloat(b.getValue()) : b.getValue();
            return E(R);
          }
        },
        {
          title: "Excess Maintenance Margin",
          field: "excess_maintenance_margin",
          hozAlign: "right",
          width: Ne.value.excess_maintenance_margin || void 0,
          // Apply saved width
          formatter: (b) => {
            const R = b.getValue(), L = E(R);
            return `<span class="${R < 0 ? "negative" : ""}">${L}</span>`;
          },
          titleFormatter: (b) => `<div class="header-with-close">
          <span>Excess Maintenance Margin</span>
          <button class="header-close-btn" data-field="excess_maintenance_margin" title="Hide column">✕</button>
        </div>`,
          bottomCalc: "sum",
          bottomCalcFormatter: (b) => E(b.getValue())
        },
        {
          title: "Stop-adding threshold (Add'l GMV)",
          field: "addlGmvAllowedNlvSide",
          hozAlign: "right",
          width: Ne.value.addlGmvAllowedNlvSide || void 0,
          // Apply saved width
          formatter: (b) => {
            const R = b.getValue(), L = E(R);
            return `<span class="${R < 0 ? "negative" : ""}">${L}</span>`;
          },
          titleFormatter: (b) => `<div class="header-with-close">
          <span>Stop-adding threshold (Add'l GMV)</span>
          <button class="header-close-btn" data-field="addlGmvAllowedNlvSide" title="Hide column">✕</button>
        </div>`,
          bottomCalc: "sum",
          bottomCalcFormatter: (b) => E(b.getValue())
        },
        {
          title: "Start-reducing threshold (Add'l GMV)",
          field: "addlGmvAllowedMaintenanceSide",
          hozAlign: "right",
          width: Ne.value.addlGmvAllowedMaintenanceSide || void 0,
          // Apply saved width
          formatter: (b) => {
            const R = b.getValue(), L = E(R);
            return `<span class="${R < 0 ? "negative" : ""}">${L}</span>`;
          },
          titleFormatter: (b) => `<div class="header-with-close">
          <span>Start-reducing threshold (Add'l GMV)</span>
          <button class="header-close-btn" data-field="addlGmvAllowedMaintenanceSide" title="Hide column">✕</button>
        </div>`,
          bottomCalc: "sum",
          bottomCalcFormatter: (b) => E(b.getValue())
        }
      ].filter((b) => Y.value.includes(b.field));
      try {
        n = new sd(s.value, {
          data: ke.value,
          columns: w,
          layout: "fitColumns",
          height: "auto",
          placeholder: "No data available",
          columnDefaults: {
            resizable: !0,
            headerSort: !0
          },
          rowFormatter: (b) => {
            const R = b.getData(), L = b.getElement();
            R.isTotal && L && (L.style.backgroundColor = "#f8f9fa", L.style.fontWeight = "bold");
          }
        }), n.on("columnResized", (b) => {
          const R = b.getField(), L = b.getWidth();
          Ne.value[R] = L, ya(Ne.value);
        }), n.on("tableBuilt", () => {
          var R;
          const b = (R = s.value) == null ? void 0 : R.querySelectorAll(".header-close-btn");
          b == null || b.forEach((L) => {
            L.addEventListener("click", (O) => {
              O.stopPropagation();
              const _ = O.target.getAttribute("data-field");
              _ && wt(_);
            });
          });
        }), n.on("cellContext", (b, R) => {
          b.preventDefault();
          const L = R.getRow().getData();
          L.isTotal || ua(
            b,
            typeof L.nlv_internal_account_id == "string" ? parseInt(L.nlv_internal_account_id) : L.nlv_internal_account_id,
            R.getField()
          );
        }), xe();
      } catch (b) {
        console.error("Error creating Tabulator:", b);
      }
    }
    function wt(w) {
      const b = Y.value.indexOf(w);
      b > -1 && (Y.value.splice(b, 1), z(Y.value), je(() => {
        ge();
      }));
    }
    const ke = be(() => y.value ? S.value.map((b) => ({
      ...b,
      account: b.legal_entity,
      isTotal: !1
    })) : []);
    function xe() {
      const w = [];
      if (n) {
        const b = n.getFilters();
        for (const R of b)
          R.field === "account" && R.value && w.push({ field: "account", value: String(R.value) });
      }
      Qi.value = w;
    }
    function ze(w) {
      if (!n || w === void 0 || w === null) return;
      n.clearFilter(), n.setFilter([
        { field: "account", type: "=", value: String(w) }
      ]), xe();
      const b = new URL(window.location.href);
      b.searchParams.set("all_cts_clientId", String(w)), window.history.replaceState({}, "", b.toString()), F && F.emit("account-filter-changed", {
        accountId: String(w),
        source: "summary"
      });
    }
    function it(w) {
      if (!n) return;
      const b = n.getFilters().some((L) => L.field === w);
      n.clearFilter(), xe();
      const R = new URL(window.location.href);
      R.searchParams.delete("all_cts_clientId"), window.history.replaceState({}, "", R.toString()), d.value = null, b && F && F.emit("account-filter-changed", {
        accountId: null,
        source: "summary"
      }), je(() => {
        n && n.replaceData(ke.value);
      });
    }
    function Fe() {
      if (!n) return;
      const w = n.getFilters().some((R) => R.field === "account");
      n.clearFilter(), xe();
      const b = new URL(window.location.href);
      b.searchParams.delete("all_cts_clientId"), window.history.replaceState({}, "", b.toString()), w && F && F.emit("account-filter-changed", {
        accountId: null,
        source: "summary"
      });
    }
    function kn(w) {
      w.source === "summary" || !n || (w.accountId ? n.setFilter([
        { field: "account", type: "=", value: w.accountId }
      ]) : n.clearFilter(), xe());
    }
    jt([() => r.data.value, d], () => {
      n && je(() => {
        n.replaceData(ke.value);
      });
    }), jt(Y, (w) => {
      z(w), je(() => {
        ge();
      });
    }, { deep: !0 }), Cs(() => {
      d.value = p(), window.addEventListener("popstate", () => {
        d.value = p();
      }), document.addEventListener("click", Zi), document.addEventListener("click", tt), va(), F && F.on("account-filter-changed", kn), je(() => {
        r.isSuccess.value && ge();
      });
    }), jt(() => r.isSuccess.value, (w) => {
      w && je(() => {
        ge();
      });
    }), Ra(() => {
      if (n) {
        try {
          n.destroy();
        } catch {
        }
        n = null;
      }
      document.removeEventListener("click", Zi), document.removeEventListener("click", tt), es.forEach((w) => clearInterval(w)), es.length = 0, F && F.off("account-filter-changed", kn);
    });
    const me = fe({
      visible: !1,
      x: 0,
      y: 0,
      accountId: null,
      columnId: null,
      fetchedAt: null
    }), Qi = fe([]);
    function ua(w, b, R) {
      var O;
      const L = (O = y.value) == null ? void 0 : O.find((_) => (typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id) === b);
      me.value = {
        visible: !0,
        x: w.clientX,
        y: w.clientY,
        accountId: b,
        columnId: R,
        fetchedAt: (L == null ? void 0 : L.fetched_at_val) || null
      };
    }
    function Zi() {
      me.value.visible = !1;
    }
    const Mn = be(() => {
      if (!me.value.accountId) return [];
      const w = [];
      w.push({
        icon: "📋",
        label: "Details",
        action: "details",
        active: h[me.value.accountId] || !1
      });
      const b = me.value.columnId;
      return b === "nlv_val" ? w.push({
        icon: "📊",
        label: "NLV Graph",
        action: "nlv_graph",
        active: Tn(me.value.accountId, "nlv")
      }) : b === "maintenance_val" && w.push({
        icon: "📈",
        label: "Maintenance Graph",
        action: "mm_graph",
        active: Tn(me.value.accountId, "mm")
      }), w;
    });
    function Tn(w, b) {
      return a.value === w && l.value === b;
    }
    function fa(w) {
      const b = me.value.accountId;
      if (b) {
        switch (w) {
          case "details":
            D(b);
            break;
          case "nlv_graph":
            Sn(b, "nlv");
            break;
          case "mm_graph":
            Sn(b, "mm");
            break;
        }
        Zi();
      }
    }
    function Sn(w, b) {
      a.value === w && l.value === b ? (a.value = null, l.value = null) : (a.value = w, l.value = b);
    }
    const pi = be(() => l.value ? l.value === "nlv" ? v : x : null), Ln = be(() => {
      var L;
      const w = pi.value;
      if (!((L = w == null ? void 0 : w.data.value) != null && L.length)) return null;
      const b = w.data.value, R = l.value === "nlv";
      return {
        labels: b.map((O) => new Date(O.fetched_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })),
        datasets: [
          {
            label: R ? "NLV" : "Maintenance Margin",
            data: b.map((O) => R ? O.nlv : O.maintenance),
            borderColor: R ? "#3b82f6" : "#10b981",
            backgroundColor: R ? "rgba(59, 130, 246, 0.1)" : "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            fill: !0
          }
        ]
      };
    }), pa = {
      responsive: !0,
      maintainAspectRatio: !1,
      plugins: {
        legend: {
          display: !0,
          position: "top"
        },
        tooltip: {
          mode: "index",
          intersect: !1,
          callbacks: {
            label: function(w) {
              return `${w.dataset.label}: ${E(w.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: !1,
          ticks: {
            callback: function(w) {
              return E(w);
            }
          }
        }
      }
    };
    function ga(w) {
      if (!w) return "N/A";
      try {
        return new Date(w).toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      } catch {
        return "Invalid date";
      }
    }
    const es = [];
    function st(w) {
      return {
        1: "bansi",
        2: "cis",
        3: "hediye",
        4: "ovlg",
        5: "sc",
        6: "stamp",
        7: "vk"
      }[w] || "";
    }
    function ts(w) {
      const b = st(w), R = c[b];
      return {
        online: (R == null ? void 0 : R.online) || !1,
        lastUpdated: (R == null ? void 0 : R.lastUpdated) || null
      };
    }
    async function gi(w) {
      const b = c[w];
      if (b) {
        b.isLoading = !0;
        try {
          const L = await (await fetch(`${bs}?action=status&container=${w}`)).json();
          L.success ? (b.online = L.status === "running", b.lastUpdated = /* @__PURE__ */ new Date(), b.lastError = null) : b.lastError = L.error || "Unknown error";
        } catch (R) {
          console.error(`Error checking ${w} status:`, R), b.lastError = String(R);
        } finally {
          b.isLoading = !1;
        }
      }
    }
    async function ma(w) {
      const b = c[w];
      if (b) {
        b.isStarting = !0, b.isLoading = !0;
        try {
          const L = await (await fetch(`${bs}?action=start&container=${w}`)).json();
          L.success ? (yt("success", `Container ${w} started successfully`), await gi(w)) : yt("error", `Failed to start ${w}: ${L.error}`);
        } catch (R) {
          yt("error", `Error starting ${w}: ${R}`);
        } finally {
          b.isStarting = !1, b.isLoading = !1;
        }
      }
    }
    async function ba(w) {
      const b = c[w];
      if (b) {
        b.isStopping = !0, b.isLoading = !0;
        try {
          const L = await (await fetch(`${bs}?action=stop&container=${w}`)).json();
          L.success ? (yt("success", `Container ${w} stopped successfully`), await gi(w)) : yt("error", `Failed to stop ${w}: ${L.error}`);
        } catch (R) {
          yt("error", `Error stopping ${w}: ${R}`);
        } finally {
          b.isStopping = !1, b.isLoading = !1;
        }
      }
    }
    function va() {
      Object.keys(c).forEach((b) => {
        gi(b);
        const R = setInterval(() => gi(b), 3e4);
        es.push(R);
      });
    }
    function yt(w, b) {
      const R = f++;
      u.value.push({ id: R, type: w, message: b }), setTimeout(() => Dn(R), 5e3);
    }
    function Dn(w) {
      const b = u.value.findIndex((R) => R.id === w);
      b !== -1 && u.value.splice(b, 1);
    }
    function wa() {
      const b = new URL(window.location.href).searchParams.get("summary_col_widths");
      if (!b) return {};
      try {
        const R = b.split("-and-"), L = {};
        return R.forEach((O) => {
          const [_, W] = O.split(":");
          _ && W && (L[_] = parseInt(W));
        }), L;
      } catch (R) {
        return console.warn("Error parsing column widths from URL:", R), {};
      }
    }
    function ya(w) {
      const b = new URL(window.location.href), R = Object.entries(w).filter(([L, O]) => O > 0).map(([L, O]) => `${L}:${O}`).join("-and-");
      R ? b.searchParams.set("summary_col_widths", R) : b.searchParams.delete("summary_col_widths"), window.history.replaceState({}, "", b.toString());
    }
    const Ne = fe(wa());
    return (w, b) => {
      var L, O;
      const R = ka("router-link");
      return V(), j(Ct, null, [
        M("div", vp, [
          (V(!0), j(Ct, null, Ot(u.value, (_) => (V(), j("div", {
            key: _.id,
            class: os(["notification", _.type])
          }, [
            M("div", wp, [
              M("span", yp, J(_.type === "success" ? "✅" : "❌"), 1),
              M("span", Cp, J(_.message), 1)
            ]),
            M("button", {
              class: "notification-close",
              onClick: (W) => Dn(_.id)
            }, "×", 8, Ep)
          ], 2))), 128))
        ]),
        M("div", xp, [
          Pt(r).isLoading.value ? (V(), j("div", _p, [...b[5] || (b[5] = [
            M("div", { class: "loading-spinner" }, null, -1),
            M("p", null, "Loading the latest metrics...", -1)
          ])])) : Pt(r).isError.value ? (V(), j("div", Rp, [
            b[6] || (b[6] = M("h2", null, "Error Loading Data", -1)),
            b[7] || (b[7] = M("p", null, "An error occurred while fetching the metrics:", -1)),
            M("pre", null, J(Pt(r).error.value), 1)
          ])) : Pt(r).isSuccess.value ? (V(), j("div", kp, [
            M("div", Mp, [
              M("div", Tp, [
                M("h2", null, [
                  o.showHeaderLink ? (V(), Ma(R, {
                    key: 0,
                    to: "/summary",
                    class: "summary-link"
                  }, {
                    default: Ta(() => [...b[8] || (b[8] = [
                      Vn("Summary", -1)
                    ])]),
                    _: 1
                  })) : (V(), j("span", Sp, "Summary"))
                ]),
                M("div", Lp, [
                  M("button", {
                    ref_key: "summaryColumnsBtnRef",
                    ref: K,
                    class: "columns-btn",
                    "aria-label": "Column settings",
                    onClick: At(he, ["stop"]),
                    title: "Column Settings"
                  }, [...b[9] || (b[9] = [
                    M("svg", {
                      class: "icon",
                      viewBox: "0 0 24 24",
                      width: "18",
                      height: "18",
                      "aria-hidden": "true"
                    }, [
                      M("path", {
                        fill: "currentColor",
                        d: "M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.21-.37-.3-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.03-.22-.22-.39-.44-.39h-3.84c-.22 0-.41.16-.44.39l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.09-.47 0-.59.22l-1.92 3.32c-.12.21-.07.47.12.61l2.03 1.58c.04.31.06.63.06.94s-.02.63-.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.21.37.3.59.22l2.39.96c.5.38 1.03.7 1.62.94l.36 2.54c.03.22.22.39.44.39h3.84c.22 0 .41-.16.44-.39l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.09.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.03-1.58ZM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5Z"
                      })
                    ], -1)
                  ])], 512),
                  M("button", {
                    onClick: b[0] || (b[0] = (_) => i("minimize")),
                    class: "minimize-button",
                    title: "Minimize Summary"
                  }, " − "),
                  ie.value ? (V(), j("div", {
                    key: 0,
                    ref_key: "summaryColumnsPopupRef",
                    ref: Z,
                    class: "columns-dropdown",
                    onClick: b[3] || (b[3] = At(() => {
                    }, ["stop"]))
                  }, [
                    b[10] || (b[10] = M("div", { class: "columns-header" }, [
                      M("span", { class: "columns-title" }, "Columns")
                    ], -1)),
                    M("div", Dp, [
                      (V(), j(Ct, null, Ot(H, (_) => M("label", {
                        key: _.field,
                        class: "column-option"
                      }, [
                        Sa(M("input", {
                          type: "checkbox",
                          value: _.field,
                          "onUpdate:modelValue": b[1] || (b[1] = (W) => Y.value = W),
                          class: "column-checkbox"
                        }, null, 8, zp), [
                          [La, Y.value]
                        ]),
                        M("span", Fp, J(_.label), 1)
                      ])), 64))
                    ]),
                    M("div", Op, [
                      M("button", {
                        class: "btn-link",
                        onClick: b[2] || (b[2] = (_) => Y.value = H.map((W) => W.field))
                      }, " Show All "),
                      M("button", {
                        class: "btn-done",
                        onClick: et
                      }, "Done")
                    ])
                  ], 512)) : nt("", !0)
                ])
              ]),
              Qi.value.length ? (V(), j("div", Pp, [
                b[11] || (b[11] = M("span", { class: "filters-label" }, "Filtered by:", -1)),
                M("div", Ap, [
                  (V(!0), j(Ct, null, Ot(Qi.value, (_) => (V(), j("span", {
                    key: `${_.field}-${_.value}`,
                    class: "filter-tag"
                  }, [
                    M("strong", null, J(_.field === "account" ? "Account" : _.field) + ":", 1),
                    Vn(" " + J(_.value) + " ", 1),
                    M("button", {
                      class: "tag-clear",
                      onClick: (W) => it(_.field),
                      "aria-label": "Clear filter"
                    }, "✕", 8, Hp)
                  ]))), 128)),
                  M("button", {
                    class: "btn btn-clear-all",
                    onClick: Fe
                  }, "Clear all")
                ])
              ])) : nt("", !0),
              M("div", {
                ref_key: "tableDiv",
                ref: s,
                class: "summary-grid"
              }, null, 512),
              a.value && l.value ? (V(), j("div", Ip, [
                (L = pi.value) != null && L.isLoading.value ? (V(), j("div", Bp, " Loading " + J(l.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data... ", 1)) : (O = pi.value) != null && O.isError.value ? (V(), j("div", Vp, " Error loading " + J(l.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data: " + J(pi.value.error.value), 1)) : Ln.value ? (V(), j("div", Np, [
                  M("h4", null, J(l.value === "nlv" ? "NLV" : "Maintenance Margin") + " History ", 1),
                  M("div", Wp, [
                    Da(Pt(bp), {
                      data: Ln.value,
                      options: pa,
                      height: 300
                    }, null, 8, ["data"])
                  ])
                ])) : (V(), j("div", jp, " No " + J(l.value === "nlv" ? "NLV" : "Maintenance Margin") + " historical data available ", 1))
              ])) : nt("", !0),
              (V(!0), j(Ct, null, Ot(T.value, (_) => {
                var W, Me, mi, bi, zn, Fn, On, Pn, An, Hn, In, Bn;
                return V(), j("div", {
                  key: `breakdown-${typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id}`,
                  class: "calculation-breakdown"
                }, [
                  M("div", Gp, [
                    M("div", Up, [
                      M("div", null, " Calculation breakdown for " + J(_.legal_entity || `Client${((W = y.value) == null ? void 0 : W.findIndex((B) => {
                        const ee = typeof B.nlv_internal_account_id == "string" ? parseInt(B.nlv_internal_account_id) : B.nlv_internal_account_id, Q = typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id;
                        return ee === Q;
                      })) + 1}`) + ": ", 1),
                      b[12] || (b[12] = M("div", null, "Assumptions: maintenance margin (m) = 30%", -1))
                    ]),
                    M("div", $p, [
                      M("div", Xp, [
                        M("div", {
                          class: os(["container-status-badge", ts(((Me = y.value) == null ? void 0 : Me.findIndex((B) => {
                            const ee = typeof B.nlv_internal_account_id == "string" ? parseInt(B.nlv_internal_account_id) : B.nlv_internal_account_id, Q = typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id;
                            return ee === Q;
                          })) + 1).online ? "status-online" : "status-offline"])
                        }, J(ts(((mi = y.value) == null ? void 0 : mi.findIndex((B) => {
                          const ee = typeof B.nlv_internal_account_id == "string" ? parseInt(B.nlv_internal_account_id) : B.nlv_internal_account_id, Q = typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id;
                          return ee === Q;
                        })) + 1).online ? "🟢 Online" : "🔴 Offline"), 3),
                        ts(((bi = y.value) == null ? void 0 : bi.findIndex((B) => {
                          const ee = typeof B.nlv_internal_account_id == "string" ? parseInt(B.nlv_internal_account_id) : B.nlv_internal_account_id, Q = typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id;
                          return ee === Q;
                        })) + 1).online ? (V(), j("button", {
                          key: 1,
                          class: "docker-control-btn stop-btn",
                          disabled: (Hn = c[st(((An = y.value) == null ? void 0 : An.findIndex((B) => {
                            const ee = typeof B.nlv_internal_account_id == "string" ? parseInt(B.nlv_internal_account_id) : B.nlv_internal_account_id, Q = typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id;
                            return ee === Q;
                          })) + 1)]) == null ? void 0 : Hn.isLoading,
                          onClick: At((B) => {
                            var ee;
                            ba(st(((ee = y.value) == null ? void 0 : ee.findIndex((Q) => {
                              const is = typeof Q.nlv_internal_account_id == "string" ? parseInt(Q.nlv_internal_account_id) : Q.nlv_internal_account_id, ss = typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id;
                              return is === ss;
                            })) + 1));
                          }, ["stop"])
                        }, [
                          (Bn = c[st(((In = y.value) == null ? void 0 : In.findIndex((B) => {
                            const ee = typeof B.nlv_internal_account_id == "string" ? parseInt(B.nlv_internal_account_id) : B.nlv_internal_account_id, Q = typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id;
                            return ee === Q;
                          })) + 1)]) != null && Bn.isStopping ? (V(), j("span", Qp, "Stopping...")) : (V(), j("span", Zp, "⏹️ Stop Container"))
                        ], 8, Jp)) : (V(), j("button", {
                          key: 0,
                          class: "docker-control-btn start-btn",
                          disabled: (Fn = c[st(((zn = y.value) == null ? void 0 : zn.findIndex((B) => {
                            const ee = typeof B.nlv_internal_account_id == "string" ? parseInt(B.nlv_internal_account_id) : B.nlv_internal_account_id, Q = typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id;
                            return ee === Q;
                          })) + 1)]) == null ? void 0 : Fn.isLoading,
                          onClick: At((B) => {
                            var ee;
                            ma(st(((ee = y.value) == null ? void 0 : ee.findIndex((Q) => {
                              const is = typeof Q.nlv_internal_account_id == "string" ? parseInt(Q.nlv_internal_account_id) : Q.nlv_internal_account_id, ss = typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id;
                              return is === ss;
                            })) + 1));
                          }, ["stop"])
                        }, [
                          (Pn = c[st(((On = y.value) == null ? void 0 : On.findIndex((B) => {
                            const ee = typeof B.nlv_internal_account_id == "string" ? parseInt(B.nlv_internal_account_id) : B.nlv_internal_account_id, Q = typeof _.nlv_internal_account_id == "string" ? parseInt(_.nlv_internal_account_id) : _.nlv_internal_account_id;
                            return ee === Q;
                          })) + 1)]) != null && Pn.isStarting ? (V(), j("span", Kp, "Starting...")) : (V(), j("span", qp, "▶️ Start Container"))
                        ], 8, Yp))
                      ])
                    ])
                  ]),
                  M("div", eg, [
                    M("div", tg, [
                      b[17] || (b[17] = M("div", { class: "stage-header" }, "Stage-1 (drop d = 15%)", -1)),
                      M("div", ig, [
                        b[13] || (b[13] = M("div", { class: "item-label" }, "Max GMV that survives stop-adding threshold", -1)),
                        M("div", sg, [
                          M("span", ng, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + J(E(_.maxGmvNlvSide)), 1)
                        ])
                      ]),
                      M("div", og, [
                        b[14] || (b[14] = M("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                        M("div", rg, [
                          M("span", ag, "Mk = Gmax x m = " + J(E(_.mkNlvSide)), 1)
                        ])
                      ]),
                      M("div", lg, [
                        b[15] || (b[15] = M("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                        M("div", hg, [
                          M("span", dg, "Mk - M = " + J(E(_.maintnanceMarginHeadroomNlvSide)), 1)
                        ])
                      ]),
                      M("div", cg, [
                        b[16] || (b[16] = M("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                        M("div", ug, [
                          M("span", fg, "(Mk - M) / m = " + J(E(_.addlGmvAllowedNlvSide)), 1)
                        ])
                      ])
                    ]),
                    M("div", pg, [
                      b[22] || (b[22] = M("div", { class: "stage-header" }, "Stage-2 (drop d = 10%)", -1)),
                      M("div", gg, [
                        b[18] || (b[18] = M("div", { class: "item-label" }, "Max GMV that survives start-reducing threshold", -1)),
                        M("div", mg, [
                          M("span", bg, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + J(E(_.maxGmvMaintenanceSide)), 1)
                        ])
                      ]),
                      M("div", vg, [
                        b[19] || (b[19] = M("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                        M("div", wg, [
                          M("span", yg, "Mk = Gmax x m = " + J(E(_.mkMaintenanceSide)), 1)
                        ])
                      ]),
                      M("div", Cg, [
                        b[20] || (b[20] = M("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                        M("div", Eg, [
                          M("span", xg, "Mk - M = " + J(E(_.maintnanceMarginHeadroomMaintenanceSide)), 1)
                        ])
                      ]),
                      M("div", _g, [
                        b[21] || (b[21] = M("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                        M("div", Rg, [
                          M("span", kg, "(Mk - M) / m = " + J(E(_.addlGmvAllowedMaintenanceSide)), 1)
                        ])
                      ])
                    ])
                  ])
                ]);
              }), 128)),
              me.value.visible ? (V(), j("div", {
                key: 2,
                class: "context-menu",
                style: za({ left: me.value.x + "px", top: me.value.y + "px" }),
                onClick: b[4] || (b[4] = At(() => {
                }, ["stop"]))
              }, [
                (V(!0), j(Ct, null, Ot(Mn.value, (_, W) => (V(), j("div", {
                  key: _.action,
                  class: os(["context-menu-item", { active: _.active }]),
                  onClick: (Me) => fa(_.action)
                }, [
                  M("span", Tg, J(_.icon), 1),
                  M("span", null, J(_.label), 1),
                  _.active ? (V(), j("span", Sg, "●")) : nt("", !0)
                ], 10, Mg))), 128)),
                Mn.value.length > 0 ? (V(), j("div", Lg)) : nt("", !0),
                M("div", Dg, [
                  b[23] || (b[23] = M("span", { class: "context-menu-label" }, "Fetched:", -1)),
                  M("span", zg, J(ga(me.value.fetchedAt)) + " (PST) ", 1)
                ])
              ], 4)) : nt("", !0)
            ])
          ])) : nt("", !0)
        ])
      ], 64);
    };
  }
}), Og = (o, e) => {
  const t = o.__vccOpts || o;
  for (const [i, s] of e)
    t[i] = s;
  return t;
}, jg = /* @__PURE__ */ Og(Fg, [["__scopeId", "data-v-1684440f"]]);
export {
  jg as Summary,
  jg as default
};
