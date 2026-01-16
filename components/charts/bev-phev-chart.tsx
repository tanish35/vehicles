"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BevPhevChartProps {
  data: Array<{
    year: number;
    bevCount: number;
    phevCount: number;
    ratio: number | null;
  }>;
}

export function BevPhevChart({ data }: BevPhevChartProps) {
  const chartData = data.map((item) => ({
    year: item.year,
    BEV: item.bevCount,
    PHEV: item.phevCount,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            className="fill-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="fill-muted-foreground"
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value) => (typeof value === 'number' ? value.toLocaleString() : value)}
          />
          <Legend />
          <Bar
            dataKey="BEV"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
            stackId="a"
          />
          <Bar
            dataKey="PHEV"
            fill="hsl(var(--chart-3))"
            radius={[4, 4, 0, 0]}
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
