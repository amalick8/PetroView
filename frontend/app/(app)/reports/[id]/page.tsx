import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function Reports() {
	return (
		<main className="min-h-screen px-6 pb-24">
			<section className="mx-auto max-w-5xl pt-16">
				<Badge>Reports</Badge>
				<h1 className="mt-4 font-display text-3xl text-white">Notebook Viewer</h1>
				<p className="mt-2 text-mist/70">Rendered analytic reports and methodology notes.</p>

				<div className="mt-8">
					<Card className="p-6">
						<h2 className="font-display text-xl text-white">PetroView Market Intelligence Report</h2>
						<p className="mt-2 text-mist/70">Exported notebook ready for sharing.</p>
					</Card>
				</div>
			</section>
		</main>
	);
}
