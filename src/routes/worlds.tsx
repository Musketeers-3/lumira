import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/socratic/premium/Reveal";
import { GlassPanel } from "@/components/socratic/premium/GlassPanel";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { REALMS, realmFromDomain } from "@/lib/realms";
import { useRealm } from "@/lib/realm-context";
import { ArtifactScene } from "@/components/socratic/artifacts/ArtifactScene";
import { signatureArtifactForRealm } from "@/lib/artifacts";

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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {REALMS.map((realm, idx) => {
          const unlocked = isRealmUnlocked(realm.id);
          return (
            <Reveal key={realm.id} delay={idx * 100}>
              <WorldCard realm={realm} unlocked={unlocked} onHover={() => setRealm(realm.id)} />
            </Reveal>
          );
        })}
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
  const artifact = signatureArtifactForRealm(realm.id);
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
      className={`realm-card group relative overflow-hidden p-0 h-full ${unlocked ? "" : "realm-card-locked"}`}
      style={
        unlocked
          ? {
              borderColor: `${realm.accent}33`,
              boxShadow: `0 0 40px ${realm.glow}, var(--shadow-deep)`,
            }
          : undefined
      }
    >
      {/* Diorama */}
      <div
        className="relative h-44 w-full overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${realm.glow}, transparent 65%), linear-gradient(180deg, rgba(8,9,14,0.4), rgba(6,7,10,0.9))`,
          borderBottom: `1px solid ${realm.accent}22`,
        }}
      >
        {artifact && unlocked && (
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
            <ArtifactScene artifact={artifact} variant="hero" className="h-full w-full" />
          </div>
        )}
        {!unlocked && artifact && (
          <div className="absolute inset-0 opacity-25 grayscale">
            <ArtifactScene artifact={artifact} variant="hero" className="h-full w-full" paused />
          </div>
        )}

        {/* Mentor + student silhouettes (tiny SVG cameo) */}
        {unlocked && (
          <svg
            className="pointer-events-none absolute bottom-2 left-3 opacity-60 transition-opacity group-hover:opacity-90"
            width="50"
            height="32"
            viewBox="0 0 50 32"
            aria-hidden
          >
            <g fill={realm.accent}>
              {/* mentor */}
              <circle cx="14" cy="10" r="3.5" />
              <path d="M8 30 L8 18 Q8 14 14 14 Q20 14 20 18 L20 30 Z" />
              {/* student (smaller) */}
              <circle cx="30" cy="14" r="2.8" />
              <path d="M25 30 L25 20 Q25 17 30 17 Q35 17 35 20 L35 30 Z" />
              {/* pointing arm */}
              <path d="M18 16 L26 12" stroke={realm.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        )}
      </div>

      <div
        aria-hidden
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${realm.glow}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 space-y-4 p-6 lg:p-7">
        <div className="flex items-start justify-between">
          <span className="text-2xl" role="img" aria-label={realm.shortName}>
            {realm.emoji}
          </span>
          {!unlocked && <Lock className="h-4 w-4" style={{ color: "var(--ink-tertiary)" }} />}
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight font-display" style={{ color: "var(--ink-primary)" }}>
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
      <div onMouseEnter={onHover} className="cursor-not-allowed h-full">
        {content}
      </div>
    );
  }

  return (
    <Link to={engineLink.to} search={engineLink.search} onMouseEnter={onHover} className="block h-full">
      {content}
    </Link>
  );
}
