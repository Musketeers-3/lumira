import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { PCFShadowMap } from "three";
import type { LearningState } from "../types";
import { MentorAvatar } from "./MentorAvatar";
import { MentorRig } from "./mentor3d/MentorRig";
import { StudyScene } from "./mentor3d/StudyScene";
import { MentorSceneLights } from "./mentor3d/MentorSceneLights";
import { useMentorSettingsOptional } from "@/lib/mentor-settings-hooks";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing?: boolean;
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

function SceneContent({ state, isSpeaking, isPausing }: Props) {
  const settings = useMentorSettingsOptional();
  const warmthBias = settings?.warmthBias ?? 0.6;

  return (
    <>
      <MentorSceneLights state={state} warmthBias={warmthBias} />
      <StudyScene state={state} warmthBias={warmthBias} />
      <Suspense fallback={null}>
        <MentorRig state={state} isSpeaking={isSpeaking} isPausing={isPausing ?? false} />
      </Suspense>
      <ContactShadows position={[0, -0.92, 0]} opacity={0.4} scale={5} blur={2.5} far={2} />
      <Environment preset="apartment" />
    </>
  );
}

export function Mentor3D({ state, isSpeaking, isPausing = false }: Props) {
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(detectWebGL());
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full" aria-hidden />;
  }

  if (!webgl) {
    return (
      <div className="h-full w-full">
        <MentorAvatar state={state} isSpeaking={isSpeaking} isPausing={isPausing} />
      </div>
    );
  }

  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.62, 2.15], fov: 36 }}
      // ENABLING ALPHA TRANSPARENCY: The canvas is now glass.
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      {/* Removed hardcoded <color> and <fog> layers. 
        The 3D rig now floats natively inside the Ambient OS environment.
      */}
      <SceneContent state={state} isSpeaking={isSpeaking} isPausing={isPausing} />
    </Canvas>
  );
}
