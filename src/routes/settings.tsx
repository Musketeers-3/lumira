import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useLearningState } from '@/lib/learning-state-context';

export const Route = createFileRoute('/settings')({
  head: () => ({
    meta: [
      { title: 'Settings — Lumira' },
      { name: 'description', content: 'Tune the warmth, motion, and presence of your learning companion.' },
      { property: 'og:title', content: 'Settings — Lumira' },
      { property: 'og:description', content: 'Tune the warmth, motion, and presence of your learning companion.' },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { setState } = useLearningState();
  const navigate = useNavigate();
  const [voice, setVoice] = useState(true);
  const [motion, setMotion] = useState(70);
  const [warmth, setWarmth] = useState(60);
  const [preview, setPreview] = useState<'IDLE' | 'FOCUS' | 'CHALLENGE' | 'CELEBRATE'>('IDLE');

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-state-accent transition-colors duration-700">
          lumira // preferences
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl">Settings</h1>
      </header>

      <section className="rounded-2xl border border-glass-border bg-white/[0.03] p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold tracking-tight">Feel each state</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The whole environment shifts with your mentor's presence.
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
          <p className="text-sm text-muted-foreground">A soft tone when the mentor speaks to you.</p>
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
        <h2 className="text-lg font-semibold tracking-tight">Mentor warmth</h2>
        <p className="mt-1 text-sm text-muted-foreground">How softly they encourage you when you're stuck.</p>
        <div className="mt-4">
          <input
            type="range" min={0} max={100} value={warmth}
            onChange={(e) => setWarmth(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>direct</span><span>{warmth}%</span><span>gentle</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-glass-border bg-white/[0.03] p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold tracking-tight">Motion intensity</h2>
        <div className="mt-4">
          <input
            type="range" min={0} max={100} value={motion}
            onChange={(e) => setMotion(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>still</span><span>{motion}%</span><span>cinematic</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-glass-border bg-white/[0.03] p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold tracking-tight">Walk it again</h2>
        <p className="mt-1 text-sm text-muted-foreground">Replay the Dictionary Puzzle from the beginning.</p>
        <button
          onClick={() => { setState('IDLE'); navigate({ to: '/engine' }); }}
          className="mt-4 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-500"
          style={{ background: 'var(--state-accent)', color: 'oklch(0.12 0.02 270)', boxShadow: '0 0 24px var(--state-glow)' }}
        >
          Walk it again
        </button>
      </section>

      <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Lumira // v0.1 // walking with you
      </p>
    </div>
  );
}
