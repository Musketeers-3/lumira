import express from 'express';
import { socraticResponse, evaluateStudent, breakthroughCelebration } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * AI Routes
 * /api/ai
 * All Ollama/AI calls go through these routes
 * Frontend never calls Ollama directly
 */

/**
 * @route POST /api/ai/socratic
 * @desc Generate Socratic response
 * @access Private
 */
router.post('/socratic', protect, socraticResponse);

/**
 * @route POST /api/ai/evaluate
 * @desc Evaluate student understanding
 * @access Private
 */
router.post('/evaluate', protect, evaluateStudent);

/**
 * @route POST /api/ai/breakthrough
 * @desc Generate breakthrough celebration message
 * @access Private
 */
router.post('/breakthrough', protect, breakthroughCelebration);

export default router;