/**
 * Achievement Types
 *
 * Central type definitions for the achievement system.
 * Used by badge definitions, evaluators, and UI components.
 */

/** Badge rarity levels */
export type BadgeRarity = "common" | "rare" | "legendary" | "mastery";

/** Badge metadata returned from evaluation */
export interface BadgeMetadata {
  id: string;
  title: string;
  icon: string;
  description: string;
  rarity: BadgeRarity;
}

/** Session data for achievement evaluation */
export interface SessionAchievementData {
  _id: string;
  lessonId: string;
  topic: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  performanceScore?: number;
  stateProgression: string[];
  messagesCount: number;
  breakthrough: boolean;
}

/** Skill data for achievement evaluation */
export interface SkillAchievementData {
  _id: string;
  skillName: string;
  masteryScore: number;
  status: "unlocked" | "in-progress" | "locked";
  unlockedAt?: string;
  insight?: string;
}

/** Evaluation context passed to badge evaluators */
export interface AchievementContext {
  session: SessionAchievementData;
  skills?: SkillAchievementData[];
}

/** Badge evaluation result */
export interface AchievementResult {
  badge: BadgeMetadata;
  earnedAt?: string;
}

/** Badge evaluator function signature */
export type BadgeEvaluator = (context: AchievementContext) => boolean;

/** Badge definition with metadata and evaluator */
export interface BadgeDefinition {
  metadata: BadgeMetadata;
  evaluator: BadgeEvaluator;
}

/** Registry of all available badges */
export interface BadgeRegistry {
  [badgeId: string]: BadgeDefinition;
}
