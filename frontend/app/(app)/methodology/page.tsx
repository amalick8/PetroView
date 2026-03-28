import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

export default function MethodologyPage() {
  return (
    <main className="min-h-screen px-6 pb-24">
      <section className="mx-auto max-w-5xl pt-16">
        <Badge>Methodology</Badge>
        <h1 className="mt-4 font-display text-3xl text-white">PetroView Methodology</h1>
        <p className="mt-2 text-mist/70">
          Public data sources, signal construction, and forecast diagnostics powering the intelligence terminal.
        </p>

        <div className="mt-8 grid gap-6">
          <Card className="p-6">
            <SectionTitle title="Data Sources" subtitle="Public market feeds" />
            <ul className="mt-4 space-y-2 text-sm text-mist/70">
              <li>FRED WTI spot price series with daily updates and normalization.</li>
              <li>OWID energy production data for supply concentration mapping.</li>
              <li>Curated headline feeds scored for sentiment and disruption risk.</li>
            </ul>
          </Card>
          <Card className="p-6">
            <SectionTitle title="Signal Engine" subtitle="Composite intelligence" />
            <ul className="mt-4 space-y-2 text-sm text-mist/70">
              <li>Momentum + drawdown regime classification for directional bias.</li>
              <li>Volatility percentile + stress scoring for regime labeling.</li>
              <li>News-weighted risk overlay to adjust confidence and risk level.</li>
            </ul>
          </Card>
          <Card className="p-6">
            <SectionTitle title="Forecasting" subtitle="Model suite" />
            <ul className="mt-4 space-y-2 text-sm text-mist/70">
              <li>Naive, linear, and ARIMA baselines evaluated for error metrics.</li>
              <li>Best-fit model chosen by MAE/RMSE with confidence band estimation.</li>
              <li>Horizon bundles published for 7/30/60 day windows.</li>
            </ul>
          </Card>
        </div>
      </section>
    </main>
  );
}
