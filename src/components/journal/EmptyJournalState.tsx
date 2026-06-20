/**
 * EmptyJournalState Component
 *
 * Premium empty state for the Learning Journal when no sessions exist.
 * Features constellation-themed visuals and navigation CTAs.
 */

import { memo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles, Star, Flame, BookOpen } from "lucide-react";

/**
 * Animated star background component
 */
function ConstellationBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {/* Central glowing star */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse"
        style={{
          background: "var(--gold-soft)",
          boxShadow: "0 0 20px var(--gold-soft), 0 0 40px var(--gold-deep)",
        }}
      />

      {/* Orbiting stars */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 animate-spin"
        style={{ animationDuration: "20s" }}
      >
        <div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            top: "0%",
            left: "50%",
            background: "var(--gold-soft)",
            boxShadow: "0 0 6px var(--gold-soft)",
            animation: "float 3s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-1 h-1 rounded-full"
          style={{
            top: "25%",
            right: "10%",
            background: "var(--ink-tertiary)",
            animation: "float 4s ease-in-out infinite 0.5s",
          }}
        />
        <div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            top: "50%",
            left: "100%",
            background: "var(--gold-soft)",
            opacity: 0.6,
            boxShadow: "0 0 4px var(--gold-soft)",
            animation: "float 3.5s ease-in-out infinite 1s",
          }}
        />
      </div>

      {/* Static stars */}
      <div
        className="absolute w-1 h-1 rounded-full"
        style={{
          top: "20%",
          left: "20%",
          background: "var(--ink-tertiary)",
          animation: "float 4s ease-in-out infinite 0.2s",
        }}
      />
      <div
        className="absolute w-1.5 h-1.5 rounded-full"
        style={{
          top: "30%",
          right: "25%",
          background: "var(--gold-soft)",
          opacity: 0.7,
          boxShadow: "0 0 4px var(--gold-soft)",
          animation: "float 5s ease-in-out infinite 0.8s",
        }}
      />
      <div
        className="absolute w-1 h-1 rounded-full"
        style={{
          bottom: "25%",
          left: "30%",
          background: "var(--ink-tertiary)",
          animation: "float 3.5s ease-in-out infinite 1.2s",
        }}
      />
      <div
        className="absolute w-1 h-1 rounded-full"
        style={{
          bottom: "35%",
          right: "15%",
          background: "var(--ink-tertiary)",
          animation: "float 4.5s ease-in-out infinite 0.3s",
        }}
      />
      <div
        className="absolute w-1.5 h-1.5 rounded-full"
        style={{
          top: "60%",
          left: "10%",
          background: "var(--gold-soft)",
          opacity: 0.5,
          boxShadow: "0 0 3px var(--gold-soft)",
          animation: "float 4s ease-in-out infinite 0.6s",
        }}
      />

      {/* Radial glow effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
        style={{
          background: "radial-gradient(circle, rgba(201,162,75,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/**
 * Preview card for future progress
 */
interface PreviewCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PreviewCard = memo(function PreviewCard({ icon, title, description }: PreviewCardProps) {
  return (
    <div
      className="group flex items-start gap-3 p-4 rounded-xl transition-all duration-300 cursor-default"
      style={{
        background: "var(--bg-night)",
        border: "1px solid var(--hairline)",
      }}
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{
          background: "var(--gold-deep)",
        }}
      >
        <span className="text-lg">{icon}</span>
      </div>
      <div>
        <h4 className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>
          {title}
        </h4>
        <p className="text-xs mt-1" style={{ color: "var(--ink-secondary)" }}>
          {description}
        </p>
      </div>
    </div>
  );
});

/**
 * EmptyJournalState - Main component
 */
