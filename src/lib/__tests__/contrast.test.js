import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHAPTERS, chapterTextColor } from '../../data/chapters.js';

// An axe-core audit found 36 WCAG violations, 31 of them one design token
// used below 4.5:1. Contrast is exactly the kind of regression that ships
// unnoticed — nothing breaks, text just quietly becomes unreadable for
// anyone with less-than-perfect vision or a dim screen. These tests make the
// palette itself the thing under test, so a future colour tweak has to
// clear the bar deliberately.

const luminance = (hex) => {
  const c = hex.replace('#', '').match(/../g).map((h) => parseInt(h, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

export const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)];
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
};

// Every background a text token is actually rendered on.
const BACKGROUNDS = ['#10111f', '#151628', '#191923', '#1a1a3a', '#0f0f1a', '#0b0c18'];
const AA_NORMAL = 4.5;

function tokenFromCss(name, theme = 'dark') {
  // Read the real stylesheet: the point is to test what ships, not a
  // duplicated copy of the palette that could drift from it. (import.meta.url
  // resolves to an http:// URL under the jsdom environment, so this goes via
  // the project root instead.)
  const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');
  // Each theme is one block; scope the search to the right one or the dark
  // value is found first and the light palette is never actually tested.
  const block = theme === 'light'
    ? css.slice(css.indexOf("[data-theme='light']"))
    : css.slice(0, css.indexOf("[data-theme='light']"));
  const m = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(block);
  return m?.[1] || null;
}

const LIGHT_BACKGROUNDS = ['#f7f8fb', '#ffffff', '#eef1f6', '#f2f4f9', '#f8f9fc'];

describe('text colour tokens meet WCAG AA on every surface', () => {
  for (const token of ['text-primary', 'text-muted', 'text-faint', 'primary-text']) {
    it(`--${token} clears ${AA_NORMAL}:1 everywhere it is used`, () => {
      const hex = tokenFromCss(token);
      expect(hex, `--${token} should exist in index.css`).toBeTruthy();
      const failures = BACKGROUNDS
        .map((bg) => ({ bg, ratio: contrast(hex, bg) }))
        .filter((r) => r.ratio < AA_NORMAL)
        .map((r) => `${r.bg}: ${r.ratio.toFixed(2)}`);
      expect(failures, `${hex} fails on`).toEqual([]);
    });
  }

  it('keeps --text-faint above the value that caused 31 violations', () => {
    // Regression guard: #657083 measured 3.35-3.74.
    expect(tokenFromCss('text-faint')).not.toBe('#657083');
  });
});

describe('light theme text tokens meet WCAG AA', () => {
  // The light palette is the likeliest to regress: someone tweaking colours
  // in dark mode never sees it, and an axe run in one theme cannot catch it.
  for (const token of ['text-primary', 'text-muted', 'text-faint', 'primary-text', 'accent', 'success', 'warning', 'danger']) {
    it(`--${token} clears ${AA_NORMAL}:1 on light surfaces`, () => {
      const hex = tokenFromCss(token, 'light');
      expect(hex, `--${token} should be defined in the light block`).toBeTruthy();
      const failures = LIGHT_BACKGROUNDS
        .map((bg) => ({ bg, ratio: contrast(hex, bg) }))
        .filter((r) => r.ratio < AA_NORMAL)
        .map((r) => `${r.bg}: ${r.ratio.toFixed(2)}`);
      expect(failures, `${hex} fails on`).toEqual([]);
    });
  }

  it('defines a distinct value per theme rather than reusing the dark one', () => {
    for (const token of ['text-primary', 'accent', 'warning']) {
      expect(tokenFromCss(token, 'light')).not.toBe(tokenFromCss(token, 'dark'));
    }
  });
});

describe('chapter colours used as text', () => {
  it('gives every chapter a text colour that clears AA on card backgrounds', () => {
    const failures = CHAPTERS
      .map((ch) => ({ id: ch.id, hex: chapterTextColor(ch), ratio: contrast(chapterTextColor(ch), '#1a1a3a') }))
      .filter((r) => r.ratio < AA_NORMAL)
      .map((r) => `ch${r.id} ${r.hex} = ${r.ratio.toFixed(2)}`);
    expect(failures).toEqual([]);
  });

  it('only overrides the chapters whose identity colour genuinely fails', () => {
    // Identity colours are load-bearing on the map; the override exists to
    // fix text legibility, not to quietly restyle the graph.
    const overridden = CHAPTERS.filter((ch) => ch.textColor).map((ch) => ch.id);
    for (const id of overridden) {
      const ch = CHAPTERS.find((c) => c.id === id);
      expect(contrast(ch.color, '#1a1a3a'), `ch${id} would not have needed an override`).toBeLessThan(AA_NORMAL);
    }
  });

  it('gives every chapter a light-theme text colour that clears AA on white', () => {
    const failures = CHAPTERS
      .map((ch) => ({ id: ch.id, hex: chapterTextColor(ch, 'light') }))
      .map((r) => ({ ...r, ratio: Math.min(...LIGHT_BACKGROUNDS.map((bg) => contrast(r.hex, bg))) }))
      .filter((r) => r.ratio < AA_NORMAL)
      .map((r) => `ch${r.id} ${r.hex} = ${r.ratio.toFixed(2)}`);
    expect(failures).toEqual([]);
  });

  it('falls back to the identity colour when no override exists', () => {
    const plain = CHAPTERS.find((ch) => !ch.textColor);
    if (plain) expect(chapterTextColor(plain)).toBe(plain.color);
    expect(chapterTextColor(undefined)).toBe('inherit');
  });
});
