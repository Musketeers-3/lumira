import type { RealmId } from "./realms";

/** Procedural scene recipe keys — rendered by ArtifactScene. */
export type ArtifactSceneKey =
  | "orbit-system"
  | "falling-apple"
  | "pressure-jar"
  | "wave-ripple"
  | "prism-light"
  | "magnet-field"
  | "molecule-bond"
  | "alchemy-vial"
  | "crystal-lattice"
  | "fire-triangle"
  | "ph-spectrum"
  | "crystal-leaf"
  | "dna-helix"
  | "cell-pulse"
  | "ecosystem-ring"
  | "sacred-triangle"
  | "divided-rune"
  | "golden-spiral"
  | "infinity-loop"
  | "prime-grid"
  | "memory-scroll"
  | "wax-seal"
  | "compass-rose"
  | "hourglass";

export interface Artifact {
  id: string;
  name: string;
  emoji: string;
  realm: RealmId;
  skillName: string;
  description: string;
  mentorLine: string;
  scene: ArtifactSceneKey;
  accent?: string;
}

export const ARTIFACTS: Artifact[] = [
  // ── Physics ──────────────────────────────────────────────
  {
    id: "orbit-ring",
    name: "Orbit Ring",
    emoji: "💫",
    realm: "physics",
    skillName: "Newtonian Gravity & Orbits",
    description: "The path of endless falling that never lands.",
    mentorLine: "You found it — orbiting is just falling sideways forever.",
    scene: "orbit-system",
  },
  {
    id: "gravity-apple",
    name: "Falling Apple",
    emoji: "🍎",
    realm: "physics",
    skillName: "Orbits & Gravity",
    description: "Gravity pulls everything — even moons.",
    mentorLine: "Same force that pulls the apple holds the moon.",
    scene: "falling-apple",
  },
  {
    id: "wave-ripple",
    name: "Pond Ripple",
    emoji: "🌊",
    realm: "physics",
    skillName: "Waves & Energy",
    description: "Energy moves; the water does not.",
    mentorLine: "Waves carry the message, not the messenger.",
    scene: "wave-ripple",
  },
  {
    id: "prism-light",
    name: "Hidden Rainbow",
    emoji: "🌈",
    realm: "physics",
    skillName: "Light & Optics",
    description: "White light is every color, all at once.",
    mentorLine: "You split sunlight open and found the rainbow inside.",
    scene: "prism-light",
  },
  {
    id: "magnet-field",
    name: "Invisible Pull",
    emoji: "🧲",
    realm: "physics",
    skillName: "Magnetism",
    description: "Lines of force you can feel but never see.",
    mentorLine: "Some forces work without ever touching.",
    scene: "magnet-field",
  },

  // ── Chemistry ────────────────────────────────────────────
  {
    id: "particle-jar",
    name: "Pressure Jar",
    emoji: "⚗️",
    realm: "chemistry",
    skillName: "Pressure & Particles",
    description: "Countless tiny collisions, adding up to pressure.",
    mentorLine: "Pressure is just everything bumping into everything.",
    scene: "pressure-jar",
  },
  {
    id: "molecule-bond",
    name: "Bonded Pair",
    emoji: "🧬",
    realm: "chemistry",
    skillName: "Chemical Bonds",
    description: "Atoms holding hands, sharing what they have.",
    mentorLine: "Sharing electrons is how the world stays together.",
    scene: "molecule-bond",
  },
  {
    id: "alchemy-vial",
    name: "Reacting Vial",
    emoji: "🧪",
    realm: "chemistry",
    skillName: "Chemical Reactions",
    description: "Old atoms, new arrangement — nothing lost.",
    mentorLine: "Atoms just rearrange — nothing ever truly disappears.",
    scene: "alchemy-vial",
  },
  {
    id: "crystal-lattice",
    name: "Crystal Lattice",
    emoji: "💎",
    realm: "chemistry",
    skillName: "States of Matter",
    description: "Perfect order, locked in stillness.",
    mentorLine: "Solids hold their shape because their atoms hold position.",
    scene: "crystal-lattice",
  },
  {
    id: "fire-triangle",
    name: "Fire Triangle",
    emoji: "🔥",
    realm: "chemistry",
    skillName: "Combustion",
    description: "Fuel, heat, oxygen — remove one, fire dies.",
    mentorLine: "Fire needs three things at once. Take one away and it stops.",
    scene: "fire-triangle",
  },
  {
    id: "ph-spectrum",
    name: "Acid–Base Spectrum",
    emoji: "🌡️",
    realm: "chemistry",
    skillName: "Acids & Bases",
    description: "A rainbow that tells you what's hiding inside.",
    mentorLine: "Color is the secret language of acids and bases.",
    scene: "ph-spectrum",
  },

  // ── Biology ──────────────────────────────────────────────
  {
    id: "crystal-leaf",
    name: "Crystal Leaf",
    emoji: "🍃",
    realm: "biology",
    skillName: "Photosynthesis",
    description: "Sunlight, turned into life itself.",
    mentorLine: "A leaf is a quiet machine that eats light.",
    scene: "crystal-leaf",
  },
  {
    id: "dna-helix",
    name: "DNA Strand",
    emoji: "🧬",
    realm: "biology",
    skillName: "Genetics",
    description: "The instruction book written in four letters.",
    mentorLine: "Every living thing reads from the same alphabet.",
    scene: "dna-helix",
  },
  {
    id: "cell-pulse",
    name: "Living Cell",
    emoji: "🔬",
    realm: "biology",
    skillName: "Cell Biology",
    description: "A whole city, smaller than a grain of dust.",
    mentorLine: "You are made of trillions of tiny cities.",
    scene: "cell-pulse",
  },
  {
    id: "ecosystem-ring",
    name: "Ecosystem Ring",
    emoji: "🌱",
    realm: "biology",
    skillName: "Ecosystems",
    description: "Everything is eating, breathing, and giving back.",
    mentorLine: "Pull one thread and the whole web feels it.",
    scene: "ecosystem-ring",
  },

  // ── Math ─────────────────────────────────────────────────
  {
    id: "sacred-triangle",
    name: "Sacred Triangle",
    emoji: "📐",
    realm: "math",
    skillName: "Geometry",
    description: "Three angles, always summing to a half-turn.",
    mentorLine: "No matter the shape — every triangle hides the same secret.",
    scene: "sacred-triangle",
  },
  {
    id: "divided-rune",
    name: "Divided Rune",
    emoji: "➗",
    realm: "math",
    skillName: "Fractions",
    description: "One whole, split into honest pieces.",
    mentorLine: "A fraction is just a fair way of sharing.",
    scene: "divided-rune",
  },
  {
    id: "golden-spiral",
    name: "Golden Spiral",
    emoji: "🐚",
    realm: "math",
    skillName: "Patterns & Sequences",
    description: "A number nature draws over and over.",
    mentorLine: "Shells, storms, galaxies — all hum the same number.",
    scene: "golden-spiral",
  },
  {
    id: "infinity-loop",
    name: "Infinity Loop",
    emoji: "♾️",
    realm: "math",
    skillName: "Infinity",
    description: "A road that never finishes its journey.",
    mentorLine: "Some things go on forever. That's a kind of beauty.",
    scene: "infinity-loop",
  },
  {
    id: "prime-grid",
    name: "Prime Grid",
    emoji: "🔢",
    realm: "math",
    skillName: "Prime Numbers",
    description: "The atoms of every number.",
    mentorLine: "Primes are the smallest pieces every number is built from.",
    scene: "prime-grid",
  },

  // ── History ──────────────────────────────────────────────
  {
    id: "memory-scroll",
    name: "Memory Scroll",
    emoji: "📜",
    realm: "history",
    skillName: "Ancient Civilizations",
    description: "Stories pressed into something older than us.",
    mentorLine: "Every great idea once had to be remembered by hand.",
    scene: "memory-scroll",
  },
  {
    id: "wax-seal",
    name: "Wax Seal",
    emoji: "🕯️",
    realm: "history",
    skillName: "Historical Documents",
    description: "A promise, sealed and kept.",
    mentorLine: "A seal turned a piece of paper into a vow.",
    scene: "wax-seal",
  },
  {
    id: "compass-rose",
    name: "Compass Rose",
    emoji: "🧭",
    realm: "history",
    skillName: "Exploration",
    description: "Four directions, one curious heart.",
    mentorLine: "Every map started with someone brave enough to wander.",
    scene: "compass-rose",
  },
  {
    id: "hourglass",
    name: "Hourglass",
    emoji: "⏳",
    realm: "history",
    skillName: "Timelines & Change",
    description: "Time falls grain by grain — and never stops.",
    mentorLine: "History is just enough grains piled together.",
    scene: "hourglass",
  },
];

