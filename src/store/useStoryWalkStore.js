import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

export const useStoryWalkStore = create((set, get) => ({
  progress: loadJSON(STORAGE_KEYS.storyWalk, {}),

  getProgress(id) {
    return get().progress[id] || { currentStep: 0, decisionsCorrect: 0, hintsUsed: 0 };
  },

  setProgress(id, data) {
    const progress = { ...get().progress, [id]: { ...get().getProgress(id), ...data } };
    saveJSON(STORAGE_KEYS.storyWalk, progress);
    set({ progress });
  },
}));
