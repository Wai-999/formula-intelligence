import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

// Notebooks the learner writes themselves. Persisted to localStorage like
// every other kind of progress in this app — losing your own code to a page
// refresh is the fastest way to make a workspace feel untrustworthy.
//
// A cap exists because localStorage is a small, shared, synchronous budget
// and one runaway paste should not be able to evict a learner's mastery
// history. When the cap is hit the OLDEST notebook is dropped, never the one
// being edited.
const MAX_NOTEBOOKS = 30;
const MAX_CHARS = 60_000;

export const STARTER = `# Anything you can import here runs in your browser.
# NumPy, SciPy, pandas, scikit-learn, statsmodels and matplotlib are ready.
import numpy as np

rng = np.random.default_rng(0)
sample = rng.normal(100, 15, 500)

print(f"mean   = {sample.mean():.2f}")
print(f"median = {np.median(sample):.2f}")
print(f"sd     = {sample.std(ddof=1):.2f}")

# Uncomment to draw a chart — plots render below the output.
# import matplotlib.pyplot as plt
# plt.hist(sample, bins=30)
# plt.title("Sample distribution")
`;

const newId = () => `nb_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function seed() {
  const saved = loadJSON(STORAGE_KEYS.pyLab, null);
  if (saved?.notebooks?.length) return saved;
  const first = { id: newId(), name: 'Scratchpad', code: STARTER, updated: Date.now() };
  return { notebooks: [first], activeId: first.id };
}

const persist = (state) => saveJSON(STORAGE_KEYS.pyLab, {
  notebooks: state.notebooks,
  activeId: state.activeId,
});

export const usePyLabStore = create((set, get) => ({
  ...seed(),

  active() {
    const { notebooks, activeId } = get();
    return notebooks.find((n) => n.id === activeId) || notebooks[0] || null;
  },

  setCode(code) {
    set((s) => {
      const capped = String(code).slice(0, MAX_CHARS);
      const notebooks = s.notebooks.map((n) =>
        (n.id === s.activeId ? { ...n, code: capped, updated: Date.now() } : n));
      const next = { ...s, notebooks };
      persist(next);
      return { notebooks };
    });
  },

  rename(id, name) {
    set((s) => {
      const notebooks = s.notebooks.map((n) => (n.id === id ? { ...n, name: name.slice(0, 60) || 'Untitled' } : n));
      const next = { ...s, notebooks };
      persist(next);
      return { notebooks };
    });
  },

  /** Create a notebook, optionally seeded (used by "Open in Lab" from the Hub). */
  create(name = 'Untitled', code = STARTER) {
    const nb = { id: newId(), name: name.slice(0, 60), code: String(code).slice(0, MAX_CHARS), updated: Date.now() };
    set((s) => {
      // Drop the oldest, never the newly-created one, if we are at the cap.
      const kept = s.notebooks.length >= MAX_NOTEBOOKS
        ? [...s.notebooks].sort((a, b) => b.updated - a.updated).slice(0, MAX_NOTEBOOKS - 1)
        : s.notebooks;
      const next = { ...s, notebooks: [nb, ...kept], activeId: nb.id };
      persist(next);
      return { notebooks: next.notebooks, activeId: nb.id };
    });
    return nb.id;
  },

  select(id) {
    set((s) => {
      if (!s.notebooks.some((n) => n.id === id)) return s;
      const next = { ...s, activeId: id };
      persist(next);
      return { activeId: id };
    });
  },

  remove(id) {
    set((s) => {
      const notebooks = s.notebooks.filter((n) => n.id !== id);
      // Never leave the lab with nothing open — recreate a scratchpad.
      if (notebooks.length === 0) {
        const fresh = { id: newId(), name: 'Scratchpad', code: STARTER, updated: Date.now() };
        const next = { notebooks: [fresh], activeId: fresh.id };
        persist(next);
        return next;
      }
      const activeId = s.activeId === id ? notebooks[0].id : s.activeId;
      const next = { ...s, notebooks, activeId };
      persist(next);
      return { notebooks, activeId };
    });
  },
}));

export const PY_LAB_LIMITS = { MAX_NOTEBOOKS, MAX_CHARS };
