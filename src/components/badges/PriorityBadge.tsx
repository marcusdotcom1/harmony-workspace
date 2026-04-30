import { cn } from "@/lib/utils";
import { TaskPriority } from "@/types";
import { ArrowDown, ArrowRight, ArrowUp, Flame } from "lucide-react";

const map: Record<TaskPriority, { label: string; cls: string; Icon: any }> = {
  low: { label: "Low", cls: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20", Icon: ArrowDown },
  medium: { label: "Medium", cls: "bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/20", Icon: ArrowRight },
  high: { label: "High", cls: "bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-500/20", Icon: ArrowUp },
  urgent: { label: "Urgent", cls: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20", Icon: Flame },
};

export function PriorityBadge({ priority, className }: { priority: TaskPriority; className?: string }) {
  const { label, cls, Icon } = map[priority];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border", cls, className)}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}
