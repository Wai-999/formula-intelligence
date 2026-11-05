# Teaching rubric and the professor contract

**Who scored this:** the same AI assistant that drafted the lessons, applying the rubric below to its own work. That is a self-assessment, useful for finding gaps, and **not** the independent review the lessons still await (docs/CONTENT_QA.md). No score here should be read as “reviewed”.

## The professor contract

A priority lesson must contain all ten parts. `src/data/curriculum/__tests__/professorContract.test.js` checks that each exists and that every number in it is right; it cannot check that the teaching is good.

| # | Part | Where it lives in a lesson | Machine check |
|---|---|---|---|
| 1 | Problem first | `intuition.question`, the first thing on the page | present, > 60 characters |
| 2 | Intuition with symbols defined, and a simpler version | `intuition.body`, `glossary`, **`intuition.simpler`** (“Explain it more simply”), **`outcomes`** (“After this lesson you can”) | ≥ 3 glossary terms, ≥ 2 outcomes |
| 3 | Reasoning step by step | `derivation.steps` (“Go deeper: why it works”) | ≥ 3 steps |
| 4 | Worked example with an expert’s check, and why a tempting alternative fails | `examples[]` with `check`; **`examples[0].tempting`** | every example recomputed |
| 5 | Prediction before the reveal | `predict` with a named `misconception` | present |
| 6 | Faded example | **`faded`**: some steps shown, the rest are questions with hints; the finished example appears once each blank is tried | every blank recomputed, `value + 1` rejected |
| 7 | Independent problem | `practice` items with `level: 'independent'`, no hint needed | ≥ 2, different prompts |
| 8 | Transfer problem | `practice` items with `level: 'transfer'`; applied problems | ≥ 1, and ≥ 3 applied problems |
| 9 | Explain it back | `EXPLAIN_BACK[lesson]`: prompt, points to check against, a model answer; **self-checked, never graded by AI** | ≥ 3 points, model > 150 characters |
| 10 | Finish and continue | checkpoint; lesson-complete summary (shown so far, still wrong, next review); the next action | ≥ 3 checkpoint items; next action reachable |

Bold parts were added in this upgrade.

## Rubric (0–4 per criterion)

| Score | Meaning |
|---|---|
| 0 | Missing |
| 1 | Present but thin or confusing |
| 2 | Adequate: a motivated learner can follow it |
| 3 | Strong: clear, checked and scaffolded; a learner can work independently from it |
| 4 | Strong **and independently verified** by a human expert, or by learner data |

No criterion can score 4 today: there has been no independent review and no learner data.

- **Clarity** — one idea at a time, every symbol and unit defined before use, plain English first.
- **Correctness** — every number and formula right (machine-checked), assumptions and domains stated.
- **Scaffolding** — worked → faded → independent → transfer, with hints that reveal reasoning rather than answers.
- **Feedback** — after a wrong answer the learner learns what went wrong, where to look, the reasoning, and what to practise.
- **Transfer** — a new setting where the learner must choose the method and interpret the result.
- **Accessibility** — text alternatives for every visual, keyboard operable, readable at 320 px in both themes, axe-clean.

## Scores for the five priority lessons

Before = live `main` (or the V5 draft for lessons not yet live); after = this release.

| Lesson | Clarity | Correctness | Scaffolding | Feedback | Transfer | Accessibility |
|---|---|---|---|---|---|---|
| Composite and inverse functions (`a2-composition`, V5) | 3 → 3 | 3 → 3 | 2 → **3** | 1 → **3** | 3 → 3 | 3 → 3 |
| The chain rule (`c1-chain-rule`, V5) | 3 → 3 | 3 → 3 | 2 → **3** | 1 → **3** | 3 → 3 | 3 → 3 |
| Loops you can trace (`cpp-loops-trace`, V5) | 3 → 3 | 3 → 3 | 2 → **3** | 2 → **3** | 2 → **3** | 3 → 3 |
| Sampling and the central limit theorem (`st-sampling-clt`, live) | 3 → 3 | 3 → 3 | 2 → **3** | 1 → **3** | 2 → **3** | 3 → 3 |
| Vectors and the dot product (`la-dot-product`, live) | 3 → 3 | 3 → 3 | 2 → **3** | 1 → **3** | 2 → **3** | 3 → 3 |

### The evidence behind each change

- **Scaffolding 2 → 3, all five.** Before, the step from two fully worked examples to unaided practice had nothing in between. Each now has a faded example — e.g. the chain rule’s *A cubed linear function*: the parts are named, then the learner supplies the inner rate (4), the outer rate read at the inner value (3) and the product (12), with hints that point to the rule (“Use $u = 1$, not $x = 1$”), and only then sees the finished example with a difference-quotient check.
- **Feedback 1 → 3.** Before (observed, BASELINE_AUDIT P5): a wrong numeric answer without authored feedback showed only “Not yet.” Now every wrong answer shows the question’s own feedback if it has any, else a safe check from the numbers (sign, a power of ten, a factor of two, rounding), the first hint as “Where to look”, the worked reasoning after a second miss, and a 5-minute bridge (chain rule → composite functions’ worked examples). It stays at 3, not 4: most numeric questions still have no feedback written for their specific mistakes (backlog #14).
- **Transfer 2 → 3** for the C++, statistics and linear-algebra lessons: each now has three or more applied cases that end in a decision and an interpretation — e.g. *Which dish is the closest substitute?* asks why the dish with the most cheese is not the closest (cosine similarity compares mixes, not amounts) and whether a busy week changes the answer (it does not: scale cancels).
- **Clarity stays 3.** The “Explain it more simply” disclosures (the conveyor-belt picture for composition, gears for the chain rule, the dilution of long waits for the standard error) and the outcomes help, but whether they are clear to a beginner is a question for real learners.
- **Correctness stays 3.** Every number is recomputed by a test; no human has checked the explanations.
- **Accessibility stays 3.** axe-clean in both themes on the new states (e2e), keyboard operable, no sideways scroll at 320 px; not tested with a screen reader.

## The other 30 lessons

They keep the V3.1 structure (all parts except 2’s simpler version and outcomes, 4’s tempting alternative and 6) and benefit from the new feedback and next-action rules. Extending the contract to them is backlog #13.
