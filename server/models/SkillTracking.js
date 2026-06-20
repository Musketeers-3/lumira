import mongoose from "mongoose";

/**
 * Skill Tracking Model
 * Tracks user's skills and mastery levels
 */

const skillTrackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    skillName: {
      type: String,
      required: true,
    },
    skillCategory: {
      type: String,
      default: "General",
    },
    proficiencyLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    masteryScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastPracticed: {
      type: Date,
      default: Date.now,
    },
    timesPracticed: {
      type: Number,
      default: 1,
    },
    unlockedAt: {
      type: Date,
      default: null,
    },
    insight: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["unlocked", "in-progress", "locked"],
      default: "locked",
    },
    rarity: {
      type: String,
      enum: ["common", "rare", "legendary"],
      default: "common",
    },
  },
  {
    timestamps: true,
  },
);

// Compound unique index for user-skill combination
skillTrackingSchema.index({ userId: 1, skillName: 1 }, { unique: true });
skillTrackingSchema.index({ userId: 1, status: 1 });

const SkillTracking = mongoose.model("SkillTracking", skillTrackingSchema);

export default SkillTracking;
