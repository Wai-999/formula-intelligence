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

## Merge and deployment — needs the owner’s decision

Merging to `main` deploys to GitHub Pages automatically (`deploy.yml`, on push to `main`). The 80/20 brief allows the merge “when permitted by current branch protection and required approvals”, and nothing on `main` forbids it. But this merge also ships the V5.1 content, whose brief said: “Do not merge to `main`, trigger production deployment … without explicit owner approval for this run.” So the merge is **asked for, not assumed**.

After a merge, the release is verified by:

1. the “Deploy to GitHub Pages” run for the merge commit succeeding;
2. a Playwright pass on `https://wai-999.github.io/formula-intelligence/#home`: Home → Learn/Courses → a lesson → Apply → My Progress → Save my place → reload → Resume → next action (and the six persona journeys re-run against the live site: `node scripts/learning-journeys.mjs https://wai-999.github.io/formula-intelligence/ docs/learning-8020/evidence/after-live`);
3. the live bundle name changing from `assets/index-SpsVOSNA.js`.

Until those three have happened, this release is **not deployed**.

## If the merge is declined or postponed

The pull request stays open with everything above. To release later: approve and merge PR #8 on GitHub (or `gh pr merge 8 --repo Wai-999/formula-intelligence --merge`), wait for the deploy run, then run step 2.
