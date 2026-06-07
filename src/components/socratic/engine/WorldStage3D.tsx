import { Suspense } from "react";
import type { LearningState } from "../types";
import type { RealmId } from "@/lib/realms";
import type { Artifact } from "@/lib/artifacts";
import { WorldStageCamera } from "./mentor3d/WorldStageCamera";
import { MentorSceneLights } from "./mentor3d/MentorSceneLights";
import { RealmEnvironmentScene } from "./environments/RealmEnvironmentScene";
import { useMentorSettingsOptional } from "@/lib/mentor-settings-hooks";

interface Props {
  state: LearningState;
  realm?: RealmId;
  artifacts?: Artifact[];
  onObjectInteract?: (label: string, hint: string) => void;
}

function StageContent({
  state,
  realm,
  artifacts,
  onObjectInteract,
}: Required<Pick<Props, "state" | "realm" | "artifacts">> & Pick<Props, "onObjectInteract">) {
  const settings = useMentorSettingsOptional();
  const warmthBias = settings?.warmthBias ?? 0.6;

  return (
    <>
      <WorldStageCamera />
      <MentorSceneLights state={state} warmthBias={warmthBias} />
      <Suspense fallback={null}>
        <RealmEnvironmentScene
          realm={realm}
          state={state}
          onObjectInteract={onObjectInteract ?? (() => {})}
          artifacts={artifacts}
        />
      </Suspense>
    </>
  );
}

// ⚡ EXPORTED SCENE: Clean sub-scene layout completely isolated from canvas thread conflicts
export function WorldScene({ state, realm = "physics", artifacts = [], onObjectInteract }: Props) {
  return (
    <StageContent
      state={state}
      realm={realm}
      artifacts={artifacts}
      onObjectInteract={onObjectInteract}
    />
  );
}
