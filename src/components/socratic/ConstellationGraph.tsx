import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { discoveryTitle, realmFromDomain, getRealm, type RealmId } from "@/lib/realms";
import { artifactForSkillName } from "@/lib/artifacts";
import { ArtifactScene } from "./artifacts/ArtifactScene";

export interface ConstellationStar {
  id: string;
  name: string;
  domain: string;
  unlocked: boolean;
  insight?: string;
  date?: string;
}

interface Props {
  stars: ConstellationStar[];
  onSelectStar?: (star: ConstellationStar) => void;
  selectedId?: string | null;
}

/** Cluster centers (percent) per realm — gives the constellation a "shape of mind". */
const REALM_CLUSTERS: Record<RealmId, { cx: number; cy: number; spread: number }> = {
  physics: { cx: 28, cy: 28, spread: 14 },
  chemistry: { cx: 72, cy: 30, spread: 14 },
  biology: { cx: 22, cy: 70, spread: 14 },
  math: { cx: 78, cy: 72, spread: 14 },
  history: { cx: 50, cy: 52, spread: 12 },
  hub: { cx: 50, cy: 50, spread: 10 },
};

function positionFor(realm: RealmId, index: number, total: number) {
  const c = REALM_CLUSTERS[realm];
  if (total <= 1) return { x: c.cx, y: c.cy };
  const angle = (index / Math.max(total, 1)) * Math.PI * 2;
  return {
    x: c.cx + Math.cos(angle) * c.spread,
    y: c.cy + Math.sin(angle) * c.spread * 0.8,
  };
}

