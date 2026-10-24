import { bl, blSame } from '../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §5.
export const METRICS_INTRO = bl(
  'Every model needs a score. These five are the most common — pick the fitted model from the playground above and see how each one scores it differently.',
  'MAE/RMSE/MAPE/R²/AIC/BIC computed against the currently-selected playground fit, illustrating that "which metric" is itself a modeling choice.'
);

export const METRIC_DEFS = [
  { key: 'mae', label: 'MAE', name: bl('Average absolute error', 'Mean Absolute Error'), note: blSame('Robust to outliers.') },
  { key: 'rmse', label: 'RMSE', name: bl('Root mean squared error', 'Root Mean Squared Error'), note: blSame('Penalizes large misses harder — good when big misses (e.g., missing a gold price spike) are especially costly.') },
  { key: 'mape', label: 'MAPE', name: bl('Average % error', 'Mean Absolute Percentage Error'), note: blSame('Intuitive for non-technical stakeholders; unstable near zero values.') },
  { key: 'r2', label: 'R²', name: bl('Variance explained', 'Coefficient of Determination'), note: blSame('Goodness-of-fit summary.') },
  { key: 'aic', label: 'AIC', name: bl('Penalized fit score', 'Akaike Information Criterion'), note: blSame('Penalized likelihood for model comparison.') },
  { key: 'bic', label: 'BIC', name: bl('Stricter penalized fit score', 'Bayesian Information Criterion'), note: blSame('Penalizes complexity more heavily — favors simpler models on small/medium samples.') },
];

// Constructive Thought Loop on the backtest scrubber/play control (D.2) —
// applies to every driver, not only "showcase" ones like this animation.
export const EV_BACKTEST_PREDICT_Q = blSame(
  'Before you press play: which split below is actually safe to trust for a time-series forecast?'
);
export const EV_BACKTEST_PREDICT_NAIVE = blSame(
  'The naive random split — every point still comes from the same dataset either way'
);
export const EV_BACKTEST_PREDICT_WF = blSame(
  "Walk-forward — it never trains on a point time-stamped after the one it's being tested on"
);
export const EV_BACKTEST_PREDICT_EXPLAIN = blSame(
  "Scrub the walk-forward row and watch its train region only ever grow forward from the left — it can never include a cell to the right of the current test window. The naive split above has no such rule: some of its blue \"train\" cells sit chronologically after some of its orange \"test\" cells, meaning the model would have trained on the future before being tested on the past."
);

// Constructive Thought Loop directly on the Metrics panel's own model/
// complexity controls (D.2) — not just the conceptual Spark-layer predict.
export const EV_METRICS_PREDICT_Q = blSame(
  'Switch models and drag complexity around. As the fit gets worse and validation errors get more erratic, what happens to each metric\'s ± margin?'
);
export const EV_METRICS_PREDICT_SHRINKS = blSame(
  'The margin shrinks — more complexity always means a more precise estimate'
);
export const EV_METRICS_PREDICT_WIDENS = blSame(
  'The margin can widen — more erratic errors mean this particular estimate is less trustworthy'
);
export const EV_METRICS_PREDICT_EXPLAIN = blSame(
  'Push complexity high enough to overfit and watch RMSE/MAE\'s margin move — an erratic, overfit model doesn\'t just score worse on average, its score is also less reliable point-to-point, and the margin is built to say so.'
);

export const BACKTEST_INTRO = bl(
  'Time series can\'t be shuffled. Watch why: the naive split peeks at the future during training, while walk-forward validation never does.',
  'Walk-forward (rolling-origin) backtesting repeatedly trains on data up to time t and tests on t+1…t+h, rolling forward — contrasted against a single random train/test split, which leaks future information into training for time-indexed data.'
);

export const SHAP_INTRO = bl(
  'This chart answers: "which macro variables drive the gold forecast overall?" — averaged across every prediction the model makes.',
  'SHAP (Shapley values): consistent, theoretically grounded, global feature importance across the whole model.'
);

// Static, precomputed — no live SHAP/LIME library run (Module 5's own spec
// explicitly allows a faithful approximation). Feature set matches Module
// 6's gold drivers so this previews that lab rather than using a disjoint
// example.
export const SHAP_FEATURES = [
  { key: 'realYields', label: blSame('Real yields'), importance: 0.34 },
  { key: 'dxy', label: blSame('US Dollar Index (DXY)'), importance: 0.27 },
  { key: 'geoRisk', label: blSame('Geopolitical risk'), importance: 0.19 },
  { key: 'cbDemand', label: blSame('Central bank demand'), importance: 0.13 },
  { key: 'inflation', label: blSame('Inflation / Fed path'), importance: 0.07 },
];

