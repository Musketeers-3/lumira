import type { LearningState } from "../types";
import { Waveform } from "./Waveform";
import { Mentor3D } from "./Mentor3D"; // Importing the secure fallback wrapper

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing?: boolean;
}

export function MentorCanvas({ state, isSpeaking, isPausing = false }: Props) {
  return (
    <div className="relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-[1.1rem] transition-colors duration-700 ease-in-out">
      {/* 
        3D WebGL / SVG Fallback Layer
        Delegates to Mentor3D to ensure WebGL support checking and alpha transparency are applied.
      */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="h-full w-full">
          <Mentor3D state={state} isSpeaking={isSpeaking} isPausing={isPausing} />
        </div>
      </div>

      {/* Audio Waveform Layer */}
      <div className="relative z-10 mt-auto p-6 pointer-events-none">
        <Waveform active={isSpeaking && !isPausing} />
      </div>
    </div>
  );
}
