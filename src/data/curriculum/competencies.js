// Competencies — the unit of evidence (docs/LEARNING_ASSESSMENT_SPEC.md).
//
// A competency is one thing a learner can be shown to do. Diagnostic items,
// lesson checkpoints and practice all record evidence against these ids, and
// mastery is computed per competency from that evidence — never from page
// views or time spent (§6). `domain` groups them for the diagnostic's
// screening stage (§8: arithmetic, algebra, functions, trig/precalculus,
// vectors/matrices, calculus readiness, statistics, Python).

export const DOMAINS = [
  { id: 'arithmetic', title: 'Arithmetic & number sense' },
  { id: 'algebra', title: 'Algebra' },
  { id: 'functions', title: 'Functions & graphs' },
  { id: 'trig', title: 'Trigonometry & precalculus' },
  { id: 'linalg', title: 'Vectors & matrices' },
  { id: 'calculus', title: 'Calculus readiness' },
  { id: 'statistics', title: 'Statistics & probability' },
  { id: 'python', title: 'Python fundamentals' },
];

export const COMPETENCIES = [
  // Arithmetic & number sense (Prealgebra)
  { id: 'arith.integers', domain: 'arithmetic', title: 'Operate with signed integers' },
  { id: 'arith.fractions', domain: 'arithmetic', title: 'Operate with fractions, decimals and percentages' },
  { id: 'arith.order-ops', domain: 'arithmetic', title: 'Evaluate expressions with the order of operations' },
  { id: 'arith.exponents', domain: 'arithmetic', title: 'Use exponents, roots and scientific notation' },
  { id: 'arith.ratios', domain: 'arithmetic', title: 'Reason with ratios, rates and unit rates' },
  { id: 'arith.equations', domain: 'arithmetic', title: 'Solve one- and two-step equations by balancing' },
  { id: 'arith.coordinates', domain: 'arithmetic', title: 'Plot and read points on the coordinate plane' },

  // Algebra
  { id: 'alg.linear-eq', domain: 'algebra', title: 'Solve multi-step linear equations and inequalities' },
  { id: 'alg.slope', domain: 'algebra', title: 'Find and interpret slope as a rate of change' },
  { id: 'alg.slope-intercept', domain: 'algebra', title: 'Write and interpret y = mx + b' },
  { id: 'alg.line-fit', domain: 'algebra', title: 'Fit and interpret a least-squares line' },
  { id: 'alg.systems', domain: 'algebra', title: 'Solve systems of linear equations' },
  { id: 'alg.quadratics', domain: 'algebra', title: 'Factor and solve quadratics' },
  { id: 'alg.exp-log', domain: 'algebra', title: 'Use exponential and logarithmic functions' },

  // Functions & graphs
  { id: 'func.notation', domain: 'functions', title: 'Read and evaluate function notation' },
  { id: 'func.transform', domain: 'functions', title: 'Predict the effect of shifts and stretches on a graph' },
  { id: 'func.compose-inverse', domain: 'functions', title: 'Compose and invert functions' },

  // Trigonometry & precalculus
  { id: 'trig.unit-circle', domain: 'trig', title: 'Use the unit circle and radian measure' },
  { id: 'trig.identities', domain: 'trig', title: 'Apply core trigonometric identities' },
  { id: 'trig.vectors-plane', domain: 'trig', title: 'Represent vectors in the plane by components' },

  // Vectors & matrices
  { id: 'la.vector-ops', domain: 'linalg', title: 'Add, scale and measure vectors' },
  { id: 'la.dot-product', domain: 'linalg', title: 'Compute and interpret the dot product' },
  { id: 'la.projection', domain: 'linalg', title: 'Project one vector onto another' },
  { id: 'la.matrix-mult', domain: 'linalg', title: 'Multiply matrices and read them as transformations' },
  { id: 'la.elimination', domain: 'linalg', title: 'Solve systems by Gaussian elimination' },
  { id: 'la.eigen', domain: 'linalg', title: 'Find and interpret eigenvectors' },
  { id: 'la.svd-pca', domain: 'linalg', title: 'Interpret the SVD and principal components' },

  // Calculus
  { id: 'calc.limits', domain: 'calculus', title: 'Reason about limits and continuity' },
  { id: 'calc.derivative', domain: 'calculus', title: 'Compute a derivative from the definition' },
  { id: 'calc.rules', domain: 'calculus', title: 'Apply derivative rules, including the chain rule' },
  { id: 'calc.integral', domain: 'calculus', title: 'Interpret and approximate definite integrals' },
  { id: 'calc.series', domain: 'calculus', title: 'Approximate functions with Taylor polynomials' },
  { id: 'calc.gradient', domain: 'calculus', title: 'Compute and interpret partial derivatives and the gradient' },
  { id: 'calc.optimization', domain: 'calculus', title: 'Optimize with gradients, Hessians and gradient descent' },

  // Statistics & probability
  { id: 'stats.descriptive', domain: 'statistics', title: 'Summarize data with center and spread' },
  { id: 'stats.probability', domain: 'statistics', title: 'Apply probability rules and conditional probability' },
  { id: 'stats.bayes', domain: 'statistics', title: 'Update beliefs with Bayes’ theorem' },
  { id: 'stats.sampling', domain: 'statistics', title: 'Explain sampling distributions and the CLT' },
  { id: 'stats.inference', domain: 'statistics', title: 'Build confidence intervals and run tests' },
  { id: 'ml.validation', domain: 'statistics', title: 'Validate models without leakage' },
  { id: 'ml.classification-metrics', domain: 'statistics', title: 'Choose and read classification metrics' },
  { id: 'ml.calibration-fairness', domain: 'statistics', title: 'Check calibration and group fairness' },

  // Python
  { id: 'py.basics', domain: 'python', title: 'Read and write basic Python (values, functions, control flow)' },
  { id: 'py.collections', domain: 'python', title: 'Use lists and dictionaries' },
  { id: 'py.numpy', domain: 'python', title: 'Compute with NumPy arrays and broadcasting' },
  { id: 'py.debugging', domain: 'python', title: 'Find and fix a bug from an error message' },
];

export const competencyById = Object.fromEntries(COMPETENCIES.map((c) => [c.id, c]));
export const domainById = Object.fromEntries(DOMAINS.map((d) => [d.id, d]));
