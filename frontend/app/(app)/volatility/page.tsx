import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { SectionTitle } from "@/components/ui/section-title";
import { VolatilityChart } from "@/components/charts/area-chart";
import { demoVolatilitySeries } from "@/lib/demo-data";
import type { IntelligenceSummary } from "@/lib/intelligence";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type VolatilitySummary = IntelligenceSummary["volatility"];

async function getVolatility(): Promise<VolatilitySummary | null> {
  try {
    const res = await fetch(`${baseUrl}/api/v1/volatility/latest`, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as VolatilitySummary;
  } catch {
    return null;
  }
}

export default async function VolatilityPage() {
  const volatility = await getVolatility();
  const series = volatility?.rolling_30?.length ? volatility.rolling_30 : demoVolatilitySeries;

  return (
    <main className="min-h-screen px-6 pb-24">
      <section className="mx-auto max-w-6xl pt-16">
        <Badge>Volatility</Badge>
        <h1 className="mt-4 font-display text-3xl text-white">Volatility Regime Monitor</h1>
        <p className="mt-2 text-mist/70">Rolling volatility, percentile rank, and stress signals.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <SectionTitle title="Rolling 30D Volatility" subtitle="Regime tracking" />
            <div className="mt-4">
              <VolatilityChart data={series} />
            </div>
          </Card>
          <Card className="p-6">
            <SectionTitle title="Regime Stats" subtitle="Latest print" />
            <div className="mt-4 grid gap-3">
              <Metric label="Current" value={(volatility?.current ?? 0.26).toFixed(2)} />
              <Metric label="Percentile" value={`${(volatility?.percentile ?? 68).toFixed(0)}th`} />
              <Metric label="Regime" value={volatility?.regime ?? "high"} />
              <Metric label="Stress" value={volatility?.stress ?? "elevated"} />
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
