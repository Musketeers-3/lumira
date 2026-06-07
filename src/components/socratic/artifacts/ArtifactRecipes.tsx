// export function MoleculeBond({ accent, intensity = 1 }: RecipeProps) {
//   const g = useRef<THREE.Group>(null!);
//   const leftPlasma = useRef<THREE.Mesh>(null!);
//   const rightPlasma = useRef<THREE.Mesh>(null!);

//   const c = hex(accent);

//   useFrame(({ clock }) => {
//     const t = clock.elapsedTime * intensity;

//     if (g.current) {
//       g.current.rotation.y = t * 0.2;
//       g.current.rotation.x = Math.sin(t * 0.3) * 0.1;
//     }

//     // Replicate OIG4 energetic plasma churning via mathematical scale modulation
//     if (leftPlasma.current) {
//       const scaleBase = 0.12 + Math.sin(t * 4.0) * 0.015;
//       leftPlasma.current.scale.set(
//         scaleBase + Math.cos(t * 2.5) * 0.01,
//         scaleBase + Math.sin(t * 3.1) * 0.01,
//         scaleBase,
//       );
//     }
//     if (rightPlasma.current) {
//       const scaleBase = 0.12 + Math.cos(t * 3.8) * 0.015;
//       rightPlasma.current.scale.set(
//         scaleBase,
//         scaleBase + Math.sin(t * 2.9) * 0.01,
//         scaleBase + Math.cos(t * 3.4) * 0.01,
//       );
//     }
//   });

//   return (
//     <group ref={g}>
//       {/* LEFT ATOM SYSTEM */}
//       <group position={[-0.45, 0, 0]}>
//         {/* Churning Plasma Nucleus (OIG4 Core) */}
//         <mesh ref={leftPlasma}>
//           <sphereGeometry args={[1, 32, 32]} />
//           <meshStandardMaterial
//             color={c}
//             emissive={c}
//             emissiveIntensity={3.0} // Hyper-luminescent core
//           />
//         </mesh>
//         {/* High-Transmission Outer Glass Shell */}
//         <mesh>
//           <sphereGeometry args={[0.34, 48, 48]} />
//           <meshPhysicalMaterial
//             color={c}
//             transmission={0.92}
//             transparent
//             opacity={1.0}
//             roughness={0.02}
//             ior={1.45} // Accurate glass index refraction
//             thickness={0.5}
//             clearcoat={1.0}
//             clearcoatRoughness={0.01}
//           />
//         </mesh>
//       </group>

//       {/* RIGHT ATOM SYSTEM */}
//       <group position={[0.45, 0, 0]}>
//         {/* Churning Plasma Nucleus */}
//         <mesh ref={rightPlasma}>
//           <sphereGeometry args={[1, 32, 32]} />
//           <meshStandardMaterial color="#FFFFFF" emissive={c} emissiveIntensity={2.0} />
//         </mesh>
//         {/* High-Transmission Outer Glass Shell */}
//         <mesh>
//           <sphereGeometry args={[0.34, 48, 48]} />
//           <meshPhysicalMaterial
//             color="#FFFFFF"
//             transmission={0.92}
//             transparent
//             opacity={1.0}
//             roughness={0.02}
//             ior={1.45}
//             thickness={0.5}
//             clearcoat={1.0}
//             clearcoatRoughness={0.01}
//           />
//         </mesh>
//       </group>

//       {/* Active Covalent Energy Bridge (OIG4 Central Conjunction) */}
//       <mesh rotation={[0, 0, Math.PI / 2]}>
//         <cylinderGeometry args={[0.02, 0.02, 0.6, 32]} />
//         <meshPhysicalMaterial
//           color={c}
//           transmission={0.5}
//           transparent
//           opacity={0.9}
//           emissive={c}
//           emissiveIntensity={2.0}
//           blending={THREE.AdditiveBlending}
//         />
//       </mesh>
//     </group>
//   );
// }

// export function OrbitSystem({ accent, intensity = 1 }: RecipeProps) {
//   const planetSurface = useRef<THREE.Mesh>(null!);
//   const atmosphere = useRef<THREE.Mesh>(null!);
//   const moonGroup = useRef<THREE.Group>(null!);
//   const particleRing = useRef<THREE.Points>(null!);

//   const c = hex(accent);

