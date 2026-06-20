import { useLearningState } from "@/lib/learning-state-context";
import type { LearningState } from "../types";

const LABEL: Record<LearningState, { name: string; tag: string }> = {
  IDLE: { name: "IDLE", tag: "walking with you" },
  FOCUS: { name: "FOCUS", tag: "listening kindly" },
  CHALLENGE: { name: "CHALLENGE", tag: "believing in you" },
  CELEBRATE: { name: "CELEBRATE", tag: "proud of you" },
};

interface Props {
  isSpeaking?: boolean;
  isPausing?: boolean;
}

export function StateIndicatorTag({ isSpeaking, isPausing }: Props) {
  const { state } = useLearningState();
  const { name, tag } = LABEL[state];
  const sub = isPausing ? "thinking…" : isSpeaking ? "speaking…" : tag;

  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] backdrop-blur-md transition-[box-shadow,background-color,border-color] duration-500"
      style={{
        background: "var(--grad-onyx-raised)",
        border: "1px solid rgba(201,162,75,0.32)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 22px var(--state-glow), 0 2px 8px rgba(0,0,0,0.4)",
        color: "var(--ink-secondary)",
      }}
    >
      <span className="relative inline-flex h-2 w-2">
        <span
          className="absolute inset-0 animate-ping rounded-full opacity-60"
          style={{ background: "var(--state-accent)" }}
        />
        <span
          className="relative inline-block h-2 w-2 rounded-full"
          style={{
            background: "var(--state-accent)",
            boxShadow: "0 0 12px var(--state-glow)",
          }}
        />
      </span>
      <span className="font-semibold tracking-[0.28em]" style={{ color: "var(--state-accent)" }}>
        {name}
      </span>
      <span aria-hidden className="h-3 w-px" style={{ background: "rgba(201,162,75,0.4)" }} />
      <span style={{ color: "var(--ink-secondary)" }}>{sub}</span>
    </div>
  );
}
