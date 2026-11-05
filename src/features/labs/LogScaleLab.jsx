import { useState } from 'react';
import { LabFrame, Slider, Segmented, Plot } from './LabKit.jsx';
import { fmt, pathOf } from './plot.js';
import { doublingTime } from './growth.js';

// Exponentials and logarithms (V5 Phase 2B: Algebra II → Calculus I).
// The same growth on a linear axis (a curve that runs away) and on a
// logarithmic axis (a straight line whose slope is log of the growth
// factor). Equal factors are equal distances on a log axis — that is what
// a logarithm is.

const PRESETS = [
  { id: 'savings', label: 'Savings at 6% a year', start: 1000, rate: 6, horizon: 30, unit: 'year', what: 'dollars' },
  { id: 'visitors', label: 'Website visitors, 8% a month', start: 2000, rate: 8, horizon: 24, unit: 'month', what: 'visitors' },
  { id: 'culture', label: 'Bacteria, 30% an hour', start: 500, rate: 30, horizon: 24, unit: 'hour', what: 'cells' },
];

export default function LogScaleLab() {
  const [preset, setPreset] = useState('savings');
  const p0 = PRESETS.find((x) => x.id === preset) ?? PRESETS[0];
  const [rate, setRate] = useState(PRESETS[0].rate);
  const [axis, setAxis] = useState('linear');
  const p = { ...p0, rate };
  const b = 1 + rate / 100;
  const A = (t) => p.start * b ** t;
  const T = p.horizon;
  const td = doublingTime(rate / 100);
  const log = axis === 'log';
  const y = log ? (t) => Math.log10(A(t)) : A;
  const yr = log ? [Math.log10(p.start) - 0.2, Math.log10(A(T)) + 0.2] : [0, A(T) * 1.05];
  const doublings = [];
  for (let k = 1; td * k <= T; k += 1) doublings.push(td * k);

  const readout = `At ${fmt(rate, 1)}% per ${p.unit}, ${p.what} multiply by ${fmt(b, 3)} each ${p.unit} and double every ${fmt(td, 2)} ${p.unit}s (rule of 70: ${fmt(70 / rate, 2)}). `
    + `After ${T} ${p.unit}s: ${fmt(A(T), 0)}. `
    + (log
      ? `On the log axis the growth is a straight line rising ${fmt(Math.log10(b), 4)} (= log₁₀ ${fmt(b, 3)}) per ${p.unit}.`
      : 'On the linear axis each doubling adds more than the one before, so the curve bends upward.');

  const figure = (
    <Plot x={[0, T]} y={yr} xLabel={`${p.unit}s`} yLabel={log ? `log₁₀(${p.what})` : p.what}>
      {({ sx, sy }) => (
        <g>
          {doublings.map((t) => <line key={t} className="lab-ghost" x1={sx(t)} x2={sx(t)} y1={sy(yr[0])} y2={sy(yr[1])} />)}
          <path className="lab-curve" d={pathOf(y, 0, T, sx, sy)} />
          <circle className="lab-point" cx={sx(0)} cy={sy(y(0))} r="4" />
          {doublings.slice(0, 6).map((t, k) => (
            <text key={`l${t}`} className="lab-label-muted" x={sx(t) + 3} y={sy(yr[1]) + 12 + (k % 2) * 12}>×{2 ** (k + 1)}</text>
          ))}
        </g>
      )}
    </Plot>
  );

  const step = T <= 12 ? 1 : T <= 24 ? 2 : 5;
  const rows = [];
  for (let t = 0; t <= T; t += step) rows.push([t, fmt(A(t), 1), fmt(Math.log10(A(t)), 4)]);

  return (
    <LabFrame
      title="Exponential growth on two scales"
      intro="Dashed lines mark each doubling. Switch the vertical axis to logarithmic and watch the curve become a straight line."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { const n = PRESETS.find((x) => x.id === id); setPreset(id); setRate(n.rate); }}
      onReset={() => { setPreset('savings'); setRate(PRESETS[0].rate); setAxis('linear'); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <Slider label={`Growth rate per ${p.unit}`} value={rate} min={1} max={40} step={0.5} format={(v) => `${fmt(v, 1)}%`} onChange={(v) => { setRate(v); }} />
          <Segmented label="Vertical axis" options={[{ value: 'linear', label: 'Linear' }, { value: 'log', label: 'Logarithmic' }]} value={axis} onChange={setAxis} />
          <dl className="lab-stat">
            <dt>Growth factor b</dt><dd>{fmt(b, 3)}</dd>
            <dt>Doubling time ln 2 / ln b</dt><dd>{fmt(td, 2)}</dd>
            <dt>Rule of 70</dt><dd>{fmt(70 / rate, 2)}</dd>
          </dl>
        </>
      )}
      table={{
        caption: `${p.start} ${p.what} growing ${fmt(rate, 1)}% per ${p.unit}`,
        columns: [`${p.unit}s`, p.what, 'log₁₀'],
        rows,
      }}
      annotations={[
        'The log column rises by the same amount every step: logarithms turn repeated multiplication into repeated addition.',
        'The rule of 70 is close for small rates and drifts for large ones — compare at 40%.',
      ]}
      constraints={[
        'Constant-rate growth is a model. Real growth slows: savings rates change, markets fill up, cultures run out of food.',
      ]}
    />
  );
}
