import { useEffect } from "react";

export function CelebrationOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-700"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(201,162,75,0.18), rgba(7,7,12,0.85) 70%)",
      }}
    >
      {/* Soft glow pulse */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,75,0.65) 0%, var(--state-glow) 40%, transparent 70%)",
          animation: "ripple 2.5s ease-out infinite",
        }}
      />

      <div
        className="relative max-w-lg rounded-3xl p-10 text-center animate-in zoom-in-95 duration-700"
        style={{
          background:
            "linear-gradient(180deg, #1B1B28 0%, #0E0E18 100%)",
          border: "1px solid rgba(201,162,75,0.45)",
          boxShadow:
            "0 0 80px var(--state-glow), 0 0 120px rgba(201,162,75,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        {/* Top gold hairline */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-8 right-8 top-0 h-px"
          style={{ background: "var(--grad-hairline-gold)" }}
        />
        <div
          className="font-mono text-[11px] uppercase tracking-[0.35em]"
          style={{ color: "var(--gold-soft)" }}
        >
          Breakthrough
        </div>
        <h2
          className="mt-4 text-2xl font-semibold tracking-tight leading-snug"
          style={{ color: "#F5F1E6" }}
        >
          You discovered it yourself.
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "rgba(245,241,230,0.7)" }}
        >
          That understanding will stay with you now. Binary Search — halve the problem each step,
          and any lookup becomes a handful of moves.
        </p>
        <div
          className="mt-6 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "rgba(245,241,230,0.45)" }}
        >
          tap anywhere to continue
        </div>
      </div>
    </div>
  );
}
