import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { lessonById } from '../data/curriculum/lessons/index.js';
import { readVersioned, writeVersioned } from '../lib/versioned.js';
import {
  RESUME_VERSION, emptyRecord, sanitizeRecord, sanitizeLocation, withAuto, withPin, withoutPin, mergeForWrite, samePlace,
} from '../lib/studyResume.js';
import { useUIStore } from './useUIStore.js';

// Saved study places (fi_resume_v1; docs/study-continuity/ARCHITECTURE.md).
// Its own key, not new fields in fi_lessons_v1: places are written often
// (every few seconds of reading), lesson completion rarely, and a problem
// with one must never cost the other. Places only — answers, checkpoints,
// notes and reviews stay where they are, and nothing here changes them.
//
// Every write re-reads storage first and merges (mergeForWrite), because
// another tab of the app may have written since this one loaded: an
// automatic save keeps the stored pin, so it can never undo a newer
// "Save my place" or "Remove saved place" made elsewhere.

const SPEC = {
  version: RESUME_VERSION,
  empty: emptyRecord,
  validate: (r) => r !== null && typeof r === 'object',
};

const readStored = () => sanitizeRecord(readVersioned(STORAGE_KEYS.resume, SPEC));

// A place the app is asked to save must name a written lesson, its own
// course and one of the six steps. (Stored places are checked more gently:
// see resolveLocation.)
function placeToSave(loc, source, now) {
  const place = sanitizeLocation({ ...loc, at: now, source }, now);
  if (!place || !place.sectionId) return null;
  const lesson = Object.hasOwn(lessonById, place.lessonId) ? lessonById[place.lessonId] : null;
  return lesson && lesson.course === place.courseId ? place : null;
}
const initial = readStored();
let nextToken = 1;

export const useStudyResumeStore = create((set, get) => {
  const snapshot = () => ({ schemaVersion: RESUME_VERSION, pinned: get().pinned, current: get().current, recent: get().recent });

  /**
   * Merge with what is stored, write, and report whether it reached storage.
   * In memory the new places apply either way, so a learner whose browser
   * refuses storage keeps them for this visit — and is told they were not
   * saved (saveState.ok false), never that they were.
   */
  const persist = (mine, kind, now) => {
    const record = mergeForWrite(readStored(), mine, kind);
    const ok = writeVersioned(STORAGE_KEYS.resume, record);
    const pinChange = kind !== 'auto';
    set({
      pinned: record.pinned,
      current: record.current,
      recent: record.recent,
      saveState: { ok, kind, at: now },
      // A pin that never reached storage must not be dropped by the next
      // automatic save's merge (which keeps the STORED pin): carry it until
      // a write succeeds.
      pinDirty: pinChange ? !ok : get().pinDirty && !ok,
    });
    return ok;
  };

  return {
    pinned: initial.pinned,
    current: initial.current,
    recent: initial.recent,
    /** The last write: { ok, kind: 'auto' | 'pin' | 'unpin', at }, or null before any. */
    saveState: null,
    pinDirty: false,
    /** A resume the learner asked for, waiting for its lesson to load: { lessonId, sectionId, fraction, token }. */
    pendingResume: null,
    /** What "Finish study session" saved, for its summary: { loc, ok, startedAt, finishedAt, answered }. */
    lastSession: null,

    /** Save where the learner is, automatically. Never moves the pin. Returns whether it reached storage. */
    autoSave(loc, now = Date.now()) {
      const place = placeToSave(loc, 'auto', now);
      if (!place) return false;
      if (samePlace(get().current, place) && get().saveState?.ok !== false) return true;
      return persist(withAuto(snapshot(), place), get().pinDirty ? 'pin' : 'auto', now);
    },

    /** "Save my place". Returns true only when the place reached storage. */
    savePlace(loc, now = Date.now()) {
      const place = placeToSave(loc, 'manual', now);
      if (!place) return false;
      return persist(withPin(snapshot(), place), 'pin', now);
    },

    /** "Remove saved place": the pin only. */
    removePin(now = Date.now()) {
      return persist(withoutPin(snapshot()), 'unpin', now);
    },

    /**
     * Open a lesson at a saved place. The lesson page restores the step once
     * its content has loaded, then calls `consumeResume`, so the jump happens
     * once — not on every later visit to the lesson.
     */
    requestResume(loc) {
      const place = sanitizeLocation({ ...loc, at: loc?.at ?? Date.now() });
      if (!place) return;
      set({ pendingResume: { lessonId: place.lessonId, sectionId: place.sectionId, fraction: place.fraction, token: nextToken++ } });
      useUIStore.getState().goTo('learn/lesson', { lessonId: place.lessonId });
    },

    consumeResume(token) {
      if (get().pendingResume?.token === token) set({ pendingResume: null });
    },

    /**
     * "Finish study session": save the place as the learner's saved place and
     * show the summary. Never marks anything complete. Returns whether the
     * place reached storage.
     */
    finishSession({ loc, startedAt = null, answered = null }, now = Date.now()) {
      const ok = get().savePlace(loc, now);
      const place = placeToSave(loc, 'manual', now);
      set({ lastSession: { loc: place, ok, startedAt, finishedAt: now, answered } });
      useUIStore.getState().goTo('learn/session');
      return ok;
    },

    /** Another tab wrote: take its places, keeping a pin this tab has not managed to store yet. */
    syncFromStorage() {
      const r = readStored();
      set({ pinned: get().pinDirty ? get().pinned : r.pinned, current: r.current, recent: r.recent });
    },
  };
});

// Same browser, another tab: keep this one's Home, course pages and lesson
// bar in agreement with what is stored. (`key` is null after a storage clear.)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.resume || e.key === null) useStudyResumeStore.getState().syncFromStorage();
  });
}
