/**
 * Teacher Student Preview Route
 * Preview the student learning experience
 */

import { createFileRoute } from "@tanstack/react-router";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { Eye, Sparkles, Compass, Map, Star, BookOpen, Play, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/teacher-student-preview")({
  component: TeacherStudentPreviewPage,
});

function TeacherStudentPreviewPage() {
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
                View Student Experience
              </h1>
              <p
                className="mt-2 max-w-xl text-sm md:text-base"
                style={{ color: "var(--ink-secondary)" }}
              >
                See what your students see. Preview the learner journey to understand how they
                interact with Lumira.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Mode Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-8"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--hairline)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
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

          <h3
            className="text-xl font-semibold font-display mb-3"
            style={{ color: "var(--ink-primary)" }}
          >
            Student Preview Mode
          </h3>
          <p className="max-w-lg text-sm mb-8" style={{ color: "var(--ink-secondary)" }}>
            Enter a preview mode where you can experience Lumira from a student's perspective. This
            helps you understand the learning flow and identify any navigation issues.
          </p>

          {/* Student Navigation Preview */}
          <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
            <div
              className="p-5 rounded-xl flex items-center gap-4"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <Compass className="w-6 h-6 shrink-0" style={{ color: "var(--gold)" }} />
              <div>
                <h4 className="font-medium text-sm" style={{ color: "var(--ink-primary)" }}>
                  Discovery Hub
                </h4>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Browse available lessons & worlds
                </p>
              </div>
            </div>
            <div
              className="p-5 rounded-xl flex items-center gap-4"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <Map className="w-6 h-6 shrink-0" style={{ color: "var(--gold)" }} />
              <div>
                <h4 className="font-medium text-sm" style={{ color: "var(--ink-primary)" }}>
                  Learning Worlds
                </h4>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Navigate themed learning environments
                </p>
              </div>
            </div>
            <div
              className="p-5 rounded-xl flex items-center gap-4"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <Star className="w-6 h-6 shrink-0" style={{ color: "var(--gold)" }} />
              <div>
                <h4 className="font-medium text-sm" style={{ color: "var(--ink-primary)" }}>
                  Constellation
                </h4>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  View skill mastery & achievements
                </p>
              </div>
            </div>
            <div
              className="p-5 rounded-xl flex items-center gap-4"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <BookOpen className="w-6 h-6 shrink-0" style={{ color: "var(--gold)" }} />
              <div>
                <h4 className="font-medium text-sm" style={{ color: "var(--ink-primary)" }}>
                  Journal
                </h4>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Track learning progress over time
                </p>
              </div>
            </div>
          </div>

          {/* Preview Action */}
          <div
            className="mt-8 p-4 rounded-xl flex items-center gap-4 max-w-lg mx-auto"
            style={{ background: "var(--bg-onyx)", border: "1px solid var(--hairline)" }}
          >
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: "var(--gold-soft)" }} />
            <div className="flex-1">
              <p className="text-sm" style={{ color: "var(--ink-secondary)" }}>
                Preview mode will launch the student interface in a read-only mode with sample data.
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 shrink-0"
              style={{
                background: "var(--bg-night)",
                color: "var(--ink-tertiary)",
                border: "1px solid var(--hairline)",
                cursor: "not-allowed",
                opacity: 0.6,
              }}
              disabled
            >
              <Play className="w-4 h-4" />
              Launch Preview
            </button>
          </div>

          {/* Feature Preview */}
          <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--hairline)" }}>
            <h4
              className="text-sm font-medium mb-4 text-center"
              style={{ color: "var(--ink-secondary)" }}
            >
              Preview Includes
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Mentor conversations",
                "Learning sessions",
                "Skill tracking",
                "Achievement system",
                "Journal entries",
              ].map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: "var(--bg-night)",
                    color: "var(--ink-tertiary)",
                    border: "1px solid var(--hairline)",
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherStudentPreviewPage;
