import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useStudyResumeStore } from '../useStudyResumeStore.js';
import { useLearningStore } from '../useLearningStore.js';
import { useUIStore } from '../useUIStore.js';
import { STORAGE_KEYS } from '../../data/storageKeys.js';
import { QUARANTINE_KEY } from '../../lib/storage.js';
import { createBackup, restoreBackup, resetProgress } from '../../lib/backup.js';
import { assessAll } from '../../lib/mastery.js';
import { emptyRecord, withPin } from '../../lib/studyResume.js';

// The persistence contract of "Save my place" (docs/study-continuity/DATA_SAFETY.md):
// confirmed only when stored, never overwritten by automatic saves, and never
// touching answers, checkpoints, notes or reviews.

const KEY = STORAGE_KEYS.resume;
const NOW = Date.UTC(2026, 9, 27, 16, 12);
const slopeTry = { courseId: 'algebra-1', lessonId: 'a1-slope', sectionId: 'try', fraction: 0.2 };
const dotSee = { courseId: 'linear-algebra', lessonId: 'la-dot-product', sectionId: 'see', fraction: 0 };
const stored = () => JSON.parse(localStorage.getItem(KEY));

const resetStore = () => {
  useStudyResumeStore.setState({ pinned: null, current: null, recent: [], saveState: null, pinDirty: false, pendingResume: null, lastSession: null });
  useLearningStore.setState({ evidence: [], cards: {}, lessons: {}, lastLesson: null, notes: {} });
};

