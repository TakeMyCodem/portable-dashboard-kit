(function () {
  const data = window.DASHBOARD_DATA;
  const tabsEl = document.getElementById("tabs");
  const contentEl = document.getElementById("content");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "planfact", label: "Plan vs Fact" },
    { id: "territory", label: "Territory" },
    { id: "customers", label: "Top Customers" }
  ];

  let active = "overview";

  function formatHUF(n) {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + " Mrd";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + " M";
    return Math.round(n).toLocaleString("hu-HU");
  }

  function formatPct(p) {
    return (p * 100).toFixed(1) + "%";
  }

  function deltaClass(actual, plan) {
    const d = (actual - plan) / plan;
    if (d > 0.01) return "up";
    if (d < -0.01) return "down";
    return "flat";
  }

  function deltaText(actual, plan) {
    const d = ((actual - plan) / plan) * 100;
    const sign = d > 0 ? "+" : "";
    return sign + d.toFixed(1) + "% vs plan";
  }

  function renderTabs() {
    tabsEl.innerHTML = tabs
      .map(
        (t) =>
          `<button class="tab ${t.id === active ? "active" : ""}" data-id="${t.id}">${t.label}</button>`
      )
      .join("");

    tabsEl.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        active = btn.dataset.id;
        renderTabs();
        renderContent();
      });
    });
  }

  function renderOverview() {
    const k = data.kpis;
    const attainment = k.revenueYtd / k.revenuePlan;

    return `
      <div class="grid grid-4">
        <div class="card">
          <h3>Revenue YTD</h3>
          <div class="kpi">${formatHUF(k.revenueYtd)}</div>
          <div class="kpi-sub">
            <span class="delta ${deltaClass(k.revenueYtd, k.revenuePlan)}">
              ${deltaText(k.revenueYtd, k.revenuePlan)}
            </span>
          </div>
        </div>
        <div class="card">
          <h3>Plan attainment</h3>
          <div class="kpi">${formatPct(attainment)}</div>
          <div class="kpi-sub">Plan: ${formatHUF(k.revenuePlan)}</div>
        </div>
        <div class="card">
          <h3>Gross margin</h3>
          <div class="kpi">${formatPct(k.marginPct)}</div>
          <div class="kpi-sub">Orders: ${k.orders.toLocaleString("hu-HU")}</div>
        </div>
        <div class="card">
          <h3>Ghost money recovered</h3>
          <div class="kpi">${formatHUF(k.ghostRecovered)}</div>
          <div class="kpi-sub">via ffill / integrity fixes</div>
        </div>
      </div>

      <div class="section-title">Monthly pulse (plan vs actual, M HUF)</div>
      <div class="card">
        ${data.planFact
          .map((m) => {
            const max = Math.max(...data.planFact.map((x) => Math.max(x.plan, x.actual)));
            const pct = (m.actual / max) * 100;
            return `
              <div class="bar-row">
                <div class="bar-label">${m.label}</div>
                <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
                <div class="bar-value">${m.actual} / ${m.plan}</div>
              </div>`;
          })
          .join("")}
      </div>
    `;
  }

  function renderPlanFact() {
    return `
      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th class="num">Plan (M)</th>
              <th class="num">Actual (M)</th>
              <th class="num">Δ</th>
              <th class="num">Attainment</th>
            </tr>
          </thead>
          <tbody>
            ${data.planFact
              .map((m) => {
                const att = m.actual / m.plan;
                const d = m.actual - m.plan;
                const cls = d > 0 ? "up" : d < 0 ? "down" : "flat";
                return `
                  <tr>
                    <td>${m.label}</td>
                    <td class="num">${m.plan}</td>
                    <td class="num">${m.actual}</td>
                    <td class="num"><span class="delta ${cls}">${d > 0 ? "+" : ""}${d}</span></td>
                    <td class="num">${formatPct(att)}</td>
                  </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>
      <p style="margin-top:14px;color:var(--muted);font-size:0.85rem">
        Pattern note: each tab only consumes the slices it declares. This demo keeps data local for portability.
      </p>
    `;
  }

  function renderTerritory() {
    const maxRev = Math.max(...data.territories.map((t) => t.revenue));
    return `
      <div class="grid grid-2">
        <div class="card">
          <h3 style="margin-bottom:14px">Revenue by territory (M HUF)</h3>
          ${data.territories
            .map((t) => {
              const pct = (t.revenue / maxRev) * 100;
              return `
                <div class="bar-row">
                  <div class="bar-label">${t.name}</div>
                  <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
                  <div class="bar-value">${t.revenue.toFixed(1)}</div>
                </div>`;
            })
            .join("")}
        </div>
        <div class="card">
          <table>
            <thead>
              <tr>
                <th>Territory</th>
                <th class="num">Revenue</th>
                <th class="num">Plan</th>
                <th class="num">vs Plan</th>
                <th class="num">Share</th>
              </tr>
            </thead>
            <tbody>
              ${data.territories
                .map((t) => {
                  const cls = deltaClass(t.revenue, t.plan);
                  return `
                    <tr>
                      <td>${t.name}</td>
                      <td class="num">${t.revenue.toFixed(1)}</td>
                      <td class="num">${t.plan}</td>
                      <td class="num"><span class="delta ${cls}">${deltaText(t.revenue, t.plan)}</span></td>
                      <td class="num">${formatPct(t.share)}</td>
                    </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderCustomers() {
    return `
      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th class="num">Revenue (M)</th>
              <th class="num">Orders</th>
              <th class="num">Margin</th>
            </tr>
          </thead>
          <tbody>
            ${data.topCustomers
              .map(
                (c) => `
              <tr>
                <td>${c.name}</td>
                <td class="num">${c.revenue.toFixed(1)}</td>
                <td class="num">${c.orders}</td>
                <td class="num">${formatPct(c.margin)}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <p style="margin-top:14px;color:var(--muted);font-size:0.85rem">
        Synthetic names only. In production this slice would come from a customer-affinity / revenue contract.
      </p>
    `;
  }

  function renderContent() {
    const map = {
      overview: renderOverview,
      planfact: renderPlanFact,
      territory: renderTerritory,
      customers: renderCustomers
    };
    contentEl.innerHTML = map[active]();
  }

  renderTabs();
  renderContent();
})();
