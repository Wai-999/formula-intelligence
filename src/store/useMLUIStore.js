import { create } from 'zustand';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { STORAGE_KEYS } from '../data/storageKeys.js';

const PREFS_KEY = STORAGE_KEYS.mlModePrefs;
const savedPrefs = loadJSON(PREFS_KEY, { level: 'beginner', lang: 'en' });

export const ML_TABS = [
  { id: 'pipeline', label: 'Pipeline', icon: 'ti-route', module: 2 },
  { id: 'modelmap', label: 'Model Map', icon: 'ti-share-2', module: 3 },
  { id: 'playground', label: 'Playground', icon: 'ti-adjustments-horizontal', module: 4 },
  { id: 'evaluation', label: 'Evaluation', icon: 'ti-chart-histogram', module: 5 },
  { id: 'gold', label: 'Gold', icon: 'ti-coin', module: 6 },
  { id: 'macro', label: 'Macro', icon: 'ti-building-bank', module: 7 },
  { id: 'micro', label: 'Micro', icon: 'ti-shopping-cart', module: 8 },
  { id: 'politics', label: 'Politics', icon: 'ti-flag', module: 9 },
  { id: 'bridge', label: 'Stats ↔ ML', icon: 'ti-arrows-right-left', module: 10 },
];

export const useMLUIStore = create((set) => ({
  // Beginner/Researcher depth + English/Burmese language — cross-cutting
  // toggle (Module 11), lives at the ML-shell level so every ML page reads
  // the same pair. Persisted like the rest of the app's user prefs.
  level: savedPrefs.level, // 'beginner' | 'researcher'
  lang: savedPrefs.lang, // 'en' | 'my'
  selectedModelId: null,

  setLevel(level) {
    set({ level });
    saveJSON(PREFS_KEY, { level, lang: useMLUIStore.getState().lang });
  },

  setLang(lang) {
    set({ lang });
    saveJSON(PREFS_KEY, { level: useMLUIStore.getState().level, lang });
  },

  selectModel(id) {
    set({ selectedModelId: id });
  },
}));
