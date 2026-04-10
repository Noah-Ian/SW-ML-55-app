import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Leaf, Clock, Zap } from "lucide-react";

interface PredictionResultProps {
  result: {
    fertilizer: number;
    irrigation: number;
    cropType: string;
    latency: number;
    timestamp: string;
  } | null;
}

const PredictionResult = ({ result }: PredictionResultProps) => {
  if (!result) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-muted-foreground text-sm font-mono">
            Submit sensor data to see recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center py-3 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Leaf className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground font-mono">Fertilizer</span>
            </div>
            <p className="text-3xl font-bold font-mono text-primary">
              {result.fertilizer.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">kg/ha</p>
          </div>
          <div className="text-center py-3 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Droplets className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground font-mono">Irrigation</span>
            </div>
            <p className="text-3xl font-bold font-mono text-primary">
              {result.irrigation.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">mm</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-secondary/50 rounded-lg p-3">
            <span className="text-xs text-muted-foreground block">Crop</span>
            <p className="font-mono text-sm text-foreground">{result.cropType}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-0.5">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Latency</span>
            </div>
            <p className="font-mono text-sm text-foreground">{result.latency}ms</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <span className="text-xs text-muted-foreground block">Model</span>
            <p className="font-mono text-sm text-foreground">GB v1.0</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-mono text-right">
          {result.timestamp}
        </p>
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
