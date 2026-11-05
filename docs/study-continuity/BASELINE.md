# Study continuity — baseline (before this change)

Measured on 2026-10-27 against `main@93e8dd1` (the release live on GitHub Pages that day), built locally and driven in headless Chromium 153 with Playwright, because the measuring sandbox cannot reach `wai-999.github.io`. Script: an empty browser profile, then the steps below. Screenshots: `screenshots/before-*.jpg`.

## What a learner experienced

| # | Step | Result |
|---|---|---|
| 1 | Open *Slope as rate of change*, jump to Step 4 (Try it) | "Step 4 of 6 · Try it". The sticky bar offers only **Next: Use it**; there is no save control anywhere (`before-1-lesson-step4.jpg`) |
| 2 | Go to Home | "Continue where you left off — Slope as rate of change … **Continue the lesson**". No step is mentioned (`before-2-home.jpg`) |
| 3 | Continue, in the same visit | Step 4 — only because the page was still mounted in memory (keep-alive) |
| 4 | Reload the lesson | **Step 1**. The place is gone |
| 5 | Close the browser, reopen, Home → Continue | **Step 1** (`before-3-after-reopen.jpg`) |
| 6 | Glance at a Linear Algebra lesson, back to Home | Home now continues **Vectors and the dot product**: the most recently opened lesson always wins |
| 7 | Open the Algebra I course page | Primary action **"Start: Break-even…"**, although the learner was working in *Slope*: the course page always offers its first unfinished lesson (`before-4-course.jpg`) |
| 8 | Look for "Save" or "Resume" on the course page | None |

What was stored: `fi_lessons_v1 = { lessons: { "a1-slope": { opened, visited, sections: [] } }, last: "a1-slope" }`. `sections` was in the schema but **no code ever wrote it**, so "visited steps" did not exist either.

## Why (code, at `93e8dd1`)

| Area | Behaviour | Consequence |
|---|---|---|
| `useLearningStore.openLesson()` | sets `lastLesson` on every open | recency, not a chosen place; any glance overwrites it |
| `useLearningStore.markSection()` | defined, never called | no visited trail |
| `LessonPage` | knows the current step (scroll tracker) but never stores it | the step dies with the page |
| `HomePage` | `lastLesson` unless completed, else first unfinished lesson | no step, no protection for a chosen place |
| `CoursePage` | `firstOpen` = first unfinished authored lesson | ignores where the learner actually is |
| Course completion | "N of M written lessons completed" | correct as far as it goes; no end-of-available-content state, no next step |

## State ownership, before and after

| Fact | Before | After |
|---|---|---|
| Lesson opened / last opened | `fi_lessons_v1.lessons[id].opened`, `.last` | unchanged; `last` is now only a fallback for learners with no saved place |
| Steps visited | `fi_lessons_v1.lessons[id].sections` (never written) | written by the lesson page (same field, same shape) |
| Lesson checkpoint answered ("completed") | `fi_lessons_v1.lessons[id].completed`, `.checkpoint` | unchanged; nothing new writes it |
| Skill mastery | `fi_learning_v1` evidence → `src/lib/mastery.js` | unchanged; nothing new reads places into it |
| Chosen place ("Save my place") | — | `fi_resume_v1.pinned` |
| Last automatic place | — | `fi_resume_v1.current` |
| Last place per course | — | `fi_resume_v1.recent` (one per course, newest first, at most 6) |

## Baseline gates

`main@93e8dd1` passed every gate in CI before this work started: PR CI run 40455306764 and Deploy run 19 (lint, content validation, unit tests, build, budget 71.6 KB, `verify:python`, axe in both themes, e2e, Python e2e). Locally, one pre-existing timing-dependent e2e failure was known: usability task (c) failed about 1 run in 6 under CPU load (`docs/UPGRADE_PROGRESS.md`). Its cause was found during this work (`TEST_REPORT.md`).
