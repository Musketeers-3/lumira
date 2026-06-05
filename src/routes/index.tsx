import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Compass,
  Loader2,
  Zap,
  Map,
  Star,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { Reveal } from "@/components/socratic/premium/Reveal";
import { GlassPanel } from "@/components/socratic/premium/GlassPanel";
import { PremiumButton } from "@/components/socratic/premium/PremiumButton";
import { ConstellationPreview } from "@/components/socratic/ConstellationPreview";
import { discoveryTitle, realmFromDomain } from "@/lib/realms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Discovery Hub — Lumira" },
      { name: "description", content: "Your mentor discovered something waiting for you." },
      { property: "og:title", content: "Discovery Hub — Lumira" },
      {
        property: "og:description",
        content: "Your mentor discovered something waiting for you.",
      },
    ],
  }),
  component: DiscoveryHub,
});

interface SessionRecord {
  id: string;
  lesson_id?: string;
  topic?: string;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  breakthrough?: boolean;
  messages_count?: number;
  state_progression?: string[];
}

interface SkillRecord {
  id?: string;
  name?: string;
  skill_name?: string;
  domain?: string;
  skill_category?: string;
  mastery?: number;
  mastery_score?: number;
  status?: "unlocked" | "in-progress" | "locked";
  unlocked_at?: string;
  last_practiced?: string;
  insight?: string;
}

const TOTAL_STEPS = 5;

function computeProgress(session: SessionRecord): number {
  if (session.breakthrough) return 100;
  const fromMessages = Math.min(
    100,
    Math.round(((session.messages_count ?? 0) / TOTAL_STEPS) * 100),
  );
  const fromStates = session.state_progression?.length
    ? Math.min(100, Math.round((session.state_progression.length / TOTAL_STEPS) * 100))
    : 0;
  return Math.max(fromMessages, fromStates, 8);
}

