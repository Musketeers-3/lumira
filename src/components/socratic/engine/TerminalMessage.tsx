import type { Message } from "../types";

// Map intents directly to your global semantic tokens rather than arbitrary hex codes
const getIntentStyle = (intent: Message["intent"]) => {
  if (intent === "Believing Challenge") return { color: "var(--state-accent)" }; // Adapts to "CHALLENGE" state
  if (intent === "Light Found")
    return { color: "var(--gold-soft)", textShadow: "0 0 8px rgba(201,162,75,0.4)" };
  if (intent === "Gentle Push") return { color: "var(--ink-secondary)" };
  return { color: "var(--ink-tertiary)" };
};

export function TerminalMessage({ message }: { message: Message }) {
  const isMentor = message.speaker === "mentor";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>{isMentor ? "mentor@lumira:~$" : "you@lumira:~$"}</span>
        {isMentor && message.intent && (
          <span
            className="transition-all duration-700 font-semibold"
            style={getIntentStyle(message.intent)}
          >
            [{message.intent}]
          </span>
        )}
      </div>
      <p
        className={`mt-1.5 text-[15px] leading-relaxed ${
          isMentor ? "text-foreground" : "text-muted-foreground italic"
        }`}
        style={{ color: isMentor ? "var(--ink-primary)" : "var(--ink-secondary)" }}
      >
        {message.text}
      </p>
    </div>
  );
}
