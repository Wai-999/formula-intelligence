import { blSame } from '../../lib/mlContent.js';

// Interleaved cross-domain check questions (docs/research/ML-Mode-Pedagogy-Research.md
// §1 "Desirable Difficulties — Interleaving"), surfaced once a learner has
// visited 2+ of Gold/Macro/Micro/Politics (D.4). Each question genuinely
// requires reasoning across two domains' actual mechanics — not two
// unrelated facts glued together — grounded in each lab's real driver
// coefficients and model comparisons.
export const MIXED_REVIEW_QUESTIONS = [
  {
    id: 'gold-politics-1',
    domains: ['gold', 'politics'],
    question: blSame(
      'Real yields just rose 0.5 points AND a geopolitical shock just hit (+1.5 on the risk driver). Which effect dominates gold\'s move?'
    ),
    options: [
      blSame('Real yields — the price falls overall'),
      blSame('The geopolitical shock — the price rises overall'),
      blSame('They cancel out exactly, no net move'),
    ],
    correctIndex: 1,
    explanation: blSame(
      "Gold's real yields coefficient is -180/unit and geoRisk is +110/unit: 0.5×(-180) = -90 from yields, but 1.5×110 = +165 from the shock. The shock wins, net roughly +75. Two real, opposite-signed drivers moving at once is exactly what the trace panel in Module 6 is built to untangle."
    ),
  },
  {
    id: 'macro-micro-1',
    domains: ['macro', 'micro'],
    question: blSame(
      "Random Forest is the most accurate choice for GDP nowcasting in Module 7. Is it also the right default for Micro's price-elasticity problem in Module 8?"
    ),
    options: [
      blSame('Yes — Random Forest wins at every forecasting task'),
      blSame('Not necessarily — Module 8 highlights Gradient Boosting specifically, for a different reason (capturing promotions/thresholds, not averaging noisy signals)'),
      blSame('No — no model comparison applies to price elasticity at all'),
    ],
    correctIndex: 1,
    explanation: blSame(
      "\"Best model\" is task-dependent, not universal. Random Forest's strength in Module 7 is averaging many noisy macro signals into a stable nowcast. Micro's gradient boosting instead earns its place by capturing a specific structural feature — a genuine price-point discontinuity — that a smooth model would blur. Same family of tools, different jobs."
    ),
  },
  {
    id: 'gold-macro-1',
    domains: ['gold', 'macro'],
    question: blSame(
      "Both Gold and Macro have a \"simplicity can win\" teaching moment — Macro's LASSO beating fancier models. Does Gold's lineup have an equally simple model that's ever the single best performer?"
    ),
    options: [
      blSame('Yes — ARIMA can outperform LSTM/XGBoost when the relationship is stable and roughly linear'),
      blSame('No — the research doc always favors the most complex model for Gold'),
      blSame('No — model complexity has no bearing on Gold forecasts'),
    ],
    correctIndex: 0,
    explanation: blSame(
      'ML-Research-Reference.md §3.6 states ARIMA/SARIMA is "often lowest error on stable/linear series." The lesson generalizes across every domain in this app, not just Macro: match model complexity to how nonlinear the real relationship actually is, don\'t default to the fanciest available option.'
    ),
  },
  {
    id: 'politics-gold-2',
    domains: ['politics', 'gold'],
    question: blSame(
      "Politics' geo-risk score is built partly from NLP sentiment on news text. If that news coverage over-reports conflict in one region, what happens when that skewed score feeds Gold's geoRisk driver?"
    ),
    options: [
      blSame("Nothing — Gold's math is independent of how the score was built"),
      blSame("The bias flows straight through — Gold's model can't tell a skewed score from an accurate one, it just reacts to the number it's given"),
      blSame('Gold automatically corrects for any known bias upstream'),
    ],
    correctIndex: 1,
    explanation: blSame(
      "This is the \"less biased than humans\" misconception (Module 9) made concrete across two domains at once: a number doesn't stop carrying a human choice just because it's now an input to a second model's arithmetic. Whatever skew went into the score arrives, unflagged, in Gold's forecast."
    ),
  },
  {
    id: 'micro-macro-1',
    domains: ['micro', 'macro'],
    question: blSame(
      "Micro's log-log regression assumes one constant % elasticity everywhere. Macro's LASSO is also a linear model. Does LASSO have the exact same blind spot as Micro's log-log baseline?"
    ),
    options: [
      blSame('Yes — any linear model shares that exact weakness'),
      blSame("Not necessarily — LASSO's inputs can already be engineered nonlinear features (lags, thresholds), so \"linear in the coefficients\" isn't the same as \"linear in the original signal\", unlike log-log's single smooth curve by construction"),
      blSame('No — LASSO has no structural weaknesses at all'),
    ],
    correctIndex: 1,
    explanation: blSame(
      "This is a genuinely researcher-level distinction: a model can be \"linear\" in how it combines its inputs while still capturing nonlinear real-world behavior, if those inputs were themselves engineered to encode the nonlinearity. Log-log's constraint is structural (baked into its one continuous power-law curve); LASSO's isn't, if its feature set is rich enough."
    ),
  },
  {
    id: 'politics-micro-1',
    domains: ['politics', 'micro'],
    question: blSame(
      "Politics' election model narrows its credible interval as days-until-election shrinks — more data, less uncertainty. Micro's demand curve doesn't narrow anything as you adjust price. Why not?"
    ),
    options: [
      blSame("Micro's models are simply better and don't need uncertainty bands"),
      blSame('Different mechanism entirely: election uncertainty shrinks because more real polling data literally arrives over time; moving Micro\'s price slider explores a fixed, already-fitted curve — it doesn\'t generate any new data'),
      blSame('Micro should also narrow an interval and this is a gap in the lab'),
    ],
    correctIndex: 1,
    explanation: blSame(
      "Confusing these two is exactly the kind of gap interleaving is meant to surface: \"the model updates as new information arrives\" (Politics, genuinely true) versus \"exploring an already-fitted model's predictions across its input range\" (Micro's slider, and most of this app's sliders) are different activities that happen to both involve a control moving."
    ),
  },
];
