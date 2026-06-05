import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type MentorAnimState = "idle" | "thinking" | "talking" | "clapping";

interface MentorAnimationContextValue {
  mentorState: MentorAnimState;
  setMentorState: (state: MentorAnimState) => void;
}

const MentorAnimationContext = createContext<MentorAnimationContextValue | null>(null);

export function MentorAnimationProvider({ children }: { children: ReactNode }) {
  const [mentorState, setMentorStateRaw] = useState<MentorAnimState>("idle");

  const setMentorState = useCallback((state: MentorAnimState) => {
    setMentorStateRaw(state);
  }, []);

  return (
    <MentorAnimationContext.Provider value={{ mentorState, setMentorState }}>
      {children}
    </MentorAnimationContext.Provider>
  );
}

export function useMentorAnimationState() {
  const ctx = useContext(MentorAnimationContext);
  if (!ctx) {
    throw new Error("useMentorAnimationState must be used within MentorAnimationProvider");
  }
  return ctx;
}

/** Optional hook for components outside the provider tree (e.g. tests). */
export function useMentorAnimationStateOptional() {
  return useContext(MentorAnimationContext);
}

export function deriveMentorAnimState(
  learningState: "IDLE" | "FOCUS" | "CHALLENGE" | "CELEBRATE",
  isSpeaking: boolean,
  isPausing: boolean,
): MentorAnimState {
  if (learningState === "CELEBRATE") return "clapping";
  if (isSpeaking && !isPausing) return "talking";
  if (isPausing || learningState === "FOCUS") return "thinking";
  if (learningState === "CHALLENGE") return isSpeaking ? "talking" : "thinking";
  return "idle";
}
