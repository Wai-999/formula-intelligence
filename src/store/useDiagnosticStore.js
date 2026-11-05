import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { readVersioned, writeVersioned } from '../lib/versioned.js';

// The diagnostic record (§8): every attempt is kept — retakes add, they
// never overwrite — and the placement says where it came from, so a learner
// can always see why a course was recommended and replace it by hand.
//
// `path` is the learning path the learner chose to follow ({ id, at }; null
// means the default route, src/data/curriculum/pathways.js). It lives here,
// beside the starting point, rather than under a key of its own: it is the
// same kind of choice, and backups already include this record. The field is
// optional, so there is no schema change: older records simply have none.

const SPEC = {
  version: 1,
  empty: () => ({ schemaVersion: 1, firstRun: null, attempts: [], placement: null, path: null }),
  validate: (r) => Array.isArray(r.attempts) && (r.placement === null || (typeof r.placement === 'object' && !Array.isArray(r.placement))),
};

// A malformed path choice is dropped, never a reason to set the whole record
// (and its placement attempts) aside.
const validPath = (p) => (p && typeof p === 'object' && typeof p.id === 'string' ? p : null);

const initial = readVersioned(STORAGE_KEYS.diagnostic, SPEC);

const save = (s) => writeVersioned(STORAGE_KEYS.diagnostic, {
  schemaVersion: SPEC.version, firstRun: s.firstRun, attempts: s.attempts, placement: s.placement, path: s.path,
});

export const useDiagnosticStore = create((set, get) => ({
  firstRun: initial.firstRun,
  attempts: initial.attempts,
  placement: initial.placement,
  path: validPath(initial.path),

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

  /** Follow a learning path or applied track; null returns to the default route. */
  choosePath(id, now = Date.now()) {
    set({ path: id ? { id, at: now } : null });
    save(get());
  },
}));