export const LIME_INTRO = bl(
  'This view answers a different question: "why did the model predict a spike this particular month?" — for one single prediction, not the model overall.',
  'LIME: fast, local explanation of one specific prediction, decomposed as a base value plus each feature\'s individual push.'
);

export const LIME_EXAMPLE = {
  baseValue: 4020,
  finalPrediction: 4287,
  contributions: [
    { key: 'geoRisk', label: blSame('Geopolitical risk spike'), value: 145 },
    { key: 'cbDemand', label: blSame('Central bank buying resumed'), value: 88 },
    { key: 'realYields', label: blSame('Real yields ticked up slightly'), value: -42 },
    { key: 'dxy', label: blSame('Dollar roughly flat'), value: 6 },
    { key: 'inflation', label: blSame('Inflation in line with expectations'), value: 70 },
  ],
};

export const DRIFT_INTRO = bl(
  'A model that was accurate last year can quietly go wrong this year if the relationship it learned stops holding. Press play and watch the error spike the moment the regime shifts.',
  'Concept drift: the relationship between features and target changes over time (e.g., gold\'s relationship to real yields shifts after a regime change like sustained central-bank buying). Production systems track feature/prediction distributions against a training-time baseline and trigger retraining when drift crosses a threshold.'
);

// Module 11 audit: page-chrome strings (titles/labels/legend/buttons) that
// were previously hardcoded English across the five Evaluation components.
export const EV_METRICS_TITLE = blSame('Evaluation Metrics');
export const EV_POLY_BTN = blSame('Polynomial');
export const EV_TREE_BTN = blSame('Decision Tree');
export const EV_COMPLEXITY_LBL = blSame('Complexity');

export const EV_WALKFORWARD_TITLE = blSame('Walk-Forward vs. Naive Split');
export const EV_NAIVE_SPLIT_LBL = blSame('Naive random split');
export const EV_NAIVE_SPLIT_SUB = blSame(
  'fixed — notice train (blue) cells appearing after test (amber) cells'
);
export const EV_WALKFORWARD_LBL = blSame('Walk-forward backtest');
// {origin} and {steps} are replaced with live numbers by the component —
// kept as a full-sentence template (not concatenated fragments) so Burmese
// word order stays grammatical.
export const EV_WF_SUB_TEMPLATE = blSame(
  'origin t={origin} — train up to origin, test the next {steps} steps, then roll forward'
);
export const EV_PLAY_BTN = blSame('Play');
export const EV_PAUSE_BTN = blSame('Pause');
export const EV_RESET_BTN = blSame('Reset');
export const EV_TRAIN_LEGEND = blSame('train');
export const EV_TEST_LEGEND = blSame('test');
export const EV_UNUSED_LEGEND = blSame('not yet used');

export const EV_SHAP_TITLE = blSame('Global Feature Importance (SHAP-style)');
export const EV_LIME_TITLE = blSame('Local Explanation (LIME-style)');
export const EV_BASE_VALUE_LBL = blSame('Base value (average forecast)');
export const EV_THIS_PREDICTION_LBL = blSame('This prediction');

export const EV_DRIFT_TITLE = blSame('Concept Drift');
export const EV_RETRAIN_THRESHOLD_LBL = blSame('retrain threshold');
export const EV_REGIME_CHANGE_LBL = blSame('regime change');
export const EV_TIME_PROGRESS_LBL = blSame('Time progress');
export const EV_DRIFT_ALERT = blSame('Drift detected — retrain?');
export const EV_DRIFT_OK = blSame('Model tracking within normal error range');

// Module 5 Learning Design System retrofit: refutes "Exactness" (every
// metric/forecast display shows a margin, never a bare point) and
// "Continuous Learning" (the drift demo), plus one consolidated Depth
// Ladder for the module — see BUILD_LOG.md Module 5 for why one ladder
// covering the whole page rather than four separate ones.
export const EV_LIME_BASE_MARGIN = blSame('± $85 (illustrative)');
export const EV_LIME_FINAL_MARGIN = blSame('± $110 (illustrative)');

