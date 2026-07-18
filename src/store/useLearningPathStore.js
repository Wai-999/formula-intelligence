import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

export const useLearningPathStore = create((set, get) => ({
  mastery: loadJSON(STORAGE_KEYS.learningPath, {}),

  getState(id) {
    return get().mastery[id] || 'ns';
  },

  setState(id, state) {
    const mastery = { ...get().mastery, [id]: state };
    saveJSON(STORAGE_KEYS.learningPath, mastery);
    set({ mastery });
  },
}));
