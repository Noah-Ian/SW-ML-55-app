import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2 } from "lucide-react";

interface PredictionFormProps {
  onPredict: (features: Record<string, number>, cropType: string) => void;
  isLoading: boolean;
}

const CROP_TYPES = ["Tomatoes", "Wheat", "Maize", "Beans", "Lettuce"];

const NUMERIC_FEATURES = [
  { name: "soil_moisture", label: "Soil Moisture (%)", placeholder: "e.g. 45.0", min: 0, max: 100 },
  { name: "soil_ph", label: "Soil pH", placeholder: "e.g. 6.5", min: 3, max: 9 },
  { name: "temperature", label: "Temperature (°C)", placeholder: "e.g. 25.0", min: -10, max: 60 },
  { name: "humidity", label: "Humidity (%)", placeholder: "e.g. 60.0", min: 0, max: 100 },
];

const PredictionForm = ({ onPredict, isLoading }: PredictionFormProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [cropType, setCropType] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const features: Record<string, number> = {};
    NUMERIC_FEATURES.forEach((f) => {
      features[f.name] = parseFloat(values[f.name] || "0");
    });
    onPredict(features, cropType || "Tomatoes");
  };

  const fillSample = () => {
    setValues({
      soil_moisture: (10 + Math.random() * 70).toFixed(1),
      soil_ph: (4.5 + Math.random() * 3.5).toFixed(2),
      temperature: (18 + Math.random() * 17).toFixed(1),
      humidity: (30 + Math.random() * 60).toFixed(1),
    });
    setCropType(CROP_TYPES[Math.floor(Math.random() * CROP_TYPES.length)]);
  };

  return (
    <Card className="gradient-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          Sensor Input
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {NUMERIC_FEATURES.map((f) => (
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
          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-muted-foreground">Crop Type</Label>
            <Select value={cropType} onValueChange={setCropType}>
              <SelectTrigger className="bg-secondary/50 border-border font-mono text-sm h-9">
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                {CROP_TYPES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
