import { useState } from 'react';
import { LabFrame } from './LabKit.jsx';
import { runOps } from './structures.js';

// Stacks and queues (V5.1 §3 CS-124: "stack/queue animation"). The same
// operations go to both containers; only the removal rule differs, so every
// difference on screen is caused by LIFO versus FIFO.

const add = (value) => ({ op: 'add', value });
const remove = { op: 'remove' };

const PRESETS = [
  { id: 'numbers', label: 'Same operations, two containers', addWord: 'add', removeWord: 'remove', ops: [add('1'), add('2'), add('3'), remove, add('4'), remove, remove] },
  { id: 'browser', label: 'Browser history (Back button)', addWord: 'visit', removeWord: 'back', ops: [add('home'), add('news'), add('sports'), remove, add('weather'), remove, remove] },
  { id: 'printer', label: 'Office printer', addWord: 'send', removeWord: 'print next', ops: [add('report'), add('photo'), add('ticket'), remove, add('memo'), remove, remove] },
];

const show = (xs) => (xs.length ? xs.join(', ') : 'empty');

export default function StackQueueLab() {
  const [preset, setPreset] = useState('numbers');
  const [i, setI] = useState(-1);
  const p = PRESETS.find((x) => x.id === preset);
  const states = runOps(p.ops);
  const cur = i >= 0 ? states[i] : { stack: [], queue: [], fromStack: null, fromQueue: null };
  const opText = (o) => (o.op === 'add' ? `${p.addWord} ${o.value}` : p.removeWord);

  const readout = i < 0
    ? `Both containers are empty. ${p.ops.length} operations to run; press Step.`
    : `Step ${i + 1} of ${p.ops.length}: ${opText(p.ops[i])}. `
      + (cur.fromStack === null
        ? `Both containers receive ${p.ops[i].value}. `
        : `The stack gives ${cur.fromStack} (last in, first out); the queue gives ${cur.fromQueue} (first in, first out). `)
      + `Stack, bottom to top: ${show(cur.stack)}. Queue, front to back: ${show(cur.queue)}.`;

  const figure = (
    <div className="sq-figure">
      <div className="sq-panel">
        <p className="sq-title">Stack <span>last in, first out</span></p>
        <div className="sq-stack">
          {cur.stack.length === 0 && <span className="sq-empty">empty</span>}
          {cur.stack.map((v, k) => <span key={`${k}-${v}`} className={`sq-box${k === cur.stack.length - 1 ? ' is-end' : ''}`}>{v}</span>)}
        </div>
        <p className="sq-note">{cur.stack.length ? 'top ↑' : ' '}</p>
        {cur.fromStack !== null && <p className="sq-out">removed: <strong>{cur.fromStack}</strong></p>}
      </div>
      <div className="sq-panel">
        <p className="sq-title">Queue <span>first in, first out</span></p>
        <div className="sq-queue">
          {cur.queue.length === 0 && <span className="sq-empty">empty</span>}
          {cur.queue.map((v, k) => <span key={`${k}-${v}`} className={`sq-box${k === 0 ? ' is-end' : ''}`}>{v}</span>)}
        </div>
        <p className="sq-note">{cur.queue.length ? '← front · back →' : ' '}</p>
        {cur.fromQueue !== null && <p className="sq-out">removed: <strong>{cur.fromQueue}</strong></p>}
      </div>
    </div>
  );

  return (
    <LabFrame
      title="Stack and queue, side by side"
      intro="Every operation goes to both containers. Before each removal, predict what each one gives back."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { setPreset(id); setI(-1); }}
      onReset={() => { setPreset('numbers'); setI(-1); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <div className="studio-row trace-buttons">
            <button type="button" className="lab-btn" onClick={() => setI((v) => Math.max(-1, v - 1))} disabled={i < 0}>
              <i className="ti ti-player-track-prev" aria-hidden="true" /> Back
            </button>
            <button type="button" className="lab-btn trace-step" onClick={() => setI((v) => Math.min(p.ops.length - 1, v + 1))} disabled={i === p.ops.length - 1}>
              <i className="ti ti-player-track-next" aria-hidden="true" /> Step
            </button>
            <button type="button" className="lab-btn" onClick={() => setI(p.ops.length - 1)} disabled={i === p.ops.length - 1}>Run to the end</button>
          </div>
          <ol className="sq-ops" aria-label="Operations">
            {p.ops.map((o, k) => <li key={k} className={k === i ? 'is-current' : k < i ? 'is-done' : ''} aria-current={k === i ? 'step' : undefined}>{opText(o)}</li>)}
          </ol>
        </>
      )}
      table={{
        caption: 'Both containers after each operation',
        columns: ['Step', 'Operation', 'Stack (bottom → top)', 'Queue (front → back)', 'Stack gave', 'Queue gave'],
        rows: states.map((s, k) => [k + 1, opText(p.ops[k]), show(s.stack), show(s.queue), s.fromStack ?? '', s.fromQueue ?? '']),
      }}
      annotations={[
        'Adding is identical; only removal differs. A stack hands back the newest item, a queue the oldest.',
        'In C++: std::stack (push, top, pop) and std::queue (push, front, pop). Both add and remove in constant time.',
      ]}
      constraints={[
        'The lab shows the behaviour, not memory: a real std::queue usually stores items in a std::deque.',
      ]}
    />
  );
}
