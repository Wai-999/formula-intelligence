# Curriculum map

Generated from `src/data/curriculum/catalog.js` by `npm run docs:curriculum` — edit the catalog, not this file.

**Status words.** *Authored* means the lesson's content exists in `src/data/curriculum/lessons/` with all ten §6 elements. *Planned* means only a title exists. A course is **partial** when some of its lessons are authored and **outline** when none are; no course is complete. Every authored lesson is an **AI draft awaiting independent human math review** (`review.status: 'awaiting-human-review'`, reviewer `null`) — content-complete for this slice, not review-complete.

**Totals:** 9 subjects · 11 courses · 71 units · **23 authored lessons** · 139 planned lesson titles · 47 competencies in 8 domains · 23 interactive labs.

**Algebra and Linear Algebra are separate subjects** (§5): Algebra I/II build symbolic fluency with one-variable functions; Linear Algebra starts from vectors and matrices and lists Algebra I as a prerequisite, never the other way round.

## Recommended path

Prealgebra → Algebra I → Algebra II → Precalculus → Calculus I → Calculus II → Calculus III. Linear Algebra and Probability & Statistics branch off after Algebra I; Calculus III also needs Linear Algebra; Machine Learning & Data Science needs Probability & Statistics and Linear Algebra; Python for Data Science has no prerequisite and runs alongside. (These are the `prerequisites` in the table below.) The diagnostic places a learner on the first five steps (`MATH_PATH` in `src/lib/diagnostic.js`).

## Courses

| Course | Subject | Status | Units | Authored lessons | Planned titles | Prerequisites |
|---|---|---|---|---|---|---|
| Prealgebra | Mathematics Foundations | partial | 6 | 2 | 13 | — |
| Algebra I | Algebra | partial | 7 | 4 | 13 | prealgebra |
| Algebra II | Algebra | outline | 8 | 0 | 14 | algebra-1 |
| Geometry, Trigonometry & Precalculus | Precalculus | outline | 8 | 0 | 12 | algebra-2 |
| Linear Algebra | Linear Algebra | partial | 9 | 6 | 19 | algebra-1 |
| Calculus I — Limits and Derivatives | Calculus | partial | 4 | 2 | 8 | precalculus |
| Calculus II — Integrals and Series | Calculus | partial | 3 | 2 | 8 | calculus-1 |
| Calculus III — Multivariable Calculus and Optimization | Calculus | partial | 4 | 2 | 9 | calculus-2, linear-algebra |
| Probability & Statistics | Probability & Statistics | partial | 8 | 2 | 14 | algebra-1 |
| Machine Learning & Data Science | Machine Learning | partial | 8 | 3 | 14 | prob-stats, linear-algebra |
| Python for Data Science | Python for Data Science | outline | 6 | 0 | 15 | — |

## Mathematics Foundations

Number sense, fractions, ratios, expressions and equations — the floor everything else stands on.

### Prealgebra — partial

Integers, fractions, ratios, expressions and the balance idea behind every equation. About 40 hours when complete.

| Unit | Status | Authored lessons | Planned lessons | Exit competencies |
|---|---|---|---|---|
| Number systems and integer operations | outline | — | Number systems and the number line; Operations with integers; Estimation and checking | arith.integers |
| Fractions, decimals and percentages | outline | — | Equivalent fractions; Operations with fractions; Decimals and percentages | arith.fractions |
| Ratios, rates and proportional reasoning | partial | **Ratios, rates and unit rates** | Units and unit conversion | arith.ratios |
| Expressions, exponents and radicals | outline | — | Order of operations; Exponents and radicals; Scientific notation | arith.order-ops, arith.exponents (no diagnostic item) |
| Equations and inequalities | partial | **Solving equations by keeping balance** | Inequalities on the number line | arith.equations |
| The coordinate plane and word problems | outline | — | The coordinate plane; From words to equations | arith.equations |

## Algebra

