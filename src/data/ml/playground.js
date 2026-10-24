import { bl, blSame } from '../../lib/mlContent.js';

export const PLAYGROUND_INTRO = bl(
  'Pick a model and drag the complexity slider to its extremes. Watch the fitted curve — and the gap between the two error lines below it — change.',
  'A regression-type node from Module 3, fit live against an adjustable-noise synthetic dataset. Complexity is polynomial degree or tree depth depending on the model; train/validation error is recomputed across the full complexity range on every change.'
);

export const MODEL_OPTIONS = [
  { id: 'poly', label: bl('Polynomial Regression', 'Polynomial Regression'), complexityLabel: bl('Degree', 'Degree (d)'), max: 12 },
  { id: 'tree', label: bl('Decision Tree', 'Decision Tree Regressor'), complexityLabel: bl('Max depth', 'Max depth'), max: 8 },
];

export const FIT_ZONES = {
  under: bl(
    'Underfitting — the curve is too simple to follow the true pattern. Both errors are high because the model can\'t even capture the training data well.',
    'Underfitting (high bias): model capacity is insufficient to represent the true function; train and validation error are both elevated and close together.'
  ),
  good: bl(
    'Good fit — the curve follows the true pattern without chasing noise. Training and validation error are both low and close together.',
    'Near-optimal complexity: validation error is at or near its minimum; the gap between train and validation error is small.'
  ),
  over: bl(
    'Overfitting — the curve bends itself around every noisy point instead of the true pattern. Training error keeps dropping, but validation error is climbing back up.',
    'Overfitting (high variance): the model has enough capacity to fit noise in the training set; train error continues to fall while validation error rises, widening the generalization gap.'
  ),
};

// Module 11 audit: page-chrome strings (title/labels/legend) that were
// previously hardcoded English in PlaygroundPage.jsx.
export const PG_TITLE = blSame('Model Playground');
export const PG_MODEL_LBL = blSame('Model');
export const PG_NOISE_LBL = blSame('Noise level');
export const PG_NEW_SAMPLE_BTN = blSame('New sample');
export const PG_FIT_LBL = blSame('Fit');
export const PG_TRAINING_POINTS = blSame('training points');
export const PG_VALIDATION_POINTS = blSame('validation points');
export const PG_TRUE_FUNCTION = blSame('true function');
export const PG_ERROR_CURVE_LBL = blSame(
  'Train vs. validation error across all complexities'
);
export const PG_TRAINING_ERROR = blSame('training error');
export const PG_VALIDATION_ERROR = blSame('validation error');
export const PG_BEST_ON_VAL = blSame('best on validation');
export const PG_UNDERFITTING = blSame('Underfitting');
export const PG_OVERFITTING = blSame('Overfitting');
export const PG_GOOD_FIT = blSame('Good fit');
export const PG_TRAIN_MSE_LBL = blSame('train MSE');
export const PG_VAL_MSE_LBL = blSame('validation MSE');
export const PG_LOW_COMPLEXITY = blSame('low complexity');
export const PG_HIGH_COMPLEXITY = blSame('high complexity');

// Module 4 Learning Design System retrofit: Productive Failure sequencing
// (docs/research/ML-Mode-Pedagogy-Research.md §1) — the learner tries to
// find the best fit blind, before any error numbers or bias-variance
// vocabulary appear, then reveals their result as the trigger for the
// explanation. See BUILD_LOG.md Module 4.
export const PG_SPARK_ANALOGY = bl(
  "Buying shoes one size too small pinches; a size too big slips off — either way, the wrong fit fails you, just in different ways. A model's complexity works the same way: too simple and it can't capture the pattern, too complex and it starts fitting noise instead of signal.",
  'A model\'s complexity trades bias against variance: too little capacity underfits (high bias, can\'t represent the true function); too much overfits (high variance, fits noise the training sample happened to contain).'
);
export const PG_SPARK_PREDICT_Q = blSame(
  'Will the MOST complex model available always achieve the LOWEST error on the training data it was fit to?'
);
export const PG_SPARK_PREDICT_YES = blSame('Yes, more complexity always fits training data at least as well');
export const PG_SPARK_PREDICT_NO = blSame('No, past some point training error gets worse too');

export const PG_TRY_FIRST_PROMPT = bl(
  'Move the complexity slider until you think you\'ve found the model that fits this data best. There are no error numbers yet — trust your eye, then reveal your result.',
  'Adjust complexity to what you judge is the best fit, using only the visual fit against the scatter — no train/validation error feedback is shown until you reveal.'
);
export const PG_REVEAL_BTN = blSame('Reveal my result');
export const PG_REVEAL_INTRO = blSame(
  "Here's how your choice actually did, and why:"
);
export const PG_FORMALISM_WORKED = bl(
  'Worked example: 3 validation points with errors (actual−predicted) of 2, -3, 1. Squared: 4, 9, 1. MSE = (4+9+1)/3 = 4.67. A model with errors 0.5, -0.5, 0.5 gets MSE=(0.25+0.25+0.25)/3=0.25 — far better, because squaring punishes the one big miss (the -3) much harder than three small ones.',
  'MSE = (1/n)Σ(yᵢ-ŷᵢ)²; squaring means one large residual contributes disproportionately more than several small ones of the same total magnitude — this is why a model that\'s usually close but occasionally wildly wrong scores worse than one that\'s consistently moderately off.'
);
export const PG_FORMALISM_FADED = bl(
  'A model has validation errors of 4 and -4 (average magnitude 4). Another has errors of 1, 1, 1, 1, 9 (also average magnitude ~2.6, but one big miss). Step 1 — compute each model\'s MSE. Step 2 — which one does MSE penalize more harshly, and why: _____.',
  'A model has validation errors of 4 and -4 (average magnitude 4). Another has errors of 1, 1, 1, 1, 9 (also average magnitude ~2.6, but one big miss). Step 1 — compute each model\'s MSE. Step 2 — which one does MSE penalize more harshly, and why: _____.'
);
export const PG_CF_ANALOGY_BREAK = blSame(
  "The shoe-size analogy breaks down on measurability: you can measure a foot with a ruler and know the right shoe size in advance. There's no equivalent ruler for the \"right\" model complexity ahead of time — you generally have to try several and check validation error, exactly what this Playground's complexity slider and error curve let you do."
);
export const PG_CF_CAVEAT = blSame(
  'A real caveat: "best complexity" isn\'t a fixed property of a dataset — it depends on how much data you have and how noisy it is. The exact same underlying true function needs a simpler model when data is scarce/noisy and can support a more complex one when data is abundant/clean.'
);
export const PG_CF_RETRIEVAL_Q = blSame(
  'Without looking back: why can a model with LOWER training error still be a WORSE choice than one with higher training error?'
);
export const PG_MECHANISM_NOTE = blSame(
  'You already ran the mechanism — the fit chart and slider above. Now that you know what "underfitting" and "overfitting" actually look like, scroll back up and try a few more complexity values with informed eyes, watching both charts react together.'
);
export const PG_CF_RETRIEVAL_A = blSame(
  "Because training error only measures how well the model fits data it already memorized — a complex enough model can drive training error arbitrarily low by fitting the noise in that specific sample, which then actively hurts its predictions on new, unseen data. Lower training error and better real-world performance are not the same thing."
);
