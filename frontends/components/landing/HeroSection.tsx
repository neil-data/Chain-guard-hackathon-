"use client";

import React from "react";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import DynamicGlobe from "@/components/DynamicGlobe";
import { MagneticButton } from "./MagneticCard";

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="hero-section grid grid-cols-1 items-center gap-16 bg-navy-900 px-6 pb-16 pt-32 lg:px-24"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500 bg-transparent px-4 py-1.5">
          <div className="h-1.5 w-1.5 animate-[pulse-dot_2s_infinite] rounded-full bg-teal-500" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-teal-500">
            Live System Status: Optimal
          </span>
        </div>

        <h1 className="mt-6">
          <span className="block overflow-hidden text-[clamp(52px,8.5vw,88px)] font-black leading-[0.95] tracking-[-0.04em] text-brand-gray-1">
            {"Predictive risk.".split(" ").map((word, index) => (
              <span key={`primary-${index}`} className="hero-word mr-[0.2em]">
                {word}
              </span>
            ))}
          </span>
          <span className="block overflow-hidden text-[clamp(52px,8.5vw,88px)] font-black leading-[0.95] tracking-[-0.04em] text-teal-500">
            {"Resilient supply.".split(" ").map((word, index) => (
              <span key={`accent-${index}`} className="hero-word mr-[0.2em]">
                {word}
              </span>
            ))}
          </span>
        </h1>

        <p className="hero-sub mt-8 max-w-[480px] text-lg leading-[1.75] text-brand-gray-2">
          ChainGuard combines predictive intelligence, verified threat monitoring, and operational route scoring
          to help maritime teams reroute before disruptions harden into delays.
        </p>

        <div className="hero-cta mt-10 flex flex-wrap gap-4">
          <MagneticButton
            onClick={() => onNavigate("/analyzer")}
            className="flex items-center rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-400"
          >
            Start Monitoring <ArrowRight size={16} className="ml-2" />
          </MagneticButton>
          <button
            data-scroll-to="#how-it-works"
            className="rounded-xl border border-navy-600 bg-transparent px-6 py-3.5 text-sm text-brand-gray-1 transition-colors hover:border-teal-500 hover:bg-navy-800"
          >
            View Demo
          </button>
        </div>

        <div className="hero-proof mt-12">
          <div className="text-xs font-mono uppercase tracking-widest text-brand-gray-3">
            Trusted by maritime operators worldwide
          </div>
          <div className="mt-3 flex flex-wrap gap-5">
            {["No credit card required", "Real-time threat detection", "Sub-second rerouting"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-teal-500" />
                <span className="text-sm text-teal-500">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-card w-full">
        <div className="overflow-hidden rounded-2xl border border-navy-600 bg-navy-800 p-5 shadow-2xl shadow-black/40">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <Activity size={15} className="text-teal-500" />
              <span className="ml-2 text-sm font-medium text-brand-gray-1">Active Routes</span>
            </div>
            <div className="font-mono text-[11px] text-brand-gray-3">SYS.092</div>
          </div>

          {/* Wide full-width globe */}
          <div
            className="relative overflow-hidden rounded-xl border border-navy-600 bg-[var(--color-terminal-bg)] w-full"
            style={{ height: 420 }}
          >
            <DynamicGlobe height={420} showRoutes showThreats interactive />
            <div className="absolute bottom-3 left-3 rounded bg-[var(--color-terminal-bg)]/80 px-2 py-1">
              <span className="font-mono text-[10px] text-teal-500">BOM - SIN ROUTE</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between rounded-xl border border-navy-600 bg-navy-900 px-4 py-3">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <span className="ml-2.5 font-mono text-sm text-brand-gray-1">SHP-9021</span>
              </div>
              <div className="font-mono text-sm font-bold text-teal-500">12 <span className="text-[10px] font-normal opacity-70">Optimal</span></div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-navy-600 bg-navy-900 px-4 py-3">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="ml-2.5 font-mono text-sm text-brand-gray-1">SHP-9022</span>
              </div>
              <div className="font-mono text-sm font-bold text-red-500">88 <span className="text-[10px] font-normal opacity-70">Critical</span></div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-navy-600 bg-navy-900 px-4 py-3">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="ml-2.5 font-mono text-sm text-brand-gray-1">SHP-9023</span>
              </div>
              <div className="font-mono text-sm font-bold text-amber-500">34 <span className="text-[10px] font-normal opacity-70">Medium</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}