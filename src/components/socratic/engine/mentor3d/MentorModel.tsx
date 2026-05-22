import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { LearningState } from '../../types';
import { useHaoriTexture } from './useHaoriTexture';

interface Props {
  state: LearningState;
  isSpeaking: boolean;
}

const SKIN = '#f2cda0';
const HAIR = '#1a0e0a';
const KIMONO = '#f0e6d2';
const SASH = '#1a1a1a';
const EYE = '#c8842a';
const SCAR = '#7a1818';

export function MentorModel({ state, isSpeaking }: Props) {
  const root = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const torso = useRef<THREE.Group>(null!);
  const leftArm = useRef<THREE.Group>(null!);
  const rightArm = useRef<THREE.Group>(null!);
  const eyeL = useRef<THREE.Mesh>(null!);
  const eyeR = useRef<THREE.Mesh>(null!);
  const jaw = useRef<THREE.Mesh>(null!);

  const haori = useHaoriTexture();

  useFrame((_, dt) => {
    const t = performance.now() / 1000;
    if (!root.current) return;

    // Posture targets per state
    const targetLean = state === 'FOCUS' ? -0.12 : state === 'CHALLENGE' ? 0.04 : 0;
    const targetHeadTilt = state === 'CHALLENGE' ? -0.18 : state === 'CELEBRATE' ? 0.15 : 0;
    const targetHeadY = state === 'CHALLENGE' ? -0.05 : 0;

    // Arm poses
    // IDLE/FOCUS: hands down. CHALLENGE: crossed. CELEBRATE: raised.
    let lArmZ = 0.05;
    let rArmZ = -0.05;
    let lArmX = 0;
    let rArmX = 0;
    if (state === 'CHALLENGE') {
      lArmZ = -0.7; rArmZ = 0.7;
      lArmX = -0.3; rArmX = -0.3;
    } else if (state === 'CELEBRATE') {
      lArmZ = -2.4; rArmZ = 2.4;
      lArmX = -0.2; rArmX = -0.2;
    }

    THREE.MathUtils.damp;
    const damp = (current: number, target: number, lambda = 4) =>
      THREE.MathUtils.damp(current, target, lambda, dt);

    root.current.rotation.x = damp(root.current.rotation.x, targetLean);
    head.current.rotation.x = damp(head.current.rotation.x, targetHeadTilt);
    head.current.position.y = damp(head.current.position.y, 1.55 + targetHeadY);

    leftArm.current.rotation.z = damp(leftArm.current.rotation.z, lArmZ);
    rightArm.current.rotation.z = damp(rightArm.current.rotation.z, rArmZ);
    leftArm.current.rotation.x = damp(leftArm.current.rotation.x, lArmX);
    rightArm.current.rotation.x = damp(rightArm.current.rotation.x, rArmX);

    // Breathing
    const breath = 1 + Math.sin(t * 1.2) * 0.012;
    torso.current.scale.y = breath;

    // Eye narrow on CHALLENGE
    const eyeScale = state === 'CHALLENGE' ? 0.45 : 1;
    eyeL.current.scale.y = damp(eyeL.current.scale.y, eyeScale, 3);
    eyeR.current.scale.y = damp(eyeR.current.scale.y, eyeScale, 3);

    // Speaking — jaw + head bob
    if (isSpeaking) {
      head.current.position.y += Math.sin(t * 7) * 0.008;
      jaw.current.scale.y = 1 + (Math.sin(t * 10) + 1) * 0.15;
    } else {
      jaw.current.scale.y = damp(jaw.current.scale.y, 1, 6);
    }

    // Gentle sway always
    root.current.rotation.y = Math.sin(t * 0.6) * 0.05;
  });

  return (
    <group ref={root} position={[0, -0.9, 0]}>
      {/* Torso (haori over kimono) */}
      <group ref={torso} position={[0, 0.5, 0]}>
        {/* Inner kimono cream */}
        <mesh position={[0, 0, 0.02]}>
          <cylinderGeometry args={[0.42, 0.55, 1.05, 16]} />
          <meshStandardMaterial color={KIMONO} roughness={0.9} />
        </mesh>
        {/* Haori shell — slightly larger */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.46, 0.6, 1.1, 16, 1, true]} />
          <meshStandardMaterial
            map={haori ?? undefined}
            color={haori ? '#ffffff' : '#2d5a3d'}
            roughness={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Sash */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.56, 0.56, 0.14, 16]} />
          <meshStandardMaterial color={SASH} roughness={0.7} />
        </mesh>
        {/* Collar V */}
        <mesh position={[0, 0.45, 0.32]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.5, 0.18, 0.04]} />
          <meshStandardMaterial color={KIMONO} roughness={0.8} />
        </mesh>
      </group>

      {/* Arms — origin at shoulder */}
      <group ref={leftArm} position={[-0.5, 1.0, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.1, 0.55, 6, 12]} />
          <meshStandardMaterial map={haori ?? undefined} color={haori ? '#ffffff' : '#2d5a3d'} roughness={0.85} />
        </mesh>
        {/* hand */}
        <mesh position={[0, -0.8, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.5, 1.0, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.1, 0.55, 6, 12]} />
          <meshStandardMaterial map={haori ?? undefined} color={haori ? '#ffffff' : '#2d5a3d'} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.18, 12]} />
        <meshStandardMaterial color={SKIN} roughness={0.75} />
      </mesh>

      {/* Head group */}
      <group ref={head} position={[0, 1.55, 0]}>
        {/* Face */}
        <mesh>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>

        {/* Hair — tousled cap */}
        <mesh position={[0, 0.12, -0.02]}>
          <sphereGeometry args={[0.34, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshStandardMaterial color={HAIR} roughness={0.95} />
        </mesh>
        {/* Hair tufts in front */}
        <mesh position={[-0.12, 0.22, 0.24]} rotation={[0.3, 0.2, -0.4]}>
          <coneGeometry args={[0.08, 0.18, 8]} />
          <meshStandardMaterial color={HAIR} roughness={0.95} />
        </mesh>
        <mesh position={[0.05, 0.26, 0.26]} rotation={[0.3, -0.1, 0.2]}>
          <coneGeometry args={[0.07, 0.16, 8]} />
          <meshStandardMaterial color={HAIR} roughness={0.95} />
        </mesh>
        <mesh position={[0.16, 0.21, 0.22]} rotation={[0.3, -0.3, 0.5]}>
          <coneGeometry args={[0.07, 0.15, 8]} />
          <meshStandardMaterial color={HAIR} roughness={0.95} />
        </mesh>

        {/* Eyes — almond, kind */}
        <mesh ref={eyeL} position={[-0.11, 0.02, 0.29]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color={EYE} emissive={EYE} emissiveIntensity={0.35} roughness={0.4} />
        </mesh>
        <mesh ref={eyeR} position={[0.11, 0.02, 0.29]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color={EYE} emissive={EYE} emissiveIntensity={0.35} roughness={0.4} />
        </mesh>

        {/* Scar over left brow — diagonal */}
        <mesh position={[-0.14, 0.13, 0.27]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.11, 0.018, 0.005]} />
          <meshStandardMaterial color={SCAR} roughness={0.6} />
        </mesh>
        <mesh position={[-0.1, 0.07, 0.28]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.05, 0.012, 0.005]} />
          <meshStandardMaterial color={SCAR} roughness={0.6} />
        </mesh>

        {/* Mouth / jaw */}
        <mesh ref={jaw} position={[0, -0.12, 0.28]}>
          <boxGeometry args={[0.1, 0.018, 0.01]} />
          <meshStandardMaterial color="#6b3a3a" roughness={0.7} />
        </mesh>

        {/* Earrings — hanafuda-style flat discs */}
        <mesh position={[-0.3, -0.05, 0.05]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.005, 12]} />
          <meshStandardMaterial color="#e8e0d0" emissive="#a83030" emissiveIntensity={0.15} roughness={0.5} />
        </mesh>
        <mesh position={[0.3, -0.05, 0.05]}>
          <cylinderGeometry args={[0.04, 0.04, 0.005, 12]} />
          <meshStandardMaterial color="#e8e0d0" emissive="#a83030" emissiveIntensity={0.15} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
