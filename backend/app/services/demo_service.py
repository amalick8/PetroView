from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional


_DEMO_ANALYSES: Dict[int, Dict[str, Any]] = {}
_DEMO_FORECASTS: Dict[int, Dict[str, Any]] = {}
_DEMO_REPORTS: Dict[int, Dict[str, Any]] = {}

_DEMO_ANALYSIS_ID = 1001
_DEMO_FORECAST_ID = 2001
_DEMO_REPORT_ID = 3001


def _date_series(days: int, start_offset: int = 30) -> List[str]:
    today = datetime.utcnow().date()
    start = today - timedelta(days=start_offset)
    return [(start + timedelta(days=idx)).strftime("%Y-%m-%d") for idx in range(days)]


def dashboard_overview() -> Dict[str, Any]:
    return {
        "latest_price": 93.7,
        "price_change_pct_30d": 0.034,
        "volatility_30d": 0.26,
        "top_supply_country": "United States",
        "supply_concentration_hhi": 0.23,
    }


def dashboard_trends() -> Dict[str, Any]:
    dates = _date_series(12, start_offset=330)
    prices = [79.2, 82.4, 77.9, 85.6, 88.1, 91.4, 93.0, 90.8, 92.6, 94.1, 95.3, 93.7]
    vols = [0.21, 0.24, 0.18, 0.27, 0.29, 0.26, 0.23, 0.25, 0.22, 0.24, 0.27, 0.25]
    points = [
        {"date": date, "price": price, "volatility": volatility}
        for date, price, volatility in zip(dates, prices, vols)
    ]
    return {"points": points}


def dashboard_recent() -> Dict[str, Any]:
    return {
        "items": [
            {
                "id": 1001,
                "title": "Market Structure Deep Dive",
                "created_at": (datetime.utcnow() - timedelta(days=2)).isoformat(),
                "summary": "Volatility eased while supply concentration remained elevated.",
                "type": "analysis",
            },
            {
                "id": 2001,
                "title": "WTI 30-Day Forecast",
                "created_at": (datetime.utcnow() - timedelta(days=1)).isoformat(),
                "summary": "Forecast points to a mild upside drift into next month.",
                "type": "forecast",
            },
            {
                "id": 3001,
                "title": "Market Intelligence Report",
                "created_at": datetime.utcnow().isoformat(),
                "summary": "Notebook export prepared for executive review.",
                "type": "report",
            },
        ]
    }


def create_analysis(dataset_id: int, title: str, user_id: str) -> Dict[str, Any]:
    global _DEMO_ANALYSIS_ID

    analysis = {
        "id": _DEMO_ANALYSIS_ID,
        "dataset_id": dataset_id,
        "title": title,
        "summary": (
            "Supply concentration remains elevated as OPEC+ discipline persists, while WTI spreads imply near-term tightness. "
            "Volatility cooled over the last two weeks, but upside risk remains from geopolitical disruptions and storm activity."
        ),
        "insight_payload": {
            "latest_price": 93.7,
            "price_trend_30d": 0.034,
            "volatility_30d": 0.26,
            "top_supply_country": "United States",
            "supply_hhi": 0.23,
        },
        "shock_events_payload": {
            "supply_shocks": [
                {
                    "date": (datetime.utcnow() - timedelta(days=54)).strftime("%Y-%m-%d"),
                    "pct_change": -0.07,
                    "zscore": -2.4,
                    "drop_magnitude": 1.1,
                    "value": 92.1,
                }
            ]
        },
        "metrics_payload": {
            "price": {
                "price_change_pct_30d": 0.034,
                "volatility_30d": 0.26,
            },
            "supply_concentration": {
                "top_country": "United States",
                "hhi": 0.23,
            },
        },
        "user_id": user_id,
    }

    _DEMO_ANALYSES[_DEMO_ANALYSIS_ID] = analysis
    _DEMO_ANALYSIS_ID += 1
    return analysis


def get_analysis(analysis_id: int) -> Optional[Dict[str, Any]]:
    return _DEMO_ANALYSES.get(analysis_id)


def create_forecast(dataset_id: int, horizon: int, user_id: str, analysis_id: Optional[int] = None) -> Dict[str, Any]:
    global _DEMO_FORECAST_ID

    dates = _date_series(horizon, start_offset=0)
    values = [92.4, 92.7, 93.1, 93.5, 93.9, 94.2, 94.6, 94.9, 95.1, 95.3][:horizon]
    if len(values) < horizon:
        values.extend([values[-1]] * (horizon - len(values)))

    forecast = {
        "id": _DEMO_FORECAST_ID,
        "dataset_id": dataset_id,
        "model_run_id": 5001,
        "forecast_horizon": horizon,
        "forecast_values_payload": {"model": "arima", "dates": dates, "values": values},
        "confidence_interval_payload": {
            "lower": [v - 2.3 for v in values],
            "upper": [v + 2.3 for v in values],
        },
        "narrative_summary": "Baseline models project a measured drift higher with moderate downside risk.",
        "analysis_id": analysis_id,
        "user_id": user_id,
    }

    _DEMO_FORECASTS[_DEMO_FORECAST_ID] = forecast
    _DEMO_FORECAST_ID += 1
    return forecast


def get_forecast(forecast_id: int) -> Optional[Dict[str, Any]]:
    return _DEMO_FORECASTS.get(forecast_id)


def create_report(analysis_id: int, user_id: str) -> Dict[str, Any]:
    global _DEMO_REPORT_ID

    report = {
        "id": _DEMO_REPORT_ID,
        "title": "PetroView Market Intelligence Report",
        "path": f"./data/reports/demo_report_{_DEMO_REPORT_ID}.ipynb",
        "created_at": datetime.utcnow().isoformat(),
        "analysis_id": analysis_id,
        "user_id": user_id,
    }

    _DEMO_REPORTS[_DEMO_REPORT_ID] = report
    _DEMO_REPORT_ID += 1
    return report


def get_report(report_id: int) -> Optional[Dict[str, Any]]:
    return _DEMO_REPORTS.get(report_id)
