import { useMemo, useState } from "react";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListChecks, Plus, Search } from "lucide-react";
import { Task, TaskStatus } from "@/types";
import { TaskModal } from "@/components/TaskModal";
import { KanbanBoard } from "@/components/KanbanBoard";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { PriorityBadge } from "@/components/badges/PriorityBadge";
import { UserAvatar } from "@/components/UserAvatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";

export default function Tasks() {
  const { tasks, users, projects, currentUser, updateTask } = useApp();
  const [view, setView] = useState<"board" | "list">("board");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const isAdmin = currentUser?.role === "admin";
  // Member sees only assigned tasks
  const visible = useMemo(() => {
    let list = tasks;
    if (!isAdmin) list = list.filter((t) => t.assigneeId === currentUser?.id);
    if (query) list = list.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [tasks, isAdmin, currentUser, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? `Managing ${visible.length} tasks across all projects` : `${visible.length} tasks assigned to you`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-muted/60 border border-border/60">
            {(["board", "list"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={cn("px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all",
                  view === v ? "bg-background shadow-sm-soft text-foreground" : "text-muted-foreground")}>
                {v}
              </button>
            ))}
          </div>
          {isAdmin && projects[0] && (
            <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-primary text-black border-0 hover:bg-primary/90 rounded-xl shadow-sm">
              <Plus className="h-4 w-4 mr-1" /> Task
            </Button>
          )}
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks…" className="pl-9 rounded-xl h-10" />
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={ListChecks} title="No tasks yet" description="Create your first task to start tracking work." />
      ) : view === "board" ? (
        <KanbanBoard
          tasks={visible} users={users}
          onTaskClick={(t) => { setEditing(t); setOpen(true); }}
          onMove={(id, status) => updateTask(id, { status })}
        />
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left p-3 font-medium">Task</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Project</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Status</th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">Priority</th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">Due</th>
                <th className="text-left p-3 font-medium">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => {
                const a = users.find((u) => u.id === t.assigneeId);
                const p = projects.find((p) => p.id === t.projectId);
                return (
                  <tr key={t.id} onClick={() => { setEditing(t); setOpen(true); }}
                    className="border-t border-border/60 hover:bg-muted/40 cursor-pointer transition-colors">
                    <td className="p-3 font-medium">{t.title}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{p?.emoji} {p?.name}</td>
                    <td className="p-3 hidden md:table-cell"><StatusBadge status={t.status} /></td>
                    <td className="p-3 hidden lg:table-cell"><PriorityBadge priority={t.priority} /></td>
                    <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">{t.dueDate ? format(new Date(t.dueDate), "MMM d") : "—"}</td>
                    <td className="p-3">{a ? <UserAvatar user={a} size={26} /> : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {projects[0] && (
        <TaskModal open={open} onOpenChange={setOpen} projectId={editing?.projectId || projects[0].id} task={editing} />
      )}
    </div>
  );
}
