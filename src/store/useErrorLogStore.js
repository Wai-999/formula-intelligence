import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

export const useErrorLogStore = create((set, get) => ({
  errorLog: loadJSON(STORAGE_KEYS.errorLog, []),

  refresh() {
    set({ errorLog: loadJSON(STORAGE_KEYS.errorLog, []) });
  },

  setErrorType(id, type) {
    const log = get().errorLog.map((e) =>
      e.id === id ? { ...e, errorType: e.errorType === type ? null : type } : e
    );
    saveJSON(STORAGE_KEYS.errorLog, log);
    set({ errorLog: log });
  },

  setNote(id, note) {
    const log = get().errorLog.map((e) => (e.id === id ? { ...e, note } : e));
    saveJSON(STORAGE_KEYS.errorLog, log);
    set({ errorLog: log });
  },

  resolve(id) {
    const log = get().errorLog.map((e) => (e.id === id ? { ...e, resolved: !e.resolved } : e));
    saveJSON(STORAGE_KEYS.errorLog, log);
    set({ errorLog: log });
  },

  clearAll() {
    saveJSON(STORAGE_KEYS.errorLog, []);
    set({ errorLog: [] });
  },
}));
