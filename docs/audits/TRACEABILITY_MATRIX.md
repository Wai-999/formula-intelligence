# Requirement → Test Traceability Matrix

Status values: PASS · FAIL · PARTIAL · BLOCKED · NOT STARTED. "Baseline" = `d1d0ce1`, measured in Phase 0. A requirement moves to PASS only when its named test exists and passes in CI.

## A. Prompt acceptance tests (spec "Prompt acceptance tests")

| # | Test | Baseline | Evidence | Planned test (phase) |
|---|---|---|---|---|
| 1 | Deletion: remove 6 ML tabs, keep evaluation teaching, old ids resolve | **PASS (Phase 1)** — was FAIL | `#ml/bridge` already blank (BASELINE §5); no route table | e2e `legacy-routes.spec.js` over FEATURE_INVENTORY §2 map; unit: every content link targets a live route (P1) |
| 2 | Data-loss: export → migrate → reload → restore exactly; missing/corrupt/partial/future data | **PASS for current schema (Phase 1)** — was FAIL; migration fixtures pending first schema change | No export/import; 13/44 malformed cases crash (BASELINE §4) | `storage-fixtures.test.js` per key × 5 shapes; e2e export/import round-trip with byte compare (P1) |
| 3 | Linear algebra lesson: derivation, assumptions, counterexample, lab, exercise, Python, cited source, independent check | **NOT STARTED** | No LA content | Lesson schema validator + numeric checks + review metadata (P6) |
| 4 | Calculus: single- vs multivariable notation, numeric checks vs known cases | **NOT STARTED** | No calculus content | Finite-difference vs analytic derivative tests (P7) |
| 5 | Diagnostic: no mastery from one lucky answer; explains recommendation | **NOT STARTED** | No diagnostic engine | Engine unit tests: ≥2 independent items per competency before "likely mastered"; explanation strings snapshot (P4) |
| 6 | Python: infinite loop terminates; runtime recovers; permissions documented | **FAIL** | Main-thread Pyodide, `setTimeout` race cannot preempt (BASELINE §6, CODE) | e2e `@heavy`: `while True: pass` stopped ≤ timeout, next run OK (P9) |
| 7 | Offline: core learning works offline after install; Python discloses limits | **FAIL** | No service worker/manifest; CDN icons + Pyodide | e2e with `context.setOffline(true)` after first load (P10) |
| 8 | Responsive/keyboard: complete a lesson and explore a concept without canvas at narrow width | **FAIL** | 0/94 graph nodes focusable, no outline view, no skip link; ML overflows at 320 px (BASELINE §3, §7) | e2e keyboard-only task at 375 px; overflow sweep (scripts/audit/baseline-harness.mjs) in CI (P2, P3) |
| 9 | Performance: Python/3D excluded from landing bundle; repeatable benchmark conditions | **PARTIAL** | Python excluded ✔ (BASELINE §2); conditions now documented for lab runs; no throttled/representative-device run yet | CI bundle-budget check (initial JS ≤ 90 KB gz); Lighthouse CI on throttled profile (P2) |
| 10 | Release: CI report, rollback procedure, staging preview, explicit deploy authorization | **PARTIAL (Phase 1)** — PR CI + rollback + authorization; no preview env | No PR CI (deploy.yml push-to-main only); rollback procedure now written (MIGRATION_RISKS) | `pull_request` workflow; PR preview artifact; deploy stays owner-gated (P1) |

**Fail-closed:** tests 1, 2, 6 are critical and FAIL at baseline. No feature depending on them may be called production-ready until they pass.

## B. Product requirements (spec §2–§14)

| Req | Requirement | Affected modules | Baseline | Test / evidence target |
|---|---|---|---|---|
| R-IA | Primary nav: Home, Learn, Knowledge Maps, Practice, Projects, Progress, Notebook | `AppShell`, `IconRail`, `MLIconRail`, `useUIStore`, `useMLUIStore` | NOT STARTED (decision R-01) | e2e nav landmarks + `aria-current` per surface |
| R-ML-TABS | Remove playground/evaluation/gold/macro/micro/politics as top-level tabs | `ML_TABS`, `MLBody`, 28 inbound refs | **PASS** | Acceptance 1 |
| R-ML-PRESERVE | Evaluation topics + bias–variance preserved in lessons | `features/ml/evaluation`, `playground` | **PASS** (covers leakage via walk-forward, regression metrics with uncertainty, interpretability, drift; NOT yet taught: cross-validation, confusion matrix, precision/recall/F1, ROC-AUC/PR-AUC, calibration, fairness — Phase 8) | Lesson inventory test: each listed topic has a lesson id |
| R-EN | English-only UI; depth control preserved | `mlContent.js`, 40 `useT` files, `LevelLangToggle`, `ml_mode_prefs_v1` | **PASS (UI)**; source cleanup pending (step B) | Zero Myanmar-script chars in `src/` + rendered-DOM check; depth snapshot (R-04) |
| R-THEME | Light/dark/**system**, persistent, no flash | `useThemeStore`, `index.html` | PARTIAL (no System option) | e2e theme matrix incl. `emulateMedia` |
| R-MOTION | Reduced motion respected | CSS | PARTIAL (2 files) | Reduced-motion computed-style sweep (exists in redesign patch) |
| R-A11Y | WCAG 2.2 AA core flows | all | PARTIAL — axe **16/16** surfaces green; keyboard/screen-reader tasks still FAIL/BLOCKED | axe on 100% of surfaces, both themes |
| R-KBD | Graph keyboard nav + non-graph outline | `GraphCanvas`, `MLRelationshipMap` | FAIL | Acceptance 8 |
| R-STORE | Versioned storage, export/import, validation, recovery | `storage.js`, all stores | PARTIAL — validation, quarantine, export/import done; in-value schema versions not yet | Acceptance 2 |
| R-PY | Worker-isolated Python, cancellation, allowlist, honest docs | `pyodideRunner.js`, Python Hub/Lab | FAIL | Acceptance 6; `docs/PYTHON_RUNTIME_SECURITY.md` |
| R-CURR | Curriculum schema; Prealgebra→Calculus/LA; vertical slice first | new `src/curriculum/` | NOT STARTED | Schema validator; slice acceptance (UPGRADE_PROGRESS) |
| R-GRAPH | Typed versioned graph; no dangling links; acyclic `requires` | `scripts/validate-content.mjs`, data | PARTIAL (validator exists for ML graph) | Extend validator: cycle detection on prerequisite edges |
| R-DIAG | Diagnostic with uncertainty + override | new | NOT STARTED | Acceptance 5 |
| R-MASTERY | Multi-evidence mastery; documented SR scheduler | `useMasteryStore`, `useSRStore` | PARTIAL (SM-2 exists, untested as spec'd) | Scheduler property tests |
| R-PERF | Budgets from baseline; Python/3D lazy | build | PARTIAL | Acceptance 9 |
| R-CI | PR CI + gated deploy | `.github/workflows` | **PASS** | Acceptance 10 |
| R-OFFLINE | Offline core learning where advertised | new SW | FAIL | Acceptance 7 |
