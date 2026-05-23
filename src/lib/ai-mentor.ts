"use server";

import { generateText, generateObject } from "ai";
import { z } from "zod";
import {
  buildMentorSystemPrompt,
  BREAKTHROUGH_PROMPT,
  MENTOR_PERSONALITY_CORE,
} from "@/lib/mentor-personality";
const model = "openai/gpt-4o-mini";

export interface SocraticContext {
  lessonTopic: string;
  learningObjective: string;
  studentAnswers: string[];
  currentStep: number;
  totalSteps: number;
}

export interface SocraticResponse {
  mentor_response: string;
  question_type: "gentle_push" | "revealing_challenge" | "breakthrough_confirmation";
  estimated_state: "FOCUS" | "CHALLENGE" | "CELEBRATE";
  next_learning_prompt?: string;
}

/**
 * Generate a Socratic response using AI
 * This intelligently responds to student answers with guiding questions
 * that encourage discovery rather than direct instruction
 */
export async function generateSocraticResponse(
  studentAnswer: string,
  context: SocraticContext,
): Promise<SocraticResponse> {
  try {
    const systemPrompt = buildMentorSystemPrompt(
      context.lessonTopic,
      context.learningObjective,
      context.currentStep,
      context.totalSteps,
      "FOCUS",
    );

    const userPrompt = `Student's previous answers: ${context.studentAnswers.map((a, i) => `(Step ${i + 1}): "${a}"`).join(" ")}

Student's current response: "${studentAnswer}"

Generate a Socratic response that:
1. Acknowledges what the student said with genuine appreciation
2. Asks 1-2 powerful questions that deepen their thinking
3. Never provides the answer directly
4. Gently reveals logical implications of their thinking`;

    const response = await generateObject({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      schema: z.object({
        mentor_response: z.string().describe("The mentor response with Socratic questions"),
        question_type: z
          .enum(["gentle_push", "revealing_challenge", "breakthrough_confirmation"])
          .describe("Type of Socratic questioning"),
        estimated_state: z
          .enum(["FOCUS", "CHALLENGE", "CELEBRATE"])
          .describe(
            "FOCUS: patient listening. CHALLENGE: direct scale/assumption questions, believing tone. CELEBRATE: quiet pride after breakthrough only.",
          ),
        next_learning_prompt: z
          .string()
          .optional()
          .describe("Optional follow-up prompt if student answers well"),
      }),
    });

    return response.object as SocraticResponse;
  } catch (error) {
    console.error("[AI Mentor Error]", error);
    // Fallback to a basic Socratic response
    return {
      mentor_response:
        "That's interesting. Let me ask you this: what assumption are you making in your approach?",
      question_type: "gentle_push",
      estimated_state: "FOCUS",
    };
  }
}

/**
 * Evaluate whether a student response shows understanding
 */
export async function evaluateUnderstanding(
  studentAnswer: string,
  learningObjective: string,
): Promise<{
  demonstrates_understanding: boolean;
  confidence: number; // 0-1
  gaps: string[];
  strengths: string[];
}> {
  try {
    const response = await generateObject({
      model,
      prompt: `Learning objective: ${learningObjective}
Student answer: "${studentAnswer}"

Evaluate if this response demonstrates understanding of the learning objective.`,
      schema: z.object({
        demonstrates_understanding: z.boolean(),
        confidence: z.number().min(0).max(1),
        gaps: z.array(z.string()).describe("Conceptual gaps if any"),
        strengths: z.array(z.string()).describe("What the student got right"),
      }),
    });

    return response.object;
  } catch (error) {
    console.error("[Evaluation Error]", error);
    return {
      demonstrates_understanding: false,
      confidence: 0.5,
      gaps: [],
      strengths: [],
    };
  }
}

/**
 * Generate a breakthrough celebration message
 */
export async function generateBreakthroughMessage(
  insight: string,
  context: SocraticContext,
): Promise<string> {
  try {
    const { text } = await generateText({
      model,
      system: MENTOR_PERSONALITY_CORE,
      prompt: `${BREAKTHROUGH_PROMPT}

Insight discovered: "${insight}"
Lesson context: ${context.lessonTopic}`,
    });

    return text;
  } catch (error) {
    console.error("[Celebration Message Error]", error);
    return `You just independently discovered something profound: ${insight}. This insight changes how you see the problem.`;
  }
}
