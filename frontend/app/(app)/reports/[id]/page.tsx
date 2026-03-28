import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { demoReportMeta } from "@/lib/demo-data";

export default function Reports() {
	return (
		<main className="min-h-screen px-6 pb-24">
			<section className="mx-auto max-w-5xl pt-16">
				<Badge>Reports</Badge>
				<h1 className="mt-4 font-display text-3xl text-white">Notebook Viewer</h1>
				<p className="mt-2 text-mist/70">Rendered analytic reports and methodology notes.</p>

				<div className="mt-8">
					<Card className="p-6">
						<h2 className="font-display text-xl text-white">{demoReportMeta.title}</h2>
						<p className="mt-2 text-mist/70">
							{demoReportMeta.format} • {demoReportMeta.pages} pages • Updated {demoReportMeta.updated}
						</p>
						<p className="mt-4 text-sm text-mist/60">Prepared by {demoReportMeta.author}</p>
					</Card>
				</div>
			</section>
		</main>
	);
}
