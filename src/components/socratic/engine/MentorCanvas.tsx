import type { LearningState } from '../types';
import { MentorAvatar } from './MentorAvatar';
import { Waveform } from './Waveform';

const tagFor = (s: LearningState) =>
  s === 'IDLE' ? 'Awaiting Input'
  : s === 'FOCUS' ? 'Listening Intently'
  : s === 'CHALLENGE' ? 'Challenging Premise'
  : 'Breakthrough Detected';

interface Props { state: LearningState; isSpeaking: boolean }

export function MentorCanvas({ state, isSpeaking }: Props) {
  return (
    <div
      className="relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl border border-glass-border bg-white/[0.03] p-6 backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-700 ease-in-out"
      style={{ boxShadow: '0 0 80px -10px var(--state-glow), inset 0 1px 0 rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-700">
          <span
            className="h-2 w-2 animate-pulse rounded-full"
            style={{ background: 'var(--state-accent)', boxShadow: '0 0 12px var(--state-glow)' }}
          />
          <span>AI Status:</span>
          <span className="text-state-accent transition-colors duration-700">{tagFor(state)}</span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          mentor.canvas
        </div>
      </div>

      <div className="my-2 flex flex-1 items-center justify-center">
        <div className="h-[320px] w-[320px]">
          <MentorAvatar state={state} isSpeaking={isSpeaking} />
        </div>
      </div>

      <Waveform active={isSpeaking} />
    </div>
  );
}
