import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const totalVehicles = await prisma.vehicle.count();
  const BEVCount = await prisma.vehicle.count({
    where: {
      electric_vehicle_type: {
        contains: "BEV",
        mode: "insensitive",
      },
    },
  });
  const PHEVCount = await prisma.vehicle.count({
    where: {
      electric_vehicle_type: {
        contains: "PHEV",
        mode: "insensitive",
      },
    },
  });
  const top10Makes = await prisma.vehicle.groupBy({
    by: ["make"],
    _count: {
      make: true,
    },
    orderBy: {
      _count: {
        make: "desc",
      },
    },
    take: 10,
  });
  const avgElectricRange = await prisma.vehicle.aggregate({
    _avg: {
      electric_range: true,
    },
  });
  const eligibleVehicles = await prisma.vehicle.count({
    where: {
      clean_alternative_fuel_vehicle_eligibility: {
        contains: "Clean Alternative Fuel Vehicle Eligible",
        mode: "insensitive",
      },
    },
  });
  const ineligibleVehicles = await prisma.vehicle.count({
    where: {
      clean_alternative_fuel_vehicle_eligibility: {
        contains: "Not Eligible",
        mode: "insensitive",
      },
    },
  });

  return NextResponse.json({
    totalVehicles,
    vehicleByType: { BEV: BEVCount, PHEV: PHEVCount },
    top10Makes,
    avgElectricRange: avgElectricRange._avg.electric_range,
    eligibleVehicles,
    ineligibleVehicles,
  });
}
