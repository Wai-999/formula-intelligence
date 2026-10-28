# Learning path map

Generated from `src/data/curriculum/pathways.js` and the learning-path engine (`src/lib/learningPath.js`) by `npm run docs:path`. Edit the data, not this file.

These are **self-study paths**. They are not degree, transfer or certification requirements, and nothing here claims an equivalence with any college course. "Written" means a lesson exists in the app; "planned" means only its title does. Finishing the written lessons of a course is reported as exactly that, never as finishing the course or mastering it.

## Default route: Data Science Foundations → Advanced Applications

From number sense to machine learning. Courses come in the order of the catalog’s levels, each after the courses it lists as prerequisites.

| # | Course | Written lessons | Planned lessons | Prerequisites | Note |
|---|---|---|---|---|---|
| 1 | Prealgebra | 2 | 13 | — |  |
| 2 | Algebra I | 4 | 13 | Prealgebra |  |
| 3 | Python for Data Science | — (outline only) | 15 | — | Can be studied alongside algebra: it has no prerequisite, and no course here requires it yet. |
| 4 | Algebra II | — (outline only) | 14 | Algebra I |  |
| 5 | Probability & Statistics | 2 | 14 | Algebra I | Needs only Algebra I, so it can be studied alongside Linear Algebra. |
| 6 | Geometry, Trigonometry & Precalculus | — (outline only) | 12 | Algebra II |  |
| 7 | Linear Algebra | 6 | 19 | Algebra I | Needs only Algebra I, so it can be studied alongside Probability & Statistics. |
| 8 | Calculus I — Limits and Derivatives | 2 | 8 | Geometry, Trigonometry & Precalculus |  |
| 9 | Calculus II — Integrals and Series | 2 | 8 | Calculus I — Limits and Derivatives |  |
| 10 | Machine Learning & Data Science | 3 | 14 | Probability & Statistics, Linear Algebra |  |
| 11 | Calculus III — Multivariable Calculus and Optimization | 2 | 9 | Calculus II — Integrals and Series, Linear Algebra |  |

## What “Continue” does, lesson by lesson

A learner who starts at the beginning and always takes the primary action sees this sequence (`walkPath`). Every written lesson appears once, course by course; course changes show the reasons and warnings the app displays.


**Prealgebra**
1. Ratios, rates and unit rates (`pa-ratios-rates`, continue-lesson)
2. Solving equations by keeping balance (`pa-equation-balance`, finish-unit)

**Algebra I** — course transition
> You have answered the checkpoint of every written lesson in Prealgebra.
> Algebra I comes next on “Data Science Foundations → Advanced Applications”. It lists Prealgebra as a prerequisite.
> Its first lesson, “Break-even: when does a business cover its costs?”, builds on: Equations and the balance principle.
> ⚠ Prealgebra has 13 more planned lessons that are not written yet, so the full course is not complete.
> ⚠ “Break-even: when does a business cover its costs?” also assumes: Multi-step linear equations — not taught in a written lesson here yet.

3. Break-even: when does a business cover its costs? (`a1-break-even`, transition-course)
4. Slope as rate of change (`a1-slope`, finish-unit)
5. Slope–intercept form (`a1-slope-intercept`, continue-lesson)
6. Fitting a line to data (`a1-line-fit`, continue-lesson)

**Probability & Statistics** — course transition
> You have answered the checkpoint of every written lesson in Algebra I.
> Probability & Statistics comes next on “Data Science Foundations → Advanced Applications”. It lists Algebra I as a prerequisite.
> Its first lesson, “Bayes’ theorem as updating”, builds on: Conditional probability.
> ⚠ Algebra I has 13 more planned lessons that are not written yet, so the full course is not complete.
> ⚠ Python for Data Science and Algebra II are next on the path but not written yet, so they are passed over for now.

7. Bayes’ theorem as updating (`st-bayes`, transition-course)
8. Sampling distributions and the central limit theorem (`st-sampling-clt`, finish-unit)

**Linear Algebra** — course transition
> You have answered the checkpoint of every written lesson in Probability & Statistics.
> Linear Algebra comes next on “Data Science Foundations → Advanced Applications”.
> ⚠ Probability & Statistics has 14 more planned lessons that are not written yet, so the full course is not complete.
> ⚠ Geometry, Trigonometry & Precalculus is next on the path but not written yet, so it is passed over for now.
> ⚠ “Vectors and the dot product” assumes: Vectors in the plane and The coordinate plane — not taught in a written lesson here yet.

