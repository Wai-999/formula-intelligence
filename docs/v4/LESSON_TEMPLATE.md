# Lesson template — the V4 contract

One scrollable page per lesson, six steps (V4 §4). Every lesson in the app — the 20 written for V3.1 and the three V4 exemplars — renders through the same template (`src/features/learn/LessonPage.jsx`); a lesson is data in `src/data/curriculum/lessons/<id>.js` plus one entry in `lessons/index.js`.

## The six steps

| Step | What the learner sees | Lesson fields | Shown how |
|---|---|---|---|
| **1. Why it matters** | One realistic decision or problem, then the idea in two or three paragraphs | `intuition.question`, `intuition.body[]` | Always |
| **2. Understand** | Notation · worked examples · the result with its claim type · a non-example | `glossary[]`, `examples[]`, `meta.formulas`, `counterexample` | Always |
| | Readiness check on prerequisites | `priorCheck[]` | Disclosure "Ready? Two quick checks" |
| | Derivation | `derivation.intro`, `derivation.steps[]` | Disclosure "Go deeper: why it works" |
| | Assumptions and domain | `derivation.assumptions[]`, `derivation.domain[]` | Disclosure "Assumptions and limits" |
| **3. See it** | One interactive figure with a text alternative and a numbers view | `visualization.{lab, config, intro, textAlternative}` | Always; extra views in "Go deeper" |
| **4. Try it** | A prediction, then 2–4 graduated questions with hints and feedback that explains errors | `predict`, `practice[]` (levels `scaffolded`, `independent`) | Always |
| **5. Use it** | A real-life mini task with its limits, then transfer questions; Python optional | `apply.{scenario, steps[], items[], limits[]}`, `practice[]` level `transfer`, `python` | Task always; Python in a disclosure (open when the lesson has a task) |
| **6. Check understanding** | Checkpoint (incl. a transfer question), the recommended next lesson, skill status, further reading | `checkpoint[]`, `meta.next`, `reading[]` | Reading in a disclosure |

At the top: course and unit, a one-line summary, time, difficulty, the **"Draft: awaiting independent math review"** label, and **See connections** (what it builds on, what it teaches, its statistics formulas and ML models, and where it leads, with a link into the concept map).

A compact sticky bar shows "Step n of 6" and a "Next:" button; it is the only in-lesson navigation a learner needs (usability task c).

## Rules every lesson must meet (enforced by tests)

`src/data/curriculum/__tests__/curriculum.test.js`, `scripts/verify-python.mjs`, `scripts/check-citations.mjs`:

- All ten authored elements present (intuition, glossary ≥ 3, prior check, visualization with a ≥ 60-character text alternative, derivation ≥ 3 steps with assumptions and domain, ≥ 2 worked examples and a non-example, predict with a misconception, practice at all three levels, checkpoint ≥ 3 with a harder and a transfer item and feedback on each, Python with expected output, reading with real links).
- Every worked example and every numeric answer key is **recomputed independently** (`check.compute`, `item.compute`).
- Every formula and every inline math string parses with KaTeX.
- Item ids are unique across the curriculum; tolerances accept rounding, never a different answer; a key is accepted and an obviously wrong answer rejected.
- The Python block prints **exactly** its stated output under CPython + NumPy.
- Every cited URL answers.
- Exact claims are distinguished from models: each formula states its `claim` type (definition, identity, theorem, approximation, heuristic, empirical); illustrative numbers are labelled as such in the text.
- A lesson is a **draft** (`review.status: 'awaiting-human-review'`) until an independent reviewer signs off (`docs/CONTENT_QA.md`).

## The three V4 exemplar lessons

| Lesson | Decision it opens with | Lab | Use it task | Where the simple model breaks |
|---|---|---|---|---|
| **Break-even: when does a business cover its costs?** (`a1-break-even`, Algebra I) | How many orders a day before a restaurant stops losing money? | Revenue against total cost; price, cost per order and fixed costs as sliders | Does a delivery app (\$150/day, \$2 commission) pay? 25 orders to cover it; +\$90/day at 40 orders; what if they are regulars? | Demand depends on price; capacity steps; waste; percentage fees |
| **Marginal cost: what does one more unit cost?** (`c1-marginal-cost`, Calculus I) | What does the 301st loaf cost, and can noisy records tell you? | Tangent against difference quotients at several steps, with exact or noisy records | A café wants 50 loaves at \$3.20: estimate \$135 vs exact \$140; +\$20/day | Beyond the fitted range; capacity steps; price effects on other customers |
| **Matrix–vector products: scoring customers** (`la-matrix-scores`, Linear Algebra) | How does a table and a weight list become scores, and can one column decide? | Scores as bars; weights, units (dollars/cents) and standardization switches | Score four customers; the basket's share of B's score (0.68); who is invited if the basket is in cents (B and C) | Additivity; hand-picked weights; fairness of targeting; leakage |

All numbers in them were computed by code (`src/features/labs/business.js`, tested in `labMath.test.js`; Python outputs captured by running). The businesses and customers are invented and labelled as such.

**User testing: BLOCKED.** V4 §10 asks to user-test the exemplars before expanding. No learners were available in this environment; the five scripted usability tasks (`e2e/v4-usability.spec.js`) show the paths exist and are short, not that learners understand them.

## Adding a lesson

1. Write `src/data/curriculum/lessons/<id>.js` following any exemplar; give every numeric item a `compute`.
2. Add its metadata to `lessons/index.js` (with `review: AI_DRAFT` or a real reviewer) and its id to a unit's `lessons` in `catalog.js` (removing the matching `planned` title).
3. Add any new concept to `concepts.js` and formula to `formulas.js`.
4. `npm test && npm run verify:python && npm run check:citations && npm run docs:curriculum`.
