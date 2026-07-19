import './ProbabilityGauge.css';

// Lightweight CSS meter, not a chart — matches CompassMeter's "compact bar,
// not a heavy chart" precedent from Module 3. The credible-interval band's
// width is the whole point of this module (it should visibly narrow as the
// days-until-election slider approaches 0), so it's drawn as a shaded
// region around the point estimate rather than reduced to a single number.
export default function ProbabilityGauge({ winProbability, credibleWidth, incumbentLabel, challengerLabel }) {
  const lo = Math.max(0, winProbability - credibleWidth);
  const hi = Math.min(100, winProbability + credibleWidth);

  return (
    <div className="pgauge">
      <div className="pgauge-track">
        <div className="pgauge-band" style={{ left: `${lo}%`, width: `${hi - lo}%` }} />
        <div className="pgauge-midline" />
        <div className="pgauge-marker" style={{ left: `${winProbability}%` }} />
      </div>
      <div className="pgauge-labels">
        <span>{challengerLabel}</span>
        <span className="pgauge-readout">{winProbability.toFixed(0)}% ± {credibleWidth.toFixed(0)}pts</span>
        <span>{incumbentLabel}</span>
      </div>
      <p className="pgauge-interval">Credible interval: {lo.toFixed(0)}%–{hi.toFixed(0)}%</p>
    </div>
  );
}
