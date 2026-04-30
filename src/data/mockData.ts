import { Activity, Notification, Project, Task, User } from "@/types";

export const mockUsers: User[] = [
  { id: "u1", name: "Alex Morgan", email: "alex@plane.app", role: "admin", color: "from-violet-500 to-fuchsia-500" },
  { id: "u2", name: "Jamie Chen", email: "jamie@plane.app", role: "member", color: "from-sky-500 to-cyan-400" },
  { id: "u3", name: "Priya Patel", email: "priya@plane.app", role: "member", color: "from-emerald-500 to-teal-400" },
  { id: "u4", name: "Marcus Lee", email: "marcus@plane.app", role: "member", color: "from-orange-500 to-amber-400" },
  { id: "u5", name: "Sofia Rossi", email: "sofia@plane.app", role: "admin", color: "from-pink-500 to-rose-400" },
  { id: "u6", name: "Liam O'Brien", email: "liam@plane.app", role: "member", color: "from-indigo-500 to-blue-400" },
  { id: "u7", name: "Yuki Tanaka", email: "yuki@plane.app", role: "member", color: "from-lime-500 to-green-400" },
];

const today = new Date();
const daysFromNow = (d: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + d);
  return date.toISOString();
};

export const mockProjects: Project[] = [
  {
    id: "p1", name: "Apollo Mobile App", description: "Cross-platform mobile rebuild with new design system and offline-first architecture.",
    status: "active", priority: "high", dueDate: daysFromNow(18),
    memberIds: ["u1", "u2", "u3", "u4"], ownerId: "u1", color: "from-violet-500 to-fuchsia-500", emoji: "🚀",
    createdAt: daysFromNow(-30),
  },
  {
    id: "p2", name: "Brand Refresh 2026", description: "New logo, marketing site, and brand guidelines roll-out across all touchpoints.",
    status: "active", priority: "medium", dueDate: daysFromNow(34),
    memberIds: ["u5", "u3", "u6"], ownerId: "u5", color: "from-pink-500 to-rose-500", emoji: "🎨",
    createdAt: daysFromNow(-22),
  },
  {
    id: "p3", name: "Data Platform v2", description: "Migrate analytics pipelines to streaming architecture with real-time dashboards.",
    status: "planning", priority: "urgent", dueDate: daysFromNow(60),
    memberIds: ["u1", "u4", "u7"], ownerId: "u1", color: "from-sky-500 to-cyan-500", emoji: "📊",
    createdAt: daysFromNow(-12),
  },
  {
    id: "p4", name: "Customer Onboarding", description: "Redesigned activation flow with interactive walkthroughs and contextual tips.",
    status: "active", priority: "high", dueDate: daysFromNow(7),
    memberIds: ["u2", "u3", "u5"], ownerId: "u5", color: "from-emerald-500 to-teal-500", emoji: "✨",
    createdAt: daysFromNow(-45),
  },
  {
    id: "p5", name: "Internal Tooling", description: "Admin dashboard for support and ops with audit logs and bulk actions.",
    status: "on_hold", priority: "low", dueDate: daysFromNow(90),
    memberIds: ["u4", "u6", "u7"], ownerId: "u1", color: "from-amber-500 to-orange-500", emoji: "🛠️",
    createdAt: daysFromNow(-60),
  },
  {
    id: "p6", name: "Q3 Marketing Campaign", description: "Multi-channel campaign for new feature launch with paid media plan.",
    status: "completed", priority: "medium", dueDate: daysFromNow(-5),
    memberIds: ["u5", "u2", "u6"], ownerId: "u5", color: "from-indigo-500 to-purple-500", emoji: "📣",
    createdAt: daysFromNow(-90),
  },
];

const taskTitles = [
  "Design system tokens audit", "Implement OAuth providers", "Refactor data layer", "Write E2E tests",
  "User research interviews", "Create landing page hero", "Wire up notifications", "Add dark mode support",
  "Optimize bundle size", "Set up CI/CD pipeline", "Migration plan for v2 API", "Performance benchmark report",
  "Onboarding email sequence", "A/B test pricing page", "Build analytics dashboard", "Customer support macros",
  "Accessibility audit", "Mobile push notifications", "Refresh icon library", "Stripe integration",
  "Roadmap doc Q4", "Investor deck update", "Recruit senior engineer", "Sales enablement materials",
];

const statuses: Task["status"][] = ["todo", "in_progress", "in_review", "completed"];
const priorities: Task["priority"][] = ["low", "medium", "high", "urgent"];

export const mockTasks: Task[] = taskTitles.flatMap((title, i) => {
  const project = mockProjects[i % mockProjects.length];
  return [{
    id: `t${i + 1}`,
    projectId: project.id,
    title,
    description: "Detailed scope and acceptance criteria to ensure the team is aligned on the outcome.",
    status: statuses[i % 4],
    priority: priorities[(i + 1) % 4],
    assigneeId: project.memberIds[i % project.memberIds.length],
    dueDate: daysFromNow(((i % 14) - 3) * 2),
    createdAt: daysFromNow(-i),
  }];
});

export const mockActivities: Activity[] = [
  { id: "a1", userId: "u2", action: "completed task", target: "Implement OAuth providers", projectId: "p1", createdAt: daysFromNow(-0.1) },
  { id: "a2", userId: "u3", action: "commented on", target: "Onboarding email sequence", projectId: "p4", createdAt: daysFromNow(-0.3) },
  { id: "a3", userId: "u1", action: "created project", target: "Data Platform v2", projectId: "p3", createdAt: daysFromNow(-0.6) },
  { id: "a4", userId: "u5", action: "assigned task to Jamie", target: "Customer support macros", projectId: "p4", createdAt: daysFromNow(-1) },
  { id: "a5", userId: "u4", action: "moved to In Review", target: "Refactor data layer", projectId: "p1", createdAt: daysFromNow(-1.2) },
  { id: "a6", userId: "u6", action: "uploaded file to", target: "Brand Refresh 2026", projectId: "p2", createdAt: daysFromNow(-2) },
  { id: "a7", userId: "u7", action: "joined project", target: "Internal Tooling", projectId: "p5", createdAt: daysFromNow(-2.5) },
];

export const mockNotifications: Notification[] = [
  { id: "n1", title: "Task assigned to you", description: "Sofia assigned 'Wire up notifications' to you", read: false, createdAt: daysFromNow(-0.05), type: "task" },
  { id: "n2", title: "Deadline approaching", description: "Apollo Mobile App is due in 3 days", read: false, createdAt: daysFromNow(-0.5), type: "project" },
  { id: "n3", title: "New comment", description: "Priya commented on 'A/B test pricing page'", read: true, createdAt: daysFromNow(-1), type: "task" },
  { id: "n4", title: "Project completed", description: "Q3 Marketing Campaign was marked complete", read: true, createdAt: daysFromNow(-3), type: "project" },
];
