import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ make: string }> }
) {
  const { make } = await params;
  const models = await prisma.vehicle.groupBy({
    by: ["model"],
    where: {
      make: {
        equals: make,
        mode: "insensitive",
      },
    },
    _count: {
      model: true,
    },
    _avg: {
      electric_range: true,
    },
    orderBy: {
      _count: {
        model: "desc",
      },
    },
  });

  return NextResponse.json({ make, models });
}
