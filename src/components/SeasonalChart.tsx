import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Calendar } from "lucide-react";
import type { PredictionRecord } from "@/lib/storage";

interface Props {
  predictions: PredictionRecord[];
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const SeasonalChart = ({ predictions }: Props) => {
  const data = useMemo(() => {
    const buckets: { sum: number; count: number }[] = Array.from({ length: 12 }, () => ({ sum: 0, count: 0 }));
    predictions.forEach((p) => {
      const idx = (p.month ?? new Date(p.timestamp).getMonth() + 1) - 1;
      if (idx >= 0 && idx < 12) {
        buckets[idx].sum += p.prediction;
        buckets[idx].count += 1;
      }
    });
    return buckets.map((b, i) => ({
      month: MONTHS[i],
      avg: b.count ? parseFloat((b.sum / b.count).toFixed(2)) : null,
    }));
  }, [predictions]);

  const hasData = data.some((d) => d.avg !== null);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent" />
          Seasonal Patterns
        </CardTitle>
        <p className="text-xs text-muted-foreground">Average predicted moisture grouped by month — see how the season affects your soil.</p>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-44 text-muted-foreground text-sm font-mono">
            Make a few predictions across months to see patterns
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 9%)",
                  border: "1px solid hsl(222 30% 18%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="avg" fill="hsl(265 80% 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SeasonalChart;
