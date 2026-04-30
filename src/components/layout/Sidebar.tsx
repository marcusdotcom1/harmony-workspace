import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3, Calendar, FolderKanban, LayoutDashboard, ListChecks,
  Settings, Users, ChevronLeft, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";

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
          <div className="h-9 w-9 rounded-xl bg-gradient-aurora flex items-center justify-center shadow-glow shrink-0">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <div className="font-display font-bold text-base leading-none">Plane</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Workspace</div>
            </div>
          )}
        </NavLink>
        {!mobile && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
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
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-xl bg-gradient-aurora shadow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-[18px] w-[18px] shrink-0 relative z-10")} />
                {(!collapsed || mobile) && <span className="relative z-10">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Upgrade card */}
      {(!collapsed || mobile) && (
        <div className="p-3">
          <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-aurora text-white shadow-glow">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/20 blur-2xl" />
            <div className="relative">
              <div className="text-sm font-semibold mb-1">Upgrade to Pro</div>
              <p className="text-xs text-white/85 mb-3">Unlimited projects, advanced reports & priority support.</p>
              <Button size="sm" variant="secondary" className="h-7 text-xs bg-white text-primary hover:bg-white/90 border-0">
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
