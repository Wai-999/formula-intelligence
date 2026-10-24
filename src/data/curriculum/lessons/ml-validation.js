import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'You fit a model and it scores 98% on the data you trained it on. A colleague says that number is meaningless. Why — and what number would mean something?',
    body: [
      'A model is chosen to fit its training data, so its score there is an exam it wrote itself. What matters is **generalization**: performance on data it has never seen. So we hold some data back: a **validation** set for making choices (which model, which settings) and a **test** set, opened once at the very end, for the final report.',
      '**Cross-validation** reuses scarce data: split it into $k$ folds, train on $k - 1$, score on the one left out, and rotate. Every row is scored by a model that never saw it. And always compare with a **baseline** — the score of a trivial rule — because “85%” means nothing if guessing the majority class gets 90%.',
    ],
  },

  glossary: [
    { term: 'training set', meaning: 'Data the model’s parameters are fitted to.' },
    { term: 'validation set', meaning: 'Held-out data used to compare models and tune settings.' },
    { term: 'test set', meaning: 'Held-out data used once, at the end, to report performance.' },
    { term: '$k$-fold cross-validation', meaning: 'Split into $k$ folds; each fold is held out once; report the mean and spread of the $k$ scores.' },
    { term: 'leakage', meaning: 'Information from outside the training data reaching the model, inflating its score.' },
    { term: 'baseline', meaning: 'The score of a trivial model (predict the mean, or the most common class).' },
  ],

  priorCheck: [
    item({ id: 'ml-val.pre1', competency: 'alg.line-fit', difficulty: 1, prompt: 'The least-squares line is chosen to make which quantity as small as possible on the data it is fitted to?', answer: choice(['The number of points', 'The sum of squared residuals', 'The slope', 'The intercept'], 1), solution: 'The sum of squared residuals — on those same data.', remedy: 'a1-line-fit' }),
    item({ id: 'ml-val.pre2', competency: 'stats.descriptive', difficulty: 1, prompt: 'What is the mean of 0.7, 0.8, 0.75 and 0.85?', answer: num(0.775), compute: () => (0.7 + 0.8 + 0.75 + 0.85) / 4, solution: '$3.1/4 = 0.775$.' }),
  ],

  visualization: {
    lab: 'cross-validation',
    intro: 'Step through the five rounds and watch which points are held out. Compare the training error with the cross-validated error. Then switch on “peek” — fitting on the held-out fold too — and see the score improve for the wrong reason.',
    textAlternative: 'The lab plots 20 synthetic points with the line fitted in the current round; held-out points are hollow. A sentence gives the round’s validation error, the mean and spread across folds, the honest score when peeking, and the training error; the table lists each fold’s rows and error.',
  },

  derivation: {
    intro: 'Why is training error optimistic, and by how much? For least squares there is an exact answer.',
    steps: [
      { say: 'Suppose the data really follow a linear model with $p$ coefficients plus independent noise of variance $\\sigma^2$, at $n$ fixed inputs. The least-squares fit is pulled toward the noise in its own training data, so its average squared residual is too small:', math: 'E[\\text{training MSE}] = \\sigma^2\\,\\frac{n - p}{n}' },
      { say: 'Predicting fresh outcomes at the same inputs, the error includes both the new noise and the fit’s estimation error:', math: 'E[\\text{new-data MSE}] = \\sigma^2\\,\\frac{n + p}{n}' },
      { say: 'The gap — the **optimism** of the training error — grows with model size $p$ and shrinks with data $n$:', math: '\\text{optimism} = \\frac{2p\\,\\sigma^2}{n}' },
      { say: 'Flexible models (large effective $p$) can drive training error to zero while new-data error grows. Held-out validation measures the second quantity directly, without needing the model to be linear or $\\sigma$ to be known — which is why it is the default.' },
    ],
    assumptions: ['The formulas assume a correctly specified linear model, fixed inputs and independent noise of constant variance (a standard result for least squares). The validation idea needs none of that — only that held-out data resemble future data.', 'Rows are independent: no row carries information about another.'],
    domain: ['Time series: random folds let the model train on the future. Use forward-chaining (train on the past, validate on what follows).', 'Grouped data (several rows per patient or customer): keep each group inside one fold.'],
  },

  examples: [
    {
      title: 'How optimistic is training error?',
      problem: 'A regression with $p = 5$ coefficients is fitted to $n = 50$ points with noise variance $\\sigma^2 = 4$. Compare expected training and new-data MSE.',
      steps: ['Training: $4 \\times 45/50 = 3.6$.', 'New data: $4 \\times 55/50 = 4.4$.', 'Optimism $2 \\times 5 \\times 4/50 = 0.8$, the difference.'],
      answer: 'Training error understates the real error by 0.8 on average — over 20%.',
      check: { value: 0.8, compute: () => (2 * 5 * 4) / 50 },
    },
    {
      title: 'Reporting a cross-validated score',
      problem: 'Five folds give accuracies 0.81, 0.78, 0.84, 0.80 and 0.77. Report the result.',
      steps: ['Mean: $4.00/5 = 0.80$.', 'Deviations $0.01, -0.02, 0.04, 0, -0.03$; squares sum to $0.003$; sample SD $= \\sqrt{0.003/4} \\approx 0.027$.'],
      answer: '$0.80 \\pm 0.027$ (mean ± SD across folds). A rival scoring 0.81 is not clearly better.',
      check: { value: Math.sqrt(0.003 / 4), tolerance: 1e-9, compute: () => { const a = [0.81, 0.78, 0.84, 0.8, 0.77]; const m = a.reduce((s, v) => s + v, 0) / 5; return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / 4); } },
    },
  ],

  counterexample: {
    title: 'Cross-validation that measures nothing',
    body: [
      'A dataset has three scans per patient. Random 5-fold splitting puts some scans of the same patient in training and others in validation. The model can recognize the patient rather than the disease, and the cross-validated score looks excellent — then collapses on new patients. Split **by patient** instead.',
      'Subtler leaks: standardizing or selecting features using the whole dataset before splitting, or including a column recorded after the outcome (a “treatment given” flag when predicting diagnosis). Every preprocessing step must be fitted inside each training fold.',
    ],
  },

  predict: {
    prompt: 'Model A scores $0.84 \\pm 0.06$ in 5-fold cross-validation; model B scores $0.83 \\pm 0.01$. What should you conclude?',
    choices: ['A is better: higher mean', 'B is better: lower spread', 'The difference is well within the fold-to-fold noise; neither is clearly better on this evidence', 'Use the test set to decide'],
    answer: 2,
    reveal: 'A difference of 0.01 against a fold-to-fold spread of 0.06 is not evidence of anything. Prefer the simpler or more stable model, or gather more data. (B’s consistency is worth noticing, but it does not make B “better” either.)',
    misconception: {
      belief: 'The model with the highest mean CV score always wins.',
      correction: 'CV scores are estimates with noise. Compare differences with their spread; and never use the test set to break ties, or it stops being a test set.',
    },
  },

  practice: [
    item({ id: 'ml-val.p1', competency: 'ml.validation', difficulty: 1, level: 'scaffolded', prompt: 'With 5-fold cross-validation on 200 rows, how many rows are in each validation fold?', answer: num(40), compute: () => 200 / 5, solution: '$200/5 = 40$.' }),
    item({ id: 'ml-val.p2', competency: 'ml.validation', difficulty: 1, level: 'scaffolded', prompt: 'Four folds score 0.7, 0.8, 0.75 and 0.85. What is the cross-validated mean?', answer: num(0.775), compute: () => 3.1 / 4, solution: '$0.775$.' }),
    item({ id: 'ml-val.p3', competency: 'ml.validation', difficulty: 2, level: 'independent', prompt: 'Using optimism $= 2p\\sigma^2/n$: with $p = 10$, $\\sigma^2 = 1$ and $n = 100$, by how much does training MSE understate new-data MSE on average?', answer: num(0.2), compute: () => (2 * 10 * 1) / 100, solution: '$20/100 = 0.2$.' }),
    item({ id: 'ml-val.p4', competency: 'ml.validation', difficulty: 2, level: 'independent', prompt: 'Which of these is leakage?', answer: choice(['Fitting a scaler on the training folds only', 'Fitting a scaler on the full dataset, then cross-validating', 'Using 10 folds instead of 5', 'Reporting the spread of fold scores'], 1), solution: 'The full-data scaler has seen the validation rows’ mean and spread.' }),
    item({ id: 'ml-val.p5', competency: 'ml.validation', difficulty: 2, level: 'independent', prompt: 'How should a model that forecasts next month’s sales be validated?', answer: choice(['Random k-fold over all months', 'Train on earlier months, validate on the months that follow', 'Validate on the training months', 'Shuffle the months first, then split'], 1), solution: 'Forward-chaining: the model must never see the future it is asked to predict.' }),
    item({ id: 'ml-val.p6', competency: 'ml.validation', difficulty: 3, level: 'transfer', prompt: 'In a churn dataset 92% of customers do not churn. What accuracy does the baseline “predict no churn for everyone” achieve?', answer: num(0.92), compute: () => 0.92, solution: '0.92 — so a model with 91% accuracy is worse than doing nothing, by this measure.' }),
    item({ id: 'ml-val.p7', competency: 'ml.validation', difficulty: 3, level: 'transfer', prompt: 'A hospital has 3 X-rays per patient for 500 patients. How should the data be split for validation?', answer: choice(['Randomly by image', 'By patient: all of a patient’s images in the same fold', 'By date of the image only', 'It does not matter'], 1), solution: 'Group-wise splitting stops the model from recognizing patients instead of disease.' }),
  ],

  checkpoint: [
    item({ id: 'ml-val.c1', competency: 'ml.validation', difficulty: 1, prompt: 'In 10-fold cross-validation on 500 rows, how many rows is each model trained on?', answer: num(450), compute: () => 500 - 50, solution: 'Each validation fold has 50 rows, leaving 450 for training.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Each round holds out one fold of $500/10$ rows.' }),
    item({ id: 'ml-val.c2', competency: 'ml.validation', difficulty: 2, prompt: 'Which data should you use to choose between three candidate models?', answer: choice(['The training set', 'The validation set or cross-validation on the training data', 'The test set', 'Whichever gives the highest score'], 1), solution: 'Choose with validation; keep the test set sealed for the final, unbiased report.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Every decision made using the test set makes its score optimistic.' }),
    item({ id: 'ml-val.c3', competency: 'ml.validation', difficulty: 3, prompt: 'A binary task has 70% negatives and 30% positives. What accuracy does the majority-class baseline achieve?', answer: num(0.7), compute: () => 0.7, solution: 'Always predicting “negative” is right 70% of the time.', feedbackCorrect: 'Right — any useful model must beat 0.70.', feedbackIncorrect: 'Predict the most common class for everyone.' }),
  ],

  python: {
    intro: 'Five-fold cross-validation from scratch on 20 synthetic points (a line plus fixed, made-up noise — the same data as the lab), then the training error for comparison.',
    code: `import numpy as np

x = np.arange(20, dtype=float)
noise = np.array([0.5, -1.2, 0.3, 0.8, -0.4, 1.1, -0.9, 0.2, -0.3, 0.7,
                  -1.0, 0.4, 0.9, -0.6, 0.1, -0.8, 1.2, -0.2, 0.6, -0.5])
y = 2.0 * x + 1.0 + noise          # synthetic: a line plus fixed noise

def fit(xs, ys):
    m, b = np.polyfit(xs, ys, 1)
    return lambda t: m * t + b

def mse(model, xs, ys):
    return float(np.mean((ys - model(xs)) ** 2))

folds = np.arange(20) % 5          # 5 interleaved folds
scores = [mse(fit(x[folds != k], y[folds != k]), x[folds == k], y[folds == k])
          for k in range(5)]
print(np.round(scores, 3))
print(round(float(np.mean(scores)), 3), round(float(np.std(scores, ddof=1)), 3))
print(round(mse(fit(x, y), x, y), 3))   # training error: optimistic`,
    output: '[1.017 1.484 0.263 0.362 0.248]\n0.675 0.553\n0.512',
    explain: 'The cross-validated MSE (0.675) is higher than the training MSE (0.512), as the optimism formula predicts — and the fold scores vary a lot (SD 0.553) on such a small dataset.',
  },

  reading: [
    { title: 'Cross-validation: evaluating estimator performance', source: 'scikit-learn user guide §3.1', url: 'https://scikit-learn.org/stable/modules/cross_validation.html', note: 'k-fold, grouped and time-series splitters.' },
    { title: 'Common pitfalls and recommended practices', source: 'scikit-learn documentation', url: 'https://scikit-learn.org/stable/common_pitfalls.html', note: 'Data leakage from preprocessing, with code that avoids it.' },
    { title: 'An Introduction to Statistical Learning, chapter 5', source: 'James, Witten, Hastie & Tibshirani (free online)', url: 'https://www.statlearning.com/', note: 'Resampling methods: the validation set approach, LOOCV and k-fold.' },
  ],
};
