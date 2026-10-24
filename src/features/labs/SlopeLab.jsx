import { useState } from 'react';
import { LabFrame, Slider, Segmented, Plot } from './LabKit.jsx';
import { fmt, pathOf, dragHandler } from './plot.js';

// Slope and derivative lab (required labs: "slope/derivative").
// mode 'points': slope between two points, with rise and run drawn.
// mode 'secant': the secant through (a, f(a)) and (a+h, f(a+h)) closing in
// on the tangent as h → 0 — including |x| at 0, where it never does.

const POINT_PRESETS = [
  { id: 'taxi', label: 'Ride fare', p: [2, 7, 6, 15] },
  { id: 'falling', label: 'Falling', p: [-3, 4, 3, -2] },
  { id: 'flat', label: 'Flat', p: [-4, 2, 3, 2] },
  { id: 'vertical', label: 'Vertical', p: [2, -3, 2, 5] },
];

const FUNCTIONS = {
  square: { label: 'x²', f: (x) => x * x, df: (x) => 2 * x, tex: 'x^2' },
  cube: { label: 'x³ − 2x', f: (x) => x ** 3 - 2 * x, df: (x) => 3 * x * x - 2, tex: 'x^3-2x' },
  abs: { label: '|x|', f: (x) => Math.abs(x), df: (x) => (x > 0 ? 1 : x < 0 ? -1 : NaN), tex: '|x|' },
};

const SECANT_PRESETS = [
  { id: 'sq3', label: 'x² at a = 1.5', fn: 'square', a: 1.5, h: 1 },
  { id: 'cube', label: 'x³ − 2x at a = 1', fn: 'cube', a: 1, h: 0.8 },
  { id: 'abs0', label: '|x| at a = 0 (corner)', fn: 'abs', a: 0, h: 1 },
];

function PointsLab() {
  const [p, setP] = useState(POINT_PRESETS[0].p);
  const [preset, setPreset] = useState('taxi');
  const [x1, y1, x2, y2] = p;
  const rise = y2 - y1;
  const run = x2 - x1;
  const vertical = Math.abs(run) < 1e-9;
  const m = vertical ? NaN : rise / run;
  const set = (i, v) => { setPreset(null); setP((q) => q.map((old, j) => (j === i ? v : old))); };
  const snap = (v, hi = 7) => Math.max(-6, Math.min(hi, Math.round(v * 2) / 2));

  const readout = vertical
    ? `Both points have x = ${fmt(x1)}. The run is 0, so the slope is undefined: a vertical line has no "per unit of x" rate.`
    : `From (${fmt(x1)}, ${fmt(y1)}) to (${fmt(x2)}, ${fmt(y2)}): rise ${fmt(rise)}, run ${fmt(run)}, slope m = ${fmt(rise)} ÷ ${fmt(run)} = ${fmt(m)}. ${m > 0 ? 'y increases' : m < 0 ? 'y decreases' : 'y stays the same'} as x increases.`;

  const figure = (
    <Plot x={[-6, 7]} y={[-6, 16]} xLabel="x" yLabel="y">
      {({ sx, sy }) => {
        const line = vertical
          ? <line className="lab-curve" x1={sx(x1)} x2={sx(x1)} y1={sy(-6)} y2={sy(16)} />
          : <path className="lab-curve" d={pathOf((x) => y1 + m * (x - x1), -6, 7, sx, sy, 2, [-6, 16])} />;
        const drag = (i) => dragHandler((pt) => { set(i, snap(sx.invert(pt.x))); set(i + 1, snap(sy.invert(pt.y), 16)); });
        return (
          <g>
            {line}
            {!vertical && (
              <g>
                <line className="lab-curve-2" x1={sx(x1)} y1={sy(y1)} x2={sx(x2)} y2={sy(y1)} />
                <line className="lab-curve-3" x1={sx(x2)} y1={sy(y1)} x2={sx(x2)} y2={sy(y2)} />
                <text className="lab-label-muted" x={(sx(x1) + sx(x2)) / 2} y={sy(y1) + (rise >= 0 ? 16 : -8)} textAnchor="middle">run = {fmt(run)}</text>
                <text className="lab-label-muted" x={sx(x2) + 6} y={(sy(y1) + sy(y2)) / 2}>rise = {fmt(rise)}</text>
              </g>
            )}
            <circle className="lab-handle" cx={sx(x1)} cy={sy(y1)} r={8} onPointerDown={drag(0)} />
            <circle className="lab-handle" cx={sx(x2)} cy={sy(y2)} r={8} onPointerDown={drag(2)} />
            <text className="lab-label" x={sx(x1) - 10} y={sy(y1) - 12} textAnchor="end">P₁</text>
            <text className="lab-label" x={sx(x2) + 10} y={sy(y2) - 12}>P₂</text>
            <text className="lab-label" x={sx(-5.6)} y={sy(14.5)}>{vertical ? 'slope undefined' : `m = ${fmt(m)}`}</text>
          </g>
        );
      }}
    </Plot>
  );

  return (
    <LabFrame
      title="Slope between two points"
      intro="Drag the points, or use the sliders. Watch how the rise and run change — and what happens when the run is zero."
      presets={POINT_PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setP(POINT_PRESETS.find((x) => x.id === id).p); }}
      onReset={() => { setPreset('taxi'); setP(POINT_PRESETS[0].p); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <Slider label="x₁" value={x1} min={-6} max={7} step={0.5} onChange={(v) => set(0, v)} />
          <Slider label="y₁" value={y1} min={-6} max={16} step={0.5} onChange={(v) => set(1, v)} />
          <Slider label="x₂" value={x2} min={-6} max={7} step={0.5} onChange={(v) => set(2, v)} />
          <Slider label="y₂" value={y2} min={-6} max={16} step={0.5} onChange={(v) => set(3, v)} />
          <dl className="lab-stat">
            <dt>Rise (y₂ − y₁)</dt><dd>{fmt(rise)}</dd>
            <dt>Run (x₂ − x₁)</dt><dd>{fmt(run)}</dd>
            <dt>Slope m</dt><dd>{vertical ? 'undefined' : fmt(m)}</dd>
          </dl>
        </>
      )}
      table={{
        caption: 'The two points and the slope between them',
        columns: ['Quantity', 'Value'],
        rows: [['P₁', `(${fmt(x1)}, ${fmt(y1)})`], ['P₂', `(${fmt(x2)}, ${fmt(y2)})`], ['Rise', fmt(rise)], ['Run', fmt(run)], ['Slope', vertical ? 'undefined' : fmt(m)]],
      }}
      annotations={['Swapping P₁ and P₂ changes the sign of both rise and run, so the slope is unchanged.', 'Any two points on the same line give the same slope — that is what makes it a line.']}
      constraints={['Points snap to a 0.5 grid: x from −6 to 7, y from −6 to 16.', 'Slope is undefined when x₁ = x₂; the lab draws the vertical line instead.']}
    />
  );
}

