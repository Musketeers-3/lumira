/**
 * Teacher Insights Route
 * View learning insights and mastery analytics
 */

import { createFileRoute } from "@tanstack/react-router";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { Lightbulb, TrendingUp, Target, Zap, Sparkles, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/teacher-insights")({
  component: TeacherInsightsPage,
});

function TeacherInsightsPage() {
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
              <Lightbulb className="w-8 h-8" style={{ color: "var(--bg-primary)" }} />
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
                Learning Insights
              </h1>
              <p
                className="mt-2 max-w-xl text-sm md:text-base"
                style={{ color: "var(--ink-secondary)" }}
              >
                Discover patterns in student learning. Identify breakthrough moments, skill gaps,
                and opportunities for intervention.
              </p>
            </div>
          </div>
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
            <Lightbulb className="w-10 h-10" style={{ color: "var(--ink-tertiary)" }} />
          </div>

          <h3
            className="text-xl font-semibold font-display mb-3"
            style={{ color: "var(--ink-primary)" }}
          >
            Mastery Analytics Coming Soon
          </h3>
          <p className="max-w-md mx-auto text-sm mb-8" style={{ color: "var(--ink-secondary)" }}>
            Advanced learning analytics will illuminate student progress patterns, skill
            trajectories, and personalized recommendations for each learner.
          </p>

          {/* Feature Preview Cards */}
          <div className="grid gap-4 md:grid-cols-3 mt-12 max-w-3xl mx-auto">
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <TrendingUp className="w-6 h-6 mb-2" style={{ color: "var(--gold)" }} />
              <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                Skill Trajectories
              </h4>
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                Track mastery progression over time
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <Target className="w-6 h-6 mb-2" style={{ color: "var(--gold)" }} />
              <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                Gap Detection
              </h4>
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                Identify concepts that need reinforcement
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <Zap className="w-6 h-6 mb-2" style={{ color: "var(--gold)" }} />
              <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                Intervention Triggers
              </h4>
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                AI-powered alerts for struggling students
              </p>
            </div>
          </div>

          {/* Preview Stats Placeholder */}
          <div
            className="grid gap-4 sm:grid-cols-4 mt-8 max-w-2xl mx-auto p-6 rounded-xl"
            style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
          >
            <div className="text-center">
              <div className="text-2xl font-semibold" style={{ color: "var(--gold)" }}>
                --
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                Avg. Mastery
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold" style={{ color: "var(--gold)" }}>
                --
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                Breakthroughs
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold" style={{ color: "var(--gold)" }}>
                --
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                Active Now
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold" style={{ color: "var(--gold)" }}>
                --
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                Need Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherInsightsPage;
