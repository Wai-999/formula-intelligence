import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

function loadTarget() {
  try {
    return localStorage.getItem(STORAGE_KEYS.journalTarget) || '';
  } catch {
    return '';
  }
}

function saveTarget(v) {
  try {
    localStorage.setItem(STORAGE_KEYS.journalTarget, v || '');
  } catch {
    /* localStorage unavailable */
  }
}

export function calcStreak(entries) {
  if (!entries || !entries.length) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  const cursor = new Date(today);
  for (let i = 0; i < 365; i++) {
    const ds = cursor.toISOString().slice(0, 10);
    if (dates.has(ds)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}

export const useJournalStore = create((set, get) => ({
  entries: loadJSON(STORAGE_KEYS.journal, []),
  targetDate: loadTarget(),

  saveEntry(entry) {
    const today = new Date().toISOString().slice(0, 10);
    const entries = get().entries.slice();
    const existingIdx = entries.findIndex((e) => e.date === today);
    const full = { ...entry, date: today };
    if (existingIdx >= 0) entries[existingIdx] = full;
    else entries.unshift(full);
    const trimmed = entries.slice(0, 90);
    saveJSON(STORAGE_KEYS.journal, trimmed);
    set({ entries: trimmed });
  },

  setTargetDate(v) {
    saveTarget(v);
    set({ targetDate: v || '' });
  },
}));
