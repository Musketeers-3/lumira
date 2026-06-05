import { MentorModel } from "./MentorModel";

interface Props {
  isSpeaking: boolean;
  isPausing: boolean;
  lookTarget?: [number, number, number] | null;
}

/**
 * Renders the live Lumira mentor character with FBX-driven VRM animations.
 */
export function MentorRig({ isSpeaking, isPausing, lookTarget }: Props) {
  return <MentorModel isSpeaking={isSpeaking} isPausing={isPausing} lookTarget={lookTarget} />;
}
