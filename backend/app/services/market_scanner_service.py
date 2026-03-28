from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
import pandas as pd

from app.services.volatility_service import compute_volatility


def scan_market(df: pd.DataFrame) -> Dict[str, Any]:
    df_sorted = df.sort_values("date").copy()
    df_sorted["returns"] = df_sorted["price"].pct_change()
    df_sorted["momentum_14d"] = df_sorted["price"].pct_change(14)
    df_sorted["momentum_30d"] = df_sorted["price"].pct_change(30)

    return_7d = float(df_sorted["price"].pct_change(7).iloc[-1])
    return_30d = float(df_sorted["price"].pct_change(30).iloc[-1])
    momentum_14d = float(df_sorted["momentum_14d"].iloc[-1])
    momentum_30d = float(df_sorted["momentum_30d"].iloc[-1])

    rolling_max = df_sorted["price"].cummax()
    drawdown = (df_sorted["price"] / rolling_max) - 1.0
    drawdown_90d = float(drawdown.tail(90).min()) if len(drawdown) else 0.0

    volatility = compute_volatility(df_sorted)

    bias = _directional_bias(return_30d)
    momentum_regime = _momentum_regime(momentum_14d, momentum_30d)
    shock_risk = _shock_risk(df_sorted["returns"], volatility["current"], drawdown_90d)
    confidence = _confidence_score(return_30d, volatility["current"], shock_risk)

    drivers = _key_drivers(return_30d, momentum_30d, volatility["regime"], shock_risk)

    return {
        "latest_price": float(df_sorted["price"].iloc[-1]),
        "return_7d": return_7d,
        "return_30d": return_30d,
        "momentum_regime": momentum_regime,
        "directional_bias": bias,
        "shock_risk_score": shock_risk,
        "confidence_score": confidence,
        "drawdown_90d": drawdown_90d,
        "key_drivers": drivers,
        "volatility_regime": volatility["regime"],
        "stress_level": volatility["stress"],
    }


def build_price_series(df: pd.DataFrame, window: int = 180) -> List[Dict[str, Any]]:
    df_sorted = df.sort_values("date").tail(window)
    return [
        {"date": row["date"].strftime("%Y-%m-%d"), "price": float(row["price"])}
        for _, row in df_sorted.iterrows()
    ]


def detect_price_shocks(df: pd.DataFrame) -> List[Dict[str, Any]]:
    df_sorted = df.sort_values("date").copy()
    returns = df_sorted["price"].pct_change()
    threshold = returns.std() * -2 if not returns.empty else -0.03
    events = []
    for _, row in df_sorted.loc[returns <= threshold].tail(6).iterrows():
        idx = row.name
        if idx is None or idx not in returns.index:
            continue
        pos = returns.index.get_loc(idx)
        if isinstance(pos, slice):
            pos = pos.start
        if isinstance(pos, np.ndarray):
            pos = int(pos[0]) if len(pos) else None
        if pos is None:
            continue
        ret_value = float(returns.iloc[int(pos)])
        events.append(
            {
                "date": row["date"].strftime("%Y-%m-%d"),
                "return": ret_value,
                "price": float(row["price"]),
            }
        )
    return events


def supply_distribution(df_supply: pd.DataFrame) -> List[Dict[str, Any]]:
    df = df_supply.copy()
    if "country" not in df.columns:
        return []
    if "oil_production" in df.columns:
        metric = "oil_production"
    else:
        numeric = df.select_dtypes(include=["number"]).columns.tolist()
        metric = numeric[0] if numeric else "value"
        if metric not in df.columns:
            return []
    if "year" in df.columns:
        latest_year = int(df["year"].max())
        df = df.loc[df["year"] == latest_year]
    grouped = df.groupby("country")[metric].sum().sort_values(ascending=False).head(6)
    return [{"country": str(idx), "value": float(val)} for idx, val in grouped.items()]


def _directional_bias(return_30d: float) -> str:
    if return_30d >= 0.02:
        return "bullish"
    if return_30d <= -0.02:
        return "bearish"
    return "neutral"


def _momentum_regime(momentum_14d: float, momentum_30d: float) -> str:
    if momentum_14d >= 0.02 and momentum_30d >= 0.03:
        return "strong_uptrend"
    if momentum_14d <= -0.02 and momentum_30d <= -0.03:
        return "strong_downtrend"
    if momentum_30d >= 0.0:
        return "uptrend"
    if momentum_30d < 0.0:
        return "downtrend"
    return "flat"


def _shock_risk(returns: pd.Series, current_vol: float, drawdown: float) -> float:
    recent = returns.tail(30).dropna()
    spike_prob = float((recent <= -0.02).mean()) if len(recent) else 0.0
    raw = 0.5 * spike_prob + 0.3 * min(current_vol * 4, 1.0) + 0.2 * min(abs(drawdown), 0.2) / 0.2
    return float(min(max(raw, 0.0), 1.0))


def _confidence_score(return_30d: float, current_vol: float, shock_risk: float) -> float:
    trend_signal = min(abs(return_30d) * 6, 1.0)
    vol_penalty = min(current_vol * 5, 1.0)
    score = 0.55 * trend_signal + 0.25 * (1 - vol_penalty) + 0.2 * (1 - shock_risk)
    return float(min(max(score, 0.1), 0.95))


def _key_drivers(return_30d: float, momentum_30d: float, vol_regime: str, shock_risk: float) -> List[str]:
    drivers = []
    if return_30d > 0:
        drivers.append("30-day price trend remains positive")
    else:
        drivers.append("30-day price trend is negative")

    if momentum_30d > 0.02:
        drivers.append("Momentum signals reinforce upside bias")
    elif momentum_30d < -0.02:
        drivers.append("Momentum is weakening and skewed lower")
    else:
        drivers.append("Momentum is mixed and range-bound")

    drivers.append(f"Volatility regime is {vol_regime}")

    if shock_risk > 0.6:
        drivers.append("Shock risk elevated from recent drawdowns")
    elif shock_risk < 0.3:
        drivers.append("Shock risk is contained relative to history")

    return drivers
