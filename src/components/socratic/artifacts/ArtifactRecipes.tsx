import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ArtifactSceneKey } from "@/lib/artifacts";

interface RecipeProps {
  accent: string;
  intensity?: number;
}

const hex = (c: string) => new THREE.Color(c);

function OrbitSystem({ accent, intensity = 1 }: RecipeProps) {
  const moon = useRef<THREE.Mesh>(null!);
  const sat = useRef<THREE.Mesh>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * intensity;
    if (moon.current) {
      moon.current.position.x = Math.cos(t * 0.9) * 1.2;
      moon.current.position.z = Math.sin(t * 0.9) * 1.2;
    }
    if (sat.current) {
      sat.current.position.x = Math.cos(t * 1.8 + 1) * 0.7;
      sat.current.position.z = Math.sin(t * 1.8 + 1) * 0.7;
      sat.current.position.y = 0.2;
    }
    if (ring.current) ring.current.rotation.z = t * 0.1;
  });
  const c = hex(accent);
  return (
    <group>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.006, 8, 128]} />
        <meshBasicMaterial color={c} transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.004, 8, 96]} />
        <meshBasicMaterial color={c} transparent opacity={0.25} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.35, 48, 48]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.35} roughness={0.4} />
      </mesh>
      <mesh ref={moon}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#E8E8F0" emissive="#E8E8F0" emissiveIntensity={0.15} />
      </mesh>
      <mesh ref={sat}>
        <boxGeometry args={[0.06, 0.06, 0.12]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function FallingApple({ accent, intensity = 1 }: RecipeProps) {
  const apple = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * intensity;
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
        <meshStandardMaterial color={hex("#C0392B")} emissive={hex("#C0392B")} emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <ringGeometry args={[0.3, 0.7, 32]} />
        <meshBasicMaterial color={hex(accent)} transparent opacity={0.35} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, 0.8 - i * 0.3, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color={hex(accent)} transparent opacity={0.4 - i * 0.05} />
        </mesh>
      ))}
    </group>
  );
}

function PressureJar({ accent, intensity = 1 }: RecipeProps) {
  const group = useRef<THREE.Group>(null!);
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
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime * intensity;
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
          color={hex(accent)}
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
            <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function WaveRipple({ accent, intensity = 1 }: RecipeProps) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * intensity;
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
          <meshBasicMaterial color={hex(accent)} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={hex(accent)} />
      </mesh>
    </group>
  );
}

function PrismLight({ accent, intensity = 1 }: RecipeProps) {
  const prism = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (prism.current) prism.current.rotation.y = clock.elapsedTime * 0.4 * intensity;
  });
  const colors = ["#FF5E5E", "#FFB23E", "#FFE25E", "#5EFF8C", "#5EC8FF", "#7A5EFF", "#C95EFF"];
  return (
    <group>
      <mesh ref={prism} rotation={[0.4, 0, 0]}>
        <tetrahedronGeometry args={[0.55]} />
        <meshPhysicalMaterial color={hex("#FFFFFF")} transparent opacity={0.35} roughness={0.1} transmission={0.9} />
      </mesh>
      {colors.map((c, i) => (
        <mesh key={c} position={[0.4 + i * 0.18, -0.3 - i * 0.04, 0]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[1.0, 0.04, 0.01]} />
          <meshBasicMaterial color={hex(c)} transparent opacity={0.85} />
        </mesh>
      ))}
      <mesh position={[-0.7, 0.2, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.9, 0.04, 0.01]} />
        <meshBasicMaterial color={hex(accent)} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function MagnetField({ accent, intensity = 1 }: RecipeProps) {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.elapsedTime * 0.3 * intensity;
  });
  return (
    <group ref={group}>
      <mesh position={[-0.4, 0, 0]}>
        <boxGeometry args={[0.35, 0.18, 0.18]} />
        <meshStandardMaterial color={hex("#C0392B")} />
      </mesh>
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.35, 0.18, 0.18]} />
        <meshStandardMaterial color={hex(accent)} />
      </mesh>
      {[0.5, 0.7, 0.9, 1.1].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.005, 8, 64]} />
          <meshBasicMaterial color={hex(accent)} transparent opacity={0.4 - i * 0.07} />
        </mesh>
      ))}
    </group>
  );
}

