// Micro (Module 8) demand math. Two models over the same continuous price
// axis rather than N discrete drivers → one output (Gold/Macro's shape) —
// see ML-Research-Reference.md §6.3: "ML-based price elasticity models
// outperform classic log-log regression by incorporating promotions,
// seasonality, and nonlinear/non-monotonic price-demand relationships that
// traditional econometrics assumes away." Every adjustment below that the
// econometric model *doesn't* get is deliberate — it demonstrates the
// doc's claim rather than asserting it. Reference price/quantity/elasticity
// are illustrative (no real product this maps to); the *mechanisms*
// (saturation, charm-price step, promotion/seasonality blindness) are the
// real, doc-cited teaching content.
export const MICRO_REFERENCE = {
  referencePrice: 14.99,
  referenceQuantity: 500,
  elasticity: 1.8,
  saturationCap: 900,
  charmThreshold: 15.0,
  stepDrop: 0.12,
  promoBoost: 0.3,
  seasonBoost: 0.2,
  priceMin: 8,
  priceMax: 22,
};

// The textbook model: one constant elasticity coefficient, smooth power
// law, no awareness of promotion/season/threshold — by construction, not
// by omission, which is exactly the doc's point.
export function logLogQuantity(price, ref = MICRO_REFERENCE) {
  return ref.referenceQuantity * (price / ref.referencePrice) ** -ref.elasticity;
}

// The ML model: same underlying curve, but capped at a realistic market
// size (real demand can't grow unboundedly as price→0, unlike a pure power
// law), with a charm-pricing step and promotion/seasonality it actually
// reacts to.
export function mlQuantity(price, promoOn, peakSeason, ref = MICRO_REFERENCE) {
  let q = Math.min(logLogQuantity(price, ref), ref.saturationCap);
  if (price >= ref.charmThreshold) q *= 1 - ref.stepDrop;
  if (promoOn) q *= 1 + ref.promoBoost;
  if (peakSeason) q *= 1 + ref.seasonBoost;
  return q;
}

// Decomposes the ML curve's construction step by step so the trace panel
// can show *why* it diverges from log-log at the current price/toggles —
// each step's effect in units, additive, matching driverContributions()'s
// {key, contribution} shape so it can reuse the same TracePanel component.
export function demandGapContributions(price, promoOn, peakSeason, ref = MICRO_REFERENCE) {
  const base = logLogQuantity(price, ref);
  const afterSaturation = Math.min(base, ref.saturationCap);
  const saturationEffect = afterSaturation - base;

  let running = afterSaturation;
  const thresholdEffect = price >= ref.charmThreshold ? running * -ref.stepDrop : 0;
  running += thresholdEffect;

  const promoEffect = promoOn ? running * ref.promoBoost : 0;
  running += promoEffect;

  const seasonEffect = peakSeason ? running * ref.seasonBoost : 0;

  return [
    { key: 'saturation', contribution: saturationEffect },
    { key: 'charmThreshold', contribution: thresholdEffect },
    { key: 'promo', contribution: promoEffect },
    { key: 'season', contribution: seasonEffect },
  ].filter((c) => Math.abs(c.contribution) > 1e-6);
}
