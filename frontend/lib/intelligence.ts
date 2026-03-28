export type IntelligenceSummary = {
  timestamp: string;
  scanner: {
    latest_price: number;
    return_7d: number;
    return_30d: number;
    momentum_regime: string;
    directional_bias: string;
    shock_risk_score: number;
    confidence_score: number;
    drawdown_90d: number;
    key_drivers: string[];
    volatility_regime: string;
    stress_level: string;
  };
  volatility: {
    current: number;
    percentile: number;
    regime: string;
    stress: string;
    drawdown_90d: number;
    spike_count_90d: number;
    rolling_30: { date: string; value: number }[];
  };
  forecast: {
    direction: string;
    confidence: number;
    horizons: {
      horizon_days: number;
      model: string;
      dates: string[];
      values: number[];
      lower: number[];
      upper: number[];
    }[];
    model_comparison: { model: string; mae?: number; rmse?: number; mape?: number }[];
  };
  news: {
    sentiment_score: number;
    risk_score: number;
    supply_disruption_score: number;
    directional_score: number;
    category_counts: Record<string, number>;
    headlines: {
      title: string;
      source: string;
      category: string;
      sentiment: number;
      risk: number;
      published_at: string;
    }[];
  };
  macro: {
    series: Record<string, { date: string; value: number }[]>;
    correlations: Record<string, number>;
  };
  signal: {
    direction: string;
    strength: number;
    confidence: number;
    risk_level: string;
    reasoning: string[];
  };
};
