import { useMemo, useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt } from './plot.js';
import { contour } from './calc.js';
import { descend } from './optimize.js';

// Gradient descent (required lab) on L(x, y) = a·x² + b·y². Learning rate,
// conditioning (b/a) and the start point decide whether the path glides,
// zig-zags or explodes; for this loss it converges exactly when
// η < 1/max(a, b) (i.e. η < 2/λmax with λ = 2a, 2b).

const PRESETS = [
  { id: 'good', label: 'Round bowl, good step', a: 1, b: 1, eta: 0.3, start: [2.5, 2] },
  { id: 'zigzag', label: 'Narrow valley (zig-zag)', a: 0.5, b: 5, eta: 0.18, start: [2.8, 1.5] },
  { id: 'slow', label: 'Tiny steps', a: 0.5, b: 5, eta: 0.02, start: [2.8, 1.5] },
  { id: 'explode', label: 'Too big a step', a: 1, b: 2, eta: 0.55, start: [2, 1] },
];

export default function DescentLab() {
  const [s, setS] = useState(PRESETS[1]);
  const [preset, setPreset] = useState('zigzag');
  const [steps, setSteps] = useState(20);
  const L = (x, y) => s.a * x * x + s.b * y * y;
  const path = useMemo(() => descend((x, y) => [2 * s.a * x, 2 * s.b * y], s.start, s.eta, steps), [s, steps]);
  const end = path[path.length - 1];
  const limit = 1 / Math.max(s.a, s.b);
  const diverging = s.eta >= limit;
  const levels = useMemo(() => [0.25, 1, 2.5, 5, 9, 15, 25].map((lv) => contour((x, y) => s.a * x * x + s.b * y * y, [-3.2, 3.2], [-3.2, 3.2], lv, 48)), [s.a, s.b]);
  const set = (patch) => { setPreset(null); setS((o) => ({ ...o, ...patch })); };

  const readout = `L(x, y) = ${fmt(s.a, 2)}x² + ${fmt(s.b, 2)}y², learning rate η = ${fmt(s.eta, 3)}, ${steps} steps from (${fmt(s.start[0], 2)}, ${fmt(s.start[1], 2)}). `
    + `Now at (${fmt(end[0], 4)}, ${fmt(end[1], 4)}) with loss ${fmt(L(end[0], end[1]), 5)}. `
    + (diverging ? `η ≥ ${fmt(limit, 3)} = 2/λmax, so the steepest direction overshoots further every step: it diverges.` : `Converges because η < ${fmt(limit, 3)}; the slow direction shrinks by ${fmt(Math.abs(1 - 2 * s.eta * Math.min(s.a, s.b)), 3)} per step.`);

  return (
    <LabFrame
      title="Gradient descent"
      intro="Each step moves against the gradient: w ← w − η∇L(w). Make the valley narrow, then find the learning rate that is fast without overshooting."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setS(PRESETS.find((p) => p.id === id)); }}
      onReset={() => { setPreset('zigzag'); setS(PRESETS[1]); setSteps(20); }}
      figure={(
        <Plot x={[-3.2, 3.2]} y={[-3.2, 3.2]} square xLabel="x" yLabel="y">
          {({ sx, sy }) => {
            const clip = (v) => Math.max(-3.2, Math.min(3.2, v));
            return (
              <g>
                {levels.map((lv, i) => lv.map(([a, b, c, d], j) => <line key={`${i}-${j}`} stroke="rgba(var(--overlay-rgb), 0.28)" x1={sx(a)} y1={sy(b)} x2={sx(c)} y2={sy(d)} />))}
                <polyline fill="none" stroke="var(--warning)" strokeWidth="2" points={path.map(([x, y]) => `${sx(clip(x))},${sy(clip(y))}`).join(' ')} />
                {path.map(([x, y], i) => <circle key={i} className={i === 0 ? 'lab-point' : 'lab-point-2'} cx={sx(clip(x))} cy={sy(clip(y))} r={i === 0 ? 6 : 3} />)}
                <circle cx={sx(0)} cy={sy(0)} r={4} fill="var(--success)" />
              </g>
            );
          }}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <Slider label="Learning rate η" value={s.eta} min={0.01} max={0.7} step={0.01} onChange={(v) => set({ eta: v })} hint={`Converges if η < ${fmt(limit, 3)}.`} />
          <Slider label="Curvature a (x direction)" value={s.a} min={0.25} max={5} step={0.25} onChange={(v) => set({ a: v })} />
          <Slider label="Curvature b (y direction)" value={s.b} min={0.25} max={5} step={0.25} onChange={(v) => set({ b: v })} />
          <Slider label="Steps" value={steps} min={1} max={60} step={1} format={(v) => fmt(v, 0)} onChange={setSteps} />
          <p className="studio-muted">Condition number κ = {fmt(Math.max(s.a, s.b) / Math.min(s.a, s.b), 2)}: the bigger it is, the narrower the valley and the slower the descent.</p>
        </>
      )}
      table={{
        caption: 'The first iterates',
        columns: ['Step', 'x', 'y', 'L(x, y)'],
        rows: path.slice(0, 11).map(([x, y], i) => [i, fmt(x, 5), fmt(y, 5), fmt(L(x, y), 6)]),
      }}
      annotations={['Along each axis the update multiplies the coordinate by (1 − 2ηa) or (1 − 2ηb): a factor beyond ±1 means divergence.', 'Zig-zag happens when the steep direction’s factor is negative: each step overshoots the valley floor.']}
      constraints={['A quadratic bowl with axis-aligned curvature; real losses are bumpier.', 'Points that leave the window are drawn at its edge.']}
    />
  );
}
