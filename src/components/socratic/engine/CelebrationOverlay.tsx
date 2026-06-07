// Inside CelebrationOverlay.tsx

import { useEffect, useState } from "react";
import { Star, ArrowRight } from "lucide-react";
import { getRealm } from "@/lib/realms";
import { getArtifact } from "@/lib/artifacts";
import type { DiscoveryPayload } from "@/lib/constellations";
import { ArtifactScene } from "../artifacts/ArtifactScene";

interface Props {
  payload: DiscoveryPayload;
  onClose: () => void;
}

type Phase = "ignite" | "mentor" | "insight";

const PHASE_DURATION: Record<Phase, number> = {
  ignite: 1500,
  mentor: 2500,
  insight: 0,
};

export function CelebrationOverlay({ payload, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("ignite");
  const [isSealing, setIsSealing] = useState(false); // NEW: Transition state

  const realm = getRealm(payload.realm);
  const artifact = getArtifact(payload.artifact);
  const accent = realm?.accent ?? "#06B6D4";

  useEffect(() => {
    const phases: Phase[] = ["ignite", "mentor", "insight"];
    const idx = phases.indexOf(phase);

    if (idx === -1 || phase === "insight") return;

    const t = setTimeout(() => {
      const next = phases[idx + 1];
      if (next) setPhase(next);
    }, PHASE_DURATION[phase]);

    return () => clearTimeout(t);
  }, [phase]);

  if (!artifact) return null;

  const isLegendary = payload.rarity === "legendary";
  const rarityColor = isLegendary ? "#FFE25E" : accent;

  // NEW: The Cinematic Exit
  const handleSeal = () => {
    setIsSealing(true);
    // Wait for the fade-out transition to complete before triggering the route change
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-1000"
      // Deepen the background to pure obsidian as they leave
      style={{
        backgroundColor: isSealing ? "#000000" : "rgba(5, 5, 10, 0.9)",
        backdropFilter: "blur(40px)",
      }}
    >
      {/* Rarity Atmospheric Bloom */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out pointer-events-none"
        style={{
          width: isLegendary ? "80vw" : "50vw",
          height: isLegendary ? "80vw" : "50vw",
          background: `radial-gradient(circle, ${rarityColor} ${isLegendary ? "30%" : "15%"}, transparent 70%)`,
          filter: "blur(100px)",
          opacity: isSealing ? 0 : phase === "ignite" ? 0 : isLegendary ? 0.2 : 0.1,
          transform: phase === "ignite" ? "scale(0.5)" : "scale(1)",
        }}
      />

      {/* Particle Burst for Ignition (Unchanged) */}
      {phase === "ignite" && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {Array.from({ length: isLegendary ? 24 : 12 }).map((_, i, arr) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={
                {
                  background: rarityColor,
                  "--tx": `${Math.cos((i / arr.length) * Math.PI * 2) * (isLegendary ? 200 : 120)}px`,
                  "--ty": `${Math.sin((i / arr.length) * Math.PI * 2) * (isLegendary ? 200 : 120)}px`,
                  animation: "particle-pop 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                  animationDelay: `${i * 0.02}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Hero Content Container - Fades out entirely on seal */}
      <div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center px-6 transition-all duration-[800ms]"
        style={{
          opacity: isSealing ? 0 : 1,
          transform: isSealing ? "scale(0.95)" : "scale(1)",
        }}
      >
        {/* Rarity Badge */}
        <div
          className="mb-8 flex items-center gap-2 rounded-full border px-4 py-1.5 transition-all duration-1000"
          style={{
            borderColor: `${rarityColor}40`,
            background: `${rarityColor}10`,
            opacity: phase === "ignite" ? 0 : 1,
            transform: phase === "ignite" ? "translateY(10px)" : "translateY(0)",
          }}
        >
          <Star
            className="h-4 w-4"
            style={{ color: rarityColor, fill: isLegendary ? rarityColor : "transparent" }}
          />
          <span
            className="text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: rarityColor }}
          >
            {payload.rarity} Discovery
          </span>
        </div>

        {/* 3D Artifact Hero View */}
        <div
          className="relative h-[35vh] w-full max-w-lg transition-all duration-[2000ms] ease-out animate-in zoom-in-90 duration-1000"
          style={{
            filter: phase !== "ignite" ? "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" : "none",
          }}
        >
          <ArtifactScene
            artifact={artifact}
            variant="hero"
            className="h-full w-full"
            isHovered={phase !== "ignite"}
          />
        </div>

        {/* Mentor's Poetic Anchor */}
        <div
          className="mt-8 text-center max-w-2xl min-h-[80px] transition-all duration-[1500ms]"
          style={{
            opacity: phase === "ignite" ? 0 : 1,
            filter: phase === "ignite" ? "blur(8px)" : "blur(0px)",
          }}
        >
          <p
            className="font-display italic text-2xl md:text-3xl leading-tight"
            style={{ color: "var(--ink-primary)", textShadow: `0 4px 20px ${rarityColor}30` }}
          >
            "{artifact.mentorLine}"
          </p>
        </div>

        {/* The Child's Insight & CTA */}
        <div
          className="mt-6 flex flex-col items-center text-center transition-all duration-1000"
          style={{
            opacity: phase === "insight" ? 1 : 0,
            transform: phase === "insight" ? "translateY(0)" : "translateY(10px)",
            pointerEvents: phase === "insight" ? "auto" : "none",
          }}
        >
          <div
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--ink-tertiary)" }}
          >
            Your Insight · {payload.topic}
          </div>
          <p
            className="mt-2 text-sm max-w-lg font-display italic"
            style={{ color: "var(--ink-secondary)" }}
          >
            &ldquo;{payload.insight}&rdquo;
          </p>

          <button
            onClick={handleSeal} // Trigger the local transition first
            className="group mt-10 flex items-center gap-3 rounded-full px-8 py-4 transition-all hover:scale-105"
            style={{
              background: rarityColor,
              color: "#000",
              boxShadow: `0 0 40px ${rarityColor}40`,
            }}
          >
            <span className="text-sm font-bold uppercase tracking-widest">
              Seal in Constellation
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes particle-pop {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          80% { transform: translate(var(--tx), var(--ty)) scale(0.5); opacity: 0.8; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
