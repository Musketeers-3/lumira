import express from "express";
import { getTeacherDashboardHandler } from "../controllers/analyticsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Teacher Routes
 * /api/teacher
 * All routes require authentication and teacher role
 */

/**
 * @route GET /api/teacher/dashboard
 * @desc Get dashboard analytics for teacher
 * @access Private (Teacher only)
 */
router.get("/dashboard", protect, getTeacherDashboardHandler);

export default router;