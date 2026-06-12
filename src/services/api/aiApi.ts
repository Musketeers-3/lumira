import apiClient from './apiClient';

/**
 * AI API
 * AI-powered learning endpoints (Socratic method, evaluation, breakthrough)
 */

export interface SocraticContext {
  lessonTopic: string;
  learningObjective: string;
  studentAnswers: string[];
  currentStep: number;
  totalSteps: number;
}

export interface SocraticResponse {
  mentor_response: string;
  question_type: 'gentle_push' | 'revealing_challenge' | 'breakthrough_confirmation';
  estimated_state: 'FOCUS' | 'CHALLENGE' | 'CELEBRATE';
  next_learning_prompt?: string;
}

export interface EvaluateResponse {
  demonstrates_understanding: boolean;
  confidence: number;
  gaps: string[];
  strengths: string[];
}

export interface SocraticRequestData {
  studentAnswer: string;
  context: SocraticContext;
  realm: string;
}

export interface EvaluateRequestData {
  studentAnswer: string;
  learningObjective: string;
}

export interface BreakthroughRequestData {
  insight: string;
  context: SocraticContext;
}

/**
 * Generate Socratic response
 */
export const socraticResponse = async (data: SocraticRequestData): Promise<SocraticResponse> => {
  const response = await apiClient.post<{ success: boolean; data: SocraticResponse }>(
    '/ai/socratic',
    data
  );
  return response.data.data;
};

/**
 * Evaluate student understanding
 */
export const evaluateStudent = async (
  data: EvaluateRequestData
): Promise<EvaluateResponse> => {
  const response = await apiClient.post<{ success: boolean; data: EvaluateResponse }>(
    '/ai/evaluate',
    data
  );
  return response.data.data;
};

/**
 * Generate breakthrough celebration message
 */
export const breakthroughCelebration = async (
  data: BreakthroughRequestData
): Promise<string> => {
  const response = await apiClient.post<{ success: boolean; data: string }>(
    '/ai/breakthrough',
    data
  );
  return response.data.data;
};

export default {
  socraticResponse,
  evaluateStudent,
  breakthroughCelebration
};