import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { LessonBuilder } from "@/components/lesson-builder/LessonBuilder";
import { LessonsList } from "@/components/lesson-builder/LessonsList";
import * as lessonApi from '@/services/api/lessonApi';
import type { LessonDraft } from "@/types/lesson";

export const Route = createFileRoute("/lesson-builder")({
  head: () => ({
    meta: [
      { title: "Lesson Builder — Lumira" },
      { name: "description", content: "Construct guided Socratic pathways." },
    ],
  }),
  component: LessonBuilderPage,
});

// --- API-based Lesson Persistence ---
// All lesson operations now go through REST API

function createNewLessonDraft(): LessonDraft {
  const now = new Date().toISOString();
  return {
    id: Math.random().toString(36).slice(2, 11),
    title: "Untitled Lesson",
    description: "",
    topic: "",
    targetSkills: [],
    difficulty: "beginner",
    steps: [],
    estimatedDuration: 15,
    createdBy: "teacher",
    createdAt: now,
    updatedAt: now,
    isPublished: false,
  };
}

// --- The Main Route Component ---
function LessonBuilderPage() {
  const queryClient = useQueryClient();
  const [editingLesson, setEditingLesson] = useState<LessonDraft | null>(null);

  // TanStack Query: Fetch lessons from API
  const { data: lessons = [], isLoading } = useQuery<LessonDraft[]>({
    queryKey: ["lessons"],
    queryFn: async () => {
      try {
        const apiLessons = await lessonApi.getLessons();
        // Map API response to local LessonDraft format
        return apiLessons.map(l => ({
          id: l._id,
          title: l.title,
          description: l.description,
          topic: l.topic,
          targetSkills: l.targetSkills || [],
          difficulty: l.difficulty,
          steps: l.steps || [],
          estimatedDuration: l.estimatedDuration || 15,
          createdBy: 'teacher',
          createdAt: l.createdAt,
          updatedAt: l.updatedAt,
          isPublished: l.isPublished
        }));
      } catch (error) {
        console.error('[Lesson Builder] Error fetching lessons:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // TanStack Mutations: Handle API writes and auto-invalidate cache
  const saveMutation = useMutation({
    mutationFn: async (lesson: LessonDraft) => {
      const data = {
        title: lesson.title,
        description: lesson.description,
        topic: lesson.topic,
        targetSkills: lesson.targetSkills,
        difficulty: lesson.difficulty as 'beginner' | 'intermediate' | 'advanced',
        steps: lesson.steps,
        estimatedDuration: lesson.estimatedDuration
      };

      if (lesson.id && lesson.id.length > 11) {
        // Existing lesson - update
        return lessonApi.updateLesson(lesson.id, data);
      } else {
        // New lesson - create
        return lessonApi.createLesson(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      setEditingLesson(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      // Only delete if it's a real MongoDB ID (longer than local IDs)
      if (id.length > 11) {
        return lessonApi.deleteLesson(id);
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => {
      // Only publish if it's a real MongoDB ID
      if (id.length > 11) {
        return lessonApi.publishLesson(id);
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });

  // --- Render Handlers ---

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--gold-soft)" }} />
        <div
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "var(--ink-tertiary)" }}
        >
          Initializing Builder Engine...
        </div>
      </div>
    );
  }

  if (editingLesson) {
    return (
      <div className="animate-in fade-in duration-500">
        <button
          onClick={() => setEditingLesson(null)}
          className="fixed left-6 top-24 z-50 rounded-lg px-4 py-2 text-sm transition-all duration-300"
          style={{
            background: "var(--bg-onyx)",
            border: "1px solid var(--hairline-strong)",
            color: "var(--ink-secondary)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-secondary)")}
        >
          ← Back to Vault
        </button>
        <LessonBuilder
          initialLesson={editingLesson}
          onSave={async (lesson) => await saveMutation.mutateAsync(lesson)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
      <LessonsList
        lessons={lessons}
        onNewLesson={() => setEditingLesson(createNewLessonDraft())}
        onEditLesson={setEditingLesson}
        onDeleteLesson={async (id) => await deleteMutation.mutateAsync(id)}
        onPublishLesson={async (id) => await publishMutation.mutateAsync(id)}
      />
    </div>
  );
}