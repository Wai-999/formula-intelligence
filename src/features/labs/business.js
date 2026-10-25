// The arithmetic behind the applied V4 labs, kept apart from the drawing so
// it can be tested against hand-computed cases (__tests__/labMath.test.js).

/** Break-even quantity q* = F / (p − v); Infinity when no quantity breaks even (p ≤ v, F > 0). */
export function breakEven({ F, p, v }) {
  const margin = p - v;
  if (margin <= 0) return F > 0 ? Infinity : 0;
  return F / margin;
}

/** Profit (p − v)q − F. */
export function profitAt({ F, p, v }, q) {
  return (p - v) * q - F;
}

/** Quadratic cost C(q) = F + aq + bq², its derivative a + 2bq. */
export const cost = ({ F, a, b }, q) => F + a * q + b * q * q;
export const marginalCost = ({ a, b }, q) => a + 2 * b * q;

/**
 * Forward-difference estimate of C'(q) from cost records that each carry a
 * measurement error: (C(q + h) + e₂ − C(q) − e₁) / h. The errors are passed
 * in, so the estimate is deterministic and testable.
 */
export function differenceQuotient(model, q, h, e1 = 0, e2 = 0) {
  return (cost(model, q + h) + e2 - cost(model, q) - e1) / h;
}

/** Xw for a matrix given as rows. */
export function matVec(X, w) {
  return X.map((row) => row.reduce((s, x, j) => s + x * w[j], 0));
}

/** Column-standardized copy of X: (x − mean) / population SD, per column. */
export function standardize(X) {
  const n = X.length;
  const d = X[0].length;
  const mean = Array.from({ length: d }, (_, j) => X.reduce((s, r) => s + r[j], 0) / n);
  const sd = Array.from({ length: d }, (_, j) => Math.sqrt(X.reduce((s, r) => s + (r[j] - mean[j]) ** 2, 0) / n));
  return X.map((r) => r.map((x, j) => (sd[j] === 0 ? 0 : (x - mean[j]) / sd[j])));
}
