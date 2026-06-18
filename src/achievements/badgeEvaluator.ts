/**
 * Badge Evaluator
 *
 * Centralized achievement evaluation logic.
 * UI components should NOT contain any badge evaluation logic.
 * All badge checks happen here.
 */

import type { AchievementContext, AchievementResult, BadgeMetadata } from "./types";
import { BADGE_METADATA, getBadgeMetadata } from "./badgeDefinitions";

/**
 * Evaluate all achievements for a given session
 *
 * @param context - Session and skill data for evaluation
 * @returns Array of earned badges
 */
export function evaluateAchievements(context: AchievementContext): AchievementResult[] {
  const earnedBadges: AchievementResult[] = [];

  // Check Star Born
  if (evaluateStarBorn(context)) {
    earnedBadges.push({
      badge: BADGE_METADATA["star-born"],
    });
  }

  // Check First Light (first breakthrough)
  if (evaluateFirstLight(context)) {
    earnedBadges.push({
      badge: BADGE_METADATA["first-light"],
    });
  }

  // Check Deep Thinker
  if (evaluateDeepThinker(context)) {
    earnedBadges.push({
      badge: BADGE_METADATA["deep-thinker"],
    });
  }

  // Future badges can be added here
  // if (evaluateMasterExplorer(context)) { ... }
  // if (evaluateRealmScholar(context)) { ... }
  // if (evaluateConsistencyStreak(context)) { ... }

  return earnedBadges;
}

/**
 * Star Born Evaluation
 *
 * Awarded when ANY of the following are true:
 * 1. Major breakthrough: session.breakthrough === true
 * 2. Exceptional reasoning: performanceScore >= 90
 * 3. Concept mastery: masteryScore >= 90 AND status === "unlocked"
 * 4. Exceptional discovery: breakthrough === true AND performanceScore >= 85
 */
function evaluateStarBorn(context: AchievementContext): boolean {
  const { session, skills } = context;

  // Criterion 1: Major breakthrough
  if (session.breakthrough === true) {
    return true;
  }

  // Criterion 2: Exceptional reasoning (score >= 90)
  if (session.performanceScore !== undefined && session.performanceScore >= 90) {
    return true;
  }

  // Criterion 3: Concept mastery (skill mastery >= 90 and unlocked)
  if (skills && skills.length > 0) {
    const hasMasteredSkill = skills.some(
      (skill) => skill.masteryScore >= 90 && skill.status === "unlocked",
    );
    if (hasMasteredSkill) {
      return true;
    }
  }

  // Criterion 4: Exceptional discovery moment
  // breakthrough === true AND performanceScore >= 85
  if (
    session.breakthrough === true &&
    session.performanceScore !== undefined &&
    session.performanceScore >= 85
  ) {
    return true;
  }

  return false;
}

/**
 * First Light Evaluation
 *
 * Awarded when user has their first breakthrough
 * (This would require tracking total breakthroughs - placeholder for now)
 */
function evaluateFirstLight(context: AchievementContext): boolean {
  // For now, treat first breakthrough as any breakthrough
  // In a full implementation, you'd track total breakthroughs per user
  return context.session.breakthrough === true;
}

/**
 * Deep Thinker Evaluation
 *
 * Awarded for exceptional reasoning performance (score >= 85)
 */
function evaluateDeepThinker(context: AchievementContext): boolean {
  const { session } = context;

  // High reasoning score
  if (session.performanceScore !== undefined && session.performanceScore >= 85) {
    return true;
  }

  return false;
}

/**
 * Check if a specific badge is earned
 *
 * @param badgeId - The badge to check
 * @param context - Session and skill data
 * @returns True if the badge is earned
 */
export function isBadgeEarned(badgeId: string, context: AchievementContext): boolean {
  const results = evaluateAchievements(context);
  return results.some((result) => result.badge.id === badgeId);
}

/**
 * Get earned badges for display
 *
 * @param context - Session and skill data
 * @returns Array of badge metadata for UI rendering
 */
export function getEarnedBadges(context: AchievementContext): BadgeMetadata[] {
  const results = evaluateAchievements(context);
  return results.map((result) => result.badge);
}

/**
 * Check if session qualifies for Star Born badge
 * Helper function for direct checks without full evaluation
 */
export function qualifiesForStarBorn(session: AchievementContext["session"]): boolean {
  const context: AchievementContext = { session, skills: undefined };
  return evaluateStarBorn(context);
}

/**
 * Check if session qualifies for a specific badge
 */
export function qualifiesForBadge(badgeId: string, context: AchievementContext): boolean {
  switch (badgeId) {
    case "star-born":
      return evaluateStarBorn(context);
    case "first-light":
      return evaluateFirstLight(context);
    case "deep-thinker":
      return evaluateDeepThinker(context);
    default:
      return false;
  }
}