export const EmptyJournalState = memo(function EmptyJournalState() {
  const navigate = useNavigate();

  const handleExploreWorlds = () => {
    navigate({ to: "/" });
  };

  const handleStartLesson = () => {
    navigate({ to: "/explore" });
  };

  return (
    <div className="relative -mt-4">
      {/* Main empty state card */}
      <div
        className="relative rounded-2xl p-8 md:p-10 text-center overflow-hidden"
        style={{
          background: "var(--bg-onyx)",
          border: "1px solid var(--hairline)",
        }}
      >
        {/* Animated constellation background */}
        <ConstellationBackground />

        {/* Content */}
        <div className="relative z-10">
          {/* Title */}
          <h2
            className="text-2xl md:text-3xl font-semibold font-display animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ color: "var(--ink-primary)" }}
          >
            Your journey begins here.
          </h2>

          {/* Subtitle */}
          <p
            className="mt-4 max-w-md mx-auto text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ color: "var(--ink-secondary)" }}
          >
            Every discovery, breakthrough, and artifact you earn will appear in your journal. Start
            exploring to create your first entry.
          </p>

          {/* Motivation Section */}
          <p
            className="mt-6 text-xs font-medium uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ color: "var(--gold-soft)" }}
          >
            Your first lesson unlocks:
          </p>

          <div
            className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ color: "var(--ink-secondary)" }}
          >
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" style={{ color: "var(--gold-soft)" }} />
              Achievements
            </span>
            <span className="text-[var(--ink-tertiary)]">·</span>
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" style={{ color: "#F97316" }} />
              Artifacts
            </span>
            <span className="text-[var(--ink-tertiary)]">·</span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" style={{ color: "var(--gold)" }} />
              Journal Entries
            </span>
          </div>

          {/* Action Buttons - REVERSED: Start First Lesson is primary */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={handleStartLesson}
              className="group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-onyx)] focus:ring-[var(--gold)]"
              style={{
                background: "var(--gold)",
                color: "var(--bg-primary)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                Start First Lesson
              </span>
            </button>

            <button
              onClick={handleExploreWorlds}
              className="group px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-onyx)] focus:ring-[var(--gold-soft)]"
              style={{
                background: "transparent",
                color: "var(--ink-secondary)",
                border: "1px solid var(--hairline)",
              }}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 transition-transform group-hover:-rotate-3" />
                Explore Worlds
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Future Progress Preview - with enhanced hover effects */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div
          className="group flex items-start gap-3 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(201,162,75,0.15)] hover:border-[var(--gold-soft)] cursor-default"
          style={{
            background: "var(--bg-night)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: "var(--gold-deep)",
            }}
          >
            <Star className="h-5 w-5" style={{ color: "var(--ink-primary)" }} />
          </div>
          <div>
            <h4 className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>
              Achievements
            </h4>
            <p className="text-xs mt-1" style={{ color: "var(--ink-secondary)" }}>
              Earn recognition for breakthrough discoveries.
            </p>
          </div>
        </div>

        <div
          className="group flex items-start gap-3 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(201,162,75,0.15)] hover:border-[var(--gold-soft)] cursor-default"
          style={{
            background: "var(--bg-night)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: "var(--gold-deep)",
            }}
          >
            <Flame className="h-5 w-5" style={{ color: "var(--ink-primary)" }} />
          </div>
          <div>
            <h4 className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>
              Artifacts
            </h4>
            <p className="text-xs mt-1" style={{ color: "var(--ink-secondary)" }}>
              Unlock unique relics from your learning journey.
            </p>
          </div>
        </div>

        <div
          className="group flex items-start gap-3 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(201,162,75,0.15)] hover:border-[var(--gold-soft)] cursor-default"
          style={{
            background: "var(--bg-night)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: "var(--gold-deep)",
            }}
          >
            <BookOpen className="h-5 w-5" style={{ color: "var(--ink-primary)" }} />
          </div>
          <div>
            <h4 className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>
              Journal Entries
            </h4>
            <p className="text-xs mt-1" style={{ color: "var(--ink-secondary)" }}>
              Build a timeline of your discoveries and growth.
            </p>
          </div>
        </div>
      </div>

      {/* CSS animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
});

export default EmptyJournalState;
