# Applied problems — QA

The applied-problem bank (`src/data/curriculum/problems.js`) uses one schema and one renderer (`src/features/learn/lesson/AppliedProblem.jsx`) for every case: a situation and a decision, labelled data, variables with units, assumptions, three to five graded steps (ordinary questions with hints, so the first attempt is the evidence), and — only after every step is tried — the worked solution, why it works, common mistakes, what the answer means, a harder extension, and for the new cases **how to check it another way**, **another route** and **what the learner produces**. A case can name the **project** whose running case it belongs to; the page then links it (“The same case continues in a project”).

All 38 problems are AI drafts with `reviewedStatus: 'awaiting-human-review'`, shown on the page. All numbers are invented and labelled so; none is measured data.

## On the five priority lessons: 15 problems, 13 new since the live release

| Lesson | Problem | Since | Project | Steps |
|---|---|---|---|---|
| Sampling distributions and the central limit theorem | Did the new menu change how busy we are? | live | Restaurant demand and food waste | 4 (1 reasoning, 2 transfer) |
| Vectors and the dot product | Pulling a cart: which part of the force does work? | live | — | 4 (1 reasoning, 1 transfer) |
| Composite and inverse functions | From a station’s kelvins to a forecast in °F | V5 | Local weather: anomalies or ordinary seasons? | 4 (1 reasoning, 1 transfer) |
| The chain rule | How fast is the spill spreading? | V5 | — | 4 (1 reasoning, 1 transfer) |
| Loops you can trace | Tracing the café’s order loop | V5 | Restaurant demand and food waste | 4 (1 reasoning, 1 transfer) |
| Composite and inverse functions | What will the lentils cost tonight? | 80/20 | Restaurant demand and food waste | 4 (1 reasoning, 1 transfer) |
| Composite and inverse functions | From a sensor’s raw count to a frost alarm | 80/20 | Clean a sensor log before trusting it | 4 (1 reasoning, 1 transfer) |
| The chain rule | How fast is the leftover food piling up? | 80/20 | Restaurant demand and food waste | 4 (1 reasoning, 1 transfer) |
| The chain rule | Raising the price a little every week | 80/20 | Price and demand, with a train/test check | 4 (1 reasoning, 1 transfer) |
| Loops you can trace | Counting the gaps in a weather log | 80/20 | Clean a sensor log before trusting it | 4 (1 reasoning, 1 transfer) |
| Loops you can trace | When must the compost bin be emptied? | 80/20 | Restaurant demand and food waste | 4 (1 reasoning, 1 transfer) |
| Sampling distributions and the CLT | Was this a wet summer, or an ordinary one? | 80/20 | Local weather: anomalies or ordinary seasons? | 4 (1 reasoning, 1 transfer) |
| Sampling distributions and the CLT | How many readings should the sensor average? | 80/20 | Clean a sensor log before trusting it | 4 (1 reasoning, 1 transfer) |
| Vectors and the dot product | Which dish is the closest substitute? | 80/20 | Restaurant demand and food waste | 5 (1 reasoning, 1 transfer) |
| Vectors and the dot product | What does next week’s price change do to a basket? | 80/20 | Price and demand, with a train/test check | 4 (1 reasoning, 1 transfer) |

Four projects carry these cases: restaurant (6), sensor log (3), weather (2), pricing (2). The restaurant case runs through composite functions (lentil cost per diner), the chain rule (waste rate), C++ loops (the compost bin), statistics (covers) and the dot product (dish similarity) — one evolving situation across five courses, as the brief’s case library suggests.

## The ten new cases: answers and independent checks

Every numeric answer has a `compute` written separately from the stated value; the test suite recomputes it and requires agreement within a tolerance of at most max(0.001, 1% of the value), and rejects the value plus one. Every formula is parsed with KaTeX. Every wrong option of a reasoning step has its own feedback.

| Problem | Step answers (tolerance; recomputed) | Check another way (shown to the learner) |
|---|---|---|
| `prob.recipe-scale` | 34.56 (±0.01; 34.56); choice; 217 (±0.5; 217); 8.64 (±0.01; 8.64) | Compose back: 217 diners → 86.8 servings → 15 624 g → $49.997, under $50 |
| `prob.sensor-calibration` | 30 (±0.05; 30); 155 (±0.5; 155); choice; 0.323 (±0.002; 0.3226) | Feed 155 back: 0.5 V, 0 °C |
| `prob.waste-rate` | 0.4 (±0.002; 0.4); 2 (±0.01; 2); choice; 12 (±0.05; 12) | Difference quotient of W(x(t)) = 0.5t² at t = 2: 2.0 kg/h |
| `prob.price-revenue-rate` | 64 (±0.1; 64); 32 (±0.1; 32); 20 (±0.1; 20); choice | Expand R(t) = 2100 + 40t − t²: R′(4) = 32, R′(20) = 0 |
| `prob.sensor-gaps` | 3 (exact; 3); 13.75 (±0.005; 13.75); choice; 2 (exact; 2) | Count the −999 markers by hand: indices 1, 4, 5 |
| `prob.waste-bin-loop` | 5 (exact; 5); 24.5 (±0.01; 24.5); choice; 6 (exact; 6) | 24.5 + 5.0 = 29.5 > 25; 29.5 ≤ 40 |
| `prob.rain-average` | 1 (±0.005; 1); 2.5 (±0.01; 2.5); choice; 324 (±0.5; 324) | √81 = 9; 9/√324 = 0.5 |
| `prob.sensor-noise` | 0.2 (±0.001; 0.2); 64 (±0.5; 64); choice; 64 (±0.5; 64) | 0.8/√64 = 0.1; 0.8/√63 ≈ 0.1008 |
| `prob.menu-substitute` | 20 (exact; 20); 0.951 (±0.002; 0.9513); 0.588 (±0.002; 0.5883); choice; 0 (±0.001; 0) | Angles: arccos 0.951 ≈ 18°, arccos 0.588 ≈ 54° |
| `prob.basket-total` | 17.5 (±0.01; 17.5); 0.05 (±0.001; 0.05); choice; 6.6 (±0.01; 6.6) | New prices give 17.55 = 17.50 + 0.05 |

The C++ cases’ loops were also traced by hand in the solution text and recomputed in JavaScript by the tests (the same loop logic, including the fixed bounds check); they are not compiled C++ programs, unlike the lesson code verified by `npm run verify:cpp`.

## Distractors

Each reasoning step’s wrong options are plausible mistakes, each with feedback that says why it fails (e.g. for the chain-rule waste case, “0.4 kg per hour” is what reading the outer rate at the time instead of at the surplus gives, and the feedback says so).

**Position bias found and fixed in this release.** All 40 reasoning steps of the bank — the live ones and these — listed the right answer first, as did all 19 placement choice items and about half the lesson choice items. Options are now shown in a fixed per-question shuffle (`src/lib/choiceOrder.js`); shown, the right answer sits in each of the four positions about equally (problems: 9, 8, 10, 13), and a test keeps every position under 40%.

## What these checks do not cover

Whether each scenario is realistic, whether the explanation is the clearest one, and whether the extension questions are answerable at this level — that needs the independent review recorded in docs/CONTENT_QA.md.
