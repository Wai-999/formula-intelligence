import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

function todayScore() {
  const today = new Date().toISOString().slice(0, 10);
  const stored = loadJSON(STORAGE_KEYS.practiceScore, null);
  if (stored && stored.date === today) return stored;
  return { date: today, correct: 0, total: 0 };
}

export const usePracticeStore = create((set) => ({
  score: todayScore(),

  recordAnswer(isCorrect) {
    const score = { ...todayScore() };
    score.total += 1;
    if (isCorrect) score.correct += 1;
    saveJSON(STORAGE_KEYS.practiceScore, score);
    set({ score });
  },
}));
