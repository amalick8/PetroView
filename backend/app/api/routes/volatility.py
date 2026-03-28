from fastapi import APIRouter

from app.schemas.intelligence import VolatilitySummary
from app.services.data_ingestion import fetch_oil_price_data
from app.services.volatility_service import compute_volatility

router = APIRouter(prefix="/volatility", tags=["volatility"])


@router.get("/latest", response_model=VolatilitySummary)
def latest_volatility() -> VolatilitySummary:
    df_prices = fetch_oil_price_data()
    return VolatilitySummary(**compute_volatility(df_prices))
