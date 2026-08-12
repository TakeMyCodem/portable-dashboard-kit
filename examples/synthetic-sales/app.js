(function () {
  const D = window.DASHBOARD;
  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "partners", label: "Partners", icon: "👥" },
    { id: "planfact", label: "Plan vs Fact", icon: "📅" }
  ];

  let active = "overview";
  let selectedMonths = new Set([1, 2, 3, 4, 5, 6, 7]); // YTD default
  let partnerQuery = "";
  let partnerRepFilter = "";
  let drillPartnerId = null;

  // --- helpers ---
  function fmtM(v) {
    if (v == null || isNaN(v)) return "—";
    return v.toLocaleString("hu-HU", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " M";
  }

  function fmtPct(p) {
    if (p == null || isNaN(p)) return "—";
    return (p * 100).toLocaleString("hu-HU", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";
  }

  function attainment(actual, plan) {
    if (plan == null || plan === 0 || actual == null) return null;
    return actual / plan;
  }

  function ragClass(v) {
    if (v == null) return "rag-na";
    if (v >= 1.0) return "rag-good";
    if (v >= 0.9) return "rag-ok";
    if (v >= 0.75) return "rag-warn";
    return "rag-bad";
  }

  function ragBadge(v) {
    if (v == null) return `<span class="rag rag-na">—</span>`;
    return `<span class="rag ${ragClass(v)}">${fmtPct(v)}</span>`;
  }

  function deltaText(actual, plan) {
    if (actual == null || plan == null || plan === 0) return "";
    const d = ((actual - plan) / plan) * 100;
    const sign = d > 0 ? "+" : "";
    return sign + d.toFixed(1) + "% vs plan";
  }

  // --- tabs nav ---
  function renderNav() {
    document.getElementById("tab-nav").innerHTML = tabs
      .map(
        (t) =>
          `<button data-tab="${t.id}" class="${t.id === active ? "active" : ""}">${t.icon} ${t.label}</button>`
      )
      .join("");

    document.querySelectorAll("#tab-nav button").forEach((btn) => {
      btn.onclick = () => {
        active = btn.dataset.tab;
        if (active !== "partners") drillPartnerId = null;
        renderNav();
        renderFilter();
        renderContent();
      };
    });
  }

  // --- global month filter ---
  function renderFilter() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const allActive = selectedMonths.size === 12;

    let html = `<span class="filter-label">Month</span>`;
    html += `<button class="gf-pill ${allActive ? "active" : ""}" data-m="all">All</button>`;
    months.forEach((label, i) => {
      const m = i + 1;
      const on = selectedMonths.has(m);
      html += `<button class="gf-pill ${on ? "active" : ""}" data-m="${m}">${label}</button>`;
    });

    const bar = document.getElementById("global-filter-bar");
    bar.innerHTML = html;

    bar.querySelectorAll(".gf-pill").forEach((btn) => {
      btn.onclick = () => {
        const v = btn.dataset.m;
        if (v === "all") {
          if (selectedMonths.size === 12) selectedMonths.clear();
          else selectedMonths = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        } else {
          const m = parseInt(v, 10);
          if (selectedMonths.has(m)) selectedMonths.delete(m);
          else selectedMonths.add(m);
        }
        renderFilter();
        renderContent();
      };
    });
  }

  // --- Overview ---
  function renderOverview() {
    const k = D.kpis;
    const att = attainment(k.revenueYtd, k.revenuePlanYtd);

    const filtered = D.monthly.filter((row) => selectedMonths.has(row.m));
    const sumActual = filtered.reduce((s, r) => s + (r.actual || 0), 0);
    const sumPlan = filtered.reduce((s, r) => s + (r.plan || 0), 0);
    const maxVal = Math.max(...D.monthly.map((r) => Math.max(r.plan || 0, r.actual || 0, r.ly || 0)), 1);

    return `
      <div class="card">
        <div class="card-title">📊 Overview — Synthetic Wholesale</div>
        <p class="sub">Data as of <b>${D.meta.asOf}</b> · closed months: <b>${D.meta.actMonths}</b> · ${D.meta.note}</p>
        <div class="kpi-grid">
          <div class="kpi">
            <div class="kpi-label">Revenue YTD</div>
            <div class="kpi-value">${fmtM(k.revenueYtd)}</div>
            <div class="kpi-sub">${deltaText(k.revenueYtd, k.revenuePlanYtd)}</div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Plan attainment</div>
            <div class="kpi-value">${ragBadge(att)}</div>
            <div class="kpi-sub">Plan YTD: ${fmtM(k.revenuePlanYtd)}</div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Gross margin</div>
            <div class="kpi-value">${fmtPct(k.marginPct)}</div>
            <div class="kpi-sub">Orders: ${k.orders.toLocaleString("hu-HU")}</div>
          </div>
          <div class="kpi">
            <div class="kpi-label">YoY</div>
            <div class="kpi-value">${fmtPct(k.yoyPct)}</div>
            <div class="kpi-sub">Expected arrival: ${fmtM(k.expectedArrival)}</div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Ghost recovered</div>
            <div class="kpi-value">${fmtM(k.ghostRecovered)}</div>
            <div class="kpi-sub">via integrity / ffill pattern</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Monthly pulse (plan vs actual)</div>
        <div class="legend">
          <span><i class="sw sw-actual"></i> Actual 2026</span>
          <span><i class="sw sw-plan"></i> Plan 2026</span>
        </div>
        ${D.monthly
          .map((r) => {
            const aPct = ((r.actual || 0) / maxVal) * 100;
            const pPct = ((r.plan || 0) / maxVal) * 100;
            const dim = r.actual == null ? "opacity:0.45" : "";
            return `
              <div class="bar-row" style="${dim}">
                <div class="bar-label">${r.label}</div>
                <div class="bar-track">
                  <div class="bar-plan" style="width:${pPct}%"></div>
                  <div class="bar-actual" style="width:${aPct}%"></div>
                </div>
                <div class="bar-value">${r.actual != null ? r.actual : "—"} / ${r.plan}</div>
              </div>`;
          })
          .join("")}
      </div>

      <div class="card">
        <div class="card-title">Filtered months (selected: ${[...selectedMonths].sort((a,b)=>a-b).join(", ") || "none"})</div>
        <p class="sub">Sum actual: <b>${fmtM(sumActual)}</b> · Sum plan: <b>${fmtM(sumPlan)}</b> · Attainment: ${ragBadge(attainment(sumActual, sumPlan))}</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th class="num">Plan (M)</th>
                <th class="num">Actual (M)</th>
                <th class="num">LY (M)</th>
                <th class="num">Attainment</th>
              </tr>
            </thead>
            <tbody>
              ${filtered
                .map((r) => {
                  const a = attainment(r.actual, r.plan);
                  return `<tr>
                    <td>${r.label}</td>
                    <td class="num">${r.plan}</td>
                    <td class="num">${r.actual != null ? r.actual : "—"}</td>
                    <td class="num">${r.ly}</td>
                    <td class="num">${ragBadge(a)}</td>
                  </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- Partners ---
  function renderPartners() {
    const reps = D.reps;
    let rows = D.partners.slice();

    if (partnerQuery) {
      const q = partnerQuery.toLowerCase();
      rows = rows.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    if (partnerRepFilter) {
      rows = rows.filter((p) => p.rep === partnerRepFilter);
    }

    const totalRev = rows.reduce((s, p) => s + p.revenue, 0);
    const totalPlan = rows.reduce((s, p) => s + p.plan, 0);

    const drill = drillPartnerId ? D.partners.find((p) => p.id === drillPartnerId) : null;
    const brands = drill ? D.brandsByPartner[drill.id] || [] : [];

    return `
      <div class="card">
        <div class="card-title">👥 Partners</div>
        <p class="sub">Synthetic customer list · click a name for brand drill-down · search + rep filter</p>

        <div class="search-row">
          <input type="search" id="pn-search" placeholder="Search partner…" value="${partnerQuery.replace(/"/g, "&quot;")}">
          <select id="pn-rep" class="btn" style="padding:7px 10px">
            <option value="">All reps</option>
            ${reps.map((r) => `<option value="${r.code}" ${partnerRepFilter === r.code ? "selected" : ""}>${r.code} — ${r.name}</option>`).join("")}
          </select>
        </div>

        <div class="export-row"><button class="export-btn" id="pn-export">⬇ Export CSV</button></div>
        <div class="table-wrap">
          <table id="pn-table">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Rep</th>
                <th>Region</th>
                <th class="num">Revenue (M)</th>
                <th class="num">Plan (M)</th>
                <th class="num">Attainment</th>
                <th class="num">Orders</th>
                <th class="num">Margin</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map((p) => {
                  const a = attainment(p.revenue, p.plan);
                  return `<tr>
                    <td class="link-cell" data-pid="${p.id}">${p.name}</td>
                    <td>${p.rep}</td>
                    <td>${p.region}</td>
                    <td class="num" data-v="${p.revenue}">${p.revenue.toFixed(1)}</td>
                    <td class="num" data-v="${p.plan}">${p.plan.toFixed(1)}</td>
                    <td class="num">${ragBadge(a)}</td>
                    <td class="num">${p.orders}</td>
                    <td class="num">${fmtPct(p.margin)}</td>
                  </tr>`;
                })
                .join("")}
            </tbody>
            <tfoot>
              <tr class="totals">
                <td colspan="3">Total (${rows.length})</td>
                <td class="num">${totalRev.toFixed(1)}</td>
                <td class="num">${totalPlan.toFixed(1)}</td>
                <td class="num">${ragBadge(attainment(totalRev, totalPlan))}</td>
                <td></td><td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        ${
          drill
            ? `
          <div class="drill" id="pn-drill">
            <div class="drill-header">
              <div class="drill-title">Drill — ${drill.name} (${drill.id})</div>
              <button class="btn" id="pn-close-drill">Close</button>
            </div>
            <p class="sub">Rep: ${drill.rep} · Region: ${drill.region} · Revenue: ${fmtM(drill.revenue)} · Plan: ${fmtM(drill.plan)}</p>
            ${
              brands.length
                ? `<div class="table-wrap"><table>
                    <thead><tr><th>Brand</th><th class="num">Revenue (M)</th><th class="num">Share</th></tr></thead>
                    <tbody>
                      ${brands
                        .map((b) => {
                          const share = drill.revenue ? b.revenue / drill.revenue : 0;
                          return `<tr><td>${b.brand}</td><td class="num">${b.revenue.toFixed(1)}</td><td class="num">${fmtPct(share)}</td></tr>`;
                        })
                        .join("")}
                    </tbody>
                  </table></div>`
                : `<p class="sub">No brand breakdown for this synthetic partner.</p>`
            }
          </div>`
            : ""
        }
      </div>
    `;
  }

  function wirePartners() {
    const search = document.getElementById("pn-search");
    if (search) {
      search.oninput = () => {
        partnerQuery = search.value;
        renderContent();
        const el = document.getElementById("pn-search");
        if (el) {
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        }
      };
    }
    const rep = document.getElementById("pn-rep");
    if (rep) {
      rep.onchange = () => {
        partnerRepFilter = rep.value;
        renderContent();
      };
    }
    document.querySelectorAll("#pn-table .link-cell").forEach((td) => {
      td.onclick = () => {
        drillPartnerId = td.dataset.pid;
        renderContent();
      };
    });
    const close = document.getElementById("pn-close-drill");
    if (close) close.onclick = () => {
      drillPartnerId = null;
      renderContent();
    };
    const exp = document.getElementById("pn-export");
    if (exp) {
      exp.onclick = () => exportTableCSV("pn-table", "partners-synthetic.csv");
    }
  }

  // --- Plan vs Fact ---
  function renderPlanFact() {
    const rows = D.monthly.filter((r) => selectedMonths.has(r.m));
    const sumA = rows.reduce((s, r) => s + (r.actual || 0), 0);
    const sumP = rows.reduce((s, r) => s + (r.plan || 0), 0);
    const sumLy = rows.reduce((s, r) => s + (r.ly || 0), 0);

    return `
      <div class="card">
        <div class="card-title">📅 Plan vs Fact</div>
        <p class="sub">Month filter driven · closed months show actuals · open months show plan only</p>

        <div class="kpi-grid" style="margin-bottom:16px">
          <div class="kpi">
            <div class="kpi-label">Selected actual</div>
            <div class="kpi-value">${fmtM(sumA)}</div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Selected plan</div>
            <div class="kpi-value">${fmtM(sumP)}</div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Attainment</div>
            <div class="kpi-value">${ragBadge(attainment(sumA, sumP))}</div>
          </div>
          <div class="kpi">
            <div class="kpi-label">vs Last Year</div>
            <div class="kpi-value">${sumLy ? fmtPct(sumA / sumLy - 1) : "—"}</div>
          </div>
        </div>

        <div class="export-row"><button class="export-btn" id="pf-export">⬇ Export CSV</button></div>
        <div class="table-wrap">
          <table id="pf-table">
            <thead>
              <tr>
                <th>Month</th>
                <th class="num">Plan (M)</th>
                <th class="num">Actual (M)</th>
                <th class="num">Δ</th>
                <th class="num">Attainment</th>
                <th class="num">LY (M)</th>
                <th class="num">YoY</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map((r) => {
                  const d = r.actual != null ? r.actual - r.plan : null;
                  const a = attainment(r.actual, r.plan);
                  const yoy = r.actual != null && r.ly ? r.actual / r.ly - 1 : null;
                  return `<tr>
                    <td>${r.label}</td>
                    <td class="num">${r.plan}</td>
                    <td class="num">${r.actual != null ? r.actual : "—"}</td>
                    <td class="num">${d != null ? (d > 0 ? "+" : "") + d.toFixed(1) : "—"}</td>
                    <td class="num">${ragBadge(a)}</td>
                    <td class="num">${r.ly}</td>
                    <td class="num">${yoy != null ? fmtPct(yoy) : "—"}</td>
                  </tr>`;
                })
                .join("")}
            </tbody>
            <tfoot>
              <tr class="totals">
                <td>Total</td>
                <td class="num">${sumP.toFixed(1)}</td>
                <td class="num">${sumA.toFixed(1)}</td>
                <td class="num">${(sumA - sumP > 0 ? "+" : "") + (sumA - sumP).toFixed(1)}</td>
                <td class="num">${ragBadge(attainment(sumA, sumP))}</td>
                <td class="num">${sumLy.toFixed(1)}</td>
                <td class="num">${sumLy ? fmtPct(sumA / sumLy - 1) : "—"}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Pattern note</div>
        <p class="sub" style="margin:0">
          In production each tab declares a <b>data contract</b> (required keys only).
          The assembler validates and ships exactly those slices — no full data blob in the HTML.
          This demo keeps data local for portability; the real systems enforce contracts at build time.
        </p>
      </div>
    `;
  }

  function wirePlanFact() {
    const exp = document.getElementById("pf-export");
    if (exp) exp.onclick = () => exportTableCSV("pf-table", "plan-fact-synthetic.csv");
  }

  // --- CSV export (DOM-based, what you see) ---
  function exportTableCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = [...table.querySelectorAll("tr")];
    const csv = rows
      .map((tr) =>
        [...tr.children]
          .map((td) => {
            const t = (td.textContent || "").trim().replace(/"/g, '""');
            return `"${t}"`;
          })
          .join(";")
      )
      .join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // --- main render ---
  function renderContent() {
    const el = document.getElementById("content");
    if (active === "overview") el.innerHTML = renderOverview();
    else if (active === "partners") {
      el.innerHTML = renderPartners();
      wirePartners();
    } else {
      el.innerHTML = renderPlanFact();
      wirePlanFact();
    }
  }

  renderNav();
  renderFilter();
  renderContent();
})();
