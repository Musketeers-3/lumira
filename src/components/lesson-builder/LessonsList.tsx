import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Lock, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
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
    // Removed opaque background to let the Ambient OS shine through
    <div className="p-6 pt-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1
              className="font-display text-4xl font-bold tracking-tight"
              style={{ color: "var(--ink-primary)" }}
            >
              My Lessons
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--ink-secondary)" }}>
              Construct and manage your Socratic learning pathways.
            </p>
          </div>
          <button
            onClick={onNewLesson}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-all hover:scale-105"
            style={{
              background: "var(--gold-soft)",
              color: "#0B0B12",
              boxShadow: "0 0 20px rgba(201,162,75,0.2)",
            }}
          >
            <Plus className="h-4 w-4" />
            New Lesson
          </button>
        </div>

        {lessons.length === 0 ? (
          <div className="surface-luxe rounded-[2rem] border border-dashed border-glass-border p-12 text-center">
            <p className="mb-6 text-sm" style={{ color: "var(--ink-secondary)" }}>
              The vault is empty. Construct your first learning pathway.
            </p>
            <button
              onClick={onNewLesson}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-all hover:scale-105"
              style={{
                background: "var(--gold-soft)",
                color: "#0B0B12",
                boxShadow: "0 0 20px rgba(201,162,75,0.2)",
              }}
            >
              <Plus className="h-4 w-4" />
              Create Lesson
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="surface-luxe group rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: "var(--bg-onyx-raised)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3
                        className="text-xl font-semibold tracking-tight"
                        style={{ color: "var(--ink-primary)" }}
                      >
                        {lesson.title}
                      </h3>
                      {lesson.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4FA64A]/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#4FA64A] border border-[#4FA64A]/20">
                          <Eye className="h-3 w-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-white/10">
                          <Lock className="h-3 w-3" /> Draft
                        </span>
                      )}
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        {lesson.difficulty}
                      </span>
                    </div>
                    <p
                      className="mb-4 mt-2 line-clamp-2 text-sm leading-relaxed"
                      style={{ color: "var(--ink-secondary)" }}
                    >
                      {lesson.description || "No description provided."}
                    </p>
                    <div className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span style={{ color: "var(--gold-soft)" }}>
                        [{lesson.topic || "Untopical"}]
                      </span>
                      <span>{lesson.estimatedDuration} min</span>
                      <span>{lesson.steps.length} steps</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-80 transition-opacity group-hover:opacity-100">
                    {/* The Functional Bridge -> Send the user to play their lesson */}
                    <Link
                      to="/engine"
                      search={{
                        lessonId: lesson.id,
                        topic: lesson.topic,
                        objective: lesson.description,
                      }}
                      className="rounded-xl bg-white/[0.03] p-2.5 text-muted-foreground transition-all hover:bg-white/[0.08] hover:text-[#5BC0EB]"
                      title="Test in Dojo"
                    >
                      <Play className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => onEditLesson(lesson)}
                      className="rounded-xl bg-white/[0.03] p-2.5 text-muted-foreground transition-all hover:bg-white/[0.08] hover:text-foreground"
                      title="Edit lesson"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handlePublish(lesson.id)}
                      disabled={publishing === lesson.id || lesson.isPublished}
                      className="rounded-xl bg-white/[0.03] p-2.5 text-muted-foreground transition-all hover:bg-white/[0.08] hover:text-[#4FA64A] disabled:opacity-30"
                      title={lesson.isPublished ? "Already published" : "Publish lesson"}
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(lesson.id)}
                      disabled={deleting === lesson.id}
                      className="rounded-xl bg-white/[0.03] p-2.5 text-muted-foreground transition-all hover:bg-[rgba(255,50,50,0.1)] hover:text-red-400 disabled:opacity-30"
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
