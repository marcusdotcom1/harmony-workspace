import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/25 bg-[#0b1514] shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,hsl(168_94%_72%/0.28),transparent_34%)]" />
      <svg viewBox="0 0 40 40" className="relative h-[72%] w-[72%]" fill="none">
        <path
          d="M20 8.5c6.4 0 11.5 5.1 11.5 11.5S26.4 31.5 20 31.5 8.5 26.4 8.5 20 13.6 8.5 20 8.5Z"
          stroke="currentColor"
          strokeWidth="2.4"
          className="text-primary"
        />
        <path
          d="M10.5 24.5c5.4-8.8 13.5-12.3 22-9.8"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="text-primary/80"
        />
        <circle cx="28.5" cy="14.5" r="3.1" className="fill-primary" />
      </svg>
    </div>
  );
}
