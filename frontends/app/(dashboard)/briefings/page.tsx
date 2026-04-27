"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navigation2, Search, ShieldAlert, X } from "lucide-react";
import Markdown from "react-markdown";
import { AnalysisHistoryEntry, getAnalysisHistory } from "@/hooks/useRouteAnalysis";

function riskColor(risk: string) {
  if (risk === "CRITICAL" || risk === "HIGH") return "bg-red-600 text-red-500";
  if (risk === "MEDIUM") return "bg-amber-600 text-amber-500";
  return "bg-teal-600 text-teal-500";
}

function formatDate(iso: string) {
  try {
    const date = new Date(iso);
    return (
      date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) +
      " " +
      date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) +
      " UTC"
    );
  } catch {
    return iso;
  }
}

function briefingId(entry: AnalysisHistoryEntry, index: number) {
  return `BFG-${String(100 - index).padStart(3, "0")}`;
}

export default function BriefingsPage() {
  const [search, setSearch] = useState("");
  const [selectedBriefing, setSelectedBriefing] = useState<AnalysisHistoryEntry | null>(null);
  const [history] = useState<AnalysisHistoryEntry[]>(() => {
    if (typeof window === "undefined") return [];
    return getAnalysisHistory();
  });

  const filtered = history.filter((briefing) => {
    const query = search.toLowerCase();
    const route = `${briefing.request.origin} ${briefing.request.destination}`.toLowerCase();
    return route.includes(query);
  });

  return (
    <div className="mx-auto max-w-7xl pb-10">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-gray-1">Intelligence Briefings</h2>
          <div className="mt-1 text-sm text-brand-gray-2">Generated Gemini tactical reports from your analyses</div>
        </div>
        <Link
          href="/analyzer"
          className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-400"
        >
          New Analysis &rarr;
        </Link>
      </div>

      <div className="relative mt-8 max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-3" />
        <input
          type="text"
          placeholder="Search by route..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-navy-600 bg-[var(--color-terminal-bg)] py-3 pl-11 pr-4 text-sm text-brand-gray-1 focus:border-teal-500 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <Navigation2 size={40} className="mb-4 text-brand-gray-3" />
          <p className="text-sm text-brand-gray-2">No briefings yet. Run an analysis to generate your first report.</p>
          <Link href="/analyzer" className="mt-6 text-sm font-medium text-teal-500 hover:underline">
            Go to Analyzer &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filtered.map((briefing, index) => {
            const summary = briefing.summary;
            const route = `${briefing.request.origin} -> ${briefing.request.destination}`;
            const id = briefingId(briefing, index);
            const preview = briefing.llm_briefing
              ? briefing.llm_briefing.slice(0, 200).replace(/[#*_]/g, "") + "..."
              : "No Gemini briefing generated for this analysis.";

            return (
              <div
                key={`${briefing.timestamp}-${index}`}
                className="cursor-default rounded-2xl border border-navy-600 bg-navy-800 p-6 transition hover:border-teal-500"
              >
                <div className="flex items-start justify-between">
                  <h3 className="flex items-center gap-2 font-semibold text-brand-gray-1">
                    <Navigation2 size={16} className="text-brand-gray-3" />
                    {route}
                  </h3>
                  <div className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${riskColor(summary.risk_class)}`}>
                    {summary.risk_class}
                  </div>
                </div>

                <div className="mt-2 font-mono text-[11px] text-brand-gray-3">
                  {id} . {formatDate(briefing.timestamp)}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div>
                    <span className="mr-1 text-xs font-mono font-bold text-brand-gray-1">{summary.risk_score.toFixed(2)}</span>
                    <span className="text-[10px] font-mono text-brand-gray-2">SCORE</span>
                  </div>
                  <div className="h-3 w-px bg-navy-600" />
                  <div className="text-xs font-mono text-brand-gray-1">{summary.distance_km.toLocaleString()} km</div>
                  <div className="h-3 w-px bg-navy-600" />
                  <div className="text-xs font-mono text-brand-gray-1">{summary.estimated_days}d</div>
                  <div className="h-3 w-px bg-navy-600" />
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert size={12} className={summary.verified_threats > 0 ? "text-red-500" : "text-teal-500"} />
                    <span className="text-xs font-mono text-brand-gray-1">{summary.verified_threats} threats</span>
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-[1.7] text-brand-gray-2">{preview}</p>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedBriefing(briefing)}
                    className="rounded-xl border border-navy-600 px-5 py-2.5 text-xs font-medium text-brand-gray-1 transition hover:bg-navy-700"
                  >
                    View Briefing
                  </button>
                  <Link href="/analyzer" className="px-2 text-xs font-medium text-teal-500 hover:underline">
                    Re-analyze
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/90 p-6 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-navy-600 bg-navy-800 p-8 shadow-2xl">
            <div className="mb-6 flex items-start justify-between border-b border-navy-600 pb-4">
              <div>
                <h2 className="text-xl font-bold text-brand-gray-1">
                  {selectedBriefing.request.origin} &rarr; {selectedBriefing.request.destination}
                </h2>
                <div className="mt-2 font-mono text-xs text-brand-gray-3">Generated {formatDate(selectedBriefing.timestamp)}</div>
              </div>
              <button
                onClick={() => setSelectedBriefing(null)}
                className="-mr-2 -mt-2 rounded-lg p-2 text-brand-gray-2 transition hover:bg-navy-700 hover:text-brand-gray-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="prose prose-invert max-w-none text-sm leading-[1.8] text-brand-gray-2 prose-h3:mb-3 prose-h3:mt-6 prose-h3:font-semibold prose-h3:text-brand-gray-1 prose-li:mb-1.5 prose-p:mb-4 prose-strong:text-brand-gray-1 prose-ul:ml-5 prose-ul:list-disc">
              <Markdown>{selectedBriefing.llm_briefing || "No Gemini briefing was generated for this analysis."}</Markdown>
            </div>

            <div className="mt-8 border-t border-navy-600 pt-6">
              <div className="flex items-center gap-6">
                <div className="font-mono text-[11px]">
                  <span className="mr-2 text-brand-gray-3">FINAL SCORE</span>
                  <span className="text-brand-gray-1">{selectedBriefing.summary.risk_score.toFixed(2)}</span>
                </div>
                <div className="font-mono text-[11px]">
                  <span className="mr-2 text-brand-gray-3">THREATS VERIFIED</span>
                  <span className="text-brand-gray-1">{selectedBriefing.summary.verified_threats}</span>
                </div>
                <div className="font-mono text-[11px]">
                  <span className="mr-2 text-brand-gray-3">DISTANCE</span>
                  <span className="text-brand-gray-1">{selectedBriefing.summary.distance_km.toLocaleString()} km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
