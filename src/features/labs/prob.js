// Probability and classification maths for the labs. Tested in __tests__/labMath.test.js.

/** P(condition | positive) by Bayes’ theorem. */
export function posterior(prior, sensitivity, falsePositiveRate) {
  const tp = sensitivity * prior;
  const fp = falsePositiveRate * (1 - prior);
  return tp / (tp + fp);
}

/** Confusion counts and rates at a threshold: positive when score ≥ t. */
export function confusionAt(scores, labels, t) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;
  for (let i = 0; i < scores.length; i++) {
    const pred = scores[i] >= t;
    if (pred && labels[i]) tp++;
    else if (pred) fp++;
    else if (labels[i]) fn++;
    else tn++;
  }
  const precision = tp + fp ? tp / (tp + fp) : NaN;
  const recall = tp + fn ? tp / (tp + fn) : NaN;
  const fpr = fp + tn ? fp / (fp + tn) : NaN;
  const f1 = tp ? (2 * tp) / (2 * tp + fp + fn) : 0;
  return { tp, fp, fn, tn, precision, recall, fpr, f1, accuracy: (tp + tn) / scores.length };
}

/** ROC AUC as P(score of a random positive > score of a random negative), ties counting ½. */
export function rocAuc(scores, labels) {
  const pos = scores.filter((_, i) => labels[i]);
  const neg = scores.filter((_, i) => !labels[i]);
  let s = 0;
  for (const p of pos) for (const n of neg) s += p > n ? 1 : p === n ? 0.5 : 0;
  return s / (pos.length * neg.length);
}

/** ROC points (FPR, TPR) over every distinct threshold, from (0,0) to (1,1). */
export function rocCurve(scores, labels) {
  const ts = [Infinity, ...[...new Set(scores)].sort((a, b) => b - a), -Infinity];
  return ts.map((t) => {
    const c = confusionAt(scores, labels, t);
    return [c.fpr, c.recall];
  });
}

/** Brier score: mean squared difference between predicted probability and outcome. */
export function brier(probs, outcomes) {
  return probs.reduce((s, p, i) => s + (p - outcomes[i]) ** 2, 0) / probs.length;
}

/** Precision (PPV) implied by a base rate and error rates. */
export function ppv(baseRate, tpr, fpr) {
  return (baseRate * tpr) / (baseRate * tpr + (1 - baseRate) * fpr);
}

/** The 36 equally likely outcomes of two fair dice, as [first, second]. */
export const DICE = Array.from({ length: 36 }, (_, i) => [Math.floor(i / 6) + 1, (i % 6) + 1]);

/** Events on two dice (the dice-grid lab), each a test on [first, second]. */
export const DICE_EVENTS = {
  sum7: { label: 'Sum is 7', test: ([a, b]) => a + b === 7 },
  six: { label: 'At least one six', test: ([a, b]) => a === 6 || b === 6 },
  doubles: { label: 'Doubles', test: ([a, b]) => a === b },
  firstEven: { label: 'First die even', test: ([a]) => a % 2 === 0 },
  sum10: { label: 'Sum is 10 or more', test: ([a, b]) => a + b >= 10 },
};

/** Outcomes in A, in B, in both and in either, out of the 36. */
export function diceCounts(inA, inB) {
  let a = 0;
  let b = 0;
  let both = 0;
  let either = 0;
  for (const o of DICE) {
    const x = inA(o);
    const y = inB(o);
    if (x) a += 1;
    if (y) b += 1;
    if (x && y) both += 1;
    if (x || y) either += 1;
  }
  return { a, b, both, either, total: DICE.length };
}