export function ConstellationGraph({ stars, onSelectStar, selectedId }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Group by realm so positions cluster
  const positioned = useMemo(() => {
    const byRealm: Record<string, ConstellationStar[]> = {};
    for (const s of stars) {
      const r = realmFromDomain(s.domain);
      byRealm[r] = byRealm[r] ?? [];
      byRealm[r].push(s);
    }
    const out: { star: ConstellationStar; x: number; y: number; realm: RealmId; index: number }[] = [];
    for (const [realm, group] of Object.entries(byRealm)) {
      group.forEach((star, i) => {
        const pos = positionFor(realm as RealmId, i, group.length);
        out.push({ star, x: pos.x, y: pos.y, realm: realm as RealmId, index: i });
      });
    }
    return out;
  }, [stars]);

  const unlockedPositioned = positioned.filter((p) => p.star.unlocked);
  const hoverStar = positioned.find((p) => p.star.id === hoverId);
  const hoverArtifact = hoverStar ? artifactForSkillName(hoverStar.star.name) : undefined;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        aspectRatio: "16/9",
        minHeight: 320,
        background:
          "radial-gradient(ellipse at 50% 50%, var(--realm-glow), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(184,140,255,0.05), transparent 50%), linear-gradient(180deg, rgba(8,8,18,0.95), rgba(5,5,12,1))",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Realm cluster glows */}
      {(Object.entries(REALM_CLUSTERS) as [RealmId, (typeof REALM_CLUSTERS)[RealmId]][])
        .filter(([id]) => id !== "hub")
        .map(([id, c]) => {
          const realm = getRealm(id);
          if (!realm) return null;
          const hasStars = positioned.some((p) => p.realm === id && p.star.unlocked);
          return (
            <div
              key={id}
              aria-hidden
              className="absolute pointer-events-none transition-opacity duration-700"
              style={{
                left: `${c.cx}%`,
                top: `${c.cy}%`,
                width: 160,
                height: 160,
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, ${realm.glow}, transparent 65%)`,
                opacity: hasStars ? 0.5 : 0.12,
              }}
            />
          );
        })}

      {/* Connecting lines — animated stroke */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <defs>
          <style>
            {`@keyframes draw-line { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }`}
          </style>
        </defs>
        {unlockedPositioned.slice(0, -1).map((p, i) => {
          const next = unlockedPositioned[i + 1];
          if (!next) return null;
          return (
            <line
              key={`${p.star.id}-line`}
              x1={`${p.x}%`}
              y1={`${p.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke="var(--realm-accent)"
              strokeOpacity={0.3}
              strokeWidth={1}
              strokeDasharray="100"
              style={{
                animation: `draw-line 1.2s ease-out ${0.2 + i * 0.15}s both`,
              }}
            />
          );
        })}
      </svg>

      {/* Stars */}
      {positioned.map(({ star, x, y }, i) => {
        const lit = star.unlocked;
        const selected = selectedId === star.id;
        return (
          <button
            key={star.id}
            type="button"
            onClick={() => lit && onSelectStar?.(star)}
            onMouseEnter={() => lit && setHoverId(star.id)}
            onMouseLeave={() => setHoverId(null)}
            className="absolute flex flex-col items-center gap-1 transition-all duration-500 focus:outline-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) scale(${selected ? 1.25 : 1})`,
              opacity: lit ? 1 : 0.18,
              cursor: lit ? "pointer" : "default",
              animation: lit ? `star-birth 0.9s ease-out ${i * 0.12}s both` : undefined,
            }}
            disabled={!lit}
            title={lit ? discoveryTitle(star.name) : star.name}
          >
            <Star
              className="transition-all duration-500"
              style={{
                width: selected ? 24 : lit ? 18 : 12,
                height: selected ? 24 : lit ? 18 : 12,
                color: lit ? "var(--realm-accent)" : "var(--ink-tertiary)",
                fill: lit ? "var(--realm-accent)" : "transparent",
                filter: lit ? "drop-shadow(0 0 12px var(--realm-glow))" : "none",
              }}
            />
            {lit && (
              <span
                className="text-[9px] font-medium max-w-[80px] truncate"
                style={{ color: selected ? "var(--ink-primary)" : "var(--ink-tertiary)" }}
              >
                {discoveryTitle(star.name)}
              </span>
            )}
          </button>
        );
      })}

      {/* Hover artifact float-out */}
      {hoverStar && hoverArtifact && (
        <div
          className="pointer-events-none absolute z-10 transition-all duration-300"
          style={{
            left: `${hoverStar.x}%`,
            top: `${hoverStar.y}%`,
            transform: "translate(-50%, calc(-100% - 12px))",
            animation: "fade-in 0.3s ease-out",
          }}
        >
          <div
            className="flex items-center gap-3 rounded-xl p-2 pr-3 backdrop-blur-md"
            style={{
              background: "rgba(10,12,18,0.85)",
              border: "1px solid var(--realm-accent)",
              boxShadow: "0 8px 30px var(--realm-glow)",
            }}
          >
            <div className="h-14 w-14 overflow-hidden rounded-lg">
              <ArtifactScene artifact={hoverArtifact} variant="floating" className="h-full w-full" />
            </div>
            <div className="min-w-0 max-w-[180px]">
              <div className="text-xs font-semibold truncate" style={{ color: "var(--ink-primary)" }}>
                {hoverArtifact.name}
              </div>
              <div className="text-[10px] italic mt-0.5 leading-snug" style={{ color: "var(--ink-tertiary)" }}>
                "{hoverArtifact.mentorLine}"
              </div>
            </div>
          </div>
        </div>
      )}

      {positioned.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display italic text-sm" style={{ color: "var(--ink-tertiary)" }}>
            Your constellation awaits its first star
          </p>
        </div>
      )}

      <div className="absolute bottom-3 right-4 text-xs" style={{ color: "var(--ink-tertiary)" }}>
        {unlockedPositioned.length} star{unlockedPositioned.length === 1 ? "" : "s"} shining
      </div>

      <style>{`
        @keyframes star-birth {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          60% { transform: translate(-50%, -50%) scale(1.6); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function realmEmojiForDomain(domain: string): string {
  const realm = realmFromDomain(domain);
  const map: Record<string, string> = {
    physics: "🌌",
    chemistry: "🧪",
    biology: "🌿",
    math: "📐",
    history: "📜",
  };
  return map[realm] ?? "✦";
}
