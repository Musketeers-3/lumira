import { useState, useCallback } from "react";
import {
  createLearningSession,
  updateLearningSession,
  completeLearningSession,
  saveSessionMessage,
  getSkillTracking,
  updateSkillMastery,
  getRecentSessions,
} from "@/lib/learning-persistence";
import type { Message } from "@/components/socratic/types";

export interface UseSessionState {
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useSessionPersistence() {
  const [sessionState, setSessionState] = useState<UseSessionState>({
    sessionId: null,
    isLoading: false,
    error: null,
  });

  /**
   * Start a new learning session
   */
  const startSession = useCallback(async (lessonId: string, topic: string) => {
    setSessionState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const session = await createLearningSession(lessonId, topic);
      if (session) {
        setSessionState({
          sessionId: session.id,
          isLoading: false,
          error: null,
        });
        return session.id;
      } else {
        throw new Error("Failed to create session");
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown error";
      setSessionState((prev) => ({ ...prev, isLoading: false, error }));
      return null;
    }
  }, []);

  /**
   * Update session with new state and message count
   */
  const updateSession = useCallback(
    async (sessionId: string, stateProgression: string[], messageCount: number) => {
      if (!sessionId) return false;
      return updateLearningSession(sessionId, {
        state_progression: stateProgression,
        messages_count: messageCount,
      });
    },
    [],
  );

  /**
   * Mark session as breakthrough
   */
  const markBreakthrough = useCallback(async (sessionId: string) => {
    if (!sessionId) return false;
    return updateLearningSession(sessionId, { breakthrough: true });
  }, []);

  /**
   * Complete the current session
   */
  const endSession = useCallback(
    async (sessionId: string, durationSeconds: number, performanceScore: number) => {
      if (!sessionId) return false;
      return completeLearningSession(sessionId, durationSeconds, performanceScore);
    },
    [],
  );

  /**
   * Save a message from the session
   */
  const logMessage = useCallback(async (sessionId: string, state: string, message: Message) => {
    if (!sessionId) return false;
    return saveSessionMessage(sessionId, state, message);
  }, []);

  /**
   * Get user's skill data
   */
  const fetchSkills = useCallback(async (skillName?: string) => {
    return getSkillTracking(skillName);
  }, []);

  /**
   * Update skill mastery level
   */
  const updateSkill = useCallback(
    async (
      skillName: string,
      skillCategory: string,
      proficiencyLevel: number,
      masteryScore: number,
    ) => {
      return updateSkillMastery(skillName, skillCategory, proficiencyLevel, masteryScore);
    },
    [],
  );

  /**
   * Fetch recent sessions for dashboard
   */
  const fetchRecentSessions = useCallback(async (limit?: number) => {
    return getRecentSessions(limit);
  }, []);

  return {
    ...sessionState,
    startSession,
    updateSession,
    markBreakthrough,
    endSession,
    logMessage,
    fetchSkills,
    updateSkill,
    fetchRecentSessions,
  };
}
