import { Canvas } from "@react-three/fiber";
import type { LearningState } from "../types";
import { Waveform } from "./Waveform";
import { MentorModel } from "./mentor3d/MentorModel";
import { MentorSceneLights } from "./mentor3d/MentorSceneLights";
import { StudyScene } from "./mentor3d/StudyScene";

const tagFor = (s: LearningState) =>
  s === "IDLE"
    ? "Walking with you"
    : s === "FOCUS"
      ? "Listening kindly"
      : s === "CHALLENGE"
        ? "Believing in you"
        : "Proud of you";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing?: boolean;
}

export function MentorCanvas({ state, isSpeaking, isPausing = false }: Props) {
  return (
    <div
      className="relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl border border-glass-border bg-white/[0.03] p-6 backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-700 ease-in-out"
      style={{
        boxShadow: "0 0 80px -10px var(--state-glow), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-700">
          <span
            className="h-2 w-2 animate-pulse rounded-full"
            style={{ background: "var(--state-accent)", boxShadow: "0 0 12px var(--state-glow)" }}
          />
          <span>Mentor:</span>
          <span className="text-state-accent transition-colors duration-700">
            {isPausing ? "Thinking…" : tagFor(state)}
          </span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          lumira.study
        </div>
      </div>

      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="h-full w-full">
          <Canvas camera={{ position: [0, -0.15, 1.7], fov: 45 }}>
            <MentorSceneLights state={state} />
            <StudyScene state={state} />
            <MentorModel state={state} isSpeaking={isSpeaking} isPausing={isPausing} />
          </Canvas>
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <Waveform active={isSpeaking && !isPausing} />
      </div>
    </div>
  );
}
