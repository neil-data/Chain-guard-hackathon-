"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowUpDown, Zap } from "lucide-react";
import { analyzeRoute } from "@/lib/api";

export default function AnalyzerPage() {
  const router = useRouter();
  const terminalRef = useRef<HTMLDivElement>(null);

  const [running, setRunning] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("MUMBAI");
  const [destination, setDestination] = useState("ROTTERDAM");
  const [cargoType, setCargoType] = useState("CONTAINER");
  const [cargoValue, setCargoValue] = useState(0.5);

  useEffect(() => {
    if (!terminalRef.current) return;
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [terminalLines]);

  const pushLine = (line: string) => setTerminalLines((previous) => [...previous, line]);

  const pushLinesAnimated = (lines: string[], delayMs: number): Promise<void> =>
    new Promise((resolve) => {
      let index = 0;
      const interval = setInterval(() => {
        pushLine(lines[index]);
        index += 1;

        if (index >= lines.length) {
          clearInterval(interval);
          resolve();
        }
      }, delayMs);
    });

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleAnalyze = async (event: React.FormEvent) => {
    event.preventDefault();
    if (running) return;

    setRunning(true);
    setTerminalLines([]);
    setError(null);

    const bootLines = [
      "> CONNECTING TO CHAINGUARD VERCEL FUNCTION...",
      `> ROUTE: ${origin} -> ${destination}`,
      `> CARGO: ${cargoType} . VALUE_NORM: ${cargoValue.toFixed(2)}`,
      "> INITIALIZING CARGO RISK PIPELINE v4.0...",
      "> INGESTING ROUTE GRAPH + THREAT ZONES...",
      "> WEATHER RISK MODEL RUNNING...",
      "> THREAT VERIFICATION INDEX LOADED...",
      "  > live corridor confidence mapped...",
      "  > chokepoint exposure scored...",
      "  > cargo sensitivity weighting...",
      "> DECISION ENGINE READY",
      "> GRAPH ANALYSIS: YEN'S K-SHORTEST PATHS...",
    ];

    const animationPromise = pushLinesAnimated(bootLines, 350);

    const apiPromise = analyzeRoute({
      origin,
      destination,
      cargoType,
      cargoValue,
    });

    try {
      const [, result] = await Promise.all([animationPromise, apiPromise]);
      const summary = result.summary;

      const resultLines = [
        `  > Route #1 ${result.best_route_path.join(" -> ")}: ${summary.risk_score.toFixed(2)} .`,
        `  > Distance: ${summary.distance_km} km`,
        `  > ETA: ${summary.estimated_days} days`,
        `  > Threat Severity: ${summary.threat_severity}/10`,
        `  > Weather Risk Max: ${(summary.weather_risk_max * 100).toFixed(1)}%`,
        `  > Chokepoints: ${summary.n_chokepoints}`,
        `  > War: ${summary.war_flag ? "YES" : "CLEAR"}  Piracy: ${summary.piracy_flag ? "YES" : "CLEAR"}  Sanctions: ${summary.sanctions_flag ? "YES" : "CLEAR"}`,
        "> LLM: llama-3.3-70b-versatile",
        "> GENERATING CAPTAIN BRIEFING...",
        `> RISK CLASS: ${summary.risk_class} (${summary.risk_score.toFixed(2)}/100)`,
        "> COMPLETE .",
      ];

      await pushLinesAnimated(resultLines, 200);

      localStorage.setItem("lastAnalysis", JSON.stringify(result));
      localStorage.setItem(
        "lastRequest",
        JSON.stringify({ origin, destination, cargoType, cargoValue }),
      );

      try {
        const raw = localStorage.getItem("analysisHistory");
        const history = raw ? JSON.parse(raw) : [];
        history.unshift({
          ...result,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem("analysisHistory", JSON.stringify(history.slice(0, 20)));
      } catch {
        // Ignore storage errors.
      }

      setRunning(false);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (caughtError) {
      await animationPromise;
      const message = caughtError instanceof Error ? caughtError.message : "Unknown pipeline error";
      pushLine(`> ERROR: ${message}`);
      pushLine("> PIPELINE FAILED X");
      setRunning(false);
      setError(message);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[400px_1fr]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-gray-1">Configure Analysis</h2>

        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-600 bg-red-600 px-4 py-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <div className="text-sm font-medium text-red-500">Pipeline Error</div>
              <div className="mt-1 break-all font-mono text-xs text-red-500/80">{error}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleAnalyze} className="mt-8 space-y-5">
          <div className="form-item">
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-brand-gray-2">Origin</label>
            <select
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              className="w-full appearance-none rounded-xl border border-navy-600 bg-[var(--color-terminal-bg)] px-4 py-3 text-sm text-brand-gray-1 focus:border-teal-500 focus:outline-none"
            >
              <option value="MUMBAI">Mumbai (INBOM)</option>
              <option value="SINGAPORE">Singapore (SGSIN)</option>
              <option value="DUBAI_JEBEL_ALI">Dubai (Jebel Ali)</option>
              <option value="SHANGHAI">Shanghai (CNSHA)</option>
              <option value="BUSAN">Busan (KRPUS)</option>
              <option value="SANTOS">Santos (BRSSZ)</option>
              <option value="COLOMBO">Colombo (LKCMB)</option>
            </select>
          </div>

          <div className="relative z-10 -my-2 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-600 bg-navy-700 text-teal-500 transition hover:border-teal-500"
            >
              <ArrowUpDown size={16} />
            </button>
          </div>

          <div className="form-item">
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-brand-gray-2">Destination</label>
            <select
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className="w-full appearance-none rounded-xl border border-navy-600 bg-[var(--color-terminal-bg)] px-4 py-3 text-sm text-brand-gray-1 focus:border-teal-500 focus:outline-none"
            >
              <option value="ROTTERDAM">Rotterdam (NLRTM)</option>
              <option value="HAMBURG">Hamburg (DEHAM)</option>
              <option value="ANTWERP">Antwerp (BEANR)</option>
              <option value="LOS_ANGELES">Los Angeles (USLAX)</option>
              <option value="NEW_YORK">New York (USNYC)</option>
              <option value="HONG_KONG">Hong Kong (HKHKG)</option>
              <option value="SAVANNAH">Savannah (USSAV)</option>
              <option value="PIRAEUS">Piraeus (GRPIR)</option>
            </select>
          </div>

          <div className="form-item">
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-brand-gray-2">Cargo Type</label>
            <select
              value={cargoType}
              onChange={(event) => setCargoType(event.target.value)}
              className="w-full appearance-none rounded-xl border border-navy-600 bg-[var(--color-terminal-bg)] px-4 py-3 text-sm text-brand-gray-1 focus:border-teal-500 focus:outline-none"
            >
              <option value="CONTAINER">Containerized Goods</option>
              <option value="LIQUID">Liquid Bulk (Crude)</option>
              <option value="DRY">Dry Bulk</option>
            </select>
          </div>

          <div className="form-item">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-brand-gray-2">Cargo Value</label>
              <span className="font-mono text-sm text-teal-500">{cargoValue.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={cargoValue}
              onChange={(event) => setCargoValue(Number.parseFloat(event.target.value))}
              className="w-full accent-teal-500"
            />
          </div>

          <button
            disabled={running}
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-4 font-semibold text-white transition-colors hover:bg-teal-400 disabled:opacity-50"
          >
            <Zap size={16} />
            {running ? "Analyzing..." : "Analyze Route"}
          </button>
        </form>
      </div>

      <div>
        <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-navy-600 bg-[var(--color-terminal-bg)]">
          <div className="flex shrink-0 items-center gap-2 bg-navy-900 px-5 py-3.5">
            <div className="mr-2 flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
              <div className="h-3 w-3 rounded-full bg-[#f59e0b]" />
              <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
            </div>
            <span className="font-mono text-[11px] text-brand-gray-3">CHAINGUARD PIPELINE v4.0</span>
            {running && <span className="ml-auto animate-pulse font-mono text-[10px] text-teal-500">LIVE</span>}
          </div>

          <div ref={terminalRef} className="flex-1 space-y-2 overflow-auto p-6 font-mono text-sm">
            {!running && terminalLines.length === 0 && (
              <div className="select-none italic text-brand-gray-3">Waiting for input...</div>
            )}
            {terminalLines.map((line, index) => {
              if (!line) return null;
              const isIndented = line.startsWith("  >");
              const isError = line.includes("ERROR") || line.includes("FAILED");

              return (
                <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                  {isIndented ? (
                    <span className={`ml-6 ${isError ? "text-red-500" : "text-teal-500/70"}`}>
                      {line.replace("  > ", "")}
                    </span>
                  ) : (
                    <>
                      <span className="text-brand-gray-3">&gt;</span>
                      <span className={isError ? "text-red-500" : "text-teal-500"}>{line.replace("> ", "")}</span>
                    </>
                  )}
                </div>
              );
            })}
            {running && (
              <div className="mt-2 flex gap-3">
                <span className="text-brand-gray-3">&gt;</span>
                <span className="animate-[blink_1s_step-end_infinite] text-teal-500">_</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
