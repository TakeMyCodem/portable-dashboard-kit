# Portable Dashboard Kit

Config-driven, **portable** HTML/JS dashboard patterns extracted from real production sales analytics systems.

> Goal: share a clean, self-contained view — not a heavy platform dump.

This repository contains generalized, anonymized patterns that have proven useful in commercial reporting environments (plan-fact, KPI drill-downs, territory views, etc.). All examples use **synthetic data** only.

## Live demo

**[Open the synthetic sales dashboard →](https://takemycodem.github.io/portable-dashboard-kit/examples/synthetic-sales/)**  
*(or open `examples/synthetic-sales/index.html` locally)*

What it shows:
- Overview KPIs (YTD revenue, plan attainment, margin, “ghost money” recovered)
- Plan vs Fact monthly table + bars
- Territory performance
- Top customers

Dark, clean UI. No build step. Works offline once loaded.

## Core ideas

| Principle | Why it matters |
|-----------|----------------|
| **Per-tab data contract** | Each tab declares exactly what data it needs. The assembler only ships that. Prevents data leakage and keeps payloads small. |
| **No fork for variants** | Different business units / views = different tab lists + data scopes, not code forks. |
| **Portable output** | Single HTML (or small set of files) that runs offline or on any static host. No mandatory Power BI / Tableau license. |
| **Human-in-the-Loop friendly** | Designed so commercial judgment can still override pure numbers where needed. |
| **Config over hard-coding** | Months, scopes, thresholds, display rules live in config. |

## Repo structure

```
examples/
  synthetic-sales/     # working demo (open index.html)
src/                   # (next) extractable core + assembler
docs/
  architecture.md
```

## Status

✅ First working portable demo is live  
🚧 Next: formal tab contracts + simple assembler script + more tabs

## Inspiration

These patterns come from multi-year work building and refactoring live sales analytics pipelines. The production systems stay private; the reusable architecture decisions and portable techniques live here.

---

MIT · Synthetic data only · No company data
