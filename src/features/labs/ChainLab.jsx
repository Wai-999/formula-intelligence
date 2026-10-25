import { useState } from 'react';
import { LabFrame, Slider, Segmented, Plot } from './LabKit.jsx';
import { fmt, pathOf } from './plot.js';
import { centralDifference, chainRule, chainMistake, compose } from './bridges.js';

// Composition → chain rule (V5 vertical slice: Algebra II → Calculus I).
// The inner function feeds the outer one; the composite's slope is the outer
// slope read at u = g(x) times the inner slope. The "common mistake" switch
// draws the tangent that f'(x)·g'(x) would predict, so the error is visible.

const PRESETS = [
  {
    id: 'square', label: 'u = 3x + 1, then y = u²', x: 2, xr: [-1, 3], step: 0.1,
    g: (x) => 3 * x + 1, dg: () => 3, f: (u) => u * u, df: (u) => 2 * u,
    names: ['x', 'u', 'y'], gText: 'u = 3x + 1', fText: 'y = u²',
  },
  {
    id: 'root', label: 'u = x² + 9, then y = √u', x: 4, xr: [0, 6], step: 0.1,
    g: (x) => x * x + 9, dg: (x) => 2 * x, f: (u) => Math.sqrt(u), df: (u) => 1 / (2 * Math.sqrt(u)),
    names: ['x', 'u', 'y'], gText: 'u = x² + 9', fText: 'y = √u',
  },
  {
    id: 'balloon', label: 'Balloon: height, then temperature', x: 10, xr: [0, 30], step: 1,
    g: (t) => 4 * t + 0.1 * t * t, dg: (t) => 4 + 0.2 * t, f: (h) => 15 - 0.0065 * h, df: () => -0.0065,
    names: ['t', 'h', 'T'], gText: 'h = 4t + 0.1t² metres', fText: 'T = 15 − 0.0065h °C',
  },
];

/** [min, max] of f over [a, b], padded so curves never touch the frame. */
function rangeOf(f, a, b) {
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i <= 80; i++) {
    const y = f(a + ((b - a) * i) / 80);
    if (Number.isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); }
  }
  const pad = (hi - lo) * 0.12 || 1;
  return [lo - pad, hi + pad];
}

function Tangent({ sx, sy, x, y, slope, span, className }) {
  return <line className={className} x1={sx(x - span)} y1={sy(y - slope * span)} x2={sx(x + span)} y2={sy(y + slope * span)} />;
}

