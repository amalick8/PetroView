from fastapi import APIRouter

from app.schemas.intelligence import SignalSummary
from app.services.data_ingestion import fetch_oil_price_data
from app.services.forecast_service import run_forecast_bundle
from app.services.market_scanner_service import scan_market
from app.services.news_ingestion_service import fetch_recent_news, score_news
from app.services.signal_engine_service import build_signal
from app.services.volatility_service import compute_volatility

router = APIRouter(prefix="/signals", tags=["signals"])


@router.get("/latest", response_model=SignalSummary)
def latest_signal() -> SignalSummary:
    df_prices = fetch_oil_price_data()
    scanner = scan_market(df_prices)
    volatility = compute_volatility(df_prices)
    news = score_news(fetch_recent_news())
    forecast = run_forecast_bundle(df_prices, horizons=[7, 30, 60])
    signal = build_signal(scanner, volatility, news, forecast)
    return SignalSummary(**signal)
