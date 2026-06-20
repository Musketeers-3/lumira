/**
 * Teacher Dashboard Route
 * Observatory-style command center for teachers to monitor student progress
 */

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
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
 * Placeholder data - will be replaced with API calls
 */
function getPlaceholderData() {
  const overview: DashboardOverview = {
    totalClasses: 3,
    totalStudents: 24,
    activeToday: 8,
    averageMastery: 67,
  };

  const classes: ClassInfo[] = [
    {
      _id: "class-1",
      name: "Introduction to Physics",
      description: "Fundamental concepts of mechanics and waves",
      studentCount: 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "class-2",
      name: "Advanced Mathematics",
      description: "Calculus and linear algebra foundations",
      studentCount: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "class-3",
      name: "Chemistry Lab",
      description: "Practical chemistry experiments and safety",
      studentCount: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const activities: StudentActivityType[] = [
    {
      _id: "act-1",
      studentId: "student-1",
      studentName: "Alex Chen",
      action: "breakthrough",
      description: "Mastered the concept of gravitational forces",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      _id: "act-2",
      studentId: "student-2",
      studentName: "Maria Garcia",
      action: "achievement_earned",
      description: "Earned 'Star Born' achievement",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      _id: "act-3",
      studentId: "student-3",
      studentName: "James Wilson",
      action: "session_completed",
      description: "Completed quantum mechanics session",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      _id: "act-4",
      studentId: "student-4",
      studentName: "Sarah Kim",
      action: "artifact_unlocked",
      description: "Unlocked 'Photon Collector' artifact",
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
  ];

  const reports: ReportSummary[] = [
    {
      id: "progress-1",
      name: "Weekly Progress",
      type: "progress",
      studentCount: 24,
    },
    {
      id: "achievements-1",
      name: "Achievement Summary",
      type: "achievements",
      studentCount: 18,
    },
    {
      id: "mastery-1",
      name: "Mastery Report",
      type: "mastery",
      studentCount: 24,
    },
    {
      id: "interventions-1",
      name: "Intervention Alerts",
      type: "interventions",
      studentCount: 3,
    },
  ];

  return { overview, classes, activities, reports };
}

function TeacherDashboardPage() {
  const router = useRouter();
  const { user, isTeacher, isAuthenticated, isLoading } = useAuth();

  // DEBUG: Log auth state to diagnose role issue
  console.log("[TeacherDashboard] AUTH DEBUG:", {
    user,
    role: user?.role,
    isTeacher,
    isAuthenticated,
    isLoading,
  });

  // Placeholder data
  const { overview, classes, activities, reports } = useMemo(() => getPlaceholderData(), []);

  const hasClasses = classes.length > 0;

  // Client-side authorization: redirect non-teachers to home
  // This follows the same pattern as the rest of the app - auth is checked client-side
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Not logged in - redirect to login
      router.navigate({ to: "/login" });
    } else if (!isLoading && isAuthenticated && !isTeacher) {
      // Logged in but not a teacher - redirect to home
      router.navigate({ to: "/" });
    }
  }, [isLoading, isAuthenticated, isTeacher, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-white/5" />
          <div className="h-4 w-64 rounded bg-white/5" />
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="h-24 rounded-xl bg-white/5" />
            <div className="h-24 rounded-xl bg-white/5" />
            <div className="h-24 rounded-xl bg-white/5" />
            <div className="h-24 rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  // Additional check: if somehow we got here and user is not a teacher, redirect
  if (!isTeacher) {
    // This should rarely happen since useEffect handles redirect, but as a safety net
    router.navigate({ to: "/" });
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Dashboard Header */}
      <DashboardHeader teacherName={user?.name || "Teacher"} />

      {/* Empty state when no classes */}
      {!hasClasses && <EmptyClassState />}

      {/* Dashboard content when classes exist */}
      {hasClasses && (
        <>
          {/* Learning Insights */}
          <LearningInsights overview={overview} insights={[]} />

          {/* Class Overview */}
          <ClassOverview classes={classes} />

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
