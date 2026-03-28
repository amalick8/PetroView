from __future__ import annotations

from typing import Dict, Tuple

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error


def time_train_test_split(
    df: pd.DataFrame,
    test_size: float = 0.2,
    min_train_size: int = 60,
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    if not 0.05 <= test_size <= 0.5:
        raise ValueError("test_size must be between 0.05 and 0.5")

    split_idx = int(len(df) * (1 - test_size))
    split_idx = max(split_idx, min_train_size)
    split_idx = min(split_idx, len(df) - 1)

    train = df.iloc[:split_idx].copy()
    test = df.iloc[split_idx:].copy()
    return train, test


def evaluate_forecast(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    return {"mae": mae, "rmse": rmse}
