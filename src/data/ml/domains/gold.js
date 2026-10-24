import { bl, blSame } from '../../../lib/mlContent.js';

// Source: docs/research/ML-Research-Reference.md §6.1. Current spot price
// and 2026 bank-forecast range are the doc's real cited figures; the
// driver→price sensitivity coefficients below are illustrative (Section
// C.4) — calibrated so each driver's *direction* matches the doc exactly,
// magnitudes are for teaching the shape of the relationship, not a real
// trading model.
export const GOLD_BASE_PRICE = 4015; // midpoint of the doc's $4,000-$4,030 current range
export const GOLD_BASE_BAND = 90;

export const GOLD_CONTEXT = bl(
  'Gold trades around $4,000–$4,030/oz right now. Big banks think it could reach $4,800–$6,500/oz sometime in 2026 — but "could reach" depends entirely on which of these five forces wins out.',
  'Current spot: ~$4,000–$4,030/oz. 2026 bank targets range $4,800–$6,500/oz (Goldman Sachs ≈$5,800, JPMorgan ≈$5,500, UBS $6,000+). The five drivers below are the literature\'s consensus feature set.'
);

export const GOLD_DRIVERS = [
  {
    key: 'realYields', coefficient: -180,
    label: blSame('Real yields'),
    relation: bl('Higher real yields → gold falls', 'Inverse — the single most-cited driver'),
  },
  {
    key: 'dxy', coefficient: -150,
    label: blSame('US Dollar Index (DXY)'),
    relation: bl('Stronger dollar → gold falls (priced in USD globally)', 'Inverse — gold priced in USD globally'),
  },
  {
    key: 'inflationFedPath', coefficient: 130,
    label: blSame('Inflation / Fed dovishness'),
    relation: bl('More rate-cut expectation → gold rises', 'Positive — rate-cut expectations are a major 2026 tailwind narrative'),
  },
  {
    key: 'geoRisk', coefficient: 110, volDriver: true,
    label: blSame('Geopolitical risk'),
    relation: bl('More conflict/tension → gold rises (safe haven)', 'Positive — one study found ~19% prediction-accuracy improvement from this feature'),
  },
  {
    key: 'cbDemand', coefficient: 90,
    label: blSame('Central bank demand'),
    relation: bl('Heavier central-bank buying → gold rises', 'Positive — structural buyer since 2021 (~225 tons/quarter 2021-2025), though flows can reverse sharply'),
  },
];

export const GOLD_MODELS = [
  { key: 'econometric', name: blSame('ARIMA'), color: '#8b5cf6', note: bl('Stable, explainable — but slow to adapt when a driver moves a lot at once.', 'Damped linear response; band widens disproportionately once any driver exceeds ~1 SD, reflecting known weakness with structural breaks.') },
  { key: 'deepLearning', name: blSame('LSTM'), color: '#a78bfa', note: bl('Best at spotting complex combinations — when several drivers point the same way, LSTM reacts more than the others.', 'Full linear response amplified when drivers align in the same direction, reflecting its documented strength at complex nonlinear + multivariate patterns.') },
  { key: 'treeEnsemble', name: blSame('XGBoost'), color: '#22d3ee', note: bl('A strong, well-balanced all-rounder — reacts to every driver but each driver\'s effect saturates instead of growing without limit.', 'Saturating (tanh) response per driver, reflecting split-based thresholding; frequently the top performer with SHAP explainability in the literature.') },
  { key: 'volatility', name: blSame('GARCH (volatility overlay)'), color: '#fbbf24', note: bl('Doesn\'t move the center forecast much on its own — its real job is widening or narrowing the uncertainty band, especially around geopolitical risk.', 'Point forecast tracks the econometric lens; band width instead responds to driver magnitude and geopolitical risk specifically, reflecting GARCH\'s purpose (modeling variance, not the mean).') },
];

export const GOLD_SCENARIOS = [
  {
    id: 'fed-cuts', label: blSame('Fed accelerates rate cuts'),
    state: { realYields: -1.0, dxy: -0.3, inflationFedPath: 1.6, geoRisk: 0, cbDemand: 0 },
  },
  {
    id: 'dollar-strength', label: blSame('Dollar strengthens sharply'),
    state: { realYields: 0.5, dxy: 1.8, inflationFedPath: -0.3, geoRisk: 0, cbDemand: 0 },
  },
  {
    id: 'geo-shock', label: blSame('Geopolitical shock'),
    state: { realYields: -0.2, dxy: 0.2, inflationFedPath: 0, geoRisk: 1.8, cbDemand: 0.5 },
  },
  {
    id: 'cb-buying', label: blSame('Central banks resume heavy buying'),
    state: { realYields: 0, dxy: -0.2, inflationFedPath: 0, geoRisk: 0.3, cbDemand: 1.8 },
  },
];

export const GOLD_TRACE_INTRO = bl(
  'Move any driver above, then check this panel — it shows exactly which driver pushed the forecast, in which direction, and by roughly how much.',
  'Per-driver dollar contribution to the linear-response baseline, sorted by magnitude — the same decomposition idea as Module 5\'s LIME panel, applied live.'
);

// Module 9's Politics lab computes a composite geopolitical risk score and
// can send it here to set the geoRisk driver directly (navigateToLinkedConcept
// → GoldLabPage's linkedConcept consumer). This is the banner shown when
// that just happened.
export const GOLD_LINK_BANNER = blSame(
  "Geopolitical risk was just set from the Politics lab's risk index."
);

