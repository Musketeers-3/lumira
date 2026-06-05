export type RealmId = "hub" | "physics" | "chemistry" | "biology" | "math" | "history";

export interface Realm {
  id: RealmId;
  name: string;
  shortName: string;
  emoji: string;
  tagline: string;
  description: string;
  accent: string;
  glow: string;
  unlocked: boolean;
  prerequisite?: string;
  defaultLessonId?: string;
  defaultTopic?: string;
  defaultObjective?: string;
}

export const REALMS: Realm[] = [
  {
    id: "physics",
    name: "Observatory of Physics",
    shortName: "Observatory",
    emoji: "🌌",
    tagline: "Forces, motion, and the dance of the cosmos",
    description:
      "Step among orbiting worlds and trace the invisible threads that hold the universe together.",
    accent: "#3B9EFF",
    glow: "rgba(59, 158, 255, 0.4)",
    unlocked: true,
    defaultLessonId: "moon-orbit-demo",
    defaultTopic: "Newtonian Gravity & Orbits",
    defaultObjective:
      "Discover that an orbit is continuous falling combined with sideways motion.",
  },
  {
    id: "chemistry",
    name: "Alchemist's Laboratory",
    shortName: "Laboratory",
    emoji: "🧪",
    tagline: "Matter, reactions, and hidden transformations",
    description:
      "Watch molecules collide and combine in a glowing lab where every reaction tells a story.",
    accent: "#3DDB8A",
    glow: "rgba(61, 219, 138, 0.4)",
    unlocked: true,
    defaultLessonId: "pressure-particles",
    defaultTopic: "Pressure & Particles",
    defaultObjective: "Discover that pressure is countless tiny collisions adding up.",
  },
  {
    id: "biology",
    name: "Living Garden of Biology",
    shortName: "Garden",
    emoji: "🌿",
    tagline: "Life, cells, and living systems",
    description:
      "Wander through bioluminescent paths where every organism holds a secret waiting to unfold.",
    accent: "#4AE8C8",
    glow: "rgba(74, 232, 200, 0.35)",
    unlocked: false,
    prerequisite: "Complete 2 discoveries in the Observatory",
  },
  {
    id: "math",
    name: "Hall of Infinite Patterns",
    shortName: "Hall of Patterns",
    emoji: "📐",
    tagline: "Logic, geometry, and elegant structure",
    description:
      "Walk beneath golden constellations of numbers where every pattern reveals a deeper truth.",
    accent: "#B88CFF",
    glow: "rgba(184, 140, 255, 0.4)",
    unlocked: false,
    prerequisite: "Complete 2 discoveries in the Observatory",
  },
  {
    id: "history",
    name: "Archive of Human Stories",
    shortName: "Archive",
    emoji: "📜",
    tagline: "Civilizations, change, and the passage of time",
    description:
      "Turn the pages of time itself and witness how human curiosity shaped the world.",
    accent: "#D4A054",
    glow: "rgba(212, 160, 84, 0.4)",
    unlocked: false,
    prerequisite: "Complete 3 discoveries across any world",
  },
];

const DOMAIN_TO_REALM: Record<string, RealmId> = {
  "Physical Reasoning": "physics",
  "Matter & Energy": "chemistry",
  Biology: "biology",
  Mathematics: "math",
  History: "history",
  "Meta-skill": "hub",
  General: "hub",
};

export function realmFromDomain(domain?: string): RealmId {
  if (!domain) return "hub";
  return DOMAIN_TO_REALM[domain] ?? "hub";
}

export function getRealm(id: RealmId): Realm | undefined {
  return REALMS.find((r) => r.id === id);
}

export function discoveryTitle(skillName: string): string {
  const titles: Record<string, string> = {
    "Orbits & Gravity": "Gravity Explorer",
    "Newtonian Gravity & Orbits": "Gravity Explorer",
    "Pressure & Particles": "Particle Witness",
    "Scientific Method": "Pattern Seeker",
  };
  return titles[skillName] ?? `${skillName} Discoverer`;
}

export const QUEST_BEATS = [
  { label: "Question", hint: "A mystery appears" },
  { label: "Challenge", hint: "Test your thinking" },
  { label: "Reflection", hint: "Connect the pieces" },
  { label: "Discovery", hint: "The insight emerges" },
  { label: "Celebration", hint: "A star is born" },
] as const;
