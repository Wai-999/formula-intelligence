// Point forecast + interval — the concrete visual for the Prediction column.
export default function PredictionIntervalDemo() {
  const point = 4180;
  const margin = 150;
  const lo = point - margin;
  const hi = point + margin;
  const min = 3800;
  const max = 4600;
  const pct = (v) => ((v - min) / (max - min)) * 100;

  return (
    <div className="epc-demo">
      <p className="ml-lbl">Point forecast + prediction interval</p>
      <div className="epc-interval">
        <div className="epc-interval-track">
          <div
            className="epc-interval-band"
            style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
          />
          <div className="epc-interval-point" style={{ left: `${pct(point)}%` }} />
        </div>
        <div className="epc-interval-labels">
          <span>${lo.toLocaleString()}</span>
          <span className="epc-interval-mid">${point.toLocaleString()}</span>
          <span>${hi.toLocaleString()}</span>
        </div>
      </div>
      <p className="ml-body-text">
        "Gold will trade at $4,180 ± $150 next month" — a single best guess (the dot) plus a band of
        plausible outcomes (the shaded range), not a claim about a fixed, knowable parameter.
      </p>
    </div>
  );
}
