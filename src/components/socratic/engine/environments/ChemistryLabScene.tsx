import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LearningState } from "../../types";
import { InteractiveOrb } from "./InteractiveOrb";
import type { Artifact } from "@/lib/artifacts";
import { EnvironmentArtifacts } from "./EnvironmentArtifacts";

interface Props {
  state: LearningState;
  onObjectInteract: (label: string, hint: string) => void;
  artifacts: Artifact[];
}

function Molecule({
  position,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.1;
    ref.current.rotation.y = t * 0.5;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.15, 0, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#3DDB8A" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.12, 0.08, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#3DDB8A" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export function ChemistryLabScene({ state, onObjectInteract, artifacts }: Props) {
  const glowRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    glowRef.current.intensity =
      0.6 + Math.sin(clock.elapsedTime * 2) * 0.15 + (state === "CELEBRATE" ? 0.3 : 0);
  });

  return (
    <group position={[0, -0.2, -1]}>
      <pointLight ref={glowRef} position={[0, 1, 0]} color="#3DDB8A" intensity={0.6} distance={5} />

      <Molecule position={[-0.6, 0.5, 0]} color="#3DDB8A" speed={0.8} />
      <Molecule position={[0.5, 0.7, -0.3]} color="#00FFB0" speed={1.2} />
      <Molecule position={[0, 0.3, 0.5]} color="#2A9D5C" speed={1} />

      <InteractiveOrb
        position={[0, 0.2, 0]}
        radius={0.15}
        color="#3DDB8A"
        label="Particles"
        hint="What happens when countless tiny things collide over and over?"
        onInteract={onObjectInteract}
      />

      {/* Lab table silhouette */}
      <mesh position={[0, -0.1, 0.3]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color="#1A2A1A" roughness={0.9} />
      </mesh>

      <EnvironmentArtifacts artifacts={artifacts} />
    </group>
  );
}
