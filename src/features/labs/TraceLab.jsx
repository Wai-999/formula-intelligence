import { useState } from 'react';
import { LabFrame } from './LabKit.jsx';
import { TRACES, parseStep } from '../../data/cpp/traces.js';

// Code tracing (V5.1 §3 CS-102: "read code → predict output → trace values").
// Step through a C++ program one line at a time and watch every variable.
// The steps are not hand-written guesses: scripts/verify-cpp.mjs compiles an
// instrumented copy of each program and checks it prints exactly these steps.

function changesBetween(prev, cur) {
  const before = Object.fromEntries(prev?.vars ?? []);
  return cur.vars.filter(([k, v]) => before[k] !== v).map(([k, v]) => (k in before ? `${k} changes from ${before[k]} to ${v}` : `${k} = ${v}`));
}

export default function TraceLab({ program = 'cafe-total' }) {
  const t = TRACES[program];
  const steps = t.trace.map(parseStep);
  const lines = t.code.split('\n');
  const [i, setI] = useState(-1); // −1: before the first step

  const cur = i >= 0 ? steps[i] : null;
  const prev = i > 0 ? steps[i - 1] : null;
  const changed = new Set(cur ? changesBetween(prev, cur).map((c) => c.split(' ')[0]) : []);
  const printed = steps.slice(0, i + 1).flatMap((s) => s.prints);
  const names = [...new Set(steps.flatMap((s) => s.vars.map(([k]) => k)))];

  const readout = !cur
    ? `Ready to trace ${t.file}: ${steps.length} steps. Press “Step” to run the first line.`
    : `Step ${i + 1} of ${steps.length}: line ${cur.line}, ${lines[cur.line - 1].trim()} `
      + `— ${[...changesBetween(prev, cur), ...cur.prints.map((p) => `prints ${p}`)].join('; ') || 'nothing changes'}.`
      + (t.notes?.[cur.line] ? ` ${t.notes[cur.line]}` : '')
      + (i === steps.length - 1 ? ' The program has finished.' : '');

  const figure = (
    <div className="trace-figure">
      <pre className="trace-code"><code>
        {lines.map((text, n) => (
          <span key={n} className={`trace-line${cur?.line === n + 1 ? ' is-current' : ''}`}>
            <span className="trace-ln">{n + 1}</span>{text || ' '}
          </span>
        ))}
      </code></pre>
      <div className="trace-console">
        <span className="trace-console-title">Output</span>
        <pre>{printed.length ? printed.join('\n') : '(nothing printed yet)'}</pre>
      </div>
    </div>
  );

  return (
    <LabFrame
      title={`Trace it: ${t.title}`}
      intro="The highlighted line has just run. Before each step, predict which variable changes and to what — then press Step and check."
      onReset={() => setI(-1)}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <div className="studio-row trace-buttons">
            <button type="button" className="lab-btn" onClick={() => setI((v) => Math.max(-1, v - 1))} disabled={i < 0}>
              <i className="ti ti-player-track-prev" aria-hidden="true" /> Back
            </button>
            <button type="button" className="lab-btn trace-step" onClick={() => setI((v) => Math.min(steps.length - 1, v + 1))} disabled={i === steps.length - 1}>
              <i className="ti ti-player-track-next" aria-hidden="true" /> Step
            </button>
            <button type="button" className="lab-btn" onClick={() => setI(steps.length - 1)} disabled={i === steps.length - 1}>Run to the end</button>
          </div>
          <p className="studio-muted">Step {Math.max(0, i + 1)} of {steps.length}</p>
          <dl className="lab-stat trace-vars" aria-label="Variables">
            {cur ? cur.vars.map(([k, v]) => (
              <div key={k} className={changed.has(k) ? 'is-changed' : ''}>
                <dt>{k}</dt><dd>{v}{changed.has(k) && <span className="trace-changed"> changed</span>}</dd>
              </div>
            )) : <div><dt>Variables</dt><dd>none yet</dd></div>}
          </dl>
        </>
      )}
      table={{
        caption: `Every step of ${t.file}: the values after each line runs`,
        columns: ['Step', 'Line', ...names, 'Prints'],
        rows: steps.map((s, n) => {
          const vals = Object.fromEntries(s.vars);
          return [n + 1, s.line, ...names.map((k) => vals[k] ?? '—'), s.prints.join(' / ') || ''];
        }),
      }}
      annotations={[
        'A for-loop checks its condition before every pass — including the last check, which fails and ends the loop.',
        'A variable declared in the for-statement (like h) stops existing when the loop ends.',
      ]}
      constraints={[
        'This is a replay of the compiled program’s real steps, not a C++ interpreter: you cannot edit the code here.',
        'To change the program, download it, compile it with g++ or clang++, and run it yourself.',
      ]}
    />
  );
}
