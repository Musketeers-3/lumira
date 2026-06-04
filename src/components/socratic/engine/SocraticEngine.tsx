import { useCallback, useEffect, useRef, useState } from "react";
import { useLearningState } from "@/lib/learning-state-context";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { useSocraticDialogue } from "@/hooks/useSocraticDialogue";
import { getThinkingPauseMs, getSpeakDurationMs } from "@/lib/mentor-personality";
import type { SocraticContext } from "@/lib/ai-mentor";
import type { LearningState, Message } from "../types";
import { MentorCanvas } from "./MentorCanvas";
import { MentorGlassFrame } from "./MentorGlassFrame";
import { InteractiveDebateTerminal } from "./InteractiveDebateTerminal";
import { CelebrationOverlay } from "./CelebrationOverlay";

interface SocraticEngineProps {
  enableAI?: boolean;
  enablePersistence?: boolean;
  lessonId?: string;
  topic?: string;
  learningObjective?: string;
}

export function SocraticEngine({
  enableAI = true, // Defaults to true in production
  enablePersistence = true,
  lessonId = "dynamic-session",
  topic = "Cognitive Pathway",
  learningObjective = "Discover the structural principles of the system through guided reasoning.",
}: SocraticEngineProps) {
  const { state, setState, isSpeaking, setIsSpeaking } = useLearningState();
  const { sessionId, startSession, updateSession, markBreakthrough, endSession, logMessage } =
    useSessionPersistence();

  // Initialize the live AI context
  const AI_CONTEXT: SocraticContext = {
    lessonTopic: topic,
    learningObjective: learningObjective,
    studentAnswers: [],
    currentStep: 0,
    totalSteps: 5,
  };

  const {
    messages: aiMessages,
    submitAnswer,
    isLoading: aiLoading,
  } = useSocraticDialogue(AI_CONTEXT);

  const [stepIndex, setStepIndex] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  const speakTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const stateProgressionRef = useRef<string[]>(["IDLE"]);

  // Mount the persistent session
  useEffect(() => {
    if (enablePersistence) {
      startSession(lessonId, topic);
      startTimeRef.current = Date.now();
    }
    return () => {
      clearTimers();
    };
  }, [enablePersistence, lessonId, topic, startSession]);

  const clearTimers = () => {
    if (speakTimer.current) clearTimeout(speakTimer.current);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
  };

  // Maps AI state shifts to physical 3D and UI changes
  const playMentorPresence = useCallback(
    (mentorState: LearningState, textLength = 120) => {
      clearTimers();
      setState(mentorState);
      const pauseMs = getThinkingPauseMs(mentorState);

      if (mentorState === "CHALLENGE" && pauseMs > 0) {
        setIsPausing(true);
        setIsSpeaking(false);
        pauseTimer.current = setTimeout(() => {
          setIsPausing(false);
          setIsSpeaking(true);
          speakTimer.current = setTimeout(
            () => setIsSpeaking(false),
            getSpeakDurationMs(mentorState, textLength),
          );
        }, pauseMs);
      } else {
        setIsPausing(false);
        setIsSpeaking(true);
        speakTimer.current = setTimeout(
          () => setIsSpeaking(false),
          getSpeakDurationMs(mentorState, textLength),
        );
      }
    },
    [setState, setIsSpeaking],
  );

  const intentFromAi = (type?: string): Message["intent"] => {
    if (type === "revealing_challenge" || type === "challenge") return "Believing Challenge";
    if (type === "breakthrough_confirmation" || type === "breakthrough") return "Light Found";
    return "Gentle Push";
  };

  // Main interaction loop
  const handleAiAnswer = async (answer: string) => {
    try {
      if (enablePersistence && sessionId) {
        await logMessage(sessionId, state, {
          id: `stud-${Date.now()}`,
          speaker: "student",
          intent: "You",
          text: answer,
        });
      }

      const result = await submitAnswer(answer);
      if (!result?.response) return;

      const { response } = result;

      // Advance UI progress bar safely
      setStepIndex((prev) => Math.min(prev + 1, AI_CONTEXT.totalSteps - 1));

      playMentorPresence(response.estimated_state, response.mentor_response.length);

      if (enablePersistence && sessionId) {
        await logMessage(sessionId, response.estimated_state, {
          id: `ment-${Date.now()}`,
          speaker: "mentor",
          intent: intentFromAi(response.question_type),
          text: response.mentor_response,
        });
        await updateSession(
          sessionId,
          [...stateProgressionRef.current, response.estimated_state],
          aiMessages.length + 2,
        );
      }

      if (response.question_type === "breakthrough_confirmation") {
        if (enablePersistence && sessionId) {
          await markBreakthrough(sessionId);
        }
        setTimeout(() => setCelebrate(true), 900);
      }
    } catch (error) {
      console.error("[AI Mentor Core Execution Failure]", error);
    }
  };

  const terminalMessages: Message[] = aiMessages.map((m) => ({
    id: m.id,
    speaker: m.role === "user" ? "student" : "mentor",
    intent: m.role === "user" ? "You" : intentFromAi(m.type),
    text: m.content,
  }));

  return (
    <div className="flex flex-col gap-5 pt-8 pb-12">
      <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">
        {/* Left: Mentor Visual Presence */}
        <MentorGlassFrame isSpeaking={isSpeaking} isPausing={isPausing}>
          <MentorCanvas state={state} isSpeaking={isSpeaking} isPausing={isPausing} />
        </MentorGlassFrame>

        {/* Right: Interaction Terminal */}
        <InteractiveDebateTerminal
          messages={terminalMessages}
          stepIndex={stepIndex}
          totalSteps={AI_CONTEXT.totalSteps}
          isSpeaking={isSpeaking}
          isLoading={aiLoading || isPausing}
          enableAI={enableAI}
          onSubmitAnswer={handleAiAnswer}
          topic={topic}
          lessonTitle={learningObjective}
        />
      </div>
      {celebrate && <CelebrationOverlay onClose={() => setCelebrate(false)} />}
    </div>
  );
}
