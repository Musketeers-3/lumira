export interface LessonStep {
  id: string;
  state: "IDLE" | "FOCUS" | "CHALLENGE" | "CELEBRATE";
  mentorMessage: string;
  studentPrompt: string;
  expectedConcepts: string[];
  celebrate: boolean;
  order: number;
}

export interface LessonDraft {
  id: string;
  title: string;
  description: string;
  topic: string;
  targetSkills: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  steps: LessonStep[];
  estimatedDuration: number; // in minutes
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}
