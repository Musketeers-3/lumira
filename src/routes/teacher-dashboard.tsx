/**
 * Teacher Dashboard Route
 * Observatory-style command center for teachers to monitor student progress
 */

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useEffect, useState } from "react";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { useAuth } from "@/lib/auth-context";
import { getMyClasses, type ClassData } from "@/services/api/classApi";
import {
  getTeacherDashboard,
  type TeacherDashboard,
  type ActivityFeed,
} from "@/services/api/analyticsApi";
import {
  DashboardHeader,
  ClassOverview,
  StudentActivity,
  LearningInsights,
  Reports,
  EmptyClassState,
} from "@/components/teacher";
import type {
  DashboardOverview,
  StudentActivity as StudentActivityType,
  ClassInfo,
  ReportSummary,
} from "@/types/teacher";

export const Route = createFileRoute("/teacher-dashboard")({
  component: TeacherDashboardPage,
});

/**
 * Convert dashboard activity to student activity type
 */
function mapToStudentActivity(activities: ActivityFeed[]): StudentActivityType[] {
  return activities.map((activity) => ({
    _id: activity.id,
    studentId: activity.studentId || "",
    studentName: activity.studentName || "Unknown",
    action: activity.action as StudentActivityType["action"],
    description: activity.description,
    timestamp: activity.timestamp,
  }));
}

/**
 * Generate reports from dashboard data
 */
function generateReports(dashboard: TeacherDashboard): ReportSummary[] {
  return [
    {
      id: "progress-1",
      name: "Weekly Progress",
      type: "progress",
      studentCount: dashboard.totalStudents,
    },
    {
      id: "achievements-1",
      name: "Achievement Summary",
      type: "achievements",
      studentCount: dashboard.lessonsCompleted,
    },
    {
      id: "mastery-1",
      name: "Mastery Report",
      type: "mastery",
      studentCount: dashboard.totalStudents,
    },
    {
      id: "interventions-1",
      name: "Completion Rate",
      type: "progress",
      studentCount: dashboard.lessonsAssigned > 0
        ? Math.round((dashboard.lessonsCompleted / dashboard.lessonsAssigned) * 100)
        : 0,
    },
  ];
}

function TeacherDashboardPage() {
  const { isLoading: isGuardLoading } = useTeacherRouteGuard();
  const { user } = useAuth();

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [dashboard, setDashboard] = useState<TeacherDashboard | null>(null);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load classes from API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoadingClasses(true);
        setError(null);
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

  // Load dashboard analytics from API
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoadingDashboard(true);
        const data = await getTeacherDashboard();
        setDashboard(data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        // Don't set error - dashboard is optional
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, []);

  // Convert API class data to ClassInfo type for components
  const classInfoList: ClassInfo[] = useMemo(() => {
    return classes.map((c) => ({
      _id: c._id,
      className: c.className,
      classCode: c.classCode,
      description: c.description,
      teacherId: c.teacherId,
      studentCount: c.studentCount,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }, [classes]);

  // Calculate overview from real dashboard data or fallback to class data
  const overview: DashboardOverview = useMemo(() => {
    if (dashboard) {
      return {
        totalClasses: dashboard.totalClasses,
        totalStudents: dashboard.totalStudents,
        activeToday: dashboard.activeToday,
        averageMastery: dashboard.averageMastery,
      };
    }
    // Fallback to class-based calculation
    const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0);
    return {
      totalClasses: classes.length,
      totalStudents,
      activeToday: 0,
      averageMastery: 0,
    };
  }, [classes, dashboard]);

  // Use real activities from dashboard or empty array
  const activities: StudentActivityType[] = useMemo(() => {
    if (dashboard?.recentActivity) {
      return mapToStudentActivity(dashboard.recentActivity);
    }
    return [];
  }, [dashboard]);

  // Generate reports from dashboard data
  const reports: ReportSummary[] = useMemo(() => {
    if (dashboard) {
      return generateReports(dashboard);
    }
    return [];
  }, [dashboard]);

  // Show loading while auth is being checked
  if (isGuardLoading) {
    return <RouteGuardLoading />;
  }

  const hasClasses = classInfoList.length > 0;
  const isLoading = isLoadingClasses || isLoadingDashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Dashboard Header */}
      <DashboardHeader teacherName={user?.name || "Teacher"} />

      {/* Loading state */}
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

      {/* Error state */}
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

      {/* Empty state when no classes */}
      {!isLoading && !error && !hasClasses && <EmptyClassState />}

      {/* Dashboard content when classes exist */}
      {!isLoading && !error && hasClasses && (
        <>
          {/* Learning Insights */}
          <LearningInsights overview={overview} insights={[]} />

          {/* Class Overview */}
          <ClassOverview classes={classInfoList} />

          {/* Two column layout: Activity + Reports */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Student Activity */}
            <StudentActivity activities={activities} />

            {/* Reports */}
            <Reports reports={reports} />
          </div>
        </>
      )}
    </div>
  );
}

export default TeacherDashboardPage;