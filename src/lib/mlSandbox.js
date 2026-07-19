// Small, dependency-free client-side model fitting for Module 4's
// playground. No ML library is installed (rule 5: prefer no new
// dependency), and these two fitters are simple enough to implement
// directly — polynomial regression via normal equations, and a depth-
// limited regression tree via recursive variance-reducing splits.

// Mulberry32 seeded PRNG — deterministic so "the same noise level" produces
// the same-looking dataset until the user explicitly regenerates, matching
// the "small bundled synthetic dataset" spec (not re-randomized every render).
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianRandom(rng) {
  // Box-Muller
  const u1 = Math.max(rng(), 1e-9);
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// The "true function" underlying the data — moderately wiggly so it
// genuinely rewards nonlinear fits and punishes both under- and overfitting.
export function trueFunction(x) {
  return 2.5 * Math.sin(1.3 * x) + 0.4 * x;
}

export function generateDataset(noiseLevel, seed = 42) {
  const rng = mulberry32(seed);
  const nTrain = 32;
  const nVal = 18;
  const xMin = -4;
  const xMax = 4;
  const makePoints = (n) =>
    Array.from({ length: n }, () => {
      const x = xMin + rng() * (xMax - xMin);
      const y = trueFunction(x) + gaussianRandom(rng) * noiseLevel;
      return { x, y };
    }).sort((a, b) => a.x - b.x);
  return { train: makePoints(nTrain), val: makePoints(nVal), xMin, xMax };
}

// ---- Polynomial regression (degree = complexity) ----
function solveLinearSystem(A, b) {
  // Gaussian elimination with partial pivoting. A is n×n, b is length n.
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    [M[col], M[pivot]] = [M[pivot], M[col]];
    if (Math.abs(M[col][col]) < 1e-10) continue; // near-singular; leave row as-is
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = M[r][col] / M[col][col];
      for (let c = col; c <= n; c++) M[r][c] -= factor * M[col][c];
    }
  }
  return M.map((row, i) => (Math.abs(row[i]) < 1e-10 ? 0 : row[n] / row[i]));
}

export function fitPolynomial(points, degree) {
  const d = Math.max(1, Math.min(degree, 12));
  // Design matrix columns: 1, x, x^2, ..., x^d
  const rows = points.map((p) => Array.from({ length: d + 1 }, (_, k) => p.x ** k));
  const XtX = Array.from({ length: d + 1 }, (_, i) =>
    Array.from({ length: d + 1 }, (_, j) => rows.reduce((acc, row) => acc + row[i] * row[j], 0))
  );
  const Xty = Array.from({ length: d + 1 }, (_, i) => rows.reduce((acc, row, k) => acc + row[i] * points[k].y, 0));
  const coeffs = solveLinearSystem(XtX, Xty);
  const predict = (x) => coeffs.reduce((acc, c, k) => acc + c * x ** k, 0);
  return { predict, coeffs };
}

// ---- Regression tree (max depth = complexity) ----
function variance(ys) {
  if (ys.length === 0) return 0;
  const mean = ys.reduce((a, b) => a + b, 0) / ys.length;
  return ys.reduce((acc, y) => acc + (y - mean) ** 2, 0) / ys.length;
}

function buildTree(points, depth, maxDepth) {
  const ys = points.map((p) => p.y);
  const mean = ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 0;
  if (depth >= maxDepth || points.length < 4) return { leaf: true, value: mean };

  const sorted = [...points].sort((a, b) => a.x - b.x);
  let bestSplit = null;
  let bestScore = variance(ys) * points.length;
  for (let i = 4; i < sorted.length - 4; i++) {
    const threshold = (sorted[i - 1].x + sorted[i].x) / 2;
    const left = sorted.slice(0, i);
    const right = sorted.slice(i);
    const score = variance(left.map((p) => p.y)) * left.length + variance(right.map((p) => p.y)) * right.length;
    if (score < bestScore) {
      bestScore = score;
      bestSplit = { threshold, left, right };
    }
  }
  if (!bestSplit) return { leaf: true, value: mean };
  return {
    leaf: false,
    threshold: bestSplit.threshold,
    left: buildTree(bestSplit.left, depth + 1, maxDepth),
    right: buildTree(bestSplit.right, depth + 1, maxDepth),
  };
}

export function fitTree(points, maxDepth) {
  const depth = Math.max(1, Math.min(maxDepth, 8));
  const tree = buildTree(points, 0, depth);
  const predictOne = (node, x) => (node.leaf ? node.value : predictOne(x < node.threshold ? node.left : node.right, x));
  return { predict: (x) => predictOne(tree, x), tree };
}

export function meanSquaredError(points, predict) {
  if (!points.length) return 0;
  return points.reduce((acc, p) => acc + (p.y - predict(p.x)) ** 2, 0) / points.length;
}

// A series whose generating relationship visibly shifts partway through —
// Module 5's concept-drift demo. Before the break, y tracks x closely; after
// it, the relationship's slope/offset changes, so a model trained only on
// the first half degrades on the second.
export function generateDriftSeries(n = 40, breakAt = 24, seed = 11) {
  const rng = mulberry32(seed);
  const points = [];
  for (let t = 0; t < n; t++) {
    const x = gaussianRandom(rng) * 1.2;
    const y = t < breakAt ? 1.8 * x + 1 : -1.2 * x + 4; // slope flips sign post-break
    points.push({ t, x, y: y + gaussianRandom(rng) * 0.5 });
  }
  return { points, breakAt };
}

// Full metrics panel (Module 5, research doc §5) computed against the same
// fitted points Module 4 produces — no separate fitting path.
export function computeMetrics(points, predict, numParams) {
  const n = points.length;
  const errors = points.map((p) => p.y - predict(p.x));
  const mae = errors.reduce((a, e) => a + Math.abs(e), 0) / n;
  const mse = errors.reduce((a, e) => a + e * e, 0) / n;
  const rmse = Math.sqrt(mse);
  const mape = (points.reduce((a, p) => a + Math.abs((p.y - predict(p.x)) / (p.y || 1e-6)), 0) / n) * 100;
  const yMean = points.reduce((a, p) => a + p.y, 0) / n;
  const ssTot = points.reduce((a, p) => a + (p.y - yMean) ** 2, 0);
  const ssRes = errors.reduce((a, e) => a + e * e, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  // AIC/BIC from Gaussian-likelihood RSS approximation: standard for
  // comparing least-squares fits of differing complexity.
  const aic = n * Math.log(ssRes / n) + 2 * numParams;
  const bic = n * Math.log(ssRes / n) + numParams * Math.log(n);
  return { mae, rmse, mape, r2, aic, bic };
}

// Precomputes train/validation MSE across the full complexity range, for
// the train-vs-validation-error-curve chart (the classic bias-variance
// diagram) — independent of whatever single complexity the slider is
// currently at.
export function complexityCurve(dataset, model, maxComplexity) {
  const fitter = model === 'tree' ? fitTree : fitPolynomial;
  const out = [];
  for (let c = 1; c <= maxComplexity; c++) {
    const { predict } = fitter(dataset.train, c);
    out.push({
      complexity: c,
      trainError: meanSquaredError(dataset.train, predict),
      valError: meanSquaredError(dataset.val, predict),
    });
  }
  return out;
}
