/**
 * Artifact Types
 *
 * Central type definitions for the artifact system.
 * Artifacts are collectibles unlocked from learning achievements.
 */

import type { BadgeRarity } from "@/achievements/types";

/** Artifact rarity levels */
export type ArtifactRarity = BadgeRarity;

/** Artifact metadata */
export interface ArtifactMetadata {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: ArtifactRarity;
  realm?: string;
}

/** Unlock condition for an artifact */
export type ArtifactUnlockCondition = {
  type: "achievement" | "session" | "realm" | "lesson" | "hidden";
  requirement: string;
  value?: number;
};

/** Artifact definition with metadata and unlock condition */
export interface ArtifactDefinition {
  metadata: ArtifactMetadata;
  unlockCondition: ArtifactUnlockCondition;
}

/** Artifact evaluation result */
export interface ArtifactResult {
  artifact: ArtifactMetadata;
  earnedAt?: string;
  isNewUnlock?: boolean;
}

/** Session data for artifact evaluation */
export interface SessionArtifactData {
  _id: string;
  lessonId: string;
  topic: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  performanceScore?: number;
  breakthrough: boolean;
  realm?: string;
}

/** Context for artifact evaluation */
export interface ArtifactEvaluationContext {
  session: SessionArtifactData;
  earnedBadges: string[];
  unlockedArtifacts?: string[];
  /** Historical session data for counting discoveries across sessions */
  historicalSessions?: SessionArtifactData[];
}

/** Registry of all available artifacts */
export interface ArtifactRegistry {
  [artifactId: string]: ArtifactDefinition;
}

/** User's unlocked artifact state */
export interface UnlockedArtifact {
  artifactId: string;
  unlockedAt: string;
  sessionId?: string;
}
