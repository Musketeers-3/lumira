/**
 * Teacher Students Route
 * View and manage your student roster
 */

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { getMyClasses, getClassStudents, getClassLessons, assignLessonToClass, removeLessonFromClass, type ClassData, type ClassStudentData, type AssignedLessonData } from "@/services/api/classApi";
import { getLessons, type LessonDraft } from "@/services/api/lessonApi";
import {
  Users,
  UserPlus,
  Sparkles,
  ChevronDown,
  Copy,
  Check,
  GraduationCap,
  Mail,
  Calendar,
  Circle,
  BookOpen,
  Plus,
  X,
  Clock,
  Trash2,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/teacher-students")({
  component: TeacherStudentsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      classId: search.classId as string | undefined,
    };
  },
});

function TeacherStudentsPage() {
  const { isLoading: isGuardLoading } = useTeacherRouteGuard();
  const router = useRouter();
  const search = Route.useSearch();
  const classIdFromUrl = search.classId;

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<ClassStudentData[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classIdFromUrl || null);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  // Lesson assignment state
  const [assignedLessons, setAssignedLessons] = useState<AssignedLessonData[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [publishedLessons, setPublishedLessons] = useState<LessonDraft[]>([]);
  const [isLoadingPublished, setIsLoadingPublished] = useState(false);
  const [assigningLesson, setAssigningLesson] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "lessons">("students");

  // Load teacher's classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoadingClasses(true);
        setError(null);
        const data = await getMyClasses();
        setClasses(data);

        // Set initial selected class based on URL or first available
        if (classIdFromUrl && data.some((c) => c._id === classIdFromUrl)) {
          setSelectedClassId(classIdFromUrl);
        } else if (data.length > 0 && !selectedClassId) {
          setSelectedClassId(data[0]._id);
        }
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
        setIsLoadingStudents(true);
        setError(null);
        const data = await getClassStudents(selectedClassId);
        setStudents(data);
      } catch (err) {
        console.error("Failed to load students:", err);
        setError("Failed to load students");
      } finally {
        setIsLoadingStudents(false);
      }
    };

    loadStudents();
  }, [selectedClassId]);

  // Load assigned lessons when class is selected
  useEffect(() => {
    const loadAssignedLessons = async () => {
      if (!selectedClassId) {
        setAssignedLessons([]);
        return;
      }

      try {
        setIsLoadingLessons(true);
        const data = await getClassLessons(selectedClassId);
        setAssignedLessons(data);
      } catch (err) {
        console.error("Failed to load assigned lessons:", err);
      } finally {
        setIsLoadingLessons(false);
      }
    };

    loadAssignedLessons();
  }, [selectedClassId]);

  // Get selected class info
  const selectedClass = useMemo(() => {
    return classes.find((c) => c._id === selectedClassId) || null;
  }, [classes, selectedClassId]);

  // Handle class selection
  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    setShowClassDropdown(false);
    // Update URL
    router.navigate({ to: "/teacher-students", search: { classId } });
  };

  // Copy class code
  const handleCopyCode = async () => {
    if (selectedClass) {
      await navigator.clipboard.writeText(selectedClass.classCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Open lesson assignment modal
  const handleOpenLessonModal = async () => {
    if (!selectedClassId) return;
    try {
      setIsLoadingPublished(true);
      const lessons = await getLessons();
      const published = lessons.filter((l) => l.isPublished);
      setPublishedLessons(published);
      setShowLessonModal(true);
    } catch (err) {
      console.error("Failed to load lessons:", err);
    } finally {
      setIsLoadingPublished(false);
    }
  };

  // Assign a lesson to the class
  const handleAssignLesson = async (lessonId: string) => {
    if (!selectedClassId) return;
    try {
      setAssigningLesson(lessonId);
      await assignLessonToClass(selectedClassId, { lessonId });
      // Refresh assigned lessons
      const data = await getClassLessons(selectedClassId);
      setAssignedLessons(data);
      setShowLessonModal(false);
    } catch (err) {
      console.error("Failed to assign lesson:", err);
      alert("Failed to assign lesson. It may already be assigned.");
    } finally {
      setAssigningLesson(null);
    }
  };

  // Remove lesson from class
  const handleRemoveLesson = async (lessonId: string) => {
    if (!selectedClassId) return;
    if (!confirm("Are you sure you want to remove this lesson from the class?")) return;
    try {
      await removeLessonFromClass(selectedClassId, lessonId);
      // Refresh assigned lessons
      const data = await getClassLessons(selectedClassId);
      setAssignedLessons(data);
    } catch (err) {
      console.error("Failed to remove lesson:", err);
    }
  };

  if (isGuardLoading) {
    return <RouteGuardLoading />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="relative rounded-2xl p-6 md:p-8" style={{ overflow: "visible" }}>
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

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                boxShadow: "0 0 30px rgba(201,162,75,0.3)",
              }}
            >
              <Users className="w-8 h-8" style={{ color: "var(--bg-primary)" }} />
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
                Student Roster
              </h1>
              <p
                className="mt-2 max-w-xl text-sm md:text-base"
                style={{ color: "var(--ink-secondary)" }}
              >
                View and manage your enrolled students. Track their progress, achievements, and
                learning journeys.
              </p>
            </div>
          </div>

          {/* Class Selector Dropdown */}
          {classes.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="inline-flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl font-medium text-sm transition-all duration-300 min-w-[200px] justify-between"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--hairline)",
                  color: "var(--ink-primary)",
                }}
              >
                <span className="truncate">
                  {selectedClass ? selectedClass.className : "Select a class"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showClassDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showClassDropdown && (
                <div
                  className="absolute top-full mt-2 w-full rounded-xl shadow-2xl z-50"
                  style={{
                    background: "rgba(0, 0, 0, 0.95)",
                    border: "1px solid var(--hairline)",
                    backdropFilter: "blur(24px)",
                    maxHeight: "18rem",
                    overflowY: "auto",
                  }}
                >
                  {classes.map((cls) => (
                    <button
                      key={cls._id}
                      onClick={() => handleSelectClass(cls._id)}
                      className="w-full px-4 py-3 min-h-[48px] flex justify-between items-center transition-colors hover:bg-white/5 border-b border-white/5 last:border-b-0"
                      style={{
                        background: cls._id === selectedClassId ? "rgba(251, 191, 36, 0.1)" : "transparent",
                        color: cls._id === selectedClassId ? "var(--gold)" : "var(--ink-primary)",
                      }}
                    >
                      <span className="truncate font-medium">{cls.className}</span>
                      <span className="text-xs" style={{ color: "var(--gold-soft)" }}>
                        {cls.studentCount} {cls.studentCount === 1 ? "student" : "students"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading State for Classes */}
      {isLoadingClasses && (
        <div className="flex items-center justify-center py-12">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2"
            style={{
              borderColor: "var(--gold) transparent var(--gold) transparent",
            }}
          />
        </div>
      )}

      {/* No Classes Created */}
      {!isLoadingClasses && classes.length === 0 && (
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
              <Users className="w-10 h-10" style={{ color: "var(--ink-tertiary)" }} />
            </div>

            <h3
              className="text-xl font-semibold font-display mb-3"
              style={{ color: "var(--ink-primary)" }}
            >
              No Classes Yet
            </h3>
            <p className="max-w-md mx-auto text-sm mb-8" style={{ color: "var(--ink-secondary)" }}>
              Create a class first to start managing your student roster. Students will appear here
              once they enroll using class codes.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.navigate({ to: "/teacher/create-class" })}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                  color: "var(--bg-primary)",
                }}
              >
                <GraduationCap className="w-4 h-4" />
                Create Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoadingClasses && (
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

      {/* Class Selected - Show Roster */}
      {!isLoadingClasses && classes.length > 0 && selectedClass && (
        <>
          {/* Class Info Bar */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl"
            style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
          >
            <div className="flex items-center gap-4">
              <div>
                <div
                  className="text-xs uppercase tracking-[0.15em]"
                  style={{ color: "var(--ink-tertiary)" }}
                >
                  Class Code
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-lg font-mono font-bold"
                    style={{ color: "var(--gold-deep)" }}
                  >
                    {selectedClass.classCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: "var(--ink-tertiary)" }}
                    title={copiedCode ? "Copied!" : "Copy code"}
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4" style={{ color: "var(--gold)" }} />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div
                className="h-10 w-px"
                style={{ background: "var(--hairline)" }}
              />
              <div>
                <div
                  className="text-xs uppercase tracking-[0.15em]"
                  style={{ color: "var(--ink-tertiary)" }}
                >
                  Enrolled
                </div>
                <div className="text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>
                  {students.length} {students.length === 1 ? "student" : "students"}
                </div>
              </div>
            </div>

            <div
              className="text-sm"
              style={{ color: "var(--ink-secondary)" }}
            >
              {selectedClass.className}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab("students")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === "students" ? "var(--gold-dim)" : "transparent",
                color: activeTab === "students" ? "var(--gold)" : "var(--ink-secondary)",
                border: activeTab === "students" ? "1px solid var(--gold)" : "1px solid transparent",
              }}
            >
              <Users className="w-4 h-4" />
              Students
              <span
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--ink-tertiary)",
                }}
              >
                {students.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("lessons")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === "lessons" ? "var(--gold-dim)" : "transparent",
                color: activeTab === "lessons" ? "var(--gold)" : "var(--ink-secondary)",
                border: activeTab === "lessons" ? "1px solid var(--gold)" : "1px solid transparent",
              }}
            >
              <BookOpen className="w-4 h-4" />
              Assigned Lessons
              <span
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--ink-tertiary)",
                }}
              >
                {assignedLessons.length}
              </span>
            </button>
          </div>

          {/* Students Tab Content */}
          {activeTab === "students" && (
            <>
              {/* Loading Students */}
              {isLoadingStudents && (
            <div className="flex items-center justify-center py-12">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2"
                style={{
                  borderColor: "var(--gold) transparent var(--gold) transparent",
                }}
              />
            </div>
          )}

          {/* Empty State - No Students */}
          {!isLoadingStudents && students.length === 0 && (
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
                  <Users className="w-10 h-10" style={{ color: "var(--ink-tertiary)" }} />
                </div>

                <h3
                  className="text-xl font-semibold font-display mb-3"
                  style={{ color: "var(--ink-primary)" }}
                >
                  No Students Enrolled Yet
                </h3>
                <p className="max-w-md mx-auto text-sm mb-6" style={{ color: "var(--ink-secondary)" }}>
                  Share the class code with your students to let them enroll in this class.
                </p>

                <div
                  className="inline-flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--gold)",
                  }}
                >
                  <span className="text-sm" style={{ color: "var(--ink-tertiary)" }}>
                    Class Code:
                  </span>
                  <span
                    className="text-lg font-mono font-bold"
                    style={{ color: "var(--gold-deep)" }}
                  >
                    {selectedClass.classCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: "var(--ink-tertiary)" }}
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4" style={{ color: "var(--gold)" }} />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Student Roster Table - Responsive: cards on mobile, table on desktop */}
          {!isLoadingStudents && students.length > 0 && (
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
            >
              {/* Table Header - hidden on mobile, shown on desktop */}
              <div
                className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4 text-xs uppercase tracking-[0.15em]"
                style={{
                  background: "var(--bg-night)",
                  color: "var(--ink-tertiary)",
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Name
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined
                </div>
                <div>Status</div>
              </div>

              {/* Table Body - Stacked cards on mobile, grid on desktop */}
              <div className="divide-y md:divide-none" style={{ borderColor: "var(--hairline)" }}>
                {students.map((student) => (
                  <div
                    key={student._id}
                    className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-2 md:gap-4 p-4 items-center transition-colors hover:bg-white/5 md:rounded-none rounded-xl md:p-4"
                    style={{ background: "var(--bg-elevated)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                        style={{
                          background: "var(--gold-dim)",
                          color: "var(--gold)",
                        }}
                      >
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium" style={{ color: "var(--ink-primary)" }}>
                          {student.name}
                        </div>
                        {/* Mobile-only email display */}
                        <div className="md:hidden text-xs mt-1 truncate" style={{ color: "var(--ink-tertiary)" }}>
                          {student.email}
                        </div>
                      </div>
                    </div>
                    {/* Desktop-only email display */}
                    <div className="hidden md:block text-sm truncate" style={{ color: "var(--ink-secondary)" }}>
                      {student.email}
                    </div>
                    <div className="hidden md:block text-sm" style={{ color: "var(--ink-secondary)" }}>
                      {new Date(student.joinedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    {/* Mobile-only date display */}
                    <div className="md:hidden text-xs" style={{ color: "var(--ink-tertiary)" }}>
                      Joined: {new Date(student.joinedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle
                        className="w-2 h-2 fill-current"
                        style={{ color: "var(--gold)" }}
                      />
                      <span className="text-sm" style={{ color: "var(--gold-soft)" }}>
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </>
          )}

          {/* Lessons Tab Content */}
          {activeTab === "lessons" && (
            <>
              {/* Loading Lessons */}
              {isLoadingLessons && (
                <div className="flex items-center justify-center py-12">
                  <div
                    className="h-8 w-8 animate-spin rounded-full border-2"
                    style={{
                      borderColor: "var(--gold) transparent var(--gold) transparent",
                    }}
                  />
                </div>
              )}

              {/* Assigned Lessons */}
              {!isLoadingLessons && (
                <div className="space-y-4">
                  {/* Add Lesson Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleOpenLessonModal}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                        color: "var(--bg-primary)",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Assign Lesson
                    </button>
                  </div>

                  {/* Empty State - No Lessons */}
                  {assignedLessons.length === 0 && (
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
                          <BookOpen className="w-10 h-10" style={{ color: "var(--ink-tertiary)" }} />
                        </div>

                        <h3
                          className="text-xl font-semibold font-display mb-3"
                          style={{ color: "var(--ink-primary)" }}
                        >
                          No Lessons Assigned
                        </h3>
                        <p className="max-w-md mx-auto text-sm mb-6" style={{ color: "var(--ink-secondary)" }}>
                          Assign lessons to direct your students to specific learning content.
                        </p>

                        <button
                          onClick={handleOpenLessonModal}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
                          style={{
                            background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                            color: "var(--bg-primary)",
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Assign Your First Lesson
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lessons List */}
                  {assignedLessons.length > 0 && (
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
                    >
                      {/* Table Header */}
                      <div
                        className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 p-4 text-xs uppercase tracking-[0.15em]"
                        style={{
                          background: "var(--bg-night)",
                          color: "var(--ink-tertiary)",
                          borderBottom: "1px solid var(--hairline)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Lesson
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Topic
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Assigned
                        </div>
                        <div>Due Date</div>
                        <div></div>
                      </div>

                      {/* Table Body */}
                      <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                        {assignedLessons.map((lesson) => (
                          <div
                            key={lesson._id}
                            className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 p-4 items-center transition-colors hover:bg-white/5"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{
                                  background: "var(--gold-dim)",
                                  color: "var(--gold)",
                                }}
                              >
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-medium" style={{ color: "var(--ink-primary)" }}>
                                  {lesson.title}
                                </div>
                                <div className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                                  {lesson.difficulty} • {lesson.estimatedDuration} min
                                </div>
                              </div>
                            </div>
                            <div className="text-sm" style={{ color: "var(--ink-secondary)" }}>
                              {lesson.topic || lesson.realm || "—"}
                            </div>
                            <div className="text-sm" style={{ color: "var(--ink-secondary)" }}>
                              {new Date(lesson.assignedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-sm" style={{ color: "var(--ink-secondary)" }}>
                              {lesson.dueDate
                                ? new Date(lesson.dueDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "—"}
                            </div>
                            <button
                              onClick={() => handleRemoveLesson(lesson.lessonId)}
                              className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                              style={{ color: "var(--ink-tertiary)" }}
                              title="Remove lesson"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Lesson Assignment Modal */}
          {showLessonModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.7)" }}
              onClick={() => setShowLessonModal(false)}
            >
              <div
                className="w-full max-w-lg max-h-[80vh] overflow-hidden rounded-2xl"
                style={{ background: "var(--bg-elevated)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  className="flex items-center justify-between p-4"
                  style={{
                    borderBottom: "1px solid var(--hairline)",
                    background: "var(--bg-night)",
                  }}
                >
                  <h2
                    className="text-lg font-semibold font-display"
                    style={{ color: "var(--ink-primary)" }}
                  >
                    Assign Lesson
                  </h2>
                  <button
                    onClick={() => setShowLessonModal(false)}
                    className="p-2 rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: "var(--ink-tertiary)" }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(80vh - 120px)" }}>
                  {isLoadingPublished ? (
                    <div className="flex items-center justify-center py-12">
                      <div
                        className="h-8 w-8 animate-spin rounded-full border-2"
                        style={{
                          borderColor: "var(--gold) transparent var(--gold) transparent",
                        }}
                      />
                    </div>
                  ) : publishedLessons.length === 0 ? (
                    <div className="text-center py-8">
                      <p style={{ color: "var(--ink-secondary)" }}>
                        No published lessons available. Create and publish a lesson first.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {publishedLessons.map((lesson) => {
                        const isAlreadyAssigned = assignedLessons.some(
                          (a) => a.lessonId === lesson._id,
                        );
                        return (
                          <button
                            key={lesson._id}
                            disabled={isAlreadyAssigned || assigningLesson === lesson._id}
                            onClick={() => handleAssignLesson(lesson._id)}
                            className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              background: isAlreadyAssigned
                                ? "var(--bg-night)"
                                : "var(--bg-primary)",
                              border: "1px solid var(--hairline)",
                              opacity: isAlreadyAssigned ? 0.6 : 1,
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <div
                                className="font-medium truncate"
                                style={{ color: "var(--ink-primary)" }}
                              >
                                {lesson.title}
                              </div>
                              <div
                                className="text-xs truncate"
                                style={{ color: "var(--ink-tertiary)" }}
                              >
                                {lesson.topic || lesson.realm} • {lesson.difficulty} • {lesson.estimatedDuration} min
                              </div>
                            </div>
                            <div className="ml-3">
                              {assigningLesson === lesson._id ? (
                                <Loader2
                                  className="w-5 h-5 animate-spin"
                                  style={{ color: "var(--gold)" }}
                                />
                              ) : isAlreadyAssigned ? (
                                <span
                                  className="text-xs px-2 py-1 rounded"
                                  style={{
                                    background: "var(--gold-dim)",
                                    color: "var(--gold)",
                                  }}
                                >
                                  Assigned
                                </span>
                              ) : (
                                <Plus
                                  className="w-5 h-5"
                                  style={{ color: "var(--gold)" }}
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
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

export default TeacherStudentsPage;