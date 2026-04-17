import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import type { PredictionRecord } from "@/lib/storage";

interface Props {
  predictions: PredictionRecord[];
}

const TrendChart = ({ predictions }: Props) => {
  const data = predictions
    .slice(-30)
    .map((p) => ({
      time: new Date(p.timestamp).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      moisture: parseFloat(p.prediction.toFixed(2)),
      crop: p.cropType,
    }));

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Moisture Trend
        </CardTitle>
        <p className="text-xs text-muted-foreground">How predicted soil moisture has changed over your recent readings.</p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-44 text-muted-foreground text-sm font-mono">
            No predictions yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 9%)",
                  border: "1px solid hsl(222 30% 18%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="moisture" stroke="hsl(187 100% 50%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendChart;
