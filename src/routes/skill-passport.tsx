import { createFileRoute } from "@tanstack/react-router";
import { Lock, BadgeCheck, Loader2 } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export const Route = createFileRoute("/skill-passport")({
  head: () => ({
    meta: [
      { title: "Your Light — Lumira" },
      {
        name: "description",
        content:
          "Every idea here is one you found on your own, beside a mentor who believed you could.",
      },
      { property: "og:title", content: "Your Light — Lumira" },
      {
        property: "og:description",
        content:
          "Every idea here is one you found on your own, beside a mentor who believed you could.",
      },
    ],
  }),
  component: SkillPassport,
});

interface Skill {
  name: string;
  domain: string;
  mastery: number;
  status: "unlocked" | "in-progress" | "locked";
  date?: string;
  insight?: string;
}

const skills: Skill[] = [
  { name: "Binary Search", domain: "Computational Thinking", mastery: 92, status: "unlocked", date: "May 21, 2026", insight: "Halving the search space at every step." },
  { name: "Recursion", domain: "Algorithms", mastery: 78, status: "unlocked", date: "May 18, 2026", insight: "A function solving a smaller version of itself." },
  { name: "Computational Thinking", domain: "Meta-skill", mastery: 64, status: "in-progress", insight: "Decompose, pattern, abstract, design." },
  { name: "Big-O Intuition", domain: "Complexity", mastery: 40, status: "in-progress", insight: "Cost as input grows, not absolute time." },
  { name: "Dynamic Programming", domain: "Algorithms", mastery: 0, status: "locked" },
  { name: "Graph Reasoning", domain: "Discrete Math", mastery: 0, status: "locked" },
];

function SkillPassport() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <div
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: "var(--gold-soft)" }}
        >
          ideas you reached on your own
        </div>
        <h1
          className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl"
          style={{ color: "#F5F1E6" }}
        >
          Your Light
        </h1>
        <p className="mt-2 max-w-xl" style={{ color: "rgba(245,241,230,0.62)" }}>
          Each one of these — you weren't told. You found it. The mentor only walked beside you.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <HoverCard key={s.name} openDelay={120}>
            <HoverCardTrigger asChild>
              <div
                className={`surface-luxe group cursor-default p-5 transition-all duration-500 hover:-translate-y-1 ${
                  s.status === "locked" ? "opacity-50" : ""
                }`}
                style={
                  s.status === "unlocked"
                    ? { boxShadow: "var(--shadow-deep), var(--inset-highlight), 0 0 0 1px rgba(201,162,75,0.18)" }
                    : undefined
                }
              >
                <div className="flex items-start justify-between">
                  <div
                    className="font-mono text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "rgba(245,241,230,0.45)" }}
                  >
                    {s.domain}
                  </div>
                  {s.status === "unlocked" && (
                    <BadgeCheck
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      style={{ color: "var(--gold-soft)" }}
                    />
                  )}
                  {s.status === "in-progress" && (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      strokeWidth={1.5}
                      style={{ color: "var(--state-accent)" }}
                    />
                  )}
                  {s.status === "locked" && (
                    <Lock
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      style={{ color: "rgba(245,241,230,0.35)" }}
                    />
                  )}
                </div>
                <h3
                  className="mt-3 text-lg font-semibold tracking-tight"
                  style={{ color: "#F5F1E6" }}
                >
                  {s.name}
                </h3>
                <div
                  className="mt-4 h-1.5 overflow-hidden rounded-full"
                  style={{ background: "rgba(245,241,230,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${s.mastery}%`,
                      background:
                        s.status === "unlocked"
                          ? "linear-gradient(90deg, var(--gold-deep), var(--gold-soft))"
                          : "linear-gradient(90deg, var(--state-accent), var(--gold-soft))",
                      boxShadow: s.mastery > 0 ? "0 0 12px var(--state-glow)" : "none",
                    }}
                  />
                </div>
                <div
                  className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: "rgba(245,241,230,0.45)" }}
                >
                  <span>{s.status}</span>
                  <span style={{ color: "var(--gold-soft)" }}>{s.mastery}% mastery</span>
                </div>
              </div>
            </HoverCardTrigger>
            {s.insight && (
              <HoverCardContent
                className="w-72 backdrop-blur-xl"
                style={{
                  background: "linear-gradient(180deg, #1B1B28 0%, #0E0E18 100%)",
                  border: "1px solid rgba(201,162,75,0.25)",
                  boxShadow: "var(--shadow-deep), var(--inset-highlight)",
                }}
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--gold-soft)" }}
                >
                  Core insight
                </div>
                <p className="mt-1.5 text-sm italic" style={{ color: "#F5F1E6" }}>
                  {s.insight}
                </p>
                {s.date && (
                  <div
                    className="mt-3 font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: "rgba(245,241,230,0.45)" }}
                  >
                    discovered {s.date}
                  </div>
                )}
              </HoverCardContent>
            )}
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
