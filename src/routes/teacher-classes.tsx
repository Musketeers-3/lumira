/**
 * Teacher Classes Route
 * Manage and view your classes
 */

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { getMyClasses, type ClassData } from "@/services/api/classApi";
import {
  GraduationCap,
  Users,
  Clock,
  Plus,
  Sparkles,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/teacher-classes")({
  component: TeacherClassesPage,
});

function TeacherClassesPage() {
  const { isLoading: isGuardLoading } = useTeacherRouteGuard();
  const router = useRouter();

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load classes from API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMyClasses();
        setClasses(data);
      } catch (err) {
        console.error("Failed to load classes:", err);
        setError("Failed to load classes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);

  // Copy class code to clipboard
  const handleCopyCode = async (classId: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(classId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Navigate to create class page
  const handleCreateClass = () => {
    router.navigate({ to: "/teacher/create-class" });
  };

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

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                boxShadow: "0 0 30px rgba(201,162,75,0.3)",
              }}
            >
              <GraduationCap className="w-8 h-8" style={{ color: "var(--bg-primary)" }} />
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
                Your Classes
              </h1>
              <p
                className="mt-2 max-w-xl text-sm md:text-base"
                style={{ color: "var(--ink-secondary)" }}
              >
                Organize your students into classes. Create structured learning journeys and track
                progress across multiple subjects.
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateClass}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
              color: "var(--bg-primary)",
              boxShadow: "0 4px 20px rgba(201,162,75,0.3)",
            }}
          >
            <Plus className="w-4 h-4" />
            Create Class
          </button>
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
              No Classes Yet
            </h3>
            <p className="max-w-md mx-auto text-sm mb-8" style={{ color: "var(--ink-secondary)" }}>
              Create your first class to start organizing students and tracking their learning
              journeys. Classes allow you to bundle lessons and monitor progress across groups.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleCreateClass}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                  color: "var(--bg-primary)",
                }}
              >
                <Plus className="w-4 h-4" />
                Create Class
              </button>
            </div>

            {/* Feature Preview Cards */}
            <div className="grid gap-4 md:grid-cols-3 mt-12 max-w-3xl mx-auto">
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
              >
                <Users className="w-6 h-6 mb-2" style={{ color: "var(--gold)" }} />
                <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                  Student Management
                </h4>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Enroll and manage students in your classes
                </p>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
              >
                <Clock className="w-6 h-6 mb-2" style={{ color: "var(--gold)" }} />
                <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                  Progress Tracking
                </h4>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Monitor learning milestones in real-time
                </p>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
              >
                <Sparkles className="w-6 h-6 mb-2" style={{ color: "var(--gold)" }} />
                <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                  Custom Lessons
                </h4>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Assign specific lessons to each class
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classes List */}
      {!isLoading && !error && classes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <button
              key={classItem._id}
              onClick={() => router.navigate({ to: "/teacher-students", search: { classId: classItem._id } })}
              className="group relative rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 text-left w-full"
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

                {/* Class Code */}
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className="px-2 py-1 rounded text-xs font-mono font-medium"
                    style={{
                      background: "var(--bg-primary)",
                      color: "var(--gold-deep)",
                      border: "1px solid var(--gold)",
                    }}
                  >
                    {classItem.classCode}
                  </div>
                  <button
                    onClick={() => handleCopyCode(classItem._id, classItem.classCode)}
                    className="p-1 rounded transition-all hover:scale-110"
                    style={{ color: "var(--ink-tertiary)" }}
                    title={copiedId === classItem._id ? "Copied!" : "Copy code"}
                  >
                    {copiedId === classItem._id ? (
                      <Check className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
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
                  <ChevronRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    style={{ color: "var(--ink-tertiary)" }}
                  />
                </div>
              </div>
            </button>
          ))}

          {/* Add New Class Card */}
          <button
            onClick={handleCreateClass}
            className="group relative flex flex-col items-center justify-center rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 min-h-[180px]"
            style={{
              background: "transparent",
              border: "2px dashed var(--hairline)",
            }}
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-all group-hover:scale-110"
              style={{
                background: "var(--bg-night)",
                border: "1px solid var(--hairline)",
              }}
            >
              <Plus className="w-6 h-6" style={{ color: "var(--gold)" }} />
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--ink-secondary)" }}>
              Create New Class
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default TeacherClassesPage;
