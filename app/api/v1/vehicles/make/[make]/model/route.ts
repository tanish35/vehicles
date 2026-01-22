import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { getValue, setValue } from "@/lib/redis";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ make: string }> },
) {
  const { make } = await params;
  const cachedData = await getValue(`vehicles:make:${make}:models`);
  if (cachedData) {
    return NextResponse.json({ make, models:cachedData });
  }
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
  await setValue(`vehicles:make:${make}:models`, models, 600);

  return NextResponse.json({ make, models });
}
