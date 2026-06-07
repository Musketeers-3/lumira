import { useQuery } from "@tanstack/react-query";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { discoveryTitle, getRealm } from "@/lib/realms";
import { artifactForSkillName, ARTIFACTS } from "@/lib/artifacts";
import { ArtifactScene } from "@/components/socratic/artifacts/ArtifactScene";

interface SessionRecord {
  id: string;
  topic?: string;
  started_at: string;
  breakthrough?: boolean;
}

interface Props {
  highlightSkill?: string | null;
}

function weekLabel(date: Date) {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay()); // Sunday
  return start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function DiscoveryJournal({ highlightSkill }: Props) {
  const { fetchRecentSessions } = useSessionPersistence();

  const { data: sessions = [], isLoading } = useQuery<SessionRecord[] | null>({
    queryKey: ["journal-sessions"],
    queryFn: () => fetchRecentSessions(20) as Promise<SessionRecord[] | null>,
    staleTime: 1000 * 60,
  });

  const realEntries = (sessions ?? []).filter((s) => s.topic);

  // Demo fallback so the scrapbook is never empty
  const entries: SessionRecord[] =
    realEntries.length > 0
      ? realEntries
      : [
          {
            id: "demo-1",
            topic: "Newtonian Gravity & Orbits",
            started_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            breakthrough: true,
          },
          {
            id: "demo-2",
            topic: "Pressure & Particles",
            started_at: new Date(Date.now() - 86400000 * 5).toISOString(),
            breakthrough: true,
          },
          {
            id: "demo-3",
            topic: "Geometry",
            started_at: new Date(Date.now() - 86400000 * 9).toISOString(),
            breakthrough: false,
          },
        ];

  // Group by week
  const grouped = new Map<string, SessionRecord[]>();
  for (const e of entries) {
    const key = weekLabel(new Date(e.started_at));
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(e);
  }

  const totalWorlds = new Set(
    entries.map((e) => artifactForSkillName(e.topic)?.realm).filter(Boolean),
  ).size;

  return (
    <div className="space-y-6">
      {/* Cover */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(103,232,249,0.04)), rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          aria-hidden
          className="absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, var(--realm-glow), transparent 70%)" }}
        />
        <div className="relative z-10">
          <div
            className="text-[10px] font-medium uppercase tracking-[0.25em]"
            style={{ color: "var(--realm-accent)" }}
          >
            Book of Discoveries
          </div>
          <h3 className="mt-2 text-2xl font-display" style={{ color: "var(--ink-primary)" }}>
            Your Scrapbook
          </h3>
          <p className="mt-2 text-sm max-w-md" style={{ color: "var(--ink-secondary)" }}>
            {entries.length} {entries.length === 1 ? "adventure" : "adventures"} · {totalWorlds}{" "}
            {totalWorlds === 1 ? "world" : "worlds"} visited
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </div>
      )}

      {!isLoading && entries.length === 0 && (
        <p
          className="text-sm font-display italic py-6 text-center"
          style={{ color: "var(--ink-tertiary)" }}
        >
          No memories yet — complete an adventure to seal your first one.
        </p>
      )}

      {!isLoading &&
        Array.from(grouped.entries()).map(([week, weekEntries]) => (
          <div key={week} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span
                className="text-[10px] font-medium uppercase tracking-[0.2em]"
                style={{ color: "var(--ink-tertiary)" }}
              >
                Week of {week} · {weekEntries.length}{" "}
                {weekEntries.length === 1 ? "discovery" : "discoveries"}
              </span>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            {weekEntries.map((entry) => (
              <SceneCard
                key={entry.id}
                entry={entry}
                highlight={!!highlightSkill && !!entry.topic?.includes(highlightSkill)}
              />
            ))}
          </div>
        ))}
    </div>
  );
}

function SceneCard({ entry, highlight }: { entry: SessionRecord; highlight: boolean }) {
  const artifact = artifactForSkillName(entry.topic) ?? ARTIFACTS[0];
  const realm = getRealm(artifact.realm);
  const accent = artifact.accent ?? realm?.accent ?? "#06B6D4";
  const date = new Date(entry.started_at);
  const dayName = date.toLocaleDateString(undefined, { weekday: "long" });
  const title = discoveryTitle(entry.topic ?? "Discovery");

  return (
    <div
      className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-0.5"
      style={{
        background: highlight
          ? `linear-gradient(135deg, ${accent}15, rgba(255,255,255,0.02))`
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${highlight ? accent + "55" : "rgba(255,255,255,0.06)"}`,
        boxShadow: highlight ? `0 0 30px ${accent}33` : undefined,
      }}
    >
      <div className="grid grid-cols-[120px_1fr] gap-4 p-4 sm:grid-cols-[140px_1fr] sm:p-5">
        {/* Artifact scene */}
        <div
          className="relative h-32 sm:h-36 overflow-hidden rounded-xl"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${accent}22, transparent 65%), rgba(8,9,14,0.6)`,
            border: `1px solid ${accent}22`,
          }}
        >
          <ArtifactScene artifact={artifact} variant="inline" className="h-full w-full" />
        </div>

        <div className="flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className="text-base sm:text-lg font-display"
                style={{ color: "var(--ink-primary)" }}
              >
                {title}
              </h4>
              {entry.breakthrough && (
                <span
                  className="text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
                  style={{
                    background: `${accent}22`,
                    color: accent,
                    border: `1px solid ${accent}55`,
                  }}
                >
                  ⭐ Star born
                </span>
              )}
            </div>
            <p
              className="mt-1.5 text-sm italic leading-relaxed font-display"
              style={{ color: "var(--ink-secondary)" }}
            >
              "{artifact.mentorLine}"
            </p>
          </div>

          <div
            className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em]"
            style={{ color: "var(--ink-tertiary)" }}
          >
            <span style={{ color: accent }}>{realm?.shortName}</span>
            <span>·</span>
            <span>{dayName}'s adventure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
