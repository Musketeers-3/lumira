import { useState, useCallback, useRef } from "react";
import {
  createLearningSession,
  updateLearningSession,
  completeLearningSession,
  saveSessionMessage,
  getSkillTracking,
  updateSkillMastery,
  getRecentSessions,
  getAllSessions,
} from "@/lib/learning-persistence";
import type { Message } from "@/components/socratic/types";

export interface UseSessionState {
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

const SESSION_STORAGE_KEY = "lumira_active_session";
const MIN_DURATION_SECONDS = 30; // Minimum session duration to save
const MIN_MESSAGES = 1; // Minimum messages to save session

interface StoredSession {
  sessionId: string;
  lessonId: string;
  topic: string;
  startTime: number;
  messageCount: number;
}

/**
 * Get stored session from localStorage
 */
function getStoredSession(): StoredSession | null {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Store session in localStorage
 */
function setStoredSession(session: StoredSession | null): void {
  try {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function useSessionPersistence() {
  const [sessionState, setSessionState] = useState<UseSessionState>({
    sessionId: null,
    isLoading: false,
    error: null,
  });

  // Track message count for this session
  const messageCountRef = useRef(0);

  /**
   * Initialize session - called when entering a lesson
   * This ONLY loads existing session from storage, does NOT create new one
   */
  const initSession = useCallback(async (lessonId: string, topic: string) => {
    // Check if we already have an active session in storage
    const stored = getStoredSession();
    if (stored && stored.sessionId) {
      console.log("[Session] Found existing session in storage:", stored.sessionId);
      messageCountRef.current = stored.messageCount;
      setSessionState({
        sessionId: stored.sessionId,
        isLoading: false,
        error: null,
      });
      return stored.sessionId;
    }

    // No existing session - don't create one yet!
    // Session will be created lazily when first message is sent
    console.log("[Session] No active session - will create on first message");
    setSessionState({
      sessionId: null,
      isLoading: false,
      error: null,
    });
    return null;
  }, []);

  /**
   * Start a new learning session - only called when first message is sent
   * This is the lazy creation pattern - session is created only when needed
   */
  const startSession = useCallback(async (lessonId: string, topic: string) => {
    // Check if we already have an active session in storage
    const stored = getStoredSession();
    if (stored && stored.sessionId) {
      console.log("[Session] Reusing existing session:", stored.sessionId);
      messageCountRef.current = stored.messageCount;
      setSessionState({
        sessionId: stored.sessionId,
        isLoading: false,
        error: null,
      });
      return stored.sessionId;
    }

    setSessionState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const session = await createLearningSession(lessonId, topic);
      if (session) {
        const startTime = Date.now();
        messageCountRef.current = 0;

        // Store session info for persistence across navigation
        setStoredSession({
          sessionId: session.id,
          lessonId,
          topic,
          startTime,
          messageCount: 0,
        });

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
   * Ensure session exists - creates if needed, returns existing if present
   * Call this BEFORE logging a message to ensure we have a session
   */
  const ensureSession = useCallback(
    async (lessonId: string, topic: string): Promise<string | null> => {
      const stored = getStoredSession();
      if (stored && stored.sessionId) {
        messageCountRef.current = stored.messageCount;
        setSessionState({
          sessionId: stored.sessionId,
          isLoading: false,
          error: null,
        });
        return stored.sessionId;
      }

      // Need to create new session
      return startSession(lessonId, topic);
    },
    [startSession],
  );

  /**
   * Update session with new state and message count
   */
  const updateSession = useCallback(
    async (sessionId: string, stateProgression: string[], messageCount: number) => {
      if (!sessionId) return false;

      // Update storage with message count
      const stored = getStoredSession();
      if (stored) {
        setStoredSession({ ...stored, messageCount });
      }

      return updateLearningSession(sessionId, {
        stateProgression: stateProgression,
        messagesCount: messageCount,
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
   * This creates the session lazily if it doesn't exist
   */
  const logMessage = useCallback(
    async (sessionId: string, state: string, message: Message) => {
      // If no sessionId, we need to create one first (lazy creation)
      let actualSessionId = sessionId;
      if (!actualSessionId) {
        // Get lesson info from storage or use defaults
        const stored = getStoredSession();
        const lessonId = stored?.lessonId || "dynamic-session";
        const topic = stored?.topic || "Learning Session";

        actualSessionId = await startSession(lessonId, topic);
        if (!actualSessionId) return false;
      }

      messageCountRef.current += 1;

      // Update stored message count
      const stored = getStoredSession();
      if (stored) {
        setStoredSession({ ...stored, messageCount: messageCountRef.current });
      }

      return saveSessionMessage(actualSessionId, state, message);
    },
    [startSession],
  );

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

  /**
   * Fetch all sessions for journal
   */
  const fetchAllSessions = useCallback(async () => {
    return getAllSessions();
  }, []);

  /**
   * End and clear the current session (call when user navigates away)
   * Only saves if session had meaningful activity
   */
  const clearSession = useCallback(async () => {
    const stored = getStoredSession();
    if (!stored || !stored.sessionId) {
      return; // No session to clear
    }

    const durationSeconds = Math.floor((Date.now() - stored.startTime) / 1000);
    const messageCount = messageCountRef.current;

    console.log(
      "[Session] Checking session for save - Duration:",
      durationSeconds,
      "seconds, Messages:",
      messageCount,
    );

    // Only save session if it meets minimum criteria
    const hasMeaningfulActivity =
      messageCount >= MIN_MESSAGES || durationSeconds >= MIN_DURATION_SECONDS;

    if (hasMeaningfulActivity) {
      // Calculate score based on message count and duration
      const score = Math.min(100, Math.floor(messageCount * 10 + durationSeconds / 5));

      await completeLearningSession(stored.sessionId, durationSeconds, score);
      console.log(
        "[Session] Saved session:",
        stored.sessionId,
        "Duration:",
        durationSeconds,
        "s, Messages:",
        messageCount,
        "Score:",
        score,
      );
    } else {
      console.log("[Session] Discarded empty session (no meaningful activity)");
    }

    // Clear storage and state
    messageCountRef.current = 0;
    setStoredSession(null);
    setSessionState({
      sessionId: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...sessionState,
    initSession,
    startSession,
    ensureSession,
    updateSession,
    markBreakthrough,
    endSession,
    logMessage,
    fetchSkills,
    updateSkill,
    fetchRecentSessions,
    fetchAllSessions,
    clearSession,
  };
}
