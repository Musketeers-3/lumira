import { useCallback, useEffect, useRef, useState } from "react";
import { useLearningState } from "@/lib/learning-state-context";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { useSocraticDialogue } from "@/hooks/useSocraticDialogue";
import { getThinkingPauseMs, getSpeakDurationMs } from "@/lib/mentor-personality";
import type { SocraticContext } from "@/lib/ai-mentor";
import { demoScript } from "./demoScript";
import type { LearningState, Message } from "../types";
import { StepperBar } from "./StepperBar";
import { MentorCanvas } from "./MentorCanvas";
import { InteractiveDebateTerminal } from "./InteractiveDebateTerminal";
import { CelebrationOverlay } from "./CelebrationOverlay";

interface SocraticEngineProps {
  enableAI?: boolean;
  enablePersistence?: boolean;
  lessonId?: string;
  topic?: string;
  learningObjective?: string;
}

const AI_CONTEXT: SocraticContext = {
  lessonTopic: "Binary Search Algorithm",
  learningObjective:
    "Understand how halving a sorted search space finds items in logarithmic steps",
  studentAnswers: [],
  currentStep: 0,
  totalSteps: 5,
};

export function SocraticEngine({
  enableAI = false,
  enablePersistence = false,
  lessonId = "binary-search-demo",
  topic = "Binary Search Algorithm",
  learningObjective = AI_CONTEXT.learningObjective,
}: SocraticEngineProps) {
  const { state, setState, isSpeaking, setIsSpeaking } = useLearningState();
  const { sessionId, startSession, updateSession, markBreakthrough, endSession } =
    useSessionPersistence();
  const {
    messages: aiMessages,
    submitAnswer,
    isLoading: aiLoading,
  } = useSocraticDialogue({
    ...AI_CONTEXT,
    lessonTopic: topic,
    learningObjective,
  });

  const [stepIndex, setStepIndex] = useState(-1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [celebrate, setCelebrate] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const speakTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const stateProgressionRef = useRef<string[]>(["IDLE"]);

  const total = demoScript.length;
  const started = stepIndex >= 0;

  useEffect(() => {
    if (enablePersistence) {
      startSession(lessonId, topic);
      startTimeRef.current = Date.now();
    }
    return () => {
      if (speakTimer.current) clearTimeout(speakTimer.current);
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
    };
  }, [enablePersistence, lessonId, topic, startSession]);

  const clearTimers = () => {
    if (speakTimer.current) clearTimeout(speakTimer.current);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
  };

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

  const reset = async () => {
    if (enablePersistence && sessionId && startTimeRef.current) {
      const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const performanceScore = Math.min(100, Math.floor((stepIndex / total) * 100));
      await endSession(sessionId, durationSeconds, performanceScore);
    }

    clearTimers();
    setStepIndex(-1);
    setMessages([]);
    setState("IDLE");
    setCelebrate(false);
    setIsPausing(false);
    setIsSpeaking(false);
    stateProgressionRef.current = ["IDLE"];
    startTimeRef.current = null;

    if (enablePersistence) {
      startSession(lessonId, topic);
      startTimeRef.current = Date.now();
    }
  };

  const goTo = async (idx: number) => {
    const step = demoScript[idx];
    if (!step) return;
    setStepIndex(idx);

    if (!stateProgressionRef.current.includes(step.state)) {
      stateProgressionRef.current.push(step.state);
    }

    setMessages(() => {
      const all: Message[] = [];
      for (let i = 0; i <= idx; i++) all.push(...demoScript[i].messages);
      return all;
    });

    const lastMentor = [...step.messages].reverse().find((m) => m.speaker === "mentor");
    playMentorPresence(step.state, lastMentor?.text.length ?? 120);

    if (enablePersistence && sessionId) {
      const messageCount = demoScript
        .slice(0, idx + 1)
        .reduce((sum, s) => sum + s.messages.length, 0);
      await updateSession(sessionId, stateProgressionRef.current, messageCount);
    }

    if (step.celebrate) {
      if (enablePersistence && sessionId) {
        await markBreakthrough(sessionId);
      }
      setTimeout(() => setCelebrate(true), 800);
    }
  };

  const handleAiAnswer = async (answer: string) => {
    try {
      const result = await submitAnswer(answer);
      if (!result?.response) return;

      const { response } = result;
      playMentorPresence(response.estimated_state, response.mentor_response.length);

      if (response.question_type === "breakthrough_confirmation") {
        setTimeout(() => setCelebrate(true), 900);
      }
    } catch (error) {
      console.error("[AI Mentor]", error);
    }
  };

  const intentFromAi = (
    type?: "gentle_push" | "revealing_challenge" | "breakthrough_confirmation",
  ): Message["intent"] => {
    if (type === "revealing_challenge") return "Believing Challenge";
    if (type === "breakthrough_confirmation") return "Light Found";
    return "Gentle Push";
  };

  const terminalMessages: Message[] = enableAI
    ? aiMessages.map((m) => ({
        id: m.id,
        speaker: m.role === "user" ? "student" : "mentor",
        intent: m.role === "user" ? "You" : intentFromAi(m.type),
        text: m.content,
      }))
    : messages;

  const onNext = () => {
    if (!started) return goTo(0);
    if (stepIndex >= total - 1) return reset();
    goTo(stepIndex + 1);
  };
  const onPrev = () => started && stepIndex > 0 && goTo(stepIndex - 1);

  return (
    <div className="flex flex-col gap-5">
      <StepperBar
        stepIndex={Math.max(0, stepIndex)}
        total={total}
        onPrev={onPrev}
        onNext={onNext}
        onReset={reset}
        started={started}
      />
      <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">
        <MentorCanvas state={state} isSpeaking={isSpeaking} isPausing={isPausing} />
        <InteractiveDebateTerminal
          messages={terminalMessages}
          stepIndex={Math.max(0, stepIndex)}
          totalSteps={total}
          isSpeaking={isSpeaking}
          isLoading={aiLoading}
          enableAI={enableAI}
          onSubmitAnswer={enableAI ? handleAiAnswer : handleStudentSpeak}
        />
      </div>
      {celebrate && <CelebrationOverlay onClose={() => setCelebrate(false)} />}
    </div>
  );
}
