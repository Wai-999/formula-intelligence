// Persona learning tracks — curated routes through content that already
// exists, aimed at what a specific kind of learner needs it FOR.
//
// The existing Learning Path page answers "what must I know before formula
// X?" — a dependency question, computed from the prerequisite graph. That
// is the right answer to a different question than "I want to become a data
// scientist, where do I start and what can I skip?" A dependency chain
// cannot answer the second, because relevance to a ROLE is an editorial
// judgment, not a property of the graph: an economist and an ML engineer
// need genuinely different subsets of the same 94 formulas, and both need
// permission to skip the rest.
//
// Every item below references content already in the repo by id — stats
// formulas (nodes.js), ML models (ml/models.js), or ML mode tabs. Nothing
// here authors new material; a track is an ordered opinion about existing
// material, which is also why adding one is cheap.
//
// Completion is derived from the same spaced-repetition mastery data the
// dashboard uses (see trackProgress below), so a track can never claim
// progress the rest of the app disagrees with.

/**
 * kind: 'formula' → an id in nodes.js
 *       'model'   → an id in ml/models.js
 *       'module'  → an ML mode tab id (a whole page to work through)
 */
const f = (id, why) => ({ kind: 'formula', id, why });
const m = (id, why) => ({ kind: 'model', id, why });
const mod = (id, why) => ({ kind: 'module', id, why });

