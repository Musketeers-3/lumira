/**
 * Student Activity Component
 * Radar-style activity feed for the teacher's observatory
 */

import { memo } from "react";
import { Radar, Star, Award, Gem, Flame, Zap, Target } from "lucide-react";
import type { StudentActivity as StudentActivityType } from "@/types/teacher";

interface StudentActivityProps {
  activities: StudentActivityType[];
  isLoading?: boolean;
}

const getActivityIcon = (action: StudentActivityType["action"]) => {
  switch (action) {
    case "achievement_earned":
      return <Award className="h-4 w-4" style={{ color: "var(--gold-soft)" }} />;
    case "artifact_unlocked":
      return <Gem className="h-4 w-4" style={{ color: "#B88CFF" }} />;
    case "breakthrough":
      return <Zap className="h-4 w-4" style={{ color: "#F97316" }} />;
    case "session_completed":
      return <Target className="h-4 w-4" style={{ color: "var(--gold)" }} />;
    default:
      return <Star className="h-4 w-4" style={{ color: "var(--ink-tertiary)" }} />;
  }
};

const getActivityBorderColor = (action: StudentActivityType["action"]) => {
  switch (action) {
    case "achievement_earned":
      return "border-l-[var(--gold-soft)]";
    case "artifact_unlocked":
      return "border-l-[#B88CFF]";
    case "breakthrough":
      return "border-l-[#F97316]";
    case "session_completed":
      return "border-l-[var(--gold)]";
    default:
      return "border-l-[var(--hairline)]";
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const ActivityItem = memo(function ActivityItem({ activity }: { activity: StudentActivityType }) {
  return (
    <div
      className={`flex items-start gap-3 py-3 pl-2 border-l-2 ${getActivityBorderColor(activity.action)}`}
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, var(--bg-onyx) 0%, var(--bg-night) 100%)" }}
      >
        {getActivityIcon(activity.action)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm" style={{ color: "var(--ink-primary)" }}>
          <span className="font-medium">{activity.studentName}</span>{" "}
          <span style={{ color: "var(--ink-secondary)" }}>{activity.description}</span>
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
          {formatTimestamp(activity.timestamp)}
        </p>
      </div>
    </div>
  );
});

export const StudentActivity = memo(function StudentActivity({
  activities,
  isLoading,
}: StudentActivityProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Radar className="h-4 w-4" style={{ color: "var(--gold-soft)" }} />
          <h2
            className="text-lg font-semibold font-display"
            style={{ color: "var(--ink-primary)" }}
          >
            Discovery Radar
          </h2>
        </div>
        <div
          className="rounded-xl p-4 animate-pulse"
          style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
        >
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-white/5" />
                  <div className="h-3 w-1/4 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Radar className="h-4 w-4" style={{ color: "var(--gold-soft)" }} />
        <h2 className="text-lg font-semibold font-display" style={{ color: "var(--ink-primary)" }}>
          Discovery Radar
        </h2>
      </div>
      <div
        className="rounded-xl p-4"
        style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
      >
        {activities.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--ink-tertiary)" }}>
            No recent discoveries detected
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            {activities.map((activity) => (
              <ActivityItem key={activity._id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default StudentActivity;
