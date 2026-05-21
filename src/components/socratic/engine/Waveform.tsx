interface Props { active: boolean }
export function Waveform({ active }: Props) {
  return (
    <div className="flex h-12 items-center justify-center gap-[3px]">
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full transition-colors duration-700"
          style={{
            background: 'var(--state-accent)',
            opacity: active ? 0.9 : 0.25,
            height: active ? `${20 + Math.abs(Math.sin(i * 0.6)) * 28}px` : '8px',
            animation: active
              ? `wave ${0.6 + (i % 5) * 0.15}s ease-in-out ${i * 0.04}s infinite`
              : undefined,
            transition: 'height 400ms ease, opacity 400ms ease',
          }}
        />
      ))}
    </div>
  );
}
