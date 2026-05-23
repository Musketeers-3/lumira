interface Props {
  active: boolean;
}

/** Subtle presence indicator — not a VTuber equalizer. */
export function Waveform({ active }: Props) {
  const bars = 5;
  return (
    <div className="flex h-10 items-end justify-center gap-2">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-1 rounded-full transition-all duration-700"
          style={{
            background: "var(--state-accent)",
            opacity: active ? 0.55 + (i % 2) * 0.15 : 0.2,
            height: active ? `${10 + (i % 3) * 6}px` : "6px",
            animation: active
              ? `wave ${1.4 + i * 0.2}s ease-in-out ${i * 0.12}s infinite`
              : "breathe 3s ease-in-out infinite",
          }}
        />
      ))}
    </div>
  );
}
