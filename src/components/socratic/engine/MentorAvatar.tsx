import type { LearningState } from '../types';

interface Props {
  state: LearningState;
  isSpeaking: boolean;
}

export function MentorAvatar({ state, isSpeaking }: Props) {
  // Posture controls
  const leanX = state === 'FOCUS' ? 6 : 0;
  const armCross = state === 'CHALLENGE';
  const armsUp = state === 'CELEBRATE';
  const breathing = state === 'IDLE';

  return (
    <svg
      viewBox="0 0 200 240"
      className="h-full w-full transition-all duration-700 ease-in-out"
      style={{
        filter:
          state === 'CELEBRATE'
            ? 'drop-shadow(0 0 30px var(--state-glow))'
            : state === 'CHALLENGE'
              ? 'drop-shadow(0 0 24px var(--state-glow))'
              : 'drop-shadow(0 0 18px var(--state-glow))',
        animation: breathing ? 'breathe 4s ease-in-out infinite' : undefined,
      }}
    >
      <defs>
        <linearGradient id="silhouette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--state-accent)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--state-accent)" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--state-accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--state-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="80" r="70" fill="url(#halo)" />

      <g
        style={{
          transform: `translateX(${leanX}px) rotate(${state === 'FOCUS' ? 4 : 0}deg)`,
          transformOrigin: '100px 200px',
          transition: 'transform 700ms ease-in-out',
        }}
      >
        {/* head */}
        <circle cx="100" cy="70" r="28" fill="url(#silhouette)" stroke="var(--state-accent)" strokeWidth="0.5" />
        {/* eyes */}
        <circle
          cx="90"
          cy="68"
          r={state === 'CHALLENGE' ? 2.4 : 1.8}
          fill="var(--state-accent)"
          style={{ filter: state === 'CHALLENGE' ? 'drop-shadow(0 0 6px var(--state-accent))' : undefined }}
        />
        <circle
          cx="110"
          cy="68"
          r={state === 'CHALLENGE' ? 2.4 : 1.8}
          fill="var(--state-accent)"
          style={{ filter: state === 'CHALLENGE' ? 'drop-shadow(0 0 6px var(--state-accent))' : undefined }}
        />
        {/* mouth - subtle smile on celebrate */}
        {armsUp ? (
          <path d="M 90 80 Q 100 90 110 80" stroke="var(--state-accent)" strokeWidth="1.5" fill="none" />
        ) : (
          <line x1="92" y1="82" x2="108" y2="82" stroke="var(--state-accent)" strokeWidth="1.2" opacity="0.7" />
        )}

        {/* body */}
        <path
          d="M 60 130 Q 100 110 140 130 L 145 220 L 55 220 Z"
          fill="url(#silhouette)"
          stroke="var(--state-accent)"
          strokeWidth="0.4"
        />

        {/* arms */}
        {armsUp ? (
          <>
            <path d="M 65 135 Q 40 80 50 40" stroke="var(--state-accent)" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85" />
            <path d="M 135 135 Q 160 80 150 40" stroke="var(--state-accent)" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85" />
          </>
        ) : armCross ? (
          <>
            <path d="M 65 140 L 135 165" stroke="var(--state-accent)" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
            <path d="M 135 140 L 65 165" stroke="var(--state-accent)" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
          </>
        ) : (
          <>
            <path d="M 62 135 L 55 200" stroke="var(--state-accent)" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
            <path d="M 138 135 L 145 200" stroke="var(--state-accent)" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
          </>
        )}
      </g>

      {/* speaking pulse */}
      {isSpeaking && (
        <circle
          cx="100"
          cy="70"
          r="34"
          fill="none"
          stroke="var(--state-accent)"
          strokeWidth="1"
          opacity="0.6"
          style={{ animation: 'ripple 1.4s ease-out infinite' }}
        />
      )}
    </svg>
  );
}
