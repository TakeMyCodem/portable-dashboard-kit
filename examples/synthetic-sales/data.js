// Synthetic sales data only — no real company data.
window.DASHBOARD_DATA = {
  meta: {
    title: "Sales Command",
    period: "YTD 2026",
    currency: "HUF",
    lastUpdated: "2026-08-11"
  },

  kpis: {
    revenueYtd: 1_845_600_000,
    revenuePlan: 1_920_000_000,
    marginPct: 0.312,
    orders: 4280,
    avgOrder: 431_215,
    ghostRecovered: 94_500_000
  },

  planFact: [
    { month: "Jan", plan: 145, actual: 138, label: "Jan" },
    { month: "Feb", plan: 150, actual: 149, label: "Feb" },
    { month: "Mar", plan: 160, actual: 171, label: "Mar" },
    { month: "Apr", plan: 155, actual: 152, label: "Apr" },
    { month: "May", plan: 165, actual: 168, label: "May" },
    { month: "Jun", plan: 170, actual: 159, label: "Jun" },
    { month: "Jul", plan: 175, actual: 182, label: "Jul" }
  ],

  territories: [
    { name: "Central", revenue: 612.4, plan: 640, share: 0.332 },
    { name: "West", revenue: 489.1, plan: 470, share: 0.265 },
    { name: "East", revenue: 401.8, plan: 430, share: 0.218 },
    { name: "South", revenue: 342.3, plan: 380, share: 0.185 }
  ],

  topCustomers: [
    { name: "AquaTrade Kft.", revenue: 86.2, orders: 42, margin: 0.29 },
    { name: "Nordic Catch Zrt.", revenue: 71.5, orders: 31, margin: 0.34 },
    { name: "Dunai Horgász Bt.", revenue: 58.9, orders: 67, margin: 0.27 },
    { name: "LakeSide Pro", revenue: 54.1, orders: 28, margin: 0.31 },
    { name: "RiverGear HU", revenue: 49.7, orders: 55, margin: 0.25 }
  ]
};
