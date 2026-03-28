"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
	{
		title: "Live Market Ingestion",
		description: "Continuously pulls WTI pricing, global supply, and macro context for clean, aligned analysis."
	},
	{
		title: "Forecast Intelligence",
		description: "Multi-model time-series forecasting with confidence bands and transparent error metrics."
	},
	{
		title: "Supply Shock Detection",
		description: "Detects abrupt production changes and flags potential disruptions with context and risk notes."
	}
];

export default function Home() {
	return (
		<main className="min-h-screen px-6 pb-24">
			<section className="mx-auto max-w-6xl pt-20">
				<Badge>PetroView</Badge>
				<div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-6xl">
							AI-powered energy intelligence for modern oil market decisions.
						</h1>
						<p className="mt-6 text-lg text-mist/80">
							PetroView fuses real-time data ingestion, rigorous statistical analysis, and predictive modeling
							into a single premium analytics workspace for energy analysts and decision-makers.
						</p>
						<div className="mt-8 flex flex-wrap gap-4">
							<Button size="lg" asChild>
								<Link href="/dashboard">Enter Dashboard</Link>
							</Button>
							<Button size="lg" variant="outline">
								Request Demo
							</Button>
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.1 }}
					>
						<Card className="p-8">
							<p className="text-sm uppercase tracking-[0.3em] text-gold/70">Market Pulse</p>
							<p className="mt-4 text-3xl font-semibold text-white">WTI 3-Month Outlook</p>
							<p className="mt-4 text-mist/70">
								A consolidated view of price momentum, volatility regimes, and supply concentration indicators.
							</p>
							<div className="mt-6 grid gap-4">
								<div className="rounded-2xl border border-white/10 bg-panel/60 px-4 py-3">
									<p className="text-xs text-mist/60">Volatility Regime</p>
									<p className="text-lg font-semibold text-white">Elevated, moderating</p>
								</div>
								<div className="rounded-2xl border border-white/10 bg-panel/60 px-4 py-3">
									<p className="text-xs text-mist/60">Supply Concentration</p>
									<p className="text-lg font-semibold text-white">HHI 0.24 (High)</p>
								</div>
							</div>
						</Card>
					</motion.div>
				</div>
			</section>

			<section className="mx-auto mt-24 max-w-6xl">
				<div className="grid gap-6 md:grid-cols-3">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
						>
							<Card className="p-6">
								<h3 className="font-display text-xl text-white">{feature.title}</h3>
								<p className="mt-3 text-sm text-mist/70">{feature.description}</p>
							</Card>
						</motion.div>
					))}
				</div>
			</section>

			<section className="mx-auto mt-24 max-w-6xl">
				<div className="grid gap-8 rounded-3xl border border-white/10 bg-panel/60 p-10 lg:grid-cols-[1.1fr_0.9fr]">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-gold/70">Predictive Intelligence</p>
						<h2 className="mt-4 font-display text-3xl text-white">
							Multi-model forecasting with grounded, transparent insight.
						</h2>
						<p className="mt-4 text-mist/70">
							We blend ARIMA baselines, feature-driven regression, and volatility-aware diagnostics to surface
							plausible forward price regimes and supply risk signals.
						</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-slate/70 p-6">
						<p className="text-sm text-mist/60">Confidence Band</p>
						<p className="mt-4 text-4xl font-semibold text-white">$86.4 - $94.2</p>
						<p className="mt-2 text-sm text-mist/60">30-day forward range, updated 2 hours ago</p>
					</div>
				</div>
			</section>
		</main>
	);
}
