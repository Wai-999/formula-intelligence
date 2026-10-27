# Study continuity — test report

Every result below comes from running the command shown on 2026-10-27, on branch `claude/practical-gates-59o8iv`. The environment was a Linux sandbox: Node 22.22, Chromium 153 headless (the project's Playwright 1.62 pointed at the installed browser through `PLAYWRIGHT_BROWSERS_PATH`), and CPython 3.13 with NumPy 2.5, pandas 3.1 and matplotlib 3.11. CI repeats the same gates on the pull request and again before deploying.

## Gates

| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | PASS |
| Content validation | `npm run validate:content` | PASS |
| Unit and component tests | `npm test` | **416 / 416** (32 files; 59 new) |
| Build | `npm run build` | PASS |
| Initial-load budget | `npm run budget` | **71.8 KB** gzip (budget 90; was 71.6) |
| Python outputs | `npm run verify:python` | **78 / 78** |
| End-to-end | `npm run e2e` | **237 / 237** (was 215; 22 new in `e2e/study-continuity.spec.js`). One more test (a lesson chunk that fails to download) was added after the full run; `e2e/study-continuity.spec.js` then passed **23 / 23**, and CI runs the whole suite |
| Accessibility, dark | `npm run a11y` | **0 violations**, 60 pages |
| Accessibility, light | `npm run a11y:light` | **0 violations**, 60 pages |
| Python worker e2e | `npm run e2e:python` | see *Not run here* |
| Citations | `npm run check:citations` | see *Not run here* |

## New tests

| File | What it proves |
|---|---|
| `src/lib/__tests__/studyResume.test.js` (26) | Validation: unknown step degrades, NaN/out-of-range fraction, impossible and future times, oversized or selector-like ids. Record clean-up: deduplicated, ordered and capped. A saved place outranks newer browsing. Fallbacks: recent place, then last opened lesson with no step claimed, then a removed lesson explained. A moved lesson keeps its place. Each course resumes into itself. Two-tab merge never undoes or revives a pin. Labels and locale times. Completion counts only written lessons with an answered checkpoint; planned titles never count. Skills only at proficient or mastered; next course after the end |
| `src/store/__tests__/studyResume.test.js` (18) | Save is confirmed only when stored. Saves that name a missing lesson, the wrong course or no step are refused. Automatic saves never move the pin. No rewrite for the same place. Refused storage gives an error and keeps the place in memory, and a later automatic save neither drops it nor fails to store it once storage works. Another tab's newer pin survives this tab's write. Storage events. Damaged and newer-version records quarantined. Remove saved place touches nothing else. Mastery unchanged. One-time resume token. Finish session does not complete the lesson. Backup includes places; legacy backup restores; reset removes places and keeps the theme |
| `src/features/learn/__tests__/studyContinuity.test.jsx` (15) | Home: first run unchanged; exactly one primary Resume with the saved step; recent lesson without a fabricated step; a removed lesson explained. Lesson: Save confirmed; refused save gives an alert and no "saved"; the trail in words; the resume offer; Finish session does not complete; a resume request restores and is used up. Course: resumes into its own course; old fallback kept; honest end with planned titles listed. My Progress: Remove saved place removes only the bookmark. Session page: a failed save is said plainly |
| `e2e/study-continuity.spec.js` (23) | **A** save at Step 4 → Home → Resume → Step 4, focused and on screen; again after a reload; again in a new browser context from stored data only; an automatic checkpoint alone survives a reload. **B** a saved place survives browsing; saving elsewhere replaces it, and the panel says so. **C** two courses each resume into themselves. **D** Finish session completes nothing; a checkpoint answered for real counts; the course end reads "You finished the available lessons…", "not yet complete", "not a grade, transcript or credential"; planned rows are not links; Next points to a real lesson. **E** backup → reset → restore round-trip (place, notes, evidence); legacy backup; damaged and newer-version records quarantined; refused storage gives an error on Save and on the summary. **F** 320/375/768/1280 px × light/dark: controls fit, no horizontal overflow, axe clean with the steps panel open; axe on the session summary, Home, course and My Progress with a saved place; keyboard only (open steps, jump, save, Escape back to the toggle, Resume focuses the step, Back returns Home); offline Resume after one visit; a lesson chunk that fails to download explains itself, links to the course outline, and loads after the network is back; two tabs (a save shows in the other tab without a reload; the other tab's automatic saves keep it) |
| `e2e/v4-usability.spec.js` (changed) | Task (b) now expects "Continue recent lesson"; task (c) targets the Next button by its class and waits for scrolling to settle before pressing Next |

## The pre-existing flake, root-caused

Usability task (c) had failed about 1 run in 6 under CPU load since before this work: 3/16 on `main`, measured with four busy loops. Playwright's trace showed Next being pressed after the page had jumped up about 250 px. The step had changed under the button, so the click pressed the wrong "Next".

Measurements in a real browser found the cause. On `main`, moving keyboard focus to the sticky bar (Shift+Tab, Tab) scrolled the lesson from 552 px to 260 px, and Playwright's click took it to 0. A raw mouse click did not move it. The culprit was the lesson scroller's `scroll-padding-top: 64px`, which also applied to the sticky bar inside it.

Replacing it with `scroll-margin-top: 64px` on the lesson content stopped the movement: 552 → 552 in all three cases. After the fix:

- usability task (c): **16 / 16** under the same load;
- the study-continuity, v31 and usability suites run twice: **218 / 218**;
- the full e2e suite: **237 / 237**.

Keyboard users had been affected too; they no longer are.

## Manual and visual checks

- Screenshots, captured from this build (`screenshots/after-*.jpg`): lesson with the steps panel at 1280 px (light, dark), 768 px, 375 px, 320 px (dark), and the save confirmation at 375 px; Home with a saved place (1280 light, 375 dark) and with a removed lesson; course pages in progress and finished (1280; 375 dark); My Progress (1280 light; 375 dark); the session summary (1280 light; 375 dark); the core path after Resume. No page had horizontal overflow, and no page threw an error.
- Before/after: `screenshots/before-*.jpg`, documented in `BASELINE.md`.

## Not run here

- **`npm run e2e:python`** and **`npm run check:citations`** need hosts that this sandbox's network policy blocks: the Pyodide CDN and most cited sites. Neither touches this feature. CI runs `e2e:python` on the pull request and before deploying.
- **The live site.** `wai-999.github.io` is not reachable from the sandbox, so production is verified through the deploy workflow's own gates and result (`RELEASE_REPORT.md`), not by replaying the journey in a browser there.
- **Screen readers and learners.** Not tested with NVDA, VoiceOver or TalkBack, and not with real learners (as for the rest of the app: `docs/ACCESSIBILITY_REPORT.md`). Status text uses `role="status"`; failures use `role="alert"`.