//   // Generate high-frequency cinematic particle ring matching OIG3
//   const [particleGeometry, particleMaterial] = useMemo(() => {
//     const count = 400;
//     const positions = new Float32Array(count * 3);
//     const radius = 1.15;

//     for (let i = 0; i < count; i++) {
//       const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
//       const thickness = (Math.random() - 0.5) * 0.04;
//       positions[i * 3] = Math.cos(angle) * (radius + thickness);
//       positions[i * 3 + 1] = (Math.random() - 0.5) * 0.02; // Minimal height variation
//       positions[i * 3 + 2] = Math.sin(angle) * (radius + thickness);
//     }

//     const geom = new THREE.BufferGeometry();
//     geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

//     const mat = new THREE.PointsMaterial({
//       color: c,
//       size: 0.012,
//       transparent: true,
//       opacity: 0.8,
//       blending: THREE.AdditiveBlending,
//       depthWrite: false,
//     });

//     return [geom, mat];
//   }, [c]);

//   useFrame(({ clock }) => {
//     const t = clock.elapsedTime * intensity;

//     // Slow cinematic rotations
//     if (planetSurface.current) planetSurface.current.rotation.y = t * 0.15;
//     if (atmosphere.current) atmosphere.current.rotation.y = t * 0.18;
//     if (particleRing.current) particleRing.current.rotation.y = t * 0.05;

//     // Moon translation and rotation matching the video path
//     if (moonGroup.current) {
//       moonGroup.current.position.x = Math.cos(t * 0.4) * 1.15;
//       moonGroup.current.position.z = Math.sin(t * 0.4) * 1.15;
//       moonGroup.current.position.y = Math.sin(t * 0.4) * 0.15; // Subtle orbital inclination
//       moonGroup.current.rotation.y = t * 0.2;
//     }
//   });

//   return (
//     <group>
//       {/* Cinematic High-Frequency Particle Ring */}
//       <primitive object={new THREE.Points(particleGeometry, particleMaterial)} ref={particleRing} />

//       {/* Layer 1: Earth Internal Shadow Core */}
//       <mesh>
//         <sphereGeometry args={[0.39, 32, 32]} />
//         <meshStandardMaterial color="#04060A" roughness={0.9} />
//       </mesh>

//       {/* Layer 2: Earth Topography / Oceans Mesh */}
//       <mesh ref={planetSurface}>
//         <sphereGeometry args={[0.4, 48, 48]} />
//         <meshStandardMaterial
//           color="#152B52"
//           roughness={0.4}
//           metalness={0.1}
//           emissive={c}
//           emissiveIntensity={0.15} // Subtle glow from the landmasses
//         />
//       </mesh>

//       {/* Layer 3: Atmospheric Scattering Fresnel Shell (OIG3 Match) */}
//       <mesh ref={atmosphere}>
//         <sphereGeometry args={[0.415, 48, 48]} />
//         <meshPhysicalMaterial
//           color={c}
//           transmission={0.6}
//           transparent
//           opacity={0.4}
//           ior={1.15}
//           thickness={0.1}
//           clearcoat={1.0}
//           clearcoatRoughness={0.05}
//           blending={THREE.AdditiveBlending}
//           side={THREE.DoubleSide}
//         />
//       </mesh>

//       {/* Realistic Moon */}
//       <group ref={moonGroup}>
//         <mesh>
//           <sphereGeometry args={[0.07, 24, 24]} />
//           <meshStandardMaterial
//             color="#A0A5B0"
//             roughness={0.8}
//             metalness={0.1}
//             emissive="#ffffff"
//             emissiveIntensity={0.05}
//           />
//         </mesh>
//       </group>
//     </group>
//   );
// }

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ArtifactSceneKey } from "@/lib/artifacts";

interface RecipeProps {
  accent: string;
  intensity?: number;
  isHovered?: boolean;
}

/**
 * THE BREATH OF THE WORLD HOOK
 * Smoothly accelerates time when hovered, decelerates to a resting state when not.
 * Accumulates time locally to prevent snapping when speed multipliers change.
 */
