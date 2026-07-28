// A deliberately small Markdown → token-tree parser.
//
// Scope is set by the only thing it ever renders: this repo's own docs
// (docs/research/*.md, docs/DATA_SOURCES.md). That means headings, lists,
// tables, blockquotes, fenced code, rules, and inline emphasis/code/links —
// and nothing else. A general-purpose parser would be a dependency plus a
// large slice of bundle for features these documents never use.
//
// It emits a token tree, never an HTML string, so the renderer can build
// React elements directly. There is no dangerouslySetInnerHTML anywhere in
// this path, which makes the whole surface XSS-proof by construction rather
// than by sanitizing.

/** Parse inline spans: `code`, **bold**, *italic*, [text](href). */
export function parseInline(text) {
  const out = [];
  // Ordered so `code` wins over emphasis inside it.
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ type: 'text', value: text.slice(last, m.index) });
    const tok = m[0];
    if (tok.startsWith('`')) {
      out.push({ type: 'code', value: tok.slice(1, -1) });
    } else if (tok.startsWith('**')) {
      out.push({ type: 'strong', value: tok.slice(2, -2) });
    } else if (tok.startsWith('[')) {
      const cut = tok.indexOf('](');
      out.push({ type: 'link', value: tok.slice(1, cut), href: tok.slice(cut + 2, -1) });
    } else {
      out.push({ type: 'em', value: tok.slice(1, -1) });
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out;
}

const splitRow = (line) =>
  line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

/**
 * Parse a markdown document into block tokens.
 * @returns {Array<object>} blocks: heading | paragraph | list | table | code | rule | quote
 */
export function parseMarkdown(md) {
  const lines = String(md ?? '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // blank
    if (!line.trim()) { i++; continue; }

    // fenced code
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const body = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) { body.push(lines[i]); i++; }
      i++; // closing fence
      blocks.push({ type: 'code', lang, value: body.join('\n') });
      continue;
    }

    // horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { blocks.push({ type: 'rule' }); i++; continue; }

    // heading — the doc's "## 1\. Title" escaping is normalized away so
    // anchors and displayed text both read as "1. Title".
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      blocks.push({ type: 'heading', level: h[1].length, value: h[2].replace(/\\/g, '').trim() });
      i++;
      continue;
    }

    // blockquote
    if (line.startsWith('> ')) {
      const body = [];
      while (i < lines.length && lines[i].startsWith('> ')) { body.push(lines[i].slice(2)); i++; }
      blocks.push({ type: 'quote', value: body.join(' ') });
      continue;
    }

    // table: a header row followed by a |---|---| separator
    if (line.includes('|') && /^\s*\|?[\s:-]*-[\s:|-]*$/.test(lines[i + 1] || '')) {
      const header = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', header, rows });
      continue;
    }

    // list (ordered or unordered), including simple nesting by indent
    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s/.test(line);
      const items = [];
      while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
        const indent = lines[i].match(/^\s*/)[0].length;
        items.push({ depth: indent >= 2 ? 1 : 0, value: lines[i].replace(/^\s*([-*+]|\d+\.)\s+/, '') });
        i++;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    // paragraph — consume until a blank line or the start of another block
    const para = [];
    while (
      i < lines.length && lines[i].trim()
      && !/^(#{1,6}\s|```|>\s|\s*([-*+]|\d+\.)\s)/.test(lines[i])
      && !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])
    ) { para.push(lines[i]); i++; }
    if (para.length) blocks.push({ type: 'paragraph', value: para.join(' ') });
  }

  return blocks;
}

/** Stable slug for heading anchors and deep links. */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

/**
 * Top-level (##) sections with their heading, slug, and the section number
 * when the heading starts with one — which is what MLCitation's "§N"
 * references point at.
 */
export function extractSections(blocks) {
  return blocks
    .filter((b) => b.type === 'heading' && b.level === 2)
    .map((b) => {
      const num = /^(\d+)[.\s]/.exec(b.value);
      return { title: b.value, slug: slugify(b.value), section: num ? num[1] : null };
    });
}
