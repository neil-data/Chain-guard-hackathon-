export const MOCK_ANALYSIS_DETAILS = {
  score: 31.94,
  riskClass: "MEDIUM",
  distance: 6886,
  durationETA: 10.6,
  threatCount: 4,
  threatConfidenceAvg: 0.773,
  recommendedRoute: {
    path: "MUMBAI → ROTTERDAM",
    distance: 6886,
    durationETA: 10.6,
    score: 31.94,
    flags: ["Safe", "No Piracy", "No Sanctions"],
  },
  altRoutes: [
    { id: 2, path: "MUMBAI → NEW YORK → ROTTERDAM", warning: "HIGH WEATHER: 0.87", score: 38.60 },
    { id: 3, path: "MUMBAI → ANTWERP → ROTTERDAM", warning: "CONGESTION: 0.65", score: 42.17 }
  ],
  threats: [
    { mode: "WAR", region: "Strait of Hormuz", severity: 9.17, verified: true },
    { mode: "WAR", region: "Strait of Hormuz", severity: 8.86, verified: true },
    { mode: "SANCTIONS", region: "Iran Region", severity: 8.43, verified: true },
    { mode: "SANCTIONS", region: "Persian Gulf", severity: 7.78, verified: true }
  ],
  riskBreakdown: {
    threatSeverity: 20,
    weather: 43.3,
    distance: 34.4,
    chokepoints: 0,
    warZone: 0,
    sanctions: 0
  },
  systemStatus: {
    newsCrawler: "ACTIVE",
    xgBoost: "R\u00b2=0.9691",
    geminiLLM: "CONNECTED",
    api: "ONLINE",
    weatherApi: "SYNTHETIC"
  },
  weatherRegions: [
    { name: "Arabian Sea", risk: "LOW", details: "Wind 2.0 m/s \u00b7 Clear" },
    { name: "Mediterranean", risk: "MEDIUM", details: "Wind 12.0 m/s \u00b7 Swell" }
  ],
  briefingMarkdown: `
### Executive Summary
Based on the latest multi-modal data synthesis, the route from **MUMBAI to ROTTERDAM** via the recommended primary path is assigned a **MEDIUM** risk score of \`31.94/100\`. This path optimally balances current threat geometries in the Middle East with projected weather patterns.

### Threat Landscape
- **Strait of Hormuz / Persian Gulf**: While live feeds indicate 4 verified active threats (primarily war risk and regional sanctions), the recommended path circumvents the highest-severity vectors. Threat severity component contribution to total risk is constrained to 2.0/10.
- **Piracy & Sanctions**: The primary route maintains compliance with all current OFAC and international sanctions. No active piracy clusters detected along the transit corridor.

### Environmental Factors
- **Arabian Sea**: Optimal conditions. Wind speeds averaging 2.0 m/s with clear visibility.
- **Mediterranean**: Moderate swell and elevated wind speeds (12.0 m/s). This contributes the largest share (43.3%) to the overall risk profile but remains within standard operational tolerances.

### Tactical Recommendations
1. **Proceed with Route #1**: Maintain standard watch conditions.
2. **Weather Monitoring**: Implement heightened monitoring upon entering the Mediterranean basin due to projected swells.
3. **Alternative Routes**: Route #2 (via New York) is viable but introduces significant weather friction (0.87 index). Route #3 introduces congestion risks at Antwerp. Both should be held as contingencies only.`
};
export const MOCK_RESPONSE = {
  status: "success",
  request: { origin: "MUMBAI", destination: "ROTTERDAM" },
  summary: {
    risk_class: "MEDIUM",
    risk_score: 31.94,
    distance_km: 6886,
    estimated_days: 10.6,
    threat_severity: 2.0,
    weather_risk_max: 0.433,
    n_chokepoints: 0,
    war_flag: 0,
    piracy_flag: 0,
    sanctions_flag: 0,
    verified_threats: 0,
    warnings: []
  },
  llm_briefing: `**Confidential Briefing for Ship's Captain**...`,
  best_route_path: ["MUMBAI", "ROTTERDAM"],
  gmaps_payload: {
    // ... paste full gmaps_payload from your Postman response
  }
}
