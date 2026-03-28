"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const sample = [
  { date: "Jan", value: 0.18 },
  { date: "Feb", value: 0.22 },
  { date: "Mar", value: 0.14 },
  { date: "Apr", value: 0.28 },
  { date: "May", value: 0.31 },
  { date: "Jun", value: 0.27 }
];

export function VolatilityChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={sample}>
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
          dataKey="value"
          stroke="#1f6feb"
          fill="rgba(31,111,235,0.25)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
