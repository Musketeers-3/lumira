import type { LearningState } from "../types";
import { useMentorSettingsOptional } from "@/lib/mentor-settings-hooks";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing?: boolean;
}

export function MentorAvatar({ state, isSpeaking, isPausing = false }: Props) {
  const settings = useMentorSettingsOptional();

  // Extract motion settings to respect user accessibility and UI preferences
  const motionMult = settings?.motionMultiplier ?? 1;
  const isReducedMotion = settings?.reducedMotion ?? false;

  const leanX = state === "FOCUS" ? 5 : 0;
  const handsOnDesk = state === "CHALLENGE" || state === "FOCUS";

  // Disable heavy breathing if user requested reduced motion
  const breathing = (state === "IDLE" || state === "FOCUS") && !isReducedMotion;

  return (
    <svg
      viewBox="0 0 200 240"
      className="h-full w-full transition-all duration-700 ease-in-out"
      style={{
        filter: "drop-shadow(0 0 20px var(--state-glow))",
        // Scale the breathing animation duration based on the user's motion preferences
        animation: breathing ? `breathe ${4 / motionMult}s ease-in-out infinite` : undefined,
      }}
    >
      <defs>
        <linearGradient id="silhouette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--state-accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--state-accent)" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <g
        style={{
          transform: `translateX(${leanX}px) rotate(${state === "FOCUS" ? 3 : 0}deg)`,
          transformOrigin: "100px 200px",
          transition: "transform 700ms ease-in-out",
        }}
      >
        <circle cx="100" cy="70" r="28" fill="url(#silhouette)" />
        <circle cx="90" cy="68" r="1.8" fill="var(--state-accent)" />
        <circle cx="110" cy="68" r="1.8" fill="var(--state-accent)" />
        {state === "CELEBRATE" ? (
          <path
            d="M 92 80 Q 100 86 108 80"
            stroke="var(--state-accent)"
            strokeWidth="1.2"
            fill="none"
          />
        ) : (
          <line
            x1="93"
            y1="81"
            x2="107"
            y2="81"
            stroke="var(--state-accent)"
            strokeWidth="1"
            opacity="0.6"
          />
        )}
        <path
          d="M 60 130 Q 100 115 140 130 L 145 220 L 55 220 Z"
          fill="url(#silhouette)"
          stroke="var(--state-accent)"
          strokeWidth="0.4"
        />
        {handsOnDesk ? (
          <>
            <path
              d="M 62 140 L 75 195"
              stroke="var(--state-accent)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              d="M 138 140 L 125 195"
              stroke="var(--state-accent)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.75"
            />
          </>
        ) : (
          <>
            <path
              d="M 62 135 L 55 200"
              stroke="var(--state-accent)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M 138 135 L 145 200"
              stroke="var(--state-accent)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.7"
            />
          </>
        )}
      </g>

      {/* Disable the ripple if reduced motion is active */}
      {isSpeaking && !isPausing && !isReducedMotion && (
        <circle
          cx="100"
          cy="70"
          r="32"
          fill="none"
          stroke="var(--state-accent)"
          strokeWidth="0.8"
          opacity="0.35"
          style={{ animation: `ripple ${2 / motionMult}s ease-out infinite` }}
        />
      )}
    </svg>
  );
}
