import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { readVersioned, writeVersioned } from '../lib/versioned.js';

// The diagnostic record (§8): every attempt is kept — retakes add, they
// never overwrite — and the placement says where it came from, so a learner
// can always see why a course was recommended and replace it by hand.

const SPEC = {
  version: 1,
  empty: () => ({ schemaVersion: 1, firstRun: null, attempts: [], placement: null }),
  validate: (r) => Array.isArray(r.attempts) && (r.placement === null || (typeof r.placement === 'object' && !Array.isArray(r.placement))),
};

const initial = readVersioned(STORAGE_KEYS.diagnostic, SPEC);

const save = (s) => writeVersioned(STORAGE_KEYS.diagnostic, {
  schemaVersion: SPEC.version, firstRun: s.firstRun, attempts: s.attempts, placement: s.placement,
});

export const useDiagnosticStore = create((set, get) => ({
  firstRun: initial.firstRun,
  attempts: initial.attempts,
  placement: initial.placement,

  /** Home's first-run choice: 'diagnostic' | 'prealgebra' | 'explore'. */
  chooseFirstRun(choice) {
    set({ firstRun: choice });
    save(get());
  },

  /** Store a finished attempt (responses and the engine's result). */
  saveAttempt(attempt) {
    const attempts = [...get().attempts, attempt];
    set({ attempts });
    save(get());
  },

  /** source: 'diagnostic' | 'manual' | 'start' */
  setPlacement(course, source, attemptId = null, now = Date.now()) {
    set({ placement: course ? { course, source, attemptId, at: now } : null });
    save(get());
  },
}));
