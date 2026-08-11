# Portable Dashboard Kit

Config-driven, **portable** HTML/JS dashboard patterns extracted from real production sales analytics systems.

> Goal: share a clean, self-contained view — not a heavy platform dump.

This repository contains generalized, anonymized patterns that have proven useful in commercial reporting environments (plan-fact, KPI drill-downs, territory views, etc.). All examples use **synthetic data** only.

## Core ideas

| Principle | Why it matters |
|-----------|----------------|
| **Per-tab data contract** | Each tab declares exactly what data it needs. The assembler only ships that. Prevents data leakage and keeps payloads small. |
| **No fork for variants** | Different business units / views = different tab lists + data scopes, not code forks. |
| **Portable output** | Single HTML (or small set of files) that runs offline or on any static host. No mandatory Power BI / Tableau license. |
| **Human-in-the-Loop friendly** | Designed so commercial judgment can still override pure numbers where needed. |
| **Config over hard-coding** | Months, scopes, thresholds, display rules live in config. |

## Planned structure

```
src/
  core/           # shared utilities (formatting, calendar, config loading)
  assembler/      # builds the final portable HTML from tab fragments + data
  tabs/           # example tabs (overview, plan-fact, drill-down…)
examples/
  synthetic-sales/  # full demo with fake but realistic sales data
docs/
  architecture.md
  adr/            # key decisions in ADR style
```

## Status

🚧 Early extraction phase.  
First concrete module (dashboard shell + one complete tab with synthetic data) is next.

## Inspiration

These patterns come from multi-year work building and refactoring live sales analytics pipelines. The production systems stay private; the reusable architecture decisions and portable techniques live here.

---

MIT (planned) · Synthetic data only · No company data
