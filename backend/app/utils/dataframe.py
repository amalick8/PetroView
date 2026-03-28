from typing import Dict, Tuple

import numpy as np
import pandas as pd


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
    return df


def summarize_missing(df: pd.DataFrame) -> Dict[str, float]:
    missing = df.isna().mean().to_dict()
    return {k: float(v) for k, v in missing.items()}


def rolling_volatility(series: pd.Series, window: int = 30) -> pd.Series:
    returns = series.pct_change().replace([np.inf, -np.inf], np.nan)
    return returns.rolling(window).std()


def train_test_split_time(df: pd.DataFrame, split_ratio: float = 0.8) -> Tuple[pd.DataFrame, pd.DataFrame]:
    split_index = int(len(df) * split_ratio)
    return df.iloc[:split_index].copy(), df.iloc[split_index:].copy()
