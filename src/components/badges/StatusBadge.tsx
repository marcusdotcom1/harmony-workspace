import { cn } from "@/lib/utils";
import { TaskStatus, ProjectStatus } from "@/types";

const taskMap: Record<TaskStatus, { label: string; cls: string }> = {
  todo: { label: "Todo", cls: "bg-muted text-muted-foreground border-border" },
  in_progress: { label: "In Progress", cls: "bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/20" },
  in_review: { label: "In Review", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20" },
  completed: { label: "Completed", cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20" },
};

const projMap: Record<ProjectStatus, { label: string; cls: string }> = {
  planning: { label: "Planning", cls: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20" },
  active: { label: "Active", cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20" },
  on_hold: { label: "On Hold", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20" },
  completed: { label: "Completed", cls: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20" },
};

export function StatusBadge({ status, kind = "task", className }: { status: TaskStatus | ProjectStatus; kind?: "task" | "project"; className?: string }) {
  const m = kind === "task" ? taskMap[status as TaskStatus] : projMap[status as ProjectStatus];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border", m.cls, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" /> {m.label}
    </span>
  );
}
