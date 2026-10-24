import { useMemo, useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt } from './plot.js';
import { contour } from './calc.js';

// Gradient and Hessian (required lab). Contours of f(x, y), the gradient at
// a point (perpendicular to the contour through it), a chosen direction u
// with its directional derivative ∇f·u, and the Hessian with the
// second-derivative test.

const FUNCS = {
  hill: { label: '9 − x² − 2y²', f: (x, y) => 9 - x * x - 2 * y * y, g: (x, y) => [-2 * x, -4 * y], H: () => [-2, 0, 0, -4], levels: [-9, -5, -2, 0, 2, 4, 6, 8] },
  bowl: { label: 'x² + 3y²', f: (x, y) => x * x + 3 * y * y, g: (x, y) => [2 * x, 6 * y], H: () => [2, 0, 0, 6], levels: [0.5, 1, 2, 4, 6, 9, 12] },
  saddle: { label: 'x² − y²', f: (x, y) => x * x - y * y, g: (x, y) => [2 * x, -2 * y], H: () => [2, 0, 0, -2], levels: [-6, -4, -2, -1, 0, 1, 2, 4, 6] },
  mixed: { label: 'x² + xy + y²', f: (x, y) => x * x + x * y + y * y, g: (x, y) => [2 * x + y, x + 2 * y], H: () => [2, 1, 1, 2], levels: [0.5, 1, 2, 4, 6, 9] },
};

const PRESETS = [
  { id: 'hill', label: 'Hill at (1, 1)', fn: 'hill', p: [1, 1], deg: 0 },
  { id: 'bowl', label: 'Bowl at (2, 1)', fn: 'bowl', p: [2, 1], deg: 90 },
  { id: 'saddle', label: 'Saddle at (0, 0)', fn: 'saddle', p: [0, 0], deg: 45 },
  { id: 'mixed', label: 'Tilted bowl', fn: 'mixed', p: [1, -2], deg: 135 },
];

function classify([fxx, fxy, , fyy]) {
  const det = fxx * fyy - fxy * fxy;
  if (det > 0 && fxx > 0) return { det, kind: 'a local minimum (det H > 0, fxx > 0)' };
  if (det > 0 && fxx < 0) return { det, kind: 'a local maximum (det H > 0, fxx < 0)' };
  if (det < 0) return { det, kind: 'a saddle point (det H < 0)' };
  return { det, kind: 'undecided by this test (det H = 0)' };
}

