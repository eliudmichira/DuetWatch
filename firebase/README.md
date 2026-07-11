# Duet — Firebase backend

This folder holds the Realtime Database rules and the scheduled cleanup
function that runs on the developer-managed Firebase project.

## Deploying

```bash
cd firebase
npm install --prefix functions
firebase deploy --only database,functions --project pausepal-a4d71
```

## Files

- `database.rules.json` — RTDB security rules. Includes:
  - Read/write require a 6-character room code (no enumeration).
  - 75ms write floor per room (rate-limit per partner pair).
  - Hard caps on every string field (URL ≤ 1024, title ≤ 256, etc.).
  - Numeric ranges on `currentTime`/`duration` (rejects garbage seek targets).
  - `$other: false` on every schema branch (rejects unknown fields).
- `functions/index.js` — Scheduled function. Runs daily, deletes rooms idle
  for 7+ days plus their corresponding presence records.
- `firebase.json` — Project config glue.

## Operational notes

- Billing alerts: set in Google Cloud Console → Billing → Budgets & alerts.
  Thresholds at 50/75/90/100/200% of $10/mo.
- API key restriction: Cloud Console → APIs & Services → Credentials →
  restrict to `chrome-extension://<extension-id>/*` once the extension has
  a stable Web Store ID.
- Spark tier limits: 100 concurrent connections (~50 active pairs globally),
  10 GB/month egress, 1 GB stored. Cleanup function keeps storage bounded.
- If usage spikes: upgrade to Blaze, tighten the write-floor in
  `database.rules.json` from 75ms to 250ms, redeploy rules only.