Linear relationships, functions, systems, polynomials, exponentials and logarithms.

### Algebra I — partial

Linear equations and relationships, functions, systems, polynomials and quadratics. About 60 hours when complete.

| Unit | Status | Authored lessons | Planned lessons | Exit competencies |
|---|---|---|---|---|
| Linear equations and inequalities | partial | **Break-even: when does a business cover its costs?** | Variables on both sides; Linear inequalities | alg.linear-eq |
| Linear relationships | authored | **Slope as rate of change**<br>**Slope–intercept form**<br>**Fitting a line to data** | — | alg.slope, alg.slope-intercept, alg.line-fit (no diagnostic item) |
| Functions and graph interpretation | outline | — | What is a function?; Domain and range; Reading graphs | func.notation |
| Systems of linear equations | outline | — | Solving by graphing; Substitution and elimination | alg.systems |
| Polynomials and factoring | outline | — | Polynomial arithmetic; Factoring | alg.quadratics |
| Quadratic functions and equations | outline | — | Solving quadratics; Graphs of quadratics | alg.quadratics |
| Exponents and exponential models | outline | — | Exponent rules; Exponential growth and decay | alg.exp-log |

### Algebra II — outline

Polynomial and rational functions, complex numbers, exponentials and logarithms, sequences and series, and first proofs. About 60 hours when complete.

| Unit | Status | Authored lessons | Planned lessons | Exit competencies |
|---|---|---|---|---|
| Polynomial and rational functions | outline | — | Polynomial functions; Rational functions | alg.quadratics |
| Complex numbers | outline | — | The imaginary unit; Complex arithmetic | alg.quadratics |
| Exponential and logarithmic functions | outline | — | Logarithms; Exponential equations; The number e | alg.exp-log |
| Inverse and composite functions | outline | — | Composition; Inverse functions | func.compose-inverse |
| Sequences and series | outline | — | Arithmetic and geometric sequences; Finite and infinite geometric series | alg.exp-log |
| Transformations of functions | outline | — | Shifts, stretches and reflections | func.transform |
| Nonlinear systems and inequalities | outline | — | Nonlinear systems | alg.systems |
| Introductory proof reasoning | outline | — | Direct proof and counterexample | alg.linear-eq |

## Precalculus

Geometry, trigonometry, vectors in the plane and the function toolkit calculus assumes.

### Geometry, Trigonometry & Precalculus — outline

Essential geometry, the unit circle, trigonometric functions, vectors in the plane, parametric and polar forms, and limit intuition. About 60 hours when complete.

| Unit | Status | Authored lessons | Planned lessons | Exit competencies |
|---|---|---|---|---|
| Essential geometry | outline | — | Similarity and the Pythagorean theorem | trig.unit-circle |
| Vectors in the plane | outline | — | Components, magnitude and direction | trig.vectors-plane |
| Angles and the unit circle | outline | — | Radians; The unit circle | trig.unit-circle |
| Trigonometric functions and identities | outline | — | Graphs of sine and cosine; Identities | trig.identities |
| Inverse trigonometry and periodic models | outline | — | Inverse trigonometric functions; Periodic models | trig.identities |
| Parametric and polar coordinates | outline | — | Parametric equations; Polar coordinates | trig.unit-circle |
| The function toolkit | outline | — | Function families | func.transform, func.compose-inverse |
| Limit intuition | outline | — | Approaching a value | calc.limits |

## Linear Algebra

Vectors, matrices, transformations, eigenvectors and the SVD — the language of data.

### Linear Algebra — partial

From vectors and the dot product to elimination, eigenvectors, least squares, the SVD and PCA — with the applications that make them central to data science. About 80 hours when complete.

