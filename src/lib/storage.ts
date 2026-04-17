// localStorage persistence for predictions, sensor readings, and harvest logs

import type { CropType } from "./scaler";

export interface PredictionRecord {
  id: number;
  timestamp: number;
  cropType: CropType;
  inputs: {
    soil_ph: number;
    temperature: number;
    humidity: number;
    fertilizer: number;
    irrigation: number;
  };
  prediction: number; // soil moisture %
  riskLevel: string;
  irrigationAdvice: string;
  latency: number;
  month: number; // 1-12
}

export interface HarvestRecord {
  id: number;
  timestamp: number;
  cropType: CropType;
  yieldKgHa: number;
  notes?: string;
}

const PRED_KEY = "soilsense.predictions.v1";
const HARVEST_KEY = "soilsense.harvests.v1";

export function loadPredictions(): PredictionRecord[] {
  try {
    return JSON.parse(localStorage.getItem(PRED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function savePrediction(p: PredictionRecord): PredictionRecord[] {
  const all = loadPredictions();
  all.push(p);
  // cap at 500 to avoid quota issues
  const trimmed = all.slice(-500);
  localStorage.setItem(PRED_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function clearPredictions() {
  localStorage.removeItem(PRED_KEY);
}

export function loadHarvests(): HarvestRecord[] {
  try {
    return JSON.parse(localStorage.getItem(HARVEST_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHarvest(h: HarvestRecord): HarvestRecord[] {
  const all = loadHarvests();
  all.push(h);
  localStorage.setItem(HARVEST_KEY, JSON.stringify(all));
  return all;
}

export function clearHarvests() {
  localStorage.removeItem(HARVEST_KEY);
}
