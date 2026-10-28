# Continuous learning pathways — work log

From the owner's brief *Formula Intelligence — Continuous Learning Pathways, Applied Mastery, and Autonomous Deployment* (2026-10-28): every course and lesson should have a coherent next step, a learner should resume exactly where they stopped, and mathematics should be learned through realistic problems. This file is the durable record: audit evidence, decisions, files, tests, content limits and the release.

Branch `claude/trusting-keller-8e48nd`, from `main` at `713a587` (study continuity, PR #6, already merged — integrated with, not duplicated).

## 1. Audit — the continuity failure, reproduced

**Method.** The live site could not be reached from the work environment: its network policy refuses `wai-999.github.io`. The failure was therefore reproduced on a local production build (`npm run build`, `vite preview`) with Playwright. For each written course, a script seeded "every written lesson of this course checked" and recorded what the last lesson of each unit, the last lesson of the course, the course page and Home offered. The script is `scripts/learning-path-map.mjs`'s predecessor and is summarized here.

**Toolchain.** Node 22.22.0, npm 10.9.4, Vite 8.1.5, Vitest 3.2.7, Playwright 1.62.0 with Chromium 153 (headless shell), Python 3.13 with NumPy 2.5, Matplotlib 3.11, pandas 3.0.

### Curriculum continuity audit (catalog at `713a587`)

| # | Course | Prerequisites | Written lessons | Planned titles | State |
|---|---|---|---|---|---|
| 1 | Prealgebra | — | 2 | 13 | partial |
| 2 | Algebra I | Prealgebra | 4 | 13 | partial |
| 3 | Python for Data Science | — | 0 | 15 | outline |
| 4 | Algebra II | Algebra I | 0 | 14 | outline |
| 5 | Probability & Statistics | Algebra I | 2 | 14 | partial |
| 6 | Geometry, Trigonometry & Precalculus | Algebra II | 0 | 12 | outline |
| 7 | Linear Algebra | Algebra I | 6 | 19 | partial |
| 8 | Calculus I | Precalculus | 2 | 8 | partial |
| 9 | Calculus II | Calculus I | 2 | 8 | partial |
| 10 | Machine Learning & Data Science | Probability & Statistics, Linear Algebra | 3 | 14 | partial |
| 11 | Calculus III | Calculus II, Linear Algebra | 2 | 9 | partial |

(Order: the route chosen in §2; the catalog lists the courses in a different order.) 23 written lessons, 139 planned titles; no dangling lesson, course or concept reference (the existing suite already checked those).

### What the app offered (before)

| Situation | Before | Defect |
|---|---|---|
| **Home after finishing** Algebra I, Linear Algebra, Probability & Statistics, Calculus I, II, III or ML (no saved place) | "Next recommended lesson: **Ratios, rates and unit rates**" (Prealgebra, lesson 1) | Learner sent back to the start |
| End of Calculus III and of ML: course page | "Review in Practice", "**Choose another course**" (the whole catalog) | Dead end |
| End of ML: last lesson | No next step; "Back to the course outline" | Dead end |
| End of Linear Algebra | Lesson page: ML Validation; course page: **Calculus III** (needs Calculus II) | Two answers; readiness ignored |
| End of Calculus I | Lesson page: Calculus III; course page: Calculus II | Two answers, skipped course |
| End of Probability & Statistics | Lesson: Bayes (backwards in the course); course page: ML Validation | Two answers |
| End of Prealgebra | Lesson: `a1-slope`; course page: `a1-break-even` | Skipped Algebra I's first lesson |
| `st-bayes` (first lesson of its course) | "Recommended next": ML classification metrics | Left the course before its second lesson |
| `la-projection` | "Recommended next": `la-svd-pca` | Skipped three written lessons |
| Every unit end | Pager: "**Back to the course →**" | Next unit never offered |
| Outline-only course pages | Only "Make this my starting point" | Nothing to do |
| Two clicks on "Next" up to 200 ms apart (any lesson) | One step | The second press asked for the same step |
| "Recommended next" button in lessons | Teal text on the purple primary button | Contrast defect |

**Root cause.** Five independent rules decided "what next": `HomePage.nextLesson` (catalog order from the placement, wrapping round to Prealgebra), `HomePage.nextAfter`, the lesson page's `meta.next[0]` (hand-written "leads to" links, several pointing across courses or backwards), the unit-only pager, and `nextAfterCourse` (first course in catalog order listing this one as a prerequisite, never checking its other prerequisites).

## 2. Decisions

| # | Decision | Why |
|---|---|---|
| D1 | One pure engine, `src/lib/learningPath.js`, answers "after this lesson", "for this course" and "overall"; every page renders its answer (`PathNext`). | The brief's acceptance criterion 2; the five rules above disagreed. |
| D2 | Within a course, Next follows the catalog order of written lessons across units. The lessons' `next` links stay as "Leads to" in See connections. | The `next` links are concept links, not an order; several went backwards or across courses. |
| D3 | The default route orders every course by the catalog's own `level`, prerequisites first (tested). Outline courses stay in the route, so the map is honest, and are passed over with a named warning. | Derived from the content, not from an illustrative list; Probability & Statistics and Linear Algebra need only Algebra I and run in parallel. |
| D4 | "Finished the available lessons" is never "finished the course" or "mastered": every transition from a course with planned titles warns that the full course is not complete. | Brief §1, three endings. |
| D5 | Placement or a starting point chosen after the latest finished lesson wins; otherwise the furthest course with a finished lesson anchors Home, so reviewing an old lesson never drags the recommendation back. | Brief: never send advanced learners back without evidence; respect the learner's choice. |
| D6 | Bridges come only from direct prerequisites (looking through outline courses), or from answers under half right on a prerequisite's skills. If the lesson teaching that skill is already done, the remedy is Practice → Review, not repeating the lesson. Nothing is locked: "skip ahead" stays available. | A transitive bridge sent ML learners to Prealgebra. |
| D7 | Applied tracks are lesson-level sequences of written lessons, with planned topics named by their exact catalog titles (validated) and a project. The physics track says it has no project yet. | Brief §2: tracks report where content is not authored. |
| D8 | The chosen path is an optional field of `fi_diagnostic_v1`, beside the placement. No new key and no schema version change; backups already include it. A malformed value is dropped, never a reason to quarantine the record. | Brief §4: no hidden store that backups omit. |
| D9 | Real-world problems are a separate, validated bank attached to lessons, rendered in "Use it"; "Explain it back" in "Check understanding". The six-step lesson stays as it is. | Brief §5: embed the cycle in the existing six steps. |
| D10 | A step asked for with Next is current at once, until the scroll lands or the learner scrolls. | Two quick presses moved one step. |

## 3. What was built

| Area | Files |
|---|---|
| Engine, data, validation | `src/lib/learningPath.js`, `src/data/curriculum/pathways.js`, `src/data/curriculum/path.js`; `scripts/validate-content.mjs` (new group); `scripts/learning-path-map.mjs` → [`LEARNING_PATH_MAP.md`](LEARNING_PATH_MAP.md) (`npm run docs:path`) |
| Shared UI | `src/features/learn/PathNext.jsx` + `path.css`, `src/features/learn/usePathState.js` |
| Home | `src/features/home/HomePage.jsx`: one primary action (Resume, Continue recent lesson, or the path's next step with its reason), a path trail (path → course → unit → lesson → step), written lessons checked on the path, next milestone |
| Course page | `src/features/learn/CoursePage.jsx`: journey line (previous ← this → next, outline courses named), engine CTA with bridge offer, finish panel (Continue to the next course, Apply what you learned, Review, Browse all courses), "What comes after this course?", outline-course alternative |
| Lesson page | `src/features/learn/LessonPage.jsx`: completion summary after the checkpoint (what you practised, what needs review, where it is used, the next step), a pager across units with "Finish course & continue", the requested-step fix, real-world problems, Explain it back |
| Path page | `src/features/learn/PathwayPage.jsx` (`#learn/pathway`, reached from Learn → Courses): next step, the route with "you are here", applied tracks (follow / stop), CSU preparation view with disclaimer |
| Courses, My Progress | `CoursesPage.jsx` (path card), `src/features/progress/StudyJourney.jsx` (path line and next step) |
| Persistence | `src/store/useDiagnosticStore.js` (`path`, `choosePath`) |
| Practice content | `src/data/curriculum/problems.js`, `src/features/learn/lesson/AppliedProblem.jsx`, `src/features/learn/lesson/ExplainBack.jsx` |
| Removed | `nextAfterCourse` (`src/lib/courseJourney.js`), `nextLesson`/`nextAfter` (Home), the lesson page's `meta.next` rule |

### What the app offers now (after)

The generated [`LEARNING_PATH_MAP.md`](LEARNING_PATH_MAP.md) shows every transition with its reasons. In short: Prealgebra → Algebra I → Probability & Statistics → Linear Algebra → Calculus I → Calculus II → ML → Calculus III → an honest end of the path. Python for Data Science, Algebra II and Precalculus are named where the path passes over them, and their course pages offer Code exercises or the next written course.

## 4. Content coverage

**Courses and lessons.** 11 courses: 8 with written lessons, 3 outline only. 23 written lessons, 139 planned titles, unchanged by this release (no new lessons were authored; P4 was not started).

**Enhanced lessons (P1): 16**, the first and last written lesson of each of the 8 written courses (for 5 courses with two lessons, that is both). Each now has a real-world problem (3–4 graded steps, at least one diagnosing a plausible wrong answer) and an "Explain it back" prompt.

| Lesson | Real-world problem | Domain |
|---|---|---|
| Ratios, rates and unit rates | Which field is thirstier? | Agriculture |
| Solving equations by keeping balance | Saving for a laptop | Personal finance |
| Break-even | Pricing a food truck’s taco plate | Restaurant operations |
| Fitting a line to data | Fuel use of a delivery van | Transportation |
| Bayes’ theorem as updating | How much to trust a rain forecast | Weather |
| Sampling distributions and the CLT | Did the new menu change how busy we are? | Restaurant operations |
| Vectors and the dot product | Pulling a cart: which part of the force does work? | Physics |
| Principal components and the SVD | Regional and local rain: two gauges | Weather |
| The derivative from first principles | How fast is a dropped phone going? | Physics |
| Marginal cost | When does selling more earn less? | Sales |
| Area as a limit of Riemann sums | How much rain fell in the storm? | Agriculture |
| Taylor polynomials | When can a robot arm treat sin θ as θ? | Physics |
| Partial derivatives and the gradient | Which way should a heat-seeking robot move? | Physics |
| Gradient descent | Calibrating a robot arm by gradient descent | Data science |
| Validation and cross-validation | How good is the delivery-time model really? | Data science |
| Calibration and fairness | Do the “likely to return” scores mean what they say? | Marketing |

**Not enhanced:** the other 7 written lessons (`a1-slope`, `a1-slope-intercept`, `la-projection`, `la-matrix-scores`, `la-matrix-transform`, `la-elimination`, `ml-classification-metrics`) keep their existing six steps, practice and "Use it" task, but have no bank problem or explain-back yet.

**Mini-projects (P3).** Existing projects cover Prealgebra, Algebra I, Probability & Statistics, Linear Algebra and ML. Calculus I, II and III have two written lessons each and no project. Their multi-step bank problems are the applied work for now. Each applied track ends in a project, except physics, which says so.

**Teaching methods present after this release.** Predict → reveal (existing PredictCard); faded scaffolding (existing scaffolded → independent → transfer items); retrieval and spaced review (existing review schedule); interleaving (existing mixed review); error analysis (a reasoning step in every bank problem); transfer (bank problems in a new setting); dual representation (formula, table of variables, words); "Explain it back" with a model answer after the attempt. Mastery is never inferred from scrolling, time or one answer. Not added: a confidence rating ("how sure are you?").

**Review status.** Every bank problem and explain-back prompt is an AI draft **awaiting independent human math review**, like the lessons, and says so on the page. Machine checks: every numeric answer is recomputed independently (`compute`) within rounding-only tolerances; every formula parses; every wrong choice has feedback.

**Data.** All 16 problems use invented numbers and are labelled "Invented numbers, not measured data" with a note on how they were sized. No external dataset was added, so no new licence or offline snapshot is needed.

## 5. Tests and checks

| Check | Result (2026-10-28, Linux) |
|---|---|
| `npm run lint` | pass |
| `npm run validate:content` (now including learning paths) | all content valid |
| `npm test` | 474 / 474 (35 files) |
| `npm run build`, `npm run budget` | pass; initial JS 71.9 KB gzip (budget 90 KB; 71.6 before) |
| `npm run verify:python` | 78 / 78 Python blocks produce exactly their stated output |
| `npm run a11y`, `npm run a11y:light` | no WCAG A/AA violations across 61 pages, dark and light |
| `npm run e2e` | 262 / 262 (8.4 min); after the last Home wording change, the four specs touching Home and lessons again: 133 / 133 |
| `npm run e2e:python`, `npm run check:citations` | not run here: the environment cannot reach the Pyodide CDN or most cited hosts (CI runs `e2e:python`) |

New tests:
- `src/lib/__tests__/learningPath.test.js` (44): structural validation of the real curriculum and of broken fixtures (cycle, order, missing course, unknown lesson, unreal planned title, track without project, outline alternative on a written course); a walk from the start reaching every written lesson once in route order; deterministic and keyed by ids (catalog arrays reversed, same answers); next within a course and across units; every course transition, consistent between course page, last lesson and Home; outline courses named; the honest end, also after placing further along; placement, chosen starting point and reopening old lessons on Home; bridges (direct only, placement, weak skills → bridge or review); 300 random states never pointing to an unwritten or finished lesson; every target page exists.
- `src/store/__tests__/pathChoice.test.js` (4): stored, reloaded, older records, malformed value dropped without quarantining attempts, backup and restore.
- `src/data/curriculum/__tests__/problems.test.js` (11): schema, data labels, references, answers recomputed, keys accepted and wrong answers rejected, formulas parsed, feedback on every wrong choice, coverage of the enhanced lessons derived from the catalog, at least six activities of several kinds per enhanced lesson.
- `e2e/continuous-learning.spec.js` (21): A Next across units to "Finish course & continue"; A2 unit end; B a real checkpoint answered at a course end, then one click into the next course; C an outline successor named; D the honest end; E Home after every finished course; F placement; G chosen starting point; H outline courses offer something; I path page, following a track (Home, reload, backup), stopping; J two quick presses of Next (1280 and 375 px); L a real-world problem (hints count as help, solution after attempts) and Explain it back into the notes; M offline; K 320/375/768/1280 px × light/dark: no horizontal overflow, axe clean on the path page, a finished course, the lesson summary, Courses and Home. **Against `main`, 10 of the first 16 fail**: they test the new behaviour, not what was already true.
- Updated: `studyContinuity.test.jsx` and `study-continuity.spec.js` (the finish panel's link now reads "Continue to Algebra I: …").

Save and resume (save at step N, reload, resume; cross-tab; quota; reset; migration) are covered by the study-continuity suites from PR #6, which still pass.

## 6. Known limitations

- **Production could not be checked from the work environment:** its network policy refuses `wai-999.github.io`. Release verification relies on the GitHub Actions deploy run and its artifact (§7). To check by hand: open `#learn/pathway`, finish a course's last checkpoint, and check Home offers the next course.
- The route is one reasonable order, not the only one. Probability & Statistics, Linear Algebra and Python can be taken in any order after Algebra I, and the path page says so.
- Calculus I builds on Precalculus and Algebra II, which are not written. The transition says so and names the ideas the first lesson assumes (limits and continuity). It cannot bridge to unwritten content.
- Tracks change Home's and the track lessons' next step; course pages stay course-centred by design.
- 7 written lessons are not yet enhanced (§4); no lesson was newly authored.
- All new content is AI-drafted; independent human math review remains BLOCKED as before (`docs/CONTENT_QA.md`).

## 7. Release

(Filled in during release.)
