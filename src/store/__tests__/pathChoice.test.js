import { describe, it, expect, beforeEach, vi } from 'vitest';
import { STORAGE_KEYS } from '../../data/storageKeys.js';
import { QUARANTINE_KEY } from '../../lib/storage.js';

// The learning path a learner follows lives in the diagnostic record, beside
// the starting point (src/store/useDiagnosticStore.js): kept, backed up, and
// never a reason to lose the placement attempts stored with it.

const KEY = STORAGE_KEYS.diagnostic;
const attempt = { id: 'a1', finishedAt: 1, result: { course: 'algebra-1' } };
const fresh = async () => {
  vi.resetModules();
  return (await import('../useDiagnosticStore.js')).useDiagnosticStore;
};
const stored = () => JSON.parse(localStorage.getItem(KEY));

describe('the chosen learning path', () => {
  beforeEach(() => { localStorage.clear(); });

  it('is stored with the rest of the record and survives a reload', async () => {
    let store = await fresh();
    store.getState().saveAttempt(attempt);
    store.getState().setPlacement('algebra-1', 'diagnostic', 'a1', 5);
    store.getState().choosePath('track.business', 10);
    expect(stored()).toMatchObject({ schemaVersion: 1, attempts: [attempt], placement: { course: 'algebra-1' }, path: { id: 'track.business', at: 10 } });
    store = await fresh();
    expect(store.getState().path).toEqual({ id: 'track.business', at: 10 });
    store.getState().choosePath(null);
    expect(stored().path).toBeNull();
  });

  it('an older record without a path loads unchanged, following the default path', async () => {
    localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 1, firstRun: 'diagnostic', attempts: [attempt], placement: null }));
    const store = await fresh();
    expect(store.getState().path).toBeNull();
    expect(store.getState().attempts).toEqual([attempt]);
  });

  it('a malformed path is dropped; the attempts are not set aside for it', async () => {
    localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 1, firstRun: null, attempts: [attempt], placement: null, path: 'track.business' }));
    const store = await fresh();
    expect(store.getState().path).toBeNull();
    expect(store.getState().attempts).toEqual([attempt]);
    expect(localStorage.getItem(QUARANTINE_KEY)).toBeNull();
  });

  it('is part of a backup, and comes back with a restore', async () => {
    const store = await fresh();
    store.getState().choosePath('track.finance', 20);
    const { createBackup, restoreBackup } = await import('../../lib/backup.js');
    const backup = createBackup(new Date(30));
    expect(JSON.stringify(backup)).toContain('track.finance');
    localStorage.clear();
    restoreBackup(backup);
    expect(stored().path).toEqual({ id: 'track.finance', at: 20 });
  });
});
