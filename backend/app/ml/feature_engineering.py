from __future__ import annotations

from typing import List

import numpy as np
import pandas as pd

from app.utils.dataframe import normalize_columns

FEATURE_COLUMNS = [
    "lag_1",
    "lag_3",
    "lag_7",
    "rolling_mean_7",
    "rolling_mean_30",
    "rolling_std_7",
    "momentum_7",
    "momentum_30",
    "pct_change",
    "z_score",
]


def prepare_price_frame(df: pd.DataFrame) -> pd.DataFrame:
    df = normalize_columns(df)
    df = df.copy()

    if "price" not in df.columns:
        if "value" in df.columns:
            df = df.rename(columns={"value": "price"})
        elif "dcoilwtico" in df.columns:
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
    df = df.dropna(subset=["date"]).drop_duplicates(subset=["date"]).sort_values("date")

    df["price"] = df["price"].interpolate(limit_direction="both")
    df["price"] = df["price"].ffill().bfill()
    return df


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df = prepare_price_frame(df)
    features = df.copy()

    features["lag_1"] = features["price"].shift(1)
    features["lag_3"] = features["price"].shift(3)
    features["lag_7"] = features["price"].shift(7)

    features["rolling_mean_7"] = features["price"].rolling(window=7).mean()
    features["rolling_mean_30"] = features["price"].rolling(window=30).mean()
    features["rolling_std_7"] = features["price"].rolling(window=7).std()

    features["momentum_7"] = features["price"].pct_change(7)
    features["momentum_30"] = features["price"].pct_change(30)

    features["pct_change"] = features["price"].pct_change()
    rolling_mean = features["pct_change"].rolling(window=30).mean()
    rolling_std = features["pct_change"].rolling(window=30).std()
    features["z_score"] = (features["pct_change"] - rolling_mean) / rolling_std

    features["target"] = features["price"]
    return features.dropna().reset_index(drop=True)


def get_feature_columns(df: pd.DataFrame) -> List[str]:
    return [col for col in FEATURE_COLUMNS if col in df.columns]
