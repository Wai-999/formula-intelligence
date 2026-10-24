# Formula Intelligence

A free, local-first learning platform that takes a learner from uncertain mathematics to data science: algebra, linear algebra, calculus, probability and statistics, machine learning and Python — visual, practised, and stored only on your device.

**Live app:** https://wai-999.github.io/formula-intelligence/

## What is in it

- **Learn** — 11 courses in 9 subjects (Prealgebra → Algebra I/II → Precalculus → Calculus I–III, Linear Algebra, Probability & Statistics, Machine Learning & Data Science, Python for Data Science). **20 lessons are written**; the rest of each course is an honest outline. Every lesson follows the same ten steps — the question, before you start, see it (an interactive lab), why it works, worked examples, predict first, practice, checkpoint, in Python, keep going. Also: learning paths and case studies over the Bluman *Elementary Statistics* formula set, and the ML pipeline lessons.
- **Knowledge Maps** — a Concept map of prerequisites (keyboard-navigable, with an outline view), the 94-formula Bluman map, the 32-model ML map with four-layer depth ladders, and Careers & applications.
- **Practice** — spaced review of skills you have studied, **Mixed practice** that interleaves subjects, formula flashcards, quizzes, three-phase problems, and **graded Python exercises** that run in your browser.
- **Projects** — small end-to-end analyses (Anscombe's quartet, a screening test, PCA) with graded steps, plus a free Python lab.
- **Progress** — skill levels computed from your answers (never from time spent), an optional adaptive **diagnostic** that suggests where to start and says how unsure it is, and an error log.
- **Notebook** — lesson notes and a reflection journal.

Everything is stored in your browser (`localStorage`): no account, no server, no analytics, no AI tutor. Settings → Privacy exports a full backup; unreadable data is set aside, never deleted. After one visit the app works offline (Python excepted). English only; a Beginner/Researcher depth toggle changes how technical explanations are.

**Content status:** all 20 new lessons are AI-drafted and **awaiting independent human math review**; their arithmetic, formulas, Python outputs and citations are machine-checked. See [`docs/CONTENT_QA.md`](docs/CONTENT_QA.md).

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
npm run check:citations               # network: fetch every cited source
```

Evidence scripts: `npm run evidence:screenshots` (3 breakpoints × 2 themes), `npm run evidence:perf` (lab timings), `npm run docs:curriculum` (regenerates the curriculum map).

## Deployment

Pull requests run every check (`.github/workflows/ci.yml`). Pushes to `main` run the same checks and, only if all pass, deploy to GitHub Pages (`.github/workflows/deploy.yml`). Rollback: [`docs/MIGRATION_AND_ROLLBACK.md`](docs/MIGRATION_AND_ROLLBACK.md).

## Documentation

| | |
|---|---|
| Upgrade status, phase results, release scorecard | [`docs/UPGRADE_PROGRESS.md`](docs/UPGRADE_PROGRESS.md) |
| Curriculum map (generated) | [`docs/CURRICULUM_MAP.md`](docs/CURRICULUM_MAP.md) |
| Knowledge-graph schema | [`docs/FORMULA_GRAPH_SCHEMA.md`](docs/FORMULA_GRAPH_SCHEMA.md) |
| Mastery, diagnostic, review, interleaving | [`docs/LEARNING_ASSESSMENT_SPEC.md`](docs/LEARNING_ASSESSMENT_SPEC.md) |
| Python runtime and its limits | [`docs/PYTHON_RUNTIME_SECURITY.md`](docs/PYTHON_RUNTIME_SECURITY.md) |
| Design system | [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) |
| Content QA, accessibility, performance | [`docs/CONTENT_QA.md`](docs/CONTENT_QA.md) · [`docs/ACCESSIBILITY_REPORT.md`](docs/ACCESSIBILITY_REPORT.md) · [`docs/PERFORMANCE_REPORT.md`](docs/PERFORMANCE_REPORT.md) |
| Baseline audit, feature inventory, risks | [`docs/audits/`](docs/audits/) |
| Data provenance, ML-mode internals | [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) · [`docs/ML_MODE_README.md`](docs/ML_MODE_README.md) |
