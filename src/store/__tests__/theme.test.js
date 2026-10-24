import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useThemeStore, applyTheme, resolveTheme, THEMES, PREFERENCES } from '../useThemeStore.js';
import { STORAGE_KEYS } from '../../data/storageKeys.js';

function mockSystem(light) {
  vi.spyOn(window, 'matchMedia').mockImplementation((q) => ({
    matches: q.includes('light') ? light : !light, media: q, addEventListener() {}, removeEventListener() {},
  }));
}

describe('theme store', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    useThemeStore.setState({ preference: 'dark', theme: 'dark' });
  });
  afterEach(() => vi.restoreAllMocks());

  it('offers exactly the two palettes the stylesheet defines', () => {
    expect(THEMES).toEqual(['dark', 'light']);
  });

  it('offers light, dark and system as preferences (spec §2)', () => {
    expect(PREFERENCES).toEqual(['system', 'light', 'dark']);
  });

  it('writes the theme to the document, which is what actually swaps the palette', () => {
    applyTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggles between the two palettes', () => {
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe('light');
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('persists the choice so it survives a reload', () => {
    useThemeStore.getState().setPreference('light');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.theme))).toBe('light');
    useThemeStore.getState().setPreference('system');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.theme))).toBe('system');
  });

  it('applies to the DOM as part of setting, not as a separate step a caller could forget', () => {
    useThemeStore.getState().setTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('ignores an unknown preference rather than writing a broken attribute', () => {
    useThemeStore.getState().setPreference('solarized');
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEYS.theme)).toBeNull();
  });

  it("'system' resolves from the operating system", () => {
    mockSystem(true);
    expect(resolveTheme('system')).toBe('light');
    mockSystem(false);
    expect(resolveTheme('system')).toBe('dark');
  });

  it("'system' follows a live OS change; an explicit choice does not", () => {
    mockSystem(false);
    useThemeStore.getState().setPreference('system');
    expect(useThemeStore.getState().theme).toBe('dark');
    mockSystem(true);
    useThemeStore.getState().syncWithSystem();
    expect(useThemeStore.getState().theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    useThemeStore.getState().setPreference('dark');
    useThemeStore.getState().syncWithSystem();
    expect(useThemeStore.getState().theme).toBe('dark');
  });
});

describe('motion preference', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-motion');
    useThemeStore.setState({ motion: 'system' });
  });

  it('“Reduce motion” marks the document and persists; “Match my device” clears it', () => {
    useThemeStore.getState().setMotion('reduce');
    expect(document.documentElement.getAttribute('data-motion')).toBe('reduce');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.motion))).toBe('reduce');
    useThemeStore.getState().setMotion('system');
    expect(document.documentElement.hasAttribute('data-motion')).toBe(false);
  });

  it('ignores unknown values', () => {
    useThemeStore.getState().setMotion('wild');
    expect(useThemeStore.getState().motion).toBe('system');
    expect(document.documentElement.hasAttribute('data-motion')).toBe(false);
  });
});
