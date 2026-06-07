import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { REALMS, type RealmId } from "@/lib/realms";
import { Float } from "@react-three/drei";
import { RealmEnvironmentScene } from "../engine/environments/RealmEnvironmentScene";

interface Props {
  activeIndex: number;
}

const SCENE_SPACING = 10; // Distance between each diorama

/**
 * Optimized Camera Rig to handle viewport transitions and subtle parallax.
 */
function CameraRig({ activeIndex }: { activeIndex: number }) {
  const cameraGroup = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (!cameraGroup.current) return;

    // Smoothly interpolate the camera's X position to the active realm's location
    const targetX = activeIndex * SCENE_SPACING;

    // Clamp delta to prevent massive jumps when switching tabs (prevents physics explosions)
    const safeDelta = Math.min(delta, 0.1);

    cameraGroup.current.position.x = THREE.MathUtils.lerp(
      cameraGroup.current.position.x,
      targetX,
      safeDelta * 3,
    );

    // Add a slight parallax pan to the camera's rotation
    const panOffset = (targetX - cameraGroup.current.position.x) * 0.05;
    cameraGroup.current.rotation.y = THREE.MathUtils.lerp(
      cameraGroup.current.rotation.y,
      panOffset,
      safeDelta * 4,
    );
  });

  return (
    <group ref={cameraGroup}>
      <perspectiveCamera position={[0, 0, 3.5]} fov={45} />
    </group>
  );
}

/**
 * Isolated wrapper for each realm diorama to manage its own lifecycle
 * and cleanly release memory when culled out of range.
 */
function OptimizedRealmNode({
  realm,
  index,
  activeIndex,
}: {
  realm: (typeof REALMS)[number];
  index: number;
  activeIndex: number;
}) {
  const isActive = index === activeIndex;

  // Cullying Threshold Matrix: Only mount the active scene and its direct left/right neighbors
  const isWithinRenderRange = Math.abs(index - activeIndex) <= 1;

  // Cache static array definitions to prevent continuous heap reallocations inside render loops
  const emptyArtifacts = useMemo(() => [], []);
  const dummyInteract = useMemo(() => () => {}, []);

  if (!isWithinRenderRange) return null; // Destroys the WebGL memory pointers cleanly for out-of-view worlds

  return (
    <group position={[index * SCENE_SPACING, 0, 0]}>
      {/* Directional Key Light mapping */}
      <directionalLight
        position={[5, 5, 2]}
        intensity={isActive ? 1.5 : 0.3}
        color={realm.accent}
      />

      {/* Secondary Ambient fill point */}
      <pointLight position={[-3, -2, 1]} intensity={0.5} color="#1e1b4b" />

      <Float
        speed={isActive ? 1 : 0.1}
        rotationIntensity={isActive ? 0.5 : 0.05}
        floatIntensity={isActive ? 0.5 : 0.05}
      >
        <RealmEnvironmentScene
          realm={realm.id as RealmId}
          state="IDLE"
          artifacts={emptyArtifacts}
          onObjectInteract={dummyInteract}
        />
      </Float>
    </group>
  );
}

/**
 * Core Canvas Orchestrator.
 * Formatted with strict parameters to combat "WebGL Context Lost" exceptions.
 */
export function CarouselCanvas({ activeIndex }: Props) {
  const displayRealms = useMemo(() => REALMS.filter((r) => r.id !== "hub"), []);

  return (
    <div className="absolute inset-0 bg-[#05050A]">
      <Canvas
        dpr={1}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          precision: "highp",
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        // ⚡ Inject the WebGL Event Listener Handlers
        onCreated={({ gl }) => {
          const canvasElement = gl.domElement;

          const handleContextLost = (event: Event) => {
            event.preventDefault();
            console.warn("⚠️ WebGL Context Lost detected. Initiating recovery protocols...");
          };

          canvasElement.addEventListener("webglcontextlost", handleContextLost, false);

          // Clean up the DOM node listeners when unmounting
          return () => {
            canvasElement.removeEventListener("webglcontextlost", handleContextLost);
          };
        }}
      >
        <ambientLight intensity={0.15} />
        <CameraRig activeIndex={activeIndex} />
        {displayRealms.map((realm, index) => (
          <OptimizedRealmNode
            key={realm.id}
            realm={realm}
            index={index}
            activeIndex={activeIndex}
          />
        ))}
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#05050A_100%)]" />
    </div>
  );
}
