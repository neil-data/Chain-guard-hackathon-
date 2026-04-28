import threatZones from "./live-threat-zones.json";

type ThreatType = "war" | "piracy" | "sanctions" | "weather";

type Waypoint = {
  code: string;
  label: string;
  lat: number;
  lng: number;
};

type Edge = {
  from: string;
  to: string;
  distanceKm: number;
  baseRisk: number;
};

type ThreatZone = {
  lat: number;
  lon: number;
  threat_type: ThreatType | string;
  severity: number;
  radius_km: number;
  verified?: boolean;
};

export type EngineRequest = {
  origin: string;
  destination: string;
  cargoType?: string;
  cargoValue?: number;
};

export type EngineResponse = {
  status: "success";
  request: {
    origin: string;
    destination: string;
  };
  summary: {
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
  };
  llm_briefing: string;
  best_route_path: string[];
  gmaps_payload: {
    routes: Array<{
      rank: number;
      path: string[];
      points: Array<{ lat: number; lng: number; label: string }>;
      score: number;
    }>;
    threat_zones: ThreatZone[];
  };
};

const WAYPOINTS: Record<string, Waypoint> = {
  MUMBAI: { code: "MUMBAI", label: "Mumbai", lat: 18.9322, lng: 72.8375 },
  SINGAPORE: { code: "SINGAPORE", label: "Singapore", lat: 1.2897, lng: 103.8501 },
  DUBAI_JEBEL_ALI: { code: "DUBAI_JEBEL_ALI", label: "Dubai (Jebel Ali)", lat: 24.9857, lng: 55.0272 },
  SHANGHAI: { code: "SHANGHAI", label: "Shanghai", lat: 31.2304, lng: 121.4737 },
  BUSAN: { code: "BUSAN", label: "Busan", lat: 35.1796, lng: 129.0756 },
  SANTOS: { code: "SANTOS", label: "Santos", lat: -23.9618, lng: -46.3322 },
  COLOMBO: { code: "COLOMBO", label: "Colombo", lat: 6.9271, lng: 79.8612 },
  ROTTERDAM: { code: "ROTTERDAM", label: "Rotterdam", lat: 51.9244, lng: 4.4777 },
  HAMBURG: { code: "HAMBURG", label: "Hamburg", lat: 53.5753, lng: 9.93 },
  ANTWERP: { code: "ANTWERP", label: "Antwerp", lat: 51.2652, lng: 4.4069 },
  LOS_ANGELES: { code: "LOS_ANGELES", label: "Los Angeles", lat: 33.7395, lng: -118.2618 },
  NEW_YORK: { code: "NEW_YORK", label: "New York", lat: 40.6892, lng: -74.0445 },
  HONG_KONG: { code: "HONG_KONG", label: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  SAVANNAH: { code: "SAVANNAH", label: "Savannah", lat: 32.0835, lng: -81.0998 },
  PIRAEUS: { code: "PIRAEUS", label: "Piraeus", lat: 37.9475, lng: 23.6478 },
  ALGECIRAS: { code: "ALGECIRAS", label: "Algeciras", lat: 36.1408, lng: -5.4531 },
  JEDDAH: { code: "JEDDAH", label: "Jeddah", lat: 21.5433, lng: 39.1728 },
  PORT_KLANG: { code: "PORT_KLANG", label: "Port Klang", lat: 3.0319, lng: 101.3682 },
  TANJUNG_PELEPAS: { code: "TANJUNG_PELEPAS", label: "Tanjung Pelepas", lat: 1.3628, lng: 103.5501 },
  NINGBO: { code: "NINGBO", label: "Ningbo", lat: 29.8683, lng: 121.544 },
  MOMBASA: { code: "MOMBASA", label: "Mombasa", lat: -4.0435, lng: 39.6682 },
};

const CHOKEPOINTS = new Set([
  "DUBAI_JEBEL_ALI",
  "JEDDAH",
  "MOMBASA",
  "ALGECIRAS",
  "PIRAEUS",
  "COLOMBO",
  "SINGAPORE",
  "PORT_KLANG",
  "TANJUNG_PELEPAS",
]);

const EDGES: Edge[] = [
  { from: "MUMBAI", to: "COLOMBO", distanceKm: 1536, baseRisk: 0.22 },
  { from: "MUMBAI", to: "DUBAI_JEBEL_ALI", distanceKm: 1954, baseRisk: 0.22 },
  { from: "MUMBAI", to: "PORT_KLANG", distanceKm: 3570, baseRisk: 0.22 },
  { from: "MUMBAI", to: "HONG_KONG", distanceKm: 4305, baseRisk: 0.1 },
  { from: "MUMBAI", to: "BUSAN", distanceKm: 5775, baseRisk: 0.22 },
  { from: "MUMBAI", to: "ROTTERDAM", distanceKm: 6886, baseRisk: 0.22 },
  { from: "MUMBAI", to: "ANTWERP", distanceKm: 6885, baseRisk: 0.38 },
  { from: "SINGAPORE", to: "PORT_KLANG", distanceKm: 40, baseRisk: 0.1 },
  { from: "SINGAPORE", to: "TANJUNG_PELEPAS", distanceKm: 38, baseRisk: 0.1 },
  { from: "SINGAPORE", to: "COLOMBO", distanceKm: 2732, baseRisk: 0.1 },
  { from: "SINGAPORE", to: "HONG_KONG", distanceKm: 2591, baseRisk: 0.1 },
  { from: "SINGAPORE", to: "BUSAN", distanceKm: 4584, baseRisk: 0.1 },
  { from: "SINGAPORE", to: "SHANGHAI", distanceKm: 3800, baseRisk: 0.18 },
  { from: "SINGAPORE", to: "LOS_ANGELES", distanceKm: 14141, baseRisk: 0.1 },
  { from: "SINGAPORE", to: "ROTTERDAM", distanceKm: 11641, baseRisk: 0.1 },
  { from: "DUBAI_JEBEL_ALI", to: "JEDDAH", distanceKm: 1663, baseRisk: 0.22 },
  { from: "DUBAI_JEBEL_ALI", to: "COLOMBO", distanceKm: 3317, baseRisk: 0.38 },
  { from: "DUBAI_JEBEL_ALI", to: "MOMBASA", distanceKm: 3629, baseRisk: 0.1 },
  { from: "DUBAI_JEBEL_ALI", to: "BUSAN", distanceKm: 7055, baseRisk: 0.22 },
  { from: "DUBAI_JEBEL_ALI", to: "ALGECIRAS", distanceKm: 5830, baseRisk: 0.38 },
  { from: "DUBAI_JEBEL_ALI", to: "ROTTERDAM", distanceKm: 5176, baseRisk: 0.1 },
  { from: "SHANGHAI", to: "NINGBO", distanceKm: 190, baseRisk: 0.1 },
  { from: "SHANGHAI", to: "HONG_KONG", distanceKm: 1220, baseRisk: 0.14 },
  { from: "SHANGHAI", to: "BUSAN", distanceKm: 865, baseRisk: 0.12 },
  { from: "SHANGHAI", to: "LOS_ANGELES", distanceKm: 10456, baseRisk: 0.22 },
  { from: "SHANGHAI", to: "NEW_YORK", distanceKm: 11860, baseRisk: 0.38 },
  { from: "BUSAN", to: "HONG_KONG", distanceKm: 2090, baseRisk: 0.1 },
  { from: "BUSAN", to: "COLOMBO", distanceKm: 5912, baseRisk: 0.22 },
  { from: "BUSAN", to: "ROTTERDAM", distanceKm: 8936, baseRisk: 0.22 },
  { from: "BUSAN", to: "NEW_YORK", distanceKm: 11254, baseRisk: 0.1 },
  { from: "BUSAN", to: "LOS_ANGELES", distanceKm: 9209, baseRisk: 0.1 },
  { from: "SANTOS", to: "SAVANNAH", distanceKm: 7244, baseRisk: 0.1 },
  { from: "SANTOS", to: "LOS_ANGELES", distanceKm: 9943, baseRisk: 0.38 },
  { from: "SANTOS", to: "PIRAEUS", distanceKm: 10027, baseRisk: 0.1 },
  { from: "SANTOS", to: "JEDDAH", distanceKm: 10534, baseRisk: 0.1 },
  { from: "COLOMBO", to: "JEDDAH", distanceKm: 4658, baseRisk: 0.38 },
  { from: "COLOMBO", to: "PIRAEUS", distanceKm: 6602, baseRisk: 0.1 },
  { from: "COLOMBO", to: "ANTWERP", distanceKm: 8397, baseRisk: 0.1 },
  { from: "COLOMBO", to: "ROTTERDAM", distanceKm: 8401, baseRisk: 0.1 },
  { from: "COLOMBO", to: "LOS_ANGELES", distanceKm: 15106, baseRisk: 0.22 },
  { from: "ROTTERDAM", to: "ANTWERP", distanceKm: 74, baseRisk: 0.38 },
  { from: "ROTTERDAM", to: "HAMBURG", distanceKm: 410, baseRisk: 0.22 },
  { from: "ROTTERDAM", to: "ALGECIRAS", distanceKm: 1922, baseRisk: 0.38 },
  { from: "ROTTERDAM", to: "SAVANNAH", distanceKm: 6974, baseRisk: 0.22 },
  { from: "ROTTERDAM", to: "NEW_YORK", distanceKm: 5858, baseRisk: 0.38 },
  { from: "HAMBURG", to: "ANTWERP", distanceKm: 454, baseRisk: 0.1 },
  { from: "HAMBURG", to: "NEW_YORK", distanceKm: 6129, baseRisk: 0.22 },
  { from: "ANTWERP", to: "SAVANNAH", distanceKm: 6800, baseRisk: 0.14 },
  { from: "ANTWERP", to: "LOS_ANGELES", distanceKm: 9033, baseRisk: 0.22 },
  { from: "LOS_ANGELES", to: "NEW_YORK", distanceKm: 3948, baseRisk: 0.22 },
  { from: "HONG_KONG", to: "PIRAEUS", distanceKm: 8549, baseRisk: 0.1 },
  { from: "HONG_KONG", to: "NEW_YORK", distanceKm: 12958, baseRisk: 0.1 },
  { from: "HONG_KONG", to: "LOS_ANGELES", distanceKm: 11671, baseRisk: 0.1 },
  { from: "HONG_KONG", to: "ROTTERDAM", distanceKm: 9326, baseRisk: 0.1 },
  { from: "PIRAEUS", to: "ROTTERDAM", distanceKm: 2153, baseRisk: 0.22 },
  { from: "PIRAEUS", to: "NEW_YORK", distanceKm: 7926, baseRisk: 0.22 },
  { from: "ALGECIRAS", to: "ANTWERP", distanceKm: 1855, baseRisk: 0.1 },
  { from: "ALGECIRAS", to: "ROTTERDAM", distanceKm: 1922, baseRisk: 0.38 },
  { from: "JEDDAH", to: "ANTWERP", distanceKm: 4463, baseRisk: 0.1 },
  { from: "JEDDAH", to: "NEW_YORK", distanceKm: 10254, baseRisk: 0.22 },
  { from: "PORT_KLANG", to: "ROTTERDAM", distanceKm: 10213, baseRisk: 0.1 },
  { from: "PORT_KLANG", to: "NEW_YORK", distanceKm: 15131, baseRisk: 0.22 },
  { from: "PORT_KLANG", to: "NINGBO", distanceKm: 3664, baseRisk: 0.38 },
  { from: "PORT_KLANG", to: "HONG_KONG", distanceKm: 2551, baseRisk: 0.1 },
  { from: "TANJUNG_PELEPAS", to: "ROTTERDAM", distanceKm: 10508, baseRisk: 0.1 },
  { from: "TANJUNG_PELEPAS", to: "ANTWERP", distanceKm: 10523, baseRisk: 0.38 },
  { from: "NINGBO", to: "LOS_ANGELES", distanceKm: 10557, baseRisk: 0.1 },
  { from: "NINGBO", to: "SAVANNAH", distanceKm: 12724, baseRisk: 0.22 },
  { from: "NINGBO", to: "ROTTERDAM", distanceKm: 10050, baseRisk: 0.22 },
  { from: "MOMBASA", to: "PIRAEUS", distanceKm: 4953, baseRisk: 0.22 },
  { from: "MOMBASA", to: "SAVANNAH", distanceKm: 13123, baseRisk: 0.1 },
];

const CARGO_RISK_MULTIPLIER: Record<string, number> = {
  CONTAINER: 1,
  LIQUID: 1.15,
  DRY: 0.95,
  GENERAL: 1,
};

const THREAT_WEIGHT: Record<string, number> = {
  war: 1,
  piracy: 0.82,
  sanctions: 0.72,
  weather: 0.58,
};

const adjacency = buildAdjacency();

function buildAdjacency() {
  const graph = new Map<string, Edge[]>();

  for (const edge of EDGES) {
    if (!graph.has(edge.from)) graph.set(edge.from, []);
    if (!graph.has(edge.to)) graph.set(edge.to, []);

    graph.get(edge.from)?.push(edge);
    graph.get(edge.to)?.push({ ...edge, from: edge.to, to: edge.from });
  }

  return graph;
}

function haversineKm(a: Waypoint, b: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(s));
}

