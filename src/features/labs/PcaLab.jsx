import { useMemo, useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt, rng, normal } from './plot.js';
import { covariance2, eigen2 } from './linalg.js';

// SVD / PCA (required lab). Turn a candidate direction and watch the
// variance of the projected points; its maximum is the first principal
// component, and that maximum equals the top eigenvalue of the covariance
// matrix (= σ₁² / (n − 1) from the SVD of the centred data).
// Point clouds are SYNTHETIC, drawn from a seeded generator so they are
// identical on every visit.

function cloud(kind) {
  const r = rng(kind === 'strong' ? 11 : kind === 'weak' ? 23 : 37);
  const xs = [];
  const ys = [];
  for (let i = 0; i < 60; i++) {
    const a = normal(r) * 1.6;
    const b = normal(r);
    if (kind === 'strong') { xs.push(a); ys.push(0.85 * a + 0.35 * b); }
    else if (kind === 'weak') { xs.push(a); ys.push(0.3 * a + 0.9 * b); }
    else { const t = (i / 60) * 2 * Math.PI; xs.push(2 * Math.cos(t) + 0.1 * a); ys.push(2 * Math.sin(t) + 0.1 * b); }
  }
  return { xs, ys };
}

const PRESETS = [
  { id: 'strong', label: 'Strongly correlated' },
  { id: 'weak', label: 'Weakly correlated' },
  { id: 'ring', label: 'A ring' },
];

export default function PcaLab() {
  const [kind, setKind] = useState('strong');
  const [deg, setDeg] = useState(0);
  const { xs, ys } = useMemo(() => cloud(kind), [kind]);
  const cov = useMemo(() => covariance2(xs, ys), [xs, ys]);
  const e = useMemo(() => eigen2(cov.cxx, cov.cxy, cov.cxy, cov.cyy), [cov]);
  const t = (deg * Math.PI) / 180;
  const w = [Math.cos(t), Math.sin(t)];
  const varAlong = (u) => u[0] * u[0] * cov.cxx + 2 * u[0] * u[1] * cov.cxy + u[1] * u[1] * cov.cyy;
  const v = varAlong(w);
  const [l1, l2] = e.values;
  const pc1 = e.vectors[0];
  const pc1deg = ((Math.atan2(pc1[1], pc1[0]) * 180) / Math.PI + 180) % 180;
  const ratio = l1 / (l1 + l2);

  const readout = `Variance of the points projected onto the direction at ${fmt(deg, 0)}°: ${fmt(v, 3)}. `
    + `The maximum, ${fmt(l1, 3)}, is at ${fmt(pc1deg, 1)}° — the first principal component — and the minimum, ${fmt(l2, 3)}, is perpendicular to it. `
    + `PC1 explains ${fmt(ratio * 100, 1)}% of the total variance.`
    + (kind === 'ring' ? ' On the ring the two are nearly equal: no direction is special, and one component would lose about half the information.' : '');

  return (
    <LabFrame
      title="Principal components"
      intro="The points are centred. Turn the direction: each point drops a perpendicular onto the line, and the spread of those landing spots is the variance along that direction."
      presets={PRESETS}
      activePreset={kind}
      onPreset={(id) => { setKind(id); setDeg(0); }}
      onReset={() => { setKind('strong'); setDeg(0); }}
      figure={(
        <Plot x={[-5, 5]} y={[-4, 4]} square>
          {({ sx, sy }) => {
            const cx = xs.map((x) => x - cov.mx);
            const cy = ys.map((y) => y - cov.my);
            return (
              <g>
                <line className="lab-ghost" x1={sx(-6 * w[0])} y1={sy(-6 * w[1])} x2={sx(6 * w[0])} y2={sy(6 * w[1])} />
                {cx.map((x, i) => {
                  const s = x * w[0] + cy[i] * w[1];
                  return <line key={`p${i}`} stroke="rgba(var(--overlay-rgb), 0.18)" x1={sx(x)} y1={sy(cy[i])} x2={sx(s * w[0])} y2={sy(s * w[1])} />;
                })}
                {cx.map((x, i) => <circle key={`c${i}`} className="lab-point" cx={sx(x)} cy={sy(cy[i])} r={3.5} />)}
                {cx.map((x, i) => {
                  const s = x * w[0] + cy[i] * w[1];
                  return <circle key={`q${i}`} className="lab-point-2" cx={sx(s * w[0])} cy={sy(s * w[1])} r={2.5} />;
                })}
                {e.vectors.map((u, i) => {
                  const L = 2 * Math.sqrt(Math.max(e.values[i], 0));
                  return <line key={`pc${i}`} className={i === 0 ? 'lab-curve-3' : 'lab-curve-3'} strokeWidth={3} x1={sx(-L * u[0])} y1={sy(-L * u[1])} x2={sx(L * u[0])} y2={sy(L * u[1])} />;
                })}
                <text className="lab-label" x={sx(-4.8)} y={sy(3.6)}>variance along line: {fmt(v, 2)}</text>
              </g>
            );
          }}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <Slider label="Direction (degrees)" value={deg} min={0} max={179} step={1} format={(x) => `${fmt(x, 0)}°`} onChange={setDeg} />
          <div aria-hidden="true" className="studio-meter" style={{ height: 10 }}><span style={{ width: `${Math.min(100, (v / l1) * 100)}%` }} /></div>
          <p className="studio-muted">Bar: variance along your direction, as a share of the maximum.</p>
          <dl className="lab-stat">
            <dt>Covariance</dt><dd>[[{fmt(cov.cxx, 3)}, {fmt(cov.cxy, 3)}], [{fmt(cov.cxy, 3)}, {fmt(cov.cyy, 3)}]]</dd>
            <dt>λ₁, λ₂</dt><dd>{fmt(l1, 3)}, {fmt(l2, 3)}</dd>
            <dt>PC1 direction</dt><dd>({fmt(pc1[0], 3)}, {fmt(pc1[1], 3)})</dd>
          </dl>
          <p className="studio-muted">Synthetic points from a seeded generator.</p>
        </>
      )}
      table={{
        caption: 'Variance of the projections at several directions',
        columns: ['Direction', 'Variance'],
        rows: [0, 30, 60, 90, 120, 150].map((dd) => {
          const r = (dd * Math.PI) / 180;
          return [`${dd}°`, fmt(varAlong([Math.cos(r), Math.sin(r)]), 4)];
        }).concat([['PC1 (max)', fmt(l1, 4)], ['PC2 (min)', fmt(l2, 4)]]),
      }}
      annotations={['Variance along a unit direction w is wᵀCw; it is largest along C’s top eigenvector.', 'The two principal axes are perpendicular because C is symmetric.', 'Drawn axis lengths are 2√λ (two standard deviations).']}
      constraints={['60 points; directions in 1° steps, so the slider can land within 0.5° of PC1.', 'Measured in the units of the data: rescale one variable and PC1 can change (see the lesson).']}
    />
  );
}
