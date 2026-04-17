// Browser-side ONNX inference using onnxruntime-web.
// Loads /model/model.onnx, applies RobustScaler, runs gradient boosting model.

import * as ort from "onnxruntime-web";
import { CROP_TYPES, robustScale, type CropType } from "./scaler";
import type { PredictionRecord } from "./storage";

let sessionPromise: Promise<ort.InferenceSession> | null = null;

export function getSession(): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    // Use CDN-hosted WASM to avoid bundling issues
    ort.env.wasm.wasmPaths =
      "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/";
    sessionPromise = ort.InferenceSession.create("/model/model.onnx", {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    });
  }
  return sessionPromise;
}

export interface PredictInputs {
  soil_ph: number;
  temperature: number;
  humidity: number;
  fertilizer: number;
  irrigation: number;
  cropType: CropType;
  month: number; // 1..12
}

function cropOneHot(crop: CropType): number[] {
  return CROP_TYPES.map((c) => (c === crop ? 1 : 0));
}

function getLagsFromHistory(
  history: PredictionRecord[],
  crop: CropType,
): { lag1: number; lag2: number; rollingMean3: number } {
  // Use last predictions for the same crop, falling back to overall, then 45 (~training median).
  const cropHist = history.filter((h) => h.cropType === crop);
  const pool = cropHist.length >= 1 ? cropHist : history;
  const sorted = [...pool].sort((a, b) => b.timestamp - a.timestamp);
  const last = sorted.map((h) => h.prediction);
  const lag1 = last[0] ?? 45;
  const lag2 = last[1] ?? lag1;
  const recent = last.slice(0, 3);
  const rollingMean3 =
    recent.length > 0
      ? recent.reduce((a, b) => a + b, 0) / recent.length
      : 45;
  return { lag1, lag2, rollingMean3 };
}

export interface PredictResult {
  prediction: number;
  latency: number;
}

export async function predictMoisture(
  inputs: PredictInputs,
  history: PredictionRecord[],
): Promise<PredictResult> {
  const session = await getSession();
  const { lag1, lag2, rollingMean3 } = getLagsFromHistory(history, inputs.cropType);

  // Cyclical month encoding (matches training: sin/cos with 12-month period)
  const monthRad = (2 * Math.PI * inputs.month) / 12;
  const monthSin = Math.sin(monthRad);
  const monthCos = Math.cos(monthRad);

  const oneHot = cropOneHot(inputs.cropType);

  // ORDER MUST MATCH FEATURE_NAMES in scaler.ts
  const raw = [
    inputs.soil_ph,
    inputs.temperature,
    inputs.humidity,
    inputs.fertilizer,
    inputs.irrigation,
    monthSin,
    monthCos,
    lag1,
    lag2,
    rollingMean3,
    oneHot[0], // Lettuce
    oneHot[1], // Maize
    oneHot[2], // Tomatoes
    oneHot[3], // Wheat
  ];

  const scaled = robustScale(raw);
  const tensor = new ort.Tensor("float32", scaled, [1, raw.length]);

  const start = performance.now();
  const inputName = session.inputNames[0];
  const outputs = await session.run({ [inputName]: tensor });
  const latency = Math.round(performance.now() - start);

  const outName = session.outputNames[0];
  const data = outputs[outName].data as Float32Array;
  const prediction = Math.max(0, Math.min(100, Number(data[0])));
  return { prediction, latency };
}

export function getRiskLevel(moisture: number): string {
  if (moisture < 20) return "Critical";
  if (moisture < 35) return "High";
  if (moisture < 55) return "Medium";
  if (moisture < 75) return "Low";
  return "Optimal";
}

export function getIrrigationAdvice(moisture: number): string {
  if (moisture < 15) return "Irrigate immediately";
  if (moisture < 25) return "Irrigate within 1 hour";
  if (moisture < 35) return "Irrigate within 2 hours";
  if (moisture < 45) return "Irrigate within 4 hours";
  if (moisture < 55) return "Schedule irrigation today";
  if (moisture < 70) return "Monitor — no irrigation needed";
  return "Soil is well-hydrated";
}
