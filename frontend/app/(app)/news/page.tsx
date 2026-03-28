import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { SectionTitle } from "@/components/ui/section-title";
import type { IntelligenceSummary } from "@/lib/intelligence";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type NewsSignals = IntelligenceSummary["news"];

async function getNews(): Promise<NewsSignals | null> {
  try {
    const res = await fetch(`${baseUrl}/api/v1/news/latest`, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as NewsSignals;
  } catch {
    return null;
  }
}

export default async function NewsPage() {
  const news = await getNews();
  const headlines = news?.headlines ?? [];

  return (
    <main className="min-h-screen px-6 pb-24">
      <section className="mx-auto max-w-6xl pt-16">
        <Badge>News</Badge>
        <h1 className="mt-4 font-display text-3xl text-white">News-Aware Risk Feed</h1>
        <p className="mt-2 text-mist/70">Headline scoring and supply disruption risk signals.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="p-6">
            <SectionTitle title="Sentiment" subtitle="Market tone" />
            <div className="mt-4 grid gap-3">
              <Metric label="Sentiment" value={(news?.sentiment_score ?? 0.28).toFixed(2)} />
              <Metric label="Risk" value={(news?.risk_score ?? 0.44).toFixed(2)} />
              <Metric label="Supply Risk" value={(news?.supply_disruption_score ?? 0.58).toFixed(2)} />
              <Metric label="Directional" value={(news?.directional_score ?? 0.1).toFixed(2)} />
            </div>
          </Card>
          <Card className="p-6 lg:col-span-2">
            <SectionTitle title="Latest Headlines" subtitle="Risk-weighted" />
            <div className="mt-4 space-y-4 text-sm text-mist/70">
              {headlines.slice(0, 8).map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-panel/60 p-4">
                  <p className="text-white/90">{item.title}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-mist/60">
                    <span>{item.source}</span>
                    <span>Risk {item.risk.toFixed(2)}</span>
                    <span>Sentiment {item.sentiment.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {!headlines.length ? (
                <p className="text-sm text-mist/60">No headlines available.</p>
              ) : null}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
