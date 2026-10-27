# Study continuity — architecture

Save my place, automatic checkpoints, exact resume, and a course journey that ends honestly. Browser-local, like the rest of the app: no account, no server, no sync.

## Files

| File | Role |
|---|---|
| `src/lib/studyResume.js` | Pure logic: the six step ids, validating a saved place, merging, precedence (`primaryTarget`, `courseTarget`), labels |
| `src/lib/courseJourney.js` | Pure logic: a course's three separate signals and unit states; the next course after the last written lesson |
| `src/store/useStudyResumeStore.js` | The `fi_resume_v1` record: automatic and explicit saves, removing the saved place, one-time resume requests, the finished-session summary, cross-tab sync |
| `src/features/learn/LessonPage.jsx` | Saves the place; restores it on request; Save my place, Finish study session, steps panel with the visited trail, resume offer, end-of-lesson actions |
| `src/features/home/HomePage.jsx` | One Resume action for returning learners |
| `src/features/learn/CoursePage.jsx` | Where you are in this course; three signals; end of available lessons |
| `src/features/progress/StudyJourney.jsx` | My Progress → Overview: saved place, recent courses, Remove saved place |
| `src/features/learn/StudySessionPage.jsx` | `#learn/session`, where Finish study session lands |

No new top-level destination: the session page sits under Learn (hidden from navigation and search), and everything else extends existing pages.

## Choice of storage: a new key (design B)

Two candidates were considered:

- **A — new fields in `fi_lessons_v1`.** One record, but places are written every few seconds of reading while completion is written once per lesson, and every write rewrites the whole record. A problem in the frequent path (a bug, a quota error) would then put the rare and valuable data — which checkpoints were answered — at risk. It would also need a schema migration of a record that every learner has.
- **B — a new key, `fi_resume_v1`.** Chosen. It needs no migration, so old data stays untouched, and its failures are isolated. Backup, restore and reset include it automatically because it is in `STORAGE_KEYS`. `lastLesson` stays where it is, as the "recently opened" fallback.

Only one design is used; nothing is stored twice.

## The record

```js
{
  schemaVersion: 1,
  pinned:  Place | null,   // "Save my place": replaced only by another explicit save, or removed
  current: Place | null,   // last automatic place, any course
  recent:  Place[],        // last automatic place per course, newest first, at most 6
}
Place = { courseId, lessonId, sectionId, fraction, at, source: 'manual' | 'auto' }
```

- `sectionId` is one of `matters | understand | see | try | use | check` — the lesson's own section ids, the stable part of a place.
- `fraction` (0–1, two decimals) is how far into that step the reader was. It is a refinement on top of the step, never a pixel offset. Restoring clamps it so the step stays the current one.
- No content anchors are stored: lesson items do not persist half-typed answers, so restoring to "the unfinished question" would promise something the app cannot keep.

**Validation** (`sanitizeLocation`, on every read and before every write): ids are plain ids of at most 80 characters, so nothing stored can become a selector or HTML. The step must be known; an unknown step degrades to "this lesson, no step". The fraction must be finite, otherwise it becomes 0. Times before 2024 are rejected, and times more than a day in the future are clamped to now. `recent` is deduplicated, sorted and capped. A **save** must also name a written lesson in its own course and one of the six steps, or it is refused. A **stored** place whose lesson has since disappeared is kept and explained, not hidden.

## Precedence — one function per question

