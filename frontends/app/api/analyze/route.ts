import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const RISK_ENGINE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const GROQ_MODEL = "llama-3.3-70b-versatile";

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

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "Groq API key not configured on server" },
        { status: 500 },
      );
    }

    const riskResponse = await fetch(`${RISK_ENGINE_URL}/api/analyze-route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin,
        destination,
        cargo_type: cargoType,
        cargo_value_norm: cargoValue,
      }),
      cache: "no-store",
    });

    if (!riskResponse.ok) {
      let detail = "Risk engine request failed.";
      try {
        const error = await riskResponse.json();
        detail = error.detail || error.error || detail;
      } catch {
        // Ignore non-JSON errors.
      }
      return NextResponse.json({ error: detail }, { status: riskResponse.status });
    }

    const analysis = await riskResponse.json();

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
      llm_briefing: briefingResponse.choices[0]?.message?.content || "Groq briefing unavailable.",
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}