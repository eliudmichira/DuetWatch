// ============================================================
//  Duet — Firebase reference (NOT loaded by the extension)
//
//  The published extension uses a single hosted Firebase project; config
//  lives in extension/background.js. Developers maintain rules and cleanup
//  under repo root firebase/ — see firebase/README.md and deploy from there.
//
//  For a local fork / staging project, copy the web firebaseConfig from
//  Firebase Console into background.js, then deploy database.rules.json and
//  functions from firebase/.
// ============================================================

// Reference shape (matches Firebase Console → Project settings → Web app).
const FIREBASE_CONFIG_SHAPE = {
  apiKey:            "AIza…",
  authDomain:        "your-project.firebaseapp.com",
  databaseURL:       "https://your-project-default-rtdb.firebaseio.com",
  projectId:         "your-project",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef"
};

// Source-of-truth RTDB rules (deploy via Firebase CLI): firebase/database.rules.json
