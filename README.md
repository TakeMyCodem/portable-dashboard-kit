# Portable Dashboard Kit

Config-driven, **portable** HTML/JS dashboard patterns extracted from real production sales analytics systems.

> Goal: share a clean, self-contained view — not a heavy platform dump.

All examples use **synthetic data only**. No company data.

## Live demo (v0.2)

Open locally:

```
examples/synthetic-sales/index.html
```

Or via preview (until GitHub Pages is enabled):

- https://htmlpreview.github.io/?https://github.com/TakeMyCodem/portable-dashboard-kit/blob/main/examples/synthetic-sales/index.html
- https://raw.githack.com/TakeMyCodem/portable-dashboard-kit/main/examples/synthetic-sales/index.html

### What the demo shows

| Tab | Capabilities |
|-----|----------------|
| **Overview** | KPI cards, plan attainment (RAG), YoY, “ghost money” recovery signal, monthly plan vs actual bars, month-filtered table |
| **Partners** | Search, rep filter, sortable-style table, totals, **brand drill-down** on click, CSV export |
| **Plan vs Fact** | Month filter, plan/actual/Δ/attainment/LY/YoY, totals, CSV export |

Also: global month filter pills, light professional UI, sticky headers, production-style RAG badges.

## Core ideas (from production)

| Principle | Why it matters |
|-----------|----------------|
| **Per-tab data contract** | Each tab declares exactly what data it needs. The assembler only ships that. Prevents data leakage and keeps payloads small. |
| **No fork for variants** | Different business units / views = different tab lists + data scopes, not code forks. |
| **Portable output** | Runs offline or on any static host. No mandatory BI platform license. |
| **Human-in-the-Loop friendly** | Numbers support judgment; commercial discretion stays possible. |
| **Config over hard-coding** | Periods, scopes, thresholds live in data/config. |

In the real systems, contracts are enforced at **build time** (Python assembler validates `REQUIRED_DATA_KEYS` before any HTML is emitted). This demo keeps data local for portability while showing the interaction patterns.

## Repo structure

```
examples/
  synthetic-sales/     # working 3-tab demo (open index.html)
docs/                  # architecture notes (next)
```

## Status

✅ v0.2 — strong synthetic demo (Overview · Partners · Plan vs Fact)  
🚧 Next: formal contract modules + minimal assembler sketch + more tabs if needed

## Inspiration

Patterns come from multi-year work building and refactoring live sales analytics pipelines (plan-fact, territory, partner drill-downs, weekly/monthly filters, integrity recovery). Production systems stay private; reusable architecture and portable techniques live here.

---

MIT · Synthetic data only · No company data
