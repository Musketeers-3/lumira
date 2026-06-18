/**
 * Learning Persistence Layer
 * Handles session, skill, and message persistence via REST API
 */

import * as sessionApi from '@/services/api/sessionApi';
import * as skillApi from '@/services/api/skillApi';
import type { Message } from '@/components/socratic/types';

export interface LearningSession {
  id: string;
  lessonId: string;
  topic: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  performanceScore?: number;
  stateProgression: string[];
  messagesCount: number;
  breakthrough: boolean;
}

/**
 * Create a new learning session
 */
export async function createLearningSession(
  lessonId: string,
  topic: string
): Promise<LearningSession | null> {
  try {
    const data = { lessonId, topic };
    const session = await sessionApi.createSession(data);
    return {
      id: session._id,
      lessonId: session.lessonId,
      topic: session.topic,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      durationSeconds: session.durationSeconds,
      performanceScore: session.performanceScore,
      stateProgression: session.stateProgression,
      messagesCount: session.messagesCount,
      breakthrough: session.breakthrough
    };
  } catch (error) {
    console.error('[Learning Persistence] Error creating session:', error);
    return null;
  }
}

/**
 * Update learning session progress
 */
export async function updateLearningSession(
  sessionId: string,
  updates: {
    stateProgression?: string[];
    messagesCount?: number;
    performanceScore?: number;
    breakthrough?: boolean;
  }
): Promise<boolean> {
  try {
    const updateData = {
      stateProgression: updates.stateProgression,
      messagesCount: updates.messagesCount,
      performanceScore: updates.performanceScore,
      breakthrough: updates.breakthrough
    };
    await sessionApi.updateSession(sessionId, updateData);
    return true;
  } catch (error) {
    console.error('[Learning Persistence] Error updating session:', error);
    return false;
  }
}

/**
 * Complete a learning session
 */
export async function completeLearningSession(
  sessionId: string,
  durationSeconds: number,
  performanceScore: number
): Promise<boolean> {
  try {
    await sessionApi.completeSession(sessionId, {
      durationSeconds,
      performanceScore
    });
    return true;
  } catch (error) {
    console.error('[Learning Persistence] Error completing session:', error);
    return false;
  }
}

/**
 * Save session messages
 */
export async function saveSessionMessage(
  sessionId: string,
  state: string,
  message: Message
): Promise<boolean> {
  try {
    const messageData = {
      mentorState: state,
      messageText: message.text,
      sender: message.speaker // Use 'speaker' from Message type
    };
    await sessionApi.saveMessage(sessionId, messageData);
    return true;
  } catch (error) {
    console.error('[Learning Persistence] Error saving message:', error);
    return false;
  }
}

/**
 * Get user's skill tracking
 */
export async function getSkillTracking(skillName?: string) {
  try {
    const skills = await skillApi.getSkills();
    if (skillName) {
      return skills.filter(s => s.skillName === skillName);
    }
    return skills;
  } catch (error) {
    console.error('[Learning Persistence] Error fetching skills:', error);
    return null;
  }
}

/**
 * Update skill mastery
 */
export async function updateSkillMastery(
  skillName: string,
  skillCategory: string,
  proficiencyLevel: number,
  masteryScore: number
): Promise<boolean> {
  try {
    const data = {
      skillName: skillName,
      skillCategory: skillCategory,
      proficiencyLevel: proficiencyLevel,
      masteryScore: masteryScore
    };
    await skillApi.upsertSkill(data);
    return true;
  } catch (error) {
    console.error('[Learning Persistence] Error updating skill:', error);
    return false;
  }
}

/**
 * Get user's recent sessions
 */
export async function getRecentSessions(limit: number = 10) {
  try {
    return await sessionApi.getRecentSessions(limit);
  } catch (error) {
    console.error('[Learning Persistence] Error fetching sessions:', error);
    return null;
  }
}

/**
 * Get all user sessions
 */
export async function getAllSessions() {
  try {
    return await sessionApi.getSessions();
  } catch (error) {
    console.error('[Learning Persistence] Error fetching all sessions:', error);
    return null;
  }
}