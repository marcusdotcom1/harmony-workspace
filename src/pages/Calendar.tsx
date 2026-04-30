import { useMemo, useState } from "react";
import { useApp } from "@/store/AppContext";
import { addDays, eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "@/components/badges/PriorityBadge";

export default function CalendarPage() {
  const { tasks, projects } = useApp();
  const [cursor, setCursor] = useState(new Date());

  const monthStart = startOfMonth(cursor);
  const days = useMemo(() => {
    const start = startOfWeek(monthStart, { weekStartsOn: 1 });
    const end = addDays(start, 41);
    return eachDayOfInterval({ start, end });
  }, [monthStart]);

  const tasksByDay = (d: Date) => tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), d));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">Visualize deadlines across all projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCursor(addDays(monthStart, -1))}><ChevronLeft className="h-4 w-4" /></Button>
          <div className="font-display text-lg font-semibold w-40 text-center">{format(cursor, "MMMM yyyy")}</div>
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCursor(addDays(endOfMonth(cursor), 1))}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="outline" className="rounded-xl ml-2" onClick={() => setCursor(new Date())}>Today</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-card">
        <div className="grid grid-cols-7 bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="p-3 text-center font-medium">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const dayTasks = tasksByDay(d);
            const isCurrentMonth = isSameMonth(d, cursor);
            const isToday = isSameDay(d, new Date());
            return (
              <div key={i} className={cn("min-h-[110px] p-2 border-t border-r border-border/60 text-xs space-y-1",
                !isCurrentMonth && "bg-muted/20 text-muted-foreground",
                (i + 1) % 7 === 0 && "border-r-0")}>
                <div className="flex items-center justify-between">
                  <div className={cn("h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold",
                    isToday && "bg-gradient-aurora text-white shadow-glow")}>{format(d, "d")}</div>
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((t) => {
                    const p = projects.find((p) => p.id === t.projectId);
                    return (
                      <div key={t.id} className={cn("text-[10px] px-1.5 py-1 rounded-md bg-gradient-to-r truncate text-white", p?.color)}>
                        {t.title}
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && <div className="text-[10px] text-muted-foreground">+{dayTasks.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
