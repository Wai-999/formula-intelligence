// Summaries of a small data set for the center-and-spread lab
// (CenterSpreadLab.jsx), checked against hand-worked cases in
// __tests__/labMath.test.js.

const sorted = (xs) => [...xs].sort((a, b) => a - b);

export const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

export function median(xs) {
  const s = sorted(xs);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

/** Sample standard deviation: squared deviations from the mean over n − 1. */
export function sampleSD(xs) {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
}

/**
 * Quartiles as the medians of the lower and upper halves, leaving out the
 * middle value when the count is odd (the textbook method; software that
 * interpolates can differ slightly).
 */
export function quartiles(xs) {
  const s = sorted(xs);
  const n = s.length;
  return [median(s.slice(0, Math.floor(n / 2))), median(s.slice(Math.ceil(n / 2)))];
}

export function summarize(xs) {
  const [q1, q3] = quartiles(xs);
  return { n: xs.length, mean: mean(xs), median: median(xs), sd: sampleSD(xs), q1, q3, iqr: q3 - q1 };
}
