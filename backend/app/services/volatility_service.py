from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
import pandas as pd


def _classify_regime(percentile: float) -> str:
    if percentile < 25:
        return "low"
    if percentile < 50:
        return "medium"
    if percentile < 75:
        return "high"
    return "extreme"


def _stress_level(regime: str, drawdown: float) -> str:
    if regime == "extreme" or drawdown <= -0.15:
        return "crisis"
    if regime == "high" or drawdown <= -0.1:
        return "elevated"
    if regime == "medium" or drawdown <= -0.05:
        return "moderate"
    return "low"


def compute_volatility(df: pd.DataFrame) -> Dict[str, Any]:
    df_sorted = df.sort_values("date").copy()
    returns = df_sorted["price"].pct_change().dropna()
    rolling_30 = returns.rolling(30).std()
    rolling_90 = returns.rolling(90).std()

    current_vol = float(rolling_30.iloc[-1]) if not rolling_30.empty else 0.0
    vol_history = rolling_30.dropna()
    percentile = float((vol_history.rank(pct=True).iloc[-1] * 100) if not vol_history.empty else 0.0)

    rolling_max = df_sorted["price"].cummax()
    drawdown = (df_sorted["price"] / rolling_max) - 1.0
    drawdown_90d = float(drawdown.tail(90).min()) if len(drawdown) else 0.0

    regime = _classify_regime(percentile)
    stress = _stress_level(regime, drawdown_90d)

    spike_threshold = float(returns.std() * 2.0) if not returns.empty else 0.0
    spike_count = int((returns <= -abs(spike_threshold)).sum()) if spike_threshold > 0 else 0

    return {
        "current": current_vol,
        "percentile": percentile,
        "regime": regime,
        "stress": stress,
        "drawdown_90d": drawdown_90d,
        "spike_count_90d": spike_count,
        "rolling_30": _series_points(df_sorted["date"], rolling_30),
        "rolling_90": _series_points(df_sorted["date"], rolling_90),
    }


def _series_points(dates: pd.Series, values: pd.Series) -> List[Dict[str, float]]:
    points = []
    for date, value in zip(dates, values):
        if pd.isna(value):
            continue
        points.append({"date": date.strftime("%Y-%m-%d"), "value": float(value)})
    return points
