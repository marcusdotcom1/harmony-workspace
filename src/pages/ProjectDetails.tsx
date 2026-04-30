import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/store/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, LayoutGrid, List, Plus, Settings as SettingsIcon, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { PriorityBadge } from "@/components/badges/PriorityBadge";
import { AvatarStack, UserAvatar } from "@/components/UserAvatar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskModal } from "@/components/TaskModal";
import { Task, TaskStatus } from "@/types";
import { ProgressRing } from "@/components/Progress";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, users, currentUser, activities, updateTask, deleteProject } = useApp();
  const project = projects.find((p) => p.id === id);
  const isAdmin = currentUser?.role === "admin";

  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [taskOpen, setTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");

  const projectTasks = useMemo(() => tasks.filter((t) => t.projectId === id), [tasks, id]);
  const members = useMemo(() => project ? users.filter((u) => project.memberIds.includes(u.id)) : [], [project, users]);
  const projectActivities = useMemo(() => activities.filter((a) => a.projectId === id), [activities, id]);

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <Link to="/projects" className="text-primary mt-2 inline-block">Back to projects</Link>
      </div>
    );
  }

  const completed = projectTasks.filter((t) => t.status === "completed").length;
  const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;

  const openNewTask = (status: TaskStatus = "todo") => {
    setEditingTask(null); setDefaultStatus(status); setTaskOpen(true);
  };
  const openEditTask = (t: Task) => { setEditingTask(t); setTaskOpen(true); };

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to projects
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-card"
      >
        <div className={`absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-20 blur-3xl bg-gradient-to-br ${project.color}`} />
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4 min-w-0">
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center text-3xl shadow-glow shrink-0`}>{project.emoji}</div>
            <div className="min-w-0">
              <h1 className="font-display text-2xl md:text-3xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground mt-1.5 max-w-2xl">{project.description}</p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <StatusBadge status={project.status} kind="project" />
                <PriorityBadge priority={project.priority} />
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Due {format(new Date(project.dueDate), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing value={progress} size={72} stroke={7} />
            {isAdmin && (
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="rounded-xl">
                  <SettingsIcon className="h-3.5 w-3.5 mr-1" /> Settings
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl">
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                      <AlertDialogDescription>This permanently removes the project and all of its {projectTasks.length} tasks.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => { deleteProject(project.id); toast.success("Project deleted"); navigate("/projects"); }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="tasks">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <TabsList className="rounded-xl bg-muted/60">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="tasks" className="rounded-lg">Tasks</TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg">Team</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg">Activity</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="flex p-1 rounded-xl bg-muted/60 border border-border/60">
              <button onClick={() => setView("kanban")} className={`p-1.5 rounded-lg ${view === "kanban" ? "bg-background shadow-sm-soft" : "text-muted-foreground"}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setView("list")} className={`p-1.5 rounded-lg ${view === "list" ? "bg-background shadow-sm-soft" : "text-muted-foreground"}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
            {isAdmin && (
              <Button onClick={() => openNewTask()} className="bg-gradient-aurora text-white border-0 hover:opacity-90 rounded-xl">
                <Plus className="h-4 w-4 mr-1" /> Task
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="overview" className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="text-sm text-muted-foreground">Tasks</div>
            <div className="text-2xl font-display font-bold mt-1">{completed}/{projectTasks.length}</div>
            <div className="text-xs text-muted-foreground mt-1">{progress}% complete</div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="text-sm text-muted-foreground">Team</div>
            <div className="text-2xl font-display font-bold mt-1">{members.length}</div>
            <div className="mt-2"><AvatarStack users={members} size={26} /></div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="text-sm text-muted-foreground">Health</div>
            <div className="text-2xl font-display font-bold mt-1 capitalize">{progress > 60 ? "On track" : progress > 30 ? "At risk" : "Behind"}</div>
            <div className={`text-xs mt-1 ${progress > 60 ? "text-success" : progress > 30 ? "text-warning" : "text-destructive"}`}>
              {progress > 60 ? "Looking great" : progress > 30 ? "Needs attention" : "Action required"}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          {view === "kanban" ? (
            <KanbanBoard
              tasks={projectTasks} users={users}
              onTaskClick={openEditTask}
              onMove={(id, status) => { updateTask(id, { status }); toast.success("Task moved"); }}
              onAddTask={isAdmin ? openNewTask : undefined}
            />
          ) : (
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="text-left p-3 font-medium">Task</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Status</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Priority</th>
                    <th className="text-left p-3 font-medium hidden lg:table-cell">Due</th>
                    <th className="text-left p-3 font-medium">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTasks.map((t) => {
                    const a = users.find((u) => u.id === t.assigneeId);
                    return (
                      <tr key={t.id} onClick={() => openEditTask(t)} className="border-t border-border/60 hover:bg-muted/40 cursor-pointer transition-colors">
                        <td className="p-3 font-medium">{t.title}</td>
                        <td className="p-3 hidden md:table-cell"><StatusBadge status={t.status} /></td>
                        <td className="p-3 hidden md:table-cell"><PriorityBadge priority={t.priority} /></td>
                        <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">{t.dueDate ? format(new Date(t.dueDate), "MMM d") : "—"}</td>
                        <td className="p-3">{a ? <UserAvatar user={a} size={26} /> : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((u) => {
              const userTasks = projectTasks.filter((t) => t.assigneeId === u.id);
              return (
                <div key={u.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={u} size={48} />
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{u.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{userTasks.length} tasks</span>
                    <span>{userTasks.filter((t) => t.status === "completed").length} done</span>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <div className="space-y-4">
              {projectActivities.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No activity yet.</p>}
              {projectActivities.map((a) => {
                const user = users.find((u) => u.id === a.userId);
                return (
                  <div key={a.id} className="flex items-start gap-3 relative pl-6">
                    <div className="absolute left-2 top-2 bottom-0 w-px bg-border" />
                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-gradient-aurora ring-4 ring-background" />
                    <div className="flex items-start gap-3 flex-1">
                      <UserAvatar user={user} size={32} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{user?.name}</span>{" "}
                          <span className="text-muted-foreground">{a.action}</span>{" "}
                          <span className="font-medium">{a.target}</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <TaskModal open={taskOpen} onOpenChange={setTaskOpen} projectId={project.id} task={editingTask} defaultStatus={defaultStatus} />
    </div>
  );
}
