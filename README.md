# PetroView

**Global energy intelligence for a volatile world.**

PetroView is a full-stack platform that turns global oil market signals into clear, decision-grade context. It blends time series data, macro indicators, and market structure analytics to help teams understand what is changing, where pressure is building, and why it matters. The focus is on narrative clarity and cross-region visibility, not just charts.

## Purpose

Oil is still the backbone of modern energy systems. It powers transportation, anchors petrochemical supply chains, and influences inflation, trade balances, and national security. When prices move or supply is disrupted, the effects ripple across industries and regions.

PetroView exists to make those dynamics visible and actionable. It is built for analysts, operators, and decision makers who need a consistent, global view of the market with enough context to interpret shifts confidently.

## Global conflicts and market risk

Oil markets are shaped by events far beyond supply and demand curves. PetroView is designed to surface those pressures at a high level, including:

- **Geopolitical conflicts and sanctions** that disrupt exports, reroute flows, and change pricing power.
- **Shipping chokepoints and maritime risk** that impact transit times and regional inventory.
- **Regional instability and infrastructure outages** that shift production and storage capacity.
- **Policy shifts and strategic releases** that compress or amplify volatility.

The goal is to make conflict-driven dynamics visible and comparable across time so users can connect events to price behavior and risk regimes.

## What PetroView delivers

- A consistent pipeline for ingesting and validating oil market data
- Analytics and forecasting workflows for price, volatility, and regime shifts
- Dashboards, reports, and narrative summaries for decision support
- A modular foundation for expanding data sources and models

## Key capabilities

- Time series ingestion, normalization, and validation
- Supply, demand, and pricing signal analysis
- Multi-model forecasting (naive, regression, ARIMA)
- Regime and volatility tracking
- Interactive dashboards and report generation

## Real-world indicators (since 2023-10-07)

The conflict escalation in the region in early October 2023 coincided with renewed volatility across energy and risk assets. Below is a high-level snapshot using public data series as proxies:

- **US regular gasoline price (weekly):** $3.68 on 2023-10-09 to $3.96 on 2026-03-23 ($+7.52%)
- **S&P 500 (daily):** 4,335.66 on 2023-10-09 to 6,368.85 on 2026-03-27 ($+46.89%)

**US regular gasoline ($/gal, quarterly snapshot)**

| Date | US Regular Gas ($/gal) |
| --- | --- |
| 2023-10-30 | 3.47 |
| 2024-01-29 | 3.10 |
| 2024-04-29 | 3.65 |
| 2024-07-29 | 3.48 |
| 2024-10-28 | 3.10 |
| 2025-01-27 | 3.10 |
| 2025-04-28 | 3.13 |
| 2025-07-28 | 3.12 |
| 2025-10-27 | 3.04 |
| 2026-01-26 | 2.85 |

```mermaid
xychart-beta
	title 'US Regular Gasoline (last 12 months)' 
	x-axis [2025-04, 2025-05, 2025-06, 2025-07, 2025-08, 2025-09, 2025-10, 2025-11, 2025-12, 2026-01, 2026-02, 2026-03]
	y-axis 'Value' 
	line [3.13, 3.16, 3.16, 3.12, 3.15, 3.12, 3.04, 3.06, 2.81, 2.85, 2.94, 3.96]
```

**S&P 500 (quarterly snapshot)**

| Date | S&P 500 |
| --- | --- |
| 2023-10-31 | 4193.80 |
| 2024-01-31 | 4845.65 |
| 2024-04-30 | 5035.69 |
| 2024-07-31 | 5522.30 |
| 2024-10-31 | 5705.45 |
| 2025-01-31 | 6040.53 |
| 2025-04-30 | 5569.06 |
| 2025-07-31 | 6339.39 |
| 2025-10-31 | 6840.20 |
| 2026-01-30 | 6939.03 |

```mermaid
xychart-beta
	title 'S&P 500 (last 12 months)' 
	x-axis [2025-04, 2025-05, 2025-06, 2025-07, 2025-08, 2025-09, 2025-10, 2025-11, 2025-12, 2026-01, 2026-02, 2026-03]
	y-axis 'Value' 
	line [5569.06, 5911.69, 6204.95, 6339.39, 6460.26, 6688.46, 6840.20, 6849.09, 6845.50, 6939.03, 6878.88, 6368.85]
```

Data source: FRED (GASREGW, SP500). Values are snapshots pulled on 2026-03-28.

## Architecture at a glance

- **Frontend:** Next.js (App Router), TypeScript, Tailwind, Recharts
- **Backend:** FastAPI, SQLModel, pandas, statsmodels, scikit-learn
- **Data sources:** FRED (WTI spot price) and OWID energy data

## Repository layout

```
PetroView/
├── backend/   # API, data pipelines, ML, and services
├── frontend/  # Web UI
├── oilwatch/  # Local data and notebooks
└── README.md
```

## Getting started

Follow the README files inside each app for environment setup and run commands:

- Backend: [backend/README.md](backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)

## Scope and intent

PetroView is designed as a living research environment. Keep changes focused on reproducibility, clear assumptions, and traceable data lineage so insights can be tied back to sources and methodology.