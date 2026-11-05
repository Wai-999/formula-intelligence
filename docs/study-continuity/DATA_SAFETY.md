# Study continuity — data safety

What the saved-place feature stores, what it never touches, and how it fails. Companion to `docs/MIGRATION_AND_ROLLBACK.md`.

## What is stored

One new key, `fi_resume_v1` (a versioned envelope, `schemaVersion: 1`, see `ARCHITECTURE.md`). It holds at most 8 places of about 120 bytes each, so it stays under 1 KB.

Lessons now also fill the existing `sections` list of `fi_lessons_v1` (steps visited). That list was already in the schema and is only ever appended to.

## What it never touches

Saving, resuming, finishing a session and removing the saved place do **not** write evidence, review cards, checkpoints (`completed`), notes, diagnostic attempts, code drafts or projects. Unit tests check this:

- `src/store/__tests__/studyResume.test.js` — "Remove saved place removes the pin and nothing else"; "saving places never changes mastery"; "Finish study session … does not complete the lesson"
- `src/features/learn/__tests__/studyContinuity.test.jsx` — "My Progress … removing it removes only the bookmark"

## Truthful feedback

- `writeVersioned` returns whether `localStorage.setItem` succeeded. *Saved on this device* appears **only** after a successful write.
- A failed explicit save shows *Couldn’t save to this browser…* (`role="alert"`), and the session summary says *Your place could not be saved in this browser*.
- The place is still kept in memory for the rest of the visit, and a later successful write stores it (`pinDirty`). An automatic save that fails turns the lesson's status to *Couldn’t save to this browser*.

## Untrusted input

Saved places come back from storage and from restored backup files, so they are validated on every read (`sanitizeLocation`, `sanitizeRecord`):

- plain ids of at most 80 characters;
- a known step;
- a finite fraction in [0, 1];
- a plausible time;
- `recent` capped at 6.

Nothing stored is used to build a CSS selector or HTML: lookups are by `id` that the app itself composes from validated ids. There are no analytics; scroll positions never leave the browser.

## Damaged, foreign and future data

| Found in `fi_resume_v1` | Result |
|---|---|
| Unparseable JSON | original quarantined (`fi_quarantine_v1`), no saved place, everything else unaffected |
| `schemaVersion` newer than this build | quarantined, never overwritten in place |
| A place whose lesson no longer exists | kept; Home and My Progress explain it and offer the course, a recent lesson, or **Forget that saved place** — never a blank page or the wrong lesson |
| A place in a lesson that moved to another course | resumed under its new course |

Tested in unit tests and in `e2e/study-continuity.spec.js` › E (damaged and newer-version records, in a real browser).

## Backup, restore, reset

- **Backup** includes `fi_resume_v1` (it is in `STORAGE_KEYS`); restoring brings the saved place back exactly (e2e › E).
- **A backup made before this feature** restores everything it contains. The app then simply has no saved place: Home falls back to the last opened lesson and claims no step (e2e › E).
- **Reset progress** removes `fi_resume_v1` with the other learning records, after the existing confirmation and protective backup. Theme and motion settings survive (unit and e2e tests).

## Storage is local — said where it matters

Home, the lesson's steps panel, the session summary, My Progress and the user guide all state it in plain words:

- places are kept in this browser only, on this device;
- they are not synced;
- a private window may discard them;
- a backup file is the way to move them to another device.

The app never says "synced".
