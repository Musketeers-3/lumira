import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { LearningState } from "../../types";
import { useCharacterLife, type CharacterRefs } from "./useCharacterLife";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing: boolean;
}

const SKIN = "#e8c4a8";
const SKIN_SHADOW = "#c9a080";
const COAT = "#3d4f62";
const COAT_LIGHT = "#5a7088";
const HAIR = "#2c2420";
const EYE_WHITE = "#f5f0e8";
const PUPIL = "#4a3828";
const SHIRT = "#e8e4dc";

function SkinMat() {
  return (
    <meshStandardMaterial
      color={SKIN}
      roughness={0.72}
      metalness={0.02}
      emissive={SKIN_SHADOW}
      emissiveIntensity={0.06}
    />
  );
}

/**
 * Primary Lumira mentor — seated study guide with procedural life (breath, blink, gaze, speech).
 */
export function LumiraCharacter({ state, isSpeaking, isPausing }: Props) {
  const root = useRef<THREE.Group>(null!);
  const torso = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const leftUpperArm = useRef<THREE.Group>(null!);
  const leftLowerArm = useRef<THREE.Group>(null!);
  const rightUpperArm = useRef<THREE.Group>(null!);
  const rightLowerArm = useRef<THREE.Group>(null!);
  const eyeL = useRef<THREE.Group>(null!);
  const eyeR = useRef<THREE.Group>(null!);
  const lidL = useRef<THREE.Mesh>(null!);
  const lidR = useRef<THREE.Mesh>(null!);
  const pupilL = useRef<THREE.Mesh>(null!);
  const pupilR = useRef<THREE.Mesh>(null!);
  const mouth = useRef<THREE.Mesh>(null!);
  const coatMat = useRef<THREE.MeshStandardMaterial>(null!);

  const refs: CharacterRefs = useMemo(
    () => ({
      root,
      torso,
      head,
      leftUpperArm,
      leftLowerArm,
      rightUpperArm,
      rightLowerArm,
      eyeL,
      eyeR,
      lidL,
      lidR,
      pupilL,
      pupilR,
      mouth,
      coatMat,
    }),
    [],
  );

  useCharacterLife({ state, isSpeaking, isPausing, refs });

  return (
    <group ref={root} position={[0, -0.42, 0.38]} rotation={[0, 0, 0]}>
      {/* Chair back (subtle) */}
      <mesh position={[0, 0.55, -0.22]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.08]} />
        <meshStandardMaterial color="#2a2420" roughness={0.92} />
      </mesh>

      {/* Hips / seated base */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.52, 0.28, 0.48]} />
        <meshStandardMaterial color="#2e3238" roughness={0.88} />
      </mesh>

      <group ref={torso} position={[0, 0.72, 0]}>
        {/* Shirt */}
        <mesh position={[0, 0.05, 0.04]} castShadow>
          <cylinderGeometry args={[0.36, 0.42, 0.75, 20]} />
          <meshStandardMaterial color={SHIRT} roughness={0.9} />
        </mesh>
        {/* Coat */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.48, 0.82, 20]} />
          <meshStandardMaterial
            ref={coatMat}
            color={COAT}
            roughness={0.82}
            emissive={COAT_LIGHT}
            emissiveIntensity={0.03}
          />
        </mesh>
        {/* Collar */}
        <mesh position={[0, 0.42, 0.12]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[0.38, 0.06, 0.04]} />
          <meshStandardMaterial color={SHIRT} roughness={0.85} />
        </mesh>
        {/* Coat lapels */}
        <mesh position={[-0.14, 0.38, 0.14]} rotation={[0.3, 0.2, 0]}>
          <boxGeometry args={[0.12, 0.22, 0.02]} />
          <meshStandardMaterial color={COAT} roughness={0.85} />
        </mesh>
        <mesh position={[0.14, 0.38, 0.14]} rotation={[0.3, -0.2, 0]}>
          <boxGeometry args={[0.12, 0.22, 0.02]} />
          <meshStandardMaterial color={COAT} roughness={0.85} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 1.18, 0.02]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.14, 14]} />
        <SkinMat />
      </mesh>

      <group ref={head} position={[0, 1.38, 0.04]}>
        {/* Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.26, 32, 32]} />
          <SkinMat />
        </mesh>
        {/* Hair cap */}
        <mesh position={[0, 0.1, -0.04]}>
          <sphereGeometry args={[0.27, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.65]} />
          <meshStandardMaterial color={HAIR} roughness={0.95} />
        </mesh>
        {/* Side hair */}
        <mesh position={[-0.2, 0.05, 0.02]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.06, 0.12, 4, 8]} />
          <meshStandardMaterial color={HAIR} roughness={0.95} />
        </mesh>
        <mesh position={[0.2, 0.05, 0.02]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.06, 0.12, 4, 8]} />
          <meshStandardMaterial color={HAIR} roughness={0.95} />
        </mesh>
        {/* Nose */}
        <mesh position={[0, -0.02, 0.24]} rotation={[0.4, 0, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={SKIN_SHADOW} roughness={0.75} />
        </mesh>
        {/* Brows */}
        <mesh position={[-0.09, 0.1, 0.22]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.1, 0.018, 0.02]} />
          <meshStandardMaterial color={HAIR} roughness={0.9} />
        </mesh>
        <mesh position={[0.09, 0.1, 0.22]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.1, 0.018, 0.02]} />
          <meshStandardMaterial color={HAIR} roughness={0.9} />
        </mesh>

        {/* Left eye */}
        <group ref={eyeL} position={[-0.095, 0.04, 0.23]}>
          <mesh scale={[1.2, 0.85, 0.5]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color={EYE_WHITE} roughness={0.4} />
          </mesh>
          <mesh ref={pupilL} position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshStandardMaterial color={PUPIL} roughness={0.3} />
          </mesh>
          <mesh ref={lidL} position={[0, 0.03, 0.03]} scale={[1.15, 1, 0.6]}>
            <sphereGeometry args={[0.048, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={SKIN} roughness={0.7} />
          </mesh>
        </group>

        {/* Right eye */}
        <group ref={eyeR} position={[0.095, 0.04, 0.23]}>
          <mesh scale={[1.2, 0.85, 0.5]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color={EYE_WHITE} roughness={0.4} />
          </mesh>
          <mesh ref={pupilR} position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshStandardMaterial color={PUPIL} roughness={0.3} />
          </mesh>
          <mesh ref={lidR} position={[0, 0.03, 0.03]} scale={[1.15, 1, 0.6]}>
            <sphereGeometry args={[0.048, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={SKIN} roughness={0.7} />
          </mesh>
        </group>

        {/* Mouth */}
        <mesh ref={mouth} position={[0, -0.1, 0.24]}>
          <boxGeometry args={[0.1, 0.022, 0.015]} />
          <meshStandardMaterial color="#7a5548" roughness={0.65} />
        </mesh>
      </group>

      {/* Left arm — upper + forearm + hand on desk */}
      <group ref={leftUpperArm} position={[-0.42, 1.02, 0.08]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.085, 0.38, 8, 14]} />
          <meshStandardMaterial color={COAT} roughness={0.85} />
        </mesh>
        <group ref={leftLowerArm} position={[0, -0.42, 0.12]}>
          <mesh position={[0, -0.18, 0.08]} castShadow>
            <capsuleGeometry args={[0.07, 0.32, 8, 12]} />
            <meshStandardMaterial color={COAT} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.38, 0.2]} castShadow>
            <sphereGeometry args={[0.075, 14, 14]} />
            <SkinMat />
          </mesh>
        </group>
      </group>

      {/* Right arm */}
      <group ref={rightUpperArm} position={[0.42, 1.02, 0.08]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.085, 0.38, 8, 14]} />
          <meshStandardMaterial color={COAT} roughness={0.85} />
        </mesh>
        <group ref={rightLowerArm} position={[0, -0.42, 0.12]}>
          <mesh position={[0, -0.18, 0.08]} castShadow>
            <capsuleGeometry args={[0.07, 0.32, 8, 12]} />
            <meshStandardMaterial color={COAT} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.38, 0.2]} castShadow>
            <sphereGeometry args={[0.075, 14, 14]} />
            <SkinMat />
          </mesh>
        </group>
      </group>
    </group>
  );
}
