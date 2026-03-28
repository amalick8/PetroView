from typing import Dict, List, Tuple

import numpy as np
import pandas as pd

from app.utils.dataframe import normalize_columns, rolling_volatility, summarize_missing


def get_supply_metric(df_supply: pd.DataFrame) -> str:
    candidates = [
        "oil_production",
        "oil_production_per_day",
        "oil_prod",
        "oil_production_mt",
    ]
    for col in candidates:
        if col in df_supply.columns:
            return col
    raise ValueError("No supply production metric found")


def load_prices(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    df = normalize_columns(df)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["date", "price"]).sort_values("date")
    return df


def load_supply(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    df = normalize_columns(df)
    df = df.dropna(subset=["year", "country"]).copy()
    return df


def supply_concentration(df_supply: pd.DataFrame, metric: str) -> Dict[str, float]:
    latest_year = int(df_supply["year"].max())
    latest = df_supply[df_supply["year"] == latest_year]
    latest = latest.dropna(subset=[metric])
    latest_group = latest.groupby("country")[metric].sum().sort_values(ascending=False)
    total = float(latest_group.sum())
    shares = (latest_group / total).fillna(0.0)
    hhi = float((shares**2).sum())
    top_country = str(latest_group.index[0]) if len(latest_group) else "Unknown"
    return {"year": float(latest_year), "hhi": hhi, "top_country": top_country}


def detect_supply_shocks(series: pd.Series, threshold_pct: float = -0.1) -> List[Dict[str, float]]:
    pct_change = series.pct_change()
    shock_idx = pct_change[pct_change <= threshold_pct].index
    shocks = []
    for idx in shock_idx:
        shocks.append(
            {
                "year": float(idx),
                "pct_change": float(pct_change.loc[idx]),
                "value": float(series.loc[idx]),
            }
        )
    return shocks


def analyze_prices(df_prices: pd.DataFrame) -> Dict[str, Dict]:
    metrics = {
        "min": float(df_prices["price"].min()),
        "max": float(df_prices["price"].max()),
        "mean": float(df_prices["price"].mean()),
        "median": float(df_prices["price"].median()),
        "std": float(df_prices["price"].std()),
    }
    df_prices["rolling_30d"] = df_prices["price"].rolling(30).mean()
    df_prices["volatility_30d"] = rolling_volatility(df_prices["price"], window=30)
    recent = df_prices.tail(30)
    price_change_pct_30d = float((recent["price"].iloc[-1] / recent["price"].iloc[0]) - 1)
    return {
        "metrics": metrics,
        "price_change_pct_30d": price_change_pct_30d,
        "volatility_30d": float(recent["volatility_30d"].mean()),
        "missing": summarize_missing(df_prices),
    }


def build_analysis(price_path: str, supply_path: str) -> Tuple[Dict, Dict, Dict]:
    df_prices = load_prices(price_path)
    df_supply = load_supply(supply_path)

    metric = get_supply_metric(df_supply)
    supply_yearly = df_supply.groupby("year")[metric].sum().sort_index()

    price_summary = analyze_prices(df_prices)
    concentration = supply_concentration(df_supply, metric)

    shocks = detect_supply_shocks(supply_yearly.fillna(0))

    metrics_payload = {
        "price": price_summary,
        "supply_concentration": concentration,
    }
    shocks_payload = {"supply_shocks": shocks}

    insight_payload = {
        "latest_price": float(df_prices["price"].iloc[-1]),
        "price_trend_30d": price_summary["price_change_pct_30d"],
        "volatility_30d": price_summary["volatility_30d"],
        "top_supply_country": concentration["top_country"],
        "supply_hhi": concentration["hhi"],
    }

    return insight_payload, shocks_payload, metrics_payload
