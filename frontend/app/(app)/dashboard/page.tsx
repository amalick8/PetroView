"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { PriceTrendChart } from "@/components/charts/line-chart";
import { VolatilityChart } from "@/components/charts/area-chart";
import { SupplyConcentrationChart } from "@/components/charts/bar-chart";
import { PriceForecastChart } from "@/components/charts/price-forecast-chart";
import { SectionTitle } from "@/components/ui/section-title";
import { LivePulse } from "@/components/dashboard/live-pulse";
import {
  demoEquityForecast,
  demoForecastValues,
  demoModelPerformance,
  demoModelSignals,
  demoMlPipeline,
  demoCodeBlocks,
  demoNewsDrivers,
  demoNewsNarratives,
  demoNewsPulse,
  demoPriceSeries,
  demoReportCatalog,
  demoScenarioDeck,
  demoShippingEnergyStocks,
  demoSupplyDistribution,
  demoVolatilitySeries,
  demoWatchlist
} from "@/lib/demo-data";

const overviewSeed = {
  wti: 93.7,
  ret7d: 1.6,
  ret30d: 3.4,
  signal: "Bullish",
  volatility: "High",
  stress: "Elevated"
};

const demoTicker = [
  "WTI 93.70",
  "BRENT 96.10",
  "DXY 103.2",
  "CRACK 27.8",
  "VOL 0.26",
  "RISK ELEVATED",
  "SIGNAL BULLISH",
  "CONF 0.67"
];

const enableApi = false;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const makeForecast = (basePrice: number) =>
  demoForecastValues.map((_, idx) => ({
    date: `W+${idx + 1}`,
    forecast: Number((basePrice + (idx + 1) * 0.45 + (Math.random() - 0.5) * 0.4).toFixed(2))
  }));

const datasetCards = [
  { name: "WTI Spot", source: "FRED", rows: "9.4k", quality: "98%" },
  { name: "OWID Energy", source: "OWID", rows: "218k", quality: "95%" },
  { name: "Global Refinery", source: "IEA", rows: "41k", quality: "92%" },
  { name: "Shipping Lanes", source: "AIS", rows: "1.2M", quality: "89%" }
];

const methodBlocks = [
  { title: "Signals", detail: "Momentum + drawdown regimes" },
  { title: "Risk", detail: "Volatility percentile + stress" },
  { title: "Forecast", detail: "Best-fit model by MAE/RMSE" }
];

