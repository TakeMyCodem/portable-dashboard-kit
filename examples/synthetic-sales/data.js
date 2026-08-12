// Fully synthetic data. No real company, customer, or financial data.
window.DASHBOARD = {
  meta: {
    title: "Sales Command",
    period: "YTD 2026",
    currency: "HUF",
    asOf: "2026-08-10",
    actMonths: 7,
    note: "Synthetic dataset for architecture demonstration only"
  },

  // Overview KPIs (millions HUF where noted)
  kpis: {
    revenueYtd: 1845.6,       // M HUF
    revenuePlanYtd: 1920.0,
    revenueFullYearPlan: 3200.0,
    marginPct: 0.312,
    orders: 4280,
    avgOrder: 0.431,          // M HUF
    ghostRecovered: 94.5,     // M HUF — integrity / ffill recovery pattern
    yoyPct: 0.087,
    expectedArrival: 3010.0
  },

  monthly: [
    { m: 1, label: "Jan", plan: 145, actual: 138, ly: 129 },
    { m: 2, label: "Feb", plan: 150, actual: 149, ly: 141 },
    { m: 3, label: "Mar", plan: 160, actual: 171, ly: 152 },
    { m: 4, label: "Apr", plan: 155, actual: 152, ly: 148 },
    { m: 5, label: "May", plan: 165, actual: 168, ly: 155 },
    { m: 6, label: "Jun", plan: 170, actual: 159, ly: 162 },
    { m: 7, label: "Jul", plan: 175, actual: 182, ly: 170 },
    { m: 8, label: "Aug", plan: 180, actual: null, ly: 175 },
    { m: 9, label: "Sep", plan: 190, actual: null, ly: 182 },
    { m: 10, label: "Oct", plan: 200, actual: null, ly: 195 },
    { m: 11, label: "Nov", plan: 210, actual: null, ly: 205 },
    { m: 12, label: "Dec", plan: 300, actual: null, ly: 280 }
  ],

  // Synthetic partners (fake distribution / trade names)
  partners: [
    { id: "P001", name: "Nordic Catch Zrt.", rep: "HIM", region: "Central", revenue: 86.2, plan: 90.0, orders: 42, margin: 0.34 },
    { id: "P002", name: "AquaTrade Kft.", rep: "KOV", region: "West", revenue: 71.5, plan: 68.0, orders: 31, margin: 0.29 },
    { id: "P003", name: "Dunai Horgász Bt.", rep: "HIM", region: "Central", revenue: 58.9, plan: 62.0, orders: 67, margin: 0.27 },
    { id: "P004", name: "LakeSide Pro", rep: "NAG", region: "East", revenue: 54.1, plan: 50.0, orders: 28, margin: 0.31 },
    { id: "P005", name: "RiverGear HU", rep: "KOV", region: "West", revenue: 49.7, plan: 55.0, orders: 55, margin: 0.25 },
    { id: "P006", name: "Balaton Tackle", rep: "SZAB", region: "South", revenue: 44.3, plan: 48.0, orders: 39, margin: 0.28 },
    { id: "P007", name: "Tisza Angling Co.", rep: "NAG", region: "East", revenue: 41.8, plan: 40.0, orders: 22, margin: 0.33 },
    { id: "P008", name: "CarpMaster Kft.", rep: "HIM", region: "Central", revenue: 38.6, plan: 42.0, orders: 48, margin: 0.26 },
    { id: "P009", name: "Predator Line Zrt.", rep: "SZAB", region: "South", revenue: 35.2, plan: 36.0, orders: 19, margin: 0.30 },
    { id: "P010", name: "Feeder Point", rep: "KOV", region: "West", revenue: 31.9, plan: 35.0, orders: 61, margin: 0.24 },
    { id: "P011", name: "Spin & Cast Bt.", rep: "NAG", region: "East", revenue: 28.4, plan: 30.0, orders: 33, margin: 0.27 },
    { id: "P012", name: "DeepWater Supply", rep: "SZAB", region: "South", revenue: 24.7, plan: 28.0, orders: 17, margin: 0.32 }
  ],

  reps: [
    { code: "HIM", name: "Halmos M." },
    { code: "KOV", name: "Kovács A." },
    { code: "NAG", name: "Nagy P." },
    { code: "SZAB", name: "Szabó L." }
  ],

  // Simple brand rollup for partner drill context
  brandsByPartner: {
    P001: [
      { brand: "RidgeLine", revenue: 32.1 },
      { brand: "AquaPro", revenue: 28.4 },
      { brand: "NordicX", revenue: 25.7 }
    ],
    P002: [
      { brand: "AquaPro", revenue: 41.2 },
      { brand: "CastMaster", revenue: 30.3 }
    ],
    P003: [
      { brand: "RiverKing", revenue: 22.8 },
      { brand: "RidgeLine", revenue: 18.1 },
      { brand: "FeederX", revenue: 18.0 }
    ],
    P004: [
      { brand: "NordicX", revenue: 29.5 },
      { brand: "LakePro", revenue: 24.6 }
    ],
    P005: [
      { brand: "CastMaster", revenue: 27.4 },
      { brand: "RiverKing", revenue: 22.3 }
    ]
  }
};
