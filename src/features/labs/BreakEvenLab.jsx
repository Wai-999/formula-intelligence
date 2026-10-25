import { useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt } from './plot.js';
import { breakEven, profitAt } from './business.js';

// Break-even (V4 exemplar: linear equation → restaurant break-even).
// Revenue pq and total cost F + vq are two lines; break-even is where they
// cross, q* = F / (p − v). The gap between them is profit (above) or loss.

const PRESETS = [
  { id: 'restaurant', label: 'Restaurant', F: 1200, p: 18, v: 10 },
  { id: 'truck', label: 'Food truck', F: 500, p: 12, v: 5 },
  { id: 'loss', label: 'Price below cost', F: 1200, p: 9, v: 10 },
];

const money = (x) => `${x < 0 ? '−' : ''}$${Math.abs(x).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function BreakEvenLab({ preset: start = 'restaurant' }) {
  const first = PRESETS.find((p) => p.id === start) ?? PRESETS[0];
  const [s, setS] = useState(first);
  const [q, setQ] = useState(200);
  const [preset, setPreset] = useState(first.id);
  const set = (k, v) => { setPreset(null); setS((o) => ({ ...o, [k]: v })); };

  const qStar = breakEven(s);
  const qMax = 400;
  const yMax = Math.max(s.p * qMax, s.F + s.v * qMax) * 1.05;
  const profit = profitAt(s, q);

  const readout = (Number.isFinite(qStar)
    ? `Each order contributes ${money(s.p - s.v)} toward ${money(s.F)} of fixed costs, so break-even is ${money(s.F)} ÷ ${money(s.p - s.v)} = ${fmt(qStar, 1)} orders (${Math.ceil(qStar)} in whole orders). `
    : `Price (${money(s.p)}) does not exceed the cost of an order (${money(s.v)}): every order adds to the loss, so no number of orders breaks even. `)
    + `At ${q} orders profit is ${money(profit)}.`;

  const figure = (
    <Plot x={[0, qMax]} y={[0, yMax]} xLabel="orders per day" yLabel="$">
      {({ sx, sy }) => (
        <g>
          {/* Profit (or loss) at the chosen q: the vertical gap between the lines. */}
          <line className={profit >= 0 ? 'lab-curve-2' : 'lab-residual'} x1={sx(q)} x2={sx(q)} y1={sy(s.p * q)} y2={sy(s.F + s.v * q)} strokeWidth="3" />
          <line className="lab-curve" x1={sx(0)} y1={sy(0)} x2={sx(qMax)} y2={sy(s.p * qMax)} />
          <line className="lab-curve-3" x1={sx(0)} y1={sy(s.F)} x2={sx(qMax)} y2={sy(s.F + s.v * qMax)} />
          <text className="lab-label" x={sx(qMax) - 4} y={sy(s.p * qMax) + 14} textAnchor="end">revenue</text>
          <text className="lab-label-muted" x={sx(qMax) - 4} y={sy(s.F + s.v * qMax) - 6} textAnchor="end">total cost</text>
          {Number.isFinite(qStar) && qStar <= qMax && (
            <g>
              <circle className="lab-point" cx={sx(qStar)} cy={sy(s.p * qStar)} r="6" />
              <text className="lab-label" x={sx(qStar) + 8} y={sy(s.p * qStar) - 8}>break-even {fmt(qStar, 1)}</text>
            </g>
          )}
        </g>
      )}
    </Plot>
  );

  return (
    <LabFrame
      title="Break-even: revenue against total cost"
      intro="Revenue rises by the price with each order; total cost starts at the fixed costs and rises by the cost of each order. They cross at break-even."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setS(PRESETS.find((p) => p.id === id)); }}
      onReset={() => { setPreset(first.id); setS(first); setQ(200); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <Slider label="Price per order p" value={s.p} min={4} max={30} step={0.5} format={money} onChange={(v) => set('p', v)} />
          <Slider label="Cost per order v" value={s.v} min={1} max={25} step={0.5} format={money} onChange={(v) => set('v', v)} />
          <Slider label="Fixed costs per day F" value={s.F} min={0} max={3000} step={50} format={money} onChange={(v) => set('F', v)} />
          <Slider label="Orders today q" value={q} min={0} max={qMax} step={5} format={(v) => fmt(v, 0)} onChange={setQ} />
        </>
      )}
      table={{
        caption: 'Revenue, cost and profit at several order counts',
        columns: ['Orders', 'Revenue', 'Total cost', 'Profit'],
        rows: [0, 50, 100, 150, 200, 250, 300].map((n) => [n, money(s.p * n), money(s.F + s.v * n), money(profitAt(s, n))]),
      }}
      annotations={[
        'Doubling fixed costs doubles break-even; halving the margin p − v also doubles it.',
        'Raising the price helps twice over in the model — but in reality it usually sells fewer orders.',
      ]}
      constraints={[
        'A model, not a forecast: constant price, constant cost per order, fixed costs that never step up.',
        'Orders are whole numbers; the break-even point is shown unrounded.',
      ]}
    />
  );
}
