/**
 * Teacher Student Preview Route
 * Preview a student's learning journey
 */

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { getMyClasses, getClassStudents, type ClassData, type ClassStudentData } from "@/services/api/classApi";
import {
  getStudentProgress,
  getClassActivity,
  type StudentProgress,
  type ClassActivityItem,
} from "@/services/api/analyticsApi";
import { Eye, Users, Sparkles, Clock, Award, BookOpen, Activity, Mail, Calendar } from "lucide-react";

export const Route = createFileRoute("/teacher-student-preview")({
  component: TeacherStudentPreviewPage,
  validateSearch: (search: Record<string, unknown>) => ({
    classId: search.classId as string | undefined,
    studentId: search.studentId as string | undefined,
  }),
});

/**
 * Format date
 */
function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format time
 */
function formatTime(seconds: number): string {
  if (seconds === 0) return "0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function TeacherStudentPreviewPage() {
  const { isLoading: isGuardLoading } = useTeacherRouteGuard();
  const router = useRouter();
  const search = Route.useSearch();

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<ClassStudentData[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [studentActivity, setStudentActivity] = useState<ClassActivityItem[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedClassId = search.classId;
  const selectedStudentId = search.studentId;

  // Load classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoadingClasses(true);
        const data = await getMyClasses();
        setClasses(data);
      } catch (err) {
        console.error("Failed to load classes:", err);
        setError("Failed to load classes");
      } finally {
        setIsLoadingClasses(false);
      }
    };

    loadClasses();
  }, []);

  // Load students when class is selected
  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedClassId) {
        setStudents([]);
        return;
      }

      try {
        const data = await getClassStudents(selectedClassId);
        setStudents(data);
      } catch (err) {
        console.error("Failed to load students:", err);
      }
    };

    loadStudents();
  }, [selectedClassId]);

  // Load student progress and activity
  useEffect(() => {
    const loadStudentData = async () => {
      if (!selectedClassId || !selectedStudentId) {
        setStudentProgress(null);
        setStudentActivity([]);
        return;
      }

      try {
        setIsLoadingData(true);

        // Get all progress for the class
        const allProgress = await getStudentProgress(selectedClassId);
        const progress = allProgress.find((p) => p.studentId === selectedStudentId);
        setStudentProgress(progress || null);

        // Get class activity
        const activity = await getClassActivity(selectedClassId);
        setStudentActivity(activity.slice(0, 10));
      } catch (err) {
        console.error("Failed to load student data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadStudentData();
  }, [selectedClassId, selectedStudentId]);

  // Get selected student info
  const selectedStudent = useMemo(() => {
    return students.find((s) => s.studentId === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  // Handle class selection
  const handleSelectClass = (classId: string) => {
    router.navigate({
      to: "/teacher-student-preview",
      search: { classId, studentId: undefined },
    });
  };

  // Handle student selection
  const handleSelectStudent = (studentId: string) => {
    router.navigate({
      to: "/teacher-student-preview",
      search: { classId: selectedClassId, studentId },
    });
  };

  if (isGuardLoading) {
    return <RouteGuardLoading />;
  }

  const isLoading = isLoadingClasses || isLoadingData;
  const hasClasses = classes.length > 0;

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
          <div className="flex items-start gap-4">
            <div
              className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                boxShadow: "0 0 30px rgba(201,162,75,0.3)",
              }}
            >
              <Eye className="w-8 h-8" style={{ color: "var(--bg-primary)" }} />
            </div>

            <div>
              <div
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em]"
                style={{ color: "var(--gold-soft)" }}
              >
                <Sparkles className="w-3 h-3" />
                Observatory
              </div>
              <h1
                className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight lg:text-4xl font-display"
                style={{ color: "var(--ink-primary)" }}
              >
                Student Preview
              </h1>
              <p
                className="mt-2 max-w-xl text-sm md:text-base"
                style={{ color: "var(--ink-secondary)" }}
              >
                View a student's learning journey. Preview their progress, activity, and achievements.
              </p>
            </div>
          </div>
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

      {/* Empty State - No Classes */}
      {!isLoading && !error && !hasClasses && (
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
            <div
              className="flex items-center justify-center w-20 h-20 mx-auto rounded-2xl mb-6"
              style={{
                background: "linear-gradient(135deg, var(--bg-onyx) 0%, var(--bg-night) 100%)",
                border: "1px solid var(--hairline)",
              }}
            >
              <Eye className="w-10 h-10" style={{ color: "var(--ink-tertiary)" }} />
            </div>

            <h3
              className="text-xl font-semibold font-display mb-3"
              style={{ color: "var(--ink-primary)" }}
            >
              No Classes Yet
            </h3>
            <p className="max-w-md mx-auto text-sm mb-8" style={{ color: "var(--ink-secondary)" }}>
              Create a class and enroll students to preview their learning journeys.
            </p>
          </div>
        </div>
      )}

      {/* Preview Content */}
      {!isLoading && !error && hasClasses && (
        <>
          {/* Selectors */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Class Selector */}
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4" style={{ color: "var(--gold)" }} />
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Select Class
                </span>
              </div>
              <select
                value={selectedClassId || ""}
                onChange={(e) => handleSelectClass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  background: "var(--bg-night)",
                  border: "1px solid var(--hairline)",
                  color: "var(--ink-primary)",
                }}
              >
                <option value="">Select a class...</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Selector */}
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4" style={{ color: "var(--gold)" }} />
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Select Student
                </span>
              </div>
              <select
                value={selectedStudentId || ""}
                onChange={(e) => handleSelectStudent(e.target.value)}
                disabled={!selectedClassId}
                className="w-full px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                style={{
                  background: "var(--bg-night)",
                  border: "1px solid var(--hairline)",
                  color: "var(--ink-primary)",
                }}
              >
                <option value="">Select a student...</option>
                {students.map((student) => (
                  <option key={student.studentId} value={student.studentId}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* No Student Selected */}
          {!selectedStudentId && (
            <div
              className="p-8 text-center rounded-xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
            >
              <p style={{ color: "var(--ink-secondary)" }}>
                Select a class and student to preview their learning journey.
              </p>
            </div>
          )}

          {/* Student Preview */}
          {selectedStudentId && selectedStudent && studentProgress && (
            <div className="space-y-6">
              {/* Student Header */}
              <div
                className="flex items-center gap-6 p-6 rounded-xl"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold"
                  style={{ background: "var(--gold-dim)", color: "var(--gold)" }}
                >
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold" style={{ color: "var(--ink-primary)" }}>
                    {selectedStudent.name}
                  </h2>
                  <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: "var(--ink-secondary)" }}>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedStudent.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(selectedStudent.joinedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div
                  className="p-5 rounded-xl"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4" style={{ color: "var(--gold)" }} />
                    <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                      Lessons Completed
                    </span>
                  </div>
                  <div className="text-2xl font-semibold" style={{ color: "var(--gold)" }}>
                    {studentProgress.lessonsCompleted}
                  </div>
                </div>

                <div
                  className="p-5 rounded-xl"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" style={{ color: "var(--gold)" }} />
                    <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                      Time Spent
                    </span>
                  </div>
                  <div className="text-2xl font-semibold" style={{ color: "var(--gold)" }}>
                    {formatTime(studentProgress.totalTimeSpent)}
                  </div>
                </div>

                <div
                  className="p-5 rounded-xl"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4" style={{ color: "var(--gold)" }} />
                    <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                      Mastery Score
                    </span>
                  </div>
                  <div className="text-2xl font-semibold" style={{ color: "var(--gold)" }}>
                    {studentProgress.masteryScore}%
                  </div>
                </div>

                <div
                  className="p-5 rounded-xl"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4" style={{ color: "var(--gold)" }} />
                    <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                      Last Active
                    </span>
                  </div>
                  <div className="text-2xl font-semibold" style={{ color: "var(--gold)" }}>
                    {formatDate(studentProgress.lastActive)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="p-5 rounded-xl"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ color: "var(--ink-secondary)" }}>
                    Completion Rate
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--gold)" }}>
                    {studentProgress.completionPercentage}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full" style={{ background: "var(--bg-night)" }}>
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${studentProgress.completionPercentage}%`,
                      background: "linear-gradient(90deg, var(--gold-deep) 0%, var(--gold) 100%)",
                    }}
                  />
                </div>
              </div>

              {/* Recent Activity */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
              >
                <div
                  className="p-4 text-xs uppercase tracking-[0.15em]"
                  style={{
                    background: "var(--bg-night)",
                    color: "var(--ink-tertiary)",
                    borderBottom: "1px solid var(--hairline)",
                  }}
                >
                  Recent Activity
                </div>
                <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                  {studentActivity.length === 0 ? (
                    <div className="p-8 text-center" style={{ color: "var(--ink-tertiary)" }}>
                      No recent activity
                    </div>
                  ) : (
                    studentActivity.map((activity) => (
                      <div key={activity.id} className="p-4 flex items-center gap-4">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: activity.type === "lesson_completed"
                              ? "var(--gold)"
                              : activity.type === "lesson_started"
                              ? "#f59e0b"
                              : "var(--ink-tertiary)",
                          }}
                        />
                        <div className="flex-1">
                          <div className="text-sm" style={{ color: "var(--ink-primary)" }}>
                            {activity.description}
                          </div>
                          <div className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                            {formatDate(activity.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TeacherStudentPreviewPage;