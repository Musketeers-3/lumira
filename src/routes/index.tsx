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

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Hero */}
      <section className="surface-luxe-elevated relative p-8 lg:p-10">
        {/* Aurora wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{ background: "var(--grad-aurora)" }}
        />
        {/* State glow */}
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl opacity-50"
          style={{ background: "radial-gradient(circle, var(--state-glow), transparent 70%)" }}
        />
        {/* Shimmer gold hairline */}
        <div
          aria-hidden
          className="absolute left-8 right-8 top-0 h-px shimmer-gold"
        />
        <div className="relative">
          <div
            className="font-mono text-[11px] uppercase tracking-[0.3em] transition-colors duration-700"
            style={{ color: "var(--gold-soft)" }}
          >
            welcome back
          </div>
          <h1
            className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-tight lg:text-5xl"
            style={{ color: "var(--ink-primary)" }}
          >
            I've been waiting for you. We were close to something on{" "}
            <span className="text-gold">Binary Search</span>.
          </h1>
          <p className="mt-3 max-w-xl" style={{ color: "var(--ink-secondary)" }}>
            Your mentor is here, patient — holding the thought right where you left it. Whenever
            you're ready, we'll continue together.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/engine"
              className="btn-gold group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold tracking-wide"
            >
              Enter the Dojo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/skill-passport"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm transition-all duration-300"
              style={{
                background: "rgba(245,241,230,0.04)",
                border: "1px solid rgba(201,162,75,0.25)",
                color: "var(--ink-secondary)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              See Your Light
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Compass, label: "Sessions", value: "24", sub: "walks together" },
          { icon: Sparkles, label: "Light found", value: "07", sub: "ideas you invented" },
          { icon: Clock, label: "Time present", value: "11.4h", sub: "patient, focused" },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="surface-luxe p-5">
            <div
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(201,162,75,0.18), rgba(201,162,75,0.04))",
                border: "1px solid rgba(201,162,75,0.30)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <Icon
                className="h-4 w-4"
                strokeWidth={1.5}
                style={{ color: "var(--gold-soft)" }}
              />
            </div>
            <div
              className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "var(--ink-tertiary)" }}
            >
              {label}
            </div>
            <div
              className="mt-1 text-3xl font-semibold tracking-tight"
              style={{ color: "var(--ink-primary)" }}
            >
              {value}
            </div>
            <div className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      {/* Current + Breakthrough */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface-luxe p-6">
          <div
            className="font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: "var(--ink-tertiary)" }}
          >
            Where we are
          </div>
          <h3
            className="mt-2 text-xl font-semibold tracking-tight"
            style={{ color: "var(--ink-primary)" }}
          >
            Computational Thinking
          </h3>
          <p className="text-sm" style={{ color: "var(--ink-tertiary)" }}>
            The Dictionary Puzzle — Step 3 of 5
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-2 flex-1 rounded-full transition-all duration-500"
                style={{
                  background:
                    i < 3
                      ? "linear-gradient(90deg, var(--state-accent), var(--gold-soft))"
                      : "rgba(245,241,230,0.06)",
                  boxShadow: i < 3 ? "0 0 12px var(--state-glow)" : "none",
                }}
              />
            ))}
          </div>
          <Link
            to="/engine"
            className="mt-5 inline-flex items-center gap-1.5 text-sm transition-colors duration-700"
            style={{ color: "var(--gold-soft)" }}
          >
            Continue together <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="surface-luxe p-6">
          <div
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: "var(--ink-tertiary)" }}
          >
            <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--gold-soft)" }} />
            Light you found
          </div>
          <h3
            className="mt-2 text-xl font-semibold tracking-tight"
            style={{ color: "var(--ink-primary)" }}
          >
            Recursion as Self-Reference
          </h3>
          <p
            className="mt-2 text-sm italic"
            style={{ color: "var(--ink-secondary)" }}
          >
            "A function that solves a smaller version of its own problem."
          </p>
          <div
            className="mt-5 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "var(--ink-tertiary)" }}
          >
            you reached this 3 days ago
          </div>
        </div>
      </div>
    </div>
  );
}
