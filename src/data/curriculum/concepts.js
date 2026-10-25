// Concept nodes of the knowledge graph (docs/FORMULA_GRAPH_SCHEMA.md).
//
// `requires` lists direct prerequisites only — the graph supplies the
// transitive closure. Requires-edges must form a DAG (tested): a cycle would
// make "what should I learn first?" unanswerable. Every edge here was chosen
// by asking "can this be learned, as taught in this curriculum, without that?"
// and is marked for independent human review in docs/CONTENT_QA.md.

const c = (id, title, subject, unit, requires, summary) => ({ id, kind: 'concept', title, subject, unit, requires, summary });

export const CONCEPTS = [
  // Foundations
  c('c.integers', 'Integers and signed arithmetic', 'foundations', 'pa-numbers', [], 'Whole numbers and their negatives, and how to add, subtract, multiply and divide them.'),
  c('c.fractions', 'Fractions, decimals and percentages', 'foundations', 'pa-fractions', ['c.integers'], 'Parts of a whole written three ways, and arithmetic with them.'),
  c('c.ratios', 'Ratios and rates', 'foundations', 'pa-ratios', ['c.fractions'], 'Comparing two quantities by division; a rate compares quantities with different units.'),
  c('c.units', 'Units and unit conversion', 'foundations', 'pa-ratios', ['c.ratios'], 'Carrying units through a calculation and converting with factors equal to one.'),
  c('c.expressions', 'Expressions and order of operations', 'foundations', 'pa-expressions', ['c.integers'], 'Combining numbers and variables, evaluated in a fixed order.'),
  c('c.exponents', 'Exponents, radicals and scientific notation', 'foundations', 'pa-expressions', ['c.expressions'], 'Repeated multiplication, its inverse, and writing very large or small numbers.'),
  c('c.equations', 'Equations and the balance principle', 'foundations', 'pa-equations', ['c.expressions'], 'An equation stays true when the same operation is applied to both sides.'),
  c('c.inequalities', 'Inequalities', 'foundations', 'pa-equations', ['c.equations'], 'Solving “less than” and “greater than” statements; multiplying by a negative flips the sign.'),
  c('c.coordinate-plane', 'The coordinate plane', 'foundations', 'pa-coordinate', ['c.integers'], 'Locating points by an ordered pair (x, y).'),

  // Algebra
  c('c.linear-equations', 'Multi-step linear equations', 'algebra', 'a1-linear-eq', ['c.equations'], 'Equations with variables on both sides, solved by repeated balancing.'),
  c('c.break-even', 'Break-even analysis', 'algebra', 'a1-linear-eq', ['c.linear-equations'], 'Profit as a linear function of quantity; the quantity where it is zero, and what the model assumes.'),
  c('c.slope', 'Slope as rate of change', 'algebra', 'a1-linear-rel', ['c.ratios', 'c.coordinate-plane'], 'Rise over run: how much y changes per unit change in x.'),
  c('c.slope-intercept', 'Slope–intercept form', 'algebra', 'a1-linear-rel', ['c.slope', 'c.equations'], 'Every non-vertical line is y = mx + b: a starting value plus a constant rate.'),
  c('c.line-fit', 'Fitting a line to data', 'algebra', 'a1-linear-rel', ['c.slope-intercept', 'c.descriptive'], 'The least-squares line makes the sum of squared vertical errors as small as possible.'),
  c('c.functions', 'Functions', 'algebra', 'a1-functions', ['c.slope-intercept'], 'A rule assigning exactly one output to each input; notation, domain and range.'),
  c('c.systems', 'Systems of linear equations', 'algebra', 'a1-systems', ['c.slope-intercept'], 'Several equations that must hold at once; geometrically, where lines meet.'),
  c('c.polynomials', 'Polynomials and factoring', 'algebra', 'a1-polynomials', ['c.expressions', 'c.exponents'], 'Sums of power terms, and rewriting them as products.'),
  c('c.quadratics', 'Quadratics', 'algebra', 'a1-quadratics', ['c.polynomials', 'c.functions'], 'Degree-two equations and parabolas.'),
  c('c.exponentials', 'Exponential models', 'algebra', 'a1-exponents', ['c.exponents', 'c.functions'], 'Growth or decay by a constant factor per step.'),
  c('c.logarithms', 'Logarithms', 'algebra', 'a2-exp-log', ['c.exponentials'], 'The inverse of exponentiation; turns products into sums.'),
  c('c.complex', 'Complex numbers', 'algebra', 'a2-complex', ['c.quadratics'], 'Numbers a + bi, which give every quadratic a root.'),
  c('c.composition-inverse', 'Composite and inverse functions', 'algebra', 'a2-inverse-composite', ['c.functions'], 'Chaining functions, and undoing them.'),
  c('c.sequences-series', 'Sequences and series', 'algebra', 'a2-sequences', ['c.functions', 'c.exponentials'], 'Ordered lists of numbers and their sums, including geometric series.'),
  c('c.transformations', 'Function transformations', 'algebra', 'a2-transformations', ['c.functions'], 'Shifts, stretches and reflections of a graph, read from its formula.'),
  c('c.proof', 'Proof and counterexample', 'algebra', 'a2-proof', ['c.expressions'], 'Showing a claim always holds — or that it fails once.'),

  // Precalculus
  c('c.geometry', 'Essential geometry', 'precalculus', 'pc-geometry', ['c.equations', 'c.exponents'], 'Similarity, the Pythagorean theorem, area and volume.'),
  c('c.vectors-plane', 'Vectors in the plane', 'precalculus', 'pc-vectors', ['c.coordinate-plane', 'c.geometry'], 'Arrows with length and direction, written by components.'),
  c('c.unit-circle', 'Radians and the unit circle', 'precalculus', 'pc-unit-circle', ['c.geometry'], 'Angles measured by arc length; sine and cosine as coordinates on a circle of radius 1.'),
  c('c.trig-functions', 'Trigonometric functions and identities', 'precalculus', 'pc-trig', ['c.unit-circle', 'c.functions'], 'Sine, cosine and tangent as periodic functions, and the identities linking them.'),
  c('c.inverse-trig', 'Inverse trigonometric functions', 'precalculus', 'pc-inverse-trig', ['c.trig-functions', 'c.composition-inverse'], 'Recovering an angle from a ratio, on a restricted domain.'),
  c('c.parametric-polar', 'Parametric and polar coordinates', 'precalculus', 'pc-param-polar', ['c.trig-functions'], 'Describing curves by a parameter, or by distance and angle.'),
  c('c.limits', 'Limits and continuity', 'calculus', 'c1-limits', ['c.functions'], 'The value a function approaches, whether or not it gets there.'),

  // Linear algebra
  c('c.vectors', 'Vectors and vector arithmetic', 'linear-algebra', 'la-vectors', ['c.vectors-plane'], 'Lists of numbers that add componentwise and scale by a number — in any dimension.'),
  c('c.norms', 'Norms and distances', 'linear-algebra', 'la-vectors', ['c.vectors', 'c.exponents'], 'The length of a vector and the distance between two of them.'),
  c('c.dot-product', 'The dot product', 'linear-algebra', 'la-vectors', ['c.vectors', 'c.norms'], 'Multiply matching components and add: a number that measures alignment.'),
  c('c.projection', 'Projection onto a vector', 'linear-algebra', 'la-vectors', ['c.dot-product'], 'The closest point on a line to a given vector, and the orthogonal leftover.'),
  c('c.matrices', 'Matrices and matrix multiplication', 'linear-algebra', 'la-matrices', ['c.dot-product'], 'Rectangular arrays; each entry of a product is a dot product.'),
  c('c.matrix-vector', 'Matrix–vector products as weighted scores', 'linear-algebra', 'la-matrices', ['c.dot-product'], 'A data matrix times a weight vector: one dot product per row, with a shape rule and a units trap.'),
  c('c.linear-transformations', 'Linear transformations', 'linear-algebra', 'la-matrices', ['c.matrices', 'c.functions'], 'Functions that preserve addition and scaling — exactly the ones a matrix can represent.'),
  c('c.determinant-inverse', 'Determinants and inverses', 'linear-algebra', 'la-matrices', ['c.linear-transformations'], 'How much a transformation scales area, and whether it can be undone.'),
  c('c.elimination', 'Gaussian elimination', 'linear-algebra', 'la-systems', ['c.matrices', 'c.systems'], 'Row operations that reduce a system to one you can solve by back-substitution.'),
  c('c.vector-spaces', 'Span, independence, basis and dimension', 'linear-algebra', 'la-spaces', ['c.elimination'], 'Which vectors you can reach, and the fewest you need to reach them.'),
  c('c.rank-nullity', 'The four subspaces and rank–nullity', 'linear-algebra', 'la-spaces', ['c.vector-spaces'], 'Column, row and null spaces, and how their dimensions add up.'),
  c('c.eigen', 'Eigenvalues and eigenvectors', 'linear-algebra', 'la-eigen', ['c.linear-transformations', 'c.determinant-inverse'], 'Directions a matrix only stretches, and by how much.'),
  c('c.orthogonality', 'Orthogonality, Gram–Schmidt and QR', 'linear-algebra', 'la-orthogonality', ['c.projection', 'c.vector-spaces'], 'Building perpendicular bases by subtracting projections.'),
  c('c.least-squares', 'Least squares', 'linear-algebra', 'la-orthogonality', ['c.orthogonality', 'c.projection'], 'The best approximate solution of an inconsistent system is a projection.'),
  c('c.svd', 'The singular value decomposition', 'linear-algebra', 'la-svd', ['c.eigen', 'c.orthogonality'], 'Every matrix is a rotation, an axis stretch and another rotation.'),
  c('c.pca', 'Principal component analysis', 'linear-algebra', 'la-svd', ['c.svd', 'c.descriptive'], 'The orthogonal directions of greatest variance in centred data.'),
  c('c.conditioning', 'Conditioning and numerical stability', 'linear-algebra', 'la-numerical', ['c.svd'], 'How much small input errors can grow in a computed answer.'),

  // Calculus
  c('c.derivative', 'The derivative', 'calculus', 'c1-derivative', ['c.limits', 'c.slope'], 'The instantaneous rate of change: the limit of average rates over shrinking intervals.'),
  c('c.marginal', 'Marginal analysis', 'calculus', 'c1-derivative', ['c.derivative'], 'The derivative as the cost (or revenue) of one more unit, and its limits when cost jumps.'),
  c('c.derivative-rules', 'Derivative rules', 'calculus', 'c1-rules', ['c.derivative'], 'Power, product and quotient rules: derivatives without limits every time.'),
  c('c.chain-rule', 'The chain rule', 'calculus', 'c1-rules', ['c.derivative-rules', 'c.composition-inverse'], 'The derivative of a composition is the product of the derivatives along the chain.'),
  c('c.optimization-1d', 'Extrema and optimization', 'calculus', 'c1-applications', ['c.derivative-rules'], 'Maxima and minima occur where the derivative is zero or undefined, or at endpoints.'),
  c('c.integral', 'The definite integral', 'calculus', 'c2-integrals', ['c.limits', 'c.sequences-series'], 'Accumulated total as the limit of Riemann sums.'),
  c('c.ftc', 'The Fundamental Theorem of Calculus', 'calculus', 'c2-integrals', ['c.integral', 'c.derivative'], 'Differentiation and integration undo each other.'),
  c('c.taylor', 'Taylor polynomials', 'calculus', 'c2-series', ['c.derivative-rules', 'c.sequences-series'], 'Polynomials that match a function’s value and derivatives at a point.'),
  c('c.partial-derivatives', 'Partial derivatives', 'calculus', 'c3-partials', ['c.derivative'], 'The rate of change in one input while the others are held fixed.'),
  c('c.gradient', 'The gradient', 'calculus', 'c3-partials', ['c.partial-derivatives', 'c.dot-product'], 'The vector of partial derivatives; it points uphill, steepest first.'),
  c('c.hessian', 'The Hessian', 'calculus', 'c3-partials', ['c.gradient', 'c.matrices'], 'The matrix of second partial derivatives: local curvature.'),
  c('c.jacobian', 'The Jacobian', 'calculus', 'c3-partials', ['c.gradient', 'c.matrices'], 'The matrix of partial derivatives of a vector-valued function.'),
  c('c.gradient-descent', 'Gradient descent', 'calculus', 'c3-optimization', ['c.gradient'], 'Repeatedly step against the gradient to decrease a function.'),
  c('c.backprop', 'Automatic differentiation and backpropagation', 'calculus', 'c3-optimization', ['c.chain-rule', 'c.jacobian', 'c.gradient-descent'], 'The chain rule applied mechanically through a computation graph.'),
  c('c.multiple-integrals', 'Multiple integrals and vector calculus', 'calculus', 'c3-integrals', ['c.integral', 'c.partial-derivatives'], 'Accumulating over regions, curves and surfaces.'),
  c('c.ode', 'Differential equations', 'calculus', 'c3-ode', ['c.ftc'], 'Equations relating a function to its derivatives.'),

  // Probability & statistics
  c('c.descriptive', 'Descriptive statistics', 'probability-statistics', 'ps-descriptive', ['c.fractions'], 'Summaries of center, spread and position.'),
  c('c.probability', 'Probability rules', 'probability-statistics', 'ps-probability', ['c.fractions'], 'Addition, multiplication and complement rules; counting outcomes.'),
  c('c.conditional-probability', 'Conditional probability', 'probability-statistics', 'ps-probability', ['c.probability'], 'Probability recomputed within the cases where something is known to have happened.'),
  c('c.bayes', 'Bayes’ theorem', 'probability-statistics', 'ps-bayes', ['c.conditional-probability'], 'Turning P(evidence | hypothesis) into P(hypothesis | evidence).'),
  c('c.distributions', 'Random variables and distributions', 'probability-statistics', 'ps-distributions', ['c.probability', 'c.descriptive'], 'Expectation, variance, and the binomial, Poisson and normal families.'),
  c('c.sampling', 'Sampling distributions', 'probability-statistics', 'ps-sampling', ['c.distributions'], 'How a statistic varies from sample to sample.'),
  c('c.clt', 'The central limit theorem', 'probability-statistics', 'ps-sampling', ['c.sampling'], 'Means of independent samples are approximately normal, with spread σ/√n.'),
  c('c.inference', 'Confidence intervals and hypothesis tests', 'probability-statistics', 'ps-inference', ['c.clt'], 'Quantifying uncertainty about a population from a sample.'),
  c('c.regression-inference', 'Correlation and regression inference', 'probability-statistics', 'ps-regression', ['c.line-fit', 'c.inference'], 'How sure we are about a fitted slope, and what r measures.'),
  c('c.bootstrap', 'The bootstrap', 'probability-statistics', 'ps-modern', ['c.sampling'], 'Estimating a sampling distribution by resampling the data itself.'),
  c('c.causal', 'Experimental design and causal basics', 'probability-statistics', 'ps-modern', ['c.inference'], 'Why randomization licenses causal claims and confounding undermines them.'),

  // Machine learning
  c('c.validation', 'Validation, cross-validation and baselines', 'machine-learning', 'ml-validation', ['c.descriptive', 'c.line-fit'], 'Estimating performance on data the model has never seen.'),
  c('c.leakage', 'Leakage', 'machine-learning', 'ml-validation', ['c.validation'], 'Information from outside the training data that inflates a score.'),
  c('c.confusion-matrix', 'Confusion matrix, precision, recall and F1', 'machine-learning', 'ml-metrics', ['c.conditional-probability', 'c.validation'], 'Counting the four kinds of right and wrong, and the rates built from them.'),
  c('c.roc-pr', 'ROC and precision–recall curves', 'machine-learning', 'ml-metrics', ['c.confusion-matrix'], 'How the error trade-off moves as the decision threshold changes.'),
  c('c.calibration', 'Calibration', 'machine-learning', 'ml-metrics', ['c.confusion-matrix'], 'Whether predicted probabilities match observed frequencies.'),
  c('c.fairness', 'Group fairness checks', 'machine-learning', 'ml-metrics', ['c.confusion-matrix'], 'Comparing error rates across groups — and why not every fairness criterion can hold at once.'),
  c('c.bias-variance', 'Bias–variance trade-off', 'machine-learning', 'ml-bias-variance', ['c.validation'], 'Error from wrong assumptions versus error from sensitivity to the sample.'),
  c('c.regularization', 'Regularization', 'machine-learning', 'ml-bias-variance', ['c.bias-variance', 'c.least-squares'], 'Penalizing complexity to trade a little bias for less variance.'),
  c('c.logistic-regression', 'Logistic regression', 'machine-learning', 'ml-models', ['c.exponentials', 'c.gradient-descent', 'c.probability'], 'A linear score passed through the logistic function to give a probability.'),

  // Python
  c('c.py-basics', 'Python basics', 'python', 'py-basics', [], 'Values, variables, functions and control flow.'),
  c('c.py-collections', 'Lists and dictionaries', 'python', 'py-collections', ['c.py-basics'], 'Storing and transforming collections of values.'),
  c('c.py-debugging', 'Debugging Python', 'python', 'py-debugging', ['c.py-basics'], 'Reading tracebacks and testing hypotheses about a bug.'),
  c('c.numpy', 'NumPy arrays and broadcasting', 'python', 'py-numpy', ['c.py-collections', 'c.vectors'], 'Whole-array arithmetic, broadcasting rules and floating-point limits.'),
];

