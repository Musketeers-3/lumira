import { useState } from "react";
import { Compass, MessageSquareCode } from "lucide-react";
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
  // PHASE CONTROL: true = Explore Mode (Full 3D Stage), false = Active Socratic Mode (Split Layout)
  const [isExploring, setIsExploring] = useState(true);

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] bg-[rgba(10,11,18,0.4)] backdrop-blur-xl"
      style={{
        minHeight: "min(85vh, 780px)",
        borderColor: "rgba(255,255,255,0.06)",
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 80px var(--realm-glow)",
      }}
    >
      {/* 3D STAGE CONTAINER: Dynamically resizes based on phase */}
      <div
        className="relative transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] flex-shrink-0"
        style={{
          height: isExploring ? "100%" : "min(46vh, 400px)",
          flex: isExploring ? "1" : "none",
        }}
      >
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

        {/* Ambient Depth Vignettes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 z-10 bg-gradient-to-b from-[rgba(5,5,7,0.7)] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-[rgba(5,5,7,0.85)] to-transparent"
        />

        {/* ================= STAGE 0: EXPLORE MODE OVERLAY ================= */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1px] transition-all duration-700 ease-in-out ${
            isExploring
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none translate-y-[-10px]"
          }`}
        >
          <div className="text-center space-y-5 max-w-xl px-6">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md"
              style={{
                background: "rgba(7,7,14,0.6)",
                border: "1px solid var(--realm-accent)",
                color: "var(--realm-accent)",
                boxShadow: "0 0 15px var(--realm-glow)",
              }}
            >
              <Compass className="w-3 h-3 animate-spin-slow" />
              Observation Staging
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white drop-shadow-2xl">
              {topic}
            </h1>

            <p className="text-sm leading-relaxed text-slate-300 max-w-md mx-auto">
              Take a moment to look over the phenomenon. When you are ready to construct your
              understanding, summon your mentor.
            </p>

            <button
              type="button"
              onClick={() => setIsExploring(false)}
              className="mt-4 inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] hover:-translate-y-px active:scale-[0.98]"
              style={{
                background: "var(--realm-accent)",
                color: "var(--bg-night)",
                boxShadow: "0 0 30px var(--realm-glow)",
              }}
            >
              <MessageSquareCode className="w-4 h-4" />
              Begin Inquiry
            </button>
          </div>
        </div>

        {/* ================= STAGE 1: ACTIVE INQUIRY BADGE ================= */}
        <div
          className={`absolute top-4 left-4 z-20 rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] backdrop-blur-md transition-all duration-700 delay-300 ${
            !isExploring
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 pointer-events-none"
          }`}
          style={{
            background: "rgba(7,7,14,0.6)",
            border: "1px solid var(--realm-accent)",
            color: "var(--realm-accent)",
          }}
        >
          Active Inquiry
        </div>
      </div>

      {/* DIALOGUE PANEL CONSOLE: Seamlessly collapses down or slides up into view */}
      <div
        className="transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden flex flex-col bg-[rgba(6,7,11,0.75)]"
        style={{
          height: isExploring ? "0px" : "100%",
          flex: isExploring ? "none" : "1",
          borderTop: isExploring ? "1px solid transparent" : "1px solid rgba(255,255,255,0.06)",
          opacity: isExploring ? 0 : 1,
        }}
      >
        <div className="p-4 lg:p-6 lg:px-8 flex-1 overflow-y-auto">
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
    </div>
  );
}
