"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { demoPriceSeries } from "@/lib/demo-data";

type PricePoint = { date: string; price: number };
type ForecastPoint = { date: string; forecast: number };

export function PriceTrendChart({ data = demoPriceSeries, forecast }: { data?: PricePoint[]; forecast?: ForecastPoint[] }) {
  const merged = new Map<string, { date: string; price?: number; forecast?: number }>();

  data.forEach((point) => {
    merged.set(point.date, { date: point.date, price: point.price });
  });

  forecast?.forEach((point) => {
    const existing = merged.get(point.date) || { date: point.date };
    merged.set(point.date, { ...existing, forecast: point.forecast });
  });

  const chartData = Array.from(merged.values());

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <CartesianGrid stroke="rgba(var(--ink),0.08)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke="rgba(var(--ink),0.6)" fontSize={12} />
        <YAxis stroke="rgba(var(--ink),0.6)" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "rgb(var(--panel))",
            border: "1px solid rgba(var(--ink),0.1)",
            borderRadius: 12
          }}
          labelStyle={{ color: "rgb(var(--ink))" }}
        />
        <defs>
          <linearGradient id="sand-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(var(--gold))" />
            <stop offset="100%" stopColor="rgb(var(--ocean))" />
          </linearGradient>
        </defs>
        <Line
          type="monotone"
          dataKey="price"
          stroke="url(#sand-line)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, stroke: "rgb(var(--panel))", strokeWidth: 2 }}
        />
        {forecast ? (
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="rgb(var(--ember))"
            strokeWidth={2}
            dot={false}
            strokeDasharray="6 4"
          />
        ) : null}
      </LineChart>
    </ResponsiveContainer>
  );
}
