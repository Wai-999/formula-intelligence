import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'A lending model gives two applicants from different neighbourhoods the same “20% risk of default”. Does 20% mean the same thing for both — and when the model makes mistakes, are they shared fairly between groups?',
    body: [
      'A model is **calibrated** if, among all the cases it scores 20%, about 20% actually happen — and likewise for every score. Calibration is what lets a probability be used as a probability: for pricing, triage, or explaining a decision.',
      'Fairness asks a different question: do the model’s errors — missed cases, false alarms — fall evenly across groups? There are several reasonable definitions, and a striking result says that when groups differ in base rate, they cannot all hold at once. Choosing between them is a decision about values, which the mathematics makes visible but cannot make for you.',
    ],
  },

  glossary: [
    { term: 'calibration', meaning: 'Among cases scored $p$, the observed frequency of the outcome is about $p$.' },
    { term: 'reliability diagram', meaning: 'Observed frequency plotted against mean predicted probability, bin by bin; calibrated means on the diagonal.' },
    { term: 'Brier score $\\frac1n\\sum(\\hat p_i - y_i)^2$', meaning: 'Mean squared error of probabilities; lower is better.' },
    { term: 'base rate', meaning: 'The share of actual positives in a group.' },
    { term: 'equalized odds', meaning: 'Equal true-positive and false-positive rates across groups.' },
    { term: 'demographic parity', meaning: 'Equal rates of being flagged across groups.' },
  ],

  priorCheck: [
    item({ id: 'ml-cal.pre1', competency: 'ml.classification-metrics', difficulty: 1, prompt: 'TP = 30 and FP = 10. What is the precision?', answer: num(0.75), compute: () => 0.75, solution: '$30/40 = 0.75$.', remedy: 'ml-classification-metrics' }),
    item({ id: 'ml-cal.pre2', competency: 'stats.descriptive', difficulty: 1, prompt: 'What is the mean of the squares of 0.2, 0.1 and 0.3?', answer: num((0.04 + 0.01 + 0.09) / 3, 1e-9), compute: () => (0.04 + 0.01 + 0.09) / 3, solution: '$(0.04 + 0.01 + 0.09)/3 = 0.14/3 \\approx 0.0467$.' }),
  ],

  visualization: {
    lab: 'calibration',
    intro: 'Compare the calibrated and overconfident models on the reliability diagram. Then, with the calibrated model, move the threshold and compare the two groups’ TPR, FPR and precision.',
    textAlternative: 'The lab shows a reliability diagram for two synthetic groups and a table of each group’s base rate, true-positive rate, false-positive rate, precision and share flagged at a shared threshold. A sentence summarizes the same numbers; the data table lists every reliability bin.',
  },

  derivation: {
    intro: 'Why equal error rates and equal precision collide when base rates differ.',
    steps: [
      { say: 'For a group with base rate $\\pi$, true-positive rate TPR and false-positive rate FPR, precision (positive predictive value) follows from Bayes’ theorem:', math: '\\text{PPV} = \\frac{\\pi\\,\\text{TPR}}{\\pi\\,\\text{TPR} + (1 - \\pi)\\,\\text{FPR}}' },
      { say: 'Suppose two groups have **equal** TPR and FPR (equalized odds) but base rates $\\pi_A \\ne \\pi_B$. The formula is increasing in $\\pi$ whenever FPR > 0, so the groups’ precision must differ.' },
      { say: 'Conversely, forcing equal precision with different base rates forces their error rates apart. Kleinberg, Mullainathan and Raghavan (2016) and Chouldechova (2017) proved versions of this: except in degenerate cases (a perfect predictor or equal base rates), calibration within groups and equal error rates cannot all be satisfied.' },
      { say: 'Calibration is checked empirically: group predictions into bins, compare each bin’s mean prediction with its observed frequency, and summarize overall accuracy of the probabilities with the Brier score.' },
    ],
    assumptions: ['Groups are defined and recorded — itself a legal and ethical question, needing consent and care.', 'The labels are trustworthy. If the recorded outcome is itself biased (for example, arrests rather than offences), every metric inherits the bias.'],
    domain: ['Reliability bins with few cases are noisy; differences of a few percentage points may be chance.', 'The impossibility results concern specific criteria; they do not say fairness is meaningless, only that it requires choosing.'],
  },

  examples: [
    {
      title: 'A Brier score',
      problem: 'Predictions 0.8, 0.3 and 0.6 for outcomes 1, 0 and 0. Compute the Brier score.',
      steps: ['Squared errors: $(0.8 - 1)^2 = 0.04$, $(0.3 - 0)^2 = 0.09$, $(0.6 - 0)^2 = 0.36$.', 'Mean: $0.49/3 \\approx 0.163$.'],
      answer: 'About 0.163 (a constant prediction of the base rate 1/3 would score 0.222).',
      check: { value: 0.49 / 3, tolerance: 1e-9, compute: () => ((0.8 - 1) ** 2 + 0.3 ** 2 + 0.6 ** 2) / 3 },
    },
    {
      title: 'Equal error rates, unequal precision',
      problem: 'Both groups have TPR 0.8 and FPR 0.1. Group A’s base rate is 0.3, group B’s 0.1. Compute each group’s precision.',
      steps: ['A: $0.24/(0.24 + 0.07) = 0.24/0.31 \\approx 0.774$.', 'B: $0.08/(0.08 + 0.09) = 0.08/0.17 \\approx 0.471$.'],
      answer: 'A flagged member of group A is right 77% of the time; of group B, only 47% — with identical error rates.',
      check: { value: 0.08 / 0.17, tolerance: 1e-9, compute: () => (0.1 * 0.8) / (0.1 * 0.8 + 0.9 * 0.1) },
    },
  ],

  counterexample: {
    title: 'Fairness through unawareness',
    body: [
      '“Just remove the group column and the model can’t discriminate.” But other features — postcode, school, purchasing patterns — can predict group membership closely. The model can reconstruct what was removed, and its error rates by group can stay just as unequal.',
      'Auditing requires the group information that unawareness throws away: you cannot measure unequal error rates without knowing who is in which group.',
    ],
  },

  predict: {
    prompt: 'Two groups have different base rates. A model achieves exactly equal TPR and equal FPR in both. Will its precision be equal too?',
    choices: ['Yes — equal errors mean equal everything', 'No — with different base rates, precision must differ', 'Only if the model is calibrated', 'Only if the threshold is 0.5'],
    answer: 1,
    reveal: 'From $\\text{PPV} = \\pi\\,\\text{TPR}/(\\pi\\,\\text{TPR} + (1-\\pi)\\text{FPR})$: same TPR and FPR, different $\\pi$, different precision (0.774 versus 0.471 in the worked example).',
    misconception: {
      belief: 'Equal error rates imply equal precision.',
      correction: 'Precision depends on the base rate as well as on the error rates. Different fairness criteria answer different questions and generally conflict.',
    },
  },

  practice: [
    item({ id: 'ml-cal.p1', competency: 'ml.calibration-fairness', difficulty: 1, level: 'scaffolded', prompt: 'What is the Brier score of a single prediction 0.9 for an outcome that happened ($y = 1$)?', answer: num(0.01), compute: () => (0.9 - 1) ** 2, solution: '$(0.9 - 1)^2 = 0.01$.' }),
    item({ id: 'ml-cal.p2', competency: 'ml.calibration-fairness', difficulty: 1, level: 'scaffolded', prompt: 'A reliability bin holds 50 predictions averaging 0.7, and 28 of the outcomes happened. What is the observed frequency?', answer: num(0.56), compute: () => 28 / 50, solution: '$28/50 = 0.56$ — below 0.7: in this bin the model is overconfident.' }),
    item({ id: 'ml-cal.p3', competency: 'ml.calibration-fairness', difficulty: 2, level: 'independent', prompt: 'Base rate 0.2, TPR 0.9, FPR 0.05. What is the precision? (Three decimals.)', answer: num(0.18 / 0.22, 0.0006), compute: () => (0.2 * 0.9) / (0.2 * 0.9 + 0.8 * 0.05), solution: '$0.18/(0.18 + 0.04) \\approx 0.818$.' }),
    item({ id: 'ml-cal.p4', competency: 'ml.calibration-fairness', difficulty: 2, level: 'independent', prompt: 'A model is calibrated. Which statement must be true?', answer: choice(['It is accurate', 'Among cases it scores 0.3, about 30% are positive', 'It treats all groups fairly', 'Its ROC AUC is high'], 1), feedback: { 0: 'A model that predicts the base rate for everyone is calibrated and useless.' }, solution: 'Calibration is about the meaning of the probabilities, not their usefulness or fairness.' }),
    item({ id: 'ml-cal.p5', competency: 'ml.calibration-fairness', difficulty: 2, level: 'independent', prompt: 'Group A’s true-positive rate is 0.85 and group B’s is 0.70. What is the TPR gap?', answer: num(0.15), compute: () => 0.85 - 0.7, solution: '$0.85 - 0.70 = 0.15$: real cases in group B are missed more often.' }),
    item({ id: 'ml-cal.p6', competency: 'ml.calibration-fairness', difficulty: 3, level: 'transfer', prompt: 'A hiring screen selects 30% of group A and 18% of group B. What is the ratio of the selection rates (B ÷ A)?', answer: num(0.6), compute: () => 0.18 / 0.3, solution: '$0.18/0.30 = 0.6$ — below the 0.8 often used as a rough screening flag (the US “four-fifths rule”), so it warrants a closer look.' }),
    item({ id: 'ml-cal.p7', competency: 'ml.calibration-fairness', difficulty: 3, level: 'transfer', prompt: 'A team removes the “group” column and says the model is now fair. What is the main problem?', answer: choice(['Nothing — the model cannot use what it cannot see', 'Other features can act as proxies for group, and unequal error rates can remain; removing the column also prevents measuring them', 'The model will crash', 'It makes the model less calibrated'], 1), solution: 'Proxies carry the information; auditing needs the column.' }),
  ],

  checkpoint: [
    item({ id: 'ml-cal.c1', competency: 'ml.calibration-fairness', difficulty: 1, prompt: 'What is the Brier score of a single prediction 0.2 for an outcome that did not happen ($y = 0$)?', answer: num(0.04), compute: () => 0.2 ** 2, solution: '$0.2^2 = 0.04$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Square the difference between the prediction and the outcome (0).' }),
    item({ id: 'ml-cal.c2', competency: 'ml.calibration-fairness', difficulty: 2, prompt: 'Base rate 0.5, TPR 0.8, FPR 0.2. What is the precision?', answer: num(0.8), compute: () => 0.4 / (0.4 + 0.1), solution: '$0.4/(0.4 + 0.1) = 0.8$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Use $\\pi\\,\\text{TPR}/(\\pi\\,\\text{TPR} + (1-\\pi)\\text{FPR})$.' }),
    item({ id: 'ml-cal.c3', competency: 'ml.calibration-fairness', difficulty: 3, prompt: 'Two groups have different base rates. Which combination can a non-perfect model generally NOT achieve?', answer: choice(['Calibration in each group', 'Equal TPR across groups', 'Calibration in each group AND equal TPR AND equal FPR', 'A high AUC'], 2), solution: 'That is the impossibility result: all three at once only for a perfect predictor or equal base rates.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Recall Kleinberg et al. (2016) and Chouldechova (2017).' }),
  ],

  python: {
    intro: 'A Brier score on eight made-up predictions, and the precision implied by equal error rates in groups with different base rates.',
    code: `import numpy as np

p = np.array([0.9, 0.8, 0.7, 0.6, 0.4, 0.3, 0.2, 0.1])   # predicted risk (synthetic)
y = np.array([1, 1, 0, 1, 0, 1, 0, 0])                    # what happened
print(round(float(np.mean((p - y) ** 2)), 4))             # Brier score

def ppv(base_rate, tpr, fpr):
    return base_rate * tpr / (base_rate * tpr + (1 - base_rate) * fpr)

for rate in [0.3, 0.1]:
    print(rate, round(ppv(rate, 0.8, 0.1), 4))`,
    output: '0.175\n0.3 0.7742\n0.1 0.4706',
    explain: 'The last two lines reproduce the worked example: identical TPR and FPR, different base rates, different precision.',
  },

  reading: [
    { title: 'Probability calibration', source: 'scikit-learn user guide §1.16', url: 'https://scikit-learn.org/stable/modules/calibration.html', note: 'Reliability diagrams and calibration methods.' },
    { title: 'Fairness and Machine Learning: Limitations and Opportunities', source: 'Barocas, Hardt & Narayanan (free online book)', url: 'https://fairmlbook.org/', note: 'The fairness criteria and their trade-offs in depth.' },
    { title: 'Inherent Trade-Offs in the Fair Determination of Risk Scores', source: 'Kleinberg, Mullainathan & Raghavan (arXiv:1609.05807)', url: 'https://arxiv.org/abs/1609.05807', note: 'The impossibility theorem.' },
    { title: 'Fair prediction with disparate impact', source: 'Chouldechova (arXiv:1610.07524)', url: 'https://arxiv.org/abs/1610.07524', note: 'The same tension in a recidivism-prediction setting.' },
  ],
};
