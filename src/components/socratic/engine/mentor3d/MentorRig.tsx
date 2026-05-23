import type { LearningState } from "../../types";
import { LumiraCharacter } from "./LumiraCharacter";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing: boolean;
}

/**
 * Renders the live Lumira mentor character (procedural 3D + animation system).
 * GLB at /models/mentor/lumira.glb remains available for a future art swap via docs/mentor-asset-spec.md.
 */
export function MentorRig({ state, isSpeaking, isPausing }: Props) {
  return <LumiraCharacter state={state} isSpeaking={isSpeaking} isPausing={isPausing} />;
}