function useAmbientTime(intensity: number, isHovered: boolean) {
  const timeRef = useRef(0);
  const speedRef = useRef(intensity * 0.4);

  useFrame((_, delta) => {
    const targetSpeed = isHovered ? intensity * 2.0 : intensity * 0.4;
    // Smoothly ease the speed
    speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, delta * 4);
    // Accumulate actual time
    timeRef.current += delta * speedRef.current;
  });

  return timeRef;
}

// ── Physics ─────────────────────────────────────────────────────────

function FallingApple({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const apple = useRef<THREE.Mesh>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    const t = tRef.current;
    const cycle = (t % 2) / 2;
    if (apple.current) {
      apple.current.position.y = 1.0 - cycle * 1.8;
      apple.current.rotation.z = cycle * 0.6;
    }
  });

  return (
    <group>
      <mesh ref={apple} position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#C0392B" emissive="#C0392B" emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <ringGeometry args={[0.3, 0.7, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, 0.8 - i * 0.3, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color={accent} transparent opacity={0.4 - i * 0.05} />
        </mesh>
      ))}
    </group>
  );
}

function WaveRipple({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    const t = tRef.current;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const phase = (t * 0.6 + i * 0.4) % 2;
      m.scale.setScalar(0.2 + phase * 0.9);
      (m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 - phase * 0.5);
    });
  });

  return (
    <group rotation={[-Math.PI / 2.2, 0, 0]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <ringGeometry args={[0.8, 0.84, 64]} />
          <meshBasicMaterial color={accent} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

function PrismLight({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const prism = useRef<THREE.Mesh>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (prism.current) prism.current.rotation.y = tRef.current * 0.8;
  });

  const colors = ["#FF5E5E", "#FFB23E", "#FFE25E", "#5EFF8C", "#5EC8FF", "#7A5EFF", "#C95EFF"];
  return (
    <group>
      <mesh ref={prism} rotation={[0.4, 0, 0]}>
        <tetrahedronGeometry args={[0.55]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transparent
          opacity={0.35}
          roughness={0.1}
          transmission={0.9}
        />
      </mesh>
      {colors.map((c, i) => (
        <mesh key={c} position={[0.4 + i * 0.18, -0.3 - i * 0.04, 0]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[1.0, 0.04, 0.01]} />
          <meshBasicMaterial color={c} transparent opacity={0.85} />
        </mesh>
      ))}
      <mesh position={[-0.7, 0.2, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.9, 0.04, 0.01]} />
        <meshBasicMaterial color={accent} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function MagnetField({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const group = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (group.current) group.current.rotation.y = tRef.current * 0.6;
  });

  return (
    <group ref={group}>
      <mesh position={[-0.4, 0, 0]}>
        <boxGeometry args={[0.35, 0.18, 0.18]} />
        <meshStandardMaterial color="#C0392B" />
      </mesh>
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.35, 0.18, 0.18]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      {[0.5, 0.7, 0.9, 1.1].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.005, 8, 64]} />
          <meshBasicMaterial color={accent} transparent opacity={0.4 - i * 0.07} />
        </mesh>
      ))}
    </group>
  );
}

// ── Videos (Retained for Load Balance) ──────────────────────────────

export function OrbitSystem({ isHovered = false }: RecipeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const [isFading, setIsFading] = useState(false);

  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = "/assets/textures/OIG3.mp4";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    return vid;
  });

  useEffect(() => {
    if (isHovered) video.play().catch(() => {});
    else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered, video]);

  useFrame(() => {
    if (!video || !materialRef.current) return;
    if (meshRef.current) {
      meshRef.current.position.set(0, 0, 0);
      meshRef.current.rotation.set(0, 0, 0);
    }
    const current = video.currentTime;
    if (video.duration > 0 && current > video.duration - 0.4 && !isFading) setIsFading(true);
    if (isFading) {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0.0, 0.15);
      if (current < 1.0) setIsFading(false);
    } else {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 1.0, 0.1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3.1, 1.8]} />
      <meshBasicMaterial ref={materialRef} transparent opacity={1.0} depthWrite={false}>
        <videoTexture attach="map" args={[video]} colorSpace={THREE.SRGBColorSpace} />
      </meshBasicMaterial>
    </mesh>
  );
}