function edgeThreatScore(from: string, to: string) {
  const start = WAYPOINTS[from];
  const end = WAYPOINTS[to];
  if (!start || !end) return 0;

  let maxScore = 0;
  for (const zone of threatZones as ThreatZone[]) {
    const distance = Math.min(
      haversineKm(start, { lat: zone.lat, lng: zone.lon }),
      haversineKm(end, { lat: zone.lat, lng: zone.lon }),
    );

    if (distance > zone.radius_km + 900) continue;

    const distanceFactor = Math.max(0, 1 - distance / (zone.radius_km + 900));
    const typeWeight = THREAT_WEIGHT[zone.threat_type] ?? 0.45;
    maxScore = Math.max(maxScore, zone.severity * distanceFactor * typeWeight);
  }

  return Number(maxScore.toFixed(2));
}

function edgeWeatherRisk(from: string, to: string) {
  const start = WAYPOINTS[from];
  const end = WAYPOINTS[to];
  const midLat = (Math.abs(start.lat) + Math.abs(end.lat)) / 2;
  const seasonal = (new Date().getUTCMonth() + 1) % 6;
  const tropicalBandBoost = midLat < 25 ? 0.22 : 0.08;
  const longHaulBoost = haversineKm(start, { lat: end.lat, lng: end.lng }) > 8000 ? 0.08 : 0;

  return Number(Math.min(0.92, tropicalBandBoost + longHaulBoost + seasonal * 0.03).toFixed(2));
}

