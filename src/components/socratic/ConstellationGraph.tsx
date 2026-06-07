/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { CONSTELLATION_SHAPES, type StarRarity } from "@/lib/constellations";
import { getRealm, realmFromDomain, type RealmId } from "@/lib/realms";
import { artifactForSkillName } from "@/lib/artifacts";
import { ArtifactScene } from "./artifacts/ArtifactScene";

export interface ConstellationStar {
  id: string;
  name: string;
  domain: string;
  unlocked: boolean;
  insight?: string;
  rarity?: StarRarity;
}

interface Props {
  stars: ConstellationStar[];
  onSelectStar?: (star: ConstellationStar) => void;
  selectedId?: string | null;
}

export function ConstellationGraph({ stars, onSelectStar, selectedId }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Map dynamic discoveries into the authored slots
  const mappedConstellations = useMemo(() => {
    const byRealm: Record<RealmId, ConstellationStar[]> = {
      physics: [],
      biology: [],
      math: [],
      chemistry: [],
      history: [],
      hub: [],
    };

    stars.forEach((s) => byRealm[realmFromDomain(s.domain)].push(s));

    const renderNodes: any[] = [];
    const renderLines: any[] = [];

    (Object.keys(byRealm) as RealmId[]).forEach((realm) => {
      const realmStars = byRealm[realm];
      const shape = CONSTELLATION_SHAPES[realm];

      realmStars.forEach((star, index) => {
        // Fallback to hub center if we exceed authored nodes
        const coords = shape[index] || { x: 50, y: 50 };
        const isUnlocked = star.unlocked;

        renderNodes.push({ star, realm, x: coords.x, y: coords.y, isUnlocked });

        // Draw line to previous star in this realm
        if (index > 0) {
          const prevCoords = shape[index - 1];
          renderLines.push({
            id: `${realm}-line-${index}`,
            x1: prevCoords.x,
            y1: prevCoords.y,
            x2: coords.x,
            y2: coords.y,
            realm,
            active: isUnlocked && realmStars[index - 1].unlocked,
            isLegendary:
              star.rarity === "legendary" || realmStars[index - 1].rarity === "legendary",
          });
        }
      });
    });

    return { renderNodes, renderLines };
  }, [stars]);

  const { renderNodes, renderLines } = mappedConstellations;
  const hoverNode = renderNodes.find((n) => n.star.id === hoverId);
  const hoverArtifact = hoverNode ? artifactForSkillName(hoverNode.star.name) : undefined;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        aspectRatio: "16/9",
        minHeight: 360,
        background: "linear-gradient(180deg, #05050A 0%, #0A0A12 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "inset 0 0 100px rgba(0,0,0,0.8)",
      }}
    >
      {/* Authored Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        {renderLines.map((line, i) => {
          const realmData = getRealm(line.realm);
          const accent = realmData?.accent ?? "#06B6D4";
          return (
            <line
              key={line.id}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke={accent}
              strokeWidth={line.isLegendary ? 2.5 : 1.5}
              strokeOpacity={line.active ? (line.isLegendary ? 0.8 : 0.4) : 0.05}
              strokeDasharray={line.active ? "none" : "4 4"}
              style={{
                transition: "stroke-opacity 1s ease-out, stroke-width 0.5s ease",
                filter: line.isLegendary ? `drop-shadow(0 0 8px ${accent})` : "none",
              }}
            />
          );
        })}
      </svg>

      {/* Authored Stars */}
      {renderNodes.map(({ star, realm, x, y, isUnlocked }) => {
        const selected = selectedId === star.id;
        const rarity = star.rarity || "common";
        const realmData = getRealm(realm);
        const accent = realmData?.accent ?? "#06B6D4";

        // Premium visual calculations based on rarity
        const isLegendary = rarity === "legendary";
        const isRare = rarity === "rare";
        const size = isLegendary ? 24 : isRare ? 18 : 14;

        return (
          <button
            key={star.id}
            type="button"
            onClick={() => isUnlocked && onSelectStar?.(star)}
            onMouseEnter={() => isUnlocked && setHoverId(star.id)}
            onMouseLeave={() => setHoverId(null)}
            className="absolute flex flex-col items-center gap-2 focus:outline-none group"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              opacity: isUnlocked ? 1 : 0.2,
              cursor: isUnlocked ? "pointer" : "default",
              transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              scale: selected ? "1.4" : "1",
            }}
            disabled={!isUnlocked}
          >
            {/* Cinematic Rarity Bloom */}
            {isUnlocked && (isRare || isLegendary) && (
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: accent,
                  filter: `blur(${isLegendary ? 12 : 6}px)`,
                  transform: "scale(2)",
                  opacity: isLegendary ? 0.4 : 0.2,
                  zIndex: -1,
                }}
              />
            )}

            <Star
              className="transition-all duration-500 relative z-10"
              style={{
                width: size,
                height: size,
                color: isUnlocked ? accent : "var(--ink-tertiary)",
                fill: isUnlocked ? accent : "transparent",
                filter: isUnlocked && isLegendary ? `drop-shadow(0 0 10px ${accent})` : "none",
                // Subtle ambient float using CSS animation
                animation: isUnlocked
                  ? `float ${2 + Math.random()}s ease-in-out infinite alternate`
                  : "none",
              }}
            />
          </button>
        );
      })}

      {/* Hover Artifact Overlay (Same Glassmorphic logic as before) */}
      {hoverNode && hoverArtifact && (
        <div
          className="pointer-events-none absolute z-20 transition-all duration-300"
          style={{
            left: `${hoverNode.x}%`,
            top: `${hoverNode.y}%`,
            transform: "translate(-50%, calc(-100% - 24px))",
          }}
        >
          <div
            className="flex items-center gap-3 rounded-xl p-2 pr-4 backdrop-blur-xl"
            style={{
              background: "rgba(8,10,15,0.85)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.8)",
            }}
          >
            <div className="h-16 w-16 overflow-hidden rounded-lg bg-black/50">
              <ArtifactScene
                artifact={hoverArtifact}
                variant="floating"
                isHovered={true}
                className="h-full w-full"
              />
            </div>
            <div className="min-w-0 max-w-[200px]">
              <div className="text-xs font-semibold truncate text-white">{hoverArtifact.name}</div>
              <div className="text-[10px] italic mt-1 text-white/60 leading-snug">
                "{hoverArtifact.mentorLine}"
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-4px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
