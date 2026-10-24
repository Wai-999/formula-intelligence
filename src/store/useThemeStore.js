import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

/** The palettes the stylesheet defines (src/index.css). */
export const THEMES = ['dark', 'light'];
/**
 * What the learner can choose (Master Prompt V3.1 §2/§10: light, dark or
 * system, persisted). 'system' follows the operating system live — someone
 * whose OS switches to dark at sunset gets the dark palette without touching
 * a setting. A stored 'dark'/'light' from before 'system' existed is already
 * a valid preference, so nothing needs migrating.
 */
export const PREFERENCES = ['system', 'light', 'dark'];

const LIGHT_QUERY = '(prefers-color-scheme: light)';

function systemTheme() {
  try {
    return window.matchMedia?.(LIGHT_QUERY).matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function resolveTheme(preference) {
  return THEMES.includes(preference) ? preference : systemTheme();
}

function initialPreference() {
  const saved = loadJSON(STORAGE_KEYS.theme, null);
  return PREFERENCES.includes(saved) ? saved : 'system';
}

/**
 * Applying the theme is a DOM write, not React state: every rule reads
 * CSS custom properties off [data-theme], so one attribute swaps the whole
 * palette without a single component re-rendering. index.html runs the same
 * resolution inline before any stylesheet loads, so there is no flash of the
 * wrong palette on first paint.
 */
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Motion: 'system' follows prefers-reduced-motion; 'reduce' turns animation
 * down everywhere regardless of the OS (for someone whose OS setting is out
 * of their control, e.g. a shared or managed machine).
 */
export const MOTION_PREFERENCES = ['system', 'reduce'];

export function applyMotion(motion) {
  if (motion === 'reduce') document.documentElement.setAttribute('data-motion', 'reduce');
  else document.documentElement.removeAttribute('data-motion');
}

function initialMotion() {
  const saved = loadJSON(STORAGE_KEYS.motion, null);
  return MOTION_PREFERENCES.includes(saved) ? saved : 'system';
}

export const useThemeStore = create((set, get) => ({
  preference: initialPreference(),
  theme: resolveTheme(initialPreference()),
  motion: initialMotion(),

  setMotion(motion) {
    if (!MOTION_PREFERENCES.includes(motion)) return;
    saveJSON(STORAGE_KEYS.motion, motion);
    applyMotion(motion);
    set({ motion });
  },

  setPreference(preference) {
    if (!PREFERENCES.includes(preference)) return;
    const theme = resolveTheme(preference);
    saveJSON(STORAGE_KEYS.theme, preference);
    applyTheme(theme);
    set({ preference, theme });
  },

  /** Choose a palette explicitly (also what the keyboard shortcut does). */
  setTheme(theme) {
    if (!THEMES.includes(theme)) return;
    get().setPreference(theme);
  },

  toggle() {
    get().setTheme(get().theme === 'dark' ? 'light' : 'dark');
  },

  /** Re-resolve after the OS setting changes; only matters while following it. */
  syncWithSystem() {
    if (get().preference !== 'system') return;
    const theme = systemTheme();
    if (theme !== get().theme) {
      applyTheme(theme);
      set({ theme });
    }
  },
}));

try {
  window.matchMedia?.(LIGHT_QUERY).addEventListener?.('change', () => useThemeStore.getState().syncWithSystem());
} catch {
  /* no matchMedia (tests, very old browsers): 'system' resolves once at load */
}
