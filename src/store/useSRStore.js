import { create } from 'zustand';
import { nodes } from '../data/index.js';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON, removeKey } from '../lib/storage.js';

const DEFAULT_CARD = { ef: 2.5, interval: 1, reps: 0, due: 0, rating: 0, reviews: 0 };

export function getMasteryLevel(card) {
  if (card.reviews === 0) return 0;
  if (card.rating === 1) return 1;
  if (card.interval < 3) return 2;
  return 3;
}

export function isDue(card) {
  return card.reviews === 0 || card.due <= Date.now();
}

export const useSRStore = create((set, get) => ({
  srData: loadJSON(STORAGE_KEYS.spacedRepetition, {}),
  quizStats: loadJSON(STORAGE_KEYS.quiz, { correct: 0, total: 0, best: 0 }),
  sessions: loadJSON(STORAGE_KEYS.sessions, []),

  getCardData(id) {
    return get().srData[id] || DEFAULT_CARD;
  },

  getDueCount() {
    const { srData } = get();
    return nodes.filter((n) => isDue(srData[n.id] || DEFAULT_CARD)).length;
  },

  getMasteredCount() {
    const { srData } = get();
    return nodes.filter((n) => getMasteryLevel(srData[n.id] || DEFAULT_CARD) === 3).length;
  },

  rateCard(id, rating) {
    const d = { ...(get().srData[id] || DEFAULT_CARD) };
    d.rating = rating;
    d.reviews = (d.reviews || 0) + 1;
    if (rating === 1) {
      d.interval = 1;
      d.reps = 0;
    } else if (rating === 2) {
      d.interval = Math.max(1, Math.round(d.interval * d.ef * 0.8));
      d.reps++;
    } else {
      d.interval = Math.round(d.interval * d.ef);
      d.ef = Math.min(2.5, d.ef + 0.1);
      d.reps++;
    }
    d.ef = Math.max(1.3, d.ef);
    d.due = Date.now() + d.interval * 86400000;

    const srData = { ...get().srData, [id]: d };
    saveJSON(STORAGE_KEYS.spacedRepetition, srData);
    set({ srData });
  },

  resetAll() {
    removeKey(STORAGE_KEYS.spacedRepetition);
    set({ srData: {} });
  },

  pushSession(entry) {
    const sessions = [...get().sessions, entry].slice(-10);
    saveJSON(STORAGE_KEYS.sessions, sessions);
    set({ sessions });
  },

  recordQuizAnswer(isCorrect, bestStreak) {
    const qs = { ...get().quizStats };
    qs.correct += isCorrect ? 1 : 0;
    qs.total += 1;
    qs.best = Math.max(qs.best, bestStreak);
    saveJSON(STORAGE_KEYS.quiz, qs);
    set({ quizStats: qs });
  },
}));
