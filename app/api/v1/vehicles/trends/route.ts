import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET() {
  const vehicleCountByYear = await prisma.vehicle.groupBy({
    by: ["model_year"],
    _count: {
      model_year: true,
    },
    orderBy: {
      model_year: "asc",
    },
  });
  const averageRangeByYear = await prisma.vehicle.groupBy({
    by: ["model_year"],
    _avg: {
      electric_range: true,
    },
    orderBy: {
      model_year: "asc",
    },
  });
  const BEVCountByYear = await prisma.vehicle.groupBy({
    by: ["model_year"],
    where: {
      electric_vehicle_type: {
        contains: "BEV",
      },
    },
    _count: {
      model_year: true,
    },
    orderBy: {
      model_year: "asc",
    },
  });
  const PHEVCountByYear = await prisma.vehicle.groupBy({
    by: ["model_year"],
    where: {
      electric_vehicle_type: {
        contains: "PHEV",
      },
    },
    _count: {
      model_year: true,
    },
    orderBy: {
      model_year: "asc",
    },
  });
  const phevByYear = new Map<number, number>();
  for (const entry of PHEVCountByYear) {
    phevByYear.set(entry.model_year, entry._count.model_year);
  }
  const BEVPHEVRatioByYear = BEVCountByYear.map((bevEntry) => {
    const year = bevEntry.model_year;
    const bevCount = bevEntry._count.model_year;
    const phevCount = phevByYear.get(year) ?? 0;

    return {
      year,
      bevCount,
      phevCount,
      ratio: phevCount === 0 ? null : bevCount / phevCount,
    };
  });

  return NextResponse.json({
    vehicleCountByYear,
    averageRangeByYear,
    BEVPHEVRatioByYear,
  });
}