export default function GradientLab() {
  const [s, setS] = useState(PRESETS[0]);
  const [preset, setPreset] = useState('hill');
  const F = FUNCS[s.fn];
  const [x, y] = s.p;
  const g = F.g(x, y);
  const gn = Math.hypot(g[0], g[1]);
  const t = (s.deg * Math.PI) / 180;
  const u = [Math.cos(t), Math.sin(t)];
  const du = g[0] * u[0] + g[1] * u[1];
  const H = F.H(x, y);
  const cls = classify(H);
  const critical = gn < 1e-9;
  const segs = useMemo(() => F.levels.map((L) => contour(F.f, [-3, 3], [-3, 3], L, 56)), [F]);
  const set = (patch) => { setPreset(null); setS((o) => ({ ...o, ...patch })); };

  const readout = `f(x, y) = ${F.label} at (${fmt(x, 2)}, ${fmt(y, 2)}): f = ${fmt(F.f(x, y), 3)}. `
    + (critical
      ? `∇f = (0, 0): a critical point. The Hessian [[${fmt(H[0])}, ${fmt(H[1])}], [${fmt(H[2])}, ${fmt(H[3])}]] makes it ${cls.kind}.`
      : `∇f = (${fmt(g[0], 3)}, ${fmt(g[1], 3)}), length ${fmt(gn, 3)}: the steepest climb rate. In your direction u = (${fmt(u[0], 3)}, ${fmt(u[1], 3)}), D_u f = ∇f·u = ${fmt(du, 3)}${Math.abs(du) < 0.05 ? ' — about zero: you are walking along a contour' : ''}.`);

  return (
    <LabFrame
      title="Gradient, directional derivative and Hessian"
      intro="The gradient arrow is always perpendicular to the contour through the point. Turn your direction u and compare ∇f·u with the gradient’s length."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setS(PRESETS.find((p) => p.id === id)); }}
      onReset={() => { setPreset('hill'); setS(PRESETS[0]); }}
      figure={(
        <Plot x={[-3, 3]} y={[-3, 3]} square xLabel="x" yLabel="y">
          {({ sx, sy }) => {
            const k = 0.35;
            return (
              <g>
                {segs.map((level, i) => level.map(([a, b, c, d], j) => (
                  <line key={`${i}-${j}`} stroke="rgba(var(--overlay-rgb), 0.3)" strokeWidth="1.2" x1={sx(a)} y1={sy(b)} x2={sx(c)} y2={sy(d)} />
                )))}
                {!critical && <line className="lab-curve" x1={sx(x)} y1={sy(y)} x2={sx(x + k * g[0])} y2={sy(y + k * g[1])} />}
                <line className="lab-curve-2" x1={sx(x)} y1={sy(y)} x2={sx(x + u[0])} y2={sy(y + u[1])} />
                <circle className="lab-point" cx={sx(x)} cy={sy(y)} r={6} />
                {!critical && <text className="lab-label" x={sx(x + k * g[0]) + 6} y={sy(y + k * g[1])}>∇f</text>}
                <text className="lab-label" x={sx(x + u[0]) + 6} y={sy(y + u[1]) + 4}>u</text>
              </g>
            );
          }}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <div className="studio-row" role="group" aria-label="Function">
            {Object.entries(FUNCS).map(([id, fx]) => (
              <button key={id} type="button" className="lab-chip" aria-pressed={s.fn === id} onClick={() => set({ fn: id })}>{fx.label}</button>
            ))}
          </div>
          <Slider label="x" value={x} min={-2.5} max={2.5} step={0.25} onChange={(v) => set({ p: [v, y] })} />
          <Slider label="y" value={y} min={-2.5} max={2.5} step={0.25} onChange={(v) => set({ p: [x, v] })} />
          <Slider label="Direction of u (degrees)" value={s.deg} min={0} max={359} step={1} format={(v) => `${fmt(v, 0)}°`} onChange={(v) => set({ deg: v })} />
          <dl className="lab-stat">
            <dt>∇f</dt><dd>({fmt(g[0], 3)}, {fmt(g[1], 3)})</dd>
            <dt>|∇f|</dt><dd>{fmt(gn, 3)}</dd>
            <dt>D_u f</dt><dd>{fmt(du, 3)}</dd>
            <dt>Hessian</dt><dd>[[{fmt(H[0])}, {fmt(H[1])}], [{fmt(H[2])}, {fmt(H[3])}]]</dd>
          </dl>
        </>
      )}
      table={{
        caption: 'Directional derivative in eight directions',
        columns: ['Direction', 'u', 'D_u f = ∇f·u'],
        rows: [0, 45, 90, 135, 180, 225, 270, 315].map((dd) => {
          const r = (dd * Math.PI) / 180;
          const w = [Math.cos(r), Math.sin(r)];
          return [`${dd}°`, `(${fmt(w[0], 3)}, ${fmt(w[1], 3)})`, fmt(g[0] * w[0] + g[1] * w[1], 4)];
        }),
      }}
      annotations={['No direction beats |∇f|: by the dot product, ∇f·u = |∇f| cos θ ≤ |∇f|.', 'Along a contour f does not change, so ∇f·u = 0 there: the gradient is perpendicular to contours.']}
      constraints={['Quadratic functions only, so the Hessian is the same everywhere.', 'The gradient arrow is drawn at 0.35× scale to fit.']}
    />
  );
}