describe('useStudyResumeStore', () => {
  beforeEach(() => { localStorage.clear(); resetStore(); useUIStore.getState().goTo('home'); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('"Save my place" stores the lesson, step and position, and says so only because it was stored', () => {
    expect(useStudyResumeStore.getState().savePlace(slopeTry, NOW)).toBe(true);
    expect(stored().pinned).toMatchObject({ ...slopeTry, at: NOW, source: 'manual' });
    expect(stored().schemaVersion).toBe(1);
    expect(useStudyResumeStore.getState().saveState).toEqual({ ok: true, kind: 'pin', at: NOW });
  });

  it('refuses places that do not exist: a lesson not written, a lesson in another course, no step', () => {
    const { savePlace, autoSave } = useStudyResumeStore.getState();
    expect(savePlace({ ...slopeTry, lessonId: 'a1-not-written' }, NOW)).toBe(false);
    expect(savePlace({ ...slopeTry, courseId: 'calculus-1' }, NOW)).toBe(false);
    expect(autoSave({ ...slopeTry, sectionId: 'chapter-9' }, NOW)).toBe(false);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('automatic saves never replace the saved place', () => {
    const s = useStudyResumeStore.getState();
    s.savePlace(slopeTry, NOW);
    s.autoSave(dotSee, NOW + 1000);
    expect(stored().pinned.lessonId).toBe('a1-slope');
    expect(stored().current.lessonId).toBe('la-dot-product');
    expect(stored().recent.map((r) => r.courseId)).toEqual(['linear-algebra', 'algebra-1']);
  });

  it('does not rewrite storage for the same place (no write per scroll event)', () => {
    const s = useStudyResumeStore.getState();
    s.autoSave(slopeTry, NOW);
    const spy = vi.spyOn(Storage.prototype, 'setItem');
    s.autoSave({ ...slopeTry, fraction: 0.25 }, NOW + 500);
    expect(spy).not.toHaveBeenCalled();
    s.autoSave({ ...slopeTry, sectionId: 'use' }, NOW + 900);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('when the browser refuses to store', () => {
    beforeEach(() => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    });

    it('reports failure — never "saved" — and keeps the place for this visit', () => {
      expect(useStudyResumeStore.getState().savePlace(slopeTry, NOW)).toBe(false);
      const s = useStudyResumeStore.getState();
      expect(s.saveState).toEqual({ ok: false, kind: 'pin', at: NOW });
      expect(s.pinned.lessonId).toBe('a1-slope');
      expect(s.pinDirty).toBe(true);
    });

    it('a later automatic save does not drop that unstored pin', () => {
      useStudyResumeStore.getState().savePlace(slopeTry, NOW);
      useStudyResumeStore.getState().autoSave(dotSee, NOW + 1000);
      expect(useStudyResumeStore.getState().pinned.lessonId).toBe('a1-slope');
    });
  });

  it('an unstored pin is written by the next save that succeeds', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => { throw new DOMException('full', 'QuotaExceededError'); });
    useStudyResumeStore.getState().savePlace(slopeTry, NOW);
    expect(localStorage.getItem(KEY)).toBeNull();
    spy.mockRestore();
    useStudyResumeStore.getState().autoSave(dotSee, NOW + 1000);
    expect(stored().pinned.lessonId).toBe('a1-slope');
    expect(useStudyResumeStore.getState().pinDirty).toBe(false);
  });

  it('another tab’s newer saved place survives this tab’s automatic save', () => {
    useStudyResumeStore.getState().autoSave(slopeTry, NOW);
    // Another tab pins a different lesson; this tab has not heard about it yet.
    localStorage.setItem(KEY, JSON.stringify(withPin(emptyRecord(), { ...dotSee, at: NOW + 500, source: 'manual' })));
    useStudyResumeStore.getState().autoSave({ ...slopeTry, sectionId: 'use' }, NOW + 1000);
    expect(stored().pinned.lessonId).toBe('la-dot-product');
    expect(stored().current).toMatchObject({ lessonId: 'a1-slope', sectionId: 'use' });
    expect(useStudyResumeStore.getState().pinned.lessonId).toBe('la-dot-product'); // and this tab now agrees
  });

  it('picks up another tab’s writes when told storage changed', () => {
    localStorage.setItem(KEY, JSON.stringify(withPin(emptyRecord(), { ...dotSee, at: NOW, source: 'manual' })));
    useStudyResumeStore.getState().syncFromStorage();
    expect(useStudyResumeStore.getState().pinned.lessonId).toBe('la-dot-product');
  });

  it('a damaged record is quarantined (kept for recovery), and the app carries on with no saved place', () => {
    localStorage.setItem(KEY, '{"schemaVersion":1,"pinned":');
    useStudyResumeStore.getState().syncFromStorage();
    expect(useStudyResumeStore.getState().pinned).toBeNull();
    expect(JSON.parse(localStorage.getItem(QUARANTINE_KEY))[KEY].raw).toBe('{"schemaVersion":1,"pinned":');
  });

  it('a record from a newer version of the app is set aside, not overwritten in place', () => {
    localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 2, pinned: { future: true } }));
    useStudyResumeStore.getState().syncFromStorage();
    expect(useStudyResumeStore.getState().pinned).toBeNull();
    expect(JSON.parse(localStorage.getItem(QUARANTINE_KEY))[KEY].raw).toContain('"schemaVersion":2');
  });

  it('"Remove saved place" removes the pin and nothing else', () => {
    const learning = useLearningStore.getState();
    learning.record({ competency: 'alg.slope', item: 'a1-slope.p1', ok: true, source: 'practice' }, NOW);
    learning.completeLesson('a1-slope', { correct: 3, total: 3 }, NOW);
    learning.saveNote('a1-slope', 'rise over run', NOW);
    const { evidence, lessons, notes, cards } = useLearningStore.getState();
    const before = { evidence, lessons, notes, cards };
    useStudyResumeStore.getState().savePlace(slopeTry, NOW);
    expect(useStudyResumeStore.getState().removePin(NOW + 1)).toBe(true);
    expect(stored().pinned).toBeNull();
    expect(stored().current.lessonId).toBe('a1-slope');
    const after = useLearningStore.getState();
    expect({ evidence: after.evidence, lessons: after.lessons, notes: after.notes, cards: after.cards }).toEqual(before);
  });

  it('saving places never changes mastery', () => {
    const learning = useLearningStore.getState();
    learning.record({ competency: 'alg.slope', item: 'a1-slope.p1', ok: true, source: 'practice' }, NOW);
    const before = assessAll(useLearningStore.getState().evidence, NOW);
    useStudyResumeStore.getState().savePlace({ ...slopeTry, sectionId: 'check' }, NOW);
    useStudyResumeStore.getState().autoSave({ ...slopeTry, sectionId: 'check', fraction: 1 }, NOW + 1);
    expect(assessAll(useLearningStore.getState().evidence, NOW)).toEqual(before);
  });

  it('a resume request opens the lesson and is consumed once, by its own token only', () => {
    useStudyResumeStore.getState().requestResume({ ...slopeTry, at: NOW });
    const { pendingResume } = useStudyResumeStore.getState();
    expect(pendingResume).toMatchObject({ lessonId: 'a1-slope', sectionId: 'try', fraction: 0.2 });
    expect(useUIStore.getState()).toMatchObject({ page: 'learn/lesson', pageParams: { lessonId: 'a1-slope' } });
    useStudyResumeStore.getState().consumeResume(pendingResume.token + 1);
    expect(useStudyResumeStore.getState().pendingResume).not.toBeNull();
    useStudyResumeStore.getState().consumeResume(pendingResume.token);
    expect(useStudyResumeStore.getState().pendingResume).toBeNull();
  });

  it('"Finish study session" saves the place and shows the summary — and does not complete the lesson', () => {
    const ok = useStudyResumeStore.getState().finishSession({ loc: slopeTry, startedAt: NOW - 600_000, answered: 2 }, NOW);
    expect(ok).toBe(true);
    expect(stored().pinned).toMatchObject({ lessonId: 'a1-slope', sectionId: 'try' });
    expect(useStudyResumeStore.getState().lastSession).toMatchObject({ ok: true, answered: 2, finishedAt: NOW });
    expect(useUIStore.getState().page).toBe('learn/session');
    expect(useLearningStore.getState().lessons['a1-slope']?.completed).toBeUndefined();
  });
});

