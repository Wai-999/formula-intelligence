# Accessibility report

Target: WCAG 2.2 AA for core flows (§13). This report separates what automated tools and scripted keyboard tests have verified from what needs people and assistive technology — which has **not** been done.

## Automated: axe-core on every surface, both themes

`npm run a11y` (dark) and `npm run a11y:light` against the production build, tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`. Surfaces come from the app's own registries, so a new page is audited automatically: every listed page in `src/app/pages.js`, one page per course, every authored lesson, the embedded ML lessons, and the phone layout of Home and the More sheet.

| Run | Surfaces | Violations |
|---|---|---|
| Baseline (Phase 0) | 11 of 20 surfaces | green, but on partial coverage |
| End of Phase 1 | 16/16 | 0 (3 production violation types fixed) |
| **This release** | **59 pages, dark** | **0** |
| **This release** | **59 pages, light** | **0** |

Fixed during Phases 2–10 because the audit found them: radio choices whose only label was rendered math (now named from `toPlainText` of the math); 24 px target size on Python-library and Sources table-of-contents links; an unlabelled phone search button; a scrollable display-math region that was not keyboard-focusable (focusable now, only when it overflows); light-theme contrast of the active depth button; the Model Map mechanism slider had no accessible name (now labelled, output announced politely).

Axe cannot judge meaning, reading order, or whether an explanation makes sense when heard. It is a floor, not a verdict.

## Scripted keyboard and layout tests (Playwright, every CI run)

| Test | File | Checks |
|---|---|---|
| Acceptance 8 | `e2e/v31.spec.js` | At **320 px**, keyboard only: reach a lesson checkpoint, answer numeric and choice items, get feedback, complete the lesson |
| Skip link | `v31.spec.js` | First Tab reveals "Skip to content"; Enter moves focus into `main` (also on a deep-linked load) |
| Focus after navigation | `v31.spec.js`, `journeys.spec.js` | The new page's `<h1>` receives focus; `document.title` updates |
| Graphs (baseline F-04) | `v31.spec.js` | Formula map, Model map and Concept map: Tab into the graph, arrow keys move between nodes, Enter opens details; each map also has an Outline (text) view |
| Search | `v31.spec.js` | Ctrl/⌘+K opens global search; typing + Enter goes to a lesson (`/` focuses a page's own search box) |
| Section keys | `v31.spec.js` | 1–7 jump between sections; `[` `]` move between pages; shortcuts pause in text fields |
| Phone navigation | `v31.spec.js` | Bottom bar; More opens a labelled dialog and moves focus into it; Esc closes it and returns focus to More (focus is not trapped inside the sheet) |
| Focus mode | `v31.spec.js` | Hides navigation, restores it |
| Labs without pictures | `v31.spec.js` | Numbers view and live readout give the same information as the plot |
| MathML | `v31.spec.js` | Lesson math renders `<math>` for screen readers |
| Theme + motion | `v31.spec.js`, `journeys.spec.js`, `theme.test.js` | System/light/dark persist; Settings → Reduce motion sets and persists `data-motion="reduce"` (unit) |
| **No horizontal overflow at 320 px** | `v31.spec.js` | Every registry page, every course, every lesson (59 surfaces) — fixes baseline F-07 |
| English only | `english-only.spec.js` | No Myanmar glyphs on any surface; depth toggle is a labelled `aria-pressed` group |

## Design-level measures

- One focus style for every control (`:focus-visible`, 2 px `--accent`, 2 px offset); keyboard only.
- Target size ≥ 24 × 24 px everywhere (WCAG 2.5.8); buttons 32–40 px.
- Status never by colour alone (icon + word on chips; dashes + labels on plots).
- Reduced motion from the OS **or** Settings, applied to CSS and to D3/lab tweens.
- Lessons: one `<h1>`, numbered `<h2>` sections, a table of contents, and a progress bar that is decorative (`aria-hidden`) with the same information in text ("Section 3 of 10 · See it").
- Items: every input labelled; feedback in a live region; hints and solutions are buttons that say what they reveal.
- Errors say what happened and what to do ("Enter a number, like 2, -0.5 or 3/4").

## Not done — BLOCKED

| Required by §13/§14/§17 | Status | Why / what is needed |
|---|---|---|
| Screen-reader task testing (NVDA + Firefox/Chrome, VoiceOver + Safari, TalkBack) | **BLOCKED** | Needs a person operating each reader; cannot be simulated honestly. Suggested script: complete *Slope as rate of change* checkpoint; explore the Concept map in Outline and Graph views; run and grade a code exercise; take the diagnostic. |
| Testing with disabled users | **BLOCKED** | Needs recruited participants. |
| Cognitive-load observation | **NOT DONE** | Needs observed sessions; design choices (one primary action per view, 70ch measure, focus mode, skippable diagnostic) are untested with learners. |
| Zoom 200 % / text spacing overrides | **PARTIAL** | 320 px sweep approximates 400 % zoom of a 1280 px window; text-spacing bookmarklet not run. |
| Windows High Contrast / forced colours | **NOT TESTED** | — |

## Known limitations

- The D3 graphs are explorable by keyboard and have text outlines, but their spatial layout is not conveyed to screen readers beyond "prerequisite / builds on" relationships.
- The bias–variance lab (the rehomed ML Playground) gives text readouts of training and validation error but no table view of its curve, unlike the other 19 labs.
- The Python lab's code editor is a `<textarea>` (accessible, but without syntax highlighting or line numbers).
- Legacy Stats pages (quiz, flashcards, story walk) pass axe but were not re-examined with the keyboard scripts above beyond the shared shell.
