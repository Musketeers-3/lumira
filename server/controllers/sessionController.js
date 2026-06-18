import LearningSession from '../models/LearningSession.js';
import SessionMessage from '../models/SessionMessage.js';

/**
 * Session Controller
 * Handles learning session endpoints
 */

/**
 * @route POST /api/sessions
 * @desc Create a new learning session
 * @access Private
 */
export const createSession = async (req, res, next) => {
  try {
    const { lessonId, topic } = req.body;

    if (!lessonId || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide lessonId and topic'
      });
    }

    const session = await LearningSession.create({
      userId: req.user._id,
      lessonId,
      topic,
      startedAt: new Date()
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/sessions/:id
 * @desc Update a learning session
 * @access Private
 */
export const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stateProgression, messagesCount, performanceScore, breakthrough } = req.body;

    let session = await LearningSession.findOne({ _id: id, userId: req.user._id });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Update fields
    if (stateProgression) session.stateProgression = stateProgression;
    if (messagesCount !== undefined) session.messagesCount = messagesCount;
    if (performanceScore !== undefined) session.performanceScore = performanceScore;
    if (breakthrough !== undefined) session.breakthrough = breakthrough;

    await session.save();

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/sessions/:id/complete
 * @desc Complete a learning session
 * @access Private
 */
export const completeSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { durationSeconds, performanceScore } = req.body;

    const session = await LearningSession.findOne({ _id: id, userId: req.user._id });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    session.completedAt = new Date();
    session.durationSeconds = durationSeconds;
    session.performanceScore = performanceScore;

    await session.save();

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/sessions
 * @desc Get all user sessions
 * @access Private
 */
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await LearningSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/sessions/recent
 * @desc Get recent sessions
 * @access Private
 */
export const getRecentSessions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const sessions = await LearningSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/sessions/:id/messages
 * @desc Save a session message
 * @access Private
 */
export const saveMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mentorState, messageText, sender, messageType } = req.body;

    // Verify session belongs to user
    const session = await LearningSession.findOne({ _id: id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const message = await SessionMessage.create({
      sessionId: id,
      userId: req.user._id,
      mentorState: mentorState || 'IDLE',
      messageText,
      sender,
      messageType: messageType || 'text'
    });

    // Update session message count
    session.messagesCount = (session.messagesCount || 0) + 1;
    await session.save();

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/sessions/:id/messages
 * @desc Get session messages
 * @access Private
 */
export const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify session belongs to user
    const session = await LearningSession.findOne({ _id: id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const messages = await SessionMessage.find({ sessionId: id })
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/sessions/:id
 * @desc Delete a learning session
 * @access Private
 */
export const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify session belongs to user and delete
    const session = await LearningSession.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Also delete all messages for this session
    await SessionMessage.deleteMany({ sessionId: id });

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createSession,
  updateSession,
  completeSession,
  getSessions,
  getRecentSessions,
  saveMessage,
  getMessages,
  deleteSession
};