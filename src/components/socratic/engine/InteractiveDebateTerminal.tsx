import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import type { Message } from "../types";
import { TerminalMessage } from "./TerminalMessage";
import { MicButton } from "./MicButton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface Props {
  messages: Message[];
  stepIndex: number;
  totalSteps: number;
  isSpeaking: boolean;
  onSubmitAnswer?: (answer: string) => Promise<void>;
  isLoading?: boolean;
  enableAI?: boolean; // Flag to enable real AI or keep demo
}

export function InteractiveDebateTerminal({
  messages,
  stepIndex,
  totalSteps,
  isSpeaking,
  onSubmitAnswer,
  isLoading = false,
  enableAI = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputActive, setInputActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechRecognition({
      language: "en-US",
      interimResults: true,
    });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    // Auto-focus input when messages arrive and not speaking
    if (messages.length > 0 && !isSpeaking && !isListening && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setInputActive(true);
    }
  }, [messages.length, isSpeaking, isListening]);

  // Sync speech transcript to input
  useEffect(() => {
    if (isListening && transcript) {
      setInputValue(transcript);
    }
  }, [transcript, isListening]);

  const handleSubmit = async () => {
    const answer = inputValue.trim();
    if (!answer || isSubmitting || isLoading) return;

    if (isListening) stopListening();
    setIsSubmitting(true);

    try {
      if (onSubmitAnswer) {
        await onSubmitAnswer(answer);
      }
      setInputValue("");
      resetTranscript();
    } catch (error) {
      console.error("[Submit Answer Error]", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-full min-h-[520px] flex-col gap-4">
      {/* Lesson card */}
      <div className="rounded-2xl border border-glass-border bg-white/[0.03] p-5 backdrop-blur-xl transition-colors duration-700">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Current Lesson
        </div>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">Computational Thinking</h2>
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
                      background: reached ? "var(--state-accent)" : "rgba(255,255,255,0.08)",
                      boxShadow: reached ? "0 0 12px var(--state-glow)" : "none",
                    }}
                    aria-label={`Step ${i + 1}`}
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-56 border-glass-border bg-[oklch(0.14_0.03_270/0.95)] backdrop-blur-xl">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Step {i + 1} / {totalSteps}
                  </div>
                  <div className="mt-1 text-sm">
                    {i === 0 && "Frame the problem."}
                    {i === 1 && "Challenge the linear approach."}
                    {i === 2 && "Discover halving."}
                    {i === 3 && "Realize elimination."}
                    {i === 4 && "Breakthrough — Binary Search."}
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
      <div
        className="flex items-center gap-3 rounded-2xl border border-glass-border bg-white/[0.03] p-3 backdrop-blur-xl transition-all duration-500"
        style={{
          boxShadow: inputActive ? "0 0 24px var(--state-glow)" : "none",
          borderColor: inputActive ? "var(--state-accent)" : "var(--border-glass)",
        }}
      >
        <button
          type="button"
          onClick={handleMicToggle}
          disabled={isSubmitting || isLoading}
          className="flex-shrink-0"
          aria-label="Toggle microphone"
        >
          <MicButton active={isListening || isSpeaking} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setInputActive(true)}
          onBlur={() => setInputActive(false)}
          placeholder="type or speak your reasoning_"
          disabled={isSubmitting || isLoading}
          className="flex flex-1 items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-3 font-mono text-sm text-muted-foreground placeholder-muted-foreground outline-none transition-all duration-500 disabled:opacity-50"
          style={{
            backgroundColor: inputActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isSubmitting || isLoading}
          className="flex-shrink-0 text-state-accent hover:drop-shadow-[0_0_8px_var(--state-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Submit answer"
        >
          <svg
            className="h-5 w-5 transition-transform hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7m0 0l-7 7m7-7H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
