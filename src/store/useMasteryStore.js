import { create } from 'zustand';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

function readFeynmanScore(nodeId) {
  const data = loadJSON(STORAGE_KEYS.feynmanPrefix + nodeId, null);
  return data && data.score != null ? +data.score : 0;
}

export function computeNodeState(recallEntry, feynmanScore) {
  const streak = recallEntry?.streak || 0;
  const needsReview = !!recallEntry?.needsReview;
  const lastRecall = recallEntry?.lastDate || null;
  if (feynmanScore >= 0.71) return { state: 'gold', streak, lastRecall };
  if (streak >= 3) return { state: 'green', streak, lastRecall };
  if (streak >= 1) return { state: 'blue', streak, lastRecall };
  if (needsReview) return { state: 'red', streak, lastRecall };
  return { state: 'none', streak: 0, lastRecall: null };
}

export const useMasteryStore = create((set, get) => ({
  recallData: loadJSON(STORAGE_KEYS.recall, {}),

  getNodeState(nodeId) {
    const entry = get().recallData[nodeId];
    return computeNodeState(entry, readFeynmanScore(nodeId));
  },

  markRecalled(nodeId, correct) {
    set((s) => {
      const prev = s.recallData[nodeId] || { streak: 0, needsReview: false };
      const next = {
        ...prev,
        streak: correct ? (prev.streak || 0) + 1 : 0,
        needsReview: !correct,
        lastDate: new Date().toISOString().slice(0, 10),
      };
      const recallData = { ...s.recallData, [nodeId]: next };
      saveJSON(STORAGE_KEYS.recall, recallData);
      return { recallData };
    });
  },

  masteryProgress() {
    const { recallData } = get();
    const total = Object.keys(recallData).length;
    return total;
  },
}));
