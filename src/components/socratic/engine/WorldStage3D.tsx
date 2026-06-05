import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { ACESFilmicToneMapping, PCFShadowMap } from "three";
import type { LearningState } from "../types";
import type { RealmId } from "@/lib/realms";
import type { Artifact } from "@/lib/artifacts";
import { WorldStageCamera } from "./mentor3d/WorldStageCamera";
import { MentorSceneLights } from "./mentor3d/MentorSceneLights";
import { RealmEnvironmentScene } from "./environments/RealmEnvironmentScene";
import { WORLD_STAGE } from "./mentor3d/mentorLayout";
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
      <Environment preset="night" />
    </>
  );
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function WorldStage3D({
  state,
  realm = "physics",
  artifacts = [],
  onObjectInteract,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(detectWebGL());
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full" aria-hidden />;
  if (!webgl) return <div className="h-full w-full bg-[#050507]" aria-hidden />;

  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      dpr={1}
      camera={{ position: WORLD_STAGE.cameraPosition, fov: WORLD_STAGE.fov }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
      }}
      style={{ touchAction: "none" }}
    >
      <StageContent
        state={state}
        realm={realm}
        artifacts={artifacts}
        onObjectInteract={onObjectInteract}
      />
    </Canvas>
  );
}
