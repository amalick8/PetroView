import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PriceTrendChart } from "@/components/charts/line-chart";
import { VolatilityChart } from "@/components/charts/area-chart";
import { SupplyConcentrationChart } from "@/components/charts/bar-chart";
import { demoInsights } from "@/lib/demo-data";

export default function Dashboard() {
	return (
		<main className="min-h-screen px-6 pb-24">
			<section className="mx-auto max-w-6xl pt-16">
				<Badge>Dashboard</Badge>
				<h1 className="mt-4 font-display text-3xl text-white">Market Overview</h1>
				<p className="mt-2 text-mist/70">
					Real-time signals across price momentum, volatility regime, and supply concentration.
				</p>

				<div className="mt-8 grid gap-6 lg:grid-cols-3">
					{demoInsights.map((insight) => (
						<Card key={insight.label} className="p-6">
							<p className="text-xs uppercase tracking-[0.25em] text-gold/70">{insight.label}</p>
							<p className="mt-3 text-2xl font-semibold text-white">{insight.value}</p>
							<p className="mt-2 text-sm text-mist/70">{insight.detail}</p>
						</Card>
					))}
				</div>

				<div className="mt-10 grid gap-6 lg:grid-cols-3">
					<Card className="p-6 lg:col-span-2">
						<div className="flex items-center justify-between">
							<h2 className="font-display text-xl text-white">WTI Spot Price</h2>
							<span className="text-sm text-mist/60">Last 6 months</span>
						</div>
						<div className="mt-4">
							<PriceTrendChart />
						</div>
					</Card>
					<Card className="p-6">
						<h2 className="font-display text-xl text-white">Volatility Pulse</h2>
						<p className="mt-2 text-sm text-mist/70">Rolling standard deviation of daily returns.</p>
						<div className="mt-4">
							<VolatilityChart />
						</div>
					</Card>
				</div>

				<div className="mt-10 grid gap-6 lg:grid-cols-3">
					<Card className="p-6 lg:col-span-2">
						<h2 className="font-display text-xl text-white">Supply Concentration</h2>
						<p className="mt-2 text-sm text-mist/70">Latest production estimates by country.</p>
						<div className="mt-4">
							<SupplyConcentrationChart />
						</div>
					</Card>
					<Card className="p-6">
						<h2 className="font-display text-xl text-white">Executive Insight</h2>
						<p className="mt-2 text-sm text-mist/70">
							Price momentum remains constructive, but concentration risk keeps volatility elevated.
						</p>
						<div className="mt-6 rounded-2xl border border-white/10 bg-slate/70 p-4">
							<p className="text-xs uppercase tracking-[0.2em] text-gold/70">Key watch</p>
							<p className="mt-2 text-lg font-semibold text-white">Supply shock probability: Moderate</p>
						</div>
					</Card>
				</div>
			</section>
		</main>
	);
}
