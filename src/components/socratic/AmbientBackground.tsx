export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-700 ease-in-out"
      style={{
        background:
          "radial-gradient(ellipse at top right, var(--ambient-via), var(--ambient-from) 55%, var(--ambient-to) 100%)",
      }}
    >
      {/* Deep cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(5,5,7,0.65) 75%, rgba(5,5,7,0.95) 100%)",
        }}
      />

      {/* Single restrained state spotlight, top-right */}
      <div
        className="absolute -top-[20%] -right-[15%] h-[80vh] w-[80vh] rounded-full blur-3xl opacity-[0.22] transition-colors duration-700"
        style={{
          background: "radial-gradient(circle, var(--state-glow), transparent 65%)",
          animation: "orb-drift 22s ease-in-out infinite",
        }}
      />

      {/* Editorial vertical guide hairlines (desktop only) */}
      <div className="hidden lg:block absolute inset-y-0 left-1/4 w-px" style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.035) 30%, rgba(255,255,255,0.035) 70%, transparent)" }} />
      <div className="hidden lg:block absolute inset-y-0 left-3/4 w-px" style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.035) 30%, rgba(255,255,255,0.035) 70%, transparent)" }} />

      {/* Subtle 4K grain across viewport */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "220px 220px",
        }}
      />
    </div>
  );
}
