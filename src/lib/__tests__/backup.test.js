import { describe, it, expect, vi } from 'vitest';
import { createBackup, validateBackup, restoreBackup, isAppKey, BACKUP_FORMAT } from '../backup.js';
import { QUARANTINE_KEY } from '../storage.js';

// Acceptance test 2 (docs/audits/TRACEABILITY_MATRIX.md): export, wipe,
// restore, and the result equals the original byte for byte.

const seed = () => {
  localStorage.setItem('bluman_sr_v1', JSON.stringify({ x_bar: { ef: 2.5, interval: 6, reps: 2 } }));
  localStorage.setItem('bluman_journal_v1', JSON.stringify([{ text: 'Σ(x−x̄)² — unicode survives' }]));
  localStorage.setItem('feynman_x_bar', JSON.stringify({ score: 0.8 }));
  localStorage.setItem('ml_mode_prefs_v1', JSON.stringify({ level: 'researcher', lang: 'en' }));
  localStorage.setItem(QUARANTINE_KEY, JSON.stringify({ bluman_quiz_v1: { raw: 'null', at: '2026-01-01' } }));
  localStorage.setItem('someone_elses_key', 'not ours');
};

const snapshot = () => Object.fromEntries(
  Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).map((k) => [k, localStorage.getItem(k)])
);

describe('backup', () => {
  it('owns app keys, the Feynman prefix and the quarantine — nothing else', () => {
    expect(isAppKey('bluman_sr_v1')).toBe(true);
    expect(isAppKey('feynman_x_bar')).toBe(true);
    expect(isAppKey(QUARANTINE_KEY)).toBe(true);
    expect(isAppKey('someone_elses_key')).toBe(false);
  });

  it('round-trips exactly: export → wipe → restore equals the original', () => {
    seed();
    const before = snapshot();
    const backup = JSON.parse(JSON.stringify(createBackup())); // as it would be after a file download
    for (const k of Object.keys(backup.data)) localStorage.removeItem(k);
    expect(restoreBackup(backup)).toEqual({ ok: true, restored: 5 });
    expect(snapshot()).toEqual(before);
  });

  it('removes app keys the backup lacks, and never touches foreign keys', () => {
    seed();
    const backup = createBackup();
    localStorage.setItem('bluman_errlog_v1', '[]'); // created after the backup
    restoreBackup(backup);
    expect(localStorage.getItem('bluman_errlog_v1')).toBeNull();
    expect(localStorage.getItem('someone_elses_key')).toBe('not ours');
  });

  it.each([
    ['not an object', 'hello'],
    ['wrong format', { format: 'other', version: 1, data: {} }],
    ['future version', { format: BACKUP_FORMAT, version: 99, data: {} }],
    ['missing data', { format: BACKUP_FORMAT, version: 1 }],
    ['foreign key', { format: BACKUP_FORMAT, version: 1, data: { evil: 'x' } }],
    ['non-string value', { format: BACKUP_FORMAT, version: 1, data: { bluman_sr_v1: { a: 1 } } }],
  ])('rejects %s without touching storage', (_, bad) => {
    seed();
    const before = snapshot();
    const res = restoreBackup(bad);
    expect(res.ok).toBe(false);
    expect(typeof res.error).toBe('string');
    expect(snapshot()).toEqual(before);
  });

  it('keeps the previous state if storage fills up mid-restore', () => {
    seed();
    const before = snapshot();
    const backup = createBackup();
    backup.data.bluman_quiz_v1 = JSON.stringify({ correct: 1, total: 2, best: 1 });
    const real = Storage.prototype.setItem;
    let calls = 0;
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (k, v) {
      calls += 1;
      if (calls === 3) throw new DOMException('full', 'QuotaExceededError');
      return real.call(this, k, v);
    });
    const res = restoreBackup(backup);
    spy.mockRestore();
    expect(res.ok).toBe(false);
    expect(snapshot()).toEqual(before);
  });

  it('validateBackup reports the keys it would restore', () => {
    seed();
    expect(validateBackup(createBackup()).keys).toHaveLength(5);
  });
});