9. Vectors and the dot product (`la-dot-product`, transition-course)
10. Projection onto a vector (`la-projection`, continue-lesson)
11. Matrix–vector products: scoring customers (`la-matrix-scores`, finish-unit)
12. Matrices as transformations (`la-matrix-transform`, continue-lesson)
13. Gaussian elimination (`la-elimination`, finish-unit)
14. Principal components and the SVD (`la-svd-pca`, finish-unit)

**Calculus I — Limits and Derivatives** — course transition
> You have answered the checkpoint of every written lesson in Linear Algebra.
> Calculus I — Limits and Derivatives comes next on “Data Science Foundations → Advanced Applications”.
> Its first lesson, “The derivative from first principles”, builds on: Slope as rate of change.
> ⚠ Linear Algebra has 19 more planned lessons that are not written yet, so the full course is not complete.
> ⚠ “The derivative from first principles” also assumes: Limits and continuity — not taught in a written lesson here yet.
> ⚠ Calculus I — Limits and Derivatives builds on Geometry, Trigonometry & Precalculus and Algebra II, which are not written yet.

15. The derivative from first principles (`c1-derivative`, transition-course)
16. Marginal cost: what does one more unit cost? (`c1-marginal-cost`, continue-lesson)

**Calculus II — Integrals and Series** — course transition
> You have answered the checkpoint of every written lesson in Calculus I — Limits and Derivatives.
> Calculus II — Integrals and Series comes next on “Data Science Foundations → Advanced Applications”. It lists Calculus I — Limits and Derivatives as a prerequisite.
> ⚠ Calculus I — Limits and Derivatives has 8 more planned lessons that are not written yet, so the full course is not complete.
> ⚠ “Area as a limit of Riemann sums” assumes: Limits and continuity and Sequences and series — not taught in a written lesson here yet.

17. Area as a limit of Riemann sums (`c2-riemann`, transition-course)
18. Taylor polynomials (`c2-taylor`, finish-unit)

**Machine Learning & Data Science** — course transition
> You have answered the checkpoint of every written lesson in Calculus II — Integrals and Series.
> Machine Learning & Data Science comes next on “Data Science Foundations → Advanced Applications”.
> Its first lesson, “Validation, cross-validation and leakage”, builds on: Fitting a line to data.
> ⚠ Calculus II — Integrals and Series has 8 more planned lessons that are not written yet, so the full course is not complete.
> ⚠ “Validation, cross-validation and leakage” also assumes: Descriptive statistics — not taught in a written lesson here yet.

19. Validation, cross-validation and leakage (`ml-validation`, transition-course)
20. Confusion matrix, precision, recall and ROC (`ml-classification-metrics`, finish-unit)
21. Calibration and fairness checks (`ml-calibration-fairness`, continue-lesson)

**Calculus III — Multivariable Calculus and Optimization** — course transition
> You have answered the checkpoint of every written lesson in Machine Learning & Data Science.
> Calculus III — Multivariable Calculus and Optimization comes next on “Data Science Foundations → Advanced Applications”.
> Its first lesson, “Partial derivatives and the gradient”, builds on: The derivative and The dot product.
> ⚠ Machine Learning & Data Science has 14 more planned lessons that are not written yet, so the full course is not complete.

22. Partial derivatives and the gradient (`c3-gradient`, transition-course)
23. Gradient descent (`c3-gradient-descent`, finish-unit)

**End of the route** — pathway-end.
> You have answered the checkpoint of every written lesson in Calculus III — Multivariable Calculus and Optimization.
> You have answered the checkpoint of every written lesson on “Data Science Foundations → Advanced Applications”.
> ⚠ Calculus III — Multivariable Calculus and Optimization has 9 more planned lessons that are not written yet, so the full course is not complete.
> ⚠ 139 planned lessons on this path are not written yet; the path is finished only as far as it is written.

## After each course

What the course page, the last lesson of the course and Home all offer once every written lesson of a course is done (with the earlier courses done too).

| Finished course | Next | Passed over (not written) | Warnings |
|---|---|---|---|
| Prealgebra | Algebra I: Break-even: when does a business cover its costs? | — | “Break-even: when does a business cover its costs?” also assumes: Multi-step linear equations — not taught in a written lesson here yet. |
| Algebra I | Probability & Statistics: Bayes’ theorem as updating | Python for Data Science, Algebra II | — |
| Probability & Statistics | Linear Algebra: Vectors and the dot product | Geometry, Trigonometry & Precalculus | “Vectors and the dot product” assumes: Vectors in the plane and The coordinate plane — not taught in a written lesson here yet. |
| Linear Algebra | Calculus I — Limits and Derivatives: The derivative from first principles | — | “The derivative from first principles” also assumes: Limits and continuity — not taught in a written lesson here yet. Calculus I — Limits and Derivatives builds on Geometry, Trigonometry & Precalculus and Algebra II, which are not written yet. |
| Calculus I — Limits and Derivatives | Calculus II — Integrals and Series: Area as a limit of Riemann sums | — | “Area as a limit of Riemann sums” assumes: Limits and continuity and Sequences and series — not taught in a written lesson here yet. |
| Calculus II — Integrals and Series | Machine Learning & Data Science: Validation, cross-validation and leakage | — | “Validation, cross-validation and leakage” also assumes: Descriptive statistics — not taught in a written lesson here yet. |
| Machine Learning & Data Science | Calculus III — Multivariable Calculus and Optimization: Partial derivatives and the gradient | — | — |
| Calculus III — Multivariable Calculus and Optimization | End of the path | — | 139 planned lessons on this path are not written yet; the path is finished only as far as it is written. |

