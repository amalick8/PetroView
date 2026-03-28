from __future__ import annotations

from pathlib import Path
from typing import Optional
import os

import httpx
import pandas as pd

from app.core.config import settings
from app.utils.dataframe import normalize_columns

FRED_SERIES_ID = "DCOILWTICO"
FRED_OBSERVATIONS_URL = "https://api.stlouisfed.org/fred/series/observations"


def _load_local_csv() -> Optional[pd.DataFrame]:
    data_dir_path = Path(settings.data_dir)
    candidates = [
        data_dir_path / "oil_prices.csv",
        data_dir_path / "wti_prices.csv",
    ]
    repo_root = Path(__file__).resolve().parents[3]
    candidates.append(repo_root / "oilwatch" / "data" / "oil_prices.csv")

    for path in candidates:
        if path.exists():
            return pd.read_csv(path)
    return None


def _fetch_fred_api(series_id: str, api_key: str) -> pd.DataFrame:
    params = {
        "series_id": series_id,
        "api_key": api_key,
        "file_type": "json",
    }
    response = httpx.get(FRED_OBSERVATIONS_URL, params=params, timeout=30)
    response.raise_for_status()
    payload = response.json()
    observations = payload.get("observations", [])
    df = pd.DataFrame(observations)
    if df.empty:
        return df
    df = df.rename(columns={"date": "date", "value": "price"})
    return df.loc[:, ["date", "price"]].copy()


def _fetch_fred_csv(series_id: str) -> pd.DataFrame:
    if series_id == FRED_SERIES_ID:
        df = pd.read_csv(settings.fred_wti_url)
    else:
        url = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}"
        df = pd.read_csv(url)
    return df


def _clean_price_df(df: pd.DataFrame) -> pd.DataFrame:
    df = normalize_columns(df)
    if "value" in df.columns and "price" not in df.columns:
        df = df.rename(columns={"value": "price"})
    if "dcoilwtico" in df.columns and "price" not in df.columns:
        df = df.rename(columns={"dcoilwtico": "price"})

    if "date" not in df.columns:
        raise ValueError("Missing date column in price data")
    if "price" not in df.columns:
        numeric_cols = df.select_dtypes(include=["number"]).columns.tolist()
        if not numeric_cols:
            raise ValueError("Missing price column in price data")
        df = df.rename(columns={numeric_cols[0]: "price"})

    df = df.loc[:, ["date", "price"]].copy()
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["date"]).sort_values("date")

    df["price"] = df["price"].interpolate(limit_direction="both")
    df["price"] = df["price"].ffill().bfill()
    return df


def fetch_oil_price_data(series_id: str = FRED_SERIES_ID) -> pd.DataFrame:
    api_key = os.getenv("FRED_API_KEY", "").strip()

    df_raw: Optional[pd.DataFrame] = None
    if api_key:
        df_raw = _fetch_fred_api(series_id, api_key)

    if df_raw is None or df_raw.empty:
        local_df = _load_local_csv()
        if local_df is not None:
            df_raw = local_df
        else:
            df_raw = _fetch_fred_csv(series_id)

    cleaned = _clean_price_df(df_raw)
    return cleaned
