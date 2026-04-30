import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:1000px_100%] animate-shimmer",
      className
    )} />
  );
}
