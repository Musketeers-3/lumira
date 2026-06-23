import apiClient from "./apiClient";

/**
 * Analytics API
 * Teacher dashboard and class analytics endpoints
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
  recentActivity: ActivityFeed[];
}

/**
 * Activity feed item
 */
export interface ActivityFeed {
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

/**
 * Get teacher dashboard analytics
 */
export const getTeacherDashboard = async (): Promise<TeacherDashboard> => {
  const response = await apiClient.get<{ success: boolean; data: TeacherDashboard }>(
    "/teacher/dashboard",
  );
  return response.data.data;
};

/**
 * Get analytics for a specific class
 */
export const getClassAnalytics = async (classId: string): Promise<ClassAnalytics> => {
  const response = await apiClient.get<{ success: boolean; data: ClassAnalytics }>(
    `/classes/${classId}/analytics`,
  );
  return response.data.data;
};

/**
 * Get progress for all students in a class
 */
export const getStudentProgress = async (classId: string): Promise<StudentProgress[]> => {
  const response = await apiClient.get<{ success: boolean; data: StudentProgress[] }>(
    `/classes/${classId}/students/progress`,
  );
  return response.data.data;
};

/**
 * Get activity feed for a class
 */
export const getClassActivity = async (classId: string): Promise<ClassActivityItem[]> => {
  const response = await apiClient.get<{ success: boolean; data: ClassActivityItem[] }>(
    `/classes/${classId}/activity`,
  );
  return response.data.data;
};

export default {
  getTeacherDashboard,
  getClassAnalytics,
  getStudentProgress,
  getClassActivity,
};