from typing import Dict, Tuple

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from statsmodels.tsa.arima.model import ARIMA


def _to_numpy(values: object) -> np.ndarray:
    return np.asarray(values, dtype=float)


def make_lag_features(series: pd.Series, lags: int = 7) -> pd.DataFrame:
    df = pd.DataFrame({"y": series})
    for lag in range(1, lags + 1):
        df[f"lag_{lag}"] = series.shift(lag)
    return df.dropna()


def evaluate_forecast(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    mape = float(np.mean(np.abs((y_true - y_pred) / y_true)))
    return {"mae": mae, "rmse": rmse, "mape": mape}


def forecast_naive(series: pd.Series, horizon: int) -> Tuple[np.ndarray, Dict[str, float]]:
    last_value = series.iloc[-1]
    preds = np.repeat(last_value, horizon)
    metrics = {}
    return preds, metrics


def forecast_linear(series: pd.Series, horizon: int) -> Tuple[np.ndarray, Dict[str, float]]:
    features = make_lag_features(series)
    X = features.drop(columns=["y"]).to_numpy(dtype=float)
    y = features["y"].to_numpy(dtype=float)

    split = int(len(X) * 0.8)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    metrics = evaluate_forecast(_to_numpy(y_test), _to_numpy(y_pred))

    last_window = features.drop(columns=["y"]).iloc[-1].to_numpy(dtype=float).reshape(1, -1)
    preds = []
    window = last_window.copy()
    for _ in range(horizon):
        pred = model.predict(window)[0]
        preds.append(pred)
        window = np.roll(window, shift=1)
        window[0, 0] = pred

    return np.array(preds), metrics


def forecast_arima(series: pd.Series, horizon: int) -> Tuple[np.ndarray, Dict[str, float]]:
    series = series.dropna()
    split = int(len(series) * 0.8)
    train, test = series.iloc[:split], series.iloc[split:]
    model = ARIMA(train, order=(1, 1, 1))
    fit = model.fit()
    y_pred = fit.forecast(steps=len(test))
    metrics = evaluate_forecast(_to_numpy(test), _to_numpy(y_pred))

    full_model = ARIMA(series, order=(1, 1, 1))
    full_fit = full_model.fit()
    preds = _to_numpy(full_fit.forecast(steps=horizon))
    return preds, metrics


def select_best_model(models: Dict[str, Dict[str, float]]) -> str:
    best_name = min(models, key=lambda name: models[name].get("rmse", float("inf")))
    return best_name
