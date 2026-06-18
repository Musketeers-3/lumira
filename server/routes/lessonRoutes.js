import express from "express";
import {
  getLessons,
  getDiscoverLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  publishLesson,
} from "../controllers/lessonController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Lesson Routes
 * /api/lessons
 */

/**
 * @route GET /api/lessons
 * @desc Get all user lesson drafts
 * @access Private
 */
router.get("/", protect, getLessons);

/**
 * @route GET /api/lessons/discover
 * @desc Get published lessons for discovery with user progress
 * @access Private
 */
router.get("/discover", protect, getDiscoverLessons);

/**
 * @route POST /api/lessons
 * @desc Create a new lesson draft
 * @access Private
 */
router.post("/", protect, createLesson);

/**
 * @route PUT /api/lessons/:id
 * @desc Update a lesson draft
 * @access Private
 */
router.put("/:id", protect, updateLesson);

/**
 * @route DELETE /api/lessons/:id
 * @desc Delete a lesson draft
 * @access Private
 */
router.delete("/:id", protect, deleteLesson);

/**
 * @route PUT /api/lessons/:id/publish
 * @desc Publish a lesson draft
 * @access Private
 */
router.put("/:id/publish", protect, publishLesson);

export default router;
