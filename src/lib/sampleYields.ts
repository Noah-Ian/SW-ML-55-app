// Realistic sample harvest data so charts look meaningful before the user logs anything.
// Yields are kg/ha; loosely modeled with moisture sweet spots per crop.

import type { HarvestRecord } from "./storage";
import type { CropType } from "./scaler";

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;

interface Seed {
  crop: CropType;
  daysAgo: number;
  yieldKgHa: number;
}

const SEEDS: Seed[] = [
  { crop: "Tomatoes", daysAgo: 180, yieldKgHa: 42000 },
  { crop: "Tomatoes", daysAgo: 150, yieldKgHa: 38500 },
  { crop: "Tomatoes", daysAgo: 120, yieldKgHa: 45200 },
  { crop: "Tomatoes", daysAgo: 90, yieldKgHa: 31000 },
  { crop: "Wheat", daysAgo: 200, yieldKgHa: 4200 },
  { crop: "Wheat", daysAgo: 160, yieldKgHa: 5100 },
  { crop: "Wheat", daysAgo: 100, yieldKgHa: 3800 },
  { crop: "Wheat", daysAgo: 60, yieldKgHa: 4700 },
  { crop: "Maize", daysAgo: 175, yieldKgHa: 8900 },
  { crop: "Maize", daysAgo: 130, yieldKgHa: 9600 },
  { crop: "Maize", daysAgo: 80, yieldKgHa: 7400 },
  { crop: "Lettuce", daysAgo: 110, yieldKgHa: 22000 },
  { crop: "Lettuce", daysAgo: 70, yieldKgHa: 25500 },
  { crop: "Lettuce", daysAgo: 40, yieldKgHa: 19800 },
];

export function getSampleHarvests(): HarvestRecord[] {
  return SEEDS.map((s, i) => ({
    id: -(i + 1), // negative IDs mark sample data
    timestamp: NOW - s.daysAgo * DAY,
    cropType: s.crop,
    yieldKgHa: s.yieldKgHa,
    notes: "Sample data",
  }));
}
