# Phase 6 — four more lessons where learners were stuck

The owner (2026-11-05): “I can't learn the lessons that I wanna learn.” Free navigation (LEARNER_LED_NAVIGATION.md) opened every course. It could not make an unwritten lesson learnable: 37 lessons were written and 170 were only titles. This round writes four more, each to the ten-part professor contract from the start.

| Lesson | Course, unit | Replaces the planned title |
|---|---|---|
| `pa-exponents`: *Exponents and roots* | Prealgebra, “Expressions, exponents and radicals” | “Exponents and radicals” |
| `ps-center-spread`: *Center and spread: mean, median and standard deviation* | Probability & Statistics, “Describing data” | “Center and spread” |
| `ps-probability-rules`: *Probability rules: not, or, and* | Probability & Statistics, “Probability and counting” | “Probability rules” |
| `py-functions`: *Functions: name a step, test it, reuse it* | Python for Data Science, “Python basics” | “Functions” |

## How the four were chosen

There were three kinds of evidence.
- **Centrality:** how many written lessons build on a concept, directly or through others, using the `requires` edges in `src/data/curriculum/concepts.js` and each lesson's own concepts and prerequisites.
- **Placement items:** questions in the placement test whose skill no lesson taught.
- **The learner's route:** the gaps the site named to someone who finished the first courses.

| Topic | Written lessons that build on it | Placement items with no lesson | Why it was chosen |
|---|---|---|---|
| Exponents, radicals | 15 (exponentials and logs, polynomials, norms, big-O, the standard error…) | `dx.a11`, `dx.a12`, `dx.a13` | The most central topic left that is not pure arithmetic |
| Descriptive statistics | 6, including the central limit theorem, a priority lesson with no bridge | `dx.s1`, `dx.s2` | First unit of Probability & Statistics; the CLT lesson had nothing to fall back on |
| Probability rules | 4, including Bayes’ theorem, which had no bridge | `dx.s3`, `dx.s4` | Second unit of the same course; same reason, for Bayes |
| Python functions | — (the skill `py.basics` was already taught) | — | Python had 1 of 15 lessons written, and “Functions” was the exact gap the site showed a learner who had finished the first three courses |

**Not chosen this round.** The arithmetic foundations rank higher by raw count: integers (36), expressions (32), fractions (28) and the coordinate plane (28). As in phase 5, they were left out because they are review for most learners on this route. This is a judgement, and it can be revisited if placement results show otherwise.

## What each lesson has

All four meet the ten-part contract, and `professorContract.test.js` checks every part for them (`PHASE6_LESSONS` in `src/data/curriculum/priority.js`).

| | *Exponents and roots* | *Center and spread* | *Probability rules* | *Functions* |
|---|---|---|---|---|
| Concrete start | A video shared 3 ways each round: why round 5 is 243, not 15 | Two bus routes with the same average | “30% each day, so 60% this weekend?” | A tip rule changed in two places of three |
| Tempting mistake | $2^5 \cdot 2^3 = 2^{15}$ | Average the deviations (always 0) | Add $P(A)$ and $P(B)$ when they overlap | A second call reusing the first call’s variables |
| Prediction | $2^{10}$ against $10^2$ | A CEO joins the salary data | The coin after five heads | `add_one(x)` and `x` |
| Faded example | Photos on a phone, $2^7 / 2^{-6}$ | Daily water use: variance, then $s$ | Two quality checks | `minutes_late(times, limit)` |
| Lab | Exponential growth on two scales (existing) | **New:** *Center and spread*. Drag the largest value out; the mean and SD follow it, the median and IQR do not. | **New:** *Two dice*, a 6 × 6 grid of outcomes with events A and B marked | Code tracing (existing), with a new program: one function called twice |
| Python | The rules checked, and the sum that breaks them | `statistics` on both routes, before and after a breakdown | All 36 outcomes, with exact fractions | Two functions, three `assert` tests, the `print` bug |

There are 12 new applied problems, three per lesson; 6 continue a project's running case:

