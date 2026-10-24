import { bl, blSame } from '../../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §6.2. The doc gives model
// comparisons and categories of proxy data ("financial markets, surveys,
// satellite/mobility data") but no single named driver list the way §6.1
// does for Gold — the five drivers below are a realistic, illustrative
// instantiation of those categories (yield curve, survey sentiment, labor
// market, mobility/spending, trade/freight are all genuinely used in
// real-world nowcasting practice), not a verbatim doc quote. Coefficients
// are illustrative throughout; there is no single real reported GDP nowcast
// figure to cite the way Gold's spot price could be, so the base value is
// synthetic too — see MLCitation usage below.
export const MACRO_BASE_VALUE = 2.1; // illustrative current-quarter GDP growth nowcast, % annualized
export const MACRO_BASE_BAND = 0.6; // percentage points

export const MACRO_CONTEXT = bl(
  "Official GDP numbers come out weeks after a quarter ends — by the time they're published, the quarter they describe is already old news. \"Nowcasting\" uses faster-moving signals (markets, surveys, mobility data) to estimate growth right now, before the official number exists.",
  'Official GDP/inflation/employment statistics publish with a multi-week lag, creating an information gap between what\'s happening and what can be measured. Nowcasting fills that gap with higher-frequency proxy data; central banks and the IMF now run econometric and ML nowcasts side-by-side.'
);

export const MACRO_DRIVERS = [
  {
    key: 'yieldCurve', coefficient: 0.35,
    label: blSame('Yield curve slope (10y−2y)'),
    relation: bl('Steeper/positive curve → healthy growth signal; inverted → recession warning', 'Positive — the most-cited leading indicator; inversion is the classic recession predictor'),
  },
  {
    key: 'surveySentiment', coefficient: 0.30,
    label: blSame('Survey sentiment (PMI / confidence)'),
    relation: bl('Stronger business/consumer sentiment → nowcast rises', 'Positive — one of the doc\'s named high-frequency proxy categories'),
  },
  {
    key: 'laborMarket', coefficient: 0.30,
    label: blSame('Labor market strength'),
    relation: bl('Fewer jobless claims, stronger hiring → nowcast rises', 'Positive — a classic weekly high-frequency proxy for the (lagging) official employment report'),
  },
  {
    key: 'mobilityActivity', coefficient: 0.25,
    label: blSame('Mobility & spending activity'),
    relation: bl('More card-spending and mobility/satellite activity → nowcast rises', 'Positive — the doc\'s "satellite/mobility data" proxy category, made concrete'),
  },
  {
    key: 'tradeFreight', coefficient: 0.20,
    label: blSame('Trade & freight volume'),
    relation: bl('More shipping/freight throughput → nowcast rises', 'Positive — smallest weight here, but often the earliest-available signal of a demand shock'),
  },
];

export const MACRO_MODELS = [
  {
    key: 'dfm', name: blSame('Dynamic Factor Model (DFM)'),
    note: bl(
      "The classic approach — steady and structural, but slow to update: it trusts its underlying model more than any single new data point.",
      "Damped response (0.5×) and the narrowest, most stable band — reflects DFM's documented strength at backcasts (revising already-elapsed quarters), not fast-moving nowcasts."
    ),
    color: '#8b5cf6',
  },
  {
    key: 'randomForest', name: blSame('Random Forest'),
    note: bl(
      'Reacts to every signal but each one saturates instead of piling up without limit — the most accurate all-rounder for nowcasts in real comparative studies, especially for inflation.',
      'Per-driver tanh saturation (split-based thresholding); band widens once any single signal turns extreme. Documented as most accurate for forecasts/nowcasts generally, and specifically the single most precise method for inflation.'
    ),
    color: '#22d3ee',
  },
  {
    key: 'lassoElasticNet', name: blSame('LASSO / Elastic Net'),
    note: bl(
      'The simplest model here — just adds up the signals directly, no damping, no saturation. Often beats the fancier models when there\'s enough high-frequency data to work with.',
      'Full, undamped linear response — regularized linear regression, no structural anchoring or nonlinear shaping. Frequently outperforms both DFM and more complex ML when data is rich and high-frequency (see callout below).'
    ),
    color: '#fbbf24',
  },
];

