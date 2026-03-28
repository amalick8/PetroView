"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { demoPriceSeries } from "@/lib/demo-data";

type PricePoint = { date: string; price: number };

export function PriceTrendChart({ data = demoPriceSeries }: { data?: PricePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
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
        <Line type="monotone" dataKey="price" stroke="#f5c46a" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
