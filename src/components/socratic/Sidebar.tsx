import { Link, useRouterState } from "@tanstack/react-router";
import { useLearningState } from "@/lib/learning-state-context";

// Pure visual component to keep styling DRY without triggering TanStack Router's union errors
function NavItemContent({
  label,
  marker,
  active,
}: {
  label: string;
  marker: string;
  active: boolean;
}) {
  return (
    <div
      className="group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300"
      style={{
        background: active ? "rgba(201,162,75,0.06)" : "transparent",
        border: `1px solid ${active ? "rgba(201,162,75,0.22)" : "transparent"}`,
        color: active ? "var(--ink-primary)" : "var(--ink-tertiary)",
      }}
    >
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px]"
        style={{
          border: `1px solid ${active ? "rgba(201,162,75,0.5)" : "var(--hairline-strong)"}`,
          color: active ? "var(--gold-soft)" : "var(--ink-tertiary)",
        }}
      >
        {marker}
      </span>
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </div>
  );
}

export function Sidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { state } = useLearningState();

  return (
    <aside
      className="hidden lg:flex h-screen w-72 shrink-0 flex-col px-8 py-8 gap-12 transition-colors duration-700 relative"
      style={{
        background: "var(--bg-night)",
        borderRight: "1px solid var(--hairline)",
      }}
    >
      {/* Brand */}
      <div className="space-y-1.5">
        <div
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "var(--ink-tertiary)" }}
        >
          <span>Lumira</span>
          <span className="opacity-40">//</span>
          <span>Ambient OS</span>
        </div>
        <h1 className="text-3xl font-light tracking-tight" style={{ color: "var(--ink-primary)" }}>
          Lumi<span style={{ color: "var(--gold-soft)" }}>ra</span>
        </h1>
        <p className="text-xs italic leading-relaxed pr-6" style={{ color: "var(--ink-tertiary)" }}>
          Learn beside someone who believes in you.
        </p>
      </div>

      {/* Catalog navigation — Explicitly defined to satisfy strict URL literal types */}
      <nav className="flex-1 flex flex-col gap-1">
        <Link to="/" className="block">
          <NavItemContent label="Your Path" marker="01" active={pathname === "/"} />
        </Link>

        {/* The Dojo uses optional search parameters, safely omitting them uses the schema defaults */}
        <Link to="/engine" className="block">
          <NavItemContent label="The Dojo" marker="02" active={pathname === "/engine"} />
        </Link>

        <Link to="/skill-passport" className="block">
          <NavItemContent label="Your Light" marker="03" active={pathname === "/skill-passport"} />
        </Link>

        <Link to="/lesson-builder" className="block">
          <NavItemContent
            label="Create Lesson"
            marker="04"
            active={pathname === "/lesson-builder"}
          />
        </Link>

        <Link to="/architecture-log" className="block">
          <NavItemContent
            label="Journey Log"
            marker="05"
            active={pathname === "/architecture-log"}
          />
        </Link>

        {/* Settings, set apart like a colophon entry */}
        <Link to="/settings" className="block mt-5">
          <NavItemContent label="Settings" marker="S" active={pathname === "/settings"} />
        </Link>
      </nav>

      {/* Mentor state card — catalog tag */}
      <div
        className="relative overflow-hidden rounded-2xl p-5"
        style={{
          background: "var(--grad-onyx)",
          border: "1px solid var(--hairline)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "160px 160px",
          }}
        />
        <div
          className="font-mono text-[10px] uppercase tracking-[0.25em]"
          style={{ color: "var(--ink-tertiary)" }}
        >
          Mentor state
        </div>
        <div className="mt-2 flex items-center gap-2.5">
          <span
            className="h-2 w-2 rounded-full transition-colors duration-700 animate-pulse"
            style={{ background: "var(--state-accent)", boxShadow: "0 0 10px var(--state-glow)" }}
          />
          <span
            className="font-mono text-xs font-semibold tracking-[0.22em] uppercase"
            style={{ color: "var(--ink-primary)" }}
          >
            {state}
          </span>
        </div>
      </div>
    </aside>
  );
}
