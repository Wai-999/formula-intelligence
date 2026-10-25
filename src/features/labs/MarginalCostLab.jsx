import { useState } from 'react';
import { LabFrame, Slider, Segmented, Plot } from './LabKit.jsx';
import { fmt, pathOf } from './plot.js';
import { cost, marginalCost, differenceQuotient } from './business.js';

// Marginal cost (V4 exemplar: derivative → cost). The tangent at q has slope
// C'(q), the cost of one more unit; a difference quotient estimates it from
// two cost records. With exact records a small step h is best; when a record
// is off by $1, that error is divided by h — so a tiny h is the worst choice.

const PRESETS = [
  { id: 'bakery', label: 'Bakery', model: { F: 200, a: 1.5, b: 0.002 }, q: 300, unit: 'loaf' },
  { id: 'linear', label: 'Constant marginal cost', model: { F: 100, a: 4, b: 0 }, q: 300, unit: 'unit' },
];
const STEPS = [0.01, 0.1, 1, 10, 50];
const money = (x) => `${x < 0 ? '−' : ''}$${Math.abs(x).toFixed(2)}`;

export default function MarginalCostLab() {
  const [p, setP] = useState(PRESETS[0]);
  const [preset, setPreset] = useState('bakery');
  const [q, setQ] = useState(PRESETS[0].q);
  const [h, setH] = useState(10);
  const [noisy, setNoisy] = useState('exact');
  const err = noisy === 'noisy' ? 1 : 0;

  const m = p.model;
  const exact = marginalCost(m, q);
  const est = differenceQuotient(m, q, h, 0, err);
  const qMax = 800;
  const yMax = cost(m, qMax) * 1.05;

  const readout = `At ${q} per day, the marginal cost C'(${q}) = ${money(exact)} per ${p.unit}. `
    + `From two cost records ${h} apart${err ? ', one of them $1 too high' : ''}, the estimate is ${money(est)} — off by ${money(Math.abs(est - exact))}.`;

  const figure = (
    <Plot x={[0, qMax]} y={[0, yMax]} xLabel="units per day q" yLabel="cost C(q), $">
      {({ sx, sy }) => {
        const c0 = cost(m, q);
        const span = 160;
        return (
          <g>
            <path className="lab-curve" d={pathOf((x) => cost(m, x), 0, qMax, sx, sy)} />
            <line className="lab-curve-2" x1={sx(q - span)} y1={sy(c0 - exact * span)} x2={sx(q + span)} y2={sy(c0 + exact * span)} />
            <line className="lab-curve-3" x1={sx(q)} y1={sy(c0)} x2={sx(q + h)} y2={sy(cost(m, q + h) + err)} />
            <circle className="lab-point" cx={sx(q)} cy={sy(c0)} r="5" />
            <text className="lab-label" x={sx(q) + 8} y={sy(c0) + 18}>tangent: slope {fmt(exact, 3)}</text>
          </g>
        );
      }}
    </Plot>
  );

  return (
    <LabFrame
      title="Marginal cost: derivative versus difference quotient"
      intro="The solid curve is total cost. The dashed line touches it at q with slope C'(q) — the marginal cost. Pick a step h to estimate that slope from two cost records."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { const n = PRESETS.find((x) => x.id === id); setPreset(id); setP(n); setQ(n.q); }}
      onReset={() => { setPreset('bakery'); setP(PRESETS[0]); setQ(PRESETS[0].q); setH(10); setNoisy('exact'); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <Slider label="Output q per day" value={q} min={0} max={700} step={10} format={(v) => fmt(v, 0)} onChange={(v) => { setPreset(null); setQ(v); }} />
          <Segmented label="Step h between records" options={STEPS.map((s) => ({ value: s, label: String(s) }))} value={h} onChange={setH} />
          <Segmented label="Cost records" options={[{ value: 'exact', label: 'Exact' }, { value: 'noisy', label: 'One record $1 too high' }]} value={noisy} onChange={setNoisy} />
        </>
      )}
      table={{
        caption: `Estimates of C'(${q}) = ${money(exact)} by step size`,
        columns: ['Step h', 'From exact records', 'One record $1 high'],
        rows: STEPS.map((s) => [s, money(differenceQuotient(m, q, s)), money(differenceQuotient(m, q, s, 0, 1))]),
      }}
      annotations={[
        'With exact records the error shrinks with h: it is exactly b·h for a quadratic cost.',
        'A $1 error in one record adds $1 ÷ h to the estimate: $100 at h = 0.01, 2 cents at h = 50.',
      ]}
      constraints={[
        'The cost curve is an illustrative quadratic, not measured bakery data.',
        'Real records have errors in both directions; here one record is $1 high so the effect is easy to see.',
      ]}
    />
  );
}
