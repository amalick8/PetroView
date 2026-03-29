export const demoInsights = [
  {
    label: "Volatility Regime",
    value: "Elevated, easing",
    detail: "Rolling 30-day volatility is down 11% from last month while spot prices stabilize."
  },
  {
    label: "Supply Concentration",
    value: "HHI 0.23",
    detail: "Top three producers account for 45% of global crude output."
  },
  {
    label: "Forecast Bias",
    value: "Mild upside",
    detail: "Consensus models project a measured drift higher into the next 30 days."
  }
];

export const demoPriceSeries = [
  { date: "Jan", price: 79.2 },
  { date: "Feb", price: 82.4 },
  { date: "Mar", price: 77.9 },
  { date: "Apr", price: 85.6 },
  { date: "May", price: 88.1 },
  { date: "Jun", price: 91.4 },
  { date: "Jul", price: 93.0 },
  { date: "Aug", price: 90.8 },
  { date: "Sep", price: 92.6 },
  { date: "Oct", price: 94.1 },
  { date: "Nov", price: 95.3 },
  { date: "Dec", price: 93.7 }
];

export const demoVolatilitySeries = [
  { date: "Jan", value: 0.21 },
  { date: "Feb", value: 0.24 },
  { date: "Mar", value: 0.18 },
  { date: "Apr", value: 0.27 },
  { date: "May", value: 0.29 },
  { date: "Jun", value: 0.26 },
  { date: "Jul", value: 0.23 },
  { date: "Aug", value: 0.25 },
  { date: "Sep", value: 0.22 },
  { date: "Oct", value: 0.24 },
  { date: "Nov", value: 0.27 },
  { date: "Dec", value: 0.25 }
];

export const demoSupplyDistribution = [
  { country: "US", value: 16.7 },
  { country: "Saudi", value: 12.1 },
  { country: "Russia", value: 10.3 },
  { country: "Canada", value: 5.5 },
  { country: "Iraq", value: 4.4 },
  { country: "UAE", value: 3.6 }
];

export const demoAnalysisSummary =
  "Supply concentration remains elevated as OPEC+ discipline persists, while WTI spreads imply near-term tightness. " +
  "Volatility cooled over the last two weeks, but upside risk remains from geopolitical disruptions and Atlantic storm season.";

export const demoForecastMetrics = {
  horizon: "30-day horizon",
  model: "ARIMA baseline",
  mae: 2.3,
  rmse: 3.1,
  mape: 4.1
};

export const demoForecastValues = [
  92.4, 92.7, 93.1, 93.5, 93.9, 94.2, 94.6, 94.9, 95.1, 95.3
];

export const demoReportMeta = {
  title: "PetroView Market Intelligence Report",
  updated: "2026-03-27",
  author: "PetroView Analytics Desk",
  format: "Notebook",
  pages: 18
};

export const demoEquityForecast = [
  { symbol: "XLE", name: "Energy Select", last: 93.4, forecast30d: 97.1, confidence: 0.62 },
  { symbol: "XOP", name: "Oil & Gas E&P", last: 141.2, forecast30d: 147.8, confidence: 0.58 },
  { symbol: "VLO", name: "Valero", last: 159.9, forecast30d: 166.4, confidence: 0.55 },
  { symbol: "CVX", name: "Chevron", last: 158.7, forecast30d: 162.1, confidence: 0.61 },
  { symbol: "OXY", name: "Occidental", last: 56.9, forecast30d: 60.2, confidence: 0.57 }
];

export const demoModelPerformance = [
  { model: "ARIMA", mae: 2.3, rmse: 3.1, mape: 4.1, latencyMs: 210 },
  { model: "Prophet", mae: 2.1, rmse: 2.9, mape: 3.8, latencyMs: 240 },
  { model: "XGBoost", mae: 1.9, rmse: 2.7, mape: 3.4, latencyMs: 310 },
  { model: "LSTM", mae: 2.0, rmse: 2.8, mape: 3.6, latencyMs: 410 }
];

export const demoScenarioDeck = [
  {
    title: "Logistics shock",
    probability: 0.22,
    impact: "+7.5% spot",
    outlook: "Short-term upside if shipping lanes stay constrained."
  },
  {
    title: "Refinery outage",
    probability: 0.18,
    impact: "+4.0% crack spread",
    outlook: "Margins spike while product inventories draw."
  },
  {
    title: "Demand fade",
    probability: 0.25,
    impact: "-5.2% spot",
    outlook: "Macro softness trims risk appetite and pulls prices lower."
  },
  {
    title: "Inventory draw",
    probability: 0.35,
    impact: "+3.1% spot",
    outlook: "Persistent draws keep curve backwardated."
  }
];

export const demoNewsPulse = [
  {
    title: "Gulf Coast maintenance cuts crude exports",
    source: "Energy Wire",
    topic: "Logistics",
    impact: "High",
    confidence: 0.72
  },
  {
    title: "OPEC signals disciplined supply into Q3",
    source: "Market Brief",
    topic: "Policy",
    impact: "Medium",
    confidence: 0.64
  },
  {
    title: "US rigs flatten as capex budgets tighten",
    source: "Field Notes",
    topic: "Supply",
    impact: "Medium",
    confidence: 0.59
  },
  {
    title: "Refined product demand firming in Asia",
    source: "Macro Desk",
    topic: "Demand",
    impact: "Low",
    confidence: 0.54
  }
];

