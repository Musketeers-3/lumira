import { Link, useRouterState } from "@tanstack/react-router";
import { useLearningState } from "@/lib/learning-state-context";
import { cn } from "@/lib/utils";
import { Compass, Map, Star, BookOpen, PenLine, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NAV_ITEMS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Discovery Hub", icon: Compass },
  { to: "/worlds", label: "Worlds", icon: Map },
  { to: "/engine", label: "Explore", icon: Compass },
  { to: "/skill-passport", label: "Constellation", icon: Star },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/lesson-builder", label: "Create Lesson", icon: PenLine },
];

function NavItemContent({
  label,
  icon: Icon,
  active,
}: {
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3.5 py-3.5 px-4 rounded-xl transition-all duration-400",
        active && "glass-glow",
      )}
      style={{
        background: active ? "var(--realm-glow)" : "transparent",
        border: `1px solid ${active ? "var(--realm-accent)" : "transparent"}`,
        color: active ? "var(--ink-primary)" : "var(--ink-tertiary)",
      }}
    >
      <Icon
        className="h-4 w-4 shrink-0 transition-all duration-300 group-hover:scale-110"
        style={{ color: active ? "var(--realm-accent)" : "var(--ink-tertiary)" }}
        strokeWidth={active ? 2 : 1.5}
      />
      <span className="text-sm font-medium tracking-wide transition-colors duration-300 group-hover:text-[var(--ink-primary)]">
        {label}
      </span>
      {active && (
        <span
          className="ml-auto h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--realm-accent)", boxShadow: "0 0 8px var(--realm-glow)" }}
        />
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { state } = useLearningState();

  const stateLabel =
    state === "IDLE"
      ? "Ready to explore"
      : state === "FOCUS"
        ? "Listening closely"
        : state === "CHALLENGE"
          ? "Believing in you"
          : "Celebrating you";

  return (
    <aside className="nav-glass hidden lg:flex h-screen w-72 shrink-0 flex-col px-7 py-9 gap-10 relative">
      <div className="space-y-2">
        <div
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--ink-tertiary)" }}
        >
          Lumira Academy
        </div>
        <h1
          className="text-[2rem] font-semibold tracking-tight leading-none font-display"
          style={{ color: "var(--ink-primary)" }}
        >
          Lumi<span style={{ color: "var(--realm-accent)" }}>ra</span>
        </h1>
        <p
          className="font-display italic text-sm leading-relaxed pr-4"
          style={{ color: "var(--ink-tertiary)" }}
        >
          A universe where understanding is discovered.
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <Link key={item.to} to={item.to} className="block">
            <NavItemContent
              label={item.label}
              icon={item.icon}
              active={pathname === item.to || (item.to === "/engine" && pathname === "/engine")}
            />
          </Link>
        ))}
        <Link to="/settings" className="block mt-4">
          <NavItemContent label="Settings" icon={Settings} active={pathname === "/settings"} />
        </Link>
      </nav>

      <div className="glass-panel p-5 float-subtle">
        <div
          className="text-xs uppercase tracking-[0.15em]"
          style={{ color: "var(--ink-tertiary)" }}
        >
          Your mentor
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-40"
              style={{ background: "var(--realm-accent)" }}
            />
            <span
              className="relative h-2.5 w-2.5 rounded-full"
              style={{
                background: "var(--realm-accent)",
                boxShadow: "0 0 14px var(--realm-glow)",
              }}
            />
          </span>
          <span className="text-xs font-medium" style={{ color: "var(--ink-primary)" }}>
            {stateLabel}
          </span>
        </div>
      </div>
    </aside>
  );
}
