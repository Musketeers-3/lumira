// Path: src/lib/mentor-memory.ts

import type { RealmId } from "@/lib/realms";

export interface DBReviewRecord {
  skill_name: string;
  skill_category: string;
  mastery_score?: number;
  status: "unlocked" | "in-progress" | "locked";
  insight?: string;
  last_practiced?: string;
}

/**
 * Compiles database tracking rows into a structured text profile for local AI models.
 * Strictly optimized for low-parameter tokens windows.
 */
export function compileMentorMemory(skills: DBReviewRecord[], currentRealm: RealmId): string {
  if (!skills || skills.length === 0) {
    return "This is the child's very first interaction in Lumira. Be exceptionally encouraging, warm, patient, and welcoming.";
  }

  // Extract milestones (completed stars) across the application
  const milestones = skills
    .filter((s) => s.status === "unlocked")
    .map(
      (s) =>
        `- Mastered "${s.skill_name}" in ${s.skill_category}: They concluded that "${s.insight ?? "No recorded insight"}"`,
    );

  // Extract current friction points (skills currently marked in-progress)
  const struggles = skills
    .filter((s) => s.status === "in-progress")
    .map((s) => `- Currently wrestling with: "${s.skill_name}"`);

  let profile = "CHILD'S COGNITIVE HISTORY PROFILE:\n";

  if (milestones.length > 0) {
    profile += `\nPast Breakthrough Insights (Use these to build cross-concept analogies if relevant):\n${milestones.slice(-3).join("\n")}\n`;
  }

  if (struggles.length > 0) {
    profile += `\nActive Core Friction Points:\n${struggles.slice(-2).join("\n")}\n`;
  }

  profile += `\nCRITICAL CONSTRAINTS: Do not list these accomplishments out of nowhere. Instead, if the child gets stuck on the current objective, look at what they mastered previously and wrap your Socratic guiding question inside a warm, contextual analogy they already understand.`;

  return profile;
}
