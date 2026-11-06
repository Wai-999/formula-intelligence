# The learner leads — free choice and moving on

## What the owner reported (2026-11-05)

> “I can't learn the lessons that I wanna learn. And even though I finish 2 or 3 courses, it keeps showing me the same courses and not letting me learn the next step. I want to learn any course and any steps I want, and after I have finished one course, it should be able to move to the next level automatically or let me choose manually.”

## What was actually happening

Reproduced on the live code (`main`, `37e23e3`). First with the engine on the real catalog, then in a browser with a learner who had finished the first three courses on the route and answered every checkpoint question correctly:

| Cause | Where | What the learner saw |
|---|---|---|
| After a course's written lessons, the main action was **“Practise ‹this course› skills”** until every skill showed as *proficient*, and one checkpoint rarely shows that | `contentGap` in `src/lib/nextAction.js` (80/20 rule) | Home kept pointing at the course just finished — “Practise Python for Data Science skills” — with the next course as a second button |
| Moving on to a course whose prerequisite was unfinished made a **bridge back** the main action | `fromFinishedCourse` in `src/lib/learningPath.js` | Sent back to an earlier course instead of forward |
| **“Next”** at the end of a course went **back** to an earlier lesson that had been skipped | `withinCourse` | Jumped backwards inside the course |
| Home started from the **furthest course** with a finished lesson, then its **first** unfinished lesson | `anchorCourse` | A course chosen by hand did not stick; earlier gaps kept coming back |
| A lesson counted as finished **only** when its checkpoint was answered | `completeLesson` | Reading a lesson to the end left it unfinished, so Home kept offering it |

Measured on all 15 written courses of the route: with one course's written lessons done, Home's main action held the learner on that course **15 of 15** times on `main`, and **0 of 15** after this change (`coursesThatHoldTheLearnerBack` in `scripts/learning-metrics.mjs`).

## What changed

- **A finished course moves on by itself.** The main action is the next course on the path (“Continue to ‹course›: ‹lesson›”). What the finished course still lacks is named in a **visible notice**, not hidden under “Why this?”, for example: “Not written yet in Python for Data Science: “Functions” and 13 more planned lessons, so the full course is not complete.” Practising the course's skills is offered as another choice.
- **Choose manually, at any point.** Every course-end shows **“Or choose any course yourself — nothing is locked.”** Home follows the learner's latest choice: a starting point they set, or the lesson they finished last, in whatever course that was. The Courses page and every course page are open, as before. “Make this my starting point” still sets the course directly.
- **“Next” only goes forward.** A lesson skipped earlier in a course is offered (“Go back to a lesson you skipped: …”), never imposed.
- **Bridges are offers.** An unfinished prerequisite of the next course appears as the first other choice, with “nothing is locked”. The bridge after repeated wrong answers is unchanged: a one-off 5-minute suggestion, with “Back to …” beside it.
- **“Mark this lesson finished.”** Available in a lesson's last step, and as “Mark it finished and move on” on Home's resume card. A marked lesson counts as finished for moving on. Course pages say “marked finished by you” rather than “checkpoint answered”, and skill levels still come only from answers. Answering the checkpoint later replaces the mark.
- **No backward drag.** A lesson's `completed` time is now its *first* finish (`checkpoint.at` keeps the latest answer), so answering an old checkpoint again never moves Home back.

## What did not change

- No course, lesson or step was ever locked, and none is now.
- Planned lessons are still titles, not lessons: 170 are planned and 37 are written, including the two from PR #10. Free choice cannot make an unwritten lesson learnable. The honest notices say so, and writing lessons remains the work that fixes it (REMAINING_BACKLOG.md).
- Mastery, reviews and the four course statuses are computed exactly as before.

## Tests

- `src/lib/__tests__/nextAction.test.js`, “the learner leads”:
  - finishing course after course, Home always moves on to the next course and never to practice;
  - a marked lesson counts;
  - a skipped lesson is offered, not imposed;
  - an unfinished prerequisite never replaces the next course.
- “Resuming a lesson”: the resumed lesson is never offered a second time as “next”.
- `src/lib/__tests__/learningPath.test.js`:
  - forward-only “next”;
  - answering an old checkpoint again does not drag Home back;
  - finishing a lesson in a chosen course moves Home on from there;
  - a weak prerequisite becomes a bridge alternative.
- `src/store/__tests__/lessonCompletion.test.js`: marking a lesson finished; the first finish is kept; a later checkpoint replaces the mark.
- End-to-end tests `continuous-learning` A, D, E and `learning-8020` were updated to the new flow.

## Verification (2026-11-05, local)

| Check | Result |
|---|---|
| `npm run lint` | PASS — 0 warnings |
| `npm test` | PASS — 598 / 598 in 42 files |
| `npm run validate:content`, `npm run build`, `npm run budget` | PASS — 72.1 KB of 90 KB |
| `npm run a11y`, `a11y:light` | PASS — no WCAG A/AA violations across 78 pages in each theme |
| `npm run e2e` | 307 passed, 1 skipped, **2 failed**, then fixed. `continuous-learning` B still expected the old “Next lesson not written yet” text. `continuous-learning` D caught a real regression: at the path's end, the practice choice pushed “See your whole path” out of the two other choices, so practice is no longer added there. Re-run of `continuous-learning` and `learning-8020`: 29 passed, 1 skipped (case C: there is no outline-only course on the path). |
| Browser, local production build, learner with three courses finished | Home: “Next course on your path — Continue to C++ Programming Fundamentals”, with the Python gap notice, practice offered, and “Or choose any course yourself”. Marking both C++ lessons finished: course page “2 of 2 finished (0 with the checkpoint answered, 2 marked finished by you)”, lessons chipped “Marked finished”, course end “Continue to Algebra II”. Jumping to *Vectors and the dot product* and marking it finished: Home offers *Projection onto a vector*, the learner's chosen course. Home's resume card: “Mark it finished and move on” leads to the next lesson. |
