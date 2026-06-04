import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { LearningState } from "../../types";
import { useCharacterLife, type CharacterRefs } from "./useCharacterLife";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing: boolean;
}

const SKIN = "#e8c4a8",
  COAT = "#3d4f62",
  COAT_LIGHT = "#5a7088",
  PUPIL = "#4a3828";

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
    <group ref={root} position={[0, -0.42, 0.38]}>
      {/* Structural Hierarchy: Chair Back */}
      <mesh position={[0, 0.55, -0.22]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.08]} />
        <meshStandardMaterial color="#2a2420" />
      </mesh>

      {/* Torso */}
      <group ref={torso} position={[0, 0.72, 0]}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 0.7, 20]} />
          <meshStandardMaterial
            ref={coatMat}
            color={COAT}
            emissive={COAT_LIGHT}
            emissiveIntensity={0.03}
          />
        </mesh>

        {/* Head Hierarchy */}
        <group ref={head} position={[0, 0.55, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.22, 32, 32]} />
            <meshStandardMaterial color={SKIN} roughness={0.4} />
          </mesh>

          {/* Eyes */}
          <group ref={eyeL} position={[-0.08, 0.02, 0.2]}>
            <mesh ref={pupilL}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshStandardMaterial color={PUPIL} roughness={0.1} />
            </mesh>
            <mesh ref={lidL} position={[0, 0.02, 0.01]}>
              <boxGeometry args={[0.08, 0.04, 0.02]} />
              <meshStandardMaterial color={SKIN} />
            </mesh>
          </group>

          <group ref={eyeR} position={[0.08, 0.02, 0.2]}>
            <mesh ref={pupilR}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshStandardMaterial color={PUPIL} roughness={0.1} />
            </mesh>
            <mesh ref={lidR} position={[0, 0.02, 0.01]}>
              <boxGeometry args={[0.08, 0.04, 0.02]} />
              <meshStandardMaterial color={SKIN} />
            </mesh>
          </group>

          {/* Mouth (Scales during isSpeaking) */}
          <mesh ref={mouth} position={[0, -0.08, 0.21]}>
            <boxGeometry args={[0.06, 0.01, 0.01]} />
            <meshStandardMaterial color="#2a1a15" />
          </mesh>
        </group>

        {/* Arms Hierarchy */}
        <group ref={leftUpperArm} position={[-0.35, 0.3, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.4]} />
            <meshStandardMaterial color={COAT} />
          </mesh>
          <group ref={leftLowerArm} position={[0, -0.4, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.4]} />
              <meshStandardMaterial color={COAT} />
            </mesh>
          </group>
        </group>

        <group ref={rightUpperArm} position={[0.35, 0.3, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.4]} />
            <meshStandardMaterial color={COAT} />
          </mesh>
          <group ref={rightLowerArm} position={[0, -0.4, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.4]} />
              <meshStandardMaterial color={COAT} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
