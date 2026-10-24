import { useMemo, useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt, pathOf } from './plot.js';
import { leastSquares } from './fit.js';

// Least-squares fitting (required lab). Try your own line, see each
// residual as a square, and compare your total with the least-squares line.
// Every dataset is small and SYNTHETIC — made up for teaching, and labelled
// as such (§9 "mark synthetic examples clearly").

const DATASETS = {
  practice: { label: 'Practice vs score', x: [1, 2, 3, 4, 5], y: [3, 5, 4, 8, 10], xLabel: 'hours of practice', yLabel: 'quiz score (out of 10)' },
  outlier: { label: 'With an outlier', x: [1, 2, 3, 4, 5, 6], y: [3, 5, 4, 8, 10, 2], xLabel: 'hours of practice', yLabel: 'quiz score' },
  curve: { label: 'A curve', x: [-2, -1, 0, 1, 2], y: [4, 1, 0, 1, 4], xLabel: 'x', yLabel: 'y' },
};

const START = { m: 1, b: 2 };

export default function LeastSquaresLab() {
  const [key, setKey] = useState('practice');
  const [line, setLine] = useState(START);
  const [showBest, setShowBest] = useState(true);
  const d = DATASETS[key];
  const fit = useMemo(() => leastSquares(d.x, d.y), [d]);
  const yhat = (x) => line.m * x + line.b;
  const resid = d.x.map((x, i) => d.y[i] - yhat(x));
  const sse = resid.reduce((s, r) => s + r * r, 0);
  const xr = [Math.min(...d.x) - 1, Math.max(...d.x) + 1];
  const yr = [Math.min(0, ...d.y) - 2, Math.max(...d.y) + 3];

  const readout = `Your line y = ${fmt(line.m, 2)}x ${line.b < 0 ? '−' : '+'} ${fmt(Math.abs(line.b), 2)} has a sum of squared residuals of ${fmt(sse, 3)}. `
    + `The least-squares line is y = ${fmt(fit.m, 3)}x ${fit.b < 0 ? '−' : '+'} ${fmt(Math.abs(fit.b), 3)}, with ${fmt(fit.sse, 3)} — no line can do better. `
    + (sse - fit.sse < 0.01 ? 'You have found it.' : `Yours is ${fmt(sse - fit.sse, 3)} higher.`);

  return (
    <LabFrame
      title="Least-squares fitting"
      intro="Each dashed segment is a residual; each shaded square has that residual as its side. Least squares makes the total area of the squares as small as possible. Try to beat it."
      presets={Object.entries(DATASETS).map(([id, x]) => ({ id, label: x.label }))}
      activePreset={key}
      onPreset={(id) => { setKey(id); setLine(START); }}
      onReset={() => { setKey('practice'); setLine(START); setShowBest(true); }}
      figure={(
        <Plot x={xr} y={yr} xLabel={d.xLabel} yLabel={d.yLabel}>
          {({ sx, sy }) => (
            <g>
              {d.x.map((x, i) => {
                const top = Math.max(d.y[i], yhat(x));
                const side = Math.abs(sy(d.y[i]) - sy(yhat(x)));
                return <rect key={`sq${i}`} className="lab-fill" x={sx(x)} y={sy(top)} width={side} height={side} opacity={0.6} />;
              })}
              {showBest && <path className="lab-curve-2" d={pathOf((x) => fit.m * x + fit.b, xr[0], xr[1], sx, sy, 2, yr)} />}
              <path className="lab-curve" d={pathOf(yhat, xr[0], xr[1], sx, sy, 2, yr)} />
              {d.x.map((x, i) => <line key={`r${i}`} className="lab-residual" x1={sx(x)} x2={sx(x)} y1={sy(d.y[i])} y2={sy(yhat(x))} />)}
              {d.x.map((x, i) => <circle key={`p${i}`} className="lab-point" cx={sx(x)} cy={sy(d.y[i])} r={5} />)}
              <circle className="lab-point-2" cx={sx(fit.xbar)} cy={sy(fit.ybar)} r={5} />
              <text className="lab-label-muted" x={sx(fit.xbar) + 8} y={sy(fit.ybar) + 16}>(x̄, ȳ)</text>
            </g>
          )}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <Slider label="Your slope m" value={line.m} min={-3} max={4} step={0.05} onChange={(m) => setLine((l) => ({ ...l, m }))} />
          <Slider label="Your intercept b" value={line.b} min={-4} max={10} step={0.05} onChange={(b) => setLine((l) => ({ ...l, b }))} />
          <label className="studio-choice">
            <input type="checkbox" checked={showBest} onChange={(e) => setShowBest(e.target.checked)} />
            <span>Show the least-squares line (dashed)</span>
          </label>
          <dl className="lab-stat">
            <dt>Your total of squares</dt><dd>{fmt(sse, 3)}</dd>
            <dt>Least squares</dt><dd>{fmt(fit.sse, 3)}</dd>
            <dt>Best slope, intercept</dt><dd>{fmt(fit.m, 3)}, {fmt(fit.b, 3)}</dd>
          </dl>
          <p className="studio-muted">Synthetic data, invented for this lab.</p>
        </>
      )}
      table={{
        caption: `${d.label} (synthetic): residuals for your line`,
        columns: ['x', 'y', 'your ŷ', 'residual y − ŷ', 'squared'],
        rows: d.x.map((x, i) => [fmt(x), fmt(d.y[i]), fmt(yhat(x), 3), fmt(resid[i], 3), fmt(resid[i] ** 2, 3)]),
      }}
      annotations={['The least-squares line always passes through the point of means (x̄, ȳ).', 'Its residuals always add up to zero — so “sum of residuals” cannot be what it minimizes.', 'One outlier can drag the slope a long way, because squaring makes big residuals count most.', 'On “A curve”, the best line is flat although y clearly depends on x: least squares finds the best LINE, not the right model.']}
      constraints={['Residuals are measured vertically: the line predicts y from x.', 'Your line’s slope and intercept move in steps of 0.05.']}
    />
  );
}
