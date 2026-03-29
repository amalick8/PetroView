"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { demoVolatilitySeries } from "@/lib/demo-data";

type VolPoint = { date: string; value: number };

export function VolatilityChart({ data = demoVolatilitySeries }: { data?: VolPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
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
          <linearGradient id="sand-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(var(--gold),0.45)" />
            <stop offset="100%" stopColor="rgba(var(--ocean),0.08)" />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="rgb(var(--gold))"
          fill="url(#sand-area)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