const STORAGE_KEY = "lumira-artifacts";

export function getArtifact(id: string): Artifact | undefined {
  return ARTIFACTS.find((a) => a.id === id);
}

export function getUnlockedArtifacts(unlockedSkillNames: string[]): Artifact[] {
  const names = new Set(unlockedSkillNames.map((n) => n.toLowerCase()));
  return ARTIFACTS.filter(
    (a) =>
      names.has(a.skillName.toLowerCase()) ||
      unlockedSkillNames.some((s) =>
        s.toLowerCase().includes(a.skillName.toLowerCase().split(" ")[0]),
      ),
  );
}

/** Pick a signature artifact per realm (used for World dioramas). */
export function signatureArtifactForRealm(realm: RealmId): Artifact | undefined {
  const order: Record<string, string> = {
    physics: "orbit-ring",
    chemistry: "molecule-bond",
    biology: "crystal-leaf",
    math: "sacred-triangle",
    history: "memory-scroll",
  };
  const id = order[realm];
  return id ? getArtifact(id) : undefined;
}

/** Find an artifact best matching a discovered skill / topic name. */
export function artifactForSkillName(skillName?: string): Artifact | undefined {
  if (!skillName) return undefined;
  const s = skillName.toLowerCase();
  return (
    ARTIFACTS.find((a) => a.skillName.toLowerCase() === s) ??
    ARTIFACTS.find((a) => s.includes(a.skillName.toLowerCase().split(" ")[0])) ??
    ARTIFACTS.find((a) => a.skillName.toLowerCase().split(" ")[0] && s.includes(a.skillName.toLowerCase().split(" ")[0]))
  );
}

export function persistArtifact(id: string): void {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
    if (!existing.includes(id)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, id]));
    }
  } catch {
    /* ignore */
  }
}

export function getPersistedArtifacts(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}
