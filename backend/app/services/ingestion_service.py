from datetime import datetime
from typing import Dict

import pandas as pd

from app.core.config import settings
from app.utils.dataframe import normalize_columns
from app.utils.storage import write_text


def fetch_wti_prices() -> Dict[str, str]:
    df = pd.read_csv(settings.fred_wti_url)
    df = normalize_columns(df)
    df = df.rename(columns={"date": "date", "dcoilwtico": "price"})
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["date"]).sort_values("date")
    filename = f"wti_prices_{datetime.utcnow().date()}.csv"
    path = write_text(df.to_csv(index=False), filename)
    return {"path": str(path), "rows": str(len(df))}


def fetch_owid_energy() -> Dict[str, str]:
    df = pd.read_csv(settings.owid_energy_url)
    df = normalize_columns(df)
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    filename = f"owid_energy_{datetime.utcnow().date()}.csv"
    path = write_text(df.to_csv(index=False), filename)
    return {"path": str(path), "rows": str(len(df))}


def ingest_sources() -> Dict[str, Dict[str, str]]:
    return {"wti_prices": fetch_wti_prices(), "owid_energy": fetch_owid_energy()}
