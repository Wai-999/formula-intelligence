import { useState } from 'react';
import { LabFrame, Segmented } from './LabKit.jsx';
import { fmt } from './plot.js';
import { DICE, DICE_EVENTS, diceCounts } from './prob.js';

// Probability by counting (phase 6 of the 80/20 upgrade,
// ps-probability-rules): the 36 outcomes of two fair dice as a grid. Pick
// two events; the cells in A, in B and in both are marked, and the readout
// shows why P(A or B) = P(A) + P(B) − P(A and B).

const PRESETS = [
  { id: 'overlap', label: 'Sum 7 or a six', a: 'sum7', b: 'six' },
  { id: 'exclusive', label: 'Sum 7 or doubles', a: 'sum7', b: 'doubles' },
  { id: 'nested', label: 'A six, sum 10+', a: 'six', b: 'sum10' },
];

const CELL = 42;
const X0 = 70;
const Y0 = 40;
const options = Object.entries(DICE_EVENTS).map(([value, e]) => ({ value, label: e.label }));
const p = (k) => `${k}/36 = ${fmt(k / 36, 3)}`;

export default function DiceGridLab() {
  const [preset, setPreset] = useState('overlap');
  const [a, setA] = useState('sum7');
  const [b, setB] = useState('six');
  const A = DICE_EVENTS[a];
  const B = DICE_EVENTS[b];
  const c = diceCounts(A.test, B.test);
  const pick = (setter) => (v) => { setPreset(null); setter(v); };

  const readout = `A, ${A.label.toLowerCase()}: ${c.a} of 36 outcomes. B, ${B.label.toLowerCase()}: ${c.b} of 36. `
    + `In both: ${c.both}. In either: ${c.either} = ${c.a} + ${c.b} − ${c.both}, so P(A or B) = ${p(c.either)}. `
    + (c.both === 0 ? 'A and B never happen together (they are mutually exclusive), so their probabilities simply add. ' : 'Adding P(A) and P(B) would count the outcomes in both twice. ')
    + `Not A: ${36 - c.a} of 36.`;

  const figure = (
    <svg viewBox={`0 0 ${X0 + 6 * CELL + 10} ${Y0 + 6 * CELL + 14}`} className="lab-svg" style={{ color: 'var(--text-muted)' }}>
      <text className="lab-label-muted" x={X0 + 3 * CELL} y={14} textAnchor="middle">second die</text>
      <text className="lab-label-muted" x={14} y={Y0 + 3 * CELL} textAnchor="middle" transform={`rotate(-90 14 ${Y0 + 3 * CELL})`}>first die</text>
      {[1, 2, 3, 4, 5, 6].map((k) => (
        <g key={k}>
          <text className="lab-label-muted" x={X0 + (k - 0.5) * CELL} y={Y0 - 8} textAnchor="middle">{k}</text>
          <text className="lab-label-muted" x={X0 - 12} y={Y0 + (k - 0.5) * CELL + 4} textAnchor="middle">{k}</text>
        </g>
      ))}
      {DICE.map(([r, col]) => {
        const inA = A.test([r, col]);
        const inB = B.test([r, col]);
        const x = X0 + (col - 1) * CELL;
        const y = Y0 + (r - 1) * CELL;
        const mark = inA && inB ? 'A B' : inA ? 'A' : inB ? 'B' : '';
        return (
          <g key={`${r}-${col}`}>
            <rect x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2} rx={4}
              className={inA && inB ? 'dice-both' : inA ? 'lab-fill' : inB ? 'lab-fill-2' : 'dice-none'} />
            <text className={mark ? 'lab-label' : 'lab-label-muted'} x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle">{mark || '·'}</text>
          </g>
        );
      })}
    </svg>
  );

  return (
    <LabFrame
      title="Two dice: counting outcomes"
      intro="Each square is one of the 36 equally likely ways two fair dice can land: first die down the side, second across the top. Pick two events and count."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { const n = PRESETS.find((x) => x.id === id); setPreset(id); setA(n.a); setB(n.b); }}
      onReset={() => { setPreset('overlap'); setA('sum7'); setB('six'); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <Segmented label="Event A" options={options} value={a} onChange={pick(setA)} />
          <Segmented label="Event B" options={options} value={b} onChange={pick(setB)} />
          <dl className="lab-stat">
            <dt>P(A)</dt><dd>{p(c.a)}</dd>
            <dt>P(B)</dt><dd>{p(c.b)}</dd>
            <dt>P(A and B)</dt><dd>{p(c.both)}</dd>
            <dt>P(A or B)</dt><dd>{p(c.either)}</dd>
            <dt>P(not A)</dt><dd>{p(36 - c.a)}</dd>
          </dl>
        </>
      )}
      table={{
        caption: `Counts for A (${A.label.toLowerCase()}) and B (${B.label.toLowerCase()}) out of 36 outcomes`,
        columns: ['Event', 'Outcomes', 'Probability'],
        rows: [
          ['A', c.a, fmt(c.a / 36, 3)],
          ['B', c.b, fmt(c.b / 36, 3)],
          ['A and B', c.both, fmt(c.both / 36, 3)],
          ['A or B', c.either, fmt(c.either / 36, 3)],
          ['not A', 36 - c.a, fmt((36 - c.a) / 36, 3)],
        ],
      }}
      annotations={[
        'P(A or B) = P(A) + P(B) − P(A and B): the squares marked “A B” are in both counts, so one copy comes off.',
        'Every square is either in A or not, so P(not A) = 1 − P(A).',
      ]}
      constraints={[
        'Counting works because the dice are fair and every square is equally likely. For loaded dice, or for real events, probabilities come from data instead.',
      ]}
    />
  );
}
