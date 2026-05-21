import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export function CelebrationOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-500"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const dist = 200 + (i % 4) * 60;
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
              style={{
                background: i % 2 ? 'var(--state-accent)' : 'oklch(0.85 0.18 90)',
                boxShadow: '0 0 14px var(--state-glow)',
                ['--tx' as string]: `${Math.cos(angle) * dist}px`,
                ['--ty' as string]: `${Math.sin(angle) * dist}px`,
                animation: `particle-pop ${1.2 + (i % 5) * 0.2}s ease-out ${i * 0.04}s forwards`,
              }}
            />
          );
        })}
      </div>

      <div
        className="relative max-w-lg rounded-3xl border border-glass-border bg-[oklch(0.14_0.05_140/0.85)] p-10 text-center backdrop-blur-2xl animate-in zoom-in-95 duration-500"
        style={{ boxShadow: '0 0 120px var(--state-glow)' }}
      >
        <Sparkles
          className="mx-auto h-10 w-10"
          style={{ color: 'var(--state-accent)', filter: 'drop-shadow(0 0 12px var(--state-glow))' }}
          strokeWidth={1.5}
        />
        <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-state-accent">
          Breakthrough
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">
          You just independently invented the Binary Search Algorithm.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Halve the problem each step → solve any 1,000-page lookup in under 10 moves.
        </p>
        <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          tap anywhere to continue
        </div>
      </div>
    </div>
  );
}
