/**
 * Teacher Reports Route
 * Generate and export reports
 */

import { createFileRoute } from "@tanstack/react-router";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { FileText, Download, AlertTriangle, PieChart, TrendingUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/teacher-reports")({
  component: TeacherReportsPage,
});

function TeacherReportsPage() {
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
              <FileText className="w-8 h-8" style={{ color: "var(--bg-primary)" }} />
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
                Reports Center
              </h1>
              <p
                className="mt-2 max-w-xl text-sm md:text-base"
                style={{ color: "var(--ink-secondary)" }}
              >
                Generate comprehensive reports on student progress, achievements, and learning
                outcomes. Export data for external analysis.
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
            <FileText className="w-10 h-10" style={{ color: "var(--ink-tertiary)" }} />
          </div>

          <h3
            className="text-xl font-semibold font-display mb-3"
            style={{ color: "var(--ink-primary)" }}
          >
            Reports & Exports
          </h3>
          <p className="max-w-md mx-auto text-sm mb-8" style={{ color: "var(--ink-secondary)" }}>
            Generate detailed reports on student progress, achievement summaries, and intervention
            alerts. Export data in multiple formats for external analysis.
          </p>

          {/* Report Type Preview Cards */}
          <div className="grid gap-4 md:grid-cols-2 mt-8 max-w-2xl mx-auto">
            <div
              className="p-5 rounded-xl flex items-start gap-4"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <TrendingUp className="w-6 h-6 shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
              <div className="text-left">
                <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                  Progress Reports
                </h4>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Weekly & monthly progress summaries
                </p>
              </div>
            </div>
            <div
              className="p-5 rounded-xl flex items-start gap-4"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <PieChart className="w-6 h-6 shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
              <div className="text-left">
                <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                  Achievement Summaries
                </h4>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Badges, artifacts & milestones
                </p>
              </div>
            </div>
            <div
              className="p-5 rounded-xl flex items-start gap-4"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
              <div className="text-left">
                <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                  Intervention Alerts
                </h4>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Students needing extra support
                </p>
              </div>
            </div>
            <div
              className="p-5 rounded-xl flex items-start gap-4"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <Download className="w-6 h-6 shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
              <div className="text-left">
                <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                  Data Exports
                </h4>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  CSV, PDF & API integrations
                </p>
              </div>
            </div>
          </div>

          {/* Demo Report Placeholder */}
          <div
            className="mt-8 p-6 rounded-xl text-left max-w-lg mx-auto"
            style={{ background: "var(--bg-onyx)", border: "1px solid var(--hairline)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium" style={{ color: "var(--ink-primary)" }}>
                Sample Report Preview
              </h4>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{ background: "var(--gold-dim)", color: "var(--gold)" }}
              >
                Preview
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--ink-tertiary)" }}>Total Students</span>
                <span style={{ color: "var(--ink-primary)" }}>--</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--ink-tertiary)" }}>Average Mastery</span>
                <span style={{ color: "var(--ink-primary)" }}>--%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--ink-tertiary)" }}>Active This Week</span>
                <span style={{ color: "var(--ink-primary)" }}>--</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--ink-tertiary)" }}>Interventions Needed</span>
                <span style={{ color: "var(--gold)" }}>--</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherReportsPage;
