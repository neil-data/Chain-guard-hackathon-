"use client";

import React from "react";

const terminalChrome = (
  <div className="flex items-center gap-2 bg-[var(--color-terminal-bg)] px-5 py-3.5">
    <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
    <div className="h-3 w-3 rounded-full bg-[#f59e0b]" />
    <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
  </div>
);

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-navy-900 px-6 py-32 lg:px-24">
      <div className="text-center">
        <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-teal-500">Pipeline</div>
        <h2 className="text-[clamp(28px,4vw,48px)] font-bold text-brand-gray-1">How it works.</h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-brand-gray-2">
          From raw signal ingestion to a captain-ready recommendation in a single intelligence loop.
        </p>
      </div>

      <div className="mt-24">
        <div className="hiw-step grid grid-cols-1 items-center gap-16 border-b border-navy-600 py-24 lg:grid-cols-2">
          <div className="hiw-text">
            <div className="-mb-5 text-[clamp(80px,12vw,140px)] font-black leading-none tracking-[-0.05em] text-navy-600">
              01
            </div>
            <h3 className="relative z-10 text-3xl font-bold tracking-tight text-brand-gray-1">Continuous Ingestion</h3>
            <p className="relative z-10 mt-5 max-w-sm text-base leading-[1.8] text-brand-gray-2">
              ChainGuard continuously ingests weather telemetry, threat feeds, and route-state data so each
              analysis begins from a live operating picture instead of a stale snapshot.
            </p>
          </div>
          <div className="hiw-term overflow-hidden rounded-2xl border border-navy-600 bg-[var(--color-terminal-bg)]">
            {terminalChrome}
            <div className="space-y-2 p-6 font-mono text-sm">
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">CONNECTING TO ROUTE STREAM...</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">INGESTING WEATHER DATA (NOAA)...</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">SYNCING THREAT FEED WINDOWS...</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">WAITING FOR NEW EVENTS<span className="animate-[blink_1s_step-end_infinite]">_</span></span></div>
            </div>
          </div>
        </div>

        <div className="hiw-step grid grid-cols-1 items-center gap-16 border-b border-navy-600 py-24 lg:grid-cols-2">
          <div className="hiw-term order-last overflow-hidden rounded-2xl border border-navy-600 bg-[var(--color-terminal-bg)] lg:order-first">
            {terminalChrome}
            <div className="space-y-2 p-6 font-mono text-sm">
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">NLP CLASSIFIER: 4 threat signals detected</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">VERIFICATION ENGINE RUNNING...</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="ml-4 text-teal-500/70">trust_score [Reuters]: 1.00</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="ml-4 text-teal-500/70">temporal_decay [2h]: 0.77</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="ml-4 text-teal-500/70">geo_confidence [Hormuz]: 0.83</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">Psi(a) = 0.83 - THRESHOLD PASSED</span></div>
            </div>
          </div>
          <div className="hiw-text">
            <div className="-mb-5 text-[clamp(80px,12vw,140px)] font-black leading-none tracking-[-0.05em] text-navy-600">
              02
            </div>
            <h3 className="relative z-10 text-3xl font-bold tracking-tight text-brand-gray-1">News Verification Engine</h3>
            <p className="relative z-10 mt-5 max-w-sm text-base leading-[1.8] text-brand-gray-2">
              Every source is scored for trust, time decay, geolocation confidence, and corroboration before it
              can influence route scoring. Only verified events enter the model.
            </p>
          </div>
        </div>

        <div className="hiw-step grid grid-cols-1 items-center gap-16 border-b border-navy-600 py-24 lg:grid-cols-2">
          <div className="hiw-text">
            <div className="-mb-5 text-[clamp(80px,12vw,140px)] font-black leading-none tracking-[-0.05em] text-navy-600">
              03
            </div>
            <h3 className="relative z-10 text-3xl font-bold tracking-tight text-brand-gray-1">AI Route Optimization</h3>
            <p className="relative z-10 mt-5 max-w-sm text-base leading-[1.8] text-brand-gray-2">
              Risk scoring and K-shortest path generation work together to produce practical alternatives weighted
              across threat severity, weather risk, distance, and chokepoint exposure.
            </p>
          </div>
          <div className="hiw-term overflow-hidden rounded-2xl border border-navy-600 bg-[var(--color-terminal-bg)]">
            {terminalChrome}
            <div className="space-y-2 p-6 font-mono text-sm">
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">XGBOOST MODEL READY</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="ml-4 text-teal-500/70">R2 = 0.9691</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">GRAPH: 30 nodes, 286 directed edges</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">YEN&apos;S K-SHORTEST K=3...</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="ml-4 text-teal-500/70">Route #1 MUMBAI - ROTTERDAM: 31.94</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="ml-4 text-teal-500/70">Route #2 via NEW_YORK: 38.60</span></div>
            </div>
          </div>
        </div>

        <div className="hiw-step grid grid-cols-1 items-center gap-16 py-24 lg:grid-cols-2">
          <div className="hiw-term order-last overflow-hidden rounded-2xl border border-navy-600 bg-[var(--color-terminal-bg)] lg:order-first">
            {terminalChrome}
            <div className="space-y-2 p-6 font-mono text-sm">
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">GEMINI: gemini-1.5-flash</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">GENERATING CAPTAIN BRIEFING...</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="ml-4 text-teal-500/70">Risk Class: MEDIUM (31.94/100)</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="ml-4 text-teal-500/70">Weather: moderate Arabian Sea swell</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="ml-4 text-teal-500/70">Recommendation: proceed on Route #1</span></div>
              <div className="flex gap-3"><span className="text-brand-gray-3">&gt;</span><span className="text-teal-500">COMPLETE 1.8s</span></div>
            </div>
          </div>
          <div className="hiw-text">
            <div className="-mb-5 text-[clamp(80px,12vw,140px)] font-black leading-none tracking-[-0.05em] text-navy-600">
              04
            </div>
            <h3 className="relative z-10 text-3xl font-bold tracking-tight text-brand-gray-1">LLM Tactical Briefing</h3>
            <p className="relative z-10 mt-5 max-w-sm text-base leading-[1.8] text-brand-gray-2">
              Gemini 1.5 Flash turns model output into a concise captain-ready briefing covering route conditions,
              verified threats, weather posture, and tactical recommendation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
