"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VehicleCountChartProps {
  data: Array<{
    model_year: number;
    _count: { model_year: number };
  }>;
}

export function VehicleCountChart({ data }: VehicleCountChartProps) {
  const chartData = data.map((item) => ({
    year: item.model_year,
    count: item._count.model_year,
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
            formatter={(value) => [typeof value === 'number' ? value.toLocaleString() : String(value), "Vehicles"]}
          />
          <Bar
            dataKey="count"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
