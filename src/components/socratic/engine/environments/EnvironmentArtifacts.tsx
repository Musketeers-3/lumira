import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Artifact } from "@/lib/artifacts";

interface Props {
  artifacts: Artifact[];
}

export function EnvironmentArtifacts({ artifacts }: Props) {
  if (artifacts.length === 0) return null;

  return (
    <group position={[1.2, 0.2, -0.5]}>
      {artifacts.map((artifact, i) => (
        <FloatingArtifact key={artifact.id} artifact={artifact} index={i} />
      ))}
    </group>
  );
}

function FloatingArtifact({ artifact, index }: { artifact: Artifact; index: number }) {
  const ref = useRef<THREE.Group>(null!);
  const offset = index * 0.35;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y = 0.3 + Math.sin(t * 0.8 + offset) * 0.08;
    ref.current.rotation.y = t * 0.4 + offset;
  });

  const colors: Record<string, string> = {
    "gravity-apple": "#C0392B",
    "orbit-ring": "#3B9EFF",
    "particle-jar": "#3DDB8A",
  };

  const color = colors[artifact.id] ?? "#C9A24B";

  return (
    <group ref={ref} position={[offset, 0.3, 0]}>
      <mesh>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.015, 8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
