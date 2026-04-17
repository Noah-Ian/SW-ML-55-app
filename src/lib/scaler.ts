// Auto-derived from your scaler.joblib (RobustScaler)
// Feature order MUST match training:
// ['Soil_pH','Temperature(C)','Humidity(%)','Fertilizer_Recommended(kg/ha)',
//  'Irrigation_Recommended(mm)','Month_sin','Month_cos',
//  'Moisture_Lag1','Moisture_Lag2','Moisture_RollingMean3',
//  'Crop_Type_Lettuce','Crop_Type_Maize','Crop_Type_Tomatoes','Crop_Type_Wheat']

export const FEATURE_NAMES = [
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
] as const;

export const SCALER_CENTER = [
  6.24, 26.7, 59.9, 85.9, 17.4,
  1.2246467991473532e-16, -1.8369701987210297e-16,
  45.37, 45.6, 44.98,
  0.0, 0.0, 0.0, 0.0,
];

export const SCALER_SCALE = [
  1.815, 8.6, 29.2, 60.4, 12.05,
  1.366025403784439, 1.3660254037844388,
  35.835, 35.91, 18.33833333333334,
  1.0, 1.0, 1.0, 1.0,
];

export const CROP_TYPES = ["Lettuce", "Maize", "Tomatoes", "Wheat"] as const;
export type CropType = (typeof CROP_TYPES)[number];

export function robustScale(raw: number[]): Float32Array {
  const out = new Float32Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    out[i] = (raw[i] - SCALER_CENTER[i]) / SCALER_SCALE[i];
  }
  return out;
}
