# Learning and assessment specification

How Formula Intelligence decides what a learner knows, where they should start, and what they should review. Every rule here is implemented in one small pure module and pinned by unit tests; the module is named in each section. Nothing here has been validated with real learners — see §7.

## 1. Evidence and mastery — `src/lib/mastery.js`

**Evidence** is the only input. One record per *first* attempt at a question in a visit: `{ c: competency, item, ok, d: difficulty 1–3, tr: counts as transfer?, x: is a transfer item (since V4), h: hint opened first (since V4), s: source, at }`, stored in `fi_learning_v1` (cap 10 000 records; past the cap the oldest are thinned, never the latest per item). Sources: `checkpoint`, `practice`, `review`, `mixed`, `diagnostic`.

- A retry after feedback is still checked and explained, but is **not** new evidence: getting it right by trial and error after seeing the answer demonstrates nothing new.
- Opening a hint before the first attempt records the item at difficulty 1 and never as transfer.
- Page views, time on page and scrolling are **not evidence**.

**Mastery is computed, never stored**, so rules can change without a data migration and every status can be explained from the records behind it.

| Level | Rule (all conditions) |
|---|---|
| Not started | No evidence for the competency |
| Learning | Any evidence that does not meet *Proficient* |
| Proficient | ≥ 3 **different** items correct · weighted accuracy ≥ 70 % · at least one correct at difficulty ≥ 2 |
| Mastered | Proficient · a correct **transfer** item · correct answers on **two different days** · the latest answer correct · weighted accuracy ≥ 80 % · newest evidence ≤ 60 days old |

- Only the latest attempt per item counts (re-answering replaces).
- Weights: difficulty 1/2/3 → 1, 1.5, 2; transfer +0.5; times a recency factor `0.5^(age_days / 60)` (60-day half-life). Old evidence fades; it is never deleted.
- Each status carries `reasons` in plain language ("2 of the 3 different correct answers needed…"), shown on Progress.
- Confidence: low (< 3 items), medium (3–5), high (≥ 6).

Tests: `src/lib/__tests__/learningEngine.test.js` — one lucky guess is never mastery; repeats of one item don't count twice; transfer and two days are required; staleness demotes; hints downgrade.

## 2. Diagnostic procedure — `src/lib/diagnostic.js`, `src/features/diagnostic/`

Optional and skippable (Learn → Placement; called the *placement check* in the app); offered on first run next to "Start from Prealgebra" and "Explore first". Item bank `src/data/diagnostic/itemBank.js`, version `dx-2026.10-2`: 85 items over 8 domains, ≥ 2 per covered competency — **41 of 47 competencies**. The six left out are Calculus II–III and ML-course skills (`calc.series`, `calc.gradient`, `calc.optimization`, `ml.*`): a hard calculus or statistics item stands for "ready to leave Calculus I / Probability & Statistics", so questions from the courses after those would mark a ready learner down. Their lesson checkpoints measure them. Items are only ever added, never removed or re-keyed, because saved attempts refer to them by id (`dx-2026.10-1` had 64 items over 32 competencies; all 64 are unchanged).

Three rounds, so screening is broad before it is deep:

1. **Screening** — one difficulty-2 item in every domain not skipped.
2. **Targeting** — per domain, a harder item after a correct answer, an easier one after a miss.
3. **Tie-break** — only where rounds 1 and 2 disagree, one more middle item.

At most three answered items per domain.

**Which item**, once the round has fixed the domain and difficulty (`nextItem`): the one shown least often in the learner's **earlier attempts** first, so a retake asks fresh questions while any are left at that difficulty and measures the skill rather than memory of the answer; then the one whose **competency this attempt has asked least**, so a domain's questions spread over its skills; then bank order. Deterministic: the same history always gives the same question. Until `dx-2026.10-2` the first item of the right difficulty in bank order was always chosen, so a retake with the same answers repeated exactly the same questions. Any item can be answered "I haven't studied this"; any domain can be skipped; the whole screen can be stopped and still produce a (wider) result.

## 3. Estimation and recommendation

