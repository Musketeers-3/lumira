import {
  getClassAnalytics,
  getStudentProgress,
  getTeacherDashboard,
  getClassActivityFeed,
} from "../services/analyticsService.js";

/**
 * Analytics Controller
 * Handles analytics and reporting endpoints
 */

/**
 * @route GET /api/classes/:id/analytics
 * @desc Get analytics for a specific class
 * @access Private (Teacher only)
 */
export const getClassAnalyticsHandler = async (req, res) => {
  try {
    const { id: classId } = req.params;
    const teacherId = req.user._id;

    const analytics = await getClassAnalytics(classId, teacherId);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("[ANALYTICS ERROR] Get class analytics failed:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch class analytics",
    });
  }
};

/**
 * @route GET /api/classes/:id/students/progress
 * @desc Get progress for all students in a class
 * @access Private (Teacher only)
 */
export const getStudentProgressHandler = async (req, res) => {
  try {
    const { id: classId } = req.params;
    const teacherId = req.user._id;

    const progress = await getStudentProgress(classId, teacherId);

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("[ANALYTICS ERROR] Get student progress failed:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch student progress",
    });
  }
};

/**
 * @route GET /api/teacher/dashboard
 * @desc Get dashboard analytics for teacher
 * @access Private (Teacher only)
 */
export const getTeacherDashboardHandler = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Ensure user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can access dashboard analytics",
      });
    }

    const dashboard = await getTeacherDashboard(teacherId);

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("[ANALYTICS ERROR] Get teacher dashboard failed:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard analytics",
    });
  }
};

/**
 * @route GET /api/classes/:id/activity
 * @desc Get activity feed for a class
 * @access Private (Teacher only)
 */
export const getClassActivityHandler = async (req, res) => {
  try {
    const { id: classId } = req.params;
    const teacherId = req.user._id;

    const activities = await getClassActivityFeed(classId, teacherId);

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("[ANALYTICS ERROR] Get class activity failed:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch class activity",
    });
  }
};

export default {
  getClassAnalyticsHandler,
  getStudentProgressHandler,
  getTeacherDashboardHandler,
  getClassActivityHandler,
};