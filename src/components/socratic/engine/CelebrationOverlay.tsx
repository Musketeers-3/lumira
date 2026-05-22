import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

export function CelebrationOverlay({ onClose }: { onClose: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play celebration sound (optional — uses Web Audio API if available)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;
      
      // Create a simple ascending tone sequence for celebration
      for (let i = 0; i < 3; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(440 * (1.2 ** i), now + i * 0.15);
        osc.frequency.exponentialRampToValueAtTime(550 * (1.2 ** i), now + i * 0.15 + 0.2);
        
        gain.gain.setValueAtTime(0.3, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.2);
        
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.2);
      }
    } catch {
      // Audio context not available, continue silently
    }

    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-500"
    >
      {/* Multi-layer particle system */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary spiral burst (18 particles) */}
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const dist = 200 + (i % 4) * 60;
          return (
            <span
              key={`primary-${i}`}
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

        {/* Secondary confetti-like particles (12 smaller, slower) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2 + Math.PI / 24;
          const dist = 140 + (i % 3) * 50;
          const delay = 0.08 + (i % 4) * 0.05;
          return (
            <span
              key={`secondary-${i}`}
              className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full"
              style={{
                background: i % 3 === 0 ? 'var(--state-glow)' : i % 3 === 1 ? '#fff8a3' : 'var(--state-accent)',
                boxShadow: '0 0 8px var(--state-glow)',
                ['--tx' as string]: `${Math.cos(angle) * dist}px`,
                ['--ty' as string]: `${Math.sin(angle) * dist}px`,
                animation: `particle-pop ${1.6 + (i % 3) * 0.3}s ease-out ${delay}s forwards`,
              }}
            />
          );
        })}

        {/* Tertiary shimmer particles (6 very subtle) */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2 + Math.PI / 12;
          const dist = 280 + (i % 2) * 40;
          return (
            <span
              key={`shimmer-${i}`}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full opacity-60"
              style={{
                background: 'oklch(0.90 0.12 95)',
                boxShadow: '0 0 6px oklch(0.90 0.12 95 / 0.8)',
                ['--tx' as string]: `${Math.cos(angle) * dist}px`,
                ['--ty' as string]: `${Math.sin(angle) * dist}px`,
                animation: `particle-pop ${1.8 + (i % 2) * 0.4}s ease-out ${0.2 + i * 0.06}s forwards`,
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
