import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ "county-name": string }> }
) {
  const { "county-name": countyName } = await params;
  const searchParams = req.nextUrl.searchParams;
  const pageRaw = searchParams.get("page");
  const pageSizeRaw = searchParams.get("pageSize");
  const year = searchParams.get("year");
  const sortBy = searchParams.get("sortBy") || "model_year";
  const page = pageRaw ? parseInt(pageRaw, 10) : 1;
  const pageSize = pageSizeRaw ? parseInt(pageSizeRaw, 10) : 20;

  const vehicles = await prisma.vehicle.findMany({
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

  return NextResponse.json({ county: countyName, vehicles, page, pageSize });
}
