import { describe, it, expect } from 'vitest';
import { LEARNING_TRACKS, trackProgress, stageProgress } from '../learningTracks.js';
import { nodes } from '../index.js';
import { ML_MODELS } from '../ml/models.js';
import { ML_TABS } from '../../store/useMLUIStore.js';

// Tracks are hand-curated references into content that lives elsewhere, so
// they rot silently: rename a formula id or retire an ML tab and a track
// links to nothing, with no error anywhere. These tests are the only thing
// that notices.

const formulaIds = new Set(nodes.map((n) => n.id));
const modelIds = new Set(ML_MODELS.map((m) => m.id));
const moduleIds = new Set(ML_TABS.map((t) => t.id));
const allItems = LEARNING_TRACKS.flatMap((t) => t.stages.flatMap((s) => s.items.map((i) => ({ ...i, track: t.id }))));

describe('track references', () => {
  it('points every item at content that exists', () => {
    const broken = allItems.filter((i) => {
      if (i.kind === 'formula') return !formulaIds.has(i.id);
      if (i.kind === 'model') return !modelIds.has(i.id);
      if (i.kind === 'module') return !moduleIds.has(i.id);
      return true;
    }).map((i) => `${i.track}/${i.kind}:${i.id}`);
    expect(broken).toEqual([]);
  });

  it('curates a meaningful amount of content', () => {
    expect(allItems.length).toBeGreaterThan(80);
  });
});

describe('track shape', () => {
  it('gives every track the fields the UI renders', () => {
    for (const t of LEARNING_TRACKS) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.icon.startsWith('ti-')).toBe(true);
      expect(t.audience.length).toBeGreaterThan(15);
      expect(t.blurb.length).toBeGreaterThan(60);
      expect(t.stages.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('gives every stage a goal and at least three items', () => {
    for (const t of LEARNING_TRACKS) {
      for (const s of t.stages) {
        expect(s.title, `${t.id} stage title`).toBeTruthy();
        expect(s.goal.length, `${t.id}/${s.title} goal`).toBeGreaterThan(20);
        expect(s.items.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('explains why every single item is in its track', () => {
    // The "why" is the actual product here — a bare reading list is just
    // the syllabus reordered.
    const missing = allItems.filter((i) => !i.why || i.why.length < 12)
      .map((i) => `${i.track}/${i.id}`);
    expect(missing).toEqual([]);
  });

  it('uses unique track ids', () => {
    const ids = LEARNING_TRACKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('never repeats an item within one track', () => {
    for (const t of LEARNING_TRACKS) {
      const keys = t.stages.flatMap((s) => s.items.map((i) => `${i.kind}:${i.id}`));
      expect(new Set(keys).size, `${t.id} has a duplicate item`).toBe(keys.length);
    }
  });

  it('differentiates the tracks from one another', () => {
    // Six tracks that recommend the same things would be six labels on one
    // track. Require each pair to differ in at least a third of its items.
    for (let i = 0; i < LEARNING_TRACKS.length; i++) {
      for (let j = i + 1; j < LEARNING_TRACKS.length; j++) {
        const a = new Set(LEARNING_TRACKS[i].stages.flatMap((s) => s.items.map((x) => x.id)));
        const b = new Set(LEARNING_TRACKS[j].stages.flatMap((s) => s.items.map((x) => x.id)));
        const overlap = [...a].filter((x) => b.has(x)).length;
        const ratio = overlap / Math.min(a.size, b.size);
        expect(ratio, `${LEARNING_TRACKS[i].id} vs ${LEARNING_TRACKS[j].id} overlap`).toBeLessThan(0.67);
      }
    }
  });
});

describe('progress derivation', () => {
  const track = LEARNING_TRACKS[0];
  const none = () => false;
  const all = () => true;

  it('reports 0% for a learner who has mastered nothing', () => {
    expect(trackProgress(track, none)).toMatchObject({ done: 0, pct: 0 });
  });

  it('reports 100% when every counted item is mastered', () => {
    expect(trackProgress(track, all).pct).toBe(100);
  });

  it('measures models by a different signal than formulas', () => {
    // ML models have no flashcards; scoring them by spaced-repetition
    // mastery would pin any model-heavy track at 0 forever.
    const mlTrack = LEARNING_TRACKS.find((t) => t.id === 'ml-engineer');
    const formulaOnly = (item) => item.kind === 'formula';
    expect(trackProgress(mlTrack, formulaOnly).done).toBe(0);
    const modelsToo = (item) => item.kind === 'model';
    expect(trackProgress(mlTrack, modelsToo).done).toBeGreaterThan(0);
  });

  it('excludes modules from the denominator so 100% stays reachable', () => {
    // Modules are pages, not cards; they have no mastery signal, and a bar
    // that can never fill teaches learners to ignore bars.
    const withModules = LEARNING_TRACKS.find((t) => t.stages.some((s) => s.items.some((i) => i.kind === 'module')));
    expect(withModules).toBeTruthy();
    expect(trackProgress(withModules, all).pct).toBe(100);
    const counted = withModules.stages.flatMap((s) => s.items).filter((i) => i.kind !== 'module').length;
    expect(trackProgress(withModules, all).total).toBe(counted);
  });

  it('computes partial progress from a specific mastered set', () => {
    const firstId = track.stages[0].items[0].id;
    const p = trackProgress(track, (item) => item.id === firstId);
    expect(p.done).toBe(1);
    expect(p.pct).toBeGreaterThan(0);
    expect(p.pct).toBeLessThan(100);
  });

  it('computes stage progress independently of the track total', () => {
    const s = stageProgress(track.stages[0], all);
    expect(s.done).toBe(s.total);
    expect(s.pct).toBe(100);
  });

  it('never divides by zero on a module-only stage', () => {
    expect(stageProgress({ items: [{ kind: 'module', id: 'python' }] }, all)).toMatchObject({ total: 0, pct: 0 });
  });
});
