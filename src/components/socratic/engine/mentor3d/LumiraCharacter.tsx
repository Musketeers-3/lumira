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
  SKIN_SHADOW = "#c9a080",
  COAT = "#3d4f62",
  COAT_LIGHT = "#5a7088",
  HAIR = "#2c2420",
  EYE_WHITE = "#f5f0e8",
  PUPIL = "#4a3828",
  SHIRT = "#e8e4dc";

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
      {/* Structural Hierarchy: Chair -> Torso -> Head -> Arms */}
      <mesh position={[0, 0.55, -0.22]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.08]} />
        <meshStandardMaterial color="#2a2420" />
      </mesh>
      <group ref={torso} position={[0, 0.72, 0]}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.48, 0.82, 20]} />
          <meshStandardMaterial
            ref={coatMat}
            color={COAT}
            emissive={COAT_LIGHT}
            emissiveIntensity={0.03}
          />
        </mesh>
      </group>
      {/* Add head/arm groups here, mapping refs to their respective meshes... */}
    </group>
  );
}
