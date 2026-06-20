/**
 * Artifact Evaluator
 *
 * Centralized artifact unlock logic.
 * UI components should NOT contain any unlock logic here.
 * All artifact checks happen here.
 */

import type { ArtifactEvaluationContext, ArtifactResult, ArtifactMetadata, SessionArtifactData } from "./types";
import { ARTIFACT_METADATA } from "./artifactDefinitions";

const ARTIFACT_STORAGE_KEY = "lumira-collectible-artifacts";

/**
 * Get persisted artifact IDs from localStorage
 */
export function getPersistedArtifactIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(ARTIFACT_STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

/**
 * Persist a new artifact unlock to localStorage
 */
export function persistArtifactUnlock(artifactId: string): void {
  try {
    const existing = getPersistedArtifactIds();
    if (!existing.includes(artifactId)) {
      localStorage.setItem(ARTIFACT_STORAGE_KEY, JSON.stringify([...existing, artifactId]));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Check if an artifact has been previously unlocked
 */
export function isArtifactUnlocked(artifactId: string): boolean {
  return getPersistedArtifactIds().includes(artifactId);
}

/**
 * Count completed sessions in a specific realm from historical data
 */
function countRealmDiscoveries(
  historicalSessions: SessionArtifactData[] | undefined,
  realm: string
): number {
  if (!historicalSessions) return 0;
  return historicalSessions.filter(
    (s) => s.realm === realm && s.completedAt
  ).length;
}

/**
 * Get unique realms discovered from historical sessions
 */
function getUniqueRealms(historicalSessions: SessionArtifactData[] | undefined): string[] {
  if (!historicalSessions) return [];
  const realms = new Set<string>();
  historicalSessions.forEach((s) => {
    if (s.realm && s.completedAt) {
      realms.add(s.realm);
    }
  });
  return Array.from(realms);
}

/**
 * Check if topic contains pressure (flexible matching)
 */
function topicContainsPressure(topic?: string, lessonId?: string): boolean {
  const searchText = `${topic || ""} ${lessonId || ""}`.toLowerCase();
  return searchText.includes("pressure");
}

/**
 * Evaluate all artifact unlocks for a given session
 *
 * @param context - Session data, earned badges, and unlocked artifacts
 * @returns Array of newly unlocked artifacts
 */
export function evaluateArtifacts(context: ArtifactEvaluationContext): ArtifactResult[] {
  const newlyUnlocked: ArtifactResult[] = [];
  const { session, earnedBadges, unlockedArtifacts = [], historicalSessions } = context;

  // Get previously persisted artifacts to prevent re-unlocking
  const persisted = getPersistedArtifactIds();
  const allUnlocked = [...new Set([...unlockedArtifacts, ...persisted])];

  // Check each artifact unlock condition

  // Socratic Flame - unlocked with Star Born
  if (earnedBadges.includes("star-born") && !allUnlocked.includes("socratic-flame")) {
    newlyUnlocked.push({
      artifact: ARTIFACT_METADATA["socratic-flame"],
      isNewUnlock: true,
    });
    persistArtifactUnlock("socratic-flame");
  }

  // Dawn of Understanding - unlocked with First Light
  if (earnedBadges.includes("first-light") && !allUnlocked.includes("dawn-understanding")) {
    newlyUnlocked.push({
      artifact: ARTIFACT_METADATA["dawn-understanding"],
      isNewUnlock: true,
    });
    persistArtifactUnlock("dawn-understanding");
  }

  // Gravity Compass - 3 Physics realm discoveries
  const physicsCount = countRealmDiscoveries(historicalSessions, "physics") +
    (session.realm === "physics" && session.completedAt ? 1 : 0);
  if (physicsCount >= 3 && !allUnlocked.includes("gravity-compass")) {
    newlyUnlocked.push({
      artifact: ARTIFACT_METADATA["gravity-compass"],
      isNewUnlock: true,
    });
    persistArtifactUnlock("gravity-compass");
  }

  // Particle Crystal - Pressure topic with score >= 90
  const hasPressureTopic = topicContainsPressure(session.topic, session.lessonId);
  const hasHighScore = session.performanceScore !== undefined && session.performanceScore >= 90;
  if (hasPressureTopic && hasHighScore && !allUnlocked.includes("particle-crystal")) {
    newlyUnlocked.push({
      artifact: ARTIFACT_METADATA["particle-crystal"],
      isNewUnlock: true,
    });
    persistArtifactUnlock("particle-crystal");
  }

  // Master Cartographer - discoveries in 3 different realms
  const currentRealm = session.realm;
  const allRealms = currentRealm
    ? [...getUniqueRealms(historicalSessions), currentRealm]
    : getUniqueRealms(historicalSessions);
  const uniqueRealms = Array.from(new Set(allRealms.filter(Boolean)));
  if (uniqueRealms.length >= 3 && !allUnlocked.includes("master-cartographer")) {
    newlyUnlocked.push({
      artifact: ARTIFACT_METADATA["master-cartographer"],
      isNewUnlock: true,
    });
    persistArtifactUnlock("master-cartographer");
  }

  // Realm-specific artifacts (legacy - single realm visit)
  if (session.realm && session.completedAt) {
    const realmArtifactMap: Record<string, string> = {
      physics: "cosmic-compass",
      chemistry: "alchemist-stone",
      biology: "life-seed",
      math: "geometry-gem",
      history: "chronicle-tome",
    };

    const artifactId = realmArtifactMap[session.realm];
    if (artifactId && !allUnlocked.includes(artifactId)) {
      newlyUnlocked.push({
        artifact: ARTIFACT_METADATA[artifactId],
        isNewUnlock: true,
      });
      persistArtifactUnlock(artifactId);
    }
  }

  // Quiet Contemplation - complete session without breakthrough
  if (
    session.breakthrough === false &&
    session.completedAt &&
    !allUnlocked.includes("quiet-contemplation")
  ) {
    newlyUnlocked.push({
      artifact: ARTIFACT_METADATA["quiet-contemplation"],
      isNewUnlock: true,
    });
    persistArtifactUnlock("quiet-contemplation");
  }

  return newlyUnlocked;
}

/**
 * Check if a specific artifact is unlocked
 *
 * @param artifactId - The artifact to check
 * @param context - Evaluation context
 * @returns True if the artifact should be unlocked
 */
export function shouldUnlockArtifact(
  artifactId: string,
  context: ArtifactEvaluationContext,
): boolean {
  const results = evaluateArtifacts(context);
  return results.some((result) => result.artifact.id === artifactId);
}

/**
 * Get all unlocked artifacts for display
 *
 * @param context - Evaluation context
 * @returns Array of artifact metadata for UI rendering
 */
export function getUnlockedArtifacts(context: ArtifactEvaluationContext): ArtifactMetadata[] {
  const { session, earnedBadges, unlockedArtifacts = [] } = context;
  const artifacts: ArtifactMetadata[] = [];

  // Add already unlocked artifacts
  for (const artifactId of unlockedArtifacts) {
    const metadata = ARTIFACT_METADATA[artifactId];
    if (metadata) {
      artifacts.push(metadata);
    }
  }

  // Check for new unlocks
  const newUnlocks = evaluateArtifacts(context);
  for (const result of newUnlocks) {
    artifacts.push(result.artifact);
  }

  return artifacts;
}

/**
 * Get all earned artifacts for display on a session card.
 *
 * Returns ALL artifacts that belong to this session's realm/topic,
 * regardless of when they were unlocked. This is used for Journal display.
 *
 * @param session - Current session data
 * @param earnedBadges - Badge IDs earned in this session
 * @param historicalSessions - All historical sessions for counting
 * @returns Array of artifact metadata to display
 */
export function getEarnedArtifacts(
  session: SessionArtifactData,
  earnedBadges: string[],
  historicalSessions?: SessionArtifactData[]
): ArtifactMetadata[] {
  const earned: ArtifactMetadata[] = [];
  const persisted = getPersistedArtifactIds();

  // Socratic Flame - show if Star Born was earned (in this or any session)
  if (earnedBadges.includes("star-born") && persisted.includes("socratic-flame")) {
    earned.push(ARTIFACT_METADATA["socratic-flame"]);
  }

  // Dawn of Understanding - show if First Light was earned
  if (earnedBadges.includes("first-light") && persisted.includes("dawn-understanding")) {
    earned.push(ARTIFACT_METADATA["dawn-understanding"]);
  }

  // Gravity Compass - show if 3+ Physics discoveries
  const physicsCount = countRealmDiscoveries(historicalSessions, "physics") +
    (session.realm === "physics" && session.completedAt ? 1 : 0);
  if (physicsCount >= 3 && persisted.includes("gravity-compass")) {
    earned.push(ARTIFACT_METADATA["gravity-compass"]);
  }

  // Particle Crystal - show if Pressure topic + high score
  const hasPressureTopic = topicContainsPressure(session.topic, session.lessonId);
  const hasHighScore = session.performanceScore !== undefined && session.performanceScore >= 90;
  if (hasPressureTopic && hasHighScore && persisted.includes("particle-crystal")) {
    earned.push(ARTIFACT_METADATA["particle-crystal"]);
  }

  // Master Cartographer - show if 3+ realms discovered
  const currentRealm = session.realm;
  const allRealms = currentRealm
    ? [...getUniqueRealms(historicalSessions), currentRealm]
    : getUniqueRealms(historicalSessions);
  const uniqueRealms = Array.from(new Set(allRealms.filter(Boolean)));
  if (uniqueRealms.length >= 3 && persisted.includes("master-cartographer")) {
    earned.push(ARTIFACT_METADATA["master-cartographer"]);
  }

  // Realm-specific artifacts - show if session is in that realm
  if (session.realm && session.completedAt) {
    const realmArtifactMap: Record<string, string> = {
      physics: "cosmic-compass",
      chemistry: "alchemist-stone",
      biology: "life-seed",
      math: "geometry-gem",
      history: "chronicle-tome",
    };

    const artifactId = realmArtifactMap[session.realm];
    if (artifactId && persisted.includes(artifactId)) {
      earned.push(ARTIFACT_METADATA[artifactId]);
    }
  }

  // Quiet Contemplation - show if session completed without breakthrough
  if (
    session.breakthrough === false &&
    session.completedAt &&
    persisted.includes("quiet-contemplation")
  ) {
    earned.push(ARTIFACT_METADATA["quiet-contemplation"]);
  }

  return earned;
}

/**
 * Check if session has earned Star Born (used for artifact evaluation)
 */
export function hasStarBornBadge(earnedBadges: string[]): boolean {
  return earnedBadges.includes("star-born");
}

/**
 * Check if session should unlock Socratic Flame
 * Helper for direct checks without full evaluation
 */
export function shouldUnlockSocraticFlame(
  earnedBadges: string[],
  unlockedArtifacts: string[] = [],
): boolean {
  return earnedBadges.includes("star-born") && !unlockedArtifacts.includes("socratic-flame");
}

/**
 * Get all potential unlocks for a session (without checking if already unlocked)
 * Useful for showing preview of what's possible
 */
export function getPotentialArtifactUnlocks(
  context: ArtifactEvaluationContext,
): ArtifactMetadata[] {
  const { session, earnedBadges } = context;
  const potential: ArtifactMetadata[] = [];

  // Star Born related
  if (earnedBadges.includes("star-born")) {
    potential.push(ARTIFACT_METADATA["socratic-flame"]);
  }

  // First Light related
  if (earnedBadges.includes("first-light")) {
    potential.push(ARTIFACT_METADATA["dawn-understanding"]);
  }

  // Realm artifacts
  if (session.realm) {
    const realmArtifactMap: Record<string, string> = {
      physics: "cosmic-compass",
      chemistry: "alchemist-stone",
      biology: "life-seed",
      math: "geometry-gem",
      history: "chronicle-tome",
    };
    const artifactId = realmArtifactMap[session.realm];
    if (artifactId) {
      potential.push(ARTIFACT_METADATA[artifactId]);
    }
  }

  return potential;
}
