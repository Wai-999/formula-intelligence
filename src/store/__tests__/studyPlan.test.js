import { describe, it, expect, beforeEach } from 'vitest';
import { readStudyPlan, useStudyPlanStore } from '../useStudyPlanStore.js';
import { STORAGE_KEYS } from '../../data/storageKeys.js';
import { PREFERENCE_KEYS } from '../../lib/backup.js';

// The study plan is a preference (time box, transfer target): unknown or
// corrupt values fall back to defaults instead of breaking Home, and a
// progress reset keeps it.

describe('study plan preferences', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to no time box and SJSU when nothing is stored', () => {
    expect(readStudyPlan()).toEqual({ timebox: null, target: 'sjsu' });
  });

  it('ignores unknown or malformed stored values', () => {
    localStorage.setItem(STORAGE_KEYS.studyPlan, JSON.stringify({ timebox: '5', target: 'mit' }));
    expect(readStudyPlan()).toEqual({ timebox: null, target: 'sjsu' });
    localStorage.setItem(STORAGE_KEYS.studyPlan, '{not json');
    expect(readStudyPlan()).toEqual({ timebox: null, target: 'sjsu' });
  });

  it('saves a valid choice and refuses an invalid one', () => {
    useStudyPlanStore.getState().setTimebox('30-45');
    useStudyPlanStore.getState().setTarget('csueb');
    useStudyPlanStore.getState().setTarget('harvard');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.studyPlan))).toEqual({ timebox: '30-45', target: 'csueb' });
    expect(readStudyPlan()).toEqual({ timebox: '30-45', target: 'csueb' });
  });

  it('survives a progress reset, like the theme', () => {
    expect(PREFERENCE_KEYS.has(STORAGE_KEYS.studyPlan)).toBe(true);
  });
});
