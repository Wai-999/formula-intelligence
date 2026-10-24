// Numerical calculus for the labs. Tested in __tests__/labMath.test.js.

/** Riemann / trapezoid sum of f on [a, b] with n equal strips. */
export function riemann(f, a, b, n, method) {
  const dx = (b - a) / n;
  let s = 0;
  for (let i = 0; i < n; i++) {
    const x0 = a + i * dx;
    const x1 = x0 + dx;
    if (method === 'left') s += f(x0);
    else if (method === 'right') s += f(x1);
    else if (method === 'mid') s += f((x0 + x1) / 2);
    else s += (f(x0) + f(x1)) / 2;
  }
  return s * dx;
}

/** Taylor polynomial value from derivative values at the centre: Σ d[k]/k! (x − a)^k. */
export function taylorValue(derivs, a, x) {
  let s = 0;
  let fact = 1;
  for (let k = 0; k < derivs.length; k++) {
    if (k > 0) fact *= k;
    s += (derivs[k] / fact) * (x - a) ** k;
  }
  return s;
}

/** Central-difference gradient of f: R² → R. */
export function numericGradient(f, x, y, h = 1e-5) {
  return [(f(x + h, y) - f(x - h, y)) / (2 * h), (f(x, y + h) - f(x, y - h)) / (2 * h)];
}

/**
 * Marching-squares contour segments of f at `level` over a grid.
 * Returns [[x1, y1, x2, y2], ...] in data coordinates.
 */
export function contour(f, [x0, x1], [y0, y1], level, n = 48) {
  const segs = [];
  const dx = (x1 - x0) / n;
  const dy = (y1 - y0) / n;
  const interp = (xa, ya, va, xb, yb, vb) => {
    const t = (level - va) / (vb - va);
    return [xa + t * (xb - xa), ya + t * (yb - ya)];
  };
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const xa = x0 + i * dx;
      const ya = y0 + j * dy;
      const c = [[xa, ya], [xa + dx, ya], [xa + dx, ya + dy], [xa, ya + dy]];
      const v = c.map(([p, q]) => f(p, q));
      const pts = [];
      for (let k = 0; k < 4; k++) {
        const k2 = (k + 1) % 4;
        if ((v[k] < level) !== (v[k2] < level)) pts.push(interp(c[k][0], c[k][1], v[k], c[k2][0], c[k2][1], v[k2]));
      }
      if (pts.length === 2) segs.push([...pts[0], ...pts[1]]);
      else if (pts.length === 4) { segs.push([...pts[0], ...pts[1]]); segs.push([...pts[2], ...pts[3]]); }
    }
  }
  return segs;
}
