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