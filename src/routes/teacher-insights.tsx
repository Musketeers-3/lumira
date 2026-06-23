/**
 * Teacher Insights Route
 * View learning insights and mastery analytics
 */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { getMyClasses, type ClassData } from "@/services/api/classApi";
import {
  getTeacherDashboard,
  getClassAnalytics,
  type TeacherDashboard,
  type ClassAnalytics,
} from "@/services/api/analyticsApi";
import {
  Lightbulb,
  TrendingUp,
  Target,
  Zap,
  Sparkles,
  Users,
  BookOpen,
  Clock,
  Award,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/teacher-insights")({
  component: TeacherInsightsPage,
});

/**
 * Format seconds to human readable time
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

function TeacherInsightsPage() {
  const { isLoading: isGuardLoading } = useTeacherRouteGuard();

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [dashboard, setDashboard] = useState<TeacherDashboard | null>(null);
  const [classAnalytics, setClassAnalytics] = useState<ClassAnalytics[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

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

  // Load dashboard analytics
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoadingDashboard(true);
        const data = await getTeacherDashboard();
        setDashboard(data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, []);

  // Load analytics for each class
  useEffect(() => {
    const loadClassAnalytics = async () => {
      if (classes.length === 0) {
        setIsLoadingAnalytics(false);
        return;
      }

      try {
        setIsLoadingAnalytics(true);
        const analyticsData = await Promise.all(
          classes.map((cls) => getClassAnalytics(cls._id).catch(() => null))
        );
        setClassAnalytics(analyticsData.filter(Boolean) as ClassAnalytics[]);
      } catch (err) {
        console.error("Failed to load class analytics:", err);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    loadClassAnalytics();
  }, [classes]);

  // Get selected class analytics
  const selectedAnalytics = useMemo(() => {
    if (!selectedClassId) return null;
    return classAnalytics.find((a) => a.className === classes.find((c) => c._id === selectedClassId)?.className) || null;
  }, [classAnalytics, selectedClassId, classes]);

  // Calculate aggregated stats
  const stats = useMemo(() => {
    const analytics = classAnalytics;
    return {
      avgMastery: analytics.length > 0
        ? Math.round(analytics.reduce((sum, a) => sum + a.averageMastery, 0) / analytics.length)
        : 0,
      totalEnrolled: analytics.reduce((sum, a) => sum + a.enrolledStudents, 0),
      totalActive: analytics.reduce((sum, a) => sum + a.activeStudents, 0),
      totalLearningTime: analytics.reduce((sum, a) => sum + a.totalLearningTime, 0),
      avgCompletion: analytics.length > 0
        ? Math.round(analytics.reduce((sum, a) => sum + a.completionRate, 0) / analytics.length)
        : 0,
    };
  }, [classAnalytics]);

  if (isGuardLoading) {
    return <RouteGuardLoading />;
  }

  const isLoading = isLoadingClasses || isLoadingDashboard || isLoadingAnalytics;
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
              <Lightbulb className="w-10 h-10" style={{ color: "var(--ink-tertiary)" }} />
            </div>

            <h3
              className="text-xl font-semibold font-display mb-3"
              style={{ color: "var(--ink-primary)" }}
            >
              No Classes Yet
            </h3>
            <p className="max-w-md mx-auto text-sm mb-8" style={{ color: "var(--ink-secondary)" }}>
              Create a class and enroll students to see learning insights and analytics.
            </p>
          </div>
        </div>
      )}

      {/* Analytics Content */}
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

          {/* Stats Grid */}
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)", borderRadius: "12px" }}
          >
            {/* Average Mastery */}
            <div
              className="p-6 rounded-xl"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-5 h-5" style={{ color: "var(--gold)" }} />
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Avg. Mastery
                </span>
              </div>
              <div className="text-3xl font-semibold" style={{ color: "var(--gold)" }}>
                {selectedAnalytics?.averageMastery ?? stats.avgMastery}%
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                Across all classes
              </div>
            </div>

            {/* Active Students */}
            <div
              className="p-6 rounded-xl"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5" style={{ color: "var(--gold)" }} />
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Active Students
                </span>
              </div>
              <div className="text-3xl font-semibold" style={{ color: "var(--gold)" }}>
                {selectedAnalytics?.activeStudents ?? stats.totalActive}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                Last 7 days
              </div>
            </div>

            {/* Completion Rate */}
            <div
              className="p-6 rounded-xl"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5" style={{ color: "var(--gold)" }} />
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Completion Rate
                </span>
              </div>
              <div className="text-3xl font-semibold" style={{ color: "var(--gold)" }}>
                {selectedAnalytics?.completionRate ?? stats.avgCompletion}%
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                Lessons completed
              </div>
            </div>

            {/* Learning Time */}
            <div
              className="p-6 rounded-xl"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5" style={{ color: "var(--gold)" }} />
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--ink-tertiary)" }}>
                  Total Learning Time
                </span>
              </div>
              <div className="text-3xl font-semibold" style={{ color: "var(--gold)" }}>
                {formatTime(selectedAnalytics?.totalLearningTime ?? stats.totalLearningTime)}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                Across all students
              </div>
            </div>
          </div>

          {/* Class Details */}
          {selectedAnalytics && (
            <div
              className="rounded-xl p-6"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--ink-primary)" }}
              >
                {selectedAnalytics.className} Details
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "var(--bg-night)" }}>
                  <Users className="w-5 h-5" style={{ color: "var(--gold)" }} />
                  <div>
                    <div className="text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>
                      {selectedAnalytics.enrolledStudents}
                    </div>
                    <div className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                      Enrolled Students
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "var(--bg-night)" }}>
                  <Activity className="w-5 h-5" style={{ color: "var(--gold)" }} />
                  <div>
                    <div className="text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>
                      {selectedAnalytics.activeStudents}
                    </div>
                    <div className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                      Active (7 days)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "var(--bg-night)" }}>
                  <BookOpen className="w-5 h-5" style={{ color: "var(--gold)" }} />
                  <div>
                    <div className="text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>
                      {selectedAnalytics.assignedLessons}
                    </div>
                    <div className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                      Lessons Assigned
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "var(--bg-night)" }}>
                  <Target className="w-5 h-5" style={{ color: "var(--gold)" }} />
                  <div>
                    <div className="text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>
                      {selectedAnalytics.completedLessons}
                    </div>
                    <div className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                      Lessons Completed
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "var(--bg-night)" }}>
                  <Zap className="w-5 h-5" style={{ color: "var(--gold)" }} />
                  <div>
                    <div className="text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>
                      {selectedAnalytics.completionRate}%
                    </div>
                    <div className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                      Completion Rate
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "var(--bg-night)" }}>
                  <Award className="w-5 h-5" style={{ color: "var(--gold)" }} />
                  <div>
                    <div className="text-lg font-semibold" style={{ color: "var(--ink-primary)" }}>
                      {selectedAnalytics.averageMastery}%
                    </div>
                    <div className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                      Average Mastery
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Preview Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
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
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
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
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
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
        </>
      )}
    </div>
  );
}

export default TeacherInsightsPage;