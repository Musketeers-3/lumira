import { Mic } from "lucide-react";

export function MicButton({ active }: { active: boolean }) {
  return (
    <button
      type="button"
      aria-label="Voice input (demo)"
      className="relative flex h-16 w-16 items-center justify-center rounded-full border border-glass-border bg-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:scale-105"
      style={{ boxShadow: "0 0 40px -5px var(--state-glow)" }}
    >
      {active && (
        <>
          {[0, 0.5, 1].map((d) => (
            <span
              key={d}
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: "var(--state-accent)",
                animation: `ripple 1.8s ease-out ${d}s infinite`,
              }}
            />
          ))}
        </>
      )}
      <Mic
        className="relative h-6 w-6 transition-colors duration-700"
        style={{ color: "var(--state-accent)" }}
        strokeWidth={1.5}
      />
    </button>
  );
}
