import Class from "../models/Class.js";
import LessonDraft from "../models/LessonDraft.js";
import LessonAssignment from "../models/LessonAssignment.js";

/**
 * Lesson Assignment Controller
 * Handles lesson assignment endpoints
 */

/**
 * @route POST /api/classes/:classId/lessons
 * @desc Assign a lesson to a class
 * @access Private (Teacher only - class owner)
 */
export const assignLesson = async (req, res) => {
  try {
    const { classId } = req.params;
    const { lessonId, dueDate } = req.body;

    // Validate required fields
    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: "Lesson ID is required",
      });
    }

    // Verify user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can assign lessons",
      });
    }

    // Verify class exists and belongs to teacher
    const classItem = await Class.findOne({
      _id: classId,
      teacherId: req.user._id,
    });

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found or you don't have permission",
      });
    }

    // Verify lesson exists and is published
    const lesson = await LessonDraft.findOne({
      _id: lessonId,
      isPublished: true,
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found or not published",
      });
    }

    // Check if assignment already exists
    const existingAssignment = await LessonAssignment.findOne({
      lessonId,
      classId,
      isActive: true,
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: "This lesson is already assigned to this class",
      });
    }

    // Create the assignment
    const assignment = await LessonAssignment.create({
      lessonId,
      classId,
      teacherId: req.user._id,
      dueDate: dueDate || null,
      isActive: true,
    });

    // Populate lesson details for response
    await assignment.populate("lessonId", "title description topic realm difficulty");

    res.status(201).json({
      success: true,
      data: {
        _id: assignment._id,
        lessonId: assignment.lessonId._id,
        lessonTitle: assignment.lessonId.title,
        lessonDescription: assignment.lessonId.description,
        lessonTopic: assignment.lessonId.topic,
        lessonRealm: assignment.lessonId.realm,
        lessonDifficulty: assignment.lessonId.difficulty,
        classId: assignment.classId,
        assignedAt: assignment.assignedAt,
        dueDate: assignment.dueDate,
        isActive: assignment.isActive,
      },
    });
  } catch (error) {
    console.error("[ASSIGNMENT ERROR] Assign lesson failed:", error.message);

    // Handle duplicate assignment error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This lesson is already assigned to this class",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to assign lesson",
      error: error.message,
    });
  }
};

/**
 * @route GET /api/classes/:classId/lessons
 * @desc Get lessons assigned to a class
 * @access Private (Teacher owner OR enrolled student)
 */
export const getClassLessons = async (req, res) => {
  try {
    const { classId } = req.params;

    // Get class info
    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Check access: teacher must own the class, student must be enrolled
    let hasAccess = false;

    if (req.user.role === "teacher") {
      // Teacher can only see their own classes
      if (classItem.teacherId.toString() === req.user._id.toString()) {
        hasAccess = true;
      }
    } else if (req.user.role === "student") {
      // Students need to be enrolled
      const Enrollment = (await import("../models/Enrollment.js")).default;
      const enrollment = await Enrollment.findOne({
        studentId: req.user._id,
        classId,
      });
      if (enrollment) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this class",
      });
    }

    // Get active assignments with lesson details
    const assignments = await LessonAssignment.find({
      classId,
      isActive: true,
    })
      .populate({
        path: "lessonId",
        select: "title description topic realm difficulty estimatedDuration isPublished",
      })
      .sort({ assignedAt: -1 });

    // Format response
    const lessons = assignments.map((assignment) => ({
      _id: assignment._id,
      lessonId: assignment.lessonId._id,
      title: assignment.lessonId.title,
      description: assignment.lessonId.description,
      topic: assignment.lessonId.topic,
      realm: assignment.lessonId.realm,
      difficulty: assignment.lessonId.difficulty,
      estimatedDuration: assignment.lessonId.estimatedDuration,
      isPublished: assignment.lessonId.isPublished,
      assignedAt: assignment.assignedAt,
      dueDate: assignment.dueDate,
      isActive: assignment.isActive,
    }));

    res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    console.error("[ASSIGNMENT ERROR] Get class lessons failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch class lessons",
      error: error.message,
    });
  }
};

/**
 * @route DELETE /api/classes/:classId/lessons/:lessonId
 * @desc Remove lesson assignment from a class
 * @access Private (Teacher only - class owner)
 */
export const removeAssignment = async (req, res) => {
  try {
    const { classId, lessonId } = req.params;

    // Verify user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can remove assignments",
      });
    }

    // Verify class belongs to teacher
    const classItem = await Class.findOne({
      _id: classId,
      teacherId: req.user._id,
    });

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found or you don't have permission",
      });
    }

    // Find and deactivate assignment
    const assignment = await LessonAssignment.findOneAndUpdate(
      {
        lessonId,
        classId,
        teacherId: req.user._id,
        isActive: true,
      },
      { $set: { isActive: false } },
      { new: true },
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lesson removed from class",
    });
  } catch (error) {
    console.error("[ASSIGNMENT ERROR] Remove assignment failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to remove assignment",
      error: error.message,
    });
  }
};

export default {
  assignLesson,
  getClassLessons,
  removeAssignment,
};