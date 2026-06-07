import type { ReactNode } from "react";
import { StateIndicatorTag } from "./StateIndicatorTag";

interface Props {
  children: ReactNode;
  isSpeaking?: boolean;
  isPausing?: boolean;
}

/**
 * Luxury glass case that wraps (does not modify) the mentor canvas.
 * Adds: outer/inner double frame, gold corner brackets, breathing state glow,
 * visible State Indicator Tag in the header rail.
 */
export function MentorGlassFrame({ children, isSpeaking, isPausing }: Props) {
  return (
    <div
      className="relative rounded-[1.5rem] p-2 transition-shadow duration-700"
      style={{
        background: "var(--grad-onyx-raised)",
        border: "1px solid rgba(201,162,75,0.28)",
        boxShadow:
          "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 60px -10px var(--state-glow), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* breathing aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[1.6rem] opacity-70"
        style={{
          background: "radial-gradient(120% 60% at 50% 0%, var(--state-glow), transparent 70%)",
          mixBlendMode: "screen",
          animation: "pulse-glow 5.5s ease-in-out infinite",
        }}
      />

      {/* gold corner brackets */}
      <CornerBracket pos="tl" />
      <CornerBracket pos="tr" />
      <CornerBracket pos="bl" />
      <CornerBracket pos="br" />

      {/* header rail */}
      <div className="relative z-20 flex items-center justify-between px-3 pb-2 pt-1">
        <StateIndicatorTag isSpeaking={isSpeaking} isPausing={isPausing} />
        <div
          className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] sm:inline-flex"
          style={{ color: "rgba(201,162,75,0.7)" }}
        >
          <span
            className="h-1 w-1 rounded-full"
            style={{ background: "#C9A24B", boxShadow: "0 0 8px rgba(201,162,75,0.7)" }}
          />
          lumira · live
        </div>
      </div>

      {/* inner well — recessed, holds the unchanged canvas */}
      <div
        className="relative z-10 overflow-hidden rounded-[1.1rem]"
        style={{
          boxShadow: "inset 0 2px 14px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(245,241,230,0.06)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CornerBracket({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base = "pointer-events-none absolute z-30 h-4 w-4 border-[rgba(201,162,75,0.65)]";
  const map: Record<typeof pos, string> = {
    tl: "left-1 top-1 border-l border-t rounded-tl-[1.25rem]",
    tr: "right-1 top-1 border-r border-t rounded-tr-[1.25rem]",
    bl: "left-1 bottom-1 border-l border-b rounded-bl-[1.25rem]",
    br: "right-1 bottom-1 border-r border-b rounded-br-[1.25rem]",
  };
  return (
    <span
      aria-hidden
      className={`${base} ${map[pos]}`}
      style={{ boxShadow: "0 0 8px rgba(201,162,75,0.35)" }}
    />
  );
}