export default function ChainLab() {
  const [preset, setPreset] = useState('square');
  const [p, setP] = useState(PRESETS[0]);
  const [x, setX] = useState(PRESETS[0].x);
  const [rule, setRule] = useState('chain');

  const [xn, un, yn] = p.names;
  const fg = compose(p.f, p.g);
  const u = p.g(x);
  const dgx = p.dg(x);
  const dfu = p.df(u);
  const chain = chainRule(p, x);
  const mistake = chainMistake(p, x);
  const measured = centralDifference(fg, x);

  const [x0, x1] = p.xr;
  const uRange = rangeOf(p.g, x0, x1);
  const yRange = rangeOf(fg, x0, x1);
  const span = (x1 - x0) * 0.22;
  const uSpan = (uRange[1] - uRange[0]) * 0.22;

  const readout = `At ${xn} = ${fmt(x)}: the inner value is ${un} = ${fmt(u)}, changing at ${fmt(dgx)} per unit of ${xn}. `
    + `The outer function changes at ${fmt(dfu, 4)} per unit of ${un}, read at ${un} = ${fmt(u)}. `
    + `Chain rule: ${fmt(dfu, 4)} × ${fmt(dgx)} = ${fmt(chain, 4)}; the measured slope of ${yn}(${xn}) is ${fmt(measured, 4)}.`
    + (rule === 'mistake' ? ` The mistake reads the outer slope at ${xn} = ${fmt(x)} instead and predicts ${fmt(mistake, 4)}${Math.abs(mistake - chain) < 1e-9 ? ' — the same here, because this outer slope is constant' : ', which misses'}.` : '');

  const composite = (
    <Plot x={p.xr} y={yRange} height={260} xLabel={xn} yLabel={`${yn} = f(g(${xn}))`}>
      {({ sx, sy }) => (
        <g>
          <path className="lab-curve" d={pathOf(fg, x0, x1, sx, sy)} />
          <Tangent sx={sx} sy={sy} x={x} y={fg(x)} slope={chain} span={span} className="lab-curve-2" />
          {rule === 'mistake' && Number.isFinite(mistake) && <Tangent sx={sx} sy={sy} x={x} y={fg(x)} slope={mistake} span={span} className="lab-curve-3" />}
          <circle className="lab-point" cx={sx(x)} cy={sy(fg(x))} r="5" />
          <text className="lab-label" x={sx(x) + 8} y={sy(fg(x)) - 10}>slope {fmt(chain, 3)}</text>
        </g>
      )}
    </Plot>
  );

  const inner = (
    <Plot x={p.xr} y={uRange} height={220} xLabel={xn} yLabel={`${un} = g(${xn})`}>
      {({ sx, sy }) => (
        <g>
          <path className="lab-curve" d={pathOf(p.g, x0, x1, sx, sy)} />
          <Tangent sx={sx} sy={sy} x={x} y={u} slope={dgx} span={span} className="lab-curve-2" />
          <circle className="lab-point" cx={sx(x)} cy={sy(u)} r="5" />
          <text className="lab-label" x={sx(x) + 8} y={sy(u) - 10}>g′ = {fmt(dgx, 3)}</text>
        </g>
      )}
    </Plot>
  );

  const outer = (
    <Plot x={uRange} y={yRange} height={220} xLabel={un} yLabel={`${yn} = f(${un})`}>
      {({ sx, sy }) => (
        <g>
          <path className="lab-curve" d={pathOf(p.f, uRange[0], uRange[1], sx, sy)} />
          <Tangent sx={sx} sy={sy} x={u} y={p.f(u)} slope={dfu} span={uSpan} className="lab-curve-2" />
          <circle className="lab-point" cx={sx(u)} cy={sy(p.f(u))} r="5" />
          <text className="lab-label" x={sx(u) + 8} y={sy(p.f(u)) - 10}>f′ = {fmt(dfu, 4)}</text>
        </g>
      )}
    </Plot>
  );

  const figure = (
    <div className="chain-figs">
      <div className="chain-main">{composite}</div>
      <div>{inner}</div>
      <div>{outer}</div>
    </div>
  );

  const rows = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const xi = x0 + (x1 - x0) * t;
    return [fmt(xi), fmt(p.g(xi), 3), fmt(p.dg(xi), 4), fmt(p.df(p.g(xi)), 4), fmt(chainRule(p, xi), 4), fmt(centralDifference(fg, xi), 4)];
  });

  return (
    <LabFrame
      title="Composition and the chain rule"
      intro={`Top: the composite ${yn} = f(g(${xn})). Below: the inner function ${p.gText} and the outer function ${p.fText}, each with its tangent. Move ${xn} and compare the slopes.`}
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { const n = PRESETS.find((q) => q.id === id); setPreset(id); setP(n); setX(n.x); }}
      onReset={() => { setPreset('square'); setP(PRESETS[0]); setX(PRESETS[0].x); setRule('chain'); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <Slider label={`Input ${xn}`} value={x} min={x0} max={x1} step={p.step} format={(v) => fmt(v, 2)} onChange={setX} />
          <Segmented
            label="Outer slope read at"
            options={[{ value: 'chain', label: `${un} = g(${xn}) (chain rule)` }, { value: 'mistake', label: `${xn} (common mistake)` }]}
            value={rule}
            onChange={setRule}
          />
          <dl className="lab-stat">
            <dt>Inner slope g′({fmt(x)})</dt><dd>{fmt(dgx, 4)}</dd>
            <dt>Outer slope f′({fmt(u)})</dt><dd>{fmt(dfu, 4)}</dd>
            <dt>Product</dt><dd>{fmt(chain, 4)}</dd>
            <dt>Measured slope</dt><dd>{fmt(measured, 4)}</dd>
          </dl>
        </>
      )}
      table={{
        caption: `Chain rule against the measured slope of ${yn}(${xn})`,
        columns: [xn, `${un} = g(${xn})`, `g′(${xn})`, `f′(g(${xn}))`, 'Product', 'Measured slope'],
        rows,
      }}
      annotations={[
        'The product of the two slopes always equals the measured slope of the composite.',
        'Reading the outer slope at x instead of at u = g(x) gives the wrong tangent — unless the outer slope is the same everywhere, as for the balloon.',
        'Units multiply too: (°C per metre) × (metres per second) = °C per second.',
      ]}
      constraints={[
        'The measured slope is a central difference with h = 0.000001, accurate to many decimals here but still a numerical estimate.',
        'The balloon’s height curve and the 0.0065 °C per metre lapse rate are illustrative; real air temperature profiles vary.',
      ]}
    />
  );
}
