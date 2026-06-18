import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Loader2,
  BookOpen,
  Clock,
  Star,
  Sparkles,
  Calendar,
  ChevronRight,
  Bug,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { REALMS, type RealmId } from "@/lib/realms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import * as sessionApi from "@/services/api/sessionApi";
import { evaluateAchievements } from "@/achievements";
import { SessionAchievementBadge } from "@/components/achievements";
import type { BadgeMetadata } from "@/achievements/types";
import {
  useWeekGrouping,
  formatWeekRange,
  isCurrentWeek,
  type SessionEntry,
  type WeekGroup,
} from "@/lib/week-grouping";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Learning Journal — Lumira" },
      {
        name: "description",
        content: "Review your learning journey and the insights you've discovered.",
      },
    ],
  }),
  component: JournalPage,
});

/**
 * Map lessonId to realm
 */
function getRealmFromLessonId(lessonId: string): { realm: RealmId; name: string } | undefined {
  for (const realm of REALMS) {
    if (realm.defaultLessonId === lessonId) {
      return { realm: realm.id, name: realm.shortName };
    }
  }
  return undefined;
}

/**
 * Format duration in a readable way
 */
function formatDuration(seconds?: number): string {
  if (!seconds) return "—";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${remainingSeconds}s`;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Format date and time
 */
function formatDateTime(dateString: string): { date: string; time: string } {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

/**
 * Week Header Component
 * Renders a scrapbook-style timeline header for each week group
 */
function WeekHeader({ group }: { group: WeekGroup }) {
  const isCurrent = isCurrentWeek(group.startDate);

  return (
    <div className="flex items-center gap-4 py-6">
      {/* Timeline line */}
      <div className="relative flex items-center">
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 w-px h-8"
          style={{ background: "linear-gradient(to bottom, var(--gold-soft), transparent)" }}
        />
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isCurrent ? "animate-pulse" : ""
          }`}
          style={{
            background: isCurrent ? "var(--gold-deep)" : "var(--bg-onyx)",
            border: "2px solid var(--gold-soft)",
          }}
        >
          <Calendar className="w-4 h-4" style={{ color: "var(--ink-primary)" }} />
        </div>
      </div>

      {/* Week label */}
      <div className="flex-1">
        <h2
          className={`text-lg font-semibold tracking-tight font-display ${
            isCurrent ? "text-gold-soft" : ""
          }`}
          style={{
            color: isCurrent ? "var(--gold-soft)" : "var(--ink-secondary)",
          }}
        >
          {group.label}
        </h2>
        <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
          {formatWeekRange(group.startDate, group.endDate)} · {group.sessions.length}{" "}
          {group.sessions.length === 1 ? "session" : "sessions"}
        </p>
      </div>
    </div>
  );
}

/**
 * Session Card Component
 * Individual session entry in the journal
 */
