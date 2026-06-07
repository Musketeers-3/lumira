import { useCallback, useRef, useState } from "react";
import type { SocraticContext, SocraticResponse } from "@/lib/ai-mentor";
import { generateSocraticResponse } from "@/lib/ai-mentor";
import { RealmId } from "@/lib/realms";

export interface MessageLog {
  id: string;
  role: "user" | "mentor";
  content: string;
  timestamp: number;
  type?: "gentle_push" | "revealing_challenge" | "breakthrough_confirmation";
}

export function useSocraticDialogue(initialContext: SocraticContext, realm: RealmId) {
  // Accept active realm here
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMentorState, setLastMentorState] = useState<"FOCUS" | "CHALLENGE" | "CELEBRATE">(
    "FOCUS",
  );
  const contextRef = useRef<SocraticContext>(initialContext);

  const submitAnswer = useCallback(
    async (studentAnswer: string) => {
      if (!studentAnswer.trim() || isLoading) return;

      setIsLoading(true);

      const studentMsg: MessageLog = {
        id: `user-${Date.now()}`,
        role: "user",
        content: studentAnswer,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, studentMsg]);

      try {
        // Pass the structural realm down into the generation engine room execution run
        const response = await generateSocraticResponse(studentAnswer, contextRef.current, realm);

        const mentorMsg: MessageLog = {
          id: `mentor-${Date.now()}`,
          role: "mentor",
          content: response.mentor_response,
          timestamp: Date.now(),
          type: response.question_type,
        };

        setMessages((prev) => [...prev, mentorMsg]);
        if (response.estimated_state) {
          setLastMentorState(response.estimated_state);
        }

        contextRef.current.studentAnswers = [...contextRef.current.studentAnswers, studentAnswer];

        return {
          response,
        };
      } catch (error) {
        console.error("[Socratic Dialogue Core Pipeline Exception]", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, realm], // Add realm token to the useCallback dependency map lock parameter
  );

  const reset = useCallback(() => {
    setMessages([]);
    contextRef.current.studentAnswers = [];
    setLastMentorState("FOCUS");
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
