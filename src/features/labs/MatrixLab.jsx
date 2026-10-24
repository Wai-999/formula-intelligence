import { useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt } from './plot.js';

// Matrix transformations (required lab). The columns of A are where e₁ and
// e₂ land; the grid, the unit square and a chosen vector x follow. det A is
// the signed area of the image of the unit square.

const PRESETS = [
  { id: 'shear', label: 'Shear', m: [1, 0.5, 0, 1] },
  { id: 'rot90', label: 'Rotate 90°', m: [0, -1, 1, 0] },
  { id: 'scale', label: 'Scale 2 × 3', m: [2, 0, 0, 3] },
  { id: 'reflect', label: 'Reflect in x-axis', m: [1, 0, 0, -1] },
  { id: 'flatten', label: 'Flatten (det 0)', m: [2, 1, 4, 2] },
  { id: 'rot30', label: 'Rotate 30°', m: [Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6), Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)] },
];

export default function MatrixLab() {
  const [m, setM] = useState(PRESETS[0].m);
  const [x, setX] = useState([2, 4]);
  const [preset, setPreset] = useState('shear');
  const [a, b, c, d] = m;
  const apply = ([p, q]) => [a * p + b * q, c * p + d * q];
  const det = a * d - b * c;
  const ax = apply(x);
  const set = (i, val) => { setPreset(null); setM((o) => o.map((v, j) => (j === i ? val : v))); };
  const grid = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const sq = [[0, 0], [1, 0], [1, 1], [0, 1]].map(apply);

  const readout = `A = [[${fmt(a, 2)}, ${fmt(b, 2)}], [${fmt(c, 2)}, ${fmt(d, 2)}]]. e₁ goes to (${fmt(a, 2)}, ${fmt(c, 2)}) and e₂ to (${fmt(b, 2)}, ${fmt(d, 2)}) — the columns of A. `
    + `x = (${fmt(x[0])}, ${fmt(x[1])}) goes to Ax = (${fmt(ax[0], 2)}, ${fmt(ax[1], 2)}). det A = ${fmt(det, 3)}: `
    + (Math.abs(det) < 1e-9 ? 'the plane is flattened onto a line (or a point), so A cannot be undone.' : `areas are multiplied by ${fmt(Math.abs(det), 3)}${det < 0 ? ' and orientation is flipped' : ''}.`);

  return (
    <LabFrame
      title="Matrices as transformations"
      intro="The faint grid is the plane after A acts on it. Watch where the two basis arrows land: they are the columns of A, and everything else follows from them."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setM(PRESETS.find((p) => p.id === id).m); }}
      onReset={() => { setPreset('shear'); setM(PRESETS[0].m); setX([2, 4]); }}
      figure={(
        <Plot x={[-6, 6]} y={[-6, 6]} square>
          {({ sx, sy }) => (
            <g>
              {grid.map((g) => {
                const h1 = apply([-4, g]); const h2 = apply([4, g]);
                const v1 = apply([g, -4]); const v2 = apply([g, 4]);
                return (
                  <g key={g}>
                    <line className="lab-ghost" x1={sx(h1[0])} y1={sy(h1[1])} x2={sx(h2[0])} y2={sy(h2[1])} />
                    <line className="lab-ghost" x1={sx(v1[0])} y1={sy(v1[1])} x2={sx(v2[0])} y2={sy(v2[1])} />
                  </g>
                );
              })}
              <polygon className="lab-fill" points={sq.map(([p, q]) => `${sx(p)},${sy(q)}`).join(' ')} />
              <line className="lab-curve" x1={sx(0)} y1={sy(0)} x2={sx(a)} y2={sy(c)} />
              <line className="lab-curve-2" x1={sx(0)} y1={sy(0)} x2={sx(b)} y2={sy(d)} />
              <text className="lab-label" x={sx(a) + 6} y={sy(c) - 6}>Ae₁</text>
              <text className="lab-label" x={sx(b) + 6} y={sy(d) - 6}>Ae₂</text>
              <circle className="lab-point-2" cx={sx(x[0])} cy={sy(x[1])} r={5} />
              <text className="lab-label-muted" x={sx(x[0]) + 6} y={sy(x[1]) + 14}>x</text>
              <circle className="lab-point" cx={sx(ax[0])} cy={sy(ax[1])} r={6} />
              <text className="lab-label" x={sx(ax[0]) + 8} y={sy(ax[1]) - 8}>Ax</text>
              <text className="lab-label" x={sx(-5.7)} y={sy(5.4)}>det = {fmt(det, 3)}</text>
            </g>
          )}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <div className="lab-matrix" role="group" aria-label="Matrix entries">
            <Slider label="a (row 1, col 1)" value={a} min={-3} max={3} step={0.25} onChange={(v) => set(0, v)} />
            <Slider label="b (row 1, col 2)" value={b} min={-3} max={3} step={0.25} onChange={(v) => set(1, v)} />
            <Slider label="c (row 2, col 1)" value={c} min={-3} max={3} step={0.25} onChange={(v) => set(2, v)} />
            <Slider label="d (row 2, col 2)" value={d} min={-3} max={3} step={0.25} onChange={(v) => set(3, v)} />
          </div>
          <Slider label="x₁" value={x[0]} min={-3} max={3} step={0.5} onChange={(v) => setX((o) => [v, o[1]])} />
          <Slider label="x₂" value={x[1]} min={-4} max={4} step={0.5} onChange={(v) => setX((o) => [o[0], v])} />
        </>
      )}
      table={{
        caption: 'Where points go under A',
        columns: ['Point', 'Image under A'],
        rows: [['e₁ = (1, 0)', `(${fmt(a, 3)}, ${fmt(c, 3)})`], ['e₂ = (0, 1)', `(${fmt(b, 3)}, ${fmt(d, 3)})`], ['(1, 1)', `(${fmt(a + b, 3)}, ${fmt(c + d, 3)})`], [`x = (${fmt(x[0])}, ${fmt(x[1])})`, `(${fmt(ax[0], 3)}, ${fmt(ax[1], 3)})`], ['det A', fmt(det, 4)]],
      }}
      annotations={['The origin never moves: a matrix cannot translate.', 'Grid lines stay straight, parallel and evenly spaced — that is what “linear” looks like.']}
      constraints={['Entries from −3 to 3 in steps of 0.25 (presets may use exact values such as cos 30°).']}
    />
  );
}
