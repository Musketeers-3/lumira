import LessonDraft from "../models/LessonDraft.js";
import LearningSession from "../models/LearningSession.js";

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
    const lessons = await LessonDraft.find({ userId: req.user._id }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/lessons/discover
 * @desc Get published lessons for discovery with user progress
 * @access Private
 */
export const getDiscoverLessons = async (req, res, next) => {
  try {
    const { realm, difficulty, search, sort } = req.query;

    // Build query for published lessons
    const query = { isPublished: true };
    if (realm) query.realm = realm;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort option
    let sortOption = { createdAt: -1 }; // newest default
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "title") sortOption = { title: 1 };

    const lessons = await LessonDraft.find(query).sort(sortOption).limit(50);

    // Get user's sessions for these lessons to determine progress
    const lessonIds = lessons.map((l) => l._id);
    const sessions = await LearningSession.find({
      userId: req.user._id,
      lessonId: { $in: lessonIds },
    });

    // Create a map of lessonId -> session
    const sessionMap = {};
    sessions.forEach((session) => {
      sessionMap[session.lessonId] = session;
    });

    // Combine lesson data with progress
    const lessonsWithProgress = lessons.map((lesson) => {
      const session = sessionMap[lesson._id.toString()];
      let status = "not_started";
      let progress = 0;

      if (session) {
        if (session.completedAt) {
          status = "completed";
          progress = 100;
        } else {
          status = "in_progress";
          // Calculate progress based on messages or state progression
          const msgProgress = Math.min(100, Math.round(((session.messagesCount || 0) / 5) * 100));
          const stateProgress = session.stateProgression?.length
            ? Math.min(100, Math.round((session.stateProgression.length / 5) * 100))
            : 0;
          progress = Math.max(msgProgress, stateProgress, 10);
        }
      }

      return {
        _id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        topic: lesson.topic,
        realm: lesson.realm,
        difficulty: lesson.difficulty,
        estimatedDuration: lesson.estimatedDuration,
        isPublished: lesson.isPublished,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        status,
        progress,
        sessionId: session?._id,
      };
    });

    // Sort by progress (in_progress first) for "recommended" sort
    if (sort === "progress") {
      lessonsWithProgress.sort((a, b) => {
        if (a.status === "in_progress" && b.status !== "in_progress") return -1;
        if (b.status === "in_progress" && a.status !== "in_progress") return 1;
        if (a.status === "not_started" && b.status === "completed") return -1;
        if (b.status === "not_started" && a.status === "completed") return 1;
        return 0;
      });
    }

    res.json({
      success: true,
      data: lessonsWithProgress,
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
    const { title, description, topic, realm, targetSkills, difficulty, steps, estimatedDuration } =
      req.body;

    const lesson = await LessonDraft.create({
      userId: req.user._id,
      title: title || "Untitled Lesson",
      description: description || "",
      topic: topic || "",
      realm: realm || "physics",
      targetSkills: targetSkills || [],
      difficulty: difficulty || "beginner",
      steps: steps || [],
      estimatedDuration: estimatedDuration || 15,
      isPublished: false,
    });

    res.status(201).json({
      success: true,
      data: lesson,
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
      { new: true, runValidators: true },
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.json({
      success: true,
      data: lesson,
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
      userId: req.user._id,
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.json({
      success: true,
      message: "Lesson deleted",
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
      { new: true },
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getLessons,
  getDiscoverLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  publishLesson,
};
