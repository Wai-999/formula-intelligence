import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { readVersioned, writeVersioned } from '../lib/versioned.js';

// Code-exercise drafts and results, and project progress (§11: "project
// progress, and code drafts with explicit schema versions").

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const EX = { version: 1, empty: () => ({ schemaVersion: 1, drafts: {}, results: {} }), validate: (r) => isObj(r.drafts) && isObj(r.results) };
const PROJ = { version: 1, empty: () => ({ schemaVersion: 1, projects: {} }), validate: (r) => isObj(r.projects) };
const MAX_DRAFT = 20_000;

const ex = readVersioned(STORAGE_KEYS.pyExercises, EX);
const proj = readVersioned(STORAGE_KEYS.projects, PROJ);

export const useWorkStore = create((set, get) => ({
  drafts: ex.drafts,
  results: ex.results,
  projects: proj.projects,

  saveDraft(exerciseId, code) {
    const drafts = { ...get().drafts, [exerciseId]: String(code).slice(0, MAX_DRAFT) };
    set({ drafts });
    writeVersioned(STORAGE_KEYS.pyExercises, { schemaVersion: EX.version, drafts, results: get().results });
  },

  /** Record a graded attempt. `passed` is true only when every test passed. */
  recordResult(exerciseId, passed, now = Date.now()) {
    const prev = get().results[exerciseId] ?? { attempts: 0, passed: false };
    const results = { ...get().results, [exerciseId]: { attempts: prev.attempts + 1, passed: prev.passed || passed, lastPassed: passed, at: now } };
    set({ results });
    writeVersioned(STORAGE_KEYS.pyExercises, { schemaVersion: EX.version, drafts: get().drafts, results });
  },

  updateStep(projectId, stepId, patch, now = Date.now()) {
    const p = get().projects[projectId] ?? { started: now, steps: {} };
    const projects = {
      ...get().projects,
      [projectId]: { ...p, updated: now, steps: { ...p.steps, [stepId]: { ...(p.steps[stepId] ?? {}), ...patch } } },
    };
    set({ projects });
    writeVersioned(STORAGE_KEYS.projects, { schemaVersion: PROJ.version, projects });
  },
}));
