// Path: src/lib/ai-mentor.ts

import {
  socraticResponse as apiSocraticResponse,
  evaluateStudent as apiEvaluate,
  breakthroughCelebration as apiBreakthrough,
  type SocraticContext,
  type SocraticResponse,
  type EvaluateResponse
} from '@/services/api/aiApi';

/**
 * Generate an historically aware Socratic response using Local AI via backend
 * All AI calls now go through REST API
 */
export async function generateSocraticResponse(
  studentAnswer: string,
  context: SocraticContext,
  realm: string // Pass down the active realm ID for localized tracking filter checks
): Promise<SocraticResponse> {
  try {
    // Delegate to backend AI service
    const response = await apiSocraticResponse({
      studentAnswer,
      context,
      realm
    });
    return response;
  } catch (error) {
    console.error("[Socratic Response Error]", error);
    return {
      mentor_response:
        "That is an exceptional line of thought. Let's look at the parameters we have right before us. What changes if we review our assumptions?",
      question_type: "gentle_push",
      estimated_state: "FOCUS"
    };
  }
}

/**
 * Evaluate whether a student response shows understanding
 */
export async function evaluateUnderstanding(
  studentAnswer: string,
  learningObjective: string
): Promise<EvaluateResponse> {
  try {
    const response = await apiEvaluate({
      studentAnswer,
      learningObjective
    });
    return response;
  } catch (error) {
    console.error("[Evaluation Error]", error);
    return {
      demonstrates_understanding: false,
      confidence: 0.5,
      gaps: ["Evaluation system error."],
      strengths: []
    };
  }
}

/**
 * Generate a breakthrough celebration message
 */
export async function generateBreakthroughMessage(
  insight: string,
  context: SocraticContext
): Promise<string> {
  try {
    const message = await apiBreakthrough({
      insight,
      context
    });
    return message;
  } catch (error) {
    console.error("[Celebration Message Error]", error);
    return `You just independently discovered something profound: ${insight}. This insight changes how you see the problem.`;
  }
}

// Re-export types for convenience
export type { SocraticContext, SocraticResponse };