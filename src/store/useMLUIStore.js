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
//
// Playground, Evaluation and the Gold/Macro/Micro/Politics labs were removed
// as top-level tabs (Master Prompt V3.1 §4). Playground and Evaluation live on
// as lessons inside Pipeline (src/data/ml/lessons.js); the four domain labs
// are archived — their code is unreferenced and tree-shaken. Old ids still
// resolve: see RETIRED_ML_TABS in useUIStore.js.
export const ML_TABS = [
  { id: 'pipeline', label: 'Pipeline', title: blSame('Pipeline'), icon: 'ti-route', module: 2 },
  { id: 'modelmap', label: 'Model Map', title: blSame('Model Map'), icon: 'ti-sitemap', module: 3 },
  { id: 'python', label: 'Python', title: blSame('Python Hub'), icon: 'ti-brand-python', module: 10 },
  { id: 'pylab', label: 'Lab', title: blSame('Python Lab'), icon: 'ti-flask-2', module: 11 },
  { id: 'sources', label: 'Sources', title: blSame('Sources & Data Provenance'), icon: 'ti-license', module: 12 },
];

export const useMLUIStore = create((set) => ({
  // Beginner/Researcher depth — cross-cutting, lives at the shell level so
  // every page reads the same value. Persisted like the other user prefs.
  level: savedPrefs.level === 'researcher' ? 'researcher' : 'beginner',
  selectedModelId: null,

  setLevel(level) {
    set({ level });
    // The record keeps its historical { level, lang } shape so a rolled-back
    // (bilingual) build can still read it; this build is English-only.
    saveJSON(PREFS_KEY, { level, lang: 'en' });
  },

  selectModel(id) {
    set({ selectedModelId: id });
  },
}));
