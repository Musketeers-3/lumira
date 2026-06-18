import mongoose from "mongoose";

/**
 * Lesson Draft Model
 * Stores user-created lesson drafts
 */

const stepSchema = new mongoose.Schema(
  {
    id: String,
    type: {
      type: String,
      enum: ["question", "challenge", "reflection", "discovery"],
      default: "question",
    },
    prompt: String,
    hint: String,
    expectedAnswer: String,
  },
  { _id: false },
);

const lessonDraftSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: "Untitled Lesson",
    },
    description: {
      type: String,
      default: "",
    },
    topic: {
      type: String,
      default: "",
    },
    realm: {
      type: String,
      enum: ["physics", "chemistry", "biology", "math", "history"],
      default: "physics",
    },
    targetSkills: [
      {
        type: String,
      },
    ],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    steps: [stepSchema],
    estimatedDuration: {
      type: Number,
      default: 15, // minutes
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for user's lessons
lessonDraftSchema.index({ userId: 1, createdAt: -1 });

const LessonDraft = mongoose.model("LessonDraft", lessonDraftSchema);

export default LessonDraft;