| Unit | Status | Authored lessons | Planned lessons | Exit competencies |
|---|---|---|---|---|
| Vectors, the dot product and projections | authored | **Vectors and the dot product**<br>**Projection onto a vector** | — | la.vector-ops, la.dot-product, la.projection (no diagnostic item) |
| Matrices and linear transformations | partial | **Matrix–vector products: scoring customers**<br>**Matrices as transformations** | Determinants and inverses | la.matrix-mult |
| Systems and elimination | partial | **Gaussian elimination** | LU factorization | la.elimination |
| Vector spaces | outline | — | Span and independence; Basis and dimension; The four subspaces and rank–nullity | la.elimination |
| Eigenvalues and eigenvectors | outline | — | Eigenvalues and eigenvectors; Diagonalization; Symmetric matrices | la.eigen (no diagnostic item) |
| Orthogonality and least squares | outline | — | Orthogonal bases and Gram–Schmidt; QR factorization; Least squares | la.projection (no diagnostic item) |
| The SVD, pseudoinverse and PCA | partial | **Principal components and the SVD** | The pseudoinverse; Positive definite matrices | la.svd-pca (no diagnostic item) |
| Numerical linear algebra | outline | — | Conditioning; Sparse matrices; Tensors and matrix calculus | la.svd-pca (no diagnostic item) |
| Applications | outline | — | Regression as projection; Embeddings and similarity; Low-rank recommenders | la.svd-pca (no diagnostic item) |

## Calculus

Change and accumulation, from limits to gradients, Hessians and optimization.

### Calculus I — Limits and Derivatives — partial

Limits, continuity, the derivative from first principles, derivative rules, and optimization. About 60 hours when complete.

| Unit | Status | Authored lessons | Planned lessons | Exit competencies |
|---|---|---|---|---|
| Limits and continuity | outline | — | Limits; Continuity | calc.limits |
| The derivative | authored | **The derivative from first principles**<br>**Marginal cost: what does one more unit cost?** | — | calc.derivative |
| Derivative rules | outline | — | Power, product and quotient rules; The chain rule; Implicit differentiation and related rates | calc.rules (no diagnostic item) |
| Applications of derivatives | outline | — | Extrema; Curve sketching; Optimization | calc.optimization (no diagnostic item) |

### Calculus II — Integrals and Series — partial

Antiderivatives, definite integrals and the Fundamental Theorem, techniques of integration, numerical integration, and Taylor series. About 60 hours when complete.

| Unit | Status | Authored lessons | Planned lessons | Exit competencies |
|---|---|---|---|---|
| Definite integrals | partial | **Area as a limit of Riemann sums** | The Fundamental Theorem of Calculus; Substitution; Integration by parts; Improper integrals | calc.integral |
| Sequences, series and Taylor approximation | partial | **Taylor polynomials** | Convergence tests; Power series | calc.series (no diagnostic item) |
| Parametric and polar calculus | outline | — | Parametric calculus; Polar area | calc.integral |

### Calculus III — Multivariable Calculus and Optimization — partial

Partial derivatives, gradients, Jacobians and Hessians, constrained optimization, multiple integrals, vector calculus, differential equations, and the bridges to gradient descent and backpropagation. About 70 hours when complete.

| Unit | Status | Authored lessons | Planned lessons | Exit competencies |
|---|---|---|---|---|
| Partial derivatives and the gradient | partial | **Partial derivatives and the gradient** | The Jacobian; The multivariable chain rule | calc.gradient (no diagnostic item) |
| Optimization and machine-learning bridges | partial | **Gradient descent** | Lagrange multipliers; Automatic differentiation and backpropagation | calc.optimization (no diagnostic item) |
| Multiple integrals and vector calculus | outline | — | Double integrals; Vector fields and line integrals; The major theorems | calc.integral |
| Differential equations fundamentals | outline | — | Separable equations; Euler’s method | calc.integral |

## Probability & Statistics

Describing data, probability, sampling, inference and modelling uncertainty.

### Probability & Statistics — partial

Built on the 94 formulas of Bluman’s Elementary Statistics in the Formula map, deepened with sampling, Bayesian reasoning and modern practice. About 70 hours when complete.