function DiscoveryHub() {
  const { fetchRecentSessions, fetchSkills } = useSessionPersistence();

  const { data: rawSessions, isLoading: loadingSessions } = useQuery<SessionRecord[] | null>({
    queryKey: ["dashboard-sessions"],
    queryFn: () => fetchRecentSessions(50) as Promise<SessionRecord[] | null>,
    staleTime: 1000 * 60,
  });

  const { data: rawSkills, isLoading: loadingSkills } = useQuery<SkillRecord[] | null>({
    queryKey: ["dashboard-skills"],
    queryFn: () => fetchSkills() as Promise<SkillRecord[] | null>,
    staleTime: 1000 * 60,
  });

  const isLoading = loadingSessions || loadingSkills;
  const sessions = rawSessions ?? [];
  const skills = rawSkills ?? [];

  const discoveredSkills = skills.filter((s) => s.status === "unlocked");
  const starCount = discoveredSkills.length;
  const journeyCount = sessions.length;

  const activeSession =
    sessions.find((s) => !s.completed_at) ?? sessions[0] ?? null;

  const progress = activeSession ? computeProgress(activeSession) : 0;
  const isComplete = activeSession?.breakthrough || progress >= 100;

  const latestDiscovery = [...discoveredSkills].sort((a, b) => {
    const timeA = new Date(a.last_practiced ?? a.unlocked_at ?? 0).getTime();
    const timeB = new Date(b.last_practiced ?? b.unlocked_at ?? 0).getTime();
    return timeB - timeA;
  })[0] as SkillRecord | undefined;

  const mysteryText = activeSession?.topic
    ? `One mystery remains in ${activeSession.topic}`
    : "One mystery remains unsolved";

  const engineSearch = activeSession
    ? {
        lessonId: activeSession.lesson_id ?? "moon-orbit-demo",
        topic: activeSession.topic ?? "Newtonian Gravity & Orbits",
        objective: "Continue your exploration where you left off.",
        realm: realmFromDomain(
          skills.find((s) => s.skill_name === activeSession.topic)?.skill_category,
        ),
      }
    : {
        lessonId: "moon-orbit-demo",
        topic: "Newtonian Gravity & Orbits",
        objective: "Discover that an orbit is continuous falling combined with sideways motion.",
        realm: "physics" as const,
      };

  const constellationStars = skills.map((s) => ({
    id: s.id ?? s.skill_name ?? s.name ?? Math.random().toString(),
    name: s.skill_name ?? s.name ?? "Discovery",
    unlocked: s.status === "unlocked",
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-12 lg:space-y-16 pb-12">
      {/* Cinematic hero */}
      <Reveal>
        <section className="relative">
          <GlassPanel elevated glow className="relative overflow-hidden p-10 lg:p-20">
            <div
              aria-hidden
              className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-[0.2] pointer-events-none"
              style={{
                border: "1px solid var(--realm-accent)",
                boxShadow: "0 0 80px var(--realm-glow), inset 0 0 60px var(--realm-glow)",
                animation: "orb-drift 30s ease-in-out infinite",
              }}
            />

            <div className="relative z-10 max-w-3xl space-y-8">
              <div
                className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] glass-panel"
                style={{ color: "var(--realm-accent)", borderRadius: "9999px" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Welcome Back, Explorer
              </div>

              <h2 className="text-hero font-display" style={{ color: "var(--ink-primary)" }}>
                Your adventure
                <br />
                <span className="italic font-normal" style={{ color: "var(--realm-accent)" }}>
                  continues.
                </span>
              </h2>

              <p
                className="text-lg leading-relaxed max-w-xl font-display italic"
                style={{ color: "var(--ink-secondary)" }}
              >
                {starCount > 0
                  ? "Your mentor discovered something waiting for you."
                  : "A new world is ready. Step through the portal and see what you can find."}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <PremiumButton
                  to="/engine"
                  search={engineSearch}
                  variant="gold"
                  size="lg"
                  icon={<Zap className="h-4 w-4" />}
                >
                  {activeSession && !isComplete ? "Continue Adventure" : "Begin Exploring"}
                </PremiumButton>
                <PremiumButton to="/worlds" variant="glass" size="lg" icon={<Map className="h-4 w-4" />}>
                  Explore Worlds
                </PremiumButton>
              </div>
            </div>
          </GlassPanel>
        </section>
      </Reveal>

      {/* Constellation + journey summary (replaces metric cards) */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal delay={80}>
          <ConstellationPreview stars={constellationStars} isLoading={isLoading} />
        </Reveal>

        <Reveal delay={160}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 h-full">
            <div
              className="glass-panel p-6 flex items-center gap-4"
              style={{ borderRadius: "1rem" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: "var(--realm-glow)",
                  border: "1px solid var(--realm-accent)",
                }}
              >
                <Compass className="h-5 w-5" style={{ color: "var(--realm-accent)" }} />
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Journeys taken
                </span>
                <p className="text-2xl font-semibold" style={{ color: "var(--ink-primary)" }}>
                  {isLoading ? "—" : journeyCount}
                </p>
              </div>
            </div>
            <div
              className="glass-panel p-6 flex items-center gap-4"
              style={{ borderRadius: "1rem" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: "var(--realm-glow)",
                  border: "1px solid var(--realm-accent)",
                }}
              >
                <Star className="h-5 w-5" style={{ color: "var(--realm-accent)" }} fill="currentColor" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Stars discovered
                </span>
                <p className="text-2xl font-semibold" style={{ color: "var(--ink-primary)" }}>
                  {isLoading ? "—" : starCount}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Journey strip — three adventure cards */}
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Continue adventure */}
        <Reveal className="lg:col-span-5" delay={100}>
          <GlassPanel
            elevated
            glow
            float
            className="flex flex-col justify-between min-h-[340px] p-8 lg:p-10 h-full"
          >
            <div className="space-y-5">
              <span
                className="text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "var(--realm-accent)" }}
              >
                {isComplete ? "Last adventure" : "You are here"}
              </span>
              <h3 className="text-section" style={{ color: "var(--ink-primary)" }}>
                {activeSession?.topic ?? "Newtonian Gravity & Orbits"}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "var(--ink-secondary)" }}>
                {mysteryText}
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs uppercase tracking-[0.12em]" style={{ color: "var(--ink-tertiary)" }}>
                  <span>Progress</span>
                  <span style={{ color: "var(--realm-accent)" }}>
                    {isComplete ? "Complete" : "In Progress"}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${isComplete ? 100 : progress}%`,
                      background: `linear-gradient(90deg, var(--realm-accent), var(--gold-soft))`,
                      boxShadow: "0 0 12px var(--realm-glow)",
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              className="mt-8 pt-6 flex items-center justify-between"
              style={{ borderTop: "1px solid var(--hairline)" }}
            >
              <span
                className="text-xs rounded-full px-3 py-1 font-medium"
                style={{
                  color: "var(--realm-accent)",
                  background: "var(--realm-glow)",
                  border: "1px solid var(--realm-accent)",
                }}
              >
                {activeSession ? "Active Journey" : "Ready to Begin"}
              </span>
              <Link
                to="/engine"
                search={engineSearch}
                className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-3"
                style={{ color: "var(--realm-accent)" }}
              >
                {activeSession && !isComplete ? "Resume" : "Start"} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </GlassPanel>
        </Reveal>

        {/* Latest discovery */}
        <Reveal className="lg:col-span-4" delay={200}>
          <GlassPanel
            elevated
            className="flex flex-col justify-between min-h-[340px] p-8 lg:p-10 h-full"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                <Star className="h-3.5 w-3.5" style={{ color: "var(--realm-accent)" }} fill="currentColor" />
                Latest Discovery
              </div>

              {isLoading ? (
                <div className="flex items-center gap-2 text-sm py-6" style={{ color: "var(--ink-tertiary)" }}>
                  <Loader2 className="h-4 w-4 animate-spin" /> Searching the stars...
                </div>
              ) : latestDiscovery ? (
                <>
                  <h3 className="text-section" style={{ color: "var(--ink-primary)" }}>
                    {discoveryTitle(latestDiscovery.skill_name ?? latestDiscovery.name ?? "")}
                  </h3>
                  <p
                    className="font-display italic text-xl lg:text-2xl leading-relaxed"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    &ldquo;
                    {latestDiscovery.insight ??
                      "You independently reached this conceptual milestone."}
                    &rdquo;
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-section" style={{ color: "var(--ink-secondary)" }}>
                    Your first star awaits
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: "var(--ink-tertiary)" }}>
                    Step into a world and discover something on your own. It will become a star in
                    your constellation.
                  </p>
                </>
              )}
            </div>

            <div
              className="mt-8 pt-6 flex items-center justify-between"
              style={{ borderTop: "1px solid var(--hairline)" }}
            >
              <span className="text-xs uppercase tracking-[0.12em]" style={{ color: "var(--ink-tertiary)" }}>
                {latestDiscovery?.unlocked_at
                  ? `Born ${new Date(latestDiscovery.unlocked_at).toLocaleDateString()}`
                  : "Uncharted"}
              </span>
              <Link
                to="/skill-passport"
                className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-3"
                style={{ color: "var(--realm-accent)" }}
              >
                Your Constellation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </GlassPanel>
        </Reveal>

        {/* Next portal */}
        <Reveal className="lg:col-span-3" delay={300}>
          <GlassPanel
            elevated
            className="flex flex-col justify-between min-h-[340px] p-8 h-full"
          >
            <div className="space-y-5">
              <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                Next Portal
              </span>
              <div className="text-4xl">🌌</div>
              <h3 className="text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>
                Observatory of Physics
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-secondary)" }}>
                Why do moons never fall down? Your mentor is waiting among the stars.
              </p>
            </div>

            <Link
              to="/worlds"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
              style={{ color: "var(--realm-accent)" }}
            >
              See all worlds <ArrowRight className="h-4 w-4" />
            </Link>
          </GlassPanel>
        </Reveal>
      </div>
    </div>
  );
}
