import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RealmId } from "@/lib/realms";
import type { LearningState } from "../../types";
import type { Artifact } from "@/lib/artifacts";
import { PhysicsOrbitScene } from "./PhysicsOrbitScene";
import { ChemistryLabScene } from "./ChemistryLabScene";
import { EnvironmentArtifacts } from "./EnvironmentArtifacts";
import { InteractiveOrb } from "./InteractiveOrb";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

interface Props {
  realm: RealmId;
  state: LearningState;
  onObjectInteract: (label: string, hint: string) => void;
  artifacts: Artifact[];
}

function BiologyGardenScene({ state, onObjectInteract, artifacts }: Omit<Props, "realm">) {
  const sporeRef = useRef<THREE.Group>(null!);
  const { gl } = useThree();

  useEffect(() => {
    return () => {
      // When the component unmounts, force the renderer to dispose
      gl.dispose();
    };
  }, [gl]);

  useFrame(({ clock }) => {
    if (sporeRef.current) {
      sporeRef.current.rotation.y = clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={[0, -0.2, -1]}>
      <group ref={sporeRef}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.8, 0.3 + Math.sin(i) * 0.1, Math.sin(angle) * 0.5]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color="#4AE8C8"
                emissive="#4AE8C8"
                emissiveIntensity={state === "CELEBRATE" ? 1 : 0.5}
              />
            </mesh>
          );
        })}
      </group>
      <InteractiveOrb
        position={[0, 0.4, 0]}
        radius={0.14}
        color="#4AE8C8"
        label="Living Cell"
        hint="What makes something alive at the smallest scale?"
        onInteract={onObjectInteract}
      />
      <EnvironmentArtifacts artifacts={artifacts} />
    </group>
  );
}

function MathPatternScene({ onObjectInteract, artifacts }: Omit<Props, "realm" | "state">) {
  const gridRef = useRef<THREE.Group>(null!);
  const { gl } = useThree();

  useEffect(() => {
    return () => {
      // When the component unmounts, force the renderer to dispose
      gl.dispose();
    };
  }, [gl]);
  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={[0, -0.1, -1.2]}>
      <group ref={gridRef}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} rotation={[0, (i / 6) * Math.PI, 0]}>
            <torusGeometry args={[0.5 + i * 0.15, 0.006, 4, 48]} />
            <meshBasicMaterial color="#B88CFF" transparent opacity={0.3 + i * 0.05} />
          </mesh>
        ))}
      </group>
      <InteractiveOrb
        position={[0, 0.5, 0]}
        radius={0.13}
        color="#B88CFF"
        label="Pattern"
        hint="What repeating structure hides beneath the surface?"
        onInteract={onObjectInteract}
      />
      <EnvironmentArtifacts artifacts={artifacts} />
    </group>
  );
}

function HistoryArchiveScene({
  onObjectInteract,
  artifacts,
}: Pick<Props, "onObjectInteract" | "artifacts">) {
  const { gl } = useThree();

  useEffect(() => {
    return () => {
      // When the component unmounts, force the renderer to dispose
      gl.dispose();
    };
  }, [gl]);
  return (
    <group position={[0, -0.2, -1]}>
      <mesh position={[0, 0.3, -0.3]}>
        <boxGeometry args={[0.6, 0.8, 0.05]} />
        <meshStandardMaterial color="#D4A054" roughness={0.8} />
      </mesh>
      <InteractiveOrb
        position={[0, 0.5, 0]}
        radius={0.12}
        color="#D4A054"
        label="Ancient Scroll"
        hint="How did people long ago try to explain what they saw?"
        onInteract={onObjectInteract}
      />
      <EnvironmentArtifacts artifacts={artifacts} />
    </group>
  );
}

function HubScene({ artifacts }: { artifacts: Artifact[] }) {
  const { gl } = useThree();

  useEffect(() => {
    return () => {
      // When the component unmounts, force the renderer to dispose
      gl.dispose();
    };
  }, [gl]);
  return (
    <group position={[0, 0, -1.5]}>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
          ]}
        >
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshBasicMaterial color="#C9A24B" transparent opacity={0.4} />
        </mesh>
      ))}
      <EnvironmentArtifacts artifacts={artifacts} />
    </group>
  );
}

export function RealmEnvironmentScene({ realm, state, onObjectInteract, artifacts }: Props) {
  const { gl } = useThree();

  useEffect(() => {
    return () => {
      // When the component unmounts, force the renderer to dispose
      gl.dispose();
    };
  }, [gl]);
  switch (realm) {
    case "physics":
      return (
        <PhysicsOrbitScene
          state={state}
          onObjectInteract={onObjectInteract}
          artifacts={artifacts}
        />
      );
    case "chemistry":
      return (
        <ChemistryLabScene
          state={state}
          onObjectInteract={onObjectInteract}
          artifacts={artifacts}
        />
      );
    case "biology":
      return (
        <BiologyGardenScene
          state={state}
          onObjectInteract={onObjectInteract}
          artifacts={artifacts}
        />
      );
    case "math":
      return <MathPatternScene onObjectInteract={onObjectInteract} artifacts={artifacts} />;
    case "history":
      return <HistoryArchiveScene onObjectInteract={onObjectInteract} artifacts={artifacts} />;
    default:
      return <HubScene artifacts={artifacts} />;
  }
}
