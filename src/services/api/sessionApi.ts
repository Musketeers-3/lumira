import apiClient from './apiClient';

/**
 * Session API
 * Learning session endpoints
 */

export interface SessionMessage {
  _id: string;
  sessionId: string;
  mentorState: string;
  messageText: string;
  sender: 'mentor' | 'student';
  messageType: 'text';
  createdAt: string;
}

export interface LearningSession {
  _id: string;
  userId: string;
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

export interface CreateSessionData {
  lessonId: string;
  topic: string;
}

export interface UpdateSessionData {
  stateProgression?: string[];
  messagesCount?: number;
  performanceScore?: number;
  breakthrough?: boolean;
}

export interface CompleteSessionData {
  durationSeconds: number;
  performanceScore: number;
}

export interface SaveMessageData {
  mentorState?: string;
  messageText: string;
  sender: 'mentor' | 'student';
  messageType?: 'text';
}

/**
 * Create a new learning session
 */
export const createSession = async (data: CreateSessionData): Promise<LearningSession> => {
  const response = await apiClient.post<{ success: boolean; data: LearningSession }>(
    '/sessions',
    data
  );
  return response.data.data;
};

/**
 * Update a learning session
 */
export const updateSession = async (
  sessionId: string,
  data: UpdateSessionData
): Promise<LearningSession> => {
  const response = await apiClient.put<{ success: boolean; data: LearningSession }>(
    `/sessions/${sessionId}`,
    data
  );
  return response.data.data;
};

/**
 * Complete a learning session
 */
export const completeSession = async (
  sessionId: string,
  data: CompleteSessionData
): Promise<LearningSession> => {
  const response = await apiClient.put<{ success: boolean; data: LearningSession }>(
    `/sessions/${sessionId}/complete`,
    data
  );
  return response.data.data;
};

/**
 * Get all user sessions
 */
export const getSessions = async (): Promise<LearningSession[]> => {
  const response = await apiClient.get<{ success: boolean; data: LearningSession[] }>(
    '/sessions'
  );
  return response.data.data;
};

/**
 * Get recent sessions
 */
export const getRecentSessions = async (limit: number = 10): Promise<LearningSession[]> => {
  const response = await apiClient.get<{ success: boolean; data: LearningSession[] }>(
    `/sessions/recent?limit=${limit}`
  );
  return response.data.data;
};

/**
 * Save a session message
 */
export const saveMessage = async (
  sessionId: string,
  data: SaveMessageData
): Promise<SessionMessage> => {
  const response = await apiClient.post<{ success: boolean; data: SessionMessage }>(
    `/sessions/${sessionId}/messages`,
    data
  );
  return response.data.data;
};

/**
 * Get session messages
 */
export const getMessages = async (sessionId: string): Promise<SessionMessage[]> => {
  const response = await apiClient.get<{ success: boolean; data: SessionMessage[] }>(
    `/sessions/${sessionId}/messages`
  );
  return response.data.data;
};

export default {
  createSession,
  updateSession,
  completeSession,
  getSessions,
  getRecentSessions,
  saveMessage,
  getMessages
};