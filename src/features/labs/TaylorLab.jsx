import { useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt, pathOf } from './plot.js';
import { taylorValue } from './calc.js';

// Taylor approximation (required lab): Maclaurin polynomials of degree n
// next to the function, with the error at a chosen x. ln(1 + x) and
// 1/(1 − x) show what happens outside the interval of convergence.

const FUNCS = {
  exp: { label: 'eˣ', f: Math.exp, d: () => 1, conv: 'all x', y: [-1, 8] },
  sin: { label: 'sin x', f: Math.sin, d: (k) => [0, 1, 0, -1][k % 4], conv: 'all x', y: [-2.5, 2.5] },
  log: { label: 'ln(1 + x)', f: (x) => (x > -1 ? Math.log(1 + x) : NaN), d: (k) => (k === 0 ? 0 : ((k % 2 ? 1 : -1) * factorial(k - 1))), conv: '−1 < x ≤ 1', y: [-3, 3] },
  geo: { label: '1/(1 − x)', f: (x) => (x !== 1 ? 1 / (1 - x) : NaN), d: (k) => factorial(k), conv: '−1 < x < 1', y: [-3, 6] },
};

function factorial(k) {
  let p = 1;
  for (let i = 2; i <= k; i++) p *= i;
  return p;
}

const PRESETS = [
  { id: 'exp', label: 'eˣ near 0.5', fn: 'exp', n: 3, x: 0.5 },
  { id: 'sin', label: 'sin x, small angle', fn: 'sin', n: 1, x: 0.2 },
  { id: 'log', label: 'ln(1 + x) at 1.5 (diverges)', fn: 'log', n: 6, x: 1.5 },
];

export default function TaylorLab() {
  const [s, setS] = useState(PRESETS[0]);
  const [preset, setPreset] = useState('exp');
  const F = FUNCS[s.fn];
  const derivs = Array.from({ length: s.n + 1 }, (_, k) => F.d(k));
  const P = (x) => taylorValue(derivs, 0, x);
  const exact = F.f(s.x);
  const approx = P(s.x);
  const set = (patch) => { setPreset(null); setS((o) => ({ ...o, ...patch })); };

  const readout = `Degree-${s.n} Maclaurin polynomial of ${F.label}. At x = ${fmt(s.x, 2)}: P(x) = ${fmt(approx, 6)}, ${F.label} = ${fmt(exact, 6)}, error ${fmt(Math.abs(exact - approx), 6)}. The series converges for ${F.conv}.`;

  return (
    <LabFrame
      title="Taylor polynomials"
      intro="Raise the degree and watch the polynomial hug the curve further from 0 — for eˣ and sin x everywhere eventually, for ln(1 + x) only up to x = 1."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setS(PRESETS.find((p) => p.id === id)); }}
      onReset={() => { setPreset('exp'); setS(PRESETS[0]); }}
      figure={(
        <Plot x={[-3, 3]} y={F.y} xLabel="x" yLabel="y">
          {({ sx, sy }) => (
            <g>
              <path className="lab-curve" d={pathOf(F.f, -3, 3, sx, sy, 400, [F.y[0] - 1, F.y[1] + 1])} />
              <path className="lab-curve-2" d={pathOf(P, -3, 3, sx, sy, 400, [F.y[0] - 1, F.y[1] + 1])} />
              <line className="lab-ghost" x1={sx(s.x)} x2={sx(s.x)} y1={sy(F.y[0])} y2={sy(F.y[1])} />
              {Number.isFinite(exact) && <circle className="lab-point" cx={sx(s.x)} cy={sy(Math.max(F.y[0], Math.min(F.y[1], exact)))} r={5} />}
              <circle className="lab-point-2" cx={sx(s.x)} cy={sy(Math.max(F.y[0], Math.min(F.y[1], approx)))} r={5} />
              <text className="lab-label" x={sx(-2.9)} y={sy(F.y[1]) + 16}>solid: {F.label} · dashed: P{s.n}(x)</text>
            </g>
          )}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <div className="studio-row" role="group" aria-label="Function">
            {Object.entries(FUNCS).map(([id, x]) => (
              <button key={id} type="button" className="lab-chip" aria-pressed={s.fn === id} onClick={() => set({ fn: id })}>{x.label}</button>
            ))}
          </div>
          <Slider label="Degree n" value={s.n} min={0} max={12} step={1} format={(v) => fmt(v, 0)} onChange={(v) => set({ n: v })} />
          <Slider label="Evaluate at x" value={s.x} min={-2.5} max={2.5} step={0.05} onChange={(v) => set({ x: v })} />
        </>
      )}
      table={{
        caption: `Error of the degree-n polynomial for ${F.label} at x = ${fmt(s.x, 2)}`,
        columns: ['n', 'Pₙ(x)', '|error|'],
        rows: [0, 1, 2, 3, 4, 6, 8, 10, 12].map((k) => {
          const dk = Array.from({ length: k + 1 }, (_, i) => F.d(i));
          const v = taylorValue(dk, 0, s.x);
          return [k, fmt(v, 6), fmt(Math.abs(exact - v), 6)];
        }),
      }}
      annotations={['Near the centre a low degree is already excellent; far away you need more terms — or no number of terms suffices.', 'For ln(1 + x) at x = 1.5 the error GROWS with n: outside the interval of convergence, more terms make it worse.']}
      constraints={['Centred at 0 (Maclaurin) only; degrees up to 12.']}
    />
  );
}
