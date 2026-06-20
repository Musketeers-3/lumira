/**
 * Artifact Definitions
 *
 * Contains metadata for all collectible artifacts in Lumira.
 * Add new artifacts here - no need to modify UI components.
 */

import type {
  ArtifactMetadata,
  ArtifactDefinition,
  ArtifactRegistry,
  ArtifactUnlockCondition,
} from "./types";

/**
 * Socratic Flame - Unlocked with Star Born achievement
 * The eternal flame of wisdom, sparked by a remarkable discovery
 */
const SOCRATIC_FLAME: ArtifactMetadata = {
  id: "socratic-flame",
  name: "Socratic Flame",
  icon: "🔥",
  description: "The eternal flame of wisdom, sparked by a remarkable discovery.",
  rarity: "legendary",
};

/**
 * Gravity Compass - Unlocked after 3 Physics realm discoveries
 * A compass that points toward cosmic truths in the Physics realm
 */
const GRAVITY_COMPASS: ArtifactMetadata = {
  id: "gravity-compass",
  name: "Gravity Compass",
  icon: "🧭",
  description: "A compass that guides through gravitational mysteries. Unlocked after 3 Physics discoveries.",
  rarity: "rare",
  realm: "physics",
};

/**
 * Particle Crystal - Unlocked with high score in Pressure topics
 * A crystal formed from the pressure of understanding
 */
const PARTICLE_CRYSTAL: ArtifactMetadata = {
  id: "particle-crystal",
  name: "Particle Crystal",
  icon: "💎",
  description: "A crystal of understanding, born from mastering pressure and particles.",
  rarity: "rare",
  realm: "chemistry",
};

/**
 * Master Cartographer - Unlocked after discovering 3 different realms
 * A master mapmaker who has explored many worlds
 */
const MASTER_CARTOGRAPHER: ArtifactMetadata = {
  id: "master-cartographer",
  name: "Master Cartographer",
  icon: "🗺️",
  description: "A master explorer who has charted the paths of three distinct worlds.",
  rarity: "legendary",
};

/**
 * First Light Artifact - First breakthrough achievement
 * A dawning of understanding
 */
const DAWN_UNDERSTANDING: ArtifactMetadata = {
  id: "dawn-understanding",
  name: "Dawn of Understanding",
  icon: "🌅",
  description: "The first light of understanding dawns in your mind.",
  rarity: "rare",
};

/**
 * Physics Realm Artifact - Exploring the Observatory
 */
const COSMIC_COMPASS: ArtifactMetadata = {
  id: "cosmic-compass",
  name: "Cosmic Compass",
  icon: "🧭",
  description: "A compass that points toward cosmic truths.",
  rarity: "rare",
  realm: "physics",
};

/**
 * Chemistry Realm Artifact - Exploring the Laboratory
 */
const ALCHEMIST_STONE: ArtifactMetadata = {
  id: "alchemist-stone",
  name: "Alchemist's Stone",
  icon: "💎",
  description: "The legendary stone that transforms base knowledge into gold.",
  rarity: "rare",
  realm: "chemistry",
};

/**
 * Biology Realm Artifact - Exploring the Garden
 */
const LIFE_SEED: ArtifactMetadata = {
  id: "life-seed",
  name: "Life Seed",
  icon: "🌱",
  description: "A seed containing the spark of living knowledge.",
  rarity: "rare",
  realm: "biology",
};

/**
 * Math Realm Artifact - Exploring the Hall of Patterns
 */
const GEOMETRY_GEM: ArtifactMetadata = {
  id: "geometry-gem",
  name: "Geometry Gem",
  icon: "💠",
  description: "A gem cut with perfect mathematical precision.",
  rarity: "rare",
  realm: "math",
};

/**
 * History Realm Artifact - Exploring the Archive
 */
const CHRONICLE_TOME: ArtifactMetadata = {
  id: "chronicle-tome",
  name: "Chronicle Tome",
  icon: "📖",
  description: "A tome containing the stories of human discovery.",
  rarity: "rare",
  realm: "history",
};

/**
 * Hidden Artifact - Complete a session without breakthroughs
 */
const QUIET_CONTEMPLATION: ArtifactMetadata = {
  id: "quiet-contemplation",
  name: "Quiet Contemplation",
  icon: "🌙",
  description: "Wisdom earned through silent reflection.",
  rarity: "rare",
};

/**
 * Hidden Artifact - High message count
 */
const PERSISTENT_INQUIRER: ArtifactMetadata = {
  id: "persistent-inquirer",
  name: "Persistent Inquirer",
  icon: "🔍",
  description: "Never stops asking questions.",
  rarity: "common",
};

/**
 * Export artifact metadata for direct use
 */
export const ARTIFACT_METADATA: Record<string, ArtifactMetadata> = {
  "socratic-flame": SOCRATIC_FLAME,
  "gravity-compass": GRAVITY_COMPASS,
  "particle-crystal": PARTICLE_CRYSTAL,
  "master-cartographer": MASTER_CARTOGRAPHER,
  "dawn-understanding": DAWN_UNDERSTANDING,
  "cosmic-compass": COSMIC_COMPASS,
  "alchemist-stone": ALCHEMIST_STONE,
  "life-seed": LIFE_SEED,
  "geometry-gem": GEOMETRY_GEM,
  "chronicle-tome": CHRONICLE_TOME,
  "quiet-contemplation": QUIET_CONTEMPLATION,
  "persistent-inquirer": PERSISTENT_INQUIRER,
};

