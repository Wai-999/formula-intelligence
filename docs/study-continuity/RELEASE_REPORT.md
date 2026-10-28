# Study continuity — release report

## Status

**Released to GitHub Pages on 2026-10-28.** The deploy workflow built `main` at the merge commit, passed every gate, and published it at 00:03 UTC. The live page was not opened from the development environment; see *What was not checked here*.

## Evidence

| | |
|---|---|
| Pull request | [Wai-999/formula-intelligence#6](https://github.com/Wai-999/formula-intelligence/pull/6), merged 2026-10-27 with a merge commit |
| Branch | `claude/practical-gates-59o8iv` |
| Reviewed head | `043dc10d31ea0f95118057ab68715b26bd6a564b` |
| Merge commit on `main` | `713a587fe9c75a1bb42022012f0252d6fbcc00ec` |
| Pull-request CI | [run 40603263038](https://github.com/Wai-999/formula-intelligence/actions/runs/40603263038), check `checks`: **success** on `043dc10` |
| Deploy | [Deploy to GitHub Pages, run 20 (40605030392)](https://github.com/Wai-999/formula-intelligence/actions/runs/40605030392) on `713a587`: **success**. The `build` job passed every gate (23:52–00:03 UTC) and the `deploy` job published at 00:03 UTC |
| Production | <https://wai-999.github.io/formula-intelligence/> |

GitHub reported the pull request as mergeable and clean (checks passing, no conflicts, no open review threads), and it merged without any override.

## What the deploy proved

`deploy.yml` builds `main` and publishes it only if every gate passes on that same commit:

- lint;
- content validation;
- unit and component tests;
- build;
- the initial-load budget;
- `verify:python` with real CPython;
- axe in dark and light themes;
- the full e2e suite, including all 23 journeys of `e2e/study-continuity.spec.js` (A–F);
- the Python e2e.

So the journeys ran against the exact build that was published, in a clean runner rather than the development sandbox.

## What was not checked here

**The live URL itself was not opened from this environment.** Its network policy refuses `wai-999.github.io` (`CONNECT tunnel failed, response 403`), so the save-and-resume journey was not replayed against production. A one-minute check on the live site:

1. Open <https://wai-999.github.io/formula-intelligence/>, then **Learn → Algebra I → Slope as rate of change**.
2. Open the steps list in the top bar (**Step 1 of 6**), choose **Try it**, then press **Save my place**. Expect *"Saved on this device: Step 4 of 6 — Try it, today, …"*.
3. Close the browser completely and reopen the site.
4. On **Home**, press **Resume where I stopped**. Expect the lesson to open at Step 4, with its heading focused.

## Rollback

Revert the merge commit and push to `main`: `git revert -m 1 713a587`. Pages then redeploys the previous build.

- Learners lose nothing. Older builds ignore `fi_resume_v1`, and `fi_lessons_v1` kept its shape.
- Rolling forward again finds saved places intact.
- Details: `docs/MIGRATION_AND_ROLLBACK.md`.

## Remaining limitations

- **One device only.** Places live in this browser on this device, with no account and no sync. Moving them means a backup file. This is by design for a static, backend-free app, and the app says so wherever a place is shown.
- **One saved place.** There is one chosen place across the app. Each course also remembers its most recent place (up to six courses), which is what a course page resumes to when the saved place is elsewhere.
- **Position within a step is approximate if a lesson is rewritten.** The step is exact; the position inside it is stored as a fraction of the step's height, so heavily edited content may land a paragraph away.
- **No course-wide challenge yet.** The end of a course says so, rather than inventing one.
- **Not tested with screen readers or with real learners.** The same applies to the rest of the app (`docs/ACCESSIBILITY_REPORT.md`).
- **Two gates did not run locally.** `e2e:python` and `check:citations` need hosts the sandbox blocks. `e2e:python` ran in CI and in the deploy.
