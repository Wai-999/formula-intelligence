# Usability test report — scripted learner journeys

**What this is:** six learner personas walked through the app by a script (`scripts/learning-journeys.mjs`) in a real Chromium, once against the live site before the upgrade and once against the upgraded build. Each journey counts deliberate decisions (clicks a learner must choose), records what the primary action leads to and what feedback says, and saves screenshots.

**What this is not:** a usability test with people. There is one scripted run per persona (n = 1), no think-aloud, no timing of real reading, and no measure of learning. Results describe what the interface offers, not what learners do with it.

- Before: `https://wai-999.github.io/formula-intelligence/` (live, `f6d8691`), 2026-11-04 → `evidence/before/journeys.json`, screenshots `evidence/before/*.jpg`
- After: local production build of this branch (`vite preview`, same base path) → `evidence/after/journeys.json`, `evidence/after/*.jpg`

The same script ran both times; it reads lesson ids from the pages it visits, so the builds are compared on equal terms.

## Results

| Persona | Measure | Before (live) | After |
|---|---|---|---|
| P1 Absolute beginner | Decisions to a first lesson | 2 | 2 |
| | Where the first question sits | 3,273 px, 3.6 screens, after 704 words | 3,313 px (the new shortcut adds a 40 px row), **and one click away**: “Try a question now” puts it in view |
| P2 Algebra-ready, wants Calculus I | Decisions to the first Calculus I lesson | 3 | 3 |
| | Course page names unfinished prerequisites without locking | yes | yes |
| P3 Novice C++ (CS-102) | Decisions to a C++ lesson | **no C++ course (dead end)** | **3** (*Loops you can trace*) |
| P4 Returning learner, saved step | Decisions to resume | 1 | 1 |
| | The saved step fills the view | yes | yes |
| P5 Two wrong answers | Feedback after a wrong numeric answer | “Not yet.” (2 words, no link) | 35–45 words: what went wrong, where to look (the first hint), how to see the reasoning, and a 5-minute bridge link |
| | Home afterwards | “Continue recent lesson” (no bridge, no review) | **“A short bridge first”**: *Limits: what a function approaches* — Understand, about 5 min, with “Back to …” as the second choice |
| P6 Finished the 3 written lessons of Calculus I (7 planned) | Course page says the course is not complete | yes | yes, plus the four statuses |
| | Home’s primary action | **“Continue to Calculus II …”** — gap only inside “Why this?” | **“Next lesson not written yet: Power, product and quotient rules”** as the title; primary “Practise Calculus I skills … — Use it” (15 min); “Continue to Calculus II …” one click away |

(P6’s script counts lesson links on the course page to seed “every lesson done”: 3 before, 4 after, because the upgraded page also links the next course’s first lesson. Calculus I has 3 written lessons in both; seeding one extra finished lesson elsewhere does not change the result.)

Across the catalog (source, `scripts/learning-metrics.mjs`): courses whose next step moves on without naming their unwritten lessons — **8 of 8 on `main`, 0 of 15 after**.

## Against the brief’s acceptance criteria

| Criterion | Result | Evidence |
|---|---|---|
| New learner reaches a meaningful first lesson in ≤ 3 deliberate decisions | **Met** (2 for Prealgebra, 3 for Calculus I or C++) | P1–P3 |
| Returning learner resumes the exact saved step in one action | **Met** (before and after) | P4; e2e `study-continuity` |
| Every tested next action resolves to an existing lesson, assessment, project or explicit gap state | **Met** for every lesson and course in the catalog | `nextAction.test.js` “properties” (every lesson fresh and finished, every course; a full walk from an empty record) |
| No catalog dead ends after finishing a lesson or course segment | **Met** | same; e2e `continuous-learning` A–E, `learning-8020` |

## Learning outcomes — not measured

First independent problem success, first transfer success, hint use, time to first practice, recovery after an error and course continuation **were not measured**: they need real learners. The app does not collect analytics, and none was added (the brief requires explicit authorisation).

A privacy-preserving protocol for the owner, using only what the app already stores in the learner’s own browser:

1. Recruit 5–8 learners (e.g. classmates preparing for Ohlone MATH-101A or CS-102), with consent, each on their own device.
2. Give each the same task: “Start where the app suggests; study for 30 minutes; finish the session.” Observe without helping; note where they hesitate.
3. At the end, ask them to open My Progress → Settings → **Export backup** and share the file if they agree. From it: answers on the first attempt (`ok`), hint use (`h`), transfer items (`x`), the lesson of each answer (`l`, new) and timestamps (`at`) give first-attempt success, transfer success, hints and time to first answer, computed offline.
4. Repeat after a week to see retention through the review schedule.
5. Report the sample size and the raw counts; make no efficacy claim from a handful of people.

## Screens

Both themes, desktop 1280 and phone 375, for Home, Courses, a course, a lesson, Practice, Projects, Progress and Settings: `evidence/before/screen-*` and `evidence/after/screen-*` (32 each), plus the journey screenshots `p1-*` … `p6-*`. Observed in the after set: the new hero, feedback, faded example and completion block render in both themes and at 375 px without sideways scrolling (also asserted at 320 px by e2e).
