import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Activity, Comment, Notification, Project, Task, User } from "@/types";
import { apiRequest } from "@/lib/api";

interface AppState {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  activities: Activity[];
  notifications: Notification[];
  theme: "light" | "dark";
  loading: boolean;
  login: (email: string, password: string, role?: User["role"]) => Promise<void>;
  signup: (name: string, email: string, password: string, role: User["role"]) => Promise<void>;
  logout: () => void;
  createProject: (p: Omit<Project, "id" | "createdAt">) => Promise<void>;
  updateProject: (id: string, p: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createTask: (t: Omit<Task, "id" | "createdAt">) => Promise<void>;
  updateTask: (id: string, t: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addComment: (taskId: string, text: string) => Promise<void>;
  inviteMember: (name: string, email: string, role: User["role"]) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  updateMemberRole: (id: string, role: User["role"]) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  toggleTheme: () => void;
}

type WorkspaceResponse = {
  users: User[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  activities: Activity[];
  notifications: Notification[];
};

type AuthResponse = { user: User };

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("orbit:theme") as "light" | "dark" | null) || "dark";
  });

  const applyWorkspace = useCallback((workspace: WorkspaceResponse) => {
    setUsers(workspace.users);
    setProjects(workspace.projects);
    setTasks(workspace.tasks);
    setComments(workspace.comments);
    setActivities(workspace.activities);
    setNotifications(workspace.notifications);
  }, []);

  const refreshWorkspace = useCallback(async () => {
    const workspace = await apiRequest<WorkspaceResponse>("/workspace");
    applyWorkspace(workspace);
  }, [applyWorkspace]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("orbit:theme", theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        const [{ user }, workspace] = await Promise.all([
          apiRequest<{ user: User }>("/auth/me"),
          apiRequest<WorkspaceResponse>("/workspace"),
        ]);
        if (cancelled) return;
        setCurrentUser(user);
        applyWorkspace(workspace);
      } catch {
        if (!cancelled) {
          setCurrentUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [applyWorkspace]);

  const login: AppState["login"] = async (email, password) => {
    const { user } = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setCurrentUser(user);
    await refreshWorkspace();
  };

  const signup: AppState["signup"] = async (name, email, password, role) => {
    const { user } = await apiRequest<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
    setCurrentUser(user);
    await refreshWorkspace();
  };

  const logout = () => {
    apiRequest<void>("/auth/logout", { method: "POST" }).catch(() => undefined);
    setCurrentUser(null);
    setUsers([]);
    setProjects([]);
    setTasks([]);
    setComments([]);
    setActivities([]);
    setNotifications([]);
  };

  const createProject: AppState["createProject"] = async (p) => {
    const { project } = await apiRequest<{ project: Project }>("/projects", {
      method: "POST",
      body: JSON.stringify(p),
    });
    setProjects((prev) => [project, ...prev]);
    await refreshWorkspace();
  };

  const updateProject: AppState["updateProject"] = async (id, p) => {
    const { project } = await apiRequest<{ project: Project }>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(p),
    });
    setProjects((prev) => prev.map((x) => (x.id === id ? project : x)));
  };

  const deleteProject: AppState["deleteProject"] = async (id) => {
    await apiRequest<void>(`/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((x) => x.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
  };

  const createTask: AppState["createTask"] = async (t) => {
    const { task } = await apiRequest<{ task: Task }>("/tasks", {
      method: "POST",
      body: JSON.stringify(t),
    });
    setTasks((prev) => [task, ...prev]);
    await refreshWorkspace();
  };

  const updateTask: AppState["updateTask"] = async (id, t) => {
    const { task } = await apiRequest<{ task: Task }>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(t),
    });
    setTasks((prev) => prev.map((x) => (x.id === id ? task : x)));
    await refreshWorkspace();
  };

  const deleteTask: AppState["deleteTask"] = async (id) => {
    await apiRequest<void>(`/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((x) => x.id !== id));
    setComments((prev) => prev.filter((c) => c.taskId !== id));
  };

  const addComment: AppState["addComment"] = async (taskId, text) => {
    const { comment } = await apiRequest<{ comment: Comment }>(`/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    setComments((prev) => [...prev, comment]);
    await refreshWorkspace();
  };

  const inviteMember: AppState["inviteMember"] = async (name, email, role) => {
    const { user } = await apiRequest<{ user: User }>("/team/invite", {
      method: "POST",
      body: JSON.stringify({ name, email, role }),
    });
    setUsers((prev) => [...prev, user]);
  };

  const removeMember: AppState["removeMember"] = async (id) => {
    await apiRequest<void>(`/team/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const updateMemberRole: AppState["updateMemberRole"] = async (id, role) => {
    const { user } = await apiRequest<{ user: User }>(`/team/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    setUsers((prev) => prev.map((u) => (u.id === id ? user : u)));
  };

  const markNotificationRead: AppState["markNotificationRead"] = async (id) => {
    const { notification } = await apiRequest<{ notification: Notification }>(`/notifications/${id}/read`, {
      method: "PATCH",
    });
    setNotifications((prev) => prev.map((n) => (n.id === id ? notification : n)));
  };

  const markAllNotificationsRead = async () => {
    const { notifications: next } = await apiRequest<{ notifications: Notification[] }>("/notifications/read-all", {
      method: "PATCH",
    });
    setNotifications(next);
  };

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const value = useMemo<AppState>(() => ({
    currentUser, users, projects, tasks, comments, activities, notifications, theme, loading,
    login, signup, logout, createProject, updateProject, deleteProject,
    createTask, updateTask, deleteTask, addComment,
    inviteMember, removeMember, updateMemberRole,
    markNotificationRead, markAllNotificationsRead, toggleTheme,
  }), [currentUser, users, projects, tasks, comments, activities, notifications, theme, loading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
