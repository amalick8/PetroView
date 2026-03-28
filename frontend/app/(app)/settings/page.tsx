import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function Settings() {
	return (
		<main className="min-h-screen px-6 pb-24">
			<section className="mx-auto max-w-4xl pt-16">
				<Badge>Settings</Badge>
				<h1 className="mt-4 font-display text-3xl text-white">Workspace Settings</h1>
				<p className="mt-2 text-mist/70">Manage data refresh and model preferences.</p>

				<div className="mt-8 grid gap-6">
					<Card className="p-6">
						<h2 className="font-display text-xl text-white">Data Refresh</h2>
						<p className="mt-2 text-mist/70">Schedule daily ingestion and weekly backfills.</p>
					</Card>
					<Card className="p-6">
						<h2 className="font-display text-xl text-white">Model Preferences</h2>
						<p className="mt-2 text-mist/70">Default forecast horizon and risk alert thresholds.</p>
					</Card>
				</div>
			</section>
		</main>
	);
}
