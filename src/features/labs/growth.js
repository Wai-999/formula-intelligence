// The arithmetic behind the exponential and unit-circle labs, kept apart
// from the drawing so it can be tested (__tests__/labMath.test.js).

/** Periods for (1 + r)^t to reach 2: ln 2 / ln(1 + r). */
export const doublingTime = (r) => Math.log(2) / Math.log(1 + r);

/** Degrees to radians. */
export const toRadians = (deg) => (deg * Math.PI) / 180;

/** An angle in degrees as a simplified multiple of π, for display: 150 → "5π/6", 180 → "π", 0 → "0". */
export function piFraction(deg) {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  if (deg === 0) return '0';
  const g = gcd(Math.abs(deg), 180);
  const n = deg / g;
  const d = 180 / g;
  const top = n === 1 ? 'π' : n === -1 ? '−π' : `${n}π`;
  return d === 1 ? top : `${top}/${d}`;
}

/** The point at angle θ (radians) on a circle of radius r: [r cos θ, r sin θ], with tiny float noise rounded to 0. */
export function circlePoint(theta, r = 1) {
  const clean = (v) => (Math.abs(v) < 1e-12 ? 0 : v);
  return [clean(r * Math.cos(theta)), clean(r * Math.sin(theta))];
}
