import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Swords, Sparkles, ScrollText, Settings, BookOpen } from "lucide-react";
import { useLearningState } from "@/lib/learning-state-context";

const items = [
  { to: "/", label: "Your Path", icon: Compass },
  { to: "/engine", label: "The Dojo", icon: Swords },
  { to: "/skill-passport", label: "Your Light", icon: Sparkles },
  { to: "/lesson-builder", label: "Create Lesson", icon: BookOpen },
  { to: "/architecture-log", label: "Journey Log", icon: ScrollText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { state } = useLearningState();

  return (
    <aside
      className="hidden lg:flex h-screen w-64 shrink-0 flex-col px-5 py-7 transition-colors duration-700 relative"
      style={{
        background:
          "linear-gradient(180deg, #0C0C16 0%, #08080F 100%)",
        borderRight: "1px solid rgba(201,162,75,0.10)",
        boxShadow: "inset -1px 0 0 rgba(255,255,255,0.03), 24px 0 48px -24px rgba(0,0,0,0.6)",
      }}
    >
      {/* Gold hairline accent on right edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-8 bottom-8 right-0 w-px"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(201,162,75,0.5) 30%, rgba(201,162,75,0.5) 70%, transparent)",
        }}
      />

      <div className="mb-10">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "rgba(245,241,230,0.45)" }}
        >
          lumira // ambient os
        </div>
        <div className="mt-1.5 text-xl font-semibold tracking-tight" style={{ color: "#F5F1E6" }}>
          Lum<span className="text-gold">ira</span>
        </div>
        <div
          className="mt-1.5 text-[11px] italic"
          style={{ color: "rgba(245,241,230,0.40)" }}
        >
          Learn beside someone who believes in you.
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300"
              style={{
                background: active
                  ? "linear-gradient(90deg, rgba(201,162,75,0.10), rgba(255,255,255,0.02))"
                  : "transparent",
                color: active ? "#F5F1E6" : "rgba(245,241,230,0.55)",
                boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full transition-colors duration-700"
                  style={{
                    background: "var(--gold)",
                    boxShadow: "0 0 12px rgba(201,162,75,0.7)",
                  }}
                />
              )}
              <Icon
                className="h-4 w-4"
                strokeWidth={1.5}
                style={{ color: active ? "var(--gold-soft)" : "rgba(245,241,230,0.55)" }}
              />
              <span className={active ? "font-medium tracking-wide" : "tracking-wide"}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className="mt-auto rounded-xl p-3.5"
        style={{
          background: "linear-gradient(180deg, #15151F 0%, #0E0E18 100%)",
          border: "1px solid rgba(201,162,75,0.15)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.45)",
        }}
      >
        <div
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "rgba(245,241,230,0.45)" }}
        >
          Mentor state
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full transition-colors duration-700"
            style={{ background: "var(--state-accent)", boxShadow: "0 0 10px var(--state-glow)" }}
          />
          <span
            className="text-sm font-medium tracking-wide"
            style={{ color: "var(--state-accent)" }}
          >
            {state}
          </span>
        </div>
      </div>
    </aside>
  );
}