## Outline-only courses

A course with no written lesson never dead-ends: its page names what is planned and offers the nearest useful alternative.

| Course | Planned lessons | Offered instead |
|---|---|---|
| Python for Data Science | 15 | Practise Python in Code exercises (Code exercises); or continue on the path: Probability & Statistics |
| Algebra II | 14 | Continue on the path: Probability & Statistics — Bayes’ theorem as updating |
| Geometry, Trigonometry & Precalculus | 12 | Continue on the path: Linear Algebra — Vectors and the dot product |

## Optional tracks

Applied sequences of written lessons across courses. A learner can follow one from **Learn → Courses → Your learning path**; Home and the end of each track lesson then recommend the next step of the track. Planned topics are listed by their exact planned titles in the catalog and are never offered as lessons.

### Data science and machine learning

Fit, compress and evaluate models — and know when their numbers can be trusted. (10 written lessons, 2 planned topics.)

1. Fitting a line to data — Algebra I. Least squares: the first model most analysts fit to data.
2. Sampling distributions and the central limit theorem — Probability & Statistics. How much an average varies from one sample to the next.
3. Bayes’ theorem as updating — Probability & Statistics. Updating a probability with evidence, and why base rates matter.
4. Vectors and the dot product — Linear Algebra. Similarity between vectors, the idea behind recommendations.
5. Matrix–vector products: scoring customers — Linear Algebra. A data table times a weight vector: how a linear model scores every row.
6. Principal components and the SVD — Linear Algebra. Compressing many measurements into a few directions.
7. Gradient descent — Calculus III — Multivariable Calculus and Optimization. How models are fitted when no formula gives the answer.
8. Validation, cross-validation and leakage — Machine Learning & Data Science. Estimating performance on data the model has not seen.
9. Confusion matrix, precision, recall and ROC — Machine Learning & Data Science. Precision, recall and the cost of each kind of mistake.
10. Calibration and fairness checks — Machine Learning & Data Science. Whether predicted probabilities mean what they say, for every group.
11. *Planned, not written:* Logistic regression — Machine Learning & Data Science. The standard model for yes/no outcomes.
12. *Planned, not written:* Regularization — Machine Learning & Data Science. Trading a little fit for a model that generalizes.

Final project: **Classification and the cost of mistakes** (Apply → Projects).

### Business, sales and marketing analytics

Prices, costs, demand and forecasts — decisions a small business makes every week. (7 written lessons, 2 planned topics.)

1. Ratios, rates and unit rates — Prealgebra. Unit prices and rates: comparing offers of different sizes fairly.
2. Break-even: when does a business cover its costs? — Algebra I. How many sales cover the fixed costs.
3. Slope as rate of change — Algebra I. Rates of change with units: dollars per unit, sales per week.
4. Fitting a line to data — Algebra I. Fitting a demand line to past prices and sales.
5. Marginal cost: what does one more unit cost? — Calculus I — Limits and Derivatives. The cost of one more unit, and why it differs from the average cost.
6. Sampling distributions and the central limit theorem — Probability & Statistics. How much a weekly average can move by chance alone.
7. Validation, cross-validation and leakage — Machine Learning & Data Science. Checking a forecast on weeks it was not fitted to.
8. *Planned, not written:* Confidence intervals (chapter 7) — Probability & Statistics. Comparing two campaigns without over-reading a small difference.
9. *Planned, not written:* Optimization — Calculus I — Limits and Derivatives. Choosing the price that maximizes profit, not sales.

Final project: **Price and demand, with a train/test check** (Apply → Projects).

### Finance and economics

Budgets, costs and changing rates: the arithmetic behind prices, wages and saving. (6 written lessons, 2 planned topics.)

