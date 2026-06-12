import mongoose from 'mongoose';

/**
 * Learning Session Model
 * Tracks user's learning sessions/lessons
 */

const learningSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  lessonId: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  durationSeconds: {
    type: Number,
    default: null
  },
  performanceScore: {
    type: Number,
    default: null,
    min: 0,
    max: 100
  },
  stateProgression: [{
    type: String
  }],
  messagesCount: {
    type: Number,
    default: 0
  },
  breakthrough: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for user's sessions
learningSessionSchema.index({ userId: 1, createdAt: -1 });

const LearningSession = mongoose.model('LearningSession', learningSessionSchema);

export default LearningSession;