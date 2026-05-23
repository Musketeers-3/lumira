import type { Message } from "../types";

const intentColor = (intent: Message["intent"]) => {
  if (intent === "Believing Challenge") return "text-[oklch(0.82_0.16_60)]";
  if (intent === "Light Found") return "text-[oklch(0.88_0.18_95)]";
  if (intent === "Gentle Push") return "text-state-accent";
  return "text-muted-foreground";
};

export function TerminalMessage({ message }: { message: Message }) {
  const isMentor = message.speaker === "mentor";
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>{isMentor ? "mentor@lumira:~$" : "you@lumira:~$"}</span>
        {isMentor && (
          <span className={`transition-colors duration-700 ${intentColor(message.intent)}`}>
            [{message.intent}]
          </span>
        )}
      </div>
      <p
        className={`mt-1.5 text-[15px] leading-relaxed ${
          isMentor ? "text-foreground" : "text-muted-foreground italic"
        }`}
      >
        {message.text}
      </p>
    </div>
  );
}
