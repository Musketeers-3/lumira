import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { LearningState } from "../../types";

const LAMP_WARM = "#fff4e0";

interface Props {
  state: LearningState;
  warmthBias?: number;
}

function readAccent(): THREE.Color {
  if (typeof document === "undefined") return new THREE.Color("#f4d9a8");
  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue("--state-accent")
    .trim();
  try {
    return new THREE.Color(accent || "#f4d9a8");
  } catch {
    return new THREE.Color("#f4d9a8");
  }
}

export function StudyScene({ state, warmthBias = 0.6 }: Props) {
  // 1. Load your newly prepared asset
  const { scene } = useGLTF("/models/study-desk.glb");

  // Clone the scene so we can mutate it safely without affecting the cached version
  const clone = useMemo(() => scene.clone(), [scene]);

  const lampLightRef = useRef<THREE.PointLight>(null!);
  const accentRef = useRef(new THREE.Color());
  const lampMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // 2. Traverse the model to enable shadows and hook into the LampShade material
  useMemo(() => {
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Hook into the material you explicitly renamed in Blender
        if (mesh.material && (mesh.material as THREE.Material).name === "LampShade") {
          // Clone the material so we don't mutate a shared instance
          mesh.material = (mesh.material as THREE.Material).clone();
          lampMaterialRef.current = mesh.material as THREE.MeshStandardMaterial;
          lampMaterialRef.current.emissive = new THREE.Color(LAMP_WARM);
        }
      }
    });
  }, [clone]);

  // 3. The procedural life engine for the lighting
  useFrame(() => {
    accentRef.current = readAccent();

    // Calculate intensity based on the current emotional state
    const intensity =
      state === "CHALLENGE"
        ? 0.55 + warmthBias * 0.15
        : state === "CELEBRATE"
          ? 0.5 + warmthBias * 0.2
          : state === "FOCUS"
            ? 0.45 + warmthBias * 0.1
            : 0.4 + warmthBias * 0.1;

    // Update the physical light source
    if (lampLightRef.current) {
      lampLightRef.current.intensity = THREE.MathUtils.lerp(
        lampLightRef.current.intensity,
        intensity,
        0.05,
      );
      lampLightRef.current.color.lerp(accentRef.current, 0.03);
    }

    // Update the glowing material on the 3D model itself
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
    <group position={[0, -0.92, 0]}>
      {/* The imported desk model. 
        Note: You may need to tweak the position/scale slightly depending on 
        where the 3D artist placed the origin point of the model in Blender.
        I have set it close to where the old primitive desk was located.
      */}
      <primitive object={clone} position={[0, 0, 0.4]} scale={1} rotation={[0, 0, 0]} />

      {/* The physical point light. 
        You will likely need to adjust the position coordinates [x, y, z] 
        so it sits perfectly underneath the metal hood of the new lamp.
      */}
      <pointLight
        ref={lampLightRef}
        position={[-0.5, 0.7, 0.2]} // <-- Tweak this to align with the new lamp hood
        intensity={0.5}
        color={LAMP_WARM}
        distance={3.5}
        decay={2}
        castShadow
      />
    </group>
  );
}

// Preload the asset to ensure zero visual pop-in when the component mounts
useGLTF.preload("/models/study-desk.glb");
