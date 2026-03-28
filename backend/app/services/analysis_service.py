from typing import Any, Dict, List, Tuple, Union

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


def supply_concentration(df_supply: pd.DataFrame, metric: str) -> Dict[str, Any]:
    latest_year = int(df_supply["year"].max())
    latest = df_supply[df_supply["year"] == latest_year]
    latest = latest.dropna(subset=[metric])
    latest_group = latest.groupby("country")[metric].sum().sort_values(ascending=False)
    total = float(latest_group.sum())
    shares = (latest_group / total).fillna(0.0)
    hhi = float((shares**2).sum())
    top_country = str(latest_group.index[0]) if len(latest_group) else "Unknown"
    return {"year": float(latest_year), "hhi": hhi, "top_country": top_country}


def _coerce_price_frame(df: pd.DataFrame) -> pd.DataFrame:
    df = normalize_columns(df)
    if "date" not in df.columns:
        raise ValueError("Missing date column in price data")

    df = df.copy()
    if "price" not in df.columns:
        if "value" in df.columns:
            df = df.rename(columns={"value": "price"})
        elif "dcoilwtico" in df.columns:
            df = df.rename(columns={"dcoilwtico": "price"})

    if "price" not in df.columns:
        numeric_cols = df.select_dtypes(include=["number"]).columns.tolist()
        if not numeric_cols:
            raise ValueError("Missing price column in price data")
        df = df.rename(columns={numeric_cols[0]: "price"})

    df = df[["date", "price"]].copy()
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["date"]).sort_values("date")

    df["price"] = df["price"].interpolate(limit_direction="both")
    df["price"] = df["price"].ffill().bfill()
    return df


def run_full_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    df_norm = normalize_columns(df)
    df_clean = _coerce_price_frame(df_norm)

    df_clean = df_clean.dropna(subset=["price"]).copy()
    df_clean = df_clean.drop_duplicates(subset=["date"]).sort_values("date")
    df_clean = df_clean.set_index("date")

    pct_change = df_clean["price"].pct_change().replace([np.inf, -np.inf], np.nan)
    rolling_mean_7d = df_clean["price"].rolling(7).mean()
    rolling_mean_30d = df_clean["price"].rolling(30).mean()
    rolling_std_7d = df_clean["price"].rolling(7).std()
    rolling_std_30d = df_clean["price"].rolling(30).std()
    volatility_7d = rolling_volatility(df_clean["price"], window=7)
    volatility_30d = rolling_volatility(df_clean["price"], window=30)

    numeric_cols = df_norm.select_dtypes(include=["number"]).columns.tolist()
    correlation = None
    if len(numeric_cols) >= 2:
        corr_df = df_norm[numeric_cols].corr().fillna(0.0)
        correlation = {col: {k: float(v) for k, v in row.items()} for col, row in corr_df.to_dict().items()}

    dates = [d.strftime("%Y-%m-%d") for d in df_clean.index]
    analysis_payload = {
        "summary": {
            "rows": int(len(df_clean)),
            "start_date": dates[0] if dates else None,
            "end_date": dates[-1] if dates else None,
            "missing": summarize_missing(df_clean.reset_index()),
        },
        "series": {
            "dates": dates,
            "price": [float(v) for v in df_clean["price"].values],
            "pct_change": [None if pd.isna(v) else float(v) for v in pct_change.values],
            "rolling_mean_7d": [None if pd.isna(v) else float(v) for v in rolling_mean_7d.values],
            "rolling_mean_30d": [None if pd.isna(v) else float(v) for v in rolling_mean_30d.values],
            "rolling_std_7d": [None if pd.isna(v) else float(v) for v in rolling_std_7d.values],
            "rolling_std_30d": [None if pd.isna(v) else float(v) for v in rolling_std_30d.values],
            "volatility_7d": [None if pd.isna(v) else float(v) for v in volatility_7d.values],
            "volatility_30d": [None if pd.isna(v) else float(v) for v in volatility_30d.values],
        },
    }
    if correlation is not None:
        analysis_payload["correlation"] = correlation

    return analysis_payload


def detect_supply_shocks(
    data: Union[pd.DataFrame, pd.Series],
    threshold_pct: float = -0.05,
    zscore_threshold: float = 2.0,
) -> List[Dict[str, Any]]:
    if isinstance(data, pd.Series):
        series = data.copy()
        index = series.index
    else:
        df_clean = _coerce_price_frame(data)
        df_clean = df_clean.dropna(subset=["price"]).sort_values("date")
        series = df_clean.set_index("date")["price"]
        index = series.index

    pct_change = series.pct_change().replace([np.inf, -np.inf], np.nan)
    mean = float(pct_change.mean()) if pct_change.notna().any() else 0.0
    std = float(pct_change.std()) if pct_change.notna().any() else 0.0
    if std > 0:
        zscores = (pct_change - mean) / std
    else:
        zscores = pct_change * 0.0

    shock_mask = (pct_change <= threshold_pct) | (zscores <= -abs(zscore_threshold))
    shocks = []
    for idx in index[shock_mask.fillna(False)]:
        prev_value = series.shift(1).loc[idx]
        curr_value = series.loc[idx]
        drop_value = curr_value - prev_value if pd.notna(prev_value) else np.nan
        shock_date = idx.strftime("%Y-%m-%d") if isinstance(idx, pd.Timestamp) else str(idx)
        shocks.append(
            {
                "date": shock_date,
                "pct_change": float(pct_change.loc[idx]) if pd.notna(pct_change.loc[idx]) else 0.0,
                "zscore": float(zscores.loc[idx]) if pd.notna(zscores.loc[idx]) else 0.0,
                "drop_magnitude": float(abs(drop_value)) if pd.notna(drop_value) else 0.0,
                "value": float(curr_value) if pd.notna(curr_value) else 0.0,
            }
        )
    return shocks


def analyze_prices(df_prices: pd.DataFrame) -> Dict[str, Any]:
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


def build_analysis(price_path: str, supply_path: str) -> Tuple[Dict[str, Any], Dict[str, Any], Dict[str, Any]]:
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
