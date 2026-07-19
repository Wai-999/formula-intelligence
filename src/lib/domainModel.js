// Generic driver → multi-model forecast math, shared by every domain lab
// (Gold/Macro/Micro/Politics, Modules 6-9) so each domain module is content
// (drivers, coefficients, scenario presets) rather than new mechanics — see
// docs/ML_MODE_README.md for the "add a 13th domain" template this exists
// to support.
//
// Each domain defines a base value, a set of drivers with a signed
// coefficient (dollars/points per unit driver deviation, e.g. a rough
// z-score), and lets four model "lenses" react to the identical driver
// state differently, matching the qualitative comparative findings in
// ML-Research-Reference.md §3 (each lens's math is a deliberately simple
// stand-in for the real algorithm's known behavior, not a real fit):
//   - econometric (ARIMA-like): damped linear response; disproportionately
//     wider uncertainty once any driver is large (struggles with structural
//     breaks/large moves).
//   - deepLearning (LSTM-like): full linear response amplified when drivers
//     align in the same direction (captures compounding nonlinear patterns).
//   - treeEnsemble (XGBoost-like): linear response with saturation at
//     extremes (tanh), reflecting split-based thresholding.
//   - volatility (GARCH-like): same point forecast as the econometric lens,
//     but its band width — not its center — is what responds to driver
//     magnitude, reflecting that GARCH models variance, not the mean.

export function computeDriverDelta(drivers, driverState) {
  return drivers.reduce((sum, d) => sum + d.coefficient * (driverState[d.key] ?? 0), 0);
}

export function computeModelForecasts(baseValue, drivers, driverState, baseBandWidth) {
  const linearDelta = computeDriverDelta(drivers, driverState);
  const totalMagnitude = drivers.reduce((sum, d) => sum + Math.abs(driverState[d.key] ?? 0), 0);
  const maxAbsDriver = Math.max(0, ...drivers.map((d) => Math.abs(driverState[d.key] ?? 0)));

  const econDelta = linearDelta * 0.7;
  const econBand = baseBandWidth * (1 + Math.max(0, maxAbsDriver - 1) * 0.9);

  const sameSignCount = drivers.filter((d) => {
    const contrib = d.coefficient * (driverState[d.key] ?? 0);
    return contrib !== 0 && Math.sign(contrib) === Math.sign(linearDelta || 1);
  }).length;
  const dlDelta = linearDelta * (1 + 0.12 * Math.max(0, sameSignCount - 1));
  const dlBand = baseBandWidth * 1.35;

  const treeDelta = drivers.reduce((sum, d) => sum + d.coefficient * Math.tanh((driverState[d.key] ?? 0) * 0.9) / 0.9, 0);
  const treeBand = baseBandWidth * 1.1;

  const volDelta = econDelta;
  const geoDriver = drivers.find((d) => d.volDriver);
  const geoZ = geoDriver ? Math.abs(driverState[geoDriver.key] ?? 0) : 0;
  const volBand = baseBandWidth * (1 + 0.55 * geoZ + 0.15 * totalMagnitude);

  return {
    econometric: { delta: econDelta, band: econBand },
    deepLearning: { delta: dlDelta, band: dlBand },
    treeEnsemble: { delta: treeDelta, band: treeBand },
    volatility: { delta: volDelta, band: volBand },
    linearDelta,
  };
}

// Per-driver dollar contribution for the trace ("why did this move?") panel.
export function driverContributions(drivers, driverState) {
  return drivers
    .map((d) => ({ key: d.key, contribution: d.coefficient * (driverState[d.key] ?? 0) }))
    .filter((c) => Math.abs(c.contribution) > 1e-6)
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
}
