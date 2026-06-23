/**
 * Teacher Dashboard Types
 * Types for the teacher dashboard foundation
 */

/**
 * User role enum
 */
export type UserRole = "student" | "teacher";

/**
 * Class information
 */
export interface ClassInfo {
  _id: string;
  className: string;
  classCode: string;
  description?: string;
  teacherId: string;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Student summary for dashboard
 */
export interface StudentSummary {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  lastActiveAt?: string;
  totalSessions: number;
  averageScore: number;
}

/**
 * Student activity entry
 */
export interface StudentActivity {
  _id: string;
  studentId: string;
  studentName: string;
  action:
    | "session_started"
    | "session_completed"
    | "achievement_earned"
    | "artifact_unlocked"
    | "breakthrough";
  description: string;
  timestamp: string;
}

/**
 * Learning insight data
 */
export interface LearningInsight {
  metric: string;
  value: number | string;
  change?: number; // percentage change
  trend?: "up" | "down" | "stable";
}

/**
 * Report summary
 */
export interface ReportSummary {
  id: string;
  name: string;
  type: "progress" | "achievements" | "mastery" | "interventions";
  generatedAt?: string;
  studentCount?: number;
}

/**
 * Dashboard overview data
 */
export interface DashboardOverview {
  totalClasses: number;
  totalStudents: number;
  activeToday: number;
  averageMastery: number;
}

/**
 * Activity feed item
 */
export interface ActivityFeedItem {
  id: string;
  studentName: string;
  action: string;
  details: string;
  timestamp: string;
}

/**
 * Analytics API Types (matching backend responses)
 */

/**
 * Teacher dashboard data
 */
export interface TeacherDashboard {
  totalClasses: number;
  totalStudents: number;
  activeToday: number;
  lessonsAssigned: number;
  lessonsCompleted: number;
  averageMastery: number;
  recentActivity: DashboardActivity[];
}

/**
 * Dashboard activity feed item
 */
export interface DashboardActivity {
  id: string;
  studentId?: string;
  studentName?: string;
  action: string;
  description: string;
  timestamp: string;
}

/**
 * Class analytics data
 */
export interface ClassAnalytics {
  className: string;
  enrolledStudents: number;
  activeStudents: number;
  assignedLessons: number;
  completedLessons: number;
  completionRate: number;
  averageMastery: number;
  totalLearningTime: number;
}

/**
 * Individual student progress data
 */
export interface StudentProgress {
  studentId: string;
  name: string;
  email: string;
  lessonsStarted: number;
  lessonsCompleted: number;
  completionPercentage: number;
  masteryScore: number;
  totalTimeSpent: number;
  lastActive: string | null;
}

/**
 * Class activity feed item
 */
export interface ClassActivityItem {
  id: string;
  type: "lesson_assigned" | "lesson_started" | "lesson_completed" | "student_joined";
  description: string;
  timestamp: string;
}
