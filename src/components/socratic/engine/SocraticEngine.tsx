import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLearningState } from "@/lib/learning-state-context";
import { useMentorAnimationState } from "@/lib/mentor-animation-context";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { useSocraticDialogue } from "@/hooks/useSocraticDialogue";
import { getThinkingPauseMs, getSpeakDurationMs } from "@/lib/mentor-personality";
import type { SocraticContext } from "@/lib/ai-mentor";
import type { LearningState, Message } from "../types";
import { ExplorationEnvironment } from "./ExplorationEnvironment";
import { CelebrationOverlay } from "./CelebrationOverlay";
import { discoveryTitle, type RealmId } from "@/lib/realms";
import { getUnlockedArtifacts, persistArtifact } from "@/lib/artifacts";
import { useRealmAudio } from "@/lib/useRealmAudio";
interface SocraticEngineProps {
  enableAI?: boolean;
  enablePersistence?: boolean;
  lessonId?: string;
  topic?: string;
  learningObjective?: string;
  realm?: RealmId;
}

/** Triggers mentor glance toward the world panel (not world-space coords). */
const LOOK_TARGETS: Record<string, [number, number, number]> = {
  Earth: [1, 1, 1],
  Moon: [1, 1, 1],
  Particles: [1, 1, 1],
  "Living Cell": [1, 1, 1],
  Pattern: [1, 1, 1],
  "Ancient Scroll": [1, 1, 1],
};

export function SocraticEngine({
  enableAI = true,
  enablePersistence = true,
  lessonId = "dynamic-session",
  topic = "Cognitive Pathway",
  learningObjective = "Discover the structural principles of the system through guided reasoning.",
  realm = "physics",
}: SocraticEngineProps) {
  const { state, setState, isSpeaking, setIsSpeaking } = useLearningState();
  const { setMentorState } = useMentorAnimationState();
  const { setRealm: setAudioRealm } = useRealmAudio();
  const { sessionId, startSession, updateSession, markBreakthrough, logMessage, fetchSkills } =
    useSessionPersistence();

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
  const [explorationHint, setExplorationHint] = useState<string | null>(null);
  const [lookTarget, setLookTarget] = useState<[number, number, number] | null>(null);

  const speakTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateProgressionRef = useRef<string[]>(["IDLE"]);

  const { data: skills = [] } = useQuery({
    queryKey: ["engine-artifacts"],
    queryFn: () => fetchSkills(),
    staleTime: 1000 * 60,
  });

  const unlockedSkillNames = (skills ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((s: any) => s.status === "unlocked")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((s: any) => s.skill_name ?? s.name ?? "");
  const artifacts = getUnlockedArtifacts(unlockedSkillNames);

  useEffect(() => {
    setAudioRealm(realm);
  }, [realm, setAudioRealm]);

  useEffect(() => {
    if (enablePersistence) {
      startSession(lessonId, topic);
    }
    return () => clearTimers();
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

  const intentFromAi = (type?: string): Message["intent"] => {
    if (type === "revealing_challenge" || type === "challenge") return "Believing Challenge";
    if (type === "breakthrough_confirmation" || type === "breakthrough") return "Light Found";
    return "Gentle Push";
  };

  const handleObjectInteract = useCallback((label: string, hint: string) => {
    setExplorationHint(hint);
    setLookTarget(LOOK_TARGETS[label] ?? null);
    setState("FOCUS");
    setMentorState("thinking");
    setTimeout(() => {
      setState("IDLE");
      setMentorState("idle");
    }, 2000);
  }, [setState, setMentorState]);

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
        setMentorState("clapping");
        if (enablePersistence && sessionId) {
          await markBreakthrough(sessionId);
        }
        persistArtifact("orbit-ring");
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

  const breakthroughInsight =
    terminalMessages.filter((m) => m.speaker === "student").at(-1)?.text ??
    "That understanding will stay with you now — you found it yourself.";

  return (
    <div className="flex flex-col gap-5 pt-4 pb-12">
      <ExplorationEnvironment
        state={state}
        isSpeaking={isSpeaking}
        isPausing={isPausing}
        realm={realm}
        artifacts={artifacts}
        messages={terminalMessages}
        stepIndex={stepIndex}
        totalSteps={AI_CONTEXT.totalSteps}
        topic={topic}
        isLoading={aiLoading || isPausing}
        explorationHint={explorationHint}
        lookTarget={lookTarget}
        onObjectInteract={handleObjectInteract}
        onSubmitAnswer={handleAiAnswer}
      />
      {celebrate && (
        <CelebrationOverlay
          onClose={() => setCelebrate(false)}
          discoveryTitle={discoveryTitle(topic)}
          insight={breakthroughInsight}
        />
      )}
    </div>
  );
}
