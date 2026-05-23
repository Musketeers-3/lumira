import { createClient } from "./supabase/client";
import type { Message } from "@/components/socratic/types";

export interface LearningSession {
  id: string;
  lesson_id: string;
  topic: string;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  performance_score?: number;
  state_progression: string[];
  messages_count: number;
  breakthrough: boolean;
}

/**
 * Create a new learning session
 */
export async function createLearningSession(
  lessonId: string,
  topic: string,
): Promise<LearningSession | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("learning_sessions")
    .insert({
      user_id: user.id,
      lesson_id: lessonId,
      topic,
    })
    .select()
    .single();

  if (error) {
    console.error("[Learning Persistence] Error creating session:", error);
    return null;
  }

  return data;
}

/**
 * Update learning session progress
 */
export async function updateLearningSession(
  sessionId: string,
  updates: {
    state_progression?: string[];
    messages_count?: number;
    performance_score?: number;
    breakthrough?: boolean;
  },
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("learning_sessions").update(updates).eq("id", sessionId);

  if (error) {
    console.error("[Learning Persistence] Error updating session:", error);
    return false;
  }

  return true;
}

/**
 * Complete a learning session
 */
export async function completeLearningSession(
  sessionId: string,
  durationSeconds: number,
  performanceScore: number,
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("learning_sessions")
    .update({
      completed_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
      performance_score: performanceScore,
    })
    .eq("id", sessionId);

  if (error) {
    console.error("[Learning Persistence] Error completing session:", error);
    return false;
  }

  return true;
}

/**
 * Save session messages
 */
export async function saveSessionMessage(
  sessionId: string,
  state: string,
  message: Message,
): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase.from("session_messages").insert({
    session_id: sessionId,
    user_id: user.id,
    mentor_state: state,
    message_text: message.text,
    sender: message.sender,
    message_type: "text",
  });

  if (error) {
    console.error("[Learning Persistence] Error saving message:", error);
    return false;
  }

  return true;
}

/**
 * Get user's skill tracking
 */
export async function getSkillTracking(skillName?: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let query = supabase.from("skill_tracking").select("*").eq("user_id", user.id);

  if (skillName) {
    query = query.eq("skill_name", skillName);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[Learning Persistence] Error fetching skills:", error);
    return null;
  }

  return data;
}

/**
 * Update skill mastery
 */
export async function updateSkillMastery(
  skillName: string,
  skillCategory: string,
  proficiencyLevel: number,
  masteryScore: number,
): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase.from("skill_tracking").upsert(
    {
      user_id: user.id,
      skill_name: skillName,
      skill_category: skillCategory,
      proficiency_level: proficiencyLevel,
      mastery_score: masteryScore,
      last_practiced: new Date().toISOString(),
      times_practiced: proficiencyLevel + 1,
    },
    { onConflict: "user_id,skill_name" },
  );

  if (error) {
    console.error("[Learning Persistence] Error updating skill:", error);
    return false;
  }

  return true;
}

/**
 * Get user's recent sessions
 */
export async function getRecentSessions(limit: number = 10) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("learning_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[Learning Persistence] Error fetching sessions:", error);
    return null;
  }

  return data;
}