| Unit | Status | Authored lessons | Planned lessons | Exit competencies |
|---|---|---|---|---|
| Describing data | outline | — | Center and spread (see Formula map chapters 2–3) | stats.descriptive |
| Probability and counting | outline | — | Probability rules (see Formula map chapter 4) | stats.probability |
| Conditional probability and Bayes’ theorem | authored | **Bayes’ theorem as updating** | — | stats.bayes |
| Random variables and distributions | outline | — | Discrete distributions (Formula map chapter 5); The normal distribution (chapter 6) | stats.probability |
| Sampling, the LLN and the CLT | authored | **Sampling distributions and the central limit theorem** | — | stats.sampling |
| Estimation and hypothesis testing | outline | — | Confidence intervals (chapter 7); Hypothesis tests (chapters 8–9); Effect sizes | stats.inference (no diagnostic item) |
| Correlation, regression and ANOVA | outline | — | Correlation and regression (chapter 10); ANOVA (chapter 12) | stats.inference (no diagnostic item) |
| Resampling, design and causal basics | outline | — | The bootstrap; Designing experiments; Causal inference basics; Bayesian inference; Time-series foundations | stats.inference (no diagnostic item) |

## Machine Learning

Validation, metrics, models and the mathematics behind them.

### Machine Learning & Data Science — partial

How to know whether a model works: validation, metrics, calibration and fairness — then the models themselves. About 70 hours when complete.

| Unit | Status | Authored lessons | Planned lessons | Exit competencies |
|---|---|---|---|---|
| Data, EDA and reproducibility | outline | — | Data cleaning; Exploratory analysis; Reproducibility | ml.validation (no diagnostic item) |
| Validation and leakage | authored | **Validation, cross-validation and leakage** | — | ml.validation (no diagnostic item) |
| Classification metrics and uncertainty | authored | **Confusion matrix, precision, recall and ROC**<br>**Calibration and fairness checks** | — | ml.classification-metrics (no diagnostic item), ml.calibration-fairness (no diagnostic item) |
| Bias–variance and regularization | outline | — | Regularization | ml.validation (no diagnostic item) |
| Regression, classification, trees and ensembles | outline | — | Logistic regression; Decision trees; Ensembles | ml.classification-metrics (no diagnostic item) |
| Clustering and dimensionality reduction | outline | — | k-means; PCA in practice | la.svd-pca (no diagnostic item) |
| Pipelines, tuning, interpretability and deployment | outline | — | Pipelines and hyperparameter search; Interpretability; Deployment and drift | ml.validation (no diagnostic item) |
| Neural networks and optimization mathematics | outline | — | A neural network by hand; Optimizers | calc.optimization (no diagnostic item) |

## Python for Data Science

Python, NumPy and the habits that make numerical code trustworthy.

### Python for Data Science — outline

Python from first principles to NumPy, with graded exercises that run in your browser. About 50 hours when complete.

| Unit | Status | Authored lessons | Planned lessons | Exit competencies |
|---|---|---|---|---|
| Python basics | outline | — | Values and variables; Functions; Control flow | py.basics |
| Lists and dictionaries | outline | — | Lists; Dictionaries | py.collections |
| Debugging | outline | — | Reading tracebacks | py.debugging |
| NumPy arrays and broadcasting | outline | — | Arrays; Broadcasting; Floating-point precision | py.numpy |
| pandas, matplotlib, SciPy and scikit-learn | outline | — | pandas DataFrames; Plotting; SciPy; scikit-learn | py.numpy |
| Reproducible, tested code | outline | — | Testing numerical code; Clean code | py.debugging |

## Authored lessons

