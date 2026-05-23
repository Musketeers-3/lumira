import { useState } from "react";
import { ChevronDown, Plus, Trash2, Eye, Save } from "lucide-react";
import type { LessonDraft, LessonStep } from "@/types/lesson";

interface LessonBuilderProps {
  initialLesson?: LessonDraft;
  onSave?: (lesson: LessonDraft) => Promise<void>;
}

const STATES = ["IDLE", "FOCUS", "CHALLENGE", "CELEBRATE"] as const;
const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

export function LessonBuilder({ initialLesson, onSave }: LessonBuilderProps) {
  const [lesson, setLesson] = useState<LessonDraft>(
    initialLesson || {
      id: Math.random().toString(36).substring(7),
      title: "Untitled Lesson",
      description: "",
      topic: "",
      targetSkills: [],
      difficulty: "beginner",
      steps: [
        {
          id: "1",
          state: "FOCUS",
          mentorMessage: "Welcome! Let's explore this concept together.",
          studentPrompt: "What do you already know?",
          expectedConcepts: [],
          celebrate: false,
          order: 0,
        },
      ],
      estimatedDuration: 15,
      createdBy: "educator",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false,
    },
  );

  const [isSaving, setIsSaving] = useState(false);
  const [expandedStep, setExpandedStep] = useState<string | null>(lesson.steps[0]?.id);

  const updateStep = (stepId: string, updates: Partial<LessonStep>) => {
    setLesson((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)),
    }));
  };

  const addStep = () => {
    const newStep: LessonStep = {
      id: Math.random().toString(36).substring(7),
      state: "FOCUS",
      mentorMessage: "",
      studentPrompt: "",
      expectedConcepts: [],
      celebrate: false,
      order: lesson.steps.length,
    };
    setLesson((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  };

  const deleteStep = (stepId: string) => {
    if (lesson.steps.length === 1) return; // Don't delete if only one step
    setLesson((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== stepId),
    }));
  };

  const handleSave = async () => {
    if (!lesson.title.trim() || !lesson.topic.trim()) {
      alert("Please fill in lesson title and topic");
      return;
    }
    setIsSaving(true);
    try {
      if (onSave) await onSave(lesson);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
              className="mb-2 bg-transparent text-4xl font-bold text-foreground outline-none"
              placeholder="Lesson Title"
            />
            <p className="text-muted-foreground">Create an engaging Socratic learning experience</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-state-accent px-4 py-2 text-sm font-medium text-black transition-all hover:brightness-110 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Lesson"}
          </button>
        </div>

        {/* Metadata Section */}
        <div className="mb-8 grid gap-6 rounded-2xl border border-glass-border bg-white/[0.03] p-6 backdrop-blur-xl md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Topic</label>
            <input
              type="text"
              value={lesson.topic}
              onChange={(e) => setLesson({ ...lesson, topic: e.target.value })}
              className="w-full rounded-lg bg-white/[0.05] px-3 py-2 text-foreground outline-none transition-colors focus:bg-white/[0.08]"
              placeholder="e.g., Binary Search, Recursion..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
            <select
              value={lesson.difficulty}
              onChange={(e) =>
                setLesson({ ...lesson, difficulty: e.target.value as LessonDraft["difficulty"] })
              }
              className="w-full rounded-lg bg-white/[0.05] px-3 py-2 text-foreground outline-none transition-colors focus:bg-white/[0.08]"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d} className="bg-background">
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={lesson.description}
              onChange={(e) => setLesson({ ...lesson, description: e.target.value })}
              className="w-full rounded-lg bg-white/[0.05] px-3 py-2 text-foreground outline-none transition-colors focus:bg-white/[0.08]"
              placeholder="What will students learn?"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={lesson.estimatedDuration}
              onChange={(e) =>
                setLesson({ ...lesson, estimatedDuration: parseInt(e.target.value) || 15 })
              }
              className="w-full rounded-lg bg-white/[0.05] px-3 py-2 text-foreground outline-none transition-colors focus:bg-white/[0.08]"
              min="5"
              max="120"
            />
          </div>
        </div>

        {/* Steps Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Dialogue Steps</h2>
            <button
              onClick={addStep}
              className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-white/[0.08] hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Add Step
            </button>
          </div>

          <div className="space-y-3">
            {lesson.steps.map((step, idx) => (
              <div
                key={step.id}
                className="rounded-xl border border-glass-border bg-white/[0.02] backdrop-blur-xl transition-all"
              >
                <button
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-state-accent/20 text-sm font-semibold text-state-accent">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        Step {idx + 1} • {step.state}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {step.mentorMessage || "Click to edit"}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${expandedStep === step.id ? "rotate-180" : ""}`}
                  />
                </button>

                {expandedStep === step.id && (
                  <div className="border-t border-glass-border px-4 py-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        State
                      </label>
                      <select
                        value={step.state}
                        onChange={(e) =>
                          updateStep(step.id, { state: e.target.value as LessonStep["state"] })
                        }
                        className="w-full rounded-lg bg-white/[0.05] px-3 py-2 text-foreground outline-none transition-colors focus:bg-white/[0.08]"
                      >
                        {STATES.map((s) => (
                          <option key={s} value={s} className="bg-background">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Mentor Message
                      </label>
                      <textarea
                        value={step.mentorMessage}
                        onChange={(e) => updateStep(step.id, { mentorMessage: e.target.value })}
                        className="w-full rounded-lg bg-white/[0.05] px-3 py-2 text-foreground outline-none transition-colors focus:bg-white/[0.08]"
                        placeholder="What should the mentor say?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Student Prompt
                      </label>
                      <textarea
                        value={step.studentPrompt}
                        onChange={(e) => updateStep(step.id, { studentPrompt: e.target.value })}
                        className="w-full rounded-lg bg-white/[0.05] px-3 py-2 text-foreground outline-none transition-colors focus:bg-white/[0.08]"
                        placeholder="What question should the student answer?"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`celebrate-${step.id}`}
                        checked={step.celebrate}
                        onChange={(e) => updateStep(step.id, { celebrate: e.target.checked })}
                        className="rounded border-glass-border"
                      />
                      <label htmlFor={`celebrate-${step.id}`} className="text-sm text-foreground">
                        Show celebration on completion
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-glass-border">
                      <button
                        onClick={() => deleteStep(step.id)}
                        disabled={lesson.steps.length === 1}
                        className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive transition-all hover:bg-destructive/20 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