function SessionCard({ session, onClick }: { session: SessionEntry; onClick: () => void }) {
  const { date, time } = formatDateTime(session.startedAt);
  const realm = REALMS.find((r) => r.id === session.realm);

  return (
    <button onClick={onClick} className="w-full text-left group">
      <div
        className="surface-luxe rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-deep"
        style={{
          border: "1px solid var(--hairline)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            {/* Topic/Title */}
            <h3
              className="text-lg font-semibold tracking-tight font-display truncate"
              style={{ color: "var(--ink-primary)" }}
            >
              {session.topic}
            </h3>

            {/* Date, Time, and Realm */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5" style={{ color: "var(--ink-tertiary)" }}>
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-sm">{date}</span>
              </div>
              <div className="flex items-center gap-1.5" style={{ color: "var(--ink-tertiary)" }}>
                <Clock className="h-3.5 w-3.5" />
                <span className="text-sm">{time}</span>
              </div>
              {session.realmName && (
                <div
                  className="flex items-center gap-1.5"
                  style={{ color: realm?.accent || "var(--ink-tertiary)" }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-sm">{session.realmName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 ml-4">
            {/* Duration */}
            <div className="text-center">
              <div
                className="text-xs uppercase tracking-wider"
                style={{ color: "var(--ink-tertiary)" }}
              >
                Duration
              </div>
              <div className="mt-1 font-medium" style={{ color: "var(--ink-secondary)" }}>
                {formatDuration(session.durationSeconds)}
              </div>
            </div>

            {/* Score */}
            {session.performanceScore !== undefined && (
              <div className="text-center">
                <div
                  className="text-xs uppercase tracking-wider"
                  style={{ color: "var(--ink-tertiary)" }}
                >
                  Score
                </div>
                <div
                  className="mt-1 font-medium flex items-center gap-1"
                  style={{
                    color:
                      session.performanceScore >= 70 ? "var(--gold-soft)" : "var(--ink-secondary)",
                  }}
                >
                  <Star className="h-3.5 w-3.5" fill="currentColor" />
                  {session.performanceScore}
                </div>
              </div>
            )}

            {/* Achievement Badges */}
            <SessionAchievementBadge badges={session.badges || []} />

            <ChevronRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              style={{ color: "var(--ink-tertiary)" }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

function JournalPage() {
  const [selectedSession, setSelectedSession] = useState<SessionEntry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { fetchAllSessions } = useSessionPersistence();

  // Fetch all sessions using the persistence layer with graceful error handling
  const { data: sessions = [], isLoading } = useQuery<SessionEntry[]>({
    queryKey: ["journal-sessions"],
    queryFn: async () => {
      // Use the persistence layer which handles errors gracefully
      const data = await fetchAllSessions();

      // If no data (error or empty), return empty array
      if (!data) {
        return [];
      }

      // Map lessonId to realm info and evaluate achievements, then sort by date (newest first)
      return data
        .map((session) => {
          const realmInfo = getRealmFromLessonId(session.lessonId);

          // Evaluate achievements for this session
          const badges = evaluateAchievements({
            session: {
              _id: session._id,
              lessonId: session.lessonId,
              topic: session.topic,
              startedAt: session.startedAt,
              completedAt: session.completedAt,
              durationSeconds: session.durationSeconds,
              performanceScore: session.performanceScore,
              stateProgression: session.stateProgression || [],
              messagesCount: session.messagesCount,
              breakthrough: session.breakthrough,
            },
          }).map((result) => result.badge);

          return {
            ...session,
            realm: realmInfo?.realm,
            realmName: realmInfo?.name,
            badges: badges as BadgeMetadata[],
          };
        })
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    },
  });

  // Group sessions by week with memoization
  const weekGroups = useWeekGrouping(sessions);

  // Fetch messages for selected session
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<
    sessionApi.SessionMessage[]
  >({
    queryKey: ["session-messages", selectedSession?._id],
    queryFn: async () => {
      if (!selectedSession?._id) return [];
      return sessionApi.getMessages(selectedSession._id);
    },
    enabled: !!selectedSession?._id,
  });

  const handleSessionClick = (session: SessionEntry) => {
    setSelectedSession(session);
    setIsDetailOpen(true);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <div
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: "var(--ink-tertiary)" }}
        >
          Your Journey
        </div>
        <h1
          className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl font-display"
          style={{ color: "var(--ink-primary)" }}
        >
          Learning Journal
        </h1>
        <p className="mt-2 max-w-xl" style={{ color: "var(--ink-secondary)" }}>
          Every session is a step in your journey of discovery. Review what you've learned.
        </p>

        {/* Debug Toggle Button */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-colors"
          style={{
            background: showDebug ? "var(--gold-deep)" : "var(--bg-onyx)",
            border: "1px solid var(--hairline)",
            color: showDebug ? "var(--ink-primary)" : "var(--ink-tertiary)",
          }}
        >
          <Bug className="w-3.5 h-3.5" />
          {showDebug ? "Hide Debug" : "Show Debug"}
        </button>
      </header>

      {/* Debug Panel - Shows raw grouping data from MongoDB */}
      {showDebug && (
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-night)", border: "1px solid var(--gold-soft)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--gold-soft)" }}>
              Week Grouping Debug Info
            </h3>
            <button onClick={() => setShowDebug(false)}>
              <X className="w-4 h-4" style={{ color: "var(--ink-tertiary)" }} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Raw Sessions Data */}
            <div>
              <h4
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: "var(--ink-tertiary)" }}
              >
                Raw Sessions ({sessions.length})
              </h4>
              <pre
                className="p-3 rounded-lg text-xs overflow-x-auto"
                style={{ background: "var(--bg-onyx)", color: "var(--ink-secondary)" }}
              >
                {JSON.stringify(
                  sessions.map((s) => ({
                    _id: s._id,
                    topic: s.topic,
                    startedAt: s.startedAt,
                    realmName: s.realmName,
                  })),
                  null,
                  2,
                )}
              </pre>
            </div>

            {/* Week Groups */}
            <div>
              <h4
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: "var(--ink-tertiary)" }}
              >
                Week Groups ({weekGroups.length})
              </h4>
              <pre
                className="p-3 rounded-lg text-xs overflow-x-auto"
                style={{ background: "var(--bg-onyx)", color: "var(--ink-secondary)" }}
              >
                {JSON.stringify(
                  weekGroups.map((g) => ({
                    label: g.label,
                    startDate: g.startDate.toISOString(),
                    endDate: g.endDate.toISOString(),
                    sessions: g.sessions.map((s) => s.topic),
                  })),
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="surface-luxe rounded-2xl p-6 animate-pulse"
              style={{ border: "1px solid var(--hairline)" }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-5 w-48 rounded bg-white/5" />
                  <div className="h-4 w-32 rounded bg-white/5" />
                </div>
                <div className="h-6 w-20 rounded-full bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sessions.length === 0 && (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "var(--bg-onyx)", border: "1px solid var(--hairline)" }}
        >
          <BookOpen className="mx-auto h-12 w-12 mb-4" style={{ color: "var(--ink-tertiary)" }} />
          <h3
            className="text-lg font-semibold font-display"
            style={{ color: "var(--ink-primary)" }}
          >
            No sessions yet
          </h3>
          <p className="mt-2 max-w-sm mx-auto" style={{ color: "var(--ink-secondary)" }}>
            Your learning journey begins with your first session. Visit a world to start
            discovering.
          </p>
        </div>
      )}

      {/* Grouped Session List */}
      {!isLoading && sessions.length > 0 && (
        <div className="space-y-2">
          {weekGroups.map((group) => (
            <div key={group.label + group.startDate.getTime()}>
              {/* Week Header */}
              <WeekHeader group={group} />

              {/* Sessions in this week */}
              <div
                className="space-y-3 ml-4 border-l-2 pl-6"
                style={{ borderColor: "var(--hairline)" }}
              >
                {group.sessions.map((session) => (
                  <SessionCard
                    key={session._id}
                    session={session}
                    onClick={() => handleSessionClick(session)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent
          className="max-w-2xl max-h-[80vh]"
          style={{
            background: "var(--bg-onyx)",
            border: "1px solid var(--hairline-strong)",
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedSession?.realmName && (
                <Badge
                  style={{
                    background: "var(--gold-deep)",
                    color: "var(--ink-primary)",
                  }}
                >
                  {selectedSession.realmName}
                </Badge>
              )}
              {selectedSession?.breakthrough && (
                <Badge
                  style={{
                    background: "rgba(201, 162, 75, 0.2)",
                    color: "var(--gold-soft)",
                    border: "1px solid var(--gold-soft)",
                  }}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Breakthrough
                </Badge>
              )}
            </div>
            <DialogTitle className="text-xl font-display" style={{ color: "var(--ink-primary)" }}>
              {selectedSession?.topic}
            </DialogTitle>
            <DialogDescription style={{ color: "var(--ink-secondary)" }}>
              {selectedSession && formatDateTime(selectedSession.startedAt).date} at{" "}
              {selectedSession && formatDateTime(selectedSession.startedAt).time}
            </DialogDescription>
          </DialogHeader>

          {/* Session Stats */}
          <div
            className="grid grid-cols-3 gap-4 p-4 rounded-xl"
            style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
          >
            <div className="text-center">
              <div
                className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
                style={{ color: "var(--ink-tertiary)" }}
              >
                <Clock className="h-3.5 w-3.5" />
                Duration
              </div>
              <div className="mt-1 text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>
                {formatDuration(selectedSession?.durationSeconds)}
              </div>
            </div>
            <div className="text-center">
              <div
                className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
                style={{ color: "var(--ink-tertiary)" }}
              >
                <Star className="h-3.5 w-3.5" />
                Score
              </div>
              <div className="mt-1 text-lg font-semibold" style={{ color: "var(--gold-soft)" }}>
                {selectedSession?.performanceScore ?? "—"}%
              </div>
            </div>
            <div className="text-center">
              <div
                className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
                style={{ color: "var(--ink-tertiary)" }}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Messages
              </div>
              <div className="mt-1 text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>
                {selectedSession?.messagesCount ?? 0}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            <h4
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: "var(--ink-tertiary)" }}
            >
              Conversation
            </h4>
            {isLoadingMessages ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--gold)" }} />
              </div>
            ) : messages.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`rounded-xl p-4 ${
                        msg.sender === "mentor"
                          ? "bg-white/[0.03] border border-white/[0.05]"
                          : "bg-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{
                            color: msg.sender === "mentor" ? "var(--gold)" : "var(--ink-secondary)",
                          }}
                        >
                          {msg.sender === "mentor" ? "Mentor" : "You"}
                        </span>
                        <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                          {formatDateTime(msg.createdAt).time}
                        </span>
                      </div>
                      <p
                        style={{ color: "var(--ink-primary)" }}
                        className="text-sm leading-relaxed"
                      >
                        {msg.messageText}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-center py-8" style={{ color: "var(--ink-tertiary)" }}>
                No messages recorded for this session.
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => setIsDetailOpen(false)}
              style={{
                background: "var(--gold-soft)",
                color: "#0B0B12",
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
