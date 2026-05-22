import { useCallback, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import type { SocraticContext, SocraticResponse } from '@/lib/ai-mentor';
import { generateSocraticResponse, evaluateUnderstanding } from '@/lib/ai-mentor';

interface MessageLog {
  id: string;
  role: 'user' | 'mentor';
  content: string;
  timestamp: number;
  type?: 'gentle_push' | 'revealing_challenge' | 'breakthrough_confirmation';
}

export function useSocraticDialogue(initialContext: SocraticContext) {
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMentorState, setLastMentorState] = useState<'FOCUS' | 'CHALLENGE' | 'CELEBRATE'>(
    'FOCUS'
  );
  const contextRef = useRef<SocraticContext>(initialContext);

  const submitAnswer = useCallback(
    async (studentAnswer: string) => {
      if (!studentAnswer.trim() || isLoading) return;

      setIsLoading(true);

      // Add student message
      const studentMsg: MessageLog = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: studentAnswer,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, studentMsg]);

      try {
        // Evaluate understanding
        const evaluation = await evaluateUnderstanding(
          studentAnswer,
          contextRef.current.learningObjective
        );

        // Generate Socratic response
        const socraticResponse = await generateSocraticResponse(studentAnswer, contextRef.current);

        // Add mentor message
        const mentorMsg: MessageLog = {
          id: `mentor-${Date.now()}`,
          role: 'mentor',
          content: socraticResponse.mentor_response,
          timestamp: Date.now(),
          type: socraticResponse.question_type,
        };

        setMessages((prev) => [...prev, mentorMsg]);
        setLastMentorState(socraticResponse.estimated_state);

        // Update context with new answer
        contextRef.current.studentAnswers = [...contextRef.current.studentAnswers, studentAnswer];

        return {
          evaluation,
          response: socraticResponse,
        };
      } catch (error) {
        console.error('[Socratic Dialogue Error]', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const reset = useCallback(() => {
    setMessages([]);
    contextRef.current.studentAnswers = [];
    setLastMentorState('FOCUS');
  }, []);

  return {
    messages,
    isLoading,
    lastMentorState,
    submitAnswer,
    reset,
    context: contextRef.current,
  };
}
