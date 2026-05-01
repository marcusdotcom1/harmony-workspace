import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/store/AppContext";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { UserAvatar } from "./UserAvatar";
import { format } from "date-fns";
import { MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean; onOpenChange: (b: boolean) => void;
  projectId: string; task?: Task | null; defaultStatus?: TaskStatus;
}

export function TaskModal({ open, onOpenChange, projectId, task, defaultStatus = "todo" }: Props) {
  const { users, currentUser, createTask, updateTask, deleteTask, comments, addComment } = useApp();
  const isAdmin = currentUser?.role === "admin";
  const isEdit = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [dueDate, setDueDate] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title); setDescription(task.description || "");
      setStatus(task.status); setPriority(task.priority);
      setAssigneeId(task.assigneeId || "");
      setDueDate(task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "");
    } else {
      setTitle(""); setDescription(""); setStatus(defaultStatus); setPriority("medium");
      setAssigneeId(""); setDueDate("");
    }
  }, [task, open, defaultStatus]);

  const taskComments = task ? comments.filter((c) => c.taskId === task.id) : [];

  const onSave = () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    const payload = {
      projectId, title: title.trim(), description: description.trim(),
      status, priority, assigneeId: assigneeId || undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };
    if (isEdit && task) { updateTask(task.id, payload); toast.success("Task updated"); }
    else { createTask(payload); toast.success("Task created"); }
    onOpenChange(false);
  };

  const onDelete = () => {
    if (!task) return;
    deleteTask(task.id);
    toast.success("Task deleted");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-display">{isEdit ? "Edit task" : "Create task"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update the task details below." : "Add a new task to your project."}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" disabled={isEdit && !isAdmin} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add more details…" rows={4} disabled={isEdit && !isAdmin} className="rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)} disabled={isEdit && !isAdmin}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Assignee</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId} disabled={isEdit && !isAdmin}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      <span className="flex items-center gap-2"><UserAvatar user={u} size={20} />{u.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Due date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={isEdit && !isAdmin} className="rounded-xl" />
            </div>
          </div>

          {isEdit && (
            <div className="pt-2">
              <Label className="flex items-center gap-2 mb-2"><MessageSquare className="h-4 w-4" /> Comments ({taskComments.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin mb-3">
                {taskComments.map((c) => {
                  const author = users.find((u) => u.id === c.authorId);
                  return (
                    <div key={c.id} className="flex gap-2.5 p-2.5 rounded-lg bg-muted/50">
                      <UserAvatar user={author} size={28} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-medium">{author?.name}</span>
                          <span className="text-[10px] text-muted-foreground">{format(new Date(c.createdAt), "MMM d, h:mm a")}</span>
                        </div>
                        <p className="text-sm">{c.text}</p>
                      </div>
                    </div>
                  );
                })}
                {taskComments.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No comments yet.</p>}
              </div>
              <div className="flex gap-2">
                <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment…" className="rounded-xl"
                  onKeyDown={(e) => { if (e.key === "Enter" && newComment.trim() && task) { addComment(task.id, newComment.trim()); setNewComment(""); } }} />
                <Button onClick={() => { if (newComment.trim() && task) { addComment(task.id, newComment.trim()); setNewComment(""); } }} className="rounded-xl">Post</Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between">
          <div>
            {isEdit && isAdmin && (
              <Button variant="ghost" onClick={onDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={onSave} className="bg-primary text-black border-0 hover:bg-primary/90 shadow-none">
              {isEdit ? "Save changes" : "Create task"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
