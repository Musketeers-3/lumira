/**
 * Artifacts Module
 *
 * Centralized artifact system for Lumira.
 * Provides artifact definitions, evaluation, and types.
 */

// Types
export type {
  ArtifactRarity,
  ArtifactMetadata,
  ArtifactUnlockCondition,
  ArtifactDefinition,
  ArtifactResult,
  SessionArtifactData,
  ArtifactEvaluationContext,
  ArtifactRegistry,
  UnlockedArtifact,
} from "./types";

// Artifact Definitions
export {
  ARTIFACT_METADATA,
  ARTIFACT_REGISTRY,
  ALL_ARTIFACT_IDS,
  getArtifactMetadata,
  getAllArtifactMetadata,
  getArtifactsByRealm,
  getHiddenArtifacts,
} from "./artifactDefinitions";

// Artifact Evaluator
export {
  evaluateArtifacts,
  shouldUnlockArtifact,
  getUnlockedArtifacts,
  hasStarBornBadge,
  shouldUnlockSocraticFlame,
  getPotentialArtifactUnlocks,
  getEarnedArtifacts,
  // Persistence functions
  getPersistedArtifactIds,
  persistArtifactUnlock,
  isArtifactUnlocked,
} from "./artifactEvaluator";
