import LessonDraft from '../models/LessonDraft.js';

/**
 * Lesson Controller
 * Handles lesson draft endpoints
 */

/**
 * @route GET /api/lessons
 * @desc Get all user lesson drafts
 * @access Private
 */
export const getLessons = async (req, res, next) => {
  try {
    const lessons = await LessonDraft.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/lessons
 * @desc Create a new lesson draft
 * @access Private
 */
export const createLesson = async (req, res, next) => {
  try {
    const {
      title,
      description,
      topic,
      targetSkills,
      difficulty,
      steps,
      estimatedDuration
    } = req.body;

    const lesson = await LessonDraft.create({
      userId: req.user._id,
      title: title || 'Untitled Lesson',
      description: description || '',
      topic: topic || '',
      targetSkills: targetSkills || [],
      difficulty: difficulty || 'beginner',
      steps: steps || [],
      estimatedDuration: estimatedDuration || 15,
      isPublished: false
    });

    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/lessons/:id
 * @desc Update a lesson draft
 * @access Private
 */
export const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove _id and userId from update to prevent tampering
    delete updateData._id;
    delete updateData.userId;
    delete updateData.createdAt;

    const lesson = await LessonDraft.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/lessons/:id
 * @desc Delete a lesson draft
 * @access Private
 */
export const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await LessonDraft.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      message: 'Lesson deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/lessons/:id/publish
 * @desc Publish a lesson draft
 * @access Private
 */
export const publishLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await LessonDraft.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: { isPublished: true } },
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  publishLesson
};