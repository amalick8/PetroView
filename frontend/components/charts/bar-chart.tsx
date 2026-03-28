"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { demoSupplyDistribution } from "@/lib/demo-data";

export function SupplyConcentrationChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={demoSupplyDistribution}>
        <XAxis dataKey="country" stroke="#7f8798" fontSize={12} />
        <YAxis stroke="#7f8798" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "#141821",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12
          }}
          labelStyle={{ color: "#f5c46a" }}
        />
        <Bar dataKey="value" fill="#f08b65" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
