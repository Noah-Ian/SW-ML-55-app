import { useState } from "react";
import { Brain } from "lucide-react";
import PredictionForm from "@/components/PredictionForm";
import PredictionResult from "@/components/PredictionResult";
import PredictionHistory from "@/components/PredictionHistory";
import ModelStatus from "@/components/ModelStatus";

interface PredictionEntry {
  prediction: number;
  latency: number;
  timestamp: string;
  id: number;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionEntry | null>(null);
  const [history, setHistory] = useState<PredictionEntry[]>([]);

  const handlePredict = async (features: Record<string, number>) => {
    setIsLoading(true);

    // Simulate API call — replace with actual endpoint
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
    const latency = Math.round(performance.now() - start);

    // Simulated prediction
    const values = Object.values(features);
    const prediction =
      values.reduce((a, b) => a + b * 0.7, 0) + (Math.random() - 0.5) * 0.5;

    const entry: PredictionEntry = {
      prediction,
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
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              GB Model Dashboard
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Gradient Boosting · ONNX Runtime · v1.0.0
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-xs font-mono text-muted-foreground">Connected</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <ModelStatus />

        <div className="grid md:grid-cols-2 gap-6">
          <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
          <PredictionResult result={result} />
        </div>

        <PredictionHistory history={history} />

        {/* API Config */}
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">
            API Endpoint Configuration
          </p>
          <code className="text-sm font-mono text-primary bg-primary/5 px-3 py-1.5 rounded block">
            POST https://your-api.example.com/predict
          </code>
          <p className="text-xs text-muted-foreground mt-2">
            Replace with your deployed FastAPI endpoint. See the deployment guide for setup instructions.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