| Problem | Lesson | Project |
|---|---|---|
| Why 2% a month is not 24% a year | Exponents | Household budget (`proj.budget`) |
| Will the table fit in memory? ($10^6$ rows → $10^9$) | Exponents | — |
| Fencing a square vegetable bed (doubling the area, $\sqrt 2$ the fence) | Exponents | — |
| Two weeks with the same average | Center and spread | Local weather (`proj.weather`) |
| Planning soup for an ordinary day (a festival outlier) | Center and spread | Restaurant demand (`proj.restaurant`) |
| “Our average salary is \$96,500” | Center and spread | — |
| Two tests, more false alarms | Probability rules | Screening (`proj.screening`) |
| Will both flights be on time? (independence questioned) | Probability rules | — |
| Online, in store, or both? (checking independence) | Probability rules | — |
| The heater rule as a tested function | Functions | Sensor log (`proj.sensor-log`) |
| Two discounts are not one | Functions | — |
| One savings rate, or the average of twelve? | Functions | Household budget (`proj.budget`) |

New formulas, each with a reading for the formula and for each symbol (NOTATION_READINGS.md): the exponent rules, zero and negative exponents, fractional exponents, the sample mean, the sample standard deviation, and the complement, addition and multiplication rules.

## What changed around them

- **Bridges after wrong answers** (`src/lib/nextAction.js`, COURSE_GAP_MAP.md):
  - *Sampling distributions and the CLT* now offers 5 minutes of *Center and spread*.
  - *Bayes’ theorem* now offers *Probability rules*. Its prerequisites now list `c.probability`, which it always used.
  - *Center and spread* offers *Exponents and roots*, for the square roots in $s$.
  - *Functions* is pinned to *Python first steps*, because its mistakes are about tracing values.
  - *Fitting a line to data* now bridges to *Center and spread*, since its slope formula is built from means and deviations; before, it bridged to *Slope–intercept form*.
  - *Principal components* and *Validation* are pinned to the bridges they had before (*Projection*, *Fitting a line*), which are more specific than the new default.
- **Moving on:**
  - Algebra II now continues to *Center and spread* rather than *Bayes’ theorem*.
  - Python’s next named gap is “Conditions and control flow”.
- **Honest outline:** Probability & Statistics gains the planned titles “Position: percentiles, z-scores and box plots” and “Counting: permutations and combinations”. The new lessons do not cover these parts of the units' objectives.
- **A finding while writing:** with only five values, the upper quartile is the middle of the top two, so moving the largest value *does* move the IQR. The lab uses seven trips, the test suite checks both cases, and the lesson and lab say so.

| | Before | After |
|---|---|---|
| Written lessons | 37 | 41 |
| Planned lessons | 170 | 168 |
| Applied problems | 44 | 56 |
| Explain-back prompts | 30 | 34 |
| Lessons with a faded example | 7 | 11 |
| Curriculum formulas | 49 | 57 |
| Labs | 31 | 33 |

## Status

All four lessons, their problems, explain-backs and readings are **AI drafts** (`review: awaiting-human-review`, `reviewer: null`), labelled as drafts on the page. Machine checks:
- every number is recomputed;
- the LaTeX parses;
- the Python output and the new trace are verified with real Python;
- the links are checked;
- the contract is enforced.

No human has reviewed the teaching.

## Verification (2026-11-06, local)

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm test` | 673 / 673 in 44 files, including the contract for all 11 contract lessons and new lab-math cases (quartiles, outliers, the 36 dice outcomes and the addition rule for every pair of events) |
| `npm run verify:python` | 98 / 98 blocks, including the 8-step `tip-function` trace |
| `npm run check:citations` | 87 OK, 1 unverified (a DOI that refuses automated requests, already listed), 0 broken. One new link was wrong (OpenStax square roots are section 5.7, not 9.1) and was fixed. |
| `npm run validate:content`, `build`, `budget` | pass; initial JS 72.4 KB of 90 KB |
| `npm run e2e` | 323 passed, 1 skipped (the existing case C) |
| `npm run a11y`, `a11y:light` | no WCAG A/AA violations across 84 pages in each theme |
| Browser (local production build) | *Center and spread*: moving the largest trip to 120 minutes takes the mean from 31.3 to 40.6 while the median stays at 30 and the IQR at 16. *Probability rules*: the grid marks the 2 squares in both events, and the readout says 15 = 6 + 11 − 2. *Functions*: the trace runs 8 steps and prints `46.0 88.0`. No KaTeX errors. |
