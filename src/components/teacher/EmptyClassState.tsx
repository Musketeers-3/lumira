/**
 * Empty Class State Component
 * Observatory-themed onboarding when teacher has no classes
 */

import { memo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Telescope, Sparkles, Plus, Eye, Lightbulb, BarChart3 } from "lucide-react";

interface EmptyClassStateProps {
  onCreateClass?: () => void;
}

export const EmptyClassState = memo(function EmptyClassState({
  onCreateClass,
}: EmptyClassStateProps) {
  const navigate = useNavigate();

  const handleCreateClass = () => {
    if (onCreateClass) {
      onCreateClass();
    } else {
      navigate({ to: "/lesson-builder" });
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8 md:p-12 text-center"
      style={{
        background: "linear-gradient(135deg, var(--bg-onyx) 0%, var(--bg-night) 100%)",
        border: "1px solid var(--hairline)",
      }}
    >
      {/* Observatory-themed decorative elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(201,162,75,0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(201,162,75,0.05) 0%, transparent 40%)
          `,
        }}
      />
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(var(--hairline) 1px, transparent 1px),
            linear-gradient(90deg, var(--hairline) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10">
        {/* Observatory Telescope Icon */}
        <div
          className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
            boxShadow: "0 0 40px rgba(201,162,75,0.3)",
          }}
        >
          <Telescope className="h-10 w-10" style={{ color: "var(--bg-primary)" }} />
        </div>

        {/* Title */}
        <h2
          className="text-2xl md:text-3xl font-semibold font-display"
          style={{ color: "var(--ink-primary)" }}
        >
          Your Observatory Awaits
        </h2>

        {/* Description */}
        <p
          className="mt-4 max-w-lg mx-auto text-sm md:text-base"
          style={{ color: "var(--ink-secondary)" }}
        >
          Create your first class to begin monitoring student discoveries. Track breakthroughs,
          identify learning patterns, and illuminate paths to understanding.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleCreateClass}
          className="mt-8 group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,162,75,0.3)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-onyx)] focus:ring-[var(--gold)]"
          style={{
            background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
            color: "var(--bg-primary)",
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
            Initialize First Class
          </span>
        </button>

        {/* Observatory capabilities */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3 max-w-2xl mx-auto">
          <div
            className="text-center p-4 rounded-xl"
            style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Eye className="h-5 w-5" style={{ color: "var(--gold-soft)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>
                Monitor
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
              Track student progress in real-time
            </p>
          </div>
          <div
            className="text-center p-4 rounded-xl"
            style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5" style={{ color: "var(--gold-soft)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>
                Illuminate
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
              Identify breakthrough moments
            </p>
          </div>
          <div
            className="text-center p-4 rounded-xl"
            style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5" style={{ color: "var(--gold-soft)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>
                Analyze
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
              Generate learning insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EmptyClassState;
