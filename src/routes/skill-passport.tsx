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
  {
    name: "Binary Search",
    domain: "Computational Thinking",
    mastery: 92,
    status: "unlocked",
    date: "May 21, 2026",
    insight: "Halving the search space at every step.",
  },
  {
    name: "Recursion",
    domain: "Algorithms",
    mastery: 78,
    status: "unlocked",
    date: "May 18, 2026",
    insight: "A function solving a smaller version of itself.",
  },
  {
    name: "Computational Thinking",
    domain: "Meta-skill",
    mastery: 64,
    status: "in-progress",
    insight: "Decompose, pattern, abstract, design.",
  },
  {
    name: "Big-O Intuition",
    domain: "Complexity",
    mastery: 40,
    status: "in-progress",
    insight: "Cost as input grows, not absolute time.",
  },
  { name: "Dynamic Programming", domain: "Algorithms", mastery: 0, status: "locked" },
  { name: "Graph Reasoning", domain: "Discrete Math", mastery: 0, status: "locked" },
];

function SkillPassport() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-state-accent transition-colors duration-700">
          ideas you reached on your own
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl">Your Light</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Each one of these — you weren't told. You found it. The mentor only walked beside you.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <HoverCard key={s.name} openDelay={120}>
            <HoverCardTrigger asChild>
              <div
                className={`group cursor-default rounded-2xl border border-glass-border bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.06] ${
                  s.status === "locked" ? "opacity-50" : ""
                }`}
                style={
                  s.status === "unlocked"
                    ? { boxShadow: "0 0 0 1px transparent", transition: "all 500ms" }
                    : undefined
                }
              >
                <div className="flex items-start justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {s.domain}
                  </div>
                  {s.status === "unlocked" && (
                    <BadgeCheck
                      className="h-4 w-4 text-state-accent transition-colors duration-700"
                      strokeWidth={1.5}
                    />
                  )}
                  {s.status === "in-progress" && (
                    <Loader2
                      className="h-4 w-4 animate-spin text-muted-foreground"
                      strokeWidth={1.5}
                    />
                  )}
                  {s.status === "locked" && (
                    <Lock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{s.name}</h3>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${s.mastery}%`,
                      background: "var(--state-accent)",
                      boxShadow: s.mastery > 0 ? "0 0 10px var(--state-glow)" : "none",
                    }}
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>{s.status}</span>
                  <span>{s.mastery}% mastery</span>
                </div>
              </div>
            </HoverCardTrigger>
            {s.insight && (
              <HoverCardContent className="w-72 border-glass-border bg-[oklch(0.14_0.03_270/0.95)] backdrop-blur-xl">
                <div className="font-mono text-[10px] uppercase tracking-widest text-state-accent transition-colors duration-700">
                  Core insight
                </div>
                <p className="mt-1.5 text-sm italic">{s.insight}</p>
                {s.date && (
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
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
