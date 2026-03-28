from typing import Any, Dict

import numpy as np
import pandas as pd

from app.ml.forecasting import forecast_arima, forecast_linear, forecast_naive, select_best_model
from app.services.analysis_service import load_prices


def run_forecast(price_path: str, horizon: int) -> Dict[str, Any]:
    df_prices = load_prices(price_path)
    series = df_prices["price"].dropna()

    naive_preds, naive_metrics = forecast_naive(series, horizon)
    linear_preds, linear_metrics = forecast_linear(series, horizon)
    arima_preds, arima_metrics = forecast_arima(series, horizon)

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
    future_dates = pd.date_range(last_date, periods=horizon + 1, inclusive="right")

    forecast_payload = {
        "model": best_model,
        "dates": [d.strftime("%Y-%m-%d") for d in future_dates],
        "values": [float(v) for v in best_preds],
    }

    ci_width = float(np.std(best_preds)) if len(best_preds) > 1 else 0.0
    confidence_payload = {
        "lower": [float(v - ci_width) for v in best_preds],
        "upper": [float(v + ci_width) for v in best_preds],
    }

    return {"forecast": forecast_payload, "metrics": metrics_map, "confidence": confidence_payload}
