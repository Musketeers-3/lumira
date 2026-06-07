import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import type { Message } from "../types";
import { TerminalMessage } from "./TerminalMessage";
import { MicButton } from "./MicButton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { QUEST_BEATS } from "@/lib/realms";

type MentorIntent = "Gentle Push" | "Believing Challenge" | "Light Found";

interface Props {
  messages: Message[];
  stepIndex: number;
  totalSteps: number;
  isSpeaking: boolean;
  onSubmitAnswer?: (answer: string, intent?: MentorIntent) => Promise<void>;
  isLoading?: boolean;
  enableAI?: boolean;
  topic?: string;
  lessonTitle?: string;
}

const INTENT_OPTIONS: { value: MentorIntent; label: string; hint: string }[] = [
  { value: "Gentle Push", label: "Give me a hint", hint: "Nudge forward" },
  { value: "Believing Challenge", label: "Challenge me", hint: "Push my thinking" },
  { value: "Light Found", label: "I think I found it!", hint: "Share a discovery" },
];

export function InteractiveDebateTerminal({
  messages,
  stepIndex,
  totalSteps: _totalSteps,
  isSpeaking,
  onSubmitAnswer,
  isLoading = false,
  enableAI = false,
  topic = "Exploration",
  lessonTitle = "Active Adventure",
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
    if (messages.length > 0 && !isSpeaking && !isListening && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setInputActive(true);
    }
  }, [messages.length, isSpeaking, isListening]);

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
      {/* Quest context card */}
      <div className="surface-luxe p-5 transition-colors duration-700">
        <div
          className="text-xs font-medium uppercase tracking-[0.2em] relative z-10"
          style={{ color: "var(--realm-accent)" }}
        >
          You are exploring
        </div>
        <h2
          className="mt-1 text-lg font-semibold tracking-tight relative z-10 font-display"
          style={{ color: "var(--ink-primary)" }}
        >
          {topic}
        </h2>
        <p className="text-sm relative z-10" style={{ color: "var(--ink-secondary)" }}>
          {lessonTitle}
        </p>

        {/* Quest arc */}
        <div className="mt-4 flex items-center gap-1.5 relative z-10">
          {QUEST_BEATS.map((beat, i) => {
            const reached = i <= stepIndex;
            const active = i === stepIndex;
            return (
              <HoverCard key={beat.label} openDelay={120}>
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    className="flex flex-col items-center flex-1 gap-1 transition-all duration-500"
                    aria-label={beat.label}
                  >
                    <div
                      className="h-2.5 w-2.5 rounded-full transition-all duration-500"
                      style={{
                        background: reached
                          ? active
                            ? "var(--realm-accent)"
                            : "var(--gold-soft)"
                          : "rgba(255,255,255,0.08)",
                        boxShadow: active
                          ? "0 0 14px var(--realm-glow)"
                          : reached
                            ? "0 0 8px var(--realm-glow)"
                            : "none",
                        transform: active ? "scale(1.3)" : "scale(1)",
                      }}
                    />
                    <span
                      className="text-[9px] font-medium uppercase tracking-wider hidden sm:block"
                      style={{ color: active ? "var(--realm-accent)" : "var(--ink-tertiary)" }}
                    >
                      {beat.label}
                    </span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-52 backdrop-blur-xl"
                  style={{
                    background: "linear-gradient(180deg, #1B1B28 0%, #0E0E18 100%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="text-xs font-medium" style={{ color: "var(--realm-accent)" }}>
                    {beat.label}
                  </div>
                  <div className="mt-1 text-sm" style={{ color: "var(--ink-primary)" }}>
                    {beat.hint}
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>

      {/* Dialogue feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-2xl p-5 backdrop-blur-xl transition-colors duration-700 relative"
        style={{
          background: "linear-gradient(180deg, rgba(11,11,24,0.85) 0%, rgba(7,7,14,0.7) 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 40px -16px rgba(0,0,0,0.6)",
        }}
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center px-6">
            <div
              className="text-3xl animate-pulse"
              style={{ animation: "discovery-pulse 2s ease-in-out infinite" }}
            >
              ✦
            </div>
            <p className="font-display italic text-base" style={{ color: "var(--ink-secondary)" }}>
              Your mentor is ready. Share your first thought when the moment feels right.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((m) => (
              <TerminalMessage key={m.id} message={m} />
            ))}
          </div>
        )}
      </div>

      {/* Mentor tone chips */}
      <div className="surface-luxe p-3.5">
        <div
          className="mb-2 text-xs font-medium relative z-10"
          style={{ color: "var(--ink-tertiary)" }}
        >
          How should your mentor respond?
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          {INTENT_OPTIONS.map((opt) => {
            const active = nextIntent === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setNextIntent(opt.value)}
                aria-pressed={active}
                title={opt.hint}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all duration-300"
                style={{
                  border: active
                    ? "1px solid var(--realm-accent)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: active ? "var(--realm-glow)" : "rgba(255,255,255,0.03)",
                  color: active ? "var(--realm-accent)" : "var(--ink-secondary)",
                  boxShadow: active ? "0 0 18px var(--realm-glow)" : "none",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Thought input */}
      <div
        className="flex items-center gap-3 rounded-2xl p-3 backdrop-blur-xl transition-all duration-500"
        style={{
          background: "linear-gradient(180deg, #1B1B28 0%, #13131C 100%)",
          border: inputActive
            ? "1px solid var(--realm-accent)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: inputActive
            ? "0 0 28px var(--realm-glow), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
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
          placeholder="Share your thinking..."
          disabled={isSubmitting || isLoading}
          className="flex flex-1 items-center gap-2 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-500 disabled:opacity-50"
          style={{
            background: inputActive ? "rgba(7,7,12,0.7)" : "rgba(7,7,12,0.5)",
            color: "var(--ink-primary)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isSubmitting || isLoading}
          className="flex-shrink-0 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: "var(--realm-accent)", filter: "drop-shadow(0 0 6px var(--realm-glow))" }}
          aria-label="Share thought"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
