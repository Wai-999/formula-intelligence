import { useMemo, useState } from 'react';
import { runPython } from '../../../lib/pyodideRunner.js';
import { runnability, RUNTIME_NOTE } from '../../../data/python/runnability.js';
import { useUIStore } from '../../../store/useUIStore.js';
import './PyCodeBlock.css';

// Lightweight Python syntax highlighter. A full grammar (or a heavyweight
// dependency like highlight.js/prism) is deliberately avoided: every code
// sample in the Python Hub is authored in-repo, so the token classes below
// only need to cover what those samples actually use. One authoring rule
// keeps this simple and line-safe: samples use `#` comments, never
// triple-quoted docstrings, so no token ever spans multiple lines and
// per-line tokenization (which line numbering needs anyway) stays exact.
const KEYWORDS = new Set([
  'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'in',
  'not', 'and', 'or', 'import', 'from', 'as', 'with', 'try', 'except',
  'finally', 'lambda', 'None', 'True', 'False', 'pass', 'break',
  'continue', 'yield', 'global', 'assert', 'raise', 'is', 'del', 'print',
]);

const TOKEN_RE = new RegExp(
  [
    '(#.*$)', // 1 comment
    '("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')', // 2 string
    '(@[A-Za-z_][\\w.]*)', // 3 decorator
    '\\b(\\d+\\.?\\d*(?:[eE][+-]?\\d+)?)\\b', // 4 number
    '\\b([A-Za-z_]\\w*)\\b', // 5 identifier (keyword / call decided below)
  ].join('|'),
  'gm'
);

function tokenizeLine(line) {
  const out = [];
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let m;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > last) out.push({ t: 'plain', s: line.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ t: 'comment', s: m[1] });
    else if (m[2] !== undefined) out.push({ t: 'string', s: m[2] });
    else if (m[3] !== undefined) out.push({ t: 'decorator', s: m[3] });
    else if (m[4] !== undefined) out.push({ t: 'number', s: m[4] });
    else if (m[5] !== undefined) {
      const word = m[5];
      if (KEYWORDS.has(word)) out.push({ t: 'keyword', s: word });
      else if (line.slice(TOKEN_RE.lastIndex).match(/^\s*\(/)) out.push({ t: 'call', s: word });
      else out.push({ t: 'plain', s: word });
    }
    last = TOKEN_RE.lastIndex;
  }
  if (last < line.length) out.push({ t: 'plain', s: line.slice(last) });
  return out;
}

const COLLAPSED_LINES = 14;

export default function PyCodeBlock({ code, entryId, entryName }) {
  const lines = useMemo(() => code.replace(/\n+$/, '').split('\n').map(tokenizeLine), [code]);
  const collapsible = lines.length > COLLAPSED_LINES + 4;
  const [expanded, setExpanded] = useState(!collapsible);
  const [copied, setCopied] = useState(false);
  const [run, setRun] = useState(null);       // { state, output, error, ms }
  const visible = expanded ? lines : lines.slice(0, COLLAPSED_LINES);

  // Whether this specific sample can execute in a browser was established by
  // actually running all 126 in Pyodide, not guessed from its imports.
  const can = runnability(entryId);
  const navigateToLinkedConcept = useUIStore((s) => s.navigateToLinkedConcept);

  // Every sample is a starting point, not a final artifact — including the
  // 16 that cannot run here, which are still worth editing and taking away.
  function openInLab() {
    navigateToLinkedConcept('ml', 'pylab', { name: entryName || 'From the Hub', code });
  }

  async function execute() {
    setRun({ state: 'running', progress: 'Starting…' });
    const result = await runPython(code, {
      onProgress: (progress) => setRun((r) => (r?.state === 'running' ? { ...r, progress } : r)),
    });
    setRun({ state: 'done', ...result });
  }

  function copy() {
    const write = navigator.clipboard?.writeText
      ? navigator.clipboard.writeText(code)
      : Promise.reject(new Error('clipboard unavailable'));
    write.then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => {} // non-secure contexts: silently keep the button un-flipped
    );
  }

  return (
    <div className="pycode">
      <div className="pycode-bar">
        <span className="pycode-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="pycode-lang"><i className="ti ti-brand-python" aria-hidden="true" /> Python</span>
        <span className="pycode-runhint">{can.runnable ? 'runs in your browser' : 'read-only'}</span>
        {can.runnable ? (
          <button
            type="button" className="pycode-run" onClick={execute}
            disabled={run?.state === 'running'}
            title={RUNTIME_NOTE}
          >
            <i className={`ti ${run?.state === 'running' ? 'ti-loader-2 pycode-spin' : 'ti-player-play'}`} aria-hidden="true" />
            {run?.state === 'running' ? 'Running…' : 'Run'}
          </button>
        ) : (
          <span className="pycode-cantrun" title={can.why}>
            <i className="ti ti-player-play-off" aria-hidden="true" /> Not runnable here
          </span>
        )}
        <button type="button" className="pycode-copy" onClick={openInLab} title="Open an editable copy in the Python Lab">
          <i className="ti ti-flask-2" aria-hidden="true" /> Edit
        </button>
        <button type="button" className="pycode-copy" onClick={copy}>
          <i className={`ti ${copied ? 'ti-check' : 'ti-copy'}`} aria-hidden="true" />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="pycode-body">
        {visible.map((tokens, i) => (
          // Lines are static content — index-as-key is safe here.
          // eslint-disable-next-line react/no-array-index-key
          <div className="pycode-line" key={i}>
            <span className="pycode-ln">{i + 1}</span>
            <code className="pycode-src">
              {tokens.map((tk, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <span key={j} className={tk.t === 'plain' ? undefined : `tok-${tk.t}`}>{tk.s}</span>
              ))}
            </code>
          </div>
        ))}
      </pre>
      {collapsible && (
        <button type="button" className="pycode-expand" onClick={() => setExpanded((e) => !e)}>
          <i className={`ti ${expanded ? 'ti-chevron-up' : 'ti-chevron-down'}`} aria-hidden="true" />
          {expanded ? 'Collapse code' : `Show all ${lines.length} lines`}
        </button>
      )}

      {!can.runnable && (
        <p className="pycode-why">
          <i className="ti ti-info-circle" aria-hidden="true" />
          Can’t run in the browser: {can.why}. Copy it and run locally.
        </p>
      )}

      {run?.state === 'running' && (
        <div className="pycode-out pycode-out-running">
          <i className="ti ti-loader-2 pycode-spin" aria-hidden="true" /> {run.progress}
        </div>
      )}

      {run?.state === 'done' && (
        <div className={`pycode-out ${run.ok ? '' : 'pycode-out-error'}`}>
          <div className="pycode-out-head">
            <span>
              <i className={`ti ${run.ok ? 'ti-check' : 'ti-alert-triangle'}`} aria-hidden="true" />
              {run.ok ? `Output (${run.ms} ms)` : 'Error'}
            </span>
            <button type="button" className="pycode-out-close" onClick={() => setRun(null)} aria-label="Clear output">
              <i className="ti ti-x" aria-hidden="true" />
            </button>
          </div>
          {(run.ok ? run.output.trim() || !run.figures?.length : true) && (
            <pre className="pycode-out-body">
              {run.ok ? (run.output.trim() || '(the sample produced no printed output)') : run.error}
            </pre>
          )}
          {run.figures?.length > 0 && (
            <div className="pycode-figs">
              {run.figures.map((src, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <img key={i} src={src} alt={`Figure ${i + 1}`} className="pycode-fig" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
