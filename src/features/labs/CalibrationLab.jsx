import { useMemo, useState } from 'react';
import { LabFrame, Slider, Segmented, Plot } from './LabKit.jsx';
import { fmt, rng, normal } from './plot.js';
import { brier, confusionAt } from './prob.js';

// Calibration and group error rates. Synthetic risk scores for two groups
// with different base rates. Outcomes are drawn from the TRUE risk; the
// "overconfident" model reports a stretched version of it. The reliability
// diagram shows calibration per group; the threshold shows how error rates
// and precision differ by group even when the score is calibrated.

const sig = (z) => 1 / (1 + Math.exp(-z));
const logit = (p) => Math.log(p / (1 - p));

function makeGroup(seed, mu, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const p = sig(mu + normal(r));
    out.push({ p, y: r() < p ? 1 : 0 });
  }
  return out;
}

const GROUPS = { A: makeGroup(101, -0.5, 400), B: makeGroup(202, -1.9, 400) };

function reliability(rows, key) {
  const bins = Array.from({ length: 10 }, () => ({ n: 0, sp: 0, sy: 0 }));
  for (const row of rows) {
    const b = Math.min(9, Math.floor(row[key] * 10));
    bins[b].n += 1;
    bins[b].sp += row[key];
    bins[b].sy += row.y;
  }
  return bins.filter((b) => b.n >= 5).map((b) => ({ pred: b.sp / b.n, obs: b.sy / b.n, n: b.n }));
}

export default function CalibrationLab() {
  const [model, setModel] = useState('calibrated');
  const [t, setT] = useState(0.3);
  const view = useMemo(() => Object.fromEntries(Object.entries(GROUPS).map(([g, rows]) => [g, rows.map((row) => ({
    ...row,
    score: model === 'calibrated' ? row.p : sig(2.2 * logit(row.p)),
  }))])), [model]);

  const stats = Object.fromEntries(Object.entries(view).map(([g, rows]) => {
    const c = confusionAt(rows.map((r) => r.score), rows.map((r) => r.y), t);
    return [g, {
      base: rows.reduce((s, r) => s + r.y, 0) / rows.length,
      brier: brier(rows.map((r) => r.score), rows.map((r) => r.y)),
      rel: reliability(rows, 'score'),
      c,
      sel: (c.tp + c.fp) / rows.length,
    }];
  }));

  const readout = `${model === 'calibrated' ? 'Calibrated' : 'Overconfident'} model, threshold ${fmt(t, 2)}. `
    + `Group A: base rate ${fmt(stats.A.base, 3)}, Brier ${fmt(stats.A.brier, 4)}, TPR ${fmt(stats.A.c.recall, 3)}, FPR ${fmt(stats.A.c.fpr, 3)}, precision ${fmt(stats.A.c.precision, 3)}. `
    + `Group B: base rate ${fmt(stats.B.base, 3)}, Brier ${fmt(stats.B.brier, 4)}, TPR ${fmt(stats.B.c.recall, 3)}, FPR ${fmt(stats.B.c.fpr, 3)}, precision ${fmt(stats.B.c.precision, 3)}.`;

  return (
    <LabFrame
      title="Calibration and error rates by group"
      intro="Left: does a predicted 30% come true 30% of the time? Points on the diagonal mean yes. Right: at one shared threshold, compare the groups’ error rates and precision."
      presets={[{ id: 'calibrated', label: 'Calibrated model' }, { id: 'overconfident', label: 'Overconfident model' }]}
      activePreset={model}
      onPreset={setModel}
      onReset={() => { setModel('calibrated'); setT(0.3); }}
      figure={(
        <Plot x={[0, 1]} y={[0, 1]} square xLabel="predicted probability" yLabel="observed frequency">
          {({ sx, sy }) => (
            <g>
              <line className="lab-ghost" x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} />
              <polyline fill="none" stroke="var(--primary-text)" strokeWidth="2" points={stats.A.rel.map((b) => `${sx(b.pred)},${sy(b.obs)}`).join(' ')} />
              <polyline fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 4" points={stats.B.rel.map((b) => `${sx(b.pred)},${sy(b.obs)}`).join(' ')} />
              {stats.A.rel.map((b, i) => <circle key={`a${i}`} cx={sx(b.pred)} cy={sy(b.obs)} r={4} fill="var(--primary-text)" />)}
              {stats.B.rel.map((b, i) => <rect key={`b${i}`} x={sx(b.pred) - 4} y={sy(b.obs) - 4} width={8} height={8} fill="var(--accent)" />)}
              <text className="lab-label-muted" x={sx(0.04)} y={sy(0.94)}>● group A (solid) · ■ group B (dashed)</text>
            </g>
          )}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <Segmented label="Model" value={model} onChange={setModel} options={[{ value: 'calibrated', label: 'Calibrated' }, { value: 'overconfident', label: 'Overconfident' }]} />
          <Slider label="Shared decision threshold" value={t} min={0.05} max={0.95} step={0.01} onChange={setT} />
          <table className="studio-table">
            <caption className="lab-caption">At this threshold</caption>
            <thead><tr><th scope="col">Group</th><th scope="col">Base rate</th><th scope="col">TPR</th><th scope="col">FPR</th><th scope="col">Precision</th><th scope="col">Flagged</th></tr></thead>
            <tbody>
              {['A', 'B'].map((g) => (
                <tr key={g}><th scope="row">{g}</th><td>{fmt(stats[g].base, 3)}</td><td>{fmt(stats[g].c.recall, 3)}</td><td>{fmt(stats[g].c.fpr, 3)}</td><td>{fmt(stats[g].c.precision, 3)}</td><td>{fmt(stats[g].sel, 3)}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="studio-muted">Synthetic scores: 400 people per group, outcomes drawn from the true risk with a fixed seed.</p>
        </>
      )}
      table={{
        caption: 'Reliability bins (bins with at least 5 people)',
        columns: ['Group', 'Mean predicted', 'Observed', 'People'],
        rows: ['A', 'B'].flatMap((g) => stats[g].rel.map((b) => [g, fmt(b.pred, 3), fmt(b.obs, 3), b.n])),
      }}
      annotations={['The overconfident model pushes scores towards 0 and 1: its curve is flatter than the diagonal, and its Brier score is worse.', 'Even the calibrated model gives the groups different precision at the same threshold, because their base rates differ.']}
      constraints={['Observed frequencies in small bins are noisy; differences of a few points are not meaningful.', 'Groups and outcomes are invented; real fairness audits also question the labels themselves.']}
    />
  );
}
