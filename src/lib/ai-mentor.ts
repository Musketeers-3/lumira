// Path: src/lib/ai-mentor.ts

import { generateText, generateObject } from "ai";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import {
  BREAKTHROUGH_PROMPT,
  buildMentorSystemPrompt,
  MENTOR_PERSONALITY_CORE,
} from "@/lib/mentor-personality";
import { getSkillTracking } from "@/lib/learning-persistence"; // IMPORT your existing Supabase utility
import { compileMentorMemory, type DBReviewRecord } from "./mentor-memory"; // IMPORT the new compiler
import type { RealmId } from "@/lib/realms";

const ollama = createOpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
});

const localModel = ollama("qwen2:1.5b");

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
 * Generate an historically aware Socratic response using Local AI & Supabase contexts
 */
export async function generateSocraticResponse(
  studentAnswer: string,
  context: SocraticContext,
  realm: RealmId, // Pass down the active realm ID for localized tracking filter checks
): Promise<SocraticResponse> {
  try {
    // 1. Fetch the user's raw skill history records directly from Supabase
    const rawSkillsData = await getSkillTracking();
    const skillsList = (rawSkillsData || []) as DBReviewRecord[];

    // 2. Synthesize history profile records into prompt tokens
    const mentorMemoryPrompt = compileMentorMemory(skillsList, realm);

    const baseSystemPrompt = buildMentorSystemPrompt(
      context.lessonTopic,
      context.learningObjective,
      context.currentStep,
      context.totalSteps,
      "FOCUS",
    );

    // 3. Assemble the historically aware system prompt block
    const fullSystemPrompt = `
${baseSystemPrompt}

${mentorMemoryPrompt}
`;

    const chatHistory = context.studentAnswers.map((a, i) => `(Step ${i + 1}): "${a}"`).join("\n");

    const userPrompt = `Student's previous answers in this active session:
${chatHistory}

Student's current fresh response: "${studentAnswer}"

Generate a structured Socratic response object following your strict guidelines (under 50 words, exactly 1 targeted question, never provide answers directly). Use clear, wise and simple language.`;

    const response = await generateObject({
      model: localModel,
      system: fullSystemPrompt, // Connected directly to the new historic profile matrix
      prompt: userPrompt,
      schema: z.object({
        mentor_response: z.string().describe("The mentor response with Socratic questions"),
        question_type: z
          .enum(["gentle_push", "revealing_challenge", "breakthrough_confirmation"])
          .describe("Type of Socratic questioning"),
        estimated_state: z
          .enum(["FOCUS", "CHALLENGE", "CELEBRATE"])
          .describe(
            "FOCUS: listening. CHALLENGE: assumption matching. CELEBRATE: breakthrough insight achieved only.",
          ),
        next_learning_prompt: z
          .string()
          .optional()
          .describe("Optional follow-up prompt if student answers well"),
      }),
    });

    return response.object as SocraticResponse;
  } catch (error) {
    console.error("[Local AI Mentor Context Integration Error]", error);
    return {
      mentor_response:
        "That is an exceptional line of thought. Let's look at the parameters we have right before us. What changes if we review our assumptions?",
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
  confidence: number;
  gaps: string[];
  strengths: string[];
}> {
  try {
    const response = await generateObject({
      model: localModel,
      prompt: `Learning objective: ${learningObjective}
Student answer: "${studentAnswer}"

Evaluate if this response demonstrates understanding. 
IMPORTANT: Return a confidence score between 0.0 and 1.0.`,
      schema: z.object({
        demonstrates_understanding: z.boolean(),
        // We relax the strict .max(1) here to be safe and normalize in the return
        confidence: z.number().describe("Confidence score between 0.0 and 1.0"),
        gaps: z.array(z.string()).describe("Conceptual gaps if any"),
        strengths: z.array(z.string()).describe("What the student got right"),
      }),
    });

    const data = response.object;

    // Normalization logic: If AI returns 10, treat as 1.0. If > 1, divide by 10.
    const normalizedConfidence = data.confidence > 1 ? data.confidence / 10 : data.confidence;

    return {
      ...data,
      confidence: Math.min(Math.max(normalizedConfidence, 0), 1),
    };
  } catch (error) {
    console.error("[Local Evaluation Error]", error);
    return {
      demonstrates_understanding: false,
      confidence: 0.5,
      gaps: ["Evaluation system error."],
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
      model: localModel, // Replaced OpenAI with local Qwen2
      system: MENTOR_PERSONALITY_CORE,
      prompt: `${BREAKTHROUGH_PROMPT}

Insight discovered: "${insight}"
Lesson context: ${context.lessonTopic}`,
    });

    return text;
  } catch (error) {
    console.error("[Local Celebration Message Error]", error);
    return `You just independently discovered something profound: ${insight}. This insight changes how you see the problem.`;
  }
}
