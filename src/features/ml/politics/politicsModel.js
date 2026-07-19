// Module 9 math. Two independent mechanisms per ML-Research-Reference.md
// §6.4: a hierarchical-Bayesian-style election estimate whose credible
// interval narrows as election day approaches, and a composite
// geopolitical risk index that maps directly onto Gold's geoRisk driver
// (§6.4: "...used to predict conflict, investment shifts, and — per the
// gold research above — asset prices"). All weights/scales are
// illustrative; the *mechanisms* (fundamentals-vs-polls reweighting over
// time, sqrt-shaped uncertainty decay, a blended risk score) are the real
// teaching content.

export const ELECTION_REFERENCE = {
  maxDays: 180,
  minCredibleWidth: 3, // percentage points, right at election day
  maxCredibleWidth: 22, // percentage points, at maxDays out
  logisticK: 0.95,
};

// Hierarchical models lean on the structural ("fundamentals") prior when
// data is scarce far from the election, and shift toward the polls as they
// accumulate — this is real practice (The Economist's and similar models),
// not decorative.
export function pollsWeight(daysUntilElection, maxDays = ELECTION_REFERENCE.maxDays) {
  const clamped = Math.min(Math.max(daysUntilElection, 0), maxDays);
  return 1 - clamped / maxDays;
}

export function computeElection(fundamentalsLean, pollsLean, daysUntilElection, ref = ELECTION_REFERENCE) {
  const pw = pollsWeight(daysUntilElection, ref.maxDays);
  const fw = 1 - pw;
  const combinedLean = fundamentalsLean * fw + pollsLean * pw;
  const winProbability = 100 / (1 + Math.exp(-ref.logisticK * combinedLean));
  const t = Math.sqrt(Math.min(Math.max(daysUntilElection, 0), ref.maxDays) / ref.maxDays);
  const credibleWidth = ref.minCredibleWidth + (ref.maxCredibleWidth - ref.minCredibleWidth) * t;
  return { winProbability, credibleWidth, pollsWeight: pw, fundamentalsWeight: fw };
}

// Keys must match ELECTION_DRIVERS' own keys exactly (fundamentalsLean/
// pollsLean, not shortened) — TracePanel looks each contribution's key up
// directly in driversByKey, and a mismatch here throws inside <TraceRow>
// with no error boundary anywhere in the app to catch it.
export function electionContributions(fundamentalsLean, pollsLean, daysUntilElection, ref = ELECTION_REFERENCE) {
  const { pollsWeight: pw, fundamentalsWeight: fw } = computeElection(fundamentalsLean, pollsLean, daysUntilElection, ref);
  return [
    { key: 'fundamentalsLean', contribution: fundamentalsLean * fw },
    { key: 'pollsLean', contribution: pollsLean * pw },
  ].filter((c) => Math.abs(c.contribution) > 1e-6);
}

export const GEO_REFERENCE = {
  baseline: 50,
  militaryWeight: 15,
  diplomaticWeight: 12,
  sanctionsWeight: 10,
};

export function computeGeoRisk(military, diplomatic, sanctions, ref = GEO_REFERENCE) {
  const raw = ref.baseline + military * ref.militaryWeight + diplomatic * ref.diplomaticWeight + sanctions * ref.sanctionsWeight;
  return Math.min(100, Math.max(0, raw));
}

// Maps the 0-100 risk score onto Gold's geoRisk driver's -2..2 range, so
// the cross-link hands over a value the DriverPanel slider there can use
// directly (see src/data/ml/domains/gold.js's geoRisk driver).
export function geoRiskToGoldZ(riskScore, ref = GEO_REFERENCE) {
  return (riskScore - ref.baseline) / 25;
}
