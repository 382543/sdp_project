from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

ROOT_DIR = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT_DIR / "outputs-20260429T182217Z-3-001" / "outputs"
FEATURE_STATS_PATH = OUTPUT_DIR / "feature_stats.json"
HISTORY_PATH = OUTPUT_DIR / "history.json"

app = FastAPI(title="CKD Risk API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RiskRequest(BaseModel):
    time_step: float = Field(ge=0)
    glucose: float = Field(ge=0)
    diabetes: str
    wbc: float = Field(ge=0)
    rbc: float = Field(ge=0)
    age: float = Field(ge=0)
    gender: str
    egfr: float = Field(ge=0)
    creatinine_rate: float = Field(ge=0)


class RiskResponse(BaseModel):
    riskLevel: str
    riskState: str
    score: int
    signals: list[str]
    source: str
    ckdStage: str
    ckdStageLabel: str
    ckdStageDescription: str


def get_ckd_stage(egfr: float) -> tuple[str, str, str]:
    """Return (stage_code, stage_label, stage_description) based on eGFR."""
    if egfr >= 90:
        return "G1", "Stage 1", "Normal or high kidney function (eGFR ≥ 90)"
    elif egfr >= 60:
        return "G2", "Stage 2", "Mildly decreased kidney function (eGFR 60–89)"
    elif egfr >= 45:
        return "G3a", "Stage 3a", "Mildly to moderately decreased (eGFR 45–59)"
    elif egfr >= 30:
        return "G3b", "Stage 3b", "Moderately to severely decreased (eGFR 30–44)"
    elif egfr >= 15:
        return "G4", "Stage 4", "Severely decreased kidney function (eGFR 15–29)"
    else:
        return "G5", "Stage 5", "Kidney failure / End-stage renal disease (eGFR < 15)"


def assess_ckd_risk(form: RiskRequest) -> dict[str, Any]:
    signals: list[str] = []
    score = 0

    if form.egfr < 15:
        score += 6
        signals.append("eGFR is critically low.")
    elif form.egfr < 30:
        score += 5
        signals.append("eGFR is in a severe range.")
    elif form.egfr < 45:
        score += 4
        signals.append("eGFR suggests reduced kidney function.")
    elif form.egfr < 60:
        score += 3
        signals.append("eGFR is below the healthy threshold.")

    if form.creatinine_rate >= 1.8:
        score += 4
        signals.append("Creatinine is markedly elevated.")
    elif form.creatinine_rate >= 1.4:
        score += 3
        signals.append("Creatinine is above the usual range.")
    elif form.creatinine_rate >= 1.2:
        score += 2
        signals.append("Creatinine is slightly elevated.")

    if form.glucose >= 200:
        score += 3
        signals.append("Glucose is very high.")
    elif form.glucose >= 140:
        score += 2
        signals.append("Glucose is above the target range.")

    if form.diabetes.lower() == "yes":
        score += 2
        signals.append("Diabetes increases CKD risk.")

    if form.age >= 75:
        score += 2
        signals.append("Age is in a higher risk group.")
    elif form.age >= 60:
        score += 1
        signals.append("Age contributes to baseline risk.")

    if form.wbc >= 11:
        score += 2
        signals.append("WBC suggests inflammation or infection.")
    elif form.wbc > 8.5:
        score += 1
        signals.append("WBC is mildly elevated.")

    if form.rbc < 4.0:
        score += 2
        signals.append("RBC is low.")
    elif form.rbc < 4.5:
        score += 1
        signals.append("RBC is slightly low.")

    if form.time_step >= 7:
        score += 1
        signals.append("Longer observation period indicates persistent tracking.")

    risk_level = "Low"
    if form.egfr < 30 or score >= 8:
        risk_level = "Critical"
    elif score >= 6:
        risk_level = "High"
    elif score >= 3:
        risk_level = "Moderate"

    ckd_stage, ckd_stage_label, ckd_stage_desc = get_ckd_stage(form.egfr)

    return {
        "riskLevel": risk_level,
        "riskState": "Not at risk" if risk_level == "Low" else "At risk",
        "score": min(score * 10, 100),
        "signals": signals,
        "source": "backend-api",
        "ckdStage": ckd_stage,
        "ckdStageLabel": ckd_stage_label,
        "ckdStageDescription": ckd_stage_desc,
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/predict", response_model=RiskResponse)
def predict_risk(form: RiskRequest) -> dict[str, Any]:
    return assess_ckd_risk(form)


@app.get("/api/feature-stats")
def feature_stats() -> dict[str, Any]:
    if FEATURE_STATS_PATH.exists():
        return json.loads(FEATURE_STATS_PATH.read_text(encoding="utf-8"))
    return {"detail": "feature stats not found"}


@app.get("/api/history")
def history() -> dict[str, Any]:
    if HISTORY_PATH.exists():
        return json.loads(HISTORY_PATH.read_text(encoding="utf-8"))
    return {"detail": "history not found"}

# --- Serve React Frontend ---
FRONTEND_DIST = ROOT_DIR / "frontend" / "dist"

assets_dir = FRONTEND_DIST / "assets"
if assets_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

@app.get("/{catchall:path}")
def serve_react_app(catchall: str):
    if catchall.startswith("api/"):
        return {"detail": "Not Found"}
        
    file_path = FRONTEND_DIST / catchall
    if file_path.is_file():
        return FileResponse(str(file_path))
        
    index_path = FRONTEND_DIST / "index.html"
    if index_path.is_file():
        return FileResponse(str(index_path))
        
    return {
        "detail": "Frontend not built or index.html missing.",
        "frontend_dist": str(FRONTEND_DIST),
        "frontend_exists": FRONTEND_DIST.exists(),
        "assets_exists": assets_dir.exists()
    }
