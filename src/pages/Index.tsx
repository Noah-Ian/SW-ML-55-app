import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import PredictionForm, { type FormSubmitValues } from "@/components/PredictionForm";
import PredictionResult from "@/components/PredictionResult";
import TrendChart from "@/components/TrendChart";
import SeasonalChart from "@/components/SeasonalChart";
import YieldCorrelation from "@/components/YieldCorrelation";
import HarvestLogger from "@/components/HarvestLogger";
import ModelStatus from "@/components/ModelStatus";
import { predictMoisture, getRiskLevel, getIrrigationAdvice } from "@/lib/predict";
import {
  loadPredictions,
  savePrediction,
  loadHarvests,
  saveHarvest,
  type PredictionRecord,
  type HarvestRecord,
} from "@/lib/storage";
import { getSampleHarvests } from "@/lib/sampleYields";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionRecord | null>(null);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [userHarvests, setUserHarvests] = useState<HarvestRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setPredictions(loadPredictions());
    setUserHarvests(loadHarvests());
  }, []);

  const allHarvests = [...getSampleHarvests(), ...userHarvests];

  const handlePredict = async (form: FormSubmitValues) => {
    setIsLoading(true);
    try {
      const { prediction, latency } = await predictMoisture(
        {
          soil_ph: form.soil_ph,
          temperature: form.temperature,
          humidity: form.humidity,
          fertilizer: form.fertilizer,
          irrigation: form.irrigation,
          cropType: form.cropType,
          month: form.month,
        },
        predictions,
      );

      const record: PredictionRecord = {
        id: Date.now(),
        timestamp: Date.now(),
        cropType: form.cropType,
        inputs: {
          soil_ph: form.soil_ph,
          temperature: form.temperature,
          humidity: form.humidity,
          fertilizer: form.fertilizer,
          irrigation: form.irrigation,
        },
        prediction,
        riskLevel: getRiskLevel(prediction),
        irrigationAdvice: getIrrigationAdvice(prediction),
        latency,
        month: form.month,
      };

      const updated = savePrediction(record);
      setPredictions(updated);
      setResult(record);
    } catch (e) {
      toast({
        title: "Prediction failed",
        description: e instanceof Error ? e.message : "Could not run the model. Check the console.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogHarvest = (h: { cropType: HarvestRecord["cropType"]; yieldKgHa: number; notes?: string }) => {
    const record: HarvestRecord = {
      id: Date.now(),
      timestamp: Date.now(),
      ...h,
    };
    setUserHarvests(saveHarvest(record));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sprout className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Soilsense AI</h1>
            <p className="text-xs text-muted-foreground italic">Predict. Decide. Grow.</p>
          </div>
          <div className="ml-auto">
            <ModelStatus />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
          <PredictionResult
            result={
              result
                ? {
                    soilMoisture: result.prediction,
                    riskLevel: result.riskLevel,
                    irrigationAdvice: result.irrigationAdvice,
                    cropType: result.cropType,
                    latency: result.latency,
                    timestamp: new Date(result.timestamp).toLocaleTimeString(),
                  }
                : null
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <TrendChart predictions={predictions} />
          <SeasonalChart predictions={predictions} />
        </div>

        <YieldCorrelation predictions={predictions} harvests={allHarvests} />

        <HarvestLogger onLog={handleLogHarvest} />
      </main>
    </div>
  );
};

export default Index;