function routeCost(path: string[]) {
  let total = 0;

  for (let index = 0; index < path.length - 1; index += 1) {
    const from = path[index];
    const to = path[index + 1];
    const edge = adjacency.get(from)?.find((candidate) => candidate.to === to);
    if (!edge) return Number.POSITIVE_INFINITY;

    const threat = edgeThreatScore(from, to) / 10;
    const weather = edgeWeatherRisk(from, to);
    total += edge.distanceKm * (1 + edge.baseRisk * 0.35 + threat * 0.45 + weather * 0.2);
  }

  return total;
}

function enumeratePaths(origin: string, destination: string, maxDepth = 6, limit = 12) {
  const results: string[][] = [];

  const visit = (node: string, path: string[]) => {
    if (results.length >= limit || path.length > maxDepth) return;
    if (node === destination) {
      results.push(path);
      return;
    }

    for (const edge of adjacency.get(node) ?? []) {
      if (path.includes(edge.to)) continue;
      visit(edge.to, [...path, edge.to]);
    }
  };

  visit(origin, [origin]);

  return results.sort((left, right) => routeCost(left) - routeCost(right)).slice(0, 3);
}

function getRouteEdge(from: string, to: string) {
  const edge = adjacency.get(from)?.find((candidate) => candidate.to === to);
  if (!edge) throw new Error(`Missing edge ${from} -> ${to}`);
  return edge;
}

