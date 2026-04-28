"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Anchor,
  Bot,
  CheckCircle2,
  Cloud,
  Clock,
  Cpu,
  MessageSquare,
  Navigation2,
  RefreshCw,
  Rss,
  Server,
  Shield,
} from "lucide-react";
import Markdown from "react-markdown";
import DynamicGlobe from "@/components/DynamicGlobe";
import { gsap } from "@/lib/gsap";
import { getLastAnalysis } from "@/hooks/useRouteAnalysis";
import { AnalysisResponse } from "@/lib/api";

function mapResponseToView(response: AnalysisResponse) {
  const summary = response.summary;

  return {
    score: summary.risk_score,
    riskClass: summary.risk_class,
    distance: summary.distance_km,
    durationEta: summary.estimated_days,
    threatSeverity: summary.threat_severity,
    verifiedThreats: summary.verified_threats,
    recommendedRoute: {
      path: response.best_route_path.join(" -> "),
      distance: summary.distance_km,
      durationEta: summary.estimated_days,
      score: summary.risk_score,
      flags: [
        ...(summary.war_flag === 0 ? ["No War Zone"] : []),
        ...(summary.piracy_flag === 0 ? ["No Piracy"] : []),
        ...(summary.sanctions_flag === 0 ? ["No Sanctions"] : []),
      ],
    },
    riskBreakdown: {
      threatSeverity: (summary.threat_severity / 10) * 100,
      weather: summary.weather_risk_max * 100,
      distance: Math.min((summary.distance_km / 20000) * 100, 100),
      chokepoints: (summary.n_chokepoints / 5) * 100,
      warZone: summary.war_flag * 100,
      sanctions: summary.sanctions_flag * 100,
    },
    systemStatus: {
      newsCrawler: "ACTIVE",
      xgBoost: "SIMULATED",
      gemini: response.llm_briefing ? "CONNECTED" : "FALLBACK",
      api: "ONLINE",
      weatherApi: "MODELLED",
    },
    weatherRiskMax: summary.weather_risk_max,
    briefingMarkdown:
      response.llm_briefing ||
      "### Route Overview\nGemini briefing unavailable for the current analysis.\n\n### Recommendation\nRe-run the analysis once the server-side Gemini key is configured.",
    warnings: summary.warnings,
    origin: response.request.origin,
    destination: response.request.destination,
    rawPath: response.best_route_path,
  };
}

function riskBadgeClass(riskClass: string) {
  if (riskClass === "LOW" || riskClass === "OPTIMAL") {
    return "bg-teal-600 text-teal-500";
  }

  if (riskClass === "MEDIUM") {
    return "bg-amber-600 text-amber-500";
  }

  return "bg-red-600 text-red-500";
}

function riskTextClass(riskClass: string) {
  if (riskClass === "LOW" || riskClass === "OPTIMAL") return "text-teal-500";
  if (riskClass === "MEDIUM") return "text-amber-500";
  return "text-red-500";
}

