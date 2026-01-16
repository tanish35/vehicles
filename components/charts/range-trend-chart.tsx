"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RangeTrendChartProps {
  data: Array<{
    model_year: number;
    _avg: { electric_range: number | null };
  }>;
}

export function RangeTrendChart({ data }: RangeTrendChartProps) {
  const chartData = data
    .filter((item) => item._avg.electric_range !== null)
    .map((item) => ({
      year: item.model_year,
      range: Math.round(item._avg.electric_range || 0),
    }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            className="fill-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="fill-muted-foreground"
            tickFormatter={(value) => `${value} mi`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value) => [
              `${typeof value === "number" ? value : 0} miles`,
              "Avg Range",
            ]}
          />
          <Line
            type="monotone"
            dataKey="range"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={{
              fill: "#ffffff", // white dot
              stroke: "hsl(var(--chart-2))", // border color
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "#ffffff",
              stroke: "hsl(var(--chart-2))",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
