import { useMemo, useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt, rng, normal } from './plot.js';
import { confusionAt, rocAuc, rocCurve } from './prob.js';

// Classification decision boundaries (required lab). A fixed linear scoring
// rule p = σ(w·x + b) on synthetic, imbalanced data (20 positives, 60
// negatives). Moving the threshold moves the boundary line; the confusion
// matrix, precision/recall and the point on the ROC curve move with it,
// while the AUC — a property of the scores, not the threshold — stays put.

const W = [1.4, 1.1];
const B = -0.3;
const sigmoid = (z) => 1 / (1 + Math.exp(-z));

function makeData() {
  const r = rng(2024);
  const pts = [];
  for (let i = 0; i < 20; i++) pts.push({ x: 1.2 + 0.9 * normal(r), y: 1.0 + 0.9 * normal(r), label: 1 });
  for (let i = 0; i < 60; i++) pts.push({ x: -0.8 + 1.0 * normal(r), y: -0.6 + 1.0 * normal(r), label: 0 });
  return pts.map((p) => ({ ...p, score: sigmoid(W[0] * p.x + W[1] * p.y + B) }));
}

const PRESETS = [
  { id: 't50', label: 'Threshold 0.5', t: 0.5 },
  { id: 't20', label: 'Catch more (0.2)', t: 0.2 },
  { id: 't80', label: 'Be sure (0.8)', t: 0.8 },
];

export default function BoundaryLab() {
  const data = useMemo(makeData, []);
  const [t, setT] = useState(0.5);
  const [preset, setPreset] = useState('t50');
  const scores = data.map((d) => d.score);
  const labels = data.map((d) => d.label);
  const c = confusionAt(scores, labels, t);
  const auc = useMemo(() => rocAuc(scores, labels), [data]); // eslint-disable-line react-hooks/exhaustive-deps
  const roc = useMemo(() => rocCurve(scores, labels), [data]); // eslint-disable-line react-hooks/exhaustive-deps
  const logit = Math.log(t / (1 - t));
  // Boundary: W·(x, y) + B = logit(t)  →  y = (logit − B − W0·x) / W1
  const by = (x) => (logit - B - W[0] * x) / W[1];

  const readout = `Threshold ${fmt(t, 2)}: ${c.tp} true positives, ${c.fp} false positives, ${c.fn} missed positives, ${c.tn} true negatives. `
    + `Precision ${fmt(c.precision, 3)}, recall ${fmt(c.recall, 3)}, F1 ${fmt(c.f1, 3)}, false-positive rate ${fmt(c.fpr, 3)}, accuracy ${fmt(c.accuracy, 3)}. `
    + `ROC AUC ${fmt(auc, 3)} (unchanged by the threshold). Flagging nobody would score accuracy ${fmt(60 / 80, 3)}.`;

  return (
    <LabFrame
      title="Thresholds, boundaries and the confusion matrix"
      intro="Squares are positives (20), circles negatives (60). Points in the shaded half are predicted positive. Slide the threshold and watch what you trade."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setT(PRESETS.find((p) => p.id === id).t); }}
      onReset={() => { setPreset('t50'); setT(0.5); }}
      figure={(
        <div className="boundary-figs">
          <Plot x={[-4, 4]} y={[-4, 4]} square xLabel="feature 1" yLabel="feature 2">
            {({ sx, sy }) => {
              // The predicted-positive half-plane (y above the line, since W[1] > 0),
              // drawn generously and clipped to the plot area.
              const poly = [[-4, by(-4)], [4, by(4)], [4, 60], [-4, 60]];
              return (
                <g>
                  <defs>
                    <clipPath id="boundary-clip"><rect x={sx(-4)} y={sy(4)} width={sx(4) - sx(-4)} height={sy(-4) - sy(4)} /></clipPath>
                  </defs>
                  <polygon className="lab-fill" opacity={0.5} clipPath="url(#boundary-clip)" points={poly.map(([px, py]) => `${sx(px)},${sy(py)}`).join(' ')} />
                  <line className="lab-curve" clipPath="url(#boundary-clip)" x1={sx(-4)} y1={sy(by(-4))} x2={sx(4)} y2={sy(by(4))} />
                  {data.map((d, i) => (d.label
                    ? <rect key={i} x={sx(d.x) - 4} y={sy(d.y) - 4} width={8} height={8} fill="var(--danger)" stroke="var(--surface)" />
                    : <circle key={i} cx={sx(d.x)} cy={sy(d.y)} r={4} fill="none" stroke="var(--accent)" strokeWidth="1.6" />))}
                </g>
              );
            }}
          </Plot>
          <Plot x={[0, 1]} y={[0, 1]} width={260} height={260} square xLabel="FPR" yLabel="TPR">
            {({ sx, sy }) => (
              <g>
                <line className="lab-ghost" x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} />
                <polyline fill="none" stroke="var(--primary-text)" strokeWidth="2" points={roc.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')} />
                <circle className="lab-point-2" cx={sx(c.fpr)} cy={sy(c.recall)} r={6} />
                <text className="lab-label-muted" x={sx(0.38)} y={sy(0.1)}>AUC {fmt(auc, 3)}</text>
              </g>
            )}
          </Plot>
        </div>
      )}
      readout={readout}
      controls={(
        <>
          <Slider label="Decision threshold on p" value={t} min={0.02} max={0.98} step={0.01} onChange={(v) => { setPreset(null); setT(v); }} />
          <table className="studio-table confusion">
            <caption className="lab-caption">Confusion matrix</caption>
            <thead><tr><td /><th scope="col">Predicted +</th><th scope="col">Predicted −</th></tr></thead>
            <tbody>
              <tr><th scope="row">Actual +</th><td>TP {c.tp}</td><td>FN {c.fn}</td></tr>
              <tr><th scope="row">Actual −</th><td>FP {c.fp}</td><td>TN {c.tn}</td></tr>
            </tbody>
          </table>
          <dl className="lab-stat">
            <dt>Precision</dt><dd>{fmt(c.precision, 3)}</dd>
            <dt>Recall (TPR)</dt><dd>{fmt(c.recall, 3)}</dd>
            <dt>F1</dt><dd>{fmt(c.f1, 3)}</dd>
            <dt>FPR</dt><dd>{fmt(c.fpr, 3)}</dd>
          </dl>
        </>
      )}
      table={{
        caption: 'Metrics at several thresholds (synthetic data)',
        columns: ['Threshold', 'TP', 'FP', 'FN', 'TN', 'Precision', 'Recall', 'FPR'],
        rows: [0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9].map((th) => {
          const k = confusionAt(scores, labels, th);
          return [fmt(th, 2), k.tp, k.fp, k.fn, k.tn, fmt(k.precision, 3), fmt(k.recall, 3), fmt(k.fpr, 3)];
        }),
      }}
      annotations={['Lowering the threshold can only raise recall — and usually costs precision.', 'With 75% negatives, “always negative” scores 0.75 accuracy: accuracy alone hides the misses.']}
      constraints={['Synthetic data from a seeded generator; the scoring rule’s weights are fixed, not learned here.']}
    />
  );
}
