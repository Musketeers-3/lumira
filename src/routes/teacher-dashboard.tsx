/**
 * Teacher Dashboard Route
 * Observatory-style command center for teachers to monitor student progress
 */

import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
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
  const { isLoading } = useTeacherRouteGuard();
  const { user } = useAuth();

  // Placeholder data - must be called before early returns
  const { overview, classes, activities, reports } = useMemo(() => getPlaceholderData(), []);

  // Show loading while auth is being checked
  if (isLoading) {
    return <RouteGuardLoading />;
  }

  const hasClasses = classes.length > 0;

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
