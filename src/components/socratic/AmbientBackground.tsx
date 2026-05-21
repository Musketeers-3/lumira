export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-700 ease-in-out"
      style={{
        background:
          'radial-gradient(ellipse at top, var(--ambient-via), var(--ambient-from) 50%, var(--ambient-to) 100%)',
      }}
    >
      <div
        className="absolute -top-1/3 -left-1/3 h-[80vh] w-[80vh] rounded-full blur-3xl opacity-60 transition-colors duration-700"
        style={{
          background: 'radial-gradient(circle, var(--state-glow), transparent 70%)',
          animation: 'orb-drift 14s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-1/3 -right-1/4 h-[70vh] w-[70vh] rounded-full blur-3xl opacity-40 transition-colors duration-700"
        style={{
          background: 'radial-gradient(circle, var(--state-glow), transparent 70%)',
          animation: 'orb-drift 18s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  );
}
