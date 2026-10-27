# Migration and rollback

The rule behind every decision here: **a learner's record is never silently overwritten or deleted** — not by an upgrade, not by a downgrade, not by corrupt data (§11). The Phase 0 risk register is `docs/audits/MIGRATION_RISKS.md`; this document is the procedure as built.

## What this release changes in storage

**Nothing existing changes key or shape.** Every pre-upgrade key (`bluman_*`, `ml_*`, `py_lab_v1`, `feynman_*`) is read and written exactly as before. The one record whose meaning changed — `ml_mode_prefs_v1`, which held `{ level, lang }` — keeps that shape; the app now always writes `lang: 'en'` and keeps `level` (the beginner/researcher depth), so an older build reading it still works.

New records use new keys, each a **versioned envelope** `{ schemaVersion: 1, ... }`:

| Key | Contents |
|---|---|
| `fi_learning_v1` | evidence log (cap 10 000) and review cards |
| `fi_lessons_v1` | lessons opened, sections seen, completion + checkpoint score, last lesson |
| `fi_notes_v1` | lesson notes |
| `fi_diagnostic_v1` | first-run choice, every diagnostic attempt, placement |
| `fi_pyex_v1` | code-exercise drafts and results |
| `fi_projects_v1` | project step state |
| `fi_resume_v1` | saved study places: the learner's saved place ("Save my place"), the last automatic place, the last place per course (since 2026-10-27; `docs/study-continuity/`) |
| `fi_theme_v1`, `fi_motion_v1`, `fi_nav_v1` | preferences (theme, motion, navigation collapse) |
| `fi_quarantine_v1` | originals of any record that could not be read (see below) |

## Reading a record — `src/lib/versioned.js`

| Found | Result |
|---|---|
| nothing | fresh empty record |
| unparseable, not an object, no integer `schemaVersion` | original **quarantined**, fresh record |
| `schemaVersion` **newer** than this build knows | original **quarantined**, fresh record for this session — a rolled-back build can never destroy data written by a newer one |
| older | migrated one step at a time (`migrations[n]`: v*n* → v*n*+1); a migration that throws is treated as unreadable — quarantined, never half-applied |
| fails validation | quarantined, fresh record |

Quarantine (`fi_quarantine_v1`) keeps the **first** bad original per key with a timestamp; it is included in every backup. The legacy keys use the Phase 1 shape guards (`loadJSON` + quarantine), which fixed all 13 baseline crash cases.

Tests: `src/lib/__tests__/versioned.test.js` (10: missing; corrupt JSON quarantined byte-for-byte; wrong shape; newer-version record kept aside; step-by-step migration; failing migration never half-applied; validation failure; round-trip; evidence cap keeps the latest attempt per item), `e2e/data-safety.spec.js` (legacy fixtures; byte-exact download → wipe → restore).

## Backup, restore, reset — `src/lib/backup.js`

- **Export** (My Progress → Settings → Privacy and your data): every key this app owns, plus the quarantine, as one JSON file, byte-exact.
- **Import**: validated before anything is written; a confirmation step names what will be replaced; writes are rolled back if storage fills mid-way.
- **Reset progress**: needs confirmation; takes a backup first and offers it for download; removes learning records only — **preferences survive** (`PREFERENCE_KEYS`: theme, motion, navigation, depth). Tested in `e2e/v31.spec.js` and `backup.test.js`.

## V4 (simplification) — what changed

- **Addresses.** Every V3.1 page id that moved is mapped by `RENAMED` in `src/app/pages.js` (table in `docs/v4/SIMPLIFICATION_PLAN.md`); `#practice/review` now means the new Review page (it was the formula flashcards, which moved to `#practice/formulas/flashcards`).
- **Learner data.** No key, shape or meaning changes. New evidence records may carry two extra fields, `x` (transfer item) and `h` (hint opened first); older records lack them, and readers treat absence as unknown. A rollback to V3.1 ignores the fields.
- **Removed features with stored data:** none. The XP/badge panel was removed from Progress, but it computed everything from existing records and stored nothing of its own; the journal's entries are untouched (only its streak message went).

## Study continuity (2026-10-27) — what changed

- **One new key, `fi_resume_v1`** (`{ schemaVersion: 1, pinned, current, recent }`), read through `readVersioned` like every `fi_*` record: unreadable or newer-version data is quarantined, never overwritten in place. It is part of every backup, restore and reset automatically (it is in `STORAGE_KEYS`). A backup made before it existed restores fine: the app then simply has no saved place.
- **`fi_lessons_v1` is unchanged in shape.** Its `sections` list (steps seen) existed but was never written; lessons now fill it (a step counts once the learner has stayed on it for 1.5 s). Older builds read it as before.
- **Rollback:** an older build ignores `fi_resume_v1`; rolling forward again finds it intact. Nothing to migrate either way.
- Details: `docs/study-continuity/DATA_SAFETY.md`.

## Old links

Every pre-upgrade URL still lands somewhere sensible (`src/lib/hashRoute.js`): `#stats/<tab>` and `#ml/<tab>` map to the current `#section/page` ids through the `LEGACY` table, and V3.1 ids through `RENAMED` (both in `src/app/pages.js`, unit-tested in `src/app/__tests__/pages.test.js`); the six retired ML tabs land on their new home with a one-line notice; unknown ids explain themselves. Tested by `e2e/legacy-routes.spec.js` (every legacy hash, plus Back-button behaviour) and `routes.test.js`.

## Rolling back a release

1. Each release merges as one PR → one merge commit on `main`; `deploy.yml` publishes `main`.
2. Revert: `git revert -m 1 <merge-sha>`, push to `main` (owner-approved). Pages redeploys the previous build.
3. **Learner data survives a rollback.** Older builds ignore the `fi_*` keys they don't know; the legacy keys were never reshaped. Rolling forward again finds the `fi_*` records intact.
4. **The service worker.** This release installs `sw.js`. After a rollback to a build *without* a service worker, `sw.js` returns 404, the browser's update check fails, and the installed worker keeps running: navigations are network-first (so the old `index.html` loads) and the old build's differently-named assets miss the cache and come from the network — the old app works, but a stale cache lingers. To remove it cleanly, the rollback commit should also ship this file as `public/sw.js`:

   ```js
   // Kill switch: unregister and delete this app's caches.
   self.addEventListener('install', () => self.skipWaiting());
   self.addEventListener('activate', (event) => {
     event.waitUntil((async () => {
       for (const key of await caches.keys()) if (key.startsWith('fi-')) await caches.delete(key);
       await self.registration.unregister();
       for (const client of await self.clients.matchAll()) client.navigate(client.url);
     })());
   });
   ```

5. Rolling back to a build *with* a service worker needs nothing: the older `sw.js` is a byte-different file, so it installs, and its activation deletes the newer build's `fi-app-*` cache.

## Future schema changes

Bump the record's `version`, add `migrations[old]` (pure: old record → new record), add fixtures for every older version to `versioned.test.js`, and never reuse a key for a different shape. Keep the previous build's reader working for at least one release.
