import type { Message } from '../types';

const intentColor = (intent: Message['intent']) => {
  if (intent === 'Socratic Challenge') return 'text-[oklch(0.78_0.18_25)]';
  if (intent === 'Breakthrough') return 'text-[oklch(0.85_0.18_140)]';
  if (intent === 'Socratic Nudge') return 'text-state-accent';
  return 'text-muted-foreground';
};

export function TerminalMessage({ message }: { message: Message }) {
  const isMentor = message.speaker === 'mentor';
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>{isMentor ? 'mentor@socratic:~$' : 'student@local:~$'}</span>
        {isMentor && (
          <span className={`transition-colors duration-700 ${intentColor(message.intent)}`}>
            [{message.intent}]
          </span>
        )}
      </div>
      <p
        className={`mt-1.5 text-[15px] leading-relaxed ${
          isMentor ? 'text-foreground' : 'text-muted-foreground italic'
        }`}
      >
        {message.text}
      </p>
    </div>
  );
}
