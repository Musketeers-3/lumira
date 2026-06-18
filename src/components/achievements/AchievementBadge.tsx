/**
 * AchievementBadge Component
 *
 * Reusable badge component for displaying achievement icons.
 * Receives badge metadata from service - no evaluation logic here.
 */

import { memo } from "react";
import type { BadgeMetadata, BadgeRarity } from "@/achievements/types";

interface AchievementBadgeProps {
  badge: BadgeMetadata;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Rarity color mapping */
const rarityColors: Record<BadgeRarity, string> = {
  common: "var(--ink-tertiary)",
  rare: "#3B9EFF",
  legendary: "var(--gold-soft)",
  mastery: "#B88CFF",
};

/** Rarity background mapping */
const rarityBgColors: Record<BadgeRarity, string> = {
  common: "rgba(255,255,255,0.05)",
  rare: "rgba(59, 158, 255, 0.15)",
  legendary: "rgba(201, 162, 75, 0.2)",
  mastery: "rgba(184, 140, 255, 0.15)",
};

/** Size mappings */
const sizeClasses = {
  sm: "text-xs px-1.5 py-0.5",
  md: "text-sm px-2 py-1",
  lg: "text-base px-3 py-1.5",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export const AchievementBadge = memo(function AchievementBadge({
  badge,
  showLabel = false,
  size = "md",
  className = "",
}: AchievementBadgeProps) {
  const color = rarityColors[badge.rarity] || rarityColors.common;
  const bgColor = rarityBgColors[badge.rarity] || rarityBgColors.common;
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass} ${className}`}
      style={{
        background: bgColor,
        color: color,
        border: `1px solid ${color}40`,
      }}
      title={badge.description}
    >
      <span className={iconSize}>{badge.icon}</span>
      {showLabel && <span>{badge.title}</span>}
    </span>
  );
});

/**
 * SessionAchievementBadge - Renders badges for a session
 *
 * This component receives pre-evaluated badges from the parent.
 * It does NOT evaluate badges itself.
 */
interface SessionAchievementBadgeProps {
  badges: BadgeMetadata[];
  maxDisplay?: number;
  className?: string;
}

export const SessionAchievementBadge = memo(function SessionAchievementBadge({
  badges,
  maxDisplay = 3,
  className = "",
}: SessionAchievementBadgeProps) {
  if (!badges || badges.length === 0) {
    return null;
  }

  const displayBadges = badges.slice(0, maxDisplay);
  const remainingCount = badges.length - maxDisplay;

  return (
    <div className={`flex items-center gap-1 flex-wrap ${className}`}>
      {displayBadges.map((badge) => (
        <AchievementBadge key={badge.id} badge={badge} size="sm" />
      ))}
      {remainingCount > 0 && (
        <span
          className="text-xs px-1.5 py-0.5 rounded-full"
          style={{ color: "var(--ink-tertiary)", background: "rgba(255,255,255,0.05)" }}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
});

export default AchievementBadge;