describe('saved places in backups and resets', () => {
  beforeEach(() => { localStorage.clear(); resetStore(); });

  it('a backup includes the saved places, and restoring it brings them back', () => {
    useStudyResumeStore.getState().savePlace(slopeTry, NOW);
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify({ schemaVersion: 1, notes: { 'a1-slope': { text: 'x', updated: NOW } } }));
    const backup = createBackup();
    expect(Object.keys(backup.data)).toContain(KEY);
    localStorage.clear();
    expect(restoreBackup(backup).ok).toBe(true);
    expect(stored().pinned.lessonId).toBe('a1-slope');
    expect(localStorage.getItem(STORAGE_KEYS.notes)).toContain('a1-slope');
  });

  it('an older backup without saved places restores everything it has, and leaves no stale place behind', () => {
    const legacy = { format: 'formula-intelligence-backup', version: 1, exportedAt: '2026-10-20T10:00:00.000Z', data: {
      [STORAGE_KEYS.lessons]: JSON.stringify({ schemaVersion: 1, lessons: { 'a1-slope': { opened: NOW, sections: [] } }, last: 'a1-slope' }),
    } };
    useStudyResumeStore.getState().savePlace(dotSee, NOW);
    expect(restoreBackup(legacy).ok).toBe(true);
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.lessons)).last).toBe('a1-slope');
  });

  it('“Reset progress” removes saved places with the rest of the learning record, and keeps appearance settings', () => {
    useStudyResumeStore.getState().savePlace(slopeTry, NOW);
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify('light'));
    const res = resetProgress();
    expect(res.ok).toBe(true);
    expect(res.before.data[KEY]).toBeTruthy(); // the undo file has them
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe(JSON.stringify('light'));
  });
});
