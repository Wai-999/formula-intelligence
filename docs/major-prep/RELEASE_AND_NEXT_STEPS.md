# Release and next steps (V5.1)

V5 was not released on its own. It was merged with `main` (PRs #5–#7) on 2026-11-04 and continues in the 80/20 branch `feat/learning-8020-professor-experience`, which carries both. **Branch, pull request, CI, merge and deployment evidence: docs/learning-8020/RELEASE_REPORT.md.**

## Approval

The V5.1 brief required explicit owner approval before merging to `main` or deploying. The 80/20 brief that followed asks for the pull request, CI and — “when permitted by current branch protection and required approvals” — the merge and production verification. `main` has no branch protection. Because merging ships the V5 content too, the merge is asked for explicitly in the release (RELEASE_REPORT.md) rather than inferred.

## After release

1. Take live screenshots into `evidence/after-live/` (`SHOT_BASE=https://wai-999.github.io/formula-intelligence/ SHOT_SET=v5 npm run evidence:screenshots`).
2. Re-read the 5 unverified college records when ASSIST publishes 2026–27 agreements for them; re-run `npm run validate:college` and `npm run docs:college`.
3. Independent review of the 12 V5 lessons (procedure in docs/CONTENT_QA.md).

## Highest-value next action

An independent human review of the five priority lessons and their 15 applied problems (docs/learning-8020/REMAINING_BACKLOG.md #1), then writing the Calculus I derivative-rules lessons that every course after Calculus I currently skips over.
