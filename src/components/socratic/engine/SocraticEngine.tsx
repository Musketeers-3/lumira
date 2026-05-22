import { useEffect, useRef, useState } from 'react';
import { useLearningState } from '@/lib/learning-state-context';
import { useSessionPersistence } from '@/hooks/useSessionPersistence';
import { demoScript } from './demoScript';
import type { Message } from '../types';
import { StepperBar } from './StepperBar';
import { MentorCanvas } from './MentorCanvas';
import { DebateTerminal } from './DebateTerminal';
import { InteractiveDebateTerminal } from './InteractiveDebateTerminal';
import { CelebrationOverlay } from './CelebrationOverlay';

interface SocraticEngineProps {
  enableAI?: boolean; // Set to true to use real AI-powered dialogue
  enablePersistence?: boolean; // Set to true to save progress to Supabase
  lessonId?: string;
  topic?: string;
}

export function SocraticEngine({ 
  enableAI = false, 
  enablePersistence = false,
  lessonId = 'binary-search-demo',
  topic = 'Binary Search Algorithm'
}: SocraticEngineProps) {
  const { state, setState, isSpeaking, setIsSpeaking } = useLearningState();
  const { sessionId, startSession, updateSession, markBreakthrough, endSession } = useSessionPersistence();
  const [stepIndex, setStepIndex] = useState(-1); // -1 = not started
  const [messages, setMessages] = useState<Message[]>([]);
  const [celebrate, setCelebrate] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const speakTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const stateProgressionRef = useRef<string[]>(['IDLE']);

  const total = demoScript.length;
  const started = stepIndex >= 0;

  useEffect(() => {
    // Initialize session on mount if persistence is enabled
    if (enablePersistence && stepIndex === -1) {
      startSession(lessonId, topic);
      startTimeRef.current = Date.now();
    }
    return () => {
      if (speakTimer.current) clearTimeout(speakTimer.current);
    };
  }, [enablePersistence, lessonId, topic, startSession]);

  const reset = async () => {
    // If persistence enabled and session was active, end it
    if (enablePersistence && sessionId && startTimeRef.current) {
      const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const performanceScore = Math.min(100, Math.floor((stepIndex / total) * 100));
      await endSession(sessionId, durationSeconds, performanceScore);
    }

    setStepIndex(-1);
    setMessages([]);
    setState('IDLE');
    setCelebrate(false);
    setIsSpeaking(false);
    stateProgressionRef.current = ['IDLE'];
    startTimeRef.current = null;

    // Reset for potential new session
    if (enablePersistence) {
      startSession(lessonId, topic);
      startTimeRef.current = Date.now();
    }
  };

  const goTo = async (idx: number) => {
    const step = demoScript[idx];
    if (!step) return;
    setStepIndex(idx);
    setState(step.state);
    
    // Track state progression
    if (!stateProgressionRef.current.includes(step.state)) {
      stateProgressionRef.current.push(step.state);
    }

    setMessages((prev) => {
      // Rebuild messages cumulatively up to idx
      const all: Message[] = [];
      for (let i = 0; i <= idx; i++) all.push(...demoScript[i].messages);
      return all;
    });
    
    setIsSpeaking(true);
    if (speakTimer.current) clearTimeout(speakTimer.current);
    
    // Adjust speaking duration based on state for more natural feel
    const speakDuration = step.state === 'CHALLENGE' ? 2200 : step.state === 'CELEBRATE' ? 2800 : 1800;
    speakTimer.current = setTimeout(() => setIsSpeaking(false), speakDuration);
    
    // Update session persistence if enabled
    if (enablePersistence && sessionId) {
      const messageCount = demoScript.slice(0, idx + 1).reduce((sum, s) => sum + s.messages.length, 0);
      await updateSession(sessionId, stateProgressionRef.current, messageCount);
    }
    
    if (step.celebrate) {
      // Mark breakthrough if persistence enabled
      if (enablePersistence && sessionId) {
        await markBreakthrough(sessionId);
      }
      // Delay celebration to sync with speaking animation
      setTimeout(() => setCelebrate(true), 500);
    }
  };

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
        <MentorCanvas state={state} isSpeaking={isSpeaking} />
        {enableAI ? (
          <InteractiveDebateTerminal
            messages={messages}
            stepIndex={Math.max(0, stepIndex)}
            totalSteps={total}
            isSpeaking={isSpeaking}
            isLoading={aiLoading}
            enableAI={enableAI}
            onSubmitAnswer={async (answer) => {
              // TODO: Integrate with AI mentor when API is configured
              setAiLoading(true);
              try {
                // Simulated AI response for now
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log('[AI Mentor] Student answered:', answer);
              } finally {
                setAiLoading(false);
              }
            }}
          />
        ) : (
          <DebateTerminal
            messages={messages}
            stepIndex={Math.max(0, stepIndex)}
            totalSteps={total}
            isSpeaking={isSpeaking}
          />
        )}
      </div>
      {celebrate && <CelebrationOverlay onClose={() => setCelebrate(false)} />}
    </div>
  );
}
