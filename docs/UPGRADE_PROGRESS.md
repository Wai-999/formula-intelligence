# Upgrade Progress

**Current state (2026-10-24):** V3.1 released (PR #2, verified live). **V4 — simple, applied learning** (`FORMULA_INTELLIGENCE_SIMPLE_APPLIED_LEARNING_V4.md`) implemented on `upgrade/v4-simple-applied`; released when its PR passes CI and is merged (owner: "push and deploy after upgrade"). 23 lessons content-complete, **0 review-complete** (independent human math review BLOCKED).
**Branches:** `upgrade/v3.1-phase0` → `upgrade/v3.1-phase1` (merged `3f6ddcb`) → `upgrade/v3.1-phases2-10` (merged `9c21ac2`) → `fix/entry-banner-wording` (merged `a103f32`) → **`upgrade/v4-simple-applied`**, all in worktree `../fi-upgrade-v31`. The primary checkout's uncommitted redesign is untouched (decision D1 still open).
**Merge/deploy policy:** PRs only; CI runs every gate on the PR; `main` deploys only when the same gates pass again.

## V4 — simple, applied learning

Deliverables (V4 §12), all in `docs/v4/`: [AUDIT](v4/AUDIT.md) · [COURSE_RESEARCH](v4/COURSE_RESEARCH.md) · [SIMPLIFICATION_PLAN](v4/SIMPLIFICATION_PLAN.md) · [CURRICULUM](v4/CURRICULUM.md) · [LESSON_TEMPLATE](v4/LESSON_TEMPLATE.md) · [APPLIED_PROJECTS](v4/APPLIED_PROJECTS.md) · [TEST_REPORT](v4/TEST_REPORT.md). Screenshots: before `docs/audits/evidence/screenshots/v31/`, after `docs/audits/evidence/screenshots/v4/`.

| V4 phase | Done | Evidence | Status |
|---|---|---|---|
| 0 Inspect and measure | Live build and code audited; 9 reference courses and 3 datasets verified at source with licences | `AUDIT.md`, `COURSE_RESEARCH.md` | **Done** |
| 1 Simplify | 7 → **5 destinations** (Home, Learn, Practice, Apply, My Progress); maps behind Learn → Maps + "See connections"; practice and review consolidated; Python under Apply; notebook and settings under My Progress; header depth switch → setting; streaks, badges, confetti removed; every V3.1 and pre-V3.1 address redirects | `pages.test.js`, `legacy-routes.spec.js` (41 addresses, plus rehomed lessons and Back) | **Done** |
| 2 Lesson model + 3 exemplars | Every lesson in six steps; Break-even, Marginal cost, Scoring customers with 3 new labs | `curriculum.test.js`, `labMath.test.js`, `verify:python` | **Done** — user testing **BLOCKED** |
| 3 Pathways | Routes documented; placement offers start earlier / here / skip ahead; recommendations unchanged | `CURRICULUM.md`, `diagnostic.test.js` | **Partial**: no new courses (V4 §10 defers expansion until learners have tested the basic loop) |
| 4 Applied projects | Six projects, 3 real + 3 labelled synthetic datasets, graded steps with no-code paths; learning signals defined and computed per learner | `APPLIED_PROJECTS.md`, `learningSignals.test.js` | **Done** |
| 5 Polish and expand | — | — | **Not started** by design (V4 §10) |

**Blocked / unverified (stated, not hidden):** independent math review of 23 lessons; user testing of the exemplars and of the five usability tasks with real learners (they pass as scripts); screen-reader testing; Lighthouse and field Core Web Vitals; Pyodide SRI (F-09).

## V3.1 (Master Prompt V3.1, released 2026-10-24)

## Status vocabulary (§17)
*Code-complete*: behaviour, tests and docs exist. *Content-complete*: every planned lesson and assessment of a course is authored. *Review-complete*: an independent human reviewer has signed off. *Production-released*: deployed to GitHub Pages and verified there.

| | Code-complete | Content-complete | Review-complete | Production-released |
|---|---|---|---|---|
| Shell, IA, design system, themes, a11y foundation | ✔ | — | n/a | with this PR |
| Curriculum schema, lesson renderer, graph, search, validation | ✔ | — | n/a | with this PR |
| Diagnostic, mastery, review, mixed practice | ✔ | 64 items, 32/46 competencies | ✘ (uncalibrated) | with this PR |
| Lessons | ✔ renderer | **20 lessons**; **no course** content-complete (159 titles planned) | **0 / 20** | with this PR |
| Labs | ✔ 20 | ✔ | ✘ | with this PR |
| Python worker, exercises, projects | ✔ | 17 exercises, 3 projects | ✘ | with this PR |
| Offline, performance, backup/restore | ✔ | — | n/a | with this PR |

## Phases 2–10 — results

All on branch `upgrade/v3.1-phases2-10` (one PR rather than one per phase — the phases share the new shell and schema, and splitting them would have meant reviewing intermediate states nobody would ship). Screenshots for every phase: `docs/audits/evidence/screenshots/v31/` (10 pages × 320/768/1280 dark + 320/1280 light, `npm run evidence:screenshots`).

### English-only, step B (carried over from Phase 1)
Burmese stripped from all content constructors; the beginner/researcher depth kept. Evidence: `e2e/english-only.spec.js` (every page, depth group `aria-pressed`).

### Phase 2 — design system, themes, responsive shell, accessibility foundation
- **Built:** seven-section IA (`src/app/pages.js`) replacing the Stats/ML two-mode shell; `AppShell`, `PrimaryNav` (sidebar/rail), `BottomNav` + More sheet, `PageHeader` (one `<h1>`, focus after navigation, `document.title`); system/light/dark + reduced-motion setting; studio primitives; skip link; focus mode; shortcuts; keep-alive LRU (5) replacing keep-everything; 320 px overflow fixed everywhere (F-07).
- **Removed:** `IconRail`, `MLIconRail`, `ModeSwitcher`, `StatsBody`, `MLBody`, `StatsDepthToggle`, `LevelLangToggle`, `ComingSoonPage`, `useVisitedTabs`.
- **Tests:** `useKeepAlive.test.jsx` (6), theme/motion and shortcut unit tests; e2e shell tests (skip link, focus, search, section keys, focus mode, More menu, theme), 320 px sweep over 59 surfaces. **Perf:** initial JS 73.9 → 71.9 KB. **Docs:** `DESIGN_SYSTEM.md`, `PRODUCT_ARCHITECTURE.md`.

### Phase 3 — curriculum schema, lesson renderer, graph, search, validation
- **Built:** catalog (9 subjects, 11 courses, 71 units; authored vs planned enforced), 46 competencies, 86 concepts, 39 formulas with claim types, typed knowledge graph (292 nodes / 421 edges, acyclic prerequisites), ten-element lesson renderer with KaTeX/MathML, section tracker, notes; global search (Ctrl/⌘+K); Concept map with keyboard navigation + outline; Formula- and Model-map keyboard navigation and outline views (F-04).
- **Tests:** `curriculum.test.js` (21), graph validation, `searchIndex.test.js` (5). **Docs:** `CURRICULUM_MAP.md` (generated), `FORMULA_GRAPH_SCHEMA.md`.

### Phase 4 — diagnostic, placement, mastery, review
- **Built:** 3-round adaptive diagnostic (Rasch posterior, honest confidence, skip/stop, override, retakes kept); evidence-based mastery; Leitner review with no late penalty; Home (first run, continue, review session, gaps, progress).
- **Tests:** `diagnostic.test.js` (14), `learningEngine.test.js` (20), `versioned.test.js` (10). **Docs:** `LEARNING_ASSESSMENT_SPEC.md`.

### Phase 5 — Prealgebra → Algebra vertical slice
- **Authored:** *Ratios, rates and unit rates*; *Solving equations by keeping balance*; *Slope as rate of change*; *Slope–intercept form*; *Fitting a line to data* — with Ratio, Equation-balance, Slope, Transform and Least-squares labs. **Placeholders:** the rest of Prealgebra (13 titles) and Algebra I (13) are labelled outlines.

### Phase 6 — Algebra II, precalculus, linear algebra
- **Authored:** Linear Algebra — *Vectors and the dot product*, *Projection onto a vector*, *Matrices as transformations* (+ eigenvectors), *Gaussian elimination*, *Principal components and the SVD*, with Vector, Matrix, Eigen, Elimination and PCA labs. **Not authored:** Algebra II and Precalculus (outline only — 26 titles). Acceptance 3 content present; independent check BLOCKED.

### Phase 7 — Calculus I–III and optimization
- **Authored:** *The derivative from first principles* (Calculus I), *Area as a limit of Riemann sums* and *Taylor polynomials* (II), *Partial derivatives and the gradient* and *Gradient descent* (III) — with Riemann, Taylor, Gradient/Hessian and Descent labs (the derivative lesson reuses the Slope lab). Single- vs multivariable notation explicit (`c3-gradient`). Numerical checks against closed-form cases: `labMath.test.js` (15).

### Phase 8 — statistics/ML integration, evaluation, rehomed ML visualizations
- **Authored:** *Sampling distributions and the CLT*, *Bayes’ theorem as updating*, *Validation, cross-validation and leakage*, *Confusion matrix, precision, recall and ROC*, *Calibration and fairness checks* — with Sampling, Bayes, Decision-boundary, Cross-validation and Calibration labs; bias–variance lives in the ML pipeline lesson.
- **Debt from Phase 1 closed:** the **9 Model Map ladders** that lost their hands-on layer now have in-place widgets computing their own Formalism formula (Lasso soft-threshold, forest variance floor, boosting residual decay, XGBoost leaf weight, AdaBoost vote weight, AR(1) and GARCH half-lives, hybrid noise floor, LSTM forget-gate memory) — 28 widgets + 4 links, 0 retired; predict answers pinned by tests. **Mixed review re-sourced** (D2) as Practice → Mixed practice, interleaving opened lessons across subjects; the old badge and its retired-lab questions were removed.

### Phase 9 — Python runtime, code exercises, projects
- **Built:** Pyodide in a Web Worker (terminate on Stop/timeout, recover; allowlisted packages; friendly offline error) — fixes F-01; 17 graded exercises over 8 types; 3 projects (Anscombe — real data, cited; screening; PCA); Python lab Stop button.
- **Tests:** `python-worker.spec.js` @heavy (3) + journey (1); `npm run verify:python` 37/37 in CI. **Docs:** `PYTHON_RUNTIME_SECURITY.md`. **Open:** F-09, no SRI on Pyodide.

### Phase 10 — offline, performance, a11y/user testing, backup/restore, deployment
- **Built:** generated service worker + manifest (F-08); Settings (appearance, depth, privacy + backup/reset, offline note, shortcuts); lab perf script; screenshot script; CI runs verify:python.
- **Tests:** `offline.spec.js` (acceptance 7). **Docs:** `PERFORMANCE_REPORT.md`, `ACCESSIBILITY_REPORT.md`, `CONTENT_QA.md`, `MIGRATION_AND_ROLLBACK.md`, README. **BLOCKED:** screen-reader and user testing, field CWV.

## Release readiness scorecard — Phases 2–10 (§17)

| Req ID | Implemented behavior | Test evidence | Status | Risk | Next action |
|---|---|---|---|---|---|
| ACC-1 Deletion | 6 ML tabs removed; teaching rehomed; old ids resolve; ladders hands-on again | `legacy-routes.spec.js`, `routes.test.js`, `depthLadders.test.js` | **PASS** | Low | — |
| ACC-2 Data-loss | Versioned envelopes, migrations, quarantine, byte-exact backup/restore, reset keeps prefs | `versioned.test.js`, `backup.test.js`, `data-safety.spec.js`, `v31.spec.js` reset | **PASS** (no real migration has run yet; chained-migration fixtures pass) | Low | Add fixtures with the first v2 schema |
| ACC-3 LA lesson | 5 LA lessons: derivation, assumptions, counterexample, lab, exercise, Python, cited source | `curriculum.test.js` (ten elements, recomputed answers, KaTeX), `verify:python`, citations | **PARTIAL** — independent human check **BLOCKED** | Medium | Human math review |
| ACC-4 Calculus | Single vs multivariable notation; numeric checks vs closed forms | `curriculum.test.js`, `labMath.test.js` | **PASS** (machine); human review BLOCKED | Medium | Human math review |
| ACC-5 Diagnostic | No mastery from one answer; reasons for every recommendation; uncertainty shown | `learningEngine.test.js`, `diagnostic.test.js`, `v31.spec.js` | **PASS** — calibration UNVERIFIED | Medium | Collect (opt-in) data before tuning |
| ACC-6 Python | Infinite loop stopped, page responsive, runtime recovers; limits documented | `python-worker.spec.js` @heavy 3/3 | **PASS** — SRI open (F-09) | Medium | Self-host Pyodide or accept risk |
| ACC-7 Offline | Whole app offline after one visit; Python discloses | `offline.spec.js` | **PASS** | Low | — |
| ACC-8 Keyboard/responsive | Keyboard-only lesson at 320 px; maps keyboard + outline; no overflow on 59 surfaces | `v31.spec.js` | **PASS** (scripted); screen readers **BLOCKED** | Medium | Manual SR testing |
| ACC-9 Performance | Initial JS 71.9 KB (budget 90); Python never bundled; repeatable lab timings | `npm run budget`, `perf-lab.json` | **PARTIAL** — Lighthouse NOT MEASURED, field CWV UNVERIFIED, INP not measured | Medium | Lighthouse run; RUM is out of scope (no analytics) |
| ACC-10 Release | PR CI with every gate; rollback + SW kill switch documented; owner authorization | `ci.yml`, `deploy.yml`, `MIGRATION_AND_ROLLBACK.md` | **PARTIAL** — no staging preview environment | Low | PR preview deploys |

- **Learning integrity:** reviewed lessons **0 / 20** authored (BLOCKED: no independent reviewer) · equation tests: every worked example and numeric key recomputed, every formula parses, 37/37 Python outputs exact, 15 lab-math closed-form checks · prerequisite-edge review: 165 `requires` edges acyclic and resolvable, **pedagogy unreviewed** · diagnostic coverage: 64 items, 32/46 competencies (≥ 2 each).
- **User safety:** backup/restore byte-exact (e2e); corrupt/partial/future/missing fixtures pass; data-loss scenarios: none known — unreadable data is quarantined, reset backs up first; Python isolation: worker stops runaway code and cannot read `localStorage`, but shares the origin (network, IndexedDB, caches) — documented.
- **Experience:** keyboard tasks pass (lesson checkpoint at 320 px, all three maps, search, More menu); screen reader **BLOCKED**; mobile overflow 0/59 surfaces; light/dark contrast: axe 0 violations ×59 ×2; cognitive load **not assessed**.
- **Engineering:** lint PASS · content validation PASS · unit **353/353** · e2e **183/183** (+ Python @heavy 4/4) · axe **59/59** both themes · build PASS · budget 71.9 KB · verify:python 37/37 · citations 46 OK / 1 UNVERIFIED / 0 broken · lab LCP 0.97–2.52 s cold at 4× CPU + slow network, CLS 0 · deploy preview: none.
- **Product scope:** top-level tabs deleted 6/6 · teaching preserved (bias–variance, evaluation, 32 ladders all interactive) · English-only PASS · Python tasks: 17 graded exercises + 3 projects + 126 library samples · authored courses: **0 complete**, 8 partial, 3 outline; 20 lessons.

### Outstanding (ordered)
1. **Independent human math review** of the 20 lessons and the `requires` edges (`CONTENT_QA.md` → sign-off procedure).
2. **Screen-reader and learner testing** (`ACCESSIBILITY_REPORT.md` → suggested script).
3. Author Algebra II and Precalculus (outline only), then complete the partial courses — the diagnostic already places learners there.
4. Diagnostic items for the 14 uncovered competencies; calibration once data exists.
5. F-09: self-host Pyodide (+~10–30 MB) or formally accept the CDN risk.
6. Lighthouse run; PR preview deploys.
7. Owner decision D1 (the unshipped local redesign).

## Phase 0 deliverables
| Deliverable | Path |
|---|---|
| Baseline audit (gates, bundle, responsive, data safety, routing, Python, a11y) | `docs/audits/BASELINE_AUDIT.md` |
| Feature inventory + legacy route map (acceptance test 1) | `docs/audits/FEATURE_INVENTORY.md` |
| Migration risks + rollback procedure | `docs/audits/MIGRATION_RISKS.md` |
| Requirement → test traceability + acceptance-test matrix | `docs/audits/TRACEABILITY_MATRIX.md` |
| Reproducible browser harness | `scripts/audit/baseline-harness.mjs` |
| Raw evidence + curated screenshots | `docs/audits/evidence/` |

### Exact Phase 0 commands (reproducible)
```
git worktree add ../fi-upgrade-v31 -b upgrade/v3.1-phase0 origin/main
npm ci
npm run lint && npm test && npm run validate:content && npm run build
npx playwright install chromium          # required once; E2E fails 9/9 without it
npx playwright test --grep-invert @heavy
npm run a11y && npm run a11y:light
npm audit --omit=dev && npm audit
npx vite preview --port 4322 --host 127.0.0.1 &
node scripts/audit/baseline-harness.mjs docs/audits/evidence http://127.0.0.1:4322/formula-intelligence/
```

## Ten most important confirmed risks
1. **Python freezes the tab** on any non-yielding loop — main-thread Pyodide, un-preemptible timeout; user code can reach all learner data (F-01).
2. **Malformed storage crashes pages** — 13/44 cases; 2 blank all of ML mode; no versioning, validation, export, or backup (F-02).
3. **Unknown deep links render blank pages** — already true in production for `#ml/bridge`; tab removal would add six more (F-03).
4. **Unshipped redesign conflicts** with the files Phase 1 must change and with the §3 IA (R-01).
5. **Graphs are pointer-only** — 0/94 nodes focusable, no outline, no skip link (F-04).
6. **No PR CI** — merges are unchecked until they hit `main`'s deploy job (F-05).
7. **English-only removal could delete depth pedagogy** — 305 forked beginner/researcher texts share constructors and a stored record with language (R-04).
8. **Id collision** — `'gold'` is both a tab and a mastery state (R-05).
9. **Mixed-Review interleaving silently orphaned** by removing domain labs (R-06).
10. **Green checks with partial coverage** — axe audits 11/20 surfaces (F-06).

## Proposed first vertical slice
**Algebra I · Unit "Linear relationships"** — three lessons: *Slope as rate of change* → *Slope-intercept form* → *Fitting a line to data*.

Why this one:
- It sits where the target learner's placement uncertainty is highest (algebra readiness) — spec's ultimate success criterion starts there.
- It is the most cross-connected concept available: its edges reach **existing, already-reviewed content** (Bluman regression formulas and the Stats map; linear models in the ML Model Map) and future courses (derivative in Calculus, least squares in Linear Algebra). The slice therefore exercises the typed cross-subject graph (§7) against real nodes, not only greenfield ones.
- It covers two **required** visual labs (slope/derivative; least-squares fitting) with simple, deterministic, accessible text fallbacks.
- Python tasks have exact expected outputs (slope from two points; closed-form `b = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)²` vs `numpy.polyfit` on a fixed dataset, tolerance-graded).
- It reuses the shipped `PredictGate`, `DepthLadder`, `MisconceptionCallout` components, so it tests the lesson renderer rather than rebuilding pedagogy.
- Small enough to author **and independently review** completely — "one excellent slice over hundreds of shells."

Slice acceptance: all 10 lesson elements of §6 present per lesson; numeric checks in tests; diagnostic items (≥2 per competency) for slope/intercept/fit; review metadata filled by a reviewer other than the author.

## Explicit assumptions
1. `origin/main@d1d0ce1` is the source of truth; it matches production (verified by asset hash).
2. The primary checkout's uncommitted redesign is the owner's work in progress and must not be modified or discarded.
3. "English only" removes the Burmese **UI and content**, not the beginner/researcher depth control.
4. Retired domain labs may be archived (unreachable, tree-shaken) rather than deleted, per §4 "archive or remove".
5. No paid services, accounts, or AI tutor are in scope; the AI tutor stays disabled (§2).
6. Screen-reader testing and representative-device performance runs are manual/BLOCKED in this environment and will be reported as such, not inferred.
7. GitHub Pages remains the host; routing stays hash-based (no server rewrites available).

## Owner decisions

D2, D3 and D4 were resolved with the recommended option when the owner authorized Phase 1 and its deployment; **D1 remains open** and was deliberately not acted on, because it concerns the owner's own unshipped local work.
| ID | Decision | Options | Recommendation |
|---|---|---|---|
| **D1** | The unshipped redesign patch (local checkout) | (a) Land its motion tokens + reduced-motion layer + ContextBar; replace its PrimaryNavigation with the §3 IA · (b) land as-is, rework nav later · (c) discard | **(a)** — spec-aligned parts, +1.4 KB gzip, avoids two nav rewrites |
| **D2** | Mixed-Review interleaving once domain labs go | Re-source across lessons · Retire explicitly | Re-source in Phase 8 with ML lessons; hide until then with a logged note |
| **D3** | Domain labs code | Archive (keep, unreachable) · Delete | Archive — `DriverPanel`/`ForecastBandChart` reusable for Projects |
| **D4** | Open a PR for this Phase 0 branch | Yes (docs + harness only, no app changes) · No | Yes |

## Phase 1 — results

| Step | Result | Evidence |
|---|---|---|
| 1. PR CI + bundle budget | **Done.** `ci.yml` runs every gate on PRs; both workflows enforce initial JS ≤ 90 KB gzip | `scripts/check-bundle-budget.mjs`; 79.2 → **73.9 KB** |
| 2. Storage safety, backup-first | **Done.** Shape-checked `loadJSON` with quarantine (originals never destroyed); Dashboard → Your data: byte-exact export, validated import, confirm step, rollback on quota failure | 30 unit tests; e2e `data-safety.spec.js`: all **13/13** baseline crash cases fixed, real download→wipe→file-restore byte-identical |
| 3. Validated routes + legacy map | **Done.** Every tab setter goes through `resolveTab()`; router writes the resolved URL back | 8 unit; e2e `legacy-routes.spec.js` (13). Fixes production `#ml/bridge` blank page |
| 4. English-only step A | **Done.** Language switch removed, `lang` pinned to `en`, depth preserved | e2e `english-only.spec.js`: 0 Myanmar glyphs on every surface for a learner who saved Burmese+Researcher |
| 5. Remove six ML tabs | **Done.** Playground + Evaluation rehomed as Pipeline lessons; domain labs archived; 28 inbound references handled; Mixed-Review unmounted (D2) | e2e: old links open the lesson with content; data tests guard every link |
| 6. Axe on 100% of surfaces | **Done.** Registry-driven: **16/16** (9 Stats + 5 ML + 2 lessons), both themes. Found and fixed 3 violation types already in production | `npm run a11y`, `a11y:light` |
| 7. English-only step B (codemod) | **Not done — next.** 1,125 constructors still carry (invisible) Burmese | — |

Also fixed while verifying: Model Map's detail panel rendered its layer text unstyled when opened directly (pre-existing); five lesson passages sent learners to pages that no longer exist.

### Known regressions and debt introduced deliberately
- **9 Model Map ladders lost their hands-on layer** (they linked to the retired labs). They show an explicit note pointing at their worked example; the ladder audit test pins 19 widgets / 4 links / 9 retired. Restore in Phase 8 by authoring in-place widgets.
- **Mixed-Review interleaving is hidden** until it is re-sourced across lessons (Phase 8).
- **The Sources page still documents the four archived labs' simulated data** (marked "Lab retired — kept for the record").

### Still failing from the baseline (not in Phase 1 scope)
F-01 Python on the main thread (Phase 9) · F-04 graphs keyboard-inaccessible (Phases 2–3) · F-07 ML overflows at 320 px (Phase 2) · F-08 offline (Phase 10) · F-09 Pyodide without SRI (Phase 9).

## Phase 1 — original ordered plan
1. **PR CI** (`pull_request`: lint, unit, content, build, a11y ×2, e2e) — first, so every later step is checked.
2. **Storage safety, backup-first:** per-key shape validators with safe defaults (fixes all 13 crash paths, no key/shape changes); Settings → Export / Import backup with validation and confirmation; fixture tests (acceptance 2).
3. **Validated route table + legacy map** (fixes production `#ml/bridge` blank page; acceptance 1 groundwork).
4. **English-only step A:** remove `LevelLangToggle` language buttons, force `lang='en'`, migrate `ml_mode_prefs_v1` preserving `level`.
5. **Remove six ML tabs:** rewrite 28 inbound references; archive labs; update a11y script; legacy notices.
6. **Axe on 100% of surfaces.**
7. English-only step B (codemod with depth snapshot) — separate PR.

## Release readiness scorecard — end of Phase 1 (§17)
| Req ID | Implemented behavior | Test evidence | Status | Risk | Next action |
|---|---|---|---|---|---|
| ACC-1 Deletion | 6 tabs removed; evaluation + bias–variance preserved as lessons; every old id resolves | `e2e/legacy-routes.spec.js`, `routes.test.js`, ladder/track data tests | **PASS** | Low | — |
| ACC-2 Data-loss | Shape guard + quarantine; byte-exact backup/restore with rollback | `storage.test.js`, `backup.test.js`, `e2e/data-safety.spec.js` | **PASS** for current schema (missing/corrupt/partial/future fixtures). Schema *migration* fixtures: none yet — no migration exists | Medium | Add migration fixtures with the first schema change |
| ACC-3 LA lesson | — | — | NOT STARTED | High | Phase 6 |
| ACC-4 Calculus | — | — | NOT STARTED | High | Phase 7 |
| ACC-5 Diagnostic | — | — | NOT STARTED | High | Phase 4 |
| ACC-6 Python | Unchanged | baseline code inspection | **FAIL** | Critical | Phase 9 (Worker) |
| ACC-7 Offline | — | — | FAIL | Medium | Phase 10 |
| ACC-8 Keyboard/responsive | Lessons keyboard-operable; graphs still pointer-only; ML 320 px overflow remains | `legacy-routes.spec.js` keyboard test | FAIL | High | Phases 2–3 |
| ACC-9 Performance | Budget enforced in CI; initial JS 73.9 KB | `npm run budget` | PARTIAL (no throttled device run) | Medium | Phase 2 |
| ACC-10 Release | PR CI; rollback procedure; owner-authorized deploy | `ci.yml`, MIGRATION_RISKS | PARTIAL — no PR preview environment | Low | Preview deploys |

- **Engineering:** lint PASS · content PASS · unit **253/253** · e2e **52/52** + Python journey 1/1 · axe **16/16** both themes · build PASS · initial JS 73.9 KB gzip.
- **Product scope:** tabs deleted **6/6** · teaching preserved: bias–variance + evaluation (metrics with margins, walk-forward, SHAP/LIME, drift) · English-only UI: PASS (rendered-DOM check), source still bilingual · new curriculum courses: 0 — code-complete: Phase 1 shell changes · content-complete: none · review-complete: none.

## Release readiness scorecard — end of Phase 0 (§17)
| Req ID | Implemented behavior | Test evidence | Status | Risk | Next action |
|---|---|---|---|---|---|
| P0-AUDIT | Baseline audit, inventory, risks, traceability | `docs/audits/*` | PASS | — | Owner review |
| ACC-1 Deletion | Route map designed; not implemented | BASELINE §5 (blank `#ml/bridge`) | FAIL | Critical | Phase 1 step 3, 5 |
| ACC-2 Data-loss | Crash paths catalogued | harness `corrupt` results | FAIL | Critical | Phase 1 step 2 |
| ACC-3 LA lesson | — | — | NOT STARTED | High | Phase 6 |
| ACC-4 Calculus | — | — | NOT STARTED | High | Phase 7 |
| ACC-5 Diagnostic | — | — | NOT STARTED | High | Phase 4 |
| ACC-6 Python | Defect confirmed by code | `pyodideRunner.js:146-161` | FAIL | Critical | Phase 9; interim limitation notice |
| ACC-7 Offline | — | no SW/manifest | FAIL | Medium | Phase 10 |
| ACC-8 Keyboard/responsive | Defects measured | harness overflow + kbd probe | FAIL | High | Phases 2–3 |
| ACC-9 Performance | Python lazy ✔; lab timings recorded | BASELINE §2 | PARTIAL | Medium | Budget check in CI |
| ACC-10 Release | Rollback procedure written | MIGRATION_RISKS | FAIL | High | Phase 1 step 1 |

- **Learning integrity:** reviewed lessons 0 / authored lessons 0 (new curriculum); equation tests: existing content validation only; prerequisite-edge review: not started; diagnostic item coverage: 0.
- **User safety:** backup/restore: does not exist; legacy-fixture migration: not started; data-loss scenarios: 13 crash paths found, 0 silent overwrites; Python isolation: none (main thread).
- **Experience:** keyboard task — graph exploration impossible without pointer; screen reader — BLOCKED (manual); mobile overflow — ML at 320 px; light/dark contrast — axe green on 11/20 surfaces; cognitive load — not yet assessed.
- **Engineering:** lint PASS · unit 213/213 · content PASS · build PASS · e2e 9/9 · a11y PASS (partial coverage) · deploy preview: none · initial JS 81.4 KB gzip · lab LCP 188–492 ms (unthrottled, not field data).
- **Product scope:** tabs deleted 0/6 · Burmese present · Python tasks: 126 samples (109 runnable), no graded exercises · authored courses: 0 of the new curriculum. Status of everything new: **code-complete: none · content-complete: none · review-complete: none · production-released: none.**
