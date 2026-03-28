from typing import Any, Dict, Iterable, List

import numpy as np
import pandas as pd

from app.ml.forecasting import forecast_arima, forecast_linear, forecast_naive, select_best_model
from app.services.analysis_service import load_prices


def run_forecast(price_path: str, horizon: int) -> Dict[str, Any]:
    df_prices = load_prices(price_path)
    return run_forecast_bundle(df_prices, horizons=[horizon])


def run_forecast_bundle(df_prices: pd.DataFrame, horizons: Iterable[int]) -> Dict[str, Any]:
    series = df_prices["price"].dropna()
    horizons_list = list(horizons)

    naive_preds, naive_metrics = forecast_naive(series, max(horizons_list))
    linear_preds, linear_metrics = forecast_linear(series, max(horizons_list))
    arima_preds, arima_metrics = forecast_arima(series, max(horizons_list))

    metrics_map = {
        "naive": naive_metrics,
        "linear": linear_metrics,
        "arima": arima_metrics,
    }
    best_model = select_best_model(metrics_map)

    preds_map = {
        "naive": naive_preds,
        "linear": linear_preds,
        "arima": arima_preds,
    }
    best_preds = preds_map[best_model]

    last_date = df_prices["date"].iloc[-1]
    forecast_horizons: List[Dict[str, Any]] = []
    for horizon in horizons_list:
        future_dates = pd.date_range(last_date, periods=horizon + 1, inclusive="right")
        sliced = best_preds[:horizon]
        ci_width = float(np.std(sliced)) if len(sliced) > 1 else 0.0
        forecast_horizons.append(
            {
                "horizon_days": horizon,
                "model": best_model,
                "dates": [d.strftime("%Y-%m-%d") for d in future_dates],
                "values": [float(v) for v in sliced],
                "lower": [float(v - ci_width) for v in sliced],
                "upper": [float(v + ci_width) for v in sliced],
            }
        )

    direction = "bullish" if float(best_preds[-1] - best_preds[0]) >= 0 else "bearish"
    confidence = float(max(0.1, min(0.9, 1 - float(np.std(best_preds)))))

    model_comparison = [
        {"model": name, **metrics_map[name]} for name in metrics_map.keys()
    ]

    return {
        "direction": direction,
        "confidence": confidence,
        "horizons": forecast_horizons,
        "model_comparison": model_comparison,
    }
