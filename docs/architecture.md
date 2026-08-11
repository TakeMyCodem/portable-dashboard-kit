# Architecture Overview

## High-level flow

```
Config + Tab contracts
        ↓
   Data loaders (synthetic or real)
        ↓
   Per-tab data preparation
        ↓
   Assembler
        ↓
Portable HTML (or HTML + assets)
```

## Key concepts

### Tab contract
Each tab declares:
- which data slices it needs
- expected shape / keys
- optional display config

The assembler refuses to ship data that was not requested. This is the main protection against accidental data leakage and bloated payloads.

### Assembler
Takes:
- shell template
- list of active tabs
- the data bundles that satisfy each tab’s contract

Produces a single self-contained (or nearly self-contained) HTML file.

### Why portable
Many commercial teams still live in Excel + email. A dashboard that opens in any browser, works offline, and needs zero platform license removes friction and speeds adoption.

## Next concrete step

1. Minimal shell + one tab (Overview / Plan-Fact style)
2. Synthetic sales dataset
3. Working `build` script that outputs a demo HTML
