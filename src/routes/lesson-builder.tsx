import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LessonBuilder } from "@/components/lesson-builder/LessonBuilder";
import { LessonsList } from "@/components/lesson-builder/LessonsList";
import type { LessonDraft } from "@/types/lesson";

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

export const Route = createFileRoute("/lesson-builder")({
  component: LessonBuilderPage,
});

function LessonBuilderPage() {
  const [lessons, setLessons] = useState<LessonDraft[]>([]);
  const [editingLesson, setEditingLesson] = useState<LessonDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load lessons from localStorage (demo implementation)
  useEffect(() => {
    const stored = localStorage.getItem("lessons");
    if (stored) {
      try {
        setLessons(JSON.parse(stored));
      } catch {
        console.error("Failed to load lessons");
      }
    }
    setIsLoading(false);
  }, []);

  const handleSave = async (lesson: LessonDraft) => {
    const updatedLessons = editingLesson
      ? lessons.map((l) => (l.id === lesson.id ? lesson : l))
      : [...lessons, lesson];

    setLessons(updatedLessons);
    localStorage.setItem("lessons", JSON.stringify(updatedLessons));
    setEditingLesson(null);
  };

  const handleDelete = async (lessonId: string) => {
    const updatedLessons = lessons.filter((l) => l.id !== lessonId);
    setLessons(updatedLessons);
    localStorage.setItem("lessons", JSON.stringify(updatedLessons));
  };

  const handlePublish = async (lessonId: string) => {
    const updatedLessons = lessons.map((l) =>
      l.id === lessonId ? { ...l, isPublished: true } : l,
    );
    setLessons(updatedLessons);
    localStorage.setItem("lessons", JSON.stringify(updatedLessons));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (editingLesson) {
    return (
      <div>
        <button
          onClick={() => setEditingLesson(null)}
          className="fixed left-6 top-6 z-50 rounded-lg bg-white/[0.05] px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-white/[0.1] hover:text-foreground"
        >
          ← Back to Lessons
        </button>
        <LessonBuilder initialLesson={editingLesson} onSave={handleSave} />
      </div>
    );
  }

  return (
    <LessonsList
      lessons={lessons}
      onNewLesson={() => setEditingLesson(createNewLessonDraft())}
      onEditLesson={setEditingLesson}
      onDeleteLesson={handleDelete}
      onPublishLesson={handlePublish}
    />
  );
}
