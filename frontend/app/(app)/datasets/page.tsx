import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const datasets = [
	{
		name: "WTI Spot Price",
		source: "FRED",
		rows: "9,400",
		coverage: "1986 - present",
		quality: "98% complete",
		updated: "2 hours ago"
	},
	{
		name: "OWID Energy",
		source: "OWID",
		rows: "218,000",
		coverage: "1900 - present",
		quality: "95% complete",
		updated: "1 day ago"
	}
];

export default function Datasets() {
	return (
		<main className="min-h-screen px-6 pb-24">
			<section className="mx-auto max-w-5xl pt-16">
				<Badge>Datasets</Badge>
				<h1 className="mt-4 font-display text-3xl text-white">Data Sources</h1>
				<p className="mt-2 text-mist/70">Track ingestion status, coverage, and quality signals.</p>

				<div className="mt-8 grid gap-6">
					{datasets.map((dataset) => (
						<Card key={dataset.name} className="p-6">
							<div className="flex items-start justify-between">
								<div>
									<h2 className="font-display text-xl text-white">{dataset.name}</h2>
									<p className="mt-1 text-sm text-mist/70">Source: {dataset.source}</p>
								</div>
								<span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-gold">
									{dataset.updated}
								</span>
							</div>
							<div className="mt-4 grid gap-4 text-sm text-mist/70 md:grid-cols-3">
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-mist/50">Rows</p>
									<p className="mt-1 text-white">{dataset.rows}</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-mist/50">Coverage</p>
									<p className="mt-1 text-white">{dataset.coverage}</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-mist/50">Quality</p>
									<p className="mt-1 text-white">{dataset.quality}</p>
								</div>
							</div>
						</Card>
					))}
				</div>
			</section>
		</main>
	);
}
