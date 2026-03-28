import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AnalysisDetail() {
	return (
		<main className="min-h-screen px-6 pb-24">
			<section className="mx-auto max-w-5xl pt-16">
				<Badge>Analysis</Badge>
				<h1 className="mt-4 font-display text-3xl text-white">Market Structure Deep Dive</h1>
				<p className="mt-2 text-mist/70">
					Structural indicators, shock detection, and correlation signals for the latest data refresh.
				</p>

				<div className="mt-8 grid gap-6">
					<Card className="p-6">
						<h2 className="font-display text-xl text-white">Headline Findings</h2>
						<p className="mt-2 text-mist/70">
							Supply concentration remains high with a modest increase in volatility following recent output
							declines in key producers.
						</p>
					</Card>
					<Card className="p-6">
						<h2 className="font-display text-xl text-white">Shock Timeline</h2>
						<p className="mt-2 text-mist/70">
							Four production anomalies detected in the last 24 months with outsized price responses.
						</p>
					</Card>
				</div>
			</section>
		</main>
	);
}
