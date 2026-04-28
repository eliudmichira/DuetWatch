// ============================================================
//  Duet — Firebase Setup Reference (NOT loaded by the extension)
//
//  HOW TO SET UP:
//  1. Go to https://console.firebase.google.com/
//  2. Create a new project (e.g. "duet").
//  3. Project Settings → General → Your Apps → Add Web App.
//     Copy the firebaseConfig object Firebase gives you.
//  4. Build → Realtime Database → Create Database
//     - Pick a region near you
//     - Start in "locked mode" (we'll paste rules below).
//  5. In the Rules tab, paste the JSON in the comment block at the
//     bottom of this file, then Publish.
//  6. Open the Duet popup → ⚙ Config → paste the values from
//     step 3 → Save & Connect.
// ============================================================

// Reference shape (the popup stores values via chrome.storage.local;
// you don't edit this file directly).
const FIREBASE_CONFIG_SHAPE = {
  apiKey:            "AIza…",
  authDomain:        "your-project.firebaseapp.com",
  databaseURL:       "https://your-project-default-rtdb.firebaseio.com",
  projectId:         "your-project",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef"
};

// ============================================================
//  Realtime Database Rules — paste into Firebase Console
//  (Build → Realtime Database → Rules → Publish)
//
//  Notes on safety:
//  - Codes are 6 chars from a 32-char alphabet (~10⁹ space) so
//    direct enumeration is impractical for a personal project.
//  - Listing the top-level /rooms or /presence is forbidden;
//    you can only read a room you know the code of.
//  - Rooms auto-expire 24h after creation (validated on write).
//  - For real production use, add Firebase Auth + UID-scoped writes.
// ============================================================
//
//  {
//    "rules": {
//      "rooms": {
//        ".read": false,
//        ".write": false,
//        "$roomId": {
//          ".read": "$roomId.length === 6",
//          ".write": "$roomId.length === 6",
//          ".validate": "newData.hasChildren(['state'])",
//          "created": { ".validate": "newData.isNumber()" },
//          "host":    { ".validate": "newData.isString()" },
//          "state": {
//            ".validate": "newData.hasChildren(['action','currentTime','updatedBy'])",
//            "action":       { ".validate": "newData.isString() && (newData.val() === 'play' || newData.val() === 'pause')" },
//            "currentTime":  { ".validate": "newData.isNumber()" },
//            "playbackRate": { ".validate": "newData.isNumber()" },
//            "updatedBy":    { ".validate": "newData.isString()" },
//            "serverTime":   { ".validate": "newData.isNumber()" },
//            "force":        { ".validate": "newData.isBoolean()" },
//            "$other":       { ".validate": false }
//          }
//        }
//      },
//      "presence": {
//        ".read": false,
//        ".write": false,
//        "$roomId": {
//          ".read": "$roomId.length === 6",
//          ".write": "$roomId.length === 6",
//          "$userId": {
//            ".validate": "newData.hasChild('joined') || newData.val() === null"
//          }
//        }
//      }
//    }
//  }
//
// ============================================================
