import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { analyzeRouteNetwork } from "@/lib/route-engine";

const GROQ_MODEL = "llama-3.3-70b-versatile";
export const runtime = "nodejs";

function buildBriefingPrompt({
  origin,
  destination,
  bestRoutePath,
  summary,
}: {
  origin: string;
  destination: string;
  bestRoutePath: string[];
  summary: {
    risk_score: number;
    risk_class: string;
    threat_severity: number;
    weather_risk_max: number;
    warnings?: string[];
  };
}) {
  return [
    "You are a maritime risk analyst AI. Generate a confidential captain's briefing.",
    `Route: ${origin} -> ${destination}`,
    `Recommended Route: ${bestRoutePath.join(" -> ")}`,
    `Risk Score: ${summary.risk_score}/100`,
    `Risk Class: ${summary.risk_class}`,
    `Threat Severity: ${summary.threat_severity}/10`,
    `Weather Risk: ${(summary.weather_risk_max * 100).toFixed(1)}%`,
    `Warnings: ${(summary.warnings || []).join("; ") || "None"}`,
    "",
    "Provide these sections:",
    "1. Route Overview",
    "2. Threat Summary",
    "3. Weather Assessment",
    "4. Recommendation",
    "",
    "Keep it concise, professional, and actionable.",
  ].join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const { origin, destination, cargoType, cargoValue } = await request.json();

    if (!origin || !destination) {
      return NextResponse.json({ error: "Origin and destination are required." }, { status: 400 });
    }

    const analysis = analyzeRouteNetwork({
      origin,
      destination,
      cargoType,
      cargoValue,
    });

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(analysis);
    }

    try {
      const groq = new Groq({ apiKey: groqApiKey });
      const prompt = buildBriefingPrompt({
        origin,
        destination,
        bestRoutePath: analysis.best_route_path || [],
        summary: analysis.summary,
      });

      const briefingResponse = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      });

      return NextResponse.json({
        ...analysis,
        request: { origin, destination },
        llm_briefing: briefingResponse.choices[0]?.message?.content || analysis.llm_briefing,
      });
    } catch {
      return NextResponse.json(analysis);
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
