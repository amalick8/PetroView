from fastapi import APIRouter

from app.schemas.intelligence import SignalSummary
from app.services.data_ingestion import fetch_oil_price_data
from app.services.forecast_service import run_forecast_bundle
from app.services.signal_service import build_signal
from app.services.volatility_service import compute_volatility

router = APIRouter(prefix="/signals", tags=["signals"])


@router.get("/latest", response_model=SignalSummary)
def latest_signal() -> SignalSummary:
    df_prices = fetch_oil_price_data()
    volatility = compute_volatility(df_prices)
    forecast = run_forecast_bundle(df_prices, horizons=[7, 30])
    signal = build_signal(df_prices, forecast, volatility)
    return SignalSummary(**signal)
