import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Activity, Comment, Notification, Project, Task, User } from "@/types";
import { mockActivities, mockNotifications, mockProjects, mockTasks, mockUsers } from "@/data/mockData";

interface AppState {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  activities: Activity[];
  notifications: Notification[];
  theme: "light" | "dark";
  // auth
  login: (email: string, role?: User["role"]) => void;
  signup: (name: string, email: string, role: User["role"]) => void;
  logout: () => void;
  // projects
  createProject: (p: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  // tasks
  createTask: (t: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  // comments
  addComment: (taskId: string, text: string) => void;
  // team
  inviteMember: (name: string, email: string, role: User["role"]) => void;
  removeMember: (id: string) => void;
  updateMemberRole: (id: string, role: User["role"]) => void;
  // notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  // theme
  toggleTheme: () => void;
}

const AppContext = createContext<AppState | null>(null);

const colors = [
  "from-violet-500 to-fuchsia-500", "from-sky-500 to-cyan-400", "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400", "from-pink-500 to-rose-400", "from-indigo-500 to-blue-400",
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("plane:user");
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("orbit:theme", theme);
  }, [theme]);

  useEffect(() => {
    if (currentUser) localStorage.setItem("plane:user", JSON.stringify(currentUser));
    else localStorage.removeItem("plane:user");
  }, [currentUser]);

  const pushActivity = useCallback((action: string, target: string, projectId?: string) => {
    setActivities((prev) => [{
      id: `a${Date.now()}`, userId: currentUser?.id || "u1", action, target, projectId,
      createdAt: new Date().toISOString(),
    }, ...prev]);
  }, [currentUser]);

  const login: AppState["login"] = (email, role = "admin") => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) { setCurrentUser(found); return; }
    const u: User = {
      id: `u${Date.now()}`, name: email.split("@")[0], email, role,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setUsers((prev) => [...prev, u]);
    setCurrentUser(u);
  };

  const signup: AppState["signup"] = (name, email, role) => {
    const u: User = {
      id: `u${Date.now()}`, name, email, role,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setUsers((prev) => [...prev, u]);
    setCurrentUser(u);
  };

  const logout = () => setCurrentUser(null);

  const createProject: AppState["createProject"] = (p) => {
    const np: Project = { ...p, id: `p${Date.now()}`, createdAt: new Date().toISOString() };
    setProjects((prev) => [np, ...prev]);
    pushActivity("created project", np.name, np.id);
  };
  const updateProject: AppState["updateProject"] = (id, p) =>
    setProjects((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const deleteProject: AppState["deleteProject"] = (id) => {
    setProjects((prev) => prev.filter((x) => x.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
  };

  const createTask: AppState["createTask"] = (t) => {
    const nt: Task = { ...t, id: `t${Date.now()}`, createdAt: new Date().toISOString() };
    setTasks((prev) => [nt, ...prev]);
    pushActivity("created task", nt.title, nt.projectId);
  };
  const updateTask: AppState["updateTask"] = (id, t) => {
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, ...t } : x)));
    if (t.status) {
      const task = tasks.find((x) => x.id === id);
      if (task) pushActivity(`moved to ${t.status.replace("_", " ")}`, task.title, task.projectId);
    }
  };
  const deleteTask: AppState["deleteTask"] = (id) =>
    setTasks((prev) => prev.filter((x) => x.id !== id));

  const addComment: AppState["addComment"] = (taskId, text) => {
    if (!currentUser) return;
    setComments((prev) => [...prev, {
      id: `c${Date.now()}`, taskId, authorId: currentUser.id, text, createdAt: new Date().toISOString(),
    }]);
  };

  const inviteMember: AppState["inviteMember"] = (name, email, role) => {
    setUsers((prev) => [...prev, {
      id: `u${Date.now()}`, name, email, role, color: colors[Math.floor(Math.random() * colors.length)],
    }]);
  };
  const removeMember: AppState["removeMember"] = (id) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));
  const updateMemberRole: AppState["updateMemberRole"] = (id, role) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));

  const markNotificationRead: AppState["markNotificationRead"] = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllNotificationsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const value = useMemo<AppState>(() => ({
    currentUser, users, projects, tasks, comments, activities, notifications, theme,
    login, signup, logout, createProject, updateProject, deleteProject,
    createTask, updateTask, deleteTask, addComment,
    inviteMember, removeMember, updateMemberRole,
    markNotificationRead, markAllNotificationsRead, toggleTheme,
  }), [currentUser, users, projects, tasks, comments, activities, notifications, theme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
