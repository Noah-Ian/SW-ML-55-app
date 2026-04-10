import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { History } from "lucide-react";

interface HistoryEntry {
  prediction: number;
  latency: number;
  timestamp: string;
  id: number;
}

interface PredictionHistoryProps {
  history: HistoryEntry[];
}

const PredictionHistory = ({ history }: PredictionHistoryProps) => {
  const chartData = history.map((h, i) => ({
    name: `#${i + 1}`,
    prediction: parseFloat(h.prediction.toFixed(3)),
    latency: h.latency,
  }));

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <History className="h-4 w-4 text-accent" />
          Prediction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground text-sm font-mono">No predictions yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 9%)",
                  border: "1px solid hsl(222 30% 18%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontFamily: "JetBrains Mono, monospace",
                }}
                labelStyle={{ color: "hsl(210 40% 92%)" }}
              />
              <Bar dataKey="prediction" fill="hsl(187 100% 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionHistory;
