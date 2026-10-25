import { describe, it, expect } from 'vitest';
import { riemann, taylorValue, numericGradient, contour } from '../calc.js';
import { eigen2, covariance2, nextEliminationStep, analyzeEchelon } from '../linalg.js';
import { posterior, confusionAt, rocAuc, rocCurve, brier, ppv } from '../prob.js';
import { descend } from '../optimize.js';
import { leastSquares } from '../fit.js';
import { breakEven, profitAt, cost, marginalCost, differenceQuotient, matVec, standardize } from '../business.js';

// The labs' arithmetic, checked against cases whose answers are known in
// closed form (acceptance test 4: "check numerical results against known
// cases"). The drawing code only ever plots what these return.

const close = (a, b, tol = 1e-9) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('calculus', () => {
  it('Riemann sums: exact for linear f with midpoints, converge to ∫₀¹ x² dx = 1/3', () => {
    close(riemann((x) => 2 * x + 1, 0, 3, 5, 'mid'), 12);
    close(riemann((x) => x * x, 0, 1, 4, 'left'), 0.21875);
    close(riemann((x) => x * x, 0, 1, 4, 'right'), 0.46875);
    close(riemann((x) => x * x, 0, 1, 1000, 'mid'), 1 / 3, 1e-6);
    // Trapezoid on x²: the error is exactly (b − a)·h²·f''/12 = 1/(6n²).
    close(riemann((x) => x * x, 0, 1, 10, 'trap'), 1 / 3 + 1 / 600);
  });

  it('Taylor polynomials of eˣ and cos x at 0 match known values', () => {
    const ones = Array(12).fill(1); // every derivative of eˣ at 0 is 1
    close(taylorValue(ones, 0, 1), Math.E, 1e-8);
    close(taylorValue([1, 0, -1, 0, 1], 0, 0.5), 1 - 0.125 + 0.0625 / 24);
    close(taylorValue([5], 2, 9), 5); // degree 0 is the constant
  });

  it('central-difference gradient agrees with the analytic gradient', () => {
    const f = (x, y) => x * x * y + Math.sin(y);
    const [gx, gy] = numericGradient(f, 1.5, -0.7);
    close(gx, 2 * 1.5 * -0.7, 1e-6);
    close(gy, 1.5 * 1.5 + Math.cos(-0.7), 1e-6);
  });

  it('contours of x² + y² = 1 lie on the unit circle', () => {
    const segs = contour((x, y) => x * x + y * y, [-2, 2], [-2, 2], 1, 40);
    expect(segs.length).toBeGreaterThan(20);
    for (const [x1, y1, x2, y2] of segs) {
      close(Math.hypot(x1, y1), 1, 0.02);
      close(Math.hypot(x2, y2), 1, 0.02);
    }
  });
});

describe('linear algebra', () => {
  it('eigen2: a symmetric matrix, a rotation, a shear and a scalar matrix', () => {
    const s = eigen2(2, 1, 1, 2);
    expect(s.values).toEqual([3, 1]);
    close(s.vectors[0][0], Math.SQRT1_2);
    close(s.vectors[0][1], Math.SQRT1_2);
    const rot = eigen2(0, -1, 1, 0); // 90° rotation: λ = ±i
    expect(rot.real).toBe(false);
    close(rot.im, 1);
    const shear = eigen2(1, 1, 0, 1); // one repeated eigenvalue, one direction
    expect(shear.values).toEqual([1, 1]);
    expect(shear.vectors).toEqual([[1, 0]]);
    expect(eigen2(3, 0, 0, 3).everyDirection).toBe(true);
  });

  it('eigenvectors satisfy Av = λv', () => {
    const [a, b, c, d] = [4, 1, 2, 3];
    const { values, vectors } = eigen2(a, b, c, d);
    values.forEach((lam, i) => {
      const [x, y] = vectors[i];
      close(a * x + b * y, lam * x);
      close(c * x + d * y, lam * y);
    });
  });

  it('sample covariance uses n − 1', () => {
    const { mx, my, cxx, cxy, cyy } = covariance2([1, 2, 3, 4], [2, 4, 6, 8]);
    expect([mx, my]).toEqual([2.5, 5]);
    close(cxx, 5 / 3);
    close(cxy, 10 / 3);
    close(cyy, 20 / 3);
  });

  it('elimination reaches echelon form and back-substitutes the unique solution', () => {
    // x + y + z = 6, 2y + 5z = −4, 2x + 5y − z = 27 → (5, 3, −2)
    let m = [[1, 1, 1, 6], [0, 2, 5, -4], [2, 5, -1, 27]];
    for (let i = 0; i < 10; i += 1) {
      const step = nextEliminationStep(m);
      if (!step) break;
      m = step.m;
    }
    const r = analyzeEchelon(m);
    expect(r.consistent).toBe(true);
    r.solution.forEach((v, i) => close(v, [5, 3, -2][i], 1e-9));
  });

  it('elimination swaps a zero pivot, and reports no-solution and free-variable systems', () => {
    expect(nextEliminationStep([[0, 1, 2], [1, 1, 3]]).text).toMatch(/Swap R1 and R2/);
    const none = analyzeEchelon([[1, 1, 2], [0, 0, 3]]);
    expect(none.consistent).toBe(false);
    const many = analyzeEchelon([[1, 2, 3], [0, 0, 0]]);
    expect(many.free).toBe(1);
  });
});