export default function Dashboard() {
  const [overview, setOverview] = useState(overviewSeed);
  const overviewRef = useRef(overviewSeed);
  const [ticker, setTicker] = useState(demoTicker);
  const [priceSeries, setPriceSeries] = useState(demoPriceSeries);
  const [volSeries, setVolSeries] = useState(demoVolatilitySeries);
  const [watchlist, setWatchlist] = useState(demoWatchlist);
  const [equities, setEquities] = useState(demoShippingEnergyStocks);
  const [forecastSeries, setForecastSeries] = useState(() => makeForecast(overviewSeed.wti));
  const tickCountRef = useRef(0);

  const supplySeries = demoSupplyDistribution;

  const overviewMetrics = useMemo(
    () => [
      { label: "WTI Spot", value: `$${overview.wti.toFixed(2)}`, detail: "live" },
      { label: "7D Return", value: `${overview.ret7d.toFixed(2)}%`, detail: "trend" },
      { label: "30D Return", value: `${overview.ret30d.toFixed(2)}%`, detail: "momentum" },
      { label: "Signal", value: overview.signal, detail: "bias" },
      { label: "Volatility", value: overview.volatility, detail: "regime" },
      { label: "Stress", value: overview.stress, detail: "risk" }
    ],
    [overview]
  );

  useEffect(() => {
    const updateDemo = () => {
      tickCountRef.current += 1;
      const prev = overviewRef.current;
      const wti = Number((prev.wti + (Math.random() - 0.5) * 1.1).toFixed(2));
      const ret7d = Number((prev.ret7d + (Math.random() - 0.5) * 0.3).toFixed(2));
      const ret30d = Number((prev.ret30d + (Math.random() - 0.5) * 0.4).toFixed(2));

      const updateLabels = tickCountRef.current % 3 === 0;
      const signal = updateLabels ? (ret7d >= 0 ? "Bullish" : "Cautious") : prev.signal;
      const volatility = updateLabels ? (Math.abs(ret7d) > 1.6 ? "High" : "Moderate") : prev.volatility;
      const stress = updateLabels ? (ret30d < 0 ? "Elevated" : "Contained") : prev.stress;

      const nextOverview = { ...prev, wti, ret7d, ret30d, signal, volatility, stress };

      overviewRef.current = nextOverview;
      setOverview(nextOverview);
      setForecastSeries(makeForecast(wti));

      setPriceSeries((prev) =>
        prev.map((point) => {
          const drift = (Math.random() - 0.5) * 0.9;
          return { ...point, price: Number((point.price + drift).toFixed(2)) };
        })
      );

      setVolSeries((prev) =>
        prev.map((point) => {
          const drift = (Math.random() - 0.5) * 0.03;
          return { ...point, value: Number(clamp(point.value + drift, 0.16, 0.38).toFixed(2)) };
        })
      );

      setWatchlist((prev) =>
        prev.map((item) => {
          const drift = (Math.random() - 0.5) * 0.6;
          const value = Number((item.value + drift).toFixed(2));
          const change = Number((item.change + (Math.random() - 0.5) * 0.3).toFixed(2));
          return { ...item, value, change };
        })
      );

      setEquities((prev) =>
        prev.map((stock) => {
          const drift = (Math.random() - 0.5) * 0.8;
          const price = Number((stock.price + drift).toFixed(2));
          const change = Number((stock.change + (Math.random() - 0.5) * 0.4).toFixed(2));
          return { ...stock, price, change };
        })
      );

      setTicker(() => {
        const brent = Number((wti + 2.4 + (Math.random() - 0.5)).toFixed(2));
        const dxy = Number((103.2 + (Math.random() - 0.5) * 0.6).toFixed(1));
        const crack = Number((27.8 + (Math.random() - 0.5) * 1.2).toFixed(1));
        const vol = Number((0.26 + (Math.random() - 0.5) * 0.04).toFixed(2));
        return [
          `WTI ${wti.toFixed(2)}`,
          `BRENT ${brent.toFixed(2)}`,
          `DXY ${dxy}`,
          `CRACK ${crack}`,
          `VOL ${vol}`,
          `RISK ${nextOverview.stress.toUpperCase()}`,
          `SIGNAL ${nextOverview.signal.toUpperCase()}`,
          `CONF 0.67`
        ];
      });
    };

    const fetchApi = async () => {
      try {
        const response = await fetch("/api/dashboard/live", { cache: "no-store" });
        if (!response.ok) {
          updateDemo();
          return;
        }
        const payload = await response.json();
        let usedApi = false;

        if (payload?.overview) {
          overviewRef.current = payload.overview;
          setOverview(payload.overview);
          usedApi = true;
        }
        if (Array.isArray(payload?.ticker) && payload.ticker.length) {
          setTicker(payload.ticker);
          usedApi = true;
        }
        if (Array.isArray(payload?.priceSeries) && payload.priceSeries.length) {
          setPriceSeries(payload.priceSeries);
          usedApi = true;
        }
        if (Array.isArray(payload?.volSeries) && payload.volSeries.length) {
          setVolSeries(payload.volSeries);
          usedApi = true;
        }
        if (Array.isArray(payload?.watchlist) && payload.watchlist.length) {
          setWatchlist(payload.watchlist);
          usedApi = true;
        }
        if (Array.isArray(payload?.equities) && payload.equities.length) {
          setEquities(payload.equities);
          usedApi = true;
        }
        if (Array.isArray(payload?.forecastSeries) && payload.forecastSeries.length) {
          setForecastSeries(payload.forecastSeries);
          usedApi = true;
        }

        if (!usedApi) {
          updateDemo();
        }
      } catch {
        updateDemo();
      }
    };

    const tick = () => {
      if (enableApi) {
        void fetchApi();
      } else {
        updateDemo();
      }
    };

    tick();
    const interval = window.setInterval(tick, 3000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen px-0 pb-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient-grid absolute inset-0" />
        <div className="ambient-orb absolute -top-24 -left-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="ambient-orb orb-2 absolute top-12 right-[-120px] h-80 w-80 rounded-full bg-ocean/20 blur-3xl" />
        <div className="ambient-orb orb-3 absolute bottom-[-140px] left-[35%] h-96 w-96 rounded-full bg-ember/20 blur-3xl" />
        <div className="ocean-waves" />
      </div>
      <section className="relative mx-auto grid w-full max-w-none grid-cols-1 gap-8 px-4 pt-8 sm:px-6 sm:pt-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-10 lg:px-10">
        <aside className="section-reveal lg:min-w-[280px]">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-[28px] border border-ink/10 theme-hero-card p-6 shadow-glass">
              <Badge className="border-gold/40 bg-gold/20 text-ink">Terminal</Badge>
              <h1 className="mt-4 font-display text-3xl text-ink">PetroView Tide Room</h1>
              <p className="mt-3 text-sm text-ink/60">
                A beachfront-grade intelligence suite for energy markets. Every signal, every model, every wave.
              </p>
              <div className="mt-6 grid gap-3">
                {overviewMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-ink/10 bg-panel/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-ink/50">{metric.label}</p>
                    <p className="mt-2 text-lg font-semibold text-ink tabular-nums">{metric.value}</p>
                    <p className="mt-1 text-xs text-ink/50">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-ink/10 bg-panel/80 p-5">
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink/50">Signals</p>
              <div className="mt-4 space-y-3 text-sm text-ink/60">
                <div className="flex items-center justify-between">
                  <span>Curve structure</span>
                  <span className="text-ink">Backwardation</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Flow regime</span>
                  <span className="text-ink">Net Long</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Skew</span>
                  <span className="text-ink">Call-heavy</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-8 md:space-y-10">
          <section className="section-reveal">
            <div className="overflow-hidden rounded-[26px] border border-ink/10 bg-panel/80 px-6 py-4">
              <div className="ticker text-xs uppercase tracking-[0.28em] text-ink/50">
                {ticker.concat(ticker).map((item, idx) => (
                  <span key={`${item}-${idx}`}>{item}</span>
                ))}
              </div>
            </div>
          </section>

          <section id="pulse" className="section-reveal">
            <LivePulse />
          </section>
          <section id="overview" className="section-reveal delay-1">
            <div className="grid gap-6 lg:grid-cols-[1.6fr_0.4fr]">
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Market Path" subtitle="Spot + forecast" />
                <div className="mt-4 chart-frame">
                  <PriceForecastChart actual={priceSeries} forecast={forecastSeries} />
                </div>
              </Card>
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Tide Signals" subtitle="Intraday posture" />
                <div className="mt-4 grid gap-3">
                  <Metric label="Curve" value="Backwardation" detail="Tight prompt" />
                  <Metric label="Skew" value="Call-heavy" detail="Options" />
                </div>
              </Card>
            </div>
          </section>

          <section id="tape" className="section-reveal delay-2">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Live Watchlist" subtitle="Spot + macro" />
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {watchlist.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-ink/60">{item.name}</p>
                        <p className="text-lg text-ink tabular-nums">{item.value.toFixed(2)}</p>
                      </div>
                      <p className="mt-2 text-xs text-ink/50">
                        {item.change > 0 ? "+" : ""}
                        {item.change.toFixed(2)}% • {item.signal}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Scenario Deck" subtitle="Forward risks" />
                <div className="mt-4 space-y-4 text-sm text-ink/60">
                  {demoScenarioDeck.map((scenario) => (
                    <div key={scenario.title} className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-ocean/70">
                        {Math.round(scenario.probability * 100)}% probability
                      </p>
                      <p className="mt-2 text-ink">{scenario.title}</p>
                      <p className="mt-2 text-xs text-ink/50">Impact: {scenario.impact}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section id="equities" className="section-reveal">
            <Card className="p-5 sm:p-6">
              <SectionTitle title="Shipping + Energy Equities" subtitle="Notable names" />
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {equities.map((stock) => (
                  <div key={stock.symbol} className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink/60">{stock.symbol}</span>
                      <span className={`text-sm ${stock.change >= 0 ? "text-ember" : "text-rose-600"}`}>
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                      </span>
                    </div>
                    <p className="mt-2 text-ink">{stock.name}</p>
                    <p className="mt-2 text-xs text-ink/50">{stock.sector}</p>
                    <p className="mt-3 text-xs text-ink/60 tabular-nums">${stock.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section id="forecast" className="section-reveal delay-3">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="p-5 sm:p-6 lg:col-span-2">
                <SectionTitle title="Forecast Stack" subtitle="Model output" />
                <div className="mt-4 chart-frame">
                  <PriceForecastChart actual={priceSeries} forecast={forecastSeries} />
                </div>
              </Card>
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Equity Basket" subtitle="30D target" />
                <div className="mt-4 space-y-3 text-sm text-ink/60">
                  {demoEquityForecast.map((item) => (
                    <div key={item.symbol} className="rounded-2xl border border-ink/10 bg-panel/60 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-ink">{item.symbol}</span>
                        <span>{item.forecast30d.toFixed(2)}</span>
                      </div>
                      <p className="mt-2 text-xs text-ink/50">Conf {item.confidence.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section id="volatility" className="section-reveal delay-1">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Volatility" subtitle="Rolling 30D" />
                <div className="mt-4 chart-frame">
                  <VolatilityChart data={volSeries} />
                </div>
              </Card>
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Momentum" subtitle="Trend" />
                <div className="mt-4 chart-frame">
                  <PriceTrendChart data={priceSeries} />
                </div>
              </Card>
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Regime" subtitle="Risk posture" />
                <div className="mt-4 grid gap-3">
                  <Metric label="Percentile" value="68th" detail="vol rank" />
                  <Metric label="Stress" value="Elevated" detail="hedging" />
                  <Metric label="Drawdown" value="-8.0%" detail="90D" />
                </div>
              </Card>
            </div>
          </section>

          <section id="news" className="section-reveal delay-2">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <Card className="p-5 sm:p-6">
                <SectionTitle title="News Pulse" subtitle="Impact feed" />
                <div className="mt-4 space-y-4 text-sm text-ink/60">
                  {demoNewsPulse.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                      <p className="text-ink">{item.title}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink/50">
                        <span>{item.source}</span>
                        <span>{item.topic}</span>
                        <span>Impact {item.impact}</span>
                        <span>Conf {item.confidence.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Drivers" subtitle="Topic strength" />
                <div className="mt-4 space-y-3 text-sm text-ink/60">
                  {demoNewsDrivers.map((driver) => (
                    <div key={driver.driver} className="rounded-2xl border border-ink/10 bg-panel/60 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-ink">{driver.driver}</span>
                        <span>{driver.score.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate/60">
                        <div className="h-2 rounded-full bg-ocean/80" style={{ width: `${Math.min(driver.score * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Real-World Impact" subtitle="Demo narrative feed" />
                <div className="mt-4 space-y-4 text-sm text-ink/60">
                  {demoNewsNarratives.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-ink">{item.title}</p>
                        <span className="text-xs text-ink/50">{item.time}</span>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.28em] text-ocean/70">{item.source}</p>
                      <p className="mt-3 text-sm text-ink/60">{item.takeaway}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink/50">
                        <span>Signal: {item.signal}</span>
                        <span>Impact: {item.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Translation Layer" subtitle="How headlines move price" />
                <div className="mt-4 space-y-4 text-sm text-ink/60">
                  <div className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                    <p className="text-ink">Shipping bottlenecks push prompt spreads wider.</p>
                    <p className="mt-2 text-xs text-ink/50">Effect: Higher curve backwardation + elevated risk premium.</p>
                  </div>
                  <div className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                    <p className="text-ink">Rig declines compress forward supply expectations.</p>
                    <p className="mt-2 text-xs text-ink/50">Effect: Forecast bias shifts to upside with higher confidence.</p>
                  </div>
                  <div className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                    <p className="text-ink">Inventory draws reinforce signal strength.</p>
                    <p className="mt-2 text-xs text-ink/50">Effect: Momentum regime remains positive despite volatility.</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section id="models" className="section-reveal delay-3">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Model Leaderboard" subtitle="Latency + error" />
                <div className="mt-4 space-y-3 text-sm text-ink/60">
                  {demoModelPerformance.map((model) => (
                    <div key={model.model} className="rounded-2xl border border-ink/10 bg-panel/60 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-ink">{model.model}</span>
                        <span>{model.latencyMs}ms</span>
                      </div>
                      <p className="mt-2 text-xs text-ink/50">
                        MAE {model.mae.toFixed(2)} • RMSE {model.rmse.toFixed(2)} • MAPE {model.mape.toFixed(1)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5 sm:p-6 lg:col-span-2">
                <SectionTitle title="Supply Concentration" subtitle="Production mix" />
                <div className="mt-4 chart-frame">
                  <SupplyConcentrationChart data={supplySeries} />
                </div>
              </Card>
            </div>
          </section>

          <section id="core" className="section-reveal">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Model Core" subtitle="Live ML orchestration" />
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {demoModelSignals.map((signal) => (
                    <div key={signal.label} className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-ink/50">{signal.label}</p>
                      <p className="mt-2 text-xl font-semibold text-ink">{signal.value}</p>
                      <p className="mt-2 text-xs text-ink/50">{signal.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid gap-3">
                  {demoMlPipeline.map((stage) => (
                    <div key={stage.stage} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-panel/60 px-4 py-3 text-sm text-ink/60">
                      <span className="text-ink">{stage.stage}</span>
                      <span>{stage.detail}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-ink/50">{stage.latency}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5 sm:p-6">
                <SectionTitle title="Live Compute" subtitle="Pipeline logic" />
                <div className="mt-4 space-y-4">
                  {demoCodeBlocks.map((block) => (
                    <div key={block.title} className="rounded-2xl border border-ink/10 bg-panel/70 p-4">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-ink/50">{block.title}</p>
                      <pre className="code-stream mt-3 whitespace-pre-wrap rounded-xl p-3 text-xs">
{block.code}
                      </pre>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section id="reports" className="section-reveal delay-3">
            <Card className="p-5 sm:p-6">
              <SectionTitle title="Report Archive" subtitle="Research drops" />
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {demoReportCatalog.map((report) => (
                  <div key={report.id} className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-ocean/70">{report.tag}</p>
                    <p className="mt-2 text-ink">{report.title}</p>
                    <p className="mt-2 text-xs text-ink/50">{report.pages} pages • {report.updated}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section id="datasets" className="section-reveal delay-1">
            <Card className="p-5 sm:p-6">
              <SectionTitle title="Datasets" subtitle="Coverage" />
              <div className="mt-4 grid gap-4 md:grid-cols-4">
                {datasetCards.map((dataset) => (
                  <div key={dataset.name} className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                    <p className="text-ink">{dataset.name}</p>
                    <p className="mt-2 text-xs text-ink/50">{dataset.source}</p>
                    <div className="mt-4 grid gap-2 text-xs text-ink/50">
                      <span>Rows {dataset.rows}</span>
                      <span>Quality {dataset.quality}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section id="method" className="section-reveal delay-2">
            <Card className="p-6">
              <SectionTitle title="Method Stack" subtitle="Signal pipeline" />
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {methodBlocks.map((block) => (
                  <div key={block.title} className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                    <p className="text-ink">{block.title}</p>
                    <p className="mt-2 text-xs text-ink/50">{block.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </section>
    </main>
  );
}
