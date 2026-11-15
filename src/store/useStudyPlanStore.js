import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

// Study-planning preferences (V5.1 §4 "working-student routine", §7 target
// toggle): how long today's session is, which transfer target orders
// Learn → Ohlone Major Prep, and the learner's study habit — which days,
// after what everyday moment, at what time (docs/learning-8020/STUDY_HABITS.md).
// Preferences, not evidence: kept on a progress reset (src/lib/backup.js
// PREFERENCE_KEYS), included in backups, and never used to judge mastery.

export const TIMEBOXES = ['15', '30-45', '60-90'];
export const TARGETS = ['sjsu', 'csueb', 'uc'];

/** Sanitise a stored habit: weekdays 0–6, a short cue, an HH:MM time. Anything else is dropped. */
export function cleanHabit(h) {
  if (!h || typeof h !== 'object') return null;
  const days = [...new Set(Array.isArray(h.days) ? h.days.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6) : [])].sort();
  if (!days.length) return null;
  const cue = typeof h.cue === 'string' ? h.cue.trim().slice(0, 60) : '';
  const time = typeof h.time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(h.time) ? h.time : '';
  return { days, cue, time, since: typeof h.since === 'number' ? h.since : null };
}

/** Read and sanitise the stored choices; anything unknown falls back to the default. */
export function readStudyPlan() {
  const saved = loadJSON(STORAGE_KEYS.studyPlan, null);
  return {
    timebox: TIMEBOXES.includes(saved?.timebox) ? saved.timebox : null,
    target: TARGETS.includes(saved?.target) ? saved.target : 'sjsu',
    habit: cleanHabit(saved?.habit),
  };
}

const persist = ({ timebox, target, habit }) => saveJSON(STORAGE_KEYS.studyPlan, { timebox, target, habit });

export const useStudyPlanStore = create((set, get) => ({
  ...readStudyPlan(),

  setTimebox(timebox) {
    if (!TIMEBOXES.includes(timebox)) return;
    set({ timebox });
    persist(get());
  },

  setTarget(target) {
    if (!TARGETS.includes(target)) return;
    set({ target });
    persist(get());
  },

  /** Save the study habit (or clear it with null). Returns false when the habit has no days. */
  setHabit(habit, now = Date.now()) {
    if (habit === null) { set({ habit: null }); persist(get()); return true; }
    const clean = cleanHabit({ ...habit, since: get().habit?.since ?? now });
    if (!clean) return false;
    set({ habit: clean });
    persist(get());
    return true;
  },
}));
