# PetroView

**Energy intelligence and predictive analytics for global oil markets.**

PetroView is a full-stack platform that ingests real-world energy data, analyzes market dynamics, and produces forecasts and reports through a modern analytics UI.

## What is included

- FastAPI backend for data ingestion, analysis, and forecasting
- Next.js frontend for dashboards, reports, and market insights
- Data utilities, notebooks, and model pipelines for experimentation

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