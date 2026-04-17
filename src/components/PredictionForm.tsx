import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CROP_TYPES, type CropType } from "@/lib/scaler";

export interface FormSubmitValues {
  soil_ph: number;
  temperature: number;
  humidity: number;
  fertilizer: number;
  irrigation: number;
  cropType: CropType;
  month: number;
}

interface PredictionFormProps {
  onPredict: (values: FormSubmitValues) => void;
  isLoading: boolean;
}

const FIELDS = [
  { name: "soil_ph", label: "Soil pH", placeholder: "6.5", min: 3, max: 9, hint: "How acidic or alkaline the soil is (most crops like 6–7)." },
  { name: "temperature", label: "Temperature (°C)", placeholder: "25", min: -10, max: 60, hint: "Outdoor air temperature right now." },
  { name: "humidity", label: "Humidity (%)", placeholder: "60", min: 0, max: 100, hint: "How much moisture is in the air." },
] as const;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const PredictionForm = ({ onPredict, isLoading }: PredictionFormProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [cropType, setCropType] = useState<CropType | "">("");
  const [fertilizer, setFertilizer] = useState<number>(85);
  const [irrigation, setIrrigation] = useState<number>(17);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    FIELDS.forEach((f) => {
      const val = values[f.name]?.trim();
      if (!val) newErrors[f.name] = `${f.label} is required`;
      else {
        const n = parseFloat(val);
        if (isNaN(n)) newErrors[f.name] = "Must be a number";
        else if (n < f.min || n > f.max) newErrors[f.name] = `Must be ${f.min}–${f.max}`;
      }
    });
    if (!cropType) newErrors.cropType = "Pick a crop";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Please fill in all fields",
        description: "We need every reading to make an accurate prediction.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onPredict({
      soil_ph: parseFloat(values.soil_ph),
      temperature: parseFloat(values.temperature),
      humidity: parseFloat(values.humidity),
      fertilizer,
      irrigation,
      cropType: cropType as CropType,
      month,
    });
  };

  const fillSample = () => {
    setValues({
      soil_ph: (5.5 + Math.random() * 2).toFixed(2),
      temperature: (20 + Math.random() * 12).toFixed(1),
      humidity: (40 + Math.random() * 45).toFixed(1),
    });
    setCropType(CROP_TYPES[Math.floor(Math.random() * CROP_TYPES.length)]);
    setFertilizer(60 + Math.round(Math.random() * 80));
    setIrrigation(10 + Math.round(Math.random() * 20));
    setErrors({});
  };

  return (
    <Card className="gradient-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Field Conditions
        </CardTitle>
        <p className="text-xs text-muted-foreground">Enter today's sensor readings — we'll predict soil moisture for your crop.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {FIELDS.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label htmlFor={f.name} className="text-xs font-mono text-muted-foreground" title={f.hint}>
                  {f.label}
                </Label>
                <Input
                  id={f.name}
                  type="number"
                  step="any"
                  placeholder={f.placeholder}
                  value={values[f.name] || ""}
                  onChange={(e) => {
                    setValues({ ...values, [f.name]: e.target.value });
                    if (errors[f.name]) setErrors({ ...errors, [f.name]: "" });
                  }}
                  className={`bg-secondary/50 border-border font-mono text-sm h-9 ${errors[f.name] ? "border-destructive" : ""}`}
                />
                {errors[f.name] && <p className="text-xs text-destructive">{errors[f.name]}</p>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-muted-foreground">Crop</Label>
              <Select value={cropType} onValueChange={(v) => { setCropType(v as CropType); if (errors.cropType) setErrors({ ...errors, cropType: "" }); }}>
                <SelectTrigger className={`bg-secondary/50 border-border font-mono text-sm h-9 ${errors.cropType ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  {CROP_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.cropType && <p className="text-xs text-destructive">{errors.cropType}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-muted-foreground">Month</Label>
              <Select value={String(month)} onValueChange={(v) => setMonth(parseInt(v))}>
                <SelectTrigger className="bg-secondary/50 border-border font-mono text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-mono text-muted-foreground" title="Recommended fertilizer dose for this season.">
                  Fertilizer (kg/ha)
                </Label>
                <span className="font-mono text-sm text-primary">{fertilizer}</span>
              </div>
              <Slider value={[fertilizer]} onValueChange={(v) => setFertilizer(v[0])} min={0} max={250} step={1} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-mono text-muted-foreground" title="Planned irrigation amount in millimeters.">
                  Irrigation (mm)
                </Label>
                <span className="font-mono text-sm text-primary">{irrigation}</span>
              </div>
              <Slider value={[irrigation]} onValueChange={(v) => setIrrigation(v[0])} min={0} max={50} step={1} />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={fillSample} className="text-xs border-border text-muted-foreground hover:text-foreground">
              <Sparkles className="h-3 w-3 mr-1" /> Try Sample
            </Button>
            <Button type="submit" size="sm" disabled={isLoading} className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
              Predict
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
