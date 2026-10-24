// Tiny, dependency-free plotting maths for the labs. d3-scale would do, but
// these four functions are all the labs need and keep each lab chunk small.

/** Linear map from [d0, d1] to [r0, r1], with .invert. */
export function linear(d0, d1, r0, r1) {
  const k = (r1 - r0) / (d1 - d0);
  const f = (v) => r0 + (v - d0) * k;
  f.invert = (p) => d0 + (p - r0) / k;
  f.domain = [d0, d1];
  f.range = [r0, r1];
  return f;
}

/** "Nice" tick values covering [lo, hi]: steps of 1, 2 or 5 × 10^k. */
export function ticks(lo, hi, count = 6) {
  const span = hi - lo;
  if (!(span > 0)) return [lo];
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const start = Math.ceil(lo / step - 1e-9) * step;
  const out = [];
  for (let v = start; v <= hi + step * 1e-9; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : +v.toPrecision(12));
  return out;
}

/** Sample f over [a, b] into an SVG path, breaking where f is not finite or leaves the window. */
export function pathOf(f, a, b, sx, sy, n = 240, clip = null) {
  let d = '';
  let pen = false;
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n;
    const y = f(x);
    const ok = Number.isFinite(y) && (!clip || (y >= clip[0] && y <= clip[1]));
    if (!ok) { pen = false; continue; }
    d += `${pen ? 'L' : 'M'}${sx(x).toFixed(2)},${sy(y).toFixed(2)}`;
    pen = true;
  }
  return d;
}

/** Format a number for a readout: trims float noise, keeps sign. */
export function fmt(v, digits = 3) {
  if (!Number.isFinite(v)) return '—';
  const r = +v.toFixed(digits);
  return (Object.is(r, -0) ? 0 : r).toString().replace('-', '−');
}

/** Seeded PRNG (mulberry32): every "random" lab dataset is reproducible. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal draw from a uniform generator (Box–Muller). */
export function normal(rand) {
  let u = 0;
  while (u === 0) u = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

/** Pointer-drag a value in plot coordinates. Keyboard users use the matching sliders. */
export function dragHandler(onMove) {
  return (e) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const toLocal = (ev) => {
      const pt = svg.createSVGPoint();
      pt.x = ev.clientX;
      pt.y = ev.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    };
    const move = (ev) => onMove(toLocal(ev));
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
}
