"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCountyVehicles } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export function CountySection() {
  const [countyInput, setCountyInput] = useState("");
  const [county, setCounty] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["county", county, page],
    queryFn: () => fetchCountyVehicles(county, page, pageSize),
    enabled: !!county,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (countyInput.trim()) {
      setCounty(countyInput.trim());
      setPage(1);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>County Vehicle Lookup</CardTitle>
          <CardDescription>
            Search for vehicles registered in a specific county
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Enter county name (e.g., King, Pierce)"
              value={countyInput}
              onChange={(e) => setCountyInput(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit" disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 text-destructive">
          Failed to fetch county data. Please check the county name and try again.
        </div>
      )}

      {isLoading && <CountySkeleton />}

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicles in {data.county}</CardTitle>
            <CardDescription>
              Page {data.page} • {data.vehicles.length} vehicles shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.vehicles.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Make</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Range</TableHead>
                        <TableHead>City</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.vehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell>{vehicle.model_year}</TableCell>
                          <TableCell className="font-medium">{vehicle.make}</TableCell>
                          <TableCell>{vehicle.model}</TableCell>
                          <TableCell>
                            <Badge variant={vehicle.electric_vehicle_type.includes("BEV") ? "default" : "secondary"}>
                              {vehicle.electric_vehicle_type.includes("BEV") ? "BEV" : "PHEV"}
                            </Badge>
                          </TableCell>
                          <TableCell>{vehicle.electric_range} mi</TableCell>
                          <TableCell>{vehicle.city}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={data.vehicles.length < pageSize || isLoading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No vehicles found in this county.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CountySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
