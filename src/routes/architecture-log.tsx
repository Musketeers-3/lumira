import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";

export const Route = createFileRoute("/architecture-log")({
  head: () => ({
    meta: [
      { title: "Journal — Lumira" },
      {
        name: "description",
        content: "A record of every adventure you and your mentor have shared together.",
      },
      { property: "og:title", content: "Journal — Lumira" },
      {
        property: "og:description",
        content: "A record of every adventure you and your mentor have shared together.",
      },
    ],
  }),
  component: ArchitectureLog,
});

// --- Strict Data Contracts ---
interface SessionRecord {
  id: string;
  lesson_id?: string;
  topic?: string;
  started_at: string;
  state_progression?: string[];
  breakthrough?: boolean;
}

function ArchitectureLog() {
  const { fetchRecentSessions } = useSessionPersistence();

  // Fetch real historical logs with strict typing
  const {
    data: rawSessions,
    isLoading,
    isError,
  } = useQuery<SessionRecord[] | null>({
    queryKey: ["journey-log"],
    queryFn: () => fetchRecentSessions(20) as Promise<SessionRecord[] | null>,
    staleTime: 1000 * 60 * 5,
  });

  // Safely fallback to an empty array to defend against unauthenticated null returns
  const sessions = rawSessions ?? [];

  // Dynamic parser to translate backend state arrays into the UI's intent tags
  const parseIntents = (progression: string[] = [], hasBreakthrough: boolean = false) => {
    const counts = progression.reduce((acc: Record<string, number>, state) => {
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});

    const tags: string[] = [];
    if (counts["FOCUS"]) tags.push(`Hints x${counts["FOCUS"]}`);
    if (counts["CHALLENGE"]) tags.push(`Challenges x${counts["CHALLENGE"]}`);
    if (hasBreakthrough || counts["CELEBRATE"]) tags.push("Star born");

    return tags.length > 0 ? tags : ["Adventure begun"];
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <div
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: "var(--realm-accent)" }}
        >
          Mentorship moments
        </div>
        <h1
          className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl font-display"
          style={{ color: "var(--ink-primary)" }}
        >
          Your Journal
        </h1>
        <p className="mt-2 max-w-xl" style={{ color: "var(--ink-secondary)" }}>
          Every adventure you've shared with your mentor — the questions, the challenges, and the
          moments a new star was born.
        </p>
      </header>

      <div className="relative pl-8">
        {/* Timeline rule */}
        <div
          className="absolute left-3 top-2 bottom-2 w-px"
          style={{
            background:
              "linear-gradient(to bottom, rgba(201,162,75,0.6), rgba(201,162,75,0.15) 60%, transparent)",
            boxShadow: "0 0 12px rgba(201,162,75,0.25)",
          }}
        />

        <div className="space-y-5">
          {/* Cinematic Loading Skeleton */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`skel-${i}`} className="relative">
                <span className="absolute -left-[22px] top-5 h-2.5 w-2.5 rounded-full bg-white/10" />
                <div
                  className="surface-luxe p-5"
                  style={{ borderLeft: "2px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex justify-between">
                    <div className="h-5 w-48 animate-pulse rounded bg-white/5" />
                    <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
                  </div>
                  <div className="mt-4 h-3 w-3/4 animate-pulse rounded bg-white/5" />
                  <div className="mt-5 flex gap-2">
                    <div className="h-5 w-24 animate-pulse rounded-full bg-white/5" />
                    <div className="h-5 w-32 animate-pulse rounded-full bg-white/5" />
                  </div>
                </div>
              </div>
            ))}

          {/* Connection Error State */}
          {isError && (
            <div className="relative rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
              Unable to sync with the historical logs. Check local connection.
            </div>
          )}

          {/* Empty State */}
          {!isLoading && sessions.length === 0 && !isError && (
            <div
              className="relative p-6 text-sm italic font-display"
              style={{ color: "var(--ink-tertiary)" }}
            >
              Your journal is blank. Step into a world to begin your first adventure.
            </div>
          )}

          {/* Live Data Render (Strictly Typed) */}
          {!isLoading &&
            sessions.map((s: SessionRecord) => {
              const dateObj = new Date(s.started_at);
              const formattedDate = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const formattedTime = dateObj.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              // Execute safe parsing utilizing the strict fallbacks
              const intents = parseIntents(s.state_progression, s.breakthrough);

              return (
                <div key={s.id} className="relative">
                  <span
                    className="absolute -left-[22px] top-5 h-2.5 w-2.5 rounded-full"
                    style={{
                      background: "var(--gold-soft)",
                      boxShadow:
                        "0 0 12px rgba(201,162,75,0.7), inset 0 1px 0 rgba(255,255,255,0.3)",
                    }}
                  />
                  <div
                    className="surface-luxe p-5 transition-all duration-500 hover:-translate-y-0.5"
                    style={{ borderLeft: "2px solid var(--state-accent)" }}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3
                        className="text-lg font-semibold tracking-tight"
                        style={{ color: "var(--ink-primary)" }}
                      >
                        {s.topic || s.lesson_id}
                      </h3>
                      <div
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: "var(--realm-accent)" }}
                      >
                        {formattedDate} · {formattedTime}
                      </div>
                    </div>
                    <p
                      className="mt-2 text-sm italic font-display"
                      style={{ color: "var(--ink-secondary)" }}
                    >
                      {s.breakthrough
                        ? '"A new star joined your constellation during this adventure."'
                        : '"Explored mysteries through guided discovery and reasoning."'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {intents.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest"
                          style={{
                            background: "var(--realm-glow)",
                            border: "1px solid var(--realm-accent)",
                            color: "var(--realm-accent)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
