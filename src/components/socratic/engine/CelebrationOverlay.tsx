import { useEffect } from "react";

export function CelebrationOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-700"
    >
      {/* Single soft glow pulse — no confetti */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, var(--state-glow) 0%, transparent 70%)",
          animation: "ripple 2.5s ease-out infinite",
        }}
      />

      <div
        className="relative max-w-lg rounded-3xl border border-glass-border bg-[oklch(0.14_0.05_140/0.9)] p-10 text-center backdrop-blur-2xl animate-in zoom-in-95 duration-700"
        style={{ boxShadow: "0 0 80px var(--state-glow)" }}
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-state-accent">
          Breakthrough
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight leading-snug">
          You discovered it yourself.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          That understanding will stay with you now. Binary Search — halve the problem each step,
          and any lookup becomes a handful of moves.
        </p>
        <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          tap anywhere to continue
        </div>
      </div>
    </div>
  );
}
