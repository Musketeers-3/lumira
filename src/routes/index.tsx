import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Clock, Compass, TrendingUp } from "lucide-react";

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

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero — editorial cinema card */}
      <section
        className="relative overflow-hidden rounded-[2.5rem] p-10 lg:p-16"
        style={{
          background: "var(--bg-onyx)",
          border: "1px solid var(--hairline-strong)",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* radial state spotlight */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 70% 25%, var(--state-glow), transparent 60%)",
            opacity: 0.55,
          }}
        />
        {/* gold accent radial */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 40% 40% at 90% 0%, rgba(201,162,75,0.10), transparent 60%)",
          }}
        />
        {/* grain */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.10] mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px" }}
        />

        <div className="relative z-10 max-w-3xl space-y-8">
          {/* eyebrow chip */}
          <div
            className="inline-block rounded-md px-3 py-1"
            style={{
              background: "var(--glass-tint-2)",
              border: "1px solid var(--hairline-strong)",
            }}
          >
            <span
              className="font-mono text-[10px] tracking-[0.35em] uppercase"
              style={{ color: "var(--ink-secondary)" }}
            >
              Welcome back
            </span>
          </div>

          {/* serif/sans hybrid headline */}
          <h1
            className="font-display italic leading-[1.05] text-5xl md:text-6xl lg:text-7xl"
            style={{ color: "var(--ink-primary)" }}
          >
            I've been waiting for you.
            <br />
            <span className="not-italic font-normal" style={{ opacity: 0.8 }}>
              We were close to something on{" "}
            </span>
            <span
              className="not-italic font-semibold tracking-tight underline underline-offset-[10px]"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--gold-soft)",
                textDecorationColor: "rgba(201,162,75,0.35)",
              }}
            >
              Binary Search.
            </span>
          </h1>

          <p
            className="text-lg font-light leading-relaxed max-w-2xl"
            style={{ color: "var(--ink-secondary)" }}
          >
            Your mentor is here, patient — holding the thought right where you left it. Whenever
            you're ready, we'll continue together.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/engine"
              className="group inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-sm font-semibold tracking-wide transition-all hover:-translate-y-px"
              style={{
                background: "var(--gold-soft)",
                color: "#0B0B12",
                boxShadow:
                  "0 0 40px rgba(201,162,75,0.22), 0 10px 28px -8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              Enter the Dojo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/skill-passport"
              className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-medium transition-all"
              style={{
                background: "transparent",
                border: "1px solid var(--hairline-strong)",
                color: "var(--ink-primary)",
              }}
            >
              See Your Light
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bento — serif numerals */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: Compass, label: "Sessions", value: "24", sub: "walks together" },
          { icon: Sparkles, label: "Light Found", value: "07", sub: "ideas you invented" },
          { icon: Clock, label: "Time Present", value: "11.4", unit: "h", sub: "patient, focused" },
        ].map(({ icon: Icon, label, value, unit, sub }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-[2rem] p-8 transition-colors duration-500"
            style={{
              background: "var(--bg-onyx-raised)",
              border: "1px solid var(--hairline)",
            }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: "var(--bg-onyx)",
                border: "1px solid var(--hairline-strong)",
                color: "var(--gold-soft)",
              }}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>

            <div className="mt-6 space-y-1">
              <p
                className="font-mono text-[10px] tracking-[0.25em] uppercase"
                style={{ color: "var(--ink-tertiary)" }}
              >
                {label}
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display text-5xl leading-none"
                  style={{ color: "var(--ink-primary)" }}
                >
                  {value}
                  {unit && <span className="text-3xl">{unit}</span>}
                </span>
                <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  {sub}
                </span>
              </div>
            </div>

            <div
              aria-hidden
              className="absolute bottom-0 left-0 h-px w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(201,162,75,0.55), transparent)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Continuity row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className="relative overflow-hidden rounded-[2rem] p-8"
          style={{ background: "var(--bg-onyx-raised)", border: "1px solid var(--hairline)" }}
        >
          <div
            className="font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: "var(--ink-tertiary)" }}
          >
            Where we are
          </div>
          <h3
            className="mt-3 font-display text-3xl leading-tight"
            style={{ color: "var(--ink-primary)" }}
          >
            Computational Thinking
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-tertiary)" }}>
            The Dictionary Puzzle — Step 3 of 5
          </p>
          <div className="mt-6 flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-[3px] flex-1 rounded-full transition-all duration-500"
                style={{
                  background:
                    i < 3 ? "var(--gold-soft)" : "rgba(255,255,255,0.06)",
                  boxShadow: i < 3 ? "0 0 10px rgba(201,162,75,0.45)" : "none",
                }}
              />
            ))}
          </div>
          <Link
            to="/engine"
            className="mt-6 inline-flex items-center gap-1.5 text-sm transition-colors duration-500"
            style={{ color: "var(--gold-soft)" }}
          >
            Continue together <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div
          className="relative overflow-hidden rounded-[2rem] p-8"
          style={{ background: "var(--bg-onyx-raised)", border: "1px solid var(--hairline)" }}
        >
          <div
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: "var(--ink-tertiary)" }}
          >
            <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--gold-soft)" }} />
            Light you found
          </div>
          <h3
            className="mt-3 font-display text-3xl leading-tight"
            style={{ color: "var(--ink-primary)" }}
          >
            Recursion as Self-Reference
          </h3>
          <p
            className="mt-3 font-display italic text-lg"
            style={{ color: "var(--ink-secondary)" }}
          >
            "A function that solves a smaller version of its own problem."
          </p>
          <div
            className="mt-6 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "var(--ink-tertiary)" }}
          >
            you reached this 3 days ago
          </div>
        </div>
      </div>
    </div>
  );
}
