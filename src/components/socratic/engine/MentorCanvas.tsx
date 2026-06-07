import type { LearningState } from "../types";
import type { RealmId } from "@/lib/realms";
import type { Artifact } from "@/lib/artifacts";
import { Waveform } from "./Waveform";
import { MentorStage3D } from "./MentorStage3D";
import { WorldStage3D } from "./WorldStage3D";
import { SCENE_SPLIT } from "./mentor3d/mentorLayout";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing?: boolean;
  realm?: RealmId;
  artifacts?: Artifact[];
  lookTarget?: [number, number, number] | null;
  onObjectInteract?: (label: string, hint: string) => void;
}

export function MentorCanvas({
  state,
  isSpeaking,
  isPausing = false,
  realm = "physics",
  artifacts = [],
  lookTarget = null,
  onObjectInteract,
}: Props) {
  return (
    <div className="relative flex h-full w-full overflow-hidden transition-colors duration-700 ease-in-out">
      {/* Left 30% — mentor faces the child */}
      <div
        className="relative h-full shrink-0 overflow-hidden"
        style={{
          width: `${SCENE_SPLIT.mentorPercent}%`,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          background: "radial-gradient(ellipse at 50% 60%, rgba(59,158,255,0.06), transparent 70%)",
        }}
      >
        <MentorStage3D
          state={state}
          isSpeaking={isSpeaking}
          isPausing={isPausing}
          lookTarget={lookTarget}
        />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 p-3">
          <Waveform active={isSpeaking && !isPausing} />
        </div>
      </div>

      {/* Right 70% — interactive learning world */}
      <div
        className="relative h-full flex-1 overflow-hidden"
        style={{ width: `${SCENE_SPLIT.worldPercent}%` }}
      >
        <WorldStage3D
          state={state}
          realm={realm}
          artifacts={artifacts}
          onObjectInteract={onObjectInteract}
        />
      </div>
    </div>
  );
}
