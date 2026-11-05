// The arithmetic behind the V5 bridge labs — composition → chain rule, and
// limits — kept apart from the drawing so it can be tested against
// hand-computed cases (__tests__/labMath.test.js).

/** (f ∘ g)(x) = f(g(x)). */
export const compose = (f, g) => (x) => f(g(x));

/**
 * Central difference (f(x + h) − f(x − h)) / 2h: the "measured" slope the
 * labs compare against the chain rule. Its error is of order h² for smooth f.
 */
export function centralDifference(f, x, h = 1e-6) {
  return (f(x + h) - f(x - h)) / (2 * h);
}

/** Chain rule f'(g(x))·g'(x), and the common mistake f'(x)·g'(x). */
export function chainRule({ g, dg, df }, x) {
  return df(g(x)) * dg(x);
}

export function chainMistake({ dg, df }, x) {
  return df(x) * dg(x);
}

/**
 * Values of f approaching a from one side, at distances `steps` from a:
 * side −1 reads f(a − h), side +1 reads f(a + h). f(a) itself is never used.
 */
export function approach(f, a, side, steps = [1, 0.1, 0.01, 0.001]) {
  return steps.map((h) => ({ h, x: a + side * h, y: f(a + side * h) }));
}

/**
 * A numerical judgement about a two-sided limit, comparing the readings at
 * distance h with those ten times farther out:
 *   'unbounded'  a side grew more than fivefold (and past 1000) as h shrank
 *   'agree'      the gap between the sides at least halved (or is ~0)
 *   'jump'       the gap did not shrink
 * A heuristic for the lab's readout, never a proof — tables can mislead.
 */
export function limitVerdict(f, a, h) {
  const left = f(a - h);
  const right = f(a + h);
  const farL = f(a - 10 * h);
  const farR = f(a + 10 * h);
  const grows = (near, far) => Math.abs(near) > 1e3 && Math.abs(near) > 5 * Math.abs(far);
  if (![left, right, farL, farR].every(Number.isFinite) || grows(left, farL) || grows(right, farR)) return { kind: 'unbounded', left, right };
  const gap = Math.abs(left - right);
  if (gap < 1e-9 || gap < 0.5 * Math.abs(farL - farR)) return { kind: 'agree', left, right };
  return { kind: 'jump', left, right };
}
