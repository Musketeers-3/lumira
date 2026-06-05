import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Props {
  onClose: () => void;
  discoveryTitle?: string;
  insight?: string;
}

type Phase = "converge" | "celebrate" | "reveal" | "star" | "done";

const PHASE_DURATION: Record<Phase, number> = {
  converge: 1200,
  celebrate: 2000,
  reveal: 2500,
  star: 3000,
  done: 0,
};

export function CelebrationOverlay({
  onClose,
  discoveryTitle = "New Discoverer",
  insight = "That understanding will stay with you now — you found it yourself.",
}: Props) {
  const [phase, setPhase] = useState<Phase>("converge");
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const skipTimer = setTimeout(() => setCanSkip(true), 4000);
    return () => clearTimeout(skipTimer);
  }, []);

  useEffect(() => {
    const phases: Phase[] = ["converge", "celebrate", "reveal", "star", "done"];
    const idx = phases.indexOf(phase);
    if (idx === -1 || phase === "done") {
      onClose();
      return;
    }
    const t = setTimeout(() => {
      const next = phases[idx + 1];
      if (next) setPhase(next);
    }, PHASE_DURATION[phase]);
    return () => clearTimeout(t);
  }, [phase, onClose]);

  const handleDismiss = () => {
    if (canSkip || phase === "star" || phase === "done") onClose();
  };

  return (
    <div
      onClick={handleDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-700 cursor-pointer"
      style={{
        background: `radial-gradient(ellipse at center, var(--realm-glow), rgba(7,7,12,0.88) 70%)`,
      }}
    >
      {/* Particle burst */}
      {phase !== "converge" &&
        Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
            style={{
              background: "var(--realm-accent)",
              "--tx": `${Math.cos((i / 12) * Math.PI * 2) * 120}px`,
              "--ty": `${Math.sin((i / 12) * Math.PI * 2) * 120}px`,
              animation: "particle-pop 1.2s ease-out forwards",
              animationDelay: `${i * 0.05}s`,
            } as React.CSSProperties}
          />
        ))}

      {/* Convergence glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000"
        style={{
          width: phase === "converge" ? 120 : 300,
          height: phase === "converge" ? 120 : 300,
          background: `radial-gradient(circle, var(--realm-accent) 0%, var(--realm-glow) 40%, transparent 70%)`,
          opacity: phase === "converge" ? 0.8 : 0.5,
          animation: phase !== "converge" ? "ripple 2.5s ease-out infinite" : undefined,
        }}
      />

      <div
        className="relative max-w-lg rounded-3xl p-10 text-center transition-all duration-700"
        style={{
          background: "linear-gradient(180deg, #1B1B28 0%, #0E0E18 100%)",
          border: "1px solid var(--realm-accent)",
          boxShadow: "0 0 80px var(--realm-glow), inset 0 1px 0 rgba(255,255,255,0.07)",
          transform: phase === "converge" ? "scale(0.9)" : "scale(1)",
          opacity: phase === "converge" ? 0 : 1,
        }}
      >
        {phase === "celebrate" && (
          <>
            <div className="text-4xl mb-4" style={{ animation: "star-birth 0.8s ease-out" }}>
              ✦
            </div>
            <h2 className="text-2xl font-display font-semibold" style={{ color: "var(--ink-primary)" }}>
              You found it yourself.
            </h2>
            <p className="mt-3 text-sm" style={{ color: "var(--ink-secondary)" }}>
              Your mentor is proud. Take a breath — this one is yours.
            </p>
          </>
        )}

        {phase === "reveal" && (
          <>
            <div
              className="text-xs font-medium uppercase tracking-[0.25em] mb-3"
              style={{ color: "var(--realm-accent)" }}
            >
              New Discovery
            </div>
            <h2
              className="text-2xl font-display font-semibold"
              style={{ color: "var(--ink-primary)", animation: "star-birth 0.6s ease-out" }}
            >
              {discoveryTitle}
            </h2>
            <p className="mt-4 text-sm italic leading-relaxed" style={{ color: "var(--ink-secondary)" }}>
              &ldquo;{insight}&rdquo;
            </p>
          </>
        )}

        {(phase === "star" || phase === "done") && (
          <>
            <Star
              className="mx-auto h-12 w-12 mb-4"
              style={{
                color: "var(--realm-accent)",
                fill: "var(--realm-accent)",
                filter: "drop-shadow(0 0 16px var(--realm-glow))",
                animation: "star-fly 2s ease-in forwards",
              }}
            />
            <h2 className="text-xl font-display" style={{ color: "var(--ink-primary)" }}>
              A new star joins your constellation
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--ink-tertiary)" }}>
              {canSkip ? "Tap anywhere to continue" : "..."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
