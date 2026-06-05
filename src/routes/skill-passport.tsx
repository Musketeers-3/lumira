import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Star, Loader2 } from "lucide-react";
import { discoveryTitle } from "@/lib/realms";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useQuery } from "@tanstack/react-query";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { ConstellationGraph, type ConstellationStar } from "@/components/socratic/ConstellationGraph";
import { DiscoveryJournal } from "@/components/socratic/DiscoveryJournal";
import { ARTIFACTS } from "@/lib/artifacts";
import { Reveal } from "@/components/socratic/premium/Reveal";

export const Route = createFileRoute("/skill-passport")({
  head: () => ({
    meta: [
      { title: "Your Constellation — Lumira" },
      {
        name: "description",
        content:
          "Every star here is a discovery you made on your own, beside a mentor who believed you could.",
      },
      { property: "og:title", content: "Your Constellation — Lumira" },
      {
        property: "og:description",
        content:
          "Every star here is a discovery you made on your own, beside a mentor who believed you could.",
      },
    ],
  }),
  component: SkillPassport,
});

export interface Skill {
  id: string;
  name: string;
  domain: string;
  mastery: number;
  status: "unlocked" | "in-progress" | "locked";
  date?: string;
  insight?: string;
}

function SkillPassport() {
  const { fetchSkills } = useSessionPersistence();
  const [selectedStar, setSelectedStar] = useState<ConstellationStar | null>(null);

  const {
    data: skills = [],
    isLoading,
    isError,
  } = useQuery<Skill[]>({
    queryKey: ["user-skills"],
    queryFn: async () => {
      try {
        const rawData = await fetchSkills();

        const dataToMap =
          rawData && rawData.length > 0
            ? rawData
            : [
                {
                  skill_name: "Orbits & Gravity",
                  skill_category: "Physical Reasoning",
                  mastery_score: 92,
                  status: "unlocked",
                  insight:
                    "An orbit is falling while moving sideways fast enough to keep missing the ground.",
                },
                {
                  skill_name: "Pressure & Particles",
                  skill_category: "Matter & Energy",
                  mastery_score: 78,
                  status: "unlocked",
                  insight: "Pressure is countless tiny collisions adding up.",
                },
                {
                  skill_name: "Scientific Method",
                  skill_category: "Meta-skill",
                  mastery_score: 64,
                  status: "in-progress",
                },
              ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return dataToMap.map((item: any) => ({
          id: item.id ?? Math.random().toString(),
          name: item.skill_name ?? "Unknown Skill",
          domain: item.skill_category ?? "General",
          mastery: item.mastery_score ?? 0,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: (item.status ?? "locked") as any,
          date: item.unlocked_at,
          insight: item.insight,
        }));
      } catch (err) {
        console.error("Database connection failed, running fallback mock engine", err);
        return [];
      }
    },
  });

  const constellationStars: ConstellationStar[] = skills.map((s) => ({
    id: s.id,
    name: s.name,
    domain: s.domain,
    unlocked: s.status === "unlocked",
    insight: s.insight,
    date: s.date,
  }));

  const unlockedArtifacts = ARTIFACTS.filter((a) =>
    skills.some((s) => s.status === "unlocked" && s.name.toLowerCase().includes(a.skillName.toLowerCase().split(" ")[0])),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header>
        <div
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: "var(--realm-accent)" }}
        >
          Constellation of Understanding
        </div>
        <h1
          className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl font-display"
          style={{ color: "var(--ink-primary)" }}
        >
          Your Constellation
        </h1>
        <p className="mt-2 max-w-xl" style={{ color: "var(--ink-secondary)" }}>
          Each star is something you discovered yourself. Tap a star to read its memory.
        </p>
      </header>

      <Reveal>
        <ConstellationGraph
          stars={constellationStars}
          selectedId={selectedStar?.id}
          onSelectStar={setSelectedStar}
        />
      </Reveal>

      {selectedStar?.insight && (
        <Reveal delay={100}>
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--realm-glow)",
              border: "1px solid var(--realm-accent)",
            }}
          >
            <div className="text-xs uppercase tracking-[0.15em] font-medium" style={{ color: "var(--realm-accent)" }}>
              Memory · {discoveryTitle(selectedStar.name)}
            </div>
            <p className="mt-3 font-display italic text-lg leading-relaxed" style={{ color: "var(--ink-primary)" }}>
              &ldquo;{selectedStar.insight}&rdquo;
            </p>
            {selectedStar.date && (
              <p className="mt-2 text-xs" style={{ color: "var(--ink-tertiary)" }}>
                Discovered {new Date(selectedStar.date).toLocaleDateString()}
              </p>
            )}
          </div>
        </Reveal>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal delay={150}>
          <DiscoveryJournal highlightSkill={selectedStar?.name ?? null} />
        </Reveal>

        <Reveal delay={200}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-display" style={{ color: "var(--ink-primary)" }}>
              Artifacts
            </h3>
            <p className="text-sm" style={{ color: "var(--ink-secondary)" }}>
              Objects collected from your adventures, resting in your worlds.
            </p>
            <div className="grid gap-3">
              {unlockedArtifacts.length === 0 ? (
                <p className="text-sm font-display italic" style={{ color: "var(--ink-tertiary)" }}>
                  No artifacts yet. Discover something new to collect your first treasure.
                </p>
              ) : (
                unlockedArtifacts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span className="text-2xl">{a.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>
                        {a.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--ink-tertiary)" }}>
                        {a.description}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="surface-luxe p-5">
              <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
            </div>
          ))}

        {isError && (
          <div className="col-span-full rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
            Failed to load your discoveries. The connection might be unstable.
          </div>
        )}

        {!isLoading &&
          skills.map((s) => (
            <HoverCard key={s.id} openDelay={120}>
              <HoverCardTrigger asChild>
                <div
                  className={`surface-luxe group cursor-default p-5 transition-all duration-500 hover:-translate-y-1 ${
                    s.status === "locked" ? "opacity-50" : ""
                  }`}
                  style={
                    s.status === "unlocked"
                      ? { boxShadow: "var(--shadow-deep), 0 0 0 1px var(--realm-accent)" }
                      : undefined
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                      {s.domain}
                    </div>
                    {s.status === "unlocked" && (
                      <Star className="h-4 w-4" style={{ color: "var(--realm-accent)" }} fill="var(--realm-accent)" />
                    )}
                    {s.status === "in-progress" && (
                      <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--realm-accent)" }} />
                    )}
                    {s.status === "locked" && (
                      <Lock className="h-4 w-4" style={{ color: "var(--ink-tertiary)" }} />
                    )}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight font-display" style={{ color: "var(--ink-primary)" }}>
                    {s.status === "unlocked" ? discoveryTitle(s.name) : s.name}
                  </h3>
                  {s.status === "unlocked" && (
                    <div className="mt-3 text-xs" style={{ color: "var(--realm-accent)" }}>
                      ✦ Discovered
                    </div>
                  )}
                  {s.status === "in-progress" && (
                    <div className="mt-3 text-xs" style={{ color: "var(--ink-tertiary)" }}>
                      Forming...
                    </div>
                  )}
                </div>
              </HoverCardTrigger>
              {s.insight && (
                <HoverCardContent className="w-72 backdrop-blur-xl" style={{ border: "1px solid var(--realm-accent)" }}>
                  <div className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--realm-accent)" }}>
                    Memory
                  </div>
                  <p className="mt-1.5 text-sm italic" style={{ color: "var(--ink-primary)" }}>
                    {s.insight}
                  </p>
                </HoverCardContent>
              )}
            </HoverCard>
          ))}
      </div>
    </div>
  );
}
