import { nodeById } from '../data/index.js';
import { STORAGE_KEYS } from '../data/storageKeys.js';
import { loadJSON, saveJSON } from './storage.js';
import { useErrorLogStore } from '../store/useErrorLogStore.js';

function makeId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  }
}

export function logError(entry) {
  const node = nodeById[entry.nodeId];
  const log = loadJSON(STORAGE_KEYS.errorLog, []);
  log.unshift({
    id: makeId(),
    nodeId: entry.nodeId,
    nodeName: node?.name || entry.nodeId,
    chapter: node?.ch || 0,
    date: new Date().toISOString().slice(0, 10),
    errorType: null,
    myAnswer: String(entry.myAnswer || '').slice(0, 80),
    correctAnswer: String(entry.correctAnswer || '').slice(0, 80),
    scenario: String(entry.scenario || '').slice(0, 160),
    note: '',
    resolved: false,
  });
  if (log.length > 200) log.length = 200;
  saveJSON(STORAGE_KEYS.errorLog, log);
  useErrorLogStore.setState({ errorLog: log });
}
