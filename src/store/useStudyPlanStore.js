import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

// Study-planning preferences (V5.1 §4 "working-student routine", §7 target
// toggle): how long today's session is, and which transfer target orders
// Learn → Ohlone Major Prep. Preferences, not evidence — kept on a progress
// reset (src/lib/backup.js PREFERENCE_KEYS), included in backups, and never
// used to judge mastery or anything official.

export const TIMEBOXES = ['15', '30-45', '60-90'];
export const TARGETS = ['sjsu', 'csueb', 'uc'];

/** Read and sanitise the stored choices; anything unknown falls back to the default. */
export function readStudyPlan() {
  const saved = loadJSON(STORAGE_KEYS.studyPlan, null);
  return {
    timebox: TIMEBOXES.includes(saved?.timebox) ? saved.timebox : null,
    target: TARGETS.includes(saved?.target) ? saved.target : 'sjsu',
  };
}

export const useStudyPlanStore = create((set, get) => ({
  ...readStudyPlan(),

  setTimebox(timebox) {
    if (!TIMEBOXES.includes(timebox)) return;
    set({ timebox });
    saveJSON(STORAGE_KEYS.studyPlan, { timebox, target: get().target });
  },

  setTarget(target) {
    if (!TARGETS.includes(target)) return;
    set({ target });
    saveJSON(STORAGE_KEYS.studyPlan, { timebox: get().timebox, target });
  },
}));
