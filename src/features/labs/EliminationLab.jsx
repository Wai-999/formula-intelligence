import { useState } from 'react';
import { LabFrame } from './LabKit.jsx';
import { fmt } from './plot.js';
import { analyzeEchelon, nextEliminationStep } from './linalg.js';

// Gaussian elimination (required lab). You choose the row operations; the
// lab keeps the history, flags the pivots, and says what the current
// matrix tells you — one solution, none, or infinitely many.

const PRESETS = [
  { id: 'unique', label: 'One solution', m: [[1, 1, 1, 6], [2, 3, 1, 11], [1, -1, 2, 5]] },
  { id: 'swap', label: 'Needs a swap', m: [[0, 2, 1, 7], [1, 1, 1, 6], [2, 1, 3, 13]] },
  { id: 'none', label: 'No solution', m: [[1, 1, 1, 6], [2, 2, 2, 10], [1, -1, 0, 0]] },
  { id: 'many', label: 'Infinitely many', m: [[1, 1, 1, 6], [2, 2, 2, 12], [1, -1, 0, 0]] },
];

const VARS = ['x', 'y', 'z'];
const clean = (v) => (Math.abs(v) < 1e-12 ? 0 : v);

function rowText(r) {
  const terms = r.slice(0, 3).map((c, i) => (c === 0 ? null : `${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : fmt(Math.abs(c), 3)}${VARS[i]}`)).filter(Boolean);
  const lhs = terms.length ? terms.join(' ').replace(/^\+ /, '').replace(/^− /, '−') : '0';
  return `${lhs} = ${fmt(r[3], 3)}`;
}

export default function EliminationLab() {
  const [m, setM] = useState(PRESETS[0].m);
  const [preset, setPreset] = useState('unique');
  const [history, setHistory] = useState([]);
  const [op, setOp] = useState({ i: 1, j: 0, k: 2 });
  const status = analyzeEchelon(m);

  const commit = (next, text) => {
    setHistory((h) => [...h, { m, text }]);
    setM(next.map((r) => r.map(clean)));
    setPreset(null);
  };
  const reset = (p = PRESETS[0]) => { setM(p.m); setPreset(p.id); setHistory([]); setOp({ i: 1, j: 0, k: 2 }); };

  const replace = () => {
    if (op.i === op.j || !Number.isFinite(op.k)) return;
    const next = m.map((r, idx) => (idx === op.i ? r.map((v, c) => v - op.k * m[op.j][c]) : r));
    commit(next, `R${op.i + 1} ← R${op.i + 1} − (${fmt(op.k, 3)})·R${op.j + 1}`);
  };
  const swap = () => {
    if (op.i === op.j) return;
    const next = m.map((r, idx) => (idx === op.i ? m[op.j] : idx === op.j ? m[op.i] : r));
    commit(next, `Swap R${op.i + 1} and R${op.j + 1}`);
  };
  const suggest = () => {
    const col = m[op.j].findIndex((v, c) => c < 3 && Math.abs(v) > 1e-12);
    if (col === -1) return;
    setOp((o) => ({ ...o, k: m[op.i][col] / m[op.j][col] }));
  };
  const auto = () => {
    const step = nextEliminationStep(m);
    if (step) commit(step.m, step.text);
  };

  const readout = `${m.map(rowText).join('; ')}. ${status.message}`;

  return (
    <LabFrame
      title="Gaussian elimination"
      intro="Clear the numbers below each pivot, working left to right. “Suggest” computes the multiplier that clears the first non-zero entry; “Next step” does one move for you."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => reset(PRESETS.find((p) => p.id === id))}
      onReset={() => reset()}
      figure={(
        <div className="elim-matrix">
          <table>
            <tbody>
              {m.map((r, ri) => (
                <tr key={ri}>
                  <th scope="row">R{ri + 1}</th>
                  {r.map((v, ci) => (
                    <td key={ci} className={`${ci === 3 ? 'aug' : ''} ${status.pivots.some((p) => p.row === ri && p.col === ci) ? 'pivot' : ''}`}>{fmt(v, 3)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      readout={readout}
      controls={(
        <>
          <div className="studio-row">
            <label className="elim-field">Row i
              <select value={op.i} onChange={(e) => setOp((o) => ({ ...o, i: Number(e.target.value) }))}>{[0, 1, 2].map((r) => <option key={r} value={r}>R{r + 1}</option>)}</select>
            </label>
            <label className="elim-field">Row j
              <select value={op.j} onChange={(e) => setOp((o) => ({ ...o, j: Number(e.target.value) }))}>{[0, 1, 2].map((r) => <option key={r} value={r}>R{r + 1}</option>)}</select>
            </label>
            <label className="elim-field">k
              <input type="number" step="any" value={Number.isFinite(op.k) ? +op.k.toFixed(6) : ''} onChange={(e) => setOp((o) => ({ ...o, k: Number(e.target.value) }))} />
            </label>
          </div>
          <div className="studio-row">
            <button type="button" className="lab-btn" onClick={replace} disabled={op.i === op.j}>R{op.i + 1} ← R{op.i + 1} − k·R{op.j + 1}</button>
            <button type="button" className="lab-btn" onClick={suggest} disabled={op.i === op.j}>Suggest k</button>
            <button type="button" className="lab-btn" onClick={swap} disabled={op.i === op.j}>Swap R{op.i + 1}, R{op.j + 1}</button>
          </div>
          <div className="studio-row">
            <button type="button" className="lab-btn" onClick={auto} disabled={!nextEliminationStep(m)}>Next step for me</button>
            <button type="button" className="lab-btn" disabled={!history.length} onClick={() => { setM(history[history.length - 1].m); setHistory((h) => h.slice(0, -1)); }}>Undo</button>
          </div>
          {history.length > 0 && (
            <ol className="elim-history" aria-label="Operations so far">{history.map((h, i) => <li key={i}>{h.text}</li>)}</ol>
          )}
        </>
      )}
      table={{
        caption: 'The augmented matrix [A | b]',
        columns: ['Row', 'x', 'y', 'z', 'b'],
        rows: m.map((r, i) => [`R${i + 1}`, ...r.map((v) => fmt(v, 4))]),
      }}
      annotations={['Each row operation can be undone, so the solution set never changes.', 'A row [0 0 0 | c] with c ≠ 0 says 0 = c: no solution. A row of all zeros says nothing new.']}
      constraints={['Three equations in three unknowns.', 'Arithmetic is in floating point and displayed to 3 decimals.']}
    />
  );
}
