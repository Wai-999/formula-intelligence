# Baseline Audit — Phase 0 (Master Prompt V3.1)

**Audited commit:** `d1d0ce12a1a6c19eedd71e5a77dd0abee5651a30` (`origin/main`, 2026-07-28)
**Production identity:** confirmed — the live site (`https://wai-999.github.io/formula-intelligence/`) serves `assets/index-UAg6a-vp.js`, byte-identical in name to this commit's local build. Everything measured below describes what learners get today.
**Audit date:** 2026-10-23 · **Branch:** `upgrade/v3.1-phase0` (isolated worktree; see "Pre-existing local work" below)
**Environment:** macOS (Darwin 25.6, arm64), Node 24.16.0, npm 11.13.0, Playwright 1.62.0 (Chromium headless shell 151.0.7922.34). Local `vite preview` of the production build, no CPU/network throttling, warm disk cache.

Every claim here is tagged with its evidence type: **[RUN]** command executed and output recorded · **[LIVE]** measured in a real browser · **[CODE]** established by reading source · **[BLOCKED]** could not be executed here, with reproduction steps.

---

## 1. Quality gates

| Gate | Command | Result | Evidence |
|---|---|---|---|
| Install | `npm ci` | PASS | [RUN] |
| Lint | `npm run lint` (oxlint) | PASS — 0 errors, 0 warnings | [RUN] |
| Unit tests | `npm test` (Vitest) | PASS — **213/213**, 16 files, 1.7 s | [RUN] |
| Content validation | `npm run validate:content` | PASS — incl. 10 ML families, 37 graph edges, 32 depth ladders, 126 Python Hub entries | [RUN] |
| Build | `npm run build` | PASS | [RUN] |
| E2E journeys | `npx playwright test --grep-invert @heavy` | PASS — **9/9**, 40 s | [RUN] |
| E2E Python (`@heavy`) | `npm run e2e:python` | NOT RUN — downloads ~10 MB Pyodide from jsDelivr per run; see §6 | [BLOCKED] |
| Accessibility, dark | `npm run a11y` | PASS — 0 WCAG A/AA violations on the **11 pages it visits** | [RUN] |
| Accessibility, light | `npm run a11y:light` | PASS — same 11 pages | [RUN] |
| Dependency audit (shipped) | `npm audit --omit=dev` | PASS — 0 vulnerabilities | [RUN] |
| Dependency audit (all) | `npm audit` | **8 (2 critical, 4 high, 2 moderate)** — all dev-only (Vitest/Vite toolchain: `@vitest/mocker`, `tinypool`, `postcss`, `nanoid`). Not shipped, but executed by CI. | [RUN] |

**First E2E run failed 9/9 in 5 s** — not an app defect: Playwright 1.62 expects Chromium build 1234, which was not installed locally. `npx playwright install chromium` fixed it; the second run passed 9/9. Recorded because a fresh contributor will hit the same wall.

### Coverage gaps hiding behind green results
- **Axe audits 11 of 20 surfaces.** Never audited: Stats — Story Walk, Flashcards, Error Log; ML — **Pipeline** (kept by this spec), Playground, Evaluation, Macro, Micro, Politics. [CODE `scripts/a11y-audit.mjs:23-24`]
- **No CI on pull requests.** `.github/workflows/deploy.yml` triggers only on `push` to `main`, so a PR receives no lint/test/a11y run before merge. Acceptance test 10 ("passing CI report") cannot currently be satisfied for a PR. [CODE]
- **No tests for persistence robustness** — §4 shows 13 crash paths that unit tests don't exercise.

---

## 2. Bundle baseline (gzip) — sets the §13 budget

| Asset | Raw | Gzip | Loaded |
|---|---|---|---|
| `index-*.js` (app shell + Stats map) | 249.3 KB | **77.9 KB** | initial |
| `jsx-runtime-*.js` | 9.0 KB | 3.5 KB | initial (modulepreload) |
| `index-*.css` | 15.4 KB | 3.5 KB | initial |
| Tabler icons CSS | external | — | **initial, render-blocking, third-party origin** (`cdnjs.cloudflare.com`) |
| `python-*.js` (126 Hub samples) | 425.8 KB | 153.1 KB | lazy (Python tab) |
| `ModelMapPage-*.js` | 320.6 KB | 74.3 KB | lazy |
| `PipelinePage-*.js` | 154.5 KB | 36.0 KB | lazy |
| `StoryWalkPage-*.js` | 132.9 KB | 45.7 KB | lazy |
| Pyodide runtime + 6 packages | ~10 MB | — | on first Run, from `cdn.jsdelivr.net` |

**Initial JS ≈ 81.4 KB gzip.** Python data and the Pyodide runtime are correctly absent from the initial bundle (acceptance test 9, first half: PASS). No 3D library exists yet.

