import mongoose from "mongoose";

/**
 * Lesson Assignment Model
 * Links published lessons to classes for teacher-assigned learning
 */

const lessonAssignmentSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Lesson ID is required"],
      ref: "LessonDraft",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Class ID is required"],
      ref: "Class",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Teacher ID is required"],
      ref: "User",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "assignedAt", updatedAt: false },
  },
);

/**
 * Compound unique index to prevent duplicate assignments
 * Same lesson cannot be assigned to the same class twice
 */
lessonAssignmentSchema.index({ lessonId: 1, classId: 1 }, { unique: true });

/**
 * Indexes for efficient queries
 */
lessonAssignmentSchema.index({ classId: 1, teacherId: 1 });
lessonAssignmentSchema.index({ classId: 1, isActive: 1 });

/**
 * Transform output
 */
lessonAssignmentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj._id = obj._id.toString();
  obj.lessonId = obj.lessonId.toString();
  obj.classId = obj.classId.toString();
  obj.teacherId = obj.teacherId.toString();
  return obj;
};

const LessonAssignment = mongoose.model("LessonAssignment", lessonAssignmentSchema);

export default LessonAssignment;