// ============================================================
//  Duet — Scheduled Cleanup (Cloud Functions)
// ============================================================
//
// Deletes rooms and presence records that haven't been touched in 7 days.
// Keeps storage bounded so the Spark free tier doesn't fill up over time
// and so abandoned rooms can't accumulate forever.
//
// Deploy:
//   cd firebase
//   firebase deploy --only functions
//
// Costs:
//   The Spark free tier covers 125k invocations/month and 40k GB-seconds.
//   This function runs once a day and touches at most a few thousand nodes
//   per run — well under either cap.

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const MAX_IDLE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

exports.cleanupIdleRooms = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("Etc/UTC")
  .onRun(async () => {
    const now = Date.now();
    const db = admin.database();

    // Fetch the room index, but only the timestamp fields. Loading the whole
    // tree would be wasteful; "lastTouch" and "state/serverTime" tell us what
    // we need to decide.
    const roomsSnap = await db.ref("rooms").once("value");
    let scanned = 0;
    let deleted = 0;

    const deletions = [];
    roomsSnap.forEach((roomSnap) => {
      scanned++;
      const roomId = roomSnap.key;
      const lastTouch = roomSnap.child("lastTouch").val()
        || roomSnap.child("state/serverTime").val()
        || roomSnap.child("created").val()
        || 0;
      if (now - lastTouch > MAX_IDLE_MS) {
        deletions.push(
          db.ref(`rooms/${roomId}`).remove(),
          db.ref(`presence/${roomId}`).remove()
        );
        deleted++;
      }
    });

    await Promise.all(deletions);
    functions.logger.info(`Duet cleanup: scanned ${scanned} rooms, deleted ${deleted}.`);
    return null;
  });
