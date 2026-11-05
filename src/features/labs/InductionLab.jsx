import { useState } from 'react';
import { LabFrame, Slider, Segmented } from './LabKit.jsx';
import { oddSum, triangleSum } from './logic.js';

// Mathematical induction (V5.1 §3 CS-113). The inductive step drawn: one
// new layer turns case k into case k + 1. The picture illustrates the
// argument; the algebra in the lesson is the proof.

const N = 10;
const SIZE = 300;
const CELL = SIZE / N;

const STATEMENTS = {
  odd: {
    label: '1 + 3 + … + (2n − 1) = n²',
    term: (k) => 2 * k + 1,
    sum: oddSum,
    formula: (n) => n * n,
    cells(k) {
      const out = [];
      for (let i = 0; i <= k; i += 1) {
        for (let j = 0; j <= k; j += 1) out.push({ i, j, isNew: i === k || j === k });
      }
      return out;
    },
    read: (k) => `Assume 1 + 3 + … + ${2 * k - 1} = ${k}² = ${k * k}. The next odd number, ${2 * k + 1}, is the L-shaped layer; adding it gives ${(k + 1) ** 2} = ${k + 1}². That is the statement for ${k + 1}.`,
  },
  triangle: {
    label: '1 + 2 + … + n = n(n + 1)/2',
    term: (k) => k + 1,
    sum: (n) => Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0),
    formula: triangleSum,
    cells(k) {
      const out = [];
      for (let i = 0; i <= k; i += 1) {
        for (let j = 0; j <= i; j += 1) out.push({ i, j, isNew: i === k });
      }
      return out;
    },
    read: (k) => `Assume 1 + 2 + … + ${k} = ${k}·${k + 1}/2 = ${triangleSum(k)}. The new column holds ${k + 1}; adding it gives ${triangleSum(k + 1)} = ${k + 1}·${k + 2}/2. That is the statement for ${k + 1}.`,
  },
};

export default function InductionLab() {
  const [which, setWhich] = useState('odd');
  const [k, setK] = useState(3);
  const st = STATEMENTS[which];

  const figure = (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="lab-svg" role="presentation">
      {st.cells(k).map(({ i, j, isNew }) => (
        <rect key={`${i}-${j}`} className={`ind-cell ${isNew ? 'ind-new' : 'ind-old'}`} x={i * CELL} y={SIZE - (j + 1) * CELL} width={CELL} height={CELL} />
      ))}
    </svg>
  );

  return (
    <LabFrame
      title="Induction: one more layer"
      intro="The purple part is case k, assumed true. The blue layer is the next term. Together they make case k + 1 — the inductive step, drawn."
      presets={[{ id: 'odd', label: 'Odd numbers make squares' }, { id: 'triangle', label: 'Gauss’s sum' }]}
      activePreset={which}
      onPreset={setWhich}
      onReset={() => { setWhich('odd'); setK(3); }}
      figure={figure}
      readout={st.read(k)}
      controls={(
        <>
          <Segmented label="Statement" options={[{ value: 'odd', label: 'odd numbers' }, { value: 'triangle', label: '1 + 2 + … + n' }]} value={which} onChange={setWhich} />
          <Slider label="Case k (assumed true)" value={k} min={1} max={N - 1} step={1} format={(v) => String(v)} onChange={setK} />
          <dl className="lab-stat">
            <dt>Case k sum</dt><dd>{st.sum(k)}</dd>
            <dt>Next term</dt><dd>{st.term(k)}</dd>
            <dt>Case k + 1 sum</dt><dd>{st.sum(k + 1)}</dd>
            <dt>Formula at k + 1</dt><dd>{st.formula(k + 1)}</dd>
          </dl>
        </>
      )}
      table={{
        caption: `${st.label}: the sum and the formula agree for each n shown`,
        columns: ['n', 'Term added', 'Sum', 'Formula', 'Equal?'],
        rows: Array.from({ length: N }, (_, idx) => {
          const n = idx + 1;
          return [n, st.term(n - 1), st.sum(n), st.formula(n), st.sum(n) === st.formula(n) ? 'yes' : 'no'];
        }),
      }}
      annotations={[
        'Base case: for n = 1 the picture is a single square, and both sides equal 1.',
        'The step works for every k, not just the ones on screen — that is what turns ten checks into a proof for all n.',
      ]}
      constraints={[
        'The picture shows small cases. A picture is evidence; the algebraic step in the lesson is the proof.',
      ]}
    />
  );
}
