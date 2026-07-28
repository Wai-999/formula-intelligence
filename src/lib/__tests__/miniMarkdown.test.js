import { describe, it, expect } from 'vitest';
import { parseMarkdown, parseInline, extractSections, slugify } from '../miniMarkdown.js';
import RESEARCH_MD from '../../../docs/research/ML-Research-Reference.md?raw';
import DATA_SOURCES_MD from '../../../docs/DATA_SOURCES.md?raw';

// This parser renders the repo's own research documents inside the app. If
// it silently mangles a table or drops a section, the Sources tab quietly
// misrepresents the very documents it exists to make verifiable — so the
// tests below run it against the real files, not toy fixtures.

describe('parseInline', () => {
  it('splits code, bold, italic and links out of plain text', () => {
    const t = parseInline('a `code` and **bold** and *it* and [x](https://e.com)');
    const types = t.map((x) => x.type);
    expect(types).toContain('code');
    expect(types).toContain('strong');
    expect(types).toContain('em');
    expect(types).toContain('link');
    expect(t.find((x) => x.type === 'link')).toMatchObject({ value: 'x', href: 'https://e.com' });
  });

  it('does not treat emphasis markers inside code spans as emphasis', () => {
    const t = parseInline('`a * b * c`');
    expect(t).toHaveLength(1);
    expect(t[0]).toMatchObject({ type: 'code', value: 'a * b * c' });
  });

  it('round-trips plain text unchanged', () => {
    expect(parseInline('nothing special here')).toEqual([{ type: 'text', value: 'nothing special here' }]);
  });
});

describe('parseMarkdown block handling', () => {
  it('parses headings with their level', () => {
    const [b] = parseMarkdown('### Third level');
    expect(b).toMatchObject({ type: 'heading', level: 3, value: 'Third level' });
  });

  it('strips the escaped-period form used by the research doc headings', () => {
    const [b] = parseMarkdown('## 6\\. Real-World Forecasting Domains');
    expect(b.value).toBe('6. Real-World Forecasting Domains');
  });

  it('parses a table into header and rows', () => {
    const [b] = parseMarkdown('| A | B |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |');
    expect(b.type).toBe('table');
    expect(b.header).toEqual(['A', 'B']);
    expect(b.rows).toEqual([['1', '2'], ['3', '4']]);
  });

  it('distinguishes ordered from unordered lists', () => {
    expect(parseMarkdown('- a\n- b')[0]).toMatchObject({ type: 'list', ordered: false });
    expect(parseMarkdown('1. a\n2. b')[0]).toMatchObject({ type: 'list', ordered: true });
  });

  it('keeps fenced code verbatim, including blank lines', () => {
    const [b] = parseMarkdown('```js\nconst a = 1;\n\nconst b = 2;\n```');
    expect(b).toMatchObject({ type: 'code', lang: 'js' });
    expect(b.value).toBe('const a = 1;\n\nconst b = 2;');
  });

  it('joins a wrapped paragraph into one block and stops at a blank line', () => {
    const blocks = parseMarkdown('one two\nthree four\n\nsecond para');
    expect(blocks).toHaveLength(2);
    expect(blocks[0].value).toBe('one two three four');
  });

  it('recognizes rules and blockquotes', () => {
    expect(parseMarkdown('---')[0].type).toBe('rule');
    expect(parseMarkdown('> quoted line')[0]).toMatchObject({ type: 'quote', value: 'quoted line' });
  });

  it('never throws on empty or nullish input', () => {
    for (const v of ['', null, undefined]) expect(parseMarkdown(v)).toEqual([]);
  });
});

describe('against the real shipped documents', () => {
  const blocks = parseMarkdown(RESEARCH_MD);

  it('parses the research reference without losing its structure', () => {
    const counts = blocks.reduce((a, b) => ({ ...a, [b.type]: (a[b.type] || 0) + 1 }), {});
    expect(counts.heading).toBeGreaterThan(20);
    expect(counts.table).toBeGreaterThan(10);
    expect(counts.paragraph).toBeGreaterThan(15);
  });

  it('produces no empty or malformed table rows', () => {
    for (const t of blocks.filter((b) => b.type === 'table')) {
      expect(t.header.length).toBeGreaterThan(1);
      for (const row of t.rows) expect(row.length).toBe(t.header.length);
    }
  });

  it('exposes the seven numbered sections MLCitation links to', () => {
    const sections = extractSections(blocks);
    expect(sections.map((s) => s.section)).toEqual(['1', '2', '3', '4', '5', '6', '7']);
  });

  it('gives every section a unique, non-empty anchor slug', () => {
    const slugs = extractSections(blocks).map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s.length).toBeGreaterThan(3);
  });

  it('parses the data-sources policy document too', () => {
    const b = parseMarkdown(DATA_SOURCES_MD);
    expect(b.filter((x) => x.type === 'heading').length).toBeGreaterThan(5);
  });
});

describe('slugify', () => {
  it('produces url-safe, lowercase, hyphenated anchors', () => {
    expect(slugify('6. Real-World Forecasting Domains!')).toBe('6-real-world-forecasting-domains');
  });

  it('is stable for the same input', () => {
    expect(slugify('Model Catalog')).toBe(slugify('Model Catalog'));
  });
});
