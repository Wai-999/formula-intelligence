/** Ordinary least squares for one predictor. Tested in src/features/labs/__tests__/labMath.test.js. */
export function leastSquares(xs, ys) {
  const n = xs.length;
  const xbar = xs.reduce((s, v) => s + v, 0) / n;
  const ybar = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
    sxx += (xs[i] - xbar) ** 2;
  }
  const m = sxx === 0 ? NaN : sxy / sxx;
  const b = ybar - m * xbar;
  const sse = xs.reduce((s, x, i) => s + (ys[i] - (m * x + b)) ** 2, 0);
  return { m, b, xbar, ybar, sse, sxx, sxy };
}
