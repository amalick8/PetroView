from datetime import datetime
from pathlib import Path
from typing import List

from fastapi import APIRouter

from app.schemas.intelligence import (
    ForecastBundle,
    IntelligenceSummary,
    MacroContextSummary,
    NewsSignals,
    ScannerSummary,
    SignalSummary,
    VolatilitySummary,
)
from app.services.market_scanner_service import (
    build_price_series,
    detect_price_shocks,
    scan_market,
    supply_distribution,
)
from app.services.news_ingestion_service import fetch_recent_news, score_news
from app.services.volatility_service import compute_volatility
from app.services.macro_context_service import build_macro_context
from app.services.signal_service import build_signal
from app.services.forecast_service import run_forecast_bundle
from app.services.data_ingestion import fetch_oil_price_data
from app.services.analysis_service import load_supply

router = APIRouter(prefix="/intelligence", tags=["intelligence"])


@router.get("/summary", response_model=IntelligenceSummary)
def intelligence_summary() -> IntelligenceSummary:
    df_prices = fetch_oil_price_data()
    try:
        repo_root = Path(__file__).resolve().parents[3]
        df_supply = load_supply(str(repo_root / "oilwatch" / "data" / "oil_production.csv"))
    except Exception:
        df_supply = df_prices.copy()
    scanner = scan_market(df_prices)
    volatility = compute_volatility(df_prices)
    news_headlines = fetch_recent_news()
    news = score_news(news_headlines)
    macro = build_macro_context(df_prices)
    forecast = run_forecast_bundle(df_prices, horizons=[7, 30])
    signal = build_signal(df_prices, forecast, volatility)
    price_series = build_price_series(df_prices)
    shocks = detect_price_shocks(df_prices)
    supply = supply_distribution(df_supply)

    return IntelligenceSummary(
        timestamp=datetime.utcnow().isoformat(),
        price_series=price_series,
        supply_distribution=supply,
        shock_timeline=shocks,
        scanner=ScannerSummary(**scanner),
        volatility=VolatilitySummary(**volatility),
        forecast=ForecastBundle(**forecast),
        news=NewsSignals(**news),
        macro=MacroContextSummary(**macro),
        signal=SignalSummary(**signal),
    )
