import { useState } from 'react';
import { LabFrame, Slider } from './LabKit.jsx';
import { fmt, linear } from './plot.js';

// Ratios and unit rates: two deals on double number lines. Each deal's line
// is marked at whole units of quantity, so "price for 1 kg" is read off
// directly — the unit rate — and the cheaper deal is the one whose
// 1-unit mark sits further left on the money line.

const PRESETS = [
  { id: 'rice', label: 'Rice packs', a: { price: 5.4, qty: 2 }, b: { price: 12.75, qty: 5 }, unit: 'kg', units: 'kg' },
  { id: 'notebooks', label: 'Notebooks', a: { price: 4.5, qty: 3 }, b: { price: 12.4, qty: 8 }, unit: 'notebook', units: 'notebooks' },
  { id: 'equal', label: 'Same rate', a: { price: 3, qty: 2 }, b: { price: 7.5, qty: 5 }, unit: 'kg', units: 'kg' },
];

const money = (v) => `$${v.toFixed(2)}`;

function DoubleLine({ y, deal, name, maxPrice, unit, units }) {
  const sx = linear(0, Math.max(deal.qty, 1), 50, 390);
  const sp = linear(0, maxPrice, 50, 390);
  const rate = deal.price / deal.qty;
  const marks = Array.from({ length: Math.floor(deal.qty) + 1 }, (_, i) => i);
  return (
    <g>
      <text className="lab-label" x={50} y={y - 30}>{name}: {fmt(deal.qty, 2)} {deal.qty === 1 ? unit : units} for {money(deal.price)}</text>
      <line x1={50} x2={390} y1={y} y2={y} stroke="currentColor" strokeWidth="2" />
      <line x1={50} x2={390} y1={y + 34} y2={y + 34} stroke="currentColor" strokeWidth="2" />
      {marks.map((q) => (
        <g key={q}>
          <line x1={sx(q)} x2={sx(q)} y1={y - 6} y2={y + 6} stroke="currentColor" />
          <text className="lab-label-muted" x={sx(q)} y={y - 9} textAnchor="middle">{q}</text>
          <line x1={sp(q * rate)} x2={sp(q * rate)} y1={y + 28} y2={y + 40} stroke="currentColor" />
          <text className={q === 1 ? 'lab-label' : 'lab-label-muted'} x={sp(q * rate)} y={y + 54} textAnchor="middle">{money(q * rate)}</text>
        </g>
      ))}
      <text className="lab-label-muted" x={398} y={y + 4}>{units}</text>
      <text className="lab-label-muted" x={398} y={y + 38}>$</text>
    </g>
  );
}

export default function RatioLab() {
  const [p, setP] = useState(PRESETS[0]);
  const [preset, setPreset] = useState('rice');
  const ra = p.a.price / p.a.qty;
  const rb = p.b.price / p.b.qty;
  const diff = Math.abs(ra - rb);
  const set = (deal, field, v) => { setPreset(null); setP((o) => ({ ...o, [deal]: { ...o[deal], [field]: v } })); };
  const maxPrice = Math.max(Math.floor(p.a.qty) * ra, Math.floor(p.b.qty) * rb, ra, rb) * 1.05;

  const readout = `Deal A: ${money(ra)} per ${p.unit}. Deal B: ${money(rb)} per ${p.unit}. `
    + (diff < 0.005 ? 'Same unit rate: the deals are equally good per unit.' : `Deal ${ra < rb ? 'A' : 'B'} is cheaper by ${money(diff)} per ${p.unit}.`);

  return (
    <LabFrame
      title="Unit rates on double number lines"
      intro="Each deal gets two lines: quantity on top, money underneath, marked at every whole unit. The mark under 1 is the unit rate."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setP(PRESETS.find((x) => x.id === id)); }}
      onReset={() => { setPreset('rice'); setP(PRESETS[0]); }}
      figure={(
        <svg viewBox="0 0 430 250" className="lab-svg" style={{ color: 'var(--text-muted)' }}>
          <DoubleLine y={50} deal={p.a} name="A" maxPrice={maxPrice} unit={p.unit} units={p.units} />
          <DoubleLine y={170} deal={p.b} name="B" maxPrice={maxPrice} unit={p.unit} units={p.units} />
        </svg>
      )}
      readout={readout}
      controls={(
        <>
          <Slider label="A: quantity" value={p.a.qty} min={1} max={10} step={1} format={(v) => fmt(v, 0)} onChange={(v) => set('a', 'qty', v)} />
          <Slider label="A: price ($)" value={p.a.price} min={0.5} max={30} step={0.05} format={money} onChange={(v) => set('a', 'price', v)} />
          <Slider label="B: quantity" value={p.b.qty} min={1} max={10} step={1} format={(v) => fmt(v, 0)} onChange={(v) => set('b', 'qty', v)} />
          <Slider label="B: price ($)" value={p.b.price} min={0.5} max={30} step={0.05} format={money} onChange={(v) => set('b', 'price', v)} />
        </>
      )}
      table={{
        caption: 'Prices for whole quantities at each deal’s rate',
        columns: [`Quantity (${p.units})`, 'Deal A', 'Deal B'],
        rows: Array.from({ length: 6 }, (_, i) => i + 1).map((q) => [q, money(q * ra), money(q * rb)]),
      }}
      annotations={['Doubling both the quantity and the price leaves the unit rate unchanged — an equivalent ratio.', 'A bigger pack is not automatically the cheaper one: compare unit rates, not totals.']}
      constraints={['Assumes a constant price per unit within each deal (no “buy 2, get 1 free”).', 'Prices are rounded to cents in the labels.']}
    />
  );
}
