import { ChevronLeft, ChevronRight, RotateCcw, Play } from "lucide-react";

interface Props {
  stepIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  started: boolean;
}

export function StepperBar({ stepIndex, total, onPrev, onNext, onReset, started }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-glass-border bg-white/[0.03] px-4 py-3 backdrop-blur-xl transition-colors duration-700">
      <div className="flex items-center gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          demo
        </div>
        <div className="font-mono text-sm">
          <span className="text-state-accent transition-colors duration-700">
            {String(started ? stepIndex + 1 : 0).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground"> / {String(total).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-glass-border bg-white/[0.03] px-3 py-1.5 text-xs text-muted-foreground transition-all duration-300 hover:bg-white/[0.06] hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
          Reset
        </button>
        <button
          onClick={onPrev}
          disabled={!started || stepIndex === 0}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-glass-border bg-white/[0.03] text-muted-foreground transition-all duration-300 hover:bg-white/[0.06] hover:text-foreground disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500"
          style={{
            background: "var(--state-accent)",
            color: "oklch(0.12 0.02 270)",
            boxShadow: "0 0 24px var(--state-glow)",
          }}
        >
          {!started ? <Play className="h-3.5 w-3.5" /> : <ChevronRight className="h-4 w-4" />}
          {!started ? "Begin" : stepIndex === total - 1 ? "Replay" : "Next"}
        </button>
      </div>
    </div>
  );
}
