import { Link } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRight, Sparkles, LayoutDashboard, ListChecks, Users, BarChart3,
  Calendar, Shield, Zap, CheckCircle2, Star, FolderKanban, Activity, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: EASE },
};

/* Word-by-word reveal */
const wordContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.9 } },
};
const wordItem: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

function RevealWords({ text, className, gradient }: { text: string; className?: string; gradient?: boolean }) {
  return (
    <motion.span variants={wordContainer} initial="hidden" animate="show" className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-1">
          <motion.span variants={wordItem} className={`inline-block ${gradient ? "gradient-text" : ""}`}>
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* Curtain that lifts on first paint */
function IntroCurtain() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1100);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
          className="fixed inset-0 z-[100] pointer-events-none"
        >
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ delay: 0.55, duration: 0.9, ease: EASE }}
            className="absolute inset-0 bg-background"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 1.4] }}
            transition={{ duration: 1.1, times: [0, 0.25, 0.7, 1], ease: EASE }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-aurora shadow-glow animate-glow-pulse" />
              <span className="font-display font-bold tracking-tight text-2xl gradient-text">ORBIT</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Index() {
  const [email, setEmail] = useState("");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're on the list. Welcome aboard.");
    setEmail("");
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background text-foreground">
      <IntroCurtain />
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1.0, duration: 1.2 }}
          className="absolute inset-0 mesh-bg"
        />
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.2, duration: 1.2 }}
          className="absolute inset-0 circuit-bg"
        />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[680px] w-[1100px] rounded-full bg-primary/30 blur-[140px] animate-glow-pulse" />
        <div className="absolute top-[20%] right-[-10%] h-[420px] w-[420px] rounded-full bg-accent/30 blur-[120px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[60%] left-[-10%] h-[420px] w-[420px] rounded-full bg-fuchsia-500/25 blur-[120px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <Navbar />

      <Hero email={email} setEmail={setEmail} onSubmit={onSubmit} />
      <LogoCloud />
      <Features />
      <DashboardPreview />
      <Pricing />
      <CTA email={email} setEmail={setEmail} onSubmit={onSubmit} />
      <Footer />
    </div>
  );
}

/* ---------------- Navbar ---------------- */
function Navbar() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-5">
      <motion.div
        initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 1.1, ease: EASE }}
        className="mx-auto max-w-6xl flex items-center justify-between rounded-full glass px-4 py-2.5"
      >
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <div className="relative h-8 w-8 rounded-full bg-gradient-aurora flex items-center justify-center shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">ORBIT</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
          {[
            { l: "About", h: "#about" },
            { l: "Features", h: "#features" },
            { l: "Pricing", h: "#pricing" },
            { l: "Login", h: "/login", route: true },
          ].map((i) =>
            i.route ? (
              <Link key={i.l} to={i.h} className="px-3.5 py-1.5 rounded-full hover:text-foreground hover:bg-white/5 transition-colors">{i.l}</Link>
            ) : (
              <a key={i.l} href={i.h} className="px-3.5 py-1.5 rounded-full hover:text-foreground hover:bg-white/5 transition-colors">{i.l}</a>
            )
          )}
        </nav>

        <Link to="/signup">
          <Button className="rounded-full h-9 px-5 bg-white text-black hover:bg-white/90 font-medium">
            Get Started
          </Button>
        </Link>
      </motion.div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ email, setEmail, onSubmit }: { email: string; setEmail: (s: string) => void; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <section className="relative pt-20 pb-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2, ease: EASE }}
          className="inline-flex items-center gap-2 glass-pill rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-glow-pulse" />
          New · Real-time team collaboration is here
          <ArrowRight className="h-3 w-3" />
        </motion.div>

        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          <RevealWords text="Manage Projects, Teams," gradient />
          <br />
          <RevealWords text="and Tasks in One Workspace" gradient />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 1.9, ease: EASE }}
          className="text-lg text-muted-foreground mt-7 max-w-2xl mx-auto"
        >
          Create projects, assign tasks, track progress, and keep your team aligned with a beautifully organized, futuristic dashboard.
        </motion.p>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 2.1, ease: EASE }}
          className="mt-10 max-w-md mx-auto flex items-center gap-2 glass rounded-full p-1.5 pl-5"
        >
          <Input
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your work email"
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-10 px-0 placeholder:text-muted-foreground/70"
          />
          <Button type="submit" className="rounded-full h-10 px-5 bg-white text-black hover:bg-white/90 font-medium shrink-0">
            Get Early Access
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 0.6 }}
          className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Free 14-day trial</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> No credit card</span>
        </motion.div>
      </div>

      {/* Floating preview cards */}
      <FloatingCards />
    </section>
  );
}

