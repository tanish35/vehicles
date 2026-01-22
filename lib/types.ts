export interface SummaryResponse {
  totalVehicles: number;
  vehicleByType: {
    BEV: number;
    PHEV: number;
  };
  top10Makes: Array<{
    make: string;
    _count: { make: number };
  }>;
  avgElectricRange: number;
  eligibleVehicles: number;
  ineligibleVehicles: number;
}

export interface TrendsResponse {
  vehicleCountByYear: Array<{
    model_year: number;
    _count: { model_year: number };
  }>;
  averageRangeByYear: Array<{
    model_year: number;
    _avg: { electric_range: number | null };
  }>;
  BEVPHEVRatioByYear: Array<{
    year: number;
    bevCount: number;
    phevCount: number;
    ratio: number | null;
  }>;
}

export interface AnalyzeRequest {
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

export interface AnalyzeResponse {
  groupBy: string;
  data: Array<{
    [key: string]:
      | string
      | number
      | { _all: number }
      | { electric_range: number | null };
    _count: { _all: number };
    _avg: { electric_range: number | null };
  }>;
}

export interface Vehicle {
  id: string;
  vin: string;
  county: string;
  city: string;
  state: string;
  postal_code: string;
  model_year: number;
  make: string;
  model: string;
  electric_vehicle_type: string;
  clean_alternative_fuel_vehicle_eligibility: string;
  electric_range: number;
  legislative_district: string;
  dol_vehicle_id: string;
  electric_utility: string;
  census_tract: string;
  created_at: string;
  updated_at: string;
}

export interface CountyResponse {
  county: string;
  vehicles: Vehicle[];
  page: number;
  pageSize: number;
}

export interface MakeModelResponse {
  make: string;
  models: Array<{
    model: string;
    _count: { model: number };
    _avg: { electric_range: number | null };
  }>;
}
