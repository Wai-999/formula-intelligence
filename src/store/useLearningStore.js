import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { readVersioned, writeVersioned } from '../lib/versioned.js';
import { review } from '../lib/reviewSchedule.js';

// The learner's record for the V3.1 curriculum: evidence (what they have
// demonstrated), review cards (when to look again), lesson progress and
// lesson notes. Three keys rather than one so a large notes record can never
// make a progress write fail, and each has its own schema version.

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

const LEARNING = {
  version: 1,
  empty: () => ({ schemaVersion: 1, evidence: [], cards: {} }),
  validate: (r) => Array.isArray(r.evidence) && isObj(r.cards),
};
const LESSONS = {
  version: 1,
  empty: () => ({ schemaVersion: 1, lessons: {}, last: null }),
  validate: (r) => isObj(r.lessons),
};
const NOTES = {
  version: 1,
  empty: () => ({ schemaVersion: 1, notes: {} }),
  validate: (r) => isObj(r.notes),
};

// ~80 bytes a record; 10 000 is under 1 MB. Past the cap, only attempts that
// a LATER attempt at the same item has superseded are dropped — mastery reads
// the latest attempt per item, so no status can change because of the cap.
export const EVIDENCE_CAP = 10_000;

export function compactEvidence(evidence, cap = EVIDENCE_CAP) {
  if (evidence.length <= cap) return evidence;
  const latestIndex = new Map();
  evidence.forEach((e, i) => latestIndex.set(`${e.c}|${e.item}`, i));
  let excess = evidence.length - cap;
  return evidence.filter((e, i) => {
    if (excess > 0 && latestIndex.get(`${e.c}|${e.item}`) !== i) {
      excess -= 1;
      return false;
    }
    return true;
  });
}

const learning = readVersioned(STORAGE_KEYS.learning, LEARNING);
const lessonRec = readVersioned(STORAGE_KEYS.lessons, LESSONS);
const noteRec = readVersioned(STORAGE_KEYS.notes, NOTES);

// Sources whose correct/incorrect answers schedule a review. Diagnostic
// answers are evidence for placement, but a competency isn't "due for
// review" until it has been studied.
const SCHEDULES_REVIEW = new Set(['checkpoint', 'practice', 'review', 'mixed']);

export const useLearningStore = create((set, get) => ({
  evidence: learning.evidence,
  cards: learning.cards,
  lessons: lessonRec.lessons,
  lastLesson: lessonRec.last,
  notes: noteRec.notes,

  /**
   * Record one answer as evidence.
   * { competency, item, ok, difficulty = 1, transfer = false, source,
   *   hinted, transferItem }
   *
   * `tr` (counts as transfer evidence for mastery) needs a transfer item
   * answered WITHOUT a hint. Since V4 two more facts are kept, so the
   * learning signals (src/lib/learningSignals.js) can tell them apart:
   * `x` — the item is a transfer item, hint or not; `h` — a hint was
   * opened before the first answer. Both are additive: older records lack
   * them and every reader treats absence as unknown.
   */
  record({ competency, item, ok, difficulty = 1, transfer = false, source = 'practice', hinted = false, transferItem = false }, now = Date.now()) {
    if (!competency || !item) return;
    const entry = {
      c: competency, item, ok: !!ok, d: difficulty,
      ...(transfer ? { tr: true } : {}), ...(transferItem ? { x: true } : {}), ...(hinted ? { h: true } : {}),
      s: source, at: now,
    };
    const evidence = compactEvidence([...get().evidence, entry]);
    const cards = SCHEDULES_REVIEW.has(source)
      ? { ...get().cards, [competency]: review(get().cards[competency], !!ok, now) }
      : get().cards;
    set({ evidence, cards });
    writeVersioned(STORAGE_KEYS.learning, { schemaVersion: LEARNING.version, evidence, cards });
  },

  openLesson(lessonId, now = Date.now()) {
    const prev = get().lessons[lessonId] ?? {};
    const lessons = { ...get().lessons, [lessonId]: { ...prev, opened: prev.opened ?? now, visited: now, sections: prev.sections ?? [] } };
    set({ lessons, lastLesson: lessonId });
    writeVersioned(STORAGE_KEYS.lessons, { schemaVersion: LESSONS.version, lessons, last: lessonId });
  },

  markSection(lessonId, section) {
    const prev = get().lessons[lessonId] ?? { sections: [] };
    if (prev.sections?.includes(section)) return;
    const lessons = { ...get().lessons, [lessonId]: { ...prev, sections: [...(prev.sections ?? []), section] } };
    set({ lessons });
    writeVersioned(STORAGE_KEYS.lessons, { schemaVersion: LESSONS.version, lessons, last: get().lastLesson });
  },

  /** A lesson is complete when its checkpoint has been answered — not when it was scrolled through. */
  completeLesson(lessonId, { correct, total }, now = Date.now()) {
    const prev = get().lessons[lessonId] ?? { sections: [] };
    const lessons = { ...get().lessons, [lessonId]: { ...prev, completed: now, checkpoint: { correct, total, at: now } } };
    set({ lessons });
    writeVersioned(STORAGE_KEYS.lessons, { schemaVersion: LESSONS.version, lessons, last: get().lastLesson });
  },

  saveNote(lessonId, text, now = Date.now()) {
    const notes = { ...get().notes };
    if (text.trim()) notes[lessonId] = { text, updated: now };
    else delete notes[lessonId];
    set({ notes });
    writeVersioned(STORAGE_KEYS.notes, { schemaVersion: NOTES.version, notes });
  },
}));
