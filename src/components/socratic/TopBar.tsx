import { useRouterState } from "@tanstack/react-router";
import { useLearningState } from "@/lib/learning-state-context";

const titles: Record<string, string> = {
  "/": "Your Path",
  "/engine": "The Dojo",
  "/skill-passport": "Your Light",
  "/architecture-log": "Journey Log",
  "/settings": "Settings",
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
  const title = titles[pathname] ?? "Lumira";

  return (
    <header className="flex items-center justify-between border-b border-glass-border bg-white/[0.02] px-6 py-4 backdrop-blur-xl transition-colors duration-700">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          lumira
        </div>
        <h1 className="mt-0.5 text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-glass-border bg-white/[0.03] px-3 py-1.5 font-mono text-xs tracking-wide transition-colors duration-700">
        <span
          className="h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: "var(--state-accent)", boxShadow: "0 0 10px var(--state-glow)" }}
        />
        <span className="text-muted-foreground">mentor:</span>
        <span className="text-state-accent transition-colors duration-700">
          {subtitleFor(state)}
        </span>
      </div>
    </header>
  );
}
