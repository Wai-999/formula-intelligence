# Baseline audit — before the 80/20 upgrade

Audited 2026-11-04, before any 80/20 code change. Every finding carries one tag:

- **Observed in browser** — a real Chromium loaded the live site and the step was exercised (scripted with Playwright, `scripts/learning-journeys.mjs`, evidence in `evidence/before/`).
- **Confirmed in source** — read in the code or data of `main`, or measured from it with `scripts/learning-metrics.mjs` (`evidence/before/metrics-main.json`).
- **Inference** — a judgment drawn from the two above.
- **Not tested** — not checked; listed so it is not mistaken for a pass.

Source inspection is not a live audit, and a scripted journey is not a usability test with people. Neither is claimed.

## 1. What is live

| Fact | Evidence | Tag |
|---|---|---|
| `main` is at `f6d8691` (PR #7, 2026-10-28). No open pull requests. | `git log origin/main`, `gh pr list` | Confirmed in source |
| The live site was built from `f6d8691`: the last “Deploy to GitHub Pages” run, [40648067467](https://github.com/Wai-999/formula-intelligence/actions/runs/40648067467), succeeded on that SHA and nothing was pushed to `main` since. Live bundle `assets/index-SpsVOSNA.js`. | `gh run view`, `curl` of the live page | Confirmed in source |
| `main` has no branch protection (GitHub API: “Branch not protected”). | `gh api …/branches/main/protection` | Confirmed in source |
| Baseline gates on `main`: the CI run for PR #7 (40646338474) and the deploy run passed lint, unit tests, content and Python checks, build, budget, e2e and axe. On this branch after merging `main` into the V5 work (`c17f789`), before any 80/20 edit: lint clean, 505/505 unit tests, `verify:python` 90/90, `verify:cpp` 20/20, `validate:content` and `validate:college` pass, budget 72.0 KB of 90 KB; e2e 300 passed and 2 failed, both from the merge (one test expected a real outline-only course, which no longer exists, and now skips when that precondition is absent; one used a button the V5 placement check renames) — fixed, and those two specs re-run: 116 passed, 1 skipped (TEST_RESULTS.md §1). | CI logs; local runs | Confirmed in source |

This upgrade ships on top of the unreleased V5 Ohlone work (12 lessons, the C++ track, the Ohlone prep page), which was merged with `main` first. Where a finding differs between live and V5, both are stated.

## 2. Learner journeys on the live site (six personas)

Scripted in Chromium against `https://wai-999.github.io/formula-intelligence/`, fresh browser storage per persona, desktop 1280 × 900. Full records: `evidence/before/journeys.json`.

| Persona | What happened | Measure | Tag |
|---|---|---|---|
| P1 Absolute beginner | Home offers three starting choices; “Start from Prealgebra” → course page → “Start” opens *Ratios, rates and unit rates*. | 2 decisions to a first lesson. The first question sits 3,273 px down (3.6 screens at 900 px), after 704 words. | Observed in browser |
| P2 Algebra-ready, wants Calculus I | “Explore first” → Courses → Calculus I → Start. The course page warns that it builds on unfinished courses and offers a bridge, without locking anything. | 3 decisions. | Observed in browser |
| P3 Novice C++ (Ohlone CS-102) | There is no C++ course in the live catalog. | Dead end: no lesson reachable. | Observed in browser |
| P4 Returning learner with a saved step | Home names the course, unit, lesson and “Step 4 of 6 — Try it”; “Resume where I stopped” opens the lesson at that step. | 1 decision; the step fills the view. | Observed in browser |
| P5 Fails two questions | In *The derivative from first principles*, two wrong numeric answers each get **“Not yet.”** and nothing else (2 words), plus “Show solution”. Home afterwards: “Continue recent lesson” — no bridge, no review. | 0 explanations, 0 links to targeted practice. | Observed in browser |
| P6 Finished the written lessons of Calculus I (3 of 10) | The course page says the full course is not complete. Home’s primary action is **“Continue to Calculus II — Integrals and Series: Area as a limit of Riemann sums”**; the seven unwritten Calculus I lessons are mentioned only inside the collapsed “Why this?”. | Next-course jump with the gap hidden by default. | Observed in browser |

Screens of Home, Courses, a course, a lesson, Practice, Projects, Progress and Settings at 1280 and 375 px, light and dark (32 images): `evidence/before/screen-*.jpg`. Observed in browser: both themes render, the bottom tab bar replaces the sidebar at 375 px, no horizontal scrolling on those pages.

## 3. Findings

### P0 — continuity

| # | Finding | Evidence | Tag |
|---|---|---|---|
| F1 | When a course’s written lessons run out, every course moves the learner on to the next course without naming what is unwritten in the primary action. | P6; on `main` 8 of 8 written courses with planned lessons do this (`coursesThatMoveOnWithoutNamingTheGap`). | Observed in browser · Confirmed in source |
| F2 | The brief’s priority Ohlone areas are not all present live: no C++, data structures or discrete-structures course. | P3; `main` has 11 courses, 23 lessons. | Observed in browser · Confirmed in source |
| F3 | Only 23 of 162 catalog titles are written on `main` (35 of 207 with V5). Most “next” steps a path engine can take run into planned titles. | `metrics-main.json` | Confirmed in source |

### P0 — teaching and feedback

| # | Finding | Evidence | Tag |
|---|---|---|---|
| F4 | A wrong numeric answer without authored feedback gets only “Not yet.” On `main`, 129 of 232 lesson questions are numeric without a wrong-answer explanation; only 72 have a hint. | P5; `metrics-main.json` | Observed in browser · Confirmed in source |
| F5 | Nothing connects a run of wrong answers to the prerequisite behind them. A `remedy` field (a link to a refresher lesson) exists, but only 19 of the 278 questions and readiness checks on `main` set one. | P5 (Home unchanged after errors); `ItemCard.jsx` | Observed in browser · Confirmed in source |
| F6 | The lessons already follow a strong structure (question first, glossary, derivation, two checked worked examples, a non-example, a prediction, scaffolded → independent → transfer practice, an applied task, a checkpoint, an explain-back prompt on 16 lessons). Missing everywhere: a **faded example** (no lesson has one), an **“explain more simply”** version, and **stated outcomes**. | `metrics-main.json` (`lessonsWithFadedExample: 0`); lesson bodies | Confirmed in source |
| F7 | 70.3% of lesson questions are independent or harder; 32.3% are transfer. Healthy mix. | `metrics-main.json` | Confirmed in source |

### P1

| # | Finding | Evidence | Tag |
|---|---|---|---|
| F8 | Applied problems: 16 on `main`, one per first/last lesson of each course; none is linked to the projects, so the “case continues across lessons” idea is not visible. | `appliedProblemsLinkedToProjects: 0` | Confirmed in source |
| F9 | Home and My Progress know different things: Home the next lesson, Progress the skill evidence. Progress does not show a next step or what remains before a course counts as ready. | `ProgressOverviewPage.jsx` | Confirmed in source |
| F10 | Course pages report “written lessons checked” and “exit skills proficient” but not whether the whole course is written, or mastered — the four meanings of “done” are not all visible. | `CoursePage.jsx` | Confirmed in source |
| F11 | The first question is far from the top of a lesson (F-P1: 3.6 screens). The step bar helps, but there is no one-click route to practice. | P1 | Observed in browser |
| F12 | The session summary saves the place and states the checkpoint honestly, but does not say what was practised, what needs review, or what to do next. | `StudySessionPage.jsx` | Confirmed in source |
| F13 | Labs: each lesson’s “See it” lab has an intro, a text alternative and a prediction card before practice; I did not audit every lab’s follow-up question. | Lesson bodies | Confirmed in source (partial) |

### What works and is kept

Exact-step resume (P4: one decision), honest course-end wording on course pages, no locking, the placement check’s “not enough evidence” outcome (V5), evidence-based mastery that ignores time spent, the spaced review that never punishes missed days, local-only storage with backup, both themes and the phone layout. **Observed in browser** for resume, themes and layout; **confirmed in source** for the rest.

## 4. Not tested at baseline

- Screen readers (VoiceOver, NVDA) — only automated axe checks exist.
- Real learners: no person used the site for this audit. Time-to-first-practice, hint use and recovery after errors are **not measured** on people.
- Offline return and two open tabs on the live site (they are covered by the repository’s e2e suite against a local build).
- Every lab’s interaction quality (F13).
- Search: the scripted count of results for “C++” (40) counted generic list items and is not a valid measure; it is not used.
