import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon, label, value, delta, accent = "primary", index = 0,
}: {
  icon: LucideIcon; label: string; value: string | number;
  delta?: { value: number; positive?: boolean }; accent?: "primary" | "success" | "warning" | "destructive" | "accent";
  index?: number;
}) {
  const accents: Record<string, string> = {
    primary: "text-primary bg-primary/10 border-primary/20",
    success: "text-success bg-success/10 border-success/20",
    warning: "text-warning bg-warning/10 border-warning/20",
    destructive: "text-destructive bg-destructive/10 border-destructive/20",
    accent: "text-primary bg-primary/10 border-primary/20",
  };
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-card glow-hover">
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
          {delta && (
            <div className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", delta.positive ? "text-success" : "text-destructive")}>
              {delta.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {delta.positive ? "+" : ""}{delta.value}% from last week
            </div>
          )}
        </div>
        <div className={cn("h-10 w-10 rounded-lg border flex items-center justify-center", accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
