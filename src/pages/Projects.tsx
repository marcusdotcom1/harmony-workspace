import { useMemo, useState } from "react";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FolderKanban } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import { EmptyState } from "@/components/EmptyState";
import { ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

const statuses: { id: "all" | ProjectStatus; label: string }[] = [
  { id: "all", label: "All" }, { id: "active", label: "Active" },
  { id: "planning", label: "Planning" }, { id: "on_hold", label: "On Hold" },
  { id: "completed", label: "Completed" },
];

export default function Projects() {
  const { projects, users, tasks, currentUser } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<typeof statuses[number]["id"]>("all");

  const filtered = useMemo(() => projects
    .filter((p) => filter === "all" || p.status === filter)
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase())),
    [projects, filter, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">{projects.length} projects · {tasks.length} tasks across your workspace</p>
        </div>
        {currentUser?.role === "admin" && (
          <Button onClick={() => setOpen(true)} className="bg-gradient-aurora text-white border-0 hover:opacity-90 rounded-xl shadow-glow">
            <Plus className="h-4 w-4 mr-1" /> New project
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects…" className="pl-9 rounded-xl h-10" />
        </div>
        <div className="flex gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 w-fit overflow-x-auto scrollbar-thin">
          {statuses.map((s) => (
            <button key={s.id} onClick={() => setFilter(s.id)}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap",
                filter === s.id ? "bg-background shadow-sm-soft text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start organizing your team's work."
          actionLabel={currentUser?.role === "admin" ? "Create project" : undefined}
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.id} project={p} index={i}
              members={users.filter((u) => p.memberIds.includes(u.id))}
              tasks={tasks.filter((t) => t.projectId === p.id)}
            />
          ))}
        </div>
      )}

      <ProjectModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
