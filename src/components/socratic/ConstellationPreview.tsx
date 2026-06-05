import { Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { discoveryTitle } from "@/lib/realms";

interface StarNode {
  id: string;
  name: string;
  unlocked: boolean;
}

interface Props {
  stars: StarNode[];
  isLoading?: boolean;
}

const POSITIONS = [
  { top: "12%", left: "18%", size: 14 },
  { top: "28%", left: "62%", size: 18 },
  { top: "55%", left: "35%", size: 12 },
  { top: "42%", left: "78%", size: 16 },
  { top: "68%", left: "58%", size: 13 },
  { top: "22%", left: "42%", size: 10 },
  { top: "72%", left: "22%", size: 11 },
];

export function ConstellationPreview({ stars, isLoading }: Props) {
  const unlocked = stars.filter((s) => s.unlocked);
  const displayStars = unlocked.length > 0 ? unlocked : stars.slice(0, 5);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 lg:p-8"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(59,158,255,0.08), transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(184,140,255,0.06), transparent 50%), linear-gradient(180deg, rgba(11,11,24,0.9), rgba(7,7,14,0.95))",
        border: "1px solid rgba(255,255,255,0.06)",
        minHeight: 220,
      }}
    >
      {/* Nebula backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--realm-glow), transparent 65%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div className="flex items-start justify-between">
          <div>
            <div
              className="text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--realm-accent)" }}
            >
              Your Constellation
            </div>
            <p className="mt-1 text-sm" style={{ color: "var(--ink-secondary)" }}>
              {isLoading
                ? "Mapping your sky..."
                : unlocked.length > 0
                  ? `${unlocked.length} star${unlocked.length === 1 ? "" : "s"} shining`
                  : "Your first star is waiting"}
            </p>
          </div>
          <Link
            to="/skill-passport"
            className="inline-flex items-center gap-1.5 text-xs font-medium transition-all hover:gap-2.5"
            style={{ color: "var(--realm-accent)" }}
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Star field */}
        <div className="relative flex-1 min-h-[120px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div
                className="h-8 w-8 rounded-full animate-pulse"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
            </div>
          ) : (
            <>
              {/* Connection lines between unlocked stars */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden
              >
                {displayStars.slice(0, -1).map((_, i) => {
                  const a = POSITIONS[i % POSITIONS.length];
                  const b = POSITIONS[(i + 1) % POSITIONS.length];
                  if (!displayStars[i]?.unlocked || !displayStars[i + 1]?.unlocked) return null;
                  return (
                    <line
                      key={i}
                      x1={`${parseFloat(a.left)}%`}
                      y1={`${a.top}`}
                      x2={`${parseFloat(b.left)}%`}
                      y2={`${b.top}`}
                      stroke="var(--realm-accent)"
                      strokeOpacity={0.2}
                      strokeWidth={1}
                    />
                  );
                })}
              </svg>

              {displayStars.map((star, i) => {
                const pos = POSITIONS[i % POSITIONS.length];
                const lit = star.unlocked;
                return (
                  <div
                    key={star.id}
                    className="absolute flex flex-col items-center gap-1 transition-all duration-700"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      transform: "translate(-50%, -50%)",
                      opacity: lit ? 1 : 0.25,
                    }}
                    title={discoveryTitle(star.name)}
                  >
                    <Star
                      className="transition-all duration-500"
                      style={{
                        width: pos.size,
                        height: pos.size,
                        color: lit ? "var(--realm-accent)" : "var(--ink-tertiary)",
                        fill: lit ? "var(--realm-accent)" : "transparent",
                        filter: lit ? "drop-shadow(0 0 8px var(--realm-glow))" : "none",
                        animation: lit ? "pulse-glow 3s ease-in-out infinite" : undefined,
                      }}
                    />
                    {lit && i < 3 && (
                      <span
                        className="text-[9px] font-medium whitespace-nowrap max-w-[80px] truncate"
                        style={{ color: "var(--ink-tertiary)" }}
                      >
                        {discoveryTitle(star.name)}
                      </span>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