export const LEARNING_TRACKS = [
  {
    id: 'student',
    name: 'Statistics Student',
    icon: 'ti-school',
    audience: 'Taking an intro statistics course and being examined on it',
    blurb: 'The curriculum in the order a course teaches it, with the exam-critical formulas marked. Follows Bluman chapter order rather than reordering by "usefulness" — because your exam does too.',
    stages: [
      {
        title: 'Describe data',
        goal: 'Summarize a dataset with a center and a spread, and know when each one lies.',
        items: [
          f('x_bar', 'The anchor of nearly every later formula'),
          f('samp_sd', 'The spread measure every test statistic divides by'),
          f('iqr', 'The robust alternative — knowing when to switch is the actual skill'),
          f('zscore', 'Turns any value into "how unusual is this?"'),
        ],
      },
      {
        title: 'Probability foundations',
        goal: 'Compute event probabilities and know which rule applies when.',
        items: [
          f('add2', 'The general OR rule — Rule 1 is only its special case'),
          f('mult2', 'The general AND rule; the chain rule everything sequential is built on'),
          f('cond_p', 'Conditional probability and Bayes — the most misread idea in the course'),
          f('comb', 'Counting, because half of probability is counting correctly'),
        ],
      },
      {
        title: 'Distributions',
        goal: 'Recognize which distribution a situation implies.',
        items: [
          f('binom', 'Fixed trials, yes/no outcome'),
          f('poisson', 'Counts per interval, no fixed n'),
          f('znorm', 'The normal table lookup every later chapter assumes'),
          f('clt', 'Why sample means are normal even when the data is not'),
        ],
      },
      {
        title: 'Inference',
        goal: 'Move from a sample to a claim about the population — with honest uncertainty.',
        items: [
          f('t_ci', 'The interval you will actually compute (σ is never known)'),
          f('t_test', 'The one-sample test the course spends the longest on'),
          f('t2mu', 'Comparing two groups — the most examined test of all'),
          f('t_dep', 'Paired data; picking this over t2mu is a classic exam trap'),
        ],
      },
      {
        title: 'Relationships & beyond',
        goal: 'Quantify association, then extend to more than two groups.',
        items: [
          f('pearson', 'Correlation, and why it is not causation'),
          f('reg', 'The regression line — slope in real units'),
          f('anova_f', 'Three or more groups without inflating your error rate'),
          f('chi_ind', 'Two categorical variables'),
        ],
      },
    ],
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    icon: 'ti-chart-dots',
    audience: 'Building models on real business data',
    blurb: 'Skips the hand-computation emphasis of a stats course and front-loads the things that actually decide whether a model ships: assumptions, validation, and knowing which model to reach for.',
    stages: [
      {
        title: 'Read a dataset honestly',
        goal: 'Know what your data is before modeling it.',
        items: [
          f('x_bar', 'And why the median disagreeing with it is a finding'),
          f('iqr', 'Outlier fences that outliers cannot sabotage'),
          f('cvar', 'Compare variability across features on different scales'),
          f('pearson', 'Screen linear associations — then plot, always'),
        ],
      },
      {
        title: 'Quantify uncertainty',
        goal: 'Distinguish a real effect from sampling noise.',
        items: [
          f('sem', 'The √n law — the economics of collecting more data'),
          f('t_ci', 'The interval that belongs beside every point estimate'),
          f('p_ci', 'The ±3% in every conversion-rate report'),
          f('z2p', 'The A/B test referee'),
        ],
      },
      {
        title: 'Baseline models',
        goal: 'Establish the benchmark anything fancier must beat.',
        items: [
          m('linreg', 'The baseline every regression project should start with'),
          m('logreg', 'Calibrated probabilities and odds ratios you can defend'),
          m('ridge_lasso_en', 'When features are many and correlated'),
          m('dtree', 'Rules a stakeholder can audit line by line'),
        ],
      },
      {
        title: 'Models that win',
        goal: 'Know why gradient boosting dominates tabular work — and its cost.',
        items: [
          m('rf', 'Strong results with almost no tuning'),
          m('gbm', 'Bias reduction; early stopping is not optional'),
          m('xgboost', 'The production workhorse, with SHAP for explanations'),
          m('lightgbm', 'When the data is large enough that speed changes how you work'),
        ],
      },
      {
        title: 'Prove it works',
        goal: 'Validation and explanation, which is where projects actually fail.',
        items: [
          mod('evaluation', 'Metrics, walk-forward validation, SHAP vs LIME'),
          mod('python', 'Production-quality implementations of everything above'),
          f('r2', 'And why it is not a measure of correctness'),
          f('se_est', 'Model error in the units the business feels'),
        ],
      },
    ],
  },
  {
    id: 'ml-engineer',
    name: 'ML Engineer',
    icon: 'ti-cpu',
    audience: 'Shipping and maintaining models in production',
    blurb: 'Assumes the statistics and concentrates on model families, sequence architectures, and the operational realities — drift, validation discipline, and the cost of complexity.',
    stages: [
      {
        title: 'The pipeline',
        goal: 'See the whole path from raw data to a decision before optimizing any part of it.',
        items: [
          mod('pipeline', 'The seven stages, and where projects actually die'),
          mod('modelmap', 'The full landscape: 32 models and how they relate'),
        ],
      },
      {
        title: 'Ensembles in depth',
        goal: 'Understand variance vs bias reduction well enough to diagnose, not guess.',
        items: [
          m('bagging', 'Variance reduction — the diagnosis that calls for it'),
          m('boosting', 'Bias reduction — the complementary diagnosis'),
          m('stacking', 'And when the added serving complexity is not worth it'),
          m('catboost', 'Categorical-heavy data without leaky target encoding'),
        ],
      },
      {
        title: 'Sequences and deep learning',
        goal: 'Know when a neural network earns its cost over a classical model.',
        items: [
          m('rnn', 'The concept; and why it fails on long sequences'),
          m('lstm', 'Gated memory — the practical default'),
          m('cnn', 'Local motif detection, fully parallel'),
          m('transformer', 'Attention, and the honest benchmark against LSTM'),
        ],
      },
      {
        title: 'Uncertainty & control',
        goal: 'Models that admit what they do not know, and decisions that unfold over time.',
        items: [
          m('gp', 'Calibrated uncertainty from few, expensive observations'),
          m('bstsbnn', 'Posterior distributions instead of point estimates'),
          m('qlearning', 'Sequential decisions with delayed reward'),
          m('actorcritic', 'Continuous action spaces'),
        ],
      },
      {
        title: 'Operations',
        goal: 'The parts nobody teaches and everybody hits.',
        items: [
          mod('evaluation', 'Drift, monitoring, and explainability in production'),
          mod('playground', 'Bias-variance, felt rather than described'),
          mod('sources', 'Where every figure in this app comes from — and how to keep that discipline'),
        ],
      },
    ],
  },
  {
    id: 'economist',
    name: 'Economist / Forecaster',
    icon: 'ti-building-bank',
    audience: 'Forecasting time series and reasoning about policy effects',
    blurb: 'Time-series first. Ignores most of the cross-sectional machinery and goes deep on stationarity, autocorrelation, volatility and the domain labs where those play out.',
    stages: [
      {
        title: 'Statistical grounding',
        goal: 'The inference a forecaster actually reuses.',
        items: [
          f('reg', 'The workhorse; slope in real units'),
          f('pred_int', 'The interval for one future observation — not the mean'),
          f('t_r', 'Whether a correlation survives its own sample size'),
          f('se_est', 'Forecast error in the units of the decision'),
        ],
      },
      {
        title: 'Classical time series',
        goal: 'Stationarity, autocorrelation, and the benchmark everything must beat.',
        items: [
          m('arima', 'Fifty years old and still the benchmark'),
          m('expsmooth', 'What wins forecasting competitions more often than expected'),
          m('var', 'Multivariate dynamics and impulse responses'),
          m('garch', 'Volatility clustering — risk, not direction'),
        ],
      },
      {
        title: 'Modern practice',
        goal: 'Where ML genuinely adds over econometrics, and where it does not.',
        items: [
          m('prophet', 'Calendar-driven business series'),
          m('hybrid', 'Econometric core plus ML on the residuals'),
          m('ridge_lasso_en', 'High-dimensional nowcasting — often beats fancier ML'),
        ],
      },
      {
        title: 'Applied labs',
        goal: 'The same models against real forecasting problems.',
        items: [
          mod('macro', 'GDP nowcasting under data-release lags'),
          mod('gold', 'Five drivers, four model families, one price'),
          mod('politics', 'Geopolitical risk as a quantified feature'),
        ],
      },
    ],
  },
  {
    id: 'analyst',
    name: 'Business / Financial Analyst',
    icon: 'ti-presentation-analytics',
    audience: 'Turning data into decisions and defending them to stakeholders',
    blurb: 'Optimized for what survives a meeting: honest intervals, clean comparisons, and the ability to say why a number should or should not be acted on.',
    stages: [
      {
        title: 'Summarize without misleading',
        goal: 'The four numbers most reports get wrong.',
        items: [
          f('x_bar', 'And the mean-median gap as a skew detector'),
          f('wmean', 'Averaging averages is the most common dashboard bug there is'),
          f('pctile', 'Percentiles, because averages hide the tail'),
          f('cvar', 'Compare volatility across different scales'),
        ],
      },
      {
        title: 'Say how sure you are',
        goal: 'Never present a point estimate naked.',
        items: [
          f('t_ci', 'The interval for a mean'),
          f('p_ci', 'The margin of error in every rate you quote'),
          f('n_prop', 'How big a sample your precision claim actually requires'),
          f('cheby', 'A guarantee that survives non-normal data'),
        ],
      },
      {
        title: 'Compare fairly',
        goal: 'Decide whether a difference is real before acting on it.',
        items: [
          f('z2p', 'A/B tests on conversion rates'),
          f('t2mu', 'Two groups on a continuous metric'),
          f('chi_ind', 'Segment versus outcome'),
          f('anova_f', 'Three or more options at a controlled error rate'),
        ],
      },
      {
        title: 'Model and explain',
        goal: 'Enough modeling to be useful, with explanations that hold up.',
        items: [
          m('linreg', 'Coefficients as talking points'),
          m('logreg', 'Odds ratios: "3+ support calls triples churn odds"'),
          m('dtree', 'A flowchart that doubles as the policy document'),
          mod('python', 'The code, when you need to hand it to someone'),
        ],
      },
    ],
  },
  {
    id: 'researcher',
    name: 'Researcher',
    icon: 'ti-microscope',
    audience: 'Designing studies and publishing defensible results',
    blurb: 'Assumption-first. Emphasizes what invalidates a test, the nonparametric fallbacks, and effect sizes over p-values — the parts reviewers actually attack.',
    stages: [
      {
        title: 'Design before data',
        goal: 'Decisions that cannot be fixed after collection.',
        items: [
          f('n_mean', 'Sample size from a precision requirement'),
          f('sem', 'What precision your n actually buys'),
          f('z_test', 'Hypotheses and tails fixed in advance, not after'),
          f('mu_xbar', 'Why a random sample is unbiased — and why a convenient one is not'),
        ],
      },
      {
        title: 'Core inference',
        goal: 'The tests, and the assumptions that void them.',
        items: [
          f('t_test', 'With effect size, not just a p-value'),
          f('t_dep', 'Pairing as a power strategy'),
          f('f_test', 'Comparing variances — and its fragility to non-normality'),
          f('anova2', 'Interactions: effects that one-factor-at-a-time cannot see'),
        ],
      },
      {
        title: 'When assumptions fail',
        goal: 'The fallbacks, and the cost of using them.',
        items: [
          f('wrs', 'Rank-based two-group comparison'),
          f('wsrt', 'The paired nonparametric test'),
          f('kw', 'Three or more groups, distribution-free'),
          f('spear', 'Monotonic association without linearity'),
        ],
      },
      {
        title: 'Beyond frequentism',
        goal: 'Simulation and posterior reasoning.',
        items: [
          f('mc_prob', 'Answer probability questions with no closed form'),
          f('mc_steps', 'A simulation design that survives review'),
          m('gp', 'Uncertainty when each observation is expensive'),
          m('bstsbnn', 'Credible intervals and counterfactual estimation'),
        ],
      },
    ],
  },
];

/**
 * Track completion, derived from data the app already records — but from a
 * DIFFERENT source per item kind, because the two halves of the app measure
 * understanding differently and pretending otherwise breaks a whole track.
 *
 * - formulas: spaced-repetition mastery (the dashboard's own signal)
 * - models:   Depth Ladder engagement, since ML models have no flashcards.
 *             Using SR mastery for both would leave the ML Engineer track
 *             permanently at 0/12 no matter how much of it a learner did.
 * - modules:  excluded from the denominator entirely. They are pages, not
 *             assessable items, and a bar that can never reach 100% teaches
 *             learners to ignore bars.
 */
export function trackProgress(track, isDone) {
  let done = 0;
  let total = 0;
  for (const stage of track.stages) {
    for (const item of stage.items) {
      if (item.kind === 'module') continue;
      total++;
      if (isDone(item)) done++;
    }
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function stageProgress(stage, isDone) {
  const items = stage.items.filter((i) => i.kind !== 'module');
  const done = items.filter((i) => isDone(i)).length;
  return { done, total: items.length, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
}
