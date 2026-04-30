import { cn } from "@/lib/utils";
import { Crown, User as UserIcon } from "lucide-react";
import { Role } from "@/types";

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const isAdmin = role === "admin";
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
      isAdmin
        ? "bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 text-primary border-primary/30"
        : "bg-muted text-muted-foreground border-border",
      className
    )}>
      {isAdmin ? <Crown className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
      {isAdmin ? "Admin" : "Member"}
    </span>
  );
}
