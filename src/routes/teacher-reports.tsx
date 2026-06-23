/**
 * Teacher Reports Route
 * Generate and export reports
 */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { getMyClasses, type ClassData } from "@/services/api/classApi";
import {
  getTeacherDashboard,
  getClassAnalytics,
  getStudentProgress,
  type TeacherDashboard,
  type ClassAnalytics,
  type StudentProgress,
} from "@/services/api/analyticsApi";
import { FileText, Download, AlertTriangle, PieChart, TrendingUp, Sparkles, Users, Award, Activity, Clock } from "lucide-react";

export const Route = createFileRoute("/teacher-reports")({
  component: TeacherReportsPage,
});

/**
 * Format number with suffix
 */
function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

/**
 * Calculate intervention needed (students with low completion)
 */
function calculateInterventions(studentProgress: StudentProgress[]): number {
  return studentProgress.filter(s => s.completionPercentage < 30).length;
}

function TeacherReportsPage() {
  const { isLoading: isGuardLoading } = useTeacherRouteGuard();

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [dashboard, setDashboard] = useState<TeacherDashboard | null>(null);
  const [classAnalytics, setClassAnalytics] = useState<ClassAnalytics[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoadingClasses(true);
        const data = await getMyClasses();
        setClasses(data);
        if (data.length > 0) {
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

  // Load dashboard and class analytics
  useEffect(() => {
    const loadAnalytics = async () => {
      if (classes.length === 0) {
        setIsLoadingAnalytics(false);
        return;
      }

      try {
        setIsLoadingAnalytics(true);

        // Load dashboard
        const dashData = await getTeacherDashboard();
        setDashboard(dashData);

        // Load analytics for each class
        const analyticsData = await Promise.all(
          classes.map((cls) => getClassAnalytics(cls._id).catch(() => null))
        );
        setClassAnalytics(analyticsData.filter(Boolean) as ClassAnalytics[]);

        // Load student progress for first class
        if (classes[0]) {
          const progressData = await getStudentProgress(classes[0]._id);
          setStudentProgress(progressData);
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    loadAnalytics();
  }, [classes]);

  // Update student progress when class changes
  useEffect(() => {
    const loadProgress = async () => {
      if (!selectedClassId) return;
      try {
        const data = await getStudentProgress(selectedClassId);
        setStudentProgress(data);
      } catch (err) {
        console.error("Failed to load student progress:", err);
      }
    };

    loadProgress();
  }, [selectedClassId]);

  // Calculate stats
  const stats = useMemo(() => {
    const analytics = classAnalytics;
    return {
      totalStudents: dashboard?.totalStudents ?? 0,
      avgMastery: analytics.length > 0
        ? Math.round(analytics.reduce((sum, a) => sum + a.averageMastery, 0) / analytics.length)
        : 0,
      activeThisWeek: analytics.reduce((sum, a) => sum + a.activeStudents, 0),
      interventions: calculateInterventions(studentProgress),
      lessonsCompleted: dashboard?.lessonsCompleted ?? 0,
      lessonsAssigned: dashboard?.lessonsAssigned ?? 0,
    };
  }, [dashboard, classAnalytics, studentProgress]);

  // Report types
  const reportTypes = useMemo(() => [
    {
      id: "progress",
      title: "Progress Reports",
      description: "Weekly & monthly progress summaries",
      icon: TrendingUp,
    },
    {
      id: "achievements",
      title: "Achievement Summaries",
      description: "Badges, artifacts & milestones",
      icon: Award,
    },
    {
      id: "interventions",
      title: "Intervention Alerts",
      description: "Students needing extra support",
      icon: AlertTriangle,
      count: stats.interventions,
    },
    {
      id: "exports",
      title: "Data Exports",
      description: "CSV, PDF & API integrations",
      icon: Download,
    },
  ], [stats.interventions]);

  if (isGuardLoading) {
    return <RouteGuardLoading />;
  }

  const isLoading = isLoadingClasses || isLoadingAnalytics;
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
              <FileText className="w-10 h-10" style={{ color: "var(--ink-tertiary)" }} />
            </div>

            <h3
              className="text-xl font-semibold font-display mb-3"
              style={{ color: "var(--ink-primary)" }}
            >
              No Classes Yet
            </h3>
            <p className="max-w-md mx-auto text-sm mb-8" style={{ color: "var(--ink-secondary)" }}>
              Create a class and enroll students to generate reports.
            </p>
          </div>
        </div>
      )}

      {/* Reports Content */}
      {!isLoading && !error && hasClasses && (
        <>
          {/* Class Selector */}
          {classes.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {classes.map((cls) => (
                <button
                  key={cls._id}
                  onClick={() => setSelectedClassId(cls._id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    background: selectedClassId === cls._id ? "var(--gold-dim)" : "var(--bg-elevated)",
                    color: selectedClassId === cls._id ? "var(--gold)" : "var(--ink-secondary)",
                    border: selectedClassId === cls._id ? "1px solid var(--gold)" : "1px solid var(--hairline)",
                  }}
                >
                  {cls.className}
                </button>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)", borderRadius: "12px" }}
          >
            <div className="p-6 rounded-xl" style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}>
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5" style={{ color: "var(--gold)" }} />
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Total Students
                </span>
              </div>
              <div className="text-3xl font-semibold" style={{ color: "var(--gold)" }}>
                {formatNumber(stats.totalStudents)}
              </div>
            </div>

            <div className="p-6 rounded-xl" style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}>
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-5 h-5" style={{ color: "var(--gold)" }} />
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Avg. Mastery
                </span>
              </div>
              <div className="text-3xl font-semibold" style={{ color: "var(--gold)" }}>
                {stats.avgMastery}%
              </div>
            </div>

            <div className="p-6 rounded-xl" style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}>
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5" style={{ color: "var(--gold)" }} />
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Active This Week
                </span>
              </div>
              <div className="text-3xl font-semibold" style={{ color: "var(--gold)" }}>
                {stats.activeThisWeek}
              </div>
            </div>

            <div className="p-6 rounded-xl" style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}>
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5" style={{ color: stats.interventions > 0 ? "#ef4444" : "var(--gold)" }} />
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Interventions Needed
                </span>
              </div>
              <div className="text-3xl font-semibold" style={{ color: stats.interventions > 0 ? "#ef4444" : "var(--gold)" }}>
                {stats.interventions}
              </div>
            </div>
          </div>

          {/* Report Type Cards */}
          <div className="grid gap-4 md:grid-cols-2 mt-8 max-w-2xl mx-auto">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-xl flex items-start gap-4 cursor-pointer transition-all hover:scale-[1.02]"
                style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
              >
                <report.icon className="w-6 h-6 shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm mb-1" style={{ color: "var(--ink-primary)" }}>
                      {report.title}
                    </h4>
                    {'count' in report && report.count !== undefined && report.count > 0 && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444" }}
                      >
                        {report.count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                    {report.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Student Progress Table */}
          {studentProgress.length > 0 && (
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
            >
              <div
                className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 p-4 text-xs uppercase tracking-[0.15em]"
                style={{
                  background: "var(--bg-night)",
                  color: "var(--ink-tertiary)",
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <div>Student</div>
                <div>Progress</div>
                <div>Mastery</div>
                <div>Status</div>
              </div>

              <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                {studentProgress.slice(0, 10).map((student) => (
                  <div
                    key={student.studentId}
                    className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 p-4 items-center"
                  >
                    <div className="font-medium" style={{ color: "var(--ink-primary)" }}>
                      {student.name}
                    </div>
                    <div>
                      <div className="w-full h-2 rounded-full" style={{ background: "var(--bg-night)" }}>
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${student.completionPercentage}%`,
                            background: student.completionPercentage >= 70 ? "var(--gold)" : student.completionPercentage >= 30 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                      <div className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                        {student.completionPercentage}% complete
                      </div>
                    </div>
                    <div style={{ color: "var(--ink-secondary)" }}>
                      {student.masteryScore}%
                    </div>
                    <div>
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          background: student.completionPercentage >= 70
                            ? "rgba(34,197,94,0.2)"
                            : student.completionPercentage >= 30
                            ? "rgba(245,158,11,0.2)"
                            : "rgba(239,68,68,0.2)",
                          color: student.completionPercentage >= 70
                            ? "#22c55e"
                            : student.completionPercentage >= 30
                            ? "#f59e0b"
                            : "#ef4444",
                        }}
                      >
                        {student.completionPercentage >= 70 ? "On Track" : student.completionPercentage >= 30 ? "Needs Support" : "At Risk"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TeacherReportsPage;