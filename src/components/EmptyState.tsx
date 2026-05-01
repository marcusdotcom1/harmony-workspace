import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon, title, description, actionLabel, onAction,
}: {
  icon: LucideIcon; title: string; description: string; actionLabel?: string; onAction?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-aurora blur-2xl opacity-30 rounded-full" />
        <div className="relative h-16 w-16 rounded-2xl bg-gradient-aurora flex items-center justify-center text-white shadow-glow">
          <Icon className="h-7 w-7" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && <Button onClick={onAction} className="bg-primary hover:bg-primary/90 text-black border-0 shadow-none">{actionLabel}</Button>}
    </motion.div>
  );
}
