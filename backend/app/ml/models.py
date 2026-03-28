from __future__ import annotations

from typing import Dict, List

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.arima.model import ARIMA

from app.ml.feature_engineering import build_features, get_feature_columns


def _prediction_interval(values: np.ndarray, sigma: float) -> Dict[str, np.ndarray]:
    if sigma <= 0:
        lower = values.copy()
        upper = values.copy()
    else:
        width = 1.96 * sigma
        lower = values - width
        upper = values + width
    return {"lower": lower, "upper": upper}


def naive_model(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    full_series: pd.Series,
    horizon: int,
) -> Dict[str, np.ndarray]:
    y_true = test_df["target"].to_numpy(dtype=float)
    y_pred = test_df["lag_1"].to_numpy(dtype=float)
    residuals = y_true - y_pred
    sigma = float(np.nanstd(residuals)) if len(residuals) else 0.0

    last_value = float(full_series.iloc[-1])
    forecast = np.repeat(last_value, horizon)
    interval = _prediction_interval(forecast, sigma)
    return {
        "y_true": y_true,
        "y_pred": y_pred,
        "forecast": forecast,
        "lower": interval["lower"],
        "upper": interval["upper"],
        "feature_importance": None,
    }


def linear_regression_model(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    full_prices: pd.DataFrame,
    horizon: int,
) -> Dict[str, np.ndarray | Dict[str, float] | None]:
    feature_cols = get_feature_columns(train_df)
    X_train = train_df[feature_cols].to_numpy(dtype=float)
    y_train = train_df["target"].to_numpy(dtype=float)
    X_test = test_df[feature_cols].to_numpy(dtype=float)
    y_test = test_df["target"].to_numpy(dtype=float)

    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    residuals = y_test - y_pred
    sigma = float(np.nanstd(residuals)) if len(residuals) else 0.0

    forecast = _recursive_linear_forecast(model, full_prices, horizon, feature_cols)
    interval = _prediction_interval(forecast, sigma)

    feature_importance = _linear_feature_importance(model, train_df, feature_cols)

    return {
        "y_true": y_test,
        "y_pred": y_pred,
        "forecast": forecast,
        "lower": interval["lower"],
        "upper": interval["upper"],
        "feature_importance": feature_importance,
    }


def gradient_boosting_model(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    full_prices: pd.DataFrame,
    horizon: int,
) -> Dict[str, np.ndarray | Dict[str, float] | None]:
    feature_cols = get_feature_columns(train_df)
    X_train = train_df[feature_cols].to_numpy(dtype=float)
    y_train = train_df["target"].to_numpy(dtype=float)
    X_test = test_df[feature_cols].to_numpy(dtype=float)
    y_test = test_df["target"].to_numpy(dtype=float)

    model = GradientBoostingRegressor(random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    residuals = y_test - y_pred
    sigma = float(np.nanstd(residuals)) if len(residuals) else 0.0

    forecast = _recursive_tree_forecast(model, full_prices, horizon, feature_cols)
    interval = _prediction_interval(forecast, sigma)

    feature_importance = {
        name: float(val)
        for name, val in zip(feature_cols, model.feature_importances_)
    }

    return {
        "y_true": y_test,
        "y_pred": y_pred,
        "forecast": forecast,
        "lower": interval["lower"],
        "upper": interval["upper"],
        "feature_importance": feature_importance,
    }


def arima_model(
    series: pd.Series,
    test_size: float,
    horizon: int,
) -> Dict[str, np.ndarray | Dict[str, float] | None]:
    split_idx = int(len(series) * (1 - test_size))
    split_idx = min(max(split_idx, 10), len(series) - 1)
    train, test = series.iloc[:split_idx], series.iloc[split_idx:]

    model = ARIMA(train, order=(1, 1, 1))
    fit = model.fit()
    test_pred = fit.forecast(steps=len(test))

    full_model = ARIMA(series, order=(1, 1, 1))
    full_fit = full_model.fit()
    forecast_res = full_fit.get_forecast(steps=horizon)

    forecast = np.asarray(forecast_res.predicted_mean, dtype=float)
    conf_int = forecast_res.conf_int(alpha=0.05)
    lower = np.asarray(conf_int.iloc[:, 0], dtype=float)
    upper = np.asarray(conf_int.iloc[:, 1], dtype=float)

    return {
        "y_true": test.to_numpy(dtype=float),
        "y_pred": np.asarray(test_pred, dtype=float),
        "forecast": forecast,
        "lower": lower,
        "upper": upper,
        "feature_importance": None,
    }


def _recursive_linear_forecast(
    model: LinearRegression,
    df_prices: pd.DataFrame,
    horizon: int,
    feature_cols: List[str],
) -> np.ndarray:
    history = df_prices.copy()
    last_date = history["date"].iloc[-1]
    future_dates = pd.date_range(last_date, periods=horizon + 1, inclusive="right")

    preds: List[float] = []
    for date in future_dates:
        extended = pd.concat(
            [history, pd.DataFrame({"date": [date], "price": [np.nan]})],
            ignore_index=True,
        )
        features = build_features(extended)
        last_row = features.iloc[-1][feature_cols].to_numpy(dtype=float).reshape(1, -1)
        pred = float(model.predict(last_row)[0])
        preds.append(pred)
        history = pd.concat(
            [history, pd.DataFrame({"date": [date], "price": [pred]})],
            ignore_index=True,
        )

    return np.asarray(preds, dtype=float)


def _recursive_tree_forecast(
    model: GradientBoostingRegressor,
    df_prices: pd.DataFrame,
    horizon: int,
    feature_cols: List[str],
) -> np.ndarray:
    history = df_prices.copy()
    last_date = history["date"].iloc[-1]
    future_dates = pd.date_range(last_date, periods=horizon + 1, inclusive="right")

    preds: List[float] = []
    for date in future_dates:
        extended = pd.concat(
            [history, pd.DataFrame({"date": [date], "price": [np.nan]})],
            ignore_index=True,
        )
        features = build_features(extended)
        last_row = features.iloc[-1][feature_cols].to_numpy(dtype=float).reshape(1, -1)
        pred = float(model.predict(last_row)[0])
        preds.append(pred)
        history = pd.concat(
            [history, pd.DataFrame({"date": [date], "price": [pred]})],
            ignore_index=True,
        )

    return np.asarray(preds, dtype=float)


def _linear_feature_importance(
    model: LinearRegression,
    train_df: pd.DataFrame,
    feature_cols: List[str],
) -> Dict[str, float]:
    X_std = train_df[feature_cols].std().replace(0.0, np.nan).fillna(1.0).to_numpy(dtype=float)
    raw = np.abs(model.coef_) * X_std
    return {name: float(val) for name, val in zip(feature_cols, raw)}
