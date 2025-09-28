import { inject as y, defineComponent as A, reactive as x, onBeforeUnmount as N, computed as k, createElementBlock as _, openBlock as g, createCommentVNode as b, unref as w, createElementVNode as e, toDisplayString as n, Fragment as C, renderList as V, normalizeClass as q } from "vue";
import { useQueryClient as L, useQuery as B } from "@tanstack/vue-query";
const D = Symbol.for("y2kfund.supabase");
function R() {
  const m = y(D, null);
  if (!m) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return m;
}
function E(m) {
  const i = R(), r = ["nlvMargin", m], a = L(), M = B({
    queryKey: r,
    queryFn: async () => {
      const { data: h, error: p } = await i.schema("hf").rpc("get_nlv_margin", {
        p_limit: 10
      });
      if (p) throw p;
      return h || [];
    },
    staleTime: 6e4
  }), c = i.channel("netliquidation_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "netliquidation",
      event: "*"
    },
    () => a.invalidateQueries({ queryKey: r })
  ).subscribe(), v = i.channel("maintenance_margin_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "maintenance_margin",
      event: "*"
    },
    () => a.invalidateQueries({ queryKey: r })
  ).subscribe();
  return {
    ...M,
    _cleanup: () => {
      var h, p;
      (h = c == null ? void 0 : c.unsubscribe) == null || h.call(c), (p = v == null ? void 0 : v.unsubscribe) == null || p.call(v);
    }
  };
}
const F = { class: "dashboard-container" }, T = {
  key: 0,
  class: "loading"
}, H = {
  key: 1,
  class: "error"
}, K = { key: 2 }, Q = { class: "metric-block" }, U = {
  key: 0,
  class: "metric-row all-accounts-row"
}, I = { class: "row-header" }, $ = { class: "row-content" }, O = { class: "metric-column" }, j = { class: "metric-value" }, z = { class: "metric-value" }, P = { class: "metric-column" }, J = { class: "metric-value" }, W = { class: "metric-value" }, X = { class: "row-header-button-container" }, Y = ["onClick"], Z = ["onClick"], ee = { class: "row-content" }, te = { class: "metric-column" }, se = { class: "metric-value" }, ae = { class: "metric-value" }, ne = { class: "metric-column" }, le = { class: "metric-value" }, ie = { class: "metric-value" }, oe = {
  key: 0,
  class: "calculation-breakdown"
}, de = { class: "breakdown-columns" }, re = { class: "breakdown-stage stage-1" }, ce = { class: "stage-item" }, ve = { class: "item-value" }, ue = { class: "formula" }, me = { class: "stage-item" }, _e = { class: "item-value" }, ge = { class: "formula" }, pe = { class: "stage-item" }, Me = { class: "item-value" }, he = { class: "formula" }, we = { class: "stage-item" }, Se = { class: "item-value" }, be = { class: "formula" }, fe = { class: "breakdown-stage stage-2" }, ke = { class: "stage-item" }, Ge = { class: "item-value" }, ye = { class: "formula" }, Ae = { class: "stage-item" }, xe = { class: "item-value" }, Ne = { class: "formula" }, Ce = { class: "stage-item" }, Ve = { class: "item-value" }, qe = { class: "formula" }, Le = { class: "stage-item" }, Be = { class: "item-value" }, De = { class: "formula" }, Re = /* @__PURE__ */ A({
  __name: "Margin",
  setup(m) {
    const i = E(1e4), r = x({});
    function a(l) {
      return l == null ? "$0" : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(l);
    }
    N(() => {
      i._cleanup && i._cleanup();
    });
    function M(l, t, u) {
      const s = 1 - u, o = 1 - t, S = 1 - s * o;
      return l / S;
    }
    const c = k(() => i.data.value ? i.data.value.map((l) => {
      const t = M(l.nlv_val, 0.3, 0.15), u = M(l.nlv_val, 0.3, 0.1), s = t * 30 / 100, o = u * 30 / 100, d = s - l.maintenance_val, S = o - l.maintenance_val, f = d * 100 / 30, G = S * 100 / 30;
      return {
        ...l,
        maxGmvNlvSide: t,
        maxGmvMaintenanceSide: u,
        mkNlvSide: s,
        mkMaintenanceSide: o,
        maintnanceMarginHeadroomNlvSide: d,
        maintnanceMarginHeadroomMaintenanceSide: S,
        addlGmvAllowedNlvSide: f,
        addlGmvAllowedMaintenanceSide: G
      };
    }) : []), v = k(() => {
      if (!c.value) return null;
      const l = c.value.reduce((o, d) => o + (d.nlv_val || 0), 0), t = c.value.reduce((o, d) => o + (d.maintenance_val || 0), 0), u = c.value.reduce((o, d) => o + (d.addlGmvAllowedNlvSide || 0), 0), s = c.value.reduce((o, d) => o + (d.addlGmvAllowedMaintenanceSide || 0), 0);
      return {
        totalNlv: l,
        totalMaintenance: t,
        totalAddlGmvToStopReducing: u,
        totalAddlGmvToStartReducing: s
      };
    });
    function h(l) {
      r[l] = !r[l];
    }
    function p(l) {
      const t = new URL(window.location.href);
      t.searchParams.set("all_cts_clientId", "Client " + l.toString()), window.history.replaceState({}, "", t.toString());
    }
    return (l, t) => {
      var u;
      return g(), _("div", F, [
        w(i).isLoading.value ? (g(), _("div", T, [...t[0] || (t[0] = [
          e("div", { class: "loading-spinner" }, null, -1),
          e("p", null, "Loading the latest metrics...", -1)
        ])])) : w(i).isError.value ? (g(), _("div", H, [
          t[1] || (t[1] = e("h2", null, "Error Loading Data", -1)),
          t[2] || (t[2] = e("p", null, "An error occurred while fetching the metrics:", -1)),
          e("pre", null, n(w(i).error.value), 1)
        ])) : w(i).isSuccess.value ? (g(), _("div", K, [
          e("div", Q, [
            t[22] || (t[22] = e("div", { class: "block-header" }, [
              e("h2", null, "Margin")
            ], -1)),
            v.value ? (g(), _("div", U, [
              e("div", I, "All Accounts (" + n(((u = w(i).data.value) == null ? void 0 : u.length) || 0) + ")", 1),
              e("div", $, [
                e("div", O, [
                  t[3] || (t[3] = e("div", { class: "metric-label" }, "Net liquidation value", -1)),
                  e("div", j, n(a(v.value.totalNlv)), 1),
                  t[4] || (t[4] = e("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  e("div", z, n(a(v.value.totalAddlGmvToStopReducing)), 1)
                ]),
                e("div", P, [
                  t[5] || (t[5] = e("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  e("div", J, n(a(v.value.totalMaintenance)), 1),
                  t[6] || (t[6] = e("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  e("div", W, n(a(v.value.totalAddlGmvToStartReducing)), 1)
                ])
              ])
            ])) : b("", !0),
            (g(!0), _(C, null, V(c.value, (s, o) => (g(), _("div", {
              key: s.nlv_id,
              class: "metric-row"
            }, [
              e("div", X, [
                e("div", {
                  class: "row-header",
                  onClick: (d) => p(s.nlv_internal_account_id)
                }, "Client" + n(o + 1), 9, Y),
                e("button", {
                  class: q(["row-status", s.addlGmvAllowedNlvSide < 0 && s.addlGmvAllowedMaintenanceSide < 0 ? "stage-2-exhausted" : s.addlGmvAllowedNlvSide < 0 ? "stage-1-exhausted" : "ok"]),
                  onClick: (d) => h(s.nlv_id)
                }, n(s.addlGmvAllowedNlvSide < 0 && s.addlGmvAllowedMaintenanceSide < 0 ? "Stage 2 exhausted" : s.addlGmvAllowedNlvSide < 0 ? "Stage 1 exhausted" : "OK"), 11, Z)
              ]),
              e("div", ee, [
                e("div", te, [
                  t[7] || (t[7] = e("div", { class: "metric-label" }, "NLV", -1)),
                  e("div", se, n(a(s.nlv_val)), 1),
                  t[8] || (t[8] = e("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  e("div", ae, n(a(s.addlGmvAllowedNlvSide)), 1)
                ]),
                e("div", ne, [
                  t[9] || (t[9] = e("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  e("div", le, n(a(s.maintenance_val)), 1),
                  t[10] || (t[10] = e("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  e("div", ie, n(a(s.addlGmvAllowedMaintenanceSide)), 1)
                ])
              ]),
              r[s.nlv_id] ? (g(), _("div", oe, [
                t[21] || (t[21] = e("div", { class: "breakdown-header" }, [
                  e("div", null, "Calculation breakdown:"),
                  e("div", null, "Assumptions: maintenance margin (m) = 30%")
                ], -1)),
                e("div", de, [
                  e("div", re, [
                    t[15] || (t[15] = e("div", { class: "stage-header" }, "Stage-1 (drop d = 15%)", -1)),
                    e("div", ce, [
                      t[11] || (t[11] = e("div", { class: "item-label" }, "Max GMV that survives stop-adding threshold", -1)),
                      e("div", ve, [
                        e("span", ue, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + n(a(s.maxGmvNlvSide)), 1)
                      ])
                    ]),
                    e("div", me, [
                      t[12] || (t[12] = e("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                      e("div", _e, [
                        e("span", ge, "Mk = Gmax x m = " + n(a(s.mkNlvSide)), 1)
                      ])
                    ]),
                    e("div", pe, [
                      t[13] || (t[13] = e("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                      e("div", Me, [
                        e("span", he, "Mk - M = " + n(a(s.maintnanceMarginHeadroomNlvSide)), 1)
                      ])
                    ]),
                    e("div", we, [
                      t[14] || (t[14] = e("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                      e("div", Se, [
                        e("span", be, "(Mk - M) / m = " + n(a(s.addlGmvAllowedNlvSide)), 1)
                      ])
                    ])
                  ]),
                  e("div", fe, [
                    t[20] || (t[20] = e("div", { class: "stage-header" }, "Stage-2 (drop d = 10%)", -1)),
                    e("div", ke, [
                      t[16] || (t[16] = e("div", { class: "item-label" }, "Max GMV that survives start-reducing threshold", -1)),
                      e("div", Ge, [
                        e("span", ye, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + n(a(s.maxGmvMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", Ae, [
                      t[17] || (t[17] = e("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                      e("div", xe, [
                        e("span", Ne, "Mk = Gmax x m = " + n(a(s.mkMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", Ce, [
                      t[18] || (t[18] = e("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                      e("div", Ve, [
                        e("span", qe, "Mk - M = " + n(a(s.maintnanceMarginHeadroomMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", Le, [
                      t[19] || (t[19] = e("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                      e("div", Be, [
                        e("span", De, "(Mk - M) / m = " + n(a(s.addlGmvAllowedMaintenanceSide)), 1)
                      ])
                    ])
                  ])
                ])
              ])) : b("", !0)
            ]))), 128))
          ])
        ])) : b("", !0)
      ]);
    };
  }
}), Ee = (m, i) => {
  const r = m.__vccOpts || m;
  for (const [a, M] of i)
    r[a] = M;
  return r;
}, He = /* @__PURE__ */ Ee(Re, [["__scopeId", "data-v-0e27e7cd"]]);
export {
  He as Margin,
  He as default
};
