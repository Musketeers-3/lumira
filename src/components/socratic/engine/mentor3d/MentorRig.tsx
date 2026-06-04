import type { LearningState } from "../../types";
import { MentorModel } from "./MentorModel";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing: boolean;
}

/**
 * Renders the live Lumira mentor character.
 * We have officially swapped from the procedural fallback to the high-fidelity VRM pipeline.
 */
export function MentorRig({ state, isSpeaking, isPausing }: Props) {
  return <MentorModel state={state} isSpeaking={isSpeaking} isPausing={isPausing} />;
}
