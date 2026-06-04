import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Clock, Compass, TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Path — Lumira" },
      { name: "description", content: "Resume your session with a mentor who believes in you." },
      { property: "og:title", content: "Your Path — Lumira" },
      {
        property: "og:description",
        content: "Resume your session with a mentor who believes in you.",
      },
    ],
  }),
  component: Dashboard,
});

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// --- Strict Data Contracts ---
interface SessionRecord {
  id: string;
  lesson_id?: string;
  topic?: string;
  started_at: string;
  duration_seconds?: number;
  breakthrough?: boolean;
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

function Dashboard() {
  const { fetchRecentSessions, fetchSkills } = useSessionPersistence();

  // 1. Fetch live historical session streams
  const { data: rawSessions, isLoading: loadingSessions } = useQuery<SessionRecord[] | null>({
    queryKey: ["dashboard-sessions"],
    queryFn: () => fetchRecentSessions(50) as Promise<SessionRecord[] | null>,
    staleTime: 1000 * 60,
  });

  // 2. Fetch live masteries to dynamically extract genuine user discoveries
  const { data: rawSkills, isLoading: loadingSkills } = useQuery<SkillRecord[] | null>({
    queryKey: ["dashboard-skills"],
    queryFn: () => fetchSkills() as Promise<SkillRecord[] | null>,
    staleTime: 1000 * 60,
  });

  const isLoading = loadingSessions || loadingSkills;

  // --- Type-Safe Dynamic Analytics Aggregator ---
  // Safely fallback to empty arrays if database returns null
  const sessions = rawSessions ?? [];
  const skills = rawSkills ?? [];

  const totalSessionsCount = sessions.length;

  // Calculate real historical hours spent in the dojo
  const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0);
  const totalHoursFormatted = (totalSeconds / 3600).toFixed(1);

  // Filter skills to find only those the user has unlocked independently
  const discoveredSkills = skills.filter((s) => s.status === "unlocked");
  const breakthroughsCount = discoveredSkills.length;

  // Dynamically extract the single most recently unlocked discovery card
  const latestDiscovery = discoveredSkills.sort((a, b) => {
    const timeA = new Date(a.last_practiced ?? a.unlocked_at ?? 0).getTime();
    const timeB = new Date(b.last_practiced ?? b.unlocked_at ?? 0).getTime();
    return timeB - timeA;
  })[0] as SkillRecord | undefined;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero — editorial cinema card */}
      <section
        className="relative overflow-hidden rounded-[2.5rem] p-10 lg:p-16"
        style={{
          background: "var(--bg-onyx)",
          border: "1px solid var(--hairline-strong)",
          boxShadow: "var(--shadow-deep), var(--inset-highlight)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL }}
        />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: "var(--gold-soft)" }}
          >
            <Sparkles className="h-3 w-3" /> Welcome Back, Learner
          </div>
          <h2
            className="text-4xl font-semibold tracking-tight lg:text-5xl"
            style={{ color: "var(--ink-primary)" }}
          >
            Resume Your Socratic Walk.
          </h2>
          <p
            className="text-base leading-relaxed max-w-lg"
            style={{ color: "var(--ink-secondary)" }}
          >
            No lectures. No fast answers. Step back into the environment and uncover structural
            principles through deliberate, guided reasoning.
          </p>
          <div className="pt-4">
            <Link
              to="/engine"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[var(--gold-deep)] to-[var(--gold-soft)] px-6 text-sm font-medium text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(201,162,75,0.3)]"
            >
              Enter The Dojo
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Sessions",
            value: isLoading ? "..." : String(totalSessionsCount).padStart(2, "0"),
            icon: Compass,
          },
          {
            label: "Light Found",
            value: isLoading ? "..." : String(breakthroughsCount).padStart(2, "0"),
            icon: TrendingUp,
          },
          {
            label: "Hours Present",
            value: isLoading ? "..." : `${totalHoursFormatted}h`,
            icon: Clock,
          },
        ].map((m, idx) => (
          <div
            key={idx}
            className="surface-luxe p-6 flex items-center justify-between"
            style={{ background: "var(--bg-onyx-raised)", border: "1px solid var(--hairline)" }}
          >
            <div className="space-y-1">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "var(--ink-tertiary)" }}
              >
                {m.label}
              </span>
              <h4
                className="text-3xl font-semibold tracking-tight"
                style={{ color: "var(--ink-primary)" }}
              >
                {m.value}
              </h4>
            </div>
            <m.icon className="h-5 w-5 opacity-40" style={{ color: "var(--gold-soft)" }} />
          </div>
        ))}
      </div>

      {/* Primary Status Split Panel */}
      <div className="grid gap-6 md:grid-cols-2">
        <div
          className="relative overflow-hidden rounded-[2rem] p-8 flex flex-col justify-between min-h-[280px]"
          style={{ background: "var(--bg-onyx-raised)", border: "1px solid var(--hairline)" }}
        >
          <div className="space-y-3">
            <div
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "var(--ink-tertiary)" }}
            >
              <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--gold-soft)" }} />
              Latest Unlocked Insight
            </div>

            {isLoading ? (
              <div className="flex items-center gap-2 font-mono text-xs py-4 text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Resolving history...
              </div>
            ) : latestDiscovery ? (
              <>
                <h3
                  className="text-2xl font-semibold tracking-tight mt-2"
                  style={{ color: "var(--ink-primary)" }}
                >
                  {latestDiscovery.skill_name ?? latestDiscovery.name}
                </h3>
                <p
                  className="font-display italic text-lg leading-relaxed pt-2"
                  style={{ color: "var(--ink-secondary)" }}
                >
                  "
                  {latestDiscovery.insight ??
                    "You independently reached this conceptual milestone."}
                  "
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium tracking-tight mt-2 text-muted-foreground">
                  The Light is Waiting
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-secondary)" }}>
                  You haven't recorded any breakthroughs yet. Step into the dojo to begin parsing
                  your first core concepts.
                </p>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              {latestDiscovery?.unlocked_at
                ? `Discovered ${new Date(latestDiscovery.unlocked_at).toLocaleDateString()}`
                : "System Primed"}
            </span>
            <Link
              to="/skill-passport"
              className="inline-flex items-center gap-1.5 text-xs transition-colors duration-300"
              style={{ color: "var(--gold-soft)" }}
            >
              View Skill Passport <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Path Card */}
        <div
          className="rounded-[2rem] p-8 flex flex-col justify-between min-h-[280px]"
          style={{ background: "var(--bg-onyx-raised)", border: "1px solid var(--hairline)" }}
        >
          <div className="space-y-2">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "var(--ink-tertiary)" }}
            >
              Active Environment
            </span>
            <h3
              className="text-2xl font-semibold tracking-tight"
              style={{ color: "var(--ink-primary)" }}
            >
              Newtonian Gravity & Orbits
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--ink-secondary)" }}>
              Analyze the geometric paths of bodies in motion. Prove why massive items constantly
              fall toward a center point but never crash.
            </p>
          </div>
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-500/80 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
              In Progress
            </span>
            <Link
              to="/engine"
              className="inline-flex items-center gap-1.5 text-xs transition-colors duration-300"
              style={{ color: "var(--gold-soft)" }}
            >
              Resume Walk <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
