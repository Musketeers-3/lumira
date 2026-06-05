import type { RealmId } from "./realms";

export interface Artifact {
  id: string;
  name: string;
  emoji: string;
  realm: RealmId;
  skillName: string;
  description: string;
}

export const ARTIFACTS: Artifact[] = [
  {
    id: "gravity-apple",
    name: "Falling Apple",
    emoji: "🍎",
    realm: "physics",
    skillName: "Orbits & Gravity",
    description: "A reminder that gravity pulls everything — even moons.",
  },
  {
    id: "orbit-ring",
    name: "Orbit Ring",
    emoji: "💫",
    realm: "physics",
    skillName: "Newtonian Gravity & Orbits",
    description: "The path of endless falling that never lands.",
  },
  {
    id: "particle-jar",
    name: "Particle Jar",
    emoji: "⚗️",
    realm: "chemistry",
    skillName: "Pressure & Particles",
    description: "Countless tiny collisions, adding up to pressure.",
  },
];

const STORAGE_KEY = "lumira-artifacts";

export function getUnlockedArtifacts(unlockedSkillNames: string[]): Artifact[] {
  const names = new Set(unlockedSkillNames.map((n) => n.toLowerCase()));
  return ARTIFACTS.filter(
    (a) =>
      names.has(a.skillName.toLowerCase()) ||
      unlockedSkillNames.some((s) => s.toLowerCase().includes(a.skillName.toLowerCase().split(" ")[0])),
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
