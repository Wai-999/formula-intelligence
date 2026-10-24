import { memo, useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import { renderMath, tokenize } from '../../lib/mathFormat.js';
import './MathText.css';

// Authored text with inline math. Mini-format, deliberately tiny:
//   $x^2$      inline math (LaTeX)
//   $$...$$    display math, on its own line
//   **bold**   strong emphasis
//   *text*     emphasis
//   `code`     inline code
//   \$         a literal dollar sign (prices)
//
// KaTeX renders both HTML (what you see) and MathML (what a screen reader
// speaks) — §10 "screen reader math text". This module is imported only by
// lesson-level pages, so KaTeX never reaches the landing bundle (§13).

/**
 * A formula wide enough to scroll sideways must be reachable by keyboard
 * (WCAG 2.1.1; axe "scrollable-region-focusable") — but only then: making
 * every formula a tab stop would bury the page's real controls.
 */
function useScrollFocus() {
  const ref = useRef(null);
  const [scrolls, setScrolls] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const check = () => setScrolls(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);
  return [ref, scrolls ? { tabIndex: 0 } : {}];
}

function DisplayMath({ tex }) {
  const [ref, focus] = useScrollFocus();
  return <span ref={ref} className="mt-display" {...focus} dangerouslySetInnerHTML={{ __html: renderMath(tex, true) }} />;
}

function Inline({ tokens }) {
  return tokens.map((tok, i) => {
    if (tok.t === 'math') return <span key={i} className="mt-math" dangerouslySetInnerHTML={{ __html: renderMath(tok.v) }} />;
    if (tok.t === 'display') return <DisplayMath key={i} tex={tok.v} />;
    if (tok.t === 'bold') return <strong key={i}><Inline tokens={tokenize(tok.v)} /></strong>;
    if (tok.t === 'em') return <em key={i}><Inline tokens={tokenize(tok.v)} /></em>;
    if (tok.t === 'code') return <code key={i} className="mt-code">{tok.v}</code>;
    return <span key={i}>{tok.v}</span>;
  });
}

/** Render a string of authored text. `as` picks the wrapper (p, span, li…). */
function MathText({ text, as: Tag = 'span', className }) {
  if (text == null) return null;
  return <Tag className={className}><Inline tokens={tokenize(String(text))} /></Tag>;
}

export default memo(MathText);

/** Display-math block (a formula on its own). */
export function MathBlock({ tex, label }) {
  const [ref, focus] = useScrollFocus();
  return (
    <div ref={ref} className="mt-block" role={label ? 'group' : undefined} aria-label={label} {...focus}>
      <span dangerouslySetInnerHTML={{ __html: renderMath(tex, true) }} />
    </div>
  );
}
