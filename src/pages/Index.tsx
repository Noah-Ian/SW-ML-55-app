import { useState } from "react";
import { Sprout } from "lucide-react";
import PredictionForm from "@/components/PredictionForm";
import PredictionResult from "@/components/PredictionResult";
import PredictionHistory from "@/components/PredictionHistory";
import ModelStatus from "@/components/ModelStatus";

interface PredictionEntry {
  fertilizer: number;
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

    // Simulate API call — replace with actual endpoint
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
    const latency = Math.round(performance.now() - start);

    // Simulated predictions based on input features
    const { soil_moisture, soil_ph, temperature, humidity } = features;
    const fertilizer = 30 + soil_moisture * 0.4 + soil_ph * 5 + temperature * 0.8 + humidity * 0.3 + (Math.random() - 0.5) * 20;
    const irrigation = 5 + (80 - soil_moisture) * 0.2 + temperature * 0.3 + (Math.random() - 0.5) * 5;

    const entry: PredictionEntry = {
      fertilizer: Math.max(30, Math.min(150, fertilizer)),
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
              Gradient Boosting · ONNX Runtime · Fertilizer &amp; Irrigation
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
          prediction: h.fertilizer,
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
            Replace with your deployed FastAPI endpoint. Accepts: soil_moisture, soil_ph, temperature, humidity, crop_type.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
