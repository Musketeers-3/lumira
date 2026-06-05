import { Star } from "lucide-react";
import { discoveryTitle, realmFromDomain } from "@/lib/realms";

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

const POSITIONS = [
  { x: 18, y: 15 },
  { x: 55, y: 22 },
  { x: 78, y: 38 },
  { x: 35, y: 48 },
  { x: 62, y: 58 },
  { x: 22, y: 65 },
  { x: 48, y: 30 },
  { x: 70, y: 72 },
  { x: 40, y: 78 },
  { x: 85, y: 55 },
];

export function ConstellationGraph({ stars, onSelectStar, selectedId }: Props) {
  const unlocked = stars.filter((s) => s.unlocked);
  const display = stars.length > 0 ? stars : [];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        aspectRatio: "16/9",
        minHeight: 280,
        background:
          "radial-gradient(ellipse at 40% 30%, var(--realm-glow), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(184,140,255,0.06), transparent 50%), linear-gradient(180deg, rgba(8,8,18,0.95), rgba(5,5,12,1))",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        {unlocked.slice(0, -1).map((star, i) => {
          const a = POSITIONS[i % POSITIONS.length];
          const b = POSITIONS[(i + 1) % POSITIONS.length];
          const next = unlocked[i + 1];
          if (!next) return null;
          return (
            <line
              key={`${star.id}-line`}
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke="var(--realm-accent)"
              strokeOpacity={0.25}
              strokeWidth={1}
            />
          );
        })}
      </svg>

      {display.map((star, i) => {
        const pos = POSITIONS[i % POSITIONS.length];
        const lit = star.unlocked;
        const selected = selectedId === star.id;
        return (
          <button
            key={star.id}
            type="button"
            onClick={() => lit && onSelectStar?.(star)}
            className="absolute flex flex-col items-center gap-1 transition-all duration-500 focus:outline-none"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) scale(${selected ? 1.2 : 1})`,
              opacity: lit ? 1 : 0.2,
              cursor: lit ? "pointer" : "default",
            }}
            disabled={!lit}
            title={lit ? discoveryTitle(star.name) : star.name}
          >
            <Star
              className="transition-all duration-500"
              style={{
                width: selected ? 22 : lit ? 18 : 12,
                height: selected ? 22 : lit ? 18 : 12,
                color: lit ? "var(--realm-accent)" : "var(--ink-tertiary)",
                fill: lit ? "var(--realm-accent)" : "transparent",
                filter: lit ? "drop-shadow(0 0 10px var(--realm-glow))" : "none",
              }}
            />
            {lit && (
              <span
                className="text-[9px] font-medium max-w-[72px] truncate"
                style={{ color: selected ? "var(--ink-primary)" : "var(--ink-tertiary)" }}
              >
                {discoveryTitle(star.name)}
              </span>
            )}
          </button>
        );
      })}

      {display.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display italic text-sm" style={{ color: "var(--ink-tertiary)" }}>
            Your constellation awaits its first star
          </p>
        </div>
      )}

      <div
        className="absolute bottom-3 right-4 text-xs"
        style={{ color: "var(--ink-tertiary)" }}
      >
        {unlocked.length} star{unlocked.length === 1 ? "" : "s"} shining
      </div>
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
