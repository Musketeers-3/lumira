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

export function PhysicsOrbitScene({ state, onObjectInteract, artifacts }: Props) {
  const moonRef = useRef<THREE.Group>(null!);
  const satelliteRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const fieldRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const moonSpeed = state === "CELEBRATE" ? 1.4 : state === "CHALLENGE" ? 1.1 : 0.7;

    if (moonRef.current) {
      moonRef.current.position.x = Math.cos(t * moonSpeed) * 1.1;
      moonRef.current.position.z = Math.sin(t * moonSpeed) * 1.1;
      moonRef.current.position.y = 0.35 + Math.sin(t * 2) * 0.03;
    }
    if (satelliteRef.current) {
      satelliteRef.current.position.x = Math.cos(t * moonSpeed * 2.2 + 1) * 0.65;
      satelliteRef.current.position.z = Math.sin(t * moonSpeed * 2.2 + 1) * 0.65;
      satelliteRef.current.position.y = 0.55;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.05;
    }
    if (fieldRef.current) {
      const pulse = 0.08 + (state === "FOCUS" ? 0.04 : 0) + Math.sin(t * 1.5) * 0.02;
      fieldRef.current.scale.setScalar(1 + pulse);
      (fieldRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.06 + (state === "CHALLENGE" ? 0.04 : 0);
    }
  });

  return (
    <group position={[0, -0.3, -1.2]}>
      {/* Gravity field visualization */}
      <mesh ref={fieldRef}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#3B9EFF" transparent opacity={0.06} wireframe />
      </mesh>

      {/* Orbit path ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.008, 8, 128]} />
        <meshBasicMaterial color="#3B9EFF" transparent opacity={0.35} />
      </mesh>

      {/* Earth */}
      <InteractiveOrb
        position={[0, 0.15, 0]}
        radius={0.2}
        color="#2A6FB5"
        label="Earth"
        hint="What force keeps everything pulled toward the center?"
        onInteract={onObjectInteract}
      />

      {/* Moon — orb rides the orbit path */}
      <group ref={moonRef} position={[1.1, 0.35, 0]}>
        <InteractiveOrb
          position={[0, 0, 0]}
          radius={0.08}
          color="#C8C8D0"
          label="Moon"
          hint="Why does the moon keep circling instead of falling or flying away?"
          onInteract={onObjectInteract}
        />
      </group>

      {/* Satellite */}
      <mesh ref={satelliteRef}>
        <boxGeometry args={[0.04, 0.04, 0.08]} />
        <meshStandardMaterial color="#C9A24B" emissive="#C9A24B" emissiveIntensity={0.5} />
      </mesh>

      {/* Star field */}
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 4 + 1,
            (Math.random() - 0.5) * 6 - 2,
          ]}
        >
          <sphereGeometry args={[0.008, 4, 4]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3 + Math.random() * 0.5} />
        </mesh>
      ))}

      <EnvironmentArtifacts artifacts={artifacts} />
    </group>
  );
}
