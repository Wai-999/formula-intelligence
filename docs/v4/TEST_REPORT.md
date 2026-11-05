# Test report — V4

Every result below was produced by running the command shown, on 2026-10-24, on branch `upgrade/v4-simple-applied`. CI repeats the same gates on the pull request and again before deploying (`.github/workflows/ci.yml`, `deploy.yml`).

**Environment (local):** macOS 26.7.2, Apple M4 Pro · Node 24.16.0 · Playwright 1.62.0 with Chromium 151.0.7922.34 (headless) · CPython 3.13.5, NumPy 2.4.6, pandas 3.0.3. **CI:** ubuntu-latest, Node 22, CPython 3.12 with numpy, matplotlib, pandas.

## Gates

| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | PASS (0 warnings) |
| Content validation | `npm run validate:content` | PASS |
| Unit tests | `npm test` | **350 / 350** (28 files) |
| Build | `npm run build` | PASS |
| Initial-load budget | `npm run budget` | **71.6 KB** gzip (budget 90; V3.1 71.9) |
| Python outputs | `npm run verify:python` | **78 / 78** — 23 lesson blocks, 29 reference solutions pass their tests (every starter fails them), 26 no-code outputs exact |
| End-to-end | `npm run e2e` | **214 / 214** |
| Python worker (heavy) | `npm run e2e:python` | **5 / 5** — incl. a pandas project step graded in the browser |
| Accessibility, dark | `npm run a11y` | **0 violations**, 60 pages (WCAG 2.0/2.1/2.2 A–AA tags) |
| Accessibility, light | `npm run a11y:light` | **0 violations**, 60 pages |
| Accessibility, CI-like font | `A11Y_FONT="'DejaVu Sans'" npm run a11y` and `a11y:light` | **0 violations** in both themes |
| Citations | `npm run check:citations` (network) | **54 OK · 1 UNVERIFIED** (publisher returns 403 to scripts) · **0 broken** |
| Lab timings | `npm run evidence:perf` | see `docs/PERFORMANCE_REPORT.md` (lab only) |

## What the new tests cover

| Area | Tests |
|---|---|
| Five destinations, tabs, child pages, every V3.1 and pre-V3.1 redirect | `src/app/__tests__/pages.test.js` (8); `e2e/legacy-routes.spec.js` (41 addresses + rehomed lessons + Back) |
| Six-step lessons, three exemplar lessons (all elements, recomputed answers, KaTeX) | `curriculum.test.js`; `e2e/v31.spec.js` (keyboard checkpoint at 320 px, now on step 6) |
| Applied lab arithmetic | `labMath.test.js` (break-even; difference quotient exactly $a + 2bq + bh$; scores and standardization equal NumPy's) |
| Placement: start earlier / here / skip ahead | `diagnostic.test.js` (3); `e2e/v31.spec.js › diagnostic` |
| Learning signals | `learningSignals.test.js` (4) |
| Interleaving, search, motion setting | `interleave.test.js`, `searchIndex.test.js`, `theme.test.js` |
| Projects and no-code paths | `verify:python` (all six projects' steps); `e2e/python-worker.spec.js` (pandas in the browser) |

## Usability tasks (V4 §11) — scripted

`e2e/v4-usability.spec.js`, each at **1280 × 800** and **375 × 760**:

| Task | Result | How it is measured |
|---|---|---|
| (a) First-time learner starts in under 3 clicks from Home | **PASS** — 2 clicks | "Start from Prealgebra" → first lesson link |
| (b) Resumes a lesson in one action | **PASS** | Home shows one primary button, "Continue the lesson" |
| (c) Completes a lesson and a transfer problem without guessing navigation | **PASS** | Only the lesson's own "Next:" button; answers by keyboard; the lesson names the next one |
| (d) Finds a formula connection on demand | **PASS** | "See connections" → "Open the full concept map here" → the concept, selected |
| (e) Locates and restores a progress backup | **PASS** | Home → My Progress → Settings (2 clicks) → download → wipe → restore → data back |

These prove the paths exist, are short and work by keyboard on both viewports. **They are not usability testing**: no learner has been observed using them.

## Migration and safety

- Legacy and V3.1 addresses: 41 redirect cases, Back-button behaviour, rehomed lessons — `legacy-routes.spec.js`.
- Corrupt, partial, future-version and missing storage; byte-exact backup → wipe → restore — `versioned.test.js`, `backup.test.js`, `e2e/data-safety.spec.js` (now through My Progress → Settings).
- Offline after one visit (whole app; Python discloses it needs a connection) — `e2e/offline.spec.js`.
- No storage key changed shape; two optional evidence fields added (`docs/MIGRATION_AND_ROLLBACK.md`).

## Not done — BLOCKED or UNVERIFIED

| Requirement | Status | Why / what is needed |
|---|---|---|
| Independent math review of the 23 lessons and new derivations (V4 §11 content gate) | **BLOCKED** | Needs a reviewer other than the author; every lesson is labelled a draft |
| User testing of the three exemplar lessons (V4 §10 Phase 2) | **BLOCKED** | Needs learners; scripted tasks only |
| Screen-reader testing | **BLOCKED** | Needs a person with NVDA/VoiceOver/TalkBack |
| Lighthouse score | **NOT MEASURED** (on 2026-10-24) | Not installed then. Measured after release, on 2026-10-27: see `PERFORMANCE_REPORT.md` → Lighthouse |
| Field Core Web Vitals, interaction latency | **UNVERIFIED** | No analytics by design; lab timings only; INP not measured |
| Learning-outcome rates for a population | **Not claimed** | Signals are computed per learner on the device; no baselines or effectiveness figures exist |
