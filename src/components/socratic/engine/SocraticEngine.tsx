import { useEffect, useRef, useState } from 'react';
import { useLearningState } from '@/lib/learning-state-context';
import { demoScript } from './demoScript';
import type { Message } from '../types';
import { StepperBar } from './StepperBar';
import { MentorCanvas } from './MentorCanvas';
import { DebateTerminal } from './DebateTerminal';
import { CelebrationOverlay } from './CelebrationOverlay';

export function SocraticEngine() {
  const { state, setState, isSpeaking, setIsSpeaking } = useLearningState();
  const [stepIndex, setStepIndex] = useState(-1); // -1 = not started
  const [messages, setMessages] = useState<Message[]>([]);
  const [celebrate, setCelebrate] = useState(false);
  const speakTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = demoScript.length;
  const started = stepIndex >= 0;

  useEffect(() => () => {
    if (speakTimer.current) clearTimeout(speakTimer.current);
  }, []);

  const reset = () => {
    setStepIndex(-1);
    setMessages([]);
    setState('IDLE');
    setCelebrate(false);
    setIsSpeaking(false);
  };

  const goTo = (idx: number) => {
    const step = demoScript[idx];
    if (!step) return;
    setStepIndex(idx);
    setState(step.state);
    setMessages((prev) => {
      // Rebuild messages cumulatively up to idx
      const all: Message[] = [];
      for (let i = 0; i <= idx; i++) all.push(...demoScript[i].messages);
      return all;
    });
    setIsSpeaking(true);
    if (speakTimer.current) clearTimeout(speakTimer.current);
    speakTimer.current = setTimeout(() => setIsSpeaking(false), 1800);
    if (step.celebrate) setCelebrate(true);
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
        <DebateTerminal
          messages={messages}
          stepIndex={Math.max(0, stepIndex)}
          totalSteps={total}
          isSpeaking={isSpeaking}
        />
      </div>
      {celebrate && <CelebrationOverlay onClose={() => setCelebrate(false)} />}
    </div>
  );
}
