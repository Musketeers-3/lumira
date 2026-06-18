import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { artifactForSkillName, getUnlockedArtifacts, persistArtifact } from "@/lib/artifacts";
import { useRealmAudio } from "@/lib/useRealmAudio";
import { DiscoveryPayload } from "@/lib/constellations";
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
  const {
    sessionId,
    initSession,
    ensureSession,
    updateSession,
    markBreakthrough,
    logMessage,
    fetchSkills,
    clearSession,
  } = useSessionPersistence();

  const AI_CONTEXT = useMemo<SocraticContext>(
    () => ({
      lessonTopic: topic,
      learningObjective: learningObjective,
      studentAnswers: [],
      currentStep: 0,
      totalSteps: 5,
    }),
    [topic, learningObjective],
  );

  const {
    messages: aiMessages,
    submitAnswer,
    isLoading: aiLoading,
  } = useSocraticDialogue(AI_CONTEXT, realm);

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
      // Only initialize - don't create session yet
      // Session will be created lazily when first message is sent
      initSession(lessonId, topic);
    }
    return () => {
      clearTimers();
      if (enablePersistence) {
        clearSession();
      }
    };
  }, [enablePersistence, lessonId, topic, initSession, clearSession]);

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

  // 1. Upgrade celebrate state to hold the payload instead of a boolean
  const [celebratePayload, setCelebratePayload] = useState<DiscoveryPayload | null>(null);

  const intentFromAi = (type?: string): Message["intent"] => {
    if (type === "revealing_challenge" || type === "challenge") return "Believing Challenge";
    if (type === "breakthrough_confirmation" || type === "breakthrough") return "Light Found";
    return "Gentle Push";
  };

  const handleObjectInteract = useCallback(
    (label: string, hint: string) => {
      setExplorationHint(hint);
      setLookTarget(LOOK_TARGETS[label] ?? null);
      setState("FOCUS");
      setMentorState("thinking");
      setTimeout(() => {
        setState("IDLE");
        setMentorState("idle");
      }, 2000);
    },
    [setState, setMentorState],
  );

  // 2. MOVE terminalMessages ABOVE handleAiAnswer so it can be accessed
  const terminalMessages: Message[] = aiMessages.map((m) => ({
    id: m.id,
    speaker: m.role === "user" ? "student" : "mentor",
    intent: m.role === "user" ? "You" : intentFromAi(m.type),
    text: m.content,
  }));

  // 3. EXPLICITLY TYPE the function signature to fix the JSX.Element Promise mismatch
  const handleAiAnswer = async (answer: string, intent?: string): Promise<void> => {
    try {
      // Ensure session exists before logging (creates lazily if needed)
      const currentSessionId = enablePersistence ? await ensureSession(lessonId, topic) : null;

      if (enablePersistence && currentSessionId) {
        await logMessage(currentSessionId, state, {
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

      if (enablePersistence && currentSessionId) {
        await logMessage(currentSessionId, response.estimated_state, {
          id: `ment-${Date.now()}`,
          speaker: "mentor",
          intent: intentFromAi(response.question_type),
          text: response.mentor_response,
        });
        await updateSession(
          currentSessionId,
          [...stateProgressionRef.current, response.estimated_state],
          aiMessages.length + 2,
        );
      }

      if (response.question_type === "breakthrough_confirmation") {
        setMentorState("clapping");

        // Resolve the actual artifact and insight
        const artifact = artifactForSkillName(topic);
        const childInsight =
          terminalMessages.filter((m) => m.speaker === "student").at(-1)?.text ??
          "A truth discovered.";

        // Formulate the Discovery Payload
        const discoveryPayload: DiscoveryPayload = {
          realm: realm,
          artifact: artifact?.id ?? "orbit-ring",
          topic: topic,
          insight: childInsight,
          rarity: "legendary", // Dynamic rarity logic goes here in the future
          constellationWeight: 1,
        };

        if (enablePersistence && sessionId) {
          await markBreakthrough(sessionId);
        }
        if (artifact) persistArtifact(artifact.id);

        // Trigger the cinematic payload
        setTimeout(() => setCelebratePayload(discoveryPayload), 900);
      }
    } catch (error) {
      console.error("[AI Mentor Core Execution Failure]", error);
    }
  };

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

      {/* 4. Pass the precise payload to the Celebration Overlay */}
      {celebratePayload && (
        <CelebrationOverlay payload={celebratePayload} onClose={() => setCelebratePayload(null)} />
      )}
    </div>
  );
}
