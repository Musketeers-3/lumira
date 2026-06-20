import { useRealm } from "@/lib/realm-context";

export function AmbientBackground() {
  const { realm } = useRealm();

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000 ease-in-out"
    >
      {/* Layer 1 — Realm-aware immersive background */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 50% -20%, var(--realm-ambient-via), var(--realm-ambient-from) 45%, var(--realm-ambient-to) 100%)`,
        }}
      />

      {/* Layer 2 — Animated aurora ribbons (realm-tinted) */}
      <div
        className="aurora-ribbon -top-[30%] -left-[20%] h-[70vh] w-[70vh] opacity-[0.35] transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, var(--realm-ribbon-1), transparent 70%)`,
          animationDelay: "0s",
        }}
      />
      <div
        className="aurora-ribbon -bottom-[25%] -right-[15%] h-[60vh] w-[60vh] opacity-[0.3] transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, var(--realm-ribbon-2), transparent 65%)`,
          animationDelay: "-8s",
          animationDuration: "32s",
        }}
      />
      <div
        className="aurora-ribbon top-[40%] left-[60%] h-[50vh] w-[50vh] opacity-[0.2] transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, var(--state-glow), transparent 70%)`,
          animationDelay: "-16s",
          animationDuration: "24s",
        }}
      />

      {/* Realm-specific particle field */}
      {realm === "physics" && <PhysicsParticles />}
      {realm === "chemistry" && <ChemistryParticles />}
      {realm === "biology" && <BiologyParticles />}
      {realm === "math" && <MathParticles />}
      {realm === "history" && <HistoryParticles />}
      {realm === "hub" && <HubParticles />}

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(5,5,7,0.5) 70%, rgba(5,5,7,0.92) 100%)",
        }}
      />

      {/* Light beam sweep */}
      <div className="light-beam top-[15%] left-0 h-[1px] w-[140%] opacity-40" />
      <div
        className="light-beam bottom-[25%] right-0 h-[1px] w-[120%] opacity-25"
        style={{ animationDelay: "-6s", animationDuration: "16s" }}
      />

      {/* State spotlight — drifting orb */}
      <div
        className="absolute -top-[15%] -right-[10%] h-[75vh] w-[75vh] rounded-full blur-[100px] opacity-[0.28] transition-colors duration-1000"
        style={{
          background: "radial-gradient(circle, var(--realm-glow), transparent 60%)",
          animation: "orb-drift 26s ease-in-out infinite",
        }}
      />

      {/* Film grain texture */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "220px 220px",
        }}
      />
    </div>
  );
}

function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 3,
        height: 3,
        ...style,
      }}
    />
  );
}

function PhysicsParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <Particle
          key={i}
          style={{
            top: `${10 + ((i * 4.5) % 80)}%`,
            left: `${5 + ((i * 7.3) % 90)}%`,
            background: "var(--realm-accent)",
            opacity: 0.3 + (i % 3) * 0.15,
            boxShadow: "0 0 6px var(--realm-glow)",
            animation: `orb-drift ${18 + i * 2}s ease-in-out infinite`,
            animationDelay: `${-i * 1.5}s`,
          }}
        />
      ))}
      {/* Orbit ring */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 h-64 w-64 rounded-full opacity-[0.08]"
        style={{
          border: "1px solid var(--realm-accent)",
          animation: "orb-drift 40s linear infinite",
        }}
      />
    </div>
  );
}

function ChemistryParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + (i % 3) * 4,
            height: 6 + (i % 3) * 4,
            top: `${15 + ((i * 6) % 70)}%`,
            left: `${10 + ((i * 8) % 80)}%`,
            border: "1px solid var(--realm-accent)",
            opacity: 0.2,
            animation: `breathe ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${-i}s`,
          }}
        />
      ))}
    </div>
  );
}

function BiologyParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <Particle
          key={i}
          style={{
            width: 4,
            height: 4,
            top: `${20 + ((i * 5.5) % 60)}%`,
            left: `${8 + ((i * 9) % 85)}%`,
            background: "var(--realm-accent)",
            opacity: 0.4,
            boxShadow: "0 0 10px var(--realm-glow)",
            animation: `float-up ${6 + i}s ease-in-out infinite`,
            animationDelay: `${-i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

function MathParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute left-1/4 top-1/4 h-48 w-48 opacity-[0.06]"
        style={{
          background:
            "repeating-linear-gradient(0deg, var(--realm-accent) 0px, var(--realm-accent) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, var(--realm-accent) 0px, var(--realm-accent) 1px, transparent 1px, transparent 24px)",
        }}
      />
      {Array.from({ length: 8 }).map((_, i) => (
        <Particle
          key={i}
          style={{
            width: 5,
            height: 5,
            top: `${25 + ((i * 8) % 50)}%`,
            left: `${20 + ((i * 12) % 60)}%`,
            background: "var(--gold-soft)",
            opacity: 0.35,
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            animation: `subtle-scale ${5 + i}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

function HistoryParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          background:
            "repeating-linear-gradient(90deg, var(--realm-accent) 0px, transparent 1px, transparent 80px)",
        }}
      />
    </div>
  );
}

function HubParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 10 }).map((_, i) => (
        <Particle
          key={i}
          style={{
            top: `${12 + ((i * 8) % 75)}%`,
            left: `${6 + ((i * 11) % 88)}%`,
            background: i % 2 === 0 ? "var(--realm-accent)" : "var(--gold-soft)",
            opacity: 0.25,
            animation: `orb-drift ${22 + i * 3}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
