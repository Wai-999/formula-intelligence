import { useMemo, useState } from 'react';
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

export default function PyCodeBlock({ code }) {
  const lines = useMemo(() => code.replace(/\n+$/, '').split('\n').map(tokenizeLine), [code]);
  const collapsible = lines.length > COLLAPSED_LINES + 4;
  const [expanded, setExpanded] = useState(!collapsible);
  const [copied, setCopied] = useState(false);
  const visible = expanded ? lines : lines.slice(0, COLLAPSED_LINES);

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
        <span className="pycode-runhint"><i className="ti ti-player-play" aria-hidden="true" /> ready to run</span>
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
    </div>
  );
}
