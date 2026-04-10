import { Card, CardContent } from "@/components/ui/card";
import { Activity, Cpu, Database, Sprout } from "lucide-react";

interface StatusItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: "online" | "warning" | "offline";
}

const ModelStatus = () => {
  const items: StatusItem[] = [
    { icon: <Activity className="h-4 w-4" />, label: "API Status", value: "Online", status: "online" },
    { icon: <Cpu className="h-4 w-4" />, label: "Runtime", value: "ONNX 1.19", status: "online" },
    { icon: <Database className="h-4 w-4" />, label: "Models", value: "Moisture + Irr", status: "online" },
    { icon: <Sprout className="h-4 w-4" />, label: "Crops", value: "5 Types", status: "online" },
  ];

  const statusColor = {
    online: "bg-success",
    warning: "bg-warning",
    offline: "bg-destructive",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <Card key={item.label} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              {item.icon}
              <span className="text-xs font-mono">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${statusColor[item.status]}`} />
              <span className="text-sm font-semibold text-foreground">{item.value}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModelStatus;
