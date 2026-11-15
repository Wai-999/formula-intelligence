import { describe, it, expect, beforeEach } from 'vitest';
import { readStudyPlan, useStudyPlanStore, cleanHabit } from '../useStudyPlanStore.js';
import { STORAGE_KEYS } from '../../data/storageKeys.js';
import { PREFERENCE_KEYS } from '../../lib/backup.js';

// The study plan is a preference (time box, transfer target): unknown or
// corrupt values fall back to defaults instead of breaking Home, and a
// progress reset keeps it.

describe('study plan preferences', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to no time box and SJSU when nothing is stored', () => {
    expect(readStudyPlan()).toEqual({ timebox: null, target: 'sjsu', habit: null });
  });

  it('ignores unknown or malformed stored values', () => {
    localStorage.setItem(STORAGE_KEYS.studyPlan, JSON.stringify({ timebox: '5', target: 'mit' }));
    expect(readStudyPlan()).toEqual({ timebox: null, target: 'sjsu', habit: null });
    localStorage.setItem(STORAGE_KEYS.studyPlan, '{not json');
    expect(readStudyPlan()).toEqual({ timebox: null, target: 'sjsu', habit: null });
  });

  it('saves a valid choice and refuses an invalid one', () => {
    useStudyPlanStore.getState().setTimebox('30-45');
    useStudyPlanStore.getState().setTarget('csueb');
    useStudyPlanStore.getState().setTarget('harvard');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.studyPlan))).toEqual({ timebox: '30-45', target: 'csueb', habit: null });
    expect(readStudyPlan()).toEqual({ timebox: '30-45', target: 'csueb', habit: null });
  });

  it('keeps a study habit: days, cue and time, cleaned on the way in', () => {
    useStudyPlanStore.setState({ habit: null });
    expect(useStudyPlanStore.getState().setHabit({ days: [5, 1, 3, 3, 9], cue: '  After dinner ', time: '19:30' }, 1000)).toBe(true);
    expect(readStudyPlan().habit).toEqual({ days: [1, 3, 5], cue: 'After dinner', time: '19:30', since: 1000 });
    // Changing the plan keeps the date it was first made.
    useStudyPlanStore.getState().setHabit({ days: [2], cue: '', time: '' }, 5000);
    expect(readStudyPlan().habit).toEqual({ days: [2], cue: '', time: '', since: 1000 });
    // A plan needs at least one day.
    expect(useStudyPlanStore.getState().setHabit({ days: [] })).toBe(false);
    useStudyPlanStore.getState().setHabit(null);
    expect(readStudyPlan().habit).toBeNull();
  });

  it('drops a malformed habit rather than breaking Home', () => {
    expect(cleanHabit({ days: 'mon' })).toBeNull();
    expect(cleanHabit({ days: [1], time: '25:00', cue: 42 })).toEqual({ days: [1], cue: '', time: '', since: null });
  });

  it('survives a progress reset, like the theme', () => {
    expect(PREFERENCE_KEYS.has(STORAGE_KEYS.studyPlan)).toBe(true);
  });
});
