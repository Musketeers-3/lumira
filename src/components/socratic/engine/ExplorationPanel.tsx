import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Volume2, VolumeX } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import type { Message } from "../types";
import { TerminalMessage } from "./TerminalMessage";
import { MicButton } from "./MicButton";
import { QUEST_BEATS } from "@/lib/realms";
import { useRealmAudio } from "@/lib/useRealmAudio";

type MentorIntent = "Gentle Push" | "Believing Challenge" | "Light Found";

interface Props {
  messages: Message[];
  stepIndex: number;
  isSpeaking: boolean;
  onSubmitAnswer?: (answer: string, intent?: MentorIntent) => Promise<void>;
  isLoading?: boolean;
  topic?: string;
  explorationHint?: string | null;
}

const INTENT_OPTIONS: { value: MentorIntent; label: string }[] = [
  { value: "Gentle Push", label: "Give me a hint" },
  { value: "Believing Challenge", label: "Challenge me" },
  { value: "Light Found", label: "I think I found it!" },
];

export function ExplorationPanel({
  messages,
  stepIndex,
  isSpeaking,
  onSubmitAnswer,
  isLoading = false,
  topic = "Exploration",
  explorationHint,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputActive, setInputActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextIntent, setNextIntent] = useState<MentorIntent>("Gentle Push");
  const { muted, toggleMute } = useRealmAudio();

  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechRecognition({ language: "en-US", interimResults: true });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, explorationHint]);

  useEffect(() => {
    if (isListening && transcript) setInputValue(transcript);
  }, [transcript, isListening]);

  const handleSubmit = async () => {
    const answer = inputValue.trim();
    if (!answer || isSubmitting || isLoading) return;
    if (isListening) stopListening();
    setIsSubmitting(true);
    try {
      await onSubmitAnswer?.(answer, nextIntent);
      setInputValue("");
      resetTranscript();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMicToggle = () => {
    if (!isSupported) {
      toast.error("Voice input isn't supported in this browser.");
      return;
    }
    if (isListening) stopListening();
    else {
      setInputValue("");
      resetTranscript();
      startListening();
    }
  };

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl backdrop-blur-xl p-4 lg:p-5"
      style={{
        background: "linear-gradient(180deg, rgba(7,7,14,0.92) 0%, rgba(11,11,20,0.88) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 0 40px rgba(0,0,0,0.35), 0 0 60px var(--realm-glow)",
      }}
    >
      {/* Quest arc + topic */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <div
            className="text-[10px] uppercase tracking-[0.2em] font-medium"
            style={{ color: "var(--realm-accent)" }}
          >
            {topic}
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            {QUEST_BEATS.map((beat, i) => (
              <div
                key={beat.label}
                className="h-1.5 flex-1 rounded-full transition-all duration-500"
                style={{
                  background:
                    i <= stepIndex
                      ? i === stepIndex
                        ? "var(--realm-accent)"
                        : "var(--gold-soft)"
                      : "rgba(255,255,255,0.08)",
                  boxShadow: i === stepIndex ? "0 0 10px var(--realm-glow)" : "none",
                }}
                title={beat.label}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={toggleMute}
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--hairline)" }}
          aria-label={muted ? "Enable ambient sound" : "Mute ambient sound"}
          title={muted ? "Enable ambient sound" : "Mute ambient sound"}
        >
          {muted ? (
            <VolumeX className="h-3.5 w-3.5" style={{ color: "var(--ink-tertiary)" }} />
          ) : (
            <Volume2 className="h-3.5 w-3.5" style={{ color: "var(--realm-accent)" }} />
          )}
        </button>
      </div>

      {/* Exploration hint from clicked object */}
      {explorationHint && (
        <div
          className="shrink-0 rounded-xl px-3 py-2 text-sm font-display italic animate-in fade-in slide-in-from-bottom-1 duration-300"
          style={{
            background: "var(--realm-glow)",
            border: "1px solid var(--realm-accent)",
            color: "var(--ink-primary)",
          }}
        >
          ✦ {explorationHint}
        </div>
      )}

      {/* Dialogue */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-[80px] max-h-[140px] space-y-3 pr-1"
      >
        {messages.length === 0 ? (
          <p
            className="text-sm font-display italic text-center py-4"
            style={{ color: "var(--ink-tertiary)" }}
          >
            Tap objects in the world, or share your first thought below.
          </p>
        ) : (
          messages.slice(-4).map((m) => <TerminalMessage key={m.id} message={m} />)
        )}
      </div>

      {/* Tone chips */}
      <div className="flex flex-wrap gap-1.5 shrink-0">
        {INTENT_OPTIONS.map((opt) => {
          const active = nextIntent === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setNextIntent(opt.value)}
              className="rounded-full px-3 py-1 text-[11px] font-medium transition-all"
              style={{
                border: `1px solid ${active ? "var(--realm-accent)" : "rgba(255,255,255,0.1)"}`,
                background: active ? "var(--realm-glow)" : "transparent",
                color: active ? "var(--realm-accent)" : "var(--ink-tertiary)",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 shrink-0 rounded-xl p-2 transition-all"
        style={{
          border: inputActive
            ? "1px solid var(--realm-accent)"
            : "1px solid rgba(255,255,255,0.08)",
          background: "rgba(0,0,0,0.3)",
          boxShadow: inputActive ? "0 0 20px var(--realm-glow)" : "none",
        }}
      >
        <MicButton
          active={isListening || isSpeaking}
          onClick={handleMicToggle}
          disabled={isSubmitting || isLoading}
        />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSubmit())
          }
          onFocus={() => setInputActive(true)}
          onBlur={() => setInputActive(false)}
          placeholder="Share your thinking..."
          disabled={isSubmitting || isLoading}
          className="flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
          style={{ color: "var(--ink-primary)" }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isSubmitting || isLoading}
          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-40"
          style={{ background: "var(--realm-accent)", color: "#0B0B12" }}
        >
          Share
        </button>
      </div>
    </div>
  );
}
