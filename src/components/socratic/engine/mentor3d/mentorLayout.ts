/** Horizontal canvas split: 30% mentor (left) · 70% learning world (right). */
export const SCENE_SPLIT = {
  mentorPercent: 40,
  worldPercent: 60,
} as const;

/**
 * Dedicated mentor stage (left 30% panel).
 * VRM faces +Z by default — camera sits on +Z, so rotation stays 0 (faces the child).
 */
export const MENTOR_STAGE = {
  position: [0, -1.5, 0] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  scale: 1.0,
  cameraPosition: [0, 0.12, 2.15] as [number, number, number],
  cameraLookAt: [0, -0.06, 0] as [number, number, number],
  fov: 28,
  childGaze: [0, 0.06, 1.6] as [number, number, number],
  /** Glance toward the world panel on the right. */
  worldGlance: [1.4, 0.2, 0.2] as [number, number, number],
} as const;

/** Dedicated world stage (right 70% panel). */
export const WORLD_STAGE = {
  cameraPosition: [0, 0.8, 3.05] as [number, number, number],
  cameraLookAt: [0, 0.02, -1] as [number, number, number],
  fov: 40,
} as const;

/** @deprecated Combined-scene layout — use MENTOR_STAGE / WORLD_STAGE instead. */
export const MENTOR_LAYOUT = MENTOR_STAGE;

/** @deprecated World offset not needed with split canvases. */
export const WORLD_LAYOUT = {
  offset: [0, 0, 0] as [number, number, number],
  scale: 1,
} as const;

export function toWorldSpace(point: [number, number, number]): [number, number, number] {
  return point;
}

export const MENTOR_FBX_URLS = {
  idle: "/models/idle.fbx",
  thinking: "/models/thinking.fbx",
  talking: "/models/talking.fbx",
  clapping: "/models/clapping.fbx",
} as const;

export const MENTOR_VRM_URL = "/models/mentor.vrm";
