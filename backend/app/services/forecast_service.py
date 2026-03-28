from typing import Any, Dict, Iterable, List, Optional

import numpy as np
import pandas as pd

from app.ml.evaluation import evaluate_forecast, time_train_test_split
from app.ml.feature_engineering import build_features, prepare_price_frame
from app.ml.models import (
    arima_model,
    gradient_boosting_model,
    linear_regression_model,
    naive_model,
)
from app.services.analysis_service import load_prices


def run_forecast(price_path: str, horizon: int) -> Dict[str, Any]:
    df_prices = load_prices(price_path)
    return run_forecast_bundle(df_prices, horizons=[horizon])


def run_forecast_bundle(df_prices: pd.DataFrame, horizons: Iterable[int]) -> Dict[str, Any]:
    df_prices = prepare_price_frame(df_prices)
    features = build_features(df_prices)
    if len(features) < 40:
        raise ValueError("Insufficient data to train forecasting models")

    train_df, test_df = time_train_test_split(features, test_size=0.2, min_train_size=40)
    series = df_prices.set_index("date")["price"]
    horizons_list = list(horizons)
    horizon_max = max(horizons_list)

    model_outputs: Dict[str, Dict[str, Any]] = {
        "naive": naive_model(train_df, test_df, series, horizon_max),
        "linear": linear_regression_model(train_df, test_df, df_prices, horizon_max),
        "arima": arima_model(series, test_size=0.2, horizon=horizon_max),
    }

    if len(train_df) >= 120:
        model_outputs["gbr"] = gradient_boosting_model(train_df, test_df, df_prices, horizon_max)

    metrics_map: Dict[str, Dict[str, float]] = {}
    for name, output in model_outputs.items():
        y_true = output["y_true"]
        y_pred = output["y_pred"]
        metrics_map[name] = evaluate_forecast(np.asarray(y_true), np.asarray(y_pred))

    best_model = min(metrics_map, key=lambda item: metrics_map[item]["rmse"])
    best_output = model_outputs[best_model]

    last_date = df_prices["date"].iloc[-1]
    forecast_horizons: List[Dict[str, Any]] = []
    for horizon in horizons_list:
        future_dates = pd.date_range(last_date, periods=horizon + 1, inclusive="right")
        values = np.asarray(best_output["forecast"][:horizon], dtype=float)
        lower = np.asarray(best_output["lower"][:horizon], dtype=float)
        upper = np.asarray(best_output["upper"][:horizon], dtype=float)
        forecast_horizons.append(
            {
                "horizon_days": horizon,
                "model": best_model,
                "dates": [d.strftime("%Y-%m-%d") for d in future_dates],
                "values": [float(v) for v in values],
                "lower": [float(v) for v in lower],
                "upper": [float(v) for v in upper],
            }
        )

    direction = _direction_from_forecast(best_output["forecast"])
    confidence = _confidence_from_rmse(metrics_map[best_model]["rmse"], series)

    model_comparison = [
        {"model": name, **metrics_map[name]} for name in metrics_map.keys()
    ]

    default_horizon = _select_default_horizon(forecast_horizons)
    forecast_values = default_horizon["values"]
    confidence_interval = [
        {"lower": low, "upper": up}
        for low, up in zip(default_horizon["lower"], default_horizon["upper"])
    ]

    feature_importance = _format_feature_importance(best_output.get("feature_importance"))
    explanations = _feature_explanations(best_model, best_output.get("feature_importance"))

    return {
        "direction": direction,
        "confidence": confidence,
        "model_used": best_model,
        "mae": metrics_map[best_model]["mae"],
        "rmse": metrics_map[best_model]["rmse"],
        "forecast": forecast_values,
        "confidence_interval": confidence_interval,
        "feature_importance": feature_importance,
        "explanations": explanations,
        "horizons": forecast_horizons,
        "model_comparison": model_comparison,
    }


def _direction_from_forecast(values: np.ndarray) -> str:
    if len(values) < 2:
        return "neutral"
    start = float(values[0])
    end = float(values[-1])
    if start == 0:
        return "neutral"
    change = (end - start) / abs(start)
    if change >= 0.01:
        return "bullish"
    if change <= -0.01:
        return "bearish"
    return "neutral"


def _confidence_from_rmse(rmse: float, series: pd.Series) -> float:
    level = float(series.tail(90).mean()) if len(series) else 1.0
    scaled = 1 - min(max(rmse / max(level, 1e-6), 0.0), 0.9)
    return float(min(max(scaled, 0.1), 0.95))


def _select_default_horizon(horizons: List[Dict[str, Any]]) -> Dict[str, Any]:
    for horizon in horizons:
        if horizon["horizon_days"] == 30:
            return horizon
    return horizons[0]


def _format_feature_importance(raw: Optional[Dict[str, float]]) -> List[Dict[str, float]]:
    if not raw:
        return []
    ordered = sorted(raw.items(), key=lambda item: abs(item[1]), reverse=True)
    return [{"feature": name, "importance": float(value)} for name, value in ordered]


def _feature_explanations(model_name: str, raw: Optional[Dict[str, float]]) -> List[str]:
    if not raw:
        return [f"{model_name} model selected based on lowest RMSE"]

    ordered = sorted(raw.items(), key=lambda item: abs(item[1]), reverse=True)[:3]
    explanations = [
        f"Top driver: {name.replace('_', ' ')} (importance {value:.2f})"
        for name, value in ordered
    ]
    explanations.append(f"{model_name} model selected based on lowest RMSE")
    return explanations
