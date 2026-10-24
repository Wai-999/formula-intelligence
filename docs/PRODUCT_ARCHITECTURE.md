# Product architecture

Formula Intelligence is a static, local-first single-page app on GitHub Pages: no server, no accounts, no analytics. Everything a learner does is stored in their browser.

## Stack

| Concern | Choice | Why (and what was rejected) |
|---|---|---|
| UI | React 19, plain CSS with tokens | Existing stack; no measured reason to change (§13). |
| State | Zustand 5, one store per concern | Existing; small, no provider tree. |
| Graphs | D3 7 (force layouts, scales) | Existing Formula/Model maps; labs use hand-written SVG with shared helpers (`src/features/labs/plot.js`). |
| Math | KaTeX **0.19.0, pinned** (new in this upgrade), `htmlAndMathml` output | MathML gives screen readers real math; loaded lazily with lesson chunks only, never in the initial bundle. |
| Build | Vite 8, oxlint | Existing. |
| Tests | Vitest + jsdom, Playwright + axe-core | Existing; expanded (see `docs/ACCESSIBILITY_REPORT.md`, `docs/CONTENT_QA.md`). |
| Python | Pyodide 0.28.3 from jsDelivr, **in a Web Worker** | Main-thread Pyodide froze the tab (F-01). See `docs/PYTHON_RUNTIME_SECURITY.md`. |
| Types | JavaScript + **validated schema tests**, not TypeScript | A TS migration of ~400 files was estimated at several days with no user-visible gain; the curriculum's invariants (ids, references, acyclicity, ten lesson elements, review metadata) are enforced by `src/data/curriculum/__tests__/curriculum.test.js` and `scripts/validate-content.mjs` instead. Revisit if the contributor count grows. |
| Storage | `localStorage` with versioned envelopes | IndexedDB **not justified**: the largest record (evidence, capped at 10 000 entries) is under 1 MB; synchronous reads keep first paint simple. Revisit if notes or code drafts grow past ~2 MB. |
| Routing | Hash routes | GitHub Pages cannot rewrite paths; hash routing needs no server and keeps every old link working. |

## Information architecture — `src/app/pages.js`

Seven sections; each page has one id `section/page`, one title and one `<h1>`.

| Section | Pages |
|---|---|
| Home | Home (continue, review, diagnostic, gaps, progress, project) |
| Learn | Courses · Course (param) · Lesson (param) · Learning paths · Case studies · ML pipeline |
| Knowledge Maps | Concept map (param) · Formula map · Model map · Careers & applications |
| Practice | Review (formula flashcards) · **Mixed practice** · Quiz · Problems · Code exercises · Python library |
| Projects | Projects · Python lab |
| Progress | Overview · Diagnostic · Error log |
| Notebook | Journal · Lesson notes |
| — | Settings · Sources |

The registry drives the navigation, the breadcrumb, `document.title`, global search, the axe audit, the English-only e2e sweep and the 320 px overflow sweep, so a new page is covered by all of them automatically.

**Routing** (`src/lib/hashRoute.js`): `#section/page[/param]`. Legacy hashes (`#stats/<tab>`, `#ml/<tab>`) map through each page's `legacy` field; retired tabs map to their new home with a notice (`RETIRED_ML_TABS` in `src/store/useUIStore.js`). The initial hash is applied before the first render so deep links and the skip link work on load. Unknown pages and unknown lesson ids render an explanation, never a blank page.

## Shell — `src/components/layout/`

- `AppShell` — skip link → header (brand, search, depth toggle, focus mode, theme, settings) → `PrimaryNav` → `main#main-content` (`PageHeader` + `PageHost`) → `BottomNav` (phones) → toasts, search dialog, shortcuts overlay.
- `PrimaryNav` — labelled sidebar ≥ 1024 px (collapsible, remembered), icon rail 768–1023 px, hidden < 768 px where `BottomNav` takes over (Home, Learn, Maps, Practice, More).
- `PageHeader` — breadcrumb, the page's single `<h1>` (focused after navigation), section tabs, and `document.title`.
- **Keep-alive** (`src/hooks/useKeepAlive.js`): the five most recently used pages stay mounted (hidden) so a map's zoom or a half-written answer survives a detour; older ones unmount. Hidden panes are `position: relative; overflow: hidden` so their off-screen helpers cannot stretch the document.
- Focus mode hides the navigation; `f` toggles it. Keyboard shortcuts: `src/lib/shortcuts.js`.