| Lesson | Course | Competencies | Labs | Minutes | Review |
|---|---|---|---|---|---|
| Ratios, rates and unit rates (`pa-ratios-rates`) | Prealgebra | arith.ratios | ratio | 30 | awaiting-human-review |
| Solving equations by keeping balance (`pa-equation-balance`) | Prealgebra | arith.equations, alg.linear-eq | equation-balance | 35 | awaiting-human-review |
| Break-even: when does a business cover its costs? (`a1-break-even`) | Algebra I | alg.linear-eq | break-even | 35 | awaiting-human-review |
| Slope as rate of change (`a1-slope`) | Algebra I | alg.slope | slope | 35 | awaiting-human-review |
| Slope–intercept form (`a1-slope-intercept`) | Algebra I | alg.slope-intercept | function-transformations | 35 | awaiting-human-review |
| Fitting a line to data (`a1-line-fit`) | Algebra I | alg.line-fit | least-squares | 45 | awaiting-human-review |
| Vectors and the dot product (`la-dot-product`) | Linear Algebra | la.vector-ops, la.dot-product | vectors-dot | 40 | awaiting-human-review |
| Projection onto a vector (`la-projection`) | Linear Algebra | la.projection | vectors-dot | 40 | awaiting-human-review |
| Matrix–vector products: scoring customers (`la-matrix-scores`) | Linear Algebra | la.matrix-mult | matrix-scores | 40 | awaiting-human-review |
| Matrices as transformations (`la-matrix-transform`) | Linear Algebra | la.matrix-mult | matrix-transform, eigenvectors | 45 | awaiting-human-review |
| Gaussian elimination (`la-elimination`) | Linear Algebra | la.elimination | gaussian-elimination | 45 | awaiting-human-review |
| Principal components and the SVD (`la-svd-pca`) | Linear Algebra | la.svd-pca | svd-pca | 50 | awaiting-human-review |
| The derivative from first principles (`c1-derivative`) | Calculus I — Limits and Derivatives | calc.derivative | slope | 45 | awaiting-human-review |
| Marginal cost: what does one more unit cost? (`c1-marginal-cost`) | Calculus I — Limits and Derivatives | calc.derivative | marginal-cost | 40 | awaiting-human-review |
| Area as a limit of Riemann sums (`c2-riemann`) | Calculus II — Integrals and Series | calc.integral | riemann | 45 | awaiting-human-review |
| Taylor polynomials (`c2-taylor`) | Calculus II — Integrals and Series | calc.series | taylor | 45 | awaiting-human-review |
| Partial derivatives and the gradient (`c3-gradient`) | Calculus III — Multivariable Calculus and Optimization | calc.gradient, calc.optimization | gradient-hessian | 50 | awaiting-human-review |
| Gradient descent (`c3-gradient-descent`) | Calculus III — Multivariable Calculus and Optimization | calc.optimization | gradient-descent | 45 | awaiting-human-review |
| Sampling distributions and the central limit theorem (`st-sampling-clt`) | Probability & Statistics | stats.sampling | sampling | 45 | awaiting-human-review |
| Bayes’ theorem as updating (`st-bayes`) | Probability & Statistics | stats.bayes | bayes | 40 | awaiting-human-review |
| Validation, cross-validation and leakage (`ml-validation`) | Machine Learning & Data Science | ml.validation | cross-validation | 45 | awaiting-human-review |
| Confusion matrix, precision, recall and ROC (`ml-classification-metrics`) | Machine Learning & Data Science | ml.classification-metrics | decision-boundary | 50 | awaiting-human-review |
| Calibration and fairness checks (`ml-calibration-fairness`) | Machine Learning & Data Science | ml.calibration-fairness | calibration | 45 | awaiting-human-review |

## Diagnostic coverage

32 of 47 competencies have diagnostic items (at least 2 each; 64 items). Not covered: `arith.exponents`, `arith.coordinates`, `alg.line-fit`, `la.projection`, `la.eigen`, `la.svd-pca`, `calc.rules`, `calc.series`, `calc.gradient`, `calc.optimization`, `stats.inference`, `ml.validation`, `ml.classification-metrics`, `ml.calibration-fairness`, `py.data` — mostly beyond the placement path, which only needs to choose between Prealgebra and Calculus I.

