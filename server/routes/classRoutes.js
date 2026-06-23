import express from "express";
import {
  createClass,
  getMyClasses,
  getClassById,
  updateClass,
  deleteClass,
  joinClass,
  getEnrolledClasses,
  getClassStudents,
} from "../controllers/classController.js";
import {
  assignLesson,
  getClassLessons,
  removeAssignment,
} from "../controllers/lessonAssignmentController.js";
import {
  getClassAnalyticsHandler,
  getStudentProgressHandler,
  getClassActivityHandler,
} from "../controllers/analyticsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Class Routes
 * /api/classes
 * All routes require authentication
 */

// Apply auth middleware to all routes
router.use(protect);

/**
 * @route POST /api/classes/join
 * @desc Join a class using class code
 * @access Private (Student)
 */
router.post("/join", joinClass);

/**
 * @route GET /api/classes/enrolled
 * @desc Get all classes the current student is enrolled in
 * @access Private (Student)
 */
router.get("/enrolled", getEnrolledClasses);

/**
 * @route POST /api/classes/create
 * @desc Create a new class
 * @access Private (Teacher)
 */
router.post("/create", createClass);

/**
 * @route GET /api/classes/my-classes
 * @desc Get all classes for the current teacher
 * @access Private (Teacher)
 */
router.get("/my-classes", getMyClasses);

/**
 * Analytics Routes
 * NOTE: These MUST be defined BEFORE the /:id route to avoid conflicts
 * /api/classes/:id/analytics, /api/classes/:id/students/progress, /api/classes/:id/activity
 */

/**
 * @route GET /api/classes/:id/analytics
 * @desc Get analytics for a specific class
 * @access Private (Teacher only)
 */
router.get("/:id/analytics", protect, getClassAnalyticsHandler);

/**
 * @route GET /api/classes/:id/students/progress
 * @desc Get progress for all students in a class
 * @access Private (Teacher only)
 */
router.get("/:id/students/progress", protect, getStudentProgressHandler);

/**
 * @route GET /api/classes/:id/activity
 * @desc Get activity feed for a class
 * @access Private (Teacher only)
 */
router.get("/:id/activity", protect, getClassActivityHandler);

/**
 * Lesson Assignment Routes
 * NOTE: These MUST be defined BEFORE the /:id route to avoid conflicts
 * /api/classes/:classId/lessons
 */

/**
 * @route POST /api/classes/:classId/lessons
 * @desc Assign a lesson to a class
 * @access Private (Teacher only)
 */
router.post("/:classId/lessons", protect, assignLesson);

/**
 * @route GET /api/classes/:classId/lessons
 * @desc Get lessons assigned to a class
 * @access Private (Teacher owner OR enrolled student)
 */
router.get("/:classId/lessons", protect, getClassLessons);

/**
 * @route DELETE /api/classes/:classId/lessons/:lessonId
 * @desc Remove lesson assignment from a class
 * @access Private (Teacher only)
 */
router.delete("/:classId/lessons/:lessonId", protect, removeAssignment);

/**
 * @route GET /api/classes/:id
 * @desc Get a single class by ID
 * @access Private (Teacher)
 */
router.get("/:id", getClassById);

/**
 * @route GET /api/classes/:id/students
 * @desc Get enrolled students for a class
 * @access Private (Teacher)
 */
router.get("/:id/students", getClassStudents);

/**
 * @route PUT /api/classes/:id
 * @desc Update a class
 * @access Private (Teacher)
 */
router.put("/:id", updateClass);

/**
 * @route DELETE /api/classes/:id
 * @desc Delete a class
 * @access Private (Teacher)
 */
router.delete("/:id", deleteClass);

export default router;
