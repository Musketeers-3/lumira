import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { LessonBuilder } from "@/components/lesson-builder/LessonBuilder";
import { LessonsList } from "@/components/lesson-builder/LessonsList";
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

// --- 1. Async Data Simulator (Frontend-First Persistence) ---
// This mocks network latency to ensure our loading states and mutation architectures
// are production-ready for the eventual Supabase swap.
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const STORAGE_KEY = "lumira_drafts";

const lessonDb = {
  async fetchAll(): Promise<LessonDraft[]> {
    await delay(600); // Simulate network latency
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async save(lesson: LessonDraft): Promise<void> {
    await delay(400);
    const stored = localStorage.getItem(STORAGE_KEY);
    let lessons: LessonDraft[] = stored ? JSON.parse(stored) : [];

    const exists = lessons.some((l) => l.id === lesson.id);
    if (exists) {
      lessons = lessons.map((l) => (l.id === lesson.id ? lesson : l));
    } else {
      lessons.push(lesson);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
  },

  async delete(id: string): Promise<void> {
    await delay(400);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const lessons: LessonDraft[] = JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons.filter((l) => l.id !== id)));
  },

  async publish(id: string): Promise<void> {
    await delay(400);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const lessons: LessonDraft[] = JSON.parse(stored);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(lessons.map((l) => (l.id === id ? { ...l, isPublished: true } : l))),
    );
  },
};

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

// --- 2. The Main Route Component ---
function LessonBuilderPage() {
  const queryClient = useQueryClient();
  const [editingLesson, setEditingLesson] = useState<LessonDraft | null>(null);

  // TanStack Query: Hydrate list automatically and cache
  const { data: lessons = [], isLoading } = useQuery<LessonDraft[]>({
    queryKey: ["lessons"],
    queryFn: lessonDb.fetchAll,
    staleTime: 1000 * 60 * 5,
  });

  // TanStack Mutations: Handle async writes and auto-invalidate cache
  const saveMutation = useMutation({
    mutationFn: lessonDb.save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      setEditingLesson(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: lessonDb.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: lessonDb.publish,
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
