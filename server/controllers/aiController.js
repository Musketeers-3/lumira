import SkillTracking from '../models/SkillTracking.js';
import {
  generateSocraticResponse,
  evaluateUnderstanding,
  generateBreakthroughMessage
} from '../services/aiService.js';

/**
 * AI Controller
 * Handles AI-powered endpoints
 * All Ollama calls go through this controller
 */

/**
 * @route POST /api/ai/socratic
 * @desc Generate Socratic response
 * @access Private
 */
export const socraticResponse = async (req, res, next) => {
  try {
    const { studentAnswer, context, realm } = req.body;

    if (!studentAnswer || !context) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentAnswer and context'
      });
    }

    // Fetch user's skill history for context
    const skillsList = await SkillTracking.find({
      userId: req.user._id,
      status: 'unlocked'
    }).limit(10);

    const result = await generateSocraticResponse(
      studentAnswer,
      context,
      realm || 'hub',
      skillsList
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    // Return fallback response on AI error
    console.error('[AI Controller] Socratic response error:', error.message);
    res.json({
      success: true,
      data: {
        mentor_response: "That's an exceptional line of thought. Let's look at the parameters we have right before us. What changes if we review our assumptions?",
        question_type: 'gentle_push',
        estimated_state: 'FOCUS'
      }
    });
  }
};

/**
 * @route POST /api/ai/evaluate
 * @desc Evaluate student understanding
 * @access Private
 */
export const evaluateStudent = async (req, res, next) => {
  try {
    const { studentAnswer, learningObjective } = req.body;

    if (!studentAnswer || !learningObjective) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentAnswer and learningObjective'
      });
    }

    const result = await evaluateUnderstanding(studentAnswer, learningObjective);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    // Return fallback on AI error
    console.error('[AI Controller] Evaluate error:', error.message);
    res.json({
      success: true,
      data: {
        demonstrates_understanding: false,
        confidence: 0.5,
        gaps: ['Evaluation system error'],
        strengths: []
      }
    });
  }
};

/**
 * @route POST /api/ai/breakthrough
 * @desc Generate breakthrough celebration message
 * @access Private
 */
export const breakthroughCelebration = async (req, res, next) => {
  try {
    const { insight, context } = req.body;

    if (!insight || !context) {
      return res.status(400).json({
        success: false,
        message: 'Please provide insight and context'
      });
    }

    const message = await generateBreakthroughMessage(insight, context);

    res.json({
      success: true,
      data: { message }
    });
  } catch (error) {
    // Return fallback on AI error
    console.error('[AI Controller] Breakthrough error:', error.message);
    res.json({
      success: true,
      data: {
        message: `You just independently discovered something profound: ${req.body.insight}. This insight changes how you see the problem.`
      }
    });
  }
};

export default {
  socraticResponse,
  evaluateStudent,
  breakthroughCelebration
};