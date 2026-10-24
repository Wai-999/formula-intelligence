import { useState } from 'react';
import { LabFrame, Slider, Segmented, Plot } from './LabKit.jsx';
import { fmt, pathOf } from './plot.js';

// Function transformations (required lab). mode 'line': y = mx + b, the
// slope–intercept view. mode 'general': y = a·f(x − h) + k for a family of
// parent functions, with the parent drawn faintly for comparison.

const FAMILIES = {
  line: { label: 'x', f: (x) => x, tex: 'x' },
  abs: { label: '|x|', f: (x) => Math.abs(x), tex: '|x|' },
  square: { label: 'x²', f: (x) => x * x, tex: 'x²' },
  sqrt: { label: '√x', f: (x) => (x >= 0 ? Math.sqrt(x) : NaN), tex: '√x' },
  exp: { label: '2ˣ', f: (x) => 2 ** x, tex: '2ˣ' },
};

const LINE_PRESETS = [
  { id: 'fare', label: 'Ride fare', v: { m: 2, b: 3 } },
  { id: 'fee', label: 'Higher booking fee', v: { m: 2, b: 5 } },
  { id: 'cheaper', label: 'Cheaper per km', v: { m: 1, b: 3 } },
  { id: 'falling', label: 'Draining', v: { m: -1.5, b: 9 } },
];

const GENERAL_PRESETS = [
  { id: 'right2', label: 'Shift right 2', v: { fam: 'square', a: 1, h: 2, k: 0 } },
  { id: 'reflect', label: 'Reflect', v: { fam: 'abs', a: -1, h: 0, k: 4 } },
  { id: 'stretch', label: 'Stretch ×2', v: { fam: 'sqrt', a: 2, h: -1, k: 0 } },
  { id: 'exp', label: 'Exponential up 1', v: { fam: 'exp', a: 1, h: 0, k: 1 } },
];

const sign = (v) => (v < 0 ? '−' : '+');

function LineLab() {
  const [v, setV] = useState(LINE_PRESETS[0].v);
  const [preset, setPreset] = useState('fare');
  const { m, b } = v;
  const xInt = m !== 0 ? -b / m : null;
  const f = (x) => m * x + b;
  const set = (patch) => { setPreset(null); setV((o) => ({ ...o, ...patch })); };
  const xs = [-2, -1, 0, 1, 2, 3, 4];

  const readout = `y = ${fmt(m, 2)}x ${sign(b)} ${fmt(Math.abs(b), 2)}. It crosses the y-axis at (0, ${fmt(b, 2)}). `
    + (m === 0 ? 'With slope 0 the line is horizontal and never crosses the x-axis unless b = 0. ' : `It crosses the x-axis at (${fmt(xInt, 2)}, 0). `)
    + (m > 0 ? `y rises ${fmt(m, 2)} for each 1 in x.` : m < 0 ? `y falls ${fmt(-m, 2)} for each 1 in x.` : 'y is constant.');

  return (
    <LabFrame
      title="Slope–intercept form"
      intro="Move b and watch the whole line slide without turning. Move m and watch it turn around the point (0, b)."
      presets={LINE_PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setV(LINE_PRESETS.find((p) => p.id === id).v); }}
      onReset={() => { setPreset('fare'); setV(LINE_PRESETS[0].v); }}
      figure={(
        <Plot x={[-6, 7]} y={[-8, 16]}>
          {({ sx, sy }) => (
            <g>
              <path className="lab-ghost" d={pathOf((x) => 2 * x + 3, -6, 7, sx, sy, 2, [-8, 16])} />
              <path className="lab-curve" d={pathOf(f, -6, 7, sx, sy, 2, [-8, 16])} />
              <circle className="lab-point" cx={sx(0)} cy={sy(b)} r={6} />
              <text className="lab-label" x={sx(0) + 10} y={sy(b) - 8}>(0, {fmt(b, 2)})</text>
              {xInt !== null && xInt >= -6 && xInt <= 7 && (
                <g>
                  <circle className="lab-point-2" cx={sx(xInt)} cy={sy(0)} r={5} />
                  <text className="lab-label-muted" x={sx(xInt)} y={sy(0) + 18} textAnchor="middle">x-int {fmt(xInt, 2)}</text>
                </g>
              )}
              <line className="lab-curve-2" x1={sx(0)} y1={sy(b)} x2={sx(1)} y2={sy(b)} />
              <line className="lab-curve-3" x1={sx(1)} y1={sy(b)} x2={sx(1)} y2={sy(b + m)} />
              <text className="lab-label-muted" x={sx(1) + 6} y={(sy(b) + sy(b + m)) / 2 + 4}>m = {fmt(m, 2)}</text>
            </g>
          )}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <Slider label="m (slope)" value={m} min={-4} max={4} step={0.25} onChange={(x) => set({ m: x })} />
          <Slider label="b (y-intercept)" value={b} min={-6} max={12} step={0.5} onChange={(x) => set({ b: x })} />
          <p className="studio-muted">The faint dashed line is the starting example, y = 2x + 3, for comparison.</p>
        </>
      )}
      table={{ caption: `Values of y = ${fmt(m, 2)}x ${sign(b)} ${fmt(Math.abs(b), 2)}`, columns: ['x', 'y'], rows: xs.map((x) => [fmt(x), fmt(f(x), 3)]) }}
      annotations={['Each step of 1 in x adds m to y — read the table down the y column.', 'Changing b moves every point by the same amount, so the new line is parallel to the old one.']}
      constraints={['m from −4 to 4 and b from −6 to 12, in small steps.', 'Vertical lines (x = c) have no slope and cannot be drawn in this form.']}
    />
  );
}

