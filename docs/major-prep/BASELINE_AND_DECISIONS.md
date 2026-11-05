# Baseline, scope and decisions — V5.1

The V5.1 brief (`FORMULA_INTELLIGENCE_MASTERY_UPGRADE_V5_1_AUDITED_OPTIMIZED.md`) asks for an upgrade, not a rebuild: make the existing site a rigorous pre-study platform for Ohlone College's Data Science A.S. and its transfer paths, without pretending to award credit. This file records where the work started, what was chosen and why.

## 1. Baseline (Phase 0, 2026-10-24)

| Item | State |
|---|---|
| Repository | `Wai-999/formula-intelligence`, `main` at `3557155` (V4, PR #4), live at https://wai-999.github.io/formula-intelligence/ (deploy run 40147273576) |
| Working copy | Branch `feat/ohlone-major-mastery-v5` from `origin/main`, in the separate worktree used for V3.1/V4. The owner's primary checkout has an uncommitted redesign (decision D1, still open) and was not touched. |
| Gates on the baseline | `npm run lint` PASS · `npm run validate:content` PASS · `npm test` 350/350 · `npm run budget` 71.6 KB gzip (budget 90). E2E (214/214) and axe (0 violations, 60 pages) are the V4 results from `docs/v4/TEST_REPORT.md`, not re-run on the baseline. |
| Toolchain | Node 24, Python 3.13 with NumPy/pandas, Apple clang 17 as `g++` (CI: ubuntu-latest g++) |
| Curriculum | 9 subjects, 11 courses, 23 written lessons (all AI drafts, 0 human-reviewed), 139 planned titles, 47 competencies, 64 diagnostic items, 23 labs, 9 projects (6 featured), 29 graded Python exercises |
| Storage keys | `fi_learning_v1`, `fi_lessons_v1`, `fi_notes_v1`, `fi_diagnostic_v1`, `fi_projects_v1`, `fi_pyex_v1`, `fi_theme_v1`, `fi_motion_v1`, `fi_nav_v1`, and the older `bluman_*`, `ml_*`, `py_lab_v1` keys |
| Screenshots | `evidence/before/` — the live V4 site, 375 px and 1280 px, dark and light (44 images) |

### Gaps found against the brief

- Algebra II, Precalculus and Python for Data Science had **no written lessons**; there was **no C++ or Discrete Structures** course at all.
- No Ohlone, CSU or UC data anywhere in the app.
- The placement check had no explicit **“insufficient evidence”** outcome (§13.4).
- Mastery's “correct on two different days” rule could be met by answers given **after opening a hint** (§13.4: hints must not count as unassisted evidence).
- Projects had no rubric or extension task (§13.5); a comment in `src/data/projects/index.js` cited a dataset test that did not exist.

### Keep / extend / repair / archive

| Decision | What |
|---|---|
| **Keep** | Five destinations; six-step lesson renderer; lab frame; mastery engine and Leitner review; Pyodide worker; backup/restore; maps; existing lessons, labs, projects and storage keys |
| **Extend** | Catalog (Computer Science subject, 4 courses), 12 new lessons, 8 new labs, diagnostic (9 items, a C++ & discrete-math area), mastery evidence breakdown, a 7th featured project, Home time box, Ohlone prep page, college data, C++ verification |
| **Repair** | Two-day mastery rule (unassisted answers only); placement result wording when nothing was answered; the dataset-test claim (the test now exists) |
| **Archive** | Nothing removed |

## 2. Priorities (§13.1)

Scores are judgements (1–5), not measurements. Impact and prerequisite urgency raise priority; effort and upkeep lower it.

| Candidate | Impact | Urgency | Evidence | Effort | Upkeep | Tier | Done here |
|---|---|---|---|---|---|---|---|
| Protect data, navigation, accessibility | 5 | 5 | 5 | 2 | 2 | P0 | Yes — no key reshaped; e2e/axe re-run |
| Verified Ohlone/target facts | 5 | 5 | 5 | 3 | 4 | P0 | Yes — `src/data/college/` |
| Diagnostic → lesson → practice → application → review loop | 5 | 5 | 4 | 3 | 2 | P0 | Yes — vertical slice |
| Algebra II / Precalculus → Calculus I readiness | 5 | 5 | 4 | 4 | 3 | P1 | Partly — 4 lessons |
| C++ fundamentals aligned to CS-102 | 5 | 4 | 4 | 4 | 3 | P1 | Partly — 2 lessons + pipeline |
| OOP, Data Structures, Discrete Structures | 4 | 3 | 4 | 4 | 3 | P2 | Partly — 1 + 1 + 2 lessons |
| Python sequence | 3 | 3 | 3 | 4 | 3 | P2 | Started — 1 lesson |
| Calculus II/III, Linear Algebra depth | 3 | 2 | 3 | 5 | 3 | P2 | Not this run |
| Browser C++ compiler, AI tutoring | 2 | 1 | 2 | 5 | 5 | P3 | Not started (by design) |

## 3. Decisions

| # | Decision | Why |
|---|---|---|
| D-V5-1 | **Ohlone prep is a page under Learn → Courses**, linked from Courses and Home, not a fifth Learn tab | V4 caps each section at four tabs (tested); the brief asks for course-centred integration and forbids a sixth destination |
| D-V5-2 | **No in-browser C++ compiler.** Baseline instead: read, predict, trace, debug; downloadable `.cpp`; local `g++`/`clang++` instructions; CI compiles every program | A WASM toolchain is tens of MB, needs a sandboxed worker, offline caching and licence review — P3 work that would hold core preparation hostage (§6). Nothing is ever sent to a remote compiler. |
| D-V5-3 | **Trace-lab steps are verified, not typed in**: an instrumented copy of each program prints its own steps, and CI compares them with the lab's data (C++ and Python) | §6: “compiler-backed automated reference tests, not hand-authored expected outputs” |
| D-V5-4 | C++ project steps are **self-reported** (“My program passes all N tests”) | The browser cannot run C++; claiming otherwise would be dishonest |
| D-V5-5 | The transfer target and session length are **preferences** in a new key `fi_study_v1`, kept on a progress reset, included in backups | Additive key; never evidence; never official |
| D-V5-6 | **Insufficient evidence** when nothing on the math path was answered, or a deciding area rests on fewer than 2 answers | §13.4: at least two evidence opportunities for a consequential decision |
| D-V5-7 | Mastery's two-day rule counts **only answers given without a hint** | §13.4; mastery is computed, never stored, so no migration is needed |
| D-V5-8 | Diagnostic bank **`dx-2026.10-2`** (73 items, nine areas) | Each saved attempt keeps the version it was taken with |
| D-V5-9 | ASSIST was read **only through its own search page** | Its API rejected direct requests; replaying its anti-forgery token would mean working around the site's protection |
| D-V5-10 | The UC Data Science Transfer Pathway is shown as **unverified** for a specific term | The page states no academic year; a verified-current claim needs one (§2) |
| D-V5-11 | Study coverage is reported as **written versus planned lessons** in the mapped units, plus topics with at least one lesson | A topic count alone overstated thin courses (found in a walkthrough) |
| D-V5-12 | English only; no new top-level destination; no accounts, tracking, paid services or remote execution | Absolute rules 1, 3, 6 |

## 4. Learning design: what was adopted and why

Principles below are well established in the learning-science literature; this run did not re-read the papers or re-check every resource's licence, and **no claim is made that this site improves outcomes** — that needs learners.

| Principle | Where it is used | Source of the idea |
|---|---|---|
| Retrieval practice with first-attempt evidence | Prior checks, graded practice, checkpoints; hints downgrade evidence | General learning research; Khan Academy-style mastery practice (structure only) |
| Worked examples, then faded support | Two worked examples → scaffolded → independent → transfer items in every lesson | Worked-example research; OpenStax-style structured exposition |
| Predict before reveal; name the misconception | Every lesson's predict card; the chain-rule lab's “common mistake” switch | Misconception-based instruction |
| Visual-to-symbolic translation | Every lab has a numbers view and a sentence readout | 3Blue1Brown-style intuition (principle only; no assets reused) |
| Read → predict → trace → debug → write (programming) | Trace lab, debug items, downloadable exercises with tests | Research on novice code reading and tracing |
| Spacing and interleaving | Existing Leitner review and mixed practice; new skills join them automatically | Spacing/interleaving research |
| Project-first application with stated limits | Apply step in every lesson; three rubric-scored projects | fast.ai-style project focus (principle only) |
| **Rejected:** streaks, XP, badges, leaderboards | — | Brief rule 5 and §13.2; they reward activity, not skill |
| **Rejected:** an AI tutor in this release | — | P3; no remote services by default |

Links used inside lessons (OpenStax, MIT OpenCourseWare, cppreference.com, docs.python.org) are references only; no text, problems or graphics were copied. `npm run check:citations` fetches each one.
