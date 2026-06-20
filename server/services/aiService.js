import axios from "axios";
import config from "../config/env.js";

/**
 * AI Service
 * Handles all Ollama AI interactions
 * All AI calls go through this service - frontend never calls Ollama directly
 */

// Create axios instance for Ollama
const ollamaClient = axios.create({
  baseURL: config.ollamaBaseUrl,
  timeout: 60000, // 60 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Generate text using Ollama
 * @param {string} prompt - User prompt
 * @param {string} system - System prompt
 * @returns {Promise<string>} Generated text
 */
export const generateText = async (prompt, system = "") => {
  try {
    const response = await ollamaClient.post("/chat/completions", {
      model: config.ollamaModel,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        { role: "user", content: prompt },
      ],
      stream: false,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("[AI Service] generateText error:", error.message);
    throw new Error("Failed to generate text from AI");
  }
};

/**
 * Generate structured object using Ollama
 * @param {string} prompt - User prompt
 * @param {string} system - System prompt
 * @param {object} schema - Zod schema for structured output
 * @returns {Promise<object>} Parsed object
 */
export const generateObject = async (prompt, system = "", schema) => {
  // For now, we use generateText and parse the response
  // In production, you might want to use a library that supports structured output
  try {
    const text = await generateText(prompt, system);

    // Try to parse as JSON if schema suggests JSON
    if (schema) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return { text };
  } catch (error) {
    console.error("[AI Service] generateObject error:", error.message);
    throw new Error("Failed to generate structured output from AI");
  }
};

/**
 * Generate Socratic response
 * @param {string} studentAnswer - Student's current answer
 * @param {object} context - Socratic context
 * @param {string} realm - Active realm ID
 * @param {Array} skillsList - User's skill history
 * @returns {Promise<object>} Socratic response
 */
export const generateSocraticResponse = async (studentAnswer, context, realm, skillsList) => {
  const systemPrompt = buildSocraticSystemPrompt(context, skillsList, realm);

  const chatHistory = context.studentAnswers.map((a, i) => `(Step ${i + 1}): "${a}"`).join("\n");

  const userPrompt = `Student's previous answers in this active session:
${chatHistory}

Student's current fresh response: "${studentAnswer}"

Generate a structured Socratic response (under 50 words, exactly 1 targeted question, never provide answers directly). Return as JSON with fields: mentor_response, question_type (gentle_push|reveal_challenge|breakthrough_confirmation), estimated_state (FOCUS|CHALLENGE|CELEBRATE).`;

  const result = await generateObject(userPrompt, systemPrompt, true);

  return {
    mentor_response:
      result.mentor_response ||
      result.text ||
      "That's an interesting perspective. What would happen if we looked at it from a different angle?",
    question_type: result.question_type || "gentle_push",
    estimated_state: result.estimated_state || "FOCUS",
  };
};

/**
 * Evaluate student understanding
 * @param {string} studentAnswer - Student's answer
 * @param {string} learningObjective - Learning objective
 * @returns {Promise<object>} Evaluation result
 */
export const evaluateUnderstanding = async (studentAnswer, learningObjective) => {
  const prompt = `Learning objective: ${learningObjective}
Student answer: "${studentAnswer}"

Evaluate if this response demonstrates understanding.
Return JSON with: demonstrates_understanding (boolean), confidence (0.0-1.0), gaps (array of strings), strengths (array of strings).`;

  const result = await generateObject(prompt, "", true);

  return {
    demonstrates_understanding: result.demonstrates_understanding || false,
    confidence: Math.min(Math.max(result.confidence || 0.5, 0), 1),
    gaps: result.gaps || [],
    strengths: result.strengths || [],
  };
};

/**
 * Generate breakthrough celebration message
 * @param {string} insight - The insight discovered
 * @param {object} context - Lesson context
 * @returns {Promise<string>} Celebration message
 */
export const generateBreakthroughMessage = async (insight, context) => {
  const systemPrompt = `You are a wise mentor celebrating a student's breakthrough discovery.
Be concise, warm, and inspiring.`;

  const prompt = `A student has just discovered something profound: "${insight}"
Lesson topic: ${context.lessonTopic}

Generate a brief celebration message (under 30 words) that acknowledges their breakthrough.`;

  const result = await generateText(prompt, systemPrompt);

  return (
    result ||
    `You just discovered something profound: ${insight}. This insight changes how you see the problem.`
  );
};

/**
 * Build Socratic system prompt with user history
 */
const buildSocraticSystemPrompt = (context, skillsList, realm) => {
  const basePrompt = `You are a Socratic mentor guiding a student through learning.
- Ask probing questions, never give answers directly
- Adapt to the student's current state (FOCUS, CHALLENGE, CELEBRATE)
- Keep responses under 50 words
- Use clear, wise, and simple language

Current lesson: ${context.lessonTopic}
Learning objective: ${context.learningObjective}
Current step: ${context.currentStep} of ${context.totalSteps}`;

  // Add user skill history if available
  if (skillsList && skillsList.length > 0) {
    const recentSkills = skillsList
      .filter((s) => s.status === "unlocked")
      .slice(0, 5)
      .map((s) => `- ${s.skillName}: ${s.insight || "discovered"}`)
      .join("\n");

    if (recentSkills) {
      return `${basePrompt}

User's previous discoveries:
${recentSkills}`;
    }
  }

  return basePrompt;
};

export default {
  generateText,
  generateObject,
  generateSocraticResponse,
  evaluateUnderstanding,
  generateBreakthroughMessage,
};
