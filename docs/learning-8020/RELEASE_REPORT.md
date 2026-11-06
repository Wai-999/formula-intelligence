# Release report

| | |
|---|---|
| Branch | `feat/learning-8020-professor-experience` |
| Base | `main` at `f6d8691` (live since 2026-10-28, deploy run [40648067467](https://github.com/Wai-999/formula-intelligence/actions/runs/40648067467)) |
| Pull request | [Wai-999/formula-intelligence#8](https://github.com/Wai-999/formula-intelligence/pull/8) |
| Contents | the unreleased V5.1 Ohlone preparation work, merged with `main` (`c17f789`), then the 80/20 upgrade |
| Branch protection on `main` | none (GitHub API: “Branch not protected”); no required reviews or checks |

## Commits of the 80/20 upgrade

| SHA | What |
|---|---|
| `c17f789` | Merge `main` into the V5 branch, with integration fixes |
| `712108f` | One next-action engine; honest content gaps; bridges after errors; wrong-answer feedback; four course statuses; session summary |
| `45f16e9` | Professor contract on five priority lessons; 10 applied cases linked to projects |
| `08ea2d9` | Browser journeys for the new states; persona and metrics scripts |
| `fbdef06` | “Try a question now” |
| `ffb72ad` | Choice options in a fixed per-question order |
| `afceb16` | Documentation and evidence |
| (this file) | Release report |

## Local verification

All gates pass locally (TEST_RESULTS.md §2): lint, 587 unit tests, content and college validation, build, budget (72.1 KB / 90 KB), Python 90/90, C++ 20/20, axe on 78 pages in both themes, citations, e2e 308 passed / 1 skipped / 1 timing flake that passed on re-run, e2e:python 5/5.

## CI

The pull request runs `.github/workflows/ci.yml` (lint, unit tests, content and college validation, Python and C++ verification, build, budget, e2e with axe). Its result is shown on the pull request; this file is part of the pull request, so it cannot record the final CI run of the commit that contains it.

## Merge and deployment

| | |
|---|---|
| Approval | The owner approved the merge in the working session on 2026-11-05, after CI passed (asked explicitly, because this merge also shipped the V5.1 content, whose brief required the owner's go-ahead). |
| CI on the merged head `fc35a9e` | [run 41990432506](https://github.com/Wai-999/formula-intelligence/actions/runs/41990432506) — success: 587 unit tests, budget 72.1 KB, e2e 309 passed, e2e:python 5 passed |
| Merge commit | `37e23e3` (merged 2026-11-05 14:21 UTC) |
| Deploy | [run 42044247031](https://github.com/Wai-999/formula-intelligence/actions/runs/42044247031) — build success, deploy success, finished 2026-11-05 14:41 UTC |
| Live bundle | `assets/index-DFAulqer.js` (was `index-SpsVOSNA.js`); identical to the local build of the merged code |

## Production verification (2026-11-05)

`node scripts/learning-live-smoke.mjs https://wai-999.github.io/formula-intelligence/ docs/learning-8020/evidence/after-live` — a fresh Chromium profile on the live site, **10 / 10 steps passed, 0 page errors** (`evidence/after-live/smoke.json`, screenshots `smoke-01` … `smoke-10`):

1. Home loads (bundle `index-DFAulqer.js`) and offers a starting point
2. Learn → Courses lists C++ Programming Fundamentals
3. The course page opens *Loops you can trace*
4. “Try a question now”, a wrong answer, and feedback that explains (“Not yet. … Where to look: …”)
5. Save my place — “Saved on this device: Step 4 of 6 — Try it”
6. Apply → Projects
7. My Progress shows “Your next step”
8. After a reload, Home offers to resume *Loops you can trace* at Step 4
9. Resume opens the lesson at Try it
10. The next action leads to a real lesson: *Functions and vectors: copies versus references*

The six persona journeys were also re-run against production (`evidence/after-live/journeys.json`) and match the local “after” results in USABILITY_TEST_REPORT.md: C++ reachable in 3 decisions, wrong answers explained with a bridge link, Home offering a bridge after errors, and the Calculus I gap named instead of a silent jump to Calculus II.

**Status: deployed and verified.**