function MoleculeBond({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) {
      g.current.rotation.y = clock.elapsedTime * 0.35 * intensity;
      g.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.15;
    }
  });
  return (
    <group ref={g}>
      <mesh position={[-0.5, 0, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.5, 0, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={hex("#FFFFFF")} emissive={hex(accent)} emissiveIntensity={0.2} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.0, 16]} />
        <meshBasicMaterial color={hex(accent)} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function AlchemyVial({ accent, intensity = 1 }: RecipeProps) {
  const liquid = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (liquid.current) {
      const m = liquid.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 2 * intensity) * 0.3;
    }
  });
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.45, 0.45, 1.4, 32]} />
        <meshPhysicalMaterial color={hex("#FFFFFF")} transparent opacity={0.15} transmission={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={liquid} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.43, 0.43, 0.7, 32]} />
        <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.6} transparent opacity={0.7} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.sin(i) * 0.2, 0.1 + i * 0.15, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color={hex("#FFFFFF")} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function CrystalLattice({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = clock.elapsedTime * 0.25 * intensity;
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
          <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function FireTriangle({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.z = Math.sin(clock.elapsedTime * intensity) * 0.1;
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
          <meshStandardMaterial color={hex(labels[i])} emissive={hex(labels[i])} emissiveIntensity={0.7} />
        </mesh>
      ))}
      {pts.map((p, i) => {
        const n = pts[(i + 1) % 3];
        const mid: [number, number, number] = [(p[0] + n[0]) / 2, (p[1] + n[1]) / 2, 0];
        const dx = n[0] - p[0];
        const dy = n[1] - p[1];
        const len = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        return (
          <mesh key={`l${i}`} position={mid} rotation={[0, 0, angle]}>
            <boxGeometry args={[len, 0.02, 0.02]} />
            <meshBasicMaterial color={hex(accent)} transparent opacity={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

function PhSpectrum({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = Math.sin(clock.elapsedTime * 0.5 * intensity) * 0.4;
  });
  const stripes = ["#E94560", "#FF7E3E", "#FFE25E", "#3DDB8A", "#3B9EFF", "#7A5EFF"];
  return (
    <group ref={g}>
      {stripes.map((c, i) => (
        <mesh key={c} position={[(i - 2.5) * 0.18, 0, 0]}>
          <boxGeometry args={[0.16, 1.2, 0.1]} />
          <meshStandardMaterial color={hex(c)} emissive={hex(c)} emissiveIntensity={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.75, 0.1]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={hex(accent)} />
      </mesh>
    </group>
  );
}

function CrystalLeaf({ accent, intensity = 1 }: RecipeProps) {
  const leaf = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (leaf.current) {
      const m = leaf.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.4 + Math.sin(clock.elapsedTime * 1.4 * intensity) * 0.25;
      leaf.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.1;
    }
  });
  return (
    <group>
      <mesh ref={leaf} rotation={[0.3, 0, 0]} scale={[0.7, 1.2, 0.15]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.5} roughness={0.3} />
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
          <meshBasicMaterial color={hex("#FFE25E")} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function DnaHelix({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = clock.elapsedTime * 0.7 * intensity;
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
              <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[-Math.cos(t) * 0.35, 0, -Math.sin(t) * 0.35]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color={hex("#FFFFFF")} emissive={hex(accent)} emissiveIntensity={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function CellPulse({ accent, intensity = 1 }: RecipeProps) {
  const cell = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (cell.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 1.2 * intensity) * 0.05;
      cell.current.scale.setScalar(s);
    }
  });
  return (
    <group>
      <mesh ref={cell}>
        <sphereGeometry args={[0.8, 48, 48]} />
        <meshPhysicalMaterial color={hex(accent)} transparent opacity={0.25} transmission={0.7} roughness={0.2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.8} />
      </mesh>
      {([
        [0.4, 0.2, 0.1],
        [-0.3, -0.3, 0.2],
        [0.2, -0.4, -0.1],
        [-0.4, 0.3, -0.2],
      ] as [number, number, number][]).map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={hex("#FFFFFF")} emissive={hex(accent)} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function EcosystemRing({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = clock.elapsedTime * 0.3 * intensity;
  });
  const icons = 6;
  return (
    <group ref={g}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.015, 8, 64]} />
        <meshBasicMaterial color={hex(accent)} transparent opacity={0.5} />
      </mesh>
      {Array.from({ length: icons }).map((_, i) => {
        const a = (i / icons) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

function SacredTriangle({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.z = clock.elapsedTime * 0.25 * intensity;
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
        const dx = n[0] - p[0];
        const dy = n[1] - p[1];
        const len = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        return (
          <mesh key={i} position={mid} rotation={[0, 0, angle]}>
            <boxGeometry args={[len, 0.03, 0.03]} />
            <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.7} />
          </mesh>
        );
      })}
      {pts.map((p, i) => (
        <mesh key={`v${i}`} position={p}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={hex("#FFFFFF")} emissive={hex(accent)} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function DividedRune({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.z = clock.elapsedTime * 0.4 * intensity;
  });
  return (
    <group ref={g}>
      <mesh>
        <torusGeometry args={[0.7, 0.04, 16, 64]} />
        <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.6} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI;
        return (
          <mesh key={i} rotation={[0, 0, a]}>
            <boxGeometry args={[1.5, 0.02, 0.02]} />
            <meshBasicMaterial color={hex(accent)} transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

function GoldenSpiral({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.z = clock.elapsedTime * 0.2 * intensity;
  });
  const line = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 120; i++) {
      const t = i * 0.15;
      const r = 0.05 * Math.pow(1.05, i * 0.6);
      pts.push(new THREE.Vector3(Math.cos(t) * r, Math.sin(t) * r, 0));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: hex(accent), transparent: true, opacity: 0.9 });
    return new THREE.Line(geom, mat);
  }, [accent]);
  return (
    <group ref={g}>
      <primitive object={line} />
    </group>
  );
}

function InfinityLoop({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = clock.elapsedTime * 0.6 * intensity;
  });
  const line = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.sin(t) * 0.8, Math.sin(t * 2) * 0.4, Math.cos(t) * 0.2));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: hex(accent), transparent: true, opacity: 0.9 });
    return new THREE.Line(geom, mat);
  }, [accent]);
  return (
    <group ref={g}>
      <primitive object={line} />
    </group>
  );
}

function PrimeGrid({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = Math.sin(clock.elapsedTime * 0.6 * intensity) * 0.3;
  });
  const isPrime = (n: number) => {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  };
  const cells: { x: number; y: number; prime: boolean }[] = [];
  for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) cells.push({ x, y, prime: isPrime(y * 5 + x + 1) });
  return (
    <group ref={g}>
      {cells.map((c, i) => (
        <mesh key={i} position={[(c.x - 2) * 0.24, (c.y - 2) * 0.24, 0]}>
          <boxGeometry args={[0.18, 0.18, 0.05]} />
          <meshStandardMaterial
            color={c.prime ? hex(accent) : hex("#1A1A22")}
            emissive={c.prime ? hex(accent) : hex("#000")}
            emissiveIntensity={c.prime ? 0.7 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

function MemoryScroll({ accent, intensity = 1 }: RecipeProps) {
  const scroll = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (scroll.current) scroll.current.rotation.z = Math.sin(clock.elapsedTime * 0.5 * intensity) * 0.08;
  });
  return (
    <group ref={scroll}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 1.6, 32]} />
        <meshStandardMaterial color={hex("#E8DCC0")} roughness={0.8} />
      </mesh>
      <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
        <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
        <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function WaxSeal({ accent, intensity = 1 }: RecipeProps) {
  const seal = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (seal.current) seal.current.rotation.z = clock.elapsedTime * 0.3 * intensity;
  });
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
        <meshStandardMaterial color={hex("#E8DCC0")} roughness={0.7} />
      </mesh>
      <mesh ref={seal} position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.12, 32]} />
        <meshStandardMaterial color={hex("#8B1A1A")} emissive={hex("#8B1A1A")} emissiveIntensity={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[0.18, 0.04, 12, 32]} />
        <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function CompassRose({ accent, intensity = 1 }: RecipeProps) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.z = Math.sin(clock.elapsedTime * 0.5 * intensity) * 0.4;
  });
  return (
    <group>
      <mesh>
        <torusGeometry args={[0.7, 0.04, 16, 64]} />
        <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.5} />
      </mesh>
      <group ref={g}>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => (
          <mesh key={i} rotation={[0, 0, a]}>
            <coneGeometry args={[0.1, 0.6, 4]} />
            <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.7} />
          </mesh>
        ))}
      </group>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={hex("#FFFFFF")} emissive={hex(accent)} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function Hourglass({ accent, intensity = 1 }: RecipeProps) {
  const sand = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (sand.current) {
      const t = (clock.elapsedTime * 0.5 * intensity) % 1;
      sand.current.scale.y = 1 - t * 0.8;
    }
  });
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.5, 0.7, 32]} />
        <meshPhysicalMaterial color={hex("#FFFFFF")} transparent opacity={0.2} transmission={0.9} />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.5, 0.7, 32]} />
        <meshPhysicalMaterial color={hex("#FFFFFF")} transparent opacity={0.2} transmission={0.9} />
      </mesh>
      <mesh ref={sand} position={[0, 0.4, 0]}>
        <coneGeometry args={[0.45, 0.65, 32]} />
        <meshStandardMaterial color={hex(accent)} emissive={hex(accent)} emissiveIntensity={0.5} />
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
}: {
  scene: ArtifactSceneKey;
  accent: string;
  intensity?: number;
}) {
  const Comp = RECIPES[scene] ?? OrbitSystem;
  return <Comp accent={accent} intensity={intensity} />;
}
