import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LearningState } from "../../types";

const WOOD = "#4a3528";
const WOOD_DARK = "#2e2118";
const LAMP_WARM = "#fff4e0";
const BOOK = "#5c4a3a";

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
  const lampRef = useRef<THREE.PointLight>(null!);
  const accentRef = useRef(new THREE.Color());

  useFrame(() => {
    accentRef.current = readAccent();
    if (lampRef.current) {
      const intensity =
        state === "CHALLENGE"
          ? 0.55 + warmthBias * 0.15
          : state === "CELEBRATE"
            ? 0.5 + warmthBias * 0.2
            : state === "FOCUS"
              ? 0.45 + warmthBias * 0.1
              : 0.4 + warmthBias * 0.1;
      lampRef.current.intensity = THREE.MathUtils.lerp(lampRef.current.intensity, intensity, 0.05);
      lampRef.current.color.lerp(accentRef.current, 0.03);
    }
  });

  return (
    <group position={[0, -0.92, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.92} />
      </mesh>

      {/* Back wall gradient plane */}
      <mesh position={[0, 1.8, -2.2]}>
        <planeGeometry args={[6, 3.5]} />
        <meshStandardMaterial color="#1a1512" roughness={1} />
      </mesh>

      {/* Desk — aligned with mentor hands */}
      <mesh position={[0, 0.38, 0.42]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.08, 0.9]} />
        <meshStandardMaterial color={WOOD} roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.04, 0.42]} castShadow>
        <boxGeometry args={[0.12, 0.42, 0.7]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.9} />
      </mesh>
      <mesh position={[-0.55, 0.04, 0.42]} castShadow>
        <boxGeometry args={[0.12, 0.42, 0.7]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.9} />
      </mesh>

      {/* Book stack */}
      <mesh position={[0.55, 0.52, 0.2]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.22, 0.06, 0.16]} />
        <meshStandardMaterial color={BOOK} roughness={0.85} />
      </mesh>
      <mesh position={[0.58, 0.58, 0.22]} rotation={[0, 0.15, 0.04]} castShadow>
        <boxGeometry args={[0.2, 0.05, 0.14]} />
        <meshStandardMaterial color="#6b5544" roughness={0.85} />
      </mesh>

      {/* Desk lamp */}
      <group position={[-0.65, 0.44, 0.22]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.7, 8]} />
          <meshStandardMaterial color="#8a7a68" metalness={0.3} roughness={0.6} />
        </mesh>
        <mesh position={[0.12, 0.68, 0.08]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.12, 0.14, 12, 1, true]} />
          <meshStandardMaterial
            color={LAMP_WARM}
            emissive={LAMP_WARM}
            emissiveIntensity={0.35 + warmthBias * 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight
          ref={lampRef}
          position={[0.12, 0.6, 0.1]}
          intensity={0.5}
          color={LAMP_WARM}
          distance={3}
          decay={2}
        />
      </group>
    </group>
  );
}
