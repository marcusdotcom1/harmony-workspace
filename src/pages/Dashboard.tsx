import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/store/AppContext";
import { StatCard } from "@/components/StatCard";
import {
  Activity, AlertTriangle, CheckCircle2, Clock, FolderKanban, ListChecks, Plus, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectModal } from "@/components/ProjectModal";
import { ProgressRing } from "@/components/Progress";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie } from "recharts";
import { format, formatDistanceToNow, isPast, isThisWeek } from "date-fns";
import { Link } from "react-router-dom";
import { UserAvatar } from "@/components/UserAvatar";
import { StatusBadge } from "@/components/badges/StatusBadge";

export default function Dashboard() {
  const { tasks, projects, activities, users, currentUser } = useApp();
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status !== "completed").length;
    const overdue = tasks.filter((t) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "completed").length;
    return { total, completed, pending, overdue, projects: projects.length };
  }, [tasks, projects]);

  const chartData = [
    { day: "Mon", done: 4, created: 6 }, { day: "Tue", done: 6, created: 5 },
    { day: "Wed", done: 8, created: 7 }, { day: "Thu", done: 5, created: 9 },
    { day: "Fri", done: 11, created: 6 }, { day: "Sat", done: 3, created: 2 }, { day: "Sun", done: 2, created: 1 },
  ];
  const statusData = [
    { name: "Todo", value: tasks.filter((t) => t.status === "todo").length, color: "hsl(240 10% 60%)" },
    { name: "In Progress", value: tasks.filter((t) => t.status === "in_progress").length, color: "hsl(196 95% 60%)" },
    { name: "In Review", value: tasks.filter((t) => t.status === "in_review").length, color: "hsl(38 95% 55%)" },
    { name: "Completed", value: tasks.filter((t) => t.status === "completed").length, color: "hsl(152 70% 45%)" },
  ];

  const upcoming = useMemo(
    () => tasks
      .filter((t) => t.dueDate && t.status !== "completed" && isThisWeek(new Date(t.dueDate)))
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()).slice(0, 5),
    [tasks]
  );

  const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl glass-strong gradient-border p-6 md:p-8 shadow-glow"
      >
        <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl animate-glow-pulse" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-accent/25 blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs glass-pill px-3 py-1 rounded-full mb-3 text-muted-foreground">
              <Sparkles className="h-3 w-3 text-accent" /> {format(new Date(), "EEEE, MMMM d")}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text">Welcome back, {currentUser?.name.split(" ")[0]}</h1>
            <p className="text-muted-foreground mt-2 max-w-lg">Here's a snapshot of what's happening across your workspace today.</p>
          </div>
          <div className="flex items-center gap-3">
            {currentUser?.role === "admin" && (
              <Button onClick={() => setOpen(true)} className="bg-white text-black hover:bg-white/90 border-0 rounded-full px-5 h-11 font-medium">
                <Plus className="h-4 w-4 mr-1" /> New project
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={FolderKanban} label="Total projects" value={stats.projects} accent="primary" delta={{ value: 12, positive: true }} index={0} />
        <StatCard icon={ListChecks} label="Total tasks" value={stats.total} accent="accent" delta={{ value: 8, positive: true }} index={1} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} accent="success" delta={{ value: 24, positive: true }} index={2} />
        <StatCard icon={Clock} label="Pending" value={stats.pending} accent="warning" index={3} />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdue} accent="destructive" delta={{ value: 4, positive: false }} index={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Productivity this week</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Tasks completed vs created</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Completed</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> Created</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barCategoryGap={20}>
              <defs>
                <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="created" fill="hsl(var(--muted-foreground) / 0.3)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="done" fill="url(#bar1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status pie */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border/60 bg-card p-6 shadow-card"
        >
          <h3 className="font-semibold mb-1">Task status</h3>
          <p className="text-xs text-muted-foreground mb-3">Overall distribution</p>
          <div className="flex items-center justify-center my-3">
            <ProgressRing value={completionRate} size={120} stroke={10} />
          </div>
          <div className="space-y-2 mt-2">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming deadlines */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Upcoming this week</h3>
            <Link to="/tasks" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">Nothing due this week — you're ahead 🎉</div>
          ) : (
            <div className="space-y-2">
              {upcoming.map((t) => {
                const project = projects.find((p) => p.id === t.projectId);
                const assignee = users.find((u) => u.id === t.assigneeId);
                return (
                  <Link key={t.id} to={`/projects/${t.projectId}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors"
                  >
                    <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${project?.color} flex items-center justify-center text-base shrink-0`}>{project?.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{t.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{project?.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.status} />
                      <span className="text-xs text-muted-foreground hidden sm:block">{format(new Date(t.dueDate!), "EEE, MMM d")}</span>
                      {assignee && <UserAvatar user={assignee} size={26} />}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Activity */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border/60 bg-card p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Activity className="h-4 w-4" /> Recent activity</h3>
          </div>
          <div className="space-y-3">
            {activities.slice(0, 6).map((a) => {
              const user = users.find((u) => u.id === a.userId);
              return (
                <div key={a.id} className="flex items-start gap-2.5">
                  <UserAvatar user={user} size={28} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{user?.name}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <ProjectModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
