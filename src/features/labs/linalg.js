// Small exact routines for the 2×2 labs. Tested in __tests__/labMath.test.js.

/**
 * Eigenvalues and unit eigenvectors of [[a, b], [c, d]].
 * Returns { real: true, values: [λ1, λ2] (λ1 ≥ λ2), vectors } or
 * { real: false, re, im } for a complex pair.
 */
export function eigen2(a, b, c, d) {
  const tr = a + d;
  const det = a * d - b * c;
  const disc = tr * tr - 4 * det;
  if (disc < -1e-12) return { real: false, re: tr / 2, im: Math.sqrt(-disc) / 2 };
  const s = Math.sqrt(Math.max(0, disc));
  const values = [(tr + s) / 2, (tr - s) / 2];
  const vectors = [];
  for (const lam of disc > 1e-12 ? values : [values[0]]) {
    // Solve (A − λI)v = 0 using whichever row is non-zero.
    let v;
    if (Math.abs(b) > 1e-12 || Math.abs(a - lam) > 1e-12) v = [b, lam - a];
    else if (Math.abs(c) > 1e-12 || Math.abs(d - lam) > 1e-12) v = [lam - d, c];
    else v = [1, 0];
    if (Math.hypot(v[0], v[1]) < 1e-12) v = [1, 0];
    const n = Math.hypot(v[0], v[1]);
    v = [v[0] / n, v[1] / n];
    if (v[0] < 0 || (v[0] === 0 && v[1] < 0)) v = [-v[0], -v[1]];
    vectors.push(v);
  }
  // A scalar multiple of I keeps every direction; report the axes.
  if (disc <= 1e-12 && Math.abs(b) < 1e-12 && Math.abs(c) < 1e-12 && Math.abs(a - d) < 1e-12) {
    return { real: true, values, vectors: [[1, 0], [0, 1]], everyDirection: true };
  }
  return { real: true, values, vectors };
}

/** Sample covariance matrix entries of 2-D points. */
export function covariance2(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  }
  return { mx, my, cxx: sxx / (n - 1), cxy: sxy / (n - 1), cyy: syy / (n - 1) };
}

const EPS = 1e-10;

/** One forward-elimination move on an augmented n×(n+1) matrix, or null when in echelon form. */
export function nextEliminationStep(m) {
  const rows = m.length;
  const cols = m[0].length - 1;
  let pr = 0;
  for (let col = 0; col < cols && pr < rows; col++) {
    let p = -1;
    for (let r = pr; r < rows; r++) if (Math.abs(m[r][col]) > EPS) { p = r; break; }
    if (p === -1) continue;
    if (p !== pr) {
      const next = m.map((row, i) => (i === pr ? m[p] : i === p ? m[pr] : row));
      return { m: next, text: `Swap R${pr + 1} and R${p + 1} (zero pivot)` };
    }
    for (let r = pr + 1; r < rows; r++) {
      if (Math.abs(m[r][col]) > EPS) {
        const k = m[r][col] / m[pr][col];
        const next = m.map((row, i) => (i === r ? row.map((v, c) => v - k * m[pr][c]) : row));
        return { m: next, text: `R${r + 1} ← R${r + 1} − (${+k.toFixed(4)})·R${pr + 1}` };
      }
    }
    pr += 1;
  }
  return null;
}

/**
 * What an augmented matrix currently says.
 * { pivots: [{row, col}], echelon, consistent, solution?, free?, message }
 */
export function analyzeEchelon(m) {
  const cols = m[0].length - 1;
  const lead = m.map((r) => r.slice(0, cols).findIndex((v) => Math.abs(v) > EPS));
  const contradiction = m.findIndex((r, i) => lead[i] === -1 && Math.abs(r[cols]) > EPS);
  let echelon = true;
  let last = -1;
  let seenZero = false;
  lead.forEach((l) => {
    if (l === -1) { seenZero = true; return; }
    if (seenZero || l <= last) echelon = false;
    last = l;
  });
  const pivots = echelon ? lead.map((col, row) => ({ row, col })).filter((p) => p.col !== -1) : [];
  if (contradiction !== -1) {
    return { pivots, echelon, consistent: false, message: `No solution: row ${contradiction + 1} says 0 = ${+m[contradiction][cols].toFixed(4)}, which is false.` };
  }
  if (!echelon) {
    const hint = nextEliminationStep(m);
    return { pivots, echelon, consistent: true, message: `Not in echelon form yet. A good next move: ${hint ? hint.text : 'clear the entries below each pivot'}.` };
  }
  if (pivots.length === cols) {
    const x = new Array(cols).fill(0);
    for (let i = cols - 1; i >= 0; i--) {
      let s = m[i][cols];
      for (let j = i + 1; j < cols; j++) s -= m[i][j] * x[j];
      x[i] = s / m[i][i];
    }
    const names = ['x', 'y', 'z', 'w'];
    return { pivots, echelon, consistent: true, solution: x, message: `Echelon form with ${cols} pivots: back substitution gives ${x.map((v, i) => `${names[i]} = ${+v.toFixed(4)}`).join(', ')}.` };
  }
  const free = cols - pivots.length;
  return { pivots, echelon, consistent: true, free, message: `Echelon form with ${pivots.length} pivots for ${cols} unknowns: ${free} free variable${free > 1 ? 's' : ''}, so infinitely many solutions.` };
}