- Per domain, a one-parameter logistic (Rasch) model with the **authored** difficulties mapped to −1, 0, +1, a standard-normal prior, and the posterior evaluated on a 161-point grid over [−4, 4]. Posterior mean ≥ 0.75 → *Likely ready*; ≥ −0.5 → *Partly there*; else *Likely gap*. Posterior SD < 0.8 → *moderate* confidence, otherwise *low*. **High confidence is never claimed**: three items cannot support it.
- **No psychometric calibration has been done** — none is possible without response data. The difficulties are author judgements, and the UI says so.
- **Recommendation** walks the mathematics path Prealgebra → Algebra I → Algebra II → Precalculus → Calculus I and stops at the first domain that is not *Likely ready*. Each step contributes a sentence of reasoning ("Algebra: 1 of 3 correct (partly there, low confidence) — this is where to start"). *Also consider*: Linear Algebra and Probability & Statistics when algebra looks ready; Python alongside from the start.
- The result is labelled **provisional** and offers three one-click choices (V4 §6): **Start earlier** (one step back on the path), **Start here**, **Skip ahead** (one step on); off the path, "earlier" is the course's first prerequisite (`placementChoices` in `src/lib/diagnostic.js`). The learner can also choose any course (**manual override**, `source: 'manual'`) or **retake**. Every attempt is kept in `fi_diagnostic_v1`; a retake adds, never overwrites.

Tests: `src/lib/__tests__/diagnostic.test.js` (coverage, adaptive selection, competency spread, fresh retakes, every item reachable over retakes, caps, skip/stop, posterior widths, recommendation reasons, start earlier/here/ahead, override, retake history) and `e2e/v31.spec.js › diagnostic`.

## 4. Spaced review — `src/lib/reviewSchedule.js`

A Leitner schedule per competency with boxes of **1, 3, 7, 14, 30, 60 days**.

- Correct → up one box. Incorrect → **down one box**, never back to the start.
- **Missed days are never punished**: an overdue review is scheduled exactly as if done on time; overdue items wait without multiplying.
- Answers from checkpoint, practice, review and mixed practice schedule a review; diagnostic answers do not (a skill is not "due" before it was studied).
- Practice → Review lists due skills and runs a review session that picks, per skill, the question answered least recently (on Home until V4).

Chosen over SM-2 because its behaviour fits in one sentence and has no hidden ease factor that a bad week can drive into the ground. The older formula flashcards (Practice → Review) keep their SM-2 schedule and their own storage.

## 5. Lessons, items and completion

- Ten elements per lesson (§6): the question, before you start, see it (lab), why it works, worked examples, predict first, practice, checkpoint, in Python, keep going.
- Item types: numeric (parsed — integers, decimals, fractions `3/4`, percentages, scientific notation, typographic minus — and compared with the tolerance the item declares, absolute or relative, default 1e-9), single choice with per-option feedback, and multi-blank numeric (e.g. vector components). Never exact string matching for numbers. `src/lib/answers.js`, tests in `learningEngine.test.js`.
- Each item has hints, a worked solution (after one attempt), and optionally a *remedy* link to a prerequisite lesson.
- **A lesson is complete when its checkpoint has been answered**, not when it was scrolled through. Section progress is tracked for navigation only.

## 6. Mixed practice (interleaving) — `src/lib/interleave.js`, Practice → Review

Owner decision D2. The old header badge asked cross-domain questions about the retired Gold/Macro/Micro/Politics labs; it was removed with them. Interleaving is now re-sourced from **every lesson the learner has opened**:

- unlocked once lessons from **two subjects** are open;
- six questions, **never two in a row from the same subject** while another still has questions;
- least recently answered first, never-answered before all;
- the lesson a question comes from is named only **after** the first answer — naming it first would answer "which idea is this?", which is the skill interleaving trains;
- first answers are evidence and schedule reviews (source `mixed`).

Tests: `src/lib/__tests__/interleave.test.js`; `e2e/v31.spec.js › practice`.

## 7. Learning signals (V4 §7) — `src/lib/learningSignals.js`

Four personal rates on My Progress → Overview, computed on the device from this learner's own evidence and project state; no population claims, nothing sent anywhere:

- **Practice success** — correct first attempts ÷ attempts (practice, checkpoint, review, mixed), by recorded difficulty.
- **Unassisted transfer** — transfer items correct without a hint ÷ transfer items attempted, from records carrying `x` (written since V4).
- **14-day retention** — per skill, the first answer 14+ days after the first correct one: correct ÷ skills that have such an answer.
- **Application completion** — projects with every step done ÷ projects started.

A rate is shown only when it rests on at least 5 answers (projects: at least 1 started), otherwise "Not enough data yet". Tests: `learningSignals.test.js`. Mixed-practice questions and no-code answers in Python exercises: the former count, the latter are not recorded.

## 8. Validity limits (UNVERIFIED)

- Thresholds (70 %, 80 %, three items, 60-day half-life, box lengths) are **reasoned defaults**, not fitted to learner data. They are constants in one file each so they can be tuned once data exists.
- Diagnostic difficulties are uncalibrated; placement accuracy is **UNVERIFIED**.
- No learner study has been run. Learning-outcome claims are **not made** anywhere in the app.
- All lesson and item content is AI-drafted and **awaiting independent human math review** (`docs/CONTENT_QA.md`).