// Non-prerequisite relationships (§7). Direction reads "source TYPE target".
// Targets may be Bluman formulas (bluman:<id>, the 94-formula map), ML
// models (model:<id>, the Model map) or applications (app:<id>).
export const RELATIONS = [
  ['c.derivative', 'generalizes', 'c.slope'],
  ['c.gradient', 'generalizes', 'c.derivative'],
  ['c.least-squares', 'generalizes', 'c.line-fit'],
  ['c.projection', 'used_in', 'c.least-squares'],
  ['c.dot-product', 'used_in', 'c.matrices'],
  ['c.svd', 'used_in', 'c.pca'],
  ['c.line-fit', 'contrasts_with', 'c.regression-inference'],
  ['c.slope', 'contrasts_with', 'c.ratios'],
  ['c.derivative', 'contrasts_with', 'c.slope'],
  ['c.integral', 'contrasts_with', 'c.derivative'],
  ['c.calibration', 'contrasts_with', 'c.roc-pr'],
  ['c.leakage', 'contrasts_with', 'c.validation'],
  ['c.conditional-probability', 'contrasts_with', 'c.bayes'],
  ['c.sampling', 'contrasts_with', 'c.distributions'],
  ['c.line-fit', 'used_in', 'bluman:reg'],
  ['c.line-fit', 'used_in', 'bluman:se_est'],
  ['c.descriptive', 'used_in', 'bluman:samp_sd'],
  ['c.descriptive', 'used_in', 'bluman:x_bar'],
  ['c.conditional-probability', 'used_in', 'bluman:cond_p'],
  ['c.probability', 'used_in', 'bluman:add2'],
  ['c.clt', 'used_in', 'bluman:clt'],
  ['c.sampling', 'used_in', 'bluman:sem'],
  ['c.inference', 'used_in', 'bluman:t_ci'],
  ['c.regression-inference', 'used_in', 'bluman:pearson'],
  ['c.line-fit', 'applies_to', 'model:linreg'],
  ['c.regularization', 'applies_to', 'model:ridge_lasso_en'],
  ['c.logistic-regression', 'applies_to', 'model:logreg'],
  ['c.bayes', 'applies_to', 'model:naive_bayes'],
  ['c.pca', 'applies_to', 'model:pca'],
  ['c.norms', 'applies_to', 'model:knn'],
  ['c.norms', 'applies_to', 'model:kmeans'],
  ['c.gradient-descent', 'applies_to', 'model:gbm'],
  ['c.backprop', 'applies_to', 'model:transformer'],
];
