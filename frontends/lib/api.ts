export interface RouteRequest {
  origin: string;
  destination: string;
  cargoType?: string;
  cargoValue?: number;
}

export interface RouteSummary {
  risk_class: string;
  risk_score: number;
  distance_km: number;
  estimated_days: number;
  threat_severity: number;
  weather_risk_max: number;
  n_chokepoints: number;
  war_flag: number;
  piracy_flag: number;
  sanctions_flag: number;
  verified_threats: number;
  warnings: string[];
}

export interface AnalysisResponse {
  status: string;
  request: {
    origin: string;
    destination: string;
  };
  summary: RouteSummary;
  llm_briefing: string;
  best_route_path: string[];
  gmaps_payload: unknown;
}

export async function analyzeRoute(request: RouteRequest): Promise<AnalysisResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let detail = "API Error";

    try {
      const error = await response.json();
      detail = error.detail || error.error || detail;
    } catch {
      // Ignore non-JSON errors.
    }

    throw new Error(detail);
  }

  return response.json();
}
