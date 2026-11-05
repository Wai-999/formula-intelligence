# Priority scorecard

Every candidate change from the baseline audit (BASELINE_AUDIT.md), scored **Impact × Confidence × Reach ÷ Effort**:

- **Impact** (1–5): how much it should raise independent problem solving or remove a dead end.
- **Confidence** (0.5–1.0): how sure the audit is that the problem is real and the fix helps (1.0 = observed in the browser and the fix is direct).
- **Reach** (1–5): how many learners and lessons it touches.
- **Effort** (1–5, with a range in days): engineering plus authoring and checking.

Scores rank; they are judgments, not measurements. Risk and prerequisites are noted where they change the decision.

| # | Candidate | Finding | I | C | R | E (days) | Score | Priority | Decision |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Name the unwritten next lesson; practise before moving on; next course one click away | F1 | 5 | 1.0 | 5 | 2 (1–2) | **12.5** | P0 | **Done** (`content-gap` rule) |
| 2 | Explain wrong answers: what went wrong, where to look, reasoning after a second miss | F4 | 4 | 1.0 | 5 | 2 (1–2) | **10.0** | P0 | **Done** (`src/lib/feedback.js`) |
| 3 | One next-action engine for Home, course, lesson end, Progress, session | F1, F9, F12 | 4 | 0.9 | 5 | 2 (1–3) | **9.0** | P0 | **Done** (`src/lib/nextAction.js`) |
| 4 | A short bridge after repeated errors (chain rule → composite functions) | F5 | 4 | 0.8 | 4 | 2 (1–2) | **6.4** | P0 | **Done** (`bridge-after-errors`) |
| 5 | “Try a question now” one click from the top of a lesson | F11 | 3 | 0.9 | 5 | 1 (0.5) | **13.5** | P1 | **Done** — cheap, high reach |
| 6 | Professor contract (faded example, simpler version, tempting mistake, outcomes) on five priority lessons | F6 | 4 | 0.7 | 3 | 3 (2–4) | **2.8** | P0 | **Done** for 5 lessons; the rest in the backlog |
| 7 | Applied cases tied to projects, ≥12 on the priority lessons | F8 | 3 | 0.7 | 3 | 3 (2–3) | **2.1** | P1 | **Done**: 10 new + 3 linked; 15 on the priority lessons, 4 projects |
| 8 | Four completion statuses on course pages | F10 | 3 | 0.9 | 4 | 1 (0.5) | **10.8** | P1 | **Done** |
| 9 | Progress: next step and what remains before a course is ready | F9 | 3 | 0.8 | 4 | 1 (0.5) | **9.6** | P1 | **Done** |
| 10 | Session summary: practised, needs review, next step | F12 | 2 | 0.9 | 3 | 1 (0.5) | **5.4** | P1 | **Done** |
| 11 | C++, data structures, discrete structures courses | F2 | 5 | 1.0 | 3 | 5 (V5) | 3.0 | P0 | **Shipped with V5** in this release |
| 12 | Write the missing prerequisite lessons (e.g. Calculus I derivative rules) | F3 | 5 | 0.9 | 4 | 5 (each 1–2) | 3.6 | P1 | **Backlog**: highest-value next step, see REMAINING_BACKLOG.md |
| 13 | Professor contract on every other lesson (30) | F6 | 3 | 0.7 | 4 | 5 (10–15) | 1.7 | P2 | Backlog |
| 14 | Wrong-answer feedback authored per question (beyond the safe numeric checks) | F4 | 3 | 0.8 | 5 | 5 (5–8) | 2.4 | P2 | Backlog |
| 15 | Audit every lab for a prediction and a follow-up question | F13 | 2 | 0.5 | 3 | 3 (2–3) | 1.0 | P2 | Backlog |
| 16 | Real-learner evaluation (time to first practice, transfer success) | — | 4 | 0.6 | 5 | 4 | 3.0 | P1 | Backlog: needs people, consent and no telemetry — a local-only protocol is in USABILITY_TEST_REPORT.md |
| 17 | AI tutor, gamification, streaks, analytics | — | — | — | — | — | — | — | **Rejected** (brief non-negotiables; no evidence they help here) |

## Why this set

The audit found that learners were not short of material to read but of **feedback and honest direction at the moments that decide whether they continue**: a wrong answer (F4, F5) and the end of the written part of a course (F1). Fixing those two moments touches every lesson and course and costs about a week; it ranks above writing more lessons, which is the larger long-term need but costs a day or two per lesson. The five priority lessons and their cases show the full teaching contract on one lesson per Ohlone area, so the pattern can be copied.

Modifiers applied: #6 and #7 lose confidence because their benefit depends on content quality that only an independent reviewer can confirm; #12 is held for the next release because each new lesson needs the same review before it is trusted; #11 was already built (V5) and only needed integrating.