## Content and learning data flow

```
catalog.js ─┐                     ┌─> Courses / Course pages
lessons/*.js (lazy) ─> LessonPage ─┼─> ItemCard ─> useLearningStore.record()
competencies.js ─┘                 └─> LabHost ─> labs/registry.js (lazy per lab)
concepts.js + formulas.js + lessons + projects + applications ─> graph.js ─> Concept map, Careers & applications
evidence ─> mastery.js (computed) ─> Home, Progress
evidence ─> reviewSchedule.js (cards) ─> Home review
diagnostic itemBank ─> diagnostic.js ─> useDiagnosticStore ─> placement ─> Home "next lesson"
```

- Lesson bodies are separate chunks (`load: () => import(...)`), so the course list never loads lesson text.
- The page-meta resolvers (lesson and course titles for the header) register lazily, keeping the curriculum out of the initial bundle (initial JS 71.9 KB gzip; budget 90 KB).
- Global search (`src/lib/searchIndex.js`) is built on first open: pages, formulas, models, ML lessons, curriculum lessons/courses/concepts, code exercises and projects.

## Stores — `src/store/`

| Store | Key(s) | Holds |
|---|---|---|
| `useLearningStore` | `fi_learning_v1`, `fi_lessons_v1`, `fi_notes_v1` | evidence + review cards; lesson visits/sections/completion; notes |
| `useDiagnosticStore` | `fi_diagnostic_v1` | first-run choice, every attempt, placement |
| `useWorkStore` | `fi_pyex_v1`, `fi_projects_v1` | code drafts and results; project steps |
| `useThemeStore` | `fi_theme_v1`, `fi_motion_v1` | system/light/dark; system/reduce motion |
| `useUIStore` | `fi_nav_v1` | current page, navigation collapse, search/focus state |
| Legacy stores | `bluman_*`, `ml_*`, `py_lab_v1` | formula-map mastery, flashcards, quiz, journal, ML understanding — unchanged keys and shapes |

New records use **versioned envelopes** (`src/lib/versioned.js`): `{ schemaVersion, ... }` with ordered migrations; corrupt or future-version data is **quarantined** (copied aside, never destroyed) and the app starts clean. See `docs/MIGRATION_AND_ROLLBACK.md`.

## Labs — `src/features/labs/`

20 labs in `registry.js`, each lazy. 19 are built on a shared kit: `LabFrame` (title, controls, plot, live numeric readout, and a **numbers view** — a table/text alternative to the picture), `Slider`, `Segmented`, `Plot`. The 20th, bias–variance, is the rehomed ML Playground (text readouts of training and validation error, no table view). The math lives in helpers (`linalg.js`, `calc.js`, `optimize.js`, `prob.js`, `fit.js`) tested against closed-form cases in `src/features/labs/__tests__/labMath.test.js`, separately from the drawing.

## Python — `src/lib/pyodideRunner.js`, `src/lib/python/pyWorker.js`

Worker client with `runPython`, `gradePython`, `stopPython`; timeout or Stop terminates the worker and a fresh one starts on the next run. Grading runs tests in a fresh namespace with numeric tolerances. Full details and limits: `docs/PYTHON_RUNTIME_SECURITY.md`.

## Offline — `src/sw/serviceWorker.template.js`

Generated at build (`vite.config.js` → `serviceWorker()` plugin) with this build's exact file list (181 files, 2.64 MB). Navigations network-first with the cached shell as fallback; built assets cache-first; the icon font stale-while-revalidate; Pyodide and external links network-only. Registered only in production builds. No `skipWaiting`: an open tab keeps the build it started with. `public/manifest.webmanifest` makes it installable.

## Deployment

`.github/workflows/ci.yml` (every PR) and `deploy.yml` (push to `main`) run the same gates — lint, content validation, unit tests, build, bundle budget, Python output verification, axe in both themes, e2e, Python e2e — and only `deploy.yml` publishes `dist/` to GitHub Pages.
