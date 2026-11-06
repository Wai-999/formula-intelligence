# Test results

Every command was run on this machine (macOS, Node 24.16.0, Chromium from Playwright) on branch `feat/learning-8020-professor-experience`. CI results are recorded in RELEASE_REPORT.md.

## 1. Baseline (before any 80/20 change)

On `main` (`f6d8691`): the PR #7 CI run [40646338474](https://github.com/Wai-999/formula-intelligence/actions/runs/40646338474) and the deploy run [40648067467](https://github.com/Wai-999/formula-intelligence/actions/runs/40648067467) passed.

On this branch after merging `main` into the V5 work (`c17f789`), before 80/20 edits:

| Command | Result |
|---|---|
| `npm run lint` | PASS (0 warnings) |
| `npm test` | PASS — 505 / 505 |
| `npm run validate:content`, `npm run validate:college` | PASS |
| `npm run verify:python` / `verify:cpp` | PASS — 90 / 90, 20 / 20 |
| `npm run build`, `npm run budget` | PASS — 72.0 KB of 90 KB initial JS |
| `npm run e2e` | 300 passed, **2 failed** (merge effects: a test that needed a real outline-only course, which no longer exists; a test that clicked “Retake”, renamed “Answer more questions” when evidence is thin). Fixed; those two specs re-run: 116 passed, 1 skipped. |

## 2. After the upgrade (final run, 2026-11-04)

| Command | Result | Evidence |
|---|---|---|
| `git status --porcelain=v1` | clean apart from the documented changes | — |
| `npm run lint` | **PASS** — 0 warnings, 0 errors | oxlint |
| `npm run validate:content` | **PASS** — “All content valid.” | |
| `npm run validate:college` | **PASS** — 86 records, 12 sources, “College data valid.” | |
| `npm test` | **PASS** — 587 / 587 in 41 files | new: `nextAction.test.js` (26, the brief’s hard cases), `professorContract.test.js` (54), `choiceOrder.test.js` (2) |
| `npm run build` | **PASS** | |
| `npm run budget` | **PASS** — 72.1 KB gzip initial JS (budget 90 KB) | |
| `npm run verify:python` | **PASS** — 90 / 90 Python blocks give exactly their stated output | |
| `npm run verify:cpp` | **PASS** — 20 / 20 C++ checks (C++17, `-Wall -Wextra -pedantic -Werror`) | sanitizers skipped on macOS when the probe fails; they run on Linux CI |
| `npm run a11y` | **PASS** — no WCAG A/AA violations across 78 pages (dark) | axe-core |
| `npm run a11y:light` | **PASS** — no WCAG A/AA violations across 78 pages (light) | |
| `npm run e2e` | **308 passed, 1 skipped, 1 failed then passed on re-run** | The failure, `legacy-routes: #maps/models resolves to #learn/models`, waited for the model map’s lazy content (8 characters instead of > 100). It does not touch code changed here; the spec re-run alone passed 46 / 46. Treated as a timing flake, not hidden: CI’s single retry covers it, and it is listed in REMAINING_BACKLOG.md if it recurs. The skip is continuous-learning case C, whose precondition (an outline-only course) no longer exists; its logic is tested on a catalog copy in `learningPath.test.js`. |
| `npm run e2e:python` | **PASS** — 5 / 5 (Pyodide worker) | |
| `npm run check:citations` | **PASS** — 74 OK, 1 unverified (doi.org refuses automated requests), 0 broken | |
| `npm run docs:curriculum`, `docs:path`, `docs:college`, `docs:gaps` | **PASS** — regenerated from source | `docs:gaps` is new (COURSE_GAP_MAP.md) |
| `git diff --check` | **PASS** | |

New end-to-end tests (`e2e/learning-8020.spec.js`, 8): wrong-answer feedback and the bridge link; the chain-rule bridge on Home, once; the faded example; the honest gap after Calculus I with the four course statuses and My Progress agreeing; the session summary; axe on the new states in both themes; no sideways scroll at 320 px; “Try a question now”.

Updated end-to-end tests: `continuous-learning` A, B, D, E now expect the honest-gap ending (computed by the same engine the app uses); four tests pick choice options by `data-choice` instead of position.

## 3. Scripted journeys and metrics

| Command | Result |
|---|---|
| `node scripts/learning-journeys.mjs <live> evidence/before` | 6 personas on the live site — USABILITY_TEST_REPORT.md |
| `node scripts/learning-journeys.mjs <local build> evidence/after` | 6 personas on this branch |
| `node scripts/learning-metrics.mjs` on `main` and on this branch | `evidence/before/metrics-main.json`, `evidence/after/metrics-after.json` |

## 4. Not run, and why

| Check | Why not |
|---|---|
| Screen readers (VoiceOver, NVDA) | Needs a person operating them; only automated axe checks ran. |
| Real-learner sessions | No participants; no analytics may be added. Protocol in USABILITY_TEST_REPORT.md. |
| Lighthouse | Not part of this change’s risk (no new heavy dependency; the budget gate passed). The last Lighthouse evidence is in `docs/audits/evidence/lighthouse/`. |
| Live-site tests after deployment | Depend on the merge being approved; see RELEASE_REPORT.md. |

## 5. Phase 5: two prerequisite lessons (2026-11-05)

On `feat/learning-8020-phase5-prereq-lessons`, from `main` at `37e23e3` (docs/learning-8020/PHASE5_PREREQUISITES.md).

| Command | Result | Notes |
|---|---|---|
| `npm run lint` | **PASS** — 0 warnings | |
| `npm test` | **PASS** — 607 / 607 in 41 files | the contract test now runs on seven lessons (74 tests in the file); two unit tests that hard-coded “4” Algebra I lessons now count them from the catalog |
| `npm run validate:content`, `validate:college` | **PASS** | |
| `npm run verify:python` | **PASS** — 92 / 92 | two new Python blocks |
| `npm run verify:cpp` | **PASS** — 20 / 20 | no C++ changed |
| `npm run build`, `npm run budget` | **PASS** — 72.1 KB of 90 KB | lesson bodies are separate chunks |
| `npm run a11y`, `a11y:light` | **PASS** — no WCAG A/AA violations across 80 pages in each theme | two more lesson pages than before |
| `npm run check:citations` | **PASS** — 77 OK, 1 unverified (doi.org), 0 broken | three new OpenStax links |
| `npm run e2e` | 311 passed, 1 skipped, **2 failed**, then fixed | `study-continuity` D seeded “the other three” Algebra I lessons and expected “3 of 4”: it now takes the lessons from the catalog (re-run: 69 / 69 with legacy-routes). `legacy-routes #ml/macro` read lazy page content once and saw 8 characters — the same timing failure as `#maps/models` in §2, so the check now waits for the content (`expect.poll`); legacy-routes passed 138 / 138 over three repeats. |
| Browser check (local production build) | **PASS** | both lessons open with no console errors and no KaTeX errors; a wrong faded-example answer shows “Not yet. … Where to look: …” and a bridge to *The derivative from first principles*; the three applied problems list under *Use it* |
