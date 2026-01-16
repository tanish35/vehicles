"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMakeModels } from "@/lib/api";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export function MakeModelSection() {
  const [makeInput, setMakeInput] = useState("");
  const [make, setMake] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["make-models", make],
    queryFn: () => fetchMakeModels(make),
    enabled: !!make,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (makeInput.trim()) {
      setMake(makeInput.trim().toUpperCase());
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Make/Model Lookup</CardTitle>
          <CardDescription>
            Search for all models from a specific manufacturer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Enter make (e.g., TESLA, BMW, CHEVROLET)"
              value={makeInput}
              onChange={(e) => setMakeInput(e.target.value)}
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
          Failed to fetch make data. Please check the make name and try again.
        </div>
      )}

      {isLoading && <MakeModelSkeleton />}

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>{data.make} Models</CardTitle>
            <CardDescription>
              {data.models.length} models found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.models.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Avg Range (mi)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.models.map((model) => (
                    <TableRow key={model.model}>
                      <TableCell className="font-medium">{model.model}</TableCell>
                      <TableCell className="text-right">
                        {model._count.model.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {model._avg.electric_range
                          ? Math.round(model._avg.electric_range)
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No models found for this make.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MakeModelSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
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
