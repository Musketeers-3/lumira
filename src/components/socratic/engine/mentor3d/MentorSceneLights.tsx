import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LearningState } from "../../types";

interface Props {
  state: LearningState;
  warmthBias?: number;
}

const FALLBACK: Record<LearningState, string> = {
  IDLE: "#f4d9a8",
  FOCUS: "#7fb3ff",
  CHALLENGE: "#c87850",
  CELEBRATE: "#ffd97a",
};

export function MentorSceneLights({ state, warmthBias = 0.6 }: Props) {
  const keyRef = useRef<THREE.DirectionalLight>(null!);
  const fillRef = useRef<THREE.DirectionalLight>(null!);
  const targetColor = useRef(new THREE.Color(FALLBACK["IDLE"]));

  // CRITICAL FIX: Read the DOM exactly ONCE per state change, not 60 times a second.
  useEffect(() => {
    if (typeof document !== "undefined") {
      try {
        const hex = getComputedStyle(document.documentElement)
          .getPropertyValue("--state-accent")
          .trim();
        targetColor.current.set(hex || FALLBACK[state]);
      } catch {
        targetColor.current.set(FALLBACK[state]);
      }
    }
  }, [state]);

  useFrame(() => {
    const keyIntensity =
      state === "CHALLENGE"
        ? 1.0 + warmthBias * 0.15
        : state === "CELEBRATE"
          ? 0.85 + warmthBias * 0.1
          : state === "FOCUS"
            ? 0.9
            : 0.75;

    const fillIntensity =
      state === "CHALLENGE" ? 0.28 : state === "CELEBRATE" ? 0.38 + warmthBias * 0.1 : 0.42;

    // Smoothly interpolate the lights on the GPU thread without locking the DOM
    if (keyRef.current) {
      keyRef.current.color.lerp(targetColor.current, 0.04);
      keyRef.current.intensity = THREE.MathUtils.lerp(keyRef.current.intensity, keyIntensity, 0.05);
    }
    if (fillRef.current) {
      fillRef.current.color.lerp(targetColor.current, 0.02);
      fillRef.current.intensity = THREE.MathUtils.lerp(
        fillRef.current.intensity,
        fillIntensity,
        0.05,
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.38 + warmthBias * 0.08} />
      <directionalLight
        ref={keyRef}
        position={[1.8, 2.8, 1.6]}
        intensity={0.9}
        color={FALLBACK[state]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        ref={fillRef}
        position={[-2, 1.2, -0.8]}
        intensity={0.4}
        color={FALLBACK[state]}
      />
      <pointLight position={[0.2, 1.6, 1.2]} intensity={0.35 + warmthBias * 0.1} color="#fff2dc" />
    </>
  );
}
