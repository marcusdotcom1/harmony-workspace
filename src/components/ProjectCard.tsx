import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MoreHorizontal } from "lucide-react";
import { Project, Task, User } from "@/types";
import { AvatarStack } from "@/components/UserAvatar";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { PriorityBadge } from "@/components/badges/PriorityBadge";
import { ProgressBar } from "@/components/Progress";
import { format } from "date-fns";

export function ProjectCard({ project, members, tasks, index = 0 }: {
  project: Project; members: User[]; tasks: Task[]; index?: number;
}) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "completed").length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const due = new Date(project.dueDate);
  const isOverdue = due < new Date() && project.status !== "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/projects/${project.id}`}>
        <div className="relative overflow-hidden rounded-2xl glass p-5 glow-hover transition-all duration-300">
          <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-15 blur-2xl bg-gradient-to-br ${project.color}`} />
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-xl shadow-md shrink-0`}>
                  {project.emoji}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{project.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <StatusBadge status={project.status} kind="project" />
                    <PriorityBadge priority={project.priority} />
                  </div>
                </div>
              </div>
              <button onClick={(e) => e.preventDefault()} className="p-1 rounded-lg hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">{project.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{done}/{total} · {progress}%</span>
              </div>
              <ProgressBar value={progress} />
            </div>
            <div className="flex items-center justify-between">
              <AvatarStack users={members} size={26} />
              <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                <Calendar className="h-3.5 w-3.5" />
                {format(due, "MMM d, yyyy")}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
