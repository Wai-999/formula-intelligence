import { STORAGE_KEYS } from '../data/storageKeys.js';
import { QUARANTINE_KEY } from './storage.js';

// Learner-controlled backup and restore (spec §11; MIGRATION_RISKS R-03).
// This exists BEFORE any schema change on purpose: it is the rollback path
// for learner data, so every later migration can be undone by the learner.
//
// Values are exported as the raw stored strings, not re-serialised objects,
// so a restore is byte-for-byte identical to what was saved — the only
// honest meaning of "restored exactly" (acceptance test 2).

export const BACKUP_FORMAT = 'formula-intelligence-backup';
export const BACKUP_VERSION = 1;

const PREFIX_KEYS = [STORAGE_KEYS.feynmanPrefix];
const EXACT_KEYS = new Set([
  ...Object.entries(STORAGE_KEYS).filter(([name]) => name !== 'feynmanPrefix').map(([, k]) => k),
  QUARANTINE_KEY,
]);

/** True for every key this app owns — and nothing else on the origin. */
export function isAppKey(key) {
  return EXACT_KEYS.has(key) || PREFIX_KEYS.some((p) => key.startsWith(p));
}

function appKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && isAppKey(k)) keys.push(k);
  }
  return keys.sort();
}

export function createBackup(now = new Date()) {
  const data = {};
  for (const k of appKeys()) data[k] = localStorage.getItem(k);
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: now.toISOString(), data };
}

/**
 * Validate a parsed backup without touching storage. Returns
 * { ok: true, keys } or { ok: false, error } with a learner-readable reason.
 */
export function validateBackup(backup) {
  if (!backup || typeof backup !== 'object' || Array.isArray(backup)) {
    return { ok: false, error: 'This file is not a Formula Intelligence backup.' };
  }
  if (backup.format !== BACKUP_FORMAT) {
    return { ok: false, error: 'This file is not a Formula Intelligence backup.' };
  }
  if (typeof backup.version !== 'number' || backup.version > BACKUP_VERSION) {
    return { ok: false, error: 'This backup was made by a newer version of the app and cannot be restored here.' };
  }
  const data = backup.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'This backup is damaged: it has no data section.' };
  }
  const keys = Object.keys(data);
  const foreign = keys.filter((k) => !isAppKey(k));
  if (foreign.length) {
    return { ok: false, error: `This backup contains entries this app does not own (${foreign.slice(0, 3).join(', ')}).` };
  }
  const nonString = keys.filter((k) => typeof data[k] !== 'string');
  if (nonString.length) {
    return { ok: false, error: 'This backup is damaged: some entries are not in the expected format.' };
  }
  return { ok: true, keys };
}

/**
 * Replace this app's stored state with the backup's. Only call after the
 * learner has confirmed. Keys the app owns but the backup lacks are removed,
 * so the result equals the backup exactly rather than a merge of the two.
 */
export function restoreBackup(backup) {
  const check = validateBackup(backup);
  if (!check.ok) return check;
  // Snapshot first: a write can fail partway (storage quota), and a restore
  // that leaves neither the old state nor the new one would be the exact
  // data loss this feature exists to prevent.
  const before = createBackup();
  try {
    for (const k of appKeys()) localStorage.removeItem(k);
    for (const k of check.keys) localStorage.setItem(k, backup.data[k]);
  } catch {
    try {
      for (const k of appKeys()) localStorage.removeItem(k);
      for (const [k, v] of Object.entries(before.data)) localStorage.setItem(k, v);
    } catch { /* nothing further can be done without storage */ }
    return { ok: false, error: 'There was not enough browser storage to restore this backup. Your previous progress was kept.' };
  }
  return { ok: true, restored: check.keys.length };
}

export function backupFilename(now = new Date()) {
  return `formula-intelligence-backup-${now.toISOString().slice(0, 10)}.json`;
}
