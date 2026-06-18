/**
 * Badge Definitions
 *
 * Contains metadata for all achievements in Lumira.
 * Add new badges here - no need to modify UI components.
 */

import type { BadgeMetadata, BadgeDefinition, BadgeRegistry } from "./types";

/**
 * Star Born - A remarkable moment of discovery
 * Awarded for exceptional learning achievements
 */
const STAR_BORN: BadgeMetadata = {
  id: "star-born",
  title: "Star Born",
  icon: "⭐",
  description: "A remarkable moment of discovery.",
  rarity: "legendary",
};

/**
 * First Light - First breakthrough achieved
 * Awarded when user has their first breakthrough
 */
const FIRST_LIGHT: BadgeMetadata = {
  id: "first-light",
  title: "First Light",
  icon: "🌅",
  description: "Your first breakthrough moment.",
  rarity: "rare",
};

/**
 * Deep Thinker - High reasoning score
 * Awarded for exceptional reasoning performance
 */
const DEEP_THINKER: BadgeMetadata = {
  id: "deep-thinker",
  title: "Deep Thinker",
  icon: "🧠",
  description: "Exceptional reasoning achievement.",
  rarity: "rare",
};

/**
 * Master Explorer - Explored multiple realms
 * Awarded for exploring many different worlds
 */
const MASTER_EXPLORER: BadgeMetadata = {
  id: "master-explorer",
  title: "Master Explorer",
  icon: "🗺️",
  description: "Explored across multiple realms.",
  rarity: "rare",
};

/**
 * Realm Scholar - Mastered a realm
 * Awarded for mastering all skills in a realm
 */
const REALM_SCHOLAR: BadgeMetadata = {
  id: "realm-scholar",
  title: "Realm Scholar",
  icon: "🎓",
  description: "Mastered an entire realm.",
  rarity: "mastery",
};

/**
 * Consistency Streak - Regular learning
 * Awarded for consistent daily practice
 */
const CONSISTENCY_STREAK: BadgeMetadata = {
  id: "consistency-streak",
  title: "Consistency Streak",
  icon: "🔥",
  description: "Consistent learning practice.",
  rarity: "common",
};

/**
 * Export badge metadata for direct use
 */
export const BADGE_METADATA: Record<string, BadgeMetadata> = {
  "star-born": STAR_BORN,
  "first-light": FIRST_LIGHT,
  "deep-thinker": DEEP_THINKER,
  "master-explorer": MASTER_EXPLORER,
  "realm-scholar": REALM_SCHOLAR,
  "consistency-streak": CONSISTENCY_STREAK,
};

/**
 * Get badge metadata by ID
 */
export function getBadgeMetadata(badgeId: string): BadgeMetadata | undefined {
  return BADGE_METADATA[badgeId];
}

/**
 * Registry of all badge definitions
 * This is used by the evaluator to check achievements
 */
export const BADGE_REGISTRY: BadgeRegistry = {
  "star-born": {
    metadata: STAR_BORN,
    evaluator: () => false, // Evaluator is defined in badgeEvaluator.ts
  },
  "first-light": {
    metadata: FIRST_LIGHT,
    evaluator: () => false,
  },
  "deep-thinker": {
    metadata: DEEP_THINKER,
    evaluator: () => false,
  },
  "master-explorer": {
    metadata: MASTER_EXPLORER,
    evaluator: () => false,
  },
  "realm-scholar": {
    metadata: REALM_SCHOLAR,
    evaluator: () => false,
  },
  "consistency-streak": {
    metadata: CONSISTENCY_STREAK,
    evaluator: () => false,
  },
};

/**
 * List of all badge IDs
 * Useful for iterating over all badges
 */
export const ALL_BADGE_IDS = Object.keys(BADGE_METADATA);

/**
 * Get all badge metadata
 */
export function getAllBadgeMetadata(): BadgeMetadata[] {
  return Object.values(BADGE_METADATA);
}