function riskClassFor(score: number) {
  if (score >= 80) return "CRITICAL";
  if (score >= 65) return "HIGH";
  if (score >= 45) return "MEDIUM";
  if (score >= 25) return "LOW";
  return "OPTIMAL";
}

function formatWarnings({
  warFlag,
  piracyFlag,
  sanctionsFlag,
  weatherRiskMax,
  chokepoints,
}: {
  warFlag: number;
  piracyFlag: number;
  sanctionsFlag: number;
  weatherRiskMax: number;
  chokepoints: number;
}) {
  const warnings: string[] = [];

  if (warFlag) warnings.push("Route intersects a live conflict corridor. Maintain naval advisories and reroute authority.");
  if (piracyFlag) warnings.push("Elevated piracy exposure detected near route approach. Enforce hardening and watch rotation.");
  if (sanctionsFlag) warnings.push("Sanctions-sensitive waters detected. Validate compliance before sailing.");
  if (weatherRiskMax >= 0.45) warnings.push("Weather volatility is elevated on at least one leg. Plan extra schedule buffer.");
  if (chokepoints >= 2) warnings.push("Multiple chokepoints increase disruption sensitivity and convoy dependency.");

  return warnings;
}

function buildDeterministicBriefing(result: EngineResponse) {
  const summary = result.summary;
  const warnings = summary.warnings.length > 0 ? summary.warnings.map((item) => `- ${item}`).join("\n") : "- No major route warnings detected.";

  return [
    "### Route Overview",
    `- Recommended passage: ${result.best_route_path.join(" -> ")}`,
    `- Distance: ${summary.distance_km} km`,
    `- Transit estimate: ${summary.estimated_days} days`,
    "",
    "### Threat Summary",
    `- Risk class: ${summary.risk_class} (${summary.risk_score}/100)`,
    `- Threat severity: ${summary.threat_severity}/10`,
    `- Verified live threats: ${summary.verified_threats}`,
    "",
    "### Operational Notes",
    warnings,
    "",
    "### Recommendation",
    "- Maintain route monitoring every watch cycle and preserve diversion readiness through each chokepoint.",
  ].join("\n");
}

