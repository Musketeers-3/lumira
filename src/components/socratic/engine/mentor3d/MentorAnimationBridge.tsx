import { useEffect } from "react";
import { useLearningState } from "@/lib/learning-state-context";
import { deriveMentorAnimState, useMentorAnimationState } from "@/lib/mentor-animation-context";

/**
 * Keeps the global mentor animation state in sync with learning-state signals.
 * External modules can still call setMentorState() directly for overrides.
 */
export function MentorAnimationBridge() {
  const { state, isSpeaking } = useLearningState();
  const { setMentorState } = useMentorAnimationState();

  useEffect(() => {
    setMentorState(deriveMentorAnimState(state, isSpeaking, false));
  }, [state, isSpeaking, setMentorState]);

  return null;
}

/** Bridge variant used inside the 3D canvas when isPausing is available locally. */
export function MentorAnimationBridgeWithPause({ isPausing }: { isPausing: boolean }) {
  const { state, isSpeaking } = useLearningState();
  const { setMentorState } = useMentorAnimationState();

  useEffect(() => {
    setMentorState(deriveMentorAnimState(state, isSpeaking, isPausing));
  }, [state, isSpeaking, isPausing, setMentorState]);

  return null;
}
