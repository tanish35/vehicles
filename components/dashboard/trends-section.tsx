"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTrends } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleCountChart } from "@/components/charts/vehicle-count-chart";
import { RangeTrendChart } from "@/components/charts/range-trend-chart";
import { BevPhevChart } from "@/components/charts/bev-phev-chart";

export function TrendsSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trends"],
    queryFn: fetchTrends,
  });

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Failed to load trends data. Please try again.
      </div>
    );
  }

  if (isLoading || !data) {
    return <TrendsSkeleton />;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Registrations by Year</CardTitle>
          <CardDescription>
            Number of electric vehicles registered each model year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleCountChart data={data.vehicleCountByYear} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Electric Range Trend</CardTitle>
          <CardDescription>
            How average electric range has improved over the years
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RangeTrendChart data={data.averageRangeByYear} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>BEV vs PHEV Distribution</CardTitle>
          <CardDescription>
            Comparison of Battery Electric Vehicles and Plug-in Hybrid Electric Vehicles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BevPhevChart data={data.BEVPHEVRatioByYear} />
        </CardContent>
      </Card>
    </div>
  );
}

function TrendsSkeleton() {
  return (
    <div className="grid gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
