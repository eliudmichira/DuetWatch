# Chrome Web Store Submission — Duet

Everything you need to fill out the Web Store dashboard. Copy/paste-friendly.

---

## Item details

### Name
Duet — Watch videos together, in sync

### Short summary (132 chars max)
Pause, play, and seek stay in lockstep across two screens. Watch together on any HTML5 video site. Free, fast, and private.

### Detailed description
**Watch movies, episodes, and YouTube together when you can't be in the same room.**

Duet syncs play, pause, and seek between exactly two browsers in real time, so you and one other person can hit play once and stay together for the whole show — no screen sharing, no group calls, no buffering one side ahead of the other.

**How it works**
1. Install Duet on both browsers.
2. One person clicks *Create a room* and shares the 6-character code.
3. The other person types the code in.
4. Both open the same video. Press play. You're in sync.

That's it. No accounts, no logins, no setup beyond installing the extension.

**Features**
- Real-time play, pause, and seek sync
- Drift correction across network latency
- Floating draggable badge with chat + emoji reactions, right on top of the video
- "Sync partner to me" button — snap them to your exact timestamp
- Per-partner display name and avatar
- Works on YouTube, Vimeo, and any site with an HTML5 `<video>` element
- 100% local; uses only the Firebase database you configure

**Privacy**
Duet doesn't collect analytics. It doesn't include any ad SDKs. Sync traffic flows through a single hosted Firebase Realtime Database. Rooms auto-expire after 7 days. Full privacy policy on the GitHub repo.

**Limits**
- Strictly 2 people per room.
- Some DRM-heavy sites (Netflix, Disney+, Prime) fight every extension; sync of play/pause works there but seeking can be flaky. Free YouTube and any site with an unprotected `<video>` works perfectly.

### Category
Entertainment

### Language
English

---

## Permissions justifications

The Web Store review form asks you to justify each permission and the
single-purpose of the extension. Use these answers verbatim.

### Single purpose
> Duet synchronizes play, pause, and seek events for two specific users watching the same video on any HTML5 video page, so they can watch in lockstep across two screens.

### `storage`
> Used to persist the user's Firebase config, display name, current room code, and badge position across browser sessions. No data leaves the user's device from this storage.

### `tabs`
> Used to identify which tab contains the active video player so that sync events from the Firebase realtime database are routed to the correct tab. Used only after the user has created or joined a room.

### `scripting`
> Required by Manifest V3 to inject the sync logic into video pages and to dispatch events to the correct frame within a tab when the player lives in a cross-origin iframe (common on embed-based video sites).

### `webNavigation`
> Required to enumerate frames within the active video tab so that sync messages reach the specific frame containing the `<video>` element. Many video sites embed their player inside a cross-origin iframe; without `webNavigation` the extension cannot route a play/pause message to that frame.

### `host_permissions: <all_urls>`
> Duet works on any website that contains an HTML5 `<video>` element — there is no way to enumerate every such site ahead of time, so the extension needs access to all URLs. It only attaches sync logic when a `<video>` is detected, and it only transmits anything when the user has explicitly created or joined a room.

### `remote code` use
> The extension bundles the Firebase JavaScript SDK locally (under `vendor/`). It does not execute remote code. The only remote endpoint contacted is the developer-managed Firebase Realtime Database used to deliver sync events between the two partners in a room.

### Data collection disclosure
Tick these in the dashboard's "Privacy practices" tab:
- ☑ Personally identifiable information (display name the user chooses)
- ☑ Web history (URL and title of the page the user is watching, transmitted only while inside a room and only to the other partner)
- ☑ User communications (chat messages and reactions typed into Duet, delivered only to the partner)

For each, the disclosure should say:
> Transmitted only while the user is actively inside a sync room, only to a developer-managed Firebase Realtime Database, and only for the purpose of delivering sync events to the user's partner. Not sold, not transferred to any third party, not analyzed or retained by the extension developer. Rooms auto-expire after 7 days of inactivity.

---

## Required assets

- ☐ Icon 128×128 (already in `extension/icons/icon128.png`)
- ☐ At least one screenshot, 1280×800 or 640×400. Suggested shots:
  1. Popup showing Setup view with sample Firebase config pasted
  2. Popup in connected state, with partner card populated
  3. A video page (YouTube) with the floating Duet badge visible in the corner
  4. The badge expanded, showing chat + reactions + sync button
- ☐ Small promo tile 440×280 — same color palette as the popup, simple typographic "Duet — watch together" composition

---

## Privacy policy URL
Host `PRIVACY.md` somewhere public (GitHub Pages on the repo is fine) and put the URL here. Example:
> `https://<your-github-username>.github.io/duet/PRIVACY.html`

---

## Pre-submission checklist

- [ ] Bumped version in `extension/manifest.json` (must be greater than any previously-uploaded version)
- [ ] `DEBUG = false` in both `background.js` and `content.js`
- [ ] No leftover `console.log` calls in non-vendor code
- [ ] `PRIVACY.md` hosted on a real public URL
- [ ] **Deployed `firebase/database.rules.json`** to the production Firebase project (`firebase deploy --only database`)
- [ ] **Deployed `firebase/functions/`** (the daily cleanup function) (`firebase deploy --only functions`)
- [ ] **Locked the Firebase API key** in Cloud Console → Credentials to `chrome-extension://<extension-id>/*` once the listing has a stable ID
- [ ] **Billing alerts set** at 50/75/90/100/200% of $10/month in Cloud Console → Billing → Budgets
- [ ] Tested create → join → play → pause → seek across two browsers / profiles
- [ ] Tested join with an invalid 6-char code (should show a clean error)
- [ ] Tested with network throttled / Firebase blocked (should show "Can't reach Duet's sync server")
- [ ] Zipped only the `extension/` folder for upload, not the repo root
- [ ] Source code published on GitHub if you want the "Open source" badge on the listing

---

## Expected review time

- First-time submission with `<all_urls>` and `webNavigation`: **5–10 business days**, sometimes longer if a reviewer wants clarification.
- Subsequent updates without permission changes: **1–3 business days**.

If rejected, the most common reasons for Duet specifically would be:
- Permission justifications too vague — use the wording above verbatim.
- Privacy policy missing or doesn't match the data the extension actually touches — `PRIVACY.md` already matches.
- Single-purpose unclear — keep the single-purpose statement above as-is.