// Module 11 audit: section titles were hardcoded English in GoldLabPage.jsx
// (missed during Module 6 — every module built since repeated the same
// gap, see BUILD_LOG.md Module 11). Titles don't fork by depth level, only
// language, hence blSame().
export const GOLD_PAGE_TITLE = blSame('Gold Price Forecasting Lab');
export const GOLD_DRIVERS_TITLE = blSame('Drivers');
export const GOLD_MODELS_TITLE = blSame('Four models, one set of drivers');
export const GOLD_TRACE_TITLE = blSame('Why did this move?');
export const GOLD_MODELS_SUB = blSame(
  'Move a driver above and watch all four react — differently.'
);

// Learning Design System retrofit (Module 6): Constructive Thought Loop on
// the driver panel + one consolidated Depth Ladder whose Critical Frontier
// is the mission's assigned "bank-forecast-spread disagreement" teaching
// moment. The worked example's numbers are computed from the exact same
// computeModelForecasts() formulas the chart above uses (geoRisk=1.0, all
// other drivers 0) — not fabricated, independently re-derivable by anyone
// who pushes that same slider and reads the trace panel.
export const GOLD_PREDICT_Q = blSame(
  'Push geopolitical risk to its maximum, everything else at zero. Do the four models\' point forecasts move by the same dollar amount, or different amounts?'
);
export const GOLD_PREDICT_SAME = blSame(
  'The same amount — they all see the same drivers'
);
export const GOLD_PREDICT_DIFFERENT = blSame(
  'Different amounts — each model weighs the same evidence differently'
);
export const GOLD_PREDICT_EXPLAIN = blSame(
  'Check the forecast chart and trace panel after pushing geopolitical risk — ARIMA and GARCH share a point forecast but GARCH\'s band is far wider, while LSTM and XGBoost land at different dollar figures entirely. Same evidence, four different reactions.'
);

export const GOLD_SPARK_ANALOGY = blSame(
  "Ask five weather forecasters for tomorrow's high temperature and you'll get five slightly different numbers — not because someone's wrong, but because each reads slightly different evidence and weighs it differently. Ask five investment banks where gold will be next year and the same thing happens, just with far higher stakes."
);

export const GOLD_MECHANISM_NOTE = blSame(
  "You already ran this mechanism above — every push of a driver slider re-computes all four models' forecasts live from the same driver state. Push geopolitical risk toward its extreme and watch the forecast band chart and trace panel react in real time."
);

export const GOLD_FORMALISM_WORKED = bl(
  "Worked example: push geoRisk to 1.0 (its coefficient is +110), everything else at 0. Linear baseline move = +$110. ARIMA (0.7× damping) lands at +$77; LSTM (full response, only one driver active so no amplification yet) also lands at +$110; XGBoost's tanh saturation gives +$88; GARCH shares ARIMA's +$77 point but its band balloons to $153 (vs ARIMA's unchanged $90) because geopolitical risk is specifically the variable GARCH's band responds to. Four different numbers from one identical push.",
  "Worked example: push geoRisk to 1.0 (its coefficient is +110), everything else at 0. Linear baseline move = +$110. ARIMA (0.7× damping) lands at +$77; LSTM (full response, only one driver active so no amplification yet) also lands at +$110; XGBoost's tanh saturation gives +$88; GARCH shares ARIMA's +$77 point but its band balloons to $153 (vs ARIMA's unchanged $90) because geopolitical risk is specifically the variable GARCH's band responds to. Four different numbers from one identical push."
);
export const GOLD_FORMALISM_FADED = blSame(
  'Now you try: set every driver to 0 except real yields at −1.0 (its coefficient is −180). Step 1 — what\'s the linear baseline move (coefficient × driver value)? Step 2 — which of the four models do you expect to land furthest from that baseline this time, and why: _____. Check your answer against the trace panel and forecast chart above.'
);

export const GOLD_CF_ANALOGY_BREAK = blSame(
  "The weather-forecaster analogy breaks down on accountability: a weather forecaster is graded again tomorrow, every single day, so bad judgment gets corrected fast. A 2026 gold price forecast won't be checked for months — leaving far more room for a bank's own trading position, marketing incentive, or institutional house-view to quietly shape a number before reality ever grades it."
);
export const GOLD_CF_CAVEAT = blSame(
  'A real caveat: this page\'s own context noted Goldman Sachs (~$5,800), JPMorgan (~$5,500), and UBS ($6,000+) — three serious institutions, over $1,200 apart, looking at broadly the same evidence. That real spread is the same phenomenon this page\'s four toy model-lenses illustrate when they react differently to one identical driver push — a wide spread is not proof someone is incompetent, it is a signal of how much genuine uncertainty the evidence actually contains.'
);
export const GOLD_CF_RETRIEVAL_Q = blSame(
  'If two reputable banks publish gold forecasts $1,000+ apart, does that necessarily mean one of them made a mistake?'
);
export const GOLD_CF_RETRIEVAL_A = blSame(
  "No — it more likely means they're weighting the same uncertain evidence differently (how much of a rate-cut path to assume, how much further central-bank buying to project forward), the same way this page's four model lenses reacted differently to one identical driver push. A large forecast spread is genuine, informative signal about how much real uncertainty the underlying evidence contains — not proof that someone made an error."
);
