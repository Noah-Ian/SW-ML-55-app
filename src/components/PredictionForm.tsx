import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";

interface PredictionFormProps {
  onPredict: (features: Record<string, number>) => void;
  isLoading: boolean;
}

const SAMPLE_FEATURES = [
  { name: "feature_1", label: "Feature 1", placeholder: "e.g. 0.85" },
  { name: "feature_2", label: "Feature 2", placeholder: "e.g. 1.23" },
  { name: "feature_3", label: "Feature 3", placeholder: "e.g. -0.42" },
  { name: "feature_4", label: "Feature 4", placeholder: "e.g. 2.10" },
  { name: "feature_5", label: "Feature 5", placeholder: "e.g. 0.56" },
  { name: "feature_6", label: "Feature 6", placeholder: "e.g. 1.78" },
];

const PredictionForm = ({ onPredict, isLoading }: PredictionFormProps) => {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const features: Record<string, number> = {};
    SAMPLE_FEATURES.forEach((f) => {
      features[f.name] = parseFloat(values[f.name] || "0");
    });
    onPredict(features);
  };

  const fillSample = () => {
    const sample: Record<string, string> = {};
    SAMPLE_FEATURES.forEach((f) => {
      sample[f.name] = (Math.random() * 3 - 0.5).toFixed(3);
    });
    setValues(sample);
  };

  return (
    <Card className="gradient-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          Input Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {SAMPLE_FEATURES.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label htmlFor={f.name} className="text-xs font-mono text-muted-foreground">
                  {f.label}
                </Label>
                <Input
                  id={f.name}
                  type="number"
                  step="any"
                  placeholder={f.placeholder}
                  value={values[f.name] || ""}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  className="bg-secondary/50 border-border font-mono text-sm h-9"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillSample}
              className="text-xs border-border text-muted-foreground hover:text-foreground"
            >
              Fill Sample Data
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              Predict
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
