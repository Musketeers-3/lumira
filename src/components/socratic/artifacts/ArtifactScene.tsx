import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Suspense } from "react";
import type { Artifact } from "@/lib/artifacts";
import { getRealm } from "@/lib/realms";
import { ArtifactRecipe } from "./ArtifactRecipes";

interface Props {
  artifact: Artifact;
  variant?: "inline" | "hero" | "floating";
  className?: string;
  paused?: boolean;
  isHovered?: boolean;
  isExpanding?: boolean;
}

/**
 * Procedural r3f canvas rendering the Artifact's scene.
 * Uses a deep obsidian lighting model and physical floating.
 */
export function ArtifactScene({
  artifact,
  variant = "inline",
  className = "",
  paused = false,
  isHovered = false,
  isExpanding = false,
}: Props) {
  const realm = getRealm(artifact.realm);
  const accent = artifact.accent ?? realm?.accent ?? "#06B6D4";
  const intensity = paused ? 0 : variant === "hero" ? 1.1 : 0.85;
  const isInteractive = isHovered || isExpanding;

  return (
    <div className={`relative ${className}`} aria-label={artifact.name}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 2.2], fov: 38 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* 1. Deep Obsidian Ambient Base */}
          <ambientLight intensity={0.15} />

          {/* 2. Primary Key Light: Using passed JS hex string */}
          <directionalLight position={[5, 3, 5]} intensity={1.5} color={accent} />

          {/* 3. Deep Cosmic Fill Light */}
          <pointLight position={[-4, -2, 3]} intensity={0.8} color="#1e1b4b" />

          {/* 4. High-End Rim Light for Glass/Glow outlines */}
          <directionalLight position={[0, 2, -5]} intensity={2.5} color={accent} />

          {/* Cinematic Global Breath */}
          <Float
            speed={paused ? 0 : 1.5}
            rotationIntensity={isInteractive ? 0.8 : 0.2}
            floatIntensity={isInteractive ? 0.8 : 0.2}
            floatingRange={[-0.05, 0.05]}
          >
            <ArtifactRecipe
              scene={artifact.scene}
              accent={accent}
              intensity={intensity}
              isHovered={isInteractive}
            />
          </Float>
        </Suspense>
      </Canvas>

      {/* Cinematic Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(6,7,10,0.5) 100%)`,
          opacity: isInteractive ? 0.5 : 1, // Lifts the vignette slightly on interaction
        }}
      />
    </div>
  );
}
