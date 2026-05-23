import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Lock } from "lucide-react";
import type { LessonDraft } from "@/types/lesson";

interface LessonsListProps {
  lessons: LessonDraft[];
  onNewLesson: () => void;
  onEditLesson: (lesson: LessonDraft) => void;
  onDeleteLesson: (lessonId: string) => Promise<void>;
  onPublishLesson: (lessonId: string) => Promise<void>;
}

export function LessonsList({
  lessons,
  onNewLesson,
  onEditLesson,
  onDeleteLesson,
  onPublishLesson,
}: LessonsListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setDeleting(lessonId);
    try {
      await onDeleteLesson(lessonId);
    } finally {
      setDeleting(null);
    }
  };

  const handlePublish = async (lessonId: string) => {
    setPublishing(lessonId);
    try {
      await onPublishLesson(lessonId);
    } finally {
      setPublishing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Lessons</h1>
            <p className="text-muted-foreground">
              Create and manage your Socratic learning lessons
            </p>
          </div>
          <button
            onClick={onNewLesson}
            className="flex items-center gap-2 rounded-lg bg-state-accent px-4 py-2 text-sm font-medium text-black transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            New Lesson
          </button>
        </div>

        {lessons.length === 0 ? (
          <div className="rounded-xl border border-dashed border-glass-border bg-white/[0.02] p-12 text-center backdrop-blur-xl">
            <p className="mb-4 text-muted-foreground">No lessons yet. Create your first one!</p>
            <button
              onClick={onNewLesson}
              className="inline-flex items-center gap-2 rounded-lg bg-state-accent px-4 py-2 text-sm font-medium text-black transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              Create Lesson
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-xl border border-glass-border bg-white/[0.03] p-4 backdrop-blur-xl transition-all hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{lesson.title}</h3>
                      {lesson.isPublished ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-state-accent/20 px-2 py-1 text-xs font-medium text-state-accent">
                          <Eye className="h-3 w-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted/20 px-2 py-1 text-xs font-medium text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                      </span>
                    </div>
                    <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                      {lesson.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground">📚 {lesson.topic}</span>
                      <span className="text-xs text-muted-foreground">
                        ⏱️ {lesson.estimatedDuration} min
                      </span>
                      <span className="text-xs text-muted-foreground">
                        🎯 {lesson.steps.length} steps
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditLesson(lesson)}
                      className="rounded-lg bg-white/[0.05] p-2 text-muted-foreground transition-all hover:bg-white/[0.1] hover:text-foreground"
                      title="Edit lesson"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePublish(lesson.id)}
                      disabled={publishing === lesson.id || lesson.isPublished}
                      className="rounded-lg bg-state-accent/10 p-2 text-state-accent transition-all hover:bg-state-accent/20 disabled:opacity-50"
                      title={lesson.isPublished ? "Already published" : "Publish lesson"}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      disabled={deleting === lesson.id}
                      className="rounded-lg bg-destructive/10 p-2 text-destructive transition-all hover:bg-destructive/20 disabled:opacity-50"
                      title="Delete lesson"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
