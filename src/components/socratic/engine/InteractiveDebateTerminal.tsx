import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import type { Message } from "../types";
import { TerminalMessage } from "./TerminalMessage";
import { MicButton } from "./MicButton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type MentorIntent = "Gentle Push" | "Believing Challenge" | "Light Found";

interface Props {
  messages: Message[];
  stepIndex: number;
  totalSteps: number;
  isSpeaking: boolean;
  onSubmitAnswer?: (answer: string, intent?: MentorIntent) => Promise<void>;
  isLoading?: boolean;
  enableAI?: boolean; // Flag to enable real AI or keep demo
}

const INTENT_OPTIONS: { value: MentorIntent; label: string; hint: string }[] = [
  { value: "Gentle Push", label: "Gentle Push", hint: "Nudge me forward" },
  { value: "Believing Challenge", label: "Believing Challenge", hint: "Press my thinking" },
  { value: "Light Found", label: "Light Found", hint: "Celebrate the insight" },
];

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
  const [nextIntent, setNextIntent] = useState<MentorIntent>("Gentle Push");

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
        await onSubmitAnswer(answer, nextIntent);
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
    if (!isSupported) {
      toast.error("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      setInputValue("");
      resetTranscript();
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
      <div className="surface-luxe p-5 transition-colors duration-700">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.25em] relative z-10"
          style={{ color: "var(--gold-soft)" }}
        >
          Current Lesson
        </div>
        <h2
          className="mt-1 text-lg font-semibold tracking-tight relative z-10"
          style={{ color: "#F5F1E6" }}
        >
          Computational Thinking
        </h2>
        <p className="text-sm relative z-10" style={{ color: "rgba(245,241,230,0.6)" }}>
          The Dictionary Puzzle
        </p>
        <div className="mt-4 flex items-center gap-2 relative z-10">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const reached = i <= stepIndex;
            return (
              <HoverCard key={i} openDelay={120}>
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    className="h-2 flex-1 rounded-full transition-all duration-500"
                    style={{
                      background: reached
                        ? "linear-gradient(90deg, var(--state-accent), var(--gold-soft))"
                        : "rgba(245,241,230,0.06)",
                      boxShadow: reached ? "0 0 12px var(--state-glow)" : "none",
                    }}
                    aria-label={`Step ${i + 1}`}
                  />
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-56 backdrop-blur-xl"
                  style={{
                    background: "linear-gradient(180deg, #1B1B28 0%, #0E0E18 100%)",
                    border: "1px solid rgba(201,162,75,0.25)",
                    boxShadow: "var(--shadow-deep), var(--inset-highlight)",
                  }}
                >
                  <div
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: "var(--gold-soft)" }}
                  >
                    Step {i + 1} / {totalSteps}
                  </div>
                  <div className="mt-1 text-sm" style={{ color: "#F5F1E6" }}>
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

      {/* Intent selector */}
      <div className="rounded-2xl border border-glass-border bg-white/[0.03] p-3 backdrop-blur-xl">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Ask Lumira to respond with…
        </div>
        <div className="flex flex-wrap gap-2">
          {INTENT_OPTIONS.map((opt) => {
            const active = nextIntent === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setNextIntent(opt.value)}
                aria-pressed={active}
                title={opt.hint}
                className="rounded-full border px-3 py-1.5 text-xs font-medium tracking-wide transition-all duration-300"
                style={{
                  borderColor: active ? "var(--state-accent)" : "var(--border-glass)",
                  background: active
                    ? "color-mix(in oklab, var(--state-accent) 18%, transparent)"
                    : "rgba(255,255,255,0.03)",
                  color: active ? "var(--state-accent)" : "rgb(var(--muted-foreground) / 1)",
                  boxShadow: active ? "0 0 14px var(--state-glow)" : "none",
                }}
              >
                {opt.label}
                <span className="ml-2 opacity-60">{opt.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input dock */}
      <div
        className="flex items-center gap-3 rounded-2xl border border-glass-border bg-white/[0.03] p-3 backdrop-blur-xl transition-all duration-500"
        style={{
          boxShadow: inputActive ? "0 0 24px var(--state-glow)" : "none",
          borderColor: inputActive ? "var(--state-accent)" : "var(--border-glass)",
        }}
      >
        {/* FIXED: Removed outer button to prevent HTML nesting hydration error */}
        <div className="flex-shrink-0">
          <MicButton
            active={isListening || isSpeaking}
            onClick={handleMicToggle}
            disabled={isSubmitting || isLoading}
          />
        </div>

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
