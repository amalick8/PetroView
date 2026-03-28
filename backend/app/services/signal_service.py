from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
import pandas as pd


def build_signal(df_prices: pd.DataFrame, forecast: Dict[str, Any], volatility: Dict[str, Any]) -> Dict[str, Any]:
    df_sorted = df_prices.sort_values("date").copy()
    df_sorted["return_7d"] = df_sorted["price"].pct_change(7)
    df_sorted["return_30d"] = df_sorted["price"].pct_change(30)

    momentum_7d = float(df_sorted["return_7d"].iloc[-1])
    momentum_30d = float(df_sorted["return_30d"].iloc[-1])

    direction = str(forecast.get("direction", "neutral"))
    forecast_confidence = float(forecast.get("confidence", 0.5))
    vol_regime = str(volatility.get("regime", "medium"))

    momentum_strength = min(abs(momentum_30d) * 6, 1.0)
    vol_penalty = _volatility_penalty(vol_regime)

    strength = 0.45 * momentum_strength + 0.35 * forecast_confidence + 0.2 * (1 - vol_penalty)
    strength = float(min(max(strength, 0.05), 0.95))

    confidence = 0.5 * forecast_confidence + 0.3 * (1 - vol_penalty) + 0.2 * (1 - min(abs(momentum_7d) * 4, 1.0))
    confidence = float(min(max(confidence, 0.05), 0.95))

    reasoning: List[str] = []
    reasoning.append(_direction_reason(direction, forecast))
    reasoning.append(_momentum_reason(momentum_30d))
    reasoning.append(f"Volatility regime is {vol_regime}")

    return {
        "direction": direction,
        "strength": strength,
        "confidence": confidence,
        "volatility_regime": vol_regime,
        "risk_level": _risk_level(vol_regime, momentum_30d),
        "reasoning": reasoning,
    }


def _volatility_penalty(regime: str) -> float:
    penalties = {
        "low": 0.1,
        "medium": 0.25,
        "high": 0.45,
        "extreme": 0.65,
    }
    return penalties.get(regime, 0.35)


def _risk_level(regime: str, momentum_30d: float) -> str:
    if regime == "extreme":
        return "crisis"
    if regime == "high":
        return "elevated"
    if abs(momentum_30d) >= 0.08:
        return "elevated"
    if regime == "medium":
        return "moderate"
    return "low"


def _direction_reason(direction: str, forecast: Dict[str, Any]) -> str:
    model_used = forecast.get("model_used", "best_model")
    if direction == "bullish":
        return f"{model_used} forecast points upward"
    if direction == "bearish":
        return f"{model_used} forecast trends lower"
    return f"{model_used} forecast is range-bound"


def _momentum_reason(momentum_30d: float) -> str:
    if momentum_30d >= 0.02:
        return "30-day momentum is positive"
    if momentum_30d <= -0.02:
        return "30-day momentum is negative"
    return "30-day momentum is flat"
