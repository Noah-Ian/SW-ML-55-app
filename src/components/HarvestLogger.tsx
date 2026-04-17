import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wheat, Plus } from "lucide-react";
import { CROP_TYPES, type CropType } from "@/lib/scaler";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onLog: (record: { cropType: CropType; yieldKgHa: number; notes?: string }) => void;
}

const HarvestLogger = ({ onLog }: Props) => {
  const [crop, setCrop] = useState<CropType | "">("");
  const [yieldVal, setYieldVal] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseFloat(yieldVal);
    if (!crop || isNaN(n) || n <= 0) {
      toast({
        title: "Missing info",
        description: "Pick a crop and enter a positive yield in kg/ha.",
        variant: "destructive",
      });
      return;
    }
    onLog({ cropType: crop as CropType, yieldKgHa: n, notes: notes.trim() || undefined });
    setYieldVal("");
    setNotes("");
    toast({ title: "Harvest logged", description: `${crop}: ${n} kg/ha saved.` });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Wheat className="h-4 w-4 text-warning" />
          Log a Harvest
        </CardTitle>
        <p className="text-xs text-muted-foreground">Record real yields so the correlation chart learns what works on your farm.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
          <div className="space-y-1">
            <Label className="text-xs font-mono text-muted-foreground">Crop</Label>
            <Select value={crop} onValueChange={(v) => setCrop(v as CropType)}>
              <SelectTrigger className="bg-secondary/50 border-border h-9 text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {CROP_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-mono text-muted-foreground">Yield (kg/ha)</Label>
            <Input
              type="number"
              step="any"
              placeholder="e.g. 5200"
              value={yieldVal}
              onChange={(e) => setYieldVal(e.target.value)}
              className="bg-secondary/50 border-border h-9 text-sm font-mono"
            />
          </div>
          <div className="space-y-1 sm:col-span-1">
            <Label className="text-xs font-mono text-muted-foreground">Notes (optional)</Label>
            <Input
              placeholder="e.g. dry season"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-secondary/50 border-border h-9 text-sm"
            />
          </div>
          <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9">
            <Plus className="h-4 w-4 mr-1" /> Log
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HarvestLogger;