### Lab timing — landing page (3 cold runs, local preview, unthrottled)
| Run | LCP | CLS | DOMContentLoaded | Transfer |
|---|---|---|---|---|
| 1 | 188 ms | 0 | 161 ms | 162 KB |
| 2 | 492 ms | 0 | 464 ms | 162 KB |
| 3 | 352 ms | 0 | 324 ms | 162 KB |

These are **lab numbers on a fast machine with no throttling** — they say nothing about field Core Web Vitals and must not be reported as such (spec §13). INP was not measured. A representative-device run (e.g. Moto G-class CPU 4× throttle, Slow 4G) is a Phase 2 task.

---

## 3. Responsive baseline — 20 surfaces × 6 widths [LIVE]

Harness: `scripts/audit/baseline-harness.mjs` (committed; raw output `evidence/baseline-harness-results.json`). Widths 320, 375, 430, 768, 1280, 1440. Each surface loaded by deep link, reloaded, measured for document-level horizontal overflow, error-boundary cards, empty panes, and console errors.

| Result | Detail |
|---|---|
| Crashes / blank panes | **0** across all 120 surface×width loads |
| Console errors | **0** |
| Horizontal overflow | **11 cases — every ML surface at 320 px** (`scrollWidth` 334 vs 320). Common cause: the header's `.mode-switcher` ends at x=336. Stats mode is clean at every width; nothing overflows at ≥375 px. |

Screenshots captured at 375 px and 1280 px for all 20 surfaces (curated subset committed under `evidence/screenshots/`).

---

## 4. Data safety baseline — malformed persisted state [LIVE]

The spec's §11 migration must not start until existing state handling is understood. The harness wrote four malformed shapes into each of 11 keys, one at a time, and loaded a page that reads it.

**13 of 44 cases crash.** Two of them take down an entire mode:

| Key | Malformed shape | Effect |
|---|---|---|
| `ml_mode_prefs_v1` | `null` | **All of ML mode blank** — throws at store-module import (`reading 'level'`), before any boundary mounts |
| `ml_understanding_v1` | `null`, `"string"`, future-version object | **All of ML mode blank / crash card** |
| `bluman_errlog_v1` | `"string"`, `null`, future-version | Error Log crash, no pane |
| `bluman_sessions_v1` | `"string"`, `null`, future-version | Dashboard crash card |
| `bluman_sr_v1` | `null` | Dashboard crash card (`reading 'pct'`) |
| `bluman_quiz_v1` | `null` | Dashboard crash card (`reading 'total'`) |
| `bluman_journal_v1` | `"string"` | Journal crash card (`e.map is not a function`) |

Root cause [CODE `src/lib/storage.js`]: `loadJSON` catches **parse** errors only. Valid JSON of the wrong shape (`null`, a string, a future schema) passes straight into stores that assume structure. There are **no schema versions** inside stored values (version lives only in key names like `_v1`), no validation, no export/import, and no backup. Positive note: in every case the stored value was left **unchanged** — nothing was silently overwritten, so no learner data was destroyed by the crash itself.

---

## 5. Navigation and legacy-link compatibility [LIVE]

| Deep link | Result |
|---|---|
| `#ml/bridge` (worked until Bridge was removed) | **Blank page** — empty title, zero panes, no nav item active, no error. Screenshot: `evidence/screenshots/legacy-ml-bridge-1280.png` |
| `#ml/doesnotexist` | Blank page |
| `#stats/nope` | Blank page |
| `#ml/gold` | Renders Gold (will break the same way once Gold is removed unless mapped) |
| `#garbage` | Recovers to `#stats/map` |
| `#ml` | Recovers to `#ml/pipeline` |

Root cause [CODE `src/lib/hashRoute.js:31,49`]: the parsed tab id is passed to `setMLActiveTab`/`setActiveTab` with no validation against `ML_TABS`/`TABS`; `MLBody` then finds no matching feature and renders nothing. **This defect already exists in production** for any bookmark to the removed Bridge tab, and removing six more tabs (spec §4) would extend it to six more bookmark families. Base path is fine: routing is hash-based, so direct loads under `/formula-intelligence/` never 404 on GitHub Pages.

---

## 6. Python runtime [CODE]; live termination test [BLOCKED]

`src/lib/pyodideRunner.js`:
- **Runs on the main thread**, not a Worker. The 30 s timeout is a `setTimeout` raced against `runPythonAsync`. A CPU-bound loop (`while True: pass`) never yields to the event loop, so the timer can never fire: **the tab freezes and cannot recover without a reload.** This fails acceptance test 6 by construction.
- User code runs in the page's own origin with Pyodide's `js` bridge available — it can read and write `localStorage`, i.e. every learner record.
- Loaded via a `<script>` injected from `cdn.jsdelivr.net` with **no Subresource Integrity** hash; requires network on first use; no offline path.
- Positives: lazy-loaded on first Run; concurrent callers share one load promise; failed loads are retried, not cached; errors are returned rather than thrown; 109/126 samples documented as runnable with reasons for the rest.

