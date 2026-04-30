import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Task, TaskStatus, User } from "@/types";
import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const columns: { id: TaskStatus; label: string; accent: string }[] = [
  { id: "todo", label: "Todo", accent: "bg-slate-400" },
  { id: "in_progress", label: "In Progress", accent: "bg-sky-500" },
  { id: "in_review", label: "In Review", accent: "bg-amber-500" },
  { id: "completed", label: "Completed", accent: "bg-emerald-500" },
];

export function KanbanBoard({
  tasks, users, onTaskClick, onMove, onAddTask,
}: {
  tasks: Task[]; users: User[]; onTaskClick?: (t: Task) => void;
  onMove?: (taskId: string, status: TaskStatus) => void; onAddTask?: (status: TaskStatus) => void;
}) {
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);
  const userById = (id?: string) => users.find((u) => u.id === id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        const isOver = dragOver === col.id;
        return (
          <div
            key={col.id}
            onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              if (id && onMove) onMove(id, col.id);
              setDragOver(null);
            }}
            className={cn(
              "rounded-2xl bg-muted/40 border border-border/60 p-3 transition-all",
              isOver && "ring-2 ring-primary/50 bg-primary/5"
            )}
          >
            <div className="flex items-center justify-between px-1.5 mb-3">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", col.accent)} />
                <span className="text-sm font-semibold">{col.label}</span>
                <span className="text-xs text-muted-foreground bg-background rounded-md px-1.5 py-0.5">{colTasks.length}</span>
              </div>
              {onAddTask && (
                <button onClick={() => onAddTask(col.id)} className="p-1 rounded hover:bg-background transition-colors">
                  <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
            <div className="space-y-2 min-h-[120px]">
              <AnimatePresence>
                {colTasks.map((task) => (
                  <TaskCard
                    key={task.id} task={task} assignee={userById(task.assigneeId)}
                    onClick={() => onTaskClick?.(task)}
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
                  />
                ))}
              </AnimatePresence>
              {colTasks.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-border/50 p-6 text-center text-xs text-muted-foreground">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
