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
- **Dashboard** — mastery overview across all chapters, quiz accuracy, and review load.
- **Error Log** — every wrong answer is logged automatically; classify the mistake type and track recurring patterns.
- **Journal** — end-of-session reflection prompts plus a full knowledge-state map colored by mastery level.

All progress is stored locally in the browser (`localStorage`) — no account or backend required.

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [D3.js](https://d3js.org/) for the force/hierarchical graph rendering, zoom, and drag
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Framer Motion](https://www.framer.com/motion/) for UI transitions

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build in `dist/`; `npm run preview` serves that build locally.

## Deployment

Pushes to `main` automatically build and deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.