export function analyzeRouteNetwork(request: EngineRequest): EngineResponse {
  const origin = request.origin.toUpperCase();
  const destination = request.destination.toUpperCase();
  const cargoType = (request.cargoType ?? "GENERAL").toUpperCase();
  const cargoValue = request.cargoValue ?? 0.5;

  if (!WAYPOINTS[origin]) throw new Error(`Unknown origin: ${origin}`);
  if (!WAYPOINTS[destination]) throw new Error(`Unknown destination: ${destination}`);

  const paths = enumeratePaths(origin, destination);
  if (paths.length === 0) {
    throw new Error(`No supported route found between ${origin} and ${destination}.`);
  }

  const routes = paths.map((path, index) => {
    const legs = path.slice(0, -1).map((port, legIndex) => {
      const edge = getRouteEdge(port, path[legIndex + 1]);
      const threat = edgeThreatScore(port, path[legIndex + 1]);
      const weather = edgeWeatherRisk(port, path[legIndex + 1]);
      return { edge, threat, weather };
    });

    const distanceKm = legs.reduce((sum, leg) => sum + leg.edge.distanceKm, 0);
    const threatSeverity = Math.max(...legs.map((leg) => leg.threat), 0);
    const weatherRiskMax = Math.max(...legs.map((leg) => leg.weather), 0);
    const nearbyZones = (threatZones as ThreatZone[]).filter((zone) =>
      path.some((port) => haversineKm(WAYPOINTS[port], { lat: zone.lat, lng: zone.lon }) <= zone.radius_km + 500),
    );
    const warFlag = Number(nearbyZones.some((zone) => zone.threat_type === "war"));
    const piracyFlag = Number(nearbyZones.some((zone) => zone.threat_type === "piracy"));
    const sanctionsFlag = Number(nearbyZones.some((zone) => zone.threat_type === "sanctions"));
    const chokepoints = path.filter((port) => CHOKEPOINTS.has(port)).length;
    const verifiedThreats = nearbyZones.filter((zone) => zone.verified).length;
    const cargoMultiplier = CARGO_RISK_MULTIPLIER[cargoType] ?? 1;
    const riskScore = Math.min(
      99,
      Math.round(
        (
          distanceKm / 220 +
          threatSeverity * 4.6 +
          weatherRiskMax * 18 +
          chokepoints * 5 +
          warFlag * 14 +
          sanctionsFlag * 10 +
          piracyFlag * 9 +
          cargoValue * 10
        ) * cargoMultiplier,
      ),
    );

    return {
      rank: index + 1,
      path,
      points: path.map((port) => ({
        lat: WAYPOINTS[port].lat,
        lng: WAYPOINTS[port].lng,
        label: WAYPOINTS[port].label,
      })),
      distanceKm,
      estimatedDays: Number((distanceKm / 650).toFixed(1)),
      threatSeverity: Number(threatSeverity.toFixed(1)),
      weatherRiskMax,
      chokepoints,
      warFlag,
      piracyFlag,
      sanctionsFlag,
      verifiedThreats,
      warnings: formatWarnings({ warFlag, piracyFlag, sanctionsFlag, weatherRiskMax, chokepoints }),
      riskScore,
      riskClass: riskClassFor(riskScore),
    };
  });

  routes.sort((left, right) => left.riskScore - right.riskScore);

  const bestRoute = routes[0];
  const response: EngineResponse = {
    status: "success",
    request: { origin, destination },
    summary: {
      risk_class: bestRoute.riskClass,
      risk_score: bestRoute.riskScore,
      distance_km: bestRoute.distanceKm,
      estimated_days: bestRoute.estimatedDays,
      threat_severity: bestRoute.threatSeverity,
      weather_risk_max: bestRoute.weatherRiskMax,
      n_chokepoints: bestRoute.chokepoints,
      war_flag: bestRoute.warFlag,
      piracy_flag: bestRoute.piracyFlag,
      sanctions_flag: bestRoute.sanctionsFlag,
      verified_threats: bestRoute.verifiedThreats,
      warnings: bestRoute.warnings,
    },
    llm_briefing: "",
    best_route_path: bestRoute.path,
    gmaps_payload: {
      routes: routes.map((route) => ({
        rank: route.rank,
        path: route.path,
        points: route.points,
        score: route.riskScore,
      })),
      threat_zones: threatZones as ThreatZone[],
    },
  };

  response.llm_briefing = buildDeterministicBriefing(response);
  return response;
}
