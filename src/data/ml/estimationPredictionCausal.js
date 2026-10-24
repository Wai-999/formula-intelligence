import { bl, blSame } from '../../lib/mlContent.js';

// Module 11 audit (see gold.js's identical note in domains/).
export const EPC_TITLE = blSame(
  'Estimation vs. Prediction vs. Causal Inference'
);
export const EPC_GOAL_LBL = blSame('Goal');
export const EPC_OUTPUT_LBL = blSame('Typical output');
export const EPC_EXAMPLE_LBL = blSame('Example');
export const EPC_METHODS_LBL = blSame('Method family');
export const EPC_FAILURE_LBL = blSame('Failure mode if confused');

// Source: docs/research/ML-Research-Reference.md §2. The single most
// important conceptual hinge between Stats mode and ML mode — built as its
// own interactive panel per the research doc's explicit design note.
export const EPC_INTRO = bl(
  'The same regression on gold price vs. real yields can be looked at two completely different ways. Click each column below to see what changes.',
  'The same underlying object — e.g. linear regression of gold price on real yields — supports three distinct questions. Confusing them is the single most common conceptual error at the Stats/ML boundary.'
);

export const EPC_COLUMNS = [
  {
    id: 'estimation',
    label: bl('Estimation', 'Estimation'),
    territory: bl('Classic Stats territory', 'Classic Stats territory'),
    goal: bl(
      'Pin down the true value of a fixed number hiding in the data — like "how much does gold really move per 1% change in real yields?"',
      'Infer the true value of a fixed but unknown parameter (a coefficient, a mean, a variance) from a sample.'
    ),
    output: bl(
      'A number plus how confident we are in it.',
      'A parameter estimate + standard error / confidence interval.'
    ),
    example: bl(
      '"Real yields\' effect on gold is about −312 — and we\'re 95% confident the true effect is somewhere between −400 and −224."',
      '"The coefficient on real yields in a gold-price regression is −312, 95% CI [−400, −224]."'
    ),
    methods: bl(
      'OLS, Maximum Likelihood, Bayesian methods — the frequentist end of this toolkit is exactly Stats mode\'s own t CI for the mean.',
      'OLS, Maximum Likelihood Estimation (MLE), Bayesian posterior estimation — the frequentist branch overlaps directly with Stats mode\'s ci_mean_t content.'
    ),
    failure: bl(
      'Mistaking "I\'m confident about this coefficient" for "I know what gold will do next month" — those are different questions.',
      'Mistaking a tight confidence interval for a guarantee about a future value — the interval describes the parameter, not next quarter\'s price.'
    ),
    accentVar: '--primary',
  },
  {
    id: 'prediction',
    label: bl('Prediction', 'Prediction'),
    territory: bl('Classic ML territory', 'Classic ML territory'),
    goal: bl(
      'Take a real guess at a number we don\'t know yet — "what will gold actually trade at next month?"',
      'Guess the value of a random, currently-unobserved outcome.'
    ),
    output: bl(
      'A single best-guess number plus a plausible range around it.',
      'A point forecast + prediction interval.'
    ),
    example: bl(
      '"Gold will trade around $4,180, plus or minus $150."',
      '"Gold will trade at $4,180 ± $150 next month."'
    ),
    methods: bl(
      'Regularized regression, decision trees/ensembles, neural networks — anything trained to minimize prediction error.',
      'Regularized regression, trees/ensembles, neural nets, any loss-minimizing algorithm.'
    ),
    failure: bl(
      'Mistaking "this feature predicts well" for "this feature causes the outcome" — a model can lean hard on a variable that\'s just a bystander.',
      'Mistaking a highly predictive feature for a causal driver — ML routinely "dismisses" covariates with low predictive power even when they\'re crucial confounders.'
    ),
    accentVar: '--accent',
  },
  {
    id: 'causal',
    label: bl('Causal Inference', 'Causal Inference'),
    territory: bl('The often-confused third sibling', "The third, often-confused sibling"),
    goal: bl(
      'Work out what would have happened under a hypothetical "what if" — "if the Fed had cut rates, would gold actually have risen because of that?"',
      'Determine what a variable\'s value would have been under a hypothetical intervention.'
    ),
    output: bl(
      'An estimate of the effect of deliberately changing one thing, holding everything else fixed.',
      'An average treatment effect.'
    ),
    example: bl(
      '"If the Fed cuts rates by 50bps, gold rises by roughly X — holding the dollar, inflation expectations, and everything else fixed."',
      '"If the Fed cuts rates by 50bps, gold rises by X, holding everything else fixed."'
    ),
    methods: bl(
      'Potential-outcomes framework, instrumental variables, "double ML", randomized controlled trials.',
      'Potential-outcomes framework, instrumental variables, double ML, RCTs.'
    ),
    failure: bl(
      'Using a purely predictive model to claim "X causes Y" — a model can predict gold well using DXY without DXY actually driving it (both could be reacting to a third factor).',
      'Using purely predictive ML models to claim "X causes Y" — correlation ≠ causation, and predictive accuracy alone can never establish the direction or existence of a causal link.'
    ),
    accentVar: '--warning',
  },
];

