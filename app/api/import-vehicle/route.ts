import fs from "fs";
import Papa from "papaparse";
import prisma from "@/lib/db";
import slugify from "slugify";
import type { Vehicle } from "@/generated/prisma/client";

const BATCH_SIZE = 1000;
const SKIP_COLUMNS = new Set(["vehicle_location"]);
const TOTAL_HEADERS = 16;
let isHeaderProcessed = false;

export type resultType = {
  id: string | null;
  vin: string | null;
  county: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  model_year: string | null | number;
  make: string | null;
  model: string | null;
  electric_vehicle_type: string | null;
  clean_alternative_fuel_vehicle_eligibility: string | null;
  electric_range: string | null | number;
  legislative_district: string | null;
  dol_vehicle_id: string | null;
  electric_utility: string | null;
  census_tract: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

function normalizeHeader(header: string, index: number): string {
  if (isHeaderProcessed) return header;

  const normalized = slugify(header, {
    lower: true,
    strict: true,
    trim: true,
    replacement: "_",
  });
  if (index === TOTAL_HEADERS - 1) {
    isHeaderProcessed = true;
  }

  return normalized;
}

async function parseData(filePath: string): Promise<number> {
  let batch: Vehicle[] = [];
  let processedCount = 0;

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);

    Papa.parse(stream, {
      header: true,
      transformHeader: normalizeHeader,
      skipEmptyLines: true,
      dynamicTyping: false,

      step: async (results, parser) => {
        parser.pause();
        try {
          let initRow = results.data as resultType;
          if (typeof initRow.electric_range == "string") {
            initRow.electric_range = parseInt(initRow.electric_range, 10);
          }
          if (typeof initRow.model_year == "string") {
            initRow.model_year = parseInt(initRow.model_year, 10);
          }
          const row = initRow as Vehicle;
          SKIP_COLUMNS.forEach((col) => {
            delete row[col as keyof Vehicle];
          });

          batch.push(row);

          if (batch.length >= BATCH_SIZE) {
            await prisma.vehicle.createMany({ data: batch });
            processedCount += batch.length;
            console.log(`Processed ${processedCount} records...`);
            batch = [];
          }

          parser.resume();
        } catch (error) {
          parser.abort();
          reject(error);
        }
      },

      complete: async () => {
        try {
          if (batch.length > 0) {
            await prisma.vehicle.createMany({ data: batch });
            processedCount += batch.length;
          }
          resolve(processedCount);
        } catch (error) {
          reject(error);
        }
      },

      error: (err) => reject(err),
    });
  });
}

export async function GET() {
  try {
    // const filePath = process.cwd() + "/public/vehicles.csv";
    // const count = await parseData(filePath);

    return Response.json({
      success: true,
      //   processed: count,
    });
  } catch (error) {
    console.error("Import failed:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Import failed",
      }),
      { status: 500 }
    );
  }
}
