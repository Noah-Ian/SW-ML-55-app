import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Zap } from "lucide-react";

interface PredictionResultProps {
  result: {
    prediction: number;
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
            Submit features to see prediction
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
          Prediction Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-2">
            Predicted Value
          </p>
          <p className="text-5xl font-bold font-mono text-primary glow-primary inline-block px-4 py-2 rounded-lg bg-primary/5">
            {result.prediction.toFixed(4)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Latency</span>
            </div>
            <p className="font-mono text-sm text-foreground">{result.latency}ms</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Model</span>
            </div>
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
