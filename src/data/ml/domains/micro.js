import { bl, blSame } from '../../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §6.3. The reference price/
// quantity/elasticity are illustrative (no specific real product or
// reported elasticity value is cited in the doc for this section, unlike
// Gold's §6.1 figures) — see src/features/ml/micro/demandModel.js for the
// mechanisms these numbers exist to demonstrate.
export const MICRO_CONTEXT = bl(
  "Cut a product's price and you'll usually sell more of it — but by how much, exactly? The classic answer assumes a smooth, constant relationship. Real demand is messier: promotions, seasonality, and psychological price points ($14.99 vs $15.00) all bend the curve in ways the classic model can't see.",
  'Classic log-log regression estimates a single constant elasticity coefficient, implicitly assuming a smooth power-law relationship between price and quantity everywhere. ML models (gradient boosting, deep feed-forward nets) incorporate promotions, seasonality, and nonlinear/non-monotonic effects the econometric baseline assumes away.'
);

export const MICRO_MODELS = [
  {
    key: 'econLogLog', name: blSame('Log-Log Regression (constant elasticity)'),
    color: '#8b5cf6',
    note: bl(
      'The textbook model — assumes the same % relationship between price and demand everywhere. Clean and interpretable, but blind to promotions, seasonality, and psychological price points.',
      'Fits a single constant elasticity coefficient across the entire price range; the fitted curve is a smooth, unbroken power law by construction — mathematically incapable of representing a threshold effect or a covariate it was never given.'
    ),
  },
  {
    key: 'gradientBoost', name: blSame('Gradient Boosting'),
    color: '#22d3ee',
    note: bl(
      'Learns whatever shape the data actually shows — including demand ceilings, price-point cliffs, and how much a promotion really moves the needle.',
      'Split-based thresholding captures the charm-pricing step and saturation ceiling directly from data structure; promotion/seasonality enter as ordinary features, so their effect is learned rather than assumed away. Leading approach for markdown optimization and demand forecasting in retail.'
    ),
  },
];

export const MICRO_GAP_LABELS = {
  saturation: { label: blSame('Demand ceiling (market saturates)') },
  charmThreshold: { label: blSame('Psychological price point ($15.00)') },
  promo: { label: blSame('Promotion active') },
  season: { label: blSame('Peak season') },
};

export const MICRO_SCENARIOS = [
  {
    id: 'below-charm', label: blSame('Just below the charm threshold'),
    state: { price: 14.99, promoOn: 0, peakSeason: 0 },
  },
  {
    id: 'above-charm', label: blSame('Just above the charm threshold'),
    state: { price: 15.49, promoOn: 0, peakSeason: 0 },
  },
  {
    id: 'discount-promo', label: blSame('Deep discount + promo blitz'),
    state: { price: 9.99, promoOn: 1, peakSeason: 0 },
  },
  {
    id: 'peak-premium', label: blSame('Peak season, premium price'),
    state: { price: 18.99, promoOn: 0, peakSeason: 1 },
  },
];

export const MICRO_TRACE_INTRO = bl(
  'This is why the two curves disagree at the current price — each row is one mechanism the gradient-boosted model captures that log-log regression structurally cannot.',
  'Additive decomposition of the ML curve\'s construction (saturation cap → charm-price step → promotion → seasonality), in units relative to the log-log baseline at the same price.'
);

export const MICRO_PRICE_LABEL = blSame('Price');
export const MICRO_PROMO_LABEL = blSame('Promotion active');
export const MICRO_SEASON_LABEL = blSame('Peak season');

// Module 11 audit (see gold.js's identical note).
export const MICRO_PAGE_TITLE = blSame('Micro Economics Lab — Price Elasticity');
export const MICRO_PRICE_SECTION_TITLE = blSame('Set the price');
export const MICRO_MODELS_TITLE = blSame('Two models, one price axis');
export const MICRO_MODELS_SUB = blSame(
  'The dashed line assumes one constant % relationship everywhere. The solid line learns whatever shape the data actually has.'
);
export const MICRO_TRACE_TITLE = blSame('Why do the curves disagree here?');

// Found during the same verification pass as the note above: DemandCurveChart's
// own SVG y-axis title, missed by the file-by-file audit since it's a bespoke
// chart component's internal text, not page chrome.
export const MICRO_UNITS_LABEL = blSame('units/week');

