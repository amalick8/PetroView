"use client";

import { Area, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
        <XAxis dataKey="date" stroke="#7f8798" fontSize={12} />
        <YAxis stroke="#7f8798" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "#141821",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12
          }}
          labelStyle={{ color: "#f5c46a" }}
        />
        <Area
          type="monotone"
          dataKey="upper"
          stroke="none"
          fill="rgba(31,111,235,0.18)"
          baseLine={(data) => data.lower ?? data.upper ?? 0}
          connectNulls
        />
        <Line dataKey="price" type="monotone" stroke="#f5c46a" strokeWidth={2} dot={false} />
        <Line dataKey="forecast" type="monotone" stroke="#1f6feb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
