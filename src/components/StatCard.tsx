import { motion } from "framer-motion";
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
    primary: "from-violet-500 to-fuchsia-500",
    success: "from-emerald-500 to-teal-500",
    warning: "from-amber-500 to-orange-500",
    destructive: "from-rose-500 to-pink-500",
    accent: "from-sky-500 to-cyan-500",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-card hover:shadow-lg-soft transition-shadow"
    >
      <div className={cn("absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 blur-2xl bg-gradient-to-br", accents[accent])} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground font-medium">{label}</div>
          <div className="mt-2 text-3xl font-display font-bold tracking-tight">{value}</div>
          {delta && (
            <div className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", delta.positive ? "text-success" : "text-destructive")}>
              {delta.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {delta.positive ? "+" : ""}{delta.value}% from last week
            </div>
          )}
        </div>
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-md", accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