// Learning Design System retrofit (Module 8): the mission's "predict-the-
// curve-shape" exercise gates the chart section itself (not the price
// slider) since the shape is what's being predicted, not the price choice.
// The worked example is computed from the real demandModel.js functions at
// $14.99 vs $15.49 (the page's own below/above-charm scenario presets) —
// independently re-derivable by applying those two presets and reading the
// trace panel.
export const MICRO_PREDICT_Q = blSame(
  'Before you look at the chart below: will the gradient-boosting model\'s demand curve be one smooth line like the econometric model, or will it show a visible kink somewhere?'
);
export const MICRO_PREDICT_SMOOTH = blSame(
  'One smooth line, just like the econometric model'
);
export const MICRO_PREDICT_KINK = blSame(
  "A visible kink — real-world demand isn't perfectly smooth"
);
export const MICRO_PREDICT_EXPLAIN = blSame(
  'Try the "Just below the charm threshold" and "Just above" scenario presets back to back and watch the solid ML line specifically — it steps down right at $15.00 while the dashed econometric line just keeps gliding smoothly through the same point.'
);

export const MICRO_SPARK_ANALOGY = blSame(
  "A thermometer reads temperature smoothly, degree by degree — but a light switch doesn't dim gradually, it's off, then suddenly on. Some real-world relationships are thermometers; others are light switches. The question is never which model is fancier, it's which shape actually matches the thing you're modeling."
);

export const MICRO_MECHANISM_NOTE = blSame(
  "You already ran this mechanism above — every price you set and every toggle you flip redraws both curves live from the same demand math. Scrub price across $15.00 slowly and watch only the solid ML line react."
);

export const MICRO_FORMALISM_WORKED = bl(
  'Worked example: at $14.99 (the reference price), both models agree exactly — 500 units. Move to $15.49 (the "above-charm" preset): the smooth elasticity decline alone would put log-log at ≈471 units, but crossing $15.00 triggers the ML model\'s extra 12% step-down, landing it at ≈415 units — a real ≈56-unit gap that exists ONLY because of the threshold, on top of the elasticity drop both models already agree on.',
  'Worked example: at $14.99 (the reference price), both models agree exactly — 500 units. Move to $15.49 (the "above-charm" preset): the smooth elasticity decline alone would put log-log at ≈471 units, but crossing $15.00 triggers the ML model\'s extra 12% step-down, landing it at ≈415 units — a real ≈56-unit gap that exists ONLY because of the threshold, on top of the elasticity drop both models already agree on.'
);
export const MICRO_FORMALISM_FADED = blSame(
  'Now you try: apply the "Deep discount + promo blitz" preset ($9.99, promo on). Step 1 — at a price this far below the charm threshold, does the step-down effect apply at all? Step 2 — which single toggle do you expect to produce the biggest gap between the two curves at this price, and why: _____. Check the trace panel to confirm.'
);

export const MICRO_CF_ANALOGY_BREAK = blSame(
  "The thermometer/light-switch analogy breaks down on certainty: a real light switch either is or isn't wired to a specific voltage, no ambiguity. A $15.00 psychological threshold is a genuine pattern in real purchase data, but it's a soft behavioral regularity, not a law of physics — the exact threshold, and whether it holds at all, can shift by product, market, and time period in ways a light switch never does."
);
export const MICRO_CF_CAVEAT = blSame(
  'A real caveat: a model flexible enough to fit a real kink is also flexible enough to fit a fake one — a small, noisy dataset can show what looks exactly like a charm-price step at some price point purely by chance. The gradient-boosting model here is shown a threshold that genuinely exists in this synthetic data by construction; on messy real data, confirming a kink is real (not noise) takes more evidence than one convincing-looking chart.'
);
export const MICRO_CF_RETRIEVAL_Q = blSame(
  'Without looking back: why can\'t the log-log regression model ever represent the $15.00 step, no matter how much data you give it?'
);
export const MICRO_CF_RETRIEVAL_A = blSame(
  "It's not a data problem, it's a structural one: log-log regression is built to fit a single smooth power-law curve by construction, so no amount of additional data can make it draw a discontinuous jump — the model family itself doesn't contain that shape. Only a model flexible enough to represent thresholds (like the gradient-boosted tree here) can ever capture one, regardless of how much data either model sees."
);
