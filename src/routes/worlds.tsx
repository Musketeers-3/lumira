import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/socratic/premium/Reveal";
import { GlassPanel } from "@/components/socratic/premium/GlassPanel";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { REALMS, realmFromDomain } from "@/lib/realms";
import { useRealm } from "@/lib/realm-context";

export const Route = createFileRoute("/worlds")({
  head: () => ({
    meta: [
      { title: "Worlds — Lumira" },
      {
        name: "description",
        content: "Explore the connected universe of discovery. Each world holds mysteries waiting for you.",
      },
    ],
  }),
  component: WorldsPage,
});

function WorldsPage() {
  const { setRealm } = useRealm();
  const { fetchSkills } = useSessionPersistence();

  const { data: skills = [] } = useQuery({
    queryKey: ["worlds-skills"],
    queryFn: () => fetchSkills(),
    staleTime: 1000 * 60,
  });

  const discoveryCount = (skills ?? []).filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s: any) => s.status === "unlocked",
  ).length;

  const physicsDiscoveries = (skills ?? []).filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s: any) => s.status === "unlocked" && realmFromDomain(s.skill_category) === "physics",
  ).length;

  const isRealmUnlocked = (realmId: string) => {
    const realm = REALMS.find((r) => r.id === realmId);
    if (!realm) return false;
    if (realm.unlocked) return true;
    if (realmId === "biology" || realmId === "math") return physicsDiscoveries >= 2;
    if (realmId === "history") return discoveryCount >= 3;
    return false;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-12">
      <Reveal>
        <header className="text-center space-y-4">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.2em]"
            style={{
              color: "var(--realm-accent)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            The Academy Atlas
          </div>
          <h1 className="text-hero font-display" style={{ color: "var(--ink-primary)" }}>
            Choose Your <span className="italic text-gold">World</span>
          </h1>
          <p className="mx-auto max-w-lg text-base" style={{ color: "var(--ink-secondary)" }}>
            Each realm is a place where understanding lives. Step through a portal and let your
            mentor guide you into the unknown.
          </p>
        </header>
      </Reveal>

      {/* Atlas grid — hub-and-spoke layout */}
      <div className="relative">
        {/* Center hub indicator */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full opacity-20 pointer-events-none hidden lg:block"
          style={{
            border: "1px solid var(--realm-accent)",
            boxShadow: "0 0 60px var(--realm-glow)",
          }}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REALMS.map((realm, idx) => {
            const unlocked = isRealmUnlocked(realm.id);
            return (
              <Reveal key={realm.id} delay={idx * 100}>
                <WorldCard realm={realm} unlocked={unlocked} onHover={() => setRealm(realm.id)} />
              </Reveal>
            );
          })}
        </div>
      </div>

      <Reveal delay={400}>
        <GlassPanel className="p-6 text-center">
          <p className="text-sm" style={{ color: "var(--ink-secondary)" }}>
            {discoveryCount > 0
              ? `You've lit ${discoveryCount} star${discoveryCount === 1 ? "" : "s"} across the universe.`
              : "Your constellation begins with a single discovery. Which world calls to you first?"}
          </p>
        </GlassPanel>
      </Reveal>
    </div>
  );
}

function WorldCard({
  realm,
  unlocked,
  onHover,
}: {
  realm: (typeof REALMS)[number];
  unlocked: boolean;
  onHover: () => void;
}) {
  const engineLink = unlocked
    ? {
        to: "/engine" as const,
        search: {
          lessonId: realm.defaultLessonId ?? "moon-orbit-demo",
          topic: realm.defaultTopic ?? "Exploration",
          objective: realm.defaultObjective ?? "Discover something new.",
          realm: realm.id,
        },
      }
    : null;

  const content = (
    <GlassPanel
      elevated={unlocked}
      glow={unlocked}
      className={`realm-card relative overflow-hidden p-6 lg:p-8 h-full ${unlocked ? "" : "realm-card-locked"}`}
      style={
        unlocked
          ? {
              borderColor: `${realm.accent}33`,
              boxShadow: `0 0 40px ${realm.glow}, var(--shadow-deep)`,
            }
          : undefined
      }
    >
      {/* Realm ambient glow */}
      <div
        aria-hidden
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${realm.glow}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <span className="text-3xl" role="img" aria-label={realm.shortName}>
            {realm.emoji}
          </span>
          {!unlocked && (
            <Lock className="h-4 w-4" style={{ color: "var(--ink-tertiary)" }} />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight" style={{ color: "var(--ink-primary)" }}>
            {realm.name}
          </h3>
          <p className="mt-1 text-xs font-medium" style={{ color: realm.accent }}>
            {realm.tagline}
          </p>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "var(--ink-secondary)" }}>
          {unlocked ? realm.description : (realm.prerequisite ?? "Not yet discovered")}
        </p>

        {unlocked && (
          <div
            className="inline-flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3"
            style={{ color: realm.accent }}
          >
            Enter world <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </div>
    </GlassPanel>
  );

  if (!engineLink) {
    return (
      <div onMouseEnter={onHover} className="cursor-not-allowed">
        {content}
      </div>
    );
  }

  return (
    <Link to={engineLink.to} search={engineLink.search} onMouseEnter={onHover}>
      {content}
    </Link>
  );
}
