import { Suspense } from "react";
import type { LearningState } from "../types";
import { MentorRig } from "./mentor3d/MentorRig";
import { MentorStageCamera } from "./mentor3d/MentorStageCamera";
import { MentorAnimationBridgeWithPause } from "./mentor3d/MentorAnimationBridge";
import { MentorSceneLights } from "./mentor3d/MentorSceneLights";
import { useMentorSettingsOptional } from "@/lib/mentor-settings-hooks";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing?: boolean;
  lookTarget?: [number, number, number] | null;
}

function LoadingBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" wireframe />
    </mesh>
  );
}

function StageContent({ state, isSpeaking, isPausing, lookTarget }: Required<Props>) {
  const settings = useMentorSettingsOptional();
  const warmthBias = settings?.warmthBias ?? 0.6;

  return (
    <>
      <color attach="background" args={["#050507"]} />
      <MentorStageCamera />

      {/* 🟢 PROOF OF LIFE SPHERE - OUTSIDE SUSPENSE */}
      <mesh position={[0, 1, 0]} scale={5}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="lime" wireframe />
      </mesh>

      <MentorSceneLights state={state} warmthBias={warmthBias} />

      <Suspense fallback={null}>
        <MentorAnimationBridgeWithPause isPausing={isPausing} />
        <MentorRig isSpeaking={isSpeaking} isPausing={isPausing} lookTarget={lookTarget} />
      </Suspense>
    </>
  );
}

// ⚡ EXPORTED SCENE: Stripped of <Canvas> to play nice with the ViewPort tracker
export function MentorScene({ state, isSpeaking, isPausing = false, lookTarget = null }: Props) {
  return (
    <StageContent
      state={state}
      isSpeaking={isSpeaking}
      isPausing={isPausing}
      lookTarget={lookTarget}
    />
  );
}
