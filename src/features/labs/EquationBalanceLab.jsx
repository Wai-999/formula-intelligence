import { useState } from 'react';
import { LabFrame } from './LabKit.jsx';
import { fmt } from './plot.js';

// Equation balance (required lab). An equation ax + b = cx + d is a level
// balance. Doing the same thing to both pans keeps it level; doing
// something to one pan only tips it — the visual reason "do the same to
// both sides" is a rule and not a ritual.

const PRESETS = [
  { id: 'p1', label: 'x + 3 = 7', eq: { lx: 1, lc: 3, rx: 0, rc: 7 } },
  { id: 'p2', label: '2x + 1 = 9', eq: { lx: 2, lc: 1, rx: 0, rc: 9 } },
  { id: 'p3', label: '3x + 2 = x + 10', eq: { lx: 3, lc: 2, rx: 1, rc: 10 } },
  { id: 'p4', label: '4x = 2x + 6', eq: { lx: 4, lc: 0, rx: 2, rc: 6 } },
];

const side = (x, c) => {
  const parts = [];
  if (x) parts.push(`${x === 1 ? '' : x === -1 ? '−' : fmt(x)}x`);
  if (c || !x) parts.push(parts.length ? `${c < 0 ? '−' : '+'} ${fmt(Math.abs(c))}` : fmt(c));
  return parts.join(' ');
};

function Pan({ cx, y, x, c, label }) {
  const boxes = Math.max(0, Math.min(x, 8));
  const units = Math.max(0, Math.min(c, 12));
  const items = [];
  for (let i = 0; i < boxes; i++) items.push(<g key={`x${i}`}><rect x={cx - 66 + (i % 4) * 34} y={y - 30 - Math.floor(i / 4) * 30} width={28} height={26} rx={4} className="lab-fill" /><text className="lab-label" x={cx - 52 + (i % 4) * 34} y={y - 12 - Math.floor(i / 4) * 30} textAnchor="middle">x</text></g>);
  const base = y - 30 * Math.ceil(boxes / 4) - 4;
  for (let i = 0; i < units; i++) items.push(<circle key={`u${i}`} cx={cx - 60 + (i % 6) * 24} cy={base - 10 - Math.floor(i / 6) * 22} r={9} className="lab-point-2" />);
  return (
    <g>
      <line x1={cx - 80} x2={cx + 80} y1={y} y2={y} className="lab-axis-line" stroke="currentColor" strokeWidth="4" />
      {items}
      {(x > 8 || c > 12 || x < 0 || c < 0) && <text className="lab-label" x={cx} y={base - 70} textAnchor="middle">{label}</text>}
    </g>
  );
}

