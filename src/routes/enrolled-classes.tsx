/**
 * Enrolled Classes Route
 * View classes the student has joined
 */

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStudentRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { getEnrolledClasses, getClassLessons, type EnrolledClassData, type AssignedLessonData } from "@/services/api/classApi";
import { GraduationCap, Users, Sparkles, ArrowRight, Clock, BookOpen, Play, ChevronLeft, X } from "lucide-react";

export const Route = createFileRoute("/enrolled-classes")({
  component: EnrolledClassesPage,
});

function EnrolledClassesPage() {
  const { isLoading: isGuardLoading } = useStudentRouteGuard();
  const router = useRouter();

  const [classes, setClasses] = useState<EnrolledClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lesson view state
  const [selectedClass, setSelectedClass] = useState<EnrolledClassData | null>(null);
  const [assignedLessons, setAssignedLessons] = useState<AssignedLessonData[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);

  // Load lessons for a selected class
  const handleViewClass = async (classItem: EnrolledClassData) => {
    setSelectedClass(classItem);
    setIsLoadingLessons(true);
    try {
      const lessons = await getClassLessons(classItem._id);
      setAssignedLessons(lessons);
    } catch (err) {
      console.error("Failed to load lessons:", err);
      setAssignedLessons([]);
    } finally {
      setIsLoadingLessons(false);
    }
  };

  // Go back to classes list
  const handleBackToClasses = () => {
    setSelectedClass(null);
    setAssignedLessons([]);
  };

  // Navigate to start a lesson (using the existing engine)
  const handleStartLesson = (lessonId: string) => {
    router.navigate({ to: "/engine", search: { lessonId } });
  };

  // Load enrolled classes from API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEnrolledClasses();
        setClasses(data);
      } catch (err) {
        console.error("Failed to load enrolled classes:", err);
        setError("Failed to load classes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);

  if (isGuardLoading) {
    return <RouteGuardLoading />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8">
        {/* Observatory-themed background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, var(--bg-onyx) 0%, var(--bg-night) 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(var(--hairline) 1px, transparent 1px),
                linear-gradient(90deg, var(--hairline) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          <div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10">
          <div
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] mb-2"
            style={{ color: "var(--gold-soft)" }}
          >
            <Sparkles className="w-3 h-3" />
            Classroom
          </div>
          <h1
            className="text-2xl md:text-3xl font-semibold tracking-tight font-display"
            style={{ color: "var(--ink-primary)" }}
          >
            My Classes
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--ink-secondary)" }}>
            Classes you have joined. Your teachers can share lessons and track your progress.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2"
            style={{
              borderColor: "var(--gold) transparent var(--gold) transparent",
            }}
          />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div
          className="p-4 rounded-xl"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && classes.length === 0 && (
        <div
          className="relative overflow-hidden rounded-2xl p-12 text-center"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage: `
                linear-gradient(var(--hairline) 1px, transparent 1px),
                linear-gradient(90deg, var(--hairline) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />

          <div className="relative z-10">
            {/* Empty State Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider mb-6"
              style={{
                background: "var(--gold-dim)",
                color: "var(--gold)",
              }}
            >
              <Sparkles className="w-3 h-3" />
              Get Started
            </div>

            <div
              className="flex items-center justify-center w-20 h-20 mx-auto rounded-2xl mb-6"
              style={{
                background: "linear-gradient(135deg, var(--bg-onyx) 0%, var(--bg-night) 100%)",
                border: "1px solid var(--hairline)",
              }}
            >
              <GraduationCap className="w-10 h-10" style={{ color: "var(--ink-tertiary)" }} />
            </div>

            <h3
              className="text-xl font-semibold font-display mb-3"
              style={{ color: "var(--ink-primary)" }}
            >
              No Classes Joined Yet
            </h3>
            <p className="max-w-md mx-auto text-sm mb-8" style={{ color: "var(--ink-secondary)" }}>
              Ask your teacher for a class code to join a class. Once joined, you can access lessons
              and your teacher can track your progress.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.navigate({ to: "/" })}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                  color: "var(--bg-primary)",
                }}
              >
                <Sparkles className="w-4 h-4" />
                Back to Discovery Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Classes List */}
      {!isLoading && !error && classes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              className="group relative rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--bg-night)",
                border: "1px solid var(--hairline)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              {/* Hover glow effect */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(201,162,75,0.08) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10">
                {/* Class Name */}
                <h3
                  className="text-base font-semibold font-display"
                  style={{ color: "var(--ink-primary)" }}
                >
                  {classItem.className}
                </h3>

                {/* Description */}
                <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--ink-secondary)" }}>
                  {classItem.description || "No description provided"}
                </p>

                {/* Teacher & Code */}
                <div
                  className="mt-4 flex items-center gap-4 text-sm"
                  style={{ color: "var(--ink-tertiary)" }}
                >
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {classItem.teacherName}
                  </div>
                  <div className="font-mono" style={{ color: "var(--gold-soft)" }}>
                    {classItem.classCode}
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="mt-4 pt-4 flex items-center justify-between"
                  style={{ borderTop: "1px solid var(--hairline)" }}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" style={{ color: "var(--gold-soft)" }} />
                    <span className="text-sm" style={{ color: "var(--ink-secondary)" }}>
                      {classItem.studentCount} students
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewClass(classItem)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: "var(--gold-dim)",
                      color: "var(--gold)",
                    }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    View Lessons
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Class Lessons View */}
      {selectedClass && (
        <div className="space-y-6">
          {/* Back Button & Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToClasses}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
              style={{ color: "var(--ink-secondary)" }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Classes
            </button>
          </div>

          {/* Class Info */}
          <div
            className="relative overflow-hidden rounded-xl p-6"
            style={{
              background: "linear-gradient(135deg, var(--bg-onyx) 0%, var(--bg-night) 100%)",
              border: "1px solid var(--hairline)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                }}
              >
                <GraduationCap className="w-6 h-6" style={{ color: "var(--bg-primary)" }} />
              </div>
              <div>
                <div
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em]"
                  style={{ color: "var(--gold-soft)" }}
                >
                  <Sparkles className="w-3 h-3" />
                  Classroom
                </div>
                <h2
                  className="text-xl font-semibold font-display mt-1"
                  style={{ color: "var(--ink-primary)" }}
                >
                  {selectedClass.className}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--ink-secondary)" }}>
                  Teacher: {selectedClass.teacherName}
                </p>
              </div>
            </div>
          </div>

          {/* Lessons Section */}
          <div>
            <h3
              className="text-lg font-semibold font-display mb-4"
              style={{ color: "var(--ink-primary)" }}
            >
              Assigned Lessons
            </h3>

            {isLoadingLessons ? (
              <div className="flex items-center justify-center py-12">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2"
                  style={{
                    borderColor: "var(--gold) transparent var(--gold) transparent",
                  }}
                />
              </div>
            ) : assignedLessons.length === 0 ? (
              <div
                className="rounded-xl p-8 text-center"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--ink-tertiary)" }} />
                <p style={{ color: "var(--ink-secondary)" }}>
                  No lessons have been assigned to this class yet.
                </p>
                <p className="text-sm mt-2" style={{ color: "var(--ink-tertiary)" }}>
                  Check back later or ask your teacher for assignments.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {assignedLessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="rounded-xl p-5 transition-all hover:-translate-y-1"
                    style={{
                      background: "var(--bg-night)",
                      border: "1px solid var(--hairline)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
                        style={{
                          background: "var(--gold-dim)",
                          color: "var(--gold)",
                        }}
                      >
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-semibold font-display"
                          style={{ color: "var(--ink-primary)" }}
                        >
                          {lesson.title}
                        </h4>
                        <p
                          className="text-sm mt-1 line-clamp-2"
                          style={{ color: "var(--ink-secondary)" }}
                        >
                          {lesson.description || "No description"}
                        </p>
                        <div
                          className="flex items-center gap-4 mt-3 text-xs"
                          style={{ color: "var(--ink-tertiary)" }}
                        >
                          <span>{lesson.difficulty}</span>
                          <span>•</span>
                          <span>{lesson.estimatedDuration} min</span>
                          {lesson.dueDate && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Due {new Date(lesson.dueDate).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartLesson(lesson.lessonId)}
                      className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                        color: "var(--bg-primary)",
                      }}
                    >
                      <Play className="w-4 h-4" />
                      Start Lesson
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EnrolledClassesPage;
