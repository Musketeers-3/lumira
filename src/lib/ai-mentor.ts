"use sign"; // Ensure this matches your original file's directive

import { generateText, generateObject } from "ai";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import {
  buildMentorSystemPrompt,
  BREAKTHROUGH_PROMPT,
  MENTOR_PERSONALITY_CORE,
} from "@/lib/mentor-personality";

// 1. Initialize the official OpenAI provider, but hijack the URL to point to local Ollama
const ollama = createOpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama", // The SDK requires a string here, but Ollama safely ignores it
});

// 2. Bind your local Qwen2 model
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
 * Generate a Socratic response using Local AI
 * This intelligently responds to student answers with guiding questions
 * that encourage discovery rather than direct instruction.
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
1. Keeps the response strictly under 50 words.
2. Uses simple, clear, and encouraging language.
3. Asks 1 concise, guiding question.
4. Never provides the answer directly.
5. Focuses only on the immediate logical next step.
6. In addition to point 1 that is stated, the response length can be extended only if it isgenuinely required else it should remain below 50.`;

    const response = await generateObject({
      model: localModel, // Replaced OpenAI with local Qwen2
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
    console.error("[Local AI Mentor Error]", error);
    // Fallback to a basic Socratic response if the local model fails to parse JSON
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
