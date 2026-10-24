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
