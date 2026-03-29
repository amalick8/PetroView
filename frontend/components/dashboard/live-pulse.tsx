"use client";

import { useEffect, useRef, useState } from "react";

import { PriceTrendChart } from "@/components/charts/line-chart";
import { Badge } from "@/components/ui/badge";
import { Metric } from "@/components/ui/metric";
import { demoPriceSeries } from "@/lib/demo-data";

type PricePoint = { date: string; price: number };

const baseSeries = demoPriceSeries.map((point) => ({ ...point }));
const initialLog = [
  "boot: pipeline ready",
  "ingest: 12 series loaded",
  "compute: volatility kernel warm",
  "signal: bias=+0.62"
];

const liveCodeSnippets = [
  [
    "async function tickFeed() {",
    "  const ticks = await stream.read()",
    "  const features = buildFeatures(ticks)",
    "  const forecast = model.predict(features)",
    "  return publish(forecast)",
    "}"
  ],
  [
    "const update = () => {",
    "  state.vol = ema(state.vol, tick.vol)",
    "  state.signal = score(tick, state.vol)",
    "  return route(state.signal)",
    "};"
  ],
  [
    "def infer(tick):",
    "  feats = featurize(tick)",
    "  yhat = model(feats)",
    "  return adjust_curve(yhat)",
    ""
  ]
];

export function LivePulse() {
  const [series, setSeries] = useState<PricePoint[]>(() => baseSeries);
  const [logLines, setLogLines] = useState<string[]>(() => initialLog);
  const [lastDelta, setLastDelta] = useState<number>(0.0);
  const [lastLatency, setLastLatency] = useState<number>(188);
  const [liveCode, setLiveCode] = useState<string[]>(() => liveCodeSnippets[0]);

  const tickRef = useRef(1);
  const lastPriceRef = useRef(series[series.length - 1]?.price ?? 93.7);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const wave = Math.sin(tickRef.current / 0.9) * 5.2;
      const jitter = (Math.random() - 0.5) * 8.2;
      const spike = Math.random() > 0.7 ? (Math.random() - 0.5) * 14.0 : 0;
      const delta = Number((wave + jitter + spike).toFixed(2));
      const nextPrice = Number((lastPriceRef.current + delta).toFixed(2));
      const nextDate = `T+${tickRef.current}`;
      const latency = Math.floor(120 + Math.random() * 180);
      const trend = delta >= 0 ? "up" : "down";

      lastPriceRef.current = nextPrice;
      tickRef.current += 1;

      setLastDelta(delta);
      setLastLatency(latency);
      setSeries((prev) => [...prev.slice(1), { date: nextDate, price: nextPrice }]);
      setLogLines((prev) =>
        [
          `tick ${tickRef.current - 1}: delta ${delta >= 0 ? "+" : ""}${delta} (${trend}) -> ${nextPrice} | latency ${latency}ms`,
          ...prev
        ].slice(0, 6)
      );
      setLiveCode(liveCodeSnippets[tickRef.current % liveCodeSnippets.length]);
    }, 1400);

    return () => window.clearInterval(interval);
  }, []);

  const forecastSeries = series.map((point, idx) => {
    const drift = Math.sin(idx / 1.6) * 1.4 + lastDelta * 0.25;
    return { date: point.date, forecast: Number((point.price + drift).toFixed(2)) };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[26px] border border-ink/10 bg-panel/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge>Live Pulse</Badge>
            <h2 className="mt-3 font-display text-2xl text-ink">Gulf Signal Wave</h2>
            <p className="mt-2 text-sm text-ink/60">Streaming tick overlay driven by the demo series.</p>
          </div>
          <div className="flex gap-3">
            <Metric label="Delta" value={`${lastDelta >= 0 ? "+" : ""}${lastDelta.toFixed(2)}`} detail="last tick" />
            <Metric label="Latency" value={`${lastLatency}ms`} detail="compute" />
          </div>
        </div>
        <div className="mt-4 chart-frame">
          <PriceTrendChart data={series} forecast={forecastSeries} />
        </div>
        <div className="mt-4 rounded-2xl border border-ink/10 bg-panel/70 p-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink/50">Streaming logic</p>
          <pre className="code-stream mt-3 whitespace-pre-wrap rounded-xl p-3 text-xs">
{`while market_open:
  features = build_features(ticks)
  forecast = model.predict(features)
  adjust_curve(forecast, delta=${lastDelta.toFixed(2)})
  publish_signal(forecast)`}
          </pre>
        </div>
      </div>
      <div className="rounded-[26px] border border-ink/10 bg-panel/80 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-ink/50">Terminal feed</p>
            <h3 className="mt-2 font-display text-lg text-ink">Compute Console</h3>
          </div>
          <span className="text-xs uppercase tracking-[0.28em] text-ember">live</span>
        </div>
        <div className="terminal-window terminal-live mt-4 rounded-2xl p-4 text-xs text-ink/70">
          {logLines.map((line, index) => (
            <div key={`${line}-${index}`} className="terminal-line">
              <span className="text-ember">&gt;</span> {line}
            </div>
          ))}
          <div className="terminal-line">
            <span className="text-ember">&gt;</span> waiting for next tick<span className="terminal-cursor">_</span>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-ink/10 bg-panel/70 p-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink/50">Live code</p>
          <pre className="code-stream mt-3 whitespace-pre-wrap rounded-xl p-3 text-xs">
{liveCode.join("\n")}
          </pre>
        </div>
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-ink/10 bg-panel/70 p-3 text-xs text-ink/60">
            Impact: chart updates every 1.4s • signal drift aligned to log output
          </div>
          <div className="rounded-2xl border border-ink/10 bg-panel/70 p-3 text-xs text-ink/60">
            Active graph reacts to terminal delta + latency jitter
          </div>
        </div>
      </div>
    </div>
  );
}
