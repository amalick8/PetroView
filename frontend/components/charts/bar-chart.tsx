"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { demoSupplyDistribution } from "@/lib/demo-data";

type SupplyPoint = { country: string; value: number };

export function SupplyConcentrationChart({ data = demoSupplyDistribution }: { data?: SupplyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(var(--ink),0.08)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="country" stroke="rgba(var(--ink),0.6)" fontSize={12} />
        <YAxis stroke="rgba(var(--ink),0.6)" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "rgb(var(--panel))",
            border: "1px solid rgba(var(--ink),0.1)",
            borderRadius: 12
          }}
          labelStyle={{ color: "rgb(var(--ink))" }}
        />
        <Bar dataKey="value" fill="rgb(var(--gold))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