export const EV_SPARK_ANALOGY = bl(
  "A weather app that says \"73°F\" sounds more confident than one that says \"70–76°F,\" but the second one is the honest one — a single-model forecast has exactly the same hidden range, it's just choosing not to show it.",
  'Every metric and every forecast computed from a finite sample carries sampling uncertainty; reporting only the point estimate discards the single most decision-relevant part of the result.'
);
export const EV_SPARK_PREDICT_Q = blSame(
  'A model reports "RMSE = 1.27" with no margin shown. If you tested it on a different, equally-valid sample of validation data, would you expect to get exactly 1.27 again?'
);
export const EV_SPARK_PREDICT_YES = blSame('Yes, exactly 1.27 again');
export const EV_SPARK_PREDICT_NO = blSame('No — a different sample would give a somewhat different number');

export const EV_FORMALISM_WORKED = bl(
  'Worked example: validation squared errors [1, 9, 4, 1, 25] give mean MSE=8. Their own spread (variance of these five numbers) is large relative to the mean — a coefficient of variation of roughly 1.1 — so the illustrative margin this panel shows is wide, reflecting that one big miss (25) makes this MSE estimate genuinely less stable than five evenly-sized errors would.',
  'margin ≈ value × min(0.4, 0.5×CV), CV = std(squared errors)/mean(squared errors) — a simplified stand-in for a bootstrap confidence interval; the exact multiplier is illustrative, but the underlying relationship (more variable errors → less trustworthy point estimate) is real.'
);
export const EV_FORMALISM_FADED = bl(
  'Validation squared errors [4, 5, 4, 5, 4] (very consistent) vs. [1, 1, 1, 1, 21] (one big outlier) both average to MSE=4.4-ish. Step 1 — which set has higher variance? Step 2 — which set\'s MSE estimate should get a wider illustrative margin, and why: _____.',
  'Validation squared errors [4, 5, 4, 5, 4] (very consistent) vs. [1, 1, 1, 1, 21] (one big outlier) both average to MSE=4.4-ish. Step 1 — which set has higher variance? Step 2 — which set\'s MSE estimate should get a wider illustrative margin, and why: _____.'
);
export const EV_MECHANISM_NOTE = blSame(
  'You already ran this mechanism — every metric above now carries its own ± margin instead of a bare number, and the drift chart below reacts live as you scrub through time. Scroll back through the panels above and compare a metric with a wide margin against one with a narrow one.'
);
export const EV_CF_ANALOGY_BREAK = blSame(
  "The weather-forecast analogy breaks down on stakes: a wrong temperature forecast is mildly inconvenient. A wrong gold-price point estimate presented as certain, acted on as if certain, can drive a real financial decision — the cost of hiding the margin scales with what's riding on the number."
);
export const EV_CF_CAVEAT = blSame(
  'A real caveat: a wide margin is itself useful information, not just an inconvenience — it tells you this particular metric or forecast is genuinely less trustworthy right now, which is exactly the signal a bare point number destroys.'
);
export const EV_CF_RETRIEVAL_Q = blSame(
  'Without looking back: why does a metric computed from a SMALLER validation set generally deserve a WIDER uncertainty margin than the same metric from a larger one?'
);
export const EV_CF_RETRIEVAL_A = blSame(
  "A smaller sample gives any summary statistic (mean, MAE, RMSE...) less evidence to average over, so a single unusual point has a proportionally bigger say in the result — the same logic behind why a standard error shrinks as sample size n grows (it typically scales with 1/√n)."
);

// Concept-drift demo (Constructive Thought Loop on this driver slider, D.2)
// + explicit "Continuous Learning" refutation, in the mission's own words.
export const EV_DRIFT_PREDICT_Q = blSame(
  'Drag time forward past the "regime change" line without ever pressing a retrain button. What happens to the model\'s error?'
);
export const EV_DRIFT_PREDICT_ADAPTS = blSame(
  'It gradually adapts on its own and the error settles back down'
);
export const EV_DRIFT_PREDICT_SPIKES = blSame(
  'It has no way to adapt — the error spikes and stays high until someone retrains it'
);
export const EV_CONTINUOUS_LEARNING_NOTE = blSame(
  "The model did not get worse because it kept learning the wrong thing — it got worse because it stopped learning entirely the moment training ended, while the world kept changing underneath it. Nothing in this chart is adapting in real time; the line only moves because you're scrubbing through pre-computed history against one model that was frozen at t=0."
);
