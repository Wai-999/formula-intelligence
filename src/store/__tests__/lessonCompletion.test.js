import { describe, it, expect, beforeEach } from 'vitest';
import { useLearningStore } from '../useLearningStore.js';
import { STORAGE_KEYS } from '../../data/storageKeys.js';

// A lesson is finished when its checkpoint is answered or when the learner
// marks it finished (src/store/useLearningStore.js). The first finish is
// kept, so answering an old checkpoint again never moves "where you are"
// back (src/lib/learningPath.js anchorCourse).

const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.lessons)).lessons;

describe('finishing a lesson', () => {
  beforeEach(() => {
    localStorage.clear();
    useLearningStore.setState({ evidence: [], cards: {}, lessons: {}, lastLesson: null, notes: {} });
  });

  it('marking a lesson finished records it as finished, marked, without a checkpoint', () => {
    useLearningStore.getState().markFinished('a1-slope', 1000);
    expect(useLearningStore.getState().lessons['a1-slope']).toMatchObject({ completed: 1000, marked: true });
    expect(useLearningStore.getState().lessons['a1-slope'].checkpoint).toBeUndefined();
    expect(stored()['a1-slope'].marked).toBe(true);
  });

  it('marking an already finished lesson changes nothing', () => {
    useLearningStore.getState().completeLesson('a1-slope', { correct: 2, total: 3 }, 1000);
    useLearningStore.getState().markFinished('a1-slope', 2000);
    expect(useLearningStore.getState().lessons['a1-slope']).toMatchObject({ completed: 1000, checkpoint: { correct: 2, total: 3 } });
    expect(useLearningStore.getState().lessons['a1-slope'].marked).toBeUndefined();
  });

  it('answering the checkpoint later replaces the mark and keeps the first finish', () => {
    useLearningStore.getState().markFinished('a1-slope', 1000);
    useLearningStore.getState().completeLesson('a1-slope', { correct: 3, total: 3 }, 5000);
    const r = useLearningStore.getState().lessons['a1-slope'];
    expect(r.completed).toBe(1000);
    expect(r.marked).toBeUndefined();
    expect(r.checkpoint).toEqual({ correct: 3, total: 3, at: 5000 });
  });

  it('answering a checkpoint again keeps the first finish and records the latest answer', () => {
    useLearningStore.getState().completeLesson('a1-slope', { correct: 1, total: 3 }, 1000);
    useLearningStore.getState().completeLesson('a1-slope', { correct: 3, total: 3 }, 9000);
    expect(useLearningStore.getState().lessons['a1-slope']).toMatchObject({ completed: 1000, checkpoint: { correct: 3, total: 3, at: 9000 } });
  });
});
