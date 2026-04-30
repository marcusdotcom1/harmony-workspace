import { useApp } from "@/store/AppContext";
import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Reports() {
  const { tasks, projects, users } = useApp();

  const trend = [
    { week: "W1", tasks: 12 }, { week: "W2", tasks: 18 }, { week: "W3", tasks: 22 },
    { week: "W4", tasks: 27 }, { week: "W5", tasks: 25 }, { week: "W6", tasks: 31 }, { week: "W7", tasks: 35 },
  ];

  const byPriority = ["urgent", "high", "medium", "low"].map((p) => ({
    name: p, value: tasks.filter((t) => t.priority === p).length,
  }));
  const colors = ["#f43f5e", "#f97316", "#0ea5e9", "#94a3b8"];

  const memberLoad = users.slice(0, 6).map((u) => ({
    name: u.name.split(" ")[0],
    tasks: tasks.filter((t) => t.assigneeId === u.id).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">Insights across {projects.length} projects and {tasks.length} tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="font-semibold mb-4">Completed tasks trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="area1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Area type="monotone" dataKey="tasks" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#area1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="font-semibold mb-4">By priority</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={byPriority} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2}>
                {byPriority.map((_, i) => <Cell key={i} fill={colors[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="font-semibold mb-4">Team workload</h3>
          <div className="space-y-3">
            {memberLoad.map((m) => {
              const max = Math.max(...memberLoad.map((x) => x.tasks), 1);
              const pct = (m.tasks / max) * 100;
              return (
                <div key={m.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-muted-foreground">{m.tasks} tasks</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