export const MACRO_SCENARIOS = [
  {
    id: 'curve-inverts', label: blSame('Yield curve inverts sharply'),
    state: { yieldCurve: -1.8, surveySentiment: -0.6, laborMarket: -0.2, mobilityActivity: -0.3, tradeFreight: -0.4 },
  },
  {
    id: 'broad-expansion', label: blSame('Broad-based expansion'),
    state: { yieldCurve: 0.8, surveySentiment: 1.0, laborMarket: 1.2, mobilityActivity: 0.9, tradeFreight: 0.7 },
  },
  {
    id: 'soft-landing', label: blSame('Soft-landing signals'),
    state: { yieldCurve: 0.2, surveySentiment: 0.5, laborMarket: 0.6, mobilityActivity: 0.1, tradeFreight: 0.1 },
  },
  {
    id: 'trade-mobility-shock', label: blSame('Trade & mobility shock'),
    state: { yieldCurve: -0.3, surveySentiment: -0.4, laborMarket: 0, mobilityActivity: -1.6, tradeFreight: -1.7 },
  },
];

export const MACRO_TRACE_INTRO = bl(
  'Move any signal above, then check this panel — it shows exactly which one pushed the nowcast, in which direction, and by roughly how much.',
  "Per-driver percentage-point contribution to the linear-response baseline, sorted by magnitude — the same decomposition as Gold's trace panel, applied to the nowcast."
);

export const MACRO_GAP_INTRO = bl(
  "Here's the actual problem nowcasting solves: by the time official GDP data for a quarter is published, that quarter is already over — and the next one is well underway.",
  'Official statistical releases lag the reference period by roughly a month or more; by publication, the described quarter has already ended. Nowcasting substitutes higher-frequency proxy data for the missing "hard" figures during that gap.'
);

export const MACRO_GAP_LABELS = {
  quarterEnd: blSame('Quarter ends'),
  today: blSame('Today'),
  officialRelease: blSame('Official GDP released (~4 weeks later)'),
  gapZone: blSame('Information gap'),
  nowcastPin: blSame('Nowcast fills the gap'),
};

export const MACRO_SIMPLICITY_CALLOUT = bl(
  'Surprising but true: the simplest model on this page — LASSO/Elastic Net — often beats both the classic econometric model and the fancier machine-learning model, once there\'s enough fast-moving data feeding it. More complexity isn\'t automatically more accurate.',
  '"LASSO/Elastic Net (linear ML) frequently outperform more complex ML and traditional econometric models when data is rich and high-frequency — a great simplicity-wins teaching moment" — a documented finding in the nowcasting literature, not a fluke of this illustration.'
);

// Module 11 audit (see gold.js's identical note).
export const MACRO_PAGE_TITLE = blSame('Macro Economics Lab — Nowcasting');
export const MACRO_GAP_SECTION_TITLE = blSame('The information gap');
export const MACRO_SIGNALS_TITLE = blSame('High-frequency signals');
export const MACRO_MODELS_TITLE = blSame('Three models, three different jobs');
export const MACRO_MODELS_SUB = blSame(
  'Move a signal above and watch the nowcast move — but not by the same amount, or for the same reason.'
);
export const MACRO_TRACE_TITLE = blSame('Why did the nowcast move?');
export const MACRO_SIMPLICITY_TITLE = blSame('Simplicity can win');