**Live repro not executed** here because a non-yielding loop would hang the audit browser. Reproduce: open `#ml/pylab`, run `while True: pass`, observe the tab stop responding beyond 30 s.

---

## 7. Accessibility beyond axe [LIVE]

Keyboard sweep from the Stats Map (25 Tab presses):
- **No skip link.** First 14 stops are header and rail controls before content.
- **0 of 94 graph nodes are keyboard-focusable**; there is **no non-graph outline alternative** (search and the chapter list exist, but there is no way to traverse relationships without a pointer).
- **No `<h1>`** on the Map page; one `<main>` landmark.
- Formulas are Unicode strings (`X̄ = ΣX / n`) with **no MathML and no `aria-label`** — screen-reader speech of notation is unverified.
- Screen-reader task testing (VoiceOver/NVDA): **[BLOCKED]** — no assistive-technology automation in this environment. Manual protocol to follow in Phase 2: VoiceOver + Safari, tasks from spec §10.

Acceptance test 8 (keyboard-only learner can explore a concept without the canvas): **FAIL** at baseline.

---

## 8. Feature-existence check against the spec

| Spec capability | Baseline | Evidence |
|---|---|---|
| English-only UI | **No** — Burmese toggle live; 3,146 Myanmar glyphs on Pipeline, 2,241 on Gold (`evidence/screenshots/burmese-ml-gold-1280.png`) | [LIVE] |
| Beginner/Researcher depth | Yes, but stored together with language in `ml_mode_prefs_v1` | [CODE] |
| Light/dark/**system** theme | Partial — binary toggle; OS preference used only as the initial default, no persistent "System" choice | [CODE] |
| Reduced motion | Partial — 2 files handle `prefers-reduced-motion` | [CODE] |
| Diagnostic / placement | **None** (grep hits are content words like "diagnostic plots") | [CODE] |
| Prealgebra → Calculus / Linear Algebra curriculum | **None** — content is Bluman statistics + ML only | [CODE] |
| Progress export / import / backup | **None** | [CODE] |
| IndexedDB | None (all `localStorage`) | [CODE] |
| Offline (service worker / manifest) | **None**; icons and Pyodide from third-party CDNs | [CODE] |
| Spaced repetition | Yes — SM-2-style (`ef`, `interval`, `reps`) in `useSRStore` | [CODE] |
| Mount strategy | Tabs mount on first visit, then stay alive (`useVisitedTabs`) — the "mount everything" pattern §13 warns about was already replaced | [CODE] |

---

## 9. Pre-existing local work (must be preserved)

The primary checkout at `formula-intelligence-app/` is **25 commits behind `origin/main`** and holds **uncommitted, un-pushed work**: an interface redesign (motion tokens, `ContextBar`, `PrimaryNavigation`) in 13 modified files, 3 new e2e specs, and a packaged patch `_ai-workspace/patches/redesign-phase-0-2.patch` (3 commits based on `d1d0ce1`, reported as passing 213 unit + 29 new e2e tests). It has never reached `origin`. This audit did **not** touch that checkout; all work here happens in a separate worktree. Its navigation model (Stats/ML dual rail) conflicts with spec §3's IA (Home / Learn / Maps / Practice / Projects / Progress / Notebook) — see `MIGRATION_RISKS.md` R-01 for the decision this requires.

---

## 10. Severity-ranked findings

| ID | Severity | Finding | Section |
|---|---|---|---|
| F-01 | **Critical** | Python runs on the main thread; infinite loops freeze the tab, timeout cannot fire; user code can read all learner data | §6 |
| F-02 | **Critical** | 13/44 malformed-storage cases crash; 2 blank all of ML mode; no schema versions, validation, export, or backup | §4 |
| F-03 | **High** | Unknown/legacy tab deep links render a blank page (already broken for `#ml/bridge` in production) | §5 |
| F-04 | **High** | Graph not keyboard-navigable; no non-graph alternative; no skip link | §7 |
| F-05 | **High** | No CI on pull requests | §1 |
| F-06 | High | Axe covers 11/20 surfaces | §1 |
| F-07 | Medium | Every ML surface overflows horizontally at 320 px (header mode switcher) | §3 |
| F-08 | Medium | Render-blocking third-party icon CSS; no offline support | §2, §8 |
| F-09 | Medium | Pyodide loaded without SRI | §6 |
| F-10 | Low | 8 dev-only dependency vulnerabilities (2 critical) in the test toolchain | §1 |
| F-11 | Low | Fresh clone E2E fails until `npx playwright install chromium` is run; not documented | §1 |
