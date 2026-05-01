import { useMemo, useState } from "react";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderKanban, Plus, Search } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import { EmptyState } from "@/components/EmptyState";
import { ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

const statuses: { id: "all" | ProjectStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "planning", label: "Planning" },
  { id: "on_hold", label: "On Hold" },
  { id: "completed", label: "Completed" },
];

export default function Projects() {
  const { projects, users, tasks, currentUser } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof statuses)[number]["id"]>("all");

  const filtered = useMemo(
    () =>
      projects
        .filter((p) => filter === "all" || p.status === filter)
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase())),
    [projects, filter, query],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-muted-foreground">{projects.length} projects · {tasks.length} tasks across your workspace</p>
        </div>
        {currentUser?.role === "admin" && (
          <Button onClick={() => setOpen(true)} className="rounded-lg border-0 bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
            <Plus className="mr-1 h-4 w-4" /> New project
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects..." className="h-10 rounded-lg pl-9" />
        </div>
        <div className="flex w-fit gap-1 overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-1 scrollbar-thin">
          {statuses.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilter(s.id)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                filter === s.id ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
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
