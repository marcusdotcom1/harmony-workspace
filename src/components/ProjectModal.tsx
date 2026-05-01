import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/store/AppContext";
import { TaskPriority, ProjectStatus } from "@/types";
import { toast } from "sonner";

const colors = [
  { v: "from-violet-500 to-fuchsia-500", emoji: "🚀" },
  { v: "from-sky-500 to-cyan-500", emoji: "📊" },
  { v: "from-emerald-500 to-teal-500", emoji: "✨" },
  { v: "from-pink-500 to-rose-500", emoji: "🎨" },
  { v: "from-amber-500 to-orange-500", emoji: "🛠️" },
  { v: "from-indigo-500 to-purple-500", emoji: "📣" },
];

const orbitColors = colors.map((_, index) => [
  { v: "from-teal-300 to-cyan-300", emoji: "O" },
  { v: "from-emerald-300 to-teal-300", emoji: "A" },
  { v: "from-cyan-300 to-blue-300", emoji: "D" },
  { v: "from-green-300 to-emerald-400", emoji: "S" },
  { v: "from-sky-300 to-teal-300", emoji: "P" },
  { v: "from-lime-300 to-cyan-300", emoji: "N" },
][index]);

export function ProjectModal({ open, onOpenChange }: { open: boolean; onOpenChange: (b: boolean) => void }) {
  const { createProject, currentUser, users } = useApp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planning");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [pick, setPick] = useState(0);

  const onSave = () => {
    if (!name.trim()) { toast.error("Project name is required"); return; }
    createProject({
      name: name.trim(), description: description.trim() || "No description yet.",
      status, priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
      memberIds: [currentUser!.id, ...users.slice(0, 2).map((u) => u.id)].filter((v, i, a) => a.indexOf(v) === i),
      ownerId: currentUser!.id,
      color: orbitColors[pick].v, emoji: orbitColors[pick].emoji,
    });
    toast.success("Project created");
    onOpenChange(false);
    setName(""); setDescription(""); setDueDate(""); setPick(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-display">New project</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Project name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mobile app v2" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this project about?" rows={3} className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Due date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Cover</Label>
            <div className="flex gap-2 flex-wrap">
              {orbitColors.map((c, i) => (
                <button key={i} onClick={() => setPick(i)}
                  className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${c.v} flex items-center justify-center text-xl shadow-sm transition-all ${pick === i ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105" : "hover:scale-105"}`}>
                  <span className="absolute inset-[3px] rounded-[0.65rem] border border-white/25 bg-black/15" />
                  <span className="relative">{c.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave} className="bg-primary text-black border-0 hover:bg-primary/90 shadow-none">Create project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
