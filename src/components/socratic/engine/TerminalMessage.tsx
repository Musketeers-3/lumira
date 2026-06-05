import type { Message } from "../types";

const INTENT_LABELS: Record<string, string> = {
  "Gentle Push": "A gentle nudge",
  "Believing Challenge": "Believing in you",
  "Light Found": "A discovery!",
};

export function TerminalMessage({ message }: { message: Message }) {
  const isMentor = message.speaker === "mentor";

  return (
    <div
      className={`animate-in fade-in slide-in-from-bottom-2 duration-500 flex ${isMentor ? "justify-start" : "justify-end"}`}
    >
      <div className={`max-w-[90%] space-y-1.5 ${isMentor ? "" : "text-right"}`}>
        <div
          className="text-xs font-medium tracking-wide"
          style={{ color: isMentor ? "var(--realm-accent)" : "var(--ink-tertiary)" }}
        >
          {isMentor ? "Your Mentor" : "You"}
          {isMentor && message.intent && message.intent !== "You" && (
            <span className="ml-2 opacity-70">
              · {INTENT_LABELS[message.intent] ?? message.intent}
            </span>
          )}
        </div>
        <div className={isMentor ? "dialogue-mentor" : "dialogue-student"}>
          <p
            className={`px-4 py-3 text-[15px] leading-relaxed ${isMentor ? "font-display" : "italic"}`}
            style={{ color: isMentor ? "var(--ink-primary)" : "var(--ink-secondary)" }}
          >
            {message.text}
          </p>
        </div>
      </div>
    </div>
  );
}
