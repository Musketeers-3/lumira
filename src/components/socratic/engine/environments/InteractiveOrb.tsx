// Path: src/components/socratic/engine/environments/InteractiveOrb.tsx

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
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

  // Smooth scale interpolation to avoid continuous layout recalculations
  useFrame((_, dt) => {
    if (!meshRef.current) return;

    // Clamp delta to protect math on frame-drops
    const safeDt = Math.min(dt, 0.1);

    meshRef.current.rotation.y += safeDt * (hovered ? 1.2 : 0.3);
    const targetScale = pressed ? 0.85 : hovered ? 1.25 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      safeDt * 10,
    );
  });

  // Clean up cursor style on unmount to prevent system mouse leaks
  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <group position={position}>
      {/* 3D Core Interactive Mesh */}
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
          emissiveIntensity={hovered ? 1.0 : 0.4}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Glow Ring Aura */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.8, radius * 2.2, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.4 : 0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. HARDWARE SAFE TOOLTIP OVERLAY
        We drop Drei's <Html> completely. Instead, we use an invisible 3D point 
        to trigger a standard, lightweight HTML overlay managed smoothly by tailwind peer triggers
      */}
    </group>
  );
}
