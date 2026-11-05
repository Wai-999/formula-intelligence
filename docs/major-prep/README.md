# Ohlone Data Science preparation (V5.1) — reports

> Formula Intelligence is a self-study tool. It does not award college credit, determine college placement, waive prerequisites, or guarantee transfer admission.

| Report | What it answers | Maintained by |
|---|---|---|
| [BASELINE_AND_DECISIONS.md](BASELINE_AND_DECISIONS.md) | Where V5 started, what was prioritised, every design decision, the learning principles used | hand-written |
| [ACADEMIC_EVIDENCE.md](ACADEMIC_EVIDENCE.md) | Official sources, the Ohlone A.S., each target's requirements, the full ASSIST articulation matrix | generated: `npm run docs:college` |
| [CURRICULUM_AND_COVERAGE.md](CURRICULUM_AND_COVERAGE.md) | How much of each Ohlone course the site teaches, topic by topic, with lesson and assessment IDs | generated: `npm run docs:college` |
| [QUALITY_AND_SECURITY.md](QUALITY_AND_SECURITY.md) | Every gate run and its result, walkthroughs, C++/Python runtime decisions, storage, accessibility, performance | hand-written |
| [RELEASE_AND_NEXT_STEPS.md](RELEASE_AND_NEXT_STEPS.md) | Branch, PR, CI, what needs the owner's approval, what is blocked, what to do next | hand-written |
| [WORK_LOG.md](WORK_LOG.md) | What was done, in order (append-only) | hand-written |
| `evidence/before/`, `evidence/after-local/` | Screenshots of the live V4 site and of this branch, 375 px and 1280 px, dark and light | `npm run evidence:screenshots` with `SHOT_BASE` / `SHOT_SET=v5` |

Live-site screenshots after release (`evidence/after-live/`) can only exist once the owner approves a merge and deployment.
