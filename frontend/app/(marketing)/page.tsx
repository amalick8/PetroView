"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { SectionTitle } from "@/components/ui/section-title";
import { PriceTrendChart } from "@/components/charts/line-chart";
import { VolatilityChart } from "@/components/charts/area-chart";
import { PriceForecastChart } from "@/components/charts/price-forecast-chart";
import type { IntelligenceSummary } from "@/lib/intelligence";
import {
	demoAnalysisSummary,
	demoPriceSeries,
	demoVolatilitySeries
} from "@/lib/demo-data";

type RecentItem = { id: number; summary: string };

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function Home() {
	const [intelligence, setIntelligence] = useState<IntelligenceSummary | null>(null);
	const [recentSummary, setRecentSummary] = useState<string>(demoAnalysisSummary);

	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch(`${baseUrl}/api/v1/intelligence/summary`, { cache: "no-store" });
				if (res.ok) {
					const data = (await res.json()) as IntelligenceSummary;
					setIntelligence(data);
				}
			} catch {
				setIntelligence(null);
			}

			try {
				const res = await fetch(`${baseUrl}/api/v1/dashboard/recent`, { cache: "no-store" });
				if (res.ok) {
					const data = (await res.json()) as { items: RecentItem[] };
					if (data.items?.length) {
						setRecentSummary(data.items[0].summary);
					}
				}
			} catch {
				setRecentSummary(demoAnalysisSummary);
			}
		};

		load();
	}, []);

	const priceSeries = intelligence?.price_series?.length ? intelligence.price_series : demoPriceSeries;
	const volatilitySeries = intelligence?.volatility?.rolling_30?.length
		? intelligence.volatility.rolling_30
		: demoVolatilitySeries;
	const forecastHorizon = intelligence?.forecast?.horizons?.find((horizon) => horizon.horizon_days === 30);
	const forecastSeries = forecastHorizon
		? forecastHorizon.dates.map((date, idx) => ({ date, forecast: forecastHorizon.values[idx] }))
		: [];

	const metrics = useMemo(() => {
		const scanner = intelligence?.scanner;
		const volatility = intelligence?.volatility;
		const forecast = intelligence?.forecast;
		const signal = intelligence?.signal;
		const news = intelligence?.news;

		return {
			price: scanner?.latest_price ?? 93.7,
			return7d: scanner?.return_7d ?? 0.016,
			return30d: scanner?.return_30d ?? 0.034,
			volatilityRegime: volatility?.regime ?? scanner?.volatility_regime ?? "high",
			forecastDirection: forecast?.direction ?? "bullish",
			signalConfidence: signal?.confidence ?? 0.63,
			newsRisk: news?.risk_score ?? 0.44
		};
	}, [intelligence]);

	return (
		<main className="relative min-h-screen overflow-hidden px-6 pb-24">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,196,106,0.12),_transparent_45%),radial-gradient(circle_at_30%_40%,_rgba(31,111,235,0.14),_transparent_50%)]" />
			<section className="relative mx-auto max-w-6xl pt-16">
				<Badge>Public Intelligence</Badge>
				<div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
					>
						<h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-6xl">
							PetroView Oil Intelligence Terminal
						</h1>
						<p className="mt-5 text-lg text-mist/80">
							Live price dynamics, volatility regimes, and signal confidence distilled for public market intelligence.
						</p>
						<div className="mt-8 grid gap-4 md:grid-cols-2">
							<Card className="p-4">
								<p className="text-xs uppercase tracking-[0.3em] text-mist/50">Latest Price</p>
								<p className="mt-2 text-3xl font-semibold text-white">${metrics.price.toFixed(2)}</p>
								<p className="mt-2 text-sm text-mist/70">
									{Math.abs(metrics.return7d * 100).toFixed(2)}% 7D | {Math.abs(metrics.return30d * 100).toFixed(2)}% 30D
								</p>
							</Card>
							<Card className="p-4">
								<p className="text-xs uppercase tracking-[0.3em] text-mist/50">Signal Confidence</p>
								<p className="mt-2 text-3xl font-semibold text-white">{metrics.signalConfidence.toFixed(2)}</p>
								<p className="mt-2 text-sm text-mist/70">Directional bias: {metrics.forecastDirection}</p>
							</Card>
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.1 }}
					>
						<Card className="p-6">
							<SectionTitle title="Pulse Summary" subtitle="Public signals" />
							<div className="mt-4 grid gap-3">
								<Metric label="Volatility Regime" value={metrics.volatilityRegime} />
								<Metric label="Forecast Bias" value={metrics.forecastDirection} />
								<Metric label="News Risk" value={metrics.newsRisk.toFixed(2)} />
								<Metric label="30D Return" value={`${(metrics.return30d * 100).toFixed(2)}%`} />
							</div>
							<div className="mt-6 rounded-2xl border border-white/10 bg-panel/60 p-4 text-sm text-mist/70">
								{recentSummary}
							</div>
						</Card>
					</motion.div>
				</div>

				<div className="mt-10 grid gap-6 lg:grid-cols-3">
					<Card className="p-6 lg:col-span-2">
						<SectionTitle title="Price + Forecast" subtitle="30-day outlook" />
						<div className="mt-4">
							<PriceForecastChart actual={priceSeries} forecast={forecastSeries} />
						</div>
					</Card>
					<Card className="p-6">
						<SectionTitle title="Volatility Regime" subtitle="Rolling 30d" />
						<div className="mt-4">
							<VolatilityChart data={volatilitySeries} />
						</div>
						<div className="mt-4 text-sm text-mist/70">
							Stress mode: {intelligence?.volatility?.stress ?? "elevated"}
						</div>
					</Card>
				</div>

				<div className="mt-10 grid gap-6 lg:grid-cols-3">
					<Card className="p-6">
						<SectionTitle title="7D/30D Trend" subtitle="Price momentum" />
						<div className="mt-4">
							<PriceTrendChart data={priceSeries} />
						</div>
					</Card>
					<Card className="p-6 lg:col-span-2">
						<SectionTitle title="Signal Drivers" subtitle="Recent inference stack" />
						<ul className="mt-4 space-y-2 text-sm text-mist/70">
							{(intelligence?.signal?.reasoning ?? [
								"30-day trend remains supportive",
								"Volatility easing from recent highs",
								"News risk elevated on logistics disruptions"
							]).map((reason) => (
								<li key={reason} className="border-b border-white/5 pb-2">
									{reason}
								</li>
							))}
						</ul>
					</Card>
				</div>
			</section>
		</main>
	);
}
