import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { SectionTitle } from "@/components/ui/section-title";
import { PriceForecastChart } from "@/components/charts/price-forecast-chart";
import { demoForecastMetrics, demoForecastValues, demoPriceSeries } from "@/lib/demo-data";
import type { IntelligenceSummary } from "@/lib/intelligence";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type ForecastBundle = IntelligenceSummary["forecast"];

type PricePoint = { date: string; price: number };

type ForecastPoint = { date: string; forecast: number; lower?: number; upper?: number };

async function getLatestForecast(): Promise<ForecastBundle | null> {
  try {
    const res = await fetch(`${baseUrl}/api/v1/forecast/latest`, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as ForecastBundle;
  } catch {
    return null;
  }
}

async function getPriceSeries(): Promise<PricePoint[]> {
  try {
    const res = await fetch(`${baseUrl}/api/v1/intelligence/summary`, { cache: "no-store" });
    if (!res.ok) {
      return demoPriceSeries;
    }
    const data = (await res.json()) as IntelligenceSummary;
    return data.price_series?.length ? data.price_series : demoPriceSeries;
  } catch {
    return demoPriceSeries;
  }
}

export default async function ForecastPage() {
  const [forecast, priceSeries] = await Promise.all([getLatestForecast(), getPriceSeries()]);
  const horizon = forecast?.horizons?.find((item) => item.horizon_days === 30) ?? forecast?.horizons?.[0];
  const forecastSeries: ForecastPoint[] = horizon
    ? horizon.dates.map((date, idx) => ({
        date,
        forecast: horizon.values[idx],
        lower: horizon.lower?.[idx],
        upper: horizon.upper?.[idx]
      }))
    : [];
  const rangeStart = horizon?.lower?.[0] ?? demoForecastValues[0];
  const rangeEnd = horizon?.upper?.[Math.max((horizon?.upper?.length ?? 1) - 1, 0)] ??
    demoForecastValues[demoForecastValues.length - 1];

  return (
    <main className="min-h-screen px-6 pb-24">
      <section className="mx-auto max-w-6xl pt-16">
        <Badge>Forecast</Badge>
        <h1 className="mt-4 font-display text-3xl text-white">Public Price Forecast</h1>
        <p className="mt-2 text-mist/70">
          Latest multi-model forecast bundle with directional bias, confidence, and model diagnostics.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <SectionTitle title="Price + Forecast" subtitle="Latest horizon" />
            <div className="mt-4">
              <PriceForecastChart actual={priceSeries} forecast={forecastSeries} />
            </div>
          </Card>
          <Card className="p-6">
            <SectionTitle title="Signal" subtitle="Forecast posture" />
            <div className="mt-4 grid gap-3">
              <Metric label="Direction" value={forecast?.direction ?? "bullish"} />
              <Metric label="Confidence" value={(forecast?.confidence ?? 0.63).toFixed(2)} />
              <Metric label="Model" value={forecast?.model_used ?? horizon?.model ?? demoForecastMetrics.model} />
              <Metric label="Horizon" value={`${horizon?.horizon_days ?? 30} days`} />
            </div>
          </Card>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card className="p-6">
            <SectionTitle title="Projected Range" subtitle="Next 10 sessions" />
            <p className="mt-4 text-sm text-mist/70">
              ${rangeStart.toFixed(1)} - ${rangeEnd.toFixed(1)}
            </p>
            <div className="mt-4 grid gap-2">
              <Metric label="MAE" value={(forecast?.mae ?? demoForecastMetrics.mae).toFixed(2)} />
              <Metric label="RMSE" value={(forecast?.rmse ?? demoForecastMetrics.rmse).toFixed(2)} />
            </div>
          </Card>
          <Card className="p-6 lg:col-span-2">
            <SectionTitle title="Model Comparison" subtitle="Performance snapshot" />
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
                      <td className="px-4 py-3">{model.mae?.toFixed(2) ?? demoForecastMetrics.mae}</td>
                      <td className="px-4 py-3">{model.rmse?.toFixed(2) ?? demoForecastMetrics.rmse}</td>
                      <td className="px-4 py-3">{model.mape?.toFixed(2) ?? demoForecastMetrics.mape}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
