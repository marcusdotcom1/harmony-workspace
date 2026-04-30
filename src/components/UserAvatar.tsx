import { cn } from "@/lib/utils";
import { User } from "@/types";

export function UserAvatar({ user, size = 32, className }: { user?: User; size?: number; className?: string }) {
  if (!user) {
    return <div className={cn("rounded-full bg-muted", className)} style={{ width: size, height: size }} />;
  }
  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className={cn("rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold ring-2 ring-background shrink-0", user.color, className)}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      title={user.name}
    >
      {initials}
    </div>
  );
}

export function AvatarStack({ users, max = 4, size = 28 }: { users: User[]; max?: number; size?: number }) {
  const visible = users.slice(0, max);
  const rest = users.length - visible.length;
  return (
    <div className="flex -space-x-2">
      {visible.map((u) => <UserAvatar key={u.id} user={u} size={size} />)}
      {rest > 0 && (
        <div
          className="rounded-full bg-muted text-muted-foreground font-semibold flex items-center justify-center ring-2 ring-background"
          style={{ width: size, height: size, fontSize: size * 0.38 }}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}
