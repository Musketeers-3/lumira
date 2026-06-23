import LearningSession from "../models/LearningSession.js";
import LessonAssignment from "../models/LessonAssignment.js";
import Enrollment from "../models/Enrollment.js";
import Class from "../models/Class.js";
import User from "../models/User.js";

/**
 * Analytics Service
 * Provides learning analytics for teachers
 */

/**
 * Get class analytics
 * @param {string} classId - Class ID
 * @param {string} teacherId - Teacher ID (for authorization)
 */
export async function getClassAnalytics(classId, teacherId) {
  // Verify class belongs to teacher
  const classItem = await Class.findOne({ _id: classId, teacherId });
  if (!classItem) {
    throw new Error("Class not found");
  }

  // Get enrollments
  const enrollments = await Enrollment.find({ classId });
  const enrolledStudents = enrollments.length;

  // Get active students (students with sessions in last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeStudentIds = await LearningSession.distinct("userId", {
    userId: { $in: enrollments.map(e => e.studentId) },
    startedAt: { $gte: sevenDaysAgo },
  });
  const activeStudents = activeStudentIds.length;

  // Get assigned lessons
  const assignments = await LessonAssignment.find({ classId, isActive: true }).populate("lessonId");
  const assignedLessons = assignments.length;

  // Get completed lessons (sessions with completedAt for this class's students)
  const completedSessions = await LearningSession.find({
    userId: { $in: enrollments.map(e => e.studentId) },
    completedAt: { $ne: null },
  });
  const completedLessons = completedSessions.length;

  // Calculate completion rate
  const completionRate = assignedLessons > 0
    ? Math.round((completedLessons / (assignedLessons * enrolledStudents)) * 100)
    : 0;

  // Calculate average mastery score
  const scoreAggregation = await LearningSession.aggregate([
    {
      $match: {
        userId: { $in: enrollments.map(e => e.studentId) },
        performanceScore: { $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        avgMastery: { $avg: "$performanceScore" },
      },
    },
  ]);
  const averageMastery = scoreAggregation[0]?.avgMastery
    ? Math.round(scoreAggregation[0].avgMastery)
    : 0;

  // Calculate total learning time
  const timeAggregation = await LearningSession.aggregate([
    {
      $match: {
        userId: { $in: enrollments.map(e => e.studentId) },
        durationSeconds: { $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        totalTime: { $sum: "$durationSeconds" },
      },
    },
  ]);
  const totalLearningTime = timeAggregation[0]?.totalTime || 0;

  return {
    className: classItem.className,
    enrolledStudents,
    activeStudents,
    assignedLessons,
    completedLessons,
    completionRate,
    averageMastery,
    totalLearningTime,
  };
}

/**
 * Get student progress for a class
 * @param {string} classId - Class ID
 * @param {string} teacherId - Teacher ID
 */
export async function getStudentProgress(classId, teacherId) {
  // Verify class belongs to teacher
  const classItem = await Class.findOne({ _id: classId, teacherId });
  if (!classItem) {
    throw new Error("Class not found");
  }

  // Get enrollments with student details
  const enrollments = await Enrollment.find({ classId }).populate("studentId", "name email");

  // Get assignments for this class
  const assignments = await LessonAssignment.find({ classId, isActive: true });
  const assignedLessonCount = assignments.length;

  // Build progress data for each student
  const progressData = await Promise.all(
    enrollments.map(async (enrollment) => {
      const studentId = enrollment.studentId._id;
      const student = enrollment.studentId;

      // Get all sessions for this student
      const sessions = await LearningSession.find({ userId: studentId });

      const lessonsStarted = sessions.length;
      const completedSessions = sessions.filter(s => s.completedAt);
      const lessonsCompleted = completedSessions.length;

      // Calculate mastery score (average of completed sessions)
      const scores = completedSessions.filter(s => s.performanceScore !== null);
      const masteryScore = scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + s.performanceScore, 0) / scores.length)
        : 0;

      // Calculate total time spent
      const totalTimeSpent = sessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);

      // Get last active date
      const lastActive = sessions.length > 0
        ? sessions.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0].startedAt
        : null;

      return {
        studentId: studentId.toString(),
        name: student.name,
        email: student.email,
        lessonsStarted,
        lessonsCompleted,
        completionPercentage: assignedLessonCount > 0
          ? Math.round((lessonsCompleted / assignedLessonCount) * 100)
          : 0,
        masteryScore,
        totalTimeSpent,
        lastActive,
      };
    })
  );

  return progressData;
}

/**
 * Get teacher dashboard analytics
 * @param {string} teacherId - Teacher ID
 */
