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
