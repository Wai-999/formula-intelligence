# Curriculum — routes, objectives and status

The unit-by-unit map (every unit, its objectives' exit competencies, authored and planned lessons) is generated from the catalog: [`docs/CURRICULUM_MAP.md`](../CURRICULUM_MAP.md) (`npm run docs:curriculum`). This page gives the routes V4 §5 asks for and where each stands. Nothing unfinished is presented as complete: in the app, a course with no written lessons is labelled an **outline**, and every written lesson is labelled a **draft awaiting independent math review**.

## Routes

```
Foundation        Prealgebra ─▶ Algebra I ─▶ Algebra II ─▶ Precalculus
                                   │
Core maths for                     ├─▶ Linear Algebra  (after Algebra I; does NOT wait for any calculus)
data science                       └─▶ Calculus I ─▶ Calculus II ─▶ Calculus III (needs Linear Algebra too)
                                          (after Precalculus)

Statistics        Probability & Statistics (after Algebra I)
Python / data     Python for Data Science (no prerequisite; alongside everything)
Machine learning  Machine Learning & Data Science (after Statistics and Linear Algebra)
```

Linear Algebra and Calculus run in parallel after their algebra prerequisites; Calculus III is never required before introductory Linear Algebra (V4 §5). Placement (Learn → Placement) suggests a starting point on the Foundation → Calculus I path and always offers **start earlier / start here / skip ahead**.

## Status by route (2026-10-24)

| Route | Course | Written lessons | Status | Applied exemplar |
|---|---|---|---|---|
| Foundation | Prealgebra | Ratios, rates and unit rates · Solving equations by keeping balance | partial (2 of 15) | — |
| | Algebra I | **Break-even** · Slope as rate of change · Slope–intercept form · Fitting a line to data | partial (4 of 17) | **Break-even** |
| | Algebra II | — | outline | — |
| | Precalculus | — | outline | — |
| Core | Linear Algebra | Vectors and the dot product · Projection · **Matrix–vector products: scoring customers** · Matrices as transformations · Gaussian elimination · PCA and the SVD | partial (6 of 25) | **Scoring customers** |
| | Calculus I | The derivative from first principles · **Marginal cost** | partial (2 of 10) | **Marginal cost** |
| | Calculus II | Riemann sums · Taylor polynomials | partial (2 of 10) | — |
| | Calculus III | Partial derivatives and the gradient · Gradient descent | partial (2 of 11) | — |
| Statistics | Probability & Statistics | Sampling distributions and the CLT · Bayes’ theorem as updating | partial (2 of 16) | — |
| ML | Machine Learning & Data Science | Validation and leakage · Confusion matrix and ROC · Calibration and fairness (+ the ML pipeline's bias–variance and model-evaluation lessons) | partial (3 of 17) | — |
| Python / data | Python for Data Science | — (practised through 29 graded exercises and 9 projects) | outline | — |

**23 lessons written, 0 independently reviewed.** Counts come from the catalog (written ÷ written + planned).

## Learning objectives

Each course lists its units, each unit its objectives and exit competencies, in `src/data/curriculum/catalog.js`; the generated map reproduces them. The competencies (47, in 8 domains) are what mastery, review and placement are measured against (`docs/LEARNING_ASSESSMENT_SPEC.md`).

## What V4 changed in the curriculum

- Three applied exemplar lessons (above), each opening with a decision and ending with where the model breaks.
- Every lesson presented in six steps (`docs/v4/LESSON_TEMPLATE.md`).
- Six applied projects joined to the routes (`docs/v4/APPLIED_PROJECTS.md`).
- No course was expanded beyond these: V4 §10 puts expansion after the basic loop has been tested with learners, which has not happened yet.
