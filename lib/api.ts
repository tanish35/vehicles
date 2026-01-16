import {
  SummaryResponse,
  TrendsResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  CountyResponse,
  MakeModelResponse,
} from "./types";

const BASE_URL = "/api/v1/vehicles";

export async function fetchSummary(): Promise<SummaryResponse> {
  const res = await fetch(`${BASE_URL}/summary`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function fetchTrends(): Promise<TrendsResponse> {
  const res = await fetch(`${BASE_URL}/trends`);
  if (!res.ok) throw new Error("Failed to fetch trends");
  return res.json();
}

export async function fetchAnalyze(
  request: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Failed to fetch analyze data");
  return res.json();
}

export async function fetchCountyVehicles(
  countyName: string,
  page: number = 1,
  pageSize: number = 10
): Promise<CountyResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  const res = await fetch(`${BASE_URL}/county/${encodeURIComponent(countyName)}?${params}`);
  if (!res.ok) throw new Error("Failed to fetch county vehicles");
  return res.json();
}

export async function fetchMakeModels(make: string): Promise<MakeModelResponse> {
  const res = await fetch(`${BASE_URL}/make/${encodeURIComponent(make)}/model`);
  if (!res.ok) throw new Error("Failed to fetch make models");
  return res.json();
}
