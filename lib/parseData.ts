import fs from "fs";
import Papa from "papaparse";
import prisma from "../lib/db";
import slugify from "slugify";
import type { Vehicle } from "@/generated/prisma/client";

const BATCH_SIZE = 1000;

const SKIP_COLUMNS = new Set(["vehicle_location"]);

function normalizeHeader(header: string, index: number): string {
  const normalized = slugify(header, {
    lower: true,
    strict: true,
    trim: true,
  });
  return normalized;
}

async function parseData(filePath: string): Promise<void> {
  let batch: any[] = [];
  let processedCount = 0;
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);

    Papa.parse(stream, {
      header: true,
      transformHeader: normalizeHeader,
      skipEmptyLines: true,
      dynamicTyping: true,

      step: async (results, parser) => {
        parser.pause();
        const row = results.data as Vehicle;
        SKIP_COLUMNS.forEach((col) => delete row[col as keyof Vehicle]);
        batch.push(row);
        if (batch.length >= BATCH_SIZE) {
          try {
            await prisma.vehicle.createMany({
              data: batch,
            });
            processedCount += batch.length;
            console.log(`Processed ${processedCount} records...`);
            batch = [];
          } catch (error) {
            parser.abort();
            reject(error);
            return;
          }
        }
        parser.resume();
      },
      complete: async () => {
        if (batch.length > 0) {
          try {
            await prisma.vehicle.createMany({
              data: batch,
            });
            processedCount += batch.length;
            console.log(`Processed ${processedCount} records...`);
          } catch (error) {
            reject(error);
            return;
          }
        }
        console.log("Data parsing and insertion complete.");
        resolve();
      },
    });
  });
}

parseData("../public/vehicles.csv")
  .then(() => {
    console.log("All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during data parsing:", error);
    process.exit(1);
  });
