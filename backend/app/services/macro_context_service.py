from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
import pandas as pd


def build_macro_context(df: pd.DataFrame) -> Dict[str, Any]:
    df_sorted = df.sort_values("date").copy()
    dates = df_sorted["date"].tail(180)

    rng = np.random.default_rng(42)
    dollar_index = 102 + np.cumsum(rng.normal(0, 0.15, size=len(dates)))
    inflation_proxy = 3.2 + np.cumsum(rng.normal(0, 0.03, size=len(dates)))
    industrial_output = 100 + np.cumsum(rng.normal(0, 0.2, size=len(dates)))
    inventory_proxy = 420 + np.cumsum(rng.normal(0, 0.4, size=len(dates)))

    def series_points(values: np.ndarray) -> List[Dict[str, float]]:
        return [
            {"date": date.strftime("%Y-%m-%d"), "value": float(value)}
            for date, value in zip(dates, values)
        ]

    price_returns = df_sorted["price"].pct_change().tail(len(dates)).fillna(0)
    dollar_corr = float(np.corrcoef(price_returns, np.diff(np.r_[dollar_index[0], dollar_index]))[0, 1])
    inflation_corr = float(np.corrcoef(price_returns, np.diff(np.r_[inflation_proxy[0], inflation_proxy]))[0, 1])
    industry_corr = float(np.corrcoef(price_returns, np.diff(np.r_[industrial_output[0], industrial_output]))[0, 1])

    return {
        "series": {
            "dollar_index": series_points(dollar_index),
            "inflation_proxy": series_points(inflation_proxy),
            "industrial_output": series_points(industrial_output),
            "inventory_proxy": series_points(inventory_proxy),
        },
        "correlations": {
            "dollar_index": dollar_corr,
            "inflation_proxy": inflation_corr,
            "industrial_output": industry_corr,
        },
    }
