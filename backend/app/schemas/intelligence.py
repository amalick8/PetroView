from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ForecastHorizon(BaseModel):
    horizon_days: int
    model: str
    dates: List[str]
    values: List[float]
    lower: List[float]
    upper: List[float]


class ForecastComparison(BaseModel):
    model: str
    mae: Optional[float]
    rmse: Optional[float]
    mape: Optional[float]


class ForecastBundle(BaseModel):
    direction: str
    confidence: float
    model_used: Optional[str] = None
    mae: Optional[float] = None
    rmse: Optional[float] = None
    forecast: Optional[List[float]] = None
    confidence_interval: Optional[List[Dict[str, float]]] = None
    feature_importance: Optional[List[Dict[str, float | str]]] = None
    explanations: Optional[List[str]] = None
    horizons: List[ForecastHorizon]
    model_comparison: List[ForecastComparison]


class NewsHeadline(BaseModel):
    title: str
    source: str
    category: str
    sentiment: float
    risk: float
    published_at: str


class NewsSignals(BaseModel):
    sentiment_score: float
    risk_score: float
    supply_disruption_score: float
    directional_score: float
    category_counts: Dict[str, int]
    headlines: List[NewsHeadline]


class SignalSummary(BaseModel):
    direction: str
    strength: float
    confidence: float
    risk_level: str
    volatility_regime: Optional[str] = None
    reasoning: List[str]


class ScannerSummary(BaseModel):
    latest_price: float
    return_7d: float
    return_30d: float
    momentum_regime: str
    directional_bias: str
    shock_risk_score: float
    confidence_score: float
    drawdown_90d: float
    key_drivers: List[str]
    volatility_regime: str
    stress_level: str


class VolatilitySummary(BaseModel):
    current: float
    percentile: float
    regime: str
    stress: str
    drawdown_90d: float
    spike_count_90d: int
    rolling_30: List[Dict[str, Any]]
    rolling_90: List[Dict[str, Any]]


class MacroContextSummary(BaseModel):
    series: Dict[str, List[Dict[str, Any]]]
    correlations: Dict[str, float]


class IntelligenceSummary(BaseModel):
    timestamp: str
    price_series: List[Dict[str, Any]]
    supply_distribution: List[Dict[str, Any]]
    shock_timeline: List[Dict[str, Any]]
    scanner: ScannerSummary
    volatility: VolatilitySummary
    forecast: ForecastBundle
    news: NewsSignals
    macro: MacroContextSummary
    signal: SignalSummary
