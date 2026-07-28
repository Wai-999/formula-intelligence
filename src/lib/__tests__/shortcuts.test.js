import { describe, it, expect } from 'vitest';
import { matchShortcut, isTypingTarget, SHORTCUTS } from '../shortcuts.js';

const key = (k, opts = {}) => ({
  key: k, metaKey: false, ctrlKey: false, altKey: false,
  target: { tagName: 'BODY', isContentEditable: false }, ...opts,
});
const inInput = (tag) => ({ tagName: tag, isContentEditable: false });

describe('isTypingTarget', () => {
  it('recognises the elements that swallow plain-letter shortcuts', () => {
    for (const tag of ['INPUT', 'TEXTAREA', 'SELECT']) {
      expect(isTypingTarget(inInput(tag)), tag).toBe(true);
    }
    expect(isTypingTarget({ tagName: 'DIV', isContentEditable: true })).toBe(true);
    expect(isTypingTarget({ tagName: 'DIV', isContentEditable: false })).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });
});

describe('matchShortcut', () => {
  it('maps every documented single-key shortcut', () => {
    expect(matchShortcut(key('?'))).toBe('help');
    expect(matchShortcut(key('Escape'))).toBe('escape');
    expect(matchShortcut(key('t'))).toBe('theme');
    expect(matchShortcut(key('m'))).toBe('mode');
    expect(matchShortcut(key('/'))).toBe('search');
    expect(matchShortcut(key('['))).toBe('prevTab');
    expect(matchShortcut(key(']'))).toBe('nextTab');
  });

  it('accepts the uppercase form, since Shift is how you type ? anyway', () => {
    expect(matchShortcut(key('T'))).toBe('theme');
    expect(matchShortcut(key('M'))).toBe('mode');
  });

  it('maps digits 1-9 to zero-based tab indices', () => {
    expect(matchShortcut(key('1'))).toBe('tab:0');
    expect(matchShortcut(key('9'))).toBe('tab:8');
    expect(matchShortcut(key('0'))).toBeNull();
  });

  it('NEVER fires while the user is typing', () => {
    // The bug this prevents: pressing "t" mid-sentence in the Lab editor
    // flipping the whole app's theme.
    for (const k of ['t', 'm', '/', '[', ']', '1', '?']) {
      expect(matchShortcut(key(k, { target: inInput('TEXTAREA') })), k).toBeNull();
      expect(matchShortcut(key(k, { target: inInput('INPUT') })), k).toBeNull();
    }
  });

  it('still allows Escape while typing — it is how you leave the field', () => {
    expect(matchShortcut(key('Escape', { target: inInput('INPUT') }))).toBe('escape');
    expect(matchShortcut(key('Escape', { target: inInput('TEXTAREA') }))).toBe('escape');
  });

  it('never hijacks a browser or OS combination', () => {
    for (const mod of ['metaKey', 'ctrlKey', 'altKey']) {
      expect(matchShortcut(key('t', { [mod]: true })), mod).toBeNull();
      expect(matchShortcut(key('1', { [mod]: true })), mod).toBeNull();
    }
  });

  it('ignores keys it does not claim', () => {
    for (const k of ['a', 'Z', 'Enter', 'Tab', 'ArrowLeft', ' ']) {
      expect(matchShortcut(key(k)), k).toBeNull();
    }
  });
});

describe('the documented table', () => {
  it('documents every key the handler actually implements', () => {
    const documented = SHORTCUTS.flatMap((s) => s.keys);
    for (const k of ['?', 'Esc', 't', 'm', '/', '[', ']']) {
      expect(documented, `${k} should be listed in the help overlay`).toContain(k);
    }
  });

  it('gives every entry a label and a group', () => {
    for (const s of SHORTCUTS) {
      expect(s.label.length).toBeGreaterThan(5);
      expect(s.group).toBeTruthy();
      expect(s.keys.length).toBeGreaterThan(0);
    }
  });
});
