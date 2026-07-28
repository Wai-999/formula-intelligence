import { describe, it, expect, beforeEach } from 'vitest';
import { usePyLabStore, PY_LAB_LIMITS, STARTER } from '../usePyLabStore.js';
import { STORAGE_KEYS } from '../../data/storageKeys.js';

// This store holds code the learner wrote themselves — the one kind of data
// in the app that cannot be recomputed from anything else. Losing it is
// unrecoverable, so the destructive paths (cap eviction, delete-the-last-one)
// get more attention here than the happy path.

const reset = () => usePyLabStore.setState({
  notebooks: [{ id: 'a', name: 'Scratchpad', code: STARTER, updated: 1 }],
  activeId: 'a',
});

describe('usePyLabStore', () => {
  beforeEach(() => { localStorage.clear(); reset(); });

  it('always has an active notebook', () => {
    expect(usePyLabStore.getState().active()).toBeTruthy();
  });

  it('edits only the active notebook', () => {
    const { create, setCode } = usePyLabStore.getState();
    create('Second', '# second');
    setCode('# edited');
    const { notebooks, activeId } = usePyLabStore.getState();
    expect(notebooks.find((n) => n.id === activeId).code).toBe('# edited');
    expect(notebooks.find((n) => n.id === 'a').code).toBe(STARTER);
  });

  it('persists to localStorage so a refresh cannot lose work', () => {
    usePyLabStore.getState().setCode('# keep me');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.pyLab));
    expect(saved.notebooks[0].code).toBe('# keep me');
  });

  it('creates a notebook seeded with given code and focuses it', () => {
    const id = usePyLabStore.getState().create('From the Hub', 'import numpy');
    const s = usePyLabStore.getState();
    expect(s.activeId).toBe(id);
    expect(s.active().code).toBe('import numpy');
    expect(s.active().name).toBe('From the Hub');
  });

  it('caps the number of notebooks, evicting the OLDEST not the newest', () => {
    for (let i = 0; i < PY_LAB_LIMITS.MAX_NOTEBOOKS + 5; i++) {
      usePyLabStore.getState().create(`nb${i}`, `# ${i}`);
    }
    const s = usePyLabStore.getState();
    expect(s.notebooks.length).toBeLessThanOrEqual(PY_LAB_LIMITS.MAX_NOTEBOOKS);
    // The most recently created one must survive — it is the one in use.
    expect(s.notebooks.some((n) => n.id === s.activeId)).toBe(true);
    expect(s.active().name).toBe(`nb${PY_LAB_LIMITS.MAX_NOTEBOOKS + 4}`);
  });

  it('caps a single notebook\'s size rather than blowing the storage budget', () => {
    usePyLabStore.getState().setCode('x'.repeat(PY_LAB_LIMITS.MAX_CHARS + 5000));
    expect(usePyLabStore.getState().active().code.length).toBe(PY_LAB_LIMITS.MAX_CHARS);
  });

  it('recreates a scratchpad when the last notebook is deleted', () => {
    usePyLabStore.getState().remove('a');
    const s = usePyLabStore.getState();
    expect(s.notebooks).toHaveLength(1);
    expect(s.active()).toBeTruthy();
    expect(s.active().code).toBe(STARTER);
  });

  it('moves focus off a deleted notebook', () => {
    const id = usePyLabStore.getState().create('Doomed', '# x');
    usePyLabStore.getState().remove(id);
    const s = usePyLabStore.getState();
    expect(s.activeId).not.toBe(id);
    expect(s.notebooks.some((n) => n.id === s.activeId)).toBe(true);
  });

  it('ignores selecting a notebook that does not exist', () => {
    usePyLabStore.getState().select('nope');
    expect(usePyLabStore.getState().activeId).toBe('a');
  });

  it('renames, trimming to a sane length and never to empty', () => {
    const { rename } = usePyLabStore.getState();
    rename('a', '');
    expect(usePyLabStore.getState().notebooks[0].name).toBe('Untitled');
    rename('a', 'y'.repeat(200));
    expect(usePyLabStore.getState().notebooks[0].name.length).toBe(60);
  });

  it('gives new notebooks unique ids', () => {
    const ids = new Set();
    for (let i = 0; i < 15; i++) ids.add(usePyLabStore.getState().create(`n${i}`, '#'));
    expect(ids.size).toBe(15);
  });

  it('ships a starter that demonstrates the runtime rather than an empty box', () => {
    expect(STARTER).toMatch(/import numpy/);
    expect(STARTER).toMatch(/matplotlib/);
  });
});
