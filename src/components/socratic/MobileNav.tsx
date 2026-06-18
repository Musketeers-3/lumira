import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Compass, Map, Star, BookOpen, PenLine, Settings } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useLearningState } from "@/lib/learning-state-context";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const NAV_ITEMS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Discovery Hub", icon: Compass },
  { to: "/worlds", label: "Worlds", icon: Map },
  { to: "/engine", label: "Explore", icon: Compass },
  { to: "/skill-passport", label: "Constellation", icon: Star },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/lesson-builder", label: "Create Lesson", icon: PenLine },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { state } = useLearningState();

  const stateLabel =
    state === "IDLE"
      ? "Ready to explore"
      : state === "FOCUS"
        ? "Listening"
        : state === "CHALLENGE"
          ? "Believing in you"
          : "Celebrating";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 hover:-translate-y-px glass-panel"
          style={{ borderRadius: "0.875rem" }}
        >
          <Menu className="h-4.5 w-4.5" style={{ color: "var(--ink-secondary)" }} />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[85vw] max-w-sm border-0 p-0 nav-glass"
        style={{ background: "var(--bg-night)" }}
      >
        {/* FIX: Accessibility context block hidden from display view but active for screen readers */}
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Navigate across the core spaces, worlds, and settings of Lumira OS.
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col px-6 py-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: "var(--ink-tertiary)" }}
              >
                Lumira Academy
              </div>
              <h2
                className="text-2xl font-semibold tracking-tight font-display"
                style={{ color: "var(--ink-primary)" }}
              >
                Lumi<span style={{ color: "var(--realm-accent)" }}>ra</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--hairline)",
              }}
            >
              <X className="h-4 w-4" style={{ color: "var(--ink-secondary)" }} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3.5 rounded-xl px-4 py-3.5 transition-all duration-300",
                    active && "glass-glow",
                  )}
                  style={{
                    background: active ? "var(--realm-glow)" : "transparent",
                    border: `1px solid ${active ? "var(--realm-accent)" : "transparent"}`,
                    color: active ? "var(--ink-primary)" : "var(--ink-tertiary)",
                  }}
                >
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: active ? "var(--realm-accent)" : "var(--ink-tertiary)" }}
                  />
                  <span className="text-sm font-medium tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="glass-panel mt-6 p-5">
            <div
              className="text-xs uppercase tracking-[0.15em]"
              style={{ color: "var(--ink-tertiary)" }}
            >
              Your mentor
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{
                  background: "var(--realm-accent)",
                  boxShadow: "0 0 12px var(--realm-glow)",
                }}
              />
              <span className="text-xs font-medium" style={{ color: "var(--ink-primary)" }}>
                {stateLabel}
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
