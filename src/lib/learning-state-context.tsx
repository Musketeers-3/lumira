import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LearningState } from "@/components/socratic/types";

interface Ctx {
  state: LearningState;
  setState: (s: LearningState) => void;
  isSpeaking: boolean;
  setIsSpeaking: (v: boolean) => void;
}

const LearningStateContext = createContext<Ctx | null>(null);

export function LearningStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearningState>("IDLE");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-state", state);
    }
  }, [state]);

  return (
    <LearningStateContext.Provider value={{ state, setState, isSpeaking, setIsSpeaking }}>
      {children}
    </LearningStateContext.Provider>
  );
}

export function useLearningState() {
  const ctx = useContext(LearningStateContext);
  if (!ctx) throw new Error("useLearningState must be used within LearningStateProvider");
  return ctx;
}
