"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSummary } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car,
  Battery,
  Zap,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import ElectricBorder from "@/components/ElectricBorder";
import { GlowingEffect } from "../ui/glowing-effect";

export function SummarySection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["summary"],
    queryFn: fetchSummary,
  });

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Failed to load summary data. Please try again.
      </div>
    );
  }

  if (isLoading || !data) {
    return <SummarySkeleton />;
  }

  const stats = [
    {
      title: "Total Vehicles",
      value: data.totalVehicles.toLocaleString(),
      icon: Car,
      color: "text-chart-1",
    },
    {
      title: "BEV Vehicles",
      value: data.vehicleByType.BEV.toLocaleString(),
      icon: Battery,
      color: "text-chart-2",
    },
    {
      title: "PHEV Vehicles",
      value: data.vehicleByType.PHEV.toLocaleString(),
      icon: Zap,
      color: "text-chart-3",
    },
    {
      title: "Avg Electric Range",
      value: `${Math.round(data.avgElectricRange)} mi`,
      icon: TrendingUp,
      color: "text-chart-4",
    },
    {
      title: "CAFV Eligible",
      value: data.eligibleVehicles.toLocaleString(),
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Not Eligible",
      value: data.ineligibleVehicles.toLocaleString(),
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.title} className="relative rounded-xl border border-border p-1">
            <GlowingEffect
              spread={100}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={3}
            />
            <Card className="rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <ElectricBorder
        color="#7df9ff"
        speed={2}
        chaos={0.04}
        style={{ borderRadius: 16 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Makes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.top10Makes.map((make, index) => (
                <Badge
                  key={make.make}
                  variant={index === 0 ? "default" : "secondary"}
                  className="text-sm"
                >
                  {make.make}: {make._count.make.toLocaleString()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </ElectricBorder>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
