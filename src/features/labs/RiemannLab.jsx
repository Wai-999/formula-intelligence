import { useState } from 'react';
import { LabFrame, Slider, Segmented, Plot } from './LabKit.jsx';
import { fmt, pathOf } from './plot.js';
import { riemann } from './calc.js';

// Riemann sums (required lab): left, right, midpoint and trapezoid sums
// against the exact integral, with the error as n grows. Rectangles below
// the axis count negative — this is SIGNED area.

const FUNCS = {
  sq: { label: 'x² on [0, 3]', f: (x) => x * x, a: 0, b: 3, exact: 9, y: [-1, 10] },
  sqrt: { label: '√x on [0, 4]', f: (x) => Math.sqrt(x), a: 0, b: 4, exact: 16 / 3, y: [-0.5, 2.5] },
  drone: { label: '4 − t on [0, 6]', f: (x) => 4 - x, a: 0, b: 6, exact: 6, y: [-3, 5] },
};

const METHODS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'mid', label: 'Midpoint' },
  { value: 'trap', label: 'Trapezoid' },
];

export default function RiemannLab() {
  const [fn, setFn] = useState('sq');
  const [n, setN] = useState(3);
  const [method, setMethod] = useState('right');
  const F = FUNCS[fn];
  const dx = (F.b - F.a) / n;
  const sum = riemann(F.f, F.a, F.b, n, method);
  const err = sum - F.exact;

  const readout = `${METHODS.find((m) => m.value === method).label} sum with n = ${n} (Δx = ${fmt(dx, 4)}) for ${F.label}: ${fmt(sum, 5)}. `
    + `Exact integral ${fmt(F.exact, 5)}; error ${fmt(err, 5)}${Math.abs(err) < 1e-9 ? ' (exact — the shapes fit perfectly)' : ''}.`;

  return (
    <LabFrame
      title="Riemann sums"
      intro="Approximate the area with n strips. Double n and watch the error: left and right sums shrink their error by about half; midpoint and trapezoid by about a quarter."
      presets={Object.entries(FUNCS).map(([id, x]) => ({ id, label: x.label }))}
      activePreset={fn}
      onPreset={(id) => { setFn(id); setN(3); }}
      onReset={() => { setFn('sq'); setN(3); setMethod('right'); }}
      figure={(
        <Plot x={[F.a - 0.3, F.b + 0.3]} y={F.y} xLabel="x" yLabel="f(x)">
          {({ sx, sy }) => (
            <g>
              {Array.from({ length: n }, (_, i) => {
                const x0 = F.a + i * dx;
                const x1 = x0 + dx;
                if (method === 'trap') {
                  const pts = [[x0, 0], [x0, F.f(x0)], [x1, F.f(x1)], [x1, 0]];
                  return <polygon key={i} className="lab-fill" points={pts.map(([p, q]) => `${sx(p)},${sy(q)}`).join(' ')} />;
                }
                const xs = method === 'left' ? x0 : method === 'right' ? x1 : (x0 + x1) / 2;
                const h = F.f(xs);
                return <rect key={i} className={h >= 0 ? 'lab-fill' : 'lab-fill-2'} x={sx(x0)} y={sy(Math.max(h, 0))} width={sx(x1) - sx(x0)} height={Math.abs(sy(h) - sy(0))} />;
              })}
              <path className="lab-curve" d={pathOf(F.f, F.a - 0.3, F.b + 0.3, sx, sy, 300, F.y)} />
            </g>
          )}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <Segmented label="Sample point" value={method} onChange={setMethod} options={METHODS} />
          <Slider label="Number of strips n" value={n} min={1} max={60} step={1} format={(v) => fmt(v, 0)} onChange={setN} />
          <dl className="lab-stat">
            <dt>Sum</dt><dd>{fmt(sum, 5)}</dd>
            <dt>Exact</dt><dd>{fmt(F.exact, 5)}</dd>
            <dt>Error</dt><dd>{fmt(err, 5)}</dd>
          </dl>
        </>
      )}
      table={{
        caption: `Error of each method for ${F.label}`,
        columns: ['n', 'Left', 'Right', 'Midpoint', 'Trapezoid'],
        rows: [3, 6, 12, 24, 48].map((k) => [k, ...['left', 'right', 'mid', 'trap'].map((mth) => fmt(riemann(F.f, F.a, F.b, k, mth) - F.exact, 6))]),
      }}
      annotations={['For an increasing function, left sums underestimate and right sums overestimate.', 'For 4 − t the strips past t = 4 lie below the axis and subtract: the integral is net change, not total distance.']}
      constraints={['n from 1 to 60.', 'Equal-width strips only.']}
    />
  );
}
