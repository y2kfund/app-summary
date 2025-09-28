import { inject as G, defineComponent as N, reactive as C, onBeforeUnmount as V, computed as k, createElementBlock as g, openBlock as p, createCommentVNode as f, unref as w, createElementVNode as e, toDisplayString as l, Fragment as L, renderList as q, normalizeClass as R } from "vue";
import { useQueryClient as D, useQuery as I } from "@tanstack/vue-query";
const E = Symbol.for("y2kfund.supabase");
function F() {
  const _ = G(E, null);
  if (!_) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return _;
}
function T(_) {
  const i = F(), c = ["nlvMargin", _], s = D(), h = I({
    queryKey: c,
    queryFn: async () => {
      const { data: M, error: r } = await i.schema("hf").rpc("get_nlv_margin", {
        p_limit: 10
      });
      if (r) throw r;
      return M || [];
    },
    staleTime: 6e4
  }), v = i.channel("netliquidation_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "netliquidation",
      event: "*"
    },
    () => s.invalidateQueries({ queryKey: c })
  ).subscribe(), u = i.channel("maintenance_margin_all").on(
    "postgres_changes",
    {
      schema: "hf",
      table: "maintenance_margin",
      event: "*"
    },
    () => s.invalidateQueries({ queryKey: c })
  ).subscribe();
  return {
    ...h,
    _cleanup: () => {
      var M, r;
      (M = v == null ? void 0 : v.unsubscribe) == null || M.call(v), (r = u == null ? void 0 : u.unsubscribe) == null || r.call(u);
    }
  };
}
const U = { class: "dashboard-container" }, B = {
  key: 0,
  class: "loading"
}, H = {
  key: 1,
  class: "error"
}, K = { key: 2 }, Q = { class: "metric-block" }, $ = {
  key: 0,
  class: "metric-row all-accounts-row"
}, O = { class: "row-content" }, P = { class: "metric-column" }, j = { class: "metric-value" }, z = { class: "metric-value" }, J = { class: "metric-column" }, W = { class: "metric-value" }, X = { class: "metric-value" }, Y = { class: "row-header-button-container" }, Z = ["onClick"], ee = ["onClick"], te = { class: "row-content" }, ne = { class: "metric-column" }, ae = { class: "metric-value" }, se = { class: "metric-value" }, le = { class: "metric-column" }, ie = { class: "metric-value" }, oe = { class: "metric-value" }, de = {
  key: 0,
  class: "calculation-breakdown"
}, re = { class: "breakdown-columns" }, ce = { class: "breakdown-stage stage-1" }, ve = { class: "stage-item" }, ue = { class: "item-value" }, me = { class: "formula" }, _e = { class: "stage-item" }, ge = { class: "item-value" }, pe = { class: "formula" }, he = { class: "stage-item" }, Me = { class: "item-value" }, we = { class: "formula" }, Se = { class: "stage-item" }, fe = { class: "item-value" }, be = { class: "formula" }, ke = { class: "breakdown-stage stage-2" }, Ge = { class: "stage-item" }, ye = { class: "item-value" }, Ae = { class: "formula" }, xe = { class: "stage-item" }, Ne = { class: "item-value" }, Ce = { class: "formula" }, Ve = { class: "stage-item" }, Le = { class: "item-value" }, qe = { class: "formula" }, Re = { class: "stage-item" }, De = { class: "item-value" }, Ie = { class: "formula" }, Ee = /* @__PURE__ */ N({
  __name: "Margin",
  setup(_) {
    const i = T(1e4), c = C({});
    function s(a) {
      return a == null ? "$0" : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(a);
    }
    V(() => {
      i._cleanup && i._cleanup();
    });
    function h(a, t, m) {
      const n = 1 - m, o = 1 - t, S = 1 - n * o;
      return a / S;
    }
    const v = k(() => i.data.value ? i.data.value.map((a) => {
      const t = h(a.nlv_val, 0.3, 0.15), m = h(a.nlv_val, 0.3, 0.1), n = t * 30 / 100, o = m * 30 / 100, d = n - a.maintenance_val, S = o - a.maintenance_val, b = d * 100 / 30, x = S * 100 / 30;
      return {
        ...a,
        maxGmvNlvSide: t,
        maxGmvMaintenanceSide: m,
        mkNlvSide: n,
        mkMaintenanceSide: o,
        maintnanceMarginHeadroomNlvSide: d,
        maintnanceMarginHeadroomMaintenanceSide: S,
        addlGmvAllowedNlvSide: b,
        addlGmvAllowedMaintenanceSide: x
      };
    }) : []), u = k(() => {
      if (!v.value) return null;
      const a = v.value.reduce((o, d) => o + (d.nlv_val || 0), 0), t = v.value.reduce((o, d) => o + (d.maintenance_val || 0), 0), m = v.value.reduce((o, d) => o + (d.addlGmvAllowedNlvSide || 0), 0), n = v.value.reduce((o, d) => o + (d.addlGmvAllowedMaintenanceSide || 0), 0);
      return {
        totalNlv: a,
        totalMaintenance: t,
        totalAddlGmvToStopReducing: m,
        totalAddlGmvToStartReducing: n
      };
    });
    function M(a) {
      c[a] = !c[a];
    }
    const r = G("eventBus");
    function y(a) {
      const t = new URL(window.location.href);
      t.searchParams.set("all_cts_clientId", "Client " + a.toString()), window.history.replaceState({}, "", t.toString()), r == null || r.emit("client-id-changed", {
        clientId: "Client " + a.toString(),
        accountId: a
      });
    }
    function A() {
      const a = new URL(window.location.href);
      a.searchParams.delete("all_cts_clientId"), window.history.replaceState({}, "", a.toString()), r == null || r.emit("client-id-changed", {
        clientId: null,
        accountId: null
      });
    }
    return (a, t) => {
      var m;
      return p(), g("div", U, [
        w(i).isLoading.value ? (p(), g("div", B, [...t[0] || (t[0] = [
          e("div", { class: "loading-spinner" }, null, -1),
          e("p", null, "Loading the latest metrics...", -1)
        ])])) : w(i).isError.value ? (p(), g("div", H, [
          t[1] || (t[1] = e("h2", null, "Error Loading Data", -1)),
          t[2] || (t[2] = e("p", null, "An error occurred while fetching the metrics:", -1)),
          e("pre", null, l(w(i).error.value), 1)
        ])) : w(i).isSuccess.value ? (p(), g("div", K, [
          e("div", Q, [
            t[22] || (t[22] = e("div", { class: "block-header" }, [
              e("h2", null, "Margin")
            ], -1)),
            u.value ? (p(), g("div", $, [
              e("div", {
                class: "row-header",
                onClick: A
              }, "All Accounts (" + l(((m = w(i).data.value) == null ? void 0 : m.length) || 0) + ")", 1),
              e("div", O, [
                e("div", P, [
                  t[3] || (t[3] = e("div", { class: "metric-label" }, "Net liquidation value", -1)),
                  e("div", j, l(s(u.value.totalNlv)), 1),
                  t[4] || (t[4] = e("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  e("div", z, l(s(u.value.totalAddlGmvToStopReducing)), 1)
                ]),
                e("div", J, [
                  t[5] || (t[5] = e("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  e("div", W, l(s(u.value.totalMaintenance)), 1),
                  t[6] || (t[6] = e("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  e("div", X, l(s(u.value.totalAddlGmvToStartReducing)), 1)
                ])
              ])
            ])) : f("", !0),
            (p(!0), g(L, null, q(v.value, (n, o) => (p(), g("div", {
              key: n.nlv_id,
              class: "metric-row"
            }, [
              e("div", Y, [
                e("div", {
                  class: "row-header",
                  onClick: (d) => y(n.nlv_internal_account_id)
                }, "Client" + l(o + 1), 9, Z),
                e("button", {
                  class: R(["row-status", n.addlGmvAllowedNlvSide < 0 && n.addlGmvAllowedMaintenanceSide < 0 ? "stage-2-exhausted" : n.addlGmvAllowedNlvSide < 0 ? "stage-1-exhausted" : "ok"]),
                  onClick: (d) => M(n.nlv_id)
                }, l(n.addlGmvAllowedNlvSide < 0 && n.addlGmvAllowedMaintenanceSide < 0 ? "Stage 2 exhausted" : n.addlGmvAllowedNlvSide < 0 ? "Stage 1 exhausted" : "OK"), 11, ee)
              ]),
              e("div", te, [
                e("div", ne, [
                  t[7] || (t[7] = e("div", { class: "metric-label" }, "NLV", -1)),
                  e("div", ae, l(s(n.nlv_val)), 1),
                  t[8] || (t[8] = e("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  e("div", se, l(s(n.addlGmvAllowedNlvSide)), 1)
                ]),
                e("div", le, [
                  t[9] || (t[9] = e("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  e("div", ie, l(s(n.maintenance_val)), 1),
                  t[10] || (t[10] = e("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  e("div", oe, l(s(n.addlGmvAllowedMaintenanceSide)), 1)
                ])
              ]),
              c[n.nlv_id] ? (p(), g("div", de, [
                t[21] || (t[21] = e("div", { class: "breakdown-header" }, [
                  e("div", null, "Calculation breakdown:"),
                  e("div", null, "Assumptions: maintenance margin (m) = 30%")
                ], -1)),
                e("div", re, [
                  e("div", ce, [
                    t[15] || (t[15] = e("div", { class: "stage-header" }, "Stage-1 (drop d = 15%)", -1)),
                    e("div", ve, [
                      t[11] || (t[11] = e("div", { class: "item-label" }, "Max GMV that survives stop-adding threshold", -1)),
                      e("div", ue, [
                        e("span", me, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + l(s(n.maxGmvNlvSide)), 1)
                      ])
                    ]),
                    e("div", _e, [
                      t[12] || (t[12] = e("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                      e("div", ge, [
                        e("span", pe, "Mk = Gmax x m = " + l(s(n.mkNlvSide)), 1)
                      ])
                    ]),
                    e("div", he, [
                      t[13] || (t[13] = e("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                      e("div", Me, [
                        e("span", we, "Mk - M = " + l(s(n.maintnanceMarginHeadroomNlvSide)), 1)
                      ])
                    ]),
                    e("div", Se, [
                      t[14] || (t[14] = e("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                      e("div", fe, [
                        e("span", be, "(Mk - M) / m = " + l(s(n.addlGmvAllowedNlvSide)), 1)
                      ])
                    ])
                  ]),
                  e("div", ke, [
                    t[20] || (t[20] = e("div", { class: "stage-header" }, "Stage-2 (drop d = 10%)", -1)),
                    e("div", Ge, [
                      t[16] || (t[16] = e("div", { class: "item-label" }, "Max GMV that survives start-reducing threshold", -1)),
                      e("div", ye, [
                        e("span", Ae, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + l(s(n.maxGmvMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", xe, [
                      t[17] || (t[17] = e("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                      e("div", Ne, [
                        e("span", Ce, "Mk = Gmax x m = " + l(s(n.mkMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", Ve, [
                      t[18] || (t[18] = e("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                      e("div", Le, [
                        e("span", qe, "Mk - M = " + l(s(n.maintnanceMarginHeadroomMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", Re, [
                      t[19] || (t[19] = e("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                      e("div", De, [
                        e("span", Ie, "(Mk - M) / m = " + l(s(n.addlGmvAllowedMaintenanceSide)), 1)
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
}), Fe = (_, i) => {
  const c = _.__vccOpts || _;
  for (const [s, h] of i)
    c[s] = h;
  return c;
}, Be = /* @__PURE__ */ Fe(Ee, [["__scopeId", "data-v-18c3e646"]]);
export {
  Be as Margin,
  Be as default
};