export const EPC_BRIDGE_NOTE = bl(
  'Why this matters for the mode switch: the exact same model (e.g. "linear regression on gold price vs. real yields") can be looked at from either lens. Stats asks "how confident am I in this coefficient?" ML asks "how well does this generalize to gold prices next quarter?" A good learner can flip between the two questions on the same node.',
  'Why this matters for the mode switch: the same underlying object supports two questions — the Stats lens asks whether a coefficient is statistically significant, the ML lens asks how well the fitted model generalizes out-of-sample.'
);

// Module 11 audit: the three per-column demo components (Estimation/
// Prediction/Causal) also had hardcoded English labels and body text.
export const EST_DEMO_LBL = blSame('Same coefficient, Stats-mode lens');
export const EST_DEMO_TEXT = blSame(
  "A frequentist confidence interval like Stats mode's own t CI for the mean treats the parameter as fixed and the interval as random. A posterior distribution flips that: the parameter itself is treated as uncertain. Same-looking interval, different meaning underneath."
);
export const EST_DEMO_BTN = blSame(
  'See how estimation is done in Python (Python Hub)'
);

export const PRED_DEMO_LBL = blSame('Point forecast + prediction interval');
export const PRED_DEMO_TEXT = blSame(
  '"Gold will trade at $4,180 ± $150 next month" — a single best guess (the dot) plus a band of plausible outcomes (the shaded range), not a claim about a fixed, knowable parameter.'
);

export const CONF_DEMO_LBL = blSame('The classic confounder pitfall');
export const CONF_DEMO_TEXT = blSame(
  "A model can predict gold accurately using DXY as a feature — but DXY doesn't cause gold to move. Both react to the same underlying driver (Fed policy). Predictive power alone never tells you which arrows in this diagram are real."
);
export const CONF_FED_LABEL = blSame('Fed policy (the real driver)');
export const CONF_DXY_LABEL = blSame('DXY');
export const CONF_GOLD_LABEL = blSame('Gold price');
export const CONF_PREDICTS_LABEL = blSame('predicts well —');
export const CONF_BUTDOESNT_LABEL = blSame("but doesn't cause"
);

// Module 2 Learning Design System retrofit: the three-bucket sorting
// exercise the mission requires as this panel's Predict step, before the
// tab exploration. Six items spanning all three buckets, drawn from real
// gold-forecasting questions this module and Module 6 both use.
export const EPC_SORT_TITLE = blSame(
  'Sort each question into the right bucket'
);
export const EPC_SORT_INTRO = blSame(
  'Before exploring the three columns below, try this: each question below is really asking one of Estimation, Prediction, or Causal Inference — sort all six, then check your answers.'
);
export const EPC_SORT_CHECK_BTN = blSame('Check my answers');
export const EPC_SORT_CORRECT_LBL = blSame('Correct');
export const EPC_SORT_ACTUAL_TEMPLATE = blSame('Actually: {bucket}');

export const EPC_SORT_ITEMS = [
  {
    id: 'next-month-price',
    text: blSame('What will gold cost next month?'),
    correctBucket: 'prediction',
  },
  {
    id: 'coefficient-significant',
    text: blSame(
      "Is the coefficient on real yields in the gold-price regression statistically significant?"
    ),
    correctBucket: 'estimation',
  },
  {
    id: 'rate-cut-cause',
    text: blSame(
      'Would a Fed rate cut actually cause the price of gold to rise, or would they just move together anyway?'
    ),
    correctBucket: 'causal',
  },
  {
    id: 'ci-width',
    text: blSame(
      'How confident are we that the true effect of real yields on gold is somewhere between −400 and −224?'
    ),
    correctBucket: 'estimation',
  },
  {
    id: 'tomorrow-direction',
    text: blSame("Will tomorrow's gold price be higher or lower than today's?"),
    correctBucket: 'prediction',
  },
  {
    id: 'cb-buying-stops',
    text: blSame(
      'If central banks stopped buying gold entirely, would the price actually fall as a direct result?'
    ),
    correctBucket: 'causal',
  },
];
