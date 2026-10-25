import { useState } from 'react';
import { LabFrame, Segmented, Plot } from './LabKit.jsx';
import { fmt, pathOf } from './plot.js';
import { approach, limitVerdict } from './bridges.js';

// Limits from the numerical and graphical views (V5 vertical slice:
// Precalculus → Calculus I). Readings at a − h and a + h close in on a; the
// value at a itself is never used. Each preset is one kind of behaviour a
// learner must tell apart: a hole, a jump, 0/0 with a finite limit, blow-up,
// and a continuous corner.

const STEPS = [1, 0.5, 0.1, 0.01, 0.001];

const LIMIT_PRESETS = [
  {
    id: 'hole', label: 'Hole: (x² − 4)/(x − 2)', a: 2, xr: [0, 4], yr: [0, 7], v: 'x',
    f: (x) => (x * x - 4) / (x - 2), pieces: [[0, 4]],
    dots: [{ x: 2, y: 4, open: true }],
    at: 'f(2) is undefined (0/0)', kind: 'agree', limit: 4,
    conclusion: 'Both sides approach 4, so the limit is 4 — even though f(2) is undefined. The gap is a removable hole.',
  },
  {
    id: 'jump', label: 'Jump: courier price', a: 2, xr: [0, 4], yr: [0, 12], v: 'w',
    f: (w) => (w <= 2 ? 5 : 9), pieces: [[0, 2], [2 + 1e-9, 4]],
    dots: [{ x: 2, y: 5, open: false }, { x: 2, y: 9, open: true }],
    at: 'p(2) = $5', kind: 'jump',
    conclusion: 'The left side stays at $5 and the right side at $9: the one-sided limits differ, so the limit does not exist.',
  },
  {
    id: 'sinc', label: '0/0 again: sin(x)/x', a: 0, xr: [-8, 8], yr: [-0.5, 1.4], v: 'x',
    f: (x) => Math.sin(x) / x, pieces: [[-8, 8]],
    dots: [{ x: 0, y: 1, open: true }],
    at: 'f(0) is undefined (0/0)', kind: 'agree', limit: 1,
    conclusion: 'Both sides approach 1, so the limit is 1 (x in radians). This limit is why the derivative of sin x is cos x.',
  },
  {
    id: 'blowup', label: 'Blow-up: 1/(x − 1)²', a: 1, xr: [-1, 3], yr: [0, 30], v: 'x',
    f: (x) => 1 / ((x - 1) * (x - 1)), pieces: [[-1, 3]],
    dots: [],
    at: 'f(1) is undefined (division by 0)', kind: 'unbounded',
    conclusion: 'Both sides grow without bound: there is no finite limit. Writing lim = ∞ describes how the limit fails.',
  },
  {
    id: 'corner', label: 'Corner: data plan', a: 5, xr: [0, 10], yr: [0, 75], v: 'm',
    f: (m) => (m <= 5 ? 20 : 20 + 10 * (m - 5)), pieces: [[0, 10]],
    dots: [{ x: 5, y: 20, open: false }],
    at: 'c(5) = $20', kind: 'agree', limit: 20,
    conclusion: 'Both sides approach $20 and c(5) = $20: the cost is continuous at 5 GB — it bends, but it does not jump.',
  },
];

export default function LimitLab() {
  const [id, setId] = useState('hole');
  const [h, setH] = useState(0.5);
  const p = LIMIT_PRESETS.find((q) => q.id === id);
  const { a, v } = p;

  const left = p.f(a - h);
  const right = p.f(a + h);
  const close = h <= 0.01;
  const verdict = limitVerdict(p.f, a, h);
  const [y0, y1] = p.yr;
  const inView = (y) => Number.isFinite(y) && y >= y0 && y <= y1;

  const readout = `At ${v} = ${fmt(a)}: ${p.at}. From the left, f(${fmt(a - h, 3)}) = ${fmt(left, 6)}; from the right, f(${fmt(a + h, 3)}) = ${fmt(right, 6)}. `
    + (close ? p.conclusion : 'Still far from the point — shrink h to see where the readings settle.');

  const figure = (
    <Plot x={p.xr} y={p.yr} xLabel={v} yLabel={`f(${v})`}>
      {({ sx, sy }) => (
        <g>
          <line className="lab-ghost" x1={sx(a)} x2={sx(a)} y1={sy(y0)} y2={sy(y1)} />
          {p.pieces.map(([s, e]) => <path key={s} className="lab-curve" d={pathOf(p.f, s, e, sx, sy, 240, p.yr)} />)}
          {p.dots.map((d) => <circle key={`${d.x},${d.y}`} className={d.open ? 'lab-open' : 'lab-point'} cx={sx(d.x)} cy={sy(d.y)} r="5" />)}
          {inView(left) && <circle className="lab-point-2" cx={sx(a - h)} cy={sy(left)} r="5" />}
          {inView(right) && <rect className="lab-point-2" x={sx(a + h) - 5} y={sy(right) - 5} width="10" height="10" />}
          <text className="lab-label-muted" x={sx(a) + 6} y={sy(y1) + 14}>{v} = {fmt(a)}</text>
        </g>
      )}
    </Plot>
  );

  const lefts = approach(p.f, a, -1, STEPS);
  const rights = approach(p.f, a, 1, STEPS);

  return (
    <LabFrame
      title="Limits: approaching from both sides"
      intro="The dashed line marks the point a. The circle is a reading from the left, the square a reading from the right, each a distance h away. A limit asks where these readings settle as h shrinks — the value at a itself is never used."
      presets={LIMIT_PRESETS}
      activePreset={id}
      onPreset={setId}
      onReset={() => { setId('hole'); setH(0.5); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <Segmented label="Distance h from a" options={STEPS.map((s) => ({ value: s, label: String(s) }))} value={h} onChange={setH} />
          <dl className="lab-stat">
            <dt>From the left</dt><dd>{fmt(left, 6)}</dd>
            <dt>From the right</dt><dd>{fmt(right, 6)}</dd>
            <dt>Gap between sides</dt><dd>{fmt(Math.abs(right - left), 6)}</dd>
            <dt>Reading at h = {fmt(h, 3)}</dt><dd>{close ? { agree: 'sides agree', jump: 'sides disagree', unbounded: 'growing without bound' }[verdict.kind] : 'too far to tell'}</dd>
          </dl>
        </>
      )}
      table={{
        caption: `Readings of f(${v}) near ${v} = ${fmt(a)}`,
        columns: ['Distance h', `f(a − h), left`, `f(a + h), right`],
        rows: STEPS.map((s, i) => [s, fmt(lefts[i].y, 6), fmt(rights[i].y, 6)]),
      }}
      annotations={[
        'A limit can exist where the function does not (the hole), and fail where the function does (the jump).',
        'Continuous means the limit exists and equals the value at the point — the corner passes, the jump does not.',
        '0/0 is a signal to simplify, not an answer: the hole gives 4 and sin(x)/x gives 1.',
      ]}
      constraints={[
        'A table of readings suggests a limit; it does not prove one. Algebra (factoring, cancelling) or a theorem does.',
        'Floating-point arithmetic loses digits very close to a 0/0 point, so the lab stops at h = 0.001.',
      ]}
    />
  );
}
