# Remaining backlog

Ranked by the same Impact × Confidence × Reach ÷ Effort as PRIORITY_SCORECARD.md. Only work with evidence behind it; nothing here is claimed done.

| Rank | Item | Why (evidence) | Effort | Notes |
|---|---|---|---|---|
| 1 | **Independent human review of the 41 lessons and 56 problems** | Every lesson and problem is an AI draft (`review-complete: 0`). No teaching score can reach 4 without it (TEACHING_RUBRIC.md). | Reviewer time | Highest-value next action. Start with the eleven contract lessons (the five priority lessons, two from phase 5 and four from phase 6) and their 33 problems; the sign-off procedure is in docs/CONTENT_QA.md. |
| 2 | **Write the missing prerequisite lessons on the most-used routes** | 168 planned vs 41 written; every course ends in a gap (COURSE_GAP_MAP.md). Phase 5 wrote *What is a function?* and *Power, product and quotient rules* (PHASE5_PREREQUISITES.md); phase 6 wrote *Exponents and roots*, *Center and spread*, *Probability rules* and Python *Functions* (PHASE6_LESSONS.md). Next by the same evidence: Precalculus “Similarity and the Pythagorean theorem” (9 written lessons build on geometry), “Vectors in the plane” (8), Algebra I “Exponential growth and decay”, Python “Conditions and control flow” and “Lists”, then the arithmetic foundations (integers, expressions, fractions, the coordinate plane) if placement shows learners need them. | 1–2 days each, plus review | Each new lesson meets the professor contract from the start: add it to `PHASE6_LESSONS` (or a later list) in `src/data/curriculum/priority.js` and the contract test covers it. |
| 3 | Real-learner evaluation, local and consented | Learning outcomes were not measured (USABILITY_TEST_REPORT.md). | 1–2 days of sessions | Protocol in USABILITY_TEST_REPORT.md; uses the learner’s own exported backup, no analytics. |
| 4 | Wrong-answer feedback written for the specific mistakes of each numeric question | 215 of 385 lesson questions are numeric without authored wrong-answer feedback; the generic checks (sign, power of ten, factor 2, rounding) catch only some mistakes. | 5–8 days | Highest-traffic lessons first. |
| 5 | Professor contract on the other 30 lessons (faded example, simpler version, tempting mistake, outcomes) | F6 | 10–15 days | Contract test can be widened lesson by lesson (`PRIORITY_LESSONS`). |
| 6 | Explicit `bridge` choices for lessons whose fallback bridge is weak | The fallback picks the lesson teaching the last idea a lesson builds on; for some lessons the best bridge is a specific step elsewhere. COURSE_GAP_MAP.md lists each lesson’s bridge. | 0.5 day | Lessons with no written prerequisite have no bridge at all (also listed there). |
| 7 | Screen-reader pass (VoiceOver, NVDA) on Home, a lesson with feedback, the faded example and the session summary | Only axe has checked the new states. | 1 day | |
| 8 | Lab audit: a prediction and a reasoning follow-up for every lab | F13, partly audited | 2–3 days | |
| 9 | Compile the C++ applied cases’ code | The C++ cases are traced in text and recomputed in JavaScript, not compiled (APPLIED_PROBLEMS_QA.md). | 0.5 day | Add them to `npm run verify:cpp`. |
| 10 | Shorter path to the first question in long lessons | “Try a question now” gives one click, but the first question is still 3.6 screens down by default (P1). | 1 day | Consider a short “Try it” check right after the first worked example; needs a learner test first. |

Rejected, per the brief and the audit: an AI tutor, a backend or paid API, gamification or streaks, user analytics without authorisation.
