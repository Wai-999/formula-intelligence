# Upgrade Progress — Master Prompt V3.1

**Current phase:** 0 (Baseline audit) — **complete, awaiting owner decisions before Phase 1.**
**Branch:** `upgrade/v3.1-phase0` from `origin/main@d1d0ce1` · worktree `../fi-upgrade-v31` (the primary checkout's uncommitted redesign work is untouched).
**Merge/deploy policy:** PRs only; nothing merges to `main` (auto-deploys to Pages) without explicit owner approval.

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

## Decisions needed from the owner (blocking Phase 1)
| ID | Decision | Options | Recommendation |
|---|---|---|---|
| **D1** | The unshipped redesign patch (local checkout) | (a) Land its motion tokens + reduced-motion layer + ContextBar; replace its PrimaryNavigation with the §3 IA · (b) land as-is, rework nav later · (c) discard | **(a)** — spec-aligned parts, +1.4 KB gzip, avoids two nav rewrites |
| **D2** | Mixed-Review interleaving once domain labs go | Re-source across lessons · Retire explicitly | Re-source in Phase 8 with ML lessons; hide until then with a logged note |
| **D3** | Domain labs code | Archive (keep, unreachable) · Delete | Archive — `DriverPanel`/`ForecastBandChart` reusable for Projects |
| **D4** | Open a PR for this Phase 0 branch | Yes (docs + harness only, no app changes) · No | Yes |

## Phase 1 — ordered plan (after D1–D3)
1. **PR CI** (`pull_request`: lint, unit, content, build, a11y ×2, e2e) — first, so every later step is checked.
2. **Storage safety, backup-first:** per-key shape validators with safe defaults (fixes all 13 crash paths, no key/shape changes); Settings → Export / Import backup with validation and confirmation; fixture tests (acceptance 2).
3. **Validated route table + legacy map** (fixes production `#ml/bridge` blank page; acceptance 1 groundwork).
4. **English-only step A:** remove `LevelLangToggle` language buttons, force `lang='en'`, migrate `ml_mode_prefs_v1` preserving `level`.
5. **Remove six ML tabs:** rewrite 28 inbound references; archive labs; update a11y script; legacy notices.
6. **Axe on 100% of surfaces.**
7. English-only step B (codemod with depth snapshot) — separate PR.

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
