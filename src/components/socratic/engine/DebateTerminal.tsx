import { useEffect, useRef, useState } from "react";
import type { Message } from "../types";
import { TerminalMessage } from "./TerminalMessage";
import { MicButton } from "./MicButton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface Props {
  messages: Message[];
  stepIndex: number;
  totalSteps: number;
  isSpeaking: boolean;
}

export function DebateTerminal({ messages, stepIndex, totalSteps, isSpeaking }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [inputActive, setInputActive] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    // Auto-focus input when messages arrive and not speaking
    if (messages.length > 0 && !isSpeaking && inputRef.current) {
      inputRef.current.focus();
      setInputActive(true);
    }
  }, [messages.length, isSpeaking]);

  return (
    <div className="flex h-full min-h-[520px] flex-col gap-4">
      {/* Lesson card */}
      <div className="rounded-2xl border border-glass-border bg-white/[0.03] p-5 backdrop-blur-xl transition-colors duration-700">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Current Lesson
        </div>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">Physical Reasoning</h2>
        <p className="text-sm text-muted-foreground">Why Doesn't the Moon Fall to Earth?</p>
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
                      background: reached ? "var(--state-accent)" : "rgba(255,255,255,0.08)",
                      boxShadow: reached ? "0 0 12px var(--state-glow)" : "none",
                    }}
                    aria-label={`Step ${i + 1}`}
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-56 border-glass-border bg-[#1B1B28] backdrop-blur-xl">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Step {i + 1} / {totalSteps}
                  </div>
                  <div className="mt-1 text-sm">
                    {i === 0 && "Frame the puzzle."}
                    {i === 1 && "Throw the ball harder."}
                    {i === 2 && "Watch the Earth curve."}
                    {i === 3 && "Falling, always missing."}
                    {i === 4 && "Breakthrough — an orbit."}
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
        className="flex-1 overflow-y-auto rounded-2xl border border-glass-border bg-[#0B0B12]/85 p-5 backdrop-blur-xl transition-colors duration-700"
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
      <div
        className="flex items-center gap-3 rounded-2xl border border-glass-border bg-white/[0.03] p-3 backdrop-blur-xl transition-all duration-500"
        style={{
          boxShadow: inputActive ? "0 0 24px var(--state-glow)" : "none",
          borderColor: inputActive ? "var(--state-accent)" : "var(--border-glass)",
        }}
      >
        <MicButton active={isSpeaking} />
        <div
          ref={inputRef}
          onClick={() => setInputActive(true)}
          onBlur={() => setInputActive(false)}
          tabIndex={0}
          className="flex flex-1 items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-3 font-mono text-sm text-muted-foreground transition-all duration-500 cursor-text"
          style={{
            backgroundColor: inputActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
          }}
        >
          <span className="text-state-accent transition-colors duration-700">{">"}</span>
          <span className={inputActive ? "text-foreground" : ""}>
            type or speak your reasoning_
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-widest opacity-50 animate-pulse">
            ready
          </span>
        </div>
      </div>
    </div>
  );
}
