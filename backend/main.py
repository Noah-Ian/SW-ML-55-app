"""
Soilsense AI - FastAPI inference backend.

Loads the trained Gradient Boosting ONNX model + RobustScaler and exposes
a /predict endpoint. This is an optional companion to the frontend, which
also runs the model in-browser via onnxruntime-web. Use this backend when
you want centralized logging, multi-user setups, or future DB persistence.

Run locally:
    uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import math
from typing import List, Literal

import joblib
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

CROP_TYPES = ["Lettuce", "Maize", "Tomatoes", "Wheat"]
FEATURE_NAMES = [
    "Soil_pH",
    "Temperature(C)",
    "Humidity(%)",
    "Fertilizer_Recommended(kg/ha)",
    "Irrigation_Recommended(mm)",
    "Month_sin",
    "Month_cos",
    "Moisture_Lag1",
    "Moisture_Lag2",
    "Moisture_RollingMean3",
    "Crop_Type_Lettuce",
    "Crop_Type_Maize",
    "Crop_Type_Tomatoes",
    "Crop_Type_Wheat",
]

app = FastAPI(title="Soilsense AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts at startup
session = ort.InferenceSession("model.onnx", providers=["CPUExecutionProvider"])
scaler = joblib.load("scaler.joblib")
INPUT_NAME = session.get_inputs()[0].name


class PredictRequest(BaseModel):
    soil_ph: float = Field(..., ge=3, le=9)
    temperature: float = Field(..., ge=-10, le=60)
    humidity: float = Field(..., ge=0, le=100)
    fertilizer: float = Field(..., ge=0, le=500)
    irrigation: float = Field(..., ge=0, le=200)
    crop_type: Literal["Lettuce", "Maize", "Tomatoes", "Wheat"]
    month: int = Field(..., ge=1, le=12)
    moisture_lag1: float = Field(45.0, ge=0, le=100)
    moisture_lag2: float = Field(45.0, ge=0, le=100)
    moisture_rolling_mean3: float = Field(45.0, ge=0, le=100)


class PredictResponse(BaseModel):
    soil_moisture: float
    risk_level: str
    irrigation_advice: str


def risk_level(m: float) -> str:
    if m < 20: return "Critical"
    if m < 35: return "High"
    if m < 55: return "Medium"
    if m < 75: return "Low"
    return "Optimal"


def irrigation_advice(m: float) -> str:
    if m < 15: return "Irrigate immediately"
    if m < 25: return "Irrigate within 1 hour"
    if m < 35: return "Irrigate within 2 hours"
    if m < 45: return "Irrigate within 4 hours"
    if m < 55: return "Schedule irrigation today"
    if m < 70: return "Monitor — no irrigation needed"
    return "Soil is well-hydrated"


@app.get("/health")
def health():
    return {"status": "ok", "model_inputs": session.get_inputs()[0].shape}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if req.crop_type not in CROP_TYPES:
        raise HTTPException(400, f"Unknown crop {req.crop_type}")

    month_rad = 2 * math.pi * req.month / 12
    one_hot = [1.0 if c == req.crop_type else 0.0 for c in CROP_TYPES]

    raw = np.array([[
        req.soil_ph,
        req.temperature,
        req.humidity,
        req.fertilizer,
        req.irrigation,
        math.sin(month_rad),
        math.cos(month_rad),
        req.moisture_lag1,
        req.moisture_lag2,
        req.moisture_rolling_mean3,
        *one_hot,
    ]], dtype=np.float64)

    scaled = scaler.transform(raw).astype(np.float32)
    out = session.run(None, {INPUT_NAME: scaled})[0]
    moisture = float(np.clip(out[0][0], 0, 100))

    return PredictResponse(
        soil_moisture=round(moisture, 2),
        risk_level=risk_level(moisture),
        irrigation_advice=irrigation_advice(moisture),
    )
