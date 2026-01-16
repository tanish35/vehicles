"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalyze } from "@/lib/api";
import { AnalyzeRequest } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type GroupByOption = "make" | "model_year" | "county" | "electric_vehicle_type";

export function AnalyzeSection() {
  const [groupBy, setGroupBy] = useState<GroupByOption>("make");
  const [makes, setMakes] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [minRange, setMinRange] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  const buildRequest = (): AnalyzeRequest => {
    const request: AnalyzeRequest = { groupBy };
    const filters: AnalyzeRequest["filters"] = {};

    if (makes.trim()) {
      filters.makes = makes.split(",").map((m) => m.trim().toUpperCase());
    }
    if (yearStart && yearEnd) {
      filters.model_years = {
        start: parseInt(yearStart, 10),
        end: parseInt(yearEnd, 10),
      };
    }
    if (minRange) {
      filters.min_electric_range = parseInt(minRange, 10);
    }

    if (Object.keys(filters).length > 0) {
      request.filters = filters;
    }

    return request;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["analyze", groupBy, makes, yearStart, yearEnd, minRange],
    queryFn: () => fetchAnalyze(buildRequest()),
    enabled: shouldFetch,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShouldFetch(true);
    refetch();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Vehicles</CardTitle>
          <CardDescription>
            Filter and group vehicle data by different criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Group By</label>
                <Select value={groupBy} onValueChange={(v) => setGroupBy(v as GroupByOption)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="make">Make</SelectItem>
                    <SelectItem value="model_year">Model Year</SelectItem>
                    <SelectItem value="county">County</SelectItem>
                    <SelectItem value="electric_vehicle_type">EV Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Makes (comma separated)</label>
                <Input
                  placeholder="e.g., TESLA, BMW"
                  value={makes}
                  onChange={(e) => setMakes(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Year Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Start"
                    value={yearStart}
                    onChange={(e) => setYearStart(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="End"
                    value={yearEnd}
                    onChange={(e) => setYearEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min Range (mi)</label>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  value={minRange}
                  onChange={(e) => setMinRange(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 text-destructive">
          Failed to fetch analysis data. Please try again.
        </div>
      )}

      {isLoading && <AnalyzeSkeleton />}

      {data && data.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Grouped by: {data.groupBy} ({data.data.length} groups)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{data.groupBy}</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Avg Range (mi)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.slice(0, 20).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {String(item[data.groupBy as keyof typeof item] ?? "N/A")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item._count._all.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item._avg.electric_range
                        ? Math.round(item._avg.electric_range)
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data.data.length > 20 && (
              <p className="mt-4 text-sm text-muted-foreground">
                Showing first 20 of {data.data.length} results
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {data && data.data.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No data found for the given filters.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AnalyzeSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
