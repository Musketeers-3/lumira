/**
 * Session Cleanup Script
 *
 * This script cleans up invalid/empty sessions from the database.
 *
 * Criteria for deletion:
 * - messageCount === 0 or null
 * - durationSeconds === 0, null, or undefined
 * - performanceScore === 0, null, or undefined
 * - No messages in the conversation
 *
 * Run with: node scripts/cleanup-sessions.js
 */

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lumira";

// Define schemas
const SessionMessageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningSession" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mentorState: String,
  messageText: String,
  sender: String,
  messageType: String,
  createdAt: { type: Date, default: Date.now },
});

const LearningSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessonId: String,
  topic: String,
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  durationSeconds: Number,
  performanceScore: Number,
  stateProgression: [String],
  messagesCount: { type: Number, default: 0 },
  breakthrough: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const SessionMessage = mongoose.model("SessionMessage", SessionMessageSchema);
const LearningSession = mongoose.model("LearningSession", LearningSessionSchema);

async function cleanupSessions() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully\n");

    // Find all sessions
    const allSessions = await LearningSession.find({});
    console.log(`Total sessions in database: ${allSessions.length}\n`);

    const sessionsToDelete = [];
    const validSessions = [];

    for (const session of allSessions) {
      // Get message count from actual messages
      const messageCount = await SessionMessage.countDocuments({ sessionId: session._id });

      // Determine if session is valid
      const hasMessages = messageCount > 0;
      const hasDuration = session.durationSeconds && session.durationSeconds > 0;
      const hasScore = session.performanceScore && session.performanceScore > 0;
      const hasMeaningfulActivity = hasMessages || hasDuration;

      if (!hasMeaningfulActivity) {
        sessionsToDelete.push({
          _id: session._id,
          topic: session.topic,
          lessonId: session.lessonId,
          startedAt: session.startedAt,
          messageCount,
          durationSeconds: session.durationSeconds,
          performanceScore: session.performanceScore,
          reason: "No meaningful activity",
        });
      } else {
        validSessions.push({
          _id: session._id,
          topic: session.topic,
          messageCount,
          durationSeconds: session.durationSeconds,
          performanceScore: session.performanceScore,
        });
      }
    }

    console.log("=== SESSIONS TO DELETE (Invalid/Empty) ===\n");
    console.log(`Count: ${sessionsToDelete.length}\n`);

    for (const session of sessionsToDelete) {
      console.log(`  ID: ${session._id}`);
      console.log(`    Topic: ${session.topic}`);
      console.log(`    Lesson: ${session.lessonId}`);
      console.log(`    Started: ${session.startedAt}`);
      console.log(`    Messages: ${session.messageCount}`);
      console.log(`    Duration: ${session.durationSeconds}s`);
      console.log(`    Score: ${session.performanceScore}%`);
      console.log(`    Reason: ${session.reason}`);
      console.log("");
    }

    console.log("\n=== VALID SESSIONS ===\n");
    console.log(`Count: ${validSessions.length}\n`);

    for (const session of validSessions) {
      console.log(`  ID: ${session._id}`);
      console.log(`    Topic: ${session.topic}`);
      console.log(`    Messages: ${session.messageCount}`);
      console.log(`    Duration: ${session.durationSeconds}s`);
      console.log(`    Score: ${session.performanceScore}%`);
      console.log("");
    }

    // Ask for confirmation
    console.log("========================================");
    console.log(`Will delete ${sessionsToDelete.length} invalid sessions`);
    console.log(`Will keep ${validSessions.length} valid sessions`);
    console.log("========================================\n");

    // Delete invalid sessions
    if (sessionsToDelete.length > 0) {
      const idsToDelete = sessionsToDelete.map((s) => s._id);

      // Delete messages first
      await SessionMessage.deleteMany({ sessionId: { $in: idsToDelete } });
      console.log("Deleted messages for invalid sessions");

      // Delete sessions
      const deleteResult = await LearningSession.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`Deleted ${deleteResult.deletedCount} invalid sessions`);
    }

    console.log("\n✅ Cleanup complete!");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  }
}

cleanupSessions();
