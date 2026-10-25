import { useState } from 'react';
import { LabFrame, Slider, Segmented } from './LabKit.jsx';
import { fmt } from './plot.js';
import { matVec, standardize } from './business.js';

// Matrix–vector products as scores (V4 exemplar: matrix multiplication →
// customer data). Each customer is a row of X; the weights are w; the scores
// are Xw. Switching the basket column to cents shows a units trap, and
// standardizing the columns shows the usual fix.

const CUSTOMERS = ['A', 'B', 'C', 'D'];
const FEATURES = ['Visits / month', 'Basket', 'Months as customer'];
// Invented, illustrative customers (not real people or a real shop).
const X_DOLLARS = [
  [8, 25, 12],
  [2, 80, 3],
  [5, 40, 20],
  [1, 15, 1],
];
const DEFAULT_W = [3, 0.2, 0.5];

export default function MatrixScoresLab() {
  const [w, setW] = useState(DEFAULT_W);
  const [units, setUnits] = useState('dollars');
  const [scale, setScale] = useState('raw');
  const raw = units === 'cents' ? X_DOLLARS.map(([v, b, m]) => [v, b * 100, m]) : X_DOLLARS;
  const X = scale === 'standardized' ? standardize(raw) : raw;
  const scores = matVec(X, w);
  const order = CUSTOMERS.map((c, i) => ({ c, s: scores[i] })).sort((a, b) => b.s - a.s);
  const top = order.slice(0, 2).map((o) => o.c).join(' and ');
  const lo = Math.min(0, ...scores);
  const hi = Math.max(1, ...scores);
  const setWi = (i, v) => setW((o) => o.map((x, j) => (j === i ? v : x)));

  const readout = `(4 × 3)(3 × 1) = (4 × 1): ${CUSTOMERS.map((c, i) => `${c} ${fmt(scores[i], 2)}`).join(', ')}. `
    + `Top two: ${top}.${units === 'cents' && scale === 'raw' ? ' The basket is in cents, so its column is 100 times larger and dominates every score.' : ''}`;

  const W = 420;
  const rowH = 46;
  const x0 = 40;
  const sx = (v) => x0 + ((v - lo) / (hi - lo)) * (W - x0 - 60);
  const figure = (
    <svg viewBox={`0 0 ${W} ${rowH * 4 + 20}`} className="lab-svg">
      <line className="lab-ghost" x1={sx(0)} x2={sx(0)} y1={6} y2={rowH * 4 + 10} />
      {CUSTOMERS.map((c, i) => {
        const y = 14 + i * rowH;
        const a = sx(Math.min(0, scores[i]));
        const b = sx(Math.max(0, scores[i]));
        return (
          <g key={c}>
            <text className="lab-label" x={10} y={y + 18}>{c}</text>
            <rect className={order[0].c === c || order[1].c === c ? 'lab-fill' : 'lab-fill-2'} x={a} y={y} width={Math.max(1, b - a)} height={26} rx="3" />
            <text className="lab-label-muted" x={b + 6} y={y + 18}>{fmt(scores[i], 2)}</text>
          </g>
        );
      })}
    </svg>
  );

  return (
    <LabFrame
      title="Scores as a matrix–vector product"
      intro="Each bar is one entry of Xw: the customer's row of features, multiplied by the weights and added up. The two highest (shaded) get the invitation."
      onReset={() => { setW(DEFAULT_W); setUnits('dollars'); setScale('raw'); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <Slider label="Weight on visits / month" value={w[0]} min={0} max={5} step={0.1} format={(v) => fmt(v, 1)} onChange={(v) => setWi(0, v)} />
          <Slider label="Weight on basket" value={w[1]} min={0} max={1} step={0.05} format={(v) => fmt(v, 2)} onChange={(v) => setWi(1, v)} />
          <Slider label="Weight on months as customer" value={w[2]} min={0} max={2} step={0.1} format={(v) => fmt(v, 1)} onChange={(v) => setWi(2, v)} />
          <Segmented label="Basket measured in" options={[{ value: 'dollars', label: 'Dollars' }, { value: 'cents', label: 'Cents' }]} value={units} onChange={setUnits} />
          <Segmented label="Columns" options={[{ value: 'raw', label: 'As measured' }, { value: 'standardized', label: 'Standardized' }]} value={scale} onChange={setScale} />
        </>
      )}
      table={{
        caption: `X (${scale === 'standardized' ? 'standardized' : `basket in ${units}`}), weights w = (${w.map((v) => fmt(v, 2)).join(', ')}) and scores Xw`,
        columns: ['Customer', ...FEATURES, 'Score Xw'],
        rows: CUSTOMERS.map((c, i) => [c, ...X[i].map((v) => fmt(v, 2)), fmt(scores[i], 2)]),
      }}
      annotations={[
        'Each score is a dot product of a row with w; Xw does all rows at once.',
        'Weights mean nothing without their units: the same 0.2 means very different things per dollar and per cent.',
        'Standardized columns (mean 0, standard deviation 1) make the weights comparable.',
      ]}
      constraints={[
        'Four invented customers; real scoring uses many more rows and fitted, not hand-picked, weights.',
        'A weighted sum assumes features add up, with no interactions.',
      ]}
    />
  );
}