export default function DashboardPage() {
  const [analysisData] = useState<ReturnType<typeof mapResponseToView> | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = getLastAnalysis();
    return saved ? mapResponseToView(saved) : null;
  });
  const isEmpty = !analysisData;

  useEffect(() => {
    if (!analysisData) return;

    const ctx = gsap.context(() => {
      gsap.from(".kpi-card", {
        y: 16,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });

      gsap.to(".kpi-bar-fill", {
        width: (index: number, element: Element) => `${element.getAttribute("data-w")}%`,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5,
      });

      gsap.to(".chart-bar-fill", {
        width: (index: number, element: Element) => `${element.getAttribute("data-w")}%`,
        duration: 1,
        ease: "power3.out",
        delay: 0.8,
      });
    });

    return () => ctx.revert();
  }, [analysisData]);

  if (isEmpty) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
        <Navigation2 size={48} className="mb-6 text-brand-gray-3" />
        <h2 className="text-2xl font-bold text-brand-gray-1">No Analysis Yet</h2>
        <p className="mt-3 max-w-md text-brand-gray-2">
          Run your first route analysis to populate the dashboard with a live route score, threats, and an AI
          captain&apos;s briefing.
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

  if (!analysisData) return null;

  const data = analysisData;

  return (
    <div className="mx-auto max-w-7xl space-y-4 pb-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "RISK SCORE",
            icon: Shield,
            value: data.score.toFixed(2),
            subLabel: data.riskClass,
            subBadge: true,
            progress: Math.min(data.score, 100),
            iconClass: "text-teal-500",
            barClass: data.riskClass === "MEDIUM" ? "bg-amber-500" : data.riskClass === "CRITICAL" || data.riskClass === "HIGH" ? "bg-red-500" : "bg-teal-500",
          },
          {
            label: "DISTANCE",
            icon: Anchor,
            value: data.distance.toLocaleString(),
            subLabel: "km . Direct path",
            progress: Math.min((data.distance / 20000) * 100, 100),
            iconClass: "text-teal-500",
            barClass: "bg-teal-500",
          },
          {
            label: "ETA",
            icon: Clock,
            value: data.durationEta.toFixed(1),
            subLabel: "days",
            progress: Math.min((data.durationEta / 50) * 100, 100),
            iconClass: "text-teal-500",
            barClass: "bg-teal-500",
          },
          {
            label: "THREATS",
            icon: AlertTriangle,
            value: String(data.verifiedThreats),
            subLabel: `verified . sev ${data.threatSeverity}/10`,
            progress: (data.threatSeverity / 10) * 100,
            iconClass: data.verifiedThreats > 0 ? "text-red-500" : "text-teal-500",
            barClass: data.verifiedThreats > 0 ? "bg-red-500" : "bg-teal-500",
          },
        ].map((card) => (
          <div key={card.label} className="kpi-card rounded-2xl border border-navy-600 bg-navy-800 p-5">
            <div className="flex items-start justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-gray-2">{card.label}</span>
              <card.icon size={16} className={card.iconClass} />
            </div>
            <div className="mt-4 text-4xl font-black leading-none tracking-[-0.03em] text-brand-gray-1">{card.value}</div>
            <div
              className={`mt-2 text-xs ${
                card.subBadge
                  ? `${riskBadgeClass(data.riskClass)} inline-block rounded px-1.5 py-0.5 font-mono`
                  : "font-mono text-brand-gray-2"
              }`}
            >
              {card.subBadge ? `[${card.subLabel}]` : card.subLabel}
            </div>
            <div className="mt-4 h-0.5 w-full overflow-hidden rounded bg-navy-600">
              <div className={`kpi-bar-fill h-full w-0 rounded ${card.barClass}`} data-w={card.progress} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="flex flex-col overflow-hidden rounded-2xl border border-navy-600 bg-navy-800 lg:col-span-3">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm font-medium text-brand-gray-1">Route Map</span>
            <div className="flex gap-1 rounded-lg bg-navy-700 p-1">
              {["Routes", "Threats", "All"].map((label, index) => (
                <button
                  key={label}
                  className={`rounded-md px-3 py-1 text-xs transition ${
                    index === 2 ? "bg-teal-500 text-white" : "bg-navy-700 text-brand-gray-2 hover:text-brand-gray-1"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[380px] flex-1 bg-navy-900">
            <DynamicGlobe
              height={380}
              showRoutes
              showThreats
              interactive
              autoRotate={false}
              customRoutes={data.rawPath ? [data.rawPath] : undefined}
            />
          </div>

          <div className="flex flex-wrap gap-6 border-t border-navy-600 px-5 py-3">
            {[
              { color: "bg-teal-500", text: "Best Route" },
              { color: "bg-amber-500", text: "Alt Routes" },
              { color: "bg-red-500", text: "Threats" },
            ].map((legend) => (
              <div key={legend.text} className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${legend.color}`} />
                <span className="text-xs font-mono text-brand-gray-2">{legend.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex h-full flex-col rounded-2xl border border-navy-600 bg-navy-800 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-brand-gray-1">Route Analysis</span>
            <span className="rounded-full bg-navy-700 px-2 py-0.5 font-mono text-[10px] text-brand-gray-2">
              {data.origin} - {data.destination}
            </span>
          </div>

          <div className="mb-3 rounded-xl border border-teal-500 bg-navy-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-teal-500">#1</span>
                <span className="rounded-full bg-teal-600 px-2 py-0.5 font-mono text-[10px] text-teal-500">
                  RECOMMENDED
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-brand-gray-1">{data.recommendedRoute.score.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-sm font-medium text-brand-gray-1">{data.recommendedRoute.path}</div>
            <div className="mt-2 flex gap-3">
              <span className="text-xs font-mono text-brand-gray-2">{data.recommendedRoute.distance.toLocaleString()} km</span>
              <span className="text-xs font-mono text-brand-gray-2">{data.recommendedRoute.durationEta} days</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.recommendedRoute.flags.map((flag) => (
                <div key={flag} className="flex items-center gap-1 rounded-full border border-teal-500 px-2 py-1">
                  <CheckCircle2 size={11} className="text-teal-500" />
                  <span className="text-[10px] font-mono text-teal-500">{flag}</span>
                </div>
              ))}
            </div>
          </div>

          {data.warnings && data.warnings.length > 0 && (
            <div className="mb-3 rounded-xl border border-amber-600 bg-[#1A2810] p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" />
                <span className="text-xs font-mono text-amber-500">WARNINGS</span>
              </div>
              {data.warnings.map((warning, index) => (
                <div key={index} className="mt-1 text-xs font-mono text-amber-500">
                  {warning}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-navy-600 bg-navy-800 p-5 lg:col-span-2">
          <div className="text-sm font-medium text-brand-gray-1">Risk Breakdown</div>
          <div className="mt-5 space-y-4">
            {[
              { label: "THREAT SEV", value: `${data.threatSeverity}/10`, width: data.riskBreakdown.threatSeverity, barClass: "bg-teal-500" },
              { label: "WEATHER", value: `${data.riskBreakdown.weather.toFixed(1)}%`, width: data.riskBreakdown.weather, barClass: "bg-amber-500" },
              { label: "DISTANCE", value: `${data.riskBreakdown.distance.toFixed(1)}%`, width: data.riskBreakdown.distance, barClass: "bg-red-500" },
              {
                label: "CHOKEPOINTS",
                value: String(data.riskBreakdown.chokepoints > 0 ? Math.round(data.riskBreakdown.chokepoints / 20) : 0),
                width: data.riskBreakdown.chokepoints,
                barClass: "bg-teal-500",
              },
              { label: "WAR ZONE", value: data.riskBreakdown.warZone > 0 ? "YES" : "CLEAR", width: data.riskBreakdown.warZone, barClass: "bg-red-500" },
              { label: "SANCTIONS", value: data.riskBreakdown.sanctions > 0 ? "YES" : "CLEAR", width: data.riskBreakdown.sanctions, barClass: "bg-amber-500" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <div className="w-28 shrink-0 text-xs font-mono text-brand-gray-2">{row.label}</div>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-navy-600">
                  <div className={`chart-bar-fill h-full w-0 rounded-full ${row.barClass}`} data-w={row.width} />
                </div>
                <div className="w-14 text-right text-xs font-mono text-brand-gray-1">{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-navy-600 bg-navy-800 p-5">
          <div className="mb-4 text-sm font-medium text-brand-gray-1">System Status</div>
          {[
            { icon: Rss, label: "News Crawler", value: data.systemStatus.newsCrawler, valueClass: "text-teal-500" },
            { icon: Cpu, label: "XGBoost", value: data.systemStatus.xgBoost, valueClass: "text-teal-500" },
            { icon: MessageSquare, label: "Groq LLM", value: data.systemStatus.gemini, valueClass: data.systemStatus.gemini === "CONNECTED" ? "text-teal-500" : "text-brand-gray-2" },
            { icon: Server, label: "Vercel API", value: data.systemStatus.api, valueClass: "text-teal-500" },
            { icon: Cloud, label: "Weather API", value: data.systemStatus.weatherApi, valueClass: "text-amber-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between border-b border-navy-600 py-3 last:border-0">
              <div className="flex items-center gap-2.5">
                <item.icon size={14} className="text-brand-gray-3" />
                <span className="text-sm text-brand-gray-2">{item.label}</span>
              </div>
              <span className={`font-mono text-[11px] ${item.valueClass}`}>{item.value}</span>
            </div>
          ))}

          <div className="mt-6">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-brand-gray-2">Weather Risk</div>
            <div className="rounded-xl bg-[var(--color-terminal-bg)] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-gray-1">Max Weather Risk</span>
                <span className="rounded px-1.5 py-0.5 text-[10px] font-mono bg-red-600 text-red-500">
                  {(data.weatherRiskMax * 100).toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded bg-navy-600">
                <div className="h-full rounded bg-red-500" style={{ width: `${data.weatherRiskMax * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-navy-600 bg-navy-800 p-6">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl bg-teal-500" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bot size={16} className="text-teal-500" />
            <span className="text-sm font-medium text-brand-gray-1">AI Captain&apos;s Briefing</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-teal-500 bg-navy-800 px-3 py-1 text-[10px] font-mono text-teal-500">
              Groq . Llama 3.3 70B
            </div>
            <RefreshCw size={14} className="cursor-pointer text-brand-gray-2 transition hover:text-brand-gray-1" />
          </div>
        </div>
        <div className="prose prose-invert mt-5 max-w-none text-sm leading-[1.75] text-brand-gray-2 prose-h3:mb-2 prose-h3:mt-4 prose-h3:text-base prose-h3:font-semibold prose-h3:text-brand-gray-1 prose-li:text-brand-gray-2 prose-p:mb-3 prose-strong:font-semibold prose-strong:text-brand-gray-1 prose-ul:ml-4 prose-ul:list-disc prose-ul:space-y-1.5">
          <Markdown>{data.briefingMarkdown}</Markdown>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-navy-600 pt-5">
          <span className="font-mono text-[11px] text-brand-gray-3">Generated via ChainGuard Pipeline v4.0 . Live API Response</span>
        </div>
      </div>
    </div>
  );
}
