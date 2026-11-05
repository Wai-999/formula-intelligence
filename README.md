# Formula Intelligence

A free, local-first learning platform that takes a learner from uncertain mathematics to data science: algebra, linear algebra, calculus, probability and statistics, machine learning, Python and C++ — visual, practised, and stored only on your device. Since V5 it also helps a student prepare for Ohlone College's Data Science A.S. and transfer to SJSU, CSU East Bay or UC, with every official fact sourced and dated.

**Live app:** https://wai-999.github.io/formula-intelligence/

## What is in it

Five places, one job each (V4: Learn it → Practice it → Apply it → Explain it):

- **Home** — **Resume where I stopped** reopens the exact lesson step you saved (lessons save your place as you go, and **Save my place** / **Finish study session** do it on purpose); first-timers choose a placement check, Prealgebra, or a look around. How it works and what is stored: [`docs/study-continuity/`](docs/study-continuity/).
- **Learn** — 15 courses in 10 subjects, including a Computer Science (C++) track: C++ fundamentals, object-oriented C++, data structures and discrete structures. **35 lessons are written**; the rest of each course is an honest outline. **One next-action engine** decides what comes next everywhere (Home, course pages, the end of each lesson, My Progress, the study-session summary), with the reason and a time estimate: a saved place first; after repeated wrong answers, a 5-minute **bridge** to the part of an earlier lesson the mistakes come from (the chain rule → composite functions); otherwise the next written lesson. When a course's written lessons are done, it says **“Next lesson not written yet: …”**, suggests practising that course's skills until they are shown, and keeps the next course one click away — never skipping unwritten material silently, never back to the catalog or to Prealgebra. Rules: [`docs/learning-8020/LEARNING_FLOW_SPEC.md`](docs/learning-8020/LEARNING_FLOW_SPEC.md). **Learn → Courses → Your learning path** shows the whole route, optional applied tracks (data science, business, finance, physics, environment) and an informational CSU preparation view. Map: [`docs/LEARNING_PATH_MAP.md`](docs/LEARNING_PATH_MAP.md). Every lesson is one page in six steps: *why it matters* (a real decision), *understand* (derivations and assumptions behind "Go deeper"), *see it* (an interactive lab with a numbers view), *try it* (in five priority lessons, a **faded example** first), *use it* (a real-life task, Python or C++ optional, and in 28 lessons multi-step real-world problems — 38 in all, many continuing a project's running case), *check understanding* (with *Explain it back* in those 28 lessons, and a completion summary with what you have shown, what is still wrong and the next step). Wrong answers say what went wrong, where to look and, after a second try, the full reasoning; choice options are shown in a fixed shuffled order so the right one is not always first. **Try a question now** jumps straight to practice. **See connections** opens the concept map at the right spot. Also: the placement check (start earlier / start here / skip ahead, and an explicit “not enough evidence” result), the ML pipeline lessons, the maps (concepts, the 94 Bluman formulas, 32 ML models, careers), and **Ohlone Data Science prep** (under Courses): each required Ohlone course, what this site teaches for it, and what SJSU, CSU East Bay and UC campuses accept according to ASSIST — sourced, dated, and labelled verified, earlier-year or not yet verified. *Formula Intelligence is a self-study tool. It does not award college credit, determine college placement, waive prerequisites, or guarantee transfer admission.*
- **Practice** — *Review*: skills due on an expanding schedule, then a mixed set across subjects; *Formula drills*: flashcards, quiz and step-by-step problems for the statistics formulas.
- **Apply** — seven real-world projects (household budget, restaurant waste, local weather anomalies with Met Office data, cleaning a sensor log in Python and C++, cleaning the Palmer Penguins dataset, price and demand with a train/test check, classification and the cost of mistakes) plus case studies, graded Python exercises with a **no-code version** of each, and a Python lab.
- **My Progress** — skills judged from your answers, weak areas, **your learning signals** (practice success, unassisted transfer, 14-day retention, projects completed — for you only), notebook, error log and settings.

Everything is stored in your browser (`localStorage`): no account, no server, no analytics, no AI tutor, no streaks or badges. My Progress → Settings exports a full backup; unreadable data is set aside, never deleted. After one visit the app works offline (Python excepted). English only; explanations default to beginner level, with more depth in Settings.

**Content status:** all 35 lessons, and the real-world problems and explain-back prompts, are AI-drafted and **awaiting independent human math review**; their arithmetic, formulas, Python and C++ outputs and citations are machine-checked. See [`docs/CONTENT_QA.md`](docs/CONTENT_QA.md). V4 design research and decisions: [`docs/v4/`](docs/v4/).

## Tech stack

React 19 + Vite 8 · Zustand 5 · D3 7 · KaTeX 0.19 (MathML output) · Pyodide 0.28.3 in a Web Worker · Vitest, Playwright, axe-core. Architecture: [`docs/PRODUCT_ARCHITECTURE.md`](docs/PRODUCT_ARCHITECTURE.md).

## Running locally

```bash
npm install
npm run dev
```

`npm run build` produces `dist/`; `npm run preview` serves it (the service worker only registers in a production build).

### Checks

```bash
npm run lint && npm run validate:content && npm test
npm run build && npm run budget       # initial-load JS must stay under 90 KB gzip
npm run verify:python                 # needs python3 with numpy + matplotlib
npx playwright install chromium       # once per Playwright version
npm run a11y && npm run a11y:light    # axe on every page, both themes
npm run e2e                           # end-to-end (npm run e2e:python for the Python worker)
npm run validate:college              # academic data: official sources, years, statuses
npm run verify:cpp                    # compile and run every C++ program (needs g++ or clang++)
npm run check:citations               # network: fetch every cited source
```

Evidence scripts: `npm run evidence:screenshots` (3 breakpoints × 2 themes), `npm run evidence:perf` (lab timings), `npm run docs:curriculum` (regenerates the curriculum map), `npm run docs:path` (regenerates the learning path map from the engine), `npm run docs:college` (regenerates the academic evidence and coverage reports).

Icons are a self-hosted subset of Tabler Icons. After using a new `ti-…` class, run `npm run icons` (needs `pip install fonttools brotli`); a unit test fails until you do.

## Deployment

Pull requests run every check (`.github/workflows/ci.yml`). Pushes to `main` run the same checks and, only if all pass, deploy to GitHub Pages (`.github/workflows/deploy.yml`). Rollback: [`docs/MIGRATION_AND_ROLLBACK.md`](docs/MIGRATION_AND_ROLLBACK.md).

## Documentation

| | |
|---|---|
| Upgrade status, phase results, release scorecard | [`docs/UPGRADE_PROGRESS.md`](docs/UPGRADE_PROGRESS.md) |
| V5.1: Ohlone and transfer preparation — baseline and decisions, academic evidence, curriculum coverage, quality and security, release | [`docs/major-prep/`](docs/major-prep/) |
| V4: audit, course research, simplification plan, curriculum routes, lesson template, applied projects, test report | [`docs/v4/`](docs/v4/) |
| Curriculum map (generated) | [`docs/CURRICULUM_MAP.md`](docs/CURRICULUM_MAP.md) |
| Learning path map (generated): route, transitions, tracks | [`docs/LEARNING_PATH_MAP.md`](docs/LEARNING_PATH_MAP.md) |
| Continuous learning pathways: audit, decisions, coverage, tests, release | [`docs/CONTINUOUS_LEARNING_UPGRADE.md`](docs/CONTINUOUS_LEARNING_UPGRADE.md) |
| 80/20 learning upgrade: baseline audit, scorecard, teaching rubric, course gap map (generated), learning flow, applied-problem QA, usability journeys, tests, release, backlog | [`docs/learning-8020/`](docs/learning-8020/) |
| Knowledge-graph schema | [`docs/FORMULA_GRAPH_SCHEMA.md`](docs/FORMULA_GRAPH_SCHEMA.md) |
| Mastery, diagnostic, review, interleaving | [`docs/LEARNING_ASSESSMENT_SPEC.md`](docs/LEARNING_ASSESSMENT_SPEC.md) |
| Python runtime and its limits | [`docs/PYTHON_RUNTIME_SECURITY.md`](docs/PYTHON_RUNTIME_SECURITY.md) |
| Design system | [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) |
| Content QA, accessibility, performance | [`docs/CONTENT_QA.md`](docs/CONTENT_QA.md) · [`docs/ACCESSIBILITY_REPORT.md`](docs/ACCESSIBILITY_REPORT.md) · [`docs/PERFORMANCE_REPORT.md`](docs/PERFORMANCE_REPORT.md) |
| Baseline audit, feature inventory, risks | [`docs/audits/`](docs/audits/) |
| Data provenance, ML-mode internals | [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) · [`docs/ML_MODE_README.md`](docs/ML_MODE_README.md) |
