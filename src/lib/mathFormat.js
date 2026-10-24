import katex from 'katex';

// Parsing and rendering for MathText (src/components/math/MathText.jsx).
// Kept apart from the component so tests and the content validator can use
// the exact same tokenizer the page uses.

const cache = new Map();

export function renderMath(tex, display = false) {
  const key = `${display ? 'D' : 'I'}${tex}`;
  if (!cache.has(key)) {
    cache.set(key, katex.renderToString(tex, { displayMode: display, output: 'htmlAndMathml', throwOnError: false, strict: 'ignore' }));
  }
  return cache.get(key);
}

/** Split text into tokens: { t: 'text' | 'math' | 'display' | 'bold' | 'em' | 'code', v }. Exported for tests. */
export function tokenize(text) {
  const out = [];
  let buf = '';
  let i = 0;
  const flush = () => { if (buf) { out.push({ t: 'text', v: buf }); buf = ''; } };
  while (i < text.length) {
    const ch = text[i];
    if (ch === '\\' && text[i + 1] === '$') { buf += '$'; i += 2; continue; }
    if (ch === '$' && text[i + 1] === '$') {
      const end = text.indexOf('$$', i + 2);
      if (end === -1) { buf += text.slice(i); break; }
      flush();
      out.push({ t: 'display', v: text.slice(i + 2, end).trim() });
      i = end + 2;
      continue;
    }
    if (ch === '$') {
      let j = i + 1;
      while (j < text.length && !(text[j] === '$' && text[j - 1] !== '\\')) j++;
      if (j >= text.length) { buf += text.slice(i); break; }
      flush();
      out.push({ t: 'math', v: text.slice(i + 1, j) });
      i = j + 1;
      continue;
    }
    if (ch === '`') {
      const end = text.indexOf('`', i + 1);
      if (end === -1) { buf += text.slice(i); break; }
      flush();
      out.push({ t: 'code', v: text.slice(i + 1, end) });
      i = end + 1;
      continue;
    }
    // *emphasis*: the opening star must be followed, and the closing one
    // preceded, by a non-space — so "2 * 3" is left alone.
    if (ch === '*' && text[i + 1] !== '*' && text[i + 1] && text[i + 1] !== ' ') {
      const end = text.indexOf('*', i + 1);
      if (end !== -1 && text[end - 1] !== ' ' && text[end + 1] !== '*') {
        flush();
        out.push({ t: 'em', v: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    if (ch === '*' && text[i + 1] === '*') {
      const end = text.indexOf('**', i + 2);
      if (end === -1) { buf += text.slice(i); break; }
      flush();
      out.push({ t: 'bold', v: text.slice(i + 2, end) });
      i = end + 2;
      continue;
    }
    buf += ch;
    i += 1;
  }
  flush();
  return out;
}

// Plain-text reading of TeX for accessible names (aria-label), where a
// name must be a string: radio choices, buttons. Rendered math elsewhere
// carries KaTeX's MathML, which screen readers speak properly.
const TEX_WORDS = [
  [/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)'],
  [/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)'],
  [/\\sqrt\{([^{}]*)\}/g, '√($1)'],
  [/\\(mathbf|mathrm|text|operatorname|textstyle)\{([^{}]*)\}/g, '$2'],
  [/\\begin\{bmatrix\}([\s\S]*?)\\end\{bmatrix\}/g, (_, body) => `[${body.replace(/\\\\/g, '; ').replace(/&/g, ',')}]`],
  [/\\(cdot|times)/g, '×'], [/\\ne\b/g, '≠'], [/\\le\b/g, '≤'], [/\\ge\b/g, '≥'], [/\\to\b/g, '→'],
  [/\\pi\b/g, 'π'], [/\\theta\b/g, 'θ'], [/\\lambda\b/g, 'λ'], [/\\sigma\b/g, 'σ'], [/\\mu\b/g, 'μ'],
  [/\\(l|r)Vert/g, '‖'], [/\\Delta\b/g, 'Δ'], [/\\partial\b/g, '∂'], [/\\nabla\b/g, '∇'],
  [/\\(left|right|,|;|!|quad|qquad)/g, ' '], [/\\\$/g, '$'],
  [/\^\{([^{}]*)\}/g, '^$1'], [/_\{([^{}]*)\}/g, '_$1'], [/[{}]/g, ''], [/\\([a-zA-Z]+)/g, '$1'],
];

export function toPlainText(text) {
  return tokenize(String(text ?? '')).map((tok) => {
    if (tok.t === 'math' || tok.t === 'display') {
      let s = tok.v;
      for (const [re, rep] of TEX_WORDS) s = s.replace(re, rep);
      return s.replace(/\s+/g, ' ').trim();
    }
    return tok.v;
  }).join('').replace(/\s+/g, ' ').trim();
}
