import mongoose from "mongoose";

/**
 * Session Message Model
 * Stores messages exchanged during a learning session
 */

const sessionMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningSession",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mentorState: {
      type: String,
      default: "IDLE",
    },
    messageText: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      enum: ["user", "mentor"],
      required: true,
    },
    messageType: {
      type: String,
      default: "text",
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient queries
sessionMessageSchema.index({ sessionId: 1, createdAt: 1 });

const SessionMessage = mongoose.model("SessionMessage", sessionMessageSchema);

export default SessionMessage;
