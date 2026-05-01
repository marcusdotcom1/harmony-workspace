import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatar } from "@/components/UserAvatar";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { Moon, Sun } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { currentUser, theme, toggleTheme } = useApp();
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, preferences, and workspace</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="rounded-xl bg-muted/60">
          <TabsTrigger value="profile" className="rounded-lg">Profile</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg">Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-6">
            <div className="flex items-center gap-4">
              <UserAvatar user={currentUser ?? undefined} size={72} />
              <div>
                <div className="font-display text-lg font-semibold">{currentUser?.name}</div>
                <div className="text-sm text-muted-foreground">{currentUser?.email}</div>
                <div className="mt-2"><RoleBadge role={currentUser?.role || "member"} /></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" /></div>
            </div>
            <Button className="bg-primary text-black border-0 hover:bg-primary/90 rounded-xl shadow-sm" onClick={() => toast.success("Profile updated")}>Save changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium flex items-center gap-2">
                  {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {theme === "dark" ? "Dark" : "Light"} theme
                </div>
                <p className="text-sm text-muted-foreground mt-1">Switch between light and dark color modes.</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-4">
            {["Email digests", "Task assignments", "Project updates", "Weekly reports"].map((label) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{label}</div>
                  <p className="text-sm text-muted-foreground">Receive notifications about {label.toLowerCase()}.</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
