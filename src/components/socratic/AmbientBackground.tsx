export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-700 ease-in-out"
      style={{
        background:
          "radial-gradient(ellipse at top, var(--ambient-via), var(--ambient-from) 50%, var(--ambient-to) 100%)",
      }}
    >
      {/* Deep vignette base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(7,7,12,0.55) 80%, rgba(7,7,12,0.9) 100%)",
        }}
      />

      {/* State-tinted drifting orb */}
      <div
        className="absolute -top-1/3 -left-1/3 h-[80vh] w-[80vh] rounded-full blur-3xl opacity-55 transition-colors duration-700"
        style={{
          background: "radial-gradient(circle, var(--state-glow), transparent 70%)",
          animation: "orb-drift 14s ease-in-out infinite",
        }}
      />

      {/* Gold luxury orb (always-on, subtle) */}
      <div
        className="absolute top-1/4 right-[-10%] h-[60vh] w-[60vh] rounded-full blur-3xl opacity-[0.18]"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,75,0.55), rgba(139,107,42,0.18) 40%, transparent 70%)",
          animation: "orb-drift 22s ease-in-out infinite reverse",
        }}
      />

      {/* Second state orb */}
      <div
        className="absolute -bottom-1/3 -right-1/4 h-[70vh] w-[70vh] rounded-full blur-3xl opacity-40 transition-colors duration-700"
        style={{
          background: "radial-gradient(circle, var(--state-glow), transparent 70%)",
          animation: "orb-drift 18s ease-in-out infinite reverse",
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,241,230,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,230,0.6) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
