import { useState } from "react";
import { Sprout } from "lucide-react";
import PredictionForm from "@/components/PredictionForm";
import PredictionResult from "@/components/PredictionResult";
import PredictionHistory from "@/components/PredictionHistory";
import ModelStatus from "@/components/ModelStatus";

interface PredictionEntry {
  soilMoisture: number;
  irrigation: number;
  cropType: string;
  latency: number;
  timestamp: string;
  id: number;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionEntry | null>(null);
  const [history, setHistory] = useState<PredictionEntry[]>([]);

  const handlePredict = async (features: Record<string, number>, cropType: string) => {
    setIsLoading(true);

    const start = performance.now();
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
    const latency = Math.round(performance.now() - start);

    const { soil_ph, temperature, humidity } = features;
    // Simulated: predict soil moisture from pH, temp, humidity
    const soilMoisture = 10 + humidity * 0.5 + (7 - soil_ph) * 3 + (30 - temperature) * 0.6 + (Math.random() - 0.5) * 10;
    // Simulated: recommend irrigation based on predicted moisture
    const irrigation = 5 + Math.max(0, (50 - soilMoisture) * 0.4) + temperature * 0.15 + (Math.random() - 0.5) * 3;

    const entry: PredictionEntry = {
      soilMoisture: Math.max(10, Math.min(80, soilMoisture)),
      irrigation: Math.max(5, Math.min(30, irrigation)),
      cropType,
      latency,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now(),
    };

    setResult(entry);
    setHistory((prev) => [...prev, entry].slice(-20));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sprout className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              AgriSensor Dashboard
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Gradient Boosting · ONNX Runtime · Moisture &amp; Irrigation
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-xs font-mono text-muted-foreground">Connected</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <ModelStatus />

        <div className="grid md:grid-cols-2 gap-6">
          <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
          <PredictionResult result={result} />
        </div>

        <PredictionHistory history={history.map(h => ({
          prediction: h.soilMoisture,
          latency: h.latency,
          timestamp: h.timestamp,
          id: h.id,
        }))} />

        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">
            API Endpoint Configuration
          </p>
          <code className="text-sm font-mono text-primary bg-primary/5 px-3 py-1.5 rounded block">
            POST https://your-api.example.com/predict
          </code>
          <p className="text-xs text-muted-foreground mt-2">
            Replace with your deployed FastAPI endpoint. Accepts: soil_ph, temperature, humidity, crop_type. Returns: soil_moisture, irrigation_mm.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