export const demoNewsNarratives = [
  {
    title: "Red Sea disruption reroutes tankers, lifting freight rates",
    source: "Global Shipping Monitor",
    time: "2 hours ago",
    signal: "Prompt tightness",
    impact: "+1.2% spot",
    takeaway: "Longer transit times reduce near-term availability, widening prompt spreads."
  },
  {
    title: "OPEC+ extends output discipline into Q3",
    source: "Energy Policy Desk",
    time: "6 hours ago",
    signal: "Supply clamp",
    impact: "+0.8% curve",
    takeaway: "Forward balances tighten, reinforcing bullish model bias and higher confidence."
  },
  {
    title: "US shale capex plans flatten after earnings",
    source: "Field Intelligence",
    time: "12 hours ago",
    signal: "Lower growth",
    impact: "+0.6% forecast",
    takeaway: "Slower rig additions imply tighter 2H supply and sustained backwardation."
  },
  {
    title: "Asian product demand rebounds ahead of travel season",
    source: "Macro Desk",
    time: "1 day ago",
    signal: "Demand surge",
    impact: "+0.5% crack",
    takeaway: "Refining margins improve, supporting higher crude runs and spot demand."
  }
];

export const demoReportCatalog = [
  {
    id: 101,
    title: "March 2026 Energy Outlook",
    updated: "2026-03-27",
    pages: 18,
    tag: "Monthly",
    author: "PetroView Analytics Desk"
  },
  {
    id: 98,
    title: "Volatility Shock Review",
    updated: "2026-03-12",
    pages: 14,
    tag: "Special",
    author: "PetroView Quant Lab"
  },
  {
    id: 96,
    title: "Macro Cross-Asset Lens",
    updated: "2026-02-28",
    pages: 22,
    tag: "Macro",
    author: "PetroView Research"
  }
];

export const demoWatchlist = [
  { name: "WTI Spot", value: 93.7, change: 0.6, signal: "Momentum up" },
  { name: "Brent", value: 96.1, change: 0.4, signal: "Tight supply" },
  { name: "DXY", value: 103.2, change: -0.2, signal: "USD softer" },
  { name: "Crack Spread", value: 27.8, change: 1.1, signal: "Refining bid" },
  { name: "Jet Fuel", value: 2.86, change: 0.3, signal: "Demand firm" }
];

export const demoShippingEnergyStocks = [
  { symbol: "HAL", name: "Halliburton", sector: "Oilfield Services", change: 1.4, price: 38.6 },
  { symbol: "SLB", name: "SLB", sector: "Oilfield Services", change: 0.9, price: 52.3 },
  { symbol: "XOM", name: "Exxon Mobil", sector: "Integrated Energy", change: 0.6, price: 116.2 },
  { symbol: "CVX", name: "Chevron", sector: "Integrated Energy", change: 0.4, price: 158.7 },
  { symbol: "VLO", name: "Valero", sector: "Refining", change: 1.1, price: 159.9 },
  { symbol: "MPC", name: "Marathon Petroleum", sector: "Refining", change: 0.8, price: 171.4 },
  { symbol: "ZIM", name: "ZIM Integrated", sector: "Shipping", change: -0.7, price: 12.9 },
  { symbol: "SFL", name: "SFL Corp", sector: "Shipping", change: 0.5, price: 13.8 }
];

export const demoNewsDrivers = [
  { driver: "Supply disruptions", score: 0.64 },
  { driver: "Shipping constraints", score: 0.58 },
  { driver: "Inventory draw", score: 0.52 },
  { driver: "Demand softness", score: 0.41 }
];

export const demoModelSignals = [
  { label: "Regime", value: "Backwardation", detail: "Prompt spreads widening" },
  { label: "Risk", value: "Elevated", detail: "Vol surface steep" },
  { label: "Bias", value: "Bullish", detail: "Signal stack aligned" },
  { label: "Confidence", value: "0.67", detail: "Ensemble vote" }
];

export const demoMlPipeline = [
  {
    stage: "Ingest",
    detail: "FRED + OWID + AIS + headlines",
    latency: "120ms"
  },
  {
    stage: "Features",
    detail: "term structure, vol regime, spreads",
    latency: "180ms"
  },
  {
    stage: "Models",
    detail: "ARIMA, XGBoost, LSTM ensemble",
    latency: "410ms"
  },
  {
    stage: "Risk",
    detail: "stress score, drawdown, skew",
    latency: "95ms"
  },
  {
    stage: "Publish",
    detail: "signal, forecast, narrative",
    latency: "70ms"
  }
];

export const demoCodeBlocks = [
  {
    title: "Model Orchestrator",
    code: "def run_ensemble(X, y):\n    preds = []\n    preds.append(arima_forecast(X))\n    preds.append(xgb_predict(X))\n    preds.append(lstm_predict(X))\n    return np.average(preds, axis=0, weights=[0.2, 0.5, 0.3])"
  },
  {
    title: "Signal Engine",
    code: "signal = (trend_score * 0.4) + (risk_score * 0.35) + (news_score * 0.25)\nconfidence = sigmoid(2.4 * signal - 0.8)"
  },
  {
    title: "Forecast Gate",
    code: "if vol_regime == 'high':\n    forecast = dampen(forecast, factor=0.85)\n    bands = widen(bands, pct=0.12)"
  }
];
