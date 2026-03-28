import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { PriceTrendChart } from "@/components/charts/line-chart";
import { VolatilityChart } from "@/components/charts/area-chart";
import { SupplyConcentrationChart } from "@/components/charts/bar-chart";
import { PriceForecastChart } from "@/components/charts/price-forecast-chart";
import { SectionTitle } from "@/components/ui/section-title";
import type { IntelligenceSummary } from "@/lib/intelligence";
import { demoInsights, demoPriceSeries, demoSupplyDistribution, demoVolatilitySeries } from "@/lib/demo-data";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function getIntelligenceSummary(): Promise<IntelligenceSummary | null> {
  try {
    const res = await fetch(`${baseUrl}/api/v1/intelligence/summary`, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as IntelligenceSummary;
  } catch {
    return null;
  }
}

export default async function Dashboard() {
  const intelligence = await getIntelligenceSummary();
  const scanner = intelligence?.scanner;
  const volatility = intelligence?.volatility;
  const forecast = intelligence?.forecast;
  const news = intelligence?.news;
  const signal = intelligence?.signal;
  const macro = intelligence?.macro;

	const priceSeries = intelligence?.price_series?.length ? intelligence.price_series : demoPriceSeries;
	const volSeries = volatility?.rolling_30?.length ? volatility.rolling_30 : demoVolatilitySeries;
	const supplySeries = intelligence?.supply_distribution?.length ? intelligence.supply_distribution : demoSupplyDistribution;
  const forecastHorizon = forecast?.horizons?.find((horizon) => horizon.horizon_days === 30) ?? forecast?.horizons?.[0];
	const forecastSeries = forecastHorizon
		? forecastHorizon.dates.map((date, idx) => ({ date, forecast: forecastHorizon.values[idx] }))
		: [];
	return (
		<main className="min-h-screen px-6 pb-24">
			<section className="mx-auto max-w-6xl pt-16">
				<Badge>Dashboard</Badge>
				<h1 className="mt-4 font-display text-3xl text-white">Energy Intelligence Console</h1>
				<p className="mt-2 text-mist/70">
					Market scanning, volatility intelligence, and predictive signals calibrated for institutional oil desks.
				</p>

				<div className="mt-8 grid gap-4 lg:grid-cols-6">
					<Metric label="WTI Spot" value={`$${scanner?.latest_price.toFixed(2) ?? "93.7"}`} detail="Latest" />
					<Metric
						label="7D Return"
						value={`${((scanner?.return_7d ?? 0.016) * 100).toFixed(2)}%`}
						detail="Short-term drift"
					/>
					<Metric
						label="30D Return"
						value={`${((scanner?.return_30d ?? 0.034) * 100).toFixed(2)}%`}
						detail="Monthly trend"
					/>
					<Metric label="Forecast" value={forecast?.direction ?? "bullish"} detail="Directional" />
					<Metric label="Volatility" value={scanner?.volatility_regime ?? "high"} detail="Regime" />
					<Metric label="Market Stress" value={scanner?.stress_level ?? "elevated"} detail="Risk" />
				</div>

				<div className="mt-10 grid gap-6 lg:grid-cols-3">
					<Card className="p-6 lg:col-span-2">
						<div className="flex items-center justify-between">
							<h2 className="font-display text-xl text-white">Historical Price + Forecast</h2>
							<span className="text-sm text-mist/60">30-day horizon</span>
						</div>
						<div className="mt-4">
							<PriceForecastChart actual={priceSeries} forecast={forecastSeries} />
						</div>
					</Card>
					<Card className="p-6">
						<SectionTitle title="Signal Summary" subtitle="Composite signal engine" />
						<div className="mt-4 grid gap-3">
							<Metric label="Direction" value={signal?.direction ?? "bullish"} />
							<Metric label="Strength" value={(signal?.strength ?? 0.71).toFixed(2)} />
							<Metric label="Confidence" value={(signal?.confidence ?? 0.63).toFixed(2)} />
							<Metric label="Risk" value={signal?.risk_level ?? "elevated"} />
						</div>
					</Card>
				</div>

				<div className="mt-10 grid gap-6 lg:grid-cols-3">
					<Card className="p-6">
						<SectionTitle title="Volatility Intelligence" subtitle="Regime + stress tracking" />
						<div className="mt-4">
							<VolatilityChart data={volSeries} />
						</div>
						<div className="mt-4 grid gap-3">
							<Metric
								label="Percentile"
								value={`${(volatility?.percentile ?? 68).toFixed(0)}th`}
							/>
							<Metric label="Stress" value={volatility?.stress ?? "elevated"} />
							<Metric
								label="Drawdown 90D"
								value={`${((volatility?.drawdown_90d ?? -0.08) * 100).toFixed(1)}%`}
							/>
						</div>
					</Card>
					<Card className="p-6">
						<SectionTitle title="News Risk" subtitle="Headline-driven risk scoring" />
						<div className="mt-4 grid gap-3">
							<Metric label="Sentiment" value={(news?.sentiment_score ?? 0.28).toFixed(2)} />
							<Metric label="Risk" value={(news?.risk_score ?? 0.44).toFixed(2)} />
							<Metric
								label="Supply Risk"
								value={(news?.supply_disruption_score ?? 0.58).toFixed(2)}
							/>
						</div>
						<div className="mt-4 space-y-3 text-sm text-mist/70">
							{(news?.headlines ?? []).slice(0, 3).map((item) => (
								<div key={item.title} className="border-b border-white/5 pb-3">
									<p className="text-white/90">{item.title}</p>
									<p className="mt-1 text-xs text-mist/50">{item.source}</p>
								</div>
							))}
						</div>
					</Card>
					<Card className="p-6">
						<SectionTitle title="Macro Context" subtitle="Key co-movements" />
						<div className="mt-4 space-y-4 text-sm text-mist/70">
							<div className="flex items-center justify-between">
								<span>Dollar Index Corr</span>
								<span className="text-white">{macro?.correlations?.dollar_index?.toFixed(2) ?? "-0.31"}</span>
							</div>
							<div className="flex items-center justify-between">
								<span>Inflation Corr</span>
								<span className="text-white">{macro?.correlations?.inflation_proxy?.toFixed(2) ?? "0.18"}</span>
							</div>
							<div className="flex items-center justify-between">
								<span>Industry Corr</span>
								<span className="text-white">{macro?.correlations?.industrial_output?.toFixed(2) ?? "0.27"}</span>
							</div>
						</div>
						<div className="mt-6 rounded-2xl border border-white/10 bg-slate/70 p-4 text-sm text-mist/70">
							<p className="text-xs uppercase tracking-[0.2em] text-gold/70">Macro read</p>
							<p className="mt-2">
								Dollar softness and steady industrial prints keep demand conditions supportive.
							</p>
						</div>
					</Card>
				</div>

				<div className="mt-10 grid gap-6 lg:grid-cols-3">
					<Card className="p-6">
						<SectionTitle title="Shock Timeline" subtitle="Recent downside anomalies" />
						<div className="mt-4 space-y-3 text-sm text-mist/70">
							{(intelligence?.shock_timeline ?? []).slice(0, 5).map((event) => (
								<div key={event.date} className="flex items-center justify-between">
									<span>{event.date}</span>
									<span className="text-white">{(event.return * 100).toFixed(2)}%</span>
								</div>
							))}
							{!intelligence?.shock_timeline?.length ? (
								<p className="text-sm text-mist/60">No significant shocks in the recent window.</p>
							) : null}
						</div>
					</Card>
					<Card className="p-6 lg:col-span-2">
						<SectionTitle title="Signal Reasoning" subtitle="Key drivers feeding the intelligence engine" />
						<ul className="mt-4 space-y-2 text-sm text-mist/70">
							{(signal?.reasoning ?? []).map((reason) => (
								<li key={reason} className="border-b border-white/5 pb-2">
									{reason}
								</li>
							))}
						</ul>
					</Card>
				</div>

				<div className="mt-10 grid gap-6 lg:grid-cols-3">
					<Card className="p-6">
						<SectionTitle title="Supply Concentration" subtitle="Latest production estimates" />
						<div className="mt-4">
							<SupplyConcentrationChart data={supplySeries} />
						</div>
					</Card>
					<Card className="p-6 lg:col-span-2">
						<SectionTitle title="Model Comparison" subtitle="Forecast performance snapshot" />
						<div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
							<table className="w-full text-left text-sm text-mist/70">
								<thead className="bg-slate/80 text-xs uppercase tracking-[0.2em] text-mist/50">
									<tr>
										<th className="px-4 py-3">Model</th>
										<th className="px-4 py-3">MAE</th>
										<th className="px-4 py-3">RMSE</th>
										<th className="px-4 py-3">MAPE</th>
									</tr>
								</thead>
								<tbody>
									{(forecast?.model_comparison ?? []).map((model) => (
										<tr key={model.model} className="border-t border-white/5">
											<td className="px-4 py-3 text-white">{model.model}</td>
											<td className="px-4 py-3">{model.mae?.toFixed(2) ?? "-"}</td>
											<td className="px-4 py-3">{model.rmse?.toFixed(2) ?? "-"}</td>
											<td className="px-4 py-3">{model.mape?.toFixed(2) ?? "-"}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Card>
				</div>

				<div className="mt-10 grid gap-6 lg:grid-cols-3">
					{demoInsights.map((insight) => (
						<Card key={insight.label} className="p-6">
							<p className="text-xs uppercase tracking-[0.25em] text-gold/70">{insight.label}</p>
							<p className="mt-3 text-2xl font-semibold text-white">{insight.value}</p>
							<p className="mt-2 text-sm text-mist/70">{insight.detail}</p>
						</Card>
					))}
				</div>
			</section>
		</main>
	);
}
