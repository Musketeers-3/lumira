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

export function DiscoveryOverlay({ payload, onClose }: Props) {
  const [stage, setStage] = useState(0);

  const realm = getRealm(payload.realm);
  const artifact = getArtifact(payload.artifact);
  const accent = realm?.accent ?? "#06B6D4";

  // Cinematic timing sequencer
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 400); // Fade in Artifact
    const t2 = setTimeout(() => setStage(2), 2000); // Write Mentor Line
    const t3 = setTimeout(() => setStage(3), 4000); // Reveal UI / CTA
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!artifact) return null;

  const isLegendary = payload.rarity === "legendary";
  const rarityColor = isLegendary ? "#FFE25E" : accent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* 1. Glassmorphic Obsidian Background */}
      <div
        className="absolute inset-0 bg-[#05050A]/80 backdrop-blur-3xl transition-opacity duration-1000"
        style={{ opacity: stage >= 1 ? 1 : 0 }}
      />

      {/* 2. Rarity Atmospheric Bloom */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-[3000ms] ease-out"
        style={{
          width: isLegendary ? "80vw" : "50vw",
          height: isLegendary ? "80vw" : "50vw",
          background: `radial-gradient(circle, ${rarityColor} ${isLegendary ? "40%" : "20%"}, transparent 70%)`,
          filter: "blur(100px)",
          opacity: stage >= 1 ? (isLegendary ? 0.15 : 0.08) : 0,
          transform: stage >= 1 ? "scale(1)" : "scale(0.5)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center px-6">
        {/* Rarity Badge */}
        <div
          className="mb-8 flex items-center gap-2 rounded-full border px-4 py-1.5 transition-all duration-1000"
          style={{
            borderColor: `${rarityColor}40`,
            background: `${rarityColor}10`,
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "translateY(0)" : "translateY(10px)",
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
          className="relative h-[40vh] w-full max-w-lg transition-all duration-[2000ms] ease-out"
          style={{
            opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1 ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)",
            filter: stage >= 2 ? "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" : "none",
          }}
        >
          <ArtifactScene
            artifact={artifact}
            variant="hero"
            className="h-full w-full"
            isHovered={stage >= 2} // Triggers the ambient breath/video playback
          />
        </div>

        {/* Mentor's Poetic Anchor */}
        <div className="mt-8 text-center max-w-2xl min-h-[80px]">
          <p
            className="font-display italic text-2xl md:text-3xl lg:text-4xl leading-tight transition-all duration-[1500ms]"
            style={{
              color: "var(--ink-primary)",
              opacity: stage >= 2 ? 1 : 0,
              filter: stage >= 2 ? "blur(0px)" : "blur(8px)",
              textShadow: `0 4px 20px ${rarityColor}30`,
            }}
          >
            "{artifact.mentorLine}"
          </p>
        </div>

        {/* The Child's Insight */}
        <div
          className="mt-6 flex flex-col items-center text-center transition-all duration-1000"
          style={{
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "translateY(0)" : "translateY(10px)",
          }}
        >
          <div
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--ink-tertiary)" }}
          >
            Your Insight · {payload.topic}
          </div>
          <p className="mt-2 text-sm max-w-lg" style={{ color: "var(--ink-secondary)" }}>
            {payload.insight}
          </p>

          <button
            onClick={onClose}
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
    </div>
  );
}
