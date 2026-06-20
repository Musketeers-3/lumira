/**
 * Teacher Students Route
 * View and manage your student roster
 */

import { createFileRoute } from "@tanstack/react-router";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { Users, UserPlus, BarChart3, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/teacher-students")({
  component: TeacherStudentsPage,
});

function TeacherStudentsPage() {
  const { isLoading } = useTeacherRouteGuard();

  if (isLoading) {
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

          <button
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
              color: "var(--bg-primary)",
              boxShadow: "0 4px 20px rgba(201,162,75,0.3)",
            }}
          >
            <UserPlus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Empty State */}
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
          {/* Coming Soon Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider mb-6"
            style={{
              background: "var(--gold-dim)",
              color: "var(--gold)",
            }}
          >
            <Sparkles className="w-3 h-3" />
            Coming Soon
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
            No Enrolled Students
          </h3>
          <p className="max-w-md mx-auto text-sm mb-8" style={{ color: "var(--ink-secondary)" }}>
            Students will appear here once they enroll in your classes. You can invite students to
            join using class codes or manual enrollment.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                color: "var(--bg-primary)",
              }}
            >
              <UserPlus className="w-4 h-4" />
              Add Student
            </button>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid gap-4 md:grid-cols-3 mt-12 max-w-3xl mx-auto">
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <BarChart3 className="w-6 h-6 mb-2" style={{ color: "var(--gold)" }} />
              <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                Progress Analytics
              </h4>
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                View mastery levels and skill development
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <Star className="w-6 h-6 mb-2" style={{ color: "var(--gold)" }} />
              <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                Achievement Tracking
              </h4>
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                Monitor badges and artifacts earned
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <Users className="w-6 h-6 mb-2" style={{ color: "var(--gold)" }} />
              <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                Cohort Analysis
              </h4>
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                Compare progress across student groups
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherStudentsPage;
