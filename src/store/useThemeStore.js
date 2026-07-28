import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

export const THEMES = ['dark', 'light'];

// Respect the operating system's setting for a first-time visitor rather
// than assuming dark: someone browsing in a bright room with light mode set
// system-wide has already told us what they want.
function systemPreference() {
  try {
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function initial() {
  const saved = loadJSON(STORAGE_KEYS.theme, null);
  return THEMES.includes(saved) ? saved : systemPreference();
}

/**
 * Applying the theme is a DOM write, not React state: every rule reads
 * CSS custom properties off [data-theme], so one attribute swaps the whole
 * palette without a single component re-rendering.
 */
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export const useThemeStore = create((set, get) => ({
  theme: initial(),

  setTheme(theme) {
    if (!THEMES.includes(theme)) return;
    saveJSON(STORAGE_KEYS.theme, theme);
    applyTheme(theme);
    set({ theme });
  },

  toggle() {
    get().setTheme(get().theme === 'dark' ? 'light' : 'dark');
  },
}));
