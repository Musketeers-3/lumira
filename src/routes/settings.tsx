import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useLearningState } from '@/lib/learning-state-context';

export const Route = createFileRoute('/settings')({
  head: () => ({
    meta: [
      { title: 'Settings — The Socratic Engine' },
      { name: 'description', content: 'Tune the ambient OS — accent, motion, voice.' },
      { property: 'og:title', content: 'Settings — The Socratic Engine' },
      { property: 'og:description', content: 'Tune the ambient OS — accent, motion, voice.' },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { setState } = useLearningState();
  const navigate = useNavigate();
  const [voice, setVoice] = useState(true);
  const [motion, setMotion] = useState(70);
  const [preview, setPreview] = useState<'IDLE' | 'FOCUS' | 'CHALLENGE' | 'CELEBRATE'>('IDLE');

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-state-accent transition-colors duration-700">
          ambient os // preferences
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl">Settings</h1>
      </header>

      <section className="rounded-2xl border border-glass-border bg-white/[0.03] p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold tracking-tight">State preview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Feel each ambient theme. The entire OS shifts color.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          {(['IDLE', 'FOCUS', 'CHALLENGE', 'CELEBRATE'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setPreview(s); setState(s); }}
              className={`rounded-xl border px-3 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-500 ${
                preview === s ? 'border-state-accent text-foreground' : 'border-glass-border text-muted-foreground hover:text-foreground'
              }`}
              style={preview === s ? { boxShadow: '0 0 24px var(--state-glow)' } : undefined}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-glass-border bg-white/[0.03] p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold tracking-tight">Mentor voice</h2>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Audible feedback when the mentor speaks.</p>
          <button
            onClick={() => setVoice((v) => !v)}
            className="relative h-7 w-12 rounded-full transition-colors duration-500"
            style={{ background: voice ? 'var(--state-accent)' : 'rgba(255,255,255,0.1)' }}
          >
            <span
              className="absolute top-1 h-5 w-5 rounded-full bg-white transition-transform duration-300"
              style={{ transform: voice ? 'translateX(22px)' : 'translateX(4px)' }}
            />
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-glass-border bg-white/[0.03] p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold tracking-tight">Motion intensity</h2>
        <div className="mt-4">
          <input
            type="range" min={0} max={100} value={motion}
            onChange={(e) => setMotion(Number(e.target.value))}
            className="w-full accent-[oklch(0.72_0.18_270)]"
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>still</span><span>{motion}%</span><span>cinematic</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-glass-border bg-white/[0.03] p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold tracking-tight">Demo</h2>
        <p className="mt-1 text-sm text-muted-foreground">Replay the Binary Search Socratic from step 1.</p>
        <button
          onClick={() => { setState('IDLE'); navigate({ to: '/engine' }); }}
          className="mt-4 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-500"
          style={{ background: 'var(--state-accent)', color: 'oklch(0.12 0.02 270)', boxShadow: '0 0 24px var(--state-glow)' }}
        >
          Replay demo
        </button>
      </section>

      <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        The Socratic Engine // v0.1 // ambient build
      </p>
    </div>
  );
}
