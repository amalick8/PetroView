import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { demoForecastMetrics, demoForecastValues } from "@/lib/demo-data";

export default function ForecastDetail() {
	return (
		<main className="min-h-screen px-6 pb-24">
			<section className="mx-auto max-w-5xl pt-16">
				<Badge>Forecast</Badge>
				<h1 className="mt-4 font-display text-3xl text-white">Price Forecast</h1>
				<p className="mt-2 text-mist/70">
					Multi-model forecast outlook with confidence intervals and error metrics.
				</p>

				<div className="mt-8 grid gap-6">
					<Card className="p-6">
						<h2 className="font-display text-xl text-white">Forecast Horizon</h2>
						<p className="mt-2 text-mist/70">{demoForecastMetrics.horizon} using {demoForecastMetrics.model}.</p>
					</Card>
					<Card className="p-6">
						<h2 className="font-display text-xl text-white">Model Metrics</h2>
						<p className="mt-2 text-mist/70">
							MAE {demoForecastMetrics.mae} | RMSE {demoForecastMetrics.rmse} | MAPE {demoForecastMetrics.mape}%
						</p>
					</Card>
					<Card className="p-6">
						<h2 className="font-display text-xl text-white">Projected Range</h2>
						<p className="mt-2 text-mist/70">
							Next 10 sessions: ${demoForecastValues[0].toFixed(1)} → ${demoForecastValues[
								demoForecastValues.length - 1
							].toFixed(1)}
						</p>
					</Card>
				</div>
			</section>
		</main>
	);
}
