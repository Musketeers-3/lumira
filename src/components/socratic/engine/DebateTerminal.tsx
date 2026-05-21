import { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { TerminalMessage } from './TerminalMessage';
import { MicButton } from './MicButton';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface Props {
  messages: Message[];
  stepIndex: number;
  totalSteps: number;
  isSpeaking: boolean;
}

export function DebateTerminal({ messages, stepIndex, totalSteps, isSpeaking }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex h-full min-h-[520px] flex-col gap-4">
      {/* Lesson card */}
      <div className="rounded-2xl border border-glass-border bg-white/[0.03] p-5 backdrop-blur-xl transition-colors duration-700">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Current Lesson
        </div>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">
          Computational Thinking
        </h2>
        <p className="text-sm text-muted-foreground">The Dictionary Puzzle</p>
        <div className="mt-4 flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const reached = i <= stepIndex;
            return (
              <HoverCard key={i} openDelay={120}>
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    className="h-2 flex-1 rounded-full transition-all duration-500"
                    style={{
                      background: reached ? 'var(--state-accent)' : 'rgba(255,255,255,0.08)',
                      boxShadow: reached ? '0 0 12px var(--state-glow)' : 'none',
                    }}
                    aria-label={`Step ${i + 1}`}
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-56 border-glass-border bg-[oklch(0.14_0.03_270/0.95)] backdrop-blur-xl">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Step {i + 1} / {totalSteps}
                  </div>
                  <div className="mt-1 text-sm">
                    {i === 0 && 'Frame the problem.'}
                    {i === 1 && 'Challenge the linear approach.'}
                    {i === 2 && 'Discover halving.'}
                    {i === 3 && 'Realize elimination.'}
                    {i === 4 && 'Breakthrough — Binary Search.'}
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>

      {/* Terminal feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-2xl border border-glass-border bg-[oklch(0.10_0.02_270/0.55)] p-5 backdrop-blur-xl transition-colors duration-700"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            // session idle — press start
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((m) => (
              <TerminalMessage key={m.id} message={m} />
            ))}
          </div>
        )}
      </div>

      {/* Input dock */}
      <div className="flex items-center gap-3 rounded-2xl border border-glass-border bg-white/[0.03] p-3 backdrop-blur-xl transition-colors duration-700">
        <MicButton active={isSpeaking} />
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-3 font-mono text-sm text-muted-foreground">
          <span className="text-state-accent transition-colors duration-700">{'>'}</span>
          <span>type or speak your reasoning_</span>
          <span className="ml-auto text-[10px] uppercase tracking-widest opacity-50">demo</span>
        </div>
      </div>
    </div>
  );
}
