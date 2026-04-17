# Soilsense AI

A machine-learning powered soil-moisture prediction app for farmers.

> Predict. Decide. Grow.

## What it does

- Takes today's field readings (soil pH, temperature, humidity, fertilizer, irrigation, crop, month)
- Runs a **Gradient Boosting** model (trained in scikit-learn, exported to ONNX) to predict soil moisture %
- Classifies risk and gives plain-English irrigation advice
- Stores every prediction and harvest log locally so you can see:
  - **Moisture trend** over time
  - **Seasonal patterns** by month
  - **Crop-yield correlation** (sweet-spot moisture per crop)

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind, shadcn/ui, Recharts |
| ML inference (browser) | `onnxruntime-web` running `model.onnx` directly in the browser |
| ML inference (server, optional) | FastAPI + `onnxruntime` (Python) |
| Persistence | `localStorage` (predictions, harvest logs) |
| Packaging | Docker + Docker Compose, served by nginx |

## Run locally (no Docker)

```bash
npm install
npm run dev          # http://localhost:8080
```

## Run with Docker (frontend + backend)

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend health: http://localhost:8000/health
- Backend predict: `POST http://localhost:8000/predict`

## Model inputs (14 features, RobustScaler-scaled)

1. `Soil_pH`
2. `Temperature(C)`
3. `Humidity(%)`
4. `Fertilizer_Recommended(kg/ha)`
5. `Irrigation_Recommended(mm)`
6. `Month_sin` *(derived from selected month)*
7. `Month_cos` *(derived from selected month)*
8. `Moisture_Lag1` *(auto: previous prediction)*
9. `Moisture_Lag2` *(auto: prediction before that)*
10. `Moisture_RollingMean3` *(auto: avg of last 3)*
11–14. `Crop_Type_*` one-hot (Lettuce / Maize / Tomatoes / Wheat)

Lag features are auto-filled from local prediction history (default 45% on first run).

## Future work

- Move history to a real database for multi-device sync
- Pull live weather via OpenWeather API to auto-fill temperature/humidity
- User accounts and per-farm fine-tuned models
- Retrain pipeline on accumulated harvest + moisture data
- Mobile app + IoT sensor ingestion
