import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAvatar } from "@/components/UserAvatar";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { Mail, MoreVertical, Plus, Trash2, UserPlus } from "lucide-react";
import { Role } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Team() {
  const { users, projects, tasks, currentUser, inviteMember, removeMember, updateMemberRole } = useApp();
  const isAdmin = currentUser?.role === "admin";
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [role, setRole] = useState<Role>("member");
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const onInvite = () => {
    if (!name.trim() || !email.trim()) { toast.error("Name and email required"); return; }
    inviteMember(name.trim(), email.trim(), role);
    toast.success(`Invitation sent to ${email}`);
    setOpen(false); setName(""); setEmail(""); setRole("member");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground mt-1">{users.length} members in your workspace</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setOpen(true)} className="bg-gradient-aurora text-white border-0 hover:opacity-90 rounded-xl shadow-glow">
            <UserPlus className="h-4 w-4 mr-1" /> Invite member
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u, i) => {
          const userProjects = projects.filter((p) => p.memberIds.includes(u.id));
          const userTasks = tasks.filter((t) => t.assigneeId === u.id);
          return (
            <motion.div key={u.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-card"
            >
              <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-15 blur-2xl bg-gradient-to-br ${u.color}`} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar user={u} size={52} />
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{u.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3" /> {u.email}
                      </div>
                      <div className="mt-1.5"><RoleBadge role={u.role} /></div>
                    </div>
                  </div>
                  {isAdmin && u.id !== currentUser?.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg hover:bg-muted">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { updateMemberRole(u.id, u.role === "admin" ? "member" : "admin"); toast.success("Role updated"); }}>
                          Make {u.role === "admin" ? "Member" : "Admin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setConfirmRemove(u.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-muted/60 p-2.5">
                    <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Projects</div>
                    <div className="text-lg font-display font-bold">{userProjects.length}</div>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-2.5">
                    <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Tasks</div>
                    <div className="text-lg font-display font-bold">{userTasks.length}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-display flex items-center gap-2"><UserPlus className="h-5 w-5" /> Invite member</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="rounded-xl" /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" className="rounded-xl" /></div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onInvite} className="bg-gradient-aurora text-white border-0 hover:opacity-90"><Plus className="h-4 w-4 mr-1" /> Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmRemove} onOpenChange={(b) => !b && setConfirmRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>They'll lose access to all projects in this workspace.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (confirmRemove) { removeMember(confirmRemove); toast.success("Member removed"); } setConfirmRemove(null); }}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
