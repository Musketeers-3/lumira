import { Canvas } from "@react-three/fiber";
import type { Artifact } from "@/lib/artifacts";
import { getRealm } from "@/lib/realms";
import { ArtifactRecipe } from "./ArtifactRecipes";

interface Props {
  artifact: Artifact;
  variant?: "inline" | "hero" | "floating";
  className?: string;
  paused?: boolean;
}

/**
 * Tiny self-contained r3f canvas that renders any artifact's procedural recipe.
 * Used in Worlds dioramas, Journal scene cards, and Constellation hover.
 */
export function ArtifactScene({ artifact, variant = "inline", className = "", paused = false }: Props) {
  const realm = getRealm(artifact.realm);
  const accent = artifact.accent ?? realm?.accent ?? "#06B6D4";
  const intensity = paused ? 0 : variant === "hero" ? 1.1 : 0.85;
  const camDist = variant === "hero" ? 3.4 : variant === "floating" ? 3.0 : 3.2;

  return (
    <div className={`relative ${className}`} aria-label={artifact.name}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0.4, camDist], fov: 38 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.1} />
        <pointLight position={[-2, -1, 3]} intensity={0.5} color={accent} />
        <ArtifactRecipe scene={artifact.scene} accent={accent} intensity={intensity} />
      </Canvas>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, transparent 55%, rgba(6,7,10,0.5) 100%)`,
        }}
      />
    </div>
  );
}
