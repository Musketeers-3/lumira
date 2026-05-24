import { useRouterState } from "@tanstack/react-router";
import { useLearningState } from "@/lib/learning-state-context";

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
  const title = titles[pathname] ?? "Lumira";

  return (
    <header
      className="relative flex items-center justify-between px-6 py-4 backdrop-blur-xl transition-colors duration-700 hairline-gold-bottom"
      style={{
        background:
          "linear-gradient(180deg, rgba(20,20,30,0.85) 0%, rgba(11,11,18,0.7) 100%)",
        borderBottom: "1px solid rgba(245,241,230,0.05)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div>
        <div
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "rgba(201,162,75,0.7)" }}
        >
          lumira
        </div>
        <h1
          className="mt-0.5 text-lg font-semibold tracking-tight"
          style={{ color: "#F5F1E6" }}
        >
          {title}
        </h1>
      </div>
      <div
        className="flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs tracking-wide transition-colors duration-700"
        style={{
          background: "linear-gradient(180deg, #1B1B28 0%, #13131C 100%)",
          border: "1px solid rgba(201,162,75,0.25)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 16px rgba(201,162,75,0.10)",
        }}
      >
        <span
          className="h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: "var(--state-accent)", boxShadow: "0 0 10px var(--state-glow)" }}
        />
        <span style={{ color: "rgba(245,241,230,0.5)" }}>mentor:</span>
        <span
          className="transition-colors duration-700"
          style={{ color: "var(--state-accent)" }}
        >
          {subtitleFor(state)}
        </span>
      </div>
    </header>
  );
}
