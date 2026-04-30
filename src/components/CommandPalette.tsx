import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useApp } from "@/store/AppContext";
import { FolderKanban, ListChecks, Users, LayoutDashboard, Calendar, BarChart3, Settings } from "lucide-react";

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (b: boolean) => void }) {
  const navigate = useNavigate();
  const { projects, tasks } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const go = (path: string) => { setOpen(false); navigate(path); };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-xl overflow-hidden">
        <Command className="rounded-2xl">
          <CommandInput placeholder="Search projects, tasks, navigate…" />
          <CommandList className="max-h-[420px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigate">
              {[
                { label: "Dashboard", to: "/dashboard", Icon: LayoutDashboard },
                { label: "Projects", to: "/projects", Icon: FolderKanban },
                { label: "Tasks", to: "/tasks", Icon: ListChecks },
                { label: "Team", to: "/team", Icon: Users },
                { label: "Calendar", to: "/calendar", Icon: Calendar },
                { label: "Reports", to: "/reports", Icon: BarChart3 },
                { label: "Settings", to: "/settings", Icon: Settings },
              ].map((i) => (
                <CommandItem key={i.to} onSelect={() => go(i.to)}>
                  <i.Icon className="h-4 w-4 mr-2 text-muted-foreground" /> {i.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Projects">
              {projects.slice(0, 6).map((p) => (
                <CommandItem key={p.id} onSelect={() => go(`/projects/${p.id}`)}>
                  <span className="mr-2">{p.emoji}</span> {p.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Tasks">
              {tasks.slice(0, 6).map((t) => (
                <CommandItem key={t.id} onSelect={() => go(`/projects/${t.projectId}`)}>
                  <ListChecks className="h-4 w-4 mr-2 text-muted-foreground" /> {t.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
