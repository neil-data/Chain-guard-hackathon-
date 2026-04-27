"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Navigation2 } from "lucide-react";
import DynamicGlobe from "@/components/DynamicGlobe";
import { AnalysisResponse } from "@/lib/api";
import { getLastAnalysis } from "@/hooks/useRouteAnalysis";

interface DerivedThreat {
  mode: string;
  region: string;
  severity: number;
  verified: boolean;
}

function deriveThreats(response: AnalysisResponse): DerivedThreat[] {
  const threats: DerivedThreat[] = [];
  const summary = response.summary;

  if (summary.war_flag > 0) {
    threats.push({
      mode: "WAR",
      region: `${response.request.origin} -> ${response.request.destination} corridor`,
      severity: summary.threat_severity,
      verified: summary.verified_threats > 0,
    });
  }

  if (summary.piracy_flag > 0) {
    threats.push({
      mode: "PIRACY",
      region: "Route corridor",
      severity: Math.min(summary.threat_severity * 0.8, 10),
      verified: summary.verified_threats > 0,
    });
  }

  if (summary.sanctions_flag > 0) {
    threats.push({
      mode: "SANCTIONS",
      region: "Transit zone",
      severity: Math.min(summary.threat_severity * 0.7, 10),
      verified: summary.verified_threats > 0,
    });
  }

  if (summary.n_chokepoints > 0) {
    threats.push({
      mode: "CHOKEPOINT",
      region: `${summary.n_chokepoints} chokepoint(s) on path`,
      severity: Math.min(summary.n_chokepoints * 2, 10),
      verified: true,
    });
  }

  if (threats.length === 0 && summary.verified_threats > 0) {
    threats.push({
      mode: "GENERAL",
      region: "Along route",
      severity: summary.threat_severity,
      verified: true,
    });
  }

  return threats;
}

function modeBadgeClass(mode: string) {
  switch (mode) {
    case "WAR":
      return "border-red-600 bg-red-600 text-red-500";
    case "SANCTIONS":
      return "border-amber-600 bg-amber-600 text-amber-500";
    case "CHOKEPOINT":
      return "border-navy-600 bg-navy-700 text-brand-gray-2";
    default:
      return "border-navy-600 bg-navy-700 text-brand-gray-2";
  }
}

