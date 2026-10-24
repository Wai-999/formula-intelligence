import { describe, it, expect } from 'vitest';
import { resolveTab, useUIStore, TABS, RETIRED_ML_TABS, DEFAULT_TAB } from '../useUIStore.js';
import { ML_TABS } from '../useMLUIStore.js';

// Acceptance test 1 groundwork (docs/audits/TRACEABILITY_MATRIX.md): no tab
// id, however it arrives, may leave the app pointing at nothing.

describe('resolveTab', () => {
  it('passes every live tab through unchanged', () => {
    for (const t of TABS) expect(resolveTab('stats', t.id).tab).toBe(t.id);
    for (const t of ML_TABS) expect(resolveTab('ml', t.id).tab).toBe(t.id);
  });

  it('sends unknown ids to each mode\'s default', () => {
    expect(resolveTab('ml', 'doesnotexist').tab).toBe(DEFAULT_TAB.ml);
    expect(resolveTab('stats', 'nope').tab).toBe(DEFAULT_TAB.stats);
    expect(resolveTab('ml', undefined).tab).toBe(DEFAULT_TAB.ml);
  });

  it('does not treat Object.prototype names as retired tabs', () => {
    expect(resolveTab('ml', 'constructor')).toEqual({ tab: DEFAULT_TAB.ml, lesson: null, notice: null });
  });

  it('maps every retired tab to a live destination with an explanation', () => {
    for (const [id, dest] of Object.entries(RETIRED_ML_TABS)) {
      const r = resolveTab('ml', id);
      expect(ML_TABS.some((t) => t.id === r.tab), `${id} -> ${r.tab}`).toBe(true);
      expect(r.notice, id).toBeTruthy();
      expect(r.tab).toBe(dest.tab);
    }
  });

  it('a retired id is never also a live tab', () => {
    for (const id of Object.keys(RETIRED_ML_TABS)) expect(ML_TABS.some((t) => t.id === id)).toBe(false);
  });
});

describe('store setters resolve before storing', () => {
  it('setMLActiveTab corrects an unknown id', () => {
    useUIStore.getState().setMLActiveTab('bridge');
    expect(useUIStore.getState().mlActiveTab).toBe(RETIRED_ML_TABS.bridge.tab);
  });

  it('setActiveTab corrects an unknown id', () => {
    useUIStore.getState().setActiveTab('nope');
    expect(useUIStore.getState().activeTab).toBe(DEFAULT_TAB.stats);
  });

  it('navigateToLinkedConcept resolves the tab in both the state and the link', () => {
    useUIStore.getState().navigateToLinkedConcept('ml', 'doesnotexist', { x: 1 });
    const s = useUIStore.getState();
    expect(s.mlActiveTab).toBe(DEFAULT_TAB.ml);
    expect(s.linkedConcept).toEqual({ tab: DEFAULT_TAB.ml, payload: { x: 1 } });
  });
});
