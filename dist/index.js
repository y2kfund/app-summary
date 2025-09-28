import { inject as G, defineComponent as x, reactive as N, onBeforeUnmount as C, computed as k, createElementBlock as g, openBlock as p, createCommentVNode as b, unref as S, createElementVNode as e, toDisplayString as l, Fragment as V, renderList as q, normalizeClass as L } from "vue";
import { useQueryClient as B, useQuery as D } from "@tanstack/vue-query";
const R = Symbol.for("y2kfund.supabase");
function E() {
  const _ = G(R, null);
  if (!_) throw new Error("[@y2kfund/core] Supabase client not found. Did you install createCore()?");
  return _;
}
function F(_) {
  const i = E(), r = ["nlvMargin", _], n = B(), M = D({
    queryKey: r,
    queryFn: async () => {
      const { data: h, error: u } = await i.schema("hf").rpc("get_nlv_margin", {
        p_limit: 10
      });
      if (u) throw u;
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
    ...M,
    _cleanup: () => {
      var h, u;
      (h = c == null ? void 0 : c.unsubscribe) == null || h.call(c), (u = v == null ? void 0 : v.unsubscribe) == null || u.call(v);
    }
  };
}
const T = { class: "dashboard-container" }, H = {
  key: 0,
  class: "loading"
}, K = {
  key: 1,
  class: "error"
}, Q = { key: 2 }, U = { class: "metric-block" }, I = {
  key: 0,
  class: "metric-row all-accounts-row"
}, $ = { class: "row-header" }, O = { class: "row-content" }, j = { class: "metric-column" }, z = { class: "metric-value" }, P = { class: "metric-value" }, J = { class: "metric-column" }, W = { class: "metric-value" }, X = { class: "metric-value" }, Y = { class: "row-header-button-container" }, Z = ["onClick"], ee = ["onClick"], te = { class: "row-content" }, se = { class: "metric-column" }, ne = { class: "metric-value" }, ae = { class: "metric-value" }, le = { class: "metric-column" }, ie = { class: "metric-value" }, oe = { class: "metric-value" }, de = {
  key: 0,
  class: "calculation-breakdown"
}, re = { class: "breakdown-columns" }, ce = { class: "breakdown-stage stage-1" }, ve = { class: "stage-item" }, ue = { class: "item-value" }, me = { class: "formula" }, _e = { class: "stage-item" }, ge = { class: "item-value" }, pe = { class: "formula" }, Me = { class: "stage-item" }, he = { class: "item-value" }, Se = { class: "formula" }, we = { class: "stage-item" }, be = { class: "item-value" }, fe = { class: "formula" }, ke = { class: "breakdown-stage stage-2" }, Ge = { class: "stage-item" }, ye = { class: "item-value" }, Ae = { class: "formula" }, xe = { class: "stage-item" }, Ne = { class: "item-value" }, Ce = { class: "formula" }, Ve = { class: "stage-item" }, qe = { class: "item-value" }, Le = { class: "formula" }, Be = { class: "stage-item" }, De = { class: "item-value" }, Re = { class: "formula" }, Ee = /* @__PURE__ */ x({
  __name: "Margin",
  setup(_) {
    const i = F(1e4), r = N({});
    function n(a) {
      return a == null ? "$0" : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(a);
    }
    C(() => {
      i._cleanup && i._cleanup();
    });
    function M(a, t, m) {
      const s = 1 - m, o = 1 - t, w = 1 - s * o;
      return a / w;
    }
    const c = k(() => i.data.value ? i.data.value.map((a) => {
      const t = M(a.nlv_val, 0.3, 0.15), m = M(a.nlv_val, 0.3, 0.1), s = t * 30 / 100, o = m * 30 / 100, d = s - a.maintenance_val, w = o - a.maintenance_val, f = d * 100 / 30, A = w * 100 / 30;
      return {
        ...a,
        maxGmvNlvSide: t,
        maxGmvMaintenanceSide: m,
        mkNlvSide: s,
        mkMaintenanceSide: o,
        maintnanceMarginHeadroomNlvSide: d,
        maintnanceMarginHeadroomMaintenanceSide: w,
        addlGmvAllowedNlvSide: f,
        addlGmvAllowedMaintenanceSide: A
      };
    }) : []), v = k(() => {
      if (!c.value) return null;
      const a = c.value.reduce((o, d) => o + (d.nlv_val || 0), 0), t = c.value.reduce((o, d) => o + (d.maintenance_val || 0), 0), m = c.value.reduce((o, d) => o + (d.addlGmvAllowedNlvSide || 0), 0), s = c.value.reduce((o, d) => o + (d.addlGmvAllowedMaintenanceSide || 0), 0);
      return {
        totalNlv: a,
        totalMaintenance: t,
        totalAddlGmvToStopReducing: m,
        totalAddlGmvToStartReducing: s
      };
    });
    function h(a) {
      r[a] = !r[a];
    }
    const u = G("eventBus");
    function y(a) {
      const t = new URL(window.location.href);
      t.searchParams.set("all_cts_clientId", "Client " + a.toString()), window.history.replaceState({}, "", t.toString()), u == null || u.emit("client-id-changed", {
        clientId: "Client " + a.toString(),
        accountId: a
      });
    }
    return (a, t) => {
      var m;
      return p(), g("div", T, [
        S(i).isLoading.value ? (p(), g("div", H, [...t[0] || (t[0] = [
          e("div", { class: "loading-spinner" }, null, -1),
          e("p", null, "Loading the latest metrics...", -1)
        ])])) : S(i).isError.value ? (p(), g("div", K, [
          t[1] || (t[1] = e("h2", null, "Error Loading Data", -1)),
          t[2] || (t[2] = e("p", null, "An error occurred while fetching the metrics:", -1)),
          e("pre", null, l(S(i).error.value), 1)
        ])) : S(i).isSuccess.value ? (p(), g("div", Q, [
          e("div", U, [
            t[22] || (t[22] = e("div", { class: "block-header" }, [
              e("h2", null, "Margin")
            ], -1)),
            v.value ? (p(), g("div", I, [
              e("div", $, "All Accounts (" + l(((m = S(i).data.value) == null ? void 0 : m.length) || 0) + ")", 1),
              e("div", O, [
                e("div", j, [
                  t[3] || (t[3] = e("div", { class: "metric-label" }, "Net liquidation value", -1)),
                  e("div", z, l(n(v.value.totalNlv)), 1),
                  t[4] || (t[4] = e("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  e("div", P, l(n(v.value.totalAddlGmvToStopReducing)), 1)
                ]),
                e("div", J, [
                  t[5] || (t[5] = e("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  e("div", W, l(n(v.value.totalMaintenance)), 1),
                  t[6] || (t[6] = e("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  e("div", X, l(n(v.value.totalAddlGmvToStartReducing)), 1)
                ])
              ])
            ])) : b("", !0),
            (p(!0), g(V, null, q(c.value, (s, o) => (p(), g("div", {
              key: s.nlv_id,
              class: "metric-row"
            }, [
              e("div", Y, [
                e("div", {
                  class: "row-header",
                  onClick: (d) => y(s.nlv_internal_account_id)
                }, "Client" + l(o + 1), 9, Z),
                e("button", {
                  class: L(["row-status", s.addlGmvAllowedNlvSide < 0 && s.addlGmvAllowedMaintenanceSide < 0 ? "stage-2-exhausted" : s.addlGmvAllowedNlvSide < 0 ? "stage-1-exhausted" : "ok"]),
                  onClick: (d) => h(s.nlv_id)
                }, l(s.addlGmvAllowedNlvSide < 0 && s.addlGmvAllowedMaintenanceSide < 0 ? "Stage 2 exhausted" : s.addlGmvAllowedNlvSide < 0 ? "Stage 1 exhausted" : "OK"), 11, ee)
              ]),
              e("div", te, [
                e("div", se, [
                  t[7] || (t[7] = e("div", { class: "metric-label" }, "NLV", -1)),
                  e("div", ne, l(n(s.nlv_val)), 1),
                  t[8] || (t[8] = e("div", { class: "metric-label" }, "Add'l GMV to stop-reducing cap", -1)),
                  e("div", ae, l(n(s.addlGmvAllowedNlvSide)), 1)
                ]),
                e("div", le, [
                  t[9] || (t[9] = e("div", { class: "metric-label" }, "Maintenance margin", -1)),
                  e("div", ie, l(n(s.maintenance_val)), 1),
                  t[10] || (t[10] = e("div", { class: "metric-label" }, "Add'l GMV to start-reducing cap", -1)),
                  e("div", oe, l(n(s.addlGmvAllowedMaintenanceSide)), 1)
                ])
              ]),
              r[s.nlv_id] ? (p(), g("div", de, [
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
                        e("span", me, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + l(n(s.maxGmvNlvSide)), 1)
                      ])
                    ]),
                    e("div", _e, [
                      t[12] || (t[12] = e("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                      e("div", ge, [
                        e("span", pe, "Mk = Gmax x m = " + l(n(s.mkNlvSide)), 1)
                      ])
                    ]),
                    e("div", Me, [
                      t[13] || (t[13] = e("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                      e("div", he, [
                        e("span", Se, "Mk - M = " + l(n(s.maintnanceMarginHeadroomNlvSide)), 1)
                      ])
                    ]),
                    e("div", we, [
                      t[14] || (t[14] = e("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                      e("div", be, [
                        e("span", fe, "(Mk - M) / m = " + l(n(s.addlGmvAllowedNlvSide)), 1)
                      ])
                    ])
                  ]),
                  e("div", ke, [
                    t[20] || (t[20] = e("div", { class: "stage-header" }, "Stage-2 (drop d = 10%)", -1)),
                    e("div", Ge, [
                      t[16] || (t[16] = e("div", { class: "item-label" }, "Max GMV that survives start-reducing threshold", -1)),
                      e("div", ye, [
                        e("span", Ae, "Gmax = NLV / [ 1 - (1 - d) x (1 - m) ] = " + l(n(s.maxGmvMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", xe, [
                      t[17] || (t[17] = e("div", { class: "item-label" }, "Max Maintenance margin (Before drop) to survive drop", -1)),
                      e("div", Ne, [
                        e("span", Ce, "Mk = Gmax x m = " + l(n(s.mkMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", Ve, [
                      t[18] || (t[18] = e("div", { class: "item-label" }, "Maintenance margin headroom", -1)),
                      e("div", qe, [
                        e("span", Le, "Mk - M = " + l(n(s.maintnanceMarginHeadroomMaintenanceSide)), 1)
                      ])
                    ]),
                    e("div", Be, [
                      t[19] || (t[19] = e("div", { class: "item-label" }, "Add'l GMV allowed", -1)),
                      e("div", De, [
                        e("span", Re, "(Mk - M) / m = " + l(n(s.addlGmvAllowedMaintenanceSide)), 1)
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
}), Fe = (_, i) => {
  const r = _.__vccOpts || _;
  for (const [n, M] of i)
    r[n] = M;
  return r;
}, Ke = /* @__PURE__ */ Fe(Ee, [["__scopeId", "data-v-e0599636"]]);
export {
  Ke as Margin,
  Ke as default
};
