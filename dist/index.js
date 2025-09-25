import { inject as k, defineComponent as y, reactive as A, onBeforeUnmount as x, computed as w, createElementBlock as _, openBlock as g, createCommentVNode as f, unref as h, createElementVNode as e, toDisplayString as l, Fragment as N, renderList as V, normalizeClass as C } from "vue";
import { useQueryClient as q, useQuery as L } from "@tanstack/vue-query";
const B = Symbol.for("y2kfund.supabase");
function D() {
  const m = k(B, null);
  if (!m) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return m;
}
function E(m) {
  const i = D(), r = ["nlvMargin", m], n = q(), p = L({
    queryKey: r,
    queryFn: async () => {
      const { data: M, error: a } = await i.schema("hf").rpc("get_nlv_margin", {
        p_limit: 10
      });
      if (a) throw a;
      return M || [];
    },
    staleTime: 6e4
  }), c = i.channel("netliquidation_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "netliquidation",
      event: "*"
    },
    () => n.invalidateQueries({ queryKey: r })
  ).subscribe(), v = i.channel("maintenance_margin_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "maintenance_margin",
      event: "*"
    },
    () => n.invalidateQueries({ queryKey: r })
  ).subscribe();
  return {
    ...p,
    _cleanup: () => {
      var M, a;
      (M = c == null ? void 0 : c.unsubscribe) == null || M.call(c), (a = v == null ? void 0 : v.unsubscribe) == null || a.call(v);
    }
  };
}
const F = { class: "dashboard-container" }, T = {
  key: 0,
  class: "loading"
}, H = {
  key: 1,
  class: "error"
}, K = { key: 2 }, Q = { class: "metric-block" }, R = {
  key: 0,
  class: "metric-row all-accounts-row"
}, U = { class: "row-header" }, O = { class: "row-content" }, $ = { class: "metric-column" }, j = { class: "metric-value" }, z = { class: "metric-value" }, I = { class: "metric-column" }, J = { class: "metric-value" }, P = { class: "metric-value" }, W = { class: "row-header-button-container" }, X = { class: "row-header" }, Y = ["onClick"], Z = { class: "row-content" }, ee = { class: "metric-column" }, se = { class: "metric-value" }, te = { class: "metric-value" }, ae = { class: "metric-column" }, ne = { class: "metric-value" }, le = { class: "metric-value" }, ie = {
  key: 0,
  class: "calculation-breakdown"
}, oe = { class: "breakdown-columns" }, de = { class: "breakdown-stage stage-1" }, re = { class: "stage-item" }, ce = { class: "item-value" }, ve = { class: "formula" }, ue = { class: "stage-item" }, me = { class: "item-value" }, _e = { class: "formula" }, ge = { class: "stage-item" }, pe = { class: "item-value" }, Me = { class: "formula" }, he = { class: "stage-item" }, be = { class: "item-value" }, fe = { class: "formula" }, Se = { class: "breakdown-stage stage-2" }, we = { class: "stage-item" }, Ge = { class: "item-value" }, ke = { class: "formula" }, ye = { class: "stage-item" }, Ae = { class: "item-value" }, xe = { class: "formula" }, Ne = { class: "stage-item" }, Ve = { class: "item-value" }, Ce = { class: "formula" }, qe = { class: "stage-item" }, Le = { class: "item-value" }, Be = { class: "formula" }, De = /* @__PURE__ */ y({
  __name: "Margin",
  setup(m) {
    const i = E(1e4), r = A({});
    function n(a) {
      return a == null ? "$0" : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(a);
    }
    x(() => {
      i._cleanup && i._cleanup();
    });
    function p(a, s, u) {
      const t = 1 - u, o = 1 - s, b = 1 - t * o;
      return a / b;
    }
    const c = w(() => i.data.value ? i.data.value.map((a) => {
      const s = p(a.nlv_val, 0.3, 0.15), u = p(a.nlv_val, 0.3, 0.1), t = s * 30 / 100, o = u * 30 / 100, d = t - a.maintenance_val, b = o - a.maintenance_val, S = d * 100 / 30, G = b * 100 / 30;
      return {
        ...a,
        maxGmvNlvSide: s,
        maxGmvMaintenanceSide: u,
        mkNlvSide: t,
        mkMaintenanceSide: o,
        maintnanceMarginHeadroomNlvSide: d,
        maintnanceMarginHeadroomMaintenanceSide: b,
        addlGmvAllowedNlvSide: S,
        addlGmvAllowedMaintenanceSide: G
      };
    }) : []), v = w(() => {
      if (!c.value) return null;
      const a = c.value.reduce((o, d) => o + (d.nlv_val || 0), 0), s = c.value.reduce((o, d) => o + (d.maintenance_val || 0), 0), u = c.value.reduce((o, d) => o + (d.addlGmvAllowedNlvSide || 0), 0), t = c.value.reduce((o, d) => o + (d.addlGmvAllowedMaintenanceSide || 0), 0);
      return {
        totalNlv: a,
        totalMaintenance: s,
        totalAddlGmvToStopReducing: u,
        totalAddlGmvToStartReducing: t
      };
    });
    function M(a) {
      r[a] = !r[a];
    }
    return (a, s) => {
      var u;
      return g(), _("div", F, [
        h(i).isLoading.value ? (g(), _("div", T, [...s[0] || (s[0] = [
          e("div", { class: "loading-spinner" }, null, -1),
          e("p", null, "Loading the latest metrics...", -1)
        ])])) : h(i).isError.value ? (g(), _("div", H, [
          s[1] || (s[1] = e("h2", null, "Error Loading Data", -1)),
          s[2] || (s[2] = e("p", null, "An error occurred while fetching the metrics:", -1)),
          e("pre", null, l(h(i).error.value), 1)
        ])) : h(i).isSuccess.value ? (g(), _("div", K, [
          e("div", Q, [
            s[22] || (s[22] = e("div", { class: "block-header" }, [
              e("h2", null, "Margin")
            ], -1)),
            v.value ? (g(), _("div", R, [
              e("div", U, "All Accounts (" + l(((u = h(i).data.value) == null ? void 0 : u.length) || 0) + ")", 1),
              e("div", O, [
                e("div", $, [
                  s[3] || (s[3] = e("div", { class: "metric-label" }, "Net liquidation value", -1)),
                  e("div", j, l(n(v.value.totalNlv)), 1),
                  s[4] || (s[4] = e("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  e("div", z, l(n(v.value.totalAddlGmvToStopReducing)), 1)
                ]),
                e("div", I, [
                  s[5] || (s[5] = e("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  e("div", J, l(n(v.value.totalMaintenance)), 1),
                  s[6] || (s[6] = e("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  e("div", P, l(n(v.value.totalAddlGmvToStartReducing)), 1)
                ])
              ])
            ])) : f("", !0),
            (g(!0), _(N, null, V(c.value, (t, o) => (g(), _("div", {
              key: t.nlv_id,
              class: "metric-row"
            }, [
              e("div", W, [
                e("div", X, "Client" + l(o + 1), 1),
                e("button", {
                  class: C(["row-status", t.addlGmvAllowedNlvSide < 0 && t.addlGmvAllowedMaintenanceSide < 0 ? "stage-2-exhausted" : t.addlGmvAllowedNlvSide < 0 ? "stage-1-exhausted" : "ok"]),
                  onClick: (d) => M(t.nlv_id)
                }, l(t.addlGmvAllowedNlvSide < 0 && t.addlGmvAllowedMaintenanceSide < 0 ? "Stage 2 exhausted" : t.addlGmvAllowedNlvSide < 0 ? "Stage 1 exhausted" : "OK"), 11, Y)
              ]),
              e("div", Z, [
                e("div", ee, [
                  s[7] || (s[7] = e("div", { class: "metric-label" }, "NLV", -1)),
                  e("div", se, l(n(t.nlv_val)), 1),
                  s[8] || (s[8] = e("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  e("div", te, l(n(t.addlGmvAllowedNlvSide)), 1)
                ]),
                e("div", ae, [
                  s[9] || (s[9] = e("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  e("div", ne, l(n(t.maintenance_val)), 1),
                  s[10] || (s[10] = e("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  e("div", le, l(n(t.addlGmvAllowedMaintenanceSide)), 1)
                ])
              ]),
              r[t.nlv_id] ? (g(), _("div", ie, [
                s[21] || (s[21] = e("div", { class: "breakdown-header" }, [
                  e("div", null, "Calculation breakdown:"),
                  e("div", null, "Assumptions: maintenance margin (m) = 30%")
                ], -1)),
                e("div", oe, [
                  e("div", de, [
                    s[15] || (s[15] = e("div", { class: "stage-header" }, "Stage-1 (drop d = 15%)", -1)),
                    e("div", re, [
                      s[11] || (s[11] = e("div", { class: "item-label" }, "Max GMV that survives stop-adding threshold", -1)),
                      e("div", ce, [
                        e("span", ve, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + l(n(t.maxGmvNlvSide)), 1)
                      ])
                    ]),
                    e("div", ue, [
                      s[12] || (s[12] = e("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                      e("div", me, [
                        e("span", _e, "Mk = Gmax x m = " + l(n(t.mkNlvSide)), 1)
                      ])
                    ]),
                    e("div", ge, [
                      s[13] || (s[13] = e("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                      e("div", pe, [
                        e("span", Me, "Mk - M = " + l(n(t.maintnanceMarginHeadroomNlvSide)), 1)
                      ])
                    ]),
                    e("div", he, [
                      s[14] || (s[14] = e("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                      e("div", be, [
                        e("span", fe, "(Mk - M) / m = " + l(n(t.addlGmvAllowedNlvSide)), 1)
                      ])
                    ])
                  ]),
                  e("div", Se, [
                    s[20] || (s[20] = e("div", { class: "stage-header" }, "Stage-2 (drop d = 10%)", -1)),
                    e("div", we, [
                      s[16] || (s[16] = e("div", { class: "item-label" }, "Max GMV that survives start-reducing threshold", -1)),
                      e("div", Ge, [
                        e("span", ke, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + l(n(t.maxGmvMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", ye, [
                      s[17] || (s[17] = e("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                      e("div", Ae, [
                        e("span", xe, "Mk = Gmax x m = " + l(n(t.mkMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", Ne, [
                      s[18] || (s[18] = e("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                      e("div", Ve, [
                        e("span", Ce, "Mk - M = " + l(n(t.maintnanceMarginHeadroomMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", qe, [
                      s[19] || (s[19] = e("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                      e("div", Le, [
                        e("span", Be, "(Mk - M) / m = " + l(n(t.addlGmvAllowedMaintenanceSide)), 1)
                      ])
                    ])
                  ])
                ])
              ])) : f("", !0)
            ]))), 128))
          ])
        ])) : f("", !0)
      ]);
    };
  }
}), Ee = (m, i) => {
  const r = m.__vccOpts || m;
  for (const [n, p] of i)
    r[n] = p;
  return r;
}, He = /* @__PURE__ */ Ee(De, [["__scopeId", "data-v-d31f5785"]]);
export {
  He as Margin,
  He as default
};