function FloatingCards() {
  return (
    <div className="relative max-w-6xl mx-auto mt-24 h-[520px] md:h-[460px]">
      {/* Active Projects card (left) */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ delay: 2.3, duration: 0.9, ease: EASE }}
        className="absolute left-0 md:left-4 top-10 w-[260px] glass-strong rounded-3xl p-5 shadow-glow animate-float-slow"
      >
        <div className="text-xs text-muted-foreground">Active Projects</div>
        <div className="font-display text-3xl font-bold mt-1">24</div>
        <div className="mt-4 flex items-end gap-1.5 h-16">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 rounded-md bg-gradient-warm" style={{ height: `${h}%`, opacity: 0.3 + i * 0.1 }} />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          {["S","M","T","W","T","F","S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </motion.div>

      {/* Big Project Progress card (center) */}
      <motion.div
        initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.45, duration: 1.0, ease: EASE }}
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[340px] md:w-[440px] glass-strong rounded-3xl p-6 shadow-glow gradient-border"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-muted-foreground">Project Progress</div>
            <div className="font-display text-4xl md:text-5xl font-bold mt-1 gradient-text-warm">82%</div>
            <div className="text-xs text-muted-foreground mt-1">Atlas redesign · on track</div>
          </div>
          <span className="glass-pill rounded-full px-2.5 py-1 text-[10px] text-success">+12.6%</span>
        </div>
        <svg viewBox="0 0 400 100" className="w-full h-24 mt-2">
          <defs>
            <linearGradient id="line1" x1="0" x2="1">
              <stop offset="0" stopColor="hsl(280 90% 65%)" />
              <stop offset="1" stopColor="hsl(22 95% 60%)" />
            </linearGradient>
            <linearGradient id="line2" x1="0" x2="1">
              <stop offset="0" stopColor="hsl(320 95% 70% / 0.4)" />
              <stop offset="1" stopColor="hsl(22 95% 70% / 0.4)" />
            </linearGradient>
          </defs>
          <path d="M0,70 C40,50 80,80 120,55 C160,30 200,60 240,40 C280,20 320,55 400,30" stroke="url(#line1)" strokeWidth="2.5" fill="none" />
          <path d="M0,80 C40,70 80,75 120,65 C160,55 200,70 240,55 C280,45 320,60 400,50" stroke="url(#line2)" strokeWidth="2" fill="none" />
        </svg>
      </motion.div>

      {/* Assigned Tasks (right top) */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 5 }} animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ delay: 2.6, duration: 0.9, ease: EASE }}
        className="absolute right-0 md:right-6 top-6 w-[280px] glass-strong rounded-3xl p-5 shadow-glow animate-float-slow" style={{ animationDelay: "1.2s" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium">Assigned Tasks</div>
          <span className="text-[10px] text-muted-foreground">Today</span>
        </div>
        <div className="space-y-2.5">
          {[
            { t: "Design system audit", p: "High", c: "from-rose-500 to-pink-500" },
            { t: "API rate limiting", p: "Med", c: "from-amber-500 to-orange-500" },
            { t: "Onboarding copy", p: "Low", c: "from-sky-500 to-cyan-400" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-2.5">
              <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${t.c} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{t.t}</div>
                <div className="text-[10px] text-muted-foreground">{t.p} priority</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent activity (bottom right) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.75, duration: 0.9, ease: EASE }}
        className="absolute right-4 md:right-24 bottom-0 w-[280px] glass-strong rounded-3xl p-5 shadow-warm hidden md:block"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-accent" /> Team Activity</div>
          <span className="text-[10px] text-muted-foreground">Live</span>
        </div>
        <div className="space-y-2.5 text-xs">
          {[
            { n: "Maya", a: "completed", t: "Auth flow" },
            { n: "Leo", a: "moved", t: "Sprint 12 to review" },
            { n: "Ari", a: "commented on", t: "Pricing page" },
          ].map((x, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-full bg-gradient-aurora text-[10px] font-semibold flex items-center justify-center">{x.n[0]}</div>
              <div className="flex-1 min-w-0 truncate">
                <span className="font-medium">{x.n}</span> <span className="text-muted-foreground">{x.a}</span> <span>{x.t}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Overdue tasks chip (bottom left) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.9, duration: 0.8, ease: EASE }}
        className="absolute left-8 md:left-32 bottom-10 glass-strong rounded-2xl px-4 py-3 shadow-warm hidden md:flex items-center gap-3"
      >
        <div className="h-9 w-9 rounded-xl bg-gradient-warm flex items-center justify-center">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">Overdue tasks</div>
          <div className="text-sm font-semibold">3 need attention</div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- Logos ---------------- */
function LogoCloud() {
  const logos = ["NORTHWIND", "ACME", "LUMEN", "PIXELFORGE", "HALCYON", "VECTRA"];
  return (
    <section className="px-6 py-10">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Trusted by ambitious teams worldwide</p>
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
        {logos.map((l) => (
          <span key={l} className="font-display font-bold text-sm tracking-[0.2em] text-muted-foreground">{l}</span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */
function Features() {
  const items = [
    { icon: FolderKanban, title: "Beautiful Kanban", desc: "Drag-and-drop boards that make sprint planning feel effortless and fast." },
    { icon: ListChecks, title: "Smart Tasks", desc: "Priorities, deadlines, assignees, and dependencies — all elegantly organized." },
    { icon: Users, title: "Team Roles", desc: "Granular Admin and Member roles with permissions that scale with your team." },
    { icon: BarChart3, title: "Live Reports", desc: "Productivity charts, burndown, and progress rings — auto-updated in real time." },
    { icon: Calendar, title: "Deadline Sync", desc: "Calendar view with overdue alerts so nothing important slips through." },
    { icon: Shield, title: "Secure by Default", desc: "Enterprise-grade authentication and role-based access for peace of mind." },
  ];
  return (
    <section id="features" className="px-6 py-28 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex glass-pill rounded-full px-3 py-1 text-[11px] text-muted-foreground mb-4">FEATURES</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">Everything your team needs to ship</h2>
          <p className="text-muted-foreground mt-4">A complete toolkit for planning, executing, and tracking every project — without the chaos.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div key={it.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass rounded-3xl p-6 glow-hover gradient-border"
            >
              <div className="h-11 w-11 rounded-2xl bg-gradient-aurora flex items-center justify-center shadow-glow mb-4">
                <it.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-display text-lg font-semibold">{it.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Dashboard Preview ---------------- */
function DashboardPreview() {
  return (
    <section id="about" className="px-6 py-28 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex glass-pill rounded-full px-3 py-1 text-[11px] text-muted-foreground mb-4">DASHBOARD</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">A workspace as ambitious as your team</h2>
          <p className="text-muted-foreground mt-4">Get a complete view of projects, tasks, and team activity in one elegant dashboard.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-8 bg-gradient-aurora opacity-20 blur-3xl rounded-[3rem]" />
          <div className="relative glass-strong rounded-3xl p-4 md:p-6 shadow-glow">
            {/* Mock browser bar */}
            <div className="flex items-center gap-1.5 mb-4 px-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-[11px] text-muted-foreground">orbit.app/dashboard</span>
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* mini sidebar */}
              <div className="col-span-3 hidden md:flex flex-col gap-2 rounded-2xl bg-white/[0.02] border border-white/5 p-3">
                {[LayoutDashboard, FolderKanban, ListChecks, Users, BarChart3, Calendar].map((I, i) => (
                  <div key={i} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs ${i === 0 ? "bg-gradient-aurora text-white shadow-glow" : "text-muted-foreground"}`}>
                    <I className="h-3.5 w-3.5" /> <span>{["Dashboard","Projects","Tasks","Team","Reports","Calendar"][i]}</span>
                  </div>
                ))}
              </div>
              <div className="col-span-12 md:col-span-9 space-y-4">
                {/* stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { l: "Active Projects", v: "24", c: "from-violet-500 to-fuchsia-500" },
                    { l: "Tasks Open", v: "138", c: "from-sky-500 to-cyan-400" },
                    { l: "Completed", v: "412", c: "from-emerald-500 to-teal-400" },
                    { l: "Overdue", v: "3", c: "from-rose-500 to-pink-500" },
                  ].map((s, i) => (
                    <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/5 p-3">
                      <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${s.c} mb-2`} />
                      <div className="text-[10px] text-muted-foreground">{s.l}</div>
                      <div className="font-display text-xl font-bold">{s.v}</div>
                    </div>
                  ))}
                </div>
                {/* chart row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/5 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-xs font-medium">Task Completion Trend</div>
                      <span className="text-[10px] text-muted-foreground">Last 30 days</span>
                    </div>
                    <div className="flex items-end gap-2 h-28">
                      {[35, 55, 40, 70, 50, 80, 60, 90, 65, 75, 55, 85].map((h, i) => (
                        <div key={i} className="flex-1 rounded-md bg-gradient-aurora" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4">
                    <div className="text-xs font-medium mb-3">Recent Team Activity</div>
                    <div className="space-y-2.5">
                      {["Maya","Leo","Ari","Zia"].map((n, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px]">
                          <div className="h-6 w-6 rounded-full bg-gradient-aurora text-[10px] flex items-center justify-center font-semibold">{n[0]}</div>
                          <span className="font-medium">{n}</span>
                          <span className="text-muted-foreground truncate">updated a task</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */
function Pricing() {
  const tiers = [
    { name: "Starter", price: "$0", desc: "For small teams getting started.", features: ["Up to 5 members", "3 projects", "Kanban & list views", "Basic reports"], cta: "Start free", highlight: false },
    { name: "Pro", price: "$12", per: "/user/mo", desc: "For growing teams that need more.", features: ["Unlimited projects", "Advanced analytics", "Role-based access", "Priority support"], cta: "Start 14-day trial", highlight: true },
    { name: "Enterprise", price: "Custom", desc: "Security and scale for large orgs.", features: ["SSO & SCIM", "Custom roles", "Audit logs", "Dedicated CSM"], cta: "Contact sales", highlight: false },
  ];
  return (
    <section id="pricing" className="px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex glass-pill rounded-full px-3 py-1 text-[11px] text-muted-foreground mb-4">PRICING</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mt-4">Start free. Upgrade when your team is ready to fly.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative rounded-3xl p-7 ${t.highlight ? "glass-strong gradient-border shadow-glow" : "glass"}`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 glass-pill rounded-full px-3 py-1 text-[10px] uppercase tracking-wider text-accent flex items-center gap-1">
                  <Star className="h-3 w-3" /> Most popular
                </div>
              )}
              <div className="text-sm text-muted-foreground">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{t.price}</span>
                {t.per && <span className="text-xs text-muted-foreground">{t.per}</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t.desc}</p>
              <ul className="space-y-2.5 mt-6 mb-7">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button className={`w-full rounded-full h-11 ${t.highlight ? "bg-white text-black hover:bg-white/90" : "bg-white/5 hover:bg-white/10 text-foreground border border-white/10"}`}>
                  {t.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function CTA({ email, setEmail, onSubmit }: { email: string; setEmail: (s: string) => void; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <section className="px-6 py-28">
      <motion.div {...fadeUp} className="relative max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden glass-strong gradient-border p-10 md:p-16 text-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-gradient-aurora opacity-30 blur-3xl" />
        </div>
        <Zap className="h-7 w-7 mx-auto text-accent mb-4" />
        <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">Ready to ship faster?</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Join thousands of teams using Orbit to organize work and accelerate delivery.</p>
        <form onSubmit={onSubmit} className="mt-8 max-w-md mx-auto flex items-center gap-2 glass rounded-full p-1.5 pl-5">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-10 px-0 placeholder:text-muted-foreground/70" />
          <Button type="submit" className="rounded-full h-10 px-5 bg-white text-black hover:bg-white/90 font-medium shrink-0">Get Started</Button>
        </form>
      </motion.div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="px-6 pb-12 pt-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-gradient-aurora flex items-center justify-center shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-display font-bold tracking-tight">ORBIT</span>
          <span className="text-xs text-muted-foreground ml-2">© 2026 Orbit Labs · Built for productive teams</span>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
          <Link to="/signup" className="hover:text-foreground transition-colors">Sign up</Link>
        </div>
      </div>
    </footer>
  );
}