/**
 * Get artifact metadata by ID
 */
export function getArtifactMetadata(artifactId: string): ArtifactMetadata | undefined {
  return ARTIFACT_METADATA[artifactId];
}

/**
 * Unlock condition: Star Born achievement
 */
const UNLOCK_STAR_BORN: ArtifactUnlockCondition = {
  type: "achievement",
  requirement: "star-born",
};

/**
 * Unlock condition: 3 Physics realm discoveries
 */
const UNLOCK_GRAVITY_COMPASS: ArtifactUnlockCondition = {
  type: "realm",
  requirement: "physics",
  value: 3,
};

/**
 * Unlock condition: High score in Pressure topic
 */
const UNLOCK_PARTICLE_CRYSTAL: ArtifactUnlockCondition = {
  type: "lesson",
  requirement: "pressure",
  value: 90,
};

/**
 * Unlock condition: 3 different realms
 */
const UNLOCK_MASTER_CARTOGRAPHER: ArtifactUnlockCondition = {
  type: "realm",
  requirement: "multiple",
  value: 3,
};

/**
 * Unlock condition: First breakthrough
 */
const UNLOCK_FIRST_BREAKTHROUGH: ArtifactUnlockCondition = {
  type: "achievement",
  requirement: "first-light",
};

/**
 * Unlock condition: Physics realm exploration
 */
const UNLOCK_PHYSICS_REALM: ArtifactUnlockCondition = {
  type: "realm",
  requirement: "physics",
};

/**
 * Unlock condition: Chemistry realm exploration
 */
const UNLOCK_CHEMISTRY_REALM: ArtifactUnlockCondition = {
  type: "realm",
  requirement: "chemistry",
};

/**
 * Unlock condition: Biology realm exploration
 */
const UNLOCK_BIOLOGY_REALM: ArtifactUnlockCondition = {
  type: "realm",
  requirement: "biology",
};

/**
 * Unlock condition: Math realm exploration
 */
const UNLOCK_MATH_REALM: ArtifactUnlockCondition = {
  type: "realm",
  requirement: "math",
};

/**
 * Unlock condition: History realm exploration
 */
const UNLOCK_HISTORY_REALM: ArtifactUnlockCondition = {
  type: "realm",
  requirement: "history",
};

/**
 * Unlock condition: Complete session without breakthrough
 */
const UNLOCK_QUIET_SESSION: ArtifactUnlockCondition = {
  type: "session",
  requirement: "no-breakthrough",
};

/**
 * Unlock condition: High message count
 */
const UNLOCK_MANY_MESSAGES: ArtifactUnlockCondition = {
  type: "session",
  requirement: "many-messages",
  value: 20,
};

/**
 * Registry of all artifact definitions
 */
export const ARTIFACT_REGISTRY: ArtifactRegistry = {
  "socratic-flame": {
    metadata: SOCRATIC_FLAME,
    unlockCondition: UNLOCK_STAR_BORN,
  },
  "gravity-compass": {
    metadata: GRAVITY_COMPASS,
    unlockCondition: UNLOCK_GRAVITY_COMPASS,
  },
  "particle-crystal": {
    metadata: PARTICLE_CRYSTAL,
    unlockCondition: UNLOCK_PARTICLE_CRYSTAL,
  },
  "master-cartographer": {
    metadata: MASTER_CARTOGRAPHER,
    unlockCondition: UNLOCK_MASTER_CARTOGRAPHER,
  },
  "dawn-understanding": {
    metadata: DAWN_UNDERSTANDING,
    unlockCondition: UNLOCK_FIRST_BREAKTHROUGH,
  },
  "cosmic-compass": {
    metadata: COSMIC_COMPASS,
    unlockCondition: UNLOCK_PHYSICS_REALM,
  },
  "alchemist-stone": {
    metadata: ALCHEMIST_STONE,
    unlockCondition: UNLOCK_CHEMISTRY_REALM,
  },
  "life-seed": {
    metadata: LIFE_SEED,
    unlockCondition: UNLOCK_BIOLOGY_REALM,
  },
  "geometry-gem": {
    metadata: GEOMETRY_GEM,
    unlockCondition: UNLOCK_MATH_REALM,
  },
  "chronicle-tome": {
    metadata: CHRONICLE_TOME,
    unlockCondition: UNLOCK_HISTORY_REALM,
  },
  "quiet-contemplation": {
    metadata: QUIET_CONTEMPLATION,
    unlockCondition: UNLOCK_QUIET_SESSION,
  },
  "persistent-inquirer": {
    metadata: PERSISTENT_INQUIRER,
    unlockCondition: UNLOCK_MANY_MESSAGES,
  },
};

/**
 * List of all artifact IDs
 */
export const ALL_ARTIFACT_IDS = Object.keys(ARTIFACT_METADATA);

/**
 * Get all artifact metadata
 */
export function getAllArtifactMetadata(): ArtifactMetadata[] {
  return Object.values(ARTIFACT_METADATA);
}

/**
 * Get artifacts by realm
 */
export function getArtifactsByRealm(realm: string): ArtifactMetadata[] {
  return Object.values(ARTIFACT_METADATA).filter((artifact) => artifact.realm === realm);
}

/**
 * Get hidden artifacts
 */
export function getHiddenArtifacts(): ArtifactMetadata[] {
  return Object.values(ARTIFACT_METADATA).filter(
    (artifact) => artifact.rarity === "rare" && !artifact.realm,
  );
}