describe('probability and evaluation', () => {
  it('Bayes: a 1% prevalence, 90% sensitive, 9% false-positive test gives ≈ 9.2%', () => {
    close(posterior(0.01, 0.9, 0.09), 0.009 / (0.009 + 0.0891));
    close(ppv(0.01, 0.9, 0.09), posterior(0.01, 0.9, 0.09));
  });

  it('confusion counts and metrics at a threshold', () => {
    const c = confusionAt([0.9, 0.8, 0.4, 0.3, 0.2], [1, 0, 1, 0, 0], 0.5);
    expect([c.tp, c.fp, c.fn, c.tn]).toEqual([1, 1, 1, 2]);
    close(c.precision, 0.5);
    close(c.recall, 0.5);
    close(c.fpr, 1 / 3);
    close(c.f1, 0.5);
    close(c.accuracy, 0.6);
  });

  it('ROC AUC: perfect ranking 1, reversed 0, ties ½; the curve runs (0,0) → (1,1)', () => {
    expect(rocAuc([0.9, 0.8, 0.2, 0.1], [1, 1, 0, 0])).toBe(1);
    expect(rocAuc([0.1, 0.2, 0.8, 0.9], [1, 1, 0, 0])).toBe(0);
    expect(rocAuc([0.5, 0.5], [1, 0])).toBe(0.5);
    const curve = rocCurve([0.9, 0.6, 0.4, 0.1], [1, 0, 1, 0]);
    expect(curve[0]).toEqual([0, 0]);
    expect(curve.at(-1)).toEqual([1, 1]);
  });

  it('Brier score of perfect and of constant ½ forecasts', () => {
    expect(brier([1, 0, 1], [1, 0, 1])).toBe(0);
    expect(brier([0.5, 0.5], [1, 0])).toBe(0.25);
  });
});

describe('optimization and fitting', () => {
  it('gradient descent on f = x² + 10y² converges for small η and diverges past 2/L', () => {
    const grad = (x, y) => [2 * x, 20 * y];
    const ok = descend(grad, [3, 1], 0.05, 200).at(-1);
    close(ok[0], 0, 1e-6);
    close(ok[1], 0, 1e-6);
    // L = 20 (largest curvature); η = 0.11 > 2/20 makes y oscillate and grow.
    const bad = descend(grad, [3, 1], 0.11, 200);
    expect(Math.abs(bad.at(-1)[1])).toBeGreaterThan(1);
  });

  it('least squares recovers an exact line and matches the textbook formula', () => {
    const exact = leastSquares([0, 1, 2, 3], [1, 3, 5, 7]);
    close(exact.m, 2);
    close(exact.b, 1);
    close(exact.sse, 0);
    const r = leastSquares([1, 2, 3, 4, 5], [2, 4, 5, 4, 5]);
    close(r.m, 0.6);
    close(r.b, 2.2);
    expect(Number.isNaN(leastSquares([2, 2], [1, 3]).m)).toBe(true); // vertical data: no slope
  });
});

describe('applied labs (V4 exemplars)', () => {
  it('break-even: F / (p − v), and none when the margin is not positive', () => {
    expect(breakEven({ F: 1200, p: 18, v: 10 })).toBe(150);
    close(breakEven({ F: 500, p: 12, v: 5 }), 500 / 7);
    expect(breakEven({ F: 1200, p: 9, v: 10 })).toBe(Infinity);
    expect(profitAt({ F: 1200, p: 18, v: 10 }, 150)).toBe(0);
    expect(profitAt({ F: 1200, p: 18, v: 10 }, 200)).toBe(400);
  });

  it('marginal cost: the difference quotient of a quadratic is a + 2bq + bh exactly', () => {
    const m = { F: 200, a: 1.5, b: 0.002 };
    expect(cost(m, 300)).toBeCloseTo(830, 9);
    close(marginalCost(m, 300), 2.7);
    for (const h of [50, 10, 1, 0.1]) close(differenceQuotient(m, 300, h), 1.5 + 2 * 0.002 * 300 + 0.002 * h, 1e-6);
    // A $1 error in one record adds 1/h.
    close(differenceQuotient(m, 300, 0.01, 0, 1) - differenceQuotient(m, 300, 0.01), 100, 1e-6);
  });

  it('matrix–vector scores and standardization match NumPy', () => {
    const X = [[8, 25, 12], [2, 80, 3], [5, 40, 20], [1, 15, 1]];
    const s = matVec(X, [3, 0.2, 0.5]);
    [35, 23.5, 33, 6.5].forEach((v, i) => close(s[i], v));
    // np.round(((X - X.mean(0)) / X.std(0)) @ np.ones(3), 2) → [1.25, 0.09, 1.82, -3.16]
    const z = matVec(standardize(X), [1, 1, 1]);
    [1.25, 0.09, 1.82, -3.16].forEach((v, i) => close(Math.round(z[i] * 100) / 100, v));
    // Standardized columns have mean 0.
    const Z = standardize(X);
    for (let j = 0; j < 3; j += 1) close(Z.reduce((a, r) => a + r[j], 0), 0, 1e-9);
  });
});
