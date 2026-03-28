from typing import List

from pydantic import BaseModel


class DashboardOverview(BaseModel):
    latest_price: float
    price_change_pct_30d: float
    volatility_30d: float
    top_supply_country: str
    supply_concentration_hhi: float


class DashboardTrendPoint(BaseModel):
    date: str
    price: float
    volatility: float


class DashboardTrendsResponse(BaseModel):
    points: List[DashboardTrendPoint]


class DashboardRecentItem(BaseModel):
    id: int
    title: str
    created_at: str
    summary: str
    type: str


class DashboardRecentResponse(BaseModel):
    items: List[DashboardRecentItem]
