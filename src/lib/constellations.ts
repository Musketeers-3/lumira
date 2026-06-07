import type { RealmId } from "./realms";

export type StarRarity = "common" | "rare" | "legendary";

export interface DiscoveryPayload {
  realm: RealmId;
  artifact: string;
  topic: string;
  insight: string;
  rarity: StarRarity;
  constellationWeight: number;
}

// Fixed SVG percentage coordinates (0-100) for deterministic layouts.
export const CONSTELLATION_SHAPES: Record<RealmId, { x: number; y: number }[]> = {
  physics: [
    // The Orbital Serpent (Spiraling inward)
    { x: 15, y: 85 },
    { x: 25, y: 65 },
    { x: 45, y: 70 },
    { x: 65, y: 55 },
    { x: 55, y: 35 },
    { x: 35, y: 40 },
    { x: 45, y: 20 },
    { x: 75, y: 15 },
    { x: 85, y: 35 },
  ],
  biology: [
    // The World Tree (Branching upward)
    { x: 50, y: 90 },
    { x: 50, y: 70 },
    { x: 35, y: 55 },
    { x: 65, y: 55 },
    { x: 25, y: 35 },
    { x: 75, y: 35 },
    { x: 40, y: 20 },
    { x: 60, y: 20 },
    { x: 50, y: 10 },
  ],
  math: [
    // The Sacred Compass (Geometric expansion)
    { x: 50, y: 50 },
    { x: 50, y: 25 },
    { x: 75, y: 50 },
    { x: 50, y: 75 },
    { x: 25, y: 50 },
    { x: 25, y: 25 },
    { x: 75, y: 25 },
    { x: 75, y: 75 },
    { x: 25, y: 75 },
  ],
  chemistry: [
    // The Alchemist's Vial
    { x: 40, y: 20 },
    { x: 60, y: 20 },
    { x: 50, y: 40 },
    { x: 35, y: 60 },
    { x: 65, y: 60 },
    { x: 30, y: 80 },
    { x: 70, y: 80 },
    { x: 50, y: 85 },
  ],
  history: [
    // The Ancient Crown
    { x: 20, y: 30 },
    { x: 50, y: 15 },
    { x: 80, y: 30 },
    { x: 35, y: 50 },
    { x: 65, y: 50 },
    { x: 25, y: 80 },
    { x: 50, y: 75 },
    { x: 75, y: 80 },
  ],
  hub: [{ x: 50, y: 50 }],
};
