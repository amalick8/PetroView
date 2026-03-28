# PetroView

**Global energy intelligence and predictive analytics for the oil market.**

PetroView is a full-stack platform that turns raw, real-world energy signals into usable market intelligence. It ingests global oil indicators, normalizes and validates time series, runs statistical analysis and forecasting pipelines, and presents results through a modern analytics UI. The goal is not just charts, but decision-grade context that connects price, production, demand, and macro conditions across regions and time.

## Why this project matters (global scope)

Oil is still the backbone of modern energy systems. It powers transportation, underpins petrochemical supply chains, and influences inflation, trade balances, and national security. Price shocks ripple through economies, and supply disruptions can alter industrial output worldwide. That makes transparent, timely energy analytics a public and private priority.

PetroView is designed to operate at this global scale. It focuses on:

- **Cross-region visibility.** Production and price signals are not local. A supply change in one region can drive global price movements within days.
- **Policy and macro context.** Oil is intertwined with inflation, interest rates, and trade flows. The platform places market shifts in macroeconomic context.
- **Risk awareness.** Supply shocks, demand contractions, and geopolitical events can change market regimes quickly. Forecasting needs to be robust and explainable.
- **Accessible intelligence.** Analysts, operators, and decision makers need consistent, comparable datasets and a shared view of the market.

This is why PetroView prioritizes data quality, reproducible analysis, and a clear narrative around what is changing and why. It is intended to be a trusted lens on the global oil market, rather than a single model output.

## What is included

- FastAPI backend for data ingestion, analysis, and forecasting
- Next.js frontend for dashboards, reports, and market insights
- Data utilities, notebooks, and model pipelines for experimentation
- Structured schemas and services to keep analytics consistent across the stack

## High-level architecture

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

## Key capabilities

- Data ingestion and validation for market time series
- Statistical analysis and supply shock detection
- Multi-model forecasting (naive, regression, ARIMA)
- Notebook report generation
- Interactive dashboards and reports

## Scope and intent

PetroView is built to be a living research and analytics environment. It is intentionally structured to support:

- **Global market tracking** with consistent data pipelines
- **Explainable modeling** that emphasizes transparency over black-box outputs
- **Operational decision support** for scenario planning and risk assessment
- **Iterative research** through notebooks and extensible services

If you are extending the project, keep the focus on reproducibility, clear assumptions, and traceable data lineage. The platform is most useful when each insight can be tracked back to its sources and methodology.