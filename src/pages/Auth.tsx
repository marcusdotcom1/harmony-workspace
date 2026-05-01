import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Github, Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/AppContext";
import { BrandMark } from "@/components/BrandMark";
import { Role } from "@/types";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60).optional(),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

function AuthShell({ children, side }: { children: ReactNode; side: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 circuit-bg opacity-40" />
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/30 blur-[140px] animate-glow-pulse" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent/30 blur-[140px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative">
        <Link to="/" className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="glass-strong rounded-3xl p-8 md:p-10 gradient-border shadow-glow">
            {children}
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-aurora opacity-30 animate-aurora" />
        <div className="absolute inset-0 circuit-bg opacity-30" />
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-accent/40 blur-3xl animate-float-slow" style={{ animationDelay: "1.5s" }} />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <BrandMark className="h-10 w-10" />
            <span className="font-display font-bold text-xl tracking-tight">ORBIT</span>
          </Link>
          {side}
          <div className="text-xs text-white/60">© 2026 Orbit Labs · Crafted for productive teams</div>
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState("alex@orbit.app");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<Role>("admin");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login(email, password, role);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      side={
        <div className="space-y-6 max-w-md">
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight mb-3">Where teams ship faster, together.</h2>
            <p className="text-white/80">Orbit brings projects, tasks, and conversations into one elegant home.</p>
          </div>
          <ul className="space-y-2.5">
            {["Beautiful kanban boards", "Real-time team collaboration", "Smart deadlines & priorities", "Insightful analytics"].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <div className="mb-7 lg:hidden flex items-center gap-2">
        <BrandMark className="h-10 w-10" />
        <span className="font-display font-bold text-xl tracking-tight">ORBIT</span>
      </div>
      <h1 className="font-display text-3xl font-bold mb-2 gradient-text">Welcome back</h1>
      <p className="text-muted-foreground mb-7 text-sm">Sign in to continue to your workspace.</p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Button variant="outline" className="rounded-full h-11 bg-white/5 border-white/10 hover:bg-white/10" onClick={async () => { await login("alex@orbit.app", "demo1234", "admin"); navigate("/dashboard"); }}>
          <Github className="h-4 w-4 mr-2" /> GitHub
        </Button>
        <Button variant="outline" className="rounded-full h-11 bg-white/5 border-white/10 hover:bg-white/10" onClick={async () => { await login("alex@orbit.app", "demo1234", "admin"); navigate("/dashboard"); }}>
          <Mail className="h-4 w-4 mr-2" /> Google
        </Button>
      </div>

      <div className="relative my-5 text-center text-xs text-muted-foreground">
        <span className="relative z-10 px-3 bg-card/50">or with email</span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-full bg-white/5 border-white/10 px-5" />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-full bg-white/5 border-white/10 px-5" />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Demo role</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["admin", "member"] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`h-10 rounded-full border text-sm font-medium capitalize transition-all ${role === r ? "border-primary/60 bg-primary/15 text-foreground shadow-sm" : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-white text-black hover:bg-white/90 font-medium">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground mt-6 text-center">
        New to Orbit? <Link to="/signup" className="text-foreground font-medium hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function Signup() {
  const navigate = useNavigate();
  const { signup } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("admin");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ name, email, password });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await signup(name, email, password, role);
      toast.success("Account created - welcome!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Account creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      side={
        <div className="space-y-6 max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">Start free. Scale beautifully.</h2>
          <p className="text-white/80">Set up your workspace in seconds. No credit card required.</p>
        </div>
      }
    >
      <div className="mb-7 lg:hidden flex items-center gap-2">
        <BrandMark className="h-10 w-10" />
        <span className="font-display font-bold text-xl tracking-tight">ORBIT</span>
      </div>
      <h1 className="font-display text-3xl font-bold mb-2 gradient-text">Create your workspace</h1>
      <p className="text-muted-foreground mb-7 text-sm">Free for up to 5 teammates. Upgrade anytime.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="h-11 rounded-full bg-white/5 border-white/10 px-5" />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="h-11 rounded-full bg-white/5 border-white/10 px-5" />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="h-11 rounded-full bg-white/5 border-white/10 px-5" />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Your role</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["admin", "member"] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`h-10 rounded-full border text-sm font-medium capitalize transition-all ${role === r ? "border-primary/60 bg-primary/15 text-foreground shadow-sm" : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-white text-black hover:bg-white/90 font-medium">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground mt-6 text-center">
        Already have an account? <Link to="/login" className="text-foreground font-medium hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