export default function EquationBalanceLab() {
  const [eq, setEq] = useState(PRESETS[1].eq);
  const [preset, setPreset] = useState('p2');
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState('');
  const { lx, lc, rx, rc } = eq;
  const solution = lx !== rx ? (rc - lc) / (lx - rx) : NaN;
  // The ORIGINAL equation's solution: a one-sided move changes the solution
  // set, and the tilt shows how far the two sides now disagree at it.
  const original = history[0]?.eq ?? eq;
  const x0 = (original.rc - original.lc) / (original.lx - original.rx);
  const tilt = Math.max(-14, Math.min(14, ((lx * x0 + lc) - (rx * x0 + rc)) * 3));
  const level = Math.abs(tilt) < 1e-9;
  const solved = (lx === 1 && lc === 0 && rx === 0) || (rx === 1 && rc === 0 && lx === 0);

  const apply = (next, text) => {
    setHistory((h) => [...h, { eq, text }]);
    setEq(next);
    setPreset(null);
    setMsg(text);
  };
  const reset = (p = PRESETS[1]) => { setEq(p.eq); setPreset(p.id); setHistory([]); setMsg(''); };

  const moves = [
    { label: 'Subtract 1 from both sides', ok: true, run: () => apply({ lx, lc: lc - 1, rx, rc: rc - 1 }, 'Subtracted 1 from both sides.') },
    { label: 'Add 1 to both sides', ok: true, run: () => apply({ lx, lc: lc + 1, rx, rc: rc + 1 }, 'Added 1 to both sides.') },
    { label: 'Subtract x from both sides', ok: lx > 0 && rx > 0, run: () => apply({ lx: lx - 1, lc, rx: rx - 1, rc }, 'Subtracted x from both sides.') },
    {
      label: `Divide both sides by ${lx || rx}`,
      ok: (lx > 1 && rx === 0 && lc === 0) || (rx > 1 && lx === 0 && rc === 0),
      run: () => { const n = lx || rx; apply({ lx: lx / n, lc: lc / n, rx: rx / n, rc: rc / n }, `Divided both sides by ${n}.`); },
    },
  ];

  const readout = `${side(lx, lc)} = ${side(rx, rc)}. `
    + (level
      ? (solved ? `Solved: x = ${fmt(solution)}. Check it in the original equation.` : `The balance is level. ${Number.isFinite(solution) ? `The solution is still x = ${fmt(solution)}` : ''}.`)
      : `The balance tipped: a one-sided move changed the equation. At the original solution x = ${fmt(x0)} the left side is ${fmt(lx * x0 + lc)} and the right is ${fmt(rx * x0 + rc)}.`);

  return (
    <LabFrame
      title="Keep the balance"
      intro="Each box is one x, each circle is 1. Use the moves to get x alone on one side. Then try the unfair move and watch what it does."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => reset(PRESETS.find((p) => p.id === id))}
      onReset={() => reset()}
      figure={(
        <svg viewBox="0 0 420 260" className="lab-svg">
          <g transform={`rotate(${tilt} 210 150)`} style={{ color: 'var(--text-muted)' }}>
            <line x1={50} x2={370} y1={150} y2={150} stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <Pan cx={110} y={146} x={lx} c={lc} label={side(lx, lc)} />
            <Pan cx={310} y={146} x={rx} c={rc} label={side(rx, rc)} />
          </g>
          <polygon points="200,154 220,154 236,236 184,236" className="lab-fill" />
          <text className="lab-label" x={110} y={226} textAnchor="middle">{side(lx, lc)}</text>
          <text className="lab-label" x={310} y={226} textAnchor="middle">{side(rx, rc)}</text>
          <text className="lab-label" x={210} y={252} textAnchor="middle">{level ? 'level' : 'tipped!'}</text>
        </svg>
      )}
      readout={readout}
      controls={(
        <>
          <div className="studio-row" role="group" aria-label="Moves that keep the balance">
            {moves.map((m) => (
              <button key={m.label} type="button" className="lab-btn" disabled={!m.ok} onClick={m.run}>{m.label}</button>
            ))}
          </div>
          <div className="studio-row" role="group" aria-label="Other actions">
            <button type="button" className="lab-btn" disabled={!history.length} onClick={() => { const last = history[history.length - 1]; setEq(last.eq); setHistory((h) => h.slice(0, -1)); setMsg('Undid the last move.'); }}>Undo</button>
            <button type="button" className="lab-btn" onClick={() => apply({ lx, lc: lc + 1, rx, rc }, 'Added 1 to the LEFT side only — an unfair move.')}>Unfair move: add 1 to the left only</button>
          </div>
          {msg && <p className="studio-muted">{msg}</p>}
          <ol className="lab-notes" aria-label="Your steps">
            {history.map((h, i) => <li key={i}>{side(h.eq.lx, h.eq.lc)} = {side(h.eq.rx, h.eq.rc)} → {h.text}</li>)}
          </ol>
        </>
      )}
      table={{
        caption: 'Each side evaluated at the original solution',
        columns: ['Step', 'Left side', 'Right side', 'Equal?'],
        rows: [...history.map((h) => h.eq), eq].map((e, i) => [i === 0 ? 'start' : `after move ${i}`, fmt(e.lx * x0 + e.lc), fmt(e.rx * x0 + e.rc), Math.abs((e.lx - e.rx) * x0 + e.lc - e.rc) < 1e-9 ? 'yes' : 'NO']),
      }}
      annotations={['Every fair move keeps both sides equal at the solution — so the solution never changes.', 'The unfair move gives a new equation with a different solution: that is why it is not allowed.']}
      constraints={['Integer steps only; division is offered once x stands alone with a coefficient.', 'The picture shows up to 8 boxes and 12 circles per pan; beyond that (or for negatives) it shows the expression.']}
    />
  );
}