export async function getTeacherDashboard(teacherId) {
  // Get all classes for this teacher
  const classes = await Class.find({ teacherId });
  const totalClasses = classes.length;

  // Get all enrollments for teacher's classes
  const classIds = classes.map(c => c._id);
  const enrollments = await Enrollment.find({ classId: { $in: classIds } });
  const totalStudents = enrollments.length;

  // Get active today (students with sessions today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activeTodayIds = await LearningSession.distinct("userId", {
    userId: { $in: enrollments.map(e => e.studentId) },
    startedAt: { $gte: today },
  });
  const activeToday = activeTodayIds.length;

  // Get lessons assigned across all classes
  const assignments = await LessonAssignment.find({
    classId: { $in: classIds },
    isActive: true,
  });
  const lessonsAssigned = assignments.length;

  // Get completed lessons
  const completedSessions = await LearningSession.find({
    userId: { $in: enrollments.map(e => e.studentId) },
    completedAt: { $ne: null },
  });
  const lessonsCompleted = completedSessions.length;

  // Calculate average mastery
  const scoreAggregation = await LearningSession.aggregate([
    {
      $match: {
        userId: { $in: enrollments.map(e => e.studentId) },
        performanceScore: { $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        avgMastery: { $avg: "$performanceScore" },
      },
    },
  ]);
  const averageMastery = scoreAggregation[0]?.avgMastery
    ? Math.round(scoreAggregation[0].avgMastery)
    : 0;

  // Get recent activity
  const recentSessions = await LearningSession.find({
    userId: { $in: enrollments.map(e => e.studentId) },
  })
    .sort({ startedAt: -1 })
    .limit(10)
    .populate("userId", "name");

  const recentActivity = recentSessions.map(session => ({
    id: session._id,
    studentId: session.userId._id,
    studentName: session.userId.name,
    action: session.completedAt ? "lesson_completed" : "lesson_started",
    description: session.completedAt
      ? `Completed ${session.topic} session`
      : `Started ${session.topic} session`,
    timestamp: session.completedAt || session.startedAt,
  }));

  // Also include class join activities
  const recentEnrollments = await Enrollment.find({ classId: { $in: classIds } })
    .sort({ joinedAt: -1 })
    .limit(5)
    .populate("studentId", "name")
    .populate("classId", "className");

  recentEnrollments.forEach(enrollment => {
    recentActivity.push({
      id: enrollment._id,
      studentId: enrollment.studentId._id,
      studentName: enrollment.studentId.name,
      action: "student_joined",
      description: `${enrollment.studentId.name} joined ${enrollment.classId.className}`,
      timestamp: enrollment.joinedAt,
    });
  });

  // Sort by timestamp descending and limit
  recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const limitedActivity = recentActivity.slice(0, 10);

  return {
    totalClasses,
    totalStudents,
    activeToday,
    lessonsAssigned,
    lessonsCompleted,
    averageMastery,
    recentActivity: limitedActivity,
  };
}

/**
 * Get activity feed for a class
 * @param {string} classId - Class ID
 * @param {string} teacherId - Teacher ID
 */
export async function getClassActivityFeed(classId, teacherId) {
  // Verify class belongs to teacher
  const classItem = await Class.findOne({ _id: classId, teacherId });
  if (!classItem) {
    throw new Error("Class not found");
  }

  // Get enrollments
  const enrollments = await Enrollment.find({ classId });
  const studentIds = enrollments.map(e => e.studentId);

  // Get lesson assignments for this class
  const assignments = await LessonAssignment.find({ classId })
    .sort({ assignedAt: -1 })
    .populate("lessonId", "title")
    .populate("teacherId", "name");

  const assignmentActivities = assignments.map(a => ({
    id: a._id,
    type: "lesson_assigned",
    description: `${a.teacherId.name} assigned "${a.lessonId.title}" to the class`,
    timestamp: a.assignedAt,
  }));

  // Get student sessions
  const sessions = await LearningSession.find({ userId: { $in: studentIds } })
    .sort({ startedAt: -1 })
    .limit(50)
    .populate("userId", "name");

  const sessionActivities = sessions.map(s => ({
    id: s._id,
    type: s.completedAt ? "lesson_completed" : "lesson_started",
    description: `${s.userId.name} ${s.completedAt ? "completed" : "started"} ${s.topic}`,
    timestamp: s.completedAt || s.startedAt,
  }));

  // Get recent enrollments
  const recentEnrollments = await Enrollment.find({ classId })
    .sort({ joinedAt: -1 })
    .limit(10)
    .populate("studentId", "name");

  const enrollmentActivities = recentEnrollments.map(e => ({
    id: e._id,
    type: "student_joined",
    description: `${e.studentId.name} joined the class`,
    timestamp: e.joinedAt,
  }));

  // Combine all activities and sort
  const allActivities = [
    ...assignmentActivities,
    ...sessionActivities,
    ...enrollmentActivities,
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return allActivities.slice(0, 20);
}

export default {
  getClassAnalytics,
  getStudentProgress,
  getTeacherDashboard,
  getClassActivityFeed,
};