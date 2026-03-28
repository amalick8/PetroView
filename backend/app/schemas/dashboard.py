from pydantic import BaseModel


class DashboardOverview(BaseModel):
    latest_price: float
    price_change_pct_30d: float
    volatility_30d: float
    top_supply_country: str
    supply_concentration_hhi: float
