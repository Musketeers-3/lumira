/**
 * MongoDB Session Cleanup Script
 *
 * Cleans up duplicate journal sessions based on:
 * - Same topic, realmName (lessonId), userId
 * - Keeps sessions with valid score (>0) OR messages (>0)
 * - If multiple valid, keeps the oldest
 * - Deletes: empty scores, 0 messages, duplicate launches
 *
 * Usage: mongosh cleanup-duplicate-sessions.js
 * Or: node cleanup-duplicate-sessions.js (if using node)
 */

// Run the cleanup
db = db.getSiblingDB("lumira");

const TARGET_USER_ID = ObjectId("6a31731785dca4a5539f65bc"); // test@test.com
// Or process all users: null
const SPECIFIC_USER = null; // Set to ObjectId("...") to target specific user

print("=".repeat(60));
print("SESSION CLEANUP SCRIPT");
print("=".repeat(60));

// ============================================================
// STEP 1: Count before
// ============================================================
const userFilter = SPECIFIC_USER ? { userId: SPECIFIC_USER } : {};
const totalBefore = db.learningSessions.countDocuments(userFilter);
print(`\n📊 Total sessions BEFORE cleanup: ${totalBefore}`);

// ============================================================
// STEP 2: Find potential duplicates (same topic + lessonId)
// ============================================================
const duplicates = db.learningSessions.aggregate([
  { $match: userFilter },
  {
    $group: {
      _id: { topic: "$topic", lessonId: "$lessonId", userId: "$userId" },
      count: { $sum: 1 },
      sessions: {
        $push: {
          _id: "$_id",
          performanceScore: "$performanceScore",
          messagesCount: "$messagesCount",
          createdAt: "$createdAt",
          startedAt: "$startedAt",
        },
      },
    },
  },
  { $match: { count: { $gt: 1 } } },
]);

const duplicateGroups = duplicates.toArray();
print(`\n🔍 Found ${duplicateGroups.length} groups with duplicate topics`);

// ============================================================
// STEP 3: Process each duplicate group
// ============================================================
let toDelete = [];
let kept = [];

for (const group of duplicateGroups) {
  const sessions = group.sessions;

  // Sort by priority:
  // 1. Has score (>0) OR messages (>0) = keep
  // 2. Among valid ones, keep oldest
  // 3. Others = mark for deletion

  const validSessions = sessions.filter(
    (s) =>
      (s.performanceScore && s.performanceScore > 0) || (s.messagesCount && s.messagesCount > 0),
  );

  const invalidSessions = sessions.filter(
    (s) =>
      (!s.performanceScore || s.performanceScore === 0) &&
      (!s.messagesCount || s.messagesCount === 0),
  );

  if (validSessions.length > 0) {
    // Sort by createdAt ascending (oldest first)
    validSessions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    // Keep the first (oldest valid)
    kept.push(validSessions[0]._id);
    // Mark rest for deletion if more than one valid
    for (let i = 1; i < validSessions.length; i++) {
      toDelete.push(validSessions[i]._id);
    }
  }

  // Add all invalid sessions to delete
  toDelete.push(...invalidSessions.map((s) => s._id));

  print(`\n  Topic: ${group._id.topic}`);
  print(`    Valid: ${validSessions.length}, Invalid: ${invalidSessions.length}`);
  print(`    Keeping: ${kept[kept.length - 1]}`);
  if (invalidSessions.length > 0) {
    print(`    Will delete: ${invalidSessions.map((s) => s._id).join(", ")}`);
  }
}

// ============================================================
// STEP 4: Also find sessions with NO score and NO messages (regardless of duplicates)
// ============================================================
const emptySessions = db.learningSessions
  .find({
    ...userFilter,
    $or: [{ performanceScore: { $in: [null, 0] } }, { messagesCount: { $in: [null, 0] } }],
  })
  .toArray();

print(`\n📋 Found ${emptySessions.length} sessions with no score or messages`);

for (const session of emptySessions) {
  print(
    `  - ${session.topic}: score=${session.performanceScore}, messages=${session.messagesCount}`,
  );
  // Only delete if there's no data at all (truly empty)
  if (
    (!session.performanceScore || session.performanceScore === 0) &&
    (!session.messagesCount || session.messagesCount === 0)
  ) {
    toDelete.push(session._id);
  }
}

// ============================================================
// STEP 5: Remove duplicates from delete list (keep unique)
// ============================================================
toDelete = [...new Set(toDelete.map((id) => id.toString()))].map((id) => ObjectId(id));

print(`\n🗑️  Sessions to DELETE: ${toDelete.length}`);
toDelete.forEach((id) => print(`  - ${id}`));

// ============================================================
// STEP 6: Execute deletion (DRY RUN - just show what would happen)
// ============================================================
print(`\n⚠️  DRY RUN - No deletions performed yet.`);
print(`   To execute, uncomment the deleteMany() line below.`);

// Uncomment to actually delete:
// db.learningSessions.deleteMany({ _id: { $in: toDelete } });

// ============================================================
// STEP 7: Count after (simulated)
// ============================================================
const totalAfter = totalBefore - toDelete.length;
print(`\n📊 Summary:`);
print(`   Before: ${totalBefore}`);
print(`   Deleted: ${toDelete.length}`);
print(`   Remaining: ${totalAfter}`);
print(`   Kept valid sessions: ${kept.length}`);

print("\n" + "=".repeat(60));
print("SCRIPT COMPLETE");
print("=".repeat(60));

// Return data for verification
print("\n📋 Return Data:");
print("  totalBefore: " + totalBefore);
print(
  "  toDelete: " +
    toDelete.map(function (id) {
      return id.toString();
    }),
);
print(
  "  kept: " +
    kept.map(function (id) {
      return id.toString();
    }),
);
print("  totalAfter: " + totalAfter);
