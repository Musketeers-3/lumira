/**
 * ArtifactBadge Component
 *
 * Reusable component for displaying artifact icons.
 * Receives artifact metadata from service - no evaluation logic here.
 */

import { memo } from "react";
import type { ArtifactMetadata, ArtifactRarity } from "@/artifacts/types";

interface ArtifactBadgeProps {
  artifact: ArtifactMetadata;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Rarity color mapping */
const rarityColors: Record<ArtifactRarity, string> = {
  common: "var(--ink-tertiary)",
  rare: "#3B9EFF",
  legendary: "var(--gold-soft)",
  mastery: "#B88CFF",
};

/** Rarity background mapping */
const rarityBgColors: Record<ArtifactRarity, string> = {
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

export const ArtifactBadge = memo(function ArtifactBadge({
  artifact,
  showLabel = false,
  size = "md",
  className = "",
}: ArtifactBadgeProps) {
  const color = rarityColors[artifact.rarity] || rarityColors.common;
  const bgColor = rarityBgColors[artifact.rarity] || rarityBgColors.common;
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
      title={artifact.description}
    >
      <span className={iconSize}>{artifact.icon}</span>
      {showLabel && <span>{artifact.name}</span>}
    </span>
  );
});

/**
 * SessionArtifactBadge - Renders artifacts for a session
 *
 * This component receives pre-evaluated artifacts from the parent.
 * It does NOT evaluate artifacts itself.
 */
interface SessionArtifactBadgeProps {
  artifacts: ArtifactMetadata[];
  maxDisplay?: number;
  className?: string;
}

export const SessionArtifactBadge = memo(function SessionArtifactBadge({
  artifacts,
  maxDisplay = 3,
  className = "",
}: SessionArtifactBadgeProps) {
  if (!artifacts || artifacts.length === 0) {
    return null;
  }

  const displayArtifacts = artifacts.slice(0, maxDisplay);
  const remainingCount = artifacts.length - maxDisplay;

  return (
    <div className={`flex items-center gap-1 flex-wrap ${className}`}>
      {displayArtifacts.map((artifact) => (
        <ArtifactBadge key={artifact.id} artifact={artifact} size="sm" />
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

export default ArtifactBadge;
