import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { LearningState } from "../../types";

const LAMP_WARM = "#fff4e0";

const FALLBACK_COLORS: Record<LearningState, string> = {
  IDLE: "#f4d9a8",
  FOCUS: "#7fb3ff",
  CHALLENGE: "#c87850",
  CELEBRATE: "#ffd97a",
};

interface Props {
  state: LearningState;
  warmthBias?: number;
}

export function StudyScene({ state, warmthBias = 0.6 }: Props) {
  const { scene } = useGLTF("/models/study-desk.glb");
  const clone = useMemo(() => scene.clone(), [scene]);

  const lampLightRef = useRef<THREE.PointLight>(null!);
  const accentRef = useRef(new THREE.Color(FALLBACK_COLORS.IDLE));
  const lampMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // CRITICAL FIX: Read the DOM exactly ONCE per state change, keeping the render loop clean.
  useEffect(() => {
    if (typeof document !== "undefined") {
      try {
        const hex = getComputedStyle(document.documentElement)
          .getPropertyValue("--state-accent")
          .trim();
        accentRef.current.set(hex || FALLBACK_COLORS[state]);
      } catch {
        accentRef.current.set(FALLBACK_COLORS[state]);
      }
    }
  }, [state]);

  useMemo(() => {
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Hooked into the exact material name found in the console
        if (mesh.material && (mesh.material as THREE.Material).name === "LampShade") {
          mesh.material = (mesh.material as THREE.Material).clone();
          lampMaterialRef.current = mesh.material as THREE.MeshStandardMaterial;
          lampMaterialRef.current.emissive = new THREE.Color(LAMP_WARM);
        }
      }
    });
  }, [clone]);

  useFrame(() => {
    const intensity =
      state === "CHALLENGE"
        ? 0.55 + warmthBias * 0.15
        : state === "CELEBRATE"
          ? 0.5 + warmthBias * 0.2
          : state === "FOCUS"
            ? 0.45 + warmthBias * 0.1
            : 0.4 + warmthBias * 0.1;

    // Smoothly animate the physical light source on the GPU thread
    if (lampLightRef.current) {
      lampLightRef.current.intensity = THREE.MathUtils.lerp(
        lampLightRef.current.intensity,
        intensity,
        0.05,
      );
      lampLightRef.current.color.lerp(accentRef.current, 0.03);
    }

    // Smoothly animate the glowing metal hood of the lamp
    if (lampMaterialRef.current) {
      lampMaterialRef.current.emissive.lerp(accentRef.current, 0.03);
      lampMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        lampMaterialRef.current.emissiveIntensity,
        intensity * 1.5,
        0.05,
      );
    }
  });

  return (
    <group position={[-0.55, -0.94, 0.45]} rotation={[0, Math.PI / 2, 0]}>
      <primitive object={clone} position={[0, 0, 0.4]} scale={0.82} rotation={[0, 0, 0]} />

      <pointLight
        ref={lampLightRef}
        position={[0.25, 0.75, 0.2]} // Your exact calibrated coordinates
        intensity={0.5}
        color={LAMP_WARM}
        distance={3.5}
        decay={2}
        castShadow
      />
    </group>
  );
}

useGLTF.preload("/models/study-desk.glb");
