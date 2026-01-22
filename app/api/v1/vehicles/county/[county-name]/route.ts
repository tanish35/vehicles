import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { getValue, setValue } from "@/lib/redis";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ "county-name": string }> },
) {
  const { "county-name": countyName } = await params;
  const searchParams = req.nextUrl.searchParams;
  const pageRaw = searchParams.get("page");
  const pageSizeRaw = searchParams.get("pageSize");
  const year = searchParams.get("year");
  const sortBy = searchParams.get("sortBy") || "model_year";
  const page = pageRaw ? parseInt(pageRaw, 10) : 1;
  const pageSize = pageSizeRaw ? parseInt(pageSizeRaw, 10) : 20;

  let vehicles = [];
  const cacheKey = `vehicles:county:${countyName}:year:${year}:sortBy:${sortBy}:page:${page}:pageSize:${pageSize}`;
  const cachedData = await getValue(cacheKey);
  if (cachedData) {
    console.log(cachedData);
    return NextResponse.json({
      county: countyName,
      vehicles: cachedData,
      page,
      pageSize,
    });
  }

  vehicles = await prisma.vehicle.findMany({
    where: {
      county: {
        equals: countyName,
        mode: "insensitive",
      },
      ...(year && { model_year: parseInt(year, 10) }),
    },
    orderBy: {
      [sortBy]: "asc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  await setValue(cacheKey, vehicles, 600);
  return NextResponse.json({ county: countyName, vehicles, page, pageSize });
}
