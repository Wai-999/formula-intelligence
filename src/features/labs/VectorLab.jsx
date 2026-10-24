import { useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt, dragHandler } from './plot.js';

// Vector addition, the dot product and projection (required lab
// "vector addition/dot product"). mode 'dot': u, v, u + v and the angle.
// mode 'projection': the projection of u onto the line along v and the
// orthogonal remainder, with the right angle marked.

const DOT_PRESETS = [
  { id: 'taste', label: 'Similar tastes', u: [4, 1], v: [3, 2] },
  { id: 'perp', label: 'Perpendicular', u: [2, -3], v: [3, 2] },
  { id: 'obtuse', label: 'Opposed', u: [3, 1], v: [-2, 1] },
];
const PROJ_PRESETS = [
  { id: 'runway', label: 'Wind on a runway', u: [2, 3], v: [4, 1] },
  { id: 'shadow', label: 'Shadow on the ground', u: [3, 4], v: [1, 0] },
  { id: 'behind', label: 'Pointing backwards', u: [-3, 1], v: [2, 1] },
];

const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = (a) => Math.hypot(a[0], a[1]);

function Arrow({ from = [0, 0], to, sx, sy, cls, color, label }) {
  const x1 = sx(from[0]);
  const y1 = sy(from[1]);
  const x2 = sx(to[0]);
  const y2 = sy(to[1]);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = 10;
  const tip = `${x2},${y2} ${x2 - h * Math.cos(ang - 0.4)},${y2 - h * Math.sin(ang - 0.4)} ${x2 - h * Math.cos(ang + 0.4)},${y2 - h * Math.sin(ang + 0.4)}`;
  return (
    <g style={{ color }}>
      <line className={cls} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" />
      <polygon points={tip} fill="currentColor" />
      {label && <text className="lab-label" x={x2 + 6} y={y2 - 6}>{label}</text>}
    </g>
  );
}

