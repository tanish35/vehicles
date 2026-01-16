import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

interface VehicleRequestBody {
  filters?: {
    makes?: string[];
    model_years?: {
      start: number;
      end: number;
    };
    min_electric_range?: number;
  };
  groupBy: "make" | "model_year" | "county" | "electric_vehicle_type";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { filters, groupBy } = body as VehicleRequestBody;
  const whereClause: any = {};
  if (filters) {
    if (filters.makes && filters.makes.length > 0) {
      whereClause.make = { in: filters.makes };
    }
    if (filters.model_years) {
      whereClause.model_year = {
        gte: filters.model_years.start,
        lte: filters.model_years.end,
      };
    }
    if (filters.min_electric_range) {
      whereClause.electric_range = { gte: filters.min_electric_range };
    }
  }

  const groupedData = await prisma.vehicle.groupBy({
    by: [groupBy],
    where: whereClause,
    _count: {
      _all: true,
    },
    _avg: {
      electric_range: true,
    },
  });
  return NextResponse.json({ groupBy, data: groupedData });
}
