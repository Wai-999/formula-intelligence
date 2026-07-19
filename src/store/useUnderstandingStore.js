import { create } from 'zustand';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { STORAGE_KEYS } from '../data/storageKeys.js';

const KEY = STORAGE_KEYS.mlUnderstanding;
const saved = loadJSON(KEY, { layersByNode: {}, domainsVisited: [], predictions: {} });

function persist(s) {
  saveJSON(KEY, { layersByNode: s.layersByNode, domainsVisited: s.domainsVisited, predictions: s.predictions });
}

// Dreyfus-stage thresholds, per docs/research/ML-Mode-Pedagogy-Research.md
// §4.3 — driven by how many nodes a learner has carried all the way to
// Critical Frontier (layer 4), not time-on-page or pages visited. Numbers
// are a documented, tunable heuristic (there are ~60 Depth-Ladder nodes
// across the built-out mode: 32 Model Map models + 7 pipeline stages + ~20
// domain-lab drivers), not a figure from the research doc itself.
const STAGE_THRESHOLDS = [
  { stage: 'expert', minNodesAtFrontier: 15 },
  { stage: 'proficient', minNodesAtFrontier: 5 },
  { stage: 'competent', minNodesAtFrontier: 1 },
];

export const DREYFUS_STAGES = ['novice', 'advancedBeginner', 'competent', 'proficient', 'expert'];

function computeStage(layersByNode) {
  const nodeIds = Object.keys(layersByNode);
  if (nodeIds.length === 0) return 'novice';
  const nodesAtFrontier = nodeIds.filter((id) => layersByNode[id]?.includes('criticalFrontier')).length;
  for (const { stage, minNodesAtFrontier } of STAGE_THRESHOLDS) {
    if (nodesAtFrontier >= minNodesAtFrontier) return stage;
  }
  return 'advancedBeginner';
}

export const useUnderstandingStore = create((set, get) => ({
  layersByNode: saved.layersByNode,
  domainsVisited: saved.domainsVisited,
  predictions: saved.predictions,

  markLayerEngaged(nodeId, layer) {
    set((s) => {
      const existing = s.layersByNode[nodeId] || [];
      if (existing.includes(layer)) return s;
      const next = { ...s, layersByNode: { ...s.layersByNode, [nodeId]: [...existing, layer] } };
      persist(next);
      return { layersByNode: next.layersByNode };
    });
  },

  markDomainVisited(domainId) {
    set((s) => {
      if (s.domainsVisited.includes(domainId)) return s;
      const next = { ...s, domainsVisited: [...s.domainsVisited, domainId] };
      persist(next);
      return { domainsVisited: next.domainsVisited };
    });
  },

  // predictId is a stable string identifying one PredictGate instance (a
  // model node's mechanism, a specific driver on a specific domain, etc.) —
  // recorded once so a returning session shows the resolved compare-strip
  // instead of re-asking the same question. Re-testing the same judgment
  // later is what Mixed-Review (D.4) is for, not repeated friction here.
  recordPrediction(predictId, guessIndex, correct) {
    set((s) => {
      const next = { ...s, predictions: { ...s.predictions, [predictId]: { guessIndex, correct } } };
      persist(next);
      return { predictions: next.predictions };
    });
  },

  getPrediction(predictId) {
    return get().predictions[predictId] || null;
  },

  getStage() {
    return computeStage(get().layersByNode);
  },

  isPastCompetent() {
    const stage = computeStage(get().layersByNode);
    return stage === 'competent' || stage === 'proficient' || stage === 'expert';
  },

  hasEngagedLayer(nodeId, layer) {
    return (get().layersByNode[nodeId] || []).includes(layer);
  },
}));
