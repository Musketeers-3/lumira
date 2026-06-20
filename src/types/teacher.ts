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
  name: string;
  description?: string;
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
