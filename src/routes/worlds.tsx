import { useState, useMemo, memo, useRef, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/socratic/premium/Reveal";
import { GlassPanel } from "@/components/socratic/premium/GlassPanel";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { REALMS, realmFromDomain, type RealmId } from "@/lib/realms";
import { useRealm } from "@/lib/realm-context";
import { ArtifactScene } from "@/components/socratic/artifacts/ArtifactScene";
import { signatureArtifactForRealm } from "@/lib/artifacts";

export const Route = createFileRoute("/worlds")({
  head: () => ({
    meta: [
      { title: "Worlds — Lumira" },
      {
        name: "description",
        content:
          "Explore the connected universe of discovery. Each world holds mysteries waiting for you.",
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

  // CPU OPTIMIZATION: Robust handling of potentially null/undefined data
  const metrics = useMemo(() => {
    let discoveryCount = 0;
    let physicsDiscoveries = 0;

    // Safeguard: default to empty array if skills is null or undefined
    const safeSkills = skills ?? [];

    for (let i = 0; i < safeSkills.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const s = safeSkills[i] as any;
      if (s?.status === "unlocked") {
        discoveryCount++;
        if (realmFromDomain(s?.skill_category) === "physics") {
          physicsDiscoveries++;
        }
      }
    }
    return { discoveryCount, physicsDiscoveries };
  }, [skills]);

  // CPU OPTIMIZATION 2: Pre-compute realm unlock states to O(1) lookups
  const realmStates = useMemo(() => {
    const states: Record<string, boolean> = {};
    for (const realm of REALMS) {
      if (realm.unlocked) {
        states[realm.id] = true;
      } else if (realm.id === "biology" || realm.id === "math") {
        states[realm.id] = metrics.physicsDiscoveries >= 2;
      } else if (realm.id === "history") {
        states[realm.id] = metrics.discoveryCount >= 3;
      } else {
        states[realm.id] = false;
      }
    }
    return states;
  }, [metrics]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-12">
      <Reveal>
        <header className="text-center space-y-4">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.2em]"
            style={{
              color: "var(--realm-accent, #06B6D4)",
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
        {REALMS.map((realm, idx) => (
          <Reveal key={realm.id} delay={idx * 100}>
            <WorldCard
              realm={realm}
              unlocked={realmStates[realm.id]}
              discoveryCount={metrics.discoveryCount}
              physicsDiscoveries={metrics.physicsDiscoveries}
              onSelect={() => setRealm(realm.id)}
            />
          </Reveal>
        ))}
      </div>

      <Reveal delay={400}>
        <GlassPanel className="p-6 text-center">
          <p className="text-sm" style={{ color: "var(--ink-secondary)" }}>
            {metrics.discoveryCount > 0
              ? `You've lit ${metrics.discoveryCount} star${metrics.discoveryCount === 1 ? "" : "s"} across the universe.`
              : "Your constellation begins with a single discovery. Which world calls to you first?"}
          </p>
        </GlassPanel>
      </Reveal>
    </div>
  );
}

// GPU & REACT MEMORY OPTIMIZATION: Memoized Card Component
const WorldCard = memo(function WorldCard({
  realm,
  unlocked,
  discoveryCount,
  physicsDiscoveries,
  onSelect,
}: {
  realm: (typeof REALMS)[number];
  unlocked: boolean;
  discoveryCount: number;
  physicsDiscoveries: number;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const cardRef = useRef<HTMLAnchorElement & HTMLDivElement>(null);

  const navigate = useNavigate();
  const [isExpanding, setIsExpanding] = useState(false);

  const handlePortalEntry = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!unlocked) return;

    setIsExpanding(true); // Fire the expansion

    // Wait 2.5 seconds, then route to the engine
    setTimeout(() => {
      navigate({
        to: "/engine",
        search: {
          lessonId: realm.defaultLessonId ?? "moon-orbit-demo",
          topic: realm.defaultTopic ?? "Exploration",
          objective: realm.defaultObjective ?? "Discover something new.",
          realm: realm.id,
        },
      });
    }, 2500);
  };

  // TOUCH OPTIMIZATION: Viewport Activation for Mobile/Tablets
  useEffect(() => {
    // Only apply the intersection observer if the device lacks hover capabilities (touch screens)
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (hasHover || !unlocked) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Activate the 3D scene and mentor text when 60% of the card is visible
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.6, rootMargin: "-10% 0px -10% 0px" },
    );

    const el = cardRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [unlocked]);

  // The card is active if hovered (desktop) OR in viewport (mobile)
  const isActive = isHovered || isInViewport;

  const artifact = useMemo(() => signatureArtifactForRealm(realm.id), [realm.id]);

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

  const getDynamicPrerequisite = (realmId: RealmId) => {
    if (realmId === "biology" || realmId === "math") {
      const remaining = Math.max(0, 2 - physicsDiscoveries);
      return `${remaining} more Observatory discover${remaining === 1 ? "y" : "ies"} required.`;
    }
    if (realmId === "history") {
      const remaining = Math.max(0, 3 - discoveryCount);
      return `${remaining} more overall discover${remaining === 1 ? "y" : "ies"} required.`;
    }
    return realm.prerequisite ?? "Not yet discovered.";
  };

  const content = (
    <GlassPanel
      elevated={unlocked && isActive}
      glow={unlocked && isActive}
      className={`realm-card group relative overflow-hidden p-0 h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${unlocked ? "cursor-pointer" : "realm-card-locked grayscale-[0.5]"}`}
      style={
        unlocked
          ? {
              borderColor: isActive ? `${realm.accent}66` : `${realm.accent}22`,
              boxShadow: isActive
                ? `0 0 60px ${realm.glow}, var(--shadow-deep)`
                : `0 0 20px transparent, var(--shadow-deep)`,
            }
          : undefined
      }
    >
      <div
        className={`overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isExpanding
            ? "fixed inset-0 z-[100] w-screen h-screen bg-black rounded-none" // Full screen takeover
            : "relative h-48 w-full border-b border-white/5" // Normal card mode
        }`}
      >
        {artifact && unlocked && (
          <div className="absolute inset-0">
            <ArtifactScene
              artifact={artifact}
              variant="hero"
              className="h-full w-full"
              paused={!isActive && !isExpanding}
              isHovered={isActive || isExpanding}
              isExpanding={isExpanding} // Pass the expanding state to WebGL
            />
          </div>
        )}

        {/* The Transition Overlay: Fades in the Mentor Caption during loading */}
        {isExpanding && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-1000 delay-500">
            <h2 className="text-2xl md:text-4xl italic text-white/90 drop-shadow-2xl font-display tracking-wide">
              "{artifact?.mentorLine}"
            </h2>
          </div>
        )}

        {/* CSS adjusted: opacity is tied to isActive rather than just group-hover */}
        {unlocked && artifact?.mentorLine && (
          <div
            className={`absolute inset-0 flex items-end justify-center pb-4 transition-opacity duration-700 ease-in-out bg-gradient-to-t from-[rgba(6,7,10,0.9)] to-transparent pointer-events-none ${isActive ? "opacity-100" : "opacity-0"}`}
          >
            <p
              className="text-xs italic tracking-wide px-6 text-center shadow-sm"
              style={{ color: realm.accent }}
            >
              "{artifact.mentorLine}"
            </p>
          </div>
        )}
      </div>

      <div
        aria-hidden
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle, ${realm.glow}, transparent 70%)`,
          opacity: isActive && unlocked ? 0.6 : 0.1,
        }}
      />

      <div className="relative z-10 space-y-4 p-6 lg:p-7">
        <div className="flex items-start justify-between">
          <span className="text-2xl drop-shadow-md" role="img" aria-label={realm.shortName}>
            {realm.emoji}
          </span>
          {!unlocked && <Lock className="h-4 w-4" style={{ color: "var(--ink-tertiary)" }} />}
        </div>

        <div>
          <h3
            className="text-lg font-semibold tracking-tight font-display transition-colors duration-500"
            style={{ color: unlocked && isActive ? realm.accent : "var(--ink-primary)" }}
          >
            {realm.name}
          </h3>
          <p className="mt-1 text-xs font-medium" style={{ color: realm.accent }}>
            {realm.tagline}
          </p>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "var(--ink-secondary)" }}>
          {unlocked ? realm.description : getDynamicPrerequisite(realm.id)}
        </p>

        {unlocked && (
          <div
            className={`inline-flex items-center text-sm font-medium transition-all duration-500 ease-out ${isActive ? "gap-3" : "gap-2"}`}
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
      <div
        ref={cardRef}
        className="cursor-not-allowed h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      ref={cardRef}
      to={engineLink.to}
      search={engineLink.search}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-2xl"
      style={{ "--tw-ring-color": realm.accent } as React.CSSProperties}
    >
      {content}
    </Link>
  );
});
