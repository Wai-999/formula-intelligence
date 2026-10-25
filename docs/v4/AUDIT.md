# V4 audit — the product as it stood before V4

Baseline: `main@a103f32`, the V3.1 release live at https://wai-999.github.io/formula-intelligence/ since 2026-10-24 (verified that day in a browser: new build served, service worker active, lesson math, maps, diagnostic, legacy redirects and in-browser Python working). Screenshots of this baseline: `docs/audits/evidence/screenshots/v31/` (10 pages × 320/768/1280, dark, plus light at 320/1280). Every finding below was observed in that build or read from its code; nothing is inferred from the README.

## The V4 brief versus the repository

The V4 brief was written from the repository's *older* README and lists "likely risks to verify". Several were already fixed by V3.1:

| Brief's likely risk | Observed in the baseline |
|---|---|
| Two parallel Stats/ML modes | **Already gone.** One shell, seven sections (`src/app/pages.js`). |
| ML tabs Playground, Evaluation, Gold, Macro, Micro, Politics | **Already removed** (V3.1 Phase 1); evaluation and bias–variance live as lessons; old links redirect with a notice. |
| Burmese controls and translations | **Already gone** (English-only, V3.1). |
| Formula map as the default start | **Not the default**: Home is. But Knowledge Maps is a top-level section with four maps. |
| Duplicate quiz/practice/flashcard entry points | **Confirmed** — see below. |
| Complex depth switch | **Confirmed**: a Beginner/Researcher toggle sits in the header on every page. |
| Analytics spread over dashboard/journal/error log | **Confirmed**: Progress (Overview, Diagnostic, Error log) and Notebook (Journal, Lesson notes) are separate sections. |

## Navigation

- **7 top-level sections, 24 listed pages** (V4 allows 5): Home (1) · Learn (4) · Knowledge Maps (4) · Practice (6) · Projects (2) · Progress (3) · Notebook (2), plus Settings and Sources outside the sections.
- **Header: 6 controls** besides the brand — search, the two-button depth toggle, focus mode, theme, settings.
- **Python appears in three places**: Practice → Code exercises, Practice → Python library, Projects → Python lab.
- **Review appears in three places**: Home's due-skill review session, Practice → Review (the Bluman formula flashcards, a separate SM-2 schedule), Practice → Mixed practice.
- **Formula practice is split across three tabs** (Review/flashcards, Quiz, Problems), all over the same 94 Bluman formulas.
- Case studies (Story Walk — applied investigations) sit under Learn, although they are application work.

## Home

- First run: three equal options (diagnostic, start from Prealgebra, explore), one marked primary. **A new learner reaches a lesson in 2 clicks** (Start from Prealgebra → the first lesson on the course page).
- Returning learner: a "continue" hero with one primary button, then **five cards** (due review, diagnostic, gaps, progress, project) competing below it.

## Lessons

- 20 authored lessons, each with **ten numbered sections** (question, before you start, see it, why it works, worked examples, predict, practice, checkpoint, Python, keep going) and a 10-step progress bar.
- Derivations, assumptions and domain are always expanded, between "See it" and the worked examples.
- **No lesson is framed around a real decision**; the opening "question" is usually a concrete puzzle (balance scales, a photo shear), not a choice someone has to make. Real-world use appears as transfer items.
- Connections (concepts, Formula-map and Model-map nodes, next lessons) are at the **bottom**, in section 10, plus "Builds on" links in the sidebar. There is no on-demand "see connections" control near the top.
- All 20 are AI drafts awaiting independent human math review (labelled on the page).

## Practice, application, Python

- 17 graded code exercises, each downloadable as a `.py` with its tests; but **no non-coding path** for a learner who cannot yet code (only the two predict-output and one interpret exercise can be done without writing code).
- 3 projects (Anscombe — real data; screening — synthetic; PCA — synthetic). None follows the full question → provenance → assumptions → method → code → interpretation → decision → limitations chain; none covers budgets, sales/waste, weather, data cleaning, train/test regression or failure costs.

## Diagnostic

- Adaptive, skippable, uncertainty shown, override and retake available. The result offers "accept" and "choose another course", but **not the "start earlier / start here / skip ahead"** choice V4 asks for.

## Progress and measurement

- Mastery per skill with reasons; gaps; backup/restore in two places (Settings → Privacy and Progress → Overview → Your data).
- **None of the four V4 learning signals is computed** (practice success by difficulty, application completion, unassisted transfer, 14-day retention), although the evidence log contains almost everything needed. Hint use is folded into difficulty, so "solved without hints" cannot be told apart from "easy item" in the log.

## Engineering baseline

| Measure | Value | Source |
|---|---|---|
| Initial JS (gzip) | 71.9 KB, budget 90 | `npm run budget` |
| Unit / e2e / Python e2e | 353 / 183 / 4, all passing | CI run 40126951461 |
| axe (WCAG 2.2 AA tags) | 0 violations, 59 pages × 2 themes | same |
| Lab LCP (cold, 4× CPU, slow network) | 0.97–2.52 s; CLS 0 | `docs/audits/evidence/perf-lab.json` |
| Offline | whole app after one visit; Python excepted | `e2e/offline.spec.js` |

## Uncertainties

- No learner has used the app under observation; every usability statement above is a count of clicks and controls, not evidence of confusion.
- Field performance is unknown (no analytics, by design).
