import { useState } from 'react';
import { LabFrame } from './LabKit.jsx';
import { EXPRESSIONS, expressionById, compareTable } from './logic.js';

// Truth tables (V5.1 §3 CS-113: propositional logic). Two propositions have
// four rows, so comparing two columns row by row is a complete proof of
// equivalence — or a counterexample when one row differs.

const PRESETS = [
  { id: 'demorgan', label: 'De Morgan’s law', left: 'not-and', right: 'nots-or' },
  { id: 'bug', label: 'A common bug', left: 'not-and', right: 'nots-and' },
  { id: 'converse', label: 'Converse', left: 'implies', right: 'converse' },
  { id: 'contrapositive', label: 'Contrapositive', left: 'implies', right: 'contrapositive' },
];

const tf = (b) => (b ? 'T' : 'F');
const word = (b) => (b ? 'true' : 'false');

export default function TruthTableLab() {
  const [preset, setPreset] = useState('demorgan');
  const [left, setLeft] = useState('not-and');
  const [right, setRight] = useState('nots-or');
  const rows = compareTable(left, right);
  const L = expressionById[left];
  const R = expressionById[right];
  const diff = rows.filter((r) => !r.same);

  const readout = diff.length === 0
    ? `${L.label} and ${R.label} agree on all four rows, so they are equivalent. In C++, ${L.cpp} can be replaced by ${R.cpp}.`
    : `${L.label} and ${R.label} are not equivalent: they differ in ${diff.length} of 4 rows — for example when p is ${word(diff[0].p)} and q is ${word(diff[0].q)}, ${L.label} is ${word(diff[0].left)} but ${R.label} is ${word(diff[0].right)}.`;

  const options = EXPRESSIONS.map((e) => ({ value: e.id, label: e.label }));

  const figure = (
    <div className="tt-wrap">
      <table className="tt-table">
        <thead>
          <tr><th>p</th><th>q</th><th>{L.label}</th><th>{R.label}</th><th>same?</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.p}${r.q}`} className={r.same ? '' : 'is-diff'}>
              <td>{tf(r.p)}</td><td>{tf(r.q)}</td><td>{tf(r.left)}</td><td>{tf(r.right)}</td><td>{r.same ? 'yes' : 'NO'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="tt-verdict">{diff.length === 0 ? 'Equivalent: every row agrees.' : `Not equivalent: ${diff.length} row${diff.length > 1 ? 's differ' : ' differs'}.`}</p>
    </div>
  );

  return (
    <LabFrame
      title="Truth tables: are two conditions the same?"
      intro="Pick two conditions. With two propositions there are only four cases, so checking every row proves equivalence — and one differing row disproves it."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { const p = PRESETS.find((x) => x.id === id); setPreset(id); setLeft(p.left); setRight(p.right); }}
      onReset={() => { setPreset('demorgan'); setLeft('not-and'); setRight('nots-or'); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <label className="lab-select">
            <span>Left condition</span>
            <select value={left} onChange={(e) => { setPreset(null); setLeft(e.target.value); }}>
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="lab-select">
            <span>Right condition</span>
            <select value={right} onChange={(e) => { setPreset(null); setRight(e.target.value); }}>
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <p className="studio-muted">In C++: <code>{L.cpp}</code> versus <code>{R.cpp}</code></p>
        </>
      )}
      table={{
        caption: `${L.label} against ${R.label}, every case`,
        columns: ['p', 'q', `Left: ${L.label}`, `Right: ${R.label}`, 'Same?'],
        rows: rows.map((r) => [word(r.p), word(r.q), word(r.left), word(r.right), r.same ? 'yes' : 'no']),
      }}
      annotations={[
        'De Morgan: negating swaps ∧ and ∨ and negates each part — ¬(p ∧ q) ≡ ¬p ∨ ¬q.',
        'An implication equals its contrapositive, never (in general) its converse.',
      ]}
      constraints={[
        'Two propositions only. With n propositions a table has 2ⁿ rows: complete, but impractical past a dozen or so.',
      ]}
    />
  );
}
