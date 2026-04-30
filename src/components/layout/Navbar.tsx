import { useLocation, useNavigate, Link } from "react-router-dom";
import { Bell, Check, ChevronRight, LogOut, Menu, Moon, Search, Settings, Sun, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";
import { UserAvatar } from "@/components/UserAvatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const labels: Record<string, string> = {
  dashboard: "Dashboard", projects: "Projects", tasks: "Tasks", team: "Team",
  calendar: "Calendar", reports: "Reports", settings: "Settings",
};

export function Navbar({ onMenuClick, onSearchClick }: { onMenuClick: () => void; onSearchClick: () => void }) {
  const { currentUser, logout, theme, toggleTheme, notifications, markAllNotificationsRead, markNotificationRead } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="h-full px-4 md:px-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Workspace</Link>
          {segments.map((seg, i) => (
            <span key={seg + i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className={cn("capitalize", i === segments.length - 1 ? "font-medium" : "text-muted-foreground")}>
                {labels[seg] || seg}
              </span>
            </span>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <button
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2 h-9 w-72 rounded-xl border border-border bg-muted/40 px-3 text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <Search className="h-4 w-4" />
          <span>Search anything…</span>
          <kbd className="ml-auto text-[10px] font-medium border rounded px-1.5 py-0.5 bg-background">⌘K</kbd>
        </button>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onSearchClick}>
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="h-[18px] w-[18px]" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 ring-2 ring-background" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="font-semibold text-sm">Notifications</div>
              {unread > 0 && (
                <button onClick={markAllNotificationsRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">You're all caught up</div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id} onClick={() => markNotificationRead(n.id)}
                    className={cn("w-full text-left p-3 border-b last:border-0 hover:bg-muted/50 transition-colors", !n.read && "bg-primary/5")}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("h-2 w-2 rounded-full mt-1.5 shrink-0", !n.read ? "bg-primary" : "bg-transparent")} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{n.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{n.description}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl hover:bg-muted px-1.5 py-1 transition-colors">
              <UserAvatar user={currentUser ?? undefined} size={32} />
              <div className="hidden lg:block text-left">
                <div className="text-sm font-medium leading-tight">{currentUser?.name}</div>
                <div className="text-[11px] text-muted-foreground capitalize">{currentUser?.role}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <UserAvatar user={currentUser ?? undefined} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{currentUser?.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{currentUser?.email}</div>
                </div>
              </div>
              <div className="mt-2"><RoleBadge role={currentUser?.role || "member"} /></div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}><UserIcon className="h-4 w-4 mr-2" /> Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}><Settings className="h-4 w-4 mr-2" /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); navigate("/login"); }} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