export default function VectorLab({ mode = 'dot' }) {
  const presets = mode === 'projection' ? PROJ_PRESETS : DOT_PRESETS;
  const [state, setState] = useState(presets[0]);
  const [preset, setPreset] = useState(presets[0].id);
  const { u, v } = state;
  const set = (which, i, val) => { setPreset(null); setState((s) => ({ ...s, [which]: s[which].map((c, j) => (j === i ? val : c)) })); };
  const snap = (val) => Math.max(-5, Math.min(5, Math.round(val * 2) / 2));
  const d = dot(u, v);
  const nu = len(u);
  const nv = len(v);
  const zero = nu === 0 || nv === 0;
  const cos = zero ? NaN : d / (nu * nv);
  const angle = zero ? NaN : (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
  const c = nv === 0 ? NaN : d / (nv * nv);
  const p = [c * v[0], c * v[1]];
  const r = [u[0] - p[0], u[1] - p[1]];
  const sum = [u[0] + v[0], u[1] + v[1]];

  const kind = zero ? 'undefined (a zero vector has no direction)' : Math.abs(d) < 1e-9 ? 'a right angle' : d > 0 ? 'acute' : 'obtuse';
  const readout = mode === 'projection'
    ? (nv === 0
      ? 'v is the zero vector: there is no line to project onto, so the projection is undefined.'
      : `u = (${fmt(u[0])}, ${fmt(u[1])}), v = (${fmt(v[0])}, ${fmt(v[1])}). u·v = ${fmt(d)} and v·v = ${fmt(nv * nv)}, so c = ${fmt(c, 4)}. Projection p = c·v = (${fmt(p[0], 3)}, ${fmt(p[1], 3)}); remainder u − p = (${fmt(r[0], 3)}, ${fmt(r[1], 3)}), and (u − p)·v = ${fmt(dot(r, v), 6)}: perpendicular.`)
    : `u = (${fmt(u[0])}, ${fmt(u[1])}), v = (${fmt(v[0])}, ${fmt(v[1])}). u + v = (${fmt(sum[0])}, ${fmt(sum[1])}). u·v = ${fmt(u[0])}·${fmt(v[0])} + ${fmt(u[1])}·${fmt(v[1])} = ${fmt(d)}. |u| = ${fmt(nu, 3)}, |v| = ${fmt(nv, 3)}; the angle is ${zero ? 'undefined' : `${fmt(angle, 1)}°`}: ${kind}.`;

  const drag = (which) => (sx, sy) => dragHandler((pt) => { set(which, 0, snap(sx.invert(pt.x))); set(which, 1, snap(sy.invert(pt.y))); });

  return (
    <LabFrame
      title={mode === 'projection' ? 'Projection onto a vector' : 'Vectors and the dot product'}
      intro={mode === 'projection'
        ? 'The projection p is the point on the line through v that is closest to u. The remainder u − p always meets that line at a right angle.'
        : 'Drag the tips of u and v. The dot product is positive when they point roughly the same way, zero at a right angle, negative when they oppose.'}
      presets={presets}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setState(presets.find((x) => x.id === id)); }}
      onReset={() => { setPreset(presets[0].id); setState(presets[0]); }}
      figure={(
        <Plot x={[-6, 7]} y={[-5, 6]} square>
          {({ sx, sy }) => (
            <g>
              {mode === 'dot' ? (
                <g>
                  <line className="lab-ghost" x1={sx(u[0])} y1={sy(u[1])} x2={sx(sum[0])} y2={sy(sum[1])} />
                  <line className="lab-ghost" x1={sx(v[0])} y1={sy(v[1])} x2={sx(sum[0])} y2={sy(sum[1])} />
                  <Arrow to={sum} sx={sx} sy={sy} cls="lab-vector" color="var(--warning)" label="u + v" />
                </g>
              ) : nv > 0 && (
                <g>
                  <line className="lab-ghost" x1={sx(-6 * v[0] / nv)} y1={sy(-6 * v[1] / nv)} x2={sx(8 * v[0] / nv)} y2={sy(8 * v[1] / nv)} />
                  <Arrow to={p} sx={sx} sy={sy} cls="lab-vector" color="var(--warning)" label="p" />
                  <Arrow from={p} to={u} sx={sx} sy={sy} cls="lab-vector" color="var(--danger)" label="u − p" />
                </g>
              )}
              <Arrow to={v} sx={sx} sy={sy} cls="lab-vector" color="var(--accent)" label="v" />
              <Arrow to={u} sx={sx} sy={sy} cls="lab-vector" color="var(--primary-text)" label="u" />
              <circle className="lab-handle" cx={sx(u[0])} cy={sy(u[1])} r={8} onPointerDown={drag('u')(sx, sy)} />
              <circle className="lab-handle" cx={sx(v[0])} cy={sy(v[1])} r={8} onPointerDown={drag('v')(sx, sy)} />
            </g>
          )}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <Slider label="u₁" value={u[0]} min={-5} max={5} step={0.5} onChange={(x) => set('u', 0, x)} />
          <Slider label="u₂" value={u[1]} min={-5} max={5} step={0.5} onChange={(x) => set('u', 1, x)} />
          <Slider label="v₁" value={v[0]} min={-5} max={5} step={0.5} onChange={(x) => set('v', 0, x)} />
          <Slider label="v₂" value={v[1]} min={-5} max={5} step={0.5} onChange={(x) => set('v', 1, x)} />
          <dl className="lab-stat">
            <dt>u·v</dt><dd>{fmt(d)}</dd>
            <dt>|u|, |v|</dt><dd>{fmt(nu, 3)}, {fmt(nv, 3)}</dd>
            <dt>cos θ</dt><dd>{fmt(cos, 4)}</dd>
            {mode === 'projection' && (<><dt>c = u·v / v·v</dt><dd>{fmt(c, 4)}</dd></>)}
          </dl>
        </>
      )}
      table={{
        caption: 'Vectors and derived quantities',
        columns: ['Quantity', 'Value'],
        rows: [
          ['u', `(${fmt(u[0])}, ${fmt(u[1])})`], ['v', `(${fmt(v[0])}, ${fmt(v[1])})`], ['u + v', `(${fmt(sum[0])}, ${fmt(sum[1])})`],
          ['u·v', fmt(d)], ['|u|', fmt(nu, 4)], ['|v|', fmt(nv, 4)], ['angle', zero ? 'undefined' : `${fmt(angle, 2)}°`],
          ...(mode === 'projection' ? [['projection p', `(${fmt(p[0], 4)}, ${fmt(p[1], 4)})`], ['remainder u − p', `(${fmt(r[0], 4)}, ${fmt(r[1], 4)})`]] : []),
        ],
      }}
      annotations={mode === 'projection'
        ? ['Scaling v (say to 2v) does not change p: projection depends only on the line, not on the length of v.', 'When u·v < 0, p points opposite to v.']
        : ['u·v = |u||v|cos θ: the sign of the dot product is the sign of cos θ.', 'u·u = |u|², so the length is the square root of a dot product.']}
      constraints={['Components snap to steps of 0.5 between −5 and 5.', 'The angle is undefined when either vector is zero.']}
    />
  );
}
