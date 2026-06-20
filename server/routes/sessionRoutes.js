import express from "express";
import {
  createSession,
  updateSession,
  completeSession,
  getSessions,
  getRecentSessions,
  saveMessage,
  getMessages,
  deleteSession,
} from "../controllers/sessionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Session Routes
 * /api/sessions
 */

/**
 * @route POST /api/sessions
 * @desc Create a new learning session
 * @access Private
 */
router.post("/", protect, createSession);

/**
 * @route PUT /api/sessions/:id
 * @desc Update a learning session
 * @access Private
 */
router.put("/:id", protect, updateSession);

/**
 * @route PUT /api/sessions/:id/complete
 * @desc Complete a learning session
 * @access Private
 */
router.put("/:id/complete", protect, completeSession);

/**
 * @route DELETE /api/sessions/:id
 * @desc Delete a learning session
 * @access Private
 */
router.delete("/:id", protect, deleteSession);

/**
 * @route GET /api/sessions
 * @desc Get all user sessions
 * @access Private
 */
router.get("/", protect, getSessions);

/**
 * @route GET /api/sessions/recent
 * @desc Get recent sessions
 * @access Private
 */
router.get("/recent", protect, getRecentSessions);

/**
 * @route POST /api/sessions/:id/messages
 * @desc Save a session message
 * @access Private
 */
router.post("/:id/messages", protect, saveMessage);

/**
 * @route GET /api/sessions/:id/messages
 * @desc Get session messages
 * @access Private
 */
router.get("/:id/messages", protect, getMessages);

export default router;
