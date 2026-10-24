import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'A screening model flags patients as “high risk”. Of 1,000 patients, 50 have the condition. The model flags 80 patients, 40 of whom really have it. Its accuracy is 95%. Is it good?',
    body: [
      'A model that flags **nobody** is also 95% accurate here — and finds no one. Accuracy hides the two kinds of mistake. Count them separately in a **confusion matrix**: 40 true positives, 40 false positives, 10 missed cases (false negatives) and 910 true negatives.',
      'Then ask the two questions that matter: of the people flagged, how many are real (**precision**, 40/80 = 0.5)? Of the real cases, how many were flagged (**recall**, 40/50 = 0.8)? Moving the decision threshold trades one for the other, and ROC and precision–recall curves show the whole trade-off at once.',
    ],
  },

  glossary: [
    { term: 'TP, FP, FN, TN', meaning: 'True positives, false positives, false negatives, true negatives.' },
    { term: 'precision $= \\dfrac{TP}{TP + FP}$', meaning: '$P(\\text{actually positive} \\mid \\text{flagged})$.' },
    { term: 'recall (sensitivity, TPR) $= \\dfrac{TP}{TP + FN}$', meaning: '$P(\\text{flagged} \\mid \\text{actually positive})$.' },
    { term: 'FPR $= \\dfrac{FP}{FP + TN}$', meaning: 'False-positive rate: $P(\\text{flagged} \\mid \\text{actually negative})$; specificity is $1 - $ FPR.' },
    { term: '$F_1 = \\dfrac{2PR}{P + R}$', meaning: 'Harmonic mean of precision and recall.' },
    { term: 'ROC AUC', meaning: 'Area under the TPR-against-FPR curve; the chance a random positive outscores a random negative.' },
  ],

  priorCheck: [
    item({ id: 'ml-met.pre1', competency: 'stats.probability', difficulty: 1, prompt: 'Of 80 flagged patients, 40 have the condition. Given a patient is flagged, what is the probability they have it?', answer: num(0.5), compute: () => 40 / 80, solution: '$40/80 = 0.5$.' }),
    item({ id: 'ml-met.pre2', competency: 'stats.bayes', difficulty: 2, prompt: 'Is $P(\\text{flagged} \\mid \\text{has it})$ the same as $P(\\text{has it} \\mid \\text{flagged})$?', answer: choice(['Yes, always', 'No — they condition on different groups', 'Only if the test is accurate', 'Only for rare conditions'], 1), solution: 'One is computed among the sick, the other among the flagged — Bayes’ theorem relates them.', remedy: 'st-bayes' }),
  ],

  visualization: {
    lab: 'decision-boundary',
    intro: 'Move the threshold from 0.5 to 0.2, then to 0.8. Watch the boundary line, the confusion matrix and the point on the ROC curve move together — while the AUC never changes.',
    textAlternative: 'The lab plots synthetic positives and negatives in two features with the decision boundary for the chosen threshold, plus the ROC curve with the current operating point. A sentence gives the confusion counts, precision, recall, F1, FPR, accuracy and AUC; the table lists the metrics at seven thresholds.',
  },

  derivation: {
    intro: 'The metrics are conditional probabilities; seeing them that way explains their behaviour.',
    steps: [
      { say: 'Recall conditions on the actual positives; precision conditions on the predicted positives. Bayes’ theorem links them through the prevalence $\\pi$ (the share of actual positives):', math: '\\text{precision} = \\frac{\\pi \\cdot \\text{TPR}}{\\pi \\cdot \\text{TPR} + (1 - \\pi)\\,\\text{FPR}}' },
      { say: 'So with the same TPR and FPR, precision falls as positives get rarer — while recall and FPR do not change. That is why ROC curves (TPR against FPR) look the same at any prevalence, and precision–recall curves do not.' },
      { say: 'The harmonic mean punishes imbalance between precision and recall; in counts it simplifies to', math: 'F_1 = \\frac{2PR}{P + R} = \\frac{2\\,TP}{2\\,TP + FP + FN}' },
      { say: 'Lowering the threshold flags every case flagged before plus possibly more, so TP and FP can only grow: recall never falls, while precision usually does. The ROC AUC equals the probability that a randomly chosen positive gets a higher score than a randomly chosen negative — a property of the scores, unaffected by the threshold.' },
    ],
    assumptions: ['Binary labels and a score where higher means “more likely positive”.', 'The evaluation data have the prevalence you care about; precision measured at one prevalence does not transfer to another.'],
    domain: ['Precision is undefined when nothing is flagged ($TP + FP = 0$).', 'With heavy class imbalance, ROC AUC can look excellent while precision is poor; precision–recall curves (average precision) are then more informative.'],
  },

  examples: [
    {
      title: 'The screening model',
      problem: 'TP = 40, FP = 40, FN = 10, TN = 910. Compute accuracy, precision, recall, FPR and F1.',
      steps: ['Accuracy $= 950/1000 = 0.95$.', 'Precision $= 40/80 = 0.5$; recall $= 40/50 = 0.8$.', 'FPR $= 40/950 \\approx 0.042$; $F_1 = 80/(80 + 40 + 10) = 80/130 \\approx 0.615$.'],
      answer: 'Accurate-looking (0.95) but half its alarms are false and it misses 1 case in 5.',
      check: { value: 80 / 130, tolerance: 1e-9, compute: () => (2 * 40) / (2 * 40 + 40 + 10) },
    },
    {
      title: 'Lowering the threshold',
      problem: 'Flagging 150 patients instead catches 48 of the 50 cases. Recompute precision and recall.',
      steps: ['TP = 48, FP = 102.', 'Precision $= 48/150 = 0.32$; recall $= 48/50 = 0.96$.'],
      answer: 'Recall up from 0.8 to 0.96; precision down from 0.5 to 0.32.',
      check: { value: 0.32, compute: () => 48 / 150 },
    },
  ],

  counterexample: {
    title: 'The accuracy paradox',
    body: [
      'Fraud is 0.2% of transactions. “Never fraud” is 99.8% accurate, with zero recall. A real detector that catches most fraud but raises some false alarms may score only 99.5% accuracy — lower than doing nothing.',
      'Accuracy weights every error equally and is dominated by the majority class. Choose metrics from the costs: a missed cancer and a false alarm are not equally bad.',
    ],
  },

  predict: {
    prompt: 'You lower the decision threshold so the model flags more cases. What happens to recall and precision?',
    choices: ['Both rise', 'Recall rises or stays; precision usually falls', 'Both fall', 'Precision rises; recall falls'],
    answer: 1,
    reveal: 'Flagging more can only add true positives (recall up or unchanged), but the extra flags tend to include more negatives, so precision usually drops. Check it in the lab.',
    misconception: {
      belief: 'A better threshold improves every metric.',
      correction: 'For a fixed set of scores, the threshold only chooses a point on a trade-off curve. Improving both at once needs better scores — a better model or better features.',
    },
  },

  practice: [
    item({ id: 'ml-met.p1', competency: 'ml.classification-metrics', difficulty: 1, level: 'scaffolded', prompt: 'TP = 30 and FP = 10. What is the precision?', answer: num(0.75), compute: () => 30 / 40, solution: '$30/40 = 0.75$.' }),
    item({ id: 'ml-met.p2', competency: 'ml.classification-metrics', difficulty: 1, level: 'scaffolded', prompt: 'TP = 30 and FN = 20. What is the recall?', answer: num(0.6), compute: () => 30 / 50, solution: '$30/50 = 0.6$.' }),
    item({ id: 'ml-met.p3', competency: 'ml.classification-metrics', difficulty: 2, level: 'independent', prompt: 'With precision 0.75 and recall 0.6, what is $F_1$? (Three decimals.)', answer: num((2 * 0.75 * 0.6) / 1.35, 0.0006), compute: () => (2 * 0.75 * 0.6) / (0.75 + 0.6), solution: '$0.9/1.35 \\approx 0.667$.' }),
    item({ id: 'ml-met.p4', competency: 'ml.classification-metrics', difficulty: 2, level: 'independent', prompt: 'FP = 10 and TN = 190. What is the false-positive rate?', answer: num(0.05), compute: () => 10 / 200, solution: '$10/200 = 0.05$.' }),
    item({ id: 'ml-met.p5', competency: 'ml.classification-metrics', difficulty: 2, level: 'independent', prompt: 'A model has ROC AUC 0.85. What does that mean?', answer: choice(['85% of predictions are correct', 'A random positive outscores a random negative 85% of the time', 'Precision is 0.85 at every threshold', 'The best threshold is 0.85'], 1), solution: 'AUC is a ranking measure, independent of any threshold.' }),
    item({ id: 'ml-met.p6', competency: 'ml.classification-metrics', difficulty: 3, level: 'transfer', prompt: 'Only 0.2% of transactions are fraudulent. Which summary best reflects how useful a fraud model’s alarms are?', answer: choice(['Accuracy', 'ROC AUC', 'Precision–recall AUC (average precision)', 'The number of transactions'], 2), feedback: { 1: 'ROC AUC ignores prevalence; with 0.2% positives it can look excellent while most alarms are false.' }, solution: 'Precision–recall summaries respond to the rarity of the positive class.' }),
    item({ id: 'ml-met.p7', competency: 'ml.classification-metrics', difficulty: 3, level: 'transfer', prompt: 'Only 2% of cases are positive. What accuracy does “always predict negative” achieve?', answer: num(0.98), compute: () => 0.98, solution: '0.98 — with recall 0.' }),
  ],

  checkpoint: [
    item({ id: 'ml-met.c1', competency: 'ml.classification-metrics', difficulty: 1, prompt: 'TP = 45, FP = 15, FN = 5, TN = 135. What is the precision?', answer: num(0.75), compute: () => 45 / 60, solution: '$45/60 = 0.75$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Precision uses the flagged cases: TP + FP.' }),
    item({ id: 'ml-met.c2', competency: 'ml.classification-metrics', difficulty: 2, prompt: 'For the same counts, what is the recall?', answer: num(0.9), compute: () => 45 / 50, solution: '$45/50 = 0.9$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Recall uses the actual positives: TP + FN.' }),
    item({ id: 'ml-met.c3', competency: 'ml.classification-metrics', difficulty: 3, prompt: 'Missing a case is very costly; a false alarm only means a follow-up test. How should the threshold move?', answer: choice(['Raise it, for higher precision', 'Lower it, for higher recall', 'Leave it at 0.5', 'Use accuracy to decide'], 1), solution: 'Costly misses call for more flags: lower the threshold and accept more false alarms.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Which error is expensive here, and which metric counts it?' }),
  ],

  python: {
    intro: 'A confusion matrix at three thresholds and the ROC AUC computed directly from its ranking definition, on ten made-up scores.',
    code: `import numpy as np

y_true = np.array([1, 1, 1, 1, 0, 0, 0, 0, 0, 0])
y_score = np.array([0.9, 0.8, 0.55, 0.3, 0.7, 0.4, 0.35, 0.2, 0.1, 0.05])

def confusion(threshold):
    y_pred = (y_score >= threshold).astype(int)
    tp = int(np.sum((y_pred == 1) & (y_true == 1)))
    fp = int(np.sum((y_pred == 1) & (y_true == 0)))
    fn = int(np.sum((y_pred == 0) & (y_true == 1)))
    tn = int(np.sum((y_pred == 0) & (y_true == 0)))
    return tp, fp, fn, tn

for t in [0.75, 0.5, 0.25]:
    tp, fp, fn, tn = confusion(t)
    print(t, (tp, fp, fn, tn), round(tp / (tp + fp), 3), round(tp / (tp + fn), 3))

pos, neg = y_score[y_true == 1], y_score[y_true == 0]
auc = np.mean([(p > n) + 0.5 * (p == n) for p in pos for n in neg])
print(round(float(auc), 4))`,
    output: '0.75 (2, 0, 2, 6) 1.0 0.5\n0.5 (3, 1, 1, 5) 0.75 0.75\n0.25 (4, 3, 0, 3) 0.571 1.0\n0.8333',
    explain: 'As the threshold falls, recall climbs 0.5 → 0.75 → 1.0 and precision falls 1.0 → 0.75 → 0.571. The AUC, 20 of 24 positive–negative pairs ranked correctly, does not depend on the threshold.',
  },

  reading: [
    { title: 'Classification: Accuracy, recall, precision, and related metrics', source: 'Google Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall', note: 'The metrics with interactive examples.' },
    { title: 'Classification: ROC and AUC', source: 'Google Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc', note: 'Reading ROC curves and choosing thresholds.' },
    { title: 'The Precision–Recall Plot Is More Informative than the ROC Plot When Evaluating Binary Classifiers on Imbalanced Datasets', source: 'Saito & Rehmsmeier, PLOS ONE (2015)', url: 'https://doi.org/10.1371/journal.pone.0118432', note: 'Evidence for preferring PR curves under imbalance.' },
    { title: 'Metrics and scoring', source: 'scikit-learn user guide §3.4', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html', note: 'Every metric here, as library functions.' },
  ],
};
