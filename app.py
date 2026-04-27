import os
import traceback
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from groq import Groq

# Import the main pipeline from the existing script
from Cargo_risk_v4 import CargoRiskPipelineV4

app = FastAPI(
    title="ChainGuard Cargo Risk API",
    description="Backend API for Maritime Supply Chain Risk Intelligence connected to an LLM",
    version="1.0.0"
)

# CORS — allow the Next.js frontend to reach the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
        "https://chain-guard-hackathon-x8ya.vercel.app",  # add this
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the pipeline globally so that it doesn't retrain on every request.
print("Initializing Cargo Risk Pipeline...")
pipeline = CargoRiskPipelineV4(k_paths=3, use_live_news=True)
pipeline.initialise()
print("Pipeline Initialized!")

class RouteRequest(BaseModel):
    origin: str
    destination: str
    cargo_type: Optional[str] = "general"
    cargo_value_norm: Optional[float] = 0.5
    groq_api_key: Optional[str] = None  # Pass Groq API key via Postman

@app.post("/api/analyze-route")
def analyze_route(req: RouteRequest):
    """
    POST Endpoint for Postman Testing.
    Body Example:
    {
        "origin": "MUMBAI",
        "destination": "ROTTERDAM",
        "groq_api_key": "YOUR_GROQ_API_KEY_HERE"
    }
    """
    # 1. Run the Cargo Risk Pipeline
    try:
        routes, gmaps_payload = pipeline.analyse(
            req.origin,
            req.destination,
            cargo_value_norm=req.cargo_value_norm,
            cargo_type=req.cargo_type
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=traceback.format_exc())

    best_route = routes[0] if routes else None
    if not best_route:
        raise HTTPException(status_code=404, detail="No route found between these ports.")

    # 2. LLM Connection (Groq)
    llm_briefing = "LLM not configured. Please provide a `groq_api_key` in the request body to generate a briefing."

    api_key = req.groq_api_key or os.environ.get("GROQ_API_KEY")
    if api_key:
        try:
            warnings_str = ', '.join(best_route.warnings) if best_route.warnings else 'None'

            prompt = f"""
You are the Chief Intelligence Officer for a maritime shipping company.
Analyze the following optimal cargo route and provide a concise, professional, bulleted briefing for the ship's captain. Focus on potential risks, the security landscape, and practical recommendations.

Route Overview:
- Origin: {req.origin}
- Destination: {req.destination}
- Path: {' -> '.join(best_route.path)}
- Distance: {best_route.distance_km} km
- Estimated Time: {best_route.estimated_days} days

Risk Factors:
- Overall Risk Class: {best_route.risk_class} (Score: {best_route.xgb_risk_score}/100)
- Number of Chokepoints: {best_route.n_chokepoints}
- Threat Severity: {best_route.threat_severity}
- Weather Risk: {best_route.weather_risk_max}
- War Flag: {best_route.war_flag}
- Piracy Flag: {best_route.piracy_flag}
- Sanctions Flag: {best_route.sanctions_flag}
- Pipeline Warnings: {warnings_str}
- Verified Live Threats Near Route: {best_route.verified_threats}
            """

            client = Groq(api_key=api_key)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1000,
            )
            llm_briefing = response.choices[0].message.content

        except Exception as e:
            llm_briefing = f"LLM Error during generation: {str(e)}"

    # 3. Return Combined JSON Response
    return {
        "status": "success",
        "request": {
            "origin": req.origin,
            "destination": req.destination
        },
        "summary": {
            "risk_class": best_route.risk_class,
            "risk_score": best_route.xgb_risk_score,
            "distance_km": best_route.distance_km,
            "estimated_days": best_route.estimated_days,
            "threat_severity": best_route.threat_severity,
            "weather_risk_max": best_route.weather_risk_max,
            "n_chokepoints": best_route.n_chokepoints,
            "war_flag": best_route.war_flag,
            "piracy_flag": best_route.piracy_flag,
            "sanctions_flag": best_route.sanctions_flag,
            "verified_threats": best_route.verified_threats,
            "warnings": best_route.warnings,
        },
        "llm_briefing": llm_briefing,
        "best_route_path": best_route.path,
        "gmaps_payload": gmaps_payload
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)