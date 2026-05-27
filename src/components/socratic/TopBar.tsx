import { useRouterState } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useLearningState } from "@/lib/learning-state-context";
import { useTheme } from "@/lib/theme-context";

const titles: Record<string, string> = {
  "/": "Your Path",
  "/engine": "The Dojo",
  "/skill-passport": "Your Light",
  "/architecture-log": "Journey Log",
  "/settings": "Settings",
  "/lesson-builder": "Create Lesson",
};

const subtitleFor = (state: string) => {
  if (state === "IDLE") return "walking with you";
  if (state === "FOCUS") return "listening kindly";
  if (state === "CHALLENGE") return "believing in you";
  return "proud of you";
};

export function TopBar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { state } = useLearningState();
  const { theme, toggleTheme } = useTheme();
  const title = titles[pathname] ?? "Lumira";

  return (
    <header
      className="relative flex items-center justify-between px-6 py-4 backdrop-blur-xl transition-colors duration-700 hairline-gold-bottom"
      style={{
        background: "var(--grad-onyx-raised)",
        borderBottom: "1px solid var(--hairline)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div>
        <div
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "var(--gold-soft)" }}
        >
          lumira
        </div>
        <h1
          className="mt-0.5 text-lg font-semibold tracking-tight"
          style={{ color: "var(--ink-primary)" }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs tracking-wide transition-colors duration-700"
          style={{
            background: "var(--grad-onyx-raised)",
            border: "1px solid rgba(201,162,75,0.25)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 16px rgba(201,162,75,0.10)",
          }}
        >
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ background: "var(--state-accent)", boxShadow: "0 0 10px var(--state-glow)" }}
          />
          <span style={{ color: "var(--ink-tertiary)" }}>mentor:</span>
          <span
            className="transition-colors duration-700"
            style={{ color: "var(--state-accent)" }}
          >
            {subtitleFor(state)}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          className="group inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 hover:-translate-y-px active:translate-y-0"
          style={{
            background: "var(--grad-onyx-raised)",
            border: "1px solid rgba(201,162,75,0.35)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 16px rgba(201,162,75,0.18), 0 6px 18px -8px rgba(0,0,0,0.5)",
            color: "var(--gold-soft)",
          }}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-12" />
          )}
        </button>
      </div>
    </header>
  );
}
