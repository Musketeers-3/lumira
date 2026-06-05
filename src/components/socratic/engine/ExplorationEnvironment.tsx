import type { LearningState, Message } from "../types";
import type { RealmId } from "@/lib/realms";
import type { Artifact } from "@/lib/artifacts";
import { MentorCanvas } from "./MentorCanvas";
import { ExplorationPanel } from "./ExplorationPanel";

type MentorIntent = "Gentle Push" | "Believing Challenge" | "Light Found";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing: boolean;
  realm: RealmId;
  artifacts: Artifact[];
  messages: Message[];
  stepIndex: number;
  totalSteps: number;
  topic: string;
  isLoading: boolean;
  explorationHint: string | null;
  lookTarget: [number, number, number] | null;
  onObjectInteract: (label: string, hint: string) => void;
  onSubmitAnswer?: (answer: string, intent?: MentorIntent) => Promise<void>;
}

export function ExplorationEnvironment({
  state,
  isSpeaking,
  isPausing,
  realm,
  artifacts,
  messages,
  stepIndex,
  topic,
  isLoading,
  explorationHint,
  lookTarget,
  onObjectInteract,
  onSubmitAnswer,
}: Props) {
  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-3xl"
      style={{
        minHeight: "min(85vh, 780px)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 80px var(--realm-glow)",
      }}
    >
      {/* 3D stage — mentor stays above the chat panel */}
      <div className="relative min-h-[min(46vh,400px)] flex-1">
        <div className="absolute inset-0">
          <MentorCanvas
            state={state}
            isSpeaking={isSpeaking}
            isPausing={isPausing}
            realm={realm}
            artifacts={artifacts}
            lookTarget={lookTarget}
            onObjectInteract={onObjectInteract}
          />
        </div>

        {/* Top vignette for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10"
          style={{
            background: "linear-gradient(180deg, rgba(5,5,7,0.5), transparent)",
          }}
        />

        {/* Bottom fade into dialogue panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-10"
          style={{
            background: "linear-gradient(0deg, rgba(5,5,7,0.6), transparent)",
          }}
        />

        {/* Realm badge */}
        <div
          className="absolute top-4 z-20 rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] backdrop-blur-md"
          style={{
            left: "calc(30% + 1rem)",
            background: "rgba(7,7,14,0.6)",
            border: "1px solid var(--realm-accent)",
            color: "var(--realm-accent)",
          }}
        >
          Exploring
        </div>
      </div>

      {/* Dialogue panel — sits below the 3D stage, no overlap */}
      <div
        className="shrink-0 p-4 lg:p-6 lg:px-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <ExplorationPanel
          messages={messages}
          stepIndex={stepIndex}
          isSpeaking={isSpeaking}
          isLoading={isLoading}
          onSubmitAnswer={onSubmitAnswer}
          topic={topic}
          explorationHint={explorationHint}
        />
      </div>
    </div>
  );
}