function SecantLab() {
  const [fn, setFn] = useState('square');
  const [a, setA] = useState(1.5);
  const [h, setH] = useState(1);
  const [preset, setPreset] = useState('sq3');
  const F = FUNCTIONS[fn];
  const fa = F.f(a);
  const secant = (F.f(a + h) - fa) / h;
  const tangent = F.df(a);
  const differentiable = Number.isFinite(tangent);
  const hs = [1, 0.5, 0.1, 0.01, 0.001];

  const readout = `${F.label} at a = ${fmt(a)}, h = ${fmt(h)}: secant slope [f(a+h) − f(a)] / h = ${fmt(secant, 4)}. `
    + (differentiable
      ? `The tangent slope f′(a) is ${fmt(tangent, 4)}; the gap is ${fmt(Math.abs(secant - tangent), 4)} and shrinks as h → 0.`
      : `At this corner, h > 0 gives slope +1 and h < 0 gives −1, so the two one-sided limits disagree and f′(0) does not exist.`);

  const figure = (
    <Plot x={[-3, 3]} y={[-3, 6]} xLabel="x" yLabel="f(x)">
      {({ sx, sy }) => (
        <g>
          <path className="lab-curve" d={pathOf(F.f, -3, 3, sx, sy, 240, [-3.5, 6.5])} />
          <path className="lab-curve-2" d={pathOf((x) => fa + secant * (x - a), -3, 3, sx, sy, 2)} />
          {differentiable && <path className="lab-ghost" d={pathOf((x) => fa + tangent * (x - a), -3, 3, sx, sy, 2)} />}
          <circle className="lab-point" cx={sx(a)} cy={sy(fa)} r={6} />
          <circle className="lab-point-2" cx={sx(a + h)} cy={sy(F.f(a + h))} r={6} />
          <text className="lab-label" x={sx(a) - 8} y={sy(fa) + 20} textAnchor="end">a</text>
          <text className="lab-label" x={sx(a + h) + 8} y={sy(F.f(a + h)) - 10}>a + h</text>
          <text className="lab-label" x={sx(-2.8)} y={sy(5.5)}>secant {fmt(secant, 3)}{differentiable ? ` · tangent ${fmt(tangent, 3)}` : ''}</text>
        </g>
      )}
    </Plot>
  );

  return (
    <LabFrame
      title="From secant to tangent"
      intro="The dashed line passes through two points of the curve. Shrink h and watch its slope settle — or, at a corner, refuse to."
      presets={SECANT_PRESETS}
      activePreset={preset}
      onPreset={(id) => { const p = SECANT_PRESETS.find((x) => x.id === id); setPreset(id); setFn(p.fn); setA(p.a); setH(p.h); }}
      onReset={() => { setPreset('sq3'); setFn('square'); setA(1.5); setH(1); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <Segmented label="Function" value={fn} onChange={(v) => { setPreset(null); setFn(v); }} options={Object.entries(FUNCTIONS).map(([value, x]) => ({ value, label: x.label }))} />
          <Slider label="a" value={a} min={-2} max={2} step={0.25} onChange={(v) => { setPreset(null); setA(v); }} />
          <Slider label="h" value={h} min={-1.5} max={1.5} step={0.01} onChange={(v) => { setPreset(null); setH(Math.abs(v) < 0.01 ? (v < 0 ? -0.01 : 0.01) : v); }} hint="h cannot be 0: the difference quotient would divide by zero." />
        </>
      )}
      table={{
        caption: `Difference quotients of ${F.label} at a = ${fmt(a)}`,
        columns: ['h', '[f(a+h) − f(a)] / h', 'with −h'],
        rows: hs.map((x) => [fmt(x, 4), fmt((F.f(a + x) - fa) / x, 6), fmt((F.f(a - x) - fa) / -x, 6)]),
      }}
      annotations={['For x², the secant slope is exactly 2a + h — watch the h term vanish.', 'A derivative exists only when the slopes from both sides approach the same number.']}
      constraints={['|h| is kept at least 0.01 on the slider; the table goes down to 0.001.', 'Floating-point arithmetic limits how small h can usefully get (see the lesson’s Python section).']}
    />
  );
}

export default function SlopeLab({ mode = 'points' }) {
  return mode === 'secant' ? <SecantLab /> : <PointsLab />;
}