function GeneralLab() {
  const [v, setV] = useState(GENERAL_PRESETS[0].v);
  const [preset, setPreset] = useState('right2');
  const { fam, a, h, k } = v;
  const F = FAMILIES[fam];
  const g = (x) => a * F.f(x - h) + k;
  const set = (patch) => { setPreset(null); setV((o) => ({ ...o, ...patch })); };
  const desc = [];
  if (h !== 0) desc.push(`shifted ${h > 0 ? 'right' : 'left'} ${fmt(Math.abs(h), 2)}`);
  if (a < 0) desc.push('reflected in the x-axis');
  if (Math.abs(a) !== 1) desc.push(`scaled vertically by a factor of ${fmt(Math.abs(a), 2)}`);
  if (k !== 0) desc.push(`shifted ${k > 0 ? 'up' : 'down'} ${fmt(Math.abs(k), 2)}`);
  const xs = [-2, -1, 0, 1, 2, 3, 4];

  return (
    <LabFrame
      title="Transformations of a function"
      intro="y = a·f(x − h) + k. Predict where the graph will go before you move a slider: note that x − h with h = 2 moves the graph RIGHT."
      presets={GENERAL_PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setV(GENERAL_PRESETS.find((p) => p.id === id).v); }}
      onReset={() => { setPreset('right2'); setV(GENERAL_PRESETS[0].v); }}
      figure={(
        <Plot x={[-6, 6]} y={[-6, 9]}>
          {({ sx, sy }) => (
            <g>
              <path className="lab-ghost" d={pathOf(F.f, -6, 6, sx, sy, 300, [-6.5, 9.5])} />
              <path className="lab-curve" d={pathOf(g, -6, 6, sx, sy, 300, [-6.5, 9.5])} />
              <text className="lab-label" x={sx(-5.7)} y={sy(8.2)}>y = {fmt(a, 2)}·f(x {sign(-h)} {fmt(Math.abs(h), 2)}) {sign(k)} {fmt(Math.abs(k), 2)}</text>
            </g>
          )}
        </Plot>
      )}
      readout={`The graph of ${F.label} ${desc.length ? desc.join(', ') : 'unchanged'}.`}
      controls={(
        <>
          <Segmented label="Parent function f" value={fam} onChange={(x) => set({ fam: x })} options={Object.entries(FAMILIES).map(([value, x]) => ({ value, label: x.label }))} />
          <Slider label="a (stretch / reflect)" value={a} min={-3} max={3} step={0.25} onChange={(x) => set({ a: x })} />
          <Slider label="h (horizontal shift)" value={h} min={-4} max={4} step={0.5} onChange={(x) => set({ h: x })} />
          <Slider label="k (vertical shift)" value={k} min={-4} max={6} step={0.5} onChange={(x) => set({ k: x })} />
        </>
      )}
      table={{ caption: `f(x) = ${F.label} and its transformation`, columns: ['x', 'f(x)', 'a·f(x − h) + k'], rows: xs.map((x) => [fmt(x), fmt(F.f(x), 3), fmt(g(x), 3)]) }}
      annotations={['Changes inside the function (h) act on x and feel “backwards”; changes outside (a, k) act on y directly.', 'a = 0 flattens every family to the constant line y = k.']}
      constraints={['√x is undefined for x < h; that part of the graph is simply absent.']}
    />
  );
}

export default function TransformLab({ mode = 'line' }) {
  return mode === 'general' ? <GeneralLab /> : <LineLab />;
}