export default function ThreatsPage() {
  const [filter, setFilter] = useState("ALL");
  const [analysis] = useState<AnalysisResponse | null>(() => {
    if (typeof window === "undefined") return null;
    return getLastAnalysis();
  });
  const isEmpty = !analysis;

  if (isEmpty) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
        <Navigation2 size={48} className="mb-6 text-brand-gray-3" />
        <h2 className="text-2xl font-bold text-brand-gray-1">No Threat Data</h2>
        <p className="mt-3 max-w-md text-brand-gray-2">
          Run a route analysis to populate the threat intelligence center with live route conditions.
        </p>
        <Link
          href="/analyzer"
          className="mt-8 rounded-xl bg-teal-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-teal-400"
        >
          Analyze Route &rarr;
        </Link>
      </div>
    );
  }

  if (!analysis) return null;

  const threats = deriveThreats(analysis);
  const summary = analysis.summary;
  const modes = ["ALL", ...Array.from(new Set(threats.map((threat) => threat.mode)))];
  const filteredThreats = filter === "ALL" ? threats : threats.filter((threat) => threat.mode === filter);
  const totalVerified = threats.filter((threat) => threat.verified).length;
  const avgSeverity = threats.length > 0 ? threats.reduce((sum, threat) => sum + threat.severity, 0) / threats.length : 0;
  const highSeverity = threats.filter((threat) => threat.severity > 7).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-gray-1">Threat Intelligence Center</h2>
        <div className="mt-1 text-sm text-brand-gray-2">
          Derived from latest {analysis.request.origin} &rarr; {analysis.request.destination} analysis
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="font-mono text-[11px]"><span className="text-brand-gray-1">{threats.length}</span> <span className="text-brand-gray-2">TOTAL</span></div>
          <div className="h-3 w-px bg-navy-600" />
          <div className="font-mono text-[11px]"><span className="text-brand-gray-1">{totalVerified}</span> <span className="text-brand-gray-2">VERIFIED</span></div>
          <div className="h-3 w-px bg-navy-600" />
          <div className="font-mono text-[11px]"><span className="text-brand-gray-1">{avgSeverity.toFixed(2)}</span> <span className="text-brand-gray-2">AVG SEV</span></div>
          <div className="h-3 w-px bg-navy-600" />
          <div className="font-mono text-[11px]"><span className="text-brand-gray-1">{highSeverity}</span> <span className="text-brand-gray-2">HIGH SEV</span></div>
        </div>
      </div>

      <div className="flex gap-2">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setFilter(mode)}
            className={`rounded-full px-4 py-1.5 text-xs font-mono transition ${
              filter === mode
                ? "bg-teal-500 text-white"
                : "bg-navy-700 text-brand-gray-2 hover:text-brand-gray-1"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {filteredThreats.length === 0 ? (
        <div className="rounded-2xl border border-navy-600 bg-navy-800 p-10 text-center">
          <CheckCircle2 size={32} className="mx-auto mb-3 text-teal-500" />
          <div className="font-medium text-brand-gray-1">No Active Threats</div>
          <div className="mt-1 text-sm text-brand-gray-2">
            The analyzed route is clear of {filter !== "ALL" ? filter.toLowerCase() : ""} threats.
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-navy-600 bg-navy-800">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-navy-600 bg-[var(--color-terminal-bg)]">
                <th className="px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.15em] text-brand-gray-3">Type</th>
                <th className="px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.15em] text-brand-gray-3">Region</th>
                <th className="px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.15em] text-brand-gray-3">Severity</th>
                <th className="px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.15em] text-brand-gray-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredThreats.map((threat, index) => (
                <tr key={index} className="border-b border-navy-600 transition-colors hover:bg-navy-700 last:border-0">
                  <td className="px-6 py-4 text-sm font-mono text-brand-gray-2">
                    <span className={`rounded border px-2 py-0.5 text-[10px] tracking-wider ${modeBadgeClass(threat.mode)}`}>
                      {threat.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-brand-gray-1">{threat.region}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-brand-gray-1">{threat.severity.toFixed(2)}</span>
                      <div className="h-1 w-12 overflow-hidden rounded bg-navy-600">
                        <div
                          className={`h-full ${threat.severity > 8 ? "bg-red-500" : threat.severity > 5 ? "bg-amber-500" : "bg-teal-500"}`}
                          style={{ width: `${(threat.severity / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {threat.verified ? (
                      <div className="flex items-center gap-1.5 text-teal-500">
                        <CheckCircle2 size={14} />
                        <span className="font-mono text-[10px]">VERIFIED</span>
                      </div>
                    ) : (
                      <span className="font-mono text-[10px] text-brand-gray-2">PENDING</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-[360px] overflow-hidden rounded-2xl border border-navy-600 bg-navy-800">
          <DynamicGlobe height={360} showThreats interactive autoRotate />
        </div>

        <div className="rounded-2xl border border-navy-600 bg-navy-800 p-6">
          <div className="font-medium text-brand-gray-1">Verification Algorithm</div>

          <div className="mt-4 rounded-xl border border-navy-600 bg-[var(--color-terminal-bg)] p-5">
            <div className="font-mono text-sm text-teal-500">Psi(a) = 0.30*T(s) + 0.25*tau(t) + 0.20*G(a) + 0.25*C</div>
            <div className="mt-3 font-mono text-xs text-brand-gray-3">theta = 0.60 - Verification threshold</div>
          </div>

          <div className="mt-6 space-y-3 font-mono text-[11px] text-brand-gray-2">
            <div className="flex gap-4"><span className="w-12 text-brand-gray-1">T(s)</span> Source Trust Index (0-1)</div>
            <div className="flex gap-4"><span className="w-12 text-brand-gray-1">tau(t)</span> Temporal Decay Factor</div>
            <div className="flex gap-4"><span className="w-12 text-brand-gray-1">G(a)</span> Geolocation Confidence</div>
            <div className="flex gap-4"><span className="w-12 text-brand-gray-1">C</span> Multi-source Corroboration</div>
          </div>

          <div className="mt-6 border-t border-navy-600 pt-4">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-brand-gray-3">Route Flags</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "WAR", active: summary.war_flag > 0, activeClass: "border-red-600 bg-red-600 text-red-500" },
                { label: "PIRACY", active: summary.piracy_flag > 0, activeClass: "border-amber-600 bg-amber-600 text-amber-500" },
                { label: "SANCTIONS", active: summary.sanctions_flag > 0, activeClass: "border-amber-600 bg-amber-600 text-amber-500" },
              ].map((flag) => (
                <div
                  key={flag.label}
                  className={`rounded-lg border px-3 py-1 text-[10px] font-mono ${
                    flag.active ? flag.activeClass : "border-teal-500 bg-teal-600 text-teal-500"
                  }`}
                >
                  {flag.label}: {flag.active ? "ACTIVE" : "CLEAR"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
