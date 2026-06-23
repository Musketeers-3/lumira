import mongoose from "mongoose";

/**
 * Class Model
 * Stores class information for teachers
 */

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
      maxlength: [100, "Class name cannot exceed 100 characters"],
    },
    classCode: {
      type: String,
      required: [true, "Class code is required"],
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Teacher ID is required"],
      ref: "User",
    },
    studentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Generate unique class code before saving
 */
classSchema.pre("save", async function (next) {
  if (!this.classCode) {
    this.classCode = generateClassCode();
  }
  next();
});

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
 * Transform output
 */
classSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj._id = obj._id.toString();
  return obj;
};

const Class = mongoose.model("Class", classSchema);

export default Class;
