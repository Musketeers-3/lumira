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
    <div
      className="surface-luxe flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-700"
    >
      <div className="flex items-center gap-3 relative z-10">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "var(--gold-soft)" }}
        >
          demo
        </div>
        <div className="font-mono text-sm">
          <span
            className="transition-colors duration-700 text-gold"
          >
            {String(started ? stepIndex + 1 : 0).padStart(2, "0")}
          </span>
          <span style={{ color: "rgba(245,241,230,0.4)" }}> / {String(total).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 relative z-10">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all duration-300"
          style={{
            background: "rgba(245,241,230,0.03)",
            border: "1px solid rgba(245,241,230,0.08)",
            color: "rgba(245,241,230,0.6)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
          Reset
        </button>
        <button
          onClick={onPrev}
          disabled={!started || stepIndex === 0}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 disabled:opacity-30"
          style={{
            background: "rgba(245,241,230,0.03)",
            border: "1px solid rgba(245,241,230,0.08)",
            color: "rgba(245,241,230,0.6)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={onNext}
          className="btn-state flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold tracking-wide"
        >
          {!started ? <Play className="h-3.5 w-3.5" /> : <ChevronRight className="h-4 w-4" />}
          {!started ? "Begin" : stepIndex === total - 1 ? "Replay" : "Next"}
        </button>
      </div>
    </div>
  );
}
