import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
  radius?: number;
  color?: string;
  label: string;
  hint: string;
  onInteract: (label: string, hint: string) => void;
}

export function InteractiveOrb({
  position,
  radius = 0.12,
  color = "#3B9EFF",
  label,
  hint,
  onInteract,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useFrame((_, dt) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += dt * (hovered ? 1.2 : 0.3);
    const targetScale = pressed ? 0.85 : hovered ? 1.25 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          setPressed(true);
          onInteract(label, hint);
          setTimeout(() => setPressed(false), 300);
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : 0.5}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      {hovered && (
        <Html center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div
            className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: "rgba(7,7,14,0.85)",
              border: `1px solid ${color}`,
              color: "#F5F5F7",
              boxShadow: `0 0 16px ${color}55`,
            }}
          >
            {label}
          </div>
        </Html>
      )}
      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.8, radius * 2.2, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.5 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
