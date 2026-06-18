/**
 * Achievements Module
 *
 * Centralized achievement system for Lumira.
 * Provides badge definitions, evaluation, and types.
 */

// Types
export type {
  BadgeRarity,
  BadgeMetadata,
  SessionAchievementData,
  SkillAchievementData,
  AchievementContext,
  AchievementResult,
  BadgeEvaluator,
  BadgeDefinition,
  BadgeRegistry,
} from "./types";

// Badge Definitions
export {
  BADGE_METADATA,
  BADGE_REGISTRY,
  ALL_BADGE_IDS,
  getBadgeMetadata,
  getAllBadgeMetadata,
} from "./badgeDefinitions";

// Badge Evaluator
export {
  evaluateAchievements,
  isBadgeEarned,
  getEarnedBadges,
  qualifiesForStarBorn,
  qualifiesForBadge,
} from "./badgeEvaluator";
