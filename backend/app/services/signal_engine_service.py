from __future__ import annotations

from typing import Any, Dict, List


def build_signal(scanner: Dict[str, Any], volatility: Dict[str, Any], news: Dict[str, Any], forecast: Dict[str, Any]) -> Dict[str, Any]:
    direction = scanner["directional_bias"]
    news_bias = news.get("directional_score", 0.0)
    vol_regime = volatility.get("regime", "medium")
    shock_risk = scanner.get("shock_risk_score", 0.0)

    strength = 0.55 * scanner.get("confidence_score", 0.5) + 0.25 * max(news_bias, 0) + 0.2 * (1 - shock_risk)
    strength = min(max(strength, 0.1), 0.95)

    confidence = 0.5 * scanner.get("confidence_score", 0.5) + 0.3 * forecast.get("confidence", 0.5) + 0.2 * (1 - shock_risk)
    confidence = min(max(confidence, 0.1), 0.95)

    risk_level = _risk_level(vol_regime, shock_risk, news.get("risk_score", 0.0))

    reasoning: List[str] = []
    reasoning.extend(scanner.get("key_drivers", []))
    reasoning.append(f"News sentiment score is {news.get('sentiment_score', 0.0):.2f}")
    reasoning.append(f"Shock risk score is {shock_risk:.2f}")

    return {
        "direction": direction,
        "strength": float(strength),
        "confidence": float(confidence),
        "risk_level": risk_level,
        "reasoning": reasoning,
    }


def _risk_level(vol_regime: str, shock_risk: float, news_risk: float) -> str:
    if vol_regime == "extreme" or shock_risk > 0.7 or news_risk > 0.7:
        return "crisis"
    if vol_regime == "high" or shock_risk > 0.5 or news_risk > 0.5:
        return "elevated"
    if vol_regime == "medium" or shock_risk > 0.3 or news_risk > 0.3:
        return "moderate"
    return "low"
