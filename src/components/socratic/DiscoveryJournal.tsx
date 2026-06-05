import { useQuery } from "@tanstack/react-query";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { discoveryTitle } from "@/lib/realms";

interface SessionRecord {
  id: string;
  topic?: string;
  started_at: string;
  breakthrough?: boolean;
}

interface Props {
  highlightSkill?: string | null;
}

export function DiscoveryJournal({ highlightSkill }: Props) {
  const { fetchRecentSessions } = useSessionPersistence();

  const { data: sessions = [], isLoading } = useQuery<SessionRecord[] | null>({
    queryKey: ["journal-sessions"],
    queryFn: () => fetchRecentSessions(12) as Promise<SessionRecord[] | null>,
    staleTime: 1000 * 60,
  });

  const entries = (sessions ?? []).filter((s) => s.breakthrough || s.topic);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold font-display" style={{ color: "var(--ink-primary)" }}>
          Discovery Journal
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--ink-secondary)" }}>
          Memories from your adventures — moments when understanding clicked.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>
      )}

      {!isLoading && entries.length === 0 && (
        <p className="text-sm font-display italic py-6" style={{ color: "var(--ink-tertiary)" }}>
          No journal entries yet. Complete an adventure to seal your first memory.
        </p>
      )}

      <div className="space-y-3">
        {entries.map((entry) => {
          const title = discoveryTitle(entry.topic ?? "Discovery");
          const highlighted = highlightSkill && entry.topic?.includes(highlightSkill);
          return (
            <div
              key={entry.id}
              className="rounded-xl p-4 transition-all duration-300"
              style={{
                background: highlighted ? "var(--realm-glow)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${highlighted ? "var(--realm-accent)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{entry.breakthrough ? "⭐" : "✦"}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold" style={{ color: "var(--ink-primary)" }}>
                      {title}
                    </h4>
                    {entry.breakthrough && (
                      <span
                        className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: "var(--realm-glow)", color: "var(--realm-accent)" }}
                      >
                        Star born
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                    {entry.topic} · {new Date(entry.started_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
