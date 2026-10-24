# Formula Intelligence

An interactive relationship map for Bluman's *Elementary Statistics* — 94 formulas across 13 chapters, connected by prerequisite, extension, and application links, with a full study toolkit built around it.

**Live app:** https://wai-999.github.io/formula-intelligence/

## Features

- **Map** — a hierarchical, curriculum-ordered graph of every formula. Click a node for its description, real-world usage, prerequisites, dependents, and inventor. Trace a formula's full prerequisite chain with an animated reveal, or highlight its immediate neighborhood.
- **Learning Path** — pick a target formula and get a step-by-step path from foundational prerequisites up to it, with a mini graph and mastery tracking per step.
- **Story Walk** — nine case-study investigations (public health, business intelligence, product analytics, and more) that walk through real decisions and apply formulas in context.
- **Flashcards** — spaced-repetition review across all 94 formulas, filterable by chapter or due-for-review status.
- **Quiz** — mixed-format quiz mode with running score and streak tracking.
- **Practice** — three-phase problems (identify the right formula → solve it step by step → interpret the result) for every formula, with real worked scenarios and computed answers.
- **Dashboard** — mastery overview across all chapters, quiz accuracy, and review load, plus **Your data**: download a backup of all progress and restore it later or on another device.
- **Error Log** — every wrong answer is logged automatically; classify the mistake type and track recurring patterns.
- **Journal** — end-of-session reflection prompts plus a full knowledge-state map colored by mastery level.

All progress is stored locally in the browser (`localStorage`) — no account or backend required. Saved data that can't be read (for example after a corrupted write) is set aside rather than deleted, and is included in every backup.

## ML mode

A second, parallel mode — switch via the toggle in the header. Five tabs: the ML pipeline (with embedded lessons on bias–variance and on evaluating a model — metrics with uncertainty, walk-forward validation, SHAP/LIME, drift), a 32-model relationship map, the Python Hub, a Python Lab for your own notebooks, and Sources & data provenance. Every page has a Beginner/Researcher depth toggle. The app is English-only. Older links to retired tabs (Playground, Evaluation, the Gold/Macro/Micro/Politics labs, the Stats↔ML Bridge) still open the right place. No live data — every figure is either cited to `docs/research/ML-Research-Reference.md` or explicitly disclosed as illustrative; see [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md). Architecture and extension guide: [`docs/ML_MODE_README.md`](docs/ML_MODE_README.md).

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [D3.js](https://d3js.org/) for the force/hierarchical graph rendering, zoom, and drag
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Pyodide](https://pyodide.org/) (loaded on demand from a CDN) to run Python Hub samples in the browser

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build in `dist/`; `npm run preview` serves that build locally.

### Checks

```bash
npm run lint && npm run validate:content && npm test
npm run build && npm run budget       # initial-load JS must stay under 90 KB gzip
npx playwright install chromium       # once per Playwright version — without it every e2e test fails at launch
npm run a11y && npm run a11y:light    # axe, every surface, both themes
npm run e2e                           # end-to-end journeys (npm run e2e:python for the Pyodide journey)
```

## Deployment

Pull requests run every check above (`.github/workflows/ci.yml`). Pushes to `main` run the same checks and, only if all pass, deploy to GitHub Pages (`.github/workflows/deploy.yml`).

Upgrade status and audits for the V3.1 learning-platform plan: [`docs/UPGRADE_PROGRESS.md`](docs/UPGRADE_PROGRESS.md).
