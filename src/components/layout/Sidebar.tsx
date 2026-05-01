import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3, Calendar, FolderKanban, LayoutDashboard, ListChecks,
  Settings, Users, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/AppContext";
import { BrandMark } from "@/components/BrandMark";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/team", label: "Team", icon: Users, adminOnly: true },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ collapsed, setCollapsed, mobile, onClose }: {
  collapsed: boolean; setCollapsed: (b: boolean) => void; mobile?: boolean; onClose?: () => void;
}) {
  const { pathname } = useLocation();
  const { currentUser } = useApp();
  const isAdmin = currentUser?.role === "admin";

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed && !mobile ? 76 : 260 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        "h-screen sticky top-0 z-40 shrink-0 border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl",
        "flex flex-col",
        mobile && "w-[280px]"
      )}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 min-w-0" onClick={onClose}>
          <BrandMark className="h-9 w-9" />
          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <div className="font-display font-bold text-base leading-none tracking-tight">ORBIT</div>
              <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.18em]">Workspace</div>
            </div>
          )}
        </NavLink>
        {!mobile && (
          <button className="h-7 w-7 rounded-md hover:bg-white/5 inline-flex items-center justify-center" onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        <div className="space-y-1">
          {items.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to} to={item.to} onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("h-[18px] w-[18px] shrink-0 relative z-10")} />
                {(!collapsed || mobile) && <span className="relative z-10">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </motion.aside>
  );
}
