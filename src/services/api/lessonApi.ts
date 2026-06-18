import apiClient from './apiClient';

/**
 * Lesson API
 * Lesson draft endpoints
 */

export type LessonRealm = 'physics' | 'chemistry' | 'biology' | 'math' | 'history';
export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonDraft {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  topic: string;
  realm?: LessonRealm;
  targetSkills: string[];
  difficulty: LessonDifficulty;
  steps: unknown[];
  estimatedDuration: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Discovery lesson with progress info
export interface DiscoverLesson extends LessonDraft {
  status: LessonStatus;
  progress: number;
  sessionId?: string;
}

export interface DiscoverLessonsParams {
  realm?: LessonRealm;
  difficulty?: LessonDifficulty;
  search?: string;
  sort?: 'newest' | 'oldest' | 'title' | 'progress' | 'recommended';
}

export interface CreateLessonData {
  title: string;
  description?: string;
  topic: string;
  realm?: LessonRealm;
  targetSkills?: string[];
  difficulty?: LessonDifficulty;
  steps?: unknown[];
  estimatedDuration?: number;
}

export interface UpdateLessonData {
  title?: string;
  description?: string;
  topic?: string;
  targetSkills?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  steps?: unknown[];
  estimatedDuration?: number;
}

/**
 * Get all user lesson drafts
 */
export const getLessons = async (): Promise<LessonDraft[]> => {
  const response = await apiClient.get<{ success: boolean; data: LessonDraft[] }>('/lessons');
  return response.data.data;
};

/**
 * Get published lessons for discovery with user progress
 */
export const getDiscoverLessons = async (params?: DiscoverLessonsParams): Promise<DiscoverLesson[]> => {
  const queryParams = new URLSearchParams();
  if (params?.realm) queryParams.set('realm', params.realm);
  if (params?.difficulty) queryParams.set('difficulty', params.difficulty);
  if (params?.search) queryParams.set('search', params.search);
  if (params?.sort) queryParams.set('sort', params.sort);

  const queryString = queryParams.toString();
  const url = queryString ? `/lessons/discover?${queryString}` : '/lessons/discover';

  const response = await apiClient.get<{ success: boolean; data: DiscoverLesson[] }>(url);
  return response.data.data;
};

/**
 * Create a new lesson draft
 */
export const createLesson = async (data: CreateLessonData): Promise<LessonDraft> => {
  const response = await apiClient.post<{ success: boolean; data: LessonDraft }>(
    '/lessons',
    data
  );
  return response.data.data;
};

/**
 * Update a lesson draft
 */
export const updateLesson = async (
  lessonId: string,
  data: UpdateLessonData
): Promise<LessonDraft> => {
  const response = await apiClient.put<{ success: boolean; data: LessonDraft }>(
    `/lessons/${lessonId}`,
    data
  );
  return response.data.data;
};

/**
 * Delete a lesson draft
 */
export const deleteLesson = async (lessonId: string): Promise<boolean> => {
  const response = await apiClient.delete<{ success: boolean }>(`/lessons/${lessonId}`);
  return response.data.success;
};

/**
 * Publish a lesson draft
 */
export const publishLesson = async (lessonId: string): Promise<LessonDraft> => {
  const response = await apiClient.put<{ success: boolean; data: LessonDraft }>(
    `/lessons/${lessonId}/publish`
  );
  return response.data.data;
};

export default {
  getLessons,
  getDiscoverLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  publishLesson
};