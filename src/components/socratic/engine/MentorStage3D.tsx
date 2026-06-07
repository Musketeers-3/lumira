import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import type { LearningState } from "../types";
import { MentorRig } from "./mentor3d/MentorRig";
import { MentorStageCamera } from "./mentor3d/MentorStageCamera";
import { MentorAnimationBridgeWithPause } from "./mentor3d/MentorAnimationBridge";
import { MentorSceneLights } from "./mentor3d/MentorSceneLights";
import { MENTOR_STAGE } from "./mentor3d/mentorLayout";
import { useMentorSettingsOptional } from "@/lib/mentor-settings-hooks";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing?: boolean;
  lookTarget?: [number, number, number] | null;
}

function StageContent({ state, isSpeaking, isPausing, lookTarget }: Required<Props>) {
  const settings = useMentorSettingsOptional();
  const warmthBias = settings?.warmthBias ?? 0.6;

  return (
    <>
      <color attach="background" args={["#050507"]} />
      <MentorStageCamera />
      <MentorAnimationBridgeWithPause isPausing={isPausing} />
      <MentorSceneLights state={state} warmthBias={warmthBias} />
      <Suspense fallback={null}>
        <MentorRig isSpeaking={isSpeaking} isPausing={isPausing} lookTarget={lookTarget} />
      </Suspense>
    </>
  );
}

export function MentorStage3D({ state, isSpeaking, isPausing = false, lookTarget = null }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full" aria-hidden />;

  return (
    <Canvas
      dpr={1}
      camera={{ position: MENTOR_STAGE.cameraPosition, fov: MENTOR_STAGE.fov }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
      }}
      style={{ touchAction: "none" }}
    >
      <StageContent
        state={state}
        isSpeaking={isSpeaking}
        isPausing={isPausing}
        lookTarget={lookTarget}
      />
    </Canvas>
  );
}