| Question | Function | Order |
|---|---|---|
| Where does Home (and My Progress) send the learner? | `primaryTarget` | saved place → (saved place's lesson is gone: explain, offer the next best) → last automatic place → last opened lesson, with no step claimed |
| Where does a course page resume? | `courseTarget` | saved place, if it is in this course → this course's last automatic place → the old first-unfinished-lesson start |

A saved place outranks anything opened since. A place in another course never takes over a course page. A merely recent lesson whose checkpoint is done is not offered as "where you stopped": Home recommends what comes next. A saved place is always offered; if its lesson is finished, Home offers it alongside "Next lesson".

## When places are saved

| Event | What happens |
|---|---|
| The learner stays on a step for 1.5 s (`AUTOSAVE_MS`), or moves a fifth of the way through it | automatic save, plus the step is marked visited |
| Next, the steps panel, the table of contents | automatic save of the target step at once |
| Leaving the lesson, hiding the tab (`visibilitychange`), `pagehide` | the pending automatic save is written at once |
| Save my place / Finish study session | explicit save (the pin), written at once |

- **Landing is not studying.** Opening a lesson puts the learner at the top, and nothing is saved until they scroll, jump or resume. Otherwise opening a lesson from its course page would overwrite a deeper place in it with Step 1 before they could choose to resume it. A step read for 1.5 s still counts as visited.
- Writes are skipped when the place has not changed, so there is never a write per scroll event (unit-tested).
- `beforeunload` is not used: phones kill pages without it.

## Resume without races

`requestResume(place)` stores a one-time request `{ lessonId, sectionId, fraction, token }` and navigates through the existing store (`useUIStore.goTo`), so the URL, Back and keep-alive behave as for any navigation.

The lesson page restores only when four things hold: its content has loaded, it is the page on screen, the request is for this lesson, and the request's token has not been used. It then:

1. scrolls instantly, with no long smooth scroll, to the step plus the clamped fraction;
2. marks the step current;
3. focuses the step's heading without scrolling;
4. hands the token back.

Late layout, such as a lab loading above the step, is corrected at 250, 700 and 1500 ms, unless the learner has started scrolling, clicking, touching or typing. Strict-mode double effects and kept-alive pages cannot replay a request.

A normal visit never restores anything. It starts at the top and, if this lesson has a deeper place, offers **Resume from Step N**. The offer is captured when the learner arrives, never inserted while they read.

Jumps (Next, the steps list, the table of contents) check where they landed at 0.9 and 1.8 s, and settle on the step if a smooth scroll was cut short and the learner has not taken over.

Save feedback and the steps panel hang below the sticky bar as overlays. Nothing changes the bar's height, so nothing moves the text being read.

## Two tabs

- Every write re-reads `fi_resume_v1` and merges (`mergeForWrite`): an **automatic** save keeps the **stored** pin, so a stale tab can neither undo a newer "Save my place" nor bring back a removed one.
- Automatic places merge by time.
- A `storage` event listener updates every open tab, so Home, course pages and lesson bars agree without a reload.
- Limits: this is one browser profile on one device. There is no merging of two devices, and there are no simultaneous-editing guarantees beyond "the explicit pin wins".

## What completion means

These are reported separately, never as one percentage:

| Signal | Source | Wording |
|---|---|---|
| Where the learner stopped | `fi_resume_v1` | "Step 3 of 6 — See it" |
| Steps visited | `fi_lessons_v1.sections` | "Visited", which says nothing about understanding |
| Written lessons checked | `fi_lessons_v1.completed` (checkpoint answered) of the course's **written** lessons | "4 of 12 checked (checkpoint answered)"; with none written, "No written lessons available yet" |
| Course content | catalog: written vs planned titles | "Partly written — 2 written, 8 planned" |
| Skills | `assessAll(evidence)` for the course's exit skills, counting only proficient or mastered | "2 of 6 exit skills proficient or mastered", or "Not assessed yet" |

When every written lesson is checked, the course page says **"You finished the available lessons in this course"**. It adds that the full course is not complete while planned titles remain, says there is no course-wide challenge yet (pointing to mixed review in Practice), names the next written lesson of a course that builds on this one, and states that this is a self-study app, not a grade, transcript or credential. Planned titles stay unclickable "Not written yet" rows.

Finishing a session, saving a place or visiting every step never marks a lesson complete. Only the checkpoint does, as before.
