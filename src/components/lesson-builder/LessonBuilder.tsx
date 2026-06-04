import { useState } from "react";
import { ChevronDown, Plus, Trash2, Save } from "lucide-react";
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
    setExpandedStep(newStep.id);
  };

  const deleteStep = (stepId: string) => {
    if (lesson.steps.length === 1) return;
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
    // Removed blocking background wrapper
    <div className="p-6 pt-24 pb-32">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
              className="mb-2 w-full bg-transparent font-display text-5xl font-bold tracking-tight outline-none"
              style={{ color: "var(--ink-primary)" }}
              placeholder="Lesson Title"
            />
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Socratic Pathway Architect
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold tracking-wide transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: "var(--gold-soft)",
              color: "#0B0B12",
              boxShadow: "0 0 20px rgba(201,162,75,0.2)",
            }}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
        </div>

        {/* Metadata Section */}
        <div className="surface-luxe mb-8 grid gap-6 p-8 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Topic Domain
            </label>
            <input
              type="text"
              value={lesson.topic}
              onChange={(e) => setLesson({ ...lesson, topic: e.target.value })}
              className="w-full rounded-xl bg-white/[0.03] px-4 py-3 text-sm outline-none transition-all focus:bg-white/[0.06] focus:ring-1 focus:ring-[var(--gold-soft)]"
              style={{ color: "var(--ink-primary)", border: "1px solid var(--hairline-strong)" }}
              placeholder="e.g., Pressure & Particles"
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Difficulty Layer
            </label>
            <select
              value={lesson.difficulty}
              onChange={(e) =>
                setLesson({ ...lesson, difficulty: e.target.value as LessonDraft["difficulty"] })
              }
              className="w-full rounded-xl bg-white/[0.03] px-4 py-3 text-sm outline-none transition-all focus:bg-white/[0.06] focus:ring-1 focus:ring-[var(--gold-soft)]"
              style={{ color: "var(--ink-primary)", border: "1px solid var(--hairline-strong)" }}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d} className="bg-[#1B1B28]">
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Learning Objective
            </label>
            <textarea
              value={lesson.description}
              onChange={(e) => setLesson({ ...lesson, description: e.target.value })}
              className="w-full rounded-xl bg-white/[0.03] px-4 py-3 text-sm outline-none transition-all focus:bg-white/[0.06] focus:ring-1 focus:ring-[var(--gold-soft)]"
              style={{ color: "var(--ink-primary)", border: "1px solid var(--hairline-strong)" }}
              placeholder="What core insight should the student reach independently?"
              rows={3}
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Estimated Duration (Min)
            </label>
            <input
              type="number"
              value={lesson.estimatedDuration}
              onChange={(e) =>
                setLesson({ ...lesson, estimatedDuration: parseInt(e.target.value) || 15 })
              }
              className="w-full rounded-xl bg-white/[0.03] px-4 py-3 text-sm outline-none transition-all focus:bg-white/[0.06] focus:ring-1 focus:ring-[var(--gold-soft)]"
              style={{ color: "var(--ink-primary)", border: "1px solid var(--hairline-strong)" }}
              min="5"
              max="120"
            />
          </div>
        </div>

        {/* Steps Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2
              className="text-2xl font-semibold tracking-tight"
              style={{ color: "var(--ink-primary)" }}
            >
              Socratic Dialogue Chain
            </h2>
            <button
              onClick={addStep}
              className="flex items-center gap-2 rounded-xl border border-[var(--hairline-strong)] bg-white/[0.03] px-4 py-2 text-sm transition-all hover:bg-white/[0.08]"
              style={{ color: "var(--ink-secondary)" }}
            >
              <Plus className="h-4 w-4" />
              Add Node
            </button>
          </div>

          <div className="space-y-4">
            {lesson.steps.map((step, idx) => (
              <div
                key={step.id}
                className="surface-luxe overflow-hidden rounded-2xl transition-all duration-300"
                style={{
                  background: expandedStep === step.id ? "var(--bg-onyx-raised)" : "var(--bg-onyx)",
                  border:
                    expandedStep === step.id
                      ? "1px solid var(--gold-soft)"
                      : "1px solid var(--hairline-strong)",
                }}
              >
                <button
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full font-mono text-[10px] font-bold"
                      style={{ background: "rgba(201,162,75,0.15)", color: "var(--gold-soft)" }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        State <span style={{ color: "var(--state-accent)" }}>// {step.state}</span>
                      </div>
                      <p
                        className="mt-1 text-sm line-clamp-1"
                        style={{ color: "var(--ink-secondary)" }}
                      >
                        {step.mentorMessage || "Empty node. Click to edit."}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${expandedStep === step.id ? "rotate-180" : ""}`}
                  />
                </button>

                {expandedStep === step.id && (
                  <div className="border-t border-[var(--hairline)] p-6 space-y-6 bg-black/10">
                    <div>
                      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Cognitive State Trigger
                      </label>
                      <select
                        value={step.state}
                        onChange={(e) =>
                          updateStep(step.id, { state: e.target.value as LessonStep["state"] })
                        }
                        className="w-full rounded-xl bg-white/[0.03] px-4 py-3 text-sm outline-none transition-all focus:bg-white/[0.06] focus:ring-1 focus:ring-[var(--gold-soft)]"
                        style={{
                          color: "var(--ink-primary)",
                          border: "1px solid var(--hairline-strong)",
                        }}
                      >
                        {STATES.map((s) => (
                          <option key={s} value={s} className="bg-[#1B1B28]">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Mentor Initial Prompt
                      </label>
                      <textarea
                        value={step.mentorMessage}
                        onChange={(e) => updateStep(step.id, { mentorMessage: e.target.value })}
                        className="w-full rounded-xl bg-white/[0.03] px-4 py-3 text-sm outline-none transition-all focus:bg-white/[0.06] focus:ring-1 focus:ring-[var(--gold-soft)]"
                        style={{
                          color: "var(--ink-primary)",
                          border: "1px solid var(--hairline-strong)",
                        }}
                        placeholder="What should the mentor say to open this thought loop?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Expected Student Response (AI Target)
                      </label>
                      <textarea
                        value={step.studentPrompt}
                        onChange={(e) => updateStep(step.id, { studentPrompt: e.target.value })}
                        className="w-full rounded-xl bg-white/[0.03] px-4 py-3 text-sm outline-none transition-all focus:bg-white/[0.06] focus:ring-1 focus:ring-[var(--gold-soft)]"
                        style={{
                          color: "var(--ink-primary)",
                          border: "1px solid var(--hairline-strong)",
                        }}
                        placeholder="What logical conclusion should the AI try to guide them toward?"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id={`celebrate-${step.id}`}
                        checked={step.celebrate}
                        onChange={(e) => updateStep(step.id, { celebrate: e.target.checked })}
                        className="h-4 w-4 rounded border-[var(--hairline-strong)] bg-white/5 accent-[#C9A24B]"
                      />
                      <label
                        htmlFor={`celebrate-${step.id}`}
                        className="text-sm cursor-pointer select-none"
                        style={{ color: "var(--ink-secondary)" }}
                      >
                        Trigger Breakthrough Validation UI (Light Found)
                      </label>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-[var(--hairline)]">
                      <button
                        onClick={() => deleteStep(step.id)}
                        disabled={lesson.steps.length === 1}
                        className="flex items-center gap-2 rounded-xl bg-[rgba(255,50,50,0.1)] px-4 py-2 text-sm text-red-400 transition-all hover:bg-[rgba(255,50,50,0.2)] disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Node
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
