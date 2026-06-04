import { useRouterState } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useLearningState } from "@/lib/learning-state-context";
import { useTheme } from "@/lib/theme-context";

const baseTitles: Record<string, string> = {
  "/": "Your Path",
  "/engine": "The Dojo",
  "/skill-passport": "Your Light",
  "/architecture-log": "Journey Log",
  "/settings": "Settings",
  "/lesson-builder": "Lesson Builder",
};

const subtitleFor = (state: string) => {
  if (state === "IDLE") return "walking with you";
  if (state === "FOCUS") return "listening kindly";
  if (state === "CHALLENGE") return "believing in you";
  return "proud of you";
};

export function TopBar() {
  // Extract both pathname and dynamic search parameters
  const { pathname, search } = useRouterState({
    select: (r) => ({
      pathname: r.location.pathname,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: r.location.search as Record<string, any>,
    }),
  });

  const { state } = useLearningState();
  const { theme, toggleTheme } = useTheme();

  // Dynamically inject the active lesson topic into the header if in the Dojo
  let title = baseTitles[pathname] ?? "Lumira";
  if (pathname === "/engine" && search?.topic) {
    title = `The Dojo: ${search.topic}`;
  }

  return (
    <header
      className="relative flex h-20 items-center justify-between px-10 transition-colors duration-700"
      style={{
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div className="space-y-0.5">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "var(--gold-soft)" }}
        >
          lumira
        </div>
        <h1
          className="text-lg font-medium tracking-tight transition-all duration-500"
          style={{ color: "var(--ink-primary)" }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-3 rounded-full px-4 py-1.5 font-mono text-[11px] tracking-wide transition-colors duration-700"
          style={{
            background: "var(--bg-onyx)",
            border: "1px solid var(--hairline-strong)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--state-accent)", boxShadow: "0 0 8px var(--state-glow)" }}
          />
          <span style={{ color: "var(--ink-tertiary)" }}>mentor:</span>
          <span className="transition-colors duration-700" style={{ color: "var(--state-accent)" }}>
            {subtitleFor(state)}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-px"
          style={{
            background: "var(--bg-onyx)",
            border: "1px solid var(--hairline-strong)",
            color: "var(--ink-secondary)",
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
