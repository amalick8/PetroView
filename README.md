# PetroView

**AI-powered energy intelligence and predictive analytics platform for global oil markets.**

PetroView is now a full-stack product with a FastAPI backend, PostgreSQL persistence, and a premium Next.js analytics UI.

## Architecture

- **Frontend:** Next.js (App Router), TypeScript, Tailwind, Framer Motion, Recharts
- **Backend:** FastAPI, SQLModel, pandas, statsmodels, scikit-learn, nbformat
- **Data Sources:** FRED (WTI spot price) and OWID energy data

## Repository Structure

```
PetroView/
├── backend/
│   ├── app/
│   ├── data/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── .env.example
└── README.md
```

## Backend Quickstart

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## Frontend Quickstart

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Core Features

- Real-world data ingestion (WTI pricing + OWID supply)
- Cleaning, validation, and structured storage
- Statistical analysis and supply shock detection
- Multi-model forecasting (naive, regression, ARIMA)
- Notebook report generation
- Premium analytics UI for dashboards and reports

## Next Steps

- Add Clerk auth wiring in frontend
- Configure database migrations with Alembic
- Connect frontend charts to live API data