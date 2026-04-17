import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { getSession } from "@/lib/predict";

const ModelStatus = () => {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getSession()
      .then(() => setStatus("ready"))
      .catch((e) => {
        setStatus("error");
        setError(e?.message || "Failed to load model");
      });
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading ML model…
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex items-center gap-2 text-xs font-mono text-destructive" title={error}>
        <AlertCircle className="h-3 w-3" />
        Model error
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-xs font-mono text-success">
      <CheckCircle2 className="h-3 w-3" />
      Model ready
    </div>
  );
};

export default ModelStatus;