1. Ratios, rates and unit rates — Prealgebra. Rates and percentages behind prices, wages and interest.
2. Solving equations by keeping balance — Prealgebra. Solving for the unknown amount in a budget.
3. Break-even: when does a business cover its costs? — Algebra I. Fixed and variable costs, and the break-even point.
4. Slope–intercept form — Algebra I. A fixed fee plus a rate: the intercept and slope of a cost line.
5. Marginal cost: what does one more unit cost? — Calculus I — Limits and Derivatives. Marginal cost: the derivative economists use every day.
6. Area as a limit of Riemann sums — Calculus II — Integrals and Series. Adding up a rate that changes over time.
7. *Planned, not written:* Exponential growth and decay — Algebra I. Compound growth of savings and prices.
8. *Planned, not written:* Arithmetic and geometric sequences — Algebra II. Regular payments: loans, rent and pensions.

Final project: **Household budget and cash flow** (Apply → Projects).

### Physics, robotics and optimization

Motion, directions and minimization: the mathematics of things that move and of finding the best setting. (9 written lessons, 3 planned topics.)

1. Slope as rate of change — Algebra I. Speed as a slope: distance over time.
2. The derivative from first principles — Calculus I — Limits and Derivatives. Instantaneous rate of change: velocity from position.
3. Area as a limit of Riemann sums — Calculus II — Integrals and Series. Distance travelled, from a changing speed.
4. Taylor polynomials — Calculus II — Integrals and Series. Approximating a function near a point, as in small-angle models.
5. Vectors and the dot product — Linear Algebra. Components and the angle between two directions.
6. Matrices as transformations — Linear Algebra. Rotations and scalings as matrices.
7. Gaussian elimination — Linear Algebra. Solving systems of linear equations, as in force balances or circuits.
8. Partial derivatives and the gradient — Calculus III — Multivariable Calculus and Optimization. The direction of steepest ascent on a surface.
9. Gradient descent — Calculus III — Multivariable Calculus and Optimization. Minimizing an error or an energy by walking downhill.
10. *Planned, not written:* Components, magnitude and direction — Geometry, Trigonometry & Precalculus. Resolving a force into parts.
11. *Planned, not written:* Euler’s method — Calculus III — Multivariable Calculus and Optimization. Simulating motion one small time step at a time.
12. *Planned, not written:* Lagrange multipliers — Calculus III — Multivariable Calculus and Optimization. Optimizing under a constraint.

Final project: none yet. No physics or robotics project is written yet. Until one is, the “Use it” task of Gradient descent is this track’s final applied task.

### Environmental and spatial data

Trends, seasons and totals in measured data, and how far a pattern can be trusted. (5 written lessons, 3 planned topics.)

1. Slope as rate of change — Algebra I. A trend as a rate: degrees per decade, millimetres per year.
2. Fitting a line to data — Algebra I. Fitting a trend line and reading what is left over.
3. Sampling distributions and the central limit theorem — Probability & Statistics. How much a monthly average varies by chance.
4. Area as a limit of Riemann sums — Calculus II — Integrals and Series. Totals from rates, such as rainfall from intensity.
5. Validation, cross-validation and leakage — Machine Learning & Data Science. Testing a model on years it was not fitted to.
6. *Planned, not written:* The coordinate plane — Prealgebra. Locating places by coordinates.
7. *Planned, not written:* Time-series foundations — Probability & Statistics. Seasons, trends and noise in data ordered by time.
8. *Planned, not written:* Exploratory analysis — Machine Learning & Data Science. Looking at a dataset before modelling it.

Final project: **Local weather: anomalies or ordinary seasons?** (Apply → Projects).

## Preparing for CSU transfer mathematics (informational)

Self-study preparation only. Using this website does not award Ohlone College or CSU credit, does not appear on a transcript, and does not guarantee articulation of any course. Requirements differ by campus and major: check them with a college counselor and on ASSIST, California’s official transfer articulation database.

| Area | Courses here | Written lessons | Note |
|---|---|---|---|
| Calculus | Calculus I — Limits and Derivatives, Calculus II — Integrals and Series, Calculus III — Multivariable Calculus and Optimization | 6 |  |
| Linear algebra | Linear Algebra | 6 |  |
| Discrete mathematics | — | 0 | Not covered here yet. Apart from “Direct proof and counterexample”, planned in Algebra II, there is no course on logic, sets, combinatorics or graphs. |
| Probability and statistics | Probability & Statistics | 2 |  |
| Programming | Python for Data Science | 0 | The Python course is an outline. The code exercises and the Python lab under Apply are available now. |

## Validation

`validateCurriculum` (also run by `npm run validate:content` and the test suite) checks: known ids; no prerequisite cycles; the route lists every course once, prerequisites first; tracks name written lessons or real planned titles, and a project or a note; every written lesson has a next step or an honest end; and taking "Continue" from the start reaches every written lesson once, in route order.

Result when this file was generated: **no problems**.

