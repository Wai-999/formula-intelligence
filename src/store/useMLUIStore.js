import { create } from 'zustand';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { blSame } from '../lib/mlContent.js';

const PREFS_KEY = STORAGE_KEYS.mlModePrefs;
const savedPrefs = loadJSON(PREFS_KEY, { level: 'beginner', lang: 'en' });

// `label` stays a plain string — it's only used for the icon rail's
// title/aria-label attributes (MLIconRail.jsx), which are hover/
// screen-reader text, not visible content, matching the rest of Module 11's
// aria-label precedent. `title` is the bilingual one: MLBody.jsx renders it
// as the always-visible page header, which was found still hardcoded via
// `label` during the Module 11 verification pass — see BUILD_LOG.md.
export const ML_TABS = [
  { id: 'pipeline', label: 'Pipeline', title: blSame('Pipeline', 'Pipeline'), icon: 'ti-route', module: 2 },
  { id: 'modelmap', label: 'Model Map', title: blSame('Model Map', 'Model မြေပုံ'), icon: 'ti-sitemap', module: 3 },
  { id: 'playground', label: 'Playground', title: blSame('Playground', 'Playground'), icon: 'ti-adjustments-horizontal', module: 4 },
  { id: 'evaluation', label: 'Evaluation', title: blSame('Evaluation', 'အကဲဖြတ်မှု'), icon: 'ti-chart-histogram', module: 5 },
  { id: 'gold', label: 'Gold', title: blSame('Gold', 'ရွှေ'), icon: 'ti-coin', module: 6 },
  { id: 'macro', label: 'Macro', title: blSame('Macro', 'Macro'), icon: 'ti-building-bank', module: 7 },
  { id: 'micro', label: 'Micro', title: blSame('Micro', 'Micro'), icon: 'ti-shopping-cart', module: 8 },
  { id: 'politics', label: 'Politics', title: blSame('Politics', 'နိုင်ငံရေး'), icon: 'ti-flag', module: 9 },
  { id: 'bridge', label: 'Stats ↔ ML', title: blSame('Stats ↔ ML', 'Stats ↔ ML'), icon: 'ti-arrows-right-left', module: 10 },
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
