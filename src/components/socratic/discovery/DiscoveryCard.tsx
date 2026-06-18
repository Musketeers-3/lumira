import { useState, memo } from "react";
import { Link } from "@tanstack/react-router";
import { Play, Clock, BarChart, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/socratic/premium/GlassPanel";
import { PremiumButton } from "@/components/socratic/premium/PremiumButton";
import type { DiscoverLesson, LessonDifficulty, LessonStatus } from "@/services/api/lessonApi";
import { getRealm } from "@/lib/realms";

interface DiscoveryCardProps {
  lesson: DiscoverLesson;
}

const difficultyColors: Record<LessonDifficulty, string> = {
  beginner: "#3DDB8A",
  intermediate: "#3B9EFF",
  advanced: "#D4A054",
};

const difficultyLabels: Record<LessonDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const statusLabels: Record<LessonStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

const statusColors: Record<LessonStatus, string> = {
  not_started: "var(--ink-tertiary)",
  in_progress: "#3B9EFF",
  completed: "#3DDB8A",
};

export const DiscoveryCard = memo(function DiscoveryCard({ lesson }: DiscoveryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const realm = getRealm(lesson.realm || "physics");
  const accent = realm?.accent || "#3B9EFF";
  const glow = realm?.glow || "rgba(59, 158, 255, 0.4)";
  const emoji = realm?.emoji || "📚";

  return (
    <Link
      to="/engine"
      search={{
        lessonId: lesson._id,
        topic: lesson.topic || lesson.title,
        objective: lesson.description || "Learn something new.",
        realm: lesson.realm || "physics",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block group outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-2xl"
      style={{ "--tw-ring-color": accent } as React.CSSProperties}
    >
      <GlassPanel
        elevated={isHovered}
        glow={isHovered}
        className="h-full transition-all duration-300 ease-out"
        style={{
          borderColor: isHovered ? `${accent}66` : `${accent}22`,
          boxShadow: isHovered ? `0 0 30px ${glow}, var(--shadow-deep)` : "var(--shadow-deep)",
        }}
      >
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{emoji}</span>
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: accent }}
              >
                {realm?.name || lesson.realm}
              </span>
            </div>
            <div
              className="px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider"
              style={{
                background: `${difficultyColors[lesson.difficulty]}22`,
                color: difficultyColors[lesson.difficulty],
              }}
            >
              {difficultyLabels[lesson.difficulty]}
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-lg font-semibold font-display tracking-tight transition-colors duration-300"
            style={{ color: isHovered ? accent : "var(--ink-primary)" }}
          >
            {lesson.title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed line-clamp-2"
            style={{ color: "var(--ink-secondary)" }}
          >
            {lesson.description || "No description available."}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" style={{ color: "var(--ink-tertiary)" }} />
              <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                {lesson.estimatedDuration} min
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart className="h-3.5 w-3.5" style={{ color: statusColors[lesson.status] }} />
              <span className="text-xs" style={{ color: statusColors[lesson.status] }}>
                {statusLabels[lesson.status]}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          {lesson.status !== "not_started" && (
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${lesson.progress}%`,
                    background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
                  }}
                />
              </div>
              <span className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                {lesson.progress}% complete
              </span>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <PremiumButton
              variant="gold"
              size="md"
              className="w-full group-hover:scale-[1.02] transition-transform duration-200"
              icon={
                lesson.status === "not_started" ? (
                  <Play className="h-4 w-4" />
                ) : lesson.status === "in_progress" ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )
              }
            >
              {lesson.status === "not_started"
                ? "Start Lesson"
                : lesson.status === "in_progress"
                  ? "Continue Learning"
                  : "Review Again"}
            </PremiumButton>
          </div>
        </div>
      </GlassPanel>
    </Link>
  );
});