export function MoleculeBond({ isHovered = false }: RecipeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const [isFading, setIsFading] = useState(false);

  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = "/assets/textures/OIG4.mp4";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    return vid;
  });

  useEffect(() => {
    if (isHovered) video.play().catch(() => {});
    else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered, video]);

  useFrame(() => {
    if (!video || !materialRef.current) return;
    if (meshRef.current) {
      meshRef.current.position.set(0, 0, 0);
      meshRef.current.rotation.set(0, 0, 0);
    }
    const current = video.currentTime;
    if (video.duration > 0 && current > video.duration - 0.4 && !isFading) setIsFading(true);
    if (isFading) {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0.0, 0.15);
      if (current < 1.0) setIsFading(false);
    } else {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 1.0, 0.1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2.76, 1.55]} />
      <meshBasicMaterial ref={materialRef} transparent opacity={1.0} depthWrite={false}>
        <videoTexture attach="map" args={[video]} colorSpace={THREE.SRGBColorSpace} />
      </meshBasicMaterial>
    </mesh>
  );
}

// ── Chemistry ───────────────────────────────────────────────────────

function PressureJar({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const group = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }).map(() => ({
        seed: Math.random() * 100,
        x: (Math.random() - 0.5) * 1.0,
        y: (Math.random() - 0.5) * 1.2,
        z: (Math.random() - 0.5) * 1.0,
      })),
    [],
  );

  useFrame(() => {
    if (!group.current) return;
    const t = tRef.current;
    group.current.children.forEach((mesh, i) => {
      const p = particles[i];
      if (!p) return;
      mesh.position.x = Math.sin(t * 1.5 + p.seed) * 0.7;
      mesh.position.y = Math.cos(t * 1.7 + p.seed * 1.3) * 0.85;
      mesh.position.z = Math.sin(t * 1.3 + p.seed * 0.7) * 0.7;
    });
  });

  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.9, 0.9, 1.9, 32, 1, true]} />
        <meshPhysicalMaterial
          color={accent}
          transparent
          opacity={0.12}
          roughness={0.1}
          transmission={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={group}>
        {particles.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function AlchemyVial({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const liquid = useRef<THREE.Mesh>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (liquid.current) {
      const m = liquid.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.5 + Math.sin(tRef.current * 4) * 0.3;
    }
  });

  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.45, 0.45, 1.4, 32]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transparent
          opacity={0.15}
          transmission={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={liquid} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.43, 0.43, 0.7, 32]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.sin(i) * 0.2, 0.1 + i * 0.15, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function CrystalLattice({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (g.current) g.current.rotation.y = tRef.current * 0.5;
  });

  const positions: [number, number, number][] = [];
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) positions.push([x * 0.4, y * 0.4, z * 0.4]);

  return (
    <group ref={g}>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <octahedronGeometry args={[0.07]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function FireTriangle({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (g.current) g.current.rotation.z = Math.sin(tRef.current * 1.5) * 0.15;
  });

  const r = 0.7;
  const pts: [number, number, number][] = [
    [0, r, 0],
    [r * 0.866, -r * 0.5, 0],
    [-r * 0.866, -r * 0.5, 0],
  ];
  const labels = ["#FF7E3E", "#FFE25E", accent];

  return (
    <group ref={g}>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial color={labels[i]} emissive={labels[i]} emissiveIntensity={0.7} />
        </mesh>
      ))}
      {pts.map((p, i) => {
        const n = pts[(i + 1) % 3];
        const mid: [number, number, number] = [(p[0] + n[0]) / 2, (p[1] + n[1]) / 2, 0];
        const angle = Math.atan2(n[1] - p[1], n[0] - p[0]);
        return (
          <mesh key={`l${i}`} position={mid} rotation={[0, 0, angle]}>
            <boxGeometry args={[Math.hypot(n[0] - p[0], n[1] - p[1]), 0.02, 0.02]} />
            <meshBasicMaterial color={accent} transparent opacity={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

function PhSpectrum({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (g.current) g.current.rotation.y = Math.sin(tRef.current) * 0.4;
  });

  const stripes = ["#E94560", "#FF7E3E", "#FFE25E", "#3DDB8A", "#3B9EFF", "#7A5EFF"];
  return (
    <group ref={g}>
      {stripes.map((c, i) => (
        <mesh key={c} position={[(i - 2.5) * 0.18, 0, 0]}>
          <boxGeometry args={[0.16, 1.2, 0.1]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.75, 0.1]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

// ── Biology ─────────────────────────────────────────────────────────

function CrystalLeaf({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const leaf = useRef<THREE.Mesh>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (leaf.current) {
      const m = leaf.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.4 + Math.sin(tRef.current * 2.5) * 0.25;
      leaf.current.rotation.z = Math.sin(tRef.current * 1.2) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={leaf} rotation={[0.3, 0, 0]} scale={[0.7, 1.2, 0.15]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 0.9,
            Math.sin((i / 5) * Math.PI * 2) * 0.9 + 0.4,
            0,
          ]}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#FFE25E" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function DnaHelix({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (g.current) g.current.rotation.y = tRef.current * 1.4;
  });

  const steps = 16;
  return (
    <group ref={g}>
      {Array.from({ length: steps }).map((_, i) => {
        const t = (i / steps) * Math.PI * 4;
        const y = (i / steps) * 1.6 - 0.8;
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh position={[Math.cos(t) * 0.35, 0, Math.sin(t) * 0.35]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[-Math.cos(t) * 0.35, 0, -Math.sin(t) * 0.35]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#FFFFFF" emissive={accent} emissiveIntensity={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function CellPulse({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const cell = useRef<THREE.Mesh>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (cell.current) cell.current.scale.setScalar(1 + Math.sin(tRef.current * 2) * 0.05);
  });

  return (
    <group>
      <mesh ref={cell}>
        <sphereGeometry args={[0.8, 48, 48]} />
        <meshPhysicalMaterial
          color={accent}
          transparent
          opacity={0.25}
          transmission={0.7}
          roughness={0.2}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
      {(
        [
          [0.4, 0.2, 0.1],
          [-0.3, -0.3, 0.2],
          [0.2, -0.4, -0.1],
          [-0.4, 0.3, -0.2],
        ] as [number, number, number][]
      ).map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#FFFFFF" emissive={accent} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function EcosystemRing({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (g.current) g.current.rotation.y = tRef.current * 0.6;
  });

  return (
    <group ref={g}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.015, 8, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Math ────────────────────────────────────────────────────────────

function SacredTriangle({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (g.current) g.current.rotation.z = tRef.current * 0.5;
  });

  const r = 0.8;
  const pts: [number, number, number][] = [
    [0, r, 0],
    [r * 0.866, -r * 0.5, 0],
    [-r * 0.866, -r * 0.5, 0],
  ];

  return (
    <group ref={g}>
      {pts.map((p, i) => {
        const n = pts[(i + 1) % 3];
        const mid: [number, number, number] = [(p[0] + n[0]) / 2, (p[1] + n[1]) / 2, 0];
        const angle = Math.atan2(n[1] - p[1], n[0] - p[0]);
        return (
          <mesh key={i} position={mid} rotation={[0, 0, angle]}>
            <boxGeometry args={[Math.hypot(n[0] - p[0], n[1] - p[1]), 0.03, 0.03]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.7} />
          </mesh>
        );
      })}
      {pts.map((p, i) => (
        <mesh key={`v${i}`} position={p}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" emissive={accent} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function DividedRune({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (g.current) g.current.rotation.z = tRef.current * 0.8;
  });

  return (
    <group ref={g}>
      <mesh>
        <torusGeometry args={[0.7, 0.04, 16, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, 0, (i / 4) * Math.PI]}>
          <boxGeometry args={[1.5, 0.02, 0.02]} />
          <meshBasicMaterial color={accent} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function GoldenSpiral({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (g.current) g.current.rotation.z = tRef.current * 0.4;
  });

  // Upgraded from LineBasicMaterial to physical TubeGeometry
  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 120; i++) {
      const t = i * 0.15;
      const r = 0.05 * Math.pow(1.05, i * 0.6);
      pts.push(new THREE.Vector3(Math.cos(t) * r, Math.sin(t) * r, 0));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  return (
    <group ref={g}>
      <mesh>
        <tubeGeometry args={[curve, 100, 0.015, 8, false]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function InfinityLoop({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (g.current) g.current.rotation.y = tRef.current * 1.2;
  });

  // Upgraded from LineBasicMaterial to physical TubeGeometry
  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.sin(t) * 0.8, Math.sin(t * 2) * 0.4, Math.cos(t) * 0.2));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  }, []);

  return (
    <group ref={g}>
      <mesh>
        <tubeGeometry args={[curve, 150, 0.02, 8, true]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function PrimeGrid({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (g.current) g.current.rotation.y = Math.sin(tRef.current * 1.2) * 0.3;
  });

  const isPrime = (n: number) => {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  };

  const cells = [];
  for (let y = 0; y < 5; y++)
    for (let x = 0; x < 5; x++) cells.push({ x, y, prime: isPrime(y * 5 + x + 1) });

  return (
    <group ref={g}>
      {cells.map((c, i) => (
        <mesh key={i} position={[(c.x - 2) * 0.24, (c.y - 2) * 0.24, 0]}>
          <boxGeometry args={[0.18, 0.18, 0.05]} />
          <meshStandardMaterial
            color={c.prime ? accent : "#1A1A22"}
            emissive={c.prime ? accent : "#000"}
            emissiveIntensity={c.prime ? 0.7 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── History ─────────────────────────────────────────────────────────

function MemoryScroll({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const scroll = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (scroll.current) scroll.current.rotation.z = Math.sin(tRef.current) * 0.08;
  });

  return (
    <group ref={scroll}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 1.6, 32]} />
        <meshStandardMaterial color="#E8DCC0" roughness={0.8} />
      </mesh>
      <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function WaxSeal({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const seal = useRef<THREE.Mesh>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (seal.current) seal.current.rotation.z = tRef.current * 0.6;
  });

  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
        <meshStandardMaterial color="#E8DCC0" roughness={0.7} />
      </mesh>
      <mesh ref={seal} position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.12, 32]} />
        <meshStandardMaterial
          color="#8B1A1A"
          emissive="#8B1A1A"
          emissiveIntensity={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[0.18, 0.04, 12, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function CompassRose({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (g.current) g.current.rotation.z = Math.sin(tRef.current) * 0.4;
  });

  return (
    <group>
      <mesh>
        <torusGeometry args={[0.7, 0.04, 16, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
      <group ref={g}>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => (
          <mesh key={i} rotation={[0, 0, a]}>
            <coneGeometry args={[0.1, 0.6, 4]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.7} />
          </mesh>
        ))}
      </group>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive={accent} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function Hourglass({ accent, intensity = 1, isHovered = false }: RecipeProps) {
  const sand = useRef<THREE.Mesh>(null!);
  const tRef = useAmbientTime(intensity, isHovered);

  useFrame(() => {
    if (sand.current) {
      const t = tRef.current % 1;
      sand.current.scale.y = 1 - t * 0.8;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.5, 0.7, 32]} />
        <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.2} transmission={0.9} />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.5, 0.7, 32]} />
        <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.2} transmission={0.9} />
      </mesh>
      <mesh ref={sand} position={[0, 0.4, 0]}>
        <coneGeometry args={[0.45, 0.65, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

const RECIPES: Record<ArtifactSceneKey, React.FC<RecipeProps>> = {
  "orbit-system": OrbitSystem,
  "falling-apple": FallingApple,
  "pressure-jar": PressureJar,
  "wave-ripple": WaveRipple,
  "prism-light": PrismLight,
  "magnet-field": MagnetField,
  "molecule-bond": MoleculeBond,
  "alchemy-vial": AlchemyVial,
  "crystal-lattice": CrystalLattice,
  "fire-triangle": FireTriangle,
  "ph-spectrum": PhSpectrum,
  "crystal-leaf": CrystalLeaf,
  "dna-helix": DnaHelix,
  "cell-pulse": CellPulse,
  "ecosystem-ring": EcosystemRing,
  "sacred-triangle": SacredTriangle,
  "divided-rune": DividedRune,
  "golden-spiral": GoldenSpiral,
  "infinity-loop": InfinityLoop,
  "prime-grid": PrimeGrid,
  "memory-scroll": MemoryScroll,
  "wax-seal": WaxSeal,
  "compass-rose": CompassRose,
  hourglass: Hourglass,
};

export function ArtifactRecipe({
  scene,
  accent,
  intensity = 1,
  isHovered = false,
}: {
  scene: ArtifactSceneKey;
  accent: string;
  intensity?: number;
  isHovered?: boolean;
}) {
  const Comp = RECIPES[scene] ?? OrbitSystem;
  return <Comp accent={accent} intensity={intensity} isHovered={isHovered} />;
}
