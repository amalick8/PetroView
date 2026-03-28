from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict, List


_DEMO_HEADLINES = [
    {
        "title": "OPEC+ signals extension of output discipline into Q3",
        "source": "EnergyWire",
        "category": "opec_policy",
        "sentiment": 0.4,
        "risk": 0.3,
    },
    {
        "title": "Red Sea disruptions lift tanker rates, tightening prompt crude supply",
        "source": "Maritime Daily",
        "category": "shipping_disruption",
        "sentiment": 0.2,
        "risk": 0.6,
    },
    {
        "title": "US refinery utilization rises as gasoline demand holds firm",
        "source": "EIA Weekly",
        "category": "refinery_inventory",
        "sentiment": 0.3,
        "risk": 0.2,
    },
    {
        "title": "Middle East risk premium returns as diplomatic talks stall",
        "source": "GeoBrief",
        "category": "geopolitical_escalation",
        "sentiment": 0.1,
        "risk": 0.7,
    },
    {
        "title": "Macro data points to soft landing, demand outlook steady",
        "source": "MacroPulse",
        "category": "macro_inflation",
        "sentiment": 0.25,
        "risk": 0.2,
    },
]


def fetch_recent_news() -> List[Dict[str, Any]]:
    now = datetime.utcnow()
    headlines = []
    for idx, item in enumerate(_DEMO_HEADLINES):
        entry = item.copy()
        entry["published_at"] = (now - timedelta(hours=6 * idx)).isoformat()
        headlines.append(entry)
    return headlines


def score_news(headlines: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not headlines:
        return {
            "sentiment_score": 0.0,
            "risk_score": 0.0,
            "supply_disruption_score": 0.0,
            "directional_score": 0.0,
            "category_counts": {},
            "headlines": [],
        }

    sentiment = sum(h["sentiment"] for h in headlines) / len(headlines)
    risk = sum(h["risk"] for h in headlines) / len(headlines)
    supply_disruption = sum(1.0 for h in headlines if h["category"] in {"supply_shock", "shipping_disruption"})
    supply_disruption_score = min(supply_disruption / len(headlines) + risk * 0.5, 1.0)

    directional_score = min(max(sentiment - (risk * 0.4), -1.0), 1.0)

    category_counts: Dict[str, int] = {}
    for item in headlines:
        category_counts[item["category"]] = category_counts.get(item["category"], 0) + 1

    return {
        "sentiment_score": float(sentiment),
        "risk_score": float(risk),
        "supply_disruption_score": float(supply_disruption_score),
        "directional_score": float(directional_score),
        "category_counts": category_counts,
        "headlines": headlines,
    }
