import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Clock, Zap, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PredictionResultProps {
  result: {
    soilMoisture: number;
    riskLevel: string;
    irrigationAdvice: string;
    cropType: string;
    latency: number;
    timestamp: string;
  } | null;
}

const riskConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Critical: { color: "bg-destructive text-destructive-foreground", icon: <ShieldAlert className="h-3.5 w-3.5" /> },
  High: { color: "bg-destructive/80 text-destructive-foreground", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  Medium: { color: "bg-warning text-warning-foreground", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  Low: { color: "bg-primary/20 text-primary", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  Optimal: { color: "bg-success/20 text-success", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
};

const PredictionResult = ({ result }: PredictionResultProps) => {
  if (!result) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-muted-foreground text-sm font-mono">
            Submit sensor data to see predictions
          </p>
        </CardContent>
      </Card>
    );
  }

  const risk = riskConfig[result.riskLevel] || riskConfig["Medium"];

  return (
    <Card className="gradient-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Soil Moisture */}
        <div className="text-center py-4 bg-primary/5 rounded-lg">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Droplets className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground font-mono">Predicted Soil Moisture</span>
          </div>
          <p className="text-4xl font-bold font-mono text-primary">
            {(result.soilMoisture ?? 0).toFixed(1)}%
          </p>
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
          <span className="text-sm text-muted-foreground font-mono">Risk Level</span>
          <Badge className={`${risk.color} flex items-center gap-1.5 font-mono`}>
            {risk.icon}
            {result.riskLevel}
          </Badge>
        </div>

        {/* Irrigation Advice */}
        <div className="bg-secondary/50 rounded-lg p-3">
          <span className="text-xs text-muted-foreground font-mono block mb-1">Irrigation Recommendation</span>
          <p className="text-sm font-semibold text-foreground">{result.irrigationAdvice}</p>
        </div>

        {/* Meta */}
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
