# PetroView

**Global energy intelligence for a volatile world.**

PetroView is a full-stack platform that turns oil market signals into clear, decision-grade context. It blends time series data, macro indicators, and market structure analytics so teams can understand what is changing, where pressure is building, and why it matters.

**Live demo:** https://petro-view-six.vercel.app/dashboard

## Screenshots

<table>
  <tr>
    <td>
      <img src="screenshots/Screenshot%202026-03-28%20at%207.47.42%E2%80%AFPM.png" width="520" alt="PetroView dashboard screenshot 1" />
    </td>
    <td>
      <img src="screenshots/Screenshot%202026-03-28%20at%207.48.25%E2%80%AFPM.png" width="520" alt="PetroView dashboard screenshot 2" />
    </td>
  </tr>
</table>

## What it does

- Connects global oil signals into a single, coherent view
- Surfaces market structure shifts, risk regimes, and volatility
- Produces dashboards, reports, and narrative summaries for decision support
- Keeps data workflows traceable and reproducible

## Conflict context (high level)

Energy markets have been shaped by escalating Middle East tensions and other recent oil shocks. At a high level:

- Late Feb 2026 saw a major U.S.-Israel strike campaign on Iranian targets followed by Iranian retaliation against regional bases and oil infrastructure.
- Early March 2026 brought a de facto closure of the Strait of Hormuz, disrupting a significant share of global oil and LNG flows.
- Prices spiked above $110–$120 per barrel, prompting a record IEA coordinated release to stabilize markets.
- The escalation followed years of shipping disruptions, failed negotiations around Iran’s nuclear program, and a series of earlier oil conflicts (Russia–Ukraine, 2020 price war).

## Highlights

- Time series ingestion, normalization, and validation
- Supply, demand, and pricing signal analysis
- Multi-model forecasting (naive, regression, ARIMA)
- Regime and volatility tracking
- Interactive dashboards and report generation

## Research notebooks

Jupyter notebooks are included for exploratory analysis and prototyping. They are complementary to the core app and live in [oilwatch/notebooks](oilwatch/notebooks).

## Architecture at a glance

- **Frontend:** Next.js (App Router), TypeScript, Tailwind, Recharts
- **Backend:** FastAPI, SQLModel, pandas, statsmodels, scikit-learn
- **Data sources:** FRED and OWID energy data

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

PetroView is a living research environment. Keep changes focused on reproducibility, clear assumptions, and traceable data lineage.