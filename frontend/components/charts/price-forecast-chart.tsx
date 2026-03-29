"use client";

import { Area, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type PricePoint = { date: string; price: number };
type ForecastPoint = { date: string; forecast: number; lower?: number; upper?: number };

export function PriceForecastChart({ actual, forecast }: { actual: PricePoint[]; forecast: ForecastPoint[] }) {
  const merged = new Map<
    string,
    { date: string; price?: number; forecast?: number; lower?: number; upper?: number }
  >();

  actual.forEach((point) => {
    merged.set(point.date, { date: point.date, price: point.price });
  });

  forecast.forEach((point) => {
    const existing = merged.get(point.date) || { date: point.date };
    merged.set(point.date, {
      ...existing,
      forecast: point.forecast,
      lower: point.lower,
      upper: point.upper
    });
  });

  const data = Array.from(merged.values());

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
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
          <linearGradient id="forecast-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(var(--ocean),0.3)" />
            <stop offset="100%" stopColor="rgba(var(--ocean),0.08)" />
          </linearGradient>
          <linearGradient id="forecast-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(var(--gold))" />
            <stop offset="100%" stopColor="rgb(var(--ocean))" />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="upper"
          stroke="none"
          fill="url(#forecast-band)"
          connectNulls
        />
        <Line dataKey="price" type="monotone" stroke="url(#forecast-line)" strokeWidth={2.5} dot={false} />
        <Line
          dataKey="forecast"
          type="monotone"
          stroke="rgb(var(--ember))"
          strokeWidth={2}
          dot={false}
          strokeDasharray="6 4"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
