import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useThemeStore, applyTheme, THEMES } from '../useThemeStore.js';
import { STORAGE_KEYS } from '../../data/storageKeys.js';

describe('theme store', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    useThemeStore.setState({ theme: 'dark' });
  });
  afterEach(() => vi.restoreAllMocks());

  it('offers exactly the two themes the stylesheet defines', () => {
    expect(THEMES).toEqual(['dark', 'light']);
  });

  it('writes the theme to the document, which is what actually swaps the palette', () => {
    applyTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggles between the two themes', () => {
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe('light');
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('persists the choice so it survives a reload', () => {
    useThemeStore.getState().setTheme('light');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.theme))).toBe('light');
  });

  it('applies to the DOM as part of setting, not as a separate step a caller could forget', () => {
    useThemeStore.getState().setTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('ignores an unknown theme rather than writing a broken attribute', () => {
    useThemeStore.getState().setTheme('solarized');
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEYS.theme)).toBeNull();
  });
});
