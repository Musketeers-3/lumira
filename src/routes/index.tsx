import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Clock, TrendingUp, Compass } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Path — Lumira" },
      { name: "description", content: "Resume your session with a mentor who believes in you." },
      { property: "og:title", content: "Your Path — Lumira" },
      {
        property: "og:description",
        content: "Resume your session with a mentor who believes in you.",
      },
    ],
  }),
  component: Dashboard,
});

function Glass({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-glass-border bg-white/[0.03] backdrop-blur-xl transition-colors duration-700 ${className}`}
    >
      {children}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Hero */}
      <Glass className="relative overflow-hidden p-8 lg:p-10">
        <div
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl opacity-50"
          style={{ background: "radial-gradient(circle, var(--state-glow), transparent 70%)" }}
        />
        <div className="relative">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-state-accent transition-colors duration-700">
            welcome back
          </div>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
            I've been waiting for you. We were close to something on{" "}
            <span className="text-state-accent transition-colors duration-700">Binary Search</span>.
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Your mentor is here, patient — holding the thought right where you left it. Whenever
            you're ready, we'll continue together.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/engine"
              className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-500"
              style={{
                background: "var(--state-accent)",
                color: "oklch(0.12 0.02 270)",
                boxShadow: "0 0 32px var(--state-glow)",
              }}
            >
              Enter the Dojo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/skill-passport"
              className="inline-flex items-center gap-2 rounded-xl border border-glass-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              See Your Light
            </Link>
          </div>
        </div>
      </Glass>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Compass, label: "Sessions", value: "24", sub: "walks together" },
          { icon: Sparkles, label: "Light found", value: "07", sub: "ideas you invented" },
          { icon: Clock, label: "Time present", value: "11.4h", sub: "patient, focused" },
        ].map(({ icon: Icon, label, value, sub }) => (
          <Glass key={label} className="p-5">
            <Icon
              className="h-5 w-5 text-state-accent transition-colors duration-700"
              strokeWidth={1.5}
            />
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {label}
            </div>
            <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </Glass>
        ))}
      </div>

      {/* Current + Breakthrough */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Glass className="p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Where we are
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">Computational Thinking</h3>
          <p className="text-sm text-muted-foreground">The Dictionary Puzzle — Step 3 of 5</p>
          <div className="mt-5 flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-2 flex-1 rounded-full transition-all duration-500"
                style={{
                  background: i < 3 ? "var(--state-accent)" : "rgba(255,255,255,0.08)",
                  boxShadow: i < 3 ? "0 0 10px var(--state-glow)" : "none",
                }}
              />
            ))}
          </div>
          <Link
            to="/engine"
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-state-accent transition-colors duration-700"
          >
            Continue together <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Glass>

        <Glass className="p-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" /> Light you found
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">Recursion as Self-Reference</h3>
          <p className="mt-2 text-sm text-muted-foreground italic">
            "A function that solves a smaller version of its own problem."
          </p>
          <div className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            you reached this 3 days ago
          </div>
        </Glass>
      </div>
    </div>
  );
}
