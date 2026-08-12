# Portable Dashboard Kit

Config-driven, **portable** HTML/JS dashboard patterns extracted from real production sales analytics systems.

> Goal: share a clean, self-contained view — not a heavy platform dump.

All examples use **synthetic data only**. No company data.

## Demos

### 1. Production-parity synthetic (recommended)

Full UI from a real multi-tab sales command system (Overview, Reps, Brands, Partners, Monthly Plan, Counties/map, Assumptions), with:

- global week + month filters
- RAG attainment badges
- drill-downs, cross-tab navigation
- sortable tables + CSV export
- split-screen filtered views

**Data:** partner names, reps, brands and figures are fully scrambled / synthetic. Company branding removed.

Place the cleaned single-file demo at:

```
examples/production-parity/sales-command-demo.html
```

(Generate/refresh via the anonymization pipeline from a local production build — never commit real ERP data.)

### 2. Lightweight synthetic (v0.2)

```
examples/synthetic-sales/index.html
```

Smaller 3-tab demo for quick viewing without the large embedded dataset.

Preview helpers (until Pages is on):

- https://htmlpreview.github.io/?https://github.com/TakeMyCodem/portable-dashboard-kit/blob/main/examples/synthetic-sales/index.html

## Core ideas (from production)

| Principle | Why it matters |
|-----------|----------------|
| **Per-tab data contract** | Each tab declares exactly what data it needs. The assembler only ships that. |
| **No fork for variants** | Variants = tab list + data scope, not code forks. |
| **Portable output** | One HTML (or small set) — offline / any static host. |
| **Human-in-the-Loop** | Numbers support judgment; commercial discretion stays possible. |

## Status

✅ Lightweight synthetic demo  
✅ Production-parity anonymization pipeline (local → public HTML)  
🚧 Formal contract modules + assembler sketch in `src/`

---

MIT · Synthetic data only · No company data
