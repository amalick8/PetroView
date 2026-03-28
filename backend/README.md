# PetroView Backend

FastAPI service for data ingestion, analytics, forecasting, and notebook generation.

## Quickstart

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Configure environment variables:

```bash
cp .env.example .env
```

3. Run the API:

```bash
uvicorn app.main:app --reload
```
