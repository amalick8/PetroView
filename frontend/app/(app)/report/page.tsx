import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { demoReportMeta } from "@/lib/demo-data";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type ReportRead = {
  id: number;
  title: string;
  path: string;
  created_at?: string | null;
};

async function getLatestReport(): Promise<ReportRead | null> {
  try {
    const res = await fetch(`${baseUrl}/api/v1/report/latest`, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as ReportRead;
  } catch {
    return null;
  }
}

export default async function ReportPage() {
  const report = await getLatestReport();

  return (
    <main className="min-h-screen px-6 pb-24">
      <section className="mx-auto max-w-6xl pt-16">
        <Badge>Report</Badge>
        <h1 className="mt-4 font-display text-3xl text-white">Public Intelligence Report</h1>
        <p className="mt-2 text-mist/70">Latest generated report and methodology notes.</p>

        <div className="mt-8 grid gap-6">
          <Card className="p-6">
            <SectionTitle title={report?.title ?? demoReportMeta.title} subtitle="Notebook export" />
            <div className="mt-4 text-sm text-mist/70">
              <p>Path: {report?.path ?? "./data/reports/latest.ipynb"}</p>
              <p className="mt-2">Updated: {report?.created_at ?? demoReportMeta.updated}</p>
              <p className="mt-2">Prepared by {demoReportMeta.author}</p>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
