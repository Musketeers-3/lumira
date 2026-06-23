import Class from "../models/Class.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

/**
 * Class Controller
 * Handles class-related operations
 */

/**
 * Generate a unique 6-character class code
 */
function generateClassCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * @route POST /api/classes/create
 * @desc Create a new class
 * @access Private (Teacher only)
 */
export const createClass = async (req, res) => {
  try {
    const { className, description } = req.body;

    // Validate required fields
    if (!className || !className.trim()) {
      return res.status(400).json({
        success: false,
        message: "Class name is required",
      });
    }

    // Ensure user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can create classes",
      });
    }

    // Generate unique class code
    let classCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      classCode = generateClassCode();
      const existing = await Class.findOne({ classCode });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: "Unable to generate unique class code. Please try again.",
      });
    }

    // Create the class
    const newClass = await Class.create({
      className: className.trim(),
      classCode,
      description: description?.trim(),
      teacherId: req.user._id,
      studentCount: 0,
    });

    res.status(201).json({
      success: true,
      data: newClass,
    });
  } catch (error) {
    console.error("[CLASS ERROR] Create class failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create class",
      error: error.message,
    });
  }
};

/**
 * @route GET /api/classes/my-classes
 * @desc Get all classes for the current teacher
 * @access Private (Teacher only)
 */
export const getMyClasses = async (req, res) => {
  try {
    // Ensure user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can view classes",
      });
    }

    const classes = await Class.find({ teacherId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error("[CLASS ERROR] Get my classes failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
      error: error.message,
    });
  }
};

/**
 * @route GET /api/classes/:id
 * @desc Get a single class by ID
 * @access Private (Teacher only)
 */
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    const classItem = await Class.findOne({
      _id: id,
      teacherId: req.user._id,
    });

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      data: classItem,
    });
  } catch (error) {
    console.error("[CLASS ERROR] Get class by ID failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch class",
      error: error.message,
    });
  }
};

/**
 * @route PUT /api/classes/:id
 * @desc Update a class
 * @access Private (Teacher only)
 */
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { className, description } = req.body;

    const classItem = await Class.findOne({
      _id: id,
      teacherId: req.user._id,
    });

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Update fields
    if (className !== undefined) {
      classItem.className = className.trim();
    }
    if (description !== undefined) {
      classItem.description = description.trim();
    }

    await classItem.save();

    res.status(200).json({
      success: true,
      data: classItem,
    });
  } catch (error) {
    console.error("[CLASS ERROR] Update class failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update class",
      error: error.message,
    });
  }
};

/**
 * @route DELETE /api/classes/:id
 * @desc Delete a class
 * @access Private (Teacher only)
 */
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classItem = await Class.findOneAndDelete({
      _id: id,
      teacherId: req.user._id,
    });

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("[CLASS ERROR] Delete class failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete class",
      error: error.message,
    });
  }
};

/**
 * @route POST /api/classes/join
 * @desc Join a class using class code
 * @access Private (Student only)
 */
export const joinClass = async (req, res) => {
  try {
    const { classCode } = req.body;

    // Validate class code
    if (!classCode || !classCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Class code is required",
      });
    }

    // Ensure user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can join classes",
      });
    }

    // Find class by code (case-insensitive)
    const classItem = await Class.findOne({
      classCode: classCode.trim().toUpperCase(),
    });

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Invalid class code. Please check and try again.",
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user._id,
      classId: classItem._id,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this class",
      });
    }

    // Create enrollment
    await Enrollment.create({
      studentId: req.user._id,
      classId: classItem._id,
    });

    // Increment student count
    classItem.studentCount += 1;
    await classItem.save();

    // Get teacher name
    const teacher = await User.findById(classItem.teacherId);

    res.status(201).json({
      success: true,
      data: {
        className: classItem.className,
        classCode: classItem.classCode,
        teacherName: teacher?.name || "Teacher",
      },
    });
  } catch (error) {
    console.error("[CLASS ERROR] Join class failed:", error.message);

    // Handle duplicate enrollment error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this class",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to join class",
      error: error.message,
    });
  }
};

/**
 * @route GET /api/classes/enrolled
 * @desc Get all classes the current student is enrolled in
 * @access Private (Student only)
 */
export const getEnrolledClasses = async (req, res) => {
  try {
    // Ensure user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view enrolled classes",
      });
    }

    const enrollments = await Enrollment.find({ studentId: req.user._id }).populate({
      path: "classId",
      populate: { path: "teacherId", select: "name" },
    });

    const classes = enrollments.map((enrollment) => ({
      _id: enrollment.classId._id,
      className: enrollment.classId.className,
      classCode: enrollment.classId.classCode,
      description: enrollment.classId.description,
      teacherName: enrollment.classId.teacherId?.name || "Teacher",
      studentCount: enrollment.classId.studentCount,
      joinedAt: enrollment.joinedAt,
    }));

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error("[CLASS ERROR] Get enrolled classes failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled classes",
      error: error.message,
    });
  }
};

/**
 * @route GET /api/classes/:id/students
 * @desc Get enrolled students for a class
 * @access Private (Teacher only)
 */
export const getClassStudents = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify class belongs to teacher
    const classItem = await Class.findOne({
      _id: id,
      teacherId: req.user._id,
    });

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const enrollments = await Enrollment.find({ classId: id }).populate({
      path: "studentId",
      select: "name email avatar createdAt",
    });

    const students = enrollments.map((enrollment) => ({
      _id: enrollment._id,
      studentId: enrollment.studentId._id,
      name: enrollment.studentId.name,
      email: enrollment.studentId.email,
      avatar: enrollment.studentId.avatar,
      joinedAt: enrollment.joinedAt,
    }));

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("[CLASS ERROR] Get class students failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch class students",
      error: error.message,
    });
  }
};

export default {
  createClass,
  getMyClasses,
  getClassById,
  updateClass,
  deleteClass,
  joinClass,
  getEnrolledClasses,
  getClassStudents,
};
