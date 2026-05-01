import { motion } from "framer-motion";
import { Calendar, MessageSquare, MoreHorizontal } from "lucide-react";
import { Task, User } from "@/types";
import { UserAvatar } from "@/components/UserAvatar";
import { PriorityBadge } from "@/components/badges/PriorityBadge";
import { format, isPast } from "date-fns";
import { cn } from "@/lib/utils";

export function TaskCard({
  task, assignee, onClick, draggable = true, onDragStart, comments = 0,
}: {
  task: Task; assignee?: User; onClick?: () => void;
  draggable?: boolean; onDragStart?: (e: React.DragEvent) => void; comments?: number;
}) {
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && isPast(due) && task.status !== "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="group cursor-pointer rounded-xl glass p-3.5 hover:border-primary/30 hover:shadow-sm transition-all"
      {...({ draggable, onDragStart } as any)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium leading-snug line-clamp-2">{task.title}</h4>
        <button onClick={(e) => { e.stopPropagation(); }} className="p-0.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
      {task.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          {comments > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <MessageSquare className="h-3 w-3" /> {comments}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {due && (
            <span className={cn("text-[11px] flex items-center gap-1", overdue ? "text-destructive font-medium" : "text-muted-foreground")}>
              <Calendar className="h-3 w-3" /> {format(due, "MMM d")}
            </span>
          )}
          {assignee && <UserAvatar user={assignee} size={22} />}
        </div>
      </div>
    </motion.div>
  );
}
