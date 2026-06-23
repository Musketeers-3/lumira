import mongoose from "mongoose";

/**
 * Enrollment Model
 * Links students to classes
 */

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Student ID is required"],
      ref: "User",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Class ID is required"],
      ref: "Class",
    },
  },
  {
    timestamps: { createdAt: "joinedAt", updatedAt: false },
  },
);

/**
 * Compound unique index to prevent duplicate enrollments
 */
enrollmentSchema.index({ studentId: 1, classId: 1 }, { unique: true });

/**
 * Indexes for efficient queries
 */
enrollmentSchema.index({ studentId: 1 });
enrollmentSchema.index({ classId: 1 });

/**
 * Transform output
 */
enrollmentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj._id = obj._id.toString();
  obj.studentId = obj.studentId.toString();
  obj.classId = obj.classId.toString();
  return obj;
};

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