// Learning Design System retrofit (Module 7): Constructive Thought Loop on
// the signals panel + one consolidated Depth Ladder whose Critical Frontier
// formalizes the "fancier isn't always better" moment the page already had
// informally (MACRO_SIMPLICITY_CALLOUT above, kept as-is on the page — this
// content extends rather than duplicates it). The worked example is
// computed from the exact computeMacroForecasts() formulas the chart above
// uses (yieldCurve=1.0, all else 0), independently re-derivable live.
export const MACRO_PREDICT_Q = blSame(
  'Push every signal to its strongest positive reading. Which model do you expect to be most accurate in the real world — the fanciest one, or the simplest one?'
);
export const MACRO_PREDICT_FANCY = blSame(
  'The fanciest one (Random Forest) — more sophistication should mean more accuracy'
);
export const MACRO_PREDICT_DEPENDS = blSame(
  'It depends — the simplest one (LASSO) sometimes wins when data is rich and high-frequency'
);
export const MACRO_PREDICT_EXPLAIN = blSame(
  "There's no universal winner visible in the chart alone — but the callout below the models explains why the answer is genuinely \"it depends,\" not a trick question."
);

export const MACRO_SPARK_ANALOGY = blSame(
  "A master chef with forty ingredients can make a worse dish than a home cook with five, if the chef adds ingredients that don't actually belong. More model complexity is the same bet: it only pays off if the extra machinery is capturing something real, not just extra noise."
);

export const MACRO_MECHANISM_NOTE = blSame(
  "You already ran this mechanism above — push any signal and all three models react from the identical driver state. Watch DFM's damped, cautious move versus LASSO's full, undamped one on the exact same push."
);

export const MACRO_FORMALISM_WORKED = bl(
  "Worked example: push yield curve to 1.0 (coefficient +0.35), everything else at 0. Linear baseline = +0.35pp. DFM's 0.5× damping gives +0.175pp; LASSO takes the full, undamped +0.35pp; Random Forest's tanh saturation lands at roughly +0.28pp — between the two. With only one signal active, LASSO isn't \"cutting corners,\" it's just not damping or saturating a response the data may genuinely warrant.",
  "Worked example: push yield curve to 1.0 (coefficient +0.35), everything else at 0. Linear baseline = +0.35pp. DFM's 0.5× damping gives +0.175pp; LASSO takes the full, undamped +0.35pp; Random Forest's tanh saturation lands at roughly +0.28pp — between the two. With only one signal active, LASSO isn't \"cutting corners,\" it's just not damping or saturating a response the data may genuinely warrant."
);
export const MACRO_FORMALISM_FADED = blSame(
  'Now you try: set every signal to 1.0 at once (a "broad-based expansion"). Step 1 — what\'s the simple sum of all five coefficients (the LASSO/undamped answer)? Step 2 — will DFM\'s damped answer be closer to or further from that sum than it was with only one signal active, and why: _____.'
);

export const MACRO_CF_ANALOGY_BREAK = blSame(
  "The chef analogy breaks down on measurability: a bad ingredient ruins a dish in a way every diner can taste immediately. A model that's \"too fancy\" for its data doesn't announce itself — it can look impressively sophisticated in a demo and only reveal its overfitting months later, on data it hasn't seen yet. That's exactly why this simplicity finding required real comparative studies to establish, not a single convincing-looking example."
);
export const MACRO_CF_CAVEAT = blSame(
  'A real caveat: "simplicity can win" is not "simplicity always wins." The callout above is specific — LASSO tends to outperform when data is rich and high-frequency. With scarce or noisy data, DFM\'s structural anchoring and caution are exactly what keeps it from chasing noise the way an undamped linear model might.'
);
export const MACRO_CF_RETRIEVAL_Q = blSame(
  'A colleague says "always use the most complex model available, it can only help." What is the one-sentence rebuttal this page supports?'
);
export const MACRO_CF_RETRIEVAL_A = blSame(
  "More complexity only helps if the extra machinery captures a real pattern the data actually contains — otherwise it's just extra capacity to overfit noise, which is exactly why the simplest model here (LASSO) frequently outperforms both the classic econometric model and the fancier ML model in real nowcasting comparisons."
);
