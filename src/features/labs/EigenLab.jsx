import { useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt } from './plot.js';
import { eigen2 } from './linalg.js';

// Eigenvectors (required lab). Sweep a unit vector v around the circle and
// watch Av. Where Av lands on the same line as v, v is an eigenvector and
// the stretch factor is its eigenvalue. A rotation has no such direction.

const PRESETS = [
  { id: 'sym', label: 'Symmetric [[2,1],[1,2]]', m: [2, 1, 1, 2] },
  { id: 'shear', label: 'Shear [[1,1],[0,1]]', m: [1, 1, 0, 1] },
  { id: 'diag', label: 'Diagonal [[3,0],[0,0.5]]', m: [3, 0, 0, 0.5] },
  { id: 'rot', label: 'Rotation 90°', m: [0, -1, 1, 0] },
];

export default function EigenLab() {
  const [m, setM] = useState(PRESETS[0].m);
  const [deg, setDeg] = useState(20);
  const [preset, setPreset] = useState('sym');
  const [a, b, c, d] = m;
  const t = (deg * Math.PI) / 180;
  const v = [Math.cos(t), Math.sin(t)];
  const av = [a * v[0] + b * v[1], c * v[0] + d * v[1]];
  const cross = v[0] * av[1] - v[1] * av[0];
  const aligned = Math.abs(cross) < 0.02;
  const e = eigen2(a, b, c, d);
  const set = (i, val) => { setPreset(null); setM((o) => o.map((x, j) => (j === i ? val : x))); };

  const eigText = e.real
    ? `Eigenvalues ${fmt(e.values[0], 3)} and ${fmt(e.values[1], 3)}${e.vectors.length ? `, along directions ${e.vectors.map((w) => `(${fmt(w[0], 3)}, ${fmt(w[1], 3)})`).join(' and ')}` : ''}.`
    : `No real eigenvalues (complex pair ${fmt(e.re, 3)} ± ${fmt(e.im, 3)}i): no direction is kept.`;
  const readout = `v at ${fmt(deg, 0)}° = (${fmt(v[0], 3)}, ${fmt(v[1], 3)}); Av = (${fmt(av[0], 3)}, ${fmt(av[1], 3)}). `
    + (aligned ? `Av is on v’s line — v is (very nearly) an eigenvector, stretched by ${fmt((av[0] * v[0] + av[1] * v[1]), 3)}. ` : 'Av points off v’s line. ')
    + eigText;

  return (
    <LabFrame
      title="Hunting for eigenvectors"
      intro="Turn the angle slowly. Most directions get knocked off their line by A. Stop when Av lines up with v: you have found an eigenvector."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setM(PRESETS.find((p) => p.id === id).m); }}
      onReset={() => { setPreset('sym'); setM(PRESETS[0].m); setDeg(20); }}
      figure={(
        <Plot x={[-4, 4]} y={[-4, 4]} square>
          {({ sx, sy }) => (
            <g>
              <circle className="lab-ghost" cx={sx(0)} cy={sy(0)} r={sx(1) - sx(0)} />
              <line className="lab-ghost" x1={sx(-4 * v[0])} y1={sy(-4 * v[1])} x2={sx(4 * v[0])} y2={sy(4 * v[1])} />
              {e.real && e.vectors.map((w, i) => (
                <line key={i} className="lab-curve-3" x1={sx(-4 * w[0])} y1={sy(-4 * w[1])} x2={sx(4 * w[0])} y2={sy(4 * w[1])} />
              ))}
              <line className="lab-curve" x1={sx(0)} y1={sy(0)} x2={sx(v[0])} y2={sy(v[1])} />
              <line className="lab-curve-2" x1={sx(0)} y1={sy(0)} x2={sx(av[0])} y2={sy(av[1])} />
              <circle className="lab-point" cx={sx(v[0])} cy={sy(v[1])} r={5} />
              <circle className="lab-point-2" cx={sx(av[0])} cy={sy(av[1])} r={6} />
              <text className="lab-label" x={sx(v[0]) + 6} y={sy(v[1]) - 6}>v</text>
              <text className="lab-label" x={sx(av[0]) + 6} y={sy(av[1]) - 6}>Av</text>
              {aligned && <text className="lab-label" x={sx(-3.8)} y={sy(3.5)}>eigenvector!</text>}
            </g>
          )}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <Slider label="Direction of v (degrees)" value={deg} min={0} max={180} step={1} format={(x) => `${fmt(x, 0)}°`} onChange={setDeg} hint="Directions repeat after 180°: v and −v are on the same line." />
          <Slider label="a" value={a} min={-3} max={3} step={0.25} onChange={(x) => set(0, x)} />
          <Slider label="b" value={b} min={-3} max={3} step={0.25} onChange={(x) => set(1, x)} />
          <Slider label="c" value={c} min={-3} max={3} step={0.25} onChange={(x) => set(2, x)} />
          <Slider label="d" value={d} min={-3} max={3} step={0.25} onChange={(x) => set(3, x)} />
        </>
      )}
      table={{
        caption: 'Eigen-analysis of the current matrix',
        columns: ['Quantity', 'Value'],
        rows: [['trace (a + d)', fmt(a + d, 4)], ['det (ad − bc)', fmt(a * d - b * c, 4)], ['eigenvalues', e.real ? e.values.map((x) => fmt(x, 4)).join(', ') : `${fmt(e.re, 4)} ± ${fmt(e.im, 4)}i`], ['eigen-directions', e.real && e.vectors.length ? e.vectors.map((w) => `(${fmt(w[0], 4)}, ${fmt(w[1], 4)})`).join('; ') : 'none (real)']],
      }}
      annotations={['The dotted lines are the eigen-directions computed exactly; the slider lets you find them by eye.', 'For a symmetric matrix the eigen-directions are perpendicular.', 'A shear has only one eigen-direction (a repeated eigenvalue).']}
      constraints={['“Lined up” is judged within a small tolerance, so a nearby angle may light up.']}
    />
  );
}
