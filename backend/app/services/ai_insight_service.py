from typing import Dict

from app.core.config import settings


def build_insight_summary(metrics: Dict) -> str:
    price_change = metrics.get("price", {}).get("price_change_pct_30d", 0)
    volatility = metrics.get("price", {}).get("volatility_30d", 0)
    top_country = metrics.get("supply_concentration", {}).get("top_country", "Unknown")
    hhi = metrics.get("supply_concentration", {}).get("hhi", 0)

    trend_label = "up" if price_change >= 0 else "down"
    summary = (
        f"Oil prices moved {trend_label} over the last 30 days with a change of "
        f"{price_change:.2%}. Volatility averaged {volatility:.2%} over the same window. "
        f"Supply concentration remains elevated, with {top_country} leading production and "
        f"an HHI of {hhi:.2f}."
    )

    if settings.openai_api_key:
        # Placeholder for future OpenAI call; keep it grounded in computed metrics.
        return summary

    return summary
